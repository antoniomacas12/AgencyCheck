/**
 * lib/pageEligibility.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * AgencyCheck — Page Generation Eligibility Rules
 *
 * This module is the single gatekeeper for deciding whether a programmatically
 * generated SEO page should:
 *   (a) be fully generated and indexed,
 *   (b) be generated but marked noindex (present but excluded from search), or
 *   (c) be skipped entirely (404 / not generated).
 *
 * DESIGN PRINCIPLES
 * ─────────────────
 *  1. Only use data from the 127-agency verified dataset. No fabrication.
 *  2. Prefer false negatives (skip a valid page) over false positives
 *     (generate a thin or misleading page).
 *  3. All functions are pure and synchronous — safe to call in
 *     `generateStaticParams()` or middleware without IO.
 *  4. All decisions are explained in the returned `reason` string so they can
 *     be logged, tested, and audited.
 *  5. This file ONLY adds logic — it does not modify agency data.
 *
 * USAGE IN ROUTES
 * ───────────────
 *  generateStaticParams()  — call canGenerate* to filter out ineligible slugs
 *  Page component          — call getIndexStatus() to set <meta robots>
 *  Sitemap                 — use getPageIndexStatus() to exclude noindex pages
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { VerifiedAgency, ConfidenceLevel } from "@/data/agencies";
import type { EnrichedAgency }                  from "@/lib/agencyEnriched";

// ─── Result types ─────────────────────────────────────────────────────────────

/**
 * PageDecision — the result of any eligibility check.
 *
 * allowed  — whether the page may be generated
 * reason   — human-readable explanation (for logging / testing)
 * noindex  — if allowed=true but the page is thin, set noindex=true so Google
 *             ignores it while the URL still resolves (no 404)
 */
export interface PageDecision {
  allowed:  boolean;
  noindex:  boolean;
  reason:   string;
}

/**
 * ComparisonOverlap — the shared signals found between two agencies.
 * Returned alongside the PageDecision so callers can use the overlap data
 * to populate the comparison page content.
 */
export interface ComparisonOverlap {
  sharedSector:     boolean;
  sharedJobFocus:   string[];  // intersection of jobFocus arrays
  sharedCities:     string[];  // intersection of supportedCities arrays
  overlapScore:     number;    // 0–100, higher = stronger comparison rationale
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Normalise a city name for comparison:
 * lowercase, trim, collapse internal whitespace, strip apostrophes.
 */
function normaliseCity(city: string): string {
  return city.toLowerCase().trim().replace(/\s+/g, " ").replace(/'/g, "");
}

/**
 * Return the set of cities an agency is known to operate in.
 * Priority: supportedCities > primary city field.
 * Always returns at least one entry if the agency has any city data.
 */
function agencyCitySet(agency: VerifiedAgency | EnrichedAgency): Set<string> {
  const cities = new Set<string>();

  if ("supportedCities" in agency) {
    for (const c of agency.supportedCities) cities.add(normaliseCity(c));
  }

  if ("cities" in agency) {
    // EnrichedAgency: legacy `cities` array
    for (const c of (agency as EnrichedAgency).cities) cities.add(normaliseCity(c));
  }

  const primaryCity =
    "city" in agency && agency.city
      ? normaliseCity(agency.city)
      : null;

  if (primaryCity && primaryCity !== "unknown") cities.add(primaryCity);

  return cities;
}

/**
 * Numeric weight for a confidence level.
 * Used to enforce minimum data quality thresholds.
 */
const CONFIDENCE_WEIGHT: Record<ConfidenceLevel, number> = {
  high:      4,
  medium:    3,
  low:       2,
  very_low:  1,
};

function confidenceWeight(level: string): number {
  return CONFIDENCE_WEIGHT[level as ConfidenceLevel] ?? 1;
}

// ─── Minimum content thresholds ───────────────────────────────────────────────

/**
 * MIN_TRANSPARENCY_FOR_INDEX
 * Any agency page with a transparencyScore below this value will be noindexed.
 * A score of 20 means only the most minimal data exists — no website, no
 * description, no contact info.  Such pages add no value to search results.
 */
const MIN_TRANSPARENCY_FOR_INDEX = 20;

/**
 * MIN_TRANSPARENCY_FOR_COMPARISON
 * Both agencies in a comparison must exceed this threshold.
 * Below it there is not enough information to make a meaningful comparison.
 */
const MIN_TRANSPARENCY_FOR_COMPARISON = 30;

/**
 * MIN_COMPARISON_OVERLAP_SCORE
 * The computed overlapScore (0–100) must reach this value for a comparison
 * page to be allowed.  Below it, the two agencies have no meaningful
 * connection and the page would be topically thin.
 */
const MIN_COMPARISON_OVERLAP_SCORE = 25;

/**
 * MIN_CITY_AGENCIES_FOR_INDEX
 * A city page (e.g. /cities/utrecht) should only be indexed if at least
 * this many verified agencies operate there.  A city with a single agency
 * produces a near-duplicate of that agency's own profile page.
 */
const MIN_CITY_AGENCIES_FOR_INDEX = 2;

// ─── STEP 1: agency page quality ─────────────────────────────────────────────

/**
 * getAgencyPageIndexStatus
 * ────────────────────────
 * Determines whether a single agency profile page should be indexed.
 *
 * Rules (applied in order, first match wins):
 *  1. very_low confidence + no description → skip (no useful content)
 *  2. transparencyScore < MIN_TRANSPARENCY_FOR_INDEX → noindex
 *  3. Otherwise → index
 *
 * Usage:
 *   const { noindex } = getAgencyPageIndexStatus(agency);
 *   // In page component: <meta name="robots" content={noindex ? "noindex" : "index,follow"} />
 */
export function getAgencyPageIndexStatus(
  agency: VerifiedAgency | EnrichedAgency,
): PageDecision {
  const score = "transparencyScore" in agency
    ? agency.transparencyScore
    : ("score" in agency ? (agency as EnrichedAgency).score : 0);

  const desc = agency.description;
  const conf = agency.confidenceLevel;

  // Rule 1 — very low confidence AND no description
  if (conf === "very_low" && !desc) {
    return {
      allowed: false,
      noindex: false,
      reason:  `Agency "${agency.name}" has very_low confidence and no description. Page generation skipped to avoid thin content.`,
    };
  }

  // Rule 2 — transparency score too low to warrant indexing
  if (score < MIN_TRANSPARENCY_FOR_INDEX) {
    return {
      allowed: true,    // page resolves (avoids broken links from existing URLs)
      noindex: true,
      reason:  `Agency "${agency.name}" transparency score ${score} is below threshold ${MIN_TRANSPARENCY_FOR_INDEX}. Page allowed but set to noindex.`,
    };
  }

  return {
    allowed: true,
    noindex: false,
    reason:  `Agency "${agency.name}" passes quality checks (score=${score}, confidence=${conf}).`,
  };
}

// ─── STEP 3: agency + city page eligibility ───────────────────────────────────

/**
 * canGenerateAgencyCityPage
 * ─────────────────────────
 * Returns whether a page at /agencies/[slug]/cities/[city] (or equivalent)
 * can legitimately be generated for this agency + city combination.
 *
 * A page is ALLOWED only when ALL of the following hold:
 *  (a) The city appears in supportedCities OR matches the primary city field.
 *      (We never invent a city relationship from description text alone.)
 *  (b) The agency has at least `low` confidence.
 *  (c) The agency has a description OR a website (something useful to show).
 *
 * A page is ALLOWED but NOINDEXED when:
 *  (d) The agency's transparencyScore is below MIN_TRANSPARENCY_FOR_INDEX.
 *
 * IMPORTANT: If city relevance is unclear, this function returns allowed=false.
 *            It never assumes city coverage from inferred or unverified data.
 *
 * @param agency  - VerifiedAgency or EnrichedAgency from the 127-agency dataset
 * @param city    - City slug or name to test (e.g. "amsterdam" or "Amsterdam")
 *
 * @example
 *   const result = canGenerateAgencyCityPage(agency, "rotterdam");
 *   if (!result.allowed) return; // skip this route combination
 */
export function canGenerateAgencyCityPage(
  agency:    VerifiedAgency | EnrichedAgency,
  city:      string,
): PageDecision {
  const normCity   = normaliseCity(city);
  const citySet    = agencyCitySet(agency);
  const inCitySet  = citySet.has(normCity);

  // (a) City must be explicitly verified in the dataset
  if (!inCitySet) {
    return {
      allowed: false,
      noindex: false,
      reason:  `City "${city}" not found in verified supportedCities or primary city for agency "${agency.name}". Page skipped to avoid fabricated location claim.`,
    };
  }

  // (b) Minimum confidence — very_low agencies have insufficient profile data
  if (confidenceWeight(agency.confidenceLevel) < confidenceWeight("low")) {
    return {
      allowed: false,
      noindex: false,
      reason:  `Agency "${agency.name}" has confidence="${agency.confidenceLevel}" — below minimum "low" required for city sub-pages.`,
    };
  }

  // (c) Minimum content — must have description OR website
  const score   = "transparencyScore" in agency ? agency.transparencyScore
    : ("score" in agency ? (agency as EnrichedAgency).score : 0);
  const hasDesc = Boolean(agency.description);
  const hasWeb  = Boolean(agency.website);

  if (!hasDesc && !hasWeb) {
    return {
      allowed: false,
      noindex: false,
      reason:  `Agency "${agency.name}" has neither a description nor a website. City page for "${city}" would be content-free.`,
    };
  }

  // (d) Noindex if transparency score is low
  if (score < MIN_TRANSPARENCY_FOR_INDEX) {
    return {
      allowed: true,
      noindex: true,
      reason:  `Agency "${agency.name}" + city "${city}" allowed but noindexed (transparencyScore=${score} < ${MIN_TRANSPARENCY_FOR_INDEX}).`,
    };
  }

  return {
    allowed: true,
    noindex: false,
    reason:  `Agency "${agency.name}" + city "${city}" is eligible for a full indexed page (verified city, score=${score}).`,
  };
}

// ─── STEP 2: agency comparison eligibility ────────────────────────────────────

/**
 * computeComparisonOverlap
 * ────────────────────────
 * Analyses how much two agencies share in common.
 * Returns a ComparisonOverlap object with an overlapScore from 0–100.
 *
 * Scoring model:
 *   +40  Same agencyType / sector          (strongest signal — same worker pool)
 *   +30  Any shared jobFocus slug(s)        (+10 per shared slug, max 30)
 *   +20  Any shared supportedCity/cities    (+10 per shared city, max 20)
 *   +10  Both are general-staffing          (always somewhat comparable)
 */
export function computeComparisonOverlap(
  agencyA: VerifiedAgency | EnrichedAgency,
  agencyB: VerifiedAgency | EnrichedAgency,
): ComparisonOverlap {
  // Sector
  const sectorA = "agencyType" in agencyA ? agencyA.agencyType : (agencyA as EnrichedAgency).sector;
  const sectorB = "agencyType" in agencyB ? agencyB.agencyType : (agencyB as EnrichedAgency).sector;
  const sharedSector = sectorA === sectorB;

  // Job focus intersection
  const focusA = new Set(agencyA.jobFocus.map((j) => j.toLowerCase()));
  const focusB = new Set(agencyB.jobFocus.map((j) => j.toLowerCase()));
  const sharedJobFocus = [...focusA].filter((j) => focusB.has(j));

  // City intersection (normalised)
  const citiesA = agencyCitySet(agencyA);
  const citiesB = agencyCitySet(agencyB);
  const sharedCities = [...citiesA].filter((c) => citiesB.has(c));

  // Score
  let overlapScore = 0;
  if (sharedSector)           overlapScore += 40;
  if (sectorA === "general-staffing" && sectorB === "general-staffing") overlapScore += 10;
  overlapScore += Math.min(sharedJobFocus.length * 10, 30);
  overlapScore += Math.min(sharedCities.length  * 10, 20);
  overlapScore = Math.min(overlapScore, 100);

  return { sharedSector, sharedJobFocus, sharedCities, overlapScore };
}

/**
 * canGenerateAgencyComparison
 * ───────────────────────────
 * Returns whether a comparison page for two agencies should be generated.
 *
 * A comparison is ALLOWED only when ALL of the following hold:
 *  (a) The two agencies are not the same (slug must differ).
 *  (b) Both agencies have a transparencyScore ≥ MIN_TRANSPARENCY_FOR_COMPARISON.
 *  (c) Neither agency has very_low confidence.
 *  (d) The computed overlapScore ≥ MIN_COMPARISON_OVERLAP_SCORE.
 *      i.e. they share a sector, job focus, or city — something meaningful.
 *
 * Returns false if there is no meaningful overlap.  Two agencies with
 * completely different sectors, cities, and job focus have no reason to
 * appear on the same comparison page.
 *
 * Also returns the ComparisonOverlap so the calling page can display
 * "Why these agencies are compared" content.
 *
 * @param agencyA  - First agency from the 127-agency dataset
 * @param agencyB  - Second agency from the 127-agency dataset
 *
 * @example
 *   const { decision, overlap } = canGenerateAgencyComparison(a, b);
 *   if (!decision.allowed) return notFound();
 *   // decision.noindex is true if the page should exist but not be indexed
 *   // overlap.sharedCities / overlap.sharedJobFocus power the page content
 */
export function canGenerateAgencyComparison(
  agencyA: VerifiedAgency | EnrichedAgency,
  agencyB: VerifiedAgency | EnrichedAgency,
): { decision: PageDecision; overlap: ComparisonOverlap } {
  const overlap = computeComparisonOverlap(agencyA, agencyB);

  // (a) Cannot compare an agency with itself
  if (agencyA.slug === agencyB.slug) {
    return {
      decision: {
        allowed: false,
        noindex: false,
        reason:  `Cannot compare agency "${agencyA.name}" with itself.`,
      },
      overlap,
    };
  }

  // (b) Both must meet minimum transparency
  const scoreA = "transparencyScore" in agencyA ? agencyA.transparencyScore : (agencyA as EnrichedAgency).score;
  const scoreB = "transparencyScore" in agencyB ? agencyB.transparencyScore : (agencyB as EnrichedAgency).score;

  if (scoreA < MIN_TRANSPARENCY_FOR_COMPARISON) {
    return {
      decision: {
        allowed: false,
        noindex: false,
        reason:  `Agency A "${agencyA.name}" has insufficient data for a comparison page (score=${scoreA}, minimum=${MIN_TRANSPARENCY_FOR_COMPARISON}).`,
      },
      overlap,
    };
  }

  if (scoreB < MIN_TRANSPARENCY_FOR_COMPARISON) {
    return {
      decision: {
        allowed: false,
        noindex: false,
        reason:  `Agency B "${agencyB.name}" has insufficient data for a comparison page (score=${scoreB}, minimum=${MIN_TRANSPARENCY_FOR_COMPARISON}).`,
      },
      overlap,
    };
  }

  // (c) Neither may have very_low confidence
  if (agencyA.confidenceLevel === "very_low") {
    return {
      decision: {
        allowed: false,
        noindex: false,
        reason:  `Agency A "${agencyA.name}" has very_low research confidence — not enough data for a meaningful comparison.`,
      },
      overlap,
    };
  }

  if (agencyB.confidenceLevel === "very_low") {
    return {
      decision: {
        allowed: false,
        noindex: false,
        reason:  `Agency B "${agencyB.name}" has very_low research confidence — not enough data for a meaningful comparison.`,
      },
      overlap,
    };
  }

  // (d) Meaningful overlap must exist
  if (overlap.overlapScore < MIN_COMPARISON_OVERLAP_SCORE) {
    return {
      decision: {
        allowed: false,
        noindex: false,
        reason:  [
          `No meaningful overlap between "${agencyA.name}" and "${agencyB.name}"`,
          `(overlapScore=${overlap.overlapScore}, minimum=${MIN_COMPARISON_OVERLAP_SCORE}).`,
          `No shared sector, job focus, or city was found.`,
          `A comparison page would be topically thin.`,
        ].join(" "),
      },
      overlap,
    };
  }

  // Everything passes — determine if the page should be noindexed
  // Noindex if either agency is borderline on transparency or confidence
  const eitherLow = agencyA.confidenceLevel === "low" || agencyB.confidenceLevel === "low";
  const eitherBorderline = scoreA < 40 || scoreB < 40;

  if (eitherLow || eitherBorderline) {
    return {
      decision: {
        allowed: true,
        noindex: true,
        reason:  [
          `Comparison "${agencyA.name}" vs "${agencyB.name}" allowed but noindexed`,
          `(overlapScore=${overlap.overlapScore},`,
          eitherLow        ? `confidence is "low" for one agency,`    : "",
          eitherBorderline ? `transparency score borderline (<40),`    : "",
          `).`,
        ].filter(Boolean).join(" "),
      },
      overlap,
    };
  }

  return {
    decision: {
      allowed: true,
      noindex: false,
      reason:  [
        `Comparison "${agencyA.name}" vs "${agencyB.name}" fully eligible`,
        `(overlapScore=${overlap.overlapScore},`,
        overlap.sharedSector     ? `same sector,`                             : "",
        overlap.sharedJobFocus.length > 0 ? `shared job focus: [${overlap.sharedJobFocus.join(", ")}],` : "",
        overlap.sharedCities.length   > 0 ? `shared cities: [${overlap.sharedCities.join(", ")}]`       : "",
        `).`,
      ].filter(Boolean).join(" "),
    },
    overlap,
  };
}

// ─── STEP 4: city hub page quality ────────────────────────────────────────────

/**
 * canGenerateCityPage
 * ───────────────────
 * Returns whether a city hub page (e.g. /cities/utrecht) should be generated.
 *
 * A city page is ALLOWED when:
 *  (a) At least 1 verified agency explicitly lists this city in supportedCities.
 *  (b) At least MIN_CITY_AGENCIES_FOR_INDEX agencies → fully indexed.
 *      If only 1 agency → allowed but noindexed (near-duplicate of agency page).
 *
 * @param citySlug     - URL slug of the city (e.g. "amsterdam")
 * @param allAgencies  - Full array of agencies to check against
 */
export function canGenerateCityPage(
  citySlug:   string,
  allAgencies: Array<VerifiedAgency | EnrichedAgency>,
): PageDecision & { agencyCount: number } {
  const normCity = normaliseCity(citySlug.replace(/-/g, " "));

  const matchingAgencies = allAgencies.filter((a) => {
    const set = agencyCitySet(a);
    return set.has(normCity);
  });

  const count = matchingAgencies.length;

  if (count === 0) {
    return {
      allowed:      false,
      noindex:      false,
      agencyCount:  0,
      reason:       `No agencies found for city "${citySlug}". City page skipped — no verified data to show.`,
    };
  }

  if (count < MIN_CITY_AGENCIES_FOR_INDEX) {
    return {
      allowed:      true,
      noindex:      true,
      agencyCount:  count,
      reason:       `City "${citySlug}" has only ${count} agency — below minimum ${MIN_CITY_AGENCIES_FOR_INDEX} for indexing. Page allowed but noindexed.`,
    };
  }

  return {
    allowed:      true,
    noindex:      false,
    agencyCount:  count,
    reason:       `City "${citySlug}" has ${count} verified agencies. City page fully eligible.`,
  };
}

// ─── STEP 4: batch eligibility helpers ────────────────────────────────────────

/**
 * filterEligibleAgencyCityPairs
 * ─────────────────────────────
 * Given an array of agencies, returns only the (agency, city) pairs that
 * pass canGenerateAgencyCityPage.
 *
 * Designed for use in generateStaticParams() to build city sub-page routes.
 *
 * @example
 *   export function generateStaticParams() {
 *     return filterEligibleAgencyCityPairs(ALL_AGENCIES)
 *       .map(({ agency, city }) => ({ slug: agency.slug, city }));
 *   }
 */
export function filterEligibleAgencyCityPairs(
  agencies: Array<VerifiedAgency | EnrichedAgency>,
): Array<{ agency: VerifiedAgency | EnrichedAgency; city: string }> {
  const pairs: Array<{ agency: VerifiedAgency | EnrichedAgency; city: string }> = [];

  for (const agency of agencies) {
    const citySet = agencyCitySet(agency);
    for (const city of citySet) {
      const result = canGenerateAgencyCityPage(agency, city);
      if (result.allowed) {
        pairs.push({ agency, city });
      }
    }
  }

  return pairs;
}

/**
 * filterEligibleComparisons
 * ─────────────────────────
 * Given an array of agencies, returns all unique agency pairs that pass
 * canGenerateAgencyComparison.
 *
 * WARNING: O(n²) — call only at build time (generateStaticParams), never
 * at request time.  For 127 agencies this produces at most ~8,001 pairs
 * to test (127 × 126 / 2 = 8,001).
 *
 * @param agencies       - All agencies to pair up
 * @param indexedOnly    - If true, exclude noindex pairs from the result
 *
 * @example
 *   export function generateStaticParams() {
 *     const pairs = filterEligibleComparisons(ALL_AGENCIES, true);
 *     return pairs.map(({ a, b }) => ({ slugA: a.slug, slugB: b.slug }));
 *   }
 */
export function filterEligibleComparisons(
  agencies:    Array<VerifiedAgency | EnrichedAgency>,
  indexedOnly: boolean = false,
): Array<{
  a:        VerifiedAgency | EnrichedAgency;
  b:        VerifiedAgency | EnrichedAgency;
  overlap:  ComparisonOverlap;
  noindex:  boolean;
}> {
  const results: ReturnType<typeof filterEligibleComparisons> = [];

  for (let i = 0; i < agencies.length; i++) {
    for (let j = i + 1; j < agencies.length; j++) {
      const { decision, overlap } = canGenerateAgencyComparison(agencies[i], agencies[j]);
      if (!decision.allowed) continue;
      if (indexedOnly && decision.noindex) continue;
      results.push({ a: agencies[i], b: agencies[j], overlap, noindex: decision.noindex });
    }
  }

  return results;
}

// ─── STEP 4: meta robots helper ───────────────────────────────────────────────

/**
 * getRobotsDirective
 * ──────────────────
 * Converts a PageDecision into a Next.js `robots` metadata value.
 * Use in `generateMetadata()` to automatically apply noindex where needed.
 *
 * @example
 *   export async function generateMetadata({ params }) {
 *     const agency = ALL_AGENCY_MAP[params.slug];
 *     const decision = getAgencyPageIndexStatus(agency);
 *     return {
 *       title: `${agency.name} — AgencyCheck`,
 *       robots: getRobotsDirective(decision),
 *     };
 *   }
 */
export function getRobotsDirective(
  decision: PageDecision,
): { index: boolean; follow: boolean } {
  if (!decision.allowed || decision.noindex) {
    return { index: false, follow: true };
  }
  return { index: true, follow: true };
}

// ─── Re-export thresholds for testing ────────────────────────────────────────

export const ELIGIBILITY_THRESHOLDS = {
  MIN_TRANSPARENCY_FOR_INDEX,
  MIN_TRANSPARENCY_FOR_COMPARISON,
  MIN_COMPARISON_OVERLAP_SCORE,
  MIN_CITY_AGENCIES_FOR_INDEX,
} as const;
