// URL classification shared by the components and helpers that decide whether a
// link leaves the site. No imports, so any module — component, lib or script —
// can use it.

/**
 * Whether a URL points somewhere other than this site: an absolute `http(s)`
 * URL or a protocol-relative `//host/...` one.
 *
 * Root-relative paths (`/about/`), `mailto:` and `tel:` links are not external,
 * so a plain `startsWith("http")` — which also matches a bare `httpfoo` value —
 * is not a substitute for this.
 */
export const isExternalUrl = (url: string): boolean => /^(?:https?:)?\/\//.test(url);
