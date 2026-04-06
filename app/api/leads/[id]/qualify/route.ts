/**
 * POST /api/leads/[id]/qualify
 *
 * Public endpoint — called immediately after the main lead form submit.
 * Saves availability + locationStatus + Q2/Q4 qualification tags and computes leadScore.
 * No auth required: the CUID id is the access token (hard to guess).
 *
 * Accepts:
 *   availability    — Q3: when can you start (maps to existing DB column)
 *   locationStatus  — Q1: where are you now  (maps to existing DB column)
 *   q2_bsn          — Q2: BSN status         (stored as tag "q:bsn=<value>")
 *   q4_experience   — Q4: NL work experience (stored as tag "q:exp=<value>")
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
const ALLOWED_Q2_BSN = new Set(["has_bsn", "worked_before", "no"]);
const ALLOWED_Q4_EXP = new Set(["yes", "no"]);

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
  const q2_bsn         = typeof body.q2_bsn         === "string" ? body.q2_bsn         : null;
  const q4_experience  = typeof body.q4_experience  === "string" ? body.q4_experience  : null;

  if (!availability   || !ALLOWED_AVAILABILITY.has(availability)) {
    return NextResponse.json({ error: "invalid_availability" }, { status: 400 });
  }
  if (!locationStatus || !ALLOWED_LOCATION.has(locationStatus)) {
    return NextResponse.json({ error: "invalid_location_status" }, { status: 400 });
  }
  if (q2_bsn        && !ALLOWED_Q2_BSN.has(q2_bsn)) {
    return NextResponse.json({ error: "invalid_q2_bsn" }, { status: 400 });
  }
  if (q4_experience && !ALLOWED_Q4_EXP.has(q4_experience)) {
    return NextResponse.json({ error: "invalid_q4_experience" }, { status: 400 });
  }

  const leadScore = computeScore(availability, locationStatus);

  try {
    // Fetch current tags so we preserve existing ones (e.g. "with_housing")
    const existing = await prisma.lead.findUnique({
      where: { id: params.id },
      select: { tags: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    let tags: string[] = [];
    try { tags = JSON.parse(existing.tags); } catch { tags = []; }
    if (!Array.isArray(tags)) tags = [];

    // Strip any prior qualification tags (makes the call idempotent)
    tags = tags.filter((t) => !t.startsWith("q:bsn=") && !t.startsWith("q:exp="));

    // Append new qualification tags
    if (q2_bsn)        tags.push(`q:bsn=${q2_bsn}`);
    if (q4_experience) tags.push(`q:exp=${q4_experience}`);

    await prisma.lead.update({
      where: { id: params.id },
      data:  { availability, locationStatus, leadScore, tags: JSON.stringify(tags) },
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
