// /apply/integralis-technical-north-netherlands
// Technical Workers — North Netherlands (Delamine & TCA) — URGENT Week 39 2026
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
  title: "⚡ URGENT: Flange Mechanics / Fitters North Netherlands €763 net/wk — Integralis via AgencyCheck",
  description:
    "URGENT: Flange Mechanics, Ironworkers, and Fitters needed in North Netherlands (Delamine & TCA). Week 39 2026. €763 net/week for 40 hours. Accommodation provided €50/week. Company car €25/week. VCA + WFPR preferred. Via Integralis. Apply immediately via WhatsApp.",
  keywords: [
    "flange mechanic netherlands urgent",
    "fitter vacature noord nederland",
    "ironworker netherlands delamine",
    "technical worker tca groningen",
    "vca wfpr vacature noord nederland",
    "integralis technician north netherlands",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/integralis-technical-north-netherlands",
    languages: {
      "en":        "https://agencycheck.io/apply/integralis-technical-north-netherlands",
      "x-default": "https://agencycheck.io/apply/integralis-technical-north-netherlands",
    },
  },
  openGraph: {
    title: "URGENT: Flange Mechanics / Fitters North Netherlands €763 net/wk | Integralis",
    description:
      "€763 net/week · 40h. Delamine & TCA, North Netherlands. Week 39 2026. Accommodation €50/wk · Car €25/wk. VCA+WFPR preferred. Via Integralis. Apply now.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Technical Worker (Flange Mechanic / Fitter / Ironworker) — Integralis (North Netherlands)";
const JOB_ID    = "integralis-technical-north-netherlands";
const SOURCE    = "integralis-technical-north-netherlands";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Technical Worker — Flange Mechanic / Ironworker / Fitter",
  description:    "URGENT: Technical workers needed at Delamine and TCA facilities in North Netherlands. Week 39 2026 (22–28 September 2026). Positions: Flange Mechanics, Ironworkers, Pipe Fitters. €763 net per week for 40 hours. Accommodation provided: €50/week deduction. Company car provided: €25/week deduction. VCA and WFPR certifications preferred. EU citizenship or full EU work authorisation required. Via recruitment partner Integralis.",
  datePosted:     "2026-09-10",
  validThrough:   "2026-12-31",
  employmentType: "TEMPORARY",
  city:           "Groningen",
  region:         "Groningen",
  country:        "NL",
  currency:       "EUR",
  minSalary:      763,
  maxSalary:      0,
  salaryUnit:     "WEEK",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "What roles are available?",           answer: "Flange Mechanics, Ironworkers, and Pipe Fitters. All three positions are open and urgent for Week 39 2026." },
  { question: "When is the start date?",             answer: "Week 39 2026 — the week of 22–28 September 2026. This is an urgent placement." },
  { question: "What is the pay?",                    answer: "€763 net per week for 40 hours. Accommodation is deducted at €50/week and the company car at €25/week." },
  { question: "Is accommodation provided?",          answer: "Yes. Accommodation is included at a deduction of €50 per week from your net pay." },
  { question: "Is a company car provided?",          answer: "Yes. A company car is provided at a deduction of €25 per week from your net pay." },
  { question: "Are VCA and WFPR required?",          answer: "VCA and WFPR are preferred. Candidates without them may still be considered — contact us to discuss your situation." },
  { question: "What clients are involved?",          answer: "Work is at Delamine and TCA facilities in North Netherlands (Groningen/Drenthe region)." },
  { question: "How do I apply quickly?",             answer: "Send a WhatsApp message immediately — this is an urgent vacancy. We respond within hours, not days." },
]);

const FAQ_ITEMS = [
  { q: "What roles are available?",           a: "Three positions are open: Flange Mechanics, Ironworkers, and Pipe Fitters. All are urgent and needed from Week 39 2026." },
  { q: "When does the work start?",           a: "Week 39 2026, which runs from Monday 22 September to Sunday 28 September 2026. This is an urgent start — apply as soon as possible." },
  { q: "What is the weekly pay?",             a: "€763 net per week for 40 hours of work. From this, €50/week is deducted for accommodation and €25/week for the company car, giving you a clear breakdown of your take-home." },
  { q: "Is accommodation provided?",          a: "Yes. Accommodation is arranged and deducted at €50 per week from your net pay. Ask about the exact location and setup when you apply." },
  { q: "Is a company car provided?",          a: "Yes. A company car is included for travel to the work sites. A deduction of €25 per week applies." },
  { q: "Are VCA and WFPR required?",          a: "VCA and WFPR are strongly preferred for work on industrial sites. If you do not have them, contact us — we can discuss whether your experience qualifies you to proceed." },
  { q: "Where exactly are the work sites?",   a: "Work is at Delamine and TCA industrial facilities in the North Netherlands — primarily in the Groningen/Drenthe region." },
  { q: "How do I apply quickly?",             a: "Send a WhatsApp message now — this is an urgent vacancy. We respond within hours. Delays could mean losing your spot." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IntegralisTechnicalNorthNetherlandsPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                                       url: "/" },
        { name: "Now Hiring",                                 url: "/apply" },
        { name: "Technical Workers — North Netherlands",      url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-full px-4 py-2 text-xs font-black tracking-wide text-red-300 uppercase">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse inline-block" />
            ⚡ URGENT · Week 39 · 2026
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-amber-300">
            🔧 TECHNICAL ROLES
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            🏠 Accommodation Incl.
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            🚗 Car Provided
          </span>
        </div>

        {/* ── URGENT BANNER ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-red-500/40 bg-red-500/[0.07] px-5 py-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl shrink-0">⚡</span>
            <div>
              <p className="text-red-300 font-extrabold text-base leading-snug">
                URGENT — Week 39 Start
              </p>
              <p className="text-gray-400 text-sm">
                Positions needed immediately at Delamine &amp; TCA · North Netherlands
              </p>
            </div>
          </div>
        </div>

        {/* ── HERO TITLE ─────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Technical Workers
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Flange Mechanics · Ironworkers · Pipe Fitters
        </p>
        <p className="text-[#22C55E] font-semibold text-sm mb-1 tracking-wide">
          Integralis · Delamine &amp; TCA · North Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-1">
          Full-time · Week 39 2026 · EU citizens · Via Integralis
        </p>
        <p className="text-gray-500 text-xs mb-5">
          VCA + WFPR preferred · Accommodation €50/wk · Company car €25/wk
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={12} hoursAgo={2} />
          <ShareJobButton title="Technical Workers — Integralis (North Netherlands)" />
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Weekly Pay — 40 Hours
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-extrabold text-white leading-none">€763</span>
            <span className="text-gray-400 text-sm mb-1">net/week (40h)</span>
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Weekly net pay</p>
                <p className="text-gray-500 text-[11px]">40 hours</p>
              </div>
              <div className="text-right">
                <p className="text-[#22C55E] font-extrabold text-base">€763<span className="text-gray-500 font-normal text-xs">/wk</span></p>
                <p className="text-gray-500 text-[11px]">net</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Accommodation deduction</p>
                <p className="text-gray-500 text-[11px]">Housing included</p>
              </div>
              <div className="text-right">
                <p className="text-amber-300 font-extrabold text-base">−€50<span className="text-gray-500 font-normal text-xs">/wk</span></p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Company car deduction</p>
                <p className="text-gray-500 text-[11px]">Car provided</p>
              </div>
              <div className="text-right">
                <p className="text-amber-300 font-extrabold text-base">−€25<span className="text-gray-500 font-normal text-xs">/wk</span></p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-[11px] mt-3">Net weekly pay before accommodation and car deductions · Transparent breakdown</p>
        </div>

        {/* ── QUICK STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "⚡", label: "Urgent — Week 39" },
            { icon: "🏠", label: "Accommodation incl." },
            { icon: "🚗", label: "Company car" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── OPEN POSITIONS ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 mb-4">
            🔧 Open Positions
          </p>
          <div className="space-y-2">
            {[
              { role: "Flange Mechanic", icon: "🔩" },
              { role: "Ironworker",      icon: "⚙️" },
              { role: "Pipe Fitter",     icon: "🔧" },
            ].map(({ role, icon }) => (
              <div key={role} className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
                <span className="text-xl shrink-0">{icon}</span>
                <p className="text-white font-bold text-sm">{role}</p>
                <span className="ml-auto text-red-400 text-[10px] font-black uppercase tracking-widest">URGENT</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-[11px] mt-3">All three positions are open. Apply for the role that matches your experience.</p>
        </div>

        {/* ── WORK SITES ─────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            📍 Work Sites
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-3 rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <span className="text-xl shrink-0">🏭</span>
              <div>
                <p className="text-white font-bold text-sm">Delamine</p>
                <p className="text-gray-400 text-xs">Chemical / industrial facility · North Netherlands</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-white/[0.04] border border-white/[0.07] px-4 py-3">
              <span className="text-xl shrink-0">🏭</span>
              <div>
                <p className="text-white font-bold text-sm">TCA</p>
                <p className="text-gray-400 text-xs">Industrial facility · North Netherlands</p>
              </div>
            </div>
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
              "Relevant trade experience (Flange Mechanic, Ironworker, or Fitter)",
              "Immediate availability — Week 39 2026 start",
            ].map((text) => (
              <li key={text} className="flex items-center gap-2.5">
                <span className="text-amber-300 font-bold text-sm shrink-0">★</span>
                <span className="text-amber-100 font-semibold">{text}</span>
              </li>
            ))}
          </ul>

          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
            Preferred — Strongly Recommended
          </p>
          <ul className="space-y-2.5 text-sm text-gray-300">
            {[
              "VCA certification (Basic or Full)",
              "WFPR certification",
              "Industrial plant / shutdown maintenance experience",
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
            Package
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "💶", text: "€763 net/week (40h)" },
              { icon: "🏠", text: "Accommodation included" },
              { icon: "🚗", text: "Company car included" },
              { icon: "⚡", text: "Urgent start — Week 39" },
              { icon: "🏭", text: "Delamine & TCA sites" },
              { icon: "📋", text: "Legal employment contract" },
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
        <div className="rounded-2xl border border-red-500/40 bg-red-500/[0.07] px-5 py-6 mb-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">
            ⚡ URGENT — Apply Now
          </p>
          <h2 className="text-white font-extrabold text-xl leading-snug mb-2">
            Week 39 start. Don&apos;t wait.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs mx-auto">
            Send a WhatsApp message now. We respond within hours for urgent placements.
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
