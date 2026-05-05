"use client";

import { useState } from "react";

export interface FAQItem {
  q: string;
  a: string;
}

interface JobFAQProps {
  items: FAQItem[];
}

export default function JobFAQ({ items }: JobFAQProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="my-10">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-semibold">
        Frequently Asked Questions
      </p>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={`rounded-xl border transition-all duration-150 ${
              open === i
                ? "border-[#22C55E]/30 bg-[#22C55E]/[0.07]"
                : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15]"
            }`}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-start justify-between gap-4 text-left px-4 py-4"
              aria-expanded={open === i}
            >
              <span className={`text-sm font-semibold leading-snug ${open === i ? "text-[#22C55E]" : "text-white"}`}>
                {item.q}
              </span>
              <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                open === i
                  ? "bg-[#22C55E] border-[#22C55E] text-white"
                  : "border-white/20 text-gray-400"
              }`}>
                <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3 h-3 transition-transform duration-150 ${open === i ? "rotate-180" : ""}`}>
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            {open === i && (
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-300 leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
