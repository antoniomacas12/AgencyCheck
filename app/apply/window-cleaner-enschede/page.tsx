// /apply/window-cleaner-enschede
// Window Cleaner — Enschede, Netherlands
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
  title: "Window Cleaner — Enschede | €16.08–€18.44/hr | Netherlands | AgencyCheck",
  description:
    "Window cleaner vacancy in Enschede, Netherlands. €16.08–€18.44/hr gross. Full-time and part-time available. Window cleaning experience required. EU citizens. Via Integralis. Apply via WhatsApp.",
  keywords: [
    "window cleaner enschede netherlands",
    "glazenwasser vacature enschede",
    "window cleaning job netherlands",
    "integralis vacature enschede",
    "cleaning job netherlands eu",
    "window cleaner job overijssel",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/window-cleaner-enschede",
    languages: {
      "en":        "https://agencycheck.io/apply/window-cleaner-enschede",
      "x-default": "https://agencycheck.io/apply/window-cleaner-enschede",
    },
  },
  openGraph: {
    title: "Window Cleaner — Enschede | €16.08–€18.44/hr",
    description:
      "€16.08–€18.44/hr gross. Window cleaning experience required. Full-time or part-time. Enschede, Netherlands. EU citizens. Via Integralis. Apply via WhatsApp.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Window Cleaner (Enschede, NL)";
const JOB_ID    = "window-cleaner-enschede";
const SOURCE    = "integralis-window-cleaner-enschede";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Window Cleaner",
  description:    "Window cleaner vacancy in Enschede, Netherlands. Work at various customer locations cleaning windows and glass surfaces with professional equipment. €16.08–€18.44/hr gross. Full-time and part-time available. Window cleaning experience required. Physically fit and reliable. EU citizenship or full EU work authorisation required. Via recruitment partner Integralis.",
  datePosted:     "2026-09-03",
  validThrough:   "2026-12-31",
  employmentType: "FULL_TIME",
  city:           "Enschede",
  region:         "Overijssel",
  country:        "NL",
  currency:       "EUR",
  minSalary:      16.08,
  maxSalary:      18.44,
  salaryUnit:     "HOUR",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "Is window cleaning experience required?",       answer: "Yes. Window cleaning experience is a hard requirement for this vacancy. Applicants without it cannot be processed." },
  { question: "Is this full-time or part-time?",              answer: "Both full-time and part-time are available. Mention your preference when you apply via WhatsApp." },
  { question: "Do I need a driving licence?",                  answer: "A category B driving licence is an advantage but not a mandatory requirement for this position." },
  { question: "Do I need to speak Dutch?",                     answer: "Basic communication skills are helpful. English is sufficient — full Dutch fluency is not required." },
  { question: "What documents do I need?",                     answer: "A valid EU ID or passport and legal eligibility to work in the Netherlands are required. Non-EU applicants cannot be processed." },
  { question: "Where will I be working?",                      answer: "You will work at different customer locations in and around Enschede. The work is mobile — not based at a single fixed site." },
  { question: "How quickly can I start?",                      answer: "Typically within 1–2 weeks once your documents are verified. We respond within 24 hours of your WhatsApp message." },
  { question: "Is this a long-term position?",                 answer: "Yes. This is a stable role with ongoing demand for professional window cleaners in the Enschede area." },
]);

const FAQ_ITEMS = [
  { q: "Is window cleaning experience mandatory?",             a: "Yes. Window cleaning experience is a hard requirement — applicants without hands-on window cleaning experience cannot be processed for this vacancy. Mention your experience clearly when you apply." },
  { q: "Is this full-time or part-time?",                     a: "Both options are available. Full-time and part-time schedules are offered. State your preference in your WhatsApp message and we will match you to the right arrangement." },
  { q: "Do I need a driving licence?",                        a: "A category B driving licence is an advantage and may strengthen your application, but it is not a mandatory requirement. You can apply without one." },
  { q: "Do I need to speak Dutch?",                           a: "Basic communication is helpful for working at customer sites, but full Dutch fluency is not required. English is sufficient for most day-to-day interactions." },
  { q: "What EU documents do I need?",                        a: "A valid EU passport or ID card plus legal eligibility to work in the Netherlands. Non-EU applicants cannot be processed for this vacancy." },
  { q: "Where will I be working?",                            a: "You will work at various customer locations in Enschede and the surrounding area. The role involves travelling between sites — this is typical for professional window cleaning work." },
  { q: "What equipment will I use?",                          a: "Professional cleaning equipment is provided or specified by the employer. You are expected to use it correctly and safely following training." },
  { q: "How quickly can I start?",                            a: "Typically within 1–2 weeks once your documents are verified. We respond within 24 hours of receiving your WhatsApp message." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WindowCleanerEnschedePage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                         url: "/" },
        { name: "Now Hiring",                   url: "/apply" },
        { name: "Window Cleaner — Enschede",    url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
            Now Hiring · Enschede, Netherlands
          </div>
          <span className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-sky-300">
            🧹 CLEANING ROLE
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            🕐 Full-time / Part-time
          </span>
        </div>

        {/* ── HERO TITLE ─────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Window Cleaner
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Enschede, Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-1">
          Full-time or part-time · EU citizens · Via recruitment partner: Integralis
        </p>
        <p className="text-gray-500 text-xs mb-5">
          Experience required · Multiple customer locations
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={6} hoursAgo={7} />
          <ShareJobButton title="Window Cleaner — Enschede, Netherlands" />
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-extrabold text-white leading-none">€16.08</span>
            <span className="text-gray-400 text-sm mb-1">– €18.44/hr gross</span>
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Starting rate</p>
                <p className="text-gray-500 text-[11px]">Entry to the role</p>
              </div>
              <div className="text-right">
                <p className="text-[#22C55E] font-extrabold text-base">€16.08<span className="text-gray-500 font-normal text-xs">/hr</span></p>
                <p className="text-gray-500 text-[11px]">gross</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Top rate</p>
                <p className="text-gray-500 text-[11px]">Based on experience &amp; schedule</p>
              </div>
              <div className="text-right">
                <p className="text-amber-300 font-extrabold text-base">€18.44<span className="text-gray-500 font-normal text-xs">/hr</span></p>
                <p className="text-amber-400/70 text-[11px] font-bold">top rate</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-[11px] mt-3">Gross hourly rate · Legal employment contract · Dutch payroll</p>
        </div>

        {/* ── QUICK STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "🧹", label: "Professional cleaning" },
            { icon: "🕐", label: "FT or PT available" },
            { icon: "🇪🇺", label: "EU citizens only" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── WHAT YOU WILL DO ───────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Your Responsibilities
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Cleaning windows and glass surfaces at customer locations",
              "Working at different sites across Enschede and surroundings",
              "Using professional cleaning equipment correctly and safely",
              "Ensuring locations are clean and presentable after each visit",
              "Following client-specific checklists and quality standards",
              "Working independently and as part of a small team",
              "Communicating clearly with colleagues and supervisors",
              "Reporting any issues or damage observed on site",
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
              "Window cleaning experience (hands-on, professional)",
              "Physically fit — the role involves physical activity outdoors",
              "Reliable, motivated, and punctual",
              "Able to work both independently and in a team",
            ].map((text) => (
              <li key={text} className="flex items-center gap-2.5">
                <span className="text-amber-300 font-bold text-sm shrink-0">★</span>
                <span className="text-amber-100 font-semibold">{text}</span>
              </li>
            ))}
          </ul>

          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
            Advantage — Not Mandatory
          </p>
          <ul className="space-y-2.5 text-sm text-gray-300">
            {[
              "Category B driving licence",
            ].map((text) => (
              <li key={text} className="flex items-center gap-2.5">
                <span className="text-[#22C55E] font-bold text-sm shrink-0">✓</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <p className="text-amber-400/70 text-[11px] mt-4">★ Mandatory — required without exception.</p>
        </div>

        {/* ── WHY THIS ROLE ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Why Apply
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: "💶", title: "Competitive hourly rate",      body: "€16.08–€18.44/hr gross is a strong rate for cleaning work in the Netherlands — above many comparable roles in the sector." },
              { icon: "🕐", title: "Flexible schedule options",   body: "Both full-time and part-time arrangements are available. State your preference when you apply and we will find the right fit." },
              { icon: "📋", title: "Legal Dutch employment",       body: "Full employment contract, Dutch payroll, social insurance, and pension contributions. Everything by the book." },
              { icon: "📍", title: "Varied work locations",        body: "Work across multiple customer sites in Enschede. No two days are exactly the same — you are on the move and working with a variety of clients." },
              { icon: "🇪🇺", title: "EU citizens welcome",        body: "If you have the right to work in the Netherlands and have window cleaning experience, you can apply immediately." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3">
                <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm leading-snug mb-0.5">{title}</p>
                  <p className="text-gray-400 text-[12px] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BENEFITS STRIP ─────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Benefits
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "💶", text: "€16.08–€18.44/hr gross" },
              { icon: "🕐", text: "Full-time or part-time" },
              { icon: "📋", text: "Legal Dutch contract" },
              { icon: "📍", text: "Enschede area locations" },
              { icon: "🇪🇺", text: "EU workers welcome" },
              { icon: "🧹", text: "Professional equipment" },
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
            Tell us your window cleaning experience and work eligibility. We&apos;ll get back to you within 24 hours.
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
