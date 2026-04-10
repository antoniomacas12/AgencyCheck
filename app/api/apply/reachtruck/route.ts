/**
 * POST /api/apply/reachtruck
 *
 * Dedicated submission endpoint for the Reachtruck Driver landing page.
 * Accepts multipart/form-data so the CV file upload is handled server-side.
 *
 * Qualification rules (server-authoritative — client preview is UX only):
 *   EU right to work   — required (eu-passport === "yes")
 *   Reachtruck years   — minimum 3
 *   Driver's license   — required (drivers-license === "yes")
 *   English level      — B1, B2, C1, or C2
 *
 * ALL applications are saved regardless of qualification outcome.
 *   Qualified   → status = "new",      tags include "qualified"
 *   Disqualified → status = "rejected", tags include "rejected", internalNotes holds reasons
 *
 * Wires into the existing admin lead pipeline:
 *   /admin/leads → filter sourceType = "reachtruck_apply"
 *               → or filter tag     = "reachtruck"
 *
 * CV storage: base64-encoded and saved in internalNotes under a [CV_BASE64] header.
 * Max accepted file size: 3 MB. Admin can decode the base64 to retrieve the file.
 *
 * Fallback path (same as /api/leads): if Prisma fails, appends to /tmp/leads_fallback.jsonl
 * so no submission is silently lost even during DB outages.
 */

import { NextRequest, NextResponse }  from "next/server";
import { appendFileSync }             from "fs";
import { prisma }                     from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ─── Constants ────────────────────────────────────────────────────────────────

const ENGLISH_QUALIFIED = new Set(["B1", "B2", "C1", "C2"]);
const MAX_CV_BYTES       = 3 * 1024 * 1024; // 3 MB

// ─── Qualification logic ──────────────────────────────────────────────────────

function qualify(p: {
  euPassport:        string;
  reachtruckYears:   number;
  hasDriversLicense: string;
  englishLevel:      string;
}): { qualified: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (p.euPassport !== "yes")
    reasons.push("No EU right to work");

  if (p.reachtruckYears < 3)
    reasons.push(
      `Reachtruck experience: ${p.reachtruckYears} yr(s) — minimum 3 required`
    );

  if (p.hasDriversLicense !== "yes")
    reasons.push("No valid driver's license (category B)");

  if (!ENGLISH_QUALIFIED.has(p.englishLevel))
    reasons.push(
      `English ${p.englishLevel || "(not provided)"} — B1 minimum required`
    );

  return { qualified: reasons.length === 0, reasons };
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Parse multipart/form-data
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const g = (key: string): string =>
    ((form.get(key) as string | null) ?? "").trim();

  // ── Extract fields ─────────────────────────────────────────────────────────
  const fullName           = g("fullname");
  const phone              = g("phone");
  const nationality        = g("nationality");
  const euPassport         = g("eu-passport");       // "yes" | "no"
  const reachtruckYearsRaw = g("reachtruck-years");
  const hasDriversLicense  = g("drivers-license");   // "yes" | "no"
  const englishLevel       = g("english-level");     // "A1"|"A2"|"B1"|"B2"|"C1"|"C2"
  const availabilityRaw    = g("availability");      // "yes" = ≤2 wks | "no" = ≤4 wks
  const cvFile             = form.get("cv-file") as File | null;

  // ── Required field validation ──────────────────────────────────────────────
  if (!fullName)
    return NextResponse.json({ error: "fullName is required" }, { status: 400 });
  if (!phone || phone.length < 7)
    return NextResponse.json({ error: "phone is required" }, { status: 400 });
  if (!euPassport)
    return NextResponse.json({ error: "eu-passport is required" }, { status: 400 });
  if (!englishLevel)
    return NextResponse.json({ error: "english-level is required" }, { status: 400 });

  const reachtruckYears = parseInt(reachtruckYearsRaw, 10);
  if (isNaN(reachtruckYears) || reachtruckYearsRaw === "")
    return NextResponse.json({ error: "reachtruck-years is required" }, { status: 400 });

  // ── Qualification check ────────────────────────────────────────────────────
  const { qualified, reasons } = qualify({
    euPassport,
    reachtruckYears,
    hasDriversLicense,
    englishLevel,
  });

  // ── CV file handling ───────────────────────────────────────────────────────
  let cvNote         = "CV: not uploaded";
  let cvInternalNote = "";

  if (cvFile && cvFile.size > 0) {
    if (cvFile.size > MAX_CV_BYTES)
      return NextResponse.json(
        { error: "CV file is too large. Maximum 3 MB allowed." },
        { status: 400 }
      );

    const buf    = Buffer.from(await cvFile.arrayBuffer());
    const b64    = buf.toString("base64");
    const sizeKb = Math.round(cvFile.size / 1024);

    cvNote         = `CV: ${cvFile.name} (${sizeKb} KB, ${cvFile.type})`;
    cvInternalNote = `[CV_BASE64 name="${cvFile.name}" type="${cvFile.type}" size="${sizeKb}KB"]\n${b64}`;
  }

  // ── Map to Lead model ──────────────────────────────────────────────────────
  // experienceLevel  →  existing enum: "none" | "some" | "experienced"
  const experienceLevel =
    reachtruckYears >= 3 ? "experienced" :
    reachtruckYears >  0 ? "some"        :
    "none";

  // availability  →  existing enum: "immediately" | "1_week" | "2_weeks" | "1_month"
  const availability = availabilityRaw === "yes" ? "immediately" : "1_month";

  const notesText = [
    "=== Reachtruck Driver Application — Waalwijk (€16.50/hr) ===",
    `Nationality:             ${nationality || "not provided"}`,
    `EU right to work:        ${euPassport}`,
    `Reachtruck experience:   ${reachtruckYears} year(s)`,
    `Driver's license:        ${hasDriversLicense}`,
    `English level:           ${englishLevel}`,
    `Available within 2 wks:  ${availabilityRaw}`,
    cvNote,
    "",
    qualified
      ? "✅ QUALIFIED — enters standard pipeline as status=new"
      : `🚫 REJECTED — ${reasons.join(" | ")}`,
  ].join("\n");

  const internalNotesText = [
    qualified
      ? "QUALIFIED — Reachtruck Driver, Waalwijk, €16.50/hr"
      : `REJECTED — ${reasons.join("; ")}`,
    cvInternalNote || null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const leadData = {
    sourcePage:          "/apply/reachtruck",
    sourceType:          "reachtruck_apply",
    sourceLabel:         "Reachtruck Driver — Waalwijk (€16.50/hr)",
    fullName,
    phone,
    nationality:         nationality || undefined,
    preferredWorkType:   "logistics",      // closest existing work-type enum value
    driversLicense:      hasDriversLicense === "yes",
    experienceLevel,
    accommodationNeeded: true,             // shared room is part of the job offer
    availability,
    notes:               notesText,
    internalNotes:       internalNotesText,
    status:              qualified ? "new" : "rejected",
    tags:                JSON.stringify([
      "reachtruck",
      "waalwijk",
      qualified ? "qualified" : "rejected",
    ]),
    assignedAgencies:    JSON.stringify([]),
  };

  // ── Save to Prisma → Supabase PostgreSQL ───────────────────────────────────
  try {
    const lead = await prisma.lead.create({ data: leadData });
    console.log(
      `✅ [POST /api/apply/reachtruck] lead=${lead.id} qualified=${qualified}`
    );
    return NextResponse.json({ ok: true, id: lead.id, qualified }, { status: 201 });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ [POST /api/apply/reachtruck] Prisma failed — writing fallback: ${msg}`);

    // Fallback path — same pattern as /api/leads
    try {
      const line =
        JSON.stringify({ ...leadData, createdAt: new Date().toISOString() }) + "\n";
      appendFileSync("/tmp/leads_fallback.jsonl", line, "utf8");
      console.warn(`⚠️  [POST /api/apply/reachtruck] Fallback write OK: ${fullName}`);
      return NextResponse.json(
        { ok: true, id: `fallback-${Date.now()}`, qualified, fallback: true },
        { status: 201 }
      );
    } catch {
      return NextResponse.json(
        { error: "Could not save your application. Please try again." },
        { status: 500 }
      );
    }
  }
}
