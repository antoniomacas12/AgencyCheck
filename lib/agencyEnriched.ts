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

/** All 127 verified agencies, fully enriched */
export const ALL_AGENCIES: EnrichedAgency[] = VERIFIED_AGENCIES.map(verifiedToEnriched);

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
