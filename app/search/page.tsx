import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import AgencyCard from "@/components/AgencyCard";
import FilterBar from "@/components/FilterBar";
import ActiveFilters from "@/components/ActiveFilters";
import { AGENCIES } from "@/lib/agencyData";

const JOB_CATEGORIES = [
  { slug: "logistics",  label: "Logistics / Warehouse", icon: "📦" },
  { slug: "production", label: "Production",            icon: "🏭" },
  { slug: "transport",  label: "Transport",             icon: "🚛" },
  { slug: "technical",  label: "Technical",             icon: "🔧" },
  { slug: "care",       label: "Care",                  icon: "🏥" },
];
import {
  searchAgencies,
  getActiveFilters,
  hasActiveFilters,
  type SearchParams,
} from "@/lib/searchLogic";

export const metadata: Metadata = {
  title: "Search Employment Agencies by Job, City & Housing — AgencyCheck",
  description:
    "Search 127 verified employment agencies in the Netherlands by job, city, housing, and salary. Filter by sector, job type, and accommodation availability.",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchPageProps {
  searchParams: SearchParams;
}

// ─── Results (inner server component) ────────────────────────────────────────
// Separated so it can be wrapped in its own Suspense boundary — required
// because FilterBar and ActiveFilters both call useSearchParams().

function SearchResults({ searchParams }: SearchPageProps) {
  const results       = searchAgencies(AGENCIES, searchParams);
  const activeFilters = getActiveFilters(searchParams);
  const isFiltered    = hasActiveFilters(searchParams);

  return (
    <>
      {/* Sticky filter bar — client component */}
      <FilterBar totalResults={results.length} />

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Active filter chips — client component */}
        <ActiveFilters filters={activeFilters} />

        {/* ── Empty state ─────────────────────────────────────────────────── */}
        {results.length === 0 && (
          <div className="text-center py-20">
            <span className="text-6xl select-none">🔍</span>

            <p className="mt-5 text-lg font-semibold text-gray-800">
              No agencies found
            </p>

            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
              {isFiltered
                ? "Try broadening your search — remove a filter or use a different keyword."
                : "Enter a job title or city above to find agencies."}
            </p>

            {/* Suggestion: popular jobs */}
            {isFiltered && (
              <div className="mt-8">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Try a popular job category
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {JOB_CATEGORIES.slice(0, 5).map((job) => (
                    <Link
                      key={job.slug}
                      href={`/search?job=${encodeURIComponent(job.label)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-brand-400 hover:text-brand-600 transition-colors"
                    >
                      {job.icon} {job.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/search"
                  className="inline-block mt-5 text-sm text-brand-600 font-medium hover:underline"
                >
                  ← Clear all filters
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Results grid ────────────────────────────────────────────────── */}
        {results.length > 0 && (
          <>
            {/* Context line when no filters are active */}
            {!isFiltered && (
              <p className="text-sm text-gray-500 mb-4">
                Showing all agencies — use the search or filters to narrow down.
              </p>
            )}

            {/* Category match note */}
            {isFiltered && searchParams.job && (
              <p className="text-xs text-gray-400 mb-4">
                Showing agencies matching{" "}
                <span className="font-medium text-gray-600">
                  &ldquo;{searchParams.job}&rdquo;
                </span>{" "}
                and related job categories.
              </p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.map((agency) => (
                <AgencyCard key={agency.id} agency={agency} />
              ))}
            </div>
          </>
        )}

        {/* Disclaimer */}
        {results.length > 0 && (
          <p className="mt-8 text-xs text-gray-400 text-center">
            All data is worker-reported and informational. Not affiliated with any agency.
          </p>
        )}
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div>
      {/* Search bar — always visible at top */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <SearchBar
            defaultJob={searchParams.job}
            defaultCity={searchParams.city}
            defaultHousing={searchParams.housing === "yes"}
            defaultSalaryMin={searchParams.salaryMin}
            defaultSalaryMax={searchParams.salaryMax}
          />
        </div>
      </div>

      {/* FilterBar + results inside Suspense (required for useSearchParams in client children) */}
      <Suspense
        fallback={
          <div className="p-10 text-center text-sm text-gray-400">Loading results…</div>
        }
      >
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
