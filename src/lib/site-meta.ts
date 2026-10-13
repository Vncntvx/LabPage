import { getCollection } from "astro:content";
import { latestDate } from "./date";
import { visible } from "./dev-mode";

/**
 * The newest content date shown in the footer, or `undefined` when there is
 * nothing to show.
 *
 * This lives apart from `Footer.astro` because the 404 page renders the footer's
 * "last updated" line for every locale, not just the one it was built for — it
 * needs the per-locale value at build time, and the footer only computes its own.
 *
 * The value is memoized per process: content is static for the whole build, and
 * `getCollection` rebuilds its result array on every call (Astro caches the data
 * store, not the entries), so the footer and the 404 payload would otherwise
 * each pay for a full read of both collections. A dev server restart picks up
 * content changes; a hot edit within a session may show a stale date until it
 * restarts, which the footer's own "last updated" text already tolerates.
 */
let cached: Promise<Date | undefined> | undefined;

const compute = async (): Promise<Date | undefined> => {
  const [news, publications] = await Promise.all([getCollection("news", visible), getCollection("publications")]);
  // Draft entries are excluded: their date must not surface anywhere before the
  // entry is live.
  return latestDate([
    ...news.map(({ data }) => data.date),
    ...publications.map(({ data }) => new Date(Date.UTC(data.year, Math.max(data.month, 1) - 1, 1))),
  ]);
};

export const lastUpdatedDate = (): Promise<Date | undefined> => (cached ??= compute());
