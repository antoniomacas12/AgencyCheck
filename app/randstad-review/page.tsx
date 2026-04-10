import type { Metadata } from "next";
import Link from "next/link";
import { WA_LINK } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Randstad Review Netherlands (2026) – Salary, Housing & Real Worker Experiences",
  description:
    "Randstad review Netherlands 2026. Warehouse workers keep €320–€375/week net after tax, housing and deductions. Real salary numbers, accommodation quality, and honest comparison with Tempo-Team and OTTO.",
  alternates: { canonical: "https://agencycheck.io/randstad-review" },
  openGraph: {
    title: "Randstad Review Netherlands (2026) – Salary, Housing & Real Worker Experiences",
    description:
      "What workers actually say about Randstad Netherlands in 2026. Real salary numbers, housing experiences, and honest pros and cons — not agency marketing.",
    images: [{ url: "https://agencycheck.io/logo.png", width: 512, height: 512, alt: "AgencyCheck" }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much do you earn at Randstad Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Randstad places workers across a wide salary range depending on sector. For warehouse and production roles at WML (€14.71/hr, 40h/week), gross pay is €588/week. After Dutch tax, housing, transport, and insurance, take-home is typically €320–€380/week. Randstad also places higher-skilled workers at €17–€25/hr in IT, logistics management, and office roles.",
      },
    },
    {
      "@type": "Question",
      name: "Does Randstad provide accommodation in the Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Randstad does provide housing for international workers at some locations, particularly for industrial placements. Not all Randstad placements include accommodation — it depends on the specific contract and location. Where housing is provided, it costs €88–€113/week deducted from salary.",
      },
    },
    {
      "@type": "Question",
      name: "Is Randstad a reliable agency in the Netherlands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Randstad is the world's largest employment agency and is ABU-certified in the Netherlands. They are generally considered reliable for contract clarity and payslip accuracy. Workers in logistics and production report consistent pay but sometimes impersonal service — being a large agency means coordinators manage many workers at once.",
      },
    },
    {
      "@type": "Question",
      name: "How does Randstad compare to Tempo-Team and OTTO Workforce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Randstad and Tempo-Team are part of the same group. Randstad handles a wider range of roles including office, IT, and skilled positions. For manual labour and industrial work, OTTO and Tempo-Team tend to be more specialised. Salary for warehouse work is broadly similar across all three at WML level.",
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
    { "@type": "ListItem", position: 3, name: "Randstad Review", item: "https://agencycheck.io/randstad-review" },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Randstad Review Netherlands (2026) – Salary, Housing & Real Worker Experiences",
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
    "@id":  "https://agencycheck.io/randstad-review",
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
          Looking for work in the Netherlands with accommodation?{" "}
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
          Tell us your job preference, location, and when you can start. We match you with verified agencies and real openings.
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
          <p className="text-gray-400 text-sm">Send your preference. We find the right match fast.</p>
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

export default function RandstadReviewPage() {
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
          <span className="text-gray-600 font-medium">Randstad Review</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-4">
          Randstad Review Netherlands (2026) – Salary, Housing &amp; Real Worker Experiences
        </h1>

        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { bg: "bg-blue-50 text-blue-700 border-blue-100",    label: "Last updated: Apr 2026"    },
            { bg: "bg-green-50 text-green-700 border-green-100", label: "🏠 Housing at some locations" },
            { bg: "bg-purple-50 text-purple-700 border-purple-100", label: "ABU certified"           },
            { bg: "bg-gray-50 text-gray-700 border-gray-200",    label: "World's largest agency"     },
          ].map((b) => (
            <span key={b.label} className={`text-xs font-semibold border rounded-full px-3 py-1 ${b.bg}`}>{b.label}</span>
          ))}
        </div>

        <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-3">
          Randstad is the largest employment agency in the world — and one of the most recognisable names in the Dutch labour market. They operate across virtually every sector: warehouse and production, logistics, IT, office work, healthcare, and more. Through Randstad Nederland, they place tens of thousands of workers every year.
        </p>
        <p className="text-gray-600 text-base leading-relaxed mb-1">
          For international workers specifically, Randstad is a common first contact. Experiences range widely. Being a massive organisation means pay and housing can be reliable — but it also means you can feel like a number if you end up with an overloaded coordinator.
        </p>

        <WhatsAppCTA variant="default" />

        {/* Salary */}
        <section className="mb-10" id="salary">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">What Do You Actually Earn at Randstad Netherlands?</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Randstad places workers at a wide range of pay rates. For warehouse and production jobs — the most common entry point for EU workers — expect WML or slightly above: €14.71–€16.00/hr in 2026.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            At a standard warehouse role on 40 hours/week, gross pay is €588–€640/week. After Dutch income tax, housing, transport, and insurance, most warehouse workers take home <strong className="text-gray-900">€320–€375/week</strong> — around <strong className="text-gray-900">€1,380–€1,620/month net</strong>.
          </p>

          <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
            <div className="bg-gray-900 px-5 py-3">
              <p className="text-xs font-black uppercase tracking-widest text-gray-300">Weekly payslip — logistics role 40h/week</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { label: "Gross pay (€14.71/hr × 40h — WML)", value: "+€588", accent: "text-emerald-700" },
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
                <span className="text-lg font-black text-emerald-700 tabular-nums">~€345</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Randstad&apos;s real advantage is that they also have roles well above WML — skilled logistics, driving, and office positions where workers earn €17–€25/hr. If you have relevant experience or qualifications, it&apos;s worth asking specifically about those roles rather than just accepting a basic warehouse placement.
          </p>
          <p className="text-sm text-gray-500 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            ⚠️ Randstad&apos;s admin fees vary. Some workers report €15/week, others €30/week. Always confirm the exact total deduction before signing.
          </p>
        </section>

        {/* Housing */}
        <section className="mb-10" id="housing">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Housing — Available, But Not Universal</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Unlike OTTO or Covebo which include housing as standard for international placements, Randstad&apos;s accommodation availability depends heavily on the specific contract and location. Some placements include housing; many don&apos;t.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            Where Randstad does provide housing, workers report standards as generally acceptable — comparable to Tempo-Team. The cost is €88–€113/week deducted from salary. There are fewer reports of extreme overcrowding compared to some smaller operators.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            If finding accommodation yourself, Randstad sometimes helps connect workers with private rental options near the placement. Don&apos;t assume housing is included — confirm this specifically before accepting any offer.
          </p>
          <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            💡 If Randstad doesn&apos;t provide housing for your placement, check our{" "}
            <Link href="/agencies-with-housing" className="text-brand-600 hover:underline">agencies with housing list</Link>{" "}
            for alternatives in your area.
          </p>
        </section>

        <WhatsAppCTA variant="compact" />

        {/* Worker quotes */}
        <section className="mb-10" id="reviews">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">Real Worker Experiences</h2>
          <div className="space-y-4">
            {[
              { quote: "Randstad pays on time, every time. That's the main thing. I had problems with a smaller agency before — late payments, unclear deductions. Randstad is boring in a good way. No surprises.", name: "Piotr W.", detail: "Logistics, Rotterdam · 2025", stars: 4 },
              { quote: "My coordinator had too many people to manage. I messaged her on Monday and got a reply Thursday. If you have an urgent problem, that's really stressful. The pay was fine but the support was slow.", name: "Daniela F.", detail: "Warehouse, Amsterdam · 2024", stars: 3 },
              { quote: "I asked about higher-paying roles — I have a forklift license — and they found me a position at €17.50/hr. Nobody offered this automatically, I had to ask. That's the thing with Randstad. You need to push.", name: "Luca M.", detail: "Forklift operator, Utrecht · 2025", stars: 4 },
              { quote: "Housing varies a lot depending on location. Some agencies pay more than Randstad in some locations. I later moved to a smaller agency and got €1.20 more per hour for the same job. Always worth checking.", name: "Oana P.", detail: "Production, Eindhoven · 2024", stars: 3 },
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
                  { t: "Reliable pay", b: "Workers consistently report on-time, accurate payments. Fewer payslip errors than smaller operators." },
                  { t: "Wide range of roles", b: "Not just warehouse work — skilled, driving, and office roles available if you qualify." },
                  { t: "ABU certified & established", b: "One of the most regulated agencies in the Netherlands. Legal protections are real." },
                  { t: "Phase B progression", b: "Paid holidays and sick pay after 26 weeks, like all ABU-certified agencies." },
                ]},
              { title: "⚠️ What to watch out for", color: "border-red-200 bg-red-50", titleColor: "text-red-800", sign: "−", signColor: "text-red-500",
                items: [
                  { t: "Coordinators can be overloaded", b: "Large agency = slow personal response. Problems take longer to resolve." },
                  { t: "Not always the highest pay", b: "Some locations and sectors pay more at Tempo-Team or smaller specialised agencies." },
                  { t: "Housing not always included", b: "Unlike OTTO or Covebo, accommodation is not guaranteed — confirm before accepting." },
                  { t: "You need to ask for better", b: "Better roles and rates exist but often aren't offered proactively. Push for them." },
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
              { href: "/tempo-team-review",             label: "Tempo-Team review Netherlands →" },
              { href: "/otto-workforce-review",         label: "OTTO Workforce review Netherlands →" },
              { href: "/otto-vs-tempo-team",            label: "OTTO vs Tempo-Team comparison →" },
              { href: "/agencies-with-housing",         label: "Best agencies with housing →" },
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
