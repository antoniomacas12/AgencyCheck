/**
 * AgencyCheck — Job & Agency Trust / Ranking Score System
 *
 * Score formula:
 *   score = agencyTrust + jobCountBonus + housingBonus + salaryBonus + reviewBonus
 *
 * Used to rank agencies and jobs on SEO pages, city pages, and the homepage.
 */

// ─── Agency trust tiers ────────────────────────────────────────────────────────
// Based on: market size, ABU certification, public recognition, complaint history

export type AgencyTrustTier = "PLATINUM" | "GOLD" | "SILVER" | "BRONZE" | "UNRATED";

export interface AgencyTrustProfile {
  slug:         string;
  tier:         AgencyTrustTier;
  trustScore:   number; // 0–100
  abuCertified: boolean;
  marketSize:   "LARGE" | "MEDIUM" | "SMALL";
  note:         string;
}

/** Known agency trust profiles. Unlisted agencies get UNRATED/50. */
export const AGENCY_TRUST_PROFILES: AgencyTrustProfile[] = [
  {
    slug:         "randstad-nederland",
    tier:         "PLATINUM",
    trustScore:   95,
    abuCertified: true,
    marketSize:   "LARGE",
    note:         "World's largest staffing company, listed on NYSE Euronext",
  },
  {
    slug:         "tempo-team-amsterdam-uitzendbureau",
    tier:         "PLATINUM",
    trustScore:   92,
    abuCertified: true,
    marketSize:   "LARGE",
    note:         "Randstad subsidiary, one of NL's top 3 agencies",
  },
  {
    slug:         "otto-workforce",
    tier:         "GOLD",
    trustScore:   82,
    abuCertified: true,
    marketSize:   "MEDIUM",
    note:         "Specialised in international (EU) workers, housing provider",
  },
  {
    slug:         "covebo",
    tier:         "GOLD",
    trustScore:   80,
    abuCertified: true,
    marketSize:   "MEDIUM",
    note:         "Logistics & production specialist, strong housing track record",
  },
  {
    slug:         "gi-group-temp",
    tier:         "GOLD",
    trustScore:   78,
    abuCertified: true,
    marketSize:   "MEDIUM",
    note:         "Italian multinational, European workforce specialist",
  },
  {
    slug:         "manpower",
    tier:         "GOLD",
    trustScore:   76,
    abuCertified: true,
    marketSize:   "LARGE",
    note:         "ManpowerGroup subsidiary, global reach",
  },
  {
    slug:         "profcore",
    tier:         "SILVER",
    trustScore:   65,
    abuCertified: false,
    marketSize:   "SMALL",
    note:         "Netherlands-based flex staffing",
  },
  {
    slug:         "sba-flex",
    tier:         "SILVER",
    trustScore:   62,
    abuCertified: false,
    marketSize:   "SMALL",
    note:         "Flexible staffing",
  },
];

/** Map for O(1) profile lookup */
const TRUST_PROFILE_MAP: Record<string, AgencyTrustProfile> = Object.fromEntries(
  AGENCY_TRUST_PROFILES.map((p) => [p.slug, p])
);

export function getAgencyTrustProfile(slug: string): AgencyTrustProfile {
  return TRUST_PROFILE_MAP[slug] ?? {
    slug,
    tier: "UNRATED",
    trustScore: 50,
    abuCertified: false,
    marketSize: "SMALL",
    note: "",
  };
}

// ─── Job score ─────────────────────────────────────────────────────────────────

export interface JobScore {
  total:          number; // 0–200
  agencyTrust:    number; // 0–100 (from agency trust profile)
  housingBonus:   number; // 0–30
  salaryBonus:    number; // 0–40
  reviewBonus:    number; // 0–30 (placeholder for future reviews)
}

export interface ScoredJob {
  slug:           string;
  title:          string;
  city:           string;
  agencySlug:     string;
  agencyName:     string;
  salaryMin:      number;
  salaryMax:      number;
  housing:        "YES" | "NO" | "UNKNOWN";
  jobType:        string;
  score:          JobScore;
}

export function scoreJob(job: {
  slug: string;
  title: string;
  city: string;
  agencySlug: string;
  agencyName: string;
  salaryMin: number;
  salaryMax: number;
  housing: "YES" | "NO" | "UNKNOWN";
  jobType: string;
}): ScoredJob {
  const profile = getAgencyTrustProfile(job.agencySlug);

  const agencyTrust  = profile.trustScore;
  const housingBonus = job.housing === "YES" ? 30 : job.housing === "NO" ? 0 : 10;
  const salaryBonus  = job.salaryMin >= 16 ? 40
    : job.salaryMin >= 14.5 ? 30
    : job.salaryMin >= 13 ? 20
    : job.salaryMin > 0 ? 10
    : 0;
  const reviewBonus  = 0; // future: based on agency review count

  return {
    ...job,
    score: {
      total: agencyTrust + housingBonus + salaryBonus + reviewBonus,
      agencyTrust,
      housingBonus,
      salaryBonus,
      reviewBonus,
    },
  };
}

// ─── Agency ranking score ──────────────────────────────────────────────────────

export interface AgencyRankScore {
  slug:         string;
  total:        number;  // 0–300
  trustScore:   number;  // 0–100
  jobCountScore: number; // 0–100
  housingScore: number;  // 0–50
  salaryScore:  number;  // 0–50
}

export function scoreAgency(opts: {
  slug:       string;
  jobCount:   number;
  hasHousing: boolean;
  avgSalary:  number; // avg hourly
}): AgencyRankScore {
  const profile     = getAgencyTrustProfile(opts.slug);
  const trustScore  = profile.trustScore;

  // Job count bonus: 0–100, log-scaled (100+ jobs = 100)
  const jobCountScore = Math.min(100, Math.round(Math.log1p(opts.jobCount) / Math.log1p(100) * 100));

  // Housing: 50 if YES, 0 otherwise
  const housingScore = opts.hasHousing ? 50 : 0;

  // Salary: 0–50 based on avg hourly
  const salaryScore  = opts.avgSalary >= 16 ? 50
    : opts.avgSalary >= 14.5 ? 35
    : opts.avgSalary >= 13 ? 20
    : opts.avgSalary > 0 ? 10
    : 0;

  return {
    slug: opts.slug,
    total: trustScore + jobCountScore + housingScore + salaryScore,
    trustScore,
    jobCountScore,
    housingScore,
    salaryScore,
  };
}

// ─── Tier label helpers ────────────────────────────────────────────────────────

export function getTierLabel(tier: AgencyTrustTier): string {
  switch (tier) {
    case "PLATINUM": return "🏆 Platinum Agency";
    case "GOLD":     return "🥇 Gold Agency";
    case "SILVER":   return "🥈 Silver Agency";
    case "BRONZE":   return "🥉 Bronze Agency";
    default:         return "Agency";
  }
}

export function getTierColor(tier: AgencyTrustTier): string {
  switch (tier) {
    case "PLATINUM": return "bg-purple-50 text-purple-700 border-purple-200";
    case "GOLD":     return "bg-amber-50 text-amber-700 border-amber-200";
    case "SILVER":   return "bg-gray-100 text-gray-600 border-gray-200";
    case "BRONZE":   return "bg-orange-50 text-orange-700 border-orange-200";
    default:         return "bg-gray-50 text-gray-500 border-gray-100";
  }
}
