import type { Metadata } from "next";
import Link from "next/link";
import nDynamic from "next/dynamic";
import SmartSearch from "@/components/SmartSearch";
import ApplyBar from "@/components/ApplyBar";
import AgencyCard from "@/components/AgencyCard";
import WorkerReviewCard from "@/components/WorkerReviewCard";
import RealSalaryBlock from "@/components/RealSalaryBlock";
import WorkerHousingStrip from "@/components/WorkerHousingStrip";
import { AGENCIES, AGENCIES_WITH_HOUSING, AGENCY_MAP } from "@/lib/agencyData";
import { TOP_CITIES } from "@/lib/seoData";
import { getLatestReviews, REVIEW_SEED_DATA } from "@/lib/reviewData";
import { JOB_TYPE_META, getJobCountForAgency } from "@/lib/jobData";
import type { SearchSuggestion } from "@/components/SmartSearch";
import { RANDSTAD_STATS } from "@/lib/randstadData";
import { TEMPO_TEAM_STATS } from "@/lib/tempoTeamData";

// LiveActivityFeed is a pure client-side ticker — it has no SEO value and
// its animation state can differ between server and client render.
// ssr:false prevents any hydration mismatch from the animated ticker.
const LiveActivityFeed = nDynamic(() => import("@/components/LiveActivityFeed"), { ssr: false });

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
      "Real salary breakdowns, real housing photos and worker reviews for 150+ employment agencies in the Netherlands. Know the truth before you sign.",
  },
};

export const dynamic = "force-dynamic";

// ─── Salary breakdown rows ───────────────────────────────────────────────────
const SALARY_ROWS = [
  { label: "Gross pay",          amount: "+€600", highlight: false, green: true  },
  { label: "Tax & social",       amount: "−€162", highlight: false, green: false },
  { label: "Agency housing",     amount: "−€95",  highlight: false, green: false },
  { label: "Health insurance",   amount: "−€35",  highlight: false, green: false },
  { label: "Transport",          amount: "−€25",  highlight: false, green: false },
  { label: "Admin fees",         amount: "−€40",  highlight: false, green: false },
  { label: "You keep",           amount: "€243",  highlight: true,  green: true  },
] as const;

// ─── Quick nav links — kept to 3 most relevant, below search ─────────────────
const QUICK_LINKS = [
  { href: "/agencies-with-housing",              label: "🏢 Agencies with housing" },
  { href: "/tools/real-income-calculator",       label: "🧮 Salary calculator"     },
  { href: "/work-in-netherlands-for-foreigners", label: "🌍 For foreigners"        },
];

export default async function HomePage() {
  const totalAgencies = AGENCIES.length;
  const housingCount  = AGENCIES_WITH_HOUSING.length;
  const totalReviews  = REVIEW_SEED_DATA.length;

  const housingAgencies = AGENCIES_WITH_HOUSING.slice(0, 3);

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
    <div className="min-h-screen bg-white">

      {/* ════════════════════════════════════════════════════════════
          §1  HERO
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="max-w-3xl mx-auto text-center">

            {/* Independence badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide mb-8">
              🇳🇱 Independent · No ads · 100% worker-first
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight mb-6">
              You think you earn{" "}
              <span className="text-green-400 whitespace-nowrap">€600/week.</span>
              <br />
              You actually keep{" "}
              <span className="text-red-400 whitespace-nowrap">€243.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Agency housing, health insurance, transport and admin fees eat your pay
              before you touch it. See the{" "}
              <strong className="text-white font-semibold">real breakdown</strong> and
              compare agencies that are actually honest about costs.
            </p>

            {/* CTA — single primary action above the fold */}
            <div className="flex flex-col items-center gap-3 justify-center mb-10">
              <Link
                href="/jobs-with-accommodation"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-10 py-4 text-base font-black text-white shadow-lg shadow-green-900/40 transition-colors hover:bg-green-400"
              >
                🏠 Find jobs with housing
              </Link>
              {/* Secondary — text-weight link so it doesn't compete with primary */}
              <Link
                href="/tools/real-income-calculator"
                className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-2"
              >
                🧮 See my real salary after costs →
              </Link>
            </div>

            {/* Trust bullets */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-gray-400 mb-12">
              <span className="flex items-center gap-1.5">
                <span className="text-green-400 font-bold">✓</span>
                {totalAgencies} verified agencies
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-green-400 font-bold">✓</span>
                Real worker reviews
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-green-400 font-bold">✓</span>
                Zero paid placements
              </span>
            </div>

            {/* Search */}
            <div className="mb-8">
              <SmartSearch
                suggestions={searchSuggestions}
                size="large"
                placeholder="Search agencies, cities or job types…"
              />
            </div>

            {/* Quick-nav pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §2  TRUST STRIP
          ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-gray-800 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-6">
            {[
              { value: String(totalAgencies), label: "verified agencies"      },
              { value: String(housingCount),  label: "include housing"        },
              { value: String(totalReviews),  label: "worker reviews"         },
              { value: "€0",                  label: "paid placements — ever" },
            ].map((s) => (
              <div key={s.label} className="text-center rounded-xl bg-white/5 px-4 py-4">
                <div className="text-3xl font-black text-white leading-none">{s.value}</div>
                <div className="mt-1 text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Live ticker */}
          <LiveActivityFeed variant="ticker" maxItems={6} />

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §3  LEAD CAPTURE
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">

            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-200">
              Looking for work with housing in the Netherlands?
            </p>
            <h2 className="mb-4 text-3xl sm:text-4xl font-black leading-tight">
              Tell us what you need —<br className="hidden sm:block" />
              we&apos;ll find the match.
            </h2>
            <p className="mb-8 text-blue-100 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Submit once. We match you with agencies that include accommodation and
              contact you when there&apos;s a real fit. Free. No agency commissions.
            </p>

            <div className="rounded-2xl bg-white/10 border border-white/20 p-6 sm:p-8">
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
              <p className="mt-4 text-xs text-blue-200">
                Free · No commissions · Your data is never sold
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §4  HOW IT WORKS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

          <div className="text-center mb-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              How AgencyCheck works
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              Know before you go
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "01", icon: "🔍", title: "Search & compare",    body: "Browse 150+ verified agencies. Filter by housing, salary, city and worker ratings. See who actually has decent conditions." },
              { step: "02", icon: "💶", title: "See your real pay",    body: "Our salary calculator shows exactly what you keep after housing, insurance, transport and all deductions. No more surprises." },
              { step: "03", icon: "✅", title: "Apply with confidence", body: "Read real worker reviews. Get matched through our free service. Sign knowing the numbers are honest and the agency is verified." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-4 rounded-2xl border-2 border-gray-100 bg-gray-50 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-gray-200">{item.step}</span>
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-lg font-black text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §5  REAL SALARY
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

          <div className="text-center mb-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-green-400">
              Real numbers — not marketing
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Where your money actually goes
            </h2>
            <p className="mt-4 text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Most agencies advertise €14–€17/hr. Here&apos;s what workers actually
              receive after all deductions — based on real payslips and worker reports.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <RealSalaryBlock />
            </div>
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-white/5 px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Weekly breakdown — €14/hr · 40 hrs/week
                </p>
              </div>
              <div className="divide-y divide-white/5">
                {SALARY_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between px-6 py-4 ${row.highlight ? "bg-white/5" : ""}`}
                  >
                    <span className={`text-sm ${row.highlight ? "font-black text-white text-base" : "text-gray-300"}`}>
                      {row.label}
                    </span>
                    <span className={`font-bold ${row.highlight ? "text-green-400 text-xl font-black" : row.green ? "text-green-400" : "text-red-400"}`}>
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            {/* Secondary action — ghost style so it doesn't compete with the primary hero CTA */}
            <Link
              href="/tools/real-income-calculator"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              🧮 Open full salary calculator →
            </Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §6  HOUSING + REVIEWS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

          <div className="mb-16">
            <div className="text-center mb-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">Real housing — not brochures</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900">See where you&apos;ll actually live</h2>
              <p className="mt-4 text-gray-500 text-sm sm:text-base max-w-md mx-auto">
                Worker-submitted photos and descriptions from agencies across the Netherlands. No stock images.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
              <WorkerHousingStrip />
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/agencies-with-housing"
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
              >
                Browse all {housingCount} agencies with housing →
              </Link>
            </div>
          </div>

          <div>
            <div className="text-center mb-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">What workers actually say</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Real reviews. No filter.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {latestReviews.map((item) => (
                <div key={item.review.id} className="flex flex-col gap-2">
                  <Link
                    href={`/agencies/${item.agencySlug}`}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span className="truncate">{item.agencyName}</span>
                    <span>→</span>
                  </Link>
                  <WorkerReviewCard review={item.review} />
                </div>
              ))}
            </div>
            {/* Single CTA — "submit review" demoted to text link; one button per section */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link href="/reviews" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50">📋 Read all {totalReviews} reviews</Link>
              <Link href="/submit-review" className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">✍️ Submit yours →</Link>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §7  AGENCY CARDS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

          <div className="text-center mb-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">Top agencies with housing</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Compare the best employers</h2>
            <p className="mt-4 text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Scored on salary transparency, housing quality and contract fairness. Based on real worker data.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            {housingAgencies.map((agency) => (
              <AgencyCard
                key={agency.slug}
                agency={agency}
                jobCount={getJobCountForAgency(agency.slug)}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link href="/agencies-with-housing" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-black text-white shadow-sm transition-colors hover:bg-blue-700">🏢 All {housingCount} housing agencies</Link>
            {/* Secondary — text link weight, "all agencies" is a navigation aid not a conversion CTA */}
            <Link href="/agencies" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">All {totalAgencies} agencies →</Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §8  FINAL CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-950 to-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl mx-auto text-center">

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">
              Know the truth<br />before you sign.
            </h2>
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-12 max-w-lg mx-auto">
              {totalAgencies} agencies. {totalReviews} worker reviews.
              Real salary breakdowns. Zero paid placements.
              Built for workers — not recruiters.
            </p>

            {/* Primary = apply form. Directory link demoted to text. */}
            <div className="flex flex-col items-center gap-3 justify-center mb-12">
              <ApplyBar
                context={{
                  sourcePage:           "/",
                  sourceType:           "general_apply",
                  sourceLabel:          "Homepage — final CTA",
                  defaultAccommodation: true,
                }}
                ctaText="🏠 Find me a job with housing"
                buttonOnly
              />
              <Link
                href="/jobs-with-accommodation"
                className="text-sm text-blue-300 hover:text-white transition-colors underline underline-offset-2"
              >
                Browse jobs with housing →
              </Link>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-blue-300">
              <Link href="/agencies"                     className="transition-colors hover:text-white">All agencies</Link>
              <span className="text-blue-800">·</span>
              <Link href="/reviews"                      className="transition-colors hover:text-white">Worker reviews</Link>
              <span className="text-blue-800">·</span>
              <Link href="/tools/real-income-calculator" className="transition-colors hover:text-white">Salary calculator</Link>
              <span className="text-blue-800">·</span>
              <Link href="/jobs-with-accommodation"      className="transition-colors hover:text-white">Jobs with housing</Link>
              <span className="text-blue-800">·</span>
              <Link href="/submit-review"                className="transition-colors hover:text-white">Submit a review</Link>
            </nav>

          </div>
        </div>
      </section>

    </div>
  );
}
