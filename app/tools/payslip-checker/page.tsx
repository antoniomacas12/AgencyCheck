"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Payslip Calculator ───────────────────────────────────────────────────────

function PayslipCalculator() {
  const [hoursWorked,   setHoursWorked]   = useState("");
  const [hourlyWage,    setHourlyWage]    = useState("");
  const [grossOnSlip,   setGrossOnSlip]   = useState("");
  const [deductions,    setDeductions]    = useState("");

  const hours   = parseFloat(hoursWorked)  || 0;
  const rate    = parseFloat(hourlyWage)   || 0;
  const gross   = parseFloat(grossOnSlip)  || 0;
  const deduct  = parseFloat(deductions)   || 0;

  const expectedGross   = hours * rate;
  const expectedNet     = expectedGross - deduct;
  const actualNet       = gross - deduct;
  const grossDiff       = gross - expectedGross;
  const absGrossDiff    = Math.abs(grossDiff);

  // Warning thresholds
  const hasGrossData    = hours > 0 && rate > 0 && gross > 0;
  const grossMismatch   = hasGrossData && absGrossDiff > 5;   // more than €5 difference
  const highDeductions  = gross > 0 && deduct > gross * 0.6;   // deductions > 60% of gross
  const belowWML        = rate > 0 && rate < 14.71;

  return (
    <div className="card p-5 mb-6 border-brand-100">
      <h2 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
        🧮 Payslip Calculator
      </h2>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        Enter your actual hours and the figures from your payslip.
        We&apos;ll check if the numbers add up.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Hours worked */}
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">Hours worked (this period)</label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder="e.g. 160"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>
        </div>

        {/* Hourly wage */}
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">Hourly wage (€/hr)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">€</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="e.g. 13.50"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>
          {belowWML && (
            <p className="text-[10px] text-red-600 mt-1 font-medium">
              Below WML minimum (€14.71/hr)
            </p>
          )}
        </div>

        {/* Gross salary on payslip */}
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">Gross salary on payslip (€)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">€</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="e.g. 2160"
              value={grossOnSlip}
              onChange={(e) => setGrossOnSlip(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>
        </div>

        {/* Total deductions */}
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">Total deductions on payslip (€)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">€</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="e.g. 850"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {(hours > 0 || rate > 0 || gross > 0) && (
        <div className="space-y-2 mb-4">

          {/* Expected gross */}
          {hours > 0 && rate > 0 && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 text-sm">
              <p className="text-gray-600">Expected gross ({hours} hrs × €{rate.toFixed(2)}/hr)</p>
              <p className="font-bold text-gray-900">€{expectedGross.toFixed(2)}</p>
            </div>
          )}

          {/* Gross mismatch warning */}
          {grossMismatch && (
            <div className={`rounded-lg px-3 py-2.5 text-xs font-medium ${grossDiff < 0 ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
              {grossDiff < 0
                ? `⚠️ Your payslip shows €${absGrossDiff.toFixed(2)} LESS than expected. This could mean missing hours or incorrect rate. Ask your agency to explain.`
                : `ℹ️ Your payslip shows €${absGrossDiff.toFixed(2)} MORE than expected. This may include overtime or allowances — verify each line.`
              }
            </div>
          )}

          {/* High deductions warning */}
          {highDeductions && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-xs text-red-700 font-medium">
              ⚠️ Deductions are {((deduct / gross) * 100).toFixed(0)}% of gross pay — unusually high.
              Check each deduction line: tax, housing, transport, and any other costs must be itemised and agreed in your contract.
            </div>
          )}

          {/* Net pay result */}
          {gross > 0 && deduct > 0 && (
            <div className="flex items-center justify-between bg-brand-50 border border-brand-100 rounded-lg px-3 py-2.5 text-sm">
              <p className="text-brand-700 font-semibold">Expected net pay (gross − deductions)</p>
              <p className="font-extrabold text-brand-700 text-base">€{actualNet.toFixed(2)}</p>
            </div>
          )}

          {/* All good */}
          {hasGrossData && !grossMismatch && !highDeductions && !belowWML && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 text-xs text-green-700 font-medium">
              ✅ Numbers look consistent. Cross-check the line items below and verify your bank deposit matches the net pay.
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-gray-400">
        Calculator uses your inputs only. No data is stored or sent anywhere. Tax is not calculated here — use the{" "}
        <Link href="/tools/salary-calculator" className="underline hover:text-brand-600">salary calculator</Link>{" "}
        for a full tax breakdown.
      </p>
    </div>
  );
}

// ─── Checklist ────────────────────────────────────────────────────────────────

const CHECKLIST = [
  {
    id:      "name",
    icon:    "👤",
    title:   "Your personal details are correct",
    detail:  "Name, BSN (burgerservicenummer), and address must match your ID. Errors here can cause tax problems.",
    status:  "verify",
  },
  {
    id:      "hours",
    icon:    "🕐",
    title:   "Hours worked match your records",
    detail:  "Compare the hours on your payslip to your own shift records. Even 15 minutes per day adds up to €1,000+ per year.",
    status:  "critical",
  },
  {
    id:      "rate",
    icon:    "💶",
    title:   "Hourly rate matches your contract",
    detail:  "The uurloon on your payslip must match your contract. Check for correct rates on evenings, weekends, and overtime.",
    status:  "critical",
  },
  {
    id:      "minimumloon",
    icon:    "⚖️",
    title:   "Pay is at or above minimum wage",
    detail:  "The Dutch statutory minimum wage (wettelijk minimumloon) applies to everyone regardless of nationality. The 2026 WML is €14.71/hr for workers aged 21+.",
    status:  "critical",
  },
  {
    id:      "vakantiegeld",
    icon:    "🏖️",
    title:   "Holiday allowance (vakantiegeld) is listed",
    detail:  "You are entitled to 8% vakantiegeld on top of your salary. It appears as a separate line on your payslip or is paid out separately in May/June.",
    status:  "important",
  },
  {
    id:      "vacation",
    icon:    "📅",
    title:   "Vacation days (verlofuren) are accruing",
    detail:  "You build up vacation days (usually 4× your weekly hours per year). Check the verlofuren or vakantiedagen column.",
    status:  "important",
  },
  {
    id:      "overtime",
    icon:    "⏰",
    title:   "Overtime is paid at the correct rate",
    detail:  "If you worked overtime, check your CAO for the multiplier (usually 125%–150%). Overtime should appear as a separate line: overuren toeslag.",
    status:  "important",
  },
  {
    id:      "sunday",
    icon:    "📆",
    title:   "Sunday/evening surcharges are included",
    detail:  "Many CAOs require 25–50% extra pay for Sundays and evening shifts. Look for a toeslag regel (surcharge line) matching your Sunday/evening hours.",
    status:  "important",
  },
  {
    id:      "tax",
    icon:    "🏛️",
    title:   "Loonheffing (tax) is being deducted",
    detail:  "Tax must be withheld by your employer. If no loonheffing appears, your employer may not be registered correctly — this affects your annual tax return.",
    status:  "verify",
  },
  {
    id:      "housing",
    icon:    "🏠",
    title:   "Housing deduction is clearly itemised",
    detail:  "If the agency deducts rent from your salary, it must appear as a separate line: huisvesting or huurkosten. The amount must match your housing agreement.",
    status:  "important",
  },
  {
    id:      "transport",
    icon:    "🚌",
    title:   "Transport deduction matches what was agreed",
    detail:  "If transport is provided and deducted, verify the amount against your contract. You should not be charged more than actual transport cost.",
    status:  "verify",
  },
  {
    id:      "net",
    icon:    "✅",
    title:   "Net pay received matches payslip",
    detail:  "The nettoloon on your payslip must match what arrived in your bank account on payment day. Any difference must be explained by your employer.",
    status:  "critical",
  },
];

const STATUS_CONFIG = {
  critical:  { label: "Critical",  bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-400"    },
  important: { label: "Important", bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-400"  },
  verify:    { label: "Verify",    bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-400"   },
};

function CheckGroup({ items, status }: { items: typeof CHECKLIST; status: keyof typeof STATUS_CONFIG }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className={`card p-4 border ${cfg.border} ${cfg.bg}`}>
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">{item.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-sm font-semibold ${cfg.text}`}>{item.title}</p>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.text} bg-white/60`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PayslipCheckerPage() {
  const critical  = CHECKLIST.filter((c) => c.status === "critical");
  const important = CHECKLIST.filter((c) => c.status === "important");
  const verify    = CHECKLIST.filter((c) => c.status === "verify");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      <div className="flex items-center gap-3 mb-2">
        <Link href="/tools" className="text-xs text-gray-400 hover:text-brand-600">← Tools</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">🧾 Payslip Checker</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-xl leading-relaxed">
        Enter your hours and payslip figures to check if the numbers are correct, then use the
        12-point checklist to verify every line of your loonstrook.
      </p>

      {/* ── Interactive Calculator ── */}
      <PayslipCalculator />

      {/* ── Legend ── */}
      <div className="flex gap-3 mb-7">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className="text-xs text-gray-500">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* ── Critical ── */}
      <section className="mb-7">
        <h2 className="text-base font-bold text-red-700 mb-3 flex items-center gap-2">
          🔴 Critical — check every payslip
        </h2>
        <CheckGroup items={critical} status="critical" />
      </section>

      {/* ── Important ── */}
      <section className="mb-7">
        <h2 className="text-base font-bold text-amber-700 mb-3 flex items-center gap-2">
          🟡 Important — review monthly
        </h2>
        <CheckGroup items={important} status="important" />
      </section>

      {/* ── Verify ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-blue-700 mb-3 flex items-center gap-2">
          🔵 Verify — check on your first payslip
        </h2>
        <CheckGroup items={verify} status="verify" />
      </section>

      {/* ── Found a problem? ── */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">
        <p className="font-semibold text-orange-800 mb-2">⚠️ Found something wrong?</p>
        <p className="text-sm text-orange-700 mb-4 leading-relaxed">
          First, speak to your agency directly and ask for a corrected payslip in writing.
          If they refuse or don&apos;t respond, you can:
        </p>
        <ul className="text-sm text-orange-700 space-y-1.5 mb-4">
          <li>• File an anonymous report with the Dutch <strong>Labor Inspectorate</strong> (Inspectie SZW)</li>
          <li>• Contact <strong>FNV</strong> (trade union) for free advice</li>
          <li>• Report the agency on AgencyCheck to warn other workers</li>
        </ul>
        <Link
          href="/agencies"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Report on an agency profile →
        </Link>
      </div>

      {/* ── Useful resources ── */}
      <div id="resources" className="card p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">📚 Useful resources</p>
        <div className="space-y-2">
          {[
            { label: "FNV — free advice for flex workers",        url: "https://www.fnv.nl" },
            { label: "Labor Inspectorate — file anonymous complaint", url: "https://www.nlarbeidsinspectie.nl" },
            { label: "SNF — check agency housing certification",  url: "https://www.normeringflexwonen.nl" },
            { label: "ABU CAO for flex workers",                  url: "https://www.abu.nl" },
          ].map((r) => (
            <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-brand-600 hover:text-brand-800 hover:underline">
              <span className="shrink-0">↗</span> {r.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Cross-tool links ── */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Link href="/tools/shift-tracker"     className="text-xs text-brand-600 font-medium hover:underline">→ Track your shifts</Link>
        <Link href="/tools/salary-calculator" className="text-xs text-brand-600 font-medium hover:underline">→ Weekly salary calculator</Link>
        <Link href="/tools"                   className="text-xs text-gray-400 font-medium hover:underline">→ All worker tools</Link>
      </div>

      <p className="mt-6 text-xs text-gray-400 text-center">
        This checker is informational only and does not constitute legal advice.
        Always consult a legal professional for employment disputes.
      </p>
    </div>
  );
}
