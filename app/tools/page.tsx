import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema, collectionPageSchema, softwareApplicationSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Worker Tools for Jobs in the Netherlands — AgencyCheck",
  description:
    "Practical tools to calculate real salary, housing costs, and weekly earnings when working through staffing agencies in the Netherlands. Free, no account required.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Worker Tools — Calculate Your Real Income in the Netherlands",
    description:
      "Weekly salary calculator, accommodation cost calculator, payslip checker, and shift tracker. Built for flex workers at Dutch staffing agencies.",
  },
};

// ── Tool definitions ──────────────────────────────────────────────────────────

const TOOLS = [
  {
    href:        "/tools/salary-calculator",
    icon:        "💶",
    title:       "Weekly Salary Calculator",
    tagline:     "Your real weekly income after all deductions",
    description:
      "Enter your hourly wage, hours per week, and your weekly costs (housing, insurance, transport) to see exactly how much money you actually take home each week. Many workers are surprised by the difference between their gross pay and real income.",
    inputs:      ["Hourly wage", "Hours per week", "Housing cost", "Insurance cost", "Transport cost"],
    outputs:     ["Real weekly income after all deductions"],
    badge:       "Most used",
    highlight:   true,
  },
  {
    href:        "/tools/accommodation-costs",
    icon:        "🏠",
    title:       "Accommodation Cost Calculator",
    tagline:     "See how housing affects your real income",
    description:
      "If your agency provides housing, weekly rent is deducted straight from your salary. Add insurance and transport costs to see how much spendable income you actually have. Essential before accepting a job with accommodation.",
    inputs:      ["Weekly rent / housing deduction", "Insurance cost", "Transport cost"],
    outputs:     ["Remaining weekly income", "Breakdown of all deductions"],
    badge:       null,
    highlight:   false,
  },
  {
    href:        "/tools/payslip-checker",
    icon:        "🧾",
    title:       "Payslip Checker",
    tagline:     "Check if your payslip is correct",
    description:
      "Enter your hours worked, hourly wage, gross salary, and deductions to see what your expected pay should be. The tool highlights unusual numbers — like if deductions look too high or your gross doesn't match your hours. Includes a 12-point verification checklist.",
    inputs:      ["Hours worked", "Hourly wage", "Gross salary on payslip", "Deductions listed"],
    outputs:     ["Estimated expected pay", "Warning if numbers look unusual"],
    badge:       null,
    highlight:   false,
  },
  {
    href:        "/tools/shift-tracker",
    icon:        "🕐",
    title:       "Work Hours Tracker",
    tagline:     "Log your hours and verify your pay",
    description:
      "Record your working hours for each day of the week. The tracker shows your weekly total hours and estimated weekly pay so you can verify what your payslip should say. If the numbers don't match what you receive, you have grounds to ask questions.",
    inputs:      ["Hours per day (Mon–Sun)", "Hourly rate"],
    outputs:     ["Weekly total hours", "Estimated weekly pay"],
    badge:       null,
    highlight:   false,
  },
];

// ── Additional tools ──────────────────────────────────────────────────────────

const MORE_TOOLS = [
  {
    href:        "/tools/real-income-calculator",
    icon:        "🧮",
    title:       "Compare Two Agency Offers",
    description: "Put two job offers side by side and factor in housing and transport to see which deal actually leaves you with more money.",
    badge:       "Popular",
  },
  {
    href:        "/tools/real-salary-calculator",
    icon:        "📊",
    title:       "Real Salary Calculator",
    description: "Full calculation including Dutch income tax (loonheffing 2026), overtime, and vakantiegeld. See your true take-home after everything.",
    badge:       null,
  },
  {
    href:        "/compare-agencies",
    icon:        "⚖️",
    title:       "Agency Comparison",
    description: "Compare up to 3 agencies on transparency score, housing, salary, and worker reports.",
    badge:       null,
  },
];

// ── Why it matters ────────────────────────────────────────────────────────────

const WHY_ITEMS = [
  {
    icon:  "⚠️",
    title: "Gross ≠ what you receive",
    body:  "Dutch income tax, agency housing deductions, transport costs, and insurance can reduce your gross pay by 35–50%. Many workers only realise this on their first payslip.",
  },
  {
    icon:  "🏠",
    title: "Agency housing changes everything",
    body:  "If your agency provides accommodation, they deduct €80–115 per week directly from your salary. This changes which agency offer is actually better — a lower gross rate with free housing can beat a higher rate where you pay rent separately.",
  },
  {
    icon:  "📄",
    title: "Payslip errors are common",
    body:  "Missing overtime, incorrect hours, undeclared deductions — these are frequently reported by flex workers. Checking your payslip every month protects you from losing hundreds of euros over a contract.",
  },
  {
    icon:  "⏱️",
    title: "Track your own hours",
    body:  "Agencies may record hours differently from what you worked. Keeping your own shift log gives you evidence if your payslip is wrong and helps you catch errors before pay day.",
  },
];

export default function ToolsPage() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",  url: "/" },
    { name: "Tools", url: "/tools" },
  ]);
  const listSchema  = collectionPageSchema({
    name:        "Worker Tools for Jobs in the Netherlands — AgencyCheck",
    description: "Free salary calculators, accommodation cost tools, payslip checker, and shift tracker for flex workers at Dutch employment agencies.",
    url:         "/tools",
    itemCount:   TOOLS.length + MORE_TOOLS.length,
  });
  const appSchema   = softwareApplicationSchema({
    name:                "AgencyCheck Worker Tools",
    description:         "Free online tools for calculating real salary, housing costs, and weekly earnings when working through staffing agencies in the Netherlands.",
    url:                 "https://agencycheck.io/tools",
    applicationCategory: "FinanceApplication",
    operatingSystem:     "Web",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema)  }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema)   }} />

      {/* ── Header ── */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Worker Tools for Jobs in the Netherlands
        </h1>
        <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
          Practical tools to calculate real salary, housing costs, and weekly earnings when working through
          staffing agencies. Free to use. No account required. Data never leaves your device.
        </p>
      </div>

      {/* ── 4 core tools ── */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-gray-800 mb-5">Core Worker Tools</h2>
        <div className="space-y-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`block card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group ${
                tool.highlight ? "border-brand-200 bg-gradient-to-r from-brand-50 to-white" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{tool.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                      {tool.title}
                    </h3>
                    {tool.badge && (
                      <span className="text-[10px] font-semibold bg-brand-600 text-white rounded-full px-2 py-0.5">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-600 font-medium mb-2">{tool.tagline}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{tool.description}</p>

                  {/* Inputs / Outputs */}
                  <div className="flex flex-wrap gap-6 text-xs text-gray-500">
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Inputs</p>
                      <ul className="space-y-0.5">
                        {tool.inputs.map((i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="text-gray-300">→</span> {i}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Output</p>
                      <ul className="space-y-0.5">
                        {tool.outputs.map((o) => (
                          <li key={o} className="flex items-center gap-1">
                            <span className="text-green-400">✓</span> {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-brand-600 font-semibold shrink-0 group-hover:underline">
                  Open →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why these tools matter ── */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-gray-800 mb-5">Why Your Real Income Is Always Lower Than Your Gross Pay</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className="card p-4">
              <p className="text-xl mb-2">{item.icon}</p>
              <p className="text-sm font-bold text-gray-900 mb-1">{item.title}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── More tools ── */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-gray-800 mb-4">More Tools</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {MORE_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="card p-4 hover:shadow-md hover:border-brand-100 transition-all hover:-translate-y-0.5 block group"
            >
              <span className="text-2xl block mb-2">{tool.icon}</span>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {tool.title}
                </p>
                {tool.badge && (
                  <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5">
                    {tool.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
              <p className="text-xs text-brand-600 font-medium mt-2">Open tool →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Quick links ── */}
      <section className="mb-8">
        <div className="card p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Related resources
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { href: "/agencies-with-housing",           icon: "🏠", label: "Find agencies with housing" },
              { href: "/salary/warehouse-worker-netherlands", icon: "📈", label: "Salary data by job type" },
              { href: "/agencies",                        icon: "🔍", label: "Browse 150+ verified agencies" },
              { href: "/tools/payslip-checker#resources", icon: "🛡️", label: "Worker rights resources" },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 hover:underline"
              >
                <span>{r.icon}</span> {r.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Legal note ── */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500 text-center">
        All tools are for informational purposes only. Calculations are estimates based on 2026 Dutch tax brackets
        and do not constitute legal or financial advice. Always verify figures with your employer or a tax adviser.
        Data never leaves your browser.
      </div>
    </div>
  );
}
