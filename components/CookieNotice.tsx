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

const CONSENT_KEY = "ac_analytics_consent";
const GA4_ID = "G-3WP6HM9FTL";
const GA4_SCRIPT_ID = "ga4-gtag-script";

/**
 * Dynamically loads GA4 (gtag.js) after the user explicitly grants consent.
 * This implements Basic Consent Mode — gtag.js is never requested before consent.
 *
 * Sequence (all synchronous before the script tag is appended):
 *   1. Initialise window.dataLayer and window.gtag queue shim
 *   2. Queue consent update (analytics granted, all ad signals denied)
 *   3. Queue GA4 initialisation commands
 *   4. Queue the initial page_view for currentPathname
 *   5. Append <script src="gtag.js"> — gtag.js replays the queue on load
 *
 * Idempotent: subsequent calls after the script tag exists are no-ops.
 */
function loadGA4(currentPathname: string) {
  if (typeof window === "undefined") return;
  // Guard: already loaded — do not append a second gtag.js
  if (document.getElementById(GA4_SCRIPT_ID)) return;

  // Initialise the dataLayer queue and gtag shim.
  // gtag.js will replay all commands queued here when it loads.
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    // Regular function (not arrow) so `arguments` is the Arguments object
    // that gtag.js expects when it processes the dataLayer queue.
    window.gtag = function (..._args: unknown[]) {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer as unknown[]).push(arguments);
    };
  }

  // Consent update: grant analytics only.
  // Ad-related signals remain denied — AgencyCheck does not use Google Ads,
  // remarketing or ad personalisation.
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  // Standard GA4 initialisation (queued — replayed by gtag.js on load).
  // send_page_view: false because we fire the initial page_view explicitly below.
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, { send_page_view: false });

  // Initial page_view for the page the user is on when they consent.
  // GA4PageTracker skips its first render to avoid duplicating this event;
  // it handles all subsequent SPA route-change page_views.
  window.gtag("event", "page_view", {
    page_path: currentPathname,
    page_location: window.location.href,
    page_title: document.title,
  });

  // Load gtag.js — all queued dataLayer commands above are replayed on load.
  const script = document.createElement("script");
  script.id = GA4_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);
}

/**
 * CookieNotice — GDPR-compliant consent banner (Basic Consent Mode).
 *
 * Basic Consent Mode: gtag.js is NOT loaded and no requests reach
 * googletagmanager.com until the user explicitly clicks "Accept analytics".
 *
 * AgencyCheck uses:
 *   - ac_locale cookie (language preference, necessary — no consent required)
 *   - Google Analytics 4 via Basic Consent Mode (explicit opt-in only)
 *   - Vercel Analytics (cookieless, always active, no consent required)
 *
 * Consent flow:
 *   1. On mount, check localStorage for prior choice:
 *      - 'granted' → load GA4 immediately (returning visitor)
 *      - 'denied'  → do nothing; GA4 never loads
 *      - null      → show banner with Accept / Decline
 *   2. Accept → load GA4, store 'granted', hide banner
 *   3. Decline → store 'denied', hide banner; GA4 never loads
 *
 * Private browsing: localStorage throws → banner hidden; GA4 never loads.
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
        // Returning visitor who previously accepted — load GA4 immediately.
        loadGA4(window.location.pathname);
        setVisible(false);
      } else if (stored === "denied") {
        // Returning visitor who previously declined — GA4 never loads.
        setVisible(false);
      } else {
        // No prior choice — show banner.
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (private browsing) — hide banner; GA4 never loads.
      setVisible(false);
    }
  }, []);

  const t = useT(locale);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "granted");
    } catch { /* ignore */ }
    loadGA4(window.location.pathname);
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "denied");
    } catch { /* ignore */ }
    // No gtag call needed — GA4 was never loaded; nothing to update.
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
