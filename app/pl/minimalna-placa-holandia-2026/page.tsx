import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Minimalna Płaca Holandia 2026 — Stawka Godzinowa i Miesięczna dla Pracowników",
  description:
    "Holenderska minimalna płaca (WML) w 2026 roku: dokładna stawka godzinowa, kwota miesięczna, jak loonheffing i potrącenia wpływają na Twoje realne wynagrodzenie netto oraz co agencje muszą legalnie płacić.",
  alternates: { canonical: "https://agencycheck.io/minimum-wage-netherlands-2026" },
};

export const dynamic = "force-static";

const WML_RATES = [
  { period: "Za godzinę (40h/tyg.)",   gross: "€13,68",  note: "Dotyczy wszystkich pracowników w wieku 21+ bez względu na narodowość" },
  { period: "Za godzinę (38h/tyg.)",   gross: "€14,40",  note: "Jeśli umowa określa 38-godzinny tydzień pracy" },
  { period: "Za godzinę (36h/tyg.)",   gross: "€15,20",  note: "Zależy od układu zbiorowego (CAO)" },
  { period: "Za tydzień (40h)",         gross: "€547,20", note: "Przed loonheffing, składkami i potrąceniami" },
  { period: "Za miesiąc (40h)",         gross: "€2 373",  note: "52 tygodnie × €547,20 ÷ 12" },
  { period: "Vakantiegeld (8%)",        gross: "+€189/mies.",note: "Naliczany miesięcznie, wypłacany w maju (ABU CAO) lub na żądanie" },
];

const LEGAL_DEDUCTIONS = [
  {
    icon: "🏠",
    label: "Zakwaterowanie (huisvesting)",
    max: "€113,50/tyg.",
    rule: "Maksimum SNF 2026 — tylko jeśli zakwaterowanie jest faktycznie zapewnione i certyfikowane przez SNF. Nie może przekraczać 25% stawki godzinowej brutto × przepracowane godziny.",
    allowed: true,
  },
  {
    icon: "🚌",
    label: "Transport (vervoerskosten)",
    max: "Rzeczywisty koszt",
    rule: "Może być potrącony tylko jeśli agencja organizuje transport. Musi być wyszczególniony na loonstrook. Nie może zawierać marży zysku na transporcie.",
    allowed: true,
  },
  {
    icon: "🏥",
    label: "Ubezpieczenie zdrowotne (zorgverzekering)",
    max: "~€170/mies.",
    rule: "Zbiorowe programy zdrowotne agencji są legalnymi odliczeniami tylko jeśli wyraziłeś zgodę. Podstawowe holenderskie ubezpieczenie zdrowotne (basisverzekering) jest prawnie wymagane po podjęciu pracy w NL.",
    allowed: true,
  },
  {
    icon: "❌",
    label: "Opłata rekrutacyjna / za pośrednictwo",
    max: "€0",
    rule: "Całkowicie zabronione. Od nowelizacji WAADI (Wet Toelating Terbeschikkingstelling van Arbeidskrachten, 2024) agencje nie mogą pobierać od pracowników żadnej opłaty za znalezienie pracy. Naruszenia zgłaszaj do Inspectie SZW.",
    allowed: false,
  },
  {
    icon: "❌",
    label: "Uniform / odzież robocza",
    max: "€0",
    rule: "Nie można obciążać pracownika jeśli odzież jest wymagana do pracy (kamizelka bezpieczeństwa, buty z metalową czubką do magazynu). Opcjonalna odzież markowa może być pobierana tylko za pisemną zgodą.",
    allowed: false,
  },
  {
    icon: "❌",
    label: "Opłaty za dokumenty / rejestrację",
    max: "€0",
    rule: "Koszty administracyjne związane z Twoją rejestracją, weryfikacją BSN lub konfiguracją DigiD nie mogą być pobierane. Zabronione na mocy Art. 12 Wet minimumloon (WML).",
    allowed: false,
  },
];

const NET_EXAMPLE = [
  { label: "Brutto tygodniowe (40h @ WML)",                      amount: "+€547",  plus: true  },
  { label: "Loonheffing (podatek dochodowy, z heffingskorting)",  amount: "−€60",   plus: false },
  { label: "Składka WW (ubezpieczenie na bezrobocie)",            amount: "−€22",   plus: false },
  { label: "Składki ZW/WIA (choroba/niepełnosprawność)",          amount: "−€14",   plus: false },
  { label: "Zorgverzekering (ubezpieczenie zdrowotne)",           amount: "−€40",   plus: false },
  { label: "Huisvesting (zakwaterowanie SNF, jeśli korzystasz)",  amount: "−€95",   plus: false },
  { label: "Transport (jeśli organizuje agencja)",                amount: "−€25",   plus: false },
  { label: "Nettoloon (na rękę)",                                 amount: "≈ €291", plus: true  },
];

const FAQS = [
  {
    q: "Jaka jest minimalna płaca w Holandii w 2026 roku?",
    a: "Holenderska ustawowa minimalna płaca (Wettelijk Minimumloon, WML) dla pracowników w wieku 21 lat i starszych pracujących 40 godzin tygodniowo wynosi €13,68 za godzinę, €547,20 za tydzień i około €2 373 miesięcznie (brutto). Stawki są aktualizowane przez rząd holenderski 1 stycznia i 1 lipca każdego roku na podstawie średniego wzrostu płac. Od lipca 2023 r. minimalna płaca dotyczy wszystkich pracowników powyżej 21 roku życia bez względu na wiek — stara skala stopniowania wiekowego została zniesiona. Polscy pracownicy stanowią najliczniejszą grupę pracowników zagranicznych w Holandii i w pełni podlegają ochronie WML.",
  },
  {
    q: "Czy minimalna płaca jest taka sama dla pracowników z UE i Holendrów?",
    a: "Tak. Holenderskie WML dotyczy wszystkich pracowników w Holandii bez względu na narodowość. Polscy, rumańscy, bułgarscy, słowaccy i inni pracownicy z UE pracujący w Holandii muszą otrzymywać co najmniej WML. Wypłacanie poniżej WML jest nielegalne i można je zgłosić do Holenderskiego Urzędu Pracy (Inspectie SZW / Netherlands Labour Authority). Układy zbiorowe ABU i NBBU regulujące pracę tymczasową również określają WML jako minimalną stawkę.",
  },
  {
    q: "Czy agencja może płacić poniżej płacy minimalnej odliczając zakwaterowanie i transport?",
    a: "Nie. Potrącenia za zakwaterowanie i transport podlegają ścisłym limitom i nie mogą obniżyć wynagrodzenia netto poniżej ustawowej netto płacy minimalnej. Maksymalne potrącenie za zakwaterowanie wynosi €113,50/tydzień (maksimum SNF 2026) i może być pobierane tylko jeśli rzeczywiście mieszkasz w zakwaterowaniu zapewnionym przez agencję. Jeśli podejrzewasz, że Twoje wynagrodzenie netto po potrąceniach jest poniżej minimum prawnego, możesz złożyć zawiadomienie do Inspectie SZW (holenderska inspekcja pracy) lub skontaktować się ze związkiem FNV.",
  },
  {
    q: "Czym jest vakantiegeld i czy jest doliczany do płacy minimalnej?",
    a: "Vakantiegeld (wynagrodzenie urlopowe) to dodatkowe 8% Twojego rocznego wynagrodzenia brutto, wymagane przez prawo na mocy Art. 15 Wet minimumloon. Dla pracownika pełnoetatowego na WML wynosi to około €189/miesiąc, wypłacane w całości w maju na mocy ABU CAO lub wbudowane w stawkę godzinową w kontraktach fazy NBBU. Jest to dodatek do regularnego wynagrodzenia, nie jest w nim uwzględniony — więc efektywna stawka godzinowa łącznie z vakantiegeld wynosi około €14,77/godzinę przy WML.",
  },
  {
    q: "Czy nadgodziny są płatne więcej niż płaca minimalna?",
    a: "Tak. Na mocy ABU CAO, godziny powyżej 40 tygodniowo (overwerktoeslag) są płatne w wysokości 125% normalnej stawki godzinowej za pierwsze 8 dodatkowych godzin i 150% od 9. dodatkowej godziny wzwyż. Twoja normalna stawka godzinowa może być wyższa niż WML jeśli Twoje stanowisko jest klasyfikowane według skali wynagrodzenia (loonschaal) w odpowiednim sektorowym CAO — np. logistyka, przetwórstwo żywności lub metalurgia mają własne stawki CAO powyżej poziomu WML.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Minimalna Płaca Holandia 2026 — Stawka Godzinowa i Miesięczna dla Pracowników",
      "description": "Holenderskie WML w 2026 roku: dokładne stawki, legalne potrącenia, przykłady wynagrodzenia netto i prawa pracownika.",
      "url": "https://agencycheck.io/minimum-wage-netherlands-2026",
      "datePublished": "2026-01-01",
      "dateModified": "2026-05-01",
      "inLanguage": "pl",
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
        { "@type": "ListItem", "position": 1, "name": "Strona główna", "item": "https://agencycheck.io/pl" },
        { "@type": "ListItem", "position": 2, "name": "Poradniki",     "item": "https://agencycheck.io/guides" },
        { "@type": "ListItem", "position": 3, "name": "Minimalna Płaca Holandia 2026" },
      ],
    },
  ],
};

export default function MinimalnaPlacaHolandia2026Page() {
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
            <Link href="/pl" className="hover:text-gray-300 transition-colors">Strona główna</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300 transition-colors">Poradniki</Link>
            <span>/</span>
            <span className="text-gray-200">Minimalna Płaca 2026</span>
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-10 pt-4">
            <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🇳🇱 Holenderskie prawo pracy — aktualizacja 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Minimalna Płaca Holandia 2026
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Holenderska ustawowa minimalna płaca (WML — Wettelijk Minimumloon) określa legalny
              dolny próg dla wszystkich pracowników w Holandii. Oto dokładne dane na 2026 rok:
              co agencje mogą i nie mogą potrącać, oraz jak wygląda Twoje realne wynagrodzenie
              na rękę.
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 space-y-14">

          {/* ── Nota dla Polaków ── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm">
            <p className="font-bold text-blue-800 mb-1">🇵🇱 Polacy są największą grupą pracowników zagranicznych w Holandii</p>
            <p className="text-blue-700 leading-relaxed">
              Szacuje się, że w Holandii pracuje ponad 300 000 Polaków. Wszyscy podlegają ochronie WML
              — bez względu na branżę, typ agencji czy region. Jeśli Twoja agencja płaci poniżej
              €13,68/godz., narusza holenderskie prawo.
            </p>
          </div>

          {/* ── Tabela stawek ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Stawki WML 2026</h2>
            <p className="text-gray-600 text-sm mb-5">
              Poniższe stawki dotyczą pracowników w wieku 21+. Od lipca 2023 r. WML dotyczy
              wszystkich pracowników bez względu na wiek. Rząd aktualizuje stawki{" "}
              <strong>1 stycznia</strong> i <strong>1 lipca</strong> każdego roku.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Okres</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Kwota brutto</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Uwagi</th>
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
              Źródło: Rijksoverheid.nl — Wettelijk minimumloon i minimumjeugdloon od 1 stycznia 2026.
              Stawki aktualizowane dwa razy w roku. Sprawdź rijksoverheid.nl po lipcu 2026.
            </p>
          </section>

          {/* ── Wynagrodzenie netto ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Co faktycznie trafia na Twoje konto</h2>
            <p className="text-gray-600 text-sm mb-5">
              Wynagrodzenie brutto to nie to, co wpływa na konto bankowe. Oto realistyczne tygodniowe
              zestawienie dla pracownika agencyjnego na WML z zakwaterowaniem i transportem zapewnionym
              przez agencję — najczęstszy układ.
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
              Szacunki na podstawie stawek 2026. Loonheffing obliczony z uwzględnieniem algemene
              heffingskorting i arbeidskorting. Rzeczywiste kwoty zależą od przepracowanych godzin,
              fazy umowy i warunków potrąceń. Zawsze sprawdzaj swój własny loonstrook.
            </p>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-blue-800 mb-1">💡 ET vergoeding może dodać €50–€150/tydzień</p>
              <p className="text-blue-700">
                Jeśli mieszkasz ponad 150 km od holenderskiej granicy (Polska spełnia ten warunek),
                możesz kwalifikować się do świadczenia ET (Extraterritoriale kosten) — zwrotu
                kosztów wolnego od podatku, który znacząco zwiększa Twoje wynagrodzenie netto.
                Nie wszystkie agencje automatycznie je stosują.{" "}
                <Link href="/pl/system-et-holandia" className="underline font-semibold">
                  Zobacz nasz przewodnik po systemie ET →
                </Link>
              </p>
            </div>
          </section>

          {/* ── Legalne potrącenia ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Co agencje mogą i nie mogą potrącać</h2>
            <p className="text-gray-600 text-sm mb-5">
              Holenderskie prawo ściśle ogranicza to, co może być potrącone z wynagrodzenia. Na mocy
              Wet minimumloon (Art. 12) i WAADI (nowelizacja 2024) zasady te dotyczą wszystkich
              pracowników tymczasowych w Holandii.
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
                        {d.allowed ? `Maks: ${d.max}` : "ZABRONIONE"}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{d.rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ABU/NBBU CAO ── */}
          <section className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-3">ABU i NBBU CAO — powyżej WML</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Większość pracowników tymczasowych w Holandii jest zatrudniona na mocy{" "}
              <strong className="text-white">ABU CAO</strong> (większe agencje) lub{" "}
              <strong className="text-white">NBBU CAO</strong> (mniejsze agencje). Oba układy
              określają zasady wynagradzania powyżej ustawowego WML:
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Faza A (tygodnie 1–26):</strong> Minimalny poziom
                  WML. Po tygodniu 26 przechodzisz do Fazy B, która może mieć wyższe stawki.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Inlenersbeloning:</strong> Po 26 tygodniach u tego
                  samego klienta masz prawo do takiego samego wynagrodzenia jak pracownicy bezpośrednio
                  zatrudnieni wykonujący tę samą pracę (Art. 8, WAADI). Często oznacza to podwyżkę.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Overwerktoeslag:</strong> Nadgodziny (powyżej 40h/tyg.)
                  płatne 125% za pierwsze 8 dodatkowych godzin, 150% powyżej (ABU CAO).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Vakantiegeld:</strong> 8% wynagrodzenia urlopowego —
                  wymagane przez prawo, musi pojawiać się na każdym loonstrook jako osobna pozycja
                  (vakantiegeld opbouw).
                </span>
              </li>
            </ul>
          </section>

          {/* ── Lista kontrolna ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Lista kontrolna: czy Twoja agencja płaci prawidłowo?</h2>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {[
                "Twoja stawka godzinowa wynosi co najmniej €13,68 (40h/tyg.) lub €14,40 (38h/tyg.)",
                "Vakantiegeld (8%) pojawia się jako osobna pozycja na Twoim loonstrook",
                "Loonheffing jest obliczany z użyciem Twojego BSN — nie według stawki awaryjnej anoniementarief",
                "Potrącenie za zakwaterowanie nie przekracza €113,50/tydzień (maksimum SNF)",
                "Wszystkie potrącenia zostały Ci przedstawione na piśmie przed podpisaniem umowy",
                "Nie jest potrącana żadna 'opłata za pośrednictwo', 'koszt rekrutacji' ani 'opłata za dokumenty'",
                "Godziny nadliczbowe są oznaczone jako overwerk i płatne 125% lub więcej",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 text-sm">
                  <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Nie wiesz jak czytać swój loonstrook?{" "}
              <Link href="/pl/loonstrook-wyjasniony" className="text-blue-600 underline font-medium">
                Zobacz nasz pełny przewodnik po loonstrook →
              </Link>
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Znajdź zweryfikowaną agencję</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Pracuj w Holandii za pełne WML — z przejrzystymi potrąceniami
            </h2>
            <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
              Wszystkie agencje na AgencyCheck pokazują swoje potrącenia z góry. Zakwaterowanie
              certyfikowane przez SNF, bez opłat za pośrednictwo, umowy sprawdzone przed
              podpisaniem. Aplikuj bezpłatnie przez WhatsApp.
            </p>
            <Link
              href="/vacancies"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Przeglądaj oferty pracy u zweryfikowanych agencji →
            </Link>
          </section>

          {/* ── FAQ ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Najczęściej zadawane pytania</h2>
            <div className="space-y-5">
              {FAQS.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{f.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Powiązane ── */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-base font-bold text-gray-700 mb-4">Powiązane poradniki</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/pl/loonstrook-wyjasniony",  label: "Jak czytać holenderski loonstrook" },
                { href: "/pl/system-et-holandia",      label: "System ET — do €150/tyg. ekstra netto" },
                { href: "/pl/numer-bsn-holandia",      label: "Numer BSN — jak szybko go uzyskać" },
                { href: "/vacancies",                   label: "Przeglądaj oferty pracy w Holandii" },
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
