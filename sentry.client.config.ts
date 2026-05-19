/**
 * sentry.client.config.ts — Browser error tracking
 * Loaded automatically by @sentry/nextjs on the client side.
 * Focus: capture unhandled JS errors and rejected promises.
 * NO performance tracing — minimal overhead.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Errors only — no performance tracing
  tracesSampleRate: 0,

  // Capture all errors in production
  sampleRate: 1.0,

  // Only enable in production — silence in local dev
  enabled: process.env.NODE_ENV === "production",

  // ── Filter common browser noise ──────────────────────────────────────────
  ignoreErrors: [
    // Network errors (offline users, broken connections)
    "Network request failed",
    "NetworkError",
    "Failed to fetch",
    "Load failed",
    // Browser extensions injecting into the page
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    // Safari autofill / cross-origin iframes
    "Non-Error promise rejection captured",
    // iOS Safari quirk
    "Can't find variable: $",
  ],

  // ── Filter bot/crawler traffic ────────────────────────────────────────────
  beforeSend(event) {
    // Drop events with no stack trace and no useful context (likely bots)
    if (!event.exception?.values?.[0]?.stacktrace?.frames?.length) {
      return null;
    }
    return event;
  },
});
