/**
 * POST /api/check-phone
 *
 * Read-only server-side duplicate check before the WhatsApp window opens.
 * Called from ApplyPreScreen before showing the completed screen and WA redirect.
 * Returns { allowed: boolean }.
 *
 * Allows: phone not seen in last 24 h.
 * Blocks: phone seen in last 24 h (in PhoneApplication table).
 *
 * This endpoint does NOT write anything — writing happens in /api/apply-webhook
 * after the recruiter system confirms receipt. This prevents false-positive
 * blocks in the case where someone opens the form but never sends the WA message.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TTL_MS = 86_400_000; // 24 hours

function normalisePhone(raw: string): string {
  return raw.replace(/[\s\-()]/g, "").toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone = typeof body.phone === "string" ? body.phone : "";
    const phone    = normalisePhone(rawPhone);

    if (phone.length < 7) {
      // Too short to be a real number — let it through (validation happens client-side)
      return NextResponse.json({ allowed: true });
    }

    const cutoff = new Date(Date.now() - TTL_MS);

    const existing = await prisma.phoneApplication.findFirst({
      where: {
        phone,
        createdAt: { gte: cutoff },
      },
      select: { id: true },
    });

    return NextResponse.json({ allowed: !existing });
  } catch (err) {
    // Fail-open: if DB is unreachable, allow the apply to proceed.
    // We never hard-block a real candidate due to an infrastructure issue.
    console.error("[check-phone] DB error — failing open:", err);
    return NextResponse.json({ allowed: true });
  }
}
