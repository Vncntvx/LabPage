# LabPage Configuration Guide

This document is the configuration reference for the LabPage repository. It is
written for developers who maintain the source tree, content, assets, build
checks, and GitHub Actions workflows.

It covers configuration stored in this repository. It does not document
production-server accounts, SSH credentials, GitHub Secrets, or commands that
must be run directly on the server.

## Contents

- [Configuration principles](#configuration-principles)
- [Repository map](#repository-map)
- [Runtime and dependencies](#runtime-and-dependencies)
- [Locales and URL routing](#locales-and-url-routing)
- [Content collections and frontmatter](#content-collections-and-frontmatter)
- [About page and profile configuration](#about-page-and-profile-configuration)
- [Localized UI text and structured data](#localized-ui-text-and-structured-data)
- [Research, publications, projects, and teaching](#research-publications-projects-and-teaching)
- [Assets and static files](#assets-and-static-files)
- [Adding or changing pages and components](#adding-or-changing-pages-and-components)
- [Build and verification commands](#build-check-and-verification-commands)
- [CI, deployment, and dependency updates](#ci-deployment-and-dependency-updates)
- [Ignore files and Markdown rules](#ignore-files-and-markdown-rules)
- [Common tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Configuration principles

### Use the existing source of truth

Use the following files for the corresponding decisions:

| Concern | Source of truth |
| --- | --- |
| Supported locales | [`src/i18n/locales.ts`](./src/i18n/locales.ts) |
| Astro locale routing | [`astro.config.mjs`](./astro.config.mjs) |
| Route construction | [`src/lib/locale.ts`](./src/lib/locale.ts) |
| Content fields and validation | [`src/content.config.ts`](./src/content.config.ts) |
| UI translations | [`src/data/locale/`](./src/data/locale/) |
| Render shapes and routing | [`src/lib/render-shapes.ts`](./src/lib/render-shapes.ts) |
| Shape views | [`src/views/`](./src/views/) |
| Publications | [`src/data/papers.bib`](./src/data/papers.bib) |
| CV data | [`src/data/cv.json`](./src/data/cv.json) |
| Social links | [`src/data/socials.json`](./src/data/socials.json) |
| Site-wide styles | [`src/styles/global.css`](./src/styles/global.css) |
| CI checks | [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) |
| Deployment | [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) |

Do not create a second parser, duplicate a data source, or hard-code a locale
prefix when an existing helper already owns that behavior.

### Keep both locales in sync

Every published content entry must exist in both `en` and `zh-CN` unless the
repository's content audit explicitly supports an exception. Keep these
properties synchronized:

- The file basename or route identifier.
- The `locale` value and containing directory.
- The route or route-derived identifier.
- The translation's meaning and external links.

English is the default locale. Its routes are unprefixed; Chinese routes use
the `/zh-CN/` prefix.

### Validate the smallest relevant scope

Run the narrowest check that covers a change, then run the full sequence before
merging or publishing:

```sh
bun run check:content       # Content frontmatter and locale pairing
bun run check:i18n          # UI translation keys
bun run format:check:astro # Prettier formatting
bun run build               # Static output
bun run verify:dist         # Assertions against dist/
```

## Repository map

```text
src/
  content/
    pages/{en,zh-CN}/       # Static pages and page frontmatter
    news/{en,zh-CN}/        # Dated announcements
    projects/{en,zh-CN}/    # Project detail entries
    teachings/{en,zh-CN}/   # Course detail entries
    people/{en,zh-CN}/      # Member and alumni entries consumed by /people/
    opportunities/{en,zh-CN}/ # Admissions and position entries consumed by /people/
    resources/{en,zh-CN}/   # Software, data, facility, and guide entries
  data/
    locale/{en,zh-CN}/      # UI strings
    papers.bib              # Publication source
    cv.json                 # CV source
    citations.json          # Citation metadata
    socials.json            # Profile links and downloads
  assets/                   # Build-processed images
  components/               # Astro UI components
    ui/                     # Reusable primitives (Card, ChipButton, Icon, …)
  lib/
    render-shapes.ts        # Single source of truth for routing: shape -> route, param, view
    route-paths.ts          # getStaticPaths bodies shared by the shape route files
  views/                    # One view per render shape; each imports only its own components
  pages/                    # One route file per shape per locale ([locale]/ for prefixed copies)
  scripts/                  # Browser-side scripts
  styles/global.css         # Design tokens and cross-component primitives
public/
  assets/cv/                # CV PDFs (synced to Aliyun OSS, ignored in Git)
  assets/img/               # Stable public images and OG cards
  assets/pdf/               # Publication PDFs (synced to Aliyun OSS, ignored in Git)
scripts/                    # Audits, OSS sync, build manifest, and dist verification
```

Generated directories must not be edited or committed:

- `.astro/`
- `dist/`
- `node_modules/`

## Runtime and dependencies

### Bun version

The required runtime is declared in [`package.json`](./package.json):

```json
{
  "packageManager": "bun@1.3.14",
  "engines": {
    "bun": ">=1.3.14"
  }
}
```

Use Bun rather than Node for repository commands:

```sh
bun ci
bun run check
```

### Bun behavior

[`bunfig.toml`](./bunfig.toml) is intentionally load-bearing:

| Setting | Effect |
| --- | --- |
| `[run].bun = true` | Runs scripts and `node_modules/.bin` tools with Bun |
| `[install].auto = "disable"` | Fails if dependencies are not installed instead of resolving them silently |
| `[install].registry` | Uses the repository's configured package mirror |
| `[install].minimumReleaseAge` | Delays newly resolved packages for the configured safety window |

Do not remove `bunfig.toml` settings without checking the CI and build
assumptions. In particular, `bun ci` must follow the committed lockfile.

### Adding dependencies

1. Edit `dependencies` or `devDependencies` in `package.json`.
2. Run `bun install`.
3. Commit both [`package.json`](./package.json) and [`bun.lock`](./bun.lock).
4. Run `bun run check` and `bun run build`.

Do not hand-edit `bun.lock`. Dependabot uses the `npm` ecosystem configuration
in [`.github/dependabot.yml`](./.github/dependabot.yml) to propose updates for
the package manifest and lockfile.

### Package scripts

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the Astro development server |
| `bun run dev:all` | Start the dev server with every page and feature block enabled |
| `bun run build` | Build the static site and write build metadata |
| `bun run preview` | Preview the generated site locally |
| `bun run check` | Run i18n audit, content audit, and `astro check` |
| `bun run check:i18n` | Verify translation keys across locales |
| `bun run check:content` | Verify content frontmatter, routes, and locale pairing |
| `bun run og` | Regenerate public share-card images |
| `bun run verify:dist` | Verify generated routes, style linkage, and build output |
| `bun run verify:budgets` | Check built output against the size budgets |
| `bun run format:astro` | Format supported Astro and configuration files |
| `bun run format:check:astro` | Check formatting without changing files |

### Development modes

`bun run dev` renders exactly what production will: an entry with `draft: true`
has no route, and every frontmatter `enabled` flag is honoured.

`bun run dev:all` starts the same server with `--mode dev-all`, which ignores
`draft` and turns every feature block on, so work in progress stays reachable
while you debug. The mode is read in
[`src/lib/dev-mode.ts`](./src/lib/dev-mode.ts), which every draft filter and
feature-flag read goes through.

Two consequences are worth remembering:

- **The mode is the only switch.** There is no `.env` file to keep in sync, and
  the mode is inlined at build time, so a production bundle contains no
  reference to `dev-all` at all.
- **Do not judge production scope from a `dev:all` server.** It shows more routes
  than ship; use `bun run build && bun run verify:dist` for that question.

## Locales and URL routing

### Declaring locales

Edit [`src/i18n/locales.ts`](./src/i18n/locales.ts) to add or rename a locale:

```ts
export const locales = [
  { code: "en", lang: "en", label: "English" },
  { code: "zh-CN", lang: "zh-CN", label: "中文" },
] as const;
```

Each locale entry supplies:

| Property | Meaning |
| --- | --- |
| `code` | Internal route and data key, such as `zh-CN` |
| `lang` | HTML language value |
| `label` | Language-switcher label |

The locale list is used by Astro, routing helpers, audits, search indexes,
feeds, and the language switcher. Do not update only one consumer.

### Default locale

The default locale is configured in [`astro.config.mjs`](./astro.config.mjs):

```js
const defaultLocale = "en";

export default defineConfig({
  i18n: {
    locales: [...localeCodes],
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

With the current configuration:

| Locale | Home | Example |
| --- | --- | --- |
| English | `/` | `/research/` |
| Chinese | `/zh-CN/` | `/zh-CN/research/` |

To make another locale the default, change `defaultLocale` and review all
related assumptions in `src/lib/locale.ts`, feed generation, sitemap
verification, and no-index route handling. A default-locale change is
not just a frontmatter edit.

### Building internal links

Always use `localeUrl`:

```ts
import { localeUrl } from "../lib/i18n";

const href = localeUrl(locale, "/projects/");
```

Do not write `/${locale}/...` manually. `localeUrl` removes duplicate locale
prefixes and keeps the default locale unprefixed.

## Content collections and frontmatter

All content is Markdown with YAML frontmatter. Schemas in
[`src/content.config.ts`](./src/content.config.ts) are strict: an unknown
frontmatter key is a build error.

### Shared fields

Pages, news, projects, teachings, people, opportunities, and resources share these fields:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `locale` | `en` or `zh-CN` | `en` | Must match the parent directory |
| `title` | non-empty string | required | Visible title and search metadata |
| `description` | non-empty string | required | Meta description, search data, and feeds |
| `draft` | boolean | `false` | Retires the entry from routes, navigation and listings |

Keep `description` meaningful and different from `title`; the schema explicitly
rejects empty descriptions, and repeated title text produces poor metadata.

`draft` is the switch for taking a page out of the published site. It has to be
set in **both** locales — `bun run check:content` fails on a route that is live
in one locale but drafted in the other, because the language switcher and the
`hreflang` alternates both derive the other locale's URL from the current path.
`bun run dev:all` ignores the flag so you can keep working on the page.

### Page fields

Page entries live in [`src/content/pages/`](./src/content/pages/):

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `pageId` | enum | optional | Selects a specialized renderer |
| `permalink` | non-empty string | required | Route source for the page |
| `nav` | boolean | `false` | Include the page in navigation |
| `navOrder` | number | unset | Sort position in navigation |
| `subtitle` | string | unset | About-page subtitle |
| `profile` | object | unset | About-page profile image and caption |
| `researchQuestions` | array | `[]` | Research question cards |
| `research_summary.enabled` | boolean | `true` | Show research summary on About |
| `announcements.enabled` | boolean | `true` | Show news on About |
| `announcements.scrollable` | boolean | `false` | Use scrollable news presentation |
| `announcements.limit` | positive integer or `null` | unset | Limit About-page news |
| `calendar.enabled` | boolean | `false` | Show a public teaching calendar |
| `calendar.url` | URL | unset | Public calendar embed URL; required when enabled |
| `social` | boolean | `false` | Show social links |
| `categories` | string array | `[]` | Project page category filters |
| `noindex` | boolean | `false` | Exclude the route from sitemap/indexing logic |
| `pdf` | string | unset | PDF consumed by the CV page |
| `dropdown` | boolean | `false` | Treat the page as a container for `children` |
| `children` | array | `[]` | Links rendered by `pageId: dropdown` |

A page with `dropdown: true` is a container for its `children`, so it retires
automatically once every child points at a hidden page — from the navigation and
from the route set both, because its own page body lists those same links. That
is why `/dropdown/` disappears when its only child `/cv/` is drafted, with no
second flag to keep in sync. Restoring the child brings the container back.

Minimal page example:

```yaml
---
locale: en
title: Research
description: Research interests and ongoing work.
permalink: /research/
pageId: research
nav: true
navOrder: 2
---
```

`permalink` is required even for a page whose route looks obvious. It is the
only route source for page entries.

### Page IDs and renderers

`pageId` must be one of the values in `PAGE_IDS`:

Each `pageId` is served by one route file, with one view that renders it and one
route pattern declared in [`src/lib/render-shapes.ts`](./src/lib/render-shapes.ts):

| `pageId` | Route | View | Renders |
| --- | --- | --- | --- |
| `about` | `/` | `HomeView.astro` | Profile, research summary, news, and social links |
| `research` | `/research/` | `ResearchView.astro` | `ResearchSummary.astro` |
| `publications` | `/publications/` | `PublicationsView.astro` | `PublicationList.astro` |
| `projects` | `/projects/` | `ProjectsListView.astro` | `ProjectList.astro` |
| `news` | `/news/` | `NewsListView.astro` | `NewsList.astro` |
| `cv` | `/cv/` | `CVView.astro` | `CV.astro` |
| `teaching` | `/teaching/` | `TeachingView.astro` | Markdown body plus teaching catalog |
| `people` | `/people/` | `PeopleView.astro` | Markdown body plus members, alumni, and opportunities |
| `resources` | `/resources/` | `ResourcesView.astro` | Markdown body plus grouped resource catalog |
| `dropdown` | `/dropdown/` | `DropdownView.astro` | Markdown body plus child-link list |

Collections with detail routes follow the same pattern: `news` uses
`NewsDetailView.astro`, `projects` `ProjectDetailView.astro`, and `teachings`
`TeachingDetailView.astro`. The `people`, `opportunities`, and `resources`
collections are aggregate-only: their entries have no individual routes and are
rendered by the corresponding page.

Adding a new `pageId` requires all of the following:

1. Add it to `PAGE_IDS` in [`src/lib/render-shapes.ts`](./src/lib/render-shapes.ts)
   (`src/content.config.ts` re-exports it).
2. Register a shape for it in `SHAPES` — route pattern, dynamic parameter name,
   and view path — and add the view under `src/views/`.
3. Generate its route files (one for `en`, one under `src/pages/[locale]/`),
   following an existing shape exactly.
4. Add localized entries and update the content/build checks.
5. Update this document.

There is no catch-all route: a `pageId` without a registered shape has no route
file and would silently not build, which is why `bun run check:content` fails on
one. Every `permalink` must equal its own shape's pattern.

### News fields

News entries live in [`src/content/news/`](./src/content/news/):

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `date` | date/time | required | Display date and feed ordering |
| `inline` | boolean | `true` | Controls inline news behavior |
| Shared fields | — | — | `locale`, `title`, `description`, `draft` |

Example:

```yaml
---
locale: en
title: Research milestone
description: A short description for metadata and feeds.
date: 2026-01-15 09:00:00+0800
inline: true
---

The announcement body.
```

The filename determines the news URL segment. Keep matching English and
Chinese filenames when adding a translated announcement.

### Project fields

Project entries live in [`src/content/projects/`](./src/content/projects/):

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `image` | string | unset | Image basename resolved from project assets |
| `github` | URL | unset | Repository link |
| `importance` | integer | `999` | Sort priority; lower values are more important |
| `category` | string | unset | Category label |
| `giscusComments` | boolean | `false` | Enable project comments |
| `routeSlug` | non-empty string | required | Stable project URL segment |
| Shared fields | — | — | `locale`, `title`, `description`, `draft` |

Example:

```yaml
---
locale: en
title: Example Project
description: A concise project description.
image: example-project.png
github: https://github.com/example/project
importance: 10
category: research
giscusComments: false
routeSlug: example-project
---
```

`routeSlug` must remain stable. Changing it changes the public URL and can
orphan existing links and comment threads.

### Teaching fields

Teaching entries live in [`src/content/teachings/`](./src/content/teachings/):

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `term` | string | unset | Term label |
| `year` | positive integer | required | Catalog grouping year |
| `instructor` | string | unset | Instructor name |
| `location` | string | unset | Classroom or venue |
| `time` | string | unset | Human-readable schedule |
| `course_id` | non-empty string | required | Stable course URL identifier |
| `schedule` | array | `[]` | Weekly course schedule |
| Shared fields | — | — | `locale`, `title`, `description`, `draft` |

Each `schedule` item has:

```yaml
schedule:
  - week: 1
    date: 2026-09-07
    topic: Introduction
    description: Course overview and learning objectives.
    materials:
      - name: Course notes
        url: /assets/pdf/course-notes.pdf
```

`week` must be a positive integer. `date`, `topic`, and `description` must be
non-empty. Each material requires a `name` and a route or URL.

### People, opportunities, and resources

The People page combines current members, alumni, and open opportunities. The
Resources page combines software, datasets, facilities, guides, and other
public materials. These collections are structured and bilingual, but their
entries are intentionally aggregate-only rather than separate pages.

People entries use `status` (`current` or `alumni`), `role`, `research`, optional
`joined`/`left` dates, optional `homepage`, and `order`. Opportunity
entries use `type`, `status` (`open` or `closed`), optional `deadline`/`url`, and
`order`. Resource entries use `type`, `access` (`public` or `restricted`),
optional `url`/`maintainer`, and `order`.

Keep the paired English and Chinese entries in sync. A missing or mismatched
locale entry fails `bun run check:content`. New entries should remain drafts
until the identity, access conditions, and public links are confirmed.

## About page and profile configuration

The About page is `src/content/pages/{locale}/about.md` and uses
`pageId: about`. Its body is rendered beside the profile image.

### Profile object

```yaml
profile:
  image: prof_pic.jpg
  image_circular: true
  more_info: |
    <p>Optional caption or location.</p>
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `image` | string | required when `profile` exists | Image basename |
| `image_circular` | boolean | `true` | Adds the circular avatar style |
| `more_info` | string | unset | Trusted HTML caption rendered below image |

The image is resolved from the profile asset collection. Unknown basenames
fail the build. Use `image_circular: false` for a rectangular image.

### About-page switches

```yaml
research_summary:
  enabled: true
announcements:
  enabled: true
  scrollable: true
  limit: 5
social: true
```

- `research_summary.enabled` displays the localized research page summary.
- `announcements.enabled` displays the localized news list.
- `announcements.scrollable` selects the scrollable presentation.
- `announcements.limit` caps the number of displayed announcements. Omit it
  or set it to `null` for the component's uncapped behavior.
- `social` displays links from `src/data/socials.json`.

### Inline HTML in Markdown

Markdown inline HTML is allowed by [`.markdownlint.json`](./.markdownlint.json).
Use it sparingly for presentation that Markdown cannot express:

```markdown
Institutes of Science and Development<br />
Chinese Academy of Sciences
```

Do not use inline HTML for ordinary emphasis, links, lists, or paragraphs.
Prefer standard Markdown for those cases.

## Localized UI text and structured data

### UI translations

The UI translation files are:

- [`src/data/locale/en/strings.json`](./src/data/locale/en/strings.json)
- [`src/data/locale/zh-CN/strings.json`](./src/data/locale/zh-CN/strings.json)

Both files must have the same key structure. The audit compares keys, not
translation quality. When adding a key:

1. Add it to every locale file.
2. Keep placeholders identical, such as `{count}`.
3. Use the key through `strings(locale)` or `labels(locale)`.
4. Run `bun run check:i18n`.

Common namespaces include `bibliography`, `cv`, `courses`, `projects`,
`search`, `labels`, `header`, and `not_found`.

### Social links

Edit [`src/data/socials.json`](./src/data/socials.json) for shared profile
links:

| Field | Use |
| --- | --- |
| `cv_pdf` | CV download URL |
| `email` | Email address |
| `github_username` | GitHub username |
| `orcid_id` | ORCID identifier |
| `research_gate_profile` | ResearchGate profile URL |
| `scholar_userid` | Google Scholar user ID |
| `wechat_qr.url` | WeChat QR image URL |

`SocialLinks.astro` builds the final link URLs from these values. Do not paste
complete GitHub, ORCID, or Scholar URLs into fields that expect identifiers.

### CV data

The bilingual CV source is [`src/data/cv.json`](./src/data/cv.json). It is a
locale-keyed object with the following top-level fields:

```json
{
  "locale": "en",
  "name": "Name",
  "location": "City, Country",
  "phone": "+00 000000000",
  "email": "name@example.com",
  "social_networks": [],
  "sections": {}
}
```

Each section is an array. Entries may contain:

- `institution`, `area`, `degree`, `location`
- `start_date`, `end_date`
- `highlights`
- `bullet`
- `number`

Use the section names expected by the CV component and keep the same locale
coverage in both language versions.

### Citations

Edit [`src/data/citations.json`](./src/data/citations.json) only for citation
metadata consumed by the site. Publication records themselves belong in
[`src/data/papers.bib`](./src/data/papers.bib), not in a second JSON list.

## Research, publications, projects, and teaching

### Research page

The research page uses `pageId: research` and
`researchQuestions`:

```yaml
researchQuestions:
  - title: Risk Feature Perception
    image: Research_Question_1.png
```

Each item requires a non-empty `title` and an image basename from the research
asset directory. The research body remains ordinary Markdown and is shown with
the generated summary component.

### Publications

Publications are parsed exclusively from [`src/data/papers.bib`](./src/data/papers.bib)
by `src/lib/bibliography.ts`.

For every entry:

1. Add or update the BibTeX record.
2. Provide a local PDF in [`public/assets/pdf/`](./public/assets/pdf/) (or configure an external URL).
3. Provide a preview image in [`src/assets/publications/`](./src/assets/publications/).
4. Use `pdf` for the bare local PDF filename (which resolves via `src/lib/remote-assets.ts` to the configured OSS/CDN URL).
5. Use absolute or root-relative URLs for other link fields.
6. Run `bun run oss:sync` to sync local PDFs to Aliyun OSS.
7. Run `bun run check`.

The publication schema includes parsed `title`, `authors`, `year`, `month`,
`journal`, `volume`, `issue`, `pages`, `doi`, `links`, `preview`, `abstract`,
`language`, `annotation`, `scholarId`, `bibtexShow`, and `bibtex`.

Do not add a manually maintained publication array. The content and build gates
check the publication asset pair and parser output.

### Projects and categories

Project categories are configured on the projects index page:

```yaml
categories:
  - research
  - typst
```

The project component uses each entry's `category` and `importance`. Keep
category labels consistent with the localized UI strings where a visible
translation is required.

### Teaching catalog

The teaching index uses `pageId: teaching`. Individual courses are grouped by
the required `year` field and identified by `course_id`. A course can be kept
out of production routes with `draft: true` while being developed.

The teaching page itself is also a maintained template. Its body documents the
content contract for a group course, while the page frontmatter controls the
optional calendar block. Keep `calendar.enabled: false` until a public group
calendar is ready. When one is available, set it to `true` and provide a
public `calendar.url`; do not embed a personal calendar.

The site is a lab page even when individual entries are still being prepared.
Keep unfinished pages and courses as bilingual drafts; `bun run dev:all` makes
the complete information architecture reviewable without publishing incomplete
content.

## Assets and static files

### Processed image assets

Build-processed images live under:

```text
src/assets/profile/
src/assets/project/
src/assets/publications/
src/assets/research/
src/assets/tool/
```

Content references images by basename only:

```yaml
image: typush.png
```

Do not import an image's `width` or other metadata merely to obtain dimensions.
Pass a literal width to `getImage` or the Astro `Image` component so Astro can
prune unused originals.

### Public assets
 
Use `public/` for stable URLs that must not be renamed by the build:
 
```text
public/assets/cv/   # Ignored by Git, synced to Aliyun OSS
public/assets/img/  # Tracked by Git (favicons, UI badges, social cards)
public/assets/pdf/  # Ignored by Git, synced to Aliyun OSS
```

Large binary assets (`pdf/` and `cv/`) are hosted on Aliyun OSS to keep the Git repository lean. They are synced incrementally via `bun run oss:sync` and pulled via `bun run oss:pull`. Links to them resolve to the remote OSS/CDN base URL configured in `src/data/oss-sync.json` or `.env` (or local fallback during offline dev).

Reference public files with root-relative URLs:

```markdown
[Download the CV](/assets/cv/en_CV.pdf)
```

Keep publication PDFs structurally untouched. Their filenames are referenced
by publication data and remote asset resolvers.

### Open Graph images

[`src/lib/locale.ts`](./src/lib/locale.ts) maps locales to:

```text
/assets/img/og-en.png
/assets/img/og-zh-CN.png
```

Regenerate them with:

```sh
bun run og
```

The generated files belong in `public/assets/img/`.

## Adding or changing pages and components

### Add a plain localized page

1. Create matching files in `src/content/pages/en/` and
   `src/content/pages/zh-CN/`.
2. Set `locale` to the directory locale.
3. Set a unique `permalink`.
4. Add a non-empty `title` and `description`.
5. Omit `pageId` for ordinary Markdown prose, or select an existing page ID.
6. Add `nav: true` and `navOrder` only when the page belongs in navigation.
7. Run `bun run check:content`.

### Add a navigation item

Set the same navigation intent in both locale entries:

```yaml
nav: true
navOrder: 5
```

The route still comes from `permalink`; `navOrder` only controls ordering.

A navigation item is dropped automatically when the page stops rendering — see
the next section for the case where that is deliberate.

### Take a page out of the live site

Set `draft: true` in **both** locale entries. That retires the route, the
navigation entry, the About-page block that links to it, and its place in the
search index; `bun run dev:all` still shows it while you work.

Two things to check afterwards:

- `bun run check:content` — a route live in one locale but drafted in the other
  fails the audit.
- `bun run build && bun run verify:dist` — the built output is where a dangling
  link shows up. Drafting `/cv/` also retires `/dropdown/`, because that page is
  only a container for its children and has nothing left to list.

### Add a specialized page

Do not invent a new frontmatter key to select a component. Use an existing
`pageId`, or add a shape — a view plus its route files:

1. `PAGE_IDS` in [`src/lib/render-shapes.ts`](./src/lib/render-shapes.ts).
2. A `SHAPES` entry giving the route pattern, the dynamic parameter name, and
   the view path; then the view itself under `src/views/`.
3. Route files for both locales, following an existing shape's shape exactly.
4. Documentation and build checks.

The view imports only the components that shape renders. That is not stylistic:
Astro links a component's CSS to every URL served by the route file that can
reach it, so an extra import in a route file or a view adds its stylesheet to
every page of that shape. `bun run verify:dist` fails if a page links a component
its view cannot reach, and `bun run verify:budgets` fails if the totals drift.

### Add a browser interaction

Place browser-only behavior in [`src/scripts/`](./src/scripts/) and import it
from the relevant component's `<script>` block. Keep pure helpers in
[`src/lib/`](./src/lib/) so build-time scripts can import them without Astro
virtual modules.

### Reuse a UI primitive

[`src/components/ui/`](./src/components/ui/) holds the shared primitives:
`Card`, `ChipButton`, `Icon`, `LinkedSection`, `MenuPanel`, `MetaList`,
`PageTitle`, `Prose` and `ScrollTable`. Compose one of these rather than writing
new markup — `Card` owns the card shell and its hover lift, `ChipButton` covers
the outlined control tiers through its `size` / `tone` / `shape` / `fill` props,
and `Icon` sizes its glyphs through `size`.

A caller cannot restyle a primitive's internals: Astro scoping makes the
component's own descendant rules outrank anything written outside. Where a
primitive has to be adaptable, it exposes a prop or a CSS custom property (for
example `Card`'s `--card-pad-*` padding and `--card-p-size` description metrics)
rather than leaving the caller to reach in.

### Change global appearance

Edit [`src/styles/global.css`](./src/styles/global.css) for design tokens,
document defaults, rendered-Markdown rules, and the primitives more than one
component renders (`.icon-button`, `.menu-panel`, `.icon`). Component styles are
scoped with `scopedStyleStrategy: "class"`, so rules are written as
`.name.astro-XXXXXXXX` and elements carry the matching class. The class form is
preferred over the `[data-astro-cid-XXXXXXXX]` attribute form because both carry
the same specificity while the class is about ten characters shorter at every
occurrence, in the selector and on every element of the component's template.

Everything else
belongs in the owning component's `<style>` block: a component-prefixed selector
in `global.css`, or a `.parent .child` rule reaching into a sibling component,
is the wrong direction — give that component a rule for its own state.

The radius scale is sized against the elements that use it rather than as a free
sequence, so pick the step whose comment matches the element's size. Continuous
curvature (`corner-shape: squircle`) is applied document-wide; an element whose
`border-radius` is `50%` is a circle and carries `.is-circle` to opt out, since
squircle would flatten it into a rounded square.

## Build, check, and verification commands

### Recommended local sequence

For a content-only change:

```sh
bun run check:content
```

For UI string changes:

```sh
bun run check:i18n
```

For anything that changes rendered output:

```sh
bun run build
bun run verify:dist
bun run verify:budgets
```

Before a significant merge:

```sh
bun run format:check:astro
bun run check
bun run build
bun run verify:dist
bun run verify:budgets
```

### Build outputs

`bun run build` creates `dist/`, then
`scripts/write-style-manifest.mjs` and `scripts/write-build-manifest.mjs` write:

- `dist/build.json`
- `dist/MANIFEST.sha256`
- `dist/style-manifest.json`

These files are production artifacts and are published with the static site.
Do not edit them manually or commit `dist/`.

Size budgets (`bun run verify:budgets`) cover the HTML and `dist/_astro/**`.
They deliberately exclude `dist/assets/**`, which holds the OSS-synced PDFs and
CVs: those are gitignored, vary with whatever has been pulled locally, and make
up most of a full local `dist/`. The budgets also assert raw and Brotli sizes but
never gzip, because gzip output differs between Node and Bun for the same input
while Brotli does not.

## CI, deployment, and dependency updates

### CI workflow

[`ci.yml`](./.github/workflows/ci.yml) runs on pushes and pull requests targeting
`main`, plus manual dispatch. It:

1. Checks out the repository.
2. Sets up the Bun version from `package.json`.
3. Restores the Bun package cache.
4. Runs `bun ci`.
5. Checks formatting, content, types, and translations.
6. Builds `dist/`, then runs `verify:dist` and `verify:budgets` against it.

### Deploy workflow

[`deploy.yml`](./.github/workflows/deploy.yml) automatically listens for a
successful CI `workflow_run` on `main`. It rebuilds the CI-tested commit,
verifies the output, publishes `dist/` to `gh-pages`, and runs the repository's
deployment handoff.

It also supports `workflow_dispatch` for deliberate redeployment or rollback.
Automatic deployment uses `github.event.workflow_run.head_sha`; manual runs use
the selected workflow commit.

The deployment workflow intentionally does not repeat formatting, content, or
type checks. Those checks belong to local development and CI.

### Dependabot

[`.github/dependabot.yml`](./.github/dependabot.yml) checks the root package
manifest weekly through the `npm` ecosystem and opens at most five update PRs.
Review dependency PRs like any other code change and require CI to pass.

## Ignore files and Markdown rules

### Git ignore

[`.gitignore`](./.gitignore) excludes:

- `.astro/`, `dist/`, and `node_modules/`
- `.env` and `.env.*`, while allowing `.env.example`
- `.DS_Store`, `.idea/`, and selected editor settings
- local virtual environments and local tool state

Never add real credentials to `.env.example` or any tracked file.

### Prettier ignore

[`.prettierignore`](./.prettierignore) excludes generated directories,
dependencies, and `bun.lock`. The lockfile remains Git-tracked but is not
formatted by Prettier.

### Markdownlint

[`.markdownlint.json`](./.markdownlint.json) disables `MD033`, allowing inline
HTML in Markdown. Keep inline HTML limited to cases that improve the rendered
document and use standard Markdown elsewhere.

## Common tasks

### Change the default language

1. Change `defaultLocale` in `astro.config.mjs`.
2. Review `prefixDefaultLocale`.
3. Confirm `localeUrl` behavior in `src/lib/locale.ts`.
4. Review feeds, sitemap, no-index route handling, and dist verification.
5. Run the full build and verification sequence.

### Change the About introduction

1. Edit both `src/content/pages/en/about.md` and
   `src/content/pages/zh-CN/about.md`.
2. Keep the frontmatter schema and `locale` values unchanged.
3. Update profile, links, and Markdown body.
4. Use `image_circular: true` for a circular avatar or `false` for a
   rectangular avatar.
5. Run `bun run check:content` and `bun run build`.

### Add a profile image

1. Put the image in `src/assets/profile/`.
2. Set its basename in both About frontmatters:

   ```yaml
   profile:
     image: new-profile.jpg
     image_circular: true
   ```

3. Run the content check and build.

### Add a publication

1. Add the BibTeX record to `src/data/papers.bib`.
2. Add the matching PDF under `public/assets/pdf/`.
3. Add the matching preview under `src/assets/publications/`.
4. Run `bun run oss:sync` to sync the new PDF to Aliyun OSS.
5. Confirm the `pdf` and `preview` fields resolve correctly.
6. Run `bun run check`.

### Add a news announcement

1. Create matching English and Chinese files under `src/content/news/`.
2. Use the same filename stem.
3. Set `locale`, `title`, `description`, and `date`.
4. Write the translated body.
5. Run `bun run check:content`.

### Add a project

1. Create matching files under `src/content/projects/en/` and
   `src/content/projects/zh-CN/`.
2. Give both entries the same stable `routeSlug`.
3. Add images under `src/assets/project/` if needed.
4. Set `github` only to a valid absolute URL.
5. Set `giscusComments: true` only when the project discussion should be
   public and its title/route identity is stable.

### Add a course

1. Create matching entries under `src/content/teachings/`.
2. Set `year` and `course_id`; these are required.
3. Add optional term, instructor, location, and time.
4. Add validated schedule items.
5. Keep `draft: true` until the course is ready to publish.

## Troubleshooting

### “Unknown key” or frontmatter validation failure

The content schema is strict. Check spelling and nesting against
[`src/content.config.ts`](./src/content.config.ts). Do not add arbitrary keys
to a Markdown frontmatter block.

### A page is missing from the build

Check:

1. `draft` is not `true` in this locale.
2. `locale` matches the containing directory.
3. `permalink` is present and unique.
4. The matching locale entry exists.
5. The selected `pageId` has a renderer if specialized behavior is expected.
6. If the page sets `dropdown: true`, at least one of its `children` still points
   at a page that renders — a container with no reachable child retires itself.

Run `bun run dev:all` to see whether the page renders at all; if it does, the
cause is one of the filters above rather than a component problem.

### A route has the wrong locale prefix

Use `localeUrl(locale, route)` instead of concatenating strings. Confirm that
English is the default locale and Chinese is a prefixed locale.

### An image cannot be found

Check the asset directory and basename. Processed content images belong under
the relevant `src/assets/` subdirectory; stable downloads belong under
`public/assets/` and use root-relative URLs.

### A publication build check fails

Check that every BibTeX record has both:

- a valid PDF link (bare filename or full URL) in `pdf`
- a matching preview image in `src/assets/publications/`

If building locally with a bare filename, ensure the PDF exists in `public/assets/pdf/` (pull with `bun run oss:pull` if missing) and that `pdf` uses the supported field convention.

### UI text is missing in one language

Compare the corresponding `strings.json` files and run:

```sh
bun run check:i18n
```

The files must expose the same nested key structure.

### `astro check` cannot resolve a helper

Keep browser-only and Astro virtual-module imports out of build-time helpers.
Move reusable logic into `src/lib/` and leave
`astro:content` or `astro:assets` imports in components/build-only modules.

### The build is stale or dependencies are inconsistent

Run:

```sh
rm -rf node_modules .astro dist
bun ci
bun run build
```

Do not delete tracked source files or the repository root. If `bun ci` reports
a manifest/lockfile mismatch, update the lockfile with `bun install` and
commit it with `package.json`.

### Formatting reports an unexpected file

Check whether the file is intended to be formatted by
`format:check:astro` or intentionally excluded by `.prettierignore`.
Generated files and `bun.lock` should remain ignored by Prettier.

