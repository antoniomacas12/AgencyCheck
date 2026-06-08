/**
 * POST /api/apply-webhook
 *
 * Internal proxy — receives candidate apply data from the client and
 * forwards it to the recruiter webhook. The auth token never touches
 * the browser bundle.
 *
 * Server-side phone dedup (DB-backed, persistent):
 *   - Checks PhoneApplication table for the normalised phone number.
 *   - If seen in last 24 h → silently drops, returns { ok: true, duplicate: true }.
 *   - If first time → forwards to recruiter AND saves phone to PhoneApplication.
 *
 * Persistent across Vercel cold starts (Prisma / Supabase), unlike the old
 * in-memory Map that was reset on every new serverless instance.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const WEBHOOK_URL   = "https://recruiter.agencycheck.io/api/wapp-apply";
const WEBHOOK_TOKEN = "1face9fd6cfc8e9e9fa69d0d47f299ae2102aceb4f553cbf";
const DEDUP_TTL_MS  = 86_400_000; // 24 hours

function normalisePhone(raw: string): string {
  return raw.replace(/[\s\-()]/g, "").toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── Server-side phone dedup (DB-backed) ──────────────────────────────────
    const rawPhone = typeof body.phone === "string" ? body.phone : "";
    const phone    = normalisePhone(rawPhone);

    if (phone.length >= 7) {
      const cutoff = new Date(Date.now() - DEDUP_TTL_MS);
      let isDuplicate = false;

      try {
        const existing = await prisma.phoneApplication.findFirst({
          where: { phone, createdAt: { gte: cutoff } },
          select: { id: true },
        });
        isDuplicate = !!existing;
      } catch (dbErr) {
        // DB unavailable — fail-open so real candidates are never permanently blocked
        console.warn("[apply-webhook] DB check failed — allowing through:", dbErr);
      }

      if (isDuplicate) {
        console.warn(`[apply-webhook] DB duplicate blocked: ${phone.slice(0, 4)}****`);
        return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
      }
    }

    // ── Forward to recruiter webhook ─────────────────────────────────────────
    // phone is not collected by the apply form (recruiter sees it via WhatsApp).
    // Recruiter OS requires the field to be present — send a recognisable
    // placeholder so the OS accepts the payload without failing validation.
    const res = await fetch(WEBHOOK_URL, {
      method:  "POST",
      headers: {
        "Content-Type":    "application/json",
        "X-Webhook-Token": WEBHOOK_TOKEN,
      },
      body: JSON.stringify({
        ...body,
        phone: body.phone || "via_whatsapp",
        sentAt: new Date().toISOString(),
      }),
    });

    // ── Persist phone to DB after successful forward ──────────────────────────
    // Written here (not in /api/check-phone) so we only register phones that
    // actually reached the recruiter system, not abandoned form submissions.
    if (phone.length >= 7) {
      try {
        await prisma.phoneApplication.create({
          data: {
            phone,
            jobId:  typeof body.jobId  === "string" ? body.jobId  : null,
            source: typeof body.source === "string" ? body.source : null,
          },
        });
      } catch (dbErr) {
        // Non-blocking — if DB write fails, log and continue
        console.error("[apply-webhook] failed to save phone to DB:", dbErr);
      }
    }

    return NextResponse.json({ ok: res.ok, status: res.status });
  } catch (err) {
    // Never propagate errors — this is always fire-and-forget from client
    console.error("[apply-webhook] proxy error:", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
