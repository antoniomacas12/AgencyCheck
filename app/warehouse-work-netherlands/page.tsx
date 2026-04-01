import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Warehouse Work in the Netherlands 2026 — Pay, Agencies, Cities | AgencyCheck",
  description:
    "Everything about warehouse work in the Netherlands. Pay rates from €14.71/hr, top cities (Tilburg, Venlo, Rotterdam), which agencies to use, and what the work actually involves.",
  alternates: { canonical: "https://agencycheck.io/warehouse-work-netherlands" },
  openGraph: {
    title: "Warehouse Work in the Netherlands 2026",
    description: "Pay rates, top cities, best agencies, and what warehouse work actually involves in the Netherlands.",
  },
};

const warehouseAgencies = ALL_AGENCIES.filter((a) =>
  a.jobFocus?.some((j) => ["warehouse-worker", "order-picker", "forklift-driver", "reach-truck-driver"].includes(j))
  && a.transparencyScore >= 40
).sort((a, b) => b.transparencyScore - a.transparencyScore).slice(0, 10);

export default function WarehouseWorkNetherlandsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">Warehouse Work Netherlands</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 font-medium">
            €14.71–€17.50/hr · High demand year-round
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Warehouse Work in the Netherlands: Pay, Agencies, and What to Expect
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          The Netherlands is one of Europe&apos;s largest logistics hubs, with major distribution
          centres for Amazon, Bol.com, DHL, Zalando, and dozens of food and retail brands
          operating year-round. Warehouse work is the most accessible entry point into the
          Dutch labour market — no Dutch language required, no prior experience for many roles,
          and placement through an agency can happen within days.
        </p>
      </div>

      {/* Types of warehouse roles */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Types of Warehouse Roles in the Netherlands</h2>
        <div className="space-y-3">
          {[
            { role: "Order Picker / Magazijnmedewerker", pay: "€14.71–€15.50/hr", desc: "Most common entry-level role. Picking orders from shelves, scanning, packing. Physical but no certification required." },
            { role: "Forklift Operator / Heftruckchauffeur", pay: "€15.50–€17.50/hr", desc: "Requires a valid forklift certificate (VCA or equivalent). Higher pay, better scheduling." },
            { role: "Reach Truck Operator", pay: "€15.50–€17.00/hr", desc: "Specialist high-racking forklift. Certificate required. Less available than counterbalance." },
            { role: "Inbound / Receiving", pay: "€14.71–€15.50/hr", desc: "Unloading trucks, booking in stock, checking delivery notes. More varied work than picking." },
            { role: "Outbound / Despatch", pay: "€14.71–€15.50/hr", desc: "Loading trucks, checking orders before departure. Physical, time-pressured on departure runs." },
            { role: "Quality Control / Checker", pay: "€15.00–€16.50/hr", desc: "Inspecting products, logging defects, issuing paperwork. Often requires basic Dutch or English literacy." },
          ].map(({ role, pay, desc }) => (
            <div key={role} className="flex gap-3 items-start bg-gray-50 rounded-xl p-4">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{role}</p>
                <p className="text-xs font-semibold text-brand-700 mt-0.5">{pay}</p>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cities */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Where Warehouse Work Is Concentrated</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Warehouse jobs in the Netherlands are not evenly distributed. The bulk of vacancies
          are concentrated along two logistics corridors:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { area: "Tilburg – Waalwijk – Breda", desc: "The A58/A27 corridor. Amazon, Rhenus, Kuehne+Nagel, Ingram Micro. Largest concentration of agency housing in the country." },
            { area: "Venlo – Roermond", desc: "Gateway to Germany. Amazon, Ceva, CEVA Logistics, DSV. High demand for multilingual workers." },
            { area: "Rotterdam – Barendrecht – Ridderkerk", desc: "Port-adjacent distribution. Cold chain, food wholesale, port logistics. Year-round demand." },
            { area: "Eindhoven – Helmond", desc: "Consumer electronics supply chain (Philips, ASML). More quality control and technical roles available." },
            { area: "Amsterdam – Schiphol – Almere", desc: "E-commerce fulfilment, courier sorting, cargo. Competitive labour market; housing more expensive." },
            { area: "Utrecht – Nieuwegein – IJsselstein", desc: "Central Netherlands. Diverse client base. Good public transport links reduce need for agency housing." },
          ].map(({ area, desc }) => (
            <div key={area} className="bg-gray-50 rounded-xl p-3">
              <p className="font-semibold text-gray-800">{area}</p>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Salary reality */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Salary Reality: Day Shift vs Night Shift</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          At WML (€14.71/hr), the difference between a day-shift and night-shift schedule
          is significant over a month:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Day shift (06:00–14:00 or 07:00–15:30)", gross_weekly: "€588", net_weekly: "≈€345", net_after_housing: "≈€230–€250", premium: "None" },
            { label: "Night shift (22:00–06:00, ABU +22%)", gross_weekly: "≈€717", net_weekly: "≈€440", net_after_housing: "≈€325–€345", premium: "+22%" },
          ].map(({ label, gross_weekly, net_weekly, net_after_housing, premium }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-800 mb-3">{label}</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Premium</span><span className="font-medium">{premium}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Gross/week</span><span className="font-medium">{gross_weekly}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Net/week</span><span className="font-medium text-green-700">{net_weekly}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">After housing (€100)</span><span className="font-bold text-brand-700">{net_after_housing}</span></div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/tools/real-income-calculator" className="inline-block mt-3 text-sm text-brand-700 font-medium hover:text-brand-800">
          → Calculate your exact net weekly income →
        </Link>
      </div>

      {/* Agencies */}
      {warehouseAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Agencies That Place Warehouse Workers</h2>
          <p className="text-gray-500 text-sm mb-4">
            Sorted by transparency score — the agencies where contract terms and housing
            conditions are most openly documented.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {warehouseAgencies.map((a) => (
              <Link key={a.id} href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all">
                <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">
                    {a.transparencyScore}/100
                  </span>
                  {a.housing === "YES" && (
                    <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5">🏠</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Related Pages</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/warehouse-jobs-netherlands-with-accommodation", "Warehouse jobs with housing included"],
            ["/warehouse-jobs-with-accommodation", "Warehouse jobs + accommodation"],
            ["/real-salary-netherlands-agency-work", "Real salary breakdown for agency work"],
            ["/jobs-in-netherlands-for-foreigners", "Jobs for foreign workers"],
            ["/tools/real-income-calculator", "Net pay calculator"],
            ["/agencies", "Browse all 151 agencies"],
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
