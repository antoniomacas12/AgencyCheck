import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For Employment Agencies — AgencyCheck",
  description:
    "Information for employment agencies listed on AgencyCheck. How to dispute inaccurate data, understand your transparency score, and how worker data is handled.",
  alternates: { canonical: "/for-agencies" },
};

export default function ForAgenciesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">For Employment Agencies</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          AgencyCheck lists 150+ verified employment agencies operating in the Netherlands.
          This page explains how our platform works, what your profile contains, and how to
          respond if information about your agency is incorrect.
        </p>
      </div>

      {/* What AgencyCheck is */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What AgencyCheck is</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          AgencyCheck is an independent, worker-funded transparency platform. We are not a job board,
          a recruiter, or a review aggregator that can be paid to alter results. We compile publicly
          available information about employment agencies to help workers make informed decisions
          before they sign a placement contract.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Our database was built through individual research of each listed agency: visiting official
          websites, checking public registers (ABU, SNCU), verifying contact details, and documenting
          the sectors and job types each agency serves.
        </p>
      </section>

      {/* What your profile contains */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What your profile contains</h2>
        <div className="space-y-3">
          {[
            {
              field: "Agency name and slug",
              source: "Official website / ABU register",
              note: "Your registered trading name. Variations and aliases are noted.",
            },
            {
              field: "Website, phone, email, address",
              source: "Official website",
              note: "Publicly listed contact details from your website as of March 2026.",
            },
            {
              field: "Agency type / sector",
              source: "Research-verified",
              note: "The sector(s) your agency primarily fills (e.g. IT & Technology, Logistics, Office & Admin).",
            },
            {
              field: "Job focus",
              source: "Research-verified",
              note: "The specific job titles your agency is known to place (e.g. Software Developer, Order Picker).",
            },
            {
              field: "Transparency score (0–100)",
              source: "Computed from data signals",
              note: "Reflects how much verifiable public data exists for your agency — not an endorsement or opinion score.",
            },
            {
              field: "Description",
              source: "Research-written",
              note: "A factual summary of your agency written from publicly available information.",
            },
            {
              field: "Worker reviews and reports",
              source: "Community-submitted",
              note: "Anonymous worker submissions. We do not verify these but display them transparently.",
            },
          ].map((row) => (
            <div key={row.field} className="card p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <p className="font-semibold text-gray-800 text-sm">{row.field}</p>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">
                  {row.source}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{row.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency score explained */}
      <section className="mb-10 bg-brand-50 border border-brand-100 rounded-2xl p-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          Understanding your transparency score
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Your transparency score (0–100) measures how much verifiable public information exists
          for your agency. It is <em>not</em> a quality rating or recommendation. A score of 70+
          means we were able to verify your website, contact details, sector, and description.
          A lower score means less information was publicly available at the time of our research.
        </p>
        <div className="grid grid-cols-3 gap-3 text-xs">
          {[
            { range: "70–100", label: "High confidence", cls: "bg-green-100 text-green-800" },
            { range: "50–69", label: "Partial data", cls: "bg-amber-100 text-amber-800" },
            { range: "0–49", label: "Limited data", cls: "bg-red-100 text-red-800" },
          ].map((t) => (
            <div key={t.range} className={`rounded-lg p-2 text-center ${t.cls}`}>
              <p className="font-bold text-base">{t.range}</p>
              <p className="mt-0.5">{t.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Your score may increase in future reviews if we can verify additional data points.
        </p>
      </section>

      {/* What you can do */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What you can do</h2>
        <div className="space-y-4">

          <div className="card p-5">
            <div className="flex items-start gap-4">
              <span className="text-2xl shrink-0">✏️</span>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Request a factual correction</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  If your profile contains factually incorrect information — a wrong phone number,
                  outdated address, or incorrect sector — email us with the correct data. We verify
                  all correction requests against publicly available sources and update within 5
                  working days.
                </p>
                <a
                  href="mailto:corrections@agencycheck.nl"
                  className="inline-block text-xs border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  corrections@agencycheck.nl
                </a>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-start gap-4">
              <span className="text-2xl shrink-0">📋</span>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Dispute a worker review</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  If a worker review contains verifiable factual errors (not just negative opinions),
                  you can request a review. We take factual disputes seriously. We will not remove
                  reviews because an agency disagrees with the opinion expressed.
                </p>
                <a
                  href="mailto:agencies@agencycheck.nl"
                  className="inline-block text-xs border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  agencies@agencycheck.nl
                </a>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-start gap-4">
              <span className="text-2xl shrink-0">🔍</span>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Improve your transparency score</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Transparency scores are computed from data signals. Agencies with publicly accessible
                  websites, clear contact details, detailed job descriptions, and sector information
                  naturally score higher. Ensuring your website is up to date and your contact details
                  are publicly listed will improve your score in future research cycles.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* What we will not do */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What we will not do</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-900 space-y-2 leading-relaxed">
          <p>
            <strong>We do not accept payment to alter agency profiles.</strong> Your transparency
            score, profile data, and position in listings are entirely based on research data and
            worker reports — never on commercial arrangements.
          </p>
          <p>
            <strong>We will not remove agencies from the platform</strong> at the request of the
            agency unless there are exceptional legal circumstances. Our commitment is to workers
            who need this information to make safe decisions.
          </p>
          <p>
            <strong>We will not remove legitimate worker reviews</strong> because an agency
            considers them unfair. Negative worker experiences, honestly reported, are exactly
            the information this platform exists to surface.
          </p>
        </div>
      </section>

      {/* Register compliance note */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ABU / SNCU compliance</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          AgencyCheck cross-references agency data with the ABU (Algemene Bond Uitzendondernemingen)
          and SNCU (Stichting Naleving CAO voor Uitzendkrachten) public registers. Being ABU-certified
          or SNCU-registered is a positive signal that we note on your profile.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          If your agency has recently joined the ABU or SNCU register and this is not reflected
          in your profile, please notify us so we can update it.
        </p>
      </section>

      {/* Contact CTA */}
      <div className="card p-6 text-center">
        <p className="text-2xl mb-3">📬</p>
        <p className="font-bold text-gray-900 text-sm mb-2">Get in touch</p>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed max-w-sm mx-auto">
          For corrections, disputes, or any question about your agency&apos;s profile on AgencyCheck,
          contact our team directly.
        </p>
        <a
          href="mailto:agencies@agencycheck.nl"
          className="inline-block bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          agencies@agencycheck.nl
        </a>
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-400">
        <Link href="/about" className="hover:text-brand-600">About AgencyCheck</Link>
        <Link href="/terms" className="hover:text-brand-600">Terms of use</Link>
        <Link href="/privacy" className="hover:text-brand-600">Privacy policy</Link>
        <Link href="/contact" className="hover:text-brand-600">Contact</Link>
      </div>

    </div>
  );
}
