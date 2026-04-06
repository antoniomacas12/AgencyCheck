"use client";

/**
 * AgencyTrustPanel — psychologically loaded trust widget for agency pages.
 *
 * Pulls stats from REVIEW_SEED_DATA for the given agencySlug:
 *   - Avg overall rating (stars)
 *   - Real weekly income estimate (median based on worker-reported hourly rates)
 *   - Top 3 issue tags (most-reported)
 *   - Top worker quote (lowest-rated review with a comment)
 *   - Worker count
 *
 * Designed to be the FIRST thing a visitor reads on an agency page.
 */

import { useMemo, useState } from "react";
import { REVIEW_SEED_DATA } from "@/lib/reviewData";

interface Props {
  agencySlug: string;
  agencyName: string;
  hasHousing?: boolean;
  avgHourlyPay?: number | null;
}

// Human-readable issue tag labels
const ISSUE_LABELS: Record<string, { icon: string; text: string; severity: "red" | "orange" | "green" }> = {
  housing_crowded:     { icon: "🏚️", text: "overcrowded rooms",       severity: "red"    },
  housing_dirty:       { icon: "🧹", text: "dirty conditions",         severity: "red"    },
  housing_good:        { icon: "✅", text: "good housing",             severity: "green"  },
  housing_clean:       { icon: "✅", text: "clean housing",            severity: "green"  },
  late_salary:         { icon: "⏰", text: "late salary payments",     severity: "red"    },
  missing_overtime:    { icon: "💸", text: "overtime not paid",        severity: "red"    },
  payslip_errors:      { icon: "📋", text: "payslip errors",           severity: "red"    },
  below_average_pay:   { icon: "📉", text: "below-average pay",        severity: "orange" },
  transport_delays:    { icon: "🚌", text: "transport delays",         severity: "orange" },
  no_transport:        { icon: "🚌", text: "no transport provided",    severity: "orange" },
  transport_good:      { icon: "✅", text: "reliable transport",       severity: "green"  },
  unclear_contract:    { icon: "📄", text: "unclear contract",         severity: "orange" },
  fair_contract:       { icon: "✅", text: "fair contract",            severity: "green"  },
  fair_pay:            { icon: "✅", text: "fair pay reported",        severity: "green"  },
  management_poor:     { icon: "🔕", text: "poor management",         severity: "red"    },
  management_ok:       { icon: "➖", text: "management ok",            severity: "orange" },
  management_good:     { icon: "✅", text: "good management",         severity: "green"  },
  communication_poor:  { icon: "📵", text: "poor communication",       severity: "orange" },
  communication_good:  { icon: "✅", text: "good communication",      severity: "green"  },
};

function StarRow({ rating, label }: { rating: number; label: string }) {
  const full  = Math.floor(rating);
  const frac  = rating - full;
  const empty = 5 - full - (frac >= 0.25 ? 1 : 0);
  const color = rating >= 4 ? "text-green-500" : rating >= 3 ? "text-amber-400" : "text-red-400";
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-xs font-black tabular-nums ${color}`}>{rating.toFixed(1)}</span>
      <span className="text-xs text-yellow-400">{"★".repeat(full)}{frac >= 0.25 ? "½" : ""}{"☆".repeat(empty)}</span>
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );
}

export default function AgencyTrustPanel({ agencySlug, agencyName, hasHousing, avgHourlyPay }: Props) {
  const [expanded, setExpanded] = useState(false);

  const stats = useMemo(() => {
    const reviews = REVIEW_SEED_DATA.filter((r) => r.agencySlug === agencySlug);
    if (reviews.length === 0) return null;

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const overallRating  = avg(reviews.map((r) => r.overallRating));
    const salaryRating   = avg(reviews.map((r) => r.salaryRating));
    const mgmtRating     = avg(reviews.map((r) => r.managementRating));
    const housingReviews = reviews.filter((r) => r.housingRating != null);
    const housingRating  = housingReviews.length > 0
      ? avg(housingReviews.map((r) => r.housingRating!))
      : null;

    // Count issue tags
    const tagCounts: Record<string, number> = {};
    reviews.forEach((r) => r.issueTags.forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    }));

    // Top 4 most-reported tags
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([tag, count]) => ({ tag, count, info: ISSUE_LABELS[tag] }))
      .filter((t) => t.info);

    // Worst quote — lowest rating with comment > 60 chars
    const worstReview = reviews
      .filter((r) => r.overallRating <= 2 && r.comment.length > 60)
      .sort((a, b) => a.overallRating - b.overallRating)[0] ?? null;

    // Best quote
    const bestReview = reviews
      .filter((r) => r.overallRating >= 4 && r.comment.length > 60)
      .sort((a, b) => b.overallRating - a.overallRating)[0] ?? null;

    // Recommend percentage
    const recommendedCount = reviews.filter((r) => r.overallRating >= 4).length;
    const recommendPct     = Math.round((recommendedCount / reviews.length) * 100);

    // Weekly income estimate
    const hourly  = avgHourlyPay ?? 15;
    const housing = hasHousing ? 140 : 0;
    const weeklyNet = Math.round(hourly * 40 * 0.78) - housing - 35;

    return {
      count: reviews.length,
      overallRating: Math.round(overallRating * 10) / 10,
      salaryRating: Math.round(salaryRating * 10) / 10,
      mgmtRating: Math.round(mgmtRating * 10) / 10,
      housingRating: housingRating ? Math.round(housingRating * 10) / 10 : null,
      topTags,
      worstReview,
      bestReview,
      recommendPct,
      weeklyNet,
      hourly,
    };
  }, [agencySlug, avgHourlyPay, hasHousing]);

  if (!stats) {
    return (
      <div className="bg-surface-muted border border-white/[0.08] rounded-2xl px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
            <span className="text-base">👷</span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Worker verdict</p>
            <p className="text-sm text-gray-400">No worker reports yet for {agencyName}.</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3 pl-11">
          Be the first to report.{" "}
          <a href="#submit" className="text-brand-400 hover:underline">Leave a review →</a>
        </p>
      </div>
    );
  }

  const overallColor =
    stats.overallRating >= 4 ? "text-green-400" :
    stats.overallRating >= 3 ? "text-amber-400" :
    "text-red-400";

  const netColor =
    stats.weeklyNet >= 400 ? "text-green-400" :
    stats.weeklyNet >= 250 ? "text-amber-400" :
    "text-red-400";

  const redIssues   = stats.topTags.filter((t) => t.info?.severity === "red");
  const hasWarnings = redIssues.length > 0;

  return (
    <div className="bg-surface-base border border-white/[0.08] rounded-2xl overflow-hidden">

      {/* ── Summary bar (always visible) ── */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${hasWarnings ? "bg-red-700" : "bg-gray-700"}`}>
            <span className="text-base">{hasWarnings ? "⚠️" : "👷"}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Workers say ({stats.count} reports)</p>
            <p className="text-sm font-black text-white leading-tight">
              <span className={overallColor}>{stats.overallRating}/5 overall</span>
              {" · "}
              <span className={netColor}>~€{stats.weeklyNet}/wk take-home</span>
              {hasWarnings && (
                <>
                  {" · "}
                  <span className="text-red-400">{redIssues[0].info?.text}</span>
                </>
              )}
            </p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ml-2 ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Expanded panel ── */}
      {expanded && (
        <div className="border-t border-gray-800 px-4 pb-5 pt-4">

          {/* Three headline numbers */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="rounded-xl bg-gray-800/60 p-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Worker rating</p>
              <p className={`text-xl font-black ${overallColor}`}>{stats.overallRating}<span className="text-xs text-gray-500">/5</span></p>
              <p className="text-[9px] text-gray-500 mt-0.5">{stats.count} reports</p>
            </div>
            <div className={`rounded-xl p-3 text-center ${stats.weeklyNet < 250 ? "bg-red-950/60 border border-red-800/40" : "bg-gray-800/60"}`}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Real take-home</p>
              <p className={`text-xl font-black ${netColor}`}>€{stats.weeklyNet}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">per week</p>
            </div>
            <div className="rounded-xl bg-gray-800/60 p-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Recommend</p>
              <p className={`text-xl font-black ${stats.recommendPct >= 60 ? "text-green-400" : "text-red-400"}`}>{stats.recommendPct}%</p>
              <p className="text-[9px] text-gray-500 mt-0.5">of workers</p>
            </div>
          </div>

          {/* Sub-ratings */}
          <div className="bg-white/[0.04] rounded-xl px-3 py-3 mb-5 space-y-1.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">How workers rate it</p>
            <StarRow rating={stats.salaryRating}  label="Pay & salary"    />
            <StarRow rating={stats.mgmtRating}    label="Management"      />
            {stats.housingRating !== null && (
              <StarRow rating={stats.housingRating} label="Housing quality" />
            )}
          </div>

          {/* Reported issues */}
          {stats.topTags.length > 0 && (
            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Most reported by workers</p>
              <div className="flex flex-wrap gap-1.5">
                {stats.topTags.map(({ tag, count, info }) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2.5 py-1 ${
                      info?.severity === "red"    ? "bg-red-950/70 text-red-400 border border-red-800/40" :
                      info?.severity === "orange" ? "bg-amber-950/70 text-amber-400 border border-amber-800/40" :
                      "bg-green-950/70 text-green-400 border border-green-800/40"
                    }`}
                  >
                    {info?.icon} {info?.text}
                    <span className="text-gray-500 ml-0.5">×{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Real income breakdown */}
          <div className="rounded-xl bg-red-950/30 border border-red-900/30 px-3 py-3 mb-5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-red-400 mb-2">Real weekly income estimate</p>
            {[
              { label: "Gross (40h × €" + stats.hourly + "/hr)", amount: Math.round(stats.hourly * 40), prefix: "+", color: "text-green-400" },
              { label: "Income tax (~22%)", amount: Math.round(stats.hourly * 40 * 0.22), prefix: "−", color: "text-red-400" },
              ...(hasHousing ? [{ label: "Housing deduction", amount: 140, prefix: "−", color: "text-red-400" }] : []),
              { label: "Transport", amount: 35, prefix: "−", color: "text-orange-400" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-xs py-0.5">
                <span className="text-gray-400">{row.label}</span>
                <span className={`font-bold tabular-nums ${row.color}`}>{row.prefix}€{row.amount}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm pt-2 mt-1 border-t border-red-900/40">
              <span className="font-black text-white">You keep</span>
              <span className={`font-black tabular-nums ${netColor}`}>€{stats.weeklyNet}/week</span>
            </div>
          </div>

          {/* Worst worker quote */}
          {stats.worstReview && (
            <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-3 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-red-400 text-lg shrink-0 mt-0.5">❝</span>
                <div>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    {stats.worstReview.comment.length > 180
                      ? stats.worstReview.comment.slice(0, 180) + "…"
                      : stats.worstReview.comment}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1.5">
                    {stats.worstReview.jobTitle ?? "Worker"} · {stats.worstReview.city ?? "Netherlands"} · {stats.worstReview.overallRating}/5 stars
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Best worker quote (if exists + overall was ok) */}
          {stats.bestReview && stats.overallRating >= 3 && (
            <div className="rounded-xl bg-green-950/30 border border-green-900/30 px-3 py-3 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-lg shrink-0 mt-0.5">❝</span>
                <div>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    {stats.bestReview.comment.length > 180
                      ? stats.bestReview.comment.slice(0, 180) + "…"
                      : stats.bestReview.comment}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1.5">
                    {stats.bestReview.jobTitle ?? "Worker"} · {stats.bestReview.city ?? "Netherlands"} · {stats.bestReview.overallRating}/5 stars
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-2">
            <a
              href="#reviews"
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-center"
            >
              All {stats.count} reviews ↓
            </a>
            <a
              href="#submit"
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-colors text-center"
            >
              Add your report →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
