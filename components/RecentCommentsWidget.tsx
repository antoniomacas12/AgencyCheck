"use client";

/**
 * RecentCommentsWidget
 *
 * Compact admin widget showing the 20 latest review comments.
 * Polls every 60 s. Each row links to the review in the admin panel.
 */

import { useEffect, useState, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface RecentComment {
  id:           string;
  agencyName:   string;
  city:         string;
  preview:      string;
  createdAt:    string;
  reviewId:     string | null;
  agencySlug:   string | null;
  agencyDbName: string | null;
}

// ─── Relative time ─────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 2)  return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7)     return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ─── Comment row ───────────────────────────────────────────────────────────────

function CommentRow({ c }: { c: RecentComment }) {
  const reviewLink = c.reviewId
    ? `/admin/reviews?highlight=${encodeURIComponent(c.reviewId)}`
    : null;

  return (
    <div className="flex gap-3 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      {/* Avatar */}
      <div className="shrink-0 w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-sm mt-0.5">
        👷
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-xs font-semibold text-gray-800 truncate">{c.agencyName}</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-500">📍 {c.city}</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-400">{timeAgo(c.createdAt)}</span>
        </div>

        {/* Preview */}
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{c.preview}</p>

        {/* Link */}
        {reviewLink && (
          <a
            href={reviewLink}
            className="text-[11px] text-brand-600 hover:underline font-medium mt-1 inline-block"
          >
            → View review
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Widget ────────────────────────────────────────────────────────────────────

export function RecentCommentsWidget() {
  const [comments, setComments] = useState<RecentComment[]>([]);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/recent-comments");
      if (!res.ok) return;
      const data = await res.json();
      setComments(data.comments ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) {
    return (
      <div className="space-y-0">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-4 py-3 border-b border-gray-100">
            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2 mb-2" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-2xl mb-2">💬</p>
        <p className="text-sm text-gray-500">No comments yet.</p>
        <p className="text-xs text-gray-400 mt-1">Comments will appear here as workers submit them.</p>
      </div>
    );
  }

  return (
    <div>
      {comments.map((c) => (
        <CommentRow key={c.id} c={c} />
      ))}
    </div>
  );
}
