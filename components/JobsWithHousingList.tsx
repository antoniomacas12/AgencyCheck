"use client";

/**
 * JobsWithHousingList
 *
 * Client component — renders the filtered/sorted job cards for the
 * jobs-with-accommodation page. Receives pre-computed listings from the
 * server component so it hydrates instantly with no extra data fetch.
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import type { JobListing } from "@/lib/jobData";

// ─── Constants ────────────────────────────────────────────────────────────────

const WML = 14.06; // Dutch minimum wage 2026 — used to gate salary display

// Popularity ranking for "Most popular" sort (lower = more common)
const JOB_TYPE_RANK: Record<string, number> = {
  "order-picker":       1,
  "production-worker":  2,
  "warehouse-worker":   3,
  "forklift-driver":    4,
  "packer":             5,
  "machine-operator":   6,
  "driver":             7,
  "greenhouse-worker":  8,
  "cleaner":            9,
};

type SortMode = "net_salary" | "popular";

// ─── Salary helper ────────────────────────────────────────────────────────────

function netWeeklySalary(job: JobListing): { keepMin: number; keepMax: number } | null {
  if (job.salaryMin < WML) return null;
  return {
    keepMin: Math.round(job.salaryMin * 40 * 0.78) - 140,
    keepMax: Math.round(job.salaryMax * 40 * 0.78) - 140,
  };
}

// Format job type slug → human readable ("order-picker" → "Order Picker")
function fmtJobType(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// ─── Job card ─────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: JobListing }) {
  const net = netWeeklySalary(job);

  return (
    <div className="card p-0 overflow-hidden flex flex-col hover:shadow-lg hover:border-green-200 hover:-translate-y-0.5 transition-all">

      {/* Salary band */}
      {net ? (
        <div className="bg-green-600 px-3.5 pt-3 pb-2.5">
          <p className="text-[9px] font-black uppercase tracking-widest text-green-200 mb-0.5">
            You keep / week
          </p>
          <p className="text-2xl font-black text-white leading-none">
            €{net.keepMin}–€{net.keepMax}
            <span className="text-sm font-normal text-green-200">/wk</span>
          </p>
          <p className="text-[9px] text-green-300 mt-0.5">after housing, tax &amp; costs</p>
        </div>
      ) : job.salaryMin > 0 ? (
        <div className="bg-gray-700 px-3.5 pt-3 pb-2.5">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-0.5">Gross hourly</p>
          <p className="text-xl font-black text-white leading-none">
            €{job.salaryMin.toFixed(2)}–€{job.salaryMax.toFixed(2)}
            <span className="text-sm font-normal text-gray-300">/hr</span>
          </p>
        </div>
      ) : (
        <div className="bg-gray-100 px-3.5 pt-3 pb-2.5">
          <p className="text-xs text-gray-500">Salary on request</p>
        </div>
      )}

      {/* Job info */}
      <div className="px-3.5 py-2.5 flex items-start gap-2.5 flex-1">
        <span className="text-xl shrink-0 mt-0.5">{job.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate leading-tight">{job.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">📍 {job.city}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{job.agencyName}</p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 rounded-full px-1.5 py-0.5 font-semibold">
              🏠 Housing included
            </span>
            {job.transport === "YES" && (
              <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-1.5 py-0.5">
                🚌 Transport
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Apply button */}
      <div className="px-3.5 pb-3.5 pt-1">
        <Link
          href={`/jobs/${job.slug}`}
          className="block w-full text-center py-2 rounded-lg bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 active:scale-[0.99] transition"
        >
          View job →
        </Link>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  listings: JobListing[];
}

export default function JobsWithHousingList({ listings }: Props) {
  const [sort,       setSort]       = useState<SortMode>("net_salary");
  const [filterCity, setFilterCity] = useState("");
  const [filterType, setFilterType] = useState("");

  // Unique cities and job types for the filter dropdowns
  const cities = useMemo(
    () => [...new Set(listings.map((l) => l.city))].sort(),
    [listings]
  );
  const jobTypes = useMemo(
    () => [...new Set(listings.map((l) => l.jobType))].sort(),
    [listings]
  );

  // Filtered + sorted jobs
  const jobs = useMemo(() => {
    let result = listings;
    if (filterCity) result = result.filter((l) => l.city === filterCity);
    if (filterType) result = result.filter((l) => l.jobType === filterType);

    return [...result].sort((a, b) => {
      if (sort === "net_salary") {
        const aNet = netWeeklySalary(a);
        const bNet = netWeeklySalary(b);
        const aVal = aNet?.keepMax ?? aNet?.keepMin ?? (a.salaryMax > 0 ? a.salaryMax * 100 : -999);
        const bVal = bNet?.keepMax ?? bNet?.keepMin ?? (b.salaryMax > 0 ? b.salaryMax * 100 : -999);
        return bVal - aVal;
      } else {
        // Popular: sort by job type rank first, then net salary within the same type
        const aRank = JOB_TYPE_RANK[a.jobType] ?? 99;
        const bRank = JOB_TYPE_RANK[b.jobType] ?? 99;
        if (aRank !== bRank) return aRank - bRank;
        const aNet = netWeeklySalary(a);
        const bNet = netWeeklySalary(b);
        return (bNet?.keepMax ?? -999) - (aNet?.keepMax ?? -999);
      }
    });
  }, [listings, sort, filterCity, filterType]);

  const hasFilters = filterCity !== "" || filterType !== "";

  return (
    <div>
      {/* ── Controls ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">

        {/* Sort toggle */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold">
          <button
            onClick={() => setSort("net_salary")}
            className={`px-3 py-1.5 transition ${
              sort === "net_salary"
                ? "bg-brand-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            💰 Highest net pay
          </button>
          <button
            onClick={() => setSort("popular")}
            className={`px-3 py-1.5 border-l border-gray-200 transition ${
              sort === "popular"
                ? "bg-brand-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            🔥 Most popular
          </button>
        </div>

        {/* City filter */}
        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-700"
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Job type filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-700"
        >
          <option value="">All job types</option>
          {jobTypes.map((t) => (
            <option key={t} value={t}>{fmtJobType(t)}</option>
          ))}
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => { setFilterCity(""); setFilterType(""); }}
            className="text-xs text-gray-400 hover:text-gray-700 px-1 transition"
          >
            Clear ×
          </button>
        )}

        {/* Result count */}
        <span className="text-xs text-gray-400 ml-auto">
          {jobs.length} job{jobs.length !== 1 ? "s" : ""}
          {hasFilters ? " matching" : " with housing"}
        </span>
      </div>

      {/* ── Job grid ──────────────────────────────────────────────────────── */}
      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm font-semibold text-gray-700">No jobs match your filters</p>
          <button
            onClick={() => { setFilterCity(""); setFilterType(""); }}
            className="mt-2 text-xs text-brand-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {jobs.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
