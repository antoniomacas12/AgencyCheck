"use client";

export const dynamic = "force-dynamic";

/**
 * /admin/notifications
 * Lists admin notifications (newest first), with mark-as-read controls.
 * Polls for new notifications every 30 s.
 */

import { useEffect, useState, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface NotificationMeta {
  reviewId?:   string;
  agencyName?: string;
  city?:       string;
  preview?:    string;
}

interface AdminNotification {
  id:        string;
  type:      string;
  title:     string;
  metadata:  NotificationMeta;
  isRead:    boolean;
  createdAt: string;
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

// ─── Type labels / icons ───────────────────────────────────────────────────────

const TYPE_META: Record<string, { icon: string; label: string }> = {
  review_comment: { icon: "💬", label: "Review comment" },
  new_review:     { icon: "⭐", label: "New review" },
};

function typeInfo(type: string) {
  return TYPE_META[type] ?? { icon: "🔔", label: type };
}

// ─── Notification row ─────────────────────────────────────────────────────────

function NotificationRow({
  n,
  onMarkRead,
}: {
  n: AdminNotification;
  onMarkRead: (id: string) => void;
}) {
  const { icon, label } = typeInfo(n.type);
  const meta = n.metadata;

  // Build link to review for "review_comment" type
  const reviewLink = n.type === "review_comment" && meta.reviewId
    ? `/admin/reviews?highlight=${encodeURIComponent(meta.reviewId)}`
    : null;

  return (
    <div
      className={`flex gap-3 px-5 py-4 border-b border-gray-100 transition-colors
        ${n.isRead ? "bg-white" : "bg-blue-50/40 hover:bg-blue-50/60"}`}
    >
      {/* Icon */}
      <div className="shrink-0 text-xl mt-0.5">{icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`text-sm font-semibold ${n.isRead ? "text-gray-700" : "text-gray-900"}`}>
              {n.title}
              {!n.isRead && (
                <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500 align-middle" />
              )}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">{label} · {timeAgo(n.createdAt)}</p>
          </div>
          {!n.isRead && (
            <button
              type="button"
              onClick={() => onMarkRead(n.id)}
              className="text-[11px] text-blue-600 hover:underline shrink-0 mt-0.5"
            >
              Mark read
            </button>
          )}
        </div>

        {/* Metadata details */}
        {(meta.agencyName || meta.city || meta.preview) && (
          <div className="mt-2 space-y-1">
            {(meta.agencyName || meta.city) && (
              <p className="text-xs text-gray-600">
                {meta.agencyName && <span className="font-medium">{meta.agencyName}</span>}
                {meta.agencyName && meta.city && <span className="text-gray-400"> · </span>}
                {meta.city && <span>📍 {meta.city}</span>}
              </p>
            )}
            {meta.preview && (
              <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                &ldquo;{meta.preview}&rdquo;
              </p>
            )}
            {reviewLink && (
              <a
                href={reviewLink}
                className="text-xs text-brand-600 hover:underline font-medium"
              >
                → View review in admin
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [markingAll,    setMarkingAll]    = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  async function markOneRead(id: string) {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    try {
      await fetch(`/api/admin/notifications/${encodeURIComponent(id)}/read`, {
        method: "PATCH",
      });
    } catch {
      // revert on error by re-fetching
      fetchNotifications();
    }
  }

  async function markAllRead() {
    setMarkingAll(true);
    try {
      await fetch("/api/admin/notifications/read-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            disabled={markingAll}
            className="text-xs bg-gray-900 text-white font-semibold px-4 py-2 rounded-xl
              hover:bg-gray-700 transition disabled:opacity-60"
          >
            {markingAll ? "Marking…" : "Mark all read"}
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-5 py-4 border-b border-gray-100">
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-2xl mb-2">🔔</p>
            <p className="text-sm text-gray-500">No notifications yet.</p>
            <p className="text-xs text-gray-400 mt-1">They'll appear here when new comments or reviews arrive.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationRow key={n.id} n={n} onMarkRead={markOneRead} />
          ))
        )}
      </div>

      <p className="text-center text-[11px] text-gray-400 mt-4">
        Showing up to 50 most recent · Auto-refreshes every 30s
      </p>
    </div>
  );
}
