// Recursive directory listing shared by the build scripts. Importable from plain
// Node and from the post-build scripts: no `astro:content` or other virtual
// modules.

import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Every file below `dir`, recursively.
 *
 * A missing directory yields `[]` rather than throwing, so a caller can point at
 * a directory that a build may not have produced yet.
 *
 * `filter` receives each candidate file path and its basename, and drops it when
 * it returns `false`; a directory is always descended into, because a matching
 * file may sit below it.
 *
 * @param {string} dir
 * @param {{filter?: (filePath: string, name: string) => boolean}} [options]
 * @returns {Promise<string[]>}
 */
export const walk = async (dir, { filter } = {}) => {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full, { filter })));
    else if (entry.isFile() && (!filter || filter(full, entry.name))) files.push(full);
  }
  return files;
};
