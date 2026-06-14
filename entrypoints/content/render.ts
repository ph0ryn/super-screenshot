import html2canvas from "html2canvas-pro";

import type { SupportedSite } from "./sites";

export async function renderTargetToCanvas(site: SupportedSite): Promise<HTMLCanvasElement> {
  const target = document.querySelector(site.query);

  if (target === null) {
    throw new Error(`No target found for ${site.id}: ${site.query}`);
  }

  if (site.renderMode === "video-frame") {
    return renderVideoFrameToCanvas(target, site);
  }

  return renderElementToCanvas(target, site);
}

function renderVideoFrameToCanvas(target: Element, site: SupportedSite): HTMLCanvasElement {
  if (!(target instanceof HTMLVideoElement)) {
    throw new Error(`Target is not a video element for ${site.id}: ${site.query}`);
  }

  if (target.videoWidth === 0 || target.videoHeight === 0) {
    throw new Error(`Video is not ready for ${site.id}.`);
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
    throw new Error(`Target is not an HTML element for ${site.id}: ${site.query}`);
  }

  return html2canvas(target, {
    backgroundColor: null,
    logging: false,
    useCORS: true,
  });
}
