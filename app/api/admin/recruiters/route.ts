import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ─── GET /api/admin/recruiters ────────────────────────────────────────────────
// Returns all recruiters with their click counts and enabled status.

export async function GET(_req: NextRequest) {
  try {
    const recruiters = await prisma.$queryRaw<
      { id: string; name: string; waUrl: string; enabled: boolean; sortOrder: number; createdAt: Date }[]
    >`
      SELECT "id", "name", "waUrl", "enabled", "sortOrder", "createdAt"
      FROM recruiter_config
      ORDER BY "sortOrder" ASC
    `;

    if (recruiters.length === 0) {
      return NextResponse.json({ recruiters: [] });
    }

    // Click counts per recruiter
    const counts = await prisma.$queryRaw<
      { recruiter: string; total: bigint; lastClick: Date | null }[]
    >`
      SELECT
        "recruiter",
        COUNT(*)        AS total,
        MAX("createdAt") AS "lastClick"
      FROM referral_clicks
      WHERE "recruiter" = ANY(${recruiters.map((r) => r.name)})
      GROUP BY "recruiter"
    `;

    const countMap: Record<string, { total: number; lastClick: Date | null }> = {};
    for (const row of counts) {
      countMap[row.recruiter] = {
        total:     Number(row.total),
        lastClick: row.lastClick,
      };
    }

    return NextResponse.json({
      recruiters: recruiters.map((r) => ({
        id:        r.id,
        name:      r.name,
        waUrl:     r.waUrl,
        enabled:   r.enabled,
        sortOrder: r.sortOrder,
        clicks:    countMap[r.name]?.total     ?? 0,
        lastClick: countMap[r.name]?.lastClick ?? null,
      })),
    });
  } catch (err) {
    console.error("[admin/recruiters] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH /api/admin/recruiters ──────────────────────────────────────────────
// Body: { id: string, enabled: boolean }
// Toggles a recruiter's enabled status.

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, enabled } = body as { id: string; enabled: boolean };

    if (!id || typeof enabled !== "boolean") {
      return NextResponse.json({ error: "id and enabled required" }, { status: 400 });
    }

    await prisma.$executeRaw`
      UPDATE recruiter_config SET "enabled" = ${enabled} WHERE "id" = ${id}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/recruiters] PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
