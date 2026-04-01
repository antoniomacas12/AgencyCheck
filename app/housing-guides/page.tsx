import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Agency Housing Guides Netherlands 2026 — SNF, Costs & Rights | AgencyCheck",
  description:
    "All guides on agency housing in the Netherlands. SNF certification, maximum deductions, what shared accommodation looks like, your rights, and which agencies provide the best housing.",
  alternates: { canonical: "https://agencycheck.io/housing-guides" },
  openGraph: {
    title: "Agency Housing Guides Netherlands 2026",
    description: "SNF rules, costs, your rights as a tenant-worker, and how to compare agencies on housing quality.",
  },
};

const housingCount = ALL_AGENCIES.filter((a) => a.housing === "YES").length;

const HOUSING_GUIDES = [
  {
    href: "/agency-housing-netherlands",
    title: "Agency Housing in the Netherlands: Costs, Standards and Rights",
    desc: "The complete guide. SNF certification explained, €113.50/week deduction cap, what shared accommodation looks like, and how to complain when standards are not met.",
    badge: "Essential",
    badgeColor: "green",
  },
  {
    href: "/guides/netherlands-agency-housing-conditions-rights",
    title: "Netherlands Agency Housing Conditions and Worker Rights",
    desc: "Detailed breakdown of what the SNF standard requires, occupancy limits, maintenance obligations, and the formal complaints pathway.",
    badge: "Rights",
    badgeColor: "brand",
  },
  {
    href: "/work-in-netherlands-with-accommodation",
    title: "Work in the Netherlands with Accommodation — Full Guide",
    desc: "How work + housing packages are structured, which job sectors offer them, and what to check before accepting.",
    badge: "Packages",
    badgeColor: "amber",
  },
  {
    href: "/temporary-work-netherlands-accommodation",
    title: "Temporary Work with Accommodation: How It Works",
    desc: "Phase A contract specifics for workers on temporary + housing arrangements. Budget breakdown and what happens when work ends.",
    badge: "Temp work",
    badgeColor: "gray",
  },
  {
    href: "/warehouse-jobs-netherlands-with-accommodation",
    title: "Warehouse Jobs Netherlands with Accommodation",
    desc: "Logistics-specific housing packages. Which agencies provide accommodation near the main Dutch distribution hubs.",
    badge: "Warehouse",
    badgeColor: "blue",
  },
  {
    href: "/warehouse-jobs-with-accommodation",
    title: "Warehouse Job Listings with Housing Included",
    desc: "Live warehouse vacancies where accommodation is part of the package. Filter by city and agency.",
    badge: "Listings",
    badgeColor: "teal",
  },
  {
    href: "/production-jobs-with-accommodation",
    title: "Production Jobs with Accommodation",
    desc: "Food production and manufacturing roles that include housing, common in Noord-Brabant and Limburg.",
    badge: "Production",
    badgeColor: "orange",
  },
  {
    href: "/greenhouse-jobs-with-accommodation",
    title: "Greenhouse Jobs with Accommodation",
    desc: "Agricultural and horticulture work in the Westland and Venlo greenhouse clusters. Seasonal availability and housing.",
    badge: "Agriculture",
    badgeColor: "green",
  },
];

const COLOR_MAP: Record<string, string> = {
  green: "bg-green-50 text-green-700 border-green-100",
  brand: "bg-brand-50 text-brand-700 border-brand-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  teal: "bg-teal-50 text-teal-700 border-teal-100",
  orange: "bg-orange-50 text-orange-700 border-orange-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
  gray: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function HousingGuidesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">Housing Guides</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-3 py-1 font-medium">
            SNF max €113.50/week · {housingCount} agencies with confirmed housing
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Agency Housing Guides for the Netherlands
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          Agency housing is the mechanism that makes working in the Netherlands from abroad
          practically possible for most new arrivals — and the mechanism through which the
          most avoidable financial surprises happen. These guides cover the legal framework,
          what accommodation actually looks like, how to check whether you&apos;re paying a
          fair rate, and what to do when the housing does not meet the standard you paid for.
        </p>
      </div>

      {/* Key facts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Max deduction (SNF)", value: "€113.50/wk" },
          { label: "Agencies with housing", value: `${housingCount} verified` },
          { label: "Typical actual cost", value: "€85–€110/wk" },
          { label: "SNF max/month", value: "≈€491" },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-lg font-extrabold text-green-700 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Guide list */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Housing Guides</h2>
        <div className="space-y-3">
          {HOUSING_GUIDES.map(({ href, title, desc, badge, badgeColor }) => (
            <Link
              key={href}
              href={href}
              className="card p-5 hover:shadow-md hover:border-brand-100 transition-all flex items-start gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${COLOR_MAP[badgeColor]}`}>
                    {badge}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{title}</p>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{desc}</p>
              </div>
              <span className="text-gray-300 text-xl shrink-0">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SNF quick facts */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">SNF Housing: Key Rules at a Glance</h2>
        <div className="space-y-2">
          {[
            ["Maximum deduction (2026)", "€113.50 per week — regardless of occupancy or room size"],
            ["Minimum room space", "At least 10m² per person for permanent accommodation"],
            ["Occupancy per room", "Max 2 workers in newer properties; older stock may differ"],
            ["Notice to leave", "Minimum 4 weeks in most housing contracts"],
            ["Complaints channel", "Report to SNF directly if standards are not met (snf.nl)"],
            ["ABU CAO requirement", "ABU-registered agencies must use SNF-certified accommodation"],
          ].map(([rule, detail]) => (
            <div key={rule as string} className="flex gap-3 items-start text-sm">
              <span className="text-green-500 shrink-0 mt-0.5">✓</span>
              <div>
                <span className="font-semibold text-gray-800">{rule}: </span>
                <span className="text-gray-500">{detail}</span>
              </div>
            </div>
          ))}
        </div>
        <Link href="/agency-housing-netherlands" className="inline-block mt-4 text-sm font-medium text-brand-700 hover:text-brand-800">
          → Full agency housing guide →
        </Link>
      </div>

      {/* Agencies with housing */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Find an Agency with Housing</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/agencies-with-housing", `All ${housingCount} agencies with confirmed housing`],
            ["/best-agencies-netherlands-for-foreigners", "Best agencies for foreign workers"],
            ["/best-work-agencies-netherlands", "Best work agencies overall"],
            ["/salary-guides", "Salary guides: what you keep after deductions"],
            ["/tools/accommodation-costs", "Calculate housing cost impact on your pay"],
            ["/tools/payslip-checker", "Verify housing deductions on your payslip"],
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
