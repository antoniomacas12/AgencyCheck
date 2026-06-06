import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PARTNER_VACANCIES,
  getPartnerVacancyBySlug,
  WRX_WA_NUMBER,
} from "@/lib/partnerVacancies";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return PARTNER_VACANCIES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const v = getPartnerVacancyBySlug(params.slug);
  if (!v) return { title: "Vacancy not found" };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: v.title,
    description: v.environment,
    datePosted: v.postedDate,
    validThrough: "2026-09-01",
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: v.partner,
      sameAs: "https://agencycheck.io",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: v.location,
        addressCountry: "NL",
      },
    },
    baseSalary: v.salaryMin > 14.71 ? {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: {
        "@type": "QuantitativeValue",
        value: v.salaryMin,
        unitText: "HOUR",
      },
    } : undefined,
  };

  return {
    title: v.metaTitle,
    description: v.metaDesc,
    alternates: { canonical: `https://agencycheck.io/partner-vacancies/${v.slug}` },
    openGraph: {
      title: v.metaTitle,
      description: v.metaDesc,
      url: `https://agencycheck.io/partner-vacancies/${v.slug}`,
      type: "website",
    },
    other: {
      "script:ld+json": JSON.stringify(jsonLd),
    },
  };
}

export default function PartnerVacancyPage({ params }: { params: { slug: string } }) {
  const v = getPartnerVacancyBySlug(params.slug);
  if (!v) notFound();

  const applyLink = `/partner-vacancies/${v.slug}/apply`;
  const waDirectLink = `https://wa.me/${WRX_WA_NUMBER}?text=${encodeURIComponent(
    `Hi, I want to apply for: ${v.title} in ${v.location} [AgencyCheck Partner Vacancy]`
  )}`;

  const weeklyGross = v.salaryMin > 0 ? Math.round(v.salaryMin * 40) : null;
  const weeklyNet   = weeklyGross ? Math.round(weeklyGross * 0.78 - 70) : null;

  return (
    <div className="min-h-screen bg-[#0B1F14] text-white">

      {/* ── Sticky Apply Bar (mobile) ─────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-[#0a1c12]/95 backdrop-blur border-t border-white/[0.08] sm:hidden">
        <Link
          href={applyLink}
          className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm py-3.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Apply via AgencyCheck
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-8 pb-28 sm:pb-12">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-emerald-400">Home</Link>
          <span>›</span>
          <Link href="/vacancies" className="hover:text-emerald-400">Vacancies</Link>
          <span>›</span>
          <span className="text-gray-300">{v.title}</span>
        </nav>

        {/* ── Status badges ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-3 py-1.5">
            🔥 Priority Hiring
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-3 py-1.5">
            ✓ Verified Recruitment Partner
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full px-3 py-1.5">
            📍 {v.location}, NL
          </span>
        </div>

        {/* ── Partner notice ────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 mb-6 flex items-start gap-3">
          <span className="text-amber-400 text-base shrink-0 mt-0.5">ℹ️</span>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            This vacancy was submitted directly by a recruitment partner and currently requires urgent attention.
            Applications are reviewed personally by AgencyCheck before forwarding to the employer.
          </p>
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-6 mb-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-1">
                {v.partner}
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1">
                {v.title}
              </h1>
              <p className="text-sm text-gray-400">
                📍 {v.location} · {v.region}
              </p>
            </div>
            <div className="shrink-0 text-right hidden sm:block">
              <p className="text-2xl font-black text-emerald-400">{v.salaryDisplay}</p>
              <p className="text-xs text-gray-400 mt-0.5">{v.salaryNote}</p>
            </div>
          </div>

          {/* Mobile salary */}
          <div className="sm:hidden mb-4 bg-emerald-900/20 rounded-xl p-3 border border-emerald-700/20">
            <p className="text-xl font-black text-emerald-400">{v.salaryDisplay}</p>
            <p className="text-xs text-gray-400 mt-0.5">{v.salaryNote}</p>
          </div>

          {/* Key facts grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { icon: "💼", label: "Employment", value: v.employment },
              { icon: "🏠", label: "Housing", value: v.housing === "own_preferred" ? "Own preferred" : v.housing === "limited" ? "Limited options" : "Available" },
              { icon: "🚗", label: "Transport", value: v.transport === "own_required" ? "Own car required" : "Reimbursed" },
              { icon: "🌍", label: "Language", value: v.languages[0] },
            ].map((f) => (
              <div key={f.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                <p className="text-lg mb-0.5">{f.icon}</p>
                <p className="text-[10px] text-gray-400 mb-0.5">{f.label}</p>
                <p className="text-xs font-semibold text-white">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Salary breakdown if available */}
          {weeklyGross && (
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 mb-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Weekly salary estimate</p>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div>
                  <p className="text-lg font-black text-white">€{weeklyGross}</p>
                  <p className="text-gray-400">Gross/week</p>
                </div>
                <div className="border-x border-white/[0.07]">
                  <p className="text-lg font-black text-gray-300">−22%</p>
                  <p className="text-gray-400">Tax estimate</p>
                </div>
                <div>
                  <p className="text-lg font-black text-emerald-400">≈€{weeklyNet}</p>
                  <p className="text-gray-400">Net/week</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">40h/week · estimates only · actual net depends on personal tax situation</p>
            </div>
          )}

          {/* Apply CTA */}
          <Link
            href={applyLink}
            className="flex items-center justify-center gap-2.5 w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-black font-black text-base py-4 rounded-xl transition-colors mb-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Apply Now via AgencyCheck
          </Link>
          <p className="text-center text-[11px] text-gray-500">
            Apply through AgencyCheck and we will personally review your application before forwarding it to the employer.
          </p>
        </div>

        {/* ── Requirements ─────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 mb-4">
          <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
            <span className="text-emerald-400">📋</span> Requirements
          </h2>
          <ul className="space-y-2.5">
            {v.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className={`shrink-0 mt-0.5 font-black ${
                  r.includes("mandatory") || r.includes("Certificate") ? "text-amber-400" : "text-emerald-400"
                }`}>
                  {r.includes("mandatory") ? "⚠" : "✓"}
                </span>
                <span className={r.includes("mandatory") ? "text-amber-200" : "text-gray-200"}>
                  {r}
                </span>
              </li>
            ))}
          </ul>
          {v.certificates.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.07]">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">Required certificates</p>
              <div className="flex flex-wrap gap-2">
                {v.certificates.map((c) => (
                  <span key={c} className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-3 py-1">
                    🏅 {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Responsibilities ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 mb-4">
          <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">🔧</span> Responsibilities
          </h2>
          <ul className="space-y-2">
            {v.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-200">
                <span className="text-blue-400 shrink-0 mt-0.5">→</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Benefits ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 mb-4">
          <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
            <span className="text-emerald-400">⭐</span> What You Get
          </h2>
          <ul className="space-y-2">
            {v.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-200">
                <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                {b}
              </li>
            ))}
          </ul>
          {v.etRegeling && (
            <div className="mt-4 pt-4 border-t border-white/[0.07] flex items-start gap-3 bg-emerald-900/20 rounded-xl p-3">
              <span className="text-emerald-400 text-lg shrink-0">💡</span>
              <div>
                <p className="text-sm font-bold text-emerald-300">ET Arrangement (belastingvrij)</p>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Workers living 150+ km from the Dutch border may qualify for the ET (extraterritoriale kosten) arrangement.
                  This can result in €50–€150/week extra tax-free income. Ask AgencyCheck for details.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Housing & Transport ───────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 mb-4">
          <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
            <span className="text-blue-400">🏠</span> Housing & Transport
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">🏠</span>
              <div>
                <p className="text-sm font-bold text-white">Accommodation</p>
                {v.housing === "own_preferred" ? (
                  <>
                    <p className="text-xs text-gray-300 mt-0.5">Own accommodation preferred.</p>
                    {v.housingCost && (
                      <p className="text-xs text-emerald-400 mt-1">Basic room may be available: <strong>{v.housingCost}</strong></p>
                    )}
                  </>
                ) : v.housing === "limited" ? (
                  <p className="text-xs text-gray-300 mt-0.5">Own accommodation preferred. Limited accommodation may be discussed.</p>
                ) : (
                  <p className="text-xs text-emerald-400 mt-0.5">Accommodation available with this position.</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-white/[0.07] pt-3">
              <span className="text-lg shrink-0">🚗</span>
              <div>
                <p className="text-sm font-bold text-white">Transport</p>
                <p className="text-xs text-gray-300 mt-0.5">{v.transportNote}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Environment ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 mb-6">
          <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
            <span className="text-purple-400">🏭</span> Work Environment
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">{v.environment}</p>
        </div>

        {/* ── Important notice ─────────────────────────────────────────────── */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 mb-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Important Notice</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Submitting an application does not guarantee placement. All candidates are reviewed individually.
            Suitable candidates will be contacted by AgencyCheck after review.
          </p>
        </div>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-emerald-700/30 bg-emerald-900/20 p-6 text-center">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-2">Ready to apply?</p>
          <h3 className="text-xl font-black text-white mb-2">Apply via AgencyCheck</h3>
          <p className="text-sm text-gray-300 mb-5 max-w-sm mx-auto">
            Fill in your details and we will personally review your profile before forwarding it to the employer.
          </p>
          <Link
            href={applyLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base px-8 py-4 rounded-xl transition-colors mb-3"
          >
            Apply Now →
          </Link>
          <p className="text-[11px] text-gray-500">
            Or contact us directly on WhatsApp:{" "}
            <a href={waDirectLink} className="text-emerald-400 hover:underline">
              +31 6 49210631
            </a>
          </p>
        </div>

        {/* ── Related vacancies ─────────────────────────────────────────────── */}
        <div className="mt-8 pt-6 border-t border-white/[0.07]">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Other partner vacancies</p>
          <div className="flex flex-col gap-2">
            {PARTNER_VACANCIES.filter((pv) => pv.slug !== v.slug).map((pv) => (
              <Link
                key={pv.slug}
                href={`/partner-vacancies/${pv.slug}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 hover:border-emerald-500/30 transition-colors group"
              >
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{pv.title}</p>
                  <p className="text-xs text-gray-400">📍 {pv.location} · {pv.salaryDisplay}</p>
                </div>
                <span className="text-gray-500 group-hover:text-emerald-400 transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
