// Utility to parse a guest string like "2 adults" or "1 adult" into a GuestData object
import { GuestData } from "../types/GuestData";

export function parseGuestString(guestString: string): GuestData {
  // Parse strings like "2 adults", "1 adult", etc.
  const adultMatch = guestString.match(/(\d+)\s+adult/);
  const adults = adultMatch ? parseInt(adultMatch[1]) : 2;

  return {
    rooms: 1,
    adults: adults,
    children: 0,
    childAges: [],
    pets: false,
  };
}
