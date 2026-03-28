"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  QA_SEED,
  EXAMPLE_PROMPTS,
  getQAsForContext,
  type QAQuestion,
  type QAAnswer,
} from "@/lib/qaData";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Detect agency slug from pathname like /agencies/randstad-nederland */
function useAgencySlugFromPath(): string | undefined {
  const pathname = usePathname();
  const match = pathname.match(/^\/agencies\/([^/]+)/);
  return match ? match[1] : undefined;
}

/** Format a seed date string to relative label */
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

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function AuthorBadge({ label }: { label: QAAnswer["authorLabel"] }) {
  if (label === "Verified worker") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-green-100 text-green-700 rounded-full px-1.5 py-0.5">
        ✅ {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">
      👷 {label}
    </span>
  );
}

function AnswerThread({
  answers,
  questionId,
  onAddAnswer,
}: {
  answers: QAAnswer[];
  questionId: string;
  onAddAnswer: (questionId: string, text: string) => void;
}) {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddAnswer(questionId, trimmed);
    setText("");
    setReplying(false);
  };

  return (
    <div className="mt-2 space-y-2">
      {answers.map((a) => (
        <div key={a.id} className="flex gap-2">
          <div className="w-0.5 bg-gray-200 shrink-0 ml-2 rounded-full" />
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <AuthorBadge label={a.authorLabel} />
              <span className="text-[9px] text-gray-400" suppressHydrationWarning>{relativeDate(a.createdAt)}</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">{a.text}</p>
          </div>
        </div>
      ))}

      {/* Reply input */}
      {replying ? (
        <div className="ml-4 mt-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share what you know from experience..."
            rows={2}
            className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none focus:outline-none focus:border-gray-400 placeholder-gray-300"
          />
          <div className="flex gap-2 mt-1.5">
            <button
              onClick={submit}
              disabled={!text.trim()}
              className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition-colors"
            >
              Post answer
            </button>
            <button
              onClick={() => { setReplying(false); setText(""); }}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5"
            >
              Cancel
            </button>
          </div>
          <p className="text-[9px] text-gray-400 mt-1">
            Posted as Worker (reported) — anonymous
          </p>
        </div>
      ) : (
        <button
          onClick={() => setReplying(true)}
          className="ml-4 text-[10px] text-gray-400 hover:text-gray-600 font-medium transition-colors"
        >
          + Add answer
        </button>
      )}
    </div>
  );
}

function QuestionCard({
  question,
  onAddAnswer,
  defaultOpen,
}: {
  question: QAQuestion;
  onAddAnswer: (questionId: string, text: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? question.answers.length > 0);
  const answerCount = question.answers.length;
  const hasAnswers  = answerCount > 0;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      {/* Question row */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-3.5 py-3 flex items-start justify-between gap-2 hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-snug">{question.text}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {hasAnswers ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 rounded-full px-2 py-0.5">
                💬 {answerCount} {answerCount === 1 ? "person answered" : "people answered"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-50 text-amber-600 rounded-full px-2 py-0.5">
                ❓ No answers yet — be the first
              </span>
            )}
            <span className="text-[9px] text-gray-400" suppressHydrationWarning>{relativeDate(question.createdAt)}</span>
          </div>
        </div>
        <span className="text-gray-400 text-xs shrink-0 mt-0.5">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Answers */}
      {open && (
        <div className="px-3.5 pb-3 border-t border-gray-50">
          {!hasAnswers ? (
            <p className="text-xs text-gray-400 mt-3 italic">
              Nobody has answered this yet. Share your experience below.
            </p>
          ) : null}
          <AnswerThread
            answers={question.answers}
            questionId={question.id}
            onAddAnswer={onAddAnswer}
          />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main panel
// ─────────────────────────────────────────────────────────────────────────────

export default function WorkerQAPanel({ hideTrigger = false }: { hideTrigger?: boolean }) {
  const agencySlug = useAgencySlugFromPath();
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState<QAQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load context-aware questions
  useEffect(() => {
    setQuestions(getQAsForContext(agencySlug));
  }, [agencySlug]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const submitQuestion = () => {
    const trimmed = newQuestion.trim();
    if (!trimmed) return;

    const newQ: QAQuestion = {
      id: `user-${Date.now()}`,
      agencySlug: agencySlug ?? "global",
      text: trimmed,
      answers: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setQuestions((prev) => [newQ, ...prev]);
    setNewQuestion("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const addAnswer = (questionId: string, text: string) => {
    const newAnswer: QAAnswer = {
      id: `ans-${Date.now()}`,
      text,
      authorLabel: "Worker (reported)",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, answers: [...q.answers, newAnswer] }
          : q
      )
    );
  };

  const fillPrompt = (prompt: string) => {
    setNewQuestion(prompt);
    inputRef.current?.focus();
  };

  // Agency-specific questions at top, then global
  const agencyQuestions = questions.filter(
    (q) => q.agencySlug !== "global" && q.agencySlug === agencySlug
  );
  const globalQuestions = questions.filter((q) => q.agencySlug === "global");

  // Community stats
  const totalAnswers   = questions.reduce((sum, q) => sum + q.answers.length, 0);
  const activeThreads  = questions.filter((q) => q.answers.length > 0).length;
  const recentActivity = [...questions]
    .sort((a, b) => {
      const latestA = a.answers.length > 0 ? Math.max(...a.answers.map((ans) => new Date(ans.createdAt).getTime())) : new Date(a.createdAt).getTime();
      const latestB = b.answers.length > 0 ? Math.max(...b.answers.map((ans) => new Date(ans.createdAt).getTime())) : new Date(b.createdAt).getTime();
      return latestB - latestA;
    })
    .slice(0, 3);

  return (
    <>
      {/* ── Floating button (bottom-right) ──
           When hideTrigger=true the button is invisible but remains in the DOM
           so FloatingStack can click it programmatically via [aria-label="Ask workers"].
      ── */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-20 right-4 z-30 flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 group${hideTrigger ? " opacity-0 pointer-events-none" : ""}`}
        aria-label="Ask workers"
        title="Ask workers about this agency"
      >
        <span className="relative">
          <span className="text-base leading-none">💬</span>
          {totalAnswers > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
              {totalAnswers > 9 ? "9+" : totalAnswers}
            </span>
          )}
        </span>
        <span>Ask workers</span>
        <span className="hidden group-hover:inline text-gray-300 text-[9px] ml-0.5 whitespace-nowrap">
          {totalAnswers > 0 ? `${totalAnswers} answers` : "— be the first"}
        </span>
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Slide-in panel ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Worker Q&A"
        className={`fixed top-0 right-0 h-full z-50 w-full max-w-md bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Panel header ── */}
        <div className="bg-gray-950 text-white px-5 pt-5 pb-4 shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                Worker community
              </p>
              <h2 className="text-base font-black text-white leading-tight">
                Real questions. Real answers.
              </h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                From workers who actually worked here — not agency marketing.
              </p>
              <p className="text-[9px] text-gray-600 mt-1 leading-snug">
                ℹ️ Questions &amp; answers are submitted by workers. Not moderated or verified by AgencyCheck.
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-300 transition-colors p-1 text-lg leading-none ml-3 shrink-0"
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>

          {/* Community stats */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-white/8 rounded-lg px-2 py-2 text-center">
              <p className="text-base font-black text-white">{questions.length}</p>
              <p className="text-[9px] text-gray-400">questions</p>
            </div>
            <div className="bg-white/8 rounded-lg px-2 py-2 text-center">
              <p className="text-base font-black text-green-400">{totalAnswers}</p>
              <p className="text-[9px] text-gray-400">answers</p>
            </div>
            <div className="bg-white/8 rounded-lg px-2 py-2 text-center">
              <p className="text-base font-black text-amber-400">{activeThreads}</p>
              <p className="text-[9px] text-gray-400">active threads</p>
            </div>
          </div>
        </div>

        {/* ── Ask a question ── */}
        <div className="border-b border-gray-100 px-4 py-4 bg-gray-50 shrink-0">
          <label className="block text-xs font-bold text-gray-700 mb-2">
            Ask a question
          </label>
          <textarea
            ref={inputRef}
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Is housing shared? How much do you really pay per week?"
            rows={2}
            className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-gray-400 bg-white placeholder-gray-300 leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submitQuestion();
            }}
          />

          {/* Example prompts */}
          <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
            {EXAMPLE_PROMPTS.slice(0, 4).map((prompt) => (
              <button
                key={prompt}
                onClick={() => fillPrompt(prompt)}
                className="text-[9px] bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400 rounded-full px-2 py-0.5 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 mt-2">
            <p className="text-[9px] text-gray-400">Anonymous · Ctrl+Enter to post</p>
            <button
              onClick={submitQuestion}
              disabled={!newQuestion.trim()}
              className="text-xs font-black bg-gray-900 text-white px-4 py-2 rounded-xl disabled:opacity-30 hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              Ask question
            </button>
          </div>

          {submitted && (
            <p className="text-xs text-green-600 font-semibold mt-2">
              ✅ Question posted. Others can answer it.
            </p>
          )}
        </div>

        {/* ── Questions list ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

          {/* Latest discussions — recent activity summary */}
          {recentActivity.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Latest discussions</p>
              </div>
              <div className="space-y-1.5">
                {recentActivity.map((q) => (
                  <div key={q.id} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-800 font-medium leading-snug truncate">{q.text}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {q.answers.length > 0 ? (
                        <span className="text-[9px] text-green-600 font-bold">💬 {q.answers.length} answered</span>
                      ) : (
                        <span className="text-[9px] text-amber-500 font-bold">⏳ Awaiting answer</span>
                      )}
                      <span className="text-[9px] text-gray-400" suppressHydrationWarning>{relativeDate(q.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-3" />
            </div>
          )}

          {/* Agency-specific questions */}
          {agencySlug && agencyQuestions.length > 0 && (
            <>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Questions about this agency
              </p>
              {agencyQuestions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  onAddAnswer={addAnswer}
                  defaultOpen={i === 0}
                />
              ))}
              <div className="border-t border-gray-100 pt-3" />
            </>
          )}

          {/* Global questions */}
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
            {agencySlug && agencyQuestions.length > 0
              ? "General worker questions"
              : "Worker questions"}
          </p>

          {globalQuestions.length === 0 && agencyQuestions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">💬</p>
              <p className="text-sm text-gray-500 font-semibold">No questions yet</p>
              <p className="text-xs text-gray-400 mt-1">Be the first to ask something</p>
            </div>
          ) : (
            globalQuestions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                onAddAnswer={addAnswer}
                defaultOpen={i === 0 && agencyQuestions.length === 0}
              />
            ))
          )}

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>

        {/* ── Panel footer ── */}
        <div className="shrink-0 border-t border-gray-100 px-4 py-3 bg-white">
          <p className="text-[9px] text-gray-400 text-center leading-relaxed">
            📊 Based on worker reports — not verified by agencies.<br />
            Always confirm details directly with the agency before signing.
          </p>
        </div>
      </div>
    </>
  );
}
