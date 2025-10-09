import { useEffect, useRef, useState } from "react";
import type { SortKey } from "@/utils/sortHotels";
import { SORT_LABEL } from "@/utils/sortHotels";

const ORDER: SortKey[] = [
  "top_picks",
  "price_low",
  "price_high",
  "rating_high",
  "rating_low",
  "distance_low",
  "reviews_high",
];

type Props = {
  value: SortKey;
  onChange: (v: SortKey) => void;
};

export default function SortBar({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-md bg-[#0071c2] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#005fa3]"
      >
        <span className="inline-block h-4 w-4 rounded-sm bg-white/20" />
        Sort by: <span className="font-semibold">{SORT_LABEL[value]}</span>
        <svg width="14" height="14" viewBox="0 0 20 20" className="opacity-90">
          <path fill="currentColor" d="M5 7l5 6 5-6H5z" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-[280px] rounded-md border bg-white p-1 shadow-lg">
          <ul className="max-h-96 overflow-auto text-[13px]">
            {ORDER.map((k) => (
              <li key={k}>
                <button
                  className={`w-full rounded px-2 py-1.5 text-left hover:bg-muted ${
                    k === value ? "bg-muted font-medium" : ""
                  }`}
                  onClick={() => {
                    onChange(k);
                    setOpen(false);
                  }}
                >
                  {SORT_LABEL[k]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
