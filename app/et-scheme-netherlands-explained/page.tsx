import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "ET Scheme Netherlands 2026 — Explained for Agency Workers (Up to €150/wk Extra)",
  description:
    "The ET (Extraterritorial costs) scheme can add €50–€150/week to your net income in the Netherlands — tax-free. Who qualifies, how much it's worth, and how to check if your agency applies it.",
  alternates: { canonical: "https://agencycheck.io/et-scheme-netherlands-explained" },
  openGraph: {
    title: "ET Scheme Netherlands 2026 — Up to €150/wk Extra Net Income",
    description:
      "Most EU agency workers in the Netherlands qualify for the ET benefit but don't know it. We explain who qualifies, how much it pays, and how to check your payslip.",
  },
};

export const dynamic = "force-static";

// ─── Comparison table: with vs without ET ────────────────────────────────────
const COMPARISON = [
  { label: "Gross weekly pay (WML 40h)",           without: "€588",  with_et: "€588",  note: null },
  { label: "Loonheffing (income tax after credits)", without: "−€63", with_et: "−€20",  note: "ET reduces taxable base" },
  { label: "WW/ZW premiums",                        without: "−€18", with_et: "−€18",  note: null },
  { label: "Health insurance",                      without: "−€35", with_et: "−€35",  note: null },
  { label: "Agency housing (SNF standard)",          without: "−€95", with_et: "−€95",  note: null },
  { label: "Transport to work",                     without: "−€25", with_et: "−€25",  note: null },
  { label: "ET vergoeding (tax-free reimbursement)", without: "€0",   with_et: "+€84",  note: "Typical range €50–€150/wk" },
  { label: "Nettoloon (take-home)",                 without: "€352", with_et: "€479",  note: "+€127/wk difference" },
];

// ─── Who qualifies ────────────────────────────────────────────────────────────
const QUALIFICATIONS = [
  {
    icon: "🌍",
    title: "You live more than 150km from the Dutch border",
    body: "The primary qualifying criterion is that your permanent home address is more than 150km from the nearest point of the Dutch border. For most Eastern European workers this is easily met: Warsaw is 1,200km away, Bucharest 1,800km, Sofia 2,000km. Workers from Belgium or Germany close to the border typically do not qualify.",
  },
  {
    icon: "⏱",
    title: "You have been in the Netherlands for fewer than 5 years",
    body: "The ET benefit is designed for workers who are temporarily extraterritorial — away from their home country. It applies for a maximum of 5 years (60 months) from the date you first started working in the Netherlands. After 5 years, you no longer qualify even if you still live abroad.",
  },
  {
    icon: "📋",
    title: "Your employment contract must include an ET clause",
    body: "The ET arrangement is not automatic — it must be agreed in writing between you and your employer. For agency workers, this usually means the ET clause is included in your standard agency contract (arbeidsovereenkomst). Ask your recruiter specifically: 'Wordt de ET-vergoeding op mijn contract toegepast?' (Is the ET allowance applied to my contract?)",
  },
];

// ─── How to check your payslip ────────────────────────────────────────────────
const PAYSLIP_CHECKS = [
  { label: "Look for 'ET vergoeding' or 'ET toeslag'", detail: "This line should show a positive amount — your tax-free reimbursement for the period." },
  { label: "Look for 'Onkostenvergoeding'", detail: "Some agencies use this general term for expense reimbursements including ET costs." },
  { label: "Check 'Belastingvrije vergoeding'", detail: "Tax-free reimbursement — another common label for the ET component." },
  { label: "Compare your loonheffing to a colleague without ET", detail: "If the ET scheme is applied correctly, your loonheffing should be noticeably lower for the same gross wage." },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What is the ET scheme in the Netherlands?",
    a: "The ET (Extraterritoriale kosten) scheme allows Dutch employers to reimburse workers for the extra costs of living and working outside their home country — tax-free. It is based on Article 31a of the Dutch Wage Tax Act (Wet op de loonbelasting 1964). The benefit is paid on top of your normal wages and reduces the portion of income subject to Dutch loonheffing (wage tax). For agency workers, this can mean €50–€150/week more in take-home pay compared to workers at the same gross wage who do not have ET applied.",
  },
  {
    q: "Do I automatically qualify for the ET scheme as an EU worker in the Netherlands?",
    a: "Not automatically. You qualify if: (1) your permanent home is more than 150km from the Dutch border, (2) you have been in the Netherlands for fewer than 5 years, and (3) your employment contract includes an ET clause. The 150km rule eliminates workers from Belgium and Germany who live near the Dutch border. All Eastern European workers (Poland, Romania, Bulgaria, Slovakia, Hungary, etc.) easily meet the distance requirement.",
  },
  {
    q: "How much is the ET scheme worth per week?",
    a: "The ET benefit is calculated as a percentage of your gross wage — typically 30% of your taxable gross for higher earners under the '30% ruling', but for agency workers it is usually calculated based on actual extraterritorial costs. In practice, the weekly net gain for an agency worker on WML (€14.71/hr, 40h/week) is €50–€150/week depending on how the agency calculates it. The example on this page shows a typical gain of ~€127/week net.",
  },
  {
    q: "My agency says they don't apply ET. Can I switch to one that does?",
    a: "Yes. Not all agencies apply the ET scheme, even when workers qualify. Some agencies are not familiar with it, others choose not to offer it. If you qualify and your current agency does not apply ET, you are legally entitled to negotiate for it or find an agency that does. When comparing agencies on AgencyCheck, you can check whether ET vergoeding is mentioned in their contract terms or ask directly when you apply.",
  },
  {
    q: "What happens after 5 years — do I lose the ET benefit?",
    a: "Yes — after 60 months of working in the Netherlands, the ET benefit expires. The 5-year clock starts from your first working day in the Netherlands, not when you first applied for the ET scheme. Some workers who have been coming to the Netherlands seasonally for years may have already used part or all of their 60 months without realising it. If you have been working in the Netherlands for a long time, ask your agency or a Dutch tax advisor to check your remaining ET eligibility.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "ET Scheme Netherlands 2026 — Explained for Agency Workers",
  description: "Complete explanation of the Dutch ET (Extraterritorial costs) benefit for EU agency workers: who qualifies, how much it's worth, and how to check your payslip.",
  author: { "@type": "Organization", name: "AgencyCheck" },
  publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
  datePublished: "2026-01-01",
  dateModified: "2026-05-01",
  inLanguage: "en",
  url: "https://agencycheck.io/et-scheme-netherlands-explained",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://agencycheck.io" },
    { "@type": "ListItem", position: 2, name: "Guides", item: "https://agencycheck.io/guides" },
    { "@type": "ListItem", position: 3, name: "ET Scheme Explained", item: "https://agencycheck.io/et-scheme-netherlands-explained" },
  ],
};

export default async function EtSchemePage() {
  const featuredAgencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-950 text-white border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-12">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300">Guides</Link>
            <span>/</span>
            <span className="text-gray-400">ET Scheme Explained</span>
          </nav>
          <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">2026 Tax Benefit Guide</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            ET Scheme Netherlands —<br className="hidden sm:block" />
            <span className="text-amber-400">Up to €150/week extra, tax-free</span>
          </h1>
          <p className="text-base text-gray-300 leading-relaxed mb-6">
            The <strong className="text-white">ET (Extraterritoriale kosten)</strong> scheme is a legal Dutch tax benefit
            that most EU agency workers qualify for — but the majority have never heard of it.
            If your agency applies it correctly, your net take-home pay can increase by <strong className="text-white">€50–€150 every week</strong>,
            without earning a single euro more in gross wages. This guide explains everything.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {["Based on Art. 31a Wet LB 1964", "Qualifies if >150km from NL border", "Valid for 5 years (60 months)", "Check: 'ET vergoeding' on payslip"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-semibold text-gray-300">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ─────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
            The numbers — WML worker, 40h/week
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Same gross wage. Same agency housing. Same job. The only difference is whether the ET scheme is applied.
          </p>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-900 px-5 py-3 gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Line item</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Without ET</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 text-right">With ET</span>
            </div>
            <div className="divide-y divide-gray-100">
              {COMPARISON.map((row) => (
                <div key={row.label} className={`grid grid-cols-3 gap-4 px-5 py-3 items-center ${row.label.startsWith("Nettoloon") ? "bg-amber-50 font-black" : ""}`}>
                  <div>
                    <span className="text-sm text-gray-700">{row.label}</span>
                    {row.note && <p className="text-[10px] text-gray-400 mt-0.5">{row.note}</p>}
                  </div>
                  <span className="text-sm text-right font-mono text-gray-600">{row.without}</span>
                  <span className={`text-sm text-right font-mono font-bold ${row.label.startsWith("ET") ? "text-amber-600" : row.label.startsWith("Nettoloon") ? "text-emerald-700 text-base" : "text-gray-600"}`}>
                    {row.with_et}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Example based on WML 2026 (€14.71/hr × 40h/week = €588 gross). ET vergoeding calculated at typical agency rate.
            Actual amounts vary by agency and individual circumstances.
          </p>
        </div>
      </section>

      {/* ── Who qualifies ────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Who qualifies for the ET scheme?</h2>
          <p className="text-sm text-gray-500 mb-8">All three conditions must be met simultaneously.</p>
          <div className="space-y-5">
            {QUALIFICATIONS.map((q, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <span className="text-3xl shrink-0">{q.icon}</span>
                <div>
                  <h3 className="text-base font-black text-gray-900 mb-1.5">{q.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{q.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="text-sm text-emerald-800 leading-relaxed">
              <strong>Quick check:</strong> Are you from Poland, Romania, Bulgaria, Slovakia, Hungary, Ukraine, or another country more than 150km from the Netherlands?
              Have you been in the Netherlands for fewer than 5 years?
              If both are yes — you likely qualify. Ask your agency recruiter whether your contract includes ET vergoeding.
            </p>
          </div>
        </div>
      </section>

      {/* ── How to check payslip ─────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">How to check your payslip for ET</h2>
          <p className="text-sm text-gray-500 mb-6">
            Different agencies use different labels. Look for any of these on your <strong>loonstrook</strong>:
          </p>
          <div className="space-y-3">
            {PAYSLIP_CHECKS.map((c, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 font-mono">{c.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>None of these appear on your payslip?</strong> Ask your recruiter directly:
              <em className="text-gray-600"> "Wordt de ET-vergoeding op mijn loonstrook toegepast en zo niet, waarom niet?"</em>
              (Is the ET allowance applied to my payslip, and if not, why not?)
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-8">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white px-5 py-5">
                <h3 className="text-sm font-black text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agency CTA ───────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="text-center mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Apply through AgencyCheck</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Find agencies that apply the ET scheme</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              When you apply via AgencyCheck, you can ask the recruiter directly about ET vergoeding before signing.
              Free to apply — WhatsApp response same day.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {featuredAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} jobCount={getJobCountForAgency(agency.slug)} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/vacancies" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-6 py-3 text-sm font-bold text-gray-700">
              Browse all open vacancies →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related ──────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-base font-black text-gray-900 mb-4">Related guides</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/how-to-read-dutch-payslip",        label: "How to read your Dutch payslip" },
              { href: "/bsn-number-netherlands-guide",      label: "How to get your BSN number" },
              { href: "/after-you-apply",                   label: "What happens after you apply" },
              { href: "/tools/real-salary-calculator",      label: "Net salary calculator Netherlands" },
              { href: "/what-is-order-picking",             label: "Order picking — salary and conditions" },
              { href: "/work-in-netherlands-for-foreigners", label: "Complete guide for foreign workers" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors px-4 py-3 text-sm font-semibold text-gray-700">
                <span className="text-gray-400">→</span> {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
