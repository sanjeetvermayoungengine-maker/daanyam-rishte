import type { HoroscopeSnapshot } from "./horoscope.js";

export interface SharePermissions {
  viewBasic: boolean;
  viewPhotos: boolean;
  viewHoroscopeSummary: boolean;
  viewHoroscopeBirthDetails: boolean;
  viewHoroscopeDasha: boolean;
  viewDetailedKundli: boolean;
  viewContact: boolean;
  viewHoroscope?: boolean;
}

export const SHARE_TYPES = ["family", "prospect", "broker", "private", "horoscope_only"] as const;
export type ShareType = typeof SHARE_TYPES[number];

export const SHARE_SOURCES = ["preview_page", "share_dashboard", "direct_flow"] as const;
export type ShareSource = typeof SHARE_SOURCES[number];

export interface BioDataSnapshot {
  personalDetails: Record<string, string>;
  photos: {
    items: Array<{ id: string; url: string; name: string; uploadedAt: string }>;
    primaryPhotoId: string | null;
  };
  family: {
    fatherName: string;
    motherName: string;
    fatherOccupation: string;
    motherOccupation: string;
    siblings: Array<{ id: string; name: string; occupation: string }>;
    familyType: string;
    location: string;
  };
  horoscope: {
    dob: string;
    birthTime: string;
    birthPlace: string;
    selectedBirthPlaceLabel: string;
    birthLatitude: string;
    birthLongitude: string;
    birthTimezone: string;
    birthLocation: HoroscopeSnapshot["birthLocation"];
    gotra: string;
    marsDosha: string;
    computedKundli: HoroscopeSnapshot["computedKundli"];
  };
  template: "traditional" | "modern" | "premium" | "split";
}

export interface ShareRecord {
  id: string;
  token: string;
  recipient: string;
  shareType: ShareType;
  label: string | null;
  source: ShareSource;
  permissions: SharePermissions;
  expiryDate: string;
  createdAt: string;
  lastAccessed: string | null;
  openCount: number;
  firstOpenedAt: string | null;
  lastOpenedAt: string | null;
  status: "active" | "revoked";
}

export interface SharePresetDefinition {
  shareType: ShareType;
  label: string;
  description: string;
  defaultExpiryDays: number;
  recommendedFor: string;
  permissions: SharePermissions;
}

export const SHARE_EVENT_TYPES = [
  "share_created",
  "share_opened",
  "share_revoked",
  "permissions_updated",
] as const;

export type ShareEventType = typeof SHARE_EVENT_TYPES[number];

export interface ShareAccessEvent {
  id: string;
  shareId: string;
  eventType: ShareEventType;
  occurredAt: string;
  userAgent: string | null;
  referrer: string | null;
  ipHash: string | null;
}

export interface ShareAnalyticsSummary {
  totals: {
    shares: number;
    active: number;
    revoked: number;
    expired: number;
    opens: number;
    uniqueVisitors: number;
    openedShares: number;
  };
  opensWindow: {
    last7Days: number;
    last30Days: number;
  };
  byType: Array<{
    shareType: ShareType;
    count: number;
    opens: number;
  }>;
  bySource: Array<{
    source: ShareSource;
    count: number;
    opens: number;
  }>;
  recentActivity: Array<{
    shareId: string;
    label: string;
    eventType: ShareEventType;
    occurredAt: string;
  }>;
  topShares: Array<{
    shareId: string;
    label: string;
    recipient: string;
    shareType: ShareType;
    openCount: number;
    lastOpenedAt: string | null;
    status: ShareRecord["status"] | "expired";
  }>;
}

export interface StoredShare {
  ownerUserId: string;
  record: ShareRecord;
  bioData: BioDataSnapshot;
}

export interface CreateShareInput {
  ownerUserId: string;
  recipient: string;
  shareType?: ShareType | string;
  label?: string | null;
  source?: ShareSource | string;
  expiryDate: string;
  permissions?: Partial<SharePermissions>;
  bioData: BioDataSnapshot;
}
