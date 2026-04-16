// agencies-with-housing — fixed chunk error by ensuring fresh compile
import type { Metadata } from "next";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import HousingGallery from "@/components/HousingGallery";
import { AGENCIES } from "@/lib/agencyData";
import { HOUSING_IMAGE_SLUGS, getHousingImages, HOUSING_IMAGE_TOTAL } from "@/lib/housingImages";
import { getLocale } from "@/lib/getLocale";
import { getT } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Employment Agencies With Housing Netherlands — Real Photos — AgencyCheck",
  description:
    "Find employment agencies in the Netherlands that provide housing for workers. See real worker-submitted housing photos from 17 agencies — bedrooms, bathrooms, shared facilities.",
  alternates: { canonical: "https://agencycheck.io/agencies-with-housing" },
};

export const dynamic = "force-dynamic";

export default async function AgenciesWithHousingPage() {
  const locale = getLocale();
  const t = await getT(locale);

  const confirmed = AGENCIES
    .filter((a) => a.housing === "YES")
    .sort((a, b) => b.score - a.score);

  const unknown = AGENCIES
    .filter((a) => a.housing === "UNKNOWN")
    .sort((a, b) => b.score - a.score);

  const withPhotos = AGENCIES
    .filter((a) => HOUSING_IMAGE_SLUGS.includes(a.slug))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ── Hero header ── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-800 rounded-full px-3 py-1">
            {t("agencies_with_housing.badge_photos", { count: HOUSING_IMAGE_TOTAL })}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-800 rounded-full px-3 py-1">
            {t("agencies_with_housing.badge_agencies_photos", { count: withPhotos.length })}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded-full px-3 py-1">
            {t("agencies_with_housing.badge_confirmed", { count: confirmed.length })}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-2">
          {t("agencies_with_housing.heading")}
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
          {t("agencies_with_housing.subheading")}
        </p>
      </div>

      {/* Info callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-10 text-xs text-amber-800 leading-relaxed">
        <strong>{t("agencies_with_housing.about_title")}</strong>{" "}
        {t("agencies_with_housing.about_text")}
      </div>

      {/* ── Agencies with real photos ── */}
      {withPhotos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">📸</span>
            <div>
              <h2 className="text-lg font-black text-gray-900">
                {t("agencies_with_housing.photos_section_title")}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {t("agencies_with_housing.photos_section_sub", {
                  totalPhotos: HOUSING_IMAGE_TOTAL,
                  agencyCount: withPhotos.length,
                })}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {withPhotos.map((agency) => {
              const imgs = getHousingImages(agency.slug);
              return (
                <div key={agency.slug} className="card overflow-hidden">
                  <Link
                    href={`/agencies/${agency.slug}`}
                    className="flex items-center justify-between px-4 pt-4 pb-2 group"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-brand-700 transition-colors leading-tight">
                        {agency.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">📍 {agency.city}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        agency.score >= 70 ? "bg-green-100 text-green-700" :
                        agency.score >= 50 ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {agency.score}/100
                      </span>
                      <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                  <HousingGallery images={imgs} agencyName={agency.name} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Confirmed housing (all) ── */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">✅</span>
          <div>
            <h2 className="text-lg font-black text-gray-900">
              {t("agencies_with_housing.confirmed_section_title")}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {confirmed.length === 1
                ? t("agencies_with_housing.confirmed_section_sub_singular", { count: confirmed.length })
                : t("agencies_with_housing.confirmed_section_sub_plural", { count: confirmed.length })}
            </p>
          </div>
        </div>

        {confirmed.length === 0 ? (
          <div className="text-center py-16 text-gray-400 card">
            <span className="text-5xl">🏠</span>
            <p className="mt-4 text-sm font-semibold">{t("agencies_with_housing.no_confirmed")}</p>
            <p className="text-xs mt-1">{t("agencies_with_housing.no_confirmed_sub")}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {confirmed.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {/* ── Housing unknown ── */}
      {unknown.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">❓</span>
            <div>
              <h2 className="text-lg font-black text-gray-900">
                {t("agencies_with_housing.unknown_section_title")}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {unknown.length === 1
                  ? t("agencies_with_housing.unknown_section_sub_singular", { count: unknown.length })
                  : t("agencies_with_housing.unknown_section_sub_plural", { count: unknown.length })}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-5 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
            {t("agencies_with_housing.unknown_note")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unknown.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="mt-10 bg-gray-900 rounded-2xl px-6 py-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-black text-base mb-1">{t("agencies_with_housing.cta_title")}</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            {t("agencies_with_housing.cta_sub")}
          </p>
        </div>
        <Link
          href="/reviews"
          className="shrink-0 bg-white text-gray-900 font-black text-sm px-5 py-3 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap"
        >
          {t("agencies_with_housing.cta_button")}
        </Link>
      </div>

      <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
        {t("agencies_with_housing.footer_note")}
      </p>
    </div>
  );
}
