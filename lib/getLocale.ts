/**
 * lib/getLocale.ts
 *
 * Server-side utility for reading the current locale inside any
 * Server Component or Route Handler.
 *
 * The locale is set by middleware.ts as a REQUEST header (x-ac-locale)
 * so it is readable via Next.js's `headers()` API.
 *
 * Priority order (matches middleware):
 *   1. URL path prefix  (/pl/*, /ro/*)
 *   2. ac_locale cookie (set by LanguageSwitcher)
 *   3. Default: "en"
 *
 * Usage:
 *   import { getLocale } from "@/lib/getLocale";
 *   const locale = getLocale();
 *   const t = await getT(locale);
 */

import { headers } from "next/headers";
import { type Locale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

export function getLocale(): Locale {
  try {
    const h = headers();
    const raw = h.get("x-ac-locale");
    if (raw && (SUPPORTED_LOCALES as readonly string[]).includes(raw)) {
      return raw as Locale;
    }
  } catch {
    // headers() throws outside of a request context (e.g. during static generation)
  }
  return DEFAULT_LOCALE;
}
