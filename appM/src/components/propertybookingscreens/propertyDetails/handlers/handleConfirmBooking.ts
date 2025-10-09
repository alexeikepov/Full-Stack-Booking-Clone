// handleConfirmBooking.ts
// Extracted from PropertyDetailsScreen.tsx

export interface BookingDetails {
  checkIn: Date | null;
  checkOut: Date | null;
}

export interface GuestDetails {
  rooms: number;
  adults: number;
  children?: number;
  childAges?: number[];
  pets?: boolean;
}

export interface PropertyDetails {
  name?: string;
  address?: string;
  pricePerNight?: number;
  details?: any;
}

export interface HandleConfirmBookingParams {
  selectedDates: BookingDetails;
  selectedGuests: GuestDetails;
  cardSubmittedSuccess: boolean;
  bookingPriceOverride: number | null;
  property: PropertyDetails;
  propertyId: string;
  addBooking: (booking: any) => void;
  setLastConfirmationCode: (code: string) => void;
  setBookingPriceOverride: (price: number | null) => void;
  setBookingAltDateRange: (range: string | null) => void;
  setShowPaymentConfirmationModal: (show: boolean) => void;
  setConfirmBookingError: (err: string) => void;
  setBookingSubmitting: (submitting: boolean) => void;
}

export async function handleConfirmBooking({
  selectedDates,
  selectedGuests,
  cardSubmittedSuccess,
  bookingPriceOverride,
  property,
  propertyId,
  addBooking,
  setLastConfirmationCode,
  setBookingPriceOverride,
  setBookingAltDateRange,
  setShowPaymentConfirmationModal,
  setConfirmBookingError,
  setBookingSubmitting,
}: HandleConfirmBookingParams) {
  setBookingSubmitting(true);
  try {
    // simulate processing delay
    await new Promise((res) => setTimeout(res, 2000));

    // Check for missing fields
    const missing: string[] = [];
    if (!selectedDates.checkIn || !selectedDates.checkOut)
      missing.push("dates");
    if (!selectedGuests.rooms || !selectedGuests.adults) missing.push("guests");
    // Payment method: require cardSubmittedSuccess
    if (!cardSubmittedSuccess) missing.push("payment method");

    if (missing.length === 0) {
      // Create booking object and add to bookings context
      try {
        const bookingId = Math.random().toString(36).slice(2, 9);
        const nights =
          selectedDates.checkIn && selectedDates.checkOut
            ? Math.ceil(
                (selectedDates.checkOut.getTime() -
                  selectedDates.checkIn.getTime()) /
                  (1000 * 60 * 60 * 24),
              )
            : 1;
        const pricePerNight =
          bookingPriceOverride != null
            ? bookingPriceOverride
            : property?.pricePerNight
              ? Number(property.pricePerNight)
              : 100;
        const subtotal = pricePerNight * nights * selectedGuests.rooms;
        const taxes = Math.round(subtotal * 0.12);
        const total = subtotal + taxes;

        const confirmationCode = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

        const newBooking = {
          id: bookingId,
          propertyName: property.name || String(propertyId),
          dates:
            selectedDates.checkIn && selectedDates.checkOut
              ? `${selectedDates.checkIn.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} - ${selectedDates.checkOut.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}`
              : "Dates not set",
          price: `€${total}`,
          status: "Confirmed",
          location: property.address || "",
          details: {
            confirmationNumber: confirmationCode,
            pin: Math.floor(1000 + Math.random() * 9000).toString(),
            checkIn: selectedDates.checkIn
              ? selectedDates.checkIn.toISOString()
              : "",
            checkOut: selectedDates.checkOut
              ? selectedDates.checkOut.toISOString()
              : "",
            address: property.address || "",
            roomType: property.details?.roomType || "Standard",
            includedExtras: property.details?.includedExtras || "",
            breakfastIncluded: property.details?.breakfastIncluded || false,
            nonRefundable: property.details?.nonRefundable || false,
            totalPrice: `€${total}`,
            shareOptions: [],
            contactNumber: property.details?.contactNumber || "",
          },
        } as any;

        addBooking(newBooking);
        setLastConfirmationCode(confirmationCode);
      } catch (e) {
        console.warn("Failed to add booking:", e);
      }

      setBookingPriceOverride(null);
      setBookingAltDateRange(null);
      setShowPaymentConfirmationModal(true);
      setConfirmBookingError("");
    } else {
      setConfirmBookingError(
        `**Please select: ${missing
          .map((m) => m.charAt(0).toUpperCase() + m.slice(1))
          .join(" & ")}`,
      );
    }
  } finally {
    setBookingSubmitting(false);
  }
}
