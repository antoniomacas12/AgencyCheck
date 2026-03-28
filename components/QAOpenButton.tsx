"use client";

/**
 * Thin client button that opens the WorkerQAPanel
 * by triggering the floating "Ask workers" button.
 * Used on agency pages to wire up the static Q&A preview footer.
 */
export default function QAOpenButton() {
  const handleClick = () => {
    const btn = document.querySelector<HTMLButtonElement>('[aria-label="Ask workers"]');
    if (btn) btn.click();
  };

  return (
    <button
      onClick={handleClick}
      className="text-xs font-bold text-gray-900 hover:text-brand-600 transition-colors whitespace-nowrap"
    >
      💬 Ask a question →
    </button>
  );
}
