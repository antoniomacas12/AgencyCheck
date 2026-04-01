import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Zarobki w Holandii Netto 2026 — Ile Naprawdę Zostaje Po Odliczeniach",
  description:
    "Kalkulator zarobków netto w Holandii 2026. WML €14,71/godz. Ile zostaje po odliczeniu zakwaterowania, podatku, ubezpieczenia i transportu? Realne kwoty według pracy: magazyn, produkcja, szklarnia.",
  keywords: [
    "zarobki Holandia netto",
    "ile zarabia się w Holandii",
    "wynagrodzenie minimalne Holandia 2026",
    "zarobki Holandia magazyn",
    "kalkulator zarobków Holandia",
    "ile zostaje z wypłaty w Holandii",
    "pensja netto Holandia agencja",
  ],
  alternates: {
    canonical: "https://agencycheck.io/pl/zarobki-holandia",
    languages: {
      "en":        "https://agencycheck.io/real-salary-netherlands-agency-work",
      "pl":        "https://agencycheck.io/pl/zarobki-holandia",
      "ro":        "https://agencycheck.io/ro/salariu-olanda",
      "x-default": "https://agencycheck.io/real-salary-netherlands-agency-work",
    },
  },
  openGraph: {
    title: "Zarobki Holandia Netto 2026 — Kalkulator i Realne Kwoty",
    description:
      "Zarobek brutto vs netto w Holandii. Co naprawdę zostaje po odliczeniu zakwaterowania, podatku i transportu? Sprawdź przed wyjazdem.",
    locale: "pl_PL",
  },
};

const BREAKDOWN_ROWS = [
  { label: "Wynagrodzenie brutto (WML €14,71 × 40h)",  amount: "+€588", color: "text-green-700",  bg: "bg-green-50"  },
  { label: "Podatek dochodowy (loonheffing ~10%)",      amount: "−€63",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "Zakwaterowanie agencji (norma SNF)",        amount: "−€95",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "Ubezpieczenie zdrowotne (zorgverzekering)", amount: "−€35",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "Transport (bus agencji)",                   amount: "−€25",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "Opłaty administracyjne",                    amount: "−€25",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "💶 Zostaje Ci tygodniowo",                 amount: "€345",  color: "text-green-800", bg: "bg-green-100" },
];

const JOB_COMPARISON = [
  { job: "Pracownik magazynu", rate: "€14,71", gross_weekly: "€588", net_weekly: "~€345–€365", housing: "Zwykle dostępne" },
  { job: "Pracownik produkcji", rate: "€14,71–€15,50", gross_weekly: "€588–€620", net_weekly: "~€350–€380", housing: "Zwykle dostępne" },
  { job: "Pracownik szklarni", rate: "€14,71", gross_weekly: "€588", net_weekly: "~€340–€360", housing: "Sezonowe" },
  { job: "Kierowca reach truck", rate: "€15,50–€17,00", gross_weekly: "€620–€680", net_weekly: "~€380–€420", housing: "Rzadziej dostępne" },
  { job: "Operator wózka widłowego", rate: "€16,00–€18,00", gross_weekly: "€640–€720", net_weekly: "~€390–€440", housing: "Rzadko" },
];

const FAQS = [
  {
    q: "Ile wynosi minimalne wynagrodzenie w Holandii w 2026 roku?",
    a: "Minimalna stawka godzinowa (WML) w 2026 roku wynosi €14,71 brutto. Przy 40 godzinach tygodniowo to €588 brutto na tydzień. Po odliczeniu podatku (ok. 10% dla niskich zarobków) i kosztów zakwaterowania — zostaje ok. €345–€380 netto tygodniowo.",
  },
  {
    q: "Czy agencja może potrącać mi za zakwaterowanie?",
    a: "Tak, ale tylko jeśli zostało to zapisane w umowie i zgodnie ze stawkami SNF (Stichting Normering Flexwonen). Maksymalna stawka za zakwaterowanie SNF to ok. €105–€115 tygodniowo w zależności od standardu. Sprawdź kontrakt zanim podpiszesz.",
  },
  {
    q: "Ile zostaje mi miesięcznie przy pracy przez agencję w Holandii?",
    a: "Przy WML i 40h/tydzień: ok. €1.380–€1.520 netto miesięcznie po wszystkich odliczeniach. To zakłada zakwaterowanie ~€95, ubezpieczenie ~€35 i transport ~€25 tygodniowo. Bez zakwaterowania agencji możesz zarobić ok. €1.600–€1.750 netto miesięcznie.",
  },
  {
    q: "Co to jest loonheffing?",
    a: "Loonheffing to holenderski podatek od wynagrodzenia pobierany bezpośrednio przez pracodawcę. Przy stawce WML i bez żadnych odliczeń podatkowych wynosi ok. 8–12% brutto. Możesz ubiegać się o zwrot nadpłaconego podatku składając roczne rozliczenie (aangifte inkomstenbelasting).",
  },
  {
    q: "Jak sprawdzić czy moja wypłata jest prawidłowa?",
    a: "Poproś agencję o szczegółowy odcinek płacowy (loonstrook). Każde odliczenie musi być wymienione z osobna. Możesz sprawdzić poprawność na mijnloon.nl lub skontaktować się z FNV (fnv.nl) jeśli coś nie zgadza się z umową.",
  },
  {
    q: "Czy mogę odliczyć coś od podatku pracując w Holandii przez agencję?",
    a: "Tak. Możesz ubiegać się o heffingskorting (ulga podatkowa) i arbeidskorting (ulga od pracy). Wiele agencji stosuje je automatycznie. Po zakończeniu roku podatkowego możesz złożyć zeznanie i odzyskać nadpłatę — szczególnie jeśli pracowałeś tylko część roku.",
  },
];

export default function ZarobkiHolandia() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",               url: "/" },
    { name: "Polski",             url: "/pl" },
    { name: "Zarobki w Holandii", url: "/pl/zarobki-holandia" },
  ]);
  const faqSchema = faqPageSchema(FAQS.map((f) => ({ question: f.q, answer: f.a })));

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-gray-500 mb-5 flex items-center gap-1.5 flex-wrap">
            <Link href="/pl" className="hover:text-gray-300">AgencyCheck PL</Link>
            <span>/</span>
            <span className="text-gray-400">Zarobki w Holandii netto</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Ile Naprawdę Zarabiasz<br className="hidden sm:block" /> w Holandii? — 2026
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            Ogłoszenia piszą €14,71–€17/godz. Ale to stawka brutto, przed wszystkimi odliczeniami.
            Poniżej znajdziesz realny rozkład — co z tej kwoty faktycznie trafia na twoje konto.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2 text-emerald-300 text-sm font-bold">
            💶 Realne zarobki netto: ~€345–€380/tydzień przy WML
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">

        {/* ── Breakdown ─────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Rozkład Wypłaty — Co Zostaje Netto
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Przykład: magazyn lub produkcja, 40 godzin tygodniowo, zakwaterowanie w agencji, WML 2026.
          </p>

          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            {BREAKDOWN_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i < BREAKDOWN_ROWS.length - 1 ? "border-b border-gray-50" : `${row.bg} border-t border-green-200`
                } ${i === BREAKDOWN_ROWS.length - 1 ? "py-4" : ""}`}
              >
                <span className={`text-sm ${i === BREAKDOWN_ROWS.length - 1 ? "font-black text-gray-900" : "text-gray-700"}`}>
                  {row.label}
                </span>
                <span className={`text-sm font-black tabular-nums ${row.color}`}>
                  {row.amount}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            * Kwoty orientacyjne na rok 2026. Transport i administracja zależą od agencji i lokalizacji.
            Zakwaterowanie SNF może wynosić €88–€115 w zależności od standardu obiektu.
          </p>
        </section>

        {/* ── Without housing ───────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-3">
            A bez zakwaterowania agencji?
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Jeśli masz własne mieszkanie lub wynajmujesz prywatnie, twoje netto tygodniowo wzrasta o ~€95 do około
            <strong className="text-gray-900"> €430–€460/tydzień</strong> (€1.720–€1.840 miesięcznie).
            Znalezienie prywatnego zakwaterowania w Holandii jest trudne — szczególnie poza dużymi miastami —
            ale może być bardziej opłacalne długoterminowo.
          </p>
          <Link
            href="/pl/praca-z-zakwaterowaniem"
            className="text-sm font-bold text-blue-700 hover:text-blue-800"
          >
            Porównaj agencje oferujące zakwaterowanie →
          </Link>
        </section>

        {/* ── Job comparison ────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-5">
            Zarobki Netto Według Stanowiska
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Stanowisko</th>
                  <th className="text-right px-4 py-3 font-semibold">Stawka/godz.</th>
                  <th className="text-right px-4 py-3 font-semibold">Brutto/tydzień</th>
                  <th className="text-right px-4 py-3 font-semibold">Netto/tydzień</th>
                  <th className="text-right px-4 py-3 font-semibold">Zakwaterowanie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {JOB_COMPARISON.map((row) => (
                  <tr key={row.job} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.job}</td>
                    <td className="px-4 py-3 text-right text-gray-700 tabular-nums">{row.rate}</td>
                    <td className="px-4 py-3 text-right text-gray-700 tabular-nums">{row.gross_weekly}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-700 tabular-nums">{row.net_weekly}</td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">{row.housing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2.5">
            Wartości netto zakładają zakwaterowanie agencji. Wyższe stawki (reach truck, wózek widłowy)
            wymagają aktualnych uprawnień.
          </p>
        </section>

        {/* ── Tips ──────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">
            Jak Sprawdzić Czy Twoja Wypłata Jest Prawidłowa
          </h2>
          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "Poproś o odcinek płacowy (loonstrook)",
                text: "Każda agencja jest zobowiązana do wystawienia szczegółowego odcinka płacowego. Każde odliczenie musi być wymienione z osobna — bez ogólnych 'kosztów administracyjnych'.",
              },
              {
                step: "2",
                title: "Sprawdź stawkę podstawową",
                text: "Stawka godzinowa nie może być niższa niż WML: €14,71 brutto/godz. (2026). Jeśli twoja stawka jest niższa — jest to nielegalne.",
              },
              {
                step: "3",
                title: "Sprawdź odliczenia za zakwaterowanie",
                text: "Maksymalna stawka SNF za zakwaterowanie to ok. €105–€115 tygodniowo. Jeśli agencja potrąca więcej — możesz złożyć skargę do SNCU.",
              },
              {
                step: "4",
                title: "Złóż zeznanie podatkowe po roku",
                text: "Wiele osób pracujących przez agencję przepłaca podatek. Po zakończeniu roku podatkowego złóż aangifte inkomstenbelasting — możesz odzyskać kilkaset euro.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 rounded-xl border border-gray-100 p-4">
                <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">{item.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-5">
            Najczęstsze Pytania o Zarobki w Holandii
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
            { href: "/pl/agencje-pracy-holandia",   label: "Opinie o agencjach pracy",  icon: "🏢" },
            { href: "/pl/praca-z-zakwaterowaniem",   label: "Praca z zakwaterowaniem",   icon: "🏠" },
            { href: "/pl",                           label: "Strona główna PL",           icon: "🇵🇱" },
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
