import type { Metadata } from "next";
import Link from "next/link";
import nDynamic from "next/dynamic";
import AgencyCard from "@/components/AgencyCard";
import ApplyBar from "@/components/ApplyBar";
import { AGENCIES, AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import { getPublishedReviewStats } from "@/lib/reviewStats";
import { getT } from "@/lib/i18n";

const HomepageLeadForm  = nDynamic(() => import("@/components/HomepageLeadForm"),  { ssr: false });
const HomepageStickyBar = nDynamic(() => import("@/components/HomepageStickyBar"), { ssr: false });

export const metadata: Metadata = {
  title: "Agentúra práce Holandsko — Overené hodnotenia, zárobky a ubytovanie 2026",
  description:
    "Porovnajte 150+ agentúr práce v Holandsku. Reálny čistý príjem po odpočítaní ubytovanie, poistenia a dopravy. Hodnotenia pracovníkov, podmienky ubytovania a rebríčky. Pred podpisom — skontrolujte tu.",
  alternates: {
    canonical: "https://agencycheck.io/sk",
    languages: {
      "en":        "https://agencycheck.io/",
      "pl":        "https://agencycheck.io/pl",
      "ro":        "https://agencycheck.io/ro",
      "pt":        "https://agencycheck.io/pt",
      "sk":        "https://agencycheck.io/sk",
      "bg":        "https://agencycheck.io/bg",
      "x-default": "https://agencycheck.io/",
    },
  },
  openGraph: {
    title: "Agentúra práce Holandsko — Hodnotenia, zárobky a ubytovanie 2026",
    description:
      "Reálne výplatné pásky, fotky ubytovní a hodnotenia pracovníkov pre 150+ agentúr práce v Holandsku. Spoznajte pravdu skôr, ako podpíšete.",
    locale: "sk_SK",
  },
};

export const dynamic = "force-dynamic";

const SALARY_ROWS = [
  { label: "Hrubá mzda (WML €14,71 × 40h)", amount: "+€588", green: true,  bold: false },
  { label: "Daň a odvody (loonheffing)",       amount: "−€63",  green: false, bold: false },
  { label: "Ubytovanie agentúry (norma SNF)",  amount: "−€95",  green: false, bold: false },
  { label: "Zdravotné poistenie",              amount: "−€35",  green: false, bold: false },
  { label: "Doprava (autobus agentúry)",       amount: "−€25",  green: false, bold: false },
  { label: "Administratívne poplatky",         amount: "−€25",  green: false, bold: false },
  { label: "💶 Zostáva vám",                  amount: "€345",  green: true,  bold: true  },
] as const;

const WORKER_PROBLEMS = [
  { icon: "💸", title: "Skryté zrážky z výplaty",     freq: "68% pracovníkov",
    body: "Ubytovanie, poistenie, doprava a administratívne poplatky odpočítané priamo z brutto — často bez vysvetlenia na výplatnej páske." },
  { icon: "⏱", title: "Nezaplatené nadčasy",          freq: "41% pracovníkov",
    body: "Odpracované hodiny sa neobjavujú na výplate. Celé víkendy a príplatky za nedele jednoducho miznú." },
  { icon: "🏠", title: "Preplnené ubytovanie",        freq: "34% pracovníkov",
    body: "4 osoby v izbe určenej pre 2. Platenie €95+/týždeň za takéto podmienky porušuje normy ubytovania SNF." },
  { icon: "📄", title: "Nejasná zmluva",              freq: "39% pracovníkov",
    body: "Zmluvy len v holandčine, nevysvetlené podmienky. Zrážky pridané po podpise, ktoré neboli v pôvodnej ponuke." },
  { icon: "🚌", title: "Podvody s dopravou",          freq: "29% pracovníkov",
    body: "Účtovaných €25–€40/týždeň za autobusy, ktoré sú nespoľahlivé alebo preplnené. Niektoré agentúry účtujú poplatek aj keď dochádzate samostatne." },
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

export default async function SkHomePage() {
  const t            = await getT("sk");
  const totalAgencies = AGENCIES.length;
  const housingCount  = AGENCIES_WITH_HOUSING.length;
  const reviewStats   = await getPublishedReviewStats();
  const totalReviews  = reviewStats.total || 111;

  const topAgencies = AGENCIES_WITH_HOUSING.slice(0, 6);

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
            🇸🇰 Slovenčina · {totalAgencies} agentúr · {housingCount} s ubytovaním · Bez sponzorstva
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            {t("homepage.hero_gross")}
            <br />
            <span className="text-brand-300">{t("homepage.hero_net")}</span>
          </h1>
          <p className="text-brand-200 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {t("homepage.hero_sub")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/jobs-with-accommodation"
              className="px-6 py-3 bg-white text-brand-900 rounded-xl font-bold text-sm hover:bg-brand-50 transition shadow-sm">
              {t("homepage.cta_housing")}
            </Link>
            <Link href="/tools/real-income-calculator"
              className="px-6 py-3 bg-brand-700 border border-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-600 transition">
              {t("homepage.cta_salary")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── REALITY CHECK ────────────────────────────────────────────────────── */}
      <section className="bg-amber-50 border-y border-amber-200 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3">
            {t("homepage.reality_label")}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t("homepage.reality_headline")}</h2>
          <p className="text-sm text-gray-600 mb-6">{t("homepage.reality_sub")}</p>

          <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
            {SALARY_ROWS.map((row, i) => (
              <div key={i}
                className={`flex items-center justify-between px-4 py-3 text-sm border-b border-gray-100 last:border-0 ${row.bold ? "bg-green-50" : ""}`}>
                <span className={row.bold ? "font-bold text-gray-900" : "text-gray-700"}>{row.label}</span>
                <span className={`font-bold tabular-nums ${row.green ? "text-green-700" : "text-red-600"}`}>
                  {row.amount}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link href="/tools/real-income-calculator"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900">
              🧮 {t("homepage.reality_cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">{t("homepage.section_trust")}</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: "💰", title: t("homepage.trust_1_title"), desc: t("homepage.trust_1_desc") },
              { icon: "⭐", title: t("homepage.trust_2_title"), desc: t("homepage.trust_2_desc") },
              { icon: "📸", title: t("homepage.trust_3_title"), desc: t("homepage.trust_3_desc") },
            ].map((item, i) => (
              <div key={i} className="text-center p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKER PROBLEMS ──────────────────────────────────────────────────── */}
      <section className="px-4 py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">{t("homepage.common_issues_title")}</p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t("homepage.common_issues_subtitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {WORKER_PROBLEMS.map((prob, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-xl shrink-0">{prob.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{prob.title}</p>
                    <p className="text-xs text-red-600 font-medium">{prob.freq}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{prob.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-900 text-white px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-black">{totalAgencies}+</p>
              <p className="text-xs text-brand-300 mt-1">{t("homepage.stats_agencies")}</p>
            </div>
            <div>
              <p className="text-3xl font-black">{totalReviews}+</p>
              <p className="text-xs text-brand-300 mt-1">{t("homepage.stats_reviews")}</p>
            </div>
            <div>
              <p className="text-3xl font-black">{housingCount}</p>
              <p className="text-xs text-brand-300 mt-1">{t("homepage.stats_housing")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP AGENCIES ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
            {t("agencies.heading")}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t("agencies.subheading")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {topAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} locale="sk" />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/agencies"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-700 text-white rounded-xl text-sm font-bold hover:bg-brand-800 transition">
              {t("common.see_all_agencies")} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WORKER TOOLS ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
            {t("homepage.worker_tools_title")}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t("homepage.worker_tools_subtitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { href: "/tools/real-income-calculator", icon: "🧮", label: t("footer.real_income_calc") },
              { href: "/tools/salary-calculator",       icon: "💶", label: t("footer.salary_calc") },
              { href: "/tools/payslip-checker",          icon: "📋", label: t("footer.payslip_checker") },
              { href: "/tools/shift-tracker",            icon: "📅", label: t("footer.shift_tracker") },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href}
                className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-brand-200 transition">
                <span className="text-2xl shrink-0">{tool.icon}</span>
                <span className="text-sm font-semibold text-gray-800">{tool.label}</span>
                <span className="ml-auto text-brand-500">→</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/tools" className="text-sm font-semibold text-brand-700 hover:underline">
              {t("common.view_all")} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────────── */}
      <section className="px-4 py-12 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("homepage.about_section_title")}</h2>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              t("homepage.about_badges_worker_data"),
              t("homepage.about_badges_not_advertising"),
              t("homepage.about_badges_worker_reported"),
              t("homepage.about_badges_independent"),
            ].map((b) => (
              <span key={b} className="text-xs bg-brand-50 text-brand-700 rounded-full px-3 py-1 font-medium border border-brand-100">
                {b}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{t("homepage.about_text_1")}</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{t("homepage.about_text_2")}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{t("homepage.about_text_3")}</p>
        </div>
      </section>

      {/* ── APPLY BAR ────────────────────────────────────────────────────────── */}
      <ApplyBar
        context={{ sourcePage: "/sk", sourceType: "general_apply" }}
        showInline
        inlineLabel={t("apply_bar.headline")}
      />

      <HomepageLeadForm />
      <HomepageStickyBar />
    </>
  );
}
