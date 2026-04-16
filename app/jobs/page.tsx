import type { Metadata } from "next";
import Link from "next/link";
import { JOB_SALARY_DATA } from "@/lib/seoData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";
import { RANDSTAD_STATS } from "@/lib/randstadData";
import { TEMPO_TEAM_STATS } from "@/lib/tempoTeamData";
import { HOUSING_AGENCIES, ALL_AGENCIES } from "@/lib/agencyEnriched";
import { REVIEW_SEED_DATA } from "@/lib/reviewData";

export const metadata: Metadata = {
  title:       "Agency Jobs in the Netherlands — Salary, Housing & Worker Reviews — AgencyCheck",
  description: "Find agency jobs in the Netherlands with real salary and housing data. Warehouse, forklift, production jobs — real take-home pay, accommodation options, and worker experiences. 2026 figures.",
  alternates:  { canonical: "https://agencycheck.io/jobs" },
};

export default function JobsIndexPage() {
  const jobs          = Object.entries(JOB_SALARY_DATA);
  const netMonthly    = (avg: number) => Math.round(avg * 173 * 0.63 - 140);
  const housingCount  = HOUSING_AGENCIES.length;
  const totalAgencies = ALL_AGENCIES.length;
  const totalReviews  = REVIEW_SEED_DATA.length;
  const weeklyGross   = Math.round(WML_HOURLY_2026 * 40);
  const weeklyNet     = 345;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Jobs</span>
      </nav>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-1 font-medium">
            🇳🇱 Netherlands · 2026
          </span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            {jobs.length} job types
          </span>
          <span className="text-xs bg-gray-50 text-gray-600 border border-gray-100 rounded-full px-2.5 py-1 font-medium">
            {totalReviews} worker reviews
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Agency Jobs in the Netherlands — Salary, Housing &amp; Worker Experiences
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Every agency job listing in the Netherlands shows a gross hourly rate. This page shows what workers
          actually take home — after Dutch income tax, housing deductions, and transport costs — for each job type.
          All salary data is based on 2026 Dutch minimum wage law and real worker reviews.
        </p>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3 max-w-md">
          ⚠️ WML minimum 2026: <strong>€{WML_HOURLY_2026}/hr</strong>. Your gross pay must be at or above this regardless of nationality or contract type.
        </p>
      </div>

      {/* ── SEO intro text ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8 space-y-4 text-sm text-gray-600 leading-relaxed">
        <h2 className="text-base font-bold text-gray-900">What you actually earn working agency jobs in the Netherlands</h2>

        <p>
          The Netherlands has one of the highest concentrations of employment agencies in Europe, with over{" "}
          <strong>{totalAgencies} agencies</strong> operating across logistics, production, food processing, and
          greenhouse sectors. The majority of foreign workers arrive via these agencies, which arrange not just the
          job but often housing and transport too. Understanding the full cost structure before you arrive is the
          difference between saving money and spending everything you earn on accommodation and travel.
        </p>

        <p>
          <strong>Salary Netherlands workers actually receive:</strong> At the 2026 statutory minimum wage of €{WML_HOURLY_2026}/hr,
          a standard 40-hour week produces <strong>€{weeklyGross} gross</strong>. After Dutch income tax (loonheffing),
          the ZVW healthcare levy, and social contributions — all calculated with your statutory tax credits applied —
          you take home approximately <strong>€{weeklyNet}/week net</strong>. That is without any housing or transport
          deduction. With agency housing at €100/week, take-home drops to €{weeklyNet - 100}/week. One worker reviewed
          on AgencyCheck reported it precisely: "After paying €120 for accommodation, €36 for insurance, and €25 for
          transport, I end up with around €340 net per week." This is the reality of working through agencies in the
          Netherlands on minimum wage — which is why knowing the exact deduction structure before signing matters.
        </p>

        <p>
          <strong>Agency jobs Netherlands with housing:</strong> Of the {totalAgencies} agencies listed on AgencyCheck,{" "}
          <strong>{housingCount} offer accommodation</strong> as part of their employment package. Agency housing
          operates under the SNF (Stichting Normering Flexwonen) certification scheme, which sets the maximum housing
          deduction at <strong>€113.50/week</strong> for 2026. Not all agency housing is SNF certified — uncertified
          housing has no statutory deduction cap, though charging above actual cost is still illegal under Dutch law
          (BW art. 7:631). When evaluating a "jobs Netherlands housing" offer, always ask three things: is the housing
          SNF certified, what is the exact weekly cost, and how many people share the room.
        </p>

        <p>
          <strong>Earnings above minimum wage:</strong> The job types with the highest actual take-home pay are
          forklift and reach truck drivers (certification required), machine setters, and night-shift production
          workers. Forklift drivers average €16/hr — translating to approximately €369/week net without housing.
          Reach truck drivers average €17/hr (≈€392/week net). Workers doing consistent night shifts (00:00–06:00)
          earn a minimum 22% premium on top of base rate under the ABU collective agreement — at WML that is €17.95/hr,
          or approximately €718/week gross. This is where real savings become possible in the Netherlands.
        </p>

        <p>
          <strong>What worker reviews say:</strong> Based on {totalReviews} reviews on AgencyCheck, the most
          commonly reported problems are payslip errors (missing overtime, no shift premium line items) and housing
          conditions. The most commonly praised experiences involve agencies that provided free transport, correct
          payslips from the first week, and housing that matched what was contracted. Use the job pages below to see
          which agencies are active in each sector and what workers report about their experiences there.
        </p>

        <div className="flex flex-wrap gap-3 pt-2 text-xs">
          <Link href="/guides/real-salary-netherlands" className="text-brand-600 hover:underline">→ Real salary guide (all job types)</Link>
          <Link href="/guides/hidden-costs-netherlands" className="text-brand-600 hover:underline">→ Hidden costs explained</Link>
          <Link href="/agencies-with-housing" className="text-brand-600 hover:underline">→ Agencies with housing</Link>
          <Link href="/tools/real-income-calculator" className="text-brand-600 hover:underline">→ Calculate your take-home</Link>
        </div>
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
