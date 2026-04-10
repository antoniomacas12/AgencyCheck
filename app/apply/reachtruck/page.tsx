"use client";

/**
 * /apply/reachtruck — Reachtruck Driver job application landing page
 *
 * Qualification rules (mirrored server-side in /api/apply/reachtruck/route.ts):
 *   EU right to work  → required
 *   Reachtruck years  → ≥ 3
 *   Driver's license  → required
 *   English level     → B1, B2, C1, or C2
 *
 * ANALYTICS EVENTS (fired via @vercel/analytics track()):
 *   reachtruck_apply_viewed     — on mount
 *   reachtruck_apply_started    — on first field interaction
 *   reachtruck_apply_submitted  — on form submit attempt (after client validation passes)
 *   reachtruck_apply_qualified  — server returns qualified=true
 *   reachtruck_apply_rejected   — server returns qualified=false
 */

import { useState, useRef, useEffect, useCallback, DragEvent, ChangeEvent } from "react";
import { track } from "@vercel/analytics";

// ─── Analytics helper — same pattern as RentCalculatorClient.tsx ──────────────
function fireEvent(name: string, props?: Record<string, string | number>) {
  try { track(name, props); } catch { /* non-critical */ }
}

// ─── Types ────────────────────────────────────────────────────────────────────
type FormState = "idle" | "loading" | "success" | "rejected" | "error";

interface Fields {
  fullname:         string;
  phone:            string;
  nationality:      string;
  euPassport:       string;   // "yes" | "no" | ""
  reachtruckYears:  string;
  driversLicense:   string;   // "yes" | "no" | ""
  englishLevel:     string;
  availability:     string;   // "yes" | "no" | ""
  cvFile:           File | null;
}

type FieldErrors = Partial<Record<keyof Fields, string>>;

const ENGLISH_QUALIFIED = new Set(["B1", "B2", "C1", "C2"]);

// Hard disqualifier preview — mirrors route.ts qualify()
function isHardFail(f: Fields): boolean {
  const yrs = parseInt(f.reachtruckYears, 10);
  return (
    f.euPassport      === "no" ||
    f.driversLicense  === "no" ||
    (f.reachtruckYears !== "" && !isNaN(yrs) && yrs < 3) ||
    (f.englishLevel   !== "" && !ENGLISH_QUALIFIED.has(f.englishLevel))
  );
}

// ─── Sub-component: YES / NO toggle ──────────────────────────────────────────
function YesNoToggle({
  value,
  onChange,
  hasError,
}: {
  value:    string;
  onChange: (v: string) => void;
  hasError: boolean;
}) {
  const base =
    "flex-1 py-2.5 rounded-lg border text-sm font-semibold text-center cursor-pointer " +
    "transition-all duration-150 select-none";

  const yes =
    value === "yes"
      ? "border-green-500 bg-green-50 text-green-700"
      : `border-gray-300 text-gray-600 hover:border-brand-500 hover:text-brand-700 ${hasError ? "border-red-400" : ""}`;

  const no =
    value === "no"
      ? "border-red-500 bg-red-50 text-red-700"
      : `border-gray-300 text-gray-600 hover:border-brand-500 hover:text-brand-700 ${hasError ? "border-red-400" : ""}`;

  return (
    <div className="flex gap-2">
      <button type="button" className={`${base} ${yes}`} onClick={() => onChange("yes")}>
        ✔ Yes
      </button>
      <button type="button" className={`${base} ${no}`} onClick={() => onChange("no")}>
        ✘ No
      </button>
    </div>
  );
}

// ─── Sub-component: Field wrapper with label + error ─────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label:    string;
  error?:   string;
  children: React.ReactNode;
}) {
  return (
    <div data-error={!!error} className="flex flex-col gap-1">
      <label className="text-[13px] font-semibold text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
      {error && (
        <p className="text-[12px] text-red-600 mt-0.5">{error}</p>
      )}
    </div>
  );
}

// ─── Sub-component: Requirement row ──────────────────────────────────────────
function ReqRow({
  icon,
  text,
  sub,
}: {
  icon: string;
  text: string;
  sub?: string;
}) {
  return (
    <li className="flex items-start gap-3 text-[15px]">
      <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-full bg-green-50 text-green-700 text-[11px] font-bold flex items-center justify-center">
        {icon}
      </span>
      <span>
        <strong className="font-semibold">{text}</strong>
        {sub && <span className="text-gray-500"> — {sub}</span>}
      </span>
    </li>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ReachtruckApplyPage() {
  const [formState,  setFormState]  = useState<FormState>("idle");
  const [fields,     setFields]     = useState<Fields>({
    fullname:        "",
    phone:           "",
    nationality:     "",
    euPassport:      "",
    reachtruckYears: "",
    driversLicense:  "",
    englishLevel:    "",
    availability:    "",
    cvFile:          null,
  });
  const [errors,      setErrors]      = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [hasStarted,  setHasStarted]  = useState(false);
  const [isDragging,  setIsDragging]  = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analytics: page viewed
  useEffect(() => { fireEvent("reachtruck_apply_viewed"); }, []);

  // Track first interaction
  const markStarted = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
      fireEvent("reachtruck_apply_started");
    }
  }, [hasStarted]);

  const hardFail = isHardFail(fields);

  // ── Field change helpers ──────────────────────────────────────────────────
  function setField<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
    markStarted();
  }

  function handleFileChange(file: File | null) {
    if (!file) return;
    // Client-side size check: 3 MB
    if (file.size > 3 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, cvFile: "File is too large. Maximum 3 MB." }));
      return;
    }
    setField("cvFile", file);
  }

  // ── Drag and drop ─────────────────────────────────────────────────────────
  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }
  function onDragLeave() { setIsDragging(false); }
  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0] ?? null;
    handleFileChange(file);
  }

  // ── Client validation ─────────────────────────────────────────────────────
  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!fields.fullname.trim())
      e.fullname = "Full name is required.";
    if (!fields.phone.trim() || fields.phone.trim().length < 7)
      e.phone = "Enter a valid phone number.";
    if (!fields.nationality)
      e.nationality = "Select your nationality.";
    if (!fields.euPassport)
      e.euPassport = "Please select Yes or No.";
    if (fields.reachtruckYears === "")
      e.reachtruckYears = "Enter your years of reachtruck experience.";
    if (!fields.driversLicense)
      e.driversLicense = "Please select Yes or No.";
    if (!fields.englishLevel)
      e.englishLevel = "Select your English level.";
    if (!fields.availability)
      e.availability = "Please select Yes or No.";
    if (!fields.cvFile)
      e.cvFile = "Upload your CV to continue.";
    return e;
  }

  // ── Form submit ───────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTimeout(() => {
        document
          .querySelector("[data-error='true']")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 40);
      return;
    }

    setFormState("loading");
    setServerError("");
    fireEvent("reachtruck_apply_submitted");

    const fd = new FormData();
    fd.append("fullname",         fields.fullname.trim());
    fd.append("phone",            fields.phone.trim());
    fd.append("nationality",      fields.nationality);
    fd.append("eu-passport",      fields.euPassport);
    fd.append("reachtruck-years", fields.reachtruckYears);
    fd.append("drivers-license",  fields.driversLicense);
    fd.append("english-level",    fields.englishLevel);
    fd.append("availability",     fields.availability);
    if (fields.cvFile) fd.append("cv-file", fields.cvFile);

    try {
      const res  = await fetch("/api/apply/reachtruck", { method: "POST", body: fd });
      const data = await res.json() as { ok?: boolean; qualified?: boolean; id?: string; error?: string };

      if (!res.ok || !data.ok) {
        setFormState("error");
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (data.qualified) {
        fireEvent("reachtruck_apply_qualified", { leadId: data.id ?? "" });
        setFormState("success");
      } else {
        fireEvent("reachtruck_apply_rejected",  { leadId: data.id ?? "" });
        setFormState("rejected");
      }
    } catch {
      setFormState("error");
      setServerError("Network error. Check your connection and try again.");
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <div
        className="text-white px-4 py-10 sm:py-16"
        style={{ background: "linear-gradient(135deg, #0f2a6b 0%, #1a3fa5 50%, #1d4ed8 100%)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-5">
            🇳🇱 Netherlands · Waalwijk Area · Immediate Start
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Reachtruck Drivers Needed<br />
            <span className="text-blue-300">in the Netherlands (€16.50/hour)</span>
          </h1>

          <p className="text-white/80 text-[15px] mb-7 max-w-lg">
            For experienced warehouse professionals only — minimum 3 years reachtruck
            experience required. Beginners and EPT-only operators will not be considered.
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              "💶 €16.50 gross/hr",
              "🏭 Waalwijk area",
              "🕐 2-shift rota",
              "🇪🇺 EU citizens only",
              "📋 3+ yrs experience",
            ].map(pill => (
              <span
                key={pill}
                className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[13px] font-medium"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── WARNING BANNER ────────────────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="border-l-4 border-amber-500 pl-4 text-sm text-amber-800">
            <strong className="block font-bold">⚠️ Read before applying</strong>
            This is NOT a beginner role. If you have fewer than 3 years of reachtruck
            experience, do not proceed. Unqualified applications will not receive a response.
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* ── REQUIREMENTS ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600 mb-3 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
            Requirements
          </p>
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">
            You MUST meet ALL of the following:
          </h2>
          <ul className="flex flex-col gap-3">
            <ReqRow
              icon="✓"
              text="Minimum 3 years reachtruck experience"
              sub="no exceptions — general forklift or EPT does not count"
            />
            <ReqRow
              icon="✓"
              text="Valid driver's license (category B)"
              sub="required for site access"
            />
            <ReqRow
              icon="✓"
              text="English level B1 or higher"
              sub="safety briefings and supervisor communication are in English"
            />
            <ReqRow
              icon="✓"
              text="Warehouse / logistics background"
              sub="professional environment, not just certified"
            />
            <ReqRow
              icon="✓"
              text="Willing to work 2-shift rota"
              sub="07:00–16:00 and 09:00–18:00 rotation"
            />
            <ReqRow
              icon="✓"
              text="EU citizenship or valid EU right to work"
              sub="non-EU applicants cannot be processed"
            />
          </ul>
        </div>

        {/* ── DISQUALIFICATION ──────────────────────────────────────────── */}
        <div className="bg-red-50 border-[1.5px] border-red-200 rounded-xl p-5">
          <h3 className="text-red-600 font-extrabold text-[15px] mb-3 flex items-center gap-2">
            🚫 Do NOT apply if:
          </h3>
          <ul className="flex flex-col gap-2.5">
            {[
              "You only have EPT (electric pallet truck) experience — this is reachtruck-specific",
              "You have fewer than 3 years of reachtruck experience",
              "You do not hold a valid driver's license",
              "Your English is below B1 — you cannot function safely on this site",
              "You are not an EU citizen or do not have EU work authorisation",
              "You cannot start within 4 weeks",
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-[14px] text-red-900">
                <span className="font-bold text-red-600 flex-shrink-0 mt-0.5">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── CONDITIONS ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600 mb-3 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
            Job Conditions
          </p>
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">
            What's on offer — no surprises
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Hourly Rate",     value: "€16.50 gross/hr",   highlight: true },
              { label: "Location",        value: "Waalwijk area, NL"              },
              { label: "Shift 1",         value: "07:00 – 16:00"                  },
              { label: "Shift 2",         value: "09:00 – 18:00"                  },
              { label: "Accommodation",   value: "Shared room available"          },
              { label: "Housing cost",    value: "Paid by candidate"              },
            ].map(c => (
              <div key={c.label} className="bg-gray-50 rounded-lg p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                  {c.label}
                </div>
                <div className={`text-[15px] font-bold ${c.highlight ? "text-brand-700 text-lg" : "text-gray-900"}`}>
                  {c.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SOCIAL PROOF ──────────────────────────────────────────────── */}
        <div className="bg-green-50 border-[1.5px] border-green-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚡</span>
          <div>
            <strong className="block text-green-900 font-extrabold text-[15px] mb-0.5">
              Qualified drivers are getting placed right now.
            </strong>
            <p className="text-green-800 text-[14px]">
              We have active placements for experienced reachtruck operators in Waalwijk.
              If you meet the criteria, expect a response within 24 hours.
            </p>
          </div>
        </div>

        {/* ── FORM ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600 mb-3 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-gray-200">
            Apply Now
          </p>
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">
            Start your application
          </h2>
          <p className="text-gray-500 text-[14px] mb-6">
            All fields are required. Eligibility is confirmed automatically on submission.
          </p>

          {/* ── Live disqualification banner ── */}
          {hardFail && formState === "idle" && (
            <div className="bg-red-50 border-[1.5px] border-red-300 rounded-lg p-4 mb-5">
              <strong className="block text-red-700 font-bold text-[15px] mb-1">
                🚫 You do not meet the requirements for this position
              </strong>
              <p className="text-red-800 text-[13px]">
                This role requires EU right to work, 3+ years reachtruck experience, a
                driver's license, and English at B1 or above. We will contact you if a
                more suitable role becomes available.
              </p>
            </div>
          )}

          {/* ── Outcomes ── */}
          {formState === "success" && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                Application received!
              </h3>
              <p className="text-gray-500 text-[15px] mb-6">
                Your profile looks good. Our recruiter will review your application and
                contact you within <strong>24 hours</strong>.
              </p>
              <div className="bg-brand-50 rounded-lg p-4 text-left text-[14px] text-gray-700">
                <strong className="block text-brand-700 font-bold mb-2">
                  📋 What happens next:
                </strong>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Recruiter reviews your CV and experience details</li>
                  <li>Short phone screening call (10–15 minutes)</li>
                  <li>If approved — placement coordination begins immediately</li>
                </ol>
              </div>
            </div>
          )}

          {formState === "rejected" && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🚫</div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                You don't qualify for this position
              </h3>
              <p className="text-gray-500 text-[15px]">
                This position is only for experienced reachtruck drivers with EU work
                authorisation and a valid driver's license.
                <br /><br />
                <strong className="text-gray-700">
                  We will contact you if a more suitable role becomes available.
                </strong>
              </p>
            </div>
          )}

          {(formState === "idle" || formState === "loading" || formState === "error") && (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              {/* Server error */}
              {formState === "error" && serverError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-[14px] text-red-700 font-medium">
                  ⚠️ {serverError}
                </div>
              )}

              {/* Full name */}
              <Field label="Full name" error={errors.fullname}>
                <input
                  type="text"
                  value={fields.fullname}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setField("fullname", e.target.value)}
                  placeholder="e.g. Jan Kowalski"
                  autoComplete="name"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-[15px] outline-none transition-all
                    ${errors.fullname
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    }`}
                />
              </Field>

              {/* Phone */}
              <Field label="Phone number" error={errors.phone}>
                <input
                  type="tel"
                  value={fields.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setField("phone", e.target.value)}
                  placeholder="+48 600 123 456 or +31 6 12345678"
                  autoComplete="tel"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-[15px] outline-none transition-all
                    ${errors.phone
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    }`}
                />
              </Field>

              {/* Nationality */}
              <Field label="Nationality" error={errors.nationality}>
                <select
                  value={fields.nationality}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("nationality", e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-[15px] outline-none transition-all appearance-none bg-white
                    ${errors.nationality
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    }`}
                >
                  <option value="">— Select your nationality —</option>
                  <optgroup label="Most common">
                    <option value="PL">🇵🇱 Polish</option>
                    <option value="RO">🇷🇴 Romanian</option>
                    <option value="BG">🇧🇬 Bulgarian</option>
                    <option value="HU">🇭🇺 Hungarian</option>
                    <option value="SK">🇸🇰 Slovak</option>
                    <option value="CZ">🇨🇿 Czech</option>
                    <option value="LT">🇱🇹 Lithuanian</option>
                    <option value="LV">🇱🇻 Latvian</option>
                    <option value="EE">🇪🇪 Estonian</option>
                    <option value="HR">🇭🇷 Croatian</option>
                    <option value="NL">🇳🇱 Dutch</option>
                    <option value="DE">🇩🇪 German</option>
                    <option value="PT">🇵🇹 Portuguese</option>
                    <option value="ES">🇪🇸 Spanish</option>
                    <option value="IT">🇮🇹 Italian</option>
                    <option value="FR">🇫🇷 French</option>
                  </optgroup>
                  <optgroup label="Other EU">
                    <option value="AT">🇦🇹 Austrian</option>
                    <option value="BE">🇧🇪 Belgian</option>
                    <option value="CY">🇨🇾 Cypriot</option>
                    <option value="DK">🇩🇰 Danish</option>
                    <option value="FI">🇫🇮 Finnish</option>
                    <option value="GR">🇬🇷 Greek</option>
                    <option value="IE">🇮🇪 Irish</option>
                    <option value="LU">🇱🇺 Luxembourgish</option>
                    <option value="MT">🇲🇹 Maltese</option>
                    <option value="SE">🇸🇪 Swedish</option>
                    <option value="SI">🇸🇮 Slovenian</option>
                  </optgroup>
                  <optgroup label="Non-EU">
                    <option value="UA">🇺🇦 Ukrainian</option>
                    <option value="OTHER_NON_EU">Other (non-EU)</option>
                  </optgroup>
                </select>
              </Field>

              {/* EU passport */}
              <Field
                label="Do you have an EU passport or EU right to work?"
                error={errors.euPassport}
              >
                <YesNoToggle
                  value={fields.euPassport}
                  onChange={v => setField("euPassport", v)}
                  hasError={!!errors.euPassport}
                />
              </Field>

              {/* Reachtruck years */}
              <Field
                label="Years of reachtruck experience"
                error={errors.reachtruckYears}
              >
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={fields.reachtruckYears}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setField("reachtruckYears", e.target.value)
                  }
                  placeholder="Enter a number (e.g. 5)"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-[15px] outline-none transition-all
                    ${errors.reachtruckYears
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    }`}
                />
                {fields.reachtruckYears !== "" &&
                 !isNaN(parseInt(fields.reachtruckYears, 10)) &&
                 parseInt(fields.reachtruckYears, 10) < 3 && (
                  <p className="text-amber-700 text-[12px] mt-0.5 font-medium">
                    ⚠️ Minimum 3 years required for this position.
                  </p>
                )}
              </Field>

              {/* Driver's license */}
              <Field
                label="Do you hold a valid driver's license (category B)?"
                error={errors.driversLicense}
              >
                <YesNoToggle
                  value={fields.driversLicense}
                  onChange={v => setField("driversLicense", v)}
                  hasError={!!errors.driversLicense}
                />
              </Field>

              {/* English level */}
              <Field label="English language level" error={errors.englishLevel}>
                <select
                  value={fields.englishLevel}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setField("englishLevel", e.target.value)
                  }
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-[15px] outline-none transition-all appearance-none bg-white
                    ${errors.englishLevel
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    }`}
                >
                  <option value="">— Select your level —</option>
                  <option value="A1">A1 – Beginner</option>
                  <option value="A2">A2 – Elementary</option>
                  <option value="B1">B1 – Intermediate ✓</option>
                  <option value="B2">B2 – Upper-intermediate ✓</option>
                  <option value="C1">C1 – Advanced ✓</option>
                  <option value="C2">C2 – Proficient ✓</option>
                </select>
              </Field>

              {/* Availability */}
              <Field
                label="Are you available to start within 2 weeks?"
                error={errors.availability}
              >
                <YesNoToggle
                  value={fields.availability}
                  onChange={v => setField("availability", v)}
                  hasError={!!errors.availability}
                />
                {fields.availability === "no" && (
                  <p className="text-gray-500 text-[12px] mt-1">
                    That's fine — within 4 weeks is acceptable.
                  </p>
                )}
              </Field>

              {/* CV upload */}
              <Field label="Upload your CV" error={errors.cvFile}>
                <div
                  role="button"
                  tabIndex={0}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={e => e.key === "Enter" && fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all
                    ${isDragging
                      ? "border-brand-500 bg-brand-50"
                      : errors.cvFile
                        ? "border-red-400 bg-red-50"
                        : fields.cvFile
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 hover:border-brand-400 hover:bg-brand-50"
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFileChange(e.target.files?.[0] ?? null)
                    }
                  />
                  <div className="text-3xl mb-2">📄</div>
                  {fields.cvFile ? (
                    <p className="text-green-700 font-semibold text-[14px]">
                      ✓ {fields.cvFile.name}{" "}
                      <span className="font-normal text-gray-500">
                        ({Math.round(fields.cvFile.size / 1024)} KB)
                      </span>
                    </p>
                  ) : (
                    <>
                      <p className="text-[14px] text-gray-500">
                        <strong className="text-brand-600">Click to upload</strong> or drag
                        and drop
                      </p>
                      <p className="text-[12px] text-gray-400 mt-1">
                        PDF, DOC, DOCX — max 3 MB
                      </p>
                    </>
                  )}
                </div>
              </Field>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={formState === "loading" || hardFail}
                  className={`w-full py-4 rounded-lg text-[17px] font-extrabold tracking-wide text-white transition-all
                    ${formState === "loading"
                      ? "bg-gray-400 cursor-not-allowed"
                      : hardFail
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-brand-700 hover:bg-brand-800 active:scale-[.98]"
                    }`}
                >
                  {formState === "loading"
                    ? "⏳ Submitting…"
                    : hardFail
                      ? "You do not meet the requirements"
                      : "🚀 APPLY NOW"}
                </button>

                {hardFail && (
                  <p className="text-center text-[12px] text-gray-500 mt-2">
                    One or more disqualifying answers detected above.
                  </p>
                )}

                {!hardFail && formState !== "loading" && (
                  <p className="text-center text-[12px] text-gray-400 mt-2">
                    Your information is used only for this application.
                  </p>
                )}
              </div>

            </form>
          )}
        </div>

      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="text-center py-6 px-4 text-[12px] text-gray-400 border-t border-gray-200 bg-white mt-4">
        <p>AgencyCheck · Reachtruck Driver Application · Waalwijk, Netherlands</p>
        <p className="mt-1">
          Questions?{" "}
          <a href="mailto:info@agencycheck.io" className="text-brand-600 hover:underline">
            info@agencycheck.io
          </a>
        </p>
      </footer>

    </div>
  );
}
