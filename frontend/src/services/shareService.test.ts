import { describe, expect, it } from "vitest";
import type { ShareRecord } from "../store/bioDataSlice";
import { createShareDraftFromRecord, filterShares, getShareStatus } from "./shareService";

function createShare(overrides: Partial<ShareRecord>): ShareRecord {
  return {
    id: "share-1",
    token: "token-1",
    recipient: "test@example.com",
    shareType: "prospect",
    label: null,
    source: "share_dashboard",
    permissions: {
      viewBasic: true,
      viewPhotos: true,
      viewHoroscopeSummary: false,
      viewHoroscopeBirthDetails: false,
      viewHoroscopeDasha: false,
      viewDetailedKundli: false,
      viewContact: false,
    },
    expiryDate: "2026-05-20",
    createdAt: "2026-04-20T10:00:00.000Z",
    lastAccessed: null,
    openCount: 0,
    firstOpenedAt: null,
    lastOpenedAt: null,
    status: "active",
    ...overrides,
  };
}

describe("shareService helpers", () => {
  it("derives effective share status including expired", () => {
    const today = new Date("2026-04-26T00:00:00.000Z");

    expect(getShareStatus(createShare({ status: "revoked" }), today)).toBe("revoked");
    expect(getShareStatus(createShare({ expiryDate: "2026-04-01" }), today)).toBe("expired");
    expect(getShareStatus(createShare({ expiryDate: "2026-05-20" }), today)).toBe("active");
  });

  it("filters shares by status and share type", () => {
    const today = new Date("2026-04-26T00:00:00.000Z");
    const shares = [
      createShare({ id: "1", shareType: "prospect", status: "active", expiryDate: "2026-05-01" }),
      createShare({ id: "2", shareType: "family", status: "active", expiryDate: "2026-04-01" }),
      createShare({ id: "3", shareType: "broker", status: "revoked", expiryDate: "2026-05-01" }),
    ];

    const expiredOnly = filterShares(shares, "expired", "all", today);
    expect(expiredOnly.map((share) => share.id)).toEqual(["2"]);

    const activeProspects = filterShares(shares, "active", "prospect", today);
    expect(activeProspects.map((share) => share.id)).toEqual(["1"]);
  });

  it("creates a duplicate draft from existing share", () => {
    const share = createShare({
      recipient: "Sharma family",
      shareType: "family",
      label: "Delhi follow-up",
      expiryDate: "2026-06-01",
      permissions: {
        viewBasic: true,
        viewPhotos: false,
        viewHoroscopeSummary: true,
        viewHoroscopeBirthDetails: true,
        viewHoroscopeDasha: true,
        viewDetailedKundli: true,
        viewContact: true,
      },
    });

    const draft = createShareDraftFromRecord(share);
    expect(draft).toEqual({
      recipient: "Sharma family",
      shareType: "family",
      label: "Delhi follow-up",
      expiryDate: "2026-06-01",
      permissions: {
        viewBasic: true,
        viewPhotos: false,
        viewHoroscopeSummary: true,
        viewHoroscopeBirthDetails: true,
        viewHoroscopeDasha: true,
        viewDetailedKundli: true,
        viewContact: true,
        viewHoroscope: true,
      },
    });
  });
});
