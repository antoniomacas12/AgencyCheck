import Link from "next/link";
import {
  calculateTakeHome,
  WML_HOURLY_2026,
  HOUSING_DEDUCTION_RANGES,
  fmtEur,
} from "@/lib/dutchTax";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AgencyRealityCheckProps {
  /** Agency slug — used to build CTA link */
  agencySlug: string;
  /** Whether this agency provides housing to workers */
  hasHousing: boolean;
  /** Whether this agency arranges transport */
  hasTransport: boolean;
  /** Name shown in CTA */
  agencyName: string;
}

// ─── Scenarios ────────────────────────────────────────────────────────────────

const SCENARIOS = [
  { key: "wml",     label: "Min. wage",    rate: WML_HOURLY_2026,  hours: 40 },
  { key: "typical", label: "Common rate",  rate: 14.50,            hours: 40 },
  { key: "skilled", label: "Skilled",      rate: 16.50,            hours: 40 },
] as const;

// ─── Mini waterfall row ───────────────────────────────────────────────────────

function MiniRow({
  label,
  value,
  subtract = false,
  bold = false,
}: {
  label: string;
  value: number;
  subtract?: boolean;
  bold?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between text-xs py-0.5 ${bold ? "font-semibold" : ""}`}>
      <span className="text-gray-500">{label}</span>
      <span className={subtract ? "text-red-500" : bold ? "text-gray-900" : "text-gray-700"}>
        {subtract ? `−${fmtEur(value)}` : fmtEur(value)}
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AgencyRealityCheck({
  agencySlug,
  hasHousing,
  hasTransport,
  agencyName,
}: AgencyRealityCheckProps) {
  const housingCost    = hasHousing  ? HOUSING_DEDUCTION_RANGES.medium.monthlyEstimate : 0;
  const transportCost  = hasTransport || hasHousing ? 0 : 80; // agency arranges if housing, else est.

  // Calculate all three scenarios
  const scenarios = SCENARIOS.map(({ key, label, rate, hours }) => {
    const result = calculateTakeHome({
      hourlyRate:       rate,
      hoursPerWeek:     hours,
      weeksPerYear:     48,
      includeVakantie:  false,
      housingCost,
      transportCost,
      healthcareOwnRisk: 30,
    });
    return { key, label, rate, result };
  });

  const calcHref = `/tools/real-salary-calculator`;

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            🧮 Worker Reality Check
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Estimated monthly take-home at {agencyName} — after tax, deductions &amp; costs
          </p>
        </div>
      </div>

      {/* Housing/Transport context */}
      <div className="flex flex-wrap gap-2 mb-4">
        {hasHousing && (
          <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 font-medium">
            🏠 Housing deducted ~€{housingCost}/mo
          </span>
        )}
        {!hasHousing && (
          <span className="inline-flex items-center gap-1 text-[11px] bg-gray-50 text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">
            🏠 No agency housing — find your own
          </span>
        )}
        {(hasTransport || hasHousing) && (
          <span className="inline-flex items-center gap-1 text-[11px] bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-medium">
            🚌 Transport arranged
          </span>
        )}
        {!hasTransport && !hasHousing && (
          <span className="inline-flex items-center gap-1 text-[11px] bg-gray-50 text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">
            🚌 Transport: est. €{transportCost}/mo own cost
          </span>
        )}
      </div>

      {/* Scenario cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {scenarios.map(({ key, label, rate, result }) => {
          const isAboveWML = rate >= WML_HOURLY_2026;
          return (
            <div
              key={key}
              className={`rounded-xl p-3 text-center ${
                key === "typical"
                  ? "bg-brand-50 border border-brand-100"
                  : "bg-gray-50 border border-gray-100"
              }`}
            >
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
              <p className="text-base font-bold text-gray-800 mt-0.5">€{rate.toFixed(2)}</p>
              <p className="text-[10px] text-gray-400">/hr gross</p>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <p className="text-[10px] text-gray-500">Take-home/mo</p>
                <p className={`text-sm font-extrabold tabular-nums ${key === "typical" ? "text-brand-700" : "text-gray-700"}`}>
                  {fmtEur(result.spendableMonthly)}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {fmtEur(result.effectiveHourly, 2)}/hr real
                </p>
              </div>
              {!isAboveWML && (
                <p className="text-[9px] text-red-600 mt-1 font-medium">⚠ below WML</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Common-rate detailed breakdown */}
      {(() => {
        const { result } = scenarios[1]; // "typical" scenario
        return (
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Example: €14.50/hr, 40h/week breakdown (monthly)
            </p>
            <MiniRow label="Gross monthly" value={result.grossMonthly} />
            <MiniRow label="Dutch income tax" value={result.taxMonthly} subtract />
            <MiniRow label="Net after tax" value={result.netMonthly} bold />
            {result.housingMonthly > 0 && (
              <MiniRow label="Housing deduction" value={result.housingMonthly} subtract />
            )}
            {result.transportMonthly > 0 && (
              <MiniRow label="Transport" value={result.transportMonthly} subtract />
            )}
            <MiniRow label="Healthcare (est.)" value={result.healthcareMonthly} subtract />
            <div className="border-t border-gray-300 mt-1.5 pt-1.5">
              <MiniRow label="💶 Spendable per month" value={result.spendableMonthly} bold />
            </div>
          </div>
        );
      })()}

      {/* Notes */}
      {hasHousing && (
        <p className="text-[10px] text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-3 leading-relaxed">
          ⚠️ Housing deduction ({fmtEur(housingCost)}/mo) is taken from your pay <em>on top of</em> income tax.
          SNF-certified agencies are capped at ~€{HOUSING_DEDUCTION_RANGES.high.monthlyEstimate}/month.
          Always verify this in your contract.
        </p>
      )}

      {/* CTA */}
      <Link
        href={`${calcHref}?housing=${hasHousing ? "1" : "0"}`}
        className="block w-full text-center bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
      >
        🧮 Calculate your exact take-home →
      </Link>

      <p className="text-[10px] text-gray-400 text-center mt-2 leading-relaxed">
        Estimates based on loonheffing 2026. Excludes heffingskorting (tax credits).
        Actual pay depends on your contract.
      </p>
    </div>
  );
}
