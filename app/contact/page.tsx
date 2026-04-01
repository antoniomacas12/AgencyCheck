import type { Metadata } from "next";
import Link from "next/link";
import { organizationSchema, breadcrumbSchema, webPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Contact AgencyCheck — Report Agencies, Submit Data, Ask Questions",
  description:
    "Get in touch with AgencyCheck. Report an inaccuracy, submit a missing agency, ask a question, or share your experience as a worker or employment agency.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const orgSchema   = organizationSchema();
  const crumbSchema = breadcrumbSchema([
    { name: "Home",    url: "/" },
    { name: "Contact", url: "/contact" },
  ]);
  const pageSchema  = webPageSchema({
    name:        "Contact AgencyCheck — Report Agencies, Submit Data, Ask Questions",
    description: "Get in touch with AgencyCheck. Report an inaccuracy, submit a missing agency, ask a question, or share your experience.",
    url:         "/contact",
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema)   }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema)  }} />

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Have a question, a correction, or an experience to share? We want to hear from you.
          AgencyCheck is built on worker contributions — every piece of information helps.
        </p>
      </div>

      {/* Contact options */}
      <div className="space-y-4 mb-10">

        {/* Worker review */}
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <span className="text-3xl shrink-0">⭐</span>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-sm mb-1">Leave a review for an agency</h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Worked through an agency? Your anonymous review helps other workers make informed
                decisions about housing, pay, transport, and management. Takes 2 minutes.
              </p>
              <Link
                href="/reviews"
                className="inline-block text-xs bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Share your experience →
              </Link>
            </div>
          </div>
        </div>

        {/* Report issue */}
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <span className="text-3xl shrink-0">⚠️</span>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-sm mb-1">Report a problem with an agency</h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Experienced missing overtime pay, bad housing conditions, late salary, payslip errors,
                or contract problems? Report it on the agency&apos;s profile page. Community reports
                are visible to all workers.
              </p>
              <Link
                href="/agencies"
                className="inline-block text-xs border border-red-200 text-red-700 hover:bg-red-50 font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Find and report agency →
              </Link>
            </div>
          </div>
        </div>

        {/* Correct data */}
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <span className="text-3xl shrink-0">✏️</span>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-sm mb-1">Correct inaccurate information</h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Found wrong details — an outdated phone number, incorrect address, or wrong sector?
                Email us with the agency name, the field that is wrong, and the correct information.
                We review all corrections within 5 working days.
              </p>
              <a
                href="mailto:corrections@agencycheck.nl"
                className="inline-block text-xs border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                corrections@agencycheck.nl
              </a>
            </div>
          </div>
        </div>

        {/* Add missing agency */}
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <span className="text-3xl shrink-0">🏢</span>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-sm mb-1">Suggest a missing agency</h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Know of an employment agency in the Netherlands that we haven&apos;t listed? Send us the
                agency name, website, and city. We research all suggested agencies before adding them.
                We do not accept paid listings.
              </p>
              <a
                href="mailto:suggest@agencycheck.nl"
                className="inline-block text-xs border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                suggest@agencycheck.nl
              </a>
            </div>
          </div>
        </div>

        {/* Agency dispute */}
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <span className="text-3xl shrink-0">🤝</span>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-sm mb-1">Are you an employment agency?</h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                If you are an agency listed on AgencyCheck and believe information about you is
                factually incorrect, you can request a review. We take all factual disputes seriously
                and correct verified errors promptly. We do not remove agencies from the platform or
                accept payment to alter ratings.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="mailto:agencies@agencycheck.nl"
                  className="inline-block text-xs border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  agencies@agencycheck.nl
                </a>
                <Link
                  href="/for-agencies"
                  className="inline-block text-xs text-brand-600 hover:underline px-2 py-2"
                >
                  More info for agencies →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* General */}
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <span className="text-3xl shrink-0">✉️</span>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-sm mb-1">General enquiries</h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Press enquiries, research collaboration, data requests, or anything else:
              </p>
              <a
                href="mailto:hello@agencycheck.nl"
                className="inline-block text-xs border border-brand-200 text-brand-700 hover:bg-brand-50 font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                hello@agencycheck.nl
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Response times */}
      <div className="bg-gray-50 rounded-xl p-5 mb-10 text-xs text-gray-600 leading-relaxed">
        <p className="font-semibold text-gray-800 mb-2">Response times</p>
        <p>We aim to respond to all corrections and agency disputes within <strong>5 working days</strong>.
        Review and report submissions are published immediately once submitted.
        General enquiries: 2–5 working days.</p>
      </div>

      {/* Worker rights resources */}
      <section>
        <h2 className="text-base font-bold text-gray-900 mb-4">Worker rights resources</h2>
        <p className="text-xs text-gray-500 mb-4">
          If you have a legal or employment dispute with an agency, these organisations can help:
        </p>
        <div className="space-y-3">
          {[
            {
              name: "FNV — Workers Union Netherlands",
              desc: "The largest workers union in the Netherlands. Free advice on contracts, pay disputes, and housing rights.",
              href: "https://www.fnv.nl",
            },
            {
              name: "Inspectie SZW — Labour Authority",
              desc: "The Dutch Labour Authority. Report illegal working conditions, underpayment, or housing violations.",
              href: "https://www.inspectieszw.nl/contact",
            },
            {
              name: "SNCU — CAO Enforcement Foundation",
              desc: "Enforcement of the uitzendkrachten (agency worker) CAO. File a complaint about a non-compliant agency.",
              href: "https://www.sncu.nl",
            },
            {
              name: "SNF — Housing Standards",
              desc: "Standards for worker accommodation in the Netherlands. Report substandard housing.",
              href: "https://www.normenvoorflessenarbeiders.nl",
            },
          ].map((org) => (
            <a key={org.href} href={org.href} target="_blank" rel="noopener noreferrer"
              className="block card p-4 hover:shadow-sm transition-shadow">
              <p className="text-sm font-semibold text-brand-700 mb-1">{org.name} ↗</p>
              <p className="text-xs text-gray-500 leading-relaxed">{org.desc}</p>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
