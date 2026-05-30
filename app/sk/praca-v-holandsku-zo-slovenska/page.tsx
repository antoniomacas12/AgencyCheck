import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Práca v Holandsku zo Slovenska 2026 — Kompletný Sprievodca pre Slovenských Pracovníkov",
  description:
    "Všetko, čo potrebujú slovenskí pracovníci vedieť: cestovanie zo Slovenska, registrácia BSN, nárok na ET príspevok, ubytovanie, typické mzdy a ako si vybrať overenú agentúru v Holandsku.",
  alternates: {
    canonical: "https://agencycheck.io/work-netherlands-from-slovakia",
    languages: { "sk": "https://agencycheck.io/sk/praca-v-holandsku-zo-slovenska" },
  },
  openGraph: {
    title: "Práca v Holandsku zo Slovenska — Mzdy, Ubytovanie a Prvé Kroky",
    description:
      "Slovenský pracovníci v Holandsku: Bratislava je ~1.280 km od Amsterdamu — nárokujete si na ET príspevok. Vysvetlíme, čo to znamená pre váš čistý príjem.",
  },
};

// ─── Kľúčové fakty ────────────────────────────────────────────────────────────
const KEY_FACTS = [
  {
    icon: "🇸🇰",
    title: "Nepotrebujete pracovné povolenie",
    body: "Slovensko je členom EÚ. Ako slovenský občan máte bezpodmienečné právo žiť a pracovať v Holandsku od prvého dňa. Nepotrebujete vízum, pracovné povolenie ani sponzora. Váš slovenský občiansky preukaz je postačujúci doklad.",
  },
  {
    icon: "📍",
    title: "Vzdialenosť zo Slovenska: ~1.280 km",
    body: "Bratislava–Amsterdam je približne 1.280 km. To znamená, že prakticky všetci slovenský pracovníci automaticky spĺňajú podmienky na ET (Extraterritoriale kosten) príspevok — oslobodené od dane s hodnotou €50–€150/týždeň nad rámec mzdy. Hraničný limit je 150 km od holandskej hranice.",
  },
  {
    icon: "🏠",
    title: "Ubytovanie je zvyčajne v cene",
    body: "Väčšina agentúr umiestňujúcich slovenských pracovníkov zahŕňa SNF-certifikované ubytovanie do pracovného balíka. Nemusíte si hľadať vlastný byt. Náklady sa odpočítajú z hrubej mzdy maximálne €113,50/týždeň (limit SNF 2026) — bez zálohy vopred.",
  },
  {
    icon: "📋",
    title: "Slovensky hovoriaci náborcovia dostupní",
    body: "Viaceré agentúry v regiónoch Eindhoven, Venlo a Tilburg majú slovensky hovoriacich zamestnancov alebo spolupracujú so slovenskými subdodávateľmi. Slovenská komunita v Eindhoven a v regióne Brabant je etablovaná — nájdete slovenské kostoly, obchody a komunitné skupiny.",
  },
];

// ─── Porovnanie čistej mzdy ───────────────────────────────────────────────────
const NET_COMPARISON = [
  {
    label: "Agentúra bez ET",
    rows: [
      { item: "Hrubá týždenná mzda (WML, 40h)", amount: "+€547" },
      { item: "Loonheffing + odvody",             amount: "−€96"  },
      { item: "Ubytovanie (SNF štandard)",         amount: "−€95"  },
      { item: "Doprava",                           amount: "−€25"  },
      { item: "Zdravotné poistenie",               amount: "−€40"  },
      { item: "ET vergoeding",                     amount: "€0"    },
    ],
    net: "≈ €291/týždeň",
    highlight: false,
  },
  {
    label: "Agentúra s ET (spĺňate podmienky)",
    rows: [
      { item: "Hrubá týždenná mzda (WML, 40h)", amount: "+€547" },
      { item: "Loonheffing + odvody (znížené)",  amount: "−€38"  },
      { item: "Ubytovanie (SNF štandard)",         amount: "−€95"  },
      { item: "Doprava",                           amount: "−€25"  },
      { item: "Zdravotné poistenie",               amount: "−€40"  },
      { item: "ET vergoeding (oslobodené od dane)", amount: "+€84"  },
    ],
    net: "≈ €433/týždeň",
    highlight: true,
  },
];

// ─── Kroky ────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    step: "1",
    title: "Vyberte si overenú agentúru pred cestovaním",
    body: "Necestujte bez potvrdenej zmluvy. Overená agentúra musí poskytnúť podpísanú arbeidsovereenkomst (pracovnú zmluvu) s dátumom nástupu, hodinovou sadzbou, adresou ubytovania a podrobným rozpisom odpočtov pred rezerváciou cestovania. Agentúry na AgencyCheck toto zobrazujú vopred.",
  },
  {
    step: "2",
    title: "Cestujte do Holandska",
    body: "Najbežnejšie trasy zo Slovenska: autobus (RegioJet alebo FlixBus, 14–18h, Bratislava → Amsterdam / Rotterdam / Eindhoven), alebo vlak cez Viedeň–Frankfurt–Amsterdam (12–14h). Let cez Viedeň alebo Bratislavu je tiež možnosťou. Vaša agentúra by mala potvrdiť adresu ubytovania, aby ste vedeli, kam ísť po príchode.",
  },
  {
    step: "3",
    title: "Registrujte sa na RNI pracovisku a získajte BSN",
    body: "V prvom týždni by vás vaša agentúra mala odviezť na RNI (Registratie Niet-Ingezetene) pracovisko, kde zaregistrujete svoje údaje a dostanete BSN (Burgerservicenummer) — vaše holandské daňové identifikačné číslo. Bez BSN musí váš zamestnávateľ uplatňovať núdzovú daňovú sadzbu (anoniementarief), čo zadržiava 40–52% hrubej mzdy. Rýchle získanie BSN je nevyhnutné. Prineste občiansky preukaz, pracovnú zmluvu a adresu bydliska v Holandsku.",
  },
  {
    step: "4",
    title: "Potvrďte, že ET vergoeding je vo vašej zmluve",
    body: "Keďže Bratislava je viac ako 1.280 km od Amsterdamu, takmer iste spĺňate podmienky na ET príspevok. Pred podpisom sa opýtajte recruitera: 'Is ET vergoeding included in my contract?' Ak áno, váš loonstrook bude obsahovať riadok 'ET vergoeding' alebo 'Onkostenvergoeding belastingvrij'. Ak nie, zvážte porovnanie agentúr — rozdiel môže byť €100–€150/týždeň čistého.",
  },
  {
    step: "5",
    title: "Otvorte si holandský bankový účet (voliteľné, ale praktické)",
    body: "Mzda sa zvyčajne posiela na holandský alebo SEPA bankový účet. Mnohí Slováci používajú slovenský účet (Slovenská sporiteľňa, Tatra banka, VÚB) so SEPA IBAN — funguje dobre pre holandské výplaty. Alternatívne ING a ABN AMRO ponúkajú základné účty pre pracovníkov EÚ s BSN.",
  },
];

// ─── Obľúbené mestá ───────────────────────────────────────────────────────────
const POPULAR_CITIES = [
  { city: "Eindhoven",       reason: "Najväčšia slovenská komunita v NL. Logistika, sklad a ľahká výroba. Slovenská komunita tu existuje od začiatku 2000-tych rokov." },
  { city: "Tilburg",         reason: "Veľké logistické centrum (DHL, PostNL). Etablovaná komunita z východnej Európy." },
  { city: "Venlo",           reason: "Hraničné logistické centrum blízko Nemecka. Veľa distribučných centier." },
  { city: "Den Bosch",       reason: "Potravinárska výroba a logistika. Blízko Eindhoven." },
  { city: "Westland",        reason: "Hlavná oblasť oranžeriovej produkcie — ak hľadáte prácu v skleníkoch (glastuinbouw)." },
  { city: "Rotterdam",       reason: "Prístavná logistika, výroba, spracovanie potravín. Tu pôsobia veľké agentúry." },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Môžu Slováci pracovať v Holandsku bez pracovného povolenia?",
    a: "Áno. Slovensko je plnoprávnym členom EÚ a slovenský občania majú bezpodmienečné právo pracovať v Holandsku podľa slobody pohybu pracovníkov EÚ (Vrij verkeer van werknemers). Nepotrebujete pracovné povolenie, vízum ani sponzora zamestnávateľa. Váš slovenský občiansky preukaz alebo pas je jediný potrebný doklad. Nie je žiadna kvóta, žiadny registračný poplatok ani minimálna príjmová požiadavka na začatie práce.",
  },
  {
    q: "Koľko zarábajú slovenský pracovníci v Holandsku?",
    a: "Väčšina slovenských pracovníkov začína pri holandskej zákonnej minimálnej mzde (WML) — €13,68/hodinu brutto (40h/týždeň) v 2026, teda aproximatívne €547/týždeň brutto. Po odpočtoch za ubytovanie, dane a poistenie je realistický čistý príjem €280–€300/týždeň bez ET, alebo €400–€450/týždeň s ET (Extraterritoriale kosten) príspevkom. Keďže Bratislava je ~1.280 km od Amsterdamu, prakticky všetci Slováci spĺňajú podmienky na ET — ale nie všetky agentúry ho uplatňujú.",
  },
  {
    q: "Aká je slovenská komunita v Holandsku?",
    a: "Slovenská komunita v Holandsku je najsilnejšia v okolí Eindhoven, Tilburg a Den Bosch v provincii Severní Brabant. Nájdete slovenské katolícke kostoly, slovenské Facebook skupiny (napr. 'Slováci v Holandsku'), slovenské potraviny v poľských a východoeurópskych obchodoch a slovensky hovoriaci recruitori v niekoľkých agentúrach. Eindhoven má dlhodobú prítomnosť slovenských pracovníkov od začiatku 2000-tych rokov.",
  },
  {
    q: "Vzťahuje sa ET príspevok na slovenských pracovníkov?",
    a: "Takmer určite áno. Hlavnou podmienkou pre ET (Extraterritoriale kosten) príspevok je, že vaša trvalá adresa je viac ako 150 km od najbližšieho bodu holandskej hranice. Bratislava je približne 1.280 km od Amsterdamu a viac ako 900 km od najbližšieho bodu holandskej hranice. Musíte byť v Holandsku menej ako 5 rokov (60 mesiacov) a ET klauzula musí byť zahrnutá vo vašej pracovnej zmluve (arbeidsovereenkomst). Príspevok má typickú hodnotu €50–€150/týždeň čistého.",
  },
  {
    q: "Ako dlho trvá získanie BSN v Holandsku?",
    a: "Na RNI (Registratie Niet-Ingezetene) pracovisku sa BSN zvyčajne vydáva v ten istý deň ako vaše stretnutie. Väčšina agentúr v objemných oblastiach zariadí stretnutie RNI počas prvých 3–5 pracovných dní. Prineste slovenský občiansky preukaz alebo pas, pracovnú zmluvu a dôkaz holandskej adresy. Bez BSN musí váš zamestnávateľ zdaniť núdzovou sadzbou (anoniementarief), čo môže znamenať len 50–60% hrubej mzdy na účte v prvom týždni.",
  },
];

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Práca v Holandsku zo Slovenska 2026 — Kompletný Sprievodca pre Slovenských Pracovníkov",
      "description": "Cestovanie, registrácia BSN, ET príspevok, ubytovanie, mzdy a agentúry pre slovenských pracovníkov v Holandsku.",
      "url": "https://agencycheck.io/sk/praca-v-holandsku-zo-slovenska",
      "datePublished": "2026-01-01",
      "dateModified": "2026-05-01",
      "inLanguage": "sk",
      "author": { "@type": "Organization", "name": "AgencyCheck" },
      "publisher": { "@type": "Organization", "name": "AgencyCheck", "url": "https://agencycheck.io" },
      "about": { "@type": "Place", "name": "Netherlands" },
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
        { "@type": "ListItem", "position": 1, "name": "Domov",        "item": "https://agencycheck.io/sk" },
        { "@type": "ListItem", "position": 2, "name": "Sprievodcovia", "item": "https://agencycheck.io/guides" },
        { "@type": "ListItem", "position": 3, "name": "Práca v Holandsku zo Slovenska" },
      ],
    },
  ],
};

export default function PracaVHolandskuZoSlovenskaPage() {
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
            <Link href="/sk" className="hover:text-gray-300 transition-colors">Domov</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300 transition-colors">Sprievodcovia</Link>
            <span>/</span>
            <span className="text-gray-200">Práca zo Slovenska</span>
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-10 pt-4">
            <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🇸🇰 → 🇳🇱 Slovenský pracovníci v Holandsku
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Práca v Holandsku zo Slovenska
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Slovenský občania majú rovnaké právo pracovať v Holandsku ako Holanďania —
              bez povolenia, bez víza, bez čakacej listiny. Kompletný sprievodca: čo si
              overiť pred cestovaním, koľko zarobíte, prečo je ET príspevok dôležitý
              a ako nájsť legitímnu agentúru.
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 space-y-14">

          {/* ── Kľúčové fakty ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">4 veci, ktoré treba vedieť pred odchodom</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {KEY_FACTS.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 text-sm">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── ET porovnanie čistej mzdy ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Prečo je ET príspevok dôležitý pre Slovákov</h2>
            <p className="text-gray-600 text-sm mb-5">
              Bratislava je ~1.280 km od Amsterdamu. To znamená, že spĺňate podmienky na ET
              (Extraterritoriale kosten) príspevok — ale iba ak ho vaša agentúra zahrnie do
              zmluvy. Pozrite sa na rozdiel:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {NET_COMPARISON.map((col) => (
                <div
                  key={col.label}
                  className={`rounded-xl border p-5 text-sm ${
                    col.highlight
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <h3 className={`font-bold mb-3 ${col.highlight ? "text-emerald-800" : "text-gray-700"}`}>
                    {col.label}
                  </h3>
                  <div className="space-y-1.5 mb-3">
                    {col.rows.map((r, i) => (
                      <div key={i} className="flex justify-between gap-2">
                        <span className="text-gray-600">{r.item}</span>
                        <span className={`font-semibold tabular-nums ${r.amount.startsWith("+") ? "text-emerald-700" : r.amount.startsWith("−") ? "text-red-600" : "text-gray-500"}`}>
                          {r.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={`border-t pt-2 font-bold text-lg ${col.highlight ? "text-emerald-700 border-emerald-200" : "text-gray-700 border-gray-200"}`}>
                    Čistá: {col.net}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Odhady na základe WML 40h/týždeň, štandardného SNF ubytovania a daňových sadzieb 2026.
              Skutočné sumy sa líšia podľa fázy zmluvy a individuálnej daňovej situácie.
            </p>
          </section>

          {/* ── Krok za krokom ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Krok za krokom: od Slovenska po prvú výplatnú pásku</h2>
            <div className="space-y-4">
              {STEPS.map((s) => (
                <div key={s.step} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-5 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Obľúbené mestá ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Kde slovenský pracovníci zvyčajne pracujú</h2>
            <p className="text-gray-600 text-sm mb-4">
              Väčšina slovenských pracovníkov je umiestnená v provincii Severní Brabant a Limburg —
              bližšie k Belgicku a Nemecku, so silným logistickým sektorom a etablovanými komunitami
              z východnej Európy. Eindhoven má obzvlášť silnú a dlhodobú slovenskú komunitu.
            </p>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {POPULAR_CITIES.map((c, i) => (
                <div key={i} className={`flex gap-4 px-5 py-3 text-sm items-start ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <span className="font-semibold text-gray-900 w-32 shrink-0">{c.city}</span>
                  <span className="text-gray-600">{c.reason}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── RegioJet callout ── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm">
            <p className="font-bold text-blue-800 mb-1">🚌 RegioJet a FlixBus — priamo z Bratislavy</p>
            <p className="text-blue-700 leading-relaxed">
              RegioJet a FlixBus prevádzkujú priame spoje Bratislava → Amsterdam a Bratislava →
              Eindhoven. Cesta trvá 14–18 hodín a je najlacnejšia možnosť prepravy. Väčšina
              slovenských pracovníkov cestuje práve autobusom pri prvom nástupe do práce.
              Uistite sa, že máte potvrdenie o adrese ubytovania pred odchodom — agentúra
              vám ho musí poskytnúť vopred.
            </p>
          </div>

          {/* ── CTA ── */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Pre slovenských pracovníkov</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Nájdite overenú agentúru prijímajúcu zo Slovenska práve teraz
            </h2>
            <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
              Všetky agentúry na AgencyCheck zobrazujú odpočty pred podaním žiadosti — náklady
              na ubytovanie (huisvesting), dopravu a či je ET príspevok zahrnutý. Bezplatná
              žiadosť cez WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/vacancies"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Prehliadnuť voľné miesta →
              </Link>
              <Link
                href="/sk"
                className="inline-block bg-white border border-gray-300 hover:border-emerald-400 text-gray-800 font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Slovenská domovská stránka →
              </Link>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Často kladené otázky</h2>
            <div className="space-y-5">
              {FAQS.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{f.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Súvisiace ── */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-base font-bold text-gray-700 mb-4">Súvisiace sprievodcovia</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/sk", label: "Slovenská domovská stránka AgencyCheck" },
                { href: "/vacancies", label: "Prehliadnuť voľné miesta v Holandsku" },
                { href: "/minimum-wage-netherlands-2026", label: "Minimálna mzda Holandsko 2026 (EN)" },
                { href: "/et-scheme-netherlands-explained", label: "ET schéma — až €150/týž. čistého navyše (EN)" },
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
