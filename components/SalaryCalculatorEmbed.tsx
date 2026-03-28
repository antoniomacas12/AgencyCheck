"use client";

/**
 * SalaryCalculatorEmbed — embeddable mini salary calculator widget.
 *
 * Designed to be embedded inline on job type pages, city pages, and agency pages.
 * Shows weekly and monthly take-home based on hourly rate slider.
 */
import { useState } from "react";
import Link from "next/link";

interface SalaryCalculatorEmbedProps {
  defaultHourly?: number;
  defaultHours?:  number;
  jobLabel?:      string;
}

export default function SalaryCalculatorEmbed({
  defaultHourly = 14.5,
  defaultHours  = 40,
  jobLabel      = "this job",
}: SalaryCalculatorEmbedProps) {
  const [hourly, setHourly] = useState(defaultHourly);
  const [hours,  setHours]  = useState(defaultHours);
  const [rent,   setRent]   = useState(0);

  const WML = 14.06;
  const hoursPerMonth = (hours * 52) / 12;
  const gross = hourly * hoursPerMonth;

  // Dutch 2026 effective tax rates (loonheffing + ZVW, after arbeidskorting &
  // algemene heffingskorting). Based on tax brackets up to €38,441/yr (35.82%)
  // and ZVW bijdrage (5.64%). Credits reduce effective rate significantly at
  // lower incomes — typical for agency workers at min-to-above-average wages.
  const effectiveRate =
    gross < 1600 ? 0.12 : // ~WML full-time — credits nearly zero out tax
    gross < 2000 ? 0.18 :
    gross < 2600 ? 0.22 :
    gross < 3400 ? 0.27 : 0.32;

  const tax  = gross * effectiveRate;
  const net  = gross - tax;
  const rentMo   = rent * 52 / 12;
  const takeHome = net - rentMo;

  return (
    <div className="bg-brand-50 border border-brand-100 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🧮</span>
        <div>
          <p className="font-bold text-gray-900 text-sm">Salary calculator</p>
          <p className="text-xs text-gray-500">Estimate your take-home for {jobLabel}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {/* Hourly rate */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-700">Hourly rate</label>
            <span className="text-sm font-bold text-brand-700">€{hourly.toFixed(2)}/hr</span>
          </div>
          <input
            type="range"
            min={WML}
            max={25}
            step={0.25}
            value={hourly}
            onChange={(e) => setHourly(parseFloat(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>Min €{WML}/hr</span>
            <span>€25/hr</span>
          </div>
        </div>

        {/* Hours per week */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-700">Hours/week</label>
            <span className="text-sm font-bold text-gray-700">{hours}h</span>
          </div>
          <input
            type="range"
            min={20}
            max={48}
            step={4}
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value))}
            className="w-full accent-brand-600"
          />
        </div>

        {/* Rent deduction */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-700">Housing deduction (€/wk)</label>
            <span className="text-sm font-bold text-amber-600">
              {rent > 0 ? `€${rent}/wk` : "None"}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={150}
            step={10}
            value={rent}
            onChange={(e) => setRent(parseInt(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>No housing deduction</span>
            <span>€150/wk</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg p-3 border border-brand-100 space-y-1.5">
        {[
          { label: "Gross monthly",                                                  value: `€${Math.round(gross).toLocaleString()}`,     color: "text-gray-700" },
          { label: `Tax + ZVW (≈${Math.round(effectiveRate * 100)}% effective)`,    value: `− €${Math.round(tax).toLocaleString()}`,      color: "text-red-600"  },
          { label: "Net monthly",                                                    value: `€${Math.round(net).toLocaleString()}`,        color: "text-gray-800 font-semibold" },
          ...(rent > 0 ? [{ label: "Housing deduction", value: `− €${Math.round(rentMo).toLocaleString()}`, color: "text-amber-600" }] : []),
        ].map((row) => (
          <div key={row.label} className="flex justify-between items-center text-xs">
            <span className="text-gray-500">{row.label}</span>
            <span className={`font-medium ${row.color}`}>{row.value}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-900">💵 Take-home / month</span>
          <span className={`text-base font-extrabold ${
            takeHome >= 1200 ? "text-green-700" : takeHome >= 900 ? "text-amber-700" : "text-red-700"
          }`}>
            €{Math.round(takeHome).toLocaleString()}
          </span>
        </div>
      </div>

      <Link
        href="/real-salary-netherlands-after-rent"
        className="mt-3 block text-center text-xs text-brand-600 hover:underline font-medium"
      >
        Open full calculator with shift allowances →
      </Link>
    </div>
  );
}
