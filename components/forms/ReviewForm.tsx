"use client";

import { useState } from "react";
import { trackReviewSubmit } from "@/lib/analytics";

interface ReviewFormProps {
  agencySlug: string;
  agencyName: string;
  onSuccess:  () => void;
}

export default function ReviewForm({ agencySlug, agencyName, onSuccess }: ReviewFormProps) {
  const [comment, setComment] = useState("");
  const [rating,  setRating]  = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const isValid = comment.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.set("agencySlug", agencySlug);
      fd.set("reviewType", "ANONYMOUS");
      fd.set("comment",    comment.trim());
      if (rating !== null) fd.set("overallRating", String(rating));

      const res  = await fetch("/api/reviews", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      setComment("");
      setRating(null);
      trackReviewSubmit({
        agency_slug:    agencySlug,
        review_type:    "ANONYMOUS",
        overall_rating: rating ?? 0,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  const displayRating = hovered ?? rating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>

      {/* Agency name + star rating */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-base">🏢</span>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium leading-none mb-0.5">
              Agency
            </p>
            <p className="text-sm font-semibold text-gray-800 leading-snug">{agencyName}</p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1" role="group" aria-label="Rating (optional)">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(rating === star ? null : star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`${star} star${star !== 1 ? "s" : ""}`}
              className="text-[26px] leading-none transition-transform active:scale-90 select-none"
            >
              <span className={displayRating !== null && star <= displayRating ? "text-amber-400" : "text-gray-200"}>
                ★
              </span>
            </button>
          ))}
          {rating !== null && (
            <span className="text-[12px] text-gray-400 ml-1">
              {["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating]}
            </span>
          )}
          {rating === null && (
            <span className="text-[12px] text-gray-300 ml-1">optional</span>
          )}
        </div>
      </div>

      {/* Review text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Your review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe your experience — pay, housing, management, working conditions…"
          rows={4}
          maxLength={2000}
          autoFocus
          className="w-full px-3 py-2.5 text-[16px] border border-gray-300 rounded-xl bg-white
            text-gray-900 placeholder:text-gray-400 resize-none
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/2000</p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all
          bg-brand-600 text-white hover:bg-brand-700 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {loading ? "Submitting…" : "Submit review"}
      </button>

      <p className="text-[11px] text-gray-400 text-center leading-snug">
        🔒 Anonymous — your identity is never shared
      </p>
    </form>
  );
}
