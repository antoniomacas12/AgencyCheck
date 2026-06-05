/**
 * lib/partnerVacancies.ts
 *
 * Real vacancies submitted directly by verified recruitment partners.
 * These are NOT scraped — they come from agency partners and receive
 * priority placement on AgencyCheck.
 *
 * Applications go through AgencyCheck (owner number: +31 6 13754893)
 */

export const WRX_WA_NUMBER = "31613754893";

export interface PartnerVacancy {
  slug:          string;
  partner:       string;          // agency name
  partnerSlug:   string;          // for linking to agency profile
  title:         string;
  location:      string;
  region:        string;
  employment:    string;
  salaryDisplay: string;          // e.g. "€16.24/hr"
  salaryNote:    string;          // e.g. "Negotiable depending on experience"
  salaryMin:     number;          // hourly, for filtering
  category:      string;
  urgent:        boolean;
  housing:       "own_preferred" | "limited" | "yes";
  housingCost:   string | null;   // e.g. "€70/wk"
  transport:     "own_required" | "reimbursed" | "included";
  transportNote: string;
  languages:     string[];
  certificates:  string[];
  requirements:  string[];
  responsibilities: string[];
  benefits:      string[];
  environment:   string;
  etRegeling:    boolean;
  postedDate:    string;          // ISO date
  metaTitle:     string;
  metaDesc:      string;
}

export const PARTNER_VACANCIES: PartnerVacancy[] = [
  {
    slug:          "reachtruck-driver-tiel",
    partner:       "WRX Personeelsdiensten",
    partnerSlug:   "wrx-personeelsdiensten",
    title:         "Reachtruck Driver / Warehouse Worker",
    location:      "Tiel",
    region:        "Gelderland, Netherlands",
    employment:    "Full-time",
    salaryDisplay: "€16.24/hr gross",
    salaryNote:    "Negotiable depending on experience",
    salaryMin:     16.24,
    category:      "warehouse",
    urgent:        true,
    housing:       "own_preferred",
    housingCost:   "€70/wk",
    transport:     "reimbursed",
    transportNote: "Own vehicle required · €0.23/km reimbursement",
    languages:     ["Dutch A1/A2"],
    certificates:  ["Valid Reachtruck Certificate"],
    requirements: [
      "Valid Reachtruck Certificate (mandatory)",
      "Dutch language level A1/A2",
      "Own transport to Tiel",
      "Reliable and punctual attitude",
      "Warehouse experience preferred",
      "EU work permit or EU nationality",
    ],
    responsibilities: [
      "Reachtruck operation in warehouse",
      "Loading and unloading of goods",
      "Product storage and organisation",
      "Inventory handling and counting",
      "Warehouse logistics support",
      "General warehouse maintenance tasks",
    ],
    benefits: [
      "Small family-owned company — direct communication",
      "Stable long-term opportunity",
      "Competitive salary €16.24+/hr",
      "ET arrangement applicable (tax benefit for cross-border workers)",
      "Travel reimbursement €0.23/km",
      "Friendly work environment",
    ],
    environment:   "Small family-owned warehouse specialising in bathroom products: sinks, showers and sanitary products. Direct communication with management. No large corporate hierarchy.",
    etRegeling:    true,
    postedDate:    "2026-06-04",
    metaTitle:     "Reachtruck Driver Tiel — €16.24/hr | WRX via AgencyCheck",
    metaDesc:      "Reachtruck Driver / Warehouse Worker vacancy in Tiel, Netherlands. €16.24 gross/hr, negotiable. Valid reachtruck certificate required. Dutch A1/A2. Apply via AgencyCheck.",
  },
  {
    slug:          "forklift-reachtruck-tiel",
    partner:       "WRX Personeelsdiensten",
    partnerSlug:   "wrx-personeelsdiensten",
    title:         "Forklift / Reachtruck Warehouse Worker",
    location:      "Tiel",
    region:        "Gelderland, Netherlands",
    employment:    "Full-time",
    salaryDisplay: "Based on qualifications",
    salaryNote:    "Competitive — based on experience and certificates",
    salaryMin:     14.71,
    category:      "warehouse",
    urgent:        true,
    housing:       "limited",
    housingCost:   null,
    transport:     "own_required",
    transportNote: "Own vehicle required",
    languages:     ["English B1/B2", "Dutch A1+"],
    certificates:  ["Reachtruck Certificate", "Forklift Certificate"],
    requirements: [
      "Reachtruck OR Forklift experience (certificate preferred)",
      "English B1/B2 OR Dutch A1+",
      "Own transport to work location",
      "Strong work ethic and reliability",
      "Warehouse experience preferred",
      "EU work permit or EU nationality",
    ],
    responsibilities: [
      "Forklift operation",
      "Reachtruck operation",
      "Loading and unloading of pallets and goods",
      "Inventory movement and tracking",
      "Warehouse logistics tasks",
      "Maintaining safe work environment",
    ],
    benefits: [
      "Immediate openings — start quickly",
      "Stable work environment",
      "Long-term opportunities available",
      "Competitive pay based on certificates",
      "Both forklift and reachtruck experience valued",
    ],
    environment:   "Stable warehouse operation in Tiel (Gelderland). Direct employer contact through WRX Personeelsdiensten. Both forklift and reachtruck operators welcome.",
    etRegeling:    false,
    postedDate:    "2026-06-04",
    metaTitle:     "Forklift / Reachtruck Operator Tiel — Immediate Start | AgencyCheck",
    metaDesc:      "Forklift and Reachtruck Warehouse Worker vacancy in Tiel, Netherlands. Immediate openings. Competitive salary based on experience. English B1/B2 or Dutch A1+. Apply via AgencyCheck.",
  },
];

export function getPartnerVacancyBySlug(slug: string): PartnerVacancy | undefined {
  return PARTNER_VACANCIES.find((v) => v.slug === slug);
}

/** Build a pre-filled WhatsApp application message */
export function buildPartnerApplyLink(vacancy: PartnerVacancy): string {
  const text = `Hi, I want to apply for: ${vacancy.title} in ${vacancy.location} [AgencyCheck Partner Vacancy]`;
  return `https://wa.me/${WRX_WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
