/**
 * Relabels a 404 page that was served for a locale it was not built for.
 *
 * WHY THIS EXISTS AT ALL. Astro emits one status page per route file, and a
 * server that cannot find a matching file falls back to a single default — here
 * `dist/404.html`, the English one. So `/zh-CN/anything/` renders an English
 * shell: heading, buttons, nav, footer and search dialog all in the wrong
 * language, with no way to reach the translated copy because the page has no
 * server-side locale of its own.
 *
 * The fix cannot be a second static file: which file a server serves for a
 * missing path is the server's decision, not the build's. So the locale's strings
 * travel with the page and are applied on the client.
 *
 * WHY THIS IS A MODULE, NOT AN INLINE SCRIPT. Astro bundles and minifies a
 * module's body (this one lands inline at ~2.8 KB, under Vite's 4 KB
 * inline-script limit) and the payload travels as a JSON tag, so the data stays
 * data instead of being re-serialized into the script source.
 *
 * SCOPE, DELIBERATE. Only the shell is relabelled — the shared chrome plus this
 * page's own copy, head metadata included. Body content is not translated,
 * because a 404 has none. This does not replace the real `/zh-CN/404/` route,
 * which remains the correctly-built page and is what a server configured for
 * per-locale error pages will serve; it repairs the case where the server is not.
 *
 * DOM CONTRACT. Every node this script writes carries a `data-*` marker declared
 * by the component that renders it; the script reaches nothing by class or tag
 * name, so a style-only refactor cannot silently break the relabelling:
 *   head:     data-meta-description, data-og-title, data-og-description,
 *             data-og-locale, data-og-locale-alternate, data-og-image-alt,
 *             data-twitter-title, data-twitter-description, data-feed-title
 *             (BaseLayout)
 *   shell:    data-skip-link (BaseLayout), data-reading-progress (Header)
 *   header:   data-nav-primary, data-nav-route, data-nav-dropdown-label,
 *             data-header-search, data-control-label, data-theme-button,
 *             data-language-toggle, data-home-link
 *   footer:   data-footer-copyright, data-footer-powered, data-footer-updated,
 *             data-footer-date, data-footer-back
 *   dialog:   data-search-placeholder, data-search-placeholder-aria,
 *             data-site-search-input, data-search-select, data-search-navigate,
 *             data-search-close-label, data-search-close,
 *             data-search-empty-message, data-search-status
 *   page:     data-not-found-heading, data-page-title, data-page-description,
 *             data-not-found-home, data-not-found-search,
 *             data-not-found-suggestions, data-not-found-suggestions-title,
 *             data-not-found-suggestion
 */
import { localeFromPath, type LocaleCopy } from "../lib/not-found-payload";

const apply = () => {
  const tag = document.getElementById("not-found-locale-data");
  if (!tag?.textContent) return;
  let parsed: { payload: Record<string, LocaleCopy> };
  try {
    parsed = JSON.parse(tag.textContent);
  } catch {
    return;
  }
  const { payload } = parsed;

  const matched = localeFromPath(window.location.pathname);
  if (!matched) return;
  const copy = payload[matched];
  if (!copy) return;

  // The build writes one `lang` for the whole page, so a match means every node
  // on it is already in this locale and the entire rewrite below would be a
  // no-op. Bail before the first DOM write.
  if (document.documentElement.lang === copy.lang) return;

  document.documentElement.lang = copy.lang;

  // The locale drives which index the dialog fetches, so it has to change with
  // the label or a relabelled page would search the wrong language's content.
  const dialog = document.querySelector<HTMLElement>("[data-search-dialog]");
  if (dialog) dialog.dataset.locale = matched;

  const setText = (selector: string, text: string | undefined) => {
    if (text === undefined) return;
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = text;
    });
  };
  const setAttr = (selector: string, attribute: string, value: string | undefined) => {
    if (value === undefined) return;
    document.querySelectorAll(selector).forEach((node) => {
      node.setAttribute(attribute, value);
    });
  };

  const relabelHead = () => {
    // `document.title` and the `<title>` element are the same node, so one write
    // covers both; the og/twitter copies are separate meta tags.
    document.title = copy.title;
    setAttr("[data-meta-description]", "content", copy.description);
    setAttr("[data-og-title]", "content", copy.title);
    setAttr("[data-og-description]", "content", copy.description);
    setAttr("[data-og-locale]", "content", copy.ogLocaleValue);
    setAttr("[data-og-locale-alternate]", "content", copy.ogLocaleAlternateValue);
    setAttr("[data-og-image-alt]", "content", copy.shareImageAlt);
    setAttr("[data-twitter-title]", "content", copy.title);
    setAttr("[data-twitter-description]", "content", copy.description);
    setText("[data-feed-title]", copy.feedTitle);
  };

  const relabelPage = () => {
    setText("[data-page-title]", copy.title);
    setText("[data-page-description]", copy.description);
    setText("[data-not-found-home]", copy.home);
    setText("[data-not-found-search]", copy.search);
    setAttr("[data-not-found-suggestions]", "aria-label", copy.suggestions);
    setText("[data-not-found-suggestions-title]", copy.suggestions);

    // The suggestion list is emitted once, in the build's locale; retitle each
    // link by matching its own route, which is stable across locales, and
    // repoint it — the emitted href carries the build's prefix and would
    // otherwise send the visitor out of this locale.
    document.querySelectorAll<HTMLAnchorElement>("[data-not-found-suggestion]").forEach((link) => {
      const route = link.dataset.notFoundSuggestion ?? "/";
      const entry = route === "/" ? undefined : copy.nav[route];
      if (entry) link.textContent = entry.title;
      link.href = entry ? entry.href : copy.homePath;
    });
  };

  const relabelHeader = () => {
    setText("[data-skip-link]", copy.skip);
    setAttr("[data-nav-primary]", "aria-label", copy.navLabel);
    setAttr("[data-reading-progress]", "aria-label", copy.readingProgress);
    setAttr("[data-theme-button]", "aria-label", copy.changeTheme);
    setAttr("[data-theme-button]", "title", copy.changeTheme);
    setAttr("[data-language-toggle]", "aria-label", copy.language);
    setText("[data-language-toggle] [data-control-label]", copy.languageLabel);

    // The header renders its nav from the build's locale, so both the labels and
    // the hrefs have to follow the switch. Each link is keyed by its own route,
    // which is the one thing stable across locales.
    document.querySelectorAll<HTMLAnchorElement>("[data-nav-primary] a[data-nav-route]").forEach((link) => {
      const route = link.dataset.navRoute ?? "/";
      const entry = copy.nav[route];
      if (entry) {
        link.textContent = entry.title;
        link.href = entry.href;
      }
    });

    // A dropdown container is a button, not a link: it has no href to repoint,
    // only its label to retitle. Today no dropdown has a reachable child, so the
    // nav map carries no container titles — this covers the case where one does.
    document.querySelectorAll<HTMLElement>("[data-nav-dropdown-label]").forEach((label) => {
      const route = label.dataset.navDropdownLabel ?? "";
      const title = copy.dropdownTitles[route];
      if (title) label.textContent = title;
    });

    // Control labels are scoped to their own control, because the same marker
    // renders on several buttons and each carries a different string.
    setText("[data-nav-toggle] [data-control-label]", copy.toggleNavigation);
    setText("[data-header-search] [data-control-label]", copy.headerSearch);
    setText("[data-theme-button] [data-control-label]", copy.changeTheme);
    setAttr("[data-header-search]", "aria-label", copy.headerSearch);
    setAttr("[data-header-search]", "title", copy.headerSearch);
  };

  const relabelFooter = () => {
    setText("[data-footer-copyright]", copy.copyright);
    setText("[data-footer-powered]", copy.powered);
    setText("[data-footer-updated]", copy.updated);
    setText("[data-footer-date]", copy.updatedDate);
    setText("[data-footer-back]", copy.back);
  };

  const relabelSearch = () => {
    setText("[data-search-placeholder]", copy.searchPlaceholder);
    setAttr("[data-search-placeholder-aria]", "aria-label", copy.searchPlaceholder);
    setAttr("[data-site-search-input]", "placeholder", copy.searchPlaceholder);
    setText("[data-search-select]", copy.searchSelect);
    setText("[data-search-navigate]", copy.searchNavigate);
    setText("[data-search-close-label]", copy.searchClose);
    setAttr("[data-search-close]", "aria-label", copy.searchClose);
    setText("[data-search-empty-message]", copy.searchEmpty);
    setAttr("[data-search-status]", "data-count-one", copy.searchCount.one);
    setAttr("[data-search-status]", "data-count-other", copy.searchCount.other);
    setAttr("[data-search-status]", "data-count-locale", matched);
    setAttr("[data-search-status]", "data-load-loading", copy.searchLoading);
    setAttr("[data-search-status]", "data-load-failed", copy.searchLoadFailed);
  };

  relabelHead();
  relabelPage();
  relabelHeader();
  relabelFooter();
  relabelSearch();

  // The header's home link and the page's own home button carry the build's
  // locale until they are repointed, which would send a visitor to the wrong
  // language from a page they reached in this one.
  setAttr("[data-home-link]", "href", copy.homePath);
};

apply();
