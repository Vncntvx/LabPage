import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { visible } from "../../lib/dev-mode";
import { buildFeedOptions } from "../../lib/feed";
import { isLocale, prefixedLocales, strings } from "../../lib/i18n";

export function getStaticPaths() {
  return prefixedLocales.map((locale) => ({ params: { locale } }));
}

export async function GET({ params, site }: APIContext) {
  const locale = params.locale;
  // `getStaticPaths` only emits the prefixed locales, but `isLocale` keeps the
  // narrowing honest instead of asserting the literal type.
  if (!site) throw new Error("`site` is not set in astro.config.mjs, so the feed cannot build absolute URLs.");
  if (!locale || !isLocale(locale) || locale === "en") return new Response("Not found", { status: 404 });

  const news = await getCollection("news", (entry) => entry.data.locale === locale && visible(entry));
  return rss(buildFeedOptions(locale, site, news, strings(locale).feed));
}
