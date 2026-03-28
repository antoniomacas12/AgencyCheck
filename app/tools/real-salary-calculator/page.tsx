"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  calculateTakeHome,
  WML_HOURLY_2026,
  HOUSING_DEDUCTION_RANGES,
  fmtEur,
  fmtPct,
} from "@/lib/dutchTax";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  prefix = "",
  suffix = "",
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">{prefix}</span>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(clamp(parseFloat(e.target.value) || 0, min, max))}
            className="w-20 text-right text-sm font-bold text-gray-900 border border-gray-300 rounded-lg px-2 py-1
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <span className="text-xs text-gray-400 min-w-[2rem]">{suffix}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-brand-600 cursor-pointer"
      />
      {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function ResultRow({
  label,
  weekly,
  monthly,
  isSubtract = false,
  isBold = false,
  isHighlight = false,
  color,
}: {
  label: string;
  weekly: number | null;
  monthly: number | null;
  isSubtract?: boolean;
  isBold?: boolean;
  isHighlight?: boolean;
  color?: string;
}) {
  const fmt = (v: number | null) =>
    v === null ? "—" : isSubtract ? `−${fmtEur(v)}` : fmtEur(v);

  const cellColor = isSubtract
    ? "text-red-500"
    : color
    ? color
    : isBold
    ? "text-gray-900"
    : "text-gray-700";

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm ${
        isHighlight ? "bg-brand-50 border border-brand-100" : ""
      }`}
    >
      <span className={`flex-1 ${isBold ? "font-semibold text-gray-800" : "text-gray-600"}`}>
        {label}
      </span>
      <span
        className={`w-24 text-right tabular-nums font-${isBold ? "bold" : "medium"} ${cellColor}`}
      >
        {fmt(weekly)}
      </span>
      <span
        className={`w-24 text-right tabular-nums font-${isBold ? "bold" : "medium"} ${cellColor}`}
      >
        {fmt(monthly)}
      </span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RealSalaryCalculatorPage() {
  const [hourlyRate, setHourlyRate]           = useState(14.71);
  const [regularHours, setRegularHours]       = useState(40);
  const [overtimeHours, setOvertimeHours]     = useState(0);
  const [overtimeMult, setOvertimeMult]       = useState(1.25);
  const [hasHousing, setHasHousing]           = useState(false);
  const [housingCost, setHousingCost]         = useState(390);
  const [transportCost, setTransportCost]     = useState(80);
  const [includeVakantie, setIncludeVakantie] = useState(false);

  // Computed values
  const result = useMemo(() => {
    const totalWeeklyHours  = regularHours + overtimeHours;
    const weeklyRegular     = hourlyRate * regularHours;
    const weeklyOvertime    = hourlyRate * overtimeMult * overtimeHours;
    const totalWeeklyGross  = weeklyRegular + weeklyOvertime;
    // Effective rate fed into the tax calculator
    const effectiveRate     = totalWeeklyHours > 0
      ? totalWeeklyGross / totalWeeklyHours
      : hourlyRate;

    return calculateTakeHome({
      hourlyRate:       effectiveRate,
      hoursPerWeek:     totalWeeklyHours,
      weeksPerYear:     48,
      includeVakantie,
      housingCost:      hasHousing ? housingCost : 0,
      transportCost:    hasHousing ? 0 : transportCost,
      healthcareOwnRisk: 30,
    });
  }, [hourlyRate, regularHours, overtimeHours, overtimeMult, hasHousing, housingCost, transportCost, includeVakantie]);

  // Weekly equivalents
  const weeklyHours  = regularHours + overtimeHours;
  const wkGross      = result.grossMonthly * (12 / 48);
  const wkTax        = result.taxMonthly * (12 / 48);
  const wkNet        = result.netMonthly * (12 / 48);
  const wkHousing    = result.housingMonthly * (12 / 48);
  const wkTransport  = result.transportMonthly * (12 / 48);
  const wkHealthcare = result.healthcareMonthly * (12 / 48);
  const wkSpendable  = result.spendableMonthly * (12 / 48);

  const aboveWML = hourlyRate >= WML_HOURLY_2026;
  const wmlDiff  = hourlyRate - WML_HOURLY_2026;

  // Risk styling
  const riskStyle = {
    low:    { bg: "bg-green-50",  text: "text-green-700",  badge: "bg-green-100 text-green-700",  label: "✅ Low risk" },
    medium: { bg: "bg-amber-50",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700",  label: "⚠️ Medium risk" },
    high:   { bg: "bg-red-50",    text: "text-red-700",    badge: "bg-red-100 text-red-700",      label: "🔴 High risk" },
  }[result.riskLevel];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <Link href="/tools" className="text-xs text-gray-400 hover:text-brand-600">← Worker Tools</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-1">💶 Real Salary Calculator</h1>
      <p className="text-sm text-gray-500 mb-7 max-w-xl leading-relaxed">
        Enter your contract details to see your true weekly and monthly take-home after Dutch
        income tax, housing, transport, and healthcare costs.
      </p>

      {/* ── Inputs ── */}
      <div className="card p-5 mb-6 space-y-5">
        <h2 className="text-sm font-bold text-gray-800 mb-1">Your contract details</h2>

        {/* Hourly rate */}
        <SliderRow
          label="Gross hourly rate"
          value={hourlyRate}
          min={10}
          max={30}
          step={0.25}
          prefix="€"
          suffix="/hr"
          onChange={setHourlyRate}
          hint={`WML 2026 minimum: €${WML_HOURLY_2026}/hr`}
        />

        {/* WML warning */}
        {!aboveWML && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700 font-medium -mt-2">
            ⚠️ Below legal minimum wage (WML €{WML_HOURLY_2026}/hr) — this is illegal in the Netherlands.
          </div>
        )}
        {aboveWML && wmlDiff < 1.5 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 -mt-2">
            Only €{wmlDiff.toFixed(2)}/hr above minimum wage. After deductions, this may leave you with very little.
          </div>
        )}

        {/* Regular hours */}
        <SliderRow
          label="Regular hours per week"
          value={regularHours}
          min={16}
          max={60}
          step={1}
          suffix="hrs"
          onChange={setRegularHours}
        />

        {/* Overtime */}
        <div className="grid grid-cols-2 gap-4">
          <SliderRow
            label="Overtime hours/week"
            value={overtimeHours}
            min={0}
            max={20}
            step={1}
            suffix="hrs"
            onChange={setOvertimeHours}
            hint="Extra hours beyond contract"
          />
          <SliderRow
            label="Overtime multiplier"
            value={overtimeMult}
            min={1.0}
            max={2.0}
            step={0.05}
            suffix="×"
            onChange={setOvertimeMult}
            hint="Typical: 1.25×–1.5× (check CAO)"
          />
        </div>

        {/* Housing toggle */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Agency-provided housing</span>
            <button
              type="button"
              onClick={() => setHasHousing(!hasHousing)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                hasHousing ? "bg-brand-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  hasHousing ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {hasHousing && (
            <SliderRow
              label="Housing deduction"
              value={housingCost}
              min={0}
              max={700}
              step={25}
              prefix="€"
              suffix="/mo"
              onChange={setHousingCost}
              hint={`SNF typical: €${HOUSING_DEDUCTION_RANGES.medium.monthlyEstimate}/mo · max: €${HOUSING_DEDUCTION_RANGES.high.monthlyEstimate}/mo`}
            />
          )}
          {!hasHousing && (
            <SliderRow
              label="Own transport cost"
              value={transportCost}
              min={0}
              max={300}
              step={10}
              prefix="€"
              suffix="/mo"
              onChange={setTransportCost}
              hint="Public transport, fuel, parking"
            />
          )}
        </div>

        {/* Vakantiegeld toggle */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Include holiday allowance (8% vakantiegeld)</span>
            <p className="text-xs text-gray-400">Add the legally required 8% to gross</p>
          </div>
          <button
            type="button"
            onClick={() => setIncludeVakantie(!includeVakantie)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              includeVakantie ? "bg-brand-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                includeVakantie ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-800">Your income breakdown</h2>
          {/* Column headers */}
          <div className="flex gap-2 text-xs text-gray-400 font-medium">
            <span className="w-24 text-right">Weekly</span>
            <span className="w-24 text-right">Monthly</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <ResultRow
            label={`Gross (${weeklyHours}h/wk × €${hourlyRate.toFixed(2)}/hr${overtimeHours > 0 ? ` + ${overtimeHours}h OT @${overtimeMult}×` : ""})`}
            weekly={wkGross}
            monthly={result.grossMonthly}
          />
          {includeVakantie && (
            <ResultRow
              label="incl. vakantiegeld (8%)"
              weekly={result.vakantiegeldMonthly * (12 / 48)}
              monthly={result.vakantiegeldMonthly}
              color="text-green-600"
            />
          )}
          <ResultRow
            label={`Dutch tax — loonheffing (${fmtPct(result.effectiveTaxRate)} effective)`}
            weekly={wkTax}
            monthly={result.taxMonthly}
            isSubtract
          />
          <ResultRow
            label="Net after tax"
            weekly={wkNet}
            monthly={result.netMonthly}
            isBold
          />

          <div className="border-t border-gray-100 my-1" />

          {result.housingMonthly > 0 && (
            <ResultRow
              label="Agency housing deduction"
              weekly={wkHousing}
              monthly={result.housingMonthly}
              isSubtract
            />
          )}
          {result.transportMonthly > 0 && (
            <ResultRow
              label="Transport costs"
              weekly={wkTransport}
              monthly={result.transportMonthly}
              isSubtract
            />
          )}
          <ResultRow
            label="Healthcare insurance (est.)"
            weekly={wkHealthcare}
            monthly={result.healthcareMonthly}
            isSubtract
          />

          <div className="border-t border-dashed border-gray-200 my-1" />

          <ResultRow
            label="💶 Real take-home (spendable)"
            weekly={wkSpendable}
            monthly={result.spendableMonthly}
            isBold
            isHighlight
            color="text-brand-700"
          />
        </div>
      </div>

      {/* ── Summary card ── */}
      <div className={`rounded-2xl p-5 mb-6 ${riskStyle.bg} border border-gray-100`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-0.5">Monthly take-home</p>
            <p className="text-xl font-extrabold text-brand-700 tabular-nums">
              {fmtEur(result.spendableMonthly)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-0.5">Weekly take-home</p>
            <p className="text-xl font-extrabold text-brand-700 tabular-nums">
              {fmtEur(wkSpendable)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-0.5">Effective €/hr</p>
            <p className="text-xl font-extrabold text-gray-800 tabular-nums">
              {fmtEur(result.effectiveHourly, 2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-0.5">Risk level</p>
            <span className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-full ${riskStyle.badge}`}>
              {riskStyle.label}
            </span>
          </div>
        </div>

        {result.riskReasons.length > 0 && (
          <ul className="mt-4 space-y-1">
            {result.riskReasons.map((r) => (
              <li key={r} className="text-xs text-red-700 flex items-center gap-1.5">
                <span>•</span> {r}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── WML comparison ── */}
      <div className="card p-4 mb-6">
        <p className="text-xs font-semibold text-gray-700 mb-3">How you compare to minimum wage</p>
        <div className="space-y-2">
          {[
            { label: "Your rate",              rate: hourlyRate },
            { label: "WML minimum (2026)",      rate: WML_HOURLY_2026 },
            { label: "Common agency rate",      rate: 14.50 },
            { label: "Skilled warehouse worker", rate: 16.50 },
          ].map(({ label, rate }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-36 shrink-0">{label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${
                    rate === hourlyRate ? "bg-brand-500" :
                    rate === WML_HOURLY_2026 ? "bg-amber-400" :
                    "bg-gray-300"
                  }`}
                  style={{ width: `${Math.min(100, (rate / 20) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-700 tabular-nums w-16 text-right">
                €{rate.toFixed(2)}/hr
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tips ── */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-blue-800 mb-2">💡 Tips to maximise your take-home</p>
        <ul className="space-y-1.5 text-xs text-blue-700">
          <li>• Negotiate a higher rate — even €0.50/hr more = ~€80/month extra take-home</li>
          <li>• Check if housing deduction has the SNF cap (max ~€565/month)</li>
          <li>• Claim heffingskorting (tax rebate) — reduces loonheffing significantly</li>
          <li>• Make sure overtime is paid at 125%+ (check your CAO)</li>
          <li>• Request vakantiegeld payment monthly, not just in May</li>
        </ul>
      </div>

      {/* ── Links ── */}
      <div className="flex flex-wrap gap-4">
        <Link href="/tools/real-income-calculator" className="text-xs text-brand-600 font-medium hover:underline">
          → Compare two offers side by side
        </Link>
        <Link href="/tools/payslip-checker" className="text-xs text-brand-600 font-medium hover:underline">
          → Check your payslip
        </Link>
        <Link href="/agencies-with-housing" className="text-xs text-brand-600 font-medium hover:underline">
          → Find agencies with housing
        </Link>
        <Link href="/tools" className="text-xs text-gray-400 font-medium hover:underline">
          ← All tools
        </Link>
      </div>

      <p className="mt-6 text-[11px] text-gray-400 text-center leading-relaxed">
        Estimates based on loonheffing 2026 brackets. Does not include heffingskorting (tax credits),
        which can increase net pay by €150–300/month. Consult your payslip or a belastingadviseur for exact figures.
      </p>
    </div>
  );
}
