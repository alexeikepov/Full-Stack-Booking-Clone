import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, User } from "lucide-react";
import { Counter } from "./Counter";
import { useMemo } from "react";

export function GuestsPopover({
  adults,
  children,
  rooms,
  setAdults,
  setChildren,
  setRooms,
  minRooms = 1,
}: {
  adults: number;
  children: number;
  rooms: number;
  setAdults: (n: number) => void;
  setChildren: (n: number) => void;
  setRooms: (n: number) => void;
  minRooms?: number;
}) {
  const label = useMemo(() => {
    const a = `${adults} adult${adults > 1 ? "s" : ""}`;
    const c =
      children === 0
        ? "0 children"
        : `${children} child${children === 1 ? "" : "ren"}`;
    const r = `${rooms} room${rooms > 1 ? "s" : ""}`;
    return `${a} · ${c} · ${r}`;
  }, [adults, children, rooms]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-14 w-full bg-white items-center justify-between gap-2 rounded-md border px-3 text-left"
        >
          <span className="flex items-center gap-2">
            <User className="h-5 w-5 text-black/60" />
            <span className="text-[13px] text-black/80 font-medium">
              {label}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 text-black/60" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-60">
        <div className="grid gap-1">
          <Counter label="Adults" value={adults} set={setAdults} min={1} />
          <Counter
            label="Children"
            value={children}
            set={setChildren}
            min={0}
          />
          <Counter label="Rooms" value={rooms} set={setRooms} min={minRooms} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
