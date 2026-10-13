// Which route file renders each kind of page, declared once.
//
// This table exists because of how Astro decides which stylesheets a page links:
// the unit of attribution is the ROUTE FILE, not the URL. Rollup builds one page
// module per file under `src/pages/`, and Astro's CSS plugin gives that module
// every stylesheet belonging to a component it can reach through the module
// graph — statically or dynamically, and regardless of which branch a given URL
// actually renders (`core/build/plugins/plugin-css.js`, walking through
// `core/build/graph.js`, which follows `importers.concat(dynamicImporters)`).
//
// A catch-all route is therefore the worst case: every URL it serves links the
// union of every component any of its URLs can render. A page can only avoid
// shipping another page's CSS by living in its own route file, which is why this
// site gives every shape one and has no catch-all.
//
// Import-free by design: `viewPath` is a string, not an import, so reading this
// table never pulls a view into the module graph of whatever reads it.

/** A route template segment marking where an entry's own route slug goes. */
export const SLUG_SEGMENT = ":slug";

/**
 * Page ids the view layer dispatches on. Declared HERE rather than in
 * `src/content.config.ts` can import it without introducing a second registry.
 */
export const PAGE_IDS = ["about", "research", "publications", "projects", "cv", "teaching", "people", "resources", "dropdown", "news"] as const;

interface ShapeBase {
  /** Stable identifier, used in gate messages and route-file names. */
  name: string;
  /**
   * `page` — a `pages` entry with this `pageId`, rendered at one fixed route.
   * `collection` — one route per entry of the named collection.
   */
  /**
   * Route template below the locale prefix. A `page` shape's pattern is its
   * literal route; a `collection` shape's carries `SLUG_SEGMENT`.
   */
  pattern: string;
  /**
   * The view that renders this shape, repo-relative. A string rather than an
   * import so this module stays a data table.
   */
  viewPath: string;
  /**
   * The dynamic segment each generated route file uses, so a shape whose entry
   * is drafted can emit zero paths. A fixed route has to be dynamic for that:
   * a non-parameterized Astro route always emits, ignoring `getStaticPaths`.
   */
  param: string;
}

export type PageId = (typeof PAGE_IDS)[number];
export type DedicatedCollection = "news" | "projects" | "teachings";
export type RenderShape =
  | (ShapeBase & { kind: "page"; pageId: PageId; collection?: never })
  | (ShapeBase & { kind: "collection"; collection: DedicatedCollection; pageId?: never });

/**
 * Every shape a page can take.
 *
 * Listed in the order the shapes were introduced; navigation order comes from
 * each entry's own `navOrder`, not from here.
 */
export const SHAPES: readonly RenderShape[] = [
  { name: "home", kind: "page", pageId: "about", pattern: "/", viewPath: "src/views/HomeView.astro", param: "path" },
  {
    name: "publications",
    kind: "page",
    pageId: "publications",
    pattern: "/publications/",
    viewPath: "src/views/PublicationsView.astro",
    param: "path",
  },
  { name: "projectsList", kind: "page", pageId: "projects", pattern: "/projects/", viewPath: "src/views/ProjectsListView.astro", param: "path" },
  {
    name: "projectDetail",
    kind: "collection",
    collection: "projects",
    pattern: `/projects/${SLUG_SEGMENT}/`,
    viewPath: "src/views/ProjectDetailView.astro",
    param: "slug",
  },
  { name: "newsList", kind: "page", pageId: "news", pattern: "/news/", viewPath: "src/views/NewsListView.astro", param: "path" },
  {
    name: "newsDetail",
    kind: "collection",
    collection: "news",
    pattern: `/news/${SLUG_SEGMENT}/`,
    viewPath: "src/views/NewsDetailView.astro",
    param: "slug",
  },
  { name: "cv", kind: "page", pageId: "cv", pattern: "/cv/", viewPath: "src/views/CVView.astro", param: "path" },
  { name: "research", kind: "page", pageId: "research", pattern: "/research/", viewPath: "src/views/ResearchView.astro", param: "path" },
  { name: "teaching", kind: "page", pageId: "teaching", pattern: "/teaching/", viewPath: "src/views/TeachingView.astro", param: "path" },
  { name: "people", kind: "page", pageId: "people", pattern: "/people/", viewPath: "src/views/PeopleView.astro", param: "path" },
  { name: "resources", kind: "page", pageId: "resources", pattern: "/resources/", viewPath: "src/views/ResourcesView.astro", param: "path" },
  {
    name: "teachingDetail",
    kind: "collection",
    collection: "teachings",
    pattern: `/teachings/${SLUG_SEGMENT}/`,
    viewPath: "src/views/TeachingDetailView.astro",
    param: "course",
  },
  { name: "dropdown", kind: "page", pageId: "dropdown", pattern: "/dropdown/", viewPath: "src/views/DropdownView.astro", param: "path" },
];

/** The shape registered for a `pages` entry's `pageId`. */
export const shapeForPageId = (pageId: string | undefined): RenderShape | undefined =>
  SHAPES.find((shape) => shape.kind === "page" && shape.pageId === pageId);

/** The shape registered for a collection's detail routes. */
export const shapeForCollection = (collection: string): RenderShape | undefined =>
  SHAPES.find((shape) => shape.kind === "collection" && shape.collection === collection);

/**
 * The shape that serves a locale-less route (a value shaped like a `permalink`:
 * leading slash, trailing slash, no locale prefix), or `undefined` when no shape
 * claims it.
 *
 * `pattern` matching is exact for literal routes, so `/projects/` cannot be
 * confused with a project detail route — the trailing slash is load-bearing and
 * every route here has one (see `trailingSlash: "always"`). Returning
 * `undefined` rather than a fallback keeps a page with no shape a loud failure:
 * with no catch-all route, nothing would serve it.
 */
export const shapeForRoute = (route: string): RenderShape | undefined => {
  const normalized = route.endsWith("/") ? route : `${route}/`;
  return SHAPES.find((shape) => shape.kind === "page" && shape.pattern === normalized);
};

/**
 * The shape that serves an as-served pathname, with or without a locale prefix,
 * or `undefined` when the pathname is not a shape route (status pages, feeds).
 *
 * Used by the output gates to classify a built page. A pathname under a locale
 * prefix is matched against the pattern with the prefix removed, so `/zh-CN/cv/`
 * and `/cv/` resolve to the same shape.
 *
 * A missing trailing slash is normalized before the prefix is stripped, because
 * a caller deriving the pathname from a built file (`zh-CN/index.html` ->
 * `/zh-CN`) produces the bare prefix, which a slash-suffixed comparison would
 * not recognize — and would then report as an unrouted page.
 */
export const shapeForPath = (pathname: string, localePrefixes: readonly string[]): RenderShape | undefined => {
  let route = pathname.endsWith("/") || pathname === "" ? pathname || "/" : `${pathname}/`;
  for (const prefix of localePrefixes) {
    const withSlash = `/${prefix}/`;
    if (route === withSlash) {
      route = "/";
      break;
    }
    if (route.startsWith(withSlash)) {
      route = route.slice(withSlash.length - 1);
      break;
    }
  }
  const literal = SHAPES.find((shape) => shape.kind === "page" && shape.pattern === route);
  if (literal) return literal;
  // Collection detail: `/<collection>/<slug>/` matches that collection's template.
  const segments = route.split("/").filter(Boolean);
  if (segments.length === 2) {
    const head = `/${segments[0]}/`;
    return SHAPES.find((shape) => shape.kind === "collection" && shape.pattern.startsWith(head));
  }
  return undefined;
};
