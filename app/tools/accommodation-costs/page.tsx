"use client";

import { useState } from "react";
import Link from "next/link";

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

// ─── Housing presets ──────────────────────────────────────────────────────────

const PRESETS = [
  { label: "SNF shared room",    sublabel: "Standard certification", weeklyRent: 90  },
  { label: "SNF private room",   sublabel: "Higher SNF tier",        weeklyRent: 110 },
  { label: "Agency urban",       sublabel: "Amsterdam / Rotterdam",  weeklyRent: 130 },
  { label: "Own rent",           sublabel: "No agency housing",      weeklyRent: 200 },
];

// ─── Slider input ─────────────────────────────────────────────────────────────

function SliderInput({
  label, value, min, max, step, display, hint, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; hint?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 tabular-nums">
          {display}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-brand-600 h-1.5" />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AccommodationCostsPage() {
  const [hourlyRate,    setHourlyRate]    = useState(13.50);
  const [hoursPerWeek,  setHoursPerWeek]  = useState(40);
  const [weeklyRent,    setWeeklyRent]    = useState(90);
  const [insuranceCost, setInsuranceCost] = useState(35);
  const [transportCost, setTransportCost] = useState(0);

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

  // Stacked bar percentages
  const taxBar   = weeklyGross > 0 ? (weeklyTax / weeklyGross) * 100 : 0;
  const rentBar  = weeklyGross > 0 ? (weeklyRent / weeklyGross) * 100 : 0;
  const insurBar = weeklyGross > 0 ? (insuranceCost / weeklyGross) * 100 : 0;
  const transBar = weeklyGross > 0 ? (transportCost / weeklyGross) * 100 : 0;
  const keepBar  = Math.max(100 - taxBar - rentBar - insurBar - transBar, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* ── Gradient hero ── */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white rounded-2xl p-6 mb-8">
        <nav className="flex items-center gap-1.5 text-xs text-brand-300 mb-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-white font-medium">Accommodation Cost Calculator</span>
        </nav>
        <div className="flex items-start gap-4">
          <span className="text-4xl shrink-0">🏠</span>
          <div>
            <h1 className="text-xl font-bold mb-1.5">Accommodation Cost Calculator</h1>
            <p className="text-sm text-brand-200 leading-relaxed max-w-lg">
              If your agency provides housing, rent is deducted directly from your salary.
              See exactly how much you take home after all living costs.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-white/15 rounded-full px-3 py-1">🔒 Data stays in browser</span>
              <span className="text-xs bg-white/15 rounded-full px-3 py-1">📅 2026 SNF limits</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Warnings ── */}
      {belowWML && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-sm text-red-700 font-medium">
            Hourly rate €{hourlyRate.toFixed(2)} is below WML minimum wage (€14.71/hr, 2026).
          </p>
        </div>
      )}
      {highDeduction && !belowWML && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-sm text-amber-700">
            Your total deductions are high — you&apos;re keeping only <strong>{pctRemaining.toFixed(0)}%</strong> of gross earnings.
          </p>
        </div>
      )}

      {/* ── Live result ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Remaining income after all costs</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-extrabold text-gray-500 tabular-nums">{fmt(weeklyGross, 0)}</p>
            <p className="text-xs text-gray-400 mt-0.5">Gross/week</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-red-500 tabular-nums">−{fmt(weeklyTax + totalDeductions, 0)}</p>
            <p className="text-xs text-gray-400 mt-0.5">All deductions</p>
          </div>
          <div>
            <p className={`text-2xl font-extrabold tabular-nums ${remainingIncome < 150 ? "text-red-600" : "text-brand-700"}`}>
              {fmt(remainingIncome, 0)}
            </p>
            <p className="text-xs text-brand-600 font-semibold mt-0.5">Remaining/week</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
          <span>📅 {fmt(monthlyRemaining, 0)}/month</span>
          <span>⏱ {fmt(effectiveHourly, 2)}/hr effective</span>
          <span>📊 {pctRemaining.toFixed(0)}% of gross</span>
        </div>
      </div>

      {/* ── Visual bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Where your gross pay goes</p>
        <div className="h-7 rounded-full overflow-hidden flex mb-4 bg-gray-100">
          <div style={{ width: `${taxBar}%` }}   className="bg-red-400   transition-all duration-300" title={`Tax ${taxBar.toFixed(0)}%`} />
          <div style={{ width: `${rentBar}%` }}   className="bg-orange-400 transition-all duration-300" title={`Rent ${rentBar.toFixed(0)}%`} />
          <div style={{ width: `${insurBar}%` }}  className="bg-amber-400  transition-all duration-300" title={`Insurance ${insurBar.toFixed(0)}%`} />
          <div style={{ width: `${transBar}%` }}  className="bg-yellow-400 transition-all duration-300" title={`Transport ${transBar.toFixed(0)}%`} />
          <div style={{ width: `${keepBar}%` }}   className="bg-green-400  transition-all duration-300" title={`Keep ${keepBar.toFixed(0)}%`} />
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block" /> Tax ({taxBar.toFixed(0)}%)</span>
          {weeklyRent > 0    && <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-400 inline-block" /> Rent ({rentBar.toFixed(0)}%)</span>}
          {insuranceCost > 0 && <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400  inline-block" /> Insurance ({insurBar.toFixed(0)}%)</span>}
          {transportCost > 0 && <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" /> Transport ({transBar.toFixed(0)}%)</span>}
          <span className="flex items-center gap-1.5 font-semibold text-green-700"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block" /> You keep ({keepBar.toFixed(0)}%)</span>
        </div>
      </div>

      {/* ── Inputs ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="text-sm font-bold text-gray-800 mb-5">Your situation</h2>
        <div className="space-y-6">

          <SliderInput label="Hourly wage (gross)" value={hourlyRate}
            min={10} max={35} step={0.25}
            display={`€${hourlyRate.toFixed(2)}/hr`}
            onChange={setHourlyRate} />

          <SliderInput label="Hours per week" value={hoursPerWeek}
            min={16} max={60} step={1}
            display={`${hoursPerWeek} hrs/week`}
            onChange={setHoursPerWeek} />

          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Weekly costs</p>

            {/* Housing presets */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PRESETS.map((p) => (
                <button key={p.label} onClick={() => setWeeklyRent(p.weeklyRent)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    weeklyRent === p.weeklyRent
                      ? "border-brand-400 bg-brand-50 ring-2 ring-brand-200"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}>
                  <span className="block text-sm font-bold text-gray-900">{fmt(p.weeklyRent, 0)}/week</span>
                  <span className="block text-xs text-gray-500 mt-0.5">{p.label}</span>
                  <span className="block text-[10px] text-gray-400">{p.sublabel}</span>
                </button>
              ))}
            </div>

            <SliderInput label="🏠 Weekly rent / housing deduction" value={weeklyRent}
              min={0} max={250} step={5}
              display={`${fmt(weeklyRent, 0)}/wk`}
              hint="SNF-certified range: €80–130/week"
              onChange={setWeeklyRent} />

            <div className="mt-5">
              <SliderInput label="🏥 Insurance (zorgverzekering)" value={insuranceCost}
                min={0} max={80} step={5}
                display={`${fmt(insuranceCost, 0)}/wk`}
                hint="Typical: €30–40/week (€130–170/month)"
                onChange={setInsuranceCost} />
            </div>

            <div className="mt-5">
              <SliderInput label="🚌 Transport cost" value={transportCost}
                min={0} max={80} step={5}
                display={`${fmt(transportCost, 0)}/wk`}
                hint="€0 if agency provides transport"
                onChange={setTransportCost} />
            </div>
          </div>
        </div>
      </div>

      {/* ── SNF info ── */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
        <p className="text-sm font-semibold text-blue-800 mb-1.5">🏠 SNF housing deduction limits 2026</p>
        <p className="text-xs text-blue-700 leading-relaxed mb-2">
          SNF-certified agencies must follow maximum deduction rules. Typical range: <strong>€80–115/week</strong> for
          shared accommodation. Always ask for the exact weekly deduction in writing before signing.
          Deductions above SNF norms are a red flag.
        </p>
        <Link href="/agencies-with-housing" className="text-xs text-blue-700 font-semibold hover:underline">
          Find SNF-certified agencies with housing →
        </Link>
      </div>

      {/* ── CTAs ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Link href="/tools/salary-calculator"
          className="flex-1 text-center text-sm font-semibold border border-brand-200 text-brand-700 hover:bg-brand-50 py-3 rounded-xl transition-colors">
          Weekly salary calculator →
        </Link>
        <Link href="/tools/real-income-calculator"
          className="flex-1 text-center text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl transition-colors">
          Compare two agency offers →
        </Link>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Tax uses 2026 loonheffing brackets. Heffingskorting not applied — actual take-home is higher.{" "}
        <a href="/methodology" className="underline hover:text-gray-600">Full methodology →</a>
        {" "}All data stays in your browser only.
      </p>
    </div>
  );
}
