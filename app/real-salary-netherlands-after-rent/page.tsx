"use client";

import { useState } from "react";
import Link from "next/link";

// NOTE: This is a client component for the interactive salary calculator.
// Metadata is exported from the sibling layout.tsx file.

// ─── Salary calculation helpers ───────────────────────────────────────────────

function calcNetSalary(grossHourly: number, hoursPerWeek: number): {
  grossMonthly:  number;
  taxAmount:     number;
  netMonthly:    number;
  holidayPay:    number;
} {
  const hoursPerMonth = (hoursPerWeek * 52) / 12;
  const grossMonthly  = grossHourly * hoursPerMonth;
  // Simplified NL income tax 2026 for low-income workers
  // First €38,441/yr = 36.97% (incl. ZVW/AOW etc.)
  // We apply a flat ~30% for simplicity at this income level (after heffingskorting)
  const effectiveRate = grossMonthly < 2100 ? 0.215 : grossMonthly < 3000 ? 0.265 : 0.32;
  const taxAmount    = grossMonthly * effectiveRate;
  const netMonthly   = grossMonthly - taxAmount;
  const holidayPay   = grossMonthly * 0.08 / 12; // monthly accrual
  return { grossMonthly, taxAmount, netMonthly, holidayPay };
}

export default function RealSalaryPage() {
  const [hourlyRate,    setHourlyRate]    = useState(14.5);
  const [hoursPerWeek,  setHoursPerWeek]  = useState(40);
  const [weeklyRent,    setWeeklyRent]    = useState(100);
  const [transport,     setTransport]     = useState(0);

  const rentMonthly      = weeklyRent * 52 / 12;
  const transportMonthly = transport * 4.33;
  const { grossMonthly, taxAmount, netMonthly, holidayPay } = calcNetSalary(hourlyRate, hoursPerWeek);
  const takeHome = netMonthly - rentMonthly - transportMonthly;

  const WML = 14.71;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs-in-netherlands" className="hover:text-brand-600">Jobs</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Real Salary Calculator</span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-1 font-medium">
            💰 Updated for 2026
          </span>
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-1 font-medium">
            🇳🇱 Netherlands tax rates
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
          Real Salary in Netherlands After Rent — 2026 Calculator
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Many foreign workers are surprised by how much is deducted from their salary
          for housing and taxes. Use this calculator to see your actual take-home pay
          after all deductions.
        </p>
      </div>

      {/* ── Calculator ─────────────────────────────────────────────────────── */}
      <div className="card p-6 mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-5">💰 Salary calculator</h2>

        <div className="space-y-5">
          {/* Hourly rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Hourly wage (€/hr)
              <span className="ml-2 text-xs font-normal text-gray-400">Min. wage = €{WML}/hr</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={WML}
                max={25}
                step={0.1}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
                className="flex-1 accent-brand-600"
              />
              <span className="text-lg font-bold text-brand-700 w-20 text-right">
                €{hourlyRate.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Hours per week */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Hours per week
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={20}
                max={48}
                step={1}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                className="flex-1 accent-brand-600"
              />
              <span className="text-lg font-bold text-brand-700 w-20 text-right">
                {hoursPerWeek}h/wk
              </span>
            </div>
          </div>

          {/* Weekly rent */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Weekly rent deduction (€/wk)
              <span className="ml-2 text-xs font-normal text-gray-400">Typical: €80–€130/wk for agency housing</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={200}
                step={5}
                value={weeklyRent}
                onChange={(e) => setWeeklyRent(parseInt(e.target.value))}
                className="flex-1 accent-brand-600"
              />
              <span className="text-lg font-bold text-amber-700 w-20 text-right">
                €{weeklyRent}/wk
              </span>
            </div>
          </div>

          {/* Transport */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Transport cost (€/week, if not included)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={60}
                step={5}
                value={transport}
                onChange={(e) => setTransport(parseInt(e.target.value))}
                className="flex-1 accent-brand-600"
              />
              <span className="text-lg font-bold text-gray-700 w-20 text-right">
                €{transport}/wk
              </span>
            </div>
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────────────────────── */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Monthly breakdown</p>
          <div className="space-y-2 text-sm">
            {[
              { label: "Gross monthly salary",     value: `€${grossMonthly.toFixed(0)}`,    color: "text-gray-800" },
              { label: "Income tax (estimated)",    value: `− €${taxAmount.toFixed(0)}`,     color: "text-red-600"  },
              { label: "Net monthly salary",        value: `€${netMonthly.toFixed(0)}`,      color: "text-gray-800 font-semibold" },
              { label: "Holiday pay (8% accrued)", value: `+ €${holidayPay.toFixed(0)}`,    color: "text-green-600" },
              { label: "Housing deduction",         value: `− €${rentMonthly.toFixed(0)}`,   color: "text-amber-600" },
              { label: "Transport cost",            value: `− €${transportMonthly.toFixed(0)}`, color: "text-amber-600" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center">
                <span className="text-gray-600">{row.label}</span>
                <span className={`font-semibold ${row.color}`}>{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
              <span className="font-bold text-gray-900 text-base">💵 Monthly take-home</span>
              <span className={`font-extrabold text-xl ${takeHome >= 1200 ? "text-green-700" : takeHome >= 900 ? "text-amber-700" : "text-red-700"}`}>
                €{takeHome.toFixed(0)}
              </span>
            </div>
          </div>

          {takeHome < 900 && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              ⚠️ Your take-home pay is below €900/month. Consider negotiating a higher hourly rate or finding cheaper housing.
            </div>
          )}
          {takeHome >= 1200 && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
              ✅ Your take-home pay looks reasonable for the Netherlands. Make sure your contract confirms these numbers.
            </div>
          )}
        </div>
      </div>

      {/* ── Salary benchmarks ──────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">Real-world salary examples (after rent)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 font-semibold text-gray-700">Role</th>
                <th className="text-left p-2 border border-gray-200 font-semibold text-gray-700">Gross/hr</th>
                <th className="text-left p-2 border border-gray-200 font-semibold text-gray-700">Gross/mo</th>
                <th className="text-left p-2 border border-gray-200 font-semibold text-gray-700">After tax</th>
                <th className="text-left p-2 border border-gray-200 font-semibold text-gray-700">After rent (€100/wk)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { role: "Minimum wage job",    hourly: 14.71, gross: 2424, net: 1897, afterRent: 1464 },
                { role: "Warehouse worker",    hourly: 15.00, gross: 2600, net: 2028, afterRent: 1595 },
                { role: "Order picker",        hourly: 15.50, gross: 2686, net: 2092, afterRent: 1659 },
                { role: "Forklift driver",     hourly: 17.00, gross: 2946, net: 2241, afterRent: 1808 },
                { role: "Reach truck driver",  hourly: 19.00, gross: 3293, net: 2479, afterRent: 2046 },
              ].map((row) => (
                <tr key={row.role} className="border-b border-gray-100">
                  <td className="p-2 border border-gray-200 text-gray-700">{row.role}</td>
                  <td className="p-2 border border-gray-200 font-semibold text-gray-800">€{row.hourly.toFixed(2)}</td>
                  <td className="p-2 border border-gray-200 text-gray-600">€{row.gross.toLocaleString()}</td>
                  <td className="p-2 border border-gray-200 text-blue-700">€{row.net.toLocaleString()}</td>
                  <td className="p-2 border border-gray-200 font-bold text-green-700">€{row.afterRent.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Estimates assume 40h/week, 2026 NL tax rates (simplified). Holiday pay not included. Actual amounts vary.
        </p>
      </section>

      {/* ── Key facts ──────────────────────────────────────────────────────── */}
      <section className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-3">Key facts about Dutch worker finances</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600">
          {[
            { icon: "💶", fact: "Minimum wage 2026: €14.71/hr (€2,424/mo for 40h/wk)" },
            { icon: "🏠", fact: "Max agency housing deduction: 25% of gross (SNF)" },
            { icon: "🏥", fact: "Health insurance (zorgverzekering): ~€160/month (not included above)" },
            { icon: "🎄", fact: "Holiday pay (vakantiegeld): 8% of annual salary, paid in May or monthly" },
            { icon: "📋", fact: "Wage slips: You must receive a loonstrook every month" },
            { icon: "🏛️", fact: "Heffingskorting (tax credit): reduces your effective tax rate significantly" },
          ].map((item) => (
            <div key={item.fact} className="flex gap-2">
              <span className="shrink-0">{item.icon}</span>
              <span>{item.fact}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA links ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { href: "/jobs-in-netherlands",                   label: "💼 Browse jobs" },
          { href: "/agencies-with-housing",                 label: "🏠 Housing agencies" },
          { href: "/best-agencies-with-housing-netherlands", label: "🏆 Best housing agencies" },
          { href: "/work-in-netherlands-for-foreigners",    label: "🌍 Full working guide" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1.5 hover:bg-brand-100 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        This calculator provides estimates only. Actual salary depends on your contract, agency, CAO, and individual circumstances.
        Tax calculations are simplified — consult a belastingadviseur for official advice.
      </p>
    </div>
  );
}
