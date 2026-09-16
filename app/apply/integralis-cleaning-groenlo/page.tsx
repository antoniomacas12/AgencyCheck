// /apply/integralis-cleaning-groenlo
// Cleaning Worker — Groenlo, Netherlands
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
  title: "Cleaning Worker Groenlo €14.71/hr — Company Car | Integralis via AgencyCheck",
  description:
    "Cleaning Worker vacancy in Groenlo, Netherlands via Integralis. €14.71/hr gross (Dutch WML 2026). Office and sanitary facility cleaning. Company car provided. Category B licence required. Accommodation available €145–155 in Enschede. EU citizens. Apply via WhatsApp.",
  keywords: [
    "cleaning worker groenlo netherlands",
    "integralis schoonmaker vacature groenlo",
    "cleaning job netherlands accommodation",
    "schoonmaak vacature gelderland",
    "cleaning worker 14.71 netherlands",
    "integralis cleaning vacature",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/integralis-cleaning-groenlo",
    languages: {
      "en":        "https://agencycheck.io/apply/integralis-cleaning-groenlo",
      "x-default": "https://agencycheck.io/apply/integralis-cleaning-groenlo",
    },
  },
  openGraph: {
    title: "Cleaning Worker Groenlo €14.71/hr — Company Car | Integralis",
    description:
      "€14.71/hr gross. Office and sanitary cleaning. Company car provided. Category B licence required. Accommodation €145–155 Enschede. Via Integralis. Apply via WhatsApp.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Cleaning Worker — Integralis (Groenlo, NL)";
const JOB_ID    = "integralis-cleaning-groenlo";
const SOURCE    = "integralis-cleaning-groenlo";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Cleaning Worker",
  description:    "Cleaning Worker vacancy in Groenlo, Netherlands via recruitment partner Integralis. €14.71 gross/hr (Dutch statutory minimum wage 2026). Scope is limited to office and sanitary facility cleaning — no industrial or food-production cleaning. Company car provided. Category B driving licence required. Accommodation available in Enschede for €145–155. EU citizenship or full EU work authorisation required.",
  datePosted:     "2026-09-10",
  validThrough:   "2026-12-31",
  employmentType: "FULL_TIME",
  city:           "Groenlo",
  region:         "Gelderland",
  country:        "NL",
  currency:       "EUR",
  minSalary:      14.71,
  maxSalary:      14.71,
  salaryUnit:     "HOUR",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "What exactly is cleaned in this role?",  answer: "This role covers office spaces and sanitary facilities only. Industrial or food-production cleaning is not part of this position." },
  { question: "Is a driving licence required?",         answer: "Yes. A valid Category B driving licence is mandatory. A company car is provided for travel to work." },
  { question: "Is accommodation available?",            answer: "Yes. Private rooms are available in Enschede for €145–155. Sharing options are also available." },
  { question: "What is the salary?",                    answer: "€14.71 gross per hour — the Dutch statutory minimum wage for 2026." },
  { question: "Do I need prior cleaning experience?",   answer: "Some cleaning experience is helpful but not always required. Reliability and attention to detail are key." },
  { question: "Do I need to speak Dutch?",              answer: "Basic Dutch or English is sufficient for this role." },
  { question: "What documents do I need?",              answer: "A valid EU passport or ID card and legal eligibility to work in the Netherlands are required." },
  { question: "How quickly can I start?",               answer: "Typically within 1–3 weeks once documents are verified. We respond within 24 hours of your WhatsApp message." },
]);

const FAQ_ITEMS = [
  { q: "What exactly is cleaned in this role?",  a: "This position covers office spaces and sanitary facilities (toilets, washrooms, etc.) only. Industrial cleaning, food production cleaning, or outdoor cleaning are not part of this job." },
  { q: "Is a driving licence required?",         a: "Yes. A valid Category B driving licence is mandatory. A company car is provided for travel to the work location in Groenlo." },
  { q: "Is accommodation available?",            a: "Yes. Private rooms are available in Enschede for €145–155. Sharing options are also available. Ask for details when you apply." },
  { q: "What is the salary?",                    a: "The salary is €14.71 gross per hour, which is the Dutch statutory minimum wage (WML) for 2026. Payment is weekly." },
  { q: "Do I need prior cleaning experience?",   a: "Prior cleaning experience is helpful and makes your application stronger, but is not always mandatory. We value reliability, attention to detail, and a positive attitude." },
  { q: "Do I need to speak Dutch?",              a: "Basic Dutch or English is sufficient. You do not need to be fully fluent in Dutch." },
  { q: "What EU documents do I need?",           a: "A valid EU passport or ID card and legal eligibility to work in the Netherlands are required. Non-EU applicants cannot be processed." },
  { q: "How quickly can I start?",               a: "Typically within 1–3 weeks once your documents are verified. We respond within 24 hours of your WhatsApp message." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IntegralisCleaningGroenloPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                            url: "/" },
        { name: "Now Hiring",                      url: "/apply" },
        { name: "Cleaning Worker — Groenlo",       url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse inline-block" />
            Now Hiring · Groenlo, Netherlands
          </div>
          <span className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-teal-300">
            🧹 CLEANING ROLE
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
          Cleaning Worker
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Integralis · Groenlo, Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-1">
          Full-time · Offices &amp; sanitary facilities · EU citizens · Via Integralis
        </p>
        <p className="text-gray-500 text-xs mb-5">
          Company car provided · Accommodation available in Enschede · Category B licence required
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={4} hoursAgo={6} />
          <ShareJobButton title="Cleaning Worker — Integralis (Groenlo, NL)" />
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-extrabold text-white leading-none">€14.71</span>
            <span className="text-gray-400 text-sm mb-1">per hour gross</span>
          </div>
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Hourly rate</p>
                <p className="text-gray-500 text-[11px]">Dutch WML 2026</p>
              </div>
              <div className="text-right">
                <p className="text-[#22C55E] font-extrabold text-base">€14.71<span className="text-gray-500 font-normal text-xs">/hr</span></p>
                <p className="text-gray-500 text-[11px]">gross</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-[11px] mt-3">Gross hourly rate · Weekly payment · Legal employment contract · Dutch payroll</p>
        </div>

        {/* ── QUICK STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "🧹", label: "Offices & sanitary" },
            { icon: "🚗", label: "Company car" },
            { icon: "🇪🇺", label: "EU citizens only" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── SCOPE OF WORK ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-teal-400/20 bg-teal-400/[0.04] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-teal-300 mb-4">
            🧹 Scope of Cleaning Work
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Offices</p>
              <p className="text-teal-300 font-black text-sm">✓ Included</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Sanitary facilities</p>
              <p className="text-teal-300 font-black text-sm">✓ Included</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Industrial / food production</p>
              <p className="text-gray-500 text-sm">✗ Not included</p>
            </div>
          </div>
        </div>

        {/* ── WHAT YOU WILL DO ───────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Your Responsibilities
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Cleaning office spaces and workstations",
              "Maintaining sanitary facilities (toilets, washrooms)",
              "Emptying bins and replacing bin liners",
              "Vacuuming, mopping, and dusting surfaces",
              "Restocking soap, paper towels, and supplies",
              "Reporting maintenance issues to the supervisor",
              "Following cleaning schedules and checklists",
              "Using cleaning products safely and correctly",
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
              "Prior cleaning or facilities experience",
              "Reliability and attention to detail",
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
              { icon: "💶", text: "€14.71/hr gross (WML 2026)" },
              { icon: "🚗", text: "Company car provided" },
              { icon: "🏠", text: "Accommodation €145–155" },
              { icon: "🧹", text: "Offices & sanitary only" },
              { icon: "📅", text: "Weekly payment" },
              { icon: "📋", text: "Legal Dutch contract" },
              { icon: "🇪🇺", text: "EU workers welcome" },
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
