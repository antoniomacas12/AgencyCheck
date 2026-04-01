import type { Metadata } from "next";
import nDynamic from "next/dynamic";
import { requireAdmin } from "@/lib/adminAuth";

// Client component — polls for review counts every 30s
const AdminReviewsBadge = nDynamic(
  () => import("@/components/AdminReviewsBadge"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Admin — AgencyCheck",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

// Force dynamic rendering — admin pages must never be statically cached
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This runs server-side and redirects to /admin/login if not authenticated.
  // The login page itself is outside this layout (see app/admin/login/page.tsx).
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin top nav */}
      <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm text-white tracking-tight">
            AgencyCheck <span className="text-gray-400 font-normal">Admin</span>
          </span>
          <div className="hidden sm:flex items-center gap-1 text-xs">
            <a
              href="/admin/leads"
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition"
            >
              Leads
            </a>
            <a
              href="/api/admin/leads/export"
              className="px-3 py-1.5 rounded-lg text-green-400 hover:text-white hover:bg-white/10 transition"
              title="Download all leads as CSV for invoicing"
            >
              ↓ Export CSV
            </a>
            <a
              href="/admin/reviews"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/10 transition flex items-center gap-1"
            >
              <AdminReviewsBadge />
            </a>
            <a
              href="/admin/auto-agencies"
              className="px-3 py-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition"
            >
              Auto agencies
            </a>
            <a
              href="/admin/launch-checklist"
              className="px-3 py-1.5 rounded-lg text-amber-400 hover:text-white hover:bg-white/10 transition font-semibold"
            >
              🚀 Launch
            </a>
            <a
              href="/"
              className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition"
              target="_blank"
              rel="noopener"
            >
              ↗ View site
            </a>
          </div>
        </div>
        <form action="/api/admin/auth/logout" method="POST">
          <button
            type="submit"
            className="text-xs text-gray-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            Log out
          </button>
        </form>
      </nav>
      {children}
    </div>
  );
}
