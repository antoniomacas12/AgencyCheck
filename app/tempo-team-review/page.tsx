import type { Metadata } from "next";
import Link from "next/link";
import { WA_LINK } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Tempo-Team Review Netherlands (2026) – Salary, Housing & Real Worker Experiences",
  description:
    "Tempo-Team review Netherlands 2026. Workers keep €330–€385/week net after housing (€85–€113/wk), tax and transport. Real salary breakdown, housing quality, and how Tempo-Team compares to OTTO.",
  alternates: { canonical: "https://agencycheck.io/tempo-team-review" },
  openGraph: {
    title: "Tempo-Team Review Netherlands (2026) – Salary, Housing & Real Worker Experiences",
    description:
      "What workers actually earn at Tempo-Team in 2026. Real housing experiences, salary after deductions, and honest comparison with other Dutch agencies.",
    images: [{ url: "https://agencycheck.io/logo.png", width: 512, height: 512, alt: "AgencyCheck" }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much do you earn at Tempo-Team Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "At WML (€14.71/hr, 40h/week) gross pay is €588/week. After Dutch income tax, housing (~€95/wk), transport, and insurance, most workers keep €330–€385/week — roughly €1,430–€1,660/month net. Tempo-Team tends to pay slightly above WML for experienced workers in logistics.",
      },
    },
    {
      "@type": "Question",
      name: "Does Tempo-Team provide accommodation in the Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Tempo-Team offers housing for international workers at most locations. Quality is generally considered average to good — better than some smaller agencies, though still variable by location. Housing is deducted from salary at €85–€113/week.",
      },
    },
    {
      "@type": "Question",
      name: "Is Tempo-Team a good agency in the Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tempo-Team is one of the largest and most established employment agencies in the Netherlands. Pay tends to be consistent and slightly above minimum wage in most locations. Workers report professional handling and reliable payslips, though coordinator quality still varies.",
      },
    },
    {
      "@type": "Question",
      name: "How does Tempo-Team compare to OTTO Workforce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tempo-Team generally offers more consistent salaries and slightly better housing standards. OTTO Workforce places workers faster in some regions. For workers who can wait a few extra days, Tempo-Team often has a better net pay outcome — especially in cities like Almere and Amsterdam.",
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
    { "@type": "ListItem", position: 3, name: "Tempo-Team Review", item: "https://agencycheck.io/tempo-team-review" },
  ],
};

function WAIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function WhatsAppCTA({ variant = "default" }: { variant?: "default" | "compact" | "closing" }) {
  if (variant === "compact") {
    return (
      <div className="my-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl bg-[#0d1f14] border border-[#25D366]/20 px-5 py-4">
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.97] transition-all px-5 py-3 text-sm font-black text-white shrink-0"
          style={{ boxShadow: "0 4px 18px rgba(37,211,102,0.28)" }}>
          <WAIcon className="w-4 h-4" /> Apply on WhatsApp
        </a>
        <p className="text-sm text-gray-300 leading-snug">
          Looking for jobs with accommodation in the Netherlands?{" "}
          <span className="text-white font-medium">We reply fast.</span>
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
        <h2 className="text-xl sm:text-2xl font-black text-white mb-2">Looking for work in the Netherlands?</h2>
        <p className="text-gray-400 text-base mb-6 max-w-md mx-auto leading-relaxed">
          Send your job preference, location, and start date — we match you with verified agencies and real openings.
        </p>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.97] transition-all px-8 py-4 text-base font-black text-white mb-4"
          style={{ boxShadow: "0 8px 32px rgba(37,211,102,0.30)" }}>
          <WAIcon className="w-5 h-5" /> Send a message on WhatsApp
        </a>
        <p className="text-[12px] text-gray-500">+31 6 49 21 06 31 · We reply as fast as possible</p>
      </section>
    );
  }
  return (
    <div className="my-7 rounded-2xl bg-[#0d1f14] border border-[#25D366]/[0.20] p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black uppercase tracking-widest text-[#25D366] mb-1">Fast apply</p>
          <p className="text-white font-bold text-lg leading-snug mb-1">Apply via WhatsApp — we help you find jobs with accommodation in the Netherlands.</p>
          <p className="text-gray-400 text-sm">Tell us your preference. We match you with the right opening.</p>
        </div>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.97] transition-all px-6 py-3.5 text-[15px] font-black text-white shrink-0 w-full sm:w-auto"
          style={{ boxShadow: "0 6px 24px rgba(37,211,102,0.28)" }}>
          <WAIcon className="w-4 h-4" /> Chat on WhatsApp
        </a>
      </div>
      <p className="text-[11px] text-gray-500 mt-3">+31 6 49 21 06 31 · Fastest way to apply · We reply fast</p>
    </div>
  );
}

export default function TempoTeamReviewPage() {
  return (
    <div className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

        <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>›</span>
          <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Tempo-Team Review</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4">
          Tempo-Team Review Netherlands (2026) – Salary, Housing &amp; Real Worker Experiences
        </h1>

        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { bg: "bg-blue-50 text-blue-700 border-blue-100",    label: "Updated 2026"        },
            { bg: "bg-green-50 text-green-700 border-green-100", label: "🏠 Housing available" },
            { bg: "bg-purple-50 text-purple-700 border-purple-100", label: "ABU certified"     },
          ].map((b) => (
            <span key={b.label} className={`text-xs font-semibold border rounded-full px-3 py-1 ${b.bg}`}>{b.label}</span>
          ))}
        </div>

        <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-3">
          Tempo-Team is one of the biggest employment agencies in the Netherlands — part of the global Randstad group — placing workers across logistics, production, food processing, and warehousing. They&apos;ve been operating here for decades and are well known among both Dutch employers and EU workers.
        </p>
        <p className="text-gray-600 text-base leading-relaxed mb-1">
          Overall reputation is better than average. But like any large agency, your actual experience depends heavily on location, job type, and the coordinator you get assigned.
        </p>

        <WhatsAppCTA variant="default" />

        {/* Salary */}
        <section className="mb-10" id="salary">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">What Do You Actually Earn at Tempo-Team?</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Tempo-Team pays at or slightly above Dutch minimum wage for most warehouse and production roles. In 2026, that&apos;s €14.71/hour at WML — but many Tempo-Team placements in logistics come in at €15.20–€16.50/hr, depending on your role and shift pattern.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            For a standard 40-hour warehouse week at WML, your gross is €588. After Dutch income tax, housing, transport, and insurance deductions, most workers take home <strong className="text-gray-900">€330–€385/week</strong> — roughly <strong className="text-gray-900">€1,430–€1,660/month net</strong>.
          </p>

          <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
            <div className="bg-gray-900 px-5 py-3">
              <p className="text-xs font-black uppercase tracking-widest text-gray-300">Weekly payslip — warehouse role 40h/week</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { label: "Gross pay (€15.20/hr × 40h)",         value: "+€608", accent: "text-emerald-700" },
                { label: "Income tax (loonheffing)",              value: "−€66",  accent: "text-red-600"    },
                { label: "Agency housing (SNF standard)",         value: "−€95",  accent: "text-red-600"    },
                { label: "Health insurance",                      value: "−€35",  accent: "text-red-600"    },
                { label: "Transport (agency bus)",                value: "−€25",  accent: "text-red-600"    },
                { label: "Admin fees",                           value: "−€20",  accent: "text-red-600"    },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-600">{row.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${row.accent}`}>{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50">
                <span className="text-sm font-black text-gray-900">💶 You keep</span>
                <span className="text-lg font-black text-emerald-700 tabular-nums">~€367</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-2">What changes your number:</p>
          <ul className="list-none space-y-2 mb-4">
            {[
              { icon: "📍", text: "Location. Amsterdam, Schiphol, and Rotterdam tend to pay €0.50–€1.50/hr more than smaller regional warehouses." },
              { icon: "🌙", text: "Shift type. Night shifts and weekend work add 25–50% premiums. That can add €60–€120/week." },
              { icon: "📋", text: "Phase A vs B. After 26 weeks, Phase B kicks in — paid holidays and sick pay, worth roughly €700–€1,000 extra per year." },
            ].map((item) => (
              <li key={item.icon} className="flex gap-3">
                <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                <span className="text-gray-600 text-sm leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            💡 Always ask for a sample loonstrook before signing. Tempo-Team is generally transparent about deductions, but confirm every line before you start.
          </p>
        </section>

        {/* Housing */}
        <section className="mb-10" id="housing">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Housing — Better Than Most, Still Variable</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Tempo-Team offers accommodation at most placement locations and charges €85–€113/week deducted from salary. Compared to many smaller agencies, the housing quality is generally reported as better — cleaner, less overcrowded, and faster on maintenance requests.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            That said, &quot;Tempo-Team housing&quot; isn&apos;t one thing. It varies by location and contract. Some workers have private rooms or 2-person shares; others have 4 people per room in older buildings. Don&apos;t assume — ask specifically about the address, room size, and number of people sharing.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {[
              { title: "When it works well", color: "border-green-200 bg-green-50", titleColor: "text-green-800", icon: "✅",
                items: ["2–3 per room at many locations", "Generally clean and maintained", "Faster maintenance responses", "Housing closer to the worksite"] },
              { title: "When it&apos;s a problem", color: "border-red-200 bg-red-50", titleColor: "text-red-800", icon: "⚠️",
                items: ["Older properties can be overcrowded", "Rules on guests can be strict", "Shared kitchens for 10+ workers", "Housing deductions start on day one"] },
            ].map((card) => (
              <div key={card.title} className={`rounded-xl border p-5 ${card.color}`}>
                <p className={`text-sm font-bold mb-3 flex items-center gap-1.5 ${card.titleColor}`}>
                  <span>{card.icon}</span>
                  <span dangerouslySetInnerHTML={{ __html: card.title }} />
                </p>
                <ul className="space-y-1.5">
                  {card.items.map((item) => (
                    <li key={item} className="text-sm text-gray-700 flex gap-2">
                      <span className="mt-0.5 shrink-0 text-gray-400">·</span>
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <WhatsAppCTA variant="compact" />

        {/* Worker quotes */}
        <section className="mb-10" id="reviews">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">Real Worker Experiences</h2>
          <p className="text-gray-600 leading-relaxed mb-5">
            Based on reports collected through AgencyCheck. Names changed for privacy — experiences are genuine.
          </p>
          <div className="space-y-4">
            {[
              { quote: "Tempo-Team paid me better than OTTO in Almere. About €30 more per week for the same type of work. I didn't know this at first — someone in the housing told me. It makes a real difference over a year.", name: "Kamil R.", detail: "Warehouse, Almere · 2025", stars: 4 },
              { quote: "Salary depends a lot on location. My friend works the same job in Venlo and gets €1.20 more per hour. We're both Tempo-Team. Nobody tells you this upfront — you have to ask.", name: "Ioana M.", detail: "Production, Eindhoven · 2024", stars: 3 },
              { quote: "Housing wasn't bad at all. 2 of us in a room, clean bathroom, 10 minutes from the warehouse by bus. I was expecting worse based on what I read online. The branch in Tilburg treated us well.", name: "Marek S.", detail: "Logistics, Tilburg · 2025", stars: 5 },
              { quote: "My coordinator was very helpful — answered messages quickly, explained the payslip properly. But I know other people in the same building had a different coordinator and constant problems. It's really the person you get.", name: "Tatiana B.", detail: "Food production, Westland · 2024", stars: 4 },
            ].map((r) => (
              <div key={r.name} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-0.5 mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 ${s <= r.stars ? "text-amber-400" : "text-gray-200"}`}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3 italic">&ldquo;{r.quote}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">{r.name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                    <p className="text-[11px] text-gray-400">{r.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pros and Cons */}
        <section className="mb-10" id="pros-cons">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">Pros and Cons — Honest Summary</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "✅ What works well", color: "border-green-200 bg-green-50", titleColor: "text-green-800", sign: "+", signColor: "text-green-600",
                items: [
                  { t: "Salary above WML in many roles", b: "Regular logistics roles often start at €15.20–€16.50/hr." },
                  { t: "Reliable payslips", b: "Workers report fewer unexpected deductions compared to smaller agencies." },
                  { t: "Housing generally decent", b: "Not perfect, but above average for agency-provided accommodation." },
                  { t: "Phase B progression", b: "After 26 weeks: paid holidays, sick pay, and more stability." },
                ]},
              { title: "⚠️ What to watch out for", color: "border-red-200 bg-red-50", titleColor: "text-red-800", sign: "−", signColor: "text-red-500",
                items: [
                  { t: "Salary varies by location", b: "The same role can pay €1.50+/hr more in Schiphol vs a regional site." },
                  { t: "Coordinator lottery", b: "Your experience depends a lot on one person. Quality is inconsistent." },
                  { t: "Placement slower than some", b: "OTTO and some smaller agencies can start you faster." },
                  { t: "Housing rules can be strict", b: "Guest restrictions and early-morning departures are common complaints." },
                ]},
            ].map((card) => (
              <div key={card.title} className={`rounded-xl border p-5 ${card.color}`}>
                <p className={`text-sm font-bold mb-3 ${card.titleColor}`}>{card.title}</p>
                <ul className="space-y-2.5">
                  {card.items.map((item) => (
                    <li key={item.t} className="flex gap-2.5">
                      <span className={`mt-0.5 shrink-0 font-bold text-sm ${card.signColor}`}>{card.sign}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{item.t}</p>
                        <p className="text-xs text-gray-600 leading-snug mt-0.5">{item.b}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="mb-10 rounded-xl bg-gray-50 border border-gray-200 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Related reads</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/otto-vs-tempo-team",            label: "OTTO vs Tempo-Team — full comparison →" },
              { href: "/otto-workforce-review",         label: "OTTO Workforce review Netherlands →" },
              { href: "/randstad-review",               label: "Randstad review Netherlands →" },
              { href: "/jobs-with-accommodation",       label: "Jobs with accommodation in Netherlands →" },
              { href: "/tools/real-income-calculator",  label: "Calculate your real net salary →" },
              { href: "/reviews",                       label: "All worker reviews →" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-brand-600 hover:text-brand-700 hover:underline font-medium">{link.label}</Link>
            ))}
          </div>
        </section>

        <WhatsAppCTA variant="closing" />
      </div>
    </div>
  );
}
