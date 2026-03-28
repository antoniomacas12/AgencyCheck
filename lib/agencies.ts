/**
 * lib/agencies.ts
 *
 * Single source of truth for the agency contact registry.
 * Emails are read from environment variables so they can be configured
 * per-environment without touching source code.
 *
 * Importing from here (not from a route file) keeps Next.js App Router
 * happy — route files must only export valid HTTP-method handlers and a
 * small set of config constants (dynamic, runtime, revalidate …).
 */

export interface AgencyContact {
  slug: string;
  name: string;
  email: string;
}

/**
 * Full registry of partner agencies.
 * Evaluated at module-load time so env vars are resolved once.
 */
const AGENCY_CONTACTS: AgencyContact[] = [
  { slug: "hobij",                  name: "HOBIJ",                  email: process.env.AGENCY_EMAIL_HOBIJ                    ?? "" },
  { slug: "nl-jobs",                name: "NL Jobs",                email: process.env.AGENCY_EMAIL_NL_JOBS                  ?? "" },
  { slug: "westflex",               name: "Westflex",               email: process.env.AGENCY_EMAIL_WESTFLEX                 ?? "" },
  { slug: "carriere",               name: "Carrière",               email: process.env.AGENCY_EMAIL_CARRIERE                 ?? "" },
  { slug: "international-flex-job", name: "International Flex Job",  email: process.env.AGENCY_EMAIL_INTERNATIONAL_FLEX_JOB  ?? "" },
  { slug: "covebo",                 name: "Covebo",                  email: process.env.AGENCY_EMAIL_COVEBO                  ?? "" },
  { slug: "otto-workforce",         name: "Otto Work Force",         email: process.env.AGENCY_EMAIL_OTTO_WORKFORCE           ?? "" },
  { slug: "randstad-nederland",     name: "Randstad Nederland",      email: process.env.AGENCY_EMAIL_RANDSTAD                ?? "" },
  { slug: "tempo-team",             name: "Tempo-Team",              email: process.env.AGENCY_EMAIL_TEMPO_TEAM               ?? "" },
];

/**
 * Returns all configured agency contacts.
 * Used by the admin "send lead" endpoint and the agencies list endpoint.
 */
export function getAllAgencyContacts(): AgencyContact[] {
  return AGENCY_CONTACTS;
}
