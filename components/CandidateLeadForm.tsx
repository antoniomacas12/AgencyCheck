"use client";

import { useState } from "react";
import { trackCandidateFormSubmit } from "@/lib/analytics";

type Status = "idle" | "loading" | "success" | "error";

const EXPERIENCE_OPTIONS = [
  { value: "none",       label: "No experience" },
  { value: "some",       label: "Some experience" },
  { value: "experienced", label: "Experienced (2+ years)" },
];

const COUNTRY_OPTIONS = [
  "Poland", "Romania", "Bulgaria", "Slovakia", "Czech Republic",
  "Hungary", "Ukraine", "Moldova", "Croatia", "Lithuania",
  "Latvia", "Estonia", "Netherlands", "Other",
];

export default function CandidateLeadForm() {
  const [fullName,         setFullName]         = useState("");
  const [nationality,      setNationality]      = useState("");
  const [phone,            setPhone]            = useState("");
  const [currentCountry,   setCurrentCountry]   = useState("");
  const [experienceLevel,  setExperienceLevel]  = useState("");
  const [hasReachtruck,    setHasReachtruck]     = useState(false);
  const [hasForklift,      setHasForklift]       = useState(false);
  const [ownAccommodation, setOwnAccommodation] = useState<boolean | null>(null);
  const [ownTransport,     setOwnTransport]      = useState<boolean | null>(null);
  const [status,           setStatus]           = useState<Status>("idle");
  const [errorMsg,         setErrorMsg]         = useState("");

  const isValid = fullName.trim().length > 0 && phone.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setStatus("loading");
    setErrorMsg("");

    // Build notes from cert + transport fields for admin visibility
    const noteParts: string[] = [];
    if (hasReachtruck) noteParts.push("Reachtruck cert: YES");
    if (hasForklift)   noteParts.push("Forklift cert: YES");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName:           fullName.trim(),
          phone:              phone.trim(),
          nationality:        nationality || undefined,
          currentCountry:     currentCountry || undefined,
          experienceLevel:    experienceLevel || undefined,
          accommodationNeeded: ownAccommodation === false ? true : ownAccommodation === true ? false : undefined,
          driversLicense:     ownTransport === true ? true : ownTransport === false ? false : undefined,
          notes:              noteParts.length > 0 ? noteParts.join("; ") : undefined,
          sourceType:         "candidate_homepage",
          sourcePage:         "/",
          sourceLabel:        "Homepage candidate form",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      trackCandidateFormSubmit({
        job_type:       experienceLevel || undefined,
        country:        currentCountry || undefined,
        contact_method: "phone",
      });

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-8 text-center">
        <div className="text-3xl mb-3">✅</div>
        <p className="text-emerald-300 font-bold text-lg mb-1">We received your details!</p>
        <p className="text-gray-400 text-sm">Our recruiter will contact you on WhatsApp within 24 hours with matching job options.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">

      {/* Row 1: Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[12px] font-semibold text-gray-400 mb-1">
            Full name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Jan Kowalski"
            maxLength={100}
            className="w-full px-4 py-3 text-[16px] rounded-xl border border-white/10 bg-white/[0.06] text-white placeholder:text-gray-600
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-gray-400 mb-1">
            Phone / WhatsApp <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+48 123 456 789"
            maxLength={30}
            className="w-full px-4 py-3 text-[16px] rounded-xl border border-white/10 bg-white/[0.06] text-white placeholder:text-gray-600
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Row 2: Nationality + Current country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[12px] font-semibold text-gray-400 mb-1">Nationality</label>
          <select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full px-4 py-3 text-[16px] rounded-xl border border-white/10 bg-[#0f1a2e] text-white
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Select nationality</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-gray-400 mb-1">Currently in</label>
          <select
            value={currentCountry}
            onChange={(e) => setCurrentCountry(e.target.value)}
            className="w-full px-4 py-3 text-[16px] rounded-xl border border-white/10 bg-[#0f1a2e] text-white
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Your current country</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Experience */}
      <div>
        <label className="block text-[12px] font-semibold text-gray-400 mb-1">Warehouse / logistics experience</label>
        <div className="grid grid-cols-3 gap-2">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setExperienceLevel(opt.value)}
              className={`py-3 px-2 rounded-xl border text-[13px] font-semibold transition-all duration-150 leading-snug text-center
                ${experienceLevel === opt.value
                  ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                  : "border-white/10 bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 4: Certs */}
      <div>
        <label className="block text-[12px] font-semibold text-gray-400 mb-2">Certifications (select if you have)</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "🏗️ Reachtruck cert", value: hasReachtruck, setter: setHasReachtruck },
            { label: "🔧 Forklift cert",   value: hasForklift,   setter: setHasForklift   },
          ].map((cert) => (
            <button
              key={cert.label}
              type="button"
              onClick={() => cert.setter(!cert.value)}
              className={`py-3 px-3 rounded-xl border text-[13px] font-semibold transition-all duration-150 text-left
                ${cert.value
                  ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                  : "border-white/10 bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]"}`}
            >
              {cert.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 5: Own accommodation + transport */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div>
          <label className="block text-[12px] font-semibold text-gray-400 mb-2">Do you have own accommodation?</label>
          <div className="grid grid-cols-2 gap-2">
            {([true, false] as const).map((v) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => setOwnAccommodation(v)}
                className={`py-2.5 rounded-xl border text-[13px] font-semibold transition-all duration-150 text-center
                  ${ownAccommodation === v
                    ? v
                      ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                      : "border-blue-400 bg-blue-400/15 text-blue-300"
                    : "border-white/10 bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]"}`}
              >
                {v ? "Yes" : "No — need housing"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-gray-400 mb-2">Do you have own transport?</label>
          <div className="grid grid-cols-2 gap-2">
            {([true, false] as const).map((v) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => setOwnTransport(v)}
                className={`py-2.5 rounded-xl border text-[13px] font-semibold transition-all duration-150 text-center
                  ${ownTransport === v
                    ? v
                      ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                      : "border-blue-400 bg-blue-400/15 text-blue-300"
                    : "border-white/10 bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]"}`}
              >
                {v ? "Yes" : "No — need transport"}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Error */}
      {status === "error" && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          {errorMsg || "Something went wrong. Please try again."}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || status === "loading"}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[15px] transition-all duration-150
          bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white
          disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        style={{ boxShadow: "0 0 0 1px rgba(52,211,153,0.35), 0 8px 36px rgba(52,211,153,0.20)" }}
      >
        {status === "loading" ? "Sending…" : "Get Matched — Free"}
        {status !== "loading" && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        )}
      </button>

      <p className="text-center text-gray-600 text-[11px]">
        Free · No spam · Recruiter contacts you within 24h
      </p>

    </form>
  );
}
