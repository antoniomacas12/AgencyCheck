// ─── AgencyCheck — Agency Metadata Layer ─────────────────────────────────────
// Defines the structured taxonomy for agency types, job focus areas,
// and the transparency score computation.
// This is NOT auto-generated — it is the hand-curated semantic enrichment layer.

// ─── Sector Taxonomy ──────────────────────────────────────────────────────────

export type AgencySector =
  | "logistics"
  | "food-production"
  | "construction"
  | "healthcare"
  | "it-tech"
  | "transport"
  | "hospitality"
  | "agriculture"
  | "cleaning"
  | "general-staffing"
  | "office-admin"
  | "engineering";

export interface SectorMeta {
  slug:          AgencySector;
  label:         string;
  labelNL:       string;
  icon:          string;
  description:   string;
  /** Keywords from agency jobTypes/name used to infer this sector */
  keywords:      string[];
  /** Typical job focus slugs within this sector */
  jobFocusSlugs: string[];
}

export const SECTOR_META: Record<AgencySector, SectorMeta> = {
  logistics: {
    slug:          "logistics",
    label:         "Logistics & Warehousing",
    labelNL:       "Logistiek & Opslag",
    icon:          "📦",
    description:   "Distribution, order picking, warehouse operations, and supply chain staffing.",
    keywords:      ["logistiek", "warehouse", "distributie", "order", "picking", "dc", "expeditie", "opslag", "supply chain", "fulfillment"],
    jobFocusSlugs: ["order-picker", "warehouse-worker", "forklift-driver", "reach-truck-driver", "logistics-operator"],
  },
  "food-production": {
    slug:          "food-production",
    label:         "Food Production & Processing",
    labelNL:       "Voedingsmiddelen & Productie",
    icon:          "🥦",
    description:   "Food manufacturing, packing, processing, and production line work.",
    keywords:      ["food", "voeding", "productie", "verpakking", "packing", "inpak", "slachterij", "bakkerij", "zuivel", "vers", "diepvries"],
    jobFocusSlugs: ["production-worker", "packing-operator", "assembly-worker", "machine-operator"],
  },
  construction: {
    slug:          "construction",
    label:         "Construction & Trades",
    labelNL:       "Bouw & Installatietechniek",
    icon:          "🏗️",
    description:   "Building, civil engineering, skilled trades, and installation work.",
    keywords:      ["bouw", "constructie", "timmerman", "schilder", "loodgieter", "stucadoor", "metselaar", "installatie", "hvac", "civiel"],
    jobFocusSlugs: ["construction-trade", "installation-technician"],
  },
  healthcare: {
    slug:          "healthcare",
    label:         "Healthcare & Care",
    labelNL:       "Zorg & Welzijn",
    icon:          "🏥",
    description:   "Nursing, care work, healthcare professionals, and ZZP care placement.",
    keywords:      ["zorg", "care", "verpleeg", "nursing", "thuiszorg", "verzorgend", "zzp zorg", "vvt", "gehandicaptenzorg", "geestelijke"],
    jobFocusSlugs: ["care-worker", "nursing", "home-care"],
  },
  "it-tech": {
    slug:          "it-tech",
    label:         "IT & Technology",
    labelNL:       "IT & Technologie",
    icon:          "💻",
    description:   "Software development, infrastructure, cybersecurity, and tech specialist staffing.",
    keywords:      ["it", "software", "developer", "tech", "ict", "saas", "cloud", "data", "cyber", "infrastructure", "java", ".net", "frontend", "backend"],
    jobFocusSlugs: ["software-developer", "it-infrastructure", "data-analyst"],
  },
  transport: {
    slug:          "transport",
    label:         "Transport & Driving",
    labelNL:       "Transport & Chauffeurs",
    icon:          "🚛",
    description:   "Truck drivers, delivery, bus and logistics transport professionals.",
    keywords:      ["chauffeur", "transport", "rijden", "vrachtwagen", "truck", "delivery", "bezorger", "ritrijder", "taxichauffeur", "logistics driver"],
    jobFocusSlugs: ["truck-driver", "delivery-driver"],
  },
  hospitality: {
    slug:          "hospitality",
    label:         "Hospitality & Events",
    labelNL:       "Horeca & Evenementen",
    icon:          "🍽️",
    description:   "Hotel, restaurant, catering, and events staffing for the hospitality industry.",
    keywords:      ["horeca", "hotel", "restaurant", "catering", "event", "ober", "kok", "bartender", "receptie", "housekeeping"],
    jobFocusSlugs: ["hospitality-staff", "event-crew"],
  },
  agriculture: {
    slug:          "agriculture",
    label:         "Agriculture & Horticulture",
    labelNL:       "Agrarisch & Tuinbouw",
    icon:          "🌾",
    description:   "Seasonal farm work, greenhouse cultivation, and horticulture staffing.",
    keywords:      ["agrar", "tuinbouw", "kas", "oogst", "planten", "bloemkweker", "fruit", "seizoen", "agro", "akkerbouw", "landelijk"],
    jobFocusSlugs: ["greenhouse-worker", "seasonal-farm-worker"],
  },
  cleaning: {
    slug:          "cleaning",
    label:         "Cleaning & Facility",
    labelNL:       "Schoonmaak & Facilitair",
    icon:          "🧹",
    description:   "Industrial cleaning, office cleaning, and facility management staffing.",
    keywords:      ["schoonmaak", "cleaning", "facilitair", "glazenwasser", "huishoud", "onderhoud", "reiniging"],
    jobFocusSlugs: ["cleaning-staff"],
  },
  "general-staffing": {
    slug:          "general-staffing",
    label:         "General Staffing",
    labelNL:       "Algemeen Uitzendbureau",
    icon:          "🏢",
    description:   "Multi-sector temporary work placement across a broad range of industries.",
    keywords:      ["uitzendbureau", "flexwerk", "tijdelijk", "algemeen", "breed", "multi", "divers", "allround"],
    jobFocusSlugs: ["order-picker", "warehouse-worker", "production-worker", "cleaning-staff"],
  },
  "office-admin": {
    slug:          "office-admin",
    label:         "Office & Administration",
    labelNL:       "Kantoor & Administratie",
    icon:          "📋",
    description:   "Administrative support, secretarial, finance, HR, and office professional staffing.",
    keywords:      ["admin", "administratief", "secretar", "kantoor", "financieel", "boekhouding", "hr", "receptie", "office", "management support"],
    jobFocusSlugs: ["admin-worker", "finance-clerk"],
  },
  engineering: {
    slug:          "engineering",
    label:         "Engineering & Technical",
    labelNL:       "Engineering & Techniek",
    icon:          "⚙️",
    description:   "Technical engineering, industrial maintenance, and specialist engineering staffing.",
    keywords:      ["engineering", "techniek", "elektrotech", "mechanical", "werktuigbouw", "offshore", "petrochemical", "manufacturing", "onderhoud techniek", "mtd"],
    jobFocusSlugs: ["machine-operator", "assembly-worker", "technical-specialist"],
  },
};

export const SECTORS = Object.values(SECTOR_META);

// ─── Job Focus ────────────────────────────────────────────────────────────────

export type JobFocusSlug =
  | "order-picker"
  | "warehouse-worker"
  | "forklift-driver"
  | "reach-truck-driver"
  | "production-worker"
  | "packing-operator"
  | "truck-driver"
  | "delivery-driver"
  | "machine-operator"
  | "assembly-worker"
  | "greenhouse-worker"
  | "cleaning-staff"
  | "care-worker"
  | "nursing"
  | "home-care"
  | "software-developer"
  | "it-infrastructure"
  | "data-analyst"
  | "hospitality-staff"
  | "admin-worker"
  | "technical-specialist";

// ─── Transparency Score ───────────────────────────────────────────────────────

export interface TransparencyInput {
  housing:              "YES" | "NO" | "UNKNOWN";
  transport:            "YES" | "NO" | "UNKNOWN";
  website:              string | null;
  description:          string | null;
  email:                string | null;
  phone:                string | null;
  housingVerification?: { status?: string } | null;
  transportVerification?: { status?: string } | null;
  reviewCount:          number;
  issueCount:           number;
  sourceType?:          string;
}

/**
 * Compute a 0–100 transparency score for an agency based on available verified data.
 * Higher = more worker-friendly data coverage.
 *
 * Scoring:
 *   +20  Housing explicitly confirmed (YES or NO — not UNKNOWN)
 *   +15  Transport explicitly confirmed
 *   +15  Has working website
 *   +10  Has description (contextual info for workers)
 *   +10  Has contact info (email or phone)
 *   +10  Has at least 1 worker review
 *   +10  Source is OFFICIAL_WEBSITE (data from primary source)
 *   +10  Housing verification status is "verified"
 *   −10  Each open issue report (capped at −30)
 *   = Raw 0–100, clamped to [0,100]
 */
export function computeTransparencyScore(input: TransparencyInput): number {
  let score = 0;

  if (input.housing !== "UNKNOWN")    score += 20;
  if (input.transport !== "UNKNOWN")  score += 15;
  if (input.website)                  score += 15;
  if (input.description)              score += 10;
  if (input.email || input.phone)     score += 10;
  if (input.reviewCount > 0)          score += 10;
  if (input.sourceType === "OFFICIAL_WEBSITE") score += 10;
  if (input.housingVerification?.status === "verified") score += 10;

  const issuePenalty = Math.min(input.issueCount * 10, 30);
  score -= issuePenalty;

  return Math.max(0, Math.min(100, score));
}

// ─── Sector Inference ─────────────────────────────────────────────────────────

/**
 * Infer the most likely sector for an agency from its jobTypes string, name, and description.
 * Returns the top sector match (highest keyword hits), or "general-staffing" as fallback.
 */
export function inferSector(opts: {
  name:        string;
  jobTypes:    string | null;
  description: string | null;
}): AgencySector {
  const haystack = [opts.name, opts.jobTypes, opts.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const scores: Record<AgencySector, number> = {} as Record<AgencySector, number>;

  for (const sector of SECTORS) {
    scores[sector.slug] = sector.keywords.filter((kw) =>
      haystack.includes(kw.toLowerCase())
    ).length;
  }

  const best = (Object.entries(scores) as [AgencySector, number][])
    .sort((a, b) => b[1] - a[1])[0];

  return best && best[1] > 0 ? best[0] : "general-staffing";
}

/**
 * Infer job focus slugs from jobTypes string.
 * Returns up to 4 focus slugs based on keyword matching.
 */
export function inferJobFocus(opts: {
  jobTypes:    string | null;
  description: string | null;
  sector:      AgencySector;
}): JobFocusSlug[] {
  const haystack = [opts.jobTypes, opts.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const focusKeywords: Record<JobFocusSlug, string[]> = {
    "order-picker":       ["order picker", "order pick", "orderpick", "picking"],
    "warehouse-worker":   ["warehouse", "magazijn", "opslag"],
    "forklift-driver":    ["forklift", "heftruck", "vorkheftruck"],
    "reach-truck-driver": ["reach truck", "reachtruck", "high bay"],
    "production-worker":  ["productie", "production", "assemblag", "fabriek"],
    "packing-operator":   ["packing", "inpak", "verpakk"],
    "truck-driver":       ["vrachtwagen", "truck driver", "chauffeur ce"],
    "delivery-driver":    ["delivery", "bezorg", "pakket", "last mile"],
    "machine-operator":   ["machine", "operator", "bediener", "cnc"],
    "assembly-worker":    ["assembl", "montage", "monteur"],
    "greenhouse-worker":  ["kas", "greenhouse", "tuinbouw", "teelt"],
    "cleaning-staff":     ["schoonmaak", "cleaning", "reinig"],
    "care-worker":        ["verzorg", "care worker", "thuiszorg"],
    "nursing":            ["verpleeg", "nurs", "zzp zorg"],
    "home-care":          ["thuiszorg", "home care", "thuis"],
    "software-developer": ["developer", "software", "programmeur", "coding"],
    "it-infrastructure":  ["infrastructure", "netwer", "systeem beheer", "server"],
    "data-analyst":       ["data analyst", "bi analyst", "business intell"],
    "hospitality-staff":  ["horeca", "hotel", "ober", "bartend", "event"],
    "admin-worker":       ["admin", "secretar", "kantoor", "office", "management assistent"],
    "technical-specialist": ["engineer", "technisch", "werktuig", "elektrotech"],
  };

  const matched: JobFocusSlug[] = [];
  for (const [slug, kws] of Object.entries(focusKeywords) as [JobFocusSlug, string[]][]) {
    if (kws.some((kw) => haystack.includes(kw))) {
      matched.push(slug);
    }
  }

  // If nothing matched from text, fall back to sector defaults
  if (matched.length === 0) {
    const sectorDefaults = SECTOR_META[opts.sector]?.jobFocusSlugs ?? [];
    return sectorDefaults.slice(0, 4) as JobFocusSlug[];
  }

  return matched.slice(0, 4);
}
