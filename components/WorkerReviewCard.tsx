/**
 * WorkerReviewCard — displays a single worker review with verification label,
 * issue tags, headline title, and overall rating.
 * Accepts an optional `locale` prop so all labels translate to PL / RO.
 */

import { useT, type Locale } from "@/lib/i18n";
import { ReviewComments } from "@/components/ReviewComments";

// ─── Relative date helper (pure — no React hooks required) ───────────────────

function relativeDate(iso: string): string {
  try {
    const ms   = Date.now() - new Date(iso).getTime();
    const secs = Math.floor(ms / 1000);
    if (secs < 60)  return "just now";
    const mins = Math.floor(secs / 60);
    if (mins < 60)  return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return "yesterday";
    if (days < 7)   return `${days} days ago`;
    if (days < 14)  return "last week";
    if (days < 30)  return `${Math.floor(days / 7)} weeks ago`;
    if (days < 60)  return "last month";
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    const yrs = Math.floor(days / 365);
    return yrs === 1 ? "1 year ago" : `${yrs} years ago`;
  } catch {
    return iso.slice(0, 10); // fallback to YYYY-MM-DD
  }
}

export type ReviewType          = "ANONYMOUS" | "VERIFIED_WORKER";
export type VerificationStatus  = "VERIFIED" | "WORKER_REPORTED" | "UNKNOWN";

export interface WorkerReview {
  id:                    string;
  reviewType:            ReviewType;
  title?:                string | null;
  overallRating?:        number | null;
  salaryRating:          number;
  housingRating?:        number | null;
  managementRating:      number;
  contractClarityRating: number;
  issueTags?:            string[];
  verificationStatus?:   VerificationStatus;
  comment?:              string | null;
  jobTitle?:             string | null;
  city?:                 string | null;
  createdAt:             string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stars({ value, max = 5, size = "sm" }: { value: number; max?: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-4 h-4" : "w-3 h-3";
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value}/5`}>
      {Array.from({ length: max }, (_, i) => i + 1).map((s) => (
        <svg
          key={s}
          className={`${cls} ${s <= Math.round(value) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WorkerReviewCard({
  review,
  locale = "en",
  agencyName,
}: {
  review:      WorkerReview;
  locale?:     Locale;
  agencyName?: string;
}) {
  const t = useT(locale);

  // ── Locale-aware config (built inside render so t() is called correctly) ──

  const REVIEW_TYPE_CONFIG: Record<ReviewType, { label: string; badge: string; icon: string }> = {
    ANONYMOUS: {
      label: t("review_card.anonymous_worker"),
      badge: "bg-gray-100 text-gray-600",
      icon:  "👤",
    },
    VERIFIED_WORKER: {
      label: t("review_card.verified_worker"),
      badge: "bg-green-100 text-green-700",
      icon:  "✅",
    },
  };

  const ISSUE_TAG_CONFIG: Record<string, { label: string; color: string }> = {
    housing_crowded:    { label: t("review_card.tag_housing_crowded"),    color: "bg-red-50 text-red-700 border-red-100" },
    housing_dirty:      { label: t("review_card.tag_housing_dirty"),      color: "bg-red-50 text-red-700 border-red-100" },
    housing_good:       { label: t("review_card.tag_housing_good"),       color: "bg-green-50 text-green-700 border-green-100" },
    housing_clean:      { label: t("review_card.tag_housing_clean"),      color: "bg-green-50 text-green-700 border-green-100" },
    late_salary:        { label: t("review_card.tag_late_salary"),        color: "bg-orange-50 text-orange-700 border-orange-100" },
    fair_pay:           { label: t("review_card.tag_fair_pay"),           color: "bg-green-50 text-green-700 border-green-100" },
    below_average_pay:  { label: t("review_card.tag_below_average_pay"),  color: "bg-red-50 text-red-700 border-red-100" },
    transport_good:     { label: t("review_card.tag_transport_good"),     color: "bg-green-50 text-green-700 border-green-100" },
    transport_delays:   { label: t("review_card.tag_transport_delays"),   color: "bg-amber-50 text-amber-700 border-amber-100" },
    no_transport:       { label: t("review_card.tag_no_transport"),       color: "bg-red-50 text-red-700 border-red-100" },
    missing_overtime:   { label: t("review_card.tag_missing_overtime"),   color: "bg-red-50 text-red-700 border-red-100" },
    overtime_paid:      { label: t("review_card.tag_overtime_paid"),      color: "bg-green-50 text-green-700 border-green-100" },
    unclear_contract:   { label: t("review_card.tag_unclear_contract"),   color: "bg-amber-50 text-amber-700 border-amber-100" },
    fair_contract:      { label: t("review_card.tag_fair_contract"),      color: "bg-green-50 text-green-700 border-green-100" },
    management_poor:    { label: t("review_card.tag_management_poor"),    color: "bg-red-50 text-red-700 border-red-100" },
    management_ok:      { label: t("review_card.tag_management_ok"),      color: "bg-gray-100 text-gray-600 border-gray-200" },
    management_good:    { label: t("review_card.tag_management_good"),    color: "bg-green-50 text-green-700 border-green-100" },
    payslip_errors:     { label: t("review_card.tag_payslip_errors"),     color: "bg-red-50 text-red-700 border-red-100" },
    payslip_ok:         { label: t("review_card.tag_payslip_ok"),         color: "bg-green-50 text-green-700 border-green-100" },
    communication_poor: { label: t("review_card.tag_communication_poor"), color: "bg-amber-50 text-amber-700 border-amber-100" },
    communication_good: { label: t("review_card.tag_communication_good"), color: "bg-green-50 text-green-700 border-green-100" },
  };

  const RATING_LABELS: Record<string, string> = {
    salaryRating:          t("review_card.rating_salary"),
    housingRating:         t("review_card.rating_housing"),
    managementRating:      t("review_card.rating_management"),
    contractClarityRating: t("review_card.rating_contract"),
  };

  const cfg = REVIEW_TYPE_CONFIG[review.reviewType];

  const computedAvg = [
    review.salaryRating,
    review.managementRating,
    review.contractClarityRating,
    ...(review.housingRating != null ? [review.housingRating] : []),
  ].reduce((a, b) => a + b, 0) /
    (3 + (review.housingRating != null ? 1 : 0));

  const displayRating = review.overallRating ?? Math.round(computedAvg);
  const displayAvg    = review.overallRating?.toFixed(1) ?? computedAvg.toFixed(1);

  const ratings = Object.entries({
    salaryRating:          review.salaryRating,
    managementRating:      review.managementRating,
    contractClarityRating: review.contractClarityRating,
    ...(review.housingRating != null ? { housingRating: review.housingRating } : {}),
  }) as [string, number][];

  const negativeTags = (review.issueTags ?? []).filter((tag) => {
    const cls = ISSUE_TAG_CONFIG[tag]?.color ?? "";
    return cls.includes("red") || cls.includes("amber") || cls.includes("orange");
  });
  const positiveTags = (review.issueTags ?? []).filter((tag) => !negativeTags.includes(tag));
  const sortedTags   = [...negativeTags, ...positiveTags];

  // Left-border accent colour based on overall rating
  const borderAccent =
    displayRating >= 4 ? "border-l-green-400"
    : displayRating <= 2 ? "border-l-red-400"
    : "border-l-amber-300";

  return (
    <div className={`card p-4 border-l-4 ${borderAccent}`}>

      {/* ── Header: rating (most important signal) + meta ── */}
      <div className="flex items-start justify-between gap-3 mb-2">
        {/* Overall score — prominent, left-anchored */}
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-lg font-black tabular-nums leading-none ${
            displayRating >= 4 ? "text-green-600"
            : displayRating <= 2 ? "text-red-600"
            : "text-amber-600"
          }`}>
            {displayAvg}
          </span>
          <Stars value={displayRating} size="sm" />
        </div>
        {/* Verification badge + meta — right */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          <span className={`inline-flex items-center gap-1 text-[10px] font-medium rounded-full px-2 py-0.5 ${cfg.badge}`}>
            {cfg.icon} {cfg.label}
          </span>
          <span className="text-[10px] text-gray-400">{relativeDate(review.createdAt)}</span>
        </div>
      </div>

      {/* ── Job + city context line ── */}
      {(review.jobTitle || review.city) && (
        <p className="text-[10px] text-gray-500 mb-2">
          {review.jobTitle && <span>{review.jobTitle}</span>}
          {review.jobTitle && review.city && <span className="mx-1 text-gray-300">·</span>}
          {review.city && <span>📍 {review.city}</span>}
        </p>
      )}

      {/* ── Title ── */}
      {review.title && (
        <p className="text-sm font-bold text-gray-900 mb-2 leading-snug">
          {review.title}
        </p>
      )}

      {/* ── Issue tags ── */}
      {sortedTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {sortedTags.map((tag) => {
            const tagCfg = ISSUE_TAG_CONFIG[tag] ?? {
              label: tag.replace(/_/g, " "),
              color: "bg-gray-100 text-gray-600 border-gray-200",
            };
            return (
              <span
                key={tag}
                className={`inline-flex items-center text-[10px] font-medium border rounded-full px-2 py-0.5 leading-tight ${tagCfg.color}`}
              >
                {tagCfg.label}
              </span>
            );
          })}
        </div>
      )}

      {/* ── Rating grid — compact 2-column with mini star rows ── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
        {ratings.map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400 w-16 shrink-0 truncate">
              {RATING_LABELS[key] ?? key}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < val
                      ? val >= 4 ? "bg-green-400" : val <= 2 ? "bg-red-400" : "bg-amber-400"
                      : "bg-gray-200"
                  }`}
                />
              ))}
              <span className="text-[10px] text-gray-500 ml-0.5">{val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Comment ── */}
      {review.comment && (
        <blockquote className="border-l-2 border-gray-100 pl-3 text-xs text-gray-600 leading-relaxed">
          &ldquo;{review.comment}&rdquo;
        </blockquote>
      )}

      {/* ── Footer verification line ── */}
      {review.verificationStatus === "VERIFIED" && (
        <p className="text-[10px] text-green-600 font-medium mt-2">
          ✅ {t("review_card.verified_review")}
        </p>
      )}

      {/* ── Comments section ── */}
      <ReviewComments
        reviewId={review.id}
        agencyName={agencyName ?? ""}
      />
    </div>
  );
}
