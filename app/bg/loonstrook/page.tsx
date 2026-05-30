import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Как да четем холандски фиш за заплата (Loonstrook) — Обяснение 2026",
  description:
    "Всеки ред от холандския loonstrook обяснен на български: brutoloon, loonheffing, heffingskorting, vakantiegeld, ET toeslag и още. С примери при WML (€14,71/час).",
  alternates: {
    canonical: "https://agencycheck.io/bg/loonstrook",
    languages: { en: "https://agencycheck.io/how-to-read-dutch-payslip" },
  },
  openGraph: {
    title: "Холандски loonstrook — всеки ред обяснен 2026",
    description:
      "Объркан от своя loonstrook? Всеки ред обяснен с реални числа — brutoloon, nettoloon, vakantiegeld, ET toeslag, heffingskorting.",
  },
};

export const dynamic = "force-static";

// ─── Полета на loonstrook ─────────────────────────────────────────────────────
const LOONSTROOK_FIELDS = [
  {
    term: "Brutoloon",
    english: "Брутна заплата",
    example: "+€588,40",
    positive: true,
    explain:
      "Общите ви доходи преди всякакви удръжки. При WML (€14,71/час × 40 часа/седм.) това е €588,40/седм. Това е числото, което агенциите рекламират — не това, което получавате в сметката.",
  },
  {
    term: "Vakantiegeld (8%)",
    english: "Добавка за отпуск",
    example: "+€47,07",
    positive: true,
    explain:
      "Законово задължителни 8% от брутната заплата, натрупвани седмично и изплащани веднъж годишно (обикновено май/юни) или месечно. Това са ВАШИТЕ пари — агенциите трябва да ги изплащат съгласно холандското право (Burgerlijk Wetboek чл. 7:634).",
  },
  {
    term: "Loonheffing",
    english: "Данък върху заплатата (данък върху дохода + социално осигуряване)",
    example: "−€63,20",
    positive: false,
    explain:
      "Комбинираният холандски данък върху дохода и премията за социална осигуровка (volksverzekeringen: AOW, Anw, Wlz). Удържа се от работодателя ви за всеки период. За повечето чуждестранни работници при WML ефективната ставка след heffingskorting е около 10–15%, не 37%.",
  },
  {
    term: "Heffingskorting",
    english: "Данъчен кредит",
    example: "+€38,50",
    positive: true,
    explain:
      "Законоустановен данъчен кредит, който намалява вашия loonheffing. Има два: arbeidskorting (данъчен кредит за труд, до €5 158/год.) и algemene heffingskorting (общ данъчен кредит, до €3 362/год.). Ако работодателят прилага и двата, запазвате значително повече. Попитайте вербувача да потвърди, че и двата се прилагат.",
  },
  {
    term: "WW-premie werknemer",
    english: "Осигурителна вноска за безработица (дял на служителя)",
    example: "−€7,06",
    positive: false,
    explain:
      "Вашата вноска като служител към WW (Werkloosheidswet — холандско осигуряване при безработица). Ставката за временни работници в агенции (uitzendbeding) е по-висока от тази за постоянни работници. Приспада се от брутото преди изчисляване на nettoloon.",
  },
  {
    term: "ET vergoeding / ET toeslag",
    english: "Обезщетение за екстериториални разходи",
    example: "+€80,00",
    positive: true,
    explain:
      "Обезщетението ET (Extraterritoriale kosten) е необлагаемо обезщетение за 'екстериториални разходи' — допълнителни разходи за живот извън родната страна. Може да струва €50–€150/седм. НЕТО и е достъпно само за работници, живеещи на повече от 150 км от холандската граница. НЕ всички агенции го прилагат. Вижте нашето ръководство за ET за пълни подробности.",
  },
  {
    term: "Huisvesting / Woning",
    english: "Приспадане за жилище",
    example: "−€95,00",
    positive: false,
    explain:
      "Седмичната цена на настаняването, предоставено от агенцията, приспадана директно от брутото. Законовият максимум на SNF (Stichting Normering Flexwonen) за сертифицирано споделено настаняване е €113,50/седм. (2026). Тази сума трябва да съответства точно на това, което е написано в договора ви — нито стотинка повече.",
  },
  {
    term: "Zorgverzekering",
    english: "Здравноосигурителна вноска",
    example: "−€35,00",
    positive: false,
    explain:
      "Холандската здравна застраховка (basisverzekering) е задължителна за всички работници в Нидерландия. Много агенции предоставят колективна застраховка и приспадат вноската (обикновено €28–€40/седм.) директно. Трябва да получите потвърждение за покритието в рамките на първите две седмици. Пазете този документ.",
  },
  {
    term: "Transport / Reiskosten",
    english: "Транспорт до работа",
    example: "−€25,00",
    positive: false,
    explain:
      "Цената на автобуса на агенцията или транспорта до работното място, ако се начислява. Съгласно правилата на CAO трябва да се появи като отделен ред — не може да бъде включен в жилището. Типичен диапазон: €20–€35/седм. Ако в договора ви пише, че транспортът е включен, този ред не трябва да се появява.",
  },
  {
    term: "Nettoloon",
    english: "Нетна заплата (получена на ръка)",
    example: "€363,00",
    positive: true,
    explain:
      "Сумата, преведена в банковата ви сметка. Това е brutoloon минус всички приспадания (данък, жилище, застраховка, транспорт) плюс кредити (heffingskorting, ET toeslag ако е приложимо). При WML без ET обезщетение типичното нето е €310–€370/седм. С приложен ET може да бъде €380–€450/седм.",
  },
];

// ─── Съкращения ───────────────────────────────────────────────────────────────
const ABBREVIATIONS = [
  { abbr: "WML",  full: "Wettelijk Minimumloon",             eng: "Законова минимална заплата (€14,71/час през 2026)" },
  { abbr: "CAO",  full: "Collectieve Arbeidsovereenkomst",    eng: "Колективен трудов договор (определя вашите права)" },
  { abbr: "ABU",  full: "Alg. Bond Uitzendondernemingen",     eng: "Основна асоциация на индустрията за временна заетост" },
  { abbr: "SNF",  full: "St. Normering Flexwonen",           eng: "Независим орган за инспекция на жилища" },
  { abbr: "BSN",  full: "Burgerservicenummer",               eng: "Вашият холандски граждански сервизен номер (данъчен идентификатор)" },
  { abbr: "ET",   full: "Extraterritoriale kosten",          eng: "Екстериториални разходи — необлагаемо обезщетение" },
  { abbr: "VGU",  full: "Vakantiegeld uitbetaling",          eng: "Изплащане на отпуска" },
  { abbr: "AOW",  full: "Algemene Ouderdomswet",             eng: "Вноска за холандска държавна пенсия" },
  { abbr: "WW",   full: "Werkloosheidswet",                  eng: "Осигурителна вноска за безработица" },
  { abbr: "Wlz",  full: "Wet langdurige zorg",              eng: "Застраховка за дългосрочна грижа" },
  { abbr: "BWA",  full: "Bijzondere beloningen werknemer",   eng: "Специални обезщетения за служители (напр. бонус в края на годината)" },
];

// ─── Контролен списък ─────────────────────────────────────────────────────────
const CHECKLIST = [
  { check: "Brutoloon съответства на договорената часова ставка × отработените часове за този период" },
  { check: "Vakantiegeld (добавка за отпуск) от точно 8% е показан — не 0% или липсващ" },
  { check: "Heffingskorting е приложен — и arbeidskorting, И algemene heffingskorting" },
  { check: "Приспадането за huisvesting съответства точно на това, което е в договора ви — нито стотинка повече" },
  { check: "Транспортът се появява като собствен ред, ако се начислява — не е скрит в жилището" },
  { check: "ET vergoeding се появява, ако живеете на >150 км от холандската граница" },
  { check: "Nettoloon съответства на банковия превод, който сте получили" },
  { check: "Получили сте този фиш в рамките на 5 дни след датата на плащане" },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Каква е разликата между brutoloon и nettoloon?",
    a: "Brutoloon е вашата брутна заплата — общото, което сте спечелили преди каквито и да е приспадания. Nettoloon е действителното ви плащане на ръка след приспадане на холандския данък върху дохода (loonheffing), премиите за социално осигуряване, жилището, транспорта и здравната застраховка. При WML (€14,71/час, 40 часа/седм.) brutoloon е €588/седм., а типичното nettoloon е €310–€370/седм. без схемата ET.",
  },
  {
    q: "Какво е vakantiegeld и кога го получавам?",
    a: "Vakantiegeld (добавка за отпуск) е задължителни 8% от брутната заплата, изисквани от холандското право (BW чл. 7:634). Повечето агенции го натрупват за всеки платежен период и го изплащат веднъж годишно, обикновено през май или юни. Някои агенции го изплащат месечно. Така или иначе, 8% трябва да се показват на всеки фиш. Ако липсват, поискайте писмено обяснение.",
  },
  {
    q: "Защо моят loonheffing е много по-нисък от 37% данъчна ставка?",
    a: "Холандската данъчна ставка от 37% се прилага за годишен доход над праг. При WML за 40-часова седмица (около €30 600/год. бруто) сте в по-ниска данъчна скоба. Освен това heffingskorting (данъчни кредити — arbeidskorting плюс algemene heffingskorting) може да намали ефективната ви ставка до 10–15%. Ако имате право и на ET обезщетение, ефективният данък може да падне под 5% върху възстановената част.",
  },
  {
    q: "Може ли агенцията ми да приспада повече от това, което е в договора ми?",
    a: "Не. Съгласно холандското право и CAO ABU/NBBU, приспадания могат да се правят само за услуги, изрично изброени и оценени в подписания договор. Допълнителни приспадания за спално бельо, почистване или администрация, които не са били уточнени преди подписването, не са разрешени. Ако видите неочаквани удръжки, поискайте писмено обяснение и ако е необходимо, се свържете с Inspectie SZW (inspectieszw.nl) или FNV.",
  },
  {
    q: "Фишът ми показва нула ET vergoeding — губя ли пари?",
    a: "Вероятно. Обезщетението ET (Extraterritoriale kosten) се прилага за работници, живеещи на повече от 150 км от холандската граница и намиращи се в Нидерландия от по-малко от 5 години. Ако отговаряте на тези критерии и вашият фиш не показва ET vergoeding, попитайте вербувача на агенцията директно. Не всички агенции го прилагат, дори когато работниците имат право. Преминаването към агенция, която го прилага, може да увеличи нетния ви доход с €50–€150/седм.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Как да четем холандски фиш за заплата (Loonstrook) — Обяснение 2026",
  description: "Пълно обяснение на всяко поле в холандски фиш за заплата на работник в агенция, с примери при WML (€14,71/час).",
  author: { "@type": "Organization", name: "AgencyCheck" },
  publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
  datePublished: "2026-01-01",
  dateModified: "2026-05-01",
  inLanguage: "bg",
  url: "https://agencycheck.io/bg/loonstrook",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Начало", item: "https://agencycheck.io/bg" },
    { "@type": "ListItem", position: 2, name: "Ръководства", item: "https://agencycheck.io/guides" },
    { "@type": "ListItem", position: 3, name: "Loonstrook обяснен", item: "https://agencycheck.io/bg/loonstrook" },
  ],
};

export default async function LoonstrookBg() {
  const featuredAgencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-950 text-white border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-12">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/bg" className="hover:text-gray-300 transition-colors">Начало</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300 transition-colors">Ръководства</Link>
            <span>/</span>
            <span className="text-gray-400">Loonstrook обяснен</span>
          </nav>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3">Ръководство за заплати 2026</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            Как да четем холандски фиш за заплата<br className="hidden sm:block" />
            <span className="text-emerald-400"> (Loonstrook)</span> — всеки ред обяснен
          </h1>
          <p className="text-base text-gray-300 leading-relaxed mb-6">
            Всеки работник в агенция в Нидерландия получава <strong className="text-white">loonstrook</strong> (фиш за заплата) всяка седмица или месец.
            Повечето работници разбират само първия и последния ред — бруто и нето. 8–12-те реда между тях
            определят дали сте платени правилно. Това ръководство обяснява всеки от тях.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {[
              "WML 2026: €14,71/час",
              "Vakantiegeld: задължителни 8%",
              "SNF макс. жилище: €113,50/седм.",
              "ET обезщетение: до €150/седм.",
            ].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-semibold text-gray-300">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Примерен loonstrook ──────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
            Пример: работник при WML, 40 часа/седмица
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Въз основа на холандската законова минимална заплата (WML) от €14,71/час през 2026. Числата варират леко в зависимост от агенцията и продължителността на периода.
          </p>

          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 px-5 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Loonstrook — Примерна седмица · WML €14,71/час · 40 часа · Жилище и транспорт от агенцията включени
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {LOONSTROOK_FIELDS.map((f) => (
                <div key={f.term} className={`px-5 py-4 ${f.term === "Nettoloon" ? "bg-emerald-50" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-gray-900">{f.term}</span>
                        <span className="text-[10px] font-semibold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">{f.english}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{f.explain}</p>
                    </div>
                    <span className={`shrink-0 text-sm font-black tabular-nums ${f.positive ? "text-emerald-600" : "text-red-500"} ${f.term === "Nettoloon" ? "text-emerald-700 text-base" : ""}`}>
                      {f.example}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
              <p className="text-[11px] text-gray-400">
                * Показаното ET vergoeding се прилага, ако живеете на повече от 150 км от холандската граница и сте в Нидерландия от по-малко от 5 години.{" "}
                <Link href="/bg/et-schema-niderlandiya" className="text-blue-600 underline">Вижте пълното ръководство за ET →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Таблица с съкращения ─────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Чести съкращения в холандски фишове за заплата</h2>
          <p className="text-sm text-gray-500 mb-6">
            Холандските фишове за заплата използват много съкращения. Ето тези, които ще виждате най-често.
          </p>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {ABBREVIATIONS.map((a) => (
                <div key={a.abbr} className="grid grid-cols-[60px_1fr_1fr] gap-3 px-5 py-3 items-start">
                  <span className="text-sm font-black text-gray-900 font-mono">{a.abbr}</span>
                  <span className="text-xs text-gray-700">{a.full}</span>
                  <span className="text-xs text-gray-500">{a.eng}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Контролен списък ─────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">8-точкова проверка на фиша — правете го всеки платежен период</h2>
          <p className="text-sm text-gray-500 mb-6">
            Отнема 5 минути. Улавя грешки преди да се натрупат. Работодателят ви е законово задължен да ви даде фиш — ако не получавате такъв, поискайте го писмено.
          </p>
          <ul className="space-y-3">
            {CHECKLIST.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5">
                <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                <span className="text-sm text-gray-700 leading-snug">{item.check}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Открили несъответствие?</strong> Първо поискайте от вербувача на агенцията писмено обяснение.
              Ако не се реши, свържете се с <strong>Inspectie SZW</strong> на{" "}
              <a href="https://www.inspectieszw.nl" target="_blank" rel="noopener noreferrer" className="underline">inspectieszw.nl</a>{" "}
              или <strong>FNV</strong> (основният холандски синдикат, безплатен за работниците) на{" "}
              <a href="https://www.fnv.nl" target="_blank" rel="noopener noreferrer" className="underline">fnv.nl</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ── ET callout ───────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-6">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-200 rounded-full px-3 py-1 text-[11px] font-black text-amber-800 uppercase tracking-wide mb-4">
              Повечето работници пропускат това
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-2">
              Има ли &ldquo;ET vergoeding&rdquo; на вашия фиш? Ако не — може да губите €50–€150/седм.
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Схемата ET (Extraterritoriale kosten) е законово необлагаемо обезщетение, достъпно за работници,
              живеещи на повече от 150 км от холандската граница. Може да добави €50–€150/седм. към нетния ви доход,
              покривайки част от допълнителните разходи за работа в чужбина. Не е автоматично — агенцията
              трябва да го приложи. Много не го правят.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/bg/et-schema-niderlandiya"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors px-5 py-2.5 text-sm font-black text-white active:scale-[0.98]">
                Прочетете пълното ръководство за ET →
              </Link>
              <Link href="/tools/real-salary-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition-colors px-5 py-2.5 text-sm font-bold text-amber-800">
                Изчислете реалния си нетен доход →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-8">Често задавани въпроси</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white px-5 py-5">
                <h3 className="text-sm font-black text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agency CTA ───────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="text-center mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Кандидатствайте чрез AgencyCheck</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Намерете агенция с прозрачни договори</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Всяка агенция в AgencyCheck показва седмичните нетни оценки, разходите за жилище и условията на договора предварително.
              Безплатно кандидатстване чрез WhatsApp — отговор в същия ден.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {featuredAgencies.map((agency) => (
              <AgencyCard
                key={agency.slug}
                agency={agency}
                jobCount={getJobCountForAgency(agency.slug)}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/vacancies"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-6 py-3 text-sm font-bold text-gray-700">
              Разгледайте всички свободни работни места →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Свързани ръководства ─────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-base font-black text-gray-900 mb-4">Свързани ръководства</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/bg/et-schema-niderlandiya",  label: "Схема ET в Нидерландия — пълно ръководство" },
              { href: "/bg/bsn-nomer-niderlandiya",   label: "Как да получите своя BSN номер" },
              { href: "/after-you-apply",              label: "Какво се случва след като кандидатствате" },
              { href: "/what-is-order-picking",        label: "Ордър пикинг — заплата и условия" },
              { href: "/tools/real-salary-calculator", label: "Калкулатор на нетна заплата" },
              { href: "/methodology",                  label: "Как AgencyCheck проверява агенциите" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors px-4 py-3 text-sm font-semibold text-gray-700">
                <span className="text-gray-400">→</span> {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
