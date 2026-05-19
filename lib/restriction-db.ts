/**
 * lib/restriction-db.ts
 *
 * Candidate Reliability Restriction — private admin-only system.
 * Blocks specific phone numbers from completing WhatsApp apply.
 * NEVER exposed publicly or to candidates.
 */

import { prisma } from "@/lib/prisma";

// ─── Setup guard ──────────────────────────────────────────────────────────────
let restrictionDbReady = false;

export async function ensureRestrictionReady(): Promise<void> {
  if (restrictionDbReady) return;

  // candidate_restrictions — the actual restriction records
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS candidate_restrictions (
      "id"               TEXT        PRIMARY KEY,
      "phoneNormalized"  TEXT        NOT NULL,
      "phoneRaw"         TEXT        NOT NULL,
      "reasonCategory"   TEXT        NOT NULL,
      "severity"         TEXT        NOT NULL DEFAULT 'medium',
      "internalNote"     TEXT,
      "recruiterName"    TEXT,
      "dateReported"     DATE,
      "active"           BOOLEAN     NOT NULL DEFAULT true,
      "createdByAdmin"   TEXT,
      "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS cr_phone_idx    ON candidate_restrictions ("phoneNormalized")
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS cr_active_idx   ON candidate_restrictions ("active")
  `;

  // restriction_blocked_attempts — every blocked apply attempt
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS restriction_blocked_attempts (
      "id"                TEXT        PRIMARY KEY,
      "restrictionId"     TEXT        NOT NULL,
      "phoneNormalized"   TEXT        NOT NULL,
      "attemptedJobId"    TEXT,
      "attemptedJobTitle" TEXT,
      "source"            TEXT        NOT NULL DEFAULT 'AgencyCheck',
      "ipAddress"         TEXT,
      "userAgent"         TEXT,
      "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS rba_restriction_idx ON restriction_blocked_attempts ("restrictionId")
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS rba_created_at_idx  ON restriction_blocked_attempts ("createdAt")
  `;

  restrictionDbReady = true;
  console.log("[restriction-db] tables ready");
}

// ─── Phone normalisation ──────────────────────────────────────────────────────

/**
 * Strips all non-digits and removes a leading '00' international prefix.
 * e.g. "+31 6 12 34 56 78" → "31612345678"
 *      "0031612345678"      → "31612345678"
 *      "0612345678"         → "0612345678"  (local format, kept as-is)
 */
export function normalizePhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  return d.slice(0, 15); // max 15 digits (E.164 limit)
}

/**
 * Returns true if two normalised phones refer to the same number.
 * Uses last-9-digit suffix match to handle local (06…) vs international (316…) formats.
 */
export function phonesMatch(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const MIN = 9;
  if (a.length >= MIN && b.length >= MIN) {
    return a.slice(-MIN) === b.slice(-MIN);
  }
  return false;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReasonCategory =
  | "no_show_interview"
  | "no_show_first_day"
  | "false_cv"
  | "invalid_documents"
  | "unresponsive_after_offer"
  | "agency_hopping"
  | "other";

export type RestrictionSeverity = "low" | "medium" | "high";

export const REASON_LABELS: Record<ReasonCategory, string> = {
  no_show_interview:        "No-show interview",
  no_show_first_day:        "No-show first work day",
  false_cv:                 "False CV information",
  invalid_documents:        "Invalid documents",
  unresponsive_after_offer: "Unresponsive after offer",
  agency_hopping:           "Agency hopping / reliability concern",
  other:                    "Other",
};

export interface CandidateRestriction {
  id:               string;
  phoneNormalized:  string;
  phoneRaw:         string;
  reasonCategory:   ReasonCategory;
  severity:         RestrictionSeverity;
  internalNote:     string | null;
  recruiterName:    string | null;
  dateReported:     string | null;   // YYYY-MM-DD
  active:           boolean;
  createdByAdmin:   string | null;
  createdAt:        string;
}

export interface BlockedAttempt {
  id:                string;
  restrictionId:     string;
  phoneNormalized:   string;
  attemptedJobId:    string | null;
  attemptedJobTitle: string | null;
  source:            string;
  ipAddress:         string | null;
  userAgent:         string | null;
  createdAt:         string;
}

// ─── Write ────────────────────────────────────────────────────────────────────

export interface AddRestrictionInput {
  phoneRaw:       string;
  reasonCategory: ReasonCategory;
  severity:       RestrictionSeverity;
  internalNote?:  string;
  recruiterName?: string;
  dateReported?:  string;
  createdByAdmin?: string;
}

export async function addRestriction(input: AddRestrictionInput): Promise<string> {
  await ensureRestrictionReady();
  const id              = crypto.randomUUID();
  const phoneNormalized = normalizePhone(input.phoneRaw);

  await prisma.$executeRaw`
    INSERT INTO candidate_restrictions
      ("id", "phoneNormalized", "phoneRaw", "reasonCategory", "severity",
       "internalNote", "recruiterName", "dateReported", "active", "createdByAdmin")
    VALUES
      (${id}, ${phoneNormalized}, ${input.phoneRaw.trim()}, ${input.reasonCategory},
       ${input.severity}, ${input.internalNote ?? null}, ${input.recruiterName ?? null},
       ${input.dateReported ?? null}, true, ${input.createdByAdmin ?? "admin"})
  `;

  console.log(`[restriction-db] restriction added id=${id} phone=***${phoneNormalized.slice(-4)}`);
  return id;
}

export async function setRestrictionActive(id: string, active: boolean): Promise<void> {
  await ensureRestrictionReady();
  await prisma.$executeRaw`
    UPDATE candidate_restrictions SET "active" = ${active} WHERE "id" = ${id}
  `;
}

export async function deleteRestriction(id: string): Promise<void> {
  await ensureRestrictionReady();
  await prisma.$executeRaw`
    DELETE FROM restriction_blocked_attempts WHERE "restrictionId" = ${id}
  `;
  await prisma.$executeRaw`
    DELETE FROM candidate_restrictions WHERE "id" = ${id}
  `;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Returns the active restriction for a phone number, or null.
 * Checks all active restrictions using suffix matching.
 */
export async function checkRestriction(
  phoneRaw: string,
): Promise<CandidateRestriction | null> {
  await ensureRestrictionReady();

  const normalized = normalizePhone(phoneRaw);
  if (normalized.length < 7) return null; // too short to be a valid phone

  // Fetch all active restrictions — table will remain small (<1k rows)
  const rows = await prisma.$queryRaw<CandidateRestriction[]>`
    SELECT
      "id", "phoneNormalized", "phoneRaw", "reasonCategory", "severity",
      "internalNote", "recruiterName",
      TO_CHAR("dateReported", 'YYYY-MM-DD') AS "dateReported",
      "active", "createdByAdmin", "createdAt"::text AS "createdAt"
    FROM candidate_restrictions
    WHERE "active" = true
  `;

  for (const r of rows) {
    if (phonesMatch(normalized, r.phoneNormalized)) return r;
  }
  return null;
}

export interface LogBlockedAttemptInput {
  restrictionId:     string;
  phoneNormalized:   string;
  attemptedJobId?:   string;
  attemptedJobTitle?: string;
  ipAddress?:        string;
  userAgent?:        string;
}

export async function logBlockedAttempt(input: LogBlockedAttemptInput): Promise<string> {
  await ensureRestrictionReady();
  const id = crypto.randomUUID();

  await prisma.$executeRaw`
    INSERT INTO restriction_blocked_attempts
      ("id", "restrictionId", "phoneNormalized", "attemptedJobId",
       "attemptedJobTitle", "source", "ipAddress", "userAgent")
    VALUES
      (${id}, ${input.restrictionId}, ${input.phoneNormalized},
       ${input.attemptedJobId ?? null}, ${input.attemptedJobTitle ?? null},
       'AgencyCheck', ${input.ipAddress ?? null}, ${input.userAgent ?? null})
  `;

  console.log(
    `[restriction-db] blocked attempt logged id=${id} ` +
    `restriction=${input.restrictionId} phone=***${input.phoneNormalized.slice(-4)}`,
  );
  return id;
}

export async function getAllRestrictions(): Promise<CandidateRestriction[]> {
  await ensureRestrictionReady();
  return prisma.$queryRaw<CandidateRestriction[]>`
    SELECT
      "id", "phoneNormalized", "phoneRaw", "reasonCategory", "severity",
      "internalNote", "recruiterName",
      TO_CHAR("dateReported", 'YYYY-MM-DD') AS "dateReported",
      "active", "createdByAdmin", "createdAt"::text AS "createdAt"
    FROM candidate_restrictions
    ORDER BY "createdAt" DESC
  `;
}

export async function getBlockedAttempts(restrictionId?: string): Promise<BlockedAttempt[]> {
  await ensureRestrictionReady();

  if (restrictionId) {
    return prisma.$queryRaw<BlockedAttempt[]>`
      SELECT
        "id", "restrictionId", "phoneNormalized", "attemptedJobId",
        "attemptedJobTitle", "source", "ipAddress", "userAgent",
        "createdAt"::text AS "createdAt"
      FROM restriction_blocked_attempts
      WHERE "restrictionId" = ${restrictionId}
      ORDER BY "createdAt" DESC
    `;
  }

  return prisma.$queryRaw<BlockedAttempt[]>`
    SELECT
      "id", "restrictionId", "phoneNormalized", "attemptedJobId",
      "attemptedJobTitle", "source", "ipAddress", "userAgent",
      "createdAt"::text AS "createdAt"
    FROM restriction_blocked_attempts
    ORDER BY "createdAt" DESC
    LIMIT 200
  `;
}
