import crypto from "node:crypto";
import type { Pool } from "pg";
import type { BioDataSnapshot, SharePermissions, ShareRecord, StoredShare } from "../types/share.js";

type ShareStatus = ShareRecord["status"];

type PersistedShareRow = {
  id: string;
  token: string;
  recipient: string;
  permissions: SharePermissions;
  expiry_date: string;
  created_at: string;
  last_accessed_at: string | null;
  status: ShareStatus;
};

export interface ShareRepository {
  create(input: {
    ownerUserId: string;
    id: string;
    token: string;
    recipient: string;
    permissions: SharePermissions;
    expiryDate: string;
    bioData: BioDataSnapshot;
  }): Promise<ShareRecord>;
  list(ownerUserId: string): Promise<ShareRecord[]>;
  updatePermissions(shareId: string, ownerUserId: string, permissions: SharePermissions): Promise<ShareRecord | null>;
  revoke(shareId: string, ownerUserId: string): Promise<ShareRecord | null>;
  getByToken(token: string): Promise<StoredShare | null>;
  touchLastAccessed(shareId: string): Promise<ShareRecord | null>;
  resetForTests(): Promise<void>;
}

function toShareRecord(row: PersistedShareRow): ShareRecord {
  return {
    id: row.id,
    token: row.token,
    recipient: row.recipient,
    permissions: row.permissions,
    expiryDate: row.expiry_date,
    createdAt: row.created_at,
    lastAccessed: row.last_accessed_at,
    status: row.status,
  };
}

export class InMemoryShareRepository implements ShareRepository {
  private readonly sharesById = new Map<string, StoredShare>();
  private readonly shareIdByToken = new Map<string, string>();

  async create(input: {
    ownerUserId: string;
    id: string;
    token: string;
    recipient: string;
    permissions: SharePermissions;
    expiryDate: string;
    bioData: BioDataSnapshot;
  }) {
    const record: ShareRecord = {
      id: input.id,
      token: input.token,
      recipient: input.recipient,
      permissions: input.permissions,
      expiryDate: input.expiryDate,
      createdAt: new Date().toISOString(),
      lastAccessed: null,
      status: "active",
    };

    this.sharesById.set(record.id, { ownerUserId: input.ownerUserId, record, bioData: input.bioData });
    this.shareIdByToken.set(record.token, record.id);
    return record;
  }

  async list(ownerUserId: string) {
    return Array.from(this.sharesById.values())
      .filter((entry) => entry.ownerUserId === ownerUserId)
      .map((entry) => entry.record)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async updatePermissions(shareId: string, ownerUserId: string, permissions: SharePermissions) {
    const stored = this.sharesById.get(shareId);
    if (!stored || stored.ownerUserId !== ownerUserId) {
      return null;
    }
    stored.record.permissions = permissions;
    return stored.record;
  }

  async revoke(shareId: string, ownerUserId: string) {
    const stored = this.sharesById.get(shareId);
    if (!stored || stored.ownerUserId !== ownerUserId) {
      return null;
    }
    stored.record.status = "revoked";
    return stored.record;
  }

  async getByToken(token: string) {
    const shareId = this.shareIdByToken.get(token);
    if (!shareId) {
      return null;
    }
    return this.sharesById.get(shareId) ?? null;
  }

  async touchLastAccessed(shareId: string) {
    const stored = this.sharesById.get(shareId);
    if (!stored) {
      return null;
    }
    stored.record.lastAccessed = new Date().toISOString();
    return stored.record;
  }

  async resetForTests() {
    this.sharesById.clear();
    this.shareIdByToken.clear();
  }
}

export class PostgresShareRepository implements ShareRepository {
  constructor(private readonly pool: Pool) {}

  async create(input: {
    ownerUserId: string;
    id: string;
    token: string;
    recipient: string;
    permissions: SharePermissions;
    expiryDate: string;
    bioData: BioDataSnapshot;
  }) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const profileId = crypto.randomUUID();
      await client.query(
        "INSERT INTO biodata_profiles (id, owner_user_id, payload) VALUES ($1::uuid, $2, $3::jsonb)",
        [profileId, input.ownerUserId, JSON.stringify(input.bioData)]
      );
      const result = await client.query<PersistedShareRow>(
        `INSERT INTO share_links (id, owner_user_id, profile_id, token, recipient, permissions, expiry_date, status)
         VALUES ($1::uuid, $2, $3::uuid, $4, $5, $6::jsonb, $7::date, 'active')
         RETURNING id, token, recipient, permissions, expiry_date::text, created_at::text, last_accessed_at::text, status`,
        [input.id, input.ownerUserId, profileId, input.token, input.recipient, JSON.stringify(input.permissions), input.expiryDate]
      );
      await client.query("COMMIT");
      return toShareRecord(result.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async list(ownerUserId: string) {
    const result = await this.pool.query<PersistedShareRow>(
      `SELECT id, token, recipient, permissions, expiry_date::text, created_at::text, last_accessed_at::text, status
       FROM share_links
       WHERE owner_user_id = $1
       ORDER BY created_at DESC`
      ,
      [ownerUserId]
    );
    return result.rows.map(toShareRecord);
  }

  async updatePermissions(shareId: string, ownerUserId: string, permissions: SharePermissions) {
    const result = await this.pool.query<PersistedShareRow>(
      `UPDATE share_links
       SET permissions = $2::jsonb
       WHERE id = $1::uuid AND owner_user_id = $3
       RETURNING id, token, recipient, permissions, expiry_date::text, created_at::text, last_accessed_at::text, status`,
      [shareId, JSON.stringify(permissions), ownerUserId]
    );
    return result.rows[0] ? toShareRecord(result.rows[0]) : null;
  }

  async revoke(shareId: string, ownerUserId: string) {
    const result = await this.pool.query<PersistedShareRow>(
      `UPDATE share_links
       SET status = 'revoked'
       WHERE id = $1::uuid AND owner_user_id = $2
       RETURNING id, token, recipient, permissions, expiry_date::text, created_at::text, last_accessed_at::text, status`,
      [shareId, ownerUserId]
    );
    return result.rows[0] ? toShareRecord(result.rows[0]) : null;
  }

  async getByToken(token: string) {
    const result = await this.pool.query<
      PersistedShareRow & { payload: BioDataSnapshot; owner_user_id: string }
    >(
      `SELECT
         s.id, s.token, s.recipient, s.permissions, s.expiry_date::text, s.created_at::text, s.last_accessed_at::text, s.status, s.owner_user_id,
         p.payload
       FROM share_links s
       INNER JOIN biodata_profiles p ON p.id = s.profile_id
       WHERE s.token = $1`,
      [token]
    );
    const row = result.rows[0];
    if (!row) {
      return null;
    }
    return {
      ownerUserId: row.owner_user_id,
      record: toShareRecord(row),
      bioData: row.payload,
    };
  }

  async touchLastAccessed(shareId: string) {
    const result = await this.pool.query<PersistedShareRow>(
      `UPDATE share_links
       SET last_accessed_at = NOW()
       WHERE id = $1::uuid
       RETURNING id, token, recipient, permissions, expiry_date::text, created_at::text, last_accessed_at::text, status`,
      [shareId]
    );
    return result.rows[0] ? toShareRecord(result.rows[0]) : null;
  }

  async resetForTests() {
    await this.pool.query("DELETE FROM share_links");
    await this.pool.query("DELETE FROM biodata_profiles");
  }
}
