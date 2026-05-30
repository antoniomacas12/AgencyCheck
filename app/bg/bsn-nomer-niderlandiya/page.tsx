import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "BSN Номер в Нидерландия — Пълно Ръководство за Работници в Агенции 2026",
  description:
    "Как да получите BSN номер в Нидерландия като работник в агенция от ЕС. Регистрация в RNI, документи (лична карта), срокове и какво трябва да уреди вашата агенция.",
  alternates: {
    canonical: "https://agencycheck.io/bg/bsn-nomer-niderlandiya",
    languages: { en: "https://agencycheck.io/bsn-number-netherlands-guide" },
  },
  openGraph: {
    title: "BSN Номер в Нидерландия — Пълно ръководство за работници в агенции 2026",
    description:
      "Стъпка по стъпка: получете своя холандски BSN като работник в агенция от ЕС. Регистрация RNI срещу gemeete, необходими документи, DigiD и какво се случва без BSN.",
  },
};

export const dynamic = "force-static";

const STEPS = [
  {
    step: "1",
    title: "Пристигате в Нидерландия",
    body: "Като гражданин на ЕС/ЕИП имате право да живеете и работите в Нидерландия от първия ден — не се изисква разрешително за работа. Не е необходимо да се регистрирате или да кандидатствате за нищо преди пристигането. Вашата агенция вече ще е потвърдила дата за начало.",
    tip: null,
  },
  {
    step: "2",
    title: "Регистрирайте се на бюро RNI или в местната община",
    body: "Трябва да регистрирате присъствието си в Нидерландия, за да получите BSN. Има два пътя в зависимост от това дали имате постоянен домашен адрес или жилище, предоставено от агенцията.",
    tip: "Регистрацията RNI (Registratie Niet-Ingezetenen) е за работници без постоянен холандски адрес — обикновено жилище в агенция. Има 19 бюра RNI в големите общини, включително Ротердам, Амстердам, Айндховен, Ден Хааг, Венло и Бреда. Вашата агенция трябва да ви каже кое е най-близо и може да организира транспорт.",
  },
  {
    step: "3",
    title: "Донесете правилните документи",
    body: "Независимо дали се регистрирате на бюро RNI или в gemeente, ви трябват: (1) Валидна национална лична карта или паспорт, (2) Доказателство за работа в Нидерландия — може да бъде трудовият договор от агенцията, (3) Доказателство за адрес — ако използвате жилище на агенцията, писмо от агенцията, потвърждаващо адреса на настаняване, се приема.",
    tip: "Някои общини искат и акт за раждане. Попитайте агенцията си предварително какво изисква местното бюро RNI. Час може обикновено да се запази онлайн на уебсайта на съответната община. Вашата лична карта (лична карта) трябва да е валидна.",
  },
  {
    step: "4",
    title: "Получете своя BSN",
    body: "На бюро RNI, вашият BSN се издава в същия ден в повечето случаи. В gemeente може да отнеме до 5 работни дни. Вашият BSN е 9-цифрен номер. Запишете го и го пазете — ще ви трябва за loonstrook, здравна застраховка, банкова сметка и DigiD.",
    tip: "Вашата агенция се нуждае от BSN, за да обработи правилно заплатата и loonheffing (данък върху заплатата). Докато вашият BSN не бъде регистриран, работодателят ви трябва да приложи най-високата данъчна ставка (noodloon — 'аварийно удържане'), което може да означава значително по-малко в първата ви седмица.",
  },
  {
    step: "5",
    title: "Кандидатствайте за DigiD (незадължително, но препоръчително)",
    body: "DigiD е системата за цифрова самоличност на холандското правителство — отделно потребителско име/парола, необходими за достъп до правителствени услуги онлайн: данъчни декларации (Belastingdienst), здравна помощ (zorgtoeslag), жилищна помощ (huurtoeslag). Не е същото като вашия BSN, но ви трябва BSN, за да кандидатствате за DigiD.",
    tip: "Заявленията за DigiD се подават на digid.nl. Активирането отнема 5–7 дни с писмо до регистрирания адрес. Ако по-късно искате да поискате toeslagen (помощи), които намаляват разходите ви за живот, DigiD е задължителен.",
  },
];

const DOCUMENTS = [
  { doc: "Валидна национална лична карта или паспорт", note: "Трябва да е в срок — изтеклата лична карта се отхвърля" },
  { doc: "Трудов договор от вашата агенция", note: "Показва, че работите в Нидерландия" },
  { doc: "Доказателство за адрес в Нидерландия", note: "Приема се писмо от агенцията за жилище с пълен адрес" },
  { doc: "Акт за раждане (някои общини)", note: "Проверете с конкретното бюро RNI предварително" },
];

const RNI_DESKS = [
  "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
  "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen",
  "Enschede", "Arnhem", "Haarlem", "Haarlemmermeer", "Zaanstad",
  "Venlo", "Maastricht", "Dordrecht", "Zwolle",
];

const FAQS = [
  {
    q: "Колко време отнема получаването на BSN номер в Нидерландия?",
    a: "На бюро RNI, BSN обикновено се издава в същия ден по време на срещата. В gemeente (за тези с постоянен адрес) може да отнеме до 5 работни дни. Повечето агенции организират срещата в RNI в рамките на първите 3–5 работни дни след пристигането. Без BSN работодателят трябва да прилага най-високата ставка за удържане на данъци (noodloon), което пряко засяга първия ви фиш.",
  },
  {
    q: "Мога ли да работя в Нидерландия без BSN?",
    a: "Можете да започнете да работите, но работодателят трябва да прилага аварийната ставка за удържане на данъци (noodloon/anoniementarief), докато BSN не бъде обработен. Това означава значително по-малко в брой за този период — понякога 40–50% удържано вместо нормалните 10–15%. Веднъж щом BSN е регистриран и предаден на работодателя, се прилага правилната ставка. Удържаният излишък в първия период обикновено се коригира в годишната данъчна декларация.",
  },
  {
    q: "Каква е разликата между BSN и DigiD?",
    a: "Вашият BSN (Burgerservicenummer) е постоянен 9-цифрен номер, който ви идентифицира в холандските правителствени и данъчни системи — появява се на фиша ви и се използва от работодателя ви за докладване на дохода ви в Belastingdienst (данъчния орган). DigiD е отделна система за потребителско име и парола за влизане в правителствени уебсайтове. Нуждаете се от BSN, за да създадете DigiD, но са различни неща. Винаги имате BSN веднъж назначен; DigiD е вход, за който кандидатствате отделно.",
  },
  {
    q: "Нуждае ли се работодателят ми (агенцията) от BSN?",
    a: "Да — вашият BSN е законово необходим, за да обработи работодателят правилно ведомостта. Съгласно холандското право работодателите трябва да записват BSN на всеки служител (Wet op de loonbelasting чл. 28). Без него се прилага noodtarief (авариен размер) и се удържа повече данък. Дайте BSN на вербувача на агенцията веднага след получаването — в същия ден ако е възможно.",
  },
  {
    q: "Мога ли да открия холандска банкова сметка без BSN?",
    a: "Повечето холандски банки (ING, Rabobank, ABN AMRO) изискват BSN за откриване на сметка. Някои банки като Bunq или Revolut ви позволяват да открие сметка без холандски BSN, използвайки документ за самоличност от ЕС (напр. лична карта). Въпреки това, за получаване на заплатата от холандски работодател, настоятелно се препоръчва холандска банкова сметка. Наличието на холандски IBAN също избягва таксите за превод SEPA, които някои агенции начисляват за плащания по чуждестранни сметки.",
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
  headline: "BSN Номер в Нидерландия — Пълно Ръководство за Работници в Агенции 2026",
  description: "Ръководство стъпка по стъпка за получаване на холандски BSN номер като работник в агенция от ЕС, включително регистрация RNI, необходими документи и какво трябва да уреди агенцията.",
  author: { "@type": "Organization", name: "AgencyCheck" },
  publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
  datePublished: "2026-01-01",
  dateModified: "2026-05-01",
  inLanguage: "bg",
  url: "https://agencycheck.io/bg/bsn-nomer-niderlandiya",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Начало", item: "https://agencycheck.io/bg" },
    { "@type": "ListItem", position: 2, name: "Ръководства", item: "https://agencycheck.io/guides" },
    { "@type": "ListItem", position: 3, name: "BSN Номер Нидерландия", item: "https://agencycheck.io/bg/bsn-nomer-niderlandiya" },
  ],
};

export default async function BsnNomerNiderlandiya() {
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
            <span className="text-gray-400">BSN Номер Нидерландия</span>
          </nav>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3">Административно ръководство 2026</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            BSN Номер в Нидерландия —<br className="hidden sm:block" />
            <span className="text-emerald-400">Пълно Ръководство за Работници в Агенции от ЕС</span>
          </h1>
          <p className="text-base text-gray-300 leading-relaxed mb-6">
            Вашият <strong className="text-white">BSN (Burgerservicenummer)</strong> е вашият холандски данъчен идентификационен номер.
            Нуждаете се от него, за да получавате правилното си заплащане, да откривате банкова сметка, да имате достъп до здравеопазване и да подавате данъчна декларация.
            Като гражданин на ЕС/ЕИП имате право да работите в Нидерландия от първия ден — получаването на BSN е първата административна стъпка след пристигането.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {["В същия ден на бюро RNI", "19 места RNI в Нидерландия", "Необходим за правилно заплащане", "Безплатно кандидатстване"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-semibold text-gray-300">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Какво е BSN ──────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">Какво е BSN и защо имате нужда от него?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            <strong>Burgerservicenummer (BSN)</strong> е постоянен 9-цифрен номер, назначен на всяко лице,
            регистрирано в Нидерландия. Еквивалентен е на ЕГН или данъчен номер.
            Веднъж назначен, BSN никога не се променя — дори ако напуснете и се върнете години по-късно.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Вашият работодател е законово задължен да регистрира BSN в холандската данъчна служба (Belastingdienst)
            в рамките на първия платежен период. Без него трябва да прилага <strong>anoniementarief</strong>
            — анонимната ставка за удържане — което означава значително повече данъци от първата ви заплата.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {[
              { icon: "💶", label: "Фиш и ведомост", desc: "Работодателят ви докладва данъка ви с BSN — изисква се от Wet op de loonbelasting" },
              { icon: "🏥", label: "Здравна застраховка", desc: "BSN е необходим за регистрация за холандската zorgverzekering (задължителна здравна застраховка)" },
              { icon: "🏦", label: "Банкова сметка", desc: "Холандските банки (ING, Rabobank, ABN AMRO) изискват BSN за откриване на сметка" },
              { icon: "📋", label: "Данъчна декларация и помощи", desc: "Необходим за подаване на холандска данъчна декларация и поискване на zorgtoeslag или huurtoeslag" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-black text-gray-900">{item.label}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Стъпка по стъпка ──────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-8">Стъпка по стъпка: как да получите BSN</h2>
          <div className="space-y-6">
            {STEPS.map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-gray-900 text-white text-sm font-black flex items-center justify-center mt-0.5">{s.step}</div>
                <div className="flex-1">
                  <h3 className="text-base font-black text-gray-900 mb-1.5">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{s.body}</p>
                  {s.tip && (
                    <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-800 leading-relaxed">
                      <strong>Забележка:</strong> {s.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Документи ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">Документи, необходими за регистрация на BSN</h2>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {DOCUMENTS.map((d) => (
                <div key={d.doc} className="flex items-start gap-4 px-5 py-4 bg-white">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center mt-0.5">✓</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{d.doc}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{d.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Списък с бюра RNI ─────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Бюра RNI — 19 места в Нидерландия</h2>
          <p className="text-sm text-gray-500 mb-5">
            Ако сте в жилище на агенция без постоянен адрес, регистрирате се в едно от 19-те бюра RNI.
            Часовете обикновено могат да се запазят онлайн в рамките на 1–3 дни.
          </p>
          <div className="flex flex-wrap gap-2">
            {RNI_DESKS.map((city) => (
              <span key={city} className="text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">{city}</span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Запазвайте часове на официалния уебсайт на общината на най-близкия град. Вашата агенция трябва да предостави адреса на най-близкото бюро RNI.
          </p>
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
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Намерете работа чрез AgencyCheck</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Агенции, които ви помагат с регистрацията на BSN</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Добрите агенции ви водят през процеса на BSN в рамките на първите 3 дни след пристигането.
              Разгледайте верифицирани агенции в AgencyCheck — безплатно кандидатстване чрез WhatsApp.
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
              { href: "/bg/loonstrook",                   label: "Как да четете холандски фиш за заплата" },
              { href: "/bg/et-schema-niderlandiya",        label: "Схема ET — до €150/седм. допълнително нето" },
              { href: "/after-you-apply",                  label: "Какво се случва след като кандидатствате" },
              { href: "/what-is-order-picking",            label: "Ордър пикинг — заплата и условия" },
              { href: "/tools/real-salary-calculator",     label: "Калкулатор на нетна заплата в Нидерландия" },
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
