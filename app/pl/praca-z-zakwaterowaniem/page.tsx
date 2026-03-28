import type { Metadata } from "next";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import { JOB_LISTINGS } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Praca z Zakwaterowaniem w Holandii — Realne Zarobki po Odliczeniach",
  description:
    "Znajdź pracę z zakwaterowaniem w Holandii. Magazyn, produkcja, szklarnia, logistyka. Sprawdź realne zarobki netto po odliczeniu kosztów mieszkania, podatku i transportu. Agencycheck.nl",
  keywords: [
    "praca z zakwaterowaniem Holandia", "praca Holandia z mieszkaniem",
    "agencja pracy zakwaterowanie", "magazyn Holandia zakwaterowanie",
    "praca w Holandii z zakwaterowaniem", "oferty pracy Holandia mieszkanie",
  ],
  alternates: {
    canonical: "https://agencycheck.nl/pl/praca-z-zakwaterowaniem",
    languages: {
      "en":        "https://agencycheck.nl/jobs-with-accommodation",
      "pl":        "https://agencycheck.nl/pl/praca-z-zakwaterowaniem",
      "ro":        "https://agencycheck.nl/ro/locuri-de-munca-cu-cazare",
      "x-default": "https://agencycheck.nl/jobs-with-accommodation",
    },
  },
};

const JOB_GROUPS = [
  {
    id:    "warehouse",
    label: "Praca w magazynie",
    icon:  "📦",
    slugs: ["order-picker", "warehouse-worker", "packing-operator"],
    note:  "Bez wymagań dotyczących wcześniejszego doświadczenia. Większość stanowisk w e-commerce lub fulfillment.",
  },
  {
    id:    "production",
    label: "Praca w produkcji",
    icon:  "⚙️",
    slugs: ["production-worker", "assembly-worker", "machine-operator"],
    note:  "Zmiany 3-zmianowe. Produkcja żywności i linie montażowe.",
  },
  {
    id:    "greenhouse",
    label: "Szklarnia i ogrodnictwo",
    icon:  "🌿",
    slugs: ["greenhouse-worker"],
    note:  "Sezon: marzec–październik. Region Westland i Greenport.",
  },
  {
    id:    "logistics",
    label: "Logistyka i wózki widłowe",
    icon:  "🚜",
    slugs: ["forklift-driver", "reach-truck-driver"],
    note:  "Wymagane uprawnienia na wózek widłowy lub reach truck.",
  },
] as const;

const housingListings = JOB_LISTINGS.filter((j) => j.housing === "YES" && j.isActive);
const housingAgencies = [...AGENCIES_WITH_HOUSING]
  .sort((a, b) => (b.transparencyScore ?? 0) - (a.transparencyScore ?? 0))
  .slice(0, 8);

export default function PlJobsWithHousingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/pl" className="hover:text-brand-600">Strona główna</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Praca z zakwaterowaniem</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-800 rounded-full px-2.5 py-1">
            🏠 {housingListings.length} ofert z zakwaterowaniem
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
            🇳🇱 Holandia
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
            🚫 Nie reklama agencji
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">
          Praca z zakwaterowaniem w Holandii
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Zakwaterowanie od agencji <strong>nie jest za darmo</strong> — odliczają je bezpośrednio z pensji.
          Tu znajdziesz realne zarobki netto po wszystkich odliczeniach.
          Sprawdź zanim podpiszesz umowę.
        </p>
      </div>

      {/* Reality check strip */}
      <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2">⚠️ Co musisz wiedzieć</p>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-bold text-gray-900 mb-0.5">Zakwaterowanie odliczane z pensji</p>
            <p className="text-gray-600 text-xs">Zazwyczaj €120–€170/tydzień — bezpośrednio z brutto.</p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-0.5">Realne zarobki netto</p>
            <p className="text-gray-600 text-xs">Przy €15/h i 40 h/tygodniowo: ok. €280–€350 netto po wszystkich kosztach.</p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-0.5">Sprawdź przed przyjazdem</p>
            <p className="text-gray-600 text-xs">Skorzystaj z kalkulatora, żeby poznać dokładne liczby dla swojej oferty.</p>
          </div>
        </div>
        <Link href="/tools/real-income-calculator"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-red-700 border border-red-300 rounded-full px-3 py-1.5 hover:bg-red-100 transition-colors">
          🧮 Oblicz realne zarobki →
        </Link>
        <p className="text-[9px] text-gray-400 mt-2">* Dane szacunkowe. Rzeczywiste zarobki zależą od konkretnej umowy.</p>
      </div>

      {/* Job categories */}
      <section className="mb-10">
        <h2 className="text-lg font-black text-gray-900 mb-4">Rodzaje pracy z zakwaterowaniem</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {JOB_GROUPS.map((group) => (
            <div key={group.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0">{group.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 mb-1">{group.label}</p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{group.note}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.slugs.map((slug) => (
                      <Link
                        key={slug}
                        href={`/jobs/${slug}`}
                        className="text-[10px] font-medium bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-gray-600 rounded-full px-2.5 py-1 transition-colors"
                      >
                        {slug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Agencies with housing */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900">
            Agencje oferujące zakwaterowanie ({AGENCIES_WITH_HOUSING.length})
          </h2>
          <Link href="/agencies-with-housing" className="text-sm text-brand-600 font-semibold hover:underline">
            Wszystkie →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {housingAgencies.map((agency) => (
            <AgencyCard key={agency.slug} agency={agency} locale="pl" />
          ))}
        </div>
        <p className="text-[9px] text-gray-500 mt-4">
          ℹ️ Informacje o agencjach opierają się na danych zgłoszonych przez pracowników. Niezależna weryfikacja — agencje nie płacą za pozycjonowanie.
        </p>
      </section>

      {/* Cities */}
      <section className="mb-10">
        <h2 className="text-lg font-black text-gray-900 mb-4">Praca z zakwaterowaniem według miasta</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { name: "Tilburg",     slug: "tilburg"     },
            { name: "Venlo",       slug: "venlo"       },
            { name: "Breda",       slug: "breda"       },
            { name: "Eindhoven",   slug: "eindhoven"   },
            { name: "Rotterdam",   slug: "rotterdam"   },
            { name: "Waalwijk",    slug: "waalwijk"    },
            { name: "Den Haag",    slug: "den-haag"    },
            { name: "Amsterdam",   slug: "amsterdam"   },
            { name: "Venray",      slug: "venray"      },
            { name: "Helmond",     slug: "helmond"     },
          ].map((city) => (
            <Link
              key={city.slug}
              href={`/cities/${city.slug}`}
              className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-center hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors"
            >
              📍 {city.name}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gray-900 rounded-2xl px-6 py-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-black text-base mb-1">Sprawdź oferty przed podpisaniem</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Opinie pracowników, zdjęcia zakwaterowania i kalkulator zarobków netto — wszystko bezpłatnie.
          </p>
        </div>
        <Link href="/agencies-with-housing"
          className="shrink-0 bg-green-600 hover:bg-green-500 text-white font-black text-sm px-5 py-3 rounded-xl transition-colors whitespace-nowrap">
          🏠 Agencje z zakwaterowaniem →
        </Link>
      </div>

    </div>
  );
}
