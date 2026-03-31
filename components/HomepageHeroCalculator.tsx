"use client";

/**
 * HomepageHeroCalculator — compact live salary preview card embedded directly
 * inside the hero section. Minimal inputs, instant result. Feels like a SaaS
 * product feature, not a static info page.
 *
 * Uses calculateTakeHome() from dutchTax.ts for real 2026 Dutch tax + credits.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateTakeHome } from "@/lib/dutchTax";

type HousingOpt   = "agency" | "none";
type TransportOpt = "agency" | "none";

const HOUSING_MONTHLY: Record<HousingOpt, number> = {
  agency: 413,   // €95/wk × 52 / 12
  none:   0,
};

const TRANSPORT_MONTHLY: Record<TransportOpt, number> = {
  agency: 108,   // €25/wk × 52 / 12
  none:   0,
};

function toWeekly(monthly: number) { return Math.round(monthly * 12 / 52); }
function fmt(n: number) { return `€${Math.round(n).toLocaleString("nl-NL")}`; }

export default function HomepageHeroCalculator() {
  const [hourly,    setHourly]    = useState(14.71);
  const [hours,     setHours]     = useState(40);
  const [housing,   setHousing]   = useState<HousingOpt>("agency");
  const [transport, setTransport] = useState<TransportOpt>("agency");

  const result = useMemo(() => calculateTakeHome({
    hourlyRate:        hourly,
    hoursPerWeek:      hours,
    weeksPerYear:      48,
    includeVakantie:   true,
    housingCost:       HOUSING_MONTHLY[housing],
    transportCost:     TRANSPORT_MONTHLY[transport],
    healthcareOwnRisk: 33,
  }), [hourly, hours, housing, transport]);

  // Add basic health insurance deduction
  const insuranceMo   = 152;
  const spendableMo   = result.spendableMonthly - insuranceMo;
  const keepW         = Math.max(0, toWeekly(spendableMo));
  const grossW        = toWeekly(result.grossMonthly);
  const keepPct       = grossW > 0 ? Math.round((keepW / grossW) * 100) : 0;

  const keepColor     = keepPct < 35 ? "text-red-400" : keepPct < 50 ? "text-amber-400" : "text-emerald-400";

  return (
    <div className="rounded-2xl bg-gray-900 border border-white/10 overflow-hidden w-full max-w-sm mx-auto lg:mx-0">

      {/* Card header */}
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
            Live calculator
          </span>
        </div>
        <span className="text-[10px] font-semibold text-gray-500">2026 Dutch tax</span>
      </div>

      <div className="px-5 pt-4 pb-3 space-y-4">

        {/* Hourly rate slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              Gross hourly rate
            </label>
            <span className="text-sm font-black text-white">{fmt(hourly)}/hr</span>
          </div>
          <input
            type="range"
            min={12} max={25} step={0.25}
            value={hourly}
            onChange={(e) => setHourly(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[9px] text-gray-600 mt-1">
            <span>€12 (WML)</span>
            <span className="text-amber-500 font-bold">WML = €14.71</span>
            <span>€25</span>
          </div>
        </div>

        {/* Hours per week */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              Hours/week
            </label>
            <span className="text-sm font-black text-white">{hours}h</span>
          </div>
          <input
            type="range"
            min={20} max={48} step={4}
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Toggle row: housing + transport */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Housing</p>
            <div className="flex gap-1.5">
              {(["agency", "none"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setHousing(v)}
                  className={`flex-1 rounded-lg border text-[10px] font-bold py-1.5 transition-all ${
                    housing === v
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {v === "agency" ? "Agency" : "Own"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Transport</p>
            <div className="flex gap-1.5">
              {(["agency", "none"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setTransport(v)}
                  className={`flex-1 rounded-lg border text-[10px] font-bold py-1.5 transition-all ${
                    transport === v
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {v === "agency" ? "Agency" : "Own"}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Result panel */}
      <div className="mx-4 mb-4 rounded-xl bg-gray-950 border border-white/5 px-4 py-4 text-center">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">
          You actually keep per week
        </p>
        <div className={`text-4xl font-black leading-none mb-1 ${keepColor}`}>
          {fmt(keepW)}
        </div>
        <p className="text-[11px] text-gray-500">
          out of <span className="font-bold text-gray-300">{fmt(grossW)}</span> gross —{" "}
          <span className={`font-black ${keepColor}`}>{keepPct}%</span>
        </p>

        {keepPct < 50 && (
          <p className="mt-2 text-[11px] text-red-400 font-semibold">
            ⚠ Under half your gross disappears in deductions
          </p>
        )}
      </div>

      {/* CTA footer */}
      <div className="px-4 pb-4 space-y-2">
        <a
          href="#lead-form"
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors py-3 text-sm font-black text-white active:scale-[0.98]"
        >
          🛡 Find better offers
        </a>
        <Link
          href="/tools/real-income-calculator"
          className="flex items-center justify-center w-full rounded-xl border border-white/10 py-2 text-[11px] font-semibold text-gray-400 hover:text-gray-200 hover:border-white/20 transition-colors"
        >
          Full calculator with payslip export →
        </Link>
      </div>

    </div>
  );
}
