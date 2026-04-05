/**
 * POST /api/leads/[id]/qualify
 *
 * Public endpoint — called immediately after the main lead form submit.
 * Saves availability + locationStatus and computes leadScore.
 * No auth required: the CUID id is the access token (hard to guess).
 * Only updates the two qualification fields — nothing else.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALLOWED_AVAILABILITY = new Set([
  "immediately", "1_2_weeks", "1_month", "exploring",
]);
const ALLOWED_LOCATION = new Set([
  "nl", "relocate", "exploring",
]);

function computeScore(availability: string, locationStatus: string): number {
  if (availability === "immediately" && locationStatus === "nl")       return 100;
  if (availability === "immediately" && locationStatus === "relocate") return 80;
  if (availability === "1_2_weeks"   && locationStatus === "nl")       return 70;
  if (availability === "1_2_weeks"   && locationStatus === "relocate") return 60;
  if (availability === "1_month")                                       return 40;
  if (availability === "exploring")                                     return 10;
  // fallback by availability only
  if (locationStatus === "nl")       return 60;
  if (locationStatus === "relocate") return 40;
  return 20;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const availability   = typeof body.availability   === "string" ? body.availability   : null;
  const locationStatus = typeof body.locationStatus === "string" ? body.locationStatus : null;

  if (!availability   || !ALLOWED_AVAILABILITY.has(availability)) {
    return NextResponse.json({ error: "invalid_availability" }, { status: 400 });
  }
  if (!locationStatus || !ALLOWED_LOCATION.has(locationStatus)) {
    return NextResponse.json({ error: "invalid_location_status" }, { status: 400 });
  }

  const leadScore = computeScore(availability, locationStatus);

  try {
    await prisma.lead.update({
      where: { id: params.id },
      data:  { availability, locationStatus, leadScore },
    });
    return NextResponse.json({ ok: true, leadScore });
  } catch (err) {
    // If lead not found prisma throws P2025
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("P2025") || msg.includes("not found")) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    console.error("[POST /api/leads/[id]/qualify]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
