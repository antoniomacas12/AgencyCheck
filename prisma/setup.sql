-- AgencyCheck — Supabase setup SQL
-- Generated from prisma/schema.prisma (v6 — payout tracking)
-- Run this in: https://supabase.com/dashboard/project/rgmwapidfanaujomoale/sql/new
-- This is idempotent (CREATE TABLE IF NOT EXISTS) — safe to re-run.

-- ─── agencies ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "agencies" (
  "id"                    TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name"                  TEXT NOT NULL,
  "slug"                  TEXT NOT NULL,
  "description"           TEXT,
  "website"               TEXT,
  "email"                 TEXT,
  "phone"                 TEXT,
  "logoUrl"               TEXT,
  "housing"               TEXT NOT NULL DEFAULT 'UNKNOWN',
  "housingType"           TEXT NOT NULL DEFAULT 'UNKNOWN',
  "transport"             TEXT NOT NULL DEFAULT 'UNKNOWN',
  "city"                  TEXT NOT NULL DEFAULT 'unknown',
  "cities"                TEXT NOT NULL DEFAULT '[]',
  "jobTypes"              TEXT,
  "salaryRange"           TEXT,
  "agencyType"            TEXT NOT NULL DEFAULT 'general-staffing',
  "jobFocus"              TEXT NOT NULL DEFAULT '[]',
  "transparencyScore"     INTEGER NOT NULL DEFAULT 0,
  "accommodation"         TEXT NOT NULL DEFAULT 'unknown',
  "supportedCities"       TEXT NOT NULL DEFAULT '[]',
  "canonicalId"           TEXT,
  "aliases"               TEXT NOT NULL DEFAULT '[]',
  "duplicateCount"        INTEGER NOT NULL DEFAULT 1,
  "confidenceScore"       INTEGER NOT NULL DEFAULT 100,
  "sourceUrl"             TEXT,
  "sourceType"            TEXT NOT NULL DEFAULT 'UNKNOWN',
  "lastCheckedAt"         TIMESTAMPTZ,
  "housingVerification"   TEXT,
  "transportVerification" TEXT,
  "webPages"              TEXT,
  "createdAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "agencies_slug_key" ON "agencies"("slug");

-- ─── job_listings ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "job_listings" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "slug"        TEXT NOT NULL,
  "title"       TEXT NOT NULL,
  "jobType"     TEXT NOT NULL,
  "description" TEXT,
  "city"        TEXT NOT NULL,
  "agencyId"    TEXT NOT NULL,
  "salaryMin"   DOUBLE PRECISION NOT NULL,
  "salaryMax"   DOUBLE PRECISION NOT NULL,
  "housing"     TEXT NOT NULL DEFAULT 'UNKNOWN',
  "transport"   TEXT NOT NULL DEFAULT 'UNKNOWN',
  "sourceUrl"   TEXT,
  "isActive"    BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "job_listings_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "job_listings_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "job_listings_slug_key" ON "job_listings"("slug");
CREATE INDEX IF NOT EXISTS "job_listings_agencyId_idx" ON "job_listings"("agencyId");
CREATE INDEX IF NOT EXISTS "job_listings_city_idx" ON "job_listings"("city");
CREATE INDEX IF NOT EXISTS "job_listings_jobType_idx" ON "job_listings"("jobType");
CREATE INDEX IF NOT EXISTS "job_listings_isActive_idx" ON "job_listings"("isActive");

-- ─── reviews ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "reviews" (
  "id"                    TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "agencyId"              TEXT NOT NULL,
  "status"                TEXT NOT NULL DEFAULT 'PENDING',
  "isPublished"           BOOLEAN NOT NULL DEFAULT FALSE,
  "internalNotes"         TEXT,
  "moderatedAt"           TIMESTAMPTZ,
  "moderatedBy"           TEXT,
  "reviewType"            TEXT NOT NULL DEFAULT 'ANONYMOUS',
  "workerStatus"          TEXT NOT NULL DEFAULT 'UNKNOWN',
  "experiencePeriod"      TEXT,
  "jobType"               TEXT,
  "jobTitle"              TEXT,
  "city"                  TEXT,
  "title"                 TEXT,
  "overallRating"         INTEGER NOT NULL DEFAULT 3,
  "salaryRating"          INTEGER NOT NULL DEFAULT 3,
  "housingRating"         INTEGER,
  "managementRating"      INTEGER NOT NULL DEFAULT 3,
  "contractClarityRating" INTEGER NOT NULL DEFAULT 3,
  "transportRating"       INTEGER,
  "salaryAccuracyRating"  INTEGER,
  "accommodationProvided" TEXT NOT NULL DEFAULT 'UNKNOWN',
  "roomType"              TEXT NOT NULL DEFAULT 'UNKNOWN',
  "weeklyRent"            DOUBLE PRECISION,
  "peopleInHouse"         INTEGER,
  "wouldRecommend"        TEXT NOT NULL DEFAULT 'UNSURE',
  "comment"               TEXT,
  "issueTags"             TEXT NOT NULL DEFAULT '[]',
  "verificationStatus"    TEXT NOT NULL DEFAULT 'UNKNOWN',
  "sourceType"            TEXT NOT NULL DEFAULT 'WORKER_REPORTED',
  "createdAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "reviews_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "reviews_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "reviews_agencyId_idx" ON "reviews"("agencyId");
CREATE INDEX IF NOT EXISTS "reviews_status_idx" ON "reviews"("status");
CREATE INDEX IF NOT EXISTS "reviews_isPublished_idx" ON "reviews"("isPublished");
CREATE INDEX IF NOT EXISTS "reviews_overallRating_idx" ON "reviews"("overallRating");

-- ─── review_photos ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "review_photos" (
  "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "reviewId"   TEXT NOT NULL,
  "fileUrl"    TEXT NOT NULL,
  "fileName"   TEXT NOT NULL,
  "fileType"   TEXT NOT NULL,
  "fileSize"   INTEGER NOT NULL,
  "caption"    TEXT,
  "sortOrder"  INTEGER NOT NULL DEFAULT 0,
  "uploadedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "review_photos_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "review_photos_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "review_photos_reviewId_idx" ON "review_photos"("reviewId");

-- ─── salary_reports ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "salary_reports" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "agencyId"  TEXT NOT NULL,
  "jobTitle"  TEXT NOT NULL,
  "city"      TEXT NOT NULL,
  "hourlyPay" DOUBLE PRECISION NOT NULL,
  "housing"   TEXT NOT NULL DEFAULT 'UNKNOWN',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "salary_reports_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "salary_reports_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE
);

-- ─── issue_reports ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "issue_reports" (
  "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "agencyId"      TEXT NOT NULL,
  "issueType"     TEXT NOT NULL,
  "description"   TEXT NOT NULL,
  "amountMissing" DOUBLE PRECISION,
  "status"        TEXT NOT NULL DEFAULT 'OPEN',
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "issue_reports_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "issue_reports_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE
);

-- ─── agency_scores ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "agency_scores" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "agencyId"  TEXT NOT NULL,
  "score"     INTEGER NOT NULL DEFAULT 100,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "agency_scores_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "agency_scores_agencyId_key" UNIQUE ("agencyId"),
  CONSTRAINT "agency_scores_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE
);

-- ─── leads ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "leads" (
  "id"                 TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "createdAt"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "sourcePage"         TEXT NOT NULL,
  "sourceType"         TEXT NOT NULL DEFAULT 'general_apply',
  "sourceSlug"         TEXT,
  "sourceLabel"        TEXT,
  "fullName"           TEXT NOT NULL,
  "phone"              TEXT NOT NULL,
  "email"              TEXT,
  "whatsappSame"       BOOLEAN NOT NULL DEFAULT FALSE,
  "nationality"        TEXT,
  "currentCountry"     TEXT,
  "alreadyInNL"        BOOLEAN,
  "preferredWorkType"  TEXT,
  "preferredRegion"    TEXT,
  "accommodationNeeded" BOOLEAN,
  "driversLicense"     BOOLEAN,
  "canWorkWeekends"    BOOLEAN,
  "experienceLevel"    TEXT,
  "availableFrom"      TIMESTAMPTZ,
  "notes"              TEXT,
  "status"             TEXT NOT NULL DEFAULT 'new',
  "tags"               TEXT NOT NULL DEFAULT '[]',
  "assignedTo"         TEXT,
  "lastContactedAt"    TIMESTAMPTZ,
  "internalNotes"      TEXT,
  "assignedAgencies"   TEXT NOT NULL DEFAULT '[]',
  "sentAt"             TIMESTAMPTZ,
  -- Schema v6: payout tracking
  "confirmedAt"        TIMESTAMPTZ,
  "workerStartDate"    TIMESTAMPTZ,
  "payoutAmount"       DOUBLE PRECISION,
  "paidAt"             TIMESTAMPTZ,
  CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "leads_status_idx" ON "leads"("status");
CREATE INDEX IF NOT EXISTS "leads_createdAt_idx" ON "leads"("createdAt");
CREATE INDEX IF NOT EXISTS "leads_sourceType_idx" ON "leads"("sourceType");
CREATE INDEX IF NOT EXISTS "leads_accommodationNeeded_idx" ON "leads"("accommodationNeeded");

-- ─── worker_experiences ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "worker_experiences" (
  "id"             TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "agencyName"     TEXT NOT NULL,
  "city"           TEXT NOT NULL,
  "jobType"        TEXT NOT NULL,
  "agreedGross"    TEXT,
  "actualKeep"     TEXT,
  "hasHousing"     BOOLEAN NOT NULL DEFAULT FALSE,
  "housingRating"  INTEGER,
  "salaryAccurate" BOOLEAN NOT NULL DEFAULT FALSE,
  "wouldRecommend" BOOLEAN NOT NULL DEFAULT FALSE,
  "comment"        TEXT,
  "submittedAt"    TEXT,
  CONSTRAINT "worker_experiences_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "worker_experiences_agencyName_idx" ON "worker_experiences"("agencyName");
CREATE INDEX IF NOT EXISTS "worker_experiences_createdAt_idx" ON "worker_experiences"("createdAt");

-- ─── lead_sends ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "lead_sends" (
  "id"           TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "leadId"       TEXT NOT NULL,
  "agencySlug"   TEXT NOT NULL,
  "agencyName"   TEXT NOT NULL,
  "agencyEmail"  TEXT,
  "method"       TEXT NOT NULL DEFAULT 'email',
  "status"       TEXT NOT NULL DEFAULT 'sent',
  "errorMsg"     TEXT,
  "emailSubject" TEXT,
  "emailBody"    TEXT,
  CONSTRAINT "lead_sends_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "lead_sends_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "lead_sends_leadId_idx" ON "lead_sends"("leadId");

-- ─── Verify all tables were created ──────────────────────────────────────────

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'agencies', 'job_listings', 'reviews', 'review_photos',
    'salary_reports', 'issue_reports', 'agency_scores',
    'leads', 'worker_experiences', 'lead_sends'
  )
ORDER BY table_name;
