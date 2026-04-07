import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemaMarkup";

export const metadata: Metadata = {
  title: "Salário na Holanda Líquido 2026 — Quanto Sobra Realmente após Deduções",
  description:
    "Calculadora de salário líquido na Holanda 2026. WML €14,71/hora. Quanto sobra depois de deduzir alojamento, imposto, seguro e transporte? Valores reais por tipo de trabalho: armazém, produção, estufa.",
  keywords: [
    "salário Holanda líquido",
    "quanto se ganha na Holanda",
    "salário mínimo Holanda 2026",
    "salário Holanda armazém",
    "calculadora salário Holanda",
    "quanto sobra do salário na Holanda",
    "salário líquido Holanda agência",
  ],
  alternates: {
    canonical: "https://agencycheck.io/pt/salario-holanda",
    languages: {
      "en":        "https://agencycheck.io/real-salary-netherlands-agency-work",
      "pl":        "https://agencycheck.io/pl/zarobki-holandia",
      "ro":        "https://agencycheck.io/ro/salariu-olanda",
      "pt":        "https://agencycheck.io/pt/salario-holanda",
      "x-default": "https://agencycheck.io/real-salary-netherlands-agency-work",
    },
  },
  openGraph: {
    title: "Salário Holanda Líquido 2026 — Calculadora e Valores Reais",
    description:
      "Salário bruto vs líquido na Holanda. O que fica realmente depois de deduzir alojamento, imposto e transporte? Verifique antes de partir.",
    locale: "pt_PT",
  },
};

const BREAKDOWN_ROWS = [
  { label: "Salário bruto (WML €14,71 × 40h)",        amount: "+€588", color: "text-green-700",  bg: "bg-green-50"  },
  { label: "Imposto sobre rendimento (loonheffing ~10%)", amount: "−€63",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "Alojamento da agência (norma SNF)",         amount: "−€95",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "Seguro de saúde (zorgverzekering)",         amount: "−€35",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "Transporte (autocarro da agência)",          amount: "−€25",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "Taxas administrativas",                     amount: "−€25",  color: "text-red-600",   bg: "bg-red-50"    },
  { label: "💶 Sobra-lhe por semana",                  amount: "€345",  color: "text-green-800", bg: "bg-green-100" },
];

const JOB_COMPARISON = [
  { job: "Trabalhador de armazém",    rate: "€14,71",       gross_weekly: "€588",      net_weekly: "~€345–€365", housing: "Geralmente disponível" },
  { job: "Trabalhador de produção",   rate: "€14,71–€15,50", gross_weekly: "€588–€620", net_weekly: "~€350–€380", housing: "Geralmente disponível" },
  { job: "Trabalhador de estufa",     rate: "€14,71",       gross_weekly: "€588",      net_weekly: "~€340–€360", housing: "Sazonal"               },
  { job: "Condutor de reach truck",   rate: "€15,50–€17,00", gross_weekly: "€620–€680", net_weekly: "~€380–€420", housing: "Menos frequente"       },
  { job: "Operador de empilhadora",   rate: "€16,00–€18,00", gross_weekly: "€640–€720", net_weekly: "~€390–€440", housing: "Raramente"             },
];

const FAQS = [
  {
    q: "Qual é o salário mínimo na Holanda em 2026?",
    a: "O salário mínimo por hora (WML) em 2026 é €14,71 bruto. Com 40 horas semanais, isso corresponde a €588 bruto por semana. Depois de deduzir o imposto (aprox. 10% para salários baixos) e os custos de alojamento — sobram aprox. €345–€380 líquido por semana.",
  },
  {
    q: "A agência pode descontar alojamento do meu salário?",
    a: "Sim, mas apenas se isso estiver previsto no contrato e de acordo com os valores SNF (Stichting Normering Flexwonen). O valor máximo de alojamento SNF é aprox. €105–€115 por semana dependendo do padrão. Verifique o contrato antes de assinar.",
  },
  {
    q: "Quanto fico por mês a trabalhar através de uma agência na Holanda?",
    a: "Com WML e 40h/semana: aprox. €1.380–€1.520 líquido por mês depois de todas as deduções. Isto pressupõe alojamento ~€95, seguro ~€35 e transporte ~€25 por semana. Sem alojamento da agência, pode ganhar aprox. €1.600–€1.750 líquido por mês.",
  },
  {
    q: "O que é o loonheffing?",
    a: "Loonheffing é o imposto holandês sobre o rendimento retido diretamente pelo empregador. Com o salário WML e sem deduções fiscais, corresponde a aprox. 8–12% do bruto. Pode solicitar o reembolso do imposto pago em excesso ao submeter a declaração anual (aangifte inkomstenbelasting).",
  },
  {
    q: "Como verificar se o meu salário está correto?",
    a: "Peça à agência o recibo de vencimento detalhado (loonstrook). Cada dedução tem de estar listada separadamente. Pode verificar a correção em mijnloon.nl ou contactar a FNV (fnv.nl) se algo não coincidir com o contrato.",
  },
  {
    q: "Posso deduzir algo ao imposto a trabalhar na Holanda através de uma agência?",
    a: "Sim. Pode solicitar a heffingskorting (desconto fiscal) e a arbeidskorting (desconto de trabalho). Muitas agências aplicam-nos automaticamente. Após o final do ano fiscal, pode submeter a declaração e recuperar o excesso — especialmente se trabalhou apenas parte do ano.",
  },
];

export default function SalarioHolanda() {
  const crumbSchema = breadcrumbSchema([
    { name: "Home",               url: "/" },
    { name: "Português",          url: "/pt" },
    { name: "Salário na Holanda", url: "/pt/salario-holanda" },
  ]);
  const faqSchema = faqPageSchema(FAQS.map((f) => ({ question: f.q, answer: f.a })));

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
            <span className="text-gray-400">Salário na Holanda líquido</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Quanto Ganha Realmente<br className="hidden sm:block" /> na Holanda? — 2026
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-6">
            Os anúncios dizem €14,71–€17/hora. Mas essa é a taxa bruta, antes de todas as deduções.
            Abaixo encontrará a divisão real — o que desse valor entra efetivamente na sua conta.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2 text-emerald-300 text-sm font-bold">
            💶 Salário líquido real: ~€345–€380/semana com WML
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">

        {/* ── Breakdown ─────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Divisão do Salário — O Que Sobra Líquido
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Exemplo: armazém ou produção, 40 horas semanais, alojamento na agência, WML 2026.
          </p>

          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            {BREAKDOWN_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i < BREAKDOWN_ROWS.length - 1 ? "border-b border-gray-50" : `${row.bg} border-t border-green-200`
                } ${i === BREAKDOWN_ROWS.length - 1 ? "py-4" : ""}`}
              >
                <span className={`text-sm ${i === BREAKDOWN_ROWS.length - 1 ? "font-black text-gray-900" : "text-gray-700"}`}>
                  {row.label}
                </span>
                <span className={`text-sm font-black tabular-nums ${row.color}`}>
                  {row.amount}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            * Valores indicativos para 2026. Transporte e administração dependem da agência e da localização.
            O alojamento SNF pode ser €88–€115 dependendo do padrão das instalações.
          </p>
        </section>

        {/* ── Without housing ───────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-3">
            E sem alojamento da agência?
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Se tiver alojamento próprio ou arrendado de forma privada, o seu líquido semanal aumenta ~€95 para cerca de
            <strong className="text-gray-900"> €430–€460/semana</strong> (€1.720–€1.840 por mês).
            Encontrar alojamento privado na Holanda é difícil — especialmente fora das grandes cidades —
            mas pode ser mais vantajoso a longo prazo.
          </p>
          <Link
            href="/pt/trabalho-com-alojamento"
            className="text-sm font-bold text-blue-700 hover:text-blue-800"
          >
            Comparar agências com alojamento →
          </Link>
        </section>

        {/* ── Job comparison ────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-5">
            Salário Líquido por Tipo de Trabalho
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Função</th>
                  <th className="text-right px-4 py-3 font-semibold">Taxa/hora</th>
                  <th className="text-right px-4 py-3 font-semibold">Bruto/semana</th>
                  <th className="text-right px-4 py-3 font-semibold">Líquido/semana</th>
                  <th className="text-right px-4 py-3 font-semibold">Alojamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {JOB_COMPARISON.map((row) => (
                  <tr key={row.job} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.job}</td>
                    <td className="px-4 py-3 text-right text-gray-700 tabular-nums">{row.rate}</td>
                    <td className="px-4 py-3 text-right text-gray-700 tabular-nums">{row.gross_weekly}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-700 tabular-nums">{row.net_weekly}</td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">{row.housing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2.5">
            Os valores líquidos pressupõem alojamento da agência. Taxas mais elevadas (reach truck, empilhadora)
            exigem carta de condução atualizada.
          </p>
        </section>

        {/* ── Tips ──────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">
            Como Verificar se o Seu Salário Está Correto
          </h2>
          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "Peça o recibo de vencimento (loonstrook)",
                text: "Cada agência é obrigada a emitir um recibo de vencimento detalhado. Cada dedução tem de estar listada separadamente — sem 'custos administrativos' genéricos.",
              },
              {
                step: "2",
                title: "Verifique a taxa base",
                text: "A taxa horária não pode ser inferior ao WML: €14,71 bruto/hora (2026). Se a sua taxa for inferior — é ilegal.",
              },
              {
                step: "3",
                title: "Verifique as deduções de alojamento",
                text: "A taxa máxima SNF de alojamento é aprox. €105–€115 por semana. Se a agência descontar mais — pode apresentar uma queixa ao SNCU.",
              },
              {
                step: "4",
                title: "Submeta a declaração de IRS após o ano",
                text: "Muitas pessoas a trabalhar através de agências pagam imposto em excesso. Após o final do ano fiscal, submeta a aangifte inkomstenbelasting — pode recuperar várias centenas de euros.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 rounded-xl border border-gray-100 p-4">
                <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">{item.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-5">
            Perguntas Frequentes sobre Salários na Holanda
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
            { href: "/pt/agencias-trabalho-holanda", label: "Avaliações de agências",    icon: "🏢" },
            { href: "/pt/trabalho-com-alojamento",   label: "Trabalho com alojamento",   icon: "🏠" },
            { href: "/pt",                           label: "Página inicial PT",          icon: "🇵🇹" },
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
