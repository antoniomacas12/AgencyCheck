-- GDPR Phase 21: Data minimisation — remove unnecessary PII from restriction_blocked_attempts
-- ipAddress and userAgent are not needed for the phone-based dedup purpose

ALTER TABLE restriction_blocked_attempts
  DROP COLUMN IF EXISTS "ipAddress",
  DROP COLUMN IF EXISTS "userAgent";
