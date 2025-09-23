import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bed } from "lucide-react";
import { DatePicker } from "./DatePicker";
import { GuestsPopover } from "./GuestsPopover";
import type { PickerValue } from "./types";
import type { DateRange } from "react-day-picker";
import { useSearchStore } from "@/stores/search";

export default function HeroSearch() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    city,
    picker,
    adults,
    children,
    rooms,
    setCity,
    setPicker,
    setAdults,
    setChildren,
    setRooms,
    setSearchParams,
  } = useSearchStore();

  useEffect(() => {
    setSearchParams(params);
  }, [params, setSearchParams]);

  const submit = () => {
    const base: Record<string, string> = {
      ...(city ? { city } : {}),
      adults: String(adults),
      children: String(children),
      rooms: String(rooms),
    };

    if (picker.mode === "calendar") {
      const r: DateRange | undefined = picker.range;
      const next = new URLSearchParams({
        ...base,
        ...(r?.from ? { from: r.from.toISOString().slice(0, 10) } : {}),
        ...(r?.to ? { to: r.to.toISOString().slice(0, 10) } : {}),
      });
      setParams(next);
      navigate(`/search?${next.toString()}`);
      return;
    }

    const next = new URLSearchParams({
      ...base,
      flex: "1",
      ...(picker.stay ? { stay: picker.stay } : {}),
      ...(picker.months.length ? { months: picker.months.join(",") } : {}),
      ...(picker.stay === "other"
        ? {
            nights: String(picker.nights ?? 1),
            startDay: String(picker.startDay ?? "monday"),
          }
        : {}),
    });
    setParams(next);
    navigate(`/search?${next.toString()}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="rounded-[8px] bg-[hsl(44,99%,50%)] p-1 shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
        <div className="grid grid-cols-[1.6fr_1.3fr_1.1fr_auto] gap-1 ">
          <div className="flex items-center ">
            <div className="flex h-14 w-full items-center gap-2 rounded-md border px-3 bg-white">
              <Bed className="h-5 w-5 text-black/60" />
              <Input
                className="flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0
                           text-black placeholder:text-black/90
                           dark:text-white dark:placeholder:text-white/60
                           font-semibold"
                placeholder="Where are you going?"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submit();
                  }
                }}
              />
            </div>
          </div>

          <DatePicker
            value={picker}
            onChange={setPicker}
            triggerClassName="h-14"
          />

          <GuestsPopover
            adults={adults}
            children={children}
            rooms={rooms}
            setAdults={setAdults}
            setChildren={setChildren}
            setRooms={setRooms}
          />

          <Button
            onClick={submit}
            className="h-14 rounded-md bg-[#0071c2] px-6 text-[18px] font-semibold text-white hover:bg-[#0a69b4]"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
