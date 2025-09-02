import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bed } from "lucide-react";
import { DatePicker } from "./DatePicker";
import { GuestsPopover } from "./GuestsPopover";
import type { PickerValue } from "./types";
import type { DateRange } from "react-day-picker";

export default function HeroSearch() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const [city, setCity] = useState(params.get("city") || "");
  const initialFrom = params.get("from");
  const initialTo = params.get("to");

  const [picker, setPicker] = useState<PickerValue>(() => {
    const from = initialFrom ? new Date(initialFrom) : undefined;
    const to = initialTo ? new Date(initialTo) : undefined;
    return from
      ? { mode: "calendar", range: { from, to } }
      : {
          mode: "flexible",
          stay: null,
          months: [],
          nights: 1,
          startDay: "monday",
        };
  });

  const [adults, setAdults] = useState<number>(
    Math.max(1, Number(params.get("adults") || 2))
  );
  const [children, setChildren] = useState<number>(
    Math.max(0, Number(params.get("children") || 0))
  );
  const [rooms, setRooms] = useState<number>(
    Math.max(1, Number(params.get("rooms") || 1))
  );

  useEffect(() => {
    setCity(params.get("city") || "");
    const f = params.get("from");
    const t = params.get("to");
    const from = f ? new Date(f) : undefined;
    const to = t ? new Date(t) : undefined;
    setPicker(
      from
        ? { mode: "calendar", range: { from, to } }
        : {
            mode: "flexible",
            stay: null,
            months: [],
            nights: 1,
            startDay: "monday",
          }
    );
    setAdults(Math.max(1, Number(params.get("adults") || 2)));
    setChildren(Math.max(0, Number(params.get("children") || 0)));
    setRooms(Math.max(1, Number(params.get("rooms") || 1)));
  }, [params]);

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
