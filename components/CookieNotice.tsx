"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useT, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "ac_cookie_notice_dismissed";

/**
 * CookieNotice — minimal, non-intrusive cookie disclosure bar.
 *
 * AgencyCheck uses only:
 *   - ac_locale cookie (language preference, 1 year)
 *   - sessionStorage for dismissed popups (session only)
 *
 * No advertising, no tracking, no analytics cookies.
 * Vercel Analytics is cookieless.
 *
 * We still show this bar because:
 *   1. The ac_locale cookie requires disclosure under ePrivacy Directive.
 *   2. It re-confirms our no-tracking stance (builds trust with workers).
 *   3. It links to the full privacy policy for transparency.
 */
export default function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    // Detect locale from the html lang attribute (set by Next.js per route)
    const lang = document.documentElement.lang as Locale;
    if (["en", "nl", "pl", "ro", "pt", "sk", "bg"].includes(lang)) {
      setLocale(lang);
    }
    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      // sessionStorage not available (private browsing restrictions) — just hide
    }
  }, []);

  const t = useT(locale);

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-lg"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs text-gray-600 leading-relaxed flex-1">
          {t("cookie_notice.text")}{" "}
          <Link href="/cookies" className="text-brand-600 underline hover:text-brand-700">
            {t("cookie_notice.policy_link")}
          </Link>
          .
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg transition-colors"
        >
          {t("cookie_notice.btn")}
        </button>
      </div>
    </div>
  );
}
