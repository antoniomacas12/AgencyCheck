import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Jobs in the Netherlands for Foreigners 2026 — Where to Start | AgencyCheck",
  description:
    "How to find work in the Netherlands as a foreigner in 2026. Most accessible jobs, agencies that work with non-Dutch speakers, BSN registration, real salary data, and housing options.",
  alternates: { canonical: "https://agencycheck.io/jobs-in-netherlands-for-foreigners" },
  openGraph: {
    title: "Jobs in the Netherlands for Foreigners 2026",
    description:
      "Most accessible jobs, agencies that welcome non-Dutch speakers, housing options, BSN process, and real salary expectations.",
  },
};

const foreignerFriendlyAgencies = ALL_AGENCIES
  .filter((a) => a.housing === "YES" && a.transparencyScore >= 45)
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 8);

export default function JobsNetherlandsForeignersPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">Jobs for Foreigners</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 font-medium">
            No Dutch language required for most roles · 2026 guide
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Jobs in the Netherlands for Foreigners: Where to Start in 2026
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          The Netherlands has one of Europe&apos;s most active labour markets for foreign workers —
          particularly in logistics, food processing, agriculture, and construction. Work
          agencies handle most of the placement, often arranging housing and BSN registration
          alongside the job. This guide covers what to expect, which roles are most accessible,
          and how to compare agencies before committing.
        </p>
      </div>

      {/* Who can work */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Who Can Work in the Netherlands</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex gap-3 items-start">
            <span className="text-green-500 text-lg shrink-0">✓</span>
            <div>
              <p className="font-semibold text-gray-800">EU/EEA citizens</p>
              <p className="mt-0.5">Free to work in the Netherlands without a work permit. You will need a BSN (citizen service number) within four months of arrival. Most work agencies help with this process.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-green-500 text-lg shrink-0">✓</span>
            <div>
              <p className="font-semibold text-gray-800">Ukrainian citizens (Temporary Protection Directive)</p>
              <p className="mt-0.5">Under the current protection framework, Ukrainian nationals can work in the Netherlands without a separate work permit. Check the latest IND guidance as this status is periodically reviewed.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-amber-500 text-lg shrink-0">⚠</span>
            <div>
              <p className="font-semibold text-gray-800">Non-EU citizens</p>
              <p className="mt-0.5">A work permit (TWV) or combined residence + work permit (GVVA) is required. The employer or agency sponsors the permit. This process takes months and limits which agencies will work with you directly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Most accessible jobs */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Most Accessible Jobs — No Dutch Required</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          The following job types have the highest demand and lowest language requirement in
          the Netherlands. Instructions are typically given in English or via demonstration.
          Safety briefings are usually available in Polish, Romanian, or English as standard.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: "📦", title: "Warehouse / Order Picker", pay: "€14.71–€16.00/hr", note: "No experience needed. Physically demanding. Most common entry role." },
            { icon: "🚜", title: "Forklift Operator", pay: "€15.00–€17.50/hr", note: "Requires a valid forklift certificate (recognized EU certs accepted)." },
            { icon: "🍅", title: "Greenhouse / Agriculture", pay: "€14.71–€15.50/hr", note: "Seasonal. Housing often included. Based in Westland, Venlo, and Emmen regions." },
            { icon: "🏭", title: "Food Production / Packaging", pay: "€14.71–€16.00/hr", note: "HACCP hygiene rules apply. Clean environment. Long shifts common." },
            { icon: "🔨", title: "Construction / Assembly", pay: "€15.00–€20.00/hr", note: "Trade certifications valued. BBL/BPV placements available in construction." },
            { icon: "🧽", title: "Cleaning / Facility Services", pay: "€14.71–€15.20/hr", note: "Hospital and office cleaning often has early morning hours." },
          ].map(({ icon, title, pay, note }) => (
            <div key={title} className="card p-4 flex gap-3 items-start">
              <span className="text-2xl shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-900">{title}</p>
                <p className="text-xs text-brand-700 font-medium mt-0.5">{pay}</p>
                <p className="text-xs text-gray-500 mt-1">{note}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/warehouse-jobs-netherlands-with-accommodation" className="inline-block mt-3 text-sm text-brand-700 font-medium hover:text-brand-800">
          → Warehouse jobs with accommodation included →
        </Link>
      </div>

      {/* What you need before you start */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">What You Need Before Your First Shift</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Most work agencies handle the logistics for you — but knowing what to expect avoids
          delays and misunderstandings on arrival.
        </p>
        <ol className="space-y-4 text-sm text-gray-600">
          {[
            {
              step: "BSN (Burgerservicenummer)",
              detail: "Your Dutch tax and social security number. You cannot be paid legally without one. EU workers get this at the local municipality (gemeente) office — bring your passport and proof of address. Many agencies register groups together to speed this up.",
            },
            {
              step: "Dutch bank account",
              detail: "A Dutch IBAN is needed for wage payments. Bunq, Revolut (Dutch IBAN variant), or ABN AMRO Tikkie accounts are the fastest routes for new arrivals. Some agencies front the first week&apos;s wages in cash while your account opens — confirm this in advance.",
            },
            {
              step: "Valid ID",
              detail: "Passport or (for EU citizens) national identity card. The agency keeps a copy. Your ID must be valid for the duration of the placement — check the expiry date.",
            },
            {
              step: "Health insurance",
              detail: "You need Dutch health insurance (zorgverzekering) if you stay more than four months. From month one, the employee ZVW contribution is deducted from your wages (~€176/month in 2026) regardless of whether you have taken out a policy yet.",
            },
          ].map(({ step, detail }, i) => (
            <li key={step} className="flex gap-3 items-start">
              <span className="text-brand-600 font-extrabold text-base shrink-0 w-5">{i + 1}.</span>
              <div>
                <p className="font-semibold text-gray-800">{step}</p>
                <p className="text-gray-500 mt-1">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Cities */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Best Cities for Foreign Workers in the Netherlands</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Job opportunities for foreign workers are concentrated in industrial and logistics
          zones, not city centres. The following areas have the highest agency worker
          populations and the most active agency presence:
        </p>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          {[
            { city: "Tilburg / Waalwijk", role: "Logistics, distribution", why: "Major fulfilment hubs for Amazon, Rhenus, Zalando" },
            { city: "Venlo", role: "Logistics, cross-dock", why: "Germany border crosspoint. High-volume distribution" },
            { city: "Rotterdam", role: "Port, logistics, food", why: "Largest European port. Year-round demand" },
            { city: "Westland", role: "Greenhouse / horticulture", why: "Largest greenhouse area in Europe" },
            { city: "Eindhoven", role: "Tech, food, production", why: "ASML supply chain and Campina/FrieslandCampina" },
            { city: "Breda", role: "Logistics, production", why: "A16 corridor. Growing number of distribution centres" },
          ].map(({ city, role, why }) => (
            <div key={city} className="bg-gray-50 rounded-xl p-3">
              <p className="font-semibold text-gray-800">{city}</p>
              <p className="text-xs text-brand-700 mt-0.5">{role}</p>
              <p className="text-xs text-gray-400 mt-1">{why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real salary */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Real Salary Expectations</h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          The 2026 minimum wage is <strong>€14.71/hr</strong>. After tax and with agency
          housing deducted, the typical foreign worker keeps <strong>€230–€350/week</strong> in
          disposable income. Night and weekend shifts push this higher — a regular night-shift
          rotation at WML adds roughly €100/week net.
        </p>
        <div className="flex gap-3 mt-3">
          <Link href="/real-salary-netherlands-agency-work" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            → Full salary breakdown →
          </Link>
          <Link href="/tools/real-income-calculator" className="text-sm font-medium text-gray-500 hover:text-gray-700">
            → Calculate your take-home
          </Link>
        </div>
      </div>

      {/* Agencies for foreigners */}
      {foreignerFriendlyAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Agencies That Work with Foreign Workers</h2>
          <p className="text-gray-500 text-sm mb-4">
            These agencies have confirmed housing provision (useful for new arrivals) and
            score above 45 on transparency. Most have English-speaking staff and have
            experience placing non-Dutch workers.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {foreignerFriendlyAgencies.map((a) => (
              <Link
                key={a.id}
                href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all"
              >
                <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5">
                    🏠 Housing
                  </span>
                  <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">
                    {a.transparencyScore}/100
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/best-agencies-netherlands-for-foreigners" className="inline-block mt-3 text-sm text-brand-700 font-medium hover:text-brand-800">
            → Best agencies for foreign workers — full comparison →
          </Link>
        </section>
      )}

      {/* Related */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Continue Reading</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/work-agency-netherlands", "How Dutch work agencies operate"],
            ["/agency-housing-netherlands", "Agency housing: costs and rights"],
            ["/work-in-netherlands-with-accommodation", "Work + accommodation packages"],
            ["/real-salary-netherlands-agency-work", "Real salary for agency work"],
            ["/tools/real-income-calculator", "Net pay calculator"],
            ["/agencies", "Browse all verified agencies"],
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
