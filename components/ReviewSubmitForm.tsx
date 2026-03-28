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
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-gray-700 flex-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            aria-label={`${star} star`}
            className="text-2xl leading-none transition-transform hover:scale-110 focus:outline-none"
          >
            <span
              className={
                (hover ?? value ?? 0) >= star
                  ? "text-yellow-400"
                  : "text-gray-200"
              }
            >
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
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
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

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
      <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">
          Review submitted — thank you!
        </h3>
        <p className="text-green-700 text-sm max-w-sm mx-auto">
          Your review has been submitted and is pending moderation. Once approved by our team,
          it will appear on the {agencyName ?? agencySlug} page.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-1 bg-blue-500 transition-all duration-300"
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
        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            Share your experience
            {agencyName ? ` with ${agencyName}` : ""}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            All reviews are moderated before publishing. Your identity stays anonymous.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ── Step 1: Ratings ─────────────────────────────────────────────── */}
        {step === "ratings" && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Step 1 of 4 — Ratings
            </p>
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
            <div className="pt-2">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Details ──────────────────────────────────────────────── */}
        {step === "details" && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Step 2 of 4 — Details
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City / region (optional)
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Amsterdam, Rotterdam…"
                maxLength={80}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                When did you work there? (optional)
              </label>
              <input
                type="month"
                value={experiencePeriod}
                onChange={(e) => setExperiencePeriod(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your experience (optional)
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your experience. What was good? What could be better?"
                maxLength={4000}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/4000</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("ratings")}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep("housing")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Housing ───────────────────────────────────────────────── */}
        {step === "housing" && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Step 3 of 4 — Housing (optional)
            </p>

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weekly rent deducted (€, optional)
                  </label>
                  <input
                    type="number"
                    value={weeklyRent}
                    onChange={(e) => setWeeklyRent(e.target.value)}
                    placeholder="e.g. 80"
                    min={0}
                    max={1000}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    People in the house (optional)
                  </label>
                  <input
                    type="number"
                    value={peopleInHouse}
                    onChange={(e) => setPeopleInHouse(e.target.value)}
                    placeholder="e.g. 6"
                    min={1}
                    max={100}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("details")}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep("photos")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Photos + Submit ───────────────────────────────────────── */}
        {step === "photos" && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Step 4 of 4 — Photos (optional)
            </p>
            <p className="text-sm text-gray-600">
              You can upload up to 6 photos (room, kitchen, bathroom, exterior…).
              Max 8 MB per photo. JPG, PNG, WebP only.
            </p>

            {/* Photo grid */}
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photoPreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                      src={src}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none"
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
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-6 text-sm text-gray-500 hover:border-blue-300 hover:text-blue-500 transition text-center"
              >
                📷 Click to add photos ({photoFiles.length}/6)
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

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("housing")}
                disabled={submitting}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
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
          </div>
        )}
      </div>

      {/* Hidden form ref for native submit fallback */}
      <form ref={formRef} className="hidden" />
    </div>
  );
}
