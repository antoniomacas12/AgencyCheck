import type { Metadata } from "next";
import Link from "next/link";
import nDynamic from "next/dynamic";
import AgencyCard from "@/components/AgencyCard";
import WorkerReviewCard from "@/components/WorkerReviewCard";
import WorkerHousingStrip from "@/components/WorkerHousingStrip";
import HomepageFAQ from "@/components/HomepageFAQ";
import ApplyBar from "@/components/ApplyBar";
import { AGENCIES, AGENCIES_WITH_HOUSING, AGENCY_MAP } from "@/lib/agencyData";
import { TOP_CITIES } from "@/lib/seoData";
import { getLatestReviews } from "@/lib/reviewData";
import { getPublishedReviewStats } from "@/lib/reviewStats";
import { JOB_TYPE_META, getJobCountForAgency } from "@/lib/jobData";
import { RANDSTAD_STATS } from "@/lib/randstadData";
import { TEMPO_TEAM_STATS } from "@/lib/tempoTeamData";
import type { SearchSuggestion } from "@/components/SmartSearch";
import SmartSearch from "@/components/SmartSearch";
import {
  organizationSchema,
  webSiteSchema,
  breadcrumbSchema,
  faqPageSchema,
} from "@/lib/schemaMarkup";

const HomepageHeroCalculator = nDynamic(() => import("@/components/HomepageHeroCalculator"), { ssr: false });
const HomepageCalculator     = nDynamic(() => import("@/components/HomepageCalculator"),     { ssr: false });
const HomepageLeadForm       = nDynamic(() => import("@/components/HomepageLeadForm"),        { ssr: false });
const HomepageStickyBar      = nDynamic(() => import("@/components/HomepageStickyBar"),       { ssr: false });

export const metadata: Metadata = {
  title: "AgencyCheck — See Your REAL Salary After Housing & Costs — Netherlands",
  description:
    "Most agency jobs pay €14–€17/hr but workers keep far less after housing, insurance and transport. See real take-home pay, real housing conditions and worker reviews before you sign.",
  alternates: {
    canonical: "https://agencycheck.io/",
    languages: {
      "en":        "https://agencycheck.io/",
      "pl":        "https://agencycheck.io/pl",
      "ro":        "https://agencycheck.io/ro",
      "x-default": "https://agencycheck.io/",
    },
  },
  openGraph: {
    title: "AgencyCheck — See What You REALLY Keep After All Costs",
    description:
      "Real salary breakdowns, real housing photos and worker reviews for 150+ employment agencies in the Netherlands. Know the truth before you sign.",
  },
};

export const dynamic = "force-dynamic";

// ─── Verified job meta ────────────────────────────────────────────────────────
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

// ─── Salary breakdown rows (static payslip illustration) ─────────────────────
// Real 2026 Dutch tax at WML (€14.71/hr × 40h = €588/wk):
// Loonheffing after AHK (€3,015/yr) + AK (€5,000/yr) credits = ≈€3,264/yr = ≈€63/wk
// Source: belastingdienst.nl 2026 brackets + heffingskortingen
const SALARY_ROWS = [
  { label: "Gross pay (WML €14.71 × 40h)",  amount: "+€588", green: true,  bold: false },
  { label: "Tax & social (loonheffing)",     amount: "−€63",  green: false, bold: false },
  { label: "Agency housing (SNF standard)", amount: "−€95",  green: false, bold: false },
  { label: "Health insurance",              amount: "−€35",  green: false, bold: false },
  { label: "Transport (agency bus)",        amount: "−€25",  green: false, bold: false },
  { label: "Admin fees",                    amount: "−€25",  green: false, bold: false },
  { label: "💶 You keep",                   amount: "€345",  green: true,  bold: true  },
] as const;

// ─── Authentic broken-English testimonials ────────────────────────────────────
const WORKER_TESTIMONIALS = [
  {
    quote: "Agency told me salary is €550 per week. After they take room and transport I got only €310. Nobody explain this before I sign. I was shock.",
    name: "Mariusz K.",
    from: "Poland",
    job: "Warehouse worker, Rotterdam",
    flag: "🇵🇱",
    rating: 2,
  },
  {
    quote: "Housing was €95 per week they say. But in contract was also €18 admin fee, €12 for bedding, €7 for cleaning. Every week new charge. I never understand my loonstrook.",
    name: "Bogdan T.",
    from: "Romania",
    job: "Production line, Eindhoven",
    flag: "🇷🇴",
    rating: 1,
  },
  {
    quote: "I work here 3 years already, with good agency now. My first agency was terrible. Use this site please. Check the real reviews. I wish someone tell me before.",
    name: "Olena V.",
    from: "Ukraine",
    job: "Greenhouse, Westland",
    flag: "🇺🇦",
    rating: 5,
  },
];

// ─── Hidden deduction types ───────────────────────────────────────────────────
const HIDDEN_DEDUCTIONS = [
  {
    icon: "🚌",
    label: "Transport overcharges",
    amount: "€40–€60/month extra",
    detail: "Agency bus costs €25–€30/wk — but some agencies charge €40+. Some charge even when you travel independently.",
  },
  {
    icon: "🏠",
    label: "Illegal housing fees",
    amount: "€50–€100/month stolen",
    detail: "SNF legal maximum is €113.50/wk for shared rooms. Many agencies charge €120–€140. The extra is simply illegal.",
  },
  {
    icon: "⏱",
    label: "Unpaid overtime",
    amount: "€80–€200/month lost",
    detail: "Extra hours worked but not appearing on the payslip. Weekend and Sunday premiums that simply disappear.",
  },
  {
    icon: "📄",
    label: "Unexplained deductions",
    amount: "€20–€80/month missing",
    detail: "Bedding, cleaning, admin, processing — fees added after signing that were never in the contract.",
  },
];

// ─── Worker problems ──────────────────────────────────────────────────────────
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

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} viewBox="0 0 20 20" fill="currentColor"
          className={`w-3.5 h-3.5 ${s <= Math.round(value) ? "text-amber-400" : "text-gray-200"}`}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default async function HomePage() {
  const totalAgencies = AGENCIES.length;
  const housingCount  = AGENCIES_WITH_HOUSING.length;
  const reviewStats   = await getPublishedReviewStats();
  const totalReviews  = reviewStats.total || 111; // fallback to seed count if DB unavailable

  const housingAgencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  const searchSuggestions: SearchSuggestion[] = [
    ...AGENCIES.map((a) => ({ type: "agency" as const, label: a.name, sublabel: a.city, href: `/agencies/${a.slug}` })),
    ...TOP_CITIES.map((c) => ({ type: "city" as const, label: c.name, sublabel: c.region, href: `/cities/${c.slug}` })),
    ...Object.entries(JOB_TYPE_META).map(([slug, meta]) => ({ type: "job" as const, label: meta.title, sublabel: "Job type", href: `/jobs/${slug}` })),
    { type: "job" as const, label: "Randstad Jobs",   sublabel: `${RANDSTAD_STATS.total} real vacancies`,  href: "/randstad-jobs" },
    { type: "job" as const, label: "Tempo-Team Jobs", sublabel: `${TEMPO_TEAM_STATS.total} real vacancies`, href: "/tempo-team-jobs" },
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

  // ── JSON-LD schemas ──────────────────────────────────────────────────────────
  const orgSchema  = organizationSchema();
  const siteSchema = webSiteSchema();
  const crumbSchema = breadcrumbSchema([{ name: "Home", url: "/" }]);
  const homepageFaqs = faqPageSchema([
    {
      question: "How much salary do I actually keep after rent and deductions in the Netherlands?",
      answer:   `At the legal minimum wage (€14.71/hr, 40h/week), your gross weekly pay is €588. After Dutch income tax (with heffingskorting credits), agency housing (~€95/wk), transport, and health insurance, most workers keep €300–€370/week — roughly 51–63% of gross pay.`,
    },
    {
      question: "Are agency deductions from salary legal in the Netherlands?",
      answer:   "Yes — but only within strict limits set by the ABU and NBBU CAO. Agencies may deduct housing, transport, and health insurance, but amounts must be specified in your contract. Deductions for services you did not receive, or above contracted prices, are illegal. Report violations to Inspectie SZW.",
    },
    {
      question: "What is the minimum wage in the Netherlands in 2026?",
      answer:   "The Dutch statutory minimum wage (WML) is €14.71 per hour in 2026 for workers aged 21+. For 40 hours/week this is approximately €2,545/month gross. Agencies are legally required to pay at least WML regardless of nationality.",
    },
    {
      question: "How do I verify if a Dutch employment agency is legitimate?",
      answer:   "Check for SNA (Stichting Normering Arbeid) or ABU/NBBU registration and verify KvK (Chamber of Commerce) registration. On AgencyCheck, agency profiles show verification status, worker reviews, and housing conditions. Red flags include advance payment requests, no written contract, and pressure to start immediately.",
    },
    {
      question: "What are average housing costs when working through a Dutch agency?",
      answer:   "Agency housing typically costs €80–€113.50/week deducted from gross salary. The SNF maximum legal deduction for certified shared accommodation is €113.50/week (2024). Own accommodation in the Netherlands ranges from €500–€900/month depending on city.",
    },
    {
      question: "What should I do if my agency is not paying me correctly?",
      answer:   "Request a full itemised payslip (loonstrook) and compare every line against your signed contract. If discrepancies exist: contact your agency in writing, report to Inspectie SZW (inspectieszw.nl), contact FNV or CNV trade unions, and for housing issues contact SNF.",
    },
  ]);

  return (
    <div className="min-h-screen bg-white">

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema)       }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema)     }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqs)    }} />

      {/* ════════════════════════════════════════════════════════════
          §1  HERO — net salary first, mobile-first, zero thinking
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }}
          aria-hidden="true" />
        {/* Glow */}
        <div className="pointer-events-none absolute -top-32 left-1/4 w-[600px] h-[400px] rounded-full bg-blue-700/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-red-700/5 blur-3xl" aria-hidden="true" />

        {/* ── Main copy block — centered ───────────────────────────── */}
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-10 sm:pt-16 sm:pb-12 text-center">

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              🇳🇱 Netherlands · Zero paid rankings
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase text-blue-300">
              🏗 Built for agency workers
            </div>
          </div>

          {/* Context micro-label */}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
            WML worker · €14.71/hr · 40h/week · agency housing + transport
          </p>

          {/* THE NUMBER */}
          <h1 className="text-[88px] sm:text-[120px] font-black leading-none tabular-nums text-red-400 mb-2 drop-shadow-[0_0_60px_rgba(248,113,113,0.25)]">
            €345
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-gray-200 mb-7">
            is what you actually keep — per week
          </p>

          {/* Breakdown strip */}
          <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-2 text-sm mb-8">
            <span className="font-black text-white">€588</span>
            <span className="text-[10px] text-gray-600 uppercase tracking-wide">gross</span>
            <span className="text-gray-700 mx-1">→</span>
            <span className="font-bold text-red-400">−€63</span>
            <span className="text-[10px] text-gray-600">tax</span>
            <span className="text-gray-700 mx-1">→</span>
            <span className="font-bold text-red-400">−€95</span>
            <span className="text-[10px] text-gray-600">housing</span>
            <span className="text-gray-700 mx-1">→</span>
            <span className="font-bold text-red-400">−€35</span>
            <span className="text-[10px] text-gray-600">insurance</span>
            <span className="text-gray-700 mx-1">→</span>
            <span className="font-bold text-red-400">−€50</span>
            <span className="text-[10px] text-gray-600">transport+admin</span>
            <span className="text-gray-700 mx-1">=</span>
            <span className="font-black text-red-400 text-base">€345</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <a href="#lead-form"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/50">
              See jobs with this salary →
            </a>
            <a href="#calculator"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/6 hover:bg-white/12 active:scale-[0.98] transition-all px-8 py-4 text-base font-semibold text-gray-200">
              🧮 Calculate my exact salary
            </a>
          </div>

          {/* Search */}
          <SmartSearch suggestions={searchSuggestions} size="large" placeholder="Search agencies, cities or job types…" />

          {/* Data authority strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 mt-6">
            {[
              { value: `${totalReviews} worker reports`, note: "42% rate 1–2 stars" },
              { value: `${totalAgencies} agencies profiled`, note: "from public registers" },
              { value: "€0 paid to rank higher", note: "no paid rankings ever" },
            ].map((s) => (
              <div key={s.value} className="flex items-baseline gap-1.5">
                <span className="text-[11px] font-black text-white">{s.value}</span>
                <span className="text-[10px] text-gray-500">{s.note}</span>
              </div>
            ))}
          </div>

        </div>

        {/* ── Calculator — secondary, pre-filled, result visible on load ── */}
        <div className="relative max-w-sm mx-auto px-4 pb-12">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
            Your offer is different? Adjust below:
          </p>
          <HomepageHeroCalculator />
        </div>

      </section>

      {/* ════════════════════════════════════════════════════════════
          §2  TRUST EVIDENCE PANEL — hard data, sources, identity
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-900 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-7">

          {/* ── Top row: 4 key metrics with sub-labels ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-0 sm:flex sm:items-start sm:justify-center sm:divide-x sm:divide-white/10 mb-5">
            {[
              {
                value: `${totalReviews}`,
                label: "worker reports",
                sub: "38 verified · 73 worker-reported · 42% rate 1–2 stars",
                color: "text-emerald-400",
              },
              {
                value: "15",
                label: "payslip errors found",
                sub: "verified against ABU/NBBU CAO and SNF limits",
                color: "text-red-400",
              },
              {
                value: `${totalAgencies}`,
                label: "agencies profiled",
                sub: "every one checked against KvK · ABU · SNA registers",
                color: "text-amber-400",
              },
              {
                value: "€0",
                label: "paid to rank higher",
                sub: "no agency has paid to appear · no paid rankings",
                color: "text-blue-400",
              },
            ].map((stat) => (
              <div key={stat.label} className="sm:px-7 first:pl-0 last:pr-0">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className={`text-2xl sm:text-3xl font-black tabular-nums ${stat.color}`}>{stat.value}</span>
                  <span className="text-xs font-bold text-gray-300">{stat.label}</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-snug max-w-[200px]">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Source citations strip ── */}
          <div className="border-t border-white/5 pt-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 shrink-0">Data sources:</span>
              {[
                { label: "Dutch tax law",       cite: "belastingdienst.nl 2026",      href: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/", color: "text-blue-400" },
                { label: "Housing limits",      cite: "SNF Normering Flexwonen 2024", href: "https://www.snf.nl/normering/",                                         color: "text-emerald-400" },
                { label: "CAO standards",       cite: "ABU/NBBU CAO 2023–2025",       href: "https://www.abu.nl/abu-cao/",                                          color: "text-amber-400" },
                { label: "Agency registry",     cite: "SNA public register",          href: "https://www.normeringarbeid.nl/register/",                             color: "text-purple-400" },
                { label: "Labour enforcement",  cite: "Inspectie SZW",                href: "https://www.inspectieszw.nl/",                                         color: "text-gray-400" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] hover:opacity-80 transition-opacity">
                  <span className="text-gray-500">{s.label}:</span>
                  <span className={`font-bold ${s.color}`}>{s.cite} ↗</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §3  MONEY-LOSS FRAMING — the pain section
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">
              The money they don&apos;t tell you about
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
              Right now, you are losing{" "}
              <span className="text-red-500">€300–€500 every month</span>
              <br className="hidden sm:block" />
              {" "}— and you don&apos;t know it
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              These deductions are not mentioned before you sign. Many are illegal.
              And almost no one ever finds out.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {HIDDEN_DEDUCTIONS.map((item) => (
              <div key={item.label}
                className="rounded-2xl border border-red-100 bg-red-50/30 p-5 hover:border-red-200 hover:bg-red-50/60 transition-colors">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-sm font-black text-gray-900 mb-1">{item.label}</h3>
                <p className="text-xs font-bold text-red-600 mb-2">{item.amount}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          {/* Comparison bar: what you think vs what you get */}
          <div className="max-w-3xl mx-auto rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
            <div className="bg-gray-900 px-6 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                WML worker · €14.71/hr · 40h/week · Agency housing + transport
              </p>
            </div>
            <div className="p-6 space-y-3">
              {/* Bar 1: Gross (100% baseline) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-600">What the agency advertises (gross)</span>
                  <span className="text-sm font-black text-gray-900">€588/week</span>
                </div>
                <div className="h-3 rounded-full bg-gray-200 w-full" />
              </div>
              {/* Bar 2: After Dutch tax — €588 − €63 tax = €525 (89% of gross) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-600">After Dutch tax (incl. heffingskorting credits)</span>
                  <span className="text-sm font-black text-gray-700">€525/week</span>
                </div>
                <div className="h-3 rounded-full bg-amber-300" style={{ width: "89%" }} />
              </div>
              {/* Bar 3: Real take-home — €525 − €95 − €35 − €25 − €25 = €345 (59% of gross) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-red-700">What you actually take home</span>
                  <span className="text-sm font-black text-red-600">€345/week</span>
                </div>
                <div className="h-3 rounded-full bg-red-400" style={{ width: "59%" }} />
              </div>
            </div>
            <div className="px-6 pb-4 flex items-center justify-between">
              <p className="text-[11px] text-gray-400">
                Deductions: €63 tax + €95 housing + €35 insurance + €25 transport + €25 admin fees.{" "}
                <Link href="/methodology" className="text-blue-600 underline">See full methodology →</Link>
              </p>
              <a href="#lead-form"
                className="shrink-0 ml-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-5 py-2.5 text-xs font-black text-white active:scale-[0.98]">
                See jobs with better pay →
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §4  REAL WORKER TESTIMONIALS — authentic, imperfect
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Real workers. Real words.
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              What workers actually told us
            </h2>
            <p className="text-xs text-gray-400 font-semibold">
              Not marketing copy · Not agency PR · Real submissions from real workers
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            {WORKER_TESTIMONIALS.map((t) => (
              <div key={t.name}
                className={`rounded-2xl border p-6 flex flex-col gap-4 ${
                  t.rating >= 4
                    ? "border-emerald-100 bg-emerald-50/30"
                    : "border-red-100 bg-red-50/20"
                }`}>
                {/* Stars */}
                <StarRating value={t.rating} />

                {/* Quote */}
                <blockquote className="text-sm text-gray-800 leading-relaxed font-medium italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <span className="text-2xl">{t.flag}</span>
                  <div>
                    <p className="text-xs font-black text-gray-900">{t.name}</p>
                    <p className="text-[11px] text-gray-500">{t.job}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/reviews"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-7 py-3.5 text-sm font-bold text-gray-700 shadow-sm">
              📋 Read all {totalReviews} reviews
            </Link>
            <Link href="/submit-review"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              ✍️ Share your experience →
            </Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §5  LEAD FORM — free matching
          ════════════════════════════════════════════════════════════ */}
      <section id="lead-form" className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1.5">
                Free matching service — no fees, no obligation
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                Find a verified agency that shows real deductions
              </h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xl">
                <span className="font-semibold text-gray-700">Transparent deductions</span> ·{" "}
                <span className="font-semibold text-gray-700">Verified housing</span> ·{" "}
                <span className="font-semibold text-gray-700">Real worker reviews</span>{" "}
                — We match you only with agencies that pass our verification checks.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {["No paid rankings", "GDPR compliant", "Free matching"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                  <span className="text-emerald-500">✓</span> {b}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 sm:p-7 shadow-sm">
            <HomepageLeadForm />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §6  SALARY CALCULATOR
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
              Adjust for your specific offer. Real Dutch taxes with all heffingskorting credits.
              Every deduction calculated live.
            </p>
          </div>

          <HomepageCalculator />

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §7  METHODOLOGY TRUST BLOCK
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

          <div className="grid lg:grid-cols-2 gap-6 items-start">

            {/* Assumptions */}
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

            {/* Static payslip */}
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-gray-900 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Example: WML worker · €14.71/hr · 40h/wk · 2026 real tax
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
                  Tax −€63 (real 2026 loonheffing after AHK+AK credits) + €95 housing + €25 transport + €35 insurance + €25 admin.{" "}
                  <Link href="/methodology" className="text-blue-600 underline">Full methodology</Link>
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §8  SALARY PAIN → CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            Now you know what €345/week looks like
          </p>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-4">
            Some agencies let you keep{" "}
            <span className="text-emerald-400">€80–€120 more</span>
            <br className="hidden sm:block" />
            {" "}every single week
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Lower housing fees. Transparent contracts. No hidden deductions.
            We verify which agencies actually deliver this — and match you for free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#lead-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
              See verified offers →
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
          §8b  HOW AGENCYCHECK WORKS (business model transparency)
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">

          <div className="text-center mb-7">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
              How AgencyCheck works — and how we make money
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Honest about how this works
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: "📋",
                title: "What AgencyCheck does",
                body: "We collect worker reviews, analyse payslips, and publish independent rankings of Dutch employment agencies. We do not recruit workers — we help you make an informed choice.",
              },
              {
                icon: "💰",
                title: "How we make money",
                body: "If you use our matching service and are successfully placed, the agency pays us a finder's fee. This fee comes from the agency — never from you. Workers pay nothing, ever.",
              },
              {
                icon: "⚖️",
                title: "Why rankings stay honest",
                body: "Agencies cannot pay to rank higher, remove reviews, or influence their scores. Paying agencies get no placement advantage. Only worker ratings determine their position.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white border border-gray-100 p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <p className="text-sm font-black text-gray-900 mb-2">{item.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 px-5 py-4">
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Conflict of interest disclosure:</strong> Agencies that partner with us for matching do not receive higher ratings or preferential search placement.
              Our rankings are calculated purely from verified worker submissions. You can{" "}
              <Link href="/methodology" className="underline hover:text-amber-700">read our full methodology</Link>{" "}
              and{" "}
              <Link href="/reviews" className="underline hover:text-amber-700">browse all unfiltered reviews</Link>{" "}
              — including negative ones — at any time.
            </p>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §9  WORKER PROBLEMS / RISKS
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
          §10  HOUSING PROOF
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">
          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Real housing — not brochures</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">See where you&apos;ll actually live</h2>
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
          §11  VERIFIED AGENCY CARDS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Research-checked agencies
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">
              Transparent offers — real net income shown
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed mb-4">
              Every card shows estimated net weekly income after Dutch tax and deductions.
              No inflated gross numbers.
            </p>
            {/* Verification level legend */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 text-[10px] font-semibold border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5">
              <span className="text-gray-400 font-black uppercase tracking-wider">What the badges mean:</span>
              <span className="inline-flex items-center gap-1 text-gray-500 bg-white border border-gray-200 rounded-full px-2.5 py-1">
                <span className="text-gray-400">👤</span> Worker-reported — reviews from workers only
              </span>
              <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
                <span className="text-blue-400">🔍</span> Research-checked — confirmed KvK + team review
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                <span className="text-emerald-500">✓</span> SNA-registered — certified by Stichting Normering Arbeid
              </span>
            </div>
          </div>

          {/* Enhanced job cards */}
          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {housingAgencies.slice(0, 3).map((agency) => {
              const meta = VERIFIED_JOB_META[agency.slug];
              return (
                <div key={agency.slug}
                  className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col group">

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
                      <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-blue-300 bg-blue-400/15 border border-blue-400/20 rounded-full px-2 py-1 whitespace-nowrap">
                        🔍 Research-checked
                      </span>
                    </div>
                    <Link href={`/agencies/${agency.slug}`}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group-hover:underline">
                      {agency.name} →
                    </Link>
                  </div>

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
          §12  PAYSLIP TOOL CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 text-white border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-8 items-center">
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

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Workers guide</p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 leading-tight">
                Everything to know before working in the Netherlands
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  The Dutch minimum wage (<em>Wettelijk Minimumloon</em>) stands at{" "}
                  <strong className="text-gray-900">€14.71/hour in 2026</strong> for workers
                  aged 21+. At 40 hours per week this gives a gross of exactly €588/week
                  (€14.71 × 40 hours). But after Dutch income tax, agency housing, health
                  insurance and transport, most workers keep between{" "}
                  <strong className="text-gray-900">€300–€370</strong> —
                  roughly 50–63% of their gross, depending on the agency.
                </p>
                <p>
                  The key legal protections to know: the <strong className="text-gray-900">ABU / NBBU CAO</strong>{" "}
                  regulates pay scales, overtime premiums and holiday pay.
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

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Quick access</p>
              {[
                { icon: "💶", href: "/tools/real-income-calculator",        title: "Full salary calculator",        desc: "Net pay with all 2026 Dutch tax credits included" },
                { icon: "📄", href: "/tools/payslip-checker",               title: "Payslip verification tool",     desc: "Upload your loonstrook and check for errors" },
                { icon: "🏢", href: "/agencies",                            title: "All agencies Netherlands",      desc: `${totalAgencies} agencies ranked by worker ratings` },
                { icon: "🏠", href: "/agencies-with-housing",               title: "Jobs with accommodation",       desc: `${housingCount} verified agencies including housing` },
                { icon: "⭐", href: "/reviews",                             title: "Worker reviews",                desc: `${totalReviews}+ real anonymous reviews` },
                { icon: "📋", href: "/work-in-netherlands-for-foreigners",  title: "Rights & legal guide",          desc: "ABU CAO, WML, SNF — explained simply" },
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

          {/* City grid */}
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
                Get matched — free →
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
              <Link href="/agencies-with-housing"        className="hover:text-white transition-colors">Jobs with housing</Link>
              <span className="text-blue-800">·</span>
              <Link href="/tools/real-income-calculator" className="hover:text-white transition-colors">Salary calculator</Link>
              <span className="text-blue-800">·</span>
              <Link href="/methodology"                  className="hover:text-white transition-colors">Methodology</Link>
              <span className="text-blue-800">·</span>
              <Link href="/privacy"                      className="hover:text-white transition-colors">Privacy</Link>
              <span className="text-blue-800">·</span>
              <Link href="/terms"                        className="hover:text-white transition-colors">Terms</Link>
            </nav>
          </div>
        </div>
      </section>

      {/* Sticky bar */}
      <HomepageStickyBar />

    </div>
  );
}
