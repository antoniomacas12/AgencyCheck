"use client";

import Link from "next/link";
import ApplyPreScreen from "@/components/ApplyPreScreen";

/**
 * FeaturedJobDeliBarn — Recruitment Partnership Section
 *
 * AgencyCheck × 4minutes × DeliBarn — Borculo, NL
 * 6 sections: Partner Banner · Job Card · Why DeliBarn ·
 *             Housing Info · About Partnership · Apply CTA
 */

const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "DeliBarn Operator Vacancy — Borculo, NL";
const JOB_ID    = "delibarn-operator";
const SOURCE    = "delibarn-homepage";

// ─── Benefit cards ─────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: "☀️", title: "Day Shift Only",              body: "Work daytime hours only — no nights, no rotating shifts. A stable schedule with a better work-life balance from day one." },
  { icon: "🏠", title: "Accommodation Available",     body: "Housing arranged through 4minutes in Goor — approximately 20 minutes from the DeliBarn facility in Borculo." },
  { icon: "🚗", title: "Mileage Reimbursement",       body: "Own car preferred and fully reimbursed. If two suitable licensed candidates are matched, 4minutes may provide a company car." },
  { icon: "📋", title: "Long-Term Stability",         body: "Stable, long-term position at a professional food production facility. Not a temp placement — this is a real career move." },
  { icon: "📈", title: "Career Growth Opportunities", body: "Grow within DeliBarn. Experience leading or coordinating people on a production line is a major plus and opens real doors." },
  { icon: "🥩", title: "Professional Environment",    body: "Modern meat production facility producing high-quality charcuterie. A well-run company with strong standards and a friendly team." },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeaturedJobDeliBarn() {
  return (
    <section className="bg-[#0B1F14] border-b border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">

        {/* ════════════════════════════════════════════════════
            SECTION 1 — PARTNER BANNER
        ════════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-[#22C55E]/20 bg-gradient-to-br from-[#0f2318] to-[#0B1F14] overflow-hidden">

          {/* Top content */}
          <div className="px-5 sm:px-8 pt-6 pb-5 border-b border-white/[0.07]">
            {/* Partnership label */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#22C55E]">
                Recruitment Partnership
              </span>
              <span className="h-px flex-1 bg-white/[0.06]" />
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                  Active · Borculo, NL
                </span>
              </div>
            </div>

            {/* Partner wordmarks */}
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex items-center bg-white/[0.06] border border-white/[0.09] rounded-xl px-3 py-2">
                <span className="text-white font-black text-[13px] tracking-tight">4minutes</span>
              </div>
              <span className="text-gray-600 text-sm font-light">×</span>
              <div className="inline-flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.09] rounded-xl px-3 py-2">
                <span className="text-white font-black text-[13px] tracking-tight">DeliBarn</span>
                <span className="text-gray-500 text-[11px] font-medium">· Borculo</span>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-white font-extrabold text-[26px] sm:text-[32px] leading-tight mb-2">
              Operator (Day Shift) at DeliBarn
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Long-term food production job in Borculo with accommodation available.
              Day shift, stable employment, and real career growth opportunities.
            </p>
          </div>

          {/* Trust badges */}
          <div className="px-5 sm:px-8 py-4 flex flex-wrap gap-2">
            {[
              "✓ Accommodation Available",
              "✓ Day Shift Only",
              "✓ Long-Term Contract",
              "✓ Immediate Start",
              "✓ Recruitment Partner: 4minutes",
            ].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center text-[11px] sm:text-[12px] font-semibold text-gray-300 bg-white/[0.05] border border-white/[0.09] rounded-full px-3 py-1.5"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            SECTION 2 — JOB CARD
        ════════════════════════════════════════════════════ */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Available Position
            </p>
            <span className="h-px flex-1 bg-white/[0.06]" />
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#22C55E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              Now Hiring
            </span>
          </div>

          <Link href={`/apply/${JOB_ID}`} className="group block">
            <div className="h-full rounded-2xl border border-[#22C55E]/20 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#22C55E]/35 transition-all duration-200 px-5 py-4 flex flex-col gap-3">

              {/* Tag + title */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-extrabold text-[16px] leading-snug group-hover:text-[#22C55E] transition-colors">
                    Operator (Day Shift)
                  </p>
                  <p className="text-gray-500 text-[12px] mt-0.5 leading-snug">
                    Operate and monitor meat production lines in a modern food production facility.
                  </p>
                </div>
                <span className="shrink-0 text-[10px] font-bold border rounded-full px-2.5 py-1 bg-amber-400/10 text-amber-300 border-amber-400/25">
                  Day Shift
                </span>
              </div>

              {/* Salary + view */}
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.07]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[#22C55E] font-extrabold text-[20px] leading-none">€16.01</span>
                  <span className="text-gray-500 text-[11px]">/hr gross</span>
                  <span className="text-blue-300 text-[11px] font-semibold">· Day shift</span>
                </div>
                <span className="text-[12px] font-bold text-gray-500 group-hover:text-[#22C55E] flex items-center gap-1 transition-colors">
                  View
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* ════════════════════════════════════════════════════
            SECTION 3 — WHY WORKERS CHOOSE DELIBARN
        ════════════════════════════════════════════════════ */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Why Workers Choose DeliBarn
            </p>
            <span className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BENEFITS.map(({ icon, title, body }) => (
              <div key={title} className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm leading-snug mb-0.5">{title}</p>
                  <p className="text-gray-400 text-[12px] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            SECTION 4 — ACCOMMODATION INFORMATION
        ════════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-[#22C55E]/20 bg-[#071a0e] overflow-hidden">

          {/* Header */}
          <div className="px-5 sm:px-8 pt-6 pb-5 border-b border-white/[0.07]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
              🏠 Accommodation Information
            </p>
            <h3 className="text-white font-extrabold text-[20px] sm:text-[24px] leading-snug mb-2">
              Housing arranged before you start — no searching required.
            </h3>
            <p className="text-gray-400 text-[13px] sm:text-[14px] leading-relaxed max-w-lg">
              AgencyCheck believes every worker deserves to know their housing situation
              before they arrive. 4minutes arranges accommodation for DeliBarn workers in
              Goor — approximately 20 minutes from the production facility in Borculo.
            </p>
          </div>

          {/* Housing details */}
          <div className="px-5 sm:px-8 py-5 border-b border-white/[0.07]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {[
                "Located in Goor — approx. 20 min from Borculo",
                "Arranged by 4minutes before your start date",
                "Own car preferred — mileage reimbursement provided",
                "Possible company car if 2 licensed candidates are matched",
                "No upfront housing search — 4minutes handles it all",
                "Housing costs confirmed transparently before you accept",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-[13px] text-gray-300">
                  <span className="text-[#22C55E] shrink-0 font-bold mt-0.5">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Trust badge */}
          <div className="px-5 sm:px-8 py-4">
            <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-3">
              <span className="text-[#22C55E] text-base shrink-0">🔒</span>
              <span className="text-gray-300 text-[12px] font-semibold leading-snug">
                Accommodation information verified by recruitment partner 4minutes.
              </span>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            SECTION 5 — ABOUT THE PARTNERSHIP
        ════════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] px-5 sm:px-8 py-6">
          <div className="flex items-center gap-3 mb-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              About This Partnership
            </p>
            <span className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-white font-semibold text-sm mb-2">
                AgencyCheck × 4minutes
              </p>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                AgencyCheck works directly with 4minutes — a specialist recruiter placing
                workers in food production and logistics roles across the Netherlands.
                This partnership gives candidates a single, transparent route into
                DeliBarn&apos;s active vacancy without navigating multiple agency websites.
              </p>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-2">
                How It Works
              </p>
              <ol className="space-y-2">
                {[
                  "Apply once through AgencyCheck",
                  "4minutes reviews your profile within 24 hours",
                  "You are matched to the DeliBarn Operator role",
                  "Housing, transport and start date confirmed together",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-2.5 text-[13px] text-gray-400">
                    <span className="text-[#22C55E] font-black text-[11px] shrink-0 mt-0.5 tabular-nums">
                      {i + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Trust signals row */}
          <div className="mt-5 pt-4 border-t border-white/[0.07] flex flex-wrap gap-x-5 gap-y-2">
            {[
              { icon: "🔒", text: "Your data is never sold" },
              { icon: "⚡", text: "24h response from 4minutes" },
              { icon: "🇳🇱", text: "Dutch legal employment contracts" },
              { icon: "✅", text: "EU work authorisation required" },
            ].map(({ icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span>{icon}</span> {text}
              </span>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            SECTION 6 — APPLY ONCE CTA
        ════════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/[0.06] px-5 sm:px-8 py-7 text-center">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            Ready to Apply?
          </span>
          <h3 className="text-white font-extrabold text-[22px] sm:text-[28px] leading-tight mb-3">
            Apply Now.{" "}
            <span className="block sm:inline">One Message. Job Confirmed.</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-6">
            Send one application — 4minutes reviews your profile and confirms your
            start date, housing and transport for the DeliBarn Operator role in Borculo.
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex -space-x-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-[#22C55E]/25 border-2 border-[#0B1F14] flex items-center justify-center text-[9px]"
                >
                  👤
                </div>
              ))}
            </div>
            <span className="text-gray-500 text-[12px]">
              4minutes responds within 24h
            </span>
          </div>

          {/* CTA buttons */}
          <ApplyPreScreen
            waBase={WA_BASE}
            jobTitle={JOB_TITLE}
            jobId={JOB_ID}
            source={SOURCE}
            referralMode
          >
            {(open) => (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={open}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-green-400 text-white font-bold text-sm px-7 py-3.5 rounded-xl transition-colors active:scale-[0.98]"
                >
                  Apply for DeliBarn Operator
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <a
                  href={`${WA_BASE}?text=${encodeURIComponent("Hi, I'd like more information about the DeliBarn Operator vacancy in Borculo, NL via AgencyCheck. Can you tell me about the position and accommodation?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.12] text-gray-200 font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors"
                >
                  Request More Information
                </a>
              </div>
            )}
          </ApplyPreScreen>

          <p className="text-gray-600 text-[11px] mt-4">
            AgencyCheck · Real data. Real experiences. · EU work authorisation required.
          </p>
        </div>

      </div>
    </section>
  );
}
