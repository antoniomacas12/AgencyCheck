/**
 * POST /api/apply-webhook
 *
 * Internal proxy — receives candidate apply data from the client and
 * forwards it to the recruiter webhook. The auth token never touches
 * the browser bundle.
 *
 * Server-side phone dedup: same phone number blocked for 24 h.
 * Called fire-and-forget from ApplyPreScreen after window.open(WhatsApp).
 */

import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL   = "https://recruiter.agencycheck.io/api/wapp-apply";
const WEBHOOK_TOKEN = "1face9fd6cfc8e9e9fa69d0d47f299ae2102aceb4f553cbf";
const DEDUP_TTL_MS  = 86_400_000; // 24 hours

// In-memory phone dedup store — survives for the lifetime of the serverless
// instance. Not persistent across cold starts, but catches rapid re-submissions
// within the same instance window (the most common spam pattern).
const phoneLog = new Map<string, number>(); // phone → timestamp

function normalisePhone(raw: string): string {
  return raw.replace(/[\s\-()]/g, "").toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── Server-side phone dedup ───────────────────────────────────────────
    const rawPhone = typeof body.phone === "string" ? body.phone : "";
    const phone    = normalisePhone(rawPhone);

    if (phone) {
      const lastTs = phoneLog.get(phone);
      if (lastTs && Date.now() - lastTs < DEDUP_TTL_MS) {
        // Duplicate within 24 h — silently drop, do NOT forward to recruiter
        console.warn(`[apply-webhook] duplicate blocked: ${phone.slice(0, 4)}****`);
        return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
      }
      phoneLog.set(phone, Date.now());

      // Prune old entries to avoid unbounded growth
      if (phoneLog.size > 2000) {
        const cutoff = Date.now() - DEDUP_TTL_MS;
        for (const [k, v] of phoneLog) {
          if (v < cutoff) phoneLog.delete(k);
        }
      }
    }

    const res = await fetch(WEBHOOK_URL, {
      method:  "POST",
      headers: {
        "Content-Type":    "application/json",
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
