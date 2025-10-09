import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { PickerValue } from "@/components/search/types";

interface SearchState {
  city: string;
  picker: PickerValue;
  adults: number;
  children: number;
  rooms: number;

  // Actions
  setCity: (city: string) => void;
  setPicker: (picker: PickerValue) => void;
  setAdults: (adults: number) => void;
  setChildren: (children: number) => void;
  setRooms: (rooms: number) => void;
  setSearchParams: (params: URLSearchParams) => void;
}

const defaultPicker: PickerValue = {
  mode: "calendar",
  range: { from: undefined, to: undefined },
};

export const useSearchStore = create<SearchState>()(
  devtools(
    persist(
      (set) => ({
        city: "",
        picker: defaultPicker,
        adults: 2,
        children: 0,
        rooms: 1,

        setCity: (city) => set({ city }, false, "search/setCity"),
        setPicker: (picker) => set({ picker }, false, "search/setPicker"),
        setAdults: (adults) => set({ adults }, false, "search/setAdults"),
        setChildren: (children) =>
          set({ children }, false, "search/setChildren"),
        setRooms: (rooms) => set({ rooms }, false, "search/setRooms"),

        setSearchParams: (params) => {
          const city = params.get("city") || "";
          const from = params.get("from");
          const to = params.get("to");
          const adults = Math.max(1, Number(params.get("adults") || 2));
          const children = Math.max(0, Number(params.get("children") || 0));
          const rooms = Math.max(1, Number(params.get("rooms") || 1));

          const picker: PickerValue = {
            mode: "calendar",
            range: {
              from: from ? new Date(from) : undefined,
              to: to ? new Date(to) : undefined,
            },
          };

          set(
            {
              city,
              picker,
              adults,
              children,
              rooms,
            },
            false,
            "search/setSearchParams"
          );
        },
      }),
      { name: "booking-search" }
    ),
    { name: "search-store" }
  )
);
