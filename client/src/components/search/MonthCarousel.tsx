import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { monthsForward } from "./utils";
import { useMemo, useState } from "react";

export function MonthCarousel({
  selected,
  onToggle,
  visibleCount = 5,
  total = 18,
}: {
  selected: string[];
  onToggle: (key: string) => void;
  visibleCount?: number;
  total?: number;
}) {
  const months = useMemo(() => monthsForward(total), [total]);
  const [index, setIndex] = useState(0);
  const slice = months.slice(index, index + visibleCount);

  return (
    <div className="relative w-[570px]">
      <button
        type="button"
        aria-label="Prev"
        disabled={index === 0}
        onClick={() => setIndex((i) => Math.max(0, i - 1))}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-white p-2 shadow hover:bg-gray-50 disabled:opacity-40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="mx-10 flex items-stretch justify-center gap-3">
        {slice.map(({ key, date }) => {
          const active = selected.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggle(key)}
              className={`w-28 rounded-xl border p-3 text-left transition ${
                active
                  ? "border-[#1a73e8] ring-2 ring-[#1a73e8]/40"
                  : "border-black/10 hover:border-black/30"
              }`}
            >
              <div className="mb-1">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">{format(date, "MMM")}</div>
              <div className="text-xs text-black/60">
                {format(date, "yyyy")}
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Next"
        disabled={index + visibleCount >= months.length}
        onClick={() =>
          setIndex((i) => Math.min(months.length - visibleCount, i + 1))
        }
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-white p-2 shadow hover:bg-gray-50 disabled:opacity-40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
