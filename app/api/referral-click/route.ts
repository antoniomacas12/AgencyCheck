import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ─── Auto-create table on first cold-start ────────────────────────────────────
let tableReady = false;

async function ensureTable() {
  if (tableReady) return;
  try {
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
  } catch {
    // Already exists — ignore
  }
  tableReady = true;
}

// ─── POST /api/referral-click ─────────────────────────────────────────────────
// Called fire-and-forget when a candidate passes EU gate and is sent to recruiter WA.
// Body: { recruiter, recruiterWa, jobId?, jobTitle? }

export async function POST(req: NextRequest) {
  try {
    await ensureTable();

    const body = await req.json();
    const { recruiter, recruiterWa, jobId, jobTitle } = body as {
      recruiter:   string;
      recruiterWa: string;
      jobId?:      string;
      jobTitle?:   string;
    };

    if (!recruiter || !recruiterWa) {
      return NextResponse.json(
        { error: "recruiter and recruiterWa are required" },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    await prisma.$executeRaw`
      INSERT INTO referral_clicks
        ("id", "recruiter", "recruiterWa", "jobId", "jobTitle", "source")
      VALUES
        (${id}, ${recruiter}, ${recruiterWa}, ${jobId ?? null}, ${jobTitle ?? null}, 'AgencyCheck')
    `;

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[referral-click] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── GET /api/referral-click ──────────────────────────────────────────────────
// Returns analytics for admin dashboard:
//   total, perRecruiter[], perVacancy[], recent[] (last 100 clicks)

export async function GET(_req: NextRequest) {
  try {
    await ensureTable();

    // Total clicks
    const [totals] = await prisma.$queryRaw<{ total: bigint }[]>`
      SELECT COUNT(*) AS total FROM referral_clicks
    `;

    // Per recruiter
    const perRecruiter = await prisma.$queryRaw<
      { recruiter: string; recruiterWa: string; clicks: bigint; firstSeen: Date; lastSeen: Date }[]
    >`
      SELECT
        "recruiter",
        "recruiterWa",
        COUNT(*)        AS clicks,
        MIN("createdAt") AS "firstSeen",
        MAX("createdAt") AS "lastSeen"
      FROM referral_clicks
      GROUP BY "recruiter", "recruiterWa"
      ORDER BY clicks DESC
    `;

    // Per vacancy
    const perVacancy = await prisma.$queryRaw<
      { jobId: string | null; jobTitle: string | null; recruiter: string; clicks: bigint }[]
    >`
      SELECT
        "jobId",
        "jobTitle",
        "recruiter",
        COUNT(*) AS clicks
      FROM referral_clicks
      GROUP BY "jobId", "jobTitle", "recruiter"
      ORDER BY clicks DESC
    `;

    // Recent 100 clicks (for timeline)
    const recent = await prisma.$queryRaw<
      { id: string; createdAt: Date; recruiter: string; jobId: string | null; jobTitle: string | null; source: string }[]
    >`
      SELECT "id", "createdAt", "recruiter", "jobId", "jobTitle", "source"
      FROM referral_clicks
      ORDER BY "createdAt" DESC
      LIMIT 100
    `;

    return NextResponse.json({
      total:       Number(totals.total),
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
      recent: recent.map((r) => ({
        id:        r.id,
        createdAt: r.createdAt,
        recruiter: r.recruiter,
        jobId:     r.jobId,
        jobTitle:  r.jobTitle,
        source:    r.source,
      })),
    });
  } catch (err) {
    console.error("[referral-click] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
