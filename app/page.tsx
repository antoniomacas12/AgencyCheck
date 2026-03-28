import type { Metadata } from "next";
import Link from "next/link";
import SmartSearch from "@/components/SmartSearch";
import ApplyBar from "@/components/ApplyBar";
import AgencyCard from "@/components/AgencyCard";
import SectionHeader from "@/components/SectionHeader";
import WorkerReviewCard from "@/components/WorkerReviewCard";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import RealSalaryBlock from "@/components/RealSalaryBlock";
import WorkerHousingStrip from "@/components/WorkerHousingStrip";
import PersonalTracker from "@/components/PersonalTracker";
import { AGENCIES, AGENCIES_WITH_HOUSING, AGENCY_MAP } from "@/lib/agencyData";
import { TOP_CITIES, JOB_SALARY_DATA, ISSUE_TYPES } from "@/lib/seoData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";
import { getLatestReviews, REVIEW_SEED_DATA } from "@/lib/reviewData";
import { JOB_LISTINGS, JOB_TYPE_META, getJobCountForAgency, getJobsByAgency } from "@/lib/jobData";
import type { SearchSuggestion } from "@/components/SmartSearch";
import { RANDSTAD_STATS } from "@/lib/randstadData";
import { TEMPO_TEAM_STATS } from "@/lib/tempoTeamData";
import { SEO_JOB_TYPES, SEO_TOP_CITIES } from "@/lib/seoRoutes";
import { getT } from "@/lib/i18n";
import { getLocale } from "@/lib/getLocale";

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
    description: "Real salary breakdowns, real housing photos and worker reviews for 127 employment agencies in the Netherlands. Know the truth before you sign.",
  },
};

const ISSUE_CATEGORIES = [
  { slug: "bad-housing",      icon: "🏚️", label: "Bad housing",        desc: "Overcrowded or substandard accommodation reported by workers" },
  { slug: "late-payment",     icon: "🕐", label: "Late salary",        desc: "Salary delayed beyond agreed payment date" },
  { slug: "missing-overtime", icon: "⏰", label: "Missing overtime",    desc: "Overtime hours worked but not paid or paid incorrectly" },
  { slug: "payslip-problems", icon: "📄", label: "Payslip issues",     desc: "Errors or missing details on wage slips" },
  { slug: "contract-issues",  icon: "📋", label: "Contract problems",  desc: "Confusing or unfair contract terms" },
  { slug: "transport-issues", icon: "🚌", label: "Transport problems", desc: "Transport not provided as promised" },
];

const WORKER_TOOLS = [
  { href: "/tools/real-income-calculator", icon: "🧮", label: "Real Income Calculator", desc: "See your actual take-home after housing and tax deductions", hot: true },
  { href: "/tools/shift-tracker",          icon: "⏱️", label: "Shift Tracker",          desc: "Track hours worked and calculate expected earnings" },
  { href: "/tools/salary-calculator",      icon: "💶", label: "Salary Calculator",      desc: "Convert hourly rate to weekly, monthly and annual income" },
  { href: "/tools/payslip-checker",        icon: "📄", label: "Payslip Checker",        desc: "12-point checklist to verify your payslip is correct" },
];

// ─── Top agencies sorted by live job count ────────────────────────────────────
// Hardcoded job-count anchors for the 4 "top employer" agencies, then
// remaining agencies sorted by job count DESC → reviewCount → name.
const TOP_EMPLOYER_SLUGS = [
  "tempo-team-amsterdam-uitzendbureau",
  "randstad-nederland",
  "otto-workforce",
  "covebo",
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const locale = getLocale();
  const t = await getT(locale);

  // Build job count map for all agencies
  const jobCountMap: Record<string, number> = {};
  for (const agency of AGENCIES) {
    jobCountMap[agency.slug] = getJobCountForAgency(agency.slug);
  }

  // Sort: top employers first (by fixed order), then all others by job count DESC
  const topAgencies = [...AGENCIES].sort((a, b) => {
    const aPriority = TOP_EMPLOYER_SLUGS.indexOf(a.slug);
    const bPriority = TOP_EMPLOYER_SLUGS.indexOf(b.slug);
    if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;
    // Non-featured: sort by job count DESC
    const diff = (jobCountMap[b.slug] ?? 0) - (jobCountMap[a.slug] ?? 0);
    return diff !== 0 ? diff : (b.reviewCount - a.reviewCount);
  }).slice(0, 8);
  const housingAgencies    = AGENCIES_WITH_HOUSING.slice(0, 3);
  const featuredCities     = TOP_CITIES.slice(0, 6);
  const totalAgencies      = AGENCIES.length;
  const housingCount       = AGENCIES_WITH_HOUSING.length;
  const totalReviews       = REVIEW_SEED_DATA.length;
  // Agencies that have < 3 reviews — for "needs reviews" nudge
  const agenciesNeedingReviews = AGENCIES.filter((a) => (a.reviewCount ?? 0) < 3).length;

  // Live jobs from the 4 certified top agencies (shown in dedicated section)
  const randstadJobs  = getJobsByAgency("randstad-nederland").slice(0, 5);
  const tempoTeamJobs = getJobsByAgency("tempo-team-amsterdam-uitzendbureau").slice(0, 5);
  const ottoJobs      = getJobsByAgency("otto-workforce").slice(0, 5);
  const coveboJobs    = getJobsByAgency("covebo").slice(0, 5);

  const CERTIFIED_AGENCIES = [
    {
      slug:    "randstad-nederland",
      name:    "Randstad",
      tier:    "🏆 Platinum",
      jobs:    randstadJobs,
      total:   RANDSTAD_STATS.total,
      href:    "/randstad-jobs",
      housing: false,
      color:   "bg-blue-50 border-blue-100",
      badge:   "bg-blue-100 text-blue-700",
    },
    {
      slug:    "tempo-team-amsterdam-uitzendbureau",
      name:    "Tempo-Team",
      tier:    "🏆 Platinum",
      jobs:    tempoTeamJobs,
      total:   TEMPO_TEAM_STATS.total,
      href:    "/tempo-team-jobs",
      housing: false,
      color:   "bg-orange-50 border-orange-100",
      badge:   "bg-orange-100 text-orange-700",
    },
    {
      slug:    "otto-workforce",
      name:    "Otto Workforce",
      tier:    "🥇 Gold",
      jobs:    ottoJobs,
      total:   getJobCountForAgency("otto-workforce"),
      href:    "/otto-workforce-jobs",
      housing: true,
      color:   "bg-green-50 border-green-100",
      badge:   "bg-green-100 text-green-700",
    },
    {
      slug:    "covebo",
      name:    "Covebo",
      tier:    "🥇 Gold",
      jobs:    coveboJobs,
      total:   getJobCountForAgency("covebo"),
      href:    "/agencies/covebo/jobs",
      housing: true,
      color:   "bg-purple-50 border-purple-100",
      badge:   "bg-purple-100 text-purple-700",
    },
  ];

  // Build autocomplete suggestions for SmartSearch (server-side, passed as prop)
  const searchSuggestions: SearchSuggestion[] = [
    // Agencies
    ...AGENCIES.map((a) => ({
      type: "agency" as const,
      label: a.name,
      sublabel: a.city,
      href: `/agencies/${a.slug}`,
    })),
    // Cities (top cities by population)
    ...TOP_CITIES.map((c) => ({
      type: "city" as const,
      label: c.name,
      sublabel: c.region,
      href: `/cities/${c.slug}`,
    })),
    // Job types
    ...Object.entries(JOB_TYPE_META).map(([slug, meta]) => ({
      type: "job" as const,
      label: meta.title,
      sublabel: "Job type",
      href: `/jobs/${slug}`,
    })),
    // Randstad jobs landing (real scraped data)
    {
      type: "job" as const,
      label: "Randstad Jobs",
      sublabel: `${RANDSTAD_STATS.total} real vacancies from randstad.nl`,
      href: "/randstad-jobs",
    },
    // Tempo-Team jobs landing (real scraped data)
    {
      type: "job" as const,
      label: "Tempo-Team Jobs",
      sublabel: `${TEMPO_TEAM_STATS.total} real vacancies from tempo-team.nl`,
      href: "/tempo-team-jobs",
    },
  ];

  // Latest worker reviews from seed data
  const latestReviews = getLatestReviews(4).map((r, i) => {
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

      {/* ══════════════════════════════════════════
          HERO — Jobs with housing + real salary truth
      ══════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white pt-10 pb-8 px-4">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs font-medium mb-5">
            🇳🇱 {t("homepage.badge", { housingCount: String(housingCount) })}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black leading-tight mb-4">
            <span className="text-green-400">{t("homepage.hero_gross")}</span><br className="hidden sm:block" />
            <span className="text-red-400">{t("homepage.hero_net")}</span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base mb-7 max-w-xl mx-auto leading-relaxed">
            {t("homepage.hero_sub")}
          </p>

          {/* Primary CTAs — housing first, salary second */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-7">
            <Link href="/jobs-with-accommodation"
              className="bg-green-600 hover:bg-green-500 text-white text-sm font-black px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-green-900/40">
              {t("homepage.cta_housing")}
            </Link>
            <Link href="/tools/real-income-calculator"
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-colors border border-white/15">
              {t("homepage.cta_salary")}
            </Link>
          </div>

          <SmartSearch suggestions={searchSuggestions} size="large" />

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {[
              { href: "/jobs-with-accommodation",     label: "🏠 Jobs with housing" },
              { href: "/agencies-with-housing",       label: "🏢 Housing agencies" },
              { href: "/reach-truck-jobs",             label: "🚜 Forklift jobs" },
              { href: "/warehouse-jobs-with-accommodation", label: "🏭 Warehouse jobs" },
              { href: "/work-in-netherlands-for-foreigners", label: "🌍 For foreigners" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="bg-white/8 hover:bg-white/15 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full transition-colors border border-white/8">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION A — GET MATCHED CTA ══════════════════════════════════════
           Replaces: red "Reality Check" banner (duplicate salary message removed)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-800 text-white px-4 py-9 border-y border-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-300 mb-3">
            Looking for work with accommodation in the Netherlands?
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-3 leading-snug">
            Tell us what you&apos;re looking for — we&apos;ll find the match
          </h2>
          <p className="text-brand-200 text-sm mb-7 max-w-md mx-auto leading-relaxed">
            Submit your preferences once. We save your profile and match you with suitable
            jobs and agencies that include housing — then notify you when there&apos;s a fit.
          </p>
          <ApplyBar
            context={{
              sourcePage:  "/",
              sourceType:  "general_apply",
              sourceLabel: "Homepage CTA banner",
              defaultAccommodation: true,
            }}
            ctaText="Find me a job"
            buttonOnly
          />
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-brand-300">
            <span>✓ Free — no fees</span>
            <span>✓ No commitment until you accept</span>
            <span>✓ Your data stays private</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex gap-6 items-start">

          {/* ── Left sidebar: truth-focused nav ── */}
          <aside className="hidden lg:flex flex-col gap-3 w-44 shrink-0 sticky top-4">
            <Link href="/tools/real-income-calculator"
              className="block rounded-xl bg-brand-600 p-3 hover:bg-brand-700 transition-colors text-white">
              <span className="text-2xl block mb-1.5">🧮</span>
              <p className="text-sm font-bold">Real income</p>
              <p className="text-xs text-brand-200 mt-0.5 leading-snug">Find out what you REALLY keep</p>
            </Link>
            {[
              { icon: "🏠", label: "Real housing",   desc: `${housingCount} agencies with rooms`, href: "/agencies-with-housing" },
              { icon: "⭐", label: "Worker reviews", desc: "Anonymous, verified reports",          href: "/reviews" },
              { icon: "⚠️", label: "Bad agencies",   desc: "Worker-reported problems",             href: "/issues/bad-housing" },
              { icon: "📄", label: "Check payslip",  desc: "12-point verification guide",          href: "/tools/payslip-checker" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="card p-3 hover:shadow-md hover:border-brand-100 transition-all block">
                <span className="text-2xl block mb-1.5">{item.icon}</span>
                <p className="text-sm font-bold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
              </Link>
            ))}
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0 space-y-12">

        {/* ══ SECTION B — HOW IT WORKS ═══════════════════════════════════
             Replaces: duplicate €600 vs €243 salary comparison
             (already shown in full in the hero section above)
        ══════════════════════════════════════════════════════════════ */}
        <section>
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600 mb-1">How it works</p>
          <h2 className="text-xl font-black text-gray-900 mb-6 leading-snug">
            Three steps to a job with accommodation
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {/* Step 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="w-9 h-9 rounded-full bg-brand-600 text-white text-sm font-black flex items-center justify-center mb-3">1</div>
              <p className="text-sm font-bold text-gray-900 mb-1.5">Submit your preferences</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Tell us your work type, region, availability, and whether you need accommodation.
                Takes 2 minutes. No commitment.
              </p>
            </div>
            {/* Step 2 */}
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <div className="w-9 h-9 rounded-full bg-brand-600 text-white text-sm font-black flex items-center justify-center mb-3">2</div>
              <p className="text-sm font-bold text-gray-900 mb-1.5">We match your profile</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                We compare your profile against jobs and agencies that include housing. We only
                consider matches that fit your criteria.
              </p>
            </div>
            {/* Step 3 */}
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="w-9 h-9 rounded-full bg-green-600 text-white text-sm font-black flex items-center justify-center mb-3">3</div>
              <p className="text-sm font-bold text-gray-900 mb-1.5">You get notified</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                When a suitable match is found, we contact you directly. You decide whether to
                proceed — no pressure, no fees.
              </p>
            </div>
          </div>
          {/* Inline CTA to trigger the lead form */}
          <div className="bg-gray-900 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white font-bold leading-snug">
                Ready to find your next job?
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Your profile stays private — we never share it without your knowledge.
              </p>
            </div>
            <ApplyBar
              context={{
                sourcePage:  "/",
                sourceType:  "general_apply",
                sourceLabel: "Homepage How it Works inline",
                defaultAccommodation: true,
              }}
              ctaText="Find me a job"
              buttonOnly
            />
          </div>
        </section>

        {/* ══ PERSONAL TRACKER — localStorage wage reality widget ══════ */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">💾 Your personal reality check</span>
            <span className="text-[9px] font-bold uppercase tracking-widest bg-green-100 text-green-700 rounded-full px-2 py-0.5">Saved on your device</span>
          </div>
          <PersonalTracker />
        </section>

        {/* ══ REAL SALARY BLOCK — full breakdown ══════════════════════ */}
        <section>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-900 text-gray-400 rounded-full px-2.5 py-1">📊 Illustrative estimate</span>
            <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-900 text-gray-400 rounded-full px-2.5 py-1">🚫 Not agency advertising</span>
            <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-900 text-gray-400 rounded-full px-2.5 py-1">👷 Worker-reported deductions</span>
          </div>
          <RealSalaryBlock />
        </section>

        {/* ══ REAL HOUSING FROM WORKERS ════════════════════════════════ */}
        <section>
          <WorkerHousingStrip />
        </section>

        {/* ══ Live jobs from top agencies ══════════════════════════════ */}
        <section>
          <SectionHeader
            title="Live Jobs from Top Agencies"
            subtitle="Verified listings from the Netherlands' largest employers — Randstad, Tempo-Team, Otto Workforce & Covebo"
            action={
              <Link href="/jobs-in-netherlands" className="text-sm text-brand-600 font-medium hover:underline">
                All jobs →
              </Link>
            }
          />

          {/* ✅ Certified ribbon */}
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-brand-50 border border-brand-100 rounded-xl text-xs text-brand-700">
            <span className="font-bold text-brand-800">✅ Certified listings</span>
            <span className="text-brand-500">·</span>
            <span>These agencies are ABU-registered and among the top employers in the Netherlands. Listings are imported directly from their databases.</span>
          </div>

          <div className="space-y-4">
            {CERTIFIED_AGENCIES.map((agency) => (
              <div key={agency.slug} className={`rounded-xl border ${agency.color} overflow-hidden`}>

                {/* Agency header row */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/60">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${agency.badge}`}>
                      {agency.tier}
                    </span>
                    <p className="font-bold text-sm text-gray-900">{agency.name}</p>
                    {agency.housing && (
                      <span className="text-[10px] bg-green-100 text-green-700 rounded-full px-1.5 py-0.5 font-semibold">🏠 Housing</span>
                    )}
                    <span className="text-xs text-gray-500 font-medium">{agency.total} active jobs</span>
                  </div>
                  <Link
                    href={agency.href}
                    className="text-xs font-semibold text-brand-600 hover:underline whitespace-nowrap"
                  >
                    View all →
                  </Link>
                </div>

                {/* Job rows — weekly take-home FIRST */}
                <div className="divide-y divide-white/30">
                  {agency.jobs.length > 0 ? (
                    agency.jobs.map((job) => {
                      const salaryValid = job.salaryMin >= WML_HOURLY_2026;
                      const grossWkly   = Math.round(job.salaryMax * 40);
                      const tax         = Math.round(grossWkly * 0.22);
                      const housingDed  = job.housing === "YES" ? 140 : 0;
                      const keepMin     = Math.round(job.salaryMin * 40 * 0.78) - housingDed;
                      const keepMax     = Math.round(job.salaryMax * 40 * 0.78) - housingDed;
                      return (
                        <Link
                          key={job.id}
                          href={`/jobs/${job.slug}`}
                          className="flex items-center gap-3 px-4 py-3 bg-white/60 hover:bg-white/90 transition-colors"
                        >
                          <span className="text-base shrink-0">{job.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{job.title}</p>
                            <p className="text-[10px] text-gray-500">📍 {job.city}{job.housing === "YES" ? " · 🏠 housing" : ""}</p>
                          </div>
                          {salaryValid && (
                            <div className="shrink-0 text-right bg-green-600 rounded-lg px-2.5 py-1.5">
                              <p className="text-[8px] font-bold uppercase tracking-widest text-green-200 leading-none mb-0.5">You keep</p>
                              <p className="text-sm font-black text-white leading-none">
                                €{keepMin}–€{keepMax}
                                <span className="font-normal text-green-200 text-[9px]">/wk</span>
                              </p>
                            </div>
                          )}
                          <span className="text-[10px] text-gray-400 shrink-0">→</span>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 bg-white/50 text-xs text-gray-400 italic">
                      No listings loaded yet — visit the agency page for full job list.
                    </div>
                  )}
                </div>

                {/* Footer CTA */}
                <div className="px-4 py-2.5 bg-white/30">
                  <Link
                    href={agency.href}
                    className="text-xs font-semibold text-brand-700 hover:text-brand-800"
                  >
                    See all {agency.total} {agency.name} jobs →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ Jobs with accommodation — first visible section ══════════ */}
        <section>
          <SectionHeader
            title={t("jobs.heading")}
            subtitle="Available positions where the agency provides housing — gross hourly pay shown"
            action={
              <Link href="/agencies-with-housing" className="text-sm text-brand-600 font-medium hover:underline">
                All housing agencies →
              </Link>
            }
          />
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
            {JOB_LISTINGS.filter((j) => j.housing === "YES" && j.isActive).slice(0, 8).map((job) => {
              const salaryValid = job.salaryMin >= WML_HOURLY_2026;
              const keepMin = salaryValid ? Math.round(job.salaryMin * 40 * 0.78) - 140 : null;
              const keepMax = salaryValid ? Math.round(job.salaryMax * 40 * 0.78) - 140 : null;
              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug}`}
                  className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl shrink-0">{job.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{job.title}</p>
                    <p className="text-xs text-gray-500 truncate">{job.agencyName} · 📍 {job.city}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {keepMin !== null && keepMax !== null ? (
                      <div className="bg-green-600 rounded-lg px-2.5 py-1.5 text-right">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-green-200 leading-none mb-0.5">You keep</p>
                        <p className="text-sm font-black text-white leading-none">€{keepMin}–€{keepMax}<span className="font-normal text-green-200 text-[9px]">/wk</span></p>
                        <p className="text-[8px] text-green-300 mt-0.5">after housing + tax</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">Salary on request</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-3">
            <Link href="/jobs-with-accommodation" className="text-sm text-brand-600 hover:underline">
              View all jobs with accommodation →
            </Link>
          </div>
        </section>

        {/* ══ Agencies with housing ════════════════════════════════════ */}
        <section>
          <SectionHeader
            title={t("housing.section_title")}
            subtitle={`${housingCount} agencies that include accommodation — verified from official sources`}
            action={
              <Link href="/agencies-with-housing" className="text-sm text-brand-600 font-medium hover:underline">
                See all {housingCount} →
              </Link>
            }
          />
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4 text-xs text-amber-800">
            ℹ️ Always confirm housing terms directly with the agency before starting work.
            Ask: What is the weekly deduction? How many people per room?
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {housingAgencies.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
          {housingAgencies.length < housingCount && (
            <div className="text-center mt-4">
              <Link href="/agencies-with-housing" className="text-sm text-brand-600 hover:underline">
                + {housingCount - housingAgencies.length} more agencies with housing →
              </Link>
            </div>
          )}
        </section>

        {/* ══ Top agencies with most jobs ════════════════════════════ */}
        <section>
          <SectionHeader
            title={t("agencies.heading")}
            subtitle="Agencies with the highest number of active vacancies — sorted by job count"
            action={
              <Link href="/agencies" className="text-sm text-brand-600 font-medium hover:underline">
                All {totalAgencies} agencies →
              </Link>
            }
          />

          {/* Featured top 4 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            {[
              {
                slug:    "tempo-team-amsterdam-uitzendbureau",
                name:    "Tempo-Team",
                jobs:    TEMPO_TEAM_STATS.total,
                housing: false,
                tier:    "🏆 Platinum",
                href:    "/tempo-team-jobs",
              },
              {
                slug:    "randstad-nederland",
                name:    "Randstad",
                jobs:    RANDSTAD_STATS.total,
                housing: false,
                tier:    "🏆 Platinum",
                href:    "/randstad-jobs",
              },
              {
                slug:    "covebo",
                name:    "Covebo",
                jobs:    getJobCountForAgency("covebo"),
                housing: true,
                tier:    "🥇 Gold",
                href:    "/agencies/covebo",
              },
              {
                slug:    "otto-workforce",
                name:    "Otto Workforce",
                jobs:    getJobCountForAgency("otto-workforce"),
                housing: true,
                tier:    "🥇 Gold",
                href:    "/otto-workforce-jobs",
              },
            ].map((agency) => (
              <Link key={agency.slug} href={agency.href} className="block group">
                <div className="card p-4 hover:shadow-md hover:border-brand-100 transition-all duration-200 group-hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <p className="font-bold text-sm text-gray-900 group-hover:text-brand-600">{agency.name}</p>
                    <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-1.5 py-0.5 shrink-0">
                      {agency.tier}
                    </span>
                  </div>
                  <p className="text-xl font-extrabold text-brand-700">{agency.jobs}</p>
                  <p className="text-xs text-gray-500 mb-2">active jobs</p>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-[10px] bg-brand-50 text-brand-700 rounded-full px-2 py-0.5 font-semibold">🏆 Top employer</span>
                    {agency.housing && (
                      <span className="text-[10px] bg-green-50 text-green-700 rounded-full px-2 py-0.5 font-semibold">🏠 Housing</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Rest of top 8 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topAgencies.slice(4).map((agency) => (
              <AgencyCard
                key={agency.id}
                agency={agency}
                jobCount={jobCountMap[agency.slug]}
              />
            ))}
          </div>
        </section>

        {/* ══ Job type landing pages ════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="Find Jobs by Type — Netherlands"
            subtitle="Dedicated pages for every major job type with real salary data and city listings"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SEO_JOB_TYPES.map((jt) => (
              <Link
                key={jt.prefix}
                href={`/${jt.prefix}-jobs-netherlands`}
                className="card p-3 text-center hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5 block"
              >
                <span className="text-3xl block mb-1.5">{jt.icon}</span>
                <p className="text-xs font-semibold text-gray-800 leading-snug">{jt.label}</p>
                <p className="text-[10px] text-brand-600 mt-0.5">€{jt.avgSalary}/hr avg</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ══ City job pages grid ═══════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="Jobs by City"
            subtitle="Find work in your preferred Dutch city — jobs, agencies, and salary data per city"
            action={
              <Link href="/jobs-in-netherlands" className="text-sm text-brand-600 font-medium hover:underline">
                All cities →
              </Link>
            }
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
            {SEO_TOP_CITIES.slice(0, 8).map((city) => (
              <Link
                key={city.slug}
                href={`/jobs-in-${city.slug}`}
                className="card p-3 hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5 block"
              >
                <p className="font-bold text-sm text-gray-900">📍 {city.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{city.region}</p>
                <p className="text-xs text-brand-600 font-medium mt-2">View jobs →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ══ Community impact counter ══════════════════════════════════ */}
        <section>
          <div className="bg-gradient-to-r from-brand-700 to-brand-800 rounded-2xl p-5 text-white">
            <p className="text-xs font-semibold text-brand-200 uppercase tracking-wider mb-3">Community impact</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { value: totalReviews,            label: "Worker reviews",        icon: "⭐" },
                { value: housingCount,             label: "Housing agencies",      icon: "🏠" },
                { value: agenciesNeedingReviews,   label: "Agencies need reviews", icon: "✍️" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl mb-0.5">{stat.icon}</p>
                  <p className="text-xl font-black text-white">{stat.value}</p>
                  <p className="text-[10px] text-brand-200 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
            {/* Live activity ticker */}
            <div className="bg-white/10 rounded-xl px-3 py-2">
              <LiveActivityFeed variant="ticker" maxItems={8} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/agencies"
                className="text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors">
                {t("common.see_all_agencies")} →
              </Link>
              <Link href="/reviews"
                className="text-xs font-semibold bg-white text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors">
                ✍️ Share your experience
              </Link>
            </div>
          </div>
        </section>

        {/* ══ Latest worker reviews ════════════════════════════════════ */}
        <section>
          <SectionHeader
            title={t("homepage.reviews_section")}
            subtitle="Recent experiences shared by agency workers in the Netherlands"
            action={
              <Link href="/reviews" className="text-sm text-brand-600 font-medium hover:underline">
                All reviews →
              </Link>
            }
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {latestReviews.map(({ review, agencySlug, agencyName }) => (
              <div key={review.id} className="flex flex-col gap-1">
                <Link
                  href={`/agencies/${agencySlug}/reviews`}
                  className="text-xs font-semibold text-brand-600 hover:underline px-1"
                >
                  {agencyName} →
                </Link>
                <WorkerReviewCard review={review} />
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link href="/reviews" className="text-sm text-brand-600 hover:underline">
              {t("reviews.heading")} →
            </Link>
          </div>
        </section>

        {/* ══ Jobs by city with housing ════════════════════════════════ */}
        <section>
          <SectionHeader
            title="Jobs with Accommodation — By City"
            subtitle="Find agencies that include housing in major Dutch cities"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {featuredCities.map((city) => {
              const cityAgencies = AGENCIES.filter((a) =>
                a.cities.some((c) => c.toLowerCase() === city.name.toLowerCase())
              );
              const withHousing = cityAgencies.filter((a) => a.housing === "YES").length;
              return (
                <Link key={city.slug} href={`/cities/${city.slug}`}
                  className="card p-4 hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5 block">
                  <p className="font-bold text-gray-900 text-sm">📍 {city.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{city.region}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-600">{cityAgencies.length} agencies</p>
                    {withHousing > 0 && (
                      <p className="text-xs text-green-600 font-medium">{withHousing} with housing</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ══ Gross vs real salary comparison table ════════════════════ */}
        <section>
          <SectionHeader
            title="Gross pay vs. what you actually keep"
            subtitle={`WML 2026: €${WML_HOURLY_2026}/hr. Every rate below includes housing deduction scenario.`}
          />
          <div className="rounded-xl overflow-hidden border border-gray-200">
            {/* Table header */}
            <div className="grid grid-cols-4 bg-gray-900 text-white text-xs font-bold px-4 py-2.5 gap-2">
              <p>Hourly rate</p>
              <p className="text-center">Gross/week</p>
              <p className="text-center text-red-300">−Housing €140</p>
              <p className="text-right text-brand-300">You keep</p>
            </div>
            {(() => {
              const hoursPerWeek = 40;
              const housingDeduction = 140;
              const taxRate = (rate: number) => {
                const wkly = rate * hoursPerWeek;
                return wkly < 560 ? 0.12 : wkly < 720 ? 0.18 : wkly < 900 ? 0.22 : 0.27;
              };
              return [
                { rate: WML_HOURLY_2026, label: "Min. wage (WML)", warn: true },
                { rate: 14.50,           label: "Typical agency" },
                { rate: 15.50,           label: "Above average" },
                { rate: 17.00,           label: "Skilled worker" },
              ].map((s) => {
                const gross  = Math.round(s.rate * hoursPerWeek);
                const tax    = Math.round(gross * taxRate(s.rate));
                const net    = gross - tax - housingDeduction;
                return (
                  <div key={s.rate} className={`grid grid-cols-4 gap-2 px-4 py-3 border-b border-gray-100 last:border-0 ${s.warn ? "bg-orange-50" : "bg-white"}`}>
                    <div>
                      <p className="text-sm font-bold text-gray-900">€{s.rate}/hr</p>
                      <p className="text-[10px] text-gray-400">{s.label}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-700 text-center self-center">€{gross}</p>
                    <p className="text-sm font-medium text-red-500 text-center self-center">−€{housingDeduction + tax}</p>
                    <p className="text-base font-black text-brand-700 text-right self-center">€{net}</p>
                  </div>
                );
              });
            })()}
            <div className="bg-gray-50 px-4 py-3 text-xs text-gray-500">
              * Estimates based on 40hrs/week, €140/week housing deduction, Dutch 2026 tax brackets. Actual amounts vary.
            </div>
          </div>
          <div className="mt-3">
            <Link href="/tools/real-income-calculator"
              className="block w-full text-center bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold py-3.5 rounded-xl transition-colors">
              🧮 Enter YOUR rate — see YOUR real number →
            </Link>
          </div>
        </section>

        {/* ══ Worker tools ═════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="Worker Tools"
            subtitle="Free tools to help you understand your pay, track shifts, and protect your rights"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {WORKER_TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5 flex items-start gap-3">
                <span className="text-3xl shrink-0">{tool.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">{tool.label}</p>
                    {tool.hot && (
                      <span className="text-[10px] font-bold bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full">
                        Most useful
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══ Common worker issues ═════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="Common Worker Issues"
            subtitle="Know your rights — these problems are frequently reported by agency workers"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ISSUE_CATEGORIES.map((issue) => (
              <Link key={issue.slug} href={`/issues/${issue.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5 block">
                <span className="text-2xl block mb-2">{issue.icon}</span>
                <p className="text-sm font-bold text-gray-900">{issue.label}</p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">{issue.desc}</p>
                <p className="text-xs text-brand-600 mt-2 font-medium">Know your rights →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ══ Salary data preview ═══════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="Salary Data by Job"
            subtitle="Gross hourly pay ranges reported for agency workers in the Netherlands"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(JOB_SALARY_DATA).slice(0, 4).map(([slug, job]) => (
              <Link key={slug} href={`/salary/${slug}-netherlands`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5 block">
                <p className="text-xs text-gray-400 mb-1">{job.description}</p>
                <p className="text-sm font-bold text-gray-900">{job.label ?? slug}</p>
                <p className="text-base font-extrabold text-brand-700 mt-1">
                  €{Math.max(job.min, WML_HOURLY_2026).toFixed(2)}–€{job.max}/hr
                </p>
                <p className="text-xs text-gray-400 mt-1">gross · avg €{job.avg}/hr</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link href="/salary/order-picker-netherlands" className="text-sm text-brand-600 hover:underline">
              View all salary data →
            </Link>
          </div>
        </section>

        {/* ══ Platform explanation ═════════════════════════════════════ */}
        <section>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-700 rounded-full px-2.5 py-1">📊 Based on real worker data</span>
              <span className="text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-600 rounded-full px-2.5 py-1">🚫 Not agency advertising</span>
              <span className="text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 rounded-full px-2.5 py-1">👷 Reported by workers</span>
              <span className="text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">✅ Independent platform</span>
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-3">About AgencyCheck</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600 leading-relaxed">
              <p>
                AgencyCheck is an independent worker transparency platform. We help workers in the Netherlands
                understand their rights, compare agencies, and make informed decisions before starting work.
              </p>
              <p>
                Our agency data comes from the official ABU (employment agency federation) member register.
                Housing, transport, and salary data is supplemented with worker-reported experiences.
              </p>
              <p>
                We do not charge agencies for listings. We are not affiliated with any employment agency.
                Our goal is to help workers, not agencies. All data is clearly labeled by source and verification status.
              </p>
            </div>
          </div>
        </section>

          </div>{/* end main content */}
        </div>{/* end flex sidebar+main */}
      </div>{/* end max-w-6xl */}
    </div>
  );
}
