"use client";

/**
 * HeroQuickReview
 * Compact inline review form in the hero left column.
 * Step 1: type agency name → Step 2: textarea appears → submit → published immediately.
 */

import { useState, useRef } from "react";

const STAR_PATH = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="focus:outline-none"
          aria-label={`${s} star`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor"
            className={`w-5 h-5 transition-colors ${s <= (hover || value) ? "text-amber-400" : "text-white/20"}`}>
            <path d={STAR_PATH} />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function HeroQuickReview() {
  const [agency, setAgency]     = useState("");
  const [comment, setComment]   = useState("");
  const [rating, setRating]     = useState(0);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState("");
  const textareaRef             = useRef<HTMLTextAreaElement>(null);

  const showForm  = agency.trim().length >= 2;
  const canSubmit = showForm && comment.trim().length >= 10 && rating >= 1 && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("agencyName",          agency.trim());
      fd.append("comment",             comment.trim());
      fd.append("overallRating",       String(rating));
      fd.append("salaryRating",        String(rating));
      fd.append("managementRating",    String(rating));
      fd.append("contractClarityRating", String(rating));
      fd.append("reviewType",          "ANONYMOUS");
      fd.append("workerStatus",        "UNKNOWN");
      fd.append("verificationStatus",  "WORKER_REPORTED");
      fd.append("sourceType",          "WORKER_REPORTED");
      fd.append("accommodationProvided", "UNKNOWN");
      fd.append("roomType",            "UNKNOWN");
      fd.append("wouldRecommend",      rating >= 4 ? "YES" : rating <= 2 ? "NO" : "UNSURE");

      const res = await fetch("/api/reviews", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Submit failed");
      setDone(true);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="w-full rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] px-4 py-3.5 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl shrink-0">✅</span>
          <div>
            <p className="text-white font-extrabold text-[13px] leading-snug">Review published!</p>
            <p className="text-gray-400 text-[11px] mt-0.5">
              Your experience is now live on the{" "}
              <a href="/reviews" className="text-emerald-400 font-bold hover:underline">reviews page</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] px-4 py-3.5 mb-3">

      {/* Header row */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex shrink-0">
          {[1,2,3,4,5].map((s) => (
            <svg key={s} viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-amber-400">
              <path d={STAR_PATH} />
            </svg>
          ))}
        </div>
        <p className="text-gray-300 text-[12px] font-semibold">
          Worked with a Dutch agency? Leave a quick review.
        </p>
      </div>

      {/* Agency name input */}
      <input
        type="text"
        value={agency}
        onChange={(e) => setAgency(e.target.value)}
        onFocus={() => setTimeout(() => textareaRef.current?.focus && showForm && textareaRef.current.focus(), 50)}
        placeholder="Agency name…"
        maxLength={120}
        className="w-full rounded-xl border border-white/[0.10] bg-white/[0.05] text-white placeholder-gray-500 text-[13px] font-medium px-3.5 py-2.5 outline-none focus:border-amber-400/40 focus:bg-white/[0.07] transition-all mb-2"
      />

      {/* Expandable: rating + comment */}
      {showForm && (
        <div className="space-y-2">
          {/* Star rating */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 shrink-0">Overall rating:</span>
            <StarPicker value={rating} onChange={setRating} />
            {rating > 0 && (
              <span className="text-[11px] text-amber-400 font-bold ml-1">
                {["","Poor","Below average","Average","Good","Excellent"][rating]}
              </span>
            )}
          </div>

          {/* Comment textarea */}
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience — salary, housing, contract clarity…"
            rows={3}
            maxLength={1500}
            className="w-full rounded-xl border border-white/[0.10] bg-white/[0.05] text-white placeholder-gray-500 text-[12px] px-3.5 py-2.5 outline-none focus:border-amber-400/40 focus:bg-white/[0.07] transition-all resize-none"
          />

          {/* Submit */}
          {error && <p className="text-red-400 text-[11px]">{error}</p>}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/[0.12] hover:bg-amber-400/[0.22] disabled:opacity-40 disabled:cursor-not-allowed text-amber-300 font-black text-[12px] px-4 py-2.5 transition-all duration-150"
          >
            {loading ? "Submitting…" : "✍️ Submit review →"}
          </button>
        </div>
      )}
    </form>
  );
}
