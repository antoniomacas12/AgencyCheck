/**
 * middleware.ts — Language detection for AgencyCheck
 *
 * Two jobs:
 * 1. Detect locale from Accept-Language header → set ac_locale cookie
 * 2. Set x-ac-locale response header based on URL path prefix
 *    → root app/layout.tsx reads this to set <html lang="...">
 *    → Navbar reads it to show the correct language in the switcher
 *
 * Supported locales: en (default), pl, ro
 * English has no URL prefix (/), Polish is /pl/*, Romanian is /ro/*
 */

import { NextRequest, NextResponse } from "next/server";
import { detectLocaleFromHeader, type Locale } from "@/lib/i18n";

const LOCALE_COOKIE  = "ac_locale";
const LOCALE_HEADER  = "x-ac-locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function pathToLocale(pathname: string): Locale {
  if (pathname === "/pl" || pathname.startsWith("/pl/")) return "pl";
  if (pathname === "/ro" || pathname.startsWith("/ro/")) return "ro";
  if (pathname === "/pt" || pathname.startsWith("/pt/")) return "pt";
  return "en";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next")  ||
    pathname.startsWith("/api")    ||
    pathname.startsWith("/static") ||
    pathname.includes(".")           // e.g. /favicon.ico, /robots.txt
  ) {
    return NextResponse.next();
  }

  // Mark admin routes so root layout can suppress the public navigation
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  // ── 1. Determine locale from path OR cookie ───────────────────────────────
  // Priority: URL path prefix (/pl/*, /ro/*) > ac_locale cookie > Accept-Language
  const pathLocale   = pathToLocale(pathname);
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;

  let locale: Locale = pathLocale;

  // If the URL has no locale prefix, fall back to the cookie so that English-URL
  // pages (/agencies, /jobs, etc.) still render in the user's chosen language.
  if (locale === "en" && (cookieLocale === "pl" || cookieLocale === "ro" || cookieLocale === "pt")) {
    locale = cookieLocale;
  }

  // ── CRITICAL: forward locale as a REQUEST header so that headers() in server
  // components (app/layout.tsx, page.tsx, etc.) can read it.
  // Setting it only on the response object does NOT make it readable via headers().
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  // Mark admin routes so the root layout can suppress public navigation
  if (isAdmin) {
    requestHeaders.set("x-ac-admin", "true");
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Also set it on the response so the browser / CDN can read it if needed.
  response.headers.set(LOCALE_HEADER, locale);

  // ── 2. Persist locale in cookie so English-URL pages can pick it up ─────────
  // Case A: user is on a /pl or /ro prefixed page → always write the cookie so
  //         that subsequent visits to /agencies, /reviews, etc. stay translated.
  // Case B: no cookie yet → auto-detect from Accept-Language header.
  const cookieOptions = {
    maxAge:   COOKIE_MAX_AGE,
    path:     "/",
    sameSite: "lax" as const,
    secure:   process.env.NODE_ENV === "production",
  };

  if (pathLocale !== "en") {
    // Case A — path locale wins; sync cookie so English-URL pages inherit it.
    if (cookieLocale !== pathLocale) {
      response.cookies.set(LOCALE_COOKIE, pathLocale, cookieOptions);
    }
  } else if (!cookieLocale) {
    // Case B — first visit, no cookie; try Accept-Language detection.
    const acceptLanguage = request.headers.get("accept-language");
    const detected = detectLocaleFromHeader(acceptLanguage);
    if (detected !== "en") {
      response.cookies.set(LOCALE_COOKIE, detected, cookieOptions);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
