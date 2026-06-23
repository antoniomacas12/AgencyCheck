// /apply/johma-logistics-operator
// Logistics Operator at Johma — Losser, NL
// Via recruitment partner: 4 Minutes
// Dark theme, green accents. Premium job page. Apply via WhatsApp.

import type { Metadata } from "next";
import StickyApplyBar    from "@/components/StickyApplyBar";
import DesktopApplyButton from "@/components/DesktopApplyButton";
import ApplicantBadge    from "@/components/ApplicantBadge";
import RelatedJobs       from "@/components/RelatedJobs";
import JobAlertStrip     from "@/components/JobAlertStrip";
import JobFAQ            from "@/components/JobFAQ";
import ShareJobButton    from "@/components/ShareJobButton";
import { jobPostingSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

// ─── SEO ─────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Logistics Operator at Johma — €17.04/hr + Shift Allowance | Losser, NL | AgencyCheck",
  description:
    "Logistics operator vacancy at Johma in Losser, NL. €17.04/hr base + up to 35% night allowance (€23/hr). Single room housing from €136.74/week. Long-term contract. Apply in 60 seconds via WhatsApp.",
  alternates: {
    canonical: "https://agencycheck.io/apply/johma-logistics-operator",
    languages: {
      "en":        "https://agencycheck.io/apply/johma-logistics-operator",
      "x-default": "https://agencycheck.io/apply/johma-logistics-operator",
    },
  },
  openGraph: {
    title: "Logistics Operator at Johma — €17.04/hr | Losser, NL",
    description:
      "€17.04/hr base, 3-shift system, up to €23/hr on nights. Housing from €136.74/week. Long-term position at Johma in Losser. Via 4 Minutes — apply via WhatsApp.",
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────
const WA_BASE   = "https://wa.me/31649210631";
const JOB_TITLE = "Logistics Operator at Johma (Losser, NL)";
const JOB_ID    = "johma-logistics-operator";
const SOURCE    = "johma";

const JOB_SCHEMA = jobPostingSchema({
  title:          "Logistics Operator",
  description:    "Logistics operator at Johma food company in Losser, Netherlands. 3-shift system (morning, afternoon, night). Base salary €17.04/hr with up to 35% night shift allowance. Single room housing available from €136.74/week. Long-term contract, possibility of permanent employment. Via recruitment partner 4 Minutes. EU work authorisation required.",
  datePosted:     "2026-06-01",
  validThrough:   "2026-10-01",
  employmentType: "FULL_TIME",
  city:           "Losser",
  region:         "Overijssel",
  country:        "NL",
  currency:       "EUR",
  minSalary:      17.04,
  maxSalary:      23.00,
  salaryUnit:     "HOUR",
  pageUrl:        `/apply/${JOB_ID}`,
  applyUrl:       `${WA_BASE}?text=${encodeURIComponent(`Hi, I want to apply for: ${JOB_TITLE}`)}`,
});

const FAQ_SCHEMA = faqPageSchema([
  { question: "Do I need to speak Dutch?",     answer: "No. Basic English is sufficient for daily work at Johma. Many colleagues come from EU countries and the recruitment process is handled in English by 4 Minutes." },
  { question: "Is accommodation available?",   answer: "Yes. Single rooms are available at €136.74/week. Couples can share a room at €103.94/week per person. A refundable deposit of €300 is required." },
  { question: "Can couples apply together?",   answer: "Yes, couples are welcome. You can share a room and both work at Johma. Each person applies individually — mention it in your WhatsApp message so we can arrange shared accommodation." },
  { question: "Is transport available?",       answer: "Yes. 4 Minutes offers transportation options to and from the Johma site in Losser. A travel allowance of €0.23/km is also paid." },
  { question: "How quickly can I start?",      answer: "If your documents are ready, you can start within 1–2 weeks. 4 Minutes moves fast — once you apply via WhatsApp, expect a response within 24 hours." },
  { question: "What shift will I work?",       answer: "Johma operates a 3-shift system: morning (06:00–14:00), afternoon (14:00–22:00), and night (22:00–06:00). Shift patterns are discussed at the start. Night shifts pay up to €23/hr (35% allowance)." },
]);

const FAQ_ITEMS = [
  { q: "Do I need to speak Dutch?",     a: "No. Basic English is sufficient for daily work at Johma. Many colleagues are from EU countries and 4 Minutes handles the recruitment in English." },
  { q: "Is accommodation available?",   a: "Yes. Single rooms are available at €136.74/week with weekly cleaning included. Couples can share a room at €103.94/week per person. A €300 refundable deposit is required." },
  { q: "Can couples apply together?",   a: "Yes — couples are welcome. You can share a room and both work at Johma. Mention this when you apply via WhatsApp and we'll arrange the right accommodation." },
  { q: "Is transport to the factory available?", a: "Yes. 4 Minutes offers transport options to and from Johma in Losser. A travel allowance of €0.23/km is also paid on top of your hourly rate." },
  { q: "How quickly can I start?",      a: "If your documents are ready, you can typically start within 1–2 weeks. 4 Minutes responds within 24 hours of your WhatsApp message." },
  { q: "What shift will I be assigned?", a: "Johma runs a 3-shift system: morning (06:00–14:00), afternoon (14:00–22:00), and night (22:00–06:00). Shift assignment is agreed at the start. Night shifts carry a 35% premium — up to €23/hr." },
  { q: "Is this a long-term position?", a: "Yes. This is a long-term position with the possibility of a permanent contract after a qualifying period. Johma is a stable, established food company in the Netherlands." },
  { q: "What documents do I need?",    a: "A valid EU passport or proof of right to work in the Netherlands is required. BSN number is needed before your first payslip. 4 Minutes will guide you through the full checklist when you apply." },
  { q: "What does the 3% end-of-year bonus mean?", a: "Each year, in December, you receive a bonus of 3% of your total annual gross earnings. If you earn €25,000 gross in the year, you receive €750 on top." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function JohmaLogisticsOperatorPage() {
  return (
    <div className="min-h-screen bg-[#0B1F14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
        { name: "Home",                       url: "/" },
        { name: "Now Hiring",                 url: "/apply" },
        { name: "Logistics Operator — Johma", url: `/apply/${JOB_ID}` },
      ])) }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-36 sm:pb-20">

        {/* ── HERO BADGE ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-gray-300">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block" />
            Now Hiring · Losser, NL
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/25 rounded-full px-3 py-1.5 text-[11px] font-bold text-amber-300">
            ⭐ Featured Vacancy
          </span>
        </div>

        {/* ── HERO TITLE ─────────────────────────────────────────── */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 text-white">
          Logistics Operator
        </h1>
        <p className="text-[#22C55E] font-semibold text-base mb-1 tracking-wide">
          Johma · Losser, Netherlands
        </p>
        <p className="text-gray-400 text-sm mb-5">
          Via recruitment partner: <span className="text-gray-200 font-semibold">4 Minutes</span> · Full-time · Long-term
        </p>

        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <ApplicantBadge count={31} hoursAgo={2} />
          <ShareJobButton title="Logistics Operator at Johma — Losser, NL" />
        </div>

        {/* ── SALARY HERO CARD ───────────────────────────────────── */}
        <div className="rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07] px-5 py-5 mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-3">
            💰 Salary
          </p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-extrabold text-white leading-none">€17.04</span>
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
                <p className="text-amber-300 font-extrabold text-base">€22.66<span className="text-gray-500 font-normal text-xs">/hr</span></p>
                <p className="text-amber-400/70 text-[11px] font-bold">+33%</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2.5">
              <div>
                <p className="text-white font-semibold text-sm">Night shift</p>
                <p className="text-gray-500 text-[11px]">00:00 – 06:00</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-300 font-extrabold text-base">€23.00<span className="text-gray-500 font-normal text-xs">/hr</span></p>
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
              { name: "Morning",   hours: "06:00 – 14:00", color: "bg-blue-400",   rate: "€17.04/hr" },
              { name: "Afternoon", hours: "14:00 – 22:00", color: "bg-amber-400",  rate: "€17.04 – €22.66/hr" },
              { name: "Night",     hours: "22:00 – 06:00", color: "bg-emerald-400", rate: "€22.66 – €23.00/hr" },
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
            Shift allowances apply from 18:00. Night premium (+35%) from 00:00.
          </p>
        </div>

        {/* ── HOUSING CARD ───────────────────────────────────────── */}
        <div className="rounded-2xl border border-purple-400/25 bg-purple-400/[0.05] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-300 mb-4">
            🏠 Housing — Available Through 4 Minutes
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

        {/* ── WHY WORK AT JOHMA ──────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Why Work at Johma
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: "💶", title: "Above-average wage", body: "€17.04/hr base — above Dutch minimum wage. Night shifts reach €23/hr." },
              { icon: "📋", title: "Long-term security",  body: "Stable, long-term position with the possibility of a permanent contract." },
              { icon: "🏭", title: "Professional environment", body: "Johma is an established Dutch food company operating to high production standards." },
              { icon: "🤝", title: "3% year-end bonus",  body: "Annual bonus paid in December — 3% of your total gross earnings for the year." },
              { icon: "🚗", title: "Travel reimbursed",  body: "€0.23/km travel allowance paid on top of your hourly rate." },
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

        {/* ── RESPONSIBILITIES ───────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Your Responsibilities
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Scanning products",
              "Stacking pallets",
              "Wrapping pallets",
              "Supplying pallets to automated systems",
              "Troubleshooting palletizer malfunctions",
              "Solving robot malfunctions",
              "Quality control checks",
              "Production line support",
              "Warehouse logistics support",
              "Maintaining a clean workplace",
            ].map((task) => (
              <div key={task} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
                <span className="text-[#22C55E] font-bold text-sm shrink-0">✓</span>
                <span className="text-gray-300 text-[13px]">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CANDIDATE PROFILE ──────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Who This Is For
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              "Warehouse workers",
              "Production workers",
              "Logistics operators",
              "Reachtruck operators",
              "Workers needing housing",
              "Relocating to NL",
            ].map((type) => (
              <div key={type} className="flex items-center gap-2 rounded-lg bg-emerald-400/[0.07] border border-emerald-400/20 px-3 py-2">
                <span className="text-[#22C55E] text-xs shrink-0">✓</span>
                <span className="text-emerald-100 text-[12px] font-medium">{type}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 mt-4">
            Requirements
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Full-time availability (40 hrs/week)",
              "Willing to work all 3 shifts including nights",
              "Technical mindset — basic machine troubleshooting",
              "Attention to quality and detail",
              "Team player, reliable",
              "Long-term motivated — this is not a short-term role",
              "EU work authorisation required",
            ].map((req) => (
              <li key={req} className="flex items-center gap-2.5">
                <span className="text-[#22C55E] font-bold text-sm shrink-0">✓</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* ── BENEFITS STRIP ─────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
            Full Benefits Package
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "💶", text: "€17.04/hr base salary" },
              { icon: "🌙", text: "Up to €23/hr nights" },
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
            production of salads and ready-to-eat food products, Johma operates modern, automated
            production lines requiring skilled and reliable logistics operators. The company offers
            stable employment with clear career paths and a professional working environment.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mt-2">
            As a long-standing employer in the region, Johma values quality and consistency — which
            is why they work with trusted recruitment partners like 4 Minutes to find the right
            candidates.
          </p>
        </div>

        {/* ── ABOUT 4 MINUTES ────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-5 py-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            About 4 Minutes — Your Recruitment Partner
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            4 Minutes is a specialist recruitment agency focused on placing workers in logistics,
            production, and warehouse roles across the Netherlands. They handle your onboarding
            end-to-end — from your first WhatsApp message to your first day at Johma.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Fast response — typically within 24 hours",
              "Housing arranged before you arrive",
              "Transport options to Johma organised",
              "Document guidance included",
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
            Tap the button below, send your message, and 4 Minutes will be in touch within 24 hours
            to discuss next steps — housing, transport, and start date included.
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
