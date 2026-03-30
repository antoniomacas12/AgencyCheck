"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "How much salary do I actually keep after rent and deductions in the Netherlands?",
    a: "It depends heavily on your agency. At the legal minimum wage (€14.71/hr, 40h/week), your gross weekly pay is around €600. After Dutch income tax (with heffingskorting credits), agency housing (€95/wk), transport (€25/wk), health insurance (€35/wk), and admin fees, most workers keep between €280–€340/week. That is 47–57% of gross. Our salary calculator on this page gives you an exact breakdown based on your specific situation.",
  },
  {
    q: "Are agency deductions from salary legal in the Netherlands?",
    a: "Yes — but only within strict limits. Under the ABU and NBBU Collective Labour Agreements (CAO), agencies may deduct housing costs, transport, and health insurance from your gross wages — but these must be clearly specified in your contract before you start work. Deductions may NOT exceed the actual cost of the service. If your payslip shows deductions for services you did not receive, or amounts that are higher than the contracted price, that is illegal. You can report violations to the Inspectie SZW (Netherlands Labour Authority) or contact FNV.",
  },
  {
    q: "How do I verify if a Dutch employment agency is legitimate and trustworthy?",
    a: "Check for SNA (Stichting Normering Arbeid) or ABU/NBBU registration — these are the two main industry quality marks in the Netherlands. A legitimate agency will also be registered in the Dutch Chamber of Commerce (KvK). On AgencyCheck, each agency profile shows its verification status, worker reviews, and housing conditions. Red flags include: requesting advance payment, no written contract, housing not included in contract, and pressure to start immediately.",
  },
  {
    q: "What are the average housing costs when working through a Dutch agency?",
    a: "Agency-arranged housing typically costs €80–€120/week (€347–€520/month), deducted directly from your gross salary. Under SNF (Stichting Normering Flexwonen) standards, the maximum legal deduction for shared accommodation is around €113.50/week (2024 standard). Be cautious of agencies charging more than this limit. In practice, the cheapest verified agencies with good housing reviews on our platform charge €90–€100/week. Own accommodation in the Netherlands ranges from €500–€900/month depending on city.",
  },
  {
    q: "What is the minimum wage in the Netherlands in 2026?",
    a: "The Dutch statutory minimum wage (Wettelijk Minimumloon, WML) is €14.71 per hour in 2026, applicable to workers aged 21 and over. For 40 hours/week this equals approximately €2,545/month gross, or €117.68 for an 8-hour day. Agencies are legally required to pay at least WML — if your agency pays less, contact the Inspectie SZW immediately. Note: some agencies use 'all-in wages' which must still equal at least WML for regular hours.",
  },
  {
    q: "What should I do if my agency is not paying me correctly or deducting too much?",
    a: "First, request a full itemised payslip (loonstrook) — your employer is legally required to provide one. Compare every line against your signed employment contract. If you find discrepancies: (1) contact your agency in writing, (2) report to the Inspectie SZW (www.inspectieszw.nl), (3) contact FNV or CNV (Dutch trade unions — free for workers), (4) for housing issues, contact SNF. You can also submit a review on AgencyCheck to warn other workers.",
  },
  {
    q: "Can my agency cancel my housing if my contract ends?",
    a: "This is a common and serious risk. Many agency contracts include a housing clause tied directly to employment — meaning if your work contract ends, you must vacate agency housing within 28 days or less. This is legal under Dutch law as long as it is clearly stated in your contract before signing. Always read the housing termination clause carefully. We recommend always having a backup plan for accommodation when working through agencies that provide tied housing.",
  },
];

export default function HomepageFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={i}
          className={`rounded-2xl border transition-all ${
            open === i
              ? "border-blue-200 bg-blue-50/30 shadow-sm"
              : "border-gray-100 bg-white hover:border-gray-200"
          }`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-start justify-between gap-4 text-left px-5 sm:px-6 py-4 sm:py-5"
            aria-expanded={open === i}
          >
            <span className={`text-sm font-bold leading-snug ${open === i ? "text-blue-800" : "text-gray-900"}`}>
              {item.q}
            </span>
            <span className={`shrink-0 mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
              open === i
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-gray-200 text-gray-400"
            }`}>
              <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 transition-transform ${open === i ? "rotate-180" : ""}`}>
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          {open === i && (
            <div className="px-5 sm:px-6 pb-5">
              <p className="text-sm text-gray-700 leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
