// /apply/integralis-logistics-groenlo
// Logistics Employee — Groenlo, Netherlands
// Via recruitment partner: Integralis
// Dark theme, green accents. Apply via WhatsApp.

import type { Metadata } from "next";
import StickyApplyBar     from "@/components/StickyApplyBar";
import DesktopApplyButton from "@/components/DesktopApplyButton";
import ApplicantBadge     from "@/components/ApplicantBadge";
import RelatedJobs        from "@/components/RelatedJobs";
import JobAlertStrip      from "@/components/JobAlertStrip";
import JobFAQ             from "@/components/JobFAQ";
import ShareJobButton     from "@/components/ShareJobButton";
import { jobPostingSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

// ─── SEO ─────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Logistics Employee Groenlo — Accommodation Incl. | Integralis via AgencyCheck",
  description:
    "Logistics Employee vacancy in Groenlo, Netherlands via Integralis. Day shifts with flexible start times. Category B driving licence required. EPT can be learned. Accommodation available €145–155 in Enschede. EU citizens. Apply via WhatsApp.",
  keywords: [
    "logistics employee groenlo netherlands",
    "integralis vacature groenlo",
    "logistics worker netherlands accommodation",
    "warehouse groenlo eu workers",
    "logistics job overijssel gelderland",
    "integralis logistics vacature",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/integralis-logistics-groenlo",
    languages: {
      "en":        "https://agencycheck.io/apply/integralis-logistics-groenlo",
      "x-default": "https://agencycheck.io/apply/integralis-logistics-groenlo",
    },
  },
  openGraph: {
    title: "Logistics Employee Groenlo — Accommodation Incl. | Integralis",
    description:
      "Day shifts · Flexible start times. Category B licence required. EPT can be learned. Accommodation €145–155 in Enschede. Via Integralis. Apply via WhatsApp.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Logistics Employee — Integralis (Groenlo, NL)";
const JOB_ID    = "integralis-logistics-groenlo";
const SOURCE    = "integralis-logistics-groenlo";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Logistics Employee",
  description:    "Logistics Employee vacancy in Groenlo, Netherlands via recruitment partner Integralis. Day shifts with flexible start times between 06:00 and 10:00. Category B driving licence required. EPT (Electric Pallet Truck) operation can be learned on the job. Company car provided. Accommodation available in Enschede for €145–155. EU citizenship or full EU work authorisation required.",
  datePosted:     "2026-09-10",
  validThrough:   "2026-12-31",
  employmentType: "FULL_TIME",
  city:           "Groenlo",
  region:         "Gelderland",
  country:        "NL",
  currency:       "EUR",
  minSalary:      14.71,
  maxSalary:      0,
  salaryUnit:     "HOUR",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "Is a driving licence required?",    answer: "Yes. A valid Category B driving licence is required for this logistics position." },
  { question: "Do I need EPT experience?",         answer: "No. EPT (Electric Pallet Truck) operation can be learned on the job — previous experience is not required." },
  { question: "What are the working hours?",       answer: "The position runs day shifts with flexible start times. Specific shift times are provided on application." },
  { question: "Is accommodation available?",       answer: "Yes. Private rooms are available in Enschede for €145–155. Sharing options are also available." },
  { question: "Is a company car provided?",        answer: "Yes. A company car is provided for this role." },
  { question: "Do I need to speak Dutch?",         answer: "Basic Dutch or English is sufficient. Full Dutch fluency is not required." },
  { question: "What documents do I need?",         answer: "Valid EU ID or passport and legal eligibility to work in the Netherlands are required." },
  { question: "How quickly can I start?",          answer: "Typically within 1–3 weeks once your documents are verified. We respond within 24 hours of your WhatsApp message." },
]);

const FAQ_ITEMS = [
  { q: "Is a driving licence required?",    a: "Yes. A valid Category B driving licence is a mandatory requirement for this position." },
  { q: "Do I need EPT experience?",         a: "No prior EPT experience is needed. You will have the opportunity to learn EPT (Electric Pallet Truck) operation on the job. Training is provided." },
  { q: "What are the working hours?",       a: "The role operates on day shifts. Start times are flexible — full details of the schedule are provided when you apply." },
  { q: "Is accommodation available?",       a: "Yes. Private rooms are available in Enschede at €145–155. Sharing options are also available. Ask for details when you apply via WhatsApp." },
  { q: "Is a company car provided?",        a: "Yes. A company car is provided for travel to the work location in Groenlo." },
  { q: "Do I need to speak Dutch?",         a: "Basic Dutch or English is sufficient for this role. Full Dutch fluency is not required." },
  { q: "What EU documents do I need?",      a: "A valid EU passport or ID card is required, plus legal eligibility to work in the Netherlands. Non-EU applicants cannot be processed." },
  { q: "How quickly can I start?",          a: "Typically within 1–3 weeks once documents are verified. We respond within 24 hours of your WhatsApp message." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IntegralisLogisticsGroenloPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                                       url: "/" },
        { name: "Now Hiring",                                 url: "/apply" },
        { name: "Logistics Employee — Groenlo",               url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse inline-block" />
            Now Hiring · Groenlo, Netherlands
          </div>
          <span className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-sky-300">
            📦 LOGISTICS ROLE
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            🏠 Accommodation Available
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            🚗 Company Car Provided
          </span>
        </div>

        {/* ── HERO TITLE ─────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Logistics Employee
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Integralis · Groenlo, Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-1">
          Full-time · Day shifts · EU citizens · Via recruitment partner: Integralis
        </p>
        <p className="text-gray-500 text-xs mb-5">
          Company car provided · Accommodation available in Enschede
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={6} hoursAgo={3} />
          <ShareJobButton title="Logistics Employee — Integralis (Groenlo, NL)" />
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-4xl font-extrabold text-white leading-none">Competitive</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Salary details are provided directly on application. Ask about the exact rate when you apply via WhatsApp.
          </p>
          <p className="text-gray-600 text-[11px] mt-3">Weekly payment · Legal employment contract · Dutch payroll</p>
        </div>

        {/* ── QUICK STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "☀️", label: "Day shifts" },
            { icon: "🏠", label: "Accommodation avail." },
            { icon: "🚗", label: "Company car" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── SHIFT SCHEDULE ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.04] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-sky-300 mb-4">
            ⏰ Working Hours
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Shift type</p>
              <p className="text-sky-300 font-black text-sm">Day shifts</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Start times</p>
              <p className="text-sky-300 font-black text-sm">06:00–10:00 (flexible)</p>
            </div>
          </div>
          <p className="text-gray-500 text-[11px] mt-3">Exact start times are flexible — details provided on application.</p>
        </div>

        {/* ── WHAT YOU WILL DO ───────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Your Responsibilities
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Handling and transporting goods in the warehouse",
              "Operating an Electric Pallet Truck (EPT)",
              "Loading and unloading deliveries",
              "Organising and storing products correctly",
              "Picking and preparing orders for dispatch",
              "Maintaining a clean and organised warehouse",
              "Following safety and logistics procedures",
              "Reporting issues to the shift supervisor",
            ].map((task) => (
              <div key={task} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
                <span className="text-[#22C55E] font-bold text-sm shrink-0">✓</span>
                <span className="text-gray-300 text-[13px]">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── REQUIREMENTS ───────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Requirements
          </p>

          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wide mb-2">
            Hard Requirements — Mandatory
          </p>
          <ul className="space-y-2.5 text-sm text-gray-300 mb-5">
            {[
              "EU documentation / legal eligibility to work in the Netherlands",
              "Valid Category B driving licence",
              "Basic English or Dutch",
            ].map((text) => (
              <li key={text} className="flex items-center gap-2.5">
                <span className="text-amber-300 font-bold text-sm shrink-0">★</span>
                <span className="text-amber-100 font-semibold">{text}</span>
              </li>
            ))}
          </ul>

          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
            Advantages — Not Mandatory
          </p>
          <ul className="space-y-2.5 text-sm text-gray-300">
            {[
              "Prior warehouse or logistics experience",
              "EPT (Electric Pallet Truck) certificate — can be obtained on the job",
            ].map((text) => (
              <li key={text} className="flex items-center gap-2.5">
                <span className="text-[#22C55E] font-bold text-sm shrink-0">✓</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <p className="text-amber-400/70 text-[11px] mt-4">★ Mandatory — required without exception.</p>
        </div>

        {/* ── ACCOMMODATION ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-4">
            🏠 Accommodation — Enschede
          </p>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Private room</p>
              <p className="text-emerald-300 font-black text-sm">€145–155</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Sharing option</p>
              <p className="text-gray-400 text-sm">Available</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Transport to Groenlo</p>
              <p className="text-emerald-300 font-black text-sm">Company car provided</p>
            </div>
          </div>
          <p className="text-gray-500 text-[11px]">Accommodation is available but not guaranteed — confirm availability when you apply.</p>
        </div>

        {/* ── BENEFITS STRIP ─────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Benefits
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "🚗", text: "Company car provided" },
              { icon: "🏠", text: "Accommodation €145–155" },
              { icon: "☀️", text: "Day shifts only" },
              { icon: "📋", text: "Legal Dutch contract" },
              { icon: "🇪🇺", text: "EU workers welcome" },
              { icon: "📦", text: "EPT training available" },
              { icon: "💶", text: "Weekly payment" },
              { icon: "🤝", text: "Via Integralis partner" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                <span className="text-base shrink-0">{icon}</span>
                <span className="text-gray-300 text-[12px] font-medium leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── APPLICATION CTA ────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/[0.06] px-5 py-6 mb-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-2">
            Ready to apply?
          </p>
          <h2 className="text-white font-extrabold text-xl leading-snug mb-2">
            One message. That&apos;s all it takes.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs mx-auto">
            Send us a WhatsApp message. We&apos;ll confirm your details and connect you with Integralis within 24 hours.
          </p>
          <DesktopApplyButton
            waBase={WA_BASE}
            jobTitle={JOB_TITLE}
            source={SOURCE}
            jobId={JOB_ID}
            referralMode
          />
        </div>

        {/* ── JOB ALERT STRIP ────────────────────────────────────── */}
        <JobAlertStrip />

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <div className="mt-10">
          <JobFAQ items={FAQ_ITEMS} />
        </div>

        {/* ── RELATED JOBS ───────────────────────────────────────── */}
        <div className="mt-10">
          <RelatedJobs currentId={JOB_ID} />
        </div>

      </div>

      {/* ── STICKY APPLY BAR ───────────────────────────────────────── */}
      <StickyApplyBar
        waBase={WA_BASE}
        jobTitle={JOB_TITLE}
        source={SOURCE}
        jobId={JOB_ID}
        referralMode
      />
    </div>
  );
}
