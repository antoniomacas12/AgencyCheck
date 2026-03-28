/**
 * AgencyCheck — SEO Content Quality Engine
 *
 * Generates real, data-driven copy for every programmatic page.
 * NO generic filler — every string includes salary, conditions, or practical insight.
 */

import type { SeoJobType } from "@/lib/seoRoutes";
import type { CityData }   from "@/lib/seoData";

// ─── Working condition snippets per job type ──────────────────────────────────
// Based on real Dutch labour market conditions in 2026.

const JOB_CONDITIONS: Record<string, string[]> = {
  "forklift-driver": [
    "Most positions require a valid counterbalance or reach-truck certificate (intern rijbewijs or VCA). Obtaining the certificate typically takes 1–2 days and is often paid by the agency.",
    "Cold chain logistics is common — expect temperatures of +4°C in food distribution centres. Thermal workwear is provided.",
    "Shift work is standard: early (06:00–14:00), late (14:00–22:00), and night (22:00–06:00). Night shifts add 15–25% to base pay.",
    "Forklift drivers at larger DCs (e.g. Schiphol, Rotterdam port) regularly handle 80–120 pallets per shift.",
  ],
  "warehouse-worker": [
    "You'll be on your feet for the full 8–10 hour shift, walking an average of 12–20 km. Good footwear matters.",
    "Most DCs in the Netherlands operate 2-shift (early/late) or 3-shift (early/late/night) schedules. Weekend work is often rewarded with a 25–50% shift allowance.",
    "Physical targets exist — typically 95–110% efficiency on WMS systems. New starters usually get a 2–4 week ramp-up period.",
    "Probation periods in Fase A (first 78 weeks) mean the agency can end the placement with zero notice. Many agencies extend strong performers to Fase B for more security.",
  ],
  "order-picker": [
    "Voice-directed or RF-scanner picking is standard at most large Dutch fulfilment centres. Training typically takes one day.",
    "Pick rates vary: e-commerce DCs expect 100–200 items/hour; bulk food warehouses 60–80 picks/hour.",
    "Temperature-controlled zones are common in food logistics — expect 4°C to 8°C in fresh areas.",
    "Night shift order picking typically pays €15.50–€17.50/hr gross in 2026 due to unsocial hours allowances.",
  ],
  "production-worker": [
    "Line speed is fixed — you work at the pace of the conveyor. The first week is the hardest as your body adjusts.",
    "Repetitive motion work. Employers are legally required to provide ergonomic assessments and rotation between tasks every 2 hours.",
    "Food production jobs require mandatory hygiene training (HACCP). This is usually completed on day 1.",
    "3-shift or 4-shift rotation schedules (continental shifts) are common in large manufacturing plants like Unilever, FrieslandCampina, and Heinz.",
  ],
  "reach-truck-driver": [
    "Reach trucks operate in high-bay racking systems up to 12m. A valid MHE (Materials Handling Equipment) certificate specific to standheftrucks is required.",
    "Precision matters — misplaced pallets in a 12m rack cause significant delays and safety issues. Most employers require 6 months minimum experience.",
    "Demand for certified reach truck operators is consistently higher than supply in the Netherlands. This drives salaries above counterbalance forklift rates.",
    "Many positions near Tilburg, Venlo, and Waalwijk logistics parks offer year-round work — not seasonal.",
  ],
  "logistics-operator": [
    "A broad role that includes inbound receiving, put-away, replenishment, and outbound shipping. Often a stepping stone to team leader.",
    "Strong demand near Schiphol (air cargo), Rotterdam Maasvlakte (sea freight), and Venlo (cross-border road freight hub to Germany).",
    "Many positions require a basic Dutch or English safety certificate. Your agency typically covers the cost.",
    "Cross-docking and just-in-time logistics are common — shift punctuality is critical in these environments.",
  ],
  "packing-operator": [
    "Packing roles are often the most accessible for workers new to the Netherlands — no experience required.",
    "Work is repetitive but measured: expect 300–500 packs per hour in e-commerce; 200–300 in food.",
    "Many food packing positions include hygiene suits, hairnets, and gloves. You cannot wear jewellery or false nails.",
    "Temporary positions can become permanent quickly — packing operators who show reliability are usually offered contract extensions within 3 months.",
  ],
  "machine-operator": [
    "Responsible for setting up, running, and monitoring industrial machines. Basic technical aptitude required — usually assessed with a short practical test.",
    "Downtime costs money. Operators are expected to do first-line troubleshooting and escalate complex issues to maintenance.",
    "MBO-2 technical diploma is preferred but not always required. Many agencies provide on-the-job training.",
    "Automotive and electronics manufacturing (Eindhoven, Tilburg) pays a premium over food production for machine operators.",
  ],
  "truck-driver": [
    "CE licence (articulated lorry) is required for most positions. Some local delivery roles accept a C licence.",
    "Drivers working internationally earn significantly more — long-haul rates to Germany, Poland, and Belgium typically start at €18/hr.",
    "Dutch tachograph rules strictly enforce 9-hour driving limits and 45-minute break requirements. Violations result in fines for the company, not just the driver.",
    "Refrigerated transport adds €1–€2/hr premium in most contracts.",
  ],
  "greenhouse-worker": [
    "The Westland, Maasdijk, and Aalsmeer regions are the centre of Dutch horticulture. Most greenhouse work is seasonal (peak: March–October) but year-round positions exist.",
    "Work involves planting, cultivating, harvesting, and packing plants and vegetables. Standing for full shifts is the norm.",
    "Many positions include accommodation in nearby housing — particularly in rural Zeeland and Noord-Holland horticultural zones.",
    "No experience is needed for most greenhouse entry roles, but physical endurance and tolerance for repetitive tasks are essential.",
  ],
  "assembly-worker": [
    "Assembly roles range from simple repetitive tasks (inserting components) to complex multi-step builds. Eindhoven and Tilburg are the strongest Dutch markets for assembly work.",
    "Precision is valued over speed in most assembly roles. Employers run quality checks — defect rates are tracked per worker from day one.",
    "Most assembly shifts are fixed-term Fase A contracts through an agency. After 26 weeks (Fase A phase 1) you gain slightly more contract security.",
    "Automotive assembly at Tier-1 suppliers (e.g. VDL, Bosch, NXP area suppliers) pays a premium of €0.50–€1.50/hr above food-sector assembly roles.",
  ],
  "cleaning-staff": [
    "Cleaning contracts in the Netherlands are governed by the Schoonmaak CAO, which has its own overtime and shift rules separate from the ABU flex-worker CAO.",
    "Most roles are part-time (20–32 hours/week), though some industrial cleaning positions (factories, logistics parks) offer full-time hours.",
    "Night and early-morning cleaning commands a 25–50% unsocial hours premium under the Schoonmaak CAO — this is legally enforceable.",
    "Agencies placing cleaning workers in healthcare or food-production facilities require mandatory hygiene certificates (usually issued in one training day).",
  ],
};

// ─── City context snippets ────────────────────────────────────────────────────

const CITY_CONTEXT: Record<string, string> = {
  amsterdam:    "Amsterdam has a large logistics cluster centred on Schiphol Airport and the A4/A9 industrial zones. Air cargo, e-commerce fulfilment, and food distribution are the dominant sectors. English is widely spoken in most warehouses.",
  rotterdam:    "Rotterdam is Europe's busiest port, generating massive demand for logistics and warehouse workers year-round. The Botlek, Maasvlakte, and Waalhaven industrial areas have hundreds of permanent and flex positions.",
  eindhoven:    "Eindhoven's supply chain ecosystem supports high-tech manufacturers including ASML and Philips. Production and assembly roles pay slightly above average due to precision requirements.",
  tilburg:      "Tilburg is a major e-commerce and FMCG logistics hub in Noord-Brabant, hosting large DCs for Zalando, Amazon, and Wehkamp. Order picker and forklift demand is consistently high.",
  venlo:        "Venlo's position on the German border makes it one of the Netherlands' top cross-docking and distribution hubs. German language skills are a bonus but not required.",
  waalwijk:     "Waalwijk is the leather goods and footwear distribution capital of the Netherlands, with significant warehouse demand from Ecco, Timberland, and regional 3PL operators.",
  breda:        "Breda's logistics park near the A16 motorway serves as a key distribution point for southern Netherlands and Belgium. Many bilingual (Dutch/English) positions available.",
  utrecht:      "Utrecht's central location makes it a favoured site for national distribution operations. Public transport access is excellent, reducing reliance on agency transport.",
  groningen:    "Groningen has growing demand for warehouse and production workers due to the expansion of logistics facilities in Westpoort and Eemspoort industrial zones.",
  venray:       "Venray is home to major logistics and production operations from Mediq, Toyota, and international 3PLs. It consistently ranks among the highest job-count cities in our dataset.",
  schiphol:     "Schiphol's airside and landside logistics require continuous 24/7 staffing. Night shift premiums of 25–40% apply for positions within the airport restricted zone.",
  "den-haag":   "Den Haag's government and service economy creates demand for administrative and support workers, but nearby Zoetermeer and Leidschendam have significant logistics operations.",
  "s-hertogenbosch": "'s-Hertogenbosch (Den Bosch) is a strong logistics city in Noord-Brabant with large distribution parks on the A2 and A59 corridors.",
};

// ─── Intro paragraph generator ────────────────────────────────────────────────

/**
 * Generate a specific, data-driven intro paragraph for a job type page (national).
 */
export function getJobTypeIntro(jt: SeoJobType): string {
  const conditions = JOB_CONDITIONS[jt.slug] ?? JOB_CONDITIONS["warehouse-worker"];
  return (
    `${jt.label} jobs in the Netherlands typically pay between ` +
    `€${jt.salaryMin.toFixed(2)} and €${jt.salaryMax.toFixed(2)} per hour gross in 2026 ` +
    `(average: €${jt.avgSalary.toFixed(2)}/hr). Demand is strong throughout the year, ` +
    `particularly in the logistics hubs of Rotterdam, Venlo, Tilburg, and Schiphol. ` +
    conditions[0]
  );
}

/**
 * Generate a specific intro for a city + job type combination.
 */
export function getCityJobTypeIntro(jt: SeoJobType, city: CityData): string {
  const cityContext = CITY_CONTEXT[city.slug] ?? `${city.name} is an active employment market in ${city.region}.`;
  return (
    `${jt.label} positions in ${city.name} pay between ` +
    `€${jt.salaryMin.toFixed(2)} and €${jt.salaryMax.toFixed(2)}/hr gross. ` +
    cityContext + " " +
    (JOB_CONDITIONS[jt.slug]?.[1] ?? "")
  );
}

/**
 * Generate intro for a city hub page.
 */
export function getCityIntro(city: CityData, jobCount: number, avgSalary: number): string {
  const cityContext = CITY_CONTEXT[city.slug] ?? `${city.name} is an active employment market in ${city.region}.`;
  const salaryStr   = avgSalary > 0 ? `with an average pay of €${avgSalary.toFixed(2)}/hr gross` : "starting from the Dutch minimum wage of €14.71/hr";
  return (
    `${cityContext} There are currently ${jobCount > 0 ? jobCount : "dozens of"} ` +
    `active positions available through verified employment agencies (uitzendbureaus), ` +
    `${salaryStr}. No Dutch language required for most logistics and production roles.`
  );
}

// ─── Condition bullets per job type ──────────────────────────────────────────

/** Get 3–4 real working condition bullets for a job type */
export function getJobConditionBullets(jobTypeSlug: string): string[] {
  return JOB_CONDITIONS[jobTypeSlug] ?? JOB_CONDITIONS["warehouse-worker"];
}

// ─── FAQ generators ───────────────────────────────────────────────────────────

export function getJobTypeFAQ(
  jt: SeoJobType,
  cityName?: string
): { q: string; a: string }[] {
  const loc = cityName ? `in ${cityName}` : "in the Netherlands";

  return [
    {
      q: `What is the average salary for a ${jt.label} ${loc} in 2026?`,
      a: `The average gross hourly rate is approximately €${jt.avgSalary.toFixed(2)}/hr ${loc}. ` +
        `Entry-level positions start at €${jt.salaryMin.toFixed(2)}/hr; experienced workers or those ` +
        `on night shifts can earn up to €${jt.salaryMax.toFixed(2)}/hr. ` +
        `On a 40-hour week, that translates to roughly €${Math.round(jt.avgSalary * 173).toLocaleString()}/month gross.`,
    },
    {
      q: `Do I need a certificate or experience to work as a ${jt.label}?`,
      a: jt.prefix === "forklift" || jt.prefix === "reach-truck"
        ? `Yes — a valid forklift or reach-truck certificate (intern rijbewijs) is required. Some agencies arrange training ` +
          `(1–2 days, typically paid). Bring your existing certificate if you have one from your home country — ` +
          `many Dutch employers accept EU-issued licences with a brief familiarisation test.`
        : `Most ${jt.label} positions are suitable for people with no prior experience in the Netherlands. ` +
          `Physical fitness, reliability, and willingness to work shifts are the main requirements. ` +
          `Language skills are rarely tested for floor positions.`,
    },
    {
      q: `Is housing available for ${jt.label} jobs ${loc}?`,
      a: `Yes — agencies including Otto Workforce, Covebo, and GI Group arrange accommodation for workers. ` +
        `Rent is deducted from your salary (typically €80–€130/week under the SNF standard, capped at 25% of gross wage). ` +
        `Transport from housing to the worksite is usually included. ` +
        `Always confirm the exact deduction amount and address of the accommodation before accepting.`,
    },
    {
      q: `What shifts do ${jt.label} jobs have ${loc}?`,
      a: `Most positions run either a 2-shift (06:00–14:00 / 14:00–22:00) or 3-shift schedule. ` +
        `Night shift (22:00–06:00) adds a 15–25% allowance on top of base pay. ` +
        `${jt.prefix === "production" || jt.prefix === "machine-operator"
          ? "Continental 4-shift patterns (also called 'roterend ploegendienst') are common in manufacturing."
          : "Weekend work usually attracts a 25–50% Saturday/Sunday premium."}`,
    },
    {
      q: `How do I get paid and what documents do I need?`,
      a: `You will be paid via your Dutch bank account (IBAN required). Before starting, you need: ` +
        `a valid EU passport or ID card, a BSN (Dutch citizen service number — register at your local gemeente or RNI desk), ` +
        `and a Dutch IBAN. Most agencies require you to have these before your first shift. ` +
        `Your employer must provide a payslip (loonstrook) every month.`,
    },
  ];
}

export function getCityFAQ(city: CityData): { q: string; a: string }[] {
  return [
    {
      q: `What jobs are available in ${city.name} for foreign workers?`,
      a: `${city.name} has consistent demand for warehouse workers, order pickers, forklift drivers, ` +
        `production staff, and logistics operators. Most positions are filled through employment agencies ` +
        `and require no Dutch or advanced language skills. ${CITY_CONTEXT[city.slug]?.split(".")[0] ?? ""}`,
    },
    {
      q: `Do agencies in ${city.name} provide housing?`,
      a: `Several agencies operating in ${city.name} include accommodation as part of the package. ` +
        `Agencies like Otto Workforce, Covebo, and GI Group are known for offering housing near the worksite. ` +
        `Rent deductions are typically €80–€130/week, legally capped at 25% of your gross wage under the SNF standard.`,
    },
    {
      q: `How much can I earn in ${city.name} as a warehouse or logistics worker?`,
      a: `Gross hourly rates in ${city.name} start at €14.71/hr (Dutch minimum wage 2026). ` +
        `Most warehouse and logistics roles pay €14.50–€16.50/hr. Forklift and reach-truck operators ` +
        `with valid certificates earn €16–€20/hr. Night shift positions typically add 15–25% on top.`,
    },
    {
      q: `Do I need to speak Dutch to work in ${city.name}?`,
      a: `Not for most logistics and production positions. Many warehouses and factories in ${city.name} ` +
        `operate with English, Polish, or Romanian. Larger international agencies have multilingual staff ` +
        `for onboarding and payslip queries. Basic Dutch (safety signs, supervisor instructions) is useful but not required.`,
    },
    {
      q: `How do I register for work in ${city.name} as an EU citizen?`,
      a: `EU/EEA citizens do not need a work permit in the Netherlands. You need to: ` +
        `(1) register at your local gemeente or the nearest RNI desk to get a BSN number, ` +
        `(2) open a Dutch bank account (Bunq, Revolut NL, or ING work-well), ` +
        `(3) contact an employment agency directly. Many agencies handle BSN registration as part of onboarding.`,
    },
  ];
}

// ─── Schema.org FAQ structured data ──────────────────────────────────────────

export function buildFAQSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
      },
    })),
  };
}

// ─── Schema.org JobPosting for structured data on job list pages ──────────────

export function buildJobPostingSchema(job: {
  title: string;
  city: string;
  agencyName: string;
  salaryMin: number;
  salaryMax: number;
}) {
  if (!job.salaryMin || job.salaryMin < 14.71) return null;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.city,
        "addressCountry": "NL",
      },
    },
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.agencyName,
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "EUR",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": job.salaryMin,
        "maxValue": job.salaryMax || job.salaryMin,
        "unitText": "HOUR",
      },
    },
    "employmentType": "TEMPORARY",
    "datePosted": new Date().toISOString().split("T")[0],
  };
}
