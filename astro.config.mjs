import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { defaultLocale, localeCodes, locales } from "./src/i18n/locales.ts";
import { readNoindexRoutes } from "./scripts/noindex-routes.mjs";

const noindexRoutes = await readNoindexRoutes();

export default defineConfig({
  site: "https://lab.wenjiexu.site",
  output: "static",
  trailingSlash: "always",
  // Scope component styles with a class (`.astro-XXXX`) rather than an attribute
  // (`[data-astro-cid-XXXX]`). Both carry the same specificity (0,1,0 on their
  // own, 0,2,0 combined with the class they qualify), so the cascade is
  // unchanged, but the class form is ~10 characters shorter at every occurrence —
  // in the selector, and in the rendered element, which repeats it on every
  // element of the component's template.
  scopedStyleStrategy: "class",
  i18n: {
    locales: [...localeCodes],
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light-default",
        dark: "github-dark-default",
      },
    },
  },
  integrations: [
    sitemap({
      // Emits <xhtml:link rel="alternate"> per URL. Pairs `/about/` with
      // `/zh-CN/about/` even though the default locale carries no prefix: the
      // integration strips a leading segment only when it matches a locale key.
      i18n: {
        defaultLocale,
        locales: Object.fromEntries(locales.map((locale) => [locale.code, locale.lang])),
      },
      filter: (page) => {
        const { pathname } = new URL(page);
        // Status pages and anything opting out via frontmatter `noindex`.
        if (/^\/(?:[^/]+\/)?(?:404|500)(?:\/|\.html)?$/.test(pathname)) return false;
        return !noindexRoutes.has(pathname);
      },
      serialize: (item) => {
        // The integration does not emit x-default; BaseLayout declares it, so the
        // sitemap should agree.
        const links = item.links ? [...item.links] : [];
        if (links.length && !links.some((link) => link.lang === "x-default")) {
          const english = links.find((link) => link.lang === "en");
          if (english) links.push({ url: english.url, lang: "x-default" });
        }
        // A URL that exists in one locale only has no alternates to declare.
        return links.length ? { ...item, links } : { ...item, links: undefined };
      },
    }),
  ],
});
