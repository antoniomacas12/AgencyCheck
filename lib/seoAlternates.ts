/**
 * seoAlternates.ts — Single source of truth for hreflang / canonical alternates.
 *
 * WHY THIS EXISTS:
 * Google requires every URL in an hreflang cluster to declare ALL other
 * language variants symmetrically. If even one page in the cluster is missing
 * the languages block, Google distrusts the entire set and runs its own
 * duplicate-content resolution — causing "Alternate page with proper canonical"
 * in Search Console (i.e., Google ignores your declared canonical on localized pages).
 *
 * This module guarantees all four pages for a given slug emit identical,
 * consistent hreflang sets, using absolute URLs that resolve unambiguously.
 */

const BASE = "https://agencycheck.io";

// ─── Supported locales with agency sub-routes ─────────────────────────────────
// NOTE: sk and bg have home/landing pages but NOT individual agency slug pages.
//       Do NOT include them in agency hreflang sets until those routes exist.
const LOCALES = {
  en: (slug: string) => `${BASE}/agencies/${slug}`,
  pl: (slug: string) => `${BASE}/pl/agencje/${slug}`,
  ro: (slug: string) => `${BASE}/ro/agentii/${slug}`,
  pt: (slug: string) => `${BASE}/pt/agencias/${slug}`,
};

const CITY_LOCALES = {
  en: (slug: string, city: string) => `${BASE}/agencies/${slug}/${city}`,
  pl: (slug: string, city: string) => `${BASE}/pl/agencje/${slug}/${city}`,
  ro: (slug: string, city: string) => `${BASE}/ro/agentii/${slug}/${city}`,
  pt: (slug: string, city: string) => `${BASE}/pt/agencias/${slug}/${city}`,
};

// ─── Agency page alternates ────────────────────────────────────────────────────

/**
 * Returns `alternates` for the ENGLISH canonical agency page.
 * Used in app/agencies/[slug]/page.tsx → generateMetadata
 */
export function agencyAlternatesEN(slug: string) {
  return {
    canonical: LOCALES.en(slug),
    languages: {
      "en":        LOCALES.en(slug),
      "pl":        LOCALES.pl(slug),
      "ro":        LOCALES.ro(slug),
      "pt":        LOCALES.pt(slug),
      "x-default": LOCALES.en(slug),
    },
  } as const;
}

/**
 * Returns `alternates` for a LOCALIZED agency page.
 * Used in app/pl/agencje/[slug]/page.tsx etc.
 */
export function agencyAlternatesLocale(
  slug: string,
  locale: "pl" | "ro" | "pt",
) {
  return {
    canonical: LOCALES[locale](slug),
    languages: {
      "en":        LOCALES.en(slug),
      "pl":        LOCALES.pl(slug),
      "ro":        LOCALES.ro(slug),
      "pt":        LOCALES.pt(slug),
      "x-default": LOCALES.en(slug),
    },
  } as const;
}

// ─── Agency+City page alternates ──────────────────────────────────────────────

/**
 * Returns `alternates` for the ENGLISH canonical agency+city page.
 * Used in app/agencies/[slug]/[city]/page.tsx → generateMetadata
 */
export function agencyCityAlternatesEN(slug: string, city: string) {
  return {
    canonical: CITY_LOCALES.en(slug, city),
    languages: {
      "en":        CITY_LOCALES.en(slug, city),
      "pl":        CITY_LOCALES.pl(slug, city),
      "ro":        CITY_LOCALES.ro(slug, city),
      "pt":        CITY_LOCALES.pt(slug, city),
      "x-default": CITY_LOCALES.en(slug, city),
    },
  } as const;
}

/**
 * Returns `alternates` for a LOCALIZED agency+city page.
 */
export function agencyCityAlternatesLocale(
  slug: string,
  city: string,
  locale: "pl" | "ro" | "pt",
) {
  return {
    canonical: CITY_LOCALES[locale](slug, city),
    languages: {
      "en":        CITY_LOCALES.en(slug, city),
      "pl":        CITY_LOCALES.pl(slug, city),
      "ro":        CITY_LOCALES.ro(slug, city),
      "pt":        CITY_LOCALES.pt(slug, city),
      "x-default": CITY_LOCALES.en(slug, city),
    },
  } as const;
}

// ─── Hreflang sitemap helpers ─────────────────────────────────────────────────
// Used by app/sitemap-i18n.xml/route.ts to generate a proper XML hreflang sitemap.

export interface HreflangEntry {
  loc: string;
  alternates: { hreflang: string; href: string }[];
  lastmod: string;
}

export function buildAgencyHreflangEntries(
  slugs: string[],
  lastModMap: Map<string, string>,
  fallbackDate: string,
): HreflangEntry[] {
  const entries: HreflangEntry[] = [];

  for (const slug of slugs) {
    const lastmod = lastModMap.get(slug) ?? fallbackDate;
    const alternates = [
      { hreflang: "en",        href: LOCALES.en(slug) },
      { hreflang: "pl",        href: LOCALES.pl(slug) },
      { hreflang: "ro",        href: LOCALES.ro(slug) },
      { hreflang: "pt",        href: LOCALES.pt(slug) },
      { hreflang: "x-default", href: LOCALES.en(slug) },
    ];

    // One entry per locale variant — each with the full alternate set
    for (const locale of ["en", "pl", "ro", "pt"] as const) {
      entries.push({ loc: LOCALES[locale](slug), alternates, lastmod });
    }
  }

  return entries;
}
