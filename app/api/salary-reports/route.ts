import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─── Allowed enum values ──────────────────────────────────────────────────────

const HOUSING_VALUES = ["YES", "NO", "UNKNOWN"] as const;
type HousingValue = (typeof HOUSING_VALUES)[number];

// ─── POST /api/salary-reports ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { agencySlug, jobTitle, city, hourlyPay, housing } = body;

    // Required fields
    if (!agencySlug || typeof agencySlug !== "string") {
      return NextResponse.json(
        { error: "agencySlug is required" },
        { status: 400 }
      );
    }
    if (!jobTitle || typeof jobTitle !== "string" || jobTitle.trim().length === 0) {
      return NextResponse.json(
        { error: "jobTitle is required" },
        { status: 400 }
      );
    }
    if (!city || typeof city !== "string" || city.trim().length === 0) {
      return NextResponse.json(
        { error: "city is required" },
        { status: 400 }
      );
    }
    if (typeof hourlyPay !== "number" || hourlyPay <= 0 || hourlyPay > 200) {
      return NextResponse.json(
        { error: "hourlyPay must be a positive number (max 200)" },
        { status: 400 }
      );
    }
    if (!HOUSING_VALUES.includes(housing as HousingValue)) {
      return NextResponse.json(
        { error: `housing must be one of: ${HOUSING_VALUES.join(", ")}` },
        { status: 400 }
      );
    }

    // Look up agency
    const agency = await prisma.agency.findUnique({
      where: { slug: agencySlug },
      select: { id: true },
    });

    if (!agency) {
      return NextResponse.json({ error: "Agency not found" }, { status: 404 });
    }

    // Create salary report
    const report = await prisma.salaryReport.create({
      data: {
        agencyId:  agency.id,
        jobTitle:  jobTitle.trim().slice(0, 200),
        city:      city.trim().slice(0, 100),
        hourlyPay: Math.round(hourlyPay * 100) / 100, // round to 2dp
        housing:   housing as HousingValue,
      },
    });

    return NextResponse.json(
      { success: true, reportId: report.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/salary-reports]", error);
    return NextResponse.json(
      { error: "Failed to submit salary report. Please try again." },
      { status: 500 }
    );
  }
}
