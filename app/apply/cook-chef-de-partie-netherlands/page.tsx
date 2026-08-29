// /apply/cook-chef-de-partie-netherlands
// Cook / Chef de Partie — Hotels & Resorts, Netherlands
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
  title: "Cook / Chef de Partie — Netherlands Hotels & Resorts | €17.99–€19.00/hr | AgencyCheck",
  description:
    "Chef de Partie vacancy in the Netherlands. €17.99–€19.00/hr gross. Accommodation ~€300/mo included. Hotels & resorts. English B1+. EU citizens. 2–5 yrs kitchen experience. Apply via WhatsApp.",
  keywords: [
    "chef de partie netherlands",
    "cook vacancy netherlands",
    "hotel chef job netherlands accommodation",
    "kitchen staff netherlands eu",
    "chef de partie hotel resort nl",
    "cook job netherlands housing included",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/cook-chef-de-partie-netherlands",
    languages: {
      "en":        "https://agencycheck.io/apply/cook-chef-de-partie-netherlands",
      "x-default": "https://agencycheck.io/apply/cook-chef-de-partie-netherlands",
    },
  },
  openGraph: {
    title: "Cook / Chef de Partie — Netherlands | €17.99–€19.00/hr",
    description:
      "€17.99–€19.00/hr gross. Accommodation ~€300/mo included. Hotels & resorts in the Netherlands. English B1+. EU citizens. 2–5 yrs experience. Apply via WhatsApp.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Cook / Chef de Partie — Hotels & Resorts, Netherlands";
const JOB_ID    = "cook-chef-de-partie-netherlands";
const SOURCE    = "cook-chef-nl";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Cook / Chef de Partie",
  description:    "Cook / Chef de Partie vacancy in the Netherlands. Work in a hotel or resort kitchen. €17.99–€19.00/hr gross. Accommodation ~€300/mo included in the employment package. Full-time. English B1+ required. EU citizenship required. 2–5 years of kitchen experience expected.",
  datePosted:     "2026-08-01",
  validThrough:   "2026-12-31",
  employmentType: "FULL_TIME",
  city:           "Netherlands",
  region:         "Netherlands",
  country:        "NL",
  currency:       "EUR",
  minSalary:      17.99,
  maxSalary:      19.00,
  salaryUnit:     "HOUR",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "Do I need chef qualifications?",        answer: "A formal culinary qualification is a plus but not strictly required. 2–5 years of professional kitchen experience is the key requirement." },
  { question: "Is accommodation included?",            answer: "Yes. Accommodation is included in the employment package at approximately €300/month, deducted from salary." },
  { question: "Do I need to speak Dutch?",             answer: "No. English B1+ is the working language. Dutch is not required." },
  { question: "Can I bring my partner?",               answer: "Mention it when you apply and we will check what accommodation options are available for couples." },
  { question: "What hotels and resorts are involved?", answer: "Positions are available across hotels and resorts in the Netherlands. Specific location is confirmed after the initial screening." },
  { question: "What shifts will I work?",              answer: "Kitchen schedules include morning, afternoon, and evening shifts. Exact shift pattern depends on the property." },
  { question: "Is this a long-term position?",         answer: "Yes. This is a full-time, long-term position. The employment contract is direct and legal under Dutch law." },
  { question: "What EU documents do I need?",          answer: "A valid EU ID or passport. EU citizenship or full EU work authorisation is required. Non-EU applicants cannot be processed for this vacancy." },
]);

const FAQ_ITEMS = [
  { q: "Do I need chef qualifications or a certificate?", a: "A formal culinary diploma is a plus but not mandatory. 2–5 years of professional kitchen experience in a hotel, restaurant, or resort is the main requirement. Mention your experience clearly when you apply." },
  { q: "Is accommodation included?",                     a: "Yes. Accommodation is part of the employment package at approximately €300/month. This is deducted directly from your salary — no separate rental search required." },
  { q: "Do I need to speak Dutch?",                      a: "No. English B1+ is sufficient for daily work. The team and management communicate in English. Dutch is not required." },
  { q: "Can I bring my partner?",                        a: "Mention it when you apply via WhatsApp. We will check the available accommodation options and let you know what is possible for couples." },
  { q: "What type of kitchen work will I be doing?",     a: "You will be working as a Cook or Chef de Partie in a professional hotel or resort kitchen — food preparation, cooking to standard, managing a section, and maintaining hygiene protocols." },
  { q: "How quickly can I start?",                       a: "Typically within 2–4 weeks if your documents are in order. We respond within 24 hours of your WhatsApp message." },
  { q: "Is this a long-term position?",                  a: "Yes. This is a full-time, long-term role with a legal employment contract under Dutch law. The position is not seasonal." },
  { q: "What EU documents do I need?",                   a: "A valid EU passport or ID card is required. EU citizenship or full EU work authorisation is mandatory — non-EU applicants cannot be processed for this vacancy." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CookChefDePartieNetherlandsPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                                   url: "/" },
        { name: "Now Hiring",                             url: "/apply" },
        { name: "Cook / Chef de Partie — Netherlands",   url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
            Now Hiring · Hotels & Resorts, Netherlands
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-amber-300">
            👨‍🍳 KITCHEN ROLE
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-400">
            🏠 Accommodation Included
          </span>
        </div>

        {/* ── HERO TITLE ─────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Cook / Chef de Partie
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Hotels & Resorts · Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-5">
          Full-time · Kitchen team · Accommodation ~€300/mo included · EU citizens
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={11} hoursAgo={6} />
          <ShareJobButton title="Cook / Chef de Partie — Netherlands Hotels & Resorts" />
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-extrabold text-white leading-none">€17.99</span>
            <span className="text-gray-400 text-sm mb-1">– €19.00/hr gross</span>
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Starting rate</p>
                <p className="text-gray-500 text-[11px]">All experience levels</p>
              </div>
              <div className="text-right">
                <p className="text-[#22C55E] font-extrabold text-base">€17.99<span className="text-gray-500 font-normal text-xs">/hr</span></p>
                <p className="text-gray-500 text-[11px]">gross</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Experienced rate</p>
                <p className="text-gray-500 text-[11px]">3+ yrs hotel/resort kitchen</p>
              </div>
              <div className="text-right">
                <p className="text-amber-300 font-extrabold text-base">€19.00<span className="text-gray-500 font-normal text-xs">/hr</span></p>
                <p className="text-amber-400/70 text-[11px] font-bold">top rate</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-[11px] mt-3">Gross hourly rate · Legal employment contract · Dutch payroll</p>
        </div>

        {/* ── QUICK STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "🏨", label: "Hotels & resorts" },
            { icon: "🏠", label: "Housing ~€300/mo" },
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
              <p className="text-white font-extrabold text-2xl leading-none mb-0.5">~€300</p>
              <p className="text-gray-500 text-[11px]">/month · Deducted from salary</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Accommodation arranged before your arrival",
              "Deducted directly from payslip — no rental search",
              "Close to your place of work",
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
              "Prepare and cook dishes to hotel standard",
              "Manage your assigned kitchen section",
              "Follow recipes and plating specifications",
              "Maintain food hygiene and HACCP standards",
              "Control portion sizes and food costs",
              "Support mise en place for all services",
              "Collaborate with kitchen team during service",
              "Ensure correct storage of all ingredients",
              "Communicate clearly with senior chef",
              "Keep station clean and organised at all times",
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
              { text: "2–5 years of professional kitchen experience", urgent: true },
              { text: "English B1+ — working language of the kitchen", urgent: false },
              { text: "Experience in a hotel, resort, or catering kitchen preferred", urgent: false },
              { text: "Ability to work shifts including evenings and weekends", urgent: false },
              { text: "Food hygiene knowledge (HACCP awareness)", urgent: false },
              { text: "Reliable, punctual, and able to work under pressure", urgent: false },
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
              { icon: "💶", title: "Above-average kitchen wage",    body: "€17.99–€19.00/hr is well above the Dutch minimum wage for 2026 (€14.06/hr). Kitchen roles rarely pay this well via agency." },
              { icon: "🏠", title: "Housing sorted from day one",   body: "Accommodation ~€300/mo is part of the package. You arrive, you work — no separate flat hunting in the Netherlands." },
              { icon: "📋", title: "Legal Dutch employment",        body: "Full employment contract, Dutch payroll, social insurance, and pension contributions. Everything by the book." },
              { icon: "🌍", title: "International kitchen team",    body: "Hotel and resort kitchens in the Netherlands have international teams. English is the working language." },
              { icon: "📈", title: "Career pathway",                body: "Hotel and resort kitchens offer clear progression — Chef de Partie to Sous Chef. Strong performers move up." },
              { icon: "🇳🇱", title: "Netherlands stability",       body: "Stable, high-demand market. Hospitality employers in the Netherlands are actively hiring and struggling to find skilled kitchen staff." },
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
              { icon: "💶", text: "€17.99–€19.00/hr gross" },
              { icon: "🏠", text: "Accommodation ~€300/mo" },
              { icon: "📋", text: "Legal Dutch contract" },
              { icon: "🌍", text: "English-speaking team" },
              { icon: "🇪🇺", text: "EU workers welcome" },
              { icon: "📈", text: "Long-term position" },
              { icon: "🏨", text: "Hotels & resorts" },
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
            Tell us your kitchen experience and we will get back to you within 24 hours — accommodation, contract, and start date included.
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
