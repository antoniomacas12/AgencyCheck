"use client";

/**
 * SubmitExperience — Aggressive data loop component
 *
 * Behaviour:
 * - Appears after calculator use / job click / 50% scroll (configurable via `trigger` prop)
 * - No login required — stores to localStorage + optional API call
 * - After submission: shows comparison + share CTA (viral loop)
 * - localStorage flag `ac_submitted_experience` controls unlock state
 * - Used on: salary pages, job pages, city pages, combo pages, calculator
 */

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ExperienceData {
  agencyName:      string;
  city:            string;
  jobType:         string;
  agreedGross:     string;  // what agency said
  actualKeep:      string;  // what they actually kept
  hasHousing:      boolean;
  housingRating:   number;  // 1-5
  salaryAccurate:  boolean;
  wouldRecommend:  boolean;
  comment:         string;
  submittedAt:     string;
}

interface Props {
  /** When to automatically show the modal */
  trigger?: "scroll" | "calculator" | "manual" | "job-click";
  /** If provided, pre-fill agency name */
  agencyName?: string;
  /** If provided, pre-fill city */
  city?: string;
  /** If provided, pre-fill job type */
  jobType?: string;
  /** Render as inline form instead of modal */
  inline?: boolean;
  /** Show immediately on mount (for inline use) */
  showOnMount?: boolean;
  className?: string;
}

const JOB_TYPES = [
  "Order Picker", "Forklift Driver", "Warehouse Worker", "Production Worker",
  "Packing Operator", "Truck Driver", "Greenhouse Worker", "Assembly Worker",
  "Cleaning Staff", "Reach Truck Driver", "Machine Operator", "Delivery Driver",
  "Other",
];

const SALARY_OPTIONS = [
  "Less than €1,200/mo", "€1,200–€1,500/mo", "€1,500–€1,800/mo",
  "€1,800–€2,200/mo", "More than €2,200/mo",
];

// ─── Local storage helpers ─────────────────────────────────────────────────────

const LS_KEY_SUBMITTED   = "ac_submitted_experience";
const LS_KEY_SUBMISSIONS = "ac_experience_submissions";

function hasSubmitted(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(LS_KEY_SUBMITTED);
}

function saveSubmission(data: ExperienceData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY_SUBMITTED, "true");
  const existing = JSON.parse(localStorage.getItem(LS_KEY_SUBMISSIONS) || "[]");
  existing.push(data);
  localStorage.setItem(LS_KEY_SUBMISSIONS, JSON.stringify(existing));
}

// ─── Share text generator ──────────────────────────────────────────────────────

function buildShareText(data: ExperienceData): string {
  const diff = data.agreedGross && data.actualKeep
    ? ` Agency said ${data.agreedGross}, I kept ${data.actualKeep}.`
    : "";
  return `I just shared my agency work experience in the Netherlands.${diff} Check the real numbers at AgencyCheck.nl`;
}

// ─── Step components ──────────────────────────────────────────────────────────

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all ${
            i < step ? "w-6 h-2 bg-brand-600" :
            i === step ? "w-6 h-2 bg-brand-400" :
            "w-2 h-2 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function SubmitExperience({
  trigger = "scroll",
  agencyName: prefillAgency = "",
  city: prefillCity = "",
  jobType: prefillJobType = "",
  inline = false,
  showOnMount = false,
  className = "",
}: Props) {
  const [visible,   setVisible]   = useState(showOnMount || inline);
  const [step,      setStep]      = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const scrollRef = useRef(false);

  // Form state
  const [form, setForm] = useState<ExperienceData>({
    agencyName:     prefillAgency,
    city:           prefillCity,
    jobType:        prefillJobType,
    agreedGross:    "",
    actualKeep:     "",
    hasHousing:     false,
    housingRating:  3,
    salaryAccurate: true,
    wouldRecommend: true,
    comment:        "",
    submittedAt:    "",
  });

  // Check if already submitted
  useEffect(() => {
    setAlreadyDone(hasSubmitted());
  }, []);

  // Scroll trigger
  const handleScroll = useCallback(() => {
    if (scrollRef.current || alreadyDone) return;
    const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (scrollPct >= 50) {
      scrollRef.current = true;
      setVisible(true);
      window.removeEventListener("scroll", handleScroll);
    }
  }, [alreadyDone]);

  useEffect(() => {
    if (trigger === "scroll" && !alreadyDone) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [trigger, alreadyDone, handleScroll]);

  // ── Field update helper
  function update<K extends keyof ExperienceData>(key: K, value: ExperienceData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Submit
  function handleSubmit() {
    const data: ExperienceData = { ...form, submittedAt: new Date().toISOString() };
    saveSubmission(data);
    setSubmitted(true);

    // Fire-and-forget API call (non-blocking)
    fetch("/api/experiences", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    }).catch(() => {/* silent — data already saved locally */});
  }

  // ── If already submitted or trigger not met
  if (alreadyDone && !inline) {
    return null;
  }

  // ── Not visible yet (modal mode)
  if (!visible && !inline) {
    return (
      <button
        onClick={() => setVisible(true)}
        className={`inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm ${className}`}
      >
        ✍️ Share your experience
      </button>
    );
  }

  const TOTAL_STEPS = 4;

  // ── Post-submission viral loop
  if (submitted) {
    const shareText = buildShareText(form);
    const shareUrl  = "https://agencycheck.nl";

    return (
      <div className={`${inline ? "" : "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"}`}>
        <div className={`bg-white rounded-2xl p-6 w-full max-w-md mx-auto ${!inline ? "shadow-2xl" : ""}`}>
          <div className="text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Thank you!</h3>
            <p className="text-gray-600 text-sm mb-5">
              Your experience helps other workers make better decisions. This data stays with AgencyCheck — we never sell it.
            </p>

            {/* Comparison reveal */}
            {form.agreedGross && form.actualKeep && (
              <div className="bg-gray-950 text-white rounded-xl p-4 mb-5">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Your report</p>
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <div className="text-xl font-black text-gray-400 line-through">{form.agreedGross}</div>
                    <div className="text-xs text-gray-500">Agency said</div>
                  </div>
                  <div className="text-gray-500">→</div>
                  <div>
                    <div className="text-xl font-black text-green-400">{form.actualKeep}</div>
                    <div className="text-xs text-gray-500">You kept</div>
                  </div>
                </div>
              </div>
            )}

            {/* Share buttons */}
            <p className="text-sm text-gray-700 font-medium mb-3">
              Help other workers — share this:
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2.5 rounded-lg transition-colors text-sm"
              >
                📱 Share on WhatsApp
              </a>
              <button
                onClick={() => navigator.clipboard?.writeText(shareText + " " + shareUrl)}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
              >
                📋 Copy link
              </button>
            </div>

            <button
              onClick={() => setVisible(false)}
              className="mt-4 text-xs text-gray-400 hover:text-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const content = (
    <div className={`bg-white rounded-2xl w-full max-w-md mx-auto ${!inline ? "shadow-2xl" : ""}`}>

      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900">Share your experience</h3>
            <p className="text-xs text-gray-500 mt-0.5">No login required · stays anonymous</p>
          </div>
          {!inline && (
            <button
              onClick={() => setVisible(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <ProgressDots step={step} total={TOTAL_STEPS} />
      </div>

      {/* Steps */}
      <div className="px-6 py-5">

        {/* Step 0 — Basic info */}
        {step === 0 && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Which agency & city?</h4>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Agency name</label>
              <input
                type="text"
                value={form.agencyName}
                onChange={(e) => update("agencyName", e.target.value)}
                placeholder="e.g. Randstad, Adecco, Otto Work Force…"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="e.g. Rotterdam, Amsterdam, Eindhoven…"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Job type</label>
              <select
                value={form.jobType}
                onChange={(e) => update("jobType", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="">Select job type…</option>
                {JOB_TYPES.map((jt) => (
                  <option key={jt} value={jt}>{jt}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 1 — Salary reality */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">The salary truth</h4>
            <p className="text-xs text-gray-500">
              This is the most important data for other workers. Be honest — no one can identify you.
            </p>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                What did the agency advertise / promise?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SALARY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update("agreedGross", opt)}
                    className={`px-3 py-2 rounded-lg border text-xs text-left transition-colors ${
                      form.agreedGross === opt
                        ? "border-brand-500 bg-brand-50 text-brand-700 font-medium"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                What did you actually keep (after all deductions)?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SALARY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update("actualKeep", opt)}
                    className={`px-3 py-2 rounded-lg border text-xs text-left transition-colors ${
                      form.actualKeep === opt
                        ? "border-green-500 bg-green-50 text-green-700 font-medium"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => update("salaryAccurate", !form.salaryAccurate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.salaryAccurate ? "bg-green-500" : "bg-gray-200"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.salaryAccurate ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
              <label className="text-sm text-gray-700">
                Agency was accurate about pay
              </label>
            </div>
          </div>
        )}

        {/* Step 2 — Housing */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Housing experience</h4>

            <div className="flex items-center gap-3">
              <button
                onClick={() => update("hasHousing", !form.hasHousing)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.hasHousing ? "bg-brand-600" : "bg-gray-200"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.hasHousing ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
              <label className="text-sm text-gray-700 font-medium">
                Agency provided housing
              </label>
            </div>

            {form.hasHousing && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Housing quality rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => update("housingRating", star)}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        star <= form.housingRating ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {form.housingRating === 1 ? "Very poor — avoid" :
                   form.housingRating === 2 ? "Poor" :
                   form.housingRating === 3 ? "Average" :
                   form.housingRating === 4 ? "Good" :
                   "Excellent — recommend"}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => update("wouldRecommend", !form.wouldRecommend)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.wouldRecommend ? "bg-green-500" : "bg-red-400"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.wouldRecommend ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
              <label className="text-sm text-gray-700">
                I would recommend this agency
              </label>
            </div>
          </div>
        )}

        {/* Step 3 — Final comment */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Anything else to share?</h4>
            <p className="text-xs text-gray-500">
              Optional. What should other workers know before signing with this agency?
            </p>

            <textarea
              value={form.comment}
              onChange={(e) => update("comment", e.target.value)}
              placeholder="e.g. Housing was overcrowded, they didn't pay the promised Sunday rate, bus was always late…"
              rows={4}
              maxLength={500}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <p className="text-xs text-gray-400 text-right">{form.comment.length}/500</p>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500">
                ✅ <strong>Your data is anonymous.</strong> We never ask for your name, email, or ID.
                This data is used to help other workers and is not sold to agencies or third parties.
                Based on worker-reported data — estimates may vary.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer nav */}
      <div className="px-6 pb-6 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {step < TOTAL_STEPS - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Submit experience ✓
          </button>
        )}
      </div>

    </div>
  );

  if (inline) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      {content}
    </div>
  );
}

// ─── Trigger button variant ────────────────────────────────────────────────────

export function SubmitExperienceButton({
  agencyName,
  city,
  jobType,
  className = "",
}: {
  agencyName?: string;
  city?: string;
  jobType?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm ${className}`}
      >
        ✍️ Share your experience
      </button>
      {open && (
        <SubmitExperience
          agencyName={agencyName}
          city={city}
          jobType={jobType}
          trigger="manual"
          showOnMount
          inline={false}
        />
      )}
    </>
  );
}

// ─── Unlock gate (blur content until submitted) ────────────────────────────────

export function UnlockGate({
  children,
  fallback,
  className = "",
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setUnlocked(hasSubmitted());
  }, []);

  if (unlocked) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Blurred content */}
      <div className="select-none pointer-events-none" style={{ filter: "blur(6px)", userSelect: "none" }}>
        {fallback || children}
      </div>

      {/* Unlock overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
        <div className="text-center p-6 max-w-sm">
          <div className="text-3xl mb-2">🔓</div>
          <h3 className="font-black text-gray-900 mb-2">Unlock full data</h3>
          <p className="text-sm text-gray-600 mb-4">
            Share your agency experience to unlock real salary & housing data from other workers.
            No login required — takes 2 minutes.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Share & unlock →
          </button>
        </div>
      </div>

      {showForm && (
        <SubmitExperience
          trigger="manual"
          showOnMount
          inline={false}
        />
      )}
    </div>
  );
}
