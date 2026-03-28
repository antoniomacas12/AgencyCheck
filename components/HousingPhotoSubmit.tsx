"use client";

/**
 * HousingPhotoSubmit — "Share your housing photo" modal.
 *
 * Renders a trigger button (matches the agency page style) that opens a
 * slide-up modal where workers can:
 *   1. Rate their housing (1–5 stars)
 *   2. Describe it in a few words
 *   3. Share a link to their photo (Google Photos, TikTok, Drive, etc.)
 *
 * On submit, posts to /api/housing-photos. Returns a success confirmation.
 */

import { useState, useEffect, useCallback } from "react";

interface Props {
  agencySlug: string;
  agencyName: string;
  /** "cta" = large invite card (for agencies without photos), "button" = compact button */
  variant?: "cta" | "button";
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl transition-transform hover:scale-110 active:scale-95"
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <span className={(hover || value) >= star ? "text-amber-400" : "text-gray-200"}>★</span>
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-xs text-gray-500 font-medium">
          {["", "Very bad 😤", "Below average 😕", "Average 😐", "Good 😊", "Excellent 🏆"][value]}
        </span>
      )}
    </div>
  );
}

export default function HousingPhotoSubmit({ agencySlug, agencyName, variant = "button" }: Props) {
  const [open,        setOpen]        = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  // Form state
  const [rating,      setRating]      = useState(0);
  const [description, setDescription] = useState("");
  const [photoLink,   setPhotoLink]   = useState("");
  const [city,        setCity]        = useState("");

  // Body scroll lock + Escape close
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); }, []);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, handleKey]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a housing rating."); return; }
    if (!description.trim()) { setError("Please write a short description."); return; }
    setError(null);
    setLoading(true);
    try {
      await fetch("/api/housing-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agencySlug, rating, description, photoLink, city }),
      });
    } catch {
      // Fail silently — we still show success to not frustrate users
    }
    setLoading(false);
    setOpen(false);
    setSubmitted(true);
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3.5">
        <span className="text-xl shrink-0">📸</span>
        <div>
          <p className="text-sm font-semibold text-green-800">Thanks for sharing!</p>
          <p className="text-xs text-green-600 mt-0.5 leading-snug">
            Your housing experience helps other workers know what to expect before they arrive.
          </p>
        </div>
      </div>
    );
  }

  // ── CTA variant (invite card for agencies without photos) ──────────────────
  const trigger = variant === "cta" ? (
    <button
      onClick={() => setOpen(true)}
      className="w-full text-left group border-2 border-dashed border-brand-200 hover:border-brand-400
        bg-brand-50/40 hover:bg-brand-50 rounded-xl px-5 py-5 transition-all"
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl shrink-0 group-hover:scale-110 transition-transform">📷</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm leading-snug">
            Have you lived in accommodation provided by {agencyName}?
          </p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Share your housing photos or describe the conditions.
            Real photos help workers make informed decisions before accepting a job offer.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 bg-brand-600 text-white text-xs font-semibold rounded-full px-3 py-1.5">
              📸 Share housing experience
            </span>
            <span className="text-[10px] text-gray-400">Anonymous · Takes 1 min</span>
          </div>
        </div>
      </div>
    </button>
  ) : (
    <button
      onClick={() => setOpen(true)}
      className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600
        border border-brand-200 bg-brand-50 rounded-full px-3 py-1.5
        hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all"
    >
      <span>📸</span> Share housing photo
    </button>
  );

  // ── Modal ──────────────────────────────────────────────────────────────────
  return (
    <>
      {trigger}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />

          <style>{`@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
          <div
            className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[96vh] flex flex-col sm:mx-4"
            style={{ animation: "slideUp 0.28s ease-out" }}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-2xl">📸</span>
                  <h2 className="text-base font-bold text-gray-900">Share your housing experience</h2>
                </div>
                <p className="text-xs text-gray-500 leading-snug">
                  Help future workers know what to expect from <strong>{agencyName}</strong> housing.
                  Your anonymity is protected.
                </p>
                {/* Social proof */}
                <div className="flex items-center gap-2 mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5">
                  <span className="text-base">🏠</span>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    <span className="font-semibold">Workers trust real photos</span> more than
                    agency descriptions. Your photo could change someone&apos;s decision.
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600" aria-label="Close">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  How would you rate the housing? <span className="text-red-500">*</span>
                </label>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Which city was the accommodation in?
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Venlo, Amsterdam, Eindhoven..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Describe the housing conditions <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Room size, number of people per room, bathroom/kitchen quality, cleanliness, weekly costs, anything workers should know before saying yes..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                />
                <p className="text-[10px] text-gray-400 mt-1">Be honest — even a sentence helps. You can write in English, Dutch, Polish, Romanian, or any language.</p>
              </div>

              {/* Photo link */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Link to your photos <span className="text-xs font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  type="url"
                  value={photoLink}
                  onChange={(e) => setPhotoLink(e.target.value)}
                  placeholder="Google Photos, TikTok, YouTube, Imgur, any public link..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {["📷 Google Photos", "🎵 TikTok", "▶️ YouTube", "🖼️ Imgur"].map((label) => (
                    <span key={label} className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{label}</span>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
              )}

              {/* Why this matters */}
              <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-brand-800 mb-1">Why your experience matters:</p>
                <ul className="text-[11px] text-brand-700 space-y-1 leading-relaxed">
                  <li>→ Workers arriving from abroad often have no idea what conditions to expect</li>
                  <li>→ Agencies sometimes advertise housing that looks very different in reality</li>
                  <li>→ Your honest feedback could protect someone from a bad situation</li>
                </ul>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold text-sm rounded-xl px-5 py-3.5 transition-colors"
              >
                {loading ? "Submitting..." : "📸 Submit housing experience"}
              </button>
            </form>

            {/* Footer */}
            <div className="px-5 pb-4 pt-2 border-t border-gray-50">
              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                Submissions are reviewed before publishing. Your identity is never disclosed. AgencyCheck is independent.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
