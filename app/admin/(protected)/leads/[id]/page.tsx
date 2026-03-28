"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type LeadStatus =
  | "new" | "reviewed" | "waiting_for_match" | "potential_fit"
  | "agency_contact_pending" | "approved" | "sent" | "converted"
  | "confirmed" | "paid" | "rejected" | "contacted";
type LeadSourceType = "jobs_with_housing" | "job_page" | "agency_page" | "general_apply";

interface LeadSend {
  id: string; createdAt: string; agencySlug: string; agencyName: string;
  agencyEmail?: string; method: string; status: string; errorMsg?: string;
  emailSubject?: string; emailBody?: string;
}

interface LeadDetail {
  id: string; createdAt: string; updatedAt: string;
  sourcePage: string; sourceType: LeadSourceType; sourceSlug?: string; sourceLabel?: string;
  fullName: string; phone: string; email?: string; whatsappSame: boolean;
  nationality?: string; currentCountry?: string; alreadyInNL?: boolean;
  preferredWorkType?: string; preferredRegion?: string;
  accommodationNeeded?: boolean; driversLicense?: boolean; canWorkWeekends?: boolean;
  experienceLevel?: string; availableFrom?: string; notes?: string;
  status: LeadStatus; tags: string[]; assignedTo?: string;
  lastContactedAt?: string; internalNotes?: string;
  assignedAgencies: string[]; sentAt?: string;
  // Payout tracking
  confirmedAt?: string; workerStartDate?: string;
  payoutAmount?: number; paidAt?: string;
  sends?: LeadSend[];
}

interface AgencyOption { slug: string; name: string; email: string; }

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_META: Record<LeadStatus, { label: string; color: string }> = {
  new:                    { label: "New",                color: "bg-blue-100 text-blue-800 border-blue-200" },
  reviewed:               { label: "Reviewed",           color: "bg-sky-100 text-sky-800 border-sky-200" },
  waiting_for_match:      { label: "Waiting for match",  color: "bg-amber-50 text-amber-700 border-amber-200" },
  potential_fit:          { label: "Potential fit",      color: "bg-orange-100 text-orange-800 border-orange-200" },
  agency_contact_pending: { label: "Agency pending",     color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  approved:               { label: "Approved",           color: "bg-green-100 text-green-800 border-green-200" },
  sent:                   { label: "Sent",               color: "bg-purple-100 text-purple-800 border-purple-200" },
  converted:              { label: "Converted",          color: "bg-teal-100 text-teal-800 border-teal-200" },
  confirmed:              { label: "✅ Worker started",  color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  paid:                   { label: "💰 Paid",            color: "bg-green-200 text-green-900 border-green-300" },
  rejected:               { label: "Rejected",           color: "bg-red-100 text-red-700 border-red-200" },
  contacted:              { label: "Contacted (legacy)",  color: "bg-gray-100 text-gray-600 border-gray-200" },
};
const WORK_LABELS: Record<string, string> = {
  logistics: "Logistics / Warehouse", production: "Production / Factory",
  greenhouse: "Greenhouse / Agriculture", driving: "Driving / Transport",
  cleaning: "Cleaning", construction: "Construction", any: "Open to anything",
};
const EXP_LABELS: Record<string, string> = { none: "No experience", some: "Some experience", experienced: "Experienced" };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 font-medium w-36 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-900 flex-1">{value ?? <span className="text-gray-300">—</span>}</span>
    </div>
  );
}
function bool(v?: boolean): string { return v === true ? "Yes" : v === false ? "No" : "—"; }
function fmtDT(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Send Modal ───────────────────────────────────────────────────────────────
function SendModal({
  leadId, onClose, onSent,
}: { leadId: string; onClose: () => void; onSent: () => void }) {
  const [agencies, setAgencies]         = useState<AgencyOption[]>([]);
  const [selected, setSelected]         = useState<Set<string>>(new Set());
  const [customEmail, setCustomEmail]   = useState("");
  const [customName, setCustomName]     = useState("");
  const [sending, setSending]           = useState(false);
  const [result, setResult]             = useState<{ ok: boolean; results: Array<{ agencyName: string; ok: boolean; pending?: boolean; error?: string }> } | null>(null);
  const [loadingAgencies, setLoadingAgencies] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/leads/${leadId}/send`)
      .then((r) => r.json())
      .then((d) => { setAgencies(d.agencies ?? []); })
      .catch(() => {})
      .finally(() => setLoadingAgencies(false));
  }, [leadId]);

  function toggleAgency(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  }

  async function handleSend() {
    setSending(true);
    try {
      const selectedAgencies = agencies.filter((a) => selected.has(a.slug));
      if (customEmail.trim() && customName.trim()) {
        selectedAgencies.push({ slug: "custom", name: customName.trim(), email: customEmail.trim() });
      }
      if (selectedAgencies.length === 0) return;
      const res = await fetch(`/api/admin/leads/${leadId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agencies: selectedAgencies }),
      });
      const data = await res.json();
      setResult(data);
      if (data.ok || data.results?.some((r: { ok: boolean }) => r.ok)) {
        onSent();
      }
    } catch { setResult({ ok: false, results: [{ agencyName: "?", ok: false, error: "Network error" }] }); }
    finally { setSending(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <style>{`@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <div className="relative z-10 w-full sm:max-w-lg mx-0 sm:mx-4 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]" style={{animation:"slideUp .3s ease"}}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-bold text-gray-900 text-base">Send lead to agency</h2>
            <p className="text-xs text-gray-500 mt-0.5">Select one or more agencies to forward this lead to</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4">
          {result ? (
            <div className="space-y-3">
              {result.results.map((r, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${r.ok ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <span className="text-xl">{r.ok ? "✅" : "❌"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{r.agencyName}</p>
                    {r.pending && <p className="text-xs text-amber-600">Email queued for manual send — no email provider configured</p>}
                    {r.error && !r.pending && <p className="text-xs text-red-600">{r.error}</p>}
                    {r.ok && !r.pending && <p className="text-xs text-green-600">Email sent successfully</p>}
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500 text-center pt-2">
                Set <code className="bg-gray-100 px-1 rounded">RESEND_API_KEY</code> in your env to enable automatic email delivery.
              </p>
            </div>
          ) : (
            <>
              {loadingAgencies ? (
                <p className="text-sm text-gray-400 text-center py-8">Loading agencies…</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {agencies.length === 0 && (
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      No agency emails configured. Add <code>AGENCY_EMAIL_HOBIJ=jobs@hobij.nl</code> etc. to your env, or use the custom email below.
                    </p>
                  )}
                  {agencies.map((a) => (
                    <label key={a.slug} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${selected.has(a.slug) ? "bg-brand-50 border-brand-300" : "border-gray-200 hover:border-gray-300"}`}>
                      <input type="checkbox" checked={selected.has(a.slug)} onChange={() => toggleAgency(a.slug)} className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                        <p className="text-xs text-gray-500 truncate">{a.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Or send to a custom email</p>
                <div className="space-y-2">
                  <input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Agency name" className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <input value={customEmail} onChange={(e) => setCustomEmail(e.target.value)} placeholder="agency@example.com" type="email" className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-5 pb-5 pt-3 border-t border-gray-100 shrink-0">
          {result ? (
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition">Done</button>
          ) : (
            <button
              onClick={handleSend}
              disabled={sending || (selected.size === 0 && (!customEmail.trim() || !customName.trim()))}
              className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {sending ? "Sending…" : `Send to ${selected.size + (customEmail.trim() && customName.trim() ? 1 : 0)} agenc${selected.size === 1 && !customEmail.trim() ? "y" : "ies"}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LeadDetailPage() {
  const params   = useParams<{ id: string }>();
  const router   = useRouter();
  const [lead, setLead]           = useState<LeadDetail | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [status, setStatus]       = useState<LeadStatus>("new");
  const [internalNotes, setNotes] = useState("");
  const [assignedTo, setAssignTo] = useState("");
  const [newTag, setNewTag]       = useState("");
  const [tags, setTags]           = useState<string[]>([]);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [saveErr, setSaveErr]     = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionErr, setActionErr] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showEmailBody, setShowEmailBody] = useState<LeadSend | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState<"confirm" | "pay" | null>(null);
  const [payoutInput, setPayoutInput]     = useState("");

  const loadLead = useCallback(async () => {
    if (!params?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${params.id}`);
      if (res.status === 401) { window.location.href = "/admin/login"; return; }
      if (!res.ok) { setError("Lead not found"); setLoading(false); return; }
      const data: LeadDetail = await res.json();
      setLead(data); setStatus(data.status); setNotes(data.internalNotes ?? "");
      setAssignTo(data.assignedTo ?? ""); setTags(data.tags ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed to load"); }
    finally { setLoading(false); }
  }, [params?.id]);

  useEffect(() => { loadLead(); }, [loadLead]);

  async function handleSave() {
    if (!params?.id) return;
    setSaving(true); setSaveErr(null); setSaved(false);
    try {
      const res = await fetch(`/api/admin/leads/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNotes, assignedTo, tags }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch { setSaveErr("Save failed. Try again."); }
    finally { setSaving(false); }
  }

  async function singleAction(action: "approve" | "reject") {
    if (!params?.id) return;
    setActionBusy(true); setActionErr(null);
    try {
      const res = await fetch(`/api/admin/leads/${params.id}/${action}`, { method: "POST" });
      if (!res.ok) throw new Error(`${action} failed`);
      const data = await res.json();
      setStatus(data.status);
      setLead((prev) => prev ? { ...prev, status: data.status } : prev);
    } catch { setActionErr(`Failed to ${action} lead`); }
    finally { setActionBusy(false); }
  }

  async function handlePayout(mode: "confirm" | "pay") {
    if (!params?.id) return;
    setActionBusy(true); setActionErr(null);
    try {
      const body: Record<string, unknown> = {};
      const amount = parseFloat(payoutInput);
      if (!isNaN(amount) && amount > 0) body.payoutAmount = amount;
      const res = await fetch(`/api/admin/leads/${params.id}/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`${mode} failed`);
      const data = await res.json();
      setStatus(data.status);
      setLead((prev) => prev ? { ...prev, status: data.status } : prev);
      setShowPayoutModal(null);
      setPayoutInput("");
      await loadLead();
    } catch { setActionErr(`Failed to ${mode} lead`); }
    finally { setActionBusy(false); }
  }

  async function markWaiting() {
    if (!params?.id) return;
    setActionBusy(true); setActionErr(null);
    try {
      const res = await fetch(`/api/admin/leads/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "waiting_for_match" }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("waiting_for_match");
      setLead((prev) => prev ? { ...prev, status: "waiting_for_match" } : prev);
    } catch { setActionErr("Failed to update status"); }
    finally { setActionBusy(false); }
  }

  function addTag() {
    const t = newTag.trim().toLowerCase().replace(/\s+/g, "_").slice(0, 40);
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setNewTag("");
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !lead) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <p className="text-red-500 text-sm font-semibold">{error ?? "Lead not found"}</p>
      <Link href="/admin/leads" className="text-brand-600 text-sm hover:underline">← Back to leads</Link>
    </div>
  );

  const sm = STATUS_META[status] ?? STATUS_META.new;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-14 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/leads" className="text-gray-400 hover:text-brand-600 text-xs shrink-0">← Leads</Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-base font-bold text-gray-900 truncate">{lead.fullName}</h1>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${sm.color}`}>{STATUS_META[status].label}</span>
          </div>
          <div className="flex items-center gap-2">
            {saved && <span className="text-green-600 text-xs font-semibold flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Saved</span>}
            {saveErr && <span className="text-red-500 text-xs">{saveErr}</span>}
            <button onClick={handleSave} disabled={saving} className="px-4 py-1.5 text-sm font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-60 transition">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: lead info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Action bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Quick actions</p>
            {actionErr && <p className="text-xs text-red-500 mb-2">{actionErr}</p>}
            <div className="flex flex-wrap gap-2">
              {/* Approve / Reject — available on all pre-terminal statuses */}
              {!["approved","sent","converted","rejected"].includes(status) && (
                <button onClick={() => singleAction("approve")} disabled={actionBusy} className="px-4 py-2 text-sm font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition">
                  ✓ Approve
                </button>
              )}
              {!["approved","sent","converted","rejected"].includes(status) && (
                <button onClick={() => singleAction("reject")} disabled={actionBusy} className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 transition">
                  ✗ Reject
                </button>
              )}
              {/* Move to waiting pool */}
              {["new","reviewed","potential_fit"].includes(status) && (
                <button onClick={markWaiting} disabled={actionBusy} className="px-4 py-2 text-sm font-bold bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition">
                  ⏳ Move to waiting list
                </button>
              )}
              {/* Send to agency — only after approval */}
              {status === "approved" && (
                <button onClick={() => setShowSendModal(true)} disabled={actionBusy} className="px-4 py-2 text-sm font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition">
                  📤 Send to agency
                </button>
              )}
              {status === "sent" && (
                <button onClick={() => setShowSendModal(true)} className="px-4 py-2 text-sm font-bold border border-purple-300 text-purple-700 rounded-xl hover:bg-purple-50 transition">
                  📤 Send to another agency
                </button>
              )}
              {/* Payout actions — available after sent */}
              {["sent","converted"].includes(status) && (
                <button onClick={() => setShowPayoutModal("confirm")} disabled={actionBusy} className="px-4 py-2 text-sm font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition">
                  ✅ Worker started
                </button>
              )}
              {status === "confirmed" && (
                <button onClick={() => setShowPayoutModal("pay")} disabled={actionBusy} className="px-4 py-2 text-sm font-bold bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 disabled:opacity-50 transition">
                  💰 Mark as Paid
                </button>
              )}
            </div>
            {lead.assignedAgencies?.length > 0 && (
              <p className="text-xs text-gray-500 mt-3">Sent to: {lead.assignedAgencies.join(", ")} {lead.sentAt ? `· ${fmtDT(lead.sentAt)}` : ""}</p>
            )}
          </div>

          {/* Contact */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Contact</h2>
            <InfoRow label="Full name" value={lead.fullName} />
            <InfoRow label="Phone" value={<a href={`tel:${lead.phone}`} className="text-brand-600 hover:underline font-medium">{lead.phone}</a>} />
            <InfoRow label="Email" value={lead.email ? <a href={`mailto:${lead.email}`} className="text-brand-600 hover:underline">{lead.email}</a> : undefined} />
            <InfoRow label="WhatsApp same?" value={bool(lead.whatsappSame)} />
          </div>

          {/* Background */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Background</h2>
            <InfoRow label="Nationality"     value={lead.nationality} />
            <InfoRow label="Current country" value={lead.currentCountry} />
            <InfoRow label="Already in NL?"  value={bool(lead.alreadyInNL)} />
          </div>

          {/* Preferences */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Job preferences</h2>
            <InfoRow label="Work type"         value={lead.preferredWorkType ? (WORK_LABELS[lead.preferredWorkType] ?? lead.preferredWorkType) : undefined} />
            <InfoRow label="Region"            value={lead.preferredRegion} />
            <InfoRow label="Needs housing"     value={lead.accommodationNeeded === true ? <span className="text-green-700 font-semibold">🏠 Yes</span> : bool(lead.accommodationNeeded)} />
            <InfoRow label="Driver's license"  value={bool(lead.driversLicense)} />
            <InfoRow label="Can work weekends" value={bool(lead.canWorkWeekends)} />
            <InfoRow label="Experience"        value={lead.experienceLevel ? (EXP_LABELS[lead.experienceLevel] ?? lead.experienceLevel) : undefined} />
            <InfoRow label="Available from"    value={lead.availableFrom ? fmtDT(lead.availableFrom).split(",")[0] : undefined} />
            {lead.notes && (
              <div className="pt-3 mt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400 font-medium mb-1">Notes from applicant</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* Source */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Source</h2>
            <InfoRow label="Page"         value={<code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{lead.sourcePage}</code>} />
            <InfoRow label="Type"         value={lead.sourceType.replace(/_/g, " ")} />
            <InfoRow label="Label"        value={lead.sourceLabel} />
            <InfoRow label="Slug"         value={lead.sourceSlug} />
            <InfoRow label="Submitted"    value={fmtDT(lead.createdAt)} />
            <InfoRow label="Last updated" value={fmtDT(lead.updatedAt)} />
            {lead.lastContactedAt && <InfoRow label="Last contacted" value={fmtDT(lead.lastContactedAt)} />}
          </div>

          {/* Payout tracking */}
          {(lead.confirmedAt || lead.paidAt || lead.payoutAmount != null) && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-4">💰 Payout tracking</h2>
              {lead.confirmedAt   && <InfoRow label="Worker confirmed" value={<span className="text-emerald-700 font-semibold">{fmtDT(lead.confirmedAt)}</span>} />}
              {lead.workerStartDate && <InfoRow label="Start date" value={fmtDT(lead.workerStartDate)} />}
              {lead.payoutAmount != null && <InfoRow label="Payout amount" value={<span className="font-bold text-gray-900">€{lead.payoutAmount.toFixed(2)}</span>} />}
              {lead.paidAt        && <InfoRow label="Paid at" value={<span className="text-yellow-700 font-semibold">{fmtDT(lead.paidAt)}</span>} />}
            </div>
          )}

          {/* Send history */}
          {lead.sends && lead.sends.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Send history ({lead.sends.length})</h2>
              <div className="space-y-3">
                {lead.sends.map((s) => (
                  <div key={s.id} className={`flex items-start gap-3 p-3 rounded-xl border ${s.status === "sent" ? "bg-green-50 border-green-100" : s.status === "pending" ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"}`}>
                    <span className="text-base mt-0.5">{s.status === "sent" ? "✅" : s.status === "pending" ? "⏳" : "❌"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">{s.agencyName}</p>
                        <span className="text-[10px] text-gray-400 shrink-0">{fmtDT(s.createdAt)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{s.agencyEmail ?? "—"} · via {s.method}</p>
                      {s.errorMsg && <p className="text-xs text-red-500 mt-0.5">{s.errorMsg}</p>}
                      {s.emailSubject && (
                        <button onClick={() => setShowEmailBody(showEmailBody?.id === s.id ? null : s)} className="text-[11px] text-brand-600 hover:underline mt-1">
                          {showEmailBody?.id === s.id ? "Hide email" : "View email content"}
                        </button>
                      )}
                      {showEmailBody?.id === s.id && s.emailBody && (
                        <pre className="mt-2 text-[10px] text-gray-600 bg-white border border-gray-200 rounded-lg p-3 max-h-40 overflow-auto whitespace-pre-wrap">{s.emailBody}</pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: CRM panel */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Status</h2>
            <div className="space-y-1.5">
              {(Object.keys(STATUS_META) as LeadStatus[]).map((s) => {
                const m = STATUS_META[s]; const active = status === s;
                return (
                  <label key={s} className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition ${active ? `${m.color} shadow-sm` : "border-gray-100 hover:border-gray-300"}`}>
                    <input type="radio" name="status" value={s} checked={active} onChange={() => setStatus(s)} className="sr-only" />
                    <span className="flex-1 text-xs font-semibold">{m.label}</span>
                    {active && <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Assigned to */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Assigned to</h2>
            <input value={assignedTo} onChange={(e) => setAssignTo(e.target.value)} placeholder="Name or email…" className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>

          {/* Tags */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Tags</h2>
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-[11px] font-medium bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                  {tag}<button onClick={() => setTags((prev) => prev.filter((t) => t !== tag))} className="text-gray-400 hover:text-red-500 transition">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="Add tag…" className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <button type="button" onClick={addTag} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition">Add</button>
            </div>
          </div>

          {/* Internal notes */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Internal notes</h2>
            <textarea value={internalNotes} onChange={(e) => setNotes(e.target.value)} placeholder="Team notes — not visible to applicant…" rows={5} className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            <p className="text-[10px] text-gray-400 mt-1">Not visible to the applicant</p>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 disabled:opacity-60 transition shadow-sm">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {/* Send modal */}
      {showSendModal && (
        <SendModal
          leadId={lead.id}
          onClose={() => setShowSendModal(false)}
          onSent={() => { setShowSendModal(false); loadLead(); }}
        />
      )}

      {/* Payout modal — confirm worker started / mark as paid */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPayoutModal(null)} />
          <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="font-bold text-gray-900 text-base mb-1">
              {showPayoutModal === "confirm" ? "✅ Confirm worker started" : "💰 Mark as paid"}
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              {showPayoutModal === "confirm"
                ? `${lead.fullName} has started working at the agency.`
                : `Payment received for ${lead.fullName}.`}
            </p>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              {showPayoutModal === "confirm" ? "Agreed payout amount (€)" : "Received payout amount (€)"}
              <span className="font-normal text-gray-400 ml-1">— optional</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={payoutInput}
              onChange={(e) => setPayoutInput(e.target.value)}
              placeholder="e.g. 150"
              className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 mb-4"
            />
            {actionErr && <p className="text-xs text-red-500 mb-3">{actionErr}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => { setShowPayoutModal(null); setPayoutInput(""); setActionErr(null); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePayout(showPayoutModal)}
                disabled={actionBusy}
                className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50 transition
                  ${showPayoutModal === "confirm" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-yellow-500 hover:bg-yellow-600"}`}
              >
                {actionBusy ? "Saving…" : showPayoutModal === "confirm" ? "Confirm" : "Mark paid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
