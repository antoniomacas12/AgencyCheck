// AgencyCheck — Search Logic
// Pure functions: no DB calls, no side effects. Replace data source in search/page.tsx.

import type { AgencyCardData } from "@/lib/agencyData";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchParams {
  job?:       string;
  city?:      string;
  housing?:   string; // "yes" | "no" | ""
  salaryMin?: string; // numeric string, €/hr
  salaryMax?: string; // numeric string, €/hr
}

export interface ActiveFilter {
  key:   string;
  label: string;
}

// ─── Category expansion map ───────────────────────────────────────────────────
// Keys are common search terms workers type.
// Values are all terms that should match when a key is searched.
// If a query matches a key OR any of its values, expand to all values.

const CATEGORY_EXPANSIONS: Record<string, string[]> = {
  warehouse:   [
    "warehouse", "warehouse worker", "order picker", "order picking",
    "packer", "packing operator", "logistics assistant", "stock picker", "picking",
  ],
  order:       ["order picker", "order picking", "warehouse worker", "stock picker"],
  picker:      ["order picker", "picker", "stock picker", "warehouse worker"],
  packing:     ["packing operator", "packer", "order picker", "warehouse worker"],
  packer:      ["packer", "packing operator", "order picker", "warehouse worker"],
  logistics:   [
    "logistics assistant", "logistics", "warehouse worker", "forklift driver",
    "order picker", "transport",
  ],
  production:  [
    "production worker", "production", "assembly worker", "factory worker",
    "manufacturing", "industrial worker",
  ],
  assembly:    ["assembly worker", "production worker", "manufacturing", "factory worker"],
  forklift:    ["forklift driver", "forklift operator", "reach truck operator", "warehouse worker"],
  transport:   ["truck driver", "transport worker", "driver", "logistics assistant"],
  driver:      ["truck driver", "driver", "transport worker", "logistics assistant"],
  cleaning:    ["cleaning staff", "cleaner", "janitor", "housekeeping", "schoonmaker"],
};

// ─── Keyword expansion ────────────────────────────────────────────────────────

/**
 * Given a raw query string, return all terms that should be matched against.
 * "warehouse" → ["warehouse", "warehouse worker", "order picker", "packer", ...]
 */
export function expandSearchTerms(query: string): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const terms = new Set<string>([q]);

  for (const [key, synonyms] of Object.entries(CATEGORY_EXPANSIONS)) {
    // Match if the query is related to this category key or any of its synonyms
    const allTerms = [key, ...synonyms];
    const isRelated = allTerms.some(
      (t) => t.includes(q) || q.includes(t)
    );
    if (isRelated) {
      synonyms.forEach((s) => terms.add(s));
    }
  }

  return [...terms];
}

// ─── Agency matching ──────────────────────────────────────────────────────────

/**
 * Check if an agency matches a set of search terms.
 * Matches against: name, description, jobTitles.
 */
function agencyMatchesKeyword(agency: AgencyCardData, terms: string[]): boolean {
  const fields = [
    agency.name.toLowerCase(),
    (agency.description ?? "").toLowerCase(),
    (agency.jobTypes ?? "").toLowerCase(),           // canonical jobTypes field
    ...(agency.jobTitles ?? []).map((j) => j.toLowerCase()),
    ...(agency.aliases ?? []).map((a) => a.toLowerCase()), // match aliases too
  ];

  return terms.some((term) => fields.some((field) => field.includes(term)));
}

// ─── Main search function ─────────────────────────────────────────────────────

/**
 * Filter and sort agencies based on search params.
 * Returns results sorted by score descending.
 */
export function searchAgencies(
  agencies: AgencyCardData[],
  params: SearchParams
): AgencyCardData[] {
  let results = [...agencies];

  // ── Keyword / job title filter ────────────────────────────────────────────
  if (params.job?.trim()) {
    const terms = expandSearchTerms(params.job.trim());
    results = results.filter((a) => agencyMatchesKeyword(a, terms));
  }

  // ── City filter ───────────────────────────────────────────────────────────
  if (params.city?.trim()) {
    const c = params.city.trim().toLowerCase();
    results = results.filter((a) => {
      const primaryMatch = (a.city ?? "").toLowerCase().includes(c);
      const citiesMatch  = (a.cities ?? []).some((city) => city.toLowerCase().includes(c));
      return primaryMatch || citiesMatch;
    });
  }

  // ── Housing filter ────────────────────────────────────────────────────────
  if (params.housing === "yes") {
    results = results.filter((a) => a.housing === "YES");
  } else if (params.housing === "no") {
    results = results.filter((a) => a.housing === "NO");
  }

  // ── Salary min filter (€/hr) ──────────────────────────────────────────────
  const salaryMin = params.salaryMin ? parseFloat(params.salaryMin) : null;
  if (salaryMin !== null && !isNaN(salaryMin)) {
    results = results.filter(
      (a) => a.avgHourlyPay != null && a.avgHourlyPay >= salaryMin
    );
  }

  // ── Salary max filter (€/hr) ──────────────────────────────────────────────
  const salaryMax = params.salaryMax ? parseFloat(params.salaryMax) : null;
  if (salaryMax !== null && !isNaN(salaryMax)) {
    results = results.filter(
      (a) => a.avgHourlyPay != null && a.avgHourlyPay <= salaryMax
    );
  }

  // Sort by agency score descending
  return results.sort((a, b) => b.score - a.score);
}

// ─── Active filter helpers ────────────────────────────────────────────────────

/**
 * Convert search params into a list of human-readable active filter chips.
 */
export function getActiveFilters(params: SearchParams): ActiveFilter[] {
  const filters: ActiveFilter[] = [];

  if (params.job?.trim()) {
    filters.push({ key: "job", label: `"${params.job}"` });
  }
  if (params.city?.trim()) {
    filters.push({ key: "city", label: `📍 ${params.city}` });
  }
  if (params.housing === "yes") {
    filters.push({ key: "housing", label: "🏠 With housing" });
  }
  if (params.housing === "no") {
    filters.push({ key: "housing", label: "No housing" });
  }
  if (params.salaryMin?.trim()) {
    filters.push({ key: "salaryMin", label: `Min €${params.salaryMin}/hr` });
  }
  if (params.salaryMax?.trim()) {
    filters.push({ key: "salaryMax", label: `Max €${params.salaryMax}/hr` });
  }

  return filters;
}

/**
 * Return true if any search params are set.
 */
export function hasActiveFilters(params: SearchParams): boolean {
  return !!(
    params.job?.trim() ||
    params.city?.trim() ||
    params.housing ||
    params.salaryMin?.trim() ||
    params.salaryMax?.trim()
  );
}
