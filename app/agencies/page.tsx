import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import AgencyCard from "@/components/AgencyCard";
import AgencyListClient from "@/components/AgencyListClient";
import { ALL_AGENCIES, ALL_AGENCY_MAP } from "@/lib/agencyEnriched";
import { getJobCountForAgency } from "@/lib/jobData";
import { REVIEW_SEED_DATA } from "@/lib/reviewData";
import { getLocale } from "@/lib/getLocale";
import { getT } from "@/lib/i18n";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "All Employment Agencies Netherlands — AgencyCheck",
  description: `Browse ${ALL_AGENCIES.length} verified employment agencies in the Netherlands. Job counts, housing info, accommodation data, and worker transparency scores.`,
};

// ─── Top agency slugs to feature (most jobs + most recognisable) ──────────────
const TOP_AGENCY_SLUGS = [
  "randstad-nederland",
  "tempo-team-amsterdam-uitzendbureau",
  "otto-workforce",
  "covebo",
];

export const dynamic = "force-dynamic";

export default async function AgenciesPage() {
  const locale = getLocale();
  const t = await getT(locale);

  // ── Build job counts map for every agency ──────────────────────────────
  const jobCounts: Record<string, number> = {};
  for (const agency of ALL_AGENCIES) {
    jobCounts[agency.slug] = getJobCountForAgency(agency.slug);
  }

  // ── Sort: job count DESC → housing YES first → transparency score → name ──
  const sorted = [...ALL_AGENCIES].sort((a, b) => {
    const cA = jobCounts[a.slug] ?? 0;
    const cB = jobCounts[b.slug] ?? 0;
    if (cB !== cA) return cB - cA;                         // most jobs first
    const hA = a.housing === "YES" ? 1 : 0;
    const hB = b.housing === "YES" ? 1 : 0;
    if (hB !== hA) return hB - hA;                         // housing YES first
    if (b.transparencyScore !== a.transparencyScore)       // then transparency
      return b.transparencyScore - a.transparencyScore;
    return a.name.localeCompare(b.name);                   // then A–Z
  });

  // ── De-prioritise: 0 jobs + unknown housing sink to the bottom ─────────────
  // (already handled by the sort above — 0-job unknowns will naturally rank last)

  const totalReviews = REVIEW_SEED_DATA.length; // accurate count from seed data
  const withHousing  = sorted.filter((a) => a.housing === "YES").length;
  const totalIssues  = sorted.reduce((s, a) => s + (a.issueCount ?? 0), 0);
  const totalJobs    = Object.values(jobCounts).reduce((s, n) => s + n, 0);

  // ── Top agencies for featured section ─────────────────────────────────
  const topAgencies = TOP_AGENCY_SLUGS
    .map((slug) => ALL_AGENCY_MAP[slug])
    .filter(Boolean);

  const crumbSchema = breadcrumbSchema([
    { name: "Home",     url: "/" },
    { name: "Agencies", url: "/agencies" },
  ]);
  const listSchema  = collectionPageSchema({
    name:        `Employment Agencies Netherlands (${sorted.length} verified)`,
    description: `Browse ${sorted.length} verified employment agencies in the Netherlands. Compare housing, salary data, job counts, and real worker reviews.`,
    url:         "/agencies",
    itemCount:   sorted.length,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema)  }} />

      <SectionHeader
        title={t("agencies_page.title")}
        subtitle={t("agencies_page.subtitle", { count: sorted.length })}
      />

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: t("agencies_page.stat_total_agencies"),  value: sorted.length, icon: "🏢", href: null             },
          { label: t("agencies_page.stat_with_housing"),    value: withHousing,   icon: "🏠", href: "/agencies-with-housing" },
          { label: t("agencies_page.stat_worker_reviews"),  value: totalReviews,  icon: "⭐", href: null             },
          { label: t("agencies_page.stat_active_jobs"),     value: totalJobs,     icon: "💼", href: null             },
        ].map((stat) => (
          stat.href ? (
            <Link key={stat.label} href={stat.href} className="card p-3 text-center hover:border-brand-100 hover:shadow-md transition-all">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </Link>
          ) : (
            <div key={stat.label} className="card p-3 text-center">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          )
        ))}
      </div>

      {/* ── Review CTA banner ── */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 mb-7 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-800">
            ✍️ {t("agencies_page.cta_no_reviews", { count: sorted.filter((a) => (a.reviewCount ?? 0) === 0).length })}
          </p>
          <p className="text-xs text-brand-600 mt-0.5">
            {t("agencies_page.cta_no_reviews_sub")}
          </p>
        </div>
        <Link href="/share-experience"
          className="shrink-0 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors">
          {t("agencies_page.cta_share")}
        </Link>
      </div>

      {/* ── Top agencies with most jobs ──────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          {t("agencies_page.top_agencies_title")}
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          {t("agencies_page.top_agencies_sub")}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topAgencies.map((agency) => (
            <AgencyCard
              key={agency.id}
              agency={agency}
              jobCount={jobCounts[agency.slug]}
              locale={locale}
            />
          ))}
        </div>
      </section>

      {/* Quick-filter links */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/agencies-with-housing"
          className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1.5 hover:bg-green-100 transition-colors"
        >
          {t("agencies_page.filter_with_housing")}
        </Link>
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200 rounded-full px-3 py-1.5 hover:bg-brand-100 transition-colors"
        >
          {t("agencies_page.filter_compare")}
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-200 transition-colors"
        >
          {t("agencies_page.filter_search")}
        </Link>
      </div>

      {/* ── All agencies — searchable ─────────────────────────────────────────── */}
      <h2 className="text-base font-bold text-gray-900 mb-4">{t("agencies_page.all_agencies_title")}</h2>
      <AgencyListClient agencies={sorted} jobCounts={jobCounts} locale={locale} />

      <p className="mt-8 text-xs text-gray-400 text-center">
        {t("agencies_page.footer_note")}
      </p>
    </div>
  );
}
