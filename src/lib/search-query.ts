// Search-term matching shared by the site-wide search modal and the publication
// filter. Kept free of DOM access so build-time tooling can import it under plain Node.

/**
 * Splits a raw input value into normalized search terms.
 *
 * `NFKC` folds full-width and compatibility forms onto their canonical ones, so
 * a query typed with an IME matches the same text written normally. Case folding
 * is locale-aware (`toLocaleLowerCase`) for the same reason.
 */
export const termsOf = (value: string): string[] => value.normalize("NFKC").toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);

/** Normalizes text for comparison with `termsOf` output. */
export const normalizeHaystack = (value: string): string => value.normalize("NFKC").toLocaleLowerCase();

/**
 * Whether every term appears somewhere in the haystack — an AND over the terms,
 * so more words narrow the result rather than widening it.
 */
export const matchesTerms = (terms: readonly string[], haystack: string): boolean => terms.every((term) => haystack.includes(term));
