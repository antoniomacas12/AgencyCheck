// AgencyCheck — Score Logic
// Pure formula functions. No DB calls, no side effects.
// Replace ReviewInput with real Prisma data when DB is connected.

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewInput {
  salaryRating:     number;
  managementRating: number;
  housingRating:    number | null;
}

export interface ScoreBreakdown {
  base:                    100;
  negativeReviewCount:     number;
  negativeReviewDeduction: number; // negativeReviewCount × 2
  openIssueCount:          number;
  issueDeduction:          number; // openIssueCount × 3
  housingPenalty:          boolean;
  housingDeduction:        number; // 0 or 1
  total:                   number; // floored at 20
}

// ─── Core formula ─────────────────────────────────────────────────────────────

/**
 * Calculate agency score from reviews and issue counts.
 *
 * Formula:
 *   start at 100
 *   − 2 for each negative review (salaryRating ≤ 2 OR managementRating ≤ 2)
 *   − 3 for each open verified issue report
 *   − 1 if average housing rating < 3
 *   floor at 20
 */
export function calculateScore(
  reviews:          ReviewInput[],
  openIssueCount:   number,
  avgHousingRating: number | null,
): ScoreBreakdown {
  const negativeReviewCount = reviews.filter(
    (r) => r.salaryRating <= 2 || r.managementRating <= 2
  ).length;

  const negativeReviewDeduction = negativeReviewCount * 2;
  const issueDeduction          = openIssueCount * 3;
  const housingPenalty          = avgHousingRating !== null && avgHousingRating < 3;
  const housingDeduction        = housingPenalty ? 1 : 0;

  const total = Math.max(
    100 - negativeReviewDeduction - issueDeduction - housingDeduction,
    20,
  );

  return {
    base:                    100,
    negativeReviewCount,
    negativeReviewDeduction,
    openIssueCount,
    issueDeduction,
    housingPenalty,
    housingDeduction,
    total,
  };
}

/**
 * Lightweight overload: compute score total from pre-aggregated stats.
 * Used for static agency data and Prisma aggregate queries.
 */
export function scoreFromStats(
  negativeReviewCount: number,
  openIssueCount:      number,
  avgHousingRating:    number | null,
): number {
  const housingPenalty = avgHousingRating !== null && avgHousingRating < 3 ? 1 : 0;
  return Math.max(
    100 - (negativeReviewCount * 2) - (openIssueCount * 3) - housingPenalty,
    20,
  );
}

// ─── Score label helpers ──────────────────────────────────────────────────────

export type ScoreTier = "great" | "fair" | "poor";

export function getScoreTier(score: number): ScoreTier {
  if (score >= 80) return "great";
  if (score >= 60) return "fair";
  return "poor";
}

export const SCORE_TIER_CONFIG = {
  great: {
    label:      "Great",
    bg:         "bg-green-100",
    text:       "text-green-700",
    ring:       "ring-green-200",
    bar:        "bg-green-500",
    barBg:      "bg-green-100",
  },
  fair: {
    label:      "Fair",
    bg:         "bg-yellow-100",
    text:       "text-yellow-700",
    ring:       "ring-yellow-200",
    bar:        "bg-yellow-400",
    barBg:      "bg-yellow-100",
  },
  poor: {
    label:      "Poor",
    bg:         "bg-red-100",
    text:       "text-red-600",
    ring:       "ring-red-200",
    bar:        "bg-red-400",
    barBg:      "bg-red-100",
  },
} satisfies Record<ScoreTier, {
  label: string; bg: string; text: string; ring: string; bar: string; barBg: string;
}>;
