/**
 * POST /api/experiences — save anonymous worker salary/housing report
 * GET  /api/experiences — return real count from database
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

// ─── In-memory rate limit (per process — resets on cold start, fine for abuse prevention) ───

const IP_SUBMISSIONS = new Map<string, number>();

function getRateKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

// ─── Validation ──────────────────────────────────────────────────────────────

interface ExperiencePayload {
  agencyName:     string;
  city:           string;
  jobType:        string;
  agreedGross:    string;
  actualKeep:     string;
  hasHousing:     boolean;
  housingRating:  number;
  salaryAccurate: boolean;
  wouldRecommend: boolean;
  comment:        string;
  submittedAt:    string;
}

function isValidPayload(body: unknown): body is ExperiencePayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.agencyName     === "string" &&
    typeof b.city           === "string" &&
    typeof b.jobType        === "string" &&
    typeof b.submittedAt    === "string" &&
    typeof b.hasHousing     === "boolean" &&
    typeof b.salaryAccurate === "boolean" &&
    typeof b.wouldRecommend === "boolean"
  );
}

// ─── POST ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limit: max 1 submission per IP per minute
  const ipKey = getRateKey(req);
  const now   = Date.now();
  const last  = IP_SUBMISSIONS.get(ipKey) ?? 0;
  if (now - last < 60 * 1000) {
    return NextResponse.json({ error: "Too many submissions. Please wait a minute." }, { status: 429 });
  }
  IP_SUBMISSIONS.set(ipKey, now);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid or incomplete payload" }, { status: 422 });
  }

  // Sanitise / truncate all string inputs
  const clean: ExperiencePayload = {
    ...body,
    agencyName: body.agencyName.slice(0, 100).replace(/<[^>]*>/g, "").trim(),
    city:       body.city.slice(0, 100).replace(/<[^>]*>/g, "").trim(),
    jobType:    body.jobType.slice(0, 100).replace(/<[^>]*>/g, "").trim(),
    agreedGross: (body.agreedGross || "").slice(0, 50).trim(),
    actualKeep:  (body.actualKeep  || "").slice(0, 50).trim(),
    comment:     (body.comment     || "").slice(0, 500).replace(/<[^>]*>/g, "").trim(),
  };

  if (!clean.agencyName || !clean.city || !clean.jobType) {
    return NextResponse.json({ error: "agencyName, city, and jobType are required" }, { status: 422 });
  }

  try {
    await db.workerExperience.create({
      data: {
        agencyName:    clean.agencyName,
        city:          clean.city,
        jobType:       clean.jobType,
        agreedGross:   clean.agreedGross || null,
        actualKeep:    clean.actualKeep  || null,
        hasHousing:    clean.hasHousing,
        housingRating: clean.hasHousing && clean.housingRating >= 1 && clean.housingRating <= 5
          ? clean.housingRating : null,
        salaryAccurate: clean.salaryAccurate,
        wouldRecommend: clean.wouldRecommend,
        comment:        clean.comment || null,
        submittedAt:    clean.submittedAt || null,
      },
    });

    return NextResponse.json(
      { success: true, message: "Experience recorded. Thank you!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/experiences]", err);
    return NextResponse.json({ error: "Failed to save experience" }, { status: 500 });
  }
}

// ─── GET — real count from database ──────────────────────────────────────────

export async function GET() {
  try {
    const count = await db.workerExperience.count();
    return NextResponse.json(
      { count, message: "Worker experiences recorded" },
      {
        status:  200,
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      }
    );
  } catch (err) {
    console.error("[GET /api/experiences]", err);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
