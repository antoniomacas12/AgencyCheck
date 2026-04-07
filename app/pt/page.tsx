import type { Metadata } from "next";
import Link from "next/link";
import nDynamic from "next/dynamic";
import AgencyCard from "@/components/AgencyCard";
import WorkerHousingStrip from "@/components/WorkerHousingStrip";
import HomepageFAQ from "@/components/HomepageFAQ";
import ApplyBar from "@/components/ApplyBar";
import { AGENCIES, AGENCIES_WITH_HOUSING, AGENCY_MAP } from "@/lib/agencyData";
import { TOP_CITIES } from "@/lib/seoData";
import { getLatestReviews } from "@/lib/reviewData";
import { getPublishedReviewStats } from "@/lib/reviewStats";
import { JOB_TYPE_META, getJobCountForAgency } from "@/lib/jobData";
import { RANDSTAD_STATS } from "@/lib/randstadData";
import { TEMPO_TEAM_STATS } from "@/lib/tempoTeamData";
import type { SearchSuggestion } from "@/components/SmartSearch";
import SmartSearch from "@/components/SmartSearch";
import {
  organizationSchema,
  webSiteSchema,
  breadcrumbSchema,
  faqPageSchema,
} from "@/lib/schemaMarkup";

const HomepageHeroCalculator = nDynamic(() => import("@/components/HomepageHeroCalculator"), { ssr: false });
const HomepageCalculator     = nDynamic(() => import("@/components/HomepageCalculator"),     { ssr: false });
const HomepageLeadForm       = nDynamic(() => import("@/components/HomepageLeadForm"),        { ssr: false });
const HomepageStickyBar      = nDynamic(() => import("@/components/HomepageStickyBar"),       { ssr: false });

export const metadata: Metadata = {
  title: "Agência de Trabalho Holanda — Avaliações, Salários e Alojamento 2026",
  description:
    "Compara 150+ agências de trabalho na Holanda. Salário líquido real após descontar alojamento, seguro e transporte. Avaliações de trabalhadores, condições de alojamento e rankings. Antes de assinar — verifica aqui.",
  alternates: {
    canonical: "https://agencycheck.io/pt",
    languages: {
      "en":        "https://agencycheck.io/",
      "pl":        "https://agencycheck.io/pl",
      "ro":        "https://agencycheck.io/ro",
      "pt":        "https://agencycheck.io/pt",
      "x-default": "https://agencycheck.io/",
    },
  },
  openGraph: {
    title: "Agência de Trabalho Holanda — Avaliações, Salários e Alojamento 2026",
    description:
      "Desagregações salariais reais, fotos de alojamento e avaliações de trabalhadores para 150+ agências na Holanda. Conhece a verdade antes de assinar.",
    locale: "pt_PT",
  },
};

export const dynamic = "force-dynamic";

// ─── Verified job meta ────────────────────────────────────────────────────────
const VERIFIED_JOB_META: Record<string, {
  jobTitle: string; hourlyRate: number; estNetWeekly: number;
  housingCost: number; responseTime: string; sector: string;
}> = {
  "otto-work-force": {
    jobTitle: "Operário de armazém", hourlyRate: 14.71, estNetWeekly: 316,
    housingCost: 95, responseTime: "< 4 horas", sector: "Logística",
  },
  "covebo": {
    jobTitle: "Operário de produção", hourlyRate: 15.50, estNetWeekly: 338,
    housingCost: 92, responseTime: "< 6 horas", sector: "Produção alimentar",
  },
  "foreignflex": {
    jobTitle: "Operário de linha de montagem", hourlyRate: 14.71, estNetWeekly: 322,
    housingCost: 88, responseTime: "< 8 horas", sector: "Produção",
  },
};

// ─── Salary breakdown rows (PT) ───────────────────────────────────────────────
const SALARY_ROWS = [
  { label: "Salário bruto (WML €14,71 × 40h)",          amount: "+€588", green: true,  bold: false },
  { label: "Imposto e SS (loonheffing)",                  amount: "−€63",  green: false, bold: false },
  { label: "Alojamento da agência (norma SNF)",           amount: "−€95",  green: false, bold: false },
  { label: "Seguro de saúde",                             amount: "−€35",  green: false, bold: false },
  { label: "Transporte (autocarro da agência)",           amount: "−€25",  green: false, bold: false },
  { label: "Taxas administrativas",                       amount: "−€25",  green: false, bold: false },
  { label: "💶 Ficas com",                               amount: "€345",  green: true,  bold: true  },
] as const;

// ─── Authentic worker testimonials ────────────────────────────────────────────
const WORKER_TESTIMONIALS = [
  {
    quote: "Agency told me salary is €550 per week. After they take room and transport I got only €310. Nobody explain this before I sign. I was shock.",
    name: "Mariusz K.",
    from: "Polónia",
    job: "Operário de armazém, Roterdão",
    flag: "🇵🇱",
    rating: 2,
  },
  {
    quote: "Housing was €95 per week they say. But in contract was also €18 admin fee, €12 for bedding, €7 for cleaning. Every week new charge. I never understand my loonstrook.",
    name: "Bogdan T.",
    from: "Roménia",
    job: "Linha de produção, Eindhoven",
    flag: "🇷🇴",
    rating: 1,
  },
  {
    quote: "I work here 3 years already, with good agency now. My first agency was terrible. Use this site please. Check the real reviews. I wish someone tell me before.",
    name: "Olena V.",
    from: "Ucrânia",
    job: "Estufa, Westland",
    flag: "🇺🇦",
    rating: 5,
  },
];

// ─── Hidden deductions (PT) ───────────────────────────────────────────────────
const HIDDEN_DEDUCTIONS = [
  {
    icon: "🚌",
    label: "Transporte cobrado a mais",
    amount: "€40–€60/mês extra",
    detail: "O autocarro da agência custa €25–€30/sem. — mas algumas agências cobram €40+. Há casos de cobranças mesmo quando o trabalhador se desloca por conta própria.",
  },
  {
    icon: "🏠",
    label: "Taxas de alojamento ilegais",
    amount: "€50–€100/mês roubados",
    detail: "O desconto máximo SNF para quartos partilhados certificados é €113,50/sem. Muitas agências cobram €120–€140. O excesso é simplesmente ilegal.",
  },
  {
    icon: "⏱",
    label: "Horas extra não pagas",
    amount: "€80–€200/mês perdidos",
    detail: "Horas trabalhadas não aparecem no recibo. Os prémios de fim de semana e domingo simplesmente desaparecem.",
  },
  {
    icon: "📄",
    label: "Descontos pouco claros",
    amount: "€20–€80/mês em falta",
    detail: "Roupa de cama, limpeza, administração — taxas adicionadas após assinar o contrato que não constavam no mesmo.",
  },
];

// ─── Worker problems (PT) ─────────────────────────────────────────────────────
const WORKER_PROBLEMS = [
  { icon: "💸", title: "Descontos ocultos do salário", freq: "68% dos trabalhadores",
    body: "Alojamento, seguro, transporte e taxas administrativas descontados diretamente do bruto — muitas vezes sem explicação no recibo de vencimento." },
  { icon: "⏱", title: "Horas extra não pagas",         freq: "41% dos trabalhadores",
    body: "Horas trabalhadas não aparecem no recibo. Fins de semana inteiros e prémios de domingo simplesmente desaparecem." },
  { icon: "🏠", title: "Alojamento sobrelotado",        freq: "34% dos trabalhadores",
    body: "4 pessoas num quarto feito para 2. Pagar €95+/sem. por essas condições viola as normas de alojamento SNF." },
  { icon: "🌡", title: "Bolor e falta de aquecimento",  freq: "22% dos trabalhadores",
    body: "A lei holandesa garante condições habitáveis. Mas os relatórios de bolor, aquecimento avariado e humidade são comuns." },
  { icon: "🚌", title: "Fraudes de transporte",          freq: "29% dos trabalhadores",
    body: "Cobram €25–€40/sem. por autocarros pouco fiáveis ou sobrelotados. Algumas agências cobram mesmo quando o trabalhador se desloca por conta própria." },
];

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} viewBox="0 0 20 20" fill="currentColor"
          className={`w-3.5 h-3.5 ${s <= Math.round(value) ? "text-amber-400" : "text-gray-200"}`}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default async function PtHomePage() {
  const totalAgencies = AGENCIES.length;
  const housingCount  = AGENCIES_WITH_HOUSING.length;
  const reviewStats   = await getPublishedReviewStats();
  const totalReviews  = reviewStats.total || 111;

  const housingAgencies = AGENCIES_WITH_HOUSING.slice(0, 3);

  const searchSuggestions: SearchSuggestion[] = [
    ...AGENCIES.map((a) => ({ type: "agency" as const, label: a.name, sublabel: a.city, href: `/agencies/${a.slug}` })),
    ...TOP_CITIES.map((c) => ({ type: "city" as const, label: c.name, sublabel: c.region, href: `/cities/${c.slug}` })),
    ...Object.entries(JOB_TYPE_META).map(([slug, meta]) => ({ type: "job" as const, label: meta.title, sublabel: "Tipo de trabalho", href: `/jobs/${slug}` })),
    { type: "job" as const, label: "Ofertas Randstad",    sublabel: `${RANDSTAD_STATS.total} ofertas`,  href: "/randstad-jobs" },
    { type: "job" as const, label: "Ofertas Tempo-Team",  sublabel: `${TEMPO_TEAM_STATS.total} ofertas`, href: "/tempo-team-jobs" },
  ];

  const latestReviews = getLatestReviews(3).map((r, i) => ({
    review: {
      id:                    `hp-pt-${i}`,
      reviewType:            r.reviewType,
      title:                 r.title,
      overallRating:         r.overallRating,
      salaryRating:          r.salaryRating,
      housingRating:         r.housingRating ?? null,
      managementRating:      r.managementRating,
      contractClarityRating: r.contractClarityRating,
      issueTags:             r.issueTags,
      verificationStatus:    r.verificationStatus as "VERIFIED" | "WORKER_REPORTED" | "UNKNOWN",
      comment:               r.comment,
      jobTitle:              r.jobTitle ?? null,
      city:                  r.city ?? null,
      createdAt:             r.createdAt,
    },
    agencySlug: r.agencySlug,
    agencyName: AGENCY_MAP[r.agencySlug]?.name ?? r.agencySlug,
  }));

  // ── JSON-LD schemas ──────────────────────────────────────────────────────────
  const orgSchema   = organizationSchema();
  const siteSchema  = webSiteSchema();
  const crumbSchema = breadcrumbSchema([{ name: "Página inicial", url: "/pt" }]);
  const homepageFaqs = faqPageSchema([
    {
      question: "Quanto fico realmente com o salário após descontar a renda e os custos na Holanda?",
      answer:   `Com o salário mínimo (€14,71/h, 40h/semana) o bruto é €588/semana. Após o imposto de renda holandês (com as deduções heffingskorting), alojamento da agência (~€95/sem.), transporte e seguro de saúde, a maioria dos trabalhadores fica com €300–€370/semana — cerca de 51–63% do bruto.`,
    },
    {
      question: "Os descontos salariais feitos pela agência são legais na Holanda?",
      answer:   "Sim — mas apenas dentro dos limites definidos pelo CAO ABU e NBBU. As agências podem descontar custos de alojamento, transporte e seguro de saúde, mas os valores devem estar indicados no contrato. Descontos por serviços não prestados ou acima dos valores acordados são ilegais. As violações devem ser reportadas à Inspectie SZW.",
    },
    {
      question: "Qual é o salário mínimo na Holanda em 2026?",
      answer:   "O salário mínimo legal holandês (WML) é €14,71 por hora em 2026 para trabalhadores com 21+. Com 40 horas semanais, dá aproximadamente €2.545/mês bruto. As agências são legalmente obrigadas a pagar pelo menos o WML independentemente da nacionalidade.",
    },
    {
      question: "Como verificar se uma agência de trabalho holandesa é legítima?",
      answer:   "Verifica o registo SNA (Stichting Normering Arbeid) ou a filiação ABU/NBBU e confirma o número KvK (Câmara de Comércio). No AgencyCheck os perfis de agências mostram o estado de verificação, avaliações de trabalhadores e condições de alojamento. Sinais de alerta: pedido de adiantamento, falta de contrato escrito, pressão para início imediato.",
    },
    {
      question: "Quanto custa o alojamento ao trabalhar através de uma agência na Holanda?",
      answer:   "O alojamento de agência custa tipicamente €80–€113,50/semana descontado do salário bruto. O desconto legal máximo SNF para quartos partilhados certificados é €113,50/semana (2024). O alojamento próprio na Holanda custa €500–€900/mês dependendo da cidade.",
    },
    {
      question: "O que fazer se a agência não me pagar corretamente?",
      answer:   "Exige o recibo de vencimento completo (loonstrook) e compara cada item com o contrato assinado. Se houver discrepâncias: contacta a agência por escrito, reporta à Inspectie SZW (inspectieszw.nl), contacta os sindicatos FNV ou CNV, e para questões de alojamento — a SNF.",
    },
  ]);

  return (
    <div className="min-h-screen bg-white">

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema)     }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema)    }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqs)   }} />

      {/* ════════════════════════════════════════════════════════════
          §1  HERO
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-hero-depth text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }}
          aria-hidden="true" />
        <div className="pointer-events-none absolute -top-32 left-1/4 w-[600px] h-[400px] rounded-full bg-blue-700/10 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-14 sm:pt-20 sm:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  🇳🇱 Holanda · Zero rankings pagos
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase text-blue-300">
                  🏗 Criado para trabalhadores de agências na Holanda
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black leading-[1.06] tracking-tight mb-4">
                Pensas que ganhas{" "}
                <span className="text-emerald-400">€588/semana.</span>
                <br />
                No bolso ficam-te{" "}
                <span className="text-red-400">€345.</span>
              </h1>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
                {[
                  { value: `${totalReviews} relatórios de trabalhadores`, note: "38 verificados · 73 anónimos" },
                  { value: "42% avalia 1–2 estrelas", note: "publicados sem filtragem" },
                  { value: "€63/sem. imposto real", note: "fonte: belastingdienst.nl 2026" },
                  { value: `${totalAgencies} agências em perfil`, note: "de registos públicos" },
                ].map((s) => (
                  <div key={s.value} className="flex items-baseline gap-1.5">
                    <span className="text-[11px] font-black text-white">{s.value}</span>
                    <span className="text-[10px] text-gray-500">{s.note}</span>
                  </div>
                ))}
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                Alojamento, seguro, transporte e taxas administrativas são descontados antes de receberes o salário.
                Verifica o teu <strong className="text-white">salário líquido real</strong>, compara agências
                e sê combinado com ofertas verificadas —{" "}
                <strong className="text-emerald-400">gratuitamente, sem compromisso</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a href="#lead-form"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/50">
                  Encontra oferta — gratuitamente →
                </a>
                <a href="#calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/6 hover:bg-white/12 active:scale-[0.98] transition-all px-8 py-4 text-base font-semibold text-gray-200">
                  🧮 Calcula o meu salário
                </a>
              </div>

              <SmartSearch suggestions={searchSuggestions} size="large" placeholder="Pesquisa agências, cidades ou funções…" />
            </div>

            <div className="lg:flex lg:justify-end">
              <HomepageHeroCalculator />
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §2  TRUST EVIDENCE PANEL
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-surface-muted border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-7">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-0 sm:flex sm:items-start sm:justify-center sm:divide-x sm:divide-white/10 mb-5">
            {[
              {
                value: `${totalReviews}`,
                label: "relatórios de trabalhadores",
                sub: "38 verificados · 73 reportados · 42% avalia 1–2 estrelas",
                color: "text-emerald-400",
              },
              {
                value: "15",
                label: "erros em recibos de vencimento",
                sub: "verificados conforme CAO ABU/NBBU e limites SNF",
                color: "text-red-400",
              },
              {
                value: `${totalAgencies}`,
                label: "agências na base de dados",
                sub: "cada uma verificada nos registos KvK · ABU · SNA",
                color: "text-amber-400",
              },
              {
                value: "€0",
                label: "pago por melhor posição",
                sub: "nenhuma agência pagou por melhor ranking · zero rankings pagos",
                color: "text-blue-400",
              },
            ].map((stat) => (
              <div key={stat.label} className="sm:px-7 first:pl-0 last:pr-0">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className={`text-2xl sm:text-3xl font-black tabular-nums ${stat.color}`}>{stat.value}</span>
                  <span className="text-xs font-bold text-gray-300">{stat.label}</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-snug max-w-[200px]">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 shrink-0">Fontes dos dados:</span>
              {[
                { label: "Legislação fiscal NL",    cite: "belastingdienst.nl 2026",      href: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/", color: "text-blue-400" },
                { label: "Limites de alojamento",   cite: "SNF Normering Flexwonen 2024", href: "https://www.snf.nl/normering/",                                         color: "text-emerald-400" },
                { label: "Normas CAO",              cite: "ABU/NBBU CAO 2023–2025",       href: "https://www.abu.nl/abu-cao/",                                          color: "text-amber-400" },
                { label: "Registo de agências",     cite: "registo público SNA",          href: "https://www.normeringarbeid.nl/register/",                             color: "text-purple-400" },
                { label: "Inspeção do trabalho",    cite: "Inspectie SZW",                href: "https://www.inspectieszw.nl/",                                         color: "text-gray-400" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] hover:opacity-80 transition-opacity">
                  <span className="text-gray-500">{s.label}:</span>
                  <span className={`font-bold ${s.color}`}>{s.cite} ↗</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §3  MONEY-LOSS FRAMING
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">
              Custos ocultos de trabalhar através de agências
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
              A maioria dos trabalhadores perde{" "}
              <span className="text-red-500">€300–€500 por mês</span>{" "}
              em descontos ocultos
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Estes descontos muitas vezes não são mencionados antes de assinares o contrato — e muitos são
              parcial ou totalmente ilegais. A maioria dos trabalhadores nunca chega a saber.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {HIDDEN_DEDUCTIONS.map((item) => (
              <div key={item.label}
                className="rounded-2xl border border-red-100 bg-red-50/30 p-5 hover:border-red-200 hover:bg-red-50/60 transition-colors">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-sm font-black text-gray-900 mb-1">{item.label}</h3>
                <p className="text-xs font-bold text-red-600 mb-2">{item.amount}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          {/* Comparison bar */}
          <div className="max-w-3xl mx-auto rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
            <div className="bg-gray-900 px-6 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Trabalhador WML · €14,71/h · 40h/semana · Alojamento + transporte da agência
              </p>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-600">O que a agência anuncia (bruto)</span>
                  <span className="text-sm font-black text-gray-900">€588/semana</span>
                </div>
                <div className="h-3 rounded-full bg-gray-200 w-full" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-600">Após imposto holandês (com deduções heffingskorting)</span>
                  <span className="text-sm font-black text-gray-700">€525/semana</span>
                </div>
                <div className="h-3 rounded-full bg-amber-300" style={{ width: "89%" }} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-red-700">O que realmente recebes no bolso</span>
                  <span className="text-sm font-black text-red-600">€345/semana</span>
                </div>
                <div className="h-3 rounded-full bg-red-400" style={{ width: "59%" }} />
              </div>
            </div>
            <div className="px-6 pb-4 flex items-center justify-between">
              <p className="text-[11px] text-gray-400">
                Descontos: €63 imposto + €95 alojamento + €35 seguro + €25 transporte + €25 taxas adm.{" "}
                <Link href="/methodology" className="text-blue-600 underline">Metodologia completa →</Link>
              </p>
              <a href="#lead-form"
                className="shrink-0 ml-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-5 py-2.5 text-xs font-black text-white active:scale-[0.98]">
                Encontra melhores ofertas
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §4  WORKER TESTIMONIALS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Trabalhadores reais. Palavras reais.
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              O que os trabalhadores nos disseram realmente
            </h2>
            <p className="text-xs text-gray-400 font-semibold">
              Não são materiais de marketing · Não é PR de agências · Relatórios reais de trabalhadores reais
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            {WORKER_TESTIMONIALS.map((t) => (
              <div key={t.name}
                className={`rounded-2xl border p-6 flex flex-col gap-4 ${
                  t.rating >= 4
                    ? "border-emerald-100 bg-emerald-50/30"
                    : "border-red-100 bg-red-50/20"
                }`}>
                <StarRating value={t.rating} />
                <blockquote className="text-sm text-gray-800 leading-relaxed font-medium italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <span className="text-2xl">{t.flag}</span>
                  <div>
                    <p className="text-xs font-black text-gray-900">{t.name}</p>
                    <p className="text-[11px] text-gray-500">{t.job}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/reviews"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-7 py-3.5 text-sm font-bold text-gray-700 shadow-sm">
              📋 Lê todas as {totalReviews} avaliações
            </Link>
            <Link href="/submit-review"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              ✍️ Partilha a tua experiência →
            </Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §5  LEAD FORM
          ════════════════════════════════════════════════════════════ */}
      <section id="lead-form" className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1.5">
                Combinação gratuita — sem taxas, sem compromisso
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                Encontra uma agência verificada que mostra os descontos reais
              </h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xl">
                <span className="font-semibold text-gray-700">Descontos transparentes</span> ·{" "}
                <span className="font-semibold text-gray-700">Alojamento verificado</span> ·{" "}
                <span className="font-semibold text-gray-700">Avaliações reais de trabalhadores</span>{" "}
                — combinamos-te apenas com agências que passaram nas nossas verificações.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {["Zero rankings pagos", "Conformidade com RGPD", "Combinação gratuita"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                  <span className="text-emerald-500">✓</span> {b}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 sm:p-7 shadow-sm">
            <HomepageLeadForm />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §6  SALARY CALCULATOR
          ════════════════════════════════════════════════════════════ */}
      <section id="calculator" className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Calculadora salarial — taxas fiscais holandesas 2026
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">
              Quanto te sobra realmente do salário?
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Ajusta à tua oferta. Impostos holandeses reais com todas as deduções heffingskorting.
              Cada desconto calculado em tempo real.
            </p>
          </div>

          <HomepageCalculator />

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §7  METHODOLOGY TRUST BLOCK
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

          <div className="text-center mb-8">
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Metodologia de cálculo</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Como calculamos o teu salário real</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
            {[
              {
                icon: "📊",
                title: "Imposto de renda holandês 2026",
                items: [
                  "Escalões loonheffing (2 níveis)",
                  "Algemene heffingskorting — até €3.362/ano de dedução",
                  "Arbeidskorting — até €5.000/ano de dedução",
                  "Taxa efetiva = imposto ÷ bruto (após todas as deduções)",
                ],
              },
              {
                icon: "🏠",
                title: "Lógica dos descontos de alojamento",
                items: [
                  "Alojamento da agência: €80–€120/sem. (norma SNF)",
                  "Alojamento próprio: €500–€900/mês (média regional)",
                  "Limite legal SNF: ~€113,50/sem. para quartos partilhados",
                  "Fonte: SNF Normering Flexwonen 2024",
                ],
              },
              {
                icon: "🚌",
                title: "Transporte e seguro",
                items: [
                  "Autocarro da agência: méd. €25/sem. (relatórios de trabalhadores)",
                  "Zorgverzekering: €152–€180/mês (mercado 2026)",
                  "Eigen risico próprio: méd. €33/mês",
                  "Taxas adm.: €0–€20/sem. (declarado pelas agências)",
                ],
              },
            ].map((block) => (
              <div key={block.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="text-2xl mb-3">{block.icon}</div>
                <h3 className="text-sm font-black text-gray-900 mb-3">{block.title}</h3>
                <ul className="space-y-1.5">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600 leading-snug">
                      <span className="text-emerald-500 font-black mt-0.5 shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">

            <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Pressupostos principais</p>
              <ul className="space-y-2 text-xs text-gray-700">
                {[
                  "Emprego principal na Holanda (sem aplicação de tratados de dupla tributação)",
                  "48 semanas de trabalho/ano (4 semanas de férias incluídas)",
                  "8% vakantiegeld (subsídio de férias) adicionado ao bruto conforme BW Art. 7:634",
                  "Trabalhador sem parceiro — sem deduções de parceiro ou cuidados de crianças",
                  "Seguro de saúde padrão (sem subsídios toeslagen)",
                  "WML 2026: €14,71/hora · Atualização: janeiro 2026",
                ].map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <span className="text-blue-500 font-black shrink-0 mt-0.5">✓</span>{a}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[10px] text-gray-400 leading-relaxed border-t border-blue-100 pt-3">
                <strong className="text-gray-500">Aviso legal:</strong> Os cálculos têm carácter exclusivamente informativo e não constituem aconselhamento fiscal, jurídico ou financeiro. As circunstâncias individuais podem variar. Consulta um belastingadviseur para a tua situação específica.{" "}
                <Link href="/methodology" className="text-blue-600 underline hover:text-blue-800">Metodologia completa →</Link>
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-gray-900 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Exemplo: Trabalhador WML · €14,71/h · 40h/sem. · Imposto real 2026
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {SALARY_ROWS.map((row) => (
                  <div key={row.label}
                    className={`flex items-center justify-between px-5 py-3 ${row.bold ? "bg-gray-900" : "bg-white"}`}>
                    <span className={`text-sm ${row.bold ? "font-black text-white" : "text-gray-600"}`}>{row.label}</span>
                    <span className={`text-sm font-bold ${row.bold ? `text-lg font-black ${row.green ? "text-emerald-400" : "text-red-400"}` : row.green ? "text-emerald-600" : "text-red-500"}`}>
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400">
                  Desconto −€63 (loonheffing real 2026 após deduções AHK+AK) + €95 alojamento + €25 transporte + €35 seguro + €25 adm.{" "}
                  <Link href="/methodology" className="text-blue-600 underline">Metodologia completa</Link>
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §8  SALARY PAIN → CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-surface-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            Agora conheces os números reais
          </p>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-4">
            Queres <span className="text-emerald-400">melhores condições</span> e
            mais dinheiro todas as semanas?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Nem todas as agências são iguais. Algumas têm taxas de alojamento mais baixas, recibos mais rápidos e contratos transparentes. Verificamos quais — e combinamos-te gratuitamente.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#lead-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
              Ver ofertas verificadas →
            </a>
            <Link href="/agencies-with-housing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-300 active:scale-[0.98]">
              Navega {housingCount} agências com alojamento
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            {["Zero rankings pagos", "Agências não podem comprar melhores avaliações", "Avaliações feitas exclusivamente por trabalhadores", "O estatuto de parceiro nunca influencia os resultados"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-emerald-500 font-black">✓</span>{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §8b  HOW AGENCYCHECK WORKS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">

          <div className="text-center mb-7">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
              Como funciona o AgencyCheck — e como ganhamos dinheiro
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Honestidade sobre como isto funciona
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: "📋",
                title: "O que faz o AgencyCheck",
                body: "Recolhemos avaliações de trabalhadores, analisamos recibos de vencimento e publicamos rankings independentes de agências de trabalho holandesas. Não recrutamos trabalhadores — ajudamos-te a fazer uma escolha informada.",
              },
              {
                icon: "💰",
                title: "Como ganhamos dinheiro",
                body: "Se usares o nosso serviço de combinação e fores contratado, a agência paga-nos uma comissão por encontrar o candidato. A taxa vem da agência — nunca de ti. Os trabalhadores pagam sempre zero.",
              },
              {
                icon: "⚖️",
                title: "Por que os rankings se mantêm justos",
                body: "As agências não podem pagar por melhor posição no ranking, remoção de avaliações ou influenciar as suas pontuações. As agências pagantes não obtêm vantagem na combinação. Apenas as avaliações dos trabalhadores determinam a sua posição.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white border border-gray-100 p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <p className="text-sm font-black text-gray-900 mb-2">{item.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 px-5 py-4">
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Divulgação de conflito de interesses:</strong> As agências parceiras no serviço de combinação não recebem avaliações mais altas nem posição preferencial nos resultados de pesquisa.
              Os nossos rankings são calculados exclusivamente com base em relatórios verificados de trabalhadores. Podes{" "}
              <Link href="/methodology" className="underline hover:text-amber-700">ler a nossa metodologia completa</Link>{" "}
              e{" "}
              <Link href="/reviews" className="underline hover:text-amber-700">navegar todas as avaliações sem filtro</Link>{" "}
              — incluindo as negativas — a qualquer momento.
            </p>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §9  WORKER PROBLEMS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">O que nenhuma agência te diz</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">Problemas comuns reportados por trabalhadores</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              Com base em {totalReviews}+ relatórios verificados de trabalhadores. Conhecer isto protege-te antes de assinar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {WORKER_PROBLEMS.map((p, i) => (
              <div key={p.title}
                className={`rounded-2xl border p-6 ${i === 0 ? "lg:col-span-1 border-red-100 bg-red-50/40" : "border-gray-100 bg-gray-50 hover:border-red-100 hover:bg-red-50/20 transition-colors"}`}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-base font-black text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{p.body}</p>
                <span className="inline-block text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1">
                  ⚠ {p.freq}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/reviews"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors px-7 py-3.5 text-sm font-bold text-gray-700 shadow-sm">
              📋 Lê as experiências reais de trabalhadores →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §10  HOUSING PROOF
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">
          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">Alojamento real — não brochuras</p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">Vê onde vais realmente viver</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Fotos e descrições enviadas por trabalhadores. Sem fotos de stock. Sem PR de agências.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
            <WorkerHousingStrip />
          </div>
          <div className="mt-6 text-center">
            <Link href="/agencies-with-housing"
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              Navega todas as {housingCount} agências com alojamento →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §11  VERIFIED AGENCY CARDS
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">

          <div className="text-center mb-9">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
              Agências verificadas por investigação
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3">
              Ofertas transparentes — rendimento líquido real mostrado
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed mb-4">
              Cada cartão mostra o rendimento líquido semanal estimado após imposto e descontos holandeses.
              Sem números brutos inflacionados.
            </p>
            <div className="inline-flex flex-wrap items-center justify-center gap-3 text-[10px] font-semibold border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5">
              <span className="text-gray-400 font-black uppercase tracking-wider">O que significam os emblemas:</span>
              <span className="inline-flex items-center gap-1 text-gray-500 bg-white border border-gray-200 rounded-full px-2.5 py-1">
                <span className="text-gray-400">👤</span> Reportado por trabalhador — apenas avaliações de trabalhadores
              </span>
              <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
                <span className="text-blue-400">🔍</span> Verificado por investigação — confirmado KvK + revisão de equipa
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                <span className="text-emerald-500">✓</span> Registado na SNA — certificado pela Stichting Normering Arbeid
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {housingAgencies.slice(0, 3).map((agency) => {
              const meta = VERIFIED_JOB_META[agency.slug];
              return (
                <div key={agency.slug}
                  className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col group">

                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                          {meta?.sector ?? "Serviços de trabalho"}
                        </span>
                        <h3 className="text-base font-black text-white leading-tight truncate">
                          {meta?.jobTitle ?? "Armazém / Produção"}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">📍 {agency.city}</p>
                      </div>
                      <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-blue-300 bg-blue-400/15 border border-blue-400/20 rounded-full px-2 py-1 whitespace-nowrap">
                        🔍 Verificado
                      </span>
                    </div>
                    <Link href={`/agencies/${agency.slug}`}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group-hover:underline">
                      {agency.name} →
                    </Link>
                  </div>

                  <div className="px-5 py-4 flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Taxa horária</p>
                        <p className="text-lg font-black text-gray-900">
                          €{(meta?.hourlyRate ?? 14.71).toFixed(2)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-center">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Est. líquido/sem.</p>
                        <p className="text-lg font-black text-emerald-700">
                          €{meta?.estNetWeekly ?? 316}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>🏠 Custo do alojamento</span>
                        <span className="font-bold text-gray-700">€{meta?.housingCost ?? 95}/sem.</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⭐ Avaliação dos trabalhadores</span>
                        <StarRating value={agency.avgSalaryRating ?? 3.5} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>⚡ Tempo de resposta</span>
                        <span className="font-bold text-gray-700">{meta?.responseTime ?? "< 24 horas"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
                    <ApplyBar
                      context={{
                        sourcePage:           "/pt",
                        sourceType:           "agency_page",
                        sourceLabel:          `PT Homepage agency card — ${agency.slug}`,
                        defaultAccommodation: true,
                      }}
                      ctaText="Envia candidatura"
                      buttonOnly
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-7">
            {housingAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} jobCount={getJobCountForAgency(agency.slug)} locale="pt" />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/agencies-with-housing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-4 text-sm font-black text-white shadow-sm">
              🏢 Todas as {housingCount} agências com alojamento
            </Link>
            <Link href="/agencies" className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              Todas as {totalAgencies} agências →
            </Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          §12  PAYSLIP TOOL CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 text-white border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/15 border border-amber-400/20 rounded-full px-3 py-1 mb-5">
                  ⚡ Ferramenta gratuita
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
                  A agência pagou-te a menos?
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  Envia o teu recibo de vencimento holandês (<em>loonstrook</em>) e verificamos cada item
                  face às tabelas fiscais oficiais de 2026 e normas CAO ABU/NBBU.
                </p>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  Verificamos: escalões fiscais corretos · deduções heffingskorting aplicadas ·
                  limites de desconto de alojamento SNF · prémios de horas extra · cálculo do vakantiegeld.
                </p>
                <Link href="/tools/payslip-checker"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 transition-colors px-7 py-3.5 text-sm font-black text-white shadow-sm shadow-amber-900/40 active:scale-[0.98]">
                  📄 Envia o recibo — verifica agora
                </Link>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">O que verificamos</p>
                <ul className="space-y-2.5">
                  {[
                    { ok: true,  label: "Escalões loonheffing corretos aplicados" },
                    { ok: true,  label: "Dedução heffingskorting calculada" },
                    { ok: true,  label: "Desconto de alojamento ≤ máximo SNF" },
                    { ok: true,  label: "Prémios de horas extra (100%, 125%, 150%)" },
                    { ok: true,  label: "Vakantiegeld ≥ 8% do salário bruto" },
                    { ok: false, label: "Descontos falsos ou taxas não explicadas" },
                  ].map((item) => (
                    <li key={item.label} className="flex items-center gap-3 text-sm">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.ok ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                        {item.ok ? "✓" : "✗"}
                      </span>
                      <span className="text-gray-300">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SEO CONTENT + CITY GRID
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Guia para trabalhadores</p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 leading-tight">
                Tudo o que precisas de saber antes de trabalhar na Holanda
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  O salário mínimo holandês (<em>Wettelijk Minimumloon</em>) é{" "}
                  <strong className="text-gray-900">€14,71/hora em 2026</strong> para trabalhadores
                  com 21+. Com 40 horas semanais dá exatamente €588/semana bruto
                  (€14,71 × 40 horas). Mas após imposto de renda holandês, alojamento da agência, seguro
                  de saúde e transporte, a maioria dos trabalhadores fica entre{" "}
                  <strong className="text-gray-900">€300–€370</strong> —
                  cerca de 50–63% do bruto, dependendo da agência.
                </p>
                <p>
                  Proteções legais importantes a conhecer: <strong className="text-gray-900">ABU / NBBU CAO</strong>{" "}
                  regula as taxas salariais, prémios de horas extra e remuneração de férias.
                  <strong className="text-gray-900"> SNF</strong> (Stichting Normering Flexwonen) define os descontos
                  máximos legais de alojamento. <strong className="text-gray-900">Inspectie SZW</strong> aplica todo o direito do trabalho.
                  O AgencyCheck verifica as agências face a todos os três.
                </p>
                <p>
                  A nossa{" "}
                  <Link href="/tools/real-income-calculator" className="text-blue-600 underline hover:text-blue-800">calculadora salarial</Link>{" "}
                  usa as tabelas fiscais oficiais de 2026 e inclui tanto a dedução <em>algemene heffingskorting</em> como a{" "}
                  <em>arbeidskorting</em> — deduções que podem poupar aos trabalhadores com salário baixo
                  €600–€700 por mês em impostos, que muitas agências não mencionam.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Acesso rápido</p>
              {[
                { icon: "💶", href: "/tools/real-income-calculator",        title: "Calculadora salarial completa",            desc: "Salário líquido com todas as deduções fiscais 2026" },
                { icon: "📄", href: "/tools/payslip-checker",               title: "Ferramenta de verificação de recibos",     desc: "Envia loonstrook e verifica erros" },
                { icon: "🏢", href: "/agencies",                            title: "Todas as agências na Holanda",              desc: `${totalAgencies} agências classificadas por avaliações de trabalhadores` },
                { icon: "🏠", href: "/agencies-with-housing",               title: "Trabalho com alojamento",                  desc: `${housingCount} agências verificadas com alojamento` },
                { icon: "⭐", href: "/reviews",                             title: "Avaliações de trabalhadores",              desc: `${totalReviews}+ avaliações anónimas reais` },
                { icon: "📋", href: "/work-in-netherlands-for-foreigners",  title: "Direitos e guia jurídico",                 desc: "ABU CAO, WML, SNF — explicados claramente" },
              ].map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors p-4 group">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug truncate">{item.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors ml-auto mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* City grid */}
          <div className="pt-8 border-t border-gray-100">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Navega ofertas de trabalho por cidade</p>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.slice(0, 18).map((c) => (
                <Link key={c.slug} href={`/jobs-in-${c.slug}`}
                  className="inline-flex items-center text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-full px-3 py-1.5 hover:border-blue-300 hover:text-blue-700 transition-colors">
                  💼 {c.name}
                </Link>
              ))}
              <Link href="/jobs-in-netherlands"
                className="inline-flex items-center text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors">
                🇳🇱 Todas as cidades →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-10">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-600">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Perguntas que os trabalhadores realmente fazem</h2>
          </div>
          <HomepageFAQ />
          <div className="mt-8 text-center">
            <Link href="/work-in-netherlands-for-foreigners"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              📖 Guia completo: Trabalho na Holanda →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA
          ════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-950 to-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-18 sm:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
              Conhece a verdade<br />antes de assinar.
            </h2>
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-4 max-w-lg mx-auto">
              {totalAgencies} agências. {totalReviews}+ avaliações de trabalhadores. Desagregações salariais reais.
              Zero rankings pagos. Criado para trabalhadores — não recrutadores.
            </p>
            <p className="text-xs text-blue-400 mb-9">
              ✓ Zero rankings pagos &nbsp;·&nbsp; ✓ Agências não podem comprar melhores avaliações &nbsp;·&nbsp;
              ✓ Avaliações feitas exclusivamente por trabalhadores &nbsp;·&nbsp; ✓ O estatuto de parceiro nunca influencia os resultados
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <a href="#lead-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/40 active:scale-[0.98]">
                Encontra oferta — gratuitamente →
              </a>
              <a href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 hover:bg-white/15 transition-colors px-8 py-4 text-base font-bold text-gray-200 active:scale-[0.98]">
                🧮 Calcula o meu salário
              </a>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-blue-400">
              <Link href="/agencies"                     className="hover:text-white transition-colors">Todas as agências</Link>
              <span className="text-blue-800">·</span>
              <Link href="/reviews"                      className="hover:text-white transition-colors">Avaliações de trabalhadores</Link>
              <span className="text-blue-800">·</span>
              <Link href="/agencies-with-housing"        className="hover:text-white transition-colors">Trabalho com alojamento</Link>
              <span className="text-blue-800">·</span>
              <Link href="/tools/real-income-calculator" className="hover:text-white transition-colors">Calculadora salarial</Link>
              <span className="text-blue-800">·</span>
              <Link href="/methodology"                  className="hover:text-white transition-colors">Metodologia</Link>
              <span className="text-blue-800">·</span>
              <Link href="/privacy"                      className="hover:text-white transition-colors">Privacidade</Link>
              <span className="text-blue-800">·</span>
              <Link href="/terms"                        className="hover:text-white transition-colors">Termos</Link>
            </nav>
          </div>
        </div>
      </section>

      {/* Sticky bar */}
      <HomepageStickyBar />

    </div>
  );
}
