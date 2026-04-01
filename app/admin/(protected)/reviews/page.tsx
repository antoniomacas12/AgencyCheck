"use client";

/**
 * /admin/reviews — Admin moderation queue for submitted reviews.
 *
 * Lists all reviews with status filter tabs.
 * Each row shows key info + quick-action buttons (approve / reject / publish).
 */

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "PUBLISHED";

interface Photo {
  id:        string;
  fileUrl:   string;
  sortOrder: number;
}

interface AdminReview {
  id:                    string;
  status:                ReviewStatus;
  isPublished:           boolean;
  createdAt:             string;
  overallRating:         number;
  title:                 string | null;
  comment:               string | null;
  city:                  string | null;
  jobType:               string | null;
  workerStatus:          string;
  wouldRecommend:        string;
  accommodationProvided: string;
  roomType:              string;
  weeklyRent:            number | null;
  internalNotes:         string | null;
  agency: { id: string; name: string; slug: string };
  photos: Photo[];
  _count: { photos: number };
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<ReviewStatus, string> = {
  PENDING:   "bg-yellow-100 text-yellow-800",
  APPROVED:  "bg-blue-100 text-blue-800",
  REJECTED:  "bg-red-100 text-red-800",
  PUBLISHED: "bg-green-100 text-green-800",
};

function StatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

// ─── Star display ─────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-500 text-sm">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminReviewsPage() {
  const [reviews, setReviews]       = useState<AdminReview[]>([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "ALL">("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage]       = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteEdits, setNoteEdits]   = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchReviews = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page) });
      if (statusFilter !== "ALL") qs.set("status", statusFilter);
      const res = await fetch(`/api/admin/reviews?${qs}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setReviews(data.reviews);
      setPagination(data.pagination);
    } catch {
      showMessage("err", "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchReviews(1); }, [fetchReviews]);

  function showMessage(type: "ok" | "err", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async function doAction(
    reviewId: string,
    endpoint: string,
    body?: Record<string, unknown>
  ) {
    setActionLoading(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body ?? {}),
      });
      const data = await res.json();
      if (!res.ok) {
        showMessage("err", data.error ?? "Action failed.");
        return;
      }
      showMessage("ok", `Review ${endpoint}d successfully.`);
      fetchReviews(pagination.page);
    } catch {
      showMessage("err", "Network error.");
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteReview(reviewId: string) {
    setActionLoading(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { showMessage("err", data.error ?? "Delete failed."); return; }
      showMessage("ok", "Review permanently removed.");
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch {
      showMessage("err", "Network error.");
    } finally {
      setActionLoading(null);
      setConfirmDeleteId(null);
    }
  }

  async function saveNote(reviewId: string) {
    const notes = noteEdits[reviewId] ?? "";
    setActionLoading(reviewId + "-note");
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes: notes }),
      });
      if (!res.ok) { showMessage("err", "Failed to save note."); return; }
      showMessage("ok", "Note saved.");
      fetchReviews(pagination.page);
    } catch {
      showMessage("err", "Network error.");
    } finally {
      setActionLoading(null);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const TABS: Array<ReviewStatus | "ALL"> = ["ALL", "PENDING", "APPROVED", "REJECTED", "PUBLISHED"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review moderation</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pagination.total} total
            {reviews.filter(r => Date.now() - new Date(r.createdAt).getTime() < 24 * 60 * 60 * 1000).length > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-full px-2.5 py-0.5">
                🔔 {reviews.filter(r => Date.now() - new Date(r.createdAt).getTime() < 24 * 60 * 60 * 1000).length} new in last 24h
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Flash message */}
      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === "ok"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Status tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              statusFilter === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading…</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No reviews in this queue.</div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            const isExpanded = expandedId === r.id;
            const isActing   = actionLoading === r.id;

            return (
              <div
                key={r.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Row header */}
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: agency + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <StatusBadge status={r.status} />
                        {Date.now() - new Date(r.createdAt).getTime() < 24 * 60 * 60 * 1000 && (
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">NEW</span>
                        )}
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {r.agency.name}
                        </span>
                        <Stars rating={r.overallRating} />
                        {r._count.photos > 0 && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                            📷 {r._count.photos} photo{r._count.photos > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 flex flex-wrap gap-3 mb-2">
                        <span>{new Date(r.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                        {r.city && <span>📍 {r.city}</span>}
                        {r.jobType && <span>💼 {r.jobType}</span>}
                        <span className="text-gray-300">ID: {r.id.slice(-8)}</span>
                      </div>
                      {r.title && (
                        <p className="text-sm font-medium text-gray-800 mb-1">&quot;{r.title}&quot;</p>
                      )}
                      {r.comment && (
                        <p className="text-sm text-gray-600 line-clamp-2">{r.comment}</p>
                      )}
                    </div>

                    {/* Right: actions */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {r.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => doAction(r.id, "approve")}
                            disabled={isActing}
                            className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 font-medium"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => doAction(r.id, "reject")}
                            disabled={isActing}
                            className="text-xs px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50 font-medium"
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                      {r.status === "APPROVED" && (
                        <>
                          <button
                            onClick={() => doAction(r.id, "publish", { publish: true })}
                            disabled={isActing}
                            className="text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 font-medium"
                          >
                            🌐 Publish
                          </button>
                          <button
                            onClick={() => doAction(r.id, "reject")}
                            disabled={isActing}
                            className="text-xs px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50 font-medium"
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                      {r.status === "PUBLISHED" && (
                        <button
                          onClick={() => doAction(r.id, "publish", { publish: false })}
                          disabled={isActing}
                          className="text-xs px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 font-medium"
                        >
                          ↩ Unpublish
                        </button>
                      )}
                      {r.status === "REJECTED" && (
                        <button
                          onClick={() => doAction(r.id, "approve")}
                          disabled={isActing}
                          className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 font-medium"
                        >
                          ↩ Re-approve
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : r.id)}
                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                      >
                        {isExpanded ? "▲ Less" : "▼ Details"}
                      </button>
                      {/* Remove button */}
                      {confirmDeleteId === r.id ? (
                        <div className="flex flex-col gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
                          <p className="text-[10px] text-red-700 font-semibold text-center">Remove permanently?</p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => deleteReview(r.id)}
                              disabled={isActing}
                              className="flex-1 text-[10px] px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold disabled:opacity-50"
                            >
                              Yes, remove
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="flex-1 text-[10px] px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(r.id)}
                          disabled={isActing}
                          className="text-xs px-3 py-1.5 bg-white hover:bg-red-50 text-red-500 border border-red-200 hover:border-red-400 rounded-lg disabled:opacity-50 font-medium transition-colors"
                        >
                          🗑 Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 space-y-4">
                    {/* Ratings row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-600">
                      <div><span className="font-medium">Overall:</span> {r.overallRating}/5</div>
                      <div><span className="font-medium">Worker:</span> {r.workerStatus}</div>
                      <div><span className="font-medium">Recommend:</span> {r.wouldRecommend}</div>
                      <div><span className="font-medium">Housing:</span> {r.accommodationProvided}</div>
                      {r.roomType !== "UNKNOWN" && (
                        <div><span className="font-medium">Room:</span> {r.roomType}</div>
                      )}
                      {r.weeklyRent !== null && (
                        <div><span className="font-medium">Weekly rent:</span> €{r.weeklyRent}</div>
                      )}
                    </div>

                    {/* Full comment */}
                    {r.comment && (
                      <div className="text-sm text-gray-700 bg-white rounded-lg px-4 py-3 border border-gray-200">
                        {r.comment}
                      </div>
                    )}

                    {/* Photos */}
                    {r.photos.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                          Uploaded photos ({r.photos.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {r.photos.map((photo) => (
                            <a
                              key={photo.id}
                              href={photo.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={photo.fileUrl}
                                alt="Review photo"
                                className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Internal notes */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Internal notes (admin only — never shown publicly)
                      </p>
                      <textarea
                        rows={2}
                        placeholder="Add moderation notes…"
                        value={noteEdits[r.id] ?? r.internalNotes ?? ""}
                        onChange={(e) =>
                          setNoteEdits((prev) => ({ ...prev, [r.id]: e.target.value }))
                        }
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => saveNote(r.id)}
                        disabled={actionLoading === r.id + "-note"}
                        className="mt-1.5 text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg disabled:opacity-50"
                      >
                        Save note
                      </button>
                    </div>

                    {/* View on site link */}
                    <div className="text-xs">
                      <a
                        href={`/agencies/${r.agency.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        ↗ View agency page
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchReviews(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium ${
                p === pagination.page
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
