import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Warehouse Jobs Netherlands with Accommodation 2026 | AgencyCheck",
  description:
    "Warehouse jobs in the Netherlands with accommodation included. Which agencies provide housing near Tilburg, Venlo, Rotterdam. Pay rates, shift premiums, real weekly income.",
  alternates: { canonical: "https://agencycheck.io/warehouse-jobs-netherlands-with-accommodation" },
  openGraph: {
    title: "Warehouse Jobs Netherlands with Accommodation 2026",
    description: "Which agencies offer warehouse work with housing near major logistics hubs. Real pay and deduction breakdown.",
  },
};

const warehouseHousingAgencies = ALL_AGENCIES.filter((a) =>
  a.housing === "YES" && a.jobFocus?.some((j) =>
    ["warehouse-worker", "order-picker", "forklift-driver", "reach-truck-driver"].includes(j)
  )
).sort((a, b) => b.transparencyScore - a.transparencyScore);

// Fallback: any housing agencies with logistics focus
const fallbackAgencies = ALL_AGENCIES.filter((a) => a.housing === "YES")
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 8);

const displayAgencies = warehouseHousingAgencies.length >= 3 ? warehouseHousingAgencies : fallbackAgencies;

export default function WarehouseJobsNetherlandsAccommodationPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/warehouse-work-netherlands" className="hover:text-brand-600">Warehouse Work</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">With Accommodation</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 font-medium">
            €14.71–€17.50/hr · Housing max €113.50/week
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Warehouse Jobs in the Netherlands with Accommodation
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          Dutch logistics companies — and the agencies that supply them with workers — regularly
          provide accommodation alongside warehouse placements. The Netherlands is home to some
          of Europe&apos;s largest distribution hubs, and demand for warehouse workers in Tilburg,
          Venlo, Rotterdam, and Breda is consistent year-round. Here is what a warehouse +
          housing package actually looks like in 2026.
        </p>
      </div>

      {/* What the package includes */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">What &quot;Warehouse Job with Accommodation&quot; Actually Means</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          When an agency advertises warehouse work with housing, the standard package in the
          Netherlands includes:
        </p>
        <div className="space-y-2">
          {[
            ["✓ Shared accommodation", "SNF-registered. Typically 2–4 workers per room, communal kitchen and bathroom, shuttle to work."],
            ["✓ Shuttle transport", "Shift-timed transport to the distribution centre. Distance varies from on-site to 30 minutes."],
            ["✓ Payroll through agency", "Tax, BSN, holiday pay all managed by the agency. Your employer of record is the agency, not the warehouse."],
            ["✓ Housing deducted from wages", "Not free. Maximum €113.50/week. Get this figure in writing before signing."],
            ["✓ Physical demanding work", "Picking, packing, scanning — standing for 8–12 hours. Temperature varies by warehouse type."],
          ].map(([label, detail]) => (
            <div key={label as string} className="flex gap-3 items-start text-sm">
              <span className="text-green-600 font-semibold shrink-0">{(label as string).split(" ")[0]}</span>
              <div>
                <span className="font-semibold text-gray-800">{(label as string).replace("✓ ", "")}</span>
                <span className="text-gray-500"> — {detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pay breakdown */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Warehouse Pay + Housing: What You Keep</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-center mb-5">
          {[
            { label: "Gross/hour (WML)", value: "€14.71" },
            { label: "Net/week (40h)", value: "≈€345" },
            { label: "After housing (€100)", value: "≈€245" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-xl font-extrabold text-gray-800 mt-1">{value}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Night shifts (+22% ABU premium) push weekly net to approximately €420 before housing,
          leaving around €320 after a €100 housing deduction.
        </p>
        <Link href="/tools/real-income-calculator" className="text-sm font-medium text-brand-700 hover:text-brand-800">
          → Calculate your exact net weekly pay →
        </Link>
      </div>

      {/* Cities */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Main Warehouse Hubs in the Netherlands</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { city: "Tilburg / Waalwijk / Breda", clients: "Amazon, Rhenus, Kuehne+Nagel, Ingram Micro, Bol.com", note: "Highest housing agency concentration in the Netherlands" },
            { city: "Venlo / Blerick", clients: "Amazon, Ceva, DHL Supply Chain, Media Markt DC", note: "Gateway to German market. Cross-dock dominant." },
            { city: "Rotterdam / Ridderkerk", clients: "Geodis, XPO, cold chain, port-adjacent", note: "Year-round demand. Sea freight inbound." },
            { city: "Almere / Schiphol area", clients: "Zalando, Coolblue, DHL Express cargo", note: "E-commerce fulfilment. Competitive housing market." },
          ].map(({ city, clients, note }) => (
            <div key={city} className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-800">{city}</p>
              <p className="text-xs text-brand-700 mt-0.5">{clients}</p>
              <p className="text-xs text-gray-400 mt-1">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agencies */}
      {displayAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Agencies with Warehouse Roles + Housing
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Verified to provide accommodation. Confirm current availability directly.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {displayAgencies.slice(0, 8).map((a) => (
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
            → All agencies with housing →
          </Link>
        </section>
      )}

      {/* Related */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Related Pages</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/warehouse-work-netherlands", "Warehouse work Netherlands: full guide"],
            ["/work-in-netherlands-with-accommodation", "All work + accommodation options"],
            ["/agency-housing-netherlands", "How agency housing works"],
            ["/real-salary-netherlands-agency-work", "Real salary breakdown"],
            ["/tools/accommodation-costs", "Housing cost calculator"],
            ["/warehouse-jobs-with-accommodation", "Warehouse job listings with housing"],
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
