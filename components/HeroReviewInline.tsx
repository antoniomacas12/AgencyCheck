"use client";

/**
 * HeroReviewInline — compact inline review form.
 *
 * Used in two contexts:
 *  1. Homepage hero (no agencyName prop) — glassmorphism dark style,
 *     shows an agency name input field.
 *  2. Agency detail pages (agencyName prop provided) — light card style,
 *     hides the name input (pre-filled), optionally shows a "be first" prompt.
 *
 * Submits directly to POST /api/reviews so the review is live immediately.
 * The single star rating is applied to all required sub-ratings.
 */

import { useState } from "react";

const STARS = [1, 2, 3, 4, 5];
const LABELS = ["", "Very bad", "Bad", "OK", "Good", "Excellent"];

type Status = "idle" | "loading" | "success" | "error";

interface Props {
  /** When provided, the agency name input is hidden and pre-filled */
  agencyName?: string;
  /** Show the "be the first to review" prompt above the form */
  beFirst?: boolean;
  /** Label overrides for non-EN pages */
  labels?: {
    heading?:        string;
    placeholder?:    string;
    submit?:         string;
    successTitle?:   string;
    successSub?:     string;
    beFirstHeading?: string;
    beFirstSub?:     string;
  };
}

export default function HeroReviewInline({ agencyName: prefill, beFirst, labels }: Props) {
  const [agency,  setAgency]  = useState(prefill ?? "");
  const [rating,  setRating]  = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [status,  setStatus]  = useState<Status>("idle");

  const activeRating = hovered || rating;
  const canSubmit    = agency.trim().length > 0 && rating > 0;
  const isAgencyPage = Boolean(prefill);

  const L = {
    heading:        labels?.heading        ?? "✍️ Worked in an agency? Tell people what to expect",
    placeholder:    labels?.placeholder    ?? "What was your experience? Housing, pay, management...",
    submit:         labels?.submit         ?? "Submit review →",
    successTitle:   labels?.successTitle   ?? "Review submitted!",
    successSub:     labels?.successSub     ?? "It's now live on the reviews page. Thank you.",
    beFirstHeading: labels?.beFirstHeading ?? `Be the first to review ${prefill ?? "this agency"}`,
    beFirstSub:     labels?.beFirstSub     ?? "Workers rely on honest reviews to avoid bad agencies. Takes 30 seconds.",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");

    const fd = new FormData();
    fd.append("agencyName",            agency.trim());
    fd.append("salaryRating",          String(rating));
    fd.append("managementRating",      String(rating));
    fd.append("contractClarityRating", String(rating));
    fd.append("overallRating",         String(rating));
    if (comment.trim()) fd.append("comment", comment.trim());

    try {
      const res = await fetch("/api/reviews", { method: "POST", body: fd });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  /* ── Success state ── */
  if (status === "success") {
    const successClass = isAgencyPage
      ? "rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center"
      : "mt-4 w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center";
    const titleClass = isAgencyPage ? "text-sm font-bold text-emerald-700 mb-1" : "text-sm font-bold text-emerald-300 mb-1";
    const subClass   = isAgencyPage ? "text-xs text-emerald-600" : "text-xs text-gray-400";
    return (
      <div className={successClass}>
        <div className="text-2xl mb-2">✅</div>
        <p className={titleClass}>{L.successTitle}</p>
        <p className={subClass}>{L.successSub}</p>
      </div>
    );
  }

  /* ── Agency page variant (light) ── */
  if (isAgencyPage) {
    return (
      <div className="space-y-3">
        {/* "Be first" prompt */}
        {beFirst && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
            <div className="flex justify-center gap-0.5 mb-2">
              {STARS.map((s) => (
                <svg key={s} className="w-6 h-6 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm font-bold text-amber-800 mb-1">{L.beFirstHeading}</p>
            <p className="text-xs text-amber-700 leading-relaxed max-w-xs mx-auto">{L.beFirstSub}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-3">
          <p className="text-sm font-bold text-amber-700">{L.heading}</p>

          {/* Star rating */}
          <div className="flex items-center gap-1">
            {STARS.map((s) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
                className="text-2xl leading-none transition-transform hover:scale-110 active:scale-95"
                aria-label={`${s} stars`}
              >
                <span className={s <= activeRating ? "text-amber-400" : "text-gray-300"}>★</span>
              </button>
            ))}
            {activeRating > 0 && (
              <span className="text-xs text-gray-400 ml-1">{LABELS[activeRating]}</span>
            )}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={L.placeholder}
            rows={3}
            className="w-full rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm px-3 py-2.5 focus:outline-none focus:border-amber-400 transition-colors resize-none"
          />

          {status === "error" && (
            <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || status === "loading"}
            className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-2.5 transition-colors active:scale-[0.98]"
          >
            {status === "loading" ? "Submitting…" : L.submit}
          </button>
        </form>
      </div>
    );
  }

  /* ── Homepage variant (dark glassmorphism) ── */
  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 w-full rounded-xl border border-white/[0.12] bg-white/[0.05] backdrop-blur-sm p-4 space-y-3"
    >
      <p className="text-sm font-bold text-amber-300">{L.heading}</p>

      {/* Agency name */}
      <input
        type="text"
        value={agency}
        onChange={(e) => setAgency(e.target.value)}
        placeholder="Agency name (e.g. Otto Workforce)"
        className="w-full rounded-lg bg-white/[0.07] border border-white/[0.12] text-white placeholder-gray-500 text-sm px-3 py-2.5 focus:outline-none focus:border-amber-400/50 transition-colors"
      />

      {/* Star rating */}
      <div className="flex items-center gap-1">
        {STARS.map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(s)}
            className="text-2xl leading-none transition-transform hover:scale-110 active:scale-95"
            aria-label={`${s} stars`}
          >
            <span className={s <= activeRating ? "text-amber-400" : "text-gray-600"}>★</span>
          </button>
        ))}
        {activeRating > 0 && (
          <span className="text-xs text-gray-400 ml-1">{LABELS[activeRating]}</span>
        )}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What was your experience? Housing, pay, management..."
        rows={3}
        className="w-full rounded-lg bg-white/[0.07] border border-white/[0.12] text-white placeholder-gray-500 text-sm px-3 py-2.5 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
      />

      {status === "error" && (
        <p className="text-xs text-red-400">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || status === "loading"}
        className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-2.5 transition-colors active:scale-[0.98]"
      >
        {status === "loading" ? "Submitting…" : "Submit review →"}
      </button>
    </form>
  );
}
