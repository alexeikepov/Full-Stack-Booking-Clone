import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../../types/navigation";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../hooks/ThemeContext";
import { useBookings } from "../../../hooks/BookingsContext";
import { useNotifications } from "../../../hooks/NotificationsContext";
import { useMessages } from "../../../hooks/MessagesContext";
import { API_CONFIG, getApiUrl } from "../../../services/apiConfig";
// import createStyles from "../../../screens/propertyBookingScreens/propertyConfirmation/PropertyConfirmationScreen.styles";

interface FirstFreeBookingModalProps {
  visible: boolean;
  onClose: () => void;
  onBookingComplete?: (confirmationCode: string) => void;
}

const FirstFreeBookingModal: React.FC<FirstFreeBookingModalProps> = ({
  visible,
  onClose,
  onBookingComplete,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { colors, theme } = useTheme();
  // const styles = createStyles(colors, theme); // Not used in this component
  const { addBooking } = useBookings();
  const { addNotification } = useNotifications();
  const { addMessage } = useMessages();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!formData.name.trim()) {
      Alert.alert("Validation Error", "Please enter your name");
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert("Validation Error", "Please enter your email");
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Generate confirmation details
      const confirmationCode = `FREE${Date.now()}${Math.random()
        .toString(36)
        .substr(2, 4)
        .toUpperCase()}`;

      const pin = Math.floor(1000 + Math.random() * 9000).toString();

      // Create a simplified booking object
      const newBooking = {
        id: Date.now().toString(),
        propertyName: "First Free Stay",
        dates: "Flexible dates available",
        price: "FREE",
        status: "Confirmed",
        location: "Available worldwide",
        details: {
          confirmationNumber: confirmationCode,
          pin: pin,
          checkIn: "Flexible",
          checkOut: "Flexible",
          address: "Various locations available",
          roomType: "Standard Room",
          includedExtras: "Welcome package included",
          breakfastIncluded: true,
          nonRefundable: false,
          totalPrice: "FREE",
          shareOptions: ["booking", "email"],
          contactNumber: "Available after booking",
        },
        guestInfo: {
          name: formData.name,
          email: formData.email,
        },
      };

      // Add to bookings context
      addBooking(newBooking);

      // Send confirmation email (if API enabled)
      if (API_CONFIG.ENABLED) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            API_CONFIG.TIMEOUT,
          );
          const response = await fetch(
            getApiUrl("/api/email/send-confirmation"),
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: formData.email,
                confirmationCode,
                bookingDetails: {
                  propertyName: newBooking.propertyName,
                  checkIn: newBooking.details?.checkIn || "Flexible",
                  checkOut: newBooking.details?.checkOut || "Flexible",
                  guestName: formData.name,
                  totalPrice: newBooking.price,
                },
              }),
              signal: controller.signal,
            },
          );
          clearTimeout(timeoutId);
          const result = await response.json();
          if (!response.ok)
            throw new Error(result.message || "Failed to send email");
        } catch (e) {
          console.error("Email send error:", e);
          // Optionally show a warning, but don't block booking
          Alert.alert(
            "Email Warning",
            "Could not send confirmation email, but your booking is confirmed.",
          );
        }
      }

      // Add notification
      addNotification({
        type: "booking_success",
        title: "First Free Booking Confirmed!",
        message: `Your booking is confirmed. Confirmation code: ${confirmationCode}`,
        bookingId: newBooking.id,
        iconName: "gift",
      });

      // Add message
      addMessage({
        type: "system",
        senderName: "System",
        senderRole: "System",
        subject: "Welcome! Your Free Booking is Confirmed",
        message: `Hi ${formData.name},\n\nYour first free booking is confirmed!\nConfirmation Code: ${confirmationCode}\nPIN: ${pin}\nEnjoy your stay!`,
        bookingId: newBooking.id,
        propertyName: newBooking.propertyName,
      });

      // Reset form
      setFormData({ name: "", email: "" });

      // Close modal and trigger completion callback
      onClose();
      onBookingComplete?.(confirmationCode);

      // Show alert and then navigate to Bookings screen
      Alert.alert(
        "Booking Confirmed!",
        `Congratulations ${formData.name}! Your first free booking is confirmed.\n\nConfirmation Code: ${confirmationCode}\nPIN: ${pin}\n\nCheck your email for full details and next steps.`,
        [
          {
            text: "View My Booking",
            onPress: () => {
              // Navigate directly to the Bookings tab
              navigation.navigate("MainTabs", { screen: "Bookings" });
            },
          },
        ],
      );
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "" });
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
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
            minWidth: 320,
            maxWidth: 400,
            marginHorizontal: 20,
          }}
        >
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons
                name="gift"
                size={48}
                color={colors.button}
                style={{ marginRight: 12 }}
              />
              <View>
                <Text
                  style={{
                    color: colors.button,
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "left",
                  }}
                >
                  First Stay FREE!
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                    textAlign: "left",
                  }}
                >
                  Welcome bonus
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              Get your first booking absolutely free! Just enter your name and
              email to claim this exclusive welcome offer.
            </Text>
          </View>

          {/* Form */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Full Name *
            </Text>
            <TextInput
              style={{
                backgroundColor:
                  theme === "light" ? "#f8f9fa" : colors.inputBackground,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: colors.text,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: theme === "light" ? "#e9ecef" : colors.separator,
              }}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              autoCapitalize="words"
              returnKeyType="next"
            />

            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Email Address *
            </Text>
            <TextInput
              style={{
                backgroundColor:
                  theme === "light" ? "#f8f9fa" : colors.inputBackground,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: colors.text,
                borderWidth: 1,
                borderColor: theme === "light" ? "#e9ecef" : colors.separator,
              }}
              placeholder="Enter your email address"
              placeholderTextColor={colors.textSecondary}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          {/* Benefits */}
          <View
            style={{
              backgroundColor:
                theme === "light" ? `${colors.button}10` : `${colors.button}20`,
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              What&apos;s included:
            </Text>
            {[
              "Free accommodation (1 night)",
              "Welcome package",
              "Breakfast included",
              "Flexible dates",
              "No hidden fees",
            ].map((benefit, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.button}
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor:
                  theme === "light" ? "#f8f9fa" : colors.inputBackground,
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: theme === "light" ? "#e9ecef" : colors.separator,
              }}
              onPress={handleClose}
              disabled={loading}
            >
              <Text
                style={{
                  color: colors.text,
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 2,
                backgroundColor: colors.button,
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
                shadowColor: colors.button,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 4,
                elevation: 2,
                opacity: loading ? 0.7 : 1,
              }}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {loading ? "Claiming..." : "Claim FREE Stay"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 11,
              textAlign: "center",
              marginTop: 12,
              lineHeight: 16,
            }}
          >
            By claiming this offer, you agree to our terms and conditions. Your
            email will be used for booking confirmations only.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default FirstFreeBookingModal;
