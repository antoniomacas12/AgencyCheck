// /apply/reachtruck — C+E Truck Driver job posting
// Dark theme, green accents. Apply via WhatsApp.

import type { Metadata } from "next";
import StickyApplyBar from "@/components/StickyApplyBar";
import ApplicantBadge from "@/components/ApplicantBadge";
import RelatedJobs from "@/components/RelatedJobs";
import JobAlertStrip from "@/components/JobAlertStrip";
import JobFAQ from "@/components/JobFAQ";
import ShareJobButton from "@/components/ShareJobButton";
import { jobPostingSchema, breadcrumbSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "C+E Truck Driver — Now Hiring in Dordrecht, NL | AgencyCheck",
  description: "C+E truck driver wanted in Dordrecht, NL. Direct contract, €150+/day, no agency middlemen. Netherlands–France–Germany routes, home every day. Apply via WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/apply/reachtruck",
    languages: {
      "en":        "https://agencycheck.io/apply/reachtruck",
      "pl":        "https://agencycheck.io/pl/oferty-pracy/kierowca-ce",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca/sofer-ce",
      "x-default": "https://agencycheck.io/apply/reachtruck",
    },
  },
};

const WA_BASE  = "https://wa.me/31649210631";
const JOB_TITLE = "C+E Truck Driver (Dordrecht, NL)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "C+E Truck Driver",
  description:    "C+E international truck driver for Netherlands–France–Germany routes. Home every day — no nights in the cab. Direct contract, no agency middleman. Starting from €150/day. Valid C+E licence + Code 95 required.",
  datePosted:     "2026-04-01",
  validThrough:   "2026-09-01",
  employmentType: "FULL_TIME",
  city:           "Dordrecht",
  region:         "South Holland",
  country:        "NL",
  currency:       "EUR",
  minSalary:      150,
  maxSalary:      200,
  salaryUnit:     "DAY",
  pageUrl:        "/apply/reachtruck",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Hi, I want to apply for: C+E Truck Driver (Dordrecht, NL)")}`,
});

const FAQ_ITEMS = [
  {
    q: "How do I apply for this position?",
    a: "Tap the 'Apply via WhatsApp' button — it opens a pre-filled message directly to us. We typically respond within 24 hours to discuss next steps and schedule a quick call.",
  },
  {
    q: "Do I need to speak Dutch?",
    a: "No. Basic English is enough. Many of our drivers are from outside the Netherlands and manage fine with English on the road and in the depot.",
  },
  {
    q: "Is accommodation included?",
    a: "Accommodation is not included with this position. Candidates must be based in or able to relocate to the Dordrecht area independently.",
  },
  {
    q: "What documents do I need?",
    a: "You'll need a valid C+E driving licence, Code 95 certificate, and proof of EU work authorisation (e.g. EU passport or valid work permit). We'll confirm exactly what's needed when you apply.",
  },
  {
    q: "How quickly can I start?",
    a: "If your documents are in order we can typically get you started within 1–2 weeks. No long waiting process.",
  },
  {
    q: "Is this a direct contract or via an agency?",
    a: "This is a direct contract — no middlemen, no agency fees deducted from your pay. You sign directly with the employer.",
  },
];

export default function CETruckDriverPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",       url: "/" },
        { name: "Now Hiring", url: "/apply" },
        { name: "C+E Truck Driver", url: "/apply/reachtruck" },
      ])) }} />
      {/* Extra bottom padding on mobile so sticky bar doesn't cover content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-16">

        {/* ── Badge ─────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Now Hiring · Dordrecht, NL
        </div>

        {/* ── Title ─────────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3 text-white">
          C+E Truck Driver
        </h1>
        <p className="text-[#22C55E] font-semibold text-sm mb-4 tracking-wide uppercase">
          Direct hire · No agency · No middlemen
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={18} hoursAgo={3} />
          <ShareJobButton title="C+E Truck Driver — Dordrecht, NL" />
        </div>

        {/* ── Divider ───────────────────────────────────────────── */}
        <div className="border-t border-white/10 mb-10" />

        {/* ── Sections ──────────────────────────────────────────── */}
        <div className="space-y-10 text-sm text-gray-300 leading-relaxed">

          {/* The Route */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              The Route
            </p>
            <p className="text-white text-base font-medium">
              Netherlands – France – Germany.<br />
              <span className="text-gray-300 font-normal">
                You return home every day — no nights in the cab.
              </span>
            </p>
          </div>

          {/* Requirements */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              Requirements
            </p>
            <ul className="space-y-3">
              {[
                "Valid C+E license + Code 95",
                "Experience in international transport (preferred)",
                "Reliable, ready to work, English basics required",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Who This Is For */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              Who This Is For
            </p>
            <p>
              Drivers who want steady, consistent work with a company that&apos;s been in the
              game for years and is growing. No drama, no middlemen — just reliable work.
            </p>
          </div>

          {/* What's on Offer */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              What&apos;s on Offer
            </p>
            <ul className="space-y-3">
              {[
                "Starting from €150/day — higher based on experience",
                "Weekly payment",
                "Direct contract, no middleman",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Note box */}
          <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-gray-400 text-sm leading-relaxed">
            <strong className="text-gray-200">Note:</strong> Accommodation is not included.
            Candidates must be based in or able to relocate to the Dordrecht area.
          </div>

        </div>

        {/* ── CTA (desktop — hidden on mobile, sticky bar handles it) ── */}
        <div className="hidden sm:block mt-12">
          <a
            href={`${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE} [src:reachtruck]`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-[#22C55E] hover:bg-green-400 active:scale-[0.98] text-white font-bold text-base py-4 rounded-2xl transition-all duration-150 shadow-lg shadow-green-900/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.418A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.07-1.116l-.292-.174-3.036.868.872-3.046-.19-.31A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.29-5.89c-.233-.117-1.379-.681-1.593-.759-.214-.077-.37-.116-.526.117-.155.232-.603.759-.739.915-.136.155-.272.174-.505.058-.233-.117-.982-.362-1.87-1.154-.691-.617-1.158-1.38-1.294-1.613-.136-.232-.014-.358.103-.474.105-.104.233-.272.35-.408.116-.136.155-.233.233-.388.077-.155.039-.291-.019-.407-.059-.117-.527-1.27-.722-1.739-.19-.456-.384-.394-.527-.401l-.448-.008c-.156 0-.408.059-.621.291-.214.233-.814.796-.814 1.94s.834 2.25.95 2.406c.116.155 1.64 2.504 3.975 3.512.556.24 1.99.52 2.315.336.233-.136.942-.385 1.074-.756.131-.37.131-.686.092-.756-.039-.077-.155-.116-.388-.233z" />
            </svg>
            Apply via WhatsApp
          </a>
          <p className="text-center text-gray-500 text-xs mt-3">
            Fastest way to apply · We reply within 24h
          </p>
        </div>

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <div className="border-t border-white/10 mt-10">
          <JobFAQ items={FAQ_ITEMS} />
        </div>

        <JobAlertStrip />
        <RelatedJobs currentId="reachtruck" />

      </div>

      <StickyApplyBar waBase={WA_BASE} jobTitle={JOB_TITLE} source="reachtruck" />

    </div>
  );
}
