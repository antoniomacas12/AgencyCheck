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
  title: "Агенция за труд Нидерландия — Проверени отзиви, заплати и жилище 2026",
  description:
    "Сравнете 150+ агенции за труд в Нидерландия. Реална нетна заплата след приспадане на жилище, застраховка и транспорт. Отзиви от работници, жилищни условия и класации. Преди подписване — проверете тук.",
  alternates: {
    canonical: "https://agencycheck.io/bg",
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
    title: "Агенция за труд Нидерландия — Отзиви, заплати и жилище 2026",
    description:
      "Реални разбивки на заплатите, снимки на жилища и отзиви от работници за 150+ агенции за труд в Нидерландия. Разберете истината, преди да подпишете.",
    locale: "bg_BG",
  },
};

export const dynamic = "force-dynamic";

const SALARY_ROWS = [
  { label: "Брутна заплата (WML €14,71 × 40ч)", amount: "+€588", green: true,  bold: false },
  { label: "Данъци и осигуровки (loonheffing)",  amount: "−€63",  green: false, bold: false },
  { label: "Жилище от агенцията (норма SNF)",    amount: "−€95",  green: false, bold: false },
  { label: "Здравна застраховка",                amount: "−€35",  green: false, bold: false },
  { label: "Транспорт (автобус на агенцията)",   amount: "−€25",  green: false, bold: false },
  { label: "Административни такси",              amount: "−€25",  green: false, bold: false },
  { label: "💶 Задържате",                      amount: "€345",  green: true,  bold: true  },
] as const;

const WORKER_PROBLEMS = [
  { icon: "💸", title: "Скрити удръжки от заплатата", freq: "68% от работниците",
    body: "Жилище, застраховка, транспорт и административни такси, приспаднати директно от брутото — често без обяснение във фиша." },
  { icon: "⏱", title: "Незаплатени извънредни часове", freq: "41% от работниците",
    body: "Отработените часове не се появяват на фиша. Цели уикенди и неделни надбавки просто изчезват." },
  { icon: "🏠", title: "Пренаселено жилище",           freq: "34% от работниците",
    body: "4 души в стая за 2. Плащане на €95+/седмица за такива условия нарушава жилищните норми SNF." },
  { icon: "📄", title: "Неясен договор",                freq: "39% от работниците",
    body: "Договори само на нидерландски, необяснени условия. Удръжки добавени след подписване, отсъстващи в оригиналната оферта." },
  { icon: "🚌", title: "Транспортни измами",            freq: "29% от работниците",
    body: "Начисляват €25–€40/седмица за автобуси, ненадеждни или препълнени. Някои агенции начисляват такса дори когато пътувате сами." },
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

export default async function BgHomePage() {
  const t             = await getT("bg");
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
            🇧🇬 Български · {totalAgencies} агенции · {housingCount} с жилище · Без спонсорство
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
              <AgencyCard key={agency.slug} agency={agency} locale="bg" />
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
        context={{ sourcePage: "/bg", sourceType: "general_apply" }}
        showInline
        inlineLabel={t("apply_bar.headline")}
      />

      <HomepageLeadForm />
      <HomepageStickyBar />
    </>
  );
}
