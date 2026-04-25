import crypto from "node:crypto";
import { getDbPool } from "../db/pool.js";
import {
  InMemoryShareRepository,
  PostgresShareRepository,
  type ShareRepository,
} from "../db/shareRepository.js";
import type {
  BioDataSnapshot,
  CreateShareInput,
  SharePermissions,
  ShareRecord,
} from "../types/share.js";

const shareRepository: ShareRepository = (() => {
  const pool = getDbPool();
  if (!pool) {
    return new InMemoryShareRepository();
  }
  return new PostgresShareRepository(pool);
})();

const defaultPermissions: SharePermissions = {
  viewBasic: true,
  viewPhotos: true,
  viewHoroscope: false,
  viewContact: false,
};

const asDateOnly = (value: string) => value.slice(0, 10);

function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime());
}

function sanitizePermissions(input: Partial<SharePermissions> | undefined): SharePermissions {
  if (!input) {
    return defaultPermissions;
  }

  return {
    viewBasic: Boolean(input.viewBasic),
    viewPhotos: Boolean(input.viewPhotos),
    viewHoroscope: Boolean(input.viewHoroscope),
    viewContact: Boolean(input.viewContact),
  };
}

function sanitizeBioDataForPublicView(
  source: BioDataSnapshot,
  permissions: SharePermissions
): BioDataSnapshot {
  const sanitized: BioDataSnapshot = JSON.parse(JSON.stringify(source));

  if (!permissions.viewPhotos) {
    sanitized.photos = {
      items: [],
      primaryPhotoId: null,
    };
  }

  if (!permissions.viewHoroscope) {
    sanitized.horoscope = {
      dob: "",
      birthTime: "",
      birthPlace: "",
      rashi: "",
      nakshatra: "",
      gotra: "",
      marsDosha: "",
    };
  }

  if (!permissions.viewContact) {
    sanitized.personalDetails.phone = "";
    sanitized.personalDetails.email = "";
  }

  return sanitized;
}

function validateCreateInput(input: CreateShareInput) {
  if (!input.recipient?.trim()) {
    throw new Error("recipient is required");
  }

  if (!isValidDateString(input.expiryDate)) {
    throw new Error("expiryDate must be in YYYY-MM-DD format");
  }
}

function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

function generateShareId() {
  return crypto.randomUUID();
}

export async function createShare(input: CreateShareInput): Promise<ShareRecord> {
  validateCreateInput(input);

  return shareRepository.create({
    ownerUserId: input.ownerUserId,
    id: generateShareId(),
    token: generateToken(),
    recipient: input.recipient.trim(),
    permissions: sanitizePermissions(input.permissions),
    expiryDate: input.expiryDate,
    bioData: input.bioData,
  });
}

export async function listShares(ownerUserId: string): Promise<ShareRecord[]> {
  return shareRepository.list(ownerUserId);
}

export async function updateSharePermissions(
  shareId: string,
  ownerUserId: string,
  permissions: Partial<SharePermissions>
) {
  const shares = await shareRepository.list(ownerUserId);
  const existing = shares.find((item) => item.id === shareId);
  if (!existing) {
    return null;
  }
  return shareRepository.updatePermissions(
    shareId,
    ownerUserId,
    sanitizePermissions({
      ...existing.permissions,
      ...permissions,
    })
  );
}

export async function revokeShare(shareId: string, ownerUserId: string) {
  return shareRepository.revoke(shareId, ownerUserId);
}

export async function getPublicShareByToken(token: string) {
  const stored = await shareRepository.getByToken(token);
  if (!stored) {
    return { kind: "not_found" as const };
  }

  if (stored.record.status === "revoked") {
    return { kind: "revoked" as const, share: stored.record };
  }

  const today = asDateOnly(new Date().toISOString());
  if (stored.record.expiryDate < today) {
    return { kind: "expired" as const, share: stored.record };
  }

  const touched = await shareRepository.touchLastAccessed(stored.record.id);
  const share = touched ?? stored.record;
  return {
    kind: "ok" as const,
    share,
    bioData: sanitizeBioDataForPublicView(stored.bioData, share.permissions),
  };
}

export async function __resetShareStoreForTests() {
  await shareRepository.resetForTests();
}
