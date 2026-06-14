import type { SupportedSite } from "./types";

export const SUPPORTED_CONTENT_SCRIPT_MATCHES = [
  "https://www.youtube.com/*",
  "https://m.youtube.com/*",
];

export const SUPPORTED_SITES: readonly SupportedSite[] = [
  {
    id: "youtube-watch-video",
    label: "YouTube watch video",
    match: (url) => isYoutubeHostname(url.hostname) && url.pathname === "/watch",
    query: "video.html5-main-video",
    renderMode: "video-frame",
  },
  {
    id: "youtube-shorts-video",
    label: "YouTube Shorts video",
    match: (url) => isYoutubeHostname(url.hostname) && url.pathname.startsWith("/shorts/"),
    query: "video",
    renderMode: "video-frame",
  },
];

export function findSupportedSite(url: URL): SupportedSite | undefined {
  return SUPPORTED_SITES.find((site) => site.match(url));
}

function isYoutubeHostname(hostname: string): boolean {
  return hostname === "www.youtube.com" || hostname === "m.youtube.com";
}
