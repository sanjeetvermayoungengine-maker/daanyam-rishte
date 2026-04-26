import { describe, expect, it } from "vitest";
import { describeHoroscopeSharing, normalizeSharePermissions } from "./sharePermissions";

describe("share permission helpers", () => {
  it("normalizes granular horoscope permissions with dependency rules", () => {
    expect(normalizeSharePermissions({
      viewBasic: true,
      viewPhotos: true,
      viewHoroscopeSummary: false,
      viewHoroscopeBirthDetails: true,
      viewHoroscopeDasha: false,
      viewDetailedKundli: false,
      viewContact: false,
    })).toEqual({
      viewBasic: true,
      viewPhotos: true,
      viewHoroscopeSummary: true,
      viewHoroscopeBirthDetails: true,
      viewHoroscopeDasha: false,
      viewDetailedKundli: false,
      viewContact: false,
      viewHoroscope: true,
    });
  });

  it("describes mixed horoscope sharing states succinctly", () => {
    expect(describeHoroscopeSharing({
      viewHoroscopeSummary: true,
      viewHoroscopeBirthDetails: true,
      viewHoroscopeDasha: false,
      viewDetailedKundli: false,
    })).toBe("Summary + birth details");
  });
});
