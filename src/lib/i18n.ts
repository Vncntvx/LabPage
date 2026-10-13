// UI copy for each locale. Routing and locale primitives live in `./locale`,
// which has no JSON imports; re-exported here so existing importers of
// `./i18n` are unaffected.

import en from "../data/locale/en/strings.json";
import zh from "../data/locale/zh-CN/strings.json";
import { type Locale } from "./locale.ts";

export * from "./locale.ts";
export { currentYear, dateLabel, latestDate, yearMonthLabel } from "./date.ts";

export const strings = (locale: Locale) => ({ en, "zh-CN": zh })[locale];

export const labels = (locale: Locale) => strings(locale).labels;
