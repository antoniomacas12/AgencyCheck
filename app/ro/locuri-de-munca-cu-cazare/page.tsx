import type { Metadata } from "next";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import { JOB_LISTINGS } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Locuri de Muncă cu Cazare în Olanda — Salariu Real după Deduceri",
  description:
    "Găsești locuri de muncă cu cazare în Olanda. Depozit, producție, seră, logistică. Verifică salariul net real după deducerea costurilor de cazare, taxe și transport. Agencycheck.nl",
  keywords: [
    "locuri de munca cu cazare Olanda", "munca in Olanda cu cazare",
    "agentie de munca cu cazare", "depozit Olanda cazare",
    "locuri de munca Olanda cazare inclusa", "angajare Olanda locuinta",
  ],
  alternates: {
    canonical: "https://agencycheck.nl/ro/locuri-de-munca-cu-cazare",
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
    label: "Locuri de muncă în depozit",
    icon:  "📦",
    slugs: ["order-picker", "warehouse-worker", "packing-operator"],
    note:  "Fără experiență anterioară necesară. Majoritatea posturilor în e-commerce sau fulfillment.",
  },
  {
    id:    "production",
    label: "Locuri de muncă în producție",
    icon:  "⚙️",
    slugs: ["production-worker", "assembly-worker", "machine-operator"],
    note:  "Ture rotative în 3 schimburi. Producție alimentară și linii de asamblare.",
  },
  {
    id:    "greenhouse",
    label: "Seră și horticultură",
    icon:  "🌿",
    slugs: ["greenhouse-worker"],
    note:  "Sezon: martie–octombrie. Zona Westland și Greenport.",
  },
  {
    id:    "logistics",
    label: "Logistică și motostivuitor",
    icon:  "🚜",
    slugs: ["forklift-driver", "reach-truck-driver"],
    note:  "Necesită permis valabil pentru motostivuitor sau reach truck.",
  },
] as const;

const housingListings = JOB_LISTINGS.filter((j) => j.housing === "YES" && j.isActive);
const housingAgencies = [...AGENCIES_WITH_HOUSING]
  .sort((a, b) => (b.transparencyScore ?? 0) - (a.transparencyScore ?? 0))
  .slice(0, 8);

export default function RoJobsWithHousingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/ro" className="hover:text-brand-600">Pagina principală</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Locuri de muncă cu cazare</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-800 rounded-full px-2.5 py-1">
            🏠 {housingListings.length} locuri cu cazare
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
            🇳🇱 Olanda
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
            🚫 Nu publicitate de agenție
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">
          Locuri de muncă cu cazare în Olanda
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          Cazarea oferită de agenție <strong>nu este gratuită</strong> — se deduce direct din salariu.
          Aici găsești salariul net real după toate deducerile.
          Verifică înainte să semnezi contractul.
        </p>
      </div>

      {/* Reality check strip */}
      <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2">⚠️ Ce trebuie să știi</p>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-bold text-gray-900 mb-0.5">Cazarea se deduce din salariu</p>
            <p className="text-gray-600 text-xs">De obicei €120–€170/săptămână — direct din salariul brut.</p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-0.5">Salariul net real</p>
            <p className="text-gray-600 text-xs">La €15/oră și 40 ore/săptămână: aprox. €280–€350 net după toate costurile.</p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-0.5">Calculează înainte să pleci</p>
            <p className="text-gray-600 text-xs">Folosește calculatorul să afli cifrele exacte pentru oferta ta.</p>
          </div>
        </div>
        <Link href="/tools/real-income-calculator"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-red-700 border border-red-300 rounded-full px-3 py-1.5 hover:bg-red-100 transition-colors">
          🧮 Calculează salariul real →
        </Link>
        <p className="text-[9px] text-gray-400 mt-2">* Estimare orientativă. Salariul real depinde de contractul specific.</p>
      </div>

      {/* Job categories */}
      <section className="mb-10">
        <h2 className="text-lg font-black text-gray-900 mb-4">Tipuri de locuri de muncă cu cazare</h2>
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
            Agenții care oferă cazare ({AGENCIES_WITH_HOUSING.length})
          </h2>
          <Link href="/agencies-with-housing" className="text-sm text-brand-600 font-semibold hover:underline">
            Toate →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {housingAgencies.map((agency) => (
            <AgencyCard key={agency.slug} agency={agency} locale="ro" />
          ))}
        </div>
        <p className="text-[9px] text-gray-500 mt-4">
          ℹ️ Informațiile despre agenții se bazează pe date raportate de muncitori. Verificare independentă — agențiile nu plătesc pentru poziționare.
        </p>
      </section>

      {/* Cities */}
      <section className="mb-10">
        <h2 className="text-lg font-black text-gray-900 mb-4">Locuri de muncă cu cazare după oraș</h2>
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
          <p className="font-black text-base mb-1">Verifică ofertele înainte să semnezi</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Recenzii de la muncitori, poze cazare și calculator salariu net — toate gratuit.
          </p>
        </div>
        <Link href="/agencies-with-housing"
          className="shrink-0 bg-green-600 hover:bg-green-500 text-white font-black text-sm px-5 py-3 rounded-xl transition-colors whitespace-nowrap">
          🏠 Agenții cu cazare →
        </Link>
      </div>

    </div>
  );
}
