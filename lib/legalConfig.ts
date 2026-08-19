/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LEGAL ENTITY CONFIGURATION — fill in before going live
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Dutch law (Wet elektronische handel / EU E-Commerce Directive) requires
 * every commercial website to clearly display who operates it.
 * Under GDPR Art. 13/14 you must identify the data controller.
 *
 * HOW TO FILL THIS IN:
 *   1. Register your business at kvk.nl if you haven't already.
 *   2. Replace each TODO value below with your real details.
 *   3. If you are a sole trader (eenmanszaak), company name = your trading name.
 *   4. VAT (BTW) number is only required if you are VAT-registered.
 *      Individual workers / small operators often qualify for the KOR exemption.
 *   5. Redeploy after updating — changes go live in Footer + Privacy + Terms.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const LEGAL = {
  /** Trading / brand name displayed on the website */
  brandName: "AgencyCheck",

  /**
   * Full legal entity name — sole trader (eenmanszaak).
   * Required by Dutch law (Wet elektronische handel) on Footer, Privacy, and Terms pages.
   */
  legalName: "Antonio Macas h.o.d.n. AgencyCheck",

  /**
   * KvK (Kamer van Koophandel) registration number — 8 digits.
   * TODO: Replace with your number once registration is confirmed at kvk.nl.
   */
  kvkNumber: "",               // ← ADD when KvK registration is confirmed

  /**
   * BTW (VAT) identification number. Format: NL000000000B01
   * Leave empty string if you are exempt (KOR / not VAT-registered).
   * At current revenue levels KOR exemption likely applies — leave empty until advised otherwise.
   */
  vatNumber: "",               // leave empty if KOR-exempt

  /**
   * Registered business address — required by Dutch law on commercial websites.
   */
  address: {
    street:  "Nicolaas Beetsstraat 50B",
    city:    "Schiedam",
    postcode: "3117 ST",
    country: "Netherlands",
  },

  /** Primary contact email (shown on About / Contact pages) */
  emailGeneral:  "hello@agencycheck.io",
  emailPrivacy:  "hello@agencycheck.io",
  emailLegal:    "hello@agencycheck.io",
  emailAgencies: "hello@agencycheck.io",

  /** Website URL */
  siteUrl: "https://agencycheck.io",
} as const;

/**
 * Returns true when KvK number has been filled in.
 * Address and legal name are already set — only KvK is still pending.
 */
export const isLegalConfigComplete = (): boolean =>
  LEGAL.kvkNumber.length > 0;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * WHEN SWITCHING TO A CROATIAN OBRT — locations requiring update:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 1. THIS FILE (lib/legalConfig.ts):
 *    - legalName:  e.g. "Antonio Macas obrt AgencyCheck"
 *    - kvkNumber:  replace with Croatian OIB (osobni identifikacijski broj), 11 digits
 *    - vatNumber:  Croatian PDV number (format: HR + OIB), if VAT-registered
 *    - address:    Croatian registered address (street, city, postcode, country: "Croatia")
 *    - emailGeneral / emailPrivacy / emailLegal / emailAgencies: update if changed
 *
 * 2. app/transparency/page.tsx — line ~99:
 *    HARDCODED string: { label: "Legal form", value: "Eenmanszaak (sole trader)" }
 *    → Change to: "Obrt (sole trader)" and remove KvK reference in same block
 *    → The "Verify at kvk.nl" link also needs updating to Croatian register (sud.hr or obrt.hr)
 *
 * 3. app/transparency/page.tsx — GDPR supervisory authority references:
 *    Dutch authority (Autoriteit Persoonsgegevens) referenced in Sections 7, 8, and dispute section.
 *    If data controller moves to Croatia, lead supervisory authority becomes AZOP
 *    (Agencija za zaštitu osobnih podataka — azop.hr). Update all AP references.
 *
 * 4. app/privacy/page.tsx — Section 7:
 *    "lodge a complaint with the Dutch data protection authority" → update to AZOP
 *
 * 5. app/terms/page.tsx — Section 10 (governing law):
 *    "laws of the Netherlands" + "Rechtbank Rotterdam" → update to Croatian law + competent court
 *
 * 6. app/transparency/page.tsx — dispute section:
 *    "Rechtbank Rotterdam" → update to Croatian court
 *
 * 7. app/transparency/page.tsx — "Wet elektronische handel" reference:
 *    → Replace with Croatian equivalent (Zakon o elektroničkoj trgovini) or EU E-Commerce Directive directly
 *
 * DO NOT update any of the above until you have the confirmed Croatian obrt registration details.
 * ─────────────────────────────────────────────────────────────────────────────
 */
