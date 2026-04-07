import type { Metadata } from "next";
import Link from "next/link";
import { HOUSING_AGENCIES } from "@/lib/agencyEnriched";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Agências de Trabalho na Holanda 2026 — Avaliações, Rankings e Avisos",
  description:
    "Avaliações verificadas de agências de trabalho na Holanda. OTTO Workforce, Covebo, Randstad, Tempo-Team e mais de 150 outras. O que sobra depois de deduzir alojamento e impostos? Leia antes de assinar o contrato.",
  keywords: [
    "agência de trabalho Holanda avaliações",
    "agência de trabalho Holanda alojamento",
    "melhor agência de trabalho Holanda",
    "agência de trabalho legal Holanda",
    "agência de trabalho Holanda ranking",
    "avaliações agência de trabalho Holanda",
  ],
  alternates: {
    canonical: "https://agencycheck.io/pt/agencias-trabalho-holanda",
    languages: {
      "en":        "https://agencycheck.io/agencies",
      "pl":        "https://agencycheck.io/pl/agencje-pracy-holandia",
      "ro":        "https://agencycheck.io/ro/agentii-munca-olanda",
      "pt":        "https://agencycheck.io/pt/agencias-trabalho-holanda",
      "x-default": "https://agencycheck.io/agencies",
    },
  },
  openGraph: {
    title: "Agências de Trabalho na Holanda — Avaliações Verificadas de Trabalhadores 2026",
    description:
      "Compare mais de 150 agências de trabalho na Holanda. Quem fornece alojamento justo? Quem desconta demasiado? Avaliações reais, salários reais, avisos.",
    locale: "pt_PT",
  },
};

// ─── Top agencies for Portuguese workers ──────────────────────────────────────

const TOP_AGENCIES = [
  {
    slug:       "otto-workforce",
    name:       "OTTO Workforce",
    verdict:    "Maior agência para trabalhadores migrantes na Holanda",
    housing:    "Sim — OTTO Housing, dedução ~€95/semana",
    sector:     "Logística, armazém, produção",
    cities:     "Venray, Zwolle, Rotterdam, Amsterdam, 's-Hertogenbosch",
    score:      72,
    pros:       ["Certificado ABU e SNF", "Ampla rede de alojamento", "Boas condições de transporte"],
    cons:       ["Instalações grandes — pouca privacidade", "Lista de espera na época alta"],
    verdict_pt: "Opção sólida para a primeira viagem. Grande, de confiança, mas não a mais barata em deduções.",
  },
  {
    slug:       "covebo",
    name:       "Covebo",
    verdict:    "Agência certificada com ampla rede de cidades",
    housing:    "Sim — certificado SNF, ~€92/semana",
    sector:     "Logística, produção alimentar, armazém",
    cities:     "Helmond, Nieuwegein, Lelystad, Venlo, Utrecht, Eindhoven",
    score:      68,
    pros:       ["Certificado SNF e ABU", "Ativa em várias cidades", "Condições salariais transparentes"],
    cons:       ["Localizações de alojamento por vezes periféricas", "Comunicação limitada em português"],
    verdict_pt: "Boa alternativa à OTTO. Especialmente recomendada para trabalho na produção alimentar.",
  },
  {
    slug:       "randstad-nederland",
    name:       "Randstad Nederland",
    verdict:    "Maior agência de trabalho na Holanda em geral",
    housing:    "Limitado — principalmente para os próprios trabalhadores",
    sector:     "Logística, produção, escritório, TI",
    cities:     "A nível nacional — mais de 100 balcões",
    score:      65,
    pros:       ["Grande variedade de ofertas de emprego", "Marca de renome", "Contratação rápida"],
    cons:       ["Alojamento não é padrão", "Grandes diferenças entre balcões"],
    verdict_pt: "Boa agência se já tiver alojamento próprio ou procurar trabalho de escritório.",
  },
  {
    slug:       "tempo-team-amsterdam-uitzendbureau",
    name:       "Tempo-Team",
    verdict:    "Conhecida agência holandesa com boa reputação",
    housing:    "Raramente — depende da localização",
    sector:     "Logística, produção, comércio, escritório",
    cities:     "Amsterdam, Rotterdam, Eindhoven, Utrecht e outras",
    score:      63,
    pros:       ["Boas condições CAO", "Ampla oferta de emprego", "Recrutamento rápido"],
    cons:       ["Alojamento disponível apenas em projetos selecionados", "Menos apoio em língua portuguesa"],
    verdict_pt: "Agência geral sólida. Boa se souber holandês ou inglês.",
  },
  {
    slug:       "hobij",
    name:       "HOBIJ",
    verdict:    "Especialização: logística na região Den Haag–Rotterdam",
    housing:    "Sim — fornece alojamento para trabalhadores do estrangeiro",
    sector:     "Logística, armazém, produção",
    cities:     "Den Haag, Rotterdam, Delft, Zoetermeer",
    score:      58,
    pros:       ["Alojamento disponível", "Proximidade de grandes centros de distribuição"],
    cons:       ["Rede menor do que OTTO/Covebo", "Avaliações mistas"],
    verdict_pt: "Vale a pena verificar se quer trabalhar na região de Rotterdam ou Haia.",
  },
];

const FAQS = [
  {
    q: "Qual é a melhor agência de trabalho na Holanda para portugueses?",
    a: "A OTTO Workforce e a Covebo são as mais escolhidas por trabalhadores portugueses. Ambas oferecem alojamento, têm certificados ABU e SNF, e têm experiência com trabalhadores de Portugal. A OTTO é a maior, a Covebo oferece frequentemente condições de alojamento ligeiramente melhores.",
  },
  {
    q: "Quanto fica líquido depois de todas as deduções?",
    a: "Com WML (€14,71/h) e 40 horas semanais: bruto €588, menos imposto (~€63), alojamento (~€95), seguro (~€35) e transporte (~€25). Fica aproximadamente €345–€370 líquido por semana. Este é o intervalo real — não €588, como anunciam.",
  },
  {
    q: "A agência de trabalho na Holanda tem de ser certificada?",
    a: "As agências legais devem ter o certificado ABU ou NBBU (associações de agências de trabalho). O certificado SNF diz respeito às normas de alojamento. Verifique sempre se a agência consta no registo SNA ou ABU antes de assinar o contrato.",
  },
  {
    q: "A agência pode deduzir mais do que o acordado?",
    a: "Não — as deduções devem estar especificadas no contrato. O CAO para trabalhadores temporários (uitzendkrachten CAO) define as taxas máximas. Se a agência deduzir mais do que o acordado, pode apresentar uma queixa ao SNCU.",
  },
  {
    q: "O que fazer se a agência não pagar a tempo?",
    a: "Primeiro contacte diretamente a agência por escrito. Se não houver resposta — apresente uma queixa à FNV (fnv.nl) ou ao SNCU (sncu.nl). Têm aconselhamento gratuito para trabalhadores temporários.",
  },
  {
    q: "Posso mudar de agência depois de chegar?",
    a: "Sim. O contrato com a agência não o vincula para sempre. Verifique o período de aviso prévio no seu contrato (geralmente 1–2 semanas). Lembre-se que o alojamento está frequentemente ligado ao trabalho — mudar de agência pode significar ter de encontrar alojamento próprio.",
  },
];

export default function AgenciasTrabalhoPt() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",                   url: "/" },
    { name: "Português",              url: "/pt" },
    { name: "Agências de Trabalho",   url: "/pt/agencias-trabalho-holanda" },
  ]);
  const faqSchema = faqPageSchema(FAQS.map((f) => ({ question: f.q, answer: f.a })));

  const housingCount = HOUSING_AGENCIES.length;

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-surface-hero text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-gray-500 mb-5 flex items-center gap-1.5 flex-wrap">
            <Link href="/pt" className="hover:text-gray-300">AgencyCheck PT</Link>
            <span>/</span>
            <span className="text-gray-400">Agências de trabalho na Holanda</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Agências de Trabalho na Holanda<br className="hidden sm:block" /> — Avaliações e Rankings 2026
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            Comparámos mais de{" "}150 agências de trabalho na Holanda em termos de salários, condições de alojamento
            e avaliações de trabalhadores. Aqui encontrará informações reais — não as dos folhetos de recrutamento.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="bg-white/10 border border-white/10 rounded-full px-3 py-1.5">
              ✓ {housingCount} agências com alojamento
            </span>
            <span className="bg-white/10 border border-white/10 rounded-full px-3 py-1.5">
              ✓ Certificados ABU e SNF
            </span>
            <span className="bg-white/10 border border-white/10 rounded-full px-3 py-1.5">
              ✓ Valores atualizados 2026
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">

        {/* ── Important notice ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <p className="text-sm font-bold text-gray-900 mb-1.5">⚠️ Antes de assinar o contrato</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            A maioria dos anúncios indica o valor bruto. Depois de deduzir o alojamento (~€95/semana),
            seguro (~€35) e transporte (~€25), o seu salário líquido real é de
            <strong> aprox. €345–€380 por semana</strong> — não €500+ como sugerem os títulos.{" "}
            <Link href="/pt/salario-holanda" className="text-amber-700 underline font-semibold">
              Consulte a calculadora salarial →
            </Link>
          </p>
        </div>

        {/* ── Top agencies ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Agências de Trabalho Verificadas na Holanda
          </h2>
          <p className="text-sm text-gray-500 mb-7 leading-relaxed">
            As agências abaixo foram verificadas quanto a certificados, condições de alojamento
            e avaliações de trabalhadores. Começamos pelas maiores e mais recomendadas por trabalhadores portugueses.
          </p>

          <div className="space-y-6">
            {TOP_AGENCIES.map((ag, i) => (
              <div key={ag.slug} className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">#{i + 1}</span>
                      <h3 className="text-base font-black text-gray-900">{ag.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500">{ag.verdict}</p>
                  </div>
                  <div className="shrink-0 text-center">
                    <div className={`text-lg font-black rounded-xl px-3 py-1.5 ${
                      ag.score >= 70 ? "bg-green-50 text-green-700" :
                      ag.score >= 60 ? "bg-amber-50 text-amber-700" :
                      "bg-gray-50 text-gray-600"
                    }`}>
                      {ag.score}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">pontuação</p>
                  </div>
                </div>

                <div className="px-5 py-4 grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-gray-500 uppercase tracking-wide mb-1">Alojamento</p>
                    <p className="text-gray-700">{ag.housing}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 uppercase tracking-wide mb-1">Setores</p>
                    <p className="text-gray-700">{ag.sector}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="font-semibold text-gray-500 uppercase tracking-wide mb-1">Cidades ativas</p>
                    <p className="text-gray-700">{ag.cities}</p>
                  </div>
                </div>

                <div className="px-5 pb-4 grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="font-semibold text-green-800 mb-1.5">Pontos positivos</p>
                    <ul className="space-y-1">
                      {ag.pros.map((p) => (
                        <li key={p} className="text-green-700 flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0">✓</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="font-semibold text-red-800 mb-1.5">Pontos negativos</p>
                    <ul className="space-y-1">
                      {ag.cons.map((c) => (
                        <li key={c} className="text-red-700 flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0">✗</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-5 pb-5 flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-500 italic leading-relaxed max-w-sm">
                    {ag.verdict_pt}
                  </p>
                  <Link
                    href={`/agencies/${ag.slug}`}
                    className="shrink-0 text-xs font-bold text-brand-600 hover:text-brand-700 border border-brand-200 hover:border-brand-400 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    Perfil completo →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/pt"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 border border-gray-200 hover:border-gray-900 rounded-xl px-5 py-3 transition-colors"
            >
              Ver todas as 150+ agências →
            </Link>
          </div>
        </section>

        {/* ── Red flags ─────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">
            O Que Evitar — Sinais de Alerta
          </h2>
          <div className="space-y-3">
            {[
              {
                flag: "A agência não tem certificado ABU ou NBBU",
                detail: "Verifique em abu.nl ou nbbu.nl. Sem certificado = sem garantia de CAO e salário mínimo.",
              },
              {
                flag: "Não pode ver as condições de alojamento antes de assinar",
                detail: "Uma agência legal mostrará fotos e descrição do alojamento com antecedência. Se recusarem — saia.",
              },
              {
                flag: "As deduções não estão especificadas no contrato",
                detail: "Cada dedução (alojamento, seguro, transporte) tem de constar no contrato. 'Custos administrativos' genéricos são um sinal de alerta.",
              },
              {
                flag: "A agência pede uma taxa de recrutamento",
                detail: "Ilegal na Holanda. A agência ganha na margem do empregador — o trabalhador nunca deve pagar pelo emprego.",
              },
              {
                flag: "Alojamento ligado a uma única localização de trabalho",
                detail: "Se for obrigado a viver APENAS onde a agência o coloca, pode perder o teto ao mudar de emprego. Pergunte sempre sobre as condições.",
              },
            ].map((item) => (
              <div key={item.flag} className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/30 p-4">
                <span className="text-red-500 text-base shrink-0 mt-0.5">⛔</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">{item.flag}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-5">
            Perguntas Frequentes sobre Agências de Trabalho na Holanda
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
            { href: "/pt/salario-holanda",          label: "Calculadora de salário líquido", icon: "💶" },
            { href: "/pt/trabalho-com-alojamento",  label: "Trabalho com alojamento",        icon: "🏠" },
            { href: "/pt",                          label: "Página inicial PT",              icon: "🇵🇹" },
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
