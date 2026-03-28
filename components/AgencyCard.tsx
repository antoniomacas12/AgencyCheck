"use client";

import Link from "next/link";
import ScoreBadge from "./ScoreBadge";
import HousingBadge from "./HousingBadge";
import QuickRateButton from "./QuickRateButton";
import type { AgencyCardData } from "@/lib/agencyData";
import { useT, type Locale } from "@/lib/i18n";

// Number of "review needed" nudge shown on cards with 0 reviews
const REVIEW_NEEDED_THRESHOLD = 3;

// Re-export so existing imports of AgencyCardData from this component still work
export type { AgencyCardData };

interface AgencyCardProps {
  agency: AgencyCardData;
  /** Pre-computed job count for this agency (passed from server to avoid re-fetching) */
  jobCount?: number;
  /** Locale to use for translations. Server pages pass getLocale(); client parents pass their
   *  own locale. Defaults to "en" so it is always safe to omit. */
  locale?: Locale;
}

// ─── Star rating ──────────────────────────────────────────────────────────────

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(value) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export default function AgencyCard({ agency, jobCount, locale = "en" }: AgencyCardProps) {
  const t = useT(locale);

  const hasIssues    = (agency.issueCount ?? 0) > 0;
  const needsReviews = (agency.reviewCount ?? 0) < REVIEW_NEEDED_THRESHOLD;

  // Use the "overlay link" pattern so we can have a secondary Rate link
  // without nesting <a> tags (invalid HTML) or needing "use client"
  return (
    <div className="group relative">
      {/* Full-card invisible link — sits behind all other content */}
      <Link
        href={`/agencies/${agency.slug}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={`View ${agency.name}`}
      />
      <div className="card p-4 hover:shadow-md hover:border-brand-100 transition-all duration-200 group-hover:-translate-y-0.5 h-full flex flex-col pointer-events-none">
        <div className="flex items-start gap-3">

          {/* Score badge — hidden when review data is too limited to be meaningful */}
          <div className="shrink-0">
            <ScoreBadge score={agency.score} reviewCount={agency.reviewCount} size="md" />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Name + issue alert */}
            <div className="flex items-start gap-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-brand-600 transition-colors truncate flex-1">
                {agency.name}
              </h3>
              {hasIssues && (
                <span
                  className="shrink-0 text-[10px] font-semibold bg-red-100 text-red-600 rounded-full px-1.5 py-0.5 leading-none"
                  title={`${agency.issueCount} open issue${agency.issueCount !== 1 ? "s" : ""}`}
                >
                  {agency.issueCount} ⚠️
                </span>
              )}
            </div>

            {/* City + cities */}
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              📍 {agency.city ?? agency.cities?.[0] ?? "NL"}
              {agency.cities && agency.cities.length > 1 && (
                <span className="text-gray-400"> +{agency.cities.length - 1}</span>
              )}
            </p>

            {/* Description */}
            {agency.description && (
              <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">
                {agency.description}
              </p>
            )}

            {/* Footer row */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">

              {/* Housing badge */}
              <HousingBadge housing={agency.housing} size="sm" />
              {/* Transport badge */}
              {agency.transport === "YES" && (
                <span className="text-xs font-medium bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">🚌</span>
              )}

              {/* Hourly pay — shown when available, takes priority over star rating */}
              {agency.avgHourlyPay != null ? (
                <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                  ~€{agency.avgHourlyPay.toFixed(2)}/hr
                </span>
              ) : agency.avgSalaryRating != null ? (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <StarRating value={agency.avgSalaryRating} />
                  <span>{agency.avgSalaryRating.toFixed(1)}</span>
                </span>
              ) : null}

              {/* Job count badge — shown when > 0 */}
              {jobCount != null && jobCount > 0 && (
                <span className="text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">
                  {t("agency_card.jobs_badge", { count: jobCount, plural: jobCount !== 1 ? "s" : "" })}
                </span>
              )}

              {/* Review count */}
              <span className="text-xs text-gray-400 ml-auto">
                {t("agency_card.worker_reviews", { count: agency.reviewCount, plural: agency.reviewCount !== 1 ? "s" : "" })}
              </span>
            </div>
          </div>
        </div>

        {/* ── Rate nudge row — pointer-events-auto to receive clicks above the overlay ── */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between gap-2 pointer-events-auto relative z-10">
          {needsReviews ? (
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
              {t("agency_card.needs_reviews")}
            </span>
          ) : (
            <span className="text-[10px] text-gray-400">{t("agency_card.worker_reviews", { count: agency.reviewCount, plural: agency.reviewCount !== 1 ? "s" : "" })}</span>
          )}
          <QuickRateButton
            agencySlug={agency.slug}
            agencyName={agency.name}
            reviewCount={agency.reviewCount ?? 0}
            variant="pill"
          />
        </div>
      </div>
    </div>
  );
}
