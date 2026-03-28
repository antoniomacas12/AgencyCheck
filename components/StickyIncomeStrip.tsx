"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripLocalePrefix, useT } from "@/lib/i18n";

/**
 * StickyIncomeStrip — always-visible bottom bar.
 * Shows after first scroll so it doesn't block the initial hero.
 * Dismissible with X but re-appears on next page load.
 * Fully localized via the i18n system.
 */
export default function StickyIncomeStrip() {
  const [show, setShow]           = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const pathname       = usePathname();
  const { locale }     = stripLocalePrefix(pathname);
  const t              = useT(locale);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 120) setShow(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t-2 border-red-800/60" style={{ zIndex: 20 }}>
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        {/* Message */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base shrink-0">💶</span>
          <p className="text-xs text-gray-300 leading-snug">
            <strong className="text-white">{t("sticky.income_text")}</strong>
            <span className="text-gray-500"> · </span>
            <span className="text-gray-400">{t("sticky.income_after")}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/tools/real-income-calculator"
            className="text-xs font-black bg-white text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            {t("sticky.income_calculate")}
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-600 hover:text-gray-400 transition-colors text-sm p-1"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
