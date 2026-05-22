import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ApplyPreScreen from "@/components/ApplyPreScreen";
import {
  VACANCIES,
  getVacancyBySlug,
  getCountry,
  buildDescription,
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
  // Resolve slug outside try/catch so it's available for error logging below.
  // In Next.js 14, params is a plain object; await is safe on non-Promises.
  const { slug } = await params;

  try {
    // ── Slug validation ─────────────────────────────────────────────────────
    if (!isValidSlug(slug)) {
      console.warn(`[apply/[slug]] invalid slug rejected: "${String(slug).slice(0, 60)}"`);
      redirect("/apply");
    }

    // ── Vacancy lookup ──────────────────────────────────────────────────────
    const v = getVacancyBySlug(slug);
    if (!v) {
      console.warn(`[apply/[slug]] no vacancy for slug: "${slug}"`);
      notFound();
    }

    const country     = getCountry(v.l);
    const countryName = country === "NL" ? "Netherlands" : country === "GR" ? "Greece" : "Belgium";
    const salStr      = v.sm > 0 ? v.s : null;

    // ── Related jobs (same category, different slug, max 3) ─────────────────
    const related = VACANCIES.filter((r) => r.c === v.c && r.slug !== v.slug).slice(0, 3);

    // ── JobPosting JSON-LD ───────────────────────────────────────────────────
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
          "@type":          "PostalAddress",
          addressLocality:  v.l,
          addressCountry:   country,
        },
      },
      employmentType:   "FULL_TIME",
      datePosted:       "2026-05-01",
      validThrough:     "2026-09-30",
      directApply:      true,
      applicantLocationRequirements: {
        "@type": "Country",
        name:    "European Union",
      },
    };

    if (v.sm > 0) {
      jobPosting.baseSalary = {
        "@type":    "MonetaryAmount",
        currency:   "EUR",
        value: {
          "@type":    "QuantitativeValue",
          minValue:   v.sm,
          ...(v.sx > 0 ? { maxValue: v.sx } : {}),
          unitText:   "WEEK",
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
            <ApplyPreScreen
              waBase={WA_BASE}
              jobTitle={v.t}
              source={`job-page-${v.c}`}
              jobId={v.slug}
              referralMode
            >
              {(openFn) => (
                <button
                  onClick={openFn}
                  className="
                    w-full flex items-center justify-center gap-2.5
                    bg-[#22C55E] hover:bg-green-400 active:scale-[0.98]
                    text-white font-black text-[16px]
                    py-4 rounded-2xl
                    shadow-lg shadow-green-900/30
                    transition-all duration-150
                    mb-3
                  "
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Apply via WhatsApp
                </button>
              )}
            </ApplyPreScreen>

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
                    ← Back to all 65 vacancies
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </>
    );

  } catch (err) {
    // ── CRITICAL: re-throw Next.js internal errors BEFORE any user handling ──
    // redirect() and notFound() work by throwing special errors (NEXT_REDIRECT,
    // NEXT_NOT_FOUND). If caught here and not re-thrown, Sentry's instrumentation
    // wrapper mis-handles them and returns 500 instead of a redirect/404.
    const digest = (err as { digest?: string })?.digest ?? "";
    if (digest.startsWith("NEXT_")) throw err;

    // ── Genuine unexpected error ──────────────────────────────────────────────
    console.error("[apply/[slug]] unexpected page error", {
      route:   "/apply/[slug]",
      slug,
      message: err instanceof Error ? err.message : String(err),
      stack:   err instanceof Error ? err.stack : undefined,
    });
    redirect("/apply");
  }
}
