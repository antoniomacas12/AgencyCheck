import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guideData";
import { breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Worker Guides — Netherlands Agency Jobs, Salary & Rights — AgencyCheck",
  description:
    "14 practical guides for agency workers in the Netherlands. Real salary numbers, hidden costs, housing rights, payslip breakdowns, ABU/NBBU contracts, forklift jobs, and how to prepare before you arrive. All backed by real worker data.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Worker Guides — Agency Jobs Netherlands — AgencyCheck",
    description:
      "Real guides for foreign workers in the Netherlands. Salary truth, housing deduction limits, ABU/NBBU rights, forklift earnings, and step-by-step arrival preparation — grounded in real worker reviews.",
  },
};

const crumbSchema = breadcrumbSchema([
  { name: "Home",   url: "/" },
  { name: "Guides", url: "/guides" },
]);

// Keyword clusters for topic grouping
const TOPIC_LINKS = [
  { href: "/guides/real-salary-netherlands-warehouse-workers",        label: "Salary after deductions" },
  { href: "/guides/jobs-in-netherlands-with-accommodation",            label: "Jobs with housing" },
  { href: "/guides/forklift-driver-jobs-netherlands",                  label: "Forklift driver jobs" },
  { href: "/guides/temp-agency-worker-rights-netherlands",             label: "ABU/NBBU worker rights" },
  { href: "/guides/moving-to-netherlands-for-work",                    label: "Moving to the Netherlands" },
  { href: "/guides/is-working-in-netherlands-worth-it",                label: "Is it worth it?" },
  { href: "/guides/working-in-netherlands-salary-after-rent",          label: "Salary after rent" },
  { href: "/guides/agency-jobs-netherlands-worker-experience",         label: "Worker experiences" },
  { href: "/guides/dutch-payslip-explained-agency-workers",            label: "Payslip explained" },
  { href: "/guides/netherlands-agency-housing-conditions-rights",      label: "Housing rights" },
  { href: "/guides/working-netherlands-without-speaking-dutch",        label: "Working without Dutch" },
  { href: "/guides/how-to-choose-best-temp-agency-netherlands",        label: "Choose the right agency" },
  { href: "/guides/real-salary-netherlands",                           label: "Real salary all job types" },
  { href: "/guides/hidden-costs-netherlands",                          label: "Hidden costs explained" },
];

export default function GuidesPage() {
  const totalSections = GUIDES.reduce((s, g) => s + g.sections.length, 0);
  const totalFaqs     = GUIDES.reduce((s, g) => s + g.faqs.length, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Guides</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-1 font-medium">
            🇳🇱 Netherlands · 2026
          </span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            Real worker data
          </span>
          <span className="text-xs bg-gray-50 text-gray-600 border border-gray-100 rounded-full px-2.5 py-1 font-medium">
            {GUIDES.length} guides · {totalSections} sections · {totalFaqs} FAQs
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          Worker Guides for Agency Jobs in the Netherlands
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Every guide is built from real salary data, Dutch tax law (2026), SNF housing standards, ABU/NBBU collective agreements,
          and worker reviews collected on AgencyCheck. No generic advice — real numbers you can act on.
        </p>
      </div>

      {/* Topic grid — helps Google understand keyword coverage */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-8">
        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Topics covered</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {TOPIC_LINKS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="text-xs text-brand-600 hover:text-brand-800 hover:underline py-1 leading-snug"
            >
              → {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Guide cards */}
      <div className="space-y-4 mb-10">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="card p-5 hover:shadow-md hover:border-brand-200 transition-all block group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-600 mb-1 block">
                  {guide.badge}
                </span>
                <h2 className="text-base font-bold text-gray-900 leading-snug group-hover:text-brand-700 transition-colors mb-1">
                  {guide.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {guide.intro}
                </p>
              </div>
              <span className="text-brand-600 text-lg shrink-0 mt-1">→</span>
            </div>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
              <span className="text-xs text-gray-400">{guide.sections.length} sections</span>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400">{guide.faqs.length} FAQs</span>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400">Updated {guide.dateModified}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Internal linking */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3">Also useful</h2>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          {[
            { href: "/agencies",                           label: "All agencies ranked by workers" },
            { href: "/agencies-with-housing",              label: "Agencies with housing included" },
            { href: "/reviews",                            label: "All worker reviews" },
            { href: "/tools/real-income-calculator",       label: "Real income calculator" },
            { href: "/tools/payslip-checker",              label: "Payslip checker" },
            { href: "/work-in-netherlands-for-foreigners", label: "Complete foreigner guide" },
            { href: "/real-salary-netherlands-after-rent", label: "Salary after rent breakdown" },
            { href: "/tools/salary-calculator",            label: "Salary calculator" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-brand-600 hover:text-brand-800 hover:underline"
            >
              <span className="text-gray-400">→</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
