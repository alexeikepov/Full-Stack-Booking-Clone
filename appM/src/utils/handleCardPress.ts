// Handles card press logic for search cards in the search screen
import { Dispatch, SetStateAction } from "react";
import { GuestData } from "../types/GuestData";
import { parseDateString } from "./parseDateString";
import { parseGuestString } from "./parseGuestString";

export function handleCardPress(
  location: string,
  dateString: string,
  guestString: string,
  setSearchParamsForPropertyList: Dispatch<
    SetStateAction<{
      location: string;
      dates: { checkIn: Date | null; checkOut: Date | null };
      guests: GuestData;
    } | null>
  >,
  setShowApartmentsList: Dispatch<SetStateAction<boolean>>,
) {
  const parsedDates = parseDateString(dateString);
  const parsedGuests = parseGuestString(guestString);

  setSearchParamsForPropertyList({
    location: location,
    dates: parsedDates,
    guests: parsedGuests,
  });
  setShowApartmentsList(true);
}
