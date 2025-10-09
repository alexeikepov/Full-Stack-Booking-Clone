import type { DateRange } from "react-day-picker";

export type FlexibleStay = "weekend" | "week" | "month" | "other";
export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type PickerValue =
  | { mode: "calendar"; range?: DateRange }
  | {
      mode: "flexible";
      stay: FlexibleStay | null;
      months: string[];
      nights?: number;
      startDay?: Weekday;
    };
