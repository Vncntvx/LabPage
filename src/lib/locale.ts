// Locale primitives with no JSON or virtual-module dependencies, so modules
// build-time code can import them under plain Node. UI copy (`strings`,
// `labels`) lives in `./i18n.ts`, which re-exports everything here — consumers
// that only need routing keep importing from `./i18n`.
//
// The relative imports below carry explicit `.ts` extensions: this module is
// reachable from `scripts/*.mjs` and from Bun, both
// of which resolve the extension as written. Inside `src/`, extensionless
// imports work too (Vite resolves them); the two styles coexist by module, not
// by rule.

import { defaultLocale, localeCodes, locales, type Locale } from "../i18n/locales.ts";

export { defaultLocale, localeCodes, locales };
export type { Locale };

export const isLocale = (value: string): value is Locale => localeCodes.includes(value as Locale);

const escapeForRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/**
 * Locales that carry a URL prefix, i.e. every locale but the unprefixed default.
 * `src/pages/[locale]/` routes build their `getStaticPaths` from this rather than
 * re-deriving the default-locale rule at each route.
 */
export const prefixedLocales = localeCodes.filter((code) => code !== defaultLocale);
const localePrefix = prefixedLocales.length ? new RegExp(`^/(?:${prefixedLocales.map(escapeForRegExp).join("|")})(?=/|$)`) : undefined;

const stripLocalePrefix = (route: string) => {
  const normalized = route.startsWith("/") ? route : `/${route}`;
  return (localePrefix ? normalized.replace(localePrefix, "") : normalized) || "/";
};

export const localeUrl = (locale: Locale, route = "/") => {
  const normalized = stripLocalePrefix(route);
  return locale === defaultLocale ? normalized : `/${locale}${normalized}`;
};

export const pathWithoutLocale = (path: string) => stripLocalePrefix(path);

/**
 * The locale a URL path belongs to, or `undefined` for the unprefixed default
 * locale's own paths.
 *
 * The default locale carries no prefix, so its paths cannot be recognised as
 * belonging to it — `/anything/` is simply "no prefixed locale matched", and the
 * caller already knows it is looking at the default locale. Longest prefix wins,
 * so a future locale whose code is a prefix of another (`zh` beside `zh-CN`)
 * resolves to the more specific one.
 */
export const localeFromPath = (pathname: string): Locale | undefined =>
  prefixedLocales.filter((code) => pathname === `/${code}` || pathname.startsWith(`/${code}/`)).sort((a, b) => b.length - a.length)[0];

export const ogLocale = (locale: Locale) => (locale === "zh-CN" ? "zh_CN" : "en_US");

/**
 * Share-card path per locale. These live in `public/` so the URL stays stable
 * across builds; `scripts/generate-og-images.mjs` writes the files.
 */
export const ogImagePath = (locale: Locale) => `/assets/img/og-${locale}.png`;

export const htmlLang = (locale: Locale) => locales.find((entry) => entry.code === locale)!.lang;
