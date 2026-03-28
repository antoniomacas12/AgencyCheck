/**
 * AgencyCheck — City-level data utilities
 * Aggregates canonical agencies, jobs, reviews, and issue signals per city.
 */

import { AGENCIES }          from "./agencyData";
import { getJobsByCity, JOB_CITIES, JOB_TYPE_META } from "./jobData";
import { REVIEW_SEED_DATA }  from "./reviewData";
import { JOB_SALARY_DATA }   from "./seoData";

// ─── City character data ──────────────────────────────────────────────────────
// Unique, worker-focused descriptions for major logistics cities.

export interface CityCharacter {
  intro:        string;       // worker-focused 1-sentence intro
  logisticsNote: string;      // why workers come here
  housingNote?:  string;      // housing situation note
  topJobTypes:   string[];    // most common job types (job slugs)
  salaryNote:    string;      // salary context
}

const CITY_CHARACTERS: Record<string, CityCharacter> = {
  Rotterdam: {
    intro: "Europe's largest port city and one of the Netherlands' biggest employers of agency workers in logistics, port operations, and distribution.",
    logisticsNote: "Europoort, Maasvlakte, and the broader port complex employ tens of thousands of workers in container handling, warehousing, and cross-docking.",
    housingNote: "Housing in Rotterdam is expensive. Agencies providing accommodation are valuable — confirm the weekly deduction and room occupancy before signing.",
    topJobTypes: ["forklift-driver", "logistics-operator", "warehouse-worker", "reach-truck-driver"],
    salaryNote: "Port logistics roles in Rotterdam often pay €14–€17/hr for certified forklift and reach-truck drivers.",
  },
  Tilburg: {
    intro: "A major distribution hub in Noord-Brabant with a dense cluster of logistics parks and fulfilment centres serving the Benelux.",
    logisticsNote: "Tilburg hosts large e-commerce fulfilment and fashion logistics operations. Order-picker and packing roles dominate the market.",
    housingNote: "Many agencies active in Tilburg offer housing, but accommodation is often shared. Ask how many workers per room and what the weekly deduction is.",
    topJobTypes: ["order-picker", "packing-operator", "warehouse-worker", "production-worker"],
    salaryNote: "E-commerce and fashion fulfilment roles typically pay €14.71–€15.50/hr in Tilburg.",
  },
  Eindhoven: {
    intro: "The technology and manufacturing capital of Noord-Brabant, with strong demand for production workers, technical operators, and logistics staff.",
    logisticsNote: "ASML, Philips, and dozens of production suppliers create consistent demand for agency workers in production and technical roles.",
    housingNote: "Eindhoven has competitive housing demand. Agencies offering accommodation are useful, but verify the condition and cost before accepting.",
    topJobTypes: ["production-worker", "warehouse-worker", "order-picker", "logistics-operator"],
    salaryNote: "Technical production roles can reach €15–€17/hr. Standard warehouse roles start at WML (€14.71/hr).",
  },
  Venlo: {
    intro: "The logistics gateway between the Netherlands and Germany — one of the highest concentrations of distribution centres in Europe.",
    logisticsNote: "Venlo is a cross-border logistics hub. Many DCs operate 24/7 with night and weekend shifts offering significant premium pay.",
    housingNote: "Several agencies in Venlo provide housing to attract workers from elsewhere. Shared housing with transit workers is common here.",
    topJobTypes: ["reach-truck-driver", "forklift-driver", "logistics-operator", "warehouse-worker"],
    salaryNote: "Night shifts and 24/7 operations in Venlo mean premium pay. Night allowances can add €2–€3/hr on top of the base rate.",
  },
  Utrecht: {
    intro: "The geographic centre of the Netherlands and home to major distribution networks, retail logistics, and business services.",
    logisticsNote: "Utrecht's central location makes it a key node for national distribution. Good public transport connectivity attracts workers from neighbouring cities.",
    housingNote: "Utrecht is expensive to rent privately. Agencies with housing in the region are valuable, but costs are higher than in Brabant.",
    topJobTypes: ["logistics-operator", "warehouse-worker", "order-picker", "production-worker"],
    salaryNote: "Logistics roles in Utrecht typically pay €14–€16/hr. Transport operators earn more due to licence requirements.",
  },
  Amsterdam: {
    intro: "The capital's port area, Schiphol cargo zone, and urban fulfilment operations create steady demand for logistics and warehouse workers.",
    logisticsNote: "Amsterdam West and Amsterdam Westpoort host major distribution and retail fulfilment operations. Schiphol cargo is nearby.",
    housingNote: "Amsterdam is the most expensive city in the Netherlands for housing. Agency-provided accommodation commands premium deductions — confirm before accepting.",
    topJobTypes: ["warehouse-worker", "order-picker", "logistics-operator", "forklift-driver"],
    salaryNote: "Amsterdam's higher cost of living means agencies often offer €14.50–€17/hr to compete. Always negotiate above WML in this market.",
  },
  Breda: {
    intro: "A growing logistics cluster in Noord-Brabant positioned between Rotterdam, Antwerp, and Eindhoven with strong warehouse demand.",
    logisticsNote: "Breda's location on key road and rail corridors attracts national and international distribution operations.",
    housingNote: "Breda housing is more affordable than Randstad cities. Some agencies provide accommodation — reasonable conditions at typically €85–€95/week.",
    topJobTypes: ["order-picker", "warehouse-worker", "forklift-driver", "packing-operator"],
    salaryNote: "Standard warehouse rates in Breda start at €14.71/hr (WML). Forklift-certified workers earn €15–€16.50/hr.",
  },
  Waalwijk: {
    intro: "The logistics heart of Noord-Brabant — home to Europe's largest concentration of shoe, fashion, and FMCG distribution centres.",
    logisticsNote: "Waalwijk hosts massive DCs for Nike, Lidl, and Jumbo among others. High demand for order pickers and packing operators year-round.",
    housingNote: "Limited local housing stock means many workers come from other cities via transport or agency housing. Confirm transport arrangement before starting.",
    topJobTypes: ["order-picker", "packing-operator", "warehouse-worker", "reach-truck-driver"],
    salaryNote: "Fashion DC operations in Waalwijk typically pay €14.71–€15/hr. Night and weekend shifts carry premium rates.",
  },
  Venray: {
    intro: "A logistics growth area in Limburg with large DCs attracted by low land costs and good road access to Germany and Belgium.",
    logisticsNote: "Several large pharmaceutical and consumer goods DCs operate in Venray. Stable, 24/7 operations offer consistent hours.",
    housingNote: "Venray is rural — agency housing is essential for most workers coming from cities. Conditions vary; request a property visit before signing.",
    topJobTypes: ["warehouse-worker", "order-picker", "forklift-driver", "production-worker"],
    salaryNote: "Rates in Venray are typically €14.71–€15.50/hr. Night and weekend premiums can significantly boost earnings.",
  },
  Schiphol: {
    intro: "Amsterdam Airport Schiphol is one of Europe's busiest cargo airports, creating high demand for logistics, ramp, and airside warehouse workers.",
    logisticsNote: "Schiphol cargo operations include air freight handling, express courier sorting, and perishables logistics. Fast-paced, 24/7 operations.",
    housingNote: "Most Schiphol workers commute from Amsterdam or surrounding towns. Few agencies offer housing specifically for Schiphol roles.",
    topJobTypes: ["logistics-operator", "warehouse-worker", "order-picker", "forklift-driver"],
    salaryNote: "Airside logistics at Schiphol attracts higher rates — €15–€18/hr — reflecting airport security clearance requirements.",
  },
};

const DEFAULT_CHARACTER: CityCharacter = {
  intro: "An employment agency hub in the Netherlands with active demand for logistics, warehouse, and production workers.",
  logisticsNote: "Local industrial zones and distribution parks create regular demand for agency workers across shift patterns.",
  topJobTypes: ["warehouse-worker", "order-picker", "production-worker"],
  salaryNote: "Most warehouse and logistics roles pay €14.71–€15/hr depending on shifts and certifications.",
};

export function getCityCharacter(cityName: string): CityCharacter {
  return CITY_CHARACTERS[cityName] ?? DEFAULT_CHARACTER;
}

// ─── Agency helpers ───────────────────────────────────────────────────────────

/** All agencies active in a city, sorted by reliability score desc */
export function getCityAgencies(cityName: string) {
  return AGENCIES
    .filter((a) => a.cities.some((c) => c.toLowerCase() === cityName.toLowerCase()))
    .sort((a, b) => b.score - a.score);
}

/** Only housing-confirmed agencies in a city */
export function getCityHousingAgencies(cityName: string) {
  return getCityAgencies(cityName).filter((a) => a.housing === "YES");
}

/** Agencies where housing is unknown */
export function getCityMaybeHousingAgencies(cityName: string) {
  return getCityAgencies(cityName).filter((a) => a.housing === "UNKNOWN");
}

/** Agencies where transport is confirmed */
export function getCityTransportAgencies(cityName: string) {
  return getCityAgencies(cityName).filter((a) => a.transport === "YES");
}

// ─── Jobs helpers ─────────────────────────────────────────────────────────────

/** Whether this city has job listings in the dataset */
export function cityHasJobs(cityName: string): boolean {
  return JOB_CITIES.some((c) => c.toLowerCase() === cityName.toLowerCase());
}

/** Active job listings for this city, sorted by salary descending */
export function getCityJobs(cityName: string) {
  return getJobsByCity(cityName).sort((a, b) => b.salaryMax - a.salaryMax);
}

/** Jobs with housing in this city */
export function getCityJobsWithHousing(cityName: string) {
  return getCityJobs(cityName).filter((j) => j.housing === "YES");
}

/** Job type breakdown: how many active jobs per type in this city */
export function getCityJobTypes(cityName: string): { type: string; count: number; meta: typeof JOB_TYPE_META[string] }[] {
  const jobs = getCityJobs(cityName);
  const counts: Record<string, number> = {};
  for (const j of jobs) {
    counts[j.jobType] = (counts[j.jobType] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count, meta: JOB_TYPE_META[type] ?? { title: type, icon: "💼", description: "" } }));
}

// ─── Review & issue helpers ───────────────────────────────────────────────────

/** All seed reviews for agencies active in this city */
export function getCityReviews(cityName: string) {
  const agencies = getCityAgencies(cityName);
  const slugSet  = new Set(agencies.map((a) => a.slug));
  return REVIEW_SEED_DATA.filter((r) => slugSet.has(r.agencySlug));
}

/** Aggregated issue tag counts for agencies in this city */
export function getCityIssueTags(cityName: string): { tag: string; count: number }[] {
  const reviews = getCityReviews(cityName);
  const counts: Record<string, number> = {};
  for (const r of reviews) {
    for (const t of r.issueTags) {
      counts[t] = (counts[t] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
}

/** Average overall rating across all reviews for agencies in this city */
export function getCityAvgRating(cityName: string): number | null {
  const reviews = getCityReviews(cityName);
  if (reviews.length === 0) return null;
  return reviews.reduce((s, r) => s + r.overallRating, 0) / reviews.length;
}

// ─── Salary helpers ───────────────────────────────────────────────────────────

/** Salary slugs relevant for this city — includes all top jobs */
export function getCitySalarySlugs(): string[] {
  return Object.keys(JOB_SALARY_DATA).slice(0, 6);
}

// ─── Issue tag display config ─────────────────────────────────────────────────

export const ISSUE_TAG_DISPLAY: Record<string, { label: string; negative: boolean; icon: string }> = {
  housing_crowded:    { label: "Overcrowded housing",     negative: true,  icon: "🏚️" },
  housing_dirty:      { label: "Poor housing condition",  negative: true,  icon: "⚠️" },
  housing_good:       { label: "Good housing",            negative: false, icon: "🏠" },
  housing_clean:      { label: "Clean accommodation",     negative: false, icon: "✅" },
  late_salary:        { label: "Late salary payments",    negative: true,  icon: "🕐" },
  fair_pay:           { label: "Fair/above-average pay",  negative: false, icon: "💶" },
  below_average_pay:  { label: "Below average pay",       negative: true,  icon: "📉" },
  transport_good:     { label: "Transport reliable",      negative: false, icon: "🚌" },
  transport_delays:   { label: "Transport unreliable",    negative: true,  icon: "⏱️" },
  no_transport:       { label: "No transport provided",   negative: true,  icon: "❌" },
  missing_overtime:   { label: "Overtime not paid",       negative: true,  icon: "⏰" },
  overtime_paid:      { label: "Overtime paid correctly", negative: false, icon: "✅" },
  unclear_contract:   { label: "Unclear contract terms",  negative: true,  icon: "📋" },
  fair_contract:      { label: "Fair contract terms",     negative: false, icon: "📄" },
  management_poor:    { label: "Poor management",         negative: true,  icon: "⚠️" },
  management_ok:      { label: "Reasonable management",   negative: false, icon: "👍" },
  management_good:    { label: "Good management",         negative: false, icon: "⭐" },
  payslip_errors:     { label: "Payslip errors reported", negative: true,  icon: "📄" },
  payslip_ok:         { label: "Payslip accurate",        negative: false, icon: "✅" },
  communication_poor: { label: "Hard to reach agency",    negative: true,  icon: "📵" },
  communication_good: { label: "Agency easy to reach",    negative: false, icon: "💬" },
};
