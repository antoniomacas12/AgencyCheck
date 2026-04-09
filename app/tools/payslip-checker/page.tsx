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
  const actualNet       = gross - deduct;
  const grossDiff       = gross - expectedGross;
  const absGrossDiff    = Math.abs(grossDiff);

  const hasGrossData    = hours > 0 && rate > 0 && gross > 0;
  const grossMismatch   = hasGrossData && absGrossDiff > 5;
  const highDeductions  = gross > 0 && deduct > gross * 0.6;
  const belowWML        = rate > 0 && rate < 14.71;

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all";
  const prefixInputClass = "w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
      <h2 className="text-sm font-bold text-gray-800 mb-1">Quick payslip check</h2>
      <p className="text-xs text-gray-500 mb-5 leading-relaxed">
        Enter your actual hours and the figures from your payslip — we&apos;ll check if the numbers add up.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1.5">Hours worked</label>
          <input type="number" inputMode="decimal" placeholder="e.g. 160"
            value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)}
            className={inputClass} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1.5">Hourly wage (€/hr)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">€</span>
            <input type="number" inputMode="decimal" placeholder="e.g. 13.50"
              value={hourlyWage} onChange={(e) => setHourlyWage(e.target.value)}
              className={prefixInputClass} />
          </div>
          {belowWML && <p className="text-[10px] text-red-600 mt-1 font-medium">⚠️ Below WML (€14.71/hr)</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1.5">Gross on payslip (€)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">€</span>
            <input type="number" inputMode="decimal" placeholder="e.g. 2160"
              value={grossOnSlip} onChange={(e) => setGrossOnSlip(e.target.value)}
              className={prefixInputClass} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1.5">Total deductions (€)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">€</span>
            <input type="number" inputMode="decimal" placeholder="e.g. 850"
              value={deductions} onChange={(e) => setDeductions(e.target.value)}
              className={prefixInputClass} />
          </div>
        </div>
      </div>

      {/* Results */}
      {(hours > 0 || rate > 0 || gross > 0) && (
        <div className="space-y-2.5">
          {hours > 0 && rate > 0 && (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-sm text-gray-600">Expected gross ({hours} hrs × €{rate.toFixed(2)}/hr)</p>
              <p className="font-bold text-gray-900 tabular-nums">€{expectedGross.toFixed(2)}</p>
            </div>
          )}
          {grossMismatch && (
            <div className={`rounded-xl px-4 py-3 text-sm font-medium ${grossDiff < 0 ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
              {grossDiff < 0
                ? `⚠️ Your payslip shows €${absGrossDiff.toFixed(2)} LESS than expected. This could mean missing hours or wrong rate. Ask your agency to explain in writing.`
                : `ℹ️ Your payslip shows €${absGrossDiff.toFixed(2)} MORE than expected. This may include overtime — verify each line item.`}
            </div>
          )}
          {highDeductions && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">
              ⚠️ Deductions are {((deduct / gross) * 100).toFixed(0)}% of gross pay — unusually high.
              Check each deduction line: tax, housing, transport must all be itemised in your contract.
            </div>
          )}
          {gross > 0 && deduct > 0 && (
            <div className="flex items-center justify-between bg-brand-50 border border-brand-100 rounded-xl px-4 py-3">
              <p className="text-sm text-brand-700 font-semibold">Expected net pay (gross − deductions)</p>
              <p className="font-extrabold text-brand-700 text-lg tabular-nums">€{actualNet.toFixed(2)}</p>
            </div>
          )}
          {hasGrossData && !grossMismatch && !highDeductions && !belowWML && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
              ✅ Numbers look consistent. Cross-check the line items below and verify your bank deposit matches.
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">
        No data is stored or sent anywhere. For full tax breakdown use the{" "}
        <Link href="/tools/salary-calculator" className="underline hover:text-brand-600">salary calculator</Link>.
      </p>
    </div>
  );
}

// ─── Checklist data ───────────────────────────────────────────────────────────

const CHECKLIST = [
  { id: "name",       icon: "👤", title: "Your personal details are correct",           status: "verify",   detail: "Name, BSN (burgerservicenummer), and address must match your ID. Errors here can cause tax problems." },
  { id: "hours",      icon: "🕐", title: "Hours worked match your records",              status: "critical", detail: "Compare the hours on your payslip to your own shift records. Even 15 minutes per day adds up to €1,000+ per year." },
  { id: "rate",       icon: "💶", title: "Hourly rate matches your contract",            status: "critical", detail: "The uurloon on your payslip must match your contract. Check for correct rates on evenings, weekends, and overtime." },
  { id: "wml",        icon: "⚖️", title: "Pay is at or above minimum wage",              status: "critical", detail: "Dutch WML applies to everyone. The 2026 WML is €14.71/hr for workers aged 21+, regardless of nationality." },
  { id: "vakantie",   icon: "🏖️", title: "Holiday allowance (vakantiegeld) is listed",  status: "important", detail: "You are entitled to 8% vakantiegeld on top of your salary. It appears as a separate line on your payslip." },
  { id: "vacation",   icon: "📅", title: "Vacation days (verlofuren) are accruing",     status: "important", detail: "You build up vacation days (usually 4× your weekly hours per year). Check the verlofuren or vakantiedagen column." },
  { id: "overtime",   icon: "⏰", title: "Overtime is paid at the correct rate",         status: "important", detail: "If you worked overtime, check your CAO for the multiplier (usually 125%–150%). It should appear as overuren toeslag." },
  { id: "sunday",     icon: "📆", title: "Sunday/evening surcharges are included",       status: "important", detail: "Many CAOs require 25–50% extra pay for Sundays and evening shifts. Look for toeslag regel matching your hours." },
  { id: "tax",        icon: "🏛️", title: "Loonheffing (tax) is being deducted",         status: "verify",   detail: "Tax must be withheld by your employer. If no loonheffing appears, your employer may not be registered correctly." },
  { id: "housing",    icon: "🏠", title: "Housing deduction is clearly itemised",        status: "important", detail: "If the agency deducts rent, it must appear as a separate line: huisvesting or huurkosten. Must match your housing agreement." },
  { id: "transport",  icon: "🚌", title: "Transport deduction matches what was agreed",  status: "verify",   detail: "If transport is provided and deducted, verify the amount against your contract. You should not be charged more than actual cost." },
  { id: "net",        icon: "✅", title: "Net pay received matches payslip",             status: "critical", detail: "The nettoloon on your payslip must match what arrived in your bank account. Any difference must be explained." },
];

const STATUS_CONFIG = {
  critical:  { label: "Critical",  bg: "bg-red-50",    text: "text-red-700",    border: "border-red-100",    dot: "bg-red-500",    badge: "bg-red-100 text-red-700"    },
  important: { label: "Important", bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-100",  dot: "bg-amber-500",  badge: "bg-amber-100 text-amber-700"  },
  verify:    { label: "Verify",    bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-100",   dot: "bg-blue-500",   badge: "bg-blue-100 text-blue-700"    },
};

function CheckGroup({ items, status }: { items: typeof CHECKLIST; status: keyof typeof STATUS_CONFIG }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.id} className={`rounded-2xl p-4 border ${cfg.border} ${cfg.bg}`}>
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className={`text-sm font-semibold ${cfg.text}`}>{item.title}</p>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.badge}`}>
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

      {/* ── Gradient hero ── */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white rounded-2xl p-6 mb-8">
        <nav className="flex items-center gap-1.5 text-xs text-brand-300 mb-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-white font-medium">Payslip Checker</span>
        </nav>
        <div className="flex items-start gap-4">
          <span className="text-4xl shrink-0">🧾</span>
          <div>
            <h1 className="text-xl font-bold mb-1.5">Payslip Checker</h1>
            <p className="text-sm text-brand-200 leading-relaxed max-w-lg">
              Enter your hours and payslip figures to verify the numbers, then use the 12-point
              checklist to check every line of your loonstrook.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-white/15 rounded-full px-3 py-1">🔒 Data stays in browser</span>
              <span className="text-xs bg-white/15 rounded-full px-3 py-1">📋 12-point checklist</span>
              <span className="text-xs bg-white/15 rounded-full px-3 py-1">📅 2026 WML rules</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Calculator ── */}
      <PayslipCalculator />

      {/* ── Legend ── */}
      <div className="flex gap-4 mb-6">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            <span className="text-xs text-gray-500 font-medium">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* ── Critical ── */}
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
          <h2 className="text-sm font-bold text-red-700">Critical — check every payslip</h2>
        </div>
        <CheckGroup items={critical} status="critical" />
      </section>

      {/* ── Important ── */}
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
          <h2 className="text-sm font-bold text-amber-700">Important — review monthly</h2>
        </div>
        <CheckGroup items={important} status="important" />
      </section>

      {/* ── Verify ── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
          <h2 className="text-sm font-bold text-blue-700">Verify — check on your first payslip</h2>
        </div>
        <CheckGroup items={verify} status="verify" />
      </section>

      {/* ── Found a problem? ── */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6">
        <p className="font-bold text-orange-800 mb-2 text-sm">⚠️ Found something wrong?</p>
        <p className="text-sm text-orange-700 mb-4 leading-relaxed">
          First, speak to your agency and ask for a corrected payslip in writing.
          If they refuse or don&apos;t respond, you can:
        </p>
        <ul className="text-sm text-orange-700 space-y-2 mb-4">
          <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">•</span> File an anonymous report with the Dutch <strong>Labor Inspectorate</strong> (Inspectie SZW)</li>
          <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">•</span> Contact <strong>FNV</strong> (trade union) for free legal advice</li>
          <li className="flex items-start gap-2"><span className="shrink-0 mt-0.5">•</span> Report the agency on AgencyCheck to warn other workers</li>
        </ul>
        <Link href="/agencies"
          className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          Report on an agency profile →
        </Link>
      </div>

      {/* ── Resources ── */}
      <div id="resources" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <p className="text-sm font-bold text-gray-700 mb-3">📚 Useful resources</p>
        <div className="space-y-2.5">
          {[
            { label: "FNV — free advice for flex workers",            url: "https://www.fnv.nl" },
            { label: "Labor Inspectorate — file anonymous complaint", url: "https://www.nlarbeidsinspectie.nl" },
            { label: "SNF — check agency housing certification",      url: "https://www.normeringflexwonen.nl" },
            { label: "ABU CAO for flex workers",                      url: "https://www.abu.nl" },
          ].map((r) => (
            <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-800 hover:underline">
              <span className="shrink-0">↗</span> {r.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Cross-tool links ── */}
      <div className="flex flex-wrap gap-3">
        <Link href="/tools/shift-tracker"     className="text-sm text-brand-600 font-semibold hover:underline">→ Track your shifts</Link>
        <Link href="/tools/salary-calculator" className="text-sm text-brand-600 font-semibold hover:underline">→ Salary calculator</Link>
        <Link href="/tools"                   className="text-sm text-gray-400 font-medium hover:underline">→ All tools</Link>
      </div>

      <p className="mt-6 text-xs text-gray-400 text-center">
        Informational only — not legal advice. Consult a professional for employment disputes.
      </p>
    </div>
  );
}
