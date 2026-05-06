"use client";

/**
 * HeroReviewInline — compact inline review form shown directly below
 * the hero salary card. Submits directly to POST /api/reviews so the
 * review appears on the reviews page immediately, no redirect needed.
 *
 * The single star rating is applied to all required sub-ratings
 * (salary, management, contract clarity) since this is a quick-entry form.
 */

import { useState } from "react";

const STARS = [1, 2, 3, 4, 5];
const LABELS = ["", "Very bad", "Bad", "OK", "Good", "Excellent"];

type Status = "idle" | "loading" | "success" | "error";

export default function HeroReviewInline() {
  const [agency,  setAgency]  = useState("");
  const [rating,  setRating]  = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [status,  setStatus]  = useState<Status>("idle");

  const activeRating = hovered || rating;
  const canSubmit    = agency.trim().length > 0 && rating > 0;

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
    return (
      <div className="mt-4 w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
        <div className="text-2xl mb-2">✅</div>
        <p className="text-sm font-bold text-emerald-300 mb-1">Review submitted!</p>
        <p className="text-xs text-gray-400">It&apos;s now live on the reviews page. Thank you.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 w-full rounded-xl border border-white/[0.12] bg-white/[0.05] backdrop-blur-sm p-4 space-y-3"
    >
      <p className="text-sm font-bold text-amber-300">
        ✍️ Worked in an agency? Tell people what to expect
      </p>

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
