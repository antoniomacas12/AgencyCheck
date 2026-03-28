import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import HousingBadge from "@/components/HousingBadge";
import ScoreBadge from "@/components/ScoreBadge";
import { AGENCIES, AGENCY_MAP } from "@/lib/agencyData";
import {
  getJobsByAgency,
  JOB_TYPE_META,
  type JobListing,
} from "@/lib/jobData";

// ─── Static params: same set as agency pages ───────────────────────────────────
export function generateStaticParams() {
  return AGENCIES.map((a) => ({ slug: a.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const agency = AGENCY_MAP[params.slug];
  if (!agency) return { title: "Agency not found" };
  const jobs = getJobsByAgency(params.slug);
  return {
    title: `Jobs at ${agency.name} — ${jobs.length} vacancies — AgencyCheck`,
    description: `${jobs.length} active job listings at ${agency.name}. Positions in ${[...new Set(jobs.map((j) => j.city))].slice(0, 4).join(", ")}. Worker reviews and salary info included.`,
    alternates: { canonical: `/agencies/${agency.slug}/jobs` },
  };
}

// ─── Job row component ────────────────────────────────────────────────────────
function JobRow({ job }: { job: JobListing }) {
  const meta = JOB_TYPE_META[job.jobType];
  const citySlug = job.city.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="card p-4 hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5 flex items-start gap-4"
    >
      <span className="text-3xl shrink-0 mt-0.5">{job.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">{job.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              📍 {job.city}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-brand-700">
              €{job.salaryMin.toFixed(2)}–{job.salaryMax.toFixed(2)}/hr
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <HousingBadge housing={job.housing} size="sm" />
          {job.transport === "YES" && (
            <span className="housing-badge bg-blue-50 text-blue-700 text-[11px]">🚌 Transport</span>
          )}
          <span className="text-xs text-gray-400">{meta?.title ?? job.jobType}</span>
        </div>
        {job.description && (
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-1 leading-relaxed">{job.description}</p>
        )}
      </div>
      <span className="text-xs text-brand-600 font-medium whitespace-nowrap shrink-0 mt-1">
        View →
      </span>
    </Link>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AgencyJobsPage({ params }: { params: { slug: string } }) {
  const agency = AGENCY_MAP[params.slug];
  if (!agency) notFound();

  const allJobs = getJobsByAgency(params.slug).sort((a, b) => b.salaryMax - a.salaryMax);

  // Group by city for better scanning
  const cities = [...new Set(allJobs.map((j) => j.city))].sort();
  const byCity = Object.fromEntries(
    cities.map((city) => [city, allJobs.filter((j) => j.city === city)])
  );

  // Group by job type for filter chips
  const jobTypes = [...new Set(allJobs.map((j) => j.jobType))].sort();
  const housingJobs = allJobs.filter((j) => j.housing === "YES");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>›</span>
        <Link href={`/agencies/${agency.slug}`} className="hover:text-brand-600">{agency.name}</Link>
        <span>›</span>
        <span className="text-gray-600">Jobs</span>
      </nav>

      {/* Header */}
      <div className="card p-5 mb-6">
        <div className="flex items-start gap-4">
          <ScoreBadge score={agency.score} size="lg" showLabel />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{agency.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {allJobs.length} active job listing{allJobs.length !== 1 ? "s" : ""}
              {cities.length > 0 && (
                <span className="text-gray-400">
                  {" "}&middot; {cities.length} cit{cities.length === 1 ? "y" : "ies"}
                </span>
              )}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={`/agencies/${agency.slug}`}
                className="text-xs text-brand-600 font-medium hover:underline">
                ← Agency profile
              </Link>
              <Link href={`/agencies/${agency.slug}/reviews`}
                className="text-xs text-gray-500 hover:text-brand-600 hover:underline">
                Worker reviews →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Summary chips */}
      {allJobs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-medium rounded-full px-3 py-1.5">
            💼 {allJobs.length} vacancies
          </span>
          {housingJobs.length > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full px-3 py-1.5">
              🏠 {housingJobs.length} with housing
            </span>
          )}
          {jobTypes.map((type) => {
            const meta = JOB_TYPE_META[type];
            return (
              <span key={type} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full px-3 py-1.5">
                {meta?.icon} {meta?.title ?? type}
              </span>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {allJobs.length === 0 && (
        <div className="card p-10 text-center text-gray-400">
          <p className="text-4xl mb-4">💼</p>
          <p className="text-base font-semibold text-gray-700">No active job listings</p>
          <p className="text-sm mt-2 text-gray-500 max-w-xs mx-auto">
            {agency.name} has no current vacancies in our dataset.
            Check their website directly for available positions.
          </p>
          {agency.website && (
            <a
              href={agency.website.startsWith("http") ? agency.website : `https://${agency.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm text-brand-600 font-semibold hover:underline"
            >
              Visit {agency.name} website ↗
            </a>
          )}
          <div className="mt-5">
            <Link href={`/agencies/${agency.slug}`}
              className="text-sm text-gray-500 hover:text-brand-600 hover:underline">
              ← Back to agency profile
            </Link>
          </div>
        </div>
      )}

      {/* Jobs by city */}
      {allJobs.length > 0 && (
        <div className="space-y-8">
          {cities.map((city) => {
            const cityJobs = byCity[city];
            const citySlug = city.toLowerCase().replace(/\s+/g, "-");
            return (
              <section key={city}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-sm font-bold text-gray-900">
                    📍 {city}
                  </h2>
                  <span className="text-xs text-gray-400">
                    {cityJobs.length} job{cityJobs.length !== 1 ? "s" : ""}
                  </span>
                  <Link
                    href={`/cities/${citySlug}`}
                    className="ml-auto text-xs text-brand-600 hover:underline"
                  >
                    All agencies in {city} →
                  </Link>
                </div>
                <div className="space-y-2">
                  {cityJobs.map((job: JobListing) => (
                    <JobRow key={job.slug} job={job} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Worker notice */}
      {allJobs.length > 0 && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
          <strong>ℹ️ Before you apply:</strong> Always confirm housing deductions, salary, and contract
          terms in writing. Minimum wage in Netherlands 2026 is €14.71/hr.
          Read <Link href={`/agencies/${agency.slug}/reviews`} className="underline">worker reviews</Link> before deciding.
        </div>
      )}

      <p className="mt-6 text-xs text-gray-400 text-center">
        Job listings are informational. Availability may vary. Verify directly with {agency.name}.
      </p>
    </div>
  );
}
