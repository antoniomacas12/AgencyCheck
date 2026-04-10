import type { Metadata } from "next";
import Link from "next/link";
import { WA_LINK } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "OTTO Workforce Review Netherlands (2026) – Salary, Housing & Real Worker Experiences",
  description:
    "OTTO Workforce review Netherlands 2026. Workers keep €310–€370/week after housing (€95/wk), tax and transport. Real experiences on salary, accommodation quality, and how OTTO compares to Tempo-Team.",
  alternates: {
    canonical: "https://agencycheck.io/otto-workforce-review",
  },
  openGraph: {
    title: "OTTO Workforce Review Netherlands (2026) – Salary, Housing & Real Worker Experiences",
    description:
      "What do workers actually earn at OTTO Workforce? Is the housing decent? How do they compare to Tempo Team? Real experiences, not agency marketing.",
    images: [{ url: "https://agencycheck.io/logo.png", width: 512, height: 512, alt: "AgencyCheck" }],
  },
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much do you earn at OTTO Workforce Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "At minimum wage (WML €14.71/hr, 40h/week) your gross is €588/week. After Dutch income tax, agency housing (~€95/wk), transport, and insurance, most workers keep €310–€370/week net. Monthly that's roughly €1,340–€1,600 in hand, depending on deductions and overtime.",
      },
    },
    {
      "@type": "Question",
      name: "Does OTTO Workforce provide accommodation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, OTTO Workforce offers housing for international workers. Quality varies significantly by location and branch — some locations are well-maintained, others are overcrowded. Housing is deducted directly from salary, typically €80–€113/week.",
      },
    },
    {
      "@type": "Question",
      name: "Is OTTO Workforce better than Tempo Team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on location and role. Tempo Team generally offers slightly higher net salaries in cities like Almere and Amsterdam. OTTO Workforce has a larger job volume and is known for fast placement. Neither is universally better — the coordinator and specific branch matter a lot.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly can you start working through OTTO Workforce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OTTO Workforce is known for fast placement — often within 1–7 days if housing is available and paperwork is in order. It's one of the faster agencies in the Netherlands for getting international workers started.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",     item: "https://agencycheck.io/" },
    { "@type": "ListItem", position: 2, name: "Agencies", item: "https://agencycheck.io/agencies" },
    { "@type": "ListItem", position: 3, name: "OTTO Workforce Review", item: "https://agencycheck.io/otto-workforce-review" },
  ],
};

// ─── WhatsApp icon (inline SVG) ───────────────────────────────────────────────

function WAIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// ─── Reusable WhatsApp CTA block ──────────────────────────────────────────────

function WhatsAppCTA({ variant = "default" }: { variant?: "default" | "compact" | "closing" }) {
  if (variant === "compact") {
    return (
      <div className="my-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl bg-[#0d1f14] border border-[#25D366]/20 px-5 py-4">
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.97] transition-all px-5 py-3 text-sm font-black text-white shrink-0"
          style={{ boxShadow: "0 4px 18px rgba(37,211,102,0.28)" }}
        >
          <WAIcon className="w-4 h-4" />
          Apply on WhatsApp
        </a>
        <p className="text-sm text-gray-300 leading-snug">
          Looking for jobs in the Netherlands with accommodation?{" "}
          <span className="text-white font-medium">Message us directly — we reply fast.</span>
        </p>
      </div>
    );
  }

  if (variant === "closing") {
    return (
      <section className="mt-12 rounded-2xl bg-[#0d1f14] border border-[#25D366]/[0.18] p-7 sm:p-9 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366]/20 mb-4">
          <WAIcon className="w-6 h-6 text-[#25D366]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
          Looking for work in the Netherlands?
        </h2>
        <p className="text-gray-400 text-base mb-6 max-w-md mx-auto leading-relaxed">
          Tell us your job preference, location, and when you can start — we&rsquo;ll match you with verified agencies and real openings.
        </p>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.97] transition-all px-8 py-4 text-base font-black text-white mb-4"
          style={{ boxShadow: "0 8px 32px rgba(37,211,102,0.30)" }}
        >
          <WAIcon className="w-5 h-5" />
          Send a message on WhatsApp
        </a>
        <p className="text-[12px] text-gray-500">+31 6 49 21 06 31 · We reply as fast as possible</p>
      </section>
    );
  }

  // default — hero inline CTA
  return (
    <div className="my-7 rounded-2xl bg-[#0d1f14] border border-[#25D366]/[0.20] p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black uppercase tracking-widest text-[#25D366] mb-1">Fast apply</p>
          <p className="text-white font-bold text-lg leading-snug mb-1">
            Apply via WhatsApp — we help you find jobs with accommodation in the Netherlands.
          </p>
          <p className="text-gray-400 text-sm">
            Send your location and job preference. We match you with real openings fast.
          </p>
        </div>
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.97] transition-all px-6 py-3.5 text-[15px] font-black text-white shrink-0 w-full sm:w-auto"
          style={{ boxShadow: "0 6px 24px rgba(37,211,102,0.28)" }}
        >
          <WAIcon className="w-4 h-4" />
          Chat on WhatsApp
        </a>
      </div>
      <p className="text-[11px] text-gray-500 mt-3">+31 6 49 21 06 31 · Fastest way to apply · We reply as fast as possible</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OttoWorkforceReviewPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span aria-hidden>›</span>
          <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
          <span aria-hidden>›</span>
          <span className="text-gray-600 font-medium">OTTO Workforce Review</span>
        </nav>

        {/* ── H1 + intro ──────────────────────────────────────────────────── */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4">
          OTTO Workforce Review Netherlands (2026) – Salary, Housing &amp; Real Worker Experiences
        </h1>

        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { bg: "bg-blue-50 text-blue-700 border-blue-100",   label: "Updated 2026"          },
            { bg: "bg-green-50 text-green-700 border-green-100", label: "🏠 Housing available"   },
            { bg: "bg-amber-50 text-amber-700 border-amber-100", label: "ABU certified"          },
          ].map((b) => (
            <span key={b.label} className={`text-xs font-semibold border rounded-full px-3 py-1 ${b.bg}`}>{b.label}</span>
          ))}
        </div>

        <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-3">
          OTTO Workforce is one of the largest employment agencies in the Netherlands, placing tens of thousands of international workers in logistics, warehouse, food production, and greenhouse roles every year. They operate across most of the country and are well-known among workers from Poland, Romania, Bulgaria, and other EU countries.
        </p>
        <p className="text-gray-600 text-base leading-relaxed mb-1">
          But like every large agency, experiences vary a lot — and they vary depending on location, coordinator, and the specific branch you end up with. This page collects real worker reports so you know what to expect before you sign anything.
        </p>

        {/* Hero WhatsApp CTA */}
        <WhatsAppCTA variant="default" />

        {/* ── Salary ─────────────────────────────────────────────────────── */}
        <section className="mb-10" id="salary">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">
            What Do You Actually Earn at OTTO Workforce?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            This is the question most people ask first — and the honest answer is: it depends, but you can calculate it yourself before you arrive.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            At the Dutch minimum wage (WML, €14.71/hour) for a standard 40-hour week, your gross pay is €588/week. After Dutch income tax (loonheffing), agency housing, transport, and health insurance deductions, most workers keep roughly <strong className="text-gray-900">€310–€370 per week</strong> — or around <strong className="text-gray-900">€1,340–€1,600/month net</strong>.
          </p>

          {/* Breakdown table */}
          <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
            <div className="bg-gray-900 px-5 py-3">
              <p className="text-xs font-black uppercase tracking-widest text-gray-300">Weekly payslip — WML warehouse role (40h)</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { label: "Gross pay (WML €14.71 × 40h)",       value: "+€588", accent: "text-emerald-700" },
                { label: "Income tax (loonheffing)",            value: "−€63",  accent: "text-red-600"    },
                { label: "Agency housing (SNF standard)",       value: "−€95",  accent: "text-red-600"    },
                { label: "Health insurance",                    value: "−€35",  accent: "text-red-600"    },
                { label: "Transport (agency bus)",              value: "−€25",  accent: "text-red-600"    },
                { label: "Admin fees",                         value: "−€25",  accent: "text-red-600"    },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-600">{row.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${row.accent}`}>{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50">
                <span className="text-sm font-black text-gray-900">💶 You keep</span>
                <span className="text-lg font-black text-emerald-700 tabular-nums">€345</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-2">
            A few things affect the real number:
          </p>
          <ul className="list-none space-y-2 mb-4">
            {[
              { icon: "📍", text: "Location matters. Wages in logistics hubs like Venlo or Schiphol can be 5–10% higher than regional warehouses." },
              { icon: "🏭", text: "Job type changes it. Night shifts and weekend premiums add €20–€80/week extra. Greenhouse work often pays slightly less." },
              { icon: "⏱", text: "Hours. If you're placed part-time or hours fluctuate week to week, your take-home drops fast." },
              { icon: "📋", text: "Phase A vs Phase B. After 26 weeks in the same role, you move to Phase B — you get paid holidays, better sick pay, and more stability." },
            ].map((item) => (
              <li key={item.icon} className="flex gap-3">
                <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                <span className="text-gray-600 text-sm leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            💡 Always ask for a sample payslip (loonstrook) before you sign. If they can&apos;t show you one, that&apos;s a red flag.
          </p>
        </section>

        {/* ── Housing ────────────────────────────────────────────────────── */}
        <section className="mb-10" id="housing">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">
            Housing — Decent or Overcrowded?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            OTTO Workforce does offer accommodation for international workers, and they charge €80–€113/week (deducted from your salary). But whether the housing is actually good depends entirely on which location you end up in.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            Some OTTO properties are fine — shared rooms with 2–3 people, basic but clean. Others have been reported as overcrowded with 4–6 people in a room, poor heating in winter, and slow responses to maintenance issues. There&apos;s no universal OTTO housing experience.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Before you accept placement, it&apos;s worth asking specifically: how many people per room? Is SNF certification active at that address? Can you visit before committing?
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {[
              {
                title: "When housing is good",
                color: "border-green-200 bg-green-50",
                titleColor: "text-green-800",
                items: [
                  "2–3 people per room",
                  "Clean shared bathroom/kitchen",
                  "Close to the work location",
                  "Transport included or nearby bus stop",
                ],
                icon: "✅",
              },
              {
                title: "When housing is a problem",
                color: "border-red-200 bg-red-50",
                titleColor: "text-red-800",
                items: [
                  "4–6 people per room (overcrowded)",
                  "Slow response to maintenance requests",
                  "Extra charges for bedding/cleaning",
                  "Distance from work makes transport costs add up",
                ],
                icon: "⚠️",
              },
            ].map((card) => (
              <div key={card.title} className={`rounded-xl border p-5 ${card.color}`}>
                <p className={`text-sm font-bold mb-3 flex items-center gap-1.5 ${card.titleColor}`}>
                  <span>{card.icon}</span> {card.title}
                </p>
                <ul className="space-y-1.5">
                  {card.items.map((item) => (
                    <li key={item} className="text-sm text-gray-700 flex gap-2">
                      <span className="mt-0.5 shrink-0 text-gray-400">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            The legal maximum for SNF-certified shared accommodation is <strong>€113.50/week</strong>. If OTTO charges more than this for certified housing, that&apos;s illegal — you can report it to SNF or Inspectie SZW.
          </p>
        </section>

        {/* Compact CTA mid-page */}
        <WhatsAppCTA variant="compact" />

        {/* ── Real Worker Experiences ─────────────────────────────────────── */}
        <section className="mb-10" id="reviews">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">
            Real Worker Experiences
          </h2>
          <p className="text-gray-600 leading-relaxed mb-5">
            These are summaries based on real worker reports collected through AgencyCheck. Names have been changed for privacy, but the experiences are genuine.
          </p>

          <div className="space-y-4">
            {[
              {
                quote: "OTTO pays less than Tempo Team in Almere. I moved to Tempo Team after 3 months and got €30 more per week for basically the same warehouse work. Nobody told me to compare — I just found out by accident.",
                name: "Bartosz M.",
                detail: "Warehouse worker, Almere · Worked OTTO 2024",
                stars: 3,
              },
              {
                quote: "My experience depended 100% on my coordinator. First one was useless, never answered messages. When they changed coordinator, everything got better. Same agency, completely different experience.",
                name: "Alina D.",
                detail: "Production line, Venlo · Worked OTTO 2025",
                stars: 4,
              },
              {
                quote: "Accommodation was actually not bad at all. Some guys I spoke to had horror stories, but my location had 2 people per room and the kitchen was shared between 6. Not luxury, but acceptable.",
                name: "Marius C.",
                detail: "Greenhouse, Westland · Worked OTTO 2024",
                stars: 4,
              },
              {
                quote: "They started me in 4 days. I arrived Monday, first day of work was Friday. That's fast. The pay wasn't the best but I needed to start immediately and OTTO made that happen.",
                name: "Dawid K.",
                detail: "Logistics, Rotterdam · Worked OTTO 2025",
                stars: 3,
              },
            ].map((review) => (
              <div key={review.name} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-0.5 mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} viewBox="0 0 20 20" fill="currentColor"
                      className={`w-3.5 h-3.5 ${s <= review.stars ? "text-amber-400" : "text-gray-200"}`}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3 italic">&ldquo;{review.quote}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{review.name}</p>
                    <p className="text-[11px] text-gray-400">{review.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pros and Cons ───────────────────────────────────────────────── */}
        <section className="mb-10" id="pros-cons">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">
            Pros and Cons — Honest Summary
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <p className="text-sm font-bold text-green-800 mb-3">✅ What works well</p>
              <ul className="space-y-2.5">
                {[
                  { title: "Large agency, lots of jobs", body: "They have vacancies across the whole country. If you're flexible on location, you'll find something." },
                  { title: "Fast placement", body: "One of the faster agencies for getting you started — often within a week of arrival." },
                  { title: "Accommodation available", body: "Not always perfect, but they do have housing options for most placements." },
                  { title: "ABU-certified", body: "Registered and audited, which gives you basic legal protection on pay and housing." },
                ].map((item) => (
                  <li key={item.title} className="flex gap-2.5">
                    <span className="text-green-600 mt-0.5 shrink-0 font-bold text-sm">+</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-600 leading-snug mt-0.5">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-bold text-red-800 mb-3">⚠️ What to watch out for</p>
              <ul className="space-y-2.5">
                {[
                  { title: "Salary inconsistency", body: "Pay varies by location and role. Don't assume you'll get the same rate as a friend in a different city." },
                  { title: "Housing quality is a lottery", body: "Some locations are fine. Others are overcrowded. Ask specifics before you commit." },
                  { title: "It depends on your coordinator", body: "The quality of your day-to-day experience often comes down to one person. This can vary a lot." },
                  { title: "Not always the highest pay", body: "Larger agencies like Tempo Team sometimes offer better rates in specific locations and sectors." },
                ].map((item) => (
                  <li key={item.title} className="flex gap-2.5">
                    <span className="text-red-500 mt-0.5 shrink-0 font-bold text-sm">−</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-600 leading-snug mt-0.5">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── OTTO vs Tempo Team ──────────────────────────────────────────── */}
        <section className="mb-10" id="comparison">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">
            OTTO Workforce vs Tempo Team — Quick Comparison
          </h2>
          <p className="text-gray-600 leading-relaxed mb-5">
            Both are large, ABU-certified agencies that work a lot with EU migrant workers. Here&apos;s how they actually differ:
          </p>

          <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
            <div className="hidden sm:grid grid-cols-3 bg-gray-50 border-b border-gray-200 px-5 py-3 text-xs font-black uppercase tracking-widest text-gray-400">
              <span>Factor</span>
              <span className="text-center">OTTO Workforce</span>
              <span className="text-center">Tempo Team</span>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { factor: "Net salary (WML warehouse)",   otto: "€310–€360/wk",      tempo: "€330–€380/wk" },
                { factor: "Salary consistency",           otto: "Varies by location", tempo: "More consistent" },
                { factor: "Placement speed",              otto: "1–5 days",           tempo: "3–7 days"       },
                { factor: "Housing availability",         otto: "Good",               tempo: "Good"           },
                { factor: "Housing quality",              otto: "Hit or miss",        tempo: "Slightly better on average" },
                { factor: "Coordinator quality",         otto: "Very inconsistent",  tempo: "More consistent" },
                { factor: "ABU certified",                otto: "✅ Yes",              tempo: "✅ Yes"          },
              ].map((row) => (
                <div key={row.factor} className="grid grid-cols-1 sm:grid-cols-3 gap-1 px-5 py-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide sm:normal-case sm:font-medium sm:text-sm sm:text-gray-600">{row.factor}</span>
                  <span className="text-sm text-gray-700 sm:text-center">{row.otto}</span>
                  <span className="text-sm text-gray-700 sm:text-center">{row.tempo}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            Bottom line: <strong>Tempo Team edges out OTTO on salary in some cities</strong>, particularly Amsterdam, Almere, and Utrecht. OTTO tends to be slightly faster at placement and has a higher total job volume. If you need to start immediately, OTTO is often the better choice. If you can wait a few days and want to negotiate a better rate, Tempo Team is worth checking.
          </p>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section className="mb-10" id="faq">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How much do you earn at OTTO Workforce Netherlands?",
                a: "At minimum wage (€14.71/hr, 40h/week) your gross is €588/week. After Dutch income tax, housing (~€95/wk), transport, and insurance, most workers take home €310–€370/week — roughly €1,340–€1,600/month. Overtime and night shifts can add another €20–€80/week.",
              },
              {
                q: "Does OTTO Workforce provide accommodation?",
                a: "Yes, they offer housing for international workers. Cost is typically €80–€113/week deducted from salary. Quality varies significantly by location — ask for specifics (people per room, address, SNF certification) before you accept a placement.",
              },
              {
                q: "Is OTTO Workforce better than Tempo Team?",
                a: "Neither is universally better. OTTO places workers faster and has more total volume. Tempo Team tends to offer slightly higher net salaries in major cities. The quality of your specific branch and coordinator matters more than the brand name.",
              },
              {
                q: "How do I start working through OTTO Workforce?",
                a: "You can apply directly through their website, or contact an agency recruiter. You'll need a valid EU ID or passport, BSN number (or start the process for one), and a Dutch bank account. OTTO can sometimes help with the BSN process if you're relocating.",
              },
              {
                q: "What should I check before signing a contract with OTTO?",
                a: "Ask for a sample payslip showing all deductions, confirm the housing address and number of people per room, check whether the housing is SNF certified, and make sure your contract specifies your hourly rate, phase (A or B), and notice period.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="font-bold text-gray-900 text-sm mb-2">{item.q}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Internal links ──────────────────────────────────────────────── */}
        <section className="mb-10 rounded-xl bg-gray-50 border border-gray-200 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">More useful reads</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/agencies",                          label: "Compare all agencies →" },
              { href: "/jobs-with-accommodation",           label: "Jobs with accommodation in Netherlands →" },
              { href: "/tools/payslip-checker",             label: "Check if your payslip is correct →" },
              { href: "/tools/real-income-calculator",      label: "Calculate your real net salary →" },
              { href: "/agencies-with-housing",             label: "Best agencies with housing →" },
              { href: "/reviews",                           label: "Read all worker reviews →" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-brand-600 hover:text-brand-700 hover:underline font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Closing CTA ─────────────────────────────────────────────────── */}
        <WhatsAppCTA variant="closing" />

      </div>
    </div>
  );
}
