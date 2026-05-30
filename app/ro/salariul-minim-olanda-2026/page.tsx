import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Salariul Minim Olanda 2026 — Tarif Orar și Lunar pentru Lucrători",
  description:
    "Salariul minim olandez (WML) în 2026: tariful orar exact, suma lunară, cum afectează loonheffing și deducerile salariul tău net real și ce trebuie să plătească agențiile conform legii.",
  alternates: {
    canonical: "https://agencycheck.io/minimum-wage-netherlands-2026",
    languages: { "ro": "https://agencycheck.io/ro/salariul-minim-olanda-2026" },
  },
  openGraph: {
    title: "Salariul Minim Olanda 2026 — Ce Primești Efectiv Acasă",
    description:
      "WML olandez 2026: tarif orar, brut lunar, net după impozit. Ce trebuie să includă agențiile, ce pot deduce legal și cum să verifici loonstrook-ul.",
  },
};

// ─── Tarife WML ───────────────────────────────────────────────────────────────
const WML_RATES = [
  { period: "Pe oră (40h/săpt.)",   gross: "€13,68",     note: "Se aplică tuturor lucrătorilor de 21+ indiferent de naționalitate" },
  { period: "Pe oră (38h/săpt.)",   gross: "€14,40",     note: "Dacă contractul tău specifică săptămână de 38 ore" },
  { period: "Pe oră (36h/săpt.)",   gross: "€15,20",     note: "Depinde de acordul colectiv (CAO)" },
  { period: "Pe săptămână (40h)",   gross: "€547,20",    note: "Înainte de loonheffing, prime și deduceri" },
  { period: "Pe lună (40h)",        gross: "€2.373",     note: "52 săptămâni × €547,20 ÷ 12" },
  { period: "Vakantiegeld (8%)",    gross: "+€189/lună", note: "Economisit lunar, plătit în mai (ABU CAO) sau la cerere" },
];

// ─── Deduceri legale ──────────────────────────────────────────────────────────
const LEGAL_DEDUCTIONS = [
  {
    icon: "🏠",
    label: "Locuință (huisvesting)",
    max: "€113,50/săpt.",
    rule: "Maximul SNF 2026 — doar dacă locuința este efectiv furnizată și certificată SNF. Nu poate depăși 25% din salariul orar brut × orele lucrate.",
    allowed: true,
  },
  {
    icon: "🚌",
    label: "Transport (vervoerskosten)",
    max: "Cost real",
    rule: "Poate fi dedus doar dacă agenția organizează transportul. Trebuie specificat pe loonstrook. Nu poate include marjă de profit pe transport.",
    allowed: true,
  },
  {
    icon: "🏥",
    label: "Asigurare de sănătate (zorgverzekering)",
    max: "~€170/lună",
    rule: "Schemele colective de sănătate ale agenției sunt deduceri legale doar dacă ai optat pentru ele. Asigurarea de sănătate de bază olandeză (basisverzekering) este obligatorie legal odată ce lucrezi în Olanda.",
    allowed: true,
  },
  {
    icon: "❌",
    label: "Taxă de recrutare / plasament",
    max: "€0",
    rule: "Complet interzis. Din 2024 (amendamentul WAADI — Wet Toelating Terbeschikkingstelling van Arbeidskrachten), agențiile nu pot percepe nicio taxă lucrătorilor pentru găsirea unui loc de muncă. Raportați încălcările la Inspectie SZW.",
    allowed: false,
  },
  {
    icon: "❌",
    label: "Uniformă / echipament de lucru",
    max: "€0",
    rule: "Nu poate fi perceput dacă îmbrăcămintea este necesară specific pentru muncă (vestă de siguranță, bocanci cu vârf de oțel pentru depozit). Îmbrăcămintea de marcă opțională poate fi percepută doar cu consimțământ scris.",
    allowed: false,
  },
  {
    icon: "❌",
    label: "Taxe pentru acte / înregistrare",
    max: "€0",
    rule: "Costurile administrative ale procesării înregistrării tale, verificării BSN sau configurării DigiD nu pot fi percepute. Interzis conform Art. 12 din Wet minimumloon (WML).",
    allowed: false,
  },
];

// ─── Exemplu salariu net ──────────────────────────────────────────────────────
const NET_EXAMPLE = [
  { label: "Salariu brut săptămânal (40h @ WML)",                 amount: "+€547",  plus: true  },
  { label: "Loonheffing (impozit pe venit, cu heffingskorting)",   amount: "−€60",   plus: false },
  { label: "Primă WW (asigurare de șomaj)",                        amount: "−€22",   plus: false },
  { label: "Prime ZW/WIA (boală/invaliditate)",                    amount: "−€14",   plus: false },
  { label: "Zorgverzekering (asigurare de sănătate)",              amount: "−€40",   plus: false },
  { label: "Huisvesting (locuință SNF, dacă este utilizată)",      amount: "−€95",   plus: false },
  { label: "Transport (dacă agenția îl organizează)",              amount: "−€25",   plus: false },
  { label: "Nettoloon (salariu net în mână)",                      amount: "≈ €291", plus: true  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Care este salariul minim în Olanda în 2026?",
    a: "Salariul minim legal olandez (Wettelijk Minimumloon, WML) pentru lucrătorii cu vârsta de 21 de ani și peste, care lucrează 40 de ore pe săptămână, este de €13,68 pe oră, €547,20 pe săptămână și aproximativ €2.373 pe lună (brut). Tarifele sunt actualizate de guvernul olandez la 1 ianuarie și 1 iulie în fiecare an, pe baza evoluției salariului mediu. Din iulie 2023, salariul minim se aplică tuturor lucrătorilor de peste 21 de ani indiferent de vârstă. Lucrătorii români — inclusiv cei care se deplasează sezonier din Moldova, Ardeal sau Muntenia — au drept deplin la WML.",
  },
  {
    q: "Salariul minim este același pentru lucrătorii din UE și cei olandezi?",
    a: "Da. WML olandez se aplică tuturor lucrătorilor din Olanda indiferent de naționalitate. Lucrătorii polonezi, români, bulgari, slovaci sau orice alți cetățeni UE care lucrează în Olanda trebuie să primească cel puțin WML. Plata sub WML este ilegală și poate fi raportată la Autoritatea Muncii din Olanda (Inspectie SZW / Netherlands Labour Authority). Acordurile colective CAO ABU și CAO NBBU care guvernează munca prin agenție stabilesc WML ca prag legal minim pentru toți.",
  },
  {
    q: "Poate o agenție să plătească sub salariul minim prin deducerea locuinței și transportului?",
    a: "Nu. Deducerile pentru locuință și transport sunt supuse unor limite stricte și nu pot reduce salariul net sub salariul minim net legal. Deducerea maximă pentru locuință este de €113,50/săptămână (maximul SNF 2026) și poate fi aplicată doar dacă locuiești efectiv în locuința furnizată de agenție. Dacă suspectezi că salariul tău net după deduceri este sub minimul legal, poți depune o sesizare la Inspectie SZW (inspecția muncii olandeze) sau poți contacta sindicatul FNV care are consilieri vorbitoare de română.",
  },
  {
    q: "Ce este vakantiegeld și se adaugă la salariul minim?",
    a: "Vakantiegeld (indemnizație de concediu) reprezintă 8% suplimentar din salariul tău anual brut, impus de lege conform Art. 15 din Wet minimumloon. Pentru un lucrător cu normă întreagă la WML, aceasta înseamnă aproximativ €189/lună, plătită ca sumă forfetară în mai conform CAO ABU sau inclusă în tariful orar în contractele de fază NBBU. Este în plus față de salariul tău obișnuit, nu inclus în el — deci tariful orar efectiv inclusiv vakantiegeld este de aproximativ €14,77/oră la WML.",
  },
  {
    q: "Ce este carte de identitate și am nevoie de ea pentru a lucra în Olanda?",
    a: "Da. Carte de identitate (cartea de identitate românească) sau pașaportul românesc este documentul principal necesar pentru a lucra în Olanda ca cetățean UE. Agenția ta este obligată legal să îți înregistreze numărul documentului. Nu este nevoie de viză sau permis de muncă pentru cetățenii români, deoarece România este stat membru UE cu drepturi depline de liberă circulație. Păstrează o copie a cărții tale de identitate și nu preda originalul agenției.",
  },
];

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Salariul Minim Olanda 2026 — Tarif Orar și Lunar pentru Lucrători",
      "description": "WML olandez în 2026: tarife exacte, deduceri legale, exemple de salariu net și drepturile lucrătorilor din România.",
      "url": "https://agencycheck.io/ro/salariul-minim-olanda-2026",
      "datePublished": "2026-01-01",
      "dateModified": "2026-05-01",
      "inLanguage": "ro",
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
        { "@type": "ListItem", "position": 1, "name": "Acasă",   "item": "https://agencycheck.io/ro" },
        { "@type": "ListItem", "position": 2, "name": "Ghiduri", "item": "https://agencycheck.io/guides" },
        { "@type": "ListItem", "position": 3, "name": "Salariul Minim Olanda 2026" },
      ],
    },
  ],
};

export default function SalariulMinimOlanda2026Page() {
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
            <Link href="/ro" className="hover:text-gray-300 transition-colors">Acasă</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-gray-300 transition-colors">Ghiduri</Link>
            <span>/</span>
            <span className="text-gray-200">Salariul Minim 2026</span>
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-10 pt-4">
            <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🇳🇱 Dreptul Muncii Olandez — Actualizat 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Salariul Minim Olanda 2026
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Salariul minim legal olandez (WML — Wettelijk Minimumloon) stabilește pragul legal
              pentru toți lucrătorii din Olanda. Iată cifrele exacte pentru 2026, ce pot și ce nu
              pot deduce agențiile și cum arată salariul tău net real.
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 space-y-14">

          {/* ── Notă pentru români ── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm">
            <p className="font-bold text-blue-800 mb-1">🇷🇴 Lucrătorii din România — drepturi egale cu cei olandezi</p>
            <p className="text-blue-700 leading-relaxed">
              Zeci de mii de români din comunitățile din Moldova, Ardeal și Muntenia lucrează în Olanda
              prin agenții. Indiferent dacă ești angajat printr-o agenție sau direct, WML se aplică
              integral. Prezintă-ți carte de identitate la înregistrare — nu pașaportul nu este necesar,
              dar documentul tău de identitate trebuie să fie vizibil la agentul tău de recrutare.
            </p>
          </div>

          {/* ── Tabel tarife ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tarifele WML 2026</h2>
            <p className="text-gray-600 text-sm mb-5">
              Tarifele de mai jos sunt pentru lucrătorii cu vârsta de 21+. De la iulie 2023, WML se
              aplică uniform indiferent de vârstă. Guvernul actualizează tarifele la{" "}
              <strong>1 ianuarie</strong> și <strong>1 iulie</strong> în fiecare an.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Perioadă</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Sumă brută</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Note</th>
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
              Sursă: Rijksoverheid.nl — Wettelijk minimumloon și minimumjeugdloon de la 1 ianuarie 2026.
              Tarife actualizate semestrial. Verificați rijksoverheid.nl după iulie 2026.
            </p>
          </section>

          {/* ── Salariu net ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ce primești efectiv în cont</h2>
            <p className="text-gray-600 text-sm mb-5">
              Salariul brut nu este ceea ce ajunge în contul tău bancar. Iată o defalcare săptămânală
              realistă pentru un lucrător din agenție la WML, cu locuință și transport prin agenție —
              aranjamentul cel mai frecvent.
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
              Estimări bazate pe tarifele 2026. Loonheffing calculat cu algemene heffingskorting și
              arbeidskorting aplicate. Sumele reale variază în funcție de orele lucrate, faza contractului
              și aranjamentele de deducere. Verifică întotdeauna propriul tău loonstrook.
            </p>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
              <p className="font-semibold text-blue-800 mb-1">💡 ET vergoeding poate adăuga €50–€150/săptămână</p>
              <p className="text-blue-700">
                Dacă locuiești la mai mult de 150 km de granița olandeză (România se califică cu
                ușurință — distanța depășește 1.500 km), poți beneficia de rambursarea ET
                (Extraterritoriale kosten) scutită de impozit, care crește semnificativ salariul
                tău net. Nu toate agențiile o aplică automat.{" "}
                <Link href="/ro/schema-et-olanda" className="underline font-semibold">
                  Vezi ghidul nostru despre schema ET →
                </Link>
              </p>
            </div>
          </section>

          {/* ── Deduceri legale ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ce pot și ce nu pot deduce agențiile</h2>
            <p className="text-gray-600 text-sm mb-5">
              Legea olandeză limitează strict ceea ce poate fi dedus din salariul tău. Conform
              Wet minimumloon (Art. 12) și WAADI (amendamentul 2024), aceste reguli se aplică
              tuturor lucrătorilor din agenții din Olanda, inclusiv cetățenilor români.
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
                        {d.allowed ? `Max: ${d.max}` : "INTERZIS"}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{d.rule}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CAO ABU/NBBU ── */}
          <section className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-3">CAO ABU și CAO NBBU — Peste WML</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Majoritatea lucrătorilor din agenții din Olanda sunt angajați conform{" "}
              <strong className="text-white">CAO ABU</strong> (agențiile mai mari) sau{" "}
              <strong className="text-white">CAO NBBU</strong> (agențiile mai mici). Ambele
              stabilesc reguli de plată peste WML legal:
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Faza A (săptămânile 1–26):</strong> Nivelul minim WML.
                  După săptămâna 26 treci la Faza B, care poate aduce tarife mai mari conform loonschaal.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Inlenersbeloning:</strong> După 26 de săptămâni la
                  același client, ai dreptul la același salariu ca angajații direcți care fac aceeași
                  muncă (Art. 8, WAADI). Aceasta înseamnă adesea o mărire de salariu.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Overwerktoeslag:</strong> Orele suplimentare (peste 40h/săpt.)
                  la 125% pentru primele 8 ore extra, 150% de la a 9-a oră (CAO ABU).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">→</span>
                <span>
                  <strong className="text-white">Vakantiegeld:</strong> 8% indemnizație de concediu —
                  obligatorie legal, trebuie să apară pe fiecare loonstrook ca linie separată
                  (vakantiegeld opbouw).
                </span>
              </li>
            </ul>
          </section>

          {/* ── Listă de verificare ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Listă de verificare: Plătește agenția ta corect?</h2>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {[
                "Tariful tău orar este cel puțin €13,68 (40h/săpt.) sau €14,40 (38h/săpt.)",
                "Vakantiegeld (8%) apare ca linie separată pe loonstrook-ul tău",
                "Loonheffing este calculat folosind BSN-ul tău — nu cu tariful de urgență anoniementarief",
                "Deducerea pentru locuință nu depășește €113,50/săptămână (maximul SNF)",
                "Toate deducerile ți-au fost prezentate în scris înainte de semnarea arbeidsovereenkomst",
                "Nu se deduce nicio 'taxă de plasament', 'cost de recrutare' sau 'taxă pentru acte'",
                "Orele suplimentare sunt marcate ca overwerk și plătite la 125% sau mai mult",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 text-sm">
                  <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Nu știi cum să citești loonstrook-ul tău?{" "}
              <Link href="/ro/loonstrook-explicat" className="text-blue-600 underline font-medium">
                Vezi ghidul nostru complet despre loonstrook →
              </Link>
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Găsește o agenție verificată</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Lucrează în Olanda la WML complet — cu deduceri transparente
            </h2>
            <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
              Toate agențiile de pe AgencyCheck își arată deducerile în avans. Locuință certificată SNF,
              fără taxe de plasament și contracte (arbeidsovereenkomst) verificate înainte de semnare.
              Gratuit să aplici prin WhatsApp.
            </p>
            <Link
              href="/vacancies"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Caută locuri de muncă la agenții verificate →
            </Link>
          </section>

          {/* ── FAQ ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Întrebări frecvente</h2>
            <div className="space-y-5">
              {FAQS.map((f, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{f.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Ghiduri conexe ── */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-base font-bold text-gray-700 mb-4">Ghiduri conexe</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/ro/loonstrook-explicat",  label: "Cum să citești loonstrook-ul olandez" },
                { href: "/ro/schema-et-olanda",      label: "Schema ET — până la €150/săpt. net în plus" },
                { href: "/ro/numarul-bsn-olanda",    label: "Numărul BSN — cum să îl obții rapid" },
                { href: "/vacancies",                 label: "Caută locuri de muncă în Olanda" },
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
