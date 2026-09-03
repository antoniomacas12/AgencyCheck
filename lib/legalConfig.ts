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
    street:   "Vijenac Salamona Henricha Gutmanna 5A",
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

  // Business activity start date
  activityStartDate: "15 September 2026",

  // Ministry of Labour registration — confirmed 26 August 2026
  ministryRegistration: {
    pending:              false,
    authorityName:        "Croatian Ministry of Labour, Pension System, Family and Social Policy",
    registrationDate:     "26 August 2026",
    registrationNumber:   "" as string, // TODO: obtain exact register reference number if issued separately
    /**
     * Approved wording (use exactly as written):
     * "AgencyCheck is registered in Croatia for employment-related activities and is entered
     *  in the register maintained by the Croatian Ministry of Labour, Pension System, Family
     *  and Social Policy."
     * Short: "Registered in Croatia for employment-related activities."
     */
  },

  // Approved ministry registration wording (do not paraphrase)
  ministryWording: {
    long:  "AgencyCheck is registered in Croatia for employment-related activities and is entered in the register maintained by the Croatian Ministry of Labour, Pension System, Family and Social Policy.",
    short: "Registered in Croatia for employment-related activities.",
  },

  /**
   * ACCOUNTING RETENTION — Croatian Accounting Act (Zakon o računovodstvu), Art. 10.
   *
   * Accounting documents used as the basis for entries in the journal/general ledger
   * and subsidiary ledgers must be retained for a minimum of 11 years.
   * The retention period begins at the end of the business year to which the records relate.
   *
   * Verified: August 2026.
   *
   * IMPORTANT: Only accounting/business documentation that must legally be retained
   * is kept for 11 years. Candidate phone numbers, emails, CVs and other recruitment
   * personal data are NOT retained for 11 years merely because the candidate generated
   * revenue. Personal data is anonymised after 12 months per candidateDataRetentionMonths.
   */
  accountingRetentionYears: 11,

  /**
   * CANDIDATE PERSONAL DATA RETENTION — GDPR Art. 5(1)(e) storage limitation.
   * Unplaced leads: 12 months from submission.
   * Placed leads: personal data anonymised after 12 months; financial records
   * retained for accountingRetentionYears (when confirmed).
   */
  candidateDataRetentionMonths: 12,
} as const;

export type LegalConfig = typeof LEGAL;
