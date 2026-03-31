"use client";

/**
 * HomepageLeadForm — 3-step transparent lead capture.
 *
 * Design principle: workers from Poland/Romania/Ukraine have been burned by
 * scam recruiters who ask for WhatsApp/phone with zero explanation of who
 * contacts them, when, or why. This form answers those questions BEFORE
 * asking for contact details — building trust, not harvesting data.
 *
 * Step 1: What work + which country  (zero personal data, low friction)
 * Step 2: When + contact details     (full context given before asking)
 * Step 3: Success screen             (specific, named, timed next steps)
 *
 * API: POST /api/leads
 */

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const JOB_TYPES = [
  { value: "logistics",    label: "📦 Logistics / Warehouse" },
  { value: "production",   label: "🏭 Production / Factory" },
  { value: "greenhouse",   label: "🌱 Greenhouse / Agriculture" },
  { value: "driving",      label: "🚛 Driving / Transport" },
  { value: "cleaning",     label: "🧹 Cleaning / Facility" },
  { value: "construction", label: "🔧 Construction" },
  { value: "any",          label: "🔍 Any available work" },
];

const COUNTRIES = [
  "Poland", "Romania", "Bulgaria", "Ukraine", "Moldova",
  "Portugal", "Hungary", "Czech Republic", "Slovakia",
  "Lithuania", "Latvia", "Estonia", "Other",
];

// ── Step indicator ────────────────────────────────────────────────────────────

function StepDots({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {[1, 2].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center transition-colors ${
              s === step
                ? "bg-blue-600 text-white"
                : s < step
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {s < step ? (
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : s}
          </div>
          {s < 2 && (
            <div className={`w-8 h-0.5 ${s < step ? "bg-emerald-400" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
      <span className="text-[11px] text-gray-400 ml-1">Step {step} of 2</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HomepageLeadForm() {
  const [step,      setStep]      = useState<1 | 2>(1);
  const [jobType,   setJobType]   = useState("");
  const [country,   setCountry]   = useState("");
  const [startDate, setStartDate] = useState("");
  const [contact,   setContact]   = useState("");
  const [status,    setStatus]    = useState<Status>("idle");
  const [errorMsg,  setErrorMsg]  = useState("");

  const isEmail  = contact.includes("@");
  const isPhone  = /^[\d\s+\-()]{7,}$/.test(contact);
  const canStep1 = jobType && country;
  const canStep2 = contact && (isEmail || isPhone) && status !== "loading";

  // ── Step 1 submit ───────────────────────────────────────────────────────────

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!canStep1) return;
    setStep(2);
  }

  // ── Final submit ────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canStep2) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName:            "Homepage Lead",
          phone:               isPhone ? contact : "via-email",
          email:               isEmail ? contact : undefined,
          whatsappSame:        isPhone,
          preferredWorkType:   jobType,
          nationality:         country,
          availableFrom:       startDate || undefined,
          accommodationNeeded: true,
          sourcePage:          "/",
          sourceType:          "general_apply",
          sourceLabel:         "Homepage — 3-step transparent form",
          housingPreference:   "with_housing",
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const d = await res.json().catch(() => ({}));
        setErrorMsg(d.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (status === "success") {
    return (
      <div className="py-6 px-2">
        {/* Checkmark */}
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>

        <h3 className="text-base font-black text-gray-900 mb-1">
          Request received
        </h3>
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          Here is exactly what happens next:
        </p>

        {/* Numbered next steps */}
        <ol className="space-y-3 mb-5">
          {[
            {
              n: "1",
              title: "We review your request today",
              body:  "We check which registered agencies have open positions matching your job type and country.",
            },
            {
              n: "2",
              title: "We will contact you shortly",
              body:  "A coordinator will introduce themselves by name and state which agency they represent.",
            },
            {
              n: "3",
              title: "You decide — no pressure",
              body:  "You can ask any question before agreeing to anything. No deposit, no fee. You are never obligated.",
            },
          ].map((item) => (
            <li key={item.n} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                {item.n}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Reassurance footer */}
        <div className="border border-gray-100 rounded-xl bg-gray-50 px-4 py-3">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            <strong className="text-gray-700">If someone contacts you asking for money or documents before you start work, that is a scam.</strong>{" "}
            Legitimate agencies never ask for payment upfront.{" "}
            <a href="/safety" className="text-blue-600 underline hover:text-blue-800">Learn how to spot fake recruiters →</a>
          </p>
        </div>
      </div>
    );
  }

  // ── Step 1 — Job + Country ──────────────────────────────────────────────────

  if (step === 1) {
    return (
      <form onSubmit={handleStep1} noValidate>
        <StepDots step={1} />

        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          {/* Job type */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 ml-0.5">
              Type of work
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              required
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 bg-white text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            >
              <option value="" disabled>Select type…</option>
              {JOB_TYPES.map((j) => (
                <option key={j.value} value={j.value}>{j.label}</option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 ml-0.5">
              Your country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 bg-white text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            >
              <option value="" disabled>Select country…</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* What happens next — shown before personal data is requested */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-[11px] text-blue-800 leading-relaxed">
            <strong>Next step:</strong> You&apos;ll tell us the best way to reach you.
            We then share your request with <strong>1–3 registered agencies</strong> that
            have matching openings. A coordinator will contact you shortly —
            no anonymous calls, no automated messages.
          </p>
        </div>

        <button
          type="submit"
          disabled={!canStep1}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all px-8 py-3.5 text-sm font-black text-white shadow-sm shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>

        <p className="text-[11px] text-gray-400 mt-3 leading-snug">
          Free service · No commissions charged to workers ·{" "}
          <a href="/privacy" className="underline hover:text-gray-600">Privacy policy</a>
        </p>
      </form>
    );
  }

  // ── Step 2 — Contact details ────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepDots step={2} />

      {/* Context statement — appears BEFORE the contact field */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-5">
        <p className="text-xs font-bold text-gray-800 mb-1">Who will contact you and when</p>
        <p className="text-[11px] text-gray-600 leading-relaxed">
          A <strong>coordinator from a registered Dutch labour agency</strong> — not a bot,
          not a broker — will message you on WhatsApp or email shortly.
          They will give their name and the agency name in the first message.
          We share your details with{" "}
          <strong>maximum 3 agencies</strong>. You can block any agency at any time.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {/* Contact field */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 ml-0.5">
            WhatsApp number or email
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="+48 123 456 789 or you@email.com"
            required
            autoFocus
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
          <p className="text-[10px] text-gray-400 mt-1 ml-0.5">
            Used only to send you agency contact info. Not shared publicly.
          </p>
        </div>

        {/* Start date */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 ml-0.5">
            Available from <span className="text-gray-300 font-normal">(optional)</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 bg-white text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Summary of step 1 selections */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-[11px] text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5">
          <span>{JOB_TYPES.find((j) => j.value === jobType)?.label ?? jobType}</span>
          <span className="text-gray-300">·</span>
          <span>{country}</span>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-blue-500 hover:text-blue-700 underline ml-1"
          >
            change
          </button>
        </div>
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="text-xs text-red-600 mb-3 ml-0.5">{errorMsg}</p>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          type="submit"
          disabled={!canStep2}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all px-8 py-3.5 text-sm font-black text-white shadow-sm shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sending request…
            </>
          ) : (
            "Send request →"
          )}
        </button>

        <p className="text-[11px] text-gray-400 leading-snug">
          Free · No agency commissions ·{" "}
          <a href="/privacy" className="underline hover:text-gray-600">Privacy policy</a>
        </p>
      </div>
    </form>
  );
}
