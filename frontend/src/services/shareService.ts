import type { SharePermissions, ShareRecord, ShareSource, ShareType } from "../store/bioDataSlice";
import { normalizeSharePermissions } from "../utils/sharePermissions";

export type SharePresetDefinition = {
  shareType: ShareType;
  label: string;
  description: string;
  defaultExpiryDays: number;
  recommendedFor: string;
  permissions: SharePermissions;
};

export const shareTypeOptions: Array<{ value: ShareType; label: string; description: string }> = [
  {
    value: "family",
    label: "Family",
    description: "High-trust sharing for close family review."
  },
  {
    value: "prospect",
    label: "Prospect",
    description: "Balanced default for a potential match."
  },
  {
    value: "broker",
    label: "Broker",
    description: "Broker-friendly preset with key horoscope context."
  },
  {
    value: "private",
    label: "Private",
    description: "Starts with only basic details visible."
  },
  {
    value: "horoscope_only",
    label: "Horoscope Only",
    description: "Only horoscope is shared by default."
  }
];

const sharePresetMap: Record<ShareType, SharePermissions> = {
  family: {
    viewBasic: true,
    viewPhotos: true,
    viewHoroscopeSummary: true,
    viewHoroscopeBirthDetails: true,
    viewHoroscopeDasha: true,
    viewDetailedKundli: true,
    viewContact: false
  },
  prospect: {
    viewBasic: true,
    viewPhotos: true,
    viewHoroscopeSummary: false,
    viewHoroscopeBirthDetails: false,
    viewHoroscopeDasha: false,
    viewDetailedKundli: false,
    viewContact: false
  },
  broker: {
    viewBasic: true,
    viewPhotos: true,
    viewHoroscopeSummary: true,
    viewHoroscopeBirthDetails: false,
    viewHoroscopeDasha: false,
    viewDetailedKundli: false,
    viewContact: false
  },
  private: {
    viewBasic: true,
    viewPhotos: false,
    viewHoroscopeSummary: false,
    viewHoroscopeBirthDetails: false,
    viewHoroscopeDasha: false,
    viewDetailedKundli: false,
    viewContact: false
  },
  horoscope_only: {
    viewBasic: false,
    viewPhotos: false,
    viewHoroscopeSummary: true,
    viewHoroscopeBirthDetails: true,
    viewHoroscopeDasha: true,
    viewDetailedKundli: true,
    viewContact: false
  }
};

const sharePresetMetadata: Record<ShareType, Omit<SharePresetDefinition, "shareType" | "permissions">> = {
  family: {
    label: "Family",
    description: "High-trust sharing for close family review with full biodata and kundli.",
    defaultExpiryDays: 45,
    recommendedFor: "Parents, siblings, and close relatives."
  },
  prospect: {
    label: "Prospect",
    description: "Balanced default for a likely match without revealing sensitive horoscope data too early.",
    defaultExpiryDays: 30,
    recommendedFor: "Direct shares with a likely match or their family."
  },
  broker: {
    label: "Broker",
    description: "Designed for mediated introductions with summary-level horoscope access.",
    defaultExpiryDays: 21,
    recommendedFor: "Matchmakers, brokers, and delegated introductions."
  },
  private: {
    label: "Private",
    description: "Minimal sharing when you want to confirm interest before revealing more.",
    defaultExpiryDays: 14,
    recommendedFor: "Low-trust or early-stage conversations."
  },
  horoscope_only: {
    label: "Horoscope Only",
    description: "Share kundli details without the full biodata profile.",
    defaultExpiryDays: 10,
    recommendedFor: "Astrologers or compatibility-first review."
  }
};

export const defaultShareType: ShareType = "prospect";

export const defaultSharePermissions: SharePermissions = normalizeSharePermissions(sharePresetMap[defaultShareType]);

export function getSharePresetPermissions(shareType: ShareType): SharePermissions {
  return normalizeSharePermissions(sharePresetMap[shareType]);
}

export function listSharePresetDefinitions(): SharePresetDefinition[] {
  return (Object.keys(sharePresetMap) as ShareType[]).map((shareType) => ({
    shareType,
    ...sharePresetMetadata[shareType],
    permissions: getSharePresetPermissions(shareType),
  }));
}

export function getSharePresetDefinition(shareType: ShareType): SharePresetDefinition {
  return listSharePresetDefinitions().find((preset) => preset.shareType === shareType) ?? {
    shareType,
    label: formatShareTypeLabel(shareType),
    description: "",
    defaultExpiryDays: 30,
    recommendedFor: "",
    permissions: getSharePresetPermissions(shareType),
  };
}

export function getPresetExpiryDate(shareType: ShareType, baseDate = new Date()) {
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + getSharePresetDefinition(shareType).defaultExpiryDays);
  return nextDate.toISOString().slice(0, 10);
}

export function formatShareTypeLabel(shareType: ShareType) {
  return shareTypeOptions.find((option) => option.value === shareType)?.label ?? shareType;
}

export type ShareStatusFilter = "all" | "active" | "revoked" | "expired";
export type ShareTypeFilter = "all" | ShareType;

export function getShareStatus(share: Pick<ShareRecord, "status" | "expiryDate">, currentDate = new Date()): "active" | "revoked" | "expired" {
  if (share.status === "revoked") {
    return "revoked";
  }

  const today = currentDate.toISOString().slice(0, 10);
  if (share.expiryDate < today) {
    return "expired";
  }

  return "active";
}

export function filterShares(
  shares: ShareRecord[],
  statusFilter: ShareStatusFilter,
  typeFilter: ShareTypeFilter,
  currentDate = new Date()
) {
  return shares.filter((share) => {
    if (statusFilter !== "all" && getShareStatus(share, currentDate) !== statusFilter) {
      return false;
    }

    if (typeFilter !== "all" && share.shareType !== typeFilter) {
      return false;
    }

    return true;
  });
}

export type ShareDraftPrefill = {
  recipient: string;
  shareType: ShareType;
  label: string;
  expiryDate: string;
  permissions: SharePermissions;
};

export function createShareDraftFromRecord(share: ShareRecord): ShareDraftPrefill {
  return {
    recipient: share.recipient,
    shareType: share.shareType,
    label: share.label ?? "",
    expiryDate: share.expiryDate,
    permissions: normalizeSharePermissions(share.permissions),
  };
}

export function summarizeShareSource(source: ShareSource) {
  if (source === "preview_page") {
    return "Preview";
  }
  if (source === "share_dashboard") {
    return "Dashboard";
  }
  return "Direct";
}
