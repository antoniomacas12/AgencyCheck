// /apply/johma-food-mixing-operator
// Food Mixing Operator at Johma — Losser, NL
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
  title:
    "Food Mixing Operator at Johma — €16.01/hr + Housing | Losser, NL | AgencyCheck",
  description:
    "Food Mixing Operator at Johma in Losser, NL. €16.01/hr base + 35% night allowance (€21.61/hr). Accommodation from €136.74/week. Long-term contract via 4minutes. Apply in 60 seconds via WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/apply/johma-food-mixing-operator",
    languages: {
      "en":        "https://agencycheck.io/apply/johma-food-mixing-operator",
      "x-default": "https://agencycheck.io/apply/johma-food-mixing-operator",
    },
  },
  openGraph: {
    title:       "Food Mixing Operator at Johma — €16.01/hr | Losser, NL",
    description:
      "€16.01/hr base, 3-shift system, nights up to €21.61/hr. Accommodation from €136.74/week. Mixing and food production at Johma, Losser. Via 4minutes — response within 24h.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Food Mixing Operator at Johma (Losser, NL)";
const JOB_ID    = "johma-food-mixing-operator";
const SOURCE    = "johma-mixing";

const JOB_SCHEMA = jobPostingSchema({
  title:       "Food Mixing Operator",
  description:
    "Food Mixing Operator at Johma food company in Losser, Netherlands. Responsible for mixing food ingredients and preparing raw materials for Johma salad production. 3-shift system. Base salary €16.01/hr with up to 35% night shift allowance (€21.61/hr). Accommodation available from €136.74/week. Long-term contract, possibility of permanent employment. Via recruitment partner 4minutes. EU work authorisation required.",
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
  { question: "Do I need food production experience?",    answer: "Prior food or mixing experience is a plus but not required. Johma provides full on-the-job training. What matters most is reliability, hygiene awareness, ability to follow recipes accurately, and long-term commitment." },
  { question: "Is accommodation available?",              answer: "Yes. 4minutes arranges housing near the Johma facility in Losser. Single rooms from €136.74/week with shared kitchen and bathroom. Max 4 bedrooms per house. Weekly cleaning of common areas included. €300 refundable deposit required." },
  { question: "Can couples apply together?",              answer: "Yes. Couples can share a room at €103.94/week per person — better value than a single room. Mention this in your WhatsApp message and accommodation will be arranged for both." },
  { question: "Do I need to speak Dutch?",                answer: "No. Basic English is sufficient. 4minutes communicates with you in English throughout and Johma is an international workplace." },
  { question: "What are the shift hours?",                answer: "3-shift system: morning 06:00–14:00, afternoon 14:00–22:00, night 22:00–06:00. Allowances apply from 18:00. Exact shift rotation is confirmed when you start." },
  { question: "What salary can I earn?",                  answer: "Base is €16.01/hr gross. Evening shifts (18:00–00:00) carry +33% = €21.29/hr. Night shifts (00:00–06:00) carry +35% = €21.61/hr. On top: 3% year-end bonus and €0.23/km travel allowance." },
  { question: "Is transportation available?",             answer: "Yes. 4minutes arranges transport to and from Johma. You can also use a scooter, bicycle or car through 4minutes, plus a €0.23/km travel allowance is paid." },
  { question: "How quickly can I start?",                 answer: "Usually within 1–2 weeks if documents are ready. Send a WhatsApp message — 4minutes replies within 24 hours and coordinates everything: housing, transport, shift schedule and start date." },
]);

const FAQ_ITEMS = [
  { q: "Do I need food production experience?",    a: "Not required. Johma provides on-the-job training. Reliability, hygiene awareness and ability to follow recipes accurately are what matter most." },
  { q: "Is accommodation available?",              a: "Yes. 4minutes arranges housing in Losser. Single rooms from €136.74/week (shared kitchen, bathroom, weekly cleaning). €300 refundable deposit. Max 4 bedrooms per house." },
  { q: "Can couples apply together?",              a: "Yes. Couples share a room at €103.94/week per person. Mention it in your WhatsApp message." },
  { q: "Do I need to speak Dutch?",                a: "No — basic English is enough. 4minutes and Johma both communicate in English." },
  { q: "What are the shift hours?",                a: "Morning 06:00–14:00 · Afternoon 14:00–22:00 · Night 22:00–06:00. Allowances from 18:00." },
  { q: "What salary can I earn?",                  a: "€16.01/hr base. Evening +33% = €21.29/hr. Night +35% = €21.61/hr. Plus 3% year-end bonus + €0.23/km travel." },
  { q: "Is transportation available?",             a: "Yes. Transport to Johma via 4minutes. Scooter, bike or car also available. €0.23/km allowance paid on top." },
  { q: "How quickly can I start?",                 a: "Within 1–2 weeks if documents are in order. WhatsApp message → 4minutes replies within 24 hours." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function JohmaFoodMixingOperatorPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                             url: "/" },
        { name: "Now Hiring",                       url: "/apply" },
        { name: "Food Mixing Operator — Johma",     url: `/apply/${JOB_ID}` },
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
          Food Mixing Operator
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Johma · Losser, Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-5">
          Via recruitment partner:{" "}
          <span className="text-gray-200 font-semibold">4minutes</span>
          {" · "}Full-time · Long-term
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={19} hoursAgo={6} />
          <ShareJobButton title="Food Mixing Operator at Johma — Losser, NL" />
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
            🏠 Housing — Arranged by 4minutes
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
              { icon: "💶", title: "Salary above minimum wage",    body: "€16.01/hr base — well above the Dutch minimum. Work night shifts and earn €21.61/hr. Every hour you put in counts." },
              { icon: "📋", title: "Long-term stability",          body: "Not a short-term placement. Johma offers long-term work and if your performance is good, a permanent contract through 4minutes is possible." },
              { icon: "🥗", title: "Free salads every Thursday",   body: "A small but real perk — every Thursday you can take home fresh Johma salads. It's a sign of a company that looks after its people." },
              { icon: "🤝", title: "Everything handled for you",   body: "4minutes coordinates housing, transport, shifts and paperwork. You focus on work — they handle the rest before you even arrive." },
              { icon: "🎁", title: "3% year-end bonus",            body: "Every December, 3% of your total annual gross earnings is paid out as a bonus. Stay longer, earn more." },
              { icon: "🚐", title: "Transport to and from Johma",  body: "4minutes arranges transport directly. You can also use a scooter, bicycle or car through them, with €0.23/km travel allowance on top." },
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

        {/* ── FOOD MIXING RESPONSIBILITIES ─────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            What You Will Do
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            As a Food Mixing Operator you are at the heart of Johma&apos;s production process —
            precisely measuring and combining the ingredients that go into every Johma salad.
            Your accuracy and hygiene standards directly shape the quality of the final product.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Mixing food ingredients to recipe specifications",
              "Following production instructions accurately",
              "Preparing raw materials for the line",
              "Measuring ingredients with precision",
              "Monitoring production processes",
              "Performing quality checks",
              "Following hygiene regulations at all times",
              "Maintaining food safety standards",
              "Cleaning and organising workstations",
              "Supporting efficient production flow",
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
              "Ability to follow recipes and instructions accurately",
              "Strong attention to detail — precision matters in mixing",
              "Hygiene awareness — this is a food production environment",
              "Team player with a responsible work attitude",
              "Long-term motivated — not looking for a short stay",
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
              { icon: "🥗", text: "Free salads every Thursday" },
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
              "Food production workers",
              "Kitchen operators",
              "Factory workers",
              "Bakery workers",
              "Food industry workers",
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
            Johma is one of the Netherlands&apos; most established fresh food producers, based in
            Losser, Overijssel. Known for fresh salads, dips and ready-to-eat products sold across
            the Dutch market, Johma operates modern and hygienic production facilities with the
            highest standards for food safety and quality.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mt-2">
            As a Food Mixing Operator, you are a critical part of the process — the precision of
            your mixing work determines the consistency and quality of every Johma product that
            reaches Dutch supermarket shelves. Johma offers a structured, professional environment
            with genuine long-term career prospects.
          </p>
        </div>

        {/* ── ABOUT 4 MINUTES ──────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            About 4minutes — Your Recruitment Partner
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            4minutes is a specialist recruiter placing workers in food production, logistics and
            warehouse roles across the Netherlands. They manage your full onboarding — from first
            WhatsApp message to first day at Johma — including housing, transport and all paperwork.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Response within 24 hours of your WhatsApp message",
              "Housing arranged before you arrive in Losser",
              "Transport to Johma organised for you",
              "Scooter, bicycle or car available through 4minutes",
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
            Housing, transport, shift schedule and start date — all confirmed in one go.
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
