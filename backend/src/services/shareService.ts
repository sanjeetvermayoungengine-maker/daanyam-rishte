import crypto from "node:crypto";
import { getDbPool } from "../db/pool.js";
import {
  InMemoryShareRepository,
  PostgresShareRepository,
  type ShareRepository,
} from "../db/shareRepository.js";
import {
  applySharePreset,
  listSharePresets,
  resolveShareSource,
  resolveShareType,
  sanitizeShareLabel,
} from "./sharePresets.js";
import {
  normalizeSharePermissions,
  normalizeShareRecord,
  sanitizeBioDataForPublicView,
} from "./sharePermissions.js";
import { SHARE_SOURCES } from "../types/share.js";
import type {
  BioDataSnapshot,
  CreateShareInput,
  ShareAnalyticsSummary,
  ShareEventType,
  SharePermissions,
  SharePresetDefinition,
  ShareRecord
} from "../types/share.js";

const shareRepository: ShareRepository = (() => {
  const pool = getDbPool();
  if (!pool) {
    return new InMemoryShareRepository();
  }
  return new PostgresShareRepository(pool);
})();

const asDateOnly = (value: string) => value.slice(0, 10);

function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime());
}

function validateCreateInput(input: CreateShareInput) {
  if (!input.recipient?.trim()) {
    throw new Error("recipient is required");
  }

  if (!isValidDateString(input.expiryDate)) {
    throw new Error("expiryDate must be in YYYY-MM-DD format");
  }

  resolveShareType(input.shareType);
  resolveShareSource(input.source);
}

function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

function generateShareId() {
  return crypto.randomUUID();
}

function hashIp(ipAddress: string | undefined) {
  if (!ipAddress) {
    return null;
  }
  const salt = process.env.SHARE_EVENT_IP_SALT ?? "";
  return crypto.createHash("sha256").update(`${salt}:${ipAddress}`).digest("hex");
}

async function logShareEvent(input: {
  shareId: string;
  eventType: ShareEventType;
  userAgent?: string | null;
  referrer?: string | null;
  ipAddress?: string;
}) {
  await shareRepository.createEvent({
    id: crypto.randomUUID(),
    shareId: input.shareId,
    eventType: input.eventType,
    userAgent: input.userAgent ?? null,
    referrer: input.referrer ?? null,
    ipHash: hashIp(input.ipAddress),
  });
}

export async function createShare(input: CreateShareInput): Promise<ShareRecord> {
  validateCreateInput(input);

  const shareType = resolveShareType(input.shareType);
  const source = resolveShareSource(input.source);

  const share = await shareRepository.create({
    ownerUserId: input.ownerUserId,
    id: generateShareId(),
    token: generateToken(),
    recipient: input.recipient.trim(),
    shareType,
    label: sanitizeShareLabel(input.label),
    source,
    permissions: normalizeSharePermissions(applySharePreset(shareType, input.permissions)),
    expiryDate: input.expiryDate,
    bioData: input.bioData,
  });
  await logShareEvent({ shareId: share.id, eventType: "share_created" });
  return normalizeShareRecord(share);
}

export function getSharePresetDefinitions(): SharePresetDefinition[] {
  return listSharePresets();
}

export async function listShares(ownerUserId: string): Promise<ShareRecord[]> {
  return (await shareRepository.list(ownerUserId)).map(normalizeShareRecord);
}

function getDerivedShareStatus(share: ShareRecord, currentDate = new Date()) {
  if (share.status === "revoked") {
    return "revoked" as const;
  }

  const today = asDateOnly(currentDate.toISOString());
  return share.expiryDate < today ? "expired" as const : "active" as const;
}

export async function getShareAnalyticsSummary(
  ownerUserId: string,
  currentDate = new Date()
): Promise<ShareAnalyticsSummary> {
  const shares = await listShares(ownerUserId);
  const events = await shareRepository.listEventsByShareIds(shares.map((share) => share.id));
  const opens = events.filter((event) => event.eventType === "share_opened");
  const sevenDaysAgo = currentDate.getTime() - (7 * 86400000);
  const thirtyDaysAgo = currentDate.getTime() - (30 * 86400000);
  const shareById = new Map(shares.map((share) => [share.id, share]));

  return {
    totals: {
      shares: shares.length,
      active: shares.filter((share) => getDerivedShareStatus(share, currentDate) === "active").length,
      revoked: shares.filter((share) => share.status === "revoked").length,
      expired: shares.filter((share) => getDerivedShareStatus(share, currentDate) === "expired").length,
      opens: opens.length,
      uniqueVisitors: new Set(opens.map((event) => event.ipHash).filter(Boolean)).size,
      openedShares: shares.filter((share) => share.openCount > 0).length,
    },
    opensWindow: {
      last7Days: opens.filter((event) => Date.parse(event.occurredAt) >= sevenDaysAgo).length,
      last30Days: opens.filter((event) => Date.parse(event.occurredAt) >= thirtyDaysAgo).length,
    },
    byType: getSharePresetDefinitions().map((preset) => {
      const matching = shares.filter((share) => share.shareType === preset.shareType);
      return {
        shareType: preset.shareType,
        count: matching.length,
        opens: matching.reduce((sum, share) => sum + share.openCount, 0),
      };
    }),
    bySource: SHARE_SOURCES.map((source) => {
      const matching = shares.filter((share) => share.source === source);
      return {
        source,
        count: matching.length,
        opens: matching.reduce((sum, share) => sum + share.openCount, 0),
      };
    }),
    recentActivity: events
      .slice()
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
      .slice(0, 8)
      .map((event) => ({
        shareId: event.shareId,
        label: shareById.get(event.shareId)?.label ?? shareById.get(event.shareId)?.recipient ?? "Share link",
        eventType: event.eventType,
        occurredAt: event.occurredAt,
      })),
    topShares: shares
      .slice()
      .sort((a, b) => {
        if (b.openCount !== a.openCount) {
          return b.openCount - a.openCount;
        }
        return (b.lastOpenedAt ?? "").localeCompare(a.lastOpenedAt ?? "");
      })
      .slice(0, 5)
      .map((share) => ({
        shareId: share.id,
        label: share.label ?? share.recipient,
        recipient: share.recipient,
        shareType: share.shareType,
        openCount: share.openCount,
        lastOpenedAt: share.lastOpenedAt,
        status: getDerivedShareStatus(share, currentDate),
      })),
  };
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
  const updated = await shareRepository.updatePermissions(
    shareId,
    ownerUserId,
    normalizeSharePermissions({
      ...existing.permissions,
      ...permissions,
    })
  );
  if (updated) {
    await logShareEvent({ shareId: updated.id, eventType: "permissions_updated" });
  }
  return updated ? normalizeShareRecord(updated) : null;
}

export async function revokeShare(shareId: string, ownerUserId: string) {
  const revoked = await shareRepository.revoke(shareId, ownerUserId);
  if (revoked) {
    await logShareEvent({ shareId: revoked.id, eventType: "share_revoked" });
  }
  return revoked ? normalizeShareRecord(revoked) : null;
}

export async function getPublicShareByToken(
  token: string,
  context?: {
    userAgent?: string | null;
    referrer?: string | null;
    ipAddress?: string;
  }
) {
  const stored = await shareRepository.getByToken(token);
  if (!stored) {
    return { kind: "not_found" as const };
  }

  if (stored.record.status === "revoked") {
    return { kind: "revoked" as const, share: normalizeShareRecord(stored.record) };
  }

  const today = asDateOnly(new Date().toISOString());
  if (stored.record.expiryDate < today) {
    return { kind: "expired" as const, share: normalizeShareRecord(stored.record) };
  }

  const touched = await shareRepository.touchLastAccessed(stored.record.id);
  const share = normalizeShareRecord(touched ?? stored.record);
  await logShareEvent({
    shareId: share.id,
    eventType: "share_opened",
    userAgent: context?.userAgent,
    referrer: context?.referrer,
    ipAddress: context?.ipAddress,
  });
  return {
    kind: "ok" as const,
    share,
    bioData: sanitizeBioDataForPublicView(stored.bioData, share.permissions),
  };
}

export async function __resetShareStoreForTests() {
  await shareRepository.resetForTests();
}

export async function __listShareEventsForTests(shareIds: string[]) {
  return shareRepository.listEventsByShareIds(shareIds);
}
