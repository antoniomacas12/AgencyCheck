// /apply — All open positions landing page
// Dark theme, green accents. Lists all active job postings.

import Link from "next/link";
import type { Metadata } from "next";
import { ALL_JOBS } from "@/components/RelatedJobs";

export const metadata: Metadata = {
  title: "Now Hiring in the Netherlands — Open Positions | AgencyCheck",
  description:
    "Active job openings in the Netherlands — truck drivers, production workers, warehouse staff. Apply directly via WhatsApp. No agency fees, fast process.",
  alternates: { canonical: "https://agencycheck.io/apply" },
};

// Extra detail per job for the listing cards
const JOB_DETAILS: Record<string, { pay: string; type: string; emoji: string }> = {
  "reachtruck":                  { pay: "€150+/day", type: "Direct contract",         emoji: "🚛" },
  "food-production":             { pay: "Min. wage+", type: "Via agency partner",      emoji: "🏭" },
  "production-worker-maastricht":{ pay: "€16.12/hr",  type: "Immediate start",         emoji: "🍪" },
  "warehouse":                   { pay: "Min. wage+", type: "Housing available",        emoji: "📦" },
};

const WA_BASE = "https://wa.me/31649210631";

export default function ApplyIndexPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        {/* ── Badge ──────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          {ALL_JOBS.length} positions open now · Netherlands
        </div>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3 text-white">
          Now Hiring<br />
          <span className="text-[#22C55E]">in the Netherlands</span>
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-lg">
          Real jobs, fast process. Apply directly via WhatsApp — no long forms,
          no agency middlemen eating your pay. We reply within 24h.
        </p>

        {/* ── Divider ────────────────────────────────────────────── */}
        <div className="border-t border-white/10 mb-8" />

        {/* ── Job cards ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {ALL_JOBS.map((job) => {
            const extra = JOB_DETAILS[job.id];
            const isExternal = job.external;

            const card = (
              <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-[#22C55E]/30 active:scale-[0.99] transition-all duration-150 px-5 py-5">

                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{extra?.emoji ?? "💼"}</span>
                    <div>
                      <p className="text-white font-bold text-[15px] leading-snug">
                        {job.title}
                      </p>
                      <p className="text-gray-500 text-[12px] mt-0.5">
                        📍 {job.location}
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold border rounded-full px-2.5 py-1 ${job.tagColor} bg-transparent`}>
                    {job.tag}
                  </span>
                </div>

                {/* Info row */}
                <div className="flex items-center gap-4 text-[12px] text-gray-400 mb-4">
                  {extra?.pay && (
                    <span className="text-[#22C55E] font-bold">{extra.pay}</span>
                  )}
                  {extra?.type && (
                    <span className="text-gray-500">{extra.type}</span>
                  )}
                  <span className="ml-auto text-gray-600">
                    {job.applicants} applied this week
                  </span>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12px] text-gray-500">
                    Apply directly · No fees
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#22C55E] group-hover:text-green-400 transition-colors">
                    View &amp; Apply
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            );

            return isExternal ? (
              <a key={job.id} href={job.href} target="_blank" rel="noopener noreferrer">
                {card}
              </a>
            ) : (
              <Link key={job.id} href={job.href}>
                {card}
              </Link>
            );
          })}
        </div>

        {/* ── Not sure which job? ─────────────────────────────────── */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5">
          <p className="text-white font-bold text-[14px] mb-1">Not sure which position fits?</p>
          <p className="text-gray-500 text-[13px] mb-4">
            Message us and we&apos;ll match you to the right opening based on your experience.
          </p>
          <a
            href={`${WA_BASE}?text=${encodeURIComponent("Hi, I'm looking for work in the Netherlands. Can you help me find the right position?")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#22C55E]/15 hover:bg-[#22C55E]/25 border border-[#22C55E]/30 text-[#22C55E] font-bold text-[13px] px-4 py-2.5 rounded-xl transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.418A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.07-1.116l-.292-.174-3.036.868.872-3.046-.19-.31A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.29-5.89c-.233-.117-1.379-.681-1.593-.759-.214-.077-.37-.116-.526.117-.155.232-.603.759-.739.915-.136.155-.272.174-.505.058-.233-.117-.982-.362-1.87-1.154-.691-.617-1.158-1.38-1.294-1.613-.136-.232-.014-.358.103-.474.105-.104.233-.272.35-.408.116-.136.155-.233.233-.388.077-.155.039-.291-.019-.407-.059-.117-.527-1.27-.722-1.739-.19-.456-.384-.394-.527-.401l-.448-.008c-.156 0-.408.059-.621.291-.214.233-.814.796-.814 1.94s.834 2.25.95 2.406c.116.155 1.64 2.504 3.975 3.512.556.24 1.99.52 2.315.336.233-.136.942-.385 1.074-.756.131-.37.131-.686.092-.756-.039-.077-.155-.116-.388-.233z" />
            </svg>
            Chat with us on WhatsApp
          </a>
        </div>

        {/* ── Trust strip ────────────────────────────────────────── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-600 text-[11px]">
          <span>✓ Free to apply</span>
          <span>✓ No hidden fees</span>
          <span>✓ Reply within 24h</span>
          <span>✓ EU work contracts</span>
        </div>

      </div>
    </div>
  );
}
