/**
 * The single source of truth for the site's locales. `astro.config.mjs`,
 * `src/lib/i18n.ts`, and `scripts/audit-strings.mjs` all derive from this.
 */
export const locales = [
  { code: "en", lang: "en", label: "English" },
  { code: "zh-CN", lang: "zh-CN", label: "中文" },
] as const;

export const localeCodes = locales.map((locale) => locale.code);

/**
 * The locale served without a URL prefix. Declared here so `astro.config.mjs`,
 * the route files, and `scripts/noindex-routes.mjs` all read one value; the
 * prefixing rule is not worth re-deciding per call site.
 */
export const defaultLocale = "en";

export type Locale = (typeof locales)[number]["code"];
