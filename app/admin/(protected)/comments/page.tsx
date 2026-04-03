"use client";

export const dynamic = "force-dynamic";

/**
 * /admin/comments
 * Shows the 20 most recent review comments, polling every 60 s.
 */

import { RecentCommentsWidget } from "@/components/RecentCommentsWidget";

export default function AdminCommentsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Recent Comments</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Latest 20 comments left on published reviews · Auto-refreshes every 60s
        </p>
      </div>

      {/* Widget */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <RecentCommentsWidget />
      </div>
    </div>
  );
}
