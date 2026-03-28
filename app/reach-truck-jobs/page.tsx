import type { Metadata } from "next";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import SectionHeader from "@/components/SectionHeader";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";
import { JOB_SALARY_DATA, CITIES, CITIES_BY_POPULATION } from "@/lib/seoData";
import { JOB_LISTINGS } from "@/lib/jobData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";

export const metadata: Metadata = {
  title: "Reach Truck Driver Jobs in the Netherlands — AgencyCheck",
  description:
    "Reach truck driver jobs in the Netherlands. Licence required. Average €15.25/hr gross. Compare agencies, housing options, and cities. Updated worker data.",
  alternates: { canonical: "/reach-truck-jobs" },
  openGraph: {
    title: "Reach Truck Jobs Netherlands — AgencyCheck",
    description:
      "Find reach truck driver work through verified agencies. Salary €13.50–€17.00/hr. Licence required.",
  },
};

const job = JOB_SALARY_DATA["reach-truck-driver"]!;
const netMonthly = Math.round(job.avg * 173 * 0.63 - 140);

const listings = JOB_LISTINGS.filter(
  (j) => j.jobType === "reach-truck-driver" && j.isActive
);
const withHousing = listings.filter((l) => l.housing === "YES");
const withTransport = listings.filter((l) => l.transport === "YES");

const agencies = ALL_AGENCIES.filter((a) => {
  if (a.jobFocus.some((jf) => jf === "reach-truck-driver" || jf.startsWith("reach"))) return true;
  return a.jobTypes?.toLowerCase().includes("reach truck") ?? false;
}).sort((a, b) => b.transparencyScore - a.transparencyScore);

const cities = [...new Set(listings.map((l) => l.city))]
  .map((name) => {
    const c = CITIES.find((x) => x.name === name);
    const count = listings.filter((l) => l.city === name).length;
    return c ? { name, slug: c.slug, count } : null;
  })
  .filter(Boolean) as { name: string; slug: string; count: number }[];

const topCities = CITIES_BY_POPULATION
  .filter((c) => c.population >= 50000)
  .slice(0, 15);

export default function ReachTruckJobsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Reach Truck Driver</span>
      </nav>

      {/* Hero */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏗️</span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5 font-medium">
            €{job.min}–€{job.max}/hr
          </span>
          <span className="text-xs bg-orange-50 text-orange-700 border border-orange-100 rounded-full px-2 py-0.5">
            🪪 Licence required
          </span>
          {withHousing.length > 0 && (
            <span className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
              🏠 Housing available
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Reach Truck Driver Jobs in the Netherlands
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Reach truck drivers operate electric reach trucks in high-bay warehouses — lifting
          pallets to 12 metres or more in distribution centres across the Netherlands. Pay is
          higher than standard warehouse work, but a valid reach truck licence or VCA certificate
          is required. Some agencies arrange internal licence training before placing you.
        </p>

        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600">
          <span className="text-brand-700 font-semibold">💶 Avg €{job.avg}/hr gross</span>
          <span>≈€{netMonthly}/mo net</span>
          {listings.length > 0 && (
            <span>💼 <strong>{listings.length}</strong> active listings</span>
          )}
          {withHousing.length > 0 && (
            <span className="text-green-700">🏠 <strong>{withHousing.length}</strong> with housing</span>
          )}
          {withTransport.length > 0 && (
            <span className="text-blue-700">🚌 <strong>{withTransport.length}</strong> with transport</span>
          )}
        </div>
      </div>

      {/* Salary card */}
      <div className="card p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-800 mb-4">
          💶 Reach Truck Driver Salary in the Netherlands
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
            <p className="font-semibold text-gray-700">€{WML_HOURLY_2026}/hr</p>
            <p>WML minimum 2026</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">+20–35%</p>
            <p>Night/weekend premium</p>
          </div>
        </div>
        <div className="mt-3 flex gap-4 justify-center">
          <Link href="/salary/reach-truck-driver-netherlands" className="text-xs text-brand-600 hover:underline">
            Full salary breakdown →
          </Link>
          <Link href="/tools/real-income-calculator" className="text-xs text-gray-500 hover:underline">
            Calculate take-home →
          </Link>
        </div>
      </div>

      {/* Licence note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h2 className="font-bold text-blue-900 text-sm mb-1.5">🪪 Licence requirement</h2>
        <p className="text-xs text-blue-800 leading-relaxed">
          You need a valid reach truck licence to work in this role. Most Dutch warehouses accept
          a VCA or an internal licence issued by a previous employer. Some agencies offer
          in-house licence training — ask before applying if you don&apos;t have one yet.
          Forklift (counterbalance) licences do <em>not</em> automatically cover reach trucks.
        </p>
      </div>

      {/* Active listings */}
      {listings.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title="Active Reach Truck Listings"
            subtitle={`${listings.length} current vacancies across the Netherlands`}
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
                    {l.housing === "YES" && (
                      <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 rounded-full px-1.5 py-0.5">
                        🏠 Housing incl.
                      </span>
                    )}
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
            title="Agencies Hiring Reach Truck Drivers"
            subtitle={`${agencies.length} agenc${agencies.length === 1 ? "y" : "ies"} matched to this role`}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {agencies.slice(0, 8).map((a) => (
              <AgencyCard key={a.id} agency={a} />
            ))}
          </div>
          {agencies.length > 8 && (
            <p className="text-xs text-gray-400 text-center mt-3">
              Showing 8 of {agencies.length}.{" "}
              <Link href="/agencies" className="text-brand-600 hover:underline">Browse all →</Link>
            </p>
          )}
        </section>
      )}

      {/* Cities */}
      {cities.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            📍 Reach Truck Jobs by City
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

      {/* Salary by city */}
      <section className="mb-8">
        <SectionHeader
          title="Reach Truck Salary by City"
          subtitle="Rates vary by employer, contract, and shift pattern"
        />
        <div className="grid sm:grid-cols-3 gap-2">
          {topCities.slice(0, 12).map((c) => (
            <Link
              key={c.slug}
              href={`/salary/reach-truck-driver-${c.slug}`}
              className="card px-3 py-2.5 flex items-center justify-between hover:border-brand-200 hover:bg-brand-50/30 transition-all"
            >
              <span className="text-xs font-medium text-gray-800">{c.name}</span>
              <span className="text-xs font-bold text-brand-700">€{job.avg}/hr →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-bold text-amber-900 text-sm mb-2">
            ⚠️ Before accepting a reach truck job
          </h2>
          <ul className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
            <li>→ Confirm your licence is accepted — show it before signing a contract.</li>
            <li>→ Gross pay must be at or above WML: <strong>€{WML_HOURLY_2026}/hr</strong>.</li>
            <li>→ Night and Sunday premiums must appear on your payslip, not just be promised.</li>
            <li>→ If housing is included, get the weekly deduction in writing: <strong>€80–€110/week</strong>.</li>
            <li>→ Get the contract in a language you understand before signing.</li>
          </ul>
        </div>
      </section>

      {/* Internal links */}
      <section className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">🔗 Related pages</h3>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <Link href="/jobs/reach-truck-driver" className="text-brand-600 hover:underline">
            🏗️ Reach truck driver job page →
          </Link>
          <Link href="/jobs/forklift-driver" className="text-gray-500 hover:text-brand-600 hover:underline">
            🚜 Forklift driver jobs →
          </Link>
          <Link href="/jobs/warehouse-worker" className="text-gray-500 hover:text-brand-600 hover:underline">
            🏭 Warehouse worker jobs →
          </Link>
          <Link href="/salary/reach-truck-driver-netherlands" className="text-gray-500 hover:text-brand-600 hover:underline">
            💶 Reach truck salary overview →
          </Link>
          <Link href="/jobs-with-accommodation" className="text-gray-500 hover:text-brand-600 hover:underline">
            🏠 Jobs with accommodation →
          </Link>
        </div>
      </section>

    </div>
  );
}
