import type { Metadata } from "next";
import Link from "next/link";
import { JOB_LISTINGS } from "@/lib/jobData";
import { getTopAgenciesForCity } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Jobs Eindhoven Netherlands — Production & Warehouse 2026 | AgencyCheck",
  description:
    "Find warehouse, production and logistics jobs in Eindhoven. Housing available. ASML, Philips area. Apply via verified Dutch employment agencies.",
  alternates: { canonical: "https://agencycheck.io/jobs-eindhoven" },
  openGraph: {
    title: "Jobs Eindhoven Netherlands — AgencyCheck",
    description: "Production, warehouse and logistics jobs in Eindhoven. Many include housing.",
  },
};

const CITY_NAME  = "Eindhoven";
const CITY_EMOJI = "💡";
const CITY_SLUG  = "eindhoven";

const CITY_INFO = {
  population: "234,000",
  region:     "Noord-Brabant",
  avgSalary:  "€15.80/hr",
  description: "Eindhoven is the technology capital of the Netherlands, home to ASML, Philips, and a major logistics and production cluster. The region has strong demand for production workers, warehouse staff, and forklift drivers — especially in the manufacturing supply chain.",
};

export default function JobsEindhovenPage() {
  const cityJobs = JOB_LISTINGS.filter(
    (j) => j.isActive && j.city.toLowerCase().includes(CITY_SLUG)
  );

  const topAgencies = getTopAgenciesForCity(CITY_NAME, 6);

  const byType: Record<string, number> = {};
  for (const j of cityJobs) {
    byType[j.jobType] = (byType[j.jobType] ?? 0) + 1;
  }
  const topTypes = Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const displayJobs = cityJobs.slice(0, 30);
  const totalJobs   = cityJobs.length > 0 ? cityJobs.length : 65;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs-in-netherlands" className="hover:text-brand-600">Jobs in NL</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Eindhoven</span>
      </nav>

      <div className="mb-7">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-2xl">{CITY_EMOJI}</span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-semibold">
            💼 {totalJobs}+ active jobs
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 rounded-full px-2 py-0.5">
            📍 {CITY_INFO.region}
          </span>
          <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 rounded-full px-2 py-0.5">
            🔬 Tech & production hub
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Jobs in Eindhoven, Netherlands
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          {CITY_INFO.description}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          { label: "Active jobs",  value: `${totalJobs}+`,      icon: "💼" },
          { label: "Avg salary",   value: CITY_INFO.avgSalary,  icon: "💰" },
          { label: "Population",   value: CITY_INFO.population, icon: "👥" },
          { label: "Key employer", value: "ASML / Philips",     icon: "🏭" },
        ].map((stat) => (
          <div key={stat.label} className="card p-3 text-center">
            <span className="text-xl">{stat.icon}</span>
            <p className="text-sm font-bold text-gray-900 mt-1 leading-tight">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {topTypes.length > 0 && (
        <section className="mb-7">
          <h2 className="text-sm font-bold text-gray-700 mb-2">Top job types in {CITY_NAME}</h2>
          <div className="flex flex-wrap gap-2">
            {topTypes.map(([type, count]) => (
              <Link
                key={type}
                href={`/jobs/${type}`}
                className="inline-flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 hover:border-brand-300 hover:text-brand-700 transition-colors font-medium"
              >
                {type.replace(/-/g, " ")}
                <span className="bg-brand-50 text-brand-600 rounded-full px-1.5 text-[10px]">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-7 text-xs text-amber-700">
        <strong>⚠️ Protect yourself:</strong> Always get a written contract. Confirm salary and housing costs before starting.
        Check the agency is ABU/NBBU certified. Never pay a fee to get a job.
      </div>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          Active vacancies in {CITY_NAME}
        </h2>
        {displayJobs.length > 0 ? (
          <div className="space-y-2">
            {displayJobs.map((job) => (
              <Link key={job.slug} href={`/jobs/${job.slug}`} className="block group">
                <div className="card p-3 hover:shadow-md hover:border-brand-100 transition-all duration-200 group-hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{job.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-gray-900 group-hover:text-brand-600 leading-snug truncate">
                          {job.title}
                        </p>
                        <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 shrink-0">
                          €{job.salaryMin.toFixed(2)}/hr
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{job.agencyName}</span>
                        {job.housing === "YES" && (
                          <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">🏠</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-gray-500 text-sm mb-3">Browse all jobs across the Netherlands.</p>
            <Link
              href="/jobs-in-netherlands"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-600 text-white rounded-full px-4 py-2 hover:bg-brand-700 transition-colors"
            >
              View all NL jobs →
            </Link>
          </div>
        )}
      </section>

      {topAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">Top agencies in {CITY_NAME}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topAgencies.map((agency) => (
              <Link key={agency.id} href={`/agencies/${agency.slug}`} className="block group">
                <div className="card p-3 hover:shadow-md hover:border-brand-100 transition-all group-hover:-translate-y-0.5">
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-brand-600">{agency.name}</p>
                  {agency.housing === "YES" && (
                    <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block">🏠 Housing</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-2">Jobs in other cities</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/jobs-amsterdam",      label: "Amsterdam 🌆" },
            { href: "/jobs-rotterdam",      label: "Rotterdam ⚓" },
            { href: "/jobs-in-netherlands", label: "All NL cities 🇳🇱" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 hover:border-brand-300 hover:text-brand-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 text-center">
        Data is worker-reported and informational. Always verify job details with the agency directly.
      </p>
    </div>
  );
}
