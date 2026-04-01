import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Real Salary for Agency Work in the Netherlands 2026 | AgencyCheck",
  description:
    "What agency workers actually keep in the Netherlands in 2026. WML €14.71/hr, net weekly pay breakdown, housing/tax deductions, night/Sunday premiums, Phase A vs Phase B impact.",
  alternates: { canonical: "https://agencycheck.io/real-salary-netherlands-agency-work" },
  openGraph: {
    title: "Real Salary for Agency Work in the Netherlands 2026",
    description: "Gross to net breakdown. WML, shift premiums, housing deductions — what workers actually receive.",
  },
};

export default function RealSalaryAgencyWorkPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/salary-guides" className="hover:text-brand-600">Salary Guides</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">Agency Work Salary Reality</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 font-medium">
            WML €14.71/hr · 2026 figures
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Real Salary for Agency Work in the Netherlands — 2026 Breakdown
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          Every week, thousands of workers start Dutch agency contracts expecting one income
          and receiving another. The gap is not fraud — it is deductions most workers never
          see explained clearly before signing. This page shows exactly what comes out and why.
        </p>
      </div>

      {/* Baseline: WML */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Starting Point: The 2026 Minimum Wage</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          The <strong>Wettelijk Minimumloon (WML)</strong> — Statutory Minimum Wage — for 2026
          is <strong>€14.71 gross per hour</strong> for workers aged 21 and over. This applies
          to all employment contracts in the Netherlands, including agency contracts. No work
          agency can legally pay below this amount for standard hours.
        </p>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Per hour", value: "€14.71" },
              { label: "Per week (40h)", value: "€588.40" },
              { label: "Per month (est.)", value: "€2,549" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-xl font-extrabold text-gray-800 mt-0.5">{value}</p>
                <p className="text-xs text-gray-400">gross</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Note: WML is reviewed twice a year (January and July). The figures above apply from
          January 2026. Workers aged 18–20 receive a lower minimum; check your contract for
          the applicable rate.
        </p>
      </div>

      {/* Full deduction breakdown */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">The Complete Deduction Path: Gross to Net</h2>
        <p className="text-gray-600 leading-relaxed mb-5">
          Here is what a worker at WML on a standard 40-hour week sees deducted before
          any money arrives in the bank — and what is added back:
        </p>
        <div className="rounded-xl overflow-hidden border border-gray-200">
          {[
            { label: "Gross weekly pay (40h × €14.71)", value: "€588.40", type: "base", note: null },
            { label: "Loonheffing (income tax, ~10.7% at WML)", value: "−€63", type: "deduct", note: "State tax. Rate rises at higher incomes." },
            { label: "ZVW health insurance levy (~6.57%)", value: "−€39", type: "deduct", note: "Employee share. Separate from your health insurance premium." },
            { label: "Vakantiegeld (8% holiday pay)", value: "+€47", type: "add", note: "Accrues weekly, typically paid in May or on contract end." },
            { label: "Net cash before housing/transport", value: "≈€533", type: "sub", note: null },
            { label: "Agency housing (typical: €95–€113.50/wk)", value: "−€95 to €114", type: "deduct", note: "Only if using agency accommodation. SNF max €113.50." },
            { label: "Transport to site (if not included)", value: "−€0 to €30", type: "deduct", note: "Shuttle often included. Varies by agency and site." },
            { label: "YOU ACTUALLY KEEP (weekly)", value: "€320–€438", type: "final", note: "Range covers: no housing vs. max housing deduction." },
          ].map(({ label, value, type, note }) => (
            <div key={label} className={`flex items-start justify-between gap-3 px-4 py-3 border-b border-gray-100 last:border-0 ${type === "final" ? "bg-brand-50" : ""}`}>
              <div>
                <p className={`text-sm ${type === "final" ? "font-bold text-brand-900" : "text-gray-700"}`}>{label}</p>
                {note && <p className="text-xs text-gray-400 mt-0.5">{note}</p>}
              </div>
              <span className={`text-sm font-mono shrink-0 ${
                type === "deduct" ? "text-red-600" :
                type === "add" ? "text-green-600" :
                type === "final" ? "font-bold text-brand-700 text-base" :
                "text-gray-800 font-medium"
              }`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shift premiums */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">How Shift Premiums Change the Picture</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          ABU CAO shift premiums are where a WML worker can meaningfully increase take-home
          pay. A regular night-shift rotation can add €80–€120 net per week — more than
          a full day&apos;s extra work at WML.
        </p>
        <div className="space-y-3">
          {[
            { shift: "Night shift (00:00–06:00)", premium: "+22%", gross_weekly: "≈€717", net_weekly: "≈€460–480", note: "Full 40h week on night shift rotation" },
            { shift: "Sunday shift", premium: "+50%", gross_weekly: "≈€883", net_weekly: "≈€540–560", note: "Full week of Sunday-rate hours (uncommon in practice)" },
            { shift: "Early evening (18:00–24:00)", premium: "+15–20%", gross_weekly: "≈€678–706", net_weekly: "≈€440–455", note: "Depends on agency CAO — ABU minimum is 15%" },
            { shift: "Overtime (>40h/wk)", premium: "125–150%", gross_weekly: "Varies", net_weekly: "Varies", note: "First 2 hours at 125%, after at 150%" },
          ].map(({ shift, premium, gross_weekly, net_weekly, note }) => (
            <div key={shift} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">{shift}</p>
                <p className="text-xs text-gray-400 mt-0.5">{note}</p>
              </div>
              <div className="flex gap-4 text-sm text-right">
                <div>
                  <p className="text-xs text-gray-400">Premium</p>
                  <p className="font-bold text-brand-700">{premium}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Est. gross/wk</p>
                  <p className="font-semibold text-gray-700">{gross_weekly}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Est. net/wk</p>
                  <p className="font-semibold text-green-700">{net_weekly}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Estimates assume 40h/wk at WML €14.71/hr with agency housing at €100/wk deducted.
          Actual figures depend on specific agency CAO, exact hours worked, and tax status.
        </p>
      </div>

      {/* Phase A vs Phase B */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Phase A vs Phase B: Does It Affect Your Pay?</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Your contract phase affects your protections more than your base wage — the WML
          applies in both phases. But Phase B does bring wage-adjacent benefits that
          effectively increase your real income:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="font-bold text-amber-900 mb-2">Phase A</p>
            <ul className="space-y-1.5 text-amber-800">
              <li>• Wage: WML minimum applies</li>
              <li>• Public holidays: <strong>not paid</strong></li>
              <li>• Sick pay: from day 3, via UWV (90%)</li>
              <li>• Contract: renewed weekly</li>
              <li>• Housing: can be lost when work ends</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="font-bold text-green-900 mb-2">Phase B</p>
            <ul className="space-y-1.5 text-green-800">
              <li>• Wage: WML minimum + any sector uplift</li>
              <li>• Public holidays: <strong>paid</strong> (8 days/year)</li>
              <li>• Sick pay: from day 1, 90–100%</li>
              <li>• Contract: fixed term (4 weeks+ notice)</li>
              <li>• Housing: contract-tied, stronger notice rights</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          8 paid public holidays at WML is worth approximately €940/year. For a worker
          reaching Phase B after 78 weeks, the effective pay increase from holiday entitlement
          alone is around €18/week when averaged across the year.
        </p>
      </div>

      {/* Payslip errors */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Why Your Payslip May Show Less Than Expected</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          AgencyCheck has flagged payslip errors at multiple agencies. The most common patterns:
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          {[
            "Night or Sunday premiums applied to fewer hours than worked",
            "Housing deducted for days not in the accommodation (arrival day, travel days)",
            "ZVW levy deducted at a higher percentage than the legal employee rate",
            "Vakantiegeld (holiday pay) accumulated but not included in the regular payslip line",
            "Phase A workers being deducted for public holidays they have no right to pay for",
            "Overtime at 100% instead of 125% for the first two extra hours",
          ].map((err) => (
            <li key={err} className="flex gap-2 items-start">
              <span className="text-red-500 shrink-0">×</span>
              <span>{err}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link href="/tools/payslip-checker" className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
            Check your payslip now →
          </Link>
        </div>
      </div>

      {/* Related */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Salary Tools and Guides</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/tools/real-income-calculator", "Real income calculator (net weekly)"],
            ["/tools/salary-calculator", "Dutch salary calculator 2026"],
            ["/tools/shift-tracker", "Track shifts and verify payslip"],
            ["/tools/accommodation-costs", "Housing cost impact on net pay"],
            ["/salary-guides", "All salary guides for the Netherlands"],
            ["/real-salary-netherlands-after-rent", "Net salary after rent by city"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm text-brand-700 hover:text-brand-800 hover:underline">
              → {label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
