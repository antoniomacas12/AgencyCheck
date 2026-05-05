"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Job cards data ────────────────────────────────────────────────────────────
// To add / remove / edit jobs: modify this array only.
const HOT_JOBS = [
  {
    id: 1,
    title: "C+E Truck Driver",
    location: "Dordrecht, NL",
    tag: "Direct contract",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    href: "/apply/reachtruck",
    external: false,
  },
  {
    id: 2,
    title: "Food Production Operator",
    location: "Netherlands",
    tag: "Fast placement",
    tagColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    href: "/apply/food-production",
    external: false,
  },
  {
    id: 3,
    title: "Production Worker / Picker",
    location: "Near Maastricht, NL",
    tag: "€16.12/hr",
    tagColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    href: "/apply/production-worker-maastricht",
    external: false,
  },
  {
    id: 4,
    title: "Warehouse Worker",
    location: "Netherlands",
    tag: "Housing available",
    tagColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    href: "https://wa.me/31649210631?text=Hi%2C%20I%20want%20to%20apply%20for%20the%20Warehouse%20Worker%20position%20in%20Netherlands.",
    external: true,
  },
];

export default function HotJobsBanner() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6">

      {/* ── Trigger card ──────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="hot-jobs-panel"
        className="w-full text-left"
      >
        <div className={`
          relative overflow-hidden rounded-2xl border transition-all duration-200
          ${open
            ? "border-amber-400/40 bg-amber-400/[0.07]"
            : "border-amber-400/25 bg-amber-400/[0.05] hover:bg-amber-400/[0.09] active:scale-[0.99]"
          }
        `}>
          {/* Subtle glow */}
          <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl" />

          <div className="relative flex items-center gap-3.5 px-4 py-4 sm:px-5 sm:py-4">
            {/* Animated dot */}
            <span className="relative flex-shrink-0">
              <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-30" />
              <span className="relative flex h-3 w-3 rounded-full bg-amber-400" />
            </span>

            {/* Text block */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                  Hot Jobs
                </span>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/20 rounded-full px-2 py-0.5">
                  {HOT_JOBS.length} open now
                </span>
              </div>
              <p className="text-white font-bold text-[15px] sm:text-[16px] leading-snug">
                Start working next week in NL
              </p>
            </div>

            {/* Chevron */}
            <div className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              border border-amber-400/20 bg-amber-400/10 text-amber-400
              transition-transform duration-200
              ${open ? "rotate-180" : ""}
            `}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {/* ── Expanded panel ─────────────────────────────────────────── */}
      <div
        id="hot-jobs-panel"
        role="region"
        aria-label="Open positions"
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="pt-2 flex flex-col gap-2">

          {HOT_JOBS.map((job) => {
            const inner = (
              <div className="
                group flex items-center gap-3 rounded-2xl
                border border-white/[0.08] bg-white/[0.04]
                hover:bg-white/[0.07] active:scale-[0.98]
                px-4 py-4 transition-all duration-150
              ">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-[15px] leading-tight truncate">
                    {job.title}
                  </p>
                  <p className="text-gray-400 text-[12px] mt-0.5">
                    📍 {job.location}
                  </p>
                </div>

                {/* Tag + arrow */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                  <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${job.tagColor}`}>
                    {job.tag}
                  </span>
                  <span className="flex items-center gap-1 text-[12px] font-black text-emerald-400 group-hover:text-emerald-300">
                    Apply
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            );

            return job.external ? (
              <a
                key={job.id}
                href={job.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            ) : (
              <Link key={job.id} href={job.href}>
                {inner}
              </Link>
            );
          })}

          {/* Footer hint */}
          <p className="text-center text-gray-600 text-[11px] pt-1 pb-0.5">
            Tap any position to see details & apply
          </p>
        </div>
      </div>

    </div>
  );
}
