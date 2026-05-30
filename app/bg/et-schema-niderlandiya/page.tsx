import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Схема ET в Нидерландия 2026 — Обяснена за Работници в Агенции (До €150/седм. Повече)",
  description:
    "Схемата ET (екстериториални разходи) може да добави €50–€150/седм. към нетния ви доход в Нидерландия — без данък. Кой отговаря на условията, колко струва и как да проверите дали агенцията ви я прилага.",
  alternates: {
    canonical: "https://agencycheck.io/bg/et-schema-niderlandiya",
    languages: { en: "https://agencycheck.io/et-scheme-netherlands-explained" },
  },
  openGraph: {
    title: "Схема ET в Нидерландия 2026 — До €150/седм. допълнително нето",
    description:
      "Повечето работници в агенции от ЕС отговарят на условията за ET обезщетение, но не знаят за него. Обясняваме кой се квалифицира, колко плаща и как да проверите фиша си.",
  },
};

export const dynamic = "force-static";

// ─── Сравнителна таблица: с ET срещу без ET ──────────────────────────────────
const COMPARISON = [
  { label: "Седмична брутна заплата (WML 40ч)",          without: "€588",  with_et: "€588",  note: null },
  { label: "Loonheffing (данък след кредити)",           without: "−€63", with_et: "−€20",  note: "ET намалява облагаемата основа" },
  { label: "Вноски WW/ZW",                               without: "−€18", with_et: "−€18",  note: null },
  { label: "Здравна застраховка",                        without: "−€35", with_et: "−€35",  note: null },
  { label: "Жилище от агенция (стандарт SNF)",            without: "−€95", with_et: "−€95",  note: null },
  { label: "Транспорт до работа",                        without: "−€25", with_et: "−€25",  note: null },
  { label: "ET vergoeding (необлагаемо обезщетение)",     without: "€0",   with_et: "+€84",  note: "Типичен диапазон €50–€150/седм." },
  { label: "Nettoloon (получено на ръка)",                without: "€352", with_et: "€479",  note: "Разлика +€127/седм." },
];

// ─── Кой отговаря на условията ───────────────────────────────────────────────
const QUALIFICATIONS = [
  {
    icon: "🌍",
    title: "Живеете на повече от 150 км от холандската граница",
    body: "Основният критерий за квалифициране е постоянният ви домашен адрес да е на повече от 150 км от най-близката точка на холандската граница. За повечето работници от Източна Европа това е лесно изпълнено: София е на 2 000 км, Букурещ на 1 800 км, Варшава на 1 200 км. Работниците от Белгия или Германия близо до границата обикновено не се квалифицират.",
  },
  {
    icon: "⏱",
    title: "Намирате се в Нидерландия от по-малко от 5 години",
    body: "Обезщетението ET е предназначено за работници, които временно са екстериториално — далеч от родната им страна. Прилага се за максимум 5 години (60 месеца) от датата, на която сте започнали за пръв път да работите в Нидерландия. След 5 години вече не се квалифицирате, дори ако все още живеете в чужбина.",
  },
  {
    icon: "📋",
    title: "Трудовият ви договор трябва да включва клауза ET",
    body: "Договорената ET не е автоматична — трябва да бъде договорена писмено между вас и вашия работодател. За работниците в агенции това обикновено означава, че клаузата ET е включена в стандартния агенционен договор (arbeidsovereenkomst). Попитайте вербувача конкретно: 'Wordt de ET-vergoeding op mijn contract toegepast?' (Прилага ли се ET vergoeding към договора ми?)",
  },
];

// ─── Как да проверите фиша ────────────────────────────────────────────────────
const PAYSLIP_CHECKS = [
  { label: "Търсете 'ET vergoeding' или 'ET toeslag'", detail: "Този ред трябва да показва положителна сума — вашето необлагаемо обезщетение за периода." },
  { label: "Търсете 'Onkostenvergoeding'", detail: "Някои агенции използват този общ термин за обезщетения за разходи, включително разходи ET." },
  { label: "Проверете 'Belastingvrije vergoeding'", detail: "Необлагаемо обезщетение — друг общ етикет за компонента ET." },
  { label: "Сравнете своя loonheffing с колега без ET", detail: "Ако схемата ET се прилага правилно, вашият loonheffing трябва да е забележимо по-нисък при същата брутна заплата." },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Какво е схемата ET в Нидерландия?",
    a: "Схемата ET (Extraterritoriale kosten) позволява на холандските работодатели да компенсират работниците за допълнителните разходи за живот и работа извън родната им страна — без данък. Тя се основава на чл. 31а от холандския Закон за данъка върху заплатата (Wet op de loonbelasting 1964). Обезщетението се изплаща в допълнение към нормалните заплати и намалява частта от дохода, подлежаща на холандски loonheffing (данък върху заплатата). За работниците в агенции това може да означава €50–€150/седм. повече в брой в сравнение с работниците при същата брутна заплата, без приложен ET.",
  },
  {
    q: "Автоматично ли се квалифицирам за схемата ET като работник от ЕС в Нидерландия?",
    a: "Не автоматично. Квалифицирате се, ако: (1) постоянният ви дом е на повече от 150 км от холандската граница, (2) намирате се в Нидерландия от по-малко от 5 години и (3) трудовият ви договор включва клауза ET. Правилото от 150 км елиминира работниците от Белгия и Германия, живеещи близо до холандската граница. Всички работници отИзточна Европа (Полша, Румъния, България, Словакия, Унгария и др.) лесно отговарят на изискването за разстояние.",
  },
  {
    q: "Колко струва схемата ET на седмица?",
    a: "Обезщетението ET се изчислява като процент от брутната ви заплата — обикновено 30% от облагаемото бруто за по-високо печелившите по 'правилото 30%', но за работниците в агенции обикновено се изчислява въз основа на действителните екстериториални разходи. На практика седмичната нетна печалба за работник в агенция при WML (€14,71/час, 40 часа/седм.) е €50–€150/седм. в зависимост от начина, по който агенцията го изчислява. Примерът на тази страница показва типична печалба от ~€127/седм. нето.",
  },
  {
    q: "Агенцията ми казва, че не прилага ET. Мога ли да сменя с такава, която прилага?",
    a: "Да. Не всички агенции прилагат схемата ET, дори когато работниците отговарят на условията. Някои агенции не са запознати с нея, други избират да не я предлагат. Ако се квалифицирате и настоящата ви агенция не прилага ET, имате законово право да договорите или да намерите агенция, която го прави. Когато сравнявате агенции в AgencyCheck, можете да проверите дали ET vergoeding е споменато в условията на договора им или да попитате директно при кандидатстване.",
  },
  {
    q: "Какво се случва след 5 години — губя ли ET обезщетението?",
    a: "Да — след 60 месеца работа в Нидерландия, ET обезщетението изтича. 5-годишният часовник започва от първия ви работен ден в Нидерландия, а не от момента, в който сте кандидатствали за схемата ET. Някои работници, които идват сезонно в Нидерландия от години, може вече да са използвали частично или изцяло своите 60 месеца, без да са наясно. Ако работите в Нидерландия от дълго време, помолете агенцията или холандски данъчен консултант да провери оставащата ви ET допустимост.",
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
  headline: "Схема ET в Нидерландия 2026 — Обяснена за Работници в Агенции",
  description: "Пълно обяснение на холандската ET (Extraterritoriale kosten) добавка за работници в агенции от ЕС: кой отговаря на условията, колко струва и как да проверите фиша си.",
  author: { "@type": "Organization", name: "AgencyCheck" },
  publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
  datePublished: "2026-01-01",
  dateModified: "2026-05-01",
  inLanguage: "bg",
  url: "https://agencycheck.io/bg/et-schema-niderlandiya",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Начало", item: "https://agencycheck.io/bg" },
    { "@type": "ListItem", position: 2, name: "Ръководства", item: "https://agencycheck.io/guides" },
    { "@type": "ListItem", position: 3, name: "Схема ET Обяснена", item: "https://agencycheck.io/bg/et-schema-niderlandiya" },
  ],
};

export default async function EtSchemaNiderlandiya() {
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
            <Link href="/bg" className="hover:text-gray-300">Начало</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300">Ръководства</Link>
            <span>/</span>
            <span className="text-gray-400">Схема ET Обяснена</span>
          </nav>
          <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">Ръководство за данъчно облекчение 2026</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            Схема ET в Нидерландия —<br className="hidden sm:block" />
            <span className="text-amber-400">До €150/седм. повече, без данък</span>
          </h1>
          <p className="text-base text-gray-300 leading-relaxed mb-6">
            Схемата <strong className="text-white">ET (Extraterritoriale kosten)</strong> е законово холандско данъчно облекчение,
            за което повечето работници в агенции от ЕС се квалифицират — но мнозинството никога не са чували за него.
            Ако вашата агенция го прилага правилно, нетното ви заплащане може да се увеличи с <strong className="text-white">€50–€150 всяка седмица</strong>,
            без да спечелите нито едно евро повече бруто. Това ръководство обяснява всичко.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {["Основано на чл. 31а Wet LB 1964", "Квалифицира се ако >150км от границата на НЛ", "Валидно 5 години (60 месеца)", "Проверете: 'ET vergoeding' на фиша"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-semibold text-gray-300">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Сравнителна таблица ───────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
            Числата — работник при WML, 40ч/седм.
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Същата брутна заплата. Същото жилище от агенцията. Същата работа. Единствената разлика е дали схемата ET се прилага.
          </p>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-900 px-5 py-3 gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ред</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Без ET</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 text-right">С ET</span>
            </div>
            <div className="divide-y divide-gray-100">
              {COMPARISON.map((row) => (
                <div key={row.label} className={`grid grid-cols-3 gap-4 px-5 py-3 items-center ${row.label.startsWith("Nettoloon") ? "bg-amber-50 font-black" : ""}`}>
                  <div>
                    <span className="text-sm text-gray-700">{row.label}</span>
                    {row.note && <p className="text-[10px] text-gray-400 mt-0.5">{row.note}</p>}
                  </div>
                  <span className="text-sm text-right font-mono text-gray-600">{row.without}</span>
                  <span className={`text-sm text-right font-mono font-bold ${row.label.startsWith("ET") ? "text-amber-600" : row.label.startsWith("Nettoloon") ? "text-emerald-700 text-base" : "text-gray-600"}`}>
                    {row.with_et}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Примерът се основава на WML 2026 (€14,71/час × 40ч/седм. = €588 бруто). ET vergoeding изчислено по типичната агенционна ставка.
            Действителните суми варират в зависимост от агенцията и индивидуалните обстоятелства.
          </p>
        </div>
      </section>

      {/* ── Кой отговаря на условията ─────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Кой отговаря на условията за схемата ET?</h2>
          <p className="text-sm text-gray-500 mb-8">И трите условия трябва да са изпълнени едновременно.</p>
          <div className="space-y-5">
            {QUALIFICATIONS.map((q, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <span className="text-3xl shrink-0">{q.icon}</span>
                <div>
                  <h3 className="text-base font-black text-gray-900 mb-1.5">{q.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{q.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="text-sm text-emerald-800 leading-relaxed">
              <strong>Бърза проверка:</strong> От България ли сте, Полша, Румъния, Словакия, Унгария, Украйна или друга страна на повече от 150 км от Нидерландия?
              В Нидерландия ли сте от по-малко от 5 години?
              Ако и двете са да — вероятно се квалифицирате. Попитайте вербувача на агенцията дали договорът ви включва ET vergoeding.
            </p>
          </div>
        </div>
      </section>

      {/* ── Как да проверите фиша ────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Как да проверите фиша си за ET</h2>
          <p className="text-sm text-gray-500 mb-6">
            Различните агенции използват различни етикети. Търсете което и да е от следните на своя <strong>loonstrook</strong>:
          </p>
          <div className="space-y-3">
            {PAYSLIP_CHECKS.map((c, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 font-mono">{c.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Нито едно от тях не се появява на вашия фиш?</strong> Попитайте вербувача директно:
              <em className="text-gray-600"> &ldquo;Wordt de ET-vergoeding op mijn loonstrook toegepast en zo niet, waarom niet?&rdquo;</em>
              (Прилага ли се ET vergoeding на фиша ми и ако не — защо не?)
            </p>
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
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Намерете агенции, прилагащи схемата ET</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Когато кандидатствате чрез AgencyCheck, можете да попитате вербувача директно за ET vergoeding преди подписването.
              Безплатно кандидатстване — отговор на WhatsApp в същия ден.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {featuredAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} jobCount={getJobCountForAgency(agency.slug)} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/vacancies" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-6 py-3 text-sm font-bold text-gray-700">
              Разгледайте всички свободни работни места →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Свързани ──────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-base font-black text-gray-900 mb-4">Свързани ръководства</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/bg/loonstrook",                    label: "Как да четете холандски фиш за заплата" },
              { href: "/bg/bsn-nomer-niderlandiya",         label: "Как да получите своя BSN номер" },
              { href: "/after-you-apply",                   label: "Какво се случва след като кандидатствате" },
              { href: "/tools/real-salary-calculator",      label: "Калкулатор на нетна заплата в Нидерландия" },
              { href: "/what-is-order-picking",             label: "Ордър пикинг — заплата и условия" },
              { href: "/work-in-netherlands-for-foreigners", label: "Пълно ръководство за чуждестранни работници" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors px-4 py-3 text-sm font-semibold text-gray-700">
                <span className="text-gray-400">→</span> {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
