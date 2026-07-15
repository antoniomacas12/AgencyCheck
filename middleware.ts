/**
 * middleware.ts — Language detection + Bot traffic filtering for AgencyCheck
 *
 * Layer 1 — Locale detection (original):
 *   Detect locale from Accept-Language header → set ac_locale cookie
 *   Set x-ac-locale response header based on URL path prefix
 *   → root app/layout.tsx reads this to set <html lang="...">
 *   → Navbar reads it to show the correct language in the switcher
 *   Supported locales: en (default), pl, ro
 *   English has no URL prefix (/), Polish is /pl/*, Romanian is /ro/*
 *
 * Layer 2 — Bot traffic filter (added for BotID integration):
 *   Blocks HTTP scrapers and non-JS bots hitting specific high-traffic routes
 *   with fake visits (/compare/, /guides/, /salary/*, etc.).
 *   Complements Vercel BotID (which handles JS-executing bots) and the
 *   existing Vercel Firewall rules (rate limiting / geo rules — unchanged).
 *
 *   Bot detection strategy:
 *   ✅ Verified search bots (Googlebot, Bingbot, etc.) — always allowed
 *   ❌ Known scraper / data-mining UAs — blocked with 403
 *   ❌ Headless browser signatures — blocked with 403
 *   ❌ No User-Agent header at all on protected routes — blocked with 403
 */

import { NextRequest, NextResponse } from "next/server";
import { detectLocaleFromHeader, type Locale } from "@/lib/i18n";

// ── Bot filter config ──────────────────────────────────────────────────────────

/** Routes targeted by fake visits / scrapers.  Keep in sync with layout.tsx BOT_PROTECTED_ROUTES. */
const BOT_FILTER_PATHS: RegExp[] = [
  /^\/compare(\/|$)/i,
  /^\/guides(\/|$)/i,
  /^\/jobs-rotterdam$/i,
  /^\/assembly-jobs-zwolle$/i,
  /^\/production-jobs-/i,           // all /production-jobs-* URLs
  /^\/salary(\/|$)/i,
  /^\/pl\/agencje-pracy-holandia$/i, // 72 bot hits (analytics 2026-07)
];

/**
 * Verified search-engine crawlers that must NEVER be blocked.
 * BotID handles these automatically — this list is for the UA-filter layer.
 */
const ALLOWED_CRAWLERS =
  /Googlebot|Google-InspectionTool|AdsBot-Google|Bingbot|bingbot|Slurp|YahooSeeker|DuckDuckBot|Baiduspider|facebookexternalhit|Twitterbot|LinkedInBot|Applebot|Pinterest|Exabot|ia_archiver/i;

/**
 * Known bad actors: scraper libraries, headless browsers, data aggregators,
 * and commercial SEO crawlers that are known to generate fake traffic.
 *
 * NOTE: Googlebot and other verified crawlers are whitelisted above and checked
 * FIRST — they will never be caught by this list.
 */
const BLOCKED_UA_PATTERNS: RegExp[] = [
  // HTTP libraries (no browser at all)
  /Python-urllib/i,
  /python-requests/i,
  /aiohttp/i,
  /Go-http-client/i,
  /curl\//i,
  /Wget\//i,
  /libwww-perl/i,
  /Java\//i,
  /okhttp/i,
  /node-fetch/i,
  /axios/i,
  // Headless browsers
  /HeadlessChrome/i,
  /PhantomJS/i,
  /Nightmare/i,
  // Scraping frameworks
  /Scrapy/i,
  /scrapy/i,
  /BeautifulSoup/i,
  // Commercial SEO crawlers (common source of fake "visits" in analytics)
  /SemrushBot/i,
  /AhrefsBot/i,
  /MJ12bot/i,
  /DotBot/i,
  /BLEXBot/i,
  /DataForSeoBot/i,
  /PetalBot/i,
  /Bytespider/i,
  /GPTBot/i,
  /ClaudeBot/i,
  /CCBot/i,
  /anthropic-ai/i,
  /cohere-ai/i,
  /PerplexityBot/i,
];

function matchesBotFilter(pathname: string): boolean {
  return BOT_FILTER_PATHS.some((re) => re.test(pathname));
}

/**
 * Returns true for GNU/Linux desktop UAs (excludes Android/Mobile/CrOS).
 * 100% of bot traffic on /compare/* shows Linux + Desktop profile.
 * Real audience (EU workers seeking jobs) is Windows/Mac/Android — never Linux desktop.
 * Only applied to /compare/* as an extra gate after isSuspiciousBot.
 */
function isLinuxDesktopUA(ua: string): boolean {
  return /\bLinux\b/i.test(ua) && !/Android|Mobile|Tablet|CrOS/i.test(ua);
}

function isSuspiciousBot(ua: string | null): boolean {
  // No User-Agent → definitely not a real browser
  if (!ua || ua.trim() === "") return true;
  // Verified search crawlers are always allowed
  if (ALLOWED_CRAWLERS.test(ua)) return false;
  // Check known bad actors
  return BLOCKED_UA_PATTERNS.some((re) => re.test(ua));
}

const LOCALE_COOKIE  = "ac_locale";
const LOCALE_HEADER  = "x-ac-locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function pathToLocale(pathname: string): Locale {
  if (pathname === "/nl" || pathname.startsWith("/nl/")) return "nl";
  if (pathname === "/pl" || pathname.startsWith("/pl/")) return "pl";
  if (pathname === "/ro" || pathname.startsWith("/ro/")) return "ro";
  if (pathname === "/pt" || pathname.startsWith("/pt/")) return "pt";
  if (pathname === "/sk" || pathname.startsWith("/sk/")) return "sk";
  if (pathname === "/bg" || pathname.startsWith("/bg/")) return "bg";
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

  // ── Layer 2: Bot UA filter ────────────────────────────────────────────────
  // Block known HTTP scrapers and headless browsers on the protected routes.
  // Googlebot and other verified crawlers are explicitly allowed (see above).
  if (matchesBotFilter(pathname)) {
    const ua = request.headers.get("user-agent");
    if (isSuspiciousBot(ua)) {
      return new NextResponse("Forbidden", {
        status: 403,
        headers: { "Content-Type": "text/plain" },
      });
    }
    // Secondary gate for /compare/* only:
    // GNU/Linux + non-Android desktop = server scraper (100% of bot traffic profile).
    // Real audience is EU workers on Windows/Mac/Android — never Linux desktop.
    // Verified crawlers already cleared above (ALLOWED_CRAWLERS check in isSuspiciousBot).
    if (
      ua &&
      /^\/compare(\/|$)/i.test(pathname) &&
      isLinuxDesktopUA(ua) &&
      !ALLOWED_CRAWLERS.test(ua)
    ) {
      return new NextResponse("Forbidden", {
        status: 403,
        headers: { "Content-Type": "text/plain" },
      });
    }
  }
  // ── End bot filter ────────────────────────────────────────────────────────

  // Mark admin routes so root layout can suppress the public navigation
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  // ── 1. Determine locale from path OR cookie ───────────────────────────────
  // Priority: URL path prefix (/pl/*, /ro/*) > ac_locale cookie > Accept-Language
  const pathLocale   = pathToLocale(pathname);
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;

  // English-URL pages always render in English regardless of cookie.
  // If a user wants a different language they use the locale-prefixed URLs (/pl/, /ro/, etc.).
  // Cookie is only applied when the URL itself already has a locale prefix.
  const locale: Locale = pathLocale;

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
    // "nl" is excluded from auto-detection — the site's primary audience is
    // foreign workers (PL/RO/PT/SK/BG) for whom English is the default.
    // Dutch speakers can switch via the language switcher like any other locale.
    if (detected !== "en" && detected !== "nl") {
      response.cookies.set(LOCALE_COOKIE, detected, cookieOptions);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
