"use client";

/**
 * HomepageMoreJobs
 *
 * Secondary job listing shown below the hero — replaces the old
 * HomepageJobsCard content after Tiel jobs were promoted to the card.
 * Applications go through the round-robin recruiter system (referralMode).
 */

import ApplyPreScreen from "@/components/ApplyPreScreen";
import Link from "next/link";

const WA_BASE = "https://wa.me/31613754893";

const MORE_JOBS = [
  {
    slug:     "warehouse-worker-fresh-department",
    title:    "Warehouse Worker (Fresh dept.)",
    location: "Netherlands",
    salary:   "€14.98/h gross",
    icon:     "📦",
    hot:      true,
  },
  {
    slug:     "order-picker-cold-ridderkerk",
    title:    "Order Picker (cooled 5–7°C)",
    location: "Ridderkerk",
    salary:   "€14.71/h gross",
    icon:     "🧊",
    hot:      false,
  },
  {
    slug:     "cnc-milling-operator-oirschot",
    title:    "CNC Milling Operator",
    location: "Oirschot",
    salary:   "€630/wk",
    icon:     "🏭",
    hot:      false,
  },
];

const WA_ICON_SM = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function HomepageMoreJobs() {
  return (
    <section className="w-full mb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
            Also hiring now
          </span>
          <h2 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
            More vacancies via AgencyCheck
          </h2>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Now Hiring</span>
        </div>
      </div>

      {/* Job rows */}
      <div className="flex flex-col gap-2">
        {MORE_JOBS.map((job) => (
          <div
            key={job.slug}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 flex items-center justify-between gap-3"
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
                source="homepage-more-jobs"
                jobId={job.slug}
                referralMode
              >
                {(openFn) => (
                  <button
                    onClick={openFn}
                    className="flex items-center gap-1 bg-[#22C55E] hover:bg-green-400 active:scale-[0.97] text-white font-black text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap"
                  >
                    {WA_ICON_SM}
                    Apply
                  </button>
                )}
              </ApplyPreScreen>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 border-t border-white/[0.06] pt-3">
        <Link
          href="/apply"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] hover:bg-emerald-500/[0.10] text-emerald-400 font-bold text-[12px] transition-all duration-150"
        >
          Browse all vacancies →
        </Link>
      </div>
    </section>
  );
}
