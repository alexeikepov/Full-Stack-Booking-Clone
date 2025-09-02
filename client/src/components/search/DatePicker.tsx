// src/components/search/DatePicker.tsx
import { useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { MonthCarousel } from "./MonthCarousel";
import { capitalize, normalizeRange } from "./utils";
import type { PickerValue, FlexibleStay, Weekday } from "./types";

export function DatePicker({
  value,
  onChange,
  triggerClassName = "",
}: {
  value: PickerValue;
  onChange: (v: PickerValue) => void;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"calendar" | "flexible">(value.mode);

  const label = useMemo(() => {
    if (value.mode === "flexible") {
      const { stay, months, nights, startDay } = value;
      const stayLabel =
        stay === "weekend"
          ? "Check-in weekend"
          : stay === "week"
          ? "Check-in week"
          : stay === "month"
          ? "Check-in month"
          : stay === "other"
          ? `${nights ?? 1} night${
              (nights ?? 1) > 1 ? "s" : ""
            } · From ${capitalize(startDay ?? "monday")}`
          : "Flexible";
      const monthsLabel = months.length
        ? months
            .map((m) => {
              const [y, mm] = m.split("-");
              const d = new Date(Number(y), Number(mm) - 1, 1);
              return format(d, "MMM yyyy");
            })
            .join(", ")
        : "Select months";
      return `${stayLabel} - ${monthsLabel}`;
    }
    const from = value.range?.from;
    const to = value.range?.to;
    if (from && to) return `${format(from, "MMM d")} — ${format(to, "MMM d")}`;
    if (from) return `${format(from, "MMM d")} — Check-out date`;
    return "Check-in date — Check-out date";
  }, [value]);

  const setExactDays = (days: number) => {
    const start =
      value.mode === "calendar" && value.range?.from
        ? value.range.from
        : new Date();
    const end = addDays(start, Math.max(1, days));
    onChange({ mode: "calendar", range: { from: start, to: end } });
  };

  const toggleMonth = (key: string) => {
    if (value.mode !== "flexible") return;
    const has = value.months.includes(key);
    const months = has
      ? value.months.filter((m) => m !== key)
      : value.months.length >= 3
      ? value.months
      : [...value.months, key];
    onChange({ ...value, months, mode: "flexible" });
  };

  const canSelectFlexible: boolean =
    value.mode === "flexible" &&
    Boolean(value.stay) &&
    value.months.length > 0 &&
    (value.stay !== "other" ||
      (typeof value.nights === "number" &&
        value.nights >= 1 &&
        Boolean(value.startDay)));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex w-full items-center bg-white gap-2 rounded-md border px-3 text-left ${triggerClassName}`}
          onClick={() => setOpen((v) => !v)}
        >
          <CalendarIcon className="h-5 w-5 text-black/60" />
          <span className="text-[15px] text-black/80">{label}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[600px] p-0 [--primary:221_83%_53%] [--primary-foreground:0_0%_100%]"
        align="start"
      >
        <div className="flex flex-row items-center justify-center gap-10 w-full px-4 pt-3">
          <button
            className={`pb-2 w-full text-sm font-medium ${
              tab === "calendar"
                ? "text-[#1a73e8] border-b-2 border-[#1a73e8]"
                : "text-black/60"
            }`}
            onClick={() => setTab("calendar")}
          >
            Calendar
          </button>
          <button
            className={`pb-2 w-full text-sm font-medium ${
              tab === "flexible"
                ? "text-[#1a73e8] border-b-2 border-[#1a73e8]"
                : "text-black/60"
            }`}
            onClick={() => setTab("flexible")}
          >
            I&apos;m flexible
          </button>
        </div>
        <Separator />

        {tab === "calendar" ? (
          <div className="grid gap-2 p-3">
            <Calendar
              className={["w-full", "[&_.rdp-day_today]:!font-bold"].join(" ")}
              mode="range"
              numberOfMonths={2}
              selected={value.mode === "calendar" ? value.range : undefined}
              onSelect={(r: DateRange | undefined) =>
                onChange({ mode: "calendar", range: normalizeRange(r) })
              }
              autoFocus
              classNames={{
                day: "h-9 w-9 p-0 rounded aria-selected:opacity-100",

                selected:
                  "!bg-blue-600 !text-white hover:!bg-blue-600 focus:!bg-blue-600",

                range_start:
                  "!bg-blue-600 !text-white !rounded-r-none hover:!bg-blue-700 focus:!bg-blue-700",
                range_end:
                  "!bg-blue-600 !text-white !rounded-l-none hover:!bg-blue-700 focus:!bg-blue-700",
                range_middle: "!bg-blue-50 !text-blue-700 hover:!bg-blue-100",

                today: "!text-blue-800 !font-bold",
                outside: "!text-gray-300",
                disabled: "!text-gray-300 !opacity-50",
              }}
            />
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExactDays(0)}
              >
                Exact dates
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExactDays(1)}
              >
                + 1 day
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExactDays(2)}
              >
                + 2 days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExactDays(3)}
              >
                + 3 days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExactDays(7)}
              >
                + 7 days
              </Button>
              <div className="ml-auto">
                <Button size="sm" onClick={() => setOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <FlexiblePanel
            value={value}
            onChange={onChange}
            toggleMonth={toggleMonth}
            canSelect={canSelectFlexible}
            setOpen={setOpen}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

function FlexiblePanel({
  value,
  onChange,
  toggleMonth,
  canSelect,
  setOpen,
}: {
  value: PickerValue;
  onChange: (v: PickerValue) => void;
  toggleMonth: (key: string) => void;
  canSelect: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <div className="grid gap-4 p-4">
      <div>
        <div className="mb-2 text-base font-semibold">
          How long do you want to stay?
        </div>
        <div className="flex flex-wrap gap-3">
          {(["weekend", "week", "month", "other"] as FlexibleStay[]).map(
            (opt) => (
              <Button
                key={opt}
                type="button"
                variant={
                  value.mode === "flexible" && value.stay === opt
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  onChange({
                    mode: "flexible",
                    stay: opt,
                    months: value.mode === "flexible" ? value.months : [],
                    nights: value.mode === "flexible" ? value.nights : 1,
                    startDay:
                      value.mode === "flexible" ? value.startDay : "monday",
                  })
                }
              >
                {opt === "weekend"
                  ? "A weekend"
                  : opt === "week"
                  ? "A week"
                  : opt === "month"
                  ? "A month"
                  : "Other"}
              </Button>
            )
          )}
        </div>

        {value.mode === "flexible" && value.stay === "other" && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="number"
              min={1}
              className="h-10 w-24 rounded-md border px-3 text-sm dark:bg-neutral-900 dark:border-white/20"
              value={value.nights ?? 1}
              onChange={(e) =>
                onChange({
                  ...value,
                  mode: "flexible",
                  nights: Math.max(1, Number(e.target.value || 1)),
                })
              }
            />
            <span className="text-sm">
              night{(value.nights ?? 1) > 1 ? "s" : ""}
            </span>
            <select
              className="h-10 rounded-md border px-3 text-sm dark:bg-neutral-900 dark:border-white/20"
              value={value.startDay ?? "monday"}
              onChange={(e) =>
                onChange({
                  ...value,
                  mode: "flexible",
                  startDay: e.target.value as Weekday,
                })
              }
            >
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((d) => (
                <option key={d} value={d}>
                  From {capitalize(d)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <div className="mb-1 text-base font-semibold">
          When do you want to go?
        </div>
        <div className="mb-3 text-sm text-black/60">Select up to 3 months</div>
        <MonthCarousel
          selected={value.mode === "flexible" ? value.months : []}
          onToggle={toggleMonth}
          visibleCount={5}
          total={18}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() =>
            onChange({
              mode: "flexible",
              stay: null,
              months: [],
              nights: 1,
              startDay: "monday",
            })
          }
        >
          Select preferred months
        </Button>
        <Button disabled={!canSelect} onClick={() => setOpen(false)}>
          Select dates
        </Button>
      </div>
    </div>
  );
}
