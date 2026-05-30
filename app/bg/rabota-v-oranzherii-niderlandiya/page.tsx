import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Работа в Оранжерии Нидерландия 2026 — Заплата, Сезони и Какво да Очакваш",
  description:
    "Работа в оранжерии (glastuinbouw) в Нидерландия: кои региони наемат, какво включва работата, ставки над WML, сезонни пикове и как да намериш верифицирана агенция. Ръководство за българи.",
  alternates: {
    canonical: "https://agencycheck.io/greenhouse-work-netherlands",
    languages: { "bg": "https://agencycheck.io/bg/rabota-v-oranzherii-niderlandiya" },
  },
  openGraph: {
    title: "Работа в Оранжерии Нидерландия — Заплата, Локации и Как да Започнеш",
    description:
      "Glastuinbouw е един от най-големите работодатели на работници от ЕС в Нидерландия. Обясняваме заплащането, сезоните, регионите и какво да проверите преди подписване на договор.",
  },
};

// ─── Региони ──────────────────────────────────────────────────────────────────
const REGIONS = [
  {
    name: "Westland / De Lier / Naaldwijk",
    province: "Южна Холандия",
    crop: "Домати, чушки, краставици, маруля",
    note: "Най-големият в света клъстер от оранжерии — над 7.000 хектара стъкло. Повечето международни работници в холандски оранжерии работят тук. Много българи от Eindhoven и Rotterdam работят в Westland.",
    agencies: "Висока концентрация на сертифицирани агенции ABU/NBBU",
  },
  {
    name: "Aalsmeer / Rijnsburg",
    province: "Северна / Южна Холандия",
    crop: "Нарязани цветя, орхидеи, саксийни растения",
    note: "Дом на търга FloraHolland — най-голямата цветарска борса в света. Работата е бърза и включва сортиране, опаковане и търгова логистика.",
    agencies: "Няколко агенции специализирани изцяло в цветарска работа",
  },
  {
    name: "Venlo / Horst aan de Maas",
    province: "Лимбург",
    crop: "Паприка, домати, аспержи, меки плодове",
    note: "Популярно сред работниците от България и Румъния поради близостта до Германия. Venlo е основен логистичен хъб, затова комбинациите оранжерия+склад са чести.",
    agencies: "Много агенции предлагат смесени договори оранжерия+логистика",
  },
  {
    name: "Pijnacker-Nootdorp / Bleiswijk",
    province: "Южна Холандия",
    crop: "Домати, камбанки, билки",
    note: "Растяща зона до Westland. По-нови оранжерии с модерна автоматизация — по-малко физически ръчен труд в сравнение с по-старите обекти.",
    agencies: "Доминират агенции, регистрирани по ABU; активни са и по-малки оператори NBBU",
  },
  {
    name: "Emmen / Klazienaveen",
    province: "Дренте",
    crop: "Краставици, домати, рози",
    note: "По-малко натоварен от клъстерите в Южна Холандия. По-спокоен район с по-ниска цена на живот — може да означава по-ниски удръжки за настаняване (huisvesting).",
    agencies: "По-малко агенции; обикновено директен контакт с производители за по-кратки договори",
  },
];

// ─── Видове работа ────────────────────────────────────────────────────────────
const JOB_TYPES = [
  {
    title: "Растениевъд (plukker / snoeier)",
    icon: "🌿",
    pay: "WML + възможен акорден бонус",
    desc: "Бране (plukken) и подрязване (snoeien) на култури. Физическа, повтаряща се работа — стоене или навеждане по 8-часови смени. Най-честата начална роля в оранжерията. Някои обекти предлагат производствени бонуси за надвишаване на дневната норма на бране.",
  },
  {
    title: "Преработка / опаковане (verwerker / inpakker)",
    icon: "📦",
    pay: "WML, понякога WML +5–10%",
    desc: "Сортиране, класифициране и опаковане на набраните култури за дистрибуция. Обикновено на закрито в опаковачна станция. По-малки физически изисквания от бранетo, но изисква бързина и внимание към качеството.",
  },
  {
    title: "Логистика / вътрешен транспорт (intern transport)",
    icon: "🏎",
    pay: "WML +10–15%, понякога с бонус за диплома heftruck",
    desc: "Местене на продукти в оранжерията или разпределителния център с колички, конвейерни ленти или мотокари (heftruck). Сертификатът heftruck добавя €0,50–€1,50/час към ставката и повишава мобилността между работодателите.",
  },
  {
    title: "Саксийване / размножаване (potterij / vermeerdering)",
    icon: "🪴",
    pay: "WML, понякога малко над",
    desc: "Саксийване на разсади, управление на тавички за размножаване, разстояние между растения. Среща се основно при саксийни растения и декоративни цветя. Работата е целогодишна с по-малки сезонни колебания от бранетo на плодове и зеленчуци.",
  },
  {
    title: "Мониторинг на культури / асистент градинар",
    icon: "🔬",
    pay: "WML +20–40%, изисква опит",
    desc: "Проверка на здравето на растенията, мониторинг на климатични сензори, докладване на главния градинар. Обикновено изисква предишен опит в оранжерия и познаване на холандски или английски. Не е достъпно за нови работници — изисква обикновено 6–12 месеца доказана работа в оранжерия.",
  },
];

// ─── Сезонен календар ─────────────────────────────────────────────────────────
const SEASONS = [
  { month: "Яну–Фев", level: "Нисък",   note: "Основно поддръжка. По-малко свободни позиции." },
  { month: "Мар–Апр", level: "Висок",   note: "Сезон на засаждане — пиково наемане. Начални дати концентрирани в март." },
  { month: "Май–Юни", level: "Висок",   note: "Първи реколти. Дълги смени. Извънреден труд (overwerktoeslag) чест." },
  { month: "Юли–Авг", level: "Среден",  note: "Непрекъснати реколти, но някои обекти затворени за лятна поддръжка." },
  { month: "Сеп–Окт", level: "Висок",   note: "Пик на есенната реколта — второто най-голямо наемно прозорче в годината." },
  { month: "Ное–Дек", level: "Нисък",   note: "Край на сезона. Договорите обикновено приключват октомври–ноември." },
];

// ─── Въпроси и отговори ────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Какво е работа в оранжерии (glastuinbouw) в Нидерландия?",
    a: "Glastuinbouw се отнася до производство на градинарска продукция в стъклени оранжерии — основно зеленчуци (домати, чушки, краставици), цветя (рози, хризантеми, орхидеи) и саксийни растения. Нидерландия притежава най-голямата концентрация на оранжерийно градинарство в света, съсредоточена главно в района Westland–Naaldwijk в Южна Холандия и части от Лимбург. Работата е обикновено физическа, на смени и се извършва по агентурни трудови договори (arbeidsovereenkomst), регулирани от CAO ABU или CAO NBBU.",
  },
  {
    q: "Колко се печели в холандска оранжерия?",
    a: "Повечето роли в оранжерия започват от холандската законова минимална заплата (WML) — €13,68/час бруто за 40-часова работна седмица за 2026 г. Някои роли имат малък производствен бонус (stukloon) за надвишаване на дневни цели. Ролите, изискващи сертификат за мотокар (heftruck) или опит, печелят 10–20% над WML. След 26 седмици в същата оранжерийна компания може да имаш право на inlenersbeloning — същата скала на заплащане като директно наетите служители, което обикновено е над WML по Glastuinbouw CAO.",
  },
  {
    q: "Работата в оранжерия сезонна ли е или целогодишна?",
    a: "Зависи от културата. Оранжериите за зеленчуци (домати, чушки, краставици) имат силни сезонни пикове напролет (засаждане, март–април) и наесен (реколта, септември–октомври), с намалена работа през януари–февруари и ноември–декември. Цветопроизводството и саксийните растения са по-стабилни целогодишно. Ако търсиш зимна заетост, цветарските предприятия около Aalsmeer са най-стабилната опция.",
  },
  {
    q: "Необходимо ли е холандски за работа в оранжерия?",
    a: "Не. По-голямата част от работниците в холандски оранжерии са мигранти от ЕС, а много оперативни инструкции се предават на родния им език или чрез символи. Базов холандски или английски помага при инструктажи по безопасност и взаимодействия с бригадира (voorman/vrouw). Агенцията ти е законово задължена да ти предостави основните условия за безопасност на твоя език (изискване на CAO ABU/NBBU). Личната ти карта (лична карта) е достатъчна за работа — не са нужни виза или разрешение за работа.",
  },
  {
    q: "Мога ли да намеря работа в оранжерия с включено настаняване?",
    a: "Да. Повечето агенции, поставящи работници в оранжерийните клъстери Westland, Venlo и Aalsmeer, включват SNF-сертифицирано настаняване в работния пакет. Настаняването се удържа от брутната заплата максимум €113,50/седмица (максимум SNF за 2026). Всички работници от България — от общностите в Нидерландия или пристигащи директно от страната — се квалифицират за ET vergoeding, тъй като разстоянието от България до Нидерландия надвишава 2.000 км.",
  },
];

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Работа в Оранжерии Нидерландия 2026 — Заплата, Сезони и Какво да Очакваш",
      "description": "Работа glastuinbouw в Нидерландия: региони, видове работа, ставки, сезонен календар и ръководство за агенции за работници от България.",
      "url": "https://agencycheck.io/bg/rabota-v-oranzherii-niderlandiya",
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
        { "@type": "ListItem", "position": 1, "name": "Начало",      "item": "https://agencycheck.io/bg" },
        { "@type": "ListItem", "position": 2, "name": "Ръководства", "item": "https://agencycheck.io/guides" },
        { "@type": "ListItem", "position": 3, "name": "Работа в Оранжерии Нидерландия" },
      ],
    },
  ],
};

export default function RabotaVOranzheriNiderlandiyaPage() {
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
            <span className="text-gray-200">Работа в Оранжерии</span>
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-10 pt-4">
            <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/50 text-green-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🌱 Glastuinbouw — Нидерландия 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Работа в Оранжерии в Нидерландия
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Нидерландия произвежда 65% от европейските оранжерийни зеленчуци и цветя — и наема
              десетки хиляди работници от ЕС, включително много от България. Ето всичко, което
              трябва да знаеш преди да тръгнеш: кои региони наемат, колко плащат, как работи
              сезонността и какво да проверяваш в договора с агенцията.
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 space-y-14">

          {/* ── Бележка за bulgarians ── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm">
            <p className="font-bold text-blue-800 mb-1">🇧🇬 Българска общност в холандските оранжерии</p>
            <p className="text-blue-700 leading-relaxed">
              Хиляди българи работят в оранжерии в Westland, Venlo и около Aalsmeer. При
              регистрация представи лична карта — не е необходима виза или разрешение за
              работа като гражданин на ЕС. Всички работници от България се квалифицират за
              ET vergoeding (необлагаемо обезщетение), тъй като разстоянието от България
              до Нидерландия надвишава 2.000 км.
            </p>
          </div>

          {/* ── Региони ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Къде се намират оранжериите</h2>
            <p className="text-gray-600 text-sm mb-5">
              Оранжерийното градинарство в Нидерландия е силно концентрирано в няколко ключови
              района. Повечето агентурни назначения идват от тези клъстери:
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

          {/* ── Видове работа ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Видове работа и заплащане</h2>
            <p className="text-gray-600 text-sm mb-5">
              Повечето роли в оранжерия са достъпни без познания по холандски или предишен опит.
              Заплащането е на ниво WML или над него в зависимост от ролята.
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

          {/* ── Сезонен календар ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Сезонен календар на наемане</h2>
            <p className="text-gray-600 text-sm mb-5">
              Времето на пристигане е важно. Пролетта и есента са пикови наемни прозорци —
              най-добрият момент за бързо намиране на договор.
            </p>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {SEASONS.map((s, i) => {
                const levelColor =
                  s.level === "Висок"  ? "bg-emerald-100 text-emerald-700" :
                  s.level === "Среден" ? "bg-amber-100 text-amber-700" :
                                         "bg-gray-100 text-gray-500";
                return (
                  <div key={i} className={`flex items-center gap-4 px-5 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <span className="w-24 font-semibold text-gray-800 shrink-0">{s.month}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${levelColor}`}>{s.level}</span>
                    <span className="text-gray-600">{s.note}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Съвети за договора ── */}
          <section className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">Преди да подпишеш: 5 неща за проверка</h2>
            <ol className="space-y-3 text-sm text-gray-300">
              {[
                "Удръжката за huisvesting (настаняване) е написана в евро на седмица — не като % от бъдещи неизвестни заработки",
                "Номерът на SNF сертификата е в договора ти за настаняване или агенцията може да го покаже при поискване",
                "Клаузата ET vergoeding е включена — всички работници от България се квалифицират, тъй като разстоянието надвишава 2.000 км от холандската граница",
                "Твоят arbeidsovereenkomst посочва конкретна оранжерийна компания или регион — неясните договори 'предстои да се определи' са червен флаг",
                "Агенцията е сертифицирана SNA или NEN-4400 — потърси логото SNA или попитай за регистрационния номер",
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
            <p className="font-bold text-blue-800 mb-1">💡 Всички работници от България се квалифицират за ET обезщетение</p>
            <p className="text-blue-700 leading-relaxed">
              България се намира на над 2.000 км от Нидерландия — далеч над основния критерий
              от 150 км за необлагаемото ET (Extraterritoriale kosten) обезщетение. То може да
              добави €50–€150/седмица към нетния ти доход. Не всички агенции го прилагат
              автоматично — питай преди да подпишеш loonstrook.{" "}
              <Link href="/bg/et-schema-niderlandiya" className="underline font-semibold">
                Виж ръководството за ET схемата →
              </Link>
            </p>
          </div>

          {/* ── CTA ── */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Намери работа в оранжерия</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Верифицирани агенции, наемащи в холандски оранжерии точно сега
            </h2>
            <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
              Всички агенции в AgencyCheck включват SNF настаняване, показват удръжките
              предварително и работят по CAO ABU/NBBU. Безплатно кандидатстване чрез WhatsApp
              — отговор същия ден.
            </p>
            <Link
              href="/vacancies"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Виж обяви за работа в оранжерии →
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
                { href: "/bg/minimalna-zaplata-niderlandiya-2026", label: "Минимална заплата Нидерландия 2026" },
                { href: "/bg/loonstrook",                           label: "Как да четеш холандски loonstrook" },
                { href: "/bg/et-schema-niderlandiya",               label: "ET схема — до €150/седм. нетно допълнително" },
                { href: "/vacancies",                                label: "Разгледай обяви в Нидерландия" },
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
