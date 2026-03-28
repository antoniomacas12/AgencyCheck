import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ─── Allowed enum values ──────────────────────────────────────────────────────

const ISSUE_TYPES = [
  "MISSING_OVERTIME",
  "MISSING_SUNDAY_PAY",
  "LATE_PAYMENT",
  "BAD_HOUSING",
  "CONTRACT_ISSUE",
  "TRANSPORT_ISSUE",
  "PAYSLIP_PROBLEM",
] as const;

type IssueTypeValue = (typeof ISSUE_TYPES)[number];

// ─── POST /api/issue-reports ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { agencySlug, issueType, description, amountMissing } = body;

    // Required fields
    if (!agencySlug || typeof agencySlug !== "string") {
      return NextResponse.json(
        { error: "agencySlug is required" },
        { status: 400 }
      );
    }
    if (!ISSUE_TYPES.includes(issueType as IssueTypeValue)) {
      return NextResponse.json(
        { error: `issueType must be one of: ${ISSUE_TYPES.join(", ")}` },
        { status: 400 }
      );
    }
    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length < 10
    ) {
      return NextResponse.json(
        { error: "description must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Optional: amount missing
    let cleanAmount: number | null = null;
    if (amountMissing !== null && amountMissing !== undefined) {
      const parsed = parseFloat(amountMissing);
      if (!isNaN(parsed) && parsed > 0) {
        cleanAmount = Math.round(parsed * 100) / 100;
      }
    }

    // Look up agency
    const agency = await prisma.agency.findUnique({
      where: { slug: agencySlug },
      select: { id: true },
    });

    if (!agency) {
      return NextResponse.json({ error: "Agency not found" }, { status: 404 });
    }

    // Create issue report
    const report = await prisma.issueReport.create({
      data: {
        agencyId:     agency.id,
        issueType:    issueType as IssueTypeValue,
        description:  description.trim().slice(0, 3000),
        amountMissing: cleanAmount,
        status:       "OPEN",
      },
    });

    return NextResponse.json(
      { success: true, reportId: report.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/issue-reports]", error);
    return NextResponse.json(
      { error: "Failed to submit issue report. Please try again." },
      { status: 500 }
    );
  }
}
