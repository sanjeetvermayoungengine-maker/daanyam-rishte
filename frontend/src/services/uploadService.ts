import type { BioPhoto } from "../store/bioDataSlice";

export const MAX_PHOTO_DIMENSION = 2048;

export function dataUrlHasJpegExifMarker(dataUrl: string): boolean {
  const base64 = dataUrl.split(",")[1] ?? "";
  if (!base64) {
    return false;
  }

  let binary: string;
  try {
    binary = atob(base64);
  } catch {
    return false;
  }

  if (!binary.startsWith("\xff\xd8\xff")) {
    return false;
  }

  return binary.slice(0, 65536).includes("\xff\xe1");
}

function scaleDimensions(width: number, height: number, maxDimension: number) {
  const longEdge = Math.max(width, height);
  if (longEdge <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / longEdge;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

export function reencodePhotoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const { width, height } = scaleDimensions(image.naturalWidth, image.naturalHeight, MAX_PHOTO_DIMENSION);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Could not process this photo."));
        return;
      }

      context.drawImage(image, 0, 0, width, height);

      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      const dataUrl =
        mimeType === "image/png"
          ? canvas.toDataURL("image/png")
          : canvas.toDataURL("image/jpeg", 0.92);

      resolve(dataUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read this photo. Try a different file."));
    };

    image.src = objectUrl;
  });
}

export function createLocalPhoto(file: File, dataUrl: string): BioPhoto {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `photo-${crypto.randomUUID()}`
      : `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    url: dataUrl,
    name: file.name,
    uploadedAt: new Date().toISOString(),
  };
}
