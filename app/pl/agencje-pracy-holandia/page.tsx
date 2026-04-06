import type { Metadata } from "next";
import Link from "next/link";
import { HOUSING_AGENCIES } from "@/lib/agencyEnriched";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Agencje Pracy w Holandii 2026 — Opinie, Rankingi i Ostrzeżenia",
  description:
    "Sprawdzone opinie o agencjach pracy w Holandii. OTTO Workforce, Covebo, Randstad, Tempo-Team i 150+ innych. Co naprawdę zostaje po odliczeniu zakwaterowania i podatku? Czytaj zanim podpiszesz kontrakt.",
  keywords: [
    "agencja pracy Holandia opinie",
    "agencja pracy Holandia zakwaterowanie",
    "najlepsza agencja pracy Holandia",
    "legalna agencja pracy Holandia",
    "agencja pracy Holandia ranking",
    "opinie agencja pracy Holandia",
  ],
  alternates: {
    canonical: "https://agencycheck.io/pl/agencje-pracy-holandia",
    languages: {
      "en":        "https://agencycheck.io/agencies",
      "pl":        "https://agencycheck.io/pl/agencje-pracy-holandia",
      "x-default": "https://agencycheck.io/agencies",
    },
  },
  openGraph: {
    title: "Agencje Pracy w Holandii — Sprawdzone Opinie Pracowników 2026",
    description:
      "Porównaj 150+ agencji pracy w Holandii. Kto zapewnia uczciwe zakwaterowanie? Kto potrąca zbyt dużo? Prawdziwe opinie, realne zarobki, ostrzeżenia.",
    locale: "pl_PL",
  },
};

// ─── Top agencies for Polish workers ─────────────────────────────────────────

const TOP_AGENCIES = [
  {
    slug:        "otto-workforce",
    name:        "OTTO Workforce",
    verdict:     "Największa agencja dla pracowników migrujących w Holandii",
    housing:     "Tak — OTTO Housing, odliczenie ~€95/tydzień",
    sector:      "Logistyka, magazyn, produkcja",
    cities:      "Venray, Zwolle, Rotterdam, Amsterdam, 's-Hertogenbosch",
    score:       72,
    pros:        ["Certyfikat ABU i SNF", "Rozbudowana sieć zakwaterowania", "Dobre warunki transportu"],
    cons:        ["Duże obiekty — mało prywatności", "Kolejka oczekiwania w szczycie sezonu"],
    verdict_pl:  "Solidna opcja dla pierwszego wyjazdu. Duże, sprawdzone, ale nie najtańsze pod względem odliczeń.",
  },
  {
    slug:        "covebo",
    name:        "Covebo",
    verdict:     "Certyfikowana agencja z szeroką siecią miast",
    housing:     "Tak — SNF-certified, ~€92/tydzień",
    sector:      "Logistyka, produkcja żywności, magazyn",
    cities:      "Helmond, Nieuwegein, Lelystad, Venlo, Utrecht, Eindhoven",
    score:       68,
    pros:        ["SNF i ABU certyfikat", "Aktywna w wielu miastach", "Przejrzyste warunki płacy"],
    cons:        ["Lokalizacje zakwaterowania bywają peryferyjne", "Ograniczona komunikacja po polsku"],
    verdict_pl:  "Dobra alternatywa dla OTTO. Szczególnie polecana dla pracy w produkcji żywności.",
  },
  {
    slug:        "randstad-nederland",
    name:        "Randstad Nederland",
    verdict:     "Największa agencja pracy w Holandii ogółem",
    housing:     "Ograniczone — głównie dla własnych pracowników",
    sector:      "Logistyka, produkcja, biuro, IT",
    cities:      "Ogólnokrajowo — 100+ oddziałów",
    score:       65,
    pros:        ["Bardzo duży wybór ofert pracy", "Renomowana marka", "Szybkie zatrudnienie"],
    cons:        ["Zakwaterowanie nie jest standardem", "Duże różnice między oddziałami"],
    verdict_pl:  "Dobra agencja jeśli masz już własne zakwaterowanie lub szukasz pracy biurowej.",
  },
  {
    slug:        "tempo-team-amsterdam-uitzendbureau",
    name:        "Tempo-Team",
    verdict:     "Znana holenderska agencja z dobrą reputacją",
    housing:     "Rzadko — zależy od lokalizacji",
    sector:      "Logistyka, produkcja, handel, biuro",
    cities:      "Amsterdam, Rotterdam, Eindhoven, Utrecht i inne",
    score:       63,
    pros:        ["Dobre warunki CAO", "Szeroka oferta pracy", "Szybka rekrutacja"],
    cons:        ["Zakwaterowanie dostępne tylko w wybranych projektach", "Mniej obsługi w języku polskim"],
    verdict_pl:  "Solidna agencja ogólna. Dobra jeśli znasz holenderski lub angielski.",
  },
  {
    slug:        "hobij",
    name:        "HOBIJ",
    verdict:     "Specjalizacja: logistyka w regionie Den Haag–Rotterdam",
    housing:     "Tak — zapewnia zakwaterowanie dla pracowników z zagranicy",
    sector:      "Logistyka, magazyn, produkcja",
    cities:      "Den Haag, Rotterdam, Delft, Zoetermeer",
    score:       58,
    pros:        ["Zakwaterowanie dostępne", "Bliskość dużych centrów dystrybucji"],
    cons:        ["Mniejsza sieć niż OTTO/Covebo", "Opinie mieszane"],
    verdict_pl:  "Warto sprawdzić jeśli chcesz pracować w okolicach Rotterdamu lub Hagi.",
  },
];

const FAQS = [
  {
    q: "Która agencja pracy w Holandii jest najlepsza dla Polaków?",
    a: "OTTO Workforce i Covebo są najczęściej wybierane przez Polaków. Obie oferują zakwaterowanie, mają certyfikaty ABU i SNF, i mają doświadczenie z pracownikami z Polski. OTTO jest największa, Covebo często oferuje nieco lepsze warunki mieszkaniowe.",
  },
  {
    q: "Ile zostaje mi netto po wszystkich odliczeniach?",
    a: "Przy WML (€14,71/godz.) i 40 godzinach tygodniowo: brutto €588, minus podatek (~€63), zakwaterowanie (~€95), ubezpieczenie (~€35) i transport (~€25). Zostaje ok. €345–€370 netto tygodniowo. To realny przedział — nie €588, jak piszą w ogłoszeniach.",
  },
  {
    q: "Czy agencja pracy w Holandii musi być certyfikowana?",
    a: "Legalne agencje powinny mieć certyfikat ABU lub NBBU (związki zawodowe agencji). Certyfikat SNF dotyczy standardów zakwaterowania. Zawsze sprawdź czy agencja figuruje w rejestrze SNA lub ABU przed podpisaniem umowy.",
  },
  {
    q: "Czy agencja może potrącać więcej niż ustalone?",
    a: "Nie — odliczenia muszą być wyszczególnione w umowie. CAO dla pracowników tymczasowych (uitzendkrachten CAO) określa maksymalne stawki. Jeśli agencja potrąca więcej niż umówiono, możesz złożyć skargę do SNCU.",
  },
  {
    q: "Co zrobić jeśli agencja nie płaci na czas?",
    a: "Najpierw skontaktuj się bezpośrednio z agencją na piśmie. Jeśli brak odpowiedzi — złóż skargę do FNV (fnv.nl) lub SNCU (sncu.nl). Mają bezpłatne doradztwo dla pracowników tymczasowych.",
  },
  {
    q: "Czy mogę zmienić agencję po przyjeździe?",
    a: "Tak. Umowa z agencją nie wiąże cię na zawsze. Sprawdź okres wypowiedzenia w swojej umowie (zwykle 1–2 tygodnie). Pamiętaj że zakwaterowanie często jest powiązane z pracą — zmiana agencji może oznaczać konieczność znalezienia własnego mieszkania.",
  },
];

export default function AgencjePracyHolandia() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",          url: "/" },
    { name: "Polski",        url: "/pl" },
    { name: "Agencje Pracy", url: "/pl/agencje-pracy-holandia" },
  ]);
  const faqSchema = faqPageSchema(FAQS.map((f) => ({ question: f.q, answer: f.a })));

  const housingCount = HOUSING_AGENCIES.length;

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-surface-hero text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-gray-500 mb-5 flex items-center gap-1.5 flex-wrap">
            <Link href="/pl" className="hover:text-gray-300">AgencyCheck PL</Link>
            <span>/</span>
            <span className="text-gray-400">Agencje pracy w Holandii</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Agencje Pracy w Holandii<br className="hidden sm:block" /> — Opinie i Rankingi 2026
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            Porównaliśmy {" "}150+ agencji pracy w Holandii pod kątem zarobków, warunków zakwaterowania
            i opinii pracowników. Tutaj znajdziesz realne informacje — nie te z folderów rekrutacyjnych.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="bg-white/10 border border-white/10 rounded-full px-3 py-1.5">
              ✓ {housingCount} agencji z zakwaterowaniem
            </span>
            <span className="bg-white/10 border border-white/10 rounded-full px-3 py-1.5">
              ✓ Certyfikaty ABU i SNF
            </span>
            <span className="bg-white/10 border border-white/10 rounded-full px-3 py-1.5">
              ✓ Aktualne stawki 2026
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">

        {/* ── Important notice ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <p className="text-sm font-bold text-gray-900 mb-1.5">⚠️ Zanim podpiszesz umowę</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Większość ogłoszeń podaje stawkę brutto. Po odliczeniu zakwaterowania (~€95/tydzień),
            ubezpieczenia (~€35) i transportu (~€25) twoje realne zarobki netto to
            <strong> ok. €345–€380 tygodniowo</strong> — nie €500+ jak sugerują nagłówki.{" "}
            <Link href="/pl/zarobki-holandia" className="text-amber-700 underline font-semibold">
              Sprawdź kalkulator zarobków →
            </Link>
          </p>
        </div>

        {/* ── Top agencies ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Sprawdzone Agencje Pracy w Holandii
          </h2>
          <p className="text-sm text-gray-500 mb-7 leading-relaxed">
            Poniższe agencje zostały sprawdzone pod kątem certyfikatów, warunków zakwaterowania
            i opinii pracowników. Zaczynamy od największych i najczęściej polecanych przez Polaków.
          </p>

          <div className="space-y-6">
            {TOP_AGENCIES.map((ag, i) => (
              <div key={ag.slug} className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">#{i + 1}</span>
                      <h3 className="text-base font-black text-gray-900">{ag.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500">{ag.verdict}</p>
                  </div>
                  <div className="shrink-0 text-center">
                    <div className={`text-lg font-black rounded-xl px-3 py-1.5 ${
                      ag.score >= 70 ? "bg-green-50 text-green-700" :
                      ag.score >= 60 ? "bg-amber-50 text-amber-700" :
                      "bg-gray-50 text-gray-600"
                    }`}>
                      {ag.score}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">wynik</p>
                  </div>
                </div>

                <div className="px-5 py-4 grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-gray-500 uppercase tracking-wide mb-1">Zakwaterowanie</p>
                    <p className="text-gray-700">{ag.housing}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase tracking-wide mb-1">Branże</p>
                    <p className="text-gray-700">{ag.sector}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="font-semibold text-gray-500 uppercase tracking-wide mb-1">Aktywne miasta</p>
                    <p className="text-gray-700">{ag.cities}</p>
                  </div>
                </div>

                <div className="px-5 pb-4 grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="font-semibold text-green-800 mb-1.5">Plusy</p>
                    <ul className="space-y-1">
                      {ag.pros.map((p) => (
                        <li key={p} className="text-green-700 flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0">✓</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="font-semibold text-red-800 mb-1.5">Minusy</p>
                    <ul className="space-y-1">
                      {ag.cons.map((c) => (
                        <li key={c} className="text-red-700 flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0">✗</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-5 pb-5 flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-500 italic leading-relaxed max-w-sm">
                    {ag.verdict_pl}
                  </p>
                  <Link
                    href={`/agencies/${ag.slug}`}
                    className="shrink-0 text-xs font-bold text-brand-600 hover:text-brand-700 border border-brand-200 hover:border-brand-400 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    Pełny profil →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/pl"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 border border-gray-200 hover:border-gray-900 rounded-xl px-5 py-3 transition-colors"
            >
              Zobacz wszystkie 150+ agencji →
            </Link>
          </div>
        </section>

        {/* ── Red flags ─────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">
            Na Co Uważać — Czerwone Flagi
          </h2>
          <div className="space-y-3">
            {[
              {
                flag: "Agencja nie ma certyfikatu ABU lub NBBU",
                detail: "Sprawdź na abu.nl lub nbbu.nl. Brak certyfikatu = brak gwarancji CAO i minimalnego wynagrodzenia.",
              },
              {
                flag: "Nie możesz zobaczyć warunków zakwaterowania przed podpisaniem",
                detail: "Legalna agencja pokaże zdjęcia i opis mieszkania z wyprzedzeniem. Jeśli odmawiają — odejdź.",
              },
              {
                flag: "Odliczenia nie są wyszczególnione w umowie",
                detail: "Każde potrącenie (zakwaterowanie, ubezpieczenie, transport) musi być w umowie. Ogólne 'koszty administracyjne' to sygnał alarmowy.",
              },
              {
                flag: "Agencja prosi o opłatę za rekrutację",
                detail: "Nielegalne w Holandii. Agencja zarabia na marży od pracodawcy — pracownik nigdy nie powinien płacić za zatrudnienie.",
              },
              {
                flag: "Zakwaterowanie powiązane z jedną lokalizacją pracy",
                detail: "Jeśli jesteś zmuszony mieszkać TYLKO tam gdzie agencja cię przydziela, możesz stracić dach nad głową przy zmianie pracy. Zawsze pytaj o warunki.",
              },
            ].map((item) => (
              <div key={item.flag} className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/30 p-4">
                <span className="text-red-500 text-base shrink-0 mt-0.5">⛔</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">{item.flag}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-5">
            Najczęstsze Pytania o Agencje Pracy w Holandii
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border border-gray-100 rounded-xl p-5">
                <p className="text-sm font-bold text-gray-900 mb-2">{faq.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Internal links ────────────────────────────────────────────────── */}
        <div className="border-t border-gray-100 pt-8 grid sm:grid-cols-3 gap-3">
          {[
            { href: "/pl/zarobki-holandia",             label: "Kalkulator zarobków netto",       icon: "💶" },
            { href: "/pl/praca-z-zakwaterowaniem",      label: "Praca z zakwaterowaniem",          icon: "🏠" },
            { href: "/pl",                              label: "Strona główna PL",                 icon: "🇵🇱" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all"
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
