"use client";

/**
 * LanguageSwitcher — compact language selector for the Navbar.
 *
 * Behaviour on selection:
 *  1. Saves the chosen locale in the ac_locale cookie (1 year).
 *  2. Navigation:
 *     - On a locale-prefixed page (/pl/… or /ro/…):
 *         Switch to EN  → strip the prefix, navigate to that EN path
 *         Switch to PL  → navigate to /pl
 *         Switch to RO  → navigate to /ro
 *     - On a plain English page (/agencies, /jobs, etc.):
 *         Set the cookie then call router.refresh() so Next.js
 *         invalidates its route cache and re-fetches Server Components
 *         with the new locale — no full browser reload required.
 */

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
};

// The cookie name must match middleware.ts
const LOCALE_COOKIE = "ac_locale";

/** True when the current path lives under a locale prefix (/pl/… or /ro/…) */
function isLocalePrefixedPath(pathname: string): boolean {
  return pathname === "/pl" || pathname.startsWith("/pl/") ||
         pathname === "/ro" || pathname.startsWith("/ro/");
}

/** Strip the /pl or /ro prefix from a path (returns "/" if nothing left) */
function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(pl|ro)(\/|$)/, "/");
  return stripped || "/";
}

export default function LanguageSwitcher({ currentLocale = "en" }: Props) {
  const [open, setOpen]         = useState(false);
  const router                  = useRouter();
  const pathname                = usePathname();
  const ref                     = useRef<HTMLDivElement>(null);

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

    // 2. Navigate
    if (isLocalePrefixedPath(pathname)) {
      // We're on a locale-specific page — go to the new locale's root
      // (locale-specific pages have their own URL slugs so we can't map them 1:1)
      if (locale === "en") {
        // Try to keep the user on the equivalent English path
        router.push(stripLocalePrefix(pathname));
      } else {
        router.push(LOCALE_ROOT_PATHS[locale]);
      }
    } else {
      // We're on an English-URL page — router.refresh() invalidates the
      // Next.js route cache and re-fetches all Server Components. The new
      // request goes through middleware which reads the updated ac_locale
      // cookie and sets x-ac-locale, so layout + page re-render instantly
      // in the chosen language without a full browser reload.
      router.refresh();
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
              Content in EN/PL/RO · More languages coming
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
