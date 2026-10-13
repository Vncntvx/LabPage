import syncConfig from "../data/oss-sync.json" with { type: "json" };
import { isExternalUrl } from "./url";

/**
 * Get the configured remote base URL (e.g. CDN or OSS domain).
 * Can be overridden by process.env.PUBLIC_ASSETS_BASE_URL.
 */
export const getRemoteBaseUrl = (): string => {
  const envUrl = process.env.PUBLIC_ASSETS_BASE_URL;
  const base = envUrl !== undefined ? envUrl.trim().replace(/\/+$/, "") : (syncConfig.remoteBaseUrl ?? "").replace(/\/+$/, "");
  if (!base) return "";

  const rootPrefix = (process.env.OSS_ROOT_PREFIX ?? syncConfig.rootPrefix ?? "").replace(/^\/+|\/+$/g, "");
  if (rootPrefix && !base.endsWith(`/${rootPrefix}`)) {
    return `${base}/${rootPrefix}`;
  }
  return base;
};

/**
 * Resolve an internal asset path (e.g. `/assets/cv/en_CV.pdf` or `assets/pdf/paper.pdf`)
 * to a full remote CDN/OSS URL if remoteBaseUrl is configured, or return local path.
 */
export const resolveRemoteAssetUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined;
  if (isExternalUrl(path)) return path;

  const base = getRemoteBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (base) {
    return `${base}${normalizedPath}`;
  }
  return normalizedPath;
};
