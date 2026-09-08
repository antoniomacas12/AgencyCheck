// /apply/auto-detailing-worker-netherlands
// Auto Detailing Worker — Option A, Amsterdam / Rotterdam, Netherlands
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
  title: "Auto Detailing Worker Netherlands – Amsterdam / Rotterdam | €2,300–€2,400 net/mo | AgencyCheck",
  description:
    "Auto Detailing Worker vacancy in Amsterdam and Rotterdam, Netherlands. €2,300–€2,400 NET/month. Single/private room accommodation €15/night. EU citizens. Category B driving licence required. English required. Apply via WhatsApp.",
  keywords: [
    "auto detailing jobs netherlands",
    "car detailing jobs netherlands",
    "auto detailing amsterdam",
    "auto detailing rotterdam",
    "car wash jobs netherlands",
    "automotive jobs netherlands accommodation",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/auto-detailing-worker-netherlands",
    languages: {
      "en":        "https://agencycheck.io/apply/auto-detailing-worker-netherlands",
      "x-default": "https://agencycheck.io/apply/auto-detailing-worker-netherlands",
    },
  },
  openGraph: {
    title: "Auto Detailing Worker — Amsterdam / Rotterdam | €2,300–€2,400 net/mo",
    description:
      "€2,300–€2,400 NET/month. Accommodation available (single/private room, €15/night). Amsterdam and Rotterdam, Netherlands. EU citizens. Category B licence + English required. Apply via WhatsApp.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Auto Detailing Worker — Amsterdam / Rotterdam, Netherlands";
const JOB_ID    = "auto-detailing-worker-netherlands";
const SOURCE    = "auto-detailing-nl";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Auto Detailing Worker",
  description:    "Auto Detailing Worker vacancy in Amsterdam and Rotterdam, Netherlands. Professional interior and exterior vehicle cleaning, polishing, and preparation to quality standards. €2,300–€2,400 NET/month (net take-home). Accommodation available at €15/night (single/private room). Full-time. English required. EU citizenship required. Category B driving licence required. Via recruitment partner Option A.",
  datePosted:     "2026-09-01",
  validThrough:   "2026-12-31",
  employmentType: "FULL_TIME",
  city:           "Amsterdam",
  region:         "Noord-Holland",
  country:        "NL",
  currency:       "EUR",
  minSalary:      2300,
  maxSalary:      2400,
  salaryUnit:     "MONTH",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "Do I need car detailing experience?",      answer: "Car detailing or car wash experience is preferred but not mandatory. A genuine interest in working with vehicles and attention to detail are the key soft requirements. All mandatory requirements are: EU citizenship, English language, and a valid Category B driving licence." },
  { question: "Is accommodation available?",              answer: "Yes. Accommodation is available via the partner — a single/private room at €15/night. Mention accommodation when you apply via WhatsApp." },
  { question: "Is a driving licence required?",           answer: "Yes. A valid Category B driving licence is mandatory for this role. It is required to move and position vehicles on site." },
  { question: "Do I need to speak Dutch?",                answer: "No. English is the required working language. Dutch is not required." },
  { question: "Is this a long-term position?",            answer: "Yes. This is a full-time, long-term position with career progression opportunities. The employment contract is legal under Dutch law." },
  { question: "What EU documents do I need?",             answer: "A valid EU passport or ID card. EU citizenship or full EU work authorisation is required — non-EU applicants cannot be processed for this vacancy." },
  { question: "What does auto detailing work involve?",   answer: "Professional interior and exterior vehicle cleaning, washing, polishing, and preparation. You will work to quality and safety standards set by the employer. It is detailed, precision-oriented work — not a standard car wash." },
  { question: "How quickly can I start?",                 answer: "Typically within 2–4 weeks if your documents are in order. We respond within 24 hours of your WhatsApp message." },
]);

const FAQ_ITEMS = [
  { q: "Do I need car detailing or car wash experience?",  a: "Car detailing or car wash experience is preferred but not a hard requirement. A genuine interest in working with vehicles and an eye for quality are important. The mandatory requirements are EU citizenship, English, and a valid Category B driving licence." },
  { q: "Is accommodation available?",                      a: "Yes. Accommodation is available via the recruitment partner — a single/private room at €15/night. Mention that you need accommodation when you apply via WhatsApp and we will confirm availability." },
  { q: "Is a Category B driving licence required?",        a: "Yes. A valid Category B driving licence is mandatory. It is needed to move and position vehicles at the facility." },
  { q: "Do I need to speak Dutch?",                        a: "No. English is the required working language for this role. Dutch is not required." },
  { q: "What exactly does the work involve?",              a: "Professional interior and exterior vehicle cleaning, washing, polishing, and detailed preparation to quality standards. This is precision-oriented work — not a standard car wash. You will follow defined safety and quality procedures." },
  { q: "Is this a long-term position?",                    a: "Yes. This is a full-time, long-term role with career progression opportunities and a legal Dutch employment contract." },
  { q: "What EU documents do I need?",                     a: "A valid EU passport or national ID card. EU citizenship or full EU work authorisation is mandatory — non-EU applicants cannot be processed for this vacancy." },
  { q: "How do I apply and how long does it take?",        a: "Apply via WhatsApp — one message is enough to start. We respond within 24 hours. If your profile fits, the process moves quickly. Have your EU ID/passport and driving licence details ready." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AutoDetailingWorkerNetherlandsPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                                          url: "/" },
        { name: "Now Hiring",                                    url: "/apply" },
        { name: "Auto Detailing Worker — Netherlands",           url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse inline-block" />
            Now Hiring · Amsterdam / Rotterdam, Netherlands
          </div>
          <span className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-violet-300">
            🚗 AUTOMOTIVE ROLE
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            🏠 Housing Available
          </span>
        </div>

        {/* ── HERO TITLE ─────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Auto Detailing Worker
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Automotive · Amsterdam / Rotterdam · Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-5">
          Full-time · Long-term · Housing €15/night · EU citizens · Via Option A
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={7} hoursAgo={5} />
          <ShareJobButton title="Auto Detailing Worker — Amsterdam / Rotterdam, Netherlands" />
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-extrabold text-white leading-none">€2,300</span>
            <span className="text-gray-400 text-sm mb-1">– €2,400 NET/month</span>
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Monthly salary</p>
                <p className="text-gray-500 text-[11px]">NET take-home</p>
              </div>
              <div className="text-right">
                <p className="text-[#22C55E] font-extrabold text-base">€2,300 – €2,400</p>
                <p className="text-[#22C55E]/70 text-[11px] font-bold">NET / month</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-[11px] mt-3">NET monthly salary · Legal employment contract · Dutch payroll · Via recruitment partner Option A</p>
        </div>

        {/* ── QUICK STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "🚗", label: "Automotive" },
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
              "Professional interior vehicle cleaning",
              "Professional exterior vehicle cleaning",
              "Washing and preparation of vehicles",
              "Polishing to quality standards",
              "Basic vehicle preparation tasks",
              "Auto detailing to employer quality standards",
              "Following safety and quality procedures",
              "Maintaining a clean, organised work area",
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
              { text: "EU citizenship or full EU work authorisation",    urgent: true },
              { text: "English language — working language of the team", urgent: true },
              { text: "Valid Category B driving licence",                urgent: true },
              { text: "Car detailing or car wash experience (preferred)", urgent: false },
              { text: "Genuine interest in working with vehicles",       urgent: false },
              { text: "Attention to detail and quality focus",           urgent: false },
              { text: "Reliable and able to work full-time",             urgent: false },
            ].map(({ text, urgent }) => (
              <li key={text} className="flex items-center gap-2.5">
                <span className={`font-bold text-sm shrink-0 ${urgent ? "text-amber-300" : "text-[#22C55E]"}`}>
                  {urgent ? "★" : "✓"}
                </span>
                <span className={urgent ? "text-amber-100 font-semibold" : ""}>{text}</span>
              </li>
            ))}
          </ul>
          <p className="text-amber-400/70 text-[11px] mt-3">★ Mandatory — required without exception. &nbsp;✓ Preferred — not mandatory.</p>
        </div>

        {/* ── WHY THIS ROLE ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Why Apply
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: "💶", title: "Strong NET monthly salary",       body: "€2,300–€2,400 net per month is a competitive take-home for this type of role in the Netherlands. Salary is quoted net — what you actually receive." },
              { icon: "🏠", title: "Accommodation available",         body: "Single/private room at €15/night — arrange via the recruitment partner when you apply. No separate housing search needed." },
              { icon: "📋", title: "Legal Dutch employment",          body: "Full employment contract, Dutch payroll, and social insurance from day one. Everything by the book." },
              { icon: "🚗", title: "Automotive sector — hands-on",   body: "Work with vehicles every day in a professional automotive setting. If you have an interest in cars, this is a genuine entry point to the sector." },
              { icon: "📈", title: "Long-term with career path",      body: "This is a long-term position, not a seasonal role. Strong performers have career progression opportunities within the company." },
              { icon: "🇳🇱", title: "Netherlands stability",         body: "Stable employment in a high-demand automotive services market. The Netherlands has consistent demand for skilled and reliable detailing workers." },
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
              { icon: "💶", text: "€2,300–€2,400 NET/month" },
              { icon: "🏠", text: "Housing €15/night avail." },
              { icon: "📋", text: "Legal Dutch contract" },
              { icon: "🌍", text: "English-speaking team" },
              { icon: "🇪🇺", text: "EU workers welcome" },
              { icon: "📈", text: "Long-term + progression" },
              { icon: "🚗", text: "Amsterdam / Rotterdam" },
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
            Tell us your experience, that you have a Category B licence, and mention if you need accommodation. We respond within 24 hours.
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
