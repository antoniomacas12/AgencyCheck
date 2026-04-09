"use client";

/**
 * JobOfferComparisonClient — Compare Two Dutch Job Offers
 *
 * Calculates real take-home pay (spendable income) for two offers using:
 *   - Official 2026 loonheffing brackets + heffingskorting (lib/dutchTax.ts)
 *   - Actual vakantiegeld calculation (8% — BW art. 7:634)
 *   - SNF housing deduction ranges
 *   - Standard healthcare estimate
 *
 * LEGAL DISCLAIMER:
 *   All results are estimates. Actual net pay depends on individual
 *   loonheffingskorting status, CAO agreements, exact employment terms,
 *   and Belastingdienst assessment. Not financial or legal advice.
 *
 * ANALYTICS EVENTS (Vercel Analytics):
 *   comparison_viewed       — on mount
 *   comparison_started      — first field interaction
 *   comparison_calculated   — calculate button clicked with valid data
 *   comparison_result_shown — results rendered
 *   comparison_cta_clicked  — Apply button clicked
 *   comparison_lead_submitted — lead form submitted
 *
 * *** REVIEW ANNUALLY: update RULES_YEAR constant and re-verify all
 *     thresholds in lib/dutchTax.ts against official Belastingdienst tables ***
 */

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import {
  calculateTakeHome,
  WML_HOURLY_2026,
  HOUSING_DEDUCTION_RANGES,
  fmtEur,
  fmtPct,
  type TakeHomeResult,
} from "@/lib/dutchTax";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/** Update this every January — also update dutchTax.ts constants */
const RULES_YEAR = 2026;

/** Standard weeks used when no override provided.
 *  48 = 52 weeks minus ~4 weeks public holidays / sick leave allowance.
 *  NOTE: This is a conservative assumption. More weeks = higher gross. */
const DEFAULT_WEEKS = 48;

/** Healthcare cost constant — update annually.
 *  €140 base premium + €33/mo eigen risico provision = €173/mo.
 *  Source: NZa / Zorginstituut Nederland estimate, 2026. */
const HEALTHCARE_MONTHLY_ESTIMATE = 173;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type YesNo       = "yes" | "no" | "";
type ContractT   = "permanent" | "temporary" | "agency" | "";
type StartAvail  = "now" | "1_week" | "2_weeks" | "1_month" | "";
type WorkPermit  = "eu_passport" | "eu_residence" | "work_permit" | "none" | "";

interface OfferInput {
  name:               string;
  hourlyRate:         string;
  hoursPerWeek:       string;
  weeksPerYear:       string;
  contractType:       ContractT;
  // Housing
  housingIncluded:    YesNo;       // employer provides accommodation
  housingWeeklyCost:  string;      // deduction/week if included
  housingOwnCost:     string;      // €/month if NOT included (own rent)
  // Transport
  transportIncluded:  YesNo;       // employer covers transport
  transportMonthly:   string;      // own cost €/month if NOT included
  // Vakantiegeld
  vakantiegeldOnTop:  YesNo;       // "yes" = 8% added ON TOP of hourly rate
}

const BLANK_OFFER: OfferInput = {
  name:              "",
  hourlyRate:        "",
  hoursPerWeek:      "40",
  weeksPerYear:      String(DEFAULT_WEEKS),
  contractType:      "",
  housingIncluded:   "",
  housingWeeklyCost: "",
  housingOwnCost:    "",
  transportIncluded: "",
  transportMonthly:  "",
  vakantiegeldOnTop: "",
};

interface LeadFormState {
  firstName:  string;
  contact:    string;
  submitted:  boolean;
  submitting: boolean;
  error:      string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTM + ANALYTICS HELPERS
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

function fireEvent(name: string, props?: Record<string, string | number>) {
  try { track(name, props); } catch { /* non-critical */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// CALCULATION BRIDGE
// Maps OfferInput → calculateTakeHome() → TakeHomeResult | null
// ─────────────────────────────────────────────────────────────────────────────

function computeOffer(offer: OfferInput): TakeHomeResult | null {
  const hourlyRate   = parseFloat(offer.hourlyRate);
  const hoursPerWeek = parseFloat(offer.hoursPerWeek)  || 40;
  const weeksPerYear = parseFloat(offer.weeksPerYear)   || DEFAULT_WEEKS;

  if (!hourlyRate || hourlyRate <= 0) return null;

  // Housing: agency-provided deduction OR own rent
  let housingCost = 0;
  if (offer.housingIncluded === "yes") {
    const weekly = parseFloat(offer.housingWeeklyCost);
    // Convert weekly deduction to monthly (52 weeks / 12 months)
    housingCost = weekly > 0 ? weekly * 52 / 12 : HOUSING_DEDUCTION_RANGES.medium.monthlyEstimate;
  } else if (offer.housingIncluded === "no") {
    housingCost = parseFloat(offer.housingOwnCost) || 0;
  }
  // If not specified, assume no housing cost in this comparison (user decides)

  // Transport
  let transportCost = 0;
  if (offer.transportIncluded === "no" || offer.transportIncluded === "") {
    transportCost = parseFloat(offer.transportMonthly) || 0;
  }
  // If included, cost = 0

  return calculateTakeHome({
    hourlyRate,
    hoursPerWeek,
    weeksPerYear,
    // If vakantiegeld is paid ON TOP, include it in gross calculation
    // If it's already baked into the rate, don't double-count it
    includeVakantie: offer.vakantiegeldOnTop === "yes",
    housingCost,
    transportCost,
    healthcareOwnRisk: 33, // eigen risico spread monthly (~€33/mo)
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPARISON ENGINE
// Determines which offer is better and by how much
// ─────────────────────────────────────────────────────────────────────────────

type WinnerResult = {
  winner:     "a" | "b" | "tie";
  margin:     number;    // €/month difference in spendableMonthly
  pctDiff:    number;    // % difference
  message:    string;    // human-readable summary
  trapWarning: string | null;  // if high gross but lower spendable — warn user
};

function compareOffers(a: TakeHomeResult, b: TakeHomeResult, nameA: string, nameB: string): WinnerResult {
  const diff  = a.spendableMonthly - b.spendableMonthly;
  const base  = Math.max(a.spendableMonthly, b.spendableMonthly);
  const pct   = base > 0 ? Math.abs(diff) / base : 0;

  // Trap detection: higher gross but lower spendable means hidden costs
  let trapWarning: string | null = null;
  if (a.grossMonthly > b.grossMonthly && a.spendableMonthly < b.spendableMonthly) {
    trapWarning = `${nameA || "Offer A"} has a higher gross salary, but leaves you with LESS spendable income due to higher deductions. Check the cost breakdown carefully.`;
  } else if (b.grossMonthly > a.grossMonthly && b.spendableMonthly < a.spendableMonthly) {
    trapWarning = `${nameB || "Offer B"} has a higher gross salary, but leaves you with LESS spendable income due to higher deductions. Check the cost breakdown carefully.`;
  }

  if (Math.abs(diff) < 50) {
    return {
      winner: "tie",
      margin: Math.abs(diff),
      pctDiff: pct,
      message: "These offers are nearly equal in spendable income. Check risk factors and contract terms to decide.",
      trapWarning,
    };
  }

  const winner    = diff > 0 ? "a" : "b";
  const winName   = winner === "a" ? (nameA || "Offer A") : (nameB || "Offer B");
  const loseName  = winner === "a" ? (nameB || "Offer B") : (nameA || "Offer A");
  const winResult = winner === "a" ? a : b;

  return {
    winner,
    margin:  Math.abs(diff),
    pctDiff: pct,
    message: `${winName} leaves you with ${fmtEur(Math.abs(diff))} more per month — that's ${fmtEur(Math.abs(diff) * 12)} per year. Real effective rate: ${fmtEur(winResult.effectiveHourly, 2)}/hr vs ${fmtEur((winner === "a" ? b : a).effectiveHourly, 2)}/hr for ${loseName}.`,
    trapWarning,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function ToggleGroup({ value, onChange, options, small }: {
  value:   string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  small?:  boolean;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`${small ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-xs"} font-semibold rounded-lg border transition-all ${
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

function NumberInput({ value, onChange, placeholder, prefix }: {
  value:       string;
  onChange:    (v: string) => void;
  placeholder?: string;
  prefix?:     string;
}) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold pointer-events-none">{prefix}</span>
      )}
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full text-sm border border-gray-200 rounded-xl py-2.5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${prefix ? "pl-7 pr-3" : "px-3"}`}
      />
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: {
  value:       string;
  onChange:    (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
    />
  );
}

function SelectInput({ value, onChange, options }: {
  value:   string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
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

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <span className="block text-[10px] font-black text-gray-500 uppercase tracking-wider">{children}</span>
      {hint && <span className="block text-[10px] text-gray-400 mt-0.5">{hint}</span>}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      {children}
    </div>
  );
}

function InfoBox({ type, children }: { type: "info" | "warning" | "legal" | "success"; children: React.ReactNode }) {
  const styles = {
    info:    "bg-blue-50 border-blue-100 text-blue-800",
    warning: "bg-amber-50 border-amber-100 text-amber-800",
    legal:   "bg-gray-50 border-gray-200 text-gray-600",
    success: "bg-emerald-50 border-emerald-100 text-emerald-800",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-[11px] leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OFFER INPUT PANEL
// ─────────────────────────────────────────────────────────────────────────────

function OfferPanel({
  offer,
  color,
  onChange,
  onFirstChange,
}: {
  offer:         OfferInput;
  color:         "blue" | "violet";
  onChange:      (patch: Partial<OfferInput>) => void;
  onFirstChange: () => void;
}) {
  const firstRef = useRef(false);
  const changed  = (patch: Partial<OfferInput>) => {
    if (!firstRef.current) { firstRef.current = true; onFirstChange(); }
    onChange(patch);
  };

  const headerCls = color === "blue"
    ? "bg-blue-600 text-white"
    : "bg-violet-600 text-white";

  const borderCls = color === "blue"
    ? "border-blue-100"
    : "border-violet-100";

  const focusCls = color === "blue"
    ? "focus:border-blue-400 focus:ring-blue-400"
    : "focus:border-violet-400 focus:ring-violet-400";

  const label = color === "blue" ? "Offer A" : "Offer B";

  return (
    <div className={`bg-white rounded-2xl border ${borderCls} shadow-sm overflow-hidden`}>
      {/* Header */}
      <div className={`${headerCls} px-4 py-3 flex items-center gap-3`}>
        <span className="text-xs font-black uppercase tracking-wider opacity-80">{label}</span>
        <input
          type="text"
          value={offer.name}
          onChange={e => changed({ name: e.target.value })}
          placeholder={`e.g. ${label === "Offer A" ? "Company A" : "Agency B"}`}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white placeholder-white/50 focus:outline-none focus:bg-white/20 min-w-0"
        />
      </div>

      <div className="p-4">

        {/* Hourly rate — REQUIRED */}
        <Field label="Hourly rate *" hint="Gross €/hour">
          <NumberInput
            value={offer.hourlyRate}
            onChange={v => changed({ hourlyRate: v })}
            placeholder="e.g. 15.50"
            prefix="€"
          />
          {offer.hourlyRate && parseFloat(offer.hourlyRate) < WML_HOURLY_2026 && (
            <p className="text-[10px] text-red-600 mt-1 font-semibold">
              ⚠️ Below WML (€{WML_HOURLY_2026}/hr minimum 2026)
            </p>
          )}
        </Field>

        {/* Hours + weeks */}
        <div className="grid grid-cols-2 gap-2">
          <Field label="Hours/week">
            <SelectInput
              value={offer.hoursPerWeek}
              onChange={v => changed({ hoursPerWeek: v })}
              options={[
                { value: "32", label: "32h" },
                { value: "36", label: "36h" },
                { value: "38", label: "38h" },
                { value: "40", label: "40h" },
                { value: "48", label: "48h (incl. OT)" },
              ]}
            />
          </Field>
          <Field label="Weeks/year" hint="48 = standard">
            <SelectInput
              value={offer.weeksPerYear}
              onChange={v => changed({ weeksPerYear: v })}
              options={[
                { value: "44", label: "44 wks" },
                { value: "46", label: "46 wks" },
                { value: "48", label: "48 wks" },
                { value: "50", label: "50 wks" },
                { value: "52", label: "52 wks" },
              ]}
            />
          </Field>
        </div>

        {/* Vakantiegeld */}
        <Field label="Vakantiegeld (8%)" hint="Is the 8% holiday allowance paid on top of the rate?">
          <ToggleGroup
            value={offer.vakantiegeldOnTop}
            onChange={v => changed({ vakantiegeldOnTop: v as YesNo })}
            options={[
              { value: "yes",   label: "Paid on top" },
              { value: "no",    label: "Already included" },
              { value: "unsure", label: "Unsure" },
            ]}
            small
          />
        </Field>

        {/* Contract type */}
        <Field label="Contract type" hint="Optional">
          <ToggleGroup
            value={offer.contractType}
            onChange={v => changed({ contractType: v as ContractT })}
            options={[
              { value: "permanent",  label: "Permanent" },
              { value: "temporary",  label: "Temp" },
              { value: "agency",     label: "Agency" },
            ]}
            small
          />
        </Field>

        {/* Housing */}
        <Field label="Accommodation" hint="Does employer provide housing?">
          <ToggleGroup
            value={offer.housingIncluded}
            onChange={v => changed({ housingIncluded: v as YesNo, housingWeeklyCost: "", housingOwnCost: "" })}
            options={[
              { value: "yes", label: "Included" },
              { value: "no",  label: "Pay own rent" },
            ]}
            small
          />
        </Field>

        {offer.housingIncluded === "yes" && (
          <Field label="Housing deduction" hint={`Weekly cost deducted from wages (SNF avg: €80–€115/wk)`}>
            <NumberInput
              value={offer.housingWeeklyCost}
              onChange={v => changed({ housingWeeklyCost: v })}
              placeholder="e.g. 95"
              prefix="€"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Leave blank to use SNF average (€{HOUSING_DEDUCTION_RANGES.medium.monthlyEstimate}/mo)
            </p>
          </Field>
        )}

        {offer.housingIncluded === "no" && (
          <Field label="Monthly rent" hint="What you pay yourself (€/month)">
            <NumberInput
              value={offer.housingOwnCost}
              onChange={v => changed({ housingOwnCost: v })}
              placeholder="e.g. 750"
              prefix="€"
            />
          </Field>
        )}

        {/* Transport */}
        <Field label="Transport" hint="Is travel to work covered?">
          <ToggleGroup
            value={offer.transportIncluded}
            onChange={v => changed({ transportIncluded: v as YesNo, transportMonthly: "" })}
            options={[
              { value: "yes", label: "Covered" },
              { value: "no",  label: "Own cost" },
            ]}
            small
          />
        </Field>

        {offer.transportIncluded === "no" && (
          <Field label="Monthly transport cost" hint="Bus, train, car fuel etc.">
            <NumberInput
              value={offer.transportMonthly}
              onChange={v => changed({ transportMonthly: v })}
              placeholder="e.g. 120"
              prefix="€"
            />
          </Field>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPARISON RESULT ROW
// ─────────────────────────────────────────────────────────────────────────────

function CompRow({
  label,
  valueA,
  valueB,
  winnerA,
  winnerB,
  isKey,
  sub,
}: {
  label:   string;
  valueA:  string;
  valueB:  string;
  winnerA?: boolean;
  winnerB?: boolean;
  isKey?:  boolean;
  sub?:    string;
}) {
  const base = isKey
    ? "py-3 border-b border-gray-100"
    : "py-2.5 border-b border-gray-100 last:border-0";

  return (
    <div className={`grid grid-cols-3 ${base}`}>
      <div className="col-span-1 flex flex-col justify-center">
        <span className={`text-xs ${isKey ? "font-black text-gray-900" : "text-gray-600"}`}>{label}</span>
        {sub && <span className="text-[10px] text-gray-400">{sub}</span>}
      </div>
      <div className={`text-center flex flex-col items-center justify-center px-2 rounded-lg ${winnerA && isKey ? "bg-blue-50" : ""}`}>
        <span className={`text-sm ${isKey ? "font-black" : "font-semibold"} ${winnerA ? "text-blue-700" : "text-gray-800"}`}>
          {valueA}
        </span>
        {winnerA && isKey && <span className="text-[9px] font-black text-blue-600 uppercase tracking-wide mt-0.5">Better ✓</span>}
      </div>
      <div className={`text-center flex flex-col items-center justify-center px-2 rounded-lg ${winnerB && isKey ? "bg-violet-50" : ""}`}>
        <span className={`text-sm ${isKey ? "font-black" : "font-semibold"} ${winnerB ? "text-violet-700" : "text-gray-800"}`}>
          {valueB}
        </span>
        {winnerB && isKey && <span className="text-[9px] font-black text-violet-600 uppercase tracking-wide mt-0.5">Better ✓</span>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULT PANEL
// ─────────────────────────────────────────────────────────────────────────────

function ResultPanel({
  a,         b,
  resultA,   resultB,
  utmRef,
  onCtaClick,
  onLeadStarted,
  onLeadSubmitted,
  faqItems,
}: {
  a:               OfferInput;
  b:               OfferInput;
  resultA:         TakeHomeResult;
  resultB:         TakeHomeResult;
  utmRef:          React.MutableRefObject<Record<string, string>>;
  onCtaClick:      () => void;
  onLeadStarted:   () => void;
  onLeadSubmitted: () => void;
  faqItems:        { question: string; answer: string }[];
}) {
  const nameA = a.name || "Offer A";
  const nameB = b.name || "Offer B";
  const comp  = compareOffers(resultA, resultB, nameA, nameB);
  const winA  = comp.winner === "a";
  const winB  = comp.winner === "b";
  const tie   = comp.winner === "tie";

  return (
    <div id="comparison-results" className="mt-6 space-y-4">

      {/* ── Winner Banner ── */}
      {!tie && (
        <div className={`rounded-2xl border px-5 py-5 ${winA ? "bg-blue-50 border-blue-200" : "bg-violet-50 border-violet-200"}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{winA ? "🏆" : "🏆"}</span>
            <div>
              <p className={`text-sm font-black ${winA ? "text-blue-800" : "text-violet-800"}`}>
                {winA ? nameA : nameB} leaves you with more money
              </p>
              <p className={`text-[11px] ${winA ? "text-blue-600" : "text-violet-600"} font-semibold`}>
                +{fmtEur(comp.margin)}/month · +{fmtEur(comp.margin * 12)}/year
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-700">{comp.message}</p>
        </div>
      )}

      {tie && (
        <InfoBox type="info">
          <strong>Nearly identical offers.</strong> {comp.message} Margin: {fmtEur(comp.margin)}/month.
        </InfoBox>
      )}

      {/* ── Trap Warning ── */}
      {comp.trapWarning && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-4">
          <p className="text-xs font-black text-amber-800 mb-1">⚠️ Hidden cost trap detected</p>
          <p className="text-xs text-amber-700">{comp.trapWarning}</p>
        </div>
      )}

      {/* ── Side-by-side comparison ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">
          📊 Full comparison
        </h2>

        {/* Column headers */}
        <div className="grid grid-cols-3 pb-2 mb-1 border-b-2 border-gray-200">
          <div />
          <div className="text-center">
            <span className={`text-xs font-black ${winA ? "text-blue-700" : "text-gray-500"}`}>
              {nameA} {winA ? "🏆" : ""}
            </span>
          </div>
          <div className="text-center">
            <span className={`text-xs font-black ${winB ? "text-violet-700" : "text-gray-500"}`}>
              {nameB} {winB ? "🏆" : ""}
            </span>
          </div>
        </div>

        {/* Gross */}
        <CompRow
          label="Hourly rate (gross)"
          valueA={fmtEur(resultA.grossHourly, 2)}
          valueB={fmtEur(resultB.grossHourly, 2)}
        />
        <CompRow
          label="Hours / week"
          valueA={a.hoursPerWeek || "40"}
          valueB={b.hoursPerWeek || "40"}
        />
        <CompRow
          label="Gross / month"
          sub="Before tax, incl. vakantiegeld"
          valueA={fmtEur(resultA.grossMonthly)}
          valueB={fmtEur(resultB.grossMonthly)}
        />
        <CompRow
          label="Vakantiegeld"
          sub="Holiday allowance (8% of base)"
          valueA={fmtEur(resultA.vakantiegeldMonthly)}
          valueB={fmtEur(resultB.vakantiegeldMonthly)}
        />

        {/* Tax */}
        <CompRow
          label="Income tax / month"
          sub="Loonheffing – heffingskorting"
          valueA={`−${fmtEur(resultA.taxMonthly)}`}
          valueB={`−${fmtEur(resultB.taxMonthly)}`}
          winnerA={resultA.taxMonthly < resultB.taxMonthly}
          winnerB={resultB.taxMonthly < resultA.taxMonthly}
        />
        <CompRow
          label="Effective tax rate"
          valueA={fmtPct(resultA.effectiveTaxRate)}
          valueB={fmtPct(resultB.effectiveTaxRate)}
          winnerA={resultA.effectiveTaxRate < resultB.effectiveTaxRate}
          winnerB={resultB.effectiveTaxRate < resultA.effectiveTaxRate}
        />
        <CompRow
          label="Net after tax / month"
          valueA={fmtEur(resultA.netMonthly)}
          valueB={fmtEur(resultB.netMonthly)}
        />

        {/* Deductions */}
        <CompRow
          label="Housing cost / month"
          sub={`${a.housingIncluded === "yes" ? "Agency deduction" : "Own rent"}`}
          valueA={resultA.housingMonthly > 0 ? `−${fmtEur(resultA.housingMonthly)}` : "—"}
          valueB={resultB.housingMonthly > 0 ? `−${fmtEur(resultB.housingMonthly)}` : "—"}
          winnerA={resultA.housingMonthly < resultB.housingMonthly}
          winnerB={resultB.housingMonthly < resultA.housingMonthly}
        />
        <CompRow
          label="Transport / month"
          valueA={resultA.transportMonthly > 0 ? `−${fmtEur(resultA.transportMonthly)}` : "Included"}
          valueB={resultB.transportMonthly > 0 ? `−${fmtEur(resultB.transportMonthly)}` : "Included"}
          winnerA={resultA.transportMonthly < resultB.transportMonthly}
          winnerB={resultB.transportMonthly < resultA.transportMonthly}
        />
        <CompRow
          label="Healthcare est. / month"
          sub="~€140 premium + €33 eigen risico"
          valueA={`−${fmtEur(resultA.healthcareMonthly)}`}
          valueB={`−${fmtEur(resultB.healthcareMonthly)}`}
        />

        {/* KEY METRICS */}
        <div className="pt-2 mt-1">
          <CompRow
            label="Spendable / month"
            sub="After all costs — real comparison"
            valueA={fmtEur(resultA.spendableMonthly)}
            valueB={fmtEur(resultB.spendableMonthly)}
            winnerA={winA || (tie && resultA.spendableMonthly >= resultB.spendableMonthly)}
            winnerB={winB || (tie && resultB.spendableMonthly > resultA.spendableMonthly)}
            isKey
          />
          <CompRow
            label="Effective hourly rate"
            sub="Real €/hr after ALL costs"
            valueA={fmtEur(resultA.effectiveHourly, 2)}
            valueB={fmtEur(resultB.effectiveHourly, 2)}
            winnerA={resultA.effectiveHourly > resultB.effectiveHourly}
            winnerB={resultB.effectiveHourly > resultA.effectiveHourly}
            isKey
          />
          <CompRow
            label="Annual spendable"
            sub="×12 months"
            valueA={fmtEur(resultA.spendableMonthly * 12)}
            valueB={fmtEur(resultB.spendableMonthly * 12)}
            winnerA={winA}
            winnerB={winB}
            isKey
          />
        </div>
      </div>

      {/* ── Risk flags ── */}
      {(resultA.riskReasons.length > 0 || resultB.riskReasons.length > 0) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-3">⚠️ Risk flags</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: nameA, risks: resultA.riskReasons, level: resultA.riskLevel },
              { name: nameB, risks: resultB.riskReasons, level: resultB.riskLevel },
            ].map(({ name, risks, level }) => (
              <div key={name}>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">{name}</p>
                {risks.length === 0 ? (
                  <p className="text-xs text-emerald-600 font-semibold">✓ No risk flags</p>
                ) : (
                  <div className={`rounded-xl border px-3 py-2 space-y-1 ${level === "high" ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"}`}>
                    {risks.map((r, i) => (
                      <p key={i} className={`text-xs ${level === "high" ? "text-red-700" : "text-amber-700"}`}>
                        • {r}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Disclaimer ── */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
        <p className="text-[10px] text-gray-500 leading-relaxed">
          <strong className="text-gray-600">Estimates only — {RULES_YEAR} Dutch tax rules.</strong>{" "}
          Calculated using official {RULES_YEAR} loonheffing brackets and heffingskorting (algemene heffingskorting + arbeidskorting). Assumes loonheffingskorting is active (primary employer). Healthcare: estimated €{HEALTHCARE_MONTHLY_ESTIMATE}/month. Vakantiegeld: 8% (legally required minimum). Results are estimates — actual net pay depends on your personal tax situation, CAO agreements, municipality, and Belastingdienst assessment. Not financial or legal advice.
          Sources: <a href="https://www.belastingdienst.nl/wps/wcm/connect/nl/loonheffingen/" className="underline" target="_blank" rel="noopener noreferrer">belastingdienst.nl</a> ·{" "}
          <a href="https://www.government.nl/topics/minimum-wage" className="underline" target="_blank" rel="noopener noreferrer">rijksoverheid.nl/minimumloon</a>
        </p>
      </div>

      {/* ── Inline Lead Form ── */}
      <InlineLeadForm
        winnerName={tie ? null : (winA ? nameA : nameB)}
        utmRef={utmRef}
        comparison={comp}
        onLeadStarted={onLeadStarted}
        onLeadSubmitted={onLeadSubmitted}
      />

      {/* ── Conversion CTA ── */}
      <ConversionCTA onCtaClick={onCtaClick} winnerName={tie ? null : (winA ? nameA : nameB)} />

      {/* ── Internal links ── */}
      <InternalLinks />

      {/* ── FAQ ── */}
      <FaqSection items={faqItems} />

      {/* ── Source citations ── */}
      <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 px-4 py-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Sources used</p>
        <ul className="space-y-1 text-[10px] text-gray-500">
          <li>Loonheffing brackets {RULES_YEAR}: <a href="https://www.belastingdienst.nl/wps/wcm/connect/nl/loonheffingen/" className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">belastingdienst.nl/loonheffingen</a></li>
          <li>Heffingskorting {RULES_YEAR}: <a href="https://www.belastingdienst.nl" className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">belastingdienst.nl</a></li>
          <li>Minimum wage (WML) {RULES_YEAR}: <a href="https://www.government.nl/topics/minimum-wage/minimum-wage-amounts" className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">government.nl</a></li>
          <li>Vakantiegeld (8%): Burgerlijk Wetboek art. 7:634</li>
          <li>SNF housing standards: <a href="https://www.snf.nl" className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">snf.nl</a></li>
          <li>Healthcare premium 2026 est.: NZa / Zorginstituut Nederland</li>
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INLINE LEAD FORM
// ─────────────────────────────────────────────────────────────────────────────

function InlineLeadForm({
  winnerName,
  utmRef,
  comparison,
  onLeadStarted,
  onLeadSubmitted,
}: {
  winnerName:      string | null;
  utmRef:          React.MutableRefObject<Record<string, string>>;
  comparison:      WinnerResult;
  onLeadStarted:   () => void;
  onLeadSubmitted: () => void;
}) {
  const [lead, setLead] = useState<LeadFormState>({
    firstName: "", contact: "", submitted: false, submitting: false, error: null,
  });
  const [country,    setCountry]    = useState("");
  const [avail,      setAvail]      = useState<StartAvail>("");
  const [needsAccom, setNeedsAccom] = useState<YesNo>("");
  const [workPermit, setWorkPermit] = useState<WorkPermit>("");
  const startedRef = useRef(false);

  function touched() {
    if (!startedRef.current) { startedRef.current = true; onLeadStarted(); }
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
    const notes   = JSON.stringify({
      source:       "job_offer_comparison",
      winner:       comparison.winner,
      margin_month: Math.round(comparison.margin),
      pct_diff:     Math.round(comparison.pctDiff * 100),
      work_permit:  workPermit || null,
      ...utmRef.current,
    });

    const payload = {
      fullName:            name,
      ...(isEmail ? { email: contact } : { phone: contact }),
      currentCountry:      country   || undefined,
      availability:        avail     || undefined,
      accommodationNeeded: needsAccom === "yes" ? true : needsAccom === "no" ? false : undefined,
      sourceType:          "general_apply",
      sourcePage:          typeof window !== "undefined" ? window.location.pathname : "/tools/job-offer-comparison",
      sourceLabel:         "Job Offer Comparison Tool",
      notes,
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
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-5 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="text-sm font-black text-emerald-800 mb-1">Details received.</p>
        <p className="text-xs text-emerald-700">
          We&apos;ll match you with positions that fit your profile. Most people hear back within 48 hours. No commitment — you decide if any offer interests you.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 px-5 py-5">
      <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1">
        Find better offers — free
      </p>
      <p className="text-sm font-black text-gray-900 mb-1">
        {winnerName
          ? `Want to see if there's something better than ${winnerName}?`
          : "Want to see real offers from verified Dutch agencies?"}
      </p>
      <p className="text-xs text-gray-600 mb-4">
        Leave your details and we&apos;ll match you with agencies offering positions that suit your profile.
        Takes 30 seconds. Free for workers.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <FieldLabel>First name</FieldLabel>
            <TextInput
              value={lead.firstName}
              onChange={v => { touched(); setLead(s => ({ ...s, firstName: v })); }}
              placeholder="Your name"
            />
          </div>
          <div>
            <FieldLabel>Email or phone</FieldLabel>
            <TextInput
              value={lead.contact}
              onChange={v => { touched(); setLead(s => ({ ...s, contact: v })); }}
              placeholder="you@email.com or +48…"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <FieldLabel>Country</FieldLabel>
            <SelectInput
              value={country}
              onChange={v => { touched(); setCountry(v); }}
              options={[
                { value: "Netherlands",    label: "Netherlands" },
                { value: "Poland",         label: "Poland" },
                { value: "Romania",        label: "Romania" },
                { value: "Portugal",       label: "Portugal" },
                { value: "Bulgaria",       label: "Bulgaria" },
                { value: "Ukraine",        label: "Ukraine" },
                { value: "Other EU",       label: "Other EU" },
                { value: "Non-EU",         label: "Non-EU" },
              ]}
            />
          </div>
          <div>
            <FieldLabel>Available from</FieldLabel>
            <SelectInput
              value={avail}
              onChange={v => { touched(); setAvail(v as StartAvail); }}
              options={[
                { value: "now",     label: "Now" },
                { value: "1_week",  label: "1 week" },
                { value: "2_weeks", label: "2 weeks" },
                { value: "1_month", label: "1 month+" },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <FieldLabel hint="Most positions include accommodation">Need accommodation?</FieldLabel>
            <ToggleGroup
              value={needsAccom}
              onChange={v => { touched(); setNeedsAccom(v as YesNo); }}
              options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
              small
            />
          </div>
          <div>
            <FieldLabel>Work permit</FieldLabel>
            <ToggleGroup
              value={workPermit}
              onChange={v => { touched(); setWorkPermit(v as WorkPermit); }}
              options={[
                { value: "eu_passport",  label: "EU passport" },
                { value: "eu_residence", label: "EU permit" },
                { value: "work_permit",  label: "Other" },
              ]}
              small
            />
          </div>
        </div>

        {lead.error && <p className="text-xs text-red-600 mb-2">{lead.error}</p>}

        <button
          type="submit"
          disabled={lead.submitting || !lead.firstName || !lead.contact}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all px-6 py-3 text-sm font-black text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {lead.submitting ? "Sending…" : "Match me with better offers →"}
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-2">No costs for workers. No spam.</p>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSION CTA
// ─────────────────────────────────────────────────────────────────────────────

function ConversionCTA({ onCtaClick, winnerName }: { onCtaClick: () => void; winnerName: string | null }) {
  return (
    <div className="rounded-2xl bg-gray-950 border border-white/[0.08] px-5 py-6">
      <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        Verified positions now open
      </div>

      <h3 className="text-lg sm:text-xl font-black text-white leading-tight mb-2">
        {winnerName
          ? `Still not happy with ${winnerName}? Find something better.`
          : "Stop comparing. Start earning."}
      </h3>

      <p className="text-sm text-gray-400 leading-relaxed mb-5">
        We work with verified Dutch agencies offering transparent contracts, real pay, and accommodation.
        Match now — free for workers, no CV required.
      </p>

      <div className="flex flex-col gap-1.5 mb-5">
        {[
          "Transparent pay breakdown before you decide",
          "Accommodation included in most positions",
          "No placement fees — free for workers",
        ].map(p => (
          <div key={p} className="flex items-center gap-2 text-xs text-gray-400">
            <span className="text-blue-400 flex-shrink-0">✓</span> {p}
          </div>
        ))}
      </div>

      <Link
        href="/#lead-form"
        onClick={onCtaClick}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all text-white font-black text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/20"
      >
        Apply — find verified positions →
      </Link>
      <p className="text-[10px] text-gray-600 mt-3">
        Takes 2 minutes. No CV required. You decide if an offer interests you.
      </p>
    </div>
  );
}

/*
 * ── CTA COPY VARIANTS ────────────────────────────────────────────────────────
 *
 * DEFAULT (implemented above):
 *   Headline: "Stop comparing. Start earning."
 *   Button: "Apply — find verified positions →"
 *
 * SOFTER:
 *   Headline: "Ready to find a better offer for real?"
 *   Button: "See what's available →"
 *
 * STRONGER (high-risk offer detected):
 *   Headline: "That offer is risky. We have better ones."
 *   Body: "Positions with transparent pay, verified contracts, housing included."
 *   Button: "APPLY NOW — real offers in 48h →"
 *
 * A/B TEST RECOMMENDATION:
 *   Test on users where riskLevel = "high" on at least one offer.
 *   Compare DEFAULT vs STRONGER. Primary metric: comparison_cta_clicked rate.
 */

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL LINKS
// ─────────────────────────────────────────────────────────────────────────────

function InternalLinks() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-5">
      <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Related tools &amp; resources</p>
      <div className="grid grid-cols-1 gap-2">
        {[
          { href: "/tools/rent-calculator",        emoji: "🏡", label: "Netherlands Rent Calculator 2026 — check affordability" },
          { href: "/tools/salary-calculator",       emoji: "💶", label: "Weekly Salary Calculator — real income after deductions" },
          { href: "/tools/real-salary-calculator",  emoji: "📊", label: "Full Dutch salary calculator with loonheffing 2026" },
          { href: "/tools/payslip-checker",         emoji: "🧾", label: "Payslip checker — verify your deductions are correct" },
          { href: "/agencies-with-housing",         emoji: "🏠", label: "Browse agencies with accommodation included" },
          { href: "/agencies",                      emoji: "🔍", label: "Compare 150+ verified Dutch employment agencies" },
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
// FAQ
// ─────────────────────────────────────────────────────────────────────────────

function FaqSection({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <section className="mt-2 mb-2">
      <h2 className="text-base font-black text-gray-900 mb-4">
        Frequently Asked Questions — Dutch Job Offer Comparison
      </h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-100 rounded-xl overflow-hidden bg-white">
            <details className="group">
              <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors">
                <span>{item.question}</span>
                <span className="text-gray-400 ml-3 flex-shrink-0 group-open:rotate-180 transition-transform duration-200">▼</span>
              </summary>
              <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                {item.answer}
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

export default function JobOfferComparisonClient({
  faqItems,
}: {
  faqItems: { question: string; answer: string }[];
}) {
  const [offerA, setOfferA] = useState<OfferInput>({ ...BLANK_OFFER, name: "Offer A" });
  const [offerB, setOfferB] = useState<OfferInput>({ ...BLANK_OFFER, name: "Offer B" });
  const [calculated, setCalculated] = useState(false);

  const utmRef     = useUtm();
  const startedRef = useRef(false);

  // ── Analytics: viewed ──
  useEffect(() => { fireEvent("comparison_viewed"); }, []);

  const resultA = useMemo(() => calculated ? computeOffer(offerA) : null, [calculated, offerA]);
  const resultB = useMemo(() => calculated ? computeOffer(offerB) : null, [calculated, offerB]);

  // ── Analytics: result shown ──
  useEffect(() => {
    if (resultA && resultB) {
      fireEvent("comparison_result_shown", {
        winner:        resultA.spendableMonthly >= resultB.spendableMonthly ? "a" : "b",
        margin:        Math.round(Math.abs(resultA.spendableMonthly - resultB.spendableMonthly)),
        risk_a:        resultA.riskLevel,
        risk_b:        resultB.riskLevel,
        housing_a:     offerA.housingIncluded || "unknown",
        housing_b:     offerB.housingIncluded || "unknown",
      });
    }
  }, [resultA, resultB, offerA.housingIncluded, offerB.housingIncluded]);

  function onFirstChange() {
    if (!startedRef.current) {
      startedRef.current = true;
      fireEvent("comparison_started");
    }
  }

  const canCalculate = !!offerA.hourlyRate && !!offerB.hourlyRate;

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    fireEvent("comparison_calculated", {
      hours_a:   offerA.hoursPerWeek || "40",
      hours_b:   offerB.hoursPerWeek || "40",
      housing_a: offerA.housingIncluded || "unknown",
      housing_b: offerB.housingIncluded || "unknown",
    });
    setCalculated(true);
    setTimeout(() => document.getElementById("comparison-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }

  function handleReset() {
    setOfferA({ ...BLANK_OFFER, name: "Offer A" });
    setOfferB({ ...BLANK_OFFER, name: "Offer B" });
    setCalculated(false);
    startedRef.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">

        {/* ── Gradient hero ── */}
        <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white rounded-2xl p-6 mb-8">
          <nav className="flex items-center gap-1.5 text-xs text-brand-300 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-white font-medium">Job Offer Comparison</span>
          </nav>
          <div className="flex items-start gap-4">
            <span className="text-4xl shrink-0">⚖️</span>
            <div>
              <h1 className="text-xl font-bold mb-1.5">Job Offer Comparison Calculator</h1>
              <p className="text-sm text-brand-200 leading-relaxed max-w-lg">
                Compare two Dutch job offers side by side. See real spendable income after income tax,
                housing costs, transport, and healthcare — based on official {RULES_YEAR} Dutch tax rules.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs bg-white/15 rounded-full px-3 py-1">🔒 Data stays in browser</span>
                <span className="text-xs bg-white/15 rounded-full px-3 py-1">📅 {RULES_YEAR} loonheffing</span>
                <span className="text-xs bg-white/15 rounded-full px-3 py-1">🎯 Trap detector</span>
                <span className="text-xs bg-white/15 rounded-full px-3 py-1">✅ Heffingskorting</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4 mb-6">
          <p className="text-xs font-black text-blue-800 mb-2">How this works</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Enter two job offers below. We calculate real take-home (spendable) income for each using actual {RULES_YEAR} Dutch income tax brackets, heffingskorting, vakantiegeld (8%), housing deductions, transport, and healthcare costs. The winner is the offer that leaves you with the most money — not necessarily the one with the highest hourly rate.
          </p>
        </div>

        {/* ── Offer panels + calculate ── */}
        <form onSubmit={handleCalculate} noValidate>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <OfferPanel
              offer={offerA}
              color="blue"
              onChange={p => setOfferA(s => ({ ...s, ...p }))}
              onFirstChange={onFirstChange}
            />
            <OfferPanel
              offer={offerB}
              color="violet"
              onChange={p => setOfferB(s => ({ ...s, ...p }))}
              onFirstChange={onFirstChange}
            />
          </div>

          {/* WML warning if both are fine */}
          {offerA.hourlyRate && offerB.hourlyRate && (
            <InfoBox type="legal">
              <strong>Assumes:</strong> Loonheffingskorting is applied (primary employer). Vakantiegeld paid on top adds 8% to gross.
              Healthcare estimated at €{HEALTHCARE_MONTHLY_ESTIMATE}/month. Weeks/year affects gross — use 48 for a standard year, 52 for full year.
              Actual tax depends on personal circumstances.
            </InfoBox>
          )}

          <button
            type="submit"
            disabled={!canCalculate}
            className="w-full mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all px-8 py-4 text-base font-black text-white shadow-sm shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Compare offers →
          </button>
          {!canCalculate && (
            <p className="text-center text-xs text-gray-400 mt-2">Enter hourly rates for both offers to compare.</p>
          )}
        </form>

        {/* ── Results ── */}
        {calculated && resultA && resultB && (
          <ResultPanel
            a={offerA}
            b={offerB}
            resultA={resultA}
            resultB={resultB}
            utmRef={utmRef}
            onCtaClick={() => fireEvent("comparison_cta_clicked")}
            onLeadStarted={() => fireEvent("comparison_lead_started")}
            onLeadSubmitted={() => fireEvent("comparison_lead_submitted")}
            faqItems={faqItems}
          />
        )}

        {calculated && (!resultA || !resultB) && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 mt-4">
            <p className="text-sm text-red-700">
              Please enter a valid hourly rate for {!resultA ? (offerA.name || "Offer A") : (offerB.name || "Offer B")} to compare.
            </p>
          </div>
        )}

        {/* ── Reset ── */}
        {calculated && (
          <button
            type="button"
            onClick={handleReset}
            className="w-full mt-4 text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors"
          >
            ↺ Start over
          </button>
        )}

        {/* ── FAQ shown before calculation too (SEO) ── */}
        {!calculated && (
          <>
            <InternalLinks />
            <FaqSection items={faqItems} />
          </>
        )}

      </div>
    </div>
  );
}
