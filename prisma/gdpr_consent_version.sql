-- GDPR Phase 19: Consent versioning fields on leads
-- Run after gdpr_phase18_accountability.sql
-- Safe: additive only, no data loss

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS "gdprConsentVersion"       text,
  ADD COLUMN IF NOT EXISTS "gdprPrivacyPolicyVersion" text;
