/**
 * POST /api/admin/reviews/[id]/approve
 * Moves review to APPROVED (not yet public).
 * Uses Prisma ORM — no raw SQL, no SQL injection risk.
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

  const body = await req.json().catch(() => ({}));

  const existing = await db.review.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {
    status:      "APPROVED",
    isPublished: false,
    moderatedAt: new Date(),
    moderatedBy: "admin",
  };

  // Safe: Prisma parameterises this — no injection possible
  if (typeof body.internalNotes === "string") {
    data.internalNotes = body.internalNotes.slice(0, 2000);
  }

  await db.review.update({ where: { id: params.id }, data });

  return NextResponse.json({ review: { id: params.id, status: "APPROVED", isPublished: false } });
}
