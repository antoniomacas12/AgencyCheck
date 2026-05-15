// /apply/reachtruck — C+E Truck Driver job posting
// Dark theme, green accents. Apply via WhatsApp.

import type { Metadata } from "next";
import StickyApplyBar from "@/components/StickyApplyBar";
import DesktopApplyButton from "@/components/DesktopApplyButton";
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
          <DesktopApplyButton
            waBase={WA_BASE}
            jobTitle={JOB_TITLE}
            source="reachtruck"
            jobId="reachtruck"
          />
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

      <StickyApplyBar waBase={WA_BASE} jobTitle={JOB_TITLE} source="reachtruck" jobId="reachtruck" />

    </div>
  );
}
