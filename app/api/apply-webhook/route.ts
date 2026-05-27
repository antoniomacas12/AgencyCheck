/**
 * POST /api/apply-webhook
 *
 * Internal proxy — receives candidate apply data from the client and
 * forwards it to the recruiter webhook. The auth token never touches
 * the browser bundle.
 *
 * Called fire-and-forget from ApplyPreScreen after window.open(WhatsApp).
 */

import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL   = "https://recruiter.agencycheck.io/api/wapp-apply";
const WEBHOOK_TOKEN = "1face9fd6cfc8e9e9fa69d0d47f299ae2102aceb4f553cbf";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(WEBHOOK_URL, {
      method:  "POST",
      headers: {
        "Content-Type":   "application/json",
        "X-Webhook-Token": WEBHOOK_TOKEN,
      },
      body: JSON.stringify({
        ...body,
        sentAt: new Date().toISOString(),
      }),
    });

    return NextResponse.json({ ok: res.ok, status: res.status });
  } catch (err) {
    // Never propagate errors — this is always fire-and-forget
    console.error("[apply-webhook] proxy error:", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
