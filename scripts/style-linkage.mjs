/** Extract stylesheet links from a built HTML document. */
export const stylesheetHrefs = (html) => [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((match) => match[1]);
