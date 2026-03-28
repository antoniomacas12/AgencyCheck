"use client";

import { useState } from "react";

interface SalaryReportFormProps {
  agencySlug: string;
  agencyName: string;
  onSuccess:  () => void;
}

interface FormState {
  jobTitle:  string;
  city:      string;
  hourlyPay: string;
  housing:   "YES" | "NO" | "UNKNOWN";
}

const INITIAL: FormState = {
  jobTitle:  "",
  city:      "",
  hourlyPay: "",
  housing:   "UNKNOWN",
};

const HOUSING_OPTIONS = [
  { value: "YES",     label: "🏠 Yes — housing included" },
  { value: "NO",      label: "🚫 No — not included"     },
  { value: "UNKNOWN", label: "❓ I don't know"           },
] as const;

export default function SalaryReportForm({
  agencySlug,
  agencyName,
  onSuccess,
}: SalaryReportFormProps) {
  const [form,    setForm]    = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const isValid =
    form.jobTitle.trim().length > 0 &&
    form.city.trim().length > 0 &&
    parseFloat(form.hourlyPay) > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/salary-reports", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agencySlug,
          jobTitle:  form.jobTitle.trim(),
          city:      form.city.trim(),
          hourlyPay: parseFloat(form.hourlyPay),
          housing:   form.housing,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setForm(INITIAL);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit salary report");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
        Your report is anonymous. Help other workers understand what{" "}
        <strong>{agencyName}</strong> pays for different roles.
      </p>

      {/* Job title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Job title <span className="text-red-400 text-xs">required</span>
        </label>
        <input
          type="text"
          value={form.jobTitle}
          onChange={(e) => setForm((p) => ({ ...p, jobTitle: e.target.value }))}
          placeholder="e.g. Order Picker, Forklift Driver"
          maxLength={200}
          className={inputCls}
        />
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          City <span className="text-red-400 text-xs">required</span>
        </label>
        <input
          type="text"
          value={form.city}
          onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
          placeholder="e.g. Rotterdam"
          maxLength={100}
          className={inputCls}
        />
      </div>

      {/* Hourly pay */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Hourly pay (€/hr) <span className="text-red-400 text-xs">required</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            €
          </span>
          <input
            type="number"
            value={form.hourlyPay}
            onChange={(e) => setForm((p) => ({ ...p, hourlyPay: e.target.value }))}
            placeholder="13.50"
            min="5"
            max="200"
            step="0.01"
            className={`${inputCls} pl-7`}
          />
        </div>
      </div>

      {/* Housing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Did this agency include housing?
        </label>
        <div className="flex flex-col gap-1.5">
          {HOUSING_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                form.housing === opt.value
                  ? "border-brand-400 bg-brand-50 text-brand-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="housing"
                value={opt.value}
                checked={form.housing === opt.value}
                onChange={() => setForm((p) => ({ ...p, housing: opt.value }))}
                className="accent-brand-600"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
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
        {loading ? "Submitting…" : "Submit salary report"}
      </button>
    </form>
  );
}
