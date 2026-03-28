"use client";

import { useState, useRef, useCallback } from "react";

// ─── PayslipUploader ──────────────────────────────────────────────────────────
// Client component for uploading a payslip image and previewing it.
// No OCR — just preview + contextual tips.

export default function PayslipUploader() {
  const [preview, setPreview]     = useState<string | null>(null);
  const [fileName, setFileName]   = useState<string | null>(null);
  const [dragging, setDragging]   = useState(false);
  const inputRef                  = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") return;
    setFileName(file.name);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      // PDF — show a placeholder
      setPreview("pdf");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function clearFile() {
    setPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="mb-8">
      {/* Drop zone */}
      {!preview && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
            ${dragging
              ? "border-brand-400 bg-brand-50 scale-[1.01]"
              : "border-gray-300 bg-gray-50 hover:border-brand-300 hover:bg-brand-50/40"
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleChange}
            className="hidden"
          />
          <div className="text-4xl mb-3">📄</div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {dragging ? "Drop your payslip here" : "Upload your payslip (loonstrook)"}
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Drag and drop, or click to select. Supports JPG, PNG, PDF.
          </p>
          <span className="inline-block bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-brand-700 transition-colors">
            Choose file
          </span>
          <p className="text-[10px] text-gray-400 mt-3">
            Your file stays on your device. Nothing is uploaded to our servers.
          </p>
        </div>
      )}

      {/* Image preview */}
      {preview && preview !== "pdf" && (
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">📄</span>
              <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{fileName}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-xs text-brand-600 hover:underline font-medium"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={clearFile}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Remove ×
              </button>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleChange}
            className="hidden"
          />
          {/* Payslip image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Payslip preview"
            className="w-full max-h-[500px] object-contain bg-gray-100 p-2"
          />

          {/* Overlay guide */}
          <div className="bg-blue-50 border-t border-blue-100 px-4 py-3">
            <p className="text-xs font-semibold text-blue-700 mb-2">
              📌 While reviewing your payslip, check for these key lines:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                "Uurloon / Uurloon basis — your hourly rate",
                "Loonheffing — income tax deducted",
                "Vakantiegeld — holiday allowance (8%)",
                "Huisvesting — housing deduction",
                "Nettoloon — what you actually receive",
                "Verlofuren — vacation hours accrued",
                "Overuren toeslag — overtime surcharge",
                "Vervoer / Reiskosten — transport cost",
              ].map((line) => (
                <div key={line} className="text-[11px] text-blue-700 flex items-start gap-1">
                  <span className="text-blue-400 shrink-0 mt-0.5">→</span>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PDF placeholder */}
      {preview === "pdf" && (
        <div className="border border-gray-200 rounded-2xl bg-gray-50 p-8 text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">📑</span>
              <span className="text-sm font-medium text-gray-700 truncate">{fileName}</span>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Remove ×
            </button>
          </div>
          <div className="text-4xl mb-2">📑</div>
          <p className="text-sm font-semibold text-gray-700 mb-1">PDF payslip uploaded</p>
          <p className="text-xs text-gray-500 mb-3">
            Open the PDF in your browser or PDF viewer to read it. Use the checklist below while reviewing.
          </p>
          <p className="text-[10px] text-gray-400">
            Your file stays on your device — nothing was sent to our servers.
          </p>
        </div>
      )}
    </div>
  );
}
