/**
 * POST /api/referral-click
 *
 * Saves a recruiter click record after the candidate navigates directly to
 * WhatsApp via the client-side pre-resolved URL (ApplyPreScreen resolve=1 path).
 *
 * In the fast-redirect flow:
 *   1. Modal opens → GET /api/referral-redirect?resolve=1 → picks recruiter, returns JSON
 *   2. User submits → browser navigates to recruiter WA URL directly (no round-trip)
 *   3. This endpoint is called with keepalive to persist the click for load-balancing
 *
 * Body: { recruiter: string, recruiterWa: string, jobId?: string, jobTitle?: string }
 */

import { NextRequest, NextResponse } from "next/server";
import * as Sentry                   from "@sentry/nextjs";
import { isBotRequest }              from "@/lib/bot-detection";
import { ensureDbReady, saveClick }  from "@/lib/recruiter-db";

export const dynamic = "force-dynamic";

const MAX_STR = 200;

function safe(v: unknown): string | undefined {
  if (typeof v !== "string" || !v.trim()) return undefined;
  return v.trim().slice(0, MAX_STR);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const route = "POST /api/referral-click";

  // Silently drop bots
  if (isBotRequest(req)) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const body        = await req.json();
    const recruiter   = safe(body.recruiter);
    const recruiterWa = safe(body.recruiterWa);
    const jobId       = safe(body.jobId);
    const jobTitle    = safe(body.jobTitle);

    if (!recruiter || !recruiterWa) {
      return NextResponse.json(
        { ok: false, error: "recruiter and recruiterWa are required" },
        { status: 400 },
      );
    }

    await ensureDbReady();
    const clickId = await saveClick({ recruiter, recruiterWa, jobId, jobTitle });
    console.log(`[${route}] click saved — clickId=${clickId} recruiter="${recruiter}"`);

    return NextResponse.json({ ok: true, clickId });
  } catch (err) {
    // Never propagate errors — caller is fire-and-forget with keepalive
    console.error(`[${route}] error:`, err);
    Sentry.captureException(err, { tags: { route } });
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
