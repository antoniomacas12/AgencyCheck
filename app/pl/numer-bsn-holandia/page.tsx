import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Numer BSN w Holandii — Kompletny Przewodnik dla Pracowników Agencji 2026",
  description:
    "Jak uzyskać numer BSN w Holandii jako pracownik agencji z UE. Rejestracja RNI, dokumenty, terminy i co powinna załatwić Twoja agencja. Wymagany dowód osobisty.",
  alternates: {
    canonical: "https://agencycheck.io/pl/numer-bsn-holandia",
    languages: { en: "https://agencycheck.io/bsn-number-netherlands-guide" },
  },
  openGraph: {
    title: "Numer BSN w Holandii — Kompletny przewodnik dla pracowników agencji 2026",
    description:
      "Krok po kroku: uzyskaj holenderski BSN jako pracownik agencji z UE. Rejestracja RNI vs gmina, wymagane dokumenty, DigiD i co się dzieje bez BSN.",
  },
};

export const dynamic = "force-static";

const STEPS = [
  {
    step: "1",
    title: "Przyjedź do Holandii",
    body: "Jako obywatel UE/EOG masz prawo mieszkać i pracować w Holandii od pierwszego dnia — bez pozwolenia na pracę. Nie musisz się rejestrować ani o nic wnioskować przed przyjazdem. Twoja agencja będzie już miała potwierdzony termin rozpoczęcia pracy.",
    tip: null,
  },
  {
    step: "2",
    title: "Zarejestruj się w punkcie RNI lub lokalnej gminie",
    body: "Musisz zarejestrować swój pobyt w Holandii, aby otrzymać BSN. Są dwie drogi w zależności od tego, czy masz stały adres zamieszkania, czy zakwaterowanie zapewnione przez agencję.",
    tip: "Rejestracja RNI (Registratie Niet-Ingezetenen) jest przeznaczona dla pracowników bez stałego adresu w Holandii — typowo zakwaterowanie agencji. Istnieje 19 punktów RNI w dużych gminach, w tym Rotterdam, Amsterdam, Eindhoven, Den Haag, Venlo i Breda. Twoja agencja powinna powiedzieć, który jest najbliższy, i może zorganizować transport.",
  },
  {
    step: "3",
    title: "Przynieś właściwe dokumenty",
    body: "Niezależnie od tego, czy rejestrujesz się w punkcie RNI czy gminie, potrzebujesz: (1) ważnego dowodu osobistego lub paszportu, (2) dowodu pracy w Holandii — może to być umowa o pracę z agencją, (3) dowodu adresu — jeśli korzystasz z zakwaterowania agencji, akceptowany jest list od agencji potwierdzający adres zakwaterowania.",
    tip: "Niektóre gminy proszą również o akt urodzenia. Zapytaj agencję z wyprzedzeniem, czego wymaga lokalny punkt RNI. Wizytę można zazwyczaj zarezerwować online na stronie odpowiedniej gminy. Pamiętaj, że dowód osobisty (dowód osobisty) musi być ważny.",
  },
  {
    step: "4",
    title: "Otrzymaj swój BSN",
    body: "W punkcie RNI BSN jest zazwyczaj wydawany tego samego dnia. W gminie może to zająć do 5 dni roboczych. Twój BSN to 9-cyfrowy numer. Zapisz go i zachowaj — będzie potrzebny do loonstrook, ubezpieczenia zdrowotnego, konta bankowego i DigiD.",
    tip: "Twoja agencja potrzebuje Twojego BSN, aby prawidłowo przetworzyć wynagrodzenie i loonheffing (podatek od wynagrodzenia). Do momentu zarejestrowania BSN, pracodawca musi stosować najwyższą stawkę podatkową (noodloon — 'awaryjne potrącenie podatkowe'), co może oznaczać znacznie mniejszą wypłatę w pierwszym tygodniu.",
  },
  {
    step: "5",
    title: "Złóż wniosek o DigiD (opcjonalne, ale zalecane)",
    body: "DigiD to holenderski rządowy system tożsamości cyfrowej — oddzielny login/hasło potrzebny do korzystania z usług rządowych online: zeznania podatkowe (Belastingdienst), zasiłek zdrowotny (zorgtoeslag), zasiłek mieszkaniowy (huurtoeslag). Nie jest tym samym co Twój BSN, ale do wniosku o DigiD potrzebujesz BSN.",
    tip: "Wnioski o DigiD składa się na digid.nl. Aktywacja trwa 5–7 dni listem na zarejestrowany adres. Jeśli chcesz później ubiegać się o toeslagen (zasiłki) obniżające koszty utrzymania, DigiD jest wymagany.",
  },
];

const DOCUMENTS = [
  { doc: "Ważny dowód osobisty lub paszport", note: "Musi być aktualny — przeterminowany dowód jest odrzucany" },
  { doc: "Umowa o pracę z agencją", note: "Potwierdza, że pracujesz w Holandii" },
  { doc: "Dowód adresu w Holandii", note: "Akceptowany jest list od agencji z zakwaterowaniem z pełnym adresem" },
  { doc: "Akt urodzenia (niektóre gminy)", note: "Sprawdź z konkretnym punktem RNI z wyprzedzeniem" },
];

const RNI_DESKS = [
  "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
  "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen",
  "Enschede", "Arnhem", "Haarlem", "Haarlemmermeer", "Zaanstad",
  "Venlo", "Maastricht", "Dordrecht", "Zwolle",
];

const FAQS = [
  {
    q: "Jak długo trwa uzyskanie numeru BSN w Holandii?",
    a: "W punkcie RNI BSN jest zazwyczaj wydawany tego samego dnia podczas wizyty. W gminie (dla osób ze stałym adresem) może to zająć do 5 dni roboczych. Większość agencji organizuje wizytę RNI w ciągu pierwszych 3–5 dni roboczych od przyjazdu. Bez BSN pracodawca musi stosować najwyższą stawkę potrącenia podatkowego (noodloon), co bezpośrednio wpływa na Twój pierwszy odcinek płacowy.",
  },
  {
    q: "Czy mogę pracować w Holandii bez BSN?",
    a: "Możesz zacząć pracować, ale pracodawca musi stosować awaryjną stawkę potrącenia podatkowego (noodloon/anoniementarief) do momentu przetworzenia Twojego BSN. Oznacza to znacznie mniejszą wypłatę w tym okresie — czasem 40–50% potrącone zamiast normalnych 10–15%. Po zarejestrowaniu BSN i przekazaniu go pracodawcy stosowana jest właściwa stawka. Nadpłacony podatek z pierwszego okresu jest zazwyczaj korygowany w rocznym zeznaniu podatkowym.",
  },
  {
    q: "Jaka jest różnica między BSN a DigiD?",
    a: "Twój BSN (Burgerservicenummer) to stały 9-cyfrowy numer identyfikujący Cię w holenderskich systemach rządowych i podatkowych — pojawia się na Twoim odcinku płacowym i jest używany przez pracodawcę do zgłaszania dochodów do Belastingdienst (urząd skarbowy). DigiD to oddzielny system nazwy użytkownika i hasła do logowania się na rządowe strony internetowe. Do utworzenia DigiD potrzebujesz BSN, ale to różne rzeczy. BSN masz zawsze po przypisaniu; DigiD to login, o który wnioskujesz oddzielnie.",
  },
  {
    q: "Czy mój pracodawca (agencja) potrzebuje mojego BSN?",
    a: "Tak — Twój BSN jest prawnie wymagany, aby pracodawca mógł prawidłowo przetworzyć wynagrodzenie. Zgodnie z holenderskim prawem pracodawcy muszą rejestrować BSN każdego pracownika (Wet op de loonbelasting Art. 28). Bez niego stosowany jest noodtarief (stawka awaryjna) i potrącany jest wyższy podatek. Podaj swój BSN rekruterowi agencji jak najszybciej po otrzymaniu — najlepiej tego samego dnia.",
  },
  {
    q: "Czy mogę otworzyć holenderskie konto bankowe bez BSN?",
    a: "Większość holenderskich banków (ING, Rabobank, ABN AMRO) wymaga BSN do otwarcia konta. Niektóre banki jak Bunq lub Revolut pozwalają otworzyć konto bez holenderskiego BSN, używając dokumentu tożsamości UE (np. polskiego dowodu osobistego). Jednak do otrzymywania wynagrodzenia od holenderskiego pracodawcy zdecydowanie zalecane jest posiadanie holenderskiego konta bankowego. Posiadanie holenderskiego IBAN pozwala również uniknąć opłat za przelewy SEPA, które niektóre agencje naliczają za płatności na zagraniczne konta.",
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
  headline: "Numer BSN w Holandii — Kompletny Przewodnik dla Pracowników Agencji 2026",
  description: "Przewodnik krok po kroku, jak uzyskać holenderski numer BSN jako pracownik agencji z UE, w tym rejestracja RNI, wymagane dokumenty i co powinna załatwić Twoja agencja.",
  author: { "@type": "Organization", name: "AgencyCheck" },
  publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
  datePublished: "2026-01-01",
  dateModified: "2026-05-01",
  inLanguage: "pl",
  url: "https://agencycheck.io/pl/numer-bsn-holandia",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://agencycheck.io/pl" },
    { "@type": "ListItem", position: 2, name: "Przewodniki", item: "https://agencycheck.io/guides" },
    { "@type": "ListItem", position: 3, name: "Numer BSN Holandia", item: "https://agencycheck.io/pl/numer-bsn-holandia" },
  ],
};

export default async function NumerBsnHolandia() {
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
            <Link href="/pl" className="hover:text-gray-300">Strona główna</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300">Przewodniki</Link>
            <span>/</span>
            <span className="text-gray-400">Numer BSN Holandia</span>
          </nav>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3">Przewodnik administracyjny 2026</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            Numer BSN w Holandii —<br className="hidden sm:block" />
            <span className="text-emerald-400">Kompletny przewodnik dla pracowników agencji z UE</span>
          </h1>
          <p className="text-base text-gray-300 leading-relaxed mb-6">
            Twój <strong className="text-white">BSN (Burgerservicenummer)</strong> to holenderski numer identyfikacji podatkowej.
            Potrzebujesz go, aby otrzymywać prawidłowe wynagrodzenie, otworzyć konto bankowe, uzyskać dostęp do opieki zdrowotnej i złożyć zeznanie podatkowe.
            Jako obywatel UE/EOG masz prawo pracować w Holandii od pierwszego dnia — uzyskanie BSN to pierwszy krok administracyjny po przyjeździe.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {["Tego samego dnia w punkcie RNI", "19 punktów RNI w Holandii", "Wymagany do prawidłowego wynagrodzenia", "Bezpłatne wnioskowanie"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-semibold text-gray-300">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Czym jest BSN ─────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">Czym jest BSN i dlaczego go potrzebujesz?</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            <strong>Burgerservicenummer (BSN)</strong> to stały 9-cyfrowy numer przypisany każdej osobie
            zarejestrowanej w Holandii. Jest odpowiednikiem numeru PESEL lub NIP.
            Po przypisaniu BSN nigdy się nie zmienia — nawet jeśli wyjedziesz i wrócisz po latach.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Twój pracodawca jest prawnie zobowiązany do zarejestrowania Twojego BSN w holenderskim urzędzie skarbowym (Belastingdienst)
            w ciągu pierwszego okresu rozliczeniowego. Bez niego musi stosować <strong>anoniementarief</strong>
            — anonimową stawkę potrącenia — co oznacza znacznie wyższy podatek od pierwszej wypłaty.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            {[
              { icon: "💶", label: "Odcinek płacowy i wynagrodzenie", desc: "Pracodawca rozlicza Twój podatek używając BSN — wymagane przez Wet op de loonbelasting" },
              { icon: "🏥", label: "Ubezpieczenie zdrowotne", desc: "BSN jest potrzebny do rejestracji na holenderskie zorgverzekering (obowiązkowe ubezpieczenie zdrowotne)" },
              { icon: "🏦", label: "Konto bankowe", desc: "Holenderskie banki (ING, Rabobank, ABN AMRO) wymagają BSN do otwarcia konta" },
              { icon: "📋", label: "Zeznanie podatkowe i zasiłki", desc: "Potrzebny do złożenia holenderskiego zeznania podatkowego i ubiegania się o zorgtoeslag lub huurtoeslag" },
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

      {/* ── Krok po kroku ─────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-8">Krok po kroku: jak uzyskać BSN</h2>
          <div className="space-y-6">
            {STEPS.map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-gray-900 text-white text-sm font-black flex items-center justify-center mt-0.5">{s.step}</div>
                <div className="flex-1">
                  <h3 className="text-base font-black text-gray-900 mb-1.5">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{s.body}</p>
                  {s.tip && (
                    <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-800 leading-relaxed">
                      <strong>Uwaga:</strong> {s.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dokumenty ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">Dokumenty potrzebne do rejestracji BSN</h2>
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

      {/* ── Lista punktów RNI ─────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Punkty RNI — 19 lokalizacji w Holandii</h2>
          <p className="text-sm text-gray-500 mb-5">
            Jeśli mieszkasz w zakwaterowaniu agencji bez stałego adresu, rejestrujesz się w jednym z 19 punktów RNI.
            Wizyty można zazwyczaj zarezerwować online w ciągu 1–3 dni.
          </p>
          <div className="flex flex-wrap gap-2">
            {RNI_DESKS.map((city) => (
              <span key={city} className="text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">{city}</span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Rezerwuj wizyty na oficjalnej stronie gminy najbliższego miasta. Twoja agencja powinna podać adres najbliższego punktu RNI.
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-8">Najczęściej zadawane pytania</h2>
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
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Znajdź pracę przez AgencyCheck</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Agencje, które pomogą Ci z rejestracją BSN</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Dobre agencje przeprowadzają Cię przez proces BSN w ciągu pierwszych 3 dni od przyjazdu.
              Przeglądaj zweryfikowane agencje na AgencyCheck — bezpłatna aplikacja przez WhatsApp.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {featuredAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} jobCount={getJobCountForAgency(agency.slug)} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/vacancies" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-6 py-3 text-sm font-bold text-gray-700">
              Przeglądaj wszystkie oferty pracy →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Powiązane ─────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-base font-black text-gray-900 mb-4">Powiązane przewodniki</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/pl/loonstrook-wyjasniony",        label: "Jak czytać holenderski odcinek płacowy" },
              { href: "/pl/system-et-holandia",            label: "Schemat ET — do €150/tyg. więcej netto" },
              { href: "/after-you-apply",                  label: "Co się dzieje po złożeniu aplikacji" },
              { href: "/what-is-order-picking",            label: "Order picking — wynagrodzenie i warunki" },
              { href: "/tools/real-salary-calculator",     label: "Kalkulator wynagrodzenia netto w Holandii" },
              { href: "/work-in-netherlands-for-foreigners", label: "Kompletny przewodnik dla obcokrajowców" },
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
