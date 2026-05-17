import { NextRequest, NextResponse } from "next/server";
import { isBotRequest }             from "@/lib/bot-detection";
import {
  ensureDbReady,
  saveClick,
  getClickAnalytics,
} from "@/lib/recruiter-db";

export const dynamic = "force-dynamic";

// ─── POST /api/referral-click ─────────────────────────────────────────────────
// Legacy endpoint — kept for backwards compatibility.
// New flow uses GET /api/referral-redirect which saves clicks server-side.
// Body: { recruiter, recruiterWa, jobId?, jobTitle? }

export async function POST(req: NextRequest) {
  if (isBotRequest(req)) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    await ensureDbReady();

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

    const id = await saveClick({ recruiter, recruiterWa, jobId, jobTitle });

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[referral-click] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── GET /api/referral-click ──────────────────────────────────────────────────
// Returns analytics for the admin referrals dashboard.

export async function GET(_req: NextRequest) {
  try {
    await ensureDbReady();
    const data = await getClickAnalytics();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[referral-click] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
