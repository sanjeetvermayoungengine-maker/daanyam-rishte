import { afterEach, describe, expect, it } from "vitest";
import {
  __resetShareStoreForTests,
  createShare,
  getPublicShareByToken,
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
    rashi: "Mithun",
    nakshatra: "Rohini",
    gotra: "Kashyap",
    marsDosha: "no",
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
      permissions: {
        viewBasic: true,
        viewPhotos: true,
        viewHoroscope: false,
        viewContact: false,
      },
      bioData: sampleBioData,
    });

    const result = await getPublicShareByToken(share.token);
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") {
      return;
    }
    expect(result.bioData.personalDetails.phone).toBe("");
    expect(result.bioData.personalDetails.email).toBe("");
    expect(result.bioData.horoscope.rashi).toBe("");
  });

  it("returns revoked for revoked links", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "family@example.com",
      expiryDate: tomorrow,
      permissions: {
        viewBasic: true,
        viewPhotos: true,
        viewHoroscope: true,
        viewContact: true,
      },
      bioData: sampleBioData,
    });

    await revokeShare(share.id, "user-1");
    const result = await getPublicShareByToken(share.token);
    expect(result.kind).toBe("revoked");
  });

  it("updates permissions", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const share = await createShare({
      ownerUserId: "user-1",
      recipient: "family@example.com",
      expiryDate: tomorrow,
      permissions: {
        viewBasic: true,
        viewPhotos: true,
        viewHoroscope: true,
        viewContact: true,
      },
      bioData: sampleBioData,
    });

    const updated = await updateSharePermissions(share.id, "user-1", { viewPhotos: false });
    expect(updated?.permissions.viewPhotos).toBe(false);
  });
});
