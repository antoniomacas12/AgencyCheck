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
   * Full legal entity name — sole trader (eenmanszaak)
   * Update to "Antonio Macas h.o.d.n. AgencyCheck" once KvK registration is complete.
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
