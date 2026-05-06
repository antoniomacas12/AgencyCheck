"use client";

/**
 * TranslateButton — inline translate widget for review comments.
 *
 * Shows a subtle "Translate" link below any review text.
 * On click, auto-detects the source language and translates to English
 * using the free MyMemory API (no API key required, 5k chars/day per IP).
 *
 * If the text is already English the button is still shown — MyMemory
 * will return the same text, which is harmless.
 *
 * UX:
 *   [Translate ↓]          — idle
 *   [Translating...]       — loading
 *   Translated text shown  — done, with [Show original] toggle
 */

import { useState } from "react";

interface Props {
  text: string;
}

type State = "idle" | "loading" | "done" | "error";

async function callTranslateApi(text: string): Promise<string> {
  // MyMemory free API — no key needed, auto-detects source language
  const url =
    `https://api.mymemory.translated.net/get` +
    `?q=${encodeURIComponent(text)}` +
    `&langpair=autodetect|en` +
    `&de=agencycheck.io`; // optional email speeds up the limit

  const res = await fetch(url, { cache: "force-cache" }); // cache per-text
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  const translated: string = json?.responseData?.translatedText ?? "";
  if (!translated) throw new Error("Empty response");

  // MyMemory sometimes returns HTML entities — decode them
  return translated
    .replace(/&amp;/g,  "&")
    .replace(/&lt;/g,   "<")
    .replace(/&gt;/g,   ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'");
}

export default function TranslateButton({ text }: Props) {
  const [state,        setState]        = useState<State>("idle");
  const [translated,   setTranslated]   = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  // Don't render for empty / very short comments
  if (!text || text.trim().length < 15) return null;

  async function handleTranslate() {
    setState("loading");
    try {
      const result = await callTranslateApi(text);
      setTranslated(result);
      setState("done");
      setShowOriginal(false);
    } catch {
      setState("error");
    }
  }

  // ── Idle ─────────────────────────────────────────────────────────────────────
  if (state === "idle") {
    return (
      <button
        onClick={handleTranslate}
        className="mt-2 inline-flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-600 font-medium transition-colors"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        Translate
      </button>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (state === "loading") {
    return (
      <p className="mt-2 text-[11px] text-gray-400 animate-pulse">
        Translating…
      </p>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (state === "error") {
    return (
      <button
        onClick={handleTranslate}
        className="mt-2 inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-500 font-medium transition-colors"
      >
        Translation failed · Retry
      </button>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────────
  return (
    <div className="mt-2">
      {showOriginal ? (
        // Showing original — offer to switch back to translation
        <button
          onClick={() => setShowOriginal(false)}
          className="inline-flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          Show translation
        </button>
      ) : (
        // Showing translation
        <div>
          <p className="text-[10px] text-gray-400 mb-1.5 flex items-center gap-1">
            <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Translated to English
          </p>
          <blockquote className="border-l-2 border-blue-200 pl-3 text-xs text-gray-600 leading-relaxed italic">
            &ldquo;{translated}&rdquo;
          </blockquote>
          <button
            onClick={() => setShowOriginal(true)}
            className="mt-1.5 text-[11px] text-gray-400 hover:text-gray-500 transition-colors"
          >
            Show original
          </button>
        </div>
      )}
    </div>
  );
}
