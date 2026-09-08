"use client";

/**
 * ETCostsTipCard
 *
 * Educational "GOOD TO KNOW" card about ET (extraterritorial) costs
 * for international workers in the Netherlands.
 *
 * Props:
 *   moreJobsOpen — when true the card fades out and becomes non-interactive
 *                  (controlled by the parent section so it never bleeds
 *                   through an expanded More Jobs panel).
 */

import { useState } from "react";

interface Props {
  /** Pass true when any overlapping panel (e.g. More Jobs) is open */
  moreJobsOpen?: boolean;
}

export default function ETCostsTipCard({ moreJobsOpen = false }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Visible = card is shown; hidden = faded out, non-interactive
  const visible = !moreJobsOpen;

  return (
    <div
      className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] overflow-hidden"
      style={{
        opacity:        visible ? 1 : 0,
        pointerEvents:  visible ? "auto" : "none",
        visibility:     visible ? "visible" : "hidden",
        // Respect prefers-reduced-motion
        transition: "opacity 250ms ease, visibility 250ms ease",
      }}
      aria-hidden={!visible}
    >
      <div className="px-5 py-5">

        {/* ── "GOOD TO KNOW" label ─────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/[0.12] border border-blue-500/25 rounded-full px-2.5 py-1">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M12 8h.01M12 12v4" />
            </svg>
            Good to know
          </span>
        </div>

        {/* ── Headline ─────────────────────────────────────────────── */}
        <h3 className="text-white font-extrabold text-[15px] leading-snug mb-2">
          ET Costs: You May Take Home More
        </h3>

        {/* ── Subtitle — crawlable for SEO ─────────────────────────── */}
        <p className="text-gray-400 text-[12px] leading-relaxed mb-4">
          Some international workers in the Netherlands can receive part of
          their compensation tax-free for eligible{" "}
          <span className="text-gray-300 font-semibold">extraterritorial costs</span>{" "}
          (ET costs). This can mean a higher net amount even when gross wages
          look similar.
        </p>

        {/* ── Example figure ───────────────────────────────────────── */}
        <div className="rounded-xl border border-blue-400/20 bg-blue-400/[0.08] px-4 py-3.5 mb-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 mb-1">
            Illustrative example
          </p>
          <p className="text-white font-black text-2xl leading-none mb-1">
            +€150
            <span className="text-[13px] font-bold text-gray-400 ml-1">/week net</span>
          </p>
          <p className="text-[11px] text-gray-500 leading-snug">
            Example only — not guaranteed. Actual ET reimbursement depends on
            your employer, contract and individual eligibility.
          </p>
        </div>

        {/* ── Expand toggle ─────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="et-costs-detail"
          className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold text-[12px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
        >
          <svg
            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          {expanded ? "Show less" : "Learn how ET costs work"}
        </button>

        {/* ── Expandable detail ─────────────────────────────────────── */}
        {expanded && (
          <div
            id="et-costs-detail"
            className="mt-4 space-y-3 border-t border-white/[0.07] pt-4"
          >
            <div className="space-y-2 text-[12px] text-gray-400 leading-relaxed">
              <p>
                <span className="text-white font-bold">"ET costs"</span> means{" "}
                <span className="text-gray-300">extraterritorial costs</span> —
                certain additional expenses related to working temporarily
                outside your home country.
              </p>
              <p>
                Under Dutch payroll rules, qualifying costs can in some
                situations be reimbursed tax-free by the employer. Examples can
                include certain relocation, temporary accommodation, travel or
                administrative costs — depending on the specific situation and
                applicable payroll rules.
              </p>
              <p>
                The exact arrangement differs between employers and recruitment
                agencies. AgencyCheck does not determine the ET reimbursement.
              </p>
              <p className="font-semibold text-gray-300">
                Always confirm the exact ET arrangement with your recruiter or
                employer before accepting a job.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
              <p className="text-[10px] text-gray-500 leading-snug">
                ℹ️ Information is general only. Exact ET reimbursement depends
                on the employer, payroll arrangement and individual eligibility.
                AgencyCheck is not a tax adviser.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
