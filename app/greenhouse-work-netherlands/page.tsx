import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Greenhouse Work Netherlands 2026 — Pay, Seasons & What to Expect",
  description:
    "Greenhouse (glastuinbouw) work in the Netherlands: which regions hire, what the work involves, pay rates above WML, seasonal peaks, and how to find a verified agency.",
  alternates: { canonical: "https://agencycheck.io/greenhouse-work-netherlands" },
  openGraph: {
    title: "Greenhouse Work Netherlands — Pay, Locations & How to Get Started",
    description:
      "Glastuinbouw is one of the Netherlands' biggest employers of EU agency workers. We explain pay, seasons, regions, and what to check before you sign a contract.",
  },
};

export const dynamic = "force-static";

// ─── Regions ─────────────────────────────────────────────────────────────────
const REGIONS = [
  {
    name: "Westland / De Lier / Naaldwijk",
    province: "South Holland",
    crop: "Tomatoes, peppers, cucumbers, lettuce",
    note: "The largest greenhouse cluster in the world — 7,000+ hectares of glass. Most international workers in NL greenhouses work here.",
    agencies: "High concentration of certified ABU/NBBU agencies",
  },
  {
    name: "Aalsmeer / Rijnsburg",
    province: "North Holland / South Holland",
    crop: "Cut flowers, orchids, pot plants",
    note: "Home to FloraHolland auction — the world's largest flower auction. Work is fast-paced and often involves sorting, packing, and auction logistics.",
    agencies: "Several agencies specialise specifically in floriculture work",
  },
  {
    name: "Venlo / Horst aan de Maas",
    province: "Limburg",
    crop: "Paprika, tomatoes, asparagus, soft fruit",
    note: "Popular with workers from Poland, Romania, and Bulgaria due to proximity. Venlo is a major logistics hub so greenhouse + warehouse combos are common.",
    agencies: "Many agencies offer mixed greenhouse+logistics contracts here",
  },
  {
    name: "Pijnacker-Nootdorp / Bleiswijk",
    province: "South Holland",
    crop: "Tomatoes, bell peppers, herbs",
    note: "Growing area adjacent to Westland. Newer glasshouses with modern automation — less physical manual labour than older sites.",
    agencies: "ABU-registered agencies dominant; NBBU smaller operators also active",
  },
  {
    name: "Emmen / Klazienaveen",
    province: "Drenthe",
    crop: "Cucumbers, tomatoes, roses",
    note: "Less crowded than South Holland clusters. Quieter area with lower cost of living — can mean more affordable housing deductions.",
    agencies: "Fewer agencies; typically direct contact with growers for shorter contracts",
  },
];

// ─── Job types ────────────────────────────────────────────────────────────────
const JOB_TYPES = [
  {
    title: "Plant worker (plukker / snoeier)",
    icon: "🌿",
    pay: "WML + possible piecework bonus",
    desc: "Harvesting (plukken) and pruning (snoeien) crops. Physical, repetitive work — standing or bending for 8h shifts. Most common entry-level greenhouse role. Some sites offer production bonuses for exceeding a daily pick quota.",
  },
  {
    title: "Processing / packing (verwerker / inpakker)",
    icon: "📦",
    pay: "WML, sometimes WML +5–10%",
    desc: "Sorting, grading, and packing harvested crops for distribution. Usually indoors at a packing station. Lighter physical demands than field harvesting but requires speed and quality attention.",
  },
  {
    title: "Logistics / internal transport (intern transport)",
    icon: "🏎",
    pay: "WML +10–15%, sometimes with heftruck diploma bonus",
    desc: "Moving product within the greenhouse or distribution centre using trolleys, conveyor belts, or forklifts (heftruck). Heftruck (forklift) certification adds €0.50–€1.50/hour to your rate and makes you more mobile across employers.",
  },
  {
    title: "Potting / propagation (potterij / vermeerdering)",
    icon: "🪴",
    pay: "WML, sometimes slightly above",
    desc: "Potting seedlings, managing propagation trays, spacing plants. Found primarily in pot-plant and ornamental flower operations. Work is year-round with less seasonal variation than fruit/vegetable harvesting.",
  },
  {
    title: "Crop monitoring / assistant grower",
    icon: "🔬",
    pay: "WML +20–40%, requires experience",
    desc: "Checking plant health, monitoring climate sensors, reporting to head grower. Usually requires previous greenhouse experience and some Dutch or English language. Not available to new starters — typically requires 6–12 months of proven greenhouse work.",
  },
];

// ─── Seasonal calendar ────────────────────────────────────────────────────────
const SEASONS = [
  { month: "Jan–Feb", level: "Low",    note: "Mostly maintenance. Fewer vacancies." },
  { month: "Mar–Apr", level: "High",   note: "Planting season — peak hiring. Start dates clustered in March." },
  { month: "May–Jun", level: "High",   note: "First harvests. Long shifts. Overtime common." },
  { month: "Jul–Aug", level: "Medium", note: "Continuous harvest but some sites close for summer maintenance." },
  { month: "Sep–Oct", level: "High",   note: "Autumn harvest peak — second biggest hiring window of the year." },
  { month: "Nov–Dec", level: "Low",    note: "End of season. Contracts typically end Oct–Nov." },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What is greenhouse work (glastuinbouw) in the Netherlands?",
    a: "Glastuinbouw refers to horticultural production inside glass greenhouses — primarily vegetables (tomatoes, peppers, cucumbers), flowers (roses, chrysanthemums, orchids), and pot plants. The Netherlands has the largest concentration of greenhouse horticulture in the world, concentrated mainly in the Westland–Naaldwijk region in South Holland and parts of Limburg. Work is typically physical, shift-based, and performed under agency employment contracts governed by the ABU or NBBU CAO.",
  },
  {
    q: "How much do you earn in a Dutch greenhouse?",
    a: "Most greenhouse roles start at the Dutch statutory minimum wage (WML) — €13.68/hour gross for a 40-hour week in 2026. Some roles carry a small production bonus (stukloon) for exceeding daily targets. Roles requiring forklift certification or experience earn 10–20% above WML. After 26 weeks at the same greenhouse company, you may be entitled to the inlenersbeloning — the same pay scale as direct-hire greenhouse employees, which is typically above WML under the Glastuinbouw CAO.",
  },
  {
    q: "Is greenhouse work seasonal or year-round?",
    a: "It depends on the crop. Fruit and vegetable greenhouses (tomatoes, peppers, cucumbers) have strong seasonal peaks in spring (planting, March–April) and autumn harvest (September–October), with reduced work in January–February and November–December. Flower growing and pot plants tend to be more year-round. If you are looking for winter employment, floriculture operations around Aalsmeer are the most stable option.",
  },
  {
    q: "Do I need Dutch to work in a greenhouse?",
    a: "No. The majority of greenhouse workers in the Netherlands are EU migrants, and many operational instructions are communicated in Polish, Romanian, or via symbols. Basic Dutch or English helps for safety briefings and any interaction with the team leader (voorman/vrouw). Some larger companies have Polish or Romanian-speaking supervisors. You will need to understand simple Dutch safety terms — your agency is legally required to provide these in your own language (ABU/NBBU CAO requirement).",
  },
  {
    q: "Can I find greenhouse work with housing included?",
    a: "Yes. Most agencies placing workers in the Westland, Venlo, and Aalsmeer greenhouse clusters include SNF-certified accommodation in the work package. Housing is deducted from your gross wage at a maximum of €113.50/week (2026 SNF maximum). All agencies on AgencyCheck list their housing deduction upfront so you can compare before applying.",
  },
];

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Greenhouse Work Netherlands 2026 — Pay, Seasons & What to Expect",
      "description": "Glastuinbouw work in the Netherlands: regions, job types, pay rates, seasonal calendar and agency guide.",
      "url": "https://agencycheck.io/greenhouse-work-netherlands",
      "datePublished": "2026-01-01",
      "dateModified": "2026-05-01",
      "author": { "@type": "Organization", "name": "AgencyCheck" },
      "publisher": { "@type": "Organization", "name": "AgencyCheck", "url": "https://agencycheck.io" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQS.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",   "item": "https://agencycheck.io" },
        { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://agencycheck.io/guides" },
        { "@type": "ListItem", "position": 3, "name": "Greenhouse Work Netherlands" },
      ],
    },
  ],
};

export default function GreenhouseWorkPage() {
  const agencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* ── Header ── */}
        <header className="bg-gray-900 text-white">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300 transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-gray-200">Greenhouse Work Netherlands</span>
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-10 pt-4">
            <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/50 text-green-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🌱 Glastuinbouw — Netherlands 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Greenhouse Work in the Netherlands
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              The Netherlands produces 65% of Europe's greenhouse vegetables and flowers — and employs
              tens of thousands of EU workers to do it. Here is everything you need to know before
              you arrive: which regions hire, what the work pays, how seasonal demand works, and
              what to check in your agency contract.
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 space-y-14">

          {/* ── Regions ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Where the greenhouses are</h2>
            <p className="text-gray-600 text-sm mb-5">
              Greenhouse horticulture in the Netherlands is highly concentrated in a few key regions.
              Most agency placements come from these clusters:
            </p>
            <div className="space-y-4">
              {REGIONS.map((r, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-base">{r.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">{r.province}</span>
                  </div>
                  <p className="text-emerald-700 font-medium mb-2">🌿 {r.crop}</p>
                  <p className="text-gray-600 leading-relaxed mb-1">{r.note}</p>
                  <p className="text-gray-400 text-xs">{r.agencies}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Job types ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job types and pay</h2>
            <p className="text-gray-600 text-sm mb-5">
              Most greenhouse roles are accessible without Dutch language skills or prior experience.
              Pay is at or above WML depending on role.
            </p>
            <div className="space-y-4">
              {JOB_TYPES.map((j, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{j.icon}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{j.title}</h3>
                        <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">{j.pay}</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{j.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Seasonal calendar ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Seasonal hiring calendar</h2>
            <p className="text-gray-600 text-sm mb-5">
              When you arrive matters. Spring and autumn are the peak hiring windows — the best time
              to find a contract quickly.
            </p>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {SEASONS.map((s, i) => {
                const levelColor =
                  s.level === "High"   ? "bg-emerald-100 text-emerald-700" :
                  s.level === "Medium" ? "bg-amber-100 text-amber-700" :
                                         "bg-gray-100 text-gray-500";
                return (
                  <div key={i} className={`flex items-center gap-4 px-5 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <span className="w-20 font-semibold text-gray-800 shrink-0">{s.month}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${levelColor}`}>{s.level}</span>
                    <span className="text-gray-600">{s.note}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Contract tips ── */}
          <section className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">Before you sign: 5 things to check</h2>
            <ol className="space-y-3 text-sm text-gray-300">
              {[
                "Housing deduction is written in euros per week — not as a % of unknown future wages",
                "SNF certificate number is on your housing contract or your agency can show it on request",
                "ET vergoeding clause is included if you live >150km from the Dutch border (most Eastern European workers qualify)",
                "Your employment contract specifies which greenhouse company or region you will work at — vague 'to be determined' contracts are a red flag",
                "Agency is SNA- or NEN-4400 certified — look for the SNA logo or ask for their registration number on the SNA register",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* ── ET callout ── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm">
            <p className="font-bold text-blue-800 mb-1">💡 Most greenhouse workers qualify for the ET benefit</p>
            <p className="text-blue-700 leading-relaxed">
              Workers from Poland, Romania, Bulgaria, and Slovakia all live more than 150km from the
              Dutch border — the main qualifying criterion for the ET (Extraterritoriale kosten)
              tax-free benefit. This can add €50–€150/week to your net income. Not all agencies apply
              it automatically.{" "}
              <Link href="/et-scheme-netherlands-explained" className="underline font-semibold">
                See the ET scheme guide →
              </Link>
            </p>
          </div>

          {/* ── Agency CTA ── */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Find greenhouse work</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Verified agencies hiring in Dutch greenhouses right now
            </h2>
            <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
              All agencies on AgencyCheck include SNF housing, show deductions upfront, and operate
              under ABU/NBBU CAO. Free to apply via WhatsApp — same-day response.
            </p>
            <Link
              href="/vacancies"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              See greenhouse vacancies →
            </Link>
          </section>

          {/* ── Agencies ── */}
          {agencies.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Agencies placing greenhouse workers</h2>
              <div className="grid gap-4">
                {agencies.map((a) => (
                  <AgencyCard key={a.slug} agency={a} jobCount={getJobCountForAgency(a.slug)} />
                ))}
              </div>
            </section>
          )}

          {/* ── FAQ ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
            <div className="space-y-5">
              {FAQS.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{f.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Related ── */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-base font-bold text-gray-700 mb-4">Related guides</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/minimum-wage-netherlands-2026",    label: "Minimum wage Netherlands 2026" },
                { href: "/how-to-read-dutch-payslip",        label: "How to read your Dutch payslip" },
                { href: "/et-scheme-netherlands-explained",  label: "ET scheme — up to €150/wk extra net" },
                { href: "/vacancies",                        label: "Browse all vacancies" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
                >
                  <span className="text-emerald-500">→</span>
                  {l.label}
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
