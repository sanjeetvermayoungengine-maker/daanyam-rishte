import { describe, expect, it } from "vitest";
import { findClearBirthPlaceMatch, tryResolveSharedLocation } from "./locationInput";

describe("locationInput", () => {
  it("extracts coordinates from a Google Maps style share link", () => {
    const result = tryResolveSharedLocation("https://maps.google.com/?q=28.6139,77.2090");

    expect(result).toEqual({
      displayName: "Shared map location",
      latitude: 28.6139,
      longitude: 77.209,
      country: "",
      region: null,
      state: null,
      confidence: 1
    });
  });

  it("extracts plain coordinate input", () => {
    const result = tryResolveSharedLocation("28.6139, 77.2090");

    expect(result?.latitude).toBe(28.6139);
    expect(result?.longitude).toBe(77.209);
    expect(result?.displayName).toContain("Pinned location");
  });

  it("picks an exact segmented match from search results", () => {
    const result = findClearBirthPlaceMatch("new delhi", [
      {
        displayName: "Delhi, India",
        latitude: 28.6139,
        longitude: 77.209,
        country: "India",
        region: "Central Delhi",
        state: "Delhi",
        confidence: 0.9
      },
      {
        displayName: "New Delhi, Delhi, India",
        latitude: 28.6139,
        longitude: 77.209,
        country: "India",
        region: "New Delhi",
        state: "Delhi",
        confidence: 0.95
      }
    ]);

    expect(result?.displayName).toBe("New Delhi, Delhi, India");
  });
});
