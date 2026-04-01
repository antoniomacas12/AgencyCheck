// ─── AgencyCheck — Work-In SEO Page Data ──────────────────────────────────────
// Drives /work-in/[combo] — 50 programmatic SEO pages covering:
//   5 job types × 5 cities × 2 audiences = 50 pages

import { WML_HOURLY_2026 } from "@/lib/dutchTax";

// ─── Job Types ────────────────────────────────────────────────────────────────

export interface WorkInJobType {
  slug:         string;
  title:        string;         // e.g. "Warehouse Worker"
  titleShort:   string;         // e.g. "Warehouse"
  icon:         string;
  salaryMin:    number;
  salaryMax:    number;
  salaryAvg:    number;
  jobSlugRef:   string;         // /jobs/[jobSlugRef] internal link
  description:  string;         // 1-2 sentences about the role
  skills:       string[];       // useful skills / certs
  shiftNote:    string;         // shift pattern note
}

export const WORK_IN_JOB_TYPES: Record<string, WorkInJobType> = {
  warehouse: {
    slug:        "warehouse",
    title:       "Warehouse Worker",
    titleShort:  "Warehouse",
    icon:        "🏭",
    salaryMin:   14.71,
    salaryMax:   16.50,
    salaryAvg:   14.90,
    jobSlugRef:  "warehouse-worker",
    description: "General warehouse duties: receiving, storing, picking, packing, and shipping goods. No formal qualifications needed — most agencies provide on-site training within the first day.",
    skills:      ["Order picking (RF scanner)", "Packing", "Stock control", "Safety induction"],
    shiftNote:   "Day, evening, and night shifts available. Night shifts usually carry a 22–30% premium under ABU/NBBU CAO.",
  },
  factory: {
    slug:        "factory",
    title:       "Factory Worker",
    titleShort:  "Factory",
    icon:        "⚙️",
    salaryMin:   14.71,
    salaryMax:   17.00,
    salaryAvg:   15.10,
    jobSlugRef:  "production-worker",
    description: "Production and assembly line work in food, pharmaceutical, automotive, and consumer goods factories. Fast-paced repetitive work with strict hygiene and safety standards.",
    skills:      ["Assembly line", "Quality checks", "Machine monitoring", "GMP (food factories)"],
    shiftNote:   "Most factory roles run 2-shift (6–14 / 14–22) or 3-shift (including nights) rotating schedules.",
  },
  logistics: {
    slug:        "logistics",
    title:       "Logistics / Order Picker",
    titleShort:  "Logistics",
    icon:        "📦",
    salaryMin:   14.71,
    salaryMax:   16.00,
    salaryAvg:   14.80,
    jobSlugRef:  "order-picker",
    description: "Order picking, goods-in/out, and distribution centre tasks. Often walking 15–25 km per shift. High demand in e-commerce DCs (distribution centres) around major Dutch cities.",
    skills:      ["RF scanner / voice picking", "Pick-by-light", "Pallet building", "WMS basics"],
    shiftNote:   "E-commerce warehouses often require weekend availability; Sunday work carries a 50% premium.",
  },
  forklift: {
    slug:        "forklift",
    title:       "Forklift Driver",
    titleShort:  "Forklift",
    icon:        "🚜",
    salaryMin:   15.50,
    salaryMax:   19.00,
    salaryAvg:   16.50,
    jobSlugRef:  "forklift-driver",
    description: "Operating counterbalance forklifts, reach trucks, and order pickers in warehouses, port terminals, and distribution centres. VCA or VVT-I forklift certificate required.",
    skills:      ["VCA certificate", "Counterbalance forklift (Cat A)", "Reach truck (Cat B)", "MHE licence"],
    shiftNote:   "Forklift drivers are in high demand for night and early-morning shifts, which carry premium pay of 22–50% above base rate.",
  },
  production: {
    slug:        "production",
    title:       "Production Worker",
    titleShort:  "Production",
    icon:        "🔩",
    salaryMin:   14.71,
    salaryMax:   16.50,
    salaryAvg:   15.00,
    jobSlugRef:  "production-worker",
    description: "Assembly, packaging, and production line operation in manufacturing plants. Roles range from food processing and electronics assembly to automotive parts and packaging machinery.",
    skills:      ["Assembly line work", "Packaging", "Quality inspection", "5S / lean principles"],
    shiftNote:   "Production facilities usually run continuous 3-shift operations. Consistent shift premiums for evening (15–20%) and night (22–30%) work.",
  },
};

// ─── Cities ───────────────────────────────────────────────────────────────────

export interface WorkInCity {
  slug:         string;
  name:         string;         // for getTopAgenciesForCity (exact name match)
  region:       string;
  population:   string;
  industryNote: string;         // city-specific job market context
  housingNote:  string;         // housing cost context for this city
  avgRent:      string;         // typical private rent / month
  keyEmployers: string[];       // well-known employers in this city / region
  nearbyHubs:   string[];       // nearby logistics / industrial zones
}

export const WORK_IN_CITIES: Record<string, WorkInCity> = {
  amsterdam: {
    slug:         "amsterdam",
    name:         "Amsterdam",
    region:       "Noord-Holland",
    population:   "921,000",
    industryNote: "Amsterdam is the logistics capital of the Netherlands. Schiphol Airport and the surrounding Haarlemmermeer industrial zone are major employers. Many e-commerce DCs are located in Almere and Diemen, both within 25 km.",
    housingNote:  "Amsterdam has among the highest private rental costs in the Netherlands (€1,100–€1,800/month for a room). Agency-provided housing is extremely common for foreign workers and is typically deducted at €80–115/week.",
    avgRent:      "€1,100–€1,800/month",
    keyEmployers: ["DHL", "PostNL", "Amazon", "Schiphol Cargo", "Albert Heijn DC"],
    nearbyHubs:   ["Haarlemmermeer", "Almere", "Diemen", "Westpoort"],
  },
  rotterdam: {
    slug:         "rotterdam",
    name:         "Rotterdam",
    region:       "Zuid-Holland",
    population:   "652,000",
    industryNote: "Rotterdam is home to Europe's largest port (Port of Rotterdam), making it a major hub for port logistics, container handling, chemical distribution, and food processing. Demand for forklift drivers and warehouse workers is consistently high.",
    housingNote:  "Rotterdam is more affordable than Amsterdam. Private rooms average €700–€1,200/month. Many agencies serving port workers include housing in their packages.",
    avgRent:      "€700–€1,200/month",
    keyEmployers: ["Port of Rotterdam", "Heineken", "Unilever", "Vopak", "Amazon"],
    nearbyHubs:   ["Maasvlakte", "Botlek", "Europoort", "Ridderkerk"],
  },
  eindhoven: {
    slug:         "eindhoven",
    name:         "Eindhoven",
    region:       "Noord-Brabant",
    population:   "234,000",
    industryNote: "Eindhoven is the tech and manufacturing heart of the Netherlands — home to ASML, Philips, and DAF Trucks, as well as hundreds of component suppliers. Production and assembly work is plentiful and hourly rates tend to be slightly above the national average.",
    housingNote:  "Eindhoven is more affordable than Amsterdam or Den Haag. Private rooms average €600–€900/month. Agency housing is common for workers placed at industrial clients outside the city centre.",
    avgRent:      "€600–€900/month",
    keyEmployers: ["ASML", "Philips", "NXP Semiconductors", "DAF Trucks", "VDL Group"],
    nearbyHubs:   ["Veldhoven", "Son en Breugel", "Helmond", "Waalre"],
  },
  utrecht: {
    slug:         "utrecht",
    name:         "Utrecht",
    region:       "Utrecht",
    population:   "357,000",
    industryNote: "Utrecht's central location makes it a key crossroads for Dutch logistics and distribution. Major distribution centres for retail and e-commerce are located in and around Utrecht, with easy access to Amsterdam, Rotterdam, and Eindhoven.",
    housingNote:  "Utrecht is one of the more expensive cities for housing, second only to Amsterdam. Private rooms average €850–€1,300/month. Workers from outside the Netherlands typically use agency-provided accommodation.",
    avgRent:      "€850–€1,300/month",
    keyEmployers: ["Lidl DC", "Jumbo DC", "PostNL", "UPS", "Coolblue DC"],
    nearbyHubs:   ["Nieuwegein", "Woerden", "Vianen", "Houten"],
  },
  "den-haag": {
    slug:         "den-haag",
    name:         "Den Haag",
    region:       "Zuid-Holland",
    population:   "548,000",
    industryNote: "Den Haag (The Hague) is primarily a government and service-sector city, but the greater area includes significant food processing, greenhouse horticulture, and light manufacturing in the Westland region. Logistics demand is driven by proximity to Rotterdam Port.",
    housingNote:  "Den Haag is slightly more affordable than Amsterdam. Private rooms average €750–€1,100/month. Agency-provided housing is common for horticultural workers placed in Westland.",
    avgRent:      "€750–€1,100/month",
    keyEmployers: ["Ministeries NL", "Royal Dutch Shell", "Siemens NL", "Westland Horticulture"],
    nearbyHubs:   ["Westland", "Delft", "Zoetermeer", "Naaldwijk"],
  },
};

// ─── Audiences ────────────────────────────────────────────────────────────────

export interface WorkInAudience {
  slug:            string;
  label:           string;        // "Foreigners"
  labelIn:         string;        // "for Foreigners"
  intro:           string;        // 2-sentence audience-specific intro
  requirements:    { title: string; body: string }[];
  warnings:        string[];
  advantages:      string[];
  faqItems:        { q: string; a: string }[];
}

export const WORK_IN_AUDIENCES: Record<string, WorkInAudience> = {
  foreigners: {
    slug:     "foreigners",
    label:    "Foreigners",
    labelIn:  "for Foreign Workers",
    intro:    "The Netherlands is one of the most accessible countries in Europe for foreign workers. EU and EEA citizens can start work legally without a separate work permit — the only requirement is registering and obtaining a BSN (burgerservicenummer) before your first payday.",
    requirements: [
      { title: "Valid ID or passport",      body: "All workers must present a valid government ID. Your employer is legally required to keep a copy. Never hand over your original documents permanently." },
      { title: "BSN (burgerservicenummer)", body: "Your BSN is the Dutch social security number. You need it before your employer can process your first payroll. Register at the nearest gemeente (municipality) or via a BRP appointment. This usually takes 1–5 working days." },
      { title: "Dutch bank account (IBAN)", body: "Salary must be paid to a Dutch or EU IBAN account. Opening an account without a fixed address is possible with bunq, Revolut Business (NL IBAN), or N26. Bring your BSN and ID to a local bank for a full account." },
      { title: "EU/EEA citizens",           body: "No work permit required. You have full labour rights identical to Dutch nationals from day one, including minimum wage, CAO protections, and sick pay entitlement." },
      { title: "Non-EU citizens",           body: "Most non-EU workers need either an employer-sponsored TWV (work permit) or a Highly Skilled Migrant (kennismigrant) permit. Your employer or agency must apply on your behalf. Working without a TWV is illegal and may result in deportation." },
    ],
    warnings: [
      "Never pay an agency to find you a job — legitimate Dutch agencies do not charge placement fees",
      "Do not sign a contract you don't understand. Ask for a translated version — you are legally entitled to this",
      "Agency housing costs must be in writing before you start. The maximum deduction under SNF standards is €113.50/week",
      "Check your payslip every month. Deductions must be itemised — unnamed deductions are illegal",
      "If your gross pay is below €14.71/hr (WML 2026), report it to the Dutch Labour Inspectorate (NLA)",
    ],
    advantages: [
      `Minimum wage of €${WML_HOURLY_2026}/hr applies to all workers regardless of nationality`,
      "ABU and NBBU collective agreements (CAO) protect temporary workers at all accredited agencies",
      "Housing is commonly included — especially in agriculture, logistics, and food processing",
      "Transport to the worksite is frequently included (bus service or cost reimbursement)",
      "Holiday pay (vakantiegeld) of 8% is mandatory and added to every payslip",
    ],
    faqItems: [
      { q: "Do I need a work permit to work in the Netherlands as an EU citizen?", a: "No. EU and EEA citizens have the right to work in the Netherlands without a work permit. You only need to register at the municipality and obtain your BSN number before your employer can process payroll." },
      { q: "How long does it take to get a BSN number in the Netherlands?", a: "Typically 1–5 working days if you register in person at a gemeente (municipality office). Some agencies can help you pre-register through an RNI (Non-Residents Record). You can also arrange this via an appointment at a BRP desk in major cities like Amsterdam, Rotterdam, or Utrecht." },
      { q: "Can I work in the Netherlands without speaking Dutch?", a: `Yes — many warehouse, factory, and logistics roles require only basic communication skills. English is widely spoken in the Dutch workplace, particularly at international distribution centres. However, you are entitled to receive your employment contract in a language you understand before signing.` },
      { q: "Is agency housing in the Netherlands safe for foreign workers?", a: "Most accredited Dutch agencies (those with an SNF or ABF certificate) provide housing that meets legal standards. Inspections are conducted regularly. The maximum housing deduction allowed under SNF is €113.50/week. Ask to see the housing certificate before signing any contract that includes accommodation." },
    ],
  },
  students: {
    slug:     "students",
    label:    "Students",
    labelIn:  "for Students",
    intro:    "The Netherlands has a strong tradition of student employment, especially in logistics, hospitality, retail, and production. Most agencies actively recruit students for evening, weekend, and holiday shifts that fit around study schedules.",
    requirements: [
      { title: "Minimum age",                body: "You must be at least 15 years old to work in the Netherlands. Workers aged 15–16 need written parental/guardian consent and can only work a maximum of 8 hours per day and 40 hours per week during school holidays." },
      { title: "BSN required",               body: "Just like all workers, students need a BSN (burgerservicenummer) before their employer can process payroll. Obtain this from your local gemeente. MBO and HBO students in the Netherlands typically already have one." },
      { title: "No study permit needed",     body: "Dutch and EU students do not need a separate work or study permit for part-time jobs. Non-EU students on a study visa can work up to 16 hours per week or full-time in June, July, and August." },
      { title: "Age-scaled minimum wage",    body: `The Dutch minimum wage for workers under 21 is scaled by age. At 21+, the full WML of €${WML_HOURLY_2026}/hr applies. Below 21, the rate is lower but still legally protected. Ask your agency to confirm your exact minimum rate in writing.` },
      { title: "Tax returns (belastingteruggaaf)", body: "Students who earn below the taxable threshold (approximately €8,700/year) can reclaim all loonheffing deducted via a belastingteruggaaf (tax refund). File via MijnBelastingdienst. Most students who work part-time qualify for a full or partial refund." },
    ],
    warnings: [
      "Make sure your hourly rate is at least the age-scaled minimum — some agencies pay below the legal minimum for younger workers",
      "Do not let an agency deduct housing or transport costs without a written agreement",
      "Keep a record of your own hours — compare them to your payslip every week",
      "If your study visa limits your working hours, exceeding them can put your residence permit at risk",
      "Unpaid 'trial shifts' are illegal in the Netherlands — every hour worked must be paid",
    ],
    advantages: [
      "Weekend and evening shifts pay 15–50% premiums under ABU/NBBU CAO",
      "Many warehouses and factories have flexible call-in rosters suitable for students",
      "Holiday pay (vakantiegeld) of 8% is paid on top of every payslip",
      "Some agencies offer zero-hours (oproepkracht) contracts — you work when available",
      "Summer holidays (June–August) are peak hiring season; full-time roles available",
    ],
    faqItems: [
      { q: "What is the minimum wage for a 18-year-old student working in a warehouse in the Netherlands?", a: `In 2026, the Dutch youth minimum wage for an 18-year-old is 50% of the adult WML: €${(WML_HOURLY_2026 * 0.5).toFixed(2)}/hr gross. At 19 it rises to 60% (€${(WML_HOURLY_2026 * 0.6).toFixed(2)}/hr), at 20 to 80% (€${(WML_HOURLY_2026 * 0.8).toFixed(2)}/hr), and at 21 to the full WML of €${WML_HOURLY_2026}/hr. These are legal minimums — your agency may offer more.` },
      { q: "Can I work in a warehouse as a student in the Netherlands without a work permit?", a: "Yes — Dutch and EU students do not need a work permit. Non-EU international students studying in the Netherlands on a residence permit can work up to 16 hours per week (or full-time during June, July, and August). Your employer handles registration; you just need your BSN and a valid ID." },
      { q: "How many hours can a student work per week in the Netherlands?", a: "There is no legal weekly limit for students who are 18 or older — you can work full-time (40 hours) if desired. Students aged 15–17 have stricter limits during the school year: a maximum of 12 hours in any week that includes school days, rising to 40 hours during school holidays. Always check that your work schedule does not violate your school or study visa conditions." },
      { q: "Can I get a tax refund if I work as a student in the Netherlands?", a: "Yes. Most students who work part-time earn below the taxable income threshold (~€8,700/year). If loonheffing was deducted from your salary, you can reclaim it by filing a belastingteruggaaf (tax refund application) on the Belastingdienst website. Many students receive a full refund. You can do this after the calendar year ends — often in February or March of the following year." },
    ],
  },
};

// ─── All 50 combos ────────────────────────────────────────────────────────────

export interface WorkInCombo {
  combo:     string;   // slug = "[job]-jobs-[city]-[audience]"
  jobSlug:   string;
  citySlug:  string;
  audience:  string;
}

export function allWorkInCombos(): WorkInCombo[] {
  const combos: WorkInCombo[] = [];
  for (const jobSlug of Object.keys(WORK_IN_JOB_TYPES)) {
    for (const citySlug of Object.keys(WORK_IN_CITIES)) {
      for (const audience of Object.keys(WORK_IN_AUDIENCES)) {
        combos.push({
          combo:    `${jobSlug}-jobs-${citySlug}-${audience}`,
          jobSlug,
          citySlug,
          audience,
        });
      }
    }
  }
  return combos;
}

export function parseWorkInCombo(combo: string): WorkInCombo | null {
  const job      = Object.keys(WORK_IN_JOB_TYPES).find((j) => combo.startsWith(`${j}-jobs-`));
  if (!job) return null;
  const rest     = combo.slice(`${job}-jobs-`.length);
  const audience = Object.keys(WORK_IN_AUDIENCES).find((a) => rest.endsWith(`-${a}`));
  if (!audience) return null;
  const citySlug = rest.slice(0, -(audience.length + 1));
  if (!WORK_IN_CITIES[citySlug]) return null;
  return { combo, jobSlug: job, citySlug, audience };
}

// ─── Youth WML table 2026 ─────────────────────────────────────────────────────

export const YOUTH_WML_2026: { age: number; pct: number; rate: number }[] = [
  { age: 15, pct: 30,  rate: +(WML_HOURLY_2026 * 0.30).toFixed(2) },
  { age: 16, pct: 34.5,rate: +(WML_HOURLY_2026 * 0.345).toFixed(2) },
  { age: 17, pct: 39.5,rate: +(WML_HOURLY_2026 * 0.395).toFixed(2) },
  { age: 18, pct: 50,  rate: +(WML_HOURLY_2026 * 0.50).toFixed(2) },
  { age: 19, pct: 60,  rate: +(WML_HOURLY_2026 * 0.60).toFixed(2) },
  { age: 20, pct: 80,  rate: +(WML_HOURLY_2026 * 0.80).toFixed(2) },
  { age: 21, pct: 100, rate: WML_HOURLY_2026 },
];
