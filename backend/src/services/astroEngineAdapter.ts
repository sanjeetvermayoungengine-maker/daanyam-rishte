import { postSiderealChart } from "./astroEngineClient.js";
import type { AstroEngineChartRequest, AstroEngineChartResponse } from "../types/horoscope.js";

export interface AstroEngineAdapter {
  readonly name: "http" | "stub";
  generateChart(payload: AstroEngineChartRequest): Promise<AstroEngineChartResponse>;
}

export class HttpAstroEngineAdapter implements AstroEngineAdapter {
  readonly name = "http" as const;

  async generateChart(payload: AstroEngineChartRequest) {
    return postSiderealChart(payload);
  }
}

export class StubAstroEngineAdapter implements AstroEngineAdapter {
  readonly name = "stub" as const;

  async generateChart(payload: AstroEngineChartRequest) {
    const latitude = payload.geo.latitude_deg;
    const longitude = payload.geo.longitude_deg;
    const seed = Math.abs(Math.round((latitude * 100) + (longitude * 10)));
    const rashiOptions = ["mesh", "vrishabh", "mithun", "karka", "simha", "kanya", "tula", "vrischik", "dhanu", "makar", "kumbh", "meen"];
    const nakshatraOptions = ["ashwini", "rohini", "mrigashira", "pushya", "hasta", "swati", "anuradha", "uttarashada", "revati"];
    const rashi = rashiOptions[seed % rashiOptions.length];
    const lagna = rashiOptions[(seed + 3) % rashiOptions.length];
    const nakshatra = nakshatraOptions[seed % nakshatraOptions.length];
    const pada = (seed % 4) + 1;

    return {
      data: {
        schema_version: "chart_sidereal_v1",
        summary: {
          moon_rashi: rashi,
          lagna_rashi: lagna,
        },
        lagna: {
          rashi: lagna,
        },
        moon_nakshatra: nakshatra,
        moon_pada: pada,
        dasha: {
          current: {
            maha: {
              lord: "venus",
              start: `${payload.datetime.local.slice(0, 10)}T00:00:00Z`,
              end: "2038-01-01T00:00:00Z",
            },
          },
        },
      },
      metadata: {
        version: "stub-1",
        engine_semantic_version: "stub-1",
        ayanamsa_used: payload.ayanamsa,
        house_system: "whole_sign",
      },
    };
  }
}

export function getAstroEngineAdapter() {
  return (process.env.ASTRO_ENGINE_ADAPTER ?? "").trim().toLowerCase() === "stub"
    ? new StubAstroEngineAdapter()
    : new HttpAstroEngineAdapter();
}
