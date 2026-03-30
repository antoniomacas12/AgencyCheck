/**
 * DIAGNOSTIC: page.tsx stripped to bare static HTML.
 * Zero client components — no SmartSearch, ApplyBar, AgencyCard, LiveActivityFeed,
 * WorkerReviewCard, RealSalaryBlock, or WorkerHousingStrip.
 *
 * Purpose: confirm hydration is stable when the page tree is purely server-rendered.
 * If production is stable after this deploy, the crash lives in one of the removed
 * components.  Re-add them one at a time (see comments at the bottom of this file).
 *
 * Restore the full page from git:
 *   git show HEAD~1:app/page.tsx > app/page.tsx
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AgencyCheck — See Your REAL Salary After Housing & Costs — Netherlands",
  description:
    "Most agency jobs pay €14–€17/hr but workers keep far less after housing, insurance and transport. See real take-home pay, real housing conditions and worker reviews before you sign.",
};

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── DIAGNOSTIC BANNER ───────────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-700 font-medium">
        🔧 Diagnostic mode — static-only page (no client components)
      </div>

      {/* ── HERO — 100% static, no client components ────────────────────── */}
      <section className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="max-w-3xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide mb-8">
              🇳🇱 Independent · No ads · 100% worker-first
            </div>

            <h1 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight mb-6">
              You think you earn{" "}
              <span className="text-green-400 whitespace-nowrap">€600/week.</span>
              <br />
              You actually keep{" "}
              <span className="text-red-400 whitespace-nowrap">€243.</span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Agency housing, health insurance, transport and admin fees eat your pay
              before you touch it. See the{" "}
              <strong className="text-white font-semibold">real breakdown</strong> and
              compare agencies that are actually honest about costs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/jobs-with-accommodation"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-8 py-4 text-base font-black text-white shadow-lg shadow-green-900/40 transition-colors hover:bg-green-400"
              >
                🏠 Find jobs with housing
              </Link>
              <Link
                href="/tools/real-income-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/25 bg-white/10 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/20 hover:border-white/40"
              >
                🧮 See real salary after costs
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATIC TRUST STRIP ──────────────────────────────────────────── */}
      <section className="border-b border-gray-800 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-gray-400 text-sm">
            127 verified agencies · Real worker reviews · Zero paid placements
          </p>
        </div>
      </section>

      {/* ── STATIC CTA ──────────────────────────────────────────────────── */}
      <section className="bg-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl font-black mb-4">Tell us what you need —</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto text-sm">
            Submit once. We match you with agencies that include accommodation. Free.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 px-8 py-4 text-base font-black shadow-lg hover:bg-gray-100 transition-colors"
          >
            Find me a job with housing
          </Link>
        </div>
      </section>

      {/* ── STATIC LINKS ────────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Explore AgencyCheck</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/agencies"               className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">📋 All agencies</Link>
            <Link href="/agencies-with-housing"  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">🏢 Housing agencies</Link>
            <Link href="/reviews"                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">⭐ Worker reviews</Link>
            <Link href="/jobs-with-accommodation" className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">🏠 Jobs with housing</Link>
            <Link href="/tools/real-income-calculator" className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">🧮 Salary calculator</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

/*
 * ═══════════════════════════════════════════════════════════════════
 * RE-ADDITION ORDER (add ONE section per deploy, test after each):
 *
 * Phase 1 — Add SmartSearch (client, reads suggestions prop)
 * Phase 2 — Add ApplyBar (client, buttonOnly mode)
 * Phase 3 — Add RealSalaryBlock (server component, toLocaleString risk)
 * Phase 4 — Add WorkerHousingStrip (server component, static)
 * Phase 5 — Add AgencyCard x3 (client, uses useT + toFixed)
 * Phase 6 — Add WorkerReviewCard x3 (server component, static)
 * Phase 7 — Add LiveActivityFeed (ssr:false — should be safe)
 *
 * The first phase that reintroduces the crash identifies the culprit.
 * ═══════════════════════════════════════════════════════════════════
 */
