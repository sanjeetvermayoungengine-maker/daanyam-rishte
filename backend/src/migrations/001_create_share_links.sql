CREATE TABLE IF NOT EXISTS biodata_profiles (
  id UUID PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS share_links (
  id UUID PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  profile_id UUID NOT NULL REFERENCES biodata_profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  recipient TEXT NOT NULL,
  permissions JSONB NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked')),
  last_accessed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_share_links_token ON share_links(token);
CREATE INDEX IF NOT EXISTS idx_share_links_profile_id ON share_links(profile_id);
