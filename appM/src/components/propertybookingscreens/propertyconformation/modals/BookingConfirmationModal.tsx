import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../../hooks/ThemeContext";
import createStyles from "../../../../screens/propertyBookingScreens/propertyConfirmation/PropertyConfirmationScreen.styles";

interface BookingConfirmationModalProps {
  visible: boolean;
  lastConfirmationCode?: string;
  userEmail?: string;
  onClose: () => void;
  onNavigateToBookings: () => void;
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  visible,
  lastConfirmationCode,
  userEmail,
  onClose,
  onNavigateToBookings,
}) => {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor:
            theme === "light" ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.7)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor:
              theme === "light" ? colors.background : colors.card,
            borderRadius: 24,
            padding: 32,
            shadowColor: theme === "light" ? "#000" : "#222",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
            alignItems: "center",
            minWidth: 320,
            maxWidth: 400,
            marginHorizontal: 20,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <Ionicons
              name="checkmark-circle"
              size={56}
              color={colors.button}
              style={{ marginBottom: 8 }}
            />
            <Text
              style={{
                color: colors.button,
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 4,
                textAlign: "center",
              }}
            >
              Payment Confirmed!
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                marginVertical: 8,
                textAlign: "center",
              }}
            >
              Your booking has been confirmed and payment processed!{"\n"}We are
              waiting for your arrival!
            </Text>
          </View>
          <View
            style={{
              backgroundColor:
                theme === "light" ? `${colors.button}10` : `${colors.button}30`,
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 24,
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <Ionicons
              name="mail"
              size={24}
              color={colors.button}
              style={{ marginBottom: 8 }}
            />
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "600",
                textAlign: "center",
                marginBottom: 4,
              }}
            >
              Confirmation Code Sent!
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Your booking confirmation code has been sent to:
            </Text>
            <Text
              style={{
                color: colors.button,
                fontSize: 14,
                fontWeight: "600",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              {userEmail || "your email address"}
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                textAlign: "center",
                marginTop: 8,
                fontStyle: "italic",
              }}
            >
              Check your inbox (and spam folder) for your confirmation code.
              {"\n"}
              Use this code to manage your booking.
            </Text>
          </View>
          <TouchableOpacity
            style={{
              ...styles.confirmBookingButton,
              backgroundColor: colors.button,
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 32,
              marginTop: 8,
              shadowColor: colors.button,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.18,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() => {
              onClose();
              onNavigateToBookings();
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              View My Bookings
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BookingConfirmationModal;
