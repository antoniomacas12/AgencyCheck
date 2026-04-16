import type { Metadata } from "next";
import { notFound }       from "next/navigation";
import Link               from "next/link";
import { GUIDES, getGuide } from "@/lib/guideData";
import { ALL_AGENCY_MAP }   from "@/lib/agencyEnriched";
import { CITIES }           from "@/lib/seoData";
import {
  faqPageSchema,
  breadcrumbSchema,
  articleSchema,
} from "@/lib/schemaMarkup";

// ─── Static params — all guide slugs ─────────────────────────────────────────
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const guide = getGuide(params.slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title:       guide.metaTitle,
    description: guide.metaDesc,
    alternates:  { canonical: `https://agencycheck.io/guides/${guide.slug}` },
    openGraph: {
      title:       guide.metaTitle,
      description: guide.metaDesc,
    },
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="mb-7">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 leading-snug">
        {heading}
      </h2>
      <div
        className="text-sm text-gray-700 leading-relaxed space-y-3 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_a]:text-brand-600 [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </section>
  );
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <p className="text-sm font-bold text-gray-900 mb-1.5">
        <span className="text-brand-600 mr-2">{index + 1}.</span>{question}
      </p>
      <p className="text-sm text-gray-600 leading-relaxed">{answer}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  // Related agencies — pull from real data, skip missing slugs
  const relatedAgencies = guide.relatedAgencySlugs
    .map((s) => ALL_AGENCY_MAP[s])
    .filter(Boolean);

  // Related cities — pull from CITIES array
  const relatedCities = guide.relatedCitySlugs
    .map((slug) => CITIES.find((c) => c.slug === slug))
    .filter(Boolean);

  // JSON-LD
  const artSchema  = articleSchema({
    title:         guide.title,
    description:   guide.metaDesc,
    slug:          guide.slug,
    datePublished: guide.datePublished,
    dateModified:  guide.dateModified,
  });
  const faqSchemaObj = faqPageSchema(guide.faqs);
  const crumbSchema  = breadcrumbSchema([
    { name: "Home",   url: "/" },
    { name: "Guides", url: "/guides" },
    { name: guide.title.slice(0, 50), url: `/guides/${guide.slug}` },
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* ── JSON-LD ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artSchema)    }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaObj) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema)  }} />

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/guides" className="hover:text-brand-600">Guides</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium truncate max-w-[200px]">{guide.title.split("—")[0].trim()}</span>
      </nav>

      {/* ── Hero ── */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2.5 py-1 font-medium">
            📖 {guide.badge}
          </span>
          <span className="text-xs text-gray-400">
            Updated {guide.dateModified}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
          {guide.title}
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          {guide.intro}
        </p>
      </header>

      {/* ── Table of contents ── */}
      <nav className="card p-4 mb-8">
        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Contents</p>
        <ol className="space-y-1">
          {guide.sections.map((s, i) => (
            <li key={i}>
              <a
                href={`#section-${i}`}
                className="text-sm text-brand-600 hover:underline leading-snug"
              >
                {i + 1}. {s.heading}
              </a>
            </li>
          ))}
          <li>
            <a href="#faq" className="text-sm text-brand-600 hover:underline">
              {guide.sections.length + 1}. Frequently asked questions
            </a>
          </li>
        </ol>
      </nav>

      {/* ── Sections ── */}
      <article>
        {guide.sections.map((s, i) => (
          <div key={i} id={`section-${i}`}>
            <Section heading={s.heading} body={s.body} />
            {/* After section 2, inject a relevant agency widget */}
            {i === 2 && relatedAgencies.length > 0 && (
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-7">
                <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-2">
                  Related agencies on AgencyCheck
                </p>
                <div className="flex flex-wrap gap-2">
                  {relatedAgencies.map((a) => (
                    <Link
                      key={a!.slug}
                      href={`/agencies/${a!.slug}`}
                      className="text-sm font-medium text-brand-700 bg-white border border-brand-100 rounded-lg px-3 py-1.5 hover:bg-brand-100 transition-colors"
                    >
                      {a!.name} →
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </article>

      {/* ── FAQ ── */}
      <section id="faq" className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Frequently asked questions
        </h2>
        <div className="card p-5 space-y-4">
          {guide.faqs.map((faq, i) => (
            <FaqItem key={i} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </div>
      </section>

      {/* ── Internal linking ── */}
      <section className="mb-8">
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Related cities */}
          {relatedCities.length > 0 && (
            <div className="card p-4">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                Related cities
              </p>
              <div className="space-y-1">
                {relatedCities.map((c) => (
                  <Link
                    key={c!.slug}
                    href={`/cities/${c!.slug}`}
                    className="block text-sm text-brand-600 hover:underline"
                  >
                    Agency jobs in {c!.name} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tools + other guides */}
          <div className="card p-4">
            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
              Useful tools
            </p>
            <div className="space-y-1">
              <Link href="/tools/real-income-calculator" className="block text-sm text-brand-600 hover:underline">
                Real income calculator →
              </Link>
              <Link href="/tools/payslip-checker" className="block text-sm text-brand-600 hover:underline">
                Payslip checker →
              </Link>
              <Link href="/agencies-with-housing" className="block text-sm text-brand-600 hover:underline">
                Agencies with housing →
              </Link>
              <Link href="/reviews" className="block text-sm text-brand-600 hover:underline">
                Worker reviews →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Other guides ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-800 mb-3">More guides</h2>
        <div className="space-y-2">
          {GUIDES.filter((g) => g.slug !== guide.slug).map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="card px-4 py-3 flex items-center justify-between hover:border-brand-200 hover:bg-brand-50/30 transition-all"
            >
              <span className="text-sm font-medium text-gray-800">{g.title.split("(")[0].trim()}</span>
              <span className="text-brand-600 text-sm shrink-0 ml-3">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="bg-gray-900 rounded-2xl px-6 py-6 text-white text-center">
        <p className="font-black text-base mb-1">Find a verified agency in the Netherlands</p>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          {relatedAgencies.length > 0
            ? `${relatedAgencies.length} agencies related to this guide are profiled on AgencyCheck.`
            : "All agencies on AgencyCheck are profiled with real worker reviews."}
          {" "}No paid rankings. No sponsored results.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/agencies"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-black text-sm px-5 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Browse all agencies →
          </Link>
          <Link
            href="/agencies-with-housing"
            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Agencies with housing →
          </Link>
        </div>
      </div>
    </div>
  );
}
