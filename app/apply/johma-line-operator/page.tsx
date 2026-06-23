// /apply/johma-line-operator
// Line Operator at Johma — Losser, NL
// Via recruitment partner: 4 Minutes

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
  title:
    "Line Operator at Johma — €16.01/hr + Housing | Losser, NL | AgencyCheck",
  description:
    "Line Operator vacancy at Johma in Losser, NL. €16.01/hr base + 35% night allowance (€21.61/hr). Housing from €136.74/week. Long-term contract via 4 Minutes. Apply in 60 seconds via WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/apply/johma-line-operator",
    languages: {
      "en":        "https://agencycheck.io/apply/johma-line-operator",
      "x-default": "https://agencycheck.io/apply/johma-line-operator",
    },
  },
  openGraph: {
    title:       "Line Operator at Johma — €16.01/hr | Losser, NL",
    description:
      "€16.01/hr base, 3-shift system, nights up to €21.61/hr. Housing from €136.74/week. Production line role at Johma, Losser. Via 4 Minutes — response within 24h.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Line Operator at Johma (Losser, NL)";
const JOB_ID    = "johma-line-operator";
const SOURCE    = "johma-line";

const JOB_SCHEMA = jobPostingSchema({
  title:       "Line Operator",
  description:
    "Line Operator at Johma food company in Losser, Netherlands. Responsible for monitoring and maintaining production lines, quality control, solving minor issues and supporting machine operation for Johma salad production. 3-shift system. Base salary €16.01/hr with up to 35% night shift allowance (€21.61/hr). Housing available from €136.74/week. Long-term contract, possibility of permanent employment. Via recruitment partner 4 Minutes. EU work authorisation required.",
  datePosted:     "2026-06-01",
  validThrough:   "2026-10-01",
  employmentType: "FULL_TIME",
  city:           "Losser",
  region:         "Overijssel",
  country:        "NL",
  currency:       "EUR",
  minSalary:      16.01,
  maxSalary:      21.61,
  salaryUnit:     "HOUR",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "Do I need production or line operator experience?", answer: "Experience in production, manufacturing or factory environments is helpful but not required. Johma trains you on the line. What matters is a technical mindset, attention to quality, and reliability. Problem-solving ability is a real plus in this role." },
  { question: "Is accommodation available?",                       answer: "Yes. 4 Minutes arranges housing near the Johma facility in Losser. Single rooms from €136.74/week including shared kitchen, bathroom and weekly cleaning of common areas. Max 4 bedrooms per house. €300 refundable deposit required." },
  { question: "Can couples apply together?",                       answer: "Yes. Couples can share a room at €103.94/week per person — better value than a single room. Mention this when you apply via WhatsApp and housing will be confirmed for both of you." },
  { question: "Do I need to speak Dutch?",                         answer: "No. Basic English is sufficient. 4 Minutes communicates with you in English throughout the whole process and Johma is an international workplace with many EU workers." },
  { question: "What are the shift hours?",                         answer: "3-shift system: morning 06:00–14:00, afternoon 14:00–22:00, night 22:00–06:00. Allowances start from 18:00. Your rotation schedule is confirmed when you start." },
  { question: "What salary can I earn?",                           answer: "Base salary is €16.01/hr gross. Evening allowance (18:00–00:00): +33% = €21.29/hr. Night allowance (00:00–06:00): +35% = €21.61/hr. Plus a 3% year-end bonus and €0.23/km travel allowance." },
  { question: "Is transportation available?",                      answer: "Yes. 4 Minutes arranges transport to and from Johma. You can also use a scooter, bicycle or car through 4 Minutes, with a €0.23/km travel allowance paid on top." },
  { question: "How quickly can I start?",                          answer: "Typically within 1–2 weeks if your documents are ready. Send a WhatsApp message — 4 Minutes replies within 24 hours and handles housing, transport, paperwork and your start date all at once." },
]);

const FAQ_ITEMS = [
  { q: "Do I need line operator experience?",    a: "Not required. A technical mindset and attention to quality are what count. Johma trains you on the production line." },
  { q: "Is accommodation available?",            a: "Yes. 4 Minutes arranges housing in Losser. Single rooms from €136.74/week (shared kitchen, bathroom, weekly cleaning). €300 refundable deposit. Max 4 bedrooms per house." },
  { q: "Can couples apply together?",            a: "Yes. Couples share a room at €103.94/week per person. Mention it in your WhatsApp message and housing is arranged for both." },
  { q: "Do I need to speak Dutch?",              a: "No. Basic English is enough. 4 Minutes and Johma both communicate in English." },
  { q: "What are the shift hours?",              a: "Morning 06:00–14:00 · Afternoon 14:00–22:00 · Night 22:00–06:00. Allowances apply from 18:00." },
  { q: "What salary can I earn?",                a: "€16.01/hr base. Evening +33% = €21.29/hr. Night +35% = €21.61/hr. Plus 3% year-end bonus + €0.23/km travel allowance." },
  { q: "Is transportation available?",           a: "Yes. Transport to Johma via 4 Minutes. Scooter, bike or car also available. €0.23/km allowance paid on top." },
  { q: "How quickly can I start?",               a: "Within 1–2 weeks if documents are ready. WhatsApp → 4 Minutes replies within 24 hours and coordinates everything." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function JohmaLineOperatorPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                       url: "/" },
        { name: "Now Hiring",                 url: "/apply" },
        { name: "Line Operator — Johma",      url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ──────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
            Now Hiring · Losser, NL
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/25 rounded-full px-3 py-1.5 text-[11px] font-bold text-amber-300">
            ⭐ Featured Vacancy
          </span>
          <span className="inline-flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/25 rounded-full px-3 py-1.5 text-[11px] font-bold text-emerald-300">
            🏠 Housing included
          </span>
        </div>

        {/* ── HERO TITLE ──────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Line Operator
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Johma · Losser, Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-5">
          Via recruitment partner:{" "}
          <span className="text-gray-200 font-semibold">4 Minutes</span>
          {" · "}Full-time · Long-term
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={22} hoursAgo={5} />
          <ShareJobButton title="Line Operator at Johma — Losser, NL" />
        </div>

        {/* ── QUICK FACTS CARD ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { icon: "📍", label: "Losser, NL" },
            { icon: "🔄", label: "3-shift system" },
            { icon: "🏠", label: "Housing avail." },
            { icon: "📋", label: "Long-term" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* ── SALARY & SHIFT ALLOWANCE CARD ───────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary & Shift Allowances
          </p>

          <div className="flex items-end gap-3 mb-5">
            <span className="text-5xl font-extrabold text-white leading-none">€16.01</span>
            <div className="mb-1">
              <p className="text-gray-400 text-sm leading-tight">/hr gross</p>
              <p className="text-gray-500 text-[11px]">base salary</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Shift Allowances
            </p>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3">
              <div>
                <p className="text-white font-semibold text-sm">Evening shift</p>
                <p className="text-gray-500 text-[11px]">18:00 – 00:00</p>
              </div>
              <div className="text-right">
                <p className="text-amber-300 font-extrabold text-base">
                  €21.29<span className="text-gray-500 font-normal text-xs">/hr</span>
                </p>
                <p className="text-amber-400/70 text-[11px] font-bold">+33%</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3">
              <div>
                <p className="text-white font-semibold text-sm">Night shift</p>
                <p className="text-gray-500 text-[11px]">00:00 – 06:00</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-300 font-extrabold text-base">
                  €21.61<span className="text-gray-500 font-normal text-xs">/hr</span>
                </p>
                <p className="text-emerald-400/70 text-[11px] font-bold">+35%</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-[11px] mt-3">
            + 3% end-of-year bonus · + €0.23/km travel allowance
          </p>
        </div>

        {/* ── SHIFT SCHEDULE CARD ─────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            ⏰ Shift Schedule
          </p>
          <div className="space-y-3">
            {[
              { name: "Morning",   hours: "06:00 – 14:00", color: "bg-blue-400",    rate: "€16.01/hr" },
              { name: "Afternoon", hours: "14:00 – 22:00", color: "bg-amber-400",   rate: "€16.01 – €21.29/hr" },
              { name: "Night",     hours: "22:00 – 06:00", color: "bg-emerald-400", rate: "€21.29 – €21.61/hr" },
            ].map((shift) => (
              <div key={shift.name} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3">
                <span className={`w-2.5 h-2.5 rounded-full ${shift.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{shift.name}</p>
                  <p className="text-gray-500 text-[11px]">{shift.hours}</p>
                </div>
                <p className="text-gray-300 text-[12px] font-semibold shrink-0">{shift.rate}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-[11px] mt-3 leading-snug">
            Allowances apply from 18:00. Night premium (+35%) from 00:00.
          </p>
        </div>

        {/* ── HOUSING CARD ────────────────────────────────────── */}
        <div className="rounded-2xl border border-purple-400/25 bg-purple-400/[0.05] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-300 mb-4">
            🏠 Housing — Arranged by 4 Minutes
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-center">
              <p className="text-white font-extrabold text-xl leading-none mb-0.5">€136.74</p>
              <p className="text-gray-500 text-[11px]">/week · Single room</p>
            </div>
            <div className="rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-center">
              <p className="text-white font-extrabold text-xl leading-none mb-0.5">€103.94</p>
              <p className="text-gray-500 text-[11px]">/week · Per person (couple)</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Single rooms available — couples can share",
              "Max 4 bedrooms per house",
              "Shared kitchen and bathroom",
              "Weekly cleaning of common areas",
              "€300 refundable deposit",
              "Deducted from payslip — no upfront rent search needed",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="text-purple-300 text-sm shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── WHY WORK AT JOHMA ───────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Why Work at Johma
          </p>
          <div className="space-y-3">
            {[
              { icon: "💶", title: "Salary above minimum wage",    body: "€16.01/hr base — well above the Dutch minimum. Night shifts bring you to €21.61/hr. The more shifts you work, the more you earn." },
              { icon: "⚙️", title: "Hands-on technical role",      body: "As a Line Operator, you're running the production line — not just following tasks. This is a role where your technical attention and problem-solving directly impact results." },
              { icon: "📋", title: "Genuine long-term opportunity", body: "Not a temp-to-forget placement. Johma offers stable, long-term work with a real path to a permanent contract through 4 Minutes based on performance." },
              { icon: "🥗", title: "Weekly Johma salad package",   body: "Every week, a Johma salad package to take home. A small perk that shows the company values the people on its production lines." },
              { icon: "🎁", title: "3% year-end bonus",            body: "December bonus of 3% of your total annual gross. Work hard, stay longer, get paid for it." },
              { icon: "🚐", title: "Transport & mobility sorted",  body: "4 Minutes organises your route to Johma. Scooter, bicycle or car also available through them, plus a €0.23/km travel allowance." },
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

        {/* ── LINE OPERATOR RESPONSIBILITIES ───────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            What You Will Do
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            As a Line Operator at Johma you are responsible for keeping the production line running
            efficiently and safely. You monitor, adjust and resolve — making sure the line that
            produces Johma&apos;s fresh salads never stops when it shouldn&apos;t.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Monitoring production lines for performance",
              "Quality control checks throughout the shift",
              "Solving minor production issues on the spot",
              "Supporting machine operation",
              "Following production procedures precisely",
              "Collaborating with technical teams",
              "Maintaining productivity targets",
              "Ensuring food safety standards at all times",
              "Keeping the workplace clean and organised",
              "Supporting continuous production flow",
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
              "Full-time availability (40 hrs/week)",
              "Willing to work all 3 shifts including nights",
              "Technical mindset — you understand how processes work",
              "Problem-solving ability — you act when something needs fixing",
              "Attention to quality and production targets",
              "Team player who communicates well with technical colleagues",
              "Responsibility and safety awareness in a food environment",
              "Long-term motivated — this is a career move, not a stopgap",
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
              { icon: "💶", text: "€16.01/hr base salary" },
              { icon: "🌙", text: "Up to €21.61/hr nights" },
              { icon: "🎁", text: "3% year-end bonus" },
              { icon: "🚗", text: "€0.23/km travel allowance" },
              { icon: "🏠", text: "Housing from €136.74/wk" },
              { icon: "🧹", text: "Weekly cleaning included" },
              { icon: "🥗", text: "Weekly salad package" },
              { icon: "🚐", text: "Transport to Johma" },
              { icon: "🛵", text: "Scooter / bike / car option" },
              { icon: "📋", text: "Permanent contract possible" },
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
              "Machine operators",
              "Food production workers",
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

        {/* ── ABOUT JOHMA ─────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            About Johma
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Johma is one of the Netherlands&apos; most established fresh food brands, based in
            Losser, Overijssel. Specialising in fresh salads, dips and ready-to-eat products,
            Johma supplies retailers across the Dutch market from modern, food-safe production
            facilities that operate to the highest European standards.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mt-2">
            As a Line Operator, you are essential to the Johma production floor. Your work keeping
            the line efficient and compliant directly determines whether Johma&apos;s products reach
            the market on time and at the quality the brand is known for. Johma offers a stable,
            well-run environment with long-term employment and structured development.
          </p>
        </div>

        {/* ── ABOUT 4 MINUTES ──────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            About 4 Minutes — Your Recruitment Partner
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            4 Minutes is a specialist recruiter placing workers in food production, logistics and
            warehouse roles across the Netherlands. From first WhatsApp message to first shift,
            they handle housing, transport, paperwork and onboarding so you can focus on the job.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Response within 24 hours of your WhatsApp message",
              "Housing arranged before you arrive in Losser",
              "Transport to Johma organised from day one",
              "Scooter, bicycle or car available through 4 Minutes",
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
            Send a WhatsApp message and 4 Minutes gets back to you within 24 hours.
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
