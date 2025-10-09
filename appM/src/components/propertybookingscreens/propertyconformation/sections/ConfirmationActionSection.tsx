import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../../hooks/ThemeContext";
import { useBookings } from "../../../../hooks/BookingsContext";
import { FirstFreeBookingModal } from "../../../../components/shared";
import createStyles from "../../../../screens/propertyBookingScreens/propertyConfirmation/PropertyConfirmationScreen.styles";

interface ConfirmationActionSectionProps {
  bookingSubmitting: boolean;
  confirmBookingError: string;
  onConfirmBooking: () => void;
}

const ConfirmationActionSection: React.FC<ConfirmationActionSectionProps> = ({
  bookingSubmitting,
  confirmBookingError,
  onConfirmBooking,
}) => {
  const { colors, theme } = useTheme();
  const { bookings } = useBookings();
  const styles = createStyles(colors, theme);
  const [showFirstFreeBookingModal, setShowFirstFreeBookingModal] =
    useState(false);

  // Check if user has already claimed first free booking
  const hasClaimedFirstFreeBooking = bookings.some(
    (booking) => booking.propertyName === "First Free Stay",
  );

  const handleFirstFreeBooking = () => {
    setShowFirstFreeBookingModal(true);
  };

  const handleModalClose = () => {
    setShowFirstFreeBookingModal(false);
  };

  const handleBookingComplete = (confirmationCode: string) => {
    console.log("First free booking completed:", confirmationCode);
    // You can add navigation or other logic here if needed
  };

  return (
    <View>
      {/* First Free Booking Button with Badge - Only show if not claimed */}
      {!hasClaimedFirstFreeBooking && (
        <>
          <View style={{ position: "relative", marginBottom: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.button,
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: colors.button,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={handleFirstFreeBooking}
              activeOpacity={0.8}
            >
              <Ionicons
                name="gift"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Claim First Stay FREE!
              </Text>
            </TouchableOpacity>

            {/* New User Badge */}
            <View
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                backgroundColor: "#FF6B35",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  fontWeight: "bold",
                  letterSpacing: 0.5,
                }}
              >
                NEW USER
              </Text>
            </View>
          </View>

          {/* OR Divider - Only show if first free booking button is visible */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 16,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor:
                  theme === "light" ? "#e0e0e0" : colors.separator,
              }}
            />
            <Text
              style={{
                marginHorizontal: 16,
                color: colors.textSecondary,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              OR
            </Text>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor:
                  theme === "light" ? "#e0e0e0" : colors.separator,
              }}
            />
          </View>
        </>
      )}

      {/* Regular Confirm Booking Button */}
      <TouchableOpacity
        style={styles.confirmBookingButton}
        onPress={onConfirmBooking}
        disabled={bookingSubmitting}
      >
        {bookingSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmBookingButtonText}>Confirm Booking</Text>
        )}
      </TouchableOpacity>

      {/* Show error below button if missing fields */}
      {confirmBookingError ? (
        <Text
          style={{
            color: "red",
            textAlign: "left",
            marginTop: -20, // Move error even higher, closer to button
            marginBottom: 10,
            paddingBottom: 10,
            paddingLeft: 20,
          }}
        >
          {confirmBookingError}
        </Text>
      ) : null}

      {/* First Free Booking Modal */}
      <FirstFreeBookingModal
        visible={showFirstFreeBookingModal}
        onClose={handleModalClose}
        onBookingComplete={handleBookingComplete}
      />
    </View>
  );
};

export default ConfirmationActionSection;
