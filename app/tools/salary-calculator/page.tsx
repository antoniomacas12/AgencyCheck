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

// ─── Slider input row ─────────────────────────────────────────────────────────

function SliderInput({
  label, value, min, max, step, display, hint,
  onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; hint?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-gray-900 tabular-nums bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
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

// ─── Breakdown row ────────────────────────────────────────────────────────────

function Row({ label, value, sub, isDeduct = false, isTotal = false }: {
  label: string; value: string; sub?: string; isDeduct?: boolean; isTotal?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${isTotal ? "" : "border-b border-gray-50"}`}>
      <div>
        <p className={`text-sm ${isTotal ? "font-semibold text-gray-900" : isDeduct ? "text-gray-500" : "text-gray-600"}`}>
          {label}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <p className={`font-bold tabular-nums ${
        isTotal ? "text-brand-700 text-base" :
        isDeduct ? "text-red-500 text-sm" :
        "text-gray-700 text-sm"
      }`}>
        {isDeduct && value !== fmt(0) ? `−${value}` : value}
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SalaryCalculatorPage() {
  const [hourlyRate,    setHourlyRate]    = useState(13.50);
  const [hoursPerWeek,  setHoursPerWeek]  = useState(40);
  const [housingCost,   setHousingCost]   = useState(0);
  const [insuranceCost, setInsuranceCost] = useState(35);
  const [transportCost, setTransportCost] = useState(0);

  const weeklyGross  = hourlyRate * hoursPerWeek;
  const annualGross  = weeklyGross * 47 * 1.08;
  const weeklyTax    = dutchTaxAnnual(annualGross) / 47;
  const weeklyNet    = weeklyGross - weeklyTax;
  const totalDeductions = housingCost + insuranceCost + transportCost;
  const realWeeklyIncome = Math.max(weeklyNet - totalDeductions, 0);
  const effectiveHourly  = hoursPerWeek > 0 ? realWeeklyIncome / hoursPerWeek : 0;
  const pctKept          = weeklyGross > 0 ? (realWeeklyIncome / weeklyGross) * 100 : 0;
  const belowWML         = hourlyRate < 14.71;
  const highDeductions   = totalDeductions > weeklyNet * 0.5;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* ── Gradient hero ── */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white rounded-2xl p-6 mb-8">
        <nav className="flex items-center gap-1.5 text-xs text-brand-300 mb-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-white font-medium">Weekly Salary Calculator</span>
        </nav>
        <div className="flex items-start gap-4">
          <span className="text-4xl shrink-0">💶</span>
          <div>
            <h1 className="text-xl font-bold mb-1.5">Weekly Salary Calculator</h1>
            <p className="text-sm text-brand-200 leading-relaxed max-w-lg">
              Enter your hourly wage and weekly costs to see exactly what you take home
              after Dutch income tax, housing, insurance, and transport.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-white/15 rounded-full px-3 py-1">🔒 Data stays in browser</span>
              <span className="text-xs bg-white/15 rounded-full px-3 py-1">📅 2026 loonheffing</span>
              <span className="text-xs bg-white/15 rounded-full px-3 py-1">🆓 Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Warnings ── */}
      {belowWML && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-sm text-red-700 font-medium">
            Your hourly rate (€{hourlyRate.toFixed(2)}) is below the Dutch minimum wage (WML 2026: €14.71/hr).
            Every worker in the Netherlands is entitled to at least the minimum wage.
          </p>
        </div>
      )}
      {highDeductions && !belowWML && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-sm text-amber-700">
            Your deductions exceed 50% of your net pay. Double-check your housing and transport amounts.
          </p>
        </div>
      )}

      {/* ── Live result stat ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Your real weekly income</p>
        <div className="flex items-end gap-3 mb-3">
          <p className={`text-5xl font-black tabular-nums ${realWeeklyIncome < 100 ? "text-red-600" : "text-brand-700"}`}>
            {fmt(realWeeklyIncome, 0)}
          </p>
          <p className="text-gray-400 text-sm mb-2">per week</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-400" />
            {fmt(realWeeklyIncome * 4.33, 0)}/month
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            {fmt(effectiveHourly, 2)}/hr effective
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            {pctKept.toFixed(0)}% of gross
          </span>
        </div>
      </div>

      {/* ── Inputs ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="text-sm font-bold text-gray-800 mb-5">Your details</h2>
        <div className="space-y-6">

          <SliderInput
            label="Hourly wage (gross)"
            value={hourlyRate}
            min={10} max={35} step={0.25}
            display={`€${hourlyRate.toFixed(2)}/hr`}
            hint="WML 2026 minimum: €14.71/hr"
            onChange={setHourlyRate}
          />

          <SliderInput
            label="Hours per week"
            value={hoursPerWeek}
            min={8} max={60} step={1}
            display={`${hoursPerWeek} hrs/week`}
            onChange={setHoursPerWeek}
          />

          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Weekly deductions (€/week)</p>
            <div className="space-y-5">
              <SliderInput
                label="🏠 Housing / agency rent"
                value={housingCost}
                min={0} max={200} step={5}
                display={`${fmt(housingCost, 0)}/wk`}
                hint="Typical agency range: €80–115/week"
                onChange={setHousingCost}
              />
              <SliderInput
                label="🏥 Health insurance"
                value={insuranceCost}
                min={0} max={80} step={5}
                display={`${fmt(insuranceCost, 0)}/wk`}
                hint="Typical: €35/week (≈€150/month)"
                onChange={setInsuranceCost}
              />
              <SliderInput
                label="🚌 Transport"
                value={transportCost}
                min={0} max={80} step={5}
                display={`${fmt(transportCost, 0)}/wk`}
                hint="€0 if agency provides transport"
                onChange={setTransportCost}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Breakdown ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Weekly breakdown</p>
        </div>
        <div className="px-5 py-1 divide-y divide-gray-50">
          <Row label="Gross weekly pay" value={fmt(weeklyGross)}
            sub={`${hoursPerWeek} hrs × €${hourlyRate.toFixed(2)}/hr`} />
          <Row label="Income tax (loonheffing, est.)" value={fmt(weeklyTax)} isDeduct />
          <Row label="Net weekly pay after tax" value={fmt(weeklyNet)} />
          {housingCost > 0  && <Row label="🏠 Housing deduction"      value={fmt(housingCost)}   isDeduct />}
          {insuranceCost > 0 && <Row label="🏥 Health insurance"       value={fmt(insuranceCost)} isDeduct />}
          {transportCost > 0 && <Row label="🚌 Transport"              value={fmt(transportCost)} isDeduct />}
        </div>
        <div className="px-5 pb-4 pt-3 border-t border-gray-100 bg-brand-50">
          <Row label="💶 Real weekly income" value={fmt(realWeeklyIncome)}
            sub={`${pctKept.toFixed(0)}% of gross · ${fmt(effectiveHourly, 2)}/hr effective`}
            isTotal />
        </div>
      </div>

      {/* ── Monthly summary chips ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Gross/month",       value: fmt(weeklyGross * 4.33, 0),        color: "bg-gray-50" },
          { label: "Deductions/month",  value: `−${fmt((weeklyTax + totalDeductions) * 4.33, 0)}`, color: "bg-red-50" },
          { label: "Real/month",        value: fmt(realWeeklyIncome * 4.33, 0),   color: "bg-brand-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-3 text-center border border-gray-100`}>
            <p className="text-lg font-extrabold text-gray-800 tabular-nums">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Cross-links ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Link href="/tools/accommodation-costs"
          className="flex-1 text-center text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl transition-colors">
          Calculate accommodation costs →
        </Link>
        <Link href="/tools/real-income-calculator"
          className="flex-1 text-center text-sm font-semibold border border-brand-200 text-brand-700 hover:bg-brand-50 py-3 rounded-xl transition-colors">
          Compare two offers →
        </Link>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Tax uses 2026 loonheffing brackets. Heffingskorting not applied — actual take-home is higher.{" "}
        <a href="/methodology" className="underline hover:text-gray-600">Full methodology →</a>
      </p>
    </div>
  );
}
