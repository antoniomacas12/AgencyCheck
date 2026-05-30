import type { Metadata } from "next";
import Link from "next/link";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import AgencyCard from "@/components/AgencyCard";
import { getJobCountForAgency } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "System ET w Holandii 2026 — Wyjaśnienie dla Pracowników Agencji (Do €150/tyg. Więcej)",
  description:
    "Schemat ET (koszty eksterytorialne) może dodać €50–€150/tyg. do Twojego dochodu netto w Holandii — bez podatku. Kto się kwalifikuje, ile jest wart i jak sprawdzić, czy Twoja agencja go stosuje.",
  alternates: {
    canonical: "https://agencycheck.io/pl/system-et-holandia",
    languages: { en: "https://agencycheck.io/et-scheme-netherlands-explained" },
  },
  openGraph: {
    title: "System ET w Holandii 2026 — Do €150/tyg. więcej netto",
    description:
      "Większość pracowników agencji z UE kwalifikuje się do świadczenia ET, ale o tym nie wie. Wyjaśniamy, kto się kwalifikuje, ile płaci i jak sprawdzić swój loonstrook.",
  },
};

export const dynamic = "force-static";

// ─── Tabela porównawcza: z ET vs bez ET ──────────────────────────────────────
const COMPARISON = [
  { label: "Tygodniowa płaca brutto (WML 40h)",          without: "€588",  with_et: "€588",  note: null },
  { label: "Loonheffing (podatek dochodowy po ulgach)",   without: "−€63", with_et: "−€20",  note: "ET obniża podstawę opodatkowania" },
  { label: "Składki WW/ZW",                              without: "−€18", with_et: "−€18",  note: null },
  { label: "Ubezpieczenie zdrowotne",                    without: "−€35", with_et: "−€35",  note: null },
  { label: "Zakwaterowanie agencji (standard SNF)",       without: "−€95", with_et: "−€95",  note: null },
  { label: "Transport do pracy",                         without: "−€25", with_et: "−€25",  note: null },
  { label: "ET vergoeding (zwrot wolny od podatku)",      without: "€0",   with_et: "+€84",  note: "Typowy zakres €50–€150/tyg." },
  { label: "Nettoloon (wypłata na rękę)",                 without: "€352", with_et: "€479",  note: "Różnica +€127/tyg." },
];

// ─── Kto się kwalifikuje ──────────────────────────────────────────────────────
const QUALIFICATIONS = [
  {
    icon: "🌍",
    title: "Mieszkasz ponad 150 km od granicy holenderskiej",
    body: "Główne kryterium kwalifikacyjne to posiadanie stałego adresu zamieszkania w odległości ponad 150 km od najbliższego punktu granicy holenderskiej. Dla większości pracowników z Europy Wschodniej jest to łatwo spełnione: Warszawa jest oddalona o 1 200 km, Bukareszt o 1 800 km, Sofia o 2 000 km. Pracownicy z Belgii lub Niemiec mieszkający blisko granicy zazwyczaj się nie kwalifikują.",
  },
  {
    icon: "⏱",
    title: "Przebywasz w Holandii krócej niż 5 lat",
    body: "Świadczenie ET jest przeznaczone dla pracowników tymczasowo przebywających poza krajem ojczystym. Przysługuje maksymalnie przez 5 lat (60 miesięcy) od dnia, kiedy po raz pierwszy zacząłeś pracować w Holandii. Po 5 latach nie kwalifikujesz się już, nawet jeśli nadal mieszkasz za granicą.",
  },
  {
    icon: "📋",
    title: "Twoja umowa o pracę musi zawierać klauzulę ET",
    body: "Arrangement ET nie jest automatyczny — musi być uzgodniony na piśmie między Tobą a pracodawcą. Dla pracowników agencji oznacza to zazwyczaj, że klauzula ET jest zawarta w standardowej umowie agencyjnej (arbeidsovereenkomst). Zapytaj rekrutera bezpośrednio: 'Wordt de ET-vergoeding op mijn contract toegepast?' (Czy ET vergoeding jest stosowane w mojej umowie?)",
  },
];

// ─── Jak sprawdzić odcinek płacowy ────────────────────────────────────────────
const PAYSLIP_CHECKS = [
  { label: "Szukaj 'ET vergoeding' lub 'ET toeslag'", detail: "Ta linia powinna pokazywać dodatnią kwotę — Twój zwrot wolny od podatku za dany okres." },
  { label: "Szukaj 'Onkostenvergoeding'", detail: "Niektóre agencje używają tego ogólnego terminu dla zwrotów kosztów, w tym kosztów ET." },
  { label: "Sprawdź 'Belastingvrije vergoeding'", detail: "Zwrot wolny od podatku — inna częsta etykieta dla komponentu ET." },
  { label: "Porównaj loonheffing z kolegą bez ET", detail: "Jeśli schemat ET jest stosowany prawidłowo, Twój loonheffing powinien być zauważalnie niższy przy tym samym wynagrodzeniu brutto." },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Czym jest schemat ET w Holandii?",
    a: "Schemat ET (Extraterritoriale kosten) pozwala holenderskim pracodawcom zwracać pracownikom dodatkowe koszty życia i pracy poza krajem ojczystym — bez podatku. Opiera się na Artykule 31a holenderskiej ustawy o podatku od wynagrodzenia (Wet op de loonbelasting 1964). Świadczenie jest płacone dodatkowo do normalnego wynagrodzenia i zmniejsza część dochodu podlegającą holenderskiemu loonheffing (podatkowi od wynagrodzenia). Dla pracowników agencji może to oznaczać €50–€150/tyg. więcej na rękę w porównaniu z pracownikami przy tym samym wynagrodzeniu brutto bez ET.",
  },
  {
    q: "Czy automatycznie kwalifikuję się do schematu ET jako pracownik z UE w Holandii?",
    a: "Nie automatycznie. Kwalifikujesz się, jeśli: (1) Twój stały dom jest oddalony o ponad 150 km od granicy holenderskiej, (2) przebywasz w Holandii krócej niż 5 lat, i (3) Twoja umowa o pracę zawiera klauzulę ET. Reguła 150 km eliminuje pracowników z Belgii i Niemiec mieszkających blisko granicy holenderskiej. Wszyscy pracownicy z Europy Wschodniej (Polska, Rumunia, Bułgaria, Słowacja, Węgry itp.) łatwo spełniają wymóg odległości.",
  },
  {
    q: "Ile wart jest schemat ET tygodniowo?",
    a: "Świadczenie ET jest obliczane jako procent wynagrodzenia brutto — zazwyczaj 30% podlegającego opodatkowaniu brutto dla osób z wyższymi zarobkami w ramach 'reguły 30%', ale dla pracowników agencji jest zazwyczaj obliczane na podstawie rzeczywistych kosztów eksterytorialnych. W praktyce tygodniowy zysk netto dla pracownika agencji przy WML (€14,71/godz., 40 godz./tyg.) wynosi €50–€150/tyg. w zależności od sposobu obliczania przez agencję. Przykład na tej stronie pokazuje typowy zysk ok. €127/tyg. netto.",
  },
  {
    q: "Moja agencja twierdzi, że nie stosuje ET. Czy mogę przejść do agencji, która to robi?",
    a: "Tak. Nie wszystkie agencje stosują schemat ET, nawet gdy pracownicy się kwalifikują. Niektóre agencje go nie znają, inne decydują się go nie oferować. Jeśli się kwalifikujesz, a Twoja obecna agencja nie stosuje ET, masz prawo negocjować lub znaleźć agencję, która to robi. Porównując agencje na AgencyCheck, możesz sprawdzić, czy ET vergoeding jest wspomniane w warunkach ich umów, lub zapytać bezpośrednio przy składaniu aplikacji.",
  },
  {
    q: "Co się dzieje po 5 latach — czy tracę świadczenie ET?",
    a: "Tak — po 60 miesiącach pracy w Holandii świadczenie ET wygasa. Licznik 5-letni zaczyna się od pierwszego dnia pracy w Holandii, nie od momentu złożenia wniosku o schemat ET. Niektórzy pracownicy, którzy od lat przyjeżdżają do Holandii sezonowo, mogli już wykorzystać część lub całość swoich 60 miesięcy, nie zdając sobie z tego sprawy. Jeśli pracujesz w Holandii od dłuższego czasu, poproś agencję lub holenderskiego doradcę podatkowego o sprawdzenie pozostałej kwalifikowalności ET.",
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
  headline: "System ET w Holandii 2026 — Wyjaśnienie dla Pracowników Agencji",
  description: "Kompletne wyjaśnienie holenderskiego świadczenia ET (Extraterritoriale kosten) dla pracowników agencji z UE: kto się kwalifikuje, ile jest warte i jak sprawdzić loonstrook.",
  author: { "@type": "Organization", name: "AgencyCheck" },
  publisher: { "@type": "Organization", name: "AgencyCheck", url: "https://agencycheck.io" },
  datePublished: "2026-01-01",
  dateModified: "2026-05-01",
  inLanguage: "pl",
  url: "https://agencycheck.io/pl/system-et-holandia",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://agencycheck.io/pl" },
    { "@type": "ListItem", position: 2, name: "Przewodniki", item: "https://agencycheck.io/guides" },
    { "@type": "ListItem", position: 3, name: "System ET Holandia", item: "https://agencycheck.io/pl/system-et-holandia" },
  ],
};

export default async function SystemEtHolandia() {
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
            <span className="text-gray-400">System ET wyjaśniony</span>
          </nav>
          <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">Przewodnik po uldze podatkowej 2026</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
            System ET w Holandii —<br className="hidden sm:block" />
            <span className="text-amber-400">Do €150/tyg. więcej, bez podatku</span>
          </h1>
          <p className="text-base text-gray-300 leading-relaxed mb-6">
            Schemat <strong className="text-white">ET (Extraterritoriale kosten)</strong> to legalny holenderski benefit podatkowy,
            do którego kwalifikuje się większość pracowników agencji z UE — ale większość nigdy o nim nie słyszała.
            Jeśli Twoja agencja go prawidłowo stosuje, Twoja wypłata netto może wzrosnąć o <strong className="text-white">€50–€150 tygodniowo</strong>,
            bez zarobienia nawet jednego euro więcej brutto. Ten przewodnik wyjaśnia wszystko.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {["Na podstawie Art. 31a Wet LB 1964", "Kwalifikuje się jeśli >150km od granicy NL", "Ważny przez 5 lat (60 miesięcy)", "Sprawdź: 'ET vergoeding' na loonstrook"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-semibold text-gray-300">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tabela porównawcza ────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
            Liczby — pracownik WML, 40 godz./tyg.
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Ta sama płaca brutto. To samo zakwaterowanie agencji. Ta sama praca. Jedyna różnica to czy schemat ET jest stosowany.
          </p>
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-900 px-5 py-3 gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pozycja</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Bez ET</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 text-right">Z ET</span>
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
            Przykład oparty na WML 2026 (€14,71/godz. × 40 godz./tyg. = €588 brutto). ET vergoeding obliczone według typowej stawki agencji.
            Rzeczywiste kwoty różnią się w zależności od agencji i indywidualnych okoliczności.
          </p>
        </div>
      </section>

      {/* ── Kto się kwalifikuje ───────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Kto kwalifikuje się do schematu ET?</h2>
          <p className="text-sm text-gray-500 mb-8">Wszystkie trzy warunki muszą być spełnione jednocześnie.</p>
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
              <strong>Szybkie sprawdzenie:</strong> Czy jesteś z Polski, Rumunii, Bułgarii, Słowacji, Węgier, Ukrainy lub innego kraju oddalonego o ponad 150 km od Holandii?
              Czy przebywasz w Holandii krócej niż 5 lat?
              Jeśli tak — prawdopodobnie się kwalifikujesz. Zapytaj rekrutera agencji, czy Twoja umowa zawiera ET vergoeding.
            </p>
          </div>
        </div>
      </section>

      {/* ── Jak sprawdzić loonstrook ──────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Jak sprawdzić swój loonstrook pod kątem ET</h2>
          <p className="text-sm text-gray-500 mb-6">
            Różne agencje używają różnych etykiet. Szukaj dowolnej z tych na swoim <strong>loonstrook</strong>:
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
              <strong>Żadna z tych pozycji nie pojawia się na Twoim loonstrook?</strong> Zapytaj rekrutera bezpośrednio:
              <em className="text-gray-600"> &ldquo;Wordt de ET-vergoeding op mijn loonstrook toegepast en zo niet, waarom niet?&rdquo;</em>
              (Czy ET vergoeding jest stosowane na moim loonstrook i jeśli nie — dlaczego nie?)
            </p>
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
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Znajdź agencje stosujące schemat ET</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Aplikując przez AgencyCheck, możesz zapytać rekrutera bezpośrednio o ET vergoeding przed podpisaniem.
              Bezpłatna aplikacja — odpowiedź na WhatsApp tego samego dnia.
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
              { href: "/pl/loonstrook-wyjasniony",         label: "Jak czytać holenderski odcinek płacowy" },
              { href: "/pl/numer-bsn-holandia",             label: "Jak uzyskać numer BSN" },
              { href: "/after-you-apply",                   label: "Co się dzieje po złożeniu aplikacji" },
              { href: "/tools/real-salary-calculator",      label: "Kalkulator wynagrodzenia netto w Holandii" },
              { href: "/what-is-order-picking",             label: "Order picking — wynagrodzenie i warunki" },
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
