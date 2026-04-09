"use client";

/**
 * RentCalculatorClient — Netherlands Rent Affordability & Housing Check Tool
 *
 * ┌────────────────────────────────────────────────────────────────────┐
 * │  ⚠️  ADMIN: REVIEW ALL VALUES IN RULES_2026 EACH JANUARY          │
 * │  See "ANNUAL REVIEW CHECKLIST" at the bottom of this file         │
 * └────────────────────────────────────────────────────────────────────┘
 *
 * SOURCE MAP — all official Dutch sources used in this tool:
 *  [S1] Dienst Toeslagen / Belastingdienst — huurtoeslag 2026 parameters
 *       https://www.belastingdienst.nl/wps/wcm/connect/nl/huurtoeslag/
 *  [S2] Rijksoverheid indexering circular 25-Nov-2025 — WWS & huurtoeslag params
 *       https://www.rijksoverheid.nl/actueel/nieuws/2025/11/25/...
 *  [S3] Volkshuisvesting Nederland — maximale huurprijsgrenzen
 *       https://www.volkshuisvestingnederland.nl/.../maximale-huurprijsgrenzen
 *  [S4] Huurcommissie — Wet betaalbare huur, WWS zelfstandig & onzelfstandig
 *       https://www.huurcommissie.nl/onderwerpen/wet-betaalbare-huur
 *  [S5] Rijksoverheid — minimum wage Jan 2026
 *       https://www.government.nl/topics/minimum-wage/minimum-wage-amounts
 *  [S6] Rijksoverheid — housing deduction from WML (inhouding huisvesting)
 *       https://www.rijksoverheid.nl/actueel/nieuws/2025/02/06/...
 *  [S7] Rijksoverheid — zelfstandige vs onzelfstandige woonruimte
 *       https://www.rijksoverheid.nl/onderwerpen/huurwoning-zoeken/vraag-en-antwoord/...
 *
 * ANALYTICS EVENTS (fired via @vercel/analytics track()):
 *  rent_calc_viewed       — on component mount
 *  rent_calc_started      — on first field interaction
 *  rent_calc_completed    — on Calculate submit (valid data)
 *  rent_calc_result_shown — when results panel appears
 *  rent_calc_cta_clicked  — Apply button clicked
 *  rent_calc_lead_started — lead form first touched
 *  rent_calc_lead_submitted — lead form successfully sent
 */

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

// ─────────────────────────────────────────────────────────────────────────────
// LEGAL CONFIG — all thresholds must match official Dutch government sources
// *** REVIEW ANNUALLY — see checklist at bottom of file ***
// ─────────────────────────────────────────────────────────────────────────────

const RULES_2026 = {
  year: 2026,

  huurtoeslag: {
    // [S1] [S2] Dienst Toeslagen / Rijksoverheid Nov-2025
    // NOTE: max rent is NO LONGER an eligibility condition from 2026 (new rule)
    // It remains the cap for the CALCULATION of the benefit amount
    maxCalcRent21plus:    932.93,   // Max kale huur used in benefit calculation (21+)
    minRentUnder21:       498.20,   // Min rent threshold for under-21
    basishuurSingle:      202.52,   // Fixed own-contribution (single household)
    basishuurMulti:       200.71,   // Fixed own-contribution (multi-person household)
    assetLimitSingle:     38_479,   // Max vermogen per person on 1 Jan 2026
    assetLimitWithPartner:76_958,   // Max vermogen for household with partner
    // Income phase-out (linear, above these annual gross thresholds)
    // ⚠️ APPROXIMATE — derived from official formula, verify against Belastingdienst tables
    incomeThresholdSingle: 23_425,  // Annual gross above which toeslag reduces
    incomeThresholdMulti:  31_500,  // Annual gross above which toeslag reduces (multi)
    phaseoutRateSingle:   0.27,     // Reduction per euro above threshold (annual basis)
    phaseoutRateMulti:    0.22,     // Reduction per euro above threshold (multi)
  },

  wws: {
    // [S2] [S3] [S4] Rijksoverheid / Volkshuisvesting NL / Huurcommissie
    // Wet Betaalbare Huur — in force since 1 July 2024
    socialSectorMaxRent:  932.93,   // ≤143 WWS points → social sector
    liberalisatiegrens:   1_228.07, // 187+ points → free sector (no max)
    // Middle sector: 144–186 points, rent €932.94 – €1,228.07 (regulated)
    socialMaxPoints:      143,
    middleMaxPoints:      186,
  },

  minimumWage: {
    // [S5] Government.nl / Business.gov.nl — valid from 1 Jan 2026
    // Note: since 2024, only hourly rate is statutory; monthly is a calculation
    hourlyGross:           14.71,
    monthlyGross36h:    2_303.59,   // Based on 36h/week standard
    monthlyGross40h:    2_559.07,   // Approximation for 40h/week
  },

  agencyHousing: {
    // [S6] Rijksoverheid Feb 2025 — inhouding op wettelijk minimumloon
    // Max deduction from minimum wage for employer-provided housing (SNF certified)
    // Reducing annually: 2026=20%, 2027=15%, 2028=10%, 2029=5%, 2030=abolished
    maxDeductionPct: 0.20,
    phaseoutSchedule: { 2026: 0.20, 2027: 0.15, 2028: 0.10, 2029: 0.05, 2030: 0 },
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type HousingType    = "apartment" | "studio" | "shared_house" | "room" | "agency" | "";
type HouseholdType  = "single" | "couple" | "couple_kids" | "single_parent" | "";
type AssetBand      = "none" | "under_limit" | "over_limit" | "unsure" | "";
type ContractType   = "permanent" | "temporary" | "agency" | "";
type YesNo          = "yes" | "no" | "unsure" | "";
type RentPeriod     = "monthly" | "weekly";
type WorkPermit     = "eu_passport" | "eu_residence" | "work_permit" | "none" | "";
type StartAvail     = "now" | "1_week" | "2_weeks" | "1_month" | "";

interface FormState {
  // Income
  grossMonthly:       string;
  netMonthly:         string;
  contractType:       ContractType;
  // Rent
  rentAmount:         string;
  rentPeriod:         RentPeriod;
  rentIncludes:       "kale" | "includes_service" | "unsure" | "";
  serviceCosts:       string;
  utilitiesIncluded:  YesNo;
  internetIncluded:   YesNo;
  furnitureIncluded:  YesNo;
  // Home
  housingType:        HousingType;
  ownEntrance:        YesNo;
  ownKitchen:         YesNo;
  ownToilet:          YesNo;
  ownBathroom:        YesNo;
  cityInNL:           string;
  // About you
  age:                string;
  household:          HouseholdType;
  hasBsn:             YesNo;
  isRegistered:       YesNo;
  assetBand:          AssetBand;
  // Context (used for lead capture + analytics)
  currentCountry:     string;
  workPermit:         WorkPermit;
  availableToStart:   StartAvail;
  needsAccommodation: YesNo;
}

type AffordabilityCategory = "healthy" | "stretching" | "risky" | "very_risky";
type ToelagSignal           = "likely_possible" | "maybe_possible" | "unlikely" | "not_possible" | "cannot_assess";
type HousingClassification  = "zelfstandig" | "onzelfstandig" | "unclear";
type RentReasonableness     = "looks_normal" | "looks_high" | "may_be_challengeable" | "cannot_assess";

interface Results {
  monthlyRent:           number;   // kale huur normalised to monthly
  monthlyServiceCosts:   number;
  monthlyTotalHousing:   number;   // all-in monthly
  weeklyTotalHousing:    number;
  netMonthly:            number;   // confirmed or estimated
  netIsEstimated:        boolean;
  remainingAfterHousing: number;
  rentToIncomeRatio:     number;   // as fraction (0–1+)
  affordability:         AffordabilityCategory;
  toeslag: {
    signal:           ToelagSignal;
    estimatedMonthly: number | null;
    blockers:         string[];
    notes:            string[];
  };
  housingClass: {
    classification: HousingClassification;
    basis:          string;
  };
  rentReasonableness: {
    signal: RentReasonableness;
    notes:  string[];
  };
  // For analytics + lead metadata
  resultProfile: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTM CAPTURE
// ─────────────────────────────────────────────────────────────────────────────

function useUtm() {
  const ref = useRef<Record<string, string>>({});
  useEffect(() => {
    const p    = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const out: Record<string, string> = {};
    keys.forEach(k => { const v = p.get(k); if (v) out[k] = v; });
    ref.current = out;
  }, []);
  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS HELPER
// Wraps @vercel/analytics track() — no-ops on server, catches errors silently
// ─────────────────────────────────────────────────────────────────────────────

function fireEvent(name: string, props?: Record<string, string | number>) {
  try { track(name, props); } catch { /* non-critical */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// PURE CALCULATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function estimateNet(gross: number): number {
  // Very rough Netherlands net-from-gross approximation (employee, 2026)
  // Real net depends on tax brackets, credits, partner, etc.
  // DO NOT present this as anything other than an estimate.
  if (gross <= 2_000) return gross * 0.93;
  if (gross <= 2_500) return gross * 0.90;
  if (gross <= 3_200) return gross * 0.86;
  if (gross <= 4_000) return gross * 0.81;
  if (gross <= 5_500) return gross * 0.76;
  return gross * 0.70;
}

function affordabilityCategory(ratio: number): AffordabilityCategory {
  if (ratio <= 0.30) return "healthy";
  if (ratio <= 0.40) return "stretching";
  if (ratio <= 0.50) return "risky";
  return "very_risky";
}

function classifyHousing(form: FormState): { classification: HousingClassification; basis: string } {
  // [S7] A dwelling is zelfstandig if it has ALL of: own entrance, kitchen, toilet, bathroom (since Mar 2024)
  const { housingType, ownEntrance, ownKitchen, ownToilet, ownBathroom } = form;

  // Agency accommodation or room → almost certainly onzelfstandig
  if (housingType === "agency")
    return { classification: "onzelfstandig", basis: "Agency accommodation is almost always a shared/non-independent dwelling." };
  if (housingType === "room")
    return { classification: "onzelfstandig", basis: "A private room in a shared house is a non-independent (onzelfstandige) dwelling — facilities are shared." };

  // If all facilities confirmed private → zelfstandig
  const allOwn = ownEntrance === "yes" && ownKitchen === "yes" && ownToilet === "yes" && ownBathroom === "yes";
  if (allOwn)
    return { classification: "zelfstandig", basis: "You confirmed a private entrance, kitchen, toilet, and bathroom — this is an independent (zelfstandige) dwelling." };

  // If any facility is shared → onzelfstandig
  const anyShared = ownEntrance === "no" || ownKitchen === "no" || ownToilet === "no" || ownBathroom === "no";
  if (anyShared)
    return { classification: "onzelfstandig", basis: "Shared facilities (entrance, kitchen, toilet, or bathroom) make this a non-independent (onzelfstandige) dwelling." };

  // Shared house type → likely onzelfstandig unless facilities confirmed
  if (housingType === "shared_house")
    return { classification: "unclear", basis: "Shared houses are usually non-independent, but depends on whether you have private facilities. Check the items above." };

  // Apartment or studio with unsure answers
  if (housingType === "apartment" || housingType === "studio")
    return { classification: "unclear", basis: "An apartment or studio is usually independent, but confirm your entrance, kitchen, toilet, and bathroom are private." };

  return { classification: "unclear", basis: "Not enough information provided to classify the housing type." };
}

function estimateHuurtoeslag(form: FormState, kaleHuurMonthly: number): Results["toeslag"] {
  const R        = RULES_2026.huurtoeslag;
  const blockers: string[] = [];
  const notes:    string[] = [];

  const age        = parseInt(form.age, 10);
  const gross      = parseFloat(form.grossMonthly) || 0;
  const annualGross = gross * 12;
  const isMulti    = form.household === "couple" || form.household === "couple_kids" || form.household === "single_parent";
  const housingClass = classifyHousing(form);

  // Hard blockers — definitive disqualifiers
  if (form.hasBsn    === "no") blockers.push("BSN is required. Without a BSN number you cannot apply for huurtoeslag.");
  if (form.isRegistered === "no") blockers.push("You must be registered (BRP inschrijving) at the rental address.");
  if (!isNaN(age) && age < 18) blockers.push("Must be 18 or older.");

  // Housing type blocker
  if (housingClass.classification === "onzelfstandig") {
    blockers.push("Your housing appears to be a non-independent dwelling (onzelfstandige woonruimte). Huurtoeslag requires an independent dwelling with a private entrance, kitchen, toilet, and bathroom.");
  }

  // Asset blocker
  const assetLimit = isMulti ? R.assetLimitWithPartner : R.assetLimitSingle;
  if (form.assetBand === "over_limit") {
    blockers.push(`Your savings/assets appear to exceed the ${new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(assetLimit)} limit for ${isMulti ? "a multi-person household" : "a single person"}.`);
  }

  if (blockers.length > 0) {
    return { signal: "not_possible", estimatedMonthly: null, blockers, notes };
  }

  // Cannot fully assess
  if (housingClass.classification === "unclear") {
    notes.push("Housing type is unclear. Huurtoeslag only applies to independent dwellings (zelfstandige woonruimte).");
    return { signal: "cannot_assess", estimatedMonthly: null, blockers, notes: [...notes] };
  }
  if (form.hasBsn      === "unsure") notes.push("BSN is required — confirm you have or can get a BSN.");
  if (form.isRegistered === "unsure") notes.push("Registration at the address (BRP) is required.");
  if (form.assetBand   === "unsure")  notes.push("Asset limit is €" + assetLimit.toLocaleString("nl-NL") + " — if your savings exceed this, you won't be eligible.");

  // Age rule: if under 21, minimum rent must be €498.20
  if (!isNaN(age) && age < 21) {
    if (kaleHuurMonthly < R.minRentUnder21) {
      notes.push(`Your rent (€${kaleHuurMonthly.toFixed(2)}) is below the €${R.minRentUnder21} minimum for people under 21. No huurtoeslag on this rent.`);
      return { signal: "unlikely", estimatedMonthly: 0, blockers, notes };
    }
    notes.push("Under-21 rule: rent must be at least €498.20/month for huurtoeslag.");
  }

  // Estimate calculation
  const capRent          = Math.min(kaleHuurMonthly, R.maxCalcRent21plus);
  const basishuur        = isMulti ? R.basishuurMulti : R.basishuurSingle;
  const maxToeslag       = Math.max(0, capRent - basishuur);
  const threshold        = isMulti ? R.incomeThresholdMulti : R.incomeThresholdSingle;
  const phaseoutRate     = isMulti ? R.phaseoutRateMulti   : R.phaseoutRateSingle;
  const annualReduction  = Math.max(0, annualGross - threshold) * phaseoutRate;
  const monthlyReduction = annualReduction / 12;
  const estimated        = Math.max(0, Math.round(maxToeslag - monthlyReduction));

  // Service cost note (2026 change)
  notes.push("From 2026, only kale huur (bare rent) counts — service costs are excluded from huurtoeslag calculations.");

  if (kaleHuurMonthly > R.maxCalcRent21plus) {
    notes.push(`Your rent (€${kaleHuurMonthly.toFixed(0)}) exceeds €${R.maxCalcRent21plus}. You can still apply, but the benefit is calculated only on €${R.maxCalcRent21plus}.`);
  }

  notes.push("⚠️ This is an estimate only. The exact amount depends on your official toetsingsinkomen. Verify at toeslagen.nl.");

  const signal: ToelagSignal = estimated > 0
    ? (form.hasBsn === "yes" && form.isRegistered === "yes" ? "likely_possible" : "maybe_possible")
    : "unlikely";

  return { signal, estimatedMonthly: estimated, blockers, notes };
}

function assessRentReasonableness(kaleHuur: number, housingClass: HousingClassification, housingType: HousingType): Results["rentReasonableness"] {
  const notes: string[] = [];
  const W = RULES_2026.wws;

  if (housingClass === "unclear") {
    return {
      signal: "cannot_assess",
      notes:  ["Housing type is unclear. A WWS points check requires knowing whether the dwelling is independent or shared, plus property details (size, energy label, facilities)."],
    };
  }

  if (housingClass === "onzelfstandig") {
    // Rooms/shared: different WWS-O rules
    if (kaleHuur < 300) notes.push("This rent looks unusually low for the Netherlands. Double-check what is included.");
    if (kaleHuur > 900) notes.push("For a shared/room rental, this rent is high. A Huurprijscheck (Huurcommissie) for onzelfstandige woonruimte may be worth doing.");
    else if (kaleHuur > 600) notes.push("For a room or shared accommodation, this rent is in the higher range for the Netherlands.");
    notes.push("For shared/room rentals, the Huurcommissie applies the WWS-O (onzelfstandige woonruimte) points system. A full check requires property details.");
    return {
      signal: kaleHuur > 900 ? "may_be_challengeable" : kaleHuur > 600 ? "looks_high" : "looks_normal",
      notes,
    };
  }

  // Zelfstandig — apply WWS / Wet betaalbare huur tiers
  if (kaleHuur <= W.socialSectorMaxRent) {
    notes.push(`Your rent (€${kaleHuur.toFixed(0)}) is in the social sector range (≤€${W.socialSectorMaxRent}). The Huurcommissie regulates maximum rent. A WWS points check can confirm whether the rent is at or below the legal maximum.`);
    return { signal: "looks_normal", notes };
  }

  if (kaleHuur <= W.liberalisatiegrens) {
    notes.push(`Your rent (€${kaleHuur.toFixed(0)}) falls in the regulated middle sector (€${W.socialSectorMaxRent}–€${W.liberalisatiegrens}). Since July 2024 (Wet betaalbare huur), middle sector rents are legally regulated. Your rent must correspond to 144–186 WWS points.`);
    notes.push("Ask your landlord for the WWS points count (mandatory since Jan 2025 for new contracts). If the points don't support this rent, you may be able to challenge it via the Huurcommissie.");
    return { signal: "looks_high", notes };
  }

  // Above liberalisatiegrens — free sector
  notes.push(`Your rent (€${kaleHuur.toFixed(0)}) is in the free sector (above €${W.liberalisatiegrens}). No legal maximum applies. The landlord can set any rent in the free sector.`);
  if (housingType === "room" || housingType === "shared_house") {
    notes.push("⚠️ A high free-sector rent for what appears to be a room or shared house is unusual — confirm the dwelling actually has enough WWS points (187+) to be legally in the free sector.");
  }
  return { signal: "looks_high", notes };
}

function buildResults(form: FormState): Results | null {
  const gross     = parseFloat(form.grossMonthly) || 0;
  const net       = parseFloat(form.netMonthly)   || 0;
  const rawRent   = parseFloat(form.rentAmount)   || 0;

  if (gross <= 0 || rawRent <= 0) return null;

  // Normalize rent to monthly
  const monthlyRentRaw = form.rentPeriod === "weekly" ? rawRent * 52 / 12 : rawRent;

  // Service costs
  let kaleHuur           = monthlyRentRaw;
  let monthlyServiceCosts = 0;

  if (form.rentIncludes === "includes_service") {
    const sc        = parseFloat(form.serviceCosts) || 0;
    const scMonthly = form.rentPeriod === "weekly" ? sc * 52 / 12 : sc;
    kaleHuur        = Math.max(0, monthlyRentRaw - scMonthly);
    monthlyServiceCosts = scMonthly;
  } else if (form.rentIncludes === "kale") {
    const sc        = parseFloat(form.serviceCosts) || 0;
    const scMonthly = form.rentPeriod === "weekly" ? sc * 52 / 12 : sc;
    monthlyServiceCosts = scMonthly;
  }
  // "unsure" — treat all as kale huur for huurtoeslag, flag uncertainty via UI

  const monthlyTotalHousing = kaleHuur + monthlyServiceCosts;
  const weeklyTotalHousing  = monthlyTotalHousing * 12 / 52;

  // Net income
  const netIsEstimated  = !net || net <= 0;
  const netMonthly      = netIsEstimated ? estimateNet(gross) : net;

  const remainingAfterHousing = netMonthly - monthlyTotalHousing;
  const rentToIncomeRatio     = monthlyTotalHousing / netMonthly;
  const affordability         = affordabilityCategory(rentToIncomeRatio);

  const housingClass     = classifyHousing(form);
  const toeslag          = estimateHuurtoeslag(form, kaleHuur);
  const rentReasonableness = assessRentReasonableness(kaleHuur, housingClass.classification, form.housingType);

  // Build a compact result profile string (used for analytics + lead metadata)
  const resultProfile = [
    affordability,
    housingClass.classification,
    toeslag.signal,
    rentReasonableness.signal,
  ].join("|");

  return {
    monthlyRent: kaleHuur,
    monthlyServiceCosts,
    monthlyTotalHousing,
    weeklyTotalHousing,
    netMonthly,
    netIsEstimated,
    remainingAfterHousing,
    rentToIncomeRatio,
    affordability,
    toeslag,
    housingClass,
    rentReasonableness,
    resultProfile,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DISPLAY METADATA
// ─────────────────────────────────────────────────────────────────────────────

const AFFORDABILITY_META: Record<AffordabilityCategory, { label: string; color: string; bg: string; border: string; desc: string }> = {
  healthy:    { label: "Healthy",    color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", desc: "Rent is ≤30% of net income. This is considered financially comfortable." },
  stretching: { label: "Stretching", color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   desc: "Rent is 30–40% of net income. Manageable but leaves limited buffer." },
  risky:      { label: "Risky",      color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200",  desc: "Rent is 40–50% of net income. This is high — small changes to income or costs can become a problem." },
  very_risky: { label: "Very Risky", color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     desc: "Rent is >50% of net income. This is unsustainable for most people." },
};

const TOESLAG_META: Record<ToelagSignal, { label: string; color: string; icon: string }> = {
  likely_possible:  { label: "Likely possible",                color: "text-emerald-700", icon: "✅" },
  maybe_possible:   { label: "Maybe possible",                 color: "text-amber-700",   icon: "⚠️" },
  unlikely:         { label: "Unlikely at this income",        color: "text-orange-700",  icon: "🟠" },
  not_possible:     { label: "Not possible",                   color: "text-red-700",     icon: "❌" },
  cannot_assess:    { label: "Cannot assess without more info", color: "text-gray-600",   icon: "❓" },
};

const HOUSING_CLASS_META: Record<HousingClassification, { label: string; color: string }> = {
  zelfstandig:   { label: "Likely independent (zelfstandige woonruimte)",     color: "text-emerald-700" },
  onzelfstandig: { label: "Likely non-independent (onzelfstandige woonruimte)", color: "text-amber-700" },
  unclear:       { label: "Unclear — more info needed",                        color: "text-gray-500" },
};

const REASONABLENESS_META: Record<RentReasonableness, { label: string; color: string }> = {
  looks_normal:         { label: "Looks normal for the regulated sector",    color: "text-emerald-700" },
  looks_high:           { label: "Looks high — check the WWS points",        color: "text-amber-700" },
  may_be_challengeable: { label: "May be challengeable via Huurcommissie",   color: "text-red-700" },
  cannot_assess:        { label: "Cannot assess without property details",    color: "text-gray-500" },
};

function fmt(n: number)    { return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n); }
function fmtDec(n: number) { return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n); }
function pct(n: number)    { return Math.round(n * 100) + "%"; }

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
      <div className="mb-4">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-blue-600 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }: {
  value:       string;
  onChange:    (v: string) => void;
  placeholder?: string;
  type?:       string;
}) {
  return (
    <input
      type={type}
      inputMode={type === "number" ? "decimal" : undefined}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
    />
  );
}

function SelectInput({ value, onChange, options }: {
  value:    string;
  onChange: (v: string) => void;
  options:  { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
    >
      <option value="">Select…</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function ToggleGroup({ value, onChange, options }: {
  value:    string;
  onChange: (v: string) => void;
  options:  { value: string; label: string }[];
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
            value === o.value
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function InfoBox({ type, children }: { type: "info" | "warning" | "legal"; children: React.ReactNode }) {
  const styles = {
    info:    "bg-blue-50 border-blue-100 text-blue-800",
    warning: "bg-amber-50 border-amber-100 text-amber-900",
    legal:   "bg-gray-50 border-gray-200 text-gray-600",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-[11px] leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-2">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        {title}
        <span className="text-gray-400 ml-2">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 py-3 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

function ResultRow({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 ${highlight ? "bg-blue-50 -mx-4 px-4 rounded" : ""}`}>
      <span className="text-xs text-gray-600">{label}</span>
      <div className="text-right">
        <span className={`text-sm font-black ${highlight ? "text-blue-700" : "text-gray-900"}`}>{value}</span>
        {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function SignalBadge({ label, color }: { label: string; color: string }) {
  return <span className={`text-xs font-bold ${color}`}>{label}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINE LEAD CAPTURE FORM (Option A — show results first, soft gate after)
// Appears under results, before the conversion CTA.
// Fields pre-fill from calculator context wherever possible.
// ─────────────────────────────────────────────────────────────────────────────

interface LeadFormState {
  firstName:  string;
  contact:    string; // email or phone
  submitted:  boolean;
  submitting: boolean;
  error:      string | null;
}

function InlineLeadForm({
  form,
  results,
  utmRef,
  onLeadStarted,
  onLeadSubmitted,
}: {
  form:             FormState;
  results:          Results;
  utmRef:           React.MutableRefObject<Record<string, string>>;
  onLeadStarted:    () => void;
  onLeadSubmitted:  () => void;
}) {
  const [lead, setLead] = useState<LeadFormState>({
    firstName: "", contact: "", submitted: false, submitting: false, error: null,
  });
  const startedRef = useRef(false);

  function setL(k: keyof Pick<LeadFormState, "firstName" | "contact">, v: string) {
    if (!startedRef.current) { startedRef.current = true; onLeadStarted(); }
    setLead(s => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name    = lead.firstName.trim();
    const contact = lead.contact.trim();
    if (!name || !contact) {
      setLead(s => ({ ...s, error: "Please enter your name and email or phone." }));
      return;
    }

    setLead(s => ({ ...s, submitting: true, error: null }));

    const isEmail = contact.includes("@");
    // Pack calculator metadata into notes for admin visibility
    const notesObj = {
      source:              "rent_calculator",
      affordability:       results.affordability,
      housing_class:       results.housingClass.classification,
      toeslag_signal:      results.toeslag.signal,
      rent_reasonableness: results.rentReasonableness.signal,
      gross_monthly:       form.grossMonthly,
      rent_amount:         form.rentAmount,
      housing_type:        form.housingType,
      result_profile:      results.resultProfile,
      city_in_nl:          form.cityInNL || null,
      work_permit:         form.workPermit || null,
      ...utmRef.current,
    };

    const payload = {
      fullName:            name,
      ...(isEmail ? { email: contact } : { phone: contact }),
      currentCountry:      form.currentCountry || undefined,
      availability:        form.availableToStart || undefined,
      accommodationNeeded: form.needsAccommodation === "yes" ? true
                         : form.needsAccommodation === "no"  ? false
                         : undefined,
      sourceType:          "rent_calculator",
      sourcePage:          typeof window !== "undefined" ? window.location.pathname : "/tools/rent-calculator",
      sourceLabel:         "Rent Calculator Tool",
      notes:               JSON.stringify(notesObj),
      ...utmRef.current,
    };

    try {
      const res = await fetch("/api/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? "Server error");
      }
      setLead(s => ({ ...s, submitting: false, submitted: true, error: null }));
      onLeadSubmitted();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      setLead(s => ({ ...s, submitting: false, error: msg }));
    }
  }

  if (lead.submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-5 mb-4 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="text-sm font-black text-emerald-800 mb-1">We&apos;ve got your details.</p>
        <p className="text-xs text-emerald-700">
          We&apos;ll match you with agencies that fit your profile. Most people hear back within 48 hours.
          No commitment — you decide if any offer interests you.
        </p>
      </div>
    );
  }

  const isHighBurden = results.affordability === "risky" || results.affordability === "very_risky";
  const needsAccomm  = form.needsAccommodation === "yes";

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-5 mb-4">
      <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1">
        {isHighBurden || needsAccomm ? "Get matched — free" : "Looking for work in the Netherlands?"}
      </p>
      <p className="text-sm font-black text-gray-900 mb-1">
        {isHighBurden
          ? "Your rent burden is high. Want jobs with accommodation included?"
          : "Want to be matched with agencies offering accommodation?"}
      </p>
      <p className="text-xs text-gray-600 mb-4">
        Leave your name and contact — we&apos;ll send you real positions that match your profile.
        Takes 30 seconds. Free for workers.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">First name</label>
            <input
              type="text"
              value={lead.firstName}
              onChange={e => setL("firstName", e.target.value)}
              placeholder="Your name"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Email or phone</label>
            <input
              type="text"
              value={lead.contact}
              onChange={e => setL("contact", e.target.value)}
              placeholder="you@example.com or +48…"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        {lead.error && (
          <p className="text-xs text-red-600 mb-3">{lead.error}</p>
        )}

        <button
          type="submit"
          disabled={lead.submitting || !lead.firstName || !lead.contact}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all px-6 py-3 text-sm font-black text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {lead.submitting ? "Sending…" : "Send my details — find matching positions →"}
        </button>

        <p className="text-[10px] text-gray-400 text-center mt-2">
          No costs for workers. No spam. Unsubscribe any time.
        </p>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULTS PANEL
// ─────────────────────────────────────────────────────────────────────────────

function ResultsPanel({
  results,
  form,
  utmRef,
  onCtaClick,
  onLeadStarted,
  onLeadSubmitted,
}: {
  results:         Results;
  form:            FormState;
  utmRef:          React.MutableRefObject<Record<string, string>>;
  onCtaClick:      () => void;
  onLeadStarted:   () => void;
  onLeadSubmitted: () => void;
}) {
  const { affordability } = results;
  const aff   = AFFORDABILITY_META[affordability];
  const tMeta = TOESLAG_META[results.toeslag.signal];
  const hcMeta = HOUSING_CLASS_META[results.housingClass.classification];
  const rrMeta = REASONABLENESS_META[results.rentReasonableness.signal];

  return (
    <div id="results" className="mt-6">

      {/* ── 1. Cost breakdown ── */}
      <SectionCard title="📊 Your housing costs">
        <ResultRow label="Kale huur (bare rent) / month"     value={fmtDec(results.monthlyRent)} />
        {results.monthlyServiceCosts > 0 && (
          <ResultRow label="Service costs / month"           value={fmtDec(results.monthlyServiceCosts)} />
        )}
        <ResultRow label="Total housing cost / month"        value={fmt(results.monthlyTotalHousing)} highlight />
        <ResultRow label="Total housing cost / week"         value={fmtDec(results.weeklyTotalHousing)} />
        <ResultRow
          label={results.netIsEstimated ? "Net income / month (estimated ⚠️)" : "Net income / month"}
          value={fmt(results.netMonthly)}
          sub={results.netIsEstimated ? "Estimate based on gross — enter your actual net for precision" : undefined}
        />
        <ResultRow
          label="Remaining after housing"
          value={fmt(results.remainingAfterHousing)}
          sub={results.remainingAfterHousing < 0 ? "⚠️ Housing cost exceeds net income" : undefined}
        />
      </SectionCard>

      {/* ── 2. Affordability ── */}
      <SectionCard title="📈 Affordability">
        <div className={`rounded-xl border ${aff.border} ${aff.bg} px-4 py-4 mb-3`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-black ${aff.color}`}>{aff.label}</span>
            <span className={`text-lg font-black ${aff.color}`}>{pct(results.rentToIncomeRatio)}</span>
          </div>
          <p className="text-xs text-gray-600">{aff.desc}</p>
          {/* Visual bar */}
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                affordability === "healthy"    ? "bg-emerald-500" :
                affordability === "stretching" ? "bg-amber-500"   :
                affordability === "risky"      ? "bg-orange-500"  : "bg-red-500"
              }`}
              style={{ width: `${Math.min(100, results.rentToIncomeRatio * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 mt-1">
            <span>0%</span><span>30% (healthy limit)</span><span>50%</span><span>100%</span>
          </div>
        </div>
        <InfoBox type="legal">
          <strong>How this is calculated:</strong> Rent-to-income ratio = total monthly housing cost ÷ net monthly income.
          The 30% threshold is a widely used international guideline. It is not a legal rule in the Netherlands.
          {results.netIsEstimated && " ⚠️ Net income is estimated — your actual ratio may differ."}
        </InfoBox>
      </SectionCard>

      {/* ── 3. Huurtoeslag signal ── */}
      <SectionCard
        title="🏛️ Huurtoeslag (rent allowance)"
        subtitle="Based on official 2026 Dienst Toeslagen rules — source: belastingdienst.nl"
      >
        <div className="flex items-start gap-2 mb-3">
          <span className="text-xl">{tMeta.icon}</span>
          <div>
            <SignalBadge label={tMeta.label} color={tMeta.color} />
            {results.toeslag.estimatedMonthly !== null && results.toeslag.estimatedMonthly > 0 && (
              <p className="text-xs text-gray-700 mt-0.5">
                Rough estimate: <strong>{fmt(results.toeslag.estimatedMonthly)}/month</strong>
              </p>
            )}
          </div>
        </div>

        {results.toeslag.blockers.length > 0 && (
          <div className="mb-3 space-y-1.5">
            {results.toeslag.blockers.map((b, i) => (
              <div key={i} className="flex gap-2 items-start rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                <span className="text-red-500 text-xs mt-0.5 flex-shrink-0">✗</span>
                <p className="text-xs text-red-700">{b}</p>
              </div>
            ))}
          </div>
        )}

        {results.toeslag.notes.map((n, i) => (
          <div key={i} className="flex gap-2 items-start rounded-lg bg-gray-50 border border-gray-100 px-3 py-2 mb-1.5">
            <span className="text-gray-400 text-xs mt-0.5 flex-shrink-0">ℹ</span>
            <p className="text-xs text-gray-600">{n}</p>
          </div>
        ))}

        <div className="mt-3">
          <InfoBox type="legal">
            <strong>Official check:</strong> Always verify with a proefberekening at{" "}
            <a href="https://www.toeslagen.nl" target="_blank" rel="noopener noreferrer" className="underline">toeslagen.nl</a>.
            This estimate uses 2026 rules [S1][S2] and is not a legal determination.
            <br />
            <strong>Key 2026 changes:</strong> No maximum rent to qualify (new). Service costs excluded. Youth threshold lowered to 21 (was 23).
          </InfoBox>
        </div>
      </SectionCard>

      {/* ── 4. Housing classification ── */}
      <SectionCard
        title="🏠 Housing classification"
        subtitle="Determines huurtoeslag eligibility and which rent rules apply"
      >
        <div className="mb-2">
          <SignalBadge label={hcMeta.label} color={hcMeta.color} />
        </div>
        <p className="text-xs text-gray-600 mb-3">{results.housingClass.basis}</p>
        <InfoBox type="legal">
          <strong>Official definition [S7]:</strong> A dwelling is <em>zelfstandig</em> (independent) if it has its own lockable entrance, kitchen, toilet, AND shower/bathroom (all private since March 2024). Any shared facility makes it <em>onzelfstandig</em>. Only independent dwellings qualify for huurtoeslag.
        </InfoBox>
      </SectionCard>

      {/* ── 5. Rent reasonableness ── */}
      <SectionCard
        title="⚖️ Rent reasonableness check"
        subtitle="Based on 2026 WWS / Wet betaalbare huur thresholds — source: huurcommissie.nl"
      >
        <div className="mb-2">
          <SignalBadge label={rrMeta.label} color={rrMeta.color} />
        </div>
        {results.rentReasonableness.notes.map((n, i) => (
          <p key={i} className="text-xs text-gray-600 mb-2">{n}</p>
        ))}
        <InfoBox type="legal">
          <strong>Limitation:</strong> A full WWS (Woningwaarderingsstelsel) check requires property-level data: floor area, energy label, facilities, and location. This tool uses only rent amount and housing type as signals.
          For an official check: <a href="https://www.huurcommissie.nl/support/huurprijscheck" target="_blank" rel="noopener noreferrer" className="underline">huurcommissie.nl/huurprijscheck</a>
        </InfoBox>
      </SectionCard>

      {/* ── 6. Next actions ── */}
      <SectionCard title="📋 Recommended next steps">
        <ul className="space-y-2">
          {results.toeslag.signal === "likely_possible" && (
            <li className="flex gap-2 items-start text-xs text-gray-700">
              <span className="text-emerald-600 font-bold flex-shrink-0">→</span>
              Apply for huurtoeslag at <a href="https://www.toeslagen.nl" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">toeslagen.nl</a>. You may be eligible — do a proefberekening first.
            </li>
          )}
          {results.toeslag.signal === "maybe_possible" && (
            <li className="flex gap-2 items-start text-xs text-gray-700">
              <span className="text-amber-600 font-bold flex-shrink-0">→</span>
              Check eligibility with a free proefberekening at <a href="https://www.toeslagen.nl" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">toeslagen.nl</a> — the result depends on details you haven&apos;t confirmed yet.
            </li>
          )}
          {(results.rentReasonableness.signal === "looks_high" || results.rentReasonableness.signal === "may_be_challengeable") && results.housingClass.classification === "zelfstandig" && (
            <li className="flex gap-2 items-start text-xs text-gray-700">
              <span className="text-blue-600 font-bold flex-shrink-0">→</span>
              Check whether your rent is within the legal maximum using the Huurprijscheck at <a href="https://www.huurcommissie.nl/support/huurprijscheck" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">huurcommissie.nl</a>.
            </li>
          )}
          {results.housingClass.classification === "onzelfstandig" && (
            <li className="flex gap-2 items-start text-xs text-gray-700">
              <span className="text-blue-600 font-bold flex-shrink-0">→</span>
              For rooms and shared housing, the Huurcommissie can still check whether your rent is reasonable using the WWS-O (onzelfstandige woonruimte) points system.
            </li>
          )}
          {(results.affordability === "risky" || results.affordability === "very_risky") && (
            <li className="flex gap-2 items-start text-xs text-gray-700">
              <span className="text-red-600 font-bold flex-shrink-0">→</span>
              Your rent burden is high. Consider looking for positions that include accommodation — this significantly reduces your housing cost risk.
            </li>
          )}
          {results.netIsEstimated && (
            <li className="flex gap-2 items-start text-xs text-gray-700">
              <span className="text-gray-500 font-bold flex-shrink-0">→</span>
              Re-run with your actual net salary for a more precise affordability result. Your employer or payslip should show net monthly pay.
            </li>
          )}
          <li className="flex gap-2 items-start text-xs text-gray-700">
            <span className="text-gray-500 font-bold flex-shrink-0">→</span>
            Always get a signed rental contract with the landlord&apos;s KVK number before paying any deposit or arriving in the Netherlands.
          </li>
        </ul>
      </SectionCard>

      {/* ── Disclaimer ── */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 mb-4">
        <p className="text-[10px] text-gray-500 leading-relaxed">
          <strong className="text-gray-600">Disclaimer:</strong> This tool provides estimates and informational signals only.
          It does not constitute legal or financial advice. Huurtoeslag eligibility, rent legality, and affordability depend
          on personal circumstances that cannot be fully captured in a calculator. Always verify with official sources:
          Dienst Toeslagen (<a href="https://www.toeslagen.nl" className="underline">toeslagen.nl</a>),
          Huurcommissie (<a href="https://www.huurcommissie.nl" className="underline">huurcommissie.nl</a>), and
          Rijksoverheid (<a href="https://www.rijksoverheid.nl" className="underline">rijksoverheid.nl</a>).
          Rule values are based on 2026 official parameters and must be reviewed annually.
        </p>
      </div>

      {/* ── Inline lead form (Option A) ── */}
      <InlineLeadForm
        form={form}
        results={results}
        utmRef={utmRef}
        onLeadStarted={onLeadStarted}
        onLeadSubmitted={onLeadSubmitted}
      />

      {/* ── Conversion CTA ── */}
      <ConversionCTA results={results} onCtaClick={onCtaClick} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSION CTA
// Three variants documented below; default is shown.
// ─────────────────────────────────────────────────────────────────────────────

function ConversionCTA({ results, onCtaClick }: { results: Results; onCtaClick: () => void }) {
  const isHighBurden = results.affordability === "risky" || results.affordability === "very_risky";

  return (
    <div className="rounded-2xl bg-gray-950 border border-white/[0.08] px-5 py-6 mt-4">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        Positions available now
      </div>

      {/* Headline — default version */}
      <h3 className="text-lg sm:text-xl font-black text-white leading-tight mb-2">
        {isHighBurden
          ? "Stop paying too much for housing. Get a job that includes it."
          : "People with this profile are getting placed now."}
      </h3>

      {/* Supporting text */}
      <p className="text-sm text-gray-400 leading-relaxed mb-5">
        {isHighBurden
          ? "Jobs with accommodation in the Netherlands eliminate your biggest cost risk. We match you with verified agencies offering real positions — housing included."
          : "If you're looking for work in the Netherlands with accommodation included, we can match you with agencies and real offers. No fees, no guessing."}
      </p>

      {/* Trust points */}
      <div className="flex flex-col gap-1.5 mb-5">
        {[
          "Free service — no costs for workers",
          "Accommodation included in most positions",
          "Verified agencies, real contacts",
        ].map(point => (
          <div key={point} className="flex items-center gap-2 text-xs text-gray-400">
            <span className="text-blue-400 flex-shrink-0">✓</span>
            {point}
          </div>
        ))}
      </div>

      {/* CTA button */}
      <Link
        href="/#lead-form"
        onClick={onCtaClick}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all text-white font-black text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/20"
      >
        Apply — find jobs with accommodation →
      </Link>

      <p className="text-[10px] text-gray-600 mt-3">
        Takes 2 minutes. No CV required. You decide if an offer interests you.
      </p>
    </div>
  );
}

/*
 * ── CTA COPY VARIANTS (for A/B testing) ─────────────────────────────────────
 *
 * A/B TEST RECOMMENDATION:
 *   Test headline + button copy for "risky/very_risky" affordability users.
 *
 * DEFAULT (implemented above):
 *   Headline: "People with this profile are getting placed now."
 *   Body: "If you're looking for work in the Netherlands with accommodation included…"
 *   Button: "Apply — find jobs with accommodation →"
 *
 * SOFTER version (variant B):
 *   Headline: "Your profile may match agencies actively hiring right now."
 *   Body: "Check available positions with accommodation included. No commitment — you decide if any offer suits you."
 *   Button: "View available positions →"
 *
 * STRONGER version (variant C) — best for high-burden users:
 *   Headline: "Stop guessing. Get matched today."
 *   Body: "Your housing cost is solved when the job comes with it. Apply now — real offers in 48 hours."
 *   Button: "APPLY NOW →"
 *
 * RECOMMENDED A/B TEST:
 *   Split users with affordability=risky|very_risky: 50% see DEFAULT, 50% see STRONGER.
 *   Primary metric: rent_calc_cta_clicked event rate.
 *   Secondary metric: rent_calc_lead_submitted event rate.
 *   Run for minimum 2 weeks / 200 sessions per variant.
 */

// ─────────────────────────────────────────────────────────────────────────────
// EXPLAINER ACCORDIONS
// ─────────────────────────────────────────────────────────────────────────────

function Explainers() {
  return (
    <div className="mt-4">
      <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Explanations</p>
      <Accordion title="What is kale huur (bare rent)?">
        <p>Kale huur is the pure rent — what you pay for the use of the property itself. It does <strong>not</strong> include service costs (servicekosten), utilities, internet, or furniture.</p>
        <p className="mt-2">From 2026, <strong>only kale huur</strong> counts for huurtoeslag calculations. Service costs are excluded from the benefit formula.</p>
        <p className="mt-2">If your contract does not separate kale huur and service costs, ask your landlord for a breakdown. They are legally required to provide this in the Netherlands.</p>
      </Accordion>
      <Accordion title="What counts as service costs (servicekosten)?">
        <p>Service costs are amounts charged on top of the bare rent for services such as: cleaning of communal areas, garden maintenance, building insurance, caretaker fees, communal heating/water, and advance payments for gas/water/electricity (voorschot).</p>
        <p className="mt-2">Service costs are legally limited in the Netherlands. They must reflect actual costs. Your landlord must provide a yearly statement of actual service costs.</p>
        <p className="mt-2"><strong>From 2026:</strong> Service costs are not included in the huurtoeslag calculation — only kale huur matters.</p>
      </Accordion>
      <Accordion title="When is a home considered independent (zelfstandig)?">
        <p>A dwelling is <em>zelfstandige woonruimte</em> if it has ALL of the following — exclusively for your use:</p>
        <ul className="mt-2 list-disc pl-4 space-y-1">
          <li>Own lockable front door (private entrance)</li>
          <li>Own kitchen</li>
          <li>Own toilet</li>
          <li>Own shower or bathroom (required since March 2024)</li>
        </ul>
        <p className="mt-2">If you share any of these with other people, your home is <em>onzelfstandige woonruimte</em> (non-independent). This matters because <strong>huurtoeslag is only available for independent dwellings.</strong></p>
        <p className="mt-2">Most rooms, shared houses, and agency accommodation are non-independent.</p>
      </Accordion>
      <Accordion title="When might rent be too high or challengeable?">
        <p>Since July 2024 (Wet betaalbare huur), the Dutch government regulates rents in the social AND middle sectors based on the WWS points system:</p>
        <ul className="mt-2 list-disc pl-4 space-y-1">
          <li><strong>Social sector (≤143 WWS points):</strong> maximum rent is €932.93/month in 2026</li>
          <li><strong>Middle sector (144–186 points):</strong> maximum is €1,228.07/month in 2026</li>
          <li><strong>Free sector (187+ points):</strong> no legal maximum</li>
        </ul>
        <p className="mt-2">If your rent is too high for the points, you can ask the Huurcommissie to review it — within the first 12 months of your contract for new regulations. Use the free Huurprijscheck at <a href="https://www.huurcommissie.nl/support/huurprijscheck" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">huurcommissie.nl</a>.</p>
      </Accordion>
      <Accordion title="When might huurtoeslag (rent allowance) be possible?">
        <p>Huurtoeslag is a Dutch government benefit that helps lower-income renters pay their rent. The key 2026 conditions:</p>
        <ul className="mt-2 list-disc pl-4 space-y-1">
          <li>You must rent an <strong>independent dwelling</strong> (zelfstandige woonruimte)</li>
          <li>You must have a <strong>BSN</strong> (Dutch citizen service number)</li>
          <li>You must be <strong>registered</strong> at the address in the BRP (municipal records)</li>
          <li>You must be <strong>18 or older</strong></li>
          <li>Your savings must be below <strong>€38,479</strong> (single) or <strong>€76,958</strong> (with partner)</li>
          <li>From 2026: <strong>no maximum rent</strong> to qualify — but the benefit is calculated on a maximum of €932.93/month</li>
          <li>From 2026: only <strong>kale huur</strong> counts — service costs excluded</li>
        </ul>
        <p className="mt-2">There is no fixed income limit — but the benefit phases out as income rises. For a single person, it typically phases out completely around €51,000 annual income (varies with rent level).</p>
        <p className="mt-2"><strong>Source:</strong> Dienst Toeslagen / Belastingdienst (belastingdienst.nl/huurtoeslag), Nov 2025 parameters.</p>
      </Accordion>
      <Accordion title="Agency accommodation — how does it work?">
        <p>If your employer (uitzendbureau) provides housing, they may deduct the cost from your wages. Key 2026 rules:</p>
        <ul className="mt-2 list-disc pl-4 space-y-1">
          <li>Maximum deduction: <strong>20% of the statutory minimum wage</strong> (€14.71/hour in 2026)</li>
          <li>The agency must have <strong>SNF certification</strong> to make deductions below minimum wage</li>
          <li>This maximum is reducing each year: 15% in 2027, 10% in 2028, 5% in 2029, abolished in 2030</li>
          <li>Agency accommodation is usually <em>onzelfstandig</em> (non-independent) — typically no huurtoeslag</li>
        </ul>
        <p className="mt-2">Always ask for a written breakdown of what is deducted from your salary and why.</p>
        <p className="mt-2"><strong>Source:</strong> Rijksoverheid (rijksoverheid.nl), February 2025 announcement.</p>
      </Accordion>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL LINK BLOCK
// ─────────────────────────────────────────────────────────────────────────────

function InternalLinks() {
  return (
    <div className="mt-6 rounded-2xl border border-gray-100 bg-white px-5 py-5">
      <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Related tools &amp; resources</p>
      <div className="grid grid-cols-1 gap-2">
        {[
          { href: "/agencies-with-housing",          emoji: "🏠", label: "Browse agencies with accommodation included" },
          { href: "/tools/salary-calculator",        emoji: "💶", label: "Weekly salary calculator — real income after deductions" },
          { href: "/tools/real-salary-calculator",   emoji: "📊", label: "Full salary calculator with Dutch income tax 2026" },
          { href: "/tools/payslip-checker",          emoji: "🧾", label: "Payslip checker — verify your deductions are correct" },
          { href: "/agencies",                       emoji: "🔍", label: "Compare 150+ verified Dutch employment agencies" },
          { href: "/safety",                         emoji: "🛡️", label: "Worker safety guide — spot housing scams" },
        ].map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-2.5 text-xs text-blue-600 hover:text-blue-700 hover:underline py-1"
          >
            <span className="text-sm">{link.emoji}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ SECTION — SEO content
// ─────────────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "How much rent can I afford on a Dutch salary?",
    a: "A common guideline is that housing costs should not exceed 30% of your net (take-home) monthly income. On a net salary of €2,000/month, that means a maximum of €600/month on rent and associated housing costs. If rent takes up 40–50% of your income, it is generally considered financially risky. Above 50% is unsustainable for most people.",
  },
  {
    q: "What is huurtoeslag and who can get it?",
    a: "Huurtoeslag is a Dutch government rent allowance. It is paid monthly by Dienst Toeslagen and helps lower-income renters pay for an independent dwelling. To be eligible in 2026, you need: a BSN number, BRP registration at the rental address, an independent dwelling (own entrance, kitchen, toilet, bathroom), you must be 18 or older, and your savings must be below €38,479 (single) or €76,958 (with partner). There is no fixed income limit — the benefit reduces as income rises.",
  },
  {
    q: "What is the maximum rent for huurtoeslag in 2026?",
    a: "From 2026, there is no maximum rent threshold to qualify for huurtoeslag (this rule was abolished). However, the benefit is calculated on a maximum of €932.93 kale huur per month — if your rent is higher, the calculation is still capped at €932.93. Only kale huur (bare rent) counts; service costs are excluded from 2026.",
  },
  {
    q: "Can my landlord charge any rent they want?",
    a: "Not always. Since July 2024 (Wet betaalbare huur), Dutch rent is regulated in three sectors: social (≤143 WWS points, max €932.93/month), middle (144–186 points, max €1,228.07/month), and free sector (187+ points, no legal maximum). Most workers renting rooms or shared accommodation are in the social or middle sector. You can check your rent via the free Huurprijscheck at huurcommissie.nl.",
  },
  {
    q: "What is kale huur and how is it different from total rent?",
    a: "Kale huur (bare rent) is what you pay purely for the use of the dwelling itself. It excludes service costs (servicekosten) such as communal cleaning, garden maintenance, and energy advance payments. From 2026, only kale huur is used to calculate huurtoeslag — service costs do not count. Your landlord must provide a breakdown of kale huur and service costs on request.",
  },
  {
    q: "What is the difference between zelfstandige and onzelfstandige woonruimte?",
    a: "Zelfstandige woonruimte (independent housing) is a dwelling with its own private entrance, kitchen, toilet, and shower/bathroom — all exclusively for your use. Everything else is onzelfstandige woonruimte (non-independent): rooms in shared houses, most agency accommodation, and properties with shared facilities. Only independent dwellings qualify for huurtoeslag. Different rent regulation rules also apply to each type.",
  },
  {
    q: "Can an employment agency deduct housing costs from my salary?",
    a: "Yes — if you live in agency-provided accommodation (SNF-certified), your employer can deduct housing costs from your wages. In 2026, the maximum deduction is 20% of the statutory minimum wage (€14.71/hour). This maximum reduces each year: 15% in 2027, 10% in 2028, 5% in 2029, and is abolished entirely in 2030. Always ask for a written breakdown of all deductions.",
  },
  {
    q: "What is a 'fair' weekly rent deduction for agency accommodation in the Netherlands?",
    a: "Based on minimum wage rules and common market rates, most SNF-certified agency accommodation costs workers €80–115 per week (deducted from gross salary). The legal maximum in 2026 is 20% of statutory minimum wage, which works out to approximately €460/month or about €106/week for a 40-hour worker. If you are paying significantly more, ask for the SNF certification details and a breakdown.",
  },
  {
    q: "How do I check if my rent is too high under Dutch law?",
    a: "Use the free Huurprijscheck at huurcommissie.nl to check whether your rent is within the legal maximum based on the WWS points system. For independent housing in the social and middle sectors, your landlord is required to provide the WWS points count (mandatory since January 2025 for new contracts). If the rent exceeds the points-based maximum, you can submit a dispute to the Huurcommissie, usually within 12 months of signing the contract.",
  },
  {
    q: "Do I need a BSN to rent a room or apartment in the Netherlands?",
    a: "You do not need a BSN to enter into a rental contract. However, you need a BSN to: apply for huurtoeslag, register with the municipality (BRP), open a Dutch bank account, and receive your salary correctly. As a worker, getting a BSN should be one of your first steps after arriving. Your employer or uitzendbureau can often help with the registration process.",
  },
];

function FaqSection() {
  return (
    <section className="mt-8 mb-6">
      <h2 className="text-base font-black text-gray-900 mb-4">
        Frequently Asked Questions — Netherlands Rent &amp; Housing
      </h2>
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="border border-gray-100 rounded-xl overflow-hidden bg-white">
            <details className="group">
              <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors">
                <span>{item.q}</span>
                <span className="text-gray-400 ml-3 flex-shrink-0 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                {item.a}
              </div>
            </details>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_FORM: FormState = {
  // Income
  grossMonthly: "", netMonthly: "", contractType: "",
  // Rent
  rentAmount: "", rentPeriod: "monthly", rentIncludes: "", serviceCosts: "",
  utilitiesIncluded: "", internetIncluded: "", furnitureIncluded: "",
  // Home
  housingType: "", ownEntrance: "", ownKitchen: "", ownToilet: "", ownBathroom: "",
  cityInNL: "",
  // About you
  age: "", household: "", hasBsn: "", isRegistered: "", assetBand: "",
  // Context
  currentCountry: "", workPermit: "", availableToStart: "", needsAccommodation: "",
};

export default function RentCalculatorClient() {
  const [form,      setForm]      = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const utmRef     = useUtm();
  const startedRef = useRef(false);

  // ── Analytics: viewed ──
  useEffect(() => {
    fireEvent("rent_calc_viewed");
  }, []);

  // ── Analytics: result shown ──
  const results = useMemo(() => submitted ? buildResults(form) : null, [submitted, form]);

  useEffect(() => {
    if (results) {
      fireEvent("rent_calc_result_shown", {
        affordability:    results.affordability,
        housing_class:    results.housingClass.classification,
        toeslag_signal:   results.toeslag.signal,
        rent_signal:      results.rentReasonableness.signal,
        country:          form.currentCountry || "unknown",
        housing_type:     form.housingType    || "unknown",
      });
    }
  }, [results, form.currentCountry, form.housingType]);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    // Analytics: started
    if (!startedRef.current) {
      startedRef.current = true;
      fireEvent("rent_calc_started", { field: k as string });
    }
    setForm(f => ({ ...f, [k]: v }));
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    fireEvent("rent_calc_completed", {
      salary_type:   form.netMonthly ? "net_provided" : "gross_only",
      housing_type:  form.housingType || "unknown",
      rent_period:   form.rentPeriod,
      country:       form.currentCountry || "unknown",
    });
    setSubmitted(true);
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setSubmitted(false);
    startedRef.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const canCalculate = !!form.grossMonthly && !!form.rentAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">

        {/* ── Header ── */}
        <div className="mb-6">
          <Link href="/tools" className="text-xs text-gray-400 hover:text-gray-600 mb-3 inline-block">← All tools</Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-2">
            Netherlands Rent Calculator 2026
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Check your rent affordability, estimate huurtoeslag eligibility, and find out if your rent is reasonable — based on official 2026 Dutch rules.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {["2026 rules", "Huurtoeslag check", "WWS signals", "Agency workers"].map(tag => (
              <span key={tag} className="text-[10px] font-semibold text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">{tag}</span>
            ))}
          </div>
        </div>

        <form onSubmit={handleCalculate} noValidate>

          {/* ── SECTION 1: Income ── */}
          <SectionCard title="💼 Your income" subtitle="Required fields are marked *">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Gross monthly salary" required hint="Before tax and deductions">
                <TextInput value={form.grossMonthly} onChange={v => set("grossMonthly", v)} placeholder="€ 2,500" type="number" />
              </Field>
              <Field label="Net monthly salary" hint="Optional — improves accuracy">
                <TextInput value={form.netMonthly} onChange={v => set("netMonthly", v)} placeholder="€ 2,100" type="number" />
              </Field>
            </div>
            {!form.netMonthly && form.grossMonthly && (
              <InfoBox type="info">
                No net salary entered — we will estimate it. Enter your actual net pay for a more precise result.
              </InfoBox>
            )}
            <Field label="Contract type" hint="Optional — helps contextualise the result">
              <ToggleGroup
                value={form.contractType}
                onChange={v => set("contractType", v as ContractType)}
                options={[
                  { value: "permanent", label: "Permanent" },
                  { value: "temporary", label: "Temporary" },
                  { value: "agency",    label: "Agency (uitzendbureau)" },
                ]}
              />
            </Field>
          </SectionCard>

          {/* ── SECTION 2: Rent ── */}
          <SectionCard title="🏠 Your rent" subtitle="Enter the amount you pay">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Rent amount" required>
                <TextInput value={form.rentAmount} onChange={v => set("rentAmount", v)} placeholder="€ 850" type="number" />
              </Field>
              <Field label="Per">
                <ToggleGroup
                  value={form.rentPeriod}
                  onChange={v => set("rentPeriod", v as RentPeriod)}
                  options={[{ value: "monthly", label: "Month" }, { value: "weekly", label: "Week" }]}
                />
              </Field>
            </div>

            <Field label="What does this amount include?">
              <ToggleGroup
                value={form.rentIncludes}
                onChange={v => set("rentIncludes", v as FormState["rentIncludes"])}
                options={[
                  { value: "kale",             label: "Kale huur only" },
                  { value: "includes_service", label: "Includes service costs" },
                  { value: "unsure",           label: "Not sure" },
                ]}
              />
            </Field>

            {(form.rentIncludes === "includes_service" || form.rentIncludes === "kale") && (
              <Field
                label={form.rentIncludes === "includes_service" ? "Service costs included (amount)" : "Service costs (if charged separately)"}
                hint="Monthly amount — leave blank if unknown"
              >
                <TextInput value={form.serviceCosts} onChange={v => set("serviceCosts", v)} placeholder="€ 0" type="number" />
              </Field>
            )}

            {form.rentIncludes === "unsure" && (
              <InfoBox type="warning">
                If you're unsure, ask your landlord for a split between kale huur and servicekosten. From 2026, only kale huur counts for huurtoeslag — service costs are excluded.
              </InfoBox>
            )}

            <div className="grid grid-cols-2 gap-3 mt-1">
              <Field label="Gas/water/electricity included?" hint="In the rent amount">
                <ToggleGroup value={form.utilitiesIncluded} onChange={v => set("utilitiesIncluded", v as YesNo)} options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
              </Field>
              <Field label="Furniture included?">
                <ToggleGroup value={form.furnitureIncluded} onChange={v => set("furnitureIncluded", v as YesNo)} options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
              </Field>
            </div>
          </SectionCard>

          {/* ── SECTION 3: Your home ── */}
          <SectionCard title="🏡 Your home" subtitle="Helps determine housing type and rent rules">
            <Field label="Type of accommodation">
              <SelectInput
                value={form.housingType}
                onChange={v => set("housingType", v as HousingType)}
                options={[
                  { value: "apartment",    label: "Private apartment / flat" },
                  { value: "studio",       label: "Studio" },
                  { value: "shared_house", label: "Shared house (with others)" },
                  { value: "room",         label: "Private room (in shared house)" },
                  { value: "agency",       label: "Agency accommodation (provided by employer)" },
                ]}
              />
            </Field>

            <Field label="City or area in the Netherlands" hint="Optional — e.g. Rotterdam, Westland, Venlo">
              <TextInput value={form.cityInNL} onChange={v => set("cityInNL", v)} placeholder="e.g. Rotterdam" />
            </Field>

            <p className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 mt-3">Do you have your own (private) — not shared with anyone:</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Entrance / front door">
                <ToggleGroup value={form.ownEntrance} onChange={v => set("ownEntrance", v as YesNo)} options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Unsure" }]} />
              </Field>
              <Field label="Kitchen">
                <ToggleGroup value={form.ownKitchen} onChange={v => set("ownKitchen", v as YesNo)} options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Unsure" }]} />
              </Field>
              <Field label="Toilet">
                <ToggleGroup value={form.ownToilet} onChange={v => set("ownToilet", v as YesNo)} options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Unsure" }]} />
              </Field>
              <Field label="Shower / bathroom">
                <ToggleGroup value={form.ownBathroom} onChange={v => set("ownBathroom", v as YesNo)} options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Unsure" }]} />
              </Field>
            </div>
            <InfoBox type="info">
              All four facilities must be private (not shared) for a dwelling to qualify as <em>zelfstandige woonruimte</em> — required for huurtoeslag.
            </InfoBox>
          </SectionCard>

          {/* ── SECTION 4: About you ── */}
          <SectionCard title="👤 About you" subtitle="For huurtoeslag eligibility signals — all optional">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Your age" hint="Affects minimum rent threshold">
                <TextInput value={form.age} onChange={v => set("age", v)} placeholder="e.g. 28" type="number" />
              </Field>
              <Field label="Household">
                <SelectInput
                  value={form.household}
                  onChange={v => set("household", v as HouseholdType)}
                  options={[
                    { value: "single",       label: "Single (no partner)" },
                    { value: "couple",       label: "Couple (no children)" },
                    { value: "couple_kids",  label: "Couple with children" },
                    { value: "single_parent", label: "Single parent" },
                  ]}
                />
              </Field>
            </div>

            <Field label="Do you have a BSN (Dutch citizen service number)?" hint="Required for huurtoeslag">
              <ToggleGroup value={form.hasBsn} onChange={v => set("hasBsn", v as YesNo)} options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not yet" }]} />
            </Field>

            <Field label="Are you registered at this address? (BRP inschrijving)" hint="Required for huurtoeslag">
              <ToggleGroup value={form.isRegistered} onChange={v => set("isRegistered", v as YesNo)} options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not yet" }]} />
            </Field>

            <Field label="Your total savings / assets" hint="For huurtoeslag: limit is €38,479 (single) or €76,958 (with partner) as of 1 Jan 2026">
              <SelectInput
                value={form.assetBand}
                onChange={v => set("assetBand", v as AssetBand)}
                options={[
                  { value: "none",        label: "None / very little" },
                  { value: "under_limit", label: "Under the limit (€38,479 / €76,958)" },
                  { value: "over_limit",  label: "Over the limit" },
                  { value: "unsure",      label: "Not sure" },
                ]}
              />
            </Field>

            <Field label="Country you are currently in" hint="Helps us match you with the right positions">
              <SelectInput
                value={form.currentCountry}
                onChange={v => set("currentCountry", v)}
                options={[
                  { value: "Netherlands", label: "Netherlands (already here)" },
                  { value: "Poland",      label: "Poland" },
                  { value: "Romania",     label: "Romania" },
                  { value: "Portugal",    label: "Portugal" },
                  { value: "Bulgaria",    label: "Bulgaria" },
                  { value: "Hungary",     label: "Hungary" },
                  { value: "Slovakia",    label: "Slovakia" },
                  { value: "Czech Republic", label: "Czech Republic" },
                  { value: "Ukraine",     label: "Ukraine" },
                  { value: "Other EU",    label: "Other EU country" },
                  { value: "Non-EU",      label: "Non-EU country" },
                ]}
              />
            </Field>

            <Field label="Work permit / passport status" hint="Affects which positions you can apply for">
              <ToggleGroup
                value={form.workPermit}
                onChange={v => set("workPermit", v as WorkPermit)}
                options={[
                  { value: "eu_passport",   label: "EU passport" },
                  { value: "eu_residence",  label: "EU residence permit" },
                  { value: "work_permit",   label: "Work permit (non-EU)" },
                  { value: "none",          label: "None / unsure" },
                ]}
              />
            </Field>

            <Field label="When are you available to start?">
              <ToggleGroup
                value={form.availableToStart}
                onChange={v => set("availableToStart", v as StartAvail)}
                options={[
                  { value: "now",     label: "Now" },
                  { value: "1_week",  label: "1 week" },
                  { value: "2_weeks", label: "2 weeks" },
                  { value: "1_month", label: "1 month+" },
                ]}
              />
            </Field>

            <Field label="Do you need accommodation with the job?">
              <ToggleGroup
                value={form.needsAccommodation}
                onChange={v => set("needsAccommodation", v as YesNo)}
                options={[
                  { value: "yes",   label: "Yes — accommodation needed" },
                  { value: "no",    label: "No — I have housing" },
                  { value: "unsure", label: "Flexible" },
                ]}
              />
            </Field>
          </SectionCard>

          {/* ── Calculate button ── */}
          <button
            type="submit"
            disabled={!canCalculate}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all px-8 py-4 text-base font-black text-white shadow-sm shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed mb-2"
          >
            Calculate →
          </button>
          {!canCalculate && (
            <p className="text-center text-xs text-gray-400 mb-4">Enter your salary and rent amount to calculate.</p>
          )}
        </form>

        {/* ── Results ── */}
        {results && (
          <ResultsPanel
            results={results}
            form={form}
            utmRef={utmRef}
            onCtaClick={() => fireEvent("rent_calc_cta_clicked", {
              affordability:  results.affordability,
              toeslag_signal: results.toeslag.signal,
            })}
            onLeadStarted={() => fireEvent("rent_calc_lead_started")}
            onLeadSubmitted={() => fireEvent("rent_calc_lead_submitted", {
              affordability: results.affordability,
              country:       form.currentCountry || "unknown",
              work_permit:   form.workPermit || "unknown",
            })}
          />
        )}
        {submitted && !results && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 mt-4">
            <p className="text-sm text-red-700">Please enter a valid salary and rent amount to see results.</p>
          </div>
        )}

        {/* ── Reset ── */}
        {submitted && (
          <button
            type="button"
            onClick={handleReset}
            className="w-full mt-4 text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors"
          >
            ↺ Start over
          </button>
        )}

        {/* ── Explainers ── */}
        <Explainers />

        {/* ── Internal links ── */}
        <InternalLinks />

        {/* ── FAQ (SEO) ── */}
        <FaqSection />

        {/* ── Source citations ── */}
        <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 px-4 py-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Official sources used</p>
          <ul className="space-y-1 text-[10px] text-gray-500">
            <li>[S1] Dienst Toeslagen — <a href="https://www.belastingdienst.nl/wps/wcm/connect/nl/huurtoeslag/" className="underline hover:text-gray-700" target="_blank" rel="noopener">belastingdienst.nl/huurtoeslag</a></li>
            <li>[S2] Rijksoverheid indexering 25-Nov-2025 — <a href="https://www.rijksoverheid.nl/actueel/nieuws/2025/11/25/indexering-inkomensgrenzen-woningcorporaties-maximale-huurprijsgrenzen-en-huurtoeslagparameters-2026" className="underline hover:text-gray-700" target="_blank" rel="noopener">rijksoverheid.nl</a></li>
            <li>[S3] Volkshuisvesting NL — maximale huurprijsgrenzen — <a href="https://www.volkshuisvestingnederland.nl/onderwerpen/huren-en-wonen/inkomensgrenzen-huurprijsgrenzen-en-huurtoeslagparameters/maximale-huurprijsgrenzen" className="underline hover:text-gray-700" target="_blank" rel="noopener">volkshuisvestingnederland.nl</a></li>
            <li>[S4] Huurcommissie — Wet betaalbare huur — <a href="https://www.huurcommissie.nl/onderwerpen/wet-betaalbare-huur" className="underline hover:text-gray-700" target="_blank" rel="noopener">huurcommissie.nl</a></li>
            <li>[S5] Government.nl — minimum wage amounts — <a href="https://www.government.nl/topics/minimum-wage/minimum-wage-amounts" className="underline hover:text-gray-700" target="_blank" rel="noopener">government.nl</a></li>
            <li>[S6] Rijksoverheid — inhouding huisvesting WML — <a href="https://www.rijksoverheid.nl/actueel/nieuws/2025/02/06/afschaffen-van-inhoudingen-op-het-minimumloon-voor-huisvesting" className="underline hover:text-gray-700" target="_blank" rel="noopener">rijksoverheid.nl (Feb 2025)</a></li>
            <li>[S7] Rijksoverheid — zelfstandige woonruimte — <a href="https://www.rijksoverheid.nl/onderwerpen/huurwoning-zoeken/vraag-en-antwoord/wat-is-een-zelfstandige-woning-en-wat-is-een-onzelfstandige-woning" className="underline hover:text-gray-700" target="_blank" rel="noopener">rijksoverheid.nl</a></li>
          </ul>
        </div>

      </div>

      {/*
       * ══════════════════════════════════════════════════════════════════
       * ANNUAL REVIEW CHECKLIST — review every 1 January
       * ══════════════════════════════════════════════════════════════════
       *
       * ALL values in RULES_2026 must be verified against official sources:
       *
       * HUURTOESLAG (Dienst Toeslagen / Belastingdienst):
       * [ ] maxCalcRent21plus      — current: €932.93
       * [ ] minRentUnder21         — current: €498.20
       * [ ] basishuurSingle        — current: €202.52
       * [ ] basishuurMulti         — current: €200.71
       * [ ] assetLimitSingle       — current: €38,479
       * [ ] assetLimitWithPartner  — current: €76,958
       * [ ] incomeThresholdSingle  — current: ~€23,425 (⚠️ APPROXIMATE — verify)
       * [ ] incomeThresholdMulti   — current: ~€31,500 (⚠️ APPROXIMATE — verify)
       * [ ] phaseoutRateSingle     — current: 0.27
       * [ ] phaseoutRateMulti      — current: 0.22
       *
       * WWS / WET BETAALBARE HUUR (Volkshuisvesting NL / Huurcommissie):
       * [ ] socialSectorMaxRent    — current: €932.93
       * [ ] liberalisatiegrens     — current: €1,228.07
       * [ ] socialMaxPoints        — current: 143
       * [ ] middleMaxPoints        — current: 186
       *
       * MINIMUM WAGE (Government.nl / Business.gov.nl):
       * [ ] hourlyGross            — current: €14.71
       * [ ] monthlyGross36h        — current: €2,303.59
       * [ ] monthlyGross40h        — current: ~€2,559.07
       *
       * AGENCY HOUSING:
       * [ ] maxDeductionPct        — current: 20% (decreases 5% each year → 0% in 2030)
       * [ ] Check if abolition schedule changed
       *
       * ALSO CHECK:
       * [ ] Any new housing laws passed (e.g. further Wet betaalbare huur changes)
       * [ ] Whether the service cost exclusion rule from 2026 remains in effect
       * [ ] Whether any new huurtoeslag reform was enacted
       *
       * Source for annual updates:
       * - https://www.belastingdienst.nl/wps/wcm/connect/nl/huurtoeslag/
       * - https://www.volkshuisvestingnederland.nl/
       * - https://www.rijksoverheid.nl/
       *
       * ADMIN DASHBOARD IDEAS:
       * - Top 5 result_profile combinations by volume (reveals user segments)
       * - Avg affordability band per source country
       * - Lead conversion rate: calc_completed → lead_submitted
       * - Countries with highest "risky/very_risky" affordability rate
       * - Cities in NL most commonly entered (demand signal)
       * ══════════════════════════════════════════════════════════════════
       */}
    </div>
  );
}
