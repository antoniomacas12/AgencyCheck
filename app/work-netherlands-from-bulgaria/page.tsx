import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Work in the Netherlands from Bulgaria — Jobs, Salary & Housing 2026 | AgencyCheck",
  description:
    "Bulgarian workers guide to agency work in the Netherlands 2026. Real salary breakdown, housing costs, BSN registration, best agencies and what to expect your first month.",
  alternates: { canonical: "https://agencycheck.io/work-netherlands-from-bulgaria" },
  openGraph: {
    title: "Work in the Netherlands from Bulgaria — 2026 Guide",
    description:
      "Complete guide for Bulgarian workers seeking agency work in the Netherlands. Salary, housing, documents, and which agencies hire Bulgarians.",
  },
};

const topAgencies = ALL_AGENCIES.filter((a) => a.transparencyScore >= 40)
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 8);

export default function WorkNetherlandsFromBulgariaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Work in the Netherlands from Bulgaria — 2026 Guide",
            "description": "Complete guide for Bulgarian workers seeking agency employment in the Netherlands.",
            "url": "https://agencycheck.io/work-netherlands-from-bulgaria",
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
        <span className="text-gray-800 font-medium">Work in Netherlands from Bulgaria</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-1 font-medium">
            🇧🇬 → 🇳🇱 Bulgaria to Netherlands
          </span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            Updated May 2026
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          Work in the Netherlands from Bulgaria — Complete Guide 2026
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Bulgaria has one of the lowest wages in the EU, making the Netherlands one of the highest-value
          destinations for Bulgarian workers. With the Dutch minimum wage at €14.71/hour — roughly
          6–8× the equivalent Bulgarian factory wage — tens of thousands of Bulgarian workers are employed
          in Dutch warehouses, production facilities and logistics hubs each year.
          This guide covers everything you need before you leave.
        </p>
      </div>

      {/* Contents */}
      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-sm">
        <p className="font-semibold text-gray-800 mb-2">Contents</p>
        <ol className="space-y-1 list-decimal list-inside text-gray-600 text-xs">
          <li><a href="#right-to-work" className="hover:text-brand-600">Do Bulgarians need a work permit?</a></li>
          <li><a href="#salary" className="hover:text-brand-600">Salary comparison: Bulgaria vs Netherlands</a></li>
          <li><a href="#documents" className="hover:text-brand-600">Documents to prepare</a></li>
          <li><a href="#bsn" className="hover:text-brand-600">BSN number — what it is and how to get it</a></li>
          <li><a href="#housing" className="hover:text-brand-600">Agency housing — costs and what to expect</a></li>
          <li><a href="#agencies" className="hover:text-brand-600">Agencies that hire Bulgarian workers</a></li>
          <li><a href="#first-month" className="hover:text-brand-600">Your first month — what happens step by step</a></li>
          <li><a href="#faq" className="hover:text-brand-600">FAQ</a></li>
        </ol>
      </nav>

      {/* Section 1 */}
      <section id="right-to-work" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Do Bulgarian citizens need a work permit?</h2>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm mb-3">
          <p className="font-bold text-green-800 text-base mb-1">✅ No. Full EU free movement applies.</p>
          <p className="text-green-700 text-xs leading-relaxed">
            Bulgaria joined the EU in 2007. After a transitional period, Bulgarian citizens have had
            full and unrestricted access to the Dutch labour market since 2014. You can start working
            immediately upon arrival — no work permit, no pre-registration with Dutch authorities.
          </p>
        </div>
      </section>

      {/* Section 2: Salary */}
      <section id="salary" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Salary comparison: Bulgaria vs Netherlands</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">🇧🇬 Bulgaria (average)</p>
            <p className="text-2xl font-extrabold text-gray-700">BGN 10–15<span className="text-sm font-normal text-gray-400">/hr</span></p>
            <p className="text-xs text-gray-500 mt-1">Factory / production work. Net monthly take-home: ~BGN 1,200–1,800 (€600–900)</p>
          </div>
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
            <p className="text-xs font-black uppercase tracking-widest text-brand-400 mb-2">🇳🇱 Netherlands (minimum)</p>
            <p className="text-2xl font-extrabold text-brand-700">€14.71<span className="text-sm font-normal text-brand-400">/hr</span></p>
            <p className="text-xs text-brand-600 mt-1">Warehouse / production. Net weekly after housing: ~€225–€270</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Job</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Gross/hr</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Net/week</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Net after housing</th>
              </tr>
            </thead>
            <tbody>
              {[
                { job: "Order picker / warehouse", rate: "€14.71–€15.50", net: "~€345–€375", after: "~€225–€255" },
                { job: "Production worker", rate: "€14.71–€16.00", net: "~€345–€390", after: "~€225–€270" },
                { job: "Forklift (with VCA cert)", rate: "€16–€20", net: "~€385–€490", after: "~€265–€370" },
                { job: "Night shift premium (ABU +22%)", rate: "+22%", net: "+€70–€90", after: "+€70–€90" },
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
        <Link href="/tools/real-income-calculator" className="block mt-3 text-xs text-brand-600 hover:underline font-medium">
          → Calculate your exact net weekly income →
        </Link>
      </section>

      {/* Section 3: Documents */}
      <section id="documents" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Documents to prepare before you leave Bulgaria</h2>
        <div className="space-y-2 text-sm">
          {[
            { doc: "Bulgarian EU ID card (Лична карта) or passport", required: true, note: "Must be valid for at least the duration of your planned contract. Passport is not mandatory if you have a valid ID card." },
            { doc: "Forklift / VCA certificate (if applicable)", required: false, note: "Bulgarian and EU-issued certificates are accepted by Dutch agencies. Bring both original and a copy." },
            { doc: "Your Bulgarian EGN (national ID number)", required: false, note: "Useful for tax forms and initial paperwork. Your agency will ask for it at some point." },
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
        <h2 className="text-xl font-bold text-gray-900 mb-3">4. BSN number — what it is and how to get it</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          The BSN (Burgerservicenummer) is your Dutch tax identification number. Without it, your
          employer cannot process your salary through the Dutch tax system, and you will be taxed
          at the emergency rate (53% instead of ~37%). Getting it fast saves you money.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700 space-y-2">
          <p className="font-semibold text-blue-800 text-sm">Steps to get your BSN:</p>
          <ol className="space-y-1.5 list-decimal list-inside">
            <li>Ask your agency on arrival — most arrange group BSN registration within the first week.</li>
            <li>Without agency help, visit an RNI desk (Eindhoven, Tilburg, Rotterdam, Amsterdam etc.).</li>
            <li>Bring your ID card and your first Dutch address (or ask the agency for theirs).</li>
            <li>You receive your BSN by post within 1–5 working days.</li>
          </ol>
        </div>
      </section>

      {/* Section 5: Housing */}
      <section id="housing" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Agency housing — costs and what to expect</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Almost all Bulgarian workers arriving in the Netherlands start with agency housing.
          The agency acts as both your employer and accommodation provider. Costs are deducted
          from your weekly wage.
        </p>
        <div className="space-y-3 mb-4">
          {[
            { type: "Shared house — basic (most common)", cost: "€80–€120/week", detail: "You share a house with 4–8 other workers. Shared kitchen, bathroom, living room. Quality varies hugely between agencies." },
            { type: "Better quality / smaller groups", cost: "€110–€150/week", detail: "Some agencies invest in smaller homes with fewer workers per property. Check agency reviews." },
            { type: "Own room in shared house", cost: "€130–€170/week", detail: "Available after you have been with an agency for a while or if you request it upfront." },
          ].map((item) => (
            <div key={item.type} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-800 text-xs">{item.type}</p>
                <p className="text-sm font-bold text-brand-700 shrink-0">{item.cost}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <strong>Know the legal limit:</strong> Under the SNF standard, housing deductions cannot
          exceed 25% of your gross wage. Always request a payslip (loonstrook) each week and check
          that the housing amount is clearly listed.
        </div>
      </section>

      {/* Section 6: Agencies */}
      <section id="agencies" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Agencies that hire Bulgarian workers</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          These agencies are verified on AgencyCheck, sorted by transparency score. All have ABU
          or NBBU certification and documented housing standards.
        </p>
        {topAgencies.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-3">
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

      {/* Section 7: First month */}
      <section id="first-month" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your first month — step by step</h2>
        <div className="space-y-3">
          {[
            { week: "Week 1", events: ["Arrive and move into agency housing", "Sign employment contract (ask for English or Bulgarian version)", "Agency arranges BSN registration — bring your ID", "First day induction at the workplace (safety, rules, shifts)"] },
            { week: "Week 2", events: ["Start working full shifts", "Open Dutch bank account (ING, ABN AMRO, Bunq — easiest for foreigners)", "Provide IBAN to your agency for payroll", "First paycheck arrives (end of week or following week)"] },
            { week: "Week 3–4", events: ["Check your first payslip carefully — verify hourly rate, hours worked, housing deduction, tax", "If anything is wrong, speak to your agency contact immediately", "Consider downloading the DigiD app for access to Dutch government services"] },
          ].map((item) => (
            <div key={item.week} className="border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-2">{item.week}</p>
              <ul className="space-y-1">
                {item.events.map((ev) => (
                  <li key={ev} className="flex gap-2 text-xs text-gray-600">
                    <span className="text-green-500 shrink-0">→</span>
                    {ev}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ — Bulgarian workers in the Netherlands</h2>
        <div className="card p-5 space-y-4">
          {[
            { q: "Do I need health insurance in the Netherlands?", a: "Yes. All workers in the Netherlands must have basic Dutch health insurance (zorgverzekering). Cost is ~€160/month but you also receive a government allowance (zorgtoeslag) of ~€100–120/month that offsets most of it. Some agencies arrange this for you." },
            { q: "What if there are no hours available?", a: "In Phase A contracts, agencies are not obligated to guarantee hours. If there is no work, you may not be paid (no work, no pay). Make sure your agency is actively giving you shifts — if not, look for another agency." },
            { q: "Can I save money in the Netherlands?", a: "Yes, many Bulgarian workers save €500–€1,000/month after housing and living expenses. Night shifts, overtime, and holiday pay in May significantly boost annual earnings." },
            { q: "Is the work physically hard?", a: "Warehouse and production work is physically demanding — standing 8+ hours, repetitive motions, sometimes cold environments. Most workers adapt within 2–3 weeks. Good footwear makes a big difference." },
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
        <p className="font-black text-base mb-1">Ready to find a job in the Netherlands?</p>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Browse verified jobs with housing — EU citizens only. Apply via WhatsApp in 2 minutes.
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
            ["/work-netherlands-from-romania", "Work in Netherlands from Romania"],
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
