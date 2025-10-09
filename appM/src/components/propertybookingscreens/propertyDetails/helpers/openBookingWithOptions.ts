type Dates = { checkIn: Date | null; checkOut: Date | null };

export function openBookingWithOptions(
  setBookingPriceOverride: (price: number | null) => void,
  setBookingAltDateRange: (label: string | null) => void,
  setSelectedDates: (dates: Dates) => void,
  navigation: any,
  property: any,
  selectedGuests: any,
  dates?: Dates | null,
  price?: any,
  altLabel?: string | null,
) {
  if (price !== undefined && price !== null) {
    let parsedPrice: number | null = null;
    if (typeof price === "number") parsedPrice = price;
    else if (typeof price === "string") {
      const cleaned = price.replace(/[^0-9.,]/g, "").replace(",", ".");
      const n = Number(cleaned);
      parsedPrice = isNaN(n) ? null : n;
    }
    setBookingPriceOverride(parsedPrice);
  } else {
    setBookingPriceOverride(null);
  }

  setBookingAltDateRange(altLabel ?? null);

  if (dates) {
    const coerce = (d: any) => (d ? new Date(d) : null);
    const ci = coerce(dates.checkIn);
    const co = coerce(dates.checkOut);
    setSelectedDates({ checkIn: ci, checkOut: co });
    setTimeout(() => {
      navigation.navigate("PropertyConfirmationScreen", {
        property,
        selectedDates: { checkIn: ci, checkOut: co },
        selectedGuests,
        bookingPriceOverride:
          price !== undefined && price !== null
            ? typeof price === "number"
              ? price
              : Number(price.replace(/[^0-9.,]/g, "").replace(",", "."))
            : null,
        bookingAltDateRange: altLabel,
      });
    }, 0);
    return;
  }

  setBookingAltDateRange(altLabel ?? null);
  navigation.navigate("PropertyConfirmationScreen", {
    property,
    selectedDates: { checkIn: null, checkOut: null },
    selectedGuests,
    bookingPriceOverride:
      price !== undefined && price !== null
        ? typeof price === "number"
          ? price
          : Number(price.replace(/[^0-9.,]/g, "").replace(",", "."))
        : null,
    bookingAltDateRange: altLabel,
  });
}
