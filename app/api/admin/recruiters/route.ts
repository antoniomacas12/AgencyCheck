import { NextRequest, NextResponse } from "next/server";
import {
  getAllRecruiters,
  getClickStatsMap,
  setRecruiterEnabled,
  ensureDbReady,
} from "@/lib/recruiter-db";

export const dynamic = "force-dynamic";

// ─── GET /api/admin/recruiters ────────────────────────────────────────────────
// Returns all recruiters with click counts and last-click timestamp.

export async function GET(_req: NextRequest) {
  try {
    // ensureDbReady() is called inside getAllRecruiters, but we call it explicitly
    // here so tables + seeds exist even if no apply has ever been made.
    await ensureDbReady();

    const recruiters = await getAllRecruiters();

    console.log(`[admin/recruiters] GET — found ${recruiters.length} recruiter(s)`);

    if (recruiters.length === 0) {
      return NextResponse.json({ recruiters: [] });
    }

    const statsMap = await getClickStatsMap(recruiters.map((r) => r.name));

    return NextResponse.json({
      recruiters: recruiters.map((r) => ({
        id:           r.id,
        name:         r.name,
        waUrl:        r.waUrl,
        enabled:      r.enabled,
        sortOrder:    r.sortOrder,
        clicks:       statsMap[r.name]?.total     ?? 0,
        lastClick:    statsMap[r.name]?.lastClick ?? null,
        pausedAt:     r.pausedAt     ?? null,
        pausedReason: r.pausedReason ?? null,
      })),
    });
  } catch (err) {
    console.error("[admin/recruiters] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH /api/admin/recruiters ──────────────────────────────────────────────
// Body: { id: string, enabled: boolean }

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, enabled } = body as { id: string; enabled: boolean };

    if (!id || typeof enabled !== "boolean") {
      return NextResponse.json({ error: "id and enabled are required" }, { status: 400 });
    }

    await setRecruiterEnabled(id, enabled);

    console.log(`[admin/recruiters] PATCH — id=${id} enabled=${enabled}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/recruiters] PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
