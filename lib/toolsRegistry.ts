/**
 * toolsRegistry.ts — Single source of truth for all AgencyCheck worker tools.
 *
 * Tool ordering is intentional: highest-conversion-intent first.
 *   1. Job Offer Comparison  — decision moment, comparing real offers
 *   2. Real Salary Calculator — pre-application deep research
 *   3. Rent Calculator        — housing cost decision
 *   4. Weekly Salary Calc     — quick sanity check (highest traffic)
 *   5. Accommodation Costs    — agency-housing decision
 *   6. Real Income Comparison — legacy comparison tool
 *   7. Payslip Checker        — post-hire verification
 *   8. Shift Tracker          — ongoing tracking
 *
 * To add a new tool: add one entry to TOOLS_REGISTRY. The overview page,
 * sitemap, and all schema are driven from this config.
 *
 * ANNUAL REVIEW: Update badge text / descriptions when tax year changes.
 */

export type ToolCategory =
  | "comparison"   // compare two options side-by-side
  | "income"       // calculate take-home pay
  | "housing"      // accommodation / rent costs
  | "tracking";    // ongoing shift / payslip verification

export interface ToolRegistryEntry {
  /** URL slug — must match app/tools/[slug]/page.tsx route */
  slug: string;
  /** Full href (some tools are outside /tools/*) */
  href: string;
  /** Display title — used in cards, page headers, schema */
  title: string;
  /** One-line value proposition — shown under title */
  tagline: string;
  /** 2–3 sentence description for tool cards */
  description: string;
  /** Icon emoji */
  icon: string;
  /** Tool category for grid grouping */
  category: ToolCategory;
  /** Badge label — null = no badge */
  badge: string | null;
  /** Show in "featured" section on overview (max 3) */
  featured: boolean;
  /** Conversion intent rank — 1 = highest, used for featured ordering */
  conversionRank: number;
  /** Input hint labels for tool card */
  inputHints: string[];
  /** Output hint labels for tool card */
  outputHints: string[];
  /** Meta title for the tool's own page */
  metaTitle: string;
  /** Meta description for the tool's own page */
  metaDescription: string;
  /** CTA button label */
  ctaLabel: string;
}

export const TOOLS_REGISTRY: ToolRegistryEntry[] = [
  // ── COMPARISON ──────────────────────────────────────────────────────────────

  {
    slug:            "job-offer-comparison",
    href:            "/tools/job-offer-comparison",
    title:           "Job Offer Comparison Calculator",
    tagline:         "Which offer actually puts more money in your pocket?",
    description:
      "Compare two Dutch job offers side by side. Real take-home after 2026 loonheffing, housing deductions, transport, and healthcare. Includes trap detection — warns you when a higher gross rate is actually worse net.",
    icon:            "⚖️",
    category:        "comparison",
    badge:           "New",
    featured:        true,
    conversionRank:  1,
    inputHints:      ["Hourly rate", "Housing included?", "Transport cost", "Hours per week"],
    outputHints:     ["Real take-home for each offer", "Clear winner + margin", "Trap warnings"],
    metaTitle:       "Job Offer Comparison Calculator Netherlands 2026 — Which Offer Pays More?",
    metaDescription: "Compare two Dutch job offers side by side. Real take-home after loonheffing, housing deductions, transport, and healthcare. Free calculator.",
    ctaLabel:        "Compare offers",
  },
  {
    slug:            "real-salary-calculator",
    href:            "/tools/real-salary-calculator",
    title:           "Real Salary Calculator",
    tagline:         "Full take-home with Dutch income tax, overtime & vakantiegeld",
    description:
      "Complete calculation including Dutch income tax (loonheffing 2026), overtime premiums, and vakantiegeld (8%). See exactly what your hourly rate means as monthly and annual net income — before you sign a contract.",
    icon:            "📊",
    category:        "income",
    badge:           "2026",
    featured:        true,
    conversionRank:  2,
    inputHints:      ["Hourly rate", "Hours / week", "Contract type", "Overtime hours"],
    outputHints:     ["Monthly net after loonheffing", "Annual take-home", "Vakantiegeld split"],
    metaTitle:       "Real Salary Calculator Netherlands 2026 — Dutch Net Pay After Tax",
    metaDescription: "Calculate your real Dutch net salary for 2026. Includes loonheffing, heffingskorting, vakantiegeld, and overtime. Free calculator for flex workers.",
    ctaLabel:        "Calculate salary",
  },
  {
    slug:            "rent-calculator",
    href:            "/tools/rent-calculator",
    title:           "Netherlands Rent Calculator 2026",
    tagline:         "Is your rent affordable? Check huurtoeslag eligibility",
    description:
      "Check if your rent is affordable on your income, estimate huurtoeslag (rent allowance) eligibility, and verify if your rent falls within 2026 Dutch legal limits. Includes WWS sector check and social vs free-market classification.",
    icon:            "🏡",
    category:        "housing",
    badge:           null,
    featured:        true,
    conversionRank:  3,
    inputHints:      ["Monthly rent", "Monthly income", "Household size", "Housing type"],
    outputHints:     ["Affordability rating", "Huurtoeslag estimate", "WWS sector check"],
    metaTitle:       "Netherlands Rent Calculator 2026 — Huurtoeslag & Affordable Rent Check",
    metaDescription: "Check if your Dutch rent is affordable and if you qualify for huurtoeslag in 2026. Includes WWS sector classification and legal rent limits.",
    ctaLabel:        "Check my rent",
  },
  {
    slug:            "salary-calculator",
    href:            "/tools/salary-calculator",
    title:           "Weekly Salary Calculator",
    tagline:         "Your real weekly income after all deductions",
    description:
      "Enter your hourly wage, hours per week, and your weekly costs — housing, insurance, transport — to see exactly how much money you actually take home. Many workers are surprised by the difference between gross pay and real income.",
    icon:            "💶",
    category:        "income",
    badge:           "Most used",
    featured:        false,
    conversionRank:  4,
    inputHints:      ["Hourly wage", "Hours per week", "Housing cost", "Insurance cost"],
    outputHints:     ["Real weekly income after all deductions"],
    metaTitle:       "Weekly Salary Calculator Netherlands — Real Income After Deductions",
    metaDescription: "Calculate your real weekly income in the Netherlands after housing, insurance, and transport deductions. Free tool for agency workers.",
    ctaLabel:        "Calculate weekly pay",
  },
  {
    slug:            "accommodation-costs",
    href:            "/tools/accommodation-costs",
    title:           "Accommodation Cost Calculator",
    tagline:         "See exactly how housing affects your real income",
    description:
      "If your agency provides housing, weekly rent is deducted straight from your salary. Add insurance and transport to see how much spendable income you actually have. Essential before accepting any job with accommodation included.",
    icon:            "🏠",
    category:        "housing",
    badge:           null,
    featured:        false,
    conversionRank:  5,
    inputHints:      ["Weekly rent deduction", "Insurance cost", "Transport cost"],
    outputHints:     ["Remaining weekly income", "Full deduction breakdown"],
    metaTitle:       "Agency Accommodation Cost Calculator Netherlands — Real Take-Home Pay",
    metaDescription: "Calculate how much agency housing deductions reduce your real income in the Netherlands. See remaining weekly spendable pay after all costs.",
    ctaLabel:        "Calculate housing cost",
  },
  {
    slug:            "real-income-calculator",
    href:            "/tools/real-income-calculator",
    title:           "Compare Two Agency Offers",
    tagline:         "Which deal leaves you with more money?",
    description:
      "Put two job offers side by side and factor in housing and transport costs to see which deal actually leaves you with more money. Simple comparison without full tax calculation.",
    icon:            "🧮",
    category:        "comparison",
    badge:           null,
    featured:        false,
    conversionRank:  6,
    inputHints:      ["Rate A & B", "Housing cost each", "Transport each"],
    outputHints:     ["Net income comparison", "Better offer highlighted"],
    metaTitle:       "Compare Two Agency Job Offers Netherlands — Real Income Calculator",
    metaDescription: "Compare two Dutch agency job offers with housing and transport costs factored in. See which deal leaves you with more spendable income.",
    ctaLabel:        "Compare offers",
  },
  {
    slug:            "payslip-checker",
    href:            "/tools/payslip-checker",
    title:           "Payslip Checker",
    tagline:         "Check if your payslip is correct",
    description:
      "Enter your hours, hourly wage, gross salary, and deductions to see what your expected pay should be. The tool highlights unusual numbers and includes a 12-point verification checklist. Catch errors before they cost you money.",
    icon:            "🧾",
    category:        "tracking",
    badge:           null,
    featured:        false,
    conversionRank:  7,
    inputHints:      ["Hours worked", "Hourly wage", "Gross on payslip", "Listed deductions"],
    outputHints:     ["Expected pay estimate", "Warning flags for unusual numbers"],
    metaTitle:       "Payslip Checker Netherlands — Verify Your Dutch Pay Slip",
    metaDescription: "Check if your Dutch payslip is correct. Enter your hours and wage to see expected pay and flag unusual deductions. Free 12-point checklist.",
    ctaLabel:        "Check my payslip",
  },
  {
    slug:            "shift-tracker",
    href:            "/tools/shift-tracker",
    title:           "Work Hours Tracker",
    tagline:         "Log your hours and verify your pay",
    description:
      "Record your working hours for each day of the week. See total hours and estimated weekly pay so you can verify what your payslip should say. If the numbers don't match, you have grounds to ask questions.",
    icon:            "🕐",
    category:        "tracking",
    badge:           null,
    featured:        false,
    conversionRank:  8,
    inputHints:      ["Daily hours (Mon–Sun)", "Hourly rate"],
    outputHints:     ["Weekly total hours", "Estimated weekly pay"],
    metaTitle:       "Work Hours Tracker Netherlands — Log Shifts & Verify Pay",
    metaDescription: "Track your weekly working hours and estimate your pay to verify your Dutch payslip. Free shift logger for flex and agency workers.",
    ctaLabel:        "Track my hours",
  },
];

// ── Derived helpers ───────────────────────────────────────────────────────────

/** All tools sorted by conversion rank (ascending = highest intent first). */
export const toolsSortedByConversion = [...TOOLS_REGISTRY].sort(
  (a, b) => a.conversionRank - b.conversionRank,
);

/** Featured tools only (max 3), sorted by conversion rank. */
export const featuredTools = toolsSortedByConversion.filter((t) => t.featured);

/** Tools grouped by category, each group sorted by conversion rank. */
export function toolsByCategory(): Record<ToolCategory, ToolRegistryEntry[]> {
  const groups: Record<ToolCategory, ToolRegistryEntry[]> = {
    comparison: [],
    income:     [],
    housing:    [],
    tracking:   [],
  };
  for (const tool of toolsSortedByConversion) {
    groups[tool.category].push(tool);
  }
  return groups;
}

/** Category display metadata */
export const CATEGORY_META: Record<ToolCategory, { label: string; icon: string; description: string }> = {
  comparison: {
    label:       "Comparison Tools",
    icon:        "⚖️",
    description: "Compare offers side by side and find out which one pays better.",
  },
  income: {
    label:       "Income Calculators",
    icon:        "💶",
    description: "Calculate your real take-home pay after Dutch taxes and deductions.",
  },
  housing: {
    label:       "Housing & Rent",
    icon:        "🏠",
    description: "Understand how housing costs affect your spendable income.",
  },
  tracking: {
    label:       "Verification Tools",
    icon:        "📋",
    description: "Track your hours and verify your payslips are correct.",
  },
};
