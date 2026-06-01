"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Abandonment {
  sessionId: string;
  lastStep:  string;
  jobId:     string | null;
  source:    string | null;
  ts:        string;
}

interface DailyRow {
  day: string;
  cnt: number;
}

interface TopJob {
  jobId: string | null;
  cnt:   number;
}

interface FunnelData {
  funnel:       Record<string, number>;
  daily:        DailyRow[];
  abandonments: Abandonment[];
  topJobs:      TopJob[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day:    "2-digit",
    month:  "short",
    hour:   "2-digit",
    minute: "2-digit",
  });
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function pct(num: number, denom: number): string {
  if (!denom) return "—";
  return `${Math.round((num / denom) * 100)}%`;
}

function pctNum(num: number, denom: number): number {
  if (!denom) return 0;
  return Math.round((num / denom) * 100);
}

// Make job slug human-readable
function jobLabel(slug: string | null): string {
  if (!slug) return "Unknown job";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Step badge config
const STEP_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  gate:            { label: "EU check",       color: "bg-blue-500/20 text-blue-300 border-blue-500/30",    dot: "bg-blue-400" },
  details_a:       { label: "Step 2 — BSN",   color: "bg-amber-500/20 text-amber-300 border-amber-500/30", dot: "bg-amber-400" },
  details_b:       { label: "Step 3 — Contact", color: "bg-orange-500/20 text-orange-300 border-orange-500/30", dot: "bg-orange-400" },
  geo_blocked:     { label: "GEO blocked",    color: "bg-red-500/20 text-red-300 border-red-500/30",       dot: "bg-red-400" },
  already_applied: { label: "Already applied", color: "bg-red-500/20 text-red-300 border-red-500/30",      dot: "bg-red-400" },
  complete:        { label: "Completed",       color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" },
};

function StepBadge({ step }: { step: string }) {
  const cfg = STEP_CONFIG[step] ?? { label: step, color: "bg-gray-700 text-gray-400 border-gray-600", dot: "bg-gray-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color = "text-white" }: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-5 py-4">
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FunnelAdminPage() {
  const [data,    setData]    = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [stepFilter, setStepFilter] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/funnel");
      if (!res.ok) throw new Error("API error");
      setData(await res.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const opens      = data?.funnel["open"]              ?? 0;
  const gatePassed = data?.funnel["gate_passed"]        ?? 0;
  const aaPassed   = data?.funnel["details_a_passed"]   ?? 0;
  const completed  = data?.funnel["completed"]          ?? 0;
  const abandoned  = data?.funnel["abandoned"]          ?? 0;
  const disq       = data?.funnel["disqualified"]       ?? 0;

  const funnelSteps = [
    { label: "Opened apply modal",     count: opens,      prev: null,       color: "bg-blue-500",    textColor: "text-blue-400" },
    { label: "Passed EU check",        count: gatePassed, prev: opens,      color: "bg-indigo-500",  textColor: "text-indigo-400" },
    { label: "Passed step 2 (BSN)",    count: aaPassed,   prev: gatePassed, color: "bg-violet-500",  textColor: "text-violet-400" },
    { label: "Completed → WhatsApp",   count: completed,  prev: aaPassed,   color: "bg-emerald-500", textColor: "text-emerald-400" },
  ];

  const maxCount = Math.max(...funnelSteps.map((s) => s.count), 1);

  // Biggest drop
  const drops = funnelSteps.slice(1).map((s, i) => ({
    label: s.label,
    dropped: (funnelSteps[i].count - s.count),
    pct: pctNum(funnelSteps[i].count - s.count, funnelSteps[i].count),
  })).filter(d => d.dropped > 0);
  const biggestDrop = drops.sort((a, b) => b.pct - a.pct)[0];

  // Filtered abandonments
  const filteredAbandons = (data?.abandonments ?? []).filter(
    (a) => stepFilter === "all" || a.lastStep === stepFilter,
  );

  // Unique steps in abandonment data
  const abandonSteps = [...new Set((data?.abandonments ?? []).map((a) => a.lastStep))];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-7">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Apply Funnel</h1>
          <p className="text-sm text-gray-400 mt-0.5">Last 30 days · Where do candidates drop off?</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition disabled:opacity-50"
        >
          {loading ? "Loading…" : "↺ Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-900/30 border border-red-700/40 px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* ── Key metrics ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Opened"       value={opens}     color="text-blue-400"    sub="started apply flow" />
        <StatCard label="Completed"    value={completed}  color="text-emerald-400" sub={`${pct(completed, opens)} conversion`} />
        <StatCard label="Abandoned"    value={abandoned}  color="text-amber-400"   sub={`${pct(abandoned, opens)} of opens`} />
        <StatCard label="Disqualified" value={disq}       color="text-red-400"     sub="geo / already applied" />
      </div>

      {/* ── Insight alert ───────────────────────────────────────────────────── */}
      {biggestDrop && biggestDrop.pct > 20 && (
        <div className="rounded-xl bg-red-900/20 border border-red-700/30 px-5 py-4 flex items-start gap-3">
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <p className="text-sm font-bold text-red-300">Biggest drop-off: {biggestDrop.label}</p>
            <p className="text-xs text-red-400/80 mt-0.5">
              {biggestDrop.dropped} people ({biggestDrop.pct}%) stop here. This is where the form loses the most candidates.
            </p>
          </div>
        </div>
      )}

      {/* ── Funnel visualisation ─────────────────────────────────────────────── */}
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-6 py-6">
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-6">
          Step-by-step funnel
        </p>
        <div className="space-y-5">
          {funnelSteps.map((s, i) => {
            const barPct = (s.count / maxCount) * 100;
            const dropCount = s.prev !== null ? s.prev - s.count : 0;
            const dropPct   = s.prev !== null ? pctNum(s.count, s.prev) : 100;
            return (
              <div key={s.label}>
                {/* Step label row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-[11px] font-black text-gray-400 flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-200">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {s.prev !== null && (
                      <span className={`text-xs font-bold ${dropPct >= 70 ? "text-emerald-400" : dropPct >= 50 ? "text-amber-400" : "text-red-400"}`}>
                        {dropPct}% retained
                      </span>
                    )}
                    <span className={`text-2xl font-black ${s.textColor} w-16 text-right`}>{s.count}</span>
                  </div>
                </div>
                {/* Bar */}
                <div className="h-6 rounded-lg bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-lg transition-all duration-700 ${s.color}`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
                {/* Drop-off connector */}
                {i < funnelSteps.length - 1 && dropCount > 0 && (
                  <div className="flex items-center gap-2 mt-2 ml-7">
                    <span className="text-red-500 text-xs">↓</span>
                    <span className="text-xs text-red-400 font-medium">
                      {dropCount} dropped here
                    </span>
                    <span className="text-xs text-gray-600">
                      ({pct(dropCount, s.count)} didn&apos;t reach next step)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Conversion summary */}
        <div className="mt-6 pt-5 border-t border-white/[0.07] flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest">Overall conversion</p>
            <p className="text-2xl font-black text-white mt-0.5">{pct(completed, opens)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest">Opens → EU check</p>
            <p className="text-2xl font-black text-indigo-300 mt-0.5">{pct(gatePassed, opens)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest">EU check → Step 2</p>
            <p className="text-2xl font-black text-violet-300 mt-0.5">{pct(aaPassed, gatePassed)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-widest">Step 2 → Complete</p>
            <p className="text-2xl font-black text-emerald-300 mt-0.5">{pct(completed, aaPassed)}</p>
          </div>
        </div>
      </div>

      {/* ── Daily chart + Top jobs ────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-5">

        {/* Daily opens */}
        {data?.daily && data.daily.length > 0 && (
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-5 py-5">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-5">
              Daily opens — last 14 days
            </p>
            {(() => {
              const maxDay = Math.max(...data.daily.map((d) => d.cnt), 1);
              return (
                <div className="flex items-end gap-2 h-36">
                  {data.daily.map((d) => {
                    const barH = Math.max((d.cnt / maxDay) * 112, 4);
                    const dateLabel = d.day.slice(5).replace("-", "/");
                    return (
                      <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1 min-w-0 group">
                        <span className="text-[10px] text-gray-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          {d.cnt}
                        </span>
                        <div
                          className="w-full rounded-t-md bg-blue-500/60 hover:bg-blue-400/80 transition-colors cursor-default"
                          style={{ height: `${barH}px` }}
                          title={`${d.cnt} opens on ${d.day}`}
                        />
                        <span className="text-[10px] text-gray-600 truncate w-full text-center">
                          {dateLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-gray-600">14-day total</span>
              <span className="text-sm font-black text-blue-400">
                {data.daily.reduce((s, d) => s + d.cnt, 0)}
              </span>
            </div>
          </div>
        )}

        {/* Top jobs */}
        {data?.topJobs && data.topJobs.length > 0 && (
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-5 py-5">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-5">
              Top jobs by opens
            </p>
            <div className="space-y-3">
              {(() => {
                const maxJob = Math.max(...data.topJobs.map((j) => j.cnt), 1);
                return data.topJobs.slice(0, 8).map((j, idx) => (
                  <div key={j.jobId ?? idx}>
                    <div className="flex items-center justify-between mb-1">
                      <a
                        href={j.jobId ? `/apply/${j.jobId}` : "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-300 hover:text-white hover:underline truncate max-w-[75%]"
                        title={j.jobId ?? "unknown"}
                      >
                        {jobLabel(j.jobId)}
                      </a>
                      <span className="text-xs font-black text-white shrink-0 ml-2">{j.cnt}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500/70"
                        style={{ width: `${(j.cnt / maxJob) * 100}%` }}
                      />
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>

      {/* ── Abandonments table ─────────────────────────────────────────────────── */}
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] overflow-hidden">
        {/* Table header */}
        <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
              Recent abandonments
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {filteredAbandons.length} {stepFilter !== "all" ? `at "${STEP_CONFIG[stepFilter]?.label ?? stepFilter}"` : "total"} · last 30 days
            </p>
          </div>
          {/* Step filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setStepFilter("all")}
              className={`text-[11px] font-bold px-3 py-1 rounded-full border transition ${
                stepFilter === "all"
                  ? "bg-white/10 border-white/20 text-white"
                  : "border-white/[0.07] text-gray-500 hover:text-gray-300"
              }`}
            >
              All
            </button>
            {abandonSteps.map((s) => {
              const cfg = STEP_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => setStepFilter(s)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border transition ${
                    stepFilter === s
                      ? `${cfg?.color ?? "bg-white/10 border-white/20 text-white"}`
                      : "border-white/[0.07] text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {cfg?.label ?? s}
                </button>
              );
            })}
          </div>
        </div>

        {!data || filteredAbandons.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-600 text-sm">
            {loading ? "Loading…" : "No abandonments for this filter"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-28">When</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Stopped at</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Job</th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-24">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredAbandons.map((a) => (
                  <tr key={a.sessionId + a.ts} className="hover:bg-white/[0.025] transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-400" title={fmt(a.ts)}>
                        {relTime(a.ts)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <StepBadge step={a.lastStep} />
                    </td>
                    <td className="px-5 py-3 max-w-[220px]">
                      {a.jobId ? (
                        <a
                          href={`/apply/${a.jobId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-gray-300 hover:text-white hover:underline"
                          title={a.jobId}
                        >
                          {jobLabel(a.jobId)}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-500 truncate block max-w-[80px]" title={a.source ?? ""}>
                        {a.source ?? <span className="text-gray-700">direct</span>}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer totals */}
        {data && data.abandonments.length > 0 && (
          <div className="px-5 py-3 border-t border-white/[0.07] flex gap-6 flex-wrap">
            {abandonSteps.map((s) => {
              const cnt = data.abandonments.filter((a) => a.lastStep === s).length;
              const cfg = STEP_CONFIG[s];
              return (
                <div key={s} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${cfg?.dot ?? "bg-gray-500"}`} />
                  <span className="text-xs text-gray-500">{cfg?.label ?? s}:</span>
                  <span className="text-xs font-bold text-gray-300">{cnt}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
