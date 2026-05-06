"use client";

/**
 * HeroReviewInline — compact inline review form shown directly below
 * the hero salary card. No click needed to open — fields are immediately
 * visible. On submit redirects to /reviews/submit with pre-filled data.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

const STARS = [1, 2, 3, 4, 5];

export default function HeroReviewInline() {
  const router  = useRouter();
  const [agency, setAgency]   = useState("");
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (agency) params.set("agency", agency);
    if (rating) params.set("rating", String(rating));
    if (comment) params.set("comment", comment);
    router.push(`/reviews/submit?${params.toString()}`);
  }

  const activeRating = hovered || rating;

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
        {rating > 0 && (
          <span className="text-xs text-gray-400 ml-1">
            {["", "Very bad", "Bad", "OK", "Good", "Excellent"][rating]}
          </span>
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

      <button
        type="submit"
        disabled={!agency && !comment}
        className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-2.5 transition-colors active:scale-[0.98]"
      >
        Continue &amp; submit review →
      </button>
    </form>
  );
}
