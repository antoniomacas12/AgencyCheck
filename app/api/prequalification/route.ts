import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ─── Auto-create table if it doesn't exist yet ────────────────────────────────
// Runs once per cold-start. Eliminates the need for `prisma db push` in prod.
// Prisma creates columns in camelCase — we mirror that exactly.

let tableReady = false;

async function ensureTable() {
  if (tableReady) return;
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS pre_qualifications (
        "id"          TEXT        PRIMARY KEY,
        "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "jobId"       TEXT,
        "jobTitle"    TEXT,
        "isEuCitizen" BOOLEAN     NOT NULL,
        "hasBsn"      BOOLEAN     NOT NULL,
        "qualified"   BOOLEAN     NOT NULL,
        "source"      TEXT
      )
    `;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS pq_created_at_idx ON pre_qualifications ("createdAt")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS pq_qualified_idx  ON pre_qualifications ("qualified")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS pq_job_id_idx     ON pre_qualifications ("jobId")`;
  } catch {
    // Table already exists — ignore
  }
  tableReady = true;
}

// ─── POST /api/prequalification ───────────────────────────────────────────────
// Called fire-and-forget after candidate passes EU + BSN gate.
// Body: { isEuCitizen: boolean, hasBsn: boolean, jobId?, jobTitle?, source? }

export async function POST(req: NextRequest) {
  try {
    await ensureTable();

    const body = await req.json();
    const { isEuCitizen, hasBsn, jobId, jobTitle, source } = body as {
      isEuCitizen: boolean;
      hasBsn:      boolean;
      jobId?:      string;
      jobTitle?:   string;
      source?:     string;
    };

    if (typeof isEuCitizen !== "boolean" || typeof hasBsn !== "boolean") {
      return NextResponse.json(
        { error: "isEuCitizen and hasBsn must be booleans" },
        { status: 400 },
      );
    }

    const qualified = isEuCitizen === true && hasBsn === true;

    // Use raw insert so we control the exact column names (camelCase, no Prisma mapping surprises)
    const id = crypto.randomUUID();
    await prisma.$executeRaw`
      INSERT INTO pre_qualifications
        ("id", "isEuCitizen", "hasBsn", "qualified", "jobId", "jobTitle", "source")
      VALUES
        (${id}, ${isEuCitizen}, ${hasBsn}, ${qualified}, ${jobId ?? null}, ${jobTitle ?? null}, ${source ?? null})
    `;

    return NextResponse.json({ qualified });
  } catch (err) {
    console.error("[prequalification] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── GET /api/prequalification ────────────────────────────────────────────────
// Returns WhatsApp lead count + tracking start date for admin dashboard.

export async function GET(_req: NextRequest) {
  try {
    await ensureTable();

    // All counts via raw SQL with correct camelCase column names
    const [totals] = await prisma.$queryRaw<
      { total: bigint; qualified: bigint }[]
    >`
      SELECT
        COUNT(*)                                    AS total,
        COUNT(*) FILTER (WHERE "qualified" = true)  AS qualified
      FROM pre_qualifications
    `;

    const firstRow = await prisma.$queryRaw<
      { createdAt: Date | null }[]
    >`
      SELECT "createdAt" FROM pre_qualifications ORDER BY "createdAt" ASC LIMIT 1
    `;

    const perJob = await prisma.$queryRaw<
      { jobId: string | null; jobTitle: string | null; attempts: bigint; qualified: bigint }[]
    >`
      SELECT
        "jobId",
        "jobTitle",
        COUNT(*)                                    AS attempts,
        COUNT(*) FILTER (WHERE "qualified" = true)  AS qualified
      FROM pre_qualifications
      GROUP BY "jobId", "jobTitle"
      ORDER BY attempts DESC
    `;

    const total     = Number(totals.total);
    const qualified = Number(totals.qualified);

    return NextResponse.json({
      total,
      qualified,
      rejected:      total - qualified,
      qualifiedRate: total > 0 ? Math.round((qualified / total) * 100) : 0,
      trackingSince: firstRow[0]?.createdAt ?? null,
      perJob: perJob.map((r) => ({
        jobId:     r.jobId,
        jobTitle:  r.jobTitle,
        attempts:  Number(r.attempts),
        qualified: Number(r.qualified),
        rejected:  Number(r.attempts) - Number(r.qualified),
      })),
    });
  } catch (err) {
    console.error("[prequalification] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
