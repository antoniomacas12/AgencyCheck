import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "What Is Order Picking? — The Real Job Explained 2026 | AgencyCheck",
  description:
    "Honest guide to order picking work in the Netherlands. What you actually do, how hard it is, what it pays, which agencies hire pickers, and whether it is worth it for foreign workers.",
  alternates: { canonical: "https://agencycheck.io/what-is-order-picking" },
  openGraph: {
    title: "What Is Order Picking? The Real Job Explained",
    description:
      "The honest reality of order picking in the Netherlands — daily tasks, physical demands, pay, quotas, and which agencies offer the best conditions.",
  },
};

const warehouseAgencies = ALL_AGENCIES.filter(
  (a) =>
    a.jobFocus?.some((j) =>
      ["warehouse-worker", "order-picker", "forklift-driver"].includes(j)
    ) && a.transparencyScore >= 40
)
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 6);

export default function WhatIsOrderPickingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What does an order picker do?",
                "acceptedAnswer": { "@type": "Answer", "text": "An order picker (magazijnmedewerker) walks through a warehouse using a handheld scanner, locates products on shelving racks, picks the correct quantity, and places them in a trolley or container. The picked orders are then passed to packaging or loading." },
              },
              {
                "@type": "Question",
                "name": "How much does order picking pay in the Netherlands?",
                "acceptedAnswer": { "@type": "Answer", "text": "Order picking in the Netherlands pays between €14.71/hr (WML minimum) and €16.00/hr for experienced pickers at better agencies. Night shifts pay an additional 22% premium under the ABU CAO." },
              },
              {
                "@type": "Question",
                "name": "Is order picking hard work?",
                "acceptedAnswer": { "@type": "Answer", "text": "Order picking is physically demanding. You walk 15–25 km per shift, lift boxes weighing up to 25 kg repeatedly, and work to picking quotas. Most people adapt within 2–3 weeks. Proper footwear is essential." },
              },
            ],
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">What Is Order Picking?</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            📦 Job guide
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 font-medium">
            €14.71–€16/hr · Entry level
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          What Is Order Picking? — The Honest Guide for 2026
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Order picker is one of the most common agency jobs in the Netherlands — and one of the most
          misunderstood. This page explains exactly what the job involves, how demanding it really is,
          what you earn (including the parts agencies leave out), and whether it is the right choice
          for someone moving to the Netherlands for work.
        </p>
      </div>

      {/* TOC */}
      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-sm">
        <p className="font-semibold text-gray-800 mb-2">In this guide</p>
        <ol className="space-y-1 list-decimal list-inside text-gray-600 text-xs">
          <li><a href="#what-you-do" className="hover:text-brand-600">What does an order picker actually do?</a></li>
          <li><a href="#physical" className="hover:text-brand-600">How physically demanding is it?</a></li>
          <li><a href="#quotas" className="hover:text-brand-600">Picking quotas — what they are and how they work</a></li>
          <li><a href="#pay" className="hover:text-brand-600">How much do order pickers earn?</a></li>
          <li><a href="#shifts" className="hover:text-brand-600">Shift patterns and schedule</a></li>
          <li><a href="#where" className="hover:text-brand-600">Where are most order picker jobs?</a></li>
          <li><a href="#agencies" className="hover:text-brand-600">Agencies that hire order pickers</a></li>
          <li><a href="#faq" className="hover:text-brand-600">FAQ</a></li>
        </ol>
      </nav>

      {/* Section 1 */}
      <section id="what-you-do" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">1. What does an order picker actually do?</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          An order picker (Dutch: <em>magazijnmedewerker</em> or <em>orderpicker</em>) is responsible for
          collecting specific products from warehouse shelving in preparation for shipping to customers or stores.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">A typical shift looks like this:</p>
        <div className="space-y-3 mb-4">
          {[
            { time: "Start of shift", task: "Log into your scanner, receive your picking list. Your scanner tells you exactly which aisle, which rack, and which shelf to go to." },
            { time: "During shift", task: "Walk between rack aisles, pick the right products in the right quantity, scan each item as you pick it to confirm accuracy. Load onto a trolley or conveyor." },
            { time: "When trolley is full", task: "Bring it to a packaging or handoff point. The trolley is checked by a scanner system — if you picked incorrectly, it flags immediately." },
            { time: "End of shift", task: "Log out of your scanner. Your picking speed and accuracy are recorded — both affect your performance review." },
          ].map((item) => (
            <div key={item.time} className="flex gap-3 border border-gray-100 rounded-xl p-3">
              <div className="shrink-0 w-24">
                <p className="text-xs font-bold text-brand-700">{item.time}</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.task}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
          <strong>Types of order picking:</strong> Ground-level picking (most common, no lifting above chest height),
          high-bay picking (using an elevated order picker machine, requires training), and voice picking
          (audio instructions through a headset rather than a scanner). Most entry-level roles are ground-level.
        </div>
      </section>

      {/* Section 2 */}
      <section id="physical" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">2. How physically demanding is order picking?</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          This is one of the most important things to understand before you apply. Order picking is a
          physically demanding job that most office workers would find very hard in the first week.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {[
            { label: "Distance walked per shift", value: "15–25 km", note: "On a busy shift in a large warehouse" },
            { label: "Weight lifted", value: "Up to 25 kg", note: "Repeatedly, bending and reaching" },
            { label: "Time on feet", value: "6–7.5 hours", note: "Out of an 8-hour shift after breaks" },
            { label: "Temperature (some facilities)", value: "4–8°C", note: "Cold chain / food distribution warehouses" },
          ].map((stat) => (
            <div key={stat.label} className="border border-gray-200 rounded-xl p-3">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-xl font-extrabold text-gray-900 mt-0.5">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.note}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <strong>Adaptation period:</strong> Most new pickers find the first 1–2 weeks very hard.
          Muscle soreness, foot pain, and general fatigue are normal. By week 3, most workers adapt
          significantly. Good warehouse shoes (safety boots or thick-soled trainers) make a material difference.
        </div>
      </section>

      {/* Section 3 */}
      <section id="quotas" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Picking quotas — what they are and how they work</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Most warehouses operate a quota system — a minimum number of items or orders you must pick
          per hour to meet the standard. This is one of the most stressful aspects of the job and
          something agencies often do not explain clearly before you start.
        </p>
        <div className="space-y-3">
          {[
            { point: "Typical quota", detail: "80–160 picks per hour depending on the warehouse and product type. E-commerce fulfilment (small items) has higher quotas than food distribution (heavy, bulky products)." },
            { point: "How quotas are measured", detail: "Your scanner tracks your speed automatically. Supervisors receive daily reports. You can usually see your own performance in real time on a display screen." },
            { point: "What happens if you miss quota", detail: "In most warehouses, sustained underperformance leads to a warning, then reduced hours, then contract termination. New workers are typically given 4–6 weeks grace period to reach speed." },
            { point: "What happens if you exceed quota", detail: "Some warehouses offer a speed bonus (percentageregeling) if you consistently hit 120%+ of quota. Not all do — ask before you start." },
          ].map((item) => (
            <div key={item.point} className="border border-gray-200 rounded-xl p-3">
              <p className="text-xs font-bold text-gray-800 mb-1">{item.point}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 */}
      <section id="pay" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">4. How much do order pickers earn?</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          The honest picture of order picker pay in the Netherlands — including shift premiums, holiday
          allowance, and the impact of housing deductions if you are in agency accommodation:
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Scenario</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Gross/hr</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Net/week</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">After housing</th>
              </tr>
            </thead>
            <tbody>
              {[
                { scenario: "Day shift, WML", rate: "€14.71", net: "~€345", after: "~€225–€245" },
                { scenario: "Day shift, experienced picker", rate: "€15.50", net: "~€375", after: "~€255–€275" },
                { scenario: "Night shift (WML +22%)", rate: "€17.95", net: "~€430", after: "~€310–€330" },
                { scenario: "Weekend premium (ABU)", rate: "+33–50%", net: "~€470–€520", after: "~€350–€400" },
              ].map((row) => (
                <tr key={row.scenario} className="border-b border-gray-100">
                  <td className="p-2 border border-gray-200 text-xs text-gray-700">{row.scenario}</td>
                  <td className="p-2 border border-gray-200 text-xs font-semibold text-green-700">{row.rate}</td>
                  <td className="p-2 border border-gray-200 text-xs text-gray-600">{row.net}</td>
                  <td className="p-2 border border-gray-200 text-xs font-bold text-brand-700">{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mb-2">
          Housing deduction assumed at €100–€120/week for shared room. Tax on single-person income table 1.
          Holiday allowance (8% annually, paid in May) is not included in weekly figures.
        </p>
        <Link href="/tools/real-income-calculator" className="text-xs text-brand-600 hover:underline font-medium">
          → Calculate your exact net income →
        </Link>
      </section>

      {/* Section 5 */}
      <section id="shifts" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Shift patterns and schedule</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { shift: "Early / Day", time: "06:00–14:00\n07:00–15:30", note: "Most common entry shift. Finishes in the afternoon. Good for personal time and acclimatising." },
            { shift: "Late / Afternoon", time: "14:00–22:00\n15:30–23:30", note: "Less popular. Small shift premium at some warehouses. Fewer commuter workers." },
            { shift: "Night", time: "22:00–06:00\n00:00–08:00", note: "Highest pay (+22% min). Harder on health long-term. Strong for saving money quickly." },
          ].map((item) => (
            <div key={item.shift} className="border border-gray-200 rounded-xl p-3">
              <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-1">{item.shift}</p>
              <p className="text-sm font-bold text-gray-900 mb-1 whitespace-pre-line">{item.time}</p>
              <p className="text-xs text-gray-500">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
          Most order picker contracts are flexible (Phase A). You may not get the same shift every week.
          However, larger warehouses with 24/7 operations usually offer fixed shift patterns once
          you have proven yourself over 4–8 weeks.
        </div>
      </section>

      {/* Section 6 */}
      <section id="where" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Where are most order picker jobs?</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Order picking jobs are concentrated in the major logistics corridors of the Netherlands:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { area: "Tilburg / Waalwijk / Breda", employers: "Amazon, Rhenus, Ingram Micro, GXO", note: "Largest concentration. Huge volumes. Tight housing market." },
            { area: "Venlo / Roermond", employers: "Amazon, CEVA, DSV, DB Schenker", note: "Gateway to Germany. High multilingual staff base." },
            { area: "Rotterdam / Ridderkerk", employers: "Port-linked distribution, Bol.com, Albert Heijn", note: "Good public transport. Higher cost of private housing." },
            { area: "Eindhoven / Helmond", employers: "Consumer electronics, Philips supply chain", note: "More technical roles available alongside standard picking." },
          ].map((item) => (
            <div key={item.area} className="border border-gray-200 rounded-xl p-3">
              <p className="font-semibold text-gray-800 text-xs">{item.area}</p>
              <p className="text-xs text-brand-700 font-medium mt-0.5">{item.employers}</p>
              <p className="text-xs text-gray-500 mt-1">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Agencies */}
      {warehouseAgencies.length > 0 && (
        <section id="agencies" className="mb-8 scroll-mt-20">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Agencies that hire order pickers</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {warehouseAgencies.map((a) => (
              <Link key={a.id} href={`/agencies/${a.slug}`}
                className="card p-4 hover:shadow-md hover:border-brand-100 transition-all">
                <p className="text-sm font-bold text-gray-900 leading-tight">{a.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.city || "Netherlands"}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">
                    {a.transparencyScore}/100
                  </span>
                  {a.housing === "YES" && (
                    <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5">🏠</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ — Order picking in the Netherlands</h2>
        <div className="card p-5 space-y-4">
          {[
            { q: "Do I need experience to get an order picker job?", a: "No. Order picking is an entry-level role and no prior experience is required. You will receive a brief induction on your first day covering scanner use, safety rules, and warehouse layout." },
            { q: "Do I need to speak Dutch?", a: "No. Most warehouses with a large foreign workforce operate in English. Scanner instructions are typically visual symbols. Some Dutch vocabulary for safety signs is useful but not required." },
            { q: "What shoes should I wear?", a: "Safety boots (with steel toe cap) are required in most warehouses and are sometimes provided or subsidised by the agency. If you are buying your own, get boots with good ankle support and thick cushioning — your feet will thank you." },
            { q: "Is order picking better or worse than production work?", a: "Order picking involves more walking and fewer repetitive micro-motions. Production work involves more stationary standing with very repetitive arm/hand movements. Neither is easier — they stress different parts of the body." },
            { q: "Can I progress from order picker to other roles?", a: "Yes. Common progressions are: order picker → reach truck operator (after getting a certificate), team leader (internal promotion), or quality control checker. Some workers also train as forklift drivers while working." },
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
        <p className="font-black text-base mb-1">Looking for an order picker job with housing?</p>
        <p className="text-xs text-gray-400 mb-4">EU citizens only. Apply via WhatsApp in under 2 minutes.</p>
        <Link
          href="/apply/warehouse"
          className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-black text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          Apply for warehouse jobs →
        </Link>
      </div>

      {/* Related */}
      <div className="card p-5">
        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Related pages</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/what-is-production-work-netherlands", "What is production work? Guide"],
            ["/warehouse-work-netherlands", "Warehouse work in Netherlands"],
            ["/after-you-apply", "What happens after you apply?"],
            ["/real-salary-netherlands-after-rent", "Real salary after housing & tax"],
            ["/order-picker-jobs", "Order picker jobs — browse listings"],
            ["/tools/real-income-calculator", "Net income calculator"],
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
