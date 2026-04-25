ALTER TABLE biodata_profiles
ADD COLUMN IF NOT EXISTS owner_user_id TEXT;

ALTER TABLE share_links
ADD COLUMN IF NOT EXISTS owner_user_id TEXT;

UPDATE biodata_profiles
SET owner_user_id = COALESCE(owner_user_id, 'unknown-owner')
WHERE owner_user_id IS NULL;

UPDATE share_links
SET owner_user_id = COALESCE(owner_user_id, 'unknown-owner')
WHERE owner_user_id IS NULL;

ALTER TABLE biodata_profiles
ALTER COLUMN owner_user_id SET NOT NULL;

ALTER TABLE share_links
ALTER COLUMN owner_user_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_biodata_profiles_owner_user_id ON biodata_profiles(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_share_links_owner_user_id ON share_links(owner_user_id);
