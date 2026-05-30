import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Jak czytać holenderski odcinek płacowy (Loonstrook) — Wyjaśnienie 2026",
  description:
    "Każda linia holenderskiego loonstrook wyjaśniona po polsku: brutoloon, loonheffing, heffingskorting, vakantiegeld, ET toeslag i więcej. Z przykładami przy WML (€14,71/godz.).",
  alternates: {
    canonical: "https://agencycheck.io/pl/loonstrook-wyjasniony",
    languages: { en: "https://agencycheck.io/how-to-read-dutch-payslip" },
  },
  openGraph: {
    title: "Holenderski loonstrook — wyjaśnienie każdej linii 2026",
    description:
      "Nie rozumiesz swojego loonstrook? Każda linia wyjaśniona z prawdziwymi liczbami — brutoloon, nettoloon, vakantiegeld, ET toeslag, heffingskorting.",
  },
};

export const dynamic = "force-static";

// ─── Pola loonstrook ──────────────────────────────────────────────────────────
const LOONSTROOK_FIELDS = [
  {
    term: "Brutoloon",
    english: "Wynagrodzenie brutto",
    example: "+€588,40",
    positive: true,
    explain:
      "Twoje łączne zarobki przed potrąceniami. Przy WML (€14,71/godz. × 40 godz./tyg.) wynosi to €588,40/tyg. To liczba, którą agencje reklamują — nie to, co faktycznie otrzymujesz na konto.",
  },
  {
    term: "Vakantiegeld (8%)",
    english: "Dodatek urlopowy",
    example: "+€47,07",
    positive: true,
    explain:
      "Obowiązkowe 8% wynagrodzenia brutto, naliczane co tydzień i wypłacane raz w roku (zazwyczaj maj/czerwiec) lub co miesiąc. To TWOJE pieniądze — agencje muszą je wypłacać zgodnie z holenderskim prawem (Burgerlijk Wetboek Art. 7:634).",
  },
  {
    term: "Loonheffing",
    english: "Podatek od wynagrodzenia (podatek dochodowy + ubezpieczenie społeczne)",
    example: "−€63,20",
    positive: false,
    explain:
      "Łączny holenderski podatek dochodowy i składka na ubezpieczenie społeczne (volksverzekeringen: AOW, Anw, Wlz). Jest pobierany przez pracodawcę w każdym okresie rozliczeniowym. Dla większości zagranicznych pracowników przy WML efektywna stawka po heffingskorting wynosi ok. 10–15%, nie 37%.",
  },
  {
    term: "Heffingskorting",
    english: "Ulga podatkowa",
    example: "+€38,50",
    positive: true,
    explain:
      "Ustawowa ulga podatkowa zmniejszająca loonheffing. Są dwie: arbeidskorting (ulga na pracę, do €5 158/rok) oraz algemene heffingskorting (ogólna ulga podatkowa, do €3 362/rok). Jeśli pracodawca stosuje obie, zatrzymujesz znacznie więcej. Zapytaj rekrutera, czy obie są stosowane.",
  },
  {
    term: "WW-premie werknemer",
    english: "Składka na ubezpieczenie od bezrobocia (część pracownika)",
    example: "−€7,06",
    positive: false,
    explain:
      "Twoja składka pracownicza na WW (Werkloosheidswet — holenderskie ubezpieczenie od bezrobocia). Stawka dla pracowników tymczasowych (uitzendbeding) jest wyższa niż dla pracowników stałych. Potrącana z brutto przed obliczeniem nettoloon.",
  },
  {
    term: "ET vergoeding / ET toeslag",
    english: "Zwrot kosztów eksterytorialnych",
    example: "+€80,00",
    positive: true,
    explain:
      "Świadczenie ET (Extraterritoriale kosten) to wolny od podatku zwrot 'kosztów eksterytorialnych' — dodatkowych wydatków związanych z życiem poza krajem ojczystym. Może być warte €50–€150/tyg. NETTO i przysługuje tylko pracownikom mieszkającym ponad 150 km od granicy holenderskiej. Nie wszystkie agencje je stosują. Zobacz nasz przewodnik po schemacie ET.",
  },
  {
    term: "Huisvesting / Woning",
    english: "Potrącenie za zakwaterowanie",
    example: "−€95,00",
    positive: false,
    explain:
      "Tygodniowy koszt zakwaterowania zapewnionego przez agencję, potrącany bezpośrednio z brutto. Maksimum SNF (Stichting Normering Flexwonen) dla certyfikowanego zakwaterowania wspólnego wynosi €113,50/tyg. (2026). Kwota musi dokładnie zgadzać się z zapisem w umowie — ani grosza więcej.",
  },
  {
    term: "Zorgverzekering",
    english: "Składka na ubezpieczenie zdrowotne",
    example: "−€35,00",
    positive: false,
    explain:
      "Holenderskie ubezpieczenie zdrowotne (basisverzekering) jest obowiązkowe dla wszystkich pracowników w Holandii. Wiele agencji oferuje ubezpieczenie grupowe i potrąca składkę (zazwyczaj €28–€40/tyg.) bezpośrednio. Powineneś otrzymać potwierdzenie ubezpieczenia w ciągu pierwszych dwóch tygodni. Zachowaj ten dokument.",
  },
  {
    term: "Transport / Reiskosten",
    english: "Transport do pracy",
    example: "−€25,00",
    positive: false,
    explain:
      "Koszt autobusu agencji lub transportu na miejsce pracy, jeśli jest pobierany. Zgodnie z CAO musi pojawić się jako osobna linia — nie może być wliczone w zakwaterowanie. Typowy zakres: €20–€35/tyg. Jeśli umowa mówi, że transport jest wliczony, ta linia nie powinna się pojawiać.",
  },
  {
    term: "Nettoloon",
    english: "Wynagrodzenie netto (na rękę)",
    example: "€363,00",
    positive: true,
    explain:
      "Kwota przelewana na Twoje konto bankowe. To brutoloon pomniejszone o wszystkie potrącenia (podatek, zakwaterowanie, ubezpieczenie, transport) plus ulgi (heffingskorting, ET toeslag jeśli dotyczy). Przy WML bez świadczenia ET typowe netto to €310–€370/tyg. Ze świadczeniem ET może wynosić €380–€450/tyg.",
  },
];

// ─── Skróty ───────────────────────────────────────────────────────────────────
const ABBREVIATIONS = [
  { abbr: "WML",  full: "Wettelijk Minimumloon",             eng: "Ustawowe wynagrodzenie minimalne (€14,71/godz. w 2026)" },
  { abbr: "CAO",  full: "Collectieve Arbeidsovereenkomst",    eng: "Zbiorowy układ pracy (określa Twoje prawa)" },
  { abbr: "ABU",  full: "Alg. Bond Uitzendondernemingen",     eng: "Główne stowarzyszenie agencji pracy tymczasowej" },
  { abbr: "SNF",  full: "St. Normering Flexwonen",           eng: "Niezależny organ kontroli zakwaterowania" },
  { abbr: "BSN",  full: "Burgerservicenummer",               eng: "Twój holenderski numer służby obywatelskiej (NIP)" },
  { abbr: "ET",   full: "Extraterritoriale kosten",          eng: "Koszty eksterytorialne — świadczenie wolne od podatku" },
  { abbr: "VGU",  full: "Vakantiegeld uitbetaling",          eng: "Wypłata zaległego urlopu" },
  { abbr: "AOW",  full: "Algemene Ouderdomswet",             eng: "Holenderska składka emerytalna" },
  { abbr: "WW",   full: "Werkloosheidswet",                  eng: "Składka na ubezpieczenie od bezrobocia" },
  { abbr: "Wlz",  full: "Wet langdurige zorg",              eng: "Ubezpieczenie długoterminowej opieki" },
  { abbr: "BWA",  full: "Bijzondere beloningen werknemer",   eng: "Specjalne świadczenia pracownicze (np. premia roczna)" },
];

// ─── Lista kontrolna ──────────────────────────────────────────────────────────
const CHECKLIST = [
  { check: "Brutoloon odpowiada Twojej stawce godzinowej z umowy × liczba przepracowanych godzin w tym okresie" },
  { check: "Vakantiegeld (dodatek urlopowy) wynosi dokładnie 8% — nie 0% ani nie brakuje go" },
  { check: "Heffingskorting jest stosowana — zarówno arbeidskorting, jak i algemene heffingskorting" },
  { check: "Potrącenie za huisvesting dokładnie zgadza się z kwotą w umowie — ani grosza więcej" },
  { check: "Transport pojawia się jako osobna linia jeśli jest pobierany — nie ukryty w kosztach zakwaterowania" },
  { check: "ET vergoeding pojawia się, jeśli mieszkasz ponad 150 km od granicy holenderskiej" },
  { check: "Nettoloon odpowiada przelewowi bankowemu, który otrzymałeś" },
  { check: "Otrzymałeś ten odcinek płacowy w ciągu 5 dni od daty płatności" },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Jaka jest różnica między brutoloon a nettoloon?",
    a: "Brutoloon to Twoje wynagrodzenie brutto — łączna kwota zarobiona przed jakimikolwiek potrąceniami. Nettoloon to Twoja rzeczywista wypłata po odliczeniu holenderskiego podatku dochodowego (loonheffing), składek na ubezpieczenie społeczne, zakwaterowania, transportu i ubezpieczenia zdrowotnego. Przy WML (€14,71/godz., 40 godz./tyg.) brutoloon wynosi €588/tyg., a typowe nettoloon to €310–€370/tyg. bez schematu ET.",
  },
  {
    q: "Czym jest vakantiegeld i kiedy go otrzymam?",
    a: "Vakantiegeld (dodatek urlopowy) to obowiązkowe 8% wynagrodzenia brutto wymagane przez holenderskie prawo (BW Art. 7:634). Większość agencji nalicza go w każdym okresie rozliczeniowym i wypłaca raz w roku, zazwyczaj w maju lub czerwcu. Niektóre agencje płacą go miesięcznie. W każdym przypadku 8% musi być widoczne na każdym odcinku płacowym. Jeśli go brakuje, poproś o pisemne wyjaśnienie.",
  },
  {
    q: "Dlaczego mój loonheffing jest dużo niższy niż 37% stawka podatku dochodowego?",
    a: "Holenderska stawka podatku dochodowego 37% dotyczy rocznych dochodów powyżej progu. Przy WML dla 40-godzinnego tygodnia (ok. €30 600/rok brutto) jesteś w niższym przedziale. Ponadto heffingskorting (ulgi podatkowe — arbeidskorting plus algemene heffingskorting) może obniżyć efektywną stawkę do 10–15%. Jeśli kwalifikujesz się również do świadczenia ET, efektywny podatek może spaść poniżej 5% od zwróconej części.",
  },
  {
    q: "Czy agencja może potrącać więcej niż jest w mojej umowie?",
    a: "Nie. Zgodnie z holenderskim prawem i CAO ABU/NBBU potrącenia mogą być dokonywane tylko za usługi wyraźnie wymienione i wycenione w podpisanej umowie. Dodatkowe potrącenia za pościel, sprzątanie lub administrację, które nie zostały określone przed podpisaniem, są niedozwolone. Jeśli widzisz nieoczekiwane potrącenia, poproś o pisemne wyjaśnienie i w razie potrzeby skontaktuj się z Inspectie SZW (inspectieszw.nl) lub FNV.",
  },
  {
    q: "Na moim odcinku płacowym widnieje zero ET vergoeding — czy tracę pieniądze?",
    a: "Możliwe. Świadczenie ET (Extraterritoriale kosten) przysługuje pracownikom mieszkającym ponad 150 km od granicy holenderskiej i przebywającym w Holandii krócej niż 5 lat. Jeśli spełniasz te kryteria, a Twój odcinek płacowy nie pokazuje ET vergoeding, zapytaj bezpośrednio rekrutera agencji. Nie wszystkie agencje je stosują, nawet gdy pracownicy się kwalifikują. Przejście do agencji, która je stosuje, może zwiększyć Twój dochód netto o €50–€150/tyg.",
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
  headline: "Jak czytać holenderski odcinek płacowy (Loonstrook) — Wyjaśnienie 2026",
  description: "Kompletne wyjaśnienie każdego pola na holenderskim odcinku płacowym pracownika agencji, z przykładami przy WML (€14,71/godz.).",
  author: { "@type": "Organization", name: "AgencyCheck" },
  publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
  datePublished: "2026-01-01",
  dateModified: "2026-05-01",
  inLanguage: "pl",
  url: "https://agencycheck.io/pl/loonstrook-wyjasniony",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://agencycheck.io/pl" },
    { "@type": "ListItem", position: 2, name: "Przewodniki", item: "https://agencycheck.io/guides" },
    { "@type": "ListItem", position: 3, name: "Loonstrook wyjaśniony", item: "https://agencycheck.io/pl/loonstrook-wyjasniony" },
  ],
};

export default async function LoonstrookWyjasniony() {
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
            <Link href="/pl" className="hover:text-gray-300 transition-colors">Strona główna</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300 transition-colors">Przewodniki</Link>
            <span>/</span>
            <span className="text-gray-400">Loonstrook wyjaśniony</span>
          </nav>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3">Przewodnik płacowy 2026</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            Jak czytać holenderski odcinek płacowy<br className="hidden sm:block" />
            <span className="text-emerald-400"> (Loonstrook)</span> — każda linia wyjaśniona
          </h1>
          <p className="text-base text-gray-300 leading-relaxed mb-6">
            Każdy pracownik agencji w Holandii otrzymuje <strong className="text-white">loonstrook</strong> (odcinek płacowy) co tydzień lub co miesiąc.
            Większość pracowników rozumie tylko pierwszą i ostatnią linię — brutto i netto. 8–12 linii pomiędzy
            decyduje, czy jesteś wynagradzany prawidłowo. Ten przewodnik wyjaśnia każdą z nich.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {[
              "WML 2026: €14,71/godz.",
              "Vakantiegeld: obowiązkowe 8%",
              "SNF max zakwaterowanie: €113,50/tyg.",
              "Świadczenie ET: do €150/tyg.",
            ].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-semibold text-gray-300">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Przykładowy loonstrook ───────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
            Przykład: pracownik WML, 40 godzin/tydzień
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Na podstawie holenderskiego ustawowego wynagrodzenia minimalnego (WML) €14,71/godz. w 2026. Liczby mogą się nieznacznie różnić w zależności od agencji i okresu rozliczeniowego.
          </p>

          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 px-5 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Loonstrook — Przykład tygodniowy · WML €14,71/godz. · 40 godzin · Zakwaterowanie i transport agencji wliczone
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
                * ET vergoeding pokazane dotyczy pracowników mieszkających ponad 150 km od granicy holenderskiej i przebywających w Holandii krócej niż 5 lat.{" "}
                <Link href="/pl/system-et-holandia" className="text-blue-600 underline">Zobacz pełny przewodnik ET →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabela skrótów ───────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Częste skróty na holenderskich odcinkach płacowych</h2>
          <p className="text-sm text-gray-500 mb-6">
            Holenderskie odcinki płacowe używają wielu skrótów. Oto te, które zobaczysz najczęściej.
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

      {/* ── Lista kontrolna ──────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">8-punktowa kontrola odcinka płacowego — rób to co okres rozliczeniowy</h2>
          <p className="text-sm text-gray-500 mb-6">
            Zajmuje 5 minut. Wychwytuje błędy zanim się nagromadzą. Pracodawca jest prawnie zobowiązany do wydania Ci odcinka płacowego — jeśli go nie otrzymujesz, poproś o to na piśmie.
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
              <strong>Znalazłeś niezgodność?</strong> Najpierw poproś rekrutera agencji o pisemne wyjaśnienie.
              Jeśli problem nie zostanie rozwiązany, skontaktuj się z <strong>Inspectie SZW</strong> na{" "}
              <a href="https://www.inspectieszw.nl" target="_blank" rel="noopener noreferrer" className="underline">inspectieszw.nl</a>{" "}
              lub <strong>FNV</strong> (główny holenderski związek zawodowy, bezpłatny dla pracowników) na{" "}
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
              Większość pracowników to przegapia
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-2">
              Czy na Twoim odcinku płacowym jest &ldquo;ET vergoeding&rdquo;? Jeśli nie, możesz tracić €50–€150/tyg.
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Schemat ET (Extraterritoriale kosten) to legalny, wolny od podatku zwrot dostępny dla pracowników
              mieszkających ponad 150 km od granicy holenderskiej. Może dodać €50–€150/tyg. do Twojego dochodu netto,
              pokrywając część dodatkowych kosztów pracy za granicą. Nie jest automatyczny — agencja musi go stosować. Wiele tego nie robi.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/pl/system-et-holandia"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors px-5 py-2.5 text-sm font-black text-white active:scale-[0.98]">
                Przeczytaj pełny przewodnik ET →
              </Link>
              <Link href="/tools/real-salary-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 transition-colors px-5 py-2.5 text-sm font-bold text-amber-800">
                Oblicz swój rzeczywisty dochód netto →
              </Link>
            </div>
          </div>
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
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Aplikuj przez AgencyCheck</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Znajdź agencję z przejrzystymi umowami</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Każda agencja na AgencyCheck pokazuje szacunkowe tygodniowe zarobki netto, koszty zakwaterowania i warunki umowy z góry.
              Bezpłatna aplikacja przez WhatsApp — odpowiedź tego samego dnia.
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
              Przeglądaj wszystkie oferty pracy →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Powiązane przewodniki ─────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-base font-black text-gray-900 mb-4">Powiązane przewodniki</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: "/pl/system-et-holandia",     label: "Schemat ET w Holandii — pełny przewodnik" },
              { href: "/pl/numer-bsn-holandia",      label: "Jak uzyskać numer BSN" },
              { href: "/after-you-apply",             label: "Co się dzieje po złożeniu aplikacji" },
              { href: "/what-is-order-picking",       label: "Order picking — wynagrodzenie i warunki" },
              { href: "/tools/real-salary-calculator", label: "Kalkulator wynagrodzenia netto" },
              { href: "/methodology",                 label: "Jak AgencyCheck weryfikuje agencje" },
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
