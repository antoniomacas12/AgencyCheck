/**
 * GET /api/admin/reviews/stats
 * Returns a lightweight summary of review counts for the admin nav badge.
 * Admin-auth protected. Returns quickly — used for polling every 30 seconds.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest, unauthorizedJson } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET() {
  const ok = await verifyAdminRequest();
  if (!ok) return unauthorizedJson();

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [total, newLast24h] = await Promise.all([
    db.review.count(),
    db.review.count({ where: { createdAt: { gte: since24h } } }),
  ]);

  return NextResponse.json({ total, newLast24h });
}
