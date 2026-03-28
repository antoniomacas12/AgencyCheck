/**
 * AgencyCheck — Tempo-Team Jobs Data Module
 *
 * Source: tempo-team-scrapper (real scraped jobs from tempo-team.nl)
 * Dataset: data/tempo-team-jobs.json (135 verified jobs)
 * DO NOT add fake or placeholder entries here.
 */

import rawJobs from "@/data/tempo-team-jobs.json";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface TempoTeamJob {
  id:       string;
  title:    string;
  location: string;
  salary:   string | null;
  hours:    string | null;
  url:      string;
  agency:   "tempo-team";
}

// ─── Full dataset (as-is from JSON) ───────────────────────────────────────────

export const TEMPO_TEAM_JOBS: TempoTeamJob[] = rawJobs as TempoTeamJob[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** All unique cities in the dataset, sorted alphabetically */
export const TEMPO_TEAM_CITIES: string[] = [
  ...new Set(TEMPO_TEAM_JOBS.map((j) => j.location)),
].sort();

/** Jobs grouped by city */
export function getTempoTeamJobsByCity(city: string): TempoTeamJob[] {
  return TEMPO_TEAM_JOBS.filter(
    (j) => j.location.toLowerCase() === city.toLowerCase()
  );
}

/** Top N cities by number of available jobs */
export function getTopTempoTeamCities(
  n = 10
): Array<{ city: string; count: number }> {
  const counts: Record<string, number> = {};
  for (const job of TEMPO_TEAM_JOBS) {
    counts[job.location] = (counts[job.location] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

/** Summary stats for display */
export const TEMPO_TEAM_STATS = {
  total:      TEMPO_TEAM_JOBS.length,
  cities:     TEMPO_TEAM_CITIES.length,
  withSalary: TEMPO_TEAM_JOBS.filter((j) => j.salary !== null).length,
};
