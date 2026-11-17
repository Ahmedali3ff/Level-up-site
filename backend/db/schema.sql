-- LevelUp & NEXT database schema (PostgreSQL). Safe to run more than once.

CREATE TABLE IF NOT EXISTS admin_users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE CHECK (email = lower(email)),
  password_hash TEXT,
  google_id     TEXT UNIQUE,
  role          TEXT NOT NULL DEFAULT 'content_manager' CHECK (role IN ('super_admin', 'admin', 'content_manager')),
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS programs (
  id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title                 TEXT NOT NULL,
  title_ar              TEXT,
  slug                  TEXT NOT NULL UNIQUE,
  short_description     TEXT,
  short_description_ar  TEXT,
  full_description      TEXT,
  full_description_ar   TEXT,
  objectives            TEXT,
  eligibility           TEXT,
  duration              TEXT,
  category              TEXT,
  cover_image           TEXT,
  target_audience       TEXT,
  start_date            DATE,
  end_date              DATE,
  registration_deadline TIMESTAMPTZ,
  registration_url      TEXT,
  status                TEXT NOT NULL DEFAULT 'coming_soon' CHECK (status IN ('coming_soon', 'open', 'ongoing', 'closed', 'completed', 'postponed')),
  is_published          BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title          TEXT NOT NULL,
  title_ar       TEXT,
  description    TEXT,
  description_ar TEXT,
  category       TEXT,
  image          TEXT,
  program_id     BIGINT REFERENCES programs (id) ON DELETE SET NULL,
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS announcements (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title            TEXT NOT NULL,
  title_ar         TEXT,
  content          TEXT,
  content_ar       TEXT,
  publication_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  cover_image      TEXT,
  program_id       BIGINT REFERENCES programs (id) ON DELETE SET NULL,
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS opportunities (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title          TEXT NOT NULL,
  title_ar       TEXT,
  description    TEXT,
  description_ar TEXT,
  category       TEXT,
  deadline       TIMESTAMPTZ,
  external_url   TEXT,
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'expired')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name    TEXT NOT NULL CHECK (char_length(full_name) <= 200),
  email        TEXT NOT NULL CHECK (char_length(email) <= 254),
  subject      TEXT NOT NULL CHECK (char_length(subject) <= 300),
  message      TEXT NOT NULL CHECK (char_length(message) <= 5000),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read      BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS partnership_inquiries (
  id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name            TEXT NOT NULL CHECK (char_length(full_name) <= 200),
  organization         TEXT NOT NULL CHECK (char_length(organization) <= 200),
  email                TEXT NOT NULL CHECK (char_length(email) <= 254),
  organization_type    TEXT NOT NULL,
  partnership_interest TEXT NOT NULL,
  message              TEXT NOT NULL CHECK (char_length(message) <= 5000),
  submitted_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  status               TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'accepted', 'declined', 'archived')),
  internal_notes       TEXT
);

CREATE TABLE IF NOT EXISTS statistics (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          TEXT NOT NULL,
  name_ar       TEXT,
  value         TEXT NOT NULL,
  description   TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_links (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  platform   TEXT NOT NULL,
  url        TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS website_content (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  section_name TEXT NOT NULL,
  content      TEXT NOT NULL,
  language     TEXT NOT NULL CHECK (language IN ('en', 'ar')),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (section_name, language)
);

CREATE INDEX IF NOT EXISTS idx_programs_status ON programs (status, is_published);
CREATE INDEX IF NOT EXISTS idx_announcements_status_date ON announcements (status, publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_unread ON contact_messages (is_read);
CREATE INDEX IF NOT EXISTS idx_partnership_inquiries_status ON partnership_inquiries (status);

-- Row Level Security: the API connects with a privileged role that bypasses RLS,
-- while any public/anon access (e.g. Supabase's auto-generated REST API) is denied by default.
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['admin_users', 'programs', 'activities', 'announcements', 'opportunities', 'contact_messages', 'partnership_inquiries', 'statistics', 'social_links', 'website_content']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;
