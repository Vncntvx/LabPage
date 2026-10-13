import type { Locale } from "../i18n/locales";

const localeTag = (locale: Locale) => (locale === "zh-CN" ? "zh-CN" : "en-US");

/**
 * The newest date in a list, or `undefined` when it is empty.
 *
 * `Math.max(...[])` is `-Infinity`, and `new Date(-Infinity).toISOString()`
 * throws, so the footer's "last updated" line needs an explicit empty case
 * rather than folding the reduction into a `Date`.
 */
export const latestDate = (dates: readonly Date[]): Date | undefined =>
  dates.length ? new Date(Math.max(...dates.map((date) => date.getTime()))) : undefined;

// `Intl.DateTimeFormat` construction is comparatively expensive, and the same
// few formatters are built on every row of every page — memoized per tag the way
// `count.ts` memoizes `Intl.PluralRules`.
const formatters = new Map<string, Intl.DateTimeFormat>();

const formatterFor = (locale: Locale, options: Intl.DateTimeFormatOptions) => {
  const tag = localeTag(locale);
  const key = `${tag}\u0000${JSON.stringify(options)}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(tag, options);
    formatters.set(key, formatter);
  }
  return formatter;
};

export const dateLabel = (date: Date, locale: Locale) =>
  formatterFor(locale, { year: "numeric", month: "short", day: "numeric", timeZone: "Asia/Shanghai" }).format(date);

/** The current year in the site's timezone, as a four-digit string. */
export const currentYear = (now = new Date()) => formatterFor("en", { year: "numeric", timeZone: "Asia/Shanghai" }).format(now);

/** Localized "Dec 2025" / "2025年12月"; falls back to the bare year when no month is known. */
export const yearMonthLabel = (year: number, month: number, locale: Locale) =>
  month > 0
    ? formatterFor(locale, { year: "numeric", month: "short", timeZone: "Asia/Shanghai" }).format(new Date(Date.UTC(year, month - 1, 1)))
    : String(year);
