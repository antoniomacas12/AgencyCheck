/**
 * AgencyCheck — Job Priority Ranking System
 *
 * Defines agency trust tiers and provides a sort function for job lists.
 * Used on city pages, job type pages, combo pages, and the homepage.
 *
 * Sort order:
 *   1. Agency priority (Platinum > Gold > Silver > default)
 *   2. Salary (higher first)
 *   3. Housing (YES > UNKNOWN > NO)
 *   4. Title alphabetical (stable tie-break)
 */

import type { JobListing } from "@/lib/jobData";

// ─── Agency priority tiers ────────────────────────────────────────────────────
// Higher score = shown first. Based on job count, brand recognition, ABU cert.

export const AGENCY_PRIORITY: Record<string, number> = {
  // Platinum — largest job boards, highest trust
  "tempo-team-amsterdam-uitzendbureau": 100,
  "randstad-nederland":                  99,
  "randstad":                            99,  // alias

  // Gold — verified, ABU-certified, meaningful job count
  "otto-workforce":                      85,
  "otto-work-force":                     85,  // legacy alias
  "covebo":                              83,
  "gi-group-temp":                       80,
  "manpower":                            78,

  // Silver — smaller verified agencies
  "profcore":                            60,
  "sba-flex":                            58,
  "pro-industry":                        55,
  "nexst-staffing":                      53,
  "invite-jobs":                         51,
};

export type AgencyTierLabel = "🏆 Platinum" | "🥇 Gold" | "🥈 Silver" | "Agency";

export function getAgencyTierLabel(agencySlug: string): AgencyTierLabel {
  const score = AGENCY_PRIORITY[agencySlug] ?? 0;
  if (score >= 95) return "🏆 Platinum";
  if (score >= 75) return "🥇 Gold";
  if (score >= 50) return "🥈 Silver";
  return "Agency";
}

export function isTopEmployer(agencySlug: string): boolean {
  return (AGENCY_PRIORITY[agencySlug] ?? 0) >= 75;
}

// ─── Housing sort weight ──────────────────────────────────────────────────────
function housingWeight(h: "YES" | "NO" | "UNKNOWN"): number {
  return h === "YES" ? 3 : h === "UNKNOWN" ? 1 : 0;
}

// ─── Main sort function ───────────────────────────────────────────────────────

/**
 * Sort job listings by:
 *   1. Agency priority (highest first)
 *   2. Salary (highest first)
 *   3. Housing (YES > UNKNOWN > NO)
 */
export function rankJobs(jobs: JobListing[]): JobListing[] {
  return [...jobs].sort((a, b) => {
    // 1. Agency priority
    const pa = AGENCY_PRIORITY[a.agencySlug] ?? 30;
    const pb = AGENCY_PRIORITY[b.agencySlug] ?? 30;
    if (pa !== pb) return pb - pa;

    // 2. Salary
    const sa = a.salaryMin > 0 ? a.salaryMin : -1;
    const sb = b.salaryMin > 0 ? b.salaryMin : -1;
    if (sa !== sb) return sb - sa;

    // 3. Housing
    const ha = housingWeight(a.housing);
    const hb = housingWeight(b.housing);
    if (ha !== hb) return hb - ha;

    // 4. Alphabetical title
    return a.title.localeCompare(b.title);
  });
}

// ─── Agency summary for display ───────────────────────────────────────────────

export interface AgencyDisplayInfo {
  slug:      string;
  name:      string;
  tier:      AgencyTierLabel;
  isTop:     boolean;
  priority:  number;
}

export function getAgencyDisplayInfo(slug: string, name: string): AgencyDisplayInfo {
  return {
    slug,
    name,
    tier:     getAgencyTierLabel(slug),
    isTop:    isTopEmployer(slug),
    priority: AGENCY_PRIORITY[slug] ?? 30,
  };
}

// ─── "Top employer" badge props ───────────────────────────────────────────────

export function getTopEmployerBadge(
  agencySlug: string
): { show: boolean; label: string; className: string } | null {
  const tier = getAgencyTierLabel(agencySlug);
  if (tier === "Agency") return null;
  const classMap: Record<AgencyTierLabel, string> = {
    "🏆 Platinum": "bg-purple-50 text-purple-700 border border-purple-200",
    "🥇 Gold":     "bg-amber-50 text-amber-700 border border-amber-200",
    "🥈 Silver":   "bg-gray-100 text-gray-600 border border-gray-200",
    "Agency":      "bg-gray-50 text-gray-500 border border-gray-100",
  };
  return {
    show:      true,
    label:     tier,
    className: classMap[tier],
  };
}
