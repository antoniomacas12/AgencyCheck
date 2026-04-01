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
        <div key={slug} className="card p-0 overflow-hidden text-center">
          <div className="bg-green-600 px-3 py-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-green-200 mb-0.5">You keep</p>
            <p className="text-2xl font-black text-white">
              €{keepWkly}
              <span className="text-xs font-normal text-green-200">/wk</span>
            </p>
            <p className="text-[9px] text-green-300 mt-0.5">after all costs</p>
          </div>
          <div className="px-3 py-2.5">
            <p className="text-sm mb-1">{j.icon}</p>
            <p className="text-xs font-semibold text-gray-700 mb-1">{j.title}</p>
            <p className="text-[10px] text-gray-400">gross €{j.avg}/hr − €140 housing − tax</p>
            <Link href={`/jobs/${slug}`} className="block mt-2 text-[10px] text-brand-600 hover:underline font-semibold">
              See {j.title.toLowerCase()} jobs →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";

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
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Jobs with housing</span>
      </nav>

      {/* ══ SLIM HEADER ════════════════════════════════════════════════════════ */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏠</span>
          {housingListings.length > 0 && (
            <span className="text-xs bg-green-100 text-green-800 border border-green-200 rounded-full px-2.5 py-1 font-bold">
              {housingListings.length} active listings
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-1">
          Jobs with housing in the Netherlands
        </h1>
        <p className="text-sm text-gray-500">
          Real weekly take-home pay shown after housing, tax &amp; costs.
        </p>
      </div>

      {/* ══ SECTION 1: JOBS WITH HOUSING (ABOVE THE FOLD) ══════════════════════
          This is the primary content — users see real jobs first.
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-bold text-gray-900">
            Available jobs with housing
          </h2>
          <span className="text-[11px] text-gray-400 shrink-0">
            {housingListings.length} listing{housingListings.length !== 1 ? "s" : ""}
          </span>
        </div>

        {housingListings.length > 0 ? (
          <JobsWithHousingList listings={housingListings} />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-sm font-semibold text-gray-700 mb-1">No active listings right now</p>
            <p className="text-xs text-gray-400">
              We update listings regularly — register below and we&apos;ll notify you when new housing jobs appear.
            </p>
          </div>
        )}
      </section>

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

      {/* ══ SECTION 3: AGENCIES WITH HOUSING ═══════════════════════════════════ */}
      <section className="mb-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-bold text-gray-900">Agencies offering housing</h2>
          <Link href="/agencies-with-housing" className="text-xs text-brand-600 hover:underline font-medium shrink-0">
            See all →
          </Link>
        </div>

        {/* Agencies that have active housing job listings */}
        {agenciesWithJobs.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {agenciesWithJobs.map((agency) => {
              const jobCount = housingListings.filter((l) => l.agencySlug === agency.slug).length;
              return (
                <div key={agency.id} className="card p-4 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{agency.name}</p>
                      <span className="inline-block text-[10px] font-semibold text-green-700 mt-0.5">
                        {accommodationLabel(agency.accommodation)}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs font-bold bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 whitespace-nowrap">
                      {jobCount} job{jobCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {agency.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {agency.description}
                    </p>
                  )}

                  <Link
                    href={`/agencies/${agency.slug}`}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline self-start"
                  >
                    View jobs →
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Agencies with confirmed housing but no current listings */}
        {agenciesWithoutJobs.length > 0 && (
          <div>
            <p className="text-[11px] text-gray-400 font-medium mb-2 uppercase tracking-wider">
              Also confirmed housing — no active listings right now
            </p>
            <div className="grid sm:grid-cols-3 gap-2">
              {agenciesWithoutJobs.map((agency) => (
                <Link
                  key={agency.id}
                  href={`/agencies/${agency.slug}`}
                  className="card px-3 py-2.5 flex items-center justify-between hover:border-green-200 hover:bg-green-50/30 transition-all"
                >
                  <span className="text-xs font-medium text-gray-700 truncate">{agency.name}</span>
                  <span className="text-[10px] text-green-600 shrink-0 ml-2">🏠 →</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ══ SECTION 4: REALITY / SALARY INFO (educational — below the fold) ════
          This is secondary content. Users who got here already understand
          the job market. This helps them evaluate offers.
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          What you actually keep — real numbers
        </h2>

        {/* Reality box */}
        <div className="rounded-xl overflow-hidden border-2 border-red-200 mb-6">
          <div className="bg-red-900 text-white px-4 py-3 flex items-center gap-2">
            <span className="text-lg shrink-0">⚠️</span>
            <p className="text-sm font-black">{t("jobs_accommodation.reality_title")}</p>
          </div>
          <div className="bg-white px-4 py-4">
            <div className="grid grid-cols-3 gap-3 text-center mb-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{t("jobs_accommodation.reality_gross_label")}</p>
                <p className="text-xl font-black text-gray-700">€600</p>
                <p className="text-[10px] text-gray-400">{t("jobs_accommodation.reality_gross_hours")}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-500 mb-1">{t("jobs_accommodation.reality_costs_label")}</p>
                <p className="text-xl font-black text-red-600">−€357</p>
                <p className="text-[10px] text-red-400">{t("jobs_accommodation.reality_costs_note")}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
                <p className="text-xs text-green-700 mb-1 font-bold">{t("jobs_accommodation.reality_keep_label")}</p>
                <p className="text-xl font-black text-green-700">€243</p>
                <p className="text-[10px] text-green-600">{t("jobs_accommodation.reality_keep_note")}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              * {t("jobs_accommodation.reality_footnote")}
            </p>
          </div>
          <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500">{t("jobs_accommodation.reality_enter_rate")}</p>
            <Link href="/tools/real-income-calculator"
              className="text-xs font-bold text-brand-600 hover:text-brand-800 whitespace-nowrap">
              {t("jobs_accommodation.reality_calc_link")}
            </Link>
          </div>
        </div>

        {/* Salary grid by job type */}
        <h3 className="text-sm font-bold text-gray-700 mb-3">Weekly take-home by job type</h3>
        <SalaryGrid />
      </section>

      {/* ══ SECTION 5: CITIES ═══════════════════════════════════════════════════ */}
      <section className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Jobs with housing by city</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {HOUSING_CITIES.map((c) => {
            const count = housingListings.filter(
              (l) => l.city.toLowerCase() === c.name.toLowerCase()
            ).length;
            return (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                className="card px-3 py-2.5 flex items-center justify-between hover:border-brand-200 hover:bg-brand-50/30 transition-all"
              >
                <span className="text-xs font-medium text-gray-800">{c.name}</span>
                {count > 0 && (
                  <span className="text-[10px] text-green-700 font-medium">{count} listing{count !== 1 ? "s" : ""}</span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══ SECTION 6: CHECKLIST ════════════════════════════════════════════════ */}
      <section className="mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-bold text-amber-900 text-sm mb-2">
            {t("jobs_accommodation.checklist_title")}
          </h2>
          <ul className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
            <li>{t("jobs_accommodation.checklist_1")}</li>
            <li>{t("jobs_accommodation.checklist_2")}</li>
            <li>{t("jobs_accommodation.checklist_3", { wml: WML_HOURLY_2026 })}</li>
            <li>{t("jobs_accommodation.checklist_4")}</li>
            <li>{t("jobs_accommodation.checklist_5")}</li>
          </ul>
        </div>
      </section>

      {/* Trust + footer */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 rounded-full px-2.5 py-1">{t("jobs_accommodation.trust_1")}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 rounded-full px-2.5 py-1">{t("jobs_accommodation.trust_2")}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 rounded-full px-2.5 py-1">{t("jobs_accommodation.trust_3")}</span>
      </div>
      <p className="text-[10px] text-gray-400 text-center">
        {t("jobs_accommodation.footer_note")}
      </p>

    </div>
  );
}
