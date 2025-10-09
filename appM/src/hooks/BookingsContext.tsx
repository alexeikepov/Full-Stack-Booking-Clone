import { createContext, ReactNode, useContext, useState } from "react";

export interface Booking {
  id: string;
  propertyName: string;
  dates: string;
  price: string;
  status: string;
  location: string;
  details: {
    confirmationNumber: string;
    pin: string;
    checkIn: string;
    checkOut: string;
    address: string;
    roomType: string;
    includedExtras: string;
    breakfastIncluded: boolean;
    nonRefundable: boolean;
    totalPrice: string;
    shareOptions: string[];
    contactNumber: string;
  };
  guestInfo?: {
    name: string;
    email: string;
  };
}

interface BookingsContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  removeBooking: (bookingId: string) => void;
  updateBooking: (bookingId: string, patch: Partial<Booking>) => void;
  getActiveBookings: () => Booking[];
  getPastBookings: () => Booking[];
  findBookingByConfirmationNumber: (
    confirmationNumber: string,
  ) => Booking | null;
}

const BookingsContext = createContext<BookingsContextType | undefined>(
  undefined,
);

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
  };

  const removeBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const updateBooking = (bookingId: string, patch: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, ...patch } : b)),
    );
  };

  const getActiveBookings = () => {
    return bookings.filter(
      (booking) =>
        booking.status === "Confirmed" || booking.status === "Active",
    );
  };

  const getPastBookings = () => {
    return bookings.filter((booking) => booking.status === "Completed");
  };

  const findBookingByConfirmationNumber = (confirmationNumber: string) => {
    return (
      bookings.find(
        (booking) => booking.details.confirmationNumber === confirmationNumber,
      ) || null
    );
  };

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        addBooking,
        removeBooking,
        updateBooking,
        getActiveBookings,
        getPastBookings,
        findBookingByConfirmationNumber,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingsProvider");
  }
  return context;
};
