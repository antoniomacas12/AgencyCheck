-- Migration: add lead qualification columns
-- Run this in Supabase SQL editor (https://supabase.com/dashboard → SQL Editor)
-- OR run: npx prisma db push  (from your local machine with .env)

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS availability    TEXT,
  ADD COLUMN IF NOT EXISTS "locationStatus" TEXT,
  ADD COLUMN IF NOT EXISTS "leadScore"     INTEGER;

-- Verify columns were added:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name IN ('availability', 'locationStatus', 'leadScore');
