// /apply/production-worker-lupack-raalte
// Production Worker at Lupack (Zwanenberg Food Group) — Raalte, Netherlands
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
  title: "Production Worker – Lupack (Zwanenberg) | €15.24–€17.37/hr | Raalte, NL | AgencyCheck",
  description:
    "Production worker vacancy at Lupack (Zwanenberg Food Group) in Raalte, Netherlands. €15.24/hr base, €17.37/hr incl. 14% shift allowance. 2-shift schedule. Accommodation available. EU citizens. Apply via WhatsApp.",
  keywords: [
    "production worker raalte netherlands",
    "lupack vacature raalte",
    "zwanenberg food group vacature",
    "production worker netherlands accommodation",
    "integralis vacature",
    "food production worker raalte eu",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/production-worker-lupack-raalte",
    languages: {
      "en":        "https://agencycheck.io/apply/production-worker-lupack-raalte",
      "x-default": "https://agencycheck.io/apply/production-worker-lupack-raalte",
    },
  },
  openGraph: {
    title: "Production Worker – Lupack | €15.24–€17.37/hr | Raalte, NL",
    description:
      "€15.24/hr base · €17.37/hr incl. 14% shift allowance. Lupack (Zwanenberg Food Group), Raalte. 2-shift schedule. Accommodation available. EU citizens. Via Integralis. Apply via WhatsApp.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Production Worker – Lupack (Raalte, NL)";
const JOB_ID    = "production-worker-lupack-raalte";
const SOURCE    = "integralis-lupack-raalte";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Production Worker",
  description:    "Production worker vacancy at Lupack (part of Zwanenberg Food Group) in Raalte, Netherlands. Duties include quality checking, packing, labelling, cleaning, and general production activities. €15.24/hr base, €17.37/hr incl. 14% shift allowance. 2-shift schedule (06:00–14:00 and 14:00–22:00). Accommodation available. EU citizenship or full EU work authorisation required. English and/or Dutch knowledge required. Via recruitment partner Integralis.",
  datePosted:     "2026-09-03",
  validThrough:   "2026-12-31",
  employmentType: "FULL_TIME",
  city:           "Raalte",
  region:         "Overijssel",
  country:        "NL",
  currency:       "EUR",
  minSalary:      15.24,
  maxSalary:      17.37,
  salaryUnit:     "HOUR",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "Do I need prior production experience?",  answer: "Prior production experience is an advantage but not a hard requirement. The employer values reliability and a willingness to learn on the job." },
  { question: "Is accommodation available?",             answer: "Yes, accommodation is available for this position. Ask about the details and availability when you apply via WhatsApp." },
  { question: "What is the shift schedule?",             answer: "The role operates on a 2-shift system: 06:00–14:00 and 14:00–22:00. Flexibility between shifts is expected." },
  { question: "Do I need to speak Dutch?",               answer: "Knowledge of English and/or Dutch is required. Full Dutch fluency is not mandatory — English is sufficient for day-to-day work." },
  { question: "What documents do I need?",               answer: "Valid EU ID or passport and legal eligibility to work in the Netherlands are required. Non-EU applicants cannot be processed for this vacancy." },
  { question: "Is a driving licence required?",          answer: "A driving licence is an advantage but is not a hard requirement for this position." },
  { question: "How quickly can I start?",                answer: "Typically within 1–3 weeks if your documents are in order. We respond within 24 hours of your WhatsApp message." },
  { question: "Is this a long-term position?",           answer: "Yes. This is a full-time role at an established Dutch food production facility with a legal employment contract." },
]);

const FAQ_ITEMS = [
  { q: "Do I need prior production experience?",  a: "Prior production experience is an advantage but not a hard requirement. Reliability, a positive attitude, and willingness to follow instructions are what the employer values most." },
  { q: "Is accommodation available?",             a: "Yes, accommodation is available for this role. Reach out via WhatsApp when you apply and we will provide details and check availability for you." },
  { q: "What is the shift schedule?",             a: "The position runs on a 2-shift system: the morning shift is 06:00–14:00 and the afternoon shift is 14:00–22:00. You should be flexible to work both shifts." },
  { q: "Do I need to speak Dutch?",               a: "Knowledge of English and/or Dutch is required. You do not need to be fluent in Dutch — English is used on many international production teams in the Netherlands." },
  { q: "What EU documents do I need?",            a: "A valid EU passport or ID card is required, plus legal eligibility to work in the Netherlands. Non-EU applicants cannot be processed for this vacancy." },
  { q: "Is a driving licence required?",          a: "No. A driving licence (category B) is listed as an advantage that may make your application stronger, but it is not a mandatory requirement." },
  { q: "What does the 14% shift allowance mean?", a: "The base hourly rate is €15.24 gross. When the 14% shift allowance is applied — typically for afternoon or irregular shifts — the effective rate rises to €17.37/hr gross." },
  { q: "How quickly can I start?",                a: "Typically within 1–3 weeks once your documents are verified. We respond within 24 hours of receiving your WhatsApp message." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductionWorkerLupackRaaltePage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                                        url: "/" },
        { name: "Now Hiring",                                  url: "/apply" },
        { name: "Production Worker – Lupack, Raalte",          url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
            Now Hiring · Raalte, Netherlands
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-amber-300">
            🏭 PRODUCTION ROLE
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            🏠 Accommodation Available
          </span>
        </div>

        {/* ── HERO TITLE ─────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Production Worker
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Lupack (Zwanenberg Food Group) · Raalte, Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-1">
          Full-time · 2-shift system · EU citizens · Via recruitment partner: Integralis
        </p>
        <p className="text-gray-500 text-xs mb-5">
          Weekly payment · Accommodation available on request
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={8} hoursAgo={5} />
          <ShareJobButton title="Production Worker – Lupack (Raalte, NL)" />
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-extrabold text-white leading-none">€15.24</span>
            <span className="text-gray-400 text-sm mb-1">base/hr gross</span>
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Base rate</p>
                <p className="text-gray-500 text-[11px]">Standard hourly rate</p>
              </div>
              <div className="text-right">
                <p className="text-[#22C55E] font-extrabold text-base">€15.24<span className="text-gray-500 font-normal text-xs">/hr</span></p>
                <p className="text-gray-500 text-[11px]">gross</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Incl. 14% shift allowance</p>
                <p className="text-gray-500 text-[11px]">Afternoon / irregular shifts</p>
              </div>
              <div className="text-right">
                <p className="text-amber-300 font-extrabold text-base">€17.37<span className="text-gray-500 font-normal text-xs">/hr</span></p>
                <p className="text-amber-400/70 text-[11px] font-bold">with allowance</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-[11px] mt-3">Gross hourly rate · Weekly payment · Legal employment contract · Dutch payroll</p>
        </div>

        {/* ── QUICK STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "⏰", label: "2-shift schedule" },
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

        {/* ── SHIFT SCHEDULE ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 mb-4">
            ⏰ Shift Schedule — 2-Shift System
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
          </div>
          <p className="text-gray-500 text-[11px] mt-3">Flexibility to work both shifts is expected.</p>
        </div>

        {/* ── WHAT YOU WILL DO ───────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Your Responsibilities
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Checking product quality on the production line",
              "Packing products according to set standards",
              "Applying stickers and labels to boxes",
              "Cleaning the workplace after each shift",
              "General production activities as assigned",
              "Following HACCP hygiene and safety protocols",
              "Reporting quality issues to the shift supervisor",
              "Maintaining a clean and organised workstation",
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
              "Knowledge of English and/or Dutch",
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
              "Driving licence (category B)",
              "Previous production experience",
            ].map((text) => (
              <li key={text} className="flex items-center gap-2.5">
                <span className="text-[#22C55E] font-bold text-sm shrink-0">✓</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <p className="text-amber-400/70 text-[11px] mt-4">★ Mandatory — required without exception.</p>
        </div>

        {/* ── BENEFITS STRIP ─────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Benefits
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "💶", text: "€15.24/hr base gross" },
              { icon: "⬆️",  text: "€17.37/hr with 14% allowance" },
              { icon: "🏠", text: "Accommodation available" },
              { icon: "🚌", text: "Transportation available" },
              { icon: "📅", text: "Weekly payment" },
              { icon: "📋", text: "Legal Dutch contract" },
              { icon: "🇪🇺", text: "EU workers welcome" },
              { icon: "🏭", text: "Established food facility" },
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
            Tell us your work eligibility and language skills. We&apos;ll get back to you within 24 hours with next steps.
          </p>
          <div className="hidden sm:block">
            <DesktopApplyButton
              waBase={WA_BASE}
              referralMode
              jobTitle={JOB_TITLE}
              source={SOURCE}
              jobId={JOB_ID}
            />
          </div>
          <p className="text-gray-600 text-[11px] mt-3">
            AgencyCheck · Real data. Real experiences. · EU citizens only · Via Integralis
          </p>
        </div>

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <div className="border-t border-white/10 mt-2">
          <JobFAQ items={FAQ_ITEMS} />
        </div>

        <JobAlertStrip />
        <RelatedJobs currentId={JOB_ID} />

      </div>

      <StickyApplyBar
        referralMode
        waBase={WA_BASE}
        jobTitle={JOB_TITLE}
        source={SOURCE}
        jobId={JOB_ID}
      />
    </div>
  );
}
