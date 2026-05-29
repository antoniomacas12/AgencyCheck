"use client";

/**
 * HomepageJobsCard
 *
 * Replaces the static salary-breakdown card on the homepage.
 * Shows 3 high-value "Now Hiring" jobs with direct Apply buttons
 * so visitors can start the apply flow without leaving the homepage.
 */

import Link from "next/link";
import ApplyPreScreen from "@/components/ApplyPreScreen";

const WA_BASE = "https://wa.me/31613754893";

const TOP_JOBS = [
  {
    slug:     "ce-truck-driver-hook-arm-eindhoven",
    title:    "CE Truck Driver (Hook arm)",
    location: "Eindhoven",
    salary:   "€1000–€1200/wk",
    icon:     "🚛",
    hot:      true,
  },
  {
    slug:     "forklift-driver-ijmuiden",
    title:    "Forklift Driver",
    location: "IJmuiden",
    salary:   "€16.05/h gross",
    icon:     "📦",
    hot:      false,
  },
  {
    slug:     "electrician-bodegraven",
    title:    "Electrician",
    location: "Bodegraven",
    salary:   "€550–€650/wk",
    icon:     "🔧",
    hot:      false,
  },
];

export default function HomepageJobsCard({ totalJobs }: { totalJobs: number }) {
  return (
    <div className="relative rounded-2xl border border-white/[0.12] bg-white/[0.05] backdrop-blur-2xl overflow-hidden"
      style={{ boxShadow: "0 12px 56px rgba(0,0,0,0.65), 0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.10)" }}
    >
      {/* Glow top-right */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/[0.12] blur-3xl" aria-hidden="true" />
      {/* Glow bottom-left */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-40 h-40 rounded-full bg-blue-500/[0.08] blur-2xl" aria-hidden="true" />

      <div className="relative p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/[0.12] px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Now hiring</span>
          </div>
          <span className="text-[11px] text-gray-500 font-medium">{totalJobs} open positions</span>
        </div>

        {/* Job list */}
        <div className="space-y-3 mb-5">
          {TOP_JOBS.map((job) => (
            <div
              key={job.slug}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[13px]">{job.icon}</span>
                  <p className="text-white font-semibold text-[13px] leading-snug truncate">
                    {job.title}
                  </p>
                  {job.hot && (
                    <span className="shrink-0 text-[9px] font-black bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                      Hot
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-[11px]">📍 {job.location}</p>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-emerald-400 text-[11px] font-black whitespace-nowrap">
                  {job.salary}
                </span>
                <ApplyPreScreen
                  waBase={WA_BASE}
                  jobTitle={job.title}
                  source="homepage-card"
                  jobId={job.slug}
                  referralMode
                >
                  {(openFn) => (
                    <button
                      onClick={openFn}
                      className="flex items-center gap-1 bg-[#22C55E] hover:bg-green-400 active:scale-[0.97] text-white font-black text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Apply
                    </button>
                  )}
                </ApplyPreScreen>
              </div>
            </div>
          ))}
        </div>

        {/* Divider + footer */}
        <div className="border-t border-white/[0.07] pt-4">
          <Link
            href="/apply"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] hover:bg-emerald-500/[0.14] text-emerald-400 font-black text-[13px] transition-all duration-150"
          >
            View all {totalJobs} vacancies →
          </Link>
        </div>

      </div>
    </div>
  );
}
