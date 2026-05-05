// /apply/food-production — Food Production Operator job posting
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
  title: "Food Production Operator — Now Hiring in Netherlands | AgencyCheck",
  description: "Food production operator jobs in the Netherlands. Fast placement via verified agency partners. Legal contract, start within 1 week. Apply via WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/apply/food-production",
    languages: {
      "en":        "https://agencycheck.io/apply/food-production",
      "pl":        "https://agencycheck.io/pl/oferty-pracy/operator-produkcji",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca/operator-productie-alimentara",
      "x-default": "https://agencycheck.io/apply/food-production",
    },
  },
};

const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Food Production Operator (Netherlands)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Food Production Operator",
  description:    "Food production and processing work in the Netherlands. Placed via established agency partners — fast onboarding, legal contracts. Start within 1 week. Basic English or Dutch required. EU work authorisation required.",
  datePosted:     "2026-04-01",
  validThrough:   "2026-09-01",
  employmentType: "FULL_TIME",
  city:           "Netherlands",
  region:         "Netherlands",
  country:        "NL",
  currency:       "EUR",
  minSalary:      14.71,
  maxSalary:      16,
  salaryUnit:     "HOUR",
  pageUrl:        "/apply/food-production",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Hi, I want to apply for: Food Production Operator (Netherlands)")}`,
});

const FAQ_ITEMS = [
  {
    q: "How do I apply?",
    a: "Tap the 'Apply via WhatsApp' button — it opens a pre-filled message directly to us. We typically respond within 24 hours and guide you through the next steps.",
  },
  {
    q: "Do I need previous experience in food production?",
    a: "Previous food industry or production experience is preferred but not always required. If you're physically fit and reliable, we still want to hear from you — many of our placements start with no prior factory experience.",
  },
  {
    q: "Do I need to speak Dutch?",
    a: "No. Basic English is sufficient for communication on the production floor and with us. Many workers placed through our partners don't speak Dutch.",
  },
  {
    q: "Is accommodation included?",
    a: "Accommodation is not included with this position. Candidates must be based in the Netherlands or able to arrange their own housing before starting.",
  },
  {
    q: "How quickly can I start?",
    a: "We target a start within 1 week if your documents are ready. Placement is handled through verified agency partners who move fast.",
  },
  {
    q: "What documents do I need?",
    a: "You'll need a valid EU passport or work permit confirming your right to work in the Netherlands, and a BSN number (or ability to obtain one quickly). We'll walk you through the exact requirements when you apply.",
  },
];

export default function FoodProductionPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",       url: "/" },
        { name: "Now Hiring", url: "/apply" },
        { name: "Food Production Operator", url: "/apply/food-production" },
      ])) }} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-16">

        {/* ── Badge ─────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Now Hiring · Netherlands
        </div>

        {/* ── Title ─────────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3 text-white">
          Food Production Operator
        </h1>
        <p className="text-[#22C55E] font-semibold text-sm mb-4 tracking-wide uppercase">
          Fast placement · Via verified agency partners
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={34} hoursAgo={1} />
          <ShareJobButton title="Food Production Operator — Netherlands" />
        </div>

        {/* ── Divider ───────────────────────────────────────────── */}
        <div className="border-t border-white/10 mb-10" />

        {/* ── Sections ──────────────────────────────────────────── */}
        <div className="space-y-10 text-sm text-gray-300 leading-relaxed">

          {/* The Role */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              The Role
            </p>
            <p className="text-white text-base font-medium">
              Food production &amp; processing in the Netherlands.<br />
              <span className="text-gray-300 font-normal">
                Placed via established agency partners — fast onboarding, legal contracts.
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
                "Previous food industry or production experience (preferred)",
                "Physically fit, able to work on production line",
                "Basic English or Dutch communication",
                "EU work authorisation required",
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
              Workers looking for stable employment in the Netherlands with a fast start.
              Placed through verified agency partners with proper contracts — no surprises,
              no hidden fees.
            </p>
          </div>

          {/* What's on Offer */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              What&apos;s on Offer
            </p>
            <ul className="space-y-3">
              {[
                "Start within 1 week",
                "Legal contract via verified agency",
                "Stable hours, consistent work",
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
            Candidates must be based in or able to relocate to the Netherlands.
          </div>

        </div>

        {/* ── CTA (desktop only) ────────────────────────────────── */}
        <div className="hidden sm:block mt-12">
          <a
            href={`${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE} [src:food-production]`)}`}
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
        <RelatedJobs currentId="food-production" />

      </div>

      <StickyApplyBar waBase={WA_BASE} jobTitle={JOB_TITLE} source="food-production" />

    </div>
  );
}
