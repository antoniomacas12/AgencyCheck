import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Best Agencies in the Netherlands for Foreign Workers 2026 | AgencyCheck",
  description:
    "Which Dutch work agencies are best for foreign workers in 2026? Ranked by housing provision, English support, transparency, and ABU compliance. Compare 151 verified agencies.",
  alternates: { canonical: "https://agencycheck.io/best-agencies-netherlands-for-foreigners" },
  openGraph: {
    title: "Best Agencies for Foreign Workers in the Netherlands 2026",
    description: "Housing, English support, ABU compliance, and payslip accuracy — ranked for workers arriving from abroad.",
  },
};

const housingAgencies = ALL_AGENCIES
  .filter((a) => a.housing === "YES")
  .sort((a, b) => b.transparencyScore - a.transparencyScore);

const highScoreAgencies = ALL_AGENCIES
  .filter((a) => a.transparencyScore >= 60)
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 6);

export default function BestAgenciesForeignersPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs-in-netherlands-for-foreigners" className="hover:text-brand-600">Jobs for Foreigners</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">Best Agencies for Foreigners</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 font-medium">
            {housingAgencies.length} agencies with confirmed housing · 2026
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Best Agencies in the Netherlands for Foreign Workers
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          For workers arriving from Poland, Romania, Bulgaria, or elsewhere in Europe, not
          every Dutch work agency is equally equipped to help. The agencies that work best
          for foreigners tend to offer: housing alongside employment, English-language
          onboarding, help with BSN registration, and clear payslip communication. This
          page ranks them by what matters for new arrivals.
        </p>
      </div>

      {/* What makes an agency good for foreigners */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">What Makes an Agency Good for Foreign Workers?</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Not all agencies that accept foreign workers actually support them well. The five
          factors that matter most:
        </p>
        <div className="space-y-3">
          {[
            { factor: "Housing included", why: "Arriving in a new country without accommodation is the biggest barrier. Agencies that arrange housing remove this immediately — though you need to understand the deduction (max €113.50/week in 2026)." },
            { factor: "English (or Polish/Romanian) speaking staff", why: "Contract disputes and payslip errors almost always happen because of language barriers. Agencies with multilingual coordinators resolve problems faster and are easier to hold accountable." },
            { factor: "ABU or NBBU registration", why: "ABU and NBBU membership means a recognised CAO applies — your Phase A/B progression, shift premiums, and minimum wage are standardised and enforceable. Unregistered agencies can pay below standard." },
            { factor: "BSN registration help", why: "Getting a BSN (Burgerservicenummer) requires a municipality visit and typically requires a Dutch address — which you don't have when you first arrive. Agencies that handle group BSN registrations remove this friction significantly." },
            { factor: "Transparent payslips", why: "Foreign workers are disproportionately likely to receive incorrect payslips — partly because they're less likely to question them. Agencies with digital payslip portals and multilingual support reduce this risk." },
          ].map(({ factor, why }) => (
            <div key={factor} className="flex gap-3 items-start">
              <span className="text-brand-500 font-bold text-lg shrink-0">✓</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{factor}</p>
                <p className="text-xs text-gray-500 mt-0.5">{why}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* With housing */}
      {housingAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Agencies with Confirmed Housing ({housingAgencies.length} total)
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            For most foreign workers, an agency that arranges housing alongside employment
            is the practical starting point. These have confirmed accommodation provision.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {housingAgencies.slice(0, 8).map((a) => (
              <Link key={a.id} href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all">
                <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5">
                    🏠 Housing confirmed
                  </span>
                  <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">
                    {a.transparencyScore}/100
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {housingAgencies.length > 8 && (
            <Link href="/agencies-with-housing" className="inline-block mt-3 text-sm text-brand-700 font-medium hover:text-brand-800">
              → View all {housingAgencies.length} agencies with housing →
            </Link>
          )}
        </section>
      )}

      {/* Highest transparency */}
      {highScoreAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Most Transparent Agencies (Score 60+)</h2>
          <p className="text-gray-500 text-sm mb-4">
            Agencies with transparency scores above 60 publish more verifiable information
            about their contracts, deductions, and CAO compliance — making it easier for
            foreign workers to understand what they're signing.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {highScoreAgencies.map((a) => (
              <Link key={a.id} href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all">
                <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5 inline-block mt-2">
                  {a.transparencyScore}/100 transparency
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Questions to ask */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Questions to Ask Any Agency Before Signing</h2>
        <p className="text-gray-600 text-sm mb-4">
          These are the questions foreign workers most often wish they had asked before signing.
          A good agency will answer all of them directly and without hesitation.
        </p>
        <ol className="space-y-2 text-sm text-gray-600">
          {[
            "Do you provide housing, and if so, what is the exact weekly deduction in euros?",
            "Is the housing SNF-certified? Can I have the registration number?",
            "How many people share a bedroom?",
            "Will you help me register for a BSN? When and where?",
            "Is there transport to the work site? At what times?",
            "Are you ABU or NBBU registered? Which CAO applies?",
            "Do you have staff who speak English / Polish / Romanian?",
            "What happens to my housing if the work contract ends?",
          ].map((q, i) => (
            <li key={i} className="flex gap-2 items-start">
              <span className="text-brand-600 font-bold shrink-0">{i + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Related */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Related Resources</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/jobs-in-netherlands-for-foreigners", "Jobs in the Netherlands for foreigners"],
            ["/work-in-netherlands-with-accommodation", "Work + accommodation packages"],
            ["/agency-housing-netherlands", "Agency housing: costs and rights"],
            ["/real-salary-netherlands-agency-work", "Real salary breakdown"],
            ["/work-agency-netherlands", "How Dutch work agencies work"],
            ["/tools/payslip-checker", "Check your payslip"],
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
