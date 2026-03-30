"use client";

import { useState } from "react";
import Link from "next/link";
import type { Metadata } from "next";

// ─── Dutch income tax estimate (2026) ────────────────────────────────────────

function dutchTaxAnnual(annual: number): number {
  const b1 = 38441;
  const b2 = 76817;
  if (annual <= b1)  return annual * 0.3697;
  if (annual <= b2)  return b1 * 0.3697 + (annual - b1) * 0.3797;
  return b1 * 0.3697 + (b2 - b1) * 0.3797 + (annual - b2) * 0.495;
}

function fmt(n: number, dec = 2): string {
  return `€${n.toFixed(dec)}`;
}

// ─── Preset accommodation types ───────────────────────────────────────────────

const PRESETS = [
  { label: "SNF standard (shared room)",  weeklyRent: 90  },
  { label: "SNF higher (private room)",   weeklyRent: 110 },
  { label: "Agency max (urban area)",     weeklyRent: 130 },
  { label: "Own rent (no agency housing)",weeklyRent: 200 },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AccommodationCostsPage() {
  const [hourlyRate,    setHourlyRate]    = useState(13.50);
  const [hoursPerWeek,  setHoursPerWeek]  = useState(40);
  const [weeklyRent,    setWeeklyRent]    = useState(90);
  const [insuranceCost, setInsuranceCost] = useState(35);
  const [transportCost, setTransportCost] = useState(0);

  // ── Calculations ─────────────────────────────────────────────────────────
  const weeklyGross    = hourlyRate * hoursPerWeek;
  const annualGross    = weeklyGross * 47 * 1.08;
  const weeklyTax      = dutchTaxAnnual(annualGross) / 47;
  const weeklyNetPay   = weeklyGross - weeklyTax;

  const totalDeductions  = weeklyRent + insuranceCost + transportCost;
  const remainingIncome  = Math.max(weeklyNetPay - totalDeductions, 0);
  const monthlyRemaining = remainingIncome * 4.33;
  const effectiveHourly  = hoursPerWeek > 0 ? remainingIncome / hoursPerWeek : 0;
  const pctRemaining     = weeklyGross > 0 ? (remainingIncome / weeklyGross) * 100 : 0;

  const highDeduction    = totalDeductions > weeklyNetPay * 0.6;
  const belowWML         = hourlyRate < 14.71;

  // ── Deduction share for bar chart ─────────────────────────────────────────
  const grossBar = 100;
  const taxBar   = weeklyGross > 0 ? (weeklyTax / weeklyGross) * 100 : 0;
  const rentBar  = weeklyGross > 0 ? (weeklyRent / weeklyGross) * 100 : 0;
  const insurBar = weeklyGross > 0 ? (insuranceCost / weeklyGross) * 100 : 0;
  const transBar = weeklyGross > 0 ? (transportCost / weeklyGross) * 100 : 0;
  const keepBar  = Math.max(grossBar - taxBar - rentBar - insurBar - transBar, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <div className="mb-4">
        <Link href="/tools" className="text-xs text-gray-400 hover:text-brand-600">← Tools</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">🏠 Accommodation Cost Calculator</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-lg leading-relaxed">
        If your agency provides housing, rent is deducted directly from your salary.
        Add insurance and transport to see your real remaining income after all living costs.
      </p>

      {/* Warnings */}
      {belowWML && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-xs text-red-700 font-medium">
          ⚠️ Hourly rate €{hourlyRate.toFixed(2)} is below WML minimum wage (€14.71/hr, 2026).
        </div>
      )}
      {highDeduction && !belowWML && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-xs text-amber-700">
          ⚠️ Your total deductions are high relative to your net pay. You are keeping only{" "}
          <strong>{pctRemaining.toFixed(0)}%</strong> of gross earnings.
        </div>
      )}

      {/* ── Inputs ── */}
      <div className="card p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Your situation</h2>
        <div className="space-y-5">

          {/* Hourly rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs text-gray-500">Hourly wage (gross)</label>
              <span className="text-base font-bold text-gray-900">{fmt(hourlyRate, 2)}/hr</span>
            </div>
            <input type="range" min="10" max="35" step="0.25" value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
              className="w-full accent-brand-600" />
          </div>

          {/* Hours per week */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs text-gray-500">Hours per week</label>
              <span className="text-base font-bold text-gray-900">{hoursPerWeek} hrs/week</span>
            </div>
            <input type="range" min="16" max="60" step="1" value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
              className="w-full accent-brand-600" />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 mb-3">Weekly costs (€/week)</p>

            {/* Quick presets */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setWeeklyRent(p.weeklyRent)}
                  className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                    weeklyRent === p.weeklyRent
                      ? "border-brand-400 bg-brand-50 text-brand-700 font-semibold"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="block font-semibold">{fmt(p.weeklyRent, 0)}/week</span>
                  <span className="text-[10px] text-gray-400">{p.label}</span>
                </button>
              ))}
            </div>

            {/* Weekly rent slider */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-gray-500">🏠 Weekly rent / housing deduction</label>
                <span className="text-sm font-bold text-gray-900">{fmt(weeklyRent, 0)}/week</span>
              </div>
              <input type="range" min="0" max="250" step="5" value={weeklyRent}
                onChange={(e) => setWeeklyRent(parseInt(e.target.value))}
                className="w-full accent-brand-600" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>€0 (no rent)</span><span>€250/week</span>
              </div>
            </div>

            {/* Insurance */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-gray-500">🏥 Insurance (zorgverzekering)</label>
                <span className="text-sm font-bold text-gray-900">{fmt(insuranceCost, 0)}/week</span>
              </div>
              <input type="range" min="0" max="80" step="5" value={insuranceCost}
                onChange={(e) => setInsuranceCost(parseInt(e.target.value))}
                className="w-full accent-brand-600" />
              <p className="text-[10px] text-gray-400 mt-1">Typical: €30–40/week (€130–170/month)</p>
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
              <p className="text-[10px] text-gray-400 mt-1">€0 if agency provides transport</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Visual breakdown bar ── */}
      <div className="card p-4 mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Where your gross pay goes
        </p>
        <div className="h-6 rounded-full overflow-hidden flex mb-3">
          <div style={{ width: `${taxBar}%` }}   className="bg-red-400   transition-all" title={`Tax ${taxBar.toFixed(0)}%`} />
          <div style={{ width: `${rentBar}%` }}   className="bg-orange-400 transition-all" title={`Rent ${rentBar.toFixed(0)}%`} />
          <div style={{ width: `${insurBar}%` }}  className="bg-amber-400  transition-all" title={`Insurance ${insurBar.toFixed(0)}%`} />
          <div style={{ width: `${transBar}%` }}  className="bg-yellow-400 transition-all" title={`Transport ${transBar.toFixed(0)}%`} />
          <div style={{ width: `${keepBar}%` }}   className="bg-green-400  transition-all" title={`Keep ${keepBar.toFixed(0)}%`} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" /> Tax ({taxBar.toFixed(0)}%)</span>
          {weeklyRent > 0   && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-400 inline-block" /> Rent ({rentBar.toFixed(0)}%)</span>}
          {insuranceCost > 0 && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400  inline-block" /> Insurance ({insurBar.toFixed(0)}%)</span>}
          {transportCost > 0 && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-yellow-400 inline-block" /> Transport ({transBar.toFixed(0)}%)</span>}
          <span className="flex items-center gap-1 font-semibold text-green-700"><span className="w-2.5 h-2.5 rounded-sm bg-green-400 inline-block" /> You keep ({keepBar.toFixed(0)}%)</span>
        </div>
      </div>

      {/* ── Result ── */}
      <div className="card p-5 mb-5 border-brand-100 bg-brand-50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-extrabold text-gray-700">{fmt(weeklyGross, 0)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Gross / week</p>
          </div>
          <div className="border-x border-brand-100">
            <p className="text-xl font-extrabold text-red-500">−{fmt(totalDeductions + weeklyTax, 0)}</p>
            <p className="text-xs text-gray-500 mt-0.5">All deductions</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-brand-700">{fmt(remainingIncome, 0)}</p>
            <p className="text-xs text-brand-600 font-semibold mt-0.5">Remaining / week</p>
          </div>
        </div>
        <div className="border-t border-brand-100 mt-4 pt-4 text-center text-xs text-gray-500">
          Monthly remaining income: <strong className="text-brand-700 text-sm">{fmt(monthlyRemaining, 0)}</strong>
          <span className="ml-3">Effective hourly rate: <strong className="text-brand-700">{fmt(effectiveHourly, 2)}/hr</strong></span>
        </div>
      </div>

      {/* ── SNF info ── */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-xs text-blue-800">
        <p className="font-semibold mb-1">🏠 SNF housing deduction limits 2026</p>
        <p className="leading-relaxed">
          SNF-certified agencies must follow maximum deduction rules. Typical range: <strong>€80–115/week</strong> for shared accommodation.
          Always ask for the exact weekly deduction in writing before signing. Deductions above SNF norms are a red flag.
        </p>
        <Link href="/agencies-with-housing" className="text-blue-700 font-semibold hover:underline mt-2 inline-block">
          Find SNF-certified agencies with housing →
        </Link>
      </div>

      {/* ── Links ── */}
      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <Link href="/tools/salary-calculator"
          className="flex-1 text-center text-sm font-semibold border border-brand-200 text-brand-700 hover:bg-brand-50 py-2.5 rounded-xl transition-colors">
          Weekly salary calculator →
        </Link>
        <Link href="/tools/real-income-calculator"
          className="flex-1 text-center text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl transition-colors">
          Compare two agency offers →
        </Link>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        Tax uses 2026 loonheffing brackets. Heffingskorting not applied here — actual take-home is higher.{" "}
        <a href="/methodology" className="underline hover:text-gray-600">Full methodology →</a>
        {" "}All data stays in your browser only.
      </p>
    </div>
  );
}
