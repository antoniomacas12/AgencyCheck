/**
 * lib/i18n.ts — Lightweight i18n helper for AgencyCheck
 *
 * Zero dependencies. Works in both Server and Client components.
 *
 * Usage (server component):
 *   const t = await getT("pl");
 *   t("homepage.hero_gross") // → "Myślisz, że zarabiasz €600 tygodniowo."
 *
 * Usage (client component):
 *   import { useT } from "@/lib/i18n";
 *   const t = useT("pl");
 *
 * Interpolation:
 *   t("homepage.badge", { housingCount: 42 })  // replaces {housingCount}
 */

export type Locale = "en" | "pl" | "ro" | "pt";
export const SUPPORTED_LOCALES: Locale[] = ["en", "pl", "ro", "pt"];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, { label: string; flag: string; nativeName: string }> = {
  en: { label: "English",    flag: "🇬🇧", nativeName: "English"   },
  pl: { label: "Polish",     flag: "🇵🇱", nativeName: "Polski"    },
  ro: { label: "Romanian",   flag: "🇷🇴", nativeName: "Română"    },
  pt: { label: "Portuguese", flag: "🇵🇹", nativeName: "Português" },
};

// Flat key lookup with dot-notation (e.g. "homepage.hero_gross")
type Translations = Record<string, unknown>;

function resolveDotKey(obj: Translations, key: string): string {
  const parts = key.split(".");
  let curr: unknown = obj;
  for (const part of parts) {
    if (curr == null || typeof curr !== "object") return key;
    curr = (curr as Record<string, unknown>)[part];
  }
  if (typeof curr === "string") return curr;
  return key; // fallback: return the key itself
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

// ─── Server-side: dynamic import of locale JSON ──────────────────────────────
// Uses lazy caching so each locale file is loaded only once per server process.

const _cache: Partial<Record<Locale, Translations>> = {};

async function loadLocale(locale: Locale): Promise<Translations> {
  if (_cache[locale]) return _cache[locale]!;
  try {
    // Dynamic import works in both Edge and Node runtimes
    const mod = await import(`@/locales/${locale}.json`);
    _cache[locale] = mod.default ?? mod;
    return _cache[locale]!;
  } catch {
    if (locale !== DEFAULT_LOCALE) {
      return loadLocale(DEFAULT_LOCALE); // fallback to EN
    }
    return {};
  }
}

/**
 * getT — server-side translation function factory.
 * Returns a synchronous t() function after awaiting the locale file.
 */
export async function getT(locale: Locale = DEFAULT_LOCALE) {
  const translations = await loadLocale(locale);
  const en = locale !== DEFAULT_LOCALE ? await loadLocale(DEFAULT_LOCALE) : null;

  return function t(key: string, vars?: Record<string, string | number>): string {
    const result = resolveDotKey(translations, key);
    if (result === key && en) {
      // Key missing in locale → fall back to English
      const fallback = resolveDotKey(en, key);
      return interpolate(fallback, vars);
    }
    return interpolate(result, vars);
  };
}

// ─── Client-side: synchronous hook (locale JSON pre-loaded as module) ─────────
// For Client Components, import the JSON directly.

import enJson from "@/locales/en.json";
import plJson from "@/locales/pl.json";
import roJson from "@/locales/ro.json";
import ptJson from "@/locales/pt.json";

const LOCALE_DATA: Record<Locale, Translations> = {
  en: enJson as unknown as Translations,
  pl: plJson as unknown as Translations,
  ro: roJson as unknown as Translations,
  pt: ptJson as unknown as Translations,
};

/**
 * useT — client-side translation function (synchronous, no hook needed).
 * Safe to call at the top of any Client Component.
 */
export function useT(locale: Locale = DEFAULT_LOCALE) {
  const translations = LOCALE_DATA[locale] ?? LOCALE_DATA[DEFAULT_LOCALE];
  const en = LOCALE_DATA[DEFAULT_LOCALE];

  return function t(key: string, vars?: Record<string, string | number>): string {
    const result = resolveDotKey(translations, key);
    if (result === key && locale !== DEFAULT_LOCALE) {
      const fallback = resolveDotKey(en, key);
      return interpolate(fallback, vars);
    }
    return interpolate(result, vars);
  };
}

// ─── Locale detection helpers ─────────────────────────────────────────────────

/**
 * Detects locale from Accept-Language header string.
 * Returns the best matching supported locale, or DEFAULT_LOCALE.
 */
export function detectLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const parts = acceptLanguage.split(",").map((p) => p.split(";")[0].trim().toLowerCase());
  for (const lang of parts) {
    const code = lang.slice(0, 2) as Locale;
    if (SUPPORTED_LOCALES.includes(code)) return code;
  }
  return DEFAULT_LOCALE;
}

/**
 * Returns the URL prefix for a given locale.
 * English (default) has no prefix.
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return `/${locale}${path}`;
}

/**
 * Strips the locale prefix from a path.
 * "/pl/praca-z-zakwaterowaniem" → "/praca-z-zakwaterowaniem"
 */
export function stripLocalePrefix(path: string): { locale: Locale; rest: string } {
  for (const loc of SUPPORTED_LOCALES) {
    if (loc === DEFAULT_LOCALE) continue;
    if (path === `/${loc}` || path.startsWith(`/${loc}/`)) {
      return { locale: loc, rest: path.slice(loc.length + 1) || "/" };
    }
  }
  return { locale: DEFAULT_LOCALE, rest: path };
}
