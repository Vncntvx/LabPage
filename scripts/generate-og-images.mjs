// Generates the social share cards consumed by BaseLayout's `og:image` /
// `twitter:image` tags. Output goes to `public/` so the URL is stable across
// builds; `src/assets` would hash the filename.
//
// Committed artifact, local authoring tool: run it by hand when the card copy
// changes, then commit the PNGs. CI never runs this, so rasterizer font
// availability on other machines is irrelevant.
//
// Usage: bun run og

import { createRequire } from "node:module";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const outDir = path.resolve("public/assets/img");

// Palette mirrors the light-theme tokens in src/styles/global.css.
const COLORS = {
  background: "#ffffff",
  surface: "#f7f8fa",
  text: "#1c1c1d",
  muted: "#68707a",
  accent: "#1d4ed8",
  border: "#dfe3e8",
};

const FONT_SERIF = "'Charter', 'Georgia', 'Songti SC', serif";
const FONT_SANS = "-apple-system, 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', sans-serif";

const WIDTH = 1200;
const HEIGHT = 630;

const escapeXml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const cards = {
  en: {
    name: "Wenjie Xu",
    subtitle: "PhD Candidate, Management Science and Engineering",
    affiliation: "CASISD · Risk Management",
  },
  "zh-CN": {
    name: "徐文杰",
    subtitle: "管理科学与工程 · 博士研究生",
    affiliation: "中国科学院科技战略咨询研究院 · 风险管理",
  },
};

const buildSvg = ({ name, subtitle, affiliation }) => `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.background}"/>
  <rect x="0" y="0" width="${WIDTH}" height="10" fill="${COLORS.accent}"/>
  <rect x="0" y="${HEIGHT - 180}" width="${WIDTH}" height="180" fill="${COLORS.surface}"/>
  <line x1="0" y1="${HEIGHT - 180}" x2="${WIDTH}" y2="${HEIGHT - 180}" stroke="${COLORS.border}" stroke-width="2"/>
  <rect x="96" y="196" width="10" height="140" rx="5" fill="${COLORS.accent}"/>
  <text x="152" y="290" font-family="${FONT_SERIF}" font-size="104" font-weight="700" fill="${COLORS.text}">${escapeXml(name)}</text>
  <text x="152" y="356" font-family="${FONT_SANS}" font-size="34" fill="${COLORS.muted}">${escapeXml(subtitle)}</text>
  <text x="152" y="500" font-family="${FONT_SANS}" font-size="30" fill="${COLORS.muted}">${escapeXml(affiliation)}</text>
  <text x="${WIDTH - 96}" y="500" text-anchor="end" font-family="${FONT_SANS}" font-size="28" fill="${COLORS.muted}">lab.wenjiexu.site</text>
</svg>`;

// Resolved lazily so a missing optional dependency fails with a clear message
// instead of a module-resolution stack trace.
const loadSharp = async () => {
  try {
    return require("sharp");
  } catch (error) {
    throw new Error(
      `sharp is not installed, so the share cards cannot be generated. Astro ships sharp as an optional dependency; ` +
        `run "bun install" (without --omit=optional) and retry.\nUnderlying error: ${error.message}`
    );
  }
};

const main = async () => {
  const sharp = await loadSharp();
  await mkdir(outDir, { recursive: true });

  for (const [locale, card] of Object.entries(cards)) {
    const svg = buildSvg(card);
    const target = path.join(outDir, `og-${locale}.png`);
    // `flatten` drops the alpha channel; social crawlers expect an opaque card.
    await sharp(Buffer.from(svg)).flatten({ background: COLORS.background }).png({ palette: true }).toFile(target);

    const { size } = await stat(target);
    const { width, height } = await sharp(target).metadata();
    if (width !== WIDTH || height !== HEIGHT) {
      throw new Error(`${target}: expected ${WIDTH}x${HEIGHT}, got ${width}x${height}`);
    }
    console.log(`Wrote ${path.relative(process.cwd(), target)} (${width}x${height}, ${size} bytes)`);
  }
};

await main();
