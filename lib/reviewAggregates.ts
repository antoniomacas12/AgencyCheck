/**
 * lib/reviewAggregates.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * AgencyCheck — Review Aggregation Engine
 *
 * THE CENTRAL DATA LAYER FOR THE SEO PIPELINE.
 *
 * Merges two data sources:
 *   1. REVIEW_SEED_DATA — curated historical reviews (always present, static)
 *   2. Prisma DB — live user-submitted published reviews
 *
 * Results are cached with Next.js `unstable_cache` (5-minute TTL).
 * Every page that shows review-derived data should import from here.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  Data flow:                                                     │
 * │  New review submitted                                           │
 * │       ↓                                                         │
 * │  Admin approves → isPublished = true                           │
 * │       ↓                                                         │
 * │  Cache TTL expires (5 min) → next request recomputes           │
 * │       ↓                                                         │
 * │  All pages using getAgencyAggregates() see updated data        │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * IMPORTANT: Never import this in client components — server only.
 */

import { unstable_cache } from "next/cache";
import { prisma }         from "@/lib/prisma";
import { REVIEW_SEED_DATA } from "@/lib/reviewData";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IssueBreakdown {
  tag:   string;
  count: number;
  pct:   number; // 0–100, rounded
  label: string; // human-readable label for display
}

/**
 * ReviewAggregate — all derived stats for one entity (agency | city | jobType).
 *
 * averages are null when fewer than 3 reviews exist (not statistically useful).
 * lastReviewAt drives sitemap lastModified dates.
 */
export interface ReviewAggregate {
  entityType:       "agency" | "city" | "jobType" | "global";
  entityKey:        string;   // slug, city name, or job type slug
  reviewCount:      number;
  verifiedCount:    number;
  avgOverall:       number | null;
  avgSalary:        number | null;
  avgHousing:       number | null;  // null if no housing reviews
  avgManagement:    number | null;
  avgContract:      number | null;
  positivePct:      number | null;  // % rating 4–5
  negativePct:      number | null;  // % rating 1–2
  recommendPct:     number | null;  // % wouldRecommend === "YES"
  topIssues:        IssueBreakdown[];
  issueCount:       number;         // total unique issue-tag occurrences
  lastReviewAt:     Date | null;    // for sitemap lastmod
  // Salary specific
  avgSalaryRating:  number | null;  // salary satisfaction rating (1–5)
}

// ─── Issue tag label map ──────────────────────────────────────────────────────

const ISSUE_LABELS: Record<string, string> = {
  payslip_errors:      "Payslip errors",
  missing_overtime:    "Missing overtime",
  late_salary:         "Late salary payment",
  housing_crowded:     "Overcrowded housing",
  housing_dirty:       "Poor housing conditions",
  unclear_contract:    "Unclear contract",
  communication_poor:  "Poor communication",
  management_poor:     "Poor management",
  transport_delays:    "Transport delays",
  fair_pay:            "Fair pay reported",
  housing_good:        "Good housing reported",
  housing_clean:       "Clean housing reported",
  transport_good:      "Transport works well",
  fair_contract:       "Clear contract",
  communication_good:  "Good communication",
  overtime_paid:       "Overtime correctly paid",
  payslip_ok:          "Accurate payslips",
};

function issueLabel(tag: string): string {
  return ISSUE_LABELS[tag] ?? tag.replace(/_/g, " ");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avg(nums: number[]): number | null {
  if (nums.length < 3) return null;
  return Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 10) / 10;
}

function pct(count: number, total: number): number | null {
  if (total === 0) return null;
  return Math.round((count / total) * 100);
}

/** Parse the JSON-encoded issueTags string stored in the DB. */
function parseTags(raw: string | string[] | null | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
}

/** Compute IssueBreakdown[] from a flat array of tag arrays. */
function computeIssues(allTags: string[][]): IssueBreakdown[] {
  const counts = new Map<string, number>();
  for (const tags of allTags) {
    for (const tag of tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  const total = allTags.length;
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({
      tag,
      count,
      pct:   Math.round((count / Math.max(total, 1)) * 100),
      label: issueLabel(tag),
    }));
}

// ─── Seed-only helpers (synchronous, no DB) ───────────────────────────────────

/**
 * Compute aggregates purely from REVIEW_SEED_DATA for a given filter.
 * Used as fallback when the DB is unavailable.
 */
function computeSeedAggregate(
  entityType: ReviewAggregate["entityType"],
  entityKey:  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter:     (r: any) => boolean,
): ReviewAggregate {
  const reviews = REVIEW_SEED_DATA.filter(filter);
  const n = reviews.length;
  if (n === 0) return emptyAggregate(entityType, entityKey);

  const overalls    = reviews.map((r) => r.overallRating);
  const salaryRates = reviews.map((r) => r.salaryRating);
  const housingRaw  = reviews.filter((r) => r.housingRating != null).map((r) => r.housingRating as number);
  const mgmtRates   = reviews.map((r) => r.managementRating);
  const contRates   = reviews.map((r) => r.contractClarityRating);

  const positives = reviews.filter((r) => r.overallRating >= 4).length;
  const negatives = reviews.filter((r) => r.overallRating <= 2).length;
  const recommends = reviews.filter((r) => (r as { wouldRecommend?: string }).wouldRecommend === "YES").length;
  const verified  = reviews.filter((r) => r.verificationStatus === "VERIFIED").length;

  const allTags   = reviews.map((r) => parseTags(r.issueTags));
  const issueList = computeIssues(allTags);

  const dates = reviews
    .map((r) => r.createdAt ? new Date(r.createdAt) : null)
    .filter(Boolean) as Date[];
  const lastAt = dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : null;

  return {
    entityType,
    entityKey,
    reviewCount:     n,
    verifiedCount:   verified,
    avgOverall:      avg(overalls),
    avgSalary:       null,
    avgSalaryRating: avg(salaryRates),
    avgHousing:      housingRaw.length >= 3 ? avg(housingRaw) : null,
    avgManagement:   avg(mgmtRates),
    avgContract:     avg(contRates),
    positivePct:     pct(positives, n),
    negativePct:     pct(negatives, n),
    recommendPct:    pct(recommends, n),
    topIssues:       issueList,
    issueCount:      allTags.flat().length,
    lastReviewAt:    lastAt,
  };
}

function emptyAggregate(entityType: ReviewAggregate["entityType"], entityKey: string): ReviewAggregate {
  return {
    entityType, entityKey,
    reviewCount: 0, verifiedCount: 0,
    avgOverall: null, avgSalary: null, avgSalaryRating: null,
    avgHousing: null, avgManagement: null, avgContract: null,
    positivePct: null, negativePct: null, recommendPct: null,
    topIssues: [], issueCount: 0, lastReviewAt: null,
  };
}

// ─── DB + seed merge ──────────────────────────────────────────────────────────

/**
 * Merge seed reviews (historical) with DB reviews (live) for an agency.
 * The combined pool drives all aggregates.
 */
async function mergeAgencyReviews(agencySlug: string) {
  // Seed reviews for this agency
  const seed = REVIEW_SEED_DATA.filter((r) => r.agencySlug === agencySlug);

  // DB reviews
  let dbRows: Array<{
    overallRating:        number;
    salaryRating:         number;
    housingRating:        number | null;
    managementRating:     number;
    contractClarityRating: number;
    issueTags:            string;
    verificationStatus:   string;
    wouldRecommend:       string;
    createdAt:            Date;
  }> = [];

  try {
    dbRows = await db.review.findMany({
      where:  { agency: { slug: agencySlug }, isPublished: true },
      select: {
        overallRating: true, salaryRating: true, housingRating: true,
        managementRating: true, contractClarityRating: true,
        issueTags: true, verificationStatus: true, wouldRecommend: true,
        createdAt: true,
      },
    });
  } catch {
    // DB unavailable — seed only
  }

  return { seed, dbRows };
}

// ─── Per-agency aggregate ─────────────────────────────────────────────────────

async function computeAgencyAggregates(agencySlug: string): Promise<ReviewAggregate> {
  const { seed, dbRows } = await mergeAgencyReviews(agencySlug);

  // Normalise to unified shape
  type Row = { overallRating: number; salaryRating: number; housingRating: number | null;
               managementRating: number; contractClarityRating: number; issueTags: string | string[];
               verificationStatus: string; wouldRecommend?: string; createdAt?: string | Date };

  const all: Row[] = [
    ...seed.map((r) => ({
      overallRating:         r.overallRating,
      salaryRating:          r.salaryRating,
      housingRating:         r.housingRating ?? null,
      managementRating:      r.managementRating,
      contractClarityRating: r.contractClarityRating,
      issueTags:             r.issueTags,
      verificationStatus:    r.verificationStatus,
      wouldRecommend:        (r as { wouldRecommend?: string }).wouldRecommend,
      createdAt:             r.createdAt ?? new Date().toISOString(),
    })),
    ...dbRows.map((r) => ({ ...r })),
  ];

  const n = all.length;
  if (n === 0) return emptyAggregate("agency", agencySlug);

  const verified   = all.filter((r) => r.verificationStatus === "VERIFIED").length;
  const overalls   = all.map((r) => r.overallRating);
  const salRates   = all.map((r) => r.salaryRating);
  const houRaw     = all.filter((r) => r.housingRating != null).map((r) => r.housingRating as number);
  const mgmtRates  = all.map((r) => r.managementRating);
  const contRates  = all.map((r) => r.contractClarityRating);
  const positives  = all.filter((r) => r.overallRating >= 4).length;
  const negatives  = all.filter((r) => r.overallRating <= 2).length;
  const recommends = all.filter((r) => r.wouldRecommend === "YES").length;
  const allTags    = all.map((r) => parseTags(r.issueTags));

  const dates = all
    .map((r) => r.createdAt ? new Date(r.createdAt as string) : null)
    .filter(Boolean) as Date[];
  const lastAt = dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : null;

  return {
    entityType:      "agency",
    entityKey:       agencySlug,
    reviewCount:     n,
    verifiedCount:   verified,
    avgOverall:      avg(overalls),
    avgSalary:       null,
    avgSalaryRating: avg(salRates),
    avgHousing:      houRaw.length >= 3 ? avg(houRaw) : null,
    avgManagement:   avg(mgmtRates),
    avgContract:     avg(contRates),
    positivePct:     pct(positives, n),
    negativePct:     pct(negatives, n),
    recommendPct:    pct(recommends, n),
    topIssues:       computeIssues(allTags),
    issueCount:      allTags.flat().length,
    lastReviewAt:    lastAt,
  };
}

// ─── Cached public exports ────────────────────────────────────────────────────

/**
 * getAgencyAggregates(slug)
 *
 * Returns merged seed + DB review stats for one agency.
 * Cached for 5 minutes. Call from server components and generateMetadata().
 *
 * @example
 *   const agg = await getAgencyAggregates("covebo");
 *   agg.reviewCount   // total including seed
 *   agg.avgOverall    // null if < 3 reviews
 *   agg.topIssues     // sorted by frequency
 *   agg.lastReviewAt  // for sitemap lastmod
 */
export function getAgencyAggregates(slug: string): Promise<ReviewAggregate> {
  return unstable_cache(
    () => computeAgencyAggregates(slug),
    [`agency-agg-${slug}`],
    { revalidate: 300 },
  )();
}

/**
 * getCityAggregates(city)
 *
 * Returns merged review stats for all reviews where city = city.
 * Cached for 10 minutes.
 */
export function getCityAggregates(city: string): Promise<ReviewAggregate> {
  const normCity = city.toLowerCase().trim();
  return unstable_cache(
    () => computeSeedAggregateAsync("city", normCity, (r) =>
      (r.city ?? "").toLowerCase() === normCity
    ),
    [`city-agg-${normCity}`],
    { revalidate: 600 },
  )();
}

/**
 * getJobTypeAggregates(jobType)
 *
 * Returns review stats for all reviews where jobType matches.
 * Cached for 10 minutes.
 */
export function getJobTypeAggregates(jobType: string): Promise<ReviewAggregate> {
  const norm = jobType.toLowerCase().trim();
  return unstable_cache(
    () => computeSeedAggregateAsync("jobType", norm, (r) =>
      (r.jobTitle ?? "").toLowerCase().includes(norm) ||
      (r.jobType  ?? "").toLowerCase().includes(norm)
    ),
    [`jobtype-agg-${norm}`],
    { revalidate: 600 },
  )();
}

/**
 * getGlobalAggregates()
 *
 * Returns stats across all reviews. Cached for 5 minutes.
 */
export function getGlobalAggregates(): Promise<ReviewAggregate> {
  return unstable_cache(
    () => computeSeedAggregateAsync("global", "all", () => true),
    [`global-agg`],
    { revalidate: 300 },
  )();
}

/** Async wrapper so city/jobType functions can be used with unstable_cache. */
async function computeSeedAggregateAsync(
  entityType: ReviewAggregate["entityType"],
  entityKey:  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter:     (r: any) => boolean,
): Promise<ReviewAggregate> {
  // TODO: extend to merge DB rows like computeAgencyAggregates does
  return computeSeedAggregate(entityType, entityKey, filter);
}

// ─── Sitemap lastmod helper ───────────────────────────────────────────────────

/**
 * getLastReviewDates()
 *
 * Returns a map of { agencySlug → ISO date string } for the most recent
 * published review per agency. Used by sitemap.ts to set lastModified.
 *
 * Falls back to an empty map if the DB is unavailable.
 */
export async function getLastReviewDates(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const rows: Array<{ agencySlug: string; maxDate: Date }> = await db.$queryRaw`
      SELECT a.slug AS "agencySlug", MAX(r."createdAt") AS "maxDate"
      FROM reviews r
      JOIN agencies a ON r."agencyId" = a.id
      WHERE r."isPublished" = true
      GROUP BY a.slug
    `;
    for (const row of rows) {
      map.set(row.agencySlug, new Date(row.maxDate).toISOString().split("T")[0]);
    }
  } catch {
    // DB unavailable — caller falls back to static date
  }
  return map;
}

/**
 * getLastCityReviewDates()
 *
 * Returns a map of { citySlug → ISO date string } for the most recent
 * published review in each city. Used by sitemap.ts.
 */
export async function getLastCityReviewDates(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const rows: Array<{ city: string; maxDate: Date }> = await db.$queryRaw`
      SELECT LOWER(TRIM(r.city)) AS "city", MAX(r."createdAt") AS "maxDate"
      FROM reviews r
      WHERE r."isPublished" = true AND r.city IS NOT NULL AND r.city != ''
      GROUP BY LOWER(TRIM(r.city))
    `;
    for (const row of rows) {
      if (row.city) map.set(row.city, new Date(row.maxDate).toISOString().split("T")[0]);
    }
  } catch {
    // DB unavailable
  }
  return map;
}
