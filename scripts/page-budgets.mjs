// Size budgets for the built site: a backstop against the output growing
// without anyone noticing.
//
// WHY THIS EXISTS. `verify-dist.mjs` asserts correctness — that the right
// markup, links and stylesheets were emitted — and a page can be perfectly
// correct while having doubled in weight. Nothing else in the gate set looks at
// size at all, so before this script the only way a stylesheet regression could
// surface was by someone measuring by hand. This is that measurement, automated.
//
// It is deliberately coarse, and complements `verify-dist.mjs`'s style-linkage
// section rather than duplicating it: linkage proves the right sheets are
// attributed to the right pages, this proves the totals have not drifted.
//
// WHAT IT ASSERTS, AND WHY ONLY THESE UNITS
//   - Raw bytes: deterministic across machines, runtimes and zlib builds.
//   - Brotli bytes: verified byte-identical under Node 24 and Bun 1.3 on the same
//     input, so it is a safe threshold.
//   - NOT gzip: the same input compresses to different lengths under Node and
//     Bun (measured 5,268 vs 5,270 on a 24,919-byte stylesheet, and 18,839 vs
//     18,988 on a 121,981-byte page — each runtime self-consistent, the two
//     unequal). Asserting a gzip number would make this gate fail on whichever
//     runtime it was not calibrated against.
//
// HTML size is deliberately not budgeted: it tracks the length of the content a
// page renders, which has no defensible ceiling — `publications` is 122 KB
// because it inlines 13 BibTeX blocks for the copy button. A budget there would
// either be so loose it catches nothing or would block legitimate content.
//
// SCOPE. Only HTML and `dist/_astro/**`. `dist/assets/**` is excluded on
// purpose: it holds the OSS-synced PDFs and CVs, which are gitignored, vary with
// whatever has been pulled locally, and account for ~34 MB of the ~41 MB in a
// full local `dist/`. A budget over all of `dist/` would mostly measure how many
// PDFs happen to be on disk.

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { brotliCompressSync } from "node:zlib";
import { prefixedLocales } from "../src/lib/locale.ts";
import { shapeForPath } from "../src/lib/render-shapes.ts";

const distRoot = path.resolve("dist");

/**
 * Per-shape budgets in bytes, measured on the build at commit 94aad323
 * (2026-10-16) and rounded up to leave room for ordinary content growth.
 *
 * The bars are set to fail the defect they exist to catch, not to pin today's
 * numbers: the regression this split removed was every page linking 52,677 bytes
 * of CSS, so `home`, `publications` and `projectsList` — the three shapes with
 * components of their own — sit well under that, and a page that regresses to
 * the shared-stylesheet behaviour fails everywhere.
 *
 * `default` covers the shapes whose view adds no component of its own (prose
 * pages, news detail, dropdown); they share one budget because they share one
 * stylesheet set.
 *
 * `notFound` is separate because a status page is not in the shape table at all
 * — it is not a content route — yet it renders controls of its own, so it never
 * shared the default set. Folding it into `default` would force that bar up to
 * cover one page and leave the twenty that actually share the set under-policed.
 * Its `jsRaw` is the highest in the table, above `publications`: the page ships
 * the other locale's shell strings as a JSON payload so it can relabel itself
 * when a server serves it for a locale it was not built for, and the relabeller
 * covers the whole shell — head metadata, chrome and the search dialog. The bar
 * is calibrated against the measured 12,203 B; the ~800 B of headroom is what a
 * further shell string costs before the bar has to move.
 */
export const BUDGETS = {
  /** Every stylesheet in the build combined. */
  totalCssRaw: 36_000,
  /** Distinct stylesheets in the build; a jump means chunking fragmented. */
  maxCssFiles: 8,
  /** Per-shape caps. `default` applies to any shape not named here. */
  shapes: {
    default: { cssRaw: 27_000, cssBrotli: 5_200, jsRaw: 9_000 },
    notFound: { cssRaw: 30_000, cssBrotli: 6_000, jsRaw: 13_000 },
    home: { cssRaw: 33_000, cssBrotli: 6_400, jsRaw: 9_000 },
    publications: { cssRaw: 38_000, cssBrotli: 7_400, jsRaw: 12_000 },
    projectsList: { cssRaw: 33_000, cssBrotli: 6_400, jsRaw: 9_000 },
  },
};

/** The `<link rel="stylesheet">` hrefs and `<script src>`s a page references. */
export const collectAssets = (html) => ({
  cssHrefs: [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((match) => match[1]),
  jsSrcs: [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]),
  inlineCss: [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((match) => match[1]),
  inlineJs: [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]),
});

/**
 * One page's totals.
 *
 * Inline and external are summed: a visitor pays for both, and which form Astro
 * picks depends on `build.inlineStylesheets` and the sheet's size, so counting
 * only `<link>`s would let a sheet slip out of the budget by being inlined.
 * `readAsset` maps an href to its bytes, or `undefined` when it does not exist —
 * which the caller reports as a failure rather than counting as zero.
 */
export const measurePage = (html, readAsset) => {
  const { cssHrefs, jsSrcs, inlineCss, inlineJs } = collectAssets(html);
  // `.length` on the Buffer, not the Buffer itself: `0 + buffer` stringifies it,
  // so summing the buffers directly turns the total into concatenated CSS text.
  const sum = (hrefs) =>
    hrefs.reduce((total, href) => {
      const bytes = readAsset(href);
      return bytes === undefined ? total : total + bytes.length;
    }, 0);
  const brotli = (chunks) => chunks.reduce((total, chunk) => total + brotliCompressSync(Buffer.from(chunk)).length, 0);
  return {
    cssRaw: sum(cssHrefs) + inlineCss.reduce((total, chunk) => total + Buffer.byteLength(chunk), 0),
    cssBrotli: brotli(cssHrefs.map((href) => readAsset(href)).filter((bytes) => bytes !== undefined)) + brotli(inlineCss),
    jsRaw: sum(jsSrcs) + inlineJs.reduce((total, chunk) => total + Buffer.byteLength(chunk), 0),
    cssRequests: cssHrefs.length + inlineCss.length,
    jsRequests: jsSrcs.length + inlineJs.length,
  };
};

/**
 * Every budget a measurement breaks.
 *
* Pure and side-effect free so the budget calculation remains independently auditable
 * against synthetic input; the CLI below only supplies real measurements.
 *
 * @param {{page: string, shape: string, metrics: Record<string, number>}} measured
 * @returns {Array<{page: string, metric: string, actual: number, limit: number}>}
 */
export const breaches = (measured, budgets = BUDGETS) => {
  const limits = budgets.shapes[measured.shape] ?? budgets.shapes.default;
  const found = [];
  for (const [metric, limit] of Object.entries(limits)) {
    const actual = measured.metrics[metric];
    if (actual === undefined) continue;
    if (actual > limit) found.push({ page: measured.page, metric, actual, limit });
  }
  return found;
};

/** The shape name a built page belongs to, for budget selection. */
export const shapeNameFor = (relativePath) => {
  // A status page is not a content route, so the shape table has no entry for
  // it. Match it by its last path segment, which covers both emitted forms:
  // `404.html` for the default locale and `zh-CN/404/index.html` for a prefixed
  // one. The strip runs first because the file form carries no `index.html`.
  const segments = relativePath
    .replace(/(?:^|\/)index\.html$|\.html$/, "")
    .split("/")
    .filter(Boolean);
  if (segments.at(-1) === "404") return "notFound";
  const pathname = `/${relativePath.replace(/(?:^|\/)index\.html$/, "")}`;
  return shapeForPath(pathname, prefixedLocales)?.name ?? "default";
};

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]));

const main = () => {
  const files = walk(distRoot);
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  if (!htmlFiles.length) {
    console.error("page-budgets: dist/ has no HTML files; run `bun run build` first");
    process.exitCode = 1;
    return;
  }

  const readAsset = (href) => {
    try {
      return readFileSync(path.join(distRoot, href.replace(/^\//, "")));
    } catch {
      return undefined;
    }
  };

  const failures = [];
  const cssFiles = new Set();
  const rows = [];
  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    const relative = path.relative(distRoot, file);
    const { cssHrefs, jsSrcs } = collectAssets(html);
    for (const href of [...cssHrefs, ...jsSrcs]) {
      const bytes = readAsset(href);
      // An asset a page references but the build did not emit is a broken page,
      // and it would otherwise be invisible to a size total (counted as zero).
      if (bytes === undefined) failures.push(`${relative}: references ${href}, which dist/ does not contain`);
      else if (bytes.length === 0) failures.push(`${relative}: references empty asset ${href}`);
      if (href.endsWith(".css")) cssFiles.add(href);
    }
    rows.push({ page: relative, shape: shapeNameFor(relative), metrics: measurePage(html, readAsset) });
  }

  for (const row of rows) {
    for (const { metric, actual, limit } of breaches(row)) {
      failures.push(`${row.page}: ${metric} is ${actual.toLocaleString()} B, over the ${limit.toLocaleString()} B budget`);
    }
  }

  const totalCssRaw = [...cssFiles].reduce((total, href) => total + (readAsset(href)?.length ?? 0), 0);
  if (totalCssRaw > BUDGETS.totalCssRaw) {
    failures.push(`dist: CSS total is ${totalCssRaw.toLocaleString()} B, over the ${BUDGETS.totalCssRaw.toLocaleString()} B budget`);
  }
  if (cssFiles.size > BUDGETS.maxCssFiles) {
    failures.push(`dist: ${cssFiles.size} stylesheets emitted, over the budget of ${BUDGETS.maxCssFiles}`);
  }

  if (failures.length) {
    console.error(`page-budgets: ${failures.length} problem(s)`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
    return;
  }

  const worstCss = rows.reduce((worst, row) => (row.metrics.cssRaw > worst.metrics.cssRaw ? row : worst));
  const worstJs = rows.reduce((worst, row) => (row.metrics.jsRaw > worst.metrics.jsRaw ? row : worst));
  console.log(
    `page-budgets: ${rows.length} pages within budget — worst CSS ${worstCss.metrics.cssRaw.toLocaleString()} B (${worstCss.page}), ` +
      `worst JS ${worstJs.metrics.jsRaw.toLocaleString()} B (${worstJs.page}), ${cssFiles.size} stylesheets totalling ${totalCssRaw.toLocaleString()} B.`
  );
};

if (import.meta.main) main();
