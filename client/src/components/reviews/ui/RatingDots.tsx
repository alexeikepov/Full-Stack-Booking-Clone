interface RatingDotsProps {
  value: number;
  onChange: (value: number) => void;
}

export function RatingDots({ value, onChange }: RatingDotsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Set rating ${n}`}
          onClick={() => onChange(n)}
          className={
            "h-6 w-6 rounded-full border text-[11px] font-semibold transition-colors " +
            (value >= n
              ? "bg-[#003b95] border-[#003b95] text-white"
              : "border-[#d1d5db] text-[#6b7280] hover:border-[#9ca3af]")
          }
        >
          {n}
        </button>
      ))}
    </div>
  );
}
