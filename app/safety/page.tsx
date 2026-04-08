import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Spot Fake Recruiters — Safety Guide | AgencyCheck",
  description:
    "Protect yourself from recruitment scams. Learn the 8 red flags of fake Dutch labour agencies, how to verify an agency is legitimate, and what to do if you are targeted.",
  alternates: { canonical: "https://agencycheck.io/safety" },
};

// ── Red flags ────────────────────────────────────────────────────────────────
const RED_FLAGS = [
  {
    icon: "💸",
    title: "They ask for money before you start",
    body: "No legitimate Dutch agency charges workers a placement fee, registration fee, or deposit. Any upfront payment request is a scam — full stop.",
  },
  {
    icon: "📄",
    title: "They ask you to send original documents",
    body: "Legitimate agencies never need your original passport, ID card, or driving licence. Scammers collect documents to commit identity fraud. Never send originals.",
  },
  {
    icon: "🔒",
    title: "The contract is vague or missing",
    body: "Every Dutch agency must give you a written contract before you start. If the recruiter avoids sending one, or the contract has no company registration number, walk away.",
  },
  {
    icon: "📱",
    title: "Contact is only via WhatsApp or social media",
    body: "Real agencies have a website with a verifiable KVK (Chamber of Commerce) number and a company email address. If you can only reach them on WhatsApp or Instagram, it is suspicious.",
  },
  {
    icon: "🏠",
    title: "Housing is compulsory and overpriced",
    body: "In the Netherlands, employers cannot force you to rent housing from them. If an agency says housing is mandatory and charges more than €150–200 per week, it may be an abuse of power.",
  },
  {
    icon: "🌐",
    title: "The job was advertised on a random Facebook group",
    body: "Many scam offers appear in Facebook groups targeting workers from Poland, Romania, Portugal, and Bulgaria. Always verify the agency independently before responding.",
  },
  {
    icon: "🚨",
    title: "The offer sounds too good to be true",
    body: "€3,000+ per month for unskilled work with no experience required, guaranteed overtime, free car — these claims are used to lure victims. Realistic wages for warehouse/logistics in the Netherlands are €12–15/hour gross.",
  },
  {
    icon: "👻",
    title: "The recruiter disappears after payment",
    body: "This is the most common scam: they take a 'registration fee', promise to send travel details, then go silent. If you have paid and been ghosted, report it immediately.",
  },
];

// ── How to verify ────────────────────────────────────────────────────────────
const VERIFY_STEPS = [
  {
    n: "1",
    title: "Check the KVK number",
    body: "Every company in the Netherlands must be registered with the Chamber of Commerce (KVK). Ask the agency for their KVK number and verify it at kvk.nl.",
  },
  {
    n: "2",
    title: "Check the NEN 4400-1 or ABU/NBBU membership",
    body: "Reputable Dutch labour agencies are certified under NEN 4400-1 or are members of ABU or NBBU. These bodies require agencies to comply with Dutch labour law.",
  },
  {
    n: "3",
    title: "Look for reviews from real workers",
    body: "Search the agency name on AgencyCheck, Google, and Trustpilot. Look for recent reviews from workers, not just employer testimonials.",
  },
  {
    n: "4",
    title: "Call the official number — not WhatsApp",
    body: "Use the phone number listed on the company's official website (not the one the recruiter gave you). If the website has no phone number, that is a red flag.",
  },
  {
    n: "5",
    title: "Never pay upfront",
    body: "This bears repeating. No real Dutch agency charges workers. If asked for money, end contact and report.",
  },
];

// ── Where to report ──────────────────────────────────────────────────────────
const REPORT_LINKS = [
  {
    label: "Dutch Police (Politie) — online report",
    href:  "https://www.politie.nl/aangifte-of-melding-doen",
  },
  {
    label: "Netherlands Labour Authority (Inspectie SZW)",
    href:  "https://www.nlarbeidsinspectie.nl/contact",
  },
  {
    label: "FairWork — labour rights organisation",
    href:  "https://www.fairwork.nu/",
  },
  {
    label: "Meld Misdaad Anoniem — anonymous crime reporting",
    href:  "https://www.meldmisdaadanoniem.nl/",
  },
];

export default function SafetyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 mb-4 inline-block">
          ← Back to home
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🛡️</span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
            How to spot fake recruiters
          </h1>
        </div>
        <p className="text-base text-gray-600 leading-relaxed">
          Recruitment scams targeting Eastern European workers are common. This guide explains the
          warning signs, how to verify an agency, and what to do if you are targeted.
        </p>
      </div>

      {/* Golden rule */}
      <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-5 mb-8">
        <p className="text-sm font-black text-red-700 uppercase tracking-wide mb-1">The golden rule</p>
        <p className="text-lg font-bold text-red-900 leading-snug">
          A legitimate Dutch labour agency will <span className="underline">never</span> ask you for money.
        </p>
        <p className="text-sm text-red-700 mt-1">
          No registration fee. No placement fee. No deposit. No exceptions.
        </p>
      </div>

      {/* Red flags */}
      <h2 className="text-lg font-black text-gray-900 mb-4">8 red flags to watch out for</h2>
      <div className="space-y-3 mb-10">
        {RED_FLAGS.map((flag) => (
          <div key={flag.title} className="flex gap-4 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
            <span className="text-2xl flex-shrink-0 mt-0.5">{flag.icon}</span>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-0.5">{flag.title}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{flag.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* How to verify */}
      <h2 className="text-lg font-black text-gray-900 mb-4">How to verify an agency is legitimate</h2>
      <ol className="space-y-4 mb-10">
        {VERIFY_STEPS.map((step) => (
          <li key={step.n} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
              {step.n}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{step.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* If you have been scammed */}
      <h2 className="text-lg font-black text-gray-900 mb-2">If you have been scammed</h2>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Do not be ashamed — these scams are professionally run and target thousands of workers each year.
        Stop all contact with the scammer immediately, do not send more money, and report to the
        following organisations:
      </p>
      <div className="space-y-2 mb-10">
        {REPORT_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
          >
            <span className="flex-1">{link.label}</span>
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-5 text-center">
        <p className="text-sm font-bold text-blue-900 mb-1">Looking for verified agencies?</p>
        <p className="text-xs text-blue-700 mb-4">
          AgencyCheck only lists agencies we have verified or that have real worker reviews.
          Every profile shows ratings for housing, salary accuracy, and management.
        </p>
        <Link
          href="/agencies"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          Browse verified agencies →
        </Link>
      </div>
    </div>
  );
}
