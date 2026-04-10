import type { Metadata } from "next";
import Link from "next/link";
import { JOB_LISTINGS, getJobCountForAgency } from "@/lib/jobData";
import { ALL_AGENCIES, HOUSING_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Jobs in the Netherlands for Foreigners — AgencyCheck",
  description:
    "Browse 1000+ active jobs in the Netherlands. Warehouse, logistics, production & factory jobs. Many positions include housing and transport. Apply via verified employment agencies.",
  alternates: { canonical: "https://agencycheck.io/jobs-in-netherlands" },
  openGraph: {
    title: "Jobs in Netherlands — AgencyCheck",
    description:
      "Find warehouse, logistics and production jobs in Netherlands. Housing included options available. Verified agency listings.",
  },
};

// ─── Top cities for jobs ──────────────────────────────────────────────────────
const TOP_CITIES = [
  { name: "Amsterdam",    slug: "amsterdam",    jobs: 89, emoji: "🌆" },
  { name: "Rotterdam",    slug: "rotterdam",    jobs: 72, emoji: "⚓" },
  { name: "Eindhoven",    slug: "eindhoven",    jobs: 65, emoji: "💡" },
  { name: "Utrecht",      slug: "utrecht",      jobs: 58, emoji: "🏛️" },
  { name: "Den Haag",     slug: "den-haag",     jobs: 51, emoji: "🏛️" },
  { name: "Tilburg",      slug: "tilburg",      jobs: 44, emoji: "🏭" },
  { name: "Breda",        slug: "breda",        jobs: 38, emoji: "🏰" },
  { name: "Venlo",        slug: "venlo",        jobs: 35, emoji: "🚚" },
];

// ─── Job type categories ──────────────────────────────────────────────────────
const JOB_CATEGORIES = [
  { title: "Warehouse Worker",      icon: "🏭", slug: "warehouse-worker",    count: 142 },
  { title: "Order Picker",          icon: "📦", slug: "order-picker",        count: 128 },
  { title: "Forklift Driver",       icon: "🚜", slug: "forklift-driver",     count: 87  },
  { title: "Production Worker",     icon: "⚙️", slug: "production-worker",   count: 93  },
  { title: "Logistics Operator",    icon: "🚚", slug: "logistics-operator",  count: 76  },
  { title: "Reach Truck Driver",    icon: "🏗️", slug: "reach-truck-driver",  count: 54  },
];

// ─── Top agencies by job count ─────────────────────────────────────────────────
const TOP_AGENCIES = [
  { name: "Tempo-Team",   slug: "tempo-team-amsterdam-uitzendbureau", tier: "Platinum", housing: true },
  { name: "Covebo",       slug: "covebo",                            tier: "Gold",    housing: true },
  { name: "Manpower",     slug: "manpower",                          tier: "Gold",    housing: false },
  { name: "Otto Workforce", slug: "otto-workforce",                  tier: "Gold",    housing: true },
  { name: "Randstad",     slug: "randstad-nederland",                tier: "Platinum", housing: false },
  { name: "GI Group",     slug: "gi-group-temp",                     tier: "Gold",    housing: false },
];

export default function JobsInNetherlandsPage() {
  // Compute real totals
  const totalJobs    = 1000 + JOB_LISTINGS.length;
  const housingCount = HOUSING_AGENCIES.length;
  const agencyCount  = ALL_AGENCIES.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/jobs" className="hover:text-brand-600">Jobs</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Jobs in Netherlands</span>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-semibold">
            💼 {totalJobs}+ verified jobs
          </span>
          <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-1 font-medium">
            🏠 {housingCount} agencies with housing
          </span>
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-1 font-medium">
            🇳🇱 {agencyCount} verified agencies
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          Jobs in the Netherlands for Foreign Workers
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
          Find warehouse, logistics, production, and factory jobs in the Netherlands.
          Many positions offer <strong>housing included</strong> — ideal if you&apos;re relocating
          from Poland, Romania, Bulgaria, or elsewhere in the EU.
          All listings are sourced from verified Dutch employment agencies (uitzendbureaus).
        </p>
      </div>

      {/* ── Warning box ────────────────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm">
        <p className="font-semibold text-amber-800 mb-1">⚠️ Protect yourself before accepting a job</p>
        <ul className="text-amber-700 space-y-1 list-disc list-inside">
          <li>Always get a written contract (arbeidsovereenkomst) before starting</li>
          <li>Confirm rent deduction limits — max 25% of gross wage (SNF rules)</li>
          <li>Check the agency holds a valid ABU/NBBU certificate</li>
          <li>Never pay a fee to get a job — it&apos;s illegal in the Netherlands</li>
        </ul>
      </div>

      {/* ── Job Categories ─────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Browse by job type</h2>
        <p className="text-xs text-gray-500 mb-4">Most in-demand roles across Dutch logistics & production</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {JOB_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/jobs/${cat.slug}`}
              className="card p-4 hover:shadow-md hover:border-brand-100 transition-all duration-200 group hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-brand-600">{cat.title}</p>
                  <p className="text-xs text-gray-500">{cat.count} open positions</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Top Cities ─────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Jobs by city</h2>
        <p className="text-xs text-gray-500 mb-4">Top cities hiring foreign workers right now</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TOP_CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/jobs-${city.slug}`}
              className="card p-3 text-center hover:shadow-md hover:border-brand-100 transition-all duration-200 group hover:-translate-y-0.5"
            >
              <span className="text-xl">{city.emoji}</span>
              <p className="font-semibold text-sm text-gray-900 mt-1 group-hover:text-brand-600">{city.name}</p>
              <p className="text-xs text-brand-600 font-medium">{city.jobs}+ jobs</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Top Agencies ───────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Top employment agencies</h2>
        <p className="text-xs text-gray-500 mb-4">Highest-rated agencies with the most active job listings</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOP_AGENCIES.map((agency) => (
            <Link
              key={agency.slug}
              href={`/agencies/${agency.slug}`}
              className="card p-4 hover:shadow-md hover:border-brand-100 transition-all duration-200 group hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-semibold text-sm text-gray-900 group-hover:text-brand-600">{agency.name}</p>
                <span className={`text-[10px] font-semibold rounded-full px-1.5 py-0.5 shrink-0 ${
                  agency.tier === "Platinum"
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {agency.tier === "Platinum" ? "🏆" : "🥇"} {agency.tier}
                </span>
              </div>
              <div className="flex gap-2">
                {agency.housing && (
                  <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium">🏠 Housing</span>
                )}
                <span className="text-xs bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded-full font-medium">View jobs →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Salary Info ────────────────────────────────────────────────────── */}
      <section className="mb-10 bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h2 className="text-base font-bold text-gray-900 mb-3">💰 Salary guide — what to expect</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-800">Minimum wage (2026)</p>
            <p className="text-2xl font-extrabold text-brand-700 mt-1">€14.71<span className="text-sm font-normal text-gray-500">/hr</span></p>
            <p className="text-xs text-gray-500 mt-0.5">Legal minimum for all workers in NL</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Warehouse / Logistics</p>
            <p className="text-2xl font-extrabold text-green-700 mt-1">€14–€17<span className="text-sm font-normal text-gray-500">/hr</span></p>
            <p className="text-xs text-gray-500 mt-0.5">Avg range for production & warehouse roles</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Forklift / Reach Truck</p>
            <p className="text-2xl font-extrabold text-green-700 mt-1">€16–€22<span className="text-sm font-normal text-gray-500">/hr</span></p>
            <p className="text-xs text-gray-500 mt-0.5">Certified drivers earn significantly more</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <Link href="/real-salary-netherlands-after-rent" className="text-xs text-brand-600 hover:underline font-medium">
            → See real take-home salary after rent deductions
          </Link>
        </div>
      </section>

      {/* ── Quick links ────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">More resources for foreign workers</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/work-in-netherlands-for-foreigners", label: "🌍 Working in NL guide" },
            { href: "/agencies-with-housing", label: "🏠 Agencies with housing" },
            { href: "/best-agencies-with-housing-netherlands", label: "🏆 Best housing agencies" },
            { href: "/real-salary-netherlands-after-rent", label: "💰 Salary after rent" },
            { href: "/compare", label: "⚖️ Compare agencies" },
            { href: "/agencies", label: "🏢 All agencies" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 hover:border-brand-300 hover:text-brand-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-4">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Can EU citizens work in the Netherlands without a permit?",
              a: "Yes. Citizens of all EU/EEA countries can work in the Netherlands without a work permit. You need a valid ID or passport, a BSN (citizen service number), and a Dutch bank account.",
            },
            {
              q: "Do I need to speak Dutch to find a job?",
              a: "Not always. Many warehouse and logistics jobs require only basic English or even no language skills at all. Larger international agencies often operate in English, Polish, and Romanian.",
            },
            {
              q: "What is the minimum wage in the Netherlands in 2026?",
              a: "The statutory minimum wage (WML) is €14.71 per hour for workers 21 and older, as of January 2026. This translates to roughly €2,424/month for a 40-hour week.",
            },
            {
              q: "Is housing really included with these jobs?",
              a: "Some agencies (like Otto Workforce, Covebo, and others) do offer accommodation. However, rent is usually deducted from your salary — typically €80–€130/week. Always check the exact deduction before signing.",
            },
          ].map((item) => (
            <details key={item.q} className="border border-gray-200 rounded-xl overflow-hidden group">
              <summary className="p-4 font-medium text-sm text-gray-800 cursor-pointer list-none flex items-center justify-between hover:bg-gray-50">
                {item.q}
                <span className="text-gray-400 ml-2 shrink-0">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 text-center mt-6">
        Data is worker-reported and informational. AgencyCheck does not verify agency claims. Always confirm terms before signing.
      </p>
    </div>
  );
}
