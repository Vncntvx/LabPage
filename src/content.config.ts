import { file, glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { localeCodes } from "./i18n/locales";
import { parseBibliography } from "./lib/bibliography";
import { PAGE_IDS } from "./lib/render-shapes";

// Derived from the single locale declaration, so adding a locale cannot leave
// the frontmatter schema accepting a subset of it.
const localeSchema = z.enum(localeCodes);
const routeSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9][A-Za-z0-9._~-]*$/, "must be a single URL path segment");
const permalinkSchema = z
  .string()
  .trim()
  .regex(/^\/(?:[A-Za-z0-9._~-]+\/)*$/, "must be an absolute trailing-slash path");
const imagePathSchema = z.string().trim().min(1);

const profileSchema = z
  .object({
    image: imagePathSchema,
    image_circular: z.boolean().default(true),
    more_info: z.string().optional(),
  })
  .strict();

const scheduleMaterialSchema = z
  .object({
    name: z.string().trim().min(1),
    url: permalinkSchema,
  })
  .strict();

const scheduleEntrySchema = z
  .object({
    week: z.number().int().positive(),
    date: z.string().trim().min(1),
    topic: z.string().trim().min(1),
    description: z.string().trim().min(1),
    materials: z.array(scheduleMaterialSchema).default([]),
  })
  .strict();

const localizedContentSchema = z.object({
  locale: localeSchema.default("en"),
  title: z.string().trim().min(1),
  // Required and non-empty: a blank description renders an empty meta tag, and a
  // description equal to the title duplicates the heading on the rendered page.
  description: z.string().trim().min(1),
  draft: z.boolean().default(false),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: localizedContentSchema
    .extend({
      pageId: z.enum(PAGE_IDS),
      /**
       * Required: this is the only route source for a page. An omitted value used
       * to fall back to the locale home (`localeUrl(locale, undefined)`), silently
       * colliding with `about.md` and dropping one of the two routes.
       */
      permalink: permalinkSchema,
      nav: z.boolean().default(false),
      navOrder: z.number().optional(),
      subtitle: z.string().optional(),
      profile: profileSchema.optional(),
      researchQuestions: z.array(z.object({ title: z.string().trim().min(1), image: imagePathSchema }).strict()).default([]),
      research_summary: z
        .object({ enabled: z.boolean().default(true) })
        .strict()
        .optional(),
      announcements: z
        .object({
          enabled: z.boolean().default(true),
          scrollable: z.boolean().default(false),
          limit: z.number().int().positive().nullable().optional(),
        })
        .strict()
        .optional(),
      calendar: z
        .object({
          enabled: z.boolean().default(false),
          url: z.url().optional(),
        })
        .strict()
        .refine((calendar) => !calendar.enabled || Boolean(calendar.url), {
          message: "calendar.url is required when calendar.enabled is true",
        })
        .optional(),
      social: z.boolean().default(false),
      categories: z.array(z.string()).default([]),
      noindex: z.boolean().default(false),
      pdf: z.string().optional(),
      dropdown: z.boolean().default(false),
      children: z.array(z.object({ title: z.string().trim().min(1), permalink: permalinkSchema }).strict()).default([]),
    })
    .strict(),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: localizedContentSchema
    .extend({
      date: z.coerce.date(),
      inline: z.boolean().default(true),
    })
    .strict(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: localizedContentSchema
    .extend({
      image: z.string().optional(),
      github: z.url().optional(),
      importance: z.number().int().default(999),
      category: z.string().optional(),
      giscusComments: z.boolean().default(false),
      routeSlug: routeSchema,
    })
    .strict(),
});

const teachings = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/teachings" }),
  schema: localizedContentSchema
    .extend({
      term: z.string().optional(),
      /**
       * Required: the catalog in `Teaching.astro` groups courses by year, so an
       * omitted value dropped the course from `/teaching/` without any error while
       * its own detail route still shipped.
       */
      year: z.number().int().positive(),
      instructor: z.string().optional(),
      location: z.string().optional(),
      time: z.string().optional(),
      course_id: routeSchema,
      schedule: z.array(scheduleEntrySchema).default([]),
    })
    .strict(),
});

const people = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/people" }),
  schema: localizedContentSchema
    .extend({
      status: z.enum(["current", "alumni"]),
      role: z.string().trim().min(1),
      research: z.array(z.string().trim().min(1)).default([]),
      joined: z.string().trim().optional(),
      left: z.string().trim().optional(),
      homepage: z.url().optional(),
      order: z.number().int().default(999),
    })
    .strict(),
});

const opportunities = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/opportunities" }),
  schema: localizedContentSchema
    .extend({
      type: z.enum(["phd", "postdoc", "research-assistant", "visitor", "collaboration"]),
      status: z.enum(["open", "closed"]),
      deadline: z.string().trim().optional(),
      url: z.url().optional(),
      order: z.number().int().default(999),
    })
    .strict(),
});

const resources = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resources" }),
  schema: localizedContentSchema
    .extend({
      type: z.enum(["software", "dataset", "facility", "guide", "other"]),
      access: z.enum(["public", "restricted"]),
      url: z.url().optional(),
      maintainer: z.string().trim().optional(),
      order: z.number().int().default(999),
    })
    .strict(),
});

const cv = defineCollection({
  loader: file("src/data/cv.json"),
  schema: z
    .object({
      locale: localeSchema,
      name: z.string(),
      location: z.string(),
      email: z.string(),
      phone: z.string(),
      social_networks: z.array(z.object({ network: z.string(), username: z.string() }).strict()),
      sections: z.record(
        z.string(),
        z.array(
          z
            .object({
              institution: z.string().optional(),
              area: z.string().optional(),
              degree: z.string().optional(),
              start_date: z.union([z.string(), z.number()]).optional(),
              end_date: z.union([z.string(), z.number()]).optional(),
              location: z.string().optional(),
              highlights: z.array(z.string()).optional(),
              bullet: z.string().optional(),
              number: z.string().optional(),
            })
            .strict()
        )
      ),
    })
    .strict(),
});

const publications = defineCollection({
  loader: file("src/data/papers.bib", { parser: parseBibliography }),
  schema: z
    .object({
      // `parseBibliography` emits the BibTeX label as `id`; the `file()` loader
      // passes a parser's object through to validation unchanged, so it is part
      // of the entry data rather than an extra key to reject.
      id: z.string(),
      title: z.string().min(1),
      authors: z.array(z.object({ given: z.string(), family: z.string(), literal: z.string() }).strict()),
      year: z.number().int().min(1900),
      month: z.number().int().min(0).max(12),
      journal: z.string(),
      volume: z.string(),
      issue: z.string(),
      pages: z.string(),
      doi: z.string(),
      links: z.record(z.string(), z.string()),
      preview: z.string(),
      abstract: z.string(),
      language: z.string(),
      annotation: z.string(),
      scholarId: z.string(),
      bibtexShow: z.boolean(),
      bibtex: z.string(),
    })
    .strict(),
});

export const collections = {
  pages,
  news,
  projects,
  teachings,
  people,
  opportunities,
  resources,
  publications,
  cv,
};
