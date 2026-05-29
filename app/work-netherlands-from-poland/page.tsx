import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Work in the Netherlands from Poland — Jobs, Salary & Housing 2026 | AgencyCheck",
  description:
    "Polish workers guide to finding agency work in the Netherlands in 2026. Real salary figures, which agencies are best for Poles, housing costs, BSN, taxes and what to expect.",
  alternates: { canonical: "https://agencycheck.io/work-netherlands-from-poland" },
  openGraph: {
    title: "Work in the Netherlands from Poland — 2026 Guide",
    description:
      "Everything Polish workers need to know about agency work in the Netherlands. Jobs, salary, housing, documents and the agencies that hire most Poles.",
  },
};

const polishFriendlyAgencies = ALL_AGENCIES.filter(
  (a) => a.transparencyScore >= 40
)
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 8);

export default function WorkNetherlandsFromPolandPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Work in the Netherlands from Poland — 2026 Guide",
            "description": "Complete guide for Polish workers seeking agency employment in the Netherlands.",
            "url": "https://agencycheck.io/work-netherlands-from-poland",
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
        <span className="text-gray-800 font-medium">Work in Netherlands from Poland</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-red-50 text-red-700 border border-red-100 rounded-full px-2.5 py-1 font-medium">
            🇵🇱 → 🇳🇱 Poland to Netherlands
          </span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            Updated May 2026
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          Work in the Netherlands from Poland — Complete Guide 2026
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Poland is the single largest source of workers for the Dutch logistics and production
          sector. Over 100,000 Polish citizens are employed in the Netherlands via employment
          agencies each year. This guide covers everything you need to know before you go —
          salary reality, which agencies to use, housing costs, and what to bring.
        </p>
      </div>

      {/* Contents */}
      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-sm">
        <p className="font-semibold text-gray-800 mb-2">Contents</p>
        <ol className="space-y-1 list-decimal list-inside text-gray-600 text-xs">
          <li><a href="#right-to-work" className="hover:text-brand-600">Do Poles need a work permit?</a></li>
          <li><a href="#salary" className="hover:text-brand-600">How much can you earn?</a></li>
          <li><a href="#what-to-bring" className="hover:text-brand-600">What documents to bring from Poland</a></li>
          <li><a href="#bsn" className="hover:text-brand-600">Getting your BSN number</a></li>
          <li><a href="#housing" className="hover:text-brand-600">Agency housing — costs and reality</a></li>
          <li><a href="#agencies" className="hover:text-brand-600">Best agencies for Polish workers</a></li>
          <li><a href="#travel" className="hover:text-brand-600">Getting from Poland to Netherlands</a></li>
          <li><a href="#faq" className="hover:text-brand-600">FAQ</a></li>
        </ol>
      </nav>

      {/* Section 1: Right to work */}
      <section id="right-to-work" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Do Polish citizens need a work permit?</h2>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm mb-3">
          <p className="font-bold text-green-800 text-base mb-1">✅ No work permit needed.</p>
          <p className="text-green-700 text-xs leading-relaxed">
            Poland has been an EU member since 2004. Polish citizens have full freedom of movement
            and can work in the Netherlands without any work permit (TWV). You have exactly the same
            labour rights as Dutch workers from day one.
          </p>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          You do not need to notify any Dutch authority before arriving. Once you start working and
          earning income, you will need a BSN number for tax purposes — but that happens after you arrive,
          not before.
        </p>
      </section>

      {/* Section 2: Salary */}
      <section id="salary" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">2. How much can you earn in the Netherlands?</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          The Dutch minimum wage (WML) in 2026 is <strong>€14.71/hour</strong> — equivalent to roughly
          PLN 64–68/hour at current exchange rates. Here is what different jobs pay and what you
          actually take home after tax and housing:
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Job</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Hourly (gross)</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Weekly net (after tax)</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">After housing (€120/wk)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { job: "Order picker / warehouse", rate: "€14.71–€15.50", net: "~€345–€375", after: "~€225–€255" },
                { job: "Production worker", rate: "€14.71–€16.00", net: "~€345–€390", after: "~€225–€270" },
                { job: "Forklift (VCA cert)", rate: "€16.00–€20.00", net: "~€385–€490", after: "~€265–€370" },
                { job: "Night shift (any role +22%)", rate: "+22% premium", net: "+~€70–€90", after: "+~€70–€90" },
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
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <strong>Holiday allowance (vakantiegeld):</strong> Dutch law requires 8% on top of your annual gross salary,
          paid out in May each year. On a full-year contract at minimum wage, this is roughly €1,850 gross as a
          one-off payment.
        </div>
        <Link href="/tools/real-income-calculator" className="block mt-3 text-xs text-brand-600 hover:underline font-medium">
          → Calculate your exact net weekly income →
        </Link>
      </section>

      {/* Section 3: Documents */}
      <section id="what-to-bring" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">3. What documents to bring from Poland</h2>
        <div className="space-y-2 text-sm">
          {[
            { doc: "Valid passport or EU ID card (Dowód osobisty)", required: true, note: "Must be valid for the full contract period. ID card is sufficient — no passport needed." },
            { doc: "Your Polish NIP (tax number)", required: false, note: "Useful for your first tax return. Not required by the agency but handy to have." },
            { doc: "Proof of address in Poland", required: false, note: "Some agencies require this for their registration records." },
            { doc: "Forklift / VCA certificate (if applicable)", required: false, note: "Bring original and a copy. Dutch agencies accept Polish and EU-issued certificates." },
            { doc: "Bank account details (IBAN)", required: false, note: "You can open a Dutch bank account after you arrive. Some agencies pay to a Polish IBAN temporarily." },
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
        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Getting your BSN number</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          The BSN (Burgerservicenummer) is your Dutch social security number — equivalent to the
          Polish PESEL in function. You cannot be paid correctly or open a Dutch bank account without it.
          Most agencies will help you get this on your first working day or shortly after.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
          <p className="font-semibold text-blue-800 mb-2">Two ways to get a BSN:</p>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-blue-800 text-xs">Option A — Via your agency (fastest)</p>
              <p className="text-xs text-blue-700 mt-0.5">Many agencies arrange a group BSN registration at the local gemeente on your first day. Bring your passport/ID.</p>
            </div>
            <div>
              <p className="font-medium text-blue-800 text-xs">Option B — RNI registration (if no local address yet)</p>
              <p className="text-xs text-blue-700 mt-0.5">Go to an RNI desk (available in Eindhoven, Tilburg, Rotterdam, Amsterdam and 15 other cities). Takes 1–3 working days. No permanent address needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Housing */}
      <section id="housing" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Agency housing — costs and reality</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Most Polish workers in the Netherlands start with agency-provided housing — a shared house
          or apartment close to the workplace. This is convenient but has a real cost impact on your
          take-home pay.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {[
            { type: "Shared room (4–6 people per house)", cost: "€80–€120/week", note: "Most common. Basic kitchen, shared bathrooms. Quality varies a lot — always check SNF certification." },
            { type: "Double room (2 people)", cost: "€110–€150/week", note: "More privacy. Some agencies offer this for couples." },
            { type: "Own room / studio", cost: "€150–€200/week", note: "Less common. Usually reserved for supervisors or long-term workers." },
            { type: "Private rental (own arrangement)", cost: "€600–€900/month", note: "Hard to find without a Dutch credit history. Usually only viable after 6+ months in NL." },
          ].map((item) => (
            <div key={item.type} className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-gray-800 text-xs">{item.type}</p>
              <p className="text-sm font-bold text-brand-700 mt-0.5">{item.cost}</p>
              <p className="text-xs text-gray-500 mt-1">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
          <strong>Important:</strong> Agencies can deduct housing costs from your wage, but the maximum
          is 25% of your gross pay (SNF standard). If they deduct more, this is illegal. Always check
          your payslip — the deduction should be clearly itemised.
        </div>
      </section>

      {/* Section 6: Agencies */}
      <section id="agencies" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Best agencies for Polish workers</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          All agencies below are verified and rated on AgencyCheck. Look for ABU or NBBU certification
          and a transparency score above 50.
        </p>
        {polishFriendlyAgencies.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {polishFriendlyAgencies.map((a) => (
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
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
          <strong>Red flags:</strong> Never pay any fee to an agency to get a job. Legitimate Dutch agencies
          charge nothing upfront. Avoid "agencies" that contact you on Facebook offering unrealistically high
          wages — many are fraudulent operators targeting Polish workers.
        </div>
      </section>

      {/* Section 7: Travel */}
      <section id="travel" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Getting from Poland to the Netherlands</h2>
        <div className="space-y-3 text-sm">
          {[
            { method: "Bus / Coach (FlixBus, RegioJet)", time: "12–18 hours", cost: "€30–€80 return", note: "Most popular route for first-timers. Direct connections from Warsaw, Kraków, Wrocław, Poznań, Gdańsk to major Dutch cities." },
            { method: "Flight (Ryanair, Wizzair, LOT)", time: "2–2.5 hours", cost: "€40–€150 return", note: "Fastest option. Eindhoven Airport is convenient for the Tilburg/Venlo logistics corridor. Amsterdam Schiphol for everywhere else." },
            { method: "Own car", time: "9–12 hours", cost: "Fuel + tolls ~€60–€120", note: "Useful if you're bringing belongings. Parking around Dutch warehouse areas is usually free." },
          ].map((item) => (
            <div key={item.method} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-semibold text-gray-800 text-sm">{item.method}</p>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-brand-700">{item.cost}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ — Polish workers in the Netherlands</h2>
        <div className="card p-5 space-y-4">
          {[
            { q: "Do I need to speak Dutch?", a: "No. Most agencies and warehouses operate in English for foreign workers. Some knowledge of Dutch is useful for daily life but not required to start working." },
            { q: "Can I bring my family?", a: "Yes. EU free movement rights allow family members to join you. However, agency housing is usually for single workers. You would need to arrange private rental if bringing family." },
            { q: "How long until my first paycheck?", a: "Most agencies pay weekly (every Friday) or bi-weekly. Your first payment typically comes after the first full working week — not on day one." },
            { q: "Is agency work seasonal?", a: "Warehouse and logistics work is year-round in the Netherlands. Agriculture (greenhouse, berry picking) is seasonal — typically April to October." },
            { q: "Can I switch agencies once I am there?", a: "Yes. You are not bound to one agency. Check your contract for a notice period (usually 1–2 weeks). Some agencies allow immediate switches if they can't provide hours." },
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
          Browse verified jobs with housing included — filled in under 2 minutes via WhatsApp.
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
            ["/work-netherlands-from-romania", "Work in Netherlands from Romania"],
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
