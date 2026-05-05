"use client";

import { useState } from "react";

interface Props {
  title: string;   // job title
  url?: string;    // defaults to current page URL
}

export default function ShareJobButton({ title, url }: Props) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const shareUrl  = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const shareText = `${title} — Apply now via AgencyCheck`;

  async function handleShare() {
    // Native share (mobile) — falls back to copy-to-clipboard
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // User cancelled — do nothing
      }
      return;
    }

    // Fallback: copy link
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available — silent fail
    }
  }

  return (
    <button
      onClick={handleShare}
      className="
        inline-flex items-center gap-2
        border border-white/10 bg-white/[0.04]
        hover:bg-white/[0.08] active:scale-[0.97]
        text-gray-400 hover:text-gray-200
        text-[13px] font-semibold
        px-4 py-2.5 rounded-xl
        transition-all duration-150
      "
      aria-label="Share this job"
    >
      {copied || shared ? (
        <>
          <svg className="w-4 h-4 text-[#22C55E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-[#22C55E]">{copied ? "Link copied!" : "Shared!"}</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share this job
        </>
      )}
    </button>
  );
}
