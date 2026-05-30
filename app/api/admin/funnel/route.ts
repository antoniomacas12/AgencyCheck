import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Unique sessions that reached each step
// We define "reached a step" as: the session has at least one event WITH that step
// (not "advanced past it") — so "gate" = opened modal, "details_a" = passed step 1, etc.

export async function GET() {
  try {
    // ── Funnel counts: unique sessions per event type ─────────────────────────
    const funnelRaw = await prisma.$queryRaw<{ event: string; cnt: bigint }[]>`
      SELECT event, COUNT(DISTINCT "sessionId") AS cnt
      FROM apply_funnel_events
      WHERE "createdAt" > NOW() - INTERVAL '30 days'
      GROUP BY event
    `;

    const funnelMap: Record<string, number> = {};
    for (const r of funnelRaw) {
      funnelMap[r.event] = Number(r.cnt);
    }

    // ── Daily opens (last 14 days) ────────────────────────────────────────────
    const dailyRaw = await prisma.$queryRaw<{ day: string; cnt: bigint }[]>`
      SELECT DATE_TRUNC('day', "createdAt")::DATE::TEXT AS day,
             COUNT(DISTINCT "sessionId") AS cnt
      FROM apply_funnel_events
      WHERE event = 'open'
        AND "createdAt" > NOW() - INTERVAL '14 days'
      GROUP BY day
      ORDER BY day ASC
    `;

    const daily = dailyRaw.map((r) => ({ day: r.day, cnt: Number(r.cnt) }));

    // ── Recent abandonments: last 50 sessions that opened but did not complete ─
    const abandonRaw = await prisma.$queryRaw<{
      sessionId: string;
      lastStep:  string;
      jobId:     string | null;
      source:    string | null;
      ts:        string;
    }[]>`
      SELECT
        "sessionId",
        "step"  AS "lastStep",
        "jobId",
        "source",
        "createdAt"::TEXT AS ts
      FROM apply_funnel_events
      WHERE event = 'abandoned'
        AND "createdAt" > NOW() - INTERVAL '30 days'
      ORDER BY "createdAt" DESC
      LIMIT 50
    `;

    // ── Top jobs by open count ────────────────────────────────────────────────
    const topJobsRaw = await prisma.$queryRaw<{ jobId: string | null; cnt: bigint }[]>`
      SELECT "jobId", COUNT(DISTINCT "sessionId") AS cnt
      FROM apply_funnel_events
      WHERE event = 'open'
        AND "createdAt" > NOW() - INTERVAL '30 days'
        AND "jobId" IS NOT NULL
      GROUP BY "jobId"
      ORDER BY cnt DESC
      LIMIT 10
    `;

    const topJobs = topJobsRaw.map((r) => ({ jobId: r.jobId, cnt: Number(r.cnt) }));

    return NextResponse.json({
      funnel:      funnelMap,
      daily,
      abandonments: abandonRaw,
      topJobs,
    });
  } catch (err) {
    console.error("[admin/funnel] error:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
