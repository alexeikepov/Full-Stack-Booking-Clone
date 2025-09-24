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
import { getMyLastSearch, saveMyLastSearch } from "@/lib/api";
import { useTranslation } from "react-i18next";

export default function HeroSearch() {
  const { t } = useTranslation();
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

  // Load last search from backend (fallback to local persisted store)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const last = await getMyLastSearch();
        if (mounted && last) {
          if (last.city) setCity(last.city);
          if (last.adults != null) setAdults(last.adults);
          if (last.children != null) setChildren(last.children);
          if (last.rooms != null) setRooms(last.rooms);
          if (last.from || last.to) {
            setPicker({
              mode: "calendar",
              range: {
                from: last.from ? new Date(last.from) : undefined,
                to: last.to ? new Date(last.to) : undefined,
              },
            });
          }
        }
      } catch {
        // silently ignore; Zustand persist will already hydrate defaults
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setCity, setAdults, setChildren, setRooms, setPicker]);

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

    // Save to backend history (fire and forget)
    (async () => {
      try {
        const r: DateRange | undefined = picker.mode === "calendar" ? picker.range : undefined;
        await saveMyLastSearch({
          city,
          adults,
          children,
          rooms,
          from: r?.from ? r.from.toISOString() : undefined,
          to: r?.to ? r.to.toISOString() : undefined,
        });
      } catch {}
    })();

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
                placeholder={t("search.where")}
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
            {t("search.cta")}
          </Button>
        </div>
      </div>
    </div>
  );
}
