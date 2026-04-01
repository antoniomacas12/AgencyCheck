import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Salary Guides for the Netherlands 2026 — Agency Work & Real Income | AgencyCheck",
  description:
    "All salary guides for agency workers in the Netherlands. Real take-home pay, shift premiums, housing deductions, city comparisons, and payslip explained. 2026 WML data.",
  alternates: { canonical: "https://agencycheck.io/salary-guides" },
  openGraph: {
    title: "Salary Guides Netherlands 2026 — Real Agency Worker Income",
    description: "Real take-home pay, shift premiums, city salary comparisons, and payslip explainers. All based on 2026 Dutch labour data.",
  },
};

const SALARY_GUIDES = [
  {
    href: "/real-salary-netherlands-agency-work",
    title: "Real Salary for Agency Work in the Netherlands",
    desc: "Complete gross-to-net breakdown. WML, loonheffing, ZVW, shift premiums, housing deductions. What you actually keep each week.",
    badge: "Essential",
    badgeColor: "brand",
  },
  {
    href: "/guides/real-salary-netherlands-warehouse-workers",
    title: "Real Salary: Netherlands Warehouse Workers",
    desc: "Warehouse-specific pay rates, overtime patterns, and what a forklift operator earns versus an order picker.",
    badge: "Warehouse",
    badgeColor: "blue",
  },
  {
    href: "/guides/real-salary-netherlands",
    title: "Real Salary Netherlands — All Job Types",
    desc: "Salary benchmarks across logistics, food processing, construction, and technical roles. Includes 2026 minimum wage figures.",
    badge: "All sectors",
    badgeColor: "gray",
  },
  {
    href: "/guides/hidden-costs-netherlands",
    title: "Hidden Costs: What Agencies Deduct and What Is Legal",
    desc: "Housing, transport, admin fees, health insurance — what agencies can and cannot take from your gross pay.",
    badge: "Deductions",
    badgeColor: "amber",
  },
  {
    href: "/guides/dutch-payslip-explained-agency-workers",
    title: "Dutch Payslip Explained for Agency Workers",
    desc: "How to read your loonstrook line by line. Every entry decoded in plain language.",
    badge: "Payslip",
    badgeColor: "green",
  },
  {
    href: "/guides/working-in-netherlands-salary-after-rent",
    title: "Salary After Rent by City in the Netherlands",
    desc: "What you keep after paying for accommodation in Amsterdam, Rotterdam, Tilburg, Venlo, and 10 other cities.",
    badge: "Cities",
    badgeColor: "purple",
  },
  {
    href: "/real-salary-netherlands-after-rent",
    title: "Netherlands Salary After Rent — 2026 Reality Check",
    desc: "Live salary-after-rent calculations across all major Dutch cities. Updated with 2026 rent and wage data.",
    badge: "Interactive",
    badgeColor: "teal",
  },
  {
    href: "/guides/is-working-in-netherlands-worth-it",
    title: "Is Working in the Netherlands Worth It?",
    desc: "An honest look at income, costs, housing quality, and quality of life compared to source countries.",
    badge: "Analysis",
    badgeColor: "gray",
  },
];

const COLOR_MAP: Record<string, string> = {
  brand: "bg-brand-50 text-brand-700 border-brand-100",
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  green: "bg-green-50 text-green-700 border-green-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
  teal: "bg-teal-50 text-teal-700 border-teal-100",
  gray: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function SalaryGuidesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">Salary Guides</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 font-medium">
            WML €14.71/hr · 2026 figures throughout
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Salary Guides for the Netherlands
        </h1>
        <p className="text-gray-600 leading-relaxed text-lg">
          Every salary guide on AgencyCheck is built on real Dutch labour data: the 2026
          minimum wage, the ABU CAO shift premium schedule, official loonheffing rates, and
          the SNF housing deduction cap. Nothing is invented or estimated from elsewhere.
          These guides exist because the gap between what agencies advertise and what workers
          actually keep is consistently larger than most people expect.
        </p>
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "WML 2026", value: "€14.71/hr" },
          { label: "Net at WML (40h)", value: "≈€345/wk" },
          { label: "Night shift net (WML)", value: "≈€440/wk" },
          { label: "Housing max (SNF)", value: "€113.50/wk" },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-lg font-extrabold text-brand-700 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Guide list */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Salary Guides</h2>
        <div className="space-y-3">
          {SALARY_GUIDES.map(({ href, title, desc, badge, badgeColor }) => (
            <Link
              key={href}
              href={href}
              className="card p-5 hover:shadow-md hover:border-brand-100 transition-all flex items-start gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
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

      {/* Tools */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Salary Calculators</h2>
        <p className="text-gray-500 text-sm mb-4">
          Use these tools to calculate your personal situation based on your actual hours,
          shift type, and housing deduction.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { href: "/tools/real-income-calculator", title: "Real Income Calculator", desc: "Net weekly pay after all deductions. Input your hours, rate, and shift type." },
            { href: "/tools/salary-calculator", title: "Salary Calculator", desc: "Monthly gross-to-net. Includes Dutch tax brackets for 2026." },
            { href: "/tools/payslip-checker", title: "Payslip Checker", desc: "Upload your loonstrook and verify every line against the legal standards." },
            { href: "/tools/accommodation-costs", title: "Accommodation Costs Tool", desc: "See exactly how housing deduction affects your monthly disposable income." },
          ].map(({ href, title, desc }) => (
            <Link key={href} href={href} className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-brand-100 transition-colors">
              <p className="text-sm font-semibold text-gray-800">{title}</p>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Agency pages */}
      <div className="card p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Compare Agency Salaries</h2>
        <p className="text-xs text-gray-500 mb-3">
          Each agency page on AgencyCheck includes a salary breakdown specific to that agency&apos;s
          sector, CAO, and typical shift pattern.
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/agencies", "Browse all 151 verified agencies"],
            ["/best-work-agencies-netherlands", "Best agencies ranked by transparency"],
            ["/agencies-with-housing", "Agencies with housing (deduction included)"],
            ["/housing-guides", "Housing guides and cost explainers"],
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
