"use client";

/**
 * LanguageSwitcher — compact language selector for the Navbar.
 *
 * Behaviour on selection:
 *  1. Saves the chosen locale in the ac_locale cookie (1 year).
 *  2. Navigation:
 *     - On a locale-prefixed page (/pl/…, /ro/…, /sk/…, /bg/…):
 *         Switch to EN  → strip prefix, navigate to that EN path
 *         Switch to other locale  → navigate to that locale's root
 *     - On a plain English page (/agencies, /jobs, /, etc.):
 *         Use window.location for a hard navigation so the browser
 *         sends the updated cookie to the server immediately.
 *         Switching to non-EN → go to the locale root (/pl, /ro, /sk, /bg)
 *         Switching back to EN → reload current page in English
 */

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SUPPORTED_LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n";

interface Props {
  /** Current locale, passed from layout (default: "en") */
  currentLocale?: Locale;
}

// Maps locale → root path
const LOCALE_ROOT_PATHS: Record<Locale, string> = {
  en: "/",
  pl: "/pl",
  ro: "/ro",
  pt: "/pt",
  sk: "/sk",
  bg: "/bg",
};

// The cookie name must match middleware.ts
const LOCALE_COOKIE = "ac_locale";

/** True when the current path lives under a locale prefix (/pl/…, /ro/…, /pt/…, /sk/…, /bg/…) */
function isLocalePrefixedPath(pathname: string): boolean {
  return pathname === "/pl" || pathname.startsWith("/pl/") ||
         pathname === "/ro" || pathname.startsWith("/ro/") ||
         pathname === "/pt" || pathname.startsWith("/pt/") ||
         pathname === "/sk" || pathname.startsWith("/sk/") ||
         pathname === "/bg" || pathname.startsWith("/bg/");
}

/** Strip the locale prefix from a path (returns "/" if nothing left) */
function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(pl|ro|pt|sk|bg)(\/|$)/, "/");
  return stripped || "/";
}

export default function LanguageSwitcher({ currentLocale = "en" }: Props) {
  const [open, setOpen] = useState(false);
  const pathname        = usePathname();
  const ref             = useRef<HTMLDivElement>(null);

  const current = LOCALE_LABELS[currentLocale];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function switchLocale(locale: Locale) {
    setOpen(false);
    if (locale === currentLocale) return;

    // 1. Persist choice in cookie (1 year)
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

    // 2. Navigate — use window.location for hard navigation so the browser
    //    immediately sends the new cookie to the server. router.refresh()
    //    is unreliable because the Next.js router cache may serve stale HTML.
    if (isLocalePrefixedPath(pathname)) {
      // On /pl/*, /ro/*, /sk/*, /bg/* → go to new locale root (slugs differ per language)
      const dest = locale === "en" ? stripLocalePrefix(pathname) : LOCALE_ROOT_PATHS[locale];
      window.location.href = dest;
    } else {
      // On English-URL page (/agencies, /jobs, /, etc.)
      if (locale === "en") {
        // Reload current page — middleware will clear the locale cookie and serve EN
        window.location.reload();
      } else {
        // Navigate to the locale root so middleware reads path-prefix (highest priority)
        // which guarantees the page renders in the correct language immediately
        window.location.href = LOCALE_ROOT_PATHS[locale];
      }
    }
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
        aria-label="Switch language"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="uppercase tracking-wide">{currentLocale}</span>
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[140px]"
          role="listbox"
          aria-label="Select language"
        >
          {SUPPORTED_LOCALES.map((locale) => {
            const info    = LOCALE_LABELS[locale];
            const isActive = locale === currentLocale;
            return (
              <button
                key={locale}
                role="option"
                aria-selected={isActive}
                onClick={() => switchLocale(locale)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-bold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{info.flag}</span>
                <span>{info.nativeName}</span>
                {isActive && (
                  <svg className="ml-auto w-3.5 h-3.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
          <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
            <p className="text-[9px] text-gray-400 leading-snug">
              Content in EN/PL/RO/PT/SK/BG
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
