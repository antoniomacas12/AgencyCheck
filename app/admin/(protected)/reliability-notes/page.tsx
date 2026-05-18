"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────────

type NoteType =
  | "no_show_interview" | "no_show_first_day" | "left_without_notice"
  | "false_cv" | "invalid_documents" | "unresponsive_after_offer"
  | "agency_hopping" | "other";

type Severity = "low" | "medium" | "high";

interface ReliabilityNote {
  id:              string;
  leadId:          string;
  candidateName:   string;
  noteType:        NoteType;
  severity:        Severity;
  recruiterSource: string | null;
  incidentDate:    string | null;
  noteText:        string | null;
  createdByAdmin:  string | null;
  createdAt:       string;
}

interface LeadSearchResult {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  no_show_interview:        "No-show interview",
  no_show_first_day:        "No-show first work day",
  left_without_notice:      "Left job without notice",
  false_cv:                 "False CV information",
  invalid_documents:        "Invalid documents",
  unresponsive_after_offer: "Unresponsive after offer",
  agency_hopping:           "Agency hopping reported",
  other:                    "Other",
};

const SEVERITY_META: Record<Severity, { label: string; bg: string; text: string; dot: string; border: string }> = {
  low:    { label: "Low",    bg: "bg-yellow-50",  text: "text-yellow-700", dot: "bg-yellow-400", border: "border-yellow-200" },
  medium: { label: "Medium", bg: "bg-orange-50",  text: "text-orange-700", dot: "bg-orange-400", border: "border-orange-200" },
  high:   { label: "High",   bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-500",    border: "border-red-200"    },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Add Note Form ─────────────────────────────────────────────────────────────

function AddNoteForm({ onAdded }: { onAdded: () => void }) {
  const [open,            setOpen]            = useState(false);
  const [searchQ,         setSearchQ]         = useState("");
  const [searchResults,   setSearchResults]   = useState<LeadSearchResult[]>([]);
  const [searching,       setSearching]       = useState(false);
  const [selectedLead,    setSelectedLead]    = useState<LeadSearchResult | null>(null);
  const [noteType,        setNoteType]        = useState<NoteType>("no_show_interview");
  const [severity,        setSeverity]        = useState<Severity>("medium");
  const [recruiterSource, setRecruiterSource] = useState("");
  const [incidentDate,    setIncidentDate]    = useState("");
  const [noteText,        setNoteText]        = useState("");
  const [saving,          setSaving]          = useState(false);
  const [error,           setError]           = useState<string | null>(null);

  async function searchLeads(q: string) {
    if (q.trim().length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/leads?q=${encodeURIComponent(q)}&limit=10`);
      const data = await res.json();
      setSearchResults(data.leads ?? []);
    } catch { setSearchResults([]); }
    finally { setSearching(false); }
  }

  useEffect(() => {
    const t = setTimeout(() => searchLeads(searchQ), 350);
    return () => clearTimeout(t);
  }, [searchQ]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedLead) { setError("Select a candidate first"); return; }
    if (!noteText.trim() && noteType !== "other") {
      // noteText optional but encouraged
    }
    setSaving(true); setError(null);
    try {
      const res = await fetch("/api/admin/reliability-notes", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId:          selectedLead.id,
          candidateName:   selectedLead.fullName,
          noteType,
          severity,
          recruiterSource: recruiterSource.trim() || undefined,
          incidentDate:    incidentDate || undefined,
          noteText:        noteText.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Failed to save");
      }
      // Reset form
      setOpen(false);
      setSelectedLead(null); setSearchQ(""); setSearchResults([]);
      setNoteType("no_show_interview"); setSeverity("medium");
      setRecruiterSource(""); setIncidentDate(""); setNoteText("");
      onAdded();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save note");
    } finally { setSaving(false); }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
      >
        ⚠️ Add reliability note
      </button>
    );
  }

  return (
    <div className="bg-white border border-orange-200 rounded-xl p-5 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-sm">Add Reliability Note</h3>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
      </div>

      <p className="text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
        ⚠️ Notes must be factual and professional. No personal attacks, medical information, or discriminatory remarks.
        For internal recruitment reliability tracking only.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Candidate search */}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
            Candidate *
          </label>
          {selectedLead ? (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">{selectedLead.fullName}</p>
                <p className="text-xs text-gray-500">{selectedLead.phone}{selectedLead.email ? ` · ${selectedLead.email}` : ""}</p>
              </div>
              <button type="button" onClick={() => { setSelectedLead(null); setSearchQ(""); }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold">Change</button>
            </div>
          ) : (
            <div className="relative">
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search by name, phone, email…"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                autoComplete="off"
              />
              {searching && (
                <p className="text-xs text-gray-400 mt-1">Searching…</p>
              )}
              {searchResults.length > 0 && !selectedLead && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                  {searchResults.map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => { setSelectedLead(lead); setSearchResults([]); setSearchQ(""); }}
                      className="w-full text-left px-3 py-2.5 hover:bg-blue-50 border-b border-gray-50 last:border-0 transition"
                    >
                      <p className="text-sm font-semibold text-gray-900">{lead.fullName}</p>
                      <p className="text-xs text-gray-500">{lead.phone}{lead.email ? ` · ${lead.email}` : ""}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Note type */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Note type *
            </label>
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value as NoteType)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {(Object.entries(NOTE_TYPE_LABELS) as [NoteType, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Severity *
            </label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as Severity[]).map((s) => {
                const m = SEVERITY_META[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={`flex-1 text-xs font-bold py-2 rounded-lg border transition ${
                      severity === s
                        ? `${m.bg} ${m.text} ${m.border}`
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Recruiter/source */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Reported by / source
            </label>
            <input
              value={recruiterSource}
              onChange={(e) => setRecruiterSource(e.target.value)}
              placeholder="e.g. Nuno, Randstad, etc."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Incident date */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Incident date
            </label>
            <input
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Note text */}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
            Internal note
          </label>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            placeholder="Factual description of the incident. Professional and objective only."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            Cancel
          </button>
          <button type="submit" disabled={saving || !selectedLead}
            className="px-4 py-2 text-sm font-semibold bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition">
            {saving ? "Saving…" : "Save note"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function ReliabilityNotesPage() {
  const [notes,       setNotes]       = useState<ReliabilityNote[]>([]);
  const [total,       setTotal]       = useState(0);
  const [pages,       setPages]       = useState(1);
  const [page,        setPage]        = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [q,           setQ]           = useState("");
  const [noteTypeF,   setNoteTypeF]   = useState("");
  const [severityF,   setSeverityF]   = useState("");
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const [confirmDel,  setConfirmDel]  = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const sp = new URLSearchParams({ page: String(page), limit: "50" });
      if (q)          sp.set("q", q);
      if (noteTypeF)  sp.set("noteType", noteTypeF);
      if (severityF)  sp.set("severity", severityF);
      const res  = await fetch(`/api/admin/reliability-notes?${sp}`);
      const data = await res.json();
      setNotes(data.notes ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } catch {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [page, q, noteTypeF, severityF]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [q, noteTypeF, severityF]);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/admin/reliability-notes/${id}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch {
      setError("Failed to delete note");
    } finally {
      setDeleting(null);
      setConfirmDel(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                ⚠️ Candidate Reliability Notes
                {total > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">{total}</span>
                )}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Private · Admin-only · Never shown to candidates or publicly
              </p>
            </div>
            <Link href="/admin/leads" className="text-xs text-gray-500 hover:text-gray-700 underline mt-1">
              ← Candidates
            </Link>
          </div>

          <div className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            🔒 Internal use only. Notes must be factual, professional, and based on documented incidents.
            Do not record personal, medical, ethnic, or nationality-based information.
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">

        {/* Add note form */}
        <AddNoteForm onAdded={load} />

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Search candidate</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Candidate name…"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Note type</label>
            <select value={noteTypeF} onChange={(e) => setNoteTypeF(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none">
              <option value="">All types</option>
              {(Object.entries(NOTE_TYPE_LABELS) as [NoteType, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Severity</label>
            <select value={severityF} onChange={(e) => setSeverityF(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none">
              <option value="">All severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          {/* Quick filters */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setSeverityF("high"); setNoteTypeF(""); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${severityF === "high" && !noteTypeF ? "bg-red-50 text-red-700 border-red-200" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
            >
              🔴 High severity
            </button>
            <button
              onClick={() => { setNoteTypeF("no_show_interview"); setSeverityF(""); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${noteTypeF === "no_show_interview" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
            >
              No-show history
            </button>
            <button
              onClick={() => { setNoteTypeF("false_cv"); setSeverityF(""); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${noteTypeF === "false_cv" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
            >
              False CV
            </button>
            {(q || noteTypeF || severityF) && (
              <button onClick={() => { setQ(""); setNoteTypeF(""); setSeverityF(""); }}
                className="text-xs text-gray-400 hover:text-gray-700 px-2">Clear ×</button>
            )}
          </div>
          <button onClick={load} className="px-4 py-1.5 text-sm font-semibold bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">↻</button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg mb-4 flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-4">×</button>
          </div>
        )}

        {/* Notes list */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-400">Loading…</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-3xl mb-3">📋</p>
              <p className="text-sm font-semibold text-gray-700">No reliability notes</p>
              <p className="text-xs text-gray-400 mt-1">
                {q || noteTypeF || severityF ? "Try clearing filters" : "Notes added here are private and admin-only"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Date", "Candidate", "Type", "Severity", "Source", "Incident date", "Note", "Actions"].map((h) => (
                      <th key={h} className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {notes.map((note) => {
                    const sev = SEVERITY_META[note.severity] ?? SEVERITY_META.medium;
                    return (
                      <tr key={note.id} className="hover:bg-gray-50/70 transition-colors">

                        {/* Date */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <p className="text-xs font-semibold text-gray-900">{fmtDate(note.createdAt)}</p>
                        </td>

                        {/* Candidate */}
                        <td className="px-3 py-3">
                          <Link
                            href={`/admin/leads/${note.leadId}`}
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600 hover:underline"
                          >
                            {note.candidateName}
                          </Link>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{note.leadId.slice(0, 8)}…</p>
                        </td>

                        {/* Type */}
                        <td className="px-3 py-3">
                          <span className="text-xs font-semibold text-gray-700">
                            {NOTE_TYPE_LABELS[note.noteType] ?? note.noteType}
                          </span>
                        </td>

                        {/* Severity */}
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                            {sev.label}
                          </span>
                        </td>

                        {/* Recruiter source */}
                        <td className="px-3 py-3">
                          <span className="text-xs text-gray-600">{note.recruiterSource ?? "—"}</span>
                        </td>

                        {/* Incident date */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className="text-xs text-gray-600">
                            {note.incidentDate ? fmtDate(note.incidentDate) : "—"}
                          </span>
                        </td>

                        {/* Note text */}
                        <td className="px-3 py-3 max-w-[240px]">
                          {note.noteText ? (
                            <p className="text-xs text-gray-700 line-clamp-2" title={note.noteText}>
                              {note.noteText}
                            </p>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-3">
                          {confirmDel === note.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-red-700 font-semibold">Delete?</span>
                              <button
                                onClick={() => handleDelete(note.id)}
                                disabled={deleting === note.id}
                                className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                              >
                                {deleting === note.id ? "…" : "Yes"}
                              </button>
                              <button
                                onClick={() => setConfirmDel(null)}
                                className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDel(note.id)}
                              className="px-2 py-1 text-[10px] border border-red-200 text-red-500 rounded hover:bg-red-50 hover:border-red-400 transition"
                              title="Delete note"
                            >
                              🗑
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-500">Page {page} of {pages} · {total} notes</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition">← Prev</button>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition">Next →</button>
            </div>
          </div>
        )}

        <p className="text-[10px] text-gray-400 text-center mt-8">
          Private · Internal · Not visible to candidates
        </p>
      </div>
    </div>
  );
}
