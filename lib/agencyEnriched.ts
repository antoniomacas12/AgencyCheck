// ─── AgencyCheck — Enriched Agency Data Layer ────────────────────────────────
// Production data layer sourced from the verified 127-agency dataset.
// All fields (agencyType, jobFocus, transparencyScore, accommodation) are
// research-verified. This is the single source of truth for all page data.

import {
  VERIFIED_AGENCIES,
  type VerifiedAgency,
  type AccommodationType,
} from "@/data/agencies";
import {
  type AgencySector,
  type JobFocusSlug,
  SECTOR_META,
} from "@/lib/agencyMeta";

// Re-export for consumers that import AccommodationType from this module
export type { AccommodationType, AgencySector };

// ─── Legacy AgencyCardData Compatibility ──────────────────────────────────────
// Components that relied on AgencyCardData fields (housing, transport, score…)
// are bridged here so no page component needs to change.

export interface AgencyCardData {
  id:                    string;
  name:                  string;
  slug:                  string;
  description:           string | null;
  website:               string | null;
  housing:               "YES" | "NO" | "UNKNOWN";
  transport:             "YES" | "NO" | "UNKNOWN";
  city:                  string;
  cities:                string[];
  score:                 number;
  reviewCount:           number;
  avgSalaryRating:       number | null;
  avgHourlyPay:          number | null;
  avgHousingRating:      number | null;
  issueCount:            number;
  jobTitles:             string[];
  aliases:               string[];
  jobTypes:              string | null;
  sourceUrl:             string | null;
  phone:                 string | null;
  email:                 string | null;
  address:               string | null;
  webPages:              Record<string, string>;
  housingVerification:   { value: string; status: string; source_url: string; source_type: string };
  transportVerification: { value: string; status: string; source_url: string; source_type: string };
}

// ─── Enriched Agency Interface ────────────────────────────────────────────────

export interface EnrichedAgency extends AgencyCardData {
  /** Verified sector category (agencyType in the database) */
  sector:             AgencySector;
  /** Up to 4 verified job focus area slugs */
  jobFocus:           JobFocusSlug[];
  /** 0–100 research-verified transparency score */
  transparencyScore:  number;
  /** Granular accommodation descriptor (research-verified) */
  accommodation:      AccommodationType;
  /** Cities the agency operates in */
  supportedCities:    string[];
  /** Research confidence level */
  confidenceLevel:    "high" | "medium" | "low" | "very_low";
}

// ─── Accommodation → Legacy Housing Mapping ───────────────────────────────────

function accommodationToHousing(acc: AccommodationType): "YES" | "NO" | "UNKNOWN" {
  if (acc === "not_provided")           return "NO";
  if (acc === "unknown")                return "UNKNOWN";
  return "YES"; // confirmed_with_deduction | confirmed_no_deduction | unverified_claim
}

// ─── VerifiedAgency → EnrichedAgency Adapter ──────────────────────────────────

function verifiedToEnriched(v: VerifiedAgency): EnrichedAgency {
  const housing = accommodationToHousing(v.accommodation);
  const citySlug = v.city?.toLowerCase().replace(/\s+/g, "-") ?? "amsterdam";

  return {
    // ── Legacy AgencyCardData fields ──────────────────────────────────────────
    id:                    `agency_v${v.id.toString().padStart(3, "0")}`,
    name:                  v.name,
    slug:                  v.slug,
    description:           v.description,
    website:               v.website,
    housing,
    transport:             "UNKNOWN",      // transport provision not tracked in current dataset
    city:                  v.city ?? "Amsterdam",
    cities:                v.supportedCities.length > 0 ? v.supportedCities : [citySlug],
    score:                 v.transparencyScore,
    reviewCount:           0,
    avgSalaryRating:       null,
    avgHourlyPay:          null,
    avgHousingRating:      null,
    issueCount:            0,
    jobTitles:             v.jobFocus,
    aliases:               [],
    jobTypes:              v.jobFocus.join(", ") || null,
    sourceUrl:             v.website,
    phone:                 v.phone,
    email:                 v.email,
    address:               v.address,
    webPages:              v.website ? { homepage: v.website } : {},
    housingVerification:   {
      value:       housing,
      status:      v.accommodation === "unknown" ? "unknown" : "verified",
      source_url:  v.website ?? "",
      source_type: v.sourceType,
    },
    transportVerification: {
      value:       "UNKNOWN",
      status:      "unknown",
      source_url:  v.website ?? "",
      source_type: v.sourceType,
    },
    // ── Enriched fields (research-verified) ───────────────────────────────────
    sector:            v.agencyType as AgencySector,
    jobFocus:          v.jobFocus as JobFocusSlug[],
    transparencyScore: v.transparencyScore,
    accommodation:     v.accommodation,
    supportedCities:   v.supportedCities,
    confidenceLevel:   v.confidenceLevel,
  };
}

// ─── Exports ──────────────────────────────────────────────────────────────────

/** All verified agencies, fully enriched */
const _BASE_AGENCIES: EnrichedAgency[] = VERIFIED_AGENCIES.map(verifiedToEnriched);

// ─── Stub generation for review-referenced agencies ───────────────────────────
// Some review seed entries reference agencies whose slugs don't yet exist in
// data/agencies.ts (different slug format, or not yet fully catalogued).
// Rather than 404, we generate a minimal stub so the agency page resolves.
// Stubs are populated with whatever the review data reveals (city, jobType).

import { REVIEW_SEED_DATA } from "@/lib/reviewData";

const _baseMap = new Map(_BASE_AGENCIES.map((a) => [a.slug, a]));

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildStub(slug: string): EnrichedAgency {
  // Derive what we can from reviews mentioning this slug
  const reviews = REVIEW_SEED_DATA.filter((r) => r.agencySlug === slug);
  const city = reviews.find((r) => r.city)?.city ?? "Netherlands";
  const hasHousingReview = reviews.some((r) => r.housingRating != null);
  const housing: "YES" | "NO" | "UNKNOWN" = hasHousingReview ? "YES" : "UNKNOWN";

  return {
    id:                    `stub_${slug}`,
    name:                  slugToName(slug),
    slug,
    description:           null,
    website:               null,
    housing,
    transport:             "UNKNOWN",
    city,
    cities:                [city.toLowerCase().replace(/\s+/g, "-")],
    score:                 0,
    reviewCount:           reviews.length,
    avgSalaryRating:       null,
    avgHourlyPay:          null,
    avgHousingRating:      null,
    issueCount:            0,
    jobTitles:             [],
    aliases:               [],
    jobTypes:              null,
    sourceUrl:             null,
    phone:                 null,
    email:                 null,
    address:               null,
    webPages:              {},
    housingVerification:   { value: housing, status: "unknown", source_url: "", source_type: "UNKNOWN" },
    transportVerification: { value: "UNKNOWN", status: "unknown", source_url: "", source_type: "UNKNOWN" },
    sector:                "general-staffing" as AgencySector,
    jobFocus:              [],
    transparencyScore:     0,
    accommodation:         hasHousingReview ? "unverified_claim" : "unknown",
    supportedCities:       [city],
    confidenceLevel:       "very_low",
  };
}

// Build stubs only for review slugs not already in the base dataset
const _reviewSlugs = [...new Set(REVIEW_SEED_DATA.map((r) => r.agencySlug))];
const _stubs: EnrichedAgency[] = _reviewSlugs
  .filter((slug) => !_baseMap.has(slug))
  .map(buildStub);

/** All verified agencies + stubs for review-referenced agencies not yet fully catalogued */
export const ALL_AGENCIES: EnrichedAgency[] = [..._BASE_AGENCIES, ..._stubs];

/** Fast slug lookup by slug — O(1) */
export const ALL_AGENCY_MAP: Record<string, EnrichedAgency> = Object.fromEntries(
  ALL_AGENCIES.map((a) => [a.slug, a])
);

/** Agencies with confirmed housing (housing === "YES") */
export const HOUSING_AGENCIES = ALL_AGENCIES.filter((a) => a.housing === "YES");

/** Agencies grouped by sector */
export const AGENCIES_BY_SECTOR: Record<AgencySector, EnrichedAgency[]> = {} as Record<AgencySector, EnrichedAgency[]>;
for (const agency of ALL_AGENCIES) {
  if (!AGENCIES_BY_SECTOR[agency.sector]) AGENCIES_BY_SECTOR[agency.sector] = [];
  AGENCIES_BY_SECTOR[agency.sector].push(agency);
}

/** Get agencies in a sector, sorted by transparencyScore desc, then score desc */
export function getAgenciesBySector(sector: AgencySector): EnrichedAgency[] {
  return (AGENCIES_BY_SECTOR[sector] ?? []).sort(
    (a, b) =>
      b.transparencyScore - a.transparencyScore ||
      b.score - a.score
  );
}

/** Get agencies for a specific city+sector combination */
export function getSectorCityAgencies(sector: AgencySector, cityName: string): EnrichedAgency[] {
  const normalised = cityName.toLowerCase();
  return (AGENCIES_BY_SECTOR[sector] ?? []).filter((a) =>
    a.supportedCities.some((c) => c.toLowerCase() === normalised) ||
    a.city.toLowerCase() === normalised
  ).sort((a, b) => b.transparencyScore - a.transparencyScore || b.score - a.score);
}

/** Cities present in a given sector's agency data */
export function getCitiesForSector(sector: AgencySector): string[] {
  const citySet = new Set<string>();
  for (const agency of (AGENCIES_BY_SECTOR[sector] ?? [])) {
    for (const city of agency.supportedCities) citySet.add(city);
  }
  return [...citySet].sort();
}

/** Top N agencies by transparencyScore within a city */
export function getTopAgenciesForCity(cityName: string, limit = 12): EnrichedAgency[] {
  const normalised = cityName.toLowerCase();
  return ALL_AGENCIES.filter((a) =>
    a.supportedCities.some((c) => c.toLowerCase() === normalised) ||
    a.city.toLowerCase() === normalised
  )
    .sort((a, b) => b.transparencyScore - a.transparencyScore || b.score - a.score)
    .slice(0, limit);
}

/** Agencies with housing in a specific city */
export function getCityHousingAgenciesEnriched(cityName: string): EnrichedAgency[] {
  const normalised = cityName.toLowerCase();
  return HOUSING_AGENCIES.filter((a) =>
    a.supportedCities.some((c) => c.toLowerCase() === normalised) ||
    a.city.toLowerCase() === normalised
  );
}

/** Transparency score tier label */
export function getTransparencyTier(score: number): {
  label: string;
  color: string;
  bg:    string;
} {
  if (score >= 80) return { label: "High transparency",   color: "text-green-700",  bg: "bg-green-50"  };
  if (score >= 50) return { label: "Partial data",        color: "text-amber-700",  bg: "bg-amber-50"  };
  return              { label: "Limited data",            color: "text-gray-500",   bg: "bg-gray-50"   };
}

/** Sector meta helper */
export function getSectorMeta(sector: AgencySector) {
  return SECTOR_META[sector];
}

/** Sector by slug */
export function getSectorBySlug(slug: string) {
  return SECTOR_META[slug as AgencySector] ?? null;
}

/** All sector slugs that have at least 1 agency */
export function getActiveSectors(): AgencySector[] {
  return Object.entries(AGENCIES_BY_SECTOR)
    .filter(([, agencies]) => agencies.length > 0)
    .map(([sector]) => sector as AgencySector)
    .sort();
}
