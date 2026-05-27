-- ─────────────────────────────────────────────────────────────────────────────
-- AgencyCheck — Supabase explicit GRANT migration
-- ─────────────────────────────────────────────────────────────────────────────
--
-- WHY THIS FILE EXISTS
-- Supabase announced that starting October 2026 the platform will NO LONGER
-- auto-grant public schema access to the `anon` and `authenticated` roles.
-- Tables created after that date will be inaccessible via PostgREST / supabase-js
-- unless explicit GRANTs are present.
--
-- AgencyCheck currently uses Prisma with a direct PostgreSQL connection (the
-- `postgres` superuser role), so the app itself is NOT affected today.
-- However, this migration future-proofs:
--   1. Any future use of supabase-js or the Supabase REST API
--   2. PostgREST introspection (used by Supabase Studio table view)
--   3. Any new tables added via `prisma db push`
--
-- SAFETY
-- • All statements are GRANT (additive) — nothing is revoked.
-- • Existing RLS policies are NOT modified.
-- • The `postgres` / `service_role` access is unchanged.
-- • This file is fully idempotent — safe to run multiple times.
--
-- HOW TO RUN
-- Supabase Dashboard → SQL Editor → New query → paste → Run
-- ─────────────────────────────────────────────────────────────────────────────


-- ── 1. Schema-level USAGE ────────────────────────────────────────────────────
-- Roles must have USAGE on the schema before they can touch any table in it.

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;


-- ── 2. Per-table grants ───────────────────────────────────────────────────────
--
-- Principle of least privilege:
--
--   anon          → anonymous website visitors (no login)
--   authenticated → future logged-in users (not used yet, but ready)
--   service_role  → backend / Supabase Edge Functions / admin scripts
--
-- The app enforces business logic (published-only reviews, etc.) at the
-- application layer via Prisma queries. RLS is intentionally minimal because
-- ALL writes come from the server, never directly from the browser.
--
-- READ-ONLY public tables (no user can write directly — Prisma server only)
-- ── agencies ─────────────────────────────────────────────────────────────────
GRANT SELECT ON TABLE public.agencies              TO anon, authenticated, service_role;

-- ── job_listings ─────────────────────────────────────────────────────────────
GRANT SELECT ON TABLE public.job_listings          TO anon, authenticated, service_role;

-- ── reviews ──────────────────────────────────────────────────────────────────
-- anon can SELECT (app filters isPublished=true) and INSERT (submit new review)
GRANT SELECT, INSERT ON TABLE public.reviews       TO anon, authenticated, service_role;

-- ── review_comments ──────────────────────────────────────────────────────────
GRANT SELECT, INSERT ON TABLE public.review_comments TO anon, authenticated, service_role;

-- ── agency_scores ─────────────────────────────────────────────────────────────
GRANT SELECT ON TABLE public.agency_scores         TO anon, authenticated, service_role;

-- ── agency_city_mentions ──────────────────────────────────────────────────────
GRANT SELECT ON TABLE public.agency_city_mentions  TO anon, authenticated, service_role;

-- ── review_mentions ───────────────────────────────────────────────────────────
-- Internal join table — read-only for anon (no direct writes from browser)
GRANT SELECT ON TABLE public.review_mentions       TO anon, authenticated, service_role;

-- ── review_photos ─────────────────────────────────────────────────────────────
GRANT SELECT, INSERT ON TABLE public.review_photos TO anon, authenticated, service_role;

-- WRITE-ONLY public tables (anon can INSERT, never SELECT — privacy)
-- ── salary_reports ────────────────────────────────────────────────────────────
GRANT INSERT ON TABLE public.salary_reports        TO anon, authenticated;
GRANT ALL    ON TABLE public.salary_reports        TO service_role;

-- ── issue_reports ─────────────────────────────────────────────────────────────
GRANT INSERT ON TABLE public.issue_reports         TO anon, authenticated;
GRANT ALL    ON TABLE public.issue_reports         TO service_role;

-- ── worker_experiences ────────────────────────────────────────────────────────
GRANT INSERT ON TABLE public.worker_experiences    TO anon, authenticated;
GRANT ALL    ON TABLE public.worker_experiences    TO service_role;

-- ── pre_qualifications ────────────────────────────────────────────────────────
-- Analytics-only table — INSERT from server, never readable by anon
GRANT INSERT ON TABLE public.pre_qualifications    TO anon, authenticated;
GRANT ALL    ON TABLE public.pre_qualifications    TO service_role;

-- ── leads ─────────────────────────────────────────────────────────────────────
-- Lead data is private — anon can INSERT but NEVER SELECT
GRANT INSERT ON TABLE public.leads                 TO anon, authenticated;
GRANT ALL    ON TABLE public.leads                 TO service_role;

-- SERVICE_ROLE-ONLY tables (admin/internal — never touch via browser)
-- ── lead_sends ────────────────────────────────────────────────────────────────
GRANT ALL ON TABLE public.lead_sends               TO service_role;

-- ── admin_notifications ───────────────────────────────────────────────────────
GRANT ALL ON TABLE public.admin_notifications      TO service_role;

-- ── recruiter_config ──────────────────────────────────────────────────────────
-- Table exists in DB but not in Prisma schema — admin use only
GRANT ALL ON TABLE public.recruiter_config         TO service_role;


-- ── 3. Sequence grants (future-proofing) ─────────────────────────────────────
-- These tables use TEXT PKs with gen_random_uuid() so no sequences exist today.
-- If any table ever switches to SERIAL/BIGSERIAL, add:
--   GRANT USAGE, SELECT ON SEQUENCE public.<table>_id_seq TO anon, authenticated;


-- ── 4. Default privileges for FUTURE tables ──────────────────────────────────
-- This is the key future-proofing step.
-- Any table created in the public schema by the `postgres` role will
-- automatically inherit these grants — no manual GRANT needed after each
-- `prisma db push` or new migration.

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;


-- ── 5. Verification query ─────────────────────────────────────────────────────
-- Run after applying to confirm all tables have the expected grants.

SELECT
  t.table_name,
  string_agg(DISTINCT p.grantee || ':' || p.privilege_type, ', ' ORDER BY p.grantee || ':' || p.privilege_type) AS grants
FROM information_schema.tables t
LEFT JOIN information_schema.role_table_grants p
  ON p.table_name = t.table_name AND p.table_schema = 'public'
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name
ORDER BY t.table_name;
