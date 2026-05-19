/**
 * sentry.edge.config.ts — Edge runtime error tracking
 * Covers: middleware.ts and any route segments using `runtime = "edge"`.
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0,
  sampleRate: 1.0,
  enabled: process.env.NODE_ENV === "production",
});
