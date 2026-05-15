import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─── POST /api/prequalification ───────────────────────────────────────────────
// Records EU citizen + BSN answers before the Apply/WhatsApp button is shown.
// Returns { qualified: boolean } so the client can gate the next step.
//
// Body: { isEuCitizen: boolean, hasBsn: boolean, jobId?: string, jobTitle?: string, source?: string }
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { isEuCitizen, hasBsn, jobId, jobTitle, source } = body as {
      isEuCitizen: boolean;
      hasBsn: boolean;
      jobId?: string;
      jobTitle?: string;
      source?: string;
    };

    // Validate required fields
    if (typeof isEuCitizen !== "boolean" || typeof hasBsn !== "boolean") {
      return NextResponse.json(
        { error: "isEuCitizen and hasBsn must be booleans" },
        { status: 400 },
      );
    }

    const qualified = isEuCitizen === true && hasBsn === true;

    // Persist to DB (fire-and-forget pattern — don't block the response)
    await prisma.preQualification.create({
      data: {
        isEuCitizen,
        hasBsn,
        qualified,
        jobId:    jobId    ?? null,
        jobTitle: jobTitle ?? null,
        source:   source   ?? null,
      },
    });

    return NextResponse.json({ qualified });
  } catch (err) {
    console.error("[prequalification] POST error:", err);
    // Return a safe fallback — don't surface DB errors to the client
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── GET /api/prequalification/stats ─────────────────────────────────────────
// Simple analytics: total, qualified, rejected counts (and per-job breakdown).
// Not publicly linked — admin use only.
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const [total, qualified, byJob] = await Promise.all([
      prisma.preQualification.count(),
      prisma.preQualification.count({ where: { qualified: true } }),
      prisma.preQualification.groupBy({
        by: ["jobId", "jobTitle"],
        _count: { id: true },
        _sum:   { qualified: true } as never, // qualified is boolean, counts via raw
        orderBy: { _count: { id: "desc" } },
      }),
    ]);

    // Compute per-job qualified counts separately (groupBy on boolean is cleaner this way)
    const perJobStats = await prisma.$queryRaw<
      { job_id: string | null; job_title: string | null; attempts: bigint; qualified: bigint }[]
    >`
      SELECT
        job_id,
        job_title,
        COUNT(*) AS attempts,
        COUNT(*) FILTER (WHERE qualified = true) AS qualified
      FROM pre_qualifications
      GROUP BY job_id, job_title
      ORDER BY attempts DESC
    `;

    return NextResponse.json({
      total,
      qualified,
      rejected: total - qualified,
      qualifiedRate: total > 0 ? Math.round((qualified / total) * 100) : 0,
      perJob: perJobStats.map((r) => ({
        jobId:     r.job_id,
        jobTitle:  r.job_title,
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
