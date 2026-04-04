/**
 * GET    /api/admin/reviews/[id]  — full review detail
 * PATCH  /api/admin/reviews/[id]  — update internal notes
 * DELETE /api/admin/reviews/[id]  — permanently remove review
 * Uses Prisma ORM — PostgreSQL (Supabase), no raw SQL.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const ok = await verifyAdminRequest();
  if (!ok) return unauthorizedJson();

  const review = await db.review.findUnique({
    where:  { id: params.id },
    select: {
      id:                    true,
      status:                true,
      isPublished:           true,
      internalNotes:         true,
      moderatedAt:           true,
      moderatedBy:           true,
      reviewType:            true,
      workerStatus:          true,
      experiencePeriod:      true,
      jobType:               true,
      jobTitle:              true,
      city:                  true,
      title:                 true,
      overallRating:         true,
      salaryRating:          true,
      housingRating:         true,
      managementRating:      true,
      contractClarityRating: true,
      transportRating:       true,
      salaryAccuracyRating:  true,
      accommodationProvided: true,
      roomType:              true,
      weeklyRent:            true,
      peopleInHouse:         true,
      wouldRecommend:        true,
      comment:               true,
      issueTags:             true,
      verificationStatus:    true,
      sourceType:            true,
      createdAt:             true,
      agency: { select: { id: true, name: true, slug: true } },
      photos: {
        select:  { id: true, fileUrl: true, fileType: true, caption: true, sortOrder: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  return NextResponse.json({ review });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const ok = await verifyAdminRequest();
  if (!ok) return unauthorizedJson();

  const body = await req.json().catch(() => ({}));

  if (typeof body.internalNotes !== "string") {
    return NextResponse.json({ error: "internalNotes (string) required" }, { status: 400 });
  }

  const existing = await db.review.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  const updated = await db.review.update({
    where: { id: params.id },
    data:  { internalNotes: body.internalNotes.slice(0, 2000) },
    select: { id: true, internalNotes: true },
  });

  return NextResponse.json({ review: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const ok = await verifyAdminRequest();
  if (!ok) return unauthorizedJson();

  const existing = await db.review.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  await db.review.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true, deleted: params.id });
}
