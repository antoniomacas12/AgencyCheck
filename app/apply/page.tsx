// /apply — All open positions landing page
// Dark theme, green accents. Lists all active job postings.

import Link from "next/link";
import type { Metadata } from "next";
import { ALL_JOBS } from "@/components/RelatedJobs";
import { WA_NUMBER } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Now Hiring in the Netherlands — Open Positions | AgencyCheck",
  description:
    "Active job openings in the Netherlands — truck drivers, production workers, warehouse staff. Apply directly via WhatsApp. No agency fees, fast process.",
  alternates: {
    canonical: "https://agencycheck.io/apply",
    languages: {
      "en":        "https://agencycheck.io/apply",
      "pl":        "https://agencycheck.io/pl/oferty-pracy",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca",
      "x-default": "https://agencycheck.io/apply",
    },
  },
};

// Extra detail per job for the listing cards
const JOB_DETAILS: Record<string, { pay: string; type: string; emoji: string }> = {
  "reachtruck":                  { pay: "€150+/day", type: "Direct contract",         emoji: "🚛" },
  "food-production":             { pay: "Min. wage+", type: "Via agency partner",      emoji: "🏭" },
  "production-worker-maastricht":{ pay: "€16.12/hr",  type: "Immediate start",         emoji: "🍪" },
  "warehouse":                   { pay: "Min. wage+", type: "Housing available",        emoji: "📦" },
};

const WA_BASE = `https://wa.me/${WA_NUMBER}`;

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
          <p className="text-gray-500 text-[13px]">
            Pick any position above and tap <strong className="text-gray-300">Apply via WhatsApp</strong> — answer 2 quick eligibility questions and we&apos;ll help match you to the right opening.
          </p>
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
