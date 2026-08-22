import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legalConfig";

export const metadata: Metadata = {
  title: "Privacy Policy — AgencyCheck",
  description:
    "AgencyCheck privacy policy. How we collect, store, and use data. Anonymous worker reviews, no advertising tracking, GDPR compliance.",
  alternates: { canonical: "https://agencycheck.io/privacy" },
};

const LAST_UPDATED = "August 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
    <div className="max-w-2xl mx-auto px-4 py-12">

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-xs text-gray-500 mb-8">Last updated: {LAST_UPDATED}</p>

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
              <p className="mb-2">
                Our hosting provider (Vercel) records standard server logs including IP address,
                browser type, and pages visited. This data is used solely for security and
                performance monitoring and is not combined with other data to identify individuals.
                Vercel&apos;s privacy practices: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">vercel.com/legal/privacy-policy</a>.
              </p>
              <p className="text-xs text-gray-500">
                <strong>Geo eligibility check:</strong> When you tap the WhatsApp apply button,
                your IP address is checked in real time against an EU/EEA country list to verify
                eligibility. The IP address is not stored by AgencyCheck — the check is ephemeral.
                Legal basis: legitimate interests (Art.&nbsp;6(1)(f)) — preventing placement
                of candidates who are not eligible to work in the Netherlands.
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
                This data is used to match you with relevant recruitment/staffing partners and
                forwarded to them for follow-up. <strong>We are not an employment agency
                and do not make placement decisions.</strong> The lawful basis depends on which
                form you use: forms that include a consent checkbox use Art. 6(1)(a) GDPR
                (consent); forms where you are requesting job-finding assistance without a
                checkbox use Art. 6(1)(b) GDPR (processing necessary to take steps at your
                request prior to entering a contract). The applicable basis is disclosed at the
                point of data collection on each form.
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

            <div className="border-l-2 border-gray-200 pl-4">
              <p className="font-semibold text-gray-800 mb-1">f) Error monitoring (technical)</p>
              <p>
                We use <strong>Sentry</strong> (Functional Software, Inc. d/b/a Sentry) for
                application error monitoring. When a server-side error occurs, Sentry captures
                technical diagnostic information — stack traces, request metadata, and
                contextual debugging data. Candidate names, phone numbers, and email addresses
                are explicitly excluded from error reports. Sentry is used solely to maintain
                the reliability and security of the platform. Sentry&apos;s privacy policy:{" "}
                <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">sentry.io/privacy</a>.
              </p>
            </div>

            <div id="whatsapp-apply" className="border-l-2 border-green-300 pl-4">
              <p className="font-semibold text-gray-800 mb-1">g) WhatsApp apply flow</p>
              <p className="mb-2">
                When you tap the &ldquo;Apply via WhatsApp&rdquo; button on a job listing, the following
                processing takes place:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-2 text-xs">
                <li>
                  <strong>Pre-qualification gate:</strong> AgencyCheck asks for your EU/EEA
                  citizenship status and the name of your country of origin. This answer — together
                  with the job title and a source identifier — is forwarded to our internal
                  application routing system (<em>Recruiter OS</em>, operated by the same data
                  controller) and stored in our database. Legal basis: Art.&nbsp;6(1)(b) GDPR
                  (pre-contractual steps at your request).
                </li>
                <li>
                  <strong>Recruiter assignment:</strong> Recruiter OS assigns an available
                  recruiter coordinator and opens WhatsApp with a pre-filled message on your
                  device. <strong>AgencyCheck does not collect your phone number.</strong> Your
                  WhatsApp identity and number become visible to the recruiter coordinator only
                  when you send the first WhatsApp message — that communication is between you
                  and the recruiter directly and is governed by WhatsApp&apos;s own privacy policy.
                </li>
                <li>
                  <strong>Device deduplication:</strong> A timestamp is saved in your browser&apos;s
                  localStorage (key: <code className="text-xs bg-gray-100 px-1 rounded">ac_device_applied</code>)
                  for 24&nbsp;hours to prevent duplicate applications from the same device.
                  This data remains on your device and is never transmitted to our servers.
                </li>
              </ol>
              <p className="text-xs text-gray-500">
                Recruiter OS is an internal routing system operated under the same data controller
                as AgencyCheck ({LEGAL.legalName}). It is not a third-party processor.
                Data shared with the assigned recruiter coordinator (your EU citizenship status
                and job interest) is shared for the purpose of assessing your job application.
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
                  <td className="px-3 py-2 font-mono text-gray-700">ac_device_applied</td>
                  <td className="px-3 py-2 text-gray-600">localStorage</td>
                  <td className="px-3 py-2 text-gray-600">Prevents duplicate WhatsApp job applications from the same device within 24&nbsp;hours. Stores a timestamp only. Never transmitted to our servers.</td>
                  <td className="px-3 py-2 text-gray-600">24 hours</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-gray-700">ac_admin_session</td>
                  <td className="px-3 py-2 text-gray-600">httpOnly cookie</td>
                  <td className="px-3 py-2 text-gray-600">Administrator authentication. Set only when an administrator logs in to /admin. Not accessible to regular visitors.</td>
                  <td className="px-3 py-2 text-gray-600">8 hours</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-gray-700">Session storage (UI)</td>
                  <td className="px-3 py-2 text-gray-600">Browser storage</td>
                  <td className="px-3 py-2 text-gray-600">Remembers dismissed notices and banners within one browser session. Data stays in your browser and is never transmitted.</td>
                  <td className="px-3 py-2 text-gray-600">Session only</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-gray-700">Tool data (localStorage)</td>
                  <td className="px-3 py-2 text-gray-600">localStorage</td>
                  <td className="px-3 py-2 text-gray-600">Interactive tools (wage calculator, experience submission tracker, shift tracker) save your inputs locally so they persist across visits. All data stays on your device and is never transmitted to our servers.</td>
                  <td className="px-3 py-2 text-gray-600">Until you clear browser data</td>
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
                  { type: "Job interest / lead form data", period: "Up to 12 months from submission", reason: "Sufficient time for agency follow-up; deleted on request at any time; manual review at retention date" },
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
          <p className="mt-3 text-sm text-gray-500">
            <strong className="text-gray-700">Internal accountability records:</strong> When you exercise a right
            to restriction or erasure, we maintain an internal record of that action for GDPR accountability
            purposes (Art. 5(2) — accountability principle). These records are not shared with third parties
            and are retained for up to 3 years solely to demonstrate compliance.
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
          <h2 className="text-base font-bold text-gray-900 mb-3">9. International transfers and data recipients</h2>
          <p className="mb-3">
            Our platform is hosted on Vercel infrastructure. Vercel operates data centres in
            the EU and complies with the EU Standard Contractual Clauses (SCCs) for any
            data transferred outside the EEA. See{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">
              Vercel&apos;s data transfer documentation
            </a>.
          </p>
          <p className="mb-3">
            Our database (Neon / PostgreSQL) runs in the EU region (AWS eu-west-1, Ireland).
            Error monitoring (Sentry) and transactional email (Resend) are operated by US-based
            companies; both comply with EU SCCs.
          </p>
          <p className="mb-3">
            <strong>Recruiter OS</strong> is an internal application routing system operated
            within the EU by the same data controller. WhatsApp apply pre-qualification data
            (EU citizenship status, job title, source) is routed through this system to assign
            a recruiter coordinator. It is not a third-party and no SCCs are required.
          </p>
          <p>
            <strong>Recruitment agency coordinators</strong> (the individuals who contact you
            after a WhatsApp apply) receive only your EU citizenship status and job interest
            — not your phone number, which they see only if you initiate the WhatsApp message.
            These coordinators are the data recipients for the purpose of assessing your
            job application (Art.&nbsp;6(1)(b)).
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

      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
        <Link href="/terms"       className="hover:text-brand-600">Terms of use</Link>
        <Link href="/methodology" className="hover:text-brand-600">Methodology</Link>
        <Link href="/about"       className="hover:text-brand-600">About AgencyCheck</Link>
        <Link href="/contact"     className="hover:text-brand-600">Contact</Link>
      </div>

    </div>
    </div>
  );
}
