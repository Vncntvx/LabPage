// Shared RSS channel construction for every locale's feed route. Imports only
// `./locale` and `./content`, so build-time scripts can load it under plain Node; the
// channel copy is passed in by the route, which is where `./i18n` is available.

import { entryRoute } from "./content.ts";
import { localeUrl, type Locale } from "./locale.ts";

/** The minimum an entry needs to become a feed item. */
export interface FeedEntry {
  id: string;
  data: { title: string; description: string; date: Date };
}

export interface FeedItem {
  title: string;
  description: string;
  pubDate: Date;
  link: string;
}

/** Channel copy, read from `strings(locale).feed` by the route. */
export interface FeedCopy {
  title: string;
  description: string;
}

/** The `<language>` element value for a locale. */
export const feedLanguage = (locale: Locale) => (locale === "zh-CN" ? "zh-CN" : "en");

/** Absolute URL of a locale's feed, used for `<atom:link rel="self">`. */
export const feedUrl = (locale: Locale, site: string | URL) => new URL(localeUrl(locale, "/feed.xml"), site).href;

/** News items, newest first. Descriptions come from the required schema field. */
export const buildFeedItems = (locale: Locale, entries: FeedEntry[]): FeedItem[] =>
  entries
    .map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: localeUrl(locale, entryRoute("news", entry)),
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

export const feedCustomData = (locale: Locale, site: string | URL) =>
  [
    `<language>${feedLanguage(locale)}</language>`,
    `<atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${feedUrl(locale, site)}" rel="self" type="application/rss+xml"/>`,
  ].join("");

/** Options for `rss()`; `site` is non-null because `astro.config.mjs` sets it. */
export const buildFeedOptions = (locale: Locale, site: string | URL, entries: FeedEntry[], copy: FeedCopy) => ({
  title: copy.title,
  description: copy.description,
  site,
  items: buildFeedItems(locale, entries),
  customData: feedCustomData(locale, site),
});
