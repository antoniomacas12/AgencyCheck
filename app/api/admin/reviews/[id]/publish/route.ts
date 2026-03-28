/**
 * POST /api/admin/reviews/[id]/publish
 * body: { publish: true }  → set status=PUBLISHED, isPublished=true
 * body: { publish: false } → set status=APPROVED,  isPublished=false
 * Cannot publish a PENDING or REJECTED review.
 * Uses Prisma ORM — no raw SQL.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  const ok = await verifyAdminRequest();
  if (!ok) return unauthorizedJson();

  const body          = await req.json().catch(() => ({}));
  const shouldPublish = body.publish !== false;

  const existing = await db.review.findUnique({
    where:  { id: params.id },
    select: { id: true, status: true },
  });
  if (!existing) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  if (shouldPublish && (existing.status === "PENDING" || existing.status === "REJECTED")) {
    return NextResponse.json(
      { error: `Cannot publish a ${existing.status.toLowerCase()} review. Approve it first.` },
      { status: 400 }
    );
  }

  const newStatus = shouldPublish ? "PUBLISHED" : "APPROVED";

  await db.review.update({
    where: { id: params.id },
    data:  {
      status:      newStatus,
      isPublished: shouldPublish,
      moderatedAt: new Date(),
      moderatedBy: "admin",
    },
  });

  return NextResponse.json({ review: { id: params.id, status: newStatus, isPublished: shouldPublish } });
}
