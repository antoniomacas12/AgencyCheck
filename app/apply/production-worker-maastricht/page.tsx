// /apply/production-worker-maastricht — Production Worker / Picker
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
  title: "Production Worker / Picker — Cookie Factory near Maastricht | AgencyCheck",
  description: "Production worker and picker jobs in a cookie factory near Maastricht. €16.12/hr, shift allowance on top, immediate start. Own transport required. Apply via WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/apply/production-worker-maastricht",
    languages: {
      "en":        "https://agencycheck.io/apply/production-worker-maastricht",
      "pl":        "https://agencycheck.io/pl/oferty-pracy/pracownik-produkcji-maastricht",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca/lucrator-productie-maastricht",
      "x-default": "https://agencycheck.io/apply/production-worker-maastricht",
    },
  },
};

const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Production Worker / Picker (Near Maastricht, NL)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Production Worker / Picker",
  description:    "Production and picking work in a cookie factory near Maastricht, Netherlands. €16.12/hr with shift allowance on top. 2 or 3 shift system. Immediate start available. Own transport required — factory is not accessible by public transport. Basic English or Dutch required. EU work authorisation required.",
  datePosted:     "2026-04-01",
  validThrough:   "2026-09-01",
  employmentType: "FULL_TIME",
  city:           "Maastricht",
  region:         "Limburg",
  country:        "NL",
  currency:       "EUR",
  minSalary:      16.12,
  maxSalary:      18,
  salaryUnit:     "HOUR",
  pageUrl:        "/apply/production-worker-maastricht",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Hi, I want to apply for: Production Worker / Picker (Near Maastricht, NL)")}`,
});

const FAQ_ITEMS = [
  {
    q: "How do I apply?",
    a: "Tap the 'Apply via WhatsApp' button — it opens a pre-filled message directly to us. We typically respond within 24 hours to discuss availability and next steps.",
  },
  {
    q: "Do I need experience in a factory or production environment?",
    a: "No prior experience is required. The work involves production line tasks and picking — full training is provided on site. If you're physically fit and reliable, you're a good fit.",
  },
  {
    q: "Do I need a car or own transport?",
    a: "Yes — own transport is required. The factory is located outside Maastricht and is not accessible by public transport. This is a firm requirement.",
  },
  {
    q: "Do I need to speak Dutch?",
    a: "No. Basic English is enough to communicate on the production floor and with the team. Colleagues come from various countries.",
  },
  {
    q: "Is accommodation included?",
    a: "Accommodation is not included. Candidates must arrange their own housing in or near the Maastricht area.",
  },
  {
    q: "What shifts are available?",
    a: "The factory operates a 2 or 3 shift system. Exact shift patterns will be confirmed when you apply — we'll match you based on your availability.",
  },
  {
    q: "What documents do I need?",
    a: "A valid EU passport or work permit (proof of right to work in the Netherlands) is required. We'll confirm the full document list when you contact us.",
  },
];

export default function ProductionWorkerMaastrichtPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",       url: "/" },
        { name: "Now Hiring", url: "/apply" },
        { name: "Production Worker / Picker", url: "/apply/production-worker-maastricht" },
      ])) }} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-16">

        {/* ── Badge ─────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Now Hiring · Netherlands
        </div>

        {/* ── Title ─────────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Production Worker<br />
          <span className="text-[#22C55E]">/ Picker</span>
        </h1>
        <p className="text-gray-400 text-sm mb-2">Near Maastricht, Netherlands</p>
        <p className="text-[#22C55E] font-semibold text-sm mb-4 tracking-wide uppercase">
          €16.12/hr · Immediate start · Cookie factory
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={27} hoursAgo={5} />
          <ShareJobButton title="Production Worker / Picker — Near Maastricht, NL" />
        </div>

        {/* ── Quick highlights ──────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { icon: "⚡", label: "Start ASAP" },
            { icon: "🏭", label: "Food factory" },
            { icon: "🚗", label: "Own transport" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
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
              Production &amp; picking work in a cookie factory near Maastricht.<br />
              <span className="text-gray-300 font-normal">
                Stable factory environment, consistent shifts, immediate start available.
              </span>
            </p>
          </div>

          {/* What You Get */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              What You Get
            </p>
            <ul className="space-y-3">
              {[
                "€16.12/hr — shift allowance paid on top",
                "2 or 3 shift system",
                "Start ASAP — no long waiting process",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              Requirements
            </p>
            <ul className="space-y-3">
              {[
                "English or Dutch — basic communication",
                "Own transport to the workplace",
                "Physically fit for production line work",
                "EU work authorisation required",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Warning note */}
          <div className="bg-amber-400/10 border border-amber-400/25 rounded-xl px-5 py-4 text-sm leading-relaxed">
            <p className="text-amber-300 font-semibold mb-1">⚠ Important</p>
            <p className="text-gray-300">
              Own transport is required — the factory is not accessible by public transport.
            </p>
          </div>

        </div>

        {/* ── CTA (desktop only) ────────────────────────────────── */}
        <div className="hidden sm:block mt-12">
          <DesktopApplyButton
            waBase={WA_BASE}
            jobTitle={JOB_TITLE}
            source="maastricht"
            jobId="production-worker-maastricht"
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
        <RelatedJobs currentId="production-worker-maastricht" />

      </div>

      <StickyApplyBar waBase={WA_BASE} jobTitle={JOB_TITLE} source="maastricht" jobId="production-worker-maastricht" />

    </div>
  );
}
