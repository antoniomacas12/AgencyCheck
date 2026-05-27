import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JobApplyButton from "@/components/JobApplyButton";
import {
  VACANCIES,
  getVacancyBySlug,
  getCountry,
  getAddressMeta,
  getSalaryUnit,
  CAT_ICONS,
  BADGE_META,
  type Category,
  type Badge,
} from "@/lib/vacanciesData";

const WA_BASE = "https://wa.me/31613754893";
const BASE    = "https://agencycheck.io";

// ─── Static generation ────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return VACANCIES.map((v) => ({ slug: v.slug }));
}
export const dynamicParams = false;
export const dynamic       = "force-static";

// ─── Polish labels ────────────────────────────────────────────────────────────
const PL_CAT: Record<Category, string> = {
  technical:   "Techniczny i budowlany",
  production:  "Produkcja i przemysł",
  warehouse:   "Magazyn i logistyka",
  driving:     "Transport i kierowcy",
  automotive:  "Motoryzacja",
  food:        "Produkcja spożywcza",
  hospitality: "Gastronomia i hotelarstwo",
};

const PL_BADGE: Record<Badge, { label: string; color: string }> = {
  eng: { label: "Wymagania językowe",      color: "text-blue-300 bg-blue-400/10 border-blue-400/20" },
  car: { label: "Własny samochód wymagany", color: "text-purple-300 bg-purple-400/10 border-purple-400/20" },
  acc: { label: "Zakwaterowanie wliczone",  color: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20" },
  vog: { label: "Czysta kartoteka (VOG)",   color: "text-amber-300 bg-amber-400/10 border-amber-400/20" },
};

// ─── Slug validation ──────────────────────────────────────────────────────────
function isValidSlug(raw: unknown): raw is string {
  return (
    typeof raw === "string" &&
    raw.trim().length > 0 &&
    raw.length <= 120 &&
    /^[a-z0-9-]+$/.test(raw)
  );
}

// ─── Polish description for meta ──────────────────────────────────────────────
function buildPlDescription(title: string, location: string, salary: string, hasSalary: boolean): string {
  const salPart = hasSalary ? ` Zarobki: ${salary}.` : "";
  return `Oferta pracy: ${title} w ${location}, Holandia.${salPart} Sprawdź wymagania i aplikuj teraz przez AgencyCheck.`;
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params;
    if (!isValidSlug(slug)) return { title: "Oferta pracy nie znaleziona" };
    const v = getVacancyBySlug(slug);
    if (!v) return { title: "Oferta pracy nie znaleziona" };

    const description = buildPlDescription(v.t, v.l, v.s, v.sm > 0);

    return {
      title:       `${v.t} w ${v.l} — Praca w Holandii | AgencyCheck`,
      description,
      robots:      { index: true, follow: true },
      alternates:  {
        canonical: `${BASE}/pl/oferty-pracy/${v.slug}`,
        languages: {
          "en":        `${BASE}/apply/${v.slug}`,
          "pl":        `${BASE}/pl/oferty-pracy/${v.slug}`,
          "x-default": `${BASE}/apply/${v.slug}`,
        },
      },
      openGraph: {
        title:       `${v.t} — Praca w Holandii`,
        description,
        url:         `${BASE}/pl/oferty-pracy/${v.slug}`,
        type:        "website",
        locale:      "pl_PL",
      },
    };
  } catch {
    return { title: "Oferta pracy nie znaleziona" };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function PlJobPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!isValidSlug(slug)) notFound();

  const v = getVacancyBySlug(slug);
  if (!v) notFound();

  const country     = getCountry(v.l);
  const countryName = country === "NL" ? "Holandia" : country === "GR" ? "Grecja" : "Belgia";
  const salStr      = v.sm > 0 ? v.s : null;
  const addrMeta    = getAddressMeta(v.l);

  const related = VACANCIES.filter((r) => r.c === v.c && r.slug !== v.slug).slice(0, 3);

  // ── JobPosting JSON-LD ─────────────────────────────────────────────────────
  const jobPosting: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type":    "JobPosting",
    title:      v.t,
    description: buildPlDescription(v.t, v.l, v.s, v.sm > 0),
    hiringOrganization: {
      "@type": "Organization",
      name:    "AgencyCheck",
      sameAs:  BASE,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type":         "PostalAddress",
        streetAddress:   addrMeta.streetAddress,
        addressLocality: addrMeta.addressLocality,
        addressRegion:   addrMeta.addressRegion,
        postalCode:      addrMeta.postalCode,
        addressCountry:  country,
      },
    },
    employmentType: "FULL_TIME",
    datePosted:     new Date().toISOString().split("T")[0],
    validThrough:   new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    directApply:    true,
    applicantLocationRequirements: { "@type": "Country", name: "European Union" },
    inLanguage: "pl",
  };

  if (v.sm > 0) {
    jobPosting.baseSalary = {
      "@type":   "MonetaryAmount",
      currency:  "EUR",
      value: {
        "@type":   "QuantitativeValue",
        minValue:  v.sm,
        maxValue:  v.sx > 0 ? v.sx : v.sm,
        unitText:  getSalaryUnit(v.s),
      },
    };
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna",  item: `${BASE}/pl` },
      { "@type": "ListItem", position: 2, name: "Oferty pracy",   item: `${BASE}/pl/oferty-pracy` },
      { "@type": "ListItem", position: 3, name: v.t,              item: `${BASE}/pl/oferty-pracy/${v.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="min-h-screen bg-[#0B1F14] text-white">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-20">

          {/* ── Breadcrumb ──────────────────────────────────────────── */}
          <nav className="flex items-center gap-1.5 text-[11px] text-gray-600 mb-6">
            <Link href="/pl" className="hover:text-gray-400">Strona główna</Link>
            <span>›</span>
            <Link href="/pl/oferty-pracy" className="hover:text-gray-400">Oferty pracy</Link>
            <span>›</span>
            <span className="text-gray-400 truncate">{v.t}</span>
          </nav>

          {/* ── Category badge ──────────────────────────────────────── */}
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-2">
            {CAT_ICONS[v.c]} {PL_CAT[v.c]}
          </p>

          {/* ── Title ───────────────────────────────────────────────── */}
          <h1 className="text-white font-extrabold text-[26px] sm:text-[30px] leading-tight mb-3">
            {v.t}
          </h1>

          {/* ── Key info row ────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            {salStr && (
              <span className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-lg px-3 py-1.5 text-[13px] font-black">
                {salStr}
              </span>
            )}
            <span className="text-gray-400 text-[13px]">
              📍 {v.l}, {countryName}
            </span>
            {v.b.map((badge) => {
              const meta = PL_BADGE[badge];
              if (!meta) return null;
              return (
                <span key={badge} className={`text-[11px] font-bold border rounded-md px-2 py-1 ${meta.color}`}>
                  {meta.label}
                </span>
              );
            })}
          </div>

          {/* ── Wymagania ───────────────────────────────────────────── */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-5 mb-6">
            <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-3">Wymagania</p>
            <ul className="space-y-2 text-[13px] text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                Obywatelstwo UE (wymagane)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                Komunikatywna znajomość języka angielskiego
              </li>
              {v.b.includes("car") && (
                <li className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  Własny samochód / prawo jazdy
                </li>
              )}
              {v.b.includes("eng") && (
                <li className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">✓</span>
                  Dodatkowe wymagania językowe
                </li>
              )}
            </ul>
          </div>

          {/* ── Co oferujemy ────────────────────────────────────────── */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-5 mb-6">
            <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-3">Co oferujemy</p>
            <ul className="space-y-2 text-[13px] text-gray-300">
              {salStr && (
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  Wynagrodzenie: {salStr}
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                Natychmiastowe zatrudnienie
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                Umowa o pracę UE
              </li>
              {v.b.includes("acc") && (
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  Zakwaterowanie wliczone
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                Odpowiedź w ciągu 24h
              </li>
            </ul>
          </div>

          {/* ── CTA ─────────────────────────────────────────────────── */}
          <JobApplyButton
            waBase={WA_BASE}
            jobTitle={v.t}
            source={`pl-job-${v.c}`}
            jobId={v.slug}
          />

          <p className="text-center text-gray-600 text-[11px] mb-8">
            Weryfikacja obywatelstwa UE · Otwiera WhatsApp
          </p>

          {/* ── Powiązane oferty ─────────────────────────────────────── */}
          {related.length > 0 && (
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3">
                Więcej ofert: {PL_CAT[v.c]}
              </p>
              <div className="flex flex-col gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/pl/oferty-pracy/${r.slug}`}
                    className="
                      flex items-center justify-between gap-3
                      rounded-xl border border-white/[0.07] bg-white/[0.03]
                      hover:bg-white/[0.07] px-4 py-3.5
                      transition-all duration-150 group
                    "
                  >
                    <div>
                      <p className="text-white text-[13px] font-semibold group-hover:text-emerald-300 transition-colors">
                        {r.t}
                      </p>
                      <p className="text-gray-500 text-[11px] mt-0.5">📍 {r.l}</p>
                    </div>
                    {r.sm > 0 && (
                      <span className="text-emerald-400 text-[11px] font-bold shrink-0">{r.s}</span>
                    )}
                  </Link>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/pl/oferty-pracy"
                  className="text-[12px] font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                >
                  ← Wszystkie oferty pracy ({VACANCIES.length})
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
