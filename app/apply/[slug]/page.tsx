import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import JobApplyButton from "@/components/JobApplyButton";
import {
  VACANCIES,
  getVacancyBySlug,
  getCountry,
  buildDescription,
  getAddressMeta,
  getSalaryUnit,
  CAT_LABELS,
  CAT_ICONS,
  BADGE_META,
} from "@/lib/vacanciesData";

const WA_BASE = "https://wa.me/31613754893";

// ─── Static generation ────────────────────────────────────────────────────────
// Only slugs returned here are pre-rendered. Any other slug returns 404
// immediately (no dynamic render, no server code, no 500 risk).
export async function generateStaticParams() {
  return VACANCIES.map((v) => ({ slug: v.slug }));
}

// Never run server code for unknown slugs — clean 404 at the framework level.
export const dynamicParams = false;

// Belt-and-suspenders: force the entire segment to be purely static.
// Prevents Sentry instrumentation or parent-layout ISR from triggering
// a dynamic server render of this page, which is the root cause of the
// intermittent 5xx errors (try/catch was swallowing Next.js redirect throws).
export const dynamic = "force-static";

// ─── Slug validation ──────────────────────────────────────────────────────────
const MAX_SLUG_LEN = 120;

function isValidSlug(raw: unknown): raw is string {
  return (
    typeof raw === "string" &&
    raw.trim().length > 0 &&
    raw.length <= MAX_SLUG_LEN &&
    /^[a-z0-9-]+$/.test(raw)          // only lowercase alphanumeric + hyphens
  );
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params;

    if (!isValidSlug(slug)) return { title: "Job not found" };

    const v = getVacancyBySlug(slug);
    if (!v) return { title: "Job not found" };

    const country     = getCountry(v.l);
    const countryName = country === "NL" ? "Netherlands" : country === "GR" ? "Greece" : "Belgium";
    const salStr      = v.sm > 0 ? ` · ${v.s}` : "";

    return {
      title:       `${v.t} in ${v.l}${salStr} — Now Hiring | AgencyCheck`,
      description: buildDescription(v),
      alternates:  { canonical: `https://agencycheck.io/apply/${v.slug}` },
      openGraph: {
        title:       `${v.t} — Now Hiring in ${v.l}, ${countryName}`,
        description: buildDescription(v),
        url:         `https://agencycheck.io/apply/${v.slug}`,
        type:        "website",
      },
    };
  } catch (err) {
    console.error("[apply/[slug]] generateMetadata error:", err);
    return { title: "Job not found" };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function JobPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // ── Slug validation ───────────────────────────────────────────────────────
  // IMPORTANT: do NOT wrap redirect() / notFound() in a try/catch.
  // They work by throwing special errors (NEXT_REDIRECT, NEXT_NOT_FOUND).
  // If caught and re-thrown from a catch block, Sentry's instrumentation
  // mis-identifies them as application errors and returns 500.
  // Letting them bubble from the top level is the only safe pattern.
  if (!isValidSlug(slug)) {
    redirect("/apply");
  }

  // ── Vacancy lookup ────────────────────────────────────────────────────────
  const v = getVacancyBySlug(slug);
  if (!v) {
    notFound();
  }

  const country     = getCountry(v.l);
  const countryName = country === "NL" ? "Netherlands" : country === "GR" ? "Greece" : "Belgium";
  const salStr      = v.sm > 0 ? v.s : null;
  const addrMeta    = getAddressMeta(v.l);

  // ── Related jobs (same category, different slug, max 3) ───────────────────
  const related = VACANCIES.filter((r) => r.c === v.c && r.slug !== v.slug).slice(0, 3);

  // ── JobPosting JSON-LD ─────────────────────────────────────────────────────
  const jobPosting: Record<string, unknown> = {
    "@context":          "https://schema.org",
    "@type":             "JobPosting",
    title:               v.t,
    description:         buildDescription(v),
    hiringOrganization: {
      "@type":  "Organization",
      name:     "AgencyCheck",
      sameAs:   "https://agencycheck.io",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type":           "PostalAddress",
        streetAddress:     addrMeta.streetAddress,
        addressLocality:   addrMeta.addressLocality,
        addressRegion:     addrMeta.addressRegion,
        postalCode:        addrMeta.postalCode,
        addressCountry:    country,
      },
    },
    employmentType:   "FULL_TIME",
    // datePosted = today so Google Jobs treats this as a fresh listing.
    // validThrough = 90 days from today — rolling window so listings never
    // silently expire and disappear from Google Jobs results.
    datePosted:       new Date().toISOString().split("T")[0],
    validThrough:     new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    directApply:      true,
    applicantLocationRequirements: {
      "@type": "Country",
      name:    "European Union",
    },
  };

  if (v.sm > 0) {
    // maxValue is always emitted — set to minValue for single-rate jobs so
    // Google does not warn about missing maxValue in baseSalary.value.
    jobPosting.baseSalary = {
      "@type":    "MonetaryAmount",
      currency:   "EUR",
      value: {
        "@type":    "QuantitativeValue",
        minValue:   v.sm,
        maxValue:   v.sx > 0 ? v.sx : v.sm,
        unitText:   getSalaryUnit(v.s),
      },
    };
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",        item: "https://agencycheck.io" },
      { "@type": "ListItem", position: 2, name: "Actual Jobs", item: "https://agencycheck.io/apply" },
      { "@type": "ListItem", position: 3, name: v.t,           item: `https://agencycheck.io/apply/${v.slug}` },
    ],
  };

  return (
      <>
        {/* ── Structured data ─────────────────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />

        <div className="min-h-screen bg-[#0B1F14] text-white">
          <div className="max-w-2xl mx-auto px-4 pt-8 pb-20">

            {/* ── Breadcrumb ──────────────────────────────────────────── */}
            <nav className="flex items-center gap-1.5 text-[11px] text-gray-600 mb-6">
              <Link href="/" className="hover:text-gray-400">Home</Link>
              <span>›</span>
              <Link href="/apply" className="hover:text-gray-400">Actual Jobs</Link>
              <span>›</span>
              <span className="text-gray-400 truncate">{v.t}</span>
            </nav>

            {/* ── Category badge ──────────────────────────────────────── */}
            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-2">
              {CAT_ICONS[v.c]} {CAT_LABELS[v.c]}
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
                const meta = BADGE_META[badge];
                if (!meta) return null; // unknown badge — skip rather than crash
                return (
                  <span
                    key={badge}
                    className={`text-[11px] font-bold border rounded-md px-2 py-1 ${meta.color}`}
                  >
                    {meta.label}
                  </span>
                );
              })}
            </div>

            {/* ── Requirements card ───────────────────────────────────── */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-5 mb-6">
              <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-3">Requirements</p>
              <ul className="space-y-2 text-[13px] text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  EU citizenship (mandatory)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  English communication skills
                </li>
                {v.b.includes("car") && (
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400 font-bold">✓</span>
                    Own car / driving licence required
                  </li>
                )}
                {v.b.includes("eng") && (
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">✓</span>
                    Additional language requirements apply
                  </li>
                )}
              </ul>
            </div>

            {/* ── What we offer ───────────────────────────────────────── */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-5 mb-6">
              <p className="text-[12px] font-black uppercase tracking-widest text-gray-500 mb-3">What we offer</p>
              <ul className="space-y-2 text-[13px] text-gray-300">
                {salStr && (
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    Salary: {salStr}
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  Immediate start
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  EU work contract
                </li>
                {v.b.includes("acc") && (
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    Accommodation included
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  Reply within 24h
                </li>
              </ul>
            </div>

            {/* ── Apply CTA ───────────────────────────────────────────── */}
            {/* JobApplyButton is a "use client" component that owns the
                ApplyPreScreen render-prop internally. Passing a function
                directly from this Server Component to ApplyPreScreen would
                violate RSC serialisation rules (functions aren't JSON-
                serialisable). JobApplyButton accepts only plain strings. */}
            <JobApplyButton
              waBase={WA_BASE}
              jobTitle={v.t}
              source={`job-page-${v.c}`}
              jobId={v.slug}
            />

            <p className="text-center text-gray-600 text-[11px] mb-8">
              EU citizenship check · Opens WhatsApp directly
            </p>

            {/* ── Related jobs ────────────────────────────────────────── */}
            {related.length > 0 && (
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3">
                  More {CAT_LABELS[v.c]} jobs
                </p>
                <div className="flex flex-col gap-2">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/apply/${r.slug}`}
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
                    href="/apply"
                    className="text-[12px] font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                  >
                    ← Back to all {VACANCIES.length} vacancies
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </>
    );
}
