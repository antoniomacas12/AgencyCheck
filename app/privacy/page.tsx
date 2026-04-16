import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legalConfig";

export const metadata: Metadata = {
  title: "Privacy Policy — AgencyCheck",
  description:
    "AgencyCheck privacy policy. How we collect, store, and use data. Anonymous worker reviews, no advertising tracking, GDPR compliance.",
  alternates: { canonical: "https://agencycheck.io/privacy" },
};

const LAST_UPDATED = "April 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-xs text-gray-400 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-sm text-green-900">
        <strong>Short version:</strong> AgencyCheck does not sell your data, does not require
        registration to use the platform, and does not use advertising or tracking cookies.
        Worker reviews are anonymous by default. We collect only what is needed to operate the service.
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        {/* 1 — Who we are */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">1. Who we are (data controller)</h2>
          <p className="mb-2">
            AgencyCheck is operated by {LEGAL.legalName}
            {LEGAL.kvkNumber ? `, KvK ${LEGAL.kvkNumber}` : ""}.
            {LEGAL.address.street
              ? ` Registered address: ${LEGAL.address.street}, ${LEGAL.address.postcode} ${LEGAL.address.city}, ${LEGAL.address.country}.`
              : ""}
          </p>
          <p>
            We are the data controller for all personal data processed through{" "}
            <a href={LEGAL.siteUrl} className="text-brand-600 underline">{LEGAL.siteUrl}</a>.
            For privacy matters, contact us at{" "}
            <a href={`mailto:${LEGAL.emailPrivacy}`} className="text-brand-600 underline">{LEGAL.emailPrivacy}</a>.
          </p>
        </section>

        {/* 2 — Data we collect */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">2. Data we collect</h2>
          <div className="space-y-4">

            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">a) Browsing data (automatic)</p>
              <p>
                Our hosting provider (Vercel) records standard server logs including IP address,
                browser type, and pages visited. This data is used solely for security and
                performance monitoring and is not combined with other data to identify individuals.
                Vercel&apos;s privacy practices: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">vercel.com/legal/privacy-policy</a>.
              </p>
            </div>

            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">b) Anonymised page analytics</p>
              <p>
                We use <strong>Vercel Analytics</strong>, a cookieless, privacy-first analytics tool.
                It records page views, referrer source, and country of origin in aggregated,
                anonymised form. <strong>No cookies are set. No personal identifiers are stored.
                No data is shared with advertising networks.</strong> Individual users cannot be identified
                from this data. See{" "}
                <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Vercel Analytics privacy policy</a>.
              </p>
            </div>

            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">c) Worker reviews and reports (voluntary)</p>
              <p className="mb-2">
                If you submit a review, salary report, or issue report, we store the content of
                your submission together with a timestamp. We do not require an account or your name.
                Reviews are anonymous by default. Optional fields (job title, city) help contextualise
                your review but are not required.
              </p>
              <p>
                If you upload photos with a review, the image files are stored on our servers.
                Please do not include photos that show faces of identifiable individuals or
                contain personal information. You are responsible for ensuring you have
                the right to submit any photos you upload.
              </p>
            </div>

            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">d) Job interest / lead form (voluntary)</p>
              <p>
                If you submit a job interest form (&ldquo;Find me a job&rdquo;), we collect the information you
                provide (e.g. job type preference, availability, contact details if given).
                This data is used to match you with relevant employment agencies and is
                forwarded to those agencies for follow-up. <strong>We are not an employment agency
                and do not make placement decisions.</strong> Forwarding your data to an agency
                constitutes processing under GDPR — you consent to this by submitting the form.
                You can request deletion at any time by emailing{" "}
                <a href={`mailto:${LEGAL.emailPrivacy}`} className="text-brand-600 underline">{LEGAL.emailPrivacy}</a>.
              </p>
            </div>

            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">e) Contact form submissions</p>
              <p>
                If you contact us by email or via the contact form, we store your email address
                and message content for the purpose of responding to you. We do not add you to
                any mailing list without your explicit consent. Contact records are deleted after
                12 months unless ongoing correspondence requires longer retention.
              </p>
            </div>

          </div>
        </section>

        {/* 3 — What we do NOT collect */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">3. What we do not collect</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>We do not require registration to browse the platform</li>
            <li>We do not use advertising networks, tracking pixels, or behavioural profiling cookies</li>
            <li>We do not sell, rent, or share personal data with third parties for marketing purposes</li>
            <li>We do not collect payment information (the platform is free)</li>
            <li>We do not use social media login buttons that enable cross-site tracking</li>
            <li>We do not use Google Analytics or Meta Pixel</li>
          </ul>
        </section>

        {/* 4 — Cookies */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">4. Cookies and local storage</h2>
          <p className="mb-3">
            AgencyCheck uses only the minimum necessary cookies and browser storage:
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-3">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Purpose</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-3 py-2 font-mono text-gray-700">ac_locale</td>
                  <td className="px-3 py-2 text-gray-600">Cookie</td>
                  <td className="px-3 py-2 text-gray-600">Remembers your chosen language (EN/PL/RO)</td>
                  <td className="px-3 py-2 text-gray-600">1 year</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-gray-700">Session storage</td>
                  <td className="px-3 py-2 text-gray-600">Browser storage</td>
                  <td className="px-3 py-2 text-gray-600">Remembers dismissed popups within one browser session</td>
                  <td className="px-3 py-2 text-gray-600">Session only</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            No advertising, analytics, or marketing cookies are set. Vercel Analytics operates
            without cookies (see section 2b). You do not need to accept any cookie banner to
            use the full platform.
          </p>
        </section>

        {/* 5 — Agency data */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">5. Agency data</h2>
          <p className="mb-3">
            Agency profiles on AgencyCheck are compiled from publicly available information:
            official websites, public registers (KvK, ABU, SNCU), company directories, and
            worker-submitted reports. We make reasonable efforts to verify factual information
            but cannot guarantee accuracy at all times.
          </p>
          <p className="mb-3">
            We do not publish personal contact details of individual employees. We publish only
            organisational contact information already publicly listed on agency websites or registers.
          </p>
          <p>
            If you are an agency representative and believe information about your organisation
            is factually incorrect, you can request a review via{" "}
            <a href={`mailto:${LEGAL.emailAgencies}`} className="text-brand-600 underline">{LEGAL.emailAgencies}</a>{" "}
            or our <Link href="/contact" className="text-brand-600 underline">contact page</Link>.
            We aim to respond within 5 working days.
          </p>
        </section>

        {/* 6 — Data retention */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">6. Data retention</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Data type</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Retention period</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { type: "Worker reviews & salary reports", period: "5 years from submission (or until deletion request)", reason: "Legitimate interest in maintaining a useful historical record for workers" },
                  { type: "Review photos", period: "5 years from submission (or until deletion request)", reason: "Same as review; photos are part of the review record" },
                  { type: "Job interest / lead form data", period: "12 months from submission", reason: "Sufficient time for agency follow-up; deleted automatically after this period" },
                  { type: "Contact form emails", period: "12 months from last correspondence", reason: "Proportionate to the purpose of responding to enquiries" },
                  { type: "Server logs (Vercel)", period: "30 days (Vercel default)", reason: "Security and performance monitoring; see Vercel privacy policy" },
                  { type: "Anonymised analytics (Vercel Analytics)", period: "Indefinite — no personal data retained", reason: "Aggregated statistics only; not personal data under GDPR" },
                ].map((r) => (
                  <tr key={r.type}>
                    <td className="px-3 py-2 font-medium text-gray-700">{r.type}</td>
                    <td className="px-3 py-2 text-gray-600">{r.period}</td>
                    <td className="px-3 py-2 text-gray-500">{r.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            To request deletion of a review or any personal data we hold, email{" "}
            <a href={`mailto:${LEGAL.emailPrivacy}`} className="text-brand-600 underline">{LEGAL.emailPrivacy}</a>.
            We will process deletion requests within 10 working days.
          </p>
        </section>

        {/* 7 — GDPR rights */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">7. Your rights under GDPR</h2>
          <p className="mb-3">
            If you are a resident of the European Economic Area (EEA), you have the following rights
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
            To exercise any of these rights, email{" "}
            <a href={`mailto:${LEGAL.emailPrivacy}`} className="text-brand-600 underline">{LEGAL.emailPrivacy}</a>.
            We will respond within 30 days. You also have the right to lodge a complaint with the Dutch
            data protection authority:{" "}
            <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">
              Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl)
            </a>.
          </p>
        </section>

        {/* 8 — Security */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">8. Security</h2>
          <p>
            We use industry-standard security measures including encryption in transit (HTTPS),
            access controls, and hosting on Vercel&apos;s infrastructure. No system is completely
            secure. In the event of a data breach affecting personal data, we will notify
            affected users and the Autoriteit Persoonsgegevens as required by GDPR Art. 33–34.
          </p>
        </section>

        {/* 9 — International transfers */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">9. International transfers</h2>
          <p>
            Our platform is hosted on Vercel infrastructure. Vercel operates data centres in
            the EU and complies with the EU Standard Contractual Clauses (SCCs) for any
            data transferred outside the EEA. See{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">
              Vercel&apos;s data transfer documentation
            </a>.
          </p>
        </section>

        {/* 10 — Changes */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">10. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. Material changes will be noted at the
            top of this page with a new &ldquo;last updated&rdquo; date. Continued use of the platform
            after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* 11 — Contact */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">11. Contact</h2>
          <p>
            For privacy-related questions or requests:{" "}
            <a href={`mailto:${LEGAL.emailPrivacy}`} className="text-brand-600 underline">{LEGAL.emailPrivacy}</a>.
            For all other enquiries:{" "}
            <Link href="/contact" className="text-brand-600 underline">contact page</Link>.
          </p>
        </section>

      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-400">
        <Link href="/terms"       className="hover:text-brand-600">Terms of use</Link>
        <Link href="/methodology" className="hover:text-brand-600">Methodology</Link>
        <Link href="/about"       className="hover:text-brand-600">About AgencyCheck</Link>
        <Link href="/contact"     className="hover:text-brand-600">Contact</Link>
      </div>

    </div>
  );
}
