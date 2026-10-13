import { createHash } from "node:crypto";
import { stat, mkdir, writeFile, readFile, rename } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import OSS from "ali-oss";
import syncConfig from "../src/data/oss-sync.json" with { type: "json" };
import { walk } from "./walk.mjs";

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const isPull = args.includes("--pull");
const isForce = args.includes("--force");

// How many objects to transfer at once. The bucket tolerates far more, but a
// small pool keeps memory flat (each buffered PDF is tens of MB) and still
// removes the round-trip latency that serial transfers were paying.
const CONCURRENCY = 6;

const projectRoot = join(import.meta.dirname, "..");

const {
  OSS_REGION,
  OSS_ACCESS_KEY_ID,
  OSS_ACCESS_KEY_SECRET,
  OSS_BUCKET,
  OSS_ROOT_PREFIX,
  PUBLIC_ASSETS_BASE_URL,
} = process.env;

const rootPrefix = (OSS_ROOT_PREFIX ?? syncConfig.rootPrefix ?? "").replace(/^\/+|\/+$/g, "");

const MIME_MAP = {
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".gz": "application/gzip",
  ".tgz": "application/gzip",
  ".tar": "application/x-tar",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".csv": "text/csv; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  return MIME_MAP[ext] || "application/octet-stream";
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Runs `fn` over `items` with at most `limit` in flight, preserving result
 * order. A rejection stops the run and propagates, so a failed transfer fails
 * the whole command rather than being swallowed.
 */
async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

/** The `walk` filter for one configured directory: its patterns and OS junk. */
function dirFilter(dirConfig) {
  return (_filePath, name) => {
    if (name === ".gitkeep" || name === ".DS_Store") return false;
    if (dirConfig.patterns && dirConfig.patterns.length > 0) return dirConfig.patterns.some((pattern) => name.endsWith(pattern));
    return true;
  };
}

/**
 * Every object under a remote prefix, keyed by object name.
 *
 * One paginated listing replaces the per-file HEAD this used to issue: the size
 * listing gives us the size and ETag; the custom SHA-256 metadata is checked with
 * HEAD only for same-sized objects.
 */
async function listRemoteObjects(client, prefix) {
  const objects = new Map();
  let marker;
  do {
    const result = await client.list({ prefix, marker, "max-keys": 100 });
    for (const object of result.objects || []) objects.set(object.name, { size: Number(object.size), etag: object.etag });
    marker = result.nextMarker;
  } while (marker);
  return objects;
}

const sha256File = async (filePath) => createHash("sha256").update(await readFile(filePath)).digest("hex");

const remoteHash = async (client, key) => {
  const result = await client.head(key);
  return result.res?.headers?.["x-oss-meta-sha256"];
};

async function getClient() {
  if (!OSS_REGION || !OSS_ACCESS_KEY_ID || !OSS_ACCESS_KEY_SECRET || !OSS_BUCKET) {
    if (isDryRun) {
      console.warn("⚠️  未配置 OSS 密钥凭证，将仅执行本地目录匹配与 MIME 推导预览（不连接远端 OSS）\n");
      return null;
    }
    console.error("❌ 错误: 缺少阿里云 OSS 凭证配置！");
    console.error("   请在项目根目录的 .env 文件中配置以下变量：");
    console.error("   - OSS_REGION (例如: oss-cn-hangzhou)");
    console.error("   - OSS_ACCESS_KEY_ID");
    console.error("   - OSS_ACCESS_KEY_SECRET");
    console.error("   - OSS_BUCKET");
    console.error("\n   参考模板: .env.example");
    process.exit(1);
  }

  return new OSS({
    region: OSS_REGION,
    accessKeyId: OSS_ACCESS_KEY_ID,
    accessKeySecret: OSS_ACCESS_KEY_SECRET,
    bucket: OSS_BUCKET,
    secure: true,
  });
}

async function uploadSync() {
  console.log(`\n📦 准备执行【静态资产上传与同步】${isDryRun ? " (演练模式 DRY-RUN)" : ""}`);
  const client = await getClient();

  const bucketDisplay = OSS_BUCKET ? `${OSS_BUCKET} (${OSS_REGION})` : "未配置 (本地预览)";
  const remoteBase = PUBLIC_ASSETS_BASE_URL || syncConfig.remoteBaseUrl || (OSS_BUCKET ? `https://${OSS_BUCKET}.${OSS_REGION}.aliyuncs.com` : "未配置");
  console.log(`🌐 目标 Bucket: ${bucketDisplay}`);
  console.log(`🔗 外部访问基础 URL: ${remoteBase}\n`);

  let totalUploaded = 0;
  let totalSkipped = 0;
  let totalBytes = 0;

  for (const dirConfig of syncConfig.directories) {
    const localDir = join(projectRoot, dirConfig.local);
    const remotePrefix = [rootPrefix, dirConfig.remote.replace(/^\/+|\/+$/g, "")].filter(Boolean).join("/");

    console.log(`📂 [${dirConfig.name}] 扫描本地目录: ${dirConfig.local} -> 远端: ${remotePrefix}/`);

    const files = await walk(localDir, { filter: dirFilter(dirConfig) });
    if (files.length === 0) {
      console.log("   └─ 无符合条件的文件。\n");
      continue;
    }

    // Without a client (dry-run and no credentials) there is nothing to compare
    // against, so every file is reported as pending. The original per-file HEAD
    // path is gone: the remote size map is built once, up front.
    const remoteObjects = client ? await listRemoteObjects(client, `${remotePrefix}/`) : null;

    // Dry-run performs no I/O, so it runs at concurrency 1 to keep the preview
    // output in directory order.
    const concurrency = isDryRun ? 1 : CONCURRENCY;

    await mapWithConcurrency(files, concurrency, async (filePath) => {
      const relPath = relative(localDir, filePath);
      const ossKey = `${remotePrefix}/${relPath}`.replace(/\\/g, "/");
      const fileStat = await stat(filePath);
      const mime = getMimeType(filePath);

      const remoteObject = remoteObjects?.get(ossKey);
      const localHash = await sha256File(filePath);
      const remoteHashValue = remoteObject && remoteObject.size === fileStat.size ? await remoteHash(client, ossKey) : undefined;
      const needsUpload = isForce || !remoteObject || remoteObject.size !== fileStat.size || remoteHashValue !== localHash;
      if (!needsUpload) {
        totalSkipped++;
        return;
      }

      if (isDryRun) {
        console.log(`   ⏳ [待上传] ${relPath} (${formatBytes(fileStat.size)}) -> ${ossKey} [${mime}]`);
      } else {
        await client.put(ossKey, filePath, {
          headers: {
            "Content-Type": mime,
            "Cache-Control": "public, max-age=3600, must-revalidate",
            "x-oss-meta-sha256": localHash,
          },
        });
        console.log(`   ✅ ${relPath} (${formatBytes(fileStat.size)})`);
      }
      totalUploaded++;
      totalBytes += fileStat.size;
    });

    console.log("");
  }

  console.log("=========================================");
  console.log(`✨ 上传统计: 成功上传/待上传: ${totalUploaded} 个 (${formatBytes(totalBytes)}) | 跳过(已同步): ${totalSkipped} 个`);
  console.log("=========================================\n");
}

async function pullSync() {
  console.log(`\n📥 准备执行【静态资产反向拉取】(OSS -> 本地)\n`);
  const client = await getClient();

  let pulledCount = 0;
  let skippedCount = 0;

  for (const dirConfig of syncConfig.directories) {
    const localDir = join(projectRoot, dirConfig.local);
    const remotePrefix = [rootPrefix, dirConfig.remote.replace(/^\/+|\/+$/g, "")].filter(Boolean).join("/");

    await mkdir(localDir, { recursive: true });
    console.log(`📂 [${dirConfig.name}] 查询远端目录: ${remotePrefix}/ -> 本地: ${dirConfig.local}`);

    const objects = [];
    let marker;
    do {
      const result = await client.list({
        prefix: `${remotePrefix}/`,
        marker,
        "max-keys": 100,
      });

      for (const obj of result.objects || []) {
        if (obj.name.endsWith("/")) continue; // 忽略目录标记
        objects.push(obj);
      }

      marker = result.nextMarker;
    } while (marker);

    // Decide every download before starting any, so the skip/transfer counts are
    // settled up front and a `stat` miss never races a concurrent write.
    const pending = [];
    for (const obj of objects) {
      const relPath = obj.name.slice(remotePrefix.length + 1);
      const targetLocalFile = join(localDir, relPath);
      let needsDownload = isForce;
      const expectedHash = await remoteHash(client, obj.name);
      try {
        const existing = await stat(targetLocalFile);
        needsDownload ||= existing.size !== obj.size;
        if (!needsDownload) {
          needsDownload = !expectedHash || (await sha256File(targetLocalFile)) !== expectedHash;
        }
      } catch {
        needsDownload = true;
      }
      if (needsDownload) pending.push({ obj, relPath, targetLocalFile, expectedHash });
      else skippedCount++;
    }

    // Directories already created this run, so a burst of files into the same
    // folder does not each issue a `mkdir`.
    const madeDirs = new Set();
    await mapWithConcurrency(pending, CONCURRENCY, async ({ obj, relPath, targetLocalFile, expectedHash }) => {
      const getRes = await client.get(obj.name);
      const parent = join(targetLocalFile, "..");
      if (!madeDirs.has(parent)) {
        await mkdir(parent, { recursive: true });
        madeDirs.add(parent);
      }
      const temporaryFile = `${targetLocalFile}.part-${process.pid}`;
      await writeFile(temporaryFile, getRes.content);
      if (expectedHash && (await sha256File(temporaryFile)) !== expectedHash) {
        throw new Error(`hash mismatch while pulling ${obj.name}`);
      }
      await rename(temporaryFile, targetLocalFile);
      console.log(`   ✅ ${relPath} (${formatBytes(obj.size)})`);
      pulledCount++;
    });

    console.log("");
  }

  console.log("=========================================");
  console.log(`✨ 拉取统计: 新下载: ${pulledCount} 个 | 跳过已存在: ${skippedCount} 个`);
  console.log("=========================================\n");
}

if (isPull) {
  pullSync().catch((err) => {
    console.error("❌ 拉取失败:", err);
    process.exit(1);
  });
} else {
  uploadSync().catch((err) => {
    console.error("❌ 同步失败:", err);
    process.exit(1);
  });
}
