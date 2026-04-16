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
  alternates: { canonical: "https://agencycheck.io/tempo-team-jobs" },
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

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-3">
          Tempo-Team is part of the Randstad Group and one of the top-five employment agencies in the Netherlands by number of placements. Unlike Randstad which covers a broad professional spectrum, Tempo-Team has a stronger focus on <strong className="text-gray-800">logistics, production, catering, and public sector</strong> work — making it particularly relevant for EU workers targeting hands-on, shift-based roles. Salary levels run slightly above WML at most logistics and production clients, with consistent reports of accurate and timely payslips.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-3">
          What workers note specifically about Tempo-Team is their presence in cities and regions where other major agencies are less active — particularly <strong className="text-gray-800">Almere, Lelystad, The Hague, and Haarlem</strong>. For workers who have already exhausted OTTO and Randstad options in those areas, Tempo-Team often has active openings that aren&apos;t duplicated elsewhere.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          This page shows real, verified listings sourced directly from{" "}
          <a href="https://www.tempo-team.nl/vacatures" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">tempo-team.nl</a>.
          Always confirm salary, contract type, and housing terms before signing.
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

      {/* ── Salary breakdown ─────────────────────────────────────────── */}
      <section className="mb-8" id="salary">
        <h2 className="text-base font-bold text-gray-900 mb-3">What Do Workers Earn at Tempo-Team?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Tempo-Team pays at WML or slightly above for most logistics and production placements. In 2026, base is <strong className="text-gray-800">€14.71–€15.50/hr</strong> for most entry-level roles. Experienced workers in catering supervision, forklift operation, or specialised production often earn €16–€18/hr. After deductions, most workers take home <strong className="text-gray-800">€330–€400/week net</strong>.
        </p>
        <div className="rounded-xl border border-gray-200 overflow-hidden mb-4">
          <div className="bg-gray-900 px-4 py-2.5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Weekly payslip estimate — logistics/production 40h/week</p>
          </div>
          <div className="divide-y divide-gray-100 text-sm">
            {([
              ["Gross pay (€15.00/hr × 40h)", "+€600", "text-emerald-700"],
              ["Income tax (loonheffing ~11%)", "−€66", "text-red-600"],
              ["Agency housing (if provided)", "−€95", "text-red-600"],
              ["Health insurance", "−€35", "text-red-600"],
              ["Transport", "−€22", "text-red-600"],
              ["Admin fees", "−€20", "text-red-600"],
            ] as [string, string, string][]).map(([label, value, color]) => (
              <div key={label} className="flex justify-between px-4 py-2.5">
                <span className="text-gray-600">{label}</span>
                <span className={`font-bold tabular-nums ${color}`}>{value}</span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-3 bg-gray-50">
              <span className="font-black text-gray-900 text-sm">💶 You keep</span>
              <span className="font-black text-emerald-700 text-base tabular-nums">~€362</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Catering and government-sector placements through Tempo-Team sometimes come with different shift structures and benefit packages. Ask about the specific client before accepting.
        </p>
      </section>

      {/* ── Housing ──────────────────────────────────────────────────── */}
      <section className="mb-8" id="housing">
        <h2 className="text-base font-bold text-gray-900 mb-3">Accommodation — Standard Industry Terms</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Tempo-Team provides housing for most international logistics and production placements. Deductions run <strong className="text-gray-800">€85–€113/week</strong>. Workers generally report housing standards as comparable to industry average — better than some smaller operators, roughly similar to Randstad. The most common locations are in smaller towns near the work sites rather than in city centres.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          For workers placed in catering, retail, or administration, housing is less commonly included — these roles often target workers who are already based in the Netherlands. Confirm accommodation status explicitly for any role that doesn&apos;t specify it in the listing.
        </p>
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
          💡 Tempo-Team is Randstad Group — housing and HR standards are generally consistent with what you&apos;d expect from a large, regulated Dutch agency. Complaints procedures exist and are used.
        </div>
      </section>

      {/* ── Pros and Cons ────────────────────────────────────────────── */}
      <section className="mb-8" id="pros-cons">
        <h2 className="text-base font-bold text-gray-900 mb-4">Tempo-Team Netherlands — Honest Pros and Cons</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            {
              title: "✅ What works well",
              color: "border-green-200 bg-green-50", tc: "text-green-800", sign: "+", sc: "text-green-600",
              items: [
                { t: "Above-WML pay at many sites", b: "Logistics and production clients often pay €15–€15.50/hr — the extra €0.30–€0.80/hr adds up over months." },
                { t: "Active in under-served cities", b: "Almere, Lelystad, The Hague — Tempo-Team is strong where OTTO and Randstad have fewer placements." },
                { t: "Catering and public sector options", b: "Unique among logistics agencies — also places workers in catering and municipal services for variety." },
                { t: "ABU certified, part of Randstad Group", b: "Strong compliance and well-documented contracts. Disputes are handled through established HR channels." },
              ],
            },
            {
              title: "⚠️ What to watch out for",
              color: "border-red-200 bg-red-50", tc: "text-red-800", sign: "−", sc: "text-red-500",
              items: [
                { t: "Housing availability varies by role", b: "Catering and office roles often don't include housing. Don't assume it's included — confirm explicitly." },
                { t: "Large-agency coordinator issues", b: "Like Randstad, coordinator responsiveness varies. High caseloads can mean slower responses." },
                { t: "Fewer multilingual resources than OTTO", b: "Less Polish/Romanian/Bulgarian support than specialist international agencies. More Dutch expected." },
                { t: "Fewer specialist logistics bonuses", b: "OTTO and Covebo sometimes negotiate better client-specific bonuses. Tempo-Team tends to offer standard terms." },
              ],
            },
          ] as const).map((card) => (
            <div key={card.title} className={`rounded-xl border p-4 ${card.color}`}>
              <p className={`text-sm font-bold mb-3 ${card.tc}`}>{card.title}</p>
              <ul className="space-y-2.5">
                {card.items.map((item) => (
                  <li key={item.t} className="flex gap-2">
                    <span className={`shrink-0 font-bold text-sm mt-0.5 ${card.sc}`}>{card.sign}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.t}</p>
                      <p className="text-xs text-gray-600 leading-snug mt-0.5">{item.b}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who is this good for ─────────────────────────────────────── */}
      <section className="mb-8 rounded-xl bg-gray-50 border border-gray-200 p-5">
        <h2 className="text-base font-bold text-gray-900 mb-3">Who Should Apply to Tempo-Team Netherlands?</h2>
        <div className="space-y-2.5">
          {[
            { icon: "✅", text: "Workers targeting Almere, Lelystad, or The Hague — Tempo-Team's coverage in these cities exceeds OTTO and Randstad." },
            { icon: "✅", text: "Workers interested in catering or public sector work alongside logistics — Tempo-Team is one of the few major agencies that places workers across these sectors." },
            { icon: "✅", text: "Workers already in the Netherlands who don't need international housing support — Tempo-Team's administrative roles often suit workers with basic Dutch." },
            { icon: "✅", text: "Workers who want above-WML pay at standard logistics sites without needing a specialist forklift licence." },
            { icon: "⚠️", text: "Workers who need a full relocation package (housing + transport + multilingual onboarding) will find OTTO Workforce more suited to that need." },
          ].map((item) => (
            <div key={item.text} className="flex gap-2.5">
              <span className="shrink-0 text-sm">{item.icon}</span>
              <p className="leading-relaxed text-xs text-gray-600">{item.text}</p>
            </div>
          ))}
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
      <section className="mb-6 rounded-xl bg-gray-50 border border-gray-200 p-5">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Related reads</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { href: "/tempo-team-review",            label: "Tempo-Team full worker review 2026 →" },
            { href: "/otto-vs-tempo-team",           label: "OTTO vs Tempo-Team comparison →" },
            { href: "/randstad-jobs",                label: "Randstad jobs (compare) →" },
            { href: "/otto-workforce-jobs",          label: "OTTO Workforce jobs (compare) →" },
            { href: "/tools/real-income-calculator", label: "Calculate your real take-home →" },
            { href: "/tools/payslip-checker",        label: "Check your Tempo-Team payslip →" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-brand-600 hover:text-brand-700 hover:underline font-medium">{link.label}</Link>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 text-center mt-6">
        Job listings sourced from tempo-team.nl. Availability may change — verify
        directly with Tempo-Team before applying. Data collected for worker transparency purposes.
      </p>

    </div>
  );
}
