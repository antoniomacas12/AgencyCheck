"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  calculateTakeHome,
  WML_HOURLY_2026,
  HOUSING_DEDUCTION_RANGES,
  fmtEur,
  fmtPct,
  type TakeHomeResult,
} from "@/lib/dutchTax";
import { useT, type Locale } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// Locale detection for client components
// ─────────────────────────────────────────────────────────────────────────────

function useClientLocale(): Locale {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)ac_locale=([^;]+)/);
    const val = match?.[1];
    if (val === "pl" || val === "ro") setLocale(val);
  }, []);
  return locale;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScenarioInput {
  label:          string;
  color:          "green" | "brand";
  hourlyRate:     number;
  hoursPerWeek:   number;
  housingCost:    number;   // €/month deducted by agency (0 if no housing)
  transportCost:  number;   // €/month own cost
  includeVakantie: boolean;
}

// ─── Risk badge ───────────────────────────────────────────────────────────────

function RiskBadge({ level, t }: { level: "low" | "medium" | "high"; t: (key: string) => string }) {
  const cfg = {
    low:    { bg: "bg-green-100",  text: "text-green-700",  label: t("calculator_page.risk_low") },
    medium: { bg: "bg-amber-100",  text: "text-amber-700",  label: t("calculator_page.risk_medium") },
    high:   { bg: "bg-red-100",    text: "text-red-700",    label: t("calculator_page.risk_high") },
  }[level];
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}

// ─── Waterfall breakdown row ──────────────────────────────────────────────────

function WaterfallRow({
  label, amount, isSubtract = false, isTotal = false, isGray = false,
}: {
  label: string; amount: number; isSubtract?: boolean; isTotal?: boolean; isGray?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-2 px-3 text-xs ${isTotal ? "font-bold bg-gray-50 rounded-lg" : ""} ${isGray ? "opacity-60" : ""}`}>
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold tabular-nums ${isSubtract ? "text-red-500" : isTotal ? "text-gray-900 text-sm" : "text-gray-800"}`}>
        {isSubtract ? `−${fmtEur(amount)}` : fmtEur(amount)}
      </span>
    </div>
  );
}

// ─── Scenario card ────────────────────────────────────────────────────────────

function ScenarioCard({
  scenario,
  setScenario,
  result,
  isWinner,
  letter,
  t,
}: {
  scenario:    ScenarioInput;
  setScenario: (s: ScenarioInput) => void;
  result:      TakeHomeResult;
  isWinner:    boolean;
  letter:      "A" | "B";
  t: (key: string, vars?: Record<string, string | number>) => string;
}) {
  const isGreen  = scenario.color === "green";
  const bgHeader = isGreen ? "bg-green-600" : "bg-brand-600";

  function Slider({
    label, value, min, max, step, prefix = "", suffix = "",
    onChange,
  }: {
    label: string; value: number; min: number; max: number; step: number;
    prefix?: string; suffix?: string; onChange: (v: number) => void;
  }) {
    return (
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs text-gray-500">{label}</label>
          <span className="text-sm font-bold text-gray-800 tabular-nums">
            {prefix}{value % 1 === 0 ? value : value.toFixed(2)}{suffix}
          </span>
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full accent-brand-600"
        />
      </div>
    );
  }

  const monthlyHours = (scenario.hoursPerWeek * 48) / 12;

  return (
    <div className={`card overflow-hidden flex flex-col ${isWinner ? "ring-2 ring-offset-2 ring-green-400" : ""}`}>

      {/* Header */}
      <div className={`${bgHeader} text-white px-4 py-3 flex items-center justify-between`}>
        <p className="font-bold text-sm">{letter}. {scenario.label}</p>
        {isWinner && (
          <span className="text-xs bg-white/20 rounded-full px-2 py-0.5 font-semibold">
            {t("calculator_page.better_deal")}
          </span>
        )}
      </div>

      {/* Sliders */}
      <div className="p-4 space-y-3 border-b border-gray-100">
        <Slider
          label={t("calculator_page.slider_hourly")}
          value={scenario.hourlyRate} min={10} max={28} step={0.25}
          prefix="€" suffix="/hr"
          onChange={(v) => setScenario({ ...scenario, hourlyRate: v })}
        />

        {/* WML indicator */}
        {scenario.hourlyRate < WML_HOURLY_2026 && (
          <p className="text-[10px] text-red-600 font-medium -mt-1">
            {t("calculator_page.below_wml", { wml: WML_HOURLY_2026 })}
          </p>
        )}

        <Slider
          label={t("calculator_page.slider_hours")}
          value={scenario.hoursPerWeek} min={16} max={60} step={1}
          suffix=" hrs"
          onChange={(v) => setScenario({ ...scenario, hoursPerWeek: v })}
        />
        <Slider
          label={t("calculator_page.slider_housing")}
          value={scenario.housingCost} min={0} max={700} step={25}
          prefix="€" suffix="/mo"
          onChange={(v) => setScenario({ ...scenario, housingCost: v })}
        />
        {scenario.housingCost > 0 && (
          <p className="text-[10px] text-amber-700 -mt-1">
            {t("calculator_page.snf_note", { medium: HOUSING_DEDUCTION_RANGES.medium.monthlyEstimate, high: HOUSING_DEDUCTION_RANGES.high.monthlyEstimate })}
          </p>
        )}
        <Slider
          label={t("calculator_page.slider_transport")}
          value={scenario.transportCost} min={0} max={300} step={10}
          prefix="€" suffix="/mo"
          onChange={(v) => setScenario({ ...scenario, transportCost: v })}
        />
      </div>

      {/* Waterfall breakdown */}
      <div className="p-4 space-y-0.5 flex-1">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{t("calculator_page.monthly_breakdown")}</p>
        <WaterfallRow label={t("calculator_page.gross_label", { hours: monthlyHours.toFixed(0), rate: scenario.hourlyRate.toFixed(2) })} amount={result.grossMonthly} />
        <WaterfallRow label={t("calculator_page.tax_label")} amount={result.taxMonthly} isSubtract />
        <WaterfallRow label={t("calculator_page.net_after_tax", { pct: fmtPct(1 - result.effectiveTaxRate) })} amount={result.netMonthly} isTotal />
        {result.housingMonthly > 0 && (
          <WaterfallRow label={t("calculator_page.housing_deduction")} amount={result.housingMonthly} isSubtract />
        )}
        {result.transportMonthly > 0 && (
          <WaterfallRow label={t("calculator_page.transport_costs")} amount={result.transportMonthly} isSubtract />
        )}
        <WaterfallRow label={t("calculator_page.healthcare")} amount={result.healthcareMonthly} isSubtract />
        <div className="border-t border-gray-200 mt-2 pt-2" />
        <WaterfallRow label={t("calculator_page.spendable")} amount={result.spendableMonthly} isTotal />
      </div>

      {/* Bottom summary */}
      <div className={`mx-4 mb-4 p-3 rounded-xl text-center ${isWinner ? "bg-green-50" : "bg-gray-50"}`}>
        <p className="text-xs text-gray-500 mb-0.5">{t("calculator_page.effective_hourly")}</p>
        <p className={`text-2xl font-extrabold tabular-nums ${isWinner ? "text-green-600" : "text-gray-700"}`}>
          {fmtEur(result.effectiveHourly, 2)}/hr
        </p>
        <div className="mt-2">
          <RiskBadge level={result.riskLevel} t={t} />
        </div>
        {result.riskReasons.length > 0 && (
          <ul className="mt-2 text-left space-y-0.5">
            {result.riskReasons.map((r) => (
              <li key={r} className="text-[10px] text-red-600">• {r}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RealIncomeCalculatorPage() {
  const locale = useClientLocale();
  const t = useT(locale);

  const [scenarioA, setA] = useState<ScenarioInput>({
    label:          t("calculator_page.scenario_a_label"),
    color:          "green",
    hourlyRate:     12.50,
    hoursPerWeek:   40,
    housingCost:    390,   // typical SNF deduction
    transportCost:  0,     // agency arranges transport
    includeVakantie: true,
  });

  const [scenarioB, setB] = useState<ScenarioInput>({
    label:          t("calculator_page.scenario_b_label"),
    color:          "brand",
    hourlyRate:     14.50,
    hoursPerWeek:   40,
    housingCost:    0,
    transportCost:  80,    // own transport
    includeVakantie: true,
  });

  function toResult(s: ScenarioInput): TakeHomeResult {
    return calculateTakeHome({
      hourlyRate:      s.hourlyRate,
      hoursPerWeek:    s.hoursPerWeek,
      weeksPerYear:    48,
      includeVakantie: s.includeVakantie,
      housingCost:     s.housingCost,
      transportCost:   s.transportCost,
      healthcareOwnRisk: 30,
    });
  }

  const a = toResult(scenarioA);
  const b = toResult(scenarioB);
  const winner = a.effectiveHourly >= b.effectiveHourly ? "A" : "B";
  const gap    = Math.abs(a.effectiveHourly - b.effectiveHourly);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Gradient hero ── */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white rounded-2xl p-6 mb-8">
        <nav className="flex items-center gap-1.5 text-xs text-brand-300 mb-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-white font-medium">Compare Two Agency Offers</span>
        </nav>
        <div className="flex items-start gap-4">
          <span className="text-4xl shrink-0">🧮</span>
          <div>
            <h1 className="text-xl font-bold mb-1.5">{t("calculator_page.heading")}</h1>
            <p className="text-sm text-brand-200 leading-relaxed max-w-lg">
              {t("calculator_page.subheading")}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-white/15 rounded-full px-3 py-1">🔒 Data stays in browser</span>
              <span className="text-xs bg-white/15 rounded-full px-3 py-1">📅 2026 loonheffing</span>
              <span className="text-xs bg-white/15 rounded-full px-3 py-1">⚖️ Side-by-side comparison</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tax notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-7">
        <span className="shrink-0 text-lg">ℹ️</span>
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>{t("calculator_page.tax_notice", { wml: WML_HOURLY_2026 })}</strong>
        </p>
      </div>

      {/* Scenario cards */}
      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        <ScenarioCard scenario={scenarioA} setScenario={setA} result={a} isWinner={winner === "A"} letter="A" t={t} />
        <ScenarioCard scenario={scenarioB} setScenario={setB} result={b} isWinner={winner === "B"} letter="B" t={t} />
      </div>

      {/* Summary comparison table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-800 mb-4">{t("calculator_page.comparison_title")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="text-left pb-2 font-medium">{t("calculator_page.comparison_item")}</th>
                <th className="text-right pb-2 font-medium w-28">{t("calculator_page.comparison_a")}</th>
                <th className="text-right pb-2 font-medium w-28">{t("calculator_page.comparison_b")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { label: t("calculator_page.row_gross_hourly"),      a: `${fmtEur(a.grossHourly, 2)}/hr`,     b: `${fmtEur(b.grossHourly, 2)}/hr` },
                { label: t("calculator_page.row_monthly_gross"),          a: fmtEur(a.grossMonthly),              b: fmtEur(b.grossMonthly) },
                { label: t("calculator_page.row_income_tax"),   a: `−${fmtEur(a.taxMonthly)}`,          b: `−${fmtEur(b.taxMonthly)}` },
                { label: t("calculator_page.row_net_after_tax"),          a: fmtEur(a.netMonthly),               b: fmtEur(b.netMonthly) },
                { label: t("calculator_page.row_housing"),      a: a.housingMonthly > 0 ? `−${fmtEur(a.housingMonthly)}` : "—", b: b.housingMonthly > 0 ? `−${fmtEur(b.housingMonthly)}` : "—" },
                { label: t("calculator_page.row_transport"),         a: scenarioA.transportCost > 0 ? `−${fmtEur(scenarioA.transportCost)}` : "—", b: scenarioB.transportCost > 0 ? `−${fmtEur(scenarioB.transportCost)}` : "—" },
                { label: t("calculator_page.row_healthcare"),      a: `−${fmtEur(a.healthcareMonthly)}`,   b: `−${fmtEur(b.healthcareMonthly)}` },
                { label: t("calculator_page.row_spendable"),   a: fmtEur(a.spendableMonthly),         b: fmtEur(b.spendableMonthly), bold: true },
                { label: t("calculator_page.row_effective"),  a: `${fmtEur(a.effectiveHourly, 2)}/hr`, b: `${fmtEur(b.effectiveHourly, 2)}/hr`, bold: true },
                { label: t("calculator_page.row_risk"),             a: a.riskLevel.toUpperCase(),           b: b.riskLevel.toUpperCase() },
              ].map(({ label, a: va, b: vb, bold }) => (
                <tr key={label} className={bold ? "bg-gray-50 font-semibold" : ""}>
                  <td className="py-2 text-gray-500">{label}</td>
                  <td className={`py-2 text-right tabular-nums ${bold && winner === "A" ? "text-green-600" : "text-gray-800"}`}>{va}</td>
                  <td className={`py-2 text-right tabular-nums ${bold && winner === "B" ? "text-green-600" : "text-gray-800"}`}>{vb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-green-700">
              {t("calculator_page.winner_text", { winner, gap: fmtEur(gap, 2) })}
            </span>{" "}
            {t("calculator_page.calc_note")}
          </p>
        </div>
      </div>

      {/* Housing deduction info box */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
        <p className="text-xs font-semibold text-blue-800 mb-2">{t("calculator_page.snf_title")}</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          {Object.entries(HOUSING_DEDUCTION_RANGES).map(([key, range]) => (
            <div key={key} className="bg-white rounded-lg py-2 px-3">
              <p className="text-xs font-semibold text-gray-700">€{range.monthlyEstimate}/mo</p>
              <p className="text-[10px] text-gray-500">{range.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-blue-700 mt-2">
          {t("calculator_page.snf_note_detail")}
        </p>
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-4">
        <Link href="/tools/salary-calculator" className="text-xs text-brand-600 font-medium hover:underline">
          {t("calculator_page.link_salary")}
        </Link>
        <Link href="/agencies-with-housing" className="text-xs text-brand-600 font-medium hover:underline">
          {t("calculator_page.link_housing")}
        </Link>
        <Link href="/tools" className="text-xs text-gray-400 font-medium hover:underline">
          {t("calculator_page.link_tools")}
        </Link>
      </div>
    </div>
  );
}
