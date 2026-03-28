"use client";

interface StarRatingInputProps {
  label:     string;
  value:     number;           // 0 = unset, 1-5 = selected
  onChange:  (val: number) => void;
  required?: boolean;
  optional?: boolean;
}

export default function StarRatingInput({
  label,
  value,
  onChange,
  required = false,
  optional = false,
}: StarRatingInputProps) {
  const LABELS = ["", "Poor", "Below average", "Average", "Good", "Excellent"];

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {optional && (
          <span className="text-xs text-gray-400">(optional)</span>
        )}
        {required && value === 0 && (
          <span className="text-xs text-red-400">required</span>
        )}
      </div>

      <div className="flex items-center gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star === value ? 0 : star)}
            aria-label={`${star} star — ${LABELS[star]}`}
            aria-pressed={value === star}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-2xl
              transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-400
              ${star <= value
                ? "text-amber-400 hover:text-amber-500"
                : "text-gray-300 hover:text-amber-300"
              }`}
          >
            ★
          </button>
        ))}

        {value > 0 && (
          <span className="ml-1 text-xs text-gray-500">{LABELS[value]}</span>
        )}
      </div>
    </div>
  );
}
