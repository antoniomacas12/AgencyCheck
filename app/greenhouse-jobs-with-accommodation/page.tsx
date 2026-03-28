import type { Metadata } from "next";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import SectionHeader from "@/components/SectionHeader";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";
import { JOB_SALARY_DATA, CITIES } from "@/lib/seoData";
import { JOB_LISTINGS } from "@/lib/jobData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";

export const metadata: Metadata = {
  title: "Greenhouse Jobs in the Netherlands with Accommodation — AgencyCheck",
  description:
    "Greenhouse and horticulture jobs in the Netherlands with housing included. Work in Westland, Naaldwijk, and the Greenport region. Seasonal and year-round. €11.50–€14.00/hr.",
  alternates: { canonical: "/greenhouse-jobs-with-accommodation" },
  openGraph: {
    title: "Greenhouse Jobs Netherlands with Accommodation — AgencyCheck",
    description:
      "Horticulture work with housing included. Compare agencies, locations, and worker conditions. Real worker data.",
  },
};

const job = JOB_SALARY_DATA["greenhouse-worker"]!;
const netMonthly = Math.round(job.avg * 173 * 0.63 - 140);
const housingDeductMonth = Math.round(95 * 4.33);
const netAfterHousing = netMonthly - housingDeductMonth;

const listings = JOB_LISTINGS.filter(
  (j) => j.jobType === "greenhouse-worker" && j.housing === "YES" && j.isActive
);

const agencies = ALL_AGENCIES.filter((a) => {
  if (a.housing !== "YES") return false;
  if (a.jobFocus.some((jf) => jf === "greenhouse-worker" || jf.startsWith("greenhouse"))) return true;
  return (
    a.jobTypes?.toLowerCase().includes("greenhouse") ||
    a.jobTypes?.toLowerCase().includes("horticulture") ||
    a.sector === "agriculture"
  ) ?? false;
}).sort((a, b) => b.transparencyScore - a.transparencyScore);

const cities = [...new Set(listings.map((l) => l.city))]
  .map((name) => {
    const c = CITIES.find((x) => x.name === name);
    const count = listings.filter((l) => l.city === name).length;
    return c ? { name, slug: c.slug, count } : null;
  })
  .filter(Boolean) as { name: string; slug: string; count: number }[];

export default function GreenhouseJobsAccommodationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs/greenhouse-worker" className="hover:text-brand-600">Greenhouse Jobs</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">With Accommodation</span>
      </nav>

      {/* Hero */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🌿</span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5 font-medium">
            €{job.min}–€{job.max}/hr
          </span>
          <span className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
            🏠 Housing incl. (deducted from salary)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Greenhouse Jobs in the Netherlands with Accommodation
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          The Netherlands is one of the largest greenhouse exporters in the world. Most
          horticulture work is concentrated in the Westland area (between Den Haag and the Hook
          of Holland) and the Greenport region. Agencies often provide accommodation nearby.
          Peak season runs March to October, but many growers hire year-round for tomatoes,
          peppers, and flowers. Physical work — standing, lifting, pruning. No Dutch required.
        </p>

        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600">
          <span className="text-brand-700 font-semibold">💶 Avg €{job.avg}/hr gross</span>
          <span>≈€{netAfterHousing}/mo net after housing</span>
          {listings.length > 0 && (
            <span className="text-green-700">🏠 <strong>{listings.length}</strong> listings with housing</span>
          )}
        </div>
      </div>

      {/* Salary + housing card */}
      <div className="card p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-800 mb-4">
          💶 Salary &amp; Housing Cost Breakdown
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-400 mb-1">Min</p>
            <p className="text-xl font-extrabold text-gray-700">€{job.min}</p>
            <p className="text-xs text-gray-400">/hr gross</p>
          </div>
          <div className="border-x border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Average</p>
            <p className="text-2xl font-extrabold text-brand-700">€{job.avg}</p>
            <p className="text-xs text-gray-400">/hr gross</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Max</p>
            <p className="text-xl font-extrabold text-gray-700">€{job.max}</p>
            <p className="text-xs text-gray-400">/hr gross</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-3 gap-3 text-center text-xs text-gray-500">
          <div>
            <p className="font-semibold text-gray-700">€{netMonthly}/mo</p>
            <p>Est. net (40h/wk)</p>
          </div>
          <div>
            <p className="font-semibold text-amber-700">−€{housingDeductMonth}/mo</p>
            <p>Typical housing (€95/wk)</p>
          </div>
          <div>
            <p className="font-semibold text-green-700">≈€{netAfterHousing}/mo</p>
            <p>Left after housing</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-3">
          Seasonal contracts may end at short notice in autumn. Confirm the contract end date
          and housing arrangement in writing before travelling.
        </p>
      </div>

      {/* Active listings */}
      {listings.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title="Active Greenhouse Listings with Housing"
            subtitle={`${listings.length} current vacancies with accommodation included`}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {listings.slice(0, 8).map((l) => (
              <Link
                key={l.slug}
                href={`/jobs/${l.slug}`}
                className="card p-3.5 hover:shadow-md hover:border-brand-100 transition-all flex items-start gap-3"
              >
                <span className="text-2xl shrink-0">{l.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-gray-900">{l.title}</p>
                    <span className="text-xs font-bold text-brand-700 shrink-0">
                      €{l.salaryMin.toFixed(2)}–€{l.salaryMax.toFixed(2)}/hr
                    </span>
                  </div>
                  <p className="text-xs text-brand-600 mt-0.5">{l.agencyName}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-400">📍 {l.city}</span>
                    <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 rounded-full px-1.5 py-0.5">
                      🏠 Housing incl.
                    </span>
                    {l.transport === "YES" && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-1.5 py-0.5">
                        🚌 Transport incl.
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Agencies */}
      {agencies.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title="Agencies with Greenhouse Jobs + Housing"
            subtitle={`${agencies.length} agenc${agencies.length === 1 ? "y" : "ies"} active in horticulture with accommodation`}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {agencies.slice(0, 6).map((a) => (
              <AgencyCard key={a.id} agency={a} />
            ))}
          </div>
          {agencies.length > 6 && (
            <p className="text-xs text-gray-400 text-center mt-3">
              <Link href="/agencies-with-housing" className="text-brand-600 hover:underline">
                All agencies with housing →
              </Link>
            </p>
          )}
        </section>
      )}

      {/* Cities */}
      {cities.length > 0 ? (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            📍 Cities with Greenhouse Jobs + Housing
          </h3>
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                className="text-xs text-brand-600 border border-brand-100 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors"
              >
                {c.name} ({c.count})
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">📍 Main greenhouse regions</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Westland", slug: "westland" },
              { name: "Naaldwijk", slug: "naaldwijk" },
              { name: "Den Haag", slug: "den-haag" },
              { name: "Venlo", slug: "venlo" },
              { name: "Breda", slug: "breda" },
            ].map((c) => (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                className="text-xs text-brand-600 border border-brand-100 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Warning */}
      <section className="mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-bold text-amber-900 text-sm mb-2">
            ⚠️ Seasonal contracts — what to check first
          </h2>
          <ul className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
            <li>→ Ask whether the contract is seasonal (ends in autumn) or year-round.</li>
            <li>→ If housing is tied to the job, find out what happens when the contract ends.</li>
            <li>→ Housing deduction: <strong>€80–€110/week</strong>. Get the amount in writing.</li>
            <li>→ Minimum wage still applies: <strong>€{WML_HOURLY_2026}/hr</strong>.</li>
            <li>→ Ask if the employer is SNF-certified for migrant worker accommodation.</li>
          </ul>
        </div>
      </section>

      {/* Internal links */}
      <section className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">🔗 Related pages</h3>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <Link href="/jobs/greenhouse-worker" className="text-brand-600 hover:underline">
            🌿 All greenhouse jobs →
          </Link>
          <Link href="/jobs-with-accommodation" className="text-brand-600 hover:underline">
            🏠 All jobs with accommodation →
          </Link>
          <Link href="/salary/greenhouse-worker-netherlands" className="text-gray-500 hover:text-brand-600 hover:underline">
            💶 Greenhouse salary overview →
          </Link>
          <Link href="/agencies-with-housing" className="text-gray-500 hover:text-brand-600 hover:underline">
            🏘️ All housing agencies →
          </Link>
          <Link href="/sectors/agriculture" className="text-gray-500 hover:text-brand-600 hover:underline">
            🌾 Agriculture sector →
          </Link>
          <Link href="/jobs/production-worker" className="text-gray-500 hover:text-brand-600 hover:underline">
            ⚙️ Production worker jobs →
          </Link>
        </div>
      </section>

    </div>
  );
}
