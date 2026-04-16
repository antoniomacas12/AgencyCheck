import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import {
  RANDSTAD_JOBS,
  RANDSTAD_STATS,
  getTopRandstadCities,
} from "@/lib/randstadData";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Randstad Jobs in the Netherlands — AgencyCheck",
  description:
    `Browse ${RANDSTAD_STATS.total} verified Randstad vacancies across the Netherlands. ` +
    "Real jobs from randstad.nl — warehouse, logistics, production, office and more. " +
    "Compare salary, hours and education requirements before applying.",
  alternates: { canonical: "https://agencycheck.io/randstad-jobs" },
  openGraph: {
    title: "Randstad Jobs Netherlands — AgencyCheck",
    description:
      "Real job listings from Randstad Netherlands. Verified from randstad.nl — not invented, not mocked.",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RandstadJobsPage() {
  const topCities  = getTopRandstadCities(12);
  const totalJobs  = RANDSTAD_STATS.total;
  const cityCount  = RANDSTAD_STATS.cities;
  const salaryCount = RANDSTAD_STATS.withSalary;

  // Show first 50 jobs; user can visit randstad.nl for the full list
  const displayJobs = RANDSTAD_JOBS.slice(0, 50);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ───────────────────────────────────────────────── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Randstad</span>
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
            Sourced from randstad.nl
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Randstad Jobs in the Netherlands
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-3">
          Randstad is the <strong className="text-gray-800">world&apos;s largest employment agency</strong> and one of the dominant forces in the Dutch labour market. Unlike smaller specialist agencies, Randstad covers virtually every sector: warehouse and logistics, production, office administration, IT, healthcare, construction, and skilled trades. That breadth means you can find everything from a basic order picker role at WML to a logistics management position paying €25/hr on a single platform.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-3">
          For international workers targeting warehouse and production work — the most common entry point — Randstad behaves similarly to Tempo-Team or OTTO: ABU-certified contracts, standard phase A/B progression, and payslips that, according to workers, are consistently accurate. Where Randstad has an edge is <strong className="text-gray-800">upward mobility</strong>: workers with relevant experience or Dutch language skills are often offered better-paying roles that smaller agencies don&apos;t have access to.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          This page shows verified listings sourced directly from{" "}
          <a href="https://www.randstad.nl/vacatures" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">randstad.nl</a>.
          Always confirm salary and contract terms before signing. Use the payslip checker after your first week to verify deductions.
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
          title="Randstad Jobs by City"
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
          title={`Randstad Vacancies — ${totalJobs} Jobs`}
          subtitle={`Showing first ${displayJobs.length} of ${totalJobs}. Visit randstad.nl for the complete list.`}
          action={
            <a
              href="https://www.randstad.nl/vacatures"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-600 font-medium hover:underline"
            >
              All jobs on randstad.nl ↗
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
              {/* Icon placeholder */}
              <span className="text-xl shrink-0 mt-0.5">💼</span>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug">
                  {job.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">📍 {job.location}</span>
                  {job.company && (
                    <span className="text-xs text-gray-400">· {job.company}</span>
                  )}
                  {job.hours && (
                    <span className="text-xs text-gray-400">· {job.hours}</span>
                  )}
                  {job.education && (
                    <span className="text-[10px] bg-gray-100 text-gray-600 rounded px-1.5 py-0.5">
                      {job.education}
                    </span>
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
                <p className="text-[10px] text-brand-500 mt-0.5">View on Randstad ↗</p>
              </div>
            </a>
          ))}
        </div>

        {/* Load more CTA */}
        <div className="text-center mt-4">
          <a
            href="https://www.randstad.nl/vacatures"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:underline"
          >
            View all {totalJobs} jobs on randstad.nl ↗
          </a>
        </div>
      </section>

      {/* ── Salary breakdown ─────────────────────────────────────────── */}
      <section className="mb-8" id="salary">
        <h2 className="text-base font-bold text-gray-900 mb-3">What Do Workers Actually Earn at Randstad?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          For warehouse and production roles — the most common international worker placements — Randstad pays at WML or a little above: <strong className="text-gray-800">€14.71–€16.00/hr</strong> in 2026. Skilled roles (forklift, logistics coordination, driving) pay €16–€22/hr. After deductions, most warehouse workers take home <strong className="text-gray-800">€320–€390/week</strong>.
        </p>
        <div className="rounded-xl border border-gray-200 overflow-hidden mb-4">
          <div className="bg-gray-900 px-4 py-2.5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Weekly payslip — warehouse role 40h/week at WML</p>
          </div>
          <div className="divide-y divide-gray-100 text-sm">
            {([
              ["Gross pay (€14.71/hr × 40h — WML)", "+€588", "text-emerald-700"],
              ["Income tax (loonheffing ~11%)", "−€65", "text-red-600"],
              ["Agency housing (if provided)", "−€95", "text-red-600"],
              ["Health insurance", "−€35", "text-red-600"],
              ["Transport", "−€22", "text-red-600"],
              ["Admin fees (varies)", "−€25", "text-red-600"],
            ] as [string, string, string][]).map(([label, value, color]) => (
              <div key={label} className="flex justify-between px-4 py-2.5">
                <span className="text-gray-600">{label}</span>
                <span className={`font-bold tabular-nums ${color}`}>{value}</span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-3 bg-gray-50">
              <span className="font-black text-gray-900 text-sm">💶 You keep</span>
              <span className="font-black text-emerald-700 text-base tabular-nums">~€346</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Admin fees at Randstad vary from €15–€30/week depending on the contract. Workers with forklift licences or relevant experience should ask for above-WML rates — they often exist but are not offered automatically.
        </p>
      </section>

      {/* ── Housing ──────────────────────────────────────────────────── */}
      <section className="mb-8" id="housing">
        <h2 className="text-base font-bold text-gray-900 mb-3">Accommodation — Available but Not Universal</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Unlike OTTO or Covebo which include housing as standard for international placements, <strong className="text-gray-800">Randstad accommodation availability depends on the specific contract and location</strong>. Some placements include housing; many don&apos;t. Always confirm before accepting any offer.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Where Randstad does provide housing, standards are generally acceptable — comparable to industry average. Deductions run <strong className="text-gray-800">€88–€113/week</strong>. Workers report fewer extreme overcrowding issues than at some smaller agencies.
        </p>
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
          💡 If your Randstad placement doesn&apos;t include housing, check our <Link href="/agencies-with-housing" className="underline font-medium">agencies with housing list</Link> for alternatives in the same city.
        </div>
      </section>

      {/* ── Pros and Cons ────────────────────────────────────────────── */}
      <section className="mb-8" id="pros-cons">
        <h2 className="text-base font-bold text-gray-900 mb-4">Randstad Netherlands — Honest Pros and Cons</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            {
              title: "✅ What works well",
              color: "border-green-200 bg-green-50", tc: "text-green-800", sign: "+", sc: "text-green-600",
              items: [
                { t: "Reliable, accurate payslips", b: "Workers consistently report on-time, correct payments with fewer disputes than at smaller agencies." },
                { t: "Access to higher-paying roles", b: "Skilled workers (forklift, driving, logistics coordination) find better rates here than at specialist-only agencies." },
                { t: "ABU certified — strong legal protections", b: "Full ABU CAO compliance means your contract rights are enforceable and well-documented." },
                { t: "Nationwide coverage", b: "Active in every major Dutch city — useful if you want to switch location after a few months." },
              ],
            },
            {
              title: "⚠️ What to watch out for",
              color: "border-red-200 bg-red-50", tc: "text-red-800", sign: "−", sc: "text-red-500",
              items: [
                { t: "Coordinators can be overloaded", b: "Large agency = slower personal response. Problems take longer to resolve than at a smaller focused operator." },
                { t: "Housing not always included", b: "Not guaranteed with Randstad placements. Confirm explicitly before accepting any job offer." },
                { t: "Basic roles are at WML only", b: "Entry-level warehouse work pays the legal minimum. Ask specifically if above-WML positions are available." },
                { t: "Admin fees vary widely", b: "Some workers report €15/week, others €30. Always get the full deduction breakdown in writing." },
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
        <h2 className="text-base font-bold text-gray-900 mb-3">Who Should Apply to Randstad Netherlands?</h2>
        <div className="space-y-2.5">
          {[
            { icon: "✅", text: "Workers with skills or qualifications — forklift licences, VCA, driving certifications, or office/IT experience. Randstad has above-WML roles that smaller agencies don't." },
            { icon: "✅", text: "Workers who want reliability over personalised service. Randstad is predictable: pay on time, standard contracts, clear rights." },
            { icon: "✅", text: "Workers who want geographic flexibility — Randstad operates everywhere in NL, making it easy to change cities after a few months." },
            { icon: "⚠️", text: "Workers who need housing included should confirm availability before accepting. Randstad doesn't guarantee accommodation the way OTTO or Covebo do." },
            { icon: "⚠️", text: "Workers who need fast personal support may find the large-agency structure frustrating. Smaller agencies with multilingual staff sometimes offer better day-to-day coordination." },
          ].map((item) => (
            <div key={item.text} className="flex gap-2.5">
              <span className="shrink-0 text-sm">{item.icon}</span>
              <p className="leading-relaxed text-xs text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About Randstad ───────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="card p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-3">
            🏢 About Randstad Netherlands
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            Randstad is the world&apos;s largest HR services company and one of the
            biggest employment agencies in the Netherlands. They place workers in
            logistics, warehousing, production, office roles, IT, and more.
            Randstad operates nationwide with branches in virtually every major Dutch city.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <a
              href="https://www.randstad.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              randstad.nl ↗
            </a>
            <Link href="/agencies/randstad-nederland" className="text-brand-600 hover:underline">
              Randstad agency profile →
            </Link>
            <Link href="/agencies/randstad-nederland/reviews" className="text-gray-500 hover:text-brand-600 hover:underline">
              Worker reviews →
            </Link>
            <Link href="/agencies/randstad-nederland/jobs" className="text-gray-500 hover:text-brand-600 hover:underline">
              Jobs by city →
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
            { href: "/randstad-review",              label: "Randstad full worker review 2026 →" },
            { href: "/agencies/randstad-nederland",  label: "Randstad agency profile →" },
            { href: "/otto-workforce-jobs",          label: "OTTO Workforce jobs (compare) →" },
            { href: "/tempo-team-jobs",              label: "Tempo-Team jobs (compare) →" },
            { href: "/tools/real-income-calculator", label: "Calculate your real take-home →" },
            { href: "/tools/payslip-checker",        label: "Check your Randstad payslip →" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-brand-600 hover:text-brand-700 hover:underline font-medium">{link.label}</Link>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 text-center mt-6">
        Job listings sourced from randstad.nl. Availability may change — verify
        directly with Randstad before applying. Data collected for worker transparency purposes.
      </p>

    </div>
  );
}
