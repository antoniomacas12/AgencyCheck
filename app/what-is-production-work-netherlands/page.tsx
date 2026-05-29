import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "What Is Production Work in the Netherlands? — Real Guide 2026 | AgencyCheck",
  description:
    "Honest guide to production worker jobs in the Netherlands. What you actually do on a food or manufacturing line, pay rates, shift patterns, physical demands, and which agencies to use.",
  alternates: { canonical: "https://agencycheck.io/what-is-production-work-netherlands" },
  openGraph: {
    title: "What Is Production Work in the Netherlands? The Honest Guide",
    description:
      "Everything about production line work in Dutch factories — real tasks, physical demands, pay, shift patterns, and which agencies offer the best conditions.",
  },
};

const productionAgencies = ALL_AGENCIES.filter(
  (a) =>
    (a.jobFocus?.some((j) =>
      ["production-worker", "factory-worker", "food-production"].includes(j)
    ) || a.transparencyScore >= 50) && a.transparencyScore >= 40
)
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 6);

export default function WhatIsProductionWorkPage() {
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
                "name": "What does a production worker do in the Netherlands?",
                "acceptedAnswer": { "@type": "Answer", "text": "A production worker (productiemedewerker) works on a manufacturing or food processing line, performing repetitive tasks such as operating a machine, assembling components, inspecting quality, or packaging products. The specific tasks depend on the factory type." },
              },
              {
                "@type": "Question",
                "name": "How much does production work pay in the Netherlands?",
                "acceptedAnswer": { "@type": "Answer", "text": "Production work in the Netherlands pays €14.71–€17/hr depending on the sector, shift, and experience level. Night shifts carry a 22% premium under the ABU CAO. Food production roles in larger factories may have their own CAO paying slightly above WML." },
              },
              {
                "@type": "Question",
                "name": "Is production work different from order picking?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. Order picking involves walking 15–25 km through a warehouse. Production work is mostly stationary — you stand at a machine or conveyor belt and perform the same motion repeatedly. Production work is less walking but more repetitive motion, which creates different physical strain." },
              },
            ],
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">What Is Production Work?</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            🏭 Job guide
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 font-medium">
            €14.71–€17/hr · Entry level
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          What Is Production Work in the Netherlands? — Honest Guide 2026
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Production worker is one of the most common job titles in Dutch employment agency listings —
          but it covers a very wide range of actual tasks. Working in a meat processing plant is
          nothing like working in a chocolate factory, even though both are "production work."
          This guide explains what the job really involves, which sectors pay most, and what a
          typical day looks like so you can decide if it is the right choice for you.
        </p>
      </div>

      {/* TOC */}
      <nav className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-sm">
        <p className="font-semibold text-gray-800 mb-2">In this guide</p>
        <ol className="space-y-1 list-decimal list-inside text-gray-600 text-xs">
          <li><a href="#types" className="hover:text-brand-600">Types of production work in the Netherlands</a></li>
          <li><a href="#what-you-do" className="hover:text-brand-600">What a production worker does — day by day</a></li>
          <li><a href="#physical" className="hover:text-brand-600">Physical demands — the honest picture</a></li>
          <li><a href="#pay" className="hover:text-brand-600">Pay rates by sector</a></li>
          <li><a href="#shifts" className="hover:text-brand-600">Shift patterns</a></li>
          <li><a href="#vs-picking" className="hover:text-brand-600">Production work vs order picking — which is better?</a></li>
          <li><a href="#agencies" className="hover:text-brand-600">Agencies that place production workers</a></li>
          <li><a href="#faq" className="hover:text-brand-600">FAQ</a></li>
        </ol>
      </nav>

      {/* Section 1: Types */}
      <section id="types" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Types of production work in the Netherlands</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          The term "production worker" (productiemedewerker) is broad. Here are the main sectors where
          Dutch agencies place foreign workers, with honest notes on what each involves:
        </p>
        <div className="space-y-3">
          {[
            {
              sector: "Food processing / slaughterhouse",
              pay: "€14.71–€16.50/hr",
              reality: "Cold environment (0–8°C), repetitive cutting or sorting, standing all day. Physically demanding. Night premiums are generous. High turnover — many workers leave after 2–4 weeks.",
              icon: "🥩",
            },
            {
              sector: "Bakery / confectionery production",
              pay: "€14.71–€16.00/hr",
              reality: "Warm or very warm environment (20–35°C). Repetitive portioning, decorating, or packaging. Early morning start times (02:00–06:00) are common. Smells pleasant — a popular choice.",
              icon: "🍞",
            },
            {
              sector: "Beverage / bottling plant",
              pay: "€14.71–€15.50/hr",
              reality: "Machine monitoring and line operation. Loud environment. Not heavily lifting, but long periods of concentration. Often includes night shifts.",
              icon: "🍺",
            },
            {
              sector: "Electronics / component assembly",
              pay: "€15.00–€18.00/hr",
              reality: "Cleanroom or precision environment. Requires fine motor skills and attention to detail. Warmer conditions. Better long-term prospects — skills transfer.",
              icon: "⚙️",
            },
            {
              sector: "Pharmaceutical production",
              pay: "€15.50–€19.00/hr",
              reality: "Sterile environment, strict hygiene protocols, gowning required. Pays well. Less physically demanding but mentally demanding due to documentation requirements.",
              icon: "💊",
            },
            {
              sector: "Greenhouse / agricultural processing",
              pay: "€14.71–€15.00/hr",
              reality: "Seasonal (spring–autumn). Sorting, packing, or trimming plants. Physically demanding in heat. Accommodation often on-site or nearby. Most popular among first-time NL workers.",
              icon: "🌱",
            },
          ].map((item) => (
            <div key={item.sector} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-semibold text-gray-800 text-sm">{item.icon} {item.sector}</p>
                <span className="text-xs font-bold text-green-700 shrink-0">{item.pay}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.reality}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2 */}
      <section id="what-you-do" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">2. What a production worker does — day by day</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Using a food production line as an example (covers most first-time production worker placements):
        </p>
        <div className="space-y-3">
          {[
            { phase: "Start of shift", tasks: "Put on protective clothing (hairnet, gloves, sometimes a coat and boots). Clean your workstation. Attend a brief team briefing — targets for the day, any quality issues from previous shift." },
            { phase: "Production run", tasks: "Stand at an assigned position on the production line. Your job might be: feeding raw material into the machine, inspecting products as they come off the line, removing defects, packing into boxes, or stacking boxes for palletisation." },
            { phase: "Machine stops / changeover", tasks: "When a production run finishes or a machine needs adjustment, you may assist with cleaning, product changeover, or restocking raw materials." },
            { phase: "End of shift", tasks: "Clean your workstation and any shared equipment according to hygiene protocol. Short handover with incoming shift workers if overlap. Sign off your output sheet." },
          ].map((item) => (
            <div key={item.phase} className="flex gap-3 border border-gray-100 rounded-xl p-3">
              <div className="shrink-0 w-28">
                <p className="text-xs font-bold text-brand-700">{item.phase}</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.tasks}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 */}
      <section id="physical" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Physical demands — the honest picture</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {[
            { label: "Standing hours per shift", value: "6–8 hours", note: "Mostly stationary. Anti-fatigue mats are provided in good facilities." },
            { label: "Repetitive motion", value: "High", note: "Same hand/arm movement hundreds of times per hour. RSI risk if technique is poor." },
            { label: "Temperature extremes", value: "Varies widely", note: "From -5°C (cold chain) to 35°C+ (bakeries in summer)." },
            { label: "Noise level", value: "Medium–high", note: "Bottling, stamping, and cutting machinery is loud. Ear protection often required." },
          ].map((stat) => (
            <div key={stat.label} className="border border-gray-200 rounded-xl p-3">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-base font-extrabold text-gray-900 mt-0.5">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.note}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <strong>RSI prevention:</strong> Repetitive strain injury is a real risk in production work.
          Rotate hand positions where possible, do light wrist stretches during breaks, and report
          pain early — do not push through it. Dutch law requires employers to take repetitive strain
          risks seriously.
        </div>
      </section>

      {/* Section 4 */}
      <section id="pay" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Pay rates by sector</h2>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Sector</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Day shift</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Night shift (+22%)</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Net/week (day)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { sector: "Food processing / meat", day: "€14.71–€16.00", night: "€17.95–€19.52", net: "~€345–€390" },
                { sector: "Bakery / confectionery", day: "€14.71–€15.50", night: "€17.95–€18.91", net: "~€345–€375" },
                { sector: "Pharmaceuticals", day: "€15.50–€19.00", night: "€18.91–€23.18", net: "~€375–€465" },
                { sector: "Electronics / assembly", day: "€15.00–€18.00", night: "€18.30–€21.96", net: "~€360–€440" },
                { sector: "Greenhouse / agri-processing", day: "€14.71–€15.00", night: "Rarely offered", net: "~€345–€360" },
              ].map((row) => (
                <tr key={row.sector} className="border-b border-gray-100">
                  <td className="p-2 border border-gray-200 text-xs text-gray-700">{row.sector}</td>
                  <td className="p-2 border border-gray-200 text-xs font-semibold text-green-700">{row.day}</td>
                  <td className="p-2 border border-gray-200 text-xs text-blue-700">{row.night}</td>
                  <td className="p-2 border border-gray-200 text-xs font-bold text-brand-700">{row.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400">Net figures after tax, single worker, no housing deduction. For take-home after agency housing, subtract €100–€120/week.</p>
        <Link href="/tools/real-income-calculator" className="block mt-2 text-xs text-brand-600 hover:underline font-medium">
          → Calculate your exact net weekly income →
        </Link>
      </section>

      {/* Section 5 */}
      <section id="shifts" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Shift patterns in production</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Production facilities typically run 24/7 and use a 3-shift rotation system:
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { shift: "Morning", time: "06:00–14:00", premium: "None", note: "Most popular. Afternoons free. Standard pay." },
            { shift: "Afternoon", time: "14:00–22:00", premium: "+small", note: "Less popular. Small premium at some facilities." },
            { shift: "Night", time: "22:00–06:00", premium: "+22%", note: "Higher pay. Harder for sleep schedule. Good for saving." },
          ].map((item) => (
            <div key={item.shift} className="border border-gray-200 rounded-xl p-3">
              <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-1">{item.shift}</p>
              <p className="text-sm font-bold text-gray-900">{item.time}</p>
              <p className="text-xs font-semibold text-green-700 mt-0.5">{item.premium}</p>
              <p className="text-xs text-gray-500 mt-1">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
          In some production facilities (especially meat and food), a rotating 2-week pattern is common:
          one week mornings, one week nights. Check with your agency before accepting a position if this matters to you.
        </div>
      </section>

      {/* Section 6 */}
      <section id="vs-picking" className="mb-8 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Production work vs order picking — which is better?</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Factor</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-brand-700">Production</th>
                <th className="text-left p-2 border border-gray-200 text-xs font-semibold text-gray-700">Order picking</th>
              </tr>
            </thead>
            <tbody>
              {[
                { factor: "Movement", prod: "Mostly stationary", pick: "15–25 km walking per shift" },
                { factor: "Repetition", prod: "Very high (same motion)", pick: "Moderate (varied picking)" },
                { factor: "Temperature", prod: "Varies (cold to very hot)", pick: "Usually room temp" },
                { factor: "Pace pressure", prod: "Line speed (set by machine)", pick: "Quota (set by supervisor)" },
                { factor: "Pay ceiling", prod: "Higher (pharmaceuticals, electronics)", pick: "Lower (WML–€16 typical)" },
                { factor: "Language needed", prod: "None to start", pick: "None to start" },
                { factor: "Skill transfer", prod: "Yes (food/pharma certifications)", pick: "Limited" },
              ].map((row) => (
                <tr key={row.factor} className="border-b border-gray-100">
                  <td className="p-2 border border-gray-200 text-xs font-medium text-gray-700">{row.factor}</td>
                  <td className="p-2 border border-gray-200 text-xs text-brand-700">{row.prod}</td>
                  <td className="p-2 border border-gray-200 text-xs text-gray-600">{row.pick}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Neither is universally "better." Pick based on your physical preference and what sectors
          are available near the area you will be living.
        </p>
      </section>

      {/* Section 7: Agencies */}
      {productionAgencies.length > 0 && (
        <section id="agencies" className="mb-8 scroll-mt-20">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Agencies that place production workers</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {productionAgencies.map((a) => (
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ — Production work in the Netherlands</h2>
        <div className="card p-5 space-y-4">
          {[
            { q: "Do I need any qualifications for production work?", a: "No qualifications are required for most production worker roles. Some sectors (pharmaceutical, electronics) may require a brief certified induction course — usually arranged by the agency at no cost to you." },
            { q: "Is a medical check required?", a: "Some sectors (meat processing, pharmaceutical) require a basic health check before starting. This is usually arranged by the agency. It is not a barrier to employment — it is a regulatory requirement of the sector." },
            { q: "Can I get promoted to machine operator?", a: "Yes. In many production facilities, experienced line workers who demonstrate reliability and interest are trained as machine operators. This typically pays €1–€2/hr more and involves less repetitive motion." },
            { q: "What about food safety training?", a: "Almost all food production facilities require a HACCP (food hygiene) awareness briefing on your first day. This is provided by the employer and takes 30–60 minutes. You do not need to prepare anything in advance." },
            { q: "Is production work available year-round?", a: "Yes. Unlike agricultural picking (seasonal), food and manufacturing production is year-round. Demand peaks before Christmas and during summer (beverage, ice cream). Slowest period is typically January–February." },
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
        <p className="font-black text-base mb-1">Looking for a production worker job with housing?</p>
        <p className="text-xs text-gray-400 mb-4">EU citizens only. Apply via WhatsApp in under 2 minutes.</p>
        <Link
          href="/apply/food-production"
          className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-black text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
        >
          Apply for production jobs →
        </Link>
      </div>

      {/* Related */}
      <div className="card p-5">
        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Related pages</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/what-is-order-picking", "What is order picking? Guide"],
            ["/after-you-apply", "What happens after you apply?"],
            ["/work-netherlands-from-poland", "Work in Netherlands from Poland"],
            ["/real-salary-netherlands-after-rent", "Real salary after housing & tax"],
            ["/warehouse-work-netherlands", "Warehouse work guide"],
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
