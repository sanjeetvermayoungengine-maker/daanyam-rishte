import { afterEach, describe, expect, it, vi } from "vitest";
import { AstroEngineClientError, normalizeAstroEngineBaseUrl, postSiderealChart } from "./astroEngineClient.js";
import type { AstroEngineChartRequest } from "../types/horoscope.js";

const sampleRequest: AstroEngineChartRequest = {
  datetime: {
    kind: "local",
    local: "1990-05-17T10:30:00",
    timezone: "Asia/Kolkata"
  },
  geo: {
    latitude_deg: 28.6139,
    longitude_deg: 77.209,
    elevation_m: 216
  },
  ayanamsa: "lahiri",
  projection: "sidereal_only",
  compact: false
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("astroEngineClient", () => {
  it("normalizes the upstream base URL", () => {
    expect(normalizeAstroEngineBaseUrl("http://localhost:4100/")).toBe("http://localhost:4100");
  });

  it("raises a friendly upstream failure when the astro engine cannot be reached", async () => {
    const fetchSpy = vi.fn().mockRejectedValue(new Error("connect ECONNREFUSED"));

    await expect(
      postSiderealChart(sampleRequest, {
        baseUrl: "http://localhost:4100",
        fetchImpl: fetchSpy
      })
    ).rejects.toMatchObject({
      name: "AstroEngineClientError",
      statusCode: 503,
      code: "network_error"
    } satisfies Partial<AstroEngineClientError>);
  });

  it("maps astro engine auth failures into a backend-safe error", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: "missing_api_key" })
    });

    await expect(
      postSiderealChart(sampleRequest, {
        baseUrl: "http://localhost:4100",
        fetchImpl: fetchSpy
      })
    ).rejects.toMatchObject({
      statusCode: 502,
      code: "unauthorized"
    } satisfies Partial<AstroEngineClientError>);
  });
});
