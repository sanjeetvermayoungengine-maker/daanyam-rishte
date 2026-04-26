ALTER TABLE share_links
  ADD COLUMN IF NOT EXISTS share_type TEXT;

ALTER TABLE share_links
  ADD COLUMN IF NOT EXISTS label TEXT;

ALTER TABLE share_links
  ADD COLUMN IF NOT EXISTS source TEXT;

UPDATE share_links
SET
  share_type = COALESCE(share_type, 'prospect'),
  source = COALESCE(source, 'direct_flow')
WHERE share_type IS NULL OR source IS NULL;

ALTER TABLE share_links
  ALTER COLUMN share_type SET DEFAULT 'prospect';

ALTER TABLE share_links
  ALTER COLUMN source SET DEFAULT 'direct_flow';

ALTER TABLE share_links
  ALTER COLUMN share_type SET NOT NULL;

ALTER TABLE share_links
  ALTER COLUMN source SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'share_links_share_type_check'
  ) THEN
    ALTER TABLE share_links
      ADD CONSTRAINT share_links_share_type_check
      CHECK (share_type IN ('family', 'prospect', 'broker', 'private', 'horoscope_only'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'share_links_source_check'
  ) THEN
    ALTER TABLE share_links
      ADD CONSTRAINT share_links_source_check
      CHECK (source IN ('preview_page', 'share_dashboard', 'direct_flow'));
  END IF;
END $$;
