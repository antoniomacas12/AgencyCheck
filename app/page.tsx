import type { Metadata } from "next";
import Link from "next/link";
import nDynamic from "next/dynamic";
import SmartSearch from "@/components/SmartSearch";
import ApplyBar from "@/components/ApplyBar";
import AgencyCard from "@/components/AgencyCard";
import WorkerReviewCard from "@/components/WorkerReviewCard";
import WorkerHousingStrip from "@/components/WorkerHousingStrip";
import HomepageFAQ from "@/components/HomepageFAQ";
import { AGENCIES, AGENCIES_WITH_HOUSING, AGENCY_MAP } from "@/lib/agencyData";
import { TOP_CITIES } from "@/lib/seoData";
import { getLatestReviews, REVIEW_SEED_DATA } from "@/lib/reviewData";
import { JOB_TYPE_META, getJobCountForAgency } from "@/lib/jobData";
import type { SearchSuggestion } from "@/components/SmartSearch";
import { RANDSTAD_STATS } from "@/lib/randstadData";
import { TEMPO_TEAM_STATS } from "@/lib/tempoTeamData";

const LiveActivityFeed   = nDynamic(() => import("@/components/LiveActivityFeed"),   { ssr: false });
const HomepageCalculator = nDynamic(() => import("@/components/HomepageCalculator"), { ssr: false });
const HomepageLeadForm   = nDynamic(() => import("@/components/HomepageLeadForm"),   { ssr: false });
const HomepageStickyBar  = nDynamic(() => import("@/components/HomepageStickyBar"),  { ssr: false });

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

// ─── Verified job data for agency cards ─────────────────────────────────────
const VERIFIED_JOB_META: Record<string, {
  jobTitle: string; hourlyRate: number; estNetWeekly: number;
  housingCost: number; responseTime: string; sector: string;
}> = {
  "otto-work-force": {
    jobTitle: "Warehouse Operative", hourlyRate: 14.71, estNetWeekly: 316,
    housingCost: 95, responseTime: "< 4 hours", sector: "Logistics",
  },
  "covebo": {
    jobTitle: "Production Worker", hourlyRate: 15.50, estNetWeekly: 338,
    housingCost: 92, responseTime: "< 6 hours", sector: "Food production",
  },
  "foreignflex": {
    jobTitle: "Assembly Line Worker", hourlyRate: 14.71, estNetWeekly: 322,
    housingCost: 88, responseTime: "< 8 hours", sector: "Manufacturing",
  },
};

// ─── Worker problems ─────────────────────────────────────────────────────────
const WORKER_PROBLEMS = [
  { icon: "💸", title: "Hidden salary deductions", freq: "68% of workers",
    body: "Housing, insurance, transport and admin fees deducted directly from gross — often without explanation on your payslip." },
  { icon: "⏱", title: "Unpaid overtime",           freq: "41% of workers",
    body: "Extra hours worked but not appearing on the payslip. Entire weekends and Sunday premiums simply disappear." },
  { icon: "🏠", title: "Overcrowded housing",       freq: "34% of workers",
    body: "4 workers in a room designed for 2. Paying €95+/week for these conditions violates SNF housing standards." },
  { icon: "🌡", title: "Mould and no heating",      freq: "22% of workers",
    body: "Dutch law guarantees habitable accommodation. Yet reports of mould, broken heating and dampness are widespread." },
  { icon: "🚌", title: "Transport scams",           freq: "29% of workers",
    body: "Charged €25–€40/week for buses that are unreliable or overcrowded. Some agencies charge even when you travel independently." },
];

// ─── Salary breakdown rows (static illustration) ─────────────────────────────
const SALARY_ROWS = [
  { label: "Gross pay",        amount: "+€600", green: true,  bold: false },
  { label: "Tax & social",     amount: "−€162", green: false, bold: false },
  { label: "Agency housing",   amount: "−€95",  green: false, bold: false },
  { label: "Health insurance", amount: "−€35",  green: false, bold: false },
  { label: "Transport",        amount: "−€25",  green: false, bold: false },
  { label: "Admin fees",       amount: "−€40",  green: false, bold: false },
  { label: "💶 You keep",      amount: "€243",  green: true,  bold: true  },
] as const;

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} viewBox="0 0 20 20" fill="currentColor"
          className={`w-3 h-3 ${s <= Math.round(value) ? "text-amber-400" : "text-gray-200"}`}>
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
    ...AGENCIES.map((a) => ({ type: "agency" as const, label: a.name, sublabel: a.city, href: `/agencies/${a.slug}` })),
    ...TOP_CITIES.map((c) => ({ type: "city" as const, label: c.name, sublabel: c.region, href: `/cities/${c.slug}` })),
    ...Object.entries(JOB_TYPE_META).map(([slug, meta]) => ({ type: "job" as const, label: meta.title, sublabel: "Job type", href: `/jobs/${slug}` })),
    { type: "job" as const, label: "Randstad Jobs",     sublabel: `${RANDSTAD_STATS.total} real vacancies`,    href: "/randstad-jobs" },
    { type: "job" as const, label: "Tempo-Team Jobs",   sublabel: `${TEMPO_TEAM_STATS.total} real vacancies`,  href: "/tempo-team-jobs" },
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
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }}
          aria-hidden="true" />
        {/* Glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-blue-600/10 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-12 sm:pt-22 sm:pb-16">
          <div className="max-w-3xl mx-auto text-center">

            {/* Independence badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              🇳🇱 Independent · No paid rankings · 100% worker-first
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-5">
              You think you earn{" "}
              <span className="text-emerald-400 whitespace-nowrap">€600/week.</span>
              <br className="hidden sm:block" />
              You actually keep{" "}
              <span className="text-red-400 whitespace-nowrap">€243.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-5 max-w-2xl mx-auto">
              Agency housing, health insurance, transport and admin fees eat your pay
              before you touch it. See the <strong className="text-white">real breakdown</strong>,
              compare agencies that are <strong className="text-white">actually honest</strong> about costs,
              and get matched with verified offers —{" "}
              <strong className="text-emerald-400">for free</strong>.
            </p>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400 mb-9">
              {[
                `${totalAgencies} verified agencies`,
                `${totalReviews}+ worker reviews`,
                "No paid rankings",
                "Ratings fully worker-driven",
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-black">✓</span>{t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-9">
              <a href="#lead-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40">
                🛡 Get matched safely
              </a>
              <a href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 active:scale-[0.98] transition-all px-8 py-4 text-base font-bold text-gray-200">
                🧮 Calculate my real salary
              </a>
            </div>

            {/* Search */}
            <div className="mb-7">
              <SmartSearch suggestions={searchSuggestions} size="large" placeholder="Search agencies, cities or job types…" />
            </div>

            {/* Quick pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { href: "/agencies-with-housing",         label: "🏠 Jobs with housing" },
                { href: "/agencies",                      label: "🏢 All agencies" },
                { href: "/reviews",                       label: "⭐ Worker reviews" },
                { href: "/work-in-netherlands-for-foreigners", label: "🌍 For foreigners" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/20 hover:text-white">
                  {l.label}
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §2  IMMEDIATE LEAD FORM — right after hero
          ════════════════════════════════════════════════════════════ */}
      <section id="lead-form" className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* Section label + heading */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1.5">
                🛡 Free worker protection service
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                Get a job with safe, verified agencies
              </h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xl">
                <span className="font-semibold text-gray-700">Transparent deductions</span> ·{" "}
                <span className="font-semibold text-gray-700">Verified housing</span> ·{" "}
                <span className="font-semibold text-gray-700">Real worker reviews</span>{" "}
                — We match you only with agencies that pass our verification checks.
              </p>
            </div>
            {/* Mini proof badges */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {["No paid rankings", "GDPR compliant", "Free matching"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                  <span className="text-emerald-500">✓</span> {b}
                </span>
              ))}
            </div>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 sm:p-7 shadow-sm">
            <HomepageLeadForm />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §3  SALARY CALCULATOR
          ════════════════════════════════════════════════════════════ */}
      <section id="calculator" className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Instant salary calculator — 2026 Dutch tax rates
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">
              What will you actually keep?
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Adjust the inputs for your offer. We calculate real Dutch taxes (including
              all heffingskorting credits) plus every agency deduction — live.
            </p>
          </div>

          <HomepageCalculator />

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §4  METHODOLOGY TRUST BLOCK
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

          <div className="text-center mb-8">
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Calculation methodology</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">How we calculate your real salary</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
            {[
              {
                icon: "📊",
                title: "Dutch income tax 2026",
                items: [
                  "Loonheffing brackets (2 tiers)",
                  "Algemene heffingskorting — up to €3,362/yr credit",
                  "Arbeidskorting — up to €5,000/yr credit",
                  "Effective rate = tax ÷ gross (after all credits)",
                ],
              },
              {
                icon: "🏠",
                title: "Housing deduction logic",
                items: [
                  "Agency housing: €80–€120/wk (SNF standard max)",
                  "Own housing: €500–€900/mo (regional average)",
                  "SNF legal cap: ~€113.50/wk for shared rooms",
                  "Source: SNF Normering Flexwonen 2024",
                ],
              },
              {
                icon: "🚌",
                title: "Transport & insurance",
                items: [
                  "Agency bus: avg €25/wk (worker-reported)",
                  "Zorgverzekering: €152–€180/mo (2026 market)",
                  "Own eigen risico spread: €33/mo average",
                  "Admin fees: €0–€20/wk (agency-reported)",
                ],
              },
            ].map((block) => (
              <div key={block.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="text-2xl mb-3">{block.icon}</div>
                <h3 className="text-sm font-black text-gray-900 mb-3">{block.title}</h3>
                <ul className="space-y-1.5">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600 leading-snug">
                      <span className="text-emerald-500 font-black mt-0.5 shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Assumptions + static breakdown side by side */}
          <div className="grid lg:grid-cols-2 gap-6 items-start">

            {/* Assumptions list */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Key assumptions</p>
              <ul className="space-y-2 text-xs text-gray-700">
                {[
                  "Primary employment in the Netherlands (no double taxation treaty applied)",
                  "48 working weeks/year (4 weeks vacation included)",
                  "8% vakantiegeld (holiday allowance) added to gross per BW Art. 7:634",
                  "Single worker — no partner allowance or childcare deductions",
                  "Standard health insurance (not social assistance / toeslagen)",
                  "WML 2026: €14.71/hr · Updated: January 2026",
                ].map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <span className="text-blue-500 font-black shrink-0 mt-0.5">✓</span>{a}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[10px] text-gray-400 leading-relaxed border-t border-blue-100 pt-3">
                <strong className="text-gray-500">Legal disclaimer:</strong> These calculations are for
                informational purposes only and do not constitute tax, legal or financial advice. Individual
                circumstances may vary. Consult a belastingadviseur for your specific situation.{" "}
                <Link href="/methodology" className="text-blue-600 underline hover:text-blue-800">Full methodology →</Link>
              </p>
            </div>

            {/* Static example payslip */}
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-gray-900 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Example: WML worker · €14.71/hr · 40h/wk
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {SALARY_ROWS.map((row) => (
                  <div key={row.label}
                    className={`flex items-center justify-between px-5 py-3 ${row.bold ? "bg-gray-900" : "bg-white"}`}>
                    <span className={`text-sm ${row.bold ? "font-black text-white" : "text-gray-600"}`}>{row.label}</span>
                    <span className={`text-sm font-bold ${row.bold ? `text-lg font-black ${row.green ? "text-emerald-400" : "text-red-400"}` : row.green ? "text-emerald-600" : "text-red-500"}`}>
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400">
                  Includes €95/wk housing + €25/wk transport + €35/wk insurance + €40/wk admin.{" "}
                  <Link href="/methodology" className="text-blue-600 underline">Full methodology</Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §5  SALARY PAIN → CONVERSION CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            You now know the real numbers
          </p>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-4">
            Want <span className="text-emerald-400">better conditions</span> and
            more money left each week?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Not all agencies are equal. Some have lower housing fees, faster payslips and
            transparent contracts. We verify which ones — and match you for free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#lead-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
              🛡 See verified offers
            </a>
            <Link href="/agencies-with-housing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-300 active:scale-[0.98]">
              Browse all {housingCount} housing agencies
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            {["No paid rankings", "Agencies cannot buy better ratings", "Ratings are fully worker-driven", "Partner status never affects scores"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-black">✓</span>{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §6  WORKER PROBLEMS / RISKS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">What no agency will tell you</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">Common problems reported by workers</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              Based on {totalReviews}+ verified worker reports. Knowing this protects you before you sign.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {WORKER_PROBLEMS.map((p, i) => (
              <div key={p.title}
                className={`rounded-2xl border p-6 ${i === 0 ? "lg:col-span-1 border-red-100 bg-red-50/40" : "border-gray-100 bg-gray-50 hover:border-red-100 hover:bg-red-50/20 transition-colors"}`}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-base font-black text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{p.body}</p>
                <span className="inline-block text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1">
                  ⚠ {p.freq}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/reviews"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-7 py-3.5 text-sm font-bold text-gray-700 shadow-sm">
              📋 Read real worker experiences →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §7  HOUSING PROOF
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">
          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Real housing — not brochures</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">See where you'll actually live</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Worker-submitted photos and descriptions. No stock images. No agency PR.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
            <WorkerHousingStrip />
          </div>
          <div className="mt-6 text-center">
            <Link href="/agencies-with-housing"
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              Browse all {housingCount} agencies with housing →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §8  WORKER REVIEWS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">
          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">What workers actually say</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">Real reviews. No filter.</h2>
            <p className="text-[11px] text-gray-400 font-semibold">
              No paid rankings · Agencies cannot buy better ratings · Ratings are fully worker-driven
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            {latestReviews.map((item) => (
              <div key={item.review.id} className="flex flex-col gap-2">
                <Link href={`/agencies/${item.agencySlug}`}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  <span className="truncate">{item.agencyName}</span>
                  <span>→</span>
                </Link>
                <WorkerReviewCard review={item.review} />
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/reviews"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              📋 Read all {totalReviews} reviews
            </Link>
            <Link href="/submit-review" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              ✍️ Submit yours →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §9  VERIFIED AGENCY CARDS — primary revenue section
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Verified job opportunities
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">
              Transparent offers — real net income shown
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
              Every card shows estimated net weekly income after Dutch tax and deductions.
              No inflated gross numbers.
            </p>
          </div>

          {/* Enhanced job cards */}
          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {housingAgencies.slice(0, 3).map((agency) => {
              const meta = VERIFIED_JOB_META[agency.slug];
              return (
                <div key={agency.slug}
                  className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col group">

                  {/* Header */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                          {meta?.sector ?? "Labour services"}
                        </span>
                        <h3 className="text-base font-black text-white leading-tight truncate">
                          {meta?.jobTitle ?? "Warehouse / Production"}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">📍 {agency.city}</p>
                      </div>
                      <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/15 border border-emerald-400/25 rounded-full px-2 py-1 whitespace-nowrap">
                        ✓ Verified
                      </span>
                    </div>
                    <Link href={`/agencies/${agency.slug}`}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group-hover:underline">
                      {agency.name} →
                    </Link>
                  </div>

                  {/* Numbers */}
                  <div className="px-5 py-4 flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Hourly rate</p>
                        <p className="text-lg font-black text-gray-900">
                          €{(meta?.hourlyRate ?? 14.71).toFixed(2)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Est. net/week</p>
                        <p className="text-lg font-black text-emerald-700">
                          €{meta?.estNetWeekly ?? 316}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>🏠 Housing cost</span>
                        <span className="font-bold text-gray-700">€{meta?.housingCost ?? 95}/wk</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⭐ Worker rating</span>
                        <StarRating value={agency.avgSalaryRating ?? 3.5} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⚡ Response time</span>
                        <span className="font-bold text-gray-700">{meta?.responseTime ?? "< 24 hours"}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                    <ApplyBar
                      context={{
                        sourcePage:           "/",
                        sourceType:           "agency_page",
                        sourceLabel:          `Homepage agency card — ${agency.slug}`,
                        defaultAccommodation: true,
                      }}
                      ctaText="Request Contact"
                      buttonOnly
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Standard agency grid below */}
          <div className="grid gap-4 sm:grid-cols-3 mb-7">
            {housingAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} jobCount={getJobCountForAgency(agency.slug)} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/agencies-with-housing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-4 text-sm font-black text-white shadow-sm">
              🏢 All {housingCount} housing agencies
            </Link>
            <Link href="/agencies" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              All {totalAgencies} agencies →
            </Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §10  PAYSLIP TOOL CTA — future premium product
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 text-white border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">

            <div className="grid sm:grid-cols-2 gap-8 items-center">
              {/* Left */}
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/15 border border-amber-400/20 rounded-full px-3 py-1 mb-5">
                  ⚡ Free tool
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
                  Did your agency underpay you?
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Upload your Dutch payslip (<em>loonstrook</em>) and we verify every line
                  against the official 2026 Dutch tax tables and ABU/NBBU CAO standards.
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  We check: correct tax brackets · heffingskorting credits applied ·
                  SNF housing deduction limits · overtime premiums · vakantiegeld calculation.
                </p>
                <Link href="/tools/payslip-checker"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors px-7 py-3.5 text-sm font-black text-white shadow-sm shadow-amber-900/40 active:scale-[0.98]">
                  📄 Upload Payslip — Verify Now
                </Link>
              </div>

              {/* Right — what we check */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">What we verify</p>
                <ul className="space-y-2.5">
                  {[
                    { ok: true,  label: "Correct loonheffing brackets applied" },
                    { ok: true,  label: "Heffingskorting credit calculated" },
                    { ok: true,  label: "Housing deduction ≤ SNF legal maximum" },
                    { ok: true,  label: "Overtime premiums (100%, 125%, 150%)" },
                    { ok: true,  label: "Vakantiegeld ≥ 8% of gross wages" },
                    { ok: false, label: "False deductions or unexplained fees" },
                  ].map((item) => (
                    <li key={item.label} className="flex items-center gap-3 text-sm">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.ok ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                        {item.ok ? "✓" : "✗"}
                      </span>
                      <span className="text-gray-300">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SEO content + FAQ + city grid
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">

            {/* Rich SEO content */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Workers guide</p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 leading-tight">
                Everything to know before working in the Netherlands
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  The Dutch minimum wage (<em>Wettelijk Minimumloon</em>) stands at{" "}
                  <strong className="text-gray-900">€14.71/hour in 2026</strong> for workers
                  aged 21+. At 40 hours per week this gives a gross of approximately €600/week.
                  But after Dutch income tax, agency housing, health insurance and transport,
                  most workers keep between <strong className="text-gray-900">€250–€340</strong> —
                  often less than 50% of their gross.
                </p>
                <p>
                  The key legal protections to know: the <strong className="text-gray-900">ABU / NBBU CAO</strong>{" "}
                  (collective labour agreement) regulates pay scales, overtime premiums and holiday pay.
                  The <strong className="text-gray-900">SNF</strong> (Stichting Normering Flexwonen) sets legal maximum
                  housing deductions. The <strong className="text-gray-900">Inspectie SZW</strong> enforces all labour law.
                  AgencyCheck verifies agencies against all three.
                </p>
                <p>
                  Our{" "}
                  <Link href="/tools/real-income-calculator" className="text-blue-600 underline hover:text-blue-800">salary calculator</Link>{" "}
                  uses official 2026 tax tables and includes both the <em>algemene heffingskorting</em> and{" "}
                  <em>arbeidskorting</em> credits — credits that can save low-wage workers
                  €600–€700 per month in tax that many agencies don&apos;t mention.
                </p>
              </div>
            </div>

            {/* Quick-access resource links */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Quick access</p>
              {[
                { icon: "💶", href: "/tools/real-income-calculator",        title: "Full salary calculator",              desc: "Net pay with all 2026 Dutch tax credits included" },
                { icon: "📄", href: "/tools/payslip-checker",               title: "Payslip verification tool",           desc: "Upload your loonstrook and check for errors" },
                { icon: "🏢", href: "/agencies",                            title: "All agencies Netherlands",            desc: `${totalAgencies} agencies ranked by worker ratings` },
                { icon: "🏠", href: "/agencies-with-housing",               title: "Jobs with accommodation",             desc: `${housingCount} verified agencies including housing` },
                { icon: "⭐", href: "/reviews",                             title: "Worker reviews",                      desc: `${totalReviews}+ real anonymous reviews` },
                { icon: "📋", href: "/work-in-netherlands-for-foreigners",  title: "Rights & legal guide",                desc: "ABU CAO, WML, SNF — explained simply" },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors p-4 group">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug truncate">{item.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors ml-auto mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* City SEO grid */}
          <div className="pt-8 border-t border-gray-100">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Browse jobs by city</p>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.slice(0, 18).map((c) => (
                <Link key={c.slug} href={`/jobs-in-${c.slug}`}
                  className="inline-flex items-center text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 hover:border-blue-300 hover:text-blue-700 transition-colors">
                  💼 {c.name}
                </Link>
              ))}
              <Link href="/jobs-in-netherlands"
                className="inline-flex items-center text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors">
                🇳🇱 All cities →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Questions workers actually ask</h2>
          </div>
          <HomepageFAQ />
          <div className="mt-8 text-center">
            <Link href="/work-in-netherlands-for-foreigners"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              📖 Full guide: Working in the Netherlands →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-950 to-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-18 sm:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
              Know the truth<br />before you sign.
            </h2>
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-4 max-w-lg mx-auto">
              {totalAgencies} agencies. {totalReviews}+ worker reviews. Real salary breakdowns.
              No paid rankings. Built for workers — not recruiters.
            </p>
            <p className="text-xs text-blue-400 mb-9">
              ✓ No paid rankings &nbsp;·&nbsp; ✓ Agencies cannot buy better ratings &nbsp;·&nbsp;
              ✓ Ratings are fully worker-driven &nbsp;·&nbsp; ✓ Partner status never affects scores
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <a href="#lead-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
                🛡 Get matched safely
              </a>
              <a href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-200 active:scale-[0.98]">
                🧮 Calculate my salary
              </a>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-blue-400">
              <Link href="/agencies"                     className="hover:text-white transition-colors">All agencies</Link>
              <span className="text-blue-800">·</span>
              <Link href="/reviews"                      className="hover:text-white transition-colors">Worker reviews</Link>
              <span className="text-blue-800">·</span>
              <Link href="/tools/real-income-calculator" className="hover:text-white transition-colors">Salary calculator</Link>
              <span className="text-blue-800">·</span>
              <Link href="/tools/payslip-checker"        className="hover:text-white transition-colors">Payslip checker</Link>
              <span className="text-blue-800">·</span>
              <Link href="/methodology"                  className="hover:text-white transition-colors">Methodology</Link>
              <span className="text-blue-800">·</span>
              <Link href="/submit-review"                className="hover:text-white transition-colors">Submit review</Link>
            </nav>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §11  STICKY CTA BAR — always visible on scroll
          ════════════════════════════════════════════════════════════ */}
      <HomepageStickyBar />

    </div>
  );
}
