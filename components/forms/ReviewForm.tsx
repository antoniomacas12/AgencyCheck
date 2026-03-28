"use client";

import { useState } from "react";
import StarRatingInput from "./StarRatingInput";
import type { ReviewType } from "@/components/WorkerReviewCard";

interface ReviewFormProps {
  agencySlug: string;
  agencyName: string;
  onSuccess:  () => void;
}

// ─── Issue tag options ─────────────────────────────────────────────────────────

const ISSUE_TAG_OPTIONS: { id: string; label: string; emoji: string }[] = [
  { id: "late_salary",        label: "Late salary payment",      emoji: "🕐" },
  { id: "missing_overtime",   label: "Missing overtime/premium", emoji: "⏰" },
  { id: "payslip_errors",     label: "Payslip errors",           emoji: "📄" },
  { id: "housing_crowded",    label: "Overcrowded housing",      emoji: "🏚️" },
  { id: "housing_dirty",      label: "Poor housing condition",   emoji: "🧹" },
  { id: "unclear_contract",   label: "Unclear contract terms",   emoji: "📋" },
  { id: "transport_delays",   label: "Transport unreliable",     emoji: "🚌" },
  { id: "management_poor",    label: "Poor management",          emoji: "⚠️" },
  { id: "communication_poor", label: "Hard to reach agency",     emoji: "📵" },
  { id: "fair_pay",           label: "Fair/above average pay",   emoji: "✅" },
  { id: "housing_good",       label: "Good housing",             emoji: "🏠" },
  { id: "communication_good", label: "Agency easy to reach",     emoji: "💬" },
];

// ─── State ────────────────────────────────────────────────────────────────────

interface FormState {
  reviewType:            ReviewType;
  title:                 string;
  overallRating:         number;
  salaryRating:          number;
  housingRating:         number;
  managementRating:      number;
  contractClarityRating: number;
  issueTags:             string[];
  comment:               string;
  jobTitle:              string;
  city:                  string;
}

const INITIAL: FormState = {
  reviewType:            "ANONYMOUS",
  title:                 "",
  overallRating:         0,
  salaryRating:          0,
  housingRating:         0,
  managementRating:      0,
  contractClarityRating: 0,
  issueTags:             [],
  comment:               "",
  jobTitle:              "",
  city:                  "",
};

// ─── Review type selector ─────────────────────────────────────────────────────

function ReviewTypeSelector({
  value,
  onChange,
}: {
  value: ReviewType;
  onChange: (v: ReviewType) => void;
}) {
  const options: { id: ReviewType; icon: string; label: string; desc: string }[] = [
    {
      id:    "ANONYMOUS",
      icon:  "👤",
      label: "Anonymous",
      desc:  "No personal details stored. Your review is still valuable.",
    },
    {
      id:    "VERIFIED_WORKER",
      icon:  "✅",
      label: "Verified worker",
      desc:  "Adds credibility. We may ask for contract confirmation.",
    },
  ];

  return (
    <div>
      <p className="text-xs font-medium text-gray-700 mb-2">Review type</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex flex-col items-start text-left gap-0.5 px-3 py-2.5 rounded-xl border text-xs transition-all
              ${value === opt.id
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
          >
            <span className="font-semibold">{opt.icon} {opt.label}</span>
            <span className={`leading-snug ${value === opt.id ? "text-brand-600" : "text-gray-400"}`}>
              {opt.desc}
            </span>
          </button>
        ))}
      </div>
      {value === "ANONYMOUS" && (
        <p className="text-[10px] text-gray-400 mt-1.5">
          👤 Anonymous reviews are not independently verified but still help workers.
        </p>
      )}
      {value === "VERIFIED_WORKER" && (
        <p className="text-[10px] text-green-700 mt-1.5">
          ✅ Verified reviews are flagged with a green badge and carry more weight.
        </p>
      )}
    </div>
  );
}

// ─── Issue tag selector ───────────────────────────────────────────────────────

function IssueTagSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((t) => t !== id)
        : [...selected, id]
    );
  }

  return (
    <div>
      <p className="text-xs font-medium text-gray-700 mb-2">
        Issues or highlights <span className="text-gray-400 font-normal">(optional — select all that apply)</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {ISSUE_TAG_OPTIONS.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={`inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 border transition-all
                ${active
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-700"
                }`}
            >
              <span>{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function ReviewForm({ agencySlug, agencyName, onSuccess }: ReviewFormProps) {
  const [form,    setForm]    = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  function setRating(field: keyof FormState, value: number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Compute auto overall rating from sub-ratings
  const autoOverall = (() => {
    const vals = [
      form.salaryRating,
      form.managementRating,
      form.contractClarityRating,
      ...(form.housingRating > 0 ? [form.housingRating] : []),
    ].filter((v) => v > 0);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  })();

  const displayOverall = form.overallRating > 0 ? form.overallRating : autoOverall;

  const isValid =
    form.salaryRating > 0 &&
    form.managementRating > 0 &&
    form.contractClarityRating > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError(null);

    try {
      // Use FormData so the endpoint stays consistent with photo uploads
      const fd = new FormData();
      fd.set("agencySlug",            agencySlug);
      fd.set("reviewType",            form.reviewType);
      fd.set("salaryRating",          String(form.salaryRating));
      fd.set("managementRating",      String(form.managementRating));
      fd.set("contractClarityRating", String(form.contractClarityRating));
      if (form.housingRating > 0)     fd.set("housingRating", String(form.housingRating));
      if (displayOverall > 0)         fd.set("overallRating", String(displayOverall));
      if (form.title.trim())          fd.set("title",         form.title.trim());
      if (form.comment.trim())        fd.set("comment",       form.comment.trim());
      if (form.jobTitle.trim())       fd.set("jobTitle",      form.jobTitle.trim());
      if (form.city.trim())           fd.set("city",          form.city.trim());

      const res = await fetch("/api/reviews", { method: "POST", body: fd });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      setForm(INITIAL);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

      {/* Context line */}
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
        Rate your experience working with <strong>{agencyName}</strong>.
        Your submission helps other workers make better decisions.
      </p>

      {/* Review type */}
      <ReviewTypeSelector
        value={form.reviewType}
        onChange={(v) => setForm((p) => ({ ...p, reviewType: v }))}
      />

      {/* Headline title */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Review headline <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="e.g. Good pay but housing was overcrowded"
          maxLength={120}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
            text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {/* Required ratings */}
      <div className="space-y-4">
        <StarRatingInput
          label="Salary & pay"
          value={form.salaryRating}
          onChange={(v) => setRating("salaryRating", v)}
          required
        />
        <StarRatingInput
          label="Management"
          value={form.managementRating}
          onChange={(v) => setRating("managementRating", v)}
          required
        />
        <StarRatingInput
          label="Contract clarity"
          value={form.contractClarityRating}
          onChange={(v) => setRating("contractClarityRating", v)}
          required
        />
        <StarRatingInput
          label="Housing (if applicable)"
          value={form.housingRating}
          onChange={(v) => setRating("housingRating", v)}
          optional
        />
      </div>

      {/* Overall rating — auto-computed but adjustable */}
      <div>
        <p className="text-xs font-medium text-gray-700 mb-1">
          Overall rating{" "}
          <span className="text-gray-400 font-normal">
            (auto: {autoOverall > 0 ? `${autoOverall}/5` : "–"} · click to override)
          </span>
        </p>
        <StarRatingInput
          label=""
          value={displayOverall}
          onChange={(v) => setRating("overallRating", v)}
          optional
        />
      </div>

      {/* Issue tags */}
      <IssueTagSelector
        selected={form.issueTags}
        onChange={(tags) => setForm((p) => ({ ...p, issueTags: tags }))}
      />

      {/* Optional fields: job title + city */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Job title <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={form.jobTitle}
            onChange={(e) => setForm((p) => ({ ...p, jobTitle: e.target.value }))}
            placeholder="e.g. Order picker"
            maxLength={80}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
              text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            City <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            placeholder="e.g. Amsterdam"
            maxLength={80}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white
              text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Comment <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={form.comment}
          onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
          placeholder="What was your experience — housing conditions, pay accuracy, management, working hours…"
          rows={3}
          maxLength={2000}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white
            text-gray-900 placeholder:text-gray-400 resize-none
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{form.comment.length}/2000</p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all
          bg-brand-600 text-white hover:bg-brand-700 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {loading
          ? "Submitting…"
          : form.reviewType === "VERIFIED_WORKER"
            ? "Submit verified review"
            : "Submit anonymous review"}
      </button>

      {!isValid && (
        <p className="text-xs text-gray-400 text-center">
          Please rate salary, management, and contract clarity to continue.
        </p>
      )}
    </form>
  );
}
