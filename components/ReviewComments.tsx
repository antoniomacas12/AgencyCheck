"use client";

/**
 * ReviewComments
 *
 * Displays the comments section for a single review card.
 * - Renders initial comments passed as a prop (server-side fetched for SEO).
 * - Falls back to a client-side fetch when no initial comments are provided.
 * - Includes a collapsible form for adding a new comment.
 * - Optimistically appends new comments after successful submission.
 */

import { useState, useEffect, useRef } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ReviewCommentData {
  id:         string;
  agencyName: string;
  city:       string;
  body:       string;
  createdAt:  string;
}

interface ReviewCommentsProps {
  reviewId:        string;
  agencyName:      string; // pre-fill the agency field
  initialComments?: ReviewCommentData[];
}

// ─── Relative time helper ─────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 2)  return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7)     return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Single comment bubble ────────────────────────────────────────────────────

function CommentBubble({ comment }: { comment: ReviewCommentData }) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
      {/* Avatar icon */}
      <div className="shrink-0 w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold mt-0.5">
        👷
      </div>
      <div className="flex-1 min-w-0">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
          <span className="text-xs font-semibold text-gray-800">
            {comment.agencyName}
          </span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-500">📍 {comment.city}</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-400">{timeAgo(comment.createdAt)}</span>
        </div>
        {/* Body — safe text rendering (no dangerouslySetInnerHTML) */}
        <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-line">
          {comment.body}
        </p>
      </div>
    </div>
  );
}

// ─── Comment form ─────────────────────────────────────────────────────────────

interface CommentFormProps {
  reviewId:    string;
  agencyName:  string;
  onSubmitted: (comment: ReviewCommentData) => void;
  onCancel:    () => void;
}

function CommentForm({ reviewId, agencyName, onSubmitted, onCancel }: CommentFormProps) {
  const [agency,       setAgency]       = useState(agencyName);
  const [city,         setCity]         = useState("");
  const [commentText,  setCommentText]  = useState("");
  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [submitting,   setSubmitting]   = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Local validation
    const localErrors: Record<string, string> = {};
    if (!agency.trim())       localErrors.agencyName  = "Agency name is required";
    if (!city.trim())         localErrors.city        = "City is required";
    if (!commentText.trim())  localErrors.commentText = "Comment cannot be empty";
    if (commentText.length > 2000) localErrors.commentText = "Comment must be under 2000 characters";

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/review-comments", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ reviewId, agencyName: agency, city, commentText }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ commentText: data.error ?? "Failed to submit. Please try again." });
        }
        return;
      }

      setSubmitted(true);
      // Notify parent with the new comment so it appears immediately
      onSubmitted(data.comment as ReviewCommentData);
    } catch {
      setErrors({ commentText: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-green-800">
        <span className="text-lg">✅</span>
        <span>Your comment was published. Thank you for sharing!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-700 mb-1">Add your experience</p>

      {/* Agency field */}
      <div>
        <input
          type="text"
          value={agency}
          onChange={(e) => setAgency(e.target.value)}
          placeholder="Agency name"
          maxLength={200}
          style={{ fontSize: "16px" }}
          className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-brand-500 transition
            ${errors.agencyName ? "border-red-400" : "border-gray-200"}`}
        />
        {errors.agencyName && (
          <p className="text-[11px] text-red-500 mt-0.5">{errors.agencyName}</p>
        )}
      </div>

      {/* City field */}
      <div>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City (e.g. Rotterdam)"
          maxLength={100}
          style={{ fontSize: "16px" }}
          className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-brand-500 transition
            ${errors.city ? "border-red-400" : "border-gray-200"}`}
        />
        {errors.city && (
          <p className="text-[11px] text-red-500 mt-0.5">{errors.city}</p>
        )}
      </div>

      {/* Comment textarea */}
      <div>
        <textarea
          ref={textareaRef}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Share your experience…"
          rows={3}
          maxLength={2000}
          style={{ fontSize: "16px" }}
          className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none
            ${errors.commentText ? "border-red-400" : "border-gray-200"}`}
        />
        <div className="flex justify-between mt-0.5">
          {errors.commentText ? (
            <p className="text-[11px] text-red-500">{errors.commentText}</p>
          ) : (
            <span />
          )}
          <span className={`text-[10px] ${commentText.length > 1800 ? "text-amber-500" : "text-gray-400"}`}>
            {commentText.length}/2000
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold
            transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Publish comment"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium
            hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>

      <p className="text-[10px] text-gray-400 leading-snug">
        Your comment will be published immediately. Please be respectful and factual.
      </p>
    </form>
  );
}

// ─── Main ReviewComments component ───────────────────────────────────────────

export function ReviewComments({ reviewId, agencyName, initialComments }: ReviewCommentsProps) {
  const [comments,     setComments]     = useState<ReviewCommentData[]>(initialComments ?? []);
  const [loading,      setLoading]      = useState(!initialComments);
  const [showForm,     setShowForm]     = useState(false);

  // If no initial comments were provided (e.g. inside AgencyReviewsSection client component),
  // fetch them client-side on mount.
  useEffect(() => {
    if (initialComments) return; // already have data from SSR
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/review-comments?reviewId=${encodeURIComponent(reviewId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setComments(data.comments ?? []);
      } catch {
        // silently ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewId]);

  function handleNewComment(comment: ReviewCommentData) {
    setComments((prev) => [...prev, comment]);
    setShowForm(false);
  }

  const commentCount = comments.length;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {/* Section header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {loading
            ? "Comments"
            : commentCount > 0
              ? `${commentCount} comment${commentCount !== 1 ? "s" : ""}`
              : "Comments"}
        </span>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline
              transition flex items-center gap-1"
          >
            <span>+</span>
            <span>Worked there too? Add your comment</span>
          </button>
        )}
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="py-2">
          <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
        </div>
      ) : commentCount > 0 ? (
        <div className="divide-y divide-gray-50 mb-3">
          {comments.map((c) => (
            <CommentBubble key={c.id} comment={c} />
          ))}
        </div>
      ) : (
        !showForm && (
          <p className="text-xs text-gray-400 py-1 mb-2">
            No comments yet. Be the first to share your experience.
          </p>
        )
      )}

      {/* Comment form */}
      {showForm && (
        <CommentForm
          reviewId={reviewId}
          agencyName={agencyName}
          onSubmitted={handleNewComment}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
