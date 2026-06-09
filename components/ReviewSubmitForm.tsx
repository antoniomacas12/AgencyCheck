"use client";

/**
 * ReviewSubmitForm — simplified 2-field review form (agency name + text).
 *
 * Submits as multipart/form-data to POST /api/reviews.
 * Shows a real confirmation only when the server confirms the save.
 */

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReviewSubmitFormProps {
  agencySlug:  string;
  agencyName?: string;
  onSuccess?:  () => void;
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function ReviewSubmitForm({ agencySlug, agencyName, onSuccess }: ReviewSubmitFormProps) {
  const [comment,    setComment]    = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [done,       setDone]       = useState(false);

  const isValid = comment.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.set("agencySlug", agencySlug);
      fd.set("reviewType", "ANONYMOUS");
      fd.set("comment",    comment.trim());

      const res  = await fetch("/api/reviews", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Submission failed. Please try again.");
        return;
      }

      setDone(true);
      onSuccess?.();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success state ───────────────────────────────────────────────────────────

  if (done) {
    return (
      <div
        className="bg-emerald-500/[0.08] border border-emerald-500/[0.2] rounded-2xl px-6 py-10 text-center"
        style={{ boxShadow: "0 4px 32px rgba(52,211,153,0.08), inset 0 1px 0 rgba(52,211,153,0.1)" }}
      >
        <div className="w-12 h-12 rounded-full bg-emerald-500/[0.15] border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Review submitted — thank you!</h3>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          Your experience helps other workers make better decisions before they sign a contract.
        </p>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>

      {/* Agency name display */}
      {agencyName && (
        <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3">
          <span className="text-base shrink-0">🏢</span>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium leading-none mb-0.5">
              Agency
            </p>
            <p className="text-sm font-semibold text-white leading-snug">{agencyName}</p>
          </div>
        </div>
      )}

      {/* Review textarea */}
      <div className="rounded-xl border border-white/[0.09] bg-white/[0.04] overflow-hidden focus-within:border-blue-400/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <div className="px-4 pt-4 pb-1">
          <p className="text-sm font-semibold text-gray-200 leading-none mb-1">Your review</p>
          <p className="text-[11px] text-gray-500 mb-3">
            Pay, housing, management, working conditions — whatever you want to share.
          </p>
          <textarea
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe your experience…"
            maxLength={4000}
            autoFocus
            className="w-full bg-transparent border-0 outline-none resize-none text-sm text-white placeholder:text-gray-600 leading-relaxed focus:ring-0"
            style={{ boxShadow: "none" }}
          />
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.02]">
          <span className="text-[11px] text-gray-600">Min. 10 characters</span>
          <span className="text-[11px] text-gray-600 tabular-nums">{comment.length} / 4000</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-red-500/[0.12] border border-red-500/25 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || submitting}
        className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white text-sm font-bold py-3.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ boxShadow: "0 4px 24px rgba(52,211,153,0.25), inset 0 1px 0 rgba(255,255,255,0.1)" }}
      >
        {submitting ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Submitting…
          </>
        ) : (
          "Submit review"
        )}
      </button>

      <p className="text-[11px] text-gray-500 text-center leading-snug">
        🔒 Anonymous — your identity is never shared
      </p>
    </form>
  );
}
