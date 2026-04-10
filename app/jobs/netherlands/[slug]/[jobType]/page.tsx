/**
 * CORE SEO DRIVER — City × Job Type combination pages
 *
 * These are the highest-value SEO pages: "order picker jobs rotterdam",
 * "forklift driver amsterdam with housing", etc.
 *
 * Routes: /jobs/netherlands/[city]/[jobType]
 * Generates: 143 cities × 12 job types = 1,716 pages
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
} from "@/lib/seoData";
import { ALL_AGENCIES, type EnrichedAgency } from "@/lib/agencyEnriched";
import { JOB_LISTINGS, type JobListing } from "@/lib/jobData";
import { calculateTakeHome, fmtEur, WML_HOURLY_2026 } from "@/lib/dutchTax";

// ─── Static params: all city × job type combinations ─────────────────────────
export function generateStaticParams() {
  const jobSlugs  = Object.keys(JOB_SALARY_DATA);
  const citySlugs = CITIES.map((c) => c.slug);
  return citySlugs.flatMap((city) =>
    jobSlugs.map((jobType) => ({ city, jobType }))
  );
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { city: string; jobType: string };
}): Promise<Metadata> {
  const city = getCityBySlug(params.city);
  const job  = getJobBySlug(params.jobType);
  if (!city || !job) return { title: "Page not found" };

  const jobs = JOB_LISTINGS.filter(
    (j) =>
      j.isActive &&
      j.jobType === params.jobType &&
      j.city.toLowerCase() === city.name.toLowerCase()
  );
  const withHousing = jobs.filter((j) => j.housing === "YES").length;

  return {
    title: `${job.title} Jobs in ${city.name} — ${jobs.length > 0 ? jobs.length + " listings" : "Agencies & Salary"} — AgencyCheck`,
    description: `Find ${job.title.toLowerCase()} jobs in ${city.name}, Netherlands. Salary: €${job.min}–€${job.max}/hr (worker-reported). ${withHousing > 0 ? `${withHousing} jobs include housing.` : ""} Compare agencies, real income, and worker reviews.`,
    alternates: {
      canonical: `https://agencycheck.io/jobs/netherlands/${params.city}/${params.jobType}`,
    },
    openGraph: {
      title: `${job.icon} ${job.title} Jobs in ${city.name} — Real Salary & Housing — AgencyCheck`,
      description: `${jobs.length > 0 ? jobs.length + " active" : "Browse"} ${job.title.toLowerCase()} jobs in ${city.name}. Worker-reported avg €${job.avg}/hr gross.`,
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getComboJobs(cityName: string, jobTypeSlug: string): JobListing[] {
  return JOB_LISTINGS.filter(
    (j) =>
      j.isActive &&
      j.jobType === jobTypeSlug &&
      j.city.toLowerCase() === cityName.toLowerCase()
  );
}

function getComboAgencies(cityName: string, jobTypeSlug: string): EnrichedAgency[] {
  const job      = JOB_SALARY_DATA[jobTypeSlug];
  const keywords = job ? job.title.toLowerCase().split(" ") : [];

  return ALL_AGENCIES.filter((a) => {
    const inCity = a.cities.some((c) => c.toLowerCase() === cityName.toLowerCase()) ||
                   a.city.toLowerCase() === cityName.toLowerCase();
    const hasJob = a.jobFocus.some((jf) => jf === jobTypeSlug || jf.startsWith(jobTypeSlug.split("-")[0])) ||
                   (a.jobTypes
                     ? keywords.some((kw) => kw.length > 3 && a.jobTypes!.toLowerCase().includes(kw))
                     : false);
    return inCity || hasJob;
  }).sort((a, b) => {
    // Prefer agencies that match BOTH city and job type, then by transparency score
    const scoreA = (a.cities.some((c) => c.toLowerCase() === cityName.toLowerCase()) ? 2 : 0) +
                   (a.jobFocus.some((jf) => jf === jobTypeSlug) ? 2 : 0) +
                   a.transparencyScore / 100;
    const scoreB = (b.cities.some((c) => c.toLowerCase() === cityName.toLowerCase()) ? 2 : 0) +
                   (b.jobFocus.some((jf) => jf === jobTypeSlug) ? 2 : 0) +
                   b.transparencyScore / 100;
    return scoreB - scoreA;
  });
}

function getNearbyCities(citySlug: string, jobTypeSlug: string, count = 6): {
  city: (typeof CITIES)[0];
  jobCount: number;
}[] {
  const city = getCityBySlug(citySlug);
  if (!city) return [];

  return CITIES_BY_POPULATION
    .filter((c) => c.slug !== citySlug && c.region === city.region && c.population > 0)
    .slice(0, count)
    .map((c) => ({
      city: c,
      jobCount: JOB_LISTINGS.filter(
        (j) => j.isActive && j.jobType === jobTypeSlug && j.city.toLowerCase() === c.name.toLowerCase()
      ).length,
    }));
}

function buildJsonLd(
  cityName: string,
  job: ReturnType<typeof getJobBySlug>,
  jobs: JobListing[]
) {
  if (!job) return null;
  const postings = jobs.slice(0, 10).map((j) => ({
    "@type": "JobPosting",
    title: j.title,
    description: j.description || `${j.title} in ${cityName} via ${j.agencyName}.`,
    hiringOrganization: { "@type": "Organization", name: j.agencyName },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: cityName,
        addressCountry: "NL",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: {
        "@type": "QuantitativeValue",
        minValue: j.salaryMin,
        maxValue: j.salaryMax,
        unitText: "HOUR",
      },
    },
    datePosted: new Date().toISOString().split("T")[0],
    employmentType: "TEMPORARY",
    ...(j.housing === "YES" && { jobBenefits: "Housing provided by agency" }),
    ...(j.transport === "YES" && { jobBenefits: "Transport provided" }),
  }));

  return { "@context": "https://schema.org", "@graph": postings };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CityJobTypePage({
  params,
}: {
  params: { city: string; jobType: string };
}) {
  const cityData = getCityBySlug(params.city);
  const job      = getJobBySlug(params.jobType);
  if (!cityData || !job) notFound();

  const jobs         = getComboJobs(cityData.name, params.jobType);
  const agencies     = getComboAgencies(cityData.name, params.jobType);
  const nearbyCities = getNearbyCities(params.city, params.jobType);
  const withHousing  = jobs.filter((j) => j.housing === "YES").length;
  const withTransport = jobs.filter((j) => j.transport === "YES").length;
  const jsonLd       = buildJsonLd(cityData.name, job, jobs);

  // Average salary from real listings (or use benchmark)
  const avgHourly = jobs.length > 0
    ? jobs.reduce((s, j) => s + (j.salaryMin + j.salaryMax) / 2, 0) / jobs.length
    : job.avg;

  // Take-home reality with housing included (most agency jobs)
  const takeHomeWithHousing = calculateTakeHome({
    hourlyRate:      avgHourly,
    hoursPerWeek:    40,
    weeksPerYear:    48,
    includeVakantie: false,
    housingCost:     390,
    transportCost:   0,
    healthcareOwnRisk: 30,
  });

  // Take-home WITHOUT housing
  const takeHomeNoHousing = calculateTakeHome({
    hourlyRate:      avgHourly,
    hoursPerWeek:    40,
    weeksPerYear:    48,
    includeVakantie: false,
    housingCost:     0,
    transportCost:   80,
    healthcareOwnRisk: 30,
  });

  const otherJobTypes = Object.values(JOB_SALARY_DATA).filter((jt) => jt.slug !== params.jobType);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Breadcrumbs ── */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>›</span>
          <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
          <span>›</span>
          <Link href={`/jobs/netherlands/${params.city}`} className="hover:text-brand-600">
            {cityData.name}
          </Link>
          <span>›</span>
          <span className="text-gray-800">{job.title}</span>
        </nav>

        {/* ── Hero ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-4xl">{job.icon}</span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              {job.title} Jobs in {cityData.name}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl">
            {jobs.length > 0
              ? `${jobs.length} active ${job.title.toLowerCase()} listings in ${cityData.name}, ${cityData.region}. ${withHousing > 0 ? `${withHousing} include agency housing.` : ""} Worker-reported salary: €${job.min}–€${job.max}/hr.`
              : `${job.title} positions in ${cityData.name} via verified employment agencies. Worker-reported salary data: €${job.min}–€${job.max}/hr gross.`}
          </p>

          {/* Quick stat chips */}
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { label: "Active listings",    value: jobs.length.toString(),            icon: "💼" },
              { label: "With housing",       value: withHousing.toString(),            icon: "🏠" },
              { label: "With transport",     value: withTransport.toString(),          icon: "🚌" },
              { label: "Avg gross/hr",       value: fmtEur(avgHourly, 2),             icon: "💶" },
              { label: "Est. you keep/mo",   value: fmtEur(takeHomeWithHousing.spendableMonthly), icon: "💰" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <div className="text-lg font-bold text-gray-900">{s.icon} {s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Legal disclaimer ── */}
        <WorkerDisclaimer variant="salary" size="banner" className="mb-8" />

        {/* ── THE CORE SHOCK BLOCK ── */}
        <div className="bg-gray-950 text-white rounded-2xl p-6 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
            {job.title} salary reality · {cityData.name} · 40hrs/wk · based on worker-reported data
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            {/* With agency housing */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">
                🏠 With agency housing
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Gross monthly</span>
                  <span className="line-through text-gray-500">{fmtEur(takeHomeWithHousing.grossMonthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax deducted</span>
                  <span className="text-red-400">−{fmtEur(takeHomeWithHousing.taxMonthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Housing deduction</span>
                  <span className="text-orange-400">−{fmtEur(takeHomeWithHousing.housingMonthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Healthcare</span>
                  <span className="text-yellow-500">−{fmtEur(takeHomeWithHousing.healthcareMonthly)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-base">
                  <span className="text-white">You keep</span>
                  <span className="text-green-400">{fmtEur(takeHomeWithHousing.spendableMonthly)}/mo</span>
                </div>
              </div>
            </div>

            {/* Without housing */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">
                🏙️ Own accommodation
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Gross monthly</span>
                  <span className="line-through text-gray-500">{fmtEur(takeHomeNoHousing.grossMonthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax deducted</span>
                  <span className="text-red-400">−{fmtEur(takeHomeNoHousing.taxMonthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transport</span>
                  <span className="text-orange-400">−{fmtEur(takeHomeNoHousing.transportMonthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Healthcare</span>
                  <span className="text-yellow-500">−{fmtEur(takeHomeNoHousing.healthcareMonthly)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-base">
                  <span className="text-white">You keep</span>
                  <span className="text-green-400">{fmtEur(takeHomeNoHousing.spendableMonthly)}/mo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/tools/real-income-calculator"
              className="flex-1 text-center bg-white text-gray-900 font-bold px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Calculate your exact income →
            </Link>
            <Link
              href="/agencies-with-housing"
              className="flex-1 text-center bg-white/10 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              Compare agencies with housing →
            </Link>
          </div>
          <p className="text-[10px] text-gray-600 mt-3">
            Estimates based on worker-reported data + Dutch tax tables 2026. Actual results may vary significantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">

            {/* ── Active listings ── */}
            {jobs.length > 0 ? (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {job.title} jobs in {cityData.name} ({jobs.length})
                </h2>
                <div className="space-y-3">
                  {jobs.map((j) => (
                    <div key={j.id} className="border border-gray-200 rounded-xl p-4 hover:border-brand-300 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">{j.title}</div>
                          <div className="text-sm text-gray-600 mt-0.5">
                            <Link href={`/agencies/${j.agencySlug}`} className="hover:text-brand-600 hover:underline">
                              {j.agencyName}
                            </Link>
                            {" · "}{j.city}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {j.housing === "YES" && (
                              <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-0.5 font-medium">
                                🏠 Housing included
                              </span>
                            )}
                            {j.transport === "YES" && (
                              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-0.5 font-medium">
                                🚌 Transport
                              </span>
                            )}
                          </div>
                          {j.description && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{j.description}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-black text-gray-900 text-sm">
                            €{j.salaryMin.toFixed(2)}–€{j.salaryMax.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">/hr gross (est.)</div>
                          <Link
                            href={`/agencies/${j.agencySlug}`}
                            className="mt-2 inline-block bg-brand-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-brand-700 transition-colors"
                          >
                            View agency →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
                <p className="text-amber-800 font-medium">
                  No active {job.title} listings in {cityData.name} right now.
                </p>
                <p className="text-amber-700 text-sm mt-1">
                  Below are agencies that operate in {cityData.name} or hire {job.title.toLowerCase()}s.
                </p>
              </div>
            )}

            {/* ── Agencies ── */}
            {agencies.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Agencies in {cityData.name} hiring {job.title.toLowerCase()}s
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
                  <p className="mt-3 text-sm text-gray-500">
                    + {agencies.length - 6} more agencies.{" "}
                    <Link href={`/agencies?city=${params.city}`} className="text-brand-600 hover:underline">
                      View all →
                    </Link>
                  </p>
                )}
              </section>
            )}

            {/* ── Nearby cities with same job ── */}
            {nearbyCities.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {job.title} jobs near {cityData.name}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {nearbyCities.map(({ city: c, jobCount }) => (
                    <Link
                      key={c.slug}
                      href={`/jobs/netherlands/${c.slug}/${params.jobType}`}
                      className="border border-gray-200 rounded-xl px-4 py-3 hover:border-brand-400 hover:bg-brand-50 transition-colors group"
                    >
                      <div className="font-semibold text-sm text-gray-900 group-hover:text-brand-700">
                        📍 {c.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.region}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {jobCount > 0 ? `${jobCount} listing${jobCount !== 1 ? "s" : ""}` : "See agencies"}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-6">

            {/* Hard CTA */}
            <div className="bg-brand-600 text-white rounded-xl p-5">
              <div className="text-2xl mb-2">⚠️</div>
              <h3 className="font-bold text-lg mb-2">
                Agency says €{fmtEur(takeHomeWithHousing.grossMonthly)}/mo?
              </h3>
              <p className="text-sm opacity-90 mb-1">
                Worker data says you may actually keep:
              </p>
              <p className="text-3xl font-black mb-3">
                {fmtEur(takeHomeWithHousing.spendableMonthly)}/mo
              </p>
              <Link
                href="/tools/real-income-calculator"
                className="block w-full text-center bg-white text-brand-700 font-bold px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Calculate my real income →
              </Link>
              <p className="text-[10px] opacity-60 mt-2 text-center">
                Estimate · actual results may vary
              </p>
            </div>

            {/* Salary range */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm">
                  {job.icon} {job.title} salary in Netherlands
                </h3>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">WML (minimum)</span>
                  <span className="font-bold text-red-600">{fmtEur(job.min, 2)}/hr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Worker average</span>
                  <span className="font-bold text-amber-600">{fmtEur(job.avg, 2)}/hr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Top end</span>
                  <span className="font-bold text-green-600">{fmtEur(job.max, 2)}/hr</span>
                </div>
                <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-100 mt-2">
                  Based on worker-reported data. Estimates — actual results may vary.
                </p>
              </div>
            </div>

            {/* Other job types in this city */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm">Other jobs in {cityData.name}</h3>
              </div>
              <div className="p-3 space-y-1">
                {otherJobTypes.slice(0, 6).map((jt) => {
                  const count = JOB_LISTINGS.filter(
                    (j) => j.isActive && j.jobType === jt.slug && j.city.toLowerCase() === cityData.name.toLowerCase()
                  ).length;
                  return (
                    <Link
                      key={jt.slug}
                      href={`/jobs/netherlands/${params.city}/${jt.slug}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-700 transition-colors"
                    >
                      <span>{jt.icon} {jt.title}</span>
                      <span className="text-xs text-gray-400">
                        {count > 0 ? `${count} jobs` : "see agencies"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Share experience CTA — data loop */}
            <div className="border border-green-200 bg-green-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-2">Worked here?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Share your {job.title.toLowerCase()} experience in {cityData.name} — takes 2 minutes, no login, helps other workers.
              </p>
              <SubmitExperienceButton
                agencyName=""
                city={cityData.name}
                jobType={job.title}
                className="w-full justify-center"
              />
            </div>

            {/* Reviews CTA */}
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-2">Read worker reviews</h3>
              <p className="text-sm text-gray-600 mb-4">
                Workers share what {job.title.toLowerCase()} life in {cityData.name} is really like — housing, pay accuracy, management.
              </p>
              <Link
                href="/reviews"
                className="block w-full text-center bg-gray-900 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                ⭐ Read reviews →
              </Link>
            </div>

          </aside>
        </div>

        {/* ── Bottom disclaimer ── */}
        <WorkerDisclaimer variant="salary" size="subtle" className="mt-10" />

      </div>
    </>
  );
}
