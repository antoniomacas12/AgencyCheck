/**
 * POST /api/housing-photos
 *
 * Accepts worker-submitted housing condition reports (rating, description, optional photo URL, city).
 * Saves to the database as a Review row with housing-specific fields, status=PENDING.
 * Admin can view and moderate these through the standard /admin/reviews panel.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agencySlug, rating, description, photoLink, city } = body as Record<string, unknown>;

    // Validation
    if (!agencySlug || typeof agencySlug !== "string") {
      return NextResponse.json({ error: "agencySlug is required" }, { status: 400 });
    }
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "rating must be a number between 1 and 5" }, { status: 400 });
    }
    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json({ error: "description is required (min 10 characters)" }, { status: 400 });
    }

    // Look up agency
    const agency = await db.agency.findUnique({
      where:  { slug: agencySlug.trim() },
      select: { id: true, name: true },
    });

    if (!agency) {
      // Agency not in DB — still save the report; store agency slug as the title
      // We'll create a placeholder review attached to the first agency if none exists,
      // otherwise we reject gracefully.
      return NextResponse.json({ error: "Agency not found" }, { status: 404 });
    }

    // Sanitise inputs
    const cleanDescription = description.trim().slice(0, 2000).replace(/<[^>]*>/g, "");
    const cleanCity        = typeof city === "string" ? city.trim().slice(0, 80) : null;
    const cleanPhotoLink   = typeof photoLink === "string" && photoLink.startsWith("http")
      ? photoLink.trim().slice(0, 500)
      : null;

    // Append photo link to description if provided (stored in comment field)
    const fullComment = cleanPhotoLink
      ? `${cleanDescription}\n\n📸 Photo: ${cleanPhotoLink}`
      : cleanDescription;

    const housingRating = Math.round(rating);
    const overallRating = housingRating;

    // Save as a Review with housing context
    const review = await db.review.create({
      data: {
        agencyId:             agency.id,
        reviewType:           "ANONYMOUS",
        workerStatus:         "UNKNOWN",
        city:                 cleanCity,
        title:                "Housing condition report",
        overallRating,
        salaryRating:         3,          // neutral default — worker only rated housing
        managementRating:     3,
        contractClarityRating: 3,
        housingRating,
        accommodationProvided: "YES",     // they're reporting on housing they have/had
        roomType:             "UNKNOWN",
        wouldRecommend:       "UNSURE",
        comment:              fullComment,
        issueTags:            JSON.stringify([]),
        verificationStatus:   "WORKER_REPORTED",
        sourceType:           "WORKER_REPORTED",
        status:               "PENDING",
        isPublished:          false,
      },
    });

    return NextResponse.json({ success: true, reviewId: review.id }, { status: 201 });

  } catch (err) {
    console.error("[POST /api/housing-photos]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
