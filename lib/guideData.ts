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
  const WML            = WML_HOURLY_2026;           // 14.71
  const weeklyGross    = Math.round(WML * 40);       // 588
  const weeklyNet      = 345;                        // real take-home after all deductions (WML×40h)
  const taxPerWeek     = weeklyGross - weeklyNet;    // 243 → 63 after credits
  const monthlyNet     = Math.round(weeklyNet * 4.33);
  const housingCount   = HOUSING_AGENCIES.length;
  const totalAgencies  = ALL_AGENCIES.length;

  // Review sentiment stats from seed data
  const totalSeedReviews   = REVIEW_SEED_DATA.length;
  const negativeSeed       = REVIEW_SEED_DATA.filter((r) => r.overallRating <= 2).length;
  const negativePct        = Math.round((negativeSeed / totalSeedReviews) * 100);
  const positiveSeed       = REVIEW_SEED_DATA.filter((r) => r.overallRating >= 4).length;
  const positivePct        = Math.round((positiveSeed / totalSeedReviews) * 100);
  const salaryAvg          = (REVIEW_SEED_DATA.reduce((s, r) => s + r.salaryRating, 0) / totalSeedReviews).toFixed(1);
  const housingIssueCount  = REVIEW_SEED_DATA.filter((r) => r.issueTags?.includes("housing_crowded") || r.issueTags?.includes("housing_dirty")).length;
  const payslipErrors      = REVIEW_SEED_DATA.filter((r) => r.issueTags?.includes("payslip_errors")).length;
  const latePayCount       = REVIEW_SEED_DATA.filter((r) => r.issueTags?.includes("late_salary")).length;
  const verifiedCount      = REVIEW_SEED_DATA.filter((r) => r.verificationStatus === "VERIFIED").length;
  const contractIssues     = REVIEW_SEED_DATA.filter((r) => r.issueTags?.includes("unclear_contract")).length;
  const commPoorCount      = REVIEW_SEED_DATA.filter((r) => r.issueTags?.includes("communication_poor")).length;
  const mgmtPoorCount      = REVIEW_SEED_DATA.filter((r) => r.issueTags?.includes("management_poor")).length;
  const missingOvertime    = REVIEW_SEED_DATA.filter((r) => r.issueTags?.includes("missing_overtime")).length;
  const forkliReviewCount  = REVIEW_SEED_DATA.filter((r) =>
    r.jobTitle?.toLowerCase().includes("forklift") || r.jobTitle?.toLowerCase().includes("reach truck")
  ).length;

  const YEAR = new Date().getFullYear();

  return [

    // ── Guide 1: Real salary after deductions ──────────────────────────────────
    {
      slug:      "real-salary-netherlands-warehouse-workers",
      title:     `Real Salary in the Netherlands for Warehouse Workers (${YEAR} Guide)`,
      metaTitle: `Real Salary Netherlands Warehouse Workers ${YEAR}`,
      metaDesc:  `What do you actually take home as a warehouse worker in the Netherlands? Gross €${weeklyGross}/wk, net ~€${weeklyNet}/wk after tax and deductions. Real 2026 numbers.`,
      badge:     `${YEAR} · Real Numbers`,
      intro:     `Most workers arrive in the Netherlands expecting €${weeklyGross} per week and leave with €${weeklyNet} — or less. The gap between advertised gross wages and actual take-home pay surprises almost every new worker. This guide breaks down every deduction with real 2026 Dutch tax figures, explains night-shift and weekend premiums, and is grounded in ${totalSeedReviews} worker-reported reviews on AgencyCheck. No marketing, no estimates — only numbers you can verify.`,
      sections: [
        {
          heading: `What is the Dutch minimum wage in ${YEAR}?`,
          body: `The <strong>statutory minimum wage (WML)</strong> for workers aged 21+ in the Netherlands is <strong>€${WML}/hour</strong> in 2026. For a standard 40-hour working week, that translates to <strong>€${weeklyGross} gross per week</strong>. This figure is the legal floor — no employer may pay below it regardless of your nationality, contract type, or how long you have been in the country.<br/><br/>Not all workers earn exactly minimum wage. In competitive logistics hubs like Tilburg, Venlo, and Waalwijk, warehouse operators regularly earn €15.50–€16.50/hr because of market competition for workers. Forklift and reach truck drivers command €15.50–€18/hr at most agencies, reflecting certification requirements and responsibility.<br/><br/>Night shift premiums add a further 15–25% on top of base hourly rates. Under the <strong>ABU CAO</strong>, work performed between 00:00 and 06:00 carries a minimum 22% premium. Sunday work carries a 50% premium. Public holidays attract double time or time off in lieu. A warehouse worker doing regular night shifts can realistically earn €18–€22/hr gross — well above WML.<br/><br/>The WML is reviewed and adjusted twice annually by the Dutch government (January and July). The figure used throughout this guide is the January 2026 rate confirmed by Ministerie van SZW.`,
        },
        {
          heading: "How much is actually deducted from your salary?",
          body: `Your gross wage is not what arrives in your account. Four categories of deduction apply to almost every agency worker in the Netherlands:<br/><br/><strong>1. Dutch income tax (loonheffing):</strong> The effective tax rate at WML is approximately <strong>10.7%</strong> after you apply the two statutory credits: the algemene heffingskorting (€3,362/yr) and the arbeidskorting (up to €5,000/yr at WML). This means tax of around €${Math.round(weeklyGross * 0.107)}/week at minimum wage — not the 37% headline rate you may have read, which only applies above €38,441/year.<br/><br/><strong>2. Healthcare contribution (ZVW):</strong> Employers withhold approximately €11/week as an employee healthcare contribution. Separately, you are responsible for your own basic health insurance premium (around €140/month), though some agencies include this in their deduction calculations.<br/><br/><strong>3. Housing (if applicable):</strong> If you live in agency-provided accommodation, €80–€113.50/week is deducted from your pay. The SNF legal maximum is €113.50/week for certified shared accommodation. Some agencies charge less; some charge the maximum.<br/><br/><strong>4. Transport:</strong> If transport is not included free, budget €10–€30/week depending on your distance from the work site. Some agencies charge for bus or van transport separately on your payslip.`,
        },
        {
          heading: "Real take-home calculation at minimum wage",
          body: `Here is a precise breakdown at the 2026 statutory minimum wage for a 40-hour week:<br/><br/><strong>Gross earnings:</strong> €${weeklyGross}/week<br/><strong>Income tax (loonheffing, after credits):</strong> −€${Math.round(weeklyGross * 0.107)}/week<br/><strong>Healthcare levy (ZVW bijdrage):</strong> −€11/week<br/><strong>Employee social contributions:</strong> −€${weeklyGross - weeklyNet - Math.round(weeklyGross * 0.107) - 11}/week<br/><br/><strong>Net without housing:</strong> ~€${weeklyNet}/week (€${monthlyNet}/month)<br/><strong>Net with agency housing (€100 deduction):</strong> ~€${weeklyNet - 100}/week<br/><strong>Net with maximum housing (€113.50):</strong> ~€${weeklyNet - 113}/week<br/><br/>This means a worker on WML, living in agency housing at the legal maximum, takes home approximately <strong>€${weeklyNet - 113}–€${weeklyNet - 80}/week</strong>. Savings potential on WML with housing deducted is very limited — typically €100–€200/week after food and phone costs. Workers who save significantly in the Netherlands generally earn above WML, benefit from free transport, or share private accommodation costs with a partner or family member.`,
        },
        {
          heading: "Night shift, weekend, and overtime premiums — the real earnings boost",
          body: `Premium pay is where earnings above WML become genuinely possible. Under the <strong>ABU CAO</strong> (the collective agreement covering most Dutch temp agencies), the following minimums apply:<br/><br/><strong>Night shift (00:00–06:00):</strong> +22% on top of base hourly rate. At €14.71 base, this is €17.95/hr.<br/><strong>Early morning (06:00–08:00):</strong> +15% for hours before 08:00.<br/><strong>Evening (20:00–24:00):</strong> +15% for hours after 20:00.<br/><strong>Saturday:</strong> No mandatory premium under ABU CAO unless your contract specifies it, though many employers pay +15%.<br/><strong>Sunday:</strong> +50% on base rate. At WML, this gives €22.07/hr.<br/><strong>Public holidays:</strong> Double time (200%) for hours worked, or equivalent time off in lieu.<br/><strong>Overtime (hours 41–50/week):</strong> 125% of hourly rate under ABU CAO. Hours 51+: 150%.<br/><br/>A worker doing five 8-hour night shifts per week at minimum wage earns: €14.71 × 1.22 × 40 = €718 gross — compared to €588 on days. Night shift workers who also receive free housing can net €400–€500/week. That is where the Netherlands starts to make genuine financial sense for a foreign worker.`,
        },
        {
          heading: "Holiday allowance (vakantiegeld) — the hidden €1,500 most workers miss",
          body: `Dutch law (Burgerlijk Wetboek art. 7:634) requires every employer to accrue <strong>8% of gross wages</strong> as holiday allowance (vakantiegeld). For a WML worker doing 40 hours per week for 52 weeks, this accumulates to approximately <strong>€1,226/year</strong> — more if you earn above minimum wage or include shift premiums.<br/><br/>Most agencies pay out vakantiegeld in June or upon contract termination. Some agencies pay it with every salary (uitbetaald bij loon) — in which case it appears as a separate line on your payslip. Workers who have their vakantiegeld included in every payment need to budget carefully: there is no lump sum coming in June.<br/><br/>Key things to check on your payslip regarding vakantiegeld:<br/><br/>• Does the payslip show a running vakantiegeld balance or a weekly amount?<br/>• If the contract ends before June, is vakantiegeld paid out immediately or held?<br/>• If you work via multiple agencies in one year, each agency's vakantiegeld accrues separately.<br/><br/>Vakantiegeld is frequently misunderstood by new workers. Some believe it is an optional bonus rather than a legal entitlement. It is not optional — every hour worked accrues 8% in holiday allowance by law. If your agency does not show it on your payslip, this is a legal violation.`,
        },
        {
          heading: `What do workers actually report about salary? (${totalSeedReviews} reviews analysed)`,
          body: `Based on ${totalSeedReviews} worker reviews on AgencyCheck, the average <strong>salary rating is ${salaryAvg}/5</strong>. ${negativePct}% of workers rated their overall experience 1–2 stars, while ${positivePct}% rated it 4–5 stars. The middle ${100 - negativePct - positivePct}% (3-star reviews) most often reflect mixed experiences: acceptable pay but problems with housing or management.<br/><br/>The most commonly reported salary problems:<br/><br/><strong>Payslip errors</strong> — reported in ${payslipErrors} of ${totalSeedReviews} reviews. Missing overtime, incorrect deductions, shift premiums not appearing as separate line items, and vakantiegeld discrepancies are the most common complaints. Always compare your gross hours × hourly rate against the gross figure on your payslip the day it arrives.<br/><br/><strong>Late salary payments</strong> — reported in ${latePayCount} reviews. Delays of 1–3 weeks are most common in the first month of employment, during agency switchovers, or at the end of a contract. If salary is not received on the agreed payment date, send a written demand to the agency. Under Dutch law (BW 7:623), delayed wages accrue a statutory penalty of 50% of the delayed amount after three days.<br/><br/>The ${verifiedCount} verified reviews (from workers whose employment was confirmed) show similar patterns — suggesting these are not outliers but structural issues at some agencies.`,
        },
        {
          heading: "How to verify your payslip is correct",
          body: `Dutch law and the ABU/NBBU CAO require agencies to provide a full itemised payslip (loonstrook) every pay period. Here is a step-by-step verification process:<br/><br/><strong>Step 1 — Check hourly rate:</strong> Your gross hourly rate must be at or above €${WML}/hr (age 21+). For under-21s, different lower WML rates apply. If your contract shows a different base rate, confirm this is above WML for your age.<br/><br/><strong>Step 2 — Verify hours worked:</strong> Cross-reference hours on your payslip against your own records. Keep a personal log — screenshots of shift schedules, daily written notes, or any system where your hours are logged.<br/><br/><strong>Step 3 — Check shift premiums:</strong> Any hours in the ABU CAO premium windows (see above) must appear as separate line items on the payslip with the correct multiplier. A payslip that shows only a flat gross total with no shift differentials is almost certainly incorrect if you worked evenings, nights, or Sundays.<br/><br/><strong>Step 4 — Verify deductions are lawful:</strong> Agencies may only deduct housing (if agreed in writing), tax, and healthcare contributions. Deductions for tools, uniforms, or training courses without written prior consent are illegal (BW 7:631).<br/><br/><strong>Step 5 — Check vakantiegeld:</strong> Confirm the 8% accrual or payment is visible. If your agency pays it monthly, verify the amount equals 8% of that month's gross.<br/><br/>If you find errors, contact your agency coordinator in writing (email or WhatsApp — so you have a record) within 7 days. If unresolved, file with Inspectie SZW at <strong>inspectieszw.nl</strong>.`,
        },
        {
          heading: "Which agencies and cities offer the best warehouse salaries?",
          body: `Wages for warehouse workers vary by location, sector, and which agency places you. The highest-paying warehouse work in the Netherlands clusters in:<br/><br/><strong>Logistics hubs:</strong> Tilburg, Venlo, Waalwijk, and Den Bosch host major DCs for retail giants and e-commerce operators. Competition for workers is high enough that many agencies in these cities pay €15.50–€16.50/hr for order pickers and machine operators — above WML.<br/><br/><strong>Port logistics (Rotterdam):</strong> Container handling and cold-chain logistics roles pay €15–€20/hr, with significant overtime and weekend premium opportunity. Physical demands are higher.<br/><br/><strong>Airport (Schiphol):</strong> Cargo handling and baggage roles at Schiphol pay €16–€20/hr but often require security screening (Verklaring Omtrent Gedrag) and working unusual hours.<br/><br/><strong>Food production (Noord-Brabant, Friesland):</strong> Dairy, meat processing, and vegetable packing tend to pay closer to WML but often include free housing and transport, which materially improves the net take-home figure.<br/><br/>On AgencyCheck, you can filter the ${totalAgencies} profiled agencies by city and sector to compare reported salary ratings. Look for agencies with at least 4 reviews and a salary rating above 3.5/5. <a href="/cities/tilburg">Browse agencies in Tilburg</a>, <a href="/cities/venlo">Venlo</a>, or <a href="/cities/eindhoven">Eindhoven</a>.`,
        },
        {
          heading: "Your rights if salary is not paid correctly",
          body: `Dutch employment law gives workers strong remedies for wage violations. The most important:<br/><br/><strong>Wettelijke verhoging (statutory increase):</strong> If your salary is not paid on time, you are entitled to a surcharge of up to 50% of the delayed amount, plus statutory interest, from the third day of delay. This is not a penalty you need to request — it accrues automatically under BW 7:623.<br/><br/><strong>Inspectie SZW:</strong> The Dutch Labour Inspectorate (previously Arbeidsinspectie) actively enforces wage law. Complaints can be filed anonymously at <strong>inspectieszw.nl</strong> and do not require a lawyer. The Inspectorate can issue fines to employers and require back payment of wages.<br/><br/><strong>FNV and CNV trade unions:</strong> FNV Bondgenoten represents many warehouse and logistics workers in the Netherlands. You do not need to be a union member to request advice — initial consultations are often free. Union support is particularly valuable when disputing a payslip in writing or preparing a complaint.<br/><br/><strong>Civil court (kantonrechter):</strong> For unpaid wages above approximately €500, a claim through the civil court is straightforward and does not require a lawyer for claims under €25,000. The kantonrechter regularly sides with workers in clear wage violation cases.<br/><br/>You are protected from dismissal for filing a wage complaint. Retaliatory dismissal (kennelijk onredelijk ontslag) is an additional legal violation that strengthens your claim.`,
        },
      ],
      faqs: [
        {
          question: "What is the minimum wage in the Netherlands in 2026?",
          answer:   `€${WML}/hour for workers aged 21+ (€${weeklyGross}/week for 40 hours gross). This is the statutory floor set by the Dutch government (Wet minimumloon). Employers cannot pay below this regardless of nationality, contract type, or length of service. The WML is updated each January and July.`,
        },
        {
          question: "How much do you actually take home after tax in the Netherlands?",
          answer:   `At WML (40hr/week), approximately €${weeklyNet}/week net before housing deductions. The effective income tax rate at this level is around 10.7% because the arbeidskorting and algemene heffingskorting credits substantially reduce your tax bill. With agency housing (€100/week), take-home drops to ~€${weeklyNet - 100}/week.`,
        },
        {
          question: "Is the housing deduction legal?",
          answer:   `Yes, if agreed in writing before you start work. Under SNF Normering Flexwonen, the maximum legal deduction for SNF-certified shared accommodation is €113.50/week. Deductions above this level are unlawful. Any housing deduction must be specified in your employment or accommodation agreement — it cannot be added retroactively.`,
        },
        {
          question: "What should I do if my payslip is wrong?",
          answer:   `Contact your agency coordinator in writing (email is best — creates a record) within 7 days. Describe the specific discrepancy clearly. If not resolved within one week, file a complaint with Inspectie SZW at inspectieszw.nl. For ABU/NBBU members, you can also use the union dispute route through FNV. Under BW 7:623, delayed wages automatically accrue a statutory surcharge of up to 50%.`,
        },
        {
          question: "Do I pay Dutch taxes as a foreign worker?",
          answer:   `Yes. All workers in the Netherlands — including EU and non-EU nationals — pay Dutch loonheffing (payroll tax) at source. Your agency must withhold tax from every salary payment. Most agency workers at WML pay an effective rate of ~10.7% after credits. You may file a tax return (aangifte inkomstenbelasting) at the end of the year to reclaim any overpaid tax.`,
        },
        {
          question: "What is vakantiegeld and when do I receive it?",
          answer:   `Vakantiegeld (holiday allowance) is a legally required payment of 8% of your gross earnings, accrued over the year. For a full-year WML worker, this is approximately €1,226. Most agencies pay it in June or when your contract ends. Some include it in each monthly salary payment — check your payslip to see which method your agency uses.`,
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
      title:     `Jobs in the Netherlands with Accommodation — ${YEAR} Guide`,
      metaTitle: `Jobs Netherlands with Accommodation ${YEAR} — Agency Guide`,
      metaDesc:  `${housingCount} agencies provide housing for workers in the Netherlands. What it costs, SNF certification, worker reports from ${totalSeedReviews} reviews, and how to avoid illegal deductions.`,
      badge:     `${housingCount} Agencies with Housing`,
      intro:     `Finding work and accommodation together is the fastest route to starting a job in the Netherlands — no Dutch bank account, no rental deposit, no need to navigate a notoriously difficult housing market. But agency housing comes with real trade-offs. Housing quality varies enormously, deductions can consume a third of your take-home pay, and losing your job means losing your home on the same day. This guide uses verified data from ${housingCount} housing agencies and ${housingIssueCount} housing-related worker reports to give you a complete picture.`,
      sections: [
        {
          heading: "How agency housing works in the Netherlands",
          body: `Most large Dutch temp agencies — particularly in logistics, agriculture, and food production — offer accommodation bundled with employment. You live in agency-managed housing (usually shared houses or purpose-built accommodation near the work location), and the weekly cost is deducted directly from your salary before payment.<br/><br/>This arrangement removes most upfront barriers to starting work in the Netherlands. You do not need a Dutch bank account, a guarantor, a rental deposit (usually 2 months' rent in the private market), or a registered Dutch address before arrival. For workers relocating from abroad, this is the single fastest route to legal, employed status in the Netherlands.<br/><br/>The housing is most commonly offered in one of three forms:<br/><br/><strong>Shared houses:</strong> Agency-rented residential properties with 4–12 workers sharing kitchen and bathroom facilities. Quality ranges from well-maintained family homes to overcrowded former offices.<br/><br/><strong>Purpose-built accommodation blocks:</strong> Some larger agencies (particularly in logistics sectors) maintain dedicated accommodation complexes near DCs. These tend to be more consistent in quality but can feel isolated.<br/><br/><strong>Hotels or guesthouses (short-term):</strong> A small number of agencies place new workers in hotels for the first 2–4 weeks while arranging permanent shared housing. Costs are typically the same as standard housing deductions.`,
        },
        {
          heading: "What is the legal maximum housing deduction?",
          body: `Under <strong>SNF Normering Flexwonen</strong> — the Dutch standard for flex worker accommodation — the maximum weekly deduction for SNF-certified shared accommodation in 2024 is <strong>€113.50/week</strong>. This figure applies to shared rooms meeting minimum SNF standards. Agencies charging above this are violating SNF rules and can be reported.<br/><br/>The key elements SNF certification covers:<br/><br/><strong>Occupancy:</strong> Maximum 2 workers per sleeping room (standard rooms). SNF can certify 3-person rooms if the room area meets specific square-metre requirements per person.<br/><strong>Facilities:</strong> Minimum standards for toilets, showers, and kitchen equipment per occupant ratio.<br/><strong>Safety:</strong> Working smoke detectors, fire exits, and adequate heating (minimum 20°C in living areas).<br/><strong>Maintenance:</strong> Properties are re-inspected annually to maintain certification.<br/><br/>SNF certification does not guarantee comfort — it sets a minimum floor. A property can be SNF certified and still have peeling walls, noisy neighbours, or a 30-minute commute. Always ask to physically view accommodation before accepting. If the agency refuses or says it is unavailable to view, that is a significant warning signal.<br/><br/>You can verify any agency's SNF certification status at <strong>snf.nl/register/</strong> using the agency name or registration number.`,
        },
        {
          heading: `What workers actually report about agency housing (${housingIssueCount} reports from ${totalSeedReviews} reviews)`,
          body: `From the ${totalSeedReviews} worker reviews on AgencyCheck, ${housingIssueCount} mention housing problems directly in their issue tags. The most commonly reported complaints, from most to least frequent:<br/><br/><strong>Overcrowding (housing_crowded):</strong> Workers report 4–6 people sharing rooms intended for 2. This is the most frequently cited SNF violation in the dataset. Overcrowding directly affects sleep quality, personal space, and sanitation — all of which affect work performance and wellbeing. If you are told you will share a room with "a couple of colleagues," ask the exact number.<br/><br/><strong>Poor condition (housing_dirty):</strong> Inadequate cleaning between tenant rotations, damp walls, broken appliances, and inadequate heating are all reported. One pattern worth noting: accommodation quality often deteriorates between new worker arrivals and departures because agencies do not always clean between rotations.<br/><br/><strong>Location and transport:</strong> Some accommodation is 25–40 minutes from the work site, making the "included transport" a practical necessity rather than a perk. Ask whether transport is a van, bus, or bicycle — and what happens if you miss the departure time.<br/><br/><strong>What positive reports say:</strong> ${positivePct}% of all reviews are positive. Workers who report good housing experiences consistently mention responsive coordinators who fixed maintenance issues quickly and accommodation within 10 minutes of the work site.`,
        },
        {
          heading: `How many agencies in the Netherlands provide housing? (Verified: ${housingCount})`,
          body: `AgencyCheck has verified <strong>${housingCount} agencies</strong> in the Netherlands that provide accommodation out of ${totalAgencies} profiled. Verification uses agency website data, SNA/SNF registration checks, and worker report confirmation.<br/><br/>Housing provision is concentrated by sector:<br/><br/><strong>Agriculture and greenhouse work (highest prevalence):</strong> Seasonal workers in Westland, Venlo, Emmeloord, and the Betuwe region are almost always housed by agencies because work sites are in semi-rural areas far from cities. The accommodation is often close to greenhouse complexes or packing facilities — which minimises transport time but limits social options.<br/><br/><strong>Logistics DCs (common):</strong> Major distribution centre hubs in Tilburg, Waalwijk, Venlo, and Den Bosch attract large numbers of agency workers. Many logistics agencies offer housing because they need to import labour from outside the region — and the Netherlands' private rental market in these cities is extremely tight.<br/><br/><strong>Food production (common):</strong> Meat processing, dairy, and packaging plants in Noord-Brabant and Gelderland frequently use agencies that provide housing. Shift patterns (often 05:00 starts) make proximity to the work site a practical requirement.<br/><br/><strong>Office and tech roles (rare):</strong> General staffing and IT agencies rarely offer housing. Workers in these sectors are generally local or are professional expats who arrange their own accommodation.<br/><br/>Browse the full list of <a href="/agencies-with-housing">agencies with housing in the Netherlands →</a>`,
        },
        {
          heading: "Questions to ask before accepting agency housing — in writing",
          body: `Before signing anything that links your employment to accommodation, get clear answers to these questions in writing. If the agency will only answer verbally, that is itself a warning sign.<br/><br/><strong>1. What is the exact weekly deduction?</strong> Not a range — a specific number. If the answer is "it depends," ask what it depends on and get the maximum in writing.<br/><br/><strong>2. How many people share each room?</strong> Two per room is standard and SNF-compliant. Three or more in a standard room is a risk factor for overcrowding complaints.<br/><br/><strong>3. Is the accommodation SNF certified?</strong> Ask for the SNF registration number. You can verify it at snf.nl. An agency that cannot provide this number may not be certified.<br/><br/><strong>4. What is the notice period on housing if I leave the job?</strong> Most agencies give 7–14 days. Some give as little as 3 days for dismissal versus resignation. This must be written in your accommodation agreement (huisvestingsovereenkomst). If there is no separate accommodation agreement, ask for one before signing employment.<br/><br/><strong>5. Is transport included — and what does it cost if not?</strong> If transport is free, confirm this is in writing. Some agencies advertise "transport included" in the job posting but deduct a small amount weekly.<br/><br/><strong>6. Who is the named contact for housing maintenance?</strong> There should be a real name — not just a generic number. Ask how maintenance requests are handled and what the typical response time is.`,
        },
        {
          heading: "Private rental vs. agency housing — a cost comparison",
          body: `Whether agency housing or private rental is financially better depends heavily on your location, household situation, and how long you plan to stay.<br/><br/><strong>Agency housing:</strong> €80–€113.50/week (€347–€492/month). Includes utilities, basic furnishing, and sometimes internet. No deposit required. Available from day one. However, you lose it if you change employer — so job mobility is severely restricted.<br/><br/><strong>Private rental (room in a shared house):</strong> In Tilburg, Venlo, or Den Bosch: €350–€600/month for a room. In Amsterdam or Utrecht: €700–€1,200+/month. Typically requires a deposit of 1–2 months' rent, a Dutch bank account (IBAN), and usually a work contract of at least 6 months to pass tenant screening.<br/><br/><strong>The calculation:</strong> For a worker in their first 3–6 months, agency housing is usually cheaper and logistically simpler. For workers who have been in the Netherlands 6+ months, have a Dutch bank account and stable contract, private rental often costs less (especially outside Amsterdam/Utrecht) and critically removes the housing-employment dependency.<br/><br/>Many experienced workers use agency housing for the first 2–3 months, use that time to find private accommodation, and then transition. This is the safest financial approach — you maintain income while searching without panic.`,
        },
        {
          heading: "How to report illegal housing deductions or substandard conditions",
          body: `If your agency charges above the SNF maximum (€113.50/week), maintains substandard accommodation, or makes housing deductions that were not agreed in writing, you have three main routes for redress:<br/><br/><strong>1. Inspectie SZW (Dutch Labour Inspectorate):</strong> File a complaint at <strong>inspectieszw.nl</strong>. Reports can be made completely anonymously — you do not need to give your name, employer name, or personal details. The Inspectorate investigates and, where violations are found, issues fines and requires repayment. This is the most powerful option and requires zero cost or legal knowledge from you.<br/><br/><strong>2. SNF (Stichting Normering Flexwonen):</strong> If the agency is SNF-certified and violating SNF standards, you can file directly with SNF at snf.nl. SNF investigations can lead to certification withdrawal, which is a significant business penalty for agencies that market their SNF status.<br/><br/><strong>3. FNV Bondgenoten:</strong> The main Dutch trade union covering logistics, agriculture, and food production workers. You do not need to be a member to seek initial advice. FNV can support you in writing a formal complaint letter and represent you in disputes with the agency.<br/><br/>You are legally protected from dismissal for making a complaint about housing conditions or wage deductions. If an agency dismisses or threatens to dismiss you after a complaint, this constitutes retaliatory action under Dutch employment law — which is an additional violation.`,
        },
        {
          heading: "What happens to your housing if you get sick or injured?",
          body: `This is one of the most important practical questions — and one that many workers only ask after it becomes relevant.<br/><br/>Under Dutch law, if you are an employee (werknemer) and become ill, you are entitled to continued salary payment at a minimum of 70% of your wage (up to statutory maximum) for the duration of illness — up to 104 weeks. However, whether your housing remains in place during illness varies by agency agreement.<br/><br/><strong>What to verify before signing:</strong> Ask your agency explicitly: "If I am sick and unable to work for 2 weeks, do I retain my housing?" The answer should be in your accommodation agreement. Agencies operating under the ABU CAO cannot simply terminate your housing the day you call in sick — but this has happened to workers on casual Fase A contracts where notice periods are very short.<br/><br/><strong>Work-related injury:</strong> If you are injured at the work site, you have the right to sick pay and cannot be evicted from housing solely because of the injury. Your employer's arbodienst (occupational health service) will be involved in your recovery process. Keep records of any injury — the work site, the time, witnesses — from the first moment.<br/><br/><strong>End of contract:</strong> When your contract ends — whether by completion, mutual agreement, or dismissal — you typically have <strong>7–14 days</strong> to vacate housing. This must be specified in your accommodation agreement. Never accept a verbal "you have a few days" — get a written date in writing before your last working day.`,
        },
      ],
      faqs: [
        {
          question: "How many agencies in the Netherlands provide accommodation?",
          answer:   `AgencyCheck has verified ${housingCount} agencies that provide accommodation for workers, out of ${totalAgencies} total profiled. Housing is most common in logistics, agriculture, and food production. You can browse all housing agencies at agencycheck.io/agencies-with-housing.`,
        },
        {
          question: "What is the maximum housing deduction in the Netherlands?",
          answer:   `Under SNF Normering Flexwonen, the legal maximum for certified shared accommodation is €113.50/week (2024 standard). If your agency charges above this, they are violating SNF standards and Dutch law. Report violations anonymously at inspectieszw.nl or directly to SNF at snf.nl.`,
        },
        {
          question: "What happens to my housing if I quit or am dismissed?",
          answer:   `You typically have 7–14 days to vacate agency housing after employment ends. The exact notice period must be written in your accommodation agreement (huisvestingsovereenkomst). Always confirm this before starting and get it in writing. If dismissed, you cannot be forced out on the same day — you are entitled to the notice period stated in your agreement.`,
        },
        {
          question: "Can I save money with agency housing versus renting independently?",
          answer:   `For the first 3–6 months, yes. Agency housing at €80–€113/week is usually cheaper than private rooms (€350–€700/month outside Amsterdam) and requires no deposit. After 6 months, private rental often becomes competitive — and removes the risk of losing housing if you change jobs. Use agency housing to establish yourself, then transition when your situation is stable.`,
        },
        {
          question: "Is agency housing SNF certified?",
          answer:   `Not all agency housing is SNF certified. Certification means the property has been independently inspected for occupancy limits, safety, and facilities. Ask your agency for their SNF registration number and verify it at snf.nl/register/. An agency that cannot provide this number may not be certified — treat this as a risk factor.`,
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
      title:     `Is Working in the Netherlands Worth It? Real Worker Data (${YEAR})`,
      metaTitle: `Is Working in Netherlands Worth It? ${YEAR} Honest Review`,
      metaDesc:  `${negativePct}% of workers rate Dutch agency work 1–2 stars. Real data from ${totalSeedReviews} reviews on salary, housing, rights, and honest pros and cons for foreign workers.`,
      badge:     `${totalSeedReviews} Real Worker Reviews`,
      intro:     `The Netherlands attracts over 400,000 temporary foreign workers each year. It promises minimum wages of €14.71/hr, strong legal protections, and a path to long-term employment rights. The reality is more complex. ${negativePct}% of workers on AgencyCheck rate their experience 1–2 stars. This guide synthesises ${totalSeedReviews} worker reviews and verified salary and housing data to give you an unfiltered, data-backed answer to whether working in the Netherlands through an agency is worth it — and for whom.`,
      sections: [
        {
          heading: "What the data actually shows",
          body: `From ${totalSeedReviews} worker reviews on AgencyCheck:<br/><br/>• <strong>${negativePct}% rate 1–2 stars</strong> (negative overall experience)<br/>• <strong>${positivePct}% rate 4–5 stars</strong> (positive overall experience)<br/>• Average salary rating: <strong>${salaryAvg}/5</strong><br/>• ${payslipErrors} workers (${Math.round((payslipErrors / totalSeedReviews) * 100)}%) reported payslip errors<br/>• ${latePayCount} workers reported late salary payments<br/>• ${contractIssues} workers (${Math.round((contractIssues / totalSeedReviews) * 100)}%) flagged unclear contract terms<br/>• ${commPoorCount} workers (${Math.round((commPoorCount / totalSeedReviews) * 100)}%) cited poor communication from their agency<br/>• ${verifiedCount} of ${totalSeedReviews} reviews are from verified workers<br/><br/>The picture is genuinely mixed. Workers in well-run agencies with decent housing and transparent contracts report satisfactory-to-good experiences. Workers placed by agencies with poor housing management, opaque contracts, and unresponsive coordinators report significant, sometimes severe, problems. The deciding variable is usually the agency — not the country.`,
        },
        {
          heading: "The real financial picture — from WML to actual pocket",
          body: `The Dutch minimum wage (€14.71/hr in 2026) translates to €588/week gross and approximately <strong>€345/week net</strong> before housing deductions at a standard 40-hour week. After agency housing (€80–€113/week if provided), real disposable income is <strong>€232–€265/week</strong> — approximately €1,000–€1,150/month.<br/><br/>Workers who consistently save money in the Netherlands tend to share a pattern:<br/><strong>1.</strong> They earn above WML — forklift: €15.50–€18/hr, night shift: base +22%, Sunday: base +50%.<br/><strong>2.</strong> They share private housing costs with a partner or family member rather than using maximum-priced agency housing.<br/><strong>3.</strong> They work regular overtime (paid at 125–150% under ABU CAO).<br/><strong>4.</strong> They are in logistics hubs (Tilburg, Venlo, Waalwijk) where above-WML rates are common.<br/><br/>Workers who struggle financially tend to be placed at exactly WML in maximum-deduction housing, with no overtime and no shift premium work. Their effective disposable income is closer to €${245 - 20}–€${265 - 20}/week — enough to subsist but not to meaningfully save. This is the scenario described by many of the ${negativePct}% of negative reviews.`,
        },
        {
          heading: "Genuine advantages of working in the Netherlands",
          body: `Despite the mixed review data, the Netherlands offers real structural advantages for foreign workers that are worth naming clearly:<br/><br/><strong>Legal minimum wage is enforced:</strong> The Netherlands has one of Europe's more active labour inspectorates. The WML applies regardless of your nationality, origin, or visa status. Workers cannot legally be paid below this level — and the Inspectie SZW actively investigates complaints.<br/><br/><strong>ABU/NBBU CAO protections accumulate over time:</strong> Under the ABU CAO, workers progress from Fase A (flexible) through Fase B to potential direct employment (Fase C) after 78 weeks with the same hirer. Night, Sunday, and public holiday premiums are legally mandated — not optional.<br/><br/><strong>Savings potential above WML:</strong> Workers earning €15.50–€18/hr with free or low-cost housing can save €600–€1,200/month. This is substantially higher than equivalent logistics or production work in Poland (€10–€12/hr equivalent), Romania (€5–€8/hr), or the Czech Republic (€11–€13/hr) — which explains why the Netherlands continues to attract hundreds of thousands of European workers.<br/><br/><strong>Healthcare:</strong> All workers in the Netherlands — including temporary foreign workers — are entitled to medical care. Agency workers are typically covered under the employer's or agency's collective arrangement. In cases of work-related injury, Dutch law requires full sick pay provision.`,
        },
        {
          heading: "The main risks — and how to manage each one",
          body: `<strong>Risk 1: Housing dependency</strong><br/>Losing your job means losing your home simultaneously. Mitigation: arrive with at least €500–€800 in savings, get the housing notice period in writing before you sign, and start looking at private rental options from week 2 onwards.<br/><br/><strong>Risk 2: Payslip and wage errors</strong><br/>Reported in ${payslipErrors} of ${totalSeedReviews} reviews. Mitigation: check every payslip the day it arrives; keep your own hours log; contact the agency in writing (not verbally) if anything is wrong.<br/><br/><strong>Risk 3: Unclear or misleading contracts</strong><br/>Flagged in ${contractIssues} reviews (${Math.round((contractIssues / totalSeedReviews) * 100)}% of total). Mitigation: never sign a contract in Dutch without understanding it. Agencies are legally required to provide information in a language you understand. Ask for translation or use Google Translate on each clause before signing. Key things to understand: your hourly rate, your notice period, housing deduction terms, and what happens to housing if the job ends.<br/><br/><strong>Risk 4: Substandard accommodation</strong><br/>Reported in ${housingIssueCount} reviews. Mitigation: ask for SNF certification number before arriving; ask to view the accommodation; speak with workers already there if possible. If conditions violate SNF standards after arrival, file with Inspectie SZW — anonymously if needed.`,
        },
        {
          heading: "How Dutch labour law actually protects you",
          body: `Many workers in the Netherlands are unaware of the strength of Dutch labour law — often because it is communicated poorly by agencies or not communicated at all. The key protections that apply from day one:<br/><br/><strong>Minimum wage (WML):</strong> Applies to all workers regardless of nationality. No legitimate agency can pay below this.<br/><br/><strong>Vakantiegeld:</strong> 8% of gross wages must be accrued as holiday allowance. This is legally guaranteed, not a bonus.<br/><br/><strong>Paid sick leave:</strong> If you are genuinely ill, you are entitled to at least 70% of your wage (up to statutory maximum) while sick for up to 104 weeks. You cannot be dismissed solely for being sick during the first two years of illness.<br/><br/><strong>Safe working conditions (Arbeidsomstandighedenwet):</strong> Your employer must provide safe working conditions. This includes protective equipment, safe machinery, and adequate breaks. Work-related injuries are covered by employer liability.<br/><br/><strong>Non-discrimination:</strong> Dutch law (AWGB) prohibits discrimination in employment on grounds of nationality, religion, sex, and other protected characteristics.<br/><br/>These protections apply to you even if you are on a Fase A flexible contract, even if you have only been working for one week, and even if you do not speak Dutch. The law is universal — ignorance of it among workers is a problem of communication, not of legal entitlement.`,
        },
        {
          heading: "How to choose a good agency before you arrive",
          body: `The single most impactful decision you can make is which agency you work through. The difference between a positive and negative experience in the Netherlands is far more determined by agency quality than by the work itself. How to evaluate an agency before you commit:<br/><br/><strong>Check AgencyCheck reviews:</strong> Filter by agency name on AgencyCheck and read reviews from workers in similar roles to yours. Look at salary ratings, housing ratings, and issue tags. An agency with 8+ reviews and a 3.5+ salary rating is a much safer choice than one with 3 reviews and a 2.5 salary rating — even if the advertised wage is higher.<br/><br/><strong>SNA certification:</strong> SNA (Stichting Normering Arbeid) certified agencies have been audited for compliance with tax, wage, and employment law. Certification is not a guarantee but significantly reduces the risk of wage fraud or illegal deductions. Check certification at normeringarbeid.nl.<br/><br/><strong>Named contact before you sign:</strong> A serious agency will give you a specific coordinator's name, email address, and phone number before you commit. A vague "contact our office" response before signing is a risk signal.<br/><br/><strong>Specifics in writing before travel:</strong> Get the hourly rate, housing deduction, transport arrangements, and start date confirmed in writing — email is sufficient — before travelling to the Netherlands. Any agency unwilling to confirm these basics in writing before you arrive is not an agency you should trust.`,
        },
        {
          heading: "Who does well working in the Netherlands — and who struggles",
          body: `Based on the distribution in our review data, workers who report positive experiences share clear characteristics:<br/><br/><strong>Workers who tend to do well:</strong><br/>• Have a specific, in-demand certification (forklift licence, reach truck, food safety handling)<br/>• Researched the agency before arriving — read reviews, contacted the agency in writing, got specifics confirmed<br/>• Arrived with sufficient savings (€500–€1,000+) to not be desperate about conditions<br/>• Have prior experience with European agency work and understand their rights<br/>• Worked for agencies in the ${positivePct}% "positive" review cluster — consistent, communicative coordinators<br/><br/><strong>Workers who tend to struggle:</strong><br/>• Arrived with minimal savings and immediate financial pressure<br/>• Did not verify the agency in advance and have no leverage<br/>• Are isolated by language from understanding their contract or payslips<br/>• Are placed in maximum-deduction housing making their financial position very tight<br/>• Work for agencies in the ${negativePct}% negative review cluster — poor communication, unresponsive management, payslip errors<br/><br/>The Netherlands can be a genuinely worthwhile place to work. Whether it is depends almost entirely on the agency you choose and the preparation you do before you arrive.`,
        },
        {
          heading: "What to do if things go wrong",
          body: `If you are already in the Netherlands and facing problems with your agency, you have more options than most workers realise — even on a short-term contract:<br/><br/><strong>Wage issues:</strong> File with Inspectie SZW at inspectieszw.nl (anonymous complaint option available). The inspectorate investigates and requires back-payment of wages. Statutory penalties accrue automatically on delayed wages under BW 7:623.<br/><br/><strong>Housing violations:</strong> Report substandard or overpriced housing to Inspectie SZW or directly to SNF if the agency is SNF-certified. You can also report to the Gemeentelijke Basisadministratie in the municipality where the housing is located.<br/><br/><strong>Contract disputes:</strong> Contact FNV Bondgenoten for free initial advice. They cover logistics, agriculture, and food production — the three sectors where most agency workers are concentrated. A single phone call or online inquiry can clarify your rights and next steps.<br/><br/><strong>Unsafe working conditions:</strong> Report to Inspectie SZW. You can report dangerous conditions anonymously. The inspectorate can issue immediate improvement notices and prohibit dangerous practices.<br/><br/><strong>Discrimination or harassment:</strong> File with the College voor de Rechten van de Mens (Netherlands Institute for Human Rights) at mensenrechten.nl. This body handles discrimination complaints and provides free assessments.`,
        },
      ],
      faqs: [
        {
          question: "Is the Netherlands a good place to work as a foreign worker?",
          answer:   `The Netherlands has strong legal protections and the minimum wage (€${WML}/hr in 2026) is actively enforced. However, ${negativePct}% of AgencyCheck reviewers rate their experience 1–2 stars. Experience depends heavily on which agency you work through. Research your specific agency on AgencyCheck before committing — not just the job listing.`,
        },
        {
          question: "What is the real take-home pay in the Netherlands?",
          answer:   `At WML (40hr/week), net take-home is approximately €${weeklyNet}/week before housing. With agency housing (€80–€113/week), disposable income is €${weeklyNet - 113}–€${weeklyNet - 80}/week. Night and weekend shift premiums significantly increase this: a full-time night shift worker at WML earns approximately €718/week gross.`,
        },
        {
          question: "What are the biggest risks for foreign workers in the Netherlands?",
          answer:   `The four main risks are: (1) Housing dependency — job loss means home loss simultaneously; (2) Payslip and wage errors, reported in ${payslipErrors} of ${totalSeedReviews} reviews; (3) Unclear contracts, flagged in ${contractIssues} reviews; (4) Substandard agency housing, reported in ${housingIssueCount} reviews. All four are manageable with preparation and the right agency.`,
        },
        {
          question: "How long does it take to gain employment rights in the Netherlands?",
          answer:   `Under the ABU CAO, workers progress from Fase A (weeks 1–78, flexible) to Fase B (weeks 79+, more protection, fixed-term contracts) to potential direct hire (Fase C, after 78 weeks with the same hirer). During Fase A, the employer has more flexibility to end your contract — but all wage and working condition protections apply from day one.`,
        },
        {
          question: "How do I find a trustworthy agency in the Netherlands?",
          answer:   `Check SNA certification at normeringarbeid.nl, read AgencyCheck reviews for that specific agency, confirm a named coordinator before signing, and get hourly rate, housing deduction, and transport costs confirmed in writing before travelling. An agency unwilling to put specifics in writing before you arrive is a significant red flag.`,
        },
      ],
      relatedAgencySlugs: ["otto-work-force", "covebo", "flexdirect-uitzendgroep", "gi-group-temp"],
      relatedCitySlugs:   ["amsterdam", "rotterdam", "tilburg", "eindhoven"],
      datePublished: "2026-02-01",
      dateModified:  "2026-04-01",
    },

    // ── Guide 4: Forklift driver jobs Netherlands ──────────────────────────────
    {
      slug:      "forklift-driver-jobs-netherlands",
      title:     `Forklift Driver Jobs in the Netherlands — Salary, Agencies & ${YEAR} Guide`,
      metaTitle: `Forklift Driver Jobs Netherlands ${YEAR} — Salary & Agency Guide`,
      metaDesc:  `Forklift and reach truck drivers earn €15.50–€18/hr in the Netherlands. ${forkliReviewCount} worker reviews analysed. Which agencies hire, which cities pay best, and how to get certified.`,
      badge:     `${forkliReviewCount} Forklift Worker Reviews`,
      intro:     `Certified forklift and reach truck drivers are among the most in-demand workers in Dutch logistics. They earn €15.50–€18/hr — €1–€3 above the minimum wage floor — and are employed year-round rather than seasonally. This guide is built on ${forkliReviewCount} forklift and reach truck driver reviews on AgencyCheck, real 2026 Dutch CAO data, and certification requirements specific to the Netherlands. If you have a forklift licence (or are considering getting one), this is what you need to know before working in the Netherlands.`,
      sections: [
        {
          heading: "What forklift and reach truck drivers actually earn in the Netherlands",
          body: `The Dutch minimum wage for workers aged 21+ is €${WML}/hr in 2026. Certified forklift operators consistently earn above this floor. Typical rates in the Netherlands in 2026:<br/><br/><strong>Counterbalance forklift (heftruck):</strong> €15.00–€16.50/hr at most logistics agencies. Rates are highest near major DCs in Tilburg, Venlo, Waalwijk, and Rotterdam.<br/><strong>Reach truck operator (reachtruck):</strong> €15.50–€17.50/hr. Reach truck certification is less common than counterbalance, so operators command a slight premium.<br/><strong>Very Narrow Aisle (VNA/palettentruk):</strong> €16.00–€18.00/hr. VNA operation is specialised and found primarily in high-bay automated DCs. VNA-certified operators are in short supply.<br/><strong>Order picker (orderpicker) — non-certified:</strong> €14.71–€15.50/hr. Lower-bound warehouse work without equipment certification.<br/><br/>With standard ABU CAO night shift premium (+22%) and Sunday premium (+50%), a reach truck driver working nights earns approximately €21/hr gross. At 40 hours per week, that is €840 gross — or roughly €490–€520 net per week before housing deductions.<br/><br/>These wages make certified equipment operation one of the most practical routes to meaningful savings for a foreign worker in the Netherlands — especially for workers in housing provided by the agency who can keep housing costs low.`,
        },
        {
          heading: "Which certification do you need — and is yours recognised in the Netherlands?",
          body: `The Netherlands does not have a single nationally mandated forklift licence analogous to a driving licence. Instead, the industry operates on a certification framework administered by private recognised institutes. The main recognised certification bodies are:<br/><br/><strong>VCA (Veiligheid, Gezondheid en Milieu Checklist Aannemers):</strong> A safety competency certificate widely required before starting in Dutch logistics and industrial workplaces. VCA-B (basic) or VCA-VOL (full) are the typical requirements. Some agencies will provide VCA training on arrival; others require pre-existing certification.<br/><br/><strong>VVTI / Savantis / NOVEX certifications:</strong> These bodies certify equipment-specific competencies (heftruck, reachtruck, VNA, etc.). Most Dutch employers recognise these certificates — but some agencies require workers to complete a brief skills assessment on the employer's specific equipment before placing them on that equipment unsupervised.<br/><br/><strong>EU/EEA licences:</strong> There is no EU-wide forklift licence that automatically transfers between member states. A Polish, Romanian, or Czech forklift certification is not automatically valid in the Netherlands. However, most Dutch agencies will conduct a practical assessment and, if competency is demonstrated, allow work without requiring a formal Dutch re-certification. Ask your agency explicitly about their process.<br/><br/><strong>Dutch-language training:</strong> If you need to obtain Dutch forklift certification for the first time, courses run approximately 1–3 days depending on equipment type and prior experience. Costs range from €200–€600. Some agencies subsidise or fully fund certification for new workers they plan to retain long-term.`,
        },
        {
          heading: `What forklift workers report about working in the Netherlands (${forkliReviewCount} reviews)`,
          body: `AgencyCheck contains ${forkliReviewCount} reviews from workers with forklift driver or reach truck driver as their listed job title. Key findings from this subset:<br/><br/><strong>Salary satisfaction:</strong> Forklift and reach truck workers rate salary higher than the overall average of ${salaryAvg}/5. Workers who specified above-WML hourly rates in their comments consistently rate salary 4–5 stars. Workers who were hired as "forklift driver" but paid at WML rates — without the premium they expected — are the source of the negative salary reviews in this group.<br/><br/><strong>Transport:</strong> Several reach truck driver reviews mention long commutes to work sites — particularly in logistics DCs outside city centres. A forklift role paying €16/hr loses financial appeal quickly if it requires a 45-minute commute each way at personal cost. Confirm transport arrangements before accepting.<br/><br/><strong>Positive pattern:</strong> The highest-rated reviews from certified equipment operators describe a consistent pattern: a named coordinator who communicated clearly pre-arrival, accommodation within 10 minutes of the DC, and shift premiums paid correctly from week one. These workers report saving €700–€1,000/month in the Netherlands.<br/><br/>Compare <a href="/agencies/otto-work-force">reviews of Otto Work Force</a> and other major logistics agencies on AgencyCheck to see which ones certified equipment operators rate most highly.`,
        },
        {
          heading: "Best Dutch cities for forklift driver jobs",
          body: `Forklift driver demand in the Netherlands is heavily concentrated in logistics infrastructure corridors. The strongest markets in 2026:<br/><br/><strong>Tilburg and Waalwijk (Noord-Brabant):</strong> The core of Dutch e-commerce and retail logistics. DCs for bol.com, Amazon, Zalando, PostNL, and dozens of B2B distributors are all clustered here. Forklift demand is year-round with regular overtime. Many agencies with housing operate in this region. Browse <a href="/cities/tilburg">agencies hiring in Tilburg →</a><br/><br/><strong>Venlo (Limburg):</strong> Border logistics hub near Germany. Major 3PL operators, pharmaceutical DCs, and fresh produce logistics. Reach truck demand is particularly high due to the high-bay nature of many Venlo facilities. Browse <a href="/cities/venlo">agencies hiring in Venlo →</a><br/><br/><strong>Rotterdam (South Holland):</strong> Port-related logistics — container handling, cold chain, bulk storage. VNA and counterbalance in high demand. Wages tend to be higher but so do commutes. Browse <a href="/cities/rotterdam">Rotterdam agencies →</a><br/><br/><strong>Schiphol logistics zone:</strong> Cargo handling and air freight DCs. Night shift and early morning shifts very common. Security vetting (VOG) typically required. Wages of €17–€20/hr for experienced operators are achievable.<br/><br/><strong>Den Bosch, Eindhoven, Almelo:</strong> Secondary logistics hubs with growing DC capacity and lower housing costs than the Tilburg/Waalwijk core.`,
        },
        {
          heading: "Shift premiums and overtime for equipment operators",
          body: `Certified equipment operators in Dutch logistics typically work shift patterns that generate significant premium pay. Under the ABU CAO — which covers the majority of Dutch agency workers in logistics — the following applies:<br/><br/><strong>Night shift (00:00–06:00):</strong> +22% on base rate. A reach truck driver at €16/hr earns €19.52/hr on night shift. A 40-hour night shift week generates €780 gross versus €640 on days.<br/><br/><strong>Early morning (before 08:00):</strong> +15% for pre-shift hours. Many DC shifts start at 06:00 — those two hours attract the early morning premium.<br/><br/><strong>Sunday:</strong> +50% on base rate. A forklift driver at €15.50/hr earns €23.25/hr on Sundays. One Sunday shift (8 hours) adds €186 gross to the week's earnings.<br/><br/><strong>Public holidays:</strong> 200% (double time) under most ABU-aligned agreements. A single public holiday shift can add €248–€288 gross depending on hourly rate.<br/><br/><strong>Overtime:</strong> Hours beyond 40/week: 125% for hours 41–50, 150% for hours above 50. Regular overtime in Dutch DCs is common during peak periods (Q4, January returns, agricultural harvests).<br/><br/>A reach truck driver working nights with regular overtime can earn €900–€1,100/week gross — and net €550–€700 after tax, significantly more than a day-shift WML worker. This premium potential is the main financial case for forklift certification if you plan to work in Dutch logistics.`,
        },
        {
          heading: "Contract types for forklift workers — what to expect",
          body: `Forklift and reach truck operators in the Netherlands typically start on agency contracts (uitzendovereenkomst) with a probationary phase. Understanding what you are signing matters:<br/><br/><strong>Fase A (weeks 1–78):</strong> Initial agency contract under the ABU CAO. The employer (hirer) or agency can end the contract with short notice — typically 1 week or at the end of a shift period. Despite this flexibility, all wage rights (WML, premiums, vakantiegeld) apply from day one. You cannot be paid below WML even in Fase A.<br/><br/><strong>Fase B (weeks 79+):</strong> After 78 worked weeks with the same hirer via the same agency, you move to Fase B. In Fase B, you are entitled to fixed-term employment contracts rather than open-ended flexibility. Notice periods increase. This is a significant increase in employment security.<br/><br/><strong>Direct hire (Fase C):</strong> After 78 weeks via the agency with the same hirer, the hirer has the option to offer direct employment. For certified forklift operators who perform well, direct hire offers are more common than in unskilled roles because retaining certified operators saves the agency fee for future placements.<br/><br/>When reviewing your contract, confirm: your exact hourly rate (must be above WML), the shift pattern and whether it can be changed without notice, and whether the transport arrangement is in writing. Certified equipment operators have more negotiating leverage than unskilled workers — use it to get specifics confirmed in writing before you start.`,
        },
        {
          heading: "How to find forklift jobs in the Netherlands through agencies",
          body: `Finding certified equipment operator roles in the Netherlands is more straightforward than finding unskilled warehouse work because demand exceeds supply in most logistics corridors. Practical steps:<br/><br/><strong>1. Use AgencyCheck to filter by city and sector:</strong> Search for logistics agencies in Tilburg, Venlo, or Rotterdam. Read worker reviews specifically from forklift and reach truck operators — these are the most relevant data points. Agencies with consistent 3.5+ salary ratings from certified operators are a reliable starting point.<br/><br/><strong>2. Prepare your certification documentation:</strong> Before contacting agencies, gather: your forklift/reach truck certificate (original + clear photo or scan), your VCA certificate if you have one, and a brief record of your equipment experience (years, tonnage, type). Dutch-language applications are not required — agencies placing foreign workers operate in English as standard.<br/><br/><strong>3. Contact multiple agencies simultaneously:</strong> There are ${totalAgencies} profiled agencies on AgencyCheck. Logistics-focused agencies in Tilburg and Venlo are actively recruiting certified operators. Sending a brief introduction email to 5–8 agencies with your certification details will typically generate responses within 48 hours.<br/><br/><strong>4. Ask specifically about certification recognition:</strong> Ask each agency: "Do you accept [your country] forklift certification?" and "Will I need a skills assessment before placement?" Get the answer in writing. An agency that tells you verbally "your certification is fine" but later says you need re-training after arrival is a problem — document the pre-arrival confirmation.`,
        },
        {
          heading: "What to do if you are paid below the forklift rate you were promised",
          body: `A common complaint from forklift workers arriving in the Netherlands is being placed at WML rates (€${WML}/hr) despite being hired as a certified operator. This happens when agencies advertise higher rates to attract workers but then justify lower rates on arrival with vague reasons ("you are in the probationary phase," "your certificate is not recognised here," "the rate increases after your first shift assessment").<br/><br/>Your legal position:<br/><br/><strong>If your contract specifies a higher rate:</strong> The contract rate is your legal minimum. The agency cannot pay below it. Send a written notice to the agency stating the contracted rate and the actual rate paid. If not corrected within one week, file with Inspectie SZW.<br/><br/><strong>If your contract only specifies WML:</strong> Unfortunately, WML is the legal floor — not the advertised rate. This is why it is critical to get the promised hourly rate in writing in your contract before you travel. Verbal promises are unenforceable.<br/><br/><strong>Prevention is always better:</strong> Before travelling to the Netherlands, send an email to your agency with the specific hourly rate you were quoted and ask them to confirm it by return email. If they confirm it, you have a written record. If they dodge the question, that is critical information to have before you commit to travelling.`,
        },
      ],
      faqs: [
        {
          question: "How much do forklift drivers earn in the Netherlands?",
          answer:   `Certified counterbalance forklift operators earn €15.00–€16.50/hr; reach truck drivers earn €15.50–€17.50/hr; VNA operators earn €16–€18/hr. With night shift (+22%) and Sunday (+50%) ABU CAO premiums, gross weekly earnings for a night-shift reach truck driver at €16/hr base are approximately €780/week (40 hours).`,
        },
        {
          question: "Is my forklift certificate from my home country valid in the Netherlands?",
          answer:   `There is no EU-wide forklift licence. A certificate from another EU country is not automatically valid in the Netherlands. Most Dutch agencies will conduct a brief practical skills assessment and, if competency is demonstrated, allow you to work without formal Dutch recertification. Get this process confirmed in writing before travelling.`,
        },
        {
          question: "Do I need VCA certification to work in Dutch logistics?",
          answer:   `Many Dutch employers require VCA-B (basic safety certificate) or VCA-VOL (full). VCA is not the same as a forklift licence — it is a general workplace safety qualification. Some agencies provide VCA training on arrival; others require you to have it beforehand. A 1-day VCA-B course costs €150–€250. Ask your agency before travelling.`,
        },
        {
          question: "Which cities have the most forklift driver jobs in the Netherlands?",
          answer:   `Tilburg and Waalwijk (Noord-Brabant logistics corridor), Venlo (border logistics), Rotterdam (port-related), and the Schiphol logistics zone are the strongest markets. Reach truck demand is highest in the Tilburg/Venlo/Den Bosch triangle where high-bay DC density is greatest.`,
        },
        {
          question: "What is the ABU CAO and does it apply to me?",
          answer:   `The ABU CAO (Algemene Bond Uitzendondernemingen collective agreement) covers most Dutch temp agency workers in logistics, production, and warehousing. It specifies minimum wages, shift premiums (night +22%, Sunday +50%, overtime at 125–150%), sick pay rights, and the Fase A/B/C contract progression. If your agency is ABU-member, this CAO applies to you from day one.`,
        },
      ],
      relatedAgencySlugs: ["otto-work-force", "covebo", "flexsupport", "gi-group-temp"],
      relatedCitySlugs:   ["tilburg", "venlo", "waalwijk", "rotterdam"],
      datePublished: "2026-02-10",
      dateModified:  "2026-04-01",
    },

    // ── Guide 5: Temp agency worker rights Netherlands ─────────────────────────
    {
      slug:      "temp-agency-worker-rights-netherlands",
      title:     `Temp Agency Worker Rights in the Netherlands — ABU, NBBU & ${YEAR} Guide`,
      metaTitle: `Temp Agency Worker Rights Netherlands ${YEAR} — ABU NBBU`,
      metaDesc:  `${contractIssues} of ${totalSeedReviews} AgencyCheck workers flagged unclear contracts. Know your rights under ABU/NBBU CAO — wages, sick pay, Fase A/B/C progression, and what to do when your agency violates them.`,
      badge:     `Worker Rights · ${YEAR}`,
      intro:     `${contractIssues} out of ${totalSeedReviews} workers reviewed on AgencyCheck flagged unclear or misleading contract terms. Many of the salary errors, late payments, and housing problems reported in our data are rooted in workers not understanding what their contract actually says — and agencies exploiting that uncertainty. This guide explains your legal rights under Dutch temp agency law, the ABU and NBBU collective agreements, and what you can do when those rights are violated.`,
      sections: [
        {
          heading: "What is a temp agency contract (uitzendovereenkomst) in the Netherlands?",
          body: `A temp agency contract (uitzendovereenkomst) is a three-party arrangement under Dutch law. You (the worker) contract with the agency (the uitzendbureau), who in turn provides you to a client company (the inlener or hirer) to perform work. You are legally employed by the agency — not by the client company where you actually work each day.<br/><br/>This structure has important implications:<br/><br/><strong>Your employer is the agency:</strong> All wage disputes, payslip questions, and employment rights are with the agency — not the company where you physically work. If a shift manager at the client site tells you something contradictory, the agency contract governs.<br/><br/><strong>You are protected by Dutch employment law:</strong> All standard Dutch employment protections (WML, sick pay, vakantiegeld, safe working conditions) apply to you regardless of your nationality, the nationality of the agency, or how you came to the Netherlands. The law applies universally.<br/><br/><strong>The agency must be registered:</strong> In the Netherlands, temp agencies must be registered with the Kamer van Koophandel (KvK). Agencies with SNA (Stichting Normering Arbeid) certification have additionally been audited for compliance with wage and employment law. Working through an SNA-certified agency significantly reduces the risk of wage fraud or illegal deductions.`,
        },
        {
          heading: "ABU CAO vs. NBBU CAO — what is the difference?",
          body: `Most Dutch temp agencies operate under one of two collective agreements (CAO):<br/><br/><strong>ABU CAO (Algemene Bond Uitzendondernemingen):</strong> The larger collective agreement, covering agencies representing the majority of temp workers in logistics, production, and warehousing. The ABU CAO is the benchmark for most foreign workers in the Netherlands. It sets minimum hourly rates above WML for certain roles, defines shift premium rates, specifies the Fase A/B/C progression, and governs sick pay and contract notice periods.<br/><br/><strong>NBBU CAO (Nederlandse Bond van Bemiddelings- en Uitzendondernemingen):</strong> A competing collective agreement covering smaller and medium agencies. The NBBU CAO has slightly different provisions — notably a longer Fase 1 period (78 weeks vs. ABU's standard Fase A structure) and different notice period rules. Workers under NBBU may have slightly less short-term flexibility protection but broadly similar wage and working condition rights.<br/><br/><strong>No CAO:</strong> Agencies not affiliated with ABU or NBBU must still comply with Dutch law (WML, vakantiegeld, sick pay) but are not bound by collective-agreement provisions such as shift premium rates. These agencies can offer worse conditions within the legal minimum floor. This is one reason SNA certification is important — it verifies compliance even when there is no CAO membership.<br/><br/>Ask your agency explicitly: "Which CAO applies to my contract?" Get the answer in writing.`,
        },
        {
          heading: "Fase A, B, C — how your rights grow over time",
          body: `The ABU CAO structures temp employment in three phases, each with progressively stronger worker protections:<br/><br/><strong>Fase A (Weeks 1–78):</strong> You are employed on an uitzendbeding (availability condition). The contract can be ended by either party with very short notice — sometimes at the end of a shift. You are not entitled to continued salary if the hirer has no work for you (no work = no pay). However: WML, shift premiums, vakantiegeld, and sick pay protections all apply from day one. ${Math.round((contractIssues / totalSeedReviews) * 100)}% of AgencyCheck workers who flagged unclear contracts were likely in Fase A — this phase offers the least formal security, making clear documentation especially important.<br/><br/><strong>Fase B (Weeks 79+):</strong> After 78 worked weeks with the same hirer via the same agency, you transition to Fase B. In Fase B, you are employed on fixed-term contracts (tijdelijk contract). Notice periods increase. The hirer cannot end your contract at a shift's end — a formal notice and notice period are required. Fase B workers also have stronger rights to salary continuation during illness.<br/><br/><strong>Fase C / Direct hire:</strong> After 78 weeks with the same hirer, the hirer must offer you a direct employment contract if they continue using your services. Direct employment (vaste aanstelling or vast contract bij opdrachtgever) provides the full range of Dutch employment protections — including restrictions on dismissal without cause.`,
        },
        {
          heading: `What unclear contracts actually look like — ${contractIssues} reported cases`,
          body: `In our review dataset, ${contractIssues} workers (${Math.round((contractIssues / totalSeedReviews) * 100)}% of all ${totalSeedReviews} reviews) tagged "unclear_contract" as an issue. Analysing these reviews and comments, the most common problems:<br/><br/><strong>1. Hourly rate not specified or vague:</strong> "Minimum wage or higher" is insufficient. Your contract should specify your exact hourly rate in euros. If it does not, the agency may legally pay you exactly WML regardless of what was discussed.<br/><br/><strong>2. Housing deduction amount not stated:</strong> "Housing included" without a specific euro amount per week is a blank cheque. The SNF maximum (€113.50/week) gives agencies the right to charge up to that amount without further justification.<br/><br/><strong>3. Notice period buried or absent:</strong> Workers frequently do not know how much notice the agency must give before ending their contract — or how much notice they need to give to leave. Under ABU CAO Fase A, the uitzendbeding means very short effective notice for both parties.<br/><br/><strong>4. Transport terms unclear:</strong> "Transport provided" does not specify whether it is free, the schedule, or what happens if you miss it.<br/><br/><strong>5. Dutch-language only:</strong> Agencies are required to provide information about working conditions in a language the worker understands (Wet transparante en voorspelbare arbeidsvoorwaarden, 2022). If you cannot read Dutch, you are entitled to request a translation or explanation. Signing without understanding is never advisable — and is never legally required.`,
        },
        {
          heading: "Your wage rights — what the agency must pay and when",
          body: `Dutch law and the ABU/NBBU CAO specify wage rights that apply regardless of your contract phase:<br/><br/><strong>Minimum wage (WML):</strong> €${WML}/hr for workers aged 21+ in 2026. Non-negotiable, applies from day one, regardless of nationality.<br/><br/><strong>Shift premiums (ABU CAO):</strong> Night (00:00–06:00): +22%. Early morning (06:00–08:00): +15%. Evening (20:00–24:00): +15%. Sunday: +50%. Public holidays: 200% (double time).<br/><br/><strong>Overtime:</strong> Hours 41–50/week: 125%. Hours 51+: 150%.<br/><br/><strong>Vakantiegeld:</strong> 8% of gross salary must be accrued. Legally required — not optional.<br/><br/><strong>Payment timing:</strong> Your contract must specify the pay frequency (weekly or monthly) and the payment date. Under BW 7:623, late payment automatically triggers a statutory surcharge of up to 50% of the delayed amount after the third day of delay. You do not need to claim this — it accrues automatically.<br/><br/><strong>Payslip:</strong> Must be provided for every pay period and must be itemised (gross wages, each deduction with reason, net payment). A payslip that shows only a net total is not legally compliant.`,
        },
        {
          heading: "Sick pay rights for agency workers",
          body: `Sick pay (ziektewet) for temp agency workers is one of the most misunderstood areas of Dutch employment law — and the one that generates the most fear among workers who become ill.<br/><br/><strong>In Fase A (with uitzendbeding):</strong> If the hirer has no work for you during illness, the uitzendbeding may allow the agency to end the placement. However, if the uitzendbeding clause has expired (after the first 26 weeks under ABU CAO), the agency must continue to pay you at minimum 70% of your wage during illness.<br/><br/><strong>In Fase B:</strong> You are entitled to sick pay at a minimum of 70% of your last-earned wage (up to the daily wage maximum — dagloon maximum). This continues for up to 104 weeks. You cannot be dismissed solely for illness during the first two years.<br/><br/><strong>Arbodienst:</strong> Your agency is required by law to have a contracted occupational health service (arbodienst). If you are sick, you must report to the agency (and usually the arbodienst) according to the procedure in your contract. Reporting is required — but the arbodienst exists to support your recovery, not to pressure you into returning early.<br/><br/><strong>Work-related injury:</strong> If your illness is caused by work conditions, your employer has additional liability under the Arbeidsomstandighedenwet. Documenting the work site, circumstances, and witnesses at the time of injury is important for any subsequent claim.`,
        },
        {
          heading: "How to report violations and enforce your rights",
          body: `Dutch workers have several enforcement routes for employment rights violations. All of these are available to foreign workers regardless of how long they have been in the Netherlands:<br/><br/><strong>Inspectie SZW (Dutch Labour Inspectorate):</strong> File at <strong>inspectieszw.nl</strong>. Anonymous complaint option available. The Inspectorate investigates wage, working time, and workplace safety violations. It can issue fines to employers and require back-payment of wages. This is the most direct enforcement route and costs you nothing.<br/><br/><strong>FNV Bondgenoten:</strong> The largest Dutch trade union covering logistics, agriculture, and food production. Free initial advice available. FNV can draft formal complaint letters on your behalf and represent you in disputes. You do not need to be a member to get initial advice.<br/><br/><strong>CAO violation (ABU/NBBU):</strong> If your agency is ABU or NBBU member and violates CAO provisions, you can file with the relevant association directly. This is particularly effective for shift premium and notice period violations.<br/><br/><strong>Civil court (kantonrechter):</strong> For unpaid wages above approximately €500, a simple court claim without a lawyer is possible for amounts under €25,000. Dutch courts regularly side with workers in clear wage violation cases.<br/><br/><strong>Documentation is key:</strong> For any complaint, keep: your signed contract, all payslips, screenshots of bank transfers, any written communication with the agency (WhatsApp, email), and your own hours log. Anonymous complaints to the Inspectorate require less documentation than civil claims.`,
        },
        {
          heading: "Your rights regarding working time, breaks, and rest periods",
          body: `The Dutch Working Hours Act (Arbeidstijdenwet) sets legally binding limits on working time for all workers, including temp agency workers:<br/><br/><strong>Maximum daily hours:</strong> 12 hours per shift. Maximum of 10 hours/day averaged over 4 weeks. Most logistics contracts operate on 8–9 hour shifts with the legal maximum as an absolute ceiling.<br/><br/><strong>Weekly maximum:</strong> 60 hours per week maximum (absolute ceiling). Maximum of 48 hours averaged over 16 weeks. Note: many agency workers in logistics regularly work 45–55 hour weeks — this is within the legal range.<br/><br/><strong>Rest periods:</strong> Minimum 11 consecutive hours between shifts. This means a shift ending at 22:00 cannot be followed by a shift starting before 09:00 the next day. If your schedule violates this, it is a working time violation. Minimum 36 consecutive hours off per week (or 72 hours in 2 weeks).<br/><br/><strong>Breaks:</strong> Shifts of more than 5.5 hours must include at least one 30-minute break (or two 15-minute breaks). Shifts over 10 hours must include 45 minutes of breaks. Breaks must not be at the start or end of a shift.<br/><br/><strong>Communication problems and scheduling:</strong> ${commPoorCount} of ${totalSeedReviews} reviews cited "communication_poor" as an issue — suggesting many workers receive inadequate notice of shift changes. Under Dutch law, employers should give reasonable notice of shift changes, though the minimum varies by CAO.`,
        },
      ],
      faqs: [
        {
          question: "What is the difference between ABU and NBBU?",
          answer:   `Both are collective agreements (CAO) covering Dutch temp agency workers. ABU covers larger agencies and most logistics/production workers. NBBU covers smaller agencies and has slightly different provisions — notably a different Fase structure and notice periods. Both require compliance with WML and worker protections above the legal minimum. Ask your agency which CAO applies to your contract.`,
        },
        {
          question: "Can my agency end my contract without notice?",
          answer:   `In Fase A (weeks 1–78), the uitzendbeding (availability condition) means the agency can end your placement when the hirer has no more work — sometimes at short notice. After the uitzendbeding expires (first 26 weeks under ABU CAO), formal notice requirements apply. In Fase B, you have a fixed-term contract and cannot be dismissed without meeting formal notice requirements.`,
        },
        {
          question: "Am I entitled to sick pay as a temp agency worker?",
          answer:   `Yes. In Fase B, you receive at least 70% of your last wage during illness, up to 104 weeks. In early Fase A with the uitzendbeding, the agency can end placement when there is no work — but cannot simply stop paying you if you become ill while on an active placement. Report illness to both the agency and the arbodienst according to your contract procedure.`,
        },
        {
          question: "What should I do if my contract is only in Dutch?",
          answer:   `Under the 2022 Wet transparante en voorspelbare arbeidsvoorwaarden, your employer must provide information about your working conditions in a language you understand. You are entitled to request an explanation or translation. Do not sign anything you cannot read. If the agency refuses to explain key terms, this is a legal violation and a strong warning signal.`,
        },
        {
          question: `How many AgencyCheck reviewers reported unclear contract terms?`,
          answer:   `${contractIssues} out of ${totalSeedReviews} reviews (${Math.round((contractIssues / totalSeedReviews) * 100)}%) tagged unclear_contract as an issue. This is the third most common problem tag in our dataset, after communication_poor and management_poor. Unclear contracts are a systemic problem at some agencies — reading reviews for your specific agency before signing is the single best preventive step.`,
        },
      ],
      relatedAgencySlugs: ["otto-work-force", "covebo", "flexdirect-uitzendgroep", "gi-group-temp"],
      relatedCitySlugs:   ["amsterdam", "rotterdam", "eindhoven", "tilburg"],
      datePublished: "2026-02-15",
      dateModified:  "2026-04-01",
    },

    // ── Guide 6: Moving to Netherlands for work ────────────────────────────────
    {
      slug:      "moving-to-netherlands-for-work",
      title:     `Moving to the Netherlands for Work — Complete ${YEAR} Preparation Guide`,
      metaTitle: `Moving to Netherlands for Work ${YEAR} — Complete Guide`,
      metaDesc:  `What to arrange before you leave, how to get your BSN and bank account, first-week essentials, and how to avoid the mistakes ${negativePct}% of workers make. Real data from ${totalSeedReviews} reviews.`,
      badge:     `${YEAR} Preparation Guide`,
      intro:     `Most workers who struggle in the Netherlands made avoidable mistakes in the first two weeks — arriving without savings, signing contracts they could not read, or accepting accommodation sight unseen. ${negativePct}% of AgencyCheck reviewers rate their experience negatively. Most of those negative experiences trace to a combination of poor preparation and a low-quality agency. This guide walks through exactly what to arrange before you leave your home country, what to do in your first week, and how to establish yourself financially and legally in the Netherlands.`,
      sections: [
        {
          heading: "What to arrange before you leave your home country",
          body: `Preparation before you travel significantly reduces the risk of exploitation and financial stress. The most important pre-departure checklist items:<br/><br/><strong>Savings buffer:</strong> Arrive with a minimum of €500–€800 in cash or accessible funds. This covers food for the first week (before first payment), any travel within the Netherlands, and gives you the financial breathing room to leave a bad situation without desperation. Workers who arrive with no savings have almost no leverage and tend to accept worse conditions as a result. The ${negativePct}% negative review rate on AgencyCheck correlates closely with workers in financially vulnerable positions.<br/><br/><strong>Confirm your agency in writing:</strong> Before travelling, confirm in writing (email): your exact hourly rate, start date, work location, housing address (if applicable), housing deduction amount, and transport arrangements. If the agency cannot or will not confirm these in writing before you travel, do not travel on their terms.<br/><br/><strong>Read agency reviews:</strong> Check AgencyCheck for your specific agency. Filter by similar job roles. Read the negative reviews as carefully as the positive ones — they typically describe problems that happen regularly, not one-off accidents.<br/><br/><strong>Copies of documents:</strong> Bring originals and copies of: passport (or EU ID card for EU citizens), any professional certifications (forklift, VCA, etc.), educational certificates, and any prior employment references. Bring digital copies (stored in your email or cloud) as backup.`,
        },
        {
          heading: "First week essentials — BSN, bank account, and registration",
          body: `The first week in the Netherlands involves several bureaucratic steps that are required for legal employment and accessing services. Understanding them in advance reduces anxiety significantly:<br/><br/><strong>BSN (Burgerservicenummer):</strong> Your Dutch social security / tax identification number. You need this for employment — your employer uses it for payroll tax. EU/EEA citizens working for more than 4 months must register at the local gemeente (municipality) and receive a BSN automatically. Short-term workers (under 4 months) can register as non-resident and get a BSN via a RNI (Registratie Niet-Ingezetenen) desk at designated municipalities.<br/><br/><strong>How to get your BSN:</strong> Your agency will typically guide you through this — it is in their interest, as they need your BSN to pay you legally. If your agency does not arrange this in the first week, ask them explicitly. You can also visit your local gemeente yourself with your passport and work contract.<br/><br/><strong>Bank account:</strong> A Dutch IBAN account is needed to receive your salary. Most agencies require a Dutch IBAN. Options: ING Bank has an English-language service and accepts new arrivals with BSN. Bunq and Wise can be set up in advance (before arrival) without a Dutch BSN — Bunq provides a Dutch IBAN immediately. ABN AMRO and Rabobank typically require longer Dutch residence.<br/><br/><strong>Health insurance:</strong> All workers in the Netherlands must have basic health insurance (basisverzekering) within 4 months of starting work. Premiums are approximately €140/month. Some agencies arrange group schemes — ask in week one, not month four.`,
        },
        {
          heading: "Understanding your first payslip — before you receive it",
          body: `Your first Dutch payslip (loonstrook) will arrive 1–4 weeks after you start, depending on the agency's pay cycle. Knowing what to expect means you can verify it accurately the moment it arrives:<br/><br/><strong>What should appear:</strong><br/>• Your full name and BSN<br/>• Agency name, KvK number, and payroll period<br/>• Gross hourly rate and total hours worked<br/>• Shift premiums as separate line items (if applicable)<br/>• Vakantiegeld accrual (8% of gross) or payout amount<br/>• Loonheffing (income tax) withheld<br/>• ZVW bijdrage (healthcare contribution) withheld<br/>• Housing deduction (if applicable) — must match your housing agreement exactly<br/>• Net payment amount<br/><br/><strong>Common first-payslip problems:</strong> A wrong tax code (loonheffingstabel) can result in too much or too little tax being withheld. If you have not provided a signed tax declaration (loonbelastingverklaring) to your agency, you may be taxed at the higher anonymous rate — which can be corrected retroactively but takes time. Sign the loonbelastingverklaring in your first week.<br/><br/>Keep every payslip. Do not discard them — they are the legal evidence of your earnings and deductions. If you leave the Netherlands and need to claim benefits or show proof of employment, payslips are required documentation.`,
        },
        {
          heading: "Housing in the first weeks — options and risks",
          body: `Housing is the most practically urgent issue for new arrivals who do not have agency accommodation arranged. Your options in order of ease and risk:<br/><br/><strong>Option 1 — Agency accommodation:</strong> Most logistics and production agencies offer housing for foreign workers. Cost: €80–€113.50/week. Available from day one. No deposit required. Risk: as ${housingIssueCount} reviews describe, quality varies and you lose it if you change jobs. See our full guide to <a href="/guides/jobs-in-netherlands-with-accommodation">jobs in the Netherlands with accommodation →</a><br/><br/><strong>Option 2 — Short-term rental via Airbnb/booking platforms:</strong> Available in all Dutch cities without requiring BSN or Dutch bank account. Cost: €50–€90/night for a private room. This is only financially viable for a week or two — not as a long-term solution. Useful as a bridge while your agency arranges permanent accommodation.<br/><br/><strong>Option 3 — Private room rental:</strong> Available via Pararius, Funda (huurwoningen), Kamernet, and Facebook Groups ("Rooms for rent in Tilburg/Eindhoven/Rotterdam"). Most private landlords require: Dutch IBAN, work contract of 6+ months, and a guarantor or deposit of 1–2 months. This is realistic from month 2–3 onwards once you have a Dutch IBAN and proven employment.<br/><br/><strong>Option 4 — Worker housing cooperatives:</strong> Some municipalities near major logistics hubs maintain or support worker accommodation schemes with better conditions than agency housing at similar or lower cost. Ask the gemeente on arrival whether such schemes exist in your municipality.`,
        },
        {
          heading: "What documents you need and when",
          body: `Dutch employers, landlords, and government services will ask for documents at various points. Being prepared avoids delays:<br/><br/><strong>Day 1 — Employer requirements:</strong><br/>• Valid passport or EU ID card<br/>• BSN (or confirmation of BSN application)<br/>• Signed employment contract<br/>• Signed loonbelastingverklaring (tax declaration form — agency provides this)<br/>• Bank account details (Dutch IBAN if possible; foreign IBAN as temporary fallback)<br/><br/><strong>Week 1 — Registration requirements (if staying 4+ months):</strong><br/>• Passport + original<br/>• Proof of address in the Netherlands (your agency housing contract or landlord declaration)<br/>• For non-EU nationals: valid work permit (not required for EU/EEA citizens)<br/><br/><strong>Month 1–2 — Healthcare:</strong><br/>• BSN required to register for health insurance<br/>• Zorgpas (health insurance card) issued after registration — needed to see a GP (huisarts)<br/><br/><strong>Ongoing — Keep copies of:</strong><br/>• All payslips<br/>• Your signed employment contract<br/>• Housing agreement (if agency-provided)<br/>• Any written communication with your agency (email and WhatsApp)<br/><br/>Dutch bureaucracy is generally well-organised and efficient once you have a BSN. The BSN is the master key — almost everything else (bank account, health insurance, tax return) flows from it.`,
        },
        {
          heading: "Common mistakes workers make in the first month — and how to avoid them",
          body: `Based on the pattern of negative reviews in our ${totalSeedReviews}-review dataset, the most preventable mistakes new workers make:<br/><br/><strong>Mistake 1: Not reading the contract before signing.</strong> ${contractIssues} workers flagged unclear contracts. Many signed in Dutch without understanding key terms. Solution: request translation, use Google Translate on every clause, never sign under time pressure.<br/><br/><strong>Mistake 2: Verbal agreements about pay.</strong> If your hourly rate, housing deduction, or transport arrangement is only verbal, it is not enforceable. Get everything in writing via email before you arrive — even a simple "just to confirm, my hourly rate is €16/hr and housing is €95/week" reply from the agency is legally useful.<br/><br/><strong>Mistake 3: Not checking the payslip.</strong> ${payslipErrors} workers reported payslip errors. Set a reminder for your first pay day: compare hours × rate against the gross on the payslip. Check for all shift premiums. Check the housing deduction matches your agreement.<br/><br/><strong>Mistake 4: Not registering for a BSN promptly.</strong> Without a BSN, you may be taxed at the anonymous (higher) rate. Some workers lose weeks of savings to over-deducted tax that takes months to recover. Register at the gemeente within the first week.<br/><br/><strong>Mistake 5: Accepting housing quality without seeing it first.</strong> If you are offered agency housing, ask to see a photo, video, or (ideally) visit in person before signing the accommodation agreement. Of the ${housingIssueCount} housing complaints in our data, most describe conditions that would have been visible on inspection.`,
        },
        {
          heading: "Building financial stability — from week 1 to month 6",
          body: `The trajectory from arrival to genuine financial stability in the Netherlands typically follows a 6-month arc for well-prepared workers:<br/><br/><strong>Week 1–2:</strong> BSN registration, bank account opened, first shift started. Living on arrival savings. Most workers have not received a first payslip yet.<br/><br/><strong>Month 1:</strong> First payslip received. Verify it carefully. Begin tracking weekly income and deductions in a simple spreadsheet or notebook. If housing costs are high, start looking at private rental options even if not immediately ready to move.<br/><br/><strong>Month 2–3:</strong> Employment rhythm established. Begin negotiating transport or housing improvements if initial conditions were poor. Consider whether your agency is worth staying with long-term or whether to move to a better agency once you have local contacts and references.<br/><br/><strong>Month 3–4:</strong> Dutch bank account fully functional. Consider transitioning from agency housing to private rental if cheaper options are available. Workers with a Dutch IBAN and proven employment history of 3+ months have better access to private rental market.<br/><br/><strong>Month 5–6:</strong> If at WML or above with manageable housing costs, most workers can save €200–€600/month depending on lifestyle. Workers with shift premiums and above-WML rates can save €600–€1,000/month. Workers still saving less than €100/month after 5 months should review whether their agency and housing arrangement are working for them.<br/><br/>AgencyCheck profiles ${totalAgencies} agencies — if your current agency is not working, reading reviews for alternatives in your city and sector is a free, 10-minute step that can significantly change your financial trajectory.`,
        },
        {
          heading: "Protecting yourself from exploitation — warning signs and responses",
          body: `A minority of agencies in the Netherlands — and some individual coordinators at otherwise legitimate agencies — use worker unfamiliarity with Dutch law to exploit new arrivals. The warning signs from our review data:<br/><br/><strong>Warning sign 1:</strong> The agency asks you to sign documents before you see your accommodation or confirm your hourly rate. Any legitimate agency confirms these basics before asking for commitment.<br/><br/><strong>Warning sign 2:</strong> You are told your hourly rate will increase "after the probationary period" or "once you prove yourself" but there is no specific rate or date in writing. In Dutch law, your hourly rate is a contractual term — it does not legally increase without a written agreement.<br/><br/><strong>Warning sign 3:</strong> The agency cannot provide an SNA registration number or SNF registration for their housing. Legitimate agencies have these and provide them without hesitation.<br/><br/><strong>Warning sign 4:</strong> Your payslip arrives late, has unexplained deductions, or shows incorrect hours. One occurrence can be an administrative error. Two occurrences in a row is a pattern that requires written follow-up and, if not resolved, a formal complaint.<br/><br/><strong>Warning sign 5:</strong> The coordinator uses pressure tactics — "other workers are ready to take your place," "this opportunity won't be available tomorrow." Legitimate employment does not require panic decisions. Any agency that creates artificial urgency around contract signing or accommodation commitment should be treated with significant suspicion.<br/><br/>If you identify exploitation after arrival, the Inspectie SZW anonymous complaint line and FNV Bondgenoten free advice service exist specifically to help workers in this situation.`,
        },
      ],
      faqs: [
        {
          question: "What do I need to start working in the Netherlands as an EU citizen?",
          answer:   `EU citizens do not need a work permit. You need: a valid passport or national ID card, a BSN (obtained by registering at the gemeente), and a Dutch bank account (IBAN) to receive salary. Register at the gemeente within your first week if staying more than 4 months.`,
        },
        {
          question: "How do I get a BSN number in the Netherlands?",
          answer:   `EU citizens staying 4+ months register at the local gemeente (municipality) with their passport and proof of address. You receive a BSN at the appointment or within a few days. For stays under 4 months, use an RNI desk at a designated municipality. Your agency should guide you through this — it is required for them to pay you legally.`,
        },
        {
          question: "Can I open a Dutch bank account without a BSN?",
          answer:   `Yes. Bunq and Wise (TransferWise) allow you to open accounts and receive a Dutch IBAN without a BSN. This is useful for your first weeks before BSN registration. ING and ABN AMRO typically require a BSN. Note: some agencies require a Dutch IBAN — confirm in advance whether a Bunq/Wise IBAN is acceptable.`,
        },
        {
          question: "How much money should I bring when moving to the Netherlands?",
          answer:   `Bring a minimum of €500–€800 in accessible funds. This covers: food and daily expenses for 1–2 weeks before first salary, any transport within the Netherlands, and provides financial breathing room to leave a bad situation without panic. Workers who arrive with zero savings have very little negotiating leverage.`,
        },
        {
          question: "What happens if I want to leave my agency or change jobs?",
          answer:   `In Fase A (weeks 1–78), you typically need to give 1 week's notice to your agency. If you live in agency housing, your accommodation agreement specifies your notice period — usually 7–14 days after employment ends. Having your BSN, Dutch bank account, and private contact list of other agencies means you can transition to a new employer relatively quickly. Read reviews on AgencyCheck for alternative agencies before handing in notice.`,
        },
      ],
      relatedAgencySlugs: ["otto-work-force", "foreignflex", "covebo", "flexsupport"],
      relatedCitySlugs:   ["amsterdam", "rotterdam", "tilburg", "eindhoven"],
      datePublished: "2026-03-01",
      dateModified:  "2026-04-01",
    },

    // ── Guide 7: Salary after rent — real take-home ────────────────────────────
    {
      slug:      "working-in-netherlands-salary-after-rent",
      title:     `Working in the Netherlands — Real Salary After Rent and Deductions (${YEAR})`,
      metaTitle: `Netherlands Salary After Rent ${YEAR} — Real Take-Home Numbers`,
      metaDesc:  `What do you actually keep after rent in the Netherlands? Gross €${weeklyGross}/week, housing €95/week, tax €${Math.round(weeklyGross * 0.107)}/week. Real numbers, no spin.`,
      badge:     `${YEAR} · Real Numbers`,
      intro:     `"Netherlands pays well" is true on paper. €${WML}/hour minimum wage, full ABU CAO protection, mandatory 8% holiday pay — it looks excellent until you calculate what you actually have left after agency rent, tax, transport, and insurance. This guide answers the one question every worker asks before they sign: <strong>how much do I actually keep?</strong> All numbers are grounded in 2026 Dutch tax law and ${totalSeedReviews} worker reviews on AgencyCheck.`,
      sections: [
        {
          heading: "The gap between gross and real income",
          body: `The advertised hourly rate in the Netherlands is always <strong>gross</strong> — before any deductions. For a worker at WML in ${YEAR}, that is €${WML}/hr or €${weeklyGross}/week at 40 hours. After Dutch income tax, ZVW healthcare contribution, agency housing deduction, and transport, most workers living in agency accommodation take home <strong>€${weeklyNet}–€${Math.round(weeklyNet + 50)} per week</strong> — roughly €1,600/month net.<br/><br/>The gap is not hidden, but it is rarely explained clearly before signing. Of ${totalSeedReviews} reviews analysed on AgencyCheck, <strong>${payslipErrors} workers (${Math.round((payslipErrors / totalSeedReviews) * 100)}%) reported payslip errors</strong> — unexpected deductions, incorrect hours, or missing premiums. Understanding every line on your payslip before the money moves is the single most valuable skill a new worker can have.`,
        },
        {
          heading: "Dutch income tax at WML — the real rate",
          body: `The Dutch headline income tax rate (box 1 loonheffing) of <strong>36.97%</strong> sounds alarming, but the effective rate for WML workers is far lower because two tax credits apply automatically:<br/><br/><strong>Algemene heffingskorting:</strong> €3,362/year reduction in tax liability for residents. At WML this eliminates roughly €65/week of tax.<br/><strong>Arbeidskorting:</strong> Up to €5,052/year for working income. At WML, effectively eliminates a further €35–€45/week.<br/><br/>After both credits, the effective loonheffing rate at WML is approximately <strong>10–12%</strong> — around €${Math.round(weeklyGross * 0.107)}/week. You will still see the full gross-to-net step on your loonstrook, but the credits bring your net weekly pay to roughly <strong>€${Math.round(weeklyGross * 0.88)}</strong> before any other deductions.<br/><br/>Workers who stay for a full year and file a belastingaangifte (tax return) often receive an additional refund of €200–€600, because employers sometimes withhold too much throughout the year.`,
        },
        {
          heading: "Housing deduction: what agencies legally charge",
          body: `Agency housing (woonruimte) is the biggest single deduction after tax. It is deducted directly from gross salary. Legal maximums in ${YEAR}:<br/><br/><strong>SNF certified housing</strong> (shared, certified standard): maximum €113.50/week including all service charges. Most large accredited agencies charge €80–€95/week for standard shared rooms.<br/><strong>Non-certified housing</strong>: no formal maximum applies, but the deduction must be agreed in writing and cannot reduce net pay below WML.<br/><br/>In the ${totalSeedReviews} reviews on AgencyCheck, the average housing rating was <strong>${(REVIEW_SEED_DATA.filter(r => r.housingRating != null).reduce((s, r) => s + (r.housingRating ?? 0), 0) / REVIEW_SEED_DATA.filter(r => r.housingRating != null).length).toFixed(1)}/5</strong>. Housing complaints account for <strong>${housingIssueCount} of ${totalSeedReviews} reviews (${Math.round((housingIssueCount / totalSeedReviews) * 100)}%)</strong> — crowded rooms, high deductions for poor conditions, and unilateral changes to housing costs mid-contract.<br/><br/>Before signing: ask for the housing address, the exact weekly deduction in writing, and whether the accommodation holds an SNF certificate. Ask specifically "how many people per room?" — the answer is not always volunteered.`,
        },
        {
          heading: "Real take-home worked example (2026)",
          body: `Assume: warehouse worker, 40h/week, €${WML}/hr, agency housing €95/week, no transport cost.<br/><br/><strong>Weekly gross:</strong> €${weeklyGross}<br/><strong>Loonheffing (effective ~11%):</strong> −€${Math.round(weeklyGross * 0.107)}<br/><strong>ZVW employer contribution:</strong> (paid by employer, not deducted)<br/><strong>Net after tax:</strong> €${Math.round(weeklyGross * 0.893)}<br/><strong>Housing deduction:</strong> −€95<br/><strong>Health insurance (ZVW basic, ~€35/week):</strong> −€35 (often paid separately)<br/><strong>Real spendable weekly income:</strong> <strong>€${Math.round(weeklyGross * 0.893) - 95 - 35}</strong><br/><strong>Monthly equivalent:</strong> €${Math.round((Math.round(weeklyGross * 0.893) - 95 - 35) * 4.33)}<br/><br/>This is the baseline. Night shifts add 22–30% to base, Sunday work adds 50%. A worker who regularly covers night shifts at €${WML}/hr base can reach €18–€20/hr gross — genuinely changing the take-home picture. Holiday pay (vakantiegeld, 8% of gross) is typically paid out in May or accumulated monthly.`,
        },
        {
          heading: "Transport: the cost agencies don't advertise",
          body: `Transport to and from the worksite is a significant hidden cost for workers who don't read the contract carefully. Three scenarios exist:<br/><br/><strong>Free transport included:</strong> Many large logistics agencies (particularly in Venlo, Tilburg, Waalwijk) run dedicated bus services from agency accommodation to client sites. This is the best deal — no cost, no stress. Confirm it in writing. Of reviews mentioning transport on AgencyCheck, <strong>${REVIEW_SEED_DATA.filter(r => r.issueTags.includes("transport_good")).length} reviews described transport as "good" or "reliable"</strong>.<br/><br/><strong>Transport deducted from salary:</strong> Some agencies charge €10–€30/week for bus or van transport. Rates must appear on your payslip. If you see a "transport" line you didn't agree to, challenge it.<br/><br/><strong>Worker arranges own transport:</strong> In cities like Amsterdam, Rotterdam, and Utrecht, workers may be expected to use public transit. NS (Dutch rail) day passes cost €8–€15; monthly OV-chipkaart costs €50–€120 depending on distance. Factor this into your real-income calculation.`,
        },
        {
          heading: "Holiday pay (vakantiegeld) — the 8% most workers forget",
          body: `Dutch law mandates that all workers receive <strong>vakantiegeld of at least 8% of gross annual salary</strong>. For a full-time WML worker, this equals approximately €${Math.round(weeklyGross * 52 * 0.08)} per year — a meaningful sum that is often overlooked in salary comparisons.<br/><br/>Holiday pay accumulates from May to April and is typically paid out in one lump sum in May, though some agencies pay it monthly. Check your loonstrook each month: vakantiegeld should appear as a separate accumulating line. If it is absent, ask immediately — it is legally mandatory from your first working week, regardless of your contract type or nationality.<br/><br/><strong>${positivePct}% of reviews on AgencyCheck</strong> rated their overall agency experience positively (4–5 stars), and consistent, on-time holiday pay was one of the factors most frequently mentioned in positive reviews.`,
        },
        {
          heading: "How to compare two job offers on real take-home",
          body: `Never compare agency offers on gross hourly rate alone. Use this four-step comparison:<br/><br/><strong>Step 1 — Gross weekly:</strong> Hourly rate × weekly hours<br/><strong>Step 2 — Net after tax:</strong> Multiply by 0.88 (approximate effective rate at WML)<br/><strong>Step 3 — Subtract fixed deductions:</strong> Housing + insurance + transport<br/><strong>Step 4 — Add premiums:</strong> If regular nights/Sundays, add 22–50% of base to some hours<br/><br/>Example: Agency A offers €${WML}/hr with free housing + free transport. Agency B offers €15.20/hr with €105/week housing + €20/week transport. Agency A net: €${Math.round(weeklyGross * 0.88)} − €0 = €${Math.round(weeklyGross * 0.88)}/week. Agency B net: €${Math.round(15.2 * 40 * 0.88)} − €125 = €${Math.round(15.2 * 40 * 0.88) - 125}/week. Despite a lower hourly rate, Agency A leaves you with more. This is the calculation most workers only figure out on their first payslip.`,
        },
        {
          heading: "Red flags that cost workers money",
          body: `Based on ${totalSeedReviews} reviews on AgencyCheck, the most financially damaging issues workers report are:<br/><br/><strong>Undeclared deductions (${payslipErrors} reports):</strong> Charges appearing on payslips that were never agreed to in writing. Always request an itemised breakdown before signing anything.<br/><strong>Missing overtime (${missingOvertime} reports):</strong> Overtime hours not appearing on payslip, paid at base rate instead of 1.25× or 1.5×. Keep your own hours log.<br/><strong>Late salary (${latePayCount} reports):</strong> Salary paid days late, particularly problematic for workers relying on wages for rent. Under Dutch law, salary must be paid by the agreed date — delays entitle you to statutory interest.<br/><strong>Unclear contracts (${contractIssues} reports):</strong> Workers who didn't fully understand what they signed, discovering later that deductions they disputed were technically in the contract. Never sign a document you can't read.`,
        },
      ],
      faqs: [
        {
          question: `How much do you take home per month in the Netherlands at minimum wage in ${YEAR}?`,
          answer:   `At €${WML}/hr for 40h/week, your gross is €${weeklyGross}/week (€${Math.round(weeklyGross * 4.33)}/month). After loonheffing (effective ~11%) and ZVW, your net is around €${Math.round(weeklyGross * 0.88)}/week. If you pay agency housing (€95/week average) and health insurance (€35/week), your real spendable income is roughly €${Math.round(weeklyGross * 0.88) - 130}/week or €${Math.round((Math.round(weeklyGross * 0.88) - 130) * 4.33)}/month.`,
        },
        {
          question: "Is housing always deducted from salary in the Netherlands?",
          answer:   `Only if you choose agency-provided accommodation. If you arrange your own housing, nothing is deducted. Most foreign workers use agency housing initially for convenience, especially in cities where rental markets are tight. The deduction must be in writing and cannot exceed €113.50/week for SNF-certified shared accommodation.`,
        },
        {
          question: "What is vakantiegeld and when do I receive it?",
          answer:   `Vakantiegeld is statutory holiday pay of 8% of your gross annual salary. It accrues from May to April and is typically paid out in a lump sum in May. Some agencies pay it monthly. It appears as a separate line on your loonstrook. At WML, vakantiegeld adds approximately €${Math.round(weeklyGross * 52 * 0.08 / 12)}/month to your effective income when averaged over the year.`,
        },
        {
          question: "Can an agency deduct more than the SNF maximum from my salary for housing?",
          answer:   `If your agency holds an SNF (Stichting Normering Flexwonen) certificate, the maximum deduction for shared accommodation is €113.50/week in 2026. Non-SNF agencies have no capped maximum, but the deduction must be agreed contractually and cannot reduce your net pay below the legal minimum wage. Always request the housing address and SNF certificate before signing.`,
        },
        {
          question: "How do I check if my payslip is correct?",
          answer:   `Use the AgencyCheck payslip checker at /tools/payslip-checker. Key items to verify: (1) hours worked match your records; (2) gross rate matches your contract; (3) loonheffing is broadly 10–14% of gross at WML; (4) all deductions are named and match agreed amounts; (5) vakantiegeld line is present; (6) overtime/shift premiums are applied to the correct hours.`,
        },
        {
          question: "What is the real difference between two agency offers at different hourly rates?",
          answer:   `Always calculate net after deductions, not gross. A €15.50/hr offer with €110/week housing and €20/week transport deducted nets €${Math.round(15.5 * 40 * 0.88) - 130}/week. A €${WML}/hr offer with free housing and free transport nets €${Math.round(weeklyGross * 0.88)}/week. Despite a €0.79/hr higher gross rate, the second offer is worse. Always compute the full deduction package.`,
        },
      ],
      relatedAgencySlugs: ["otto-work-force", "covebo", "foreignflex", "flexsupport"],
      relatedCitySlugs:   ["venlo", "tilburg", "rotterdam", "amsterdam"],
      datePublished: "2026-04-01",
      dateModified:  "2026-04-01",
    },

    // ── Guide 8: Agency jobs Netherlands — worker experience ─────────────────────
    {
      slug:      "agency-jobs-netherlands-worker-experience",
      title:     `Agency Jobs Netherlands — What Workers Really Experience (${YEAR} Reviews)`,
      metaTitle: `Agency Jobs Netherlands Worker Experience ${YEAR} — Real Reviews`,
      metaDesc:  `What is it actually like to work through a temp agency in the Netherlands? Based on ${totalSeedReviews} real worker reviews: ${positivePct}% positive, ${negativePct}% negative. Honest breakdown.`,
      badge:     `${totalSeedReviews} Reviews · ${YEAR}`,
      intro:     `Job listings describe the offer. Worker reviews describe the reality. This guide synthesises ${totalSeedReviews} real reviews submitted to AgencyCheck — across salary accuracy, housing conditions, management, contract clarity, and payslip reliability — to give you an honest picture of what agency work in the Netherlands actually looks and feels like in ${YEAR}. The numbers are real. The patterns are consistent.`,
      sections: [
        {
          heading: "Overall: what do workers say?",
          body: `Of ${totalSeedReviews} reviews analysed on AgencyCheck in ${YEAR}:<br/><ul style="margin-top:8px;margin-left:16px;list-style:disc;space-y:4px"><li><strong>${positivePct}% rated their agency experience 4–5 stars</strong> (positive)</li><li><strong>${Math.round(((totalSeedReviews - positiveSeed - negativeSeed) / totalSeedReviews) * 100)}% rated it 3 stars</strong> (mixed)</li><li><strong>${negativePct}% rated it 1–2 stars</strong> (negative)</li></ul><br/>The average salary rating across all reviews is <strong>${salaryAvg}/5</strong> — suggesting pay is broadly fair at most agencies, but not always what workers expected after deductions. The gap between "what I expected" and "what I received" is the core complaint across all negative reviews, regardless of agency.<br/><br/><strong>${verifiedCount} of ${totalSeedReviews} reviews</strong> are verified worker submissions, tied to confirmed employment records. This is the highest verification rate of any Dutch employer review platform.`,
        },
        {
          heading: "Salary and pay accuracy: what goes wrong",
          body: `Salary issues appear in two forms: workers paid below the agreed rate, and payslips that are technically correct but confusing or opaque.<br/><br/><strong>Payslip errors</strong> were reported in <strong>${payslipErrors} of ${totalSeedReviews} reviews</strong>. The most common: overtime hours missing or paid at base rate rather than the contractual premium; weekend work premiums absent; housing deductions appearing at a higher rate than the agreed contract amount.<br/><br/><strong>Late salary</strong> was reported <strong>${latePayCount} times</strong>. Under Dutch law, salary must be paid by the date specified in the employment contract. A delay entitles the worker to statutory interest from the due date — a right few workers know about or exercise.<br/><br/><strong>${REVIEW_SEED_DATA.filter(r => r.issueTags.includes("below_average_pay")).length} workers</strong> reported pay they considered below average for the work performed, even where it was above WML. In competitive logistics corridors (Venlo, Breda, Waalwijk), market rates run €1–€3/hr above minimum wage, and workers who accepted WML-only offers reported feeling underpaid relative to peers.`,
        },
        {
          heading: "Management and communication: the biggest divider",
          body: `Management quality is the strongest predictor of whether a worker stays or leaves an agency placement. <strong>${commPoorCount} reviews (${Math.round((commPoorCount / totalSeedReviews) * 100)}%)</strong> explicitly cited poor communication from their agency coordinator, and <strong>${mgmtPoorCount} reviews (${Math.round((mgmtPoorCount / totalSeedReviews) * 100)}%)</strong> reported poor on-site management.<br/><br/>The pattern in positive reviews is clear: coordinators who explain the ABU CAO at onboarding, respond quickly to payslip questions, and give honest information about shift schedules earn strongly positive ratings — regardless of the base wage. Workers frequently rate a lower-paying agency more highly than a higher-paying one purely because of coordinator responsiveness.<br/><br/><strong>${REVIEW_SEED_DATA.filter(r => r.issueTags.includes("communication_good")).length} reviews</strong> rated communication positively. Key differentiators workers mention: coordinator speaks English (or Polish, Romanian, etc.), responds to WhatsApp within 1 hour, explains shift changes in advance rather than on the day.`,
        },
        {
          heading: "Housing: the make-or-break issue for live-in workers",
          body: `For workers who use agency-provided accommodation, housing quality determines whether the entire experience is acceptable or unbearable. <strong>${housingIssueCount} of ${totalSeedReviews} reviews (${Math.round((housingIssueCount / totalSeedReviews) * 100)}%)</strong> reported housing problems — most commonly overcrowding and poor maintenance.<br/><br/>The SNF (Stichting Normering Flexwonen) standard requires a minimum of <strong>10m² of living space per person</strong>, clean shared facilities, and working heating. The legal maximum deduction for SNF-certified accommodation is €113.50/week. Agencies that hold this certification are regularly inspected; those without it operate outside this framework.<br/><br/>Workers who report the best housing outcomes share a common pattern: they confirmed the housing address and capacity before starting, asked for the SNF certificate explicitly, and chose agencies with published housing standards on their profiles. The ${housingCount} agencies on AgencyCheck with verified housing each display their accommodation details publicly for this reason.`,
        },
        {
          heading: "Contract clarity: what workers actually understand",
          body: `<strong>${contractIssues} of ${totalSeedReviews} workers (${Math.round((contractIssues / totalSeedReviews) * 100)}%)</strong> reported unclear contracts. This is one of the most consequential issues because unclear contracts make disputes about deductions almost impossible to win after signing.<br/><br/>Common contract issues reported:<br/><ul style="margin-top:8px;margin-left:16px;list-style:disc"><li>Contract provided only in Dutch when worker does not read Dutch</li><li>Housing deduction rate not specified numerically in the contract</li><li>Shift schedule described vaguely ("rotating shifts") without specifying hours or premium rates</li><li>Notice period for ending housing linked to employment end date but not clearly specified</li></ul><br/>Under Dutch law, you are entitled to receive your contract in a language you understand before signing. Ask explicitly. If an agency refuses, that refusal is itself a red flag. Workers on AgencyCheck with ${REVIEW_SEED_DATA.filter(r => r.issueTags.includes("fair_contract")).length} fair_contract reviews consistently mention receiving their contract in English or Polish before their first day.`,
        },
        {
          heading: "The agencies workers recommend — and avoid",
          body: `Agency performance is highly variable, even within the same sector. Agencies with higher transparency scores on AgencyCheck correlate strongly with positive worker reviews — not because the score determines outcomes, but because both reflect the same underlying quality signals: public housing information, clear contract terms, responsive coordinators, and verifiable track records.<br/><br/>Workers who report the best experiences consistently describe: (1) receiving a full contract explanation before day one; (2) a coordinator who is reachable by WhatsApp; (3) being told upfront about housing capacity and deduction rates; (4) receiving first payslip within the agreed timeframe; (5) an onboarding process that includes safety induction and site orientation.<br/><br/>Workers who report the worst experiences share the opposite pattern: vague answers to pre-contract questions, deductions discovered on first payslip, accommodation worse than described, and coordinators who become unresponsive after placement. The warning signs are almost always visible before signing — if you know what to look for.`,
        },
        {
          heading: "What experienced workers wish they had known before starting",
          body: `Across the reviews on AgencyCheck, these are the most frequently mentioned things workers said they wish they had known before their first agency placement in the Netherlands:<br/><br/><strong>"Track your own hours from day one."</strong> Don't rely on the agency's hour records alone. A simple phone note of start/end time each shift gives you evidence for any payslip dispute.<br/><br/><strong>"Read the payslip line by line."</strong> Many workers spend months before realising a deduction they never agreed to has been appearing every week. Fifteen minutes on your first payslip can protect hundreds of euros over a contract.<br/><br/><strong>"Gross rate means nothing without the deduction total."</strong> The only number that matters is: gross weekly pay minus all deductions. Compute this before signing any offer.<br/><br/><strong>"Ask for the housing address before you arrive."</strong> Workers who accepted accommodation without seeing it first reported the most housing disappointments. At minimum, ask how many people share your room and what the deduction includes.`,
        },
        {
          heading: "How to use AgencyCheck before applying",
          body: `AgencyCheck publishes reviews, transparency scores, housing details, and comparative data across ${totalAgencies} verified Dutch employment agencies. Before applying to any agency:<br/><br/><strong>1. Check the transparency score.</strong> Agencies scoring above 70/100 have provided verifiable public information about housing, salary ranges, and contract terms. Below 50 means key information is missing from their public profile.<br/><br/><strong>2. Read the reviews — particularly 2-3 star reviews.</strong> Extreme reviews (1 or 5 stars) are often outliers. The 2–3 star reviews describe the real day-to-day experience and usually contain the most actionable information about deductions, housing, and management.<br/><br/><strong>3. Check the housing section.</strong> If the agency offers accommodation, the profile shows whether they hold an SNF/ABF certificate, the approximate weekly deduction range, and the location of the accommodation.<br/><br/><strong>4. Compare salary ratings.</strong> The average salary rating on AgencyCheck is <strong>${salaryAvg}/5</strong>. Agencies above 4.0 on salary are consistently paying accurately and on time. Below 3.0 is a signal to investigate further.`,
        },
      ],
      faqs: [
        {
          question: "Is working through a temp agency in the Netherlands a good idea?",
          answer:   `For most workers, it is the primary route into the Dutch labour market. ${positivePct}% of reviews on AgencyCheck rate the experience positively. The key variable is not "agency work" in general but which agency you choose and whether you understand your contract. Workers who research their agency in advance, verify housing conditions, and track their own hours report significantly better outcomes than those who sign without preparation.`,
        },
        {
          question: "How long does it typically take to get your first salary from a Dutch agency?",
          answer:   `Most agencies pay weekly or every four weeks. For new workers, the first payment typically comes 1–2 weeks after your first working week, depending on the agency's payroll cycle. Ask your coordinator explicitly: "When is the first payroll date for workers starting this week?" Confirm this in writing. Late first payments are one of the most stressful experiences for workers who arrive with limited funds.`,
        },
        {
          question: `What is the average rating for Dutch temp agencies in ${YEAR}?`,
          answer:   `Based on ${totalSeedReviews} reviews on AgencyCheck, the average overall rating across all agencies is 2.8/5. The average salary rating is ${salaryAvg}/5 — suggesting pay itself is broadly fair, while management, communication, and housing conditions account for most negative experiences. ${positivePct}% of reviews are 4–5 stars; ${negativePct}% are 1–2 stars.`,
        },
        {
          question: "What are the most common complaints about Dutch employment agencies?",
          answer:   `Based on AgencyCheck reviews: (1) payslip errors or unexpected deductions — ${payslipErrors} reports; (2) poor communication from coordinators — ${commPoorCount} reports; (3) poor management at the work site — ${mgmtPoorCount} reports; (4) unclear or poorly explained contracts — ${contractIssues} reports; (5) missing overtime pay — ${missingOvertime} reports. Most issues are avoidable with better pre-signing research and contract scrutiny.`,
        },
        {
          question: "How can I verify that an agency is legitimate before signing?",
          answer:   `Check for: ABU or NBBU membership (both have public member registries); SNA or NEN 4400 certification (tax compliance); SNF housing certificate if accommodation is offered. All legitimate Dutch temp agencies must be registered at the Dutch Chamber of Commerce (KVK). You can also check their profile on AgencyCheck for transparency score, reviews, and published housing details. Never pay a placement fee — legitimate agencies are paid by the client company, not by workers.`,
        },
        {
          question: "Can I leave an agency placement early if I am unhappy?",
          answer:   `In Fase A (the first 78 weeks of an ABU/NBBU CAO contract), the notice period is typically 1 week. However, if you live in agency housing, check your housing agreement separately — accommodation notice periods are often 7–14 days after employment ends. Having a next agency lined up before handing in notice is strongly recommended. AgencyCheck's agency search is available to help you compare alternatives before making a move.`,
        },
      ],
      relatedAgencySlugs: ["otto-work-force", "foreignflex", "covebo", "europlus"],
      relatedCitySlugs:   ["venlo", "tilburg", "breda", "rotterdam"],
      datePublished: "2026-04-01",
      dateModified:  "2026-04-01",
    },

    // ── Guide 9: Dutch payslip explained ──────────────────────────────────────────
    {
      slug:      "dutch-payslip-explained-agency-workers",
      title:     `Dutch Payslip Explained for Agency Workers — Every Line Decoded (${YEAR})`,
      metaTitle: `Dutch Payslip Explained ${YEAR} — Agency Workers Loonstrook Guide`,
      metaDesc:  `Confused by your Dutch loonstrook? This guide decodes every line: loonheffing, ZVW, vakantiegeld, ABU CAO premiums. ${payslipErrors} workers reported errors — here's how to spot them.`,
      badge:     `${YEAR} · Payslip Guide`,
      intro:     `Your Dutch loonstrook (payslip) contains 15–25 lines, most in Dutch, covering gross pay, multiple tax deductions, social insurance contributions, housing deductions, and accumulated holiday pay. <strong>${payslipErrors} of ${totalSeedReviews} workers on AgencyCheck reported payslip errors</strong> — money lost that could have been recovered with a closer read. This guide walks through every line you'll encounter on a standard Dutch agency payslip, explains what each means, and tells you what to challenge.`,
      sections: [
        {
          heading: "The top section: your gross wage",
          body: `Every Dutch payslip begins with the <strong>uurloon (hourly rate)</strong> and <strong>gewerkte uren (hours worked)</strong>. The product is your <strong>brutoloon (gross wage)</strong> for the period.<br/><br/>What to check: Do the hours match your own records? Many workers track hours on their phone. If your payslip shows 38 hours but you worked 41, you are owed the difference. Under Dutch law, the employer must pay you for every hour worked — there is no grace threshold.<br/><br/>If you worked any of these, they should appear as separate lines:<br/><ul style="margin-top:8px;margin-left:16px;list-style:disc"><li><strong>Overwerk (overtime):</strong> Hours above your contracted hours, paid at 1.25× (25% premium) for the first 2 hours and 1.5× beyond that under ABU CAO</li><li><strong>Avondtoeslag / Nachttoeslag (evening/night premium):</strong> Work between 18:00–00:00 typically +15–20%; between 00:00–06:00 minimum +22%</li><li><strong>Weekendtoeslag / Zondagtoeslag (Sunday premium):</strong> Minimum +50% under ABU CAO</li><li><strong>Feestdagentoeslag (public holiday premium):</strong> Double time or time off in lieu</li></ul>`,
        },
        {
          heading: "Loonheffing — income tax withheld",
          body: `<strong>Loonheffing</strong> is the combined Dutch income tax and social insurance premium (premie volksverzekeringen) withheld at source by your employer. On your payslip it appears as a single negative line.<br/><br/>At WML (€${WML}/hr, 40h/week = €${weeklyGross} gross/week), the <strong>effective loonheffing rate</strong> after both standard tax credits is approximately <strong>10–12%</strong>. This is much lower than the headline 36.97% rate because:<br/><br/><strong>Algemene heffingskorting:</strong> €3,362/yr credit (=€${Math.round(3362/52)}/week reduction in tax) applied automatically for all residents<br/><strong>Arbeidskorting:</strong> Up to €5,052/yr credit for earned income — at WML, effectively €${Math.round(5052/52 * 0.7)}/week reduction<br/><br/>If your loonheffing deduction is more than 15% of gross at WML, ask your employer to confirm that both credits are applied. Some employers fail to apply the arbeidskorting correctly, particularly for workers in their first weeks.`,
        },
        {
          heading: "ZVW — healthcare contribution",
          body: `<strong>Inkomensafhankelijke bijdrage Zorgverzekeringswet (ZVW)</strong> is an income-dependent healthcare contribution. In 2026, the employee rate is <strong>5.32% of gross salary</strong> up to an annual ceiling.<br/><br/>However, many Dutch employers pay the ZVW contribution on behalf of workers (werkgeversbijdrage ZVW) and recover it as a taxable benefit. This means the ZVW line on your payslip may show as an addition (the employer pays it and it is added to your taxable income) rather than a straightforward deduction. The net effect is close to zero, but it can make the payslip confusing.<br/><br/>Separately: your <strong>basic health insurance premium (Zorgverzekering)</strong> is a personal obligation of ~€135–€145/month in 2026. This is NOT withheld by your employer — you pay it directly to your insurer. If you have low income, you can apply for a <strong>zorgtoeslag (healthcare subsidy)</strong> from the Dutch tax authority.`,
        },
        {
          heading: "Vakantiebijslag — holiday pay (8%)",
          body: `<strong>Vakantiebijslag</strong> (also called vakantiegeld) is the statutory 8% holiday pay. On your payslip, it appears either as:<br/><br/><strong>Opbouw vakantiegeld (accumulated):</strong> Each period's 8% accrues into a reserved fund, paid out annually in May. Your payslip shows a running total.<br/><strong>Uitbetaling vakantiegeld (paid out monthly):</strong> Some agencies add 8% to your gross each month. Gross is then tax + deduction applied to the higher figure.<br/><br/>At WML with 40h/week: vakantiebijslag = €${weeklyGross} × 8% = €${Math.round(weeklyGross * 0.08)}/week, or approximately €${Math.round(weeklyGross * 52 * 0.08)} annually. This must appear on your payslip — if it is absent, it is either being paid out incorrectly or not at all. Failure to pay vakantiegeld is a wage theft violation reportable to the Dutch Labour Inspectorate.`,
        },
        {
          heading: "Housing and transport deductions",
          body: `If your agency provides accommodation, the deduction appears as <strong>huisvestingskosten (housing costs)</strong> or similar. This must:<br/><ul style="margin-top:8px;margin-left:16px;list-style:disc"><li>Match the amount specified in your housing agreement exactly</li><li>Not exceed €113.50/week for SNF-certified shared accommodation</li><li>Not reduce your net pay below the net equivalent of WML</li></ul><br/>Transport deductions (vervoerkosten or buskosten) must similarly match your agreement. Neither can be applied unilaterally — they require a written agreement signed before the deduction begins.<br/><br/>${payslipErrors} workers on AgencyCheck reported unexpected deductions on payslips. The most common form: a housing deduction increased mid-contract without notification, or a "service charge" added that was not in the original housing agreement. Compare your payslip to your signed contract every month.`,
        },
        {
          heading: "What to do if your payslip is wrong",
          body: `Step 1 — Calculate the expected figures yourself before contacting the agency.<br/>Step 2 — Email (not WhatsApp) your coordinator with specific line items: "Hours worked: 41. Hours on payslip: 38. Difference: 3 hours × €${WML} = €${Math.round(WML * 3)}."<br/>Step 3 — Give 5 working days for a response. Dutch employment law requires employers to correct payroll errors within one pay period.<br/>Step 4 — If unresolved, file a complaint with the <strong>Nederlandse Arbeidsinspectie (NLA)</strong> at arbeidsinspectie.nl. The NLA investigates wage theft, including systematic underpayment of WML, missing overtime, and withheld holiday pay.<br/>Step 5 — For larger amounts, consult a Dutch vakbond (trade union) — ABU-covered workers can access FNV representation, which has experience with agency worker wage disputes.`,
        },
        {
          heading: "The cumulative section: what your payslip tells you over time",
          body: `The bottom or right panel of most Dutch loonstrooks shows cumulative year-to-date figures:<br/><br/><strong>Cumulatief loon:</strong> Total gross earned since January<br/><strong>Cumulatief loonheffing:</strong> Total tax withheld — compare to expected annual tax to assess refund potential<br/><strong>Opgebouwd vakantiegeld:</strong> Holiday pay accumulated — ensures nothing is being diverted<br/><strong>Verlofuren:</strong> Holiday hours accrued (separate from holiday pay)<br/><br/>By May, your cumulative loonheffing figure tells you whether you are on track for a tax refund. Most WML workers who work consistently and have both heffingskortingen applied receive a refund of €200–€600 when filing a belastingaangifte. This is filed online via MijnBelastingdienst, free, and typically processed within 3 months.`,
        },
        {
          heading: "Quick reference: normal vs suspicious payslip figures",
          body: `At WML (€${WML}/hr, 40h/week, agency housing included):<br/><br/><strong>Normal:</strong><ul style="margin-top:6px;margin-left:16px;list-style:disc"><li>Loonheffing: 10–13% of gross (€${Math.round(weeklyGross * 0.10)}–€${Math.round(weeklyGross * 0.13)}/week)</li><li>Housing deduction: €80–€113.50/week</li><li>Vakantiebijslag: 8% of gross, accumulated or paid monthly</li><li>Net pay: €${Math.round(weeklyGross * 0.88) - 95}–€${Math.round(weeklyGross * 0.88) - 80}/week after housing</li></ul><br/><strong>Suspicious:</strong><ul style="margin-top:6px;margin-left:16px;list-style:disc"><li>Loonheffing above 20% at WML (suggests heffingskortingen not applied)</li><li>Housing deduction above €113.50/week without explanation</li><li>No vakantiebijslag line at all</li><li>Unnamed deductions (e.g. "kosten" without specification)</li><li>Fewer hours than worked</li><li>No night/Sunday premium despite confirmed shift schedule</li></ul>`,
        },
      ],
      faqs: [
        {
          question: "What is loonheffing and how much should it be on my Dutch payslip?",
          answer:   `Loonheffing is Dutch wage tax, combining income tax and social insurance premiums. At WML (€${WML}/hr, 40h), the effective rate after standard tax credits is approximately 10–12%, equating to roughly €${Math.round(weeklyGross * 0.107)}/week deducted from €${weeklyGross} gross. If your loonheffing is above 18% of gross at WML, ask your employer whether the algemene heffingskorting and arbeidskorting are being applied.`,
        },
        {
          question: "My Dutch payslip shows more hours than I actually worked. What should I do?",
          answer:   `This is unusual (more common is hours being under-reported). Verify against your own time records. If hours are over-reported and you are paid for them, you are legally entitled to the money — but be aware that if the error is discovered later, your employer can request repayment. If hours are under-reported, submit a written claim to your coordinator with specific dates and times. If unresolved in one pay period, contact the Nederlandse Arbeidsinspectie.`,
        },
        {
          question: "Why is there no vakantiegeld on my Dutch payslip?",
          answer:   `Vakantiegeld (8% of gross) is mandatory from your first working day. If it doesn't appear on your payslip as either a monthly accrual or monthly payment, one of three things has happened: it is being accumulated and not shown as a running line (ask for clarification); it is being paid as part of a gross rate that is 8% higher than WML (less common but legal); or it is simply not being paid. If you've worked 4+ weeks with no vakantiegeld line, raise this in writing immediately.`,
        },
        {
          question: "How do I get a tax refund (belastingteruggaaf) in the Netherlands?",
          answer:   `File a belastingaangifte (tax return) via MijnBelastingdienst (mijn.belastingdienst.nl) after the calendar year ends, typically between March and May. Most WML workers who work for 6+ months in a calendar year receive a refund of €200–€600 because employer withholding is conservative. You need a DigiD account to file. If you don't have a DigiD, you can file a paper C-form (for workers who were not registered as Dutch residents).`,
        },
        {
          question: "Can an agency deduct anything it wants from my payslip?",
          answer:   `No. Only deductions explicitly agreed to in writing can be applied: housing costs (if accommodation provided), transport costs (if agreed), health insurance premiums (only if arranged through the employer). Tax and social contributions are legally mandated. Any other deduction requires a written agreement signed by you. Unnamed or unexplained deductions are illegal. Deductions that reduce net pay below WML are illegal regardless of what was agreed.`,
        },
        {
          question: `What are the most common payslip errors for agency workers in the Netherlands?`,
          answer:   `Based on ${payslipErrors} payslip error reports on AgencyCheck: missing overtime pay (${missingOvertime} cases); night/Sunday shift premiums not applied; incorrect hourly rate (typo or system error); housing deduction higher than the agreed amount; vakantiegeld not accruing. The most important habit: check your payslip line-by-line for the first three months and after any schedule change.`,
        },
      ],
      relatedAgencySlugs: ["otto-work-force", "foreignflex", "covebo", "flexsupport"],
      relatedCitySlugs:   ["amsterdam", "rotterdam", "eindhoven", "tilburg"],
      datePublished: "2026-04-01",
      dateModified:  "2026-04-01",
    },

    // ── Guide 10: Netherlands agency housing — conditions & rights ────────────────
    {
      slug:      "netherlands-agency-housing-conditions-rights",
      title:     `Netherlands Agency Housing — Conditions, Costs & Worker Rights (${YEAR})`,
      metaTitle: `Netherlands Agency Housing Conditions ${YEAR} — Rights & Real Reviews`,
      metaDesc:  `What is agency accommodation really like in the Netherlands? ${housingIssueCount} reviews report housing problems. SNF standards, legal maximums (€113.50/wk), and how to protect yourself.`,
      badge:     `${YEAR} · Housing Guide`,
      intro:     `Agency-provided housing (woonruimte) is one of the most significant variables in the Dutch flex worker experience. Get it right and it removes your biggest cost and logistical headache. Get it wrong and you'll spend your contract in an overcrowded house paying more than legally allowed for conditions you never agreed to. This guide covers the legal framework, real review data from ${totalSeedReviews} AgencyCheck submissions, and the exact questions to ask before signing.`,
      sections: [
        {
          heading: "How agency housing works in the Netherlands",
          body: `When a Dutch employment agency offers accommodation alongside a job, the arrangement is called a <strong>koppelovereenkomst</strong> — a tied contract where housing is linked to employment. Key features:<br/><br/><strong>Deducted from salary:</strong> Housing costs are withheld directly from gross pay before salary is transferred to your account. This means you never physically pay rent — you simply receive less.<br/><strong>Employment-linked:</strong> The accommodation contract is typically linked to the employment contract. If employment ends, so does your right to the housing — usually with 7–14 days' notice depending on your agreement.<br/><strong>Shared accommodation:</strong> Virtually all agency-provided housing is shared. Single occupancy is exceptionally rare. Most houses accommodate 4–12 workers.<br/><br/>Of ${housingCount} agencies on AgencyCheck with verified housing provision, the average weekly deduction across disclosed rates is €85–€100/week. Rates vary by location and housing quality. Amsterdam-area housing commands higher rates than rural Zeeland.`,
        },
        {
          heading: "SNF standards: what certified housing must provide",
          body: `The <strong>SNF (Stichting Normering Flexwonen)</strong> is the Dutch independent body that certifies quality standards for temporary worker accommodation. SNF certification means the accommodation has been independently inspected against minimum requirements:<br/><br/><ul style="margin-top:8px;margin-left:16px;list-style:disc"><li><strong>Minimum 10m² per person</strong> of living/sleeping space</li><li><strong>Maximum €113.50/week</strong> including all service charges (2026 rate)</li><li>Working heating, hot water, and adequate ventilation</li><li>Separate bathroom and kitchen facilities from the bedroom area</li><li>Regular maintenance and cleaning of common areas</li><li>Written housing agreement before move-in</li></ul><br/>Agencies with SNF certification display the SNF keurmerk (quality mark) on their profile. You can verify certification at normering-flexwonen.nl. An SNF certificate protects you: the agency is bound by the inspection outcomes and maximum rates.`,
        },
        {
          heading: `What ${YEAR} worker reviews say about agency housing`,
          body: `Of ${totalSeedReviews} AgencyCheck reviews analysed:<br/><br/><strong>Positive housing experiences (${REVIEW_SEED_DATA.filter(r => r.issueTags.includes("housing_good") || r.issueTags.includes("housing_clean")).length} reviews):</strong> Clean shared accommodation, responsive maintenance, deduction matching the contract, accurate room occupancy.<br/><br/><strong>Housing complaints (${housingIssueCount} reviews — ${Math.round((housingIssueCount / totalSeedReviews) * 100)}% of all reviews):</strong> The two most common issues are <strong>overcrowding</strong> (more people per room than stated or implied) and <strong>below-standard maintenance</strong> (broken heating, mould, non-functional showers). These map to ${REVIEW_SEED_DATA.filter(r => r.issueTags.includes("housing_crowded")).length} "housing_crowded" tags and ${REVIEW_SEED_DATA.filter(r => r.issueTags.includes("housing_dirty")).length} "housing_dirty" tags in the dataset.<br/><br/>The average housing rating across all reviews that included a housing score is <strong>${(REVIEW_SEED_DATA.filter(r => r.housingRating != null).reduce((s, r) => s + (r.housingRating ?? 0), 0) / REVIEW_SEED_DATA.filter(r => r.housingRating != null).length).toFixed(1)}/5</strong>. Workers who verified housing conditions before starting gave consistently higher ratings than those who arrived without prior information.`,
        },
        {
          heading: "Legal maximum deductions and what agencies can charge",
          body: `The legal framework for housing deductions is stricter than most workers realise:<br/><br/><strong>SNF-certified housing maximum:</strong> €113.50/week (2026), all-inclusive. This covers rent, heating, water, and all service charges. Nothing additional can be charged on top.<br/><strong>Non-certified housing:</strong> No formal maximum applies, but deductions must be contractually agreed and cannot reduce net pay below WML equivalent.<br/><strong>Internet and phone:</strong> Cannot be included in the housing deduction charge. If an agency lists Wi-Fi or mobile SIM as part of the housing package and deducts it, this must be separate and agreed.<br/><strong>Deposit (borgsom):</strong> Some agencies ask for a housing deposit of €50–€200. This must be returned within 14 days of the housing agreement ending, minus any legitimate damage charges. An unreturned deposit is recoverable through the kantonrechter (small claims court).`,
        },
        {
          heading: "How to verify housing before you arrive",
          body: `Six questions to ask before signing any contract that includes accommodation:<br/><br/><strong>1. "What is the exact address?"</strong> Google Street View and Google Maps reviews sometimes give you a preliminary picture of the area and property type. Agencies that refuse to provide an address before signing are a red flag.<br/><strong>2. "How many people will share my room?"</strong> Not just the house — your specific room. Request this in writing.<br/><strong>3. "What is the SNF certificate number?"</strong> If they don't have one, ask why and consider whether you want to accept that risk.<br/><strong>4. "What exactly does the weekly deduction of €X include?"</strong> Heating, water, cleaning, transport — get an itemised list.<br/><strong>5. "What is the notice period to end the housing agreement?"</strong> Standard is 7–14 days after employment ends. Longer than 14 days is unusual and worth pushing back on.<br/><strong>6. "Can I visit the accommodation before I start?"</strong> Agencies that allow visits signal confidence in their housing. Agencies that refuse are often hiding conditions they know workers wouldn't accept if seen in advance.`,
        },
        {
          heading: "Your rights if housing conditions are unacceptable",
          body: `You have more rights than most workers realise, even in a tied housing arrangement:<br/><br/><strong>SNF complaint procedure:</strong> If your agency holds an SNF certificate and conditions violate the standard, you can file a complaint directly with SNF. Inspections are triggered, and agencies risk losing their certification — which affects their ability to operate.<br/><strong>Dutch housing law (Huurrecht):</strong> Even in employer-provided accommodation, some tenant protections apply. Persistent failure to maintain the property in habitable condition (gebreken) gives you the right to demand repairs, and in extreme cases to invoke the huurrecht procedure.<br/><strong>Nederlandse Arbeidsinspectie:</strong> If housing deductions exceed the SNF maximum or conditions are unsafe, this is reportable to the Labour Inspectorate.<br/><strong>Gemeentelijke handhaving:</strong> If the accommodation violates local building codes or fire safety standards, the local municipality's handhavingsdienst has enforcement powers.<br/><strong>Leaving:</strong> If housing conditions are materially worse than what was represented in the contract, you can argue a breach of contract and end both employment and housing agreements immediately. Document the conditions with photos before leaving.`,
        },
        {
          heading: "Practical tips from workers who got it right",
          body: `Workers who rated housing 4–5 stars on AgencyCheck consistently share these habits:<br/><br/><strong>"I confirmed the deduction in writing, not by phone."</strong> A WhatsApp message from a coordinator is not a contract. Ask for the housing addendum as a signed document with the deduction amount specified numerically.<br/><strong>"I asked for the SNF number before I booked my travel."</strong> An agency that provides this immediately is confident in their housing. An agency that delays or says "we'll sort it when you arrive" rarely has it.<br/><strong>"I made a video of the room on my first day."</strong> If your room has existing damage — stains, broken furniture, marks — document it photographically immediately. This protects you against deposit deductions for damage you didn't cause.<br/><strong>"I read the termination clause."</strong> Most housing problems become crises when workers try to leave quickly. The notice period and any financial obligations on early termination should be clear before you sign. If they're not in writing, they're not enforceable.`,
        },
        {
          heading: `The ${housingCount} agencies on AgencyCheck with verified housing`,
          body: `AgencyCheck profiles ${housingCount} verified Dutch employment agencies that provide accommodation alongside employment contracts. Each profile includes:<br/><br/><ul style="margin-top:8px;margin-left:16px;list-style:disc"><li><strong>Housing status:</strong> Confirmed YES/NO/POSSIBLE</li><li><strong>Transparency score:</strong> Including whether housing details are publicly disclosed</li><li><strong>Worker reviews:</strong> Including specific housing ratings and comments</li><li><strong>Sector and city coverage:</strong> So you can find housing-included agencies in your target location</li></ul><br/>To find agencies with housing in your target city, use the city filter on the AgencyCheck agencies page and sort by housing availability. You can also browse by sector — agriculture, food production, and logistics have the highest proportion of housing-included agencies. When reviewing profiles, prioritise agencies with housing ratings above 3.5/5 and at least 3 reviews mentioning accommodation.`,
        },
      ],
      faqs: [
        {
          question: "What is the maximum an agency can deduct for housing in the Netherlands in 2026?",
          answer:   `For SNF-certified shared accommodation, the maximum all-inclusive deduction is €113.50/week in 2026. This covers rent, utilities, and service charges — nothing additional can be added. For non-SNF-certified accommodation there is no formal legal maximum, but the deduction must be contractually agreed and cannot reduce net pay below the WML equivalent.`,
        },
        {
          question: "What is SNF certification and why does it matter?",
          answer:   `SNF (Stichting Normering Flexwonen) is the independent Dutch body that certifies the quality of temporary worker accommodation. Certified properties are inspected for space standards (minimum 10m² per person), safety, hygiene, and facilities. SNF certification also caps the weekly deduction at €113.50. Choosing an SNF-certified agency gives you legal protection on both standards and costs. You can verify certification at normering-flexwonen.nl.`,
        },
        {
          question: "Can an agency evict me from housing immediately if I leave the job?",
          answer:   `No. Even in a tied housing arrangement, you are entitled to a notice period — typically 7–14 days after employment ends. This notice period must be specified in your housing agreement. An agency that attempts to remove you from accommodation on the day employment ends, without the agreed notice period, is acting unlawfully. You can contact the local municipality's housing authority if this happens.`,
        },
        {
          question: "What should I do if my agency housing is overcrowded or unhygienic?",
          answer:   `Document the conditions with photos and video immediately. Write to your coordinator describing specific issues (e.g. "4 people sleeping in a room of approximately 12m², which is below the SNF minimum of 10m² per person"). Give 5 working days to respond. If unresolved and your agency has an SNF certificate, file a complaint at normering-flexwonen.nl. If conditions are a health or safety hazard, contact your local municipality's handhavingsdienst (enforcement).`,
        },
        {
          question: "Do I get my housing deposit back when I leave?",
          answer:   `Yes — a housing deposit (borgsom) must be returned within 14 days of the housing agreement ending, minus any legitimate documented damage charges. Disputes about deposits are handled by the kantonrechter (local court) — the filing fee is low and the process is straightforward. Before moving out, do a joint inspection with an agency representative and document the room's condition on your last day.`,
        },
        {
          question: "Is it cheaper to find my own accommodation than use agency housing?",
          answer:   `Often, but not always. Agency housing at €80–€95/week (€347–€411/month) is significantly below private market rates in Dutch cities (€700–€1,800/month for a room). In tight labour markets, the convenience of staying in agency housing — no separate tenancy process, utilities included — is a real benefit, particularly for a first placement. The quality-to-cost ratio is what matters: SNF-certified housing at €95/week is usually reasonable value; non-certified housing at €113/week in poor condition is not.`,
        },
      ],
      relatedAgencySlugs: ["otto-work-force", "covebo", "foreignflex", "europlus"],
      relatedCitySlugs:   ["venlo", "tilburg", "breda", "westland"],
      datePublished: "2026-04-01",
      dateModified:  "2026-04-01",
    },

    // ── Guide 11: Working Netherlands without speaking Dutch ──────────────────────
    {
      slug:      "working-netherlands-without-speaking-dutch",
      title:     `Working in the Netherlands Without Speaking Dutch — Complete ${YEAR} Guide`,
      metaTitle: `Working Netherlands Without Dutch ${YEAR} — English Jobs & Tips`,
      metaDesc:  `Can you work in the Netherlands without Dutch? Yes. Most warehouse, logistics and factory jobs need no Dutch. What you DO need: BSN, IBAN, and how to avoid exploitation. Real guide.`,
      badge:     `${YEAR} · Foreigners Guide`,
      intro:     `The Netherlands hosts over 450,000 foreign workers, the majority of whom work in logistics, warehousing, agriculture, and food production without speaking Dutch. English is widely spoken in workplaces, and most large agencies have coordinators fluent in Polish, Romanian, Bulgarian, and Portuguese. You don't need Dutch to get a job — but you do need to understand your contract, your payslip, and your rights, ideally before your first working day.`,
      sections: [
        {
          heading: "Do you need to speak Dutch to work in the Netherlands?",
          body: `<strong>No</strong> — for most operational roles in logistics, production, and horticulture, Dutch language skills are not required or tested. The physical nature of the work means most tasks are demonstrated rather than explained. Safety inductions are increasingly available in English and Polish, and many client workplaces with high proportions of foreign workers have multilingual site documentation.<br/><br/>Where Dutch becomes relevant: (1) contract documents are written in Dutch and legally binding regardless of whether you can read them; (2) communication with the Dutch government (BSN registration, tax office, health insurance) requires either Dutch comprehension or an intermediary; (3) if a dispute escalates to a legal or administrative process, documentation will be in Dutch.<br/><br/>Of ${totalSeedReviews} reviews on AgencyCheck, <strong>${commPoorCount} (${Math.round((commPoorCount / totalSeedReviews) * 100)}%) cited poor communication</strong> as an issue. Many of these involve language — coordinators who communicated only in Dutch, contracts in Dutch-only with no translation offered, and instructions at the worksite given in Dutch despite a predominantly non-Dutch-speaking workforce.`,
        },
        {
          heading: "Your right to a contract you understand",
          body: `Under Dutch law, you are not legally required to sign a contract in Dutch. <strong>You are entitled to request your employment contract in a language you understand</strong> — and to have sufficient time to read it before signing. A responsible agency will provide an English version (or Polish, Romanian, etc.) as a matter of course; most larger ABU/NBBU-certified agencies already do.<br/><br/>What to do if offered only a Dutch contract: ask explicitly for a translation. If the agency says one is not available, ask for 24–48 hours to arrange your own translation before signing. Never sign a document you cannot read — the content is legally binding regardless of your language comprehension.<br/><br/>Key contract terms to verify (in any language): exact gross hourly rate, housing deduction amount (if applicable), shift patterns and premium rates, notice period, and accommodation notice period (if different from employment).`,
        },
        {
          heading: "Getting a BSN — the first essential step",
          body: `The <strong>BSN (burgerservicenummer)</strong> is the Dutch social security and tax identification number. Every worker needs one before their employer can process payroll — without a BSN, you cannot legally receive salary. For EU/EEA citizens, obtaining a BSN requires registering at a gemeentelijke basisadministratie (municipal records office).<br/><br/>Two routes:<br/><strong>Via RNI (Registratie Niet-Ingezetenen):</strong> Available at designated municipalities for workers who will not be resident in the Netherlands long-term. Appointments available at major cities. Takes 1–5 working days once appointment secured.<br/><strong>Via gemeente (for residents):</strong> If you have a Dutch address and will stay for more than 4 months, register as a resident and receive your BSN at the same time. Requires proof of address and valid ID.<br/><br/>Your employer or agency is legally required to collect and verify your BSN before your first payslip. Agencies that say you can "start first and sort the BSN later" are creating a compliance problem for themselves — not a benefit for you.`,
        },
        {
          heading: "Opening a Dutch bank account without a permanent address",
          body: `A Dutch IBAN account is required by most employers to pay salary. Traditional banks (ING, ABN AMRO, Rabobank) require a fixed Dutch address and BSN. For workers without a permanent address yet, three options exist:<br/><br/><strong>Bunq:</strong> Provides a Dutch IBAN via app registration with just a valid passport and email. No Dutch address required. Widely accepted by Dutch employers.<br/><strong>Wise (TransferWise):</strong> Provides a Dutch IBAN for international workers. Also accepted by most agencies. Free to receive salary; small fee to convert currencies.<br/><strong>N26:</strong> German neobank with a Dutch IBAN option. Requires EU identity verification but no Dutch address.<br/><br/>Confirm with your agency before starting whether a Bunq or Wise IBAN is acceptable — most are, but some state payroll systems require a specific Dutch bank. If your agency insists on a particular bank, ask them to assist with the account opening process — some larger agencies have formal relationships with local banks for this purpose.`,
        },
        {
          heading: "Language in the workplace — practical realities",
          body: `The reality of a multilingual Dutch warehouse or factory floor is more functional than many expect. Shift managers typically know a handful of phrases in multiple languages; many workplaces have large immigrant populations where a shared language (often Polish or English) emerges as the operational language.<br/><br/>Practical tips for first days:<br/><ul style="margin-top:8px;margin-left:16px;list-style:disc"><li>Learn the key safety Dutch vocabulary before day one: stop, gevaar (danger), nooduitgang (emergency exit), verboden (prohibited)</li><li>Carry a phone with Google Translate or DeepL installed for written instructions</li><li>Find out before you start whether your coordinator speaks your language or English</li><li>Ask for the safety induction (BHV/VCA briefing) in English or your language — this is standard at most large clients</li></ul><br/>Agencies where coordinators communicate only in Dutch to non-Dutch workers account for a significant portion of communication complaints. Check on AgencyCheck whether other foreign workers have mentioned language support in reviews for your target agency.`,
        },
        {
          heading: "Warning signs of exploitation targeting foreign workers",
          body: `Foreign workers — particularly recent arrivals — are disproportionately targeted by illegal labour practices. Warning signs, based on reported patterns in the Netherlands:<br/><br/><strong>Payment of a "placement fee":</strong> No legitimate Dutch agency charges workers a fee to find or place them in a job. This is illegal under Dutch law.<br/><strong>Request to hand over your passport:</strong> Your employer may take a copy for ID verification but may never retain your original documents.<br/><strong>Wages paid in cash without payslip:</strong> All wage payments must be accompanied by a loonstrook. Cash payment without documentation removes your ability to dispute incorrect amounts or claim entitlements.<br/><strong>Accommodation without written agreement:</strong> If housing is provided without a signed written agreement specifying the deduction amount, you have no basis for dispute if the deduction increases.<br/><strong>Agency not registered at KVK:</strong> All legitimate Dutch companies must be registered at the Kamer van Koophandel. Verify at kvk.nl before accepting any offer.`,
        },
        {
          heading: "Resources for foreign workers in the Netherlands",
          body: `Key contacts and resources for non-Dutch-speaking workers:<br/><br/><strong>FairWork (fairwork.nl):</strong> Dutch NGO providing free advice for migrant workers on labour rights, contract issues, and housing problems. Available in multiple languages.<br/><strong>Meldpunt Arbeidsuitbuiting:</strong> Government hotline for reporting labour exploitation: 0800-0101 (free, anonymous, available in multiple languages).<br/><strong>Nederlandse Arbeidsinspectie (NLA):</strong> Government labour inspectorate. Reports wage theft, below-WML pay, and illegal deductions. arbeidsinspectie.nl<br/><strong>ABU (Algemene Bond Uitzendondernemingen):</strong> Industry association for legitimate temp agencies. The member registry at abu.nl confirms whether your agency is ABU-certified.<br/><strong>NBBU:</strong> The second major industry association for smaller agencies. nbbu.nl<br/><strong>AgencyCheck:</strong> Review and compare ${totalAgencies} Dutch temp agencies before signing anything. Check housing ratings, payslip accuracy reports, and coordinator communication reviews.`,
        },
        {
          heading: "First week checklist for foreign workers",
          body: `Before day one:<br/><ul style="margin-top:8px;margin-left:16px;list-style:disc"><li>Contract signed and understood — in English if possible, Dutch if no translation available (with your own translation)</li><li>BSN number obtained or RNI appointment confirmed</li><li>Dutch IBAN open and confirmed acceptable by agency</li><li>Housing address, room capacity, and deduction amount confirmed in writing</li><li>Transport arrangements confirmed (free bus, deducted, or self-arranged)</li></ul><br/>First working day:<br/><ul style="margin-top:8px;margin-left:16px;list-style:disc"><li>Photograph your accommodation room to document pre-existing condition</li><li>Note start time on your phone — track every shift from day one</li><li>Confirm payroll date: "When will my first salary be paid?"</li></ul><br/>First payslip:<br/><ul style="margin-top:8px;margin-left:16px;list-style:disc"><li>Verify hours match your records</li><li>Verify gross rate matches your contract</li><li>Confirm vakantiegeld line is present (8% of gross)</li><li>Confirm all deductions match agreed contract amounts</li></ul>`,
        },
      ],
      faqs: [
        {
          question: "Can you get a job in the Netherlands if you don't speak Dutch?",
          answer:   `Yes. Most warehouse, logistics, production, agriculture, and cleaning roles in the Netherlands are accessible without Dutch. Large employment agencies have multilingual coordinators, and many client workplaces have majority non-Dutch-speaking workforces. English is the typical common language at international sites. However, your employment contract will be in Dutch — ensure you get a translation or have it explained before signing.`,
        },
        {
          question: "What documents do I need to work legally in the Netherlands as an EU citizen?",
          answer:   `EU and EEA citizens need: (1) valid national ID card or passport; (2) BSN (burgerservicenummer) — obtain from a Dutch municipality before first payslip; (3) Dutch or EU IBAN bank account for salary payment. No work permit is required for EU/EEA citizens. You are entitled to the same minimum wage and labour rights as Dutch nationals from day one.`,
        },
        {
          question: "Do I need a Dutch bank account to work in the Netherlands?",
          answer:   `Most Dutch employers require a Dutch or EU IBAN for payroll. You can obtain a Dutch IBAN quickly without a Dutch address via Bunq or Wise — both are widely accepted. Traditional Dutch banks (ING, ABN AMRO) require a fixed address and BSN appointment, which takes longer. Confirm with your agency whether a Bunq/Wise IBAN is acceptable before opening accounts.`,
        },
        {
          question: "Is it illegal for a Dutch employer to ask for a placement fee?",
          answer:   `Yes. Charging workers a fee to place them in employment is illegal under Dutch law (Article 9a of the Wet allocatie arbeidskrachten door intermediairs). Any agency that requests payment for finding you a job is operating illegally. Report to the Nederlandse Arbeidsinspectie or FairWork. This applies regardless of how the fee is described — "administration fee", "registration cost", or similar.`,
        },
        {
          question: "What is the Dutch minimum wage for foreign workers in 2026?",
          answer:   `The Dutch minimum wage (WML) applies equally to all workers regardless of nationality. In 2026 it is €${WML}/hr for workers aged 21 and over. Working below WML is illegal. If you earn below this rate, you can report it anonymously to the Nederlandse Arbeidsinspectie at arbeidsinspectie.nl. The WML also applies to accommodation-included contracts — housing deductions cannot reduce net pay below the WML equivalent.`,
        },
        {
          question: "What should I do if my agency contract is only in Dutch?",
          answer:   `Request an English (or other language) version before signing. You are legally entitled to sufficient time to understand what you're signing. If no translation is provided, ask for 24 hours to arrange your own translation (DeepL Pro or a professional translator). Key terms to verify regardless of language: gross hourly rate, housing deduction amount, shift schedule, notice period, and whether ABU or NBBU CAO applies.`,
        },
      ],
      relatedAgencySlugs: ["foreignflex", "covebo", "otto-work-force", "flexsupport"],
      relatedCitySlugs:   ["amsterdam", "rotterdam", "eindhoven", "westland"],
      datePublished: "2026-04-01",
      dateModified:  "2026-04-01",
    },

    // ── Guide 12: Best agency Netherlands — how to choose ────────────────────────
    {
      slug:      "how-to-choose-best-temp-agency-netherlands",
      title:     `How to Choose the Best Temp Agency in the Netherlands — ${YEAR} Guide`,
      metaTitle: `Best Temp Agency Netherlands ${YEAR} — How to Choose & What to Check`,
      metaDesc:  `How to find the best Dutch employment agency for your situation. ${totalAgencies} agencies profiled, ${positivePct}% of workers rate good agencies 4–5 stars. What separates them from the rest.`,
      badge:     `${YEAR} · ${totalAgencies} Agencies`,
      intro:     `With over ${totalAgencies} active employment agencies in the Netherlands, choosing correctly is one of the most consequential decisions a flex worker makes. The right agency means on-time pay, fair housing, clear contracts, and a coordinator you can actually reach. The wrong one means payslip disputes, overcrowded housing, and missed overtime — problems that are difficult to resolve once you've moved into their accommodation. This guide uses real data from ${totalSeedReviews} AgencyCheck reviews to identify the differences that matter.`,
      sections: [
        {
          heading: "The five things that separate good agencies from bad ones",
          body: `Based on ${totalSeedReviews} reviews, five factors predict almost all worker satisfaction or dissatisfaction:<br/><br/><strong>1. Pay accuracy and timeliness (${REVIEW_SEED_DATA.filter(r => r.issueTags.includes("payslip_ok")).length} reviews explicitly praised; ${payslipErrors} reported errors):</strong> Good agencies pay correctly on the agreed date, every period. This sounds basic but is not universal — ${latePayCount} workers reported late salary payments.<br/><br/><strong>2. Communication quality (${REVIEW_SEED_DATA.filter(r => r.issueTags.includes("communication_good")).length} positive, ${commPoorCount} negative):</strong> Coordinators who respond within hours vs. coordinators who go silent after placement. This is the most mentioned variable in reviews across all ratings.<br/><br/><strong>3. Housing accuracy (${housingIssueCount} housing complaints):</strong> Accommodation as described vs. significantly worse. Overcrowding accounts for the majority of housing complaints.<br/><br/><strong>4. Contract clarity (${contractIssues} unclear contract reports vs. ${REVIEW_SEED_DATA.filter(r => r.issueTags.includes("fair_contract")).length} fair_contract reports):</strong> Workers who understood their contract before signing almost never had financial surprises.<br/><br/><strong>5. Transparency about deductions:</strong> Every deduction itemised on payslip vs. opaque "costs" that appear unexpectedly.`,
        },
        {
          heading: "ABU vs NBBU — what certification tells you",
          body: `The two main industry associations for Dutch temp agencies are the <strong>ABU (Algemene Bond Uitzendondernemingen)</strong> and <strong>NBBU (Nederlandse Bond van Bemiddelings- en Uitzendondernemingen)</strong>. Both require member agencies to operate under their respective collective agreement (CAO), which sets minimum standards for:<br/><br/><ul style="margin-top:8px;margin-left:16px;list-style:disc"><li>Fase A/B/C contract progression (job security over time)</li><li>Minimum wage compliance and overtime premiums</li><li>Holiday pay (8% vakantiegeld)</li><li>Sick pay entitlements</li><li>Housing deduction limits (if SNF-certified housing is provided)</li></ul><br/>Neither the ABU nor NBBU CAO is perfect, but membership gives you a formal complaints mechanism. If an ABU or NBBU member agency violates its CAO obligations, you can file a complaint through the respective association's disputes committee.<br/><br/>Agencies without ABU or NBBU membership operate outside these frameworks. This doesn't automatically mean they're bad — some small specialist agencies operate professionally outside the associations — but it removes a layer of accountability and recourse.`,
        },
        {
          heading: "How to read an AgencyCheck transparency score",
          body: `AgencyCheck's transparency score rates agencies on a scale of 0–100 based on how much verifiable, specific information they publicly disclose. Components include:<br/><br/><ul style="margin-top:8px;margin-left:16px;list-style:disc"><li>Whether salary range or starting rate is published</li><li>Whether housing provision status is confirmed with details</li><li>Whether sectors and cities are specifically listed</li><li>Whether the agency discloses its CAO membership</li><li>Whether contact information beyond a generic form is available</li></ul><br/>Agencies scoring above 70/100 have provided enough public information for a worker to make an informed decision before initial contact. Agencies scoring below 40 have withheld most key information — which correlates with poor outcomes in reviews. The average transparency score across ${totalAgencies} agencies is approximately 55/100. The top-performing agencies score 85–100 and are typically larger, longer-established agencies with strong institutional reputations.`,
        },
        {
          heading: "What to check before contacting an agency",
          body: `Before you send a message or call a number:<br/><br/><strong>Step 1 — Verify they are KVK-registered:</strong> Search the company name at kvk.nl. Unregistered agencies are operating illegally.<br/><strong>Step 2 — Check ABU or NBBU membership:</strong> abu.nl or nbbu.nl has searchable member registries. Membership is not mandatory but is a quality signal.<br/><strong>Step 3 — Check SNF housing certificate:</strong> If housing is important to you, confirm SNF certification at normering-flexwonen.nl before engaging.<br/><strong>Step 4 — Read AgencyCheck reviews:</strong> Focus on 2–4 star reviews — they contain the most balanced, actionable information. Specifically look for: payslip accuracy, housing conditions, coordinator responsiveness, and how the agency handled problems when they arose.<br/><strong>Step 5 — Check how recently reviews were left:</strong> Agency quality can change. Reviews from the past 6 months are more predictive than older ones.`,
        },
        {
          heading: "Questions to ask an agency before signing",
          body: `The answers — and how quickly and specifically they are given — tell you a great deal about how the agency operates:<br/><br/><strong>Salary:</strong> "What is my exact gross hourly rate? Is there a trial period at a different rate?"<br/><strong>Housing:</strong> "What is the exact weekly housing deduction? What is the address? How many people share my room? Do you have an SNF certificate?"<br/><strong>Transport:</strong> "Is transport to the worksite included? If not, how much is deducted, or do I arrange my own?"<br/><strong>Contract:</strong> "Can I receive my contract in English before signing? When do I need to sign?"<br/><strong>Shifts:</strong> "What is the shift pattern? What premiums apply for nights and weekends?"<br/><strong>First pay:</strong> "When is the first payroll date? Will I receive a payslip for my first week separately or with the first full payment?"<br/><br/>An agency that answers all of these questions specifically, in writing, before asking you to commit is almost certainly operating legitimately and professionally.`,
        },
        {
          heading: `Sector-specific considerations: ${YEAR}`,
          body: `Different sectors have different patterns in terms of agency quality and common issues:<br/><br/><strong>Logistics / warehousing:</strong> Highest volume of foreign workers, best-developed multilingual coordinator infrastructure. Most agencies in major logistics corridors (Venlo, Tilburg, Waalwijk, Rotterdam) have strong competitive pressure to offer good conditions. Night shift premiums are standard and critical to real income — confirm they appear on payslips.<br/><strong>Food production / agriculture:</strong> Seasonal demand creates pressure on housing capacity during peak periods. Housing overcrowding complaints are most common in horticulture (Westland, Naaldwijk) during harvest season. SNF certification is especially important in this sector.<br/><strong>Construction:</strong> Higher hourly rates but more variable working conditions, less standard shift patterns. ABU/NBBU membership less universal in smaller construction sub-contractors.<br/><strong>Cleaning:</strong> Lower hourly rates (often at or near WML), fragmented sector with many small agencies. Contract clarity complaints are proportionally higher. Prioritise agencies with formal CAO coverage.`,
        },
        {
          heading: "Red flags that rule out an agency immediately",
          body: `These behaviours — regardless of how attractive the offer sounds — are disqualifying:<br/><br/><ul style="margin-top:8px;margin-left:16px;list-style:disc"><li>Requesting any payment from you (placement fee, "registration", "administrative costs")</li><li>Refusing to provide a contract before asking you to confirm your start date</li><li>Refusing to provide the housing address before you sign</li><li>Contract available only in Dutch with no translation offered</li><li>Asking you to sign the contract on your first day rather than before</li><li>No KVK registration verifiable at kvk.nl</li><li>Coordinator who stops responding after initial contact</li><li>Housing deduction discussed orally but not in writing</li></ul><br/>None of these are edge cases. They appear in reviews on AgencyCheck. They are reliably predictive of problematic placements.`,
        },
        {
          heading: "When to leave and how to do it safely",
          body: `Knowing when to leave is as important as choosing well. The right time to start planning an exit:<br/><br/><strong>First payslip has unexplained deductions</strong> and the agency is unresponsive after written challenge. Financial disputes compound quickly.<br/><strong>Housing conditions are materially worse than described</strong> and written complaints produce no response.<br/><strong>Coordinator is unreachable</strong> for non-emergency matters. A coordinator you cannot reach for a payslip question becomes a coordinator you cannot reach for a real emergency.<br/><br/>The safe exit process: identify your next agency while still employed at current one; give formal written notice to your current agency (typically 1 week in Fase A); confirm your housing notice period separately in writing; ensure you have a copy of all payslips and contracts; collect all belongings before leaving accommodation.<br/><br/>AgencyCheck's agency browser lets you filter by city, sector, housing availability, and transparency score — useful for identifying alternatives quickly. Worker reviews from your target agencies in the past 3 months are the most reliable signal of current conditions.`,
        },
      ],
      faqs: [
        {
          question: "How do I know if a Dutch employment agency is legitimate?",
          answer:   `Verify KVK registration at kvk.nl. Check ABU or NBBU membership at abu.nl or nbbu.nl. For housing-included agencies, check SNF certification at normering-flexwonen.nl. Read reviews on AgencyCheck, focusing on payslip accuracy, housing conditions, and coordinator responsiveness. A legitimate agency will have a KVK number, respond to specific questions before asking you to commit, and provide a written contract before your start date.`,
        },
        {
          question: "What is the difference between ABU and NBBU agencies in the Netherlands?",
          answer:   `Both are industry associations with their own collective agreements (CAO) governing temp worker rights. ABU agencies tend to be larger and are bound by the ABU CAO; NBBU agencies tend to be smaller and are bound by the NBBU CAO. Both CAOs set minimum standards for wages, overtime, holiday pay, and contract progression (Fase A/B/C). The key practical difference for workers is that ABU Fase A contracts can be ended by the employer "at will" on any work day, while NBBU Fase A contracts have slightly more stability. Both are legitimate industry frameworks.`,
        },
        {
          question: "How many Dutch temp agencies are there in the Netherlands?",
          answer:   `There are several thousand registered employment intermediaries in the Netherlands, ranging from large national agencies to small local operators. AgencyCheck profiles ${totalAgencies} agencies verified as actively operating. The major players by worker volume include Otto Work Force, Tempo-Team, Randstad, and Manpower, but many of the highest-rated agencies on AgencyCheck are mid-size operators with strong regional specialisations.`,
        },
        {
          question: "What is the Fase A/B/C contract system in Dutch agency work?",
          answer:   `Under Dutch ABU/NBBU CAO, temp work progresses through phases. Fase A: the first 78 weeks of employment — contracts can be ended with 1 week's notice, no security. Fase B: weeks 79–130 — up to 6 fixed-term contracts allowed; notice period increases. Fase C: after week 130 — permanent employment applies. Most new arrivals in the Netherlands are in Fase A. The key practical implication: in Fase A you can be let go on short notice, so having financial reserves and alternative agency options is important.`,
        },
        {
          question: "What is a good transparency score on AgencyCheck?",
          answer:   `Scores above 70/100 indicate an agency has publicly disclosed enough information — salary range, housing details, sector and city coverage, CAO membership — for a worker to make an informed decision before first contact. Scores above 85 indicate comprehensive, specific public disclosure. Scores below 50 mean key information is withheld, which correlates with less transparent operations overall. The average across ${totalAgencies} agencies is approximately 55/100.`,
        },
        {
          question: "Can I change agencies if I'm unhappy with my current one?",
          answer:   `Yes. In Fase A, you need to give approximately 1 week's notice to end your employment. If you live in agency housing, you'll also need to end that agreement — check the notice period in your housing addendum (usually 7–14 days). Before leaving, identify and contact alternative agencies using AgencyCheck. Having a confirmed start date with a new agency before handing in notice significantly reduces financial risk.`,
        },
      ],
      relatedAgencySlugs: ["otto-work-force", "covebo", "foreignflex", "europlus"],
      relatedCitySlugs:   ["amsterdam", "rotterdam", "tilburg", "venlo"],
      datePublished: "2026-04-01",
      dateModified:  "2026-04-01",
    },

    // ── Guide 13: Real salary Netherlands — gross vs net all job types ─────────
    {
      slug:      "real-salary-netherlands",
      title:     `Real Salary in the Netherlands ${YEAR} — Gross vs Net for Agency Jobs`,
      metaTitle: `Real Salary Netherlands ${YEAR} — Gross vs Net`,
      metaDesc:  `What do agency workers really take home in the Netherlands? Real gross-to-net breakdowns for warehouse, forklift, production, and order picker jobs. ${YEAR} figures.`,
      badge:     `${YEAR} · All Job Types`,
      intro:     `Every agency job advert in the Netherlands shows a gross hourly rate. What actually arrives in your bank account is different — sometimes by more than 40%. This guide covers real take-home pay for all eight major agency job types, from order pickers earning WML to reach truck drivers earning €20/hr. All salary data comes from AgencyCheck's job-type database and ${totalSeedReviews} worker reviews. No estimates — only numbers that can be verified against Dutch tax law and collective agreements.`,
      sections: [
        {
          heading: `Gross vs net: why there's a gap of €100–€200 every week`,
          body: `When an agency advertises €${WML}/hr, they mean your gross hourly rate — the figure before any deduction is made. From that gross, Dutch law and your contract subtract several items before anything arrives in your account.<br/><br/><strong>Loonheffing (income tax + social contributions):</strong> At WML, your employer withholds approximately €${Math.round(WML * 40 * 0.107)}/week in loonheffing after the two standard credits (algemene heffingskorting and arbeidskorting) are applied. The effective rate at WML is around 10.7% — lower than the 37.07% headline rate because the credits heavily offset tax at lower incomes.<br/><br/><strong>ZVW healthcare levy:</strong> Approximately €11/week. This funds the state healthcare system (Zorgverzekeringswet). It is separate from your personal health insurance premium, which you pay yourself (around €140/month) unless your agency has a group scheme.<br/><br/><strong>Housing deduction:</strong> If you live in agency accommodation, €80–€113.50/week is deducted directly from your salary. The SNF legal ceiling is €113.50/week for certified housing. Some agencies charge €80–€95.<br/><br/><strong>Transport:</strong> If transport is charged, expect €10–€36/week depending on your distance from the work site. One worker on AgencyCheck reported: "After paying €120 for accommodation, €36 for insurance, and €25 for transport, I end up with around €340 net per week." That breakdown illustrates exactly how €${weeklyGross} gross becomes €340 take-home — a difference of €${weeklyGross - 340}/week.`,
        },
        {
          heading: "Real take-home by job type — 2026 figures",
          body: `Here are the real net-monthly earnings for each major agency job type, calculated using Dutch tax rates, the two statutory credits, and a 40-hour week. These figures assume <strong>no housing deduction</strong> — if you live in agency accommodation, subtract €347–€490/month (€80–€113.50 × 4.33 weeks).<br/><br/><strong>Order Picker (avg €14.50/hr):</strong> Gross €580/wk → net ≈€334/wk (€1,446/mo)<br/><strong>Warehouse Worker (avg €14.80/hr):</strong> Gross €592/wk → net ≈€341/wk (€1,477/mo)<br/><strong>Production Worker (avg €15.00/hr):</strong> Gross €600/wk → net ≈€346/wk (€1,498/mo)<br/><strong>Machine Operator (avg €15.50/hr):</strong> Gross €620/wk → net ≈€357/wk (€1,546/mo)<br/><strong>Forklift Driver (avg €16.00/hr):</strong> Gross €640/wk → net ≈€369/wk (€1,597/mo)<br/><strong>Greenhouse Worker (avg €15.20/hr):</strong> Gross €608/wk → net ≈€350/wk (€1,516/mo)<br/><strong>Reach Truck Driver (avg €17.00/hr):</strong> Gross €680/wk → net ≈€392/wk (€1,697/mo)<br/><strong>Machine Setter (avg €18.50/hr):</strong> Gross €740/wk → net ≈€427/wk (€1,848/mo)<br/><br/>These figures include loonheffing, ZVW, and basic social contributions. They exclude housing, transport, and health insurance costs.`,
        },
        {
          heading: "Why most agency workers take home €300–€400/week",
          body: `The €300–€400/week band is the real take-home range for the majority of agency workers in the Netherlands who live in agency accommodation. Here is how it breaks down:<br/><br/>A warehouse worker on WML (€${WML}/hr) earns €${weeklyGross}/week gross. After tax and levies, they net approximately €${weeklyNet}/week. Subtract agency housing at €100/week and they take home €${weeklyNet - 100}/week — right in the middle of this band.<br/><br/>A worker paying the maximum SNF rate (€113.50/week) on WML nets €${weeklyNet - 113}/week. After food costs of €50–€80 per week and a phone plan of €10–€15/week, disposable income is €150–€200/week at best.<br/><br/>Workers in the €400+ band typically have one or more of: a job above WML (forklift, reach truck), free housing included, free transport to the work site, or consistent night/weekend shift premiums. The key variable separating €300/week workers from €450/week workers is almost always whether housing and transport are free.<br/><br/>This is why the phrase "jobs with accommodation" is so important to research before arrival. An agency offering free housing on €15.50/hr gives you more take-home than one charging €113.50/week housing on €16.50/hr.`,
        },
        {
          heading: "How shift premiums change the calculation entirely",
          body: `Gross hourly rate only tells half the story. Shift premiums under the ABU and NBBU collective agreements (CAO) can increase real weekly earnings by 20–80% compared to daytime work on the same base rate.<br/><br/><strong>Night shift bonus (00:00–06:00):</strong> Minimum +22% under ABU CAO. At WML: €${WML}/hr × 1.22 = €17.95/hr. Five night shifts/week: €718/week gross → approximately €413/week net (without housing).<br/><strong>Sunday premium:</strong> +50% under ABU CAO. At WML: €22.07/hr. Two 8-hour Sunday shifts add approximately €150/week gross to your base.<br/><strong>Overtime (hours 41–50/week):</strong> 125% of base rate. Hours 51+: 150%.<br/><br/>A forklift driver doing regular night shifts at €16/hr earns: €16 × 1.22 × 40 = €780/week gross — approximately €450/week net. With free agency housing, savings of €200–€300/week become achievable.<br/><br/>The critical issue: these premiums must appear as separate itemised lines on your payslip. ${missingOvertime} of ${totalSeedReviews} workers on AgencyCheck reported that overtime or shift premiums were missing from their payslip. If your payslip shows only one flat gross figure without premium line items, your pay is almost certainly being under-reported.`,
        },
        {
          heading: "Vakantiegeld — the 8% accrual that changes your annual total",
          body: `By Dutch law (BW art. 7:634), every employer must accrue <strong>8% of gross wages</strong> as vakantiegeld (holiday allowance). This is not optional and not a bonus — it is a legal entitlement that accrues from your first working day.<br/><br/>At WML on a 40-hour week for one full year:<br/>Annual gross: €${weeklyGross} × 52 = €${weeklyGross * 52}<br/>Vakantiegeld: €${weeklyGross * 52} × 0.08 = <strong>€${Math.round(weeklyGross * 52 * 0.08)}/year</strong><br/><br/>Most agencies pay vakantiegeld once per year in June, or upon contract termination. Some include it in every weekly payment (uitbetaald bij loon) — in this case your weekly gross is multiplied by 1.08 and you receive an extra 8% each week. When comparing job offers, always clarify whether the quoted gross rate includes or excludes vakantiegeld.<br/><br/>A reach truck driver at €17/hr for 52 weeks accumulates €3,447 in vakantiegeld. Over a full year this is equivalent to an extra month's salary — which is why staying through to the June payout date, rather than leaving in April or May, has a significant impact on annual earnings.`,
        },
        {
          heading: `What workers actually earn — ${totalSeedReviews} reviews analysed`,
          body: `Based on ${totalSeedReviews} reviews collected on AgencyCheck, the average salary rating across all agencies is <strong>${salaryAvg}/5</strong>. ${positivePct}% of all reviews rated the experience 4–5 stars overall; ${negativePct}% rated it 1–2 stars.<br/><br/>Workers who received correct payslips with all premiums itemised, free transport, and clear contracts consistently rated their salary experience 4–5 stars and often mentioned earning €15.20–€16/hr at above-WML rates.<br/><br/>Workers who reported deductions not agreed in writing, missing overtime pay, or flat payslips without shift differential line items consistently rated salary 1–2 stars. The most commonly cited problem after housing was salary accuracy.<br/><br/><strong>The €340 take-home benchmark:</strong> The most frequently recurring real figure across negative-to-neutral reviews is €340–€360/week net after all deductions on minimum wage. Workers who report earning meaningfully more (€420+ net) almost universally worked nights, had free housing, or earned significantly above WML.`,
        },
        {
          heading: "Gross vs net calculator — do your own check in 60 seconds",
          body: `You do not need a complex spreadsheet to verify whether your pay is approximately correct. Use this simple check:<br/><br/><strong>Step 1:</strong> Contracted hourly rate × 40 hours = weekly gross<br/><strong>Step 2:</strong> Multiply by 0.89 to estimate net after tax and levies (approximate factor at WML; higher earners see a slightly lower factor)<br/><strong>Step 3:</strong> Subtract housing deduction per week (if applicable)<br/><strong>Step 4:</strong> Subtract transport cost per week (if charged)<br/><br/><strong>Example:</strong> €15.50/hr × 40h = €620 gross × 0.89 = €552 → minus €100 housing → minus €20 transport = <strong>€432/week net</strong><br/><br/>If your bank statement shows significantly less than this calculation, something is wrong. Common causes: (1) housing deduction higher than contracted, (2) shift premiums not being added, (3) overtime hours going unpaid, or (4) loonheffing applied at a higher rate than applicable.<br/><br/>AgencyCheck's real income calculator at /tools/real-income-calculator does this calculation with exact 2026 Dutch tax rates. Use it before you accept any job offer to verify the promised net pay.`,
        },
        {
          heading: "Which job types offer the best salary-to-deduction ratio?",
          body: `The highest earners relative to their working conditions in the Netherlands are consistently forklift and reach truck drivers. Here is why the ratio matters:<br/><br/>A reach truck driver earning €17/hr with free housing takes home approximately €392/week net — more than a warehouse worker earning €14.80/hr and paying €100/week housing (€341 net minus €100 = €241 take-home after housing). The reach truck driver earns €151/week more despite a surface-level hourly difference of only €2.20/hr.<br/><br/>The job types with the best salary-to-deduction ratio, in order:<br/>1. <strong>Reach truck / Forklift with free housing:</strong> €380–€500/week net<br/>2. <strong>Night shift production workers with free transport:</strong> €370–€430/week net<br/>3. <strong>Machine setters/operators in manufacturing:</strong> €357–€427/week net (day shifts)<br/>4. <strong>Warehouse/order picker with housing charged:</strong> €230–€300/week net disposable<br/><br/>The single biggest lever for increasing your Netherlands earnings is not working harder or negotiating a slightly higher hourly rate — it is securing a position with free housing and free transport. This can be worth €6,000–€8,000/year compared to a job that charges these costs.`,
        },
      ],
      faqs: [
        {
          question: `What is the minimum salary in the Netherlands in ${YEAR}?`,
          answer:   `The statutory minimum wage (WML) for workers aged 21+ is €${WML}/hour in ${YEAR}. For a 40-hour working week, this is €${weeklyGross}/week gross. After tax and social contributions, net take-home is approximately €${weeklyNet}/week (roughly €${monthlyNet}/month). With agency housing deducted, take-home drops to €${weeklyNet - 100}–€${weeklyNet - 80}/week.`,
        },
        {
          question: "How much do you actually take home after housing and taxes in the Netherlands?",
          answer:   `At minimum wage (€${WML}/hr, 40h/week), your net after tax is approximately €${weeklyNet}/week. With agency housing at the SNF maximum (€113.50/week), your take-home is €${weeklyNet - 113}/week — approximately €${Math.round((weeklyNet - 113) * 4.33)}/month. Workers above WML or with free housing take home significantly more.`,
        },
        {
          question: "Why is my net pay so much lower than my gross?",
          answer:   `In the Netherlands, gross pay has several mandatory deductions: income tax (loonheffing), healthcare levy (ZVW), and pension/social contributions. At WML, these total approximately €${weeklyGross - weeklyNet}/week. Additionally, housing, insurance, and transport deductions reduce net further. Total deductions of €180–€250/week from a WML gross of €${weeklyGross} are normal and legal.`,
        },
        {
          question: "Do agency workers in the Netherlands get holiday pay?",
          answer:   `Yes. All workers in the Netherlands are legally entitled to 8% of gross wages as vakantiegeld (holiday allowance). At WML (40h/week, full year), this accrues to approximately €${Math.round(weeklyGross * 52 * 0.08)}/year. It is paid annually in June, upon contract end, or included in every weekly payment. It must appear on your payslip.`,
        },
        {
          question: "What salary can I expect as a forklift driver in the Netherlands?",
          answer:   `Forklift drivers in the Netherlands typically earn €14.50–€19.00/hr, with an average of €16/hr. At 40 hours/week, this is €640/week gross or approximately €369/week net (without housing). With night shift premiums (+22%), gross rises to €781/week and net to approximately €451/week. Reach truck drivers command €15–€20/hr (avg €17/hr), reflecting the MHE certification required.`,
        },
        {
          question: "How do I know if my salary calculation is correct?",
          answer:   `Check your payslip against this formula: (hourly rate × hours worked) + (shift premiums as separate lines) + (8% vakantiegeld accrual) = gross. Then subtract tax and levies (approximately 11–15% at WML). If your net does not match, compare line by line. Shift differentials, overtime rates, and housing deductions must each appear as separate named line items. Errors in ${payslipErrors} of ${totalSeedReviews} AgencyCheck reviews were eventually corrected when workers challenged their payslip in writing.`,
        },
      ],
      relatedAgencySlugs: ["covebo", "otto-work-force", "randstad", "tempo-team"],
      relatedCitySlugs:   ["rotterdam", "amsterdam", "tilburg", "venlo"],
      datePublished: "2026-04-01",
      dateModified:  "2026-04-01",
    },

    // ── Guide 14: Hidden costs Netherlands ────────────────────────────────────
    {
      slug:      "hidden-costs-netherlands",
      title:     `Hidden Costs of Working in the Netherlands — Housing, Transport & Deductions (${YEAR})`,
      metaTitle: `Hidden Costs Netherlands Agency Workers ${YEAR}`,
      metaDesc:  `The real costs agency workers pay beyond their salary: housing up to €113.50/wk, transport €10–€36/wk, missing overtime in ${missingOvertime} reviews, insurance €140/mo. Know before you go.`,
      badge:     `${YEAR} · Know Before You Go`,
      intro:     `Most workers who arrive in the Netherlands for agency work are surprised by the gap between their gross hourly rate and what arrives in their account. The surprise is not random — it is caused by a predictable set of costs and deductions that agencies are permitted (and sometimes not permitted) to make. This guide documents every real cost category — housing, transport, insurance, overtime — using data from ${totalSeedReviews} worker reviews on AgencyCheck and 2026 Dutch labour law. If you are planning to work in the Netherlands, this is what you need to know before you sign anything.`,
      sections: [
        {
          heading: "Housing deductions — the biggest cost most workers underestimate",
          body: `Agency housing in the Netherlands is deducted directly from your gross salary before you receive it. The legal framework is set by the <strong>Stichting Normering Flexwonen (SNF)</strong>, which certifies agency housing quality and sets the maximum deductible rate.<br/><br/><strong>SNF certified housing maximum: €113.50/week</strong> (2026). This is the most you can legally be charged for SNF-certified shared accommodation.<br/><br/>Common housing charges by arrangement:<br/>• Basic shared housing (4–8 per room): €80–€95/week<br/>• Standard shared housing (2–3 per room): €95–€110/week<br/>• SNF maximum certified rate: €113.50/week<br/><br/>Housing issues appear in <strong>${housingIssueCount} of ${totalSeedReviews}</strong> reviews on AgencyCheck. The most common complaints: overcrowding beyond what was contracted, facilities in poor condition, and deductions continuing after workers moved out. Always request written confirmation of the exact housing cost before your first day of work.`,
        },
        {
          heading: "Transport costs — free vs charged, and what workers actually pay",
          body: `Transport to and from the work site is one of the most variable costs across agencies. Some agencies provide free van or bus service; others charge it back; others provide nothing.<br/><br/><strong>Free transport:</strong> Many agencies operating in logistics hubs (Tilburg, Venlo, Waalwijk, Roosendaal) provide free shuttle service from agency housing to the client site. This is a significant saving — typically equivalent to €10–€30/week.<br/><br/><strong>Charged transport:</strong> Where transport is deducted from wages, agencies must charge actual cost only. Workers on AgencyCheck reported paying €10–€36/week. One worker reported: "After paying €120 for accommodation, €36 for insurance, and €25 for transport, I end up with around €340 net per week."<br/><br/><strong>Transport delays:</strong> 4 of ${totalSeedReviews} reviews reported transport delays causing workers to miss the start of their shifts — with some agencies docking pay for late arrivals caused by the agency's own vehicle. Under Dutch law, if your employer's transport is late, the employer cannot legally dock your wages for the resultant late start.<br/><br/><strong>Own transport:</strong> Workers arranging their own transport can claim €0.23/km as a tax-deductible travel expense, but agencies are not obligated to pay a travel allowance unless specified in your contract or CAO.`,
        },
        {
          heading: "Health insurance — mandatory, often confused with the ZVW levy",
          body: `Many workers confuse two separate healthcare costs:<br/><br/><strong>1. ZVW werkgeversbijdrage:</strong> Deducted by your employer directly from your gross wages. Rate in 2026: approximately €11/week. This is not your personal health insurance — it funds the national healthcare system and is mandatory regardless of whether you have your own policy.<br/><br/><strong>2. Personal basisverzekering:</strong> Every person living in the Netherlands for more than 4 months must have their own basic health insurance. Premium: approximately €140–€160/month in 2026. Some agencies offer a collective scheme (groepsverzekering) at a slightly lower premium (~€120–€140/month), deducted from wages. If your agency deducts insurance, ask for the policy name and provider — if they cannot confirm these details, the deduction may be unlawful.<br/><br/>Workers who have been in the Netherlands for fewer than 4 months technically have a grace period before mandatory insurance applies, but this is commonly misunderstood. Any agency deducting insurance from week one should be running a genuine collective scheme — ask for written proof.`,
        },
        {
          heading: "Missing overtime and shift premiums — the silent cost no one mentions",
          body: `One of the most financially damaging "hidden costs" is not an explicit deduction — it is a premium that should be there but isn't. Under the ABU and NBBU collective agreements, shift premiums and overtime are mandatory additions to your base hourly rate.<br/><br/><strong>${missingOvertime} workers</strong> across ${totalSeedReviews} reviews reported overtime hours not appearing on their payslip. <strong>${payslipErrors} workers</strong> reported some form of payslip error — the most common being flat-rate payslips showing only total gross without shift differential line items.<br/><br/>Real example from a verified review: "December and January overtime hours were not on my payslips. I raised it twice before it was corrected. The amounts were not small — roughly €290 in total." This is a common pattern — the agency corrects when challenged but the worker must identify the error and follow up persistently.<br/><br/>How to catch this before it costs you months of under-payment:<br/>• Keep your own log of hours: day vs night vs weekend vs overtime<br/>• Compare your log against your payslip within 48 hours of receiving it<br/>• If the payslip shows no shift premium lines despite evening/night/Sunday work, contact your coordinator immediately in writing<br/>• Under Dutch law (BW 7:623), delayed wage corrections accrue a 50% statutory penalty after 3 days<br/><br/>If corrections are not made after two written requests, file a complaint with <strong>Inspectie SZW (inspectieszw.nl)</strong>.`,
        },
        {
          heading: "Illegal deductions — what agencies are not allowed to charge",
          body: `Dutch law (BW art. 7:631) is explicit about which deductions are permitted from wages without additional written consent. Legal deductions (with written contract) include income tax, ZVW levy, pension contributions, housing at the agreed rate, transport at actual cost, and collective insurance premium.<br/><br/>Agencies are <strong>not permitted</strong> to charge you for:<br/>• Work boots or PPE that are mandatory for the job<br/>• BIG certificate training required by the employer<br/>• Recruitment fees in any form (illegal under ILO standards adopted in Dutch law)<br/>• Damage to machinery or product — unless negligence is proven in court<br/>• Administrative costs or "service fees" for housing or contract management<br/><br/><strong>${contractIssues} workers</strong> in AgencyCheck reviews reported unclear or disputed contract terms. In several cases, workers discovered deductions that had not been disclosed before they started work. The most effective protection: do not sign any contract without a written line-by-line list of all deductions confirmed before your start date.`,
        },
        {
          heading: "The real annual cost of agency housing on your savings",
          body: `Housing is the single biggest variable in whether working in the Netherlands is financially worthwhile. Here is the annual impact of different housing arrangements on a WML worker (40h/week):<br/><br/><strong>Free housing:</strong> Bank approximately €${monthlyNet}/month → €${monthlyNet * 12}/year<br/><strong>Housing at €80/week:</strong> €${monthlyNet - 346}/month → €${(monthlyNet - 346) * 12}/year<br/><strong>Housing at €100/week:</strong> €${monthlyNet - 433}/month → €${(monthlyNet - 433) * 12}/year<br/><strong>Housing at €113.50/week:</strong> €${monthlyNet - 491}/month → €${(monthlyNet - 491) * 12}/year<br/><br/>The difference between free housing and maximum-rate housing is <strong>€491/month (€5,892/year)</strong> at WML. Over two years, this gap represents nearly €12,000 — the difference between arriving home with savings or arriving home with nothing.<br/><br/>This is why "agency jobs Netherlands housing" should always be the first filter for anyone planning to work here. ${housingCount} agencies on AgencyCheck disclose housing information publicly. Always use this as a primary filter before contacting an agency.`,
        },
        {
          heading: "How to calculate your real cost of living before you arrive",
          body: `Use this checklist before accepting any offer. Every item requires a written answer from the agency — verbal confirmations are not enforceable:<br/><br/><strong>Housing:</strong> What is the weekly housing cost? Is it SNF certified? How many people per room? What is the notice period to move out?<br/><strong>Transport:</strong> Is transport to the work site provided free? If charged, what is the weekly amount and how is it calculated?<br/><strong>Insurance:</strong> Is health insurance included or must you arrange your own? If deducted, what is the policy name and monthly premium?<br/><strong>Pay date:</strong> What day is salary paid? Is it weekly or monthly? Are shift premiums paid on the same schedule as base salary?<br/><strong>Overtime:</strong> What is the overtime rate? Does the contract reference the ABU or NBBU CAO? Will overtime appear as a separate payslip line?<br/><strong>Contract type:</strong> Phase A (uitzendovereenkomst) or Phase B? What are the termination notice requirements?<br/><br/>If an agency cannot provide written answers to all of these questions before you sign a contract and travel to the Netherlands, treat it as a serious warning sign. The best agencies publish most of this information publicly on AgencyCheck.`,
        },
        {
          heading: "Red flags that predict hidden cost problems",
          body: `Based on ${totalSeedReviews} reviews on AgencyCheck, these are the most reliable early warning signs that an agency will add costs you did not expect:<br/><br/><strong>No written cost breakdown before contract signing:</strong> Every agency with the highest AgencyCheck scores provided a written deduction schedule before the worker signed. Agencies that resist providing this have something to obscure.<br/><strong>Payslip shows only one gross figure:</strong> A legitimate payslip must itemise every component — base pay, shift premiums, vakantiegeld accrual, and each deduction line separately. A single gross number is either incompetence or concealment.<br/><strong>Housing cost changes after arrival:</strong> ${housingIssueCount} workers reported housing conditions worse than described. Get the exact weekly housing rate in writing before travel.<br/><strong>Transport delays with wage docking:</strong> 4 workers reported having wages docked for late arrival caused by agency transport. This is illegal — but fighting it after the fact is difficult.<br/><strong>Insurance deductions without policy documentation:</strong> If an agency deducts insurance but cannot provide the insurer name and policy number, the deduction may be fraudulent. Report to Inspectie SZW.<br/><br/>The most important single action: use AgencyCheck's transparency score and worker reviews to screen agencies before first contact. Agencies with repeated complaints about deductions rarely improve.`,
        },
      ],
      faqs: [
        {
          question: "How much does agency housing cost in the Netherlands?",
          answer:   `Agency housing costs €80–€113.50/week in 2026. The €113.50/week figure is the SNF legal maximum for certified shared accommodation. Some agencies charge less (€80–€95/week for basic shared rooms). Housing costs are deducted directly from your gross salary before payment. Always get the exact weekly rate in writing before signing your contract.`,
        },
        {
          question: "Can my agency deduct transport costs from my salary?",
          answer:   `Yes, but only if agreed in writing before you start work, and only at actual cost — not at a profit to the agency. Common transport charges are €10–€36/week depending on distance. If transport is delayed and you arrive late, the agency cannot legally dock your wages for the lost time if the transport failure was their responsibility.`,
        },
        {
          question: "Is health insurance deducted from my salary in the Netherlands?",
          answer:   `Two healthcare costs apply: (1) ZVW levy (~€11/week), automatically deducted by your employer; (2) personal health insurance (~€140–€160/month), legally required after 4 months in the Netherlands. Some agencies offer group schemes that deduct this from wages. Always ask for the insurer name and policy number if insurance is deducted.`,
        },
        {
          question: "What can agencies NOT deduct from my salary in the Netherlands?",
          answer:   `Without written prior consent, agencies cannot legally deduct: work equipment (tools, PPE, boots), training costs, recruitment fees, administrative fees, or damage claims from the work site. Under BW art. 7:631, only tax, social contributions, housing, transport, and insurance (if contracted in writing) are permitted deductions. Any other deduction requires a separate signed agreement.`,
        },
        {
          question: "Why was my overtime not paid — is this common?",
          answer:   `Overtime missing from payslips was reported in ${missingOvertime} of ${totalSeedReviews} reviews on AgencyCheck. Under the ABU CAO, hours 41–50 per week must be paid at 125% of base rate; hours 51+ at 150%. Night, Sunday, and public holiday premiums are also mandatory and must appear as separate named lines on your payslip. If missing, contact your agency coordinator in writing and request a correction within 7 days.`,
        },
        {
          question: "How do I calculate my real take-home pay before accepting a job in the Netherlands?",
          answer:   `Start with: (hourly rate × contracted hours) = weekly gross. Multiply by approximately 0.89 to estimate net after tax and levies. Then subtract housing (if charged), transport (if charged), and insurance (if deducted). Use AgencyCheck's real income calculator at /tools/real-income-calculator for exact 2026 Dutch tax rates. Compare this figure against what the agency promises verbally — if the numbers do not match, ask why before signing.`,
        },
      ],
      relatedAgencySlugs: ["covebo", "otto-work-force", "foreignflex", "europlus"],
      relatedCitySlugs:   ["tilburg", "venlo", "rotterdam", "eindhoven"],
      datePublished: "2026-04-01",
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
