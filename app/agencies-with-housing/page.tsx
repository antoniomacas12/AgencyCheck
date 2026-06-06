import type { Metadata } from "next";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import { HOUSING_AGENCIES } from "@/lib/agencyEnriched";
import { WML_HOURLY_2026 } from "@/lib/dutchTax";
import GateLink from "@/components/GateLink";

export const metadata: Metadata = {
  title: "Agencies with Housing in the Netherlands | Accommodation Included | AgencyCheck",
  description:
    "Find Dutch employment agencies that provide accommodation for foreign workers. SNF-certified housing, transparent deductions, and verified reviews. Compare agencies with housing included.",
  alternates: {
    canonical: "https://agencycheck.io/agencies-with-housing",
  },
  openGraph: {
    title: "Agencies with Housing Netherlands | AgencyCheck",
    description:
      "Compare Dutch employment agencies that include accommodation. Real worker reviews, housing costs, and salary data.",
  },
};

// ─── JSON-LD structured data ──────────────────────────────────────────────────

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Which Dutch employment agencies provide accommodation for foreign workers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Many Dutch staffing agencies offer SNF-certified housing as part of the work package for foreign workers. Top agencies with verified housing include OTTO Work Force, Covebo, Abroad Experience, and others. All agencies on AgencyCheck are rated by real workers on housing quality, cost transparency, and management.",
      },
    },
    {
      "@type": "Question",
      "name": "How much does agency housing cost in the Netherlands?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `Agency housing in the Netherlands costs between €80 and €113.50 per week for SNF-certified shared accommodation. The Dutch SNF (Stichting Normering Flexwonen) sets a legal maximum of €113.50/week. This amount is deducted from your gross wage — not added on top. At the minimum wage of €${WML_HOURLY_2026}/hr × 40h = €588/week, housing typically consumes 15–19% of gross pay.`,
      },
    },
    {
      "@type": "Question",
      "name": "What is SNF certification and why does it matter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SNF (Stichting Normering Flexwonen) is the independent Dutch organisation that inspects and certifies agency housing. SNF certification means the accommodation meets minimum standards for room size (at least 10m² per person), fire safety, hygiene, and communal facilities. You can verify any agency's SNF number at snf.nl before accepting a job offer.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I trust agencies that include free housing with jobs in the Netherlands?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Agency housing is never truly 'free' — the cost is deducted from your gross wage. However, it is a legitimate and common arrangement. Always ask for the weekly housing deduction in writing before you sign a contract. Check that the amount is between €80–€113.50/week (the SNF 2026 maximum). Agencies charging more than the SNF cap are violating Dutch law.",
      },
    },
    {
      "@type": "Question",
      "name": "What happens to my housing if the agency has no work for me?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This is one of the most important questions to ask before signing. Under many agency contracts (especially Phase A/B under the ABU CAO), the agency can end your housing when your contract is paused or terminated. Some agencies offer a grace period of 1–2 weeks. Get the exact terms in writing. If you are relocated or laid off unexpectedly, you have the right to notice as defined in your contract.",
      },
    },
    {
      "@type": "Question",
      "name": "Are reach truck and warehouse jobs available with accommodation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Reach truck operators and warehouse workers are among the most commonly placed roles through Dutch agencies that include housing. Most high-bay distribution centres in Tilburg, Waalwijk, and Venlo are located outside city centres, which is why agencies routinely provide both housing and transport as part of the package. See our reach truck jobs page and jobs with accommodation page for current openings.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home",     "item": "https://agencycheck.io/" },
    { "@type": "ListItem", "position": 2, "name": "Agencies", "item": "https://agencycheck.io/agencies" },
    { "@type": "ListItem", "position": 3, "name": "Agencies with Housing", "item": "https://agencycheck.io/agencies-with-housing" },
  ],
};

// ─── Sort: highest transparency score first ───────────────────────────────────
const housingAgencies = [...HOUSING_AGENCIES].sort(
  (a, b) => b.transparencyScore - a.transparencyScore
);
const topAgencies  = housingAgencies.slice(0, 6);
const moreAgencies = housingAgencies.slice(6, 18);

export default function AgenciesWithHousingPage() {
  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>›</span>
          <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">Agencies with Housing</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-2xl">🏠</span>
            <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-0.5 font-semibold">
              {housingAgencies.length} agencies with housing
            </span>
            <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-0.5">
              SNF-certified
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
            Employment Agencies with Accommodation in the Netherlands
          </h1>

          <div className="text-gray-600 text-sm leading-relaxed max-w-3xl space-y-3">
            <p>
              Finding a job in the Netherlands as a foreign worker typically means solving two problems
              at once: where to work, and where to live. Dutch employment agencies that offer
              accommodation solve both problems in a single arrangement — your housing is organised
              before you travel, costs are transparent and deducted directly from your wage, and
              transport to the warehouse or production site is usually included.
            </p>
            <p>
              On this page you will find <strong>{housingAgencies.length} verified Dutch staffing agencies</strong> confirmed
              to offer accommodation as part of their work packages. Every agency listed here has been
              cross-referenced against worker reviews on AgencyCheck — so you can see what real workers
              say about housing quality, deductions, and management before you commit to anything.
            </p>
            <p>
              All legitimate agency housing in the Netherlands must meet <strong>SNF (Stichting Normering
              Flexwonen)</strong> standards, which set minimum room sizes, fire safety requirements, and
              hygiene conditions. The legal maximum housing deduction for SNF-certified accommodation
              is <strong>€113.50 per week</strong> (2026 cap). Any agency charging more than this is
              breaking Dutch law — and you can report them to the Inspectie SZW.
            </p>
          </div>
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { value: `€${WML_HOURLY_2026}/hr`, label: "Minimum wage 2026" },
            { value: "€80–€113/wk", label: "Typical housing cost" },
            { value: "€113.50/wk", label: "SNF legal maximum" },
            { value: "Free",        label: "Application fee" },
          ].map((s) => (
            <div key={s.label} className="card p-3 text-center">
              <p className="text-lg font-extrabold text-brand-700">{s.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Top agencies */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Top Rated Agencies with Housing
          </h2>
          <p className="text-xs text-gray-400 mb-4">Sorted by transparency score — based on worker reviews.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {topAgencies.map((a) => (
              <AgencyCard key={a.id} agency={a} />
            ))}
          </div>
        </section>

        {/* How housing works section */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            How Agency Housing Works in the Netherlands
          </h2>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              When a Dutch agency advertises a job <em>with accommodation</em>, they mean they will
              arrange a shared room or apartment near your workplace, and deduct the cost directly
              from your gross wage each week. You do not pay a deposit upfront — the housing is
              available from your first working day.
            </p>
            <p>
              Most agency housing is shared — typically 2 to 6 people per flat, in purpose-built
              accommodation complexes or converted houses close to warehouse districts. The quality
              varies significantly between agencies. SNF-certified housing meets minimum legal
              standards, but higher-rated agencies provide larger rooms, cleaner common areas, and
              better maintenance.
            </p>
            <p>
              A key point many workers miss: <strong>housing is tied to your contract.</strong> If
              your assignment ends — whether due to seasonal demand, misconduct, or your own choice
              — your right to the accommodation typically ends with it, often after a short notice
              period of 7–14 days. Confirm the exact policy before you travel, so you are not left
              without housing if the situation changes.
            </p>
          </div>
        </section>

        {/* What to check before signing */}
        <section className="mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h2 className="font-bold text-amber-900 text-sm mb-3">
              ⚠️ What to verify before accepting housing from an agency
            </h2>
            <ul className="text-xs text-amber-800 space-y-2 leading-relaxed">
              <li>→ <strong>Weekly housing cost in writing</strong> — must be €80–€113.50/week maximum for SNF accommodation.</li>
              <li>→ <strong>SNF certification</strong> — ask for the SNF registration number and verify at snf.nl.</li>
              <li>→ <strong>Notice period</strong> — how many days do you have to vacate if your contract ends?</li>
              <li>→ <strong>What is included</strong> — bedding, internet, utilities? Get the full list.</li>
              <li>→ <strong>Transport included?</strong> — many agencies include a bus to the worksite; confirm if it costs extra.</li>
              <li>→ <strong>Contract language</strong> — you must receive a contract you can read. Demand Polish, Romanian, or English if needed.</li>
            </ul>
          </div>
        </section>

        {/* More agencies */}
        {moreAgencies.length > 0 && (
          <section className="mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              More Agencies with Accommodation
            </h2>
            <p className="text-xs text-gray-400 mb-4">{moreAgencies.length} additional agencies confirmed to offer housing.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {moreAgencies.map((a) => (
                <AgencyCard key={a.id} agency={a} />
              ))}
            </div>
            {housingAgencies.length > 24 && (
              <p className="text-xs text-gray-400 text-center mt-4">
                Showing {Math.min(24, housingAgencies.length)} of {housingAgencies.length} agencies.{" "}
                <Link href="/agencies" className="text-brand-600 hover:underline">Browse all agencies →</Link>
              </p>
            )}
          </section>
        )}

        {/* Jobs with accommodation CTA */}
        <section className="mb-8">
          <div className="rounded-xl border border-brand-100 bg-brand-50 p-5">
            <h2 className="font-bold text-brand-900 text-sm mb-2">
              Looking for specific jobs with accommodation?
            </h2>
            <p className="text-xs text-brand-700 mb-4 leading-relaxed">
              Browse job listings that include housing — filtered by job type, city, and salary range.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/jobs-with-accommodation" className="text-xs font-semibold text-brand-700 border border-brand-200 bg-white rounded-full px-3 py-1.5 hover:bg-brand-100 transition-colors">
                All jobs with accommodation →
              </Link>
              <Link href="/warehouse-jobs-with-accommodation" className="text-xs font-semibold text-gray-700 border border-gray-200 bg-white rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors">
                Warehouse jobs
              </Link>
              <Link href="/reach-truck-jobs" className="text-xs font-semibold text-gray-700 border border-gray-200 bg-white rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors">
                Reach truck jobs
              </Link>
              <Link href="/greenhouse-jobs-with-accommodation" className="text-xs font-semibold text-gray-700 border border-gray-200 bg-white rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors">
                Greenhouse jobs
              </Link>
            </div>
          </div>
        </section>

        {/* Housing costs breakdown */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Real Cost of Agency Housing: Weekly Take-Home Estimate
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            At the 2026 statutory minimum wage of €{WML_HOURLY_2026}/hr working 40 hours per week,
            here is what a typical week looks like after all deductions:
          </p>
          <div className="card overflow-hidden mb-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-700">Item</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr><td className="px-4 py-2.5 text-gray-700">Gross pay (€{WML_HOURLY_2026} × 40h)</td><td className="px-4 py-2.5 text-right font-semibold text-green-700">+€588</td></tr>
                <tr className="bg-gray-50/50"><td className="px-4 py-2.5 text-gray-600">Loonheffing (income tax + social)</td><td className="px-4 py-2.5 text-right text-red-600">−€63</td></tr>
                <tr><td className="px-4 py-2.5 text-gray-600">Agency housing (SNF standard)</td><td className="px-4 py-2.5 text-right text-red-600">−€95</td></tr>
                <tr className="bg-gray-50/50"><td className="px-4 py-2.5 text-gray-600">Health insurance</td><td className="px-4 py-2.5 text-right text-red-600">−€35</td></tr>
                <tr><td className="px-4 py-2.5 text-gray-600">Transport (agency bus, if charged)</td><td className="px-4 py-2.5 text-right text-red-600">−€25</td></tr>
                <tr className="bg-brand-50"><td className="px-4 py-2.5 font-bold text-brand-900">You keep (weekly)</td><td className="px-4 py-2.5 text-right font-extrabold text-brand-700">≈€370</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-gray-400">
            Estimate. Actual amounts depend on contract, CAO phase, and specific agency deductions.{" "}
            <Link href="/tools/real-income-calculator" className="text-brand-600 hover:underline">Calculate your exact take-home →</Link>
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5">
            Frequently Asked Questions — Agencies with Housing Netherlands
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Which Dutch employment agencies provide accommodation for foreign workers?",
                a: `Many Dutch staffing agencies offer SNF-certified housing as part of the work package. On AgencyCheck, ${housingAgencies.length} agencies are confirmed to offer accommodation. They are rated by real workers on housing quality, cost transparency, and management. The top-rated agencies with housing include those listed above — sorted by worker transparency score.`,
              },
              {
                q: "How much does agency housing cost in the Netherlands?",
                a: `Agency housing costs between €80 and €113.50 per week for SNF-certified shared accommodation. The Dutch SNF sets a legal maximum of €113.50/week (2026). This amount is deducted from your gross wage. At the minimum wage of €${WML_HOURLY_2026}/hr × 40 hours, housing typically represents 15–19% of gross weekly pay.`,
              },
              {
                q: "What is SNF certification and why does it matter?",
                a: "SNF (Stichting Normering Flexwonen) is the independent Dutch body that inspects and certifies agency housing. Certification means the accommodation meets minimum room size (10m² per person), fire safety, and hygiene standards. You can verify any agency's SNF number at snf.nl before accepting a job offer.",
              },
              {
                q: "Can I trust agencies that include free housing with jobs?",
                a: "Agency housing is never truly 'free' — the cost is deducted from gross pay. However, it is legitimate and standard practice. Always request the weekly housing cost in writing before signing. If an agency charges more than €113.50/week for shared accommodation, this is illegal and can be reported to Inspectie SZW.",
              },
              {
                q: "What happens to my housing if the agency has no work for me?",
                a: "Under most ABU CAO contracts (Phase A/B), housing ends when your work assignment ends — typically after a short notice period of 7–14 days. Confirm the exact terms before you travel. This is particularly important for seasonal roles where demand can drop without warning.",
              },
              {
                q: "Are reach truck and warehouse jobs available with accommodation?",
                a: "Yes. Reach truck operators and warehouse workers are the most commonly placed roles with accommodation packages. Most high-bay distribution centres in Tilburg, Waalwijk, and Venlo are outside city centres — which is why agencies routinely include housing and transport. See reach truck jobs and jobs with accommodation for current listings.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="group card p-4">
                <summary className="font-semibold text-sm text-gray-900 cursor-pointer list-none flex items-start justify-between gap-2">
                  <span>{q}</span>
                  <span className="text-gray-400 group-open:rotate-90 transition-transform shrink-0 mt-0.5">›</span>
                </summary>
                <p className="text-xs text-gray-600 leading-relaxed mt-3">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">🔗 Related pages</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { href: "/jobs-with-accommodation",         icon: "💼", label: "Jobs with accommodation",          sub: "All housing-included listings" },
              { href: "/reach-truck-jobs",                 icon: "🏗️", label: "Reach truck driver jobs",          sub: "€15–€17/hr, housing available" },
              { href: "/warehouse-jobs-with-accommodation",icon: "📦", label: "Warehouse jobs with housing",      sub: "Order picking, packing, logistics" },
              { href: "/best-agencies-with-housing-netherlands", icon: "⭐", label: "Best agencies — housing rated", sub: "Top rated by worker reviews" },
              { href: "/agency-housing-netherlands",       icon: "🏠", label: "Agency housing explained",         sub: "SNF rules, costs, your rights" },
              { href: "/tools/real-income-calculator",     icon: "💶", label: "Take-home calculator",             sub: "After housing + tax deductions" },
            ].map(({ href, icon, label, sub }) => (
              <Link
                key={href}
                href={href}
                className="card px-3 py-2.5 flex items-center gap-3 hover:border-brand-200 hover:bg-brand-50/30 transition-all"
              >
                <span className="text-lg shrink-0">{icon}</span>
                <div>
                  <p className="text-xs font-semibold text-brand-700">{label} →</p>
                  <p className="text-[10px] text-gray-400">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Apply CTA */}
        <div className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white p-5 text-center mb-6">
          <p className="font-bold text-sm mb-1">Ready to find a job with accommodation?</p>
          <p className="text-xs text-white/80 mb-4">Apply via WhatsApp — we match you with verified agencies that have housing available.</p>
          <GateLink
            source="agencies-with-housing-cta"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold text-xs rounded-xl px-5 py-2.5 hover:bg-brand-50 transition-colors"
          >
            Apply via WhatsApp →
          </GateLink>
        </div>

      </div>
    </>
  );
}
