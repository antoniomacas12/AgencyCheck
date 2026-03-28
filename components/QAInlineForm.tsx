"use client";

import { useState, useRef } from "react";

const EXAMPLE_PROMPTS = [
  "Is housing shared with others?",
  "How much do you actually earn per week?",
  "Is transport provided or do you pay extra?",
  "Are deductions fair and transparent?",
  "What are the working hours really like?",
  "Can you leave the contract early?",
];

interface Props {
  agencySlug: string;
  agencyName: string;
}

export default function QAInlineForm({ agencySlug, agencyName }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => textareaRef.current?.focus(), 120);
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    // Optimistic UI — in production this would POST to an API
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
          onClick={handleExpand}
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
      {/* Mini header */}
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

      {/* Input area */}
      <div className="p-4">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you want to know? E.g. Is housing shared? How much is really deducted per week?"
          rows={3}
          className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-gray-400 placeholder-gray-300 leading-relaxed"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
          }}
        />

        {/* Prompt chips */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {EXAMPLE_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => { setText(p); textareaRef.current?.focus(); }}
              className="text-[9px] bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full px-2.5 py-1 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Actions row */}
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
