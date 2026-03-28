import type { Metadata } from "next";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import SectionHeader from "@/components/SectionHeader";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";
import { JOB_SALARY_DATA, CITIES } from "@/lib/seoData";
import { JOB_LISTINGS } from "@/lib/jobData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";

export const metadata: Metadata = {
  title: "Production Jobs in the Netherlands with Accommodation — AgencyCheck",
  description:
    "Production and factory jobs in the Netherlands with accommodation included. Food production, assembly, and packing roles. Housing provided by agency. €11.50–€14.50/hr.",
  alternates: { canonical: "/production-jobs-with-accommodation" },
  openGraph: {
    title: "Production Jobs Netherlands with Accommodation — AgencyCheck",
    description:
      "Factory and production work with housing included. Compare agencies, deductions, and shift patterns. Real worker data.",
  },
};

const job = JOB_SALARY_DATA["production-worker"]!;
const netMonthly = Math.round(job.avg * 173 * 0.63 - 140);
const housingDeductMonth = Math.round(95 * 4.33);
const netAfterHousing = netMonthly - housingDeductMonth;

const listings = JOB_LISTINGS.filter(
  (j) => j.jobType === "production-worker" && j.housing === "YES" && j.isActive
);

const agencies = ALL_AGENCIES.filter((a) => {
  if (a.housing !== "YES") return false;
  if (a.jobFocus.some((jf) => jf === "production-worker" || jf.startsWith("production"))) return true;
  return a.jobTypes?.toLowerCase().includes("production") ?? false;
}).sort((a, b) => b.transparencyScore - a.transparencyScore);

const cities = [...new Set(listings.map((l) => l.city))]
  .map((name) => {
    const c = CITIES.find((x) => x.name === name);
    const count = listings.filter((l) => l.city === name).length;
    return c ? { name, slug: c.slug, count } : null;
  })
  .filter(Boolean) as { name: string; slug: string; count: number }[];

export default function ProductionJobsAccommodationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs/production-worker" className="hover:text-brand-600">Production Jobs</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">With Accommodation</span>
      </nav>

      {/* Hero */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">⚙️</span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5 font-medium">
            €{job.min}–€{job.max}/hr
          </span>
          <span className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
            🏠 Housing incl. (deducted from salary)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Production Jobs in the Netherlands with Accommodation
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Production and factory jobs in the Netherlands often come with accommodation arranged
          by the agency. Most roles are in food processing, assembly, and packing — located in
          industrial areas around Venlo, Venray, and Helmond. Work is typically on rotating
          3-shift patterns including nights and weekends. No prior factory experience required.
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
          Night and weekend shifts add 20–35% on top of base rate. Ask the agency which shifts
          are included and how premiums appear on your payslip.
        </p>
      </div>

      {/* Active listings */}
      {listings.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title="Active Production Listings with Housing"
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
            title="Agencies with Production Jobs + Housing"
            subtitle={`${agencies.length} agenc${agencies.length === 1 ? "y" : "ies"} verified to provide accommodation`}
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
      {cities.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            📍 Cities with Production Jobs + Housing
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
      )}

      {/* Warning */}
      <section className="mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-bold text-amber-900 text-sm mb-2">
            ⚠️ Shifts, housing, and deductions — check before accepting
          </h2>
          <ul className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
            <li>→ Most production contracts include rotating shifts. Confirm shift pattern before starting.</li>
            <li>→ Night and weekend premiums must show on your payslip — not just be promised verbally.</li>
            <li>→ Housing deduction: <strong>€80–€110/week</strong>. Get the weekly cost in writing.</li>
            <li>→ Minimum wage after housing deduction: <strong>€{WML_HOURLY_2026}/hr</strong>.</li>
            <li>→ Ask if accommodation is SNF-certified before accepting.</li>
          </ul>
        </div>
      </section>

      {/* Internal links */}
      <section className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">🔗 Related pages</h3>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <Link href="/jobs/production-worker" className="text-brand-600 hover:underline">
            ⚙️ All production jobs →
          </Link>
          <Link href="/jobs-with-accommodation" className="text-brand-600 hover:underline">
            🏠 All jobs with accommodation →
          </Link>
          <Link href="/salary/production-worker-netherlands" className="text-gray-500 hover:text-brand-600 hover:underline">
            💶 Production salary overview →
          </Link>
          <Link href="/agencies-with-housing" className="text-gray-500 hover:text-brand-600 hover:underline">
            🏘️ All housing agencies →
          </Link>
          <Link href="/jobs/assembly-worker" className="text-gray-500 hover:text-brand-600 hover:underline">
            🔧 Assembly worker jobs →
          </Link>
          <Link href="/jobs/machine-operator" className="text-gray-500 hover:text-brand-600 hover:underline">
            🔩 Machine operator jobs →
          </Link>
        </div>
      </section>

    </div>
  );
}
