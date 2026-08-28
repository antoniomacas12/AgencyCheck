/**
 * POST /api/leads — public lead capture endpoint
 * Saves to PostgreSQL (Supabase) via Prisma.
 * On DB failure: returns HTTP 503 so the frontend can show a proper retry message.
 * NEVER silently swallows failures.
 */

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GDPR consent versioning — bump CONSENT_VERSION whenever consent checkbox wording changes
// Bump PRIVACY_POLICY_VERSION whenever the privacy page content changes significantly
const CONSENT_VERSION        = "2026-08-v1";
const PRIVACY_POLICY_VERSION = "2026-08";

// ─── Allowed values ────────────────────────────────────────────────────────────

const ALLOWED_SOURCE_TYPES = new Set([
  "jobs_with_housing", "job_page", "agency_page", "general_apply",
  "rent_calculator",                // tool lead capture — /tools/rent-calculator
  "reachtruck_apply",               // dedicated job ad — /apply/reachtruck
  "candidate_homepage",             // homepage candidate form — / (pre-consent version)
  "candidate_homepage_consent",     // homepage candidate form — / (with explicit consent checkbox)
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

  // ── GDPR accountability (Phase 18) ────────────────────────────────────────
  // Determine lawful basis from sourceType. Only sourceTypes with confirmed
  // consent checkboxes receive "consent_art6a"; others use "precontract_art6b"
  // (Art. 6(1)(b) — steps at the data subject's request prior to a contract).
  // Historical leads (pre-Phase-18) will have null — no backfill.
  const GDPR_BASIS_MAP: Record<string, string> = {
    "general_apply":               "consent_art6a",
    "candidate_homepage":          "precontract_art6b",
    "candidate_homepage_consent":  "consent_art6a",
    "job_page":                    "precontract_art6b",
    "agency_page":                 "precontract_art6b",
    "jobs_with_housing":           "precontract_art6b",
    "reachtruck_apply":            "precontract_art6b",
    "rent_calculator":             "precontract_art6b",
  };
  const gdprLawfulBasis = GDPR_BASIS_MAP[sourceType] ?? null;
  const gdprConsentAt   = gdprLawfulBasis === "consent_art6a" ? new Date() : null;

  // ─── Prisma → Supabase ────────────────────────────────────────────────────
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
        // GDPR accountability (Phase 18 + 19)
        gdprLawfulBasis,
        gdprConsentAt,
        gdprConsentVersion:       gdprLawfulBasis === "consent_art6a" ? CONSENT_VERSION : null,
        gdprPrivacyPolicyVersion: gdprLawfulBasis === "consent_art6a" ? PRIVACY_POLICY_VERSION : null,
      },
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });

  } catch (err: unknown) {
    // Log to Vercel function logs and send to Sentry for alerting.
    // Do NOT silently swallow this — the lead is NOT saved.
    // PII (name, phone, email) intentionally omitted from logs and error reports.
    console.error(`❌ [POST /api/leads] Database write failed — sourceType="${sourceType}" sourcePage="${sourcePage}":`, err);

    Sentry.captureException(err, {
      tags:  { route: "POST /api/leads" },
      extra: { sourceType, sourcePage },
    });

    return NextResponse.json(
      { ok: false, error: "temporary_issue" },
      { status: 503 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Use /api/admin/leads for listing (requires admin authentication)" },
    { status: 400 }
  );
}
