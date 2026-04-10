import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AgencyCard from "@/components/AgencyCard";
import { getIssueBySlug, allIssueSlugs, ISSUE_TYPES } from "@/lib/seoData";
import { AGENCIES } from "@/lib/agencyData";

// ─── Static params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return allIssueSlugs().map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const issue = getIssueBySlug(params.slug);
  if (!issue) return { title: "Issue not found" };
  return {
    title:       `${issue.title} — Agency Issues — AgencyCheck`,
    description: issue.description,
    alternates:  { canonical: `https://agencycheck.io/issues/${params.slug}` },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IssuePage({ params }: { params: { slug: string } }) {
  const issue = getIssueBySlug(params.slug);
  if (!issue) notFound();

  // Agencies that have reported issues (use issueCount > 0 as proxy for all types)
  // In production: filter by issueType === issue.prismaType
  const agenciesWithIssues = [...AGENCIES]
    .filter((a) => (a.issueCount ?? 0) > 0)
    .sort((a, b) => (b.issueCount ?? 0) - (a.issueCount ?? 0))
    .slice(0, 6);

  const cleanAgencies = AGENCIES
    .filter((a) => (a.issueCount ?? 0) === 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const otherIssues = Object.values(ISSUE_TYPES).filter((i) => i.slug !== params.slug);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ── */}
      <nav className="text-xs text-gray-400 mb-5 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <Link href="/agencies" className="hover:text-brand-600">Agencies</Link>
        <span>›</span>
        <span className="text-gray-600">Issue: {issue.title}</span>
      </nav>

      {/* ── Issue header ── */}
      <div className="card border-l-4 border-l-orange-400 p-5 mb-7">
        <div className="flex items-start gap-4">
          <span className="text-4xl shrink-0">{issue.icon}</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{issue.title}</h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{issue.description}</p>
          </div>
        </div>
      </div>

      {/* ── Know your rights ── */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-7">
        <p className="text-sm font-semibold text-blue-800 mb-2">⚖️ Know your rights</p>
        <p className="text-sm text-blue-700 leading-relaxed">{issue.guidance}</p>
        {issue.relatedLinks.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {issue.relatedLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-700 underline hover:text-blue-900"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Report CTA ── */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-semibold text-orange-800 text-sm">
            {issue.icon} Experienced this at an agency?
          </p>
          <p className="text-xs text-orange-700 mt-0.5">
            Submit an anonymous report to warn other workers.
          </p>
        </div>
        <Link
          href="/agencies"
          className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Report on agency profile →
        </Link>
      </div>

      {/* ── Agencies with reported issues ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">
            Agencies with reported issues
          </h2>
          <span className="text-xs text-orange-500 font-medium">
            {agenciesWithIssues.length} reported
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-4 -mt-2">
          Sorted by number of open issue reports. Data is community-reported and unverified.
        </p>

        {agenciesWithIssues.length === 0 ? (
          <div className="card p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">🟢</p>
            <p className="text-sm font-semibold">No agencies reported for this issue type yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {agenciesWithIssues.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
        )}
      </section>

      {/* ── Clean agencies ── */}
      {cleanAgencies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            🟢 Agencies with no reported issues
          </h2>
          <p className="text-xs text-gray-400 mb-4">Based on community reports — always do your own research.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {cleanAgencies.map((agency) => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
        </section>
      )}

      {/* ── Other issue types ── */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Other common issues
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {otherIssues.map((i) => (
            <Link
              key={i.slug}
              href={`/issues/${i.slug}`}
              className="card p-3 hover:border-brand-200 hover:shadow-sm transition-all"
            >
              <span className="text-xl">{i.icon}</span>
              <p className="text-xs font-semibold text-gray-800 mt-1.5 leading-snug">{i.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-8 text-xs text-gray-400 text-center">
        Issue reports are worker-submitted and informational. AgencyCheck does not verify reports and
        is not a legal service. Always seek professional legal advice for employment disputes.
      </p>
    </div>
  );
}
