import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legalConfig";
import { organizationSchema, breadcrumbSchema, webPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Contact AgencyCheck – We Read Every Message",
  description:
    "Have a question about a job, agency, housing, or salary in the Netherlands? Report wrong information or suggest a new agency. One email: hello@agencycheck.io. We reply within 24–48 hours.",
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
    description: "Contact AgencyCheck. One email for everything: hello@agencycheck.io. We aim to reply within 24–48 hours.",
    url:         "/contact",
  });

  return (
    <div className="min-h-screen bg-white">

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema)   }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema)  }} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            Real people — we read every message
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Contact AgencyCheck
          </h1>

          <p className="text-gray-300 text-base leading-relaxed mb-8">
            We&apos;re a small, independent platform built for workers in the Netherlands.
            Whether you have a question, want to report something, or just need help —
            one email covers everything.
          </p>

          {/* Main email CTA */}
          <div className="bg-white/8 border border-white/12 rounded-2xl p-5 sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Our email
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="text-2xl sm:text-3xl font-black text-white hover:text-emerald-300 transition-colors break-all block mb-4"
            >
              {EMAIL}
            </a>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send us an email
              </a>
              <p className="text-xs text-gray-400">
                We aim to reply as fast as possible — usually within 24–48 hours.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">

        {/* ── What to write about ─────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
            What you can write to us about
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">
            One email — anything you need
          </h2>

          <div className="space-y-3">

            {[
              {
                icon: "💬",
                title: "Questions about jobs, housing, or agencies",
                body:  "Not sure how housing deductions work? Want to know if an agency is legit? Ask — we'll point you in the right direction.",
              },
              {
                icon: "✏️",
                title: "Reporting wrong information",
                body:  "Found something incorrect on an agency profile — wrong address, outdated info, or a factual error? Tell us. We verify all corrections before updating.",
                highlight: true,
              },
              {
                icon: "🏠",
                title: "Housing, salary, or working condition issues",
                body:  "We take these seriously. If you experienced something that others should know about, let us know — even if you don't want to leave a public review.",
                highlight: true,
              },
              {
                icon: "📋",
                title: "Suggesting a new agency to add",
                body:  "Know an agency that isn't on AgencyCheck? Send us the name and we'll look into adding it.",
              },
              {
                icon: "🤝",
                title: "Agency dispute or factual error about your agency",
                body:  "If you represent an agency and believe something is factually wrong, we'll review it. We fix verified errors quickly. We do not remove reviews or alter ratings.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border p-5 ${
                  item.highlight
                    ? "border-amber-100 bg-amber-50/30"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">{item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* ── Trust note ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5 shrink-0">📬</span>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-1">We review every message carefully</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Especially reports about housing conditions, unpaid salary, or unsafe working conditions.
                No auto-replies. No ticket system. A real person reads what you send.
              </p>
            </div>
          </div>
        </div>

        {/* ── Review CTA ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900 mb-1">Worked through an agency in the Netherlands?</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your anonymous review helps other workers know what to expect before they sign.
            </p>
          </div>
          <Link
            href="/submit-review"
            className="shrink-0 inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            ✍️ Share your experience
          </Link>
        </div>

        <div className="border-t border-gray-100" />

        {/* ── External resources ──────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
            Need legal or official help?
          </p>
          <h2 className="text-xl font-black text-gray-900 mb-2">
            Independent worker resources
          </h2>
          <p className="text-xs text-gray-500 mb-5 leading-relaxed">
            For formal complaints or legal disputes with an agency, these organisations can help you directly — free of charge.
          </p>

          <div className="space-y-2.5">
            {[
              {
                name:  "FNV — Workers Union Netherlands",
                desc:  "Free advice on pay disputes, contracts, and housing rights for agency workers.",
                href:  "https://www.fnv.nl",
                badge: "Union",
              },
              {
                name:  "Inspectie SZW — Labour Authority",
                desc:  "Report illegal working conditions, underpayment, or housing violations to the Dutch government.",
                href:  "https://www.inspectieszw.nl/contact",
                badge: "Government",
              },
              {
                name:  "SNCU — CAO Enforcement",
                desc:  "File a formal complaint about an agency that violates the uitzendkrachten CAO.",
                href:  "https://www.sncu.nl",
                badge: "CAO",
              },
              {
                name:  "SNF — Housing Standards",
                desc:  "Report substandard agency accommodation to an independent housing authority.",
                href:  "https://www.snf.nl",
                badge: "Housing",
              },
            ].map((org) => (
              <a
                key={org.href}
                href={org.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white hover:border-blue-100 hover:bg-blue-50/30 transition-all p-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {org.name}
                    </p>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 shrink-0">
                      {org.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{org.desc}</p>
                </div>
                <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </section>

        {/* ── Final email repeat ───────────────────────────────────────────── */}
        <div className="rounded-2xl bg-gray-950 text-white px-6 py-7 text-center">
          <p className="text-xs text-gray-400 mb-2">Still have a question? Just email us.</p>
          <a
            href={`mailto:${EMAIL}`}
            className="text-xl font-black text-white hover:text-emerald-300 transition-colors"
          >
            {EMAIL}
          </a>
          <p className="text-xs text-gray-500 mt-3">
            We aim to reply as fast as possible — usually within 24–48 hours.
          </p>
        </div>

      </div>
    </div>
  );
}
