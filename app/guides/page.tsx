import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guideData";
import { breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Worker Guides — Netherlands Agency Jobs, Salary & Housing — AgencyCheck",
  description:
    "Practical guides for workers in the Netherlands. Real salary breakdowns, housing rights, agency work explained — backed by real worker review data.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Worker Guides — Agency Jobs Netherlands — AgencyCheck",
    description:
      "Real guides for agency workers in the Netherlands. Salary truth, housing limits, your rights — all grounded in real worker data.",
  },
};

const crumbSchema = breadcrumbSchema([
  { name: "Home",   url: "/" },
  { name: "Guides", url: "/guides" },
]);

export default function GuidesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Guides</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-1 font-medium">
            🇳🇱 Netherlands — 2026
          </span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            Real worker data
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          Worker Guides for Agency Jobs in the Netherlands
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Every guide is built from real salary data, Dutch tax law, and worker reviews
          collected on AgencyCheck. No generic advice — numbers you can actually use.
        </p>
      </div>

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
            { href: "/agencies",                  label: "All agencies ranked by workers" },
            { href: "/agencies-with-housing",      label: "Agencies with housing included" },
            { href: "/reviews",                    label: "All worker reviews" },
            { href: "/tools/real-income-calculator", label: "Real income calculator" },
            { href: "/work-in-netherlands-for-foreigners", label: "Complete foreigner guide" },
            { href: "/real-salary-netherlands-after-rent", label: "Salary after rent breakdown" },
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
