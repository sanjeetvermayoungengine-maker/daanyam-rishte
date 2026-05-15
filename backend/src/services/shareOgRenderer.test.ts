import { describe, expect, it } from "vitest";
import {
  buildOgPayload,
  isCrawlerUserAgent,
  renderShareErrorOgHtml,
  renderShareOgHtml,
} from "./shareOgRenderer.js";
import type { BioDataSnapshot, SharePermissions, ShareRecord } from "../types/share.js";

function basePermissions(overrides: Partial<SharePermissions> = {}): SharePermissions {
  return {
    viewBasic: true,
    viewPhotos: false,
    viewHoroscopeSummary: false,
    viewHoroscopeBirthDetails: false,
    viewHoroscopeDasha: false,
    viewDetailedKundli: false,
    viewContact: false,
    ...overrides,
  };
}

function baseShare(overrides: Partial<ShareRecord> = {}): ShareRecord {
  return {
    id: "share-id",
    token: "tok123",
    recipient: "Family",
    shareType: "family",
    label: null,
    source: "share_dashboard",
    permissions: basePermissions(),
    expiryDate: "2099-01-01",
    createdAt: "2024-01-01T00:00:00.000Z",
    lastAccessed: null,
    openCount: 0,
    firstOpenedAt: null,
    lastOpenedAt: null,
    status: "active",
    ...overrides,
  };
}

function baseBio(overrides: Partial<BioDataSnapshot> = {}): BioDataSnapshot {
  return {
    personalDetails: { fullName: "Aanya Sharma", age: "27", religion: "Hindu", education: "B.Tech", currentCity: "Bengaluru" },
    photos: { items: [], primaryPhotoId: null },
    family: {
      fatherName: "",
      motherName: "",
      fatherOccupation: "",
      motherOccupation: "",
      siblings: [],
      familyType: "",
      location: "",
    },
    horoscope: {
      dob: "",
      birthTime: "",
      birthPlace: "",
      selectedBirthPlaceLabel: "",
      birthLatitude: "",
      birthLongitude: "",
      birthTimezone: "",
      birthLocation: null as never,
      gotra: "",
      marsDosha: "",
      computedKundli: null as never,
    },
    template: "traditional",
    ...overrides,
  };
}

describe("isCrawlerUserAgent", () => {
  it("returns true for WhatsApp", () => {
    expect(isCrawlerUserAgent("WhatsApp/2.21.11.17 A")).toBe(true);
  });
  it("returns true for Twitterbot", () => {
    expect(isCrawlerUserAgent("Twitterbot/1.0")).toBe(true);
  });
  it("returns true for facebookexternalhit", () => {
    expect(isCrawlerUserAgent("facebookexternalhit/1.1")).toBe(true);
  });
  it("returns false for a regular Chrome UA", () => {
    expect(
      isCrawlerUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      )
    ).toBe(false);
  });
  it("returns false for null/undefined", () => {
    expect(isCrawlerUserAgent(undefined)).toBe(false);
    expect(isCrawlerUserAgent(null)).toBe(false);
    expect(isCrawlerUserAgent("")).toBe(false);
  });
});

describe("buildOgPayload", () => {
  it("uses the full name in the title when viewBasic is true", () => {
    const payload = buildOgPayload({ token: "tok123", share: baseShare(), bioData: baseBio() });
    expect(payload.title).toContain("Aanya Sharma");
  });

  it("falls back to generic title when viewBasic is false", () => {
    const share = baseShare({ permissions: basePermissions({ viewBasic: false }) });
    const payload = buildOgPayload({ token: "tok123", share, bioData: baseBio() });
    expect(payload.title).not.toContain("Aanya");
    expect(payload.title).toContain("A Marriage Biodata");
  });

  it("uses fallback OG image when viewPhotos is false even if photos exist", () => {
    const share = baseShare({ permissions: basePermissions({ viewPhotos: false }) });
    const bio = baseBio({
      photos: { items: [{ id: "p1", url: "https://cdn.example/p1.jpg", name: "p1", uploadedAt: "" }], primaryPhotoId: "p1" },
    });
    const payload = buildOgPayload({ token: "tok123", share, bioData: bio });
    expect(payload.image).not.toBe("https://cdn.example/p1.jpg");
    expect(payload.image).toContain("og-image.png");
  });

  it("uses primary photo when viewPhotos is true", () => {
    const share = baseShare({ permissions: basePermissions({ viewPhotos: true }) });
    const bio = baseBio({
      photos: {
        items: [
          { id: "p1", url: "https://cdn.example/p1.jpg", name: "p1", uploadedAt: "" },
          { id: "p2", url: "https://cdn.example/p2.jpg", name: "p2", uploadedAt: "" },
        ],
        primaryPhotoId: "p2",
      },
    });
    const payload = buildOgPayload({ token: "tok123", share, bioData: bio });
    expect(payload.image).toBe("https://cdn.example/p2.jpg");
  });

  it("does NOT use data: URLs (uses fallback instead)", () => {
    const share = baseShare({ permissions: basePermissions({ viewPhotos: true }) });
    const bio = baseBio({
      photos: { items: [{ id: "p1", url: "data:image/jpeg;base64,/9j/", name: "p1", uploadedAt: "" }], primaryPhotoId: "p1" },
    });
    const payload = buildOgPayload({ token: "tok123", share, bioData: bio });
    expect(payload.image).not.toMatch(/^data:/);
  });

  it("includes age/religion/city in description when viewBasic is true", () => {
    const payload = buildOgPayload({ token: "tok123", share: baseShare(), bioData: baseBio() });
    expect(payload.description).toContain("27");
    expect(payload.description).toContain("Hindu");
    expect(payload.description).toContain("Bengaluru");
  });

  it("hides basic fields when viewBasic is false", () => {
    const share = baseShare({ permissions: basePermissions({ viewBasic: false }) });
    const payload = buildOgPayload({ token: "tok123", share, bioData: baseBio() });
    expect(payload.description).not.toContain("Hindu");
    expect(payload.description).not.toContain("Bengaluru");
  });
});

describe("renderShareOgHtml", () => {
  it("escapes HTML special chars in name/description", () => {
    const payload = buildOgPayload({
      token: "tok123",
      share: baseShare(),
      bioData: baseBio({ personalDetails: { ...baseBio().personalDetails, fullName: "<script>alert(1)</script>" } }),
    });
    const html = renderShareOgHtml(payload);
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("includes core OG tags", () => {
    const payload = buildOgPayload({ token: "tok123", share: baseShare(), bioData: baseBio() });
    const html = renderShareOgHtml(payload);
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:description"');
    expect(html).toContain('property="og:image"');
    expect(html).toContain('property="og:url"');
    expect(html).toContain('name="twitter:card"');
  });

  it("includes noindex robots directive (share pages should not be indexed)", () => {
    const payload = buildOgPayload({ token: "tok123", share: baseShare(), bioData: baseBio() });
    const html = renderShareOgHtml(payload);
    expect(html).toContain('name="robots"');
    expect(html).toContain("noindex");
  });
});

describe("renderShareErrorOgHtml", () => {
  it("returns valid HTML for not_found", () => {
    const html = renderShareErrorOgHtml({ token: "tok123", reason: "not_found" });
    expect(html).toContain("not found");
    expect(html).toContain('property="og:title"');
  });
  it("returns valid HTML for expired", () => {
    const html = renderShareErrorOgHtml({ token: "tok123", reason: "expired" });
    expect(html).toContain("expired");
  });
  it("returns valid HTML for revoked", () => {
    const html = renderShareErrorOgHtml({ token: "tok123", reason: "revoked" });
    expect(html).toContain("no longer active");
  });
});
