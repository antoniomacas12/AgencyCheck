import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Best Work Agencies in the Netherlands 2026 — Ranked | AgencyCheck",
  description:
    "The best work agencies in the Netherlands for 2026, ranked by transparency, housing quality, and payslip accuracy. Compare Randstad, Tempo-Team, Covebo, OTTO, Adecco and 146 more.",
  alternates: { canonical: "https://agencycheck.io/best-work-agencies-netherlands" },
  openGraph: {
    title: "Best Work Agencies in the Netherlands 2026 — Ranked",
    description:
      "Ranked by transparency, housing quality, and payslip accuracy. Find the right agency for your situation.",
  },
};

// Agencies by category
const topOverall = ALL_AGENCIES
  .filter((a) => a.transparencyScore >= 65)
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 6);

const withHousing = ALL_AGENCIES
  .filter((a) => a.housing === "YES")
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 6);

const logistics = ALL_AGENCIES
  .filter((a) =>
    a.jobFocus?.some((j) => ["warehouse-worker", "forklift-driver", "order-picker", "reach-truck-driver"].includes(j))
    && a.transparencyScore >= 50
  )
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 5);

const technical = ALL_AGENCIES
  .filter((a) =>
    a.sector === "engineering" || a.sector === "construction"
  )
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 4);

export default function BestWorkAgenciesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">Best Work Agencies</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 font-medium">
            Ranked by transparency score · 2026
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Best Work Agencies in the Netherlands for 2026
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          There is no single &quot;best&quot; agency for everyone. The right match depends on
          your job type, whether you need housing, which region you want to work in, and how
          long you plan to stay. This page breaks it down by category — because a warehouse
          worker coming from Poland has different needs than a Dutch engineer looking for a
          six-month contract.
        </p>
      </div>

      {/* How we rank */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">How AgencyCheck Ranks Agencies</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          AgencyCheck uses a <strong>Transparency Score</strong> (0–100) based on how much
          verifiable information an agency publishes about its contracts, housing, wages, and
          legal status. A high score does not mean the agency is the best employer — it means
          you can do your due diligence before signing.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          {[
            { range: "70–100", label: "High transparency", color: "green", desc: "Most contract terms verifiable publicly" },
            { range: "50–69", label: "Partial data", color: "amber", desc: "Some information available, some gaps" },
            { range: "0–49", label: "Limited data", color: "red", desc: "Little public information — proceed with more questions" },
          ].map(({ range, label, color, desc }) => (
            <div key={range} className={`bg-${color}-50 border border-${color}-100 rounded-xl p-3 text-center`}>
              <p className={`font-bold text-${color}-800 text-lg`}>{range}</p>
              <p className={`text-xs font-medium text-${color}-700 mt-0.5`}>{label}</p>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top overall */}
      {topOverall.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Most Transparent Agencies Overall</h2>
          <p className="text-gray-500 text-sm mb-4">
            These agencies score 65 or above on public information verifiability — the
            strongest starting point for any worker comparing options.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {topOverall.map((a, i) => (
              <Link
                key={a.id}
                href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all flex items-start gap-3"
              >
                <span className="text-2xl font-extrabold text-gray-200 leading-none w-6 shrink-0">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">
                      {a.transparencyScore}/100
                    </span>
                    {a.housing === "YES" && (
                      <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5">
                        🏠 Housing
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Best for logistics */}
      {logistics.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Best for Logistics and Warehouse Work</h2>
          <p className="text-gray-500 text-sm mb-4">
            These agencies specialise in warehouse, forklift, order-picking, and production
            roles — the job types where most international workers in the Netherlands start.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {logistics.map((a) => (
              <Link
                key={a.id}
                href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all"
              >
                <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">
                    {a.transparencyScore}/100
                  </span>
                  {a.housing === "YES" && (
                    <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5">
                      🏠 Housing
                    </span>
                  )}
                  {a.jobFocus?.includes("forklift-driver") && (
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5">
                      Forklift
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <Link href="/warehouse-work-netherlands" className="inline-block mt-3 text-sm text-brand-700 font-medium hover:text-brand-800">
            → Warehouse work in the Netherlands: full guide →
          </Link>
        </section>
      )}

      {/* Best for housing */}
      {withHousing.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Best Agencies That Include Housing</h2>
          <p className="text-gray-500 text-sm mb-4">
            For workers arriving from abroad without a place to stay, these agencies arrange
            accommodation alongside employment. Housing is SNF-certified (or claimed to be)
            and deducted from salary up to €113.50/week in 2026.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {withHousing.map((a) => (
              <Link
                key={a.id}
                href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all"
              >
                <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                <div className="flex items-center gap-2 mt-2">
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
          <Link href="/agencies-with-housing" className="inline-block mt-3 text-sm text-brand-700 font-medium hover:text-brand-800">
            → All agencies with confirmed housing →
          </Link>
        </section>
      )}

      {/* Technical */}
      {technical.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Best for Technical and Skilled Roles</h2>
          <p className="text-gray-500 text-sm mb-4">
            Electricians, maintenance engineers, machinists, and construction specialists typically
            work above WML through specialist technical agencies. These tend to use sector-specific
            CAOs rather than the standard ABU CAO.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {technical.map((a) => (
              <Link
                key={a.id}
                href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all"
              >
                <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5 inline-block mt-2">
                  {a.transparencyScore}/100
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How to choose */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">How to Choose the Right Agency for Your Situation</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-800">You need housing + work together</p>
            <p className="mt-1">Prioritise agencies with confirmed SNF housing. Ask the housing cost in euros per week — not just "it&apos;s included." Agencies with housing near your client site save you transport costs too.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">You are coming for 3–6 months</p>
            <p className="mt-1">Look for agencies with a Phase B track record — meaning workers who started in Phase A actually got to Phase B rather than having contracts terminated just before week 79. Ask the coordinator directly.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">You have a specific skill (forklift, reach truck, HACCP)</p>
            <p className="mt-1">Specialist agencies typically pay above WML for certified operators. Register as skilled, not general labour — the difference can be €1–2/hr from day one.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">You want predictable income</p>
            <p className="mt-1">Ask for the minimum guaranteed hours per week. Phase A contracts without a guaranteed hours clause can leave you working 15 hours one week and 50 the next, which makes budgeting impossible.</p>
          </div>
        </div>
      </div>

      {/* Related links */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Related Guides</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/work-agency-netherlands", "How Dutch work agencies operate"],
            ["/agency-housing-netherlands", "Agency housing: SNF rules and costs"],
            ["/real-salary-netherlands-agency-work", "Real salary reality for agency workers"],
            ["/jobs-in-netherlands-for-foreigners", "Jobs in the Netherlands for foreigners"],
            ["/tools/real-income-calculator", "Net pay calculator"],
            ["/compare", "Side-by-side agency comparison"],
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
