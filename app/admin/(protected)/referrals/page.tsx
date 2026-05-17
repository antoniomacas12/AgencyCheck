"use client";

import { useEffect, useState } from "react";

interface PerRecruiter {
  recruiter:   string;
  recruiterWa: string;
  clicks:      number;
  firstSeen:   string;
  lastSeen:    string;
}

interface PerVacancy {
  jobId:     string | null;
  jobTitle:  string | null;
  recruiter: string;
  clicks:    number;
}

interface RecentClick {
  id:        string;
  createdAt: string;
  recruiter: string;
  jobId:     string | null;
  jobTitle:  string | null;
  source:    string;
}

interface Data {
  total:        number;
  perRecruiter: PerRecruiter[];
  perVacancy:   PerVacancy[];
  recent:       RecentClick[];
}

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function ReferralsAdminPage() {
  const [data,    setData]    = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/referral-click")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Failed to load data"); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0B1F14] flex items-center justify-center">
      <p className="text-gray-500 text-sm animate-pulse">Loading referral data…</p>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-[#0B1F14] flex items-center justify-center">
      <p className="text-red-400 text-sm">{error ?? "No data"}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1F14] text-white px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-1">
            Admin · Recruiter Referrals
          </p>
          <h1 className="text-white font-extrabold text-[24px]">Lead Tracking</h1>
          <p className="text-gray-500 text-[13px] mt-1">
            Candidates sent from AgencyCheck → recruiter WhatsApp
          </p>
        </div>

        {/* ── Total counter ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-6 py-5 mb-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-1">
            Total outgoing applications
          </p>
          <p className="text-emerald-400 font-extrabold text-[48px] leading-none">{data.total}</p>
          <p className="text-gray-500 text-[12px] mt-2">source: AgencyCheck</p>
        </div>

        {/* ── Per recruiter ─────────────────────────────────────── */}
        {data.perRecruiter.length > 0 && (
          <div className="mb-6">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3">
              By Recruiter
            </p>
            <div className="flex flex-col gap-2">
              {data.perRecruiter.map((r) => (
                <div
                  key={r.recruiterWa}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white font-bold text-[15px]">{r.recruiter}</p>
                      <p className="text-gray-500 text-[11px] mt-0.5 font-mono">{r.recruiterWa}</p>
                    </div>
                    <span className="text-emerald-400 font-extrabold text-[28px] leading-none shrink-0">
                      {r.clicks}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-3 text-[11px] text-gray-600">
                    <span>First: {fmtDate(r.firstSeen)}</span>
                    <span>Last: {fmtDate(r.lastSeen)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Per vacancy ───────────────────────────────────────── */}
        {data.perVacancy.length > 0 && (
          <div className="mb-6">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3">
              By Vacancy
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
                    <tr
                      key={`${v.jobId}-${i}`}
                      className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3">
                        <p className="text-white font-medium leading-snug">
                          {v.jobTitle ?? "—"}
                        </p>
                        {v.jobId && (
                          <p className="text-gray-600 text-[10px] font-mono mt-0.5">{v.jobId}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{v.recruiter}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-emerald-400 font-bold">{v.clicks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Recent clicks timeline ────────────────────────────── */}
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3">
            Recent clicks ({data.recent.length})
          </p>
          {data.recent.length === 0 ? (
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-8 text-center text-gray-600 text-[13px]">
              No clicks recorded yet. Tracking starts when a candidate passes the EU check.
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {data.recent.map((click) => (
                <div
                  key={click.id}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                >
                  {/* Green dot */}
                  <span className="mt-1 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[13px] font-medium leading-snug truncate">
                      {click.jobTitle ?? "General application"}
                    </p>
                    <div className="flex flex-wrap gap-x-3 mt-0.5 text-[11px] text-gray-500">
                      <span>{click.recruiter}</span>
                      <span className="text-emerald-600">src: {click.source}</span>
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
