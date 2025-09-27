interface ScoreBadgeProps {
  value: number;
}

export function ScoreBadge({ value }: ScoreBadgeProps) {
  return (
    <div className="inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-[4px] bg-[#003b95] px-2 text-[12px] font-semibold text-white">
      {value.toFixed(1)}
    </div>
  );
}
