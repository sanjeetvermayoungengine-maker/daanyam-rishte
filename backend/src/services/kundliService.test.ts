import { describe, expect, it } from "vitest";
import { StubAstroEngineAdapter } from "./astroEngineAdapter.js";
import { generateKundliWithAdapter, mapBirthDetailsToChartRequest, mapChartResponseToComputedKundli } from "./kundliService.js";
import type { AstroEngineChartResponse } from "../types/horoscope.js";

describe("kundliService", () => {
  it("maps Rishte birth details to the astro engine chart payload", () => {
    const payload = mapBirthDetailsToChartRequest({
      dob: "1990-05-17",
      birthTime: "10:30",
      birthPlace: "Delhi",
      selectedBirthPlaceLabel: "Delhi, India",
      birthLatitude: "28.6139",
      birthLongitude: "77.209",
      birthTimezone: "",
      birthLocation: {
        displayName: "Delhi, India",
        latitude: 28.6139,
        longitude: 77.209,
        country: "India",
        region: "Central Delhi",
        state: "Delhi",
        confidence: 0.92
      }
    });

    expect(payload).toEqual({
      datetime: {
        kind: "local",
        local: "1990-05-17T10:30:00",
        timezone: "Asia/Kolkata"
      },
      geo: {
        latitude_deg: 28.6139,
        longitude_deg: 77.209,
        elevation_m: 0
      },
      ayanamsa: "lahiri",
      projection: "sidereal_only",
      compact: false
    });
  });

  it("maps the chart response into app-friendly kundli fields", () => {
    const response: AstroEngineChartResponse = {
      data: {
        schema_version: "chart_sidereal_v1",
        summary: {
          moon_rashi: "karka",
          lagna_rashi: "meena"
        },
        lagna: {
          rashi: "meena"
        },
        moon_nakshatra: "pushya",
        moon_pada: 2,
        dasha: {
          current: {
            maha: {
              lord: "saturn",
              start: "2024-01-01T00:00:00Z",
              end: "2043-12-31T00:00:00Z"
            },
            antar: {
              lord: "venus",
              start: "2026-01-01T00:00:00Z",
              end: "2028-01-01T00:00:00Z"
            }
          }
        }
      },
      metadata: {
        version: "0.1.0",
        engine_semantic_version: "0.17.0",
        ayanamsa_used: "lahiri",
        house_system: "whole_sign"
      }
    };

    const mapped = mapChartResponseToComputedKundli(response);

    expect(mapped.rashi).toBe("karka");
    expect(mapped.nakshatra).toBe("pushya");
    expect(mapped.pada).toBe(2);
    expect(mapped.lagna).toBe("meena");
    expect(mapped.dashaSummary).toContain("Maha: saturn");
    expect(mapped.dashaSummary).toContain("Antar: venus");
    expect(mapped.engine).toEqual({
      apiVersion: "0.1.0",
      engineSemanticVersion: "0.17.0",
      schemaVersion: "chart_sidereal_v1",
      ayanamsa: "lahiri",
      houseSystem: "whole_sign"
    });
  });

  it("fails clearly when birth place cannot be resolved to coordinates", () => {
    expect(() =>
      mapBirthDetailsToChartRequest({
        dob: "1990-05-17",
        birthTime: "10:30",
        birthPlace: "Small Unknown Town",
        birthLatitude: "",
        birthLongitude: "",
        birthTimezone: "",
        birthLocation: null
      })
    ).toThrow("Select a resolved birthplace before generating the kundli.");
  });

  it("supports a stub astro adapter behind the shared interface", async () => {
    const kundli = await generateKundliWithAdapter({
      dob: "1990-05-17",
      birthTime: "10:30",
      birthPlace: "Delhi",
      selectedBirthPlaceLabel: "Delhi, India",
      birthLatitude: "28.6139",
      birthLongitude: "77.209",
      birthTimezone: "Asia/Kolkata",
      birthLocation: {
        displayName: "Delhi, India",
        latitude: 28.6139,
        longitude: 77.209,
        country: "India",
        region: "Central Delhi",
        state: "Delhi",
        confidence: 0.92
      }
    }, new StubAstroEngineAdapter());

    expect(kundli.source).toBe("astro_engine");
    expect(kundli.rashi).toBeTruthy();
    expect(kundli.nakshatra).toBeTruthy();
    expect(kundli.engine.apiVersion).toBe("stub-1");
  });
});
