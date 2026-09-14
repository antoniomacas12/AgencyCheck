"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * GA4PageTracker — fires page_view on SPA route changes AFTER GA4 is loaded.
 *
 * Basic Consent Mode design:
 *   - GA4 (gtag.js) is never loaded until the user accepts via CookieNotice.
 *   - window.gtag is undefined before consent; if gtag isn't a function we
 *     return silently — events must NOT be queued before consent.
 *
 * Works in tandem with CookieNotice's loadGA4():
 *   - loadGA4() fires the initial page_view when GA4 is first loaded (on
 *     Accept, or on page load for returning visitors who previously accepted).
 *   - GA4PageTracker skips its first render (isFirstRender ref) to avoid
 *     duplicating that initial page_view.
 *   - GA4PageTracker fires exactly one page_view per subsequent route change.
 *
 * Renders null — zero DOM output.
 */
export function GA4PageTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the initial mount — loadGA4() in CookieNotice fires the first
    // page_view for whichever page the user is on when GA4 initialises.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window === "undefined") return;

    // Guard: if gtag is not a function, GA4 has not been loaded (user has not
    // consented). Do not queue events — Basic Consent Mode requires no GA4
    // activity before explicit acceptance.
    if (typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
