"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * ShockPopup — shows after 4 seconds OR slight scroll.
 * Warns workers about the real income gap before they apply.
 * One-session dismiss using sessionStorage.
 */
export default function ShockPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show again in same session
    if (typeof window !== "undefined" && sessionStorage.getItem("shockPopupDismissed")) {
      return;
    }

    let triggered = false;

    const trigger = () => {
      if (!triggered) {
        triggered = true;
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
        clearTimeout(timer);
      }
    };

    // Trigger on scroll (any scroll > 80px)
    const onScroll = () => {
      if (window.scrollY > 80) trigger();
    };

    // Trigger after 4 seconds
    const timer = setTimeout(trigger, 4000);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("shockPopupDismissed", "1");
    }
  };

  if (!visible || dismissed) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Real income warning"
      >
        {/* Header */}
        <div className="bg-surface-base px-5 pt-5 pb-4">
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">⚠️</span>
            <button
              onClick={dismiss}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-300 hover:text-white transition-colors text-base font-bold shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
            Before you apply — real worker data
          </p>
          <h2 className="text-lg font-black text-white leading-tight mb-2">
            Most workers come for jobs with housing — but lose €200–€350/week after costs
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Housing is deducted from your salary. Add tax, insurance and transport — and most workers keep only{" "}
            <strong className="text-white">€240–€380/week</strong> from a €600 gross paycheck.
          </p>
        </div>

        {/* Numbers */}
        <div className="bg-surface-muted px-5 py-4 grid grid-cols-2 gap-3">
          <div className="text-center bg-white/5 rounded-xl py-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Agency says</p>
            <p className="text-2xl font-black text-gray-500 line-through decoration-red-500 decoration-2">€600</p>
            <p className="text-[9px] text-gray-600 mt-0.5">gross/week</p>
          </div>
          <div className="text-center bg-red-950/60 rounded-xl py-3 border border-red-800/40">
            <p className="text-[9px] font-bold uppercase tracking-widest text-red-400 mb-1">You actually keep</p>
            <p className="text-2xl font-black text-white">€243</p>
            <p className="text-[9px] text-red-400 mt-0.5 font-semibold">after all costs</p>
          </div>
        </div>

        {/* Trust note */}
        <div className="bg-surface-muted px-5 pb-1">
          <p className="text-[9px] text-gray-600 text-center">
            📊 Based on real worker reports — not agency estimates
          </p>
        </div>

        {/* Actions */}
        <div className="bg-surface-base px-5 pt-3 pb-5 flex flex-col gap-2">
          <Link
            href="/tools/real-income-calculator"
            onClick={dismiss}
            className="w-full text-center bg-white text-gray-900 font-black text-sm py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            🧮 Show me real numbers
          </Link>
          <button
            onClick={dismiss}
            className="w-full text-center text-gray-500 text-xs py-2 hover:text-gray-300 transition-colors"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </>
  );
}
