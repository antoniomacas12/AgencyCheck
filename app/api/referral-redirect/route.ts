import { NextRequest, NextResponse } from "next/server";
import { prisma }                    from "@/lib/prisma";
import { RECRUITER_SEEDS }           from "@/lib/recruiters";
import { isBotRequest }              from "@/lib/bot-detection";

export const dynamic = "force-dynamic";

// ─── Param limits ─────────────────────────────────────────────────────────────
const MAX_JOB_ID_LEN    = 120;
const MAX_JOB_TITLE_LEN = 200;
const MAX_SOURCE_LEN    = 100;

// ─── DB setup (runs once per cold-start) ─────────────────────────────────────
let setupDone = false;

async function ensureSetup(): Promise<void> {
  if (setupDone) return;

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
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS rc_created_at_idx ON referral_clicks ("createdAt")`;
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS rc_recruiter_idx  ON referral_clicks ("recruiter")`;
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS rc_job_id_idx     ON referral_clicks ("jobId")`;

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

// ─── Param sanitisation ───────────────────────────────────────────────────────
function sanitise(value: string | null, maxLen: number): string | undefined {
  if (!value) return undefined;
  // Strip null bytes and control characters, then trim
  const cleaned = value.replace(/[\x00-\x1F\x7F]/g, "").trim();
  return cleaned.length > 0 ? cleaned.slice(0, maxLen) : undefined;
}

// ─── Safe 204 response for bots ───────────────────────────────────────────────
function botResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// ─── GET /api/referral-redirect ───────────────────────────────────────────────
// Opened via window.open() as a new tab — MUST be GET.
// Query params: jobId, jobTitle, source
//
// Flow:
//   1. Reject bots / crawlers → 204 No Content (no DB write, no redirect)
//   2. Validate + sanitise params
//   3. Fetch enabled recruiters (round-robin: fewest clicks → lowest sortOrder)
//   4. Insert click record (failure here is non-fatal — redirect still happens)
//   5. 302 redirect to recruiter WA with pre-filled message tagged [src:AgencyCheck]

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ts      = new Date().toISOString();
  const route   = "GET /api/referral-redirect";
  const ua      = req.headers.get("user-agent") ?? "(none)";
  const ip      = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "(unknown)";
  const rawParams = req.nextUrl.searchParams.toString();

  // ── 1. Bot / crawler check ────────────────────────────────────────────────
  if (isBotRequest(req)) {
    console.info(
      `[${route}] BOT blocked — ts=${ts} ua="${ua}" ip=${ip} params=${rawParams}`
    );
    return botResponse();
  }

  // ── 2. Param validation + sanitisation ────────────────────────────────────
  const { searchParams } = req.nextUrl;
  const jobId    = sanitise(searchParams.get("jobId"),    MAX_JOB_ID_LEN);
  const jobTitle = sanitise(searchParams.get("jobTitle"), MAX_JOB_TITLE_LEN);
  const source   = sanitise(searchParams.get("source"),   MAX_SOURCE_LEN) ?? "AgencyCheck";

  // ── 3. Recruiter rotation ─────────────────────────────────────────────────
  let assigned: { name: string; waUrl: string } = RECRUITER_SEEDS[0];

  try {
    await ensureSetup();

    const recruiters = await prisma.$queryRaw<
      { id: string; name: string; waUrl: string; sortOrder: number }[]
    >`
      SELECT "id", "name", "waUrl", "sortOrder"
      FROM recruiter_config
      WHERE "enabled" = true
      ORDER BY "sortOrder" ASC
    `;

    if (recruiters.length === 0) {
      console.warn(`[${route}] No enabled recruiters — using seed fallback ts=${ts}`);
    } else {
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

      let pick     = recruiters[0];
      let minCount = countMap[pick.name] ?? 0;
      for (const r of recruiters.slice(1)) {
        const c = countMap[r.name] ?? 0;
        if (c < minCount) { minCount = c; pick = r; }
      }
      assigned = pick;
    }
  } catch (err) {
    console.error(
      `[${route}] DB error during recruiter selection — falling back to seed. ` +
      `ts=${ts} ua="${ua}" ip=${ip} params=${rawParams}`,
      err,
    );
    // assigned already set to RECRUITER_SEEDS[0] — continue to redirect
  }

  // ── 4. Insert click record (non-fatal) ────────────────────────────────────
  try {
    const id = crypto.randomUUID();
    await prisma.$executeRaw`
      INSERT INTO referral_clicks
        ("id", "recruiter", "recruiterWa", "jobId", "jobTitle", "source")
      VALUES
        (${id}, ${assigned.name}, ${assigned.waUrl}, ${jobId ?? null}, ${jobTitle ?? null}, 'AgencyCheck')
    `;
  } catch (err) {
    // Log but do NOT abort — candidate must still reach recruiter
    console.error(
      `[${route}] DB insert FAILED (click not saved). ` +
      `ts=${ts} ua="${ua}" ip=${ip} recruiter="${assigned.name}" jobId="${jobId ?? ""}" jobTitle="${jobTitle ?? ""}"`,
      err,
    );
  }

  // ── 5. Redirect to recruiter WhatsApp ─────────────────────────────────────
  // Message is hardcoded with [src:AgencyCheck] — permanent proof of origin
  // even if the candidate edits the pre-filled text before sending.
  const waMsg = jobTitle
    ? `Hi, I want to apply for: ${jobTitle} [src:AgencyCheck]`
    : `Hi, I'm applying via AgencyCheck [src:AgencyCheck]`;
  const waUrl = `${assigned.waUrl}?text=${encodeURIComponent(waMsg)}`;

  return NextResponse.redirect(waUrl, 302);
}
