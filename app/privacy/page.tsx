import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — AgencyCheck",
  description:
    "AgencyCheck privacy policy. How we collect, store, and use data. Anonymous worker reviews, no tracking, GDPR compliance.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "March 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-xs text-gray-400 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-sm text-green-900">
        <strong>Short version:</strong> AgencyCheck does not sell your data, does not require
        registration to use the platform, and does not track you with advertising cookies. Worker
        reviews are anonymous by default. We collect only what is needed to operate the service.
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">1. Who we are</h2>
          <p>
            AgencyCheck (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a worker transparency platform for employment
            agencies in the Netherlands. This privacy policy explains how we handle personal data
            when you visit or contribute to agencycheck.nl.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">2. Data we collect</h2>
          <div className="space-y-3">
            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">Browsing data (automatic)</p>
              <p>
                Standard server logs may capture your IP address, browser type, and pages visited.
                This data is used solely for security and site performance monitoring. We do not
                combine this with other data to identify individuals.
              </p>
            </div>
            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">Worker reviews and reports (voluntary)</p>
              <p>
                If you submit a review, salary report, or issue report, we store the content of
                your submission along with a timestamp. We do not require you to create an account
                or provide your name. Reviews are anonymous by default. We may ask for a job title
                and city to contextualise your review — this is optional.
              </p>
            </div>
            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">Contact form submissions</p>
              <p>
                If you contact us by email, we store your email address and the content of your
                message for the purpose of responding to you. We do not add you to any mailing list
                without your explicit consent.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">3. What we do not collect</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>We do not require registration to browse the platform</li>
            <li>We do not use advertising networks or tracking pixels</li>
            <li>We do not sell, rent, or share personal data with third parties for marketing</li>
            <li>We do not collect payment information (the platform is free)</li>
            <li>We do not use social media login buttons that track cross-site behaviour</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">4. Cookies</h2>
          <p className="mb-3">
            AgencyCheck uses only essential cookies required for the platform to function correctly
            (session management, security). We do not use advertising, analytics, or marketing cookies.
            You do not need to accept any cookie banner to use the platform.
          </p>
          <p>
            If we introduce optional analytics in future, we will update this policy and provide an
            explicit opt-in mechanism before activating any non-essential cookies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">5. Agency data</h2>
          <p className="mb-3">
            Agency profiles on AgencyCheck are built from publicly available information: official
            websites, public registers (ABU, SNCU), company directories, and worker reports. If you
            are an agency representative and believe information about your organisation is factually
            incorrect, you can request a review via our <Link href="/contact" className="text-brand-600 underline">contact page</Link>.
          </p>
          <p>
            We do not publish personal contact details of individual employees. We publish only
            organisational contact information (phone numbers and email addresses already publicly
            listed on agency websites).
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">6. Data retention</h2>
          <p>
            Worker-submitted reviews and reports are retained indefinitely to maintain a useful
            historical record for workers. If you submitted a review and wish to have it removed,
            contact us at <a href="mailto:privacy@agencycheck.nl" className="text-brand-600 underline">privacy@agencycheck.nl</a> with
            details of your submission. We will remove it within 10 working days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">7. Your rights under GDPR</h2>
          <p className="mb-3">
            If you are a resident of the European Economic Area, you have the following rights
            under the General Data Protection Regulation (GDPR):
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li><strong>Right of access:</strong> request a copy of data we hold about you</li>
            <li><strong>Right of rectification:</strong> correct inaccurate data</li>
            <li><strong>Right of erasure:</strong> request deletion of your data</li>
            <li><strong>Right to restriction:</strong> limit how we process your data</li>
            <li><strong>Right to data portability:</strong> receive your data in a portable format</li>
            <li><strong>Right to object:</strong> object to processing of your data</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email <a href="mailto:privacy@agencycheck.nl"
              className="text-brand-600 underline">privacy@agencycheck.nl</a>.
            We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">8. Security</h2>
          <p>
            We use industry-standard security measures to protect data stored on our servers,
            including encryption in transit (HTTPS) and access controls. No system is completely
            secure, and we cannot guarantee absolute security. In the event of a data breach that
            affects personal data, we will notify affected users and the relevant supervisory
            authority as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">9. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. Material changes will be noted at the top
            of this page with a new &quot;last updated&quot; date. Continued use of the platform after changes
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">10. Contact</h2>
          <p>
            For privacy-related questions or requests, email{" "}
            <a href="mailto:privacy@agencycheck.nl" className="text-brand-600 underline">
              privacy@agencycheck.nl
            </a>
            . For all other enquiries, see our{" "}
            <Link href="/contact" className="text-brand-600 underline">contact page</Link>.
          </p>
        </section>

      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-400">
        <Link href="/terms" className="hover:text-brand-600">Terms of use</Link>
        <Link href="/about" className="hover:text-brand-600">About AgencyCheck</Link>
        <Link href="/contact" className="hover:text-brand-600">Contact</Link>
      </div>

    </div>
  );
}
