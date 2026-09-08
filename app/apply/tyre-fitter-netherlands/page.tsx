// /apply/tyre-fitter-netherlands
// Tyre Fitter — Option A, Netherlands
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
  title: "Tyre Fitter Jobs Netherlands | €19.00–€20.50/hr | Tyre Technician Vacancy | AgencyCheck",
  description:
    "Tyre Fitter vacancy in the Netherlands. €19.00–€20.50/hr gross. Single/private room accommodation €15/night. EU citizens. Category B licence required. English B1+. Actual tyre fitting experience mandatory. Apply via WhatsApp.",
  keywords: [
    "tyre fitter jobs netherlands",
    "tire fitter jobs netherlands",
    "tyre technician netherlands",
    "tyre mounting jobs netherlands",
    "automotive jobs netherlands",
    "tyre fitter netherlands accommodation",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/tyre-fitter-netherlands",
    languages: {
      "en":        "https://agencycheck.io/apply/tyre-fitter-netherlands",
      "x-default": "https://agencycheck.io/apply/tyre-fitter-netherlands",
    },
  },
  openGraph: {
    title: "Tyre Fitter — Netherlands | €19.00–€20.50/hr gross",
    description:
      "€19.00–€20.50/hr gross. Accommodation available (single/private room, €15/night). Netherlands. EU citizens. Tyre fitting experience mandatory. Category B licence + English B1+ required. Apply via WhatsApp.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Tyre Fitter — Netherlands";
const JOB_ID    = "tyre-fitter-netherlands";
const SOURCE    = "tyre-fitter-nl";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Tyre Fitter",
  description:    "Tyre Fitter vacancy in the Netherlands. Mounting and removing tyres, wheel balancing, tyre condition checks, and general tyre service duties. €19.00–€20.50/hr gross. Accommodation available at €15/night (single/private room). Full-time. English B1+ required. EU citizenship required. Valid Category B driving licence required. Actual previous tyre fitting experience is mandatory — generic automotive or mechanic experience alone is not sufficient. Via recruitment partner Option A.",
  datePosted:     "2026-09-01",
  validThrough:   "2026-12-31",
  employmentType: "FULL_TIME",
  city:           "Amsterdam",
  region:         "Noord-Holland",
  country:        "NL",
  currency:       "EUR",
  minSalary:      19.00,
  maxSalary:      20.50,
  salaryUnit:     "HOUR",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "Is tyre fitting experience mandatory?",         answer: "Yes — actual tyre fitting, tyre mounting, or tyre technician experience is mandatory. Generic automotive or mechanic experience alone is not sufficient. You must have hands-on tyre fitting experience to be considered." },
  { question: "Is accommodation available?",                   answer: "Yes. Accommodation is available via the recruitment partner — a single/private room at €15/night. Mention accommodation when you apply." },
  { question: "Is a Category B driving licence required?",     answer: "Yes. A valid Category B driving licence is mandatory for this role." },
  { question: "What level of English is required?",            answer: "English B1 or higher is required. It is the working language for communication on site." },
  { question: "What does a tyre fitter do in this role?",      answer: "Mounting and removing tyres, replacing tyres and wheels, wheel balancing, checking tyre condition, and general tyre service duties following safety and quality procedures." },
  { question: "Is this a long-term position?",                 answer: "Yes. This is a full-time, long-term position with career progression opportunities and a legal Dutch employment contract." },
  { question: "What EU documents do I need?",                  answer: "A valid EU passport or national ID card. EU citizenship or full EU work authorisation is required — non-EU applicants cannot be processed for this vacancy." },
  { question: "How is the salary structured?",                 answer: "€19.00–€20.50 per hour gross, paid under a legal Dutch employment contract with payroll, social insurance, and holiday allowance included." },
]);

const FAQ_ITEMS = [
  { q: "Is tyre fitting experience really mandatory?",         a: "Yes — without exception. You must have actual hands-on experience as a tyre fitter, tyre technician, or tyre mounting specialist. Generic automotive, garage, or mechanic experience alone is not sufficient and will not be accepted for this vacancy." },
  { q: "Is accommodation available?",                          a: "Yes. Accommodation is available via the recruitment partner — a single/private room at €15/night. Mention that you need accommodation when you apply via WhatsApp and we will confirm availability and details." },
  { q: "Is a Category B driving licence required?",            a: "Yes. A valid Category B driving licence is mandatory for this role. It is required to operate on site." },
  { q: "What level of English do I need?",                     a: "English B1 or higher is required. Communication with supervisors and colleagues is in English. Dutch is not required." },
  { q: "What exactly will I be doing as a tyre fitter?",       a: "Mounting and removing tyres, replacing tyres and wheels, wheel balancing, checking tyre condition and tread depth, and general tyre service duties. All work follows defined safety and quality procedures." },
  { q: "Is this a long-term position?",                        a: "Yes. This is a full-time, long-term role with career progression opportunities. The employment contract is legal under Dutch law." },
  { q: "What EU documents do I need?",                         a: "A valid EU passport or national ID card. EU citizenship or full EU work authorisation is mandatory — non-EU applicants cannot be processed for this vacancy." },
  { q: "How is the hourly rate paid and what is included?",    a: "€19.00–€20.50/hr gross under a legal Dutch employment contract. Dutch payroll, social insurance contributions, and holiday allowance are all included. Rate is gross before tax." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TyreFitterNetherlandsPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                                url: "/" },
        { name: "Now Hiring",                          url: "/apply" },
        { name: "Tyre Fitter — Netherlands",           url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse inline-block" />
            Now Hiring · Netherlands
          </div>
          <span className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-violet-300">
            🔧 TYRE TECHNICIAN ROLE
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            🏠 Housing Available
          </span>
        </div>

        {/* ── HERO TITLE ─────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Tyre Fitter
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Automotive · Tyre Technician · Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-5">
          Full-time · Long-term · Housing €15/night · EU citizens · Via Option A
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={9} hoursAgo={8} />
          <ShareJobButton title="Tyre Fitter Jobs Netherlands — €19.00–€20.50/hr" />
        </div>

        {/* ── IMPORTANT NOTICE ───────────────────────────────────── */}
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/[0.07] px-5 py-4 mb-6">
          <p className="text-amber-300 font-black text-[12px] uppercase tracking-widest mb-1">⚠ Experience Requirement</p>
          <p className="text-amber-100 text-sm leading-relaxed">
            <strong>Actual tyre fitting experience is mandatory.</strong> Generic automotive or mechanic experience alone is <strong>NOT sufficient</strong> — you must have hands-on experience as a tyre fitter, tyre technician, or tyre mounting specialist.
          </p>
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-extrabold text-white leading-none">€19.00</span>
            <span className="text-gray-400 text-sm mb-1">– €20.50/hr gross</span>
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Starting rate</p>
                <p className="text-gray-500 text-[11px]">Tyre fitter experience</p>
              </div>
              <div className="text-right">
                <p className="text-[#22C55E] font-extrabold text-base">€19.00<span className="text-gray-500 font-normal text-xs">/hr</span></p>
                <p className="text-gray-500 text-[11px]">gross</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Experienced rate</p>
                <p className="text-gray-500 text-[11px]">Senior tyre technician</p>
              </div>
              <div className="text-right">
                <p className="text-amber-300 font-extrabold text-base">€20.50<span className="text-gray-500 font-normal text-xs">/hr</span></p>
                <p className="text-amber-400/70 text-[11px] font-bold">top rate</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-[11px] mt-3">Gross hourly rate · Legal employment contract · Dutch payroll · Via recruitment partner Option A</p>
        </div>

        {/* ── QUICK STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "🔧", label: "Tyre Technician" },
            { icon: "🏠", label: "Housing €15/night" },
            { icon: "🇪🇺", label: "EU citizens only" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── ACCOMMODATION CARD ─────────────────────────────────── */}
        <div className="rounded-2xl border border-violet-400/25 bg-violet-400/[0.05] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-violet-300 mb-4">
            🏠 Accommodation — Available via Partner
          </p>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-xl bg-white/[0.05] border border-white/[0.08] px-8 py-4 text-center">
              <p className="text-white font-extrabold text-2xl leading-none mb-0.5">€15</p>
              <p className="text-gray-500 text-[11px]">/night · Single / private room</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Single/private room — not shared dormitory",
              "Arranged via recruitment partner (enquire on application)",
              "Mention accommodation need when you apply",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="text-violet-300 text-sm shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── WHAT YOU WILL DO ───────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Your Responsibilities
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Mounting and removing tyres",
              "Replacing tyres and wheels",
              "Wheel balancing",
              "Checking tyre condition and tread depth",
              "General tyre service duties",
              "Following safety and quality procedures",
              "Maintaining workstation and equipment",
              "Completing service work accurately and on time",
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
          <ul className="space-y-2.5 text-sm text-gray-300">
            {[
              { text: "EU citizenship or full EU work authorisation",                                          urgent: true },
              { text: "Valid Category B driving licence",                                                      urgent: true },
              { text: "English B1 or higher — working language on site",                                      urgent: true },
              { text: "Actual previous tyre fitting / tyre mounting / tyre technician experience",             urgent: true },
              { text: "Reliable, safety-conscious, and physically fit for the role",                           urgent: false },
            ].map(({ text, urgent }) => (
              <li key={text} className="flex items-center gap-2.5">
                <span className={`font-bold text-sm shrink-0 ${urgent ? "text-amber-300" : "text-[#22C55E]"}`}>
                  {urgent ? "★" : "✓"}
                </span>
                <span className={urgent ? "text-amber-100 font-semibold" : ""}>{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-amber-500/[0.07] border border-amber-500/25 px-4 py-3">
            <p className="text-amber-300 text-[12px] font-bold leading-snug">
              ★ All four starred requirements are mandatory without exception. Generic automotive or mechanic experience alone is NOT sufficient — actual tyre fitting experience is required.
            </p>
          </div>
        </div>

        {/* ── WHY THIS ROLE ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Why Apply
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: "💶", title: "Competitive gross hourly rate",     body: "€19.00–€20.50/hr gross is a strong rate for tyre technician work in the Netherlands. Full Dutch payroll with social insurance included." },
              { icon: "🏠", title: "Accommodation available",           body: "Single/private room at €15/night — arranged via the recruitment partner. No separate housing search needed when you relocate." },
              { icon: "📋", title: "Legal Dutch employment",            body: "Full employment contract, Dutch payroll, holiday allowance, and social insurance from day one. Everything by the book." },
              { icon: "🔧", title: "Specialist role — valued skill",    body: "Tyre fitters with real experience are in demand. This is a specialist technical role — your expertise is what makes you eligible." },
              { icon: "📈", title: "Long-term with career path",        body: "This is a long-term position, not seasonal. Strong performers have career progression opportunities within the automotive services company." },
              { icon: "🇳🇱", title: "Netherlands — stable market",     body: "Consistent demand for skilled tyre technicians across the Netherlands. Automotive services are a stable, year-round sector." },
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
            Full Benefits Package
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "💶", text: "€19.00–€20.50/hr gross" },
              { icon: "🏠", text: "Housing €15/night avail." },
              { icon: "📋", text: "Legal Dutch contract" },
              { icon: "🌍", text: "English-speaking team" },
              { icon: "🇪🇺", text: "EU workers welcome" },
              { icon: "📈", text: "Long-term + progression" },
              { icon: "🔧", text: "Netherlands" },
              { icon: "⚡", text: "Fast onboarding" },
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
            Tell us your tyre fitting experience, that you have a Category B licence and English B1+, and mention if you need accommodation. We respond within 24 hours.
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
            AgencyCheck · Real data. Real experiences. · EU citizens only. · Via Option A.
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
