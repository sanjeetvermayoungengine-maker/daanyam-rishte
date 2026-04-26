import { describe, expect, it } from "vitest";
import {
  GeocodingServiceError,
  normalizeNominatimResult,
  searchBirthPlaces
} from "./geocodingService.js";

describe("geocodingService", () => {
  it("normalizes provider results into the app location shape", () => {
    expect(
      normalizeNominatimResult({
        lat: "28.6139",
        lon: "77.2090",
        display_name: "Delhi, India",
        importance: 0.9212,
        address: {
          country: "India",
          state: "Delhi",
          state_district: "Central Delhi"
        }
      })
    ).toEqual({
      displayName: "Delhi, India",
      latitude: 28.6139,
      longitude: 77.209,
      country: "India",
      region: "Central Delhi",
      state: "Delhi",
      confidence: 0.921
    });
  });

  it("returns multiple close matches without auto-picking one", async () => {
    const matches = await searchBirthPlaces("Springfield", {
      provider: {
        searchLocations: async () => [
          {
            displayName: "Springfield, Illinois, United States",
            latitude: 39.7989763,
            longitude: -89.6443688,
            country: "United States",
            region: "Sangamon County",
            state: "Illinois",
            confidence: 0.84
          },
          {
            displayName: "Springfield, Missouri, United States",
            latitude: 37.2081729,
            longitude: -93.2922715,
            country: "United States",
            region: "Greene County",
            state: "Missouri",
            confidence: 0.81
          }
        ]
      }
    });

    expect(matches).toHaveLength(2);
    expect(matches[0].displayName).toContain("Illinois");
    expect(matches[1].displayName).toContain("Missouri");
  });

  it("returns an empty result list when the provider finds nothing", async () => {
    const matches = await searchBirthPlaces("Unknown Hamlet", {
      provider: {
        searchLocations: async () => []
      }
    });

    expect(matches).toEqual([]);
  });

  it("fails clearly for very short queries", async () => {
    await expect(() =>
      searchBirthPlaces("x", {
        provider: {
          searchLocations: async () => []
        }
      })
    ).rejects.toBeInstanceOf(GeocodingServiceError);
  });
});
