// ─── AgencyCheck — Programmatic SEO Data ──────────────────────────────────────
// Central data store for salary pages, city pages, issue pages.
// CITIES is derived from canonical agency dataset (143 unique cities).

// ─── Cities ───────────────────────────────────────────────────────────────────

export interface CityData {
  name:       string;
  slug:       string;
  region:     string;
  population: number;  // rough reference
}

// All 143 cities present in the canonical agency dataset.
// Regions and populations are approximate reference values.
export const CITIES: CityData[] = [
  { name: "'S-Gravenhage",          slug: "s-gravenhage",           region: "Zuid-Holland",   population: 548000 },
  { name: "'S-Gravenzande",         slug: "s-gravenzande",          region: "Zuid-Holland",   population: 14000  },
  { name: "'S-Heerenberg",          slug: "s-heerenberg",           region: "Gelderland",     population: 8000   },
  { name: "'S-Hertogenbosch",       slug: "s-hertogenbosch",        region: "Noord-Brabant",  population: 155000 },
  { name: "Aalsmeer",               slug: "aalsmeer",               region: "Noord-Holland",  population: 32000  },
  { name: "Abcoude",                slug: "abcoude",                region: "Utrecht",        population: 9000   },
  { name: "Alblasserdam",           slug: "alblasserdam",           region: "Zuid-Holland",   population: 20000  },
  { name: "Alkmaar",                slug: "alkmaar",                region: "Noord-Holland",  population: 108000 },
  { name: "Almere",                 slug: "almere",                 region: "Flevoland",      population: 215000 },
  { name: "Assen",                  slug: "assen",                  region: "Drenthe",        population: 68000  },
  { name: "Alphen Aan Den Rijn",    slug: "alphen-aan-den-rijn",    region: "Zuid-Holland",   population: 113000 },
  { name: "Amersfoort",             slug: "amersfoort",             region: "Utrecht",        population: 160000 },
  { name: "Amsterdam",              slug: "amsterdam",              region: "Noord-Holland",  population: 921000 },
  { name: "Amsterdam-Duivendrecht", slug: "amsterdam-duivendrecht", region: "Noord-Holland",  population: 5000   },
  { name: "Apeldoorn",              slug: "apeldoorn",              region: "Gelderland",     population: 165000 },
  { name: "Arnhem",                 slug: "arnhem",                 region: "Gelderland",     population: 164000 },
  { name: "Asten",                  slug: "asten",                  region: "Noord-Brabant",  population: 17000  },
  { name: "Badhoevedorp",           slug: "badhoevedorp",           region: "Noord-Holland",  population: 12000  },
  { name: "Barendrecht",            slug: "barendrecht",            region: "Zuid-Holland",   population: 50000  },
  { name: "Barneveld",              slug: "barneveld",              region: "Gelderland",     population: 63000  },
  { name: "Bergeijk",               slug: "bergeijk",               region: "Noord-Brabant",  population: 19000  },
  { name: "Bergschenhoek",          slug: "bergschenhoek",          region: "Zuid-Holland",   population: 18000  },
  { name: "Beuningen",              slug: "beuningen",              region: "Gelderland",     population: 26000  },
  { name: "Boxmeer",                slug: "boxmeer",                region: "Noord-Brabant",  population: 29000  },
  { name: "Boxtel",                 slug: "boxtel",                 region: "Noord-Brabant",  population: 31000  },
  { name: "Breda",                  slug: "breda",                  region: "Noord-Brabant",  population: 185000 },
  { name: "Breskens",               slug: "breskens",               region: "Zeeland",        population: 4500   },
  { name: "Capelle Aan Den Ijssel", slug: "capelle-aan-den-ijssel", region: "Zuid-Holland",   population: 66000  },
  { name: "De Goorn",               slug: "de-goorn",               region: "Noord-Holland",  population: 7000   },
  { name: "De Meern",               slug: "de-meern",               region: "Utrecht",        population: 18000  },
  { name: "Delft",                  slug: "delft",                  region: "Zuid-Holland",   population: 103000 },
  { name: "Den Bosch",              slug: "den-bosch",              region: "Noord-Brabant",  population: 155000 },
  { name: "Den Haag",               slug: "den-haag",               region: "Zuid-Holland",   population: 548000 },
  { name: "Den Ham",                slug: "den-ham",                region: "Overijssel",     population: 5000   },
  { name: "Denekamp",               slug: "denekamp",               region: "Overijssel",     population: 10000  },
  { name: "Deventer",               slug: "deventer",               region: "Overijssel",     population: 100000 },
  { name: "Diemen",                 slug: "diemen",                 region: "Noord-Holland",  population: 31000  },
  { name: "Doetinchem",             slug: "doetinchem",             region: "Gelderland",     population: 57000  },
  { name: "Dordrecht",              slug: "dordrecht",              region: "Zuid-Holland",   population: 118000 },
  { name: "Dublin / Nl Market",     slug: "dublin-nl-market",       region: "International",  population: 0      },
  { name: "Duiven",                 slug: "duiven",                 region: "Gelderland",     population: 26000  },
  { name: "Echt",                   slug: "echt",                   region: "Limburg",        population: 33000  },
  { name: "Ede",                    slug: "ede",                    region: "Gelderland",     population: 117000 },
  { name: "Eindhoven",              slug: "eindhoven",              region: "Noord-Brabant",  population: 234000 },
  { name: "Elst",                   slug: "elst",                   region: "Gelderland",     population: 25000  },
  { name: "Emmeloord",              slug: "emmeloord",              region: "Flevoland",      population: 27000  },
  { name: "Emmen",                  slug: "emmen",                  region: "Drenthe",        population: 108000 },
  { name: "Enschede",               slug: "enschede",               region: "Overijssel",     population: 160000 },
  { name: "Etten-Leur",             slug: "etten-leur",             region: "Noord-Brabant",  population: 44000  },
  { name: "Geldrop",                slug: "geldrop",                region: "Noord-Brabant",  population: 28000  },
  { name: "Geleen",                 slug: "geleen",                 region: "Limburg",        population: 33000  },
  { name: "Gemert",                 slug: "gemert",                 region: "Noord-Brabant",  population: 30000  },
  { name: "Goes",                   slug: "goes",                   region: "Zeeland",        population: 38000  },
  { name: "Gorinchem",              slug: "gorinchem",              region: "Zuid-Holland",   population: 36000  },
  { name: "Gouda",                  slug: "gouda",                  region: "Zuid-Holland",   population: 73000  },
  { name: "Groningen",              slug: "groningen",              region: "Groningen",      population: 232000 },
  { name: "Haaksbergen",            slug: "haaksbergen",            region: "Overijssel",     population: 25000  },
  { name: "Haarlem",                slug: "haarlem",                region: "Noord-Holland",  population: 163000 },
  { name: "Hapert",                 slug: "hapert",                 region: "Noord-Brabant",  population: 4500   },
  { name: "Haulerwijk",             slug: "haulerwijk",             region: "Friesland",      population: 1000   },
  { name: "Heemskerk",              slug: "heemskerk",              region: "Noord-Holland",  population: 40000  },
  { name: "Heenvliet",              slug: "heenvliet",              region: "Zuid-Holland",   population: 4000   },
  { name: "Heerenveen",             slug: "heerenveen",             region: "Friesland",      population: 50000  },
  { name: "Heerlen",                slug: "heerlen",                region: "Limburg",        population: 87000  },
  { name: "Hellevoetsluis",         slug: "hellevoetsluis",         region: "Zuid-Holland",   population: 41000  },
  { name: "Helmond",                slug: "helmond",                region: "Noord-Brabant",  population: 93000  },
  { name: "Hengelo",                slug: "hengelo",                region: "Overijssel",     population: 81000  },
  { name: "Herten",                 slug: "herten",                 region: "Limburg",        population: 9000   },
  { name: "Herten-Roermond",        slug: "herten-roermond",        region: "Limburg",        population: 9000   },
  { name: "Hilversum",              slug: "hilversum",              region: "Noord-Holland",  population: 92000  },
  { name: "Hoevelaken",             slug: "hoevelaken",             region: "Gelderland",     population: 10000  },
  { name: "Honselersdijk",          slug: "honselersdijk",          region: "Zuid-Holland",   population: 10000  },
  { name: "Hoofddorp",              slug: "hoofddorp",              region: "Noord-Holland",  population: 78000  },
  { name: "Hooglanderveen",         slug: "hooglanderveen",         region: "Utrecht",        population: 6000   },
  { name: "Hoorn",                  slug: "hoorn",                  region: "Noord-Holland",  population: 73000  },
  { name: "Horst",                  slug: "horst",                  region: "Limburg",        population: 43000  },
  { name: "Houten",                 slug: "houten",                 region: "Utrecht",        population: 50000  },
  { name: "Huizen",                 slug: "huizen",                 region: "Noord-Holland",  population: 42000  },
  { name: "Joure",                  slug: "joure",                  region: "Friesland",      population: 12000  },
  { name: "Kampen",                 slug: "kampen",                 region: "Overijssel",     population: 54000  },
  { name: "Kerkrade",               slug: "kerkrade",               region: "Limburg",        population: 44000  },
  { name: "Leerdam",                slug: "leerdam",                region: "Zuid-Holland",   population: 21000  },
  { name: "Leeuwarden",             slug: "leeuwarden",             region: "Friesland",      population: 124000 },
  { name: "Leiden",                 slug: "leiden",                 region: "Zuid-Holland",   population: 126000 },
  { name: "Leiderdorp",             slug: "leiderdorp",             region: "Zuid-Holland",   population: 27000  },
  { name: "Leusden",                slug: "leusden",                region: "Utrecht",        population: 30000  },
  { name: "Lichtenvoorde",          slug: "lichtenvoorde",          region: "Gelderland",     population: 19000  },
  { name: "Lijnden",                slug: "lijnden",                region: "Noord-Holland",  population: 5000   },
  { name: "Maasdijk",               slug: "maasdijk",               region: "Zuid-Holland",   population: 7000   },
  { name: "Maastricht",             slug: "maastricht",             region: "Limburg",        population: 122000 },
  { name: "Maastricht Airport",     slug: "maastricht-airport",     region: "Limburg",        population: 0      },
  { name: "Middelburg",             slug: "middelburg",             region: "Zeeland",        population: 49000  },
  { name: "Milsbeek",               slug: "milsbeek",               region: "Limburg",        population: 3000   },
  { name: "Naaldwijk",              slug: "naaldwijk",              region: "Zuid-Holland",   population: 30000  },
  { name: "Nieuwegein",             slug: "nieuwegein",             region: "Utrecht",        population: 63000  },
  { name: "Nijkerk",                slug: "nijkerk",                region: "Gelderland",     population: 45000  },
  { name: "Nijmegen",               slug: "nijmegen",               region: "Gelderland",     population: 178000 },
  { name: "Noordwijkerhout",        slug: "noordwijkerhout",        region: "Zuid-Holland",   population: 17000  },
  { name: "Nootdorp",               slug: "nootdorp",               region: "Zuid-Holland",   population: 18000  },
  { name: "Oldeberkoop",            slug: "oldeberkoop",            region: "Friesland",      population: 700    },
  { name: "Oldenzaal",              slug: "oldenzaal",              region: "Overijssel",     population: 32000  },
  { name: "Oosterwolde",            slug: "oosterwolde",            region: "Friesland",      population: 13000  },
  { name: "Oostrum",                slug: "oostrum",                region: "Limburg",        population: 3500   },
  { name: "Oss",                    slug: "oss",                    region: "Noord-Brabant",  population: 93000  },
  { name: "Oudenbosch",             slug: "oudenbosch",             region: "Noord-Brabant",  population: 12000  },
  { name: "Oudeschoot",             slug: "oudeschoot",             region: "Friesland",      population: 700    },
  { name: "Papendrecht",            slug: "papendrecht",            region: "Zuid-Holland",   population: 32000  },
  { name: "Prinsenbeek",            slug: "prinsenbeek",            region: "Noord-Brabant",  population: 10000  },
  { name: "Purmerend",              slug: "purmerend",              region: "Noord-Holland",  population: 81000  },
  { name: "Rhenen",                 slug: "rhenen",                 region: "Utrecht",        population: 20000  },
  { name: "Rhoon",                  slug: "rhoon",                  region: "Zuid-Holland",   population: 17000  },
  { name: "Rijsenhout",             slug: "rijsenhout",             region: "Noord-Holland",  population: 4000   },
  { name: "Rijssen",                slug: "rijssen",                region: "Overijssel",     population: 38000  },
  { name: "Rijswijk",               slug: "rijswijk",               region: "Zuid-Holland",   population: 54000  },
  { name: "Rilland",                slug: "rilland",                region: "Zeeland",        population: 1200   },
  { name: "Roden",                  slug: "roden",                  region: "Drenthe",        population: 19000  },
  { name: "Rotterdam",              slug: "rotterdam",              region: "Zuid-Holland",   population: 651000 },
  { name: "Schagen",                slug: "schagen",                region: "Noord-Holland",  population: 46000  },
  { name: "Scheemda",               slug: "scheemda",               region: "Groningen",      population: 6000   },
  { name: "Schiphol",               slug: "schiphol",               region: "Noord-Holland",  population: 0      },
  { name: "Sneek",                  slug: "sneek",                  region: "Friesland",      population: 34000  },
  { name: "Son",                    slug: "son",                    region: "Noord-Brabant",  population: 16000  },
  { name: "Spijkenisse",            slug: "spijkenisse",            region: "Zuid-Holland",   population: 73000  },
  { name: "Stadskanaal",            slug: "stadskanaal",            region: "Groningen",      population: 32000  },
  { name: "Stellendam",             slug: "stellendam",             region: "Zuid-Holland",   population: 2500   },
  { name: "Stramproy",              slug: "stramproy",              region: "Limburg",        population: 3500   },
  { name: "Ter Apel",               slug: "ter-apel",               region: "Groningen",      population: 9000   },
  { name: "Tiel",                   slug: "tiel",                   region: "Gelderland",     population: 42000  },
  { name: "Tilburg",                slug: "tilburg",                region: "Noord-Brabant",  population: 220000 },
  { name: "Uitgeest",               slug: "uitgeest",               region: "Noord-Holland",  population: 14000  },
  { name: "Urk",                    slug: "urk",                    region: "Flevoland",      population: 21000  },
  { name: "Utrecht",                slug: "utrecht",                region: "Utrecht",        population: 361000 },
  { name: "Veenendaal",             slug: "veenendaal",             region: "Utrecht",        population: 65000  },
  { name: "Venlo",                  slug: "venlo",                  region: "Limburg",        population: 101000 },
  { name: "Venray",                 slug: "venray",                 region: "Limburg",        population: 44000  },
  { name: "Volendam",               slug: "volendam",               region: "Noord-Holland",  population: 23000  },
  { name: "Vorden",                 slug: "vorden",                 region: "Gelderland",     population: 7000   },
  { name: "Waalwijk",               slug: "waalwijk",               region: "Noord-Brabant",  population: 48000  },
  { name: "Wateringen",             slug: "wateringen",             region: "Zuid-Holland",   population: 25000  },
  { name: "Weesp",                  slug: "weesp",                  region: "Noord-Holland",  population: 19000  },
  { name: "Westland",               slug: "westland",               region: "Zuid-Holland",   population: 111000 },
  { name: "Wierden",                slug: "wierden",                region: "Overijssel",     population: 24000  },
  { name: "Wieringerwerf",          slug: "wieringerwerf",          region: "Noord-Holland",  population: 5000   },
  { name: "Zaandam",                slug: "zaandam",                region: "Noord-Holland",  population: 76000  },
  { name: "Zaltbommel",             slug: "zaltbommel",             region: "Gelderland",     population: 29000  },
  { name: "Zevenbergen",            slug: "zevenbergen",            region: "Noord-Brabant",  population: 14000  },
  { name: "Zoetermeer",             slug: "zoetermeer",             region: "Zuid-Holland",   population: 125000 },
  { name: "Zwolle",                 slug: "zwolle",                 region: "Overijssel",     population: 130000 },
  { name: "Belfeld",               slug: "belfeld",               region: "Limburg",        population: 4500   },
  { name: "Breukelen",             slug: "breukelen",             region: "Utrecht",        population: 15000  },
  { name: "Harderwijk",            slug: "harderwijk",            region: "Gelderland",     population: 48000  },
  { name: "Hoogeveen",             slug: "hoogeveen",             region: "Drenthe",        population: 67000  },
  { name: "Lelystad",              slug: "lelystad",              region: "Flevoland",      population: 78000  },
  { name: "Morsel",                slug: "morsel",                region: "Noord-Brabant",  population: 5000   },
  { name: "Tholen",                slug: "tholen",                region: "Zeeland",        population: 26000  },
  { name: "Vlissingen",            slug: "vlissingen",            region: "Zeeland",        population: 44000  },
  { name: "Woerden",               slug: "woerden",               region: "Utrecht",        population: 51000  },
  { name: "Wolvega",               slug: "wolvega",               region: "Friesland",      population: 13000  },
  { name: "Zeewolde",              slug: "zeewolde",              region: "Flevoland",      population: 22000  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find((c) => c.slug === slug);
}

/**
 * Cities sorted by population descending — used for "Other cities" navigation
 * and homepage featured city grid.
 */
export const CITIES_BY_POPULATION: CityData[] = [...CITIES].sort(
  (a, b) => b.population - a.population
);

/**
 * Top cities by population for UI features (homepage grid, compare, etc.)
 * Excludes special entries (airports, international).
 */
export const TOP_CITIES: CityData[] = CITIES_BY_POPULATION.filter(
  (c) => c.population >= 30000
).slice(0, 30);

// ─── Job Salary Data ──────────────────────────────────────────────────────────

export interface JobSalaryData {
  title:       string;
  slug:        string;
  icon:        string;
  min:         number;  // hourly €
  max:         number;
  avg:         number;
  description: string;
  // "label" alias kept for backward-compat with any consumers that used it
  label?:      string;
}

// ─── Salary figures updated to Dutch WML 2026 (€14.71/hr minimum) ────────────
// All min values are ≥ €14.71/hr (wettelijk minimumloon 2026).
// Figures aligned with SEO_JOB_TYPES in lib/seoRoutes.ts for consistency.
export const JOB_SALARY_DATA: Record<string, JobSalaryData> = {
  "order-picker":      { title: "Order Picker",      label: "Order Picker",      slug: "order-picker",      icon: "📦", min: 14.71, max: 16.00, avg: 14.50, description: "Picking and packing orders in warehouses and distribution centres." },
  "forklift-driver":   { title: "Forklift Driver",   label: "Forklift Driver",   slug: "forklift-driver",   icon: "🚜", min: 14.50, max: 19.00, avg: 16.00, description: "Operating forklifts and pallet trucks in logistics and industrial settings." },
  "warehouse-worker":  { title: "Warehouse Worker",  label: "Warehouse Worker",  slug: "warehouse-worker",  icon: "🏭", min: 14.71, max: 16.50, avg: 14.80, description: "General warehouse duties including receiving, storing, and shipping goods." },
  "production-worker": { title: "Production Worker", label: "Production Worker", slug: "production-worker", icon: "⚙️", min: 14.71, max: 16.50, avg: 15.00, description: "Assembly line and production tasks in factories and manufacturing plants." },
  "packing-operator":  { title: "Packing Operator",  label: "Packing Operator",  slug: "packing-operator",  icon: "📫", min: 14.71, max: 15.50, avg: 14.30, description: "Packing products for shipment in food, e-commerce, and manufacturing." },
  "truck-driver":      { title: "Truck Driver",       label: "Truck Driver",       slug: "truck-driver",      icon: "🚛", min: 15.00, max: 21.00, avg: 17.50, description: "Driving delivery trucks and articulated lorries across the Netherlands and EU." },
  "greenhouse-worker": { title: "Greenhouse Worker", label: "Greenhouse Worker", slug: "greenhouse-worker", icon: "🌿", min: 14.71, max: 15.00, avg: 14.20, description: "Cultivation, harvesting, and packaging in greenhouses and horticulture." },
  "assembly-worker":   { title: "Assembly Worker",   label: "Assembly Worker",   slug: "assembly-worker",   icon: "🔧", min: 14.71, max: 16.50, avg: 14.80, description: "Assembling components and products in automotive and electronics manufacturing." },
  "cleaning-staff":    { title: "Cleaning Staff",    label: "Cleaning Staff",    slug: "cleaning-staff",    icon: "🧹", min: 14.71, max: 14.50, avg: 14.15, description: "Cleaning offices, industrial sites, and residential buildings under agency contract." },
  "reach-truck-driver": { title: "Reach Truck Driver", label: "Reach Truck Driver", slug: "reach-truck-driver", icon: "🏗️", min: 15.00, max: 20.00, avg: 17.00, description: "Operating reach trucks in high-bay warehouses; MHE certificate required." },
  "machine-operator":  { title: "Machine Operator",  label: "Machine Operator",  slug: "machine-operator",  icon: "🔩", min: 14.50, max: 17.00, avg: 15.50, description: "Operating and monitoring production machines in manufacturing environments." },
  "delivery-driver":   { title: "Delivery Driver",   label: "Delivery Driver",   slug: "delivery-driver",   icon: "🚐", min: 14.50, max: 17.00, avg: 15.50, description: "Last-mile parcel and package delivery by van or small truck across the Netherlands." },
};

export function getJobBySlug(slug: string): JobSalaryData | undefined {
  return JOB_SALARY_DATA[slug];
}

// Parse a salary page slug into job + optional city
// Formats: "order-picker-netherlands" | "order-picker-rotterdam"
export function parseSalarySlug(slug: string): {
  jobSlug:   string;
  citySlug:  string | null;
  isNational: boolean;
} {
  if (slug.endsWith("-netherlands")) {
    return { jobSlug: slug.slice(0, -"-netherlands".length), citySlug: null, isNational: true };
  }
  // Try to match a known city at the end
  for (const city of CITIES) {
    if (slug.endsWith(`-${city.slug}`)) {
      return {
        jobSlug:   slug.slice(0, -(city.slug.length + 1)),
        citySlug:  city.slug,
        isNational: false,
      };
    }
  }
  // Fallback — treat whole thing as job slug
  return { jobSlug: slug, citySlug: null, isNational: true };
}

// Generate all salary page slugs for generateStaticParams
// Strategy:
//  • National pages for all 12 job types (12 pages)
//  • City pages for all 12 job types × all 143 cities = 1,716 pages
//  Total salary pages: 1,728
export function allSalarySlugs(): string[] {
  const jobs     = Object.keys(JOB_SALARY_DATA);
  const national = jobs.map((j) => `${j}-netherlands`);
  const byCities = jobs.flatMap((j) => CITIES.map((c) => `${j}-${c.slug}`));
  return [...national, ...byCities];
}

// Salary slugs for top cities only (used in UI snippets — not SSG)
export function topCitySalarySlugs(limit = 30): string[] {
  const jobs      = Object.keys(JOB_SALARY_DATA);
  const topSlugs  = CITIES_BY_POPULATION.slice(0, limit).map((c) => c.slug);
  return jobs.flatMap((j) => topSlugs.map((c) => `${j}-${c}`));
}

// ─── Issue Types ──────────────────────────────────────────────────────────────

export interface IssueTypeData {
  title:       string;
  slug:        string;
  prismaType:  string;
  icon:        string;
  description: string;
  guidance:    string;
  relatedLinks: { label: string; url: string }[];
}

export const ISSUE_TYPES: Record<string, IssueTypeData> = {
  "missing-overtime": {
    title:      "Missing Overtime Pay",
    slug:       "missing-overtime",
    prismaType: "MISSING_OVERTIME",
    icon:       "⏰",
    description: "Workers report overtime hours not being paid or calculated correctly. This is one of the most common complaints from flex workers in the Netherlands.",
    guidance:    "Check your contract for overtime rates. In the Netherlands, overtime is usually paid at 125–150% of your normal rate. Compare against your CAO collective agreement.",
    relatedLinks: [
      { label: "FNV flex worker support", url: "https://www.fnv.nl" },
      { label: "Dutch Labor Inspectorate", url: "https://www.nlarbeidsinspectie.nl" },
    ],
  },
  "bad-housing": {
    title:      "Bad Housing Conditions",
    slug:       "bad-housing",
    prismaType: "POOR_HOUSING",
    icon:       "🏚️",
    description: "Workers report inadequate, overcrowded, or poorly maintained housing provided by the agency. SNF certification is the standard for agency housing in the Netherlands.",
    guidance:    "Agency housing must meet SNF (Stichting Normering Flexwonen) standards. You can check if an agency is SNF-certified and file a complaint if conditions are unsafe.",
    relatedLinks: [
      { label: "SNF housing standards", url: "https://www.normeringflexwonen.nl" },
      { label: "FNV housing complaints", url: "https://www.fnv.nl" },
    ],
  },
  "late-payment": {
    title:      "Late Salary Payment",
    slug:       "late-payment",
    prismaType: "LATE_PAYMENT",
    icon:       "💸",
    description: "Agencies failing to pay salary on the agreed date — a very common complaint, especially among newer workers who may not know their rights.",
    guidance:    "In the Netherlands, your employer must pay on the agreed date (usually weekly or bi-weekly). After 3 days late you can formally demand payment and claim compensation.",
    relatedLinks: [
      { label: "Labor Inspectorate complaint form", url: "https://www.nlarbeidsinspectie.nl" },
    ],
  },
  "missing-sunday-pay": {
    title:      "Missing Sunday / Holiday Pay",
    slug:       "missing-sunday-pay",
    prismaType: "MISSING_SUNDAY_PAY",
    icon:       "📅",
    description: "Sunday and public holiday surcharges not being paid as required by many CAO collective agreements in logistics, food production, and cleaning sectors.",
    guidance:    "Check your CAO agreement. Sunday surcharges typically range from 25–50% extra. Public holidays may be paid at 100–200% depending on your sector CAO.",
    relatedLinks: [
      { label: "ABU CAO for flex workers", url: "https://www.abu.nl" },
      { label: "NBBU CAO", url: "https://www.nbbu.nl" },
    ],
  },
  "contract-issues": {
    title:      "Contract Issues",
    slug:       "contract-issues",
    prismaType: "CONTRACT_ISSUES",
    icon:       "📋",
    description: "Problems with contract terms, unclear conditions, or contracts not matching what was verbally agreed — particularly common in first-week placement situations.",
    guidance:    "Always request a written contract before starting. Compare it against the ABU or NBBU CAO. You are entitled to a written contract by Dutch law.",
    relatedLinks: [
      { label: "ABU standard contract info", url: "https://www.abu.nl" },
    ],
  },
  "underpayment": {
    title:      "Underpayment / Below Minimum Wage",
    slug:       "underpayment",
    prismaType: "UNDERPAYMENT",
    icon:       "💔",
    description: "Workers being paid below the agreed rate or below the Dutch statutory minimum wage (wettelijk minimumloon). This is illegal regardless of contract or nationality.",
    guidance:    "The Dutch minimum wage applies to all workers regardless of nationality. The 2026 WML is €14.71/hr for workers aged 21+. Report violations directly to the Labor Inspectorate.",
    relatedLinks: [
      { label: "File anonymous complaint (Inspectorate)", url: "https://www.nlarbeidsinspectie.nl" },
    ],
  },
};

export function getIssueBySlug(slug: string): IssueTypeData | undefined {
  return ISSUE_TYPES[slug];
}

export function allIssueSlugs(): string[] {
  return Object.keys(ISSUE_TYPES);
}
