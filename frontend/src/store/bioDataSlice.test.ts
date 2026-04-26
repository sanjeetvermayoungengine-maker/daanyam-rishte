import { describe, expect, it } from "vitest";
import { bioDataReducer, defaultBioDataState, updateHoroscope } from "./bioDataSlice";

describe("bioDataSlice horoscope birthplace state", () => {
  it("stores the selected normalized birthplace and resets computed kundli", () => {
    const initialState = {
      ...defaultBioDataState,
      horoscope: {
        ...defaultBioDataState.horoscope,
        birthPlace: "Delhi",
        computedKundli: {
          status: "ready" as const,
          error: null,
          result: {
            rashi: "Mithun",
            nakshatra: "Rohini",
            pada: 1,
            lagna: "Kark",
            dashaSummary: "Maha: mercury",
            generatedAt: "2026-01-01T00:00:00.000Z",
            source: "astro_engine" as const,
            engine: {
              apiVersion: "0.1.0",
              engineSemanticVersion: "0.17.0",
              schemaVersion: "chart_sidereal_v1",
              ayanamsa: "lahiri",
              houseSystem: "whole_sign"
            },
            rawEngineResponse: {}
          }
        }
      }
    };

    const nextState = bioDataReducer(initialState, updateHoroscope({
      selectedBirthPlaceLabel: "Delhi, India",
      birthLatitude: "28.6139",
      birthLongitude: "77.209",
      birthLocation: {
        displayName: "Delhi, India",
        latitude: 28.6139,
        longitude: 77.209,
        country: "India",
        region: "Central Delhi",
        state: "Delhi",
        confidence: 0.92
      }
    }));

    expect(nextState.horoscope.selectedBirthPlaceLabel).toBe("Delhi, India");
    expect(nextState.horoscope.birthLatitude).toBe("28.6139");
    expect(nextState.horoscope.birthLongitude).toBe("77.209");
    expect(nextState.horoscope.birthLocation?.country).toBe("India");
    expect(nextState.horoscope.computedKundli).toEqual({
      status: "idle",
      error: null,
      result: null
    });
  });
});
