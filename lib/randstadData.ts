/**
 * AgencyCheck — Randstad Jobs Data Module
 *
 * Source: randstad-scrapper (real scraped jobs from randstad.nl)
 * Dataset: data/randstad-jobs.json  (294 verified jobs, 6 dropped — no location)
 * DO NOT add fake or placeholder entries here.
 */

import rawJobs from "@/data/randstad-jobs.json";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface RandstadJob {
  id:         string;
  title:      string;
  location:   string;
  url:        string;
  agency:     "randstad";
  salary:     string | null;
  hours:      string | null;
  education:  string | null;
  company:    string | null;
}

// ─── Full dataset (as-is from JSON) ───────────────────────────────────────────

export const RANDSTAD_JOBS: RandstadJob[] = rawJobs as RandstadJob[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** All unique cities in the dataset, sorted alphabetically */
export const RANDSTAD_CITIES: string[] = [
  ...new Set(RANDSTAD_JOBS.map((j) => j.location)),
].sort();

/** Jobs grouped by city */
export function getRandstadJobsByCity(city: string): RandstadJob[] {
  return RANDSTAD_JOBS.filter(
    (j) => j.location.toLowerCase() === city.toLowerCase()
  );
}

/** Top N cities by number of available jobs */
export function getTopRandstadCities(
  n = 10
): Array<{ city: string; count: number }> {
  const counts: Record<string, number> = {};
  for (const job of RANDSTAD_JOBS) {
    counts[job.location] = (counts[job.location] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

/** Summary stats for display */
export const RANDSTAD_STATS = {
  total:     RANDSTAD_JOBS.length,
  cities:    RANDSTAD_CITIES.length,
  withSalary: RANDSTAD_JOBS.filter((j) => j.salary !== null).length,
} as const;
