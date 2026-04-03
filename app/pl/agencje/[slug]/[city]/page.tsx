import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getDbAgency,
  getAgencyCommentsByCity,
  getAgencyCityMentions,
  type DbAgencyCityComment,
  type DbCityMention,
} from "@/lib/agencyDb";
import { ALL_AGENCY_MAP } from "@/lib/agencyEnriched";
import {
  AGENCY_STRINGS,
  AGENCY_BASE,
  CITY_BASE,
  EN_AGENCY_BASE,
  EN_CITY_BASE,
  type I18nLocale,
} from "@/lib/agencyI18nStrings";
import { fromCitySlug, toDisplayCity, toCitySlug } from "@/lib/cityNormalization";

export const dynamic = "force-dynamic";
const LOCALE: I18nLocale = "pl";
const S = AGENCY_STRINGS[LOCALE];

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string; city: string };
}): Promise<Metadata> {
  const cityNorm  = fromCitySlug(params.city);
  const cityName  = toDisplayCity(cityNorm);
  const staticAgency = ALL_AGENCY_MAP[params.slug];
  const agencyName   = staticAgency?.name ?? params.slug.replace(/-/g, " ");

  const canonicalPl = `${AGENCY_BASE.pl}/${params.slug}/${params.city}`;
  const title       = `${agencyName} ${cityName} opinie – praca Holandia`;
  const description = `Przeczytaj co pracownicy mówią o ${agencyName} w ${cityName}. Opinie o zakwaterowaniu, zarobkach i warunkach pracy. Dane zebrane przez AgencyCheck.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPl,
      languages: {
        "en":        `${EN_AGENCY_BASE}/${params.slug}/${params.city}`,
        "pl":        canonicalPl,
        "ro":        `${AGENCY_BASE.ro}/${params.slug}/${params.city}`,
        "x-default": `${EN_AGENCY_BASE}/${params.slug}/${params.city}`,
      },
    },
    openGraph: {
      title,
      description,
      locale: "pl_PL",
      type:   "website",
    },
  };
}

// ─── Comment bubble ────────────────────────────────────────────────────────────

function CommentBubble({ c }: { c: DbAgencyCityComment }) {
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

export default async function PlAgencyCityPage({
  params,
}: {
  params: { slug: string; city: string };
}) {
  const cityNorm = fromCitySlug(params.city);
  const cityName = toDisplayCity(cityNorm);

  const staticAgency = ALL_AGENCY_MAP[params.slug];
  const dbAgency     = await getDbAgency(params.slug);

  if (!staticAgency && !dbAgency) return notFound();

  const agencyName = staticAgency?.name ?? dbAgency?.name ?? params.slug;

  // Verify this city has enough data to warrant a page
  const cityMentions: DbCityMention[] = dbAgency
    ? await getAgencyCityMentions(dbAgency.id)
    : [];

  const thisCityMention = cityMentions.find((m) => m.cityNormalized === cityNorm);
  const hasCityData     = Boolean(thisCityMention) || (staticAgency && staticAgency.supportedCities?.some(
    (c) => c.toLowerCase() === cityNorm,
  ));

  if (!hasCityData) return notFound();

  // Fetch comments for this agency+city
  const cityComments: DbAgencyCityComment[] = dbAgency
    ? await getAgencyCommentsByCity(dbAgency.id, cityNorm).catch(() => [])
    : [];

  // Other cities for this agency
  const otherCities: DbCityMention[] = cityMentions
    .filter((m) => m.cityNormalized !== cityNorm)
    .slice(0, 8);

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
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/pl" className="hover:text-brand-600">Strona główna</Link>
        <span>/</span>
        <Link href="/pl/agencje-pracy-holandia" className="hover:text-brand-600">Agencje pracy</Link>
        <span>/</span>
        <Link href={`${AGENCY_BASE.pl}/${params.slug}`} className="hover:text-brand-600">
          {agencyName}
        </Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">{cityName}</span>
      </nav>

      {/* Header */}
      <header className="mb-6">
        {!staticAgency && (
          <span className="inline-block text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full mb-2">
            {S.unverifiedBadge}
          </span>
        )}
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {S.workerCommentsCity(agencyName, cityName)}
          <span className="block text-sm font-normal text-gray-400 mt-0.5">
            {S.h1SubTitle}
          </span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          📍 {cityName}, Holandia
          {" · "}
          <Link href={`${EN_AGENCY_BASE}/${params.slug}/${params.city}`} className="text-brand-600 hover:underline text-xs">
            English version →
          </Link>
        </p>
      </header>

      {/* Worker comments */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          {S.workerCommentsCity(agencyName, cityName)}
        </h2>

        {cityComments.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-50">
            {cityComments.map((c) => (
              <div key={c.id} className="px-4">
                <CommentBubble c={c} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl px-5 py-8 text-center">
            <p className="text-2xl mb-2">💬</p>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {S.noCommentsYet}
            </p>
            <p className="text-xs text-gray-500">{S.noCommentsBody}</p>
          </div>
        )}

        <p className="text-[11px] text-gray-400 mt-3 italic">{S.trustNote}</p>
      </section>

      {/* Other cities */}
      {otherCities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-gray-800 mb-2">{S.otherCities}</h2>
          <div className="flex flex-wrap gap-2">
            {otherCities.map((cm) => (
              <Link
                key={cm.cityNormalized}
                href={`${AGENCY_BASE.pl}/${params.slug}/${toCitySlug(cm.cityNormalized)}`}
                className="inline-flex items-center gap-1 text-xs bg-blue-50 border border-blue-100
                  text-blue-800 px-3 py-1 rounded-full hover:bg-blue-100 hover:border-blue-200 transition-colors"
              >
                📍 {cm.cityDisplay}
                {cm.mentionCount > 1 && (
                  <span className="text-blue-400">·{cm.mentionCount}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 text-center mb-6">
        <p className="text-sm font-bold text-brand-800 mb-1">
          {S.ctaHeading(agencyName, cityName)}
        </p>
        <p className="text-xs text-brand-600 mb-3">{S.ctaBody}</p>
        <Link
          href={`/share-experience?agency=${encodeURIComponent(agencyName)}&city=${encodeURIComponent(cityName)}`}
          className="inline-block bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold
            px-5 py-2.5 rounded-xl transition-colors"
        >
          {S.ctaButton}
        </Link>
      </div>

      {/* Footer nav */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-sm">
        <Link href={`${AGENCY_BASE.pl}/${params.slug}`} className="text-brand-600 hover:text-brand-800 font-medium">
          {S.backToAgency(agencyName)}
        </Link>
        <Link href={`${CITY_BASE.pl}/${params.city}`} className="text-gray-400 hover:text-brand-600">
          {S.backToCity(cityName)}
        </Link>
      </div>
    </main>
  );
}
