/**
 * lib/seoPipeline.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * AgencyCheck — Automatic SEO Pipeline
 *
 * PURPOSE
 * ───────
 * Turn every new user review into automatic SEO improvements with NO generic
 * filler content. All output is grounded in real stored data and metrics.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ARCHITECTURE — what happens when a new review is submitted & approved
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌── INSTANT (within 5 min, next cache expiry) ────────────────────────┐
 * │                                                                      │
 * │  • Agency page review count badge                                   │
 * │  • Agency page average ratings (overall, salary, housing, mgmt)     │
 * │  • Agency page top-issues section                                   │
 * │  • Agency page JSON-LD AggregateRating schema                       │
 * │  • Agency page meta description (updated rating/count)              │
 * │  • Reviews page global stats (total, verified, sentiment split)      │
 * │  • City page review count and sentiment (if city field is set)      │
 * │  • Sitemap lastModified date for that agency's URL                  │
 * │                                                                      │
 * │  HOW: getAgencyAggregates() is cached for 5 min via unstable_cache. │
 * │  On the next page request after cache expiry, fresh data is served. │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * ┌── AFTER THRESHOLD (triggered by review count crossing a threshold) ──┐
 * │                                                                      │
 * │  AGENCY ENRICHMENT (≥ 3 reviews)                                    │
 * │  • Agency page gains a full "Worker Verdict" section with           │
 * │    data-driven prose: positive %, top issues, salary rating         │
 * │  • Agency page JSON-LD gains a real AggregateRating value          │
 * │  • Agency meta description updated to include review count          │
 * │                                                                      │
 * │  CITY SEO SECTION (≥ 5 reviews mentioning that city)               │
 * │  • City page gains a "Worker Experiences" summary block             │
 * │  • City page gains city-specific FAQ items from review patterns     │
 * │                                                                      │
 * │  GUIDE CANDIDATE (≥ 8 reviews with the same issue tag)             │
 * │  • A flag is raised in seoPipeline logs                             │
 * │  • The guide can then be manually created via guideData.ts          │
 * │  • This prevents auto-generating thin AI guides                     │
 * │                                                                      │
 * │  HOW: checkThreshold*() functions below. Called in generateMetadata │
 * │  and page components. No cron jobs required.                        │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * ┌── NEVER auto-created ────────────────────────────────────────────────┐
 * │                                                                      │
 * │  • New guide pages (always manually written via guideData.ts)       │
 * │  • New agency pages (created from verified dataset only)            │
 * │  • New city hub pages (require ≥ 2 verified agencies)              │
 * │                                                                      │
 * │  WHY: Low-quality auto-generated pages harm rankings more than they │
 * │  help. Thresholds enforce content quality before indexing.          │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPORTS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  SEO_THRESHOLDS                      — named threshold constants
 *  checkAgencyEnrichmentThreshold()    — agency has enough reviews for full section
 *  checkCitySectionThreshold()         — city has enough reviews for a section
 *  checkGuideCandidateThreshold()      — issue appears enough to warrant a guide
 *  generateAgencyMeta()                — dynamic Metadata object from real data
 *  generateCityMeta()                  — dynamic Metadata object for city pages
 *  buildAgencySummary()                — data-driven prose paragraph, no filler
 *  buildCitySummary()                  — data-driven prose for city review section
 *  buildIssueSummary()                 — one sentence per issue tag
 *  generateAgencySchemaRating()        — JSON-LD AggregateRating from aggregates
 *  getCandidateGuideTopics()           — issue tags that have crossed guide threshold
 */

import type { Metadata } from "next";
import type { ReviewAggregate, IssueBreakdown } from "@/lib/reviewAggregates";

// ─── Threshold constants ──────────────────────────────────────────────────────

/**
 * SEO_THRESHOLDS — single source of truth for all content-quality gates.
 *
 * Adjust these when the dataset grows. Lowering thresholds risks thin content;
 * raising them loses SEO value from real data you already have.
 */
export const SEO_THRESHOLDS = {
  /** Minimum reviews for an agency page to render its "Worker Verdict" section. */
  AGENCY_ENRICHMENT:     3,

  /** Minimum reviews mentioning a city before that city's page gets a
   *  "Worker Experiences" summary section. */
  CITY_SECTION:          5,

  /** Minimum reviews sharing the same issue tag before a guide page
   *  is recommended for that topic. */
  GUIDE_CANDIDATE:       8,

  /** Minimum reviews with housing data before showing housing avg rating. */
  HOUSING_STATS_MIN:     3,

  /** Minimum reviews before displaying % statistics (to avoid misleading
   *  "100% positive" from a single review). */
  STATS_DISPLAY_MIN:     4,
} as const;

// ─── Threshold checks ─────────────────────────────────────────────────────────

/**
 * checkAgencyEnrichmentThreshold
 *
 * Returns true when an agency has enough published reviews to show the
 * full "Worker Verdict" section with real statistics.
 *
 * At < AGENCY_ENRICHMENT reviews, only a stub is shown ("Be the first to review").
 * At ≥ AGENCY_ENRICHMENT reviews, the full data-driven section appears.
 */
export function checkAgencyEnrichmentThreshold(agg: ReviewAggregate): boolean {
  return agg.reviewCount >= SEO_THRESHOLDS.AGENCY_ENRICHMENT;
}

/**
 * checkCitySectionThreshold
 *
 * Returns true when a city has enough reviews to warrant a "Worker Experiences"
 * summary section on its city hub page.
 */
export function checkCitySectionThreshold(agg: ReviewAggregate): boolean {
  return agg.reviewCount >= SEO_THRESHOLDS.CITY_SECTION;
}

/**
 * getCandidateGuideTopics
 *
 * Scans the top issues of a ReviewAggregate and returns any issue tags
 * whose count reaches the GUIDE_CANDIDATE threshold.
 *
 * Use this in admin dashboards or logging to identify guide-worthy topics.
 * Returns issue slugs like ["payslip_errors", "missing_overtime"].
 *
 * @example
 *   const topics = getCandidateGuideTopics(globalAgg);
 *   // → ["missing_overtime"] if 8+ reviews mention it globally
 */
export function getCandidateGuideTopics(agg: ReviewAggregate): string[] {
  return agg.topIssues
    .filter((issue) => issue.count >= SEO_THRESHOLDS.GUIDE_CANDIDATE)
    .map((issue) => issue.tag);
}

// ─── Dynamic metadata generation ─────────────────────────────────────────────

/**
 * generateAgencyMeta
 *
 * Produces a full Next.js Metadata object for an agency page.
 * The title and description are dynamically built from real review data
 * when enough reviews exist; otherwise falls back to static descriptions.
 *
 * @param name     - Agency display name (e.g. "Covebo")
 * @param slug     - Agency URL slug (e.g. "covebo")
 * @param agg      - ReviewAggregate for this agency (from getAgencyAggregates)
 * @param override - Optional partial Metadata to merge on top
 */
export function generateAgencyMeta(
  name:     string,
  slug:     string,
  agg:      ReviewAggregate | null,
  override?: Partial<Metadata>,
): Metadata {
  const enriched = agg && checkAgencyEnrichmentThreshold(agg);

  // Build a data-driven description
  let description: string;
  if (enriched && agg) {
    const parts: string[] = [];
    parts.push(`${agg.reviewCount} worker review${agg.reviewCount !== 1 ? "s" : ""} of ${name} Netherlands.`);
    if (agg.positivePct !== null && agg.reviewCount >= SEO_THRESHOLDS.STATS_DISPLAY_MIN) {
      parts.push(`${agg.positivePct}% positive.`);
    }
    if (agg.avgSalaryRating !== null) {
      parts.push(`Salary rating: ${agg.avgSalaryRating}/5.`);
    }
    const topNeg = agg.topIssues.filter((i) =>
      ["payslip_errors","missing_overtime","housing_crowded","housing_dirty","unclear_contract"].includes(i.tag)
    );
    if (topNeg.length > 0) {
      parts.push(`Common issue: ${topNeg[0].label.toLowerCase()}.`);
    }
    parts.push("Real worker data — AgencyCheck.");
    description = parts.join(" ");
  } else {
    description = `${name} Netherlands review — salary, housing, and worker experiences. Read reviews from agency workers before applying.`;
  }

  // Title
  const title = `${name} Netherlands Review — Salary, Housing, Jobs, Worker Experiences`;

  return {
    title,
    description,
    alternates: { canonical: `/agencies/${slug}` },
    openGraph:  { title, description },
    ...override,
  };
}

/**
 * generateCityMeta
 *
 * Produces a dynamic Metadata object for a city hub page.
 *
 * @param cityName   - Display name (e.g. "Rotterdam")
 * @param citySlug   - URL slug (e.g. "rotterdam")
 * @param agencyCount - Number of verified agencies in this city
 * @param agg        - ReviewAggregate for this city's reviews
 */
export function generateCityMeta(
  cityName:     string,
  citySlug:     string,
  agencyCount:  number,
  agg:          ReviewAggregate | null,
): Metadata {
  let description: string;

  if (agg && checkCitySectionThreshold(agg) && agg.positivePct !== null) {
    description = `${agencyCount} employment agencies in ${cityName}, Netherlands. ${agg.reviewCount} worker reviews — ${agg.positivePct}% positive. Salary, housing, and transport data from real workers.`;
  } else {
    description = `${agencyCount} employment agencies in ${cityName}, Netherlands. Find warehouse, logistics, and production jobs with salary and housing data.`;
  }

  const title = `Agency Jobs ${cityName} Netherlands — Salary, Housing & Worker Reviews`;

  return {
    title,
    description,
    alternates: { canonical: `/cities/${citySlug}` },
    openGraph:  { title, description },
  };
}

// ─── Data-driven content summaries ───────────────────────────────────────────
// ZERO filler text. Every sentence is derived from a real number or tag.

/**
 * buildAgencySummary
 *
 * Produces a 3–5 sentence paragraph about an agency based entirely on
 * aggregate review data. No AI-generated text, no opinions, no fabrication.
 *
 * Returns null if the agency hasn't reached the enrichment threshold.
 *
 * @example
 *   buildAgencySummary(agg)
 *   // → "Based on 12 worker reviews, 67% of workers rated Covebo positively.
 *   //    Salary satisfaction averages 3.8/5. Housing conditions were rated 3.2/5
 *   //    across 8 reviews with housing data. Most frequently reported issues:
 *   //    payslip errors (3 workers, 25%), missing overtime (2 workers, 17%)."
 */
export function buildAgencySummary(agg: ReviewAggregate): string | null {
  if (!checkAgencyEnrichmentThreshold(agg)) return null;

  const sentences: string[] = [];
  const n = agg.reviewCount;

  // Opening — review count + sentiment
  if (agg.positivePct !== null && n >= SEO_THRESHOLDS.STATS_DISPLAY_MIN) {
    sentences.push(
      `Based on ${n} worker review${n !== 1 ? "s" : ""}, ${agg.positivePct}% rated this agency positively (4–5 stars) and ${agg.negativePct}% negatively (1–2 stars).`
    );
  } else {
    sentences.push(`Based on ${n} worker review${n !== 1 ? "s" : ""}.`);
  }

  // Salary
  if (agg.avgSalaryRating !== null) {
    sentences.push(`Salary satisfaction averages ${agg.avgSalaryRating}/5.`);
  }

  // Housing
  if (agg.avgHousing !== null) {
    sentences.push(`Housing conditions rated ${agg.avgHousing}/5 across reviews with housing data.`);
  }

  // Management
  if (agg.avgManagement !== null) {
    sentences.push(`Management rated ${agg.avgManagement}/5.`);
  }

  // Top negative issues only
  const negIssues = agg.topIssues.filter((i) =>
    ["payslip_errors","missing_overtime","late_salary","housing_crowded",
     "housing_dirty","unclear_contract","communication_poor","management_poor",
     "transport_delays"].includes(i.tag)
  ).slice(0, 3);

  if (negIssues.length > 0) {
    const parts = negIssues.map((i) => `${i.label.toLowerCase()} (${i.count} worker${i.count !== 1 ? "s" : ""})`);
    sentences.push(`Most frequently reported problems: ${parts.join("; ")}.`);
  }

  // Top positive signals
  const posIssues = agg.topIssues.filter((i) =>
    ["fair_pay","housing_good","housing_clean","transport_good",
     "fair_contract","communication_good","overtime_paid","payslip_ok"].includes(i.tag)
  ).slice(0, 2);

  if (posIssues.length > 0) {
    const parts = posIssues.map((i) => i.label.toLowerCase());
    sentences.push(`Positive signals: ${parts.join(", ")}.`);
  }

  // Verified count
  if (agg.verifiedCount > 0) {
    sentences.push(`${agg.verifiedCount} of ${n} reviews are verified.`);
  }

  return sentences.join(" ");
}

/**
 * buildCitySummary
 *
 * Produces a 2–3 sentence paragraph about worker experiences in a city.
 * Returns null if the city hasn't reached the section threshold.
 */
export function buildCitySummary(agg: ReviewAggregate, cityName: string): string | null {
  if (!checkCitySectionThreshold(agg)) return null;

  const sentences: string[] = [];
  const n = agg.reviewCount;

  // Opening
  if (agg.positivePct !== null && n >= SEO_THRESHOLDS.STATS_DISPLAY_MIN) {
    sentences.push(
      `${n} worker${n !== 1 ? "s have" : " has"} reviewed employment agencies in ${cityName} on AgencyCheck. ${agg.positivePct}% rated their experience positively.`
    );
  } else {
    sentences.push(`${n} worker review${n !== 1 ? "s" : ""} cover employment agencies in ${cityName}.`);
  }

  // Top issue
  const topNeg = agg.topIssues.filter((i) =>
    ["payslip_errors","missing_overtime","housing_crowded","housing_dirty",
     "unclear_contract","transport_delays"].includes(i.tag)
  );
  if (topNeg.length > 0) {
    sentences.push(`The most commonly reported issue in ${cityName} is ${topNeg[0].label.toLowerCase()} (${topNeg[0].count} worker${topNeg[0].count !== 1 ? "s" : ""}).`);
  }

  // Salary
  if (agg.avgSalaryRating !== null) {
    sentences.push(`Average salary satisfaction for agencies in ${cityName}: ${agg.avgSalaryRating}/5.`);
  }

  return sentences.join(" ");
}

/**
 * buildIssueSummary
 *
 * Returns a one-sentence factual summary of a specific issue tag.
 * Used to annotate review cards or agency pages.
 *
 * @example
 *   buildIssueSummary({ tag: "payslip_errors", count: 3, pct: 25, label: "Payslip errors" }, 12)
 *   // → "3 of 12 workers (25%) reported payslip errors with this agency."
 */
export function buildIssueSummary(issue: IssueBreakdown, totalReviews: number): string {
  return `${issue.count} of ${totalReviews} worker${totalReviews !== 1 ? "s" : ""} (${issue.pct}%) reported ${issue.label.toLowerCase()}.`;
}

// ─── JSON-LD schema helpers ───────────────────────────────────────────────────

/**
 * generateAgencySchemaRating
 *
 * Returns a JSON-LD AggregateRating object for an agency, populated
 * with real data from the aggregate. Returns null if the threshold
 * is not met (prevents misleading schema with 1 review).
 *
 * @example
 *   const rating = generateAgencySchemaRating("Covebo", agg);
 *   // Use in: <script type="application/ld+json">{JSON.stringify(rating)}</script>
 */
export function generateAgencySchemaRating(
  agencyName: string,
  agencyUrl:  string,
  agg:        ReviewAggregate,
): object | null {
  if (!checkAgencyEnrichmentThreshold(agg) || agg.avgOverall === null) return null;

  return {
    "@context":   "https://schema.org",
    "@type":      "Organization",
    "name":       agencyName,
    "url":        agencyUrl,
    "aggregateRating": {
      "@type":       "AggregateRating",
      "ratingValue": agg.avgOverall.toFixed(1),
      "bestRating":  "5",
      "worstRating": "1",
      "reviewCount": agg.reviewCount,
    },
  };
}

/**
 * generateReviewsListSchema
 *
 * Returns a JSON-LD ItemList schema summarising the top-level review signals
 * for a page. Used on /reviews and /agencies/[slug]/reviews.
 */
export function generateReviewsListSchema(
  pageUrl:      string,
  pageTitle:    string,
  reviewCount:  number,
  verifiedCount: number,
): object {
  return {
    "@context":   "https://schema.org",
    "@type":      "ItemList",
    "name":       pageTitle,
    "url":        pageUrl,
    "numberOfItems": reviewCount,
    "description":   `${reviewCount} worker reviews. ${verifiedCount} verified.`,
  };
}

// ─── Sitemap lastmod helper ───────────────────────────────────────────────────

/**
 * resolveLastmod
 *
 * Given a map of entity-slug → last-review-date and a fallback date,
 * returns the correct lastModified string for a sitemap entry.
 *
 * @param slug        - Entity slug (agency or city)
 * @param dateMap     - From getLastReviewDates() / getLastCityReviewDates()
 * @param fallback    - Static date string to use when no DB entry exists
 */
export function resolveLastmod(
  slug:     string,
  dateMap:  Map<string, string>,
  fallback: string,
): string {
  return dateMap.get(slug) ?? fallback;
}

// ─── Content quality gate ─────────────────────────────────────────────────────

/**
 * shouldShowReviewStats
 *
 * Guard used in page components before rendering any %-based statistics.
 * Prevents misleading display like "100% positive" from a single review.
 */
export function shouldShowReviewStats(reviewCount: number): boolean {
  return reviewCount >= SEO_THRESHOLDS.STATS_DISPLAY_MIN;
}

/**
 * shouldShowHousingStats
 *
 * Guard for housing-specific statistics.
 */
export function shouldShowHousingStats(reviewCount: number): boolean {
  return reviewCount >= SEO_THRESHOLDS.HOUSING_STATS_MIN;
}
