// /apply/johma-reach-truck-driver
// Reach Truck Driver at Johma — Losser, NL
// Via recruitment partner: 4minutes
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
  title: "Reach Truck Driver at Johma — €17.55/hr + Shift Allowance | Losser, NL | AgencyCheck",
  description:
    "Urgent reach truck driver vacancy at Johma in Losser, NL. €17.55/hr base + up to 35% night allowance. Valid certificate required. Single room housing from €136.74/week. Long-term contract. Apply via WhatsApp.",
  keywords: [
    "reach truck driver netherlands",
    "reachtruck chauffeur vacature",
    "johma losser vacature",
    "warehouse driver netherlands accommodation",
    "reach truck certificate jobs nl",
    "4minutes johma vacature",
  ],
  alternates: {
    canonical: "https://agencycheck.io/apply/johma-reach-truck-driver",
    languages: {
      "en":        "https://agencycheck.io/apply/johma-reach-truck-driver",
      "x-default": "https://agencycheck.io/apply/johma-reach-truck-driver",
    },
  },
  openGraph: {
    title: "Reach Truck Driver at Johma — €17.55/hr | Losser, NL",
    description:
      "€17.55/hr base, 3-shift system, up to €23.69/hr on nights. Valid reach truck certificate required. Housing from €136.74/week. Urgent vacancy at Johma in Losser. Via 4minutes — apply via WhatsApp.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Reach Truck Driver at Johma (Losser, NL)";
const JOB_ID    = "johma-reach-truck-driver";
const SOURCE    = "johma-reach-truck";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Reach Truck Driver",
  description:    "Urgent reach truck driver vacancy at Johma food company in Losser, Netherlands. 3-shift system (morning, afternoon, night). Base salary €17.55/hr with +33% evening and +35% night shift allowance. Valid Dutch-recognised reach truck certificate required. Single room housing available from €136.74/week. Long-term contract, possibility of permanent employment. Via recruitment partner 4minutes. EU work authorisation required.",
  datePosted:     "2026-07-01",
  validThrough:   "2026-12-01",
  employmentType: "FULL_TIME",
  city:           "Losser",
  region:         "Overijssel",
  country:        "NL",
  currency:       "EUR",
  minSalary:      17.55,
  maxSalary:      23.69,
  salaryUnit:     "HOUR",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "Do I need a reach truck certificate?",  answer: "Yes. A valid Dutch-recognised reach truck certificate is mandatory. Applications without a certificate cannot be processed for this role." },
  { question: "Do I need to speak Dutch?",             answer: "No. Basic English is sufficient. Many colleagues are from EU countries and 4minutes handles recruitment in English." },
  { question: "Is accommodation available?",           answer: "Yes. Single rooms from €136.74/week. Couples can share at €103.94/week per person. €300 refundable deposit required." },
  { question: "Can couples apply together?",           answer: "Yes, couples are welcome. Both can work at Johma. Mention it when you apply so shared accommodation can be arranged." },
  { question: "How quickly can I start?",              answer: "If your certificate and documents are in order, you can typically start within 1–2 weeks. 4minutes responds within 24 hours." },
  { question: "What shifts will I work?",              answer: "Johma runs a 3-shift system: morning (06:00–14:00), afternoon (14:00–22:00), and night (22:00–06:00). Evening allowance +33% from 18:00, night allowance +35% from 00:00." },
  { question: "Is transport to the factory available?", answer: "Yes. 4minutes offers transport options to and from Johma in Losser. A travel allowance of €0.23/km is also paid." },
  { question: "What are my main duties?",              answer: "Operating a reach truck, moving raw materials and finished goods, loading and unloading trucks, supplying production lines, and occasionally supporting production when required." },
]);

const FAQ_ITEMS = [
  { q: "Do I need a reach truck certificate?",   a: "Yes — a valid Dutch-recognised reach truck certificate is mandatory for this role. Without it, your application cannot be processed. If you are in the process of obtaining one, mention this when you apply." },
  { q: "Do I need to speak Dutch?",              a: "No. Basic English is sufficient for daily work at Johma. Many colleagues are from EU countries and 4minutes handles all recruitment communication in English." },
  { q: "Is accommodation available?",            a: "Yes. Single rooms from €136.74/week with weekly cleaning included. Couples can share at €103.94/week per person. A €300 refundable deposit is required." },
  { q: "Can couples apply together?",            a: "Yes — couples are welcome. You can both work at Johma and share accommodation. Mention this when you apply via WhatsApp and we'll arrange it together." },
  { q: "How quickly can I start?",               a: "If your certificate and documents are ready, you can typically start within 1–2 weeks. 4minutes responds within 24 hours of your WhatsApp message." },
  { q: "What shifts will I work?",               a: "Johma runs a 3-shift system: morning (06:00–14:00), afternoon (14:00–22:00), and night (22:00–06:00). Evening allowance +33% applies from 18:00; night allowance +35% from 00:00." },
  { q: "Is transport to Johma available?",       a: "Yes. 4minutes offers transport options to and from Johma in Losser. A travel allowance of €0.23/km is also paid on top of your hourly rate." },
  { q: "Is this a long-term position?",          a: "Yes. This is a long-term role with the possibility of a permanent contract after a qualifying period. Johma is an established employer in the region." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function JohmaReachTruckDriverPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                          url: "/" },
        { name: "Now Hiring",                    url: "/apply" },
        { name: "Reach Truck Driver — Johma",    url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGES ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse inline-block" />
            Urgent Hiring · Losser, NL
          </div>
          <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 rounded-full px-3 py-1.5 text-[11px] font-bold text-red-300">
            ⚡ URGENT HIRING
          </span>
        </div>

        {/* ── HERO TITLE ─────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Reach Truck Driver
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Johma · Losser, Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-5">
          Via recruitment partner: <span className="text-gray-200 font-semibold">4minutes</span> · Full-time · 3-shift system
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={18} hoursAgo={4} />
          <ShareJobButton title="Reach Truck Driver at Johma — Losser, NL" />
        </div>

        {/* ── CERTIFICATE REQUIREMENT — top priority ─────────────── */}
        <div className="flex items-start gap-3 rounded-2xl bg-amber-400/[0.08] border border-amber-400/30 px-5 py-4 mb-6">
          <span className="text-amber-300 text-xl shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="text-amber-200 font-bold text-sm leading-snug mb-1">
              Certificate required to apply
            </p>
            <p className="text-amber-200/70 text-[13px] leading-relaxed">
              A valid Dutch-recognised Reach Truck certificate is mandatory.
              Applications without a certificate cannot be processed for this role.
            </p>
          </div>
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-extrabold text-white leading-none">€17.55</span>
            <span className="text-gray-400 text-sm mb-1">/hr gross (base)</span>
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Shift Allowances</p>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Evening shift</p>
                <p className="text-gray-500 text-[11px]">18:00 – 00:00</p>
              </div>
              <div className="text-right">
                <p className="text-amber-300 font-extrabold text-base">€23.34<span className="text-gray-500 font-normal text-xs">/hr</span></p>
                <p className="text-amber-400/70 text-[11px] font-bold">+33%</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Night shift</p>
                <p className="text-gray-500 text-[11px]">00:00 – 06:00</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-300 font-extrabold text-base">€23.69<span className="text-gray-500 font-normal text-xs">/hr</span></p>
                <p className="text-emerald-400/70 text-[11px] font-bold">+35%</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-[11px] mt-3">+ 3% end-of-year bonus · + €0.23/km travel allowance</p>
        </div>

        {/* ── QUICK STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "🔄", label: "3-shift system" },
            { icon: "🏠", label: "Housing incl." },
            { icon: "📅", label: "Long-term" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-gray-300 text-[11px] font-semibold leading-tight">{label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── SHIFT SCHEDULE CARD ────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            ⏰ Shift Schedule
          </p>
          <div className="space-y-3">
            {[
              { name: "Morning",   hours: "06:00 – 14:00", color: "bg-blue-400",    rate: "€17.55/hr" },
              { name: "Afternoon", hours: "14:00 – 22:00", color: "bg-amber-400",   rate: "€17.55 – €23.34/hr" },
              { name: "Night",     hours: "22:00 – 06:00", color: "bg-emerald-400", rate: "€23.34 – €23.69/hr" },
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
            Evening allowance +33% from 18:00. Night allowance +35% from 00:00.
          </p>
        </div>

        {/* ── HOUSING CARD ───────────────────────────────────────── */}
        <div className="rounded-2xl border border-purple-400/25 bg-purple-400/[0.05] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-300 mb-4">
            🏠 Housing — Available Through 4minutes
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
              "Weekly room cleaning included",
              "Couples can share rooms",
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

        {/* ── WHAT YOU WILL DO ───────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Your Responsibilities
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Operate a Reach Truck safely",
              "Move raw materials through the warehouse",
              "Move finished goods to dispatch",
              "Load and unload trucks efficiently",
              "Supply production lines on schedule",
              "Maintain stock location accuracy",
              "Report any discrepancies to team leader",
              "Support production when required",
              "Follow safety and hygiene protocols",
              "Maintain a clean and organised workspace",
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
              { text: "Proven Reach Truck experience", urgent: true },
              { text: "Valid Dutch-recognised Reach Truck certificate", urgent: true },
              { text: "English OR Dutch — basic level sufficient", urgent: false },
              { text: "Full-time availability (40 hrs/week)", urgent: false },
              { text: "Willing to work all 3 shifts including nights", urgent: false },
              { text: "Reliable and able to work as part of a team", urgent: false },
              { text: "EU work authorisation required", urgent: false },
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

        {/* ── WHY WORK AT JOHMA ──────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Why Work at Johma
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: "💶", title: "Above-average wage",        body: "€17.55/hr base — well above Dutch minimum wage. Night shifts reach €23.69/hr." },
              { icon: "📋", title: "Long-term security",        body: "Stable, long-term position with the possibility of a permanent contract." },
              { icon: "🏭", title: "Professional environment",  body: "Johma is an established Dutch food company operating modern, automated production lines." },
              { icon: "🤝", title: "3% year-end bonus",         body: "Annual bonus paid every December — 3% of your total gross earnings for the year." },
              { icon: "🚗", title: "Travel reimbursed",         body: "€0.23/km travel allowance paid on top of your hourly rate." },
              { icon: "🥗", title: "Weekly salad package",      body: "Fresh Johma salads to take home every week — a genuine sign of a company that values its workers." },
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
              { icon: "💶", text: "€17.55/hr base salary" },
              { icon: "🌙", text: "Up to €23.69/hr nights" },
              { icon: "🎁", text: "3% year-end bonus" },
              { icon: "🚗", text: "€0.23/km travel allowance" },
              { icon: "🏠", text: "Housing available" },
              { icon: "🧹", text: "Weekly cleaning" },
              { icon: "🚐", text: "Transport options" },
              { icon: "📋", text: "Permanent contract possible" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                <span className="text-base shrink-0">{icon}</span>
                <span className="text-gray-300 text-[12px] font-medium leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 my-8" />

        {/* ── ABOUT JOHMA ────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            About Johma
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Johma is an established Dutch food company based in Losser, Overijssel. Known for their
            production of salads and ready-to-eat food products, Johma operates modern production and
            logistics facilities requiring skilled and certified reach truck operators. The company
            offers stable employment with clear career paths and a professional working environment.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mt-2">
            As a long-standing employer in the region, Johma values reliability and technical skill —
            which is why they work with trusted recruitment partners like 4minutes to find the right
            candidates.
          </p>
        </div>

        {/* ── ABOUT 4 MINUTES ────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            About 4minutes — Your Recruitment Partner
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            4minutes is a specialist recruitment agency focused on placing workers in logistics,
            production, and warehouse roles across the Netherlands. They handle your onboarding
            end-to-end — from your first WhatsApp message to your first day at Johma.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Fast response — typically within 24 hours",
              "Housing arranged before you arrive",
              "Transport options to Johma organised",
              "Document and certificate guidance included",
              "No hidden fees — transparent from day one",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="text-[#22C55E] font-bold text-sm shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── APPLICATION CTA ────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/[0.06] px-5 py-6 mb-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-2">
            Ready to apply?
          </p>
          <h2 className="text-white font-extrabold text-xl leading-snug mb-2">
            One message. That&apos;s all it takes.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs mx-auto">
            Tap the button below, mention your certificate, and 4minutes will be in touch within
            24 hours — housing, transport, and start date included.
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
            AgencyCheck · Real data. Real experiences. · Valid certificate required.
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
