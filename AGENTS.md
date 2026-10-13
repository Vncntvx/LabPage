# AGENTS.md

Bilingual (`en` / `zh-CN`) static Astro academic homepage for Wenjie Xu. Bun is the pinned runtime; never use Node. Most changes are content and data (`src/content/`, `src/data/`).

## Sources of truth

- **Architecture, schemas, and workflows**: `CONFIGURATION.md` is the authoritative project manual.
- **Content schemas & page IDs**: `src/content.config.ts` (Zod schemas are `.strict()`; declares valid `PAGE_IDS`).
- **Locales & routing**: `src/i18n/locales.ts` (`en` default, `zh-CN`).
- **Publications**: `src/data/papers.bib` parsed via `src/lib/bibliography.ts`.
- **CI pipeline**: `.github/workflows/ci.yml` defines the gating checks.

## Repository map

- `src/content/{pages,news,projects,teachings,people,opportunities,resources}/{en,zh-CN}/` — Parallel bilingual Markdown collections.
- `src/data/` — UI copy (`locale/<code>/strings.json`), `papers.bib`, `oss-sync.json`, and structured data.
- `src/views/` — One view per render shape (see below). Each view statically imports only the components its shape renders, which is what determines the CSS a page links.
- `src/pages/` — One route file per shape per locale (`[locale]/` holds the prefixed copies); RSS feeds, search indices, and 404 pages.
- `src/components/` — UI components (`ui/` holds reusable primitives). No component decides routing.
- `src/lib/` — Domain helpers (bibliography, i18n, publications, dev-mode, remote assets, `render-shapes`).
- `public/` — Static assets. `assets/pdf/` and `assets/cv/` are synced to OSS and gitignored; `assets/img/` is tracked.
- `scripts/` — Audits, Aliyun OSS sync, build manifest generator, and dist verification.

## Commands

```bash
bun ci                    # Install exact dependencies (never use npm/yarn/pnpm)
bun run dev               # Dev server at http://localhost:4321
bun run dev:all           # Dev server with drafts and disabled feature blocks forced on
bun run check             # Run all checks: check:i18n + check:content + astro check
bun run build             # Build static site to dist/ with build manifest
bun run verify:dist       # Verify emitted dist/ (meta tags, links, sitemap, style linkage, manifest)
bun run verify:budgets    # Check built output against the size budgets
bun run format:astro      # Format Astro, TS, and JSON files via Prettier
bun run oss:sync          # Sync local PDFs to Aliyun OSS (use --dry-run to preview)
bun run oss:pull          # Pull missing remote PDFs down to local public/assets/
```

- **Narrow checks**: `bun run check:i18n` (translations) and `bun run check:content` (frontmatter).
- **Formatting scope**: `bun run format:astro` covers `src/`, `astro.config.mjs`, `tsconfig.json`, and `package.json`. Keep `scripts/` and `.github/` hand-formatted.

## Architecture & invariants

- **Routing & i18n**: `en` is at `/` (unprefixed), `zh-CN` is at `/zh-CN/`, and all routes end with `/`. Always build internal links using `localeUrl(locale, path)` from `src/lib/i18n.ts`.
- **Bilingual parity**: Every content entry and UI string must exist in both `en` and `zh-CN`. `data.locale` must match its parent directory name.
- **Descriptions**: Frontmatter `description` is required, non-empty, and must not duplicate `title`.
- **Page IDs**: New page types must be declared in `PAGE_IDS` and given a shape in `src/lib/render-shapes.ts`.
- **Routing is by render shape, not by a catch-all**: `src/lib/render-shapes.ts` is the single source of truth mapping a `pageId` (or collection) to its route pattern, dynamic parameter, and view. Every shape has one route file per locale, and each route file's `getStaticPaths` comes from `src/lib/route-paths.ts` — never re-derive visibility or a route template at a call site.
- **CSS follows the route file**: Astro attributes a component's stylesheet to the *route file* that can reach it, not to the URL being rendered, so a page links every component its route file can reach whether or not it renders that component. That is why each shape has its own route file, why a route file imports only its own view, and why `verify:dist` fails if a page links a component its view cannot reach. Adding a stray import to a route file is a size regression, not just untidiness.
- **Literal routes use a rest param**: `[...path].astro` carrying `path: undefined`. A named segment rejects `undefined` ("Missing parameter") and a non-parameterized route ignores `getStaticPaths` entirely and always emits — so neither can express "this entry is drafted, emit nothing".
- **Drafts & visibility**: Filter entries using `visible` / `renderable` / `enabled` from `src/lib/dev-mode.ts`; do not hardcode `!entry.data.draft` or `dev:all` mode will break.
- **Publications**: Sourced exclusively from `src/data/papers.bib`. Each entry requires a `preview` image in `src/assets/publications/` and a `pdf` field. Bare PDF filenames resolve to Aliyun OSS/CDN via `src/lib/remote-assets.ts`.
- **Assets**: Reference local images by basename within `src/assets/{profile,project,publications,research,tool}/`. Pass literal widths to `getImage` rather than reading properties off `ImageMetadata`.
- **Build isolation**: Browser DOM scripts belong in `src/scripts/`; build-time scripts must not import Astro virtual modules.
- **Styles**: Scoped `<style>` in components, using `scopedStyleStrategy: "class"` (`astro-XXXXXXXX`); keep tokens, document defaults, and shared primitives in `src/styles/global.css`. Layout breakpoints are strictly `768px` (nav) and `600px` (mobile).

## Validation

Run narrow checks while iterating, then run the full CI gate before committing:
```bash
bun run format:check:astro && bun run check && bun run build && bun run verify:dist && bun run verify:budgets
```

## Safety

- **Production deploys**: Pushing to `main` triggers `.github/workflows/deploy.yml` which deploys directly to production. Always work on a branch and verify locally first.
- **Git exclusions**: Never commit `dist/`, `.astro/`, `.env*` files, or binary PDFs under `public/assets/pdf/` and `public/assets/cv/` (sync these to OSS via `bun run oss:sync`).
- **Commits**: Follow `<type>: :<emoji>: <description>`. Emojis: feat `:sparkles:`, fix `:bug:`, docs `:memo:`, refactor `:recycle:`, test `:white_check_mark:`, chore `:wrench:`, ci `:construction_worker:`, perf `:zap:`.
