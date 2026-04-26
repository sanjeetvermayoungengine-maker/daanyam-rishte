import { afterEach, describe, expect, it } from "vitest";
import { createApp, getHealthStatus } from "./app";
import { __resetShareStoreForTests, createShare } from "./services/shareService.js";
import type { BioDataSnapshot } from "./types/share.js";

const sampleBioData: BioDataSnapshot = {
  personalDetails: {
    fullName: "Route Test User",
    dob: "1995-10-01",
    phone: "9999999999",
    email: "route@example.com",
    religion: "Hindu",
    caste: "Sharma",
    height: "5'7\"",
    profession: "Engineer",
    education: "B.Tech",
    income: "15 LPA",
  },
  photos: {
    items: [{ id: "p1", url: "https://example.com/p1.jpg", name: "p1", uploadedAt: "2026-01-01T00:00:00.000Z" }],
    primaryPhotoId: "p1",
  },
  family: {
    fatherName: "Father",
    motherName: "Mother",
    fatherOccupation: "Business",
    motherOccupation: "Homemaker",
    siblings: [],
    familyType: "Nuclear",
    location: "Delhi",
  },
  horoscope: {
    dob: "1995-10-01",
    birthTime: "08:30",
    birthPlace: "Delhi",
    selectedBirthPlaceLabel: "Delhi, India",
    birthLatitude: "28.6139",
    birthLongitude: "77.209",
    birthTimezone: "Asia/Kolkata",
    birthLocation: null,
    gotra: "Kashyap",
    marsDosha: "no",
    computedKundli: {
      status: "ready",
      error: null,
      result: {
        rashi: "Mithun",
        nakshatra: "Rohini",
        pada: 1,
        lagna: "Kark",
        dashaSummary: "Maha: mercury",
        generatedAt: "2026-01-01T00:00:00.000Z",
        source: "astro_engine",
        engine: {
          apiVersion: "0.1.0",
          engineSemanticVersion: "0.17.0",
          schemaVersion: "chart_sidereal_v1",
          ayanamsa: "lahiri",
          houseSystem: "whole_sign",
        },
        rawEngineResponse: { ok: true },
      },
    },
  },
  template: "traditional",
};

afterEach(async () => {
  await __resetShareStoreForTests();
});

describe("health endpoint", () => {
  it("returns a healthy status payload", () => {
    expect(getHealthStatus()).toEqual({
      status: "ok",
      service: "biodata-backend"
    });
  });
});

describe("public share route", () => {
  it("returns normalized permissions and summary-only horoscope fields", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "route@example.com",
      expiryDate: tomorrow,
      permissions: {
        viewBasic: true,
        viewPhotos: true,
        viewHoroscopeSummary: true,
        viewDetailedKundli: false,
        viewContact: false,
      },
      bioData: sampleBioData,
    });

    const app = createApp();
    const server = app.listen(0);

    try {
      const address = server.address();
      if (!address || typeof address === "string") {
        throw new Error("server address unavailable");
      }

      const response = await fetch(`http://127.0.0.1:${address.port}/api/shares/${share.token}`);
      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.share.permissions).toEqual({
        viewBasic: true,
        viewPhotos: true,
        viewHoroscopeSummary: true,
        viewHoroscopeBirthDetails: false,
        viewHoroscopeDasha: false,
        viewDetailedKundli: false,
        viewContact: false,
        viewHoroscope: true,
      });
      expect(data.bioData.horoscope.birthTime).toBe("");
      expect(data.bioData.horoscope.computedKundli.result.rawEngineResponse).toBeNull();
      expect(data.bioData.horoscope.computedKundli.result.rashi).toBe("Mithun");
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    }
  });
});
