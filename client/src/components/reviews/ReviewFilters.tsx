interface ReviewFiltersProps {
  year: string;
  months: number;
  onYearChange: (year: string) => void;
}

export function ReviewFilters({
  year,
  months,
  onYearChange,
}: ReviewFiltersProps) {
  return (
    <div className="mb-3 flex items-center justify-end gap-2">
      <select
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        className="h-8 rounded-[6px] border border-[#dfe6ef] bg-white px-2 text-[12px] text-[#1a1a1a]"
      >
        <option>2025</option>
        <option>2024</option>
        <option>2023</option>
      </select>

      <div className="rounded-[6px] border border-[#dfe6ef] bg-white px-2 py-1 text-[12px] text-[#3b3f46]">
        {months} months
      </div>
    </div>
  );
}
