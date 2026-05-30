import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Lucru în Sere Olanda 2026 — Salariu, Sezoane și Ce să Te Aștepți",
  description:
    "Munca în sere (glastuinbouw) în Olanda: ce regiuni angajează, ce implică munca, tarife peste WML, vârfuri sezoniere și cum să găsești o agenție verificată. Ghid pentru lucrătorii din România.",
  alternates: {
    canonical: "https://agencycheck.io/greenhouse-work-netherlands",
    languages: { "ro": "https://agencycheck.io/ro/lucru-in-sere-olanda" },
  },
  openGraph: {
    title: "Lucru în Sere Olanda — Salariu, Locații și Cum să Începi",
    description:
      "Glastuinbouw este unul dintre cei mai mari angajatori de lucrători din UE în Olanda. Explicăm salariile, sezoanele, regiunile și ce să verifici înainte de a semna un contract.",
  },
};

// ─── Regiuni ─────────────────────────────────────────────────────────────────
const REGIONS = [
  {
    name: "Westland / De Lier / Naaldwijk",
    province: "Olanda de Sud",
    crop: "Roșii, ardei, castraveți, salată",
    note: "Cel mai mare cluster de sere din lume — peste 7.000 de hectare de sticlă. Cei mai mulți lucrători din România ajung în această zonă. Mulți din Moldova și Ardeal lucrează sezonier în Westland.",
    agencies: "Concentrație ridicată de agenții ABU/NBBU certificate",
  },
  {
    name: "Aalsmeer / Rijnsburg",
    province: "Olanda de Nord / de Sud",
    crop: "Flori tăiate, orhidee, plante de ghiveci",
    note: "Sediul licitației FloraHolland — cea mai mare licitație de flori din lume. Munca este rapidă și implică sortare, ambalare și logistică de licitație.",
    agencies: "Mai multe agenții specializate exclusiv în muncă floricolă",
  },
  {
    name: "Venlo / Horst aan de Maas",
    province: "Limburg",
    crop: "Ardei, roșii, sparanghel, fructe moi",
    note: "Popular printre lucrătorii din România datorită proximității față de granița cu Germania. Venlo este un hub logistic major, deci combinațiile seră+depozit sunt frecvente.",
    agencies: "Multe agenții oferă contracte mixte seră+logistică",
  },
  {
    name: "Pijnacker-Nootdorp / Bleiswijk",
    province: "Olanda de Sud",
    crop: "Roșii, ardei gras, ierburi",
    note: "Zonă de creștere adiacentă Westland. Sere mai noi cu automatizare modernă — mai puțin efort fizic manual față de locațiile mai vechi.",
    agencies: "Agenții ABU dominante; operatori mai mici NBBU activi de asemenea",
  },
  {
    name: "Emmen / Klazienaveen",
    province: "Drenthe",
    crop: "Castraveți, roșii, trandafiri",
    note: "Mai puțin aglomerat față de clusterele din Olanda de Sud. Zonă mai liniștită cu cost de viață mai mic — poate însemna deduceri mai mici pentru huisvesting (locuință).",
    agencies: "Mai puține agenții; de obicei contact direct cu crescătorii pentru contracte mai scurte",
  },
];

// ─── Tipuri de muncă ─────────────────────────────────────────────────────────
const JOB_TYPES = [
  {
    title: "Lucrător în plante (plukker / snoeier)",
    icon: "🌿",
    pay: "WML + posibil bonus în acord",
    desc: "Recoltare (plukken) și tundere (snoeien) a culturilor. Muncă fizică, repetitivă — stat în picioare sau aplecat timp de ture de 8 ore. Rolul de intrare cel mai frecvent în seră. Unele locații oferă bonusuri de producție (stukloon) pentru depășirea cotei zilnice de recoltare.",
  },
  {
    title: "Procesare / ambalare (verwerker / inpakker)",
    icon: "📦",
    pay: "WML, uneori WML +5–10%",
    desc: "Sortare, clasare și ambalare a culturilor recoltate pentru distribuție. De obicei în interior la o stație de ambalare. Cerințe fizice mai ușoare decât recoltarea, dar necesită viteză și atenție la calitate.",
  },
  {
    title: "Logistică / transport intern (intern transport)",
    icon: "🏎",
    pay: "WML +10–15%, uneori cu bonus pentru diplomă heftruck",
    desc: "Mutarea produselor în seră sau centrul de distribuție folosind cărucioare, benzi transportoare sau stivuitoare (heftruck). Certificarea heftruck adaugă €0,50–€1,50/oră la tarif și îți mărește mobilitatea între angajatori.",
  },
  {
    title: "Ghivecire / propagare (potterij / vermeerdering)",
    icon: "🪴",
    pay: "WML, uneori ușor peste",
    desc: "Ghivecire de răsaduri, gestionare de tăvi de propagare, spațierea plantelor. Prezent în principal în operațiuni de plante de ghiveci și flori ornamentale. Munca este pe tot parcursul anului cu mai puțină variație sezonieră decât recoltarea de fructe și legume.",
  },
  {
    title: "Monitorizare culturi / asistent grădinar",
    icon: "🔬",
    pay: "WML +20–40%, necesită experiență",
    desc: "Verificarea sănătății plantelor, monitorizarea senzorilor de climă, raportare la grădinarul principal. De obicei necesită experiență anterioară în seră și cunoaștere a limbii olandeze sau engleze. Nu este disponibil pentru noii angajați — necesită în general 6–12 luni de muncă dovedită în sere.",
  },
];

// ─── Calendar sezonier ────────────────────────────────────────────────────────
const SEASONS = [
  { month: "Ian–Feb", level: "Scăzut",  note: "Preponderent întreținere. Mai puține locuri de muncă disponibile." },
  { month: "Mar–Apr", level: "Ridicat", note: "Sezon de plantare — angajare de vârf. Datele de start concentrate în martie." },
  { month: "Mai–Iun", level: "Ridicat", note: "Primele recolte. Ture lungi. Ore suplimentare (overwerktoeslag) frecvente." },
  { month: "Iul–Aug", level: "Mediu",   note: "Recoltă continuă, dar unele locații închise pentru întreținere de vară." },
  { month: "Sep–Oct", level: "Ridicat", note: "Vârful recoltei de toamnă — a doua cea mai mare perioadă de angajare din an." },
  { month: "Nov–Dec", level: "Scăzut",  note: "Sfârșitul sezonului. Contractele se termină de obicei în octombrie–noiembrie." },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Ce este munca în sere (glastuinbouw) în Olanda?",
    a: "Glastuinbouw se referă la producția horticolă în sere de sticlă — în principal legume (roșii, ardei, castraveți), flori (trandafiri, crizanteme, orhidee) și plante de ghiveci. Olanda are cea mai mare concentrație de horticultură în sere din lume, concentrată în principal în regiunea Westland–Naaldwijk din Olanda de Sud și în părți din Limburg. Mulți lucrători sezonieri din Moldova, Ardeal și Muntenia ajung în aceste zone în perioadele de vârf de angajare. Munca se desfășoară în baza unor contracte de agenție (arbeidsovereenkomst) reglementate de CAO ABU sau CAO NBBU.",
  },
  {
    q: "Cât câștigă un lucrător într-o seră olandeză?",
    a: "Majoritatea rolurilor în seră încep de la salariul minim legal olandez (WML) — €13,68/oră brut pentru o săptămână de 40 de ore în 2026. Unele roluri au un mic bonus de producție (stukloon) pentru depășirea obiectivelor zilnice. Rolurile care necesită certificare pentru stivuitor (heftruck) sau experiență câștigă 10–20% peste WML. După 26 de săptămâni la aceeași companie de sere, poți fi îndreptățit la inlenersbeloning — aceeași scală salarială ca angajații direcți, care este de obicei peste WML conform Glastuinbouw CAO.",
  },
  {
    q: "Munca în seră este sezonieră sau pe tot parcursul anului?",
    a: "Depinde de cultură. Serele de legume (roșii, ardei, castraveți) au vârfuri sezoniere puternice primăvara (plantare, martie–aprilie) și toamna (recoltă, septembrie–octombrie), cu muncă redusă în ianuarie–februarie și noiembrie–decembrie. Cultivarea de flori și plante de ghiveci tinde să fie mai constantă pe tot parcursul anului. Dacă cauți muncă de iarnă, operațiunile floricole din jurul Aalsmeer sunt cea mai stabilă opțiune.",
  },
  {
    q: "Am nevoie de olandeză pentru a lucra în seră?",
    a: "Nu. Majoritatea lucrătorilor din sere din Olanda sunt migranți UE, iar multe instrucțiuni operaționale sunt comunicate în română sau prin simboluri. Olandeza sau engleza de bază ajută la informările de siguranță și interacțiunea cu șeful de echipă (voorman/vrouw). Unele companii mai mari au supraveghetori vorbitoare de română, în special în Venlo. Agenția ta este obligată legal să furnizeze termenii de siguranță de bază în propria ta limbă (cerință CAO ABU/NBBU). Carte de identitate românească este suficientă pentru a lucra — nu ai nevoie de viză.",
  },
  {
    q: "Pot găsi muncă în seră cu locuință inclusă?",
    a: "Da. Majoritatea agențiilor care plasează lucrători în clusterele de sere Westland, Venlo și Aalsmeer includ cazare certificată SNF în pachetul de muncă. Locuința se deduce din salariul brut la maximum €113,50/săptămână (maximul SNF 2026). Toți lucrătorii din România — din comunitățile din Olanda sau care vin direct din țară — se califică pentru ET vergoeding (beneficiul pentru costuri extrateritoriale), deoarece distanța față de granița olandeză depășește 150 km.",
  },
];

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Lucru în Sere Olanda 2026 — Salariu, Sezoane și Ce să Te Aștepți",
      "description": "Munca glastuinbouw în Olanda: regiuni, tipuri de muncă, tarife, calendar sezonier și ghid de agenții pentru lucrători din România.",
      "url": "https://agencycheck.io/ro/lucru-in-sere-olanda",
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
        { "@type": "ListItem", "position": 3, "name": "Lucru în Sere Olanda" },
      ],
    },
  ],
};

export default function LucruInSereOlandaPage() {
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
            <span className="text-gray-200">Lucru în Sere</span>
          </div>
          <div className="max-w-3xl mx-auto px-4 pb-10 pt-4">
            <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/50 text-green-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🌱 Glastuinbouw — Olanda 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Lucru în Sere în Olanda
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Olanda produce 65% din legumele și florile de seră din Europa — și angajează zeci de
              mii de lucrători din UE, inclusiv mulți din Moldova, Ardeal și Muntenia. Iată tot ce
              trebuie să știi înainte să pleci: ce regiuni angajează, cât plătesc, cum funcționează
              sezonalitatea și ce să verifici în contractul cu agenția.
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-10 space-y-14">

          {/* ── Notă pentru români ── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm">
            <p className="font-bold text-blue-800 mb-1">🇷🇴 Comunitatea română în serele olandeze</p>
            <p className="text-blue-700 leading-relaxed">
              Lucrătorii din comunitățile române din Olanda și cei care vin direct din Moldova sau
              Ardeal formează una dintre cele mai mari grupe de lucrători sezonieri. Prezintă-ți
              carte de identitate la înregistrare — nu ai nevoie de viză sau permis de muncă ca
              cetățean UE. Toți lucrătorii din România se califică pentru ET vergoeding deoarece
              distanța față de granița olandeză depășește cu mult 150 km.
            </p>
          </div>

          {/* ── Regiuni ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unde se află serele</h2>
            <p className="text-gray-600 text-sm mb-5">
              Horticultura în sere din Olanda este foarte concentrată în câteva regiuni cheie.
              Cele mai multe plasamente de agenții provin din aceste clustere:
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

          {/* ── Tipuri de muncă ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tipuri de muncă și salariu</h2>
            <p className="text-gray-600 text-sm mb-5">
              Majoritatea rolurilor în seră sunt accesibile fără cunoștințe de olandeză sau experiență
              anterioară. Salariul este la sau peste WML în funcție de rol.
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

          {/* ── Calendar sezonier ── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Calendarul sezonier de angajare</h2>
            <p className="text-gray-600 text-sm mb-5">
              Momentul sosirii contează. Primăvara și toamna sunt perioadele de vârf de angajare —
              cel mai bun moment să găsești un contract rapid.
            </p>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {SEASONS.map((s, i) => {
                const levelColor =
                  s.level === "Ridicat" ? "bg-emerald-100 text-emerald-700" :
                  s.level === "Mediu"   ? "bg-amber-100 text-amber-700" :
                                          "bg-gray-100 text-gray-500";
                return (
                  <div key={i} className={`flex items-center gap-4 px-5 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <span className="w-20 font-semibold text-gray-800 shrink-0">{s.month}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${levelColor}`}>{s.level}</span>
                    <span className="text-gray-600">{s.note}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Sfaturi contract ── */}
          <section className="bg-gray-900 text-white rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">Înainte de semnare: 5 lucruri de verificat</h2>
            <ol className="space-y-3 text-sm text-gray-300">
              {[
                "Deducerea pentru huisvesting (locuință) este scrisă în euro pe săptămână — nu ca % din salarii viitoare necunoscute",
                "Numărul certificatului SNF este în contractul de locuință sau agenția îl poate arăta la cerere",
                "Clauza ET vergoeding este inclusă — toți lucrătorii din România se califică deoarece distanța depășește 150 km de granița olandeză",
                "Arbeidsovereenkomst-ul tău specifică ce companie de sere sau regiune vei lucra — contractele vagi 'de stabilit' sunt un semnal de alarmă",
                "Agenția este certificată SNA sau NEN-4400 — caută logo-ul SNA sau cere numărul de înregistrare în registrul SNA",
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
            <p className="font-bold text-blue-800 mb-1">💡 Toți lucrătorii din România se califică pentru beneficiul ET</p>
            <p className="text-blue-700 leading-relaxed">
              România se află la peste 1.500 km de Olanda — cu mult peste criteriul principal de
              150 km pentru beneficiul ET (Extraterritoriale kosten) scutit de impozit. Aceasta
              poate adăuga €50–€150/săptămână la venitul tău net. Nu toate agențiile îl aplică
              automat — întreabă înainte de a semna loonstrook-ul.{" "}
              <Link href="/ro/schema-et-olanda" className="underline font-semibold">
                Vezi ghidul schemei ET →
              </Link>
            </p>
          </div>

          {/* ── CTA ── */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Găsește muncă în sere</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Agenții verificate care angajează în serele olandeze chiar acum
            </h2>
            <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
              Toate agențiile de pe AgencyCheck includ locuință SNF certificată, arată deducerile
              în avans și operează conform CAO ABU/NBBU. Gratuit să aplici prin WhatsApp —
              răspuns în aceeași zi.
            </p>
            <Link
              href="/vacancies"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Vezi locuri de muncă în sere →
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
                { href: "/ro/salariul-minim-olanda-2026", label: "Salariul minim Olanda 2026" },
                { href: "/ro/loonstrook-explicat",         label: "Cum să citești loonstrook-ul olandez" },
                { href: "/ro/schema-et-olanda",            label: "Schema ET — până la €150/săpt. net în plus" },
                { href: "/vacancies",                       label: "Vezi toate locurile de muncă" },
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
