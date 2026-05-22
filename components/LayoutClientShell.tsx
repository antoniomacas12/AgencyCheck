"use client";

/**
 * LayoutClientShell.tsx
 *
 * Client shell that owns everything in <body> that depends on the current
 * route (admin detection, locale detection, widget visibility).
 *
 * WHY THIS EXISTS
 * ───────────────
 * The root layout (app/layout.tsx) used to call headers() to read the
 * x-ac-locale and x-ac-admin request headers.  Calling headers() — or any
 * other dynamic Next.js API — in a root layout makes EVERY route in the app
 * render dynamically on every request, including pages that should be served
 * from the static pre-render cache (e.g. /apply/[slug]).
 *
 * Moving the per-route conditional logic here fixes that: this file is a
 * Client Component, so it runs on both server (SSR) and client without
 * opting any route into dynamic rendering.  usePathname() is available
 * during SSR in Next.js App Router and returns the correct pathname, so
 * the initial HTML is identical to what was produced before.
 *
 * LOCALE DETECTION
 * ────────────────
 * Locale is derived from the URL path prefix (/pl/*, /ro/*, …) which is the
 * same primary signal the middleware uses.  Cookie-based locale override for
 * English-URL pages (e.g. /agencies with ac_locale=pl) is NOT applied here;
 * it continues to work at the individual page level where those pages call
 * getLocale() themselves (and are already force-dynamic).
 *
 * The <html lang> attribute is patched via useEffect so screen readers and
 * search engines (which execute JS) see the correct language tag on
 * non-English routes.
 */

import { useEffect }    from "react";
import { usePathname }  from "next/navigation";
import dynamic          from "next/dynamic";
import Navbar           from "@/components/Navbar";
import type { Locale }  from "@/lib/i18n";

// These widgets use browser APIs on mount — keep ssr:false to avoid
// hydration mismatches (same reason they had ssr:false in the root layout).
const StickyIncomeStrip = dynamic(() => import("@/components/StickyIncomeStrip"), { ssr: false });
const WorkerQAPanel     = dynamic(() => import("@/components/WorkerQAPanel"),     { ssr: false });
const FloatingStack     = dynamic(() => import("@/components/FloatingStack"),     { ssr: false });
const CookieNotice      = dynamic(() => import("@/components/CookieNotice"),      { ssr: false });

// Mirrors the path-prefix detection in middleware.ts.
function localeFromPath(pathname: string): Locale {
  if (pathname === "/pl" || pathname.startsWith("/pl/")) return "pl";
  if (pathname === "/ro" || pathname.startsWith("/ro/")) return "ro";
  if (pathname === "/pt" || pathname.startsWith("/pt/")) return "pt";
  if (pathname === "/sk" || pathname.startsWith("/sk/")) return "sk";
  if (pathname === "/bg" || pathname.startsWith("/bg/")) return "bg";
  return "en";
}

interface Props {
  children: React.ReactNode;
  /** Pre-rendered Footer passed as a slot so the root layout stays static. */
  footer: React.ReactNode;
}

export default function LayoutClientShell({ children, footer }: Props) {
  const pathname = usePathname();
  const isAdmin  = pathname === "/admin" || pathname.startsWith("/admin/");
  const locale   = localeFromPath(pathname);

  // Patch <html lang> for non-English routes.
  // The root layout defaults to lang="en"; this corrects it client-side after
  // hydration so screen readers and Google's JS renderer see the right tag.
  useEffect(() => {
    const html = document.documentElement;
    if (html.lang !== locale) {
      html.lang = locale;
    }
  }, [locale]);

  return (
    <>
      {!isAdmin && <Navbar locale={locale} />}
      <main className={isAdmin ? "flex-1" : "flex-1 pb-14"}>
        {children}
      </main>
      {!isAdmin && footer}
      {!isAdmin && <StickyIncomeStrip />}
      {!isAdmin && <WorkerQAPanel hideTrigger />}
      {!isAdmin && <FloatingStack />}
      {!isAdmin && <CookieNotice />}
    </>
  );
}
