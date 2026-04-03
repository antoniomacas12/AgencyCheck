import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCityWorkerData,
} from "@/lib/agencyDb";
import {
  CITY_STRINGS,
  AGENCY_BASE,
  CITY_BASE,
  EN_AGENCY_BASE,
  EN_CITY_BASE,
  type I18nLocale,
} from "@/lib/agencyI18nStrings";
import { fromCitySlug, toDisplayCity, toCitySlug } from "@/lib/cityNormalization";

export const dynamic = "force-dynamic";
const LOCALE: I18nLocale = "ro";
const S = CITY_STRINGS[LOCALE];

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata> {
  const cityNorm = fromCitySlug(params.city);
  const cityName = toDisplayCity(cityNorm);
  const canonicalRo = `${CITY_BASE.ro}/${params.city}`;

  return {
    title:       S.metaTitleTemplate(cityName),
    description: S.metaDescTemplate(cityName),
    alternates: {
      canonical: canonicalRo,
      languages: {
        "en":        `${EN_CITY_BASE}/${params.city}`,
        "pl":        `${CITY_BASE.pl}/${params.city}`,
        "ro":        canonicalRo,
        "x-default": `${EN_CITY_BASE}/${params.city}`,
      },
    },
    openGraph: {
      title:       S.metaTitleTemplate(cityName),
      description: S.metaDescTemplate(cityName),
      locale:      "ro_RO",
      type:        "website",
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RoCityPage({
  params,
}: {
  params: { city: string };
}) {
  const cityNorm   = fromCitySlug(params.city);
  const cityName   = toDisplayCity(cityNorm);
  const workerData = await getCityWorkerData(cityNorm).catch(() => ({ agencies: [], comments: [] }));

  // Require at least some data to show the page
  if (workerData.agencies.length === 0 && workerData.comments.length === 0) {
    return notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 pb-24">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/ro" className="hover:text-brand-600">Pagina principală</Link>
        <span>/</span>
        <Link href="/ro/agentii-munca-olanda" className="hover:text-brand-600">{S.breadcrumbCities}</Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">{cityName}</span>
      </nav>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {S.h1Template(cityName)}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          📍 {cityName}, Olanda
          {" · "}
          <Link href={`${EN_CITY_BASE}/${params.city}`} className="text-brand-600 hover:underline text-xs">
            English version →
          </Link>
        </p>
        <p className="text-sm text-gray-600 mt-2">{S.intro(cityName)}</p>
      </header>

      {/* Agencies mentioned in this city */}
      {workerData.agencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            {S.agenciesMentioned(cityName)}
          </h2>
          <div className="flex flex-wrap gap-2">
            {workerData.agencies.map((a) => (
              <Link
                key={a.agencySlug}
                href={`${AGENCY_BASE.ro}/${a.agencySlug}/${toCitySlug(cityNorm)}`}
                className="inline-flex items-center gap-1.5 text-xs bg-brand-50 border border-brand-100
                  text-brand-800 px-3 py-1.5 rounded-full hover:bg-brand-100 hover:border-brand-200 transition-colors font-medium"
              >
                🏢 {a.agencyName}
                {a.mentionCount > 1 && (
                  <span className="text-brand-400">·{a.mentionCount}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent worker comments */}
      {workerData.comments.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            {S.recentComments(cityName)}
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-50">
            {workerData.comments.map((c) => {
              const diff = Date.now() - new Date(c.createdAt).getTime();
              const days = Math.floor(diff / 86_400_000);
              const timeStr = days === 0 ? "azi" : days === 1 ? "ieri" : `acum ${days}z`;
              return (
                <div key={c.id} className="flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-sm mt-0.5">
                    👷
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
                      <Link
                        href={`${AGENCY_BASE.ro}/${c.agencySlug}`}
                        className="text-xs font-semibold text-brand-700 hover:underline"
                      >
                        {c.agencyName}
                      </Link>
                      <span className="text-[11px] text-gray-400">·</span>
                      <span className="text-[11px] text-gray-500">📍 {cityName}</span>
                      <span className="text-[11px] text-gray-400">·</span>
                      <span className="text-[11px] text-gray-400">{timeStr}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-line">
                      {c.body}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 italic">{S.originalComment}</p>
                    <Link
                      href={`${AGENCY_BASE.ro}/${c.agencySlug}/${toCitySlug(cityNorm)}`}
                      className="text-[11px] text-brand-600 hover:underline mt-1 inline-block"
                    >
                      {S.viewAgencyCity(c.agencyName, cityName)}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400 mt-3 italic">{S.trustNote}</p>
        </section>
      )}

      {/* CTA */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 text-center mb-6">
        <p className="text-sm font-bold text-brand-800 mb-1">{S.ctaHeading(cityName)}</p>
        <p className="text-xs text-brand-600 mb-3">{S.ctaBody}</p>
        <Link
          href={`/share-experience?city=${encodeURIComponent(cityName)}`}
          className="inline-block bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold
            px-5 py-2.5 rounded-xl transition-colors"
        >
          {S.ctaButton}
        </Link>
      </div>

      {/* Footer nav */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-sm">
        <Link href="/ro/agentii-munca-olanda" className="text-gray-400 hover:text-brand-600">
          ← {S.allCities}
        </Link>
        <Link href={`${EN_CITY_BASE}/${params.city}`} className="text-brand-600 hover:text-brand-800 font-medium">
          English version →
        </Link>
      </div>
    </main>
  );
}
