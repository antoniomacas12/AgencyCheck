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
   * Full legal entity name.
   * Examples: "AgencyCheck B.V.", "AgencyCheck VOF", "A. Macas h.o.d.n. AgencyCheck"
   * TODO: Replace with your real legal entity name
   */
  legalName: "AgencyCheck",   // ← FILL IN

  /**
   * KvK (Kamer van Koophandel) registration number.
   * Find yours at kvk.nl — 8 digits.
   * TODO: Replace with your real KvK number
   */
  kvkNumber: "",               // ← FILL IN e.g. "12345678"

  /**
   * BTW (VAT) identification number. Format: NL000000000B01
   * Leave empty string if you are exempt (KOR / not VAT-registered).
   * TODO: Replace with your BTW number, or leave empty if not applicable
   */
  vatNumber: "",               // ← FILL IN or leave empty

  /**
   * Registered business address. Required by Dutch law on commercial websites.
   * TODO: Replace with your real address
   */
  address: {
    street:  "",               // ← FILL IN e.g. "Keizersgracht 123"
    city:    "",               // ← FILL IN e.g. "Amsterdam"
    postcode:"",               // ← FILL IN e.g. "1015 CJ"
    country: "Netherlands",
  },

  /** Primary contact email (shown on About / Contact pages) */
  emailGeneral:  "hello@agencycheck.nl",
  emailPrivacy:  "privacy@agencycheck.nl",
  emailLegal:    "legal@agencycheck.nl",
  emailAgencies: "agencies@agencycheck.nl",

  /** Website URL */
  siteUrl: "https://agencycheck.nl",
} as const;

/** Returns true when the KvK number has been filled in */
export const isLegalConfigComplete = (): boolean =>
  LEGAL.kvkNumber.length > 0 &&
  LEGAL.legalName !== "AgencyCheck" &&
  LEGAL.address.street.length > 0;
