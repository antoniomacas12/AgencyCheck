import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Happens After You Apply? — AgencyCheck Job Process Explained 2026",
  description:
    "You applied for a job in the Netherlands via AgencyCheck — what happens next? Complete timeline from WhatsApp pre-screen to contract, arrival, first day, and first paycheck.",
  alternates: { canonical: "https://agencycheck.io/after-you-apply" },
  openGraph: {
    title: "What Happens After You Apply via AgencyCheck?",
    description:
      "Complete timeline from WhatsApp application to first paycheck — what to expect at every stage when applying for agency work in the Netherlands.",
  },
};

export default function AfterYouApplyPage() {
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
                "name": "How quickly will I hear back after applying?",
                "acceptedAnswer": { "@type": "Answer", "text": "Most candidates receive a WhatsApp reply from a recruiter within 1–4 hours during business hours (Monday–Friday, 08:00–18:00 CET). Applications submitted on evenings or weekends are typically followed up the next working morning." },
              },
              {
                "@type": "Question",
                "name": "What documents do I need to send?",
                "acceptedAnswer": { "@type": "Answer", "text": "You will need a photo or scan of your EU ID card or passport, and any relevant certificates (forklift VCA, driving licence CE) if applicable to the role." },
              },
              {
                "@type": "Question",
                "name": "When will I start working?",
                "acceptedAnswer": { "@type": "Answer", "text": "Start dates vary by vacancy. Urgent vacancies can have you starting within 1–2 weeks of application. Standard placements typically take 2–4 weeks from application to first day." },
              },
            ],
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">After You Apply</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-1 font-medium">
            ✅ Application guide
          </span>
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            Updated 2026
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          What Happens After You Apply via AgencyCheck?
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          You just submitted your application via WhatsApp — now what? This page walks through
          the entire process from your first reply all the way to your first paycheck, so you
          know exactly what to expect at every step and what you need to prepare.
        </p>
      </div>

      {/* Quick timeline overview */}
      <div className="card p-5 mb-8">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Timeline overview</p>
        <div className="space-y-3">
          {[
            { step: "1", label: "Application submitted", time: "Day 0", color: "bg-gray-200 text-gray-700" },
            { step: "2", label: "Recruiter contacts you on WhatsApp", time: "1–4 hours", color: "bg-brand-100 text-brand-700" },
            { step: "3", label: "Pre-qualification call / questions", time: "Day 1–2", color: "bg-brand-100 text-brand-700" },
            { step: "4", label: "Document collection (ID, certificates)", time: "Day 2–5", color: "bg-amber-50 text-amber-700" },
            { step: "5", label: "Vacancy match confirmed, offer made", time: "Day 3–7", color: "bg-amber-50 text-amber-700" },
            { step: "6", label: "Contract signed", time: "Day 5–10", color: "bg-green-50 text-green-700" },
            { step: "7", label: "Travel arranged, housing confirmed", time: "1–2 weeks before start", color: "bg-green-50 text-green-700" },
            { step: "8", label: "First working day", time: "Week 2–4 typically", color: "bg-green-100 text-green-800" },
            { step: "9", label: "BSN registration + bank account", time: "Week 1 of work", color: "bg-green-100 text-green-800" },
            { step: "10", label: "First paycheck", time: "End of first working week", color: "bg-emerald-100 text-emerald-800" },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3">
              <span className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 ${item.color}`}>
                {item.step}
              </span>
              <div className="flex-1 flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400 shrink-0">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: First contact */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Step 1 — First contact from the recruiter</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          After you submit your application and the WhatsApp conversation opens, a recruiter will
          contact you. This usually happens within 1–4 hours on weekdays. Evening and weekend
          applications are picked up the next working morning.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm mb-3">
          <p className="font-semibold text-blue-800 mb-2">What the recruiter will ask you:</p>
          <ul className="space-y-1 text-xs text-blue-700">
            <li>→ Confirm your EU citizenship and country of origin</li>
            <li>→ Your current location and availability</li>
            <li>→ What type of work you are looking for (warehouse, production, driving)</li>
            <li>→ Whether you have a BSN number already or not</li>
            <li>→ Whether you have a valid driving licence (category B or CE if relevant)</li>
            <li>→ Whether you need housing or have your own accommodation</li>
          </ul>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
          <strong>Tip:</strong> Reply promptly. Vacancies fill quickly — candidates who respond within
          the first hour are significantly more likely to get placed. Keep WhatsApp notifications on
          after you apply.
        </div>
      </section>

      {/* Step 2: Documents */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Step 2 — Sending your documents</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Once the recruiter has confirmed you are a match for a vacancy, they will ask you to send
          documents via WhatsApp. These are checked and passed to the agency.
        </p>
        <div className="space-y-2">
          {[
            { doc: "Photo of EU ID card (front and back) or passport", required: true, tip: "Use good lighting. Make sure all text is readable. A photo of a photo of a document usually doesn't work." },
            { doc: "Forklift VCA certificate (if applying for forklift roles)", required: false, tip: "Send the original certificate number — agencies can verify EU certificates in most countries." },
            { doc: "Category CE driving licence (if applying for CE driver roles)", required: false, tip: "Both front and back. Include your digital tachograph card if you have one." },
            { doc: "Photo — recent headshot", required: false, tip: "Not all agencies require this. Used for onboarding paperwork." },
          ].map((item) => (
            <div key={item.doc} className="flex gap-3 p-3 border border-gray-100 rounded-xl">
              <span className={`text-xs font-semibold shrink-0 mt-0.5 ${item.required ? "text-red-600" : "text-gray-400"}`}>
                {item.required ? "REQUIRED" : "OPTIONAL"}
              </span>
              <div>
                <p className="text-xs font-medium text-gray-800">{item.doc}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Step 3: Offer */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Step 3 — The job offer and contract</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Once the agency has reviewed your documents and confirmed availability, they will send you
          a formal job offer. This will include:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {[
            { item: "Hourly rate and shift schedule", note: "Always confirm the rate matches what was discussed. Ask about overtime and weekend premiums." },
            { item: "Contract type and duration", note: "Most new workers start on Phase A — flexible contract with no guaranteed hours. This is normal." },
            { item: "Housing details (if included)", note: "Address or area of accommodation, weekly cost, and house rules. Ask about how many people per room." },
            { item: "Start date and reporting instructions", note: "First day location, what to wear, what to bring. Some agencies pick you up from a central location." },
          ].map((item) => (
            <div key={item.item} className="border border-gray-200 rounded-xl p-3">
              <p className="text-xs font-bold text-gray-800 mb-1">📋 {item.item}</p>
              <p className="text-xs text-gray-500">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <strong>Before signing:</strong> Make sure you understand the contract language. You have the
          right to receive your contract in a language you understand (English at minimum). If anything
          is unclear — the housing cost, the notice period, the shift schedule — ask before you sign.
        </div>
      </section>

      {/* Step 4: Arrival */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Step 4 — Arriving in the Netherlands</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Your recruiter will coordinate your arrival with the agency. Here is what happens in your
          first 3 days:
        </p>
        <div className="space-y-3">
          {[
            {
              day: "Day 1 — Arrival",
              events: [
                "Meet agency representative or go directly to accommodation address provided",
                "Sign housing agreement and receive keys",
                "Brief orientation — house rules, emergency contacts, grocery stores nearby",
                "Confirm start time for day 1 at the workplace",
              ],
            },
            {
              day: "Day 2 — First day at work",
              events: [
                "Arrive at the workplace (often a warehouse or factory) at the agreed time",
                "Safety induction (30–60 minutes) — mandatory, covers emergency exits, PPE, rules",
                "Receive protective clothing: safety boots, vest, gloves (usually provided or charged at cost)",
                "Assigned to a supervisor or team leader for your first shift",
              ],
            },
            {
              day: "Day 3–7 — First week admin",
              events: [
                "Agency helps you register for a BSN number at the local gemeente or RNI desk",
                "Open a Dutch bank account (ING or ABN AMRO are easiest for newcomers; Bunq works with just a BSN)",
                "Provide your Dutch IBAN to the agency for payroll",
                "Receive your first shift schedule for the coming week",
              ],
            },
          ].map((block) => (
            <div key={block.day} className="border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-2">{block.day}</p>
              <ul className="space-y-1">
                {block.events.map((ev) => (
                  <li key={ev} className="flex gap-2 text-xs text-gray-600">
                    <span className="text-green-500 shrink-0 mt-0.5">→</span>
                    {ev}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Step 5: First paycheck */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Step 5 — Your first paycheck</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          Dutch agencies typically pay weekly (every Friday) or bi-weekly. Your first payment usually
          arrives at the end of your first full working week, once you have provided your IBAN.
        </p>
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-sm mb-4">
          <p className="font-semibold text-brand-800 mb-2">How to read your first payslip (loonstrook):</p>
          <div className="space-y-2">
            {[
              { label: "Brutoloon", meaning: "Gross wage — your total earnings before deductions" },
              { label: "Loonbelasting / premies", meaning: "Income tax and social insurance deductions (~37%)" },
              { label: "Huisvestingskosten", meaning: "Housing deduction — should match your housing agreement" },
              { label: "Nettoloon", meaning: "Take-home pay — what arrives in your bank account" },
              { label: "Vakantiegeld opbouw", meaning: "Holiday pay accrual — 8% of gross, paid out annually in May" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3">
                <p className="text-xs font-bold text-brand-700 w-36 shrink-0">{item.label}</p>
                <p className="text-xs text-brand-800">{item.meaning}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
          <strong>If something looks wrong on your payslip:</strong> Contact your agency contact person
          immediately. Common issues are: wrong hourly rate, incorrect hours, excessive housing deduction,
          or no BSN registered (emergency tax rate applied). All are fixable — but act fast, ideally
          within 24 hours of receiving the payslip.
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
        <div className="card p-5 space-y-4">
          {[
            { q: "How quickly will I hear back after applying?", a: "Most candidates receive a WhatsApp reply within 1–4 hours on weekdays. Applications on evenings or weekends are followed up the next working morning (typically before 10:00 CET)." },
            { q: "Can I apply from inside the Netherlands?", a: "Yes. Many workers apply while already in the Netherlands — either between jobs, or recently arrived with no work yet arranged. Start date can be faster in this case." },
            { q: "What if there are no matching vacancies right now?", a: "The recruiter will keep your details and contact you when a matching vacancy comes in. High-demand periods are spring (March–May) and before Christmas (October–November)." },
            { q: "Can my partner apply at the same time?", a: "Yes. Apply separately — two applications give two chances of placement. You can note in your application that you are a couple and would prefer to be placed near the same area or facility." },
            { q: "What if I change my mind after signing?", a: "Contact the agency immediately. Notice periods in Phase A contracts are typically 1–5 days. The earlier you communicate, the better. Once you have travelled to the Netherlands and moved into housing, cancelling has more financial implications." },
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
        <p className="font-black text-base mb-1">Haven&apos;t applied yet?</p>
        <p className="text-xs text-gray-400 mb-4">
          EU citizens only. Browse current vacancies with housing included — apply via WhatsApp in 2 minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/apply"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-black text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Browse current vacancies →
          </Link>
        </div>
      </div>

      {/* Related */}
      <div className="card p-5">
        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Related guides</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ["/what-is-order-picking", "What is order picking? Honest guide"],
            ["/what-is-production-work-netherlands", "What is production work?"],
            ["/work-netherlands-from-poland", "Work in Netherlands from Poland"],
            ["/work-netherlands-from-romania", "Work in Netherlands from Romania"],
            ["/real-salary-netherlands-after-rent", "Real salary after housing & tax"],
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
