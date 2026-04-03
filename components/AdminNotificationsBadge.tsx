"use client";

/**
 * AdminNotificationsBadge
 *
 * Polls /api/admin/notifications every 30s and renders a red unread count badge
 * in the admin nav bar next to the "Notifications" link.
 */

import { useEffect, useState } from "react";

export default function AdminNotificationsBadge() {
  const [unread, setUnread] = useState<number | null>(null);
  const [blink,  setBlink]  = useState(false);
  const [prev,   setPrev]   = useState<number | null>(null);

  async function fetchUnread() {
    try {
      const res = await fetch("/api/admin/notifications");
      if (!res.ok) return;
      const data: { unreadCount: number } = await res.json();
      setUnread(data.unreadCount);

      if (prev !== null && data.unreadCount > prev) {
        setBlink(true);
        setTimeout(() => setBlink(false), 1200);
      }
      setPrev(data.unreadCount);
    } catch {
      // silently ignore
    }
  }

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-gray-300">Notifications</span>
      {unread !== null && unread > 0 && (
        <span
          className={`inline-flex items-center gap-0.5 text-[10px] font-black bg-blue-500 text-white
            rounded-full px-1.5 py-0.5 leading-none transition-transform
            ${blink ? "scale-125" : "scale-100"}`}
        >
          <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
          {unread}
        </span>
      )}
    </span>
  );
}
