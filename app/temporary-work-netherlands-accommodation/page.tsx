import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Temporary Work in the Netherlands with Accommodation 2026 | AgencyCheck",
  description:
    "Temporary work in the Netherlands with accommodation provided. How agencies package housing + employment, real weekly costs, contract terms, and which agencies to approach.",
  alternates: { canonical: "https://agencycheck.io/temporary-work-netherlands-accommodation" },
  openGraph: {
    title: "Temporary Work in the Netherlands with Accommodation",
    description: "How housing + work packages function. Real costs, Phase A contracts, which agencies provide the best packages.",
  },
};

const tempAgencies = ALL_AGENCIES
  .filter((a) => a.housing === "YES" && a.transparencyScore >= 40)
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 8);

export default function TempWorkAccommodationPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/agency-housing-netherlands" className="hover:text-brand-600">Agency Housing</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">Temporary Work with Accommodation</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 font-medium">
            Housing max €113.50/week · Phase A contracts
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Temporary Work in the Netherlands with Accommodation Included
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          Temporary work packages that include accommodation are the standard entry path for
          foreign workers in Dutch logistics, food production, and agriculture. The model
          works well when you understand the real costs — housing is deducted from your wage,
          not free. Here is how the packages work in practice.
        </p>
      </div>

      {/* How the package works */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">How the Work + Housing Package Works</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          When an agency offers &quot;work with accommodation,&quot; it typically means:
        </p>
        <ol className="space-y-3 text-sm text-gray-600">
          {[
            { step: "You register with the agency and accept a placement", detail: "Usually in logistics, food production, or manufacturing. The agency does the matching; you confirm availability." },
            { step: "The agency arranges housing near the work site", detail: "Shared accommodation — typically 2–4 workers per room in an SNF-registered property. Distance to work is usually 5–30 minutes by shuttle." },
            { step: "You move in on your arrival date (usually a Monday)", detail: "Bedding and basic kitchen access are typically provided. Bring your own toiletries. Food shopping is your own cost." },
            { step: "Housing is deducted weekly from your pay", detail: "The deduction appears on your payslip. Maximum €113.50/week under SNF norms. Most agencies charge €85–€110." },
            { step: "BSN registration is handled together with a group", detail: "The agency arranges a group visit to the municipality (gemeente) on your first or second week. You need your passport and the agency's address as your registered address." },
            { step: "First payslip typically arrives 2–3 weeks after starting", detail: "Confirm the payment date before you arrive so you know how long you need to manage with savings first." },
          ].map(({ step, detail }, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="text-brand-600 font-bold shrink-0">{i + 1}.</span>
              <div>
                <p className="font-semibold text-gray-800">{step}</p>
                <p className="mt-0.5 text-gray-500">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Real cost breakdown */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Real Weekly Budget with Accommodation Included</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Based on a standard 40-hour week at WML (€14.71/hr) with typical agency housing
          deduction of €100/week:
        </p>
        <div className="rounded-xl overflow-hidden border border-gray-200">
          {[
            { label: "Gross weekly pay", value: "€588", note: "40h × €14.71" },
            { label: "Tax + ZVW deductions", value: "−€102", note: "Approx. 10.7% tax + 6.57% ZVW" },
            { label: "Vakantiegeld (holiday pay accrued)", value: "+€47", note: "Paid at end of contract or in May" },
            { label: "Net before housing", value: "≈€533", note: null },
            { label: "Housing deduction", value: "−€100", note: "Typical mid-range SNF accommodation" },
            { label: "TAKE-HOME", value: "≈€433/week", note: "≈€1,878/month" },
            { label: "Estimated food cost", value: "−€50–€70", note: "Grocery shopping, not catered" },
            { label: "DISPOSABLE INCOME", value: "≈€360–€380/week", note: "After housing and food" },
          ].map(({ label, value, note }) => (
            <div key={label} className={`flex items-center justify-between gap-3 px-4 py-2.5 border-b border-gray-100 last:border-0 ${label === "TAKE-HOME" || label === "DISPOSABLE INCOME" ? "bg-brand-50" : ""}`}>
              <div>
                <p className={`text-sm ${label === "TAKE-HOME" || label === "DISPOSABLE INCOME" ? "font-bold text-brand-900" : "text-gray-700"}`}>{label}</p>
                {note && <p className="text-xs text-gray-400">{note}</p>}
              </div>
              <span className={`text-sm font-mono shrink-0 ${label === "TAKE-HOME" || label === "DISPOSABLE INCOME" ? "font-bold text-brand-700" : value.startsWith("−") ? "text-red-600" : value.startsWith("+") ? "text-green-600" : "text-gray-800"}`}>{value}</span>
            </div>
          ))}
        </div>
        <Link href="/tools/accommodation-costs" className="inline-block mt-3 text-sm text-brand-700 font-medium hover:text-brand-800">
          → Calculate how housing deduction affects your net pay →
        </Link>
      </div>

      {/* Contract terms */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Temporary Contract Terms: What to Know</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Temporary work contracts in the Netherlands — especially Phase A — are more
          flexible than permanent employment, which works both ways:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-800 mb-2">For the worker</p>
            <ul className="space-y-1.5 text-gray-600">
              <li>✓ Easy to leave with one week&apos;s notice (Phase A)</li>
              <li>✓ Multiple agencies can be tried in sequence</li>
              <li>✓ Housing included from day 1</li>
              <li>✓ Payroll handled — tax, BSN, insurance</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-2">Limitations to understand</p>
            <ul className="space-y-1.5 text-gray-600">
              <li>× Agency can also end work with one week&apos;s notice</li>
              <li>× Housing tied to employment in most cases</li>
              <li>× No paid public holidays in Phase A</li>
              <li>× Hours can vary week to week</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Agencies */}
      {tempAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Agencies Offering Temporary Work with Accommodation</h2>
          <p className="text-gray-500 text-sm mb-4">
            All confirmed to provide housing alongside employment placements.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {tempAgencies.map((a) => (
              <Link key={a.id} href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all">
                <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5">🏠 Housing</span>
                  <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">{a.transparencyScore}/100</span>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/agencies-with-housing" className="inline-block mt-3 text-sm text-brand-700 font-medium hover:text-brand-800">
            → All agencies with confirmed housing →
          </Link>
        </section>
      )}

      {/* Related */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Related Guides</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/agency-housing-netherlands", "Agency housing: SNF rules and rights"],
            ["/work-in-netherlands-with-accommodation", "Work in the Netherlands with accommodation"],
            ["/best-agencies-netherlands-for-foreigners", "Best agencies for foreigners"],
            ["/real-salary-netherlands-agency-work", "Real salary breakdown"],
            ["/tools/accommodation-costs", "Housing cost calculator"],
            ["/jobs-in-netherlands-for-foreigners", "Jobs for foreign workers guide"],
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
