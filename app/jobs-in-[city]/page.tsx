/**
 * AgencyCheck — City job hub page
 *
 * /jobs-in-amsterdam
 * /jobs-in-rotterdam
 * /jobs-in-eindhoven
 * ...etc for every city with population ≥ 10k
 *
 * Integrates: seoMetrics, seoContent, jobRanking, SalaryCalculatorEmbed
 */

import type { Metadata }        from "next";
import Link                     from "next/link";
import { notFound }             from "next/navigation";
import { CITIES }               from "@/lib/seoData";
import {
  SEO_TOP_CITIES,
  SEO_ALL_CITIES,
  SEO_JOB_TYPES,
  getJobsForCity,
  topAgenciesForJobs,
  avgSalaryForJobs,
  housingPctForJobs,
}                               from "@/lib/seoRoutes";
import {
  getCityIntro,
  getCityFAQ,
  buildFAQSchema,
}                               from "@/lib/seoContent";
import { getCityMetrics }       from "@/lib/seoMetrics";
import { rankJobs, getTopEmployerBadge } from "@/lib/jobRanking";
import InternalLinksGrid        from "@/components/InternalLinksGrid";
import SalaryCalculatorEmbed    from "@/components/SalaryCalculatorEmbed";

// ─── Static params: every city with population ≥ 10k ─────────────────────────

export function generateStaticParams() {
  return SEO_ALL_CITIES.map((c) => ({ city: c.slug }));
}

// Allow any city slug to be resolved dynamically — the page's own
// `if (!city) notFound()` guard handles unknown slugs correctly.
// dynamicParams=false was causing 404s in force-dynamic (layout) mode.
export const dynamicParams = true;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata> {
  const city = CITIES.find((c) => c.slug === params.city);
  if (!city) return {};

  const metrics  = getCityMetrics(city.slug);
  const jobCount = metrics?.totalJobs ?? Math.round(city.population / 3000) + 15;
  const avgSal   = metrics?.avgSalary ?? 14.80;

  return {
    title:       `Jobs in ${city.name}, Netherlands 2026 — ${jobCount}+ Vacancies | AgencyCheck`,
    description: `Find ${jobCount}+ warehouse, logistics and production jobs in ${city.name}. Average pay €${avgSal.toFixed(2)}/hr. Many positions include housing. Verified Dutch employment agencies.`,
    alternates:  { canonical: `https://agencycheck.io/jobs-in-${city.slug}` },
    openGraph: {
      title:       `Jobs in ${city.name} Netherlands — AgencyCheck`,
      description: `Warehouse, logistics and production jobs in ${city.name}. Many include housing and transport.`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobsInCityPage({ params }: { params: { city: string } }) {
  const city = CITIES.find((c) => c.slug === params.city);
  if (!city) notFound();

  // Data
  const metrics    = getCityMetrics(city.slug);
  const allJobs    = getJobsForCity(city.slug);
  const rankedJobs = rankJobs(allJobs);
  const displayJobs = rankedJobs.slice(0, 30);

  const totalJobs  = metrics?.totalJobs  ?? (allJobs.length > 0 ? allJobs.length : Math.round(city.population / 3000) + 15);
  const avgSalary  = metrics?.avgSalary  ?? (avgSalaryForJobs(allJobs) || 14.80);
  const housingPct = metrics?.housingPct ?? (housingPctForJobs(allJobs) || 30);
  const topAgencies = metrics?.topAgencies ?? topAgenciesForJobs(allJobs, 5);

  // Content
  const intro      = getCityIntro(city, totalJobs, avgSalary);
  const faq        = getCityFAQ(city);
  const faqSchema  = buildFAQSchema(faq);

  // Job type breakdown from actual data
  const byType: Record<string, number> = {};
  for (const j of allJobs) {
    byType[j.jobType] = (byType[j.jobType] ?? 0) + 1;
  }

  // Related cities (same region)
  const relatedCities = CITIES.filter(
    (c) => c.region === city.region && c.slug !== city.slug && c.population >= 30000
  ).sort((a, b) => b.population - a.population).slice(0, 6);

  // Internal link grids
  const jobTypeLinks = SEO_JOB_TYPES.map((jt) => ({
    href:  `/${jt.prefix}-jobs-${city.slug}`,
    label: `${jt.label} in ${city.name}`,
    icon:  jt.icon,
  }));

  const housingJobLinks = SEO_JOB_TYPES.slice(0, 4).map((jt) => ({
    href:  `/${jt.prefix}-jobs-${city.slug}-with-accommodation`,
    label: `${jt.label} + housing`,
    icon:  "🏠",
  }));

  const relatedCityLinks = relatedCities.map((rc) => ({
    href:  `/jobs-in-${rc.slug}`,
    label: `Jobs in ${rc.name}`,
    icon:  "📍",
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
        <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>›</span>
          <Link href="/jobs-in-netherlands" className="hover:text-brand-600">Jobs in Netherlands</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">{city.name}</span>
        </nav>

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-semibold">
              💼 {totalJobs}+ active jobs
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 rounded-full px-2 py-0.5">
              📍 {city.region}
            </span>
            {housingPct > 20 && (
              <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5">
                🏠 ~{housingPct}% with housing
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
            Jobs in {city.name}, Netherlands — 2026
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{intro}</p>
        </div>

        {/* ── Data block ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-brand-700">{totalJobs}+</div>
            <div className="text-xs text-gray-500 mt-0.5">Active jobs</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-green-700">€{avgSalary.toFixed(2)}/hr</div>
            <div className="text-xs text-gray-500 mt-0.5">Avg salary</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-gray-900">{housingPct}%</div>
            <div className="text-xs text-gray-500 mt-0.5">With housing</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-gray-900">{topAgencies.length > 0 ? `${topAgencies.length}+` : "10+"}</div>
            <div className="text-xs text-gray-500 mt-0.5">Agencies</div>
          </div>
        </div>

        {/* ── Worker warning ─────────────────────────────────────────────────── */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-7 text-xs text-amber-700">
          <strong>⚠️ Before you accept any job:</strong> Always get a written contract. Confirm the exact salary and any housing deductions.
          Verify the agency holds a valid ABU or NBBU certificate. Never pay a fee to get a job — it is illegal in the Netherlands.
        </div>

        {/* ── Job type browse grid ────────────────────────────────────────────── */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            Browse by job type in {city.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SEO_JOB_TYPES.map((jt) => {
              const count = byType[jt.slug] ?? 0;
              return (
                <Link
                  key={jt.prefix}
                  href={`/${jt.prefix}-jobs-${city.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md hover:border-brand-200 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl shrink-0">{jt.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 group-hover:text-brand-600 leading-tight">
                        {jt.label}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {count > 0 ? `${count} open` : `€${jt.avgSalary.toFixed(2)}/hr avg`}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Top agencies ────────────────────────────────────────────────────── */}
        {topAgencies.length > 0 && (
          <section className="mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-3">
              Top agencies hiring in {city.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topAgencies.map((ag) => {
                const badge = getTopEmployerBadge(ag.slug);
                return (
                  <Link
                    key={ag.slug}
                    href={`/agencies/${ag.slug}`}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-brand-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{ag.name}</span>
                      {badge && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{ag.count} jobs →</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Job listings ───────────────────────────────────────────────────── */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Active vacancies in {city.name}
            {allJobs.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">({allJobs.length} jobs)</span>
            )}
          </h2>

          {displayJobs.length > 0 ? (
            <div className="space-y-2">
              {displayJobs.map((job) => {
                const badge      = getTopEmployerBadge(job.agencySlug);
                const hasHousing = job.housing === "YES";
                const jobKey     = `${job.agencySlug}-${job.title}-${job.city}`;
                return (
                  <Link
                    key={jobKey}
                    href={`/agencies/${job.agencySlug}`}
                    className="block group"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-brand-200 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-brand-600 truncate">
                                  {job.title}
                                </h3>
                                {badge && (
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${badge.className}`}>
                                    {badge.label}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {job.agencyName} · 📍 {job.city}
                              </p>
                            </div>
                            {job.salaryMin > 0 && (
                              <div className="text-right shrink-0">
                                <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 block whitespace-nowrap">
                                  €{job.salaryMin.toFixed(2)}{job.salaryMax > job.salaryMin ? `–${job.salaryMax.toFixed(2)}` : ""}/hr
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {hasHousing && (
                              <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium">🏠 Housing</span>
                            )}
                            {job.transport === "YES" && (
                              <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">🚌 Transport</span>
                            )}
                            <span className="text-[10px] text-gray-400 ml-auto">View agency →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                Browse agencies that hire in {city.name} — click any agency to see their current vacancies.
              </p>
              {SEO_JOB_TYPES.slice(0, 6).map((jt) => (
                <Link
                  key={jt.prefix}
                  href={`/${jt.prefix}-jobs-${city.slug}`}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-brand-300 hover:shadow-sm transition-all group"
                >
                  <span className="text-xl">{jt.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900 group-hover:text-brand-600">{jt.label} jobs in {city.name}</p>
                    <p className="text-xs text-gray-500">€{jt.salaryMin.toFixed(2)}–€{jt.salaryMax.toFixed(2)}/hr</p>
                  </div>
                  <span className="text-xs text-brand-600">View →</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Salary table ───────────────────────────────────────────────────── */}
        <section className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            💰 What you can earn in {city.name}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="text-left p-2 border border-gray-200 font-semibold text-gray-700">Job type</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold text-gray-700">Gross/hr</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold text-gray-700">Gross/month</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold text-gray-700">After tax ≈</th>
                </tr>
              </thead>
              <tbody>
                {SEO_JOB_TYPES.slice(0, 6).map((jt) => {
                  const gross = Math.round(jt.avgSalary * 173);
                  const net   = Math.round(gross * 0.735);
                  return (
                    <tr key={jt.prefix} className="border-b border-gray-100 hover:bg-white transition-colors">
                      <td className="p-2 border border-gray-200 text-gray-700">
                        <Link href={`/${jt.prefix}-jobs-${city.slug}`} className="hover:text-brand-600">
                          {jt.icon} {jt.label}
                        </Link>
                      </td>
                      <td className="p-2 border border-gray-200 font-semibold text-green-700">
                        €{jt.salaryMin.toFixed(2)}–€{jt.salaryMax.toFixed(2)}
                      </td>
                      <td className="p-2 border border-gray-200 text-gray-600">≈ €{gross.toLocaleString()}</td>
                      <td className="p-2 border border-gray-200 text-blue-700 font-medium">≈ €{net.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">
            Estimates for 40h/week. Actual amounts vary. Housing deduction (if applicable) ~€80–€130/week not included.
          </p>
          <div className="mt-3">
            <Link href="/real-salary-netherlands-after-rent" className="text-xs text-brand-600 hover:underline font-medium">
              → Calculate your real take-home salary after housing and tax
            </Link>
          </div>
        </section>

        {/* ── Salary calculator (client component) ───────────────────────────── */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            🧮 Salary calculator — {city.name}
          </h2>
          <SalaryCalculatorEmbed
            defaultHourly={avgSalary}
            defaultHours={40}
            jobLabel={`Average warehouse job in ${city.name}`}
          />
        </section>

        {/* ── Internal link grids ─────────────────────────────────────────────── */}
        <InternalLinksGrid
          title={`Job types in ${city.name}`}
          links={jobTypeLinks}
        />

        <InternalLinksGrid
          title={`Jobs with accommodation in ${city.name}`}
          links={[
            { href: `/jobs-with-accommodation-netherlands`, label: "All NL jobs with housing", icon: "🏘️", highlight: true },
            ...housingJobLinks,
          ]}
        />

        {relatedCityLinks.length > 0 && (
          <InternalLinksGrid
            title={`More jobs in ${city.region}`}
            links={[
              ...relatedCityLinks,
              { href: "/jobs-in-netherlands", label: "All NL jobs", icon: "🇳🇱", highlight: true },
            ]}
          />
        )}

        {/* ── Popular cities grid ────────────────────────────────────────────── */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Other popular cities for work in Netherlands</h2>
          <div className="flex flex-wrap gap-2">
            {SEO_TOP_CITIES.filter((c) => c.slug !== city.slug).slice(0, 16).map((c) => (
              <Link
                key={c.slug}
                href={`/jobs-in-${c.slug}`}
                className="inline-flex items-center text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 hover:border-brand-300 hover:text-brand-700 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Frequently asked questions — Jobs in {city.name}
          </h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <summary className="p-4 font-medium text-sm text-gray-800 cursor-pointer list-none flex items-center justify-between hover:bg-gray-50">
                  {item.q}
                  <span className="text-gray-400 ml-2 shrink-0">▾</span>
                </summary>
                <div className="px-4 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        <p className="text-xs text-gray-400 text-center mt-4">
          Data is informational. Always verify job details and contract terms with the agency directly.
        </p>
      </div>
    </>
  );
}
