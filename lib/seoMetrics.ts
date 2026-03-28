/**
 * AgencyCheck — Programmatic SEO Metrics Engine
 *
 * Pre-computes derived data from JOB_LISTINGS at module init time.
 * All functions are O(1) after the first call — safe for SSG/SSR.
 *
 * Derived metrics:
 *  - Average salary per city
 *  - Average salary per job type
 *  - Jobs per city / job type
 *  - Housing availability %
 *  - Top agencies per city / job type
 */

import { JOB_LISTINGS, type JobListing } from "@/lib/jobData";
import { CITIES } from "@/lib/seoData";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AgencyStat {
  slug:  string;
  name:  string;
  count: number;
}

export interface CityMetrics {
  citySlug:    string;
  cityName:    string;
  totalJobs:   number;
  avgSalary:   number;   // gross €/hr, 0 if no salary data
  minSalary:   number;
  maxSalary:   number;
  housingPct:  number;   // 0–100
  topJobTypes: { slug: string; label: string; count: number }[];
  topAgencies: AgencyStat[];
}

export interface JobTypeMetrics {
  jobTypeSlug: string;
  label:       string;
  totalJobs:   number;
  avgSalary:   number;
  minSalary:   number;
  maxSalary:   number;
  housingPct:  number;
  topCities:   { slug: string; name: string; count: number }[];
  topAgencies: AgencyStat[];
}

export interface ComboMetrics {
  totalJobs:  number;
  avgSalary:  number;
  housingPct: number;
  topAgencies: AgencyStat[];
}

// ─── Dutch minimum wage 2026 ──────────────────────────────────────────────────
const WML = 14.71;

/** Normalise salary: treat anything below WML as 0 (data entry error / old data) */
function normSalary(val: number): number {
  return val >= WML ? val : 0;
}

// ─── Build city → jobs lookup ─────────────────────────────────────────────────
// Map city name (lower-cased first word) → JobListing[]
function buildCityMap(): Map<string, JobListing[]> {
  const map = new Map<string, JobListing[]>();
  for (const job of JOB_LISTINGS) {
    if (!job.isActive) continue;
    // Normalise: "Rotterdam" → "rotterdam", "'s-Hertogenbosch" → "'s-hertogenbosch"
    const key = job.city.toLowerCase().trim();
    const existing = map.get(key) ?? [];
    existing.push(job);
    map.set(key, existing);
  }
  return map;
}

// ─── Aggregate helpers ────────────────────────────────────────────────────────

function computeAvgSalary(jobs: JobListing[]): { avg: number; min: number; max: number } {
  const valid = jobs.filter((j) => normSalary(j.salaryMin) > 0);
  if (!valid.length) return { avg: 0, min: 0, max: 0 };
  const salaries = valid.map((j) => normSalary(j.salaryMin));
  const avg  = salaries.reduce((s, v) => s + v, 0) / salaries.length;
  const min  = Math.min(...salaries);
  const max  = Math.max(...valid.map((j) => normSalary(j.salaryMax) || normSalary(j.salaryMin)));
  return {
    avg: Math.round(avg * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
  };
}

function computeHousingPct(jobs: JobListing[]): number {
  if (!jobs.length) return 0;
  return Math.round((jobs.filter((j) => j.housing === "YES").length / jobs.length) * 100);
}

function topAgencies(jobs: JobListing[], limit = 5): AgencyStat[] {
  const counts: Record<string, { name: string; count: number }> = {};
  for (const j of jobs) {
    if (!counts[j.agencySlug]) counts[j.agencySlug] = { name: j.agencyName, count: 0 };
    counts[j.agencySlug].count++;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([slug, d]) => ({ slug, name: d.name, count: d.count }));
}

// ─── City metrics — computed once ─────────────────────────────────────────────

let _cityMetrics: Map<string, CityMetrics> | null = null;

function getCityMetricsMap(): Map<string, CityMetrics> {
  if (_cityMetrics) return _cityMetrics;

  const cityJobMap = buildCityMap();
  _cityMetrics = new Map<string, CityMetrics>();

  for (const city of CITIES) {
    // Match jobs: try exact name, then first word
    const exactKey   = city.name.toLowerCase().trim();
    const firstWord  = city.name.toLowerCase().split(/[\s-]/)[0];

    const jobs: JobListing[] = [];
    for (const [key, list] of cityJobMap) {
      if (key === exactKey || key.startsWith(firstWord)) {
        jobs.push(...list);
      }
    }

    if (!jobs.length) continue; // skip cities with no jobs in DB

    const { avg, min, max } = computeAvgSalary(jobs);

    // Top job types
    const byType: Record<string, number> = {};
    for (const j of jobs) byType[j.jobType] = (byType[j.jobType] ?? 0) + 1;
    const topJobTypes = Object.entries(byType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([slug, count]) => ({
        slug,
        label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        count,
      }));

    _cityMetrics.set(city.slug, {
      citySlug:    city.slug,
      cityName:    city.name,
      totalJobs:   jobs.length,
      avgSalary:   avg,
      minSalary:   min,
      maxSalary:   max,
      housingPct:  computeHousingPct(jobs),
      topJobTypes,
      topAgencies: topAgencies(jobs, 5),
    });
  }

  return _cityMetrics;
}

/** Get pre-computed metrics for a city slug. Returns null if no jobs. */
export function getCityMetrics(citySlug: string): CityMetrics | null {
  return getCityMetricsMap().get(citySlug) ?? null;
}

/** All cities that have at least one job in our dataset */
export function getAllCitiesWithJobs(): CityMetrics[] {
  return [...getCityMetricsMap().values()].sort((a, b) => b.totalJobs - a.totalJobs);
}

// ─── Job type metrics — computed once ────────────────────────────────────────

let _jobTypeMetrics: Map<string, JobTypeMetrics> | null = null;

function getJobTypeMetricsMap(): Map<string, JobTypeMetrics> {
  if (_jobTypeMetrics) return _jobTypeMetrics;
  _jobTypeMetrics = new Map<string, JobTypeMetrics>();

  const allActive = JOB_LISTINGS.filter((j) => j.isActive);

  // Collect all unique job types
  const jobTypes = [...new Set(allActive.map((j) => j.jobType))];

  for (const jobTypeSlug of jobTypes) {
    const jobs = allActive.filter((j) => j.jobType === jobTypeSlug);
    const { avg, min, max } = computeAvgSalary(jobs);

    // Top cities
    const byCityName: Record<string, number> = {};
    for (const j of jobs) byCityName[j.city] = (byCityName[j.city] ?? 0) + 1;
    const topCities = Object.entries(byCityName)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        slug: name.toLowerCase().replace(/['\s]+/g, "-").replace(/[^a-z0-9-]/g, ""),
        name,
        count,
      }));

    _jobTypeMetrics.set(jobTypeSlug, {
      jobTypeSlug,
      label: jobTypeSlug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      totalJobs:   jobs.length,
      avgSalary:   avg,
      minSalary:   min,
      maxSalary:   max,
      housingPct:  computeHousingPct(jobs),
      topCities,
      topAgencies: topAgencies(jobs, 5),
    });
  }

  return _jobTypeMetrics;
}

/** Get pre-computed metrics for a job type slug */
export function getJobTypeMetrics(jobTypeSlug: string): JobTypeMetrics | null {
  return getJobTypeMetricsMap().get(jobTypeSlug) ?? null;
}

/** All job types with their metrics, sorted by job count DESC */
export function getAllJobTypeMetrics(): JobTypeMetrics[] {
  return [...getJobTypeMetricsMap().values()].sort((a, b) => b.totalJobs - a.totalJobs);
}

// ─── Combo metrics ────────────────────────────────────────────────────────────

/** Get metrics for a job type + city combination */
export function getComboMetrics(
  jobTypeSlug: string,
  citySlug: string,
  housingOnly = false
): ComboMetrics {
  const city = CITIES.find((c) => c.slug === citySlug);
  const cityName = city?.name.toLowerCase().split(/[\s-]/)[0] ?? citySlug;

  let jobs = JOB_LISTINGS.filter(
    (j) =>
      j.isActive &&
      j.jobType === jobTypeSlug &&
      j.city.toLowerCase().includes(cityName)
  );

  if (housingOnly) {
    jobs = jobs.filter((j) => j.housing === "YES" || j.housing === "UNKNOWN");
  }

  const { avg } = computeAvgSalary(jobs);

  return {
    totalJobs:   jobs.length,
    avgSalary:   avg,
    housingPct:  computeHousingPct(jobs),
    topAgencies: topAgencies(jobs, 4),
  };
}

// ─── Platform-wide summary ────────────────────────────────────────────────────

export interface PlatformMetrics {
  totalJobs:       number;
  totalWithHousing: number;
  totalCities:     number;
  totalAgencies:   number;
  platformAvgSalary: number;
  topCitiesByJobs: { slug: string; name: string; count: number }[];
  topJobTypes:     { slug: string; label: string; count: number }[];
}

let _platform: PlatformMetrics | null = null;

export function getPlatformMetrics(): PlatformMetrics {
  if (_platform) return _platform;

  const active = JOB_LISTINGS.filter((j) => j.isActive);
  const { avg } = computeAvgSalary(active);

  const byCityCount: Record<string, number> = {};
  for (const j of active) {
    byCityCount[j.city] = (byCityCount[j.city] ?? 0) + 1;
  }
  const topCitiesByJobs = Object.entries(byCityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      slug: name.toLowerCase().replace(/['\s]+/g, "-").replace(/[^a-z0-9-]/g, ""),
      name,
      count,
    }));

  const byTypeCount: Record<string, number> = {};
  for (const j of active) byTypeCount[j.jobType] = (byTypeCount[j.jobType] ?? 0) + 1;
  const topJobTypes = Object.entries(byTypeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([slug, count]) => ({
      slug,
      label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      count,
    }));

  const citySlugsInData = new Set(topCitiesByJobs.map((c) => c.slug));
  const agencySlugs = new Set(active.map((j) => j.agencySlug));

  _platform = {
    totalJobs:         active.length,
    totalWithHousing:  active.filter((j) => j.housing === "YES").length,
    totalCities:       Object.keys(byCityCount).length,
    totalAgencies:     agencySlugs.size,
    platformAvgSalary: avg,
    topCitiesByJobs,
    topJobTypes,
  };

  return _platform;
}
