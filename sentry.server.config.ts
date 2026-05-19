/**
 * sentry.server.config.ts — Server-side error tracking
 * Loaded automatically by @sentry/nextjs on the Node.js runtime.
 * Captures: API route errors, Prisma failures, unhandled exceptions.
 * NO performance tracing — minimal overhead.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Errors only — no performance tracing
  tracesSampleRate: 0,

  // Capture all errors in production
  sampleRate: 1.0,

  // Only enable in production
  enabled: process.env.NODE_ENV === "production",

  // Attach full request context to every error
  attachStacktrace: true,

  // ── Filter bot noise on the server ───────────────────────────────────────
  beforeSend(event, hint) {
    const err = hint?.originalException;

    // Drop Prisma "record not found" — these are expected 404s, not bugs
    if (
      err instanceof Error &&
      err.message.includes("Record to update not found")
    ) {
      return null;
    }

    // Drop known Next.js internal cancellation errors
    if (
      err instanceof Error &&
      (err.message === "NEXT_NOT_FOUND" || err.message === "NEXT_REDIRECT")
    ) {
      return null;
    }

    return event;
  },
});
