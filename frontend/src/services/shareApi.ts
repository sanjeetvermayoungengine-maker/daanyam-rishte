import type { BioDataState, SharePermissions, ShareRecord, ShareSource, ShareType } from "../store/bioDataSlice";
import { api } from "./api";
import { normalizeShareRecord } from "../utils/sharePermissions";
import type { SharePresetDefinition } from "./shareService";

export type ShareApiRecord = ShareRecord;

export type PublicShareResponse = {
  share: ShareApiRecord;
  bioData: BioDataState;
};

export type PublicShareError = {
  status: number;
  code: "not_found" | "revoked" | "expired" | "unknown";
};

export type ShareAnalyticsSummary = {
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
    eventType: "share_created" | "share_opened" | "share_revoked" | "permissions_updated";
    occurredAt: string;
  }>;
  topShares: Array<{
    shareId: string;
    label: string;
    recipient: string;
    shareType: ShareType;
    openCount: number;
    lastOpenedAt: string | null;
    status: "active" | "revoked" | "expired";
  }>;
};

export async function createShareApi(input: {
  recipient: string;
  shareType: ShareType;
  label?: string;
  source?: ShareSource;
  expiryDate: string;
  permissions?: Partial<SharePermissions>;
  bioData: BioDataState;
}) {
  const response = await api.post<{ share: ShareApiRecord }>("/api/shares", input);
  return normalizeShareRecord(response.data.share);
}

export async function listSharesApi() {
  const response = await api.get<{ shares: ShareApiRecord[] }>("/api/shares");
  return response.data.shares.map(normalizeShareRecord);
}

export async function listSharePresetsApi() {
  const response = await api.get<{ presets: SharePresetDefinition[] }>("/api/shares/presets");
  return response.data.presets;
}

export async function fetchShareAnalyticsSummaryApi() {
  const response = await api.get<{ summary: ShareAnalyticsSummary }>("/api/shares/analytics/summary");
  return response.data.summary;
}

export async function updateSharePermissionsApi(shareId: string, permissions: SharePermissions) {
  const response = await api.patch<{ share: ShareApiRecord }>(`/api/shares/${shareId}/permissions`, {
    permissions,
  });
  return normalizeShareRecord(response.data.share);
}

export async function revokeShareApi(shareId: string) {
  const response = await api.patch<{ share: ShareApiRecord }>(`/api/shares/${shareId}/revoke`);
  return normalizeShareRecord(response.data.share);
}

export async function fetchPublicShareByToken(token: string): Promise<PublicShareResponse> {
  try {
    const response = await api.get<PublicShareResponse>(`/api/shares/${token}`);
    return {
      ...response.data,
      share: normalizeShareRecord(response.data.share),
    };
  } catch (error) {
    const status = typeof error === "object" && error && "response" in error
      ? Number((error as { response?: { status?: number } }).response?.status ?? 0)
      : 0;
    const code: PublicShareError["code"] =
      status === 404 ? "not_found" : status === 403 ? "revoked" : status === 410 ? "expired" : "unknown";
    throw { status, code } satisfies PublicShareError;
  }
}
