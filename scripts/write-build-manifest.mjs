// Stamps the build and records a per-file checksum manifest into `dist/`.
//
// `build.json` lets the post-deploy health check prove which commit is live —
// the site previously carried no build identifier, so a deploy could not be
// distinguished from a stale docroot. `MANIFEST.sha256` lets the deploy verify
// the bytes it extracted match the bytes CI built, in `sha256sum -c` format.
//
// Runs as part of `bun run build`, after `astro build`.

import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { walk } from "./walk.mjs";

const distRoot = path.resolve("dist");
const buildInfoFile = "build.json";
const manifestFile = "MANIFEST.sha256";

const sha256 = async (file) =>
  createHash("sha256")
    .update(await readFile(file))
    .digest("hex");

const commit = process.env.BUILD_COMMIT ?? "local";
const buildInfo = { commit, builtAt: new Date().toISOString() };
await writeFile(path.join(distRoot, buildInfoFile), `${JSON.stringify(buildInfo, null, 2)}\n`);

// The manifest covers every emitted file except itself: it cannot contain its own
// digest, and `verify-dist.mjs` asserts the two sets match exactly.
const files = (await walk(distRoot)).filter((file) => path.relative(distRoot, file) !== manifestFile).sort();

const lines = [];
for (const file of files) lines.push(`${await sha256(file)}  ${path.relative(distRoot, file)}`);
await writeFile(path.join(distRoot, manifestFile), `${lines.join("\n")}\n`);

const { size } = await stat(path.join(distRoot, manifestFile));
console.log(`write-build-manifest: commit ${commit}, ${lines.length} files, ${size} bytes of manifest.`);
