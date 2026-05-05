// /apply/warehouse — Warehouse Worker
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
  title: "Warehouse Worker with Housing — Netherlands | AgencyCheck",
  description:
    "Warehouse worker jobs in the Netherlands with accommodation included. Picking, packing, sorting. Min. wage+, immediate start. Apply via WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/apply/warehouse",
    languages: {
      "en":        "https://agencycheck.io/apply/warehouse",
      "pl":        "https://agencycheck.io/pl/oferty-pracy/pracownik-magazynu",
      "ro":        "https://agencycheck.io/ro/oferte-de-munca/lucrator-depozit",
      "x-default": "https://agencycheck.io/apply/warehouse",
    },
  },
};

const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Warehouse Worker (Netherlands)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Warehouse Worker",
  description:    "Warehouse work in the Netherlands — picking, packing, sorting and logistics tasks. Accommodation available. Min. wage+. Immediate start possible. EU work authorisation required.",
  datePosted:     "2026-04-01",
  validThrough:   "2026-09-01",
  employmentType: "FULL_TIME",
  city:           "Netherlands",
  region:         "Netherlands",
  country:        "NL",
  currency:       "EUR",
  minSalary:      13.27,
  maxSalary:      15,
  salaryUnit:     "HOUR",
  pageUrl:        "/apply/warehouse",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Hi, I want to apply for: Warehouse Worker (Netherlands)")}`,
});

const FAQ_ITEMS = [
  {
    q: "How do I apply?",
    a: "Tap the 'Apply via WhatsApp' button — it opens a pre-filled message directly to us. We respond within 24 hours to discuss availability, location, and next steps.",
  },
  {
    q: "Is accommodation really included?",
    a: "Yes — accommodation is available through our agency partner. The cost is deducted from your pay at a regulated rate. This makes it easier to relocate without needing to find housing yourself.",
  },
  {
    q: "What does the work involve?",
    a: "Typical warehouse tasks include picking orders, packing products, sorting goods, and moving stock. The specific tasks depend on the location. No heavy lifting beyond standard warehouse work.",
  },
  {
    q: "Do I need warehouse experience?",
    a: "Experience helps but is not required. Many warehouse positions are entry-level and provide on-site training. Being physically fit and reliable matters more.",
  },
  {
    q: "What's the pay?",
    a: "Minimum wage or above, depending on the location and employer. Exact pay rates are confirmed during the application process. Overtime and shift allowances may apply.",
  },
  {
    q: "Do I need to speak Dutch?",
    a: "No. Basic English is enough for most warehouse positions. Many colleagues come from Poland, Romania, and other EU countries.",
  },
  {
    q: "What documents do I need?",
    a: "A valid EU passport or proof of right to work in the Netherlands is required. We'll confirm the full document list when you contact us.",
  },
];

export default function WarehousePage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",             url: "/" },
        { name: "Now Hiring",       url: "/apply" },
        { name: "Warehouse Worker", url: "/apply/warehouse" },
      ])) }} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-16">

        {/* ── Badge ─────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Now Hiring · Netherlands
        </div>

        {/* ── Title ─────────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Warehouse Worker<br />
          <span className="text-[#22C55E]">with Housing</span>
        </h1>
        <p className="text-gray-400 text-sm mb-2">Netherlands</p>
        <p className="text-[#22C55E] font-semibold text-sm mb-4 tracking-wide uppercase">
          Min. wage+ · Housing included · Immediate start
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={41} hoursAgo={3} />
          <ShareJobButton title="Warehouse Worker with Housing — Netherlands" />
        </div>

        {/* ── Quick highlights ──────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { icon: "🏠", label: "Housing incl." },
            { icon: "📦", label: "Warehouse" },
            { icon: "⚡", label: "Start ASAP" },
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
              Warehouse work in the Netherlands — picking, packing, sorting.<br />
              <span className="text-gray-300 font-normal">
                Steady hours, stable environment, housing arranged through us.
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
                "Min. wage+ — exact rate confirmed on application",
                "Accommodation available via agency partner",
                "Immediate start — no long waiting period",
                "Shift work — various shifts available",
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
                "Basic English — no Dutch needed",
                "Physically fit for warehouse tasks",
                "Reliable and punctual",
                "EU work authorisation required",
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-[#22C55E] font-bold text-base">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Housing note */}
          <div className="bg-purple-400/10 border border-purple-400/25 rounded-xl px-5 py-4 text-sm leading-relaxed">
            <p className="text-purple-300 font-semibold mb-1">🏠 Housing included</p>
            <p className="text-gray-300">
              Accommodation is arranged through our agency partner. The cost is deducted at a fixed regulated rate — no need to find housing yourself before you start.
            </p>
          </div>

        </div>

        {/* ── CTA (desktop only) ────────────────────────────────── */}
        <div className="hidden sm:block mt-12">
          <a
            href={`${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE} [src:warehouse]`)}`}
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
        <RelatedJobs currentId="warehouse" />

      </div>

      <StickyApplyBar waBase={WA_BASE} jobTitle={JOB_TITLE} source="warehouse" />

    </div>
  );
}
