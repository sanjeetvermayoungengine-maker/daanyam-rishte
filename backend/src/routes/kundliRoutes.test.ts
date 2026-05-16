import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const jwtVerify = vi.fn();
const generateKundli = vi.fn();

vi.mock("jose", () => ({
  createRemoteJWKSet: vi.fn(() => vi.fn()),
  jwtVerify: (...args: unknown[]) => jwtVerify(...args),
}));

vi.mock("../services/kundliService.js", () => ({
  generateKundli: (...args: unknown[]) => generateKundli(...args),
  KundliGenerationError: class KundliGenerationError extends Error {
    statusCode = 400;
  },
}));

const ORIG_SUPABASE_URL = process.env.SUPABASE_URL;

async function postGenerate(port: number, headers: Record<string, string> = {}) {
  return fetch(`http://127.0.0.1:${port}/api/kundli/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      birthDetails: {
        dob: "1990-05-17",
        birthTime: "10:30",
        birthPlace: "Delhi",
        birthLatitude: "28.6139",
        birthLongitude: "77.209",
      },
    }),
  });
}

describe("kundliRoutes POST /generate", () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    jwtVerify.mockReset();
    generateKundli.mockReset();
    generateKundli.mockResolvedValue({
      rashi: "Mithun",
      nakshatra: "Rohini",
      pada: 1,
      lagna: "Kark",
      dashaSummary: null,
      generatedAt: "2026-01-01T00:00:00.000Z",
      source: "astro_engine",
      engine: {
        apiVersion: null,
        engineSemanticVersion: null,
        schemaVersion: null,
        ayanamsa: null,
        houseSystem: null,
      },
      rawEngineResponse: null,
    });
  });

  afterEach(() => {
    if (ORIG_SUPABASE_URL === undefined) {
      delete process.env.SUPABASE_URL;
    } else {
      process.env.SUPABASE_URL = ORIG_SUPABASE_URL;
    }
  });

  it("returns 401 without auth", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();
    const server = app.listen(0);

    try {
      const address = server.address();
      if (!address || typeof address === "string") {
        throw new Error("server address unavailable");
      }

      const response = await postGenerate(address.port);
      expect(response.status).toBe(401);
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });

  it("returns 200 with a valid bearer token", async () => {
    jwtVerify.mockResolvedValue({
      payload: { sub: "user-1", email: "user@example.com", aud: "authenticated" },
    });

    const { createApp } = await import("../app.js");
    const app = createApp();
    const server = app.listen(0);

    try {
      const address = server.address();
      if (!address || typeof address === "string") {
        throw new Error("server address unavailable");
      }

      const response = await postGenerate(address.port, {
        Authorization: "Bearer test-token",
      });
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.kundli.rashi).toBe("Mithun");
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });
});
