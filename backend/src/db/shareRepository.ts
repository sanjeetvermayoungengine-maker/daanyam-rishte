import crypto from "node:crypto";
import type { Pool } from "pg";
import type {
  BioDataSnapshot,
  ShareAccessEvent,
  ShareEventType,
  SharePermissions,
  ShareRecord,
  ShareSource,
  ShareType,
  StoredShare,
} from "../types/share.js";

type ShareStatus = ShareRecord["status"];

type PersistedShareRow = {
  id: string;
  token: string;
  recipient: string;
  share_type: ShareType;
  label: string | null;
  source: ShareSource;
  permissions: SharePermissions;
  expiry_date: string;
  created_at: string;
  last_accessed_at: string | null;
  status: ShareStatus;
  open_count?: string;
  first_opened_at?: string | null;
  last_opened_at?: string | null;
};

export interface ShareRepository {
  create(input: {
    ownerUserId: string;
    id: string;
    token: string;
    recipient: string;
    shareType: ShareType;
    label: string | null;
    source: ShareSource;
    permissions: SharePermissions;
    expiryDate: string;
    bioData: BioDataSnapshot;
  }): Promise<ShareRecord>;
  list(ownerUserId: string): Promise<ShareRecord[]>;
  updatePermissions(shareId: string, ownerUserId: string, permissions: SharePermissions): Promise<ShareRecord | null>;
  revoke(shareId: string, ownerUserId: string): Promise<ShareRecord | null>;
  getByToken(token: string): Promise<StoredShare | null>;
  touchLastAccessed(shareId: string): Promise<ShareRecord | null>;
  createEvent(input: {
    id: string;
    shareId: string;
    eventType: ShareEventType;
    userAgent: string | null;
    referrer: string | null;
    ipHash: string | null;
  }): Promise<ShareAccessEvent>;
  listEventsByShareIds(shareIds: string[]): Promise<ShareAccessEvent[]>;
  resetForTests(): Promise<void>;
}

function toShareRecord(row: PersistedShareRow): ShareRecord {
  return {
    id: row.id,
    token: row.token,
    recipient: row.recipient,
    shareType: row.share_type,
    label: row.label,
    source: row.source,
    permissions: row.permissions,
    expiryDate: row.expiry_date,
    createdAt: row.created_at,
    lastAccessed: row.last_accessed_at,
    openCount: Number(row.open_count ?? 0),
    firstOpenedAt: row.first_opened_at ?? null,
    lastOpenedAt: row.last_opened_at ?? null,
    status: row.status,
  };
}

function toShareAccessEvent(row: {
  id: string;
  share_id: string;
  event_type: ShareEventType;
  occurred_at: string;
  user_agent: string | null;
  referrer: string | null;
  ip_hash: string | null;
}): ShareAccessEvent {
  return {
    id: row.id,
    shareId: row.share_id,
    eventType: row.event_type,
    occurredAt: row.occurred_at,
    userAgent: row.user_agent,
    referrer: row.referrer,
    ipHash: row.ip_hash,
  };
}

export class InMemoryShareRepository implements ShareRepository {
  private readonly sharesById = new Map<string, StoredShare>();
  private readonly shareIdByToken = new Map<string, string>();
  private readonly eventsByShareId = new Map<string, ShareAccessEvent[]>();

  async create(input: {
    ownerUserId: string;
    id: string;
    token: string;
    recipient: string;
    shareType: ShareType;
    label: string | null;
    source: ShareSource;
    permissions: SharePermissions;
    expiryDate: string;
    bioData: BioDataSnapshot;
  }) {
    const record: ShareRecord = {
      id: input.id,
      token: input.token,
      recipient: input.recipient,
      shareType: input.shareType,
      label: input.label,
      source: input.source,
      permissions: input.permissions,
      expiryDate: input.expiryDate,
      createdAt: new Date().toISOString(),
      lastAccessed: null,
      openCount: 0,
      firstOpenedAt: null,
      lastOpenedAt: null,
      status: "active",
    };

    this.sharesById.set(record.id, { ownerUserId: input.ownerUserId, record, bioData: input.bioData });
    this.shareIdByToken.set(record.token, record.id);
    return record;
  }

  async list(ownerUserId: string) {
    const shares = Array.from(this.sharesById.values())
      .filter((entry) => entry.ownerUserId === ownerUserId)
      .map((entry) => entry.record)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return shares.map((share) => {
      const openEvents = (this.eventsByShareId.get(share.id) ?? [])
        .filter((event) => event.eventType === "share_opened")
        .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
      return {
        ...share,
        openCount: openEvents.length,
        firstOpenedAt: openEvents[0]?.occurredAt ?? null,
        lastOpenedAt: openEvents[openEvents.length - 1]?.occurredAt ?? null,
      };
    });
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

  async createEvent(input: {
    id: string;
    shareId: string;
    eventType: ShareEventType;
    userAgent: string | null;
    referrer: string | null;
    ipHash: string | null;
  }) {
    const event: ShareAccessEvent = {
      id: input.id,
      shareId: input.shareId,
      eventType: input.eventType,
      occurredAt: new Date().toISOString(),
      userAgent: input.userAgent,
      referrer: input.referrer,
      ipHash: input.ipHash,
    };
    const events = this.eventsByShareId.get(input.shareId) ?? [];
    events.push(event);
    this.eventsByShareId.set(input.shareId, events);
    return event;
  }

  async listEventsByShareIds(shareIds: string[]) {
    return shareIds.flatMap((shareId) => this.eventsByShareId.get(shareId) ?? []);
  }

  async resetForTests() {
    this.sharesById.clear();
    this.shareIdByToken.clear();
    this.eventsByShareId.clear();
  }
}

export class PostgresShareRepository implements ShareRepository {
  constructor(private readonly pool: Pool) {}

  async create(input: {
    ownerUserId: string;
    id: string;
    token: string;
    recipient: string;
    shareType: ShareType;
    label: string | null;
    source: ShareSource;
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
        `INSERT INTO share_links (
           id, owner_user_id, profile_id, token, recipient, share_type, label, source, permissions, expiry_date, status
         )
         VALUES ($1::uuid, $2, $3::uuid, $4, $5, $6, $7, $8, $9::jsonb, $10::date, 'active')
         RETURNING
           id, token, recipient, share_type, label, source, permissions, expiry_date::text, created_at::text, last_accessed_at::text, status`,
        [
          input.id,
          input.ownerUserId,
          profileId,
          input.token,
          input.recipient,
          input.shareType,
          input.label,
          input.source,
          JSON.stringify(input.permissions),
          input.expiryDate,
        ]
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
      `SELECT
         sl.id, sl.token, sl.recipient,
         COALESCE(sl.share_type, 'prospect') AS share_type,
         sl.label,
         COALESCE(sl.source, 'direct_flow') AS source,
         sl.permissions, sl.expiry_date::text, sl.created_at::text, sl.last_accessed_at::text, sl.status,
         COUNT(*) FILTER (WHERE sae.event_type = 'share_opened')::text AS open_count,
         (MIN(sae.occurred_at) FILTER (WHERE sae.event_type = 'share_opened'))::text AS first_opened_at,
         (MAX(sae.occurred_at) FILTER (WHERE sae.event_type = 'share_opened'))::text AS last_opened_at
       FROM share_links sl
       LEFT JOIN share_access_events sae ON sae.share_id = sl.id
       WHERE sl.owner_user_id = $1
       GROUP BY sl.id
       ORDER BY sl.created_at DESC`
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
       RETURNING
         id, token, recipient,
         COALESCE(share_type, 'prospect') AS share_type,
         label,
         COALESCE(source, 'direct_flow') AS source,
         permissions, expiry_date::text, created_at::text, last_accessed_at::text, status,
         '0' AS open_count, NULL::text AS first_opened_at, NULL::text AS last_opened_at`,
      [shareId, JSON.stringify(permissions), ownerUserId]
    );
    return result.rows[0] ? toShareRecord(result.rows[0]) : null;
  }

  async revoke(shareId: string, ownerUserId: string) {
    const result = await this.pool.query<PersistedShareRow>(
      `UPDATE share_links
       SET status = 'revoked'
       WHERE id = $1::uuid AND owner_user_id = $2
       RETURNING
         id, token, recipient,
         COALESCE(share_type, 'prospect') AS share_type,
         label,
         COALESCE(source, 'direct_flow') AS source,
         permissions, expiry_date::text, created_at::text, last_accessed_at::text, status,
         '0' AS open_count, NULL::text AS first_opened_at, NULL::text AS last_opened_at`,
      [shareId, ownerUserId]
    );
    return result.rows[0] ? toShareRecord(result.rows[0]) : null;
  }

  async getByToken(token: string) {
    const result = await this.pool.query<
      PersistedShareRow & { payload: BioDataSnapshot; owner_user_id: string }
    >(
      `SELECT
         s.id, s.token, s.recipient,
         COALESCE(s.share_type, 'prospect') AS share_type,
         s.label,
         COALESCE(s.source, 'direct_flow') AS source,
         s.permissions, s.expiry_date::text, s.created_at::text, s.last_accessed_at::text, s.status, s.owner_user_id,
         '0' AS open_count, NULL::text AS first_opened_at, NULL::text AS last_opened_at,
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
       RETURNING
         id, token, recipient,
         COALESCE(share_type, 'prospect') AS share_type,
         label,
         COALESCE(source, 'direct_flow') AS source,
         permissions, expiry_date::text, created_at::text, last_accessed_at::text, status,
         '0' AS open_count, NULL::text AS first_opened_at, NULL::text AS last_opened_at`,
      [shareId]
    );
    return result.rows[0] ? toShareRecord(result.rows[0]) : null;
  }

  async createEvent(input: {
    id: string;
    shareId: string;
    eventType: ShareEventType;
    userAgent: string | null;
    referrer: string | null;
    ipHash: string | null;
  }) {
    const result = await this.pool.query<{
      id: string;
      share_id: string;
      event_type: ShareEventType;
      occurred_at: string;
      user_agent: string | null;
      referrer: string | null;
      ip_hash: string | null;
    }>(
      `INSERT INTO share_access_events (id, share_id, event_type, user_agent, referrer, ip_hash)
       VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6)
       RETURNING id, share_id, event_type, occurred_at::text, user_agent, referrer, ip_hash`,
      [input.id, input.shareId, input.eventType, input.userAgent, input.referrer, input.ipHash]
    );
    return toShareAccessEvent(result.rows[0]);
  }

  async listEventsByShareIds(shareIds: string[]) {
    if (!shareIds.length) {
      return [];
    }
    const result = await this.pool.query<{
      id: string;
      share_id: string;
      event_type: ShareEventType;
      occurred_at: string;
      user_agent: string | null;
      referrer: string | null;
      ip_hash: string | null;
    }>(
      `SELECT id, share_id, event_type, occurred_at::text, user_agent, referrer, ip_hash
       FROM share_access_events
       WHERE share_id = ANY($1::uuid[])
       ORDER BY occurred_at ASC`,
      [shareIds]
    );
    return result.rows.map(toShareAccessEvent);
  }

  async resetForTests() {
    await this.pool.query("DELETE FROM share_access_events");
    await this.pool.query("DELETE FROM share_links");
    await this.pool.query("DELETE FROM biodata_profiles");
  }
}
