// Hash-fragment parsing for browser code, kept free of DOM access so build-time
// tooling can import it under plain Node.

/**
 * Decodes the search query a URL fragment carries, given the fragment itself —
 * the part after `#`, so `/publications/#risk` passes `"risk"`.
 *
 * `decodeURIComponent` throws `URIError` on a malformed escape such as `#100%`,
 * and a fragment is entirely user- or link-controlled, so a bad value must not
 * take down the script that reads it. An undecodable fragment degrades to "no
 * query" instead.
 */
export const parseHashQuery = (fragment: string) => {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return "";
  }
};
