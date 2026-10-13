import { isLocale, localeCodes } from "../lib/i18n";
import { getSearchEntries } from "../lib/search-index";

export function getStaticPaths() {
  return localeCodes.map((locale) => ({ params: { locale } }));
}

export async function GET({ params }: { params: { locale?: string } }) {
  const locale = params.locale;
  if (!locale || !isLocale(locale)) return new Response("Not found", { status: 404 });

  // Prerendered to a static file, so cache headers set here would be discarded;
  // the host serves `dist/search-index-<locale>.json` directly.
  return new Response(JSON.stringify(await getSearchEntries(locale)), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
