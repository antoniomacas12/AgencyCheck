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
import { ALL_AGENCY_MAP } from "@/lib/agencyEnriched";
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

  const title       = `${agencyName} ${S.metaTitleSuffix} – praca w Holandii`;
  const description = S.agencyMetaDesc(agencyName);
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
      "agencja pracy Holandia",
      "praca w Holandii opinie",
    ],
  };
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
  // Try static verified agency first, fall back to DB-only
  const staticAgency = ALL_AGENCY_MAP[params.slug];
  const dbAgency     = await getDbAgency(params.slug);

  if (!staticAgency && !dbAgency) return notFound();

  const agencyName   = staticAgency?.name ?? dbAgency?.name ?? params.slug;
  const agencyId     = dbAgency?.id ?? null;
  const isUnverified = !staticAgency;

  // DB data
  const cityMentions: DbCityMention[] = agencyId
    ? await getAgencyCityMentions(agencyId)
    : [];

  const directReviews: DbReview[] = dbAgency?.directReviews ?? [];
  const avgRatings                = computeRatingAverages(directReviews);

  // Recent comments
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

  const cityDisplay = dbAgency?.city && dbAgency.city !== "unknown"
    ? dbAgency.city
    : staticAgency?.city ?? "Holandia";

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
          {directReviews.length > 0 && (
            <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
              {S.reviewsCount(directReviews.length)}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {agencyName} {S.h1Suffix}
          <span className="block text-sm font-normal text-gray-400 mt-0.5">
            {S.h1SubTitle}
          </span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          📍 {cityDisplay}, Holandia
          {" · "}
          <Link href={`${EN_AGENCY_BASE}/${params.slug}`} className="text-brand-600 hover:underline text-xs">
            English version →
          </Link>
        </p>
      </header>

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
              <RatingRow label={S.salaryLabel}   value={avgRatings.salary   ?? avgRatings.overall} />
              <RatingRow label={S.managementLabel} value={avgRatings.mgmt   ?? avgRatings.overall} />
              <RatingRow label={S.contractLabel}  value={avgRatings.contract ?? avgRatings.overall} />
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

      {/* CTA */}
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 text-center mb-6">
        <p className="text-sm font-bold text-brand-800 mb-1">{S.ctaHeading(agencyName)}</p>
        <p className="text-xs text-brand-600 mb-3">{S.ctaBody}</p>
        <Link
          href={`/share-experience?agency=${encodeURIComponent(agencyName)}`}
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
