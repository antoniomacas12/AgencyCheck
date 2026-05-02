"use client";

import { useState } from "react";

// ─── Job cards data ────────────────────────────────────────────────────────────
// To add / remove / edit jobs: modify this array only.
const HOT_JOBS = [
  {
    id: 1,
    title: "C+E Truck Driver",
    location: "Dordrecht, NL",
    benefit: "Direct client · Daily return routes",
    href: "/apply/reachtruck",
    external: false,
  },
  {
    id: 2,
    title: "Food Production Operator",
    location: "Netherlands",
    benefit: "Fast placement via verified agency partners",
    href: "/apply/food-production",
    external: false,
  },
  {
    id: 3,
    title: "Packaging / Machine Operator",
    location: "Netherlands",
    benefit: "Food industry experience preferred",
    href: "https://wa.me/31649210631",
    external: true,
  },
  {
    id: 4,
    title: "Warehouse Worker",
    location: "Netherlands",
    benefit: "Accommodation options available",
    href: "https://wa.me/31649210631",
    external: true,
  },
];

export default function HotJobsBanner() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mb-6">

      {/* ── Collapsed trigger card ──────────────────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="hot-jobs-panel"
        className="w-full group flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/15 active:scale-[0.98] px-4 py-3.5 transition-all duration-150 text-left"
      >
        {/* Pulse dot */}
        <span className="relative flex-shrink-0">
          <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
          <span className="relative flex h-2.5 w-2.5 rounded-full bg-amber-400" />
        </span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Hot Jobs in the Netherlands
            </span>
            <span className="text-[9px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/20 rounded-full px-2 py-0.5 leading-none">
              Updated today
            </span>
          </div>
          <div className="text-white font-semibold text-[14px] sm:text-[15px] leading-tight">
            Start working next week
          </div>
        </div>

        {/* CTA / chevron */}
        <span className="flex-shrink-0 text-[13px] font-bold text-amber-300 group-hover:text-amber-200 flex items-center gap-1 whitespace-nowrap transition-colors">
          {open ? "Close" : "View jobs"}
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : "group-hover:translate-x-0.5"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            )}
          </svg>
        </span>
      </button>

      {/* ── Expanded panel ─────────────────────────────────────── */}
      <div
        id="hot-jobs-panel"
        role="region"
        aria-label="Open positions"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 flex flex-col gap-2">

          {HOT_JOBS.map((job) => (
            <a
              key={job.id}
              href={job.href}
              target={job.external ? "_blank" : undefined}
              rel={job.external ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/5 hover:bg-white/10 active:scale-[0.98] px-4 py-3 transition-all duration-150"
            >
              {/* Job info */}
              <div className="min-w-0 flex-1">
                <div className="text-white font-semibold text-[14px] leading-tight truncate">
                  {job.title}
                </div>
                <div className="text-gray-400 text-[12px] mt-0.5 truncate">
                  📍 {job.location}
                </div>
                <div className="text-gray-500 text-[11px] mt-0.5 leading-snug">
                  {job.benefit}
                </div>
              </div>

              {/* Apply CTA */}
              <span className="flex-shrink-0 text-[12px] font-bold text-emerald-400 group-hover:text-emerald-300 border border-emerald-400/30 group-hover:border-emerald-400/60 rounded-lg px-3 py-1.5 flex items-center gap-1 transition-all whitespace-nowrap">
                Apply
                <svg className="w-3 h-3 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
          ))}

        </div>
      </div>

    </div>
  );
}
