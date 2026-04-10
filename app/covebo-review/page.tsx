import type { Metadata } from "next";
import Link from "next/link";
import { WA_LINK } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Covebo Review Netherlands (2026) – Salary, Housing & Real Worker Experiences",
  description:
    "Covebo review Netherlands 2026. Production workers keep €320–€383/week net after housing (€88–€110/wk), tax and transport. Real salary breakdown, accommodation quality, and worker experiences.",
  alternates: { canonical: "https://agencycheck.io/covebo-review" },
  openGraph: {
    title: "Covebo Review Netherlands (2026) – Salary, Housing & Real Worker Experiences",
    description:
      "Real worker experiences at Covebo in 2026. Salary after deductions, housing quality, pros and cons — based on actual reports, not agency marketing.",
    images: [{ url: "https://agencycheck.io/logo.png", width: 512, height: 512, alt: "AgencyCheck" }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much do you earn at Covebo Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Covebo pays at or above WML (€14.71/hr in 2026). For 40h/week, gross pay is €588+/week. After Dutch income tax, housing (~€92–€110/wk), transport, and insurance, most workers keep €320–€375/week net. Covebo often runs placements at production sites paying €15.00–€16.00/hr for experienced workers.",
      },
    },
    {
      "@type": "Question",
      name: "Does Covebo provide accommodation in the Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Covebo provides housing for international workers at most locations. Accommodation is deducted from salary at €88–€110/week. Workers generally report housing as acceptable to good — Covebo is known for tighter occupancy standards at some locations.",
      },
    },
    {
      "@type": "Question",
      name: "Is Covebo a good agency to work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Covebo has a solid reputation for food production, logistics, and manufacturing placements. Workers report consistent pay and generally decent housing. Like all agencies, coordinator quality varies. Covebo is ABU-certified and generally considered reliable compared to smaller operators.",
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
    { "@type": "ListItem", position: 3, name: "Covebo Review", item: "https://agencycheck.io/covebo-review" },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Covebo Review Netherlands (2026) – Salary, Housing & Real Worker Experiences",
  datePublished: "2026-03-28",
  dateModified:  "2026-04-10",
  author: {
    "@type": "Organization",
    name: "AgencyCheck",
    url:  "https://agencycheck.io",
  },
  publisher: {
    "@type": "Organization",
    name: "AgencyCheck",
    url:  "https://agencycheck.io",
    logo: { "@type": "ImageObject", url: "https://agencycheck.io/logo.png" },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":  "https://agencycheck.io/covebo-review",
  },
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
          <span className="text-white font-medium">Message us — we reply fast.</span>
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
          Tell us your job preference, location, and when you can start. We match you with real openings fast.
        </p>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.97] transition-all px-8 py-4 text-base font-black text-white mb-4"
          style={{ boxShadow: "0 8px 32px rgba(37,211,102,0.30)" }}>
          <WAIcon className="w-5 h-5" /> Message on WhatsApp now
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
          <p className="text-gray-400 text-sm">Send your location and preference. We find your match.</p>
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

export default function CoveboReviewPage() {
  return (
    <div className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

        <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>›</span>
          <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Covebo Review</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4">
          Covebo Review Netherlands (2026) – Salary, Housing &amp; Real Worker Experiences
        </h1>

        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { bg: "bg-blue-50 text-blue-700 border-blue-100",    label: "Last updated: Apr 2026" },
            { bg: "bg-green-50 text-green-700 border-green-100", label: "🏠 Housing available" },
            { bg: "bg-amber-50 text-amber-700 border-amber-100", label: "ABU certified"        },
          ].map((b) => (
            <span key={b.label} className={`text-xs font-semibold border rounded-full px-3 py-1 ${b.bg}`}>{b.label}</span>
          ))}
        </div>

        <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-3">
          Covebo is a mid-sized Dutch employment agency with a strong presence in food production, logistics, and light manufacturing. They work primarily with international EU workers and are well known in the Venlo, Eindhoven, and Breda regions. Not as big as Randstad or Tempo-Team, but with a more focused operation that workers often appreciate.
        </p>
        <p className="text-gray-600 text-base leading-relaxed mb-1">
          Reputation is generally positive — workers report consistent pay and housing that&apos;s usually acceptable. Like any agency, the experience varies depending on which branch and coordinator you end up with.
        </p>

        <WhatsAppCTA variant="default" />

        {/* Salary */}
        <section className="mb-10" id="salary">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">What Do You Actually Earn at Covebo?</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Covebo pays at WML or slightly above for most production and logistics roles. In 2026, that&apos;s around €14.71–€16.00/hr depending on the specific role and client site. For a standard 40-hour week, gross pay lands between €588 and €640.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            After Dutch income tax, housing, transport, and insurance, most workers take home <strong className="text-gray-900">€320–€375/week</strong> — roughly <strong className="text-gray-900">€1,380–€1,620/month net</strong>.
          </p>

          <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
            <div className="bg-gray-900 px-5 py-3">
              <p className="text-xs font-black uppercase tracking-widest text-gray-300">Weekly payslip — production role 40h/week</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { label: "Gross pay (€15.50/hr × 40h)",       value: "+€620", accent: "text-emerald-700" },
                { label: "Income tax (loonheffing)",           value: "−€67",  accent: "text-red-600"    },
                { label: "Agency housing (SNF standard)",      value: "−€92",  accent: "text-red-600"    },
                { label: "Health insurance",                   value: "−€35",  accent: "text-red-600"    },
                { label: "Transport (agency bus)",             value: "−€25",  accent: "text-red-600"    },
                { label: "Admin fees",                        value: "−€18",  accent: "text-red-600"    },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-600">{row.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${row.accent}`}>{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50">
                <span className="text-sm font-black text-gray-900">💶 You keep</span>
                <span className="text-lg font-black text-emerald-700 tabular-nums">~€383</span>
              </div>
            </div>
          </div>

          <ul className="list-none space-y-2 mb-4">
            {[
              { icon: "🏭", text: "Role type matters. Food production often pays more than basic warehouse work. Ask about the client site before accepting." },
              { icon: "⏱", text: "Overtime is common at Covebo clients — and properly paid. Night and weekend premiums are standard in contracts." },
              { icon: "📋", text: "Phase B after 26 weeks. Paid holidays and sick pay kick in, worth roughly €700–€1,000 per year at WML rates." },
            ].map((item) => (
              <li key={item.icon} className="flex gap-3">
                <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                <span className="text-gray-600 text-sm leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Housing */}
        <section className="mb-10" id="housing">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Housing — Generally Acceptable, Location Dependent</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Covebo offers accommodation for most placements and charges €88–€110/week deducted from salary. Workers generally report housing as acceptable — fewer overcrowding complaints than some larger agencies, but still highly location-dependent.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Some Covebo locations have 2-person rooms in well-maintained properties near the workplace. Others are older shared houses with more people per room. The best approach: ask the coordinator directly — how many to a room, is it SNF certified, and is there a kitchen you can actually use.
          </p>
          <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            ⚖️ Legal housing maximum is €113.50/week (SNF 2024). If Covebo charges more than this for certified shared accommodation, report it to SNF.
          </p>
        </section>

        <WhatsAppCTA variant="compact" />

        {/* Worker quotes */}
        <section className="mb-10" id="reviews">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">Real Worker Experiences</h2>
          <div className="space-y-4">
            {[
              { quote: "Covebo was honest about the salary from the start. They showed me the deductions before I signed. That's not nothing — some agencies I know hide the numbers until you're already there.", name: "Florin A.", detail: "Production, Venlo · 2025", stars: 4 },
              { quote: "Housing varies a lot depending on the location. My first placement was 4 people in a room and it was too crowded. I asked to change and they moved me to a better place after 3 weeks. At least they responded.", name: "Anna K.", detail: "Logistics, Breda · 2024", stars: 3 },
              { quote: "I work nights and the premium is properly paid. I checked my loonstrook every week for 2 months — everything matched. Some agencies don't do that.", name: "Robert D.", detail: "Food production, Eindhoven · 2025", stars: 5 },
              { quote: "The coordinator matters more than the agency name. My colleague had a terrible experience at the same Covebo branch because her coordinator didn't answer for days. Mine was fine. You can't predict it.", name: "Mirela T.", detail: "Warehouse, Tilburg · 2024", stars: 3 },
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

        {/* Pros Cons */}
        <section className="mb-10" id="pros-cons">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">Pros and Cons — Honest Summary</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "✅ What works well", color: "border-green-200 bg-green-50", titleColor: "text-green-800", sign: "+", signColor: "text-green-600",
                items: [
                  { t: "Transparent about deductions", b: "Workers report fewer payslip surprises than at some larger agencies." },
                  { t: "Good food/production placements", b: "Strong client base in food and logistics, often with premium-paying roles." },
                  { t: "Housing generally acceptable", b: "Below SNF maximum at most locations. Less overcrowding than average." },
                  { t: "Responsive to issues", b: "Workers report that problems (housing, payslip) are usually resolved when raised." },
                ]},
              { title: "⚠️ What to watch out for", color: "border-red-200 bg-red-50", titleColor: "text-red-800", sign: "−", signColor: "text-red-500",
                items: [
                  { t: "Smaller network than OTTO or Randstad", b: "Fewer locations — less flexible if you want to move cities." },
                  { t: "Housing varies by location", b: "Some older properties still get 4+ per room. Ask before accepting." },
                  { t: "Coordinator quality varies", b: "Smaller agency means fewer backup options if your coordinator is unhelpful." },
                  { t: "Not the fastest to place workers", b: "Can take a week or more to arrange everything if housing needs to be organised." },
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
        <section className="mb-10 space-y-4">
          {/* Similar agencies */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">🏢 Similar agencies — read their reviews</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { href: "/otto-workforce-review", label: "OTTO Workforce review →",  sub: "Largest logistics-focused agency in NL" },
                { href: "/tempo-team-review",     label: "Tempo-Team review →",      sub: "Broad sector coverage including catering" },
                { href: "/randstad-review",       label: "Randstad review →",        sub: "World's largest agency, NL operations" },
                { href: "/agencies",              label: "All agency profiles →",    sub: "Browse 40+ verified agencies" },
              ].map(({ href, label, sub }) => (
                <Link key={href} href={href} className="card px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-all block">
                  <p className="text-xs font-semibold text-brand-700">{label}</p>
                  <p className="text-[10px] text-gray-400">{sub}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Compare with */}
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-blue-400 mb-3">⚖️ Compare with other agencies</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { href: "/otto-vs-tempo-team",                       label: "OTTO vs Tempo-Team →",               sub: "Most-compared pair in Netherlands" },
                { href: "/compare",                                   label: "Agency comparison tool →",           sub: "Compare any two agencies side by side" },
                { href: "/check-agency",                              label: "How to check an agency →",           sub: "Verify licences, ABU/NBBU certification" },
                { href: "/best-agencies-netherlands-for-foreigners", label: "Best agencies for foreigners →",     sub: "Ranked by transparency & housing" },
              ].map(({ href, label, sub }) => (
                <Link key={href} href={href} className="bg-white border border-blue-100 rounded-xl px-3 py-2.5 hover:border-blue-300 hover:bg-blue-50/50 transition-all block">
                  <p className="text-xs font-semibold text-blue-700">{label}</p>
                  <p className="text-[10px] text-gray-400">{sub}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Other jobs in Netherlands */}
          <div className="rounded-xl bg-green-50 border border-green-100 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-green-500 mb-3">💼 Other jobs in the Netherlands</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { href: "/order-picker-jobs",                  label: "Order picker jobs →",            sub: "Most common entry-level warehouse role" },
                { href: "/production-jobs-with-accommodation", label: "Production + housing →",         sub: "Food & manufacturing with housing" },
                { href: "/warehouse-jobs-with-accommodation",  label: "Warehouse + housing →",          sub: "Job & accommodation in one package" },
                { href: "/jobs-rotterdam",                     label: "Jobs in Rotterdam →",            sub: "Major food processing & logistics hub" },
                { href: "/jobs-eindhoven",                     label: "Jobs in Eindhoven →",            sub: "ASML & Philips supply chain" },
                { href: "/tools/payslip-checker",              label: "Check your payslip →",           sub: "Verify deductions are correct" },
              ].map(({ href, label, sub }) => (
                <Link key={href} href={href} className="bg-white border border-green-100 rounded-xl px-3 py-2.5 hover:border-green-300 hover:bg-green-50/50 transition-all block">
                  <p className="text-xs font-semibold text-green-700">{label}</p>
                  <p className="text-[10px] text-gray-400">{sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <WhatsAppCTA variant="closing" />
      </div>
    </div>
  );
}
