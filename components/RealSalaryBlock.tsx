import Link from "next/link";
import { calculateTakeHome } from "@/lib/dutchTax";

/**
 * RealSalaryBlock — "what you ACTUALLY keep" visual for the homepage.
 * Uses the real dutchTax engine including heffingskorting (tax credits).
 *
 * Example worker: €15/hr, 40 hrs/week, agency housing included.
 * All figures are computed — not hardcoded estimates.
 */

const HOURLY_RATE   = 15;
const HOURS_PER_WK  = 40;
const WEEKS_PER_YR  = 52;

// Monthly costs used in the example
const HOUSING_MONTHLY   = 650;  // €150/week × 4.33 — typical SNF agency housing
const TRANSPORT_MONTHLY = 108;  // €25/week — bus/bike to work site
const OWN_RISK_MONTHLY  = 33;   // eigen risico spread monthly (€385 avg / 12)

export default function RealSalaryBlock() {
  // Run the real calculation engine
  const result = calculateTakeHome({
    hourlyRate:        HOURLY_RATE,
    hoursPerWeek:      HOURS_PER_WK,
    weeksPerYear:      WEEKS_PER_YR,
    includeVakantie:   false,       // show base gross only (no vakantiegeld lump)
    housingCost:       HOUSING_MONTHLY,
    transportCost:     TRANSPORT_MONTHLY,
    healthcareOwnRisk: OWN_RISK_MONTHLY,
  });

  // Convert monthly figures → weekly for display (consistent with "€600/week" gross)
  const toWeekly = (monthly: number) => Math.round(monthly * 12 / WEEKS_PER_YR);

  const grossWeekly     = HOURLY_RATE * HOURS_PER_WK;                    // €600 (exact)
  const taxWeekly       = toWeekly(result.taxMonthly);                   // ~€69 (real)
  const housingWeekly   = Math.round(HOUSING_MONTHLY * 12 / WEEKS_PER_YR); // ~€150
  const healthWeekly    = toWeekly(result.healthcareMonthly);            // ~€40
  const transportWeekly = Math.round(TRANSPORT_MONTHLY * 12 / WEEKS_PER_YR); // ~€25
  const realKeepWeekly  = toWeekly(result.spendableMonthly);             // ~€316

  const totalOut    = taxWeekly + housingWeekly + healthWeekly + transportWeekly;
  const annualLost  = totalOut * WEEKS_PER_YR;
  const keepPct     = Math.round((realKeepWeekly / grossWeekly) * 100);

  const rows = [
    {
      label:  "Income tax",
      sub:    `Box 1 · incl. heffingskorting · ${Math.round(result.effectiveTaxRate * 100)}% effective`,
      amount: taxWeekly,
      color:  "text-red-400",
      bar:    taxWeekly / grossWeekly,
    },
    {
      label:  "Housing — agency room",
      sub:    "Shared room · SNF avg deduction",
      amount: housingWeekly,
      color:  "text-orange-400",
      bar:    housingWeekly / grossWeekly,
    },
    {
      label:  "Health insurance",
      sub:    "Basisverzekering + eigen risico",
      amount: healthWeekly,
      color:  "text-yellow-500",
      bar:    healthWeekly / grossWeekly,
    },
    {
      label:  "Transport",
      sub:    "Bus / bike to work site",
      amount: transportWeekly,
      color:  "text-amber-400",
      bar:    transportWeekly / grossWeekly,
    },
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-950">

      {/* ── Top label ── */}
      <div className="px-5 pt-5 pb-3 border-b border-white/8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
          Real calculation · €{HOURLY_RATE}/hr · {HOURS_PER_WK} hrs/week · agency housing included
        </p>
        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
          Gross salary vs. what you actually keep
        </h2>
        <p className="text-[10px] text-gray-600 mt-1.5">
          Computed using Dutch tax brackets 2026 + heffingskorting + SNF housing data.{" "}
          <Link href="/methodology" className="underline hover:text-gray-400">See full methodology →</Link>
        </p>
      </div>

      {/* ── Gross / Net comparison — the SHOCK row ── */}
      <div className="grid grid-cols-2 divide-x divide-white/10 border-b border-white/10">
        {/* Gross */}
        <div className="px-5 py-5 flex flex-col items-center justify-center text-center bg-white/3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">What agency says</p>
          <p className="text-4xl sm:text-5xl font-black text-gray-500 line-through decoration-red-500 decoration-4">
            €{grossWeekly}
          </p>
          <p className="text-xs text-gray-600 mt-1.5">per week · gross</p>
        </div>
        {/* Real */}
        <div className="px-5 py-5 flex flex-col items-center justify-center text-center bg-red-950/40">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">You actually keep</p>
          <p className="text-4xl sm:text-5xl font-black text-white">
            €{realKeepWeekly}
          </p>
          <p className="text-xs text-red-400 mt-1.5 font-semibold">per week · after all costs</p>
        </div>
      </div>

      {/* ── Cost breakdown ── */}
      <div className="px-5 py-4 space-y-2 border-b border-white/8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Where your money goes each week</p>
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-xs font-semibold text-gray-300">{row.label}</span>
                <span className="text-[10px] text-gray-600 ml-2">{row.sub}</span>
              </div>
              <span className={`text-sm font-black ${row.color}`}>−€{row.amount}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${row.color.replace("text-", "bg-")}`}
                style={{ width: `${Math.round(row.bar * 100)}%` }}
              />
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-3">
          <p className="text-sm font-semibold text-gray-400">Total taken out per week</p>
          <p className="text-base font-black text-red-400">
            −€{totalOut}{" "}
            <span className="text-xs font-normal text-gray-600">
              ({Math.round(totalOut / grossWeekly * 100)}% of gross)
            </span>
          </p>
        </div>
      </div>

      {/* ── Annual stat ── */}
      <div className="px-5 py-3 bg-red-950/20 border-b border-red-900/30">
        <p className="text-xs text-red-300 font-semibold leading-snug">
          That&apos;s{" "}
          <strong className="text-red-400 text-sm">€{annualLost.toLocaleString()}/year</strong>{" "}
          lost to housing, tax &amp; insurance — money that never reaches your account.
        </p>
      </div>

      {/* ── Final callout ── */}
      <div className="px-5 py-5 bg-red-950/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">Bottom line</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              At <strong className="text-white">€{HOURLY_RATE}/hr</strong> you earn{" "}
              <strong className="text-white">€{grossWeekly}</strong> gross — but keep only{" "}
              <strong className="text-white">€{realKeepWeekly}/week</strong>. That is{" "}
              <strong className="text-red-300">{keepPct}% of what was advertised.</strong>
            </p>
            <p className="text-[10px] text-gray-600 mt-1.5">
              * Includes heffingskorting tax credits. Housing varies by agency.{" "}
              <Link href="/methodology" className="underline hover:text-gray-400">How we calculate this →</Link>
            </p>
          </div>
          <Link
            href="/tools/real-income-calculator"
            className="shrink-0 bg-white text-gray-900 text-sm font-black px-5 py-3 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap shadow-lg"
          >
            🧮 Calculate YOUR number
          </Link>
        </div>
      </div>
    </div>
  );
}
