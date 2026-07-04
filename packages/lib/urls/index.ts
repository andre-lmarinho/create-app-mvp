function ensureProtocol(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export const APP_URL = ensureProtocol(process.env.NEXT_PUBLIC_APP_URL) || "http://localhost:3000";

export const WWW_URL = ensureProtocol(process.env.NEXT_PUBLIC_WWW_URL) || "http://localhost:3001";

function buildUrl(base: string, path: string): string {
  const href = new URL(path, base).href;
  return href.endsWith("/") ? href.slice(0, -1) : href;
}

export const appUrl = (path = "/"): string => buildUrl(APP_URL, path);
export const wwwUrl = (path = "/"): string => buildUrl(WWW_URL, path);
