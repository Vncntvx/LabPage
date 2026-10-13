/**
 * Pure helpers for rendering `src/data/papers.bib` entries. Kept out of the
 * component so the rendering contract stays independent of the view.
 */

import { resolveRemoteAssetUrl } from "./remote-assets";
import { isExternalUrl } from "./url";

export interface PublicationAuthor {
  given: string;
  family: string;
  literal: string;
}

/**
 * The actions rendered under a publication, in display order.
 *
 * The set is `resourceFields` in `bibliography.ts` — what a record may link to.
 * The bibliography parser contract asserts the two stay equal, so a field added to
 * one and not the other fails rather than silently never appearing.
 */
export const actionTypes = ["html", "pdf", "supp", "video", "blog", "code", "poster", "slides", "website"] as const;
export type ActionType = (typeof actionTypes)[number];

export const authorName = (author: PublicationAuthor, language: string) => {
  if (author.literal) return author.literal;
  if (language.startsWith("zh") || /[\u4e00-\u9fff]/u.test(`${author.given}${author.family}`)) {
    return `${author.given}${author.family}`.replace(/\s+/g, "");
  }
  return `${author.given} ${author.family}`.trim();
};

/** Split a rendered author name into the name and its trailing role markers (`*`, `†`, …). */
export const authorParts = (name: string) => {
  const match = name.match(/^(.*?)([*∗†‡§¶‖&^]+)$/);
  return { name: match?.[1]?.trim() ?? name, markers: match?.[2] ?? "" };
};

export const isSelf = (name: string) => /(?:wenjie\s*xu|徐\s*文杰)/i.test(name);

/**
 * Resolve a BibTeX link value to a URL. Absolute and root-relative values pass
 * through; a bare filename is only meaningful for `pdf`, the one resource
 * directory the site actually serves. Anything else is dropped rather than
 * linked to a 404.
 */
export const resourceUrl = (value: string, type: ActionType): string | undefined => {
  if (isExternalUrl(value) || value.startsWith("/")) return value;
  if (type === "pdf") return resolveRemoteAssetUrl(`/assets/pdf/${value}`);
  return undefined;
};

export const citationCount = (paperCitations: Record<string, { citations: number }>, scholarId: string, scholarUserId: string) =>
  paperCitations[`${scholarUserId}:${scholarId}`]?.citations;

export const actionLabel = (type: ActionType, labels: Record<string, unknown>) => {
  const label = labels[type];
  return typeof label === "string" ? label : type.toUpperCase();
};
