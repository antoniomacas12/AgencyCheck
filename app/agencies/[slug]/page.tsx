import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ScoreBadge from "@/components/ScoreBadge";
import HousingBadge from "@/components/HousingBadge";
import SectionHeader from "@/components/SectionHeader";
import SubmitSection from "@/components/forms/SubmitSection";
import VerificationBadge, { type VerificationStatus } from "@/components/VerificationBadge";
import RiskPanel, { buildAgencyRiskSignals } from "@/components/RiskPanel";
import ReviewModal from "@/components/ReviewModal";
import StickyReviewBar from "@/components/StickyReviewBar";
import ApplyBar from "@/components/ApplyBar";
import WorkerReviewCard from "@/components/WorkerReviewCard";
import { ALL_AGENCIES, ALL_AGENCY_MAP, getTransparencyTier, getSectorMeta } from "@/lib/agencyEnriched";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";
import { getTopJobsForAgency, type JobListing } from "@/lib/jobData";
import AgencyRealityCheck from "@/components/AgencyRealityCheck";
import HousingGallery from "@/components/HousingGallery";
import HousingPhotoSubmit from "@/components/HousingPhotoSubmit";
import { getHousingImages } from "@/lib/housingImages";
import { getReviewsByAgency } from "@/lib/reviewData";
import type { WorkerReview } from "@/components/WorkerReviewCard";
import { getQAsForContext } from "@/lib/qaData";
import QAReadSection from "@/components/QAReadSection";
import AgencyTrustPanel from "@/components/AgencyTrustPanel";
import { getLocale } from "@/lib/getLocale";
import { getT } from "@/lib/i18n";
import { AgencyReviewsSection } from "@/components/AgencyReviewsSection";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const agency = ALL_AGENCY_MAP[params.slug];
  if (!agency) return { title: "Agency not found" };
  const housingStr = agency.housing === "YES" ? " Provides housing." : "";
  const cityStr = agency.supportedCities.length > 1
    ? `${agency.city} and ${agency.supportedCities.length - 1} other cities`
    : agency.city;
  return {
    title: `${agency.name} Review — Housing, Salary & Worker Reports — AgencyCheck`,
    description: `Worker transparency report for ${agency.name} in ${cityStr}.${housingStr} Score: ${agency.transparencyScore}/100.`,
    alternates: { canonical: `/agencies/${agency.slug}` },
    openGraph: {
      title: `${agency.name} — AgencyCheck Worker Report`,
      description: `Is ${agency.name} reliable? See worker reviews, housing info, and transparency data.`,
    },
  };
}

function DataRow({ label, value, sub }: { label: string; value: string | ReactNode; sub?: string }) {
  return (
    <div className="flex items-start justify-between gap-2 py-2.5 border-b border-gray-50 last:border-0">
      <p className="text-xs text-gray-500 font-medium w-28 shrink-0">{label}</p>
      <div className="flex-1 text-right">
        <p className="text-sm font-medium text-gray-800">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function JobCard({ job, t }: { job: JobListing; t: (key: string) => string }) {
  const WML = 14.71;
  const salaryValid = job.salaryMin >= WML;
  const housingDed  = job.housing === "YES" ? 140 : 0;
  const keepMin     = salaryValid ? Math.round(job.salaryMin * 40 * 0.78) - housingDed : null;
  const keepMax     = salaryValid ? Math.round(job.salaryMax * 40 * 0.78) - housingDed : null;
  return (
    <Link href={`/jobs/${job.slug}`}
      className="card p-0 hover:shadow-md hover:border-green-200 transition-all hover:-translate-y-0.5 flex flex-col overflow-hidden">
      {keepMin !== null && keepMax !== null ? (
        <div className="bg-green-600 px-3.5 pt-2.5 pb-2">
          <p className="text-[8px] font-black uppercase tracking-widest text-green-200 mb-0.5">
            {t("agency_detail.job_card_keep")}
          </p>
          <p className="text-xl font-black text-white leading-none">
            €{keepMin}–€{keepMax}
            <span className="text-xs font-normal text-green-200">/week</span>
          </p>
        </div>
      ) : (
        <div className="bg-gray-100 px-3.5 pt-2.5 pb-2">
          <p className="text-xs font-medium text-gray-500">{t("agency_detail.job_card_no_estimate")}</p>
        </div>
      )}
      <div className="px-3.5 py-2.5 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base shrink-0">{job.icon}</span>
          <p className="text-sm font-semibold text-gray-900 truncate">{job.title}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
          <span>📍 {job.city}</span>
          {job.housing === "YES" && <span className="bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{t("agency_detail.job_card_housing")}</span>}
          {job.transport === "YES" && <span className="bg-blue-50 text-blue-700 rounded-full px-2 py-0.5">{t("agency_detail.job_card_transport")}</span>}
        </div>
        {salaryValid && (
          <p className="text-[10px] text-gray-400">gross €{job.salaryMin.toFixed(2)}–€{Math.max(job.salaryMax, job.salaryMin).toFixed(2)}/hr</p>
        )}
        <span className="text-xs text-brand-600 font-medium">{t("agency_detail.job_card_view")}</span>
      </div>
    </Link>
  );
}

function accommodationLabel(acc: string, t: (key: string) => string): { text: string; sub?: string } {
  switch (acc) {
    case "confirmed_with_deduction": return { text: t("agency_detail.acc_confirmed_deduction"),    sub: t("agency_detail.acc_confirmed_deduction_sub") };
    case "confirmed_no_deduction":   return { text: t("agency_detail.acc_confirmed_no_deduction"), sub: t("agency_detail.acc_confirmed_no_deduction_sub") };
    case "not_provided":             return { text: t("agency_detail.acc_not_provided") };
    case "unverified_claim":         return { text: t("agency_detail.acc_unverified"),              sub: t("agency_detail.acc_unverified_sub") };
    default:                         return { text: t("agency_detail.acc_unknown"),                 sub: t("agency_detail.acc_unknown_sub") };
  }
}

function ConfidenceBadge({ level, t }: { level: string; t: (key: string) => string }) {
  const cfg: Record<string, { key: string; cls: string }> = {
    high:     { key: "agency_detail.confidence_high",      cls: "bg-green-50 text-green-700"   },
    medium:   { key: "agency_detail.confidence_medium",    cls: "bg-amber-50 text-amber-700"   },
    low:      { key: "agency_detail.confidence_low",       cls: "bg-orange-50 text-orange-700" },
    very_low: { key: "agency_detail.confidence_very_low",  cls: "bg-red-50 text-red-700"       },
  };
  const item = cfg[level] ?? cfg.low;
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.cls}`}>{t(item.key)}</span>;
}

function ReviewSummary({ reviews, t }: { reviews: ReturnType<typeof getReviewsByAgency>; t: (key: string) => string }) {
  if (reviews.length === 0) return null;
  const avg = (key: keyof typeof reviews[0]) =>
    reviews.reduce((s, r) => s + ((r[key] as number) || 0), 0) / reviews.length;
  const overall = avg("overallRating");

  function Bar({ label, val }: { label: string; val: number }) {
    const pct   = Math.round((val / 5) * 100);
    const color = val >= 4 ? "bg-green-400" : val >= 3 ? "bg-amber-400" : "bg-red-400";
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-semibold text-gray-700 w-6 text-right">{val.toFixed(1)}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-4">
        <div className="text-center shrink-0">
          <p className="text-3xl font-black text-gray-900 leading-none">{overall.toFixed(1)}</p>
          <div className="flex gap-0.5 justify-center mt-1">
            {[1,2,3,4,5].map((s) => (
              <svg key={s} className={`w-3 h-3 ${s <= Math.round(overall) ? "text-amber-400" : "text-gray-200"}`}
                fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex-1 space-y-1.5">
          <Bar label={t("agency_detail.summary_salary")}     val={avg("salaryRating")} />
          <Bar label={t("agency_detail.summary_management")} val={avg("managementRating")} />
          <Bar label={t("agency_detail.summary_contract")}   val={avg("contractClarityRating")} />
        </div>
      </div>
    </div>
  );
}

export default async function AgencyPage({ params }: { params: { slug: string } }) {
  const agency = ALL_AGENCY_MAP[params.slug];
  if (!agency) notFound();

  const locale = getLocale();
  const t = await getT(locale);

  const sectorMeta       = getSectorMeta(agency.sector);
  const transparencyTier = getTransparencyTier(agency.transparencyScore);
  const accLabel         = accommodationLabel(agency.accommodation, t);
  const homepage         = agency.webPages?.homepage ?? agency.website ?? null;
  const jobsPage         = agency.webPages?.jobs;
  const housingPage      = agency.webPages?.housing;
  const contactPage      = agency.webPages?.contact;
  const housingVs        = (agency.housingVerification?.status ?? "unknown") as VerificationStatus;
  const housingSource    = agency.housingVerification?.source_url;
  const riskSignals      = buildAgencyRiskSignals({
    housing:    agency.housing,
    transport:  agency.transport,
    issueCount: agency.issueCount ?? 0,
    description: agency.description,
    housingVerification: { status: housingVs },
  });
  const isAboveWML    = !agency.avgHourlyPay || agency.avgHourlyPay >= WML_HOURLY_2026;
  const activeJobs    = getTopJobsForAgency(params.slug, 8);
  const housingImages = getHousingImages(params.slug);
  const cityDisplay   = agency.city !== "unknown" ? agency.city : "Netherlands";

  const seedReviews = getReviewsByAgency(params.slug);
  const reviewCount = seedReviews.length;

  const allQAs = getQAsForContext(params.slug);

  const reviews: WorkerReview[] = seedReviews
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map((r, i) => ({
      id:                    `seed-${params.slug}-${i}`,
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
    }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 sm:pb-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">{t("agency_detail.breadcrumb_home")}</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">{t("agency_detail.breadcrumb_agencies")}</Link>
        {agency.city && agency.city !== "unknown" && (
          <><span>›</span><Link href={`/cities/${agency.city.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-brand-600">{agency.city}</Link></>
        )}
        <span>›</span>
        <span className="text-gray-600 truncate max-w-[180px]">{agency.name}</span>
      </nav>

      {/* Header card */}
      <div className="card p-5 mb-5">
        <div className="flex items-start gap-4">
          <ScoreBadge score={agency.score} reviewCount={agency.reviewCount} size="lg" showLabel showBar />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{agency.name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-sm text-gray-500">
                📍 {cityDisplay}
                {agency.supportedCities.length > 1 && (
                  <span className="text-gray-400"> {t("agency_detail.more_cities").replace("{count}", String(agency.supportedCities.length - 1))}</span>
                )}
              </p>
              <ConfidenceBadge level={agency.confidenceLevel} t={t} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <HousingBadge housing={agency.housing} />
              {sectorMeta && (
                <Link href={`/sectors/${sectorMeta.slug}`} className="housing-badge bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                  {sectorMeta.icon} {sectorMeta.label}
                </Link>
              )}
              {transparencyTier && (
                <span className={`housing-badge ${transparencyTier.bg} ${transparencyTier.color}`}>
                  🔍 {transparencyTier.label} ({agency.transparencyScore}/100)
                </span>
              )}
              {!isAboveWML && <span className="housing-badge bg-red-100 text-red-700 font-semibold">{t("agency_detail.badge_below_wml")}</span>}
            </div>
            {agency.jobFocus.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {agency.jobFocus.map((jf) => (
                  <Link key={jf} href={`/jobs/${jf}`}
                    className="text-[10px] bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-2 py-0.5 hover:bg-gray-100 transition-colors">
                    {jf.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {homepage    && <a href={homepage}    target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 border border-brand-200 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors">{t("agency_detail.official_website")}</a>}
          {jobsPage    && <a href={jobsPage}    target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 border border-brand-200 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors">{t("agency_detail.job_listings_link")}</a>}
          {housingPage && <a href={housingPage} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 border border-green-200 rounded-full px-3 py-1 hover:bg-green-50 transition-colors">{t("agency_detail.housing_info_link")}</a>}
          {contactPage && <a href={contactPage} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors">{t("agency_detail.contact_link")}</a>}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4">
          <Link href={`/agencies/${agency.slug}/reviews`} className="text-xs text-brand-600 font-semibold hover:underline">{t("agency_detail.all_reviews_salary_link")}</Link>
          <Link href={`/compare?agencies=${agency.slug}`} className="text-xs text-gray-500 hover:text-brand-600 hover:underline">{t("agency_detail.compare_link")}</Link>
        </div>
      </div>

      {/* ══ WORKER TRUST PANEL ══ */}
      <section className="mb-5">
        <AgencyTrustPanel
          agencySlug={params.slug}
          agencyName={agency.name}
          hasHousing={agency.housing === "YES"}
          avgHourlyPay={agency.avgHourlyPay ?? null}
        />
      </section>

      {/* ══ WORKERS REPORT ══ */}
      <section className="mb-5">
        <div className="rounded-xl overflow-hidden border-2 border-gray-900">
          <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{t("agency_detail.workers_report_label")}</p>
              <p className="text-sm font-bold">{t("agency_detail.workers_report_title").replace("{agencyName}", agency.name)}</p>
            </div>
            <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-1 rounded-full font-medium">
              {t("agency_detail.workers_report_badge")}
            </span>
          </div>

          <div className="divide-y divide-gray-100 bg-white">

            {/* Housing cost */}
            <div className="flex items-start justify-between px-4 py-3.5 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">🏠</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t("agency_detail.housing_cost_label")}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t("agency_detail.housing_cost_sub")}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                {agency.housing === "YES" ? (
                  <>
                    <p className="text-base font-black text-orange-600">{t("agency_detail.housing_cost_range")}</p>
                    <p className="text-[10px] text-gray-400">{t("agency_detail.housing_cost_typical")}</p>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-gray-400">{t("agency_detail.not_provided")}</p>
                )}
              </div>
            </div>

            {/* People per accommodation */}
            <div className="flex items-start justify-between px-4 py-3.5 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">👥</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t("agency_detail.people_per_room_label")}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t("agency_detail.people_per_room_sub")}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                {agency.housing === "YES" ? (
                  <>
                    <p className="text-base font-black text-gray-800">{t("agency_detail.people_per_room_count")}</p>
                    <p className="text-[10px] text-gray-400">{t("agency_detail.people_per_room_typical")}</p>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-gray-400">{t("agency_detail.not_applicable")}</p>
                )}
              </div>
            </div>

            {/* Transport */}
            <div className="flex items-start justify-between px-4 py-3.5 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">🚌</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t("agency_detail.transport_cost_label")}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t("agency_detail.transport_cost_sub")}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                {agency.transport === "YES" ? (
                  <>
                    <p className="text-base font-black text-orange-600">{t("agency_detail.transport_cost_range")}</p>
                    <p className="text-[10px] text-gray-400">{t("agency_detail.transport_typical")}</p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-black text-gray-800">{t("agency_detail.transport_ask")}</p>
                    <p className="text-[10px] text-gray-400">{t("agency_detail.transport_unconfirmed")}</p>
                  </>
                )}
              </div>
            </div>

            {/* Real net estimate */}
            <div className="flex items-start justify-between px-4 py-3.5 gap-4 bg-brand-50">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">💶</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t("agency_detail.takehome_label")}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t("agency_detail.takehome_sub")}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-black text-brand-700">{t("agency_detail.takehome_range")}</p>
                <p className="text-[10px] text-gray-400">{t("agency_detail.takehome_after")}</p>
              </div>
            </div>

            {/* Notes / warning */}
            <div className="px-4 py-3 bg-amber-50 flex items-start gap-2">
              <span className="text-amber-500 shrink-0 text-sm mt-0.5">⚠️</span>
              <div>
                <p className="text-xs font-semibold text-amber-900">{t("agency_detail.confirm_warning")}</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  {t("agency_detail.confirm_warning_text")}
                  {agency.housing === "YES" && ` ${t("agency_detail.confirm_warning_text_housing")}`}
                </p>
              </div>
            </div>
          </div>

          {/* Calculator CTA */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <a href="/tools/real-income-calculator"
              className="flex items-center justify-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-800">
              {t("agency_detail.calc_cta").replace("{agencyName}", agency.name)}
            </a>
            <p className="text-[9px] text-gray-400 text-center mt-1.5">
              {t("agency_detail.calc_disclaimer")}
            </p>
          </div>
        </div>
      </section>

      {/* ══ COMMON WORKER PROBLEMS ══ */}
      <section className="mb-5">
        <div className="rounded-xl overflow-hidden border border-red-200">
          <div className="bg-red-900 text-white px-4 py-3 flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-300 mb-0">{t("agency_detail.issues_label")}</p>
              <p className="text-sm font-bold">{t("agency_detail.issues_title").replace("{agencyName}", agency.name)}</p>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-100">
            {[
              {
                icon: "🛏️",
                label: t("agency_detail.issue_shared_rooms"),
                detail: t("agency_detail.issue_shared_rooms_detail"),
                severity: "high",
              },
              {
                icon: "💸",
                label: t("agency_detail.issue_housing_deduction"),
                detail: t("agency_detail.issue_housing_deduction_detail"),
                severity: "high",
              },
              {
                icon: "🚌",
                label: t("agency_detail.issue_transport"),
                detail: t("agency_detail.issue_transport_detail"),
                severity: "medium",
              },
              {
                icon: "🏚️",
                label: t("agency_detail.issue_poor_housing"),
                detail: t("agency_detail.issue_poor_housing_detail"),
                severity: "high",
              },
              {
                icon: "📄",
                label: t("agency_detail.issue_contract"),
                detail: t("agency_detail.issue_contract_detail"),
                severity: "medium",
              },
            ].map((issue) => (
              <div key={issue.label} className="flex items-start gap-3 px-4 py-3">
                <span className="text-lg shrink-0 mt-0.5">{issue.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900 leading-snug">{issue.label}</p>
                    {issue.severity === "high" && (
                      <span className="text-[9px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full shrink-0 mt-0.5">
                        {t("agency_detail.issue_badge_frequent")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{issue.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-red-50 px-4 py-3 border-t border-red-100 flex items-center justify-between gap-3">
            <p className="text-xs text-red-700 font-medium">{t("agency_detail.issue_experienced_cta").replace("{agencyName}", agency.name)}</p>
            <ReviewModal agencySlug={params.slug} agencyName={agency.name} reviewCount={reviewCount} variant="pill" />
          </div>
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-[9px] text-gray-400 text-center">
              ⚠️ {t("agency_detail.issue_disclaimer").replace("{agencyName}", agency.name)}
            </p>
          </div>
        </div>
      </section>

      {/* ══ REVIEW CTA ══ */}
      <div className="mb-6">
        <ReviewModal agencySlug={params.slug} agencyName={agency.name} reviewCount={reviewCount} fullWidth />
        <p className="text-[10px] text-gray-400 text-center mt-1.5 leading-relaxed">
          {t("agency_detail.review_cta_sub")}
        </p>
      </div>

      {/* ══ WORKER Q&A ══ */}
      <section className="mb-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800">{t("agency_detail.qa_title").replace("{agencyName}", agency.name)}</h2>
        </div>
        <QAReadSection agencySlug={params.slug} agencyName={agency.name} initialQAs={allQAs} />
      </section>

      {/* Active Jobs */}
      <section className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800">{t("agency_detail.jobs_title").replace("{agencyName}", agency.name)}</h2>
          {activeJobs.length > 0 && (
            <Link href={`/agencies/${agency.slug}/jobs`} className="text-xs text-brand-600 font-medium hover:underline shrink-0">{t("agency_detail.jobs_all_link")}</Link>
          )}
        </div>
        {activeJobs.length === 0 ? (
          <div className="card p-5 text-center">
            <p className="text-2xl mb-2">💼</p>
            <p className="text-sm text-gray-600 font-medium">{t("agency_detail.jobs_empty_title")}</p>
            <p className="text-xs text-gray-400 mt-1">{t("agency_detail.jobs_empty_sub")}</p>
            {homepage && <a href={homepage} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs text-brand-600 font-semibold hover:underline">{t("agency_detail.jobs_visit").replace("{agencyName}", agency.name)}</a>}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              {activeJobs.map((job) => <JobCard key={job.slug} job={job} t={t} />)}
            </div>
            <div className="mt-3 text-center">
              <Link href={`/agencies/${agency.slug}/jobs`} className="inline-block text-sm text-brand-600 font-semibold hover:underline">
                {t("agency_detail.jobs_all_link_full").replace("{agencyName}", agency.name)}
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ── City job links — internal linking to /jobs-in-[city] pages ─────── */}
      {agency.supportedCities.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400 font-medium shrink-0">Jobs by city:</span>
          {agency.supportedCities.slice(0, 8).map((citySlug) => (
            <Link
              key={citySlug}
              href={`/jobs-in-${citySlug}`}
              className="inline-flex items-center text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1 hover:border-brand-300 hover:text-brand-700 transition-colors"
            >
              💼 {citySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </Link>
          ))}
          {agency.supportedCities.length > 8 && (
            <span className="text-xs text-gray-400">+{agency.supportedCities.length - 8} more</span>
          )}
        </div>
      )}

      {/* ══ WORKER REVIEWS ══ */}
      <section className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800">
            {t("agency_detail.reviews_title")}
            {reviewCount > 0 && <span className="ml-2 text-xs font-normal text-gray-400">{t("agency_detail.reviews_count").replace("{count}", String(reviewCount))}</span>}
          </h2>
          {reviewCount > 0 && (
            <Link href={`/agencies/${agency.slug}/reviews`} className="text-xs text-brand-600 font-medium hover:underline shrink-0">{t("agency_detail.reviews_all_link")}</Link>
          )}
        </div>

        {reviews.length > 0 ? (
          <>
            <ReviewSummary reviews={seedReviews} t={t} />
            <div className="space-y-3">
              {reviews.map((review) => <WorkerReviewCard key={review.id} review={review} locale={locale} />)}
            </div>
            {reviewCount > 5 && (
              <div className="text-center mt-3">
                <Link href={`/agencies/${agency.slug}/reviews`} className="text-sm text-brand-600 hover:underline">
                  {t("agency_detail.reviews_view_all").replace("{count}", String(reviewCount))}
                </Link>
              </div>
            )}
            <div className="mt-4 bg-brand-50 border border-brand-100 rounded-xl p-3 flex items-center gap-3">
              <span className="text-lg shrink-0">✍️</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-brand-800">{t("agency_detail.reviews_worked_here")}</p>
                <p className="text-xs text-brand-600 mt-0.5">{t("agency_detail.reviews_worked_here_sub")}</p>
              </div>
              <ReviewModal agencySlug={params.slug} agencyName={agency.name} reviewCount={reviewCount} />
            </div>
          </>
        ) : (
          <div className="card p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className="w-7 h-7 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{t("agency_detail.reviews_empty_title").replace("{agencyName}", agency.name)}</p>
                <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">{t("agency_detail.reviews_empty_sub")}</p>
              </div>
              <div className="flex flex-col gap-1.5 text-left w-full max-w-xs">
                {[
                  t("agency_detail.reviews_point_anon"),
                  t("agency_detail.reviews_point_time"),
                  t("agency_detail.reviews_point_helps"),
                  t("agency_detail.reviews_point_no_account"),
                ].map((pt) => (
                  <div key={pt} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="text-green-500">✓</span>{pt}
                  </div>
                ))}
              </div>
              <ReviewModal agencySlug={params.slug} agencyName={agency.name} reviewCount={0} fullWidth />
            </div>
          </div>
        )}
      </section>

      {/* ══ REAL USER REVIEWS (from DB — submit + published) ══ */}
      <section className="mb-5">
        <AgencyReviewsSection agencySlug={params.slug} agencyName={agency.name} />
      </section>

      {/* Key Facts */}
      <section className="mb-5">
        <div className="card p-4">
          <h2 className="text-sm font-bold text-gray-800 mb-4">{t("agency_detail.keyfacts_title")}</h2>
          <DataRow label={t("agency_detail.keyfacts_accommodation")} value={accLabel.text} sub={accLabel.sub} />
          {sectorMeta && (
            <DataRow label={t("agency_detail.keyfacts_agency_type")}
              value={<Link href={`/sectors/${sectorMeta.slug}`} className="text-brand-600 hover:underline">{sectorMeta.icon} {sectorMeta.label}</Link>}
            />
          )}
          {agency.jobFocus.length > 0 && <DataRow label={t("agency_detail.keyfacts_job_focus")} value={agency.jobFocus.map((jf) => jf.replace(/-/g, " ")).join(" · ")} />}
          <DataRow
            label={t("agency_detail.keyfacts_active_cities")}
            value={agency.supportedCities.length > 0
              ? agency.supportedCities.map((c) => c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " ")).join(", ")
              : cityDisplay}
          />
          {agency.phone && <DataRow label={t("agency_detail.keyfacts_phone")} value={<a href={`tel:${agency.phone.replace(/\s/g, "")}`} className="text-brand-600 hover:underline">{agency.phone}</a>} />}
          {agency.email && <DataRow label={t("agency_detail.keyfacts_email")} value={<a href={`mailto:${agency.email}`} className="text-brand-600 hover:underline truncate block max-w-[200px] ml-auto">{agency.email}</a>} />}
          {agency.address && <DataRow label={t("agency_detail.keyfacts_address")} value={agency.address} />}
          <DataRow
            label={t("agency_detail.keyfacts_data_quality")}
            value={<span className={transparencyTier?.color}>{transparencyTier?.label} ({agency.transparencyScore}/100)</span>}
            sub={t("agency_detail.keyfacts_data_quality_sub")}
          />
          <DataRow label={t("agency_detail.keyfacts_research_level")} value={<ConfidenceBadge level={agency.confidenceLevel} t={t} />} sub={t("agency_detail.keyfacts_research_sub")} />
          <DataRow
            label={t("agency_detail.keyfacts_avg_pay")}
            value={agency.avgHourlyPay ? `€${agency.avgHourlyPay.toFixed(2)}/hr` : t("agency_detail.keyfacts_no_pay_data")}
            sub={t("agency_detail.keyfacts_wml").replace("{rate}", String(WML_HOURLY_2026))}
          />
          <DataRow
            label={t("agency_detail.keyfacts_open_issues")}
            value={(agency.issueCount ?? 0) > 0
              ? <span className="text-red-600 font-bold">{t("agency_detail.keyfacts_issues_count").replace("{count}", String(agency.issueCount))}</span>
              : <span className="text-green-700">{t("agency_detail.keyfacts_issues_none")}</span>}
          />
        </div>
      </section>

      {/* ── Housing photos section ── */}
      <section className="mb-5">
        <div className="card p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              {t("agency_detail.housing_photos_title")}
              <span className="text-[10px] font-normal text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">{t("agency_detail.housing_photos_badge")}</span>
            </h2>
            <HousingPhotoSubmit agencySlug={params.slug} agencyName={agency.name} variant="button" />
          </div>

          {housingImages.length > 0 ? (
            <>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                {t("agency_detail.housing_photos_real").replace("{agencyName}", agency.name)}
              </p>
              <HousingGallery images={housingImages} agencyName={agency.name} />
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2 font-medium">{t("agency_detail.housing_photos_have_photos")}</p>
                <HousingPhotoSubmit agencySlug={params.slug} agencyName={agency.name} variant="cta" />
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                {t("agency_detail.housing_photos_empty").replace("{agencyName}", agency.name)}
                {agency.housing === "YES"
                  ? ` ${t("agency_detail.housing_photos_empty_has_housing")}`
                  : ` ${t("agency_detail.housing_photos_empty_no_housing")}`
                }
              </p>
              <HousingPhotoSubmit agencySlug={params.slug} agencyName={agency.name} variant="cta" />
            </>
          )}
        </div>
      </section>

      <section className="mb-5">
        <RiskPanel signals={riskSignals} title={t("agency_detail.risk_title")} />
      </section>

      <section className="mb-6">
        <SectionHeader title={t("agency_detail.salary_reports_title")} subtitle={t("agency_detail.salary_reports_sub")} />
        <div className="card p-5 text-center">
          <p className="text-3xl mb-2">💶</p>
          <p className="text-sm font-semibold text-gray-700">{t("agency_detail.salary_reports_empty")}</p>
          <p className="text-xs text-gray-400 mt-1">
            {t("agency_detail.salary_reports_what_pays").replace("{agencyName}", agency.name)}
            {agency.jobFocus.length > 0 && ` Focus: ${agency.jobFocus.map((jf) => jf.replace(/-/g, " ")).join(", ")}.`}
          </p>
          <Link href="#submit" className="inline-block mt-3 text-xs text-brand-600 font-semibold hover:underline">{t("agency_detail.salary_reports_cta")}</Link>
        </div>
      </section>

      <section className="mb-6">
        <SectionHeader title={t("agency_detail.complaints_title")} subtitle={t("agency_detail.complaints_sub")} />
        {(agency.issueCount ?? 0) === 0 ? (
          <div className="card p-5 text-center">
            <p className="text-3xl mb-2">🟢</p>
            <p className="text-sm font-semibold text-gray-700">{t("agency_detail.complaints_empty")}</p>
            <p className="text-xs text-gray-400 mt-1">{t("agency_detail.complaints_empty_sub").replace("{agencyName}", agency.name)}</p>
          </div>
        ) : (
          <div className="card p-4">
            <p className="text-sm text-gray-700">
              {(agency.issueCount ?? 0) === 1
                ? t("agency_detail.complaints_count").replace("{count}", String(agency.issueCount))
                : t("agency_detail.complaints_count_plural").replace("{count}", String(agency.issueCount))}
            </p>
            <Link href={`/agencies/${agency.slug}/reviews`} className="text-xs text-brand-600 hover:underline mt-2 inline-block">{t("agency_detail.complaints_link")}</Link>
          </div>
        )}
      </section>

      <section className="mb-5">
        <div className="card p-4">
          <h2 className="text-sm font-bold text-gray-800 mb-4">{t("agency_detail.transparency_title")}</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-gray-600 font-medium">{t("agency_detail.transparency_acc_source")}</p>
              <VerificationBadge status={housingVs} sourceUrl={housingSource} />
            </div>
            {agency.website && (
              <div className="border-t border-gray-50 pt-3 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs text-gray-500">
                  {t("agency_detail.transparency_official")}{" "}
                  <a href={agency.website} target="_blank" rel="noopener noreferrer" className="underline text-brand-600 hover:text-brand-700">
                    {agency.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </p>
                <span className="text-xs text-gray-400">{t("agency_detail.transparency_verified")}</span>
              </div>
            )}
            <div className="border-t border-gray-50 pt-3">
              <p className="text-xs text-gray-400">
                ℹ️ {t("agency_detail.transparency_confidence").replace("{level}", agency.confidenceLevel)}
                {agency.confidenceLevel === "very_low" || agency.confidenceLevel === "low"
                  ? ` ${t("agency_detail.transparency_low_note")}`
                  : ` ${t("agency_detail.transparency_high_note")}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <AgencyRealityCheck
          agencySlug={params.slug}
          agencyName={agency.name}
          hasHousing={agency.housing === "YES"}
          hasTransport={agency.transport === "YES"}
        />
      </section>

      <div id="submit">
        <SubmitSection agencySlug={params.slug} agencyName={agency.name} />
      </div>

      <section className="mt-4 mb-4">
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-brand-800 mb-1">{t("agency_detail.calc_cta_title")}</p>
          <p className="text-xs text-brand-600 mb-3 leading-relaxed">{t("agency_detail.calc_cta_sub")}</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/tools/salary-calculator" className="text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg transition-colors">{t("agency_detail.calc_weekly")}</Link>
            {agency.housing === "YES" && (
              <Link href="/tools/accommodation-costs" className="text-xs font-semibold border border-brand-200 text-brand-700 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors">{t("agency_detail.calc_accommodation")}</Link>
            )}
            <Link href="/tools/payslip-checker" className="text-xs font-medium text-brand-600 hover:underline px-2 py-1.5">{t("agency_detail.calc_payslip")}</Link>
          </div>
        </div>
      </section>

      <section className="mt-6 mb-4">
        <div className="card p-4">
          <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">{t("agency_detail.rights_title")}</h3>
          <div className="space-y-2">
            {[
              { label: t("agency_detail.rights_fnv"),      href: "https://www.fnv.nl"                  },
              { label: t("agency_detail.rights_snf"),      href: "https://www.normeringflexwonen.nl"    },
              { label: t("agency_detail.rights_szw_info"), href: "https://www.nlarbeidsinspectie.nl"    },
              { label: t("agency_detail.rights_szw_report"), href: "https://www.inspectieszw.nl/contact" },
            ].map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-brand-600 hover:underline">
                <span className="text-gray-300">→</span> {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {agency.city && agency.city !== "unknown" && (
        <div className="text-center mt-4 mb-6">
          <Link href={`/cities/${agency.city.toLowerCase().replace(/[\s']/g, "-")}`} className="text-sm text-brand-600 hover:underline">
            {t("agency_detail.see_all_cities").replace("{city}", agency.city)}
          </Link>
        </div>
      )}

      <div className="text-xs text-gray-400 text-center mt-8 px-2 leading-relaxed">
        {t("agency_detail.footer_disclaimer")}{" "}
        <a href="https://www.fnv.nl" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-600">{t("agency_detail.footer_contact_fnv")}</a>{" "}
        {t("agency_detail.footer_contact_or")}
      </div>

      <StickyReviewBar agencySlug={params.slug} agencyName={agency.name} reviewCount={reviewCount} />

      {/* Apply bar — only shown for agencies with confirmed housing */}
      {agency.housing === "YES" && (
        <ApplyBar
          context={{
            sourcePage: `/agencies/${params.slug}`,
            sourceType: "agency_page",
            sourceSlug: params.slug,
            sourceLabel: `${agency.name} agency page`,
          }}
          headline={`Interested in jobs at ${agency.name} with accommodation?`}
          subline="Share your details — we&apos;ll match you when a suitable opportunity is available"
          ctaText="Find me a job"
          showInline
          inlineLabel="Looking to work here?"
        />
      )}
    </div>
  );
}
