import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legalConfig";
import { organizationSchema, breadcrumbSchema, webPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Contact AgencyCheck – Work Agency Reviews Netherlands",
  description:
    "Contact AgencyCheck. We collect real worker experiences about employment agencies in the Netherlands. Report an experience, ask a question, or suggest a correction — we read every message.",
  alternates: { canonical: "/contact" },
};

const CONTACT_EMAIL = LEGAL.emailGeneral; // hello@agencycheck.io

export default function ContactPage() {
  const orgSchema   = organizationSchema();
  const crumbSchema = breadcrumbSchema([
    { name: "Home",    url: "/" },
    { name: "Contact", url: "/contact" },
  ]);
  const pageSchema = webPageSchema({
    name:        "Contact AgencyCheck – Work Agency Reviews Netherlands",
    description: "Contact AgencyCheck. We collect real worker experiences about employment agencies in the Netherlands.",
    url:         "/contact",
  });

  return (
    <div className="min-h-screen bg-white">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema)   }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema)  }} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-18">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Real people · We read every message
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Contact AgencyCheck
          </h1>

          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-8">
            AgencyCheck collects real worker experiences about work agencies in the Netherlands.
            If you want to contact us, report an experience, or ask a question, use the
            details below.
          </p>

          {/* Primary email block — plain HTML for SEO and screen readers */}
          <div className="bg-white/8 border border-white/12 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Email us directly
              </p>
              {/* Rendered in plain HTML — not hidden in JS — for SEO indexability */}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-xl sm:text-2xl font-black text-white hover:text-brand-300 transition-colors break-all"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm whitespace-nowrap shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send email
            </a>
          </div>

        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">

        {/* ── Trust signals ──────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              icon: "📬",
              title: "We read every message",
              body:  "No auto-replies, no ticket queues. Every email reaches a real person who reads it.",
            },
            {
              icon: "🙂",
              title: "Real people, not bots",
              body:  "AgencyCheck is an independent platform. When you write to us, a human responds.",
            },
            {
              icon: "⚡",
              title: "Response within 5 days",
              body:  "Corrections and factual disputes are reviewed and actioned within 5 working days.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <span className="text-2xl mb-3 block">{item.icon}</span>
              <p className="text-sm font-bold text-gray-900 mb-1">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100" />

        {/* ── CTA cards ──────────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-600 mb-3">
            How we can help
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">
            What to contact us about
          </h2>

          <div className="space-y-3">

            {/* Report an experience */}
            <div className="card p-5 hover:border-brand-100 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                <span className="text-2xl shrink-0 mt-0.5">⭐</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    Report an agency experience
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    Worked through an agency in the Netherlands? Your anonymous review helps
                    other workers understand the real picture — housing conditions, take-home
                    pay, transport, and management. Takes two minutes.
                  </p>
                  <Link
                    href="/reviews"
                    className="inline-flex items-center gap-1.5 text-xs bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Share your experience →
                  </Link>
                </div>
              </div>
            </div>

            {/* Ask a question */}
            <div className="card p-5 hover:border-brand-100 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                <span className="text-2xl shrink-0 mt-0.5">💬</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    Ask a question
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    Questions about agency working conditions, Dutch labour law, salary
                    deductions, housing rights, or anything else? Email us — we&apos;ll point
                    you to the right information or resource.
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Question`}
                    className="inline-flex items-center gap-1.5 text-xs border border-brand-200 text-brand-700 hover:bg-brand-50 font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* Suggest a correction */}
            <div className="card p-5 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                <span className="text-2xl shrink-0 mt-0.5">✏️</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    Suggest a correction
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    Found incorrect information — a wrong address, outdated phone number, or
                    inaccurate sector classification? Email us with the agency name, the field
                    that is wrong, and the correct value. We verify all corrections before
                    updating.
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Correction`}
                    className="inline-flex items-center gap-1.5 text-xs border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* Agency dispute */}
            <div className="card p-5 hover:border-amber-100 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                <span className="text-2xl shrink-0 mt-0.5">🤝</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    Are you an employment agency?
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    If information about your agency on AgencyCheck is factually incorrect,
                    you can request a review. We correct verified errors promptly. We do not
                    remove agencies from the platform or accept payment to alter content or
                    ratings.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=Agency dispute`}
                      className="inline-flex items-center gap-1.5 text-xs border border-amber-200 text-amber-700 hover:bg-amber-50 font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    <Link
                      href="/for-agencies"
                      className="text-xs text-brand-600 hover:underline px-2 py-2"
                    >
                      More info for agencies →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Single-address callout ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-600 mb-2">
            One address for everything
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-5">
            You can contact us about agency experiences, corrections, questions, or anything
            else at a single address. We route every message to the right person internally.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-lg font-black text-brand-700 hover:text-brand-900 transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send email
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* ── Worker rights resources ─────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
            External resources
          </p>
          <h2 className="text-xl font-black text-gray-900 mb-2">
            Worker rights organisations
          </h2>
          <p className="text-xs text-gray-500 mb-5 leading-relaxed">
            For legal or employment disputes with an agency, these organisations provide
            independent help — free of charge.
          </p>
          <div className="space-y-3">
            {[
              {
                name:  "FNV — Workers Union Netherlands",
                desc:  "The largest workers union in the Netherlands. Free advice on contracts, pay disputes, and housing rights for agency workers.",
                href:  "https://www.fnv.nl",
                badge: "Union",
              },
              {
                name:  "Inspectie SZW — Labour Authority",
                desc:  "The Dutch Labour Authority. Report illegal working conditions, underpayment, or housing violations directly to the government.",
                href:  "https://www.inspectieszw.nl/contact",
                badge: "Government",
              },
              {
                name:  "SNCU — CAO Enforcement Foundation",
                desc:  "Enforcement of the uitzendkrachten (agency worker) CAO. File a formal complaint about a non-compliant agency.",
                href:  "https://www.sncu.nl",
                badge: "CAO",
              },
              {
                name:  "SNF — Housing Standards Foundation",
                desc:  "Standards for worker accommodation in the Netherlands. Report substandard agency housing to an independent authority.",
                href:  "https://www.normenvoorflessenarbeiders.nl",
                badge: "Housing",
              },
            ].map((org) => (
              <a
                key={org.href}
                href={org.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 card p-4 hover:shadow-sm hover:border-gray-200 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-bold text-brand-700 group-hover:text-brand-900 transition-colors">
                      {org.name}
                    </p>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 shrink-0">
                      {org.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{org.desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-brand-400 shrink-0 mt-0.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
