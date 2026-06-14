import html2canvas from "html2canvas-pro";
import { defineContentScript } from "wxt/utils/define-content-script";

type RenderMode = "element" | "video-frame";

interface SupportedSite {
  id: string;
  label: string;
  match: (url: URL) => boolean;
  query: string;
  renderMode: RenderMode;
}

const CAPTURE_KEY = "p";
const IMAGE_TYPE = "image/png";
const TOAST_ID = "super-screenshot-toast";

const SUPPORTED_CONTENT_SCRIPT_MATCHES = ["https://www.youtube.com/*", "https://m.youtube.com/*"];

const SUPPORTED_SITES: readonly SupportedSite[] = [
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

export default defineContentScript({
  allFrames: false,
  main() {
    document.addEventListener("keydown", handleKeyDown, {
      capture: true,
    });
  },
  matches: SUPPORTED_CONTENT_SCRIPT_MATCHES,
  runAt: "document_idle",
});

function isYoutubeHostname(hostname: string): boolean {
  return hostname === "www.youtube.com" || hostname === "m.youtube.com";
}

function findSupportedSite(url: URL): SupportedSite | undefined {
  return SUPPORTED_SITES.find((site) => site.match(url));
}

async function handleKeyDown(event: KeyboardEvent): Promise<void> {
  if (!shouldCapture(event)) {
    return;
  }

  const site = findSupportedSite(new URL(window.location.href));

  if (!site) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  try {
    const canvas = await renderTargetToCanvas(site);

    await writeCanvasToClipboard(canvas);
    showToast(`Copied screenshot from ${site.label}.`, "success");
  } catch (error) {
    const message = getErrorMessage(error);

    console.warn(`[SuperScreenshot] ${message}`, {
      error,
      site,
    });

    showToast(message, "error");
  }
}

function shouldCapture(event: KeyboardEvent): boolean {
  return (
    event.key.toLowerCase() === CAPTURE_KEY &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey &&
    !event.repeat &&
    !isEditableTarget(event.target)
  );
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  const editableElement = target.closest(
    "input, textarea, select, [contenteditable=''], [contenteditable='true']",
  );

  return editableElement !== null;
}

async function renderTargetToCanvas(site: SupportedSite): Promise<HTMLCanvasElement> {
  const target = document.querySelector(site.query);

  if (target === null) {
    throw new Error(`No target found for ${site.label}: ${site.query}`);
  }

  if (site.renderMode === "video-frame") {
    return renderVideoFrameToCanvas(target, site);
  }

  return renderElementToCanvas(target, site);
}

function renderVideoFrameToCanvas(target: Element, site: SupportedSite): HTMLCanvasElement {
  if (!(target instanceof HTMLVideoElement)) {
    throw new Error(`Target is not a video element for ${site.label}: ${site.query}`);
  }

  if (target.videoWidth === 0 || target.videoHeight === 0) {
    throw new Error(`Video is not ready for ${site.label}.`);
  }

  const canvas = document.createElement("canvas");

  canvas.width = target.videoWidth;
  canvas.height = target.videoHeight;

  const context = canvas.getContext("2d");

  if (context === null) {
    throw new Error("Could not create a 2D canvas context.");
  }

  context.drawImage(target, 0, 0, canvas.width, canvas.height);

  return canvas;
}

async function renderElementToCanvas(
  target: Element,
  site: SupportedSite,
): Promise<HTMLCanvasElement> {
  if (!(target instanceof HTMLElement)) {
    throw new Error(`Target is not an HTML element for ${site.label}: ${site.query}`);
  }

  return html2canvas(target, {
    backgroundColor: null,
    logging: false,
    useCORS: true,
  });
}

async function writeCanvasToClipboard(canvas: HTMLCanvasElement): Promise<void> {
  if (typeof ClipboardItem === "undefined") {
    throw new Error("ClipboardItem is not available on this page.");
  }

  const blob = await convertCanvasToBlob(canvas);

  await navigator.clipboard.write([
    new ClipboardItem({
      [IMAGE_TYPE]: blob,
    }),
  ]);
}

async function convertCanvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob === null) {
          reject(new Error("Could not convert the canvas to a PNG blob."));

          return;
        }

        resolve(blob);
      }, IMAGE_TYPE);
    } catch (error) {
      reject(error);
    }
  });
}

function showToast(message: string, tone: "error" | "success"): void {
  const previousToast = document.getElementById(TOAST_ID);

  previousToast?.remove();

  const toast = document.createElement("div");

  toast.id = TOAST_ID;
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.top = "16px";
  toast.style.right = "16px";
  toast.style.zIndex = "2147483647";
  toast.style.maxWidth = "360px";
  toast.style.padding = "10px 12px";
  toast.style.borderRadius = "6px";
  toast.style.background = "#b91c1c";

  if (tone === "success") {
    toast.style.background = "#0f766e";
  }

  toast.style.color = "#ffffff";
  toast.style.font = "13px/1.4 system-ui, sans-serif";
  toast.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.24)";

  document.documentElement.append(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2200);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Could not capture the screenshot.";
}
