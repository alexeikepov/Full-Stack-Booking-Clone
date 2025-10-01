// Handles location-only card press logic for search cards in the search screen
import { Dispatch, SetStateAction } from "react";
import { GuestData } from "../types/GuestData";

export function handleLocationOnlyPress(
  location: string,
  selectedDates: { checkIn: Date | null; checkOut: Date | null },
  selectedGuests: GuestData,
  setSearchParamsForPropertyList: Dispatch<
    SetStateAction<{
      location: string;
      dates: { checkIn: Date | null; checkOut: Date | null };
      guests: GuestData;
    } | null>
  >,
  setShowApartmentsList: Dispatch<SetStateAction<boolean>>,
) {
  setSearchParamsForPropertyList({
    location: location,
    dates: selectedDates,
    guests: selectedGuests,
  });
  setShowApartmentsList(true);
}
