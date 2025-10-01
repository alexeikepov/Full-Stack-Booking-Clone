// Utility to format guest information for display in the search UI
// Used in SearchScreen and possibly other components

import { GuestData } from "../types/GuestData";

export function formatGuests(selectedGuests: GuestData): string {
  const { rooms, adults, children } = selectedGuests;
  // Check if it's still the default values
  if (rooms === 1 && adults === 2 && children === 0) {
    return "Rooms & guests";
  }

  let result = `${rooms} room${rooms > 1 ? "s" : ""} · ${adults} adult${
    adults > 1 ? "s" : ""
  }`;
  if (children > 0) {
    result += ` · ${children} child${children > 1 ? "ren" : ""}`;
  }
  return result;
}
