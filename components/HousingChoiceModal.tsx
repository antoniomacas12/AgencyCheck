"use client";

/**
 * HousingChoiceModal
 *
 * Intermediate step shown before the main lead form.
 * User picks between "With housing" or "No housing needed".
 * Fully localized via the i18n system.
 */

import { usePathname } from "next/navigation";
import { stripLocalePrefix, useT } from "@/lib/i18n";

export type HousingPreference = "with_housing" | "no_housing";

interface HousingChoiceModalProps {
  onChoice: (choice: HousingPreference) => void;
  onClose: () => void;
}

export default function HousingChoiceModal({ onChoice, onClose }: HousingChoiceModalProps) {
  const pathname = usePathname();
  const { locale } = stripLocalePrefix(pathname);
  const t = useT(locale);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative z-10 w-full sm:max-w-sm mx-0 sm:mx-4 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl px-5 pt-6 pb-7"
        style={{ animation: "slideUp .22s ease" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label={t("apply_modal.success_close")}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Heading */}
        <h2 className="text-lg font-bold text-gray-900 mb-1 pr-8">{t("housing_choice.heading")}</h2>
        <p className="text-sm text-gray-500 mb-5">{t("housing_choice.subtitle")}</p>

        {/* Choice cards */}
        <div className="flex flex-col gap-3">

          {/* Option 1 — With housing */}
          <button
            onClick={() => onChoice("with_housing")}
            className="group flex items-center gap-4 w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-brand-400 hover:bg-brand-50 text-left transition-all"
          >
            <span className="text-3xl leading-none select-none">🏠</span>
            <div>
              <p className="font-bold text-gray-900 text-[15px] group-hover:text-brand-700 transition-colors">
                {t("housing_choice.option_with_housing_title")}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{t("housing_choice.option_with_housing_desc")}</p>
            </div>
            <svg className="ml-auto w-5 h-5 text-gray-300 group-hover:text-brand-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Option 2 — No housing */}
          <button
            onClick={() => onChoice("no_housing")}
            className="group flex items-center gap-4 w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-left transition-all"
          >
            <span className="text-3xl leading-none select-none">💼</span>
            <div>
              <p className="font-bold text-gray-900 text-[15px] transition-colors">
                {t("housing_choice.option_no_housing_title")}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{t("housing_choice.option_no_housing_desc")}</p>
            </div>
            <svg className="ml-auto w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
}
