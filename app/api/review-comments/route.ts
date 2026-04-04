import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeCity } from "@/lib/cityNormalization";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

// ─── Validation helpers ───────────────────────────────────────────────────────

const MAX_BODY_LENGTH    = 2000;
const MAX_AGENCY_LENGTH  = 200;
const MAX_CITY_LENGTH    = 100;

function sanitize(str: string): string {
  return str.trim().replace(/\s+/g, " ");
}

// ─── GET /api/review-comments?reviewId=xxx ────────────────────────────────────
// Returns all comments for a given review, ordered newest-first.

export async function GET(req: NextRequest) {
  const reviewId = req.nextUrl.searchParams.get("reviewId");

  if (!reviewId) {
    return NextResponse.json({ error: "reviewId required" }, { status: 400 });
  }

  try {
    const comments = await db.reviewComment.findMany({
      where:   { reviewId },
      orderBy: { createdAt: "desc" },
      select: {
        id:         true,
        agencyName: true,
        city:       true,
        body:       true,
        createdAt:  true,
      },
    });
    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// ─── POST /api/review-comments ────────────────────────────────────────────────
// Creates a new comment and an admin notification. Publishes immediately.

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { reviewId, agencyName, city, commentText } = body as {
    reviewId?:    unknown;
    agencyName?:  unknown;
    city?:        unknown;
    commentText?: unknown;
  };

  // ── Validate ────────────────────────────────────────────────────────────────
  const errors: Record<string, string> = {};

  if (!reviewId || typeof reviewId !== "string" || !reviewId.trim()) {
    errors.reviewId = "Review reference is required";
  }
  const cleanAgency = typeof agencyName === "string" ? sanitize(agencyName) : "";
  if (!cleanAgency) {
    errors.agencyName = "Agency name is required";
  } else if (cleanAgency.length > MAX_AGENCY_LENGTH) {
    errors.agencyName = `Agency name must be under ${MAX_AGENCY_LENGTH} characters`;
  }

  const cleanCity = typeof city === "string" ? sanitize(city) : "";
  if (!cleanCity) {
    errors.city = "City is required";
  } else if (cleanCity.length > MAX_CITY_LENGTH) {
    errors.city = `City must be under ${MAX_CITY_LENGTH} characters`;
  }

  const cleanBody = typeof commentText === "string" ? sanitize(commentText) : "";
  if (!cleanBody) {
    errors.commentText = "Comment is required";
  } else if (cleanBody.length > MAX_BODY_LENGTH) {
    errors.commentText = `Comment must be under ${MAX_BODY_LENGTH} characters`;
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  // ── Verify review exists ────────────────────────────────────────────────────
  try {
    const review = await db.review.findUnique({
      where:  { id: reviewId as string },
      select: { id: true, agencyId: true, city: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // ── Bump review lastActivityAt so it floats to the top ─────────────────
    await db.review.update({
      where: { id: reviewId as string },
      data:  { lastActivityAt: new Date() },
    });

    // ── Create comment ──────────────────────────────────────────────────────
    const comment = await db.reviewComment.create({
      data: {
        reviewId:   reviewId as string,
        agencyName: cleanAgency,
        city:       cleanCity,
        body:       cleanBody,
      },
      select: {
        id:         true,
        agencyName: true,
        city:       true,
        body:       true,
        createdAt:  true,
      },
    });

    // ── Upsert agency city mention ──────────────────────────────────────────
    const cityNorm = normalizeCity(cleanCity);
    await db.agencyCityMention.upsert({
      where: {
        agencyId_cityNormalized: {
          agencyId:       review.agencyId,
          cityNormalized: cityNorm,
        },
      },
      update: {
        mentionCount: { increment: 1 },
        lastSeenAt:   new Date(),
      },
      create: {
        agencyId:       review.agencyId,
        cityNormalized: cityNorm,
        cityDisplay:    cleanCity,
        mentionCount:   1,
      },
    });

    // ── Create admin notification ───────────────────────────────────────────
    const preview = cleanBody.length > 120 ? cleanBody.slice(0, 120) + "…" : cleanBody;
    await db.adminNotification.create({
      data: {
        type:  "review_comment",
        title: "New review comment",
        metadata: JSON.stringify({
          reviewId:   review.id,
          agencyId:   review.agencyId,
          agencyName: cleanAgency,
          city:       cleanCity,
          preview,
        }),
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
  }
}
