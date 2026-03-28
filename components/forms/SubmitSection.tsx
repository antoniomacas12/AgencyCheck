"use client";

import { useState } from "react";
import ReviewForm from "./ReviewForm";
import SalaryReportForm from "./SalaryReportForm";
import IssueReportForm from "./IssueReportForm";

type Tab = "review" | "salary" | "issue";

interface SubmitSectionProps {
  agencySlug: string;
  agencyName: string;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "review", label: "Leave review",   icon: "⭐" },
  { id: "salary", label: "Report salary",  icon: "💶" },
  { id: "issue",  label: "Report issue",   icon: "⚠️" },
];

// ─── Success banner ───────────────────────────────────────────────────────────

const SUCCESS_MESSAGES: Record<Tab, string> = {
  review: "✅ Review submitted. Thank you for helping other workers.",
  salary: "✅ Salary report submitted. Your data helps workers compare agencies.",
  issue:  "✅ Issue report submitted. It will appear as a community-reported issue.",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubmitSection({ agencySlug, agencyName }: SubmitSectionProps) {
  const [activeTab,    setActiveTab]    = useState<Tab | null>(null);
  const [successTab,   setSuccessTab]   = useState<Tab | null>(null);

  function handleSuccess(tab: Tab) {
    setActiveTab(null);
    setSuccessTab(tab);
    // Clear success banner after 6 seconds
    setTimeout(() => setSuccessTab(null), 6000);
  }

  return (
    <div className="mt-8 border-t border-gray-100 pt-8">
      {/* Worker CTA */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">Did you work through this agency?</h2>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          Share your experience or ask questions about real salary, accommodation, and working conditions.
          Your information helps other workers make better decisions.
        </p>
        <p className="text-xs text-gray-400 mt-1.5">
          All submissions are anonymous and worker-reported.
        </p>
      </div>

      {/* Success banner */}
      {successTab && (
        <div className="mb-4 flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <span className="text-green-600 text-sm leading-relaxed">
            {SUCCESS_MESSAGES[successTab]}
          </span>
          <button
            onClick={() => setSuccessTab(null)}
            className="ml-auto shrink-0 text-green-400 hover:text-green-600"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab buttons */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(isActive ? null : tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                border transition-all active:scale-95
                ${isActive
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:text-brand-600"
                }`}
              aria-expanded={isActive}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active form panel */}
      {activeTab && (
        <div className="mt-4 card p-5">
          {activeTab === "review" && (
            <ReviewForm
              agencySlug={agencySlug}
              agencyName={agencyName}
              onSuccess={() => handleSuccess("review")}
            />
          )}
          {activeTab === "salary" && (
            <SalaryReportForm
              agencySlug={agencySlug}
              agencyName={agencyName}
              onSuccess={() => handleSuccess("salary")}
            />
          )}
          {activeTab === "issue" && (
            <IssueReportForm
              agencySlug={agencySlug}
              agencyName={agencyName}
              onSuccess={() => handleSuccess("issue")}
            />
          )}
        </div>
      )}
    </div>
  );
}
