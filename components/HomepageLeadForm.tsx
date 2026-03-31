"use client";

/**
 * HomepageLeadForm — compact inline lead capture form positioned directly
 * below the hero. Submits to POST /api/leads.
 *
 * Designed to feel like worker protection, not lead farming.
 * Worker sees: job type, country, start date, WhatsApp/email.
 * API receives: phone (WhatsApp), email, preferredWorkType, nationality,
 *               availableFrom, accommodationNeeded, sourcePage/Type.
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

export default function HomepageLeadForm() {
  const [jobType,    setJobType]    = useState("");
  const [country,   setCountry]   = useState("");
  const [startDate, setStartDate]  = useState("");
  const [contact,   setContact]   = useState("");   // WhatsApp or email
  const [status,    setStatus]    = useState<Status>("idle");
  const [errorMsg,  setErrorMsg]  = useState("");

  const isEmail   = contact.includes("@");
  const isPhone   = /^[\d\s\+\-\(\)]{7,}$/.test(contact);
  const canSubmit = jobType && country && contact && (isEmail || isPhone) && status !== "loading";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
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
          sourceLabel:         "Homepage — inline lead form",
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

  if (status === "success") {
    return (
      <div className="text-center py-8 px-6">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-black text-gray-900 mb-2">You&apos;re on the list ✓</h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
          We&apos;ll match you with verified agencies within 24 hours.
          Only agencies with transparent deductions and verified housing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">

        {/* Job type */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 ml-0.5">
            Job type
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

        {/* Start date */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 ml-0.5">
            Start date <span className="text-gray-300 font-normal">(optional)</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 bg-white text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* WhatsApp / email */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 ml-0.5">
            WhatsApp or email
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="+48 123 456 789 or email"
            required
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="text-xs text-red-600 mb-3 ml-0.5">{errorMsg}</p>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all px-8 py-3.5 text-sm font-black text-white shadow-sm shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Matching…
            </>
          ) : (
            <>🛡 Get Matched Safely</>
          )}
        </button>
        <p className="text-[11px] text-gray-400 leading-snug">
          Free · No agency commissions · Data never sold ·{" "}
          <a href="/privacy" className="underline hover:text-gray-600">Privacy policy</a>
        </p>
      </div>
    </form>
  );
}
