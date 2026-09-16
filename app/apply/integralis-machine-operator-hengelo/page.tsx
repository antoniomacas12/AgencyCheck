// /apply/integralis-machine-operator-hengelo
// Machine Operator — Hengelo, Netherlands (salt production)
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
  title: "Machine Operator Hengelo €3,000–3,500/mo — Salt Production | Integralis via AgencyCheck",
  description:
    "Machine Operator vacancy at a salt production facility in Hengelo, Netherlands via Integralis. €3,000–3,500/month base + shift allowance (€3,630–4,235/month total). 3-shift schedule. Direct employment contract. VAPRO-A certification or willingness to obtain. Accommodation available €145–155. Apply via WhatsApp.",
  keywords: [
    "machine operator hengelo netherlands",
    "machinist vacature hengelo",
    "integralis machine operator",
    "salt production operator netherlands",
    "production operator 3 shift hengelo",
    "vapro vacature overijssel",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/integralis-machine-operator-hengelo",
    languages: {
      "en":        "https://agencycheck.io/apply/integralis-machine-operator-hengelo",
      "x-default": "https://agencycheck.io/apply/integralis-machine-operator-hengelo",
    },
  },
  openGraph: {
    title: "Machine Operator Hengelo €3,000–3,500/mo — Salt Production | Integralis",
    description:
      "€3,000–3,500/mo base · €3,630–4,235/mo incl. shift allowance. Salt production, Hengelo. 3-shift. Direct contract. VAPRO-A. Accommodation available. Via Integralis.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Machine Operator — Integralis (Hengelo, NL)";
const JOB_ID    = "integralis-machine-operator-hengelo";
const SOURCE    = "integralis-machine-operator-hengelo";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Machine Operator",
  description:    "Machine Operator vacancy at a salt production facility in Hengelo, Netherlands via recruitment partner Integralis. €3,000–3,500 gross/month base salary. With shift allowance: €3,630–4,235 gross/month. 3-shift rotating schedule. Direct employment contract (not via uitzendbureau). VAPRO-A certification required or willingness to obtain. Accommodation available in Enschede for €145–155. EU citizenship or full EU work authorisation required.",
  datePosted:     "2026-09-10",
  validThrough:   "2026-12-31",
  employmentType: "FULL_TIME",
  city:           "Hengelo",
  region:         "Overijssel",
  country:        "NL",
  currency:       "EUR",
  minSalary:      3000,
  maxSalary:      4235,
  salaryUnit:     "MONTH",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "Is VAPRO-A certification required?",     answer: "VAPRO-A is required or you must be willing to obtain it. The employer can arrange the training for motivated candidates." },
  { question: "What is the shift schedule?",            answer: "The role operates on a 3-shift rotating schedule covering morning, afternoon, and night shifts." },
  { question: "Is this a direct employment contract?",  answer: "Yes. This is a direct employment contract with the employer — not via a temporary staffing agency (uitzendbureau)." },
  { question: "What is the total salary with allowances?", answer: "The base salary is €3,000–3,500 gross/month. With the shift allowance included, the total rises to €3,630–4,235 gross/month." },
  { question: "Is accommodation available?",            answer: "Yes. Private rooms are available in Enschede for €145–155. Sharing options are also available." },
  { question: "Do I need to speak Dutch?",              answer: "Dutch or English is required. The level needed depends on the specific role — ask when you apply." },
  { question: "What is produced at this facility?",     answer: "The facility produces salt. It is a continuous production environment operating 24/7 across 3 shifts." },
  { question: "How quickly can I start?",               answer: "Typically within 2–4 weeks, depending on VAPRO-A status and document verification. We respond within 24 hours." },
]);

const FAQ_ITEMS = [
  { q: "Is VAPRO-A certification required?",         a: "VAPRO-A is required, but candidates who do not yet have it are welcome to apply if they are willing to obtain it. The employer can support training for motivated candidates." },
  { q: "What is the shift schedule?",                a: "The role operates on a 3-shift rotating schedule: morning, afternoon, and night shifts. You must be willing to work all three shift types." },
  { q: "Is this a direct employment contract?",      a: "Yes. This is a direct contract with the production facility — not via a uitzendbureau (temporary agency). This means more stability and direct benefits." },
  { q: "What is the total salary including allowances?", a: "The base salary is €3,000–3,500 gross per month. When the shift allowance is applied, the total rises to €3,630–4,235 gross per month." },
  { q: "Is accommodation available?",                a: "Yes. Private rooms are available in Enschede for €145–155. Sharing options are also available. Confirm availability when you apply via WhatsApp." },
  { q: "Do I need to speak Dutch?",                  a: "Dutch language skills are beneficial for this role, especially for safety documentation and shift communication. English may be sufficient depending on the team — ask when you apply." },
  { q: "What does the facility produce?",            a: "The facility is a salt production plant operating continuously, 24 hours a day, 7 days a week." },
  { q: "How quickly can I start?",                   a: "Start times are typically 2–4 weeks, depending on VAPRO-A status and document verification. We respond within 24 hours of your WhatsApp message." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IntegralisMachineOperatorHengeloPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                                    url: "/" },
        { name: "Now Hiring",                              url: "/apply" },
        { name: "Machine Operator — Hengelo",              url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
            Now Hiring · Hengelo, Netherlands
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-amber-300">
            🏭 MACHINE OPERATOR
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            📋 Direct Contract
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            🏠 Accommodation Available
          </span>
        </div>

        {/* ── HERO TITLE ─────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Machine Operator
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Integralis · Salt Production · Hengelo, Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-1">
          Full-time · 3-shift · Direct contract · EU citizens · Via Integralis
        </p>
        <p className="text-gray-500 text-xs mb-5">
          VAPRO-A required or willingness to obtain · Accommodation available in Enschede
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={9} hoursAgo={4} />
          <ShareJobButton title="Machine Operator — Integralis (Hengelo, NL)" />
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-4xl font-extrabold text-white leading-none">€3,000–3,500</span>
            <span className="text-gray-400 text-sm mb-1">base/month gross</span>
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Base salary</p>
                <p className="text-gray-500 text-[11px]">Monthly gross</p>
              </div>
              <div className="text-right">
                <p className="text-[#22C55E] font-extrabold text-base">€3,000–3,500<span className="text-gray-500 font-normal text-xs">/mo</span></p>
                <p className="text-gray-500 text-[11px]">gross</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Incl. shift allowance</p>
                <p className="text-gray-500 text-[11px]">3-shift premium</p>
              </div>
              <div className="text-right">
                <p className="text-amber-300 font-extrabold text-base">€3,630–4,235<span className="text-gray-500 font-normal text-xs">/mo</span></p>
                <p className="text-amber-400/70 text-[11px] font-bold">with allowance</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-[11px] mt-3">Gross monthly · Direct employment contract · Not via uitzendbureau</p>
        </div>

        {/* ── QUICK STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "🔄", label: "3-shift system" },
            { icon: "📋", label: "Direct contract" },
            { icon: "🇪🇺", label: "EU citizens only" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── SHIFT SCHEDULE ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 mb-4">
            ⏰ Shift Schedule — 3-Shift Rotating
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Morning shift</p>
              <p className="text-amber-300 font-black text-sm">06:00 – 14:00</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Afternoon shift</p>
              <p className="text-amber-300 font-black text-sm">14:00 – 22:00</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Night shift</p>
              <p className="text-amber-300 font-black text-sm">22:00 – 06:00</p>
            </div>
          </div>
          <p className="text-gray-500 text-[11px] mt-3">Rotating 3-shift schedule. The salt production facility operates 24/7.</p>
        </div>

        {/* ── CERTIFICATION ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-blue-400/20 bg-blue-400/[0.04] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-4">
            📜 VAPRO-A Certification
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            VAPRO-A is the Dutch basic process technology certification for operators in production environments. It is required for this role — or you must be willing and able to obtain it.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Have VAPRO-A</p>
              <p className="text-blue-300 font-black text-sm">✓ Preferred</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <p className="text-white font-semibold text-sm">Willing to obtain VAPRO-A</p>
              <p className="text-blue-300 font-black text-sm">✓ Accepted</p>
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
              "Operating production machinery and process installations",
              "Monitoring production parameters and quality",
              "Performing routine checks and readings",
              "Carrying out minor maintenance and adjustments",
              "Completing shift handover documentation",
              "Following safety procedures (VAPRO standards)",
              "Reporting deviations to the shift supervisor",
              "Participating in shift briefings",
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
              "VAPRO-A certification or willingness to obtain it",
              "Willingness to work 3-shift rotating schedule",
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
              "Prior machine operator or process operator experience",
              "Dutch language skills",
              "Driving licence (Category B)",
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
              { icon: "💶", text: "€3,000–3,500/mo base" },
              { icon: "⬆️",  text: "€3,630–4,235/mo with allowance" },
              { icon: "📋", text: "Direct employment contract" },
              { icon: "🔄", text: "3-shift schedule" },
              { icon: "🏠", text: "Accommodation €145–155" },
              { icon: "📜", text: "VAPRO-A training supported" },
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
