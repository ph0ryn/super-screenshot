const IMAGE_TYPE = "image/png";

export async function writeCanvasToClipboard(canvas: HTMLCanvasElement): Promise<void> {
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
