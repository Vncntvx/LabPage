import { readFile } from "node:fs/promises";
import { localeCodes } from "../src/i18n/locales.ts";

const load = async (code) => JSON.parse(await readFile(new URL(`../src/data/locale/${code}/strings.json`, import.meta.url), "utf8"));
const leafKeys = (value, prefix = "") =>
  Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" && !Array.isArray(child) ? leafKeys(child, path) : [path];
  });
const defaults = new Set(leafKeys(await load("en")));
let failed = false;
for (const code of localeCodes) {
  const actual = new Set(leafKeys(await load(code)));
  const missing = [...defaults].filter((key) => !actual.has(key));
  const extra = [...actual].filter((key) => !defaults.has(key));
  if (missing.length) {
    console.error(`${code}: missing ${missing.join(", ")}`);
    failed = true;
  }
  if (extra.length) console.warn(`${code}: extra ${extra.join(", ")}`);
}
if (failed) process.exitCode = 1;
else console.log(`Translation keys verified for ${localeCodes.length} locales.`);
