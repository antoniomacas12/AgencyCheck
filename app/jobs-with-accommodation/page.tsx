import type { Metadata } from "next";
import Link from "next/link";
import ApplyBar from "@/components/ApplyBar";
import JobsWithHousingList from "@/components/JobsWithHousingList";
import { HOUSING_AGENCIES } from "@/lib/agencyEnriched";
import type { AccommodationType } from "@/lib/agencyEnriched";
import { JOB_LISTINGS } from "@/lib/jobData";
import { JOB_SALARY_DATA } from "@/lib/seoData";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";
import { getLocale } from "@/lib/getLocale";
import { getT } from "@/lib/i18n";
import { VACANCIES, BADGE_META } from "@/lib/vacanciesData";

export const metadata: Metadata = {
  title: "Jobs with Housing in the Netherlands — Real Salary After Costs — AgencyCheck",
  description:
    "Find jobs with housing in the Netherlands. See real weekly take-home pay after housing deduction, tax and transport. Warehouse, production, logistics and greenhouse jobs.",
  alternates: {
    canonical: "https://agencycheck.io/jobs-with-accommodation",
    languages: {
      "en":        "https://agencycheck.io/jobs-with-accommodation",
      "pl":        "https://agencycheck.io/pl/praca-z-zakwaterowaniem",
      "ro":        "https://agencycheck.io/ro/locuri-de-munca-cu-cazare",
      "x-default": "https://agencycheck.io/jobs-with-accommodation",
    },
  },
};

// ─── Data prep ────────────────────────────────────────────────────────────────

const housingListings = JOB_LISTINGS.filter((j) => j.housing === "YES" && j.isActive);

// Vacancies from vacanciesData with confirmed or available housing
const vacanciesConfirmed = VACANCIES.filter((v) => v.b.includes("acc"));
const vacanciesAvailable = VACANCIES.filter((v) => v.b.includes("acc_ask"));

const allHousingAgencies = [...HOUSING_AGENCIES].sort((a, b) => {
  const aJobs = housingListings.filter((l) => l.agencySlug === a.slug).length;
  const bJobs = housingListings.filter((l) => l.agencySlug === b.slug).length;
  if (bJobs !== aJobs) return bJobs - aJobs;
  return b.transparencyScore - a.transparencyScore;
});

const agenciesWithJobs = allHousingAgencies.filter(
  (a) => housingListings.some((l) => l.agencySlug === a.slug)
);
const agenciesWithoutJobs = allHousingAgencies
  .filter((a) => !housingListings.some((l) => l.agencySlug === a.slug))
  .slice(0, 6);

// ─── Accommodation label ──────────────────────────────────────────────────────

const HOUSING_CITIES = [
  { name: "Tilburg",  slug: "tilburg"  },
  { name: "Venlo",    slug: "venlo"    },
  { name: "Breda",    slug: "breda"    },
  { name: "Waalwijk", slug: "waalwijk" },
  { name: "Venray",   slug: "venray"   },
];

const SALARY_GRID_SLUGS = ["order-picker", "production-worker", "forklift-driver"];

function accommodationLabel(acc: AccommodationType): string {
  if (acc === "confirmed_no_deduction")  return "🏠 Housing — free";
  if (acc === "confirmed_with_deduction") return "🏠 Housing (cost deducted)";
  if (acc === "unverified_claim")         return "🏠 Housing (unverified)";
  return "🏠 Housing";
}

// ─── Salary grid component ────────────────────────────────────────────────────

function SalaryGrid() {
  const items = SALARY_GRID_SLUGS.map((slug) => {
    const j = JOB_SALARY_DATA[slug];
    if (!j) return null;
    const grossWkly = Math.round(j.avg * 40);
    const tax = Math.round(grossWkly * 0.22);
    const keepWkly = grossWkly - tax - 140;
    return { slug, j, keepWkly };
  }).filter(Boolean) as { slug: string; j: (typeof JOB_SALARY_DATA)[string]; keepWkly: number }[];

  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {items.map(({ slug, j, keepWkly }) => (
        <div key={slug} className="rounded-xl border border-white/[0.07] bg-white/[0.04] overflow-hidden text-center">
          <div className="bg-emerald-600/80 px-3 py-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-200 mb-0.5">You keep</p>
            <p className="text-2xl font-black text-white">
              €{keepWkly}
              <span className="text-xs font-normal text-emerald-200">/wk</span>
            </p>
            <p className="text-[9px] text-emerald-300 mt-0.5">after all costs</p>
          </div>
          <div className="px-3 py-2.5">
            <p className="text-sm mb-1">{j.icon}</p>
            <p className="text-xs font-semibold text-gray-200 mb-1">{j.title}</p>
            <p className="text-[10px] text-gray-400">gross €{j.avg}/hr − €140 housing − tax</p>
            <Link href={`/jobs/${slug}`} className="block mt-2 text-[10px] text-emerald-400 hover:underline font-semibold">
              See {j.title.toLowerCase()} jobs →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What jobs in the Netherlands include housing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Jobs in warehousing, food production, logistics, greenhouses, and manufacturing are most commonly offered with included housing in the Netherlands. Employment agencies such as Covebo, OTTO Workforce, and Adecco provide accommodation for international workers in regions like Venlo, Tilburg, Breda, and Waalwijk.",
      },
    },
    {
      "@type": "Question",
      name: "How much do you keep per week after housing deduction in the Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "At Dutch minimum wage (€14.71/hr for 40 hours = €588 gross/week), after income tax (~€130/week), agency housing (~€95–€113/week), and transport (~€15/week), most international workers keep approximately €290–€360 per week net. Positions above minimum wage (forklift operators, reach truck drivers, night shift) can net €360–€430+/week.",
      },
    },
    {
      "@type": "Question",
      name: "Which employment agencies offer accommodation in the Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Agencies known for providing housing include Covebo, OTTO Workforce, Manpower, Adecco, Tempo-Team, Unique, and several smaller regional agencies. Housing quality and deduction amounts vary significantly — always confirm the weekly cost, room occupancy, and location before accepting a placement.",
      },
    },
    {
      "@type": "Question",
      name: "How much does agency housing cost in the Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Agency housing in the Netherlands is typically deducted directly from your salary at €80–€113/week. The legal maximum under SNF (Stichting Normering Flexwonen) standards is €113.50/week for shared rooms. Some agencies include housing at no charge for the first few weeks as an incentive. Always request a written breakdown of all deductions before signing.",
      },
    },
    {
      "@type": "Question",
      name: "Can I start working in the Netherlands without a BSN number?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can start working before you have a BSN (citizen service number), but your employer will withhold tax at the anonymous rate (up to 52%) until you register. You should apply for a BSN at your local municipality (gemeente) within your first week of arrival. EU citizens can register using their passport or national ID card.",
      },
    },
  ],
};

const breadcrumbSchemaData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                 item: "https://agencycheck.io/" },
    { "@type": "ListItem", position: 2, name: "Jobs",                 item: "https://agencycheck.io/jobs" },
    { "@type": "ListItem", position: 3, name: "Jobs with housing",    item: "https://agencycheck.io/jobs-with-accommodation" },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function JobsWithAccommodationPage() {
  const locale = getLocale();
  const t = await getT(locale);

  const applyContext = {
    sourcePage: "/jobs-with-accommodation",
    sourceType: "jobs_with_housing" as const,
    sourceLabel: "Jobs with Housing page",
    defaultAccommodation: true,
  };

  return (
    <div className="min-h-screen bg-[#0B1F14] text-white">
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaData) }} />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-emerald-400">Home</Link>
        <span>›</span>
        <Link href="/jobs" className="hover:text-emerald-400">Jobs</Link>
        <span>›</span>
        <span className="text-gray-300 font-medium">Jobs with housing</span>
      </nav>

      {/* SLIM HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏠</span>
          {housingListings.length > 0 && (
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2.5 py-1 font-bold">
              {housingListings.length} active listings
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1">
          Jobs with housing in the Netherlands
        </h1>
        <p className="text-sm text-gray-400">
          Real weekly take-home pay shown after housing, tax &amp; costs.
        </p>
      </div>

      {/* SECTION 1: JOBS WITH HOUSING */}
      <section className="mb-8">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-bold text-white">
            Available jobs with housing
          </h2>
          <span className="text-[11px] text-gray-400 shrink-0">
            {housingListings.length} listing{housingListings.length !== 1 ? "s" : ""}
          </span>
        </div>

        {housingListings.length > 0 ? (
          <JobsWithHousingList listings={housingListings} />
        ) : (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-6 py-10 text-center">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-sm font-semibold text-gray-200 mb-1">No active listings right now</p>
            <p className="text-xs text-gray-400">
              We update listings regularly — register below and we&apos;ll notify you when new housing jobs appear.
            </p>
          </div>
        )}
      </section>

      {/* ══ SECTION 1b: DIRECT VACANCIES WITH HOUSING ══════════════════════════
          Jobs from our recruiter network — apply directly on WhatsApp.
          Confirmed housing first, then "available on request" listings.
      ════════════════════════════════════════════════════════════════════════ */}

      {/* Confirmed housing */}
      {vacanciesConfirmed.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-bold text-white">Direct jobs — housing included</h2>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2 py-0.5 font-bold">
              {vacanciesConfirmed.length} jobs
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {vacanciesConfirmed.map((v) => (
              <Link
                key={v.slug}
                href={`/apply/${v.slug}`}
                className="rounded-xl border border-white/[0.07] bg-white/[0.04] overflow-hidden flex flex-col hover:border-emerald-500/30 hover:-translate-y-0.5 transition-all"
              >
                <div className="bg-emerald-600/80 px-3.5 pt-3 pb-2.5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-100 mb-0.5">Housing included</p>
                  <p className="text-sm font-black text-white leading-tight">{v.t}</p>
                </div>
                <div className="px-3.5 py-2.5 flex-1">
                  <p className="text-xs text-gray-400 mb-1.5">📍 {v.l}</p>
                  {v.sm > 0 && (
                    <p className="text-sm font-bold text-white">{v.s}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {v.b.map((b) => (
                      <span key={b} className={`text-[10px] font-bold border rounded px-1.5 py-0.5 ${BADGE_META[b].color}`}>
                        {BADGE_META[b].label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="px-3.5 pb-3">
                  <span className="block w-full text-center py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition">
                    Apply on WhatsApp →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Housing available */}
      {vacanciesAvailable.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-white">Jobs where housing may be available</h2>
            <span className="text-[11px] bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full px-2 py-0.5 font-bold">
              {vacanciesAvailable.length} jobs
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Most of these roles offer agency housing — confirm availability when you apply.
          </p>
          <div className="rounded-xl border border-white/[0.07] divide-y divide-white/[0.07] overflow-hidden">
            {vacanciesAvailable.map((v) => (
              <Link
                key={v.slug}
                href={`/apply/${v.slug}`}
                className="flex items-center justify-between gap-3 px-4 py-3 bg-white/[0.02] hover:bg-sky-500/10 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-sky-300 transition-colors">
                    {v.t}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    📍 {v.l}
                    {v.sm > 0 && <span className="ml-2 text-emerald-400 font-medium">{v.s}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold border rounded px-1.5 py-0.5 text-sky-300 bg-sky-500/10 border-sky-500/30 hidden sm:block">
                    🏠 Housing available
                  </span>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-sky-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            All positions EU citizens only · Apply via WhatsApp · Immediate start
          </p>
        </section>
      )}

      {/* ══ SECTION 2: SINGLE CTA — placed after jobs, not repeated elsewhere ══
          The sticky bar (mobile) and floating pill (desktop) from ApplyBar
          are part of this single instance — there is no second CTA on the page.
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="mb-12">
        <ApplyBar
          context={applyContext}
          headline="Join the waiting list for housing jobs"
          subline="Share your details — we notify you when a matching job with accommodation is found"
          ctaText="Find me a job"
          showInline
          inlineLabel="Can't find the right job yet?"
        />
      </div>

      {/* SECTION 3: AGENCIES WITH HOUSING */}
      <section className="mb-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-bold text-white">Agencies offering housing</h2>
          <Link href="/best-agencies-with-housing-netherlands" className="text-xs text-emerald-400 hover:underline font-medium shrink-0">
            See all →
          </Link>
        </div>

        {agenciesWithJobs.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {agenciesWithJobs.map((agency) => {
              const jobCount = housingListings.filter((l) => l.agencySlug === agency.slug).length;
              return (
                <div key={agency.id} className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-4 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{agency.name}</p>
                      <span className="inline-block text-[10px] font-semibold text-emerald-400 mt-0.5">
                        {accommodationLabel(agency.accommodation)}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2.5 py-1 whitespace-nowrap">
                      {jobCount} job{jobCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {agency.description && (
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                      {agency.description}
                    </p>
                  )}

                  <Link
                    href={`/agencies/${agency.slug}`}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline self-start"
                  >
                    View jobs →
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {agenciesWithoutJobs.length > 0 && (
          <div>
            <p className="text-[11px] text-gray-500 font-medium mb-2 uppercase tracking-wider">
              Also confirmed housing — no active listings right now
            </p>
            <div className="grid sm:grid-cols-3 gap-2">
              {agenciesWithoutJobs.map((agency) => (
                <Link
                  key={agency.id}
                  href={`/agencies/${agency.slug}`}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2.5 flex items-center justify-between hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all"
                >
                  <span className="text-xs font-medium text-gray-300 truncate">{agency.name}</span>
                  <span className="text-[10px] text-emerald-400 shrink-0 ml-2">🏠 →</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4: REALITY / SALARY INFO */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">
          What you actually keep — real numbers
        </h2>

        <div className="rounded-xl overflow-hidden border border-red-700/30 mb-6">
          <div className="bg-red-900/40 px-4 py-3 flex items-center gap-2">
            <span className="text-lg shrink-0">⚠️</span>
            <p className="text-sm font-black text-white">{t("jobs_accommodation.reality_title")}</p>
          </div>
          <div className="bg-white/[0.04] px-4 py-4">
            <div className="grid grid-cols-3 gap-3 text-center mb-3">
              <div className="bg-white/[0.04] rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">{t("jobs_accommodation.reality_gross_label")}</p>
                <p className="text-xl font-black text-gray-100">€600</p>
                <p className="text-[10px] text-gray-400">{t("jobs_accommodation.reality_gross_hours")}</p>
              </div>
              <div className="bg-red-900/20 rounded-lg p-3">
                <p className="text-xs text-red-400 mb-1">{t("jobs_accommodation.reality_costs_label")}</p>
                <p className="text-xl font-black text-red-400">−€357</p>
                <p className="text-[10px] text-red-400/70">{t("jobs_accommodation.reality_costs_note")}</p>
              </div>
              <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-700/30">
                <p className="text-xs text-emerald-400 mb-1 font-bold">{t("jobs_accommodation.reality_keep_label")}</p>
                <p className="text-xl font-black text-emerald-400">€243</p>
                <p className="text-[10px] text-emerald-400/70">{t("jobs_accommodation.reality_keep_note")}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              * {t("jobs_accommodation.reality_footnote")}
            </p>
          </div>
          <div className="bg-white/[0.03] border-t border-white/[0.07] px-4 py-2 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400">{t("jobs_accommodation.reality_enter_rate")}</p>
            <Link href="/tools/real-income-calculator"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 whitespace-nowrap">
              {t("jobs_accommodation.reality_calc_link")}
            </Link>
          </div>
        </div>

        <h3 className="text-sm font-bold text-gray-300 mb-3">Weekly take-home by job type</h3>
        <SalaryGrid />
      </section>

      {/* SECTION 5: CITIES */}
      <section className="mb-8">
        <h3 className="text-sm font-bold text-gray-300 mb-3">Jobs with housing by city</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {HOUSING_CITIES.map((c) => {
            const count = housingListings.filter(
              (l) => l.city.toLowerCase() === c.name.toLowerCase()
            ).length;
            return (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2.5 flex items-center justify-between hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all"
              >
                <span className="text-xs font-medium text-gray-200">{c.name}</span>
                {count > 0 && (
                  <span className="text-[10px] text-emerald-400 font-medium">{count} listing{count !== 1 ? "s" : ""}</span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: CHECKLIST */}
      <section className="mb-8">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <h2 className="font-bold text-amber-300 text-sm mb-2">
            {t("jobs_accommodation.checklist_title")}
          </h2>
          <ul className="text-xs text-amber-200/80 space-y-1.5 leading-relaxed">
            <li>{t("jobs_accommodation.checklist_1")}</li>
            <li>{t("jobs_accommodation.checklist_2")}</li>
            <li>{t("jobs_accommodation.checklist_3", { wml: WML_HOURLY_2026 })}</li>
            <li>{t("jobs_accommodation.checklist_4")}</li>
            <li>{t("jobs_accommodation.checklist_5")}</li>
          </ul>
        </div>
      </section>

      {/* Internal links */}
      <section className="mb-8">
        <h3 className="text-sm font-bold text-gray-300 mb-3">🔗 Related pages</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { href: "/agencies-with-housing",           icon: "🏢", label: "Agencies with housing",           sub: "Compare agencies that include accommodation" },
            { href: "/reach-truck-jobs",                icon: "🚛", label: "Reach truck jobs",                sub: "Certified drivers wanted — housing often included" },
            { href: "/warehouse-jobs-with-accommodation", icon: "📦", label: "Warehouse jobs with housing",   sub: "Order picking, packing, production" },
            { href: "/best-agencies-with-housing-netherlands", icon: "⭐", label: "Best agencies with housing", sub: "Ranked by transparency & housing quality" },
          ].map(({ href, icon, label, sub }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2.5 flex items-center gap-3 hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all"
            >
              <span className="text-xl shrink-0">{icon}</span>
              <div>
                <p className="text-xs font-semibold text-emerald-400">{label} →</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-white mb-3">❓ Frequently asked questions</h2>
        <div className="space-y-2">
          {[
            {
              q: "What jobs in the Netherlands include housing?",
              a: "Jobs in warehousing, food production, logistics, greenhouses, and manufacturing are most commonly offered with included housing. Employment agencies such as Covebo, OTTO Workforce, and Adecco provide accommodation for international workers in regions like Venlo, Tilburg, Breda, and Waalwijk.",
            },
            {
              q: "How much do you keep per week after housing deduction?",
              a: `At Dutch minimum wage (€${WML_HOURLY_2026}/hr, 40h/week = ≈€588 gross), after income tax (~€130/week), agency housing (~€95–€113/week), and transport (~€15/week), most workers keep approximately €290–€360/week net. Positions above minimum wage (forklift, reach truck, night shift) can net €360–€430+/week.`,
            },
            {
              q: "Which employment agencies offer accommodation in the Netherlands?",
              a: "Agencies known for providing housing include Covebo, OTTO Workforce, Manpower, Adecco, Tempo-Team, Unique, and several smaller regional agencies. Housing quality and deduction amounts vary — always confirm the weekly cost, room occupancy, and location before accepting a placement.",
            },
            {
              q: "Is agency accommodation legal and safe?",
              a: "Yes, if it is SNF-certified (Stichting Normering Flexwonen). SNF-certified housing meets minimum standards for room size, safety, and hygiene. The maximum lawful deduction is €113.50/week (2026). Always ask for the SNF registration number before signing a contract.",
            },
            {
              q: "How much does agency housing cost in the Netherlands?",
              a: "Agency housing is typically deducted from your salary at €80–€113/week. The legal maximum under SNF standards is €113.50/week for shared rooms. Some agencies include housing at no charge for the first few weeks. Always request a written breakdown of all deductions before signing.",
            },
            {
              q: "Can I start working in the Netherlands without a BSN number?",
              a: "Yes — but your employer will withhold tax at the anonymous rate (up to 52%) until you register. Apply for a BSN at your local gemeente within your first week. EU citizens can register using their passport or national ID card.",
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="rounded-xl border border-white/[0.07] bg-white/[0.04] overflow-hidden group"
            >
              <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none select-none text-xs font-semibold text-gray-200 hover:bg-white/[0.04] transition-colors">
                {q}
                <span className="shrink-0 text-emerald-400 group-open:rotate-180 transition-transform text-base">▾</span>
              </summary>
              <p className="px-4 pb-4 pt-1 text-xs text-gray-400 leading-relaxed border-t border-white/[0.06]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Trust + footer */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        <span className="text-[9px] font-bold uppercase tracking-widest bg-white/[0.06] text-gray-400 rounded-full px-2.5 py-1">{t("jobs_accommodation.trust_1")}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest bg-white/[0.06] text-gray-400 rounded-full px-2.5 py-1">{t("jobs_accommodation.trust_2")}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest bg-white/[0.06] text-gray-400 rounded-full px-2.5 py-1">{t("jobs_accommodation.trust_3")}</span>
      </div>
      <p className="text-[10px] text-gray-500 text-center">
        {t("jobs_accommodation.footer_note")}
      </p>

    </div>
    </div>
  );
}
