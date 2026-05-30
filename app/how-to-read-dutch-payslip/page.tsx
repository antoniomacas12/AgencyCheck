import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "How to Read a Dutch Payslip (Loonstrook) — Line by Line Explained 2026",
  description:
    "Every line of your Dutch loonstrook explained in plain English: brutoloon, loonheffing, heffingskorting, vakantiegeld, ET toeslag, and more. With worked examples at WML (€14.71/hr).",
  alternates: { canonical: "https://agencycheck.io/how-to-read-dutch-payslip" },
  openGraph: {
    title: "How to Read a Dutch Payslip (Loonstrook) — 2026 Guide",
    description:
      "Confused by your Dutch payslip? Every line explained with real numbers — brutoloon, nettoloon, vakantiegeld, ET toeslag, heffingskorting.",
  },
};

export const dynamic = "force-static";

// ─── Loonstrook field breakdown ───────────────────────────────────────────────
const LOONSTROOK_FIELDS = [
  {
    term: "Brutoloon",
    english: "Gross wage",
    example: "+€588.40",
    positive: true,
    explain:
      "Your total earnings before any deductions. At WML (€14.71/hr × 40h/week) this is €588.40/week. This is the number agencies advertise — not what you take home.",
  },
  {
    term: "Vakantiegeld (8%)",
    english: "Holiday allowance",
    example: "+€47.07",
    positive: true,
    explain:
      "Legally required 8% of your gross wage, accumulated weekly and paid out once per year (usually May/June) or monthly. It is YOUR money — agencies must pay it under Dutch law (Burgerlijk Wetboek Art. 7:634).",
  },
  {
    term: "Loonheffing",
    english: "Wage tax (income tax + national insurance)",
    example: "−€63.20",
    positive: false,
    explain:
      "The combined Dutch income tax and national insurance premium (volksverzekeringen: AOW, Anw, Wlz). This is withheld by your employer each period. For most foreign workers on WML the effective rate after heffingskorting is around 10–15%, not the headline 37%.",
  },
  {
    term: "Heffingskorting",
    english: "Tax credit",
    example: "+€38.50",
    positive: true,
    explain:
      "A statutory tax credit that reduces your loonheffing. There are two: arbeidskorting (labour tax credit, up to €5,158/yr) and algemene heffingskorting (general tax credit, up to €3,362/yr). If your employer applies both, you keep significantly more. Ask your recruiter to confirm both are applied.",
  },
  {
    term: "WW-premie werknemer",
    english: "Unemployment insurance premium (employee share)",
    example: "−€7.06",
    positive: false,
    explain:
      "Your employee contribution to WW (Werkloosheidswet — Dutch unemployment insurance). The rate for temporary agency workers (uitzendbeding) is higher than for permanent workers. This is deducted from gross before nettoloon is calculated.",
  },
  {
    term: "ET vergoeding / ET toeslag",
    english: "Extraterritorial costs reimbursement",
    example: "+€80.00",
    positive: true,
    explain:
      "The ET (Extraterritoriale kosten) benefit is a tax-free reimbursement of 'extraterritorial costs' — extra expenses of living outside your home country. It can be worth €50–€150/week NET and is only available to workers who live more than 150km from the Dutch border. NOT all agencies apply this. See our ET guide for full details.",
  },
  {
    term: "Huisvesting / Woning",
    english: "Housing deduction",
    example: "−€95.00",
    positive: false,
    explain:
      "The weekly cost of agency-provided accommodation, deducted directly from gross. The SNF (Stichting Normering Flexwonen) legal maximum for certified shared accommodation is €113.50/week (2026). This amount must match exactly what is written in your contract — no more.",
  },
  {
    term: "Zorgverzekering",
    english: "Health insurance premium",
    example: "−€35.00",
    positive: false,
    explain:
      "Dutch health insurance (basisverzekering) is mandatory for all workers in the Netherlands. Many agencies provide a collective insurance and deduct the premium (typically €28–€40/week) directly. You should receive confirmation of your coverage within the first two weeks. Keep this document.",
  },
  {
    term: "Transport / Reiskosten",
    english: "Transport to work",
    example: "−€25.00",
    positive: false,
    explain:
      "The cost of the agency bus or transport to the worksite, if charged. Under CAO rules this must appear as a separately named line — it cannot be bundled into housing. Typical range: €20–€35/week. If your contract says transport is included, this line should not appear.",
  },
  {
    term: "Nettoloon",
    english: "Net wage (take-home pay)",
    example: "€363.00",
    positive: true,
    explain:
      "The amount transferred to your bank account. This is brutoloon minus all deductions (tax, housing, insurance, transport) plus credits (heffingskorting, ET toeslag if applicable). At WML without ET benefit, typical net is €310–€370/week. With ET benefit applied, it can be €380–€450/week.",
  },
];

// ─── Common abbreviations ─────────────────────────────────────────────────────
const ABBREVIATIONS = [
  { abbr: "WML",  full: "Wettelijk Minimumloon",             eng: "Statutory minimum wage (€14.71/hr in 2026)" },
  { abbr: "CAO",  full: "Collectieve Arbeidsovereenkomst",    eng: "Collective labour agreement (sets your rights)" },
  { abbr: "ABU",  full: "Alg. Bond Uitzendondernemingen",     eng: "Main temp agency industry association" },
  { abbr: "SNF",  full: "St. Normering Flexwonen",           eng: "Independent housing inspection body" },
  { abbr: "BSN",  full: "Burgerservicenummer",               eng: "Your Dutch citizen service number (tax ID)" },
  { abbr: "ET",   full: "Extraterritoriale kosten",          eng: "Extraterritorial costs — tax-free benefit" },
  { abbr: "VGU",  full: "Vakantiegeld uitbetaling",          eng: "Holiday pay payout" },
  { abbr: "AOW",  full: "Algemene Ouderdomswet",             eng: "Dutch state pension contribution" },
  { abbr: "WW",   full: "Werkloosheidswet",                  eng: "Unemployment insurance premium" },
  { abbr: "Wlz",  full: "Wet langdurige zorg",              eng: "Long-term care insurance" },
  { abbr: "BWA",  full: "Bijzondere beloningen werknemer",   eng: "Special employee benefits (e.g. year-end bonus)" },
];

// ─── Checklist ────────────────────────────────────────────────────────────────
const CHECKLIST = [
  { check: "Brutoloon matches your contracted hourly rate × hours worked this period" },
  { check: "Vakantiegeld (holiday pay) of exactly 8% is shown — not 0% or missing" },
  { check: "Heffingskorting is applied — both arbeidskorting AND algemene heffingskorting" },
  { check: "Huisvesting deduction matches exactly what your contract says — not a cent more" },
  { check: "Transport appears as its own line if charged — not hidden inside housing" },
  { check: "ET vergoeding appears if you live >150km from the Dutch border" },
  { check: "Net pay (nettoloon) matches the bank transfer you received" },
  { check: "You received this payslip within 5 days of your payment date" },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What is the difference between brutoloon and nettoloon?",
    a: "Brutoloon is your gross wage — the total you earn before any deductions. Nettoloon is your actual take-home pay after Dutch income tax (loonheffing), social insurance premiums, housing, transport, and health insurance have been deducted. At WML (€14.71/hr, 40h/week), brutoloon is €588/week and typical nettoloon is €310–€370/week without the ET scheme.",
  },
  {
    q: "What is vakantiegeld and when do I receive it?",
    a: "Vakantiegeld (holiday allowance) is a mandatory 8% of your gross wage, required by Dutch law (BW Art. 7:634). Most agencies accumulate it each pay period and pay it out once per year, typically in May or June. Some agencies pay it monthly. Either way, the 8% must be shown on every payslip. If it is missing, request an explanation in writing.",
  },
  {
    q: "Why is my loonheffing so much lower than the 37% income tax rate?",
    a: "The Dutch income tax rate of 37% applies to annual income above a threshold. At WML for a 40-hour week (approximately €30,600/year gross), you fall in the lower bracket. On top of that, the heffingskorting (tax credits — arbeidskorting plus algemene heffingskorting) can reduce your effective rate to 10–15%. If you also qualify for the ET benefit, effective tax can drop below 5% on the reimbursed portion.",
  },
  {
    q: "Can my agency deduct more than what is in my contract?",
    a: "No. Under Dutch law and the ABU/NBBU CAO, deductions may only be made for services explicitly listed and priced in your signed contract. Additional deductions for bedding, cleaning, or admin that were not specified before you signed are not permitted. If you see unexpected deductions, request a written explanation and if necessary contact the Inspectie SZW (inspectieszw.nl) or FNV.",
  },
  {
    q: "My payslip shows zero ET vergoeding — am I missing money?",
    a: "Possibly. The ET (Extraterritoriale kosten) benefit applies to workers who live more than 150km from the Dutch border and have been in the Netherlands for fewer than 5 years. If you meet these criteria and your payslip shows no ET vergoeding, ask your agency recruiter directly. Not all agencies apply it, even when workers qualify. Switching to an agency that does apply it can increase your net income by €50–€150/week.",
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
  headline: "How to Read a Dutch Payslip (Loonstrook) — Line by Line Explained 2026",
  description: "Complete breakdown of every field on a Dutch agency worker payslip, with worked examples at WML (€14.71/hr).",
  author: { "@type": "Organization", name: "AgencyCheck" },
  publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
  datePublished: "2026-01-01",
  dateModified: "2026-05-01",
  inLanguage: "en",
  url: "https://agencycheck.io/how-to-read-dutch-payslip",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://agencycheck.io" },
    { "@type": "ListItem", position: 2, name: "Guides", item: "https://agencycheck.io/guides" },
    { "@type": "ListItem", position: 3, name: "How to Read a Dutch Payslip", item: "https://agencycheck.io/how-to-read-dutch-payslip" },
  ],
};

export default async function HowToReadDutchPayslipPage() {
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
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300 transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-gray-400">Dutch Payslip Explained</span>
          </nav>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3">2026 Salary Guide</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            How to Read a Dutch Payslip<br className="hidden sm:block" />
            <span className="text-emerald-400"> (Loonstrook)</span> — Every Line Explained
          </h1>
          <p className="text-base text-gray-300 leading-relaxed mb-6">
            Every agency worker in the Netherlands receives a <strong className="text-white">loonstrook</strong> (payslip) each week or month.
            Most workers understand only the first and last lines — gross and net. The 8–12 lines in between
            determine whether you are being paid correctly. This guide explains every single one.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {[
              "WML 2026: €14.71/hr",
              "Vakantiegeld: 8% mandatory",
              "SNF max housing: €113.50/wk",
              "ET benefit: up to €150/wk",
            ].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-semibold text-gray-300">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Example payslip summary ──────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
            Example: WML worker, 40 hours/week
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Based on the Dutch statutory minimum wage (WML) of €14.71/hr in 2026. Numbers vary slightly per agency and period length.
          </p>

          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 px-5 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Loonstrook — Week example · WML €14.71/hr · 40 hours · Agency housing + transport included
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {LOONSTROOK_FIELDS.map((f) => (
                <div key={f.term} className={`px-5 py-4 ${f.term === "Nettoloon" ? "bg-emerald-50" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-gray-900">{f.term}</span>
                        <span className="text-[10px] font-semibold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">{f.english}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{f.explain}</p>
                    </div>
                    <span className={`shrink-0 text-sm font-black tabular-nums ${f.positive ? "text-emerald-600" : "text-red-500"} ${f.term === "Nettoloon" ? "text-emerald-700 text-base" : ""}`}>
                      {f.example}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
              <p className="text-[11px] text-gray-400">
                * ET vergoeding shown applies if you live more than 150km from the Dutch border and have been in the Netherlands fewer than 5 years.{" "}
                <Link href="/et-scheme-netherlands-explained" className="text-blue-600 underline">See full ET guide →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Abbreviations table ──────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Common abbreviations on Dutch payslips</h2>
          <p className="text-sm text-gray-500 mb-6">
            Dutch payslips use a lot of abbreviations. These are the ones you will see most often.
          </p>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {ABBREVIATIONS.map((a) => (
                <div key={a.abbr} className="grid grid-cols-[60px_1fr_1fr] gap-3 px-5 py-3 items-start">
                  <span className="text-sm font-black text-gray-900 font-mono">{a.abbr}</span>
                  <span className="text-xs text-gray-700">{a.full}</span>
                  <span className="text-xs text-gray-500">{a.eng}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Weekly checklist ─────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">8-point payslip check — do this every pay period</h2>
          <p className="text-sm text-gray-500 mb-6">
            Takes 5 minutes. Catches errors before they accumulate. Your employer is legally required to give you a payslip — if you are not receiving one, ask in writing.
          </p>
          <ul className="space-y-3">
            {CHECKLIST.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5">
                <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                <span className="text-sm text-gray-700 leading-snug">{item.check}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Found a discrepancy?</strong> First, ask your agency recruiter for a written explanation.
              If unresolved, contact <strong>Inspectie SZW</strong> at{" "}
              <a href="https://www.inspectieszw.nl" target="_blank" rel="noopener noreferrer" className="underline">inspectieszw.nl</a>{" "}
              or <strong>FNV</strong> (the main Dutch trade union, free for workers) at{" "}
              <a href="https://www.fnv.nl" target="_blank" rel="noopener noreferrer" className="underline">fnv.nl</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ── ET callout ───────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-6">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-200 rounded-full px-3 py-1 text-[11px] font-black text-amber-800 uppercase tracking-wide mb-4">
              💡 Most workers miss this
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-2">
              Is "ET vergoeding" on your payslip? If not, you may be missing €50–€150/week
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              The ET (Extraterritoriale kosten) scheme is a legal tax-free reimbursement available to workers
              who live more than 150km from the Dutch border. It can add €50–€150/week to your net income
              by covering a portion of the extra costs of working abroad. It is not automatic — the agency
              must apply it. Many do not.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/et-scheme-netherlands-explained"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors px-5 py-2.5 text-sm font-black text-white active:scale-[0.98]">
                Read the full ET guide →
              </Link>
              <Link href="/tools/real-salary-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition-colors px-5 py-2.5 text-sm font-bold text-amber-800">
                Calculate your real net income →
              </Link>
            </div>
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
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Find an agency with transparent contracts</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Every agency on AgencyCheck shows net weekly estimates, housing costs, and contract terms up front.
              Free to apply via WhatsApp — same-day response.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {featuredAgencies.map((agency) => (
              <AgencyCard
                key={agency.slug}
                agency={agency}
                jobCount={getJobCountForAgency(agency.slug)}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/vacancies"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-6 py-3 text-sm font-bold text-gray-700">
              Browse all open vacancies →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Internal links ───────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-base font-black text-gray-900 mb-4">Related guides</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/et-scheme-netherlands-explained",   label: "ET scheme Netherlands — full guide" },
              { href: "/bsn-number-netherlands-guide",      label: "How to get your BSN number" },
              { href: "/after-you-apply",                   label: "What happens after you apply" },
              { href: "/what-is-order-picking",             label: "Order picking — salary & what to expect" },
              { href: "/tools/real-salary-calculator",      label: "Real salary calculator (net income)" },
              { href: "/methodology",                       label: "How AgencyCheck verifies agencies" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors px-4 py-3 text-sm font-semibold text-gray-700">
                <span className="text-gray-400">→</span> {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
