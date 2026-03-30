import type { Metadata } from "next";
import Link from "next/link";
import { ALL_AGENCIES } from "@/lib/agencyEnriched";

export const metadata: Metadata = {
  title: "Share Your Agency Experience — Help Other Workers — AgencyCheck",
  description:
    "Did you work through an employment agency in the Netherlands? Share your experience — real salary, housing conditions, and working environment. Your information helps other workers make informed decisions.",
  alternates: { canonical: "/share-experience" },
  robots: { index: true, follow: true },
};

// Top agencies sorted by transparency score (most data = most useful to review)
const TOP_AGENCIES = [...ALL_AGENCIES]
  .sort((a, b) => b.transparencyScore - a.transparencyScore)
  .slice(0, 20);

export default function ShareExperiencePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-gray-600">Share your experience</span>
      </nav>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Share your agency experience
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Did you work through an employment agency in the Netherlands? Your experience
          matters. Workers who share real salary data, housing conditions, and workplace
          reality help thousands of others make safer decisions before signing a contract.
        </p>
      </header>

      {/* ── Why it matters ─────────────────────────────────────────────────── */}
      <section className="bg-brand-50 border border-brand-100 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-bold text-brand-800 mb-3">Why your experience matters</h2>
        <div className="space-y-2.5">
          {[
            {
              icon: "💶",
              title: "Real salary data",
              text: "Many workers receive less than promised. Your data helps expose the real gap between advertised and actual pay.",
            },
            {
              icon: "🏠",
              title: "Housing conditions",
              text: "Is the agency housing actually liveable? Are deductions fair? Workers report what websites don't show.",
            },
            {
              icon: "⚠️",
              title: "Workplace violations",
              text: "Underpayment, unsafe conditions, missing overtime — your report helps others avoid the same situations.",
            },
          ].map(({ icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="text-lg shrink-0 mt-0.5">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-700 mb-4">How to share your experience</h2>
        <ol className="space-y-3">
          {[
            "Find your agency in the list below or search by name",
            "Open the agency profile page",
            "Scroll to the \"Share your experience\" section at the bottom",
            "Choose: leave a review, report your salary, or flag an issue",
            "All submissions are anonymous — your identity is never shared",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm text-gray-600">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── What you can report ────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {[
          {
            icon: "⭐",
            title: "Leave a review",
            text: "Rate working conditions, housing, salary, and treatment. Help workers know what to expect.",
          },
          {
            icon: "💶",
            title: "Report your salary",
            text: "Share your hourly rate, deductions, and take-home pay. Your data improves salary transparency.",
          },
          {
            icon: "⚠️",
            title: "Report an issue",
            text: "Flag violations: underpayment, late wages, safety problems, or housing conditions.",
          },
        ].map(({ icon, title, text }) => (
          <div key={title} className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-2xl mb-2">{icon}</p>
            <p className="text-sm font-semibold text-gray-800 mb-1">{title}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
          </div>
        ))}
      </section>

      {/* ── Search / browse agencies ───────────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-bold text-gray-700 mb-3">
          Find your agency
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Select an agency below to open its profile, then scroll to &ldquo;Share your experience&rdquo;.
          Don&apos;t see yours?{" "}
          <Link href="/agencies" className="text-brand-600 underline hover:text-brand-800">
            Browse all 150+ agencies →
          </Link>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TOP_AGENCIES.map((agency) => (
            <Link
              key={agency.slug}
              href={`/agencies/${agency.slug}#submit`}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/30 transition-colors group"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 group-hover:text-brand-700 truncate leading-snug">
                  {agency.name}
                </p>
                <p className="text-xs text-gray-400">
                  {agency.city}
                  {agency.housing === "YES" ? " · 🏠 housing" : ""}
                </p>
              </div>
              <span className="text-xs text-brand-600 font-medium shrink-0 ml-2">
                Share →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/agencies"
            className="text-sm font-semibold text-brand-600 hover:text-brand-800 underline"
          >
            View all 150+ agencies →
          </Link>
        </div>
      </section>

      {/* ── Anonymous notice ───────────────────────────────────────────────── */}
      <div className="mt-10 bg-gray-50 border border-gray-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-600 mb-1">🔒 Your privacy is protected</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          All submissions are completely anonymous. We do not collect your name, email address,
          or any identifying information. Your report cannot be traced back to you. AgencyCheck
          is an independent worker transparency platform — not affiliated with any employment agency.
        </p>
      </div>
    </main>
  );
}
