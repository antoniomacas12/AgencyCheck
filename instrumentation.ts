/**
 * instrumentation.ts — Next.js 14 instrumentation hook
 * Required by @sentry/nextjs to initialize Sentry on the server before
 * any routes are handled. Next.js calls register() once per server startup.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
