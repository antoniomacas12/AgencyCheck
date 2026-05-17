import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RECRUITER_SEEDS } from "@/lib/recruiters";

export const dynamic = "force-dynamic";

// ─── DB setup (runs once per cold-start) ─────────────────────────────────────
let setupDone = false;

async function ensureSetup() {
  if (setupDone) return;

  // 1. referral_clicks table (may already exist from previous deployment)
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
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS rc_created_at_idx  ON referral_clicks ("createdAt")`;
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS rc_recruiter_idx   ON referral_clicks ("recruiter")`;
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS rc_job_id_idx      ON referral_clicks ("jobId")`;

  // 2. recruiter_config table
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

  // 3. Seed recruiters (upsert — safe to run repeatedly)
  for (const r of RECRUITER_SEEDS) {
    await prisma.$executeRaw`
      INSERT INTO recruiter_config ("id", "name", "waUrl", "enabled", "sortOrder")
      VALUES (${r.id}, ${r.name}, ${r.waUrl}, true, ${r.sortOrder})
      ON CONFLICT ("id") DO UPDATE
        SET "name"      = EXCLUDED."name",
            "waUrl"     = EXCLUDED."waUrl",
            "sortOrder" = EXCLUDED."sortOrder"
    `;
  }

  setupDone = true;
}

// ─── GET /api/referral-redirect ───────────────────────────────────────────────
// Called via window.open() — MUST be a GET (opened as a new tab URL).
// Query params: jobId, jobTitle, source
//
// Logic:
//   1. Get enabled recruiters (sorted by sortOrder)
//   2. Count existing referral_clicks per recruiter
//   3. Assign to the one with the FEWEST clicks (ties → lowest sortOrder)
//   4. Insert click record
//   5. 302-redirect to recruiter's WA URL

export async function GET(req: NextRequest) {
  try {
    await ensureSetup();

    const { searchParams } = req.nextUrl;
    const jobId    = searchParams.get("jobId")    ?? undefined;
    const jobTitle = searchParams.get("jobTitle") ?? undefined;
    const source   = searchParams.get("source")   ?? "AgencyCheck";

    // ── 1. Fetch enabled recruiters ──────────────────────────────────────────
    const recruiters = await prisma.$queryRaw<
      { id: string; name: string; waUrl: string; sortOrder: number }[]
    >`
      SELECT "id", "name", "waUrl", "sortOrder"
      FROM recruiter_config
      WHERE "enabled" = true
      ORDER BY "sortOrder" ASC
    `;

    if (recruiters.length === 0) {
      // No enabled recruiters — fallback to first seed entry
      const fallback = RECRUITER_SEEDS[0];
      return NextResponse.redirect(fallback.waUrl, 302);
    }

    // ── 2. Count clicks per enabled recruiter ────────────────────────────────
    const clickCounts = await prisma.$queryRaw<
      { recruiter: string; cnt: bigint }[]
    >`
      SELECT "recruiter", COUNT(*) AS cnt
      FROM referral_clicks
      WHERE "recruiter" = ANY(${recruiters.map((r) => r.name)})
      GROUP BY "recruiter"
    `;

    const countMap: Record<string, number> = {};
    for (const row of clickCounts) {
      countMap[row.recruiter] = Number(row.cnt);
    }

    // ── 3. Pick recruiter with fewest clicks (tie → lowest sortOrder) ────────
    let assigned = recruiters[0];
    let minClicks = countMap[recruiters[0].name] ?? 0;

    for (const r of recruiters.slice(1)) {
      const c = countMap[r.name] ?? 0;
      if (c < minClicks) {
        minClicks = c;
        assigned  = r;
      }
    }

    // ── 4. Insert referral click ─────────────────────────────────────────────
    const id = crypto.randomUUID();
    await prisma.$executeRaw`
      INSERT INTO referral_clicks
        ("id", "recruiter", "recruiterWa", "jobId", "jobTitle", "source")
      VALUES
        (${id}, ${assigned.name}, ${assigned.waUrl}, ${jobId ?? null}, ${jobTitle ?? null}, ${source})
    `;

    // ── 5. Redirect to recruiter WhatsApp ────────────────────────────────────
    // Build wa.me URL with pre-filled message
    const waMsg  = jobTitle ? `Hi, I want to apply for: ${jobTitle} [src:${source}]` : `Hi, I'm applying via AgencyCheck [src:${source}]`;
    const waUrl  = `${assigned.waUrl}?text=${encodeURIComponent(waMsg)}`;

    return NextResponse.redirect(waUrl, 302);

  } catch (err) {
    console.error("[referral-redirect] GET error:", err);
    // Fallback: redirect to first recruiter without saving
    const fallback = RECRUITER_SEEDS[0];
    return NextResponse.redirect(fallback.waUrl, 302);
  }
}
