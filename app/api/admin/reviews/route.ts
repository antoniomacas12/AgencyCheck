/**
 * GET /api/admin/reviews
 * Admin-only paginated list of reviews with optional status/agency filter.
 * Uses Prisma ORM — PostgreSQL (Supabase), no raw SQL, no SQL injection risk.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const VALID_STATUSES = new Set(["PENDING", "APPROVED", "REJECTED", "PUBLISHED"]);

export async function GET(req: NextRequest) {
  const ok = await verifyAdminRequest();
  if (!ok) return unauthorizedJson();

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status") ?? "";
  const agencySlug   = searchParams.get("agencySlug") ?? "";
  const page         = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize     = 30;
  const offset       = (page - 1) * pageSize;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};
  if (statusFilter && VALID_STATUSES.has(statusFilter)) where.status = statusFilter;
  if (agencySlug) where.agency = { slug: agencySlug };

  const [reviews, total] = await Promise.all([
    db.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip:    offset,
      take:    pageSize,
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
          select:  { id: true, fileUrl: true, fileType: true, sortOrder: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
    db.review.count({ where }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enriched = reviews.map((r: any) => ({
    ...r,
    _count: { photos: (r.photos ?? []).length },
  }));

  return NextResponse.json({
    reviews: enriched,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}
