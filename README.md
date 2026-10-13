# Wenjie Xu LabPage

This repository is a bilingual, static Astro academic homepage. It serves English at `/` and Simplified Chinese at `/zh-CN/`.

## Development

Requires [Bun](https://bun.sh) 1.3.14 or newer. Node is not needed: `bunfig.toml` runs every script and `node_modules/.bin` executable on the Bun runtime.

```bash
bun ci
bun run dev
bun run check
bun run test
bun run build
bun run preview
```

The production output is written to `dist/`. The site uses Astro Content Collections with Zod validation, Astro assets for image processing, Citation.js for BibTeX, Shiki highlighting, and a small CSS/JavaScript surface. It has no Ruby, Jekyll, ImageMagick, or Python build dependency.

Dependencies are pinned by `bun.lock`; run `bun install` after changing `package.json` and commit the updated lockfile.

Content is organized under `src/content/`; locale strings and structured data are under `src/data/`; stable downloads are under `public/`; the routing table, per-shape views, and route files are under `src/lib/render-shapes.ts`, `src/views/`, and `src/pages/`. Run `bun run check:i18n` when changing translated UI strings.
