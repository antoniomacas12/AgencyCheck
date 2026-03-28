/**
 * AgencyCheck — Programmatic SEO Route Registry v2
 *
 * Central source of truth for all dynamically generated pages.
 * Covers 12 job types × 50 cities = 600+ possible combo pages.
 *
 * Used by generateStaticParams() in:
 *   - app/jobs-in-[city]/page.tsx
 *   - app/[combo]/page.tsx
 */

import { CITIES, type CityData } from "@/lib/seoData";
import { JOB_LISTINGS } from "@/lib/jobData";

// ─── Re-export for convenience ────────────────────────────────────────────────
export type { CityData } from "@/lib/seoData";

// ─── SEO job type registry ────────────────────────────────────────────────────
// prefix  — used in the URL slug (e.g. "forklift" → /forklift-jobs-amsterdam)
// slug    — matches JobListing.jobType in jobData.ts
// Salary figures updated for Dutch market 2026; all ≥ WML (€14.71/hr)

export interface SeoJobType {
  prefix:      string;
  slug:        string;
  label:       string;
  labelNL:     string;
  icon:        string;
  salaryMin:   number;
  salaryMax:   number;
  avgSalary:   number;
  description: string;  // one-sentence role summary
}

export const SEO_JOB_TYPES: SeoJobType[] = [
  {
    prefix:      "forklift",
    slug:        "forklift-driver",
    label:       "Forklift Driver",
    labelNL:     "Heftruckchauffeur",
    icon:        "🚜",
    salaryMin:   14.50,
    salaryMax:   19.00,
    avgSalary:   16.00,
    description: "Operating counterbalance forklifts and pallet trucks in logistics and industrial environments across the Netherlands.",
  },
  {
    prefix:      "warehouse",
    slug:        "warehouse-worker",
    label:       "Warehouse Worker",
    labelNL:     "Magazijnmedewerker",
    icon:        "🏭",
    salaryMin: 14.71,
    salaryMax:   16.50,
    avgSalary:   14.80,
    description: "General warehouse duties including receiving, put-away, stock management, and order fulfilment in Dutch distribution centres.",
  },
  {
    prefix:      "order-picker",
    slug:        "order-picker",
    label:       "Order Picker",
    labelNL:     "Orderpicker",
    icon:        "📦",
    salaryMin: 14.71,
    salaryMax:   16.00,
    avgSalary:   14.50,
    description: "Picking products from warehouse shelves using voice-directed or RF-scanner systems in fulfilment and distribution centres.",
  },
  {
    prefix:      "production",
    slug:        "production-worker",
    label:       "Production Worker",
    labelNL:     "Productiemedewerker",
    icon:        "⚙️",
    salaryMin: 14.71,
    salaryMax:   16.50,
    avgSalary:   15.00,
    description: "Assembly, packaging, and processing tasks on production lines in food, pharmaceutical, and manufacturing facilities.",
  },
  {
    prefix:      "reach-truck",
    slug:        "reach-truck-driver",
    label:       "Reach Truck Driver",
    labelNL:     "Reachtruck Chauffeur",
    icon:        "🏗️",
    salaryMin:   15.00,
    salaryMax:   20.00,
    avgSalary:   17.00,
    description: "Operating stand-up reach trucks in high-bay racking systems up to 12m; MHE certificate required.",
  },
  {
    prefix:      "logistics",
    slug:        "logistics-operator",
    label:       "Logistics Operator",
    labelNL:     "Logistiek Medewerker",
    icon:        "🚚",
    salaryMin: 14.71,
    salaryMax:   17.50,
    avgSalary:   15.50,
    description: "Broad logistics role covering inbound, outbound, cross-docking, and inventory management in transport hubs.",
  },
  {
    prefix:      "packing",
    slug:        "packing-operator",
    label:       "Packing Operator",
    labelNL:     "Inpakker",
    icon:        "📫",
    salaryMin: 14.71,
    salaryMax:   15.50,
    avgSalary:   14.30,
    description: "Packing, labelling, and preparing products for shipment in e-commerce, food, and manufacturing environments.",
  },
  {
    prefix:      "machine-operator",
    slug:        "machine-operator",
    label:       "Machine Operator",
    labelNL:     "Machineoperator",
    icon:        "🔩",
    salaryMin:   14.50,
    salaryMax:   17.00,
    avgSalary:   15.50,
    description: "Setting up, operating, and monitoring industrial production machines; first-line troubleshooting required.",
  },
  {
    prefix:      "truck-driver",
    slug:        "truck-driver",
    label:       "Truck Driver",
    labelNL:     "Vrachtwagenchauffeur",
    icon:        "🚛",
    salaryMin:   15.00,
    salaryMax:   21.00,
    avgSalary:   17.50,
    description: "Local and long-haul freight delivery across the Netherlands and EU; CE licence required for articulated vehicles.",
  },
  {
    prefix:      "greenhouse",
    slug:        "greenhouse-worker",
    label:       "Greenhouse Worker",
    labelNL:     "Kasmedewerker",
    icon:        "🌿",
    salaryMin: 14.71,
    salaryMax:   15.00,
    avgSalary:   14.20,
    description: "Cultivation, harvesting, and packaging in Dutch greenhouse horticulture; seasonal peaks in spring and summer.",
  },
  {
    prefix:      "assembly",
    slug:        "assembly-worker",
    label:       "Assembly Worker",
    labelNL:     "Assemblagemedewerker",
    icon:        "🔧",
    salaryMin: 14.71,
    salaryMax:   16.50,
    avgSalary:   14.80,
    description: "Assembling components and sub-assemblies in automotive, electronics, and consumer goods manufacturing.",
  },
  {
    prefix:      "cleaning",
    slug:        "cleaning-staff",
    label:       "Cleaning Staff",
    labelNL:     "Schoonmaakmedewerker",
    icon:        "🧹",
    salaryMin: 14.71,
    salaryMax:   14.50,
    avgSalary:   14.15,
    description: "Professional cleaning of industrial sites, offices, and public buildings under agency contract.",
  },
];

// Fast lookups
export const SEO_JOB_TYPE_BY_PREFIX: Record<string, SeoJobType> =
  Object.fromEntries(SEO_JOB_TYPES.map((j) => [j.prefix, j]));

export const SEO_JOB_TYPE_BY_SLUG: Record<string, SeoJobType> =
  Object.fromEntries(SEO_JOB_TYPES.map((j) => [j.slug, j]));

// ─── Cities for programmatic pages ───────────────────────────────────────────

/** All cities with population ≥ 50k — used for combo pages (job type + city) */
export const SEO_TOP_CITIES: CityData[] = CITIES.filter(
  (c) => c.population >= 50000
).sort((a, b) => b.population - a.population);

/** Top 30 cities by population — used for combo page generateStaticParams */
export const SEO_COMBO_CITIES: CityData[] = SEO_TOP_CITIES.slice(0, 30);

/** All cities with population ≥ 10k — used for city hub pages */
export const SEO_ALL_CITIES: CityData[] = CITIES.filter(
  (c) => c.population >= 10000
).sort((a, b) => b.population - a.population);

// ─── Slug parser ──────────────────────────────────────────────────────────────

export type ParsedComboSlug =
  | { type: "national-jobtype";     jobType: SeoJobType }
  | { type: "city-jobtype";         jobType: SeoJobType; city: CityData }
  | { type: "city-jobtype-housing"; jobType: SeoJobType; city: CityData }
  | { type: "national-housing" }
  | null;

export function parseComboSlug(slug: string): ParsedComboSlug {
  if (slug === "jobs-with-accommodation-netherlands") {
    return { type: "national-housing" };
  }

  for (const jobType of SEO_JOB_TYPES) {
    const base = `${jobType.prefix}-jobs-`;
    if (!slug.startsWith(base)) continue;

    const rest           = slug.slice(base.length);
    const HOUSING_SUFFIX = "-with-accommodation";

    if (rest.endsWith(HOUSING_SUFFIX)) {
      const citySlug = rest.slice(0, -HOUSING_SUFFIX.length);
      if (citySlug === "netherlands") {
        // Treat as national housing page for this job type — redirect to national-housing
        return { type: "national-housing" };
      }
      const city = CITIES.find((c) => c.slug === citySlug);
      if (!city) return null;
      return { type: "city-jobtype-housing", jobType, city };
    }

    if (rest === "netherlands") {
      return { type: "national-jobtype", jobType };
    }

    const city = CITIES.find((c) => c.slug === rest);
    if (city) return { type: "city-jobtype", jobType, city };
  }

  return null;
}

// ─── generateStaticParams helpers ────────────────────────────────────────────

/** All params for app/[combo]/page.tsx */
export function getAllComboParams(): { combo: string }[] {
  const params: { combo: string }[] = [];

  // 1. National job type pages (12)
  for (const jt of SEO_JOB_TYPES) {
    params.push({ combo: `${jt.prefix}-jobs-netherlands` });
  }

  // 2. City + job type combos — top 30 cities × 12 job types = 360
  for (const jt of SEO_JOB_TYPES) {
    for (const city of SEO_COMBO_CITIES) {
      params.push({ combo: `${jt.prefix}-jobs-${city.slug}` });
    }
  }

  // 3. City + job type + housing — top 15 cities × 12 = 180
  for (const jt of SEO_JOB_TYPES) {
    for (const city of SEO_COMBO_CITIES.slice(0, 15)) {
      params.push({ combo: `${jt.prefix}-jobs-${city.slug}-with-accommodation` });
    }
  }

  // 4. National housing landing
  params.push({ combo: "jobs-with-accommodation-netherlands" });

  return params;
}

// ─── Job data helpers (used by page components) ───────────────────────────────

/** Get active jobs for a city slug */
export function getJobsForCity(citySlug: string) {
  const city = CITIES.find((c) => c.slug === citySlug);
  if (!city) return [];
  const nameKey = city.name.toLowerCase().split(/[\s-]/)[0];
  return JOB_LISTINGS.filter(
    (j) => j.isActive && j.city.toLowerCase().includes(nameKey)
  );
}

/** Get active jobs for a job type + optional city slug */
export function getJobsForTypeAndCity(jobTypeSlug: string, citySlug?: string) {
  let jobs = JOB_LISTINGS.filter((j) => j.isActive && j.jobType === jobTypeSlug);
  if (citySlug) {
    const city = CITIES.find((c) => c.slug === citySlug);
    const nameKey = city?.name.toLowerCase().split(/[\s-]/)[0] ?? citySlug;
    jobs = jobs.filter((j) => j.city.toLowerCase().includes(nameKey));
  }
  return jobs;
}

/** Compute avg salary for a job list; returns 0 if no valid salaries */
export function avgSalaryForJobs(jobs: ReturnType<typeof getJobsForCity>): number {
  const WML   = 14.71;
  const valid = jobs.filter((j) => j.salaryMin >= WML);
  if (!valid.length) return 0;
  return Math.round(
    (valid.reduce((s, j) => s + j.salaryMin, 0) / valid.length) * 100
  ) / 100;
}

/** Housing availability % (0–100) */
export function housingPctForJobs(jobs: ReturnType<typeof getJobsForCity>): number {
  if (!jobs.length) return 0;
  return Math.round((jobs.filter((j) => j.housing === "YES").length / jobs.length) * 100);
}

/** Top N agencies by job count */
export function topAgenciesForJobs(
  jobs: ReturnType<typeof getJobsForCity>,
  limit = 5
): { slug: string; name: string; count: number }[] {
  const counts: Record<string, { name: string; count: number }> = {};
  for (const j of jobs) {
    if (!counts[j.agencySlug])
      counts[j.agencySlug] = { name: j.agencyName, count: 0 };
    counts[j.agencySlug].count++;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([slug, d]) => ({ slug, name: d.name, count: d.count }));
}
