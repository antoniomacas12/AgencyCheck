import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use — AgencyCheck",
  description:
    "Terms of use for AgencyCheck. Guidelines for submitting reviews, using agency data, and understanding the limitations of worker-reported information.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "March 2026";

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
      <p className="text-xs text-gray-400 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-8 text-sm text-brand-900">
        By using AgencyCheck you agree to these terms. Please read them carefully. If you do not
        agree, please do not use the platform.
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">1. About the platform</h2>
          <p>
            AgencyCheck is an informational platform providing transparency data about employment
            agencies in the Netherlands. Content includes agency research profiles, worker-submitted
            reviews, salary reports, and issue reports. All content is for informational purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">2. No employment advice</h2>
          <p>
            Nothing on AgencyCheck constitutes employment, legal, or financial advice. Transparency
            scores, reviews, and reports are informational tools to help workers do their own research.
            Always verify important information directly with an agency before signing a contract.
            In case of a dispute, consult a qualified legal adviser, FNV, or the Inspectie SZW.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">3. User-submitted content</h2>
          <p className="mb-3">
            Workers may submit anonymous reviews, salary reports, and issue reports. By submitting
            content to AgencyCheck, you agree to the following:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              <strong>Truthfulness:</strong> You will only submit information that is true to the
              best of your knowledge. Deliberately false information that damages an agency&apos;s
              reputation may constitute defamation under Dutch law.
            </li>
            <li>
              <strong>Personal experience:</strong> Reviews must be based on your own experience
              working through the agency. Do not submit reviews on behalf of others or fabricate
              experiences.
            </li>
            <li>
              <strong>No personal data:</strong> Do not include names, phone numbers, email
              addresses, or other personal data of individuals in your submissions.
            </li>
            <li>
              <strong>No illegal content:</strong> Do not submit content that is defamatory, hateful,
              discriminatory, sexually explicit, or otherwise illegal under Dutch or EU law.
            </li>
            <li>
              <strong>Licence:</strong> You grant AgencyCheck a non-exclusive, perpetual, royalty-free
              licence to display, modify, and distribute your submission on the platform.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">4. Agency data accuracy</h2>
          <p className="mb-3">
            Agency profiles on AgencyCheck are compiled from publicly available sources and
            worker-submitted reports. We make reasonable efforts to verify factual information
            but cannot guarantee accuracy. Agency details including addresses, phone numbers,
            and websites may change after our research date.
          </p>
          <p>
            Transparency scores are computed from data signals and are not endorsements or ratings.
            A high transparency score indicates good data availability — not that an agency is
            recommended. A low score indicates limited information, not that the agency is
            untrustworthy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">5. No affiliation with agencies</h2>
          <p>
            AgencyCheck is independent and not affiliated with any employment agency, recruiter, or
            staffing organisation. We do not accept payment to add, remove, or alter agency profiles.
            Agency appearances on the platform are based solely on research and worker data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">6. Limitation of liability</h2>
          <p className="mb-3">
            AgencyCheck is provided &quot;as is&quot; without warranty of any kind, express or implied.
            We do not guarantee the accuracy, completeness, or fitness for purpose of any information
            on the platform.
          </p>
          <p>
            To the maximum extent permitted by law, AgencyCheck shall not be liable for any direct,
            indirect, incidental, or consequential damages arising from your use of, or reliance on,
            information on this platform. Decisions about employment, housing, and contracts are your
            own responsibility.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">7. Acceptable use</h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Scrape the platform in a way that degrades its performance for other users</li>
            <li>Use the platform to distribute spam, malware, or fraudulent content</li>
            <li>Attempt to gain unauthorised access to any part of the platform</li>
            <li>Submit reviews designed to manipulate an agency&apos;s perceived score</li>
            <li>Use the platform for commercial purposes without written permission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">8. Content removal</h2>
          <p>
            We reserve the right to remove any user-submitted content that violates these terms,
            appears to be false, or has been the subject of a substantiated factual dispute by the
            relevant agency. We will not remove reviews solely because an agency objects to the
            opinion expressed. We will remove or correct reviews that contain verifiable factual
            errors.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">9. Governing law</h2>
          <p>
            These terms are governed by the laws of the Netherlands. Any disputes shall be subject
            to the exclusive jurisdiction of the courts of Amsterdam, Netherlands.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">10. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Material changes will be noted at the top
            of this page with a new &quot;last updated&quot; date. Continued use of the platform constitutes
            acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">11. Contact</h2>
          <p>
            For questions about these terms, email{" "}
            <a href="mailto:legal@agencycheck.nl" className="text-brand-600 underline">
              legal@agencycheck.nl
            </a>
            {" "}or visit our{" "}
            <Link href="/contact" className="text-brand-600 underline">contact page</Link>.
          </p>
        </section>

      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-400">
        <Link href="/privacy" className="hover:text-brand-600">Privacy policy</Link>
        <Link href="/about" className="hover:text-brand-600">About AgencyCheck</Link>
        <Link href="/contact" className="hover:text-brand-600">Contact</Link>
      </div>

    </div>
  );
}
