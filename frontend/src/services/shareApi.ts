import type { BioDataState, SharePermissions, ShareRecord } from "../store/bioDataSlice";
import { api } from "./api";

export type ShareApiRecord = ShareRecord;

export type PublicShareResponse = {
  share: ShareApiRecord;
  bioData: BioDataState;
};

export type PublicShareError = {
  status: number;
  code: "not_found" | "revoked" | "expired" | "unknown";
};

export async function createShareApi(input: {
  recipient: string;
  expiryDate: string;
  permissions: SharePermissions;
  bioData: BioDataState;
}) {
  const response = await api.post<{ share: ShareApiRecord }>("/api/shares", input);
  return response.data.share;
}

export async function listSharesApi() {
  const response = await api.get<{ shares: ShareApiRecord[] }>("/api/shares");
  return response.data.shares;
}

export async function updateSharePermissionsApi(shareId: string, permissions: SharePermissions) {
  const response = await api.patch<{ share: ShareApiRecord }>(`/api/shares/${shareId}/permissions`, {
    permissions,
  });
  return response.data.share;
}

export async function revokeShareApi(shareId: string) {
  const response = await api.patch<{ share: ShareApiRecord }>(`/api/shares/${shareId}/revoke`);
  return response.data.share;
}

export async function fetchPublicShareByToken(token: string): Promise<PublicShareResponse> {
  try {
    const response = await api.get<PublicShareResponse>(`/api/shares/${token}`);
    return response.data;
  } catch (error) {
    const status = typeof error === "object" && error && "response" in error
      ? Number((error as { response?: { status?: number } }).response?.status ?? 0)
      : 0;
    const code: PublicShareError["code"] =
      status === 404 ? "not_found" : status === 403 ? "revoked" : status === 410 ? "expired" : "unknown";
    throw { status, code } satisfies PublicShareError;
  }
}
