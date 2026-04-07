import type { Metadata } from "next";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import { AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import { JOB_LISTINGS } from "@/lib/jobData";

export const metadata: Metadata = {
  title: "Trabalho com Alojamento na Holanda — Salários Reais após Deduções",
  description:
    "Encontre trabalho com alojamento na Holanda. Armazém, produção, estufa, logística. Verifique os salários líquidos reais após deduzir custos de alojamento, imposto e transporte. AgencyCheck.io",
  keywords: [
    "trabalho com alojamento Holanda", "trabalho Holanda com casa",
    "agência de trabalho alojamento", "armazém Holanda alojamento",
    "trabalho na Holanda com alojamento", "ofertas de emprego Holanda habitação",
  ],
  alternates: {
    canonical: "https://agencycheck.io/pt/trabalho-com-alojamento",
    languages: {
      "en":        "https://agencycheck.io/jobs-with-accommodation",
      "pl":        "https://agencycheck.io/pl/praca-z-zakwaterowaniem",
      "ro":        "https://agencycheck.io/ro/locuri-de-munca-cu-cazare",
      "pt":        "https://agencycheck.io/pt/trabalho-com-alojamento",
      "x-default": "https://agencycheck.io/jobs-with-accommodation",
    },
  },
};

const JOB_GROUPS = [
  {
    id:    "warehouse",
    label: "Trabalho em armazém",
    icon:  "📦",
    slugs: ["order-picker", "warehouse-worker", "packing-operator"],
    note:  "Sem requisitos de experiência anterior. A maioria dos postos em e-commerce ou fulfillment.",
  },
  {
    id:    "production",
    label: "Trabalho em produção",
    icon:  "⚙️",
    slugs: ["production-worker", "assembly-worker", "machine-operator"],
    note:  "Turnos rotativos de 3 turnos. Produção alimentar e linhas de montagem.",
  },
  {
    id:    "greenhouse",
    label: "Estufa e horticultura",
    icon:  "🌿",
    slugs: ["greenhouse-worker"],
    note:  "Época: março–outubro. Região de Westland e Greenport.",
  },
  {
    id:    "logistics",
    label: "Logística e empilhadoras",
    icon:  "🚜",
    slugs: ["forklift-driver", "reach-truck-driver"],
    note:  "Necessária carta de empilhadora ou reach truck.",
  },
] as const;

const housingListings = JOB_LISTINGS.filter((j) => j.housing === "YES" && j.isActive);
const housingAgencies = [...AGENCIES_WITH_HOUSING]
  .sort((a, b) => (b.transparencyScore ?? 0) - (a.transparencyScore ?? 0))
  .slice(0, 8);

export default function PtJobsWithHousingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/pt" className="hover:text-brand-600">Página inicial</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Trabalho com alojamento</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-800 rounded-full px-2.5 py-1">
            🏠 {housingListings.length} ofertas com alojamento
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
            🇳🇱 Holanda
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
            🚫 Sem publicidade de agências
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">
          Trabalho com alojamento na Holanda
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          O alojamento fornecido pela agência <strong>não é gratuito</strong> — é descontado diretamente do salário.
          Aqui encontrará os salários líquidos reais após todas as deduções.
          Verifique antes de assinar o contrato.
        </p>
      </div>

      {/* Reality check strip */}
      <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2">⚠️ O que precisa de saber</p>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-bold text-gray-900 mb-0.5">Alojamento descontado do salário</p>
            <p className="text-gray-600 text-xs">Geralmente €120–€170/semana — diretamente do bruto.</p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-0.5">Salário líquido real</p>
            <p className="text-gray-600 text-xs">Com €15/h e 40 h/semana: aprox. €280–€350 líquido depois de todos os custos.</p>
          </div>
          <div>
            <p className="font-bold text-gray-900 mb-0.5">Verifique antes de partir</p>
            <p className="text-gray-600 text-xs">Use a calculadora para conhecer os valores exatos da sua oferta.</p>
          </div>
        </div>
        <Link href="/tools/real-income-calculator"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-red-700 border border-red-300 rounded-full px-3 py-1.5 hover:bg-red-100 transition-colors">
          🧮 Calcular salário real →
        </Link>
        <p className="text-[9px] text-gray-400 mt-2">* Valores estimados. Os salários reais dependem do contrato específico.</p>
      </div>

      {/* Job categories */}
      <section className="mb-10">
        <h2 className="text-lg font-black text-gray-900 mb-4">Tipos de trabalho com alojamento</h2>
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
            Agências que fornecem alojamento ({AGENCIES_WITH_HOUSING.length})
          </h2>
          <Link href="/agencies-with-housing" className="text-sm text-brand-600 font-semibold hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {housingAgencies.map((agency) => (
            <AgencyCard key={agency.slug} agency={agency} locale="pt" />
          ))}
        </div>
        <p className="text-[9px] text-gray-500 mt-4">
          ℹ️ As informações sobre agências baseiam-se em dados reportados por trabalhadores. Verificação independente — as agências não pagam por posicionamento.
        </p>
      </section>

      {/* Cities */}
      <section className="mb-10">
        <h2 className="text-lg font-black text-gray-900 mb-4">Trabalho com alojamento por cidade</h2>
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
          <p className="font-black text-base mb-1">Verifique as ofertas antes de assinar</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Avaliações de trabalhadores, fotos de alojamento e calculadora de salário líquido — tudo gratuito.
          </p>
        </div>
        <Link href="/agencies-with-housing"
          className="shrink-0 bg-green-600 hover:bg-green-500 text-white font-black text-sm px-5 py-3 rounded-xl transition-colors whitespace-nowrap">
          🏠 Agências com alojamento →
        </Link>
      </div>

    </div>
  );
}
