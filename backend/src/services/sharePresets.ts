import {
  SHARE_SOURCES,
  SHARE_TYPES,
  type SharePermissions,
  type SharePresetDefinition,
  type ShareSource,
  type ShareType,
} from "../types/share.js";
import { normalizeSharePermissions } from "./sharePermissions.js";

export const DEFAULT_SHARE_TYPE: ShareType = "prospect";
export const DEFAULT_SHARE_SOURCE: ShareSource = "direct_flow";

const sharePresetMap: Record<ShareType, Omit<SharePresetDefinition, "shareType" | "permissions"> & {
  permissions: Partial<SharePermissions>;
}> = {
  family: {
    label: "Family",
    description: "High-trust sharing for close family review with full biodata and kundli.",
    defaultExpiryDays: 45,
    recommendedFor: "Parents, siblings, and close relatives.",
    permissions: {
      viewBasic: true,
      viewPhotos: true,
      viewHoroscopeSummary: true,
      viewHoroscopeBirthDetails: true,
      viewHoroscopeDasha: true,
      viewDetailedKundli: true,
      viewContact: false,
    },
  },
  prospect: {
    label: "Prospect",
    description: "Balanced default for a potential match without exposing sensitive horoscope data upfront.",
    defaultExpiryDays: 30,
    recommendedFor: "Direct shares with a likely match or their family.",
    permissions: {
      viewBasic: true,
      viewPhotos: true,
      viewHoroscopeSummary: false,
      viewHoroscopeBirthDetails: false,
      viewHoroscopeDasha: false,
      viewDetailedKundli: false,
      viewContact: false,
    },
  },
  broker: {
    label: "Broker",
    description: "Broker-friendly preset with biodata and key horoscope context, without direct contact info.",
    defaultExpiryDays: 21,
    recommendedFor: "Mediators, matchmakers, and delegated introductions.",
    permissions: {
      viewBasic: true,
      viewPhotos: true,
      viewHoroscopeSummary: true,
      viewHoroscopeBirthDetails: false,
      viewHoroscopeDasha: false,
      viewDetailedKundli: false,
      viewContact: false,
    },
  },
  private: {
    label: "Private",
    description: "Minimal sharing when you want to confirm interest before revealing more.",
    defaultExpiryDays: 14,
    recommendedFor: "Low-trust introductions or early qualification.",
    permissions: {
      viewBasic: true,
      viewPhotos: false,
      viewHoroscopeSummary: false,
      viewHoroscopeBirthDetails: false,
      viewHoroscopeDasha: false,
      viewDetailedKundli: false,
      viewContact: false,
    },
  },
  horoscope_only: {
    label: "Horoscope Only",
    description: "Share kundli details without exposing the full biodata profile.",
    defaultExpiryDays: 10,
    recommendedFor: "Astrologers or compatibility-first review.",
    permissions: {
      viewBasic: false,
      viewPhotos: false,
      viewHoroscopeSummary: true,
      viewHoroscopeBirthDetails: true,
      viewHoroscopeDasha: true,
      viewDetailedKundli: true,
      viewContact: false,
    },
  },
};

export function isShareType(value: unknown): value is ShareType {
  return typeof value === "string" && SHARE_TYPES.includes(value as ShareType);
}

export function isShareSource(value: unknown): value is ShareSource {
  return typeof value === "string" && SHARE_SOURCES.includes(value as ShareSource);
}

export function resolveShareType(value: unknown): ShareType {
  if (value == null || value === "") {
    return DEFAULT_SHARE_TYPE;
  }
  if (!isShareType(value)) {
    throw new Error(`shareType must be one of: ${SHARE_TYPES.join(", ")}`);
  }
  return value;
}

export function resolveShareSource(value: unknown): ShareSource {
  if (value == null || value === "") {
    return DEFAULT_SHARE_SOURCE;
  }
  if (!isShareSource(value)) {
    throw new Error(`source must be one of: ${SHARE_SOURCES.join(", ")}`);
  }
  return value;
}

export function getSharePresetPermissions(shareType: ShareType): SharePermissions {
  return normalizeSharePermissions(sharePresetMap[shareType].permissions);
}

export function applySharePreset(
  shareType: ShareType,
  overrides?: Partial<SharePermissions>
): SharePermissions {
  return normalizeSharePermissions({
    ...getSharePresetPermissions(shareType),
    ...overrides,
  });
}

export function listSharePresets(): SharePresetDefinition[] {
  return SHARE_TYPES.map((shareType) => ({
    shareType,
    label: sharePresetMap[shareType].label,
    description: sharePresetMap[shareType].description,
    defaultExpiryDays: sharePresetMap[shareType].defaultExpiryDays,
    recommendedFor: sharePresetMap[shareType].recommendedFor,
    permissions: getSharePresetPermissions(shareType),
  }));
}

export function sanitizeShareLabel(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return null;
  }

  return cleaned.slice(0, 120);
}
