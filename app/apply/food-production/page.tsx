// /apply/food-production — Food Production Worker job posting
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
  title: "Food Production Worker – Cheese, Meat, Salads & Sauces | Netherlands | AgencyCheck",
  description: "Food production jobs in the Netherlands — cheese, meat, salads, sauces & more. €14.99/h gross starting wage. 3-shift work incl. nights. Accommodation paid. Apply via WhatsApp.",
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
const JOB_TITLE = "Food Production Worker – Cheese, Meat, Salads & Sauces (Netherlands)";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Food Production Worker – Cheese, Meat, Salads & Sauces",
  description:    "Food production and processing work in the Netherlands — cheese production (cutting, processing, packing), meat production and packing (salami and similar), salad production and mixing, sauces and dips production (e.g. hummus), and other food-production activities. Starting wage: €14.99/hour gross. 3-shift rotation including night shifts. Night shifts may carry a shift allowance — better earning potential. Work environment: cold production facility, approximately 0–10°C. Accommodation paid (shared/double rooms). Cannot choose specific department — placement depends on availability. Experience preferred but not required. No driving licence required. EU work authorisation required. Placed via established agency partners — fast onboarding, legal contracts. Start within 1 week.",
  datePosted:     "2026-09-18",
  validThrough:   "2026-12-31",
  employmentType: "FULL_TIME",
  city:           "Netherlands",
  region:         "Netherlands",
  country:        "NL",
  currency:       "EUR",
  minSalary:      14.99,
  maxSalary:      14.99,
  salaryUnit:     "HOUR",
  pageUrl:        "/apply/food-production",
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent("Hi, I want to apply for: Food Production Worker – Cheese, Meat, Salads & Sauces (Netherlands)")}`,
});

const FAQ_ITEMS = [
  {
    q: "How do I apply?",
    a: "Tap the 'Apply via WhatsApp' button — it opens a pre-filled message directly to us. We typically respond within 24 hours and guide you through the next steps.",
  },
  {
    q: "What types of food production work are available?",
    a: "Current openings include cheese production (cutting, processing, packaging), meat production and packing (salami and similar products), salad production and mixing, sauces and dips production (e.g. hummus), and general food packing. The specific assignment depends on availability at the time of your placement — you cannot request a specific department in advance.",
  },
  {
    q: "Can I choose which department I work in?",
    a: "No — placement is based on what is available at the time you start. You may be placed in cheese, meat, salads, sauces, or general food packing. If you have a strong preference, mention it when you apply and we will pass it on, but the final placement decision rests with the partner agency.",
  },
  {
    q: "What is the salary?",
    a: "The starting wage is €14.99 gross per hour. Night shift positions may carry an applicable shift allowance, which means better earning potential. The exact allowance is confirmed at the time of your specific placement — we do not publish a fixed premium that may not apply to every position.",
  },
  {
    q: "Is this 3-shift work? Are there night shifts?",
    a: "Yes. Work is organised in 3 shifts — day, afternoon, and night. All candidates should be willing and able to work night shifts. Flexibility with shifts is required. Candidates who are available for nights have access to positions with better earning potential through shift allowances.",
  },
  {
    q: "Is the work environment cold?",
    a: "Yes. Food production facilities operate in a chilled environment — typically 0–10°C depending on the department. You will need to wear appropriate cold-environment PPE (provided). Make sure you are comfortable working in cold conditions before applying.",
  },
  {
    q: "Is accommodation included?",
    a: "Yes — accommodation is paid and is typically in double or shared rooms arranged by the agency. The exact housing setup is confirmed when your placement is finalised. Standard deductions apply per Dutch SNF rules.",
  },
  {
    q: "Is previous experience required?",
    a: "Experience in food production is preferred but not required. If you are physically fit, reliable, and comfortable working in a cold, fast-paced production environment — including nights — we want to hear from you.",
  },
  {
    q: "Do I need a driving licence?",
    a: "No. A driving licence is not required for this position. The workplace is accessible without a car.",
  },
  {
    q: "Are there any extra benefits?",
    a: "Where applicable at specific placements: free breakfast when working the first shift, a product package on Thursdays, and a meal provided on Saturdays. These benefits apply at particular partner facilities and are confirmed when your placement is arranged — not all placements include all benefits.",
  },
  {
    q: "Do I need to speak Dutch?",
    a: "No. Basic English is sufficient for communication on the production floor and with us. Many workers placed through our partners don't speak Dutch.",
  },
  {
    q: "How quickly can I start?",
    a: "We target a start within 1 week if your documents are in order. Placement is handled through verified agency partners who move fast.",
  },
  {
    q: "What documents do I need?",
    a: "You will need a valid EU passport or work permit confirming your right to work in the Netherlands, and a BSN number (or ability to obtain one). We will walk you through the exact requirements when you apply.",
  },
];

export default function FoodProductionPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",       url: "/" },
        { name: "Now Hiring", url: "/apply" },
        { name: "Food Production Worker", url: "/apply/food-production" },
      ])) }} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-16">

        {/* ── Badge ─────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          Now Hiring · Netherlands
        </div>

        {/* ── Title ─────────────────────────────────────────────── */}
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Food Production Worker
        </h1>
        <p className="text-gray-400 text-base font-medium mb-1">
          Cheese · Meat · Salads · Sauces &amp; More
        </p>
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="text-[#22C55E] font-bold text-sm">€14.99/h gross</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-300 text-sm">3-shift incl. nights</span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-300 text-sm">Netherlands</span>
        </div>
        <p className="text-[#22C55E] font-semibold text-xs mb-6 tracking-wide uppercase">
          Fast placement · Via verified agency partners
        </p>

        {/* ── Cold Environment Warning ───────────────────────────── */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-5 py-4 mb-4">
          <p className="text-blue-300 font-black text-sm uppercase tracking-wider mb-1">
            🌡️ Cold working environment: 0–10°C
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Food production facilities operate in a chilled environment, typically{" "}
            <strong className="text-white">0–10°C</strong> depending on the department.
            Cold-environment PPE is provided. Make sure you are comfortable working in
            cold conditions before you apply.
          </p>
        </div>

        {/* ── Cheese Production Highlight ───────────────────────── */}
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-5 py-4 mb-6">
          <p className="text-amber-300 font-black text-sm uppercase tracking-wider mb-1">
            🧀 Now especially hiring: Cheese Production
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Urgent demand for <strong className="text-white">male candidates</strong> willing
            to work in cheese production — cutting, processing, and packaging — including{" "}
            <strong className="text-white">night shifts</strong>. Night-shift candidates
            have access to positions with{" "}
            <strong className="text-white">better earning potential</strong> through shift allowances.
          </p>
        </div>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={34} hoursAgo={1} />
          <ShareJobButton title="Food Production Worker — Netherlands" />
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
            <p className="text-white text-base font-medium mb-3">
              Food production &amp; processing in the Netherlands.<br />
              <span className="text-gray-300 font-normal">
                Placed via established agency partners — fast onboarding, legal contracts.
              </span>
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Available positions span a range of food production environments. The specific
              assignment depends on availability — you cannot request a department in advance:
            </p>
            <ul className="space-y-2">
              {[
                { icon: "🧀", label: "Cheese production", detail: "cutting, processing, and packing" },
                { icon: "🥩", label: "Meat production & packing", detail: "salami and similar products" },
                { icon: "🥗", label: "Salad production & mixing", detail: "fresh produce, portioning" },
                { icon: "🫙", label: "Sauces & dips production", detail: "hummus and similar products" },
                { icon: "📦", label: "General food packing", detail: "portioning, sealing, labelling" },
              ].map(({ icon, label, detail }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="text-base mt-0.5">{icon}</span>
                  <span>
                    <strong className="text-gray-200">{label}</strong>
                    <span className="text-gray-500"> — {detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Work Conditions */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              Work Conditions
            </p>
            <ul className="space-y-3">
              {[
                "3-shift rotation: day, afternoon, and night",
                "Night shifts available — better earning potential through shift allowances",
                "Cold environment: approximately 0–10°C (PPE provided)",
                "Fast-paced production line work",
                "40 hours per week, consistent schedule",
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#22C55E] font-bold text-base mt-0.5">✓</span>
                  <span>{item}</span>
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
                "Willing and able to work all 3 shifts, including nights",
                "Comfortable working in a cold production environment (0–10°C)",
                "Physically fit, able to stand and work on a production line",
                "Food production experience preferred — but not required",
                "No driving licence required",
                "Basic English or Dutch communication",
                "EU work authorisation required",
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#22C55E] font-bold text-base mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What's on Offer */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              What&apos;s on Offer
            </p>
            <ul className="space-y-3">
              {[
                "€14.99/h gross starting wage",
                "Night shift allowances — better earning potential on night shifts",
                "Accommodation paid — typically double or shared rooms",
                "Legal contract via verified agency",
                "Start within 1 week",
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#22C55E] font-bold text-base mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Extra Benefits (where applicable) */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              Extra Benefits <span className="normal-case font-normal text-gray-600">(at select placements)</span>
            </p>
            <p className="text-gray-500 text-xs mb-3">
              The following apply at specific partner facilities — confirmed when your placement is arranged.
            </p>
            <ul className="space-y-3">
              {[
                "Free breakfast when working the first shift",
                "Product package on Thursdays",
                "Meal provided on Saturdays",
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-amber-400 font-bold text-base mt-0.5">★</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Notice */}
          <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-gray-400 text-sm leading-relaxed space-y-2">
            <p>
              <strong className="text-gray-200">Department placement:</strong> You cannot choose
              which food production department you work in. Your assignment (cheese, meat, salads,
              sauces, or general packing) is determined by availability at the time you start.
            </p>
            <p>
              <strong className="text-gray-200">Accommodation:</strong> Paid by the agency —
              standard deductions apply per Dutch SNF rules. Housing is typically in
              double or shared rooms; exact details confirmed at placement.
            </p>
          </div>

        </div>

        {/* ── CTA (desktop only) ────────────────────────────────── */}
        <div className="hidden sm:block mt-12">
          <DesktopApplyButton
            waBase={WA_BASE}
            referralMode
            jobTitle={JOB_TITLE}
            source="food-production"
            jobId="food-production"
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
        <RelatedJobs currentId="food-production" />

      </div>

      <StickyApplyBar referralMode waBase={WA_BASE} jobTitle={JOB_TITLE} source="food-production" jobId="food-production" />

    </div>
  );
}
