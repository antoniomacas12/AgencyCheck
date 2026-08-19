-- ─────────────────────────────────────────────────────────────────────────────
-- GDPR Phase 18-19 Migration — Accountability Fields + Sharing Audit Trail
-- AgencyCheck — August 2026
-- ─────────────────────────────────────────────────────────────────────────────
--
-- SAFE TO RUN: All statements are additive.
--   - ADD COLUMN IF NOT EXISTS  → no effect if column already exists
--   - CREATE TABLE IF NOT EXISTS → no effect if table already exists
--   - CREATE INDEX IF NOT EXISTS → no effect if index already exists
--
-- HOW TO RUN:
--   Option A (Supabase):
--     1. Go to Supabase dashboard → SQL editor
--     2. Paste this file and click Run
--   Option B (direct connection):
--     psql $DIRECT_URL -f prisma/gdpr_phase18_accountability.sql
--
-- DO NOT run prisma db push against production — use this file instead.
-- ─────────────────────────────────────────────────────────────────────────────


-- ── Phase 18: GDPR accountability columns on leads table ──────────────────────
-- All nullable with sensible defaults. Existing rows are not modified.

ALTER TABLE leads ADD COLUMN IF NOT EXISTS "gdprLawfulBasis"         TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS "gdprConsentAt"            TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS "gdprRestricted"           BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS "gdprRestrictedAt"         TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS "gdprRestrictedReason"     TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS "gdprErasureRequestedAt"   TIMESTAMPTZ;


-- ── Phase 19: Lead sharing events — GDPR Art. 5(2) audit trail ───────────────
-- New table; no existing data affected.

CREATE TABLE IF NOT EXISTS lead_sharing_events (
  id              TEXT        NOT NULL PRIMARY KEY,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "leadId"        TEXT        NOT NULL,
  "partnerName"   TEXT        NOT NULL,
  "partnerEmail"  TEXT,
  "partnerSlug"   TEXT,
  "lawfulBasis"   TEXT        NOT NULL,
  "purposeNote"   TEXT,
  "sharedByAdmin" TEXT        NOT NULL DEFAULT 'admin',
  "dataFields"    TEXT        NOT NULL DEFAULT '[]',
  "leadSendId"    TEXT
);

CREATE INDEX IF NOT EXISTS lse_lead_id_idx      ON lead_sharing_events ("leadId");
CREATE INDEX IF NOT EXISTS lse_created_at_idx   ON lead_sharing_events ("createdAt");

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification queries — run these after the migration to confirm success:
-- ─────────────────────────────────────────────────────────────────────────────
--
-- SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'leads'
--   AND column_name LIKE 'gdpr%'
--   ORDER BY column_name;
-- Expected: gdprConsentAt, gdprErasureRequestedAt, gdprLawfulBasis,
--           gdprRestricted, gdprRestrictedAt, gdprRestrictedReason
--
-- SELECT COUNT(*) FROM lead_sharing_events;
-- Expected: 0 (empty on first run)
-- ─────────────────────────────────────────────────────────────────────────────
