import { Cite, plugins } from "@citation-js/core";
import "@citation-js/plugin-bibtex";
import { z } from "astro/zod";

const rawEntry = z.object({ type: z.string(), label: z.string(), properties: z.record(z.string(), z.string()) });

/**
 * The BibTeX resource fields recognised as links.
 *
 * This is the one list of what a record may link to: `parseBibliography` copies
 * exactly these into `links`, and `publications.ts` derives the rendered actions
 * from it, so a field cannot be extracted but never shown (or vice versa).
 */
export const resourceFields = ["pdf", "html", "code", "website", "slides", "poster", "supp", "video", "blog"] as const;

export function parseBibliography(source: string) {
  const entries = z.array(rawEntry).parse(
    plugins.input.chain(source, {
      forceType: "@bibtex/text",
      target: "@bibtex/entries+list",
      generateGraph: false,
      maxChainLength: 10,
      strict: true,
    })
  );
  return entries.map((entry) => {
    const fields = entry.properties;
    const normalized = new Cite(entry, {
      forceType: "@bibtex/entry+object",
      generateGraph: false,
      maxChainLength: 10,
      strict: true,
      target: "@csl/list+object",
    }).data[0];
    if (!normalized) throw new Error(`Invalid BibTeX entry: ${entry.label}`);
    const bibtex = `@${entry.type}{${entry.label},\n${Object.entries(fields)
      .map(([key, value]) => `  ${key} = {${value}},`)
      .join("\n")}\n}`;
    const links = Object.fromEntries(resourceFields.map((key) => [key, fields[key] ?? ""]));
    return {
      id: entry.label,
      title: normalized.title ?? fields.title,
      authors: (normalized.author ?? []).map((author) => ({ given: author.given ?? "", family: author.family ?? "", literal: author.literal ?? "" })),
      year: Number(fields.year ?? normalized.issued?.["date-parts"]?.[0]?.[0]),
      month: normalized.issued?.["date-parts"]?.[0]?.[1] ?? 0,
      journal: normalized["container-title"] ?? fields.journal ?? fields.booktitle ?? "",
      volume: normalized.volume ?? "",
      issue: normalized.issue ?? "",
      pages: normalized.page ?? "",
      doi: normalized.DOI ?? "",
      links,
      preview: fields.preview ?? "",
      abstract: normalized.abstract ?? fields.abstract ?? "",
      language: normalized.language ?? "",
      annotation: (fields.annotation ?? normalized.annote ?? "").replace(/<[^>]*>/g, ""),
      scholarId: fields.google_scholar_id ?? "",
      bibtexShow: fields.bibtex_show !== "false",
      bibtex,
    };
  });
}
