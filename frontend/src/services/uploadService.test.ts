import { describe, expect, it } from "vitest";
import { createLocalPhoto, dataUrlHasJpegExifMarker } from "./uploadService";

function buildJpegDataUrlWithExif(): string {
  const bytes = new Uint8Array([
    0xff, 0xd8, 0xff, 0xe1, 0x00, 0x10, 0x45, 0x58, 0x49, 0x46, 0x00, 0x00,
    0xff, 0xd9,
  ]);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `data:image/jpeg;base64,${btoa(binary)}`;
}

describe("uploadService", () => {
  it("detects JPEG EXIF markers in a data URL", () => {
    expect(dataUrlHasJpegExifMarker(buildJpegDataUrlWithExif())).toBe(true);
    expect(dataUrlHasJpegExifMarker("data:image/jpeg;base64,/9j/4AAQ")).toBe(false);
  });

  it("stores re-encoded data URLs without EXIF markers", () => {
    const cleanDataUrl =
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQADAP/EABQQAQAAAAAAAAAAAAAAAAAAACD/2gAIAQEAAQUCf//Z";
    const file = new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], "photo.jpg", {
      type: "image/jpeg",
    });

    const photo = createLocalPhoto(file, cleanDataUrl);

    expect(dataUrlHasJpegExifMarker(photo.url)).toBe(false);
    expect(photo.name).toBe("photo.jpg");
  });
});
