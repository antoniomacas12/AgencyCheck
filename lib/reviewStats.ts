/**
 * reviewStats.ts — Single source of truth for published review counts.
 *
 * Use these helpers everywhere you need review numbers:
 *   - app/page.tsx (homepage trust strip)
 *   - app/reviews/page.tsx (reviews page server component)
 *   - Any future page that shows review totals
 *
 * DO NOT duplicate `db.review.count({ where: { isPublished: true } })` logic.
 * Import from here instead.
 */

import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export interface ReviewStats {
  total:         number;
  verifiedCount: number;
  anonymousCount: number;
  negativeCount:  number; // 1-2 star ratings
}

/**
 * Returns full review stats from the database.
 * Falls back to zeros if the DB is unavailable (e.g. first deploy before migration).
 */
export async function getPublishedReviewStats(): Promise<ReviewStats> {
  try {
    const [total, verifiedCount, negativeCount] = await Promise.all([
      db.review.count({ where: { isPublished: true } }),
      db.review.count({ where: { isPublished: true, verificationStatus: "VERIFIED" } }),
      db.review.count({ where: { isPublished: true, overallRating: { lte: 2 } } }),
    ]);

    return {
      total,
      verifiedCount,
      anonymousCount: total - verifiedCount,
      negativeCount,
    };
  } catch {
    return { total: 0, verifiedCount: 0, anonymousCount: 0, negativeCount: 0 };
  }
}

/**
 * Returns just the total published review count.
 * Lighter query for places that only need the count.
 */
export async function getPublishedReviewCount(): Promise<number> {
  try {
    return await db.review.count({ where: { isPublished: true } });
  } catch {
    return 0;
  }
}
