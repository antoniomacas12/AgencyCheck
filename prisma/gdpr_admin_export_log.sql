-- GDPR Phase 20: Admin export audit log
-- Records every bulk candidate data export for Art. 5(2) accountability

CREATE TABLE IF NOT EXISTS admin_export_logs (
  id          text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "exportType" text NOT NULL DEFAULT 'leads',
  filters      text NOT NULL DEFAULT '{}',
  "rowCount"   integer NOT NULL,
  "actorId"    text NOT NULL DEFAULT 'admin',
  "ipAddress"  text
);
