import type { Metadata } from "next";
import Link from "next/link";
import {
  breadcrumbSchema,
  collectionPageSchema,
  softwareApplicationSchema,
} from "@/lib/schemaMarkup";
import {
  featuredTools,
  toolsByCategory,
  CATEGORY_META,
  TOOLS_REGISTRY,
  type ToolCategory,
} from "@/lib/toolsRegistry";
import { FeaturedToolCard, StandardToolCard } from "@/components/ToolCard";

// ── SEO metadata ──────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Worker Tools for Jobs in the Netherlands — AgencyCheck",
  description:
    "Free salary calculators, rent checker, payslip verifier, and shift tracker for flex workers at Dutch staffing agencies. Calculate your real take-home pay before you sign.",
  alternates: { canonical: "https://agencycheck.io/tools" },
  openGraph: {
    title: "Free Worker Tools — Calculate Your Real Income in the Netherlands",
    description:
      "Job offer comparison, weekly salary calculator, rent checker, payslip verifier, and shift tracker. Built for flex workers at Dutch staffing agencies. No account required.",
  },
};

// ── Why it matters ────────────────────────────────────────────────────────────

const WHY_ITEMS = [
  {
    icon:  "⚠️",
    title: "Gross ≠ what you receive",
    body:  "Dutch income tax, agency housing deductions, transport costs, and insurance can reduce your gross pay by 35–50%. Most workers only realise this on their first payslip — by then, the contract is signed.",
  },
  {
    icon:  "🏠",
    title: "Agency housing changes the maths",
    body:  "If your agency provides accommodation, they deduct €80–115/week from your salary. A lower gross rate with free housing can easily beat a higher rate where you pay rent separately. Run the numbers first.",
  },
  {
    icon:  "📄",
    title: "Payslip errors are common",
    body:  "Missing overtime, incorrect hours, undeclared deductions — these are regularly reported by flex workers. Checking your payslip monthly protects you from losing hundreds of euros over a contract.",
  },
  {
    icon:  "⏱️",
    title: "Track your own hours",
    body:  "Agencies may record hours differently from what you worked. Keeping your own shift log gives you evidence if your payslip is wrong and helps you catch errors before pay day.",
  },
];

// ── Category ordering for "All tools" section ─────────────────────────────────

const CATEGORY_ORDER: ToolCategory[] = ["comparison", "income", "housing", "tracking"];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",  url: "/" },
    { name: "Tools", url: "/tools" },
  ]);
  const listSchema = collectionPageSchema({
    name:        "Worker Tools for Jobs in the Netherlands — AgencyCheck",
    description: "Free salary calculators, accommodation cost tools, payslip checker, and shift tracker for flex workers at Dutch employment agencies.",
    url:         "/tools",
    itemCount:   TOOLS_REGISTRY.length,
  });
  const appSchema = softwareApplicationSchema({
    name:                "AgencyCheck Worker Tools",
    description:         "Free online tools for calculating real salary, housing costs, and weekly earnings when working through staffing agencies in the Netherlands.",
    url:                 "https://agencycheck.io/tools",
    applicationCategory: "FinanceApplication",
    operatingSystem:     "Web",
  });

  const categoryGroups = toolsByCategory();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema)  }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema)   }} />

      {/* ── Hero ── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium">Tools</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Worker Tools for Jobs in the Netherlands
        </h1>
        <p className="text-sm text-gray-600 max-w-2xl leading-relaxed mb-5">
          Calculate your real income before you sign. See exactly what you take home after Dutch taxes,
          housing deductions, and transport. Free. No account required. Data never leaves your browser.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3">
          {[
            { icon: "🔒", label: "Data stays in your browser" },
            { icon: "🆓", label: "Always free" },
            { icon: "📅", label: "2026 tax rules" },
            { icon: "✅", label: "No account needed" },
          ].map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1"
            >
              <span>{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Featured tools (top 3 by conversion rank) ── */}
      <section className="mb-12" aria-labelledby="featured-heading">
        <div className="flex items-baseline justify-between mb-5">
          <h2 id="featured-heading" className="text-base font-bold text-gray-800">
            Most useful right now
          </h2>
          <span className="text-xs text-gray-400">Ordered by impact</span>
        </div>

        <div className="space-y-4">
          {featuredTools.map((tool, idx) => (
            <FeaturedToolCard key={tool.slug} tool={tool} rank={idx + 1} />
          ))}
        </div>
      </section>

      {/* ── Why your real income is lower than gross ── */}
      <section className="mb-12" aria-labelledby="why-heading">
        <h2 id="why-heading" className="text-base font-bold text-gray-800 mb-5">
          Why Your Real Income Is Always Lower Than Your Gross Pay
        </h2>
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

      {/* ── All tools by category ── */}
      <section className="mb-12" aria-labelledby="all-tools-heading">
        <h2 id="all-tools-heading" className="text-base font-bold text-gray-800 mb-6">
          All Tools
        </h2>

        <div className="space-y-10">
          {CATEGORY_ORDER.map((cat) => {
            const tools = categoryGroups[cat];
            if (!tools.length) return null;
            const meta = CATEGORY_META[cat];
            // Filter out tools already shown in featured section to avoid duplication
            const nonFeatured = tools.filter((t) => !t.featured);
            // If all in this category are featured, still show the category header but no cards
            if (nonFeatured.length === 0) return null;

            return (
              <div key={cat}>
                {/* Category header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{meta.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{meta.label}</h3>
                    <p className="text-xs text-gray-500">{meta.description}</p>
                  </div>
                </div>

                {/* Tool cards grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {nonFeatured.map((tool) => (
                    <StandardToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
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
              { href: "/agencies-with-housing",              icon: "🏠", label: "Find agencies with housing" },
              { href: "/salary/warehouse-worker-netherlands", icon: "📈", label: "Salary data by job type" },
              { href: "/agencies",                           icon: "🔍", label: "Browse 150+ verified agencies" },
              { href: "/tools/payslip-checker#resources",    icon: "🛡️", label: "Worker rights resources" },
              { href: "/compare-agencies",                   icon: "⚖️", label: "Compare agencies side by side" },
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
        All tools are for informational purposes only. Calculations are estimates based on 2026 Dutch
        tax brackets and legal rules and do not constitute legal or financial advice. Always verify
        figures with your employer or a qualified tax adviser. Data never leaves your browser.
      </div>
    </div>
  );
}
