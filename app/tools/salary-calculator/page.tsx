"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Dutch income tax estimate (2026 loonheffing) ────────────────────────────

function dutchTaxAnnual(annual: number): number {
  const b1 = 38441;
  const b2 = 76817;
  if (annual <= b1)  return annual * 0.3697;
  if (annual <= b2)  return b1 * 0.3697 + (annual - b1) * 0.3797;
  return b1 * 0.3697 + (b2 - b1) * 0.3797 + (annual - b2) * 0.495;
}

function fmt(n: number, decimals = 2): string {
  return `€${n.toFixed(decimals)}`;
}

// ─── Row component ────────────────────────────────────────────────────────────

function Row({ label, value, sub, isDeduct = false, isTotal = false }: {
  label: string; value: string; sub?: string; isDeduct?: boolean; isTotal?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-2.5 px-4 ${isTotal ? "bg-brand-50 rounded-lg" : "border-b border-gray-50"}`}>
      <div>
        <p className={`text-sm ${isTotal ? "font-bold text-brand-700" : isDeduct ? "text-gray-500" : "text-gray-700"}`}>
          {label}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <p className={`font-bold tabular-nums ${isTotal ? "text-brand-700 text-lg" : isDeduct ? "text-red-500 text-sm" : "text-gray-800 text-sm"}`}>
        {isDeduct && value !== fmt(0) ? `−${value}` : value}
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SalaryCalculatorPage() {
  const [hourlyRate,    setHourlyRate]    = useState(13.50);
  const [hoursPerWeek,  setHoursPerWeek]  = useState(40);
  const [housingCost,   setHousingCost]   = useState(0);      // €/week
  const [insuranceCost, setInsuranceCost] = useState(35);     // €/week (zorgverzekering ~€150/mo)
  const [transportCost, setTransportCost] = useState(0);      // €/week

  // ── Gross weekly ──────────────────────────────────────────────────────────
  const weeklyGross  = hourlyRate * hoursPerWeek;
  const annualGross  = weeklyGross * 47 * (1 + 0.08); // ~47 weeks + 8% vakantiegeld
  const annualTax    = dutchTaxAnnual(annualGross);
  const weeklyTax    = (annualTax / 47);
  const weeklyNet    = weeklyGross - weeklyTax;

  // ── Deductions ───────────────────────────────────────────────────────────
  const totalDeductions = housingCost + insuranceCost + transportCost;
  const realWeeklyIncome = Math.max(weeklyNet - totalDeductions, 0);
  const effectiveHourly  = hoursPerWeek > 0 ? realWeeklyIncome / hoursPerWeek : 0;
  const pctKept          = weeklyGross > 0 ? (realWeeklyIncome / weeklyGross) * 100 : 0;

  // ── Warning flags ─────────────────────────────────────────────────────────
  const belowWML       = hourlyRate < 14.71; // WML 2026
  const highDeductions = totalDeductions > weeklyNet * 0.5;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <div className="mb-4">
        <Link href="/tools" className="text-xs text-gray-400 hover:text-brand-600">← Tools</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">💶 Weekly Salary Calculator</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-lg leading-relaxed">
        Enter your hourly wage and weekly costs to see your real weekly income after tax,
        housing, insurance, and transport.
      </p>

      {/* Warnings */}
      {belowWML && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-xs text-red-700 font-medium">
          ⚠️ Your hourly rate (€{hourlyRate.toFixed(2)}) is below the Dutch minimum wage (WML 2026: €14.71/hr).
          Every worker in the Netherlands is entitled to at least the minimum wage.
        </div>
      )}
      {highDeductions && !belowWML && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-xs text-amber-700">
          ⚠️ Your deductions exceed 50% of your net pay. Check that housing and transport amounts are correct.
        </div>
      )}

      {/* ── Inputs ── */}
      <div className="card p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Your details</h2>
        <div className="space-y-5">

          {/* Hourly rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs text-gray-500">Hourly wage (gross, €/hr)</label>
              <span className="text-base font-bold text-gray-900">{fmt(hourlyRate, 2)}/hr</span>
            </div>
            <input type="range" min="10" max="35" step="0.25" value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
              className="w-full accent-brand-600" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>€10/hr</span><span>€35/hr</span>
            </div>
          </div>

          {/* Hours per week */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs text-gray-500">Hours per week</label>
              <span className="text-base font-bold text-gray-900">{hoursPerWeek} hrs/week</span>
            </div>
            <input type="range" min="8" max="60" step="1" value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
              className="w-full accent-brand-600" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>8hrs (part-time)</span><span>40hrs (full-time)</span><span>60hrs</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 mb-3">Weekly deductions (€/week)</p>
            <div className="space-y-4">

              {/* Housing */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-gray-500">🏠 Housing / agency rent deduction</label>
                  <span className="text-sm font-bold text-gray-900">{fmt(housingCost, 0)}/week</span>
                </div>
                <input type="range" min="0" max="200" step="5" value={housingCost}
                  onChange={(e) => setHousingCost(parseInt(e.target.value))}
                  className="w-full accent-brand-600" />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>€0 (no housing)</span><span>€80–115 typical</span><span>€200</span>
                </div>
              </div>

              {/* Insurance */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-gray-500">🏥 Health insurance (zorgverzekering)</label>
                  <span className="text-sm font-bold text-gray-900">{fmt(insuranceCost, 0)}/week</span>
                </div>
                <input type="range" min="0" max="80" step="5" value={insuranceCost}
                  onChange={(e) => setInsuranceCost(parseInt(e.target.value))}
                  className="w-full accent-brand-600" />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>€0</span><span>€35/week (≈€150/mo typical)</span><span>€80</span>
                </div>
              </div>

              {/* Transport */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-gray-500">🚌 Transport cost</label>
                  <span className="text-sm font-bold text-gray-900">{fmt(transportCost, 0)}/week</span>
                </div>
                <input type="range" min="0" max="80" step="5" value={transportCost}
                  onChange={(e) => setTransportCost(parseInt(e.target.value))}
                  className="w-full accent-brand-600" />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>€0 (agency transport)</span><span>€80/week</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="card overflow-hidden mb-5">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Weekly breakdown</p>
        </div>
        <div className="divide-y divide-gray-50 py-1">
          <Row label="Gross weekly pay"
            value={fmt(weeklyGross)}
            sub={`${hoursPerWeek} hrs × €${hourlyRate.toFixed(2)}/hr`} />
          <Row label="Income tax (loonheffing, est.)"
            value={fmt(weeklyTax)}
            isDeduct />
          <Row label="Net weekly pay after tax"
            value={fmt(weeklyNet)} />
          {housingCost > 0 && (
            <Row label="Housing deduction"
              value={fmt(housingCost)}
              isDeduct />
          )}
          {insuranceCost > 0 && (
            <Row label="Health insurance"
              value={fmt(insuranceCost)}
              isDeduct />
          )}
          {transportCost > 0 && (
            <Row label="Transport cost"
              value={fmt(transportCost)}
              isDeduct />
          )}
        </div>
        <div className="px-4 py-3">
          <Row label="💶 Real weekly income"
            value={fmt(realWeeklyIncome)}
            sub={`${pctKept.toFixed(0)}% of gross · ${fmt(effectiveHourly, 2)}/hr effective`}
            isTotal />
        </div>
      </div>

      {/* ── Monthly summary ── */}
      <div className="card p-4 mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Monthly equivalent</p>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div>
            <p className="text-lg font-extrabold text-gray-800">{fmt(weeklyGross * 4.33, 0)}</p>
            <p className="text-gray-500">Gross / month</p>
          </div>
          <div className="border-x border-gray-100">
            <p className="text-lg font-extrabold text-red-500">−{fmt(totalDeductions * 4.33, 0)}</p>
            <p className="text-gray-500">Total deductions</p>
          </div>
          <div>
            <p className="text-lg font-extrabold text-brand-600">{fmt(realWeeklyIncome * 4.33, 0)}</p>
            <p className="text-gray-500">Real / month</p>
          </div>
        </div>
      </div>

      {/* ── Links ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/tools/accommodation-costs"
          className="flex-1 text-center text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl transition-colors">
          Calculate accommodation costs →
        </Link>
        <Link href="/tools/real-income-calculator"
          className="flex-1 text-center text-sm font-semibold border border-brand-200 text-brand-700 hover:bg-brand-50 py-2.5 rounded-xl transition-colors">
          Compare two offers →
        </Link>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        Tax uses 2026 loonheffing brackets. Heffingskorting (tax credits) not applied here — actual take-home is higher.{" "}
        <a href="/methodology" className="underline hover:text-gray-600">Full methodology →</a>
      </p>
    </div>
  );
}
