# SuperScreenshot

SuperScreenshot is a Chrome extension for copying screenshots from supported
video or page elements to the clipboard.

The extension is built with WXT and only injects its content script into
supported domains. Each supported site is defined in code with a URL matcher,
CSS selector, and rendering mode.

## Usage

1. Open a supported page.
2. Press `p` outside text inputs.
3. Paste the captured PNG image from the system clipboard.

## Supported Sites

Supported sites are defined in `entrypoints/content/index.ts`.

```ts
type RenderMode = "element" | "video-frame";

type SupportedSite = {
  id: string;
  match: string;
  query: string;
  renderMode: RenderMode;
};
```

Add a `SupportedSite` entry with a Tampermonkey-style `match` value such as
`*.example.com/*`. The extension derives content script match patterns from
these site definitions.

## Rendering Modes

`video-frame` renders a selected `HTMLVideoElement` directly to a canvas. This
captures the current video frame at the video's intrinsic resolution.

`element` renders a selected `HTMLElement` to a canvas with `html2canvas-pro`.
This is useful for capturing overlays or page UI, but it reconstructs the DOM
and CSS instead of taking a real browser screenshot.

Both rendering modes return an `HTMLCanvasElement`. PNG conversion and clipboard
writing are shared.

## Limitations

- Cross-origin, DRM, or protected video content may fail or render as a blank
  image.
- `element` mode may not perfectly match the browser's real display.
- Some CSS, images, iframes, and video frames may not render correctly in
  `html2canvas-pro`.
- The extension does not include `captureVisibleTab`, crop fallback, settings
  UI, or runtime site registration in v1.

## Development

Use pnpm from the repository root.

```sh
pnpm install
pnpm run dev
pnpm run build
pnpm run lint
pnpm run format
```
