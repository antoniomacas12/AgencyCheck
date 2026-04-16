import type { Metadata } from "next";
import { notFound, redirect, permanentRedirect } from "next/navigation";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import SectionHeader from "@/components/SectionHeader";
import ApplyBar from "@/components/ApplyBar";
import {
  ALL_AGENCIES,
  ALL_AGENCY_MAP,
  getTransparencyTier,
  type EnrichedAgency,
} from "@/lib/agencyEnriched";
import {
  JOB_SALARY_DATA,
  CITIES,
  CITIES_BY_POPULATION,
} from "@/lib/seoData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";
import { JOB_LISTINGS, JOB_MAP, TEMPO_TEAM_JOB_IDS } from "@/lib/jobData";

// ─── Static params — job types + individual job slugs + tempo-team job IDs ───
export function generateStaticParams() {
  const jobTypeParams   = Object.keys(JOB_SALARY_DATA).map((jobType) => ({ jobType }));
  const jobSlugParams   = JOB_LISTINGS.map((j) => ({ jobType: j.slug }));
  const tempoTeamParams = TEMPO_TEAM_JOB_IDS.map((id) => ({ jobType: id }));
  return [...jobTypeParams, ...jobSlugParams, ...tempoTeamParams];
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { jobType: string };
}): Promise<Metadata> {
  // Check if this is an individual job listing slug
  const individualJob = JOB_MAP[params.jobType];
  if (individualJob) {
    return {
      title: `${individualJob.title} — ${individualJob.agencyName} — ${individualJob.city} — AgencyCheck`,
      description: `${individualJob.title} vacancy via ${individualJob.agencyName} in ${individualJob.city}. ${individualJob.housing === "YES" ? "Housing included. " : ""}€${individualJob.salaryMin.toFixed(2)}–€${individualJob.salaryMax.toFixed(2)}/hr gross.`,
      alternates: { canonical: `https://agencycheck.io/jobs/${individualJob.slug}` },
    };
  }

  const job = JOB_SALARY_DATA[params.jobType];
  if (!job) return { title: "Job type not found" };

  return {
    title:       `${job.title} Jobs Netherlands — Salary, Housing & Agencies — AgencyCheck`,
    description: `Find ${job.title.toLowerCase()} jobs in the Netherlands. Average pay: €${job.avg}/hr. Compare agencies, housing options, and worker reviews.`,
    alternates:  { canonical: `https://agencycheck.io/jobs/${params.jobType}` },
    openGraph: {
      title:       `${job.title} Jobs in the Netherlands — AgencyCheck`,
      description: `${job.title} salary: €${job.min}–€${job.max}/hr. Find agencies hiring now with housing and transport options.`,
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Agencies that list this job type in their jobTypes field */
function getAgenciesForJobType(jobTypeSlug: string): EnrichedAgency[] {
  const job = JOB_SALARY_DATA[jobTypeSlug];
  if (!job) return [];

  // Match on jobFocus first, then jobTypes string fallback
  const keywords = job.title.toLowerCase().split(" ");

  return ALL_AGENCIES.filter((a) => {
    // Direct jobFocus match
    if (a.jobFocus.some((jf) => jf === jobTypeSlug || jf.startsWith(jobTypeSlug.split("-")[0]))) {
      return true;
    }
    // Fallback: jobTypes string contains keywords
    if (a.jobTypes) {
      const jt = a.jobTypes.toLowerCase();
      return keywords.some((kw) => kw.length > 3 && jt.includes(kw));
    }
    return false;
  }).sort((a, b) => b.transparencyScore - a.transparencyScore || b.score - a.score);
}

// Certified agency slugs — always shown first in job listings
const CERTIFIED_SLUGS = new Set([
  "randstad", "randstad-nederland",
  "tempo-team-amsterdam-uitzendbureau", "tempo-team",
  "otto-workforce", "otto-work-force",
  "covebo",
]);

/** Active job listings for this job type — certified agencies sorted first */
function getListingsForJobType(jobTypeSlug: string) {
  const all = JOB_LISTINGS.filter((j) => j.jobType === jobTypeSlug && j.isActive);
  // Put certified agency listings at the top
  const certified  = all.filter((j) => CERTIFIED_SLUGS.has(j.agencySlug));
  const rest       = all.filter((j) => !CERTIFIED_SLUGS.has(j.agencySlug));
  return [...certified, ...rest].slice(0, 16);
}

/** Cities that have active listings for this job type */
function getCitiesForJobType(jobTypeSlug: string): { name: string; slug: string; count: number }[] {
  const listings = JOB_LISTINGS.filter((j) => j.jobType === jobTypeSlug && j.isActive);
  const cityMap: Record<string, number> = {};
  for (const l of listings) {
    cityMap[l.city] = (cityMap[l.city] ?? 0) + 1;
  }
  return Object.entries(cityMap)
    .map(([name, count]) => {
      const cityObj = CITIES.find((c) => c.name === name);
      return cityObj ? { name, slug: cityObj.slug, count } : null;
    })
    .filter(Boolean)
    .sort((a, b) => (b?.count ?? 0) - (a?.count ?? 0))
    .slice(0, 16) as { name: string; slug: string; count: number }[];
}

// Maps job-listing agencySlug → actual agency page slug (for links)
const JOB_AGENCY_PAGE_SLUG: Record<string, string> = {
  "randstad":       "randstad-nederland",
  "otto-work-force": "otto-workforce",
};

// ─── Individual job detail view ───────────────────────────────────────────────
function JobDetailView({ jobSlug }: { jobSlug: string }) {
  const job = JOB_MAP[jobSlug];
  if (!job) return null;

  const agencyPageSlug = JOB_AGENCY_PAGE_SLUG[job.agencySlug] ?? job.agencySlug;
  const agency = ALL_AGENCY_MAP[job.agencySlug] ?? ALL_AGENCY_MAP[agencyPageSlug];
  const salaryValid = job.salaryMin >= WML_HOURLY_2026;
  const netMonthlyEst = salaryValid ? Math.round(job.salaryMax * 173 * 0.63 - 140) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
        <span>›</span>
        <Link href={`/jobs/${job.jobType}`} className="hover:text-brand-600">{job.jobType.replace(/-/g, " ")}</Link>
        <span>›</span>
        <span className="text-gray-600 truncate max-w-[180px]">{job.title}</span>
      </nav>

      <div className="card p-5 mb-5">
        <div className="flex items-start gap-3">
          <span className="text-4xl shrink-0">{job.icon}</span>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h1>
            <p className="text-sm text-brand-600 font-semibold mt-1">{job.agencyName}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
              <span>📍 {job.city}</span>
              {job.housing === "YES" && (
                <span className="bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5 font-medium">🏠 Housing incl. (deducted from salary) (deducted from salary)</span>
              )}
              {job.transport === "YES" && (
                <span className="bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5 font-medium">🚌 Transport included</span>
              )}
            </div>
          </div>
          {salaryValid && (
            <div className="shrink-0 text-right">
              <p className="text-lg font-extrabold text-brand-700">€{job.salaryMin.toFixed(2)}–{job.salaryMax.toFixed(2)}</p>
              <p className="text-xs text-gray-400">/hr gross</p>
            </div>
          )}
        </div>
        {job.description && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{job.description}</p>
        )}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
          <Link href={`/agencies/${agencyPageSlug}`} className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            View {job.agencyName} profile →
          </Link>
          <Link href="/tools/real-income-calculator" className="border border-brand-200 text-brand-700 hover:bg-brand-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            🧮 Calculate real income →
          </Link>
        </div>
      </div>

      {/* ══ REAL INCOME BLOCK — impossible to miss ══ */}
      {salaryValid && netMonthlyEst !== null && (() => {
        const hoursPerWeek = 40;
        const grossWeekly  = Math.round(job.salaryMax * hoursPerWeek);
        const taxRate      = grossWeekly < 600 ? 0.18 : grossWeekly < 800 ? 0.22 : 0.27;
        const taxWeekly    = Math.round(grossWeekly * taxRate);
        const housingWkly  = job.housing === "YES" ? 140 : 0;
        const transWkly    = job.transport === "YES" ? 30 : 0;
        const realWeekly   = grossWeekly - taxWeekly - housingWkly - transWkly;

        return (
          <div className="rounded-2xl overflow-hidden border-2 border-gray-900 mb-5">
            <div className="bg-gray-900 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Real income estimate</p>
              <p className="text-sm font-bold text-white">What you actually keep from this job</p>
            </div>
            <div className="bg-white divide-y divide-gray-100">
              <div className="flex justify-between items-center px-4 py-3">
                <p className="text-sm text-gray-600">Gross pay <span className="text-gray-400 text-xs">(€{job.salaryMax.toFixed(2)}/hr · 40hrs)</span></p>
                <p className="text-sm font-bold text-gray-900">€{grossWeekly}/week</p>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <p className="text-sm text-gray-600">Tax &amp; social insurance <span className="text-gray-400 text-xs">(≈{Math.round(taxRate*100)}%)</span></p>
                <p className="text-sm font-semibold text-red-500">−€{taxWeekly}</p>
              </div>
              {housingWkly > 0 && (
                <div className="flex justify-between items-center px-4 py-3">
                  <p className="text-sm text-gray-600">Housing deduction <span className="text-gray-400 text-xs">(agency room)</span></p>
                  <p className="text-sm font-semibold text-red-500">−€{housingWkly}</p>
                </div>
              )}
              {transWkly > 0 && (
                <div className="flex justify-between items-center px-4 py-3">
                  <p className="text-sm text-gray-600">Transport <span className="text-gray-400 text-xs">(deducted by agency)</span></p>
                  <p className="text-sm font-semibold text-red-500">−€{transWkly}</p>
                </div>
              )}
              <div className="flex justify-between items-center px-4 py-4 bg-brand-50">
                <div>
                  <p className="text-base font-black text-gray-900">You actually keep</p>
                  <p className="text-xs text-gray-500">per week · after all costs</p>
                </div>
                <p className="text-2xl font-black text-brand-700">€{realWeekly}</p>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-gray-500">📊 Based on worker-reported data — not agency estimates. Actual amount varies by contract.</p>
              <Link href="/tools/real-income-calculator"
                className="text-xs font-bold text-brand-600 hover:text-brand-800 whitespace-nowrap">
                Enter your exact rate →
              </Link>
            </div>
          </div>
        );
      })()}

      {agency && (
        <div className="card p-4 mb-5">
          <h2 className="text-sm font-bold text-gray-800 mb-3">🏢 About {job.agencyName}</h2>
          {agency.description && <p className="text-xs text-gray-600 leading-relaxed mb-3">{agency.description}</p>}
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="text-gray-500">📍 {agency.city}</span>
            <span className={`font-medium ${agency.housing === "YES" ? "text-green-700" : "text-gray-400"}`}>
              {agency.housing === "YES" ? "🏠 Housing confirmed" : "Housing: ask agency"}
            </span>
          </div>
          <Link href={`/agencies/${agencyPageSlug}`} className="mt-3 inline-block text-xs text-brand-600 font-medium hover:underline">
            Full agency profile & worker reviews →
          </Link>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
        <h2 className="font-bold text-amber-900 text-sm mb-2">⚠️ Before accepting this job</h2>
        <ul className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
          <li>→ Minimum wage 2026 is <strong>€{WML_HOURLY_2026}/hr</strong>. Ensure this job meets the minimum.</li>
          <li>→ Ask about night shifts, Sunday pay, and overtime — these must appear on your payslip.</li>
          {job.housing === "YES" && <li>→ Housing included — confirm the weekly deduction in writing: typically <strong>€80–€110/week</strong>.</li>}
          <li>→ Get the contract in a language you understand before signing.</li>
        </ul>
      </div>

      <Link href={`/jobs/${job.jobType}`} className="block card p-4 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
        <p className="text-sm font-semibold text-gray-900">Browse all {job.jobType.replace(/-/g, " ")} jobs →</p>
        <p className="text-xs text-gray-400 mt-1">Salary data, agency comparisons, and city-by-city listings</p>
      </Link>

      {/* ── Apply CTA ── */}
      <div className="mt-6">
        <ApplyBar
          context={{
            sourcePage: `/jobs/${job.slug}`,
            sourceType: "job_page",
            sourceSlug: job.slug,
            sourceLabel: `${job.title} at ${job.agencyName}`,
            defaultAccommodation: job.housing === "YES" ? true : undefined,
          }}
          headline={job.housing === "YES" ? `Interested in this job with housing?` : `Interested in this ${job.title} role?`}
          subline="Share your details — we'll reach out if there's a match"
          ctaText="Find me a job"
          showInline
          inlineLabel="Interested in this position?"
        />
      </div>

      {/* Sticky apply bar for all job pages */}
      <ApplyBar
        context={{
          sourcePage: `/jobs/${job.slug}`,
          sourceType: "job_page",
          sourceSlug: job.slug,
          sourceLabel: `${job.title} at ${job.agencyName}`,
        }}
        headline={`Interested in this ${job.title} role?`}
        subline="Share your details — free · no commitment"
        alwaysVisible
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function JobTypePage({
  params,
}: {
  params: { jobType: string };
}) {
  // If this is an individual job slug, render the job detail view
  if (JOB_MAP[params.jobType]) {
    return <JobDetailView jobSlug={params.jobType} />;
  }

  const job = JOB_SALARY_DATA[params.jobType];
  // Stale/removed job slug — redirect permanently so Google drops the old URL
  if (!job) permanentRedirect("/jobs");

  const listings        = getListingsForJobType(params.jobType);
  const relatedAgencies = getAgenciesForJobType(params.jobType);
  const citiesWithJobs  = getCitiesForJobType(params.jobType);
  const withHousingListings = listings.filter((l) => l.housing === "YES");
  const withTransportListings = listings.filter((l) => l.transport === "YES");

  const netMonthlyEst = Math.round(job.avg * 173 * 0.63 - 140);

  // Top cities by population for salary page links
  const topCitiesSlugs = CITIES_BY_POPULATION
    .filter((c) => c.population >= 50000)
    .slice(0, 20);

  // Related job types
  const relatedJobs = Object.entries(JOB_SALARY_DATA)
    .filter(([slug]) => slug !== params.jobType)
    .slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>›</span>
        <span className="text-gray-600">Jobs</span>
        <span>›</span>
        <span className="text-gray-800 font-medium">{job.title}</span>
      </nav>

      {/* ── Hero ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{job.icon}</span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5 font-medium">
            €{job.min}–€{job.max}/hr
          </span>
          {withHousingListings.length > 0 && (
            <span className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
              🏠 Housing available
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          {job.title} Jobs in the Netherlands
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          {job.description} Find employment agencies hiring {job.title.toLowerCase()}s across
          the Netherlands. Compare salary, housing, transport, and worker reviews before applying.
        </p>

        {/* Quick facts */}
        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600">
          <span className="text-brand-700 font-semibold">
            💶 Avg €{job.avg}/hr gross
          </span>
          <span>≈€{netMonthlyEst}/mo net</span>
          {listings.length > 0 && (
            <span>💼 <strong>{listings.length}</strong> active listings</span>
          )}
          {withHousingListings.length > 0 && (
            <span className="text-green-700">🏠 <strong>{withHousingListings.length}</strong> with housing</span>
          )}
          {withTransportListings.length > 0 && (
            <span className="text-blue-700">🚌 <strong>{withTransportListings.length}</strong> with transport</span>
          )}
        </div>
      </div>

      {/* ── Salary card ── */}
      <div className="card p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-800 mb-4">
          💶 {job.title} Salary in the Netherlands
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-400 mb-1">Minimum</p>
            <p className="text-xl font-extrabold text-gray-700">€{job.min}</p>
            <p className="text-xs text-gray-400">/hr gross</p>
          </div>
          <div className="border-x border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Average</p>
            <p className="text-2xl font-extrabold text-brand-700">€{job.avg}</p>
            <p className="text-xs text-gray-400">/hr gross</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Maximum</p>
            <p className="text-xl font-extrabold text-gray-700">€{job.max}</p>
            <p className="text-xs text-gray-400">/hr gross</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-3 gap-3 text-center text-xs text-gray-500">
          <div>
            <p className="font-semibold text-gray-700">€{netMonthlyEst}/mo</p>
            <p>Est. net (40h/week)</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">€{WML_HOURLY_2026}/hr</p>
            <p>WML minimum 2026</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">25–35%</p>
            <p>Tax + ZVW levy reduction</p>
          </div>
        </div>
        <div className="mt-3 text-center">
          <Link
            href={`/salary/${params.jobType}-netherlands`}
            className="text-xs text-brand-600 hover:underline"
          >
            Full salary breakdown →
          </Link>
        </div>
      </div>

      {/* ── Active job listings ── */}
      {listings.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title={`Active ${job.title} Listings`}
            subtitle={`${listings.length} current ${job.title.toLowerCase()} vacancies from agencies across the Netherlands`}
          />
          {/* Certified notice */}
          <div className="mb-3 px-3 py-2 bg-brand-50 border border-brand-100 rounded-lg text-[11px] text-brand-700">
            <span className="font-bold">✅ Certified listings shown first</span>
            <span className="text-brand-500 ml-1">— Randstad, Tempo-Team, Otto Workforce &amp; Covebo are ABU-registered top employers.</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {listings.map((l) => {
              const isCertified = CERTIFIED_SLUGS.has(l.agencySlug);
              return (
              <Link
                key={l.slug}
                href={`/jobs/${l.slug}`}
                className={`card p-3.5 hover:shadow-md transition-all flex items-start gap-3 ${isCertified ? "border-brand-200 hover:border-brand-400 bg-brand-50/30" : "hover:border-brand-100"}`}
              >
                <span className="text-2xl shrink-0">{l.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-gray-900">{l.title}</p>
                    <span className="text-xs font-bold text-brand-700 shrink-0">
                      €{l.salaryMin.toFixed(2)}–€{l.salaryMax.toFixed(2)}/hr
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xs text-brand-600">{l.agencyName}</p>
                    {isCertified && (
                      <span className="text-[9px] font-bold bg-brand-100 text-brand-700 rounded-full px-1.5 py-0.5 leading-tight">✅ Certified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-400">📍 {l.city}</span>
                    {l.housing === "YES" && (
                      <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 rounded-full px-1.5 py-0.5 font-medium">
                        🏠 Housing incl. (deducted from salary)
                      </span>
                    )}
                    {l.transport === "YES" && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-1.5 py-0.5 font-medium">
                        🚌 Transport incl.
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Salary by city grid ── */}
      <section className="mb-8">
        <SectionHeader
          title={`${job.title} Salary by City`}
          subtitle="Salary data varies by city, employer, and contract type"
        />
        <div className="grid sm:grid-cols-3 gap-2">
          {topCitiesSlugs.slice(0, 18).map((c) => (
            <Link
              key={c.slug}
              href={`/salary/${params.jobType}-${c.slug}`}
              className="card px-3 py-2.5 flex items-center justify-between hover:border-brand-200 hover:bg-brand-50/30 transition-all"
            >
              <span className="text-xs font-medium text-gray-800">{c.name}</span>
              <span className="text-xs font-bold text-brand-700">€{job.avg}/hr →</span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-3">
          <Link href={`/salary/${params.jobType}-netherlands`}
            className="text-xs text-brand-600 hover:underline">
            National salary overview →
          </Link>
        </div>
      </section>

      {/* ── Agencies hiring ── */}
      {relatedAgencies.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title={`Agencies Hiring ${job.title}s`}
            subtitle={`${relatedAgencies.length} agenc${relatedAgencies.length === 1 ? "y" : "ies"} matched to this job type`}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedAgencies.slice(0, 8).map((a) => (
              <AgencyCard key={a.id} agency={a} />
            ))}
          </div>
          {relatedAgencies.length > 8 && (
            <p className="text-xs text-gray-400 text-center mt-3">
              Showing 8 of {relatedAgencies.length} agencies.{" "}
              <Link href="/agencies" className="text-brand-600 hover:underline">Browse all →</Link>
            </p>
          )}
        </section>
      )}

      {/* ── Cities with active listings ── */}
      {citiesWithJobs.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            📍 {job.title} Jobs by City
          </h3>
          <div className="flex flex-wrap gap-2">
            {citiesWithJobs.map((c) => (
              <Link
                key={c.slug}
                href={`/salary/${params.jobType}-${c.slug}`}
                className="text-xs text-brand-600 border border-brand-100 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors"
              >
                {c.name} ({c.count})
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Worker checklist ── */}
      <section className="mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-bold text-amber-900 text-sm mb-2">
            ⚠️ Before accepting a {job.title.toLowerCase()} job
          </h2>
          <ul className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
            <li>→ Your pay must be at or above WML minimum: <strong>€{WML_HOURLY_2026}/hr</strong>.</li>
            <li>→ Ask about night shifts, Sunday pay, and overtime. These must appear on your payslip.</li>
            <li>→ If housing is included, get the weekly deduction in writing: <strong>€80–€110/week</strong>.</li>
            <li>→ Transport: confirm whether it is free or deducted from your salary.</li>
            <li>→ Get the contract in a language you understand before signing.</li>
          </ul>
        </div>
      </section>

      {/* ── Related job types ── */}
      <section className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 mb-3">💼 Related job types</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {relatedJobs.map(([slug, rJob]) => (
            <Link
              key={slug}
              href={`/jobs/${slug}`}
              className="card px-3 py-2.5 flex items-center gap-2 hover:border-brand-200 hover:bg-brand-50/30 transition-all"
            >
              <span className="text-lg shrink-0">{rJob.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{rJob.title}</p>
                <p className="text-[10px] text-brand-700 font-bold">€{rJob.avg}/hr avg</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Tools CTA ── */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div>
          <p className="font-bold text-brand-800">🧮 What will you actually earn as a {job.title.toLowerCase()}?</p>
          <p className="text-xs text-brand-600 mt-1 leading-relaxed max-w-md">
            €{job.avg}/hr gross is not what hits your bank account.
            Calculate your real take-home after Dutch income tax, healthcare levy, housing, and transport.
          </p>
        </div>
        <Link href="/tools/real-income-calculator"
          className="shrink-0 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
          Calculate real income →
        </Link>
      </div>

    </div>
  );
}
