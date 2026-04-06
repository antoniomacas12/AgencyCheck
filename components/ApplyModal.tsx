"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { stripLocalePrefix, useT } from "@/lib/i18n";
import type { HousingPreference } from "./HousingChoiceModal";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApplyContext = {
  /** Full page path, e.g. "/jobs-with-accommodation" */
  sourcePage: string;
  /** Which kind of page triggered the form */
  sourceType: "jobs_with_housing" | "job_page" | "agency_page" | "general_apply";
  /** Agency or job slug, if available */
  sourceSlug?: string;
  /** Human-readable label shown in admin, e.g. "HOBIJ agency page" */
  sourceLabel?: string;
  /** Pre-fill the accommodation checkbox */
  defaultAccommodation?: boolean;
};

interface ApplyModalProps {
  context: ApplyContext;
  onClose: () => void;
  /** Housing preference pre-selected by the user in the choice step */
  housingPreference?: HousingPreference;
}

// ─── Form data ────────────────────────────────────────────────────────────────

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  whatsappSame: boolean;
  nationality: string;
  currentCountry: string;
  alreadyInNL: string;       // "yes" | "no" | ""  — REQUIRED
  preferredWorkType: string;
  accommodationNeeded: string; // "yes" | "no" | ""  — REQUIRED
  driversLicense: string;    // "yes" | "no" | ""
  experienceLevel: string;
  whenCanStart: string;      // "immediately" | "1_week" | "2_weeks" | "1_month" | "" — REQUIRED
  notes: string;
};

const EMPTY_FORM: FormData = {
  fullName: "",
  phone: "",
  email: "",
  whatsappSame: false,
  nationality: "",
  currentCountry: "",
  alreadyInNL: "",
  preferredWorkType: "",
  accommodationNeeded: "",
  driversLicense: "",
  experienceLevel: "",
  whenCanStart: "",
  notes: "",
};

// Work type keys — labels are translated via t("apply_modal.work_<value>")
const WORK_TYPE_KEYS = [
  "logistics", "production", "greenhouse", "driving", "cleaning", "construction", "any",
] as const;

// "When can you start?" options — stored as availability in DB
const WHEN_CAN_START_OPTS = [
  { label: "⚡ Immediately",     value: "immediately" },
  { label: "📅 Within 1 week",   value: "1_week"      },
  { label: "🗓 Within 2 weeks",  value: "2_weeks"     },
  { label: "📆 1 month+",        value: "1_month"     },
] as const;

// ─── Field component helpers ──────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ fontSize: "16px" }}
        className={`w-full text-sm text-gray-900 px-3 py-3 rounded-lg border bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition min-h-[44px]
          ${error ? "border-red-400 focus:ring-red-400" : "border-gray-200"}`}
      />
      {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ fontSize: "16px" }}
      className="w-full text-sm text-gray-900 px-3 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition appearance-none min-h-[44px]"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
}

function YesNo({
  value,
  onChange,
  labels,
}: {
  value: string;
  onChange: (v: string) => void;
  labels: [string, string];
}) {
  return (
    <div className="flex gap-2">
      {(["yes", "no"] as const).map((v, i) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(value === v ? "" : v)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition
            ${value === v
              ? "bg-brand-600 text-white border-brand-600 shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
            }`}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
}

// ─── Qualification step helpers (module-level — avoids function-in-conditional) ──

type QOpt = { label: string; value: string };

const Q1_OPTS: QOpt[] = [
  { label: "🇳🇱 Already in the Netherlands", value: "nl" },
  { label: "✈️ EU / Ready to relocate",       value: "relocate" },
  { label: "🌍 Outside EU / Not sure yet",    value: "exploring" },
];
const Q2_OPTS: QOpt[] = [
  { label: "Yes — I have a BSN",         value: "has_bsn" },
  { label: "Worked before (no BSN now)", value: "worked_before" },
  { label: "Never worked in NL",         value: "no" },
];
const Q3_OPTS: QOpt[] = [
  { label: "⚡ This week",      value: "immediately" },
  { label: "📅 1–2 weeks",      value: "1_2_weeks"  },
  { label: "🗓 Within a month", value: "1_month"    },
  { label: "👀 Just exploring", value: "exploring"  },
];
const Q4_OPTS: QOpt[] = [
  { label: "Yes, I have NL experience", value: "yes" },
  { label: "No, this would be first time", value: "no" },
];

function QGroup({
  label, opts, value, onChange, required, showErr,
}: {
  label: string;
  opts: QOpt[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  showErr?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {showErr && !value && (
          <span className="text-red-500 text-[11px] ml-2">Please select one</span>
        )}
      </p>
      <div className="flex flex-col gap-1.5">
        {opts.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(value === o.value ? "" : o.value)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm border transition font-medium
              ${value === o.value
                ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:bg-brand-50"
              }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function ApplyModal({ context, onClose, housingPreference }: ApplyModalProps) {
  // ── Locale detection ───────────────────────────────────────────────────────
  const pathname = usePathname();
  const { locale } = stripLocalePrefix(pathname);
  const t = useT(locale);

  // Derive accommodationNeeded from housingPreference if provided, otherwise from context flag
  const initialAccommodation =
    housingPreference === "with_housing" ? "yes" :
    housingPreference === "no_housing"   ? "no"  :
    context.defaultAccommodation         ? "yes"  : "";

  const [form, setForm] = useState<FormData>({
    ...EMPTY_FORM,
    accommodationNeeded: initialAccommodation,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // step: "form" → "qualify" (post-submit follow-up) → "done" (final success)
  const [step, setStep] = useState<"form" | "qualify" | "done">("form");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [qualify, setQualify] = useState({ q1: "", q2: "", q3: "", q4: "" });
  const [qualifyErr, setQualifyErr] = useState(false); // true if Q1/Q3 not answered on submit attempt
  const [qualifying, setQualifying] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const set = useCallback(
    <K extends keyof FormData>(key: K, val: FormData[K]) =>
      setForm((f) => ({ ...f, [key]: val })),
    []
  );

  // Escape key & body scroll lock
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );
  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  // ── Validation ─────────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};

    // Name — required
    if (!form.fullName.trim()) errs.fullName = t("apply_modal.error_name_required");

    // Contact — at least phone OR email required
    const hasPhone = form.phone.trim().length > 0;
    const hasEmail = form.email.trim().length > 0;
    if (!hasPhone && !hasEmail) {
      errs.phone = "Please enter at least a phone number or email address";
    } else {
      if (hasPhone && !/^\+?[\d\s\-().]{6,20}$/.test(form.phone.trim()))
        errs.phone = t("apply_modal.error_phone_invalid");
      if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
        errs.email = t("apply_modal.error_email_invalid");
    }

    // Required selects
    if (!form.alreadyInNL)       errs.alreadyInNL       = "Please select an option";
    if (!form.accommodationNeeded) errs.accommodationNeeded = "Please select an option";
    if (!form.whenCanStart)      errs.whenCanStart      = "Please select when you can start";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setFormError(null);
    if (!validate()) return;

    console.log("[ApplyModal] apply submit started");

    // ── OPTIMISTIC: show qualify step immediately so user never waits ──────────
    // The lead save happens in the background; leadId is updated when it resolves.
    setStep("qualify");

    // ── Save lead in background ────────────────────────────────────────────────
    setSubmitting(true);
    try {
      const payload = {
        sourcePage:  context.sourcePage,
        sourceType:  context.sourceType,
        sourceSlug:  context.sourceSlug,
        sourceLabel: context.sourceLabel,
        housingPreference: housingPreference ?? undefined,
        fullName:     form.fullName.trim(),
        phone:        form.phone.trim() || undefined,
        email:        form.email.trim() || undefined,
        whatsappSame: form.whatsappSame,
        nationality:    form.nationality || undefined,
        currentCountry: form.currentCountry || undefined,
        alreadyInNL:    form.alreadyInNL === "yes" ? true : form.alreadyInNL === "no" ? false : undefined,
        preferredWorkType:  form.preferredWorkType || undefined,
        accommodationNeeded: form.accommodationNeeded === "yes" ? true : form.accommodationNeeded === "no" ? false : undefined,
        driversLicense:     form.driversLicense === "yes" ? true : form.driversLicense === "no" ? false : undefined,
        experienceLevel:    form.experienceLevel || undefined,
        whenCanStart:       form.whenCanStart    || undefined,
        notes:              form.notes.trim()    || undefined,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: Record<string, unknown> = {};
      try { data = await res.json(); } catch { /* ignore */ }

      const returnedId = res.ok && typeof data.id === "string" ? data.id : null;
      console.log("[ApplyModal] apply submit success, id =", returnedId);
      setLeadId(returnedId);
    } catch (err) {
      console.error("[ApplyModal] submit error (lead still shown qualify step):", err);
      // Don't show form error — user already sees qualify step
    } finally {
      setSubmitting(false);
    }
  }

  // ── Qualify submit ─────────────────────────────────────────────────────────
  async function handleQualify() {
    if (qualifying) return;
    // Q1 (locationStatus) and Q3 (availability) are required
    if (!qualify.q1 || !qualify.q3) {
      setQualifyErr(true);
      return;
    }
    setQualifyErr(false);
    setQualifying(true);
    const payload = {
      locationStatus: qualify.q1,
      q2_bsn:         qualify.q2 || undefined,
      availability:   qualify.q3,
      q4_experience:  qualify.q4 || undefined,
    };
    console.log("[ApplyModal] sending qualify payload:", payload, "leadId:", leadId);
    try {
      if (leadId && !leadId.startsWith("fallback-")) {
        const res = await fetch(`/api/leads/${leadId}/qualify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json().catch(() => ({}));
        console.log("[ApplyModal] qualify response:", res.status, result);
      } else {
        // Fallback id or no id — log answers, cannot persist to DB
        console.warn("[ApplyModal] qualify skipped (fallback/no leadId), answers:", payload);
      }
    } catch (err) {
      console.error("[ApplyModal] qualify fetch error:", err);
      // Silently ignore — the main lead record is already saved
    } finally {
      setQualifying(false);
      setStep("done");
    }
  }

  // ─── Single return — outer overlay never unmounts, only inner panel swaps ────
  // Using conditional rendering with keys so each step mounts fresh (triggers
  // the slide-up animation) without remounting the backdrop/overlay.

  const yesNoLabels: [string, string] = [t("apply_modal.yes"), t("apply_modal.no")];

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      {/* Backdrop — always present */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <style>{`@keyframes applySlideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* ── Qualify panel ──────────────────────────────────────────────────── */}
      {step === "qualify" && (
        <div
          key="qualify"
          className="relative z-10 w-full sm:max-w-md mx-0 sm:mx-4 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ animation: "applySlideUp .3s ease", maxHeight: "92vh" }}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-600 mb-0.5">Step 2 of 2</p>
                <h2 className="text-base font-bold text-gray-900">Quick follow-up</h2>
                <p className="text-xs text-gray-500 mt-0.5">Helps us find the right match — 30 seconds</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Questions */}
          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
            <QGroup
              label="Where are you currently based?"
              opts={Q1_OPTS}
              value={qualify.q1}
              onChange={(v) => setQualify((q) => ({ ...q, q1: v }))}
              required
              showErr={qualifyErr}
            />
            <QGroup
              label="Do you have a BSN number?"
              opts={Q2_OPTS}
              value={qualify.q2}
              onChange={(v) => setQualify((q) => ({ ...q, q2: v }))}
            />
            <QGroup
              label="When can you start?"
              opts={Q3_OPTS}
              value={qualify.q3}
              onChange={(v) => setQualify((q) => ({ ...q, q3: v }))}
              required
              showErr={qualifyErr}
            />
            <QGroup
              label="Previous work experience in the Netherlands?"
              opts={Q4_OPTS}
              value={qualify.q4}
              onChange={(v) => setQualify((q) => ({ ...q, q4: v }))}
            />
          </div>

          {/* Footer */}
          <div className="px-5 pt-3 pb-5 border-t border-gray-100 shrink-0 bg-white flex flex-col gap-2">
            <button
              type="button"
              onClick={handleQualify}
              disabled={qualifying}
              className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {qualifying ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Saving…
                </span>
              ) : "Submit answers →"}
            </button>
            <button
              type="button"
              onClick={() => setStep("done")}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1.5 transition"
            >
              Skip this step
            </button>
          </div>
        </div>
      )}

      {/* ── Done panel ─────────────────────────────────────────────────────── */}
      {step === "done" && (
        <div
          key="done"
          className="relative z-10 w-full sm:max-w-md mx-4 sm:mx-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-8 text-center"
          style={{ animation: "applySlideUp .3s ease" }}
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t("apply_modal.success_title")}</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            {t("apply_modal.success_body")}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition"
          >
            {t("apply_modal.success_close")}
          </button>
        </div>
      )}

      {/* ── Form panel ─────────────────────────────────────────────────────── */}
      {step === "form" && (
        <div
          key="form"
          ref={panelRef}
          className="relative z-10 w-full sm:max-w-lg mx-0 sm:mx-4 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
          style={{ animation: "applySlideUp .3s ease", maxHeight: "92vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h2 className="text-base font-bold text-gray-900">{t("apply_modal.heading")}</h2>
                {housingPreference && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    housingPreference === "with_housing"
                      ? "bg-brand-100 text-brand-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {housingPreference === "with_housing"
                      ? t("apply_modal.badge_with_housing")
                      : t("apply_modal.badge_no_housing")}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{t("apply_modal.subtitle")}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              aria-label={t("apply_modal.success_close")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable form body */}
          <form id="apply-form" onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

            {/* ── Contact ── */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                {t("apply_modal.section_contact")}
              </p>

              <div>
                <Label required>{t("apply_modal.label_name")}</Label>
                <Input
                  value={form.fullName}
                  onChange={(v) => set("fullName", v)}
                  placeholder={t("apply_modal.placeholder_name")}
                  error={errors.fullName}
                />
              </div>

              {/* Phone + Email — at least ONE is required */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-3">
                <p className="text-[11px] font-semibold text-gray-500">
                  Phone or Email <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">— at least one required</span>
                </p>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t("apply_modal.label_phone")}
                  </label>
                  <Input
                    value={form.phone}
                    onChange={(v) => set("phone", v)}
                    placeholder="+48 123 456 789"
                    type="tel"
                    error={errors.phone}
                  />
                  {form.phone && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <input
                        id="whatsapp-same"
                        type="checkbox"
                        checked={form.whatsappSame}
                        onChange={(e) => set("whatsappSame", e.target.checked)}
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <label htmlFor="whatsapp-same" className="text-xs text-gray-500">
                        {t("apply_modal.label_whatsapp")}
                      </label>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t("apply_modal.label_email")}
                  </label>
                  <Input
                    value={form.email}
                    onChange={(v) => set("email", v)}
                    placeholder={t("apply_modal.placeholder_email")}
                    type="email"
                    error={errors.email}
                  />
                </div>
              </div>
            </div>

            {/* ── Background ── */}
            <div className="space-y-3 pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                {t("apply_modal.section_background")}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t("apply_modal.label_nationality")}</Label>
                  <Input
                    value={form.nationality}
                    onChange={(v) => set("nationality", v)}
                    placeholder={t("apply_modal.placeholder_nationality")}
                  />
                </div>
                <div>
                  <Label>{t("apply_modal.label_current_country")}</Label>
                  <Input
                    value={form.currentCountry}
                    onChange={(v) => set("currentCountry", v)}
                    placeholder={t("apply_modal.placeholder_current_country")}
                  />
                </div>
              </div>

              <div>
                <Label required>{t("apply_modal.label_already_nl")}</Label>
                <YesNo value={form.alreadyInNL} onChange={(v) => set("alreadyInNL", v)} labels={yesNoLabels} />
                {errors.alreadyInNL && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.alreadyInNL}</p>
                )}
              </div>
            </div>

            {/* ── Job preferences ── */}
            <div className="space-y-3 pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                {t("apply_modal.section_preferences")}
              </p>

              <div>
                <Label>{t("apply_modal.label_work_type")}</Label>
                <Select
                  value={form.preferredWorkType}
                  onChange={(v) => set("preferredWorkType", v)}
                  placeholder={t("apply_modal.placeholder_work_type")}
                >
                  {WORK_TYPE_KEYS.map((key) => (
                    <option key={key} value={key}>{t(`apply_modal.work_${key}`)}</option>
                  ))}
                </Select>
              </div>

              {/* Accommodation — REQUIRED */}
              <div>
                <Label required>{t("apply_modal.label_accommodation")}</Label>
                <YesNo
                  value={form.accommodationNeeded}
                  onChange={(v) => set("accommodationNeeded", v)}
                  labels={yesNoLabels}
                />
                {errors.accommodationNeeded && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.accommodationNeeded}</p>
                )}
              </div>

              {/* When can you start? — REQUIRED */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  When can you start? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {WHEN_CAN_START_OPTS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set("whenCanStart", form.whenCanStart === opt.value ? "" : opt.value)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-medium border transition text-center
                        ${form.whenCanStart === opt.value
                          ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:bg-brand-50"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {errors.whenCanStart && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.whenCanStart}</p>
                )}
              </div>

              <div>
                <Label>{t("apply_modal.label_drivers_license")}</Label>
                <YesNo value={form.driversLicense} onChange={(v) => set("driversLicense", v)} labels={yesNoLabels} />
              </div>

              <div>
                <Label>{t("apply_modal.label_experience")}</Label>
                <div className="flex gap-2">
                  {(["none", "some", "experienced"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => set("experienceLevel", form.experienceLevel === lvl ? "" : lvl)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition
                        ${form.experienceLevel === lvl
                          ? "bg-brand-600 text-white border-brand-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
                        }`}
                    >
                      {t(`apply_modal.exp_${lvl}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Notes ── */}
            <div className="pt-1">
              <Label>
                {t("apply_modal.label_notes")}{" "}
                <span className="text-gray-400 font-normal">{t("apply_modal.label_notes_optional")}</span>
              </Label>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder={t("apply_modal.placeholder_notes")}
                rows={3}
                maxLength={800}
                style={{ fontSize: "16px" }}
                className="w-full text-sm text-gray-900 px-3 py-3 rounded-lg border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none"
              />
            </div>

            {/* Trust line */}
            <p className="text-[11px] text-gray-400 text-center pb-1">
              {t("apply_modal.privacy_note")}
            </p>
          </form>

          {/* Footer CTA */}
          <div className="px-5 pt-3 pb-5 border-t border-gray-100 shrink-0 bg-white rounded-b-2xl">
            {formError && (
              <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                <svg className="h-4 w-4 text-red-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-red-700 font-medium">{formError}</p>
              </div>
            )}
            <button
              type="submit"
              form="apply-form"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  {t("apply_modal.submitting")}
                </span>
              ) : (
                t("apply_modal.submit")
              )}
            </button>
            <p className="text-[11px] text-gray-400 text-center mt-2">
              {t("apply_modal.submit_subtext")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
