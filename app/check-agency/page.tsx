import type { Metadata } from "next";
import Link from "next/link";
import { faqPageSchema, breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "How to Check if a Work Agency in the Netherlands is Legit (2026 Guide)",
  description:
    "Step-by-step: verify KvK registration, SNF housing certification, CAO compliance, and real worker reviews before signing with any Dutch employment agency.",
  alternates: { canonical: "https://agencycheck.io/check-agency" },
  openGraph: {
    title: "How to Check if a Work Agency in the Netherlands is Legit (2026 Guide)",
    description:
      "Step-by-step guide to verifying any Dutch employment agency: KvK, SNF, CAO, and real worker reviews.",
    images: [{ url: "https://agencycheck.io/logo.png", width: 512, height: 512, alt: "AgencyCheck" }],
  },
};

const FAQ_ITEMS = [
  {
    question: "How do I check if an agency is legit in the Netherlands?",
    answer:
      "Check their KvK (Chamber of Commerce) registration at kvk.nl — every legitimate agency must be registered. Then verify ABU, NBBU, or SNA membership at abu.nl or sna.nl. Finally, read real worker reviews on AgencyCheck before signing anything.",
  },
  {
    question: "What is SNF certification?",
    answer:
      "SNF (Stichting Normering Flexwonen) is the Dutch certification body for agency housing. SNF-certified agencies must meet legal standards for room size, safety, and hygiene — and cannot charge more than €113.50/week for shared accommodation. You can verify SNF certification at snf.nl.",
  },
  {
    question: "How much salary do workers actually keep after all deductions?",
    answer:
      "At Dutch minimum wage (€14.71/hr × 40h = €588/week gross), most agency workers keep €300–€370/week after tax (~€63/wk), housing (~€95/wk), health insurance (~€35/wk), and transport (~€25/wk). That is 51–63% of gross. Use the AgencyCheck salary calculator for an exact breakdown.",
  },
  {
    question: "What are the hidden costs in agency jobs in the Netherlands?",
    answer:
      "The four main deductions are: housing (€80–€115/week), health insurance (€30–€40/week), transport to work (€20–€30/week), and admin/service fees. All deductions must be listed in your contract before you start. If an agency refuses to show a breakdown upfront, treat that as a red flag.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Check KvK (Chamber of Commerce) registration",
    body: "Every legitimate employment agency in the Netherlands must be registered with the KvK — the Dutch Chamber of Commerce. Visit kvk.nl and search by company name or registration number. An unregistered agency is operating illegally. This takes 2 minutes and costs nothing.",
    tag: "kvk.nl",
    tagHref: "https://www.kvk.nl",
  },
  {
    num: "02",
    title: "Check SNF housing certification",
    body: "If the agency provides accommodation, verify their SNF (Stichting Normering Flexwonen) certification at snf.nl. SNF certification means the housing has been independently inspected for room size, fire safety, and basic hygiene. SNF-certified agencies also cannot legally charge more than €113.50/week for shared accommodation. No SNF cert = no guarantee on housing quality.",
    tag: "snf.nl",
    tagHref: "https://www.snf.nl",
  },
  {
    num: "03",
    title: "Check ABU/NBBU/SNA membership (CAO compliance)",
    body: "The two main CAOs (collective labour agreements) for agency workers in the Netherlands are the ABU CAO and the NBBU CAO. Member agencies are bound by these agreements — which cover minimum wage, overtime rules, contract terms, and deduction limits. You can verify ABU membership at abu.nl and NBBU at nbbu.nl. SNA (Stichting Normering Arbeid) is a broader quality mark covering tax and payroll compliance.",
    tag: "abu.nl",
    tagHref: "https://www.abu.nl",
  },
  {
    num: "04",
    title: "Read real worker reviews on AgencyCheck",
    body: "Official certifications only tell half the story. Read what workers who actually signed with the agency report about their experience — salary accuracy, housing conditions, management, and contract clarity. AgencyCheck publishes all reviews unfiltered, including negative ones. Sort by issue type to spot recurring problems fast.",
    tag: "Browse agencies →",
    tagHref: "/agencies",
    internal: true,
  },
];

export default function CheckAgencyPage() {
  const faqSchema       = faqPageSchema(FAQ_ITEMS);
  const breadcrumbs     = breadcrumbSchema([
    { name: "Home",          url: "/" },
    { name: "Check an agency", url: "/check-agency" },
  ]);

  return (
    <>
      {/* ── JSON-LD ────────────────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Check if a Work Agency in the Netherlands is Legit",
          "description": "A step-by-step guide to verifying any Dutch employment agency before you sign a contract.",
          "totalTime": "PT10M",
          "supply": [],
          "tool": [],
          "step": STEPS.map((s, i) => ({
            "@type": "HowToStep",
            "position": i + 1,
            "name": s.title,
            "text": s.body,
          })),
        }) }}
      />

      <div className="min-h-screen bg-[#080c14]">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-400">Check an agency</span>
            </nav>

            <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3">
              2026 Guide
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
              How to Check if a Work Agency<br className="hidden sm:block" /> in the Netherlands is Legit
            </h1>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8">
              Thousands of workers arrive in the Netherlands each year and sign agency contracts without
              checking basic facts. Housing disappears when the contract ends. Deductions are higher than
              agreed. The agency has no valid registration. This guide shows you four checks that take
              less than 15 minutes — and can prevent months of problems.
            </p>

            {/* Quick-action strip */}
            <div className="flex flex-wrap gap-3">
              <Link href="/agencies"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 transition-colors">
                Browse verified agencies →
              </Link>
              <Link href="/reviews"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.15] bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-bold px-5 py-2.5 transition-colors">
                Read worker reviews
              </Link>
            </div>
          </div>
        </section>

        {/* ── 4 Steps ──────────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">
              Step-by-step checklist
            </p>

            <div className="space-y-6">
              {STEPS.map((step) => (
                <div key={step.num}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <span className="shrink-0 text-2xl font-black text-emerald-500 leading-none mt-0.5">
                      {step.num}
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white mb-2">
                        {step.title}
                      </h2>
                      <p className="text-sm text-gray-300 leading-relaxed mb-3">
                        {step.body}
                      </p>
                      {step.internal ? (
                        <Link href={step.tagHref}
                          className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                          {step.tag}
                        </Link>
                      ) : (
                        <a href={step.tagHref} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                          {step.tag} ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">FAQ</p>
            <h2 className="text-2xl font-black text-white mb-8">
              Common questions about checking agencies
            </h2>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6">
                  <h3 className="text-sm font-bold text-white mb-2">{item.question}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Internal links / next steps ──────────────────────────────────── */}
        <section>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
              Next steps
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  href: "/agencies",
                  emoji: "🏢",
                  title: "Browse agencies",
                  desc: "150+ agencies ranked by worker ratings, housing, and salary accuracy.",
                },
                {
                  href: "/reviews",
                  emoji: "⭐",
                  title: "Worker reviews",
                  desc: "Read unfiltered reviews from workers who have already been there.",
                },
                {
                  href: "/salary",
                  emoji: "💶",
                  title: "Real salary calculator",
                  desc: "See your exact take-home pay after every deduction.",
                },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex flex-col gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-blue-500/[0.08] hover:border-blue-400/[0.2] transition-colors p-5 group">
                  <span className="text-2xl">{item.emoji}</span>
                  <p className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 leading-snug">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
