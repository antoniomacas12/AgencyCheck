/**
 * lib/recruiter-db.ts
 *
 * Single source of truth for:
 *   - Creating recruiter_config + referral_clicks tables
 *   - Seeding recruiter records
 *   - All DB operations used by referral-redirect, referral-click, and admin/recruiters
 *
 * Every exported function calls ensureDbReady() first so callers never
 * need to worry about table existence.
 */

import { prisma }          from "@/lib/prisma";
import { RECRUITER_SEEDS } from "@/lib/recruiters";

// ─── Setup guard (one run per cold-start per serverless instance) ─────────────
let dbReady = false;

export async function ensureDbReady(): Promise<void> {
  if (dbReady) return;

  console.log("[recruiter-db] ensureDbReady: running setup…");

  // 1. referral_clicks
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS referral_clicks (
      "id"          TEXT        PRIMARY KEY,
      "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "recruiter"   TEXT        NOT NULL,
      "recruiterWa" TEXT        NOT NULL,
      "jobId"       TEXT,
      "jobTitle"    TEXT,
      "source"      TEXT        NOT NULL DEFAULT 'AgencyCheck'
    )
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS rc_created_at_idx ON referral_clicks ("createdAt")
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS rc_recruiter_idx  ON referral_clicks ("recruiter")
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS rc_job_id_idx     ON referral_clicks ("jobId")
  `;

  // 2. recruiter_config
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS recruiter_config (
      "id"        TEXT        PRIMARY KEY,
      "name"      TEXT        NOT NULL,
      "waUrl"     TEXT        NOT NULL,
      "enabled"   BOOLEAN     NOT NULL DEFAULT true,
      "sortOrder" INTEGER     NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // 3. Seed / upsert recruiters
  //
  // enabled logic:
  //   - New row            → use seed value (default true)
  //   - Existing row       → keep admin's toggle, UNLESS seed says enabled:false
  //                          (force-inactive for permanently retired recruiters)
  for (const r of RECRUITER_SEEDS) {
    const seedEnabled = r.enabled ?? true;
    await prisma.$executeRaw`
      INSERT INTO recruiter_config ("id", "name", "waUrl", "enabled", "sortOrder")
      VALUES (${r.id}, ${r.name}, ${r.waUrl}, ${seedEnabled}, ${r.sortOrder})
      ON CONFLICT ("id") DO UPDATE
        SET "name"      = EXCLUDED."name",
            "waUrl"     = EXCLUDED."waUrl",
            "sortOrder" = EXCLUDED."sortOrder",
            "enabled"   = CASE
                            WHEN EXCLUDED."enabled" = false THEN false
                            ELSE recruiter_config."enabled"
                          END
    `;
    console.log(`[recruiter-db] upserted recruiter id=${r.id} name="${r.name}" seedEnabled=${seedEnabled}`);
  }

  dbReady = true;
  console.log("[recruiter-db] ensureDbReady: done");
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RecruiterRow {
  id:           string;
  name:         string;
  waUrl:        string;
  enabled:      boolean;
  sortOrder:    number;
  createdAt:    Date;
  pausedAt:     Date | null;
  pausedReason: string | null;
}

export interface ClickRow {
  id:          string;
  createdAt:   Date;
  recruiter:   string;
  recruiterWa: string;
  jobId:       string | null;
  jobTitle:    string | null;
  source:      string;
}

// ─── Recruiter queries ────────────────────────────────────────────────────────

/** All recruiters ordered by sortOrder (enabled and disabled). */
export async function getAllRecruiters(): Promise<RecruiterRow[]> {
  await ensureDbReady();
  // Add pausedAt/pausedReason columns if they don't exist yet (safe migration)
  await prisma.$executeRawUnsafe(`
    ALTER TABLE recruiter_config
    ADD COLUMN IF NOT EXISTS "pausedAt"     TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS "pausedReason" TEXT
  `).catch(() => {/* ignore if already exists */});
  return prisma.$queryRaw<RecruiterRow[]>`
    SELECT "id", "name", "waUrl", "enabled", "sortOrder", "createdAt",
           "pausedAt", "pausedReason"
    FROM recruiter_config
    ORDER BY "sortOrder" ASC
  `;
}

/** Only enabled recruiters, used for round-robin selection. */
export async function getEnabledRecruiters(): Promise<
  { id: string; name: string; waUrl: string; sortOrder: number }[]
> {
  await ensureDbReady();
  return prisma.$queryRaw`
    SELECT "id", "name", "waUrl", "sortOrder"
    FROM recruiter_config
    WHERE "enabled" = true
    ORDER BY "sortOrder" ASC
  `;
}

/** Toggle enabled flag for one recruiter. */
export async function setRecruiterEnabled(id: string, enabled: boolean): Promise<void> {
  await ensureDbReady();
  await prisma.$executeRaw`
    UPDATE recruiter_config SET "enabled" = ${enabled} WHERE "id" = ${id}
  `;
}

// ─── Click counts ─────────────────────────────────────────────────────────────

/** Returns click count per recruiter name. */
export async function getClickCountMap(recruiterNames: string[]): Promise<Record<string, number>> {
  await ensureDbReady();
  if (recruiterNames.length === 0) return {};

  const rows = await prisma.$queryRaw<{ recruiter: string; cnt: bigint }[]>`
    SELECT "recruiter", COUNT(*) AS cnt
    FROM referral_clicks
    WHERE "recruiter" = ANY(${recruiterNames})
    GROUP BY "recruiter"
  `;

  const map: Record<string, number> = {};
  for (const row of rows) {
    map[row.recruiter] = Number(row.cnt);
  }
  return map;
}

/** Returns total + lastClick per recruiter name (for admin panel). */
export async function getClickStatsMap(
  recruiterNames: string[],
): Promise<Record<string, { total: number; lastClick: Date | null }>> {
  await ensureDbReady();
  if (recruiterNames.length === 0) return {};

  const rows = await prisma.$queryRaw<
    { recruiter: string; total: bigint; lastClick: Date | null }[]
  >`
    SELECT
      "recruiter",
      COUNT(*)         AS total,
      MAX("createdAt") AS "lastClick"
    FROM referral_clicks
    WHERE "recruiter" = ANY(${recruiterNames})
    GROUP BY "recruiter"
  `;

  const map: Record<string, { total: number; lastClick: Date | null }> = {};
  for (const row of rows) {
    map[row.recruiter] = { total: Number(row.total), lastClick: row.lastClick };
  }
  return map;
}

// ─── Round-robin selection ────────────────────────────────────────────────────

/**
 * Picks the enabled recruiter with the fewest existing clicks.
 * Ties broken by lowest sortOrder (= Nuno is always tie-winner → strict alternation).
 * Returns null if no recruiters are enabled.
 */
export async function pickNextRecruiter(): Promise<
  { id: string; name: string; waUrl: string } | null
> {
  const recruiters = await getEnabledRecruiters();

  if (recruiters.length === 0) {
    console.warn("[recruiter-db] pickNextRecruiter: no enabled recruiters");
    return null;
  }

  const countMap = await getClickCountMap(recruiters.map((r) => r.name));

  let pick     = recruiters[0];
  let minCount = countMap[pick.name] ?? 0;

  for (const r of recruiters.slice(1)) {
    const c = countMap[r.name] ?? 0;
    if (c < minCount) { minCount = c; pick = r; }
  }

  console.log(
    `[recruiter-db] pickNextRecruiter: selected id=${pick.id} name="${pick.name}" ` +
    `clicks=${minCount} (total recruiters=${recruiters.length})`,
  );

  return pick;
}

// ─── Click insert ─────────────────────────────────────────────────────────────

export interface SaveClickInput {
  recruiter:   string;
  recruiterWa: string;
  jobId?:      string;
  jobTitle?:   string;
}

/**
 * Inserts one row into referral_clicks.
 * source is always hardcoded to 'AgencyCheck' (proof of origin).
 * Throws on DB error — caller decides how to handle.
 */
export async function saveClick(input: SaveClickInput): Promise<string> {
  await ensureDbReady();
  const id = crypto.randomUUID();
  await prisma.$executeRaw`
    INSERT INTO referral_clicks
      ("id", "recruiter", "recruiterWa", "jobId", "jobTitle", "source")
    VALUES
      (${id}, ${input.recruiter}, ${input.recruiterWa},
       ${input.jobId ?? null}, ${input.jobTitle ?? null}, 'AgencyCheck')
  `;
  console.log(
    `[recruiter-db] saveClick: id=${id} recruiter="${input.recruiter}" ` +
    `jobId="${input.jobId ?? ""}" jobTitle="${input.jobTitle ?? ""}"`,
  );
  return id;
}

// ─── Analytics queries (for GET /api/referral-click) ─────────────────────────

export async function getClickAnalytics() {
  await ensureDbReady();

  const [totalRow] = await prisma.$queryRaw<{ total: bigint }[]>`
    SELECT COUNT(*) AS total FROM referral_clicks
  `;

  const perRecruiter = await prisma.$queryRaw<
    { recruiter: string; recruiterWa: string; clicks: bigint; firstSeen: Date; lastSeen: Date }[]
  >`
    SELECT
      "recruiter", "recruiterWa",
      COUNT(*)         AS clicks,
      MIN("createdAt") AS "firstSeen",
      MAX("createdAt") AS "lastSeen"
    FROM referral_clicks
    GROUP BY "recruiter", "recruiterWa"
    ORDER BY clicks DESC
  `;

  const perVacancy = await prisma.$queryRaw<
    { jobId: string | null; jobTitle: string | null; recruiter: string; clicks: bigint }[]
  >`
    SELECT "jobId", "jobTitle", "recruiter", COUNT(*) AS clicks
    FROM referral_clicks
    GROUP BY "jobId", "jobTitle", "recruiter"
    ORDER BY clicks DESC
  `;

  const recent = await prisma.$queryRaw<ClickRow[]>`
    SELECT "id", "createdAt", "recruiter", "recruiterWa", "jobId", "jobTitle", "source"
    FROM referral_clicks
    ORDER BY "createdAt" DESC
    LIMIT 100
  `;

  return {
    total:        Number(totalRow.total),
    perRecruiter: perRecruiter.map((r) => ({
      recruiter:   r.recruiter,
      recruiterWa: r.recruiterWa,
      clicks:      Number(r.clicks),
      firstSeen:   r.firstSeen,
      lastSeen:    r.lastSeen,
    })),
    perVacancy: perVacancy.map((r) => ({
      jobId:     r.jobId,
      jobTitle:  r.jobTitle,
      recruiter: r.recruiter,
      clicks:    Number(r.clicks),
    })),
    recent,
  };
}
