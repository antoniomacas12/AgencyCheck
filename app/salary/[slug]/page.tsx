import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import {
  parseSalarySlug,
  getJobBySlug,
  getCityBySlug,
  JOB_SALARY_DATA,
  CITIES,
  allSalarySlugs,
} from "@/lib/seoData";
import { AGENCIES } from "@/lib/agencyData";

// ─── Static params for SSG ────────────────────────────────────────────────────
export async function generateStaticParams() {
  return allSalarySlugs().map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { jobSlug, citySlug, isNational } = parseSalarySlug(params.slug);
  const job  = getJobBySlug(jobSlug);
  const city = citySlug ? getCityBySlug(citySlug) : null;
  if (!job) return { title: "Salary data not found" };

  const location = city ? city.name : "Netherlands";
  const title    = `${job.title} Salary in ${location} — AgencyCheck`;
  const desc     = `Average ${job.title} salary in ${location}: €${job.avg.toFixed(2)}/hr. Worker-reported pay data, agencies hiring, and housing options.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `https://agencycheck.io/salary/${params.slug}` },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SalaryPage({ params }: { params: { slug: string } }) {
  const { jobSlug, citySlug, isNational } = parseSalarySlug(params.slug);
  const job  = getJobBySlug(jobSlug);
  const city = citySlug ? getCityBySlug(citySlug) : null;

  if (!job) notFound();

  const location     = city ? city.name : "the Netherlands";
  const locationSlug = city ? city.slug : "netherlands";

  // Filter agencies that list this job title (case-insensitive keyword match)
  const matchingAgencies = AGENCIES.filter((a) => {
    const titles = (a.jobTitles ?? []).map((t) => t.toLowerCase());
    const jobWords = job.title.toLowerCase().split(" ");
    const matchesJob = jobWords.some((w) => titles.some((t) => t.includes(w)));
    const matchesCity = city
      ? a.cities.map((c) => c.toLowerCase()).some((c) => c.includes(city.slug.replace("-", " ")))
      : true;
    return matchesJob && matchesCity;
  }).sort((a, b) => b.score - a.score);

  const withHousing    = matchingAgencies.filter((a) => a.housing === "YES");
  const avgPay         = matchingAgencies.length
    ? matchingAgencies.reduce((s, a) => s + (a.avgHourlyPay ?? job.avg), 0) / matchingAgencies.length
    : job.avg;

  // Related jobs for internal linking
  const relatedJobs = Object.values(JOB_SALARY_DATA)
    .filter((j) => j.slug !== job.slug)
    .slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/search" className="hover:text-brand-600">Salary Data</Link>
        <span>›</span>
        <span className="text-gray-600">{job.title} — {city ? city.name : "Netherlands"}</span>
      </nav>

      {/* ── Header ── */}
      <div className="mb-7">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{job.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {job.title} Salary in {city ? city.name : "the Netherlands"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Worker-reported data · updated 2026
            </p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-3 max-w-xl leading-relaxed">
          {job.description} Find out what agencies pay, which offer housing, and how salaries vary by city.
        </p>
      </div>

      {/* ── Salary overview card ── */}
      <div className="card p-5 mb-7">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Salary overview · {city ? city.name : "Netherlands"}
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-extrabold text-green-600">€{job.min.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Min / hr</p>
          </div>
          <div className="border-x border-gray-100">
            <p className="text-3xl font-extrabold text-brand-600">€{avgPay.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Avg / hr reported</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-700">€{job.max.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Max / hr</p>
          </div>
        </div>

        {/* Monthly estimate */}
        <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
          <div>
            <p className="font-semibold text-gray-800 text-base">€{(avgPay * 8).toFixed(0)}</p>
            <p>Daily (8hrs)</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-base">€{(avgPay * 40).toFixed(0)}</p>
            <p>Weekly (40hrs)</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-base">€{(avgPay * 160).toFixed(0)}</p>
            <p>Monthly (160hrs)</p>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-gray-400">
          Figures are worker-reported gross estimates. Actual take-home after Dutch loonheffing (tax) is typically 60–70% of gross.
          Holiday allowance (vakantiegeld, 8%) is usually paid separately in June.
        </p>
      </div>

      {/* ── Housing callout ── */}
      {withHousing.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-7 flex items-start gap-3">
          <span className="text-2xl shrink-0">🏠</span>
          <div className="flex-1">
            <p className="font-semibold text-green-800 text-sm">
              {withHousing.length} agenc{withHousing.length === 1 ? "y" : "ies"} offer housing for {job.title} workers
              {city ? ` in ${city.name}` : ""}
            </p>
            <p className="text-xs text-green-700 mt-1">
              Agency housing can be worth €350–700/month — significantly boosting your effective income.
            </p>
            <Link
              href="/agencies-with-housing"
              className="inline-block mt-2 text-xs font-semibold text-green-700 underline hover:text-green-900"
            >
              View agencies with housing →
            </Link>
          </div>
        </div>
      )}

      {/* ── Matching agencies ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">
            Agencies hiring {job.title}
            {city ? ` in ${city.name}` : ""}
          </h2>
          <span className="text-xs text-gray-400">{matchingAgencies.length} found</span>
        </div>

        {matchingAgencies.length === 0 ? (
          <div className="card p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">{job.icon}</p>
            <p className="font-semibold text-sm">No agencies found for this combination yet.</p>
            <Link href="/agencies" className="text-xs text-brand-600 mt-2 inline-block hover:underline">
              Browse all agencies →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {matchingAgencies.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
        )}
      </section>

      {/* ── City switcher ── */}
      {isNational && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            {job.title} salary by city
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["rotterdam", "amsterdam", "eindhoven", "tilburg", "breda", "venlo"].map((cSlug) => {
              const c = getCityBySlug(cSlug);
              if (!c) return null;
              return (
                <Link
                  key={cSlug}
                  href={`/salary/${job.slug}-${cSlug}`}
                  className="card p-3 hover:border-brand-200 hover:shadow-sm transition-all text-sm"
                >
                  <p className="font-semibold text-gray-800">📍 {c.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">View salary data →</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Tools CTA ── */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-8 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-semibold text-brand-800 text-sm">🧮 Calculate your real income</p>
          <p className="text-xs text-brand-600 mt-0.5">
            Factor in housing, transport, and tax to see your true take-home.
          </p>
        </div>
        <Link
          href="/tools/real-income-calculator"
          className="shrink-0 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Open calculator →
        </Link>
      </div>

      {/* ── Related jobs ── */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Related jobs
        </h2>
        <div className="flex flex-wrap gap-2">
          {relatedJobs.map((j) => (
            <Link
              key={j.slug}
              href={`/salary/${j.slug}-netherlands`}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors"
            >
              {j.icon} {j.title}
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-8 text-xs text-gray-400 text-center">
        Salary data is worker-reported and informational. AgencyCheck does not verify figures.
      </p>
    </div>
  );
}
