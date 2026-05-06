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
const LOCALE: I18nLocale = "pl";
const S = AGENCY_STRINGS[LOCALE];

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const staticAgency = ALL_AGENCY_MAP[params.slug];
  const agencyName   = staticAgency?.name ?? params.slug.replace(/-/g, " ");
  const city         = staticAgency?.city ?? "Holandia";
  const sector       = staticAgency?.sector ?? "general-staffing";
  const hasHousing   = staticAgency?.accommodation === "confirmed_with_deduction" || staticAgency?.accommodation === "confirmed_no_deduction";

  const title = `${agencyName} opinie – zarobki, zakwaterowanie, praca w Holandii`;
  const description = `${agencyName} to agencja pracy w ${city}, Holandia. Sektor: ${sector}. ${
    hasHousing ? "Zakwaterowanie dostępne dla pracowników. " : ""
  }Przeczytaj opinie pracowników o zarobkach, warunkach pracy i zakwaterowaniu.`;

  return {
    title,
    description,
    alternates: agencyAlternatesLocale(params.slug, "pl"),
    openGraph: {
      title,
      description,
      locale: "pl_PL",
      type:   "website",
    },
    keywords: [
      `${agencyName} opinie`,
      `${agencyName} praca Holandia`,
      `${agencyName} zakwaterowanie`,
      `${agencyName} zarobki`,
      `agencja pracy ${city}`,
      "praca w Holandii opinie",
    ],
  };
}

// ─── Sector salary ranges (PL) ────────────────────────────────────────────────

const SECTOR_SALARY_PL: Record<string, { min: string; max: string; note: string }> = {
  "logistics":         { min: "€13,50", max: "€16,00", note: "praca w magazynach, picking i packing, obsługa wózka widłowego" },
  "food-production":   { min: "€13,50", max: "€15,50", note: "linia produkcyjna, pakowanie, kontrola jakości" },
  "construction":      { min: "€16,00", max: "€24,00", note: "stawki zależą od kwalifikacji i rodzaju prac budowlanych" },
  "office-admin":      { min: "€15,00", max: "€28,00", note: "praca biurowa i administracyjna, często umowy długoterminowe" },
  "general-staffing":  { min: "€13,27", max: "€16,00", note: "różne branże, stawka minimalna WML 2026 = €14,71/godz." },
  "agriculture":       { min: "€13,27", max: "€14,50", note: "sezonowa praca polowa, zbiory, szklarnie" },
  "healthcare":        { min: "€15,00", max: "€32,00", note: "personel medyczny i opiekuńczy, wymaga certyfikatów" },
  "transport":         { min: "€14,50", max: "€20,00", note: "kierowcy (C, CE), operatorzy, praca w systemie zmianowym" },
  "manufacturing":     { min: "€13,50", max: "€17,00", note: "produkcja przemysłowa, obsługa maszyn, praca zmianowa" },
  "industrial":        { min: "€13,50", max: "€17,50", note: "obsługa maszyn, montaż, hale produkcyjne" },
  "cleaning":          { min: "€13,27", max: "€14,50", note: "sprzątanie przemysłowe i biurowe" },
  "hospitality":       { min: "€13,27", max: "€15,50", note: "hotele, restauracje, catering" },
  "it-tech":           { min: "€25,00", max: "€65,00", note: "IT, development, praca zdalna lub hybrydowa" },
};

function getSalarySector(sector: string) {
  return SECTOR_SALARY_PL[sector] ?? SECTOR_SALARY_PL["general-staffing"];
}

// ─── Accommodation details (PL) ───────────────────────────────────────────────

function getAccommodationInfo(acc: string): { label: string; detail: string; color: string } {
  switch (acc) {
    case "confirmed_with_deduction":
      return {
        label:  "✅ Zakwaterowanie dostępne",
        detail: "Agencja zapewnia zakwaterowanie pracownikom. Koszt zazwyczaj ~€80–100/tydzień jest potrącany bezpośrednio z wynagrodzenia (zgodnie z normami SNF). Zanim podpiszesz umowę, zapytaj o dokładną kwotę tygodniowego potrącenia oraz liczbę osób w pokoju.",
        color:  "green",
      };
    case "confirmed_no_deduction":
      return {
        label:  "✅ Zakwaterowanie wliczone",
        detail: "Agencja zapewnia zakwaterowanie bez dodatkowych potrąceń z wynagrodzenia. To rzadka i korzystna opcja — upewnij się jednak na piśmie, że nie ma ukrytych opłat administracyjnych.",
        color:  "green",
      };
    case "not_provided":
      return {
        label:  "❌ Brak zakwaterowania",
        detail: "Agencja nie oferuje zakwaterowania. Pracownicy muszą samodzielnie wynająć mieszkanie. Średni czynsz za pokój w Holandii to €500–900/miesiąc w zależności od regionu.",
        color:  "red",
      };
    case "unverified_claim":
      return {
        label:  "⚠ Zakwaterowanie deklarowane",
        detail: "Agencja deklaruje dostępność zakwaterowania, ale nie jest to jeszcze zweryfikowane przez AgencyCheck. Koniecznie zapytaj bezpośrednio agencję o warunki i koszty przed podpisaniem umowy.",
        color:  "amber",
      };
    default:
      return {
        label:  "❓ Status zakwaterowania nieznany",
        detail: "Nie mamy potwierdzonych informacji o zakwaterowaniu w tej agencji. Zawsze pytaj o zakwaterowanie przy pierwszym kontakcie z agencją.",
        color:  "gray",
      };
  }
}

// ─── Worker tips by sector (PL) ───────────────────────────────────────────────

const SECTOR_TIPS_PL: Record<string, string[]> = {
  "logistics":       [
    "Przed podpisaniem umowy sprawdź, czy agencja potrąca koszty transportu do magazynu.",
    "Zapytaj, jak obliczane są nadgodziny — w Polsce norma to 8h/dzień, w Holandii zależy od umowy zbiorowej (CAO).",
    "Praca zmianowa (ochtend/avond) często ma wyższe stawki — pytaj o dopłaty za zmiany nocne i weekendowe.",
  ],
  "food-production": [
    "W zakładach spożywczych wymagana jest często własna odzież robocza — zapytaj, co zapewnia agencja.",
    "Praca na linii produkcyjnej może być monotonna — upewnij się, że stawka godzinowa jest wyraźnie powyżej WML.",
    "Weryfikuj, czy agencja opłaca składki ZUS (sociale verzekering) — to Twoje prawo w Holandii.",
  ],
  "construction":    [
    "Agencje budowlane często wymagają własnych narzędzi lub specjalistycznych uprawnień — sprawdź wymagania z wyprzedzeniem.",
    "Stawki za pracę budowlaną mogą znacznie różnić się od podawanych w ofercie — pytaj o stawkę netto po odliczeniach.",
    "W branży budowlanej często obowiązuje CAO Bouw — upewnij się, że agencja go stosuje.",
  ],
  "general-staffing":[
    "Sprawdź, czy umowa jest na podstawie Uitzendovereenkomst — to standardowa umowa tymczasowa w Holandii.",
    "Minimalna stawka w 2026 roku to €14,71/godz. (WML) — żadna agencja nie może oferować mniej.",
    "Pytaj o system faz (Fase A/B/C) — od niego zależy Twoja ochrona zatrudnienia.",
  ],
};

function getTips(sector: string): string[] {
  return SECTOR_TIPS_PL[sector] ?? SECTOR_TIPS_PL["general-staffing"];
}

// ─── FAQ generator (PL) ───────────────────────────────────────────────────────

function buildFaq(agencyName: string, acc: string, sector: string, cities: string[], score: number) {
  const salary = getSalarySector(sector);
  const cityList = cities.slice(0, 3).map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ");

  return [
    {
      q: `Czy ${agencyName} zapewnia zakwaterowanie?`,
      a: acc === "confirmed_with_deduction"
        ? `Tak — ${agencyName} zapewnia zakwaterowanie pracownikom. Koszt jest potrącany z tygodniowego wynagrodzenia (zazwyczaj €80–100/tydzień zgodnie z normami SNF). Zapytaj agencję o aktualną stawkę.`
        : acc === "confirmed_no_deduction"
        ? `Tak — ${agencyName} zapewnia zakwaterowanie bez potrąceń z wynagrodzenia. To rzadka i bardzo korzystna opcja.`
        : acc === "not_provided"
        ? `Nie — ${agencyName} nie zapewnia zakwaterowania. Musisz samodzielnie wynająć mieszkanie. Średni czynsz w Holandii to €500–900/miesiąc za pokój.`
        : `Status zakwaterowania w ${agencyName} jest niepewny — skontaktuj się bezpośrednio z agencją, aby to wyjaśnić przed podpisaniem umowy.`,
    },
    {
      q: `Ile można zarobić pracując przez ${agencyName}?`,
      a: `Agencja ${agencyName} specjalizuje się w sektorze: ${sector}. Typowe stawki godzinowe w tej branży w Holandii to ${salary.min}–${salary.max}/godz. brutto. Pamiętaj, że od kwoty brutto odliczane są podatek holenderski, składki ubezpieczeniowe (ZVW ~€35/tydzień) oraz ewentualne koszty zakwaterowania i transportu.`,
    },
    {
      q: `W jakich miastach działa ${agencyName}?`,
      a: cityList
        ? `${agencyName} obsługuje pracowników w następujących miastach: ${cityList}${cities.length > 3 ? ` i innych` : ""}. Zapytaj agencję o dostępność ofert w konkretnym mieście.`
        : `${agencyName} działa na terenie Holandii. Skontaktuj się bezpośrednio z agencją, aby sprawdzić dostępne lokalizacje.`,
    },
    {
      q: `Jak oceniają ${agencyName} pracownicy?`,
      a: score >= 70
        ? `${agencyName} uzyskuje stosunkowo wysoką ocenę przejrzystości (${score}/100) według danych AgencyCheck. Wysoki wynik oznacza, że agencja jest aktywna, ma dostępne dane kontaktowe i nie jest zgłaszana przez pracowników za nieetyczne praktyki.`
        : score >= 50
        ? `${agencyName} uzyskuje średnią ocenę przejrzystości (${score}/100). Przed podpisaniem umowy sprawdź opinie pracowników i zapytaj o kluczowe warunki zatrudnienia.`
        : `${agencyName} uzyskuje niską ocenę przejrzystości (${score}/100). Zalecamy szczególną ostrożność i dokładne sprawdzenie warunków umowy przed jej podpisaniem.`,
    },
    {
      q: `Co sprawdzić przed podpisaniem umowy z agencją pracy w Holandii?`,
      a: `Zawsze sprawdzaj: (1) stawkę godzinową brutto i wszystkie potrącenia, (2) koszt zakwaterowania i regulamin SNF, (3) koszty transportu do pracy, (4) system faz i rodzaj umowy (Fase A/B/C), (5) numer rejestracyjny ABU/NBBU agencji. Minimalna stawka w 2026 = €14,71/godz.`,
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
  const date = new Date(r.createdAt).toLocaleDateString("pl-PL", {
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
  const timeStr = days === 0 ? "dzisiaj" : days === 1 ? "wczoraj" : `${days}d temu`;
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

export default async function PlAgencyPage({ params }: { params: { slug: string } }) {
  const staticAgency = ALL_AGENCY_MAP[params.slug];
  const dbAgency     = await getDbAgency(params.slug);

  if (!staticAgency && !dbAgency) return notFound();

  const agencyName   = staticAgency?.name ?? dbAgency?.name ?? params.slug;
  const agencyId     = dbAgency?.id ?? null;
  const isUnverified = !staticAgency;

  const sector       = staticAgency?.sector ?? "general-staffing";
  const accommodation = staticAgency?.accommodation ?? "unknown";
  const supportedCities = staticAgency?.supportedCities ?? [];
  const jobFocus     = staticAgency?.jobFocus ?? [];
  const transparencyScore = staticAgency?.transparencyScore ?? 0;
  const description  = staticAgency?.description ?? null;
  const city         = staticAgency?.city ?? dbAgency?.city ?? "Holandia";

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

  const salaryInfo  = getSalarySector(sector);
  const accInfo     = getAccommodationInfo(accommodation);
  const tips        = getTips(sector);
  const faqItems    = buildFaq(agencyName, accommodation, sector, supportedCities, transparencyScore);

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
            url:        `https://agencycheck.io${AGENCY_BASE.pl}/${params.slug}`,
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
        <Link href="/pl" className="hover:text-brand-600">Strona główna</Link>
        <span>/</span>
        <Link href="/pl/agencje-pracy-holandia" className="hover:text-brand-600">Agencje pracy</Link>
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
              Przejrzystość: {transparencyScore}/100
            </span>
          )}
          {directReviews.length > 0 && (
            <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
              {S.reviewsCount(directReviews.length)}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {agencyName} — opinie pracowników
          <span className="block text-sm font-normal text-gray-400 mt-0.5">
            Zarobki · Zakwaterowanie · Warunki pracy w Holandii
          </span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          📍 {city}, Holandia
          {" · "}
          <Link href={`${EN_AGENCY_BASE}/${params.slug}`} className="text-brand-600 hover:underline text-xs">
            English version →
          </Link>
        </p>
      </header>

      {/* Agency description (unique per agency) */}
      {description && (
        <section className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">O agencji</p>
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
        <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">💶 Zarobki w {sector.replace(/-/g, " ")}</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-black text-blue-900">{salaryInfo.min} – {salaryInfo.max}</span>
          <span className="text-sm text-blue-600">/godz. brutto</span>
        </div>
        <p className="text-xs text-blue-700 mb-2">{salaryInfo.note}</p>
        <p className="text-[11px] text-blue-500">
          Po odliczeniu podatku, ZVW (~€35/tydzień) i ewentualnych kosztów zakwaterowania, rzeczywiste wynagrodzenie "na rękę" może być o 25–40% niższe od kwoty brutto.
          <Link href="/tools/real-income-calculator" className="ml-1 underline font-semibold">Oblicz swoje realne zarobki →</Link>
        </p>
      </section>

      {/* Accommodation section */}
      <section className={`mb-6 rounded-xl border p-4 ${accBorderColor}`}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "inherit" }}>🏠 Zakwaterowanie</p>
        <p className={`text-sm font-semibold mb-1 ${accTextColor}`}>{accInfo.label}</p>
        <p className={`text-sm leading-relaxed ${accTextColor}`}>{accInfo.detail}</p>
        {supportedCities.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Miasta obsługiwane: {supportedCities.slice(0, 5).map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")}
            {supportedCities.length > 5 && ` +${supportedCities.length - 5} innych`}
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
        <h2 className="text-sm font-bold text-amber-800 mb-3">💡 Wskazówki dla pracowników — {sector.replace(/-/g, " ")}</h2>
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
                href={`${AGENCY_BASE.pl}/${params.slug}/${toCitySlug(cm.cityNormalized)}`}
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
        <h2 className="text-base font-bold text-gray-900 mb-4">Najczęstsze pytania o {agencyName}</h2>
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
          <h2 className="text-sm font-bold text-gray-800 mb-3">Podobne agencje pracy w Holandii</h2>
          <div className="grid grid-cols-2 gap-2">
            {relatedAgencies.map((a) => (
              <Link
                key={a.slug}
                href={`${AGENCY_BASE.pl}/${a.slug}`}
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
        <Link href="/pl/agencje-pracy-holandia" className="text-gray-400 hover:text-brand-600">
          ← {S.allAgencies}
        </Link>
        <Link href={`${EN_AGENCY_BASE}/${params.slug}`} className="text-brand-600 hover:text-brand-800 font-medium">
          English version →
        </Link>
      </div>
    </main>
  );
}
