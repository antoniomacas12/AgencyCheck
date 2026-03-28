import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login — AgencyCheck",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// ─── Login page (Server Component shell + Client form) ────────────────────────

import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Admin access</h1>
          <p className="text-sm text-gray-500 mt-1">AgencyCheck internal panel</p>
        </div>

        <LoginForm />

        <p className="text-center text-xs text-gray-600 mt-6">
          This page is private. Unauthorized access attempts are logged.
        </p>
      </div>
    </div>
  );
}
