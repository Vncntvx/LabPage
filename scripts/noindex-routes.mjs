// Reads which `pages` entries opt out of indexing, so the sitemap can exclude
// them. For the `pages` collection the frontmatter `permalink` IS the route
// (see AGENTS.md "Sources of truth"), so no route derivation is duplicated here.
//
// Importable from plain Node and from astro.config.mjs: no `astro:content` or
// other virtual modules.

import { localeUrl } from "../src/lib/locale.ts";
import { readContentEntries } from "./content.mjs";

/**
 * @returns {Promise<Set<string>>} pathnames (leading slash, trailing slash) of
 * pages whose frontmatter sets `noindex: true`, across every locale directory.
 */
export async function readNoindexRoutes({ contentRoot = "src/content" } = {}) {
  const routes = new Set();

  for (const { file, locale, data, parseError } of await readContentEntries({ contentRoot, collections: ["pages"] })) {
    // A page without frontmatter cannot opt out, so it is not this check's problem.
    if (parseError || data.noindex !== true) continue;
    if (typeof data.permalink !== "string" || !data.permalink.trim()) {
      throw new Error(`${file}: noindex is set but permalink is missing, so the route cannot be excluded from the sitemap.`);
    }

    // `localeUrl` owns the prefix rule; the sitemap filter matches on pathname,
    // so a trailing slash is added here rather than re-deriving the prefix.
    const route = localeUrl(locale, data.permalink);
    routes.add(route.endsWith("/") ? route : `${route}/`);
  }

  return routes;
}
