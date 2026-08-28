/**
 * legalConfig.ts — Single source of truth for AgencyCheck legal identity.
 *
 * AgencyCheck is operated by a Croatian sole proprietorship (obrt).
 * All legal pages read from this file. Update here; pages update automatically.
 *
 * IMPORTANT: Do not hardcode legal entity details in page components.
 */

export const LEGAL = {
  brandName:   "AgencyCheck",
  legalName:   "AgencyCheck, obrt za poslovne usluge, vl. Antonio Maćaš",
  ownerName:   "Antonio Maćaš",
  legalForm:   "Obrt (Croatian sole proprietorship)",

  // Croatian business registration
  oib:                 "59683153877",       // Osobni identifikacijski broj
  mbo:                 "99352117",           // Matični broj obrta
  obrtnicaNumber:      "14010402288",        // Obrtnica number
  registrationDate:    "19 August 2026",
  registrationRegister: "Obrtni registar Republike Hrvatske",
  nkdCode:             "78.10.0",
  nkdDescription:      "Djelatnosti agencija za zapošljavanje",

  address: {
    street:   "Vijenac Salomona Henricha Gutmanna 5A",
    city:     "Belišće",
    postcode: "31551",
    country:  "Croatia",
  },

  // Contact (single inbox for now — create privacy@agencycheck.io alias when ready)
  emailGeneral:  "hello@agencycheck.io",
  emailPrivacy:  "hello@agencycheck.io",
  emailLegal:    "hello@agencycheck.io",
  emailAgencies: "hello@agencycheck.io",

  siteUrl: "https://agencycheck.io",

  // Croatian GDPR supervisory authority
  supervisoryAuthority: {
    name:    "Agencija za zaštitu osobnih podataka (AZOP)",
    website: "https://azop.hr",
    // Verified 28 Aug 2026 — "Zahtjev za utvrđivanje povrede prava" is the correct complaint form
    complaintUrl: "https://azop.hr/zahtjev-za-utvrdivanje-povrede-prava/",
  },

  // Ministry of Labour registration — PENDING, do not display until confirmed
  // Once confirmation arrives, fill this object and set pending: false
  ministryRegistration: {
    pending: true,
    authorityName:       "" as string,
    registrationNumber:  "" as string,
    registrationDate:    "" as string,
  },

  /**
   * ACCOUNTING RETENTION — Croatian legal requirement.
   *
   * Zakon o računovodstvu (Croatian Accounting Act, NN 78/15 and amendments)
   * specifies retention periods for accounting records.
   *
   * DEPLOYMENT BLOCKER: confirm the exact period with a Croatian accountant or lawyer
   * before relying on this constant in automated deletion logic.
   *
   * Placeholder: null — automated deletion of financial records is BLOCKED
   * until this is set to a verified number.
   *
   * When confirmed, set to the number of years (e.g. 11) and remove this comment.
   */
  accountingRetentionYears: null as number | null,

  /**
   * CANDIDATE PERSONAL DATA RETENTION — GDPR Art. 5(1)(e) storage limitation.
   * Unplaced leads: 12 months from submission.
   * Placed leads: personal data anonymised after 12 months; financial records
   * retained for accountingRetentionYears (when confirmed).
   */
  candidateDataRetentionMonths: 12,
} as const;

export type LegalConfig = typeof LEGAL;
