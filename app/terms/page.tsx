import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legalConfig";

export const metadata: Metadata = {
  title: "Terms of Use — AgencyCheck",
  description:
    "Terms of use for AgencyCheck. Guidelines for submitting reviews, using agency data, and understanding the limitations of worker-reported information.",
  alternates: { canonical: "https://agencycheck.io/terms" },
};

const LAST_UPDATED = "April 2026";

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

        {/* 1 — About */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">1. About the platform</h2>
          <p className="mb-2">
            AgencyCheck is operated by {LEGAL.legalName}
            {LEGAL.kvkNumber ? `, KvK ${LEGAL.kvkNumber}` : ""}, an informational platform
            providing transparency data about employment agencies in the Netherlands. Content
            includes agency research profiles, worker-submitted reviews, salary reports, and
            issue reports. All content is for informational purposes only.
          </p>
          <p>
            Questions about these terms:{" "}
            <a href={`mailto:${LEGAL.emailLegal}`} className="text-brand-600 underline">{LEGAL.emailLegal}</a>.
          </p>
        </section>

        {/* 2 — No advice */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">2. No employment or legal advice</h2>
          <p>
            Nothing on AgencyCheck constitutes employment, legal, or financial advice. Transparency
            scores, reviews, and reports are informational tools to help workers do their own research.
            Always verify important information directly with an agency before signing a contract.
            In case of a dispute, consult a qualified legal adviser, FNV, or the Inspectie SZW.
          </p>
        </section>

        {/* 3 — User-submitted content */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">3. User-submitted content</h2>
          <p className="mb-3">
            Workers may submit anonymous reviews, salary reports, and issue reports. By submitting
            content to AgencyCheck, you confirm that:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-3">
            <li>
              <strong>Truthfulness:</strong> The information you submit is true to the best of
              your knowledge and based on personal experience. Deliberately false statements that
              damage an agency&apos;s reputation may constitute defamation (<em>smaad</em> or{" "}
              <em>laster</em>) under Dutch law (Wetboek van Strafrecht Art. 261–262; Burgerlijk
              Wetboek Art. 6:162).
            </li>
            <li>
              <strong>Personal experience:</strong> Reviews must be based on your own experience
              working through the agency. Do not submit reviews on behalf of others or fabricate
              experiences.
            </li>
            <li>
              <strong>No personal data of others:</strong> Do not include names, phone numbers,
              email addresses, or other personal data of identifiable individuals in your
              submissions. Do not upload photos that show faces of identifiable people.
            </li>
            <li>
              <strong>No illegal content:</strong> Do not submit content that is defamatory,
              hateful, discriminatory, sexually explicit, incites violence or hatred, or is
              otherwise illegal under Dutch or EU law.
            </li>
            <li>
              <strong>Photo responsibility:</strong> If you upload photos, you confirm you have
              the right to submit them and that they do not infringe third-party rights (copyright,
              portrait rights). We will remove photos on substantiated request.
            </li>
            <li>
              <strong>Licence:</strong> You grant AgencyCheck a non-exclusive, perpetual,
              royalty-free licence to display, edit for length or clarity, and distribute your
              submission on the platform.
            </li>
          </ul>
          <p className="text-xs text-gray-500">
            We do not require account registration. By submitting, you accept these terms for
            that submission.
          </p>
        </section>

        {/* 4 — Agency data accuracy */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">4. Agency data accuracy</h2>
          <p className="mb-3">
            Agency profiles on AgencyCheck are compiled from publicly available sources and
            worker-submitted reports. We make reasonable efforts to verify factual information
            but cannot guarantee accuracy at all times. Agency details including addresses, phone
            numbers, and websites may change after our research date.
          </p>
          <p>
            Transparency scores are computed from data signals and are not endorsements or ratings.
            A high transparency score indicates good data availability — not that an agency is
            recommended. A low score indicates limited information, not that the agency is
            untrustworthy.
          </p>
          <p className="mt-3">
            <strong>Certification status (ABU, SNA, SNF, NEN):</strong> Where AgencyCheck indicates
            that an agency holds a certification, this is based on information available at the time
            of our research. Certification status can change — agencies may gain or lose certification
            at any time. <strong>Always verify current certification status directly</strong> on the
            official registers:{" "}
            <a href="https://www.abu.nl/leden" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">abu.nl/leden</a>,{" "}
            <a href="https://www.sna.nl/gecertificeerde-bedrijven" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">sna.nl</a>, or{" "}
            <a href="https://www.sncu.nl" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">sncu.nl</a>.
            AgencyCheck accepts no liability for decisions made based on certification data shown on this platform.
          </p>
        </section>

        {/* 5 — No affiliation */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">5. No affiliation with agencies</h2>
          <p>
            AgencyCheck is independent and not affiliated with any employment agency, recruiter,
            or staffing organisation. We do not accept payment to add, remove, or alter agency
            profiles. Agency appearances on the platform are based solely on research and worker
            data.
          </p>
        </section>

        {/* 6 — Limitation of liability */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">6. Limitation of liability</h2>
          <p className="mb-3">
            AgencyCheck is provided &quot;as is&quot; without warranty of any kind, express or implied.
            We do not guarantee the accuracy, completeness, or fitness for purpose of any
            information on the platform.
          </p>
          <p>
            To the maximum extent permitted by Dutch law, AgencyCheck shall not be liable for
            any direct, indirect, incidental, or consequential damages arising from your use of,
            or reliance on, information on this platform. Decisions about employment, housing,
            and contracts are your own responsibility.
          </p>
        </section>

        {/* 7 — Acceptable use */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">7. Acceptable use</h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Scrape the platform in a way that degrades performance for other users</li>
            <li>Use the platform to distribute spam, malware, or fraudulent content</li>
            <li>Attempt to gain unauthorised access to any part of the platform or its systems</li>
            <li>Submit reviews designed to artificially inflate or damage an agency&apos;s score</li>
            <li>Submit content on behalf of an agency you are employed by or affiliated with</li>
            <li>Use the platform for commercial purposes (advertising, lead generation) without written permission</li>
          </ul>
        </section>

        {/* 8 — Content moderation */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">8. Content moderation policy</h2>

          <div className="space-y-4">
            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">How we moderate</p>
              <p>
                We operate post-publication moderation. Reviews are published after submission
                and reviewed reactively when flagged. We may proactively review submissions
                that contain keywords associated with prohibited content. We do not pre-screen
                every submission before publication.
              </p>
            </div>

            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">Grounds for removal</p>
              <p className="mb-2">We will remove or hide content that:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs">
                <li>Contains personal data of identifiable individuals</li>
                <li>Is clearly defamatory — i.e. contains false statements of fact presented as true</li>
                <li>Constitutes hate speech, discrimination, or incitement to violence</li>
                <li>Is sexually explicit or grossly offensive</li>
                <li>Infringes third-party intellectual property or portrait rights</li>
                <li>Is a duplicate submission or part of a coordinated manipulation campaign</li>
                <li>Is submitted by an employee or representative of the agency being reviewed</li>
              </ul>
              <p className="mt-2 text-xs text-gray-500">
                We will <strong>not</strong> remove reviews solely because an agency finds the
                opinion unflattering. Opinion and subjective experience are protected expression.
              </p>
            </div>

            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">Factual corrections</p>
              <p>
                We will correct or remove content containing verifiable factual errors (e.g.
                wrong location, wrong legal entity name) when supported by evidence. We do not
                remove reviews because the rating is low or because the agency disagrees with
                the assessment.
              </p>
            </div>

            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">Agency dispute process</p>
              <p className="mb-1">
                If you are an agency representative and believe a review contains false statements
                of fact or violates these terms, you may request a review by emailing{" "}
                <a href={`mailto:${LEGAL.emailAgencies}`} className="text-brand-600 underline">{LEGAL.emailAgencies}</a> with:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs">
                <li>The URL of the review in question</li>
                <li>The specific statement(s) you claim are factually incorrect</li>
                <li>Documentary evidence supporting your claim (not just a denial)</li>
              </ul>
              <p className="mt-2 text-xs text-gray-500">
                We aim to respond within <strong>5 working days</strong>. If we agree the content
                violates our policy, we will remove or correct it within <strong>10 working days</strong> of
                reaching that decision.
              </p>
            </div>

            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">Worker appeal process</p>
              <p>
                If your submission has been removed and you believe this was in error, email{" "}
                <a href={`mailto:${LEGAL.emailLegal}`} className="text-brand-600 underline">{LEGAL.emailLegal}</a> with
                the context of your submission and your grounds for reinstatement. We will review
                and respond within <strong>5 working days</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* 9 — DSA / Illegal content */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">
            9. Reporting illegal content (DSA)
          </h2>
          <p className="mb-3">
            Under the EU Digital Services Act (DSA, Regulation (EU) 2022/2065), users and third
            parties may report content they believe is illegal under EU or Dutch law.
          </p>
          <p className="mb-3">
            To report illegal content, email{" "}
            <a href={`mailto:${LEGAL.emailLegal}`} className="text-brand-600 underline">{LEGAL.emailLegal}</a> with
            the subject line <strong>&ldquo;DSA illegal content report&rdquo;</strong> and include:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 mb-3">
            <li>The URL of the content you are reporting</li>
            <li>The specific legal provision you believe it violates (e.g. hate speech, GDPR)</li>
            <li>A description of why you believe it is illegal</li>
          </ul>
          <p className="mb-2">
            We will acknowledge your report within <strong>3 working days</strong> and provide
            a decision within <strong>15 working days</strong> (or notify you if more time is needed
            for complex cases).
          </p>
          <p className="text-xs text-gray-500">
            AgencyCheck is a micro/small enterprise as defined by DSA Art. 33. This reporting
            mechanism does not limit your right to report content directly to national authorities
            or the Digital Services Coordinator (in the Netherlands: Autoriteit Consument en
            Markt / ACM).
          </p>
        </section>

        {/* 10 — Governing law */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">10. Governing law</h2>
          <p>
            These terms are governed by the laws of the Netherlands. Any disputes shall be subject
            to the exclusive jurisdiction of the courts of Amsterdam, Netherlands, unless mandatory
            consumer protection law in your country of residence provides otherwise.
          </p>
        </section>

        {/* 11 — Changes */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">11. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Material changes will be noted at the
            top of this page with a new &quot;last updated&quot; date. Continued use of the platform
            after the effective date constitutes acceptance of the updated terms.
          </p>
        </section>

        {/* 12 — Contact */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">12. Contact</h2>
          <p>
            For questions about these terms or content moderation decisions:{" "}
            <a href={`mailto:${LEGAL.emailLegal}`} className="text-brand-600 underline">
              {LEGAL.emailLegal}
            </a>
            {" "}or our{" "}
            <Link href="/contact" className="text-brand-600 underline">contact page</Link>.
          </p>
        </section>

      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-400">
        <Link href="/privacy"      className="hover:text-brand-600">Privacy policy</Link>
        <Link href="/methodology"  className="hover:text-brand-600">Methodology</Link>
        <Link href="/about"        className="hover:text-brand-600">About AgencyCheck</Link>
        <Link href="/contact"      className="hover:text-brand-600">Contact</Link>
      </div>

    </div>
  );
}
