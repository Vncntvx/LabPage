import type { ImageMetadata } from "astro";

type ImageModule = { default: ImageMetadata };
type ImageMap = Record<string, ImageMetadata>;

const buildMap = (globRecord: Record<string, ImageModule>): ImageMap =>
  Object.fromEntries(Object.entries(globRecord).map(([path, module]) => [path.split("/").pop()!, module.default]));

/** Look up an image by the basename used in content frontmatter (directories are ignored). */
export const resolveAsset = (map: ImageMap, path: string | undefined): ImageMetadata | undefined => {
  if (!path) return undefined;
  const name = path.slice(path.lastIndexOf("/") + 1);
  return map[name];
};

export const projectImages = buildMap(import.meta.glob<ImageModule>("../assets/project/*.{png,jpg,jpeg,webp}", { eager: true }));

export const publicationImages = buildMap(import.meta.glob<ImageModule>("../assets/publications/*.{png,jpg,jpeg,webp}", { eager: true }));

export const researchImages = buildMap(import.meta.glob<ImageModule>("../assets/research/*.{png,jpg,jpeg,webp}", { eager: true }));

export const profileImages = buildMap(import.meta.glob<ImageModule>("../assets/profile/*.{png,jpg,jpeg,webp}", { eager: true }));

export const toolImages = buildMap(import.meta.glob<ImageModule>("../assets/tool/*.{png,jpg,jpeg,webp}", { eager: true }));
