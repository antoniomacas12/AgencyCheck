import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legalConfig";
import { organizationSchema, breadcrumbSchema, webPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Contact AgencyCheck – Need Help? Write to Us",
  description:
    "Not sure if an agency is legit? Something wrong with your salary or housing? Write to us. One email: hello@agencycheck.io. We reply within 24–48 hours.",
  alternates: { canonical: "/contact" },
};

const EMAIL = LEGAL.emailGeneral; // hello@agencycheck.io

export default function ContactPage() {
  const orgSchema   = organizationSchema();
  const crumbSchema = breadcrumbSchema([
    { name: "Home",    url: "/" },
    { name: "Contact", url: "/contact" },
  ]);
  const pageSchema = webPageSchema({
    name:        "Contact AgencyCheck",
    description: "Write to AgencyCheck about agencies, salary, housing, or anything else. One email: hello@agencycheck.io",
    url:         "/contact",
  });

  return (
    <div className="min-h-screen bg-white">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema)   }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema)  }} />

      <div className="max-w-xl mx-auto px-5 sm:px-6 py-14 sm:py-20">

        {/* ── Hook ──────────────────────────────────────────────────────────── */}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
          Need help or found something wrong?
        </h1>

        <p className="text-base text-gray-600 leading-relaxed mb-8">
          Not sure if an agency is legit? Something doesn&apos;t look right with your
          salary or housing? Let us know. We&apos;re a small team — real people read
          every message.
        </p>

        {/* ── Reasons to write ──────────────────────────────────────────────── */}
        <ul className="space-y-3 mb-10">
          {[
            "Report wrong information about an agency",
            "Share your experience — good or bad",
            "Suggest an agency we should check",
            "Ask anything about working or living conditions in the Netherlands",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {/* ── Email ─────────────────────────────────────────────────────────── */}
        <div className="mb-3">
          <a
            href={`mailto:${EMAIL}`}
            className="text-2xl sm:text-3xl font-black text-gray-900 hover:text-emerald-600 transition-colors break-all"
          >
            {EMAIL}
          </a>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          We reply as fast as possible — usually within 24–48 hours.
        </p>

        <p className="text-sm text-gray-500 mb-10">
          We take reports about housing, salary, and working conditions seriously.
        </p>

        {/* ── Email button ──────────────────────────────────────────────────── */}
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm mb-16"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Write to us
        </a>

        <div className="border-t border-gray-100 mb-12" />

        {/* ── Review CTA ────────────────────────────────────────────────────── */}
        <div className="mb-12">
          <p className="text-sm font-bold text-gray-900 mb-1">
            Worked through an agency in the Netherlands?
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Your anonymous review helps other workers know what to expect before they sign.
          </p>
          <Link
            href="/submit-review"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-900 text-gray-900 font-bold px-5 py-3 rounded-xl transition-colors text-sm"
          >
            ✍️ Share your experience
          </Link>
        </div>

        <div className="border-t border-gray-100 mb-12" />

        {/* ── External resources ────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Need official or legal help?
          </p>

          <div className="space-y-4">
            {[
              {
                name: "FNV — Workers Union Netherlands",
                desc: "Free advice on pay disputes, contracts, and housing rights for agency workers.",
                href: "https://www.fnv.nl",
              },
              {
                name: "Inspectie SZW — Labour Authority",
                desc: "Report illegal working conditions, underpayment, or housing violations to the Dutch government.",
                href: "https://www.inspectieszw.nl/contact",
              },
              {
                name: "SNCU — CAO Enforcement",
                desc: "File a formal complaint about an agency violating the uitzendkrachten CAO.",
                href: "https://www.sncu.nl",
              },
              {
                name: "SNF — Housing Standards",
                desc: "Report substandard agency accommodation to an independent housing authority.",
                href: "https://www.snf.nl",
              },
            ].map((org) => (
              <a
                key={org.href}
                href={org.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-0.5">
                  {org.name} ↗
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">{org.desc}</p>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
