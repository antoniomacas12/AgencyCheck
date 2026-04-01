import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/lib/i18n";
import SmartSearch from "@/components/SmartSearch";
import AgencyCard from "@/components/AgencyCard";
import RealSalaryBlock from "@/components/RealSalaryBlock";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import { AGENCIES, AGENCIES_WITH_HOUSING } from "@/lib/agencyData";
import { TOP_CITIES } from "@/lib/seoData";
import { getLatestReviews, REVIEW_SEED_DATA } from "@/lib/reviewData";
import { getJobCountForAgency } from "@/lib/jobData";
import type { SearchSuggestion } from "@/components/SmartSearch";

export const metadata: Metadata = {
  title: "AgencyCheck — Praca z Zakwaterowaniem w Holandii — Realne Zarobki",
  description:
    "Znajdź pracę z zakwaterowaniem w Holandii. Sprawdź realne zarobki netto po odliczeniu kosztów mieszkania, podatku i transportu. Agencje pracy — opinie pracowników.",
  alternates: {
    canonical: "https://agencycheck.io/pl",
    languages: {
      "en":        "https://agencycheck.io/",
      "pl":        "https://agencycheck.io/pl",
      "ro":        "https://agencycheck.io/ro",
      "x-default": "https://agencycheck.io/",
    },
  },
  openGraph: {
    title: "AgencyCheck — Praca z Zakwaterowaniem Holandia — Realne Zarobki",
    description:
      "Zarobki brutto kontra netto, zdjęcia zakwaterowania i opinie pracowników dla 150+ agencji pracy w Holandii. Sprawdź prawdę zanim przyjedziesz.",
    locale: "pl_PL",
  },
};

const TOP_EMPLOYER_SLUGS = [
  "tempo-team-amsterdam-uitzendbureau",
  "randstad-nederland",
  "otto-workforce",
  "covebo",
];

export default async function PlHomePage() {
  const t = await getT("pl");

  const housingCount = AGENCIES_WITH_HOUSING.length;
  const totalReviews = REVIEW_SEED_DATA.length;

  // Top 6 agencies for housing (sorted by housing + review count)
  const housingAgencies = [...AGENCIES_WITH_HOUSING]
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, 6);

  // Top 8 agencies overall
  const topAgencies = [...AGENCIES].sort((a, b) => {
    const aPriority = TOP_EMPLOYER_SLUGS.indexOf(a.slug);
    const bPriority = TOP_EMPLOYER_SLUGS.indexOf(b.slug);
    if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;
    return (getJobCountForAgency(b.slug) ?? 0) - (getJobCountForAgency(a.slug) ?? 0);
  }).slice(0, 6);

  // Search suggestions
  const searchSuggestions: SearchSuggestion[] = [
    ...AGENCIES.map((a) => ({
      type: "agency" as const,
      label: a.name,
      sublabel: a.city,
      href: `/agencies/${a.slug}`,
    })),
    ...TOP_CITIES.slice(0, 10).map((c) => ({
      type: "city" as const,
      label: c.name,
      sublabel: c.region,
      href: `/cities/${c.slug}`,
    })),
  ];

  const latestReviews = getLatestReviews(3);

  return (
    <div>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white pt-10 pb-8 px-4">
        <div className="max-w-3xl mx-auto text-center">

          <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs font-medium mb-5">
            🇳🇱 Holandia · {housingCount} agencji z zakwaterowaniem · Platforma niezależna
          </div>

          <h1 className="text-2xl sm:text-4xl font-black leading-tight mb-4">
            {t("homepage.hero_gross").replace("€600/week", "")}<span className="text-green-400">€600 tygodniowo</span>.<br className="hidden sm:block" />
            <span className="text-red-400">{t("homepage.hero_net")}</span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base mb-7 max-w-xl mx-auto leading-relaxed">
            Zakwaterowanie od agencji to <strong className="text-white">nie prezent — odliczają je z pensji</strong>.
            Do tego podatek, transport i ubezpieczenie zdrowotne.
            Większość pracowników dowiaduje się dopiero po przyjeździe. Sprawdź liczby teraz.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-7">
            <Link href="/pl/praca-z-zakwaterowaniem"
              className="bg-green-600 hover:bg-green-500 text-white text-sm font-black px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-green-900/40">
              🏠 Znajdź pracę z zakwaterowaniem
            </Link>
            <Link href="/tools/real-income-calculator"
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-7 py-3.5 rounded-xl transition-colors border border-white/15">
              💶 Oblicz realne zarobki
            </Link>
          </div>

          <SmartSearch suggestions={searchSuggestions} size="large" placeholder="Szukaj agencji, miasta lub stanowiska..." />

          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {[
              { href: "/pl/praca-z-zakwaterowaniem",  label: "🏠 Praca z zakwaterowaniem" },
              { href: "/agencies-with-housing",        label: "🏢 Agencje z mieszkaniem"   },
              { href: "/jobs/forklift-driver",          label: "🚜 Wózek widłowy"           },
              { href: "/jobs/warehouse-worker",         label: "🏭 Pracownik magazynu"      },
              { href: "/work-in-netherlands-for-foreigners", label: "🌍 Dla obcokrajowców" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="bg-white/8 hover:bg-white/15 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full transition-colors border border-white/8">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ REALITY CHECK BLOCK ═══════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white px-4 py-6 border-y-2 border-red-700">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-[11px] font-bold uppercase tracking-widest text-red-300 mb-2">
                ⚠️ Sprawdź fakty — Holandia 2026
              </p>
              <p className="text-lg sm:text-xl font-black text-white leading-snug mb-1">
                Szukasz <span className="text-green-300">pracy z zakwaterowaniem w Holandii</span>?
              </p>
              <p className="text-2xl sm:text-3xl font-black text-white">
                Realne zarobki: <span className="text-red-300">€280–€380/tydzień</span> po odliczeniach
              </p>
              <p className="text-sm text-red-200 mt-2 leading-relaxed">
                Zakwaterowanie odliczane · podatek · ubezpieczenie · transport. Przy €15/h · 40 h tygodniowo.{" "}
                <strong className="text-white">Większość pracowników przekonuje się o tym na pierwszej wypłacie.</strong>
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-center gap-2">
              <Link href="/tools/real-income-calculator"
                className="bg-white text-red-800 text-sm font-black px-6 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-lg whitespace-nowrap">
                Oblicz SWOJE realne zarobki →
              </Link>
              <p className="text-[10px] text-red-300">Bezpłatnie · 30 sekund</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* ══ HOW IT WORKS ════════════════════════════════════════════════════ */}
        <section>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
            Jak to działa
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: "💶",
                title: "Realne zarobki",
                desc: "Zarobki brutto kontra to, co faktycznie zostaje po odliczeniu zakwaterowania, podatku i transportu.",
              },
              {
                icon: "⭐",
                title: "Tylko opinie pracowników",
                desc: "Anonimowe opinie od ludzi, którzy tam pracowali. Zero marketingu agencji. Nie możemy być opłacani za usuwanie opinii.",
              },
              {
                icon: "📷",
                title: "Zdjęcia zakwaterowania",
                desc: "Prawdziwe zdjęcia przesłane przez pracowników, którzy mieszkali w tych miejscach. Nie oficjalne zdjęcia agencji.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <span className="text-3xl block mb-3">{item.icon}</span>
                <p className="font-black text-gray-900 mb-1.5">{item.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ REAL SALARY BLOCK ═══════════════════════════════════════════════ */}
        <section>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-900 text-gray-400 rounded-full px-2.5 py-1">📊 Dane szacunkowe</span>
            <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-900 text-gray-400 rounded-full px-2.5 py-1">🚫 Nie reklama agencji</span>
            <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-900 text-gray-400 rounded-full px-2.5 py-1">👷 Odliczenia zgłoszone przez pracowników</span>
          </div>
          <RealSalaryBlock />
        </section>

        {/* ══ TOP AGENCIES WITH HOUSING ════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Agencje z zakwaterowaniem
              </p>
              <h2 className="text-xl font-black text-gray-900">
                {housingAgencies.length} agencji oferujących zakwaterowanie
              </h2>
            </div>
            <Link href="/agencies-with-housing" className="text-sm text-brand-600 font-semibold hover:underline">
              Wszystkie →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {housingAgencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} locale="pl" />
            ))}
          </div>
        </section>

        {/* ══ SALARY REALITY TABLE ════════════════════════════════════════════ */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Przy €15/h · 40 h tygodniowo · z zakwaterowaniem agencji
          </p>
          <h2 className="text-xl font-black text-gray-900 mb-4">
            Gdzie idą Twoje pieniądze?
          </h2>
          <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
            <div className="grid grid-cols-2 divide-x divide-white/10 border-b border-white/10">
              <div className="px-5 py-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Co mówi agencja</p>
                <p className="text-4xl font-black text-gray-500 line-through decoration-red-500 decoration-4">€600</p>
                <p className="text-xs text-gray-600 mt-1.5">brutto / tydzień</p>
              </div>
              <div className="px-5 py-5 text-center bg-red-950/40">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">W kieszeni masz</p>
                <p className="text-4xl font-black text-white">€243</p>
                <p className="text-xs text-red-400 mt-1.5 font-semibold">netto / tydzień</p>
              </div>
            </div>
            <div className="px-5 py-4 space-y-2">
              {[
                { label: "Podatek dochodowy (~22%)", amount: "−€132", color: "text-red-400" },
                { label: "Zakwaterowanie (odlicza agencja)", amount: "−€150", color: "text-orange-400" },
                { label: "Ubezpieczenie zdrowotne", amount: "−€50", color: "text-yellow-500" },
                { label: "Transport", amount: "−€25", color: "text-amber-400" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-xs py-1 border-b border-white/8">
                  <span className="text-gray-400">{row.label}</span>
                  <span className={`font-bold tabular-nums ${row.color}`}>{row.amount}</span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-red-950/20 border-t border-red-900/30">
              <p className="text-xs text-red-300 font-semibold">
                To <strong className="text-red-400">€18 564 rocznie</strong> utracone na zakwaterowanie, podatki i ubezpieczenie.
              </p>
              <p className="text-[9px] text-gray-600 mt-1">
                * Dane szacunkowe. Podstawa: stawki podatkowe NL 2026 + odliczenia zgłoszone przez pracowników.
              </p>
            </div>
          </div>
        </section>

        {/* ══ LIVE ACTIVITY ════════════════════════════════════════════════════ */}
        <section>
          <div className="bg-gray-900 rounded-2xl px-5 py-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              Aktywność pracowników
            </p>
            <LiveActivityFeed variant="scroll" maxItems={6} />
            <p className="text-[9px] text-gray-600 mt-3">
              ℹ️ Dane zgłoszone przez pracowników. Niezweryfikowane przez AgencyCheck.
            </p>
          </div>
        </section>

        {/* ══ STATS ════════════════════════════════════════════════════════════ */}
        <section>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: AGENCIES.length,     label: "zweryfikowanych agencji",  color: "text-brand-600" },
              { value: totalReviews,         label: "opinii pracowników",       color: "text-amber-600" },
              { value: housingCount,         label: "agencji z zakwaterowaniem", color: "text-green-600" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ REVIEWS TEASER ═══════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900">Najnowsze opinie pracowników</h2>
            <Link href="/reviews" className="text-sm text-brand-600 font-semibold hover:underline">
              Wszystkie opinie →
            </Link>
          </div>
          <div className="space-y-3">
            {latestReviews.slice(0, 3).map((r, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{r.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{r.agencySlug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {"★".repeat(r.overallRating).split("").map((s, j) => (
                      <span key={j} className="text-amber-400 text-sm">{s}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{r.comment}</p>
                <p className="text-[9px] text-gray-400 mt-2">
                  ℹ️ Doświadczenie zgłoszone przez pracownika. Niezweryfikowane przez AgencyCheck.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ BOTTOM CTA ══════════════════════════════════════════════════════ */}
        <section>
          <div className="bg-gray-900 rounded-2xl px-6 py-8 text-white text-center">
            <h2 className="text-xl font-black mb-2">Sprawdź agencje zanim podpiszesz</h2>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed max-w-lg mx-auto">
              Porównaj {AGENCIES.length} agencji pracy w Holandii według opinii pracowników, warunków zakwaterowania i realnych zarobków netto.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/agencies-with-housing"
                className="bg-green-600 hover:bg-green-500 text-white font-black text-sm px-6 py-3 rounded-xl transition-colors">
                🏠 Agencje z zakwaterowaniem →
              </Link>
              <Link href="/agencies"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors">
                🏢 Wszystkie agencje →
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
