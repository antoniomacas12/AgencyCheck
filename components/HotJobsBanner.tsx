"use client";

import { useState } from "react";
import Link from "next/link";
import ApplyPreScreen from "@/components/ApplyPreScreen";

const WA_BASE = "https://wa.me/31613754893";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface LinkJob {
  id: number;
  type: "link";
  title: string;
  location: string;
  tag: string;
  tagColor: string;
  applicants: number;
  href: string;
  external?: boolean;
}

interface WaJob {
  id: number;
  type: "wa";
  title: string;
  location: string;
  tag: string;
  tagColor: string;
  applicants: number;
  source: string;
  jobId: string;
}

type HotJob = LinkJob | WaJob;

// ─── Job data ──────────────────────────────────────────────────────────────────
// type:"link"  →  navigates to a dedicated apply page
// type:"wa"    →  opens the EU/BSN gate, then WhatsApp
const HOT_JOBS: HotJob[] = [
  // ── Existing dedicated-page jobs ──
  {
    id: 1, type: "link",
    title: "C+E Truck Driver",
    location: "Dordrecht, NL",
    tag: "Direct contract",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    href: "/apply/reachtruck",
    applicants: 18,
  },
  {
    id: 2, type: "link",
    title: "Food Production Operator",
    location: "Netherlands",
    tag: "Fast placement",
    tagColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    href: "/apply/food-production",
    applicants: 34,
  },
  {
    id: 3, type: "link",
    title: "Production Worker / Picker",
    location: "Near Maastricht, NL",
    tag: "€16.12/hr",
    tagColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    href: "/apply/production-worker-maastricht",
    applicants: 27,
  },
  {
    id: 4, type: "link",
    title: "Warehouse Worker",
    location: "Netherlands",
    tag: "Housing available",
    tagColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    href: "/apply/warehouse",
    applicants: 41,
  },
  // ── New WA-gate jobs from current openings ──
  {
    id: 5, type: "wa",
    title: "CE Truck Driver (Hook arm)",
    location: "Eindhoven, NL",
    tag: "€1000–€1200/wk",
    tagColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    source: "hot-jobs-truck-hook",
    jobId: "ce-truck-hook",
    applicants: 12,
  },
  {
    id: 6, type: "wa",
    title: "Electrician",
    location: "Bodegraven, NL",
    tag: "€550–€650/wk",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    source: "hot-jobs-electrician",
    jobId: "electrician",
    applicants: 9,
  },
  {
    id: 7, type: "wa",
    title: "MIG/MAG Welder (Black Steel)",
    location: "Obdam, NL",
    tag: "€640–€960/wk",
    tagColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    source: "hot-jobs-welder",
    jobId: "migmag-welder",
    applicants: 7,
  },
  {
    id: 8, type: "wa",
    title: "Bus Driver – Free Accommodation",
    location: "Netherlands",
    tag: "Accom. included",
    tagColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    source: "hot-jobs-bus-driver",
    jobId: "bus-driver",
    applicants: 15,
  },
];

// ─── Shared inner card ─────────────────────────────────────────────────────────
function JobCardInner({ job }: { job: HotJob }) {
  return (
    <div className="
      group flex items-center gap-3 rounded-2xl
      border border-white/[0.08] bg-white/[0.04]
      hover:bg-white/[0.07] active:scale-[0.98]
      px-4 py-4 transition-all duration-150
    ">
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-[15px] leading-tight truncate">
          {job.title}
        </p>
        <p className="text-gray-400 text-[12px] mt-0.5">
          📍 {job.location}
        </p>
        <p className="text-gray-600 text-[11px] mt-1">
          <span className="text-gray-400 font-semibold">{job.applicants}</span> applied this week
        </p>
      </div>
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
}

// ─── Main component ────────────────────────────────────────────────────────────
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
          ${open ? "max-h-[1600px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="pt-2 flex flex-col gap-2">

          {HOT_JOBS.map((job) => {
            if (job.type === "wa") {
              return (
                <ApplyPreScreen
                  key={job.id}
                  waBase={WA_BASE}
                  jobTitle={job.title}
                  source={job.source}
                  jobId={job.jobId}
                  referralMode
                >
                  {(openFn) => (
                    <button onClick={openFn} className="w-full text-left">
                      <JobCardInner job={job} />
                    </button>
                  )}
                </ApplyPreScreen>
              );
            }

            const inner = <JobCardInner job={job} />;

            return job.external ? (
              <a key={job.id} href={job.href} target="_blank" rel="noopener noreferrer">
                {inner}
              </a>
            ) : (
              <Link key={job.id} href={job.href}>
                {inner}
              </Link>
            );
          })}

          {/* Footer: hint + view all link */}
          <div className="flex items-center justify-between pt-1 pb-0.5 px-1">
            <p className="text-gray-600 text-[11px]">
              Tap any position to apply
            </p>
            <Link
              href="/vacancies"
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              All 65 vacancies
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
