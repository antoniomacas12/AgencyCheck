"use client";

/**
 * HomepageCalculator — interactive live salary calculator embedded on the homepage.
 * Uses calculateTakeHome() from dutchTax.ts for accurate 2026 Dutch tax + credits.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateTakeHome } from "@/lib/dutchTax";

// ─── Types ────────────────────────────────────────────────────────────────────

type HousingOption  = "agency" | "own" | "none";
type TransportOpt   = "agency" | "own" | "none";
type InsuranceOpt   = "included" | "own";
type AdminFeeOpt    = "none" | "low" | "high";
type Country        = "NL" | "PL" | "RO" | "BG" | "UA" | "PT";

// ─── Constants ────────────────────────────────────────────────────────────────

const HOUSING_MONTHLY: Record<HousingOption, number> = {
  agency: 413,   // €95/wk × 52 / 12
  own:    650,   // €150/wk × 52 / 12
  none:   0,
};

const TRANSPORT_MONTHLY: Record<TransportOpt, number> = {
  agency: 108,   // €25/wk × 52 / 12
  own:    173,   // €40/wk × 52 / 12
  none:   0,
};

const INSURANCE_MONTHLY: Record<InsuranceOpt, number> = {
  included: 152,   // basic zorgverzekering via agency
  own:      180,   // own policy, slightly higher
};

const ADMIN_FEE_MONTHLY: Record<AdminFeeOpt, number> = {
  none: 0,
  low:  43,    // €10/wk
  high: 87,    // €20/wk
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function toWeekly(monthly: number) { return Math.round(monthly * 12 / 52); }
function fmt(n: number) { return `€${Math.round(n).toLocaleString("nl-NL")}`; }
function pct(n: number) { return `${Math.round(n * 100)}%`; }

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomepageCalculator() {
  const [hourly,    setHourly]    = useState(14.71);
  const [hours,     setHours]     = useState(40);
  const [housing,   setHousing]   = useState<HousingOption>("agency");
  const [transport, setTransport] = useState<TransportOpt>("agency");
  const [insurance, setInsurance] = useState<InsuranceOpt>("included");
  const [adminFee,  setAdminFee]  = useState<AdminFeeOpt>("none");
  // country shown in UI but NL tax always applies (they work in NL)
  const [country,   setCountry]   = useState<Country>("PL");

  const result = useMemo(() => {
    return calculateTakeHome({
      hourlyRate:         hourly,
      hoursPerWeek:       hours,
      weeksPerYear:       48,
      includeVakantie:    true,
      housingCost:        HOUSING_MONTHLY[housing],
      transportCost:      TRANSPORT_MONTHLY[transport] + ADMIN_FEE_MONTHLY[adminFee],
      healthcareOwnRisk:  33,
    });
  }, [hourly, hours, housing, transport, adminFee]);

  // Insurance is tracked separately (not in calculateTakeHome deductions)
  const insuranceMo = INSURANCE_MONTHLY[insurance];

  const totalDeductionsMo = result.housingMonthly + result.transportMonthly + insuranceMo;
  const realSpendableMo   = result.spendableMonthly - insuranceMo;

  const grossW   = toWeekly(result.grossMonthly);
  const taxW     = toWeekly(result.taxMonthly);
  const netW     = toWeekly(result.netMonthly);
  const dedW     = toWeekly(totalDeductionsMo);
  const keepW    = Math.max(0, toWeekly(realSpendableMo));
  const keepPct  = result.grossMonthly > 0 ? Math.round((realSpendableMo / result.grossMonthly) * 100) : 0;

  const riskColor = result.riskLevel === "high" ? "text-red-500" : result.riskLevel === "medium" ? "text-amber-500" : "text-emerald-500";
  const keepColor = keepPct < 35 ? "text-red-400" : keepPct < 50 ? "text-amber-400" : "text-emerald-400";

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/60 overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 sm:px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Live Calculator</p>
            <h3 className="text-lg font-black text-white">What will you actually keep?</h3>
          </div>
          <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-3 py-1">
            2026 tax rates
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

        {/* ── LEFT: Inputs ───────────────────────────────────────────── */}
        <div className="px-6 sm:px-8 py-6 space-y-5 bg-gray-50/50">

          {/* Hourly rate slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Gross hourly rate</label>
              <span className="text-lg font-black text-gray-900">{fmt(hourly)}/hr</span>
            </div>
            <input
              type="range"
              min={12} max={25} step={0.25}
              value={hourly}
              onChange={(e) => setHourly(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>€12/hr (WML)</span>
              <span className="text-amber-600 font-bold">WML = €14.71/hr</span>
              <span>€25/hr</span>
            </div>
          </div>

          {/* Hours slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Hours per week</label>
              <span className="text-sm font-black text-gray-900">{hours}h/week</span>
            </div>
            <input
              type="range"
              min={20} max={48} step={4}
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>20h</span>
              <span>40h (standard)</span>
              <span>48h</span>
            </div>
          </div>

          {/* Country (display only — tax always NL) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Your home country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as Country)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-blue-400"
            >
              <option value="PL">🇵🇱 Poland</option>
              <option value="RO">🇷🇴 Romania</option>
              <option value="BG">🇧🇬 Bulgaria</option>
              <option value="UA">🇺🇦 Ukraine</option>
              <option value="PT">🇵🇹 Portugal</option>
              <option value="NL">🇳🇱 Netherlands</option>
            </select>
            <p className="text-[10px] text-gray-400 mt-1">Dutch income tax applies regardless of origin country.</p>
          </div>

          {/* Housing */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Housing</label>
            <div className="grid grid-cols-3 gap-2">
              {([["agency","Agency housing\n€95/wk"],["own","Own housing\n€150/wk"],["none","No housing\n€0/wk"]] as const).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setHousing(v)}
                  className={`rounded-xl border text-[11px] font-semibold py-2.5 px-2 text-center transition-all whitespace-pre-line leading-tight ${
                    housing === v
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Transport</label>
            <div className="grid grid-cols-3 gap-2">
              {([["agency","Agency bus\n€25/wk"],["own","Own car\n€40/wk"],["none","No cost\n€0/wk"]] as const).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setTransport(v)}
                  className={`rounded-xl border text-[11px] font-semibold py-2.5 px-2 text-center transition-all whitespace-pre-line leading-tight ${
                    transport === v
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Insurance + admin fee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Health insurance</label>
              <select
                value={insurance}
                onChange={(e) => setInsurance(e.target.value as InsuranceOpt)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-blue-400"
              >
                <option value="included">Via agency — €152/mo</option>
                <option value="own">Own policy — €180/mo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Agency admin fee</label>
              <select
                value={adminFee}
                onChange={(e) => setAdminFee(e.target.value as AdminFeeOpt)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-blue-400"
              >
                <option value="none">None — €0/wk</option>
                <option value="low">Low — €10/wk</option>
                <option value="high">High — €20/wk</option>
              </select>
            </div>
          </div>

        </div>

        {/* ── RIGHT: Results ─────────────────────────────────────────── */}
        <div className="px-6 sm:px-8 py-6 flex flex-col gap-6">

          {/* Big number */}
          <div className="text-center bg-gray-950 rounded-2xl px-6 py-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">You keep per week</p>
            <div className={`text-5xl font-black leading-none mb-2 ${keepColor}`}>
              {fmt(keepW)}
            </div>
            <p className="text-xs text-gray-500">
              out of <span className="font-bold text-gray-300">{fmt(grossW)}</span> gross — only{" "}
              <span className={`font-black ${keepColor}`}>{keepPct}%</span>
            </p>
          </div>

          {/* Breakdown rows */}
          <div className="space-y-0 rounded-xl border border-gray-100 overflow-hidden">
            {[
              { label: "Gross weekly pay",         value: `+${fmt(grossW)}`,  color: "text-gray-900", bg: "bg-white",       bold: false },
              { label: `Tax (net after credits)`,  value: `−${fmt(taxW)}`,   color: "text-red-500",  bg: "bg-white",       bold: false },
              { label: "Housing deduction",         value: `−${fmt(toWeekly(result.housingMonthly))}`, color: "text-red-500", bg: "bg-white", bold: false },
              { label: "Transport",                value: `−${fmt(toWeekly(result.transportMonthly))}`, color: "text-red-500", bg: "bg-white", bold: false },
              { label: "Health insurance",         value: `−${fmt(toWeekly(insuranceMo))}`,  color: "text-red-500",  bg: "bg-white",       bold: false },
              { label: "💶 You actually keep",     value: fmt(keepW),         color: keepColor,       bg: "bg-gray-950",    bold: true  },
            ].map((row) => (
              <div key={row.label} className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 ${row.bg}`}>
                <span className={`text-sm ${row.bold ? "font-black text-white" : "text-gray-600"}`}>{row.label}</span>
                <span className={`text-sm font-bold ${row.bold ? `text-base font-black ${row.color}` : row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Risk level + effective rate */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Effective tax rate</p>
              <p className="text-xl font-black text-gray-900">{pct(result.effectiveTaxRate)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Risk level</p>
              <p className={`text-xl font-black capitalize ${riskColor}`}>{result.riskLevel}</p>
            </div>
          </div>

          {/* Risk reasons */}
          {result.riskReasons.length > 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-2">⚠ Watch out</p>
              <ul className="space-y-1">
                {result.riskReasons.map((r) => (
                  <li key={r} className="text-xs text-amber-800 flex items-start gap-1.5">
                    <span className="mt-0.5 shrink-0">•</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <Link
            href="#lead-form"
            className="w-full text-center rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-black py-3.5 text-sm shadow-sm shadow-blue-200"
          >
            Find better verified offers →
          </Link>
          <Link
            href="/tools/real-income-calculator"
            className="text-xs text-center text-gray-400 hover:text-blue-600 transition-colors underline underline-offset-2"
          >
            Open full calculator with payslip export
          </Link>

        </div>
      </div>
    </div>
  );
}
