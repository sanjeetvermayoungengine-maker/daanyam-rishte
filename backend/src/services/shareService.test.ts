import { afterEach, describe, expect, it } from "vitest";
import {
  __listShareEventsForTests,
  __resetShareStoreForTests,
  createShare,
  getShareAnalyticsSummary,
  getPublicShareByToken,
  listShares,
  revokeShare,
  updateSharePermissions,
} from "./shareService.js";
import type { BioDataSnapshot } from "../types/share.js";

const sampleBioData: BioDataSnapshot = {
  personalDetails: {
    fullName: "Test User",
    dob: "1995-10-01",
    phone: "9999999999",
    email: "test@example.com",
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
    birthLocation: {
      displayName: "Delhi, India",
      latitude: 28.6139,
      longitude: 77.209,
      country: "India",
      region: "Central Delhi",
      state: "Delhi",
      confidence: 0.92,
    },
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
        dashaSummary: "Maha: mercury (2020-01-01 to 2030-01-01)",
        generatedAt: "2026-01-01T00:00:00.000Z",
        source: "astro_engine",
        engine: {
          apiVersion: "0.1.0",
          engineSemanticVersion: "0.17.0",
          schemaVersion: "chart_sidereal_v1",
          ayanamsa: "lahiri",
          houseSystem: "whole_sign",
        },
        rawEngineResponse: {
          data: {
            schema_version: "chart_sidereal_v1",
            summary: {
              moon_rashi: "mithuna",
              lagna_rashi: "karka",
            },
            lagna: {
              rashi: "karka",
            },
            moon_nakshatra: "rohini",
            moon_pada: 1,
            dasha: null,
          },
          metadata: {
            version: "0.1.0",
            engine_semantic_version: "0.17.0",
            ayanamsa_used: "lahiri",
            house_system: "whole_sign",
          },
        },
      },
    },
  },
  template: "traditional",
};

afterEach(async () => {
  await __resetShareStoreForTests();
});

describe("shareService", () => {
  it("creates and resolves an active share token", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "family@example.com",
      expiryDate: tomorrow,
      shareType: "prospect",
      source: "direct_flow",
      permissions: {
        viewBasic: true,
        viewPhotos: true,
      },
      bioData: sampleBioData,
    });

    const result = await getPublicShareByToken(share.token);
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") {
      return;
    }
    expect(share.shareType).toBe("prospect");
    expect(share.source).toBe("direct_flow");
    expect(share.label).toBeNull();
    expect(result.bioData.personalDetails.phone).toBe("");
    expect(result.bioData.personalDetails.email).toBe("");
    expect(result.share.permissions.viewHoroscopeSummary).toBe(false);
    expect(result.share.permissions.viewDetailedKundli).toBe(false);
    expect(result.bioData.horoscope.computedKundli.result).toBeNull();

    const events = await __listShareEventsForTests([share.id]);
    expect(events.map((event) => event.eventType)).toEqual(["share_created", "share_opened"]);
  });

  it("returns revoked for revoked links", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "family@example.com",
      expiryDate: tomorrow,
      shareType: "family",
      permissions: {
        viewBasic: true,
        viewPhotos: true,
        viewHoroscopeSummary: true,
        viewDetailedKundli: true,
        viewContact: true,
      },
      bioData: sampleBioData,
    });

    await revokeShare(share.id, "user-1");
    const result = await getPublicShareByToken(share.token);
    expect(result.kind).toBe("revoked");

    const events = await __listShareEventsForTests([share.id]);
    expect(events.map((event) => event.eventType)).toEqual(["share_created", "share_revoked"]);
  });

  it("updates permissions", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "family@example.com",
      expiryDate: tomorrow,
      shareType: "family",
      permissions: {
        viewBasic: true,
        viewPhotos: true,
        viewHoroscopeSummary: true,
        viewDetailedKundli: true,
        viewContact: true,
      },
      bioData: sampleBioData,
    });

    const updated = await updateSharePermissions(share.id, "user-1", { viewPhotos: false });
    expect(updated?.permissions.viewPhotos).toBe(false);

    const events = await __listShareEventsForTests([share.id]);
    expect(events.map((event) => event.eventType)).toEqual(["share_created", "permissions_updated"]);
  });

  it("derives open metrics from share_opened events", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "family@example.com",
      expiryDate: tomorrow,
      bioData: sampleBioData,
    });

    await getPublicShareByToken(share.token);
    await getPublicShareByToken(share.token);

    const shares = await listShares("user-1");
    expect(shares).toHaveLength(1);
    expect(shares[0].openCount).toBe(2);
    expect(shares[0].firstOpenedAt).toBeTruthy();
    expect(shares[0].lastOpenedAt).toBeTruthy();
  });

  it("applies share presets and allows manual overrides", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "broker@example.com",
      shareType: "broker",
      label: "  Main   broker \nview ",
      source: "share_dashboard",
      expiryDate: tomorrow,
      permissions: {
        viewContact: true,
        viewPhotos: false,
      },
      bioData: sampleBioData,
    });

    expect(share.shareType).toBe("broker");
    expect(share.label).toBe("Main broker view");
    expect(share.source).toBe("share_dashboard");
    expect(share.permissions).toEqual({
      viewBasic: true,
      viewPhotos: false,
      viewHoroscopeSummary: true,
      viewHoroscopeBirthDetails: false,
      viewHoroscopeDasha: false,
      viewDetailedKundli: false,
      viewContact: true,
      viewHoroscope: true,
    });
  });

  it("defaults to the legacy-compatible prospect share type", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "prospect@example.com",
      expiryDate: tomorrow,
      bioData: sampleBioData,
    });

    expect(share.shareType).toBe("prospect");
    expect(share.permissions).toEqual({
      viewBasic: true,
      viewPhotos: true,
      viewHoroscopeSummary: false,
      viewHoroscopeBirthDetails: false,
      viewHoroscopeDasha: false,
      viewDetailedKundli: false,
      viewContact: false,
      viewHoroscope: false,
    });
  });

  it("sanitizes horoscope to summary-only fields when summary access is granted", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "summary@example.com",
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

    const result = await getPublicShareByToken(share.token);
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") {
      return;
    }

    expect(result.bioData.horoscope.gotra).toBe("Kashyap");
    expect(result.bioData.horoscope.marsDosha).toBe("no");
    expect(result.bioData.horoscope.birthTime).toBe("");
    expect(result.bioData.horoscope.birthPlace).toBe("");
    expect(result.bioData.horoscope.computedKundli.result?.rashi).toBe("Mithun");
    expect(result.bioData.horoscope.computedKundli.result?.nakshatra).toBe("Rohini");
    expect(result.bioData.horoscope.computedKundli.result?.lagna).toBe("");
    expect(result.bioData.horoscope.computedKundli.result?.pada).toBeNull();
    expect(result.bioData.horoscope.computedKundli.result?.dashaSummary).toBeNull();
    expect(result.bioData.horoscope.computedKundli.result?.rawEngineResponse).toBeNull();
  });

  it("allows dasha and birth details to be shared without the full kundli", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "granular@example.com",
      expiryDate: tomorrow,
      permissions: {
        viewBasic: true,
        viewPhotos: true,
        viewHoroscopeSummary: true,
        viewHoroscopeBirthDetails: true,
        viewHoroscopeDasha: true,
        viewDetailedKundli: false,
        viewContact: false,
      },
      bioData: sampleBioData,
    });

    const result = await getPublicShareByToken(share.token);
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") {
      return;
    }

    expect(result.bioData.horoscope.birthTime).toBe("08:30");
    expect(result.bioData.horoscope.birthPlace).toBe("Delhi");
    expect(result.bioData.horoscope.computedKundli.result?.dashaSummary).toBeTruthy();
    expect(result.bioData.horoscope.computedKundli.result?.lagna).toBe("");
    expect(result.bioData.horoscope.computedKundli.result?.rawEngineResponse).toBeNull();
  });

  it("grants detailed kundli access for legacy horoscope permissions", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "legacy@example.com",
      expiryDate: tomorrow,
      permissions: {
        viewBasic: true,
        viewPhotos: false,
        viewHoroscope: true,
        viewContact: false,
      },
      bioData: sampleBioData,
    });

    expect(share.permissions).toEqual({
      viewBasic: true,
      viewPhotos: false,
      viewHoroscopeSummary: true,
      viewHoroscopeBirthDetails: true,
      viewHoroscopeDasha: true,
      viewDetailedKundli: true,
      viewContact: false,
      viewHoroscope: true,
    });

    const result = await getPublicShareByToken(share.token);
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") {
      return;
    }

    expect(result.bioData.horoscope.birthTime).toBe("08:30");
    expect(result.bioData.horoscope.computedKundli.result?.lagna).toBe("Kark");
    expect(result.bioData.horoscope.computedKundli.result?.rawEngineResponse).toBeTruthy();
  });

  it("removes biodata fields from horoscope-only shares at the API layer", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "astro@example.com",
      shareType: "horoscope_only",
      expiryDate: tomorrow,
      bioData: sampleBioData,
    });

    const result = await getPublicShareByToken(share.token);
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") {
      return;
    }

    expect(result.bioData.personalDetails.fullName).toBe("");
    expect(result.bioData.family.location).toBe("");
    expect(result.bioData.photos.items).toEqual([]);
    expect(result.bioData.horoscope.computedKundli.result?.rashi).toBe("Mithun");
  });

  it("rejects invalid share types", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    await expect(() =>
      createShare({
        ownerUserId: "user-1",
        recipient: "family@example.com",
        shareType: "invalid_type",
        expiryDate: tomorrow,
        bioData: sampleBioData,
      })
    ).rejects.toThrow("shareType must be one of");
  });

  it("builds an analytics summary from shares and access events", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const familyShare = await createShare({
      ownerUserId: "user-1",
      recipient: "family@example.com",
      shareType: "family",
      expiryDate: tomorrow,
      bioData: sampleBioData,
    });
    const brokerShare = await createShare({
      ownerUserId: "user-1",
      recipient: "broker@example.com",
      shareType: "broker",
      expiryDate: tomorrow,
      source: "share_dashboard",
      bioData: sampleBioData,
    });

    await getPublicShareByToken(familyShare.token, { ipAddress: "1.1.1.1" });
    await getPublicShareByToken(familyShare.token, { ipAddress: "1.1.1.1" });
    await getPublicShareByToken(brokerShare.token, { ipAddress: "2.2.2.2" });

    const summary = await getShareAnalyticsSummary("user-1", new Date());

    expect(summary.totals.shares).toBe(2);
    expect(summary.totals.opens).toBe(3);
    expect(summary.totals.uniqueVisitors).toBe(2);
    expect(summary.opensWindow.last7Days).toBe(3);
    expect(summary.byType.find((item) => item.shareType === "family")).toMatchObject({ count: 1, opens: 2 });
    expect(summary.bySource.find((item) => item.source === "share_dashboard")).toMatchObject({ count: 1, opens: 1 });
    expect(summary.topShares[0]).toMatchObject({ recipient: "family@example.com", openCount: 2 });
    expect(summary.recentActivity.length).toBeGreaterThan(0);
  });
});
