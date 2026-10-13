/**
 * Content collection IDs from the glob loader look like `en/news/<slug>`.
 * The route slug is always the final path segment.
 */
export const entrySlug = (id: string) => id.slice(id.lastIndexOf("/") + 1);

export const ROUTED_COLLECTIONS = ["pages", "news", "projects", "teachings"] as const;
export type RoutedCollection = (typeof ROUTED_COLLECTIONS)[number];

export const isRoutedCollection = (collection: string): collection is RoutedCollection => ROUTED_COLLECTIONS.includes(collection as RoutedCollection);

/** Stable pairing key for content entries, including aggregate-only collections. */
export const entryKey = <E extends { id?: string; slug?: string; data: object }>(collection: string, entry: E): string => {
  if (isRoutedCollection(collection)) return entryRoute(collection, entry);
  return entry.slug ?? entrySlug(entry.id ?? "");
};

/** The frontmatter fields a route can be derived from. */
export interface RouteData {
  permalink?: string;
  routeSlug?: string;
  course_id?: string;
}

/**
 * The route an entry serves, without any locale prefix. This is the single
 * source of truth for the news/projects/teachings URL templates: the catch-all
 * route, the search index, the feed and the news list all resolve through it,
 * so a change to a template cannot leave one of them pointing at a 404.
 *
 * `en/news/foo` is an entry, `/news/foo/` is its route — the caller applies the
 * locale prefix with `localeUrl`.
 *
 * The entry is accepted structurally (any object with a `data` object): a
 * collection entry carries a specific, closed data shape, and constraining this
 * to `RouteData` would reject a news entry, which legitimately has none of
 * those optional keys. The three route fields are read through one local cast.
 */
export const entryRoute = <E extends { id?: string; slug?: string; data: object }>(collection: string, entry: E): string => {
  const data = entry.data as RouteData;
  const slug = entry.slug ?? entrySlug(entry.id ?? "");
  switch (collection) {
    case "pages": {
      if (!data.permalink) throw new Error(`pages entry "${slug}" has no permalink to route on`);
      return data.permalink;
    }
    case "news":
      return `/news/${slug}/`;
    case "projects":
      return `/projects/${data.routeSlug ?? slug}/`;
    case "teachings":
      return `/teachings/${data.course_id ?? slug}/`;
    default:
      throw new Error(`No route template for collection "${collection}"`);
  }
};
