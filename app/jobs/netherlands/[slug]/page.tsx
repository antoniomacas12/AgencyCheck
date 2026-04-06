/**
 * /jobs/netherlands/[slug]
 *
 * Unified dynamic route that handles two kinds of slugs:
 *   1. City slugs   → e.g. /jobs/netherlands/amsterdam
 *   2. Job-type slugs → e.g. /jobs/netherlands/warehouse
 *
 * Having separate [city] and [jobType] sibling folders caused Next.js to
 * throw "You cannot use different slug names for the same dynamic path".
 * Merging them here fixes that conflict.
 */

import type { Metadata } from "next";
import { notFound, redirect, permanentRedirect } from "next/navigation";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import WorkerDisclaimer from "@/components/WorkerDisclaimer";
import { SubmitExperienceButton } from "@/components/SubmitExperience";
import {
  CITIES,
  getCityBySlug,
  JOB_SALARY_DATA,
  getJobBySlug,
  CITIES_BY_POPULATION,
  TOP_CITIES,
} from "@/lib/seoData";
import { ALL_AGENCIES, type EnrichedAgency } from "@/lib/agencyEnriched";
import { JOB_LISTINGS, type JobListing } from "@/lib/jobData";
import { calculateTakeHome, fmtEur, WML_HOURLY_2026 } from "@/lib/dutchTax";

// ─── Static params ─────────────────────────────────────────────────────────────
export function generateStaticParams() {
  const cityParams = CITIES.map((city) => ({ slug: city.slug }));
  const jobTypeParams = Object.keys(JOB_SALARY_DATA).map((jobType) => ({ slug: jobType }));
  return [...cityParams, ...jobTypeParams];
}

// ─── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const city = getCityBySlug(params.slug);
  if (city) {
    const activeJobs = JOB_LISTINGS.filter(
      (j) => j.isActive && j.city.toLowerCase() === city.name.toLowerCase()
    );
    const jobCount = activeJobs.length;
    const withHousing = activeJobs.filter((j) => j.housing === "YES").length;
    return {
      title: `Jobs in ${city.name}, Netherlands — ${jobCount} Live Listings — AgencyCheck`,
      description: `Find ${jobCount} verified agency jobs in ${city.name}, ${city.region}. ${withHousing} positions include housing. Compare real salaries and worker reviews before you sign.`,
      alternates: { canonical: `/jobs/netherlands/${city.slug}` },
      openGraph: {
        title: `Agency Jobs in ${city.name} — Real Salaries & Worker Reviews`,
        description: `${jobCount} jobs in ${city.name}. Average hourly from €${WML_HOURLY_2026.toFixed(2)}. Compare ${ALL_AGENCIES.filter((a) => a.cities.includes(city.name)).length} agencies hiring now.`,
      },
    };
  }

  const job = getJobBySlug(params.slug);
  if (job) {
    const jobs = JOB_LISTINGS.filter((j) => j.isActive && j.jobType === params.slug);
    const cities = [...new Set(jobs.map((j) => j.city))].length;
    return {
      title: `${job.title} Jobs Netherlands — Salary ${fmtEur(job.min, 2)}–${fmtEur(job.max, 2)}/hr — AgencyCheck`,
      description: `Find ${job.title.toLowerCase()} jobs via employment agencies in the Netherlands. Worker-reported salary: €${job.min}–€${job.max}/hr. ${jobs.length} active listings across ${cities} cities. Compare agencies, housing & reviews.`,
      alternates: { canonical: `/jobs/netherlands/${params.slug}` },
      openGraph: {
        title: `${job.title} Jobs in the Netherlands — Real Salary & Agency Reviews`,
        description: `Average ${job.title.toLowerCase()} salary: €${job.avg}/hr gross (worker-reported). Find agencies with housing, compare real take-home pay.`,
      },
    };
  }

  return { title: "Not found" };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Helpers – City view
// ═══════════════════════════════════════════════════════════════════════════════

function getJobsForCity(cityName: string): JobListing[] {
  return JOB_LISTINGS.filter(
    (j) => j.isActive && j.city.toLowerCase() === cityName.toLowerCase()
  );
}

function getAgenciesForCity(cityName: string): EnrichedAgency[] {
  return ALL_AGENCIES.filter(
    (a) =>
      a.cities.some((c) => c.toLowerCase() === cityName.toLowerCase()) ||
      a.city.toLowerCase() === cityName.toLowerCase()
  ).sort((a, b) => b.transparencyScore - a.transparencyScore);
}

function getNearbyCities(citySlug: string, count = 6): typeof CITIES {
  const city = getCityBySlug(citySlug);
  if (!city) return [];
  return CITIES_BY_POPULATION.filter(
    (c) => c.slug !== citySlug && c.region === city.region && c.population > 0
  ).slice(0, count);
}

function avgSalary(jobs: JobListing[]): number {
  if (!jobs.length) return WML_HOURLY_2026;
  return jobs.reduce((s, j) => s + (j.salaryMin + j.salaryMax) / 2, 0) / jobs.length;
}

function buildCityJsonLd(cityName: string, jobs: JobListing[]) {
  const postings = jobs.slice(0, 10).map((j) => ({
    "@type": "JobPosting",
    title: j.title,
    description: j.description || `${j.title} position via ${j.agencyName} in ${cityName}.`,
    hiringOrganization: { "@type": "Organization", name: j.agencyName },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: cityName, addressCountry: "NL" },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: { "@type": "QuantitativeValue", minValue: j.salaryMin, maxValue: j.salaryMax, unitText: "HOUR" },
    },
    datePosted: new Date().toISOString().split("T")[0],
    employmentType: "TEMPORARY",
    ...(j.housing === "YES" && { jobBenefits: "Housing provided" }),
  }));
  return { "@context": "https://schema.org", "@graph": postings };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Helpers – Job-type view
// ═══════════════════════════════════════════════════════════════════════════════

function getJobsForType(jobTypeSlug: string): JobListing[] {
  return JOB_LISTINGS.filter((j) => j.isActive && j.jobType === jobTypeSlug);
}

function getAgenciesForJobType(jobTypeSlug: string): EnrichedAgency[] {
  const job = JOB_SALARY_DATA[jobTypeSlug];
  if (!job) return [];
  const keywords = job.title.toLowerCase().split(" ");
  return ALL_AGENCIES.filter((a) => {
    if (a.jobFocus.some((jf) => jf === jobTypeSlug || jf.startsWith(jobTypeSlug.split("-")[0]))) return true;
    if (a.jobTypes) {
      const jt = a.jobTypes.toLowerCase();
      return keywords.some((kw) => kw.length > 3 && jt.includes(kw));
    }
    return false;
  }).sort((a, b) => b.transparencyScore - a.transparencyScore || b.score - a.score);
}

function getCitiesWithJobs(jobs: JobListing[]): { city: string; count: number }[] {
  const map = new Map<string, number>();
  for (const j of jobs) map.set(j.city, (map.get(j.city) || 0) + 1);
  return [...map.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

function buildJobTypeJsonLd(job: ReturnType<typeof getJobBySlug>, jobs: JobListing[]) {
  if (!job) return null;
  const postings = jobs.slice(0, 10).map((j) => ({
    "@type": "JobPosting",
    title: j.title,
    description: j.description || `${j.title} position via ${j.agencyName} in ${j.city}.`,
    hiringOrganization: { "@type": "Organization", name: j.agencyName },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: j.city, addressCountry: "NL" },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: { "@type": "QuantitativeValue", minValue: j.salaryMin, maxValue: j.salaryMax, unitText: "HOUR" },
    },
    datePosted: new Date().toISOString().split("T")[0],
    employmentType: "TEMPORARY",
  }));
  return { "@context": "https://schema.org", "@graph": postings };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Page component
// ═══════════════════════════════════════════════════════════════════════════════

export default function NetherlandsSlugPage({ params }: { params: { slug: string } }) {
  const cityData = getCityBySlug(params.slug);
  if (cityData) return <CityJobsView params={{ city: params.slug }} />;

  const job = getJobBySlug(params.slug);
  // Permanently redirect job-type slugs to their canonical /jobs/[jobType] URL
  if (job) permanentRedirect(`/jobs/${params.slug}`);

  // Unknown slug — redirect to /jobs rather than showing a 404
  redirect("/jobs");
}

// ─── City Jobs View ────────────────────────────────────────────────────────────

function CityJobsView({ params }: { params: { city: string } }) {
  const cityData = getCityBySlug(params.city);
  if (!cityData) notFound();

  const jobs         = getJobsForCity(cityData.name);
  const agencies     = getAgenciesForCity(cityData.name);
  const nearbyCities = getNearbyCities(params.city);
  const jobTypes     = Object.values(JOB_SALARY_DATA);
  const withHousing  = jobs.filter((j) => j.housing === "YES").length;
  const avgHourly    = avgSalary(jobs);
  const jsonLd       = buildCityJsonLd(cityData.name, jobs);

  const takeHome = calculateTakeHome({
    hourlyRate:      avgHourly,
    hoursPerWeek:    40,
    weeksPerYear:    48,
    includeVakantie: false,
    housingCost:     withHousing > jobs.length / 2 ? 390 : 0,
    transportCost:   80,
    healthcareOwnRisk: 30,
  });

  const jobsByType = jobTypes
    .map((jt) => ({ ...jt, jobs: jobs.filter((j) => j.jobType === jt.slug) }))
    .filter((jt) => jt.jobs.length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>›</span>
          <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
          <span>›</span>
          <span className="text-gray-800">{cityData.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Agency Jobs in {cityData.name}, Netherlands
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            {jobs.length > 0
              ? `${jobs.length} active listings from ${agencies.length} verified agencies in ${cityData.name}, ${cityData.region}. Based on worker-reported data.`
              : `Browse employment agencies operating in ${cityData.name}, ${cityData.region}. Worker-reported salary and housing data.`}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { label: "Active jobs",       value: jobs.length.toString(),             icon: "💼" },
              { label: "Agencies here",     value: agencies.length.toString(),         icon: "🏢" },
              { label: "Jobs with housing", value: withHousing.toString(),             icon: "🏠" },
              { label: "Avg gross/hr",      value: fmtEur(avgHourly, 2),              icon: "💶" },
              { label: "Est. spendable/mo", value: fmtEur(takeHome.spendableMonthly), icon: "💰" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <div className="text-lg font-bold text-gray-900">{s.icon} {s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <WorkerDisclaimer variant="salary" size="banner" className="mb-8" />

        {/* Salary reality block */}
        <div className="bg-gray-950 text-white rounded-2xl p-6 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Real income estimate · {cityData.name} · 40 hrs/wk · based on worker-reported data
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-black text-gray-400 line-through">{fmtEur(takeHome.grossMonthly)}</div>
              <div className="text-xs text-gray-500">Gross/month</div>
            </div>
            <div>
              <div className="text-2xl font-black text-red-400">−{fmtEur(takeHome.taxMonthly)}</div>
              <div className="text-xs text-gray-500">Tax ({(takeHome.effectiveTaxRate * 100).toFixed(0)}%)</div>
            </div>
            <div>
              <div className="text-2xl font-black text-orange-400">−{fmtEur(takeHome.housingMonthly + takeHome.transportMonthly)}</div>
              <div className="text-xs text-gray-500">Housing + transport</div>
            </div>
            <div>
              <div className="text-2xl font-black text-green-400">{fmtEur(takeHome.spendableMonthly)}</div>
              <div className="text-xs text-gray-500">Est. you keep/month</div>
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mt-4">
            Estimates only. Actual results vary. Based on worker-reported data + Dutch tax tables 2026.{" "}
            <Link href="/tools/real-income-calculator" className="underline hover:text-gray-400">Run your own calculation →</Link>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Jobs by type */}
            {jobsByType.length > 0 ? (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Job types available in {cityData.name}
                </h2>
                <div className="space-y-6">
                  {jobsByType.map((jt) => (
                    <div key={jt.slug} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{jt.icon}</span>
                          <span className="font-bold text-gray-900">{jt.title}</span>
                          <span className="text-sm text-gray-500">({jt.jobs.length} listing{jt.jobs.length !== 1 ? "s" : ""})</span>
                        </div>
                        <Link
                          href={`/jobs/netherlands/${params.city}/${jt.slug}`}
                          className="text-sm font-medium text-brand-600 hover:underline"
                        >
                          See all {jt.title} →
                        </Link>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {jt.jobs.slice(0, 3).map((job) => (
                          <div key={job.id} className="px-4 py-3 flex items-center justify-between gap-4">
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{job.title}</div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {job.agencyName}
                                {job.housing === "YES" && <span className="ml-2 text-green-600 font-medium">🏠 Housing</span>}
                                {job.transport === "YES" && <span className="ml-2 text-blue-600 font-medium">🚌 Transport</span>}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="font-bold text-gray-900 text-sm">€{job.salaryMin.toFixed(2)}–€{job.salaryMax.toFixed(2)}/hr</div>
                              <div className="text-[10px] text-gray-400">gross estimate</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
                <p className="text-amber-800 font-medium">No active listings for {cityData.name} yet.</p>
                <p className="text-amber-700 text-sm mt-1">
                  Browse agencies below that operate in this area, or{" "}
                  <Link href="/agencies" className="underline">view all agencies</Link>.
                </p>
              </div>
            )}

            {/* Agencies in this city */}
            {agencies.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Agencies hiring in {cityData.name} ({agencies.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {agencies.slice(0, 6).map((agency) => (
                    <AgencyCard
                      key={agency.slug}
                      agency={agency}
                      jobCount={jobs.filter((j) => j.agencySlug === agency.slug).length}
                    />
                  ))}
                </div>
                {agencies.length > 6 && (
                  <div className="mt-4 text-center">
                    <Link href={`/agencies?city=${params.city}`} className="text-brand-600 hover:underline font-medium">
                      View all {agencies.length} agencies in {cityData.name} →
                    </Link>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm">Browse by job type</h3>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {jobTypes.map((jt) => (
                  <Link
                    key={jt.slug}
                    href={`/jobs/netherlands/${params.city}/${jt.slug}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50 hover:bg-brand-50 hover:text-brand-700 text-sm text-gray-700 transition-colors"
                  >
                    <span>{jt.icon}</span>
                    <span className="truncate">{jt.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {nearbyCities.length > 0 && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900 text-sm">Jobs near {cityData.name}</h3>
                </div>
                <div className="p-3 space-y-1">
                  {nearbyCities.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/jobs/netherlands/${c.slug}`}
                      className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-700 transition-colors"
                    >
                      📍 {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-brand-600 text-white rounded-xl p-5">
              <div className="text-2xl mb-2">⚠️</div>
              <h3 className="font-bold text-lg mb-2">Agency promised €600/week?</h3>
              <p className="text-sm opacity-90 mb-4">
                Worker data shows many take home far less. Calculate your real income before signing.
              </p>
              <Link
                href="/tools/real-income-calculator"
                className="block w-full text-center bg-white text-brand-700 font-bold px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Calculate real income →
              </Link>
            </div>

            <div className="border border-green-200 bg-green-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-2">Worked in {cityData.name}?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Share your experience — 2 minutes, no login, helps other workers.
              </p>
              <SubmitExperienceButton city={cityData.name} className="w-full justify-center" />
            </div>

            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-2">Know this area?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Worker reviews on housing quality, salary accuracy, and transport in {cityData.name} — based on actual reports.
              </p>
              <Link
                href="/reviews"
                className="block w-full text-center bg-gray-900 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                Read worker reviews →
              </Link>
            </div>
          </aside>
        </div>

        {/* All job types */}
        <section className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Explore {cityData.name} jobs by category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {jobTypes.map((jt) => {
              const count = jobs.filter((j) => j.jobType === jt.slug).length;
              return (
                <Link
                  key={jt.slug}
                  href={`/jobs/netherlands/${params.city}/${jt.slug}`}
                  className="border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-400 hover:bg-brand-50 transition-colors group"
                >
                  <div className="text-2xl mb-1">{jt.icon}</div>
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-brand-700">{jt.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {count > 0 ? `${count} listing${count !== 1 ? "s" : ""}` : "See agencies"}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">€{jt.min}–€{jt.max}/hr</div>
                </Link>
              );
            })}
          </div>
        </section>

        <WorkerDisclaimer variant="general" size="subtle" className="mt-10" />
      </div>
    </>
  );
}

// ─── Job Type View ─────────────────────────────────────────────────────────────

function JobTypeView({ params }: { params: { jobType: string } }) {
  const job = getJobBySlug(params.jobType);
  if (!job) notFound();

  const jobs        = getJobsForType(params.jobType);
  const agencies    = getAgenciesForJobType(params.jobType);
  const cities      = getCitiesWithJobs(jobs);
  const withHousing = jobs.filter((j) => j.housing === "YES").length;
  const jsonLd      = buildJobTypeJsonLd(job, jobs);

  const takeHome = calculateTakeHome({
    hourlyRate:      job.avg,
    hoursPerWeek:    40,
    weeksPerYear:    48,
    includeVakantie: false,
    housingCost:     390,
    transportCost:   80,
    healthcareOwnRisk: 30,
  });

  const aboveWML = job.avg - WML_HOURLY_2026;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>›</span>
          <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
          <span>›</span>
          <span className="text-gray-800">{job.title} Netherlands</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{job.icon}</span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              {job.title} Jobs in the Netherlands
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl">
            {job.description} Worker-reported salary data shows €{job.min}–€{job.max}/hr gross.
            {jobs.length > 0
              ? ` ${jobs.length} active listings across ${cities.length} cities.`
              : " Estimates based on worker-reported data."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { label: "Active listings", value: jobs.length.toString(),      icon: "💼" },
              { label: "Cities covered",  value: cities.length.toString(),    icon: "📍" },
              { label: "With housing",    value: withHousing.toString(),      icon: "🏠" },
              { label: "Avg gross/hr",    value: fmtEur(job.avg, 2),         icon: "💶" },
              { label: "WML margin",      value: `+${fmtEur(aboveWML, 2)}`, icon: "📊" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <div className="text-lg font-bold text-gray-900">{s.icon} {s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <WorkerDisclaimer variant="salary" size="banner" className="mb-8" />

        {/* Salary expectation vs reality */}
        <div className="bg-gray-950 text-white rounded-2xl p-6 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Salary expectations vs. reality · {job.title} · 40 hrs/wk · based on worker-reported data
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
            <div>
              <div className="text-3xl font-black text-gray-400 line-through decoration-red-500 decoration-4">
                {fmtEur(takeHome.grossMonthly)}
              </div>
              <div className="text-sm text-gray-500 mt-1">What the agency advertises</div>
              <div className="text-xs text-gray-600">€{job.avg}/hr × 160 hrs/mo</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-4xl">→</div>
            </div>
            <div>
              <div className="text-3xl font-black text-green-400">{fmtEur(takeHome.spendableMonthly)}</div>
              <div className="text-sm text-gray-400 mt-1">Est. what you actually keep</div>
              <div className="text-xs text-gray-600">After tax + housing + transport + healthcare</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs border-t border-white/10 pt-4">
            <div>
              <div className="text-red-400 font-bold">−{fmtEur(takeHome.taxMonthly)}</div>
              <div className="text-gray-600">Tax ({(takeHome.effectiveTaxRate * 100).toFixed(0)}%)</div>
            </div>
            <div>
              <div className="text-orange-400 font-bold">−{fmtEur(takeHome.housingMonthly)}</div>
              <div className="text-gray-600">Housing (agency avg)</div>
            </div>
            <div>
              <div className="text-yellow-500 font-bold">−{fmtEur(takeHome.transportMonthly + takeHome.healthcareMonthly)}</div>
              <div className="text-gray-600">Transport + healthcare</div>
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mt-3">
            Estimates based on worker-reported data + Dutch tax tables 2026. Actual results may vary.{" "}
            <Link href="/tools/real-income-calculator" className="underline hover:text-gray-400">Calculate your specific income →</Link>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Cities with this job */}
            {cities.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Where to find {job.title} jobs in the Netherlands
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {cities.map(({ city, count }) => {
                    const cityData = CITIES.find((c) => c.name.toLowerCase() === city.toLowerCase());
                    return (
                      <Link
                        key={city}
                        href={cityData ? `/jobs/netherlands/${cityData.slug}/${params.jobType}` : `/jobs`}
                        className="border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-400 hover:bg-brand-50 transition-colors group"
                      >
                        <div className="font-semibold text-sm text-gray-900 group-hover:text-brand-700">📍 {city}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{count} listing{count !== 1 ? "s" : ""}</div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Active job listings */}
            {jobs.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Active {job.title} listings ({jobs.length})
                </h2>
                <div className="space-y-3">
                  {jobs.slice(0, 12).map((j) => (
                    <div key={j.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-bold text-gray-900">{j.title}</div>
                          <div className="text-sm text-gray-600 mt-0.5">
                            <Link href={`/agencies/${j.agencySlug}`} className="hover:text-brand-600 hover:underline">
                              {j.agencyName}
                            </Link>
                            {" · "}
                            <Link
                              href={`/jobs/netherlands/${CITIES.find((c) => c.name.toLowerCase() === j.city.toLowerCase())?.slug || j.city.toLowerCase().replace(/\s+/g, "-")}`}
                              className="hover:text-brand-600 hover:underline"
                            >
                              {j.city}
                            </Link>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {j.housing === "YES" && (
                              <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-0.5">🏠 Housing included</span>
                            )}
                            {j.transport === "YES" && (
                              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-0.5">🚌 Transport</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-black text-gray-900">€{j.salaryMin.toFixed(2)}–€{j.salaryMax.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">per hour · gross</div>
                          <div className="text-xs text-gray-400 mt-0.5">estimate</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Agencies */}
            {agencies.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Agencies hiring {job.title.toLowerCase()}s ({agencies.length} verified)
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {agencies.slice(0, 6).map((agency) => (
                    <AgencyCard
                      key={agency.slug}
                      agency={agency}
                      jobCount={jobs.filter((j) => j.agencySlug === agency.slug).length}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm">{job.icon} {job.title} Salary Range</h3>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { label: "Minimum (WML)",             value: fmtEur(job.min, 2) + "/hr", color: "text-red-600" },
                  { label: "Average (worker-reported)", value: fmtEur(job.avg, 2) + "/hr", color: "text-amber-600" },
                  { label: "Top end",                   value: fmtEur(job.max, 2) + "/hr", color: "text-green-600" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{r.label}</span>
                    <span className={`font-bold text-sm ${r.color}`}>{r.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400">Based on worker-reported data. Estimates — actual results may vary.</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-600 text-white rounded-xl p-5">
              <div className="text-2xl mb-2">⚠️</div>
              <h3 className="font-bold text-lg mb-2">Check your real income</h3>
              <p className="text-sm opacity-90 mb-4">
                Agency gross figures include deductions many workers don&apos;t anticipate. Run the calculator before you sign.
              </p>
              <Link
                href="/tools/real-income-calculator"
                className="block w-full text-center bg-white text-brand-700 font-bold px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Calculate real income →
              </Link>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm">Similar job types</h3>
              </div>
              <div className="p-3 space-y-1">
                {Object.values(JOB_SALARY_DATA)
                  .filter((jt) => jt.slug !== params.jobType)
                  .slice(0, 6)
                  .map((jt) => (
                    <Link
                      key={jt.slug}
                      href={`/jobs/netherlands/${jt.slug}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-700 transition-colors"
                    >
                      <span>{jt.icon} {jt.title}</span>
                      <span className="text-xs text-gray-400">€{jt.avg}/hr</span>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm">Top cities for {job.title}</h3>
              </div>
              <div className="p-3 space-y-1">
                {cities.slice(0, 6).map(({ city, count }) => {
                  const cityData = CITIES.find((c) => c.name.toLowerCase() === city.toLowerCase());
                  return (
                    <Link
                      key={city}
                      href={cityData ? `/jobs/netherlands/${cityData.slug}/${params.jobType}` : "#"}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-700 transition-colors"
                    >
                      <span>📍 {city}</span>
                      <span className="text-xs text-gray-400">{count} jobs</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        <WorkerDisclaimer variant="salary" size="subtle" className="mt-10" />
      </div>
    </>
  );
}
