"use client";

/**
 * QAReadSection — Displays all Q&As for an agency page with expandable answers.
 * Shows agency-specific questions first, then global worker questions.
 * Includes inline ask-a-question form at the bottom.
 */

import { useState } from "react";
import type { QAQuestion, QAAnswer } from "@/lib/qaData";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
}

// ─── Single answer row ────────────────────────────────────────────────────────

function AnswerRow({ answer }: { answer: QAAnswer }) {
  return (
    <div className="flex gap-2">
      <div className="w-0.5 bg-gray-200 rounded-full shrink-0 ml-2" />
      <div className="flex-1 min-w-0 pb-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {answer.authorLabel === "Verified worker" ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-green-100 text-green-700 rounded-full px-1.5 py-0.5">
              ✅ {answer.authorLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">
              👷 {answer.authorLabel}
            </span>
          )}
          <span className="text-[9px] text-gray-400">{relativeDate(answer.createdAt)}</span>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">{answer.text}</p>
      </div>
    </div>
  );
}

// ─── Single question card ─────────────────────────────────────────────────────

function QACard({ qa, defaultOpen = false }: { qa: QAQuestion; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const answerCount = qa.answers.length;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      {/* Question header — click to expand */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-3.5 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-snug">{qa.text}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {answerCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 rounded-full px-2 py-0.5">
                💬 {answerCount} {answerCount === 1 ? "answer" : "answers"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-50 text-amber-600 rounded-full px-2 py-0.5">
                ❓ No answers yet — be the first
              </span>
            )}
            <span className="text-[9px] text-gray-400">{relativeDate(qa.createdAt)}</span>
          </div>
        </div>
        <span className="text-gray-400 text-xs mt-1 shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {/* Expanded answers */}
      {open && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
          {answerCount === 0 ? (
            <p className="text-xs text-gray-400 italic">
              Nobody has answered this yet. Share your experience using the form below.
            </p>
          ) : (
            qa.answers.map((a) => <AnswerRow key={a.id} answer={a} />)
          )}
        </div>
      )}
    </div>
  );
}

// ─── Inline ask-a-question form ───────────────────────────────────────────────

const PROMPT_CHIPS = [
  "Is housing shared with others?",
  "How much do you actually earn per week?",
  "Is transport provided or do you pay extra?",
  "Are deductions fair and transparent?",
  "What are the working hours really like?",
  "Can you leave the contract early?",
];

function AskForm({ agencySlug, agencyName }: { agencySlug: string; agencyName: string }) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    setText("");
    setExpanded(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  if (submitted) {
    return (
      <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3.5 text-center">
        <p className="text-sm font-bold text-green-700">✅ Question posted!</p>
        <p className="text-xs text-green-600 mt-0.5">
          Workers who know {agencyName} will be notified to answer.
        </p>
      </div>
    );
  }

  if (!expanded) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setExpanded(true)}
          className="w-full bg-gray-900 hover:bg-gray-700 active:bg-gray-800 text-white text-sm font-bold px-4 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="text-base leading-none">💬</span>
          <span>Ask workers about {agencyName}</span>
          <span className="ml-auto text-gray-400 text-xs font-normal">→</span>
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-1.5">
          Anonymous · answered by workers who have been here
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-950 px-4 py-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-black text-white leading-tight">
            Ask workers about {agencyName}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Workers who have been there will answer anonymously
          </p>
        </div>
        <button
          onClick={() => { setExpanded(false); setText(""); }}
          className="text-gray-500 hover:text-gray-300 transition-colors text-base leading-none ml-1 shrink-0 mt-0.5"
          aria-label="Cancel"
        >
          ✕
        </button>
      </div>
      <div className="p-4">
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you want to know? E.g. Is housing shared? How much is really deducted per week?"
          rows={3}
          className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-gray-400 placeholder-gray-300 leading-relaxed"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
          }}
        />
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {PROMPT_CHIPS.map((p) => (
            <button
              key={p}
              onClick={() => setText(p)}
              className="text-[9px] bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full px-2.5 py-1 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3.5 gap-3">
          <p className="text-[9px] text-gray-400 leading-snug">
            Posted anonymously · Ctrl+Enter to submit
          </p>
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="text-xs font-black bg-gray-900 text-white px-5 py-2.5 rounded-xl disabled:opacity-30 hover:bg-gray-700 transition-colors whitespace-nowrap"
          >
            Post question
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

interface Props {
  agencySlug: string;
  agencyName: string;
  /** Pre-fetched from server: includes both agency-specific + global QAs */
  initialQAs: QAQuestion[];
}

export default function QAReadSection({ agencySlug, agencyName, initialQAs }: Props) {
  const agencyQAs = initialQAs.filter((q) => q.agencySlug === agencySlug);
  const globalQAs = initialQAs.filter((q) => q.agencySlug === "global");

  const hasAny = agencyQAs.length > 0 || globalQAs.length > 0;

  return (
    <div>
      {!hasAny ? (
        <div className="px-4 py-6 text-center bg-white rounded-xl border border-gray-100">
          <p className="text-xl mb-2">💬</p>
          <p className="text-sm text-gray-500 font-semibold">No questions yet for this agency</p>
          <p className="text-xs text-gray-400 mt-1">Be the first to ask below</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Agency-specific questions */}
          {agencyQAs.length > 0 && (
            <>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 px-1 pt-1">
                Questions about this agency
              </p>
              {agencyQAs.map((qa, i) => (
                <QACard key={qa.id} qa={qa} defaultOpen={i === 0} />
              ))}
            </>
          )}

          {/* Global worker questions */}
          {globalQAs.length > 0 && (
            <>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 px-1 pt-3">
                {agencyQAs.length > 0 ? "General worker questions" : "Worker questions"}
              </p>
              {globalQAs.slice(0, 5).map((qa, i) => (
                <QACard key={qa.id} qa={qa} defaultOpen={agencyQAs.length === 0 && i === 0} />
              ))}
            </>
          )}
        </div>
      )}

      {/* Ask a question form */}
      <AskForm agencySlug={agencySlug} agencyName={agencyName} />
    </div>
  );
}
