export type RenderMode = "element" | "video-frame";

export interface SupportedSite {
  id: string;
  match: string;
  query: string;
  renderMode: RenderMode;
}

export const SUPPORTED_SITES: readonly SupportedSite[] = [
  {
    id: "instagram-live",
    match: "*.instagram.com/*/live/*",
    query: "div[aria-label='Video player']",
    renderMode: "element",
  },
];

export const SUPPORTED_CONTENT_SCRIPT_MATCHES = SUPPORTED_SITES.map((site) =>
  toContentScriptMatch(site.match),
);

export function findSupportedSite(url: URL): SupportedSite | undefined {
  return SUPPORTED_SITES.find((site) => matchesSitePattern(site.match, url));
}

function toContentScriptMatch(match: string): string {
  let matchWithPath = match;

  if (!matchWithPath.includes("/")) {
    matchWithPath = `${matchWithPath}/*`;
  }

  if (matchWithPath.includes("://")) {
    return matchWithPath;
  }

  return `*://${matchWithPath}`;
}

function matchesSitePattern(match: string, url: URL): boolean {
  const pattern = normalizeSitePattern(match);
  const candidate = `${url.hostname}${url.pathname}`.toLowerCase();
  const regex = new RegExp(`^${escapeRegExp(pattern).replaceAll("\\*", ".*")}$`, "u");

  return regex.test(candidate);
}

function normalizeSitePattern(match: string): string {
  const matchWithoutScheme = match.replace(/^[a-z*]+:\/\//iu, "");
  let matchWithPath = matchWithoutScheme;

  if (!matchWithPath.includes("/")) {
    matchWithPath = `${matchWithPath}/*`;
  }

  return matchWithPath.toLowerCase();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
