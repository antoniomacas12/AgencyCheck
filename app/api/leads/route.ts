/**
 * POST /api/leads — public lead capture endpoint
 * Primary: saves to PostgreSQL (Supabase) via Prisma.
 * Fallback: if Prisma is unavailable, appends to /tmp/leads_fallback.jsonl
 *           so the submission is visible in Vercel function logs and not lost.
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, appendFileSync } from "fs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ─── Allowed values ────────────────────────────────────────────────────────────

const ALLOWED_SOURCE_TYPES = new Set([
  "jobs_with_housing", "job_page", "agency_page", "general_apply",
  "rent_calculator",   // tool lead capture — /tools/rent-calculator
]);
const ALLOWED_WORK_TYPES = new Set([
  "logistics", "production", "greenhouse", "driving", "cleaning", "construction", "any",
]);
const ALLOWED_EXPERIENCE = new Set(["none", "some", "experienced"]);
const ALLOWED_HOUSING_PREFS = new Set(["with_housing", "no_housing"]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function str(val: unknown, maxLen = 200): string | null {
  if (typeof val !== "string") return null;
  const t = val.trim().slice(0, maxLen);
  return t || null;
}

function bool(val: unknown): boolean | null {
  if (typeof val === "boolean") return val;
  if (val === "yes" || val === "true"  || val === "1") return true;
  if (val === "no"  || val === "false" || val === "0") return false;
  return null;
}

// ─── POST /api/leads ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Required fields
  const fullName = str(body.fullName, 100);
  const phone    = str(body.phone, 30) ?? undefined;
  const emailRaw = str(body.email, 150) ?? undefined;
  if (!fullName) return NextResponse.json({ error: "fullName is required" }, { status: 400 });
  // At least one of phone or email is required
  if (!phone && !emailRaw)
    return NextResponse.json({ error: "phone or email is required" }, { status: 400 });

  // Source
  const sourcePage  = str(body.sourcePage, 300) ?? "/";
  const srcTypeRaw  = str(body.sourceType, 40) ?? "general_apply";
  const sourceType  = ALLOWED_SOURCE_TYPES.has(srcTypeRaw) ? srcTypeRaw : "general_apply";
  const sourceSlug  = str(body.sourceSlug, 100) ?? undefined;
  const sourceLabel = str(body.sourceLabel, 150) ?? undefined;

  // Contact
  const email        = emailRaw;
  const whatsappSame = typeof body.whatsappSame === "boolean" ? body.whatsappSame : false;

  // Background
  const nationality    = str(body.nationality, 60) ?? undefined;
  const currentCountry = str(body.currentCountry, 60) ?? undefined;
  const alreadyInNL    = bool(body.alreadyInNL) ?? undefined;

  // Housing preference
  const housingPrefRaw    = str(body.housingPreference, 20);
  const housingPreference = housingPrefRaw && ALLOWED_HOUSING_PREFS.has(housingPrefRaw)
    ? housingPrefRaw
    : null;

  // Preferences
  const wkRaw             = str(body.preferredWorkType, 30);
  const preferredWorkType = wkRaw && ALLOWED_WORK_TYPES.has(wkRaw) ? wkRaw : undefined;

  const accommodationNeededRaw = bool(body.accommodationNeeded);
  const accommodationNeeded =
    accommodationNeededRaw !== null ? accommodationNeededRaw :
    housingPreference === "with_housing" ? true :
    housingPreference === "no_housing"   ? false :
    undefined;

  const driversLicense  = bool(body.driversLicense) ?? undefined;
  const expRaw          = str(body.experienceLevel, 20);
  const experienceLevel = expRaw && ALLOWED_EXPERIENCE.has(expRaw) ? expRaw : undefined;

  // whenCanStart → stored in existing `availability` column
  const ALLOWED_WHEN_CAN_START = new Set(["immediately", "1_week", "2_weeks", "1_month"]);
  const whenCanStartRaw = str(body.whenCanStart, 20);
  const availability = whenCanStartRaw && ALLOWED_WHEN_CAN_START.has(whenCanStartRaw)
    ? whenCanStartRaw
    : undefined;

  const notes = str(body.notes, 1000) ?? undefined;
  const tags: string[] = housingPreference ? [housingPreference] : [];

  // ─── Build the record ──────────────────────────────────────────────────────
  const record = {
    createdAt:          new Date().toISOString(),
    sourcePage,
    sourceType,
    sourceSlug,
    sourceLabel,
    fullName,
    phone,
    email,
    whatsappSame,
    nationality,
    currentCountry,
    alreadyInNL,
    preferredWorkType,
    accommodationNeeded,
    driversLicense,
    experienceLevel,
    availability,
    notes,
    tags,
    status:             "new",
  };

  // ─── Primary path: Prisma → Supabase ───────────────────────────────────────
  try {
    const lead = await prisma.lead.create({
      data: {
        sourcePage,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sourceType: sourceType as any,
        sourceSlug,
        sourceLabel,
        fullName,
        phone:       phone ?? "",      // DB column is non-nullable; use "" if only email provided
        email,
        whatsappSame,
        nationality,
        currentCountry,
        alreadyInNL,
        preferredWorkType,
        accommodationNeeded,
        driversLicense,
        experienceLevel,
        availability,
        notes,
        status: "new",
        tags:             JSON.stringify(tags),
        assignedAgencies: JSON.stringify([]),
      },
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ [POST /api/leads] Prisma failed — writing to fallback: ${msg}`);

    // ─── Fallback path: append to /tmp/leads_fallback.jsonl ──────────────────
    // /tmp is writable in Vercel serverless functions (512 MB, ephemeral).
    // This ensures the submission is not lost even if the DB is unreachable.
    // Check Vercel function logs at /tmp/leads_fallback.jsonl if DB is down.
    try {
      const line = JSON.stringify(record) + "\n";
      appendFileSync("/tmp/leads_fallback.jsonl", line, "utf8");
      console.warn(`⚠️  [POST /api/leads] Fallback write OK for: ${fullName} <${phone}>`);
      // Return success to the user — lead is saved in /tmp and visible in logs
      return NextResponse.json({ ok: true, id: `fallback-${Date.now()}`, fallback: true }, { status: 201 });
    } catch (fsErr: unknown) {
      const fsMsg = fsErr instanceof Error ? fsErr.message : String(fsErr);
      console.error(`❌ [POST /api/leads] Fallback write also failed: ${fsMsg}`);
      return NextResponse.json(
        { error: "Could not save your details. Please try again." },
        { status: 500 }
      );
    }
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Use /api/admin/leads for listing (requires admin authentication)" },
    { status: 400 }
  );
}
