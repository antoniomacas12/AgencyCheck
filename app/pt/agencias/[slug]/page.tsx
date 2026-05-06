import type { Metadata } from "next";
import { agencyAlternatesLocale } from "@/lib/seoAlternates";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getDbAgency,
  getAgencyCityMentions,
  computeRatingAverages,
  type DbReview,
  type DbCityMention,
} from "@/lib/agencyDb";
import { ALL_AGENCIES, ALL_AGENCY_MAP } from "@/lib/agencyEnriched";
import { AGENCY_STRINGS, CITY_STRINGS, AGENCY_BASE, CITY_BASE, EN_AGENCY_BASE, renderStars, type I18nLocale } from "@/lib/agencyI18nStrings";
import { toCitySlug } from "@/lib/cityNormalization";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
const LOCALE: I18nLocale = "pt";
const S = AGENCY_STRINGS[LOCALE];

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const staticAgency = ALL_AGENCY_MAP[params.slug];
  const agencyName   = staticAgency?.name ?? params.slug.replace(/-/g, " ");
  const city         = staticAgency?.city ?? "Holanda";
  const sector       = staticAgency?.sector ?? "general-staffing";
  const hasHousing   = staticAgency?.accommodation === "confirmed_with_deduction" || staticAgency?.accommodation === "confirmed_no_deduction";

  const title = `${agencyName} avaliações – salário, alojamento, trabalho na Holanda`;
  const description = `${agencyName} é uma agência de trabalho em ${city}, Holanda. Setor: ${sector}. ${
    hasHousing ? "Alojamento disponível para trabalhadores. " : ""
  }Leia as avaliações dos trabalhadores sobre salários, condições de trabalho e alojamento.`;

  return {
    title,
    description,
    alternates: agencyAlternatesLocale(params.slug, "pt"),
    openGraph: {
      title,
      description,
      locale: "pt_PT",
      type:   "website",
    },
    keywords: [
      `${agencyName} avaliações`,
      `${agencyName} trabalho Holanda`,
      `${agencyName} alojamento`,
      `${agencyName} salário`,
      `agência trabalho ${city}`,
      "trabalho na Holanda avaliações",
    ],
  };
}

// ─── Sector salary ranges (PT) ────────────────────────────────────────────────

const SECTOR_SALARY_PT: Record<string, { min: string; max: string; note: string }> = {
  "logistics":         { min: "€13,50", max: "€16,00", note: "trabalho em armazéns, picking e packing, operação de empilhadores" },
  "food-production":   { min: "€13,50", max: "€15,50", note: "linha de produção, embalagem, controlo de qualidade" },
  "construction":      { min: "€16,00", max: "€24,00", note: "os valores dependem das qualificações e tipo de obra" },
  "office-admin":      { min: "€15,00", max: "€28,00", note: "trabalho de escritório e administrativo, frequentemente contratos longos" },
  "general-staffing":  { min: "€13,27", max: "€16,00", note: "vários setores, salário mínimo WML 2026 = €14,71/hora" },
  "agriculture":       { min: "€13,27", max: "€14,50", note: "trabalho sazonal no campo, colheitas, estufas" },
  "healthcare":        { min: "€15,00", max: "€32,00", note: "pessoal médico e de cuidados, requer certificados" },
  "transport":         { min: "€14,50", max: "€20,00", note: "motoristas (C, CE), operadores, trabalho por turnos" },
  "manufacturing":     { min: "€13,50", max: "€17,00", note: "produção industrial, operação de máquinas, turnos" },
  "industrial":        { min: "€13,50", max: "€17,50", note: "operação de máquinas, montagem, pavilhões industriais" },
  "cleaning":          { min: "€13,27", max: "€14,50", note: "limpeza industrial e de escritórios" },
  "hospitality":       { min: "€13,27", max: "€15,50", note: "hotéis, restaurantes, catering" },
  "it-tech":           { min: "€25,00", max: "€65,00", note: "TI, desenvolvimento, trabalho remoto ou híbrido" },
};

function getSalarySector(sector: string) {
  return SECTOR_SALARY_PT[sector] ?? SECTOR_SALARY_PT["general-staffing"];
}

// ─── Accommodation details (PT) ───────────────────────────────────────────────

function getAccommodationInfo(acc: string): { label: string; detail: string; color: string } {
  switch (acc) {
    case "confirmed_with_deduction":
      return {
        label:  "✅ Alojamento disponível",
        detail: "A agência disponibiliza alojamento aos trabalhadores. O custo é normalmente ~€80–100/semana, descontado diretamente do salário (de acordo com as normas SNF). Antes de assinar o contrato, pergunte sobre o valor exato do desconto semanal e o número de pessoas por quarto.",
        color:  "green",
      };
    case "confirmed_no_deduction":
      return {
        label:  "✅ Alojamento incluído",
        detail: "A agência disponibiliza alojamento sem descontos no salário. Esta é uma opção rara e vantajosa — confirme por escrito que não existem taxas administrativas escondidas.",
        color:  "green",
      };
    case "not_provided":
      return {
        label:  "❌ Sem alojamento",
        detail: "A agência não fornece alojamento. Os trabalhadores têm de arranjar habitação por conta própria. A renda média por quarto na Holanda é €500–900/mês dependendo da região.",
        color:  "red",
      };
    case "unverified_claim":
      return {
        label:  "⚠ Alojamento declarado",
        detail: "A agência declara disponibilizar alojamento, mas isso ainda não foi verificado pelo AgencyCheck. Contacte diretamente a agência para esclarecer as condições e custos antes de assinar o contrato.",
        color:  "amber",
      };
    default:
      return {
        label:  "❓ Estado do alojamento desconhecido",
        detail: "Não temos informação confirmada sobre alojamento nesta agência. Pergunte sempre sobre alojamento no primeiro contacto com a agência.",
        color:  "gray",
      };
  }
}

// ─── Worker tips by sector (PT) ───────────────────────────────────────────────

const SECTOR_TIPS_PT: Record<string, string[]> = {
  "logistics":       [
    "Antes de assinar o contrato, verifique se a agência desconta custos de transporte para o armazém.",
    "Pergunte como são calculadas as horas extra — na Holanda depende do contrato coletivo de trabalho (CAO).",
    "Trabalho por turnos (ochtend/avond) tem frequentemente tarifas mais altas — pergunte sobre subsídios noturnos e de fim de semana.",
  ],
  "food-production": [
    "Nas fábricas alimentares muitas vezes é necessário equipamento de proteção próprio — pergunte o que a agência fornece.",
    "O trabalho em linha de produção pode ser monótono — assegure-se que o salário/hora está claramente acima do mínimo.",
    "Verifique se a agência paga contribuições para a segurança social (sociale verzekering) — é um direito seu na Holanda.",
  ],
  "construction":    [
    "As agências de construção frequentemente exigem ferramentas próprias ou autorizações especiais — verifique os requisitos com antecedência.",
    "Os valores para construção podem diferir muito dos anunciados — pergunte pelo valor líquido após descontos.",
    "Na construção aplica-se frequentemente o CAO Bouw — certifique-se que a agência o respeita.",
  ],
  "general-staffing":[
    "Verifique se o contrato é um Uitzendovereenkomst — este é o contrato temporário padrão na Holanda.",
    "O salário mínimo em 2026 é €14,71/hora (WML) — nenhuma agência pode oferecer menos.",
    "Pergunte sobre o sistema de fases (Fase A/B/C) — determina a sua proteção no emprego.",
  ],
};

function getTips(sector: string): string[] {
  return SECTOR_TIPS_PT[sector] ?? SECTOR_TIPS_PT["general-staffing"];
}

// ─── FAQ generator (PT) ───────────────────────────────────────────────────────

function buildFaq(agencyName: string, acc: string, sector: string, cities: string[], score: number) {
  const salary = getSalarySector(sector);
  const cityList = cities.slice(0, 3).map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ");

  return [
    {
      q: `A ${agencyName} fornece alojamento?`,
      a: acc === "confirmed_with_deduction"
        ? `Sim — a ${agencyName} disponibiliza alojamento aos trabalhadores. O custo é descontado do salário semanal (normalmente €80–100/semana de acordo com as normas SNF). Pergunte à agência o valor atual.`
        : acc === "confirmed_no_deduction"
        ? `Sim — a ${agencyName} disponibiliza alojamento sem descontos no salário. Esta é uma opção rara e muito vantajosa.`
        : acc === "not_provided"
        ? `Não — a ${agencyName} não fornece alojamento. Terá de arranjar habitação por conta própria. A renda média na Holanda é €500–900/mês por quarto.`
        : `O estado do alojamento na ${agencyName} é incerto — contacte diretamente a agência para esclarecer antes de assinar o contrato.`,
    },
    {
      q: `Quanto se pode ganhar a trabalhar pela ${agencyName}?`,
      a: `A agência ${agencyName} é especializada no setor: ${sector}. As tarifas horárias típicas nesta área na Holanda são ${salary.min}–${salary.max}/hora bruto. Note que ao valor bruto são deduzidos o imposto holandês, contribuições de seguro (ZVW ~€35/semana) e eventuais custos de alojamento e transporte.`,
    },
    {
      q: `Em que cidades opera a ${agencyName}?`,
      a: cityList
        ? `A ${agencyName} serve trabalhadores nas seguintes cidades: ${cityList}${cities.length > 3 ? ` e outras` : ""}. Contacte a agência para verificar disponibilidade de ofertas numa cidade específica.`
        : `A ${agencyName} opera em todo o território da Holanda. Contacte diretamente a agência para verificar as localizações disponíveis.`,
    },
    {
      q: `Como avaliam os trabalhadores a ${agencyName}?`,
      a: score >= 70
        ? `A ${agencyName} obtém uma pontuação de transparência relativamente alta (${score}/100) de acordo com os dados do AgencyCheck. Uma pontuação alta significa que a agência está ativa, tem dados de contacto disponíveis e não é reportada por trabalhadores por práticas antiéticas.`
        : score >= 50
        ? `A ${agencyName} obtém uma pontuação média de transparência (${score}/100). Antes de assinar o contrato, consulte as avaliações dos trabalhadores e pergunte sobre as condições essenciais de emprego.`
        : `A ${agencyName} obtém uma pontuação baixa de transparência (${score}/100). Recomendamos especial cuidado e verificação das condições contratuais antes de assinar.`,
    },
    {
      q: `O que verificar antes de assinar contrato com uma agência de trabalho na Holanda?`,
      a: `Verifique sempre: (1) a tarifa horária bruta e todos os descontos, (2) o custo do alojamento e regulamento SNF, (3) os custos de transporte para o trabalho, (4) o sistema de fases e tipo de contrato (Fase A/B/C), (5) o número de registo ABU/NBBU da agência. Salário mínimo em 2026 = €14,71/hora.`,
    },
  ];
}

// ─── Star helper ───────────────────────────────────────────────────────────────

function RatingRow({ label, value }: { label: string; value: number }) {
  const pct   = Math.round((value / 5) * 100);
  const color = value >= 4 ? "bg-green-400" : value >= 3 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-32 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-6 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

// ─── Review card ───────────────────────────────────────────────────────────────

function ReviewCard({ r }: { r: DbReview }) {
  const date = new Date(r.createdAt).toLocaleDateString("pt-PT", {
    month: "short",
    year:  "numeric",
  });
  const recommend = r.wouldRecommend === "YES" ? S.recommended : r.wouldRecommend === "NO" ? S.notRecommended : null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-yellow-400 text-base leading-none">
          {renderStars(r.overallRating)}
        </span>
        <span className="text-sm font-bold text-gray-900">{r.overallRating}/5</span>
        <span className="text-xs text-gray-400">{date}</span>
        {r.city && <span className="text-xs text-gray-500">📍 {r.city}</span>}
        {recommend && (
          <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
            recommend === S.recommended ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {recommend}
          </span>
        )}
      </div>
      {r.title && (
        <p className="text-sm font-semibold text-gray-800 mb-1">{r.title}</p>
      )}
      {r.comment && (
        <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
      )}
      <p className="text-[10px] text-gray-400 mt-2 italic">{S.originalComment}</p>
    </div>
  );
}

// ─── Comment card ──────────────────────────────────────────────────────────────

function CommentCard({ c }: { c: { id: string; agencyName: string; city: string; body: string; createdAt: Date } }) {
  const diff = Date.now() - new Date(c.createdAt).getTime();
  const days = Math.floor(diff / 86_400_000);
  const timeStr = days === 0 ? "hoje" : days === 1 ? "ontem" : `há ${days} dias`;
  return (
    <div className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="shrink-0 w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-sm mt-0.5">
        👷
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
          <span className="text-xs font-semibold text-gray-800">{c.agencyName}</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-500">📍 {c.city}</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-400">{timeStr}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-line">
          {c.body}
        </p>
        <p className="text-[10px] text-gray-400 mt-1 italic">{S.originalComment}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PtAgencyPage({ params }: { params: { slug: string } }) {
  const staticAgency = ALL_AGENCY_MAP[params.slug];
  const dbAgency     = await getDbAgency(params.slug);

  if (!staticAgency && !dbAgency) return notFound();

  const agencyName   = staticAgency?.name ?? dbAgency?.name ?? params.slug;
  const agencyId     = dbAgency?.id ?? null;
  const isUnverified = !staticAgency;

  const sector          = staticAgency?.sector ?? "general-staffing";
  const accommodation   = staticAgency?.accommodation ?? "unknown";
  const supportedCities = staticAgency?.supportedCities ?? [];
  const jobFocus        = staticAgency?.jobFocus ?? [];
  const transparencyScore = staticAgency?.transparencyScore ?? 0;
  const description     = staticAgency?.description ?? null;
  const city            = staticAgency?.city ?? dbAgency?.city ?? "Holanda";

  const cityMentions: DbCityMention[] = agencyId
    ? await getAgencyCityMentions(agencyId)
    : [];

  const directReviews: DbReview[] = dbAgency?.directReviews ?? [];
  const avgRatings                = computeRatingAverages(directReviews);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  const recentComments: { id: string; agencyName: string; city: string; body: string; createdAt: Date }[] =
    agencyId
      ? await db.reviewComment.findMany({
          where:   { review: { agencyId } },
          orderBy: { createdAt: "desc" },
          take:    5,
          select:  { id: true, agencyName: true, city: true, body: true, createdAt: true },
        }).catch(() => [])
      : [];

  // Related agencies: same city/sector, different slug
  const relatedAgencies = ALL_AGENCIES
    .filter((a) =>
      a.slug !== params.slug &&
      (a.city === city || a.sector === sector)
    )
    .sort((a, b) => b.transparencyScore - a.transparencyScore)
    .slice(0, 4);

  const salaryInfo = getSalarySector(sector);
  const accInfo    = getAccommodationInfo(accommodation);
  const tips       = getTips(sector);
  const faqItems   = buildFaq(agencyName, accommodation, sector, supportedCities, transparencyScore);

  const accBorderColor = accInfo.color === "green" ? "border-green-200 bg-green-50"
    : accInfo.color === "red" ? "border-red-100 bg-red-50"
    : accInfo.color === "amber" ? "border-amber-200 bg-amber-50"
    : "border-gray-100 bg-gray-50";
  const accTextColor = accInfo.color === "green" ? "text-green-800"
    : accInfo.color === "red" ? "text-red-700"
    : accInfo.color === "amber" ? "text-amber-800"
    : "text-gray-700";

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 pb-24">

      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type":    "Organization",
            name:       agencyName,
            url:        `https://agencycheck.io${AGENCY_BASE.pt}/${params.slug}`,
            ...(avgRatings && avgRatings.count > 0
              ? {
                  aggregateRating: {
                    "@type":       "AggregateRating",
                    ratingValue:   avgRatings.overall,
                    reviewCount:   avgRatings.count,
                    bestRating:    5,
                    worstRating:   1,
                  },
                }
              : {}),
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/pt" className="hover:text-brand-600">Página inicial</Link>
        <span>/</span>
        <Link href="/pt/agencias-trabalho-holanda" className="hover:text-brand-600">Agências de trabalho</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">{agencyName}</span>
      </nav>

      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-wrap gap-2 mb-2">
          {isUnverified && (
            <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              {S.unverifiedBadge}
            </span>
          )}
          {!isUnverified && transparencyScore > 0 && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              transparencyScore >= 70 ? "bg-green-50 text-green-700 border-green-200" :
              transparencyScore >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" :
              "bg-red-50 text-red-700 border-red-100"
            }`}>
              Transparência: {transparencyScore}/100
            </span>
          )}
          {directReviews.length > 0 && (
            <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
              {S.reviewsCount(directReviews.length)}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {agencyName} — avaliações de trabalhadores
          <span className="block text-sm font-normal text-gray-400 mt-0.5">
            Salário · Alojamento · Condições de trabalho na Holanda
          </span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          📍 {city}, Holanda
          {" · "}
          <Link href={`${EN_AGENCY_BASE}/${params.slug}`} className="text-brand-600 hover:underline text-xs">
            English version →
          </Link>
        </p>
      </header>

      {/* Agency description (unique per agency) */}
      {description && (
        <section className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Sobre a agência</p>
          <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
          {jobFocus.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {jobFocus.map((j) => (
                <span key={j} className="text-[11px] bg-white border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full">
                  {j.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Salary section */}
      <section className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">💶 Salário em {sector.replace(/-/g, " ")}</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-black text-blue-900">{salaryInfo.min} – {salaryInfo.max}</span>
          <span className="text-sm text-blue-600">/hora bruto</span>
        </div>
        <p className="text-xs text-blue-700 mb-2">{salaryInfo.note}</p>
        <p className="text-[11px] text-blue-500">
          Após dedução do imposto, ZVW (~€35/semana) e eventuais custos de alojamento e transporte, o salário real "líquido" pode ser 25–40% inferior ao valor bruto.
          <Link href="/tools/real-income-calculator" className="ml-1 underline font-semibold">Calcule o seu rendimento real →</Link>
        </p>
      </section>

      {/* Accommodation section */}
      <section className={`mb-6 rounded-xl border p-4 ${accBorderColor}`}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "inherit" }}>🏠 Alojamento</p>
        <p className={`text-sm font-semibold mb-1 ${accTextColor}`}>{accInfo.label}</p>
        <p className={`text-sm leading-relaxed ${accTextColor}`}>{accInfo.detail}</p>
        {supportedCities.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Cidades servidas: {supportedCities.slice(0, 5).map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")}
            {supportedCities.length > 5 && ` +${supportedCities.length - 5} outras`}
          </p>
        )}
      </section>

      {/* Rating summary */}
      {avgRatings && avgRatings.count > 0 && (
        <section className="card p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-center shrink-0">
              <p className="text-3xl font-black text-gray-900 leading-none">{avgRatings.overall}</p>
              <p className="text-yellow-400 text-sm mt-0.5">{renderStars(avgRatings.overall)}</p>
              <p className="text-[10px] text-gray-400 mt-1">{S.reviewsCount(avgRatings.count)}</p>
            </div>
            <div className="flex-1 space-y-2">
              <RatingRow label={S.salaryLabel}     value={avgRatings.salary   ?? avgRatings.overall} />
              <RatingRow label={S.managementLabel} value={avgRatings.mgmt     ?? avgRatings.overall} />
              <RatingRow label={S.contractLabel}   value={avgRatings.contract ?? avgRatings.overall} />
            </div>
          </div>
        </section>
      )}

      {/* Worker reviews from DB */}
      {directReviews.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">{S.workerReviews}</h2>
          <div className="space-y-3">
            {directReviews.slice(0, 5).map((r) => (
              <ReviewCard key={r.id} r={r} />
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-3 italic">{S.trustNote}</p>
        </section>
      )}

      {/* Worker tips */}
      <section className="mb-8 rounded-xl border border-amber-100 bg-amber-50 p-4">
        <h2 className="text-sm font-bold text-amber-800 mb-3">💡 Dicas para trabalhadores — {sector.replace(/-/g, " ")}</h2>
        <ul className="space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
              <span className="shrink-0 text-amber-500 mt-0.5">→</span>
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* Worker comments */}
      {recentComments.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">{S.workerComments}</h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-50">
            {recentComments.map((c) => (
              <div key={c.id} className="px-4">
                <CommentCard c={c} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cities mentioned */}
      {cityMentions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-gray-800 mb-1">{S.citiesMentioned}</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {cityMentions.map((cm) => (
              <Link
                key={cm.cityNormalized}
                href={`${AGENCY_BASE.pt}/${params.slug}/${toCitySlug(cm.cityNormalized)}`}
                className="inline-flex items-center gap-1.5 text-xs bg-blue-50 border border-blue-100
                  text-blue-800 px-3 py-1 rounded-full hover:bg-blue-100 hover:border-blue-200 transition-colors"
              >
                📍 {cm.cityDisplay}
                {cm.mentionCount > 1 && <span className="text-blue-400">·{cm.mentionCount}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-4">Perguntas frequentes sobre {agencyName}</h2>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <div key={item.q} className="border border-gray-200 rounded-xl px-5 py-4 bg-white">
              <p className="text-sm font-semibold text-gray-900 mb-2">{item.q}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related agencies (internal linking) */}
      {relatedAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-gray-800 mb-3">Agências de trabalho similares na Holanda</h2>
          <div className="grid grid-cols-2 gap-2">
            {relatedAgencies.map((a) => (
              <Link
                key={a.slug}
                href={`${AGENCY_BASE.pt}/${a.slug}`}
                className="border border-gray-100 rounded-xl px-3 py-2.5 bg-white hover:border-brand-200 hover:shadow-sm transition-all"
              >
                <p className="text-xs font-semibold text-gray-800 leading-tight truncate">{a.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {a.city} · {a.transparencyScore}/100
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 text-center mb-6">
        <p className="text-sm font-bold text-brand-800 mb-1">{S.ctaHeading(agencyName)}</p>
        <p className="text-xs text-brand-600 mb-3">{S.ctaBody}</p>
        <Link
          href={`/reviews/submit?agency=${encodeURIComponent(agencyName)}`}
          className="inline-block bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold
            px-5 py-2.5 rounded-xl transition-colors"
        >
          {S.ctaButton}
        </Link>
      </div>

      {/* Footer nav */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-sm">
        <Link href="/pt/agencias-trabalho-holanda" className="text-gray-400 hover:text-brand-600">
          ← {S.allAgencies}
        </Link>
        <Link href={`${EN_AGENCY_BASE}/${params.slug}`} className="text-brand-600 hover:text-brand-800 font-medium">
          English version →
        </Link>
      </div>
    </main>
  );
}
