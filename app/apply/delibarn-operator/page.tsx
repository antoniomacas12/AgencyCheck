// /apply/delibarn-operator
// Operator (Day Shift) at DeliBarn — Borculo, NL
// Via recruitment partner: 4minutes

import type { Metadata } from "next";
import StickyApplyBar     from "@/components/StickyApplyBar";
import DesktopApplyButton from "@/components/DesktopApplyButton";
import ApplicantBadge     from "@/components/ApplicantBadge";
import RelatedJobs        from "@/components/RelatedJobs";
import JobAlertStrip      from "@/components/JobAlertStrip";
import JobFAQ             from "@/components/JobFAQ";
import ShareJobButton     from "@/components/ShareJobButton";
import { jobPostingSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

// ─── SEO ──────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title:       "DeliBarn Operator Jobs in the Netherlands | AgencyCheck",
  description: "Long-term Operator jobs at DeliBarn in Borculo. Day shift, accommodation available, €16.01 gross/hour, career growth opportunities and stable employment.",
  keywords:    "DeliBarn jobs, operator jobs Netherlands, food production jobs Netherlands, meat factory jobs, Borculo jobs, operator vacancy Netherlands, jobs with accommodation Netherlands, AgencyCheck",
  alternates: {
    canonical: "https://agencycheck.io/apply/delibarn-operator",
    languages: {
      "en":        "https://agencycheck.io/apply/delibarn-operator",
      "x-default": "https://agencycheck.io/apply/delibarn-operator",
    },
  },
  openGraph: {
    title:       "DeliBarn Operator (Day Shift) — €16.01/hr | Borculo, NL",
    description: "€16.01/hr gross, day shift only, accommodation in Goor. Long-term Operator role at DeliBarn meat production facility in Borculo. Via 4minutes — response within 24h.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Operator (Day Shift) at DeliBarn (Borculo, NL)";
const JOB_ID    = "delibarn-operator";
const SOURCE    = "delibarn-apply";

const JOB_SCHEMA = jobPostingSchema({
  title:       "Operator",
  description:
    "Operator (Day Shift) at DeliBarn meat production facility in Borculo, Netherlands. Work as an Operator in a modern food production environment specialising in meat products and charcuterie. Operate and monitor production lines, maintain production quality, solve small production issues, and work together with colleagues. Day shift only. Stable long-term employment with career growth opportunities. €16.01/hr gross. Accommodation available in Goor (approx. 20 minutes from facility). Own car preferred; mileage reimbursement provided. Via recruitment partner 4minutes. EU work authorisation required.",
  datePosted:     "2026-07-01",
  validThrough:   "2026-12-31",
  employmentType: "FULL_TIME",
  city:           "Borculo",
  region:         "Gelderland",
  country:        "NL",
  currency:       "EUR",
  minSalary:      16.01,
  maxSalary:      16.01,
  salaryUnit:     "HOUR",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "Do I need Operator experience?",    answer: "Previous production experience is required. Operator experience is strongly preferred. Experience leading or coordinating people on a production line is a major plus. Food production experience is preferred; meat industry experience is a major advantage but not mandatory." },
  { question: "Is accommodation available?",       answer: "Yes. 4minutes arranges housing in Goor — approximately 20 minutes from the DeliBarn facility in Borculo. Contact 4minutes for current availability and housing rates." },
  { question: "Do I need a car?",                  answer: "Own car is preferred. Mileage reimbursement is provided. If two suitable candidates with driving licences are matched, 4minutes may provide a company car." },
  { question: "What are the working hours?",       answer: "This is a day shift position. No nights, no rotating shifts. Stable daytime hours for a better work-life balance." },
  { question: "What salary will I earn?",          answer: "€16.01 gross per hour. Day shift — no night allowances. Full-time, 40 hours per week." },
  { question: "Do I need to speak Dutch?",         answer: "Good English is required. Dutch is not required. 4minutes and DeliBarn both communicate in English." },
  { question: "How quickly can I start?",          answer: "Typically within 1–2 weeks if your documents are ready. Send a WhatsApp message — 4minutes replies within 24 hours and handles housing, transport, paperwork and your start date all at once." },
  { question: "Is this a long-term position?",     answer: "Yes. This is a stable, long-term role with career growth opportunities. Not a temp placement — there are real prospects to grow within DeliBarn based on experience and performance." },
]);

const FAQ_ITEMS = [
  { q: "Do I need Operator experience?",    a: "Production experience required. Operator experience strongly preferred. Leading/coordinating a production line is a big plus. Food production preferred; meat industry a major advantage but not mandatory." },
  { q: "Is accommodation available?",       a: "Yes. 4minutes arranges housing in Goor (~20 min from Borculo). Contact for current rates and availability." },
  { q: "Do I need a car?",                  a: "Own car preferred. Mileage reimbursement provided. Possible company car if 2 licensed candidates are matched by 4minutes." },
  { q: "What are the working hours?",       a: "Day shift only. No nights. Stable daytime hours." },
  { q: "What salary will I earn?",          a: "€16.01 gross/hour. Full-time 40 hrs/week. Day shift — no night allowances." },
  { q: "Do I need to speak Dutch?",         a: "No. Good English is required. 4minutes and DeliBarn communicate in English." },
  { q: "How quickly can I start?",          a: "Within 1–2 weeks if documents are ready. WhatsApp → 4minutes replies within 24 hours and coordinates everything." },
  { q: "Is this a long-term position?",     a: "Yes. Stable long-term role with real career growth opportunities within DeliBarn." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DeliBarnOperatorPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                      url: "/" },
        { name: "Now Hiring",                url: "/apply" },
        { name: "Operator — DeliBarn",       url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ──────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
            Now Hiring · Borculo, NL
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/25 rounded-full px-3 py-1.5 text-[11px] font-bold text-amber-300">
            ☀️ Day Shift
          </span>
          <span className="inline-flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/25 rounded-full px-3 py-1.5 text-[11px] font-bold text-emerald-300">
            🏠 Housing available
          </span>
        </div>

        {/* ── HERO TITLE ──────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Operator
          <span className="block text-2xl sm:text-3xl font-bold text-[#22C55E] mt-1">Day Shift</span>
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          DeliBarn · Borculo, Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-5">
          Via recruitment partner:{" "}
          <span className="text-gray-200 font-semibold">4minutes</span>
          {" · "}Full-time · Long-term
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={14} hoursAgo={8} />
          <ShareJobButton title="Operator (Day Shift) at DeliBarn — Borculo, NL" />
        </div>

        {/* ── QUICK FACTS CARD ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { icon: "📍", label: "Borculo, NL" },
            { icon: "☀️", label: "Day shift" },
            { icon: "🏠", label: "Housing avail." },
            { icon: "📋", label: "Long-term" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* ── SALARY CARD ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>

          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-extrabold text-white leading-none">€16.01</span>
            <div className="mb-1">
              <p className="text-gray-400 text-sm leading-tight">/hr gross</p>
              <p className="text-gray-500 text-[11px]">base salary</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3">
              <div>
                <p className="text-white font-semibold text-sm">Day shift</p>
                <p className="text-gray-500 text-[11px]">Full-time · 40 hrs/week</p>
              </div>
              <div className="text-right">
                <p className="text-[#22C55E] font-extrabold text-base">
                  €16.01<span className="text-gray-500 font-normal text-xs">/hr</span>
                </p>
                <p className="text-gray-500 text-[11px]">No nights required</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── HOUSING CARD ────────────────────────────────────── */}
        <div className="rounded-2xl border border-purple-400/25 bg-purple-400/[0.05] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-300 mb-4">
            🏠 Housing — Arranged by 4minutes
          </p>

          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Located in Goor — approx. 20 min from Borculo",
              "Arranged by 4minutes before your start date",
              "Own car preferred — mileage reimbursement provided",
              "Possible company car if 2 licensed candidates are matched",
              "No upfront housing search — 4minutes handles it all",
              "Contact 4minutes for current housing rates and availability",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="text-purple-300 text-sm shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── WHY WORK AT DELIBARN ────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Why Work at DeliBarn
          </p>
          <div className="space-y-3">
            {[
              { icon: "💶", title: "Competitive salary",                 body: "€16.01/hr gross — a solid rate for a day-shift role. Full-time 40 hours per week with stable monthly earnings." },
              { icon: "☀️", title: "Day shift only",                     body: "No nights, no rotating shifts. Work normal daytime hours every day. Better for your health, your schedule, and your quality of life." },
              { icon: "📈", title: "Career growth opportunities",        body: "Real prospects to grow within DeliBarn. Experience leading or coordinating people on a production line is valued and opens doors." },
              { icon: "🥩", title: "Professional production environment", body: "Modern meat production facility with high European food safety standards. A well-run company that values precision and quality." },
              { icon: "📋", title: "Genuine long-term opportunity",      body: "Not a temp-to-forget placement. DeliBarn offers stable, long-term employment with a real path to grow based on performance." },
              { icon: "🚗", title: "Mileage reimbursement",             body: "Own car preferred and reimbursed. If two suitable licensed candidates are placed together, 4minutes may provide a company car." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm leading-snug mb-0.5">{title}</p>
                  <p className="text-gray-400 text-[12px] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── WHAT YOU WILL DO ────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            What You Will Do
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            As an Operator at DeliBarn you are responsible for keeping the meat production lines
            running efficiently and to the highest quality standards. You operate, monitor and
            maintain — ensuring that DeliBarn&apos;s products meet the company&apos;s standards on every shift.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Operate and monitor production lines",
              "Maintain production quality standards",
              "Solve small production issues on the spot",
              "Work together with production colleagues",
              "Follow food safety and hygiene protocols",
              "Report line performance and deviations",
              "Support continuous production flow",
              "Maintain a clean and safe workspace",
              "Follow shift supervisor instructions",
              "Contribute to long-term production targets",
            ].map((task) => (
              <div key={task} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
                <span className="text-[#22C55E] font-bold text-sm shrink-0">✓</span>
                <span className="text-gray-300 text-[13px]">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── REQUIREMENTS ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Requirements
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Good English — required",
              "Previous production experience — required",
              "Operator experience — strongly preferred",
              "Experience leading / coordinating a production line — big plus",
              "Food production experience — preferred",
              "Meat industry experience — major advantage (not mandatory)",
              "Able to work accurately and responsibly",
              "Motivated for long-term employment",
              "Own car preferred",
              "EU work authorisation required",
            ].map((req) => (
              <li key={req} className="flex items-center gap-2.5">
                <span className="text-[#22C55E] font-bold text-sm shrink-0">✓</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* ── BENEFITS STRIP ───────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Full Benefits Package
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "💶", text: "€16.01/hr gross salary" },
              { icon: "☀️", text: "Day shift only" },
              { icon: "📋", text: "Stable long-term contract" },
              { icon: "🏠", text: "Accommodation available" },
              { icon: "🚗", text: "Mileage reimbursement" },
              { icon: "🚙", text: "Possible company car" },
              { icon: "📈", text: "Career growth opportunities" },
              { icon: "🤝", text: "Friendly company culture" },
              { icon: "🥩", text: "Professional environment" },
              { icon: "🇳🇱", text: "Dutch legal employment" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                <span className="text-base shrink-0">{icon}</span>
                <span className="text-gray-300 text-[12px] font-medium leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── WHO IS THIS JOB PERFECT FOR ─────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Who Is This Job Perfect For
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Production operators",
              "Food industry workers",
              "Meat production workers",
              "Manufacturing workers",
              "Factory workers",
              "Workers needing housing",
              "Already in NL",
              "Relocating to NL",
            ].map((type) => (
              <div key={type} className="flex items-center gap-2 rounded-lg bg-emerald-400/[0.07] border border-emerald-400/20 px-3 py-2">
                <span className="text-[#22C55E] text-xs shrink-0">✓</span>
                <span className="text-emerald-100 text-[12px] font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── ABOUT DELIBARN ──────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            About DeliBarn
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            DeliBarn is a modern food production company based in Borculo, Netherlands,
            specialising in meat products and charcuterie. The facility operates to high
            European food safety standards in a professional, well-structured environment
            for production staff.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mt-2">
            As an Operator, you play a central role in the production process — your
            attention to quality and line performance directly determines the output
            that DeliBarn delivers to its customers. Long-term employment and career
            growth opportunities make this a genuine career option, not just a job.
          </p>
        </div>

        {/* ── ABOUT 4MINUTES ───────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            About 4minutes — Your Recruitment Partner
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            4minutes is a specialist recruiter placing workers in food production, logistics and
            warehouse roles across the Netherlands. From first WhatsApp message to first shift,
            they handle housing, transport, paperwork and onboarding so you can focus on the job.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Response within 24 hours of your WhatsApp message",
              "Housing arranged in Goor before you arrive in Borculo",
              "Mileage reimbursement and transport organised from day one",
              "Full document guidance — nothing gets missed",
              "No hidden fees — transparent from the very first conversation",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="text-[#22C55E] font-bold text-sm shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── APPLICATION CTA ──────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/[0.06] px-5 py-6 mb-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-2">
            Ready to apply?
          </p>
          <h2 className="text-white font-extrabold text-xl leading-snug mb-2">
            One message. Housing sorted. Job confirmed.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs mx-auto">
            Send a WhatsApp message and 4minutes gets back to you within 24 hours.
            Housing, transport, shift schedule and start date — all confirmed together.
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
            AgencyCheck · Real data. Real experiences.
          </p>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────── */}
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
