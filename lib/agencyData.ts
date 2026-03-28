// ─── AgencyCheck — Compatibility Re-export Layer ─────────────────────────────
// Bridges legacy import names (AGENCIES, AGENCY_MAP, AGENCIES_WITH_HOUSING)
// to the production data layer in lib/agencyEnriched.ts.
// Source of truth: 127 research-verified agencies in data/agencies.ts.

export type { AgencyCardData } from "@/lib/agencyEnriched";
export {
  ALL_AGENCIES   as AGENCIES,
  ALL_AGENCY_MAP as AGENCY_MAP,
  HOUSING_AGENCIES as AGENCIES_WITH_HOUSING,
} from "@/lib/agencyEnriched";
