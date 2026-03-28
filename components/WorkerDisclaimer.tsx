"use client";

import { useT, type Locale } from "@/lib/i18n";
import { useState, useEffect } from "react";

/**
 * WorkerDisclaimer — reusable legal/trust safety component.
 *
 * Variants:
 *  - "reviews"  → UGC/review content disclaimer
 *  - "housing"  → housing photos disclaimer
 *  - "salary"   → salary estimate disclaimer
 *  - "qa"       → Q&A / community disclaimer
 *  - "general"  → generic catch-all
 *
 * Size:
 *  - "inline"   → single-line text (default)
 *  - "banner"   → small banner with icon
 *  - "subtle"   → tiny gray text, minimum visual noise
 */

export type DisclaimerVariant = "reviews" | "housing" | "salary" | "qa" | "general";
export type DisclaimerSize = "inline" | "banner" | "subtle";

interface Props {
  variant?: DisclaimerVariant;
  size?: DisclaimerSize;
  className?: string;
}

const DISCLAIMER_TEXT: Record<DisclaimerVariant, { icon: string; short: string; long: string }> = {
  reviews: {
    icon: "ℹ️",
    short: "Worker-reported experiences. Not verified by AgencyCheck or the agency.",
    long: "Reviews are submitted anonymously by workers and represent personal experiences only. AgencyCheck does not verify claims against agency records. Content does not constitute legal advice or factual statements about the agency. The agency has not paid for or influenced these reviews.",
  },
  housing: {
    icon: "📷",
    short: "Photos submitted by workers. Conditions may vary. Not an official agency representation.",
    long: "These photos were submitted by workers who lived in this accommodation. Photo quality, dates and conditions may vary. AgencyCheck cannot guarantee accuracy or current conditions. Housing provided by agencies may differ from what is shown. Always verify conditions with the agency before accepting.",
  },
  salary: {
    icon: "📊",
    short: "Illustrative estimate based on typical deductions. Your actual take-home may differ.",
    long: "Salary figures are illustrative estimates based on publicly available Dutch tax rates, average housing deduction rates reported by workers, and estimated transport costs. Actual take-home pay depends on your specific contract, tax situation, housing deal, and agency. This is not financial advice.",
  },
  qa: {
    icon: "💬",
    short: "Questions and answers submitted by workers. Not moderated or verified by AgencyCheck.",
    long: "Community Q&A is submitted by workers and job seekers. AgencyCheck does not verify accuracy of answers. Content represents personal opinions and experiences only. Do not rely on this as legal or contractual advice.",
  },
  general: {
    icon: "ℹ️",
    short: "Worker-reported data. AgencyCheck does not guarantee accuracy of information.",
    long: "Information on this page is based on worker-submitted data, seed estimates, or publicly available information. AgencyCheck does not verify all claims. Content is for informational purposes only.",
  },
};

// Reads locale from the ac_locale cookie safely (avoids SSR hydration mismatch)
function useClientLocale(): Locale {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)ac_locale=([^;]+)/);
    const val = match?.[1];
    if (val === "pl" || val === "ro") setLocale(val);
  }, []);
  return locale;
}

export default function WorkerDisclaimer({
  variant = "general",
  size = "inline",
  className = "",
}: Props) {
  const locale  = useClientLocale();
  const t       = useT(locale);

  // Build translated disclaimer text for each variant
  const TRANSLATED: Record<DisclaimerVariant, { icon: string; short: string }> = {
    reviews: { icon: "ℹ️", short: t("legal.reviews_short") },
    housing: { icon: "📷", short: t("legal.housing_photos_short") },
    salary:  { icon: "📊", short: t("legal.salary_estimate_short") },
    qa:      { icon: "💬", short: t("legal.qa_short") },
    general: { icon: "ℹ️", short: t("legal.worker_reported_short") },
  };

  const content = { ...DISCLAIMER_TEXT[variant], ...TRANSLATED[variant] };

  if (size === "subtle") {
    return (
      <p className={`text-[10px] text-gray-500 leading-relaxed ${className}`}>
        {content.icon} {content.short}
      </p>
    );
  }

  if (size === "inline") {
    return (
      <p className={`text-[11px] text-gray-500 leading-relaxed ${className}`}>
        <span className="mr-1">{content.icon}</span>
        {content.short}
      </p>
    );
  }

  // banner
  return (
    <div className={`flex items-start gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2.5 ${className}`}>
      <span className="text-sm shrink-0 mt-0.5">{content.icon}</span>
      <p className="text-[11px] text-gray-600 leading-relaxed">{content.short}</p>
    </div>
  );
}

// ─── Dark variant for dark-background panels ──────────────────────────────────
export function WorkerDisclaimerDark({
  variant = "general",
  size = "inline",
  className = "",
}: Props) {
  const locale  = useClientLocale();
  const t       = useT(locale);
  const TRANSLATED: Record<DisclaimerVariant, { icon: string; short: string }> = {
    reviews: { icon: "ℹ️", short: t("legal.reviews_short") },
    housing: { icon: "📷", short: t("legal.housing_photos_short") },
    salary:  { icon: "📊", short: t("legal.salary_estimate_short") },
    qa:      { icon: "💬", short: t("legal.qa_short") },
    general: { icon: "ℹ️", short: t("legal.worker_reported_short") },
  };
  const content = { ...DISCLAIMER_TEXT[variant], ...TRANSLATED[variant] };

  if (size === "subtle") {
    return (
      <p className={`text-[10px] text-gray-600 leading-relaxed ${className}`}>
        {content.icon} {content.short}
      </p>
    );
  }

  if (size === "inline") {
    return (
      <p className={`text-[11px] text-gray-500 leading-relaxed ${className}`}>
        <span className="mr-1">{content.icon}</span>
        {content.short}
      </p>
    );
  }

  // banner dark
  return (
    <div className={`flex items-start gap-2 bg-gray-900 border border-gray-700/60 rounded-lg px-3 py-2.5 ${className}`}>
      <span className="text-sm shrink-0 mt-0.5">{content.icon}</span>
      <p className="text-[11px] text-gray-400 leading-relaxed">{content.short}</p>
    </div>
  );
}
