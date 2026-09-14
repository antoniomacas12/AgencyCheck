"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useT, type Locale } from "@/lib/i18n";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Consent storage key in localStorage.
 * Value is 'granted' | 'denied'. Persists across browser sessions.
 */
const CONSENT_KEY = "ac_analytics_consent";

function updateGtagConsent(value: "granted" | "denied") {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: value,
  });
}

/**
 * CookieNotice — GDPR-compliant consent banner for Google Analytics 4.
 *
 * AgencyCheck uses:
 *   - ac_locale cookie (language preference, necessary — no consent required)
 *   - Google Analytics 4 via Consent Mode v2 (analytics_storage — opt-in)
 *   - Vercel Analytics (cookieless, no consent required)
 *
 * Consent flow:
 *   1. GA4 default is analytics_storage: 'denied' (set in layout.tsx beforeInteractive)
 *   2. On mount, check localStorage for prior choice:
 *      - 'granted' → update gtag consent to granted, hide banner
 *      - 'denied'  → leave gtag at default denied, hide banner
 *      - null      → show banner with Accept / Decline
 *   3. Accept → gtag consent update 'granted' + store in localStorage
 *   4. Decline → gtag consent update 'denied' + store in localStorage
 *   5. Banner never reappears once a choice is made (localStorage persists)
 *
 * Private browsing: localStorage throws → banner hidden, consent stays denied.
 */
export default function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const lang = document.documentElement.lang as Locale;
    if (["en", "nl", "pl", "ro", "pt", "sk", "bg"].includes(lang)) {
      setLocale(lang);
    }

    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === "granted") {
        updateGtagConsent("granted");
        setVisible(false);
      } else if (stored === "denied") {
        // Consent already denied — default in layout.tsx is already denied
        setVisible(false);
      } else {
        // No prior choice — show banner
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (private browsing) — hide banner, leave consent denied
      setVisible(false);
    }
  }, []);

  const t = useT(locale);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "granted");
    } catch { /* ignore */ }
    updateGtagConsent("granted");
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "denied");
    } catch { /* ignore */ }
    updateGtagConsent("denied");
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
          {". "}
          We use Google Analytics to understand how visitors use this site — only with your consent.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors whitespace-nowrap"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
