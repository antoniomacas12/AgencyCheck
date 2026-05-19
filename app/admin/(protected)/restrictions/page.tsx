"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type ReasonCategory =
  | "no_show_interview" | "no_show_first_day" | "false_cv"
  | "invalid_documents" | "unresponsive_after_offer"
  | "agency_hopping" | "other";

type RestrictionSeverity = "low" | "medium" | "high";

interface CandidateRestriction {
  id:              string;
  phoneNormalized: string;
  phoneRaw:        string;
  reasonCategory:  ReasonCategory;
  severity:        RestrictionSeverity;
  internalNote:    string | null;
  recruiterName:   string | null;
  dateReported:    string | null;
  active:          boolean;
  createdByAdmin:  string | null;
  createdAt:       string;
}

interface BlockedAttempt {
  id:                string;
  restrictionId:     string;
  phoneNormalized:   string;
  attemptedJobId:    string | null;
  attemptedJobTitle: string | null;
  source:            string;
  ipAddress:         string | null;
  createdAt:         string;
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

const REASON_LABELS: Record<ReasonCategory, string> = {
  no_show_interview:        "No-show interview",
  no_show_first_day:        "No-show first work day",
  false_cv:                 "False CV information",
  invalid_documents:        "Invalid documents",
  unresponsive_after_offer: "Unresponsive after offer",
  agency_hopping:           "Agency hopping / reliability concern",
  other:                    "Other",
};

const SEV_META: Record<RestrictionSeverity, { label: string; bg: string; text: string; border: string; dot: string }> = {
  low:    { label: "Low",    bg: "bg-yellow-50",  text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-400" },
  medium: { label: "Medium", bg: "bg-orange-50",  text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-400" },
  high:   { label: "High",   bg: "bg-red-50",     text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500"    },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function maskPhone(p: string) {
  if (p.length <= 4) return "****";
  return "*".repeat(p.length - 4) + p.slice(-4);
}

// ─── Add Form ──────────────────────────────────────────────────────────────────

function AddRestrictionForm({ onAdded }: { onAdded: () => void }) {
  const [open,          setOpen]          = useState(false);
  const [phoneRaw,      setPhoneRaw]      = useState("");
  const [reasonCategory, setReason]       = useState<ReasonCategory>("no_show_interview");
  const [severity,      setSeverity]      = useState<RestrictionSeverity>("medium");
  const [recruiterName, setRecruiterName] = useState("");
  const [dateReported,  setDateReported]  = useState("");
  const [internalNote,  setInternalNote]  = useState("");
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phoneRaw.trim()) { setError("Phone number is required"); return; }
    setSaving(true); setError(null);
    try {
      const res = await fetch("/api/admin/restrictions", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneRaw: phoneRaw.trim(),
          reasonCategory,
          severity,
          recruiterName: recruiterName.trim() || undefined,
          dateReported:  dateReported || undefined,
          internalNote:  internalNote.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Failed to save");
      }
      setOpen(false);
      setPhoneRaw(""); setReason("no_show_interview"); setSeverity("medium");
      setRecruiterName(""); setDateReported(""); setInternalNote("");
      onAdded();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally { setSaving(false); }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        🚫 Add restricted candidate
      </button>
    );
  }

  return (
    <div className="bg-white border border-red-200 rounded-xl p-5 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-sm">Add Restricted Candidate</h3>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
      </div>

      <p className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 mb-4">
        ⚠️ Must be factual and professionally justified. Based on documented recruitment incidents only.
        No personal attacks or discriminatory remarks. Internal use only.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Phone number *</label>
            <input value={phoneRaw} onChange={(e) => setPhoneRaw(e.target.value)}
              placeholder="+31 6 12 34 56 78"
              type="tel" inputMode="tel"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Reported by</label>
            <input value={recruiterName} onChange={(e) => setRecruiterName(e.target.value)}
              placeholder="e.g. Nuno, Nuno's wife"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Reason category *</label>
            <select value={reasonCategory} onChange={(e) => setReason(e.target.value as ReasonCategory)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-400">
              {(Object.entries(REASON_LABELS) as [ReasonCategory, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Severity *</label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as RestrictionSeverity[]).map((s) => {
                const m = SEV_META[s];
                return (
                  <button key={s} type="button" onClick={() => setSeverity(s)}
                    className={`flex-1 text-xs font-bold py-2 rounded-lg border transition ${
                      severity === s ? `${m.bg} ${m.text} ${m.border}` : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Date of incident</label>
          <input type="date" value={dateReported} onChange={(e) => setDateReported(e.target.value)}
            className="w-full sm:w-auto text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Internal note</label>
          <textarea value={internalNote} onChange={(e) => setInternalNote(e.target.value)} rows={3}
            placeholder="Factual description. Professional and objective only. Never exposed publicly."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-400" />
        </div>

        {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
          <button type="submit" disabled={saving || !phoneRaw.trim()}
            className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition">
            {saving ? "Saving…" : "Add restriction"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function RestrictionsPage() {
  const [restrictions, setRestrictions] = useState<CandidateRestriction[]>([]);
  const [attempts,     setAttempts]     = useState<BlockedAttempt[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [toggling,     setToggling]     = useState<string | null>(null);
  const [confirmDel,   setConfirmDel]   = useState<string | null>(null);
  const [deleting,     setDeleting]     = useState<string | null>(null);
  const [expandedId,   setExpandedId]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch("/api/admin/restrictions");
      const data = await res.json();
      setRestrictions(data.restrictions ?? []);
      setAttempts(data.attempts ?? []);
    } catch {
      setError("Failed to load");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(id: string, current: boolean) {
    setToggling(id);
    try {
      await fetch(`/api/admin/restrictions/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ active: !current }),
      });
      setRestrictions((prev) => prev.map((r) => r.id === id ? { ...r, active: !current } : r));
    } catch { setError("Failed to update"); }
    finally { setToggling(null); }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/admin/restrictions/${id}`, { method: "DELETE" });
      setRestrictions((prev) => prev.filter((r) => r.id !== id));
      setAttempts((prev) => prev.filter((a) => a.restrictionId !== id));
    } catch { setError("Failed to delete"); }
    finally { setDeleting(null); setConfirmDel(null); }
  }

  const activeCount  = restrictions.filter((r) => r.active).length;
  const blockedTotal = attempts.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                🚫 Restricted Candidates
                {activeCount > 0 && (
                  <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">{activeCount} active</span>
                )}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Private · Admin-only · Never shown publicly</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span className="bg-gray-100 rounded-lg px-2 py-1 font-semibold">{blockedTotal} blocked attempts</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            🔒 Internal use only. Restricted candidates see a neutral message — no reason is ever shown publicly.
            Restrictions must be based on documented incidents. No discriminatory criteria allowed.
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">

        <AddRestrictionForm onAdded={load} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg mb-4 flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-4">×</button>
          </div>
        )}

        {/* Restrictions list */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Restrictions ({restrictions.length})
            </p>
            <button onClick={load} className="text-xs text-gray-400 hover:text-gray-600 font-semibold">↻ Refresh</button>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-400">Loading…</p>
            </div>
          ) : restrictions.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-3xl mb-3">✅</p>
              <p className="text-sm font-semibold text-gray-700">No restricted candidates</p>
              <p className="text-xs text-gray-400 mt-1">Add a restriction above when a recruiter reports a serious reliability issue.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {restrictions.map((r) => {
                const sev          = SEV_META[r.severity] ?? SEV_META.medium;
                const thisAttempts = attempts.filter((a) => a.restrictionId === r.id);
                const isExpanded   = expandedId === r.id;

                return (
                  <div key={r.id} className={`px-4 py-4 transition-colors ${r.active ? "" : "opacity-50 bg-gray-50"}`}>
                    <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">

                      {/* Status dot */}
                      <div className="mt-1 shrink-0">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${r.active ? "bg-red-500" : "bg-gray-300"}`} />
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-bold text-gray-900 font-mono">
                            {maskPhone(r.phoneNormalized)}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            (raw: {r.phoneRaw})
                          </span>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                            {sev.label}
                          </span>
                          {!r.active && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                              Inactive
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-gray-700 mb-0.5">
                          {REASON_LABELS[r.reasonCategory] ?? r.reasonCategory}
                        </p>

                        <div className="flex flex-wrap gap-x-3 text-[11px] text-gray-400">
                          {r.recruiterName && <span>Reported by: {r.recruiterName}</span>}
                          {r.dateReported  && <span>Incident: {fmtDate(r.dateReported)}</span>}
                          <span>Added: {fmtDate(r.createdAt)}</span>
                          {thisAttempts.length > 0 && (
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : r.id)}
                              className="text-orange-600 font-semibold hover:text-orange-800"
                            >
                              {thisAttempts.length} blocked attempt{thisAttempts.length !== 1 ? "s" : ""} {isExpanded ? "▲" : "▼"}
                            </button>
                          )}
                        </div>

                        {r.internalNote && (
                          <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 rounded-lg px-2 py-1.5 border border-gray-100">
                            📝 {r.internalNote}
                          </p>
                        )}

                        {/* Blocked attempts (expandable) */}
                        {isExpanded && thisAttempts.length > 0 && (
                          <div className="mt-3 space-y-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Blocked attempts</p>
                            {thisAttempts.map((a) => (
                              <div key={a.id} className="flex items-center gap-3 text-[11px] bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                                <span className="text-orange-500 font-bold">🚫</span>
                                <span className="text-gray-600">{fmtDateTime(a.createdAt)}</span>
                                {a.attemptedJobTitle && (
                                  <span className="text-gray-500 truncate">→ {a.attemptedJobTitle}</span>
                                )}
                                {a.ipAddress && (
                                  <span className="text-gray-400 font-mono ml-auto shrink-0">ip: {a.ipAddress}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleActive(r.id, r.active)}
                          disabled={toggling === r.id}
                          className={`px-3 py-1.5 text-xs font-semibold border rounded-lg transition disabled:opacity-50 ${
                            r.active
                              ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                              : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {toggling === r.id ? "…" : r.active ? "Deactivate" : "Activate"}
                        </button>

                        {confirmDel === r.id ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-red-700 font-semibold">Delete?</span>
                            <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id}
                              className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
                              {deleting === r.id ? "…" : "Yes"}
                            </button>
                            <button onClick={() => setConfirmDel(null)}
                              className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-700 rounded">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDel(r.id)}
                            className="px-2 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition">🗑</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-4">
          Private · Internal only · Phone numbers partially masked in UI · Never exposed publicly
        </p>
      </div>
    </div>
  );
}
