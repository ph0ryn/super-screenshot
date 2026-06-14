import { writeCanvasToClipboard } from "./clipboard";
import { getErrorMessage } from "./errors";
import { renderTargetToCanvas } from "./render";
import { findSupportedSite } from "./sites";
import { showToast } from "./toast";

const CAPTURE_KEY = "p";

export function registerCaptureHotkey(): void {
  document.addEventListener("keydown", handleKeyDown, {
    capture: true,
  });
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
