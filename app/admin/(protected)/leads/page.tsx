"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type LeadStatus =
  | "new" | "reviewed" | "waiting_for_match" | "potential_fit"
  | "agency_contact_pending" | "approved" | "sent" | "converted"
  | "confirmed" | "paid" | "rejected" | "contacted";
type LeadSourceType = "jobs_with_housing" | "job_page" | "agency_page" | "general_apply";
type Availability   = "immediately" | "1_2_weeks" | "1_month" | "exploring";
type LocationStatus = "nl" | "relocate" | "exploring";

interface Lead {
  id: string; createdAt: string; fullName: string; phone: string; email?: string;
  preferredWorkType?: string; preferredRegion?: string; accommodationNeeded?: boolean;
  sourcePage: string; sourceType: LeadSourceType; sourceLabel?: string;
  nationality?: string; currentCountry?: string; status: LeadStatus;
  tags: string[]; assignedTo?: string; assignedAgencies: string[]; sentAt?: string;
  internalNotes?: string;
  availability?: Availability; locationStatus?: LocationStatus; leadScore?: number;
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

const STATUS_META: Record<LeadStatus, { label: string; bg: string; text: string; dot: string }> = {
  new:                    { label: "New",               bg: "bg-blue-100",    text: "text-blue-800",    dot: "bg-blue-500" },
  reviewed:               { label: "Reviewed",          bg: "bg-sky-100",     text: "text-sky-800",     dot: "bg-sky-400" },
  waiting_for_match:      { label: "Waiting for match", bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-400" },
  potential_fit:          { label: "Potential fit",     bg: "bg-orange-100",  text: "text-orange-800",  dot: "bg-orange-500" },
  agency_contact_pending: { label: "Agency pending",    bg: "bg-yellow-100",  text: "text-yellow-800",  dot: "bg-yellow-500" },
  approved:               { label: "Approved",          bg: "bg-green-100",   text: "text-green-800",   dot: "bg-green-500" },
  sent:                   { label: "Sent",              bg: "bg-purple-100",  text: "text-purple-800",  dot: "bg-purple-500" },
  converted:              { label: "Converted",         bg: "bg-teal-100",    text: "text-teal-800",    dot: "bg-teal-500" },
  confirmed:              { label: "✅ Started",        bg: "bg-emerald-100", text: "text-emerald-800", dot: "bg-emerald-500" },
  paid:                   { label: "💰 Paid",           bg: "bg-green-200",   text: "text-green-900",   dot: "bg-yellow-500" },
  rejected:               { label: "Rejected",          bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-400" },
  contacted:              { label: "Contacted",         bg: "bg-gray-100",    text: "text-gray-600",    dot: "bg-gray-400" },
};
const SOURCE_LABELS: Record<LeadSourceType, string> = {
  jobs_with_housing: "Housing page", job_page: "Job page",
  agency_page: "Agency page", general_apply: "General",
};
const WORK_LABELS: Record<string, string> = {
  logistics: "Logistics", production: "Production", greenhouse: "Greenhouse",
  driving: "Driving", cleaning: "Cleaning", construction: "Construction", any: "Any",
};
const AVAIL_META: Record<Availability, { label: string; cls: string }> = {
  immediately: { label: "⚡ Now",       cls: "bg-green-100 text-green-800"   },
  "1_2_weeks": { label: "📅 1–2 wks",  cls: "bg-blue-100 text-blue-800"     },
  "1_month":   { label: "🗓 1 month",   cls: "bg-yellow-100 text-yellow-800" },
  exploring:   { label: "👀 Exploring", cls: "bg-gray-100 text-gray-500"     },
};
const LOC_META: Record<LocationStatus, { label: string; cls: string }> = {
  nl:        { label: "🇳🇱 In NL",    cls: "bg-green-100 text-green-800" },
  relocate:  { label: "✈️ Relocate",  cls: "bg-blue-100 text-blue-800"  },
  exploring: { label: "🔍 Exploring", cls: "bg-gray-100 text-gray-500"  },
};

// ─── Small components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: LeadStatus }) {
  const m = STATUS_META[status] ?? STATUS_META.new;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${m.bg} ${m.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />{m.label}
    </span>
  );
}
function ScoreBadge({ score }: { score?: number }) {
  if (score === undefined || score === null) return <span className="text-gray-300 text-xs">—</span>;
  const cls =
    score >= 90 ? "bg-green-600 text-white"  :
    score >= 70 ? "bg-blue-600 text-white"   :
    score >= 40 ? "bg-yellow-500 text-white" :
                  "bg-gray-300 text-gray-700";
  return <span className={`inline-flex items-center text-[11px] font-black px-2 py-0.5 rounded-full ${cls}`}>{score >= 90 ? `🔥 ${score}` : score}</span>;
}
function fmtDate(iso: string) { return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }); }
function fmtTime(iso: string) { return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }

const BSN_META: Record<string, { label: string; cls: string }> = {
  has_bsn:       { label: "BSN ✓",         cls: "bg-green-100 text-green-800" },
  worked_before: { label: "Prev. NL",       cls: "bg-blue-100 text-blue-700"  },
  no:            { label: "No BSN",         cls: "bg-gray-100 text-gray-500"  },
};
const EXP_META: Record<string, { label: string; cls: string }> = {
  yes: { label: "NL exp ✓", cls: "bg-teal-100 text-teal-800"  },
  no:  { label: "No NL exp", cls: "bg-gray-100 text-gray-500" },
};

function QualBadges({ tags }: { tags: string[] }) {
  const bsnTag = tags.find((t) => t.startsWith("q:bsn="));
  const expTag = tags.find((t) => t.startsWith("q:exp="));
  const bsnVal = bsnTag ? bsnTag.replace("q:bsn=", "") : null;
  const expVal = expTag ? expTag.replace("q:exp=", "") : null;
  if (!bsnVal && !expVal) return null;
  return (
    <span className="flex flex-wrap gap-1 mt-1">
      {bsnVal && BSN_META[bsnVal] && (
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${BSN_META[bsnVal].cls}`}>
          {BSN_META[bsnVal].label}
        </span>
      )}
      {expVal && EXP_META[expVal] && (
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${EXP_META[expVal].cls}`}>
          {EXP_META[expVal].label}
        </span>
      )}
    </span>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function LeadsDashboard() {
  const [leads,          setLeads]          = useState<Lead[]>([]);
  const [total,          setTotal]          = useState(0);
  const [pages,          setPages]          = useState(1);
  const [page,           setPage]           = useState(1);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState<string | null>(null);
  const [q,              setQ]              = useState("");
  const [statusF,        setStatusF]        = useState("");
  const [accomF,         setAccomF]         = useState("");
  const [workF,          setWorkF]          = useState("");
  const [sourceF,        setSourceF]        = useState("");
  const [acting,         setActing]         = useState<string | null>(null);
  const [actionError,    setActionError]    = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  // Inline notes editing
  const [editingNotes,   setEditingNotes]   = useState<string | null>(null); // lead id
  const [notesValue,     setNotesValue]     = useState("");
  const [savingNotes,    setSavingNotes]    = useState(false);

  // ── Fetch ───────────────────────────────────────────────────────────────────

  const fetchLeads = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const p = new URLSearchParams({ page: String(page), limit: "50" });
      if (q)       p.set("q", q);
      if (statusF) p.set("status", statusF);
      if (accomF)  p.set("accommodation", accomF);
      if (workF)   p.set("workType", workF);
      if (sourceF) p.set("sourceType", sourceF);
      const res = await fetch(`/api/admin/leads?${p}`);
      if (res.status === 401) { window.location.href = "/admin/login"; return; }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = typeof data.detail === "string" ? ` — ${data.detail}` : "";
        throw new Error(`HTTP ${res.status}${detail}`);
      }
      setLeads(data.leads ?? []); setTotal(data.total ?? 0); setPages(data.pages ?? 1);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed to load"); }
    finally { setLoading(false); }
  }, [page, q, statusF, accomF, workF, sourceF]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { setPage(1); }, [q, statusF, accomF, workF, sourceF]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  async function updateStatus(id: string, status: LeadStatus) {
    setActing(id); setActionError(null);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Update failed");
      }
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to update status");
    } finally { setActing(null); }
  }

  async function deleteLead(id: string) {
    setActing(id); setActionError(null);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Delete failed");
      }
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to delete lead");
    } finally { setActing(null); setConfirmDeleteId(null); }
  }

  async function saveNotes(id: string, notes: string) {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ internalNotes: notes }),
      });
      if (!res.ok) throw new Error("Save failed");
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, internalNotes: notes } : l));
      setEditingNotes(null);
    } catch {
      setActionError("Failed to save notes");
    } finally { setSavingNotes(false); }
  }

  // ── Derived ──────────────────────────────────────────────────────────────────

  const counts   = leads.reduce<Record<LeadStatus, number>>((acc, l) => ({ ...acc, [l.status]: (acc[l.status] ?? 0) + 1 }), {} as Record<LeadStatus, number>);
  const newCount = leads.filter((l) => l.status === "new").length;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Candidate Pipeline
              {newCount > 0 && <span className="text-xs bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">{newCount} new</span>}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} profile{total !== 1 ? "s" : ""} · sorted by lead score</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />Live
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(Object.keys(STATUS_META) as LeadStatus[]).map((s) => {
            const m = STATUS_META[s]; const cnt = counts[s] ?? 0; const active = statusF === s;
            return (
              <button key={s} onClick={() => setStatusF(active ? "" : s)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                  active ? `${m.bg} ${m.text} border-current shadow-sm` : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                {m.label}{cnt > 0 && <span className="opacity-70 ml-0.5">({cnt})</span>}
              </button>
            );
          })}
          {statusF && <button onClick={() => setStatusF("")} className="text-xs text-gray-400 hover:text-gray-700 px-2">Clear ×</button>}
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Search</label>
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, phone, email…"
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Housing</label>
            <select value={accomF} onChange={(e) => setAccomF(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white">
              <option value="">All</option><option value="yes">Needs housing</option><option value="no">No housing</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Work type</label>
            <select value={workF} onChange={(e) => setWorkF(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white">
              <option value="">All types</option>
              {Object.entries(WORK_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Source</label>
            <select value={sourceF} onChange={(e) => setSourceF(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white">
              <option value="">All sources</option>
              {(Object.keys(SOURCE_LABELS) as LeadSourceType[]).map((s) => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
            </select>
          </div>
          <button onClick={fetchLeads} className="px-4 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Refresh ↻</button>
        </div>

        {/* Error banner */}
        {(actionError || error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg mb-4 flex items-center justify-between">
            <span>{actionError ?? error}</span>
            <button onClick={() => { setActionError(null); setError(null); }} className="text-red-400 hover:text-red-600 ml-4 text-lg leading-none">×</button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-400">Loading…</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center space-y-2">
              <p className="text-2xl">⚠️</p>
              <p className="text-sm font-semibold text-red-600">Could not load leads</p>
              <p className="text-xs text-gray-500 max-w-md mx-auto">{error}</p>
              <p className="text-xs text-gray-400">If this mentions a missing column, run the SQL migration in your Supabase SQL editor.</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-3xl mb-3">📭</p>
              <p className="text-sm font-semibold text-gray-700">No leads found</p>
              <p className="text-xs text-gray-400 mt-1">
                {q || statusF || accomF || workF || sourceF ? "Try clearing filters" : "Apply form submissions will appear here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Score","Date","Name","Phone","Work","🏠","Avail.","Location","Source","Status","Actions"].map((h) => (
                      <th key={h} className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map((lead) => (
                    <tr key={lead.id}
                      className={`hover:bg-gray-50/70 transition-colors ${
                        ["new","reviewed","waiting_for_match","potential_fit"].includes(lead.status) ? "bg-blue-50/20" : ""
                      }`}>

                      {/* Score */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <ScoreBadge score={lead.leadScore} />
                      </td>

                      {/* Date */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <p className="text-xs font-semibold text-gray-900">{fmtDate(lead.createdAt)}</p>
                        <p className="text-[10px] text-gray-400">{fmtTime(lead.createdAt)}</p>
                      </td>

                      {/* Name */}
                      <td className="px-3 py-3">
                        <Link href={`/admin/leads/${lead.id}`} className="font-semibold text-gray-900 hover:text-blue-600 hover:underline text-sm">
                          {lead.fullName}
                        </Link>
                        {(lead.nationality || lead.phone) && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {lead.nationality}{lead.nationality && lead.currentCountry ? " · " : ""}{lead.currentCountry}
                          </p>
                        )}
                        {lead.email && (
                          <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[160px]">{lead.email}</p>
                        )}
                        <QualBadges tags={lead.tags} />
                      </td>

                      {/* Phone */}
                      <td className="px-3 py-3">
                        <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline text-xs font-medium whitespace-nowrap">{lead.phone}</a>
                      </td>

                      {/* Work */}
                      <td className="px-3 py-3">
                        <span className="text-xs text-gray-700">
                          {lead.preferredWorkType ? (WORK_LABELS[lead.preferredWorkType] ?? lead.preferredWorkType) : <span className="text-gray-300">—</span>}
                        </span>
                      </td>

                      {/* Housing */}
                      <td className="px-3 py-3 text-center">
                        {lead.accommodationNeeded === true  ? <span title="Needs housing">🏠</span>
                          : lead.accommodationNeeded === false ? <span className="text-xs text-gray-300">No</span>
                          : <span className="text-xs text-gray-300">?</span>}
                      </td>

                      {/* Availability */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        {lead.availability
                          ? <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${AVAIL_META[lead.availability]?.cls ?? "bg-gray-100 text-gray-500"}`}>
                              {AVAIL_META[lead.availability]?.label ?? lead.availability}
                            </span>
                          : <span className="text-gray-300 text-xs">—</span>}
                      </td>

                      {/* Location */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        {lead.locationStatus
                          ? <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${LOC_META[lead.locationStatus]?.cls ?? "bg-gray-100 text-gray-500"}`}>
                              {LOC_META[lead.locationStatus]?.label ?? lead.locationStatus}
                            </span>
                          : <span className="text-gray-300 text-xs">—</span>}
                      </td>

                      {/* Source */}
                      <td className="px-3 py-3">
                        <span className="text-[11px] font-medium text-gray-600">
                          {SOURCE_LABELS[lead.sourceType] ?? lead.sourceType}
                        </span>
                        {lead.sourceLabel && (
                          <p className="text-[10px] text-gray-400 mt-0.5 max-w-[100px] truncate">{lead.sourceLabel}</p>
                        )}
                      </td>

                      {/* Status — badge only, changed via dropdown in Actions */}
                      <td className="px-3 py-3">
                        <StatusBadge status={lead.status} />
                        {lead.assignedAgencies?.length > 0 && (
                          <p className="text-[10px] text-gray-400 mt-0.5">→ {lead.assignedAgencies.join(", ")}</p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-1.5 min-w-[160px]">

                          {/* Status dropdown */}
                          <select
                            value={lead.status}
                            onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                            disabled={acting === lead.id}
                            className="text-[11px] border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:border-blue-400 disabled:opacity-50 w-full"
                            title="Change status"
                          >
                            {(Object.keys(STATUS_META) as LeadStatus[]).map((s) => (
                              <option key={s} value={s}>{STATUS_META[s].label}</option>
                            ))}
                          </select>

                          <div className="flex items-center gap-1 flex-wrap">
                            {/* View / full edit */}
                            <Link href={`/admin/leads/${lead.id}`}
                              className="px-2 py-1 text-[10px] font-semibold border border-gray-200 rounded text-gray-600 hover:border-blue-400 hover:text-blue-600 transition whitespace-nowrap">
                              View →
                            </Link>

                            {/* Notes quick-edit toggle */}
                            <button
                              onClick={() => {
                                if (editingNotes === lead.id) {
                                  setEditingNotes(null);
                                } else {
                                  setEditingNotes(lead.id);
                                  setNotesValue(lead.internalNotes ?? "");
                                }
                              }}
                              className={`px-2 py-1 text-[10px] font-semibold border rounded transition ${
                                lead.internalNotes
                                  ? "border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100"
                                  : "border-gray-200 text-gray-500 hover:border-gray-400"
                              }`}
                              title={lead.internalNotes ? "Edit notes" : "Add notes"}
                            >
                              {lead.internalNotes ? "📝" : "📝+"}
                            </button>

                            {/* Delete */}
                            {confirmDeleteId === lead.id ? (
                              <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded px-1.5 py-1">
                                <span className="text-[10px] text-red-700 font-semibold">Sure?</span>
                                <button
                                  onClick={() => deleteLead(lead.id)}
                                  disabled={acting === lead.id}
                                  className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
                                  Yes
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-0.5 text-[10px] font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(lead.id)}
                                disabled={acting === lead.id}
                                className="px-2 py-1 text-[10px] font-medium border border-red-200 text-red-500 rounded hover:bg-red-50 hover:border-red-400 disabled:opacity-50 transition"
                                title="Delete lead">
                                🗑
                              </button>
                            )}
                          </div>

                          {/* Inline notes editor */}
                          {editingNotes === lead.id && (
                            <div className="mt-1">
                              <textarea
                                value={notesValue}
                                onChange={(e) => setNotesValue(e.target.value)}
                                rows={3}
                                placeholder="Internal notes…"
                                className="w-full text-[11px] border border-gray-200 rounded-md px-2 py-1.5 resize-none focus:outline-none focus:border-blue-400"
                              />
                              <div className="flex gap-1 mt-1">
                                <button
                                  onClick={() => saveNotes(lead.id, notesValue)}
                                  disabled={savingNotes}
                                  className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                                  {savingNotes ? "Saving…" : "Save"}
                                </button>
                                <button
                                  onClick={() => setEditingNotes(null)}
                                  className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-500">Page {page} of {pages} · {total} leads</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition">← Prev</button>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition">Next →</button>
            </div>
          </div>
        )}

        <p className="text-[10px] text-gray-400 text-center mt-8">AgencyCheck internal · All lead data is private and confidential</p>
      </div>
    </div>
  );
}
