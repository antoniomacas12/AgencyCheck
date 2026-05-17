// ─── Shared vacancies data ─────────────────────────────────────────────────────
// Single source of truth used by:
//   - /apply listing page (VacanciesClient)
//   - /apply/[slug] individual job pages (SEO + JobPosting schema)

export type Badge    = "acc" | "car" | "eng";
export type Category =
  | "technical"
  | "production"
  | "warehouse"
  | "driving"
  | "automotive"
  | "food"
  | "hospitality";

export interface Vacancy {
  slug: string;    // unique URL slug, e.g. "electrician-bodegraven"
  t:    string;    // title
  c:    Category;
  s:    string;    // salary display string (e.g. "€550–€650/wk")
  sm:   number;    // salary min for filtering (0 = not listed)
  sx:   number;    // salary max for schema (0 = not listed)
  l:    string;    // location
  b:    Badge[];   // badges
}

export const CAT_LABELS: Record<Category, string> = {
  technical:   "Technical & Construction",
  production:  "Production & Manufacturing",
  warehouse:   "Warehouse & Logistics",
  driving:     "Driving Jobs",
  automotive:  "Automotive",
  food:        "Food Production",
  hospitality: "Hospitality",
};

export const CAT_ICONS: Record<Category, string> = {
  technical:   "🔧",
  production:  "🏭",
  warehouse:   "📦",
  driving:     "🚛",
  automotive:  "🚗",
  food:        "🍖",
  hospitality: "🏨",
};

export const BADGE_META: Record<Badge, { label: string; color: string }> = {
  eng: { label: "Language req.",       color: "text-blue-300 bg-blue-400/10 border-blue-400/20" },
  car: { label: "Own car required",    color: "text-purple-300 bg-purple-400/10 border-purple-400/20" },
  acc: { label: "Accommodation incl.", color: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20" },
};

export const VACANCIES: Vacancy[] = [
  // ── Technical & Construction ──────────────────────────────────────────────
  { slug: "electrician-bodegraven",              t: "Electrician",                                        c: "technical",   s: "€550–€650/wk",   sm: 550,  sx: 650,  l: "Bodegraven",                        b: [] },
  { slug: "construction-welder-mig-mag",         t: "Construction Welder (MIG/MAG)",                      c: "technical",   s: "€650/wk",        sm: 650,  sx: 650,  l: "Rotterdam area",                    b: [] },
  { slug: "elevator-fitter-rotterdam",           t: "Elevator Fitter",                                    c: "technical",   s: "€700–€800/wk",   sm: 700,  sx: 800,  l: "Rotterdam area",                    b: [] },
  { slug: "pipe-fitter-workshop-prefab",         t: "Pipe Fitter (Workshop / Prefab)",                    c: "technical",   s: "€700/wk",        sm: 700,  sx: 700,  l: "Rotterdam area",                    b: [] },
  { slug: "copper-pipe-brazer-solderer",         t: "Copper Pipe Brazer / Solderer",                      c: "technical",   s: "€650/wk",        sm: 650,  sx: 650,  l: "Bunschoten Spakenburg",              b: [] },
  { slug: "tig-welder-ss-pipes-hl045",           t: "TIG Welder (SS Pipes, HL-045 Certified)",            c: "technical",   s: "€700/wk",        sm: 700,  sx: 700,  l: "Bunschoten Spakenburg",              b: [] },
  { slug: "ironworker-shipbuilding",             t: "Ironworker (Shipbuilding)",                          c: "technical",   s: "€560+/wk",       sm: 560,  sx: 0,    l: "Netherlands",                       b: [] },
  { slug: "mechanical-fitter-yacht-construction",t: "Mechanical Fitter (Yacht Construction)",             c: "technical",   s: "€600–€650/wk",   sm: 600,  sx: 650,  l: "Hellevoetsluis",                    b: [] },
  { slug: "technical-worker-safety-glass",       t: "Technical Production Worker – Safety Glass",         c: "technical",   s: "€600/wk",        sm: 600,  sx: 600,  l: "Heinoord",                          b: [] },
  { slug: "dock-worker-rotterdam",               t: "Dock Worker",                                        c: "technical",   s: "€590–€700/wk",   sm: 590,  sx: 700,  l: "Rotterdam area",                    b: [] },
  { slug: "prefab-concrete-worker",              t: "Production Prefab Concrete Worker",                  c: "technical",   s: "€600–€625/wk",   sm: 600,  sx: 625,  l: "Rotterdam area",                    b: [] },
  { slug: "tig-mag-welder-assembler-sevenum",    t: "TIG/MAG Welder / Assembler",                         c: "technical",   s: "€650/wk",        sm: 650,  sx: 650,  l: "Sevenum",                           b: [] },
  { slug: "train-electrician-mechanic",          t: "Train Electrician / Mechanic",                       c: "technical",   s: "€580/wk",        sm: 580,  sx: 580,  l: "Roosendaal",                        b: [] },
  { slug: "migmag-welder-black-steel-obdam",     t: "MIG/MAG Welder / Assembler (Black Steel)",           c: "technical",   s: "€640–€960/wk",   sm: 640,  sx: 960,  l: "Obdam",                             b: [] },
  { slug: "mag-welder-assembler-akersloot",      t: "MAG Welder / Assembler",                             c: "technical",   s: "€640/wk",        sm: 640,  sx: 640,  l: "Akersloot",                         b: [] },
  { slug: "junior-construction-plumber",         t: "Junior Construction Plumber",                        c: "technical",   s: "€535–€575/wk",   sm: 535,  sx: 575,  l: "Rotterdam area",                    b: [] },
  { slug: "plumber-amsterdam",                   t: "Plumber",                                            c: "technical",   s: "€560–€660/wk",   sm: 560,  sx: 660,  l: "Amsterdam",                         b: [] },
  { slug: "tiler-hardenberg",                    t: "Tiler",                                              c: "technical",   s: "€560–€660/wk",   sm: 560,  sx: 660,  l: "Hardenberg",                        b: [] },
  { slug: "prefab-wood-construction-worker",     t: "Prefab Wood Construction Worker",                    c: "technical",   s: "€490–€530/wk",   sm: 490,  sx: 530,  l: "Uden",                              b: [] },
  { slug: "pvc-window-fitter",                   t: "PVC Window Fitter",                                  c: "technical",   s: "€535/wk",        sm: 535,  sx: 535,  l: "Posterholt / Purmerend",             b: ["car"] },
  { slug: "aluminum-window-frame-assembler",     t: "Aluminum Window Frame Assembler",                    c: "technical",   s: "€510/wk",        sm: 510,  sx: 510,  l: "Beverwijk",                         b: [] },
  { slug: "pvc-window-assembler-moergestel",     t: "PVC Window Assembler (40h)",                         c: "technical",   s: "€510/wk",        sm: 510,  sx: 510,  l: "Moergestel",                        b: [] },
  { slug: "aluminum-window-fitters",             t: "Aluminum Window Fitters",                            c: "technical",   s: "€535–€560/wk",   sm: 535,  sx: 560,  l: "Netherlands",                       b: [] },
  { slug: "modular-houses-assembly-carpentry",   t: "Modular Houses Assembly (Carpentry)",                c: "technical",   s: "€520/wk",        sm: 520,  sx: 520,  l: "Hulst",                             b: ["car"] },
  { slug: "work-planner-petrochemical-antwerp",  t: "Work Planner / Project Coordinator (Petrochemical)", c: "technical",   s: "€830+/wk",       sm: 830,  sx: 0,    l: "Antwerp",                           b: ["eng"] },
  // ── Production & Manufacturing ────────────────────────────────────────────
  { slug: "car-frame-builder-assembly",          t: "Car Frame Builder / Assembly Worker",                c: "production",  s: "€550–€650/wk",   sm: 550,  sx: 650,  l: "Waardenburg",                       b: [] },
  { slug: "automotive-electrician",              t: "Automotive Electrician",                             c: "production",  s: "€550–€650/wk",   sm: 550,  sx: 650,  l: "Netherlands",                       b: [] },
  { slug: "welding-robot-operator",              t: "Welding Robot Operator",                             c: "production",  s: "€520–€650/wk",   sm: 520,  sx: 650,  l: "Netherlands",                       b: [] },
  { slug: "cnc-milling-operator-oirschot",       t: "CNC Milling Operator (2nd shift)",                   c: "production",  s: "€630/wk",        sm: 630,  sx: 630,  l: "Oirschot",                          b: ["car"] },
  { slug: "cnc-operator-programmer",             t: "CNC Operator / Programmer",                          c: "production",  s: "€500+/wk",       sm: 500,  sx: 0,    l: "Netherlands",                       b: [] },
  { slug: "tig-welder-production",               t: "TIG Welder",                                         c: "production",  s: "€500+/wk",       sm: 500,  sx: 0,    l: "Netherlands",                       b: [] },
  { slug: "migmag-welder-production",            t: "MIG/MAG Welder",                                     c: "production",  s: "€500+/wk",       sm: 500,  sx: 0,    l: "Netherlands",                       b: [] },
  { slug: "cnc-turner-mazak-mazatrol",           t: "CNC Turner (Mazak / Mazatrol)",                      c: "production",  s: "€580–€650/wk",   sm: 580,  sx: 650,  l: "Breskens",                          b: [] },
  { slug: "cnc-turners-millers-programmers",     t: "CNC Turners & Millers (Programmers)",                c: "production",  s: "€650/wk",        sm: 650,  sx: 650,  l: "Netherlands",                       b: [] },
  { slug: "workshop-carpenter",                  t: "Workshop Carpenter",                                 c: "production",  s: "€620/wk",        sm: 620,  sx: 620,  l: "Netherlands",                       b: ["car"] },
  { slug: "industrial-painter-oisterwijk",       t: "Industrial Painter",                                 c: "production",  s: "€500/wk",        sm: 500,  sx: 500,  l: "Oisterwijk",                        b: [] },
  { slug: "assembly-mechanic-oisterwijk",        t: "Assembly Mechanic",                                  c: "production",  s: "€450–€550/wk",   sm: 450,  sx: 550,  l: "Oisterwijk",                        b: [] },
  // ── Warehouse & Logistics ─────────────────────────────────────────────────
  { slug: "warehouse-worker-waalwijk",           t: "Warehouse Worker",                                   c: "warehouse",   s: "—",              sm: 0,    sx: 0,    l: "Waalwijk",                          b: [] },
  { slug: "warehouse-employee-ept-grubbenvorst", t: "Warehouse Employee (EPT, cold environment)",         c: "warehouse",   s: "—",              sm: 0,    sx: 0,    l: "Grubbenvorst",                      b: [] },
  { slug: "deepfreeze-warehouse-sligro",         t: "Deepfreeze Warehouse Worker (Sligro)",               c: "warehouse",   s: "—",              sm: 0,    sx: 0,    l: "Veghel",                            b: [] },
  { slug: "allround-warehouse-eindhoven",        t: "All-round Warehouse Employee",                       c: "warehouse",   s: "—",              sm: 0,    sx: 0,    l: "Helmond / Deurne / Eindhoven",      b: [] },
  // ── Driving Jobs ─────────────────────────────────────────────────────────
  { slug: "ce-truck-driver-hook-arm-eindhoven",  t: "CE Truck Driver (Hook arm)",                         c: "driving",     s: "€1000–€1200/wk", sm: 1000, sx: 1200, l: "Eindhoven",                         b: [] },
  { slug: "ce-truck-driver-car-transport-vianen",t: "CE Truck Driver – Car Transportation",               c: "driving",     s: "€800–€1000/wk",  sm: 800,  sx: 1000, l: "Vianen",                            b: [] },
  { slug: "ce-truck-driver-lidl",                t: "CE Truck Driver (Lidl, 40-55h)",                     c: "driving",     s: "€675–€875/wk",   sm: 675,  sx: 875,  l: "Netherlands",                       b: [] },
  { slug: "c-truck-driver-distribution",        t: "C cat. Truck Driver – Distribution & Logistics",     c: "driving",     s: "€700–€1000/wk",  sm: 700,  sx: 1000, l: "Netherlands",                       b: ["car"] },
  { slug: "ce-truck-driver-distribution",       t: "CE Truck Driver – Distribution & Logistics",         c: "driving",     s: "€700–€1000/wk",  sm: 700,  sx: 1000, l: "Netherlands",                       b: ["car"] },
  { slug: "damage-repairer-trailers-hoorn",      t: "Damage Repairer (Trailers)",                         c: "driving",     s: "€580+/wk",       sm: 580,  sx: 0,    l: "Hoorn",                             b: [] },
  { slug: "truck-mechanic-alblasserdam",         t: "Truck Mechanic",                                     c: "driving",     s: "€600–€700/wk",   sm: 600,  sx: 700,  l: "Alblasserdam",                      b: [] },
  { slug: "industrial-painter-trailers-venlo",   t: "Industrial Painter (Trailers & Trucks)",             c: "driving",     s: "€600/wk",        sm: 600,  sx: 600,  l: "Venlo",                             b: [] },
  { slug: "bus-driver-public-transport",         t: "Bus Driver (Public Transport)",                      c: "driving",     s: "€550–€620/wk",   sm: 550,  sx: 620,  l: "Netherlands",                       b: [] },
  { slug: "bus-driver-free-accommodation",       t: "Bus Driver – Free Accommodation",                    c: "driving",     s: "€600–€800/wk",   sm: 600,  sx: 800,  l: "Netherlands",                       b: ["acc"] },
  { slug: "tractor-driver-green-sector",         t: "Tractor Driver (Green Sector)",                      c: "driving",     s: "€450–€550/wk",   sm: 450,  sx: 550,  l: "Numansdorp",                        b: [] },
  // ── Automotive ───────────────────────────────────────────────────────────
  { slug: "migmag-welder-fitter-truck-trailers", t: "MIG/MAG Welder – Fitter (Truck Trailers)",           c: "automotive",  s: "€600–€750/wk",   sm: 600,  sx: 750,  l: "Netherlands",                       b: [] },
  { slug: "car-mechanic-senior",                 t: "Car Mechanic (min. 5 years exp.)",                   c: "automotive",  s: "€580–€640/wk",   sm: 580,  sx: 640,  l: "Netherlands",                       b: [] },
  { slug: "car-pre-processor-horst",             t: "Car Pre-Processor",                                  c: "automotive",  s: "€560–€600/wk",   sm: 560,  sx: 600,  l: "Horst",                             b: [] },
  { slug: "car-painter",                         t: "Car Painter",                                        c: "automotive",  s: "€600–€750/wk",   sm: 600,  sx: 750,  l: "Netherlands",                       b: [] },
  { slug: "car-mechanic",                        t: "Car Mechanic",                                       c: "automotive",  s: "€550+/wk",       sm: 550,  sx: 0,    l: "Netherlands",                       b: [] },
  // ── Food Production ───────────────────────────────────────────────────────
  { slug: "meat-factory-worker-haarlem",         t: "Meat Factory Production Worker & Cleaner",           c: "food",        s: "—",              sm: 0,    sx: 0,    l: "Haarlem",                           b: [] },
  { slug: "wooden-packaging-worker",             t: "Wooden Packaging Production Worker",                 c: "food",        s: "€400–€500/wk",   sm: 400,  sx: 500,  l: "Nieuw-Bergen",                      b: [] },
  { slug: "poultry-hanger-goor",                 t: "Poultry Hanger",                                     c: "food",        s: "€320–€370/wk",   sm: 320,  sx: 370,  l: "Goor",                              b: [] },
  // ── Hospitality ───────────────────────────────────────────────────────────
  { slug: "housekeeper-netherlands",             t: "Housekeeper (1-2 yrs exp.)",                         c: "hospitality", s: "—",              sm: 0,    sx: 0,    l: "Amsterdam / Utrecht / Tilburg",     b: [] },
  { slug: "cook-netherlands",                    t: "Cook (with experience)",                              c: "hospitality", s: "—",              sm: 0,    sx: 0,    l: "Netherlands",                       b: [] },
  { slug: "assistant-cook-greece",               t: "Assistant Cook",                                      c: "hospitality", s: "—",              sm: 0,    sx: 0,    l: "Rhodes, Crete, Kos",                b: ["acc"] },
  { slug: "dishwasher-greece",                   t: "Dishwasher",                                          c: "hospitality", s: "—",              sm: 0,    sx: 0,    l: "Rhodes, Crete, Kos",                b: ["acc"] },
  { slug: "experienced-cook-greece",             t: "Experienced Cook",                                    c: "hospitality", s: "—",              sm: 0,    sx: 0,    l: "Rhodes, Crete, Kos",                b: ["acc"] },
  { slug: "experienced-bartender-greece",        t: "Experienced Bartender",                               c: "hospitality", s: "—",              sm: 0,    sx: 0,    l: "Rhodes, Crete, Kos",                b: ["acc"] },
  { slug: "experienced-housekeeper-greece",      t: "Experienced Housekeeper",                             c: "hospitality", s: "€900/mo net",    sm: 900,  sx: 900,  l: "Rhodes, Crete, Kos",                b: ["acc"] },
  { slug: "experienced-waiter-greece",           t: "Experienced Waiter / Waitress",                       c: "hospitality", s: "—",              sm: 0,    sx: 0,    l: "Rhodes, Crete, Kos",                b: ["acc"] },
  { slug: "receptionist-german-english-greece",  t: "Receptionist (German & English req.)",                c: "hospitality", s: "—",              sm: 0,    sx: 0,    l: "Rhodes, Crete, Kos",                b: ["acc", "eng"] },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
export function getVacancyBySlug(slug: string): Vacancy | undefined {
  return VACANCIES.find((v) => v.slug === slug);
}

/** Derive addressCountry from location string */
export function getCountry(location: string): string {
  if (location.includes("Antwerp")) return "BE";
  if (location.includes("Rhodes") || location.includes("Crete") || location.includes("Kos")) return "GR";
  return "NL";
}

/** Build a one-sentence job description for meta tags */
export function buildDescription(v: Vacancy): string {
  const sal  = v.sm > 0 ? ` Salary: ${v.s}.` : "";
  const acc  = v.b.includes("acc") ? " Accommodation included." : "";
  const lang = v.b.includes("eng") ? " Language requirement applies." : "";
  return `${v.t} job in ${v.l}, ${getCountry(v.l) === "NL" ? "Netherlands" : getCountry(v.l) === "GR" ? "Greece" : "Belgium"}.${sal} EU citizens only, immediate start. Apply on WhatsApp.${acc}${lang}`;
}
