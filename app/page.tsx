import type { Metadata } from "next";
import Link from "next/link";
import SmartSearch from "@/components/SmartSearch";
import ApplyBar from "@/components/ApplyBar";
import AgencyCard from "@/components/AgencyCard";
import WorkerReviewCard from "@/components/WorkerReviewCard";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import RealSalaryBlock from "@/components/RealSalaryBlock";
import WorkerHousingStrip from "@/components/WorkerHousingStrip";
import { AGENCIES, AGENCIES_WITH_HOUSING, AGENCY_MAP } from "@/lib/agencyData";
import { TOP_CITIES } from "@/lib/seoData";
import { getLatestReviews, REVIEW_SEED_DATA } from "@/lib/reviewData";
import { JOB_TYPE_META, getJobCountForAgency } from "@/lib/jobData";
import type { SearchSuggestion } from "@/components/SmartSearch";
import { RANDSTAD_STATS } from "@/lib/randstadData";
import { TEMPO_TEAM_STATS } from "@/lib/tempoTeamData";

export const metadata: Metadata = {
  title: "AgencyCheck — See Your REAL Salary After Housing & Costs — Netherlands",
  description:
    "Most agency jobs pay €14–€17/hr but workers keep far less after housing, insurance and transport. See real take-home pay, real housing conditions and worker reviews before you sign.",
  alternates: {
    canonical: "https://agencycheck.nl/",
    languages: {
      "en":        "https://agencycheck.nl/",
      "pl":        "https://agencycheck.nl/pl",
      "ro":        "https://agencycheck.nl/ro",
      "x-default": "https://agencycheck.nl/",
    },
  },
  openGraph: {
    title: "AgencyCheck — See What You REALLY Keep After All Costs",
    description:
      "Real salary breakdowns, real housing photos and worker reviews for 127 employment agencies in the Netherlands. Know the truth before you sign.",
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const totalAgencies  = AGENCIES.length;
  const housingCount   = AGENCIES_WITH_HOUSING.length;
  const totalReviews   = REVIEW_SEED_DATA.length;

  /* ── Top 3 housing agencies (for Section 7) ─────────────────────────── */
  const housingAgencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  /* ── SmartSearch suggestions (built server-side, passed as prop) ─────── */
  const searchSuggestions: SearchSuggestion[] = [
    ...AGENCIES.map((a) => ({
      type:     "agency" as const,
      label:    a.name,
      sublabel: a.city,
      href:     `/agencies/${a.slug}`,
    })),
    ...TOP_CITIES.map((c) => ({
      type:     "city" as const,
      label:    c.name,
      sublabel: c.region,
      href:     `/cities/${c.slug}`,
    })),
    ...Object.entries(JOB_TYPE_META).map(([slug, meta]) => ({
      type:     "job" as const,
      label:    meta.title,
      sublabel: "Job type",
      href:     `/jobs/${slug}`,
    })),
    {
      type:     "job" as const,
      label:    "Randstad Jobs",
      sublabel: `${RANDSTAD_STATS.total} real vacancies from randstad.nl`,
      href:     "/randstad-jobs",
    },
    {
      type:     "job" as const,
      label:    "Tempo-Team Jobs",
      sublabel: `${TEMPO_TEAM_STATS.total} real vacancies from tempo-team.nl`,
      href:     "/tempo-team-jobs",
    },
  ];

  /* ── Latest 3 reviews for Section 6 ──────────────────────────────────── */
  const latestReviews = getLatestReviews(3).map((r, i) => {
    const agencyName = AGENCY_MAP[r.agencySlug]?.name ?? r.agencySlug;
    return {
      review: {
        id:                    `hp-${i}`,
        reviewType:            r.reviewType,
        title:                 r.title,
        overallRating:         r.overallRating,
        salaryRating:          r.salaryRating,
        housingRating:         r.housingRating ?? null,
        managementRating:      r.managementRating,
        contractClarityRating: r.contractClarityRating,
        issueTags:             r.issueTags,
        verificationStatus:    r.verificationStatus as "VERIFIED" | "WORKER_REPORTED" | "UNKNOWN",
        comment:               r.comment,
        jobTitle:              r.jobTitle ?? null,
        city:                  r.city ?? null,
        createdAt:             r.createdAt,
      },
      agencySlug: r.agencySlug,
      agencyName,
    };
  });

  return (
    <div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          Dark gradient, big hook, 2 CTAs, search, quick-nav
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white pt-14 pb-14 px-4">
        <div className="max-w-3xl mx-auto text-center">

          {/* Independence badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 tracking-wide">
            🇳🇱 {housingCount} agencies with housing — independent, no ads
          </div>

          {/* Main headline */}
          <h1 className="text-3xl sm:text-5xl font-black leading-[1.15] mb-5 tracking-tight">
            <span className="text-green-400 block">€600 gross per week.</span>
            <span className="text-red-400 block mt-1">You keep €243.</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Agency housing, insurance and transport eat most of your pay.
            See what you <strong className="text-white">actually</strong> keep —
            and compare agencies that include fair housing before you sign.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              href="/jobs-with-accommodation"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-black px-8 py-4 rounded-xl transition-colors shadow-lg shadow-green-900/50"
            >
              🏠 Find jobs with housing
            </Link>
            <Link
              href="/tools/real-income-calculator"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-8 py-4 rounded-xl transition-colors border border-white/20"
            >
              🧮 Check my real salary
            </Link>
          </div>

          {/* Smart search */}
          <SmartSearch suggestions={searchSuggestions} size="large" placeholder="Search agencies, cities, job types…" />

          {/* Quick-nav pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { href: "/jobs-with-accommodation",           label: "🏠 Jobs with housing" },
              { href: "/agencies-with-housing",             label: "🏢 Housing agencies" },
              { href: "/reach-truck-jobs",                  label: "🚜 Forklift jobs" },
              { href: "/warehouse-jobs-with-accommodation", label: "🏭 Warehouse jobs" },
              { href: "/work-in-netherlands-for-foreigners",label: "🌍 For foreigners" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors border border-white/10"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — TRUST BAR
          4 credibility stats + live activity ticker
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-900 text-white px-4 py-8 border-y border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { value: String(totalAgencies), label: "verified agencies" },
              { value: String(housingCount),  label: "with housing" },
              { value: String(totalReviews),  label: "worker reviews" },
              { value: "0",                   label: "paid placements — ever" },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-white/5 rounded-xl py-4 px-3">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
          <LiveActivityFeed variant="ticker" maxItems={6} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — PRIMARY CONVERSION
          ApplyBar — the most visually prominent block
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-800 text-white px-4 py-12 border-b border-brand-600/50">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">
            Looking for work with accommodation in the Netherlands?
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-snug">
            Tell us what you&apos;re looking for —<br className="hidden sm:block" />
            we&apos;ll find the match.
          </h2>
          <p className="text-blue-200 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            Submit your preferences once. We match you with agencies that include
            housing and notify you when there&apos;s a real fit.
          </p>
          <ApplyBar
            context={{
              sourcePage:           "/",
              sourceType:           "general_apply",
              sourceLabel:          "Homepage — primary conversion",
              defaultAccommodation: true,
            }}
            ctaText="Find me a job with housing"
            buttonOnly
          />
          <p className="text-blue-300 text-xs mt-4">
            Free. No agency commissions. Your data is not sold.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — HOW IT WORKS
          3 steps, no fluff
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white px-4 py-14">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
              How AgencyCheck works
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Know before you go
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Search & compare",
                desc:  "Browse 127 verified agencies. Filter by housing, salary, location and worker ratings.",
              },
              {
                step: "02",
                icon: "💶",
                title: "See your real pay",
                desc:  "Our salary calculator shows exactly what you keep after housing, insurance and transport.",
              },
              {
                step: "03",
                icon: "✅",
                title: "Apply with confidence",
                desc:  "Read real worker reviews. Then apply — knowing the agency is verified and the numbers are honest.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-gray-300">{item.step}</span>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-base font-black text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — REAL SALARY PROOF
          RealSalaryBlock + salary comparison table
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 text-white px-4 py-14">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-green-400 mb-2">
              Real numbers, not marketing
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Where your money actually goes
            </h2>
            <p className="text-gray-400 text-sm mt-3 max-w-lg mx-auto">
              Most agencies advertise €14–€17/hr. Here&apos;s what workers actually
              receive after all deductions — based on real payslips and worker reports.
            </p>
          </div>

          <RealSalaryBlock />

          {/* Comparison table */}
          <div className="mt-10 rounded-2xl overflow-hidden border border-white/10">
            <div className="bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">
              Typical weekly breakdown — €14/hr, 40 hrs
            </div>
            {[
              { label: "Gross pay",           amount: "€600",  color: "text-green-400" },
              { label: "Tax & social",         amount: "−€162", color: "text-red-400" },
              { label: "Agency housing",        amount: "−€95",  color: "text-red-400" },
              { label: "Health insurance",      amount: "−€35",  color: "text-red-400" },
              { label: "Transport deduction",   amount: "−€25",  color: "text-red-400" },
              { label: "Other admin fees",      amount: "−€40",  color: "text-red-400" },
              { label: "You keep",              amount: "€243",  color: "text-green-400 font-black text-lg" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center px-5 py-3 border-t border-white/5"
              >
                <span className="text-sm text-gray-300">{row.label}</span>
                <span className={`text-sm font-bold ${row.color}`}>{row.amount}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/tools/real-income-calculator"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-black px-8 py-4 rounded-xl transition-colors"
            >
              🧮 Calculate my real salary
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — HOUSING + REVIEWS
          Worker housing photos + real reviews
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 px-4 py-14">
        <div className="max-w-4xl mx-auto">

          {/* Housing strip */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
                Real housing — not brochures
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                See where you&apos;ll actually live
              </h2>
              <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
                Worker-submitted photos and descriptions of agency housing across the Netherlands.
              </p>
            </div>
            <WorkerHousingStrip />
            <div className="text-center mt-6">
              <Link
                href="/agencies-with-housing"
                className="text-brand-600 text-sm font-semibold hover:text-brand-700 underline underline-offset-2"
              >
                Browse all {housingCount} agencies with housing →
              </Link>
            </div>
          </div>

          {/* Worker reviews */}
          <div>
            <div className="text-center mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
                What workers say
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Real reviews. No filter.
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {latestReviews.map((item) => (
                <WorkerReviewCard
                  key={item.review.id}
                  review={item.review}
                  agencySlug={item.agencySlug}
                  agencyName={item.agencyName}
                />
              ))}
            </div>

            <div className="text-center mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                📋 Read all {totalReviews} reviews
              </Link>
              <Link
                href="/submit-review"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                ✍️ Submit your review
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 7 — AGENCY EXPLORATION
          Top housing agencies + browse prompt
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white px-4 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
              Agencies with housing
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Compare top employers
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
              All {housingCount} agencies that include worker accommodation — scored on
              salary transparency, housing quality and contract fairness.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {housingAgencies.map((agency) => (
              <AgencyCard
                key={agency.slug}
                agency={agency}
                jobCount={getJobCountForAgency(agency.slug)}
              />
            ))}
          </div>

          <div className="text-center flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/agencies-with-housing"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-black px-8 py-4 rounded-xl transition-colors"
            >
              🏢 Browse all {housingCount} housing agencies
            </Link>
            <Link
              href="/agencies"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              📋 All {totalAgencies} agencies
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 8 — FINAL CTA
          Strong closing push
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-brand-800 to-gray-950 text-white px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-4 leading-snug">
            Know the truth before you sign.
          </h2>
          <p className="text-blue-200 text-sm sm:text-base mb-10 max-w-md mx-auto leading-relaxed">
            {totalAgencies} agencies. {totalReviews} worker reviews. Real salary breakdowns.
            Zero paid placements. Built for workers, not recruiters.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/jobs-with-accommodation"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-black px-8 py-4 rounded-xl transition-colors shadow-lg"
            >
              🏠 Find jobs with housing
            </Link>
            <ApplyBar
              context={{
                sourcePage:           "/",
                sourceType:           "general_apply",
                sourceLabel:          "Homepage — final CTA",
                defaultAccommodation: true,
              }}
              ctaText="Get matched now"
              buttonOnly
            />
          </div>

          {/* Footer nav */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-blue-300">
            <Link href="/agencies"               className="hover:text-white transition-colors">All agencies</Link>
            <Link href="/reviews"                className="hover:text-white transition-colors">Worker reviews</Link>
            <Link href="/tools/real-income-calculator" className="hover:text-white transition-colors">Salary calculator</Link>
            <Link href="/jobs-with-accommodation" className="hover:text-white transition-colors">Jobs with housing</Link>
            <Link href="/about"                  className="hover:text-white transition-colors">About</Link>
            <Link href="/submit-review"          className="hover:text-white transition-colors">Submit a review</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
