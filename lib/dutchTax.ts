/**
 * AgencyCheck — Dutch Take-Home Pay Calculator
 * Estimates net income for agency workers in the Netherlands.
 *
 * Sources:
 *   - Loonheffing 2026 brackets (latest available)
 *   - WML (Wettelijk minimumloon) 2026 = €14.71/hr (21+, 40h/wk, Jan 2026)
 *   - Vakantiegeld = 8% of gross (legally required)
 *   - SNF housing deductions: typically €80–€110/week
 *   - Average health insurance (zorgverzekering): ~€140/month
 *
 * Note: All figures are estimates. Workers should consult their payslip.
 */

// ─── Tax brackets (2026) ──────────────────────────────────────────────────────

const TAX_BRACKETS_2026 = [
  { upTo: 38441,   rate: 0.3697 }, // Box 1 bracket 1
  { upTo: 76817,   rate: 0.3797 }, // Box 1 bracket 2
  { upTo: Infinity, rate: 0.4950 }, // Box 1 bracket 3
];

export const WML_HOURLY_2026 = 14.71; // €/hr minimum wage (21+, Jan 2026)
export const VAKANTIEGELD_RATE = 0.08; // 8% holiday allowance
export const HEALTHCARE_MONTHLY = 140;  // avg zorgverzekering premium (estimate)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TakeHomeInput {
  hourlyRate:       number;   // gross €/hr
  hoursPerWeek:     number;   // typical 40
  weeksPerYear:     number;   // typ 46-52
  includeVakantie:  boolean;  // include 8% holiday pay in gross
  housingCost:      number;   // €/month deducted by agency (0 if none)
  transportCost:    number;   // €/month own cost (0 if agency provides)
  healthcareOwnRisk?: number; // own risk portion per month (avg ~30/mo)
}

export interface TakeHomeResult {
  // Gross
  grossHourly:      number;
  grossMonthly:     number;
  grossAnnual:      number;

  // Tax
  incomeTax:        number;   // annual loonheffing
  taxMonthly:       number;
  effectiveTaxRate: number;   // %

  // Net before living costs
  netMonthly:       number;

  // Deductions
  housingMonthly:   number;
  transportMonthly: number;
  healthcareMonthly: number;

  // Real spendable
  spendableMonthly: number;
  effectiveHourly:  number;   // real €/hr after all costs
  vakantiegeldMonthly: number;

  // Contextual
  isAboveWML:       boolean;
  wmlGap:           number;   // how far above/below minimum wage
  riskLevel:        "low" | "medium" | "high";
  riskReasons:      string[];
}

// ─── Core calculation ─────────────────────────────────────────────────────────

export function calculateDutchTax(annualGross: number): number {
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

export function calculateTakeHome(input: TakeHomeInput): TakeHomeResult {
  const {
    hourlyRate,
    hoursPerWeek,
    weeksPerYear,
    includeVakantie,
    housingCost,
    transportCost,
    healthcareOwnRisk = 30,
  } = input;

  // Gross calculation
  const monthlyHours  = (hoursPerWeek * weeksPerYear) / 12;
  const grossMonthlyBase = hourlyRate * monthlyHours;
  const vakantiegeldMonthly = grossMonthlyBase * VAKANTIEGELD_RATE;
  const grossMonthly  = includeVakantie
    ? grossMonthlyBase + vakantiegeldMonthly
    : grossMonthlyBase;
  const grossAnnual   = grossMonthly * 12;
  const grossHourly   = hourlyRate;

  // Tax
  const incomeTax     = calculateDutchTax(grossAnnual);
  const taxMonthly    = incomeTax / 12;
  const effectiveTaxRate = grossAnnual > 0 ? incomeTax / grossAnnual : 0;

  // Net after tax
  const netMonthly    = grossMonthly - taxMonthly;

  // Living cost deductions
  const healthcareMonthly = HEALTHCARE_MONTHLY + healthcareOwnRisk;
  const totalDeductions   = housingCost + transportCost + healthcareMonthly;

  // Spendable
  const spendableMonthly = Math.max(0, netMonthly - totalDeductions);
  const effectiveHourly  = monthlyHours > 0
    ? spendableMonthly / monthlyHours
    : 0;

  // WML check
  const isAboveWML = hourlyRate >= WML_HOURLY_2026;
  const wmlGap     = hourlyRate - WML_HOURLY_2026;

  // Risk assessment
  const riskReasons: string[] = [];
  if (!isAboveWML)                  riskReasons.push("Below minimum wage (WML)");
  if (housingCost > 500)            riskReasons.push("High housing deduction (>€500/mo)");
  if (effectiveHourly < 5)          riskReasons.push("Effective take-home below €5/hr");
  if (effectiveTaxRate > 0.42)      riskReasons.push("High effective tax rate");
  if (spendableMonthly < 300)       riskReasons.push("Very low spendable income");

  const riskLevel: "low" | "medium" | "high" =
    riskReasons.length === 0 ? "low" :
    riskReasons.length <= 2  ? "medium" : "high";

  return {
    grossHourly,
    grossMonthly,
    grossAnnual,
    incomeTax,
    taxMonthly,
    effectiveTaxRate,
    netMonthly,
    housingMonthly:   housingCost,
    transportMonthly: transportCost,
    healthcareMonthly,
    spendableMonthly,
    effectiveHourly,
    vakantiegeldMonthly,
    isAboveWML,
    wmlGap,
    riskLevel,
    riskReasons,
  };
}

// ─── Formatting helpers ────────────────────────────────────────────────────────

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

export const HOUSING_DEDUCTION_RANGES = {
  low:    { min: 0,   max: 80,  label: "Low (€0–80/wk)",    monthlyEstimate: 250 },
  medium: { min: 80,  max: 110, label: "Typical (€80–110/wk)", monthlyEstimate: 390 },
  high:   { min: 110, max: 160, label: "High (€110–160/wk)", monthlyEstimate: 565 },
} as const;

// ─── Quick estimate (for card display) ───────────────────────────────────────

export function quickNetEstimate(hourlyRate: number, hasHousing: boolean): {
  netMonthly: string;
  effectiveHourly: string;
  note: string;
} {
  const result = calculateTakeHome({
    hourlyRate,
    hoursPerWeek: 40,
    weeksPerYear: 48,
    includeVakantie: false,
    housingCost: hasHousing ? 390 : 0,
    transportCost: hasHousing ? 0 : 80,
    healthcareOwnRisk: 30,
  });

  return {
    netMonthly: fmtEur(result.spendableMonthly),
    effectiveHourly: fmtEur(result.effectiveHourly, 2),
    note: hasHousing
      ? "After tax + housing deduction (est. €390/mo)"
      : "After tax + transport (est. €80/mo) + healthcare",
  };
}
