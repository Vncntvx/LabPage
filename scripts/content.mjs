// Frontmatter reading shared by the content audits. Importable from plain Node
// and from astro.config.mjs: no `astro:content` or other virtual modules.

import { glob, readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { entryKey, isRoutedCollection } from "../src/lib/content.ts";
import { reachablePermalinks, renderable, visible } from "../src/lib/dev-mode.ts";

const frontmatterPattern = /^---\n([\s\S]*?)\n---/;

/** Localized content collections audited for English/Chinese pairing. */
export const localizedCollections = ["pages", "news", "projects", "teachings", "people", "opportunities", "resources"];

/**
 * Parses a Markdown file's YAML frontmatter.
 * @returns {{ok: true, data: Record<string, unknown>} | {ok: false, reason: string}}
 */
export const parseFrontmatter = (source) => {
  const match = source.match(frontmatterPattern);
  if (!match) return { ok: false, reason: "missing YAML frontmatter" };
  try {
    return { ok: true, data: parse(match[1]) ?? {} };
  } catch (error) {
    return { ok: false, reason: `invalid YAML (${error.message})` };
  }
};

/**
 * Reads every collection entry under `contentRoot`.
 *
 * `file` is repo-relative for reporting; `relative` is the path below
 * `contentRoot`, whose first two segments are the collection and the locale.
 *
 * @returns {Promise<Array<{file: string, relative: string, collection: string}}>}
 */
export const readContentEntries = async ({ contentRoot = "src/content", collections } = {}) => {
  const entries = [];
  for await (const file of glob("**/*.md", { cwd: contentRoot })) {
    const relative = file.split(path.sep).join("/");
    const [collection, locale] = relative.split("/");
    if (collections && !collections.includes(collection)) continue;

    const filePath = path.join(contentRoot, relative);
    const parsed = parseFrontmatter(await readFile(filePath, "utf8"));
    const slug = path.basename(relative).replace(/\.md$/, "");
    entries.push({
      file: filePath,
      relative,
      collection,
      locale,
      slug,
      ...(parsed.ok ? { data: parsed.data } : { parseError: parsed.reason }),
    });
  }
  return entries.sort((a, b) => a.relative.localeCompare(b.relative));
};

/**
 * Routes that are live in some locales but not all.
 *
 * The language switcher and the `hreflang` alternates both derive the other
 * locale's URL from the current path, so a route that ships in one locale only
 * sends visitors to a 404. Entries drafted in every locale are consistent and
 * deliberately not reported: nothing links to them yet.
 *
 * @returns {Array<{key: string, present: string[], missing: string[]}>}
 */
export const findPairingGaps = (entries, locales) => {
  const live = new Map();
  for (const entry of entries) {
    // A file whose frontmatter did not parse carries `parseError` and no `data`,
    // so its route cannot be derived. The audit reports that file on its own and
    // must still be able to list every other gap, so it is skipped here.
    if (!entry.data) continue;
    if (entry.data.draft === true) continue;
    const key = `${entry.collection}:${entryKey(entry.collection, entry)}`;
    if (!live.has(key)) live.set(key, new Set());
    live.get(key).add(entry.locale);
  }

  return [...live]
    .map(([key, present]) => ({ key, present: [...present].sort(), missing: locales.filter((locale) => !present.has(locale)) }))
    .filter(({ missing }) => missing.length)
    .sort((a, b) => a.key.localeCompare(b.key));
};

/**
 * Every entry's route in every locale, with whether it should ship.
 *
 * "Should ship" uses the same predicates the route does — `renderable` for
 * pages (a `dropdown` whose children all point at hidden pages retires) and
 * `visible` for the rest — so `verify-dist.mjs` can assert the built output
 * against the real entry set instead of a hard-coded list of collection names.
 * Drafting out a collection and un-drafting a single entry both fall out of this.
 *
 * @returns {Promise<Array<{collection: string, locale: string, route: string, ships: boolean}>>}
 */
export const contentRoutes = async ({ contentRoot = "src/content", collections = localizedCollections, locales } = {}) => {
  const entries = (await readContentEntries({ contentRoot, collections })).filter((entry) => entry.data && (!locales || locales.includes(entry.locale)));
  return entries.filter((entry) => isRoutedCollection(entry.collection)).map((entry) => ({
    collection: entry.collection,
    locale: entry.locale,
    route: entryKey(entry.collection, entry),
    ships:
      entry.collection === "pages"
        ? renderable(entry, reachablePermalinks(entries.filter((item) => item.collection === "pages"), entry.locale))
        : visible(entry),
  }));
};
