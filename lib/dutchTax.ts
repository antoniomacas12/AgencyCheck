/**
 * AgencyCheck — Dutch Take-Home Pay Calculator
 * Estimates net income for agency workers in the Netherlands.
 *
 * Sources:
 *   - Loonheffing brackets 2026: Belastingdienst (belastingdienst.nl/loonheffingen)
 *   - Heffingskorting 2026: Belastingdienst (belastingdienst.nl/heffingskortingen)
 *   - WML Jan 2026: Ministerie van SZW (rijksoverheid.nl/minimumloon)
 *   - Vakantiegeld: Burgerlijk Wetboek art. 7:634 (8% minimum, legally required)
 *   - SNF housing standards: snf.nl (norm €80–€115/week certified accommodation)
 *   - Average zorgpremie 2026: Zorginstituut Nederland / NZa (~€140/month estimate)
 *
 * Last verified: January 2026
 *
 * IMPORTANT — what this model includes vs. excludes:
 *   ✓ Loonheffing (income tax, Box 1)
 *   ✓ Algemene heffingskorting (general tax credit)
 *   ✓ Arbeidskorting (employment tax credit)
 *   ✓ Vakantiegeld (8% holiday allowance)
 *   ✓ Housing deduction (agency-charged, SNF ranges)
 *   ✓ Own healthcare costs (zorgpremie + eigen risico)
 *   ✓ Transport costs
 *   ✗ AOW-premie / WW / WIA premies — these are employer costs (werkgeverspremies),
 *       NOT deducted from worker gross pay (already priced in by employer above WML)
 *   ✗ CAO-specific supplements, toeslagen, or collective agreements
 *   ✗ Box 2 / Box 3 income (dividends, savings) — irrelevant for most agency workers
 *   ✗ Night, Sunday, or public holiday surcharges (add separately)
 *   ✗ Municipal taxes / water board taxes (minor, region-specific)
 *
 * Regional note: Housing costs vary significantly. Amsterdam/Utrecht: +30–50% above
 * the national SNF averages used here. Smaller cities/rural areas may be lower.
 */

// ─── Tax brackets 2026 (Box 1, Belastingdienst) ──────────────────────────────

/** Loonheffing (income tax) brackets for 2026. */
export const TAX_BRACKETS_2026 = [
  { upTo: 38441,    rate: 0.3697, label: "Bracket 1 (≤ €38,441)" },
  { upTo: 76817,    rate: 0.3797, label: "Bracket 2 (€38,441–€76,817)" },
  { upTo: Infinity, rate: 0.4950, label: "Bracket 3 (> €76,817)" },
] as const;

// ─── Heffingskorting 2026 (Belastingdienst) ──────────────────────────────────

/**
 * Algemene heffingskorting — reduces tax for ALL taxpayers.
 * Phases out with higher income.
 * Source: belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_1_2_en_3/algemene_heffingskorting
 */
export const AHK_2026 = {
  max:           3362,    // € per year (max credit)
  phaseOutStart: 24812,   // income above this reduces the credit
  phaseOutRate:  0.06095, // 6.095% reduction per € above the threshold
} as const;

/**
 * Arbeidskorting — additional credit for workers with employment/self-employment income.
 * Rewards working: phases in at low income, reaches maximum, then phases out.
 * Source: belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_1_2_en_3/arbeidskorting
 */
export const AK_2026 = {
  phaseIn1UpTo:  10741,   // first phase-in ceiling
  phaseIn1Rate:  0.08053, // 8.053%
  phaseIn2UpTo:  24821,   // second phase-in ceiling
  phaseIn2Rate:  0.29350, // 29.350% (higher rate for low-middle earners)
  plateauUpTo:   39958,   // credit stays at maximum between phaseIn2UpTo and here
  phaseOutRate:  0.06510, // 6.51% reduction per € above plateau
} as const;

// ─── Other constants ──────────────────────────────────────────────────────────

/** Minimum wage per hour (age 21+, 40h/week, January 2026). Source: rijksoverheid.nl */
export const WML_HOURLY_2026 = 14.71;

/** Legally required holiday allowance (vakantiegeld). Source: BW art. 7:634 */
export const VAKANTIEGELD_RATE = 0.08;

/** Average basic health insurance premium (zorgverzekering basisverzekering) 2026.
 *  Source: estimate based on NZa/Zorginstituut data. Varies €120–€165/month by insurer. */
export const HEALTHCARE_MONTHLY = 140;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TakeHomeInput {
  hourlyRate:          number;   // gross €/hr
  hoursPerWeek:        number;   // typically 40
  weeksPerYear:        number;   // typically 46–52 (use 48 for standard working year)
  includeVakantie:     boolean;  // add 8% holiday allowance to gross
  housingCost:         number;   // €/month deducted by agency (0 if living independently)
  transportCost:       number;   // €/month own cost (0 if agency provides)
  healthcareOwnRisk?:  number;   // eigen risico portion spread monthly (avg ~€33/mo)
}

export interface TakeHomeResult {
  // ── Gross ─────────────────────────────────────────────────────────────────
  grossHourly:             number;
  grossMonthly:            number;
  grossAnnual:             number;
  vakantiegeldMonthly:     number;

  // ── Tax ───────────────────────────────────────────────────────────────────
  taxBeforeCredits:        number;   // annual loonheffing BEFORE heffingskorting
  heffingskortingAnnual:   number;   // total annual tax credit (AHK + AK)
  ahkAnnual:               number;   // algemene heffingskorting component
  akAnnual:                number;   // arbeidskorting component
  incomeTax:               number;   // annual net tax (after credits)
  taxMonthly:              number;   // monthly net tax
  effectiveTaxRate:        number;   // % of gross actually paid in tax

  // ── Net before living costs ───────────────────────────────────────────────
  netMonthly:              number;

  // ── Deductions ────────────────────────────────────────────────────────────
  housingMonthly:          number;
  transportMonthly:        number;
  healthcareMonthly:       number;

  // ── Real spendable ────────────────────────────────────────────────────────
  spendableMonthly:        number;
  effectiveHourly:         number;   // real €/hr after all costs

  // ── Context ───────────────────────────────────────────────────────────────
  isAboveWML:              boolean;
  wmlGap:                  number;
  riskLevel:               "low" | "medium" | "high";
  riskReasons:             string[];
}

// ─── Tax credit functions ─────────────────────────────────────────────────────

/** Algemene heffingskorting for a given annual taxable income. */
export function calcAlgemeneHeffingskorting(annualIncome: number): number {
  if (annualIncome <= AHK_2026.phaseOutStart) return AHK_2026.max;
  const reduction = (annualIncome - AHK_2026.phaseOutStart) * AHK_2026.phaseOutRate;
  return Math.max(0, AHK_2026.max - reduction);
}

/**
 * Arbeidskorting for a given annual employment income.
 * Only applies to workers with "arbeidsinkomen" (employment/self-employment).
 * Assumes loonheffingskorting verklaring is submitted (primary employer).
 */
export function calcArbeidskorting(employmentIncome: number): number {
  const ak = AK_2026;
  let credit = 0;

  // Phase-in 1
  const tranche1 = Math.min(employmentIncome, ak.phaseIn1UpTo);
  credit += tranche1 * ak.phaseIn1Rate;

  // Phase-in 2
  if (employmentIncome > ak.phaseIn1UpTo) {
    const tranche2 = Math.min(employmentIncome, ak.phaseIn2UpTo) - ak.phaseIn1UpTo;
    credit += tranche2 * ak.phaseIn2Rate;
  }

  // Phase-out above plateau
  if (employmentIncome > ak.plateauUpTo) {
    const excess = employmentIncome - ak.plateauUpTo;
    credit = Math.max(0, credit - excess * ak.phaseOutRate);
  }

  return credit;
}

/** Total heffingskorting (AHK + arbeidskorting) for a worker. */
export function calculateHeffingskorting(annualGross: number): {
  total: number;
  ahk: number;
  ak: number;
} {
  const ahk = calcAlgemeneHeffingskorting(annualGross);
  const ak  = calcArbeidskorting(annualGross);
  return { total: ahk + ak, ahk, ak };
}

// ─── Core tax calculation ─────────────────────────────────────────────────────

/** Loonheffing BEFORE applying heffingskorting (the statutory bracket tax). */
export function calculateDutchTaxBrackets(annualGross: number): number {
  let tax = 0;
  let remaining = annualGross;
  let prev = 0;

  for (const bracket of TAX_BRACKETS_2026) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, bracket.upTo - prev);
    tax += taxable * bracket.rate;
    remaining -= taxable;
    prev = bracket.upTo;
  }
  return Math.max(0, tax);
}

/**
 * Net loonheffing AFTER applying heffingskorting.
 * This is what actually comes off your payslip (when loonheffingskorting is active).
 */
export function calculateDutchTax(annualGross: number): number {
  const gross = calculateDutchTaxBrackets(annualGross);
  const { total } = calculateHeffingskorting(annualGross);
  return Math.max(0, gross - total);
}

// ─── Full take-home calculation ───────────────────────────────────────────────

export function calculateTakeHome(input: TakeHomeInput): TakeHomeResult {
  const {
    hourlyRate,
    hoursPerWeek,
    weeksPerYear,
    includeVakantie,
    housingCost,
    transportCost,
    healthcareOwnRisk = 33,
  } = input;

  // ── Gross ──────────────────────────────────────────────────────────────────
  const monthlyHours        = (hoursPerWeek * weeksPerYear) / 12;
  const grossMonthlyBase    = hourlyRate * monthlyHours;
  const vakantiegeldMonthly = grossMonthlyBase * VAKANTIEGELD_RATE;
  const grossMonthly        = includeVakantie
    ? grossMonthlyBase + vakantiegeldMonthly
    : grossMonthlyBase;
  const grossAnnual  = grossMonthly * 12;
  const grossHourly  = hourlyRate;

  // ── Tax ────────────────────────────────────────────────────────────────────
  const taxBeforeCredits   = calculateDutchTaxBrackets(grossAnnual);
  const { total: heffingskortingAnnual, ahk: ahkAnnual, ak: akAnnual } =
    calculateHeffingskorting(grossAnnual);
  const incomeTax          = Math.max(0, taxBeforeCredits - heffingskortingAnnual);
  const taxMonthly         = incomeTax / 12;
  const effectiveTaxRate   = grossAnnual > 0 ? incomeTax / grossAnnual : 0;

  // ── Net after tax ──────────────────────────────────────────────────────────
  const netMonthly = grossMonthly - taxMonthly;

  // ── Living costs ───────────────────────────────────────────────────────────
  const healthcareMonthly = HEALTHCARE_MONTHLY + healthcareOwnRisk;
  const totalDeductions   = housingCost + transportCost + healthcareMonthly;

  // ── Spendable ──────────────────────────────────────────────────────────────
  const spendableMonthly = Math.max(0, netMonthly - totalDeductions);
  const effectiveHourly  = monthlyHours > 0 ? spendableMonthly / monthlyHours : 0;

  // ── WML check ──────────────────────────────────────────────────────────────
  const isAboveWML = hourlyRate >= WML_HOURLY_2026;
  const wmlGap     = hourlyRate - WML_HOURLY_2026;

  // ── Risk assessment ────────────────────────────────────────────────────────
  const riskReasons: string[] = [];
  if (!isAboveWML)              riskReasons.push("Below minimum wage (WML)");
  if (housingCost > 500)        riskReasons.push("High housing deduction (>€500/mo)");
  if (effectiveHourly < 5)      riskReasons.push("Effective take-home below €5/hr");
  if (effectiveTaxRate > 0.30)  riskReasons.push("High effective tax rate (>30%)");
  if (spendableMonthly < 300)   riskReasons.push("Very low spendable income");

  const riskLevel: "low" | "medium" | "high" =
    riskReasons.length === 0 ? "low" :
    riskReasons.length <= 2  ? "medium" : "high";

  return {
    grossHourly,
    grossMonthly,
    grossAnnual,
    vakantiegeldMonthly,
    taxBeforeCredits,
    heffingskortingAnnual,
    ahkAnnual,
    akAnnual,
    incomeTax,
    taxMonthly,
    effectiveTaxRate,
    netMonthly,
    housingMonthly:   housingCost,
    transportMonthly: transportCost,
    healthcareMonthly,
    spendableMonthly,
    effectiveHourly,
    isAboveWML,
    wmlGap,
    riskLevel,
    riskReasons,
  };
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

export function fmtEur(v: number, decimals = 0): string {
  return `€${v.toLocaleString("nl-NL", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function fmtPct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

// ─── Housing deduction ranges (SNF / ABU standard) ───────────────────────────

/** SNF-certified accommodation deduction ranges (source: snf.nl normen).
 *  These are the typical weekly deductions agencies charge for worker housing.
 *  Regional variation applies — Amsterdam/Utrecht may be 30–50% higher. */
export const HOUSING_DEDUCTION_RANGES = {
  low:    { min: 0,   max: 80,  label: "Low (€0–80/wk)",        monthlyEstimate: 250 },
  medium: { min: 80,  max: 115, label: "Typical (€80–115/wk)",  monthlyEstimate: 415 },
  high:   { min: 115, max: 160, label: "High (€115–160/wk)",    monthlyEstimate: 565 },
} as const;

// ─── Quick estimate (for card display) ───────────────────────────────────────

export function quickNetEstimate(hourlyRate: number, hasHousing: boolean): {
  netMonthly:      string;
  effectiveHourly: string;
  note:            string;
} {
  const result = calculateTakeHome({
    hourlyRate,
    hoursPerWeek:    40,
    weeksPerYear:    48,
    includeVakantie: false,
    housingCost:     hasHousing ? 415 : 0,
    transportCost:   hasHousing ? 0   : 80,
    healthcareOwnRisk: 33,
  });

  return {
    netMonthly:      fmtEur(result.spendableMonthly),
    effectiveHourly: fmtEur(result.effectiveHourly, 2),
    note: hasHousing
      ? "After tax (incl. heffingskorting) + housing est. €415/mo"
      : "After tax (incl. heffingskorting) + transport €80/mo + healthcare",
  };
}
