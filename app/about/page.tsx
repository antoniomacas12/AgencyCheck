import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About AgencyCheck — Worker Transparency for Employment Agencies",
  description:
    "AgencyCheck is a worker-powered transparency platform for employment agencies in the Netherlands. Learn how we collect data, what we stand for, and how you can contribute.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">✅</span>
          <h1 className="text-3xl font-bold text-gray-900">About AgencyCheck</h1>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          AgencyCheck is a free, worker-powered transparency platform for employment agencies in the Netherlands.
          We exist to give workers honest, verifiable information before they sign a contract — so you know
          what you&apos;re getting into.
        </p>
      </div>

      {/* What we do */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What we do</h2>
        <div className="prose prose-gray max-w-none text-sm text-gray-600 leading-relaxed space-y-4">
          <p>
            The Netherlands has over 15,000 registered employment agencies. Most workers — especially
            those arriving from abroad — have no way to know which agencies are trustworthy, which provide
            housing at fair deductions, and which ones have a history of payslip errors, late payments,
            or overcrowded accommodation.
          </p>
          <p>
            AgencyCheck brings together research data, worker-reported experiences, and public register
            information to create transparent agency profiles. Every agency in our database has been
            individually researched: we visit their websites, verify their contact details, check their
            sector focus, and note any red flags.
          </p>
          <p>
            Our transparency scores are not opinion — they are computed from verifiable signals: does
            the agency have a working website? Do they publish their contact details? Do they clearly
            describe the jobs they fill? The score tells you how much data we could verify, not whether
            we think an agency is &quot;good&quot; or &quot;bad&quot;.
          </p>
        </div>
      </section>

      {/* Our mission */}
      <section className="mb-10 bg-brand-50 border border-brand-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Our mission</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Workers should never have to sign a contract blind. Whether you&apos;re looking for logistics work
          in Amsterdam, warehouse roles in Tilburg, or hospitality jobs near Schiphol — you deserve to
          know the agency&apos;s reputation, what they charge for housing, and how other workers have rated
          their experience. AgencyCheck makes that information free, accessible, and honest.
        </p>
      </section>

      {/* How we collect data */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How we collect data</h2>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <div className="flex gap-4">
            <span className="text-2xl shrink-0">🔍</span>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Agency research</p>
              <p>
                Each agency in our database has been individually researched using their official website,
                public registers (including the ABU and SNCU member registers), LinkedIn profiles, and
                sector directories. We record what we can verify and flag what we cannot.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-2xl shrink-0">👷</span>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Worker reports</p>
              <p>
                Workers who have worked through an agency can submit anonymous reviews, salary reports,
                and issue reports. We do not verify these reports, but we display them transparently so
                future workers can weigh them alongside our research data.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-2xl shrink-0">📋</span>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Public registers</p>
              <p>
                We cross-reference agency data with the official ABU (Algemene Bond Uitzendondernemingen)
                and SNCU (Stichting Naleving CAO voor Uitzendkrachten) registers to verify registration
                status and CAO compliance.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-2xl shrink-0">📅</span>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Regular updates</p>
              <p>
                Agency data is reviewed periodically. If an agency&apos;s website, contact details, or
                sector focus changes, we update their profile. Our dataset was last reviewed in March 2026.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency score */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What is the transparency score?</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Every agency receives a transparency score from 0 to 100. This score reflects how much
          verifiable information exists for that agency — not whether we recommend them.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { range: "70–100", label: "High confidence", color: "bg-green-50 border-green-200 text-green-800", note: "Website verified, contact details present, sector clearly stated" },
            { range: "50–69", label: "Medium confidence", color: "bg-amber-50 border-amber-200 text-amber-800", note: "Some data verified, partial contact info or unclear sector" },
            { range: "0–49", label: "Limited data", color: "bg-red-50 border-red-200 text-red-800", note: "Minimal verifiable data — research directly before applying" },
          ].map((tier) => (
            <div key={tier.range} className={`rounded-xl border p-4 ${tier.color}`}>
              <p className="text-xl font-bold mb-1">{tier.range}</p>
              <p className="font-semibold text-sm mb-2">{tier.label}</p>
              <p className="text-xs leading-relaxed opacity-80">{tier.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we are not */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What AgencyCheck is not</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-900 leading-relaxed space-y-2">
          <p>
            <strong>Not a legal service.</strong> Nothing on this site is legal advice.
            If you have a dispute with an employment agency, contact FNV, a legal advisor, or the
            Inspectie SZW (Labour Authority).
          </p>
          <p>
            <strong>Not affiliated with agencies.</strong> AgencyCheck is independent. We do not receive
            payments from agencies to appear in or be removed from our database. We are not a recruiter
            or job board.
          </p>
          <p>
            <strong>Not a guarantee.</strong> Worker reviews and reports are community-submitted and
            unverified. Always do your own research and ask questions before signing a contract.
          </p>
        </div>
      </section>

      {/* How to contribute */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How you can contribute</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          AgencyCheck grows through worker contributions. If you have worked through an agency,
          your experience helps thousands of other workers make better decisions.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: "⭐", title: "Leave a review", desc: "Rate your experience with an agency — anonymously. Tell others about housing, pay, and management.", href: "/reviews" },
            { icon: "💶", title: "Report your pay", desc: "Tell us what you earned per hour. This helps workers know what to negotiate.", href: "/agencies" },
            { icon: "⚠️", title: "Report an issue", desc: "Experienced missing overtime, bad housing, or payslip errors? Report it so others can be warned.", href: "/agencies" },
            { icon: "✉️", title: "Contact us", desc: "Know an agency we should add or have a correction? Get in touch.", href: "/contact" },
          ].map((item) => (
            <Link key={item.title} href={item.href}
              className="card p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
              <p className="text-2xl mb-2">{item.icon}</p>
              <p className="font-semibold text-gray-800 text-sm mb-1">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="border-t border-gray-100 pt-8">
        <p className="text-sm text-gray-500 mb-4">Explore AgencyCheck:</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/agencies" className="text-xs text-brand-600 border border-brand-200 rounded-full px-3 py-1.5 hover:bg-brand-50 transition-colors">
            Browse 150+ agencies →
          </Link>
          <Link href="/agencies-with-housing" className="text-xs text-brand-600 border border-brand-200 rounded-full px-3 py-1.5 hover:bg-brand-50 transition-colors">
            Agencies with housing →
          </Link>
          <Link href="/tools" className="text-xs text-brand-600 border border-brand-200 rounded-full px-3 py-1.5 hover:bg-brand-50 transition-colors">
            Salary calculator →
          </Link>
          <Link href="/contact" className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors">
            Contact →
          </Link>
          <Link href="/for-agencies" className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors">
            Information for agencies →
          </Link>
        </div>
      </section>

    </div>
  );
}
