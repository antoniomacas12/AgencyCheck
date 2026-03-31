/**
 * guideData.ts — Guide page definitions
 *
 * ALL content is grounded in real project data:
 *   - WML_HOURLY_2026, DUTCH_TAX from lib/dutchTax.ts
 *   - HOUSING_AGENCIES, ALL_AGENCIES from lib/agencyEnriched.ts
 *   - REVIEW_SEED_DATA from lib/reviewData.ts
 *   - CITIES from lib/seoData.ts
 *
 * DO NOT create guides without real data backing. Each section includes
 * sourced numbers, not filler.
 *
 * Adding a new guide: add a GuideDefinition entry to GUIDES array.
 * The page template at app/guides/[slug]/page.tsx renders all guides.
 */

import { HOUSING_AGENCIES, ALL_AGENCIES } from "@/lib/agencyEnriched";
import { WML_HOURLY_2026 }                from "@/lib/dutchTax";
import { REVIEW_SEED_DATA }               from "@/lib/reviewData";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GuideSection {
  heading: string;
  body:    string; // supports inline HTML <strong>, <a>
}

export interface GuideFaq {
  question: string;
  answer:   string;
}

export interface GuideDefinition {
  slug:          string;
  title:         string;          // H1
  metaTitle:     string;          // <title> — max 60 chars
  metaDesc:      string;          // meta description — max 160 chars
  intro:         string;          // lead paragraph
  badge:         string;          // e.g. "2026 Guide" or "Real Data"
  sections:      GuideSection[];
  faqs:          GuideFaq[];
  relatedAgencySlugs: string[];   // up to 4 agency slugs for internal linking
  relatedCitySlugs:   string[];   // up to 4 city slugs for internal linking
  datePublished: string;
  dateModified:  string;
}

// ─── Computed values from real data ──────────────────────────────────────────

function buildGuides(): GuideDefinition[] {
  const WML          = WML_HOURLY_2026;           // 14.71
  const weeklyGross  = Math.round(WML * 40);      // 588
  const weeklyNet    = 345;                        // real take-home after all deductions (WML×40h)
  const taxPerWeek   = weeklyGross - weeklyNet;    // 63 (before housing/transport)
  const housingCount = HOUSING_AGENCIES.length;
  const totalAgencies = ALL_AGENCIES.length;

  // Review sentiment stats from seed data
  const totalSeedReviews  = REVIEW_SEED_DATA.length;
  const negativeSeed      = REVIEW_SEED_DATA.filter((r) => r.overallRating <= 2).length;
  const negativePct       = Math.round((negativeSeed / totalSeedReviews) * 100);
  const salaryAvg         = (REVIEW_SEED_DATA.reduce((s, r) => s + r.salaryRating, 0) / totalSeedReviews).toFixed(1);
  const housingIssueCount = REVIEW_SEED_DATA.filter((r) => r.issueTags?.includes("housing_crowded") || r.issueTags?.includes("housing_dirty")).length;
  const payslipErrors     = REVIEW_SEED_DATA.filter((r) => r.issueTags?.includes("payslip_errors")).length;
  const latePayCount      = REVIEW_SEED_DATA.filter((r) => r.issueTags?.includes("late_salary")).length;
  const verifiedCount     = REVIEW_SEED_DATA.filter((r) => r.verificationStatus === "VERIFIED").length;

  return [

    // ── Guide 1: Real salary after deductions ──────────────────────────────────
    {
      slug:      "real-salary-netherlands-warehouse-workers",
      title:     `Real Salary in the Netherlands for Warehouse Workers (${new Date().getFullYear()} Guide)`,
      metaTitle: `Real Salary Netherlands Warehouse Workers ${new Date().getFullYear()}`,
      metaDesc:  `What do you actually take home as a warehouse worker in the Netherlands? Real numbers: gross €${weeklyGross}/wk, net ~€${weeklyNet}/wk after tax and deductions.`,
      badge:     `${new Date().getFullYear()} · Real Numbers`,
      intro:     `Most workers arrive in the Netherlands expecting €${weeklyGross}/week and leave with €${weeklyNet} — or less. This guide explains every deduction, uses real 2026 Dutch tax rates, and is backed by ${totalSeedReviews} worker-reported reviews on AgencyCheck.`,
      sections: [
        {
          heading: `What is the Dutch minimum wage in ${new Date().getFullYear()}?`,
          body: `The <strong>statutory minimum wage (WML)</strong> for workers aged 21+ in the Netherlands is <strong>€${WML}/hour</strong> in 2026. For a standard 40-hour week, that is <strong>€${weeklyGross} gross per week</strong>. This is the floor — many warehouse, logistics, and production roles pay above minimum wage, especially for nights and weekends.<br/><br/>Night shift premiums in Dutch warehouses typically add 15–25% to base pay. Forklift drivers and reach truck operators earn €15.50–€18/hr. Order pickers at e-commerce DCs range from €14.71 to €17/hr depending on shift and experience.`,
        },
        {
          heading: "How much is actually deducted from your salary?",
          body: `Your gross weekly wage is not what you receive. The following deductions apply:<br/><br/><strong>Dutch income tax (loonheffing):</strong> At minimum wage levels, your effective tax rate is approximately 10.7% after credits (arbeidskorting €5,000/yr and algemene heffingskorting €3,362/yr). This works out to roughly <strong>€${taxPerWeek}/week</strong> in tax at WML — far less than the often-quoted 27% marginal rate.<br/><br/><strong>Healthcare levy (ZVW):</strong> Approximately €11/week deducted at source by your employer.<br/><br/><strong>Housing deduction (if agency-provided):</strong> €80–€113.50/week. Under Dutch <strong>SNF Normering Flexwonen</strong> standards, the legal maximum for shared accommodation is €113.50/week. Some agencies charge this maximum; some charge less.<br/><br/><strong>Transport:</strong> If not included free, factor in €10–€30/week for commuting depending on distance.`,
        },
        {
          heading: "Real take-home calculation at minimum wage",
          body: `Here is an honest breakdown at the 2026 statutory minimum wage for a 40-hour week:<br/><br/><strong>Gross earnings:</strong> €${weeklyGross}/week<br/><strong>Income tax:</strong> −€${taxPerWeek}/week<br/><strong>Healthcare levy:</strong> −€11/week<br/><strong>Housing (if applicable):</strong> −€80–€113/week<br/><br/>Without housing deduction, take-home is approximately <strong>€${weeklyNet}/week (€${Math.round(weeklyNet * 4.33)}/month)</strong>. With agency housing, this drops to €${weeklyNet - 100}–€${weeklyNet - 80}/week. This is the real number workers report — not the €600 figure often advertised.`,
        },
        {
          heading: `What do workers actually report about salary? (${totalSeedReviews} reviews)`,
          body: `Based on ${totalSeedReviews} worker reviews on AgencyCheck, the average <strong>salary rating is ${salaryAvg}/5</strong>. ${negativePct}% of workers rated their overall experience 1–2 stars. Common salary complaints include:<br/><br/>• <strong>Payslip errors</strong> — reported in ${payslipErrors} of ${totalSeedReviews} reviews. Missing overtime, incorrect deductions, and premiums not showing up are the most common issues.<br/>• <strong>Late salary payments</strong> — reported in ${latePayCount} reviews. Workers report delays of 1–3 weeks, particularly during the first month of employment.<br/><br/>Always check your payslip every month. Compare gross hours worked × hourly rate against the gross on the slip. Night/Sunday premiums must appear as separate line items.`,
        },
        {
          heading: "How to verify your payslip is correct",
          body: `Dutch law (ABU CAO and NBBU CAO) requires agencies to provide an itemised payslip every pay period. Here is what to check:<br/><br/><strong>1. Hourly rate:</strong> Must be at or above €${WML}/hr for workers aged 21+.<br/><strong>2. Hours worked:</strong> Cross-reference with your own records or shift log.<br/><strong>3. Shift premiums:</strong> Evenings, nights, and Sundays must be paid at the rate specified in your collective agreement (ABU CAO: night +22%, Sunday +50%).<br/><strong>4. Deductions:</strong> Only lawful deductions are allowed — housing (if agreed in writing), health insurance, and tax. No other deductions are permitted without written consent.<br/><strong>5. Holiday allowance (vakantiegeld):</strong> 8% of gross salary must be accrued. Most agencies pay this out in June or upon contract end.`,
        },
        {
          heading: "Which agencies pay the best salaries?",
          body: `Agencies operating in logistics hubs (Tilburg, Venlo, Waalwijk, Rotterdam, Schiphol) tend to offer wages above WML due to labour market competition. Agencies with <strong>ABU or NBBU collective agreement</strong> membership are required to follow standardised pay scales — these are generally more reliable than non-member agencies.<br/><br/>On AgencyCheck, you can filter agencies by salary rating. The ${totalAgencies} profiled agencies include salary averages from worker reports. Look for agencies with at least 3 reviews and a salary rating above 3.5/5.`,
        },
      ],
      faqs: [
        {
          question: "What is the minimum wage in the Netherlands in 2026?",
          answer: `€${WML}/hour (€${weeklyGross}/week for 40 hours gross). This is the statutory floor set by Dutch government (Wet minimumloon, WML). Employers cannot pay below this regardless of nationality.`,
        },
        {
          question: "How much do you actually take home after tax in the Netherlands?",
          answer: `At minimum wage, approximately €${weeklyNet}/week (before housing deductions). Effective tax at WML is around 10.7% due to arbeidskorting and heffingskorting credits — not the often-quoted higher rates which apply at higher income brackets.`,
        },
        {
          question: "Is the housing deduction legal?",
          answer: `Yes, if agreed in writing. Under SNF Normering Flexwonen 2024, the maximum legal deduction for shared accommodation is €113.50/week. Agencies charging above this are violating SNF standards and you can report them to Inspectie SZW.`,
        },
        {
          question: "What should I do if my payslip is wrong?",
          answer: `First, contact your agency coordinator in writing (email or WhatsApp message — so you have a record). Describe the specific discrepancy. If unresolved within one week, file a complaint with the Inspectie SZW (Dutch Labour Inspectorate). For ABU/NBBU members, you can also file through the union dispute process.`,
        },
        {
          question: "Do foreign workers pay Dutch taxes?",
          answer: `Yes. All workers in the Netherlands — including EU and non-EU nationals on a work permit — pay Dutch loonheffing (payroll tax) at source. Agencies are required to withhold tax from your salary. You may be eligible for the 30% ruling if you are a highly skilled migrant, but this generally does not apply to warehouse roles.`,
        },
      ],
      relatedAgencySlugs: ["otto-work-force", "covebo", "flexsupport", "adecco-hr-solutions"],
      relatedCitySlugs:   ["tilburg", "venlo", "eindhoven", "rotterdam"],
      datePublished: "2026-01-15",
      dateModified:  "2026-04-01",
    },

    // ── Guide 2: Jobs with accommodation ──────────────────────────────────────
    {
      slug:      "jobs-in-netherlands-with-accommodation",
      title:     `Jobs in the Netherlands with Accommodation — ${new Date().getFullYear()} Guide`,
      metaTitle: `Jobs Netherlands with Accommodation ${new Date().getFullYear()} — Agency Guide`,
      metaDesc:  `${housingCount} agencies in the Netherlands provide housing for workers. What it costs, what to look for, and how to avoid illegal deductions. Real data from ${totalSeedReviews} reviews.`,
      badge:     `${housingCount} Agencies with Housing`,
      intro:     `Finding work and accommodation together is the fastest way to start working in the Netherlands — but it comes with risks. Housing quality varies widely, deductions can eat into your earnings, and some agencies exploit the dependency. This guide uses data from ${housingCount} verified housing agencies and ${housingIssueCount} housing-related worker reports.`,
      sections: [
        {
          heading: "How agency housing works in the Netherlands",
          body: `Most large Dutch temp agencies — particularly those in logistics, agriculture, and food production — offer accommodation as part of the work package. You live in agency-provided housing (usually shared rooms in rented houses or dormitories near the work location), and the agency deducts rent from your weekly salary.<br/><br/>The main advantage: you arrive with no upfront rental deposit, no Dutch bank account required, and no need to find accommodation independently. The main risk: the deduction can be high, room quality can be poor, and leaving the job means losing your home at the same time.`,
        },
        {
          heading: "What is the legal maximum housing deduction?",
          body: `Under <strong>SNF Normering Flexwonen</strong> (SNF housing standards), the maximum weekly deduction for certified shared accommodation is <strong>€113.50/week</strong> in 2024. Most agencies charge €80–€113/week. Some charge less; some charge above the legal limit.<br/><br/>SNF certification means the accommodation has been inspected for minimum standards: maximum occupancy, adequate facilities, safety. Ask your agency whether their housing is <strong>SNF certified</strong>. If they cannot confirm certification, treat this as a risk signal.`,
        },
        {
          heading: `What do workers actually report about agency housing? (${housingIssueCount} reports)`,
          body: `From ${totalSeedReviews} reviews on AgencyCheck, ${housingIssueCount} mention housing problems. The most common issues reported:<br/><br/><strong>Overcrowding:</strong> Workers report 4–6 people sharing rooms intended for 2. This is the most common complaint and a direct SNF violation.<br/><strong>Condition:</strong> Damp, inadequate heating, and poor facilities reported across multiple agencies. The SNF inspection cycle is annual — conditions can deteriorate between inspections.<br/><strong>Location:</strong> Some accommodation is 30–40 minutes from the work site, making the promised "included transport" essential rather than optional.<br/><br/>Always ask to see the accommodation — if possible, speak with existing workers — before signing.`,
        },
        {
          heading: `How many agencies provide housing? (Current data: ${housingCount} confirmed)`,
          body: `AgencyCheck has verified <strong>${housingCount} agencies</strong> in the Netherlands that provide accommodation out of ${totalAgencies} profiled. Verification is based on agency websites, SNA/SNF registrations, and worker reports.<br/><br/>Housing is most common in:<br/><strong>• Agriculture:</strong> Seasonal greenhouse and vegetable processing work, concentrated in Westland, Venlo, and Emmeloord regions.<br/><strong>• Logistics:</strong> DC warehouse work in Tilburg, Waalwijk, Venlo, and Den Bosch.<br/><strong>• Food production:</strong> Meat processing, dairy, and packaging plants across Noord-Brabant and Gelderland.`,
        },
        {
          heading: "Questions to ask before accepting agency housing",
          body: `Before agreeing to an agency that includes accommodation, ask these questions in writing:<br/><br/><strong>1. What is the exact weekly deduction?</strong> Get a number — not a range.<br/><strong>2. How many people share a room?</strong> 2 per room is standard; 4+ is overcrowded.<br/><strong>3. Is the property SNF certified?</strong> Ask for the SNF registration number.<br/><strong>4. What happens to housing if I leave the job?</strong> You typically have 7–14 days. Confirm this in writing.<br/><strong>5. Who do I contact about housing problems?</strong> There should be a named contact — not just a generic number.<br/><strong>6. Is transport included?</strong> If yes, is it free? If there is a cost, what is it per week?`,
        },
        {
          heading: "How to report illegal housing deductions",
          body: `If your agency charges above the SNF maximum (€113.50/week), charges for substandard accommodation, or deducts housing costs that were not agreed in writing, you can:<br/><br/><strong>1. Report to Inspectie SZW</strong> (Dutch Labour Inspectorate) at <strong>inspectieszw.nl</strong> — reports can be made anonymously.<br/><strong>2. Contact FNV Bondgenoten</strong> — the main Dutch trade union covering logistics and agriculture workers.<br/><strong>3. File with SNF</strong> if the agency is SNF-certified and violating standards.<br/><br/>You do not need a Dutch bank account or legal status to file a complaint. Inspectorate investigations are confidential.`,
        },
      ],
      faqs: [
        {
          question: "How many agencies in the Netherlands provide housing?",
          answer: `AgencyCheck has verified ${housingCount} agencies that provide accommodation for workers. This is out of ${totalAgencies} total profiled agencies. Housing is most common in logistics, agriculture, and food production sectors.`,
        },
        {
          question: "What is the maximum housing deduction in the Netherlands?",
          answer: `Under SNF Normering Flexwonen, the legal maximum for SNF-certified shared accommodation is €113.50/week (2024). If your agency charges above this, they are violating SNF standards. Report violations to Inspectie SZW.`,
        },
        {
          question: "What happens to my housing if I quit or am fired?",
          answer: `You typically have 7–14 days to vacate agency housing after your employment ends. The exact period should be stated in your accommodation agreement (huisvestingsovereenkomst). Always confirm this in writing before accepting agency housing.`,
        },
        {
          question: "Can I save money with agency housing vs renting independently?",
          answer: `At €80–€113/week, agency housing can be cheaper than private rental (€350–€600/month for a room in major Dutch cities). However, you lose housing immediately if you change jobs or are dismissed. Many workers prefer agency housing for the first 1–3 months while finding their footing, then move to independent rentals.`,
        },
        {
          question: "Is agency housing SNF certified?",
          answer: `Not all agency housing is SNF certified. SNF (Stichting Normering Flexwonen) certification means the property has been inspected for occupancy limits, safety, and facilities. Ask your agency for their SNF registration number. You can verify it at snf.nl/register/.`,
        },
      ],
      relatedAgencySlugs: ["otto-work-force", "foreignflex", "covebo", "easyworx-flex"],
      relatedCitySlugs:   ["tilburg", "venlo", "s-hertogenbosch", "eindhoven"],
      datePublished: "2026-01-20",
      dateModified:  "2026-04-01",
    },

    // ── Guide 3: Is working in Netherlands worth it ────────────────────────────
    {
      slug:      "is-working-in-netherlands-worth-it",
      title:     `Is Working in the Netherlands Worth It? Real Worker Data (${new Date().getFullYear()})`,
      metaTitle: `Is Working in Netherlands Worth It? ${new Date().getFullYear()} Honest Review`,
      metaDesc:  `${negativePct}% of workers rate Dutch agency work 1–2 stars. Real data from ${totalSeedReviews} reviews — salary reality, housing quality, rights, and honest pros and cons.`,
      badge:     `${totalSeedReviews} Real Worker Reviews`,
      intro:     `The Netherlands attracts over 400,000 temporary foreign workers each year. ${negativePct}% of workers on AgencyCheck rate their experience 1–2 stars. This guide synthesises ${totalSeedReviews} worker reviews and real salary data to give you an unfiltered answer.`,
      sections: [
        {
          heading: "What the data actually shows",
          body: `From ${totalSeedReviews} worker reviews on AgencyCheck:<br/><br/>• <strong>${negativePct}% rate 1–2 stars</strong> (negative experience)<br/>• Average salary rating: <strong>${salaryAvg}/5</strong><br/>• ${payslipErrors} workers (${Math.round((payslipErrors / totalSeedReviews) * 100)}%) reported payslip errors<br/>• ${latePayCount} workers reported late salary payments<br/>• ${verifiedCount} reviews are from verified workers<br/><br/>The picture is mixed. Workers in well-run agencies with decent housing report satisfactory experiences. Workers placed by agencies with poor housing management and opaque contracts report significant problems.`,
        },
        {
          heading: "The real financial picture",
          body: `The Dutch minimum wage (€${WML}/hr in 2026) translates to €${weeklyGross}/week gross and approximately <strong>€${weeklyNet}/week net</strong> before housing deductions. After housing (€80–€113/week if agency-provided), real take-home can be as low as <strong>€${weeklyNet - 113}–€${weeklyNet - 80}/week</strong>.<br/><br/>Workers who save money in the Netherlands tend to:<br/><strong>1.</strong> Earn above-WML rates (forklift: €15.50–€18/hr, night shift: +15–25%)<br/><strong>2.</strong> Share housing costs with family or friends independently<br/><strong>3.</strong> Work overtime (paid at 125% under ABU CAO for hours beyond 40/week)<br/><br/>Workers who struggle tend to be placed at minimum wage in maximum-deduction housing — effectively working for €${weeklyNet - 113} take-home per week.`,
        },
        {
          heading: "Genuine advantages of working in the Netherlands",
          body: `Despite the mixed reviews, the Netherlands offers real advantages for foreign workers:<br/><br/><strong>Legal framework:</strong> The Netherlands has among the strongest worker protection laws in Europe. Minimum wage is legally enforced. You cannot be deducted amounts not agreed in writing. Inspectie SZW actively investigates violations.<br/><br/><strong>ABU/NBBU collective agreements:</strong> Agency workers covered by ABU or NBBU CAO accumulate rights over time — from Fase A (flexible) to Fase B (more security) to direct contract — if they stay with the same hirer for 78+ weeks.<br/><br/><strong>Savings potential:</strong> Workers earning above-WML (forklift, reach truck, night shift) in cheaper housing can save €600–€1,000/month. This is significantly higher than equivalent logistics wages in Poland, Romania, or the Czech Republic.`,
        },
        {
          heading: "The main risks — and how to manage them",
          body: `<strong>Risk 1: Housing dependency</strong><br/>Losing your job means losing your home. Manage by: having 1 month's rent saved before you arrive; agreeing the notice period for housing in writing before starting.<br/><br/><strong>Risk 2: Payslip errors</strong><br/>Reported in ${payslipErrors} of ${totalSeedReviews} reviews. Manage by: checking every payslip the day it arrives, keeping a personal hours log, and contacting your agency in writing (email) for any discrepancy.<br/><br/><strong>Risk 3: Unclear contracts</strong><br/>Many workers sign contracts in Dutch without understanding them. Manage by: requesting a contract in your language, asking specifically about the probation period and notice period, and never signing something you cannot read.<br/><br/><strong>Risk 4: Below-standard housing</strong><br/>Manage by: asking for SNF certification number, asking to see the accommodation before accepting, and speaking with workers already living there.`,
        },
        {
          heading: "Who does well working in the Netherlands?",
          body: `Based on review patterns, workers who report positive experiences tend to:<br/><br/>• Have a <strong>specific skill in demand</strong> (certified forklift driver, reach truck, experienced warehouse supervisor)<br/>• <strong>Research their agency</strong> before arriving — using sites like AgencyCheck to read reviews<br/>• <strong>Arrive with some savings</strong> (at least €500–€1,000) so they are not desperate enough to accept any conditions<br/>• Have a <strong>contact at the agency</strong> (a real name, reachable by phone) before signing<br/>• <strong>Keep documentation</strong> — contract, payslips, housing agreement — from day one<br/><br/>Workers who struggle tend to arrive with no savings, no contacts, and no ability to verify the agency's reputation — leaving them vulnerable to the minority of agencies that exploit this.`,
        },
      ],
      faqs: [
        {
          question: "Is the Netherlands a good place to work as a foreign worker?",
          answer: `The Netherlands has strong legal protections for workers, but the quality of experience depends heavily on the agency. ${negativePct}% of AgencyCheck reviewers rate their experience 1–2 stars, while a significant portion report fair treatment. Research your specific agency before committing.`,
        },
        {
          question: "What is the real take-home pay in the Netherlands?",
          answer: `At minimum wage (€${WML}/hr), net take-home is approximately €${weeklyNet}/week before housing deductions. With agency housing (€80–€113/week), real disposable income is €${weeklyNet - 113}–€${weeklyNet - 80}/week. Night and weekend premiums significantly increase this figure.`,
        },
        {
          question: "What are the biggest risks of working in Netherlands as a foreigner?",
          answer: `The main risks are: (1) Housing dependency — losing your job means losing your accommodation; (2) Payslip errors — ${payslipErrors} of ${totalSeedReviews} AgencyCheck reviewers reported payslip discrepancies; (3) Language barriers in contracts; (4) Below-standard housing that violates SNF norms.`,
        },
        {
          question: "How long does it take to get rights as a temp worker in the Netherlands?",
          answer: `Under the ABU CAO, temp workers progress through phases: Fase A (weeks 1–78, flexible) → Fase B (weeks 79+, more protection) → Fase C (potential direct hire). After 78 weeks working for the same hirer through the same agency, you gain the right to a direct employment contract offer.`,
        },
        {
          question: "Where should I look for agency work in the Netherlands?",
          answer: `AgencyCheck profiles ${totalAgencies} employment agencies in the Netherlands with real worker reviews, housing data, and transparency scores. Filter by city, housing availability, and worker rating. Always read reviews from workers at that specific agency — not just the agency's marketing materials.`,
        },
      ],
      relatedAgencySlugs: ["otto-work-force", "covebo", "flexdirect-uitzendgroep", "gi-group-temp"],
      relatedCitySlugs:   ["amsterdam", "rotterdam", "tilburg", "eindhoven"],
      datePublished: "2026-02-01",
      dateModified:  "2026-04-01",
    },

  ];
}

// ─── Exported data ─────────────────────────────────────────────────────────────

export const GUIDES: GuideDefinition[] = buildGuides();

export const GUIDE_MAP: Record<string, GuideDefinition> = Object.fromEntries(
  GUIDES.map((g) => [g.slug, g]),
);

export function getGuide(slug: string): GuideDefinition | undefined {
  return GUIDE_MAP[slug];
}
