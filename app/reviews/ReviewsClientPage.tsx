"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { REVIEW_SEED_DATA, type ReviewSeed } from "@/lib/reviewData";
import WorkerReviewCard, { type WorkerReview } from "@/components/WorkerReviewCard";
import WorkerDisclaimer from "@/components/WorkerDisclaimer";
import { useT, type Locale } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function seedToCard(r: ReviewSeed, idx: number): WorkerReview {
  return {
    id: `rev-${idx}`,
    reviewType: r.reviewType,
    title: r.title,
    overallRating: r.overallRating,
    salaryRating: r.salaryRating,
    housingRating: r.housingRating ?? null,
    managementRating: r.managementRating,
    contractClarityRating: r.contractClarityRating,
    issueTags: r.issueTags,
    verificationStatus: r.verificationStatus as "VERIFIED" | "WORKER_REPORTED" | "UNKNOWN",
    comment: r.comment,
    jobTitle: r.jobTitle ?? null,
    city: r.city ?? null,
    createdAt: r.createdAt,
  };
}

function agencyDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const STAR_VALUES = [1, 2, 3, 4, 5];

function StarSelector({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div>
      <p className="text-xs font-medium text-gray-700 mb-1.5">{label}</p>
      <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {STAR_VALUES.map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHover(s)}
            onClick={() => onChange(s)}
            className="text-2xl transition-transform hover:scale-110 active:scale-95"
            aria-label={`${s} star`}
          >
            <span className={(hover || value) >= s ? "text-amber-400" : "text-gray-200"}>★</span>
          </button>
        ))}
        {value > 0 && (
          <span className="ml-1 text-xs text-gray-500 self-center">{value}/5</span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Standalone review form (agency is selected inline)
// ─────────────────────────────────────────────────────────────────────────────

const JOB_TYPE_OPTIONS = [
  "Order Picker", "Warehouse Worker", "Production Worker", "Assembly Worker",
  "Forklift Driver", "Reach Truck Driver", "Machine Operator", "Packing Operator",
  "Greenhouse Worker", "Driver", "Cleaner", "Other",
];

interface FormState {
  agencyName: string;
  city: string;
  jobType: string;
  rating: number;
  housingIncluded: "yes" | "no" | "unknown";
  housingCost: string;
  peoplePerRoom: string;
  transportCost: string;
  wouldRecommend: "yes" | "no" | "neutral";
  comment: string;
}

const INITIAL_FORM: FormState = {
  agencyName: "",
  city: "",
  jobType: "",
  rating: 0,
  housingIncluded: "unknown",
  housingCost: "",
  peoplePerRoom: "",
  transportCost: "",
  wouldRecommend: "neutral",
  comment: "",
};

function ReviewSubmitForm({ t }: { t: (key: string, vars?: Record<string, string | number>) => string }) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid =
    form.agencyName.trim().length > 0 &&
    form.rating > 0 &&
    form.comment.trim().length > 10;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    // Simulate submission (no backend in this build)
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-8 text-center">
        <p className="text-3xl mb-3">✅</p>
        <p className="text-base font-bold text-green-800 mb-1">{t("reviews_page.form_success_title")}</p>
        <p className="text-sm text-green-600 leading-relaxed">
          {t("reviews_page.form_success_sub")}
        </p>
        <button
          onClick={() => { setForm(INITIAL_FORM); setSubmitted(false); }}
          className="mt-4 text-xs text-green-700 border border-green-300 rounded-full px-4 py-1.5 hover:bg-green-100 transition-colors"
        >
          {t("reviews_page.form_submit_another")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Agency name */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">
          {t("reviews_page.form_agency_label")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.agencyName}
          onChange={(e) => set("agencyName", e.target.value)}
          placeholder="e.g. Otto Workforce, Randstad, Covebo…"
          maxLength={120}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl bg-white
            text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {/* City + Job type */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t("reviews_page.form_city")}
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder={t("reviews_page.form_city_placeholder")}
            maxLength={80}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
              text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t("reviews_page.form_job_type")}
          </label>
          <select
            value={form.jobType}
            onChange={(e) => set("jobType", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
              text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="">{t("reviews_page.form_job_select")}</option>
            {JOB_TYPE_OPTIONS.map((jt) => (
              <option key={jt} value={jt}>{jt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overall rating */}
      <div className="bg-gray-50 rounded-xl p-4">
        <StarSelector
          value={form.rating}
          onChange={(v) => set("rating", v)}
          label={t("reviews_page.form_rating_label")}
        />
        {form.rating > 0 && (
          <p className="text-xs text-gray-500 mt-1.5">
            {form.rating === 1 && t("reviews_page.rating_1")}
            {form.rating === 2 && t("reviews_page.rating_2")}
            {form.rating === 3 && t("reviews_page.rating_3")}
            {form.rating === 4 && t("reviews_page.rating_4")}
            {form.rating === 5 && t("reviews_page.rating_5")}
          </p>
        )}
      </div>

      {/* Housing */}
      <div>
        <p className="text-xs font-bold text-gray-700 mb-2">{t("reviews_page.form_housing_label")}</p>
        <div className="flex gap-2 flex-wrap">
          {(["yes", "no", "unknown"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set("housingIncluded", v)}
              className={`text-xs font-semibold rounded-full px-3.5 py-1.5 border transition-all ${
                form.housingIncluded === v
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
              }`}
            >
              {v === "yes" ? t("reviews_page.form_housing_yes") : v === "no" ? t("reviews_page.form_housing_no") : t("reviews_page.form_housing_unknown")}
            </button>
          ))}
        </div>
      </div>

      {/* Housing cost + people per room (only if housing = yes) */}
      {form.housingIncluded === "yes" && (
        <div className="grid sm:grid-cols-2 gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t("reviews_page.form_housing_cost")}
            </label>
            <input
              type="number"
              value={form.housingCost}
              onChange={(e) => set("housingCost", e.target.value)}
              placeholder="e.g. 140"
              min={0}
              max={500}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
                text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t("reviews_page.form_people_per_room")}
            </label>
            <input
              type="number"
              value={form.peoplePerRoom}
              onChange={(e) => set("peoplePerRoom", e.target.value)}
              placeholder="e.g. 2"
              min={1}
              max={10}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
                text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Transport cost */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {t("reviews_page.form_transport_cost")}{" "}
          <span className="text-gray-400 font-normal">{t("reviews_page.form_transport_note")}</span>
        </label>
        <input
          type="number"
          value={form.transportCost}
          onChange={(e) => set("transportCost", e.target.value)}
          placeholder="e.g. 28 — or 0 if included free"
          min={0}
          max={200}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
            text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {/* Would recommend */}
      <div>
        <p className="text-xs font-bold text-gray-700 mb-2">{t("reviews_page.form_recommend_label")}</p>
        <div className="flex gap-2 flex-wrap">
          {(["yes", "no", "neutral"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set("wouldRecommend", v)}
              className={`text-xs font-semibold rounded-full px-3.5 py-1.5 border transition-all ${
                form.wouldRecommend === v
                  ? v === "yes"
                    ? "bg-green-600 text-white border-green-600"
                    : v === "no"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
              }`}
            >
              {v === "yes" ? t("reviews_page.form_recommend_yes") : v === "no" ? t("reviews_page.form_recommend_no") : t("reviews_page.form_recommend_neutral")}
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">
          {t("reviews_page.form_comment_label")} <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.comment}
          onChange={(e) => set("comment", e.target.value)}
          placeholder={t("reviews_page.form_comment_placeholder")}
          rows={5}
          maxLength={2000}
          className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-xl bg-white
            text-gray-900 placeholder:text-gray-400 resize-none
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
            leading-relaxed"
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-[10px] text-gray-400">
            Minimum 10 characters. No personal names or private details.
          </p>
          <p className="text-xs text-gray-400">{form.comment.length}/2000</p>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full py-3.5 rounded-xl font-black text-sm transition-all shadow-sm
          bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98]
          disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {loading ? t("reviews_page.form_submitting") : t("reviews_page.form_submit")}
      </button>

      {!isValid && (
        <p className="text-xs text-gray-400 text-center">
          {t("reviews_page.form_invalid_note")}
        </p>
      )}

      <p className="text-[10px] text-gray-400 text-center leading-relaxed">
        {t("reviews_page.form_anon_note")}
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reviews feed
// ─────────────────────────────────────────────────────────────────────────────

type SortKey = "newest" | "worst" | "best";

const FILTER_AGENCIES = Array.from(
  new Set(REVIEW_SEED_DATA.map((r) => r.agencySlug))
).sort();

const FILTER_CITIES = Array.from(
  new Set(REVIEW_SEED_DATA.map((r) => r.city).filter(Boolean))
).sort() as string[];

const FILTER_JOB_TYPES = Array.from(
  new Set(REVIEW_SEED_DATA.map((r) => r.jobTitle).filter(Boolean))
).sort() as string[];

function ReviewsFeed({ t, locale }: { t: (key: string, vars?: Record<string, string | number>) => string; locale: Locale }) {
  const [agencyFilter,  setAgencyFilter]  = useState("");
  const [cityFilter,    setCityFilter]    = useState("");
  const [housingFilter, setHousingFilter] = useState<"" | "yes" | "no">(""); // "" = all
  const [sortKey,       setSortKey]       = useState<SortKey>("newest");
  const [showCount,     setShowCount]     = useState(12);

  const filtered = useMemo(() => {
    let reviews = [...REVIEW_SEED_DATA];

    if (agencyFilter) {
      reviews = reviews.filter((r) => r.agencySlug === agencyFilter);
    }
    if (cityFilter) {
      reviews = reviews.filter((r) =>
        r.city?.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }
    if (housingFilter === "yes") {
      reviews = reviews.filter((r) => r.housingRating != null);
    } else if (housingFilter === "no") {
      reviews = reviews.filter((r) => r.housingRating == null);
    }

    switch (sortKey) {
      case "newest": reviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case "worst":  reviews.sort((a, b) => a.overallRating - b.overallRating); break;
      case "best":   reviews.sort((a, b) => b.overallRating - a.overallRating); break;
    }

    return reviews;
  }, [agencyFilter, cityFilter, housingFilter, sortKey]);

  const visible = filtered.slice(0, showCount);

  return (
    <div>
      {/* Filters */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t("reviews_page.filter_title")}</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t("reviews_page.filter_agency")}</label>
            <select
              value={agencyFilter}
              onChange={(e) => { setAgencyFilter(e.target.value); setShowCount(12); }}
              className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-gray-400"
            >
              <option value="">{t("reviews_page.filter_agency_all")}</option>
              {FILTER_AGENCIES.map((slug) => (
                <option key={slug} value={slug}>
                  {agencyDisplayName(slug)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t("reviews_page.filter_city")}</label>
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => { setCityFilter(e.target.value); setShowCount(12); }}
              placeholder={t("reviews_page.filter_city_placeholder")}
              className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Housing filter */}
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-gray-500">{t("reviews_page.filter_housing")}</p>
            {(["", "yes", "no"] as const).map((v) => (
              <button
                key={v || "all"}
                onClick={() => { setHousingFilter(v); setShowCount(12); }}
                className={`text-[10px] font-semibold rounded-full px-2.5 py-1 border transition-all ${
                  housingFilter === v
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {v === "" ? t("reviews_page.filter_housing_all") : v === "yes" ? t("reviews_page.filter_housing_with") : t("reviews_page.filter_housing_without")}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5 ml-auto">
            <p className="text-xs text-gray-500">{t("reviews_page.filter_sort")}</p>
            {(["newest", "worst", "best"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortKey(s)}
                className={`text-[10px] font-semibold rounded-full px-2.5 py-1 border transition-all capitalize ${
                  sortKey === s
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {s === "newest" ? t("reviews_page.filter_sort_newest") : s === "worst" ? t("reviews_page.filter_sort_worst") : t("reviews_page.filter_sort_best")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400 mb-4">
        {t("reviews_page.showing_count", { shown: Math.min(showCount, filtered.length), total: filtered.length, plural: filtered.length !== 1 ? "s" : "" })}
        {agencyFilter && ` for ${agencyDisplayName(agencyFilter)}`}
      </p>

      {/* Cards */}
      {visible.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm text-gray-500 font-semibold">{t("reviews_page.no_results")}</p>
          <p className="text-xs text-gray-400 mt-1">{t("reviews_page.no_results_sub")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((r, i) => (
            <div key={`${r.agencySlug}-${r.createdAt}-${i}`}>
              {/* Agency label above card */}
              <div className="flex items-center gap-2 mb-1.5">
                <Link
                  href={`/agencies/${r.agencySlug}`}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  🏢 {agencyDisplayName(r.agencySlug)}
                </Link>
              </div>
              <WorkerReviewCard review={seedToCard(r, i)} locale={locale} />
            </div>
          ))}

          {/* Load more */}
          {showCount < filtered.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowCount((n) => n + 12)}
                className="text-sm font-semibold text-gray-700 border border-gray-300 rounded-full px-6 py-2 hover:bg-gray-50 transition-colors"
              >
                {t("reviews_page.load_more", { remaining: filtered.length - showCount })}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ReviewsClientPage({ locale = "en" }: { locale?: Locale }) {
  const t = useT(locale);

  const totalReviews = REVIEW_SEED_DATA.length;
  const verifiedCount = REVIEW_SEED_DATA.filter(
    (r) => r.verificationStatus === "VERIFIED"
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">{t("common.home")}</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">{t("nav.reviews")}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-800 rounded-full px-2.5 py-1">
            {t("reviews_page.badge_reviews", { count: totalReviews })}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-800 rounded-full px-2.5 py-1">
            {t("reviews_page.badge_verified", { count: verifiedCount })}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
            {t("reviews_page.badge_not_advertising")}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-2">
          {t("reviews_page.heading")}
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          {t("reviews_page.subheading")}
        </p>
      </div>

      {/* Trust badges */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {[
          { icon: "👤", title: t("reviews_page.trust_1_title"), desc: t("reviews_page.trust_1_desc") },
          { icon: "📊", title: t("reviews_page.trust_2_title"), desc: t("reviews_page.trust_2_desc") },
          { icon: "🚫", title: t("reviews_page.trust_3_title"), desc: t("reviews_page.trust_3_desc") },
        ].map((item) => (
          <div key={item.title} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-3 flex items-start gap-3">
            <span className="text-xl shrink-0">{item.icon}</span>
            <div>
              <p className="text-xs font-bold text-gray-800">{item.title}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2-column layout on large screens */}
      <div className="lg:grid lg:grid-cols-5 lg:gap-8">

        {/* Left: Review form */}
        <div className="lg:col-span-2 mb-10 lg:mb-0">
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-5 sticky top-20">
            <div className="mb-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">
                {t("reviews_page.share_experience_label")}
              </p>
              <h2 className="text-lg font-black text-gray-900 leading-tight">
                {t("reviews_page.form_title")}
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {t("reviews_page.form_sub")}
              </p>
            </div>
            <ReviewSubmitForm t={t} />
          </div>
        </div>

        {/* Right: Reviews feed */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-gray-900">
              {t("reviews_page.recent_title")}
            </h2>
            <p className="text-xs text-gray-400">{t("reviews_page.total_count", { count: totalReviews })}</p>
          </div>
          <WorkerDisclaimer variant="reviews" size="banner" className="mb-4" />
          <ReviewsFeed t={t} locale={locale} />
        </div>
      </div>

      {/* Bottom CTA to browse agencies */}
      <div className="mt-12 bg-gray-900 rounded-2xl px-6 py-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-black text-base mb-1">{t("reviews_page.cta_title")}</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            {t("reviews_page.cta_sub")}
          </p>
        </div>
        <Link
          href="/agencies"
          className="shrink-0 bg-white text-gray-900 font-black text-sm px-5 py-3 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap"
        >
          {t("reviews_page.cta_button", { count: 127 })}
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          {t("reviews_page.disclaimer")}
        </p>
      </div>
    </div>
  );
}
