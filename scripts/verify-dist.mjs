// Asserts properties of the BUILT site in `dist/` that source-level checks
// cannot see: rendered meta tags, sitemap alternates, feed contents, the build
// manifest, and that retired placeholder content stayed retired.
//
// Runs in CI after `bun run build`, and in the deploy workflow before anything is
// transferred. Exits non-zero with one line per failure.

import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { localeCodes } from "../src/i18n/locales.ts";
import { localeUrl } from "../src/lib/locale.ts";
import { contentRoutes } from "./content.mjs";
import { emptyMetaContent } from "./meta-content.mjs";
import { stylesheetHrefs } from "./style-linkage.mjs";
import { walk } from "./walk.mjs";

const distRoot = path.resolve("dist");
const failures = [];
const fail = (message) => failures.push(message);

// What the content says should ship, so the output is checked against the real
// entry set rather than a hard-coded list of collection names. This uses the
// same `visible` / `renderable` predicates the route does, so a page that
// retires (a dropdown with no reachable child) is treated exactly as the
// router treats it.
const routes = await contentRoutes({ locales: localeCodes });
/** As-served pathname -> the locales that ship it, for routes shipped anywhere. */
const shippingLocales = new Map();
for (const { locale, route, ships } of routes) {
  if (!ships) continue;
  if (!shippingLocales.has(route)) shippingLocales.set(route, new Set());
  shippingLocales.get(route).add(locale);
}
/** As-served pathnames of routes that ship in every locale. */
const localizedPathnames = new Set(
  [...shippingLocales]
    .filter(([, locales]) => locales.size === localeCodes.length)
    .flatMap(([route, locales]) => [...locales].map((locale) => localeUrl(locale, route)))
);

const readIfPresent = async (file) => {
  try {
    return await readFile(file, "utf8");
  } catch {
    return undefined;
  }
};

// --- 1. Required top-level artifacts -----------------------------------------
const requiredFiles = [
  "index.html",
  "404.html",
  "feed.xml",
  "robots.txt",
  "sitemap-index.xml",
  "sitemap-0.xml",
  "search-index-en.json",
  "search-index-zh-CN.json",
  "zh-CN/index.html",
  "zh-CN/feed.xml",
  "assets/img/og-en.png",
  "assets/img/og-zh-CN.png",
  "build.json",
  "MANIFEST.sha256",
  "style-manifest.json",
];
for (const file of requiredFiles) {
  if (!(await readIfPresent(path.join(distRoot, file)))) fail(`dist/${file}: missing or empty`);
}

// --- 1b. Build manifest ------------------------------------------------------
// The manifest is what the deploy verifies on the server, so it must describe
// exactly this tree: a stale or hand-edited manifest would send a wrong-but-
// passing file set to production.
const buildInfo = await readIfPresent(path.join(distRoot, "build.json"));
if (buildInfo) {
  try {
    const { commit, builtAt } = JSON.parse(buildInfo);
    if (typeof commit !== "string" || !commit) fail("dist/build.json: commit is missing");
    if (typeof builtAt !== "string" || Number.isNaN(Date.parse(builtAt))) fail("dist/build.json: builtAt is not an ISO timestamp");
  } catch (error) {
    fail(`dist/build.json: invalid JSON (${error.message})`);
  }
}

const manifest = await readIfPresent(path.join(distRoot, "MANIFEST.sha256"));
if (manifest) {
  const listed = new Map();
  for (const line of manifest.split("\n")) {
    if (!line.trim()) continue;
    const match = line.match(/^([0-9a-f]{64}) {2}(.+)$/);
    if (!match) {
      fail(`dist/MANIFEST.sha256: malformed line ${JSON.stringify(line)}`);
      continue;
    }
    listed.set(match[2], match[1]);
  }

  const actual = new Set((await walk(distRoot)).map((file) => path.relative(distRoot, file)).filter((file) => file !== "MANIFEST.sha256"));
  for (const file of actual) if (!listed.has(file)) fail(`dist/MANIFEST.sha256: ${file} is not listed`);
  for (const file of listed.keys()) if (!actual.has(file)) fail(`dist/MANIFEST.sha256: ${file} is listed but absent`);

  for (const [file, expected] of listed) {
    if (!actual.has(file)) continue;
    const digest = createHash("sha256")
      .update(await readFile(path.join(distRoot, file)))
      .digest("hex");
    if (digest !== expected) fail(`dist/MANIFEST.sha256: ${file} checksum mismatch`);
  }
}

// --- 2. Crawl the built HTML -------------------------------------------------
const htmlFiles = (await walk(distRoot)).filter((file) => file.endsWith(".html"));
if (!htmlFiles.length) fail("dist: no HTML files were built");

const resolveInternal = (url) => {
  const withoutHash = url.split("#")[0].split("?")[0];
  return path.join(distRoot, withoutHash.replace(/^\//, ""));
};

const existsAsRouteOrFile = async (url) => {
  const base = resolveInternal(url);
  for (const candidate of [base, path.join(base, "index.html")]) {
    try {
      if ((await stat(candidate)).isFile()) return true;
    } catch {
      // keep trying
    }
  }
  return false;
};

const linkPattern = /(?:href|src)="(\/[^"]*)"/g;

for (const file of htmlFiles) {
  const relative = path.relative(distRoot, file);
  const html = await readFile(file, "utf8");

  // Empty descriptions rendered as attribute-only tags; this is the exact
  // defect the P0 fix removed, so assert it cannot come back. `name=` and
  // `property=` are both matched, because Open Graph and Twitter tags use
  // different attributes and a mismatch would leave a tag unchecked.
  for (const identifier of emptyMetaContent(html, ["description", "og:description", "twitter:description"])) {
    fail(`${relative}: empty ${identifier}`);
  }

  const title = html.match(/<title>([\s\S]*?)<\/title>/);
  if (!title || !title[1].trim()) fail(`${relative}: missing or empty <title>`);

  if (!/<meta property="og:image"\s+content="https:\/\//.test(html)) fail(`${relative}: missing absolute og:image`);
  // The share card is generated per locale, so its alt text is that card's own
  // description. Reusing the page title here would publish a page-specific
  // string as the description of a shared image.
  if (!/<meta property="og:image:alt"\s+content="[^"]+"/.test(html)) fail(`${relative}: missing og:image:alt`);
  if (!/<link rel="alternate" type="application\/rss\+xml"/.test(html)) fail(`${relative}: missing RSS autodiscovery link`);

  // Root-relative links must resolve to a real file or route directory.
  for (const match of html.matchAll(linkPattern)) {
    const url = match[1];
    if (url.startsWith("//")) continue;
    if (!(await existsAsRouteOrFile(url))) fail(`${relative}: broken internal link ${url}`);
  }
}

// --- 3. Search index routes --------------------------------------------------
// The index is JSON, so the HTML link crawl above cannot see it. Every entry it
// advertises is a link the search modal hands to a visitor, so each URL must
// resolve — a page that retired from the routes must not linger in the index.
for (const file of ["search-index-en.json", "search-index-zh-CN.json"]) {
  const raw = await readIfPresent(path.join(distRoot, file));
  if (!raw) continue;
  let entries;
  try {
    entries = JSON.parse(raw);
  } catch (error) {
    fail(`dist/${file}: invalid JSON (${error.message})`);
    continue;
  }
  if (!Array.isArray(entries)) {
    fail(`dist/${file}: expected a JSON array`);
    continue;
  }
  for (const entry of entries) {
    if (typeof entry?.url !== "string") {
      fail(`dist/${file}: entry without a string url`);
      continue;
    }
    if (!(await existsAsRouteOrFile(entry.url))) fail(`dist/${file}: indexed url does not resolve (${entry.url})`);
  }
}

// --- 4. Sitemap alternates ---------------------------------------------------
const sitemap = await readIfPresent(path.join(distRoot, "sitemap-0.xml"));
if (sitemap) {
  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
  if (!entries.length) fail("sitemap-0.xml: no <url> entries");

  let withAlternates = 0;
  for (const entry of entries) {
    const loc = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;
    const alternates = [...entry.matchAll(/<xhtml:link[^>]*hreflang="([^"]+)"/g)].map((match) => match[1]);
    // Any route the content ships in both locales has a counterpart URL, so the
    // sitemap must pair them. The set comes from the content, so a new page type
    // is covered without editing this file.
    const isLocalized = localizedPathnames.has(new URL(loc).pathname);
    const isHome = /^\/(?:zh-CN\/)?$/.test(new URL(loc).pathname);
    if (!isLocalized && !isHome) continue;

    if (alternates.length < 2) {
      fail(`sitemap-0.xml: ${loc} has ${alternates.length} hreflang alternate(s), expected at least en + zh-CN`);
      continue;
    }
    if (!alternates.includes("x-default")) fail(`sitemap-0.xml: ${loc} is missing an x-default alternate`);
    withAlternates += 1;
  }
  if (!withAlternates) fail("sitemap-0.xml: no entry declares hreflang alternates at all");
}

// --- 5. Feeds ---------------------------------------------------------------
for (const [file, language] of [
  ["feed.xml", "en"],
  ["zh-CN/feed.xml", "zh-CN"],
]) {
  const feed = await readIfPresent(path.join(distRoot, file));
  if (!feed) continue;
  if (!feed.includes(`<language>${language}</language>`)) fail(`dist/${file}: expected <language>${language}</language>`);
  if (!/rel="self"/.test(feed)) fail(`dist/${file}: missing <atom:link rel="self">`);

  const items = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  if (!items.length) fail(`dist/${file}: no items`);
  for (const [index, item] of items.entries()) {
    const description = item[1].match(/<description>([\s\S]*?)<\/description>/)?.[1]?.trim();
    if (!description) fail(`dist/${file}: item ${index + 1} has an empty description`);
  }
}

// --- 6. Retired placeholder content ----------------------------------------
const bannedStrings = ["example_pdf", "Prof. Example", "Prof. Data"];
for (const file of await walk(distRoot)) {
  if (!/\.(?:html|xml|json|txt)$/.test(file)) continue;
  const text = await readFile(file, "utf8");
  for (const banned of bannedStrings) {
    if (text.includes(banned)) fail(`${path.relative(distRoot, file)}: contains retired placeholder "${banned}"`);
  }
}

// --- 7. Content routes match the built output -------------------------------
// Derived from the content, not a hard-coded collection name: every entry that
// should ship must have its route built, and every entry that retired (drafted,
// or a dropdown with no reachable child) must not leave one behind. This
// catches both a leaked draft route and a live route the build silently dropped.
for (const { locale, route, ships } of routes) {
  const pathname = localeUrl(locale, route);
  const exists = await existsAsRouteOrFile(pathname);
  if (ships && !exists) fail(`dist: ${pathname} was not built but its entry is live`);
  if (!ships && exists) fail(`dist: ${pathname} exists but its entry is retired`);
}

// --- 8. Style linkage --------------------------------------------------------
// Astro's completed-build asset map is the source of truth. Compare each page's
// actual stylesheet links with the route pattern's emitted CSS set; no generated
// class names or component-name guesses are involved.
const styleManifestRaw = await readIfPresent(path.join(distRoot, "style-manifest.json"));
if (styleManifestRaw) {
  try {
    const styleManifest = JSON.parse(styleManifestRaw);
    const routeAssets = styleManifest.pages;
    if (!routeAssets || typeof routeAssets !== "object") throw new Error("pages is missing");
    for (const file of htmlFiles) {
      const relative = path.relative(distRoot, file);
      const html = await readFile(file, "utf8");
      const pathname = relative === "index.html" ? "/" : `/${relative.replace(/index\.html$/, "")}`;
      const expected = new Set((routeAssets[pathname] ?? routeAssets[`${pathname}/`] ?? routeAssets[pathname.replace(/\/$/, "")] ?? []).map((href) => href.replace(/^\//, "")));
      const actual = new Set(stylesheetHrefs(html).map((href) => href.replace(/^\//, "")));
      for (const href of actual) if (!expected.has(href)) fail(`${relative}: stylesheet ${href} is not in Astro's build manifest for ${pathname}`);
      for (const href of expected) if (!actual.has(href)) fail(`${relative}: stylesheet ${href} is missing from the emitted HTML for ${pathname}`);
    }
  } catch (error) {
    fail(`dist/style-manifest.json: invalid manifest (${error.message})`);
  }
}

// --- Report -----------------------------------------------------------------
if (failures.length) {
  console.error(`verify-dist: ${failures.length} problem(s) in dist/`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`verify-dist: ${htmlFiles.length} HTML files, ${(sitemap && [...sitemap.matchAll(/<url>/g)].length) || 0} sitemap URLs verified.`);
}
