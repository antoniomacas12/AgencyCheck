import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legalConfig";

export const metadata: Metadata = {
  title: "Cookie Policy — AgencyCheck",
  description:
    "AgencyCheck cookie policy. We use one language-preference cookie and no advertising or tracking cookies. Full details on what is stored and why.",
  alternates: { canonical: "https://agencycheck.io/cookies" },
};

const LAST_UPDATED = "September 2026";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
    <div className="max-w-2xl mx-auto px-4 py-12">

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
      <p className="text-xs text-gray-500 mb-8">Last updated: {LAST_UPDATED}</p>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-sm text-green-900">
        <strong>Short version:</strong> AgencyCheck uses one cookie to remember your language
        preference. No advertising, no tracking, no analytics cookies. You do not need to accept
        any cookie banner to use the full platform.
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        {/* 1 — What are cookies */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">1. What are cookies?</h2>
          <p>
            Cookies are small text files that a website stores on your device when you visit.
            They allow the site to remember information about your visit — such as your preferred
            language — so you do not have to set it again on the next visit. Cookies set by the
            site you are visiting are called &ldquo;first-party cookies&rdquo;. Cookies set by other
            parties (e.g. advertisers) are called &ldquo;third-party cookies&rdquo;. AgencyCheck uses
            only first-party cookies and no third-party cookies of any kind.
          </p>
        </section>

        {/* 2 — Cookies we use */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">2. Cookies used by AgencyCheck</h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
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
                  <td className="px-3 py-2 text-gray-600">Cookie (first-party)</td>
                  <td className="px-3 py-2 text-gray-600">
                    Remembers your chosen language (EN / PL / RO) so you do not need to select
                    it on every visit. Strictly necessary for the language feature to work.
                  </td>
                  <td className="px-3 py-2 text-gray-600">1 year</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-gray-700">ac_admin_session</td>
                  <td className="px-3 py-2 text-gray-600">httpOnly cookie (first-party)</td>
                  <td className="px-3 py-2 text-gray-600">
                    Administrator authentication. Set only when an administrator logs in to
                    the /admin area. Marked httpOnly so it is not accessible to JavaScript.
                    Not set for regular visitors.
                  </td>
                  <td className="px-3 py-2 text-gray-600">8 hours</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500">
            That is the complete list of cookies set by agencycheck.io. There are no advertising
            cookies, no social media tracking pixels, no cross-site tracking of any kind.
          </p>
        </section>

        {/* 3 — Browser storage (not cookies) */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">3. Browser storage (not cookies)</h2>
          <p className="mb-3">
            In addition to cookies, some features use your browser&apos;s built-in storage mechanisms
            (localStorage and sessionStorage). These are stored entirely on your device and are
            never transmitted to our servers.
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Key</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Storage type</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Purpose</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-3 py-2 font-mono text-gray-700">ac_device_applied</td>
                  <td className="px-3 py-2 text-gray-600">localStorage</td>
                  <td className="px-3 py-2 text-gray-600">
                    Stores a timestamp after you submit a WhatsApp job application. Prevents
                    duplicate applications from the same device within 24 hours. Never
                    transmitted to our servers.
                  </td>
                  <td className="px-3 py-2 text-gray-600">24 hours</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-gray-700">Session UI state</td>
                  <td className="px-3 py-2 text-gray-600">sessionStorage</td>
                  <td className="px-3 py-2 text-gray-600">
                    Remembers dismissed notices and banners within a single browser session
                    (e.g. the cookie notice). Cleared automatically when you close the tab.
                  </td>
                  <td className="px-3 py-2 text-gray-600">Session only</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-gray-700">Tool data</td>
                  <td className="px-3 py-2 text-gray-600">localStorage</td>
                  <td className="px-3 py-2 text-gray-600">
                    Interactive tools (wage calculator, experience tracker, shift tracker) may
                    save your inputs locally so they persist across visits. All data stays on
                    your device and is never transmitted to our servers.
                  </td>
                  <td className="px-3 py-2 text-gray-600">Until you clear browser data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4 — Analytics */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">4. Analytics</h2>
          <p className="mb-2">
            We use <strong>Vercel Analytics</strong> to understand how the platform is used.
            Vercel Analytics is <strong>cookieless</strong> — it does not set any cookies and
            does not store any persistent identifiers on your device. It records aggregated,
            anonymised data (page views, country of origin, referrer source). Individual
            users cannot be identified from this data.
          </p>
          <p className="text-xs text-gray-500">
            See{" "}
            <a
              href="https://vercel.com/docs/analytics/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline"
            >
              Vercel Analytics privacy policy
            </a>.
          </p>
        </section>

        {/* 5 — Error monitoring */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">5. Error monitoring</h2>
          <p className="mb-2">
            We use <strong>Sentry</strong> for application error monitoring. Sentry captures
            technical diagnostic information (stack traces, request metadata) when a server-side
            error occurs. It does not set advertising cookies and is not used for behavioural
            profiling. Candidate personal data (names, phone numbers, email addresses) is
            explicitly excluded from error reports.
          </p>
          <p className="text-xs text-gray-500">
            See{" "}
            <a
              href="https://sentry.io/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline"
            >
              Sentry privacy policy
            </a>.
          </p>
        </section>

        {/* 6 — No advertising */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">6. No advertising cookies</h2>
          <p>
            AgencyCheck does not use advertising networks, retargeting pixels, or behavioural
            profiling cookies of any kind. We do not use Google Analytics, Meta Pixel, Google
            Ads, or any similar advertising technology. No data about your visit to AgencyCheck
            is shared with advertising platforms.
          </p>
        </section>

        {/* 7 — Managing cookies */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">7. Managing cookies</h2>
          <p className="mb-2">
            You can control and delete cookies through your browser settings. Deleting the{" "}
            <code className="text-xs bg-gray-100 px-1 rounded">ac_locale</code> cookie will
            reset your language preference to the default (English). Deleting{" "}
            <code className="text-xs bg-gray-100 px-1 rounded">ac_device_applied</code> from
            localStorage will allow you to re-submit a job application from the same device.
          </p>
          <p className="text-xs text-gray-500">
            Instructions for managing cookies in common browsers:{" "}
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Chrome</a>
            {" · "}
            <a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Firefox</a>
            {" · "}
            <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Safari</a>.
          </p>
        </section>

        {/* 8 — Contact */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">8. Contact</h2>
          <p>
            Questions about this Cookie Policy:{" "}
            <a href={`mailto:${LEGAL.emailPrivacy}`} className="text-brand-600 underline">
              {LEGAL.emailPrivacy}
            </a>
            . For broader privacy questions, see our{" "}
            <Link href="/privacy" className="text-brand-600 underline">Privacy Policy</Link>.
          </p>
        </section>

      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
        <Link href="/privacy"      className="hover:text-brand-600">Privacy Policy</Link>
        <Link href="/terms"        className="hover:text-brand-600">Terms of Use</Link>
        <Link href="/about"        className="hover:text-brand-600">About AgencyCheck</Link>
        <Link href="/contact"      className="hover:text-brand-600">Contact</Link>
      </div>

    </div>
    </div>
  );
}
