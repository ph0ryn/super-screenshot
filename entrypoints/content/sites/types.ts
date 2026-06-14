export type RenderMode = "element" | "video-frame";

export interface SupportedSite {
  id: string;
  label: string;
  match: (url: URL) => boolean;
  query: string;
  renderMode: RenderMode;
}
