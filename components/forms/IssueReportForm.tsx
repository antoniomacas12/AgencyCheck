"use client";

import { useState } from "react";

interface IssueReportFormProps {
  agencySlug: string;
  agencyName: string;
  onSuccess:  () => void;
}

interface FormState {
  issueType:     string;
  description:   string;
  amountMissing: string;
}

const INITIAL: FormState = {
  issueType:     "",
  description:   "",
  amountMissing: "",
};

const ISSUE_TYPE_OPTIONS = [
  { value: "MISSING_OVERTIME",   label: "Missing overtime pay"   },
  { value: "MISSING_SUNDAY_PAY", label: "Missing Sunday pay"     },
  { value: "LATE_PAYMENT",       label: "Late payment"           },
  { value: "BAD_HOUSING",        label: "Bad housing conditions" },
  { value: "CONTRACT_ISSUE",     label: "Contract issue"         },
  { value: "TRANSPORT_ISSUE",    label: "Transport issue"        },
  { value: "PAYSLIP_PROBLEM",    label: "Payslip problem"        },
];

// Issue types where amount_missing is relevant
const FINANCIAL_ISSUE_TYPES = new Set([
  "MISSING_OVERTIME",
  "MISSING_SUNDAY_PAY",
  "LATE_PAYMENT",
]);

export default function IssueReportForm({
  agencySlug,
  agencyName,
  onSuccess,
}: IssueReportFormProps) {
  const [form,    setForm]    = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const isFinancialIssue = FINANCIAL_ISSUE_TYPES.has(form.issueType);

  const isValid =
    form.issueType.length > 0 &&
    form.description.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError(null);

    try {
      const amountMissing =
        isFinancialIssue && form.amountMissing.trim()
          ? parseFloat(form.amountMissing)
          : null;

      const res = await fetch("/api/issue-reports", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agencySlug,
          issueType:    form.issueType,
          description:  form.description.trim(),
          amountMissing,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setForm(INITIAL);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit issue report");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <p className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-relaxed">
        ⚠️ This report is anonymous and will appear as a community-reported issue. It is{" "}
        <strong>not</strong> a legal complaint. For official complaints, contact the FNV or
        the Dutch Labour Authority (NLA).
      </p>

      {/* Issue type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Issue type <span className="text-red-400 text-xs">required</span>
        </label>
        <select
          value={form.issueType}
          onChange={(e) => setForm((p) => ({ ...p, issueType: e.target.value, amountMissing: "" }))}
          className={`${inputCls} appearance-none`}
        >
          <option value="">Select issue type…</option>
          {ISSUE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Description <span className="text-red-400 text-xs">required</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder={`Describe what happened with ${agencyName}…`}
          rows={4}
          maxLength={3000}
          className={`${inputCls} resize-none`}
        />
        <p className="text-xs text-gray-400 mt-1 flex justify-between">
          <span>Minimum 10 characters</span>
          <span>{form.description.length}/3000</span>
        </p>
      </div>

      {/* Amount missing — only shown for financial issues */}
      {isFinancialIssue && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Approximate amount missing{" "}
            <span className="text-gray-400 font-normal">(optional, €)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
              €
            </span>
            <input
              type="number"
              value={form.amountMissing}
              onChange={(e) => setForm((p) => ({ ...p, amountMissing: e.target.value }))}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`${inputCls} pl-7`}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all
          bg-orange-500 text-white hover:bg-orange-600 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {loading ? "Submitting…" : "Submit issue report"}
      </button>

      {!isValid && form.issueType && form.description.trim().length < 10 && (
        <p className="text-xs text-gray-400 text-center">
          Please write at least 10 characters in the description.
        </p>
      )}
    </form>
  );
}
