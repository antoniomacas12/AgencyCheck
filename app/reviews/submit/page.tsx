"use client";

/**
 * /reviews/submit?agency=<slug>
 * Standalone review submission page — used from links like
 * "Write a review for Randstad" → /reviews/submit?agency=randstad
 */

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ReviewSubmitForm } from "@/components/ReviewSubmitForm";

function SubmitPageInner() {
  const params     = useSearchParams();
  const agencySlug = params.get("agency") ?? "";
  const agencyName = params.get("name") ?? agencySlug;

  if (!agencySlug) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-sm mb-4">
          No agency specified. Please go to an agency page and click &quot;Write a review&quot; there.
        </p>
        <Link href="/agencies" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
          Browse agencies →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[560px] mx-auto px-4">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-700 mb-8 flex items-center gap-1.5 flex-wrap justify-center">
        <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
        <span className="text-gray-800">/</span>
        <Link href="/agencies" className="hover:text-gray-400 transition-colors">Agencies</Link>
        <span className="text-gray-800">/</span>
        <Link href={`/agencies/${agencySlug}`} className="hover:text-gray-400 transition-colors">
          {agencyName}
        </Link>
        <span className="text-gray-800">/</span>
        <span className="text-gray-600">Write a review</span>
      </nav>

      {/* Page header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">
            Anonymous · Free · Takes 2 min
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          Share your experience
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Help others avoid bad agencies — and find the good ones.
        </p>
      </div>

      {/* Form card — white card floats on dark background */}
      <ReviewSubmitForm agencySlug={agencySlug} agencyName={agencyName} />

      {/* Bottom trust note */}
      <p className="text-center text-[11px] text-gray-700 mt-5">
        Your review is anonymous · Published immediately · No account needed
      </p>

    </div>
  );
}

export default function ReviewSubmitPage() {
  return (
    <div className="relative min-h-screen bg-[#080c14] text-white">

      {/* ── Background layers ─────────────────────────────────────── */}
      {/* Dot grid — slightly lower opacity than homepage */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
        aria-hidden="true"
      />
      {/* Radial vignette */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, #080c14 100%)",
        }}
        aria-hidden="true"
      />
      {/* Ambient glows — softer than homepage */}
      <div
        className="pointer-events-none fixed -top-40 -left-20 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.08] blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-0 right-0 w-[450px] h-[400px] rounded-full bg-emerald-600/[0.05] blur-[110px]"
        aria-hidden="true"
      />

      {/* ── Centered content ─────────────────────────────────────── */}
      <div className="relative flex justify-center px-4 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <Suspense
          fallback={
            <div className="text-center py-20 text-gray-600 text-sm">Loading…</div>
          }
        >
          <SubmitPageInner />
        </Suspense>
      </div>

    </div>
  );
}
