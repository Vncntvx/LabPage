// Finds `<meta>` tags whose `content` attribute is empty, so `verify-dist.mjs`
// can assert that rendered descriptions never regress to a blank value.
//
// Open Graph tags are written with `property=`, Twitter card tags with `name=`.
// An assertion that assumes one form silently passes when the layout uses the
// other, so both are matched: checking `property="twitter:description"` alone
// let an empty `<meta name="twitter:description" content="">` through.
//
// Importable from plain Node: no DOM and no virtual modules.

/** Captures the attributes of each `<meta>` tag, with or without a trailing slash. */
const metaTagPattern = /<meta\s+([^>]*?)\s*\/?>/g;

const attributeOf = (attributes, key) => new RegExp(`\\b${key}\\s*=\\s*"([^"]*)"`).exec(attributes)?.[1];

/**
 * @param {string} html a rendered page
 * @param {string[]} identifiers tag names to inspect, matched against either the
 *   `name=` or the `property=` attribute, whichever the layout used
 * @returns {string[]} the identifiers that were present with empty or missing
 *   `content`, in document order; an absent tag is not reported
 */
export function emptyMetaContent(html, identifiers) {
  const wanted = new Set(identifiers);
  const empty = [];

  for (const [, attributes] of html.matchAll(metaTagPattern)) {
    // `property ?? name`: Open Graph uses one, Twitter cards the other, and a
    // layout may legitimately switch conventions per tag.
    const identifier = attributeOf(attributes, "property") ?? attributeOf(attributes, "name");
    if (!identifier || !wanted.has(identifier)) continue;
    if (!attributeOf(attributes, "content")?.trim()) empty.push(identifier);
  }

  return empty;
}
