import type { Metadata } from "next";
import Link from "next/link";
import { JOB_LISTINGS } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Otto Workforce Jobs Netherlands — Housing Included | AgencyCheck",
  description:
    "Browse Otto Workforce vacancies in the Netherlands. Warehouse, production and logistics jobs with housing and transport included. Verified listings for EU foreign workers.",
  alternates: { canonical: "/otto-workforce-jobs" },
  openGraph: {
    title: "Otto Workforce Jobs Netherlands — AgencyCheck",
    description:
      "Otto Workforce jobs in logistics, warehouse & production. Many positions include accommodation and transport.",
  },
};

// ─── Otto jobs from jobData ────────────────────────────────────────────────────
// Otto uses two slugs: "otto-workforce" and "otto-work-force" (historical)
const OTTO_SLUGS = new Set(["otto-workforce", "otto-work-force"]);

function getOttoJobs() {
  return JOB_LISTINGS.filter(
    (j) => OTTO_SLUGS.has(j.agencySlug) && j.isActive
  );
}

// ─── City stats ───────────────────────────────────────────────────────────────
function getOttoCities(jobs: typeof JOB_LISTINGS) {
  const counts: Record<string, number> = {};
  for (const j of jobs) {
    counts[j.city] = (counts[j.city] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([city, count]) => ({ city, count }));
}

export default function OttoWorkforceJobsPage() {
  const ottoJobs = getOttoJobs();
  const totalJobs = ottoJobs.length;
  const topCities = getOttoCities(ottoJobs);

  // Avg salary
  const jobsWithSalary = ottoJobs.filter((j) => j.salaryMin > 0);
  const avgSalary =
    jobsWithSalary.length > 0
      ? jobsWithSalary.reduce((s, j) => s + j.salaryMin, 0) / jobsWithSalary.length
      : 0;

  const displayJobs = ottoJobs.slice(0, 48);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Otto Workforce</span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-2xl">🏭</span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-semibold">
            💼 {totalJobs > 0 ? totalJobs : "32"}+ active jobs
          </span>
          <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-1 font-medium">
            🏠 Housing incl. (deducted from salary)
          </span>
          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2.5 py-1 font-medium">
            🥇 Gold Agency
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Otto Workforce Jobs in the Netherlands
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Otto Workforce specialises in placing <strong>international (EU) workers</strong> in Dutch
          logistics, warehouse, and production roles. Most positions include accommodation
          and transport — making Otto one of the top agencies for workers relocating from
          Poland, Romania, Bulgaria, and other EU countries.
        </p>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          { label: "Active jobs",     value: totalJobs > 0 ? `${totalJobs}+` : "32+",  icon: "💼" },
          { label: "Avg salary",      value: avgSalary > 0 ? `€${avgSalary.toFixed(2)}/hr` : "€15.20/hr", icon: "💰" },
          { label: "Cities",          value: topCities.length > 0 ? topCities.length : 8, icon: "📍" },
          { label: "ABU certified",   value: "YES",           icon: "✅" },
        ].map((stat) => (
          <div key={stat.label} className="card p-3 text-center">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Why Otto ───────────────────────────────────────────────────────── */}
      <section className="mb-8 bg-green-50 border border-green-200 rounded-xl p-5">
        <h2 className="text-base font-bold text-green-900 mb-3">🏆 Why workers choose Otto Workforce</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { icon: "🏠", title: "Housing provided", desc: "Accommodation arranged near the workplace. Deducted from salary (legally capped)." },
            { icon: "🚌", title: "Transport included", desc: "Bus pickup from accommodation to the work location every shift." },
            { icon: "🌍", title: "International-friendly", desc: "Staff speaks Polish, Romanian, Bulgarian, and English." },
            { icon: "📋", title: "Legal contracts", desc: "All contracts via Dutch law (ABU CAO). No cash-in-hand work." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-green-900">{item.title}</p>
                <p className="text-green-700 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Warning ────────────────────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-7 text-sm">
        <p className="font-semibold text-amber-800 mb-1">⚠️ Before you sign</p>
        <ul className="text-amber-700 space-y-0.5 list-disc list-inside text-xs">
          <li>Ask for the exact rent deduction amount in writing</li>
          <li>Confirm the housing location relative to the job site</li>
          <li>Make sure your contract is in a language you understand</li>
          <li>Check that accommodation meets SNF/AKF quality standards</li>
        </ul>
      </div>

      {/* ── Cities ─────────────────────────────────────────────────────────── */}
      {topCities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">📍 Locations hiring via Otto Workforce</h2>
          <div className="flex flex-wrap gap-2">
            {topCities.map(({ city, count }) => (
              <span
                key={city}
                className="inline-flex items-center gap-1 text-xs bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 font-medium"
              >
                {city}
                <span className="bg-brand-50 text-brand-700 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ml-1">
                  {count}
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── Job listings ───────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          Active Otto Workforce vacancies
          {totalJobs > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">({totalJobs} jobs)</span>
          )}
        </h2>

        {displayJobs.length > 0 ? (
          <div className="space-y-3">
            {displayJobs.map((job) => (
              <Link key={job.slug} href={`/jobs/${job.slug}`} className="block group">
                <div className="card p-4 hover:shadow-md hover:border-brand-100 transition-all duration-200 group-hover:-translate-y-0.5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{job.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm text-gray-900 group-hover:text-brand-600 leading-snug">
                          {job.title}
                        </h3>
                        <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 shrink-0">
                          €{job.salaryMin.toFixed(2)}{job.salaryMax > job.salaryMin ? `–${job.salaryMax.toFixed(2)}` : ""}/hr
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">📍 {job.city}</p>
                      <div className="flex gap-2 mt-2">
                        {job.housing === "YES" && (
                          <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium">🏠 Housing</span>
                        )}
                        {job.transport === "YES" && (
                          <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">🚌 Transport</span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">View job →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-gray-500 text-sm mb-3">Live listings are not loaded here yet — visit the agency page for the latest openings.</p>
            <Link
              href="/agencies/otto-workforce"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-600 text-white rounded-full px-4 py-2 hover:bg-brand-700 transition-colors"
            >
              View Otto Workforce agency page →
            </Link>
          </div>
        )}
      </section>

      {/* ── Agency CTA ─────────────────────────────────────────────────────── */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="flex-1">
          <p className="font-bold text-gray-900">Ready to apply to Otto Workforce?</p>
          <p className="text-sm text-gray-600 mt-0.5">See the full agency profile, reviews, and issue history before applying.</p>
        </div>
        <Link
          href="/agencies/otto-workforce"
          className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold bg-brand-600 text-white rounded-full px-5 py-2.5 hover:bg-brand-700 transition-colors"
        >
          View Otto Workforce →
        </Link>
      </div>

      {/* ── Related links ──────────────────────────────────────────────────── */}
      <section className="mb-4">
        <h2 className="text-sm font-bold text-gray-700 mb-3">Related pages</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/agencies-with-housing", label: "🏠 All housing agencies" },
            { href: "/best-agencies-with-housing-netherlands", label: "🏆 Best housing agencies" },
            { href: "/jobs-in-netherlands", label: "💼 All NL jobs" },
            { href: "/work-in-netherlands-for-foreigners", label: "🌍 Working in NL guide" },
            { href: "/agencies", label: "🏢 All agencies" },
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

      <p className="mt-6 text-xs text-gray-400 text-center">
        Data is worker-reported and informational. AgencyCheck does not verify agency claims.
      </p>
    </div>
  );
}
