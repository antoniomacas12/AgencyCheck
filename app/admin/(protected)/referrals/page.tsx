"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Recruiter {
  id:        string;
  name:      string;
  waUrl:     string;
  enabled:   boolean;
  sortOrder: number;
  clicks:    number;
  lastClick: string | null;
}

interface RecentClick {
  id:        string;
  createdAt: string;
  recruiter: string;
  jobId:     string | null;
  jobTitle:  string | null;
  source:    string;
}

interface PerVacancy {
  jobId:     string | null;
  jobTitle:  string | null;
  recruiter: string;
  clicks:    number;
}

interface ReferralData {
  total:       number;
  perVacancy:  PerVacancy[];
  recent:      RecentClick[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ReferralsAdminPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [data,       setData]       = useState<ReferralData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [toggling,   setToggling]   = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [rRes, dRes] = await Promise.all([
        fetch("/api/admin/recruiters"),
        fetch("/api/referral-click"),
      ]);
      const rJson = await rRes.json();
      const dJson = await dRes.json();
      setRecruiters(rJson.recruiters ?? []);
      setData(dJson);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleRecruiter(id: string, currentEnabled: boolean) {
    setToggling(id);
    try {
      await fetch("/api/admin/recruiters", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id, enabled: !currentEnabled }),
      });
      await load();
    } catch {
      setError("Failed to update recruiter");
    } finally {
      setToggling(null);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0B1F14] flex items-center justify-center">
      <p className="text-gray-500 text-sm animate-pulse">Loading…</p>
    </div>
  );

  const totalClicks   = recruiters.reduce((s, r) => s + r.clicks, 0);
  const enabledCount  = recruiters.filter((r) => r.enabled).length;

  return (
    <div className="min-h-screen bg-[#0B1F14] text-white px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-1">
            Admin · Recruiter Rotation
          </p>
          <h1 className="text-white font-extrabold text-[24px]">Lead Tracking</h1>
          <p className="text-gray-500 text-[13px] mt-1">
            Round-robin distribution · source: AgencyCheck · {enabledCount} recruiter{enabledCount !== 1 ? "s" : ""} active
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-red-300 text-[13px]">
            {error}
          </div>
        )}

        {/* ── Total counter ───────────────────────────────────────── */}
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-6 py-5 mb-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-1">
            Total candidates sent
          </p>
          <p className="text-emerald-400 font-extrabold text-[56px] leading-none">{totalClicks}</p>
          <p className="text-gray-600 text-[12px] mt-2">across all recruiters · source: AgencyCheck</p>
        </div>

        {/* ── Recruiters ─────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3">
            Recruiters ({recruiters.length})
          </p>
          <div className="flex flex-col gap-3">
            {recruiters.map((r) => (
              <div
                key={r.id}
                className={`rounded-2xl border px-5 py-4 transition-all ${
                  r.enabled
                    ? "border-white/[0.09] bg-white/[0.04]"
                    : "border-white/[0.04] bg-white/[0.02] opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-white font-bold text-[16px]">{r.name}</p>
                      <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                        r.enabled
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-gray-500/10 text-gray-500"
                      }`}>
                        {r.enabled ? "active" : "paused"}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[11px] font-mono">{r.waUrl}</p>
                  </div>

                  {/* Click count */}
                  <div className="text-right shrink-0">
                    <p className="text-emerald-400 font-extrabold text-[32px] leading-none">{r.clicks}</p>
                    <p className="text-gray-600 text-[10px]">candidates</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                  <p className="text-gray-600 text-[11px]">
                    {r.lastClick ? `Last: ${fmtDate(r.lastClick)}` : "No activity yet"}
                  </p>
                  <button
                    onClick={() => toggleRecruiter(r.id, r.enabled)}
                    disabled={toggling === r.id}
                    className={`
                      text-[12px] font-bold px-3 py-1.5 rounded-lg border transition-all
                      ${toggling === r.id ? "opacity-50 cursor-not-allowed" : ""}
                      ${r.enabled
                        ? "border-red-400/30 text-red-400 hover:bg-red-400/10"
                        : "border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10"}
                    `}
                  >
                    {toggling === r.id ? "…" : r.enabled ? "Pause" : "Enable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Distribution balance ────────────────────────────────── */}
        {recruiters.length > 0 && totalClicks > 0 && (
          <div className="mb-6 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3">Distribution</p>
            {recruiters.map((r) => {
              const pct = totalClicks > 0 ? Math.round((r.clicks / totalClicks) * 100) : 0;
              return (
                <div key={r.id} className="mb-2 last:mb-0">
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-gray-400">{r.name}</span>
                    <span className="text-gray-500">{r.clicks} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Per vacancy ─────────────────────────────────────────── */}
        {data && data.perVacancy.length > 0 && (
          <div className="mb-6">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3">
              By vacancy
            </p>
            <div className="rounded-xl border border-white/[0.07] overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-white/[0.07] bg-white/[0.03]">
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Job</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold hidden sm:table-cell">Recruiter</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-semibold">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {data.perVacancy.map((v, i) => (
                    <tr key={i} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03]">
                      <td className="px-4 py-3">
                        <p className="text-white font-medium leading-snug">{v.jobTitle ?? "—"}</p>
                        {v.jobId && <p className="text-gray-600 text-[10px] font-mono mt-0.5">{v.jobId}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{v.recruiter}</td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-bold">{v.clicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Recent clicks timeline ──────────────────────────────── */}
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3">
            Assignment history ({data?.recent.length ?? 0})
          </p>
          {!data?.recent.length ? (
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-10 text-center text-gray-600 text-[13px]">
              No assignments yet. Tracking starts on the first qualified application.
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {data.recent.map((click) => (
                <div
                  key={click.id}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                >
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[13px] font-medium leading-snug truncate">
                      {click.jobTitle ?? "General application"}
                    </p>
                    <div className="flex flex-wrap gap-x-3 mt-0.5 text-[11px]">
                      <span className="text-emerald-400 font-semibold">→ {click.recruiter}</span>
                      <span className="text-gray-600">src: {click.source}</span>
                    </div>
                  </div>
                  <span className="text-gray-600 text-[11px] shrink-0 text-right whitespace-nowrap">
                    {fmt(click.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
