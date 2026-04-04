"use client";

/**
 * ReviewSubmitForm — full review submission form with photo upload.
 *
 * Submits as multipart/form-data to POST /api/reviews.
 * Shows a real confirmation only when the server confirms the save.
 */

import { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReviewSubmitFormProps {
  agencySlug:  string;
  agencyName?: string;
  onSuccess?:  () => void;
}

type Step = "ratings" | "details" | "housing" | "photos" | "done";

// ─── Star rating input ────────────────────────────────────────────────────────

function StarInput({
  label,
  name,
  value,
  onChange,
  required,
}: {
  label:    string;
  name:     string;
  value:    number | null;
  onChange: (v: number) => void;
  required?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? value ?? 0;
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-gray-300 flex-1">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            aria-label={`${star} star`}
            className="text-[32px] leading-none focus:outline-none transition-all duration-100"
            style={{
              transform: active >= star ? "scale(1.20)" : "scale(1)",
              filter:    active >= star
                ? "drop-shadow(0 0 8px rgba(250,204,21,0.65))"
                : "none",
            }}
          >
            <span className={active >= star ? "text-yellow-400" : "text-gray-700"}>
              ★
            </span>
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={value ?? ""} />
    </div>
  );
}

// ─── Select helper ────────────────────────────────────────────────────────────

function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label:    string;
  name:     string;
  value:    string;
  onChange: (v: string) => void;
  options:  { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-white/[0.1] bg-white/[0.06] rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all"
        style={{ fontSize: "16px", colorScheme: "dark" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#0f1623", color: "#fff" }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Step chip ────────────────────────────────────────────────────────────────

function StepChip({ current, total, label }: { current: number; total: number; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/[0.12] border border-blue-400/[0.2] px-3 py-1 mb-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
        Step {current} of {total}
      </span>
      <span className="text-blue-400/50 text-[10px]">·</span>
      <span className="text-[11px] font-semibold text-blue-300">{label}</span>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function ReviewSubmitForm({ agencySlug, agencyName, onSuccess }: ReviewSubmitFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step
  const [step, setStep] = useState<Step>("ratings");

  // Ratings
  const [salaryRating,          setSalaryRating]          = useState<number | null>(null);
  const [managementRating,      setManagementRating]      = useState<number | null>(null);
  const [contractClarityRating, setContractClarityRating] = useState<number | null>(null);
  const [housingRating,         setHousingRating]         = useState<number | null>(null);
  const [transportRating,       setTransportRating]       = useState<number | null>(null);
  const [salaryAccuracyRating,  setSalaryAccuracyRating]  = useState<number | null>(null);

  // Details
  const [city,             setCity]             = useState("");
  const [jobType,          setJobType]          = useState("");
  const [comment,          setComment]          = useState("");
  const [wouldRecommend,   setWouldRecommend]   = useState("UNSURE");
  const [workerStatus,     setWorkerStatus]     = useState("UNKNOWN");
  const [experiencePeriod, setExperiencePeriod] = useState("");

  // Housing
  const [accommodationProvided, setAccommodationProvided] = useState("UNKNOWN");
  const [roomType,              setRoomType]              = useState("UNKNOWN");
  const [weeklyRent,            setWeeklyRent]            = useState("");
  const [peopleInHouse,         setPeopleInHouse]         = useState("");

  // Photos
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // Submission state
  const [submitting,        setSubmitting]        = useState(false);
  const [error,             setError]             = useState<string | null>(null);
  const [mentionedAgencies, setMentionedAgencies] = useState<{ slug: string; name: string }[]>([]);

  // ── Photo handling ─────────────────────────────────────────────────────────

  const handlePhotoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter((f) => {
      if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type)) return false;
      if (f.size > 8 * 1024 * 1024) return false;
      return true;
    });
    const merged = [...photoFiles, ...valid].slice(0, 6);
    setPhotoFiles(merged);
    // Generate previews
    merged.forEach((file, i) => {
      if (photoPreviews[i]) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoPreviews((prev) => {
          const next = [...prev];
          next[i] = ev.target?.result as string;
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
  }, [photoFiles, photoPreviews]);

  function removePhoto(index: number) {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  function canAdvanceFromRatings() {
    return salaryRating !== null && managementRating !== null && contractClarityRating !== null;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!canAdvanceFromRatings()) {
      setError("Please fill in all required ratings.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.set("agencySlug",            agencySlug);
      fd.set("salaryRating",          String(salaryRating));
      fd.set("managementRating",      String(managementRating));
      fd.set("contractClarityRating", String(contractClarityRating));
      if (housingRating        !== null) fd.set("housingRating",        String(housingRating));
      if (transportRating      !== null) fd.set("transportRating",      String(transportRating));
      if (salaryAccuracyRating !== null) fd.set("salaryAccuracyRating", String(salaryAccuracyRating));
      if (city.trim())            fd.set("city",             city.trim());
      if (jobType.trim())         fd.set("jobType",          jobType.trim());
      if (comment.trim())         fd.set("comment",          comment.trim());
      if (experiencePeriod.trim()) fd.set("experiencePeriod", experiencePeriod.trim());
      fd.set("wouldRecommend",        wouldRecommend);
      fd.set("workerStatus",          workerStatus);
      fd.set("accommodationProvided", accommodationProvided);
      fd.set("roomType",              roomType);
      if (weeklyRent.trim())    fd.set("weeklyRent",      weeklyRent.trim());
      if (peopleInHouse.trim()) fd.set("peopleInHouse",   peopleInHouse.trim());

      // Attach photo files
      for (const file of photoFiles) {
        fd.append("photos", file);
      }

      const res = await fetch("/api/reviews", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Submission failed. Please try again.");
        return;
      }

      // Success — only reach here if server confirmed save
      if (Array.isArray(data.mentionedAgencies)) {
        setMentionedAgencies(data.mentionedAgencies);
      }
      setStep("done");
      onSuccess?.();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────

  if (step === "done") {
    return (
      <div
        className="bg-emerald-500/[0.08] border border-emerald-500/[0.2] rounded-2xl px-6 py-10 text-center"
        style={{ boxShadow: "0 4px 32px rgba(52,211,153,0.08), inset 0 1px 0 rgba(52,211,153,0.1)" }}
      >
        <div className="w-12 h-12 rounded-full bg-emerald-500/[0.15] border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Review submitted — thank you!
        </h3>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          Your review is now live on the {agencyName ?? agencySlug} page.
          Thank you for helping other workers know what to expect.
        </p>
        {mentionedAgencies.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/[0.08] text-left">
            <p className="text-xs font-semibold text-gray-400 mb-2">
              We also found these agencies mentioned in your review:
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {mentionedAgencies.map((a) => (
                <a
                  key={a.slug}
                  href={`/agency/${a.slug}`}
                  className="text-xs bg-white/[0.06] text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full hover:bg-emerald-500/[0.12] transition-colors"
                >
                  {a.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-white/[0.09] overflow-hidden"
      style={{
        background: "linear-gradient(160deg, rgba(15,22,35,0.98) 0%, rgba(10,15,25,0.99) 100%)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >

      {/* Progress bar */}
      <div className="h-[2px] bg-white/[0.06]">
        <div
          className="h-[2px] bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
          style={{
            width:
              step === "ratings" ? "25%" :
              step === "details" ? "50%" :
              step === "housing" ? "75%" :
              "100%",
          }}
        />
      </div>

      <div className="px-6 py-5">

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Share your experience
            {agencyName ? ` with ${agencyName}` : ""}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[
              { icon: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z", label: "Anonymous" },
              { icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z", label: "Takes ~2 min" },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Goes live immediately" },
            ].map((t) => (
              <span key={t.label} className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                <svg className="w-3 h-3 text-gray-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d={t.icon} clipRule="evenodd"/>
                </svg>
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-500/[0.12] border border-red-500/25 rounded-xl text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ── Step 1: Ratings ─────────────────────────────────────────────── */}
        {step === "ratings" && (
          <div className="space-y-1">
            <StepChip current={1} total={4} label="Ratings" />

            <div className="pt-2 space-y-0 divide-y divide-white/[0.05]">
              <StarInput
                label="Salary &amp; pay"
                name="salaryRating"
                value={salaryRating}
                onChange={setSalaryRating}
                required
              />
              <StarInput
                label="Management"
                name="managementRating"
                value={managementRating}
                onChange={setManagementRating}
                required
              />
              <StarInput
                label="Contract clarity"
                name="contractClarityRating"
                value={contractClarityRating}
                onChange={setContractClarityRating}
                required
              />
              <StarInput
                label="Housing quality"
                name="housingRating"
                value={housingRating}
                onChange={setHousingRating}
              />
              <StarInput
                label="Transport"
                name="transportRating"
                value={transportRating}
                onChange={setTransportRating}
              />
              <StarInput
                label="Salary accuracy"
                name="salaryAccuracyRating"
                value={salaryAccuracyRating}
                onChange={setSalaryAccuracyRating}
              />
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  if (!canAdvanceFromRatings()) {
                    setError("Salary, management, and contract clarity ratings are required.");
                    return;
                  }
                  setError(null);
                  setStep("details");
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-semibold py-3.5 rounded-xl transition-all"
                style={{ boxShadow: "0 4px 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Details ──────────────────────────────────────────────── */}
        {step === "details" && (
          <div className="space-y-4">
            <StepChip current={2} total={4} label="Details" />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                City / region <span className="text-gray-600 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Amsterdam, Rotterdam…"
                maxLength={80}
                className="w-full border border-white/[0.1] bg-white/[0.05] rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all"
              />
            </div>

            <SelectInput
              label="Type of work"
              name="jobType"
              value={jobType}
              onChange={setJobType}
              options={[
                { value: "",                   label: "— Select (optional) —" },
                { value: "order-picker",       label: "Order picker" },
                { value: "forklift-driver",    label: "Forklift driver" },
                { value: "warehouse-worker",   label: "Warehouse worker" },
                { value: "production-worker",  label: "Production / factory" },
                { value: "greenhouse-worker",  label: "Greenhouse / horticulture" },
                { value: "driver",             label: "Driver" },
                { value: "cleaner",            label: "Cleaner" },
                { value: "construction",       label: "Construction" },
                { value: "other",              label: "Other" },
              ]}
            />

            <SelectInput
              label="Worker status"
              name="workerStatus"
              value={workerStatus}
              onChange={setWorkerStatus}
              options={[
                { value: "UNKNOWN", label: "Prefer not to say" },
                { value: "CURRENT", label: "Current worker" },
                { value: "FORMER",  label: "Former worker" },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                When did you work there? <span className="text-gray-600 font-normal">(optional)</span>
              </label>
              <input
                type="month"
                value={experiencePeriod}
                onChange={(e) => setExperiencePeriod(e.target.value)}
                className="w-full border border-white/[0.1] bg-white/[0.05] rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all"
                style={{ colorScheme: "dark" }}
              />
            </div>

            <SelectInput
              label="Would you recommend this agency?"
              name="wouldRecommend"
              value={wouldRecommend}
              onChange={setWouldRecommend}
              options={[
                { value: "UNSURE", label: "Not sure" },
                { value: "YES",    label: "Yes, I would recommend" },
                { value: "NO",     label: "No, I would not recommend" },
              ]}
            />

            {/* ── Premium textarea card ──────────────────────────────────── */}
            <div className="rounded-xl border border-white/[0.09] bg-white/[0.04] overflow-hidden focus-within:border-blue-400/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <div className="px-4 pt-4 pb-1">
                <p className="text-sm font-semibold text-gray-200 leading-none mb-1">
                  Your experience
                </p>
                <p className="text-[11px] text-gray-500 mb-3">
                  Help others understand what this agency is really like.
                </p>
                <textarea
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your real experience (salary, housing, hidden costs...)"
                  maxLength={4000}
                  className="w-full bg-transparent border-0 outline-none resize-none text-sm text-white placeholder:text-gray-600 leading-relaxed focus:ring-0"
                  style={{ boxShadow: "none" }}
                />
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.02]">
                <span className="text-[11px] text-gray-600">Optional — but helpful</span>
                <span className="text-[11px] text-gray-600 tabular-nums">{comment.length} / 4000</span>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep("ratings")}
                className="flex-1 border border-white/[0.1] text-gray-400 text-sm font-semibold py-3.5 rounded-xl hover:bg-white/[0.06] hover:border-white/20 active:scale-[0.98] transition-all"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep("housing")}
                className="flex-1 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-semibold py-3.5 rounded-xl transition-all"
                style={{ boxShadow: "0 4px 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Housing ───────────────────────────────────────────────── */}
        {step === "housing" && (
          <div className="space-y-4">
            <StepChip current={3} total={4} label="Housing" />

            <SelectInput
              label="Did the agency provide accommodation?"
              name="accommodationProvided"
              value={accommodationProvided}
              onChange={setAccommodationProvided}
              options={[
                { value: "UNKNOWN", label: "Not sure / prefer not to say" },
                { value: "YES",     label: "Yes, they provided housing" },
                { value: "NO",      label: "No, I found my own housing" },
              ]}
            />

            {accommodationProvided === "YES" && (
              <>
                <SelectInput
                  label="Room type"
                  name="roomType"
                  value={roomType}
                  onChange={setRoomType}
                  options={[
                    { value: "UNKNOWN", label: "Not sure" },
                    { value: "PRIVATE", label: "Private room" },
                    { value: "SHARED",  label: "Shared room" },
                  ]}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Weekly rent deducted <span className="text-gray-600 font-normal">(€, optional)</span>
                  </label>
                  <input
                    type="number"
                    value={weeklyRent}
                    onChange={(e) => setWeeklyRent(e.target.value)}
                    placeholder="e.g. 80"
                    min={0}
                    max={1000}
                    className="w-full border border-white/[0.1] bg-white/[0.05] rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all"
                    style={{ colorScheme: "dark" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    People in the house <span className="text-gray-600 font-normal">(optional)</span>
                  </label>
                  <input
                    type="number"
                    value={peopleInHouse}
                    onChange={(e) => setPeopleInHouse(e.target.value)}
                    placeholder="e.g. 6"
                    min={1}
                    max={100}
                    className="w-full border border-white/[0.1] bg-white/[0.05] rounded-xl px-3.5 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep("details")}
                className="flex-1 border border-white/[0.1] text-gray-400 text-sm font-semibold py-3.5 rounded-xl hover:bg-white/[0.06] hover:border-white/20 active:scale-[0.98] transition-all"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep("photos")}
                className="flex-1 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-semibold py-3.5 rounded-xl transition-all"
                style={{ boxShadow: "0 4px 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Photos + Submit ───────────────────────────────────────── */}
        {step === "photos" && (
          <div className="space-y-4">
            <StepChip current={4} total={4} label="Photos" />

            <p className="text-sm text-gray-500 leading-relaxed">
              Upload up to 6 photos (room, kitchen, bathroom, exterior…). Max 8 MB · JPG, PNG, WebP.
            </p>

            {/* Photo grid */}
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photoPreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element -- local blob URL photo preview; next/image does not support blob: URLs */}
                    <img
                      src={src}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none transition-colors"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photoFiles.length < 6 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-white/[0.1] rounded-xl py-7 text-sm text-gray-500 hover:border-blue-400/40 hover:text-blue-400 hover:bg-blue-500/[0.05] active:scale-[0.99] transition-all text-center"
              >
                <span className="block text-lg mb-1">📷</span>
                Click to add photos ({photoFiles.length}/6)
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handlePhotoSelect}
            />

            <p className="text-[10px] text-gray-600 leading-relaxed">
              By submitting you confirm this is based on your personal experience and agree to our{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400 transition-colors">Terms of Use</a>.
              Reviews are posted anonymously. See our{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400 transition-colors">Privacy Policy</a>.
            </p>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep("housing")}
                disabled={submitting}
                className="flex-1 border border-gray-200 text-gray-500 text-sm font-semibold py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white text-sm font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ boxShadow: "0 4px 24px rgba(52,211,153,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" }}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Submitting…
                  </>
                ) : (
                  "Submit review"
                )}
              </button>
            </div>

            {/* Trust microcopy */}
            <div className="flex items-center justify-center gap-5 pt-1">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                Your review is anonymous
              </span>
              <span className="w-px h-3 bg-white/[0.1]" />
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                Takes 30 seconds
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden form ref for native submit fallback */}
      <form ref={formRef} className="hidden" />
    </div>
  );
}
