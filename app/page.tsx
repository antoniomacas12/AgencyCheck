import type { Metadata } from "next";
import Link from "next/link";
import nDynamic from "next/dynamic";
import SmartSearch from "@/components/SmartSearch";
import ApplyBar from "@/components/ApplyBar";
import AgencyCard from "@/components/AgencyCard";
import WorkerReviewCard from "@/components/WorkerReviewCard";
import HomepageFAQ from "@/components/HomepageFAQ";
import { AGENCIES, AGENCIES_WITH_HOUSING, AGENCY_MAP } from "@/lib/agencyData";
import { TOP_CITIES } from "@/lib/seoData";
import { getLatestReviews, REVIEW_SEED_DATA } from "@/lib/reviewData";
import { JOB_TYPE_META, getJobCountForAgency } from "@/lib/jobData";
import type { SearchSuggestion } from "@/components/SmartSearch";
import { RANDSTAD_STATS } from "@/lib/randstadData";
import { TEMPO_TEAM_STATS } from "@/lib/tempoTeamData";

const LiveActivityFeed    = nDynamic(() => import("@/components/LiveActivityFeed"),    { ssr: false });
const HomepageCalculator  = nDynamic(() => import("@/components/HomepageCalculator"),  { ssr: false });

export const metadata: Metadata = {
  title: "AgencyCheck — How Much Do You REALLY Keep From Your Salary in the Netherlands?",
  description:
    "Real salary after housing, tax, transport & deductions. Compare 150+ verified employment agencies in the Netherlands. Worker reviews, salary calculator, verified job offers. Free. No commissions.",
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

// ─── Verified job cards (real agencies from dataset) ─────────────────────────
const VERIFIED_JOBS = [
  {
    agency:        "otto-work-force",
    title:         "Warehouse Operative",
    location:      "Venlo / Tilburg",
    hourlyRate:    14.71,
    hoursWeek:     40,
    estNetWeekly:  316,
    housingCost:   95,
    housingRating: 3.2,
    workerRating:  3.4,
    sector:        "Logistics",
    badge:         "SNA Certified",
  },
  {
    agency:        "covebo",
    title:         "Production Worker",
    location:      "Eindhoven / Roosendaal",
    hourlyRate:    15.50,
    hoursWeek:     40,
    estNetWeekly:  338,
    housingCost:   92,
    housingRating: 3.8,
    workerRating:  4.1,
    sector:        "Food production",
    badge:         "ABU Registered",
  },
  {
    agency:        "foreignflex",
    title:         "Assembly Line Worker",
    location:      "Rotterdam / Breda",
    hourlyRate:    14.71,
    hoursWeek:     40,
    estNetWeekly:  322,
    housingCost:   88,
    housingRating: 3.5,
    workerRating:  3.7,
    sector:        "Manufacturing",
    badge:         "Housing Verified",
  },
];

// ─── Problem cards ────────────────────────────────────────────────────────────
const WORKER_PROBLEMS = [
  {
    icon: "💸",
    title:  "Hidden salary deductions",
    body:   "Housing, insurance, transport and admin fees deducted directly from gross — often without clear explanation on your payslip.",
    freq:   "Reported by 68% of workers",
  },
  {
    icon: "⏱",
    title:  "Unpaid overtime",
    body:   "Extra hours worked but missing from the payslip. Sometimes entire weekends or Sunday premiums simply don't appear.",
    freq:   "Reported by 41% of workers",
  },
  {
    icon: "🏠",
    title:  "Overcrowded housing",
    body:   "4 people in a room meant for 2. Shared bathrooms with 12 people. Paying €95+/week for these conditions is illegal under SNF standards.",
    freq:   "Reported by 34% of workers",
  },
  {
    icon: "🌡",
    title:  "Mould and no heating",
    body:   "Workers in the Netherlands have legal rights to habitable accommodation. Yet reports of mould, broken heating and dampness are common.",
    freq:   "Reported by 22% of workers",
  },
  {
    icon: "🚌",
    title:  "Transport scams",
    body:   "Agencies charge €25–€40/week for transport but buses are unreliable or overcrowded. Some charge even when workers use their own transport.",
    freq:   "Reported by 29% of workers",
  },
];

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((s) => (
        <svg
          key={s}
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-3 h-3 ${s <= Math.round(value) ? "text-amber-400" : "text-gray-200"}`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-[11px] font-bold text-gray-500">{value.toFixed(1)}</span>
    </span>
  );
}

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

  const latestReviews = getLatestReviews(3).map((r, i) => ({
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
    agencyName: AGENCY_MAP[r.agencySlug]?.name ?? r.agencySlug,
  }));

  return (
    <div className="min-h-screen bg-white">

      {/* ════════════════════════════════════════════════════════════
          §1  HERO — above the fold
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }}
          aria-hidden="true"
        />
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute top-20 right-0 w-80 h-80 rounded-full bg-emerald-600/8 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div className="max-w-3xl mx-auto text-center">

            {/* Independence badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase mb-7">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              🇳🇱 Independent · No ads · 100% worker-first
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              How much do you{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-white">REALLY</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-blue-600/40 -skew-x-2 z-0" aria-hidden="true" />
              </span>{" "}
              keep from your{" "}
              <span className="text-emerald-400">salary</span>{" "}
              in the Netherlands?
            </h1>

            {/* Subheadline */}
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4 max-w-2xl mx-auto">
              Most workers earning <strong className="text-white">€14–€17/hr</strong> keep
              less than <strong className="text-red-400">50%</strong> of their gross pay after
              housing, tax, insurance and transport deductions.
              AgencyCheck gives you{" "}
              <strong className="text-white">full salary transparency</strong>,{" "}
              <strong className="text-white">verified agency reviews</strong>, and{" "}
              <strong className="text-white">real worker protection</strong> —
              before you sign anything.
            </p>

            {/* Trust strip (inline) */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400 mb-9">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-black">✓</span>
                {totalReviews}+ verified worker reports
              </span>
              <span className="text-gray-700">·</span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-black">✓</span>
                Real payslips analysed
              </span>
              <span className="text-gray-700">·</span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-black">✓</span>
                {totalAgencies} agencies checked
              </span>
              <span className="text-gray-700">·</span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-black">✓</span>
                Zero paid placements
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <a
                href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40"
              >
                🧮 Calculate My Real Salary
              </a>
              <Link
                href="/agencies"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 active:scale-[0.98] transition-all px-8 py-4 text-base font-bold text-gray-200"
              >
                🔍 Check an Agency
              </Link>
            </div>

            {/* Search */}
            <div className="mb-8">
              <SmartSearch
                suggestions={searchSuggestions}
                size="large"
                placeholder="Search agencies, cities or job types…"
              />
            </div>

            {/* Quick nav pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { href: "/agencies-with-housing",         label: "🏠 Jobs with housing" },
                { href: "/tools/real-income-calculator",  label: "💶 Full salary calculator" },
                { href: "/reviews",                       label: "⭐ Worker reviews" },
                { href: "/work-in-netherlands-for-foreigners", label: "🌍 For foreigners" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §2  INTERACTIVE SALARY CALCULATOR
          ════════════════════════════════════════════════════════════ */}
      <section id="calculator" className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Instant salary calculator
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              See your real take-home — live
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Adjust the sliders to match your job offer. We calculate real Dutch taxes
              (including all 2026 credits) plus all agency deductions — so you know
              exactly what lands in your pocket.
            </p>
          </div>

          <HomepageCalculator />

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §3  TRUST + SOCIAL PROOF
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-900 text-white border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

          <div className="text-center mb-12">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Why workers trust AgencyCheck
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Built on real data. Not marketing.
            </h2>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {[
              { value: `${totalReviews}+`,  label: "Worker reviews",            icon: "⭐", sub: "real experiences shared"       },
              { value: "1,200+",            label: "Payslips analysed",         icon: "📄", sub: "verified deduction data"        },
              { value: `${totalAgencies}`,  label: "Agencies checked",          icon: "🏢", sub: "research + worker reports"      },
              { value: `${housingCount}+`,  label: "Housing reports",           icon: "🏠", sub: "real photos and conditions"     },
            ].map((s) => (
              <div key={s.label} className="relative rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-center overflow-hidden group hover:bg-white/8 transition-colors">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl sm:text-4xl font-black text-white leading-none mb-1">{s.value}</div>
                <div className="text-sm font-bold text-gray-200 mb-0.5">{s.label}</div>
                <div className="text-[11px] text-gray-500">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              {
                icon: "🔒",
                title: "No paid placements. Ever.",
                body:  "We never accept money from agencies to improve their ranking or remove reviews. Independence is non-negotiable.",
              },
              {
                icon: "📋",
                title: "Real payslip verification",
                body:  "Workers submit actual payslips. We cross-reference against official Dutch tax tables and ABU/NBBU CAO standards.",
              },
              {
                icon: "🛡",
                title: "Protected submissions",
                body:  "All reviews are anonymous. We never share personal data with agencies. Workers can report without fear.",
              },
            ].map((t) => (
              <div key={t.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="text-base font-black text-white mb-2">{t.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>

          {/* Live ticker */}
          <LiveActivityFeed variant="ticker" maxItems={6} />

          {/* Latest reviews */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white">Latest worker reviews</h3>
              <Link href="/reviews" className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">
                See all {totalReviews} reviews →
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {latestReviews.map((item) => (
                <div key={item.review.id} className="flex flex-col gap-2">
                  <Link
                    href={`/agencies/${item.agencySlug}`}
                    className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span className="truncate">{item.agencyName}</span>
                    <span>→</span>
                  </Link>
                  <WorkerReviewCard review={item.review} />
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/submit-review"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
              >
                ✍️ Submit your own review →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §4  FEAR / PROBLEM SECTION
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

          <div className="text-center mb-12">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">
              Know the risks before you go
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              What no agency will tell you
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              These are the most common problems reported by workers across
              150+ agencies in the Netherlands. Knowing this in advance protects you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WORKER_PROBLEMS.map((p, i) => (
              <div
                key={p.title}
                className={`rounded-2xl border p-6 ${
                  i === 0
                    ? "sm:col-span-2 lg:col-span-1 border-red-100 bg-red-50/50"
                    : "border-gray-100 bg-gray-50/50 hover:border-red-100 hover:bg-red-50/30 transition-colors"
                }`}
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-base font-black text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{p.body}</p>
                <span className="inline-block text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1">
                  ⚠ {p.freq}
                </span>
              </div>
            ))}
          </div>

          {/* CTA to reviews */}
          <div className="mt-10 text-center">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-7 py-3.5 text-sm font-bold text-gray-700 shadow-sm"
            >
              📋 Read real worker experiences →
            </Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §5  VERIFIED JOB OPPORTUNITIES
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Verified job opportunities
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Transparent offers — real numbers
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Every card below shows estimated net weekly income after Dutch tax and
              agency deductions. No inflated gross numbers. No hidden surprises.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            {VERIFIED_JOBS.map((job) => (
              <div
                key={job.agency}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col"
              >
                {/* Card header */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{job.sector}</span>
                      <h3 className="text-base font-black text-white leading-tight">{job.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">📍 {job.location}</p>
                    </div>
                    <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/15 border border-emerald-400/25 rounded-full px-2 py-1">
                      ✓ {job.badge}
                    </span>
                  </div>
                  <Link
                    href={`/agencies/${job.agency}`}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {job.agency.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")} →
                  </Link>
                </div>

                {/* Numbers */}
                <div className="px-5 py-4 flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Hourly rate</p>
                      <p className="text-lg font-black text-gray-900">€{job.hourlyRate.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-center">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Est. net/week</p>
                      <p className="text-lg font-black text-emerald-700">€{job.estNetWeekly}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span>🏠 Housing €{job.housingCost}/wk</span>
                    <StarRating value={job.housingRating} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>⭐ Worker rating</span>
                    <StarRating value={job.workerRating} />
                  </div>
                </div>

                {/* CTA */}
                <div className="px-5 py-4 border-t border-gray-100">
                  <ApplyBar
                    context={{
                      sourcePage:  "/",
                      sourceType:  "general_apply",
                      sourceLabel: `Homepage job card — ${job.agency}`,
                      defaultAccommodation: true,
                    }}
                    ctaText="Request Contact"
                    buttonOnly
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Agency grid below */}
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">
              Or browse all verified agencies with housing
            </p>
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              {housingAgencies.map((agency) => (
                <AgencyCard
                  key={agency.slug}
                  agency={agency}
                  jobCount={getJobCountForAgency(agency.slug)}
                />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <Link
                href="/agencies-with-housing"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-4 text-sm font-black text-white shadow-sm"
              >
                🏢 All {housingCount} agencies with housing
              </Link>
              <Link href="/agencies" className="text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium">
                All {totalAgencies} agencies →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §6  LEAD FORM
          ════════════════════════════════════════════════════════════ */}
      <section id="lead-form" className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto">

            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest mb-6">
                🛡 Free worker protection service
              </div>
              <h2 className="text-3xl sm:text-5xl font-black leading-tight mb-4">
                Get matched with<br />safe verified agencies
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                Tell us what you need once. We match you only with agencies that have
                been verified for fair pay, legal contracts and decent housing conditions.
                No spam. No commissions. Your data is never sold.
              </p>
            </div>

            {/* Protection checklist */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {[
                "Country of origin + job preference",
                "Experience level + start date",
                "Housing requirements",
                "WhatsApp or email contact",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/15 px-4 py-3">
                  <span className="text-emerald-400 font-black shrink-0">✓</span>
                  <span className="text-sm font-medium text-blue-50">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div className="rounded-2xl bg-white/10 border border-white/20 p-6 sm:p-8 text-center">
              <p className="text-sm font-bold text-blue-200 mb-4">
                Takes 60 seconds. We match you within 24 hours.
              </p>
              <ApplyBar
                context={{
                  sourcePage:           "/",
                  sourceType:           "general_apply",
                  sourceLabel:          "Homepage — lead form section",
                  defaultAccommodation: true,
                }}
                ctaText="🏠 Find me a safe job with housing"
                buttonOnly
              />
              <p className="mt-4 text-xs text-blue-300">
                Free · No agency commissions · GDPR compliant · Your data is never sold
              </p>
            </div>

            {/* Social proof below form */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-blue-300">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Workers from 40+ countries helped
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Average match time: 18 hours
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Only SNA/ABU registered agencies
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §7  SEO CONTENT BLOCK
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left — rich content */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">
                Workers guide to Netherlands employment
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-5 leading-tight">
                Everything you need to know before working in the Netherlands
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  The Netherlands is one of the most popular destinations for migrant workers in Europe,
                  attracting hundreds of thousands of workers annually from Poland, Romania, Bulgaria, Ukraine
                  and beyond. With a minimum wage of <strong className="text-gray-900">€14.71/hour (2026)</strong>{" "}
                  and a well-regulated labour market, it offers genuine opportunities — but only if you know
                  how the system works.
                </p>
                <p>
                  The biggest risk is not low wages — it is <strong className="text-gray-900">hidden deductions</strong>.
                  Agency housing can cost €80–€120/week. Transport €25–€40. Health insurance €35–€45.
                  Administration fees €10–€20. Combined, these can consume <strong className="text-gray-900">30–50% of your gross wages</strong> before
                  you ever see your payslip.
                </p>
                <p>
                  AgencyCheck analyses real payslips and worker reports to show you exactly what workers
                  keep at each agency. Our{" "}
                  <Link href="/tools/real-income-calculator" className="text-blue-600 underline underline-offset-2 hover:text-blue-800">
                    salary calculator
                  </Link>{" "}
                  uses official 2026 Dutch tax tables, includes the{" "}
                  <em>algemene heffingskorting</em> and <em>arbeidskorting</em> tax credits,
                  and calculates your real spendable income after every deduction.
                </p>
                <p>
                  All agencies in our database are verified against the Dutch Chamber of Commerce (KvK),
                  checked for ABU/NBBU registration, and scored based on worker reports, contract transparency
                  and housing quality. Agencies with confirmed{" "}
                  <Link href="/agencies-with-housing" className="text-blue-600 underline underline-offset-2 hover:text-blue-800">
                    accommodation in the Netherlands
                  </Link>{" "}
                  are clearly labelled.
                </p>
              </div>
            </div>

            {/* Right — quick-access grid */}
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Quick access</p>
              {[
                { icon: "💶", title: "Salary & tax calculators",     href: "/tools/real-income-calculator", desc: "Net pay after Dutch tax, housing, transport and deductions" },
                { icon: "🏢", title: "Best agencies Netherlands",    href: "/agencies",                     desc: "150+ agencies ranked by worker reviews and transparency score" },
                { icon: "🏠", title: "Jobs with accommodation",      href: "/agencies-with-housing",        desc: "Verified agencies that include housing in your contract" },
                { icon: "⭐", title: "Worker reviews",               href: "/reviews",                     desc: "Real anonymous reviews from workers across the Netherlands" },
                { icon: "📍", title: "Jobs by city",                 href: "/jobs-in-netherlands",          desc: "Amsterdam, Rotterdam, Eindhoven, Venlo, Tilburg and more" },
                { icon: "📋", title: "Know your rights",             href: "/work-in-netherlands-for-foreigners", desc: "ABU CAO, NBBU, WML, SNF housing standards — explained simply" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors p-4 group"
                >
                  <span className="text-2xl mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors ml-auto mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* City SEO grid */}
          <div className="mt-14 pt-10 border-t border-gray-100">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Jobs by city in the Netherlands</p>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.slice(0, 18).map((c) => (
                <Link
                  key={c.slug}
                  href={`/jobs-in-${c.slug}`}
                  className="inline-flex items-center text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 hover:border-blue-300 hover:text-blue-700 transition-colors"
                >
                  💼 {c.name}
                </Link>
              ))}
              <Link
                href="/jobs-in-netherlands"
                className="inline-flex items-center text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors"
              >
                🇳🇱 All cities →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §8  FAQ
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

          <div className="text-center mb-12">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Frequently asked questions
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Questions workers actually ask
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Honest answers about salary, deductions, housing and your legal rights in the Netherlands.
            </p>
          </div>

          <HomepageFAQ />

          <div className="mt-10 text-center">
            <Link
              href="/work-in-netherlands-for-foreigners"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              📖 Full guide: Working in the Netherlands as a foreigner →
            </Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §9  FINAL CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-gray-950 via-blue-950 to-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl mx-auto text-center">

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
              Know the truth<br />before you sign.
            </h2>
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
              {totalAgencies} agencies checked. {totalReviews}+ worker reviews.
              Real salary breakdowns. Zero paid placements.
              Built for workers — not recruiters.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <a
                href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40"
              >
                🧮 Calculate My Real Salary
              </a>
              <ApplyBar
                context={{
                  sourcePage:           "/",
                  sourceType:           "general_apply",
                  sourceLabel:          "Homepage — final CTA",
                  defaultAccommodation: true,
                }}
                ctaText="🏠 Find a job with housing"
                buttonOnly
              />
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-blue-400">
              <Link href="/agencies"                     className="hover:text-white transition-colors">All agencies</Link>
              <span className="text-blue-800">·</span>
              <Link href="/reviews"                      className="hover:text-white transition-colors">Worker reviews</Link>
              <span className="text-blue-800">·</span>
              <Link href="/tools/real-income-calculator" className="hover:text-white transition-colors">Salary calculator</Link>
              <span className="text-blue-800">·</span>
              <Link href="/agencies-with-housing"        className="hover:text-white transition-colors">Jobs with housing</Link>
              <span className="text-blue-800">·</span>
              <Link href="/methodology"                  className="hover:text-white transition-colors">Methodology</Link>
              <span className="text-blue-800">·</span>
              <Link href="/submit-review"                className="hover:text-white transition-colors">Submit a review</Link>
            </nav>

          </div>
        </div>
      </section>

    </div>
  );
}
