"use client";

import Link from "next/link";
import ApplyPreScreen from "@/components/ApplyPreScreen";

/**
 * FeaturedJobJohma — Recruitment Partnership Section
 *
 * AgencyCheck × 4minutes × Johma — Losser, NL
 * 6 sections: Partner Banner · Job Cards · Why Johma ·
 *             Housing Transparency · About Partnership · Apply CTA
 */

const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Johma Vacancy — Losser, NL";
const JOB_ID    = "johma-all";
const SOURCE    = "johma-homepage";

// ─── Job cards ────────────────────────────────────────────────────────────────
const JOBS = [
  {
    href:    "/apply/johma-logistics-operator",
    title:   "Logistics Operator",
    salary:  "€17.04",
    tag:     "Most Popular",
    tagColor:"bg-amber-400/10 text-amber-300 border-amber-400/25",
    desc:    "Manage logistics and material flow within the Johma production site.",
    border:  "border-[#22C55E]/20",
  },
  {
    href:    "/apply/johma-line-operator",
    title:   "Line Operator",
    salary:  "€16.01",
    tag:     "Technical Role",
    tagColor:"bg-blue-400/10 text-blue-300 border-blue-400/25",
    desc:    "Keep the production line running at full efficiency and quality.",
    border:  "border-white/[0.10]",
  },
  {
    href:    "/apply/johma-food-mixing-operator",
    title:   "Food Mixing Operator",
    salary:  "€16.01",
    tag:     "Food Production",
    tagColor:"bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
    desc:    "Mix and prepare ingredients for Johma's fresh salad production lines.",
    border:  "border-white/[0.10]",
  },
  {
    href:    "/apply/johma-operator-kitchen",
    title:   "Operator Kitchen",
    salary:  "€16.01",
    tag:     "Kitchen Production",
    tagColor:"bg-purple-400/10 text-purple-300 border-purple-400/25",
    desc:    "Prepare raw materials in the hot kitchen for salad production.",
    border:  "border-white/[0.10]",
  },
] as const;

// ─── Benefit cards ─────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: "🏠", title: "Accommodation Arranged",  body: "Single rooms from €136.74/week. Couples can share from €103.94/week per person. Handled entirely by 4minutes before you arrive." },
  { icon: "🚐", title: "Transport to Johma",       body: "4minutes organises your route. Scooter, bicycle or car also available. Travel allowance €0.23/km paid on top." },
  { icon: "🔄", title: "3-Shift System",           body: "Morning, afternoon and night shifts. Allowances up to +35% from 18:00 — your payslip grows with every night worked." },
  { icon: "📋", title: "Long-Term Stability",      body: "Not a temp placement. Johma offers long-term contracts with a real path to a permanent contract via 4minutes." },
  { icon: "🎁", title: "3% Year-End Bonus",        body: "Paid every December. The longer you stay, the more you earn. A real incentive to commit." },
  { icon: "🥗", title: "Weekly Salad Package",     body: "Fresh Johma salads to take home every week — a small but genuine sign of a company that values its workers." },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeaturedJobJohma() {
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
                  Active · Losser, NL
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
                <span className="text-white font-black text-[13px] tracking-tight">Johma</span>
                <span className="text-gray-500 text-[11px] font-medium">· Losser</span>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-white font-extrabold text-[26px] sm:text-[32px] leading-tight mb-2">
              4 Open Positions at Johma
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Long-term jobs in the Netherlands with accommodation available.
              Apply once — our team matches you with the most suitable position.
            </p>
          </div>

          {/* Trust badges */}
          <div className="px-5 sm:px-8 py-4 flex flex-wrap gap-2">
            {[
              "✓ Accommodation Available",
              "✓ Couples Welcome",
              "✓ Long-Term Contracts",
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
            SECTION 2 — JOB CARDS
        ════════════════════════════════════════════════════ */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Available Positions
            </p>
            <span className="h-px flex-1 bg-white/[0.06]" />
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#22C55E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              4 roles open
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {JOBS.map((job) => (
              <Link key={job.href} href={job.href} className="group block">
                <div className={`h-full rounded-2xl border ${job.border} bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#22C55E]/35 transition-all duration-200 px-5 py-4 flex flex-col gap-3`}>

                  {/* Tag + title */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-extrabold text-[16px] leading-snug group-hover:text-[#22C55E] transition-colors">
                        {job.title}
                      </p>
                      <p className="text-gray-500 text-[12px] mt-0.5 leading-snug">{job.desc}</p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-bold border rounded-full px-2.5 py-1 ${job.tagColor}`}>
                      {job.tag}
                    </span>
                  </div>

                  {/* Salary + view */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.07]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[#22C55E] font-extrabold text-[20px] leading-none">{job.salary}</span>
                      <span className="text-gray-500 text-[11px]">/hr base</span>
                      <span className="text-amber-300 text-[11px] font-semibold">· +35% nights</span>
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
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            SECTION 3 — WHY WORKERS CHOOSE JOHMA
        ════════════════════════════════════════════════════ */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Why Workers Choose Johma
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
            SECTION 4 — HOUSING TRANSPARENCY
        ════════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-purple-400/20 bg-purple-400/[0.04] overflow-hidden">

          {/* Header */}
          <div className="px-5 sm:px-8 pt-6 pb-4 border-b border-white/[0.07]">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-300 mb-2">
                  🏠 Housing Transparency
                </p>
                <h3 className="text-white font-extrabold text-[18px] leading-snug mb-1">
                  Know exactly what you&apos;ll pay — before you apply.
                </h3>
                <p className="text-gray-400 text-[13px] leading-relaxed max-w-md">
                  AgencyCheck believes every worker deserves to see housing costs upfront.
                  No surprises, no hidden fees. The prices below are real — verified directly
                  with our recruitment partner 4minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Price cards */}
          <div className="px-5 sm:px-8 py-5 border-b border-white/[0.07]">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Single Room
                </p>
                <p className="text-white font-extrabold text-[24px] sm:text-[28px] leading-none mb-0.5">
                  €136.74
                </p>
                <p className="text-gray-500 text-[11px]">per week</p>
              </div>
              <div className="rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Couples Room
                </p>
                <p className="text-white font-extrabold text-[24px] sm:text-[28px] leading-none mb-0.5">
                  €103.94
                </p>
                <p className="text-gray-500 text-[11px]">per person / week</p>
              </div>
              <div className="rounded-xl bg-white/[0.06] border border-white/[0.08] px-4 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Deposit
                </p>
                <p className="text-white font-extrabold text-[24px] sm:text-[28px] leading-none mb-0.5">
                  €300
                </p>
                <p className="text-emerald-300 text-[11px] font-semibold">Fully refundable</p>
              </div>
            </div>
          </div>

          {/* Housing detail list */}
          <div className="px-5 sm:px-8 py-4 border-b border-white/[0.07]">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {[
                "Single rooms for individuals",
                "Couples can share — save €32.80/week per person",
                "Max 4 bedrooms per house",
                "Shared kitchen and bathroom",
                "Weekly cleaning of common areas",
                "Deducted from payslip — no upfront rent search",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[12px] text-gray-400">
                  <span className="text-purple-300 shrink-0 font-bold">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Trust badge */}
          <div className="px-5 sm:px-8 py-4">
            <div className="inline-flex items-center gap-2.5 bg-purple-400/10 border border-purple-400/20 rounded-xl px-4 py-2.5">
              <span className="text-purple-300 text-base">🔒</span>
              <span className="text-purple-200 text-[12px] font-semibold leading-snug">
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
                Johma&apos;s active vacancies without navigating multiple agency websites.
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
                  "You are matched to the most suitable Johma role",
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
            Apply Once.{" "}
            <span className="block sm:inline">Be Considered for All Johma Positions.</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto mb-6">
            You don&apos;t need to apply separately for each vacancy. Send one application —
            4minutes reviews your profile and places you in the most suitable Johma role
            based on your availability, experience and housing preference.
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
              96 candidates applied this week · 4minutes responds within 24h
            </span>
          </div>

          {/* CTA buttons — ApplyPreScreen render prop */}
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
                  Apply for Johma Jobs
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <a
                  href={`${WA_BASE}?text=${encodeURIComponent("Hi, I'd like more information about Johma vacancies in Losser, NL via AgencyCheck. Can you tell me about the positions and accommodation?")}`}
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
