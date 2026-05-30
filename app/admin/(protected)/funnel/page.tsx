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

function pct(num: number, denom: number): string {
  if (!denom) return "—";
  return `${Math.round((num / denom) * 100)}%`;
}

// Human-readable step labels
const STEP_LABEL: Record<string, string> = {
  gate:          "Step 1 — EU check",
  details_a:     "Step 2 — BSN / housing",
  details_b:     "Step 3 — Contact details",
  geo_blocked:   "Blocked (non-EU IP)",
  already_applied: "Blocked (already applied)",
  complete:      "Completed",
};

function stepLabel(s: string): string {
  return STEP_LABEL[s] ?? s;
}

// Funnel event → display name
const EVENT_LABEL: Record<string, string> = {
  open:             "Opened modal",
  gate_passed:      "Passed EU check",
  details_a_passed: "Passed step 2",
  completed:        "Completed (WhatsApp opened)",
  abandoned:        "Abandoned (total)",
  disqualified:     "Disqualified",
};

// Step colour for the abandonment badge
const STEP_COLOR: Record<string, string> = {
  gate:          "bg-blue-900/40 text-blue-300 border-blue-700/40",
  details_a:     "bg-amber-900/40 text-amber-300 border-amber-700/40",
  details_b:     "bg-orange-900/40 text-orange-300 border-orange-700/40",
  geo_blocked:   "bg-red-900/40 text-red-300 border-red-700/40",
  already_applied: "bg-red-900/40 text-red-300 border-red-700/40",
  complete:      "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FunnelAdminPage() {
  const [data,    setData]    = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

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

  // ── Derived funnel values ────────────────────────────────────────────────────
  const opens      = data?.funnel["open"]              ?? 0;
  const gatePassed = data?.funnel["gate_passed"]        ?? 0;
  const aaPassed   = data?.funnel["details_a_passed"]   ?? 0;
  const completed  = data?.funnel["completed"]          ?? 0;
  const abandoned  = data?.funnel["abandoned"]          ?? 0;
  const disq       = data?.funnel["disqualified"]       ?? 0;

  const funnelSteps = [
    { label: "Opened apply modal",      count: opens,      pctOf: null,      color: "bg-blue-500" },
    { label: "Passed EU check (step 1)", count: gatePassed, pctOf: opens,    color: "bg-indigo-500" },
    { label: "Passed step 2",           count: aaPassed,   pctOf: gatePassed, color: "bg-violet-500" },
    { label: "Completed → WhatsApp",    count: completed,  pctOf: aaPassed,  color: "bg-emerald-500" },
  ];

  const maxCount = Math.max(...funnelSteps.map((s) => s.count), 1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Apply Funnel</h1>
          <p className="text-sm text-gray-400 mt-0.5">Last 30 days · Where do candidates drop off?</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition disabled:opacity-50"
        >
          {loading ? "Loading…" : "↺ Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-900/30 border border-red-700/40 px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* ── Quick stats row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Opened",      value: opens,     color: "text-blue-400" },
          { label: "Abandoned",   value: abandoned,  color: "text-amber-400" },
          { label: "Disqualified",value: disq,       color: "text-red-400" },
          { label: "Completed",   value: completed,  color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Conversion rate ───────────────────────────────────────────────────── */}
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-5 py-4">
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-1">
          Overall conversion
        </p>
        <p className="text-4xl font-black text-white">
          {pct(completed, opens)}
          <span className="text-base font-normal text-gray-400 ml-2">
            ({completed} completed out of {opens} opened)
          </span>
        </p>
      </div>

      {/* ── Funnel visualisation ──────────────────────────────────────────────── */}
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-5 py-5">
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-4">Funnel</p>
        <div className="space-y-3">
          {funnelSteps.map((s, i) => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300">{s.label}</span>
                <div className="flex items-center gap-3">
                  {s.pctOf !== null && (
                    <span className="text-[11px] text-gray-500">
                      {pct(s.count, s.pctOf)} from prev
                    </span>
                  )}
                  <span className="text-sm font-black text-white w-8 text-right">{s.count}</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${s.color}`}
                  style={{ width: `${(s.count / maxCount) * 100}%` }}
                />
              </div>
              {/* Drop-off arrow between steps */}
              {i < funnelSteps.length - 1 && funnelSteps[i].count > 0 && (
                <p className="text-[11px] text-red-400 mt-1 text-right">
                  ↓ {funnelSteps[i].count - funnelSteps[i + 1].count} dropped off here
                  ({pct(funnelSteps[i].count - funnelSteps[i + 1].count, funnelSteps[i].count)})
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Daily opens chart (text-based) ───────────────────────────────────── */}
      {data?.daily && data.daily.length > 0 && (
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-5 py-5">
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Daily opens — last 14 days
          </p>
          <div className="flex items-end gap-1.5 h-24">
            {(() => {
              const maxDay = Math.max(...data.daily.map((d) => d.cnt), 1);
              return data.daily.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                  <span className="text-[9px] text-gray-500">{d.cnt}</span>
                  <div
                    className="w-full rounded-sm bg-blue-500/70"
                    style={{ height: `${Math.max((d.cnt / maxDay) * 64, 2)}px` }}
                  />
                  <span className="text-[9px] text-gray-600 truncate w-full text-center">
                    {d.day.slice(5)} {/* MM-DD */}
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* ── Top jobs ──────────────────────────────────────────────────────────── */}
      {data?.topJobs && data.topJobs.length > 0 && (
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] px-5 py-5">
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Top jobs by opens
          </p>
          <div className="space-y-2">
            {data.topJobs.map((j) => (
              <div key={j.jobId} className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-300 font-mono truncate">{j.jobId ?? "unknown"}</span>
                <span className="text-sm font-black text-white shrink-0">{j.cnt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent abandonments ───────────────────────────────────────────────── */}
      <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07]">
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
            Recent abandonments
            <span className="ml-2 text-gray-600 font-normal normal-case tracking-normal">
              — exact step where each user closed the form
            </span>
          </p>
        </div>

        {!data || data.abandonments.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-600 text-sm">
            {loading ? "Loading…" : "No abandonments yet"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th className="text-left px-5 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Time</th>
                  <th className="text-left px-5 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Dropped at</th>
                  <th className="text-left px-5 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Job</th>
                  <th className="text-left px-5 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Source</th>
                </tr>
              </thead>
              <tbody>
                {data.abandonments.map((a) => (
                  <tr key={a.sessionId + a.ts} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-5 py-2.5 text-gray-400 text-[12px] whitespace-nowrap">{fmt(a.ts)}</td>
                    <td className="px-5 py-2.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${STEP_COLOR[a.lastStep] ?? "bg-gray-800 text-gray-400 border-gray-700"}`}>
                        {stepLabel(a.lastStep)}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-gray-400 text-[12px] font-mono">
                      {a.jobId ?? <span className="text-gray-600">—</span>}
                    </td>
                    <td className="px-5 py-2.5 text-gray-500 text-[12px]">
                      {a.source ?? <span className="text-gray-700">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
