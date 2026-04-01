import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Work in the Netherlands with Accommodation 2026 — Full Guide | AgencyCheck",
  description:
    "Work in the Netherlands with accommodation included. How housing packages work, real weekly costs, which cities have most opportunities, and which agencies to approach.",
  alternates: { canonical: "https://agencycheck.io/work-in-netherlands-with-accommodation" },
  openGraph: {
    title: "Work in the Netherlands with Accommodation 2026",
    description: "Housing + work packages explained. Real costs, top cities, and 20+ verified agencies that include accommodation.",
  },
};

const housingAgencies = ALL_AGENCIES
  .filter((a) => a.housing === "YES")
  .sort((a, b) => b.transparencyScore - a.transparencyScore);

export default function WorkNetherlandsAccommodationPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">Work in Netherlands with Accommodation</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-3 py-1 font-medium">
            {housingAgencies.length} agencies with confirmed housing
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Work in the Netherlands with Accommodation: Full Guide for 2026
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          The Netherlands offers work + housing packages through licensed staffing agencies —
          primarily in logistics, food production, and agriculture. For workers arriving from
          outside the Netherlands, this is the most practical starting point: one registration
          gets you both a job and a place to sleep. This guide explains how the packages work,
          what they actually cost, and what to check before signing.
        </p>
      </div>

      {/* Why accommodation is included */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Why Dutch Agencies Include Accommodation</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          The Netherlands has a structural shortage of labour in logistics and food processing.
          Agencies recruit heavily from Poland, Romania, Bulgaria, and other EU countries.
          Workers from these countries cannot realistically find and secure housing before
          arriving — so agencies stepped in to provide it, deducting the cost from wages.
        </p>
        <p className="text-gray-600 leading-relaxed">
          The system is regulated. SNF (Stichting Normering Flexwonen) sets minimum standards
          for the accommodation and caps the deduction at <strong>€113.50/week</strong> in
          2026. Agencies that deviate from these standards risk losing their SNF certification.
        </p>
      </div>

      {/* Most common jobs */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Jobs Most Commonly Offered with Accommodation</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { job: "Warehouse Worker / Order Picker", pay: "€14.71–€15.50/hr", note: "Most common. No experience needed." },
            { job: "Forklift / Reach Truck Operator", pay: "€15.50–€17.50/hr", note: "Certificate required. Higher pay." },
            { job: "Food Production / Packaging", pay: "€14.71–€16.00/hr", note: "HACCP environment. Cold or warm." },
            { job: "Greenhouse / Agricultural Worker", pay: "€14.71–€15.20/hr", note: "Seasonal peaks spring/summer." },
            { job: "Construction / Civil Works", pay: "€16.00–€22.00/hr", note: "Trade skills valued. SKW housing." },
            { job: "Cleaning / Facility Services", pay: "€14.71–€15.00/hr", note: "Early morning shifts common." },
          ].map(({ job, pay, note }) => (
            <div key={job} className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm font-semibold text-gray-800">{job}</p>
              <p className="text-xs text-brand-700 font-medium mt-0.5">{pay}</p>
              <p className="text-xs text-gray-400 mt-0.5">{note}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/warehouse-jobs-netherlands-with-accommodation" className="text-sm text-brand-700 font-medium hover:text-brand-800">
            → Warehouse jobs with accommodation →
          </Link>
          <Link href="/jobs-with-accommodation" className="text-sm text-gray-500 font-medium hover:text-gray-700">
            → All jobs with accommodation →
          </Link>
        </div>
      </div>

      {/* Cities */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Where the Opportunities Are</h2>
        <p className="text-gray-600 text-sm mb-4">
          Agencies with housing concentrate around major logistics and food processing zones:
        </p>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          {[
            { city: "Tilburg / Waalwijk", sector: "Logistics", agencies: "8+ active" },
            { city: "Venlo / Blerick", sector: "Cross-dock / logistics", agencies: "5+ active" },
            { city: "Rotterdam", sector: "Port / food", agencies: "6+ active" },
            { city: "Westland / Naaldwijk", sector: "Greenhouse", agencies: "4+ active" },
            { city: "Eindhoven", sector: "Production / tech", agencies: "5+ active" },
            { city: "Ridderkerk / Barendrecht", sector: "Distribution", agencies: "3+ active" },
          ].map(({ city, sector, agencies }) => (
            <div key={city} className="bg-gray-50 rounded-xl p-3">
              <p className="font-semibold text-gray-800">{city}</p>
              <p className="text-xs text-brand-700 mt-0.5">{sector}</p>
              <p className="text-xs text-gray-400 mt-0.5">{agencies}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agencies */}
      {housingAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Agencies with Confirmed Accommodation ({housingAgencies.length})
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Sorted by transparency score. Always confirm current housing availability and
            exact weekly deduction before signing.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {housingAgencies.slice(0, 10).map((a) => (
              <Link key={a.id} href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all">
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
          {housingAgencies.length > 10 && (
            <Link href="/agencies-with-housing" className="inline-block mt-3 text-sm text-brand-700 font-medium hover:text-brand-800">
              → View all {housingAgencies.length} agencies →
            </Link>
          )}
        </section>
      )}

      {/* Related */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Further Reading</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/agency-housing-netherlands", "How SNF housing works: costs and rights"],
            ["/temporary-work-netherlands-accommodation", "Temporary work with accommodation"],
            ["/best-agencies-netherlands-for-foreigners", "Best agencies for foreign workers"],
            ["/real-salary-netherlands-agency-work", "What you actually keep after deductions"],
            ["/jobs-in-netherlands-for-foreigners", "Jobs in the Netherlands for foreigners"],
            ["/tools/accommodation-costs", "Housing cost impact calculator"],
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
