import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Minimum Wage Netherlands 2026 — Hourly & Monthly Rates for Agency Workers",
  description:
    "The Dutch minimum wage (WML) in 2026: exact hourly rate, monthly amount, how loonheffing and deductions affect your real net pay, and what agencies must legally pay.",
  alternates: { canonical: "https://agencycheck.io/minimum-wage-netherlands-2026" },
  openGraph: {
    title: "Minimum Wage Netherlands 2026 — What You Actually Take Home",
    description:
      "Dutch WML 2026: hourly rate, monthly gross, net pay after tax. What agencies must include, what they can legally deduct, and how to check your payslip.",
  },
};

export const dynamic = "force-static";

// ─── WML rate table ──────────────────────────────────────────────────────────
const WML_RATES = [
  { period: "Per hour (40h/wk)",   gross: "€13.68",  note: "Applies to all workers 21+ regardless of nationality" },
  { period: "Per hour (38h/wk)",   gross: "€14.40",  note: "If your contract specifies 38-hour week" },
  { period: "Per hour (36h/wk)",   gross: "€15.20",  note: "Depends on collective agreement (CAO)" },
  { period: "Per week (40h)",      gross: "€547.20", note: "Before loonheffing, premiums, and deductions" },
  { period: "Per month (40h)",     gross: "€2,373",  note: "52 weeks × €547.20 ÷ 12" },
  { period: "Vakantiegeld (8%)",   gross: "+€189/mo",note: "Saved monthly, paid out in May (ABU CAO) or on request" },
];

// ─── Legal deductions ────────────────────────────────────────────────────────
const LEGAL_DEDUCTIONS = [
  {
    icon: "🏠",
    label: "Housing (huisvesting)",
    max: "€113.50/wk",
    rule: "SNF maximum 2026 — only if housing is actually provided and SNF-certified. Cannot exceed 25% of your gross hourly wage × hours worked.",
    allowed: true,
  },
  {
    icon: "🚌",
    label: "Transport (vervoerskosten)",
    max: "Actual cost",
    rule: "Can be deducted only if the agency arranges your transport. Must be itemised on your payslip. Cannot include a profit margin on transport.",
    allowed: true,
  },
  {
    icon: "🏥",
    label: "Health insurance (zorgverzekering)",
    max: "~€170/mo",
    rule: "Agency collective health schemes are legal deductions only if you have opted in. Basic Dutch health insurance (basisverzekering) is legally required once you work in NL.",
    allowed: true,
  },
  {
    icon: "❌",
    label: "Recruitment / placement fee",
    max: "€0",
    rule: "Completely prohibited. Since the WAADI amendment (Wet Toelating Terbeschikkingstelling van Arbeidskrachten, 2024), agencies cannot charge workers any fee for finding them a job. Report violations to the Inspectie SZW.",
    allowed: false,
  },
  {
    icon: "❌",
    label: "Uniform / workwear",
    max: "€0",
    rule: "Cannot be charged to the worker if the clothing is required specifically for the job (safety vest, steel-toe boots for warehouse). Optional branded clothing may be charged only with written consent.",
    allowed: false,
  },
  {
    icon: "❌",
    label: "ID / document fees",
    max: "€0",
    rule: "Administrative costs of processing your registration, BSN check, or DigiD setup cannot be charged to you. Prohibited under Wet minimumloon (WML) Article 12.",
    allowed: false,
  },
];

// ─── Net pay example ─────────────────────────────────────────────────────────
const NET_EXAMPLE = [
  { label: "Gross weekly wage (40h @ WML)",           amount: "+€547",  plus: true  },
  { label: "Loonheffing (income tax, with heffingskorting)", amount: "−€60",  plus: false },
  { label: "WW-premie (unemployment insurance)",       amount: "−€22",   plus: false },
  { label: "ZW/WIA premiums (illness/disability)",     amount: "−€14",   plus: false },
  { label: "Zorgverzekering (health insurance)",       amount: "−€40",   plus: false },
  { label: "Huisvesting (SNF housing, if taken)",      amount: "−€95",   plus: false },
  { label: "Transport (if agency arranges)",           amount: "−€25",   plus: false },
  { label: "Nettoloon (take-home)",                    amount: "≈ €291", plus: true  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What is the minimum wage in the Netherlands in 2026?",
    a: "The Dutch statutory minimum wage (Wettelijk Minimumloon, WML) for workers aged 21 and over working a 40-hour week is €13.68 per hour, €547.20 per week, and approximately €2,373 per month (gross). These rates are updated by the Dutch government on 1 January and 1 July each year based on average wage development. From July 2023, the minimum wage has applied to all workers over 21 regardless of age — the old age-graduated scale was abolished.",
  },
  {
    q: "Is the minimum wage the same for EU workers and Dutch workers?",
    a: "Yes. The Dutch WML applies to all workers in the Netherlands regardless of nationality. Polish, Romanian, Bulgarian, Slovak, or any other EU workers working in the Netherlands must receive at least the WML. Paying below the WML is illegal and can be reported to the Dutch Labour Authority (Inspectie SZW / Netherlands Labour Authority). The ABU and NBBU collective agreements that govern agency work also set the WML as the legal floor.",
  },
  {
    q: "Can an agency pay below minimum wage by deducting housing and transport?",
    a: "No. Deductions for housing and transport are subject to strict limits and cannot bring your net pay below the statutory net minimum wage. The maximum housing deduction is €113.50/week (SNF maximum 2026), and it can only be taken if you actually live in agency-provided housing. If you suspect your take-home pay after deductions is below the legal minimum, you can file a report with the Inspectie SZW (Dutch labour inspectorate) or contact the FNV union.",
  },
  {
    q: "What is vakantiegeld and is it on top of the minimum wage?",
    a: "Vakantiegeld (holiday pay) is an additional 8% of your gross annual wage, required by law under Article 15 of the Wet minimumloon. For a full-time WML worker this is approximately €189/month, paid as a lump sum in May under the ABU CAO or built into your hourly rate in NBBU phase contracts. It is on top of your regular wage, not included in it — so the effective hourly rate including vakantiegeld is approximately €14.77/hour at WML.",
  },
  {
    q: "Does overtime pay more than the minimum wage?",
    a: "Yes. Under the ABU CAO, hours beyond 40 per week (overwerktoeslag) are paid at 125% of your normal hourly rate for the first 8 extra hours, and 150% from the 9th extra hour onwards. Your normal hourly rate may be higher than WML if your job is classified under a pay scale (loonschaal) in the relevant sector CAO — for example, logistics, food processing, or metalworking each have their own CAO rates above the WML floor.",
  },
];

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Minimum Wage Netherlands 2026 — Hourly & Monthly Rates for Agency Workers",
      "description": "The Dutch WML in 2026: exact rates, legal deductions, net pay examples, and worker rights.",
      "url": "https://agencycheck.io/minimum-wage-netherlands-2026",
      "datePublished": "2026-01-01",
      "dateModified": "2026-05-01",
      "author": { "@type": "Organization", "name": "AgencyCheck" },
      "publisher": { "@type": "Organization", "name": "AgencyCheck", "url": "https://agencycheck.io" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQS.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",   "item": "https://agencycheck.io" },
        { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://agencycheck.io/guides" },
        { "@type": "ListItem", "position": 3, "name": "Minimum Wage Netherlands 2026" },
      ],
    },
  ],
};

export default function MinimumWage2026Page() {
  const agencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* ── Header ── */}
        <header className="bg-gray-900 text-white">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300 transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-gray-200">Minimum Wage 2026</span>
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-10 pt-4">
            <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🇳🇱 Dutch Labour Law — Updated 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Minimum Wage Netherlands 2026
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              The Dutch statutory minimum wage (WML — Wettelijk Minimumloon) sets the legal floor
              for all workers in the Netherlands. Here are the exact 2026 figures, what agencies
              can and cannot deduct, and what your real take-home pay looks like.
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 space-y-14">

          {/* ── Rate table ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">2026 WML Rates</h2>
            <p className="text-gray-600 text-sm mb-5">
              Rates below are for workers aged 21+. Since July 2023, the WML applies uniformly
              regardless of age (the old scale for under-21s was replaced by a youth minimum wage
              scale that no longer affects adult workers). The government updates rates on
              <strong> 1 January</strong> and <strong>1 July</strong> each year.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Period</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Gross amount</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {WML_RATES.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-medium text-gray-900">{r.period}</td>
                      <td className="px-4 py-3 font-bold text-emerald-700">{r.gross}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Source: Rijksoverheid.nl — Wettelijk minimumloon en minimumjeugdloon per 1 januari 2026.
              Rates updated bi-annually. Check rijksoverheid.nl for the most current figures after July 2026.
            </p>
          </section>

          {/* ── Net pay example ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What You Actually Take Home</h2>
            <p className="text-gray-600 text-sm mb-5">
              Gross wage is not what lands in your bank account. Here is a realistic weekly breakdown
              for an agency worker on WML with agency housing and transport — the most common setup.
            </p>
            <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {NET_EXAMPLE.map((row, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center px-5 py-3 text-sm ${
                    i === NET_EXAMPLE.length - 1
                      ? "bg-emerald-50 border-t-2 border-emerald-200 font-bold"
                      : i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <span className={i === NET_EXAMPLE.length - 1 ? "text-gray-900 font-bold" : "text-gray-700"}>
                    {row.label}
                  </span>
                  <span className={`font-semibold tabular-nums ${row.plus ? "text-emerald-700" : "text-red-600"}`}>
                    {row.amount}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Estimates based on 2026 rates. Loonheffing calculated with algemene heffingskorting and
              arbeidskorting applied. Actual amounts vary by hours worked, contract phase, and deduction
              arrangements. Always check your own loonstrook.
            </p>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-blue-800 mb-1">💡 ET vergoeding can add €50–€150/week</p>
              <p className="text-blue-700">
                If you live more than 150km from the Dutch border (Poland, Romania, Bulgaria, Slovakia),
                you may qualify for the ET (Extraterritoriale kosten) benefit — a tax-free reimbursement
                that significantly increases your net pay. Not all agencies apply it.{" "}
                <Link href="/et-scheme-netherlands-explained" className="underline font-semibold">
                  See our ET scheme guide →
                </Link>
              </p>
            </div>
          </section>

          {/* ── Legal deductions ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What Agencies Can and Cannot Deduct</h2>
            <p className="text-gray-600 text-sm mb-5">
              Dutch law strictly limits what may be deducted from your wage. Under the Wet minimumloon
              (Article 12) and WAADI (2024 amendment), these rules apply to all agency workers in the Netherlands.
            </p>
            <div className="space-y-3">
              {LEGAL_DEDUCTIONS.map((d, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-4 text-sm flex gap-3 ${
                    d.allowed
                      ? "bg-white border-gray-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <span className="text-2xl shrink-0">{d.icon}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{d.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        d.allowed
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {d.allowed ? `Max: ${d.max}` : "PROHIBITED"}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{d.rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ABU/NBBU CAO note ── */}
          <section className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-3">ABU and NBBU CAO — Above WML</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Most agency workers in the Netherlands are employed under either the{" "}
              <strong className="text-white">ABU CAO</strong> (Algemene Bond Uitzendondernemingen —
              the larger agencies) or the <strong className="text-white">NBBU CAO</strong> (smaller
              agencies). Both set pay rules above and beyond the statutory WML:
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Phase A (weeks 1–26):</strong> WML floor. After week
                  26 you move to Phase B, which may carry higher scale rates.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Inlenersbeloning:</strong> After 26 weeks at the same
                  client company, you are entitled to the same wage as direct-hire employees doing the
                  same work (Article 8, WAADI). This often means a pay increase.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Overwerktoeslag:</strong> Overtime (hours beyond 40/wk)
                  at 125% for first 8 extra hours, 150% beyond that (ABU CAO).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Vakantiegeld:</strong> 8% holiday pay — legally required,
                  must appear on every payslip as a separate line (vakantiegeld opbouw).
                </span>
              </li>
            </ul>
          </section>

          {/* ── Payslip check ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Checklist: Is Your Agency Paying Correctly?</h2>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {[
                "Your hourly rate is at least €13.68 (40h/wk) or €14.40 (38h/wk)",
                "Vakantiegeld (8%) appears as a separate line on your loonstrook",
                "Loonheffing is calculated using your BSN — not the emergency anoniementarief",
                "Housing deduction is not more than €113.50/week (SNF maximum)",
                "You were shown all deductions in writing before you signed your contract",
                "No 'placement fee', 'recruitment cost', or 'document fee' is deducted",
                "Overtime hours are marked as overwerk and paid at 125% or higher",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 text-sm">
                  <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Not sure how to read your payslip?{" "}
              <Link href="/how-to-read-dutch-payslip" className="text-blue-600 underline font-medium">
                See our full loonstrook guide →
              </Link>
            </p>
          </section>

          {/* ── Agency CTA ── */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Find a verified agency</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Work in the Netherlands at full WML — with transparent deductions
            </h2>
            <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
              All agencies on AgencyCheck show their deductions in advance. SNF-certified housing,
              no placement fees, and contracts reviewed before you commit. Free to apply via WhatsApp.
            </p>
            <Link
              href="/vacancies"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Browse jobs with verified agencies →
            </Link>
          </section>

          {/* ── Agencies ── */}
          {agencies.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Agencies hiring right now</h2>
              <div className="grid gap-4">
                {agencies.map((a) => (
                  <AgencyCard key={a.slug} agency={a} jobCount={getJobCountForAgency(a.slug)} />
                ))}
              </div>
            </section>
          )}

          {/* ── FAQ ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
            <div className="space-y-5">
              {FAQS.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{f.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Related ── */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-base font-bold text-gray-700 mb-4">Related guides</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/how-to-read-dutch-payslip",       label: "How to read your Dutch payslip (loonstrook)" },
                { href: "/et-scheme-netherlands-explained",  label: "ET scheme — earn up to €150/wk extra net" },
                { href: "/bsn-number-netherlands-guide",     label: "BSN number — how to get it fast" },
                { href: "/vacancies",                        label: "Browse jobs in the Netherlands" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
                >
                  <span className="text-emerald-500">→</span>
                  {l.label}
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
