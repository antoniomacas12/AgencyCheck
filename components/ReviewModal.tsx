"use client";

import { useState, useEffect, useCallback } from "react";
import { ReviewSubmitForm } from "./ReviewSubmitForm";

interface ReviewModalProps {
  agencySlug:   string;
  agencyName:   string;
  reviewCount?: number;
  /** If true, show as a full-width block trigger button (default: false = compact inline) */
  fullWidth?: boolean;
  /**
   * "pill"    → tiny rounded pill (for AgencyCard and compact contexts)
   * "default" → branded gradient button (for agency page CTAs)
   */
  variant?: "default" | "pill";
}

// ─── Social proof helpers ─────────────────────────────────────────────────────
function socialProofText(n: number): string {
  if (n === 0) return "Be the first to help other workers";
  if (n === 1) return "1 worker already reviewed this agency";
  if (n < 5)   return `${n} workers reviewed — add yours`;
  return `${n} worker reviews · Add yours`;
}
function motivationLine(n: number): string {
  if (n === 0) return "Your review will help workers make better decisions.";
  if (n < 3)   return "Early reviews carry extra weight here.";
  if (n < 10)  return "Every honest review helps someone in a tough spot.";
  return "Workers read this before they apply. Your experience matters.";
}

// ─── Shared modal overlay (used by all trigger variants) ──────────────────────
interface ModalPanelProps {
  agencySlug:  string;
  agencyName:  string;
  proof:       string;
  motivation:  string;
  onClose:     () => void;
  onSuccess:   () => void;
}
function ModalPanel({ agencySlug, agencyName, proof, motivation, onClose, onSuccess }: ModalPanelProps) {
  // Escape key close
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }, [onClose]);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <style>{`@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <div
        className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[94vh] flex flex-col sm:mx-4"
        style={{ animation: "slideUp 0.28s ease-out" }}
        role="dialog"
        aria-modal="true"
        aria-label={`Review form for ${agencyName}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-2xl">⭐</span>
              <h2 className="text-base font-bold text-gray-900 leading-tight">Rate {agencyName}</h2>
            </div>
            <p className="text-xs text-gray-500 leading-snug">{motivation}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex -space-x-1">
                {["👷", "🧑‍🏭", "👨‍🔧"].map((e, i) => (
                  <span key={i} className="w-6 h-6 rounded-full bg-brand-50 border-2 border-white flex items-center justify-center text-xs">{e}</span>
                ))}
              </div>
              <p className="text-[11px] text-gray-500">
                <span className="font-semibold text-gray-700">{proof}</span>
                {" · "}Anonymous &amp; free
              </p>
            </div>
          </div>
          <button onClick={onClose} className="shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600" aria-label="Close">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-5">
          <ReviewSubmitForm agencySlug={agencySlug} agencyName={agencyName} onSuccess={onSuccess} />
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 pt-2 border-t border-gray-50">
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            Reviews are anonymous by default. No account required. AgencyCheck is not affiliated with any agency.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
export default function ReviewModal({
  agencySlug,
  agencyName,
  reviewCount = 0,
  fullWidth    = false,
  variant      = "default",
}: ReviewModalProps) {
  const [open,      setOpen]      = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const proof      = socialProofText(reviewCount);
  const motivation = motivationLine(reviewCount);

  // ── Success state ────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3.5">
        <span className="text-xl shrink-0">✅</span>
        <div>
          <p className="text-sm font-semibold text-green-800">Review submitted — thank you!</p>
          <p className="text-xs text-green-600 mt-0.5 leading-snug">
            Your experience helps other workers make better decisions before they sign a contract.
          </p>
        </div>
      </div>
    );
  }

  // ── Pill trigger (tiny — for AgencyCard and compact contexts) ────────────────
  if (variant === "pill") {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="text-[10px] font-semibold text-brand-600 border border-brand-200 bg-brand-50
            rounded-full px-2.5 py-0.5 hover:bg-brand-600 hover:text-white hover:border-brand-600
            transition-all shrink-0 flex items-center gap-1 active:scale-95"
          aria-label={`Rate ${agencyName}`}
        >
          <span>⭐</span>
          <span>Rate</span>
          {reviewCount === 0 && (
            <span className="ml-0.5 relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
            </span>
          )}
        </button>
        {open && (
          <ModalPanel
            agencySlug={agencySlug}
            agencyName={agencyName}
            proof={proof}
            motivation={motivation}
            onClose={() => setOpen(false)}
            onSuccess={() => { setOpen(false); setSubmitted(true); }}
          />
        )}
      </>
    );
  }

  // ── Default / fullWidth trigger ──────────────────────────────────────────────
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`group flex items-center gap-3 bg-gradient-to-r from-brand-600 to-brand-700
          hover:from-brand-700 hover:to-brand-800 text-white rounded-xl font-semibold text-sm
          transition-all shadow-sm hover:shadow-md active:scale-[0.98]
          ${fullWidth ? "w-full px-5 py-4 justify-between" : "px-4 py-3"}`}
        aria-label={`Rate ${agencyName}`}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex items-center">
            <span className="text-xl">⭐</span>
            {reviewCount === 0 && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
            )}
          </span>
          <div className="text-left">
            <div className="leading-tight">Rate {agencyName}</div>
            <div className="text-xs font-normal text-brand-200 mt-0.5 leading-tight">{proof}</div>
          </div>
        </div>
        <svg className="w-4 h-4 text-brand-300 group-hover:translate-x-0.5 transition-transform shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {open && (
        <ModalPanel
          agencySlug={agencySlug}
          agencyName={agencyName}
          proof={proof}
          motivation={motivation}
          onClose={() => setOpen(false)}
          onSuccess={() => { setOpen(false); setSubmitted(true); }}
        />
      )}
    </>
  );
}
