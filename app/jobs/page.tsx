import type { Metadata } from "next";
import Link from "next/link";
import { JOB_SALARY_DATA } from "@/lib/seoData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";
import { RANDSTAD_STATS } from "@/lib/randstadData";
import { TEMPO_TEAM_STATS } from "@/lib/tempoTeamData";

export const metadata: Metadata = {
  title:       "Agency Jobs in the Netherlands — Salary & Housing — AgencyCheck",
  description: "Browse all agency job types in the Netherlands. Find order picker, forklift driver, warehouse, production, and more jobs with salary, housing, and transport data.",
  alternates:  { canonical: "/jobs" },
};

export default function JobsIndexPage() {
  const jobs = Object.entries(JOB_SALARY_DATA);
  const netMonthly = (avg: number) => Math.round(avg * 173 * 0.63 - 140);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Jobs</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Agency Jobs in the Netherlands
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Browse all job types placed by employment agencies across the Netherlands.
          Each page shows salary data, agencies hiring, housing options, and worker tips.
        </p>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3 max-w-md">
          ⚠️ WML minimum 2026: <strong>€{WML_HOURLY_2026}/hr</strong>. Your gross pay must be at or above this.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {jobs.map(([slug, job]) => (
          <Link
            key={slug}
            href={`/jobs/${slug}`}
            className="card p-4 hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{job.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">{job.title}</p>
                <p className="text-xs font-bold text-brand-700">€{job.avg}/hr avg</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{job.description}</p>
            <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-auto pt-1 border-t border-gray-50">
              <span>Range: €{job.min}–€{job.max}/hr</span>
              <span>≈€{netMonthly(job.avg)}/mo net</span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Real job listings from agencies ── */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-700 mb-3">🔎 Real Job Listings from Major Agencies</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/randstad-jobs"
            className="card p-4 hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5 flex items-center gap-3"
          >
            <span className="text-3xl shrink-0">💼</span>
            <div>
              <p className="text-sm font-bold text-gray-900">Randstad Jobs</p>
              <p className="text-xs text-brand-700 font-semibold">{RANDSTAD_STATS.total} vacancies · {RANDSTAD_STATS.cities} cities</p>
              <p className="text-xs text-gray-400 mt-0.5">Real jobs from randstad.nl · Updated regularly</p>
            </div>
          </Link>
          <Link
            href="/tempo-team-jobs"
            className="card p-4 hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5 flex items-center gap-3"
          >
            <span className="text-3xl shrink-0">💼</span>
            <div>
              <p className="text-sm font-bold text-gray-900">Tempo-Team Jobs</p>
              <p className="text-xs text-brand-700 font-semibold">{TEMPO_TEAM_STATS.total} vacancies · {TEMPO_TEAM_STATS.cities} cities</p>
              <p className="text-xs text-gray-400 mt-0.5">Real jobs from tempo-team.nl · Updated regularly</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Salary calculator CTA ── */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4">
        <div>
          <p className="font-bold text-brand-800">🧮 Calculate your real take-home pay</p>
          <p className="text-xs text-brand-600 mt-1 leading-relaxed max-w-md">
            Gross hourly rate is not what you take home. Dutch tax, healthcare levy (ZVW),
            housing deductions, and transport costs all reduce your actual income.
          </p>
        </div>
        <Link href="/tools/real-income-calculator"
          className="shrink-0 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
          Calculate →
        </Link>
      </div>
    </div>
  );
}
