// /apply/integralis-meat-processing-groenlo
// Meat Processing Worker — Groenlo, Netherlands (slaughterhouse)
// Via recruitment partner: Integralis
// Dark theme, green accents. Apply via WhatsApp.
// NOTE: Salary NOT specified by partner — do not invent figures.

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
  title: "Meat Processing Worker Groenlo — 15+ Departments | Integralis via AgencyCheck",
  description:
    "Meat Processing Worker vacancy in Groenlo, Netherlands via Integralis. 15+ departments available: slaughterhouse, deboning, vacuum packing, and more. Accommodation available €145–155 in Enschede. EU citizens. Salary details provided on application. Apply via WhatsApp.",
  keywords: [
    "meat processing worker groenlo netherlands",
    "slaughterhouse worker netherlands eu",
    "integralis meat vacature groenlo",
    "vleesverwerking vacature gelderland",
    "food production groenlo accommodation",
    "integralis vlees vacature",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/integralis-meat-processing-groenlo",
    languages: {
      "en":        "https://agencycheck.io/apply/integralis-meat-processing-groenlo",
      "x-default": "https://agencycheck.io/apply/integralis-meat-processing-groenlo",
    },
  },
  openGraph: {
    title: "Meat Processing Worker Groenlo — 15+ Departments | Integralis",
    description:
      "15+ departments: slaughterhouse, deboning, vacuum packing and more. Groenlo, Netherlands. Accommodation €145–155 in Enschede. Via Integralis. Apply via WhatsApp.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Meat Processing Worker — Integralis (Groenlo, NL)";
const JOB_ID    = "integralis-meat-processing-groenlo";
const SOURCE    = "integralis-meat-processing-groenlo";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Meat Processing Worker",
  description:    "Meat Processing Worker vacancy at a slaughterhouse and meat processing facility in Groenlo, Netherlands via recruitment partner Integralis. 15+ departments available including abattoir/slaughter, stunning, deboning, trimming, vacuum packing, labelling, cold storage, quality control, and more. Salary details provided on application. Accommodation available in Enschede for €145–155. EU citizenship or full EU work authorisation required.",
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
  { question: "How many departments are available?",       answer: "Over 15 different departments are available at the facility, covering all stages of meat processing from abattoir through to packing and cold storage." },
  { question: "What is the salary?",                       answer: "Salary details are provided directly on application. Ask about the exact rate and department when you apply via WhatsApp." },
  { question: "Is accommodation available?",               answer: "Yes. Private rooms are available in Enschede for €145–155. Sharing options are also available." },
  { question: "Can I choose my department?",               answer: "Department placement depends on your experience, availability, and the facility's current needs. You can express a preference when you apply." },
  { question: "Do I need prior meat processing experience?", answer: "Experience in some departments is required (e.g., deboning, slaughter) while other positions (e.g., packing, labelling) are suitable for beginners." },
  { question: "Do I need to speak Dutch?",                 answer: "Basic English or Dutch is sufficient. Many EU workers are employed at this facility." },
  { question: "What documents do I need?",                 answer: "A valid EU passport or ID card and legal eligibility to work in the Netherlands are required." },
  { question: "How quickly can I start?",                  answer: "Typically within 1–3 weeks once documents are verified. We respond within 24 hours of your WhatsApp message." },
]);

const FAQ_ITEMS = [
  { q: "How many departments are available?",         a: "Over 15 departments are open at the facility, covering every stage of meat processing from arrival and stunning through to final packing, labelling, and cold storage." },
  { q: "What is the salary?",                         a: "Salary details are not published online and are provided directly on application. The exact rate depends on the department and your experience. Ask when you apply via WhatsApp." },
  { q: "Is accommodation available?",                 a: "Yes. Private rooms are available in Enschede for €145–155. Sharing options are also available. Confirm availability when you apply." },
  { q: "Can I choose which department I work in?",    a: "You can express a preference when you apply. Final placement depends on your experience, the facility's current needs, and available openings in each department." },
  { q: "Do I need prior meat processing experience?", a: "It depends on the department. Some roles (e.g., deboning, abattoir) require experience; others (e.g., packing, labelling, cold storage) are suitable for motivated beginners." },
  { q: "Do I need to speak Dutch?",                   a: "Basic English or Dutch is sufficient. The facility employs a large number of EU workers and is accustomed to multilingual teams." },
  { q: "What EU documents do I need?",                a: "A valid EU passport or ID card and legal eligibility to work in the Netherlands are required. Non-EU applicants cannot be processed." },
  { q: "How quickly can I start?",                    a: "Typically within 1–3 weeks once your documents are verified. We respond within 24 hours of your WhatsApp message." },
];

// ─── Departments list ────────────────────────────────────────────────────────
const DEPARTMENTS = [
  { icon: "🐄", name: "Abattoir / Slaughter",       level: "Experience preferred" },
  { icon: "⚡", name: "Stunning",                    level: "Training provided" },
  { icon: "🔪", name: "Deboning",                   level: "Experience required" },
  { icon: "✂️", name: "Trimming",                   level: "Experience preferred" },
  { icon: "📦", name: "Vacuum Packing",              level: "Beginner friendly" },
  { icon: "🏷️", name: "Labelling",                  level: "Beginner friendly" },
  { icon: "❄️", name: "Cold Storage",               level: "Beginner friendly" },
  { icon: "🧪", name: "Quality Control",             level: "Experience preferred" },
  { icon: "🧹", name: "Cleaning / Sanitation",       level: "Beginner friendly" },
  { icon: "🚛", name: "Loading / Dispatch",          level: "Beginner friendly" },
  { icon: "🔬", name: "Grading & Sorting",           level: "Training provided" },
  { icon: "🥩", name: "Cut & Portion",               level: "Experience preferred" },
  { icon: "📋", name: "Administration / Weighing",   level: "Basic literacy req." },
  { icon: "🛠️", name: "Maintenance Support",        level: "Technical exp. req." },
  { icon: "🧊", name: "Freezer Operations",          level: "Beginner friendly" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IntegralisMeatProcessingGroenloPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                                      url: "/" },
        { name: "Now Hiring",                                url: "/apply" },
        { name: "Meat Processing Worker — Groenlo",          url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse inline-block" />
            Now Hiring · Groenlo, Netherlands
          </div>
          <span className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-rose-300">
            🥩 FOOD PRODUCTION
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            15+ Departments
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            🏠 Accommodation Available
          </span>
        </div>

        {/* ── HERO TITLE ─────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Meat Processing Worker
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Integralis · Slaughterhouse &amp; Meat Processing · Groenlo, Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-1">
          Full-time · 15+ departments · EU citizens · Via Integralis
        </p>
        <p className="text-gray-500 text-xs mb-5">
          Salary details provided on application · Accommodation available in Enschede
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={7} hoursAgo={5} />
          <ShareJobButton title="Meat Processing Worker — Integralis (Groenlo, NL)" />
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-4xl font-extrabold text-white leading-none">On application</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Salary depends on department and experience level. Full details are shared directly when you apply via WhatsApp.
          </p>
          <p className="text-gray-600 text-[11px] mt-3">Weekly payment · Legal employment contract · Dutch payroll</p>
        </div>

        {/* ── QUICK STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "🥩", label: "15+ departments" },
            { icon: "🏠", label: "Accommodation avail." },
            { icon: "🇪🇺", label: "EU citizens only" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── DEPARTMENTS LIST ───────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Available Departments (15+)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEPARTMENTS.map(({ icon, name, level }) => (
              <div key={name} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
                <span className="text-lg shrink-0">{icon}</span>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-[12px] leading-snug">{name}</p>
                  <p className="text-gray-500 text-[10px]">{level}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-[11px] mt-3">
            Department placement depends on your experience and available openings. Express your preference when you apply.
          </p>
        </div>

        {/* ── REQUIREMENTS ───────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Requirements
          </p>

          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wide mb-2">
            Hard Requirements — Mandatory (all departments)
          </p>
          <ul className="space-y-2.5 text-sm text-gray-300 mb-5">
            {[
              "EU documentation / legal eligibility to work in the Netherlands",
              "Ability to work in a cold and physically demanding environment",
              "Basic English or Dutch",
            ].map((text) => (
              <li key={text} className="flex items-center gap-2.5">
                <span className="text-amber-300 font-bold text-sm shrink-0">★</span>
                <span className="text-amber-100 font-semibold">{text}</span>
              </li>
            ))}
          </ul>

          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
            Advantages (department-dependent)
          </p>
          <ul className="space-y-2.5 text-sm text-gray-300">
            {[
              "Prior meat processing or food production experience",
              "Deboning or slaughter experience (for relevant departments)",
              "Driving licence (Category B)",
              "Food hygiene / HACCP awareness",
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
              { icon: "🥩", text: "15+ departments to choose from" },
              { icon: "🏠", text: "Accommodation €145–155 (Enschede)" },
              { icon: "📅", text: "Weekly payment" },
              { icon: "📋", text: "Legal Dutch contract" },
              { icon: "🇪🇺", text: "EU workers welcome" },
              { icon: "💶", text: "Salary discussed on application" },
              { icon: "🏭", text: "Established NL facility" },
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
            Tell us your preferred department.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs mx-auto">
            Send us a WhatsApp message with your experience and preferred department. We&apos;ll match you with Integralis within 24 hours.
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
