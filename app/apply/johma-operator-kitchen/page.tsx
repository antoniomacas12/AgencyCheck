// /apply/johma-operator-kitchen
// Operator Kitchen at Johma — Losser, NL
// Via recruitment partner: 4 Minutes
// Dark theme, green accents. Premium job page. Apply via WhatsApp.

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
    "Operator Kitchen at Johma — €16.01/hr + Housing | Losser, NL | AgencyCheck",
  description:
    "Kitchen operator job at Johma in Losser, NL. €16.01/hr base + 35% night allowance (€21.61/hr). Housing from €136.74/week. Long-term, via 4 Minutes. Apply in 60 seconds via WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/apply/johma-operator-kitchen",
    languages: {
      "en":        "https://agencycheck.io/apply/johma-operator-kitchen",
      "x-default": "https://agencycheck.io/apply/johma-operator-kitchen",
    },
  },
  openGraph: {
    title:       "Operator Kitchen at Johma — €16.01/hr | Losser, NL",
    description:
      "€16.01/hr base, 3-shift system, night shifts up to €21.61/hr. Housing from €136.74/week. Hot kitchen production at Johma, Losser. Via 4 Minutes — response within 24h.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Operator Kitchen at Johma (Losser, NL)";
const JOB_ID    = "johma-operator-kitchen";
const SOURCE    = "johma-kitchen";

const JOB_SCHEMA = jobPostingSchema({
  title:       "Operator Kitchen",
  description:
    "Kitchen operator at Johma food company in Losser, Netherlands. Preparing raw materials (blanching vegetables, cooking pasta, soaking products) for Johma salad production. 3-shift system. Base salary €16.01/hr with up to 35% night shift allowance. Housing available from €136.74/week. Long-term contract, possibility of permanent employment. Via recruitment partner 4 Minutes. EU work authorisation required.",
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
  { question: "Is accommodation available?",         answer: "Yes. 4 Minutes provides housing near the Johma site. Single rooms start at €136.74/week with shared kitchen and bathroom. Max 4 bedrooms per house. Weekly cleaning of shared spaces is included. A €300 refundable deposit is required." },
  { question: "Can couples apply together?",         answer: "Yes. Couples can share a room. The rate for couples is €103.94/week per person — saving compared to a single room. Mention this when you apply and accommodation will be arranged accordingly." },
  { question: "Do I need to speak Dutch?",           answer: "No. Basic English is sufficient. Johma is an international working environment and 4 Minutes communicates with you in English throughout the recruitment process." },
  { question: "Do I need kitchen or food experience?", answer: "Prior kitchen or food production experience is a plus but not required. Johma provides on-the-job training. What matters most is reliability, attention to hygiene, and long-term motivation." },
  { question: "What is the salary?",                 answer: "Base salary is €16.01/hr gross. Evening shifts (18:00–00:00) carry a 33% allowance bringing the rate to €21.29/hr. Night shifts (00:00–06:00) carry a 35% allowance — €21.61/hr. A 3% year-end bonus and €0.23/km travel allowance are also paid." },
  { question: "What are the shift hours?",           answer: "Johma operates a 3-shift system: morning (06:00–14:00), afternoon (14:00–22:00), and night (22:00–06:00). Allowances apply from 18:00 onwards. Your shift pattern will be confirmed at the start." },
  { question: "Is transport available?",             answer: "Yes. 4 Minutes offers transport options to and from the Johma site. You also have the option to use a scooter, bicycle or car arranged through 4 Minutes. A travel allowance of €0.23/km is paid on top." },
  { question: "How fast can I start?",               answer: "Typically within 1–2 weeks if your documents are in order. 4 Minutes responds within 24 hours of your WhatsApp message and handles all onboarding steps quickly." },
]);

const FAQ_ITEMS = [
  { q: "Is accommodation available?",          a: "Yes. 4 Minutes arranges housing near the Johma site in Losser. Single rooms from €136.74/week (shared kitchen, bathroom, weekly cleaning). Max 4 bedrooms per house. €300 refundable deposit required." },
  { q: "Can couples apply together?",          a: "Yes — couples can share a room at €103.94/week per person. Mention it in your WhatsApp message and accommodation will be arranged for both of you." },
  { q: "Do I need to speak Dutch?",            a: "No. Basic English is enough. 4 Minutes communicates with you in English and many colleagues at Johma are from EU countries." },
  { q: "Do I need kitchen or food experience?", a: "Experience helps but is not required. Johma trains you on the job. Reliability, hygiene awareness and long-term commitment matter most." },
  { q: "What is the salary?",                  a: "€16.01/hr base. Evening shifts (18:00–00:00) = €21.29/hr (+33%). Night shifts (00:00–06:00) = €21.61/hr (+35%). Plus 3% year-end bonus and €0.23/km travel allowance." },
  { q: "What are the shift hours?",            a: "3-shift system: morning 06:00–14:00, afternoon 14:00–22:00, night 22:00–06:00. Night shift allowances kick in from 18:00." },
  { q: "Is transport available?",              a: "Yes. 4 Minutes provides transport to/from Johma. You can also use a scooter, bicycle or car arranged through them, plus a €0.23/km travel allowance is paid." },
  { q: "How fast can I start?",               a: "Within 1–2 weeks if your documents are ready. Apply via WhatsApp — 4 Minutes replies within 24 hours and moves fast." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function JohmaOperatorKitchenPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                        url: "/" },
        { name: "Now Hiring",                  url: "/apply" },
        { name: "Operator Kitchen — Johma",    url: `/apply/${JOB_ID}` },
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
          Operator Kitchen
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
          <ApplicantBadge count={24} hoursAgo={4} />
          <ShareJobButton title="Operator Kitchen at Johma — Losser, NL" />
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

          {/* Base */}
          <div className="flex items-end gap-3 mb-5">
            <span className="text-5xl font-extrabold text-white leading-none">€16.01</span>
            <div className="mb-1">
              <p className="text-gray-400 text-sm leading-tight">/hr gross</p>
              <p className="text-gray-500 text-[11px]">base salary</p>
            </div>
          </div>

          {/* Allowances */}
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
              "Weekly cleaning of shared spaces",
              "€300 refundable deposit",
              "Deducted from payslip — no upfront rent search",
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
              { icon: "💶", title: "Salary above minimum wage",  body: "€16.01/hr base — well above Dutch minimum wage. Night shifts bring you to €21.61/hr. That's real earning power." },
              { icon: "📋", title: "Long-term stability",        body: "This is not a short-term contract. Johma offers long-term work with the possibility of a permanent contract through 4 Minutes based on your performance." },
              { icon: "🥗", title: "Free salads every Thursday", body: "A unique perk — every Thursday you can take home fresh Johma salads. A small detail that shows Johma values its workers." },
              { icon: "🤝", title: "Trusted recruitment partner", body: "4 Minutes handles everything: housing, transport, documents, onboarding. You arrive, you work. No hidden surprises." },
              { icon: "🎁", title: "3% year-end bonus",          body: "Each December, you receive 3% of your total annual gross. The longer you stay, the more valuable this becomes." },
              { icon: "🚐", title: "Transport & mobility options", body: "4 Minutes offers transport to Johma, plus the option to use a scooter, bicycle or car arranged through them. A €0.23/km allowance is paid on top." },
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

        {/* ── WHAT YOU WILL DO ─────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            What You Will Do
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Behind every fresh Johma salad is a team preparing the ingredients correctly before
            production starts. As an Operator Kitchen, you work in the <strong className="text-white">hot kitchen</strong> —
            preparing raw materials so that the production line runs smoothly and on schedule.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Blanching vegetables",
              "Cooking pasta",
              "Soaking products",
              "Preparing raw materials to recipe specifications",
              "Checking products and processes",
              "Following hygiene and safety regulations",
              "Wearing required personal protective equipment",
              "Keeping the work environment clean and organised",
              "Supporting smooth production flow",
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
              "Accurate, detail-oriented working style",
              "Attention to hygiene and quality — this is a food environment",
              "Team player with a responsible attitude",
              "Long-term motivated — this is not a short-term placement",
              "Physically able to work in a hot kitchen / production environment",
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
              { icon: "🧹", text: "Weekly space cleaning" },
              { icon: "🥗", text: "Free salads every Thursday" },
              { icon: "🛵", text: "Scooter / bike / car option" },
              { icon: "🚐", text: "Transport to Johma" },
              { icon: "📋", text: "Permanent contract possible" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                <span className="text-base shrink-0">{icon}</span>
                <span className="text-gray-300 text-[12px] font-medium leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── WHO THIS JOB IS BEST FOR ─────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Who This Job Is Best For
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Food production workers",
              "Kitchen workers",
              "Production operators",
              "Factory workers",
              "Hygiene/safety experienced",
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
            Johma is one of the Netherlands&apos; most recognised fresh salad producers, based in
            Losser, Overijssel. The company produces a wide range of fresh salads, dips and
            ready-to-eat products sold across the Dutch market. Johma operates modern, hygienic
            production facilities and holds high standards for food safety and quality.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mt-2">
            As an Operator Kitchen at Johma, you are an essential part of the production process —
            the work you do in the kitchen directly determines the quality of every salad that
            leaves the factory. Johma is a stable employer with structured processes, a professional
            team environment, and genuine long-term career opportunities.
          </p>
        </div>

        {/* ── ABOUT 4 MINUTES ──────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            About 4 Minutes — Your Recruitment Partner
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            4 Minutes is a specialist recruiter placing workers in food production, logistics and
            warehouse roles across the Netherlands. They handle your complete onboarding — from
            first contact to first shift — including housing, transport and paperwork.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Fast response — within 24 hours of your WhatsApp message",
              "Housing arranged before you arrive in Losser",
              "Transport to Johma organised for you",
              "Scooter, bicycle or car available through 4 Minutes",
              "Full document guidance included",
              "No hidden fees — everything is transparent from day one",
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
            Send a WhatsApp message and 4 Minutes will reach out within 24 hours —
            housing, transport, shift schedule and start date all confirmed together.
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
