// `getStaticPaths` bodies shared by the shape route files.
//
// This module imports `astro:content`, so only route files may use it. The
// decisions it defers to — which entries are
// visible, whether a dropdown page is still renderable, how a collection's route
// is spelled, which route file serves a page — all live in `./dev-mode`,
// `./content` and `./render-shapes`.
//
// Each helper is keyed on the DOMAIN key (a `pageId`, a collection name) rather
// than on a shape name, so the entry it returns is typed exactly and there is no
// way to pair a shape with the wrong collection. The shape table then supplies
// the route template and the dynamic segment, which is the only part that
// belongs to routing rather than to content.
//
// Every route file is the same four lines because the logic lives here: a
// shape's route is identical in both locales, and only the params differ.

import { getCollection } from "astro:content";
import { entryRoute } from "./content";
import { reachablePermalinks, renderable, visible } from "./dev-mode";
import { defaultLocale, localeUrl, type Locale } from "./locale";
import { shapeForCollection, shapeForPageId } from "./render-shapes";

/** Collections whose entries have a detail route of their own. */
export type DedicatedCollection = "news" | "projects" | "teachings";

/**
 * Params a route file contributes for one locale. The default locale is served
 * unprefixed, so it contributes no `locale` param at all; every other locale's
 * route file lives under `src/pages/[locale]/` and supplies it.
 */
const localeParams = (locale: Locale) => (locale === defaultLocale ? {} : { locale });

/**
 * The `getStaticPaths` body for a page shape: at most one route per locale.
 *
 * Returns `[]` when the entry is drafted, or when it is a `dropdown` whose
 * children all point at hidden pages — `renderable` retires it in that case. A
 * route file that emits no paths writes no directory into `dist/`, which is how
 * a retired page leaves the site.
 *
 * The dynamic segment is present but `undefined`, because a rest param is the
 * only form that both accepts a missing value and is still driven by
 * `getStaticPaths`; a named segment rejects `undefined`, and a non-parameterized
 * route ignores `getStaticPaths` entirely and always emits.
 */
export const pageShapeStaticPaths = (pageId: string, locales: readonly Locale[]) => async () => {
  const shape = shapeForPageId(pageId);
  if (!shape || shape.kind !== "page") throw new Error(`No page shape is registered for pageId "${pageId}", so no route file can serve it.`);
  // Read unfiltered first: the reachable set is the input to `renderable`.
  const allPages = await getCollection("pages");
  const reachableByLocale = new Map(locales.map((locale) => [locale, reachablePermalinks(allPages, locale)]));
  return allPages
    .filter(
      (entry) =>
        entry.data.pageId === pageId &&
        locales.includes(entry.data.locale) &&
        renderable(entry, reachableByLocale.get(entry.data.locale) ?? new Set())
    )
    .map((entry) => ({
      params: { ...localeParams(entry.data.locale), [shape.param]: undefined },
      props: { entry, locale: entry.data.locale, path: localeUrl(entry.data.locale, entry.data.permalink) },
    }));
};

/**
 * The `getStaticPaths` body for a collection shape: one route per visible entry.
 *
 * The route comes from `entryRoute`, the same single source the sitemap, feed
 * and search index resolve through, so a template change cannot leave the detail
 * pages behind.
 */
export const collectionShapeStaticPaths =
  <Collection extends DedicatedCollection>(collection: Collection, locales: readonly Locale[]) =>
  async () => {
    const shape = shapeForCollection(collection);
    if (!shape || shape.kind !== "collection")
      throw new Error(`No collection shape is registered for "${collection}", so no route file can serve it.`);
    const entries = await getCollection(collection, visible);
    return entries
      .filter((entry) => locales.includes(entry.data.locale))
      .map((entry) => {
        const route = entryRoute(collection, entry);
        const slug =
          "routeSlug" in entry.data
            ? entry.data.routeSlug
            : "course_id" in entry.data
              ? entry.data.course_id
              : entry.id.slice(entry.id.lastIndexOf("/") + 1);
        if (!slug) throw new Error(`${collection} entry "${entry.id}" has no route slug to build a path from.`);
        return {
          params: { ...localeParams(entry.data.locale), [shape.param]: slug },
          props: { entry, locale: entry.data.locale, path: localeUrl(entry.data.locale, route) },
        };
      });
  };
