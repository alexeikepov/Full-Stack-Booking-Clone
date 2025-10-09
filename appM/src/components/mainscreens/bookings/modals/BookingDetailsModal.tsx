import React from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useBookings, Booking } from "../../../../hooks/BookingsContext";

interface BookingDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  confirmationInput: string;
  setConfirmationInput: (value: string) => void;
  onManageBooking: () => void;
  onBookingFound: (booking: any) => void;
  selectedBooking?: Booking | null;
  colors: any;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  visible,
  onClose,
  confirmationInput,
  setConfirmationInput,
  onManageBooking,
  onBookingFound,
  selectedBooking,
  colors,
}) => {
  const { findBookingByConfirmationNumber } = useBookings();

  const handleManageBooking = () => {
    if (!confirmationInput.trim()) {
      Alert.alert("Error", "Please enter a confirmation number");
      return;
    }

    const booking = findBookingByConfirmationNumber(
      confirmationInput.trim().toUpperCase(),
    );

    if (booking) {
      onBookingFound(booking);
      onClose();
    } else {
      Alert.alert(
        "Booking Not Found",
        "No booking found with this confirmation number. Please check the number and try again.",
      );
    }
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <SafeAreaView
        style={[
          { flex: 1, backgroundColor: colors.background },
          { paddingHorizontal: 16 },
        ]}
        edges={["bottom"]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 16,
            paddingTop: 60,
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {selectedBooking
              ? "Verify booking access"
              : "Enter booking details"}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ marginTop: 24, paddingHorizontal: 8 }}>
          {selectedBooking && (
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {selectedBooking.propertyName}
            </Text>
          )}
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              textAlign: "center",
              marginBottom: 20,
              flexShrink: 1,
            }}
          >
            {selectedBooking
              ? "To access this booking's details, please enter the confirmation number for security verification."
              : "To manage an accommodation booking, enter the confirmation number. You received it when the booking was confirmed."}
          </Text>
          <TextInput
            style={{
              width: "100%",
              backgroundColor: colors.card,
              borderRadius: 8,
              padding: 12,
              color: colors.text,
              marginBottom: 10,
            }}
            placeholder="Confirmation number*"
            placeholderTextColor={colors.icon}
            value={confirmationInput}
            onChangeText={setConfirmationInput}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#007AFF",
              paddingVertical: 14,
              borderRadius: 8,
              width: "100%",
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={handleManageBooking}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Manage booking
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default BookingDetailsModal;
