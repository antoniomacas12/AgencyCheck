import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Work in the Netherlands from Romania — Jobs, Salary & Housing 2026 | AgencyCheck",
  description:
    "Romanian workers guide to finding agency work in the Netherlands. Real salary figures, best agencies for Romanians, housing costs, BSN number, documents and what to expect.",
  alternates: { canonical: "https://agencycheck.io/work-netherlands-from-romania" },
  openGraph: {
    title: "Work in the Netherlands from Romania — 2026 Guide",
    description:
      "Everything Romanian workers need to know about agency work in the Netherlands. Jobs, salary, housing, documents and the agencies that hire most Romanians.",
  },
};

const topAgencies = ALL_AGENCIES.filter((a) => a.transparencyScore >= 40)
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 8);

export default function WorkNetherlandsFromRomaniaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Work in the Netherlands from Romania — 2026 Guide",
            "description": "Complete guide for Romanian workers seeking agency employment in the Netherlands.",
            "url": "https://agencycheck.io/work-netherlands-from-romania",
            "datePublished": "2026-01-01",
            "dateModified": "2026-05-01",
            "publisher": { "@type": "Organization", "name": "AgencyCheck" },
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Work in Netherlands from Romania</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-1 font-medium">
            🇷🇴 → 🇳🇱 Romania to Netherlands
          </span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            Updated May 2026
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          Work in the Netherlands from Romania — Complete Guide 2026
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Romanian workers are one of the largest groups in the Dutch labour market, making up
          a significant share of all logistics and production agency workers. The Netherlands
          pays roughly 5–7× the average Romanian wage for the same type of physical work —
          here is everything you need to know before you make the move.
        </p>
      </div>

      {/* Contents */}
      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-sm">
        <p className="font-semibold text-gray-800 mb-2">Contents</p>
        <ol className="space-y-1 list-decimal list-inside text-gray-600 text-xs">
          <li><a href="#right-to-work" className="hover:text-brand-600">Do Romanians need a work permit?</a></li>
          <li><a href="#salary" className="hover:text-brand-600">How much can you earn?</a></li>
          <li><a href="#documents" className="hover:text-brand-600">Documents to bring from Romania</a></li>
          <li><a href="#bsn" className="hover:text-brand-600">BSN number — how to get it</a></li>
          <li><a href="#housing" className="hover:text-brand-600">Agency housing — costs and rules</a></li>
          <li><a href="#agencies" className="hover:text-brand-600">Best agencies for Romanian workers</a></li>
          <li><a href="#rights" className="hover:text-brand-600">Your rights in the Netherlands</a></li>
          <li><a href="#faq" className="hover:text-brand-600">FAQ</a></li>
        </ol>
      </nav>

      {/* Section 1 */}
      <section id="right-to-work" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Do Romanian citizens need a work permit?</h2>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm mb-3">
          <p className="font-bold text-green-800 text-base mb-1">✅ No work permit needed.</p>
          <p className="text-green-700 text-xs leading-relaxed">
            Romania joined the EU in 2007, and since 2014, Romanian citizens have had full and
            unrestricted access to the Dutch labour market. You can work in any job, for any employer,
            without applying for any permit. Your Romanian ID card is sufficient documentation.
          </p>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          The only administrative step you need to take after starting work is registering for a BSN
          number — this happens in the Netherlands, typically through your employer or agency.
        </p>
      </section>

      {/* Section 2: Salary */}
      <section id="salary" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">2. How much can you earn in the Netherlands?</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          The Dutch minimum wage (WML) in 2026 is <strong>€14.71/hour</strong>. At current exchange
          rates this is approximately RON 73–77/hour — compared to a typical Romanian manufacturing
          wage of RON 14–22/hour. Here is the income reality broken down:
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Job</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Gross/hr</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Net/week (40h)</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">After housing (€120/wk)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { job: "Order picker / warehouse", rate: "€14.71–€15.50", net: "~€345–€375", after: "~€225–€255" },
                { job: "Production / food processing", rate: "€14.71–€16.00", net: "~€345–€390", after: "~€225–€270" },
                { job: "Forklift operator (with cert)", rate: "€16.00–€20.00", net: "~€385–€490", after: "~€265–€370" },
                { job: "Night shift (+22% ABU premium)", rate: "+22% on base", net: "+~€75/wk", after: "+~€75/wk" },
              ].map((row) => (
                <tr key={row.job} className="border-b border-gray-100">
                  <td className="p-2 border border-gray-200 text-xs text-gray-700">{row.job}</td>
                  <td className="p-2 border border-gray-200 text-xs font-semibold text-green-700">{row.rate}</td>
                  <td className="p-2 border border-gray-200 text-xs text-gray-600">{row.net}</td>
                  <td className="p-2 border border-gray-200 text-xs font-bold text-brand-700">{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400">
          Net figures assume single worker on standard tax table 1. Holiday pay (8% annually, paid in May) not included above.
        </p>
        <Link href="/tools/real-income-calculator" className="block mt-3 text-xs text-brand-600 hover:underline font-medium">
          → Calculate your exact net weekly income →
        </Link>
      </section>

      {/* Section 3: Documents */}
      <section id="documents" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Documents to bring from Romania</h2>
        <div className="space-y-2 text-sm">
          {[
            { doc: "Romanian EU ID card (Carte de identitate)", required: true, note: "Must be valid for the full duration of your contract. A passport also works but is not required." },
            { doc: "Forklift / VCA certificate (if applicable)", required: false, note: "Bring the original. Dutch agencies accept Romanian and EU-issued certificates." },
            { doc: "Your Romanian CNP (personal number)", required: false, note: "Useful for tax form completion but not required by the agency upfront." },
            { doc: "Contact details of your next of kin", required: false, note: "Required by some agencies for emergency records." },
          ].map((item) => (
            <div key={item.doc} className="flex gap-3 p-3 bg-white border border-gray-100 rounded-lg">
              <span className={`text-xs font-semibold shrink-0 mt-0.5 ${item.required ? "text-red-600" : "text-gray-400"}`}>
                {item.required ? "REQUIRED" : "OPTIONAL"}
              </span>
              <div>
                <p className="font-medium text-gray-800 text-xs">{item.doc}</p>
                <p className="text-xs text-gray-500">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: BSN */}
      <section id="bsn" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">4. BSN number — how to get it</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          The BSN (Burgerservicenummer) is your Dutch citizen service number — similar to the Romanian CNP
          in function. You need it before your employer can process your payroll correctly. Without a BSN,
          you will be taxed at the emergency rate (53%), so getting it quickly is financially important.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-blue-800 mb-2">How Romanian workers get their BSN:</p>
          <ol className="space-y-2 text-xs text-blue-700 list-decimal list-inside">
            <li>Your agency usually arranges a group BSN registration on your first working day — bring your ID.</li>
            <li>If no agency support, go to an RNI desk in Eindhoven, Tilburg, Rotterdam, or another major city.</li>
            <li>RNI registration does not require a Dutch address — you can register even from agency housing.</li>
            <li>BSN is issued within 1–5 working days after registration.</li>
          </ol>
        </div>
      </section>

      {/* Section 5: Housing */}
      <section id="housing" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Agency housing — costs and rules</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Agency housing is the norm for Romanian workers arriving in the Netherlands. The agency acts
          as both employer and landlord. This is convenient but means housing costs come directly out
          of your pay cheque each week.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {[
            { type: "Shared room (typical for new arrivals)", cost: "€80–€120/week", note: "4–8 people per house. Basic furnishings, shared kitchen and bathrooms. Quality varies significantly." },
            { type: "Double or private room", cost: "€120–€170/week", note: "More privacy. Available at some agencies for longer-term workers or couples." },
          ].map((item) => (
            <div key={item.type} className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-gray-800 text-xs">{item.type}</p>
              <p className="text-sm font-bold text-brand-700 mt-0.5">{item.cost}</p>
              <p className="text-xs text-gray-500 mt-1">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <strong>Legal limit:</strong> Agencies certified by SNF (Stichting Normering Flexwonen) cannot charge
          more than 25% of your gross wage for housing. Always check your payslip (loonstrook) each week.
          Overcharging is a common complaint — report it to the SNF or the Dutch Labour Inspectorate.
        </div>
      </section>

      {/* Section 6: Agencies */}
      <section id="agencies" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Best agencies for Romanian workers</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          The following agencies are verified on AgencyCheck and consistently employ Romanian workers in
          logistics and production roles. Look for ABU/NBBU certification — this guarantees legal pay and
          proper housing conditions.
        </p>
        {topAgencies.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {topAgencies.map((a) => (
              <Link key={a.id} href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all">
                <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">
                    {a.transparencyScore}/100
                  </span>
                  {a.housing === "YES" && (
                    <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5">🏠 Housing</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Section 7: Rights */}
      <section id="rights" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your rights in the Netherlands</h2>
        <div className="space-y-3">
          {[
            { title: "Equal pay", desc: "You must receive exactly the same hourly wage as Dutch colleagues in the same role. No lower pay because you are foreign — this is illegal." },
            { title: "Written contract in a language you understand", desc: "You are entitled to your contract in Romanian or English, not just Dutch. Ask your agency before signing anything." },
            { title: "Housing tied to job — rules", desc: "Agencies can provide housing linked to your work, but they cannot make you homeless immediately if you quit or are let go. You are entitled to reasonable notice." },
            { title: "Free legal help", desc: "FNV (trade union) provides free advice to foreign workers in the Netherlands. Contact them if your rights are violated — no union membership required for initial advice." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="text-green-600 font-bold text-sm mt-0.5 shrink-0">✓</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ — Romanian workers in the Netherlands</h2>
        <div className="card p-5 space-y-4">
          {[
            { q: "How much Dutch do I need to know?", a: "None to start. Most agencies operate in English for foreign workers. Some Dutch is useful for daily life but warehouses and production floors typically function in mixed-language environments." },
            { q: "When do I get paid?", a: "Most Dutch agencies pay weekly (Friday) or bi-weekly. Your first payment typically arrives after your first full working week. Some agencies hold one week in reserve." },
            { q: "Can I send money home easily?", a: "Yes. Services like Wise (TransferWise) allow cheap euro-to-leu transfers. From a Dutch bank account, transfers to Romanian accounts typically cost €0.50–€2 per transfer." },
            { q: "Is there a probationary period?", a: "In Phase A (first 78 weeks), agencies can terminate your contract with very little notice. This gives the agency flexibility. After 78 weeks (Phase B), you have stronger protections." },
            { q: "Can my partner or family join me?", a: "Yes, as EU citizens they have the same rights. However, agency housing is usually for single workers. You would need to arrange private rental before bringing family." },
          ].map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="text-sm font-bold text-gray-900 mb-1.5">
                <span className="text-brand-600 mr-2">{i + 1}.</span>{faq.q}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gray-900 rounded-2xl px-6 py-6 text-white text-center mb-6">
        <p className="font-black text-base mb-1">Ready to apply for a job in the Netherlands?</p>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Browse verified jobs with housing included — apply in under 2 minutes via WhatsApp.
        </p>
        <Link
          href="/apply"
          className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-black text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          See current vacancies →
        </Link>
      </div>

      {/* Related */}
      <div className="card p-5">
        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Related pages</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/work-netherlands-from-poland", "Work in Netherlands from Poland"],
            ["/work-netherlands-from-bulgaria", "Work in Netherlands from Bulgaria"],
            ["/jobs-with-accommodation", "Jobs with accommodation included"],
            ["/real-salary-netherlands-after-rent", "Real salary after housing & tax"],
            ["/tools/real-income-calculator", "Net income calculator"],
            ["/agencies", "Browse all verified agencies"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="text-sm text-brand-700 hover:text-brand-800 hover:underline">
              → {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
