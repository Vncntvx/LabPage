/**
 * Whether this render is the "show everything" development mode.
 *
 * `bun run dev:all` starts the dev server with `--mode dev-all`; the mode is the
 * only switch, so there is no second source of truth to keep in sync. Production
 * builds report `"production"` here, and the value is inlined at build time, so
 * a production bundle contains no reference to the mode at all.
 *
 * The optional chaining keeps this module usable by build-time scripts without a
 * browser runtime.
 */
export const ALL_CONTENT = import.meta.env?.MODE === "dev-all";

/**
 * Filter for every `getCollection` call that hides drafts.
 *
 * A draft page has no route in the normal mode, so anything listing content has
 * to apply the same rule; centralising it keeps those call sites from drifting.
 */
export const visible = <Entry extends { data: { draft: boolean } }>(entry: Entry): boolean => ALL_CONTENT || !entry.data.draft;

/**
 * Resolves a content `enabled` flag for a page section.
 *
 * In the normal mode only an explicit `true` renders a section. `dev-all` is an
 * inspection mode and forces every section on.
 */
export const enabled = (flag: boolean | undefined): boolean => ALL_CONTENT || flag === true;

/**
 * The shape these helpers need, declared structurally so this module never
 * imports `astro:content`. Exported because the nav model (`nav.ts`) reads the
 * same pages through these helpers: one declaration keeps the two from drifting
 * apart when the frontmatter gains or loses a field.
 */
export interface PageLike {
  data: {
    draft: boolean;
    locale?: string;
    permalink: string;
    dropdown?: boolean;
    children?: Array<{ title: string; permalink: string }>;
  };
}

/**
 * The permalinks this render can link to.
 *
 * Built from every visible page, not only the `nav: true` ones: a dropdown child
 * is allowed to point at a page that is absent from the nav, and `cv` is exactly
 * that. The nav (`Header.astro`), the route set (`[...path].astro`) and
 * `renderable` below all read this one set, so a dropdown and a route agree on
 * which children still resolve.
 */
export const reachablePermalinks = (pages: readonly PageLike[], locale?: string): Set<string> =>
  new Set(
    pages
      .filter(visible)
      .filter(({ data }) => !locale || !data.locale || data.locale === locale)
      .map(({ data }) => data.permalink)
  );

/** Resolve child links against the same locale and visibility graph as routing. */
export const resolvedChildren = <Entry extends PageLike>(entry: Entry, reachable: ReadonlySet<string>) =>
  (entry.data.children ?? []).filter((child) => reachable.has(child.permalink));

/**
 * Whether a page has anything left to render.
 *
 * A `dropdown: true` page is only a container for its children, so once every
 * child points at a hidden page it has nothing to show and retires — from the
 * nav *and* from the route set, because its own page body lists those same
 * links. Hiding the last child therefore retires the container with it, and no
 * second frontmatter flag has to be kept in sync.
 */
export const renderable = (entry: PageLike, reachable: ReadonlySet<string>): boolean => {
  if (!visible(entry)) return false;
  if (!entry.data.dropdown) return true;
  return resolvedChildren(entry, reachable).length > 0;
};
