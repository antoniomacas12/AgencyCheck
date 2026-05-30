import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Минимална Заплата Нидерландия 2026 — Почасова и Месечна Ставка за Работниците",
  description:
    "Холандската минимална заплата (WML) за 2026: точната почасова ставка, месечна сума, как loonheffing и удръжките влияят на реалното ти нетно заплащане и какво трябва законно да плащат агенциите.",
  alternates: {
    canonical: "https://agencycheck.io/minimum-wage-netherlands-2026",
    languages: { "bg": "https://agencycheck.io/bg/minimalna-zaplata-niderlandiya-2026" },
  },
  openGraph: {
    title: "Минимална Заплата Нидерландия 2026 — Реалното ти Нетно Заплащане",
    description:
      "WML Нидерландия 2026: почасова ставка, месечно бруто, нетно след данъци. Какво трябва да включват агенциите, какво могат законно да приспадат.",
  },
};

// ─── Ставки WML ───────────────────────────────────────────────────────────────
const WML_RATES = [
  { period: "На час (40ч/седм.)",      gross: "€13,68",     note: "Важи за всички работници 21+ независимо от националност" },
  { period: "На час (38ч/седм.)",      gross: "€14,40",     note: "Ако договорът ти посочва 38-часова работна седмица" },
  { period: "На час (36ч/седм.)",      gross: "€15,20",     note: "Зависи от колективния договор (CAO)" },
  { period: "На седмица (40ч)",        gross: "€547,20",    note: "Преди loonheffing, осигуровки и удръжки" },
  { period: "На месец (40ч)",          gross: "€2.373",     note: "52 седмици × €547,20 ÷ 12" },
  { period: "Vakantiegeld (8%)",       gross: "+€189/мес.", note: "Натрупва се месечно, изплаща се през май (ABU CAO) или при поискване" },
];

// ─── Законни удръжки ─────────────────────────────────────────────────────────
const LEGAL_DEDUCTIONS = [
  {
    icon: "🏠",
    label: "Настаняване (huisvesting)",
    max: "€113,50/седм.",
    rule: "Максимум SNF за 2026 — само ако настаняването действително е осигурено и сертифицирано от SNF. Не може да надвишава 25% от почасовата бруто ставка × отработените часове.",
    allowed: true,
  },
  {
    icon: "🚌",
    label: "Транспорт (vervoerskosten)",
    max: "Реална стойност",
    rule: "Може да се приспадне само ако агенцията организира транспорта. Трябва да е вписан в loonstrook. Не може да включва марж на печалба от транспорта.",
    allowed: true,
  },
  {
    icon: "🏥",
    label: "Здравна застраховка (zorgverzekering)",
    max: "~€170/мес.",
    rule: "Колективните здравни схеми на агенцията са законни удръжки само ако си дал съгласие. Основната холандска здравна застраховка (basisverzekering) е законово задължителна след започване на работа в Нидерландия.",
    allowed: true,
  },
  {
    icon: "❌",
    label: "Такса за набиране / трудово посредничество",
    max: "€0",
    rule: "Напълно забранено. От 2024 г. (изменение на WAADI — Wet Toelating Terbeschikkingstelling van Arbeidskrachten) агенциите не могат да таксуват работниците за намиране на работа. Докладвайте нарушения в Inspectie SZW.",
    allowed: false,
  },
  {
    icon: "❌",
    label: "Работно облекло / uniform",
    max: "€0",
    rule: "Не може да се таксува работникът ако облеклото е задължително за работата (предпазна жилетка, обувки с метален бомбе за склад). Маркираното незадължително облекло може да се таксува само с писмено съгласие.",
    allowed: false,
  },
  {
    icon: "❌",
    label: "Такси за документи / регистрация",
    max: "€0",
    rule: "Административните разходи за обработка на регистрацията ти, проверка на BSN или настройка на DigiD не могат да се таксуват. Забранено съгласно чл. 12 от Wet minimumloon (WML).",
    allowed: false,
  },
];

// ─── Пример нетна заплата ─────────────────────────────────────────────────────
const NET_EXAMPLE = [
  { label: "Брутна седмична заплата (40ч @ WML)",                        amount: "+€547",  plus: true  },
  { label: "Loonheffing (данък доход, с heffingskorting)",                amount: "−€60",   plus: false },
  { label: "Вноска WW (застраховка безработица)",                         amount: "−€22",   plus: false },
  { label: "Вноски ZW/WIA (болест/инвалидност)",                          amount: "−€14",   plus: false },
  { label: "Zorgverzekering (здравна застраховка)",                       amount: "−€40",   plus: false },
  { label: "Huisvesting (SNF настаняване, ако е ползвано)",               amount: "−€95",   plus: false },
  { label: "Транспорт (ако агенцията го организира)",                     amount: "−€25",   plus: false },
  { label: "Nettoloon (нетна заплата на ръка)",                           amount: "≈ €291", plus: true  },
];

// ─── Въпроси и отговори ────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Каква е минималната заплата в Нидерландия за 2026 година?",
    a: "Холандската законова минимална заплата (Wettelijk Minimumloon, WML) за работници на 21 и повече години, работещи 40 часа седмично, е €13,68 на час, €547,20 на седмица и приблизително €2.373 на месец (бруто). Ставките се актуализират от холандското правителство на 1 януари и 1 юли всяка година въз основа на средния ръст на заплатите. От юли 2023 г. минималната заплата се прилага за всички работници над 21 години независимо от възрастта. Всички български работници в Нидерландия — включително тези в Eindhoven, Venlo и Rotterdam — са напълно защитени от WML.",
  },
  {
    q: "Еднаква ли е минималната заплата за работниците от ЕС и холандците?",
    a: "Да. Холандският WML важи за всички работници в Нидерландия независимо от националност. Полски, румънски, български, словашки и всякакви други граждани на ЕС, работещи в Нидерландия, трябва да получават поне WML. Заплащането под WML е незаконно и може да бъде докладвано в Инспектората по труда (Inspectie SZW / Netherlands Labour Authority). Колективните трудови договори CAO ABU и CAO NBBU, регулиращи агентурния труд, също определят WML като законов минимум.",
  },
  {
    q: "Може ли агенция да плаща под минималната заплата, като приспадне настаняване и транспорт?",
    a: "Не. Удръжките за настаняване и транспорт са предмет на строги ограничения и не могат да намалят нетната ти заплата под законовата нетна минимална заплата. Максималната удръжка за настаняване е €113,50/седмица (максимум SNF за 2026) и може да се прилага само ако действително живееш в осигуреното от агенцията жилище. Ако подозираш, че нетната ти заплата след удръжки е под законовия минимум, можеш да подадеш сигнал до Inspectie SZW или да се свържеш с профсъюза FNV.",
  },
  {
    q: "Какво е vakantiegeld и добавя ли се към минималната заплата?",
    a: "Vakantiegeld (отпуско обезщетение) е допълнителни 8% от годишната ти брутна заплата, изискван по закон съгласно чл. 15 от Wet minimumloon. За работник на пълен работен ден с WML това е около €189/месец, изплатени като еднократна сума през май съгласно ABU CAO или включени в почасовата ставка при NBBU фазови договори. Добавя се към редовната ти заплата, не е включено в нея — ефективната почасова ставка включваща vakantiegeld е около €14,77/час при WML.",
  },
  {
    q: "Трябва ли ми лична карта за работа в Нидерландия?",
    a: "Да. Лична карта (Bulgarian national ID / лична карта) или паспорт е основният документ, необходим за работа в Нидерландия като гражданин на ЕС. България е пълноправен член на ЕС, затова не са необходими виза или разрешение за работа. Агенцията ти е законово задължена да регистрира номера на документа ти. Никога не предавай оригиналния документ на агенцията — те могат да видят документа, но не трябва да го задържат. Съхранявай копие на лична карта за нуждите на BSN регистрацията.",
  },
];

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Минимална Заплата Нидерландия 2026 — Почасова и Месечна Ставка",
      "description": "Холандски WML за 2026: точни ставки, законни удръжки, примери за нетна заплата и права на работниците от България.",
      "url": "https://agencycheck.io/bg/minimalna-zaplata-niderlandiya-2026",
      "datePublished": "2026-01-01",
      "dateModified": "2026-05-01",
      "inLanguage": "bg",
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
        { "@type": "ListItem", "position": 1, "name": "Начало",   "item": "https://agencycheck.io/bg" },
        { "@type": "ListItem", "position": 2, "name": "Ръководства", "item": "https://agencycheck.io/guides" },
        { "@type": "ListItem", "position": 3, "name": "Минимална Заплата Нидерландия 2026" },
      ],
    },
  ],
};

export default function MininmalnaZaplataNiderlandiya2026Page() {
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
            <Link href="/bg" className="hover:text-gray-300 transition-colors">Начало</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300 transition-colors">Ръководства</Link>
            <span>/</span>
            <span className="text-gray-200">Минимална Заплата 2026</span>
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-10 pt-4">
            <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🇳🇱 Холандско трудово право — Обновено 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Минимална Заплата Нидерландия 2026
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Холандската законова минимална заплата (WML — Wettelijk Minimumloon) определя
              законовия минимум за всички работници в Нидерландия. Ето точните данни за 2026:
              какво агенциите могат и не могат да приспадат, и как изглежда реалното ти нетно
              заплащане.
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 space-y-14">

          {/* ── Бележка за българи ── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm">
            <p className="font-bold text-blue-800 mb-1">🇧🇬 Български работници в Нидерландия — пълна защита от WML</p>
            <p className="text-blue-700 leading-relaxed">
              Хиляди българи работят в Нидерландия — особено в Eindhoven, Rotterdam и
              Venlo. Независимо дали работиш в склад, оранжерия или производство, WML се
              прилага изцяло. Представи лична карта при регистрация — не е нужна виза или
              разрешение за работа. Ако агенцията ти плаща под €13,68/час, тя нарушава
              холандското законодателство.
            </p>
          </div>

          {/* ── Таблица ставки ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ставки WML за 2026</h2>
            <p className="text-gray-600 text-sm mb-5">
              Ставките по-долу важат за работници на 21+. От юли 2023 г. WML се прилага
              еднакво за всички независимо от възраст. Правителството актуализира ставките на{" "}
              <strong>1 януари</strong> и <strong>1 юли</strong> всяка година.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Период</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Брутна сума</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Бележки</th>
                  </tr>
                </thead>
                <tbody>
                  {WML_RATES.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-medium text-gray-900">{r.period}</td>
                      <td className="px-4 py-3 font-bold text-emerald-700">{r.gross}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Източник: Rijksoverheid.nl — Wettelijk minimumloon от 1 януари 2026.
              Ставките се актуализират два пъти годишно. Проверете rijksoverheid.nl след юли 2026.
            </p>
          </section>

          {/* ── Нетна заплата ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Какво реално получаваш в банковата сметка</h2>
            <p className="text-gray-600 text-sm mb-5">
              Брутната заплата не е сумата, която пристига в банковата ти сметка. Ето реалистичен
              седмичен разбивка за агентурен работник с WML, настаняване и транспорт от агенцията
              — най-честата схема.
            </p>
            <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {NET_EXAMPLE.map((row, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center px-5 py-3 text-sm ${
                    i === NET_EXAMPLE.length - 1
                      ? "bg-emerald-50 border-t-2 border-emerald-200 font-bold"
                      : i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <span className={i === NET_EXAMPLE.length - 1 ? "text-gray-900 font-bold" : "text-gray-700"}>
                    {row.label}
                  </span>
                  <span className={`font-semibold tabular-nums ${row.plus ? "text-emerald-700" : "text-red-600"}`}>
                    {row.amount}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Оценки въз основа на ставките за 2026. Loonheffing изчислен с algemene heffingskorting и
              arbeidskorting. Реалните суми варират според отработените часове, фазата на договора и
              условията на удръжките. Винаги проверявай собствения си loonstrook.
            </p>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-blue-800 mb-1">💡 ET vergoeding може да добави €50–€150/седмица</p>
              <p className="text-blue-700">
                Ако живееш на повече от 150 км от холандската граница (България е на над 2.000 км),
                може да се квалифицираш за ET (Extraterritoriale kosten) обезщетение — необлагаемо
                с данък обезщетение, което значително увеличава нетното ти заплащане. Не всички
                агенции го прилагат автоматично.{" "}
                <Link href="/bg/et-schema-niderlandiya" className="underline font-semibold">
                  Виж нашето ръководство за ET схемата →
                </Link>
              </p>
            </div>
          </section>

          {/* ── Законни удръжки ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Какво агенциите могат и не могат да удържат</h2>
            <p className="text-gray-600 text-sm mb-5">
              Холандският закон строго ограничава какво може да бъде удържано от заплатата ти.
              Съгласно Wet minimumloon (чл. 12) и WAADI (изменение 2024), тези правила важат за
              всички агентурни работници в Нидерландия, включително гражданите на България.
            </p>
            <div className="space-y-3">
              {LEGAL_DEDUCTIONS.map((d, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-4 text-sm flex gap-3 ${
                    d.allowed ? "bg-white border-gray-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <span className="text-2xl shrink-0">{d.icon}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{d.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        d.allowed ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      }`}>
                        {d.allowed ? `Макс: ${d.max}` : "ЗАБРАНЕНО"}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{d.rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CAO ABU/NBBU ── */}
          <section className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-3">CAO ABU и CAO NBBU — Над WML</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Повечето агентурни работници в Нидерландия са наети по{" "}
              <strong className="text-white">CAO ABU</strong> (по-големите агенции) или{" "}
              <strong className="text-white">CAO NBBU</strong> (по-малките агенции). И двата
              договора определят правила за заплащане над законовия WML:
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Фаза A (седмици 1–26):</strong> Минималния WML.
                  След седмица 26 преминаваш към Фаза B, която може да носи по-високи ставки по loonschaal.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Inlenersbeloning:</strong> След 26 седмици при
                  същия клиент имаш право на същото заплащане като директно наетите служители
                  (чл. 8, WAADI). Това обикновено означава увеличение.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Overwerktoeslag:</strong> Извънреден труд (над 40ч/седм.)
                  се заплаща на 125% за първите 8 допълнителни часа, 150% след 9-тия (CAO ABU).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Vakantiegeld:</strong> 8% отпуско обезщетение —
                  законово задължително, трябва да фигурира в loonstrook като отделна позиция
                  (vakantiegeld opbouw).
                </span>
              </li>
            </ul>
          </section>

          {/* ── Контролен списък ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Контролен списък: Плаща ли правилно твоята агенция?</h2>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {[
                "Почасовата ти ставка е поне €13,68 (40ч/седм.) или €14,40 (38ч/седм.)",
                "Vakantiegeld (8%) фигурира като отделна позиция в loonstrook",
                "Loonheffing се изчислява с твоя BSN — не по аварийната ставка anoniementarief",
                "Удръжката за настаняване не надвишава €113,50/седмица (максимум SNF)",
                "Всички удръжки са ти представени писмено преди подписването на arbeidsovereenkomst",
                "Не се удържа такса за 'посредничество', 'набиране' или 'документи'",
                "Извънредните часове са отбелязани като overwerk и се заплащат на 125% или повече",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 text-sm">
                  <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Не знаеш как да четеш loonstrook?{" "}
              <Link href="/bg/loonstrook" className="text-blue-600 underline font-medium">
                Виж пълното ни ръководство за loonstrook →
              </Link>
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Намери верифицирана агенция</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Работи в Нидерландия с пълно WML — с прозрачни удръжки
            </h2>
            <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
              Всички агенции в AgencyCheck показват удръжките предварително. SNF-сертифицирано
              настаняване, без такси за посредничество, договори (loonstrook и arbeidsovereenkomst)
              проверени преди подписване. Безплатно кандидатстване чрез WhatsApp.
            </p>
            <Link
              href="/vacancies"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Разгледай обяви при верифицирани агенции →
            </Link>
          </section>

          {/* ── Въпроси и отговори ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Често задавани въпроси</h2>
            <div className="space-y-5">
              {FAQS.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{f.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Свързани ── */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-base font-bold text-gray-700 mb-4">Свързани ръководства</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/bg/loonstrook",                   label: "Как да четеш холандски loonstrook" },
                { href: "/bg/et-schema-niderlandiya",        label: "ET схема — до €150/седм. нетно допълнително" },
                { href: "/bg/bsn-nomer-niderlandiya",        label: "BSN номер — как да го получиш бързо" },
                { href: "/vacancies",                         label: "Разгледай обяви в Нидерландия" },
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
