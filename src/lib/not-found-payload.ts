// The per-locale payload a 404 page ships so it can relabel its shell client-side
// when a server serves it for a locale it was not built for.
//
// The payload's shape is defined here, once, and consumed from both sides: the
// component that serializes it and the client module that reads it. The two used
// to be hand-written twins — the interface in the script and the object literal
// in the component — with no compile-time link between them, and every setter in
// the script silently skips an undefined value, so a key added to one side only
// would show up as a single English label on an otherwise Chinese page. Routing
// the construction through `notFoundPayload` makes a wrong key path a type error.
//
// The module imports `astro:content` for the page type only (erased at compile
// time) and keeps its runtime imports free of virtual modules, so the client side
// can `import type { LocaleCopy }` from it. `localeFromPath` is re-exported so the
// script takes the whole contract — data shape and routing rule — from one place.

import type { CollectionEntry } from "astro:content";
import { dateLabel } from "./date";
import { htmlLang, locales, localeUrl, ogLocale, strings, type Locale } from "./i18n";
import { flatNavLinks, navLinks } from "./nav";

type Page = CollectionEntry<"pages">;

/** Everything the relabel script writes into the shell, for one locale. */
export interface LocaleCopy {
  lang: string;
  /** The locale's own label as the switcher shows it (`English` / `中文`). */
  languageLabel: string;
  title: string;
  description: string;
  home: string;
  search: string;
  suggestions: string;
  navLabel: string;
  headerSearch: string;
  changeTheme: string;
  toggleNavigation: string;
  language: string;
  skip: string;
  readingProgress: string;
  copyright: string;
  powered: string;
  updated: string;
  back: string;
  feedTitle: string;
  shareImageAlt: string;
  ogLocaleValue: string;
  ogLocaleAlternateValue: string;
  searchPlaceholder: string;
  searchSelect: string;
  searchNavigate: string;
  searchClose: string;
  searchEmpty: string;
  searchLoading: string;
  searchLoadFailed: string;
  searchCount: { one: string; other: string };
  /** `undefined` when the site has no dated content, matching the footer. */
  updatedDate?: string;
  /** Route → title and href; hrefs come from `localeUrl`, never hand-joined. */
  nav: Record<string, { title: string; href: string }>;
  /**
   * Container route → title for dropdown parents, which render as a button with
   * no route of their own in the flat nav map. Empty unless a dropdown has a
   * reachable child.
   */
  dropdownTitles: Record<string, string>;
  homePath: string;
}

/**
 * Builds one locale's copy. `pages` is read once per build and shared by every
 * locale's nav map; `lastUpdated` is the shared content date, which does not vary
 * by locale — only its formatted label does.
 */
export const notFoundPayload = (locale: Locale, pages: readonly Page[], lastUpdated: Date | undefined): LocaleCopy => {
  const ui = strings(locale);
  const otherLocale: Locale = locale === "en" ? "zh-CN" : "en";
  const navByRoute = flatNavLinks(pages, locale);
  return {
    lang: htmlLang(locale),
    languageLabel: locales.find((entry) => entry.code === locale)!.label,
    title: ui.not_found.title,
    description: ui.not_found.description,
    home: ui.not_found.home,
    search: ui.not_found.search,
    suggestions: ui.not_found.suggestions,
    navLabel: ui.labels.primary,
    headerSearch: ui.header.search,
    changeTheme: ui.header.change_theme,
    toggleNavigation: ui.header.toggle_navigation,
    language: ui.labels.language,
    skip: ui.labels.skip,
    readingProgress: ui.header.reading_progress,
    copyright: ui.footer.copyright,
    powered: ui.labels.powered,
    updated: ui.footer.last_updated,
    back: ui.labels.back,
    feedTitle: ui.feed.title,
    shareImageAlt: ui.share_image_alt,
    ogLocaleValue: ogLocale(locale),
    ogLocaleAlternateValue: ogLocale(otherLocale),
    searchPlaceholder: ui.search.placeholder,
    searchSelect: ui.search.footer.select,
    searchNavigate: ui.search.footer.navigate,
    searchClose: ui.search.footer.close,
    searchEmpty: ui.search.empty,
    searchLoading: ui.search.loading,
    searchLoadFailed: ui.search.load_failed,
    searchCount: ui.search.result_count,
    updatedDate: lastUpdated ? dateLabel(lastUpdated, locale) : undefined,
    nav: Object.fromEntries(Object.entries(navByRoute).map(([route, title]) => [route, { title, href: localeUrl(locale, route) }])),
    dropdownTitles: Object.fromEntries(
      navLinks(pages, locale)
        .filter((item) => item.isDropdown)
        .map((item) => [item.path, item.title])
    ),
    homePath: localeUrl(locale),
  };
};

export { localeFromPath } from "./locale";

/** Serializes the payload for the JSON tag; `<`-escaping keeps `</script>` out. */
export const serializeNotFoundData = (payload: Record<string, LocaleCopy>): string => JSON.stringify({ payload }).replace(/</g, "\\u003c");
