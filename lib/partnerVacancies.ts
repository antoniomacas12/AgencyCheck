/**
 * lib/partnerVacancies.ts
 *
 * Real vacancies submitted directly by verified recruitment partners.
 * These are NOT scraped — they come from agency partners and receive
 * priority placement on AgencyCheck.
 *
 * Applications go directly to AgencyCheck owner: +31 6 49210631
 */

export const WRX_WA_NUMBER = "31649210631";

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
    housing:       "own_preferred",
    housingCost:   null,
    transport:     "own_required",
    transportNote: "Own vehicle required",
    languages:     ["English B1/B2", "Dutch A1+"],
    certificates:  ["Reachtruck Certificate", "Forklift Certificate"],
    requirements: [
      "Reachtruck OR Forklift experience (certificate preferred)",
      "English B1/B2 OR Dutch A1+",
      "Own transport to work location",
      "Own accommodation required — housing not provided",
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

  // ── Integralis Partnership ─────────────────────────────────────────────────
  {
    slug:          "integralis-logistics-groenlo",
    partner:       "Integralis",
    partnerSlug:   "integralis",
    title:         "Logistics Employee",
    location:      "Groenlo",
    region:        "Gelderland, Netherlands",
    employment:    "Full-time",
    salaryDisplay: "Competitive salary",
    salaryNote:    "Details provided on application",
    salaryMin:     14.71,
    category:      "warehouse",
    urgent:        false,
    housing:       "yes",
    housingCost:   "€145–155",
    transport:     "included",
    transportNote: "Company car provided",
    languages:     ["English B1", "Dutch A1+"],
    certificates:  ["Category B driving licence"],
    requirements:  [],
    responsibilities: [],
    benefits:      [],
    environment:   "Logistics and warehouse operations in Groenlo. EPT (Electric Pallet Truck) can be learned on the job. Company car provided.",
    etRegeling:    true,
    postedDate:    "2026-09-10",
    metaTitle:     "Logistics Employee Groenlo — Integralis | AgencyCheck",
    metaDesc:      "Logistics Employee vacancy in Groenlo, Netherlands via Integralis. Accommodation available €145–155. Company car provided. Category B licence required. Apply via AgencyCheck.",
  },
  {
    slug:          "integralis-cleaning-groenlo",
    partner:       "Integralis",
    partnerSlug:   "integralis",
    title:         "Cleaning Worker",
    location:      "Groenlo",
    region:        "Gelderland, Netherlands",
    employment:    "Full-time",
    salaryDisplay: "€14.71/hr gross",
    salaryNote:    "Dutch statutory minimum wage 2026",
    salaryMin:     14.71,
    category:      "cleaning",
    urgent:        false,
    housing:       "yes",
    housingCost:   "€145–155",
    transport:     "included",
    transportNote: "Company car provided",
    languages:     ["English B1", "Dutch A1+"],
    certificates:  ["Category B driving licence"],
    requirements:  [],
    responsibilities: [],
    benefits:      [],
    environment:   "Office and sanitary facility cleaning in Groenlo. Company car is provided. Category B driving licence required.",
    etRegeling:    true,
    postedDate:    "2026-09-10",
    metaTitle:     "Cleaning Worker Groenlo €14.71/hr — Integralis | AgencyCheck",
    metaDesc:      "Cleaning Worker vacancy in Groenlo, Netherlands via Integralis. €14.71/hr. Offices & sanitary only. Company car provided. Accommodation €145–155. Apply via AgencyCheck.",
  },
  {
    slug:          "integralis-machine-operator-hengelo",
    partner:       "Integralis",
    partnerSlug:   "integralis",
    title:         "Machine Operator",
    location:      "Hengelo",
    region:        "Overijssel, Netherlands",
    employment:    "Full-time",
    salaryDisplay: "€3,000–€3,500/mo + shift allowance",
    salaryNote:    "€3,630–€4,235/mo incl. shift allowance",
    salaryMin:     692,
    category:      "production",
    urgent:        false,
    housing:       "yes",
    housingCost:   "€145–155",
    transport:     "reimbursed",
    transportNote: "Travel reimbursement available",
    languages:     ["Dutch B1", "English B1"],
    certificates:  ["VAPRO-A (or willingness to obtain)"],
    requirements:  [],
    responsibilities: [],
    benefits:      [],
    environment:   "Salt production plant in Hengelo. 3-shift schedule. Direct employment contract (not via uitzendbureau). VAPRO-A certification required or willingness to obtain.",
    etRegeling:    true,
    postedDate:    "2026-09-10",
    metaTitle:     "Machine Operator Hengelo €3,000–3,500/mo — Integralis | AgencyCheck",
    metaDesc:      "Machine Operator vacancy at salt production facility in Hengelo, Netherlands via Integralis. €3,000–3,500/mo + shift allowance. 3-shift. Direct contract. VAPRO-A. Apply via AgencyCheck.",
  },
  {
    slug:          "integralis-technical-north-netherlands",
    partner:       "Integralis",
    partnerSlug:   "integralis",
    title:         "Technical Workers — Flange Mechanics / Ironworkers / Fitters",
    location:      "North Netherlands (Delamine & TCA)",
    region:        "Groningen / Drenthe, Netherlands",
    employment:    "Full-time",
    salaryDisplay: "€763 net/week (40h)",
    salaryNote:    "Accommodation €50/wk · Car €25/wk deduction",
    salaryMin:     763,
    category:      "technical",
    urgent:        true,
    housing:       "yes",
    housingCost:   "€50/wk",
    transport:     "included",
    transportNote: "Company car included · €25/wk deduction",
    languages:     ["English B1", "Dutch A1+"],
    certificates:  ["VCA", "WFPR (preferred)"],
    requirements:  [],
    responsibilities: [],
    benefits:      [],
    environment:   "Industrial plant maintenance at Delamine and TCA facilities in North Netherlands. Week 39 2026. VCA and WFPR certification preferred.",
    etRegeling:    true,
    postedDate:    "2026-09-10",
    metaTitle:     "Technical Workers North Netherlands €763/wk — URGENT | Integralis via AgencyCheck",
    metaDesc:      "URGENT: Flange Mechanics, Ironworkers, Fitters in North Netherlands (Delamine & TCA). €763 net/week 40h. Week 39 2026. VCA+WFPR preferred. Via Integralis. Apply via AgencyCheck.",
  },
  {
    slug:          "integralis-meat-processing-groenlo",
    partner:       "Integralis",
    partnerSlug:   "integralis",
    title:         "Meat Processing Worker",
    location:      "Groenlo",
    region:        "Gelderland, Netherlands",
    employment:    "Full-time",
    salaryDisplay: "Inquire on application",
    salaryNote:    "Details provided on application",
    salaryMin:     14.71,
    category:      "food",
    urgent:        false,
    housing:       "yes",
    housingCost:   "€145–155",
    transport:     "reimbursed",
    transportNote: "Transport options available",
    languages:     ["English B1", "Dutch A1+"],
    certificates:  [],
    requirements:  [],
    responsibilities: [],
    benefits:      [],
    environment:   "Slaughterhouse and meat processing facility in Groenlo. Multiple departments available: abattoir, deboning, vacuum packing, and more. Accommodation available in Enschede.",
    etRegeling:    true,
    postedDate:    "2026-09-10",
    metaTitle:     "Meat Processing Worker Groenlo — Integralis | AgencyCheck",
    metaDesc:      "Meat Processing Worker vacancy in Groenlo, Netherlands via Integralis. Multiple departments: slaughterhouse, deboning, packing. Accommodation €145–155 Enschede. Apply via AgencyCheck.",
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
