CREATE TABLE IF NOT EXISTS share_access_events (
  id UUID PRIMARY KEY,
  share_id UUID NOT NULL REFERENCES share_links(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('share_created', 'share_opened', 'share_revoked', 'permissions_updated')),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT NULL,
  referrer TEXT NULL,
  ip_hash TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_share_access_events_share_id ON share_access_events(share_id);
CREATE INDEX IF NOT EXISTS idx_share_access_events_event_type_occurred_at ON share_access_events(event_type, occurred_at DESC);
