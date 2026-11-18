ALTER TABLE programs ADD COLUMN IF NOT EXISTS activity_type TEXT;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS initiative TEXT NOT NULL DEFAULT 'levelup';
ALTER TABLE programs ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE activities ADD COLUMN IF NOT EXISTS activity_type TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS initiative TEXT NOT NULL DEFAULT 'levelup';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'programs_initiative_check') THEN
    ALTER TABLE programs ADD CONSTRAINT programs_initiative_check CHECK (initiative IN ('levelup', 'next'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'activities_initiative_check') THEN
    ALTER TABLE activities ADD CONSTRAINT activities_initiative_check CHECK (initiative IN ('levelup', 'next'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_programs_featured ON programs (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_activities_program ON activities (program_id);
CREATE INDEX IF NOT EXISTS idx_activities_initiative ON activities (initiative, activity_type);
