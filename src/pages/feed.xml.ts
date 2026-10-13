import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { visible } from "../lib/dev-mode";
import { buildFeedOptions } from "../lib/feed";
import { strings } from "../lib/i18n";

export async function GET({ site }: APIContext) {
  // `astro.config.mjs` sets `site`; every feed URL is absolute, so a missing
  // value must fail the build rather than emit relative links.
  if (!site) throw new Error("`site` is not set in astro.config.mjs, so the feed cannot build absolute URLs.");
  const news = await getCollection("news", (entry) => entry.data.locale === "en" && visible(entry));
  return rss(buildFeedOptions("en", site, news, strings("en").feed));
}
