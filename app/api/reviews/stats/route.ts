/**
 * GET /api/reviews/stats
 * Returns live published review counts for client-side polling.
 * Used by ReviewsClientPage to keep totals fresh without a full page reload.
 */

import { NextResponse } from "next/server";
import { getPublishedReviewStats } from "@/lib/reviewStats";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getPublishedReviewStats();
  return NextResponse.json(stats);
}
