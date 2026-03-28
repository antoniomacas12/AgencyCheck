import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import {
  TEMPO_TEAM_JOBS,
  TEMPO_TEAM_STATS,
  getTopTempoTeamCities,
} from "@/lib/tempoTeamData";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Tempo-Team Jobs in the Netherlands — AgencyCheck",
  description:
    `Browse ${TEMPO_TEAM_STATS.total} verified Tempo-Team vacancies across the Netherlands. ` +
    "Real jobs from tempo-team.nl — logistics, production, administration, catering and more. " +
    "Compare salary and hours before applying.",
  alternates: { canonical: "/tempo-team-jobs" },
  openGraph: {
    title: "Tempo-Team Jobs Netherlands — AgencyCheck",
    description:
      "Real job listings from Tempo-Team Netherlands. Verified from tempo-team.nl — not invented, not mocked.",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TempoTeamJobsPage() {
  const topCities   = getTopTempoTeamCities(12);
  const totalJobs   = TEMPO_TEAM_STATS.total;
  const cityCount   = TEMPO_TEAM_STATS.cities;
  const salaryCount = TEMPO_TEAM_STATS.withSalary;

  // Show first 50 jobs; user can visit tempo-team.nl for the full list
  const displayJobs = TEMPO_TEAM_JOBS.slice(0, 50);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ───────────────────────────────────────────────── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Tempo-Team</span>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-2xl">💼</span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5 font-medium">
            {totalJobs} vacancies
          </span>
          <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-2 py-0.5">
            {cityCount} cities
          </span>
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5">
            Sourced from tempo-team.nl
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Tempo-Team Jobs in the Netherlands
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Tempo-Team is one of the largest employment agencies in the Netherlands
          with vacancies across logistics, production, catering, administration, and more.
          This page shows real, verified listings scraped directly from{" "}
          <a
            href="https://www.tempo-team.nl/vacatures"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            tempo-team.nl
          </a>
          . Always confirm salary and contract terms before signing.
        </p>

        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-600">
          <span className="text-brand-700 font-semibold">
            💼 {totalJobs} active listings
          </span>
          <span>📍 {cityCount} cities</span>
          <span>💶 {salaryCount} with salary info</span>
        </div>
      </div>

      {/* ── Worker notice ────────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-xs text-amber-800 leading-relaxed">
        <strong>⚠️ Before applying:</strong> Check that salary is at or above the WML minimum of{" "}
        <strong>€14.71/hr</strong> (2026). For jobs listing a monthly rate, verify
        the hourly equivalent. Always ask for the contract in a language you understand.{" "}
        <Link href="/tools/real-income-calculator" className="underline">
          Calculate your real take-home →
        </Link>
      </div>

      {/* ── Top cities ───────────────────────────────────────────────── */}
      <section className="mb-8">
        <SectionHeader
          title="Tempo-Team Jobs by City"
          subtitle={`Top cities by number of vacancies (${cityCount} cities total)`}
        />
        <div className="flex flex-wrap gap-2">
          {topCities.map(({ city, count }) => (
            <span
              key={city}
              className="text-xs text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-3 py-1 font-medium"
            >
              📍 {city} ({count})
            </span>
          ))}
        </div>
      </section>

      {/* ── Job listings ─────────────────────────────────────────────── */}
      <section className="mb-8">
        <SectionHeader
          title={`Tempo-Team Vacancies — ${totalJobs} Jobs`}
          subtitle={`Showing first ${displayJobs.length} of ${totalJobs}. Visit tempo-team.nl for the complete list.`}
          action={
            <a
              href="https://www.tempo-team.nl/vacatures"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-600 font-medium hover:underline"
            >
              All jobs on tempo-team.nl ↗
            </a>
          }
        />

        <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {displayJobs.map((job) => (
            <a
              key={job.id}
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 px-4 py-3 bg-white hover:bg-brand-50 transition-colors"
            >
              {/* Icon */}
              <span className="text-xl shrink-0 mt-0.5">💼</span>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug">
                  {job.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">📍 {job.location}</span>
                  {job.hours && (
                    <span className="text-xs text-gray-400">· {job.hours}</span>
                  )}
                </div>
              </div>

              {/* Salary */}
              <div className="shrink-0 text-right">
                {job.salary ? (
                  <p className="text-sm font-bold text-brand-700 whitespace-nowrap">
                    {job.salary}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">salary n/a</p>
                )}
                <p className="text-[10px] text-brand-500 mt-0.5">View on Tempo-Team ↗</p>
              </div>
            </a>
          ))}
        </div>

        {/* Load more CTA */}
        <div className="text-center mt-4">
          <a
            href="https://www.tempo-team.nl/vacatures"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:underline"
          >
            View all {totalJobs} jobs on tempo-team.nl ↗
          </a>
        </div>
      </section>

      {/* ── About Tempo-Team ─────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="card p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-3">
            🏢 About Tempo-Team Netherlands
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            Tempo-Team is one of the largest employment agencies in the Netherlands,
            part of the Randstad Group. They place workers in logistics, production,
            catering, administration, government, and technical roles.
            Tempo-Team operates nationwide with branches in virtually every major Dutch city.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <a
              href="https://www.tempo-team.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              tempo-team.nl ↗
            </a>
            <Link href="/agencies/tempo-team-amsterdam-uitzendbureau" className="text-brand-600 hover:underline">
              Tempo-Team agency profile →
            </Link>
            <Link href="/agencies-with-housing" className="text-gray-500 hover:text-brand-600 hover:underline">
              Agencies with housing →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Worker rights ────────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <h2 className="font-bold text-gray-800 text-sm mb-2">
            🛡️ Know your rights before starting
          </h2>
          <ul className="text-xs text-gray-600 space-y-1.5 leading-relaxed">
            <li>→ Minimum wage 2026 is <strong>€14.71/hr</strong> gross. Your payslip must show at least this.</li>
            <li>→ Night and Sunday shifts must carry a premium (usually +20–50%). Check your contract.</li>
            <li>→ If housing is offered, the weekly deduction must be in writing. Typical: €80–110/week.</li>
            <li>→ Phase A/B contracts: after week 78 you gain more protections. Ask which phase you start in.</li>
            <li>→ You have the right to a payslip every pay period. Use our{" "}
              <Link href="/tools/payslip-checker" className="text-brand-600 hover:underline">payslip checker</Link>.
            </li>
          </ul>
        </div>
      </section>

      {/* ── Related links ────────────────────────────────────────────── */}
      <section className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">🔗 Related pages</h3>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <Link href="/randstad-jobs" className="text-brand-600 hover:underline">
            💼 Randstad Jobs →
          </Link>
          <Link href="/agencies-with-housing" className="text-brand-600 hover:underline">
            🏠 Agencies with housing →
          </Link>
          <Link href="/jobs-with-accommodation" className="text-gray-500 hover:text-brand-600 hover:underline">
            🏠 Jobs with accommodation →
          </Link>
          <Link href="/tools/real-income-calculator" className="text-gray-500 hover:text-brand-600 hover:underline">
            🧮 Real income calculator →
          </Link>
          <Link href="/issues/late-payment" className="text-gray-500 hover:text-brand-600 hover:underline">
            ⚠️ Know your rights →
          </Link>
        </div>
      </section>

      <p className="text-xs text-gray-400 text-center mt-6">
        Job listings sourced from tempo-team.nl. Availability may change — verify
        directly with Tempo-Team before applying. Data collected for worker transparency purposes.
      </p>

    </div>
  );
}
