import { getCollection } from "astro:content";
import { entryRoute } from "./content";
import { reachablePermalinks, renderable, visible } from "./dev-mode";
import { localeUrl, type Locale } from "./i18n";
import { authorName } from "./publications";

export interface SearchEntry {
  title: string;
  description: string;
  url: string;
  type: string;
}

export async function getSearchEntries(locale: Locale): Promise<SearchEntry[]> {
  // Read every page unfiltered first: the reachable set is the input to the
  // per-entry `renderable` decision, so it cannot be built from a prefiltered
  // list. This mirrors the route set in `[...path].astro` exactly — a page that
  // retires from the routes (a dropdown whose children all point at hidden
  // pages) must not stay in the index, or search would link to a 404.
  const allPages = await getCollection("pages");
  const reachable = reachablePermalinks(allPages, locale);
  const pages = allPages.filter((entry) => entry.data.locale === locale && renderable(entry, reachable));
  const [news, projects, teachings, publications] = await Promise.all([
    getCollection("news", (entry) => entry.data.locale === locale && visible(entry)),
    getCollection("projects", (entry) => entry.data.locale === locale && visible(entry)),
    getCollection("teachings", (entry) => entry.data.locale === locale && visible(entry)),
    getCollection("publications"),
  ]);

  return [
    ...pages.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      url: localeUrl(locale, entryRoute(entry.collection, entry)),
      type: "page",
    })),
    ...news.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      url: localeUrl(locale, entryRoute(entry.collection, entry)),
      type: "news",
    })),
    ...projects.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      url: localeUrl(locale, entryRoute(entry.collection, entry)),
      type: "project",
    })),
    ...teachings.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      url: localeUrl(locale, entryRoute(entry.collection, entry)),
      type: "teaching",
    })),
    ...publications.map(({ data }) => ({
      title: data.title,
      description: `${data.authors.map((author) => authorName(author, data.language)).join(", ")} ${data.journal} ${data.year}`,
      url: localeUrl(locale, "/publications/"),
      type: "publication",
    })),
  ];
}
