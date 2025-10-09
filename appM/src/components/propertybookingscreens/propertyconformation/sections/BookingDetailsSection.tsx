import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../hooks/ThemeContext";
import createStyles from "../../../../screens/propertyBookingScreens/propertyConfirmation/PropertyConfirmationScreen.styles";

interface BookingDetailsSectionProps {
  selectedDates: { checkIn: Date | null; checkOut: Date | null };
  selectedGuests: {
    rooms: number;
    adults: number;
    children: number;
  };
  bookingAltDateRange: string | null;
  onDatePress: () => void;
  onGuestPress: () => void;
}

const BookingDetailsSection: React.FC<BookingDetailsSectionProps> = ({
  selectedDates,
  selectedGuests,
  bookingAltDateRange,
  onDatePress,
  onGuestPress,
}) => {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);

  return (
    <View style={styles.bookingDetailsSection}>
      <Text style={styles.sectionTitleBooking}>Booking details</Text>
      <View style={styles.bookingDetailRow}>
        <Text style={styles.bookingDetailLabel}>Dates</Text>
        <TouchableOpacity onPress={onDatePress}>
          <Text
            style={{
              color:
                selectedDates.checkIn && selectedDates.checkOut
                  ? colors.button
                  : colors.red,
              textDecorationLine: "underline",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {selectedDates.checkIn && selectedDates.checkOut
              ? `${selectedDates.checkIn.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} - ${selectedDates.checkOut.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}`
              : bookingAltDateRange || "Select dates"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bookingDetailRow}>
        <Text style={styles.bookingDetailLabel}>Rooms & guests</Text>
        <TouchableOpacity onPress={onGuestPress}>
          <Text
            style={{
              color:
                selectedGuests?.adults >= 1 && selectedGuests?.rooms >= 1
                  ? colors.button
                  : colors.red,
              textDecorationLine: "underline",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {selectedGuests?.rooms >= 1 && selectedGuests?.adults >= 1
              ? `${selectedGuests.rooms} room(s) • ${
                  selectedGuests.adults
                } adult(s)${
                  selectedGuests.children > 0
                    ? ` • ${selectedGuests.children} child(ren)`
                    : ""
                }`
              : "Select rooms & guests"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingDetailsSection;
