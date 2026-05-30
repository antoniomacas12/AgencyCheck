import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Praca w Szklarniach Holandia 2026 — Zarobki, Sezony i Czego się Spodziewać",
  description:
    "Praca w szklarniach (glastuinbouw) w Holandii: które regiony zatrudniają, co obejmuje praca, stawki powyżej WML, szczyty sezonowe i jak znaleźć zweryfikowaną agencję. Przewodnik dla Polaków.",
  alternates: {
    canonical: "https://agencycheck.io/greenhouse-work-netherlands",
    languages: { "pl": "https://agencycheck.io/pl/praca-w-szklarniach-holandia" },
  },
  openGraph: {
    title: "Praca w Szklarniach Holandia — Zarobki, Lokalizacje i Jak Zacząć",
    description:
      "Glastuinbouw to jeden z największych pracodawców pracowników z Polski w Holandii. Wyjaśniamy zarobki, sezony, regiony i co sprawdzić przed podpisaniem umowy.",
  },
};

// ─── Regiony ─────────────────────────────────────────────────────────────────
const REGIONS = [
  {
    name: "Westland / De Lier / Naaldwijk",
    province: "Holandia Południowa",
    crop: "Pomidory, papryka, ogórki, sałata",
    note: "Największy na świecie klaster szklarniowy — ponad 7.000 hektarów szkła. Większość polskich pracowników w holenderskich szklarniach trafia właśnie tutaj. W pobliżu Naaldwijk istnieje prężna polska społeczność.",
    agencies: "Wysoka koncentracja certyfikowanych agencji ABU/NBBU",
  },
  {
    name: "Aalsmeer / Rijnsburg",
    province: "Holandia Północna / Południowa",
    crop: "Kwiaty cięte, orchidee, rośliny doniczkowe",
    note: "Siedziba aukcji FloraHolland — największej na świecie aukcji kwiatów. Praca jest intensywna i obejmuje sortowanie, pakowanie i logistykę aukcyjną.",
    agencies: "Kilka agencji specjalizuje się wyłącznie w pracy florystycznej",
  },
  {
    name: "Venlo / Horst aan de Maas",
    province: "Limburgia",
    crop: "Papryka, pomidory, szparagi, owoce miękkie",
    note: "Bardzo popularne wśród Polaków dzięki bliskości geograficznej. Venlo jest dużym hubem logistycznym, więc często oferowane są kombinacje szklarnia+magazyn. W Venlo działa duża polska społeczność z polskimi sklepami i kościołem.",
    agencies: "Wiele agencji oferuje mieszane kontrakty szklarnia+logistyka",
  },
  {
    name: "Pijnacker-Nootdorp / Bleiswijk",
    province: "Holandia Południowa",
    crop: "Pomidory, papryki, zioła",
    note: "Obszar uprawowy sąsiadujący z Westland. Nowsze szklarnie z nowoczesną automatyką — mniej fizycznej pracy ręcznej niż w starszych obiektach.",
    agencies: "Dominują agencje ABU; aktywni też mniejsi operatorzy NBBU",
  },
  {
    name: "Emmen / Klazienaveen",
    province: "Drenthe",
    crop: "Ogórki, pomidory, róże",
    note: "Mniej zatłoczony niż klastry w Holandii Południowej. Spokojniejszy region z niższymi kosztami utrzymania — może oznaczać niższe potrącenia za zakwaterowanie (huisvesting).",
    agencies: "Mniej agencji; zwykle bezpośredni kontakt z uprawcami na krótsze kontrakty",
  },
];

// ─── Typy pracy ───────────────────────────────────────────────────────────────
const JOB_TYPES = [
  {
    title: "Pracownik roślinny (plukker / snoeier)",
    icon: "🌿",
    pay: "WML + możliwy bonus akordowy",
    desc: "Zbieranie (plukken) i przycinanie (snoeien) upraw. Fizyczna, powtarzalna praca — stanie lub pochylanie się przez 8-godzinne zmiany. Najczęstsza rola dla nowych pracowników w szklarni. Niektóre miejsca oferują premie produkcyjne za przekroczenie dziennej normy zbiorów.",
  },
  {
    title: "Przetwarzanie / pakowanie (verwerker / inpakker)",
    icon: "📦",
    pay: "WML, czasem WML +5–10%",
    desc: "Sortowanie, klasyfikowanie i pakowanie zebranych plonów do dystrybucji. Zwykle praca w hali pakowania w warunkach wewnętrznych. Mniejsze wymagania fizyczne niż przy zbiorach, lecz wymaga szybkości i dbałości o jakość.",
  },
  {
    title: "Logistyka / transport wewnętrzny (intern transport)",
    icon: "🏎",
    pay: "WML +10–15%, czasem z bonusem za uprawnienia heftruck",
    desc: "Przemieszczanie produktów w szklarni lub centrum dystrybucji za pomocą wózków, taśmociągów lub wózków widłowych (heftruck). Certyfikat heftruck dodaje €0,50–€1,50/godz. do stawki i zwiększa mobilność między pracodawcami.",
  },
  {
    title: "Doniczkowanie / rozmnażanie (potterij / vermeerdering)",
    icon: "🪴",
    pay: "WML, czasem nieco powyżej",
    desc: "Doniczkowanie sadzonek, zarządzanie tacami do rozmnażania, rozmieszczanie roślin. Praca głównie przy roślinach doniczkowych i kwiatach ozdobnych. Całoroczna z mniejszymi wahaniami sezonowymi niż przy zbiorach owoców i warzyw.",
  },
  {
    title: "Monitoring upraw / asystent ogrodnika",
    icon: "🔬",
    pay: "WML +20–40%, wymagane doświadczenie",
    desc: "Sprawdzanie zdrowia roślin, monitorowanie czujników klimatu, raportowanie do głównego ogrodnika. Zazwyczaj wymaga wcześniejszego doświadczenia w szklarni i znajomości języka holenderskiego lub angielskiego. Niedostępne dla nowych pracowników — wymaga zazwyczaj 6–12 miesięcy potwierdzonej pracy.",
  },
];

// ─── Kalendarz sezonowy ───────────────────────────────────────────────────────
const SEASONS = [
  { month: "Sty–Lut", level: "Niski",    note: "Głównie konserwacja. Mniej ofert pracy." },
  { month: "Mar–Kwi", level: "Wysoki",   note: "Sezon sadzenia — szczytowe zatrudnienie. Daty rozpoczęcia skupiają się w marcu." },
  { month: "Maj–Cze", level: "Wysoki",   note: "Pierwsze zbiory. Długie zmiany. Nadgodziny (overwerktoeslag) częste." },
  { month: "Lip–Sie", level: "Średni",   note: "Ciągłe zbiory, ale niektóre miejsca zamknięte na konserwację letnią." },
  { month: "Wrz–Paź", level: "Wysoki",   note: "Szczyt jesiennych zbiorów — drugie największe okno rekrutacyjne w roku." },
  { month: "Lis–Gru", level: "Niski",    note: "Koniec sezonu. Kontrakty zazwyczaj kończą się w październiku–listopadzie." },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Czym jest praca w szklarniach (glastuinbouw) w Holandii?",
    a: "Glastuinbouw odnosi się do produkcji ogrodniczej w szklanych szklarniach — głównie warzyw (pomidory, papryki, ogórki), kwiatów (róże, chryzantemy, orchidee) i roślin doniczkowych. Holandia posiada największą koncentrację szklarniowego ogrodnictwa na świecie, skoncentrowaną głównie w regionie Westland–Naaldwijk w Holandii Południowej i w części Limburgii. Praca jest zazwyczaj fizyczna, zmianowa i wykonywana w oparciu o agencyjne umowy o pracę (arbeidsovereenkomst) regulowane przez CAO ABU lub CAO NBBU.",
  },
  {
    q: "Ile zarabia się w holenderskiej szklarni?",
    a: "Większość ról w szklarni zaczyna się od holenderskiej ustawowej płacy minimalnej (WML) — €13,68/godz. brutto dla 40-godzinnego tygodnia pracy w 2026 roku. Niektóre role mają mały bonus produkcyjny (stukloon) za przekroczenie dziennych celów. Role wymagające certyfikatu wózka widłowego lub doświadczenia zarabiają 10–20% powyżej WML. Po 26 tygodniach w tej samej firmie szklarniowej możesz mieć prawo do inlenersbeloning — takiej samej skali wynagrodzenia jak bezpośrednio zatrudnieni pracownicy szklarni, co jest zazwyczaj powyżej WML na mocy Glastuinbouw CAO.",
  },
  {
    q: "Czy praca w szklarni jest sezonowa czy całoroczna?",
    a: "Zależy od uprawy. Szklarnie warzywne (pomidory, papryki, ogórki) mają silne szczyty sezonowe wiosną (sadzenie, marzec–kwiecień) i jesienią (zbiory, wrzesień–październik), z ograniczoną pracą w styczniu–lutym i listopadzie–grudniu. Uprawa kwiatów i roślin doniczkowych jest zwykle całoroczna. Jeśli szukasz zatrudnienia zimowego, najbardziej stabilną opcją są obiekty florystyczne wokół Aalsmeer.",
  },
  {
    q: "Czy potrzebuję znajomości holenderskiego do pracy w szklarni?",
    a: "Nie. Większość pracowników szklarni w Holandii to migranci z UE, a wiele instrukcji operacyjnych jest przekazywanych po polsku lub za pomocą symboli. Podstawowy holenderski lub angielski pomaga podczas odpraw bezpieczeństwa i kontaktów z brygadzistą (voorman/vrouw). Niektóre większe firmy mają polskojęzycznych przełożonych — zwłaszcza w Venlo i Eindhoven, gdzie polska społeczność jest bardzo liczna. Twoja agencja jest prawnie zobowiązana do zapewnienia Ci podstawowych warunków bezpieczeństwa w Twoim własnym języku (wymóg CAO ABU/NBBU).",
  },
  {
    q: "Czy mogę znaleźć pracę w szklarni z zakwaterowaniem w pakiecie?",
    a: "Tak. Większość agencji umieszczających pracowników w klastrach szklarniowych Westland, Venlo i Aalsmeer uwzględnia zakwaterowanie certyfikowane przez SNF w pakiecie pracy. Zakwaterowanie jest potrącane z wynagrodzenia brutto maksymalnie €113,50/tydzień (maksimum SNF 2026). Wszystkie agencje na AgencyCheck podają koszty zakwaterowania z góry, abyś mógł porównać oferty przed złożeniem wniosku. Nie musisz przedkładać dowodu osobistego do przechowania agencji — tylko do wglądu.",
  },
];

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Praca w Szklarniach Holandia 2026 — Zarobki, Sezony i Czego się Spodziewać",
      "description": "Praca glastuinbouw w Holandii: regiony, typy pracy, stawki, kalendarz sezonowy i przewodnik po agencjach dla Polaków.",
      "url": "https://agencycheck.io/pl/praca-w-szklarniach-holandia",
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
        { "@type": "ListItem", "position": 3, "name": "Praca w Szklarniach Holandia" },
      ],
    },
  ],
};

export default function PracaWSzklarniachHolandiaPage() {
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
            <span className="text-gray-200">Praca w Szklarniach</span>
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-10 pt-4">
            <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/50 text-green-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🌱 Glastuinbouw — Holandia 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Praca w Szklarniach w Holandii
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Holandia produkuje 65% europejskich warzyw i kwiatów szklarniowych — i zatrudnia
              dziesiątki tysięcy polskich pracowników do ich uprawy. Oto wszystko, co musisz
              wiedzieć zanim przyjedziesz: które regiony zatrudniają, ile płacą, jak działa
              sezonowość i co sprawdzić w umowie z agencją.
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 space-y-14">

          {/* ── Nota dla Polaków ── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm">
            <p className="font-bold text-blue-800 mb-1">🇵🇱 Polacy są największą grupą w holenderskich szklarniach</p>
            <p className="text-blue-700 leading-relaxed">
              Polska społeczność w Eindhoven, Venlo i Den Bosch jest bardzo prężna — znajdziesz
              polskie sklepy, kościoły i grupy społecznościowe. Wielu rekruterów w agencjach w
              Venlo i Westland mówi po polsku. Pamiętaj o zabraniu dowodu osobistego —
              jest wymagany przy rejestracji BSN w biurze RNI.
            </p>
          </div>

          {/* ── Regiony ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gdzie są szklarnie</h2>
            <p className="text-gray-600 text-sm mb-5">
              Ogrodnictwo szklarniowe w Holandii jest bardzo skoncentrowane w kilku kluczowych
              regionach. Większość agencyjnych miejsc pracy pochodzi z tych klastrów:
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

          {/* ── Typy pracy ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Typy pracy i zarobki</h2>
            <p className="text-gray-600 text-sm mb-5">
              Większość ról w szklarni jest dostępna bez znajomości holenderskiego ani wcześniejszego
              doświadczenia. Wynagrodzenie jest na poziomie WML lub powyżej w zależności od roli.
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

          {/* ── Kalendarz sezonowy ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sezonowy kalendarz zatrudnienia</h2>
            <p className="text-gray-600 text-sm mb-5">
              Czas przyjazdu ma znaczenie. Wiosna i jesień to szczyty rekrutacyjne — najlepszy
              czas na szybkie znalezienie kontraktu.
            </p>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {SEASONS.map((s, i) => {
                const levelColor =
                  s.level === "Wysoki" ? "bg-emerald-100 text-emerald-700" :
                  s.level === "Średni" ? "bg-amber-100 text-amber-700" :
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

          {/* ── Wskazówki dot. umowy ── */}
          <section className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">Przed podpisaniem: 5 rzeczy do sprawdzenia</h2>
            <ol className="space-y-3 text-sm text-gray-300">
              {[
                "Potrącenie za zakwaterowanie (huisvesting) jest podane w euro na tydzień — nie jako % nieznanych przyszłych zarobków",
                "Numer certyfikatu SNF jest w Twojej umowie mieszkaniowej lub agencja może go okazać na żądanie",
                "Klauzula ET vergoeding jest uwzględniona jeśli mieszkasz >150 km od holenderskiej granicy — Polska kwalifikuje się w całości",
                "Twoja arbeidsovereenkomst określa konkretną firmę szklarniową lub region — niejasne umowy 'do ustalenia' to czerwona flaga",
                "Agencja posiada certyfikat SNA lub NEN-4400 — poszukaj logo SNA lub zapytaj o numer rejestracyjny",
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
            <p className="font-bold text-blue-800 mb-1">💡 Większość polskich pracowników kwalifikuje się do świadczenia ET</p>
            <p className="text-blue-700 leading-relaxed">
              Polska leży ponad 150 km od holenderskiej granicy — główne kryterium kwalifikacyjne
              dla świadczenia ET (Extraterritoriale kosten) wolnego od podatku. Może ono dodać
              €50–€150/tydzień do Twojego dochodu netto. Nie wszystkie agencje automatycznie je
              stosują — zapytaj przed podpisaniem loonstrook.{" "}
              <Link href="/pl/system-et-holandia" className="underline font-semibold">
                Zobacz przewodnik po systemie ET →
              </Link>
            </p>
          </div>

          {/* ── CTA ── */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Znajdź pracę w szklarni</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Zweryfikowane agencje zatrudniające w holenderskich szklarniach właśnie teraz
            </h2>
            <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
              Wszystkie agencje na AgencyCheck oferują zakwaterowanie SNF, podają potrącenia z
              góry i działają na mocy CAO ABU/NBBU. Aplikuj bezpłatnie przez WhatsApp — odpowiedź
              tego samego dnia.
            </p>
            <Link
              href="/vacancies"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Zobacz oferty pracy w szklarniach →
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
                { href: "/pl/minimalna-placa-holandia-2026", label: "Minimalna płaca Holandia 2026" },
                { href: "/pl/loonstrook-wyjasniony",          label: "Jak czytać holenderski loonstrook" },
                { href: "/pl/system-et-holandia",             label: "System ET — do €150/tyg. ekstra netto" },
                { href: "/vacancies",                          label: "Przeglądaj wszystkie oferty pracy" },
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
