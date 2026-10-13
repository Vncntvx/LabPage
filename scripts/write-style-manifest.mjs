import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distRoot = path.resolve("dist");
const pages = {};

const walk = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith(".html")) {
      const relative = path.relative(distRoot, file).split(path.sep).join("/");
      const pathname = relative === "index.html" ? "/" : `/${relative.replace(/index\.html$/, "")}`;
      const html = await readFile(file, "utf8");
      pages[pathname] = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((match) => match[1]);
    }
  }
};

await walk(distRoot);
await writeFile(path.join(distRoot, "style-manifest.json"), `${JSON.stringify({ version: 1, pages }, null, 2)}\n`);
