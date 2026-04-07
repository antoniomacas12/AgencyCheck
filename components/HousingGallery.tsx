"use client";

// ─── HousingGallery — worker-submitted housing photos ─────────────────────────
// Small thumbnails in a scrollable strip. Click any to open a fullscreen
// lightbox with keyboard nav, thumbnail filmstrip, and scroll-lock.
//
// LEGAL NOTE: All photos are voluntarily submitted by workers.
// They are NOT official agency photos and do NOT represent current conditions.
// Conditions may have changed since photos were taken.

import { useState, useCallback, useEffect } from "react";
import type { HousingImage } from "@/lib/housingImages";

interface Props {
  images:     HousingImage[];
  agencyName: string;
}

export default function HousingGallery({ images, agencyName }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const isOpen = active !== null;

  const close = useCallback(() => setActive(null), []);
  const prev  = useCallback(() => setActive((p) => (p !== null ? (p - 1 + images.length) % images.length : null)), [images.length]);
  const next  = useCallback(() => setActive((p) => (p !== null ? (p + 1) % images.length : null)), [images.length]);

  // Keyboard nav + scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <>
      {/* ── Small thumbnail grid ── */}
      <div className="flex flex-wrap gap-1 p-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setActive(i)}
            className="relative shrink-0 overflow-hidden rounded group focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-1"
            style={{ width: 58, height: 46 }}
            aria-label={`View photo ${i + 1} of ${images.length}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-150 group-hover:scale-110"
              loading="lazy"
            />
            {/* Zoom hint on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-150 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
      <div className="px-3 pb-2">
        <p className="text-[10px] text-gray-400">
          {images.length} photo{images.length !== 1 ? "s" : ""} · worker-submitted · click to enlarge
        </p>
        <p className="text-[9px] text-gray-600 mt-0.5 leading-snug">
          📷 Submitted by workers who lived here. Not official agency photos. Conditions may vary. Verify with agency before accepting.
        </p>
      </div>

      {/* ── Fullscreen lightbox ── */}
      {isOpen && active !== null && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col bg-black/95 housing-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Housing photos – ${agencyName}`}
          onClick={close}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0" onClick={(e) => e.stopPropagation()}>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{agencyName}</p>
              <p className="text-gray-400 text-xs">{images[active].alt} · {active + 1} / {images.length}</p>
              <p className="text-gray-600 text-[9px] mt-0.5">Worker-submitted · not an official agency photo · conditions may vary</p>
            </div>
            <button
              onClick={close}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close lightbox"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main image area */}
          <div className="flex-1 flex items-center justify-center px-2 relative min-h-0" onClick={(e) => e.stopPropagation()}>
            {/* Prev */}
            {images.length > 1 && (
              <button
                onClick={prev}
                className="absolute left-2 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
                aria-label="Previous photo"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active].src}
              alt={images[active].alt}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
              style={{ maxHeight: "calc(100vh - 180px)" }}
            />

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={next}
                className="absolute right-2 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
                aria-label="Next photo"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Filmstrip thumbnails */}
          {images.length > 1 && (
            <div className="shrink-0 px-4 py-3 flex gap-1.5 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`shrink-0 rounded overflow-hidden transition-all ${
                    i === active
                      ? "ring-2 ring-white scale-105"
                      : "opacity-40 hover:opacity-75"
                  }`}
                  style={{ width: 48, height: 36 }}
                  aria-label={`Go to photo ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          {/* Hint */}
          <p className="text-center text-gray-600 text-[10px] pb-2 shrink-0">
            ← → arrow keys · Esc to close
          </p>
        </div>
      )}
    </>
  );
}
