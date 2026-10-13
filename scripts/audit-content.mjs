import { findPairingGaps, localizedCollections, readContentEntries } from "./content.mjs";
import { localeCodes } from "../src/i18n/locales.ts";
import { entryKey, isRoutedCollection } from "../src/lib/content.ts";
import { shapeForPageId, shapeForRoute } from "../src/lib/render-shapes.ts";

const supportedLocales = localeCodes;
const entries = await readContentEntries({ collections: localizedCollections });
const routes = new Map();
let failed = false;

for (const { file, collection, locale, slug, data, parseError } of entries) {
  if (parseError) {
    console.error(`${file}: ${parseError}`);
    failed = true;
    continue;
  }

  if (!supportedLocales.includes(locale)) {
    console.error(`${file}: unsupported locale directory "${locale}"`);
    failed = true;
  }
  if (data.locale !== locale) {
    console.error(`${file}: locale "${data.locale ?? "(missing)"}" must match directory "${locale}"`);
    failed = true;
  }

  // `description` feeds the meta tags, the feed items and the search index. An
  // absent or blank value renders an empty description, and a description equal
  // to the title duplicates the heading on the rendered page.
  if (typeof data.description !== "string" || !data.description.trim()) {
    console.error(`${file}: description is ${data.description === undefined ? "missing" : "empty"}; every entry needs a real summary`);
    failed = true;
  } else if (data.description.trim() === (data.title ?? "").trim()) {
    console.error(`${file}: description repeats the title; write a distinct summary`);
    failed = true;
  }

  const route = entryKey(collection, { id: `${locale}/${collection}/${slug}`, slug, data });
  const routeKey = `${collection}:${locale}:${route}`;
  if (routes.has(routeKey)) {
    console.error(`${file}: duplicate route key "${routeKey}" (also used by ${routes.get(routeKey)})`);
    failed = true;
  } else {
    routes.set(routeKey, file);
  }

  // Aggregate-only collections are consumed by a page rather than routed on
  // their own. They still receive locale/duplicate-key checks above.
  if (!isRoutedCollection(collection)) continue;

  // A `pages` entry's `permalink` is its route, and `src/lib/render-shapes.ts`
  // decides which route FILE serves it. Nothing else can: there is no catch-all
  // route, so a permalink no shape claims would have no route file at all and
  // would silently vanish from the site, and a permalink that disagrees with its
  // own shape's pattern would be served by a file routed at a different URL —
  // and therefore at a different CSS scope, since a page only avoids shipping
  // another page's CSS by living in its own route file.
  if (collection === "pages") {
    const shape = shapeForPageId(data.pageId);
    if (!shape) {
      console.error(`${file}: pageId ${data.pageId === undefined ? "is missing" : `"${data.pageId}" has no registered shape`}; nothing would route it`);
      failed = true;
    } else if (route !== shape.pattern) {
      console.error(`${file}: pageId "${data.pageId}" is served by the "${shape.name}" shape at ${shape.pattern}, but permalink is "${route}"`);
      failed = true;
    }
    // Two shapes cannot own one route, so a permalink must not land on a pattern
    // registered to a different shape.
    const owner = shapeForRoute(route);
    if (owner && shape && owner.name !== shape.name) {
      console.error(`${file}: permalink "${route}" is registered to the "${owner.name}" shape, not to "${data.pageId}"`);
      failed = true;
    }
  }
}

// Every route must exist in each locale: the language switcher and the hreflang
// alternates derive the other locale's URL from the path alone.
for (const { key, present, missing } of findPairingGaps(entries, supportedLocales)) {
  console.error(`${key}: missing in ${missing.join(", ")} (present in ${present.join(", ")})`);
  failed = true;
}

if (failed) process.exitCode = 1;
else console.log(`Content frontmatter verified for ${entries.length} files.`);
