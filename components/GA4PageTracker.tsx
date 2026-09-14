"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * GA4PageTracker — fires page_view on every SPA route change.
 *
 * Next.js App Router does not auto-fire page_view on client navigation.
 * This component watches pathname changes via usePathname() and fires
 * window.gtag('event', 'page_view', ...) on each change, including the
 * initial mount (first page load).
 *
 * Ordering guarantee:
 *   The 'beforeInteractive' script in layout.tsx initialises window.dataLayer
 *   and defines window.gtag (as a dataLayer queue shim) before any React code
 *   runs. This means window.gtag is always available when useEffect fires.
 *   The shim below is a safety net only — it is never reached in production.
 *
 * Consent behaviour:
 *   With analytics_storage: 'denied' (the default), GA4 queues events but
 *   does not send them. Events fire unconditionally here; GA4 itself
 *   discards or sends them according to the current consent state.
 *   send_page_view: false in ga4-init prevents a duplicate auto page_view.
 *
 * Renders null — zero DOM output.
 */
export function GA4PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Safety net: the beforeInteractive script in layout.tsx guarantees
    // window.gtag is defined before hydration. This branch activates only if
    // that guarantee somehow fails (e.g. a browser extension stripped it).
    // Defining the standard gtag shim here ensures events pushed before
    // gtag.js loads are queued in window.dataLayer and replayed when it does.
    // Must be a regular function (not arrow) so `arguments` is the Arguments
    // object gtag.js expects when it processes the dataLayer queue.
    if (typeof window.gtag !== "function") {
      window.dataLayer = window.dataLayer || [];
      // Declared with rest params so TypeScript accepts the assignment.
      // `arguments` (not _args) is used inside because gtag.js expects an
      // Arguments object when replaying queued dataLayer entries, not a plain array.
      // eslint-disable-next-line prefer-rest-params
      window.gtag = function (..._args: unknown[]) {
        // eslint-disable-next-line prefer-rest-params
        (window.dataLayer as unknown[]).push(arguments);
      };
    }

    // At this point window.gtag is guaranteed to be a function.
    // TypeScript does not narrow across the assignment above, hence the cast.
    (window.gtag as NonNullable<Window["gtag"]>)("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
