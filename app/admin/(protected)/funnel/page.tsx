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
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function relTime(iso: string) {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60) return `${mins}m ago`;
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

function jobLabel(slug: string | null): string {
  if (!slug) return "Unknown job";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Step config ───────────────────────────────────────────────────────────────

const STEP_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  gate:            { label: "EU check",        bg: "bg-sky-500/20",     text: "text-sky-300",     dot: "bg-sky-400" },
  details_a:       { label: "Step 2 — BSN",    bg: "bg-amber-500/20",   text: "text-amber-300",   dot: "bg-amber-400" },
  details_b:       { label: "Step 3 — Contact",bg: "bg-orange-500/20",  text: "text-orange-300",  dot: "bg-orange-400" },
  geo_blocked:     { label: "GEO blocked",     bg: "bg-red-500/20",     text: "text-red-300",     dot: "bg-red-400" },
  already_applied: { label: "Already applied", bg: "bg-rose-500/20",    text: "text-rose-300",    dot: "bg-rose-400" },
  complete:        { label: "Completed",        bg: "bg-emerald-500/20", text: "text-emerald-300", dot: "bg-emerald-400" },
};

function StepBadge({ step }: { step: string }) {
  const c = STEP_CONFIG[step] ?? { label: step, bg: "bg-gray-700", text: "text-gray-300", dot: "bg-gray-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10 ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent,
}: {
  label: string; value: string | number; sub?: string; accent: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${accent}`}>
      <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">{label}</p>
      <p className="text-4xl font-black leading-none mb-1">{value}</p>
      {sub && <p className="text-xs opacity-60 mt-2">{sub}</p>}
    </div>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/60">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">{title}</p>
      </div>
      {children}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FunnelAdminPage() {
  const [data,       setData]       = useState<FunnelData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
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

  // ── Derived ────────────────────────────────────────────────────────────────
  const opens      = data?.funnel["open"]            ?? 0;
  const gatePassed = data?.funnel["gate_passed"]      ?? 0;
  const aaPassed   = data?.funnel["details_a_passed"] ?? 0;
  const completed  = data?.funnel["completed"]        ?? 0;
  const abandoned  = data?.funnel["abandoned"]        ?? 0;
  const disq       = data?.funnel["disqualified"]     ?? 0;

  const funnelSteps = [
    { label: "Opened apply",     count: opens,      prev: null,       bar: "from-blue-600 to-blue-500",      num: "text-blue-300"    },
    { label: "Passed EU check",  count: gatePassed, prev: opens,      bar: "from-indigo-600 to-indigo-500",  num: "text-indigo-300"  },
    { label: "Passed BSN step",  count: aaPassed,   prev: gatePassed, bar: "from-violet-600 to-violet-500",  num: "text-violet-300"  },
    { label: "Completed → WA",   count: completed,  prev: aaPassed,   bar: "from-emerald-600 to-emerald-500",num: "text-emerald-300" },
  ];

  const maxCount = Math.max(...funnelSteps.map((s) => s.count), 1);

  // Biggest drop-off
  const drops = funnelSteps.slice(1).map((s, i) => ({
    label: s.label,
    dropped: funnelSteps[i].count - s.count,
    pctVal: pctNum(funnelSteps[i].count - s.count, funnelSteps[i].count),
  })).filter((d) => d.dropped > 0);
  const biggestDrop = drops.sort((a, b) => b.pctVal - a.pctVal)[0];

  // Abandonments
  const filteredAbandons = (data?.abandonments ?? []).filter(
    (a) => stepFilter === "all" || a.lastStep === stepFilter,
  );
  const abandonSteps = [...new Set((data?.abandonments ?? []).map((a) => a.lastStep))];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Apply Funnel</h1>
            <p className="text-gray-400 mt-1">Last 30 days — where do candidates drop off?</p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 text-sm font-semibold transition disabled:opacity-40"
          >
            {loading ? "Loading…" : "↺ Refresh"}
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-950 border border-red-700 px-5 py-3 text-red-300 text-sm font-medium">
            ⚠ {error}
          </div>
        )}

        {/* ── KPI cards ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Opened"
            value={opens}
            sub="started flow"
            accent="bg-blue-950 border-blue-700 text-blue-100"
          />
          <StatCard
            label="Completed"
            value={completed}
            sub={`${pct(completed, opens)} of opens`}
            accent="bg-emerald-950 border-emerald-700 text-emerald-100"
          />
          <StatCard
            label="Abandoned"
            value={abandoned}
            sub={`${pct(abandoned, opens)} of opens`}
            accent="bg-amber-950 border-amber-700 text-amber-100"
          />
          <StatCard
            label="Disqualified"
            value={disq}
            sub="geo / duplicate"
            accent="bg-red-950 border-red-700 text-red-100"
          />
        </div>

        {/* ── Alert ──────────────────────────────────────────────────────────── */}
        {biggestDrop && biggestDrop.pctVal > 20 && (
          <div className="rounded-2xl bg-red-950 border-2 border-red-600 px-6 py-4 flex items-start gap-4">
            <span className="text-2xl mt-0.5">⚠️</span>
            <div>
              <p className="text-base font-black text-red-300">Biggest drop-off: {biggestDrop.label}</p>
              <p className="text-sm text-red-400 mt-1">
                <strong>{biggestDrop.dropped} people ({biggestDrop.pctVal}%)</strong> stop at this step.
                This is where the form loses the most candidates.
              </p>
            </div>
          </div>
        )}

        {/* ── Funnel ─────────────────────────────────────────────────────────── */}
        <Section title="Step-by-step funnel">
          <div className="p-6 space-y-6">
            {funnelSteps.map((s, i) => {
              const barW     = (s.count / maxCount) * 100;
              const retained = s.prev !== null ? pctNum(s.count, s.prev) : 100;
              const dropped  = s.prev !== null ? s.prev - s.count : 0;
              return (
                <div key={s.label}>
                  {/* Labels */}
                  <div className="flex items-center justify-between mb-2 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-full bg-gray-700 text-xs font-black text-gray-300 flex items-center justify-center shrink-0 border border-gray-600">
                        {i + 1}
                      </span>
                      <span className="text-sm font-bold text-gray-200 truncate">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {s.prev !== null && (
                        <span
                          className={`text-sm font-black px-2.5 py-0.5 rounded-lg ${
                            retained >= 70
                              ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                              : retained >= 50
                              ? "bg-amber-900/60 text-amber-300 border border-amber-700"
                              : "bg-red-900/60 text-red-300 border border-red-700"
                          }`}
                        >
                          {retained}% kept
                        </span>
                      )}
                      <span className={`text-3xl font-black ${s.num} tabular-nums w-16 text-right`}>
                        {s.count}
                      </span>
                    </div>
                  </div>
                  {/* Bar */}
                  <div className="h-10 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
                    <div
                      className={`h-full rounded-xl bg-gradient-to-r transition-all duration-700 ${s.bar}`}
                      style={{ width: `${barW}%` }}
                    />
                  </div>
                  {/* Drop connector */}
                  {i < funnelSteps.length - 1 && dropped > 0 && (
                    <div className="flex items-center gap-2 mt-2 ml-10 text-red-400 text-xs font-semibold">
                      <span>↓</span>
                      <span>{dropped} dropped ({pct(dropped, s.count)} didn't continue)</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Conversion row */}
            <div className="mt-4 pt-5 border-t border-gray-700 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { lbl: "Overall", val: pct(completed, opens),  col: "text-white" },
                { lbl: "Open → EU",  val: pct(gatePassed, opens),   col: "text-indigo-300" },
                { lbl: "EU → BSN",   val: pct(aaPassed, gatePassed), col: "text-violet-300" },
                { lbl: "BSN → Done", val: pct(completed, aaPassed),  col: "text-emerald-300" },
              ].map((r) => (
                <div key={r.lbl} className="bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">{r.lbl}</p>
                  <p className={`text-2xl font-black mt-1 ${r.col}`}>{r.val}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Daily + Top jobs ───────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-6">

          {/* Daily opens chart */}
          {data?.daily && data.daily.length > 0 && (
            <Section title="Daily opens — last 14 days">
              <div className="p-6">
                {(() => {
                  const maxDay = Math.max(...data.daily.map((d) => d.cnt), 1);
                  return (
                    <div className="flex items-end gap-2" style={{ height: "160px" }}>
                      {data.daily.map((d) => {
                        const barH = Math.max((d.cnt / maxDay) * 128, 4);
                        const label = d.day.slice(5).replace("-", "/");
                        return (
                          <div key={d.day} className="flex flex-col items-center flex-1 min-w-0 group gap-1">
                            <span className="text-xs text-blue-300 font-black opacity-0 group-hover:opacity-100 transition-opacity">
                              {d.cnt}
                            </span>
                            <div
                              title={`${d.cnt} on ${d.day}`}
                              className="w-full rounded-t-lg bg-blue-600 hover:bg-blue-400 transition-colors cursor-default"
                              style={{ height: `${barH}px` }}
                            />
                            <span className="text-[10px] text-gray-500 truncate w-full text-center font-medium">
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
                <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                  <span className="text-sm text-gray-500">14-day total</span>
                  <span className="text-xl font-black text-blue-300">
                    {data.daily.reduce((s, d) => s + d.cnt, 0)}
                  </span>
                </div>
              </div>
            </Section>
          )}

          {/* Top jobs */}
          {data?.topJobs && data.topJobs.length > 0 && (
            <Section title="Top jobs by opens">
              <div className="p-6 space-y-4">
                {(() => {
                  const maxJob = Math.max(...data.topJobs.map((j) => j.cnt), 1);
                  return data.topJobs.slice(0, 8).map((j, idx) => (
                    <div key={j.jobId ?? idx}>
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <a
                          href={j.jobId ? `/apply/${j.jobId}` : "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-gray-300 hover:text-white hover:underline font-medium truncate max-w-[75%]"
                          title={j.jobId ?? "unknown"}
                        >
                          {jobLabel(j.jobId)}
                        </a>
                        <span className="text-sm font-black text-white shrink-0">{j.cnt}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-gray-800 border border-gray-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${(j.cnt / maxJob) * 100}%` }}
                        />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </Section>
          )}
        </div>

        {/* ── Abandonments ───────────────────────────────────────────────────── */}
        <Section title={`Recent abandonments — ${filteredAbandons.length} ${stepFilter !== "all" ? `at "${STEP_CONFIG[stepFilter]?.label ?? stepFilter}"` : "total"}`}>
          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-700 flex flex-wrap gap-2">
            <button
              onClick={() => setStepFilter("all")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                stepFilter === "all"
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-transparent border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"
              }`}
            >
              All steps
            </button>
            {abandonSteps.map((s) => {
              const c = STEP_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => setStepFilter(s)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                    stepFilter === s
                      ? `${c?.bg ?? "bg-gray-700"} border-white/20 ${c?.text ?? "text-white"}`
                      : "bg-transparent border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"
                  }`}
                >
                  {c?.label ?? s}
                </button>
              );
            })}
          </div>

          {/* Table */}
          {!data || filteredAbandons.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-600 text-sm">
              {loading ? "Loading…" : "No abandonments for this filter"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead className="bg-gray-800/80">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest w-28">When</th>
                    <th className="text-left px-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest">Stopped at</th>
                    <th className="text-left px-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest">Job</th>
                    <th className="text-left px-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest w-28">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAbandons.map((a, idx) => (
                    <tr
                      key={a.sessionId + a.ts}
                      className={`border-t border-gray-800 transition-colors ${
                        idx % 2 === 0 ? "bg-gray-900" : "bg-gray-900/60"
                      } hover:bg-gray-800`}
                    >
                      <td className="px-6 py-3">
                        <span className="text-sm font-semibold text-gray-300" title={fmt(a.ts)}>
                          {relTime(a.ts)}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <StepBadge step={a.lastStep} />
                      </td>
                      <td className="px-6 py-3 max-w-[220px]">
                        {a.jobId ? (
                          <a
                            href={`/apply/${a.jobId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-gray-300 hover:text-white hover:underline font-medium"
                            title={a.jobId}
                          >
                            {jobLabel(a.jobId)}
                          </a>
                        ) : (
                          <span className="text-gray-600 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-xs text-gray-400 truncate block max-w-[90px] font-medium" title={a.source ?? ""}>
                          {a.source ?? "direct"}
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
            <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/40 flex flex-wrap gap-4">
              {abandonSteps.map((s) => {
                const cnt = data.abandonments.filter((a) => a.lastStep === s).length;
                const c = STEP_CONFIG[s];
                return (
                  <div key={s} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${c?.dot ?? "bg-gray-500"}`} />
                    <span className="text-xs text-gray-400 font-medium">{c?.label ?? s}:</span>
                    <span className="text-xs font-black text-white">{cnt}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

      </div>
    </div>
  );
}
