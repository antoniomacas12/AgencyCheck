import Link from "next/link";

/**
 * RealSalaryBlock — the "what you ACTUALLY keep" visual section.
 * Designed to shock: €600 gross crossed out, €243 reality highlighted.
 * Used on the homepage immediately after the hero.
 *
 * All figures are illustrative estimates based on:
 * - Dutch Box 1 income tax + ZVW levy (~22% effective for this bracket)
 * - Average agency housing deduction reported by workers (~€150/wk)
 * - Basisverzekering + ZVW contribution (~€50/wk)
 * - Typical transport cost (~€25/wk)
 * Source: worker-reported data + Dutch tax authority tables 2026
 */
export default function RealSalaryBlock() {
  const hourlyRate   = 15;
  const hoursPerWeek = 40;
  const grossWeekly  = hourlyRate * hoursPerWeek;   // 600

  const tax       = Math.round(grossWeekly * 0.22);  // ~132
  const housing   = 150;
  const insurance = 50;
  const transport = 25;
  const totalOut  = tax + housing + insurance + transport; // ~357
  const realKeep  = grossWeekly - totalOut;                // ~243
  const annualLost = totalOut * 52;

  const rows = [
    { label: "Tax & social insurance", sub: "Box 1 · ZVW · ~22% effective", amount: tax,       color: "text-red-400",    bar: tax / grossWeekly },
    { label: "Housing — agency room",  sub: "Shared room · avg deduction",  amount: housing,   color: "text-orange-400", bar: housing / grossWeekly },
    { label: "Health insurance",       sub: "Basisverzekering + ZVW levy",  amount: insurance, color: "text-yellow-500", bar: insurance / grossWeekly },
    { label: "Transport",             sub: "Bus to work — deducted",        amount: transport, color: "text-amber-400",  bar: transport / grossWeekly },
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-950">

      {/* ── Top label ── */}
      <div className="px-5 pt-5 pb-3 border-b border-white/8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
          Illustrative estimate · €{hourlyRate}/hr · {hoursPerWeek}hrs/week · agency housing included
        </p>
        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
          Gross salary vs. what you actually keep
        </h2>
        <p className="text-[10px] text-gray-600 mt-1.5">
          Based on Dutch tax rates 2026 + worker-reported deductions. Your actual figure may differ.
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
            €{realKeep}
          </p>
          <p className="text-xs text-red-400 mt-1.5 font-semibold">per week · after all costs</p>
        </div>
      </div>

      {/* ── Cost breakdown ── */}
      <div className="px-5 py-4 space-y-2 border-b border-white/8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Where your money goes</p>
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-xs font-semibold text-gray-300">{row.label}</span>
                <span className="text-[10px] text-gray-600 ml-2">{row.sub}</span>
              </div>
              <span className={`text-sm font-black ${row.color}`}>−€{row.amount}</span>
            </div>
            {/* progress bar */}
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${row.color.replace("text-", "bg-")}`}
                style={{ width: `${Math.round(row.bar * 100)}%` }}
              />
            </div>
          </div>
        ))}

        {/* Total deducted */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-3">
          <p className="text-sm font-semibold text-gray-400">Total taken out</p>
          <p className="text-base font-black text-red-400">−€{totalOut} <span className="text-xs font-normal text-gray-600">({Math.round(totalOut/grossWeekly*100)}% of gross)</span></p>
        </div>
      </div>

      {/* ── Annual shock stat ── */}
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
              At <strong className="text-white">€{hourlyRate}/hr</strong> you earn <strong className="text-white">€{grossWeekly}</strong> gross — but keep only{" "}
              <strong className="text-white">€{realKeep}/week</strong>. That is{" "}
              <strong className="text-red-300">{Math.round(realKeep/grossWeekly*100)}% of what was advertised.</strong>
            </p>
            <p className="text-xs text-gray-600 mt-1.5">* Illustrative estimate. Some agencies deduct €170+/week for housing.</p>
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
