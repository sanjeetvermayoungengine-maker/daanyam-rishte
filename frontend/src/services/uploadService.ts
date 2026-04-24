import type { BioPhoto } from "../store/bioDataSlice";

export function createLocalPhoto(file: File, dataUrl: string): BioPhoto {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `photo-${crypto.randomUUID()}`
      : `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    url: dataUrl,
    name: file.name,
    uploadedAt: new Date().toISOString()
  };
}
