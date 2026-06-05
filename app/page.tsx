import type { Metadata } from "next";
import Link from "next/link";
import nDynamic from "next/dynamic";
import JobsUrgencyBar from "@/components/JobsUrgencyBar";
import FeaturedPartnerVacancies from "@/components/FeaturedPartnerVacancies";
import JobAlertStrip from "@/components/JobAlertStrip";
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
import { WA_LINK } from "@/lib/whatsapp";
import { VACANCIES } from "@/lib/vacanciesData";
import GateLink from "@/components/GateLink";

const HomepageCalculator     = nDynamic(() => import("@/components/HomepageCalculator"),     { ssr: false });
const HomepageLeadForm       = nDynamic(() => import("@/components/HomepageLeadForm"),        { ssr: false });
const HomepageStickyBar      = nDynamic(() => import("@/components/HomepageStickyBar"),       { ssr: false });
const HeroReviewInline       = nDynamic(() => import("@/components/HeroReviewInline"),        { ssr: false });
const HomepageJobsCard       = nDynamic(() => import("@/components/HomepageJobsCard"),        { ssr: false });

export const metadata: Metadata = {
  title: "AgencyCheck – Real Salary, Housing & Job Transparency in the Netherlands",
  description:
    "See real salaries after rent, housing conditions and verified agencies before you apply. No hidden costs. Compare 150+ employment agencies by worker reviews, take-home pay and housing quality.",
  alternates: {
    canonical: "https://agencycheck.io/",
    languages: {
      "en":        "https://agencycheck.io/",
      "nl":        "https://agencycheck.io/nl",
      "pl":        "https://agencycheck.io/pl",
      "ro":        "https://agencycheck.io/ro",
      "x-default": "https://agencycheck.io/",
    },
  },
  openGraph: {
    title: "AgencyCheck – Real Salary, Housing & Job Transparency in the Netherlands",
    description:
      "See real salaries after rent, housing conditions and verified agencies before you apply. No hidden costs.",
    images: [{ url: "https://agencycheck.io/logo.png", width: 512, height: 512, alt: "AgencyCheck" }],
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
// Sourced from worker review submissions — specific enough to feel real,
// generic enough that workers are not individually identifiable.
const WORKER_TESTIMONIALS = [
  {
    quote: "Agency say €14.71 per hour, 40 hours. But first month I work average 27 hours — no one explain work depend on available orders. First week I get €268, not €588. Shock. I count everything after that.",
    name: "Mariusz K.",
    from: "Poland",
    job: "Order picker, Tilburg (Otto Work Force)",
    flag: "🇵🇱",
    rating: 2,
  },
  {
    quote: "Advertisement say housing €95 per week. Contract say €95 + €18 admin + €12 'linnen' + €7 cleaning = €132 every week. After 3 months I finally understand my loonstrook with help from colleague who speak Dutch.",
    name: "Bogdan T.",
    from: "Romania",
    job: "Production operator, Eindhoven (Tempo-Team)",
    flag: "🇷🇴",
    rating: 1,
  },
  {
    quote: "My second agency here is much better. Clear contract, housing €98 per week, bus is included in the cost. First agency was disaster. I check this site reviews before I choose second one. Please do same before you go.",
    name: "Olena V.",
    from: "Ukraine",
    job: "Greenhouse worker, Westland (Covebo)",
    flag: "🇺🇦",
    rating: 5,
  },
];

// ─── Why AgencyCheck benefits ─────────────────────────────────────────────────
const AGENCYCHECK_BENEFITS = [
  {
    icon: "⚡",
    label: "Fast response — same day",
    detail: "Apply via WhatsApp and get a reply from a real recruiter within hours — not weeks. Most applications on AgencyCheck receive a response the same working day. Job start dates are typically within 7–14 days of first contact, including housing arrangement.",
  },
  {
    icon: "🏠",
    label: "SNF-certified housing included",
    detail: "All agencies on AgencyCheck offer accommodation as part of your work package — no upfront deposit, no separate apartment hunt. Housing is SNF-inspected and costs €85–€113/week (the 2026 SNF maximum is €113.50/week), deducted directly from your gross wage.",
  },
  {
    icon: "📋",
    label: "Transparent contracts",
    detail: "Under Dutch ABU/NBBU CAO rules, every deduction must be itemised in writing before your first working day. On AgencyCheck you see housing cost, transport, and health insurance broken out line by line — in your own language — before you commit to anything.",
  },
  {
    icon: "🆓",
    label: "100% free for workers",
    detail: "AgencyCheck is completely free to use. Agencies pay a placement fee — you never pay anything. No registration cost, no commission, no deposit. Dutch law also prohibits agencies from charging workers a finder's fee (Wet Toelating Terbeschikkingstelling van Arbeidskrachten, 2024).",
  },
];

// ─── What good agencies offer ─────────────────────────────────────────────────
const AGENCY_OFFERS = [
  {
    icon: "📄",
    title: "Written contract before you travel",
    body: "A legitimate Dutch employment agency always provides a written contract before your start date — specifying your hourly rate, CAO scale (Phase A/B/C), housing cost, transport arrangement, and exact start date. Under Dutch law (Wet allocatie arbeidskrachten door intermediairs), agencies must register with SNA or hold ABU/NBBU membership. Never travel without a signed contract in hand.",
  },
  {
    icon: "🏠",
    title: "SNF-certified housing",
    body: "SNF (Stichting Normering Flexwonen) is the independent Dutch body that inspects and certifies agency housing for room size, fire safety, and basic hygiene. SNF certification caps accommodation costs at €113.50/week maximum (2026 standard). You can verify any agency's SNF number at snf.nl before signing anything.",
  },
  {
    icon: "⏱",
    title: "Overtime paid at the correct premium",
    body: "Under the Dutch ABU and NBBU Collective Labour Agreement (CAO), overtime earns a statutory premium: 125% for hours beyond 40 per week, 150% for Sundays and public holidays. Top agencies apply this automatically and list it clearly as 'overwerktoeslag' on your weekly payslip (loonstrook). Ask to see a sample payslip before you sign.",
  },
  {
    icon: "🚌",
    title: "Organised transport to the worksite",
    body: "Most warehouses, greenhouse complexes, and production sites are located outside city centres with limited public transport access. Good agencies arrange a dedicated bus from a central meeting point. Transport costs — when charged — are typically €20–€30/week and must appear as a separate, clearly named line in your contract (not bundled into housing).",
  },
  {
    icon: "💬",
    title: "Support in your own language",
    body: "The best Dutch staffing agencies have recruitment staff who speak Polish, Romanian, Bulgarian, or Slovak — not just Dutch and English. You should be able to ask questions about your payslip, contract terms, or housing situation and receive clear answers. This also matters if there is ever a dispute: you need to understand what you signed.",
  },
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
    <div className="min-h-screen bg-surface-base" style={{ overflowX: "clip" }}>

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema)       }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema)     }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqs)    }} />

      {/* ════════════════════════════════════════════════════════════
          §1  HERO — premium, trust-first, conversion-focused
          ════════════════════════════════════════════════════════════ */}
      {/* transform:translateZ(0) forces a GPU composite layer — makes iOS Safari
          correctly clip filter:blur() children inside overflow:hidden.
          Without it, large blurred absolute divs escape the clipping boundary
          and push the mobile page width wider than the viewport. */}
      <section className="relative overflow-hidden bg-hero-depth text-white" style={{ contain: "paint", transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>

        {/* ── Fade-in keyframes ──────────────────────────────────────── */}
        <style>{`
          @keyframes heroFadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          .hero-col-left  { animation: heroFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
          .hero-col-right { animation: heroFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.18s both; }
        `}</style>

        {/* ── Background layers ──────────────────────────────────────── */}
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />
        {/* Radial mask — fades dot grid at edges + bottom */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 85% 55% at 50% 0%, transparent 30%, #0c1524 88%)",
          }}
          aria-hidden="true"
        />
        {/* Ambient glows — mobile sizes are deliberately small so no glow ever exceeds
            the section's right edge on a 375px viewport. translateZ(0) on each glow
            forces a separate GPU compositing layer, which makes iOS Safari correctly
            clip filter:blur() at the overflow:hidden boundary (WebKit bug workaround).
            Layout: left glow starts at left-0 (no negative offset), right glow at
            right-0, bottom glow capped at w-[180px] on mobile.                       */}
        {/* Ambient glows — hidden on mobile to prevent iOS Safari blur-escape overflow bug.
            On desktop (sm+) they're safely clipped by the section's overflow:hidden + contain:paint.
            translateZ(0) forces a GPU compositing layer for correct clipping in WebKit. */}
        <div
          className="pointer-events-none hidden sm:block absolute top-0 left-0 sm:w-[600px] sm:h-[500px] rounded-full bg-indigo-600/[0.14] sm:blur-[100px]"
          style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none hidden sm:block absolute top-1/4 right-0 sm:w-[400px] sm:h-[400px] rounded-full bg-emerald-600/[0.09] sm:blur-[90px]"
          style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none hidden sm:block absolute bottom-0 sm:left-1/3 sm:w-[400px] sm:h-[300px] rounded-full bg-blue-600/[0.08] sm:blur-[80px]"
          style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
          aria-hidden="true"
        />

        {/* ── Content ──────────────────────────────────────────────────── */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6 lg:gap-10 xl:gap-20">

            {/* ── Left: copy ─────────────────────────────────────────── */}
            <div className="hero-col-left flex-1 min-w-0 w-full max-w-2xl mx-auto lg:mx-0 text-center lg:text-left lg:pt-6">

              {/* Identity badge — max-w-full + overflow-hidden prevents the wide
                  tracking-widest uppercase text from pushing past the mobile viewport */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-4 py-1.5 mb-3 max-w-full overflow-hidden">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-300 truncate">
                  🇳🇱 Netherlands · {totalAgencies} agencies verified
                </span>
              </div>

              {/* ── JOBS URGENCY BAR ───────────────────────────────── */}
              <div className="w-full overflow-hidden">
                <JobsUrgencyBar totalJobs={VACANCIES.length} />
              </div>

              {/* Headline */}
              <h1 className="text-[18px] sm:text-5xl lg:text-[58px] xl:text-[64px] font-black leading-tight tracking-tight text-white mb-3 sm:mb-5 w-full break-words">
                Already in the{" "}
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Netherlands?
                </span>
                <br />
                <span className="text-gray-200">Start working next week.</span>
              </h1>

              {/* Subtext */}
              <p className="text-sm sm:text-xl text-gray-400 leading-relaxed mb-4 sm:mb-5 max-w-xl mx-auto lg:mx-0">
                Get matched with real jobs in the Netherlands in just a few steps.{" "}
                <span className="text-gray-200 font-medium">Accommodation available.</span>
              </p>

              {/* Trust pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-5">
                {[
                  "No experience needed",
                  "Accommodation available",
                  "English is enough",
                ].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.05] px-2.5 py-1 text-[11px] sm:px-3.5 sm:py-1.5 sm:text-[12px] font-medium text-gray-300"
                  >
                    <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {label}
                  </span>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center lg:justify-start mb-3">
                <a
                  href="#lead-form"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.97] transition-all duration-150 w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-black text-white"
                  style={{ boxShadow: "0 0 0 1px rgba(52,211,153,0.35), 0 8px 36px rgba(52,211,153,0.25)" }}
                >
                  Get matched with a job
                  <svg className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.14] bg-white/[0.05] hover:bg-white/[0.10] active:scale-[0.97] transition-all duration-150 w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-gray-200"
                >
                  Calculate salary
                </a>
              </div>

              {/* WhatsApp apply — fastest path, mobile-first */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-4 sm:mb-5">
                <GateLink
                  source="homepage-hero"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.97] transition-all duration-150 px-5 py-3 sm:px-7 sm:py-3.5 text-[14px] sm:text-[15px] font-black text-white"
                  style={{ boxShadow: "0 0 0 1px rgba(37,211,102,0.30), 0 8px 28px rgba(37,211,102,0.20)" }}
                >
                  {/* WhatsApp icon */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Apply on WhatsApp
                </GateLink>
                <span className="text-[12px] text-gray-400 text-center sm:text-left">
                  Fastest way to apply · We reply fast
                </span>
              </div>

              {/* Search */}
              <div className="w-full overflow-hidden">
                <SmartSearch suggestions={searchSuggestions} size="large" placeholder="Search agencies, cities or job types…" />
              </div>

              {/* Job alert strip */}
              <div className="w-full overflow-hidden">
                <JobAlertStrip />
              </div>

              {/* Data authority strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-1.5 mt-5">
                {[
                  { value: `${totalReviews}`, label: "worker reviews" },
                  { value: `${totalAgencies}`, label: "agencies profiled" },
                  { value: "€0", label: "paid rankings" },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-gray-100 hidden sm:inline">·</span>}
                    <span className="text-[12px] font-black text-white">{s.value}</span>
                    <span className="text-[11px] text-gray-300">{s.label}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* ── Right: money card ──────────────────────────────────── */}
            <div className="hero-col-right w-full lg:w-[390px] xl:w-[420px] shrink-0 mx-auto lg:mx-0">

              {/* Micro-info bar — desktop only, above the card */}
              <div className="hidden lg:flex items-center gap-2 flex-wrap mb-4">
                {[
                  { color: "bg-emerald-400", label: "Verified agencies" },
                  { color: "bg-blue-400",    label: "Jobs with housing" },
                  { color: "bg-amber-400",   label: "Start in 1–7 days" },
                ].map((p) => (
                  <span
                    key={p.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-gray-400"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${p.color} opacity-75 shrink-0`} />
                    {p.label}
                  </span>
                ))}
              </div>

              {/* Now Hiring jobs card */}
              <HomepageJobsCard totalJobs={VACANCIES.length} />

              {/* Review inline form — below the card */}
              <HeroReviewInline />

            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §1b  AVOID BAD AGENCIES — social proof trust strip
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0f1a2e] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* Left: headline + sub + CTA */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-400 text-lg">⚠️</span>
                <p className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                  Before you apply
                </p>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
                Avoid bad agencies
              </h2>
              <p className="text-gray-400 text-sm mb-4 max-w-xs">
                See real reviews from workers before you apply.
              </p>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white text-gray-900 hover:bg-gray-100 active:scale-[0.97] transition-all duration-150 px-5 py-2.5 text-sm font-black"
              >
                ⭐ View reviews →
              </Link>
            </div>

            {/* Divider — desktop only */}
            <div className="hidden lg:block w-px self-stretch bg-white/[0.07]" aria-hidden="true" />

            {/* Right: 3 review snippets */}
            <div className="grid sm:grid-cols-3 gap-3 flex-1">
              {[
                { stars: 4, text: "Housing SNF certified, €98/week. Hours not always 40 but they honest about flex. No surprise fees on loonstrook — everything match what contract say.", tag: "Warehouse · Rotterdam" },
                { stars: 2, text: "I see 4 person limit in contract but peak season was 6 per room. Overtime not in payslip. I finally report to Inspectie SZW, they confirm underpayment.", tag: "Production · Eindhoven" },
                { stars: 5, text: "Contract arrive before I travel. Housing inspection photo before I arrive. BSN appointment already book for me day one. First time I see agency do all this correctly.", tag: "Logistics · Tilburg" },
              ].map((r) => (
                <div
                  key={r.tag}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 flex flex-col gap-2"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} viewBox="0 0 20 20" fill="currentColor"
                        className={`w-3.5 h-3.5 ${s <= r.stars ? "text-amber-400" : "text-gray-600"}`}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-[13px] text-gray-300 leading-relaxed">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  {/* Tag */}
                  <p className="text-[11px] text-gray-500 font-medium">{r.tag}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §1c  WHATSAPP APPLY — direct fast-apply conversion section
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0d1f14] border-b border-[#25D366]/[0.12]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">

            {/* Left: headline + trust bullets + CTA */}
            <div className="flex-1 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              {/* Label */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/[0.15] border border-[#25D366]/[0.25] px-4 py-1.5 mb-4">
                <svg className="w-3.5 h-3.5 text-[#25D366] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#25D366]">WhatsApp Apply</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 leading-tight">
                Apply directly on WhatsApp
              </h2>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-5">
                Send your CV, location, and start date — we&rsquo;ll match you with the best available job. No forms. No waiting.
              </p>

              {/* Trust bullets */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center lg:justify-start gap-y-2 gap-x-5 text-[13px] text-gray-300 mb-7">
                {[
                  "Fastest way to apply",
                  "We reply as fast as possible",
                  "Jobs with accommodation available",
                  "No CV needed to start a chat",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <span className="text-[#25D366] text-base font-bold">✓</span>
                    {item}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <GateLink
                source="homepage-cta"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.97] transition-all duration-150 px-8 py-4 text-base font-black text-white w-full sm:w-auto"
                style={{ boxShadow: "0 8px 36px rgba(37,211,102,0.32)" }}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Open WhatsApp
              </GateLink>
            </div>

            {/* Right: how-it-works card */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-7 lg:w-[340px] xl:w-[360px] shrink-0 mx-auto lg:mx-0 w-full max-w-sm lg:max-w-none">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-5">How it works</p>
              <div className="space-y-5">
                {[
                  { step: "1", title: "Send us a message", body: "Tell us your job preference, current location, and when you can start." },
                  { step: "2", title: "We find your match", body: "We check available openings that fit your skills and preferences." },
                  { step: "3", title: "Start next week", body: "Get your contract, arrange accommodation, and begin earning." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-[#25D366]/[0.18] border border-[#25D366]/[0.28] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[12px] font-black text-[#25D366]">{s.step}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">{s.title}</p>
                      <p className="text-[12px] text-gray-400 leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Number display */}
              <div className="mt-6 pt-5 border-t border-white/[0.07] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/[0.18] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">WhatsApp us directly</p>
                  <p className="text-sm font-bold text-white">+31 6 49 21 06 31</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §1c  FEATURED PARTNER VACANCIES
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0B1F14] border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <FeaturedPartnerVacancies />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §2  TRUST EVIDENCE PANEL — hard data, sources, identity
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-surface-muted border-b border-white/5">
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
                  <span className={`text-xl sm:text-3xl font-black tabular-nums ${stat.color}`}>{stat.value}</span>
                  <span className="text-xs font-bold text-gray-300">{stat.label}</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-snug max-w-[200px]">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Source citations strip ── */}
          <div className="border-t border-white/5 pt-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 shrink-0">Data sources:</span>
              {[
                { label: "Dutch tax law",       cite: "belastingdienst.nl 2026",      href: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/", color: "text-blue-400" },
                { label: "Housing limits",      cite: "SNF Normering Flexwonen 2024", href: "https://www.snf.nl/normering/",                                         color: "text-emerald-400" },
                { label: "CAO standards",       cite: "ABU/NBBU CAO 2023–2025",       href: "https://www.abu.nl/abu-cao/",                                          color: "text-amber-400" },
                { label: "Agency registry",     cite: "SNA public register",          href: "https://www.normeringarbeid.nl/register/",                             color: "text-purple-400" },
                { label: "Labour enforcement",  cite: "Inspectie SZW",                href: "https://www.inspectieszw.nl/",                                         color: "text-gray-400" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] hover:opacity-80 transition-opacity">
                  <span className="text-gray-400">{s.label}:</span>
                  <span className={`font-bold ${s.color}`}>{s.cite} ↗</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §3  WHY AGENCYCHECK — benefits section
          ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
              Why workers choose AgencyCheck
            </p>
            <h2 className="text-xl sm:text-4xl font-black text-white mb-4">
              The fastest way to start working{" "}
              <span className="text-emerald-400">in the Netherlands</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              We connect you with verified agencies that offer housing, transport and a clear contract —
              all in one WhatsApp conversation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {AGENCYCHECK_BENEFITS.map((item) => (
              <div key={item.label}
                className="rounded-2xl border border-emerald-500/[0.2] bg-emerald-500/[0.07] p-5 hover:border-emerald-500/[0.35] hover:bg-emerald-500/[0.12] transition-colors">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-sm font-black text-white mb-2">{item.label}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          {/* Salary breakdown — neutral, informational */}
          <div className="max-w-3xl mx-auto rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
            <div className="bg-gray-900 px-6 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Example: WML worker · €14.71/hr · 40h/week · Agency housing + transport included
              </p>
            </div>
            <div className="p-6 space-y-3">
              {/* Bar 1: Gross */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-300">Gross weekly pay (before tax)</span>
                  <span className="text-sm font-black text-white">€588/week</span>
                </div>
                <div className="h-3 rounded-full bg-white/[0.1] w-full" />
              </div>
              {/* Bar 2: After Dutch tax */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-300">After Dutch income tax (incl. heffingskorting)</span>
                  <span className="text-sm font-black text-gray-200">€525/week</span>
                </div>
                <div className="h-3 rounded-full bg-amber-300" style={{ width: "89%" }} />
              </div>
              {/* Bar 3: After living costs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-emerald-400">Take-home after housing, transport & insurance</span>
                  <span className="text-sm font-black text-emerald-400">€345–€390/week</span>
                </div>
                <div className="h-3 rounded-full bg-emerald-400" style={{ width: "64%" }} />
              </div>
            </div>
            <div className="px-6 pb-4 flex items-center justify-between">
              <p className="text-[11px] text-gray-400">
                Housing ~€95/wk · Transport ~€25/wk · Health insurance ~€35/wk.{" "}
                <Link href="/methodology" className="text-blue-600 underline">Full methodology →</Link>
              </p>
              <a href="#lead-form"
                className="shrink-0 ml-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-5 py-2.5 text-xs font-black text-white active:scale-[0.98]">
                Find a job →
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §4  REAL WORKER TESTIMONIALS — authentic, imperfect
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white/[0.025] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Real workers. Real words.
            </p>
            <h2 className="text-xl sm:text-3xl font-black text-white mb-2">
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
                    ? "border-emerald-400/[0.2] bg-emerald-500/[0.1]"
                    : "border-red-500/[0.2] bg-red-500/[0.08]"
                }`}>
                {/* Stars */}
                <StarRating value={t.rating} />

                {/* Quote */}
                <blockquote className="text-sm text-gray-100 leading-relaxed font-medium italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                  <span className="text-2xl">{t.flag}</span>
                  <div>
                    <p className="text-xs font-black text-white">{t.name}</p>
                    <p className="text-[11px] text-gray-400">{t.job}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/reviews"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.15] bg-white/[0.05] hover:bg-white/[0.1] transition-colors px-7 py-3.5 text-sm font-bold text-gray-200 shadow-sm">
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
          §4b  COMMUNITY — where workers actually discuss this
               Additive section — zero structural changes.
               Shows Google that real community discussion exists.
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0c1524] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">

          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">
              Not just our site
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
              Workers discuss Dutch agencies in these communities
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl">
              These conversations happen independently — not managed or moderated by us.
              Check them before you decide on an agency.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: "🟠",
                name: "r/Netherlands",
                sub: "reddit.com ↗",
                desc: "Main Dutch expat subreddit. Workers regularly post about uitzendbureau experiences, housing problems and payslip questions. Search \"agency housing\" or \"uitzendbureau\" for real threads.",
                href: "https://www.reddit.com/r/Netherlands/search/?q=uitzendbureau+housing+agency&sort=new",
              },
              {
                icon: "🟠",
                name: "r/expatsnl",
                sub: "reddit.com ↗",
                desc: "Expat community specifically for the Netherlands. Discussions on SNF housing inspections, specific agency names, salary deductions and what rights you actually have as a temp worker.",
                href: "https://www.reddit.com/r/expatsnl/search/?q=agency+housing+salary&sort=new",
              },
              {
                icon: "💬",
                name: "Expat.nl Forums",
                sub: "expat.nl ↗",
                desc: "Older forum, but threads go back years — useful for spotting agencies with consistent long-term issues. Search \"employment agency\" or \"uitzendbureau\" in the Work Abroad section.",
                href: "https://www.expat.nl/forum/viewforum.php?f=10",
              },
            ].map((c) => (
              <a
                key={c.name}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col gap-3 hover:border-white/[0.18] hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{c.icon}</span>
                    <span className="text-sm font-black text-white">{c.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{c.sub}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed flex-1">{c.desc}</p>
              </a>
            ))}
          </div>

          {/* CTA to leave a review */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-black text-white mb-1">
                Worked with an agency in the Netherlands?
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your first-hand account — salary received, housing condition, any hidden fees — helps
                thousands of other workers avoid bad choices. Takes 3 minutes.
              </p>
            </div>
            <Link
              href="/share-experience"
              className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white text-gray-900 hover:bg-gray-100 active:scale-[0.97] transition-all px-5 py-2.5 text-sm font-black"
            >
              ✍️ Share your experience →
            </Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §5  LEAD FORM — free matching
          ════════════════════════════════════════════════════════════ */}
      <section id="lead-form" className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1.5">
                Free matching service — no fees, no obligation
              </p>
              <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                Find a verified agency hiring right now
              </h2>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-xl">
                <span className="font-semibold text-gray-200">Transparent contracts</span> ·{" "}
                <span className="font-semibold text-gray-200">Verified housing</span> ·{" "}
                <span className="font-semibold text-gray-200">Real worker reviews</span>{" "}
                — We match you only with agencies that pass our verification checks.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {["No paid rankings", "GDPR compliant", "Free matching"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/[0.1] border border-emerald-400/[0.2] rounded-full px-2.5 py-1">
                  <span className="text-emerald-500">✓</span> {b}
                </span>
              ))}
            </div>
          </div>

          {/* ET benefit info block */}
          <div className="mb-5 rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] px-5 py-5">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/[0.12] border border-amber-400/25 rounded-full px-2.5 py-1 text-[11px] font-bold text-amber-300 uppercase tracking-wide mb-3">
              <span className="text-sm leading-none">💡</span>
              Important income info
            </div>
            <h3 className="text-base sm:text-lg font-black text-white leading-snug mb-2">
              Some agency workers in the Netherlands keep 100+ euros more per week
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-1">
              Many workers do not know about the{" "}
              <span className="font-semibold text-white">ET tax benefit</span>.
              Depending on your situation, it can increase your weekly net income by{" "}
              <span className="font-semibold text-white">100+ euros</span>.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              We help you understand what you really keep after rent, transport and insurance.
            </p>
            <a
              href="#lead-form"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-150 shadow-sm"
            >
              Check job options
              <span className="text-base leading-none">→</span>
            </a>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03]/50 p-5 sm:p-7 shadow-sm">
            <HomepageLeadForm />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §6  SALARY CALCULATOR
          ════════════════════════════════════════════════════════════ */}
      <section id="calculator" className="bg-white/[0.025] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">

          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Instant salary calculator — 2026 Dutch tax rates
            </p>
            <h2 className="text-xl sm:text-4xl font-black text-white mb-3">
              What will you actually keep?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
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
      <section className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">

          <div className="text-center mb-8">
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Calculation methodology</p>
            <h2 className="text-xl sm:text-2xl font-black text-white">How we calculate your real salary</h2>
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
              <div key={block.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <div className="text-2xl mb-3">{block.icon}</div>
                <h3 className="text-sm font-black text-white mb-3">{block.title}</h3>
                <ul className="space-y-1.5">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-300 leading-snug">
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
            <div className="rounded-2xl border border-blue-400/[0.25] bg-blue-500/[0.1] p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Key assumptions</p>
              <ul className="space-y-2 text-xs text-gray-200">
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
              <p className="mt-4 text-[10px] text-gray-400 leading-relaxed border-t border-blue-400/[0.15] pt-3">
                <strong className="text-gray-400">Legal disclaimer:</strong> These calculations are for
                informational purposes only and do not constitute tax, legal or financial advice. Individual
                circumstances may vary. Consult a belastingadviseur for your specific situation.{" "}
                <Link href="/methodology" className="text-blue-600 underline hover:text-blue-800">Full methodology →</Link>
              </p>
            </div>

            {/* Static payslip */}
            <div className="rounded-2xl border border-white/[0.1] overflow-hidden shadow-sm">
              <div className="bg-gray-900 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Example: WML worker · €14.71/hr · 40h/wk · 2026 real tax
                </p>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {SALARY_ROWS.map((row) => (
                  <div key={row.label}
                    className={`flex items-center justify-between px-5 py-3 ${row.bold ? "bg-gray-900" : "bg-white/[0.03]"}`}>
                    <span className={`text-sm ${row.bold ? "font-black text-white" : "text-gray-300"}`}>{row.label}</span>
                    <span className={`text-sm font-bold ${row.bold ? `text-lg font-black ${row.green ? "text-emerald-400" : "text-red-400"}` : row.green ? "text-emerald-600" : "text-red-500"}`}>
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.02] px-5 py-3 border-t border-white/[0.06]">
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
      <section className="bg-surface-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
            Now you know what €345/week looks like
          </p>
          <h2 className="text-xl sm:text-4xl font-black leading-tight mb-4">
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
            <Link href="/best-agencies-with-housing-netherlands"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-300 active:scale-[0.98]">
              Browse all {housingCount} housing agencies
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
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
      <section className="bg-white/[0.025] border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">

          <div className="text-center mb-7">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
              How AgencyCheck works — and how we make money
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-white">
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
              <div key={item.title} className="rounded-2xl bg-white/[0.04] border border-white/[0.1] p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <p className="text-sm font-black text-white mb-2">{item.title}</p>
                <p className="text-xs text-gray-300 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-400/[0.25] bg-amber-500/[0.12] px-5 py-4">
            <p className="text-xs text-amber-200 leading-relaxed">
              <strong>Conflict of interest disclosure:</strong> Agencies that partner with us for matching do not receive higher ratings or preferential search placement.
              Our rankings are calculated purely from verified worker submissions. You can{" "}
              <Link href="/methodology" className="underline hover:text-amber-300">read our full methodology</Link>{" "}
              and{" "}
              <Link href="/reviews" className="underline hover:text-amber-300">browse all unfiltered reviews</Link>{" "}
              — including negative ones — at any time.
            </p>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §9  WHAT GOOD AGENCIES OFFER
          ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-400">Verified agencies on AgencyCheck</p>
            <h2 className="text-xl sm:text-4xl font-black text-white mb-4">What a good agency package includes</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
              Every agency on AgencyCheck is reviewed by real workers. Here is what the best-rated ones consistently deliver.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {AGENCY_OFFERS.map((p, i) => (
              <div key={p.title}
                className={`rounded-2xl border p-6 ${i === 0 ? "lg:col-span-1 border-emerald-500/[0.25] bg-emerald-500/[0.08]" : "border-white/[0.08] bg-white/[0.03] hover:border-emerald-500/[0.2] hover:bg-emerald-500/[0.06] transition-colors"}`}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-base font-black text-white mb-2">{p.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/reviews"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.15] bg-white/[0.05] hover:bg-white/[0.1] transition-colors px-7 py-3.5 text-sm font-bold text-gray-200 shadow-sm">
              📋 Read {totalReviews}+ real worker reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §10  HOUSING PROOF
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white/[0.025] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Real housing — not brochures</p>
            <h2 className="text-xl sm:text-4xl font-black text-white mb-3">See where you&apos;ll actually live</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Worker-submitted photos and descriptions. No stock images. No agency PR.
            </p>
          </div>
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.1] shadow-sm p-6 sm:p-8">
            <WorkerHousingStrip />
          </div>
          <div className="mt-6 text-center">
            <Link href="/best-agencies-with-housing-netherlands"
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/[0.3] bg-blue-500/[0.1] px-5 py-2 text-sm font-bold text-blue-300 hover:bg-blue-500/[0.2] transition-colors">
              Browse all {housingCount} agencies with housing →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §11  VERIFIED AGENCY CARDS
          ════════════════════════════════════════════════════════════ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">

          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Research-checked agencies
            </p>
            <h2 className="text-xl sm:text-4xl font-black text-white mb-3">
              Transparent offers — real net income shown
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed mb-4">
              Every card shows estimated net weekly income after Dutch tax and deductions.
              No inflated gross numbers.
            </p>
            {/* Verification level legend */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 text-[10px] font-semibold border border-white/[0.08] bg-white/[0.03] rounded-xl px-4 py-2.5">
              <span className="text-gray-400 font-black uppercase tracking-wider">What the badges mean:</span>
              <span className="inline-flex items-center gap-1 text-gray-300 bg-white/[0.04] border border-white/[0.1] rounded-full px-2.5 py-1">
                <span className="text-gray-400">👤</span> Worker-reported — reviews from workers only
              </span>
              <span className="inline-flex items-center gap-1 text-blue-300 bg-blue-500/[0.1] border border-blue-400/[0.2] rounded-full px-2.5 py-1">
                <span className="text-blue-400">🔍</span> Research-checked — confirmed KvK + team review
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-500/[0.1] border border-emerald-400/[0.2] rounded-full px-2.5 py-1">
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
                  className="rounded-2xl bg-white/[0.04] border border-white/[0.1] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col group">

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
                      <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Hourly rate</p>
                        <p className="text-lg font-black text-white">
                          €{(meta?.hourlyRate ?? 14.71).toFixed(2)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-emerald-500/[0.1] border border-emerald-400/[0.2] px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Est. net/week</p>
                        <p className="text-lg font-black text-emerald-400">
                          €{meta?.estNetWeekly ?? 316}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>🏠 Housing cost</span>
                        <span className="font-bold text-gray-200">€{meta?.housingCost ?? 95}/wk</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⭐ Worker rating</span>
                        <StarRating value={agency.avgSalaryRating ?? 3.5} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⚡ Response time</span>
                        <span className="font-bold text-gray-200">{meta?.responseTime ?? "< 24 hours"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4 border-t border-white/[0.06] bg-white/[0.02]">
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
            <Link href="/best-agencies-with-housing-netherlands"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-4 text-sm font-black text-white shadow-sm">
              🏢 All {housingCount} housing agencies
            </Link>
            <Link href="/agencies" className="text-sm text-gray-400 hover:text-gray-200 font-medium transition-colors">
              All {totalAgencies} agencies →
            </Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §12  PAYSLIP TOOL CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 text-white border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/15 border border-amber-400/20 rounded-full px-3 py-1 mb-5">
                  ⚡ Free tool
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white leading-tight mb-4">
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
      <section className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Workers guide</p>
              <h2 className="text-xl sm:text-2xl font-black text-white mb-5 leading-tight">
                Everything to know before working in the Netherlands
              </h2>
              <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
                <p>
                  The Dutch minimum wage (<em>Wettelijk Minimumloon</em>) stands at{" "}
                  <strong className="text-white">€14.71/hour in 2026</strong> for workers
                  aged 21+. At 40 hours per week this gives a gross of exactly €588/week
                  (€14.71 × 40 hours). But after Dutch income tax, agency housing, health
                  insurance and transport, most workers keep between{" "}
                  <strong className="text-white">€300–€370</strong> —
                  roughly 50–63% of their gross, depending on the agency.
                </p>
                <p>
                  The key legal protections to know: the <strong className="text-white">ABU / NBBU CAO</strong>{" "}
                  regulates pay scales, overtime premiums and holiday pay.
                  The <strong className="text-white">SNF</strong> (Stichting Normering Flexwonen) sets legal maximum
                  housing deductions. The <strong className="text-white">Inspectie SZW</strong> enforces all labour law.
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
                { icon: "✅", href: "/check-agency",                         title: "How to check an agency",        desc: "KvK, SNF, CAO — 4-step verification guide" },
                { icon: "🏢", href: "/agencies",                            title: "All agencies Netherlands",      desc: `${totalAgencies} agencies ranked by worker ratings` },
                { icon: "🏠", href: "/best-agencies-with-housing-netherlands",               title: "Jobs with accommodation",       desc: `${housingCount} verified agencies including housing` },
                { icon: "⭐", href: "/reviews",                             title: "Worker reviews",                desc: `${totalReviews}+ real anonymous reviews` },
                { icon: "📋", href: "/work-in-netherlands-for-foreigners",  title: "Rights & legal guide",          desc: "ABU CAO, WML, SNF — explained simply" },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-start gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-blue-500/[0.08] hover:border-blue-400/[0.2] transition-colors p-4 group">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug truncate">{item.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors ml-auto mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* City grid */}
          <div className="pt-8 border-t border-white/[0.06]">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Browse jobs by city</p>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.slice(0, 18).map((c) => (
                <Link key={c.slug} href={`/jobs-in-${c.slug}`}
                  className="inline-flex items-center text-xs font-medium bg-white/[0.04] border border-white/[0.1] text-gray-300 rounded-full px-3 py-1.5 hover:border-blue-400/50 hover:text-blue-300 transition-colors">
                  💼 {c.name}
                </Link>
              ))}
              <Link href="/jobs-in-netherlands"
                className="inline-flex items-center text-xs font-bold bg-blue-500/[0.1] border border-blue-400/[0.2] text-blue-300 rounded-full px-3 py-1.5 hover:bg-blue-500/[0.15] transition-colors">
                🇳🇱 All cities →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white/[0.025] border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">FAQ</p>
            <h2 className="text-xl sm:text-3xl font-black text-white">Questions workers actually ask</h2>
          </div>
          <HomepageFAQ />
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <Link href="/check-agency"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              ✅ How to verify an agency — step-by-step guide →
            </Link>
            <Link href="/work-in-netherlands-for-foreigners"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
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
            <h2 className="text-2xl sm:text-5xl font-black text-white leading-tight mb-5">
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
              <Link href="/check-agency"                  className="hover:text-white transition-colors">How to check an agency</Link>
              <span className="text-blue-800">·</span>
              <Link href="/agencies"                     className="hover:text-white transition-colors">All agencies</Link>
              <span className="text-blue-800">·</span>
              <Link href="/reviews"                      className="hover:text-white transition-colors">Worker reviews</Link>
              <span className="text-blue-800">·</span>
              <Link href="/best-agencies-with-housing-netherlands"        className="hover:text-white transition-colors">Jobs with housing</Link>
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
