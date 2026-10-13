// The header's navigation model, built from the `pages` collection.
//
// This lives outside `Header.astro` because two callers need it now: the header
// renders it, and the 404 page embeds a flattened copy of it per locale so it can
// relabel its own shell when it is served for a locale it was not built for. Two
// copies of this ordering rule would drift the moment a page's `navOrder`
// changed, and drift would show up as a nav in the wrong order on one page only.
//
// The entry type is `CollectionEntry<"pages">`, imported type-only so it is
// erased at compile time and this module still carries no runtime dependency on
// `astro:content`. The schema already guarantees the fields the nav reads are
// present (`content.config.ts`), so no field is optional here: if the schema
// ever drops one, every caller fails to compile instead of silently rendering a
// blank nav label.

import type { CollectionEntry } from "astro:content";
import { reachablePermalinks, renderable, resolvedChildren } from "./dev-mode";
import { labels, type Locale } from "./i18n";

type Page = CollectionEntry<"pages">;

export interface NavLinkItem {
  title: string;
  path: string;
  isDropdown: boolean;
  children: Array<{ title: string; permalink: string }>;
}

/** One navigation entry per link, in the order the header renders them. */
export const navLinks = (pages: readonly Page[], locale: Locale): NavLinkItem[] => {
  // Unfiltered first: the reachable set is the input to `renderable`.
  const reachable = reachablePermalinks(pages, locale);
  const navEntries = pages.filter((entry) => entry.data.locale === locale && renderable(entry, reachable));
  const about = navEntries.find(({ data }) => data.pageId === "about");

  return [
    { title: about?.data.title ?? labels(locale).home, path: "/", isDropdown: false, children: [] },
    ...navEntries
      .filter(({ data }) => data.nav && data.pageId !== "about")
      .map((entry) => ({ data: entry.data, children: resolvedChildren(entry, reachable) }))
      .sort((a, b) => {
        const orderA = a.data.navOrder ?? (a.data.dropdown ? 999 : 50);
        const orderB = b.data.navOrder ?? (b.data.dropdown ? 999 : 50);
        if (orderA !== orderB) return orderA - orderB;
        if (a.data.dropdown && !b.data.dropdown) return 1;
        if (!a.data.dropdown && b.data.dropdown) return -1;
        return 0;
      })
      .map(({ data, children }) => ({
        title: data.title,
        path: data.permalink,
        isDropdown: Boolean(data.dropdown && children.length > 0),
        children,
      })),
  ];
};

/**
 * The same navigation flattened to one `{path, title}` per link, in the order the
 * header renders them. A dropdown contributes its children, not its own
 * container, because the container is only a list of those links.
 */
export const flatNavEntries = (pages: readonly Page[], locale: Locale): Array<{ path: string; title: string }> =>
  navLinks(pages, locale).flatMap((item) =>
    item.isDropdown ? item.children.map((child) => ({ path: child.permalink, title: child.title })) : [{ path: item.path, title: item.title }]
  );

/**
 * The same flattened navigation keyed by locale-less route, for lookup by route
 * rather than by order — the 404 relabel script retitles each link by its own
 * route, which is the one thing stable across locales. Insertion order matches
 * `flatNavEntries`, but consumers look keys up and must not rely on it.
 *
 * A route that is both a top-level link and a dropdown child is rejected rather
 * than last-wins: `dev-mode` allows a dropdown child to point at a page that is
 * absent from the nav, but nothing stops the same page also carrying `nav: true`
 * — today only `cv` sits in both roles, and it stays out of the collision only
 * because it is `nav: false`.
 */
export const flatNavLinks = (pages: readonly Page[], locale: Locale): Record<string, string> => {
  const byRoute = new Map<string, string>();
  for (const { path, title } of flatNavEntries(pages, locale)) {
    if (byRoute.has(path)) throw new Error(`nav route ${path} is both a top-level link and a dropdown child`);
    byRoute.set(path, title);
  }
  return Object.fromEntries(byRoute);
};
