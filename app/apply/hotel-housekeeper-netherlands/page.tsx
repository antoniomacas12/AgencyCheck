// /apply/hotel-housekeeper-netherlands
// Hotel Housekeeper — 4–5★ Hotels, Netherlands
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
  title: "Hotel Housekeeper — 4–5★ Hotels Netherlands | €17.99/hr + Housing | AgencyCheck",
  description:
    "Hotel Housekeeper vacancy in the Netherlands. €17.99/hr gross. Accommodation ~€400/mo included. 4–5★ hotels. English B1+. EU citizens. 1 year housekeeping experience. Apply via WhatsApp.",
  keywords: [
    "hotel housekeeper netherlands",
    "hotel cleaner job netherlands accommodation",
    "housekeeper vacancy netherlands eu",
    "hotel housekeeping netherlands housing included",
    "room attendant netherlands",
    "hotel staff netherlands eu citizens",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/hotel-housekeeper-netherlands",
    languages: {
      "en":        "https://agencycheck.io/apply/hotel-housekeeper-netherlands",
      "x-default": "https://agencycheck.io/apply/hotel-housekeeper-netherlands",
    },
  },
  openGraph: {
    title: "Hotel Housekeeper — Netherlands 4–5★ Hotels | €17.99/hr",
    description:
      "€17.99/hr gross. Accommodation ~€400/mo included. 4–5★ hotels in the Netherlands. English B1+. EU citizens only. 1 year experience. Apply via WhatsApp.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Hotel Housekeeper — 4–5★ Hotels, Netherlands";
const JOB_ID    = "hotel-housekeeper-netherlands";
const SOURCE    = "housekeeper-nl";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Hotel Housekeeper",
  description:    "Hotel Housekeeper vacancy in the Netherlands. Work in a 4–5 star hotel. €17.99/hr gross. Accommodation ~€400/mo included in the employment package. Full-time. English B1+ required. EU citizenship required. 1 year of professional housekeeping experience expected.",
  datePosted:     "2026-08-01",
  validThrough:   "2026-12-31",
  employmentType: "FULL_TIME",
  city:           "Netherlands",
  region:         "Netherlands",
  country:        "NL",
  currency:       "EUR",
  minSalary:      17.99,
  maxSalary:      17.99,
  salaryUnit:     "HOUR",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "Do I need housekeeping experience?",    answer: "Yes. At least 1 year of professional housekeeping experience in a hotel, resort, or similar setting is required." },
  { question: "Is accommodation included?",            answer: "Yes. Accommodation is included in the employment package at approximately €400/month, deducted from your salary." },
  { question: "Do I need to speak Dutch?",             answer: "No. English B1+ is the working language. Dutch is not required." },
  { question: "What hotels are involved?",             answer: "Positions are in 4–5 star hotels in the Netherlands. Specific location confirmed after screening." },
  { question: "What shifts will I work?",              answer: "Housekeeping runs primarily morning and afternoon shifts. Exact schedule depends on the hotel." },
  { question: "Can I bring my partner?",               answer: "Mention this when you apply. Accommodation options for couples will be checked and confirmed before your start." },
  { question: "Is EU work authorisation mandatory?",   answer: "Yes. EU citizenship or full EU work authorisation is required. Non-EU applicants cannot be processed for this vacancy." },
  { question: "How quickly can I start?",              answer: "Typically within 2–3 weeks if documents are in order. We respond within 24 hours of your WhatsApp message." },
]);

const FAQ_ITEMS = [
  { q: "Do I need previous housekeeping experience?",  a: "Yes — at least 1 year of professional housekeeping experience in a hotel, resort, or similar property is required. Mention your experience and where you worked when you apply." },
  { q: "Is accommodation included in the package?",   a: "Yes. Accommodation is part of the employment package at approximately €400/month, deducted directly from your payslip. No separate flat hunting required." },
  { q: "Do I need to speak Dutch?",                   a: "No. English B1+ is sufficient. The hotel operates internationally and English is the standard working language. Dutch is not required." },
  { q: "What does the daily work look like?",         a: "Room cleaning and preparation to hotel standard, linen changes, bathroom cleaning, restocking amenity trolleys, and reporting room status to supervisors." },
  { q: "Can I bring my partner?",                     a: "Let us know when you apply via WhatsApp. We will check accommodation availability for couples and confirm before your start date." },
  { q: "What type of hotel is this?",                 a: "4–5 star hotel in the Netherlands. High presentation standards are expected — this is not a budget property." },
  { q: "How quickly can I start?",                    a: "Usually 2–3 weeks after your application if documents are ready. We respond within 24 hours of your WhatsApp message." },
  { q: "Is EU citizenship mandatory?",                a: "Yes. EU citizenship or full EU work authorisation is mandatory. Non-EU applicants cannot be processed for this vacancy under current Dutch employment law." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HotelHousekeeperNetherlandsPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                               url: "/" },
        { name: "Now Hiring",                         url: "/apply" },
        { name: "Hotel Housekeeper — Netherlands",    url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse inline-block" />
            Now Hiring · 4–5★ Hotels, Netherlands
          </div>
          <span className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-sky-300">
            🏨 HOUSEKEEPING
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            🏠 Accommodation Included
          </span>
        </div>

        {/* ── HERO TITLE ─────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Hotel Housekeeper
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          4–5 Star Hotels · Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-5">
          Full-time · Housekeeping department · Accommodation ~€400/mo included · EU citizens
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={9} hoursAgo={5} />
          <ShareJobButton title="Hotel Housekeeper — 4–5★ Hotels Netherlands" />
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-extrabold text-white leading-none">€17.99</span>
            <span className="text-gray-400 text-sm mb-1">/hr gross</span>
          </div>
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Weekly gross (40 hrs)</p>
                <p className="text-gray-500 text-[11px]">Standard full-time week</p>
              </div>
              <div className="text-right">
                <p className="text-[#22C55E] font-extrabold text-base">~€719<span className="text-gray-500 font-normal text-xs">/wk</span></p>
                <p className="text-gray-500 text-[11px]">gross</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-[11px] mt-3">Gross hourly rate · Legal employment contract · Dutch payroll</p>
        </div>

        {/* ── QUICK STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "⭐", label: "4–5★ hotels" },
            { icon: "🏠", label: "Housing ~€400/mo" },
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
        <div className="rounded-2xl border border-purple-400/25 bg-purple-400/[0.05] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-300 mb-4">
            🏠 Accommodation — Included in Package
          </p>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-xl bg-white/[0.05] border border-white/[0.08] px-8 py-4 text-center">
              <p className="text-white font-extrabold text-2xl leading-none mb-0.5">~€400</p>
              <p className="text-gray-500 text-[11px]">/month · Deducted from salary</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Accommodation arranged before your arrival",
              "Deducted directly from payslip — no rental search",
              "Close to the hotel you will be working in",
              "Mention if you are bringing a partner when you apply",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="text-purple-300 text-sm shrink-0">✓</span>
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
              "Clean and prepare guest rooms to hotel standard",
              "Change bed linen and towels between guests",
              "Deep-clean bathrooms and replenish amenities",
              "Restock and maintain your housekeeping trolley",
              "Report room status and maintenance issues",
              "Follow hygiene and safety protocols at all times",
              "Handle lost property per hotel procedure",
              "Ensure corridor and common areas are clean",
              "Work efficiently to meet daily room targets",
              "Communicate with supervisors in English",
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
              { text: "EU citizenship or full EU work authorisation", urgent: true },
              { text: "Minimum 1 year of professional hotel housekeeping experience", urgent: true },
              { text: "English B1+ — daily communication in English", urgent: false },
              { text: "High attention to detail and presentation standards", urgent: false },
              { text: "Physically fit — role involves standing, lifting, and repetitive tasks", urgent: false },
              { text: "Reliable attendance and punctuality", urgent: false },
              { text: "Ability to work shifts including weekends", urgent: false },
            ].map(({ text, urgent }) => (
              <li key={text} className="flex items-center gap-2.5">
                <span className={`font-bold text-sm shrink-0 ${urgent ? "text-amber-300" : "text-[#22C55E]"}`}>
                  {urgent ? "★" : "✓"}
                </span>
                <span className={urgent ? "text-amber-100 font-semibold" : ""}>{text}</span>
              </li>
            ))}
          </ul>
          <p className="text-amber-400/70 text-[11px] mt-3">★ Mandatory — required without exception.</p>
        </div>

        {/* ── WHY THIS ROLE ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Why Apply
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: "💶", title: "Strong hourly rate",            body: "€17.99/hr is significantly above the Dutch minimum wage of €14.06/hr. Housekeeping roles rarely pay this well." },
              { icon: "🏠", title: "Housing from day one",          body: "~€400/mo accommodation is included. Arrive, start work — no separate flat search in the Netherlands." },
              { icon: "⭐", title: "Premium hotel environment",     body: "4–5 star properties. Professional, well-managed teams. Clean, safe working conditions." },
              { icon: "📋", title: "Legal Dutch employment",        body: "Full employment contract, Dutch payroll, social insurance. Everything transparent and legal." },
              { icon: "🌍", title: "International team",            body: "Hotel housekeeping teams in the Netherlands are international. English is the standard working language." },
              { icon: "📅", title: "Stable, long-term position",   body: "This is not seasonal work. Long-term position with a legal contract and stable hours." },
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
              { icon: "💶", text: "€17.99/hr gross" },
              { icon: "🏠", text: "Accommodation ~€400/mo" },
              { icon: "📋", text: "Legal Dutch contract" },
              { icon: "⭐", text: "4–5★ hotel property" },
              { icon: "🇪🇺", text: "EU workers welcome" },
              { icon: "📅", text: "Long-term position" },
              { icon: "🌍", text: "English-speaking team" },
              { icon: "⚡", text: "Start within 2–3 weeks" },
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
            Tell us your housekeeping experience and we will respond within 24 hours — accommodation, contract, and start date confirmed before you travel.
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
            AgencyCheck · Real data. Real experiences. · EU citizens only.
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
