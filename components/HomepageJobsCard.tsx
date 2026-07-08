"use client";

/**
 * HomepageJobsCard
 *
 * Hero right-column card — shows the 4minutes × Johma partnership vacancies.
 * Applications go through the apply pre-screen (referralMode).
 */

import Link from "next/link";
import ApplyPreScreen from "@/components/ApplyPreScreen";

const WA_BASE = "https://wa.me/31649210631";

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const JOHMA_JOBS = [
  {
    slug:    "johma-logistics-operator",
    title:   "Logistics Operator",
    salary:  "€17.04/hr gross",
    note:    "Most popular · Immediate start · Housing included",
    tags:    ["🏠 Housing incl.", "📦 Logistics"],
    icon:    "📦",
    href:    "/apply/johma-logistics-operator",
  },
  {
    slug:    "johma-line-operator",
    title:   "Line Operator",
    salary:  "€16.01/hr gross",
    note:    "Technical production role · 2-shift schedule",
    tags:    ["🏠 Housing incl.", "🏭 Production"],
    icon:    "🏭",
    href:    "/apply/johma-line-operator",
  },
  {
    slug:    "johma-food-mixing-operator",
    title:   "Food Mixing Operator",
    salary:  "€16.01/hr gross",
    note:    "Food production · Recipe preparation",
    tags:    ["🏠 Housing incl.", "🍖 Food"],
    icon:    "🍖",
    href:    "/apply/johma-food-mixing-operator",
  },
  {
    slug:    "johma-operator-kitchen",
    title:   "Operator Kitchen",
    salary:  "€16.01/hr gross",
    note:    "Kitchen production · Hygiene-focused environment",
    tags:    ["🏠 Housing incl.", "👨‍🍳 Kitchen"],
    icon:    "👨‍🍳",
    href:    "/apply/johma-operator-kitchen",
  },
] as const;

const DELIBARN_JOB = {
  slug:   "delibarn-operator",
  title:  "Operator (Day Shift)",
  salary: "€16.01/hr gross",
  note:   "Day shift only · Housing in Goor · Long-term",
  tags:   ["☀️ Day shift", "🏠 Housing avail.", "🥩 Food prod."],
  icon:   "🥩",
  href:   "/apply/delibarn-operator",
} as const;

export default function HomepageJobsCard({ totalJobs }: { totalJobs: number }) {
  return (
    <div
      className="relative rounded-2xl border border-emerald-500/25 bg-[#071a0e] overflow-hidden"
      style={{
        boxShadow:
          "0 12px 56px rgba(0,0,0,0.72), 0 2px 16px rgba(0,0,0,0.50), inset 0 1px 0 rgba(52,211,153,0.08)",
      }}
    >
      {/* Emerald glow top-right */}
      <div
        className="pointer-events-none absolute -top-8 -right-8 w-48 h-48 rounded-full bg-emerald-500/[0.12] blur-3xl"
        style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
        aria-hidden="true"
      />
      {/* Subtle glow bottom-left */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-32 h-32 rounded-full bg-emerald-400/[0.07] blur-2xl"
        style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
        aria-hidden="true"
      />

      <div className="relative p-5 sm:p-6">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-red-500/15 text-red-400 border border-red-500/30 rounded-full px-2.5 py-0.5 uppercase tracking-widest">
                🔥 Urgent
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full px-2.5 py-0.5 uppercase tracking-widest">
                ✓ Verified
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-full px-2.5 py-0.5 uppercase tracking-widest">
                🏠 Housing incl.
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-semibold">
              4minutes × Johma · Losser, Netherlands
            </p>
          </div>
          <span className="text-[10px] text-gray-500 shrink-0 mt-1 whitespace-nowrap">
            {totalJobs} open positions
          </span>
        </div>

        {/* ── Job cards — compact 4-row list ─────────────────────── */}
        <div className="space-y-2 mb-4">
          {JOHMA_JOBS.map((job) => (
            <div
              key={job.slug}
              className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] px-3.5 py-3"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[13px] shrink-0">{job.icon}</span>
                  <p className="text-white font-bold text-[12px] leading-snug truncate">
                    {job.title}
                  </p>
                </div>
                <span className="text-emerald-400 text-[11px] font-black whitespace-nowrap shrink-0">
                  {job.salary}
                </span>
              </div>
              <p className="text-gray-600 text-[10px] mb-2">{job.note}</p>

              <ApplyPreScreen
                waBase={WA_BASE}
                jobTitle={`${job.title} — Johma`}
                source="homepage-card-johma"
                jobId={job.slug}
                referralMode
              >
                {(openFn) => (
                  <button
                    onClick={openFn}
                    className="flex items-center justify-center gap-1.5 w-full bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.97] text-white font-black text-[11px] px-3 py-2.5 rounded-lg transition-all duration-150"
                    style={{ boxShadow: "0 2px 10px rgba(37,211,102,0.20)" }}
                  >
                    {WA_ICON}
                    Apply on WhatsApp
                  </button>
                )}
              </ApplyPreScreen>
            </div>
          ))}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div className="border-t border-white/[0.07] pt-4 mb-4">
          <Link
            href="/apply/johma-logistics-operator"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] hover:bg-emerald-500/[0.12] text-emerald-300 font-black text-[12px] transition-all duration-150"
          >
            View all {totalJobs} vacancies →
          </Link>
        </div>

        {/* ── DeliBarn section ────────────────────────────────────── */}
        <div className="border-t border-white/[0.07] pt-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-full px-2.5 py-0.5 uppercase tracking-widest">
                  ☀️ Day shift
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full px-2.5 py-0.5 uppercase tracking-widest">
                  ✓ Verified
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-semibold">
                4minutes × DeliBarn · Borculo, Netherlands
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] px-3.5 py-3 mb-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[13px] shrink-0">{DELIBARN_JOB.icon}</span>
                <p className="text-white font-bold text-[12px] leading-snug truncate">
                  {DELIBARN_JOB.title}
                </p>
              </div>
              <span className="text-emerald-400 text-[11px] font-black whitespace-nowrap shrink-0">
                {DELIBARN_JOB.salary}
              </span>
            </div>
            <p className="text-gray-600 text-[10px] mb-2">{DELIBARN_JOB.note}</p>

            <ApplyPreScreen
              waBase={WA_BASE}
              jobTitle="Operator (Day Shift) — DeliBarn"
              source="homepage-card-delibarn"
              jobId={DELIBARN_JOB.slug}
              referralMode
            >
              {(openFn) => (
                <button
                  onClick={openFn}
                  className="flex items-center justify-center gap-1.5 w-full bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.97] text-white font-black text-[11px] px-3 py-2.5 rounded-lg transition-all duration-150"
                  style={{ boxShadow: "0 2px 10px rgba(37,211,102,0.20)" }}
                >
                  {WA_ICON}
                  Apply on WhatsApp
                </button>
              )}
            </ApplyPreScreen>
          </div>

          <Link
            href="/apply/delibarn-operator"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] hover:bg-amber-500/[0.10] text-amber-300 font-black text-[12px] transition-all duration-150"
          >
            View DeliBarn job details →
          </Link>
        </div>

      </div>
    </div>
  );
}
