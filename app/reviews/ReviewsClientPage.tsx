"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { REVIEW_SEED_DATA, type ReviewSeed } from "@/lib/reviewData";
import WorkerReviewCard, { type WorkerReview } from "@/components/WorkerReviewCard";
import WorkerDisclaimer from "@/components/WorkerDisclaimer";
import { useT, type Locale } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function seedToCard(r: ReviewSeed, idx: number): WorkerReview {
  return {
    id: `rev-${idx}`,
    reviewType: r.reviewType,
    title: r.title,
    overallRating: r.overallRating,
    salaryRating: r.salaryRating,
    housingRating: r.housingRating ?? null,
    managementRating: r.managementRating,
    contractClarityRating: r.contractClarityRating,
    issueTags: r.issueTags,
    verificationStatus: r.verificationStatus as "VERIFIED" | "WORKER_REPORTED" | "UNKNOWN",
    comment: r.comment,
    jobTitle: r.jobTitle ?? null,
    city: r.city ?? null,
    createdAt: r.createdAt,
  };
}

function agencyDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const STAR_VALUES = [1, 2, 3, 4, 5];

function StarSelector({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div>
      <p className="text-xs font-medium text-gray-700 mb-1.5">{label}</p>
      <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {STAR_VALUES.map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHover(s)}
            onClick={() => onChange(s)}
            className="text-2xl transition-transform hover:scale-110 active:scale-95"
            aria-label={`${s} star`}
          >
            <span className={(hover || value) >= s ? "text-amber-400" : "text-gray-200"}>★</span>
          </button>
        ))}
        {value > 0 && (
          <span className="ml-1 text-xs text-gray-500 self-center">{value}/5</span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Standalone review form (agency is selected inline)
// ─────────────────────────────────────────────────────────────────────────────

const JOB_TYPE_OPTIONS = [
  "Order Picker", "Warehouse Worker", "Production Worker", "Assembly Worker",
  "Forklift Driver", "Reach Truck Driver", "Machine Operator", "Packing Operator",
  "Greenhouse Worker", "Driver", "Cleaner", "Other",
];

const PHOTO_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MAX_PHOTO_SIZE = 8 * 1024 * 1024; // 8 MB
const MAX_PHOTOS = 6;

interface AgencySuggestion {
  id: string;
  name: string;
  slug: string;
}

interface FormState {
  agencySearch: string;   // text typed in combobox
  agencySlug: string;     // slug of confirmed-existing agency, or "" if new
  agencyIsNew: boolean;   // true = user confirmed "add as new agency"
  city: string;
  jobType: string;
  rating: number;
  housingIncluded: "yes" | "no" | "unknown";
  housingCost: string;
  peoplePerRoom: string;
  transportCost: string;
  wouldRecommend: "yes" | "no" | "neutral";
  comment: string;
}

const INITIAL_FORM: FormState = {
  agencySearch: "",
  agencySlug: "",
  agencyIsNew: false,
  city: "",
  jobType: "",
  rating: 0,
  housingIncluded: "unknown",
  housingCost: "",
  peoplePerRoom: "",
  transportCost: "",
  wouldRecommend: "neutral",
  comment: "",
};

// Read a File as a data-URL (for preview thumbnails)
function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) ?? "");
    reader.readAsDataURL(file);
  });
}

function ReviewSubmitForm({
  t,
  onSubmitSuccess,
}: {
  t: (key: string, vars?: Record<string, string | number>) => string;
  onSubmitSuccess?: (data: { agencySlug: string; review: WorkerReview }) => void;
}) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Agency combobox state ──────────────────────────────────────────────────
  const [suggestions,     setSuggestions]     = useState<AgencySuggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [suggestLoading,  setSuggestLoading]  = useState(false);
  const comboboxRef  = useRef<HTMLDivElement>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Photo upload state ─────────────────────────────────────────────────────
  const [photoFiles,    setPhotoFiles]    = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  // ── Validation ────────────────────────────────────────────────────────────
  const agencyOk = form.agencySlug.length > 0 || (form.agencyIsNew && form.agencySearch.trim().length > 2);
  const isValid  = agencyOk && form.rating > 0 && form.comment.trim().length > 10;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Agency combobox helpers ────────────────────────────────────────────────

  const fetchSuggestions = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSuggestLoading(true);
      try {
        const res = await fetch(`/api/agencies/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.agencies ?? []);
          setSuggestionsOpen(true);
        }
      } catch { /* ignore network errors */ }
      finally { setSuggestLoading(false); }
    }, 280);
  }, []);

  function handleAgencyInput(value: string) {
    setForm((prev) => ({ ...prev, agencySearch: value, agencySlug: "", agencyIsNew: false }));
    fetchSuggestions(value);
  }

  function selectExistingAgency(ag: AgencySuggestion) {
    setForm((prev) => ({ ...prev, agencySearch: ag.name, agencySlug: ag.slug, agencyIsNew: false }));
    setSuggestionsOpen(false);
  }

  function selectNewAgency() {
    setForm((prev) => ({ ...prev, agencyIsNew: true, agencySlug: "" }));
    setSuggestionsOpen(false);
  }

  // ── Photo helpers ──────────────────────────────────────────────────────────

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []).filter(
      (f) => PHOTO_TYPES.has(f.type.toLowerCase()) && f.size <= MAX_PHOTO_SIZE
    );
    const combined = [...photoFiles, ...newFiles].slice(0, MAX_PHOTOS);
    setPhotoFiles(combined);
    const previews = await Promise.all(combined.map(readAsDataURL));
    setPhotoPreviews(previews);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    const nextFiles    = photoFiles.filter((_, i) => i !== index);
    const nextPreviews = photoPreviews.filter((_, i) => i !== index);
    setPhotoFiles(nextFiles);
    setPhotoPreviews(nextPreviews);
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setSubmitError(null);
    try {
      const ACCOM_MAP:     Record<string, string> = { yes: "YES",  no: "NO",  unknown: "UNKNOWN" };
      const RECOMMEND_MAP: Record<string, string> = { yes: "YES",  no: "NO",  neutral: "UNSURE"  };

      const fd = new FormData();

      // Agency: either existing slug or free-text name (API will create it)
      if (form.agencyIsNew) {
        fd.set("agencyName", form.agencySearch.trim());
      } else {
        fd.set("agencySlug", form.agencySlug);
      }

      fd.set("salaryRating",          String(form.rating));
      fd.set("managementRating",      String(form.rating));
      fd.set("contractClarityRating", String(form.rating));
      fd.set("overallRating",         String(form.rating));
      fd.set("accommodationProvided", ACCOM_MAP[form.housingIncluded]  ?? "UNKNOWN");
      fd.set("wouldRecommend",        RECOMMEND_MAP[form.wouldRecommend] ?? "UNSURE");
      if (form.city.trim())    fd.set("city",    form.city.trim());
      if (form.jobType.trim()) fd.set("jobType", form.jobType.trim());
      if (form.comment.trim()) fd.set("comment", form.comment.trim());
      if (form.housingIncluded === "yes") {
        if (form.housingCost.trim())   fd.set("weeklyRent",    form.housingCost.trim());
        if (form.peoplePerRoom.trim()) fd.set("peopleInHouse", form.peoplePerRoom.trim());
      }

      // Append photos
      for (const file of photoFiles) {
        fd.append("photos", file);
      }

      const res  = await fetch("/api/reviews", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);

      const resolvedSlug: string = (data.agencySlug as string) || form.agencySlug || "unknown";
      setSubmitted(true);
      onSubmitSuccess?.({
        agencySlug: resolvedSlug,
        review: {
          id:                    (data.reviewId as string) ?? `pending-${Date.now()}`,
          reviewType:            "ANONYMOUS",
          overallRating:         form.rating,
          salaryRating:          form.rating,
          managementRating:      form.rating,
          contractClarityRating: form.rating,
          housingRating:         null,
          comment:               form.comment.trim() || null,
          city:                  form.city.trim() || null,
          jobTitle:              form.jobType || null,
          createdAt:             new Date().toISOString(),
          verificationStatus:    "WORKER_REPORTED",
          issueTags:             [],
        },
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-8 text-center">
        <p className="text-3xl mb-3">✅</p>
        <p className="text-base font-bold text-green-800 mb-1">{t("reviews_page.form_success_title")}</p>
        <p className="text-sm text-green-600 leading-relaxed">
          {t("reviews_page.form_success_sub")}
        </p>
        <button
          onClick={() => {
            setForm(INITIAL_FORM);
            setPhotoFiles([]);
            setPhotoPreviews([]);
            setSubmitted(false);
          }}
          className="mt-4 text-xs text-green-700 border border-green-300 rounded-full px-4 py-1.5 hover:bg-green-100 transition-colors"
        >
          {t("reviews_page.form_submit_another")}
        </button>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Submit error */}
      {submitError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* ── Agency combobox ─────────────────────────────────────────────────── */}
      <div ref={comboboxRef} className="relative">
        <label className="block text-sm font-bold text-gray-800 mb-1.5">
          {t("reviews_page.form_agency_label")} <span className="text-red-500">*</span>
        </label>
        <div className={`flex items-center rounded-xl border overflow-hidden transition-all ${
          form.agencySlug
            ? "border-green-400 ring-2 ring-green-100"
            : form.agencyIsNew
            ? "border-amber-400 ring-2 ring-amber-100"
            : "border-gray-300"
        }`}>
          <input
            type="text"
            value={form.agencySearch}
            onChange={(e) => handleAgencyInput(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setSuggestionsOpen(true); }}
            placeholder="Type agency name…"
            autoComplete="off"
            className="flex-1 px-3.5 py-2.5 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <span className="pr-3 shrink-0">
            {suggestLoading
              ? <span className="text-gray-400 text-xs animate-pulse">…</span>
              : form.agencySlug
              ? <span className="text-green-500 text-sm">✓</span>
              : form.agencyIsNew
              ? <span className="text-amber-500 text-sm">✦</span>
              : null}
          </span>
        </div>

        {/* Status line below input */}
        {form.agencySlug && (
          <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
            ✓ Found in database
          </p>
        )}
        {form.agencyIsNew && form.agencySearch.trim().length > 2 && (
          <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
            ✦ Will be added as a new agency — thank you!
          </p>
        )}

        {/* Suggestions dropdown */}
        {suggestionsOpen && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            {suggestions.length > 0 && (
              <ul>
                {suggestions.map((ag) => (
                  <li key={ag.id}>
                    <button
                      type="button"
                      onMouseDown={() => selectExistingAgency(ag)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                    >
                      <span className="shrink-0">🏢</span>
                      <span className="font-medium">{ag.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* "Add as new" option */}
            {form.agencySearch.trim().length > 2 && (
              <>
                {suggestions.length > 0 && <div className="border-t border-gray-100" />}
                <button
                  type="button"
                  onMouseDown={selectNewAgency}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 transition-colors flex items-center gap-2.5 text-amber-700"
                >
                  <span className="shrink-0">➕</span>
                  <span>Add &ldquo;{form.agencySearch.trim()}&rdquo; as new agency</span>
                </button>
              </>
            )}

            {suggestions.length === 0 && form.agencySearch.trim().length < 3 && (
              <p className="px-4 py-3 text-sm text-gray-400">Keep typing to search…</p>
            )}
            {suggestions.length === 0 && form.agencySearch.trim().length >= 3 && !suggestLoading && (
              <p className="px-4 py-2 text-xs text-gray-400">No matches — use &ldquo;Add as new&rdquo; below.</p>
            )}
          </div>
        )}
      </div>

      {/* ── City + Job type ──────────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t("reviews_page.form_city")}
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder={t("reviews_page.form_city_placeholder")}
            maxLength={80}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
              text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t("reviews_page.form_job_type")}
          </label>
          <select
            value={form.jobType}
            onChange={(e) => set("jobType", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
              text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="">{t("reviews_page.form_job_select")}</option>
            {JOB_TYPE_OPTIONS.map((jt) => (
              <option key={jt} value={jt}>{jt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Overall rating ───────────────────────────────────────────────────── */}
      <div className="bg-gray-50 rounded-xl p-4">
        <StarSelector
          value={form.rating}
          onChange={(v) => set("rating", v)}
          label={t("reviews_page.form_rating_label")}
        />
        {form.rating > 0 && (
          <p className="text-xs text-gray-500 mt-1.5">
            {form.rating === 1 && t("reviews_page.rating_1")}
            {form.rating === 2 && t("reviews_page.rating_2")}
            {form.rating === 3 && t("reviews_page.rating_3")}
            {form.rating === 4 && t("reviews_page.rating_4")}
            {form.rating === 5 && t("reviews_page.rating_5")}
          </p>
        )}
      </div>

      {/* ── Housing ─────────────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold text-gray-700 mb-2">{t("reviews_page.form_housing_label")}</p>
        <div className="flex gap-2 flex-wrap">
          {(["yes", "no", "unknown"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set("housingIncluded", v)}
              className={`text-xs font-semibold rounded-full px-3.5 py-1.5 border transition-all ${
                form.housingIncluded === v
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
              }`}
            >
              {v === "yes" ? t("reviews_page.form_housing_yes") : v === "no" ? t("reviews_page.form_housing_no") : t("reviews_page.form_housing_unknown")}
            </button>
          ))}
        </div>
      </div>

      {/* Housing cost + people per room (only if housing = yes) */}
      {form.housingIncluded === "yes" && (
        <div className="grid sm:grid-cols-2 gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t("reviews_page.form_housing_cost")}
            </label>
            <input
              type="number"
              value={form.housingCost}
              onChange={(e) => set("housingCost", e.target.value)}
              placeholder="e.g. 140"
              min={0}
              max={500}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
                text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {t("reviews_page.form_people_per_room")}
            </label>
            <input
              type="number"
              value={form.peoplePerRoom}
              onChange={(e) => set("peoplePerRoom", e.target.value)}
              placeholder="e.g. 2"
              min={1}
              max={10}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
                text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* ── Transport cost ───────────────────────────────────────────────────── */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {t("reviews_page.form_transport_cost")}{" "}
          <span className="text-gray-400 font-normal">{t("reviews_page.form_transport_note")}</span>
        </label>
        <input
          type="number"
          value={form.transportCost}
          onChange={(e) => set("transportCost", e.target.value)}
          placeholder="e.g. 28 — or 0 if included free"
          min={0}
          max={200}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
            text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {/* ── Would recommend ──────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold text-gray-700 mb-2">{t("reviews_page.form_recommend_label")}</p>
        <div className="flex gap-2 flex-wrap">
          {(["yes", "no", "neutral"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set("wouldRecommend", v)}
              className={`text-xs font-semibold rounded-full px-3.5 py-1.5 border transition-all ${
                form.wouldRecommend === v
                  ? v === "yes"
                    ? "bg-green-600 text-white border-green-600"
                    : v === "no"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
              }`}
            >
              {v === "yes" ? t("reviews_page.form_recommend_yes") : v === "no" ? t("reviews_page.form_recommend_no") : t("reviews_page.form_recommend_neutral")}
            </button>
          ))}
        </div>
      </div>

      {/* ── Comment ──────────────────────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1.5">
          {t("reviews_page.form_comment_label")} <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.comment}
          onChange={(e) => set("comment", e.target.value)}
          placeholder={t("reviews_page.form_comment_placeholder")}
          rows={5}
          maxLength={2000}
          className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-xl bg-white
            text-gray-900 placeholder:text-gray-400 resize-none
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
            leading-relaxed"
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-[10px] text-gray-400">
            Minimum 10 characters. No personal names or private details.
          </p>
          <p className="text-xs text-gray-400">{form.comment.length}/2000</p>
        </div>
      </div>

      {/* ── Photo upload ─────────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold text-gray-700 mb-2">
          Photos{" "}
          <span className="font-normal text-gray-400">(optional, max {MAX_PHOTOS})</span>
        </p>

        {/* Preview grid — shown once photos are chosen */}
        {photoFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-2">
            {photoPreviews.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
              >
                {src && (
                  <img
                    src={src}
                    alt={`Upload ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label="Remove photo"
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-900/70 text-white
                    text-[10px] flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Add-more slot */}
            {photoFiles.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Add photo"
                className="aspect-square rounded-xl border-2 border-dashed border-gray-300
                  flex items-center justify-center text-gray-400 text-2xl
                  hover:border-gray-400 hover:text-gray-600 transition-colors bg-gray-50"
              >
                +
              </button>
            )}
          </div>
        )}

        {/* Upload trigger — shown when no photos yet */}
        {photoFiles.length === 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3.5
              text-xs text-gray-400 hover:border-gray-300 hover:text-gray-600
              transition-colors flex items-center justify-center gap-2"
          >
            <span>📷</span>
            <span>Add photos (JPG / PNG / WebP, max 8 MB each)</span>
          </button>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handlePhotoSelect}
        />

        <p className="text-[10px] text-gray-400 mt-1.5">
          Photos help verify your experience. No faces or personal information.
        </p>
      </div>

      {/* ── Submit ───────────────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full py-3.5 rounded-xl font-black text-sm transition-all shadow-sm
          bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98]
          disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {loading ? t("reviews_page.form_submitting") : t("reviews_page.form_submit")}
      </button>

      {!isValid && (
        <p className="text-xs text-gray-400 text-center">
          {t("reviews_page.form_invalid_note")}
        </p>
      )}

      {/* ── Legal disclaimer ─────────────────────────────────────────────────── */}
      <p className="text-[10px] text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
        By submitting you confirm this review is based on your own personal experience and is
        truthful to the best of your knowledge. Deliberately false statements that damage an
        agency&apos;s reputation may constitute defamation under Dutch law. Do not include
        personal data of other individuals. See our{" "}
        <a href="/terms" className="underline hover:text-gray-600">Terms of Use</a>{" "}
        for our content moderation policy.
      </p>

      <p className="text-[10px] text-gray-400 text-center leading-relaxed">
        {t("reviews_page.form_anon_note")}
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reviews feed
// ─────────────────────────────────────────────────────────────────────────────

type SortKey = "newest" | "worst" | "best";

const FILTER_AGENCIES = Array.from(
  new Set(REVIEW_SEED_DATA.map((r) => r.agencySlug))
).sort();

const FILTER_CITIES = Array.from(
  new Set(REVIEW_SEED_DATA.map((r) => r.city).filter(Boolean))
).sort() as string[];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FILTER_JOB_TYPES = Array.from(
  new Set(REVIEW_SEED_DATA.map((r) => r.jobTitle).filter(Boolean))
).sort() as string[];

// Shape returned by GET /api/reviews (global feed)
interface DbReview {
  id:                    string;
  reviewType:            string;
  title?:                string | null;
  overallRating:         number;
  salaryRating:          number;
  housingRating?:        number | null;
  managementRating:      number;
  contractClarityRating: number;
  issueTags:             string;
  verificationStatus:    string;
  comment?:              string | null;
  jobTitle?:             string | null;
  city?:                 string | null;
  createdAt:             string;
  agency:                { slug: string; name: string };
}

function dbToCard(r: DbReview): WorkerReview & { agencySlug: string; agencyName: string; isReal: true } {
  let tags: string[] = [];
  try { tags = JSON.parse(r.issueTags) as string[]; } catch { tags = []; }
  return {
    id:                    r.id,
    reviewType:            (r.reviewType as "ANONYMOUS" | "VERIFIED_WORKER") ?? "ANONYMOUS",
    title:                 r.title,
    overallRating:         r.overallRating,
    salaryRating:          r.salaryRating,
    housingRating:         r.housingRating ?? null,
    managementRating:      r.managementRating,
    contractClarityRating: r.contractClarityRating,
    issueTags:             tags,
    verificationStatus:    (r.verificationStatus as "VERIFIED" | "WORKER_REPORTED" | "UNKNOWN") ?? "UNKNOWN",
    comment:               r.comment,
    jobTitle:              r.jobTitle,
    city:                  r.city,
    createdAt:             r.createdAt,
    agencySlug:            r.agency.slug,
    agencyName:            r.agency.name,
    isReal:                true,
  };
}

function ReviewsFeed({ t, locale }: { t: (key: string, vars?: Record<string, string | number>) => string; locale: Locale }) {
  const [agencyFilter,  setAgencyFilter]  = useState("");
  const [cityFilter,    setCityFilter]    = useState("");
  const [housingFilter, setHousingFilter] = useState<"" | "yes" | "no">(""); // "" = all
  const [sortKey,       setSortKey]       = useState<SortKey>("newest");
  const [showCount,     setShowCount]     = useState(12);

  // Real user-submitted reviews from the database — always pinned first
  const [dbReviews, setDbReviews] = useState<ReturnType<typeof dbToCard>[]>([]);
  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.ok ? r.json() : { reviews: [] })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: { reviews: DbReview[] }) => {
        setDbReviews((data.reviews ?? []).map(dbToCard));
      })
      .catch(() => {/* silently ignore — seed data still shown */});
  }, []);

  const { filteredDb, filteredSeed } = useMemo(() => {
    // Apply filters to seed data
    let seed = [...REVIEW_SEED_DATA];
    if (agencyFilter) seed = seed.filter((r) => r.agencySlug === agencyFilter);
    if (cityFilter)   seed = seed.filter((r) => r.city?.toLowerCase().includes(cityFilter.toLowerCase()));
    if (housingFilter === "yes") seed = seed.filter((r) => r.housingRating != null);
    if (housingFilter === "no")  seed = seed.filter((r) => r.housingRating == null);

    switch (sortKey) {
      case "newest": seed.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case "worst":  seed.sort((a, b) => a.overallRating - b.overallRating); break;
      case "best":   seed.sort((a, b) => b.overallRating - a.overallRating); break;
    }

    // Apply same filters to DB reviews (real submissions)
    let db = [...dbReviews];
    if (agencyFilter) db = db.filter((r) => r.agencySlug === agencyFilter);
    if (cityFilter)   db = db.filter((r) => r.city?.toLowerCase().includes(cityFilter.toLowerCase()));
    if (housingFilter === "yes") db = db.filter((r) => r.housingRating != null);
    if (housingFilter === "no")  db = db.filter((r) => r.housingRating == null);

    // DB reviews keep their own newest-first ordering regardless of sort
    // (they're always pinned at top — users see real reviews first)
    return { filteredDb: db, filteredSeed: seed };
  }, [agencyFilter, cityFilter, housingFilter, sortKey, dbReviews]);

  const totalCount = filteredDb.length + filteredSeed.length;
  const visible = useMemo(() => {
    const combined = [
      ...filteredDb,   // real submissions always first
      ...filteredSeed.map((r, i) => ({ ...seedToCard(r, i), agencySlug: r.agencySlug, agencyName: agencyDisplayName(r.agencySlug), isReal: false as const })),
    ];
    return combined.slice(0, showCount);
  }, [filteredDb, filteredSeed, showCount]);

  return (
    <div>
      {/* Compact filter bar — single row, no background box */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <select
          value={agencyFilter}
          onChange={(e) => { setAgencyFilter(e.target.value); setShowCount(12); }}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-gray-400"
        >
          <option value="">{t("reviews_page.filter_agency_all")}</option>
          {FILTER_AGENCIES.map((slug) => (
            <option key={slug} value={slug}>
              {agencyDisplayName(slug)}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={cityFilter}
          onChange={(e) => { setCityFilter(e.target.value); setShowCount(12); }}
          placeholder={t("reviews_page.filter_city_placeholder")}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 w-28"
        />
        {/* Housing pills */}
        <div className="flex items-center gap-1">
          {(["", "yes", "no"] as const).map((v) => (
            <button
              key={v || "all"}
              onClick={() => { setHousingFilter(v); setShowCount(12); }}
              className={`text-[10px] font-semibold rounded-full px-2.5 py-1 border transition-all ${
                housingFilter === v
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {v === "" ? t("reviews_page.filter_housing_all") : v === "yes" ? t("reviews_page.filter_housing_with") : t("reviews_page.filter_housing_without")}
            </button>
          ))}
        </div>
        {/* Sort pills */}
        <div className="flex items-center gap-1 ml-auto">
          {(["newest", "worst", "best"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortKey(s)}
              className={`text-[10px] font-semibold rounded-full px-2.5 py-1 border transition-all capitalize ${
                sortKey === s
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {s === "newest" ? t("reviews_page.filter_sort_newest") : s === "worst" ? t("reviews_page.filter_sort_worst") : t("reviews_page.filter_sort_best")}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-400 mb-4">
        {t("reviews_page.showing_count", { shown: Math.min(showCount, totalCount), total: totalCount, plural: totalCount !== 1 ? "s" : "" })}
        {agencyFilter && ` for ${agencyDisplayName(agencyFilter)}`}
        {filteredDb.length > 0 && (
          <span className="ml-2 text-emerald-600 font-semibold">
            · {filteredDb.length} real submission{filteredDb.length !== 1 ? "s" : ""} shown first
          </span>
        )}
      </p>

      {/* Cards */}
      {visible.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm text-gray-500 font-semibold">{t("reviews_page.no_results")}</p>
          <p className="text-xs text-gray-400 mt-1">{t("reviews_page.no_results_sub")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((r, i) => (
            <div key={`${r.id}-${i}`}>
              {/* Agency label + real-submission badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <Link
                  href={`/agencies/${r.agencySlug}`}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  🏢 {r.agencyName ?? agencyDisplayName(r.agencySlug)}
                </Link>
                {r.isReal && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real submission
                  </span>
                )}
              </div>
              <WorkerReviewCard review={r} locale={locale} />
            </div>
          ))}

          {/* Load more */}
          {showCount < totalCount && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowCount((n) => n + 12)}
                className="text-sm font-semibold text-gray-700 border border-gray-300 rounded-full px-6 py-2 hover:bg-gray-50 transition-colors"
              >
                {t("reviews_page.load_more", { remaining: totalCount - showCount })}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ReviewsClientPage({ locale = "en" }: { locale?: Locale }) {
  const t = useT(locale);
  const [pendingReview, setPendingReview] = useState<{ agencySlug: string; review: WorkerReview } | null>(null);

  const totalReviews = REVIEW_SEED_DATA.length;
  const verifiedCount = REVIEW_SEED_DATA.filter(
    (r) => r.verificationStatus === "VERIFIED"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">{t("common.home")}</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">{t("nav.reviews")}</span>
      </nav>

      {/* Compact header — badges + title + subheading in one tight block */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-800 rounded-full px-2.5 py-1">
            {t("reviews_page.badge_reviews", { count: totalReviews })}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-800 rounded-full px-2.5 py-1">
            {t("reviews_page.badge_verified", { count: verifiedCount })}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
            {t("reviews_page.badge_not_advertising")}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-1">
          {t("reviews_page.heading")}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
          {t("reviews_page.subheading")}
        </p>
      </div>

      {/* Two-column layout — flex so sticky sidebar works naturally */}
      <div className="lg:flex lg:items-start lg:gap-8">

        {/* LEFT — sticky form (desktop: fixed width, sticks while right scrolls) */}
        <div id="review-form" className="lg:w-[360px] lg:shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-20">
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-5 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto">
            <div className="mb-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">
                {t("reviews_page.share_experience_label")}
              </p>
              <h2 className="text-lg font-black text-gray-900 leading-tight">
                {t("reviews_page.form_title")}
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {t("reviews_page.form_sub")}
              </p>
            </div>
            <ReviewSubmitForm t={t} onSubmitSuccess={setPendingReview} />

            {/* Trust signals — tucked inside form card, below submit */}
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
              {[
                { icon: "👤", title: t("reviews_page.trust_1_title"), desc: t("reviews_page.trust_1_desc") },
                { icon: "📊", title: t("reviews_page.trust_2_title"), desc: t("reviews_page.trust_2_desc") },
                { icon: "🚫", title: t("reviews_page.trust_3_title"), desc: t("reviews_page.trust_3_desc") },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-2">
                  <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-700">{item.title}</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — reviews feed, immediately visible above the fold */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-gray-900">
              {t("reviews_page.recent_title")}
            </h2>
            <p className="text-xs text-gray-400">{t("reviews_page.total_count", { count: totalReviews })}</p>
          </div>

          {/* Optimistic preview — newly submitted review shown immediately at top */}
          {pendingReview && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Link
                  href={`/agencies/${pendingReview.agencySlug}`}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  🏢 {agencyDisplayName(pendingReview.agencySlug)}
                </Link>
                <span className="text-[10px] font-bold bg-green-100 text-green-800 rounded-full px-2 py-0.5">
                  ✓ Just published
                </span>
              </div>
              <WorkerReviewCard review={pendingReview.review} locale={locale} />
            </div>
          )}

          <ReviewsFeed t={t} locale={locale} />
          {/* Disclaimer banner after first batch of reviews, not before */}
          <WorkerDisclaimer variant="reviews" size="banner" className="mt-6" />
        </div>
      </div>

      {/* Bottom CTA to browse agencies */}
      <div className="mt-12 bg-gray-900 rounded-2xl px-6 py-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-black text-base mb-1">{t("reviews_page.cta_title")}</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            {t("reviews_page.cta_sub")}
          </p>
        </div>
        <Link
          href="/agencies"
          className="shrink-0 bg-white text-gray-900 font-black text-sm px-5 py-3 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap"
        >
          {t("reviews_page.cta_button", { count: "150+" })}
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          {t("reviews_page.disclaimer")}
        </p>
      </div>
    </div>
  );
}
