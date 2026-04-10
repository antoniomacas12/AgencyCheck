import type { Metadata } from "next";
import Link from "next/link";
import { WA_LINK } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "OTTO Workforce vs Tempo-Team Netherlands (2026) – Salary, Housing & Which Is Better",
  description:
    "OTTO Workforce vs Tempo-Team Netherlands 2026. Tempo-Team pays €0.50–€1.50/hr more in most cities. OTTO places workers faster (1–5 days vs 3–7). Full salary, housing, and placement speed comparison.",
  alternates: { canonical: "https://agencycheck.io/otto-vs-tempo-team" },
  openGraph: {
    title: "OTTO Workforce vs Tempo-Team Netherlands (2026) – Which Agency Is Better?",
    description:
      "OTTO or Tempo-Team? Real salary numbers, housing comparison, placement speed, and which agency workers actually prefer — based on 2026 reports.",
    images: [{ url: "https://agencycheck.io/logo.png", width: 512, height: 512, alt: "AgencyCheck" }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is OTTO Workforce better than Tempo-Team in the Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Neither is universally better. OTTO Workforce places workers faster and has a higher total job volume. Tempo-Team pays slightly more in many locations (especially Amsterdam, Almere, Utrecht) and generally has more consistent housing quality. If you need to start immediately, OTTO is often the faster choice. If you can wait a few days and want better pay, Tempo-Team is worth checking.",
      },
    },
    {
      "@type": "Question",
      name: "Which agency pays more — OTTO or Tempo-Team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tempo-Team tends to pay €0.50–€1.50/hr more than OTTO for the same warehouse or production role in many Dutch cities. Over a full working month (40h/week), that's a difference of €80–€240 gross. The gap is most pronounced in Amsterdam, Almere, and Utrecht. In some smaller regional warehouses, pay is similar.",
      },
    },
    {
      "@type": "Question",
      name: "Which agency has better housing — OTTO or Tempo-Team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both provide housing, but quality varies at both agencies. On average, workers rate Tempo-Team housing slightly better — fewer overcrowding reports and faster maintenance responses. OTTO housing is more variable: some locations are fine, others have been reported as overcrowded. In both cases, ask specifically about the location before accepting.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly can you start with OTTO vs Tempo-Team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OTTO is generally faster. Workers report starting within 1–5 days at OTTO vs 3–7 days at Tempo-Team. If you need income immediately, OTTO is typically the better choice. Tempo-Team is worth the extra wait if higher pay or better housing is available at their specific location.",
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
    { "@type": "ListItem", position: 3, name: "OTTO vs Tempo-Team", item: "https://agencycheck.io/otto-vs-tempo-team" },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "OTTO Workforce vs Tempo-Team Netherlands (2026) – Salary, Housing & Which Is Better",
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
    "@id":  "https://agencycheck.io/otto-vs-tempo-team",
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
          Not sure which agency is right for you?{" "}
          <span className="text-white font-medium">Message us — we help you find the best option for your situation.</span>
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
        <h2 className="text-xl sm:text-2xl font-black text-white mb-2">Not sure which agency to choose?</h2>
        <p className="text-gray-400 text-base mb-6 max-w-md mx-auto leading-relaxed">
          Tell us your city, job preference, and start date — we&apos;ll tell you which agency fits best and help you apply directly.
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
          <p className="text-white font-bold text-lg leading-snug mb-1">Apply via WhatsApp — we help you find the right job and agency in the Netherlands.</p>
          <p className="text-gray-400 text-sm">Tell us your situation. We match you with real openings.</p>
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

// ─── Agency comparison card ───────────────────────────────────────────────────

function AgencyBadge({ name, tag, tagColor }: { name: string; tag: string; tagColor: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-black text-gray-900 text-lg">{name}</span>
      <span className={`text-xs font-bold border rounded-full px-2.5 py-0.5 ${tagColor}`}>{tag}</span>
    </div>
  );
}

export default function OttoVsTempoTeamPage() {
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
          <span className="text-gray-600 font-medium">OTTO vs Tempo-Team</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4">
          OTTO Workforce vs Tempo-Team Netherlands (2026) – Salary, Housing &amp; Which Is Better
        </h1>

        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { bg: "bg-blue-50 text-blue-700 border-blue-100",   label: "Last updated: Apr 2026"  },
            { bg: "bg-green-50 text-green-700 border-green-100", label: "🏠 Housing compared"     },
            { bg: "bg-amber-50 text-amber-700 border-amber-100", label: "Both ABU certified"      },
          ].map((b) => (
            <span key={b.label} className={`text-xs font-semibold border rounded-full px-3 py-1 ${b.bg}`}>{b.label}</span>
          ))}
        </div>

        <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-3">
          OTTO Workforce and Tempo-Team are two of the most common choices for EU workers looking for jobs in the Netherlands. Both are large, both are ABU-certified, and both offer housing. But they&apos;re not the same — and the differences can add up to hundreds of euros per month.
        </p>
        <p className="text-gray-600 text-base leading-relaxed mb-1">
          This comparison is based on real worker reports from AgencyCheck. Not agency marketing, not press releases. Just what workers actually say.
        </p>

        <WhatsAppCTA variant="default" />

        {/* Quick verdict */}
        <section className="mb-10" id="verdict">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">Quick Verdict</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                name: "OTTO Workforce",
                tag: "Faster start",
                tagColor: "bg-amber-50 text-amber-700 border-amber-200",
                verdict: "Best if you need to start immediately",
                points: [
                  "Faster placement — often 1–5 days",
                  "More total job volume across the country",
                  "Housing available at most placements",
                  "Pay slightly below Tempo-Team in many cities",
                ],
                color: "border-amber-200 bg-amber-50",
              },
              {
                name: "Tempo-Team",
                tag: "Better pay",
                tagColor: "bg-blue-50 text-blue-700 border-blue-200",
                verdict: "Best if you can wait a few days for better conditions",
                points: [
                  "Pays €0.50–€1.50/hr more in major cities",
                  "Housing generally better quality",
                  "More consistent coordinator experience",
                  "Placement can take 3–7 days",
                ],
                color: "border-blue-200 bg-blue-50",
              },
            ].map((a) => (
              <div key={a.name} className={`rounded-xl border p-5 ${a.color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-gray-900">{a.name}</span>
                  <span className={`text-xs font-bold border rounded-full px-2.5 py-0.5 ${a.tagColor}`}>{a.tag}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3 italic">{a.verdict}</p>
                <ul className="space-y-1.5">
                  {a.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-gray-700">
                      <span className="shrink-0 text-gray-400 mt-0.5">·</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Salary comparison */}
        <section className="mb-10" id="salary">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Salary — The Real Difference</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            This is where the choice matters most. At the same warehouse job in the same city, workers report earning €0.50–€1.50/hr more at Tempo-Team than OTTO. That&apos;s not always the case — in some regions they&apos;re identical — but in major logistics cities like Almere, Amsterdam, and Utrecht, the gap is real.
          </p>

          <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
            <div className="hidden sm:grid grid-cols-3 bg-gray-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-gray-300">
              <span>Factor</span>
              <span className="text-center">OTTO Workforce</span>
              <span className="text-center">Tempo-Team</span>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { factor: "Typical hourly rate (warehouse)",  otto: "€14.71–€15.50",   tempo: "€15.20–€16.50"       },
                { factor: "Net weekly (40h, WML base)",       otto: "€310–€360",        tempo: "€330–€385"           },
                { factor: "Net monthly (approx.)",           otto: "€1,340–€1,560",    tempo: "€1,430–€1,660"       },
                { factor: "Night/weekend premiums",           otto: "Standard (ABU)",   tempo: "Standard (ABU)"      },
                { factor: "Payslip accuracy",                 otto: "Generally OK",     tempo: "Generally better"    },
                { factor: "Phase B progression",              otto: "Yes (26 weeks)",   tempo: "Yes (26 weeks)"      },
              ].map((row) => (
                <div key={row.factor} className="grid grid-cols-1 sm:grid-cols-3 gap-1 px-5 py-3.5">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide sm:normal-case sm:font-medium sm:text-sm sm:text-gray-700">{row.factor}</span>
                  <span className="text-sm text-gray-700 sm:text-center">{row.otto}</span>
                  <span className="text-sm text-gray-700 sm:text-center">{row.tempo}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-200 px-5 py-4 text-sm text-blue-800">
            <strong>Over 6 months:</strong> At €1.00/hr extra for 40h/week, Tempo-Team puts roughly <strong>€1,040 more</strong> in your pocket compared to OTTO. That&apos;s real money — worth the extra days waiting if you can manage it.
          </div>
        </section>

        {/* Housing */}
        <section className="mb-10" id="housing">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Housing — Similar Costs, Different Quality</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Both agencies charge €85–€113/week for accommodation, deducted from salary. The legal SNF maximum is €113.50/week — stay alert if either agency exceeds this.
          </p>

          <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
            <div className="hidden sm:grid grid-cols-3 bg-gray-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-gray-300">
              <span>Housing factor</span>
              <span className="text-center">OTTO Workforce</span>
              <span className="text-center">Tempo-Team</span>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { factor: "Weekly cost",              otto: "€88–€113",          tempo: "€85–€113"              },
                { factor: "Typical room occupancy",   otto: "2–4 per room",      tempo: "2–3 per room"          },
                { factor: "Overall quality reports",  otto: "Very variable",     tempo: "Slightly more consistent" },
                { factor: "Maintenance response",     otto: "Slow at some sites", tempo: "Generally faster"     },
                { factor: "SNF certified",            otto: "Usually",           tempo: "Usually"               },
              ].map((row) => (
                <div key={row.factor} className="grid grid-cols-1 sm:grid-cols-3 gap-1 px-5 py-3.5">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide sm:normal-case sm:font-medium sm:text-sm sm:text-gray-700">{row.factor}</span>
                  <span className="text-sm text-gray-700 sm:text-center">{row.otto}</span>
                  <span className="text-sm text-gray-700 sm:text-center">{row.tempo}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            OTTO housing has more reported variance — some locations are fine, others have had overcrowding complaints. Tempo-Team housing tends to be more standardised, though not immune to quality issues. In both cases: <strong>ask for the specific address and number of people per room before you accept</strong>.
          </p>
        </section>

        <WhatsAppCTA variant="compact" />

        {/* Placement speed */}
        <section className="mb-10" id="placement">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Placement Speed — OTTO Wins Here</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            If you need to start working immediately, OTTO is usually the better choice. Multiple workers report being placed within 1–5 days of first contact, including housing arranged.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            Tempo-Team tends to take 3–7 days — not dramatically longer, but the difference matters if your money is running out or your visa situation requires you to start quickly.
          </p>
          <p className="text-gray-600 leading-relaxed">
            That said: fast placement doesn&apos;t mean a better contract. Workers who rushed into OTTO placements for speed sometimes later found better pay at Tempo-Team for the same type of work. If you have a week to spare, use it to compare.
          </p>
        </section>

        {/* Worker quotes */}
        <section className="mb-10" id="reviews">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">What Workers Say — OTTO vs Tempo-Team</h2>
          <div className="space-y-4">
            {[
              { quote: "I started with OTTO because they were fastest. Good for beginning. After 6 months I moved to Tempo-Team — same city, same type of work, €1.20 more per hour. I wish I knew this before.", name: "Tomasz K.", detail: "Warehouse, Almere · switched 2024", stars: 4 },
              { quote: "OTTO paid me fine but the housing was too crowded — 5 people in one room. At Tempo-Team I have 2 people. Same price per week. The difference in comfort is huge.", name: "Sorin B.", detail: "Production, Rotterdam · 2025", stars: 3 },
              { quote: "OTTO started me in 3 days when I arrived. Tempo-Team told me to wait 8 days. When you need money immediately, 3 days vs 8 days is a big difference. So I chose OTTO. No regrets.", name: "Aneta P.", detail: "Logistics, Utrecht · 2024", stars: 4 },
              { quote: "I've worked for both. OTTO was fine for the first year. Tempo-Team has better coordinators on average — more professional, faster responses. But it depends on the location. Both have good and bad branches.", name: "Vasile M.", detail: "Greenhouse, Westland · 2024–2025", stars: 4 },
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

        {/* When to choose */}
        <section className="mb-10" id="when-to-choose">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">When to Choose Each Agency</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Choose OTTO Workforce if…", color: "border-amber-200 bg-amber-50", titleColor: "text-amber-800",
                items: [
                  "You need to start working within the next few days",
                  "You're flexible on location and just need a job quickly",
                  "The specific OTTO location has been verified as decent",
                  "You plan to move to a better-paying agency after 6 months",
                ]},
              { title: "Choose Tempo-Team if…", color: "border-blue-200 bg-blue-50", titleColor: "text-blue-800",
                items: [
                  "You can wait 3–7 days for placement",
                  "You're in Amsterdam, Almere, Utrecht, or Rotterdam",
                  "Long-term housing quality matters more than speed",
                  "You want more consistent coordinator communication",
                ]},
            ].map((card) => (
              <div key={card.title} className={`rounded-xl border p-5 ${card.color}`}>
                <p className={`text-sm font-bold mb-3 ${card.titleColor}`}>{card.title}</p>
                <ul className="space-y-2">
                  {card.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-gray-700">
                      <span className="shrink-0 text-gray-400 mt-0.5">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10" id="faq">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is OTTO Workforce better than Tempo-Team?", a: "Neither is universally better. OTTO is faster to place workers and has higher volume. Tempo-Team pays more in major cities and generally has better housing standards. Which is better for you depends on your situation — speed vs. pay." },
              { q: "Which agency pays more — OTTO or Tempo-Team?", a: "Tempo-Team pays €0.50–€1.50/hr more than OTTO in many Dutch cities. Over a full month at 40h/week, that's €80–€240 more. The difference is most noticeable in Almere, Amsterdam, and Utrecht." },
              { q: "How quickly can you start with OTTO vs Tempo-Team?", a: "OTTO typically places workers in 1–5 days. Tempo-Team usually takes 3–7 days. If you need to start immediately, OTTO is the faster choice." },
              { q: "Do both agencies provide accommodation?", a: "Yes, both offer housing for international workers. Cost is similar: €85–€113/week. Quality varies at both, but Tempo-Team housing is generally rated slightly better and less overcrowded on average." },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="font-bold text-gray-900 text-sm mb-2">{item.q}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="mb-10 rounded-xl bg-gray-50 border border-gray-200 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Read the full reviews</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/otto-workforce-review",         label: "OTTO Workforce full review →" },
              { href: "/tempo-team-review",             label: "Tempo-Team full review →" },
              { href: "/randstad-review",               label: "Randstad review Netherlands →" },
              { href: "/covebo-review",                 label: "Covebo review Netherlands →" },
              { href: "/jobs-with-accommodation",       label: "Jobs with accommodation in Netherlands →" },
              { href: "/agencies",                      label: "Compare all agencies →" },
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
