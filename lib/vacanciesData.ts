// ─── Shared vacancies data ─────────────────────────────────────────────────────
// Single source of truth used by:
//   - /apply listing page (VacanciesClient)
//   - /apply/[slug] individual job pages (SEO + JobPosting schema)

export type Badge    = "acc" | "acc_ask" | "car" | "eng" | "vog";
export type Category =
  | "technical"
  | "production"
  | "warehouse"
  | "driving"
  | "automotive"
  | "food"
  | "hospitality";

export interface Vacancy {
  slug:      string;    // unique URL slug, e.g. "electrician-bodegraven"
  t:         string;    // title
  c:         Category;
  s:         string;    // salary display string (e.g. "€550–€650/wk")
  sm:        number;    // salary min for filtering (0 = not listed)
  sx:        number;    // salary max for schema (0 = not listed)
  l:         string;    // location
  b:         Badge[];   // badges
  featured?: boolean;   // true = shown in "Direct Offer" section at top
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
  eng:     { label: "Language req.",       color: "text-blue-300 bg-blue-400/10 border-blue-400/20" },
  car:     { label: "Own car required",    color: "text-purple-300 bg-purple-400/10 border-purple-400/20" },
  acc:     { label: "Accommodation incl.", color: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20" },
  acc_ask: { label: "Housing available",   color: "text-sky-300 bg-sky-400/10 border-sky-400/20" },
  vog:     { label: "Clean record (VOG)",  color: "text-amber-300 bg-amber-400/10 border-amber-400/20" },
};

// ─── Category job descriptions ─────────────────────────────────────────────────
// Rendered on individual /apply/[slug] pages to give Google unique, meaningful
// content per category. Without this, all job pages are near-identical templates
// which Google treats as thin content and refuses to index.
export const CAT_JOB_DESCRIPTIONS: Record<Category, { intro: string; duties: string[]; extra: string }> = {
  technical: {
    intro: "This is a hands-on technical or construction role based in the Netherlands, placed through a certified Dutch employment agency. You will work on real projects alongside experienced local teams with full legal employment from day one.",
    duties: [
      "Carry out your trade work according to Dutch industry standards (NEN/VCA)",
      "Read and follow technical drawings, work orders, and safety instructions in English",
      "Collaborate with on-site supervisors and report progress daily",
      "Maintain tools, PPE, and worksite in line with Dutch safety regulations",
    ],
    extra: "No Dutch language required — English is the working language on international crews. VCA Basic certificate is a plus but not always mandatory; training can be arranged.",
  },
  production: {
    intro: "This production or manufacturing role is based at an industrial facility in the Netherlands. You will work within a structured shift environment, contributing to the output of a Dutch or multinational manufacturer, with a legal employment contract from the start.",
    duties: [
      "Operate machinery or production lines according to daily targets and quality standards",
      "Perform quality checks and report deviations to the shift supervisor",
      "Follow strict hygiene, safety, and PPE protocols at all times",
      "Participate in handover briefings at the start and end of each shift",
    ],
    extra: "Most production roles require no prior Dutch language skills — instructions are given in English or with visual aids. 2-shift or 3-shift patterns are common; flexibility is expected.",
  },
  warehouse: {
    intro: "This warehouse or logistics role is based at a distribution centre or fulfilment hub in the Netherlands. You will work in a fast-paced environment where accuracy and physical fitness are important. All positions come with a legal Dutch employment contract.",
    duties: [
      "Pick, pack, scan, and sort goods according to daily order lists",
      "Operate warehouse equipment such as EPT, reach truck, or hand scanner",
      "Maintain correct stock locations and report discrepancies to the team leader",
      "Meet daily productivity targets while following safety and hygiene rules",
    ],
    extra: "A valid Dutch EPT or reach-truck certificate is required for driving roles; other positions require no certification. Clean criminal record (VOG) may be requested depending on the client.",
  },
  driving: {
    intro: "This driving role is based in the Netherlands or Belgium and requires a valid Dutch or EU driving licence for the applicable category (C, CE, or D). You will be employed via a registered transport agency with a full legal Dutch employment contract.",
    duties: [
      "Carry out distribution, transport, or logistics runs according to the daily planning",
      "Perform pre-trip vehicle checks and report defects before departure",
      "Adhere to EU driving-time regulations (tacho) and Dutch traffic law",
      "Communicate delivery statuses and issues to dispatch in real time",
    ],
    extra: "For CE and C category roles, a valid Dutch or EU licence with the appropriate code is mandatory. Experience with Dutch roads and navigation apps is a strong advantage. Accommodation is sometimes available for long-haul roles.",
  },
  automotive: {
    intro: "This automotive role is based at a car repair workshop, bodyshop, or fleet maintenance facility in the Netherlands. You will work with professional equipment on passenger and commercial vehicles, employed via a certified Dutch agency.",
    duties: [
      "Diagnose, repair, and service vehicles according to manufacturer standards",
      "Use diagnostic software and workshop equipment for fault-finding",
      "Complete service reports accurately and on time",
      "Maintain a clean, organised workstation in line with workshop safety standards",
    ],
    extra: "A relevant automotive or body-repair qualification is expected. Experience with Dutch or European vehicle brands is an advantage. No Dutch language required — technical communication in English is standard.",
  },
  food: {
    intro: "This food production or agricultural role is based in the Netherlands or Belgium. You will work in a food-safe environment — processing plant, slaughterhouse, fish facility, or farm — with full legal employment and compliance with Dutch food safety standards.",
    duties: [
      "Process, pack, or handle food products according to HACCP and hygiene guidelines",
      "Wear full PPE including waterproof clothing, gloves, and safety boots at all times",
      "Meet line-speed and accuracy targets set by the shift supervisor",
      "Report any contamination risks, equipment faults, or safety hazards immediately",
    ],
    extra: "Physical resilience in cold or wet environments is essential for most food roles. No prior Dutch language is needed. Some roles require a clean criminal record (VOG) due to food safety compliance requirements.",
  },
  hospitality: {
    intro: "This hospitality role is based in the Netherlands or on a Greek island (Rhodes, Crete, or Kos). You will work in a hotel, resort, or catering environment with a legal employment contract. For Greek island roles, accommodation is included in the package.",
    duties: [
      "Deliver professional service to international guests in a busy hospitality setting",
      "Follow house standards for hygiene, presentation, and guest interaction",
      "Communicate clearly with colleagues and supervisors in English",
      "Handle shift duties as assigned — service, prep, housekeeping, or kitchen support",
    ],
    extra: "For island roles in Greece, accommodation and meals are typically included. For Dutch roles, experience in a similar position is expected. English is the primary working language; knowledge of other languages is a bonus.",
  },
};

export const VACANCIES: Vacancy[] = [
  // ── Johma Partnership — 4minutes, Losser NL ───────────────────────────────
  {
    slug:     "johma-logistics-operator",
    t:        "Logistics Operator — Johma",
    c:        "warehouse",
    s:        "€17.04/h gross",
    sm:       682,
    sx:       0,
    l:        "Losser, NL",
    b:        ["acc"],
    featured: true,
  },
  {
    slug:     "johma-line-operator",
    t:        "Line Operator — Johma",
    c:        "production",
    s:        "€16.01/h gross",
    sm:       640,
    sx:       0,
    l:        "Losser, NL",
    b:        ["acc"],
    featured: true,
  },
  {
    slug:     "johma-food-mixing-operator",
    t:        "Food Mixing Operator — Johma",
    c:        "food",
    s:        "€16.01/h gross",
    sm:       640,
    sx:       0,
    l:        "Losser, NL",
    b:        ["acc"],
    featured: true,
  },
  {
    slug:     "johma-operator-kitchen",
    t:        "Operator Kitchen — Johma",
    c:        "food",
    s:        "€16.01/h gross",
    sm:       640,
    sx:       0,
    l:        "Losser, NL",
    b:        ["acc"],
    featured: true,
  },

  // ── DeliBarn Partnership — 4minutes, Borculo NL ───────────────────────────
  {
    slug:     "delibarn-operator",
    t:        "Operator (Day Shift) — DeliBarn",
    c:        "food",
    s:        "€16.01/h gross",
    sm:       640,
    sx:       0,
    l:        "Borculo, NL",
    b:        ["acc_ask", "eng"],
    featured: true,
  },

  // ── Direct Offers — sent directly by recruiter ────────────────────────────
  {
    slug:     "pharmacy-warehouse-worker-sevenum",
    t:        "Pharmacy Warehouse Worker",
    c:        "warehouse",
    s:        "€14.75/h gross",
    sm:       590,
    sx:       0,
    l:        "Sevenum",
    b:        ["vog"],
    featured: true,
  },

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
  { slug: "plumber-netherlands",                 t: "Plumber",                                            c: "technical",   s: "€620–€650/wk",   sm: 620,  sx: 650,  l: "Netherlands",                       b: [] },
  { slug: "tiler-hardenberg",                    t: "Tiler",                                              c: "technical",   s: "€560–€660/wk",   sm: 560,  sx: 660,  l: "Hardenberg",                        b: [] },
  { slug: "prefab-wood-construction-worker",     t: "Prefab Wood Construction Worker",                    c: "technical",   s: "€490–€530/wk",   sm: 490,  sx: 530,  l: "Uden",                              b: [] },
  { slug: "pvc-window-fitter",                   t: "PVC Window Fitter",                                  c: "technical",   s: "€535/wk",        sm: 535,  sx: 535,  l: "Posterholt / Purmerend",             b: ["car"] },
  { slug: "aluminum-window-frame-assembler",     t: "Aluminum Window Frame Assembler",                    c: "technical",   s: "€510/wk",        sm: 510,  sx: 510,  l: "Beverwijk",                         b: [] },
  { slug: "pvc-window-assembler-moergestel",     t: "PVC Window Assembler (40h)",                         c: "technical",   s: "€510/wk",        sm: 510,  sx: 510,  l: "Moergestel",                        b: [] },
  { slug: "aluminum-window-fitters",             t: "Aluminum Window Fitters",                            c: "technical",   s: "€535–€560/wk",   sm: 535,  sx: 560,  l: "Netherlands",                       b: [] },
  { slug: "modular-houses-assembly-carpentry",   t: "Modular Houses Assembly (Carpentry)",                c: "technical",   s: "€520/wk",        sm: 520,  sx: 520,  l: "Hulst",                             b: ["car"] },
  { slug: "work-planner-petrochemical-antwerp",  t: "Work Planner / Project Coordinator (Petrochemical)", c: "technical",   s: "€830+/wk",       sm: 830,  sx: 0,    l: "Antwerp",                           b: ["eng"] },
  // ── Production & Manufacturing ────────────────────────────────────────────
  { slug: "car-frame-builder-assembly",          t: "Car Frame Builder / Assembly Worker",                c: "production",  s: "€550–€650/wk",   sm: 550,  sx: 650,  l: "Waardenburg",                       b: ["acc_ask"] },
  { slug: "automotive-electrician",              t: "Automotive Electrician",                             c: "production",  s: "€550–€650/wk",   sm: 550,  sx: 650,  l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "welding-robot-operator",              t: "Welding Robot Operator",                             c: "production",  s: "€520–€650/wk",   sm: 520,  sx: 650,  l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "cnc-milling-operator-oirschot",       t: "CNC Milling Operator (2nd shift)",                   c: "production",  s: "€630/wk",        sm: 630,  sx: 630,  l: "Oirschot",                          b: ["car", "acc_ask"] },
  { slug: "cnc-operator-programmer",             t: "CNC Operator / Programmer",                          c: "production",  s: "€500+/wk",       sm: 500,  sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "tig-welder-production",               t: "TIG Welder",                                         c: "production",  s: "€500+/wk",       sm: 500,  sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "migmag-welder-production",            t: "MIG/MAG Welder",                                     c: "production",  s: "€500+/wk",       sm: 500,  sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "cnc-turner-mazak-mazatrol",           t: "CNC Turner (Mazak / Mazatrol)",                      c: "production",  s: "€580–€650/wk",   sm: 580,  sx: 650,  l: "Breskens",                          b: ["acc_ask"] },
  { slug: "cnc-turners-millers-programmers",     t: "CNC Turners & Millers (Programmers)",                c: "production",  s: "€650/wk",        sm: 650,  sx: 650,  l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "workshop-carpenter",                  t: "Workshop Carpenter",                                 c: "production",  s: "€620/wk",        sm: 620,  sx: 620,  l: "Netherlands",                       b: ["car", "acc_ask"] },
  { slug: "industrial-painter-oisterwijk",       t: "Industrial Painter",                                 c: "production",  s: "€500/wk",        sm: 500,  sx: 500,  l: "Oisterwijk",                        b: ["acc_ask"] },
  { slug: "assembly-mechanic-oisterwijk",        t: "Assembly Mechanic",                                  c: "production",  s: "€450–€550/wk",   sm: 450,  sx: 550,  l: "Oisterwijk",                        b: ["acc_ask"] },
  { slug: "assembly-worker-son",                 t: "Assembly Worker (with experience)",                  c: "production",  s: "€16.83/h gross", sm: 673,  sx: 0,    l: "Son",                               b: ["acc_ask"] },
  { slug: "production-packing-worker-nieuwegein",t: "Production & Packing Worker",                        c: "production",  s: "€16.43/h gross", sm: 657,  sx: 0,    l: "Nieuwegein",                        b: ["acc_ask"] },
  { slug: "nutrition-bar-packaging-worker",      t: "Nutrition Bar Packaging Worker",                     c: "production",  s: "—",              sm: 0,    sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "metalworker-production-netherlands",  t: "Metalworker (Production Employee)",                  c: "production",  s: "—",              sm: 0,    sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "flexible-production-employee",        t: "Flexible Production Employee",                       c: "production",  s: "—",              sm: 0,    sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  // ── Warehouse & Logistics ─────────────────────────────────────────────────
  { slug: "warehouse-worker-waalwijk",                    t: "Warehouse Worker",                                          c: "warehouse",   s: "—",              sm: 0,    sx: 0,    l: "Waalwijk",                          b: ["acc_ask"] },
  { slug: "warehouse-employee-ept-grubbenvorst",          t: "Warehouse Employee (EPT, cold environment)",                c: "warehouse",   s: "—",              sm: 0,    sx: 0,    l: "Grubbenvorst",                      b: ["acc_ask"] },
  { slug: "deepfreeze-warehouse-sligro",                  t: "Deepfreeze Warehouse Worker (Sligro)",                      c: "warehouse",   s: "—",              sm: 0,    sx: 0,    l: "Veghel",                            b: ["acc_ask"] },
  { slug: "allround-warehouse-eindhoven",                 t: "All-round Warehouse Employee (Live interview needed)",      c: "warehouse",   s: "€14.71/h gross", sm: 588,  sx: 0,    l: "Helmond / Deurne / Eindhoven",      b: ["acc_ask"] },
  { slug: "flexible-warehouse-worker-netherlands",        t: "Flexible Warehouse Worker (with experience)",               c: "warehouse",   s: "—",              sm: 0,    sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  // ── Warehouse & Logistics — poster import 19/05/2026 ─────────────────────
  { slug: "order-picker-ept-driver-food-freezer-waalwijk",t: "Order Picker / EPT Driver (food freezer)",                  c: "warehouse",   s: "€14.98/h gross", sm: 599,  sx: 0,    l: "Waalwijk",                          b: ["acc_ask"] },
  { slug: "warehouse-worker-amsterdam-tilburg-den-bosch", t: "Warehouse Worker",                                          c: "warehouse",   s: "€14.71/h gross", sm: 588,  sx: 0,    l: "Amsterdam, Tilburg, Den Bosch",     b: ["acc_ask"] },
  { slug: "order-picker-ept-driver-experience-alkmaar",   t: "Order Picker / EPT Driver (with experience)",               c: "warehouse",   s: "€14.71/h gross", sm: 588,  sx: 0,    l: "Alkmaar",                           b: ["acc_ask"] },
  { slug: "order-picker-ept-experience-fresh-netherlands",t: "Order Picker with EPT Experience (Fresh department)",       c: "warehouse",   s: "€14.98/h gross", sm: 599,  sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "order-picker-ept-experience-apeldoorn",        t: "Order Picker (with EPT experience)",                        c: "warehouse",   s: "€16.47/h gross", sm: 658,  sx: 0,    l: "Apeldoorn",                         b: ["acc_ask"] },
  { slug: "warehouse-worker-experience-waddinxveen",      t: "Warehouse Worker with Experience",                          c: "warehouse",   s: "€16.47/h gross", sm: 658,  sx: 0,    l: "Waddinxveen",                       b: ["acc_ask"] },
  { slug: "warehouse-worker-experience-oirschot",         t: "Warehouse Worker (with experience & clean criminal record)",c: "warehouse",   s: "€14.76/h gross", sm: 590,  sx: 0,    l: "Oirschot",                          b: ["acc_ask"] },
  { slug: "warehouse-worker-zaandam",                     t: "Warehouse Worker",                                          c: "warehouse",   s: "€14.94/h gross", sm: 597,  sx: 0,    l: "Zaandam",                           b: ["acc_ask"] },
  { slug: "warehouse-worker-loader-night-shift",          t: "Warehouse Worker / Loader (night shift)",                   c: "warehouse",   s: "€14.71/h gross", sm: 588,  sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "warehouse-worker-experience-veenendaal",       t: "Warehouse Worker (with experience & clean criminal record)",c: "warehouse",   s: "€14.76/h gross", sm: 590,  sx: 0,    l: "Veenendaal",                        b: ["acc_ask"] },
  { slug: "warehouse-worker-clean-record-venlo",          t: "Warehouse Worker (clean criminal record)",                  c: "warehouse",   s: "€14.77/h gross", sm: 590,  sx: 0,    l: "Venlo",                             b: ["acc_ask"] },
  { slug: "loader-unloader-experience-netherlands",       t: "Loader / Unloader with Experience (clean criminal record)", c: "warehouse",   s: "€14.71/h gross", sm: 588,  sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "container-loader-netherlands",                 t: "Container Loader",                                          c: "warehouse",   s: "€15.27/h gross", sm: 610,  sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "warehouse-worker-fresh-department",            t: "Warehouse Worker (Fresh department)",                       c: "warehouse",   s: "€14.98/h gross", sm: 599,  sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "expedition-employee-night-shift",              t: "Expedition Employee (orders & loading, night shift)",       c: "warehouse",   s: "€14.98/h gross", sm: 599,  sx: 0,    l: "Netherlands",                       b: ["acc_ask"] },
  { slug: "order-picker-cold-ridderkerk",               t: "Order Picker with Experience (cooled, approx. 5–7°C)",      c: "warehouse",   s: "€14.71/h gross", sm: 588,  sx: 0,    l: "Ridderkerk",                        b: ["acc_ask"] },
  { slug: "ept-driver-logistics-venray",                t: "EPT Driver / General Logistics Worker",                     c: "warehouse",   s: "€14.71/h gross", sm: 588,  sx: 0,    l: "Venray",                            b: ["acc_ask"] },
  { slug: "forklift-driver-ijmuiden",                      t: "Forklift Driver (with valid certificate)",                  c: "warehouse",   s: "€16.05/h gross", sm: 642,  sx: 0,    l: "IJmuiden",                          b: ["acc_ask"] },
  { slug: "forklift-driver-loader-tiel",                   t: "Forklift Driver / Loader / Wrapper",                        c: "warehouse",   s: "€15.29/h gross", sm: 611,  sx: 0,    l: "Tiel",                              b: ["acc_ask"] },
  { slug: "stable-cleaner-kootwijkerbroek",                t: "Stable Cleaner (with farm experience)",                     c: "food",        s: "€16.25/h gross", sm: 650,  sx: 0,    l: "Kootwijkerbroek",                   b: ["acc_ask"] },
  { slug: "reach-truck-driver-certificate-amsterdam",     t: "Reach Truck Driver with Certificate",                       c: "driving",     s: "€15.35/h gross", sm: 614,  sx: 0,    l: "Amsterdam",                         b: [] },
  { slug: "order-picker-clean-record-amsterdam",          t: "Order Picker (clean criminal record)",                      c: "warehouse",   s: "€14.71/h gross", sm: 588,  sx: 0,    l: "Amsterdam",                         b: ["acc_ask"] },
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
  { slug: "meat-factory-worker-haarlem",         t: "Meat Factory Production Worker & Cleaner",           c: "food",        s: "€14.71/h gross", sm: 588,  sx: 0,    l: "Haarlem",                           b: ["acc_ask"] },
  { slug: "wooden-packaging-worker",             t: "Wooden Packaging Production Worker",                 c: "food",        s: "€400–€500/wk",   sm: 400,  sx: 500,  l: "Nieuw-Bergen",                      b: ["acc_ask"] },
  { slug: "poultry-hanger-goor",                 t: "Poultry Hanger",                                     c: "food",        s: "€320–€370/wk",   sm: 320,  sx: 370,  l: "Goor",                              b: ["acc_ask"] },
  { slug: "poultry-hanger-belgium",              t: "Poultry Hanger (with experience)",                   c: "food",        s: "—",              sm: 0,    sx: 0,    l: "Belgium",                           b: ["acc_ask"] },
  { slug: "cookie-factory-workers-harderwijk",   t: "Cookie Factory Worker",                              c: "food",        s: "€16.47/h gross", sm: 658,  sx: 0,    l: "Harderwijk",                        b: ["acc_ask"] },
  { slug: "production-employee-seafood-tholen",  t: "Production Employee (Seafood)",                      c: "food",        s: "€15.00/h gross", sm: 600,  sx: 0,    l: "Tholen",                            b: ["acc_ask"] },
  { slug: "seafood-filleting-yerseke",           t: "Seafood Filleting Employee (filleting knife exp.)",   c: "food",        s: "€15.50/h gross", sm: 620,  sx: 0,    l: "Yerseke",                           b: ["acc_ask"] },
  // ── Hospitality ───────────────────────────────────────────────────────────
  { slug: "housekeeper-netherlands",             t: "Housekeeper (1–2 yrs exp.)",                         c: "hospitality", s: "€17.65/h gross", sm: 706,  sx: 0,    l: "Amsterdam / Utrecht / Coast / Tilburg", b: [] },
  { slug: "cook-netherlands",                    t: "Cook (with experience)",                              c: "hospitality", s: "—",              sm: 0,    sx: 0,    l: "Netherlands",                       b: [] },
  { slug: "assistant-cook-greece",               t: "Assistant Cook",                                      c: "hospitality", s: "—",              sm: 0,    sx: 0,    l: "Rhodes, Crete, Kos",                b: ["acc"] },
  { slug: "dishwasher-greece",                   t: "Dishwasher (No Experience Needed)",                   c: "hospitality", s: "€900/mo net",    sm: 900,  sx: 900,  l: "Rhodes, Crete, Kos",                b: ["acc"] },
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
  if (location.includes("Antwerp") || location.includes("Belgium")) return "BE";
  if (location.includes("Rhodes") || location.includes("Crete") || location.includes("Kos")) return "GR";
  return "NL";
}

/** Build a one-sentence job description for meta tags */
export function buildDescription(v: Vacancy): string {
  const sal  = v.sm > 0 ? ` Salary: ${v.s}.` : "";
  const acc  = v.b.includes("acc") ? " Accommodation included." : v.b.includes("acc_ask") ? " Housing may be available — ask when applying." : "";
  const lang = v.b.includes("eng") ? " Language requirement applies." : "";
  return `${v.t} job in ${v.l}, ${getCountry(v.l) === "NL" ? "Netherlands" : getCountry(v.l) === "GR" ? "Greece" : "Belgium"}.${sal} EU citizens only, immediate start. Apply on WhatsApp.${acc}${lang}`;
}

// ─── Structured data address helpers ──────────────────────────────────────────
// Used by /apply/[slug]/page.tsx to fill Google JobPosting schema address fields.
// streetAddress = best-effort city-level reference (no street data available).
// postalCode    = representative postcode for geocoding (4-digit NL, 5-digit GR).
// addressRegion = Dutch province, Belgian province, or Greek region.

export interface AddressMeta {
  streetAddress:   string;
  addressLocality: string;
  addressRegion:   string;
  postalCode:      string;
}

const CITY_META: Record<string, AddressMeta> = {
  // ── Netherlands ──────────────────────────────────────────────────────────────
  "Bodegraven":            { streetAddress: "Bodegraven",            addressLocality: "Bodegraven",            addressRegion: "Zuid-Holland",  postalCode: "2411" },
  "Rotterdam":             { streetAddress: "Rotterdam",              addressLocality: "Rotterdam",              addressRegion: "Zuid-Holland",  postalCode: "3011" },
  "Bunschoten Spakenburg": { streetAddress: "Bunschoten Spakenburg",  addressLocality: "Bunschoten Spakenburg",  addressRegion: "Utrecht",        postalCode: "3752" },
  "Bunschoten":            { streetAddress: "Bunschoten",             addressLocality: "Bunschoten",             addressRegion: "Utrecht",        postalCode: "3751" },
  "Hellevoetsluis":        { streetAddress: "Hellevoetsluis",         addressLocality: "Hellevoetsluis",         addressRegion: "Zuid-Holland",  postalCode: "3221" },
  "Heinoord":              { streetAddress: "Heinoord",               addressLocality: "Heinoord",               addressRegion: "Zuid-Holland",  postalCode: "3274" },
  "Sevenum":               { streetAddress: "Sevenum",                addressLocality: "Sevenum",                addressRegion: "Limburg",        postalCode: "5975" },
  "Roosendaal":            { streetAddress: "Roosendaal",             addressLocality: "Roosendaal",             addressRegion: "Noord-Brabant", postalCode: "4701" },
  "Obdam":                 { streetAddress: "Obdam",                  addressLocality: "Obdam",                  addressRegion: "Noord-Holland", postalCode: "1695" },
  "Akersloot":             { streetAddress: "Akersloot",              addressLocality: "Akersloot",              addressRegion: "Noord-Holland", postalCode: "1921" },
  "Amsterdam":             { streetAddress: "Amsterdam",              addressLocality: "Amsterdam",              addressRegion: "Noord-Holland", postalCode: "1011" },
  "Hardenberg":            { streetAddress: "Hardenberg",             addressLocality: "Hardenberg",             addressRegion: "Overijssel",     postalCode: "7771" },
  "Uden":                  { streetAddress: "Uden",                   addressLocality: "Uden",                   addressRegion: "Noord-Brabant", postalCode: "5401" },
  "Posterholt":            { streetAddress: "Posterholt",             addressLocality: "Posterholt",             addressRegion: "Limburg",        postalCode: "6061" },
  "Purmerend":             { streetAddress: "Purmerend",              addressLocality: "Purmerend",              addressRegion: "Noord-Holland", postalCode: "1441" },
  "Beverwijk":             { streetAddress: "Beverwijk",              addressLocality: "Beverwijk",              addressRegion: "Noord-Holland", postalCode: "1941" },
  "Moergestel":            { streetAddress: "Moergestel",             addressLocality: "Moergestel",             addressRegion: "Noord-Brabant", postalCode: "5066" },
  "Hulst":                 { streetAddress: "Hulst",                  addressLocality: "Hulst",                  addressRegion: "Zeeland",        postalCode: "4561" },
  "Waardenburg":           { streetAddress: "Waardenburg",            addressLocality: "Waardenburg",            addressRegion: "Gelderland",     postalCode: "4181" },
  "Oirschot":              { streetAddress: "Oirschot",               addressLocality: "Oirschot",               addressRegion: "Noord-Brabant", postalCode: "5688" },
  "Oisterwijk":            { streetAddress: "Oisterwijk",             addressLocality: "Oisterwijk",             addressRegion: "Noord-Brabant", postalCode: "5061" },
  "Son":                   { streetAddress: "Son en Breugel",         addressLocality: "Son en Breugel",         addressRegion: "Noord-Brabant", postalCode: "5691" },
  "Nieuwegein":            { streetAddress: "Nieuwegein",             addressLocality: "Nieuwegein",             addressRegion: "Utrecht",        postalCode: "3431" },
  "Waalwijk":              { streetAddress: "Waalwijk",               addressLocality: "Waalwijk",               addressRegion: "Noord-Brabant", postalCode: "5141" },
  "Grubbenvorst":          { streetAddress: "Grubbenvorst",           addressLocality: "Grubbenvorst",           addressRegion: "Limburg",        postalCode: "5971" },
  "Veghel":                { streetAddress: "Veghel",                 addressLocality: "Veghel",                 addressRegion: "Noord-Brabant", postalCode: "5461" },
  "Helmond":               { streetAddress: "Helmond",                addressLocality: "Helmond",                addressRegion: "Noord-Brabant", postalCode: "5701" },
  "Deurne":                { streetAddress: "Deurne",                 addressLocality: "Deurne",                 addressRegion: "Noord-Brabant", postalCode: "5751" },
  "Eindhoven":             { streetAddress: "Eindhoven",              addressLocality: "Eindhoven",              addressRegion: "Noord-Brabant", postalCode: "5611" },
  "Apeldoorn":             { streetAddress: "Apeldoorn",              addressLocality: "Apeldoorn",              addressRegion: "Gelderland",     postalCode: "7311" },
  "Waddinxveen":           { streetAddress: "Waddinxveen",            addressLocality: "Waddinxveen",            addressRegion: "Zuid-Holland",  postalCode: "2741" },
  "Veenendaal":            { streetAddress: "Veenendaal",             addressLocality: "Veenendaal",             addressRegion: "Utrecht",        postalCode: "3901" },
  "Venlo":                 { streetAddress: "Venlo",                  addressLocality: "Venlo",                  addressRegion: "Limburg",        postalCode: "5911" },
  "Alkmaar":               { streetAddress: "Alkmaar",                addressLocality: "Alkmaar",                addressRegion: "Noord-Holland", postalCode: "1811" },
  "Zaandam":               { streetAddress: "Zaandam",                addressLocality: "Zaandam",                addressRegion: "Noord-Holland", postalCode: "1501" },
  "Vianen":                { streetAddress: "Vianen",                 addressLocality: "Vianen",                 addressRegion: "Utrecht",        postalCode: "4131" },
  "Hoorn":                 { streetAddress: "Hoorn",                  addressLocality: "Hoorn",                  addressRegion: "Noord-Holland", postalCode: "1621" },
  "Alblasserdam":          { streetAddress: "Alblasserdam",           addressLocality: "Alblasserdam",           addressRegion: "Zuid-Holland",  postalCode: "2951" },
  "Numansdorp":            { streetAddress: "Numansdorp",             addressLocality: "Numansdorp",             addressRegion: "Zuid-Holland",  postalCode: "3281" },
  "Horst":                 { streetAddress: "Horst",                  addressLocality: "Horst",                  addressRegion: "Limburg",        postalCode: "5961" },
  "Haarlem":               { streetAddress: "Haarlem",                addressLocality: "Haarlem",                addressRegion: "Noord-Holland", postalCode: "2011" },
  "Nieuw-Bergen":          { streetAddress: "Nieuw-Bergen",           addressLocality: "Nieuw-Bergen",           addressRegion: "Limburg",        postalCode: "5854" },
  "Goor":                  { streetAddress: "Goor",                   addressLocality: "Goor",                   addressRegion: "Overijssel",     postalCode: "7471" },
  "Harderwijk":            { streetAddress: "Harderwijk",             addressLocality: "Harderwijk",             addressRegion: "Gelderland",     postalCode: "3841" },
  "Tholen":                { streetAddress: "Tholen",                 addressLocality: "Tholen",                 addressRegion: "Zeeland",        postalCode: "4691" },
  "Yerseke":               { streetAddress: "Yerseke",                addressLocality: "Yerseke",                addressRegion: "Zeeland",        postalCode: "4401" },
  "Breskens":              { streetAddress: "Breskens",               addressLocality: "Breskens",               addressRegion: "Zeeland",        postalCode: "4511" },
  "Ridderkerk":            { streetAddress: "Ridderkerk",             addressLocality: "Ridderkerk",             addressRegion: "Zuid-Holland",  postalCode: "2981" },
  "Venray":                { streetAddress: "Venray",                 addressLocality: "Venray",                 addressRegion: "Limburg",        postalCode: "5801" },
  "Tilburg":               { streetAddress: "Tilburg",                addressLocality: "Tilburg",                addressRegion: "Noord-Brabant", postalCode: "5011" },
  "Utrecht":               { streetAddress: "Utrecht",                addressLocality: "Utrecht",                addressRegion: "Utrecht",        postalCode: "3511" },
  "Den Bosch":             { streetAddress: "Den Bosch",              addressLocality: "'s-Hertogenbosch",       addressRegion: "Noord-Brabant", postalCode: "5211" },
  // ── Belgium ───────────────────────────────────────────────────────────────────
  "Antwerp":               { streetAddress: "Antwerp",                addressLocality: "Antwerp",                addressRegion: "Antwerpen",      postalCode: "2000" },
  "Belgium":               { streetAddress: "Brussels",               addressLocality: "Brussels",               addressRegion: "Brussels",       postalCode: "1000" },
  // ── Greece ────────────────────────────────────────────────────────────────────
  "Rhodes":                { streetAddress: "Rhodes Town",            addressLocality: "Rhodes",                 addressRegion: "South Aegean",   postalCode: "85100" },
  "Crete":                 { streetAddress: "Heraklion",              addressLocality: "Heraklion",              addressRegion: "Crete",          postalCode: "71201" },
  "Kos":                   { streetAddress: "Kos Town",               addressLocality: "Kos",                    addressRegion: "South Aegean",   postalCode: "85300" },
  "IJmuiden":              { streetAddress: "IJmuiden",               addressLocality: "IJmuiden",               addressRegion: "Noord-Holland", postalCode: "1971" },
  "Tiel":                  { streetAddress: "Tiel",                   addressLocality: "Tiel",                   addressRegion: "Gelderland",     postalCode: "4001" },
  "Kootwijkerbroek":       { streetAddress: "Kootwijkerbroek",        addressLocality: "Kootwijkerbroek",        addressRegion: "Gelderland",     postalCode: "3774" },
  "Losser":                { streetAddress: "Losser",                 addressLocality: "Losser",                 addressRegion: "Overijssel",     postalCode: "7581" },
  "Borculo":               { streetAddress: "Borculo",                addressLocality: "Borculo",                addressRegion: "Gelderland",     postalCode: "7271" },
  // ── Generic NL fallback ───────────────────────────────────────────────────────
  "Netherlands":           { streetAddress: "Amsterdam",              addressLocality: "Amsterdam",              addressRegion: "Noord-Holland", postalCode: "1011" },
};

/**
 * Extract JobPosting address meta from a vacancy location string.
 * Location strings may contain multiple cities ("Helmond / Deurne / Eindhoven",
 * "Rotterdam area", "Rhodes, Crete, Kos") — we match the first recognised city.
 */
export function getAddressMeta(location: string): AddressMeta {
  // Split on comma, slash, or " / " and try each token
  const tokens = location.split(/[,/]/).map((s) => s.trim());

  for (const token of tokens) {
    // 1. Exact key match
    if (CITY_META[token]) return CITY_META[token];

    // 2. Token contains a known key (e.g. "Rotterdam area" → "Rotterdam")
    for (const key of Object.keys(CITY_META)) {
      if (token.toLowerCase().includes(key.toLowerCase())) {
        return CITY_META[key];
      }
    }
  }

  // 3. Full location string contains a known key (last resort)
  for (const key of Object.keys(CITY_META)) {
    if (location.toLowerCase().includes(key.toLowerCase())) {
      return CITY_META[key];
    }
  }

  return CITY_META["Netherlands"];
}

/**
 * Return the correct Schema.org unitText for baseSalary.
 * Greek jobs are paid monthly; everything else is converted to weekly.
 */
export function getSalaryUnit(salaryDisplay: string): "WEEK" | "MONTH" {
  return salaryDisplay.includes("/mo") ? "MONTH" : "WEEK";
}
