import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import type { RootStackParamList } from "../../../types/navigation";
import { useTheme } from "../../../hooks/ThemeContext";
import { useBookings } from "../../../hooks/BookingsContext";
import { useNotifications } from "../../../hooks/NotificationsContext";
import { useMessages } from "../../../hooks/MessagesContext";
import {
  PropertySummarySection,
  BookingDetailsSection,
  PersonalDetailsSection,
  PriceSummarySection,
  ConfirmationActionSection,
} from "../../../components/propertybookingscreens/propertyconformation/sections";
import {
  PaymentDetailsModal,
  BookingConfirmationModal,
} from "../../../components/propertybookingscreens/propertyconformation/modals";
import DatesModal from "../../../components/mainscreens/search/modals/DatesModal";
import GuestsModal from "../../../components/mainscreens/search/modals/GuestsModal";

type PropertyConfirmationScreenProps = StackScreenProps<
  RootStackParamList,
  "PropertyConfirmationScreen"
>;

interface PropertyConfirmationScreenParams {
  property: any;
  selectedDates: { checkIn: Date | null; checkOut: Date | null };
  selectedGuests: any;
  bookingPriceOverride: number | null;
  bookingAltDateRange: string | null;
}

const PropertyConfirmationScreen: React.FC<PropertyConfirmationScreenProps> = ({
  navigation,
  route,
}) => {
  const { property, selectedDates, selectedGuests, bookingAltDateRange } =
    route.params as PropertyConfirmationScreenParams;

  const { colors } = useTheme();
  const { addBooking } = useBookings();
  const { addNotification } = useNotifications();
  const { addMessage } = useMessages();

  // State for personal details
  const [showPersonalDetails, setShowPersonalDetails] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [personalDetailsSubmitting, setPersonalDetailsSubmitting] =
    React.useState(false);
  const [personalDetailsSubmittedSuccess, setPersonalDetailsSubmittedSuccess] =
    React.useState(false);
  const [personalDetailsErrors, setPersonalDetailsErrors] = React.useState<
    string[]
  >([]);

  // State for payment details
  const [showPaymentDetails, setShowPaymentDetails] = React.useState(false);
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardName, setCardName] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvv, setCardCvv] = React.useState("");
  const [cardSubmitting, setCardSubmitting] = React.useState(false);
  const [cardSubmittedSuccess, setCardSubmittedSuccess] = React.useState(false);
  const [cardErrors, setCardErrors] = React.useState<string[]>([]);
  const [bookingSubmitting, setBookingSubmitting] = React.useState(false);
  const [confirmBookingError, setConfirmBookingError] = React.useState("");
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardOpen(true);
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  // State for booking confirmation modal
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] =
    React.useState(false);
  const [lastConfirmationCode, setLastConfirmationCode] =
    React.useState<string>("");

  // State for date and guest selection modals
  const [showDatesModal, setShowDatesModal] = React.useState(false);
  const [showGuestsModal, setShowGuestsModal] = React.useState(false);
  // Ensure checkIn and checkOut are Date objects (not strings)
  const parseDateMaybe = (d: any): Date | null => {
    if (!d) return null;
    if (d instanceof Date) return d;
    if (typeof d === "string") {
      const parsed = new Date(d);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  };
  const [localSelectedDates, setLocalSelectedDates] = React.useState({
    checkIn: parseDateMaybe(selectedDates?.checkIn),
    checkOut: parseDateMaybe(selectedDates?.checkOut),
  });
  const [localSelectedGuests, setLocalSelectedGuests] =
    React.useState(selectedGuests);

  // Calculate nights using local state
  const nights =
    localSelectedDates.checkIn && localSelectedDates.checkOut
      ? Math.ceil(
          (localSelectedDates.checkOut.getTime() -
            localSelectedDates.checkIn.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 1;

  // Parse price utility
  // Real email sending function using API
  const sendConfirmationEmail = async (
    confirmationCode: string,
    userEmail: string,
    bookingDetails: {
      propertyName: string;
      checkIn: string;
      checkOut: string;
      guestName: string;
      totalPrice: string;
    },
  ): Promise<void> => {
    try {
      const { API_CONFIG, getApiUrl } = await import(
        "../../../services/apiConfig"
      );

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.TIMEOUT,
      );

      const response = await fetch(getApiUrl("/api/email/send-confirmation"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          confirmationCode,
          bookingDetails,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send email");
      }

      if (result.success) {
        console.log(`✅ Email sent successfully to ${userEmail}`);

        // Show success alert
        Alert.alert(
          "Email Sent! 📧",
          `Your booking confirmation has been sent to:\n\n${userEmail}\n\nPlease check your inbox (and spam folder) for your confirmation code and booking details.`,
          [
            {
              text: "OK",
              style: "default",
            },
          ],
        );

        // Log preview URL if available (development only)
        if (result.previewUrl) {
          console.log("📧 Email preview:", result.previewUrl);
        }
      } else {
        throw new Error(result.error || "Email sending failed");
      }
    } catch (error) {
      console.error("❌ Email sending error:", error);

      // If API is disabled or server is down, show fallback message
      const { API_CONFIG } = await import("../../../services/apiConfig");
      if (!API_CONFIG.ENABLED) {
        Alert.alert(
          "Demo Mode 📧",
          `In a real app, your confirmation code would be sent to:\n\n${userEmail}\n\nYour confirmation code is: ${confirmationCode}`,
          [{ text: "OK", style: "default" }],
        );
        return; // Don't throw error in demo mode
      }

      throw new Error(
        error instanceof Error ? error.message : "Failed to send email",
      );
    }
  };

  // Copy the formatted price from PropertyCard
  const formattedPrice = (() => {
    const numPrice =
      typeof property.price === "string"
        ? property.price.replace(/[^\d]/g, "")
        : property.price.toString();
    const currencySymbol = "₪";
    return `${currencySymbol} ${numPrice}`;
  })();
  const pricePerNight = formattedPrice;
  const subtotal = formattedPrice;
  const taxes = "₪ 0";
  const total = formattedPrice;

  const handleSubmitPersonalDetails = async () => {
    setPersonalDetailsSubmitting(true);
    setPersonalDetailsErrors([]);

    // Validation
    const errors: string[] = [];
    if (!firstName.trim()) {
      errors.push("Please enter your first name");
    }
    if (!surname.trim()) {
      errors.push("Please enter your surname");
    }
    if (!email.trim()) {
      errors.push("Please enter your email address");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Please enter a valid email address");
    }
    if (!phone.trim()) {
      errors.push("Please enter your phone number");
    } else if (phone.replace(/[^\d]/g, "").length < 10) {
      errors.push("Please enter a valid phone number");
    }
    if (!country.trim()) {
      errors.push("Please enter your country of residence");
    }

    if (errors.length > 0) {
      setPersonalDetailsErrors(errors);
      setPersonalDetailsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setPersonalDetailsSubmittedSuccess(true);
      setPersonalDetailsSubmitting(false);
    }, 2000);
  };

  const handleSubmitCard = async () => {
    setCardSubmitting(true);
    setCardErrors([]);

    // Validation
    const errors: string[] = [];
    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      errors.push("Please enter a valid 16-digit card number");
    }
    if (!cardName.trim()) {
      errors.push("Please enter the name on the card");
    }
    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      errors.push("Please enter a valid expiry date (MM/YY)");
    }
    if (!cardCvv || cardCvv.length !== 3) {
      errors.push("Please enter a valid 3-digit CVV");
    }

    if (errors.length > 0) {
      setCardErrors(errors);
      setCardSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setCardSubmittedSuccess(true);
      setCardSubmitting(false);
    }, 2000);
  };

  const handleConfirmBooking = async () => {
    setBookingSubmitting(true);
    setConfirmBookingError("");

    // Validate dates
    if (!localSelectedDates.checkIn || !localSelectedDates.checkOut) {
      setConfirmBookingError("Please select check-in and check-out dates");
      setBookingSubmitting(false);
      return;
    }

    // Validate that check-out is after check-in
    if (localSelectedDates.checkOut <= localSelectedDates.checkIn) {
      setConfirmBookingError("Check-out date must be after check-in date");
      setBookingSubmitting(false);
      return;
    }

    // Validate that dates are not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (localSelectedDates.checkIn < today) {
      setConfirmBookingError("Check-in date cannot be in the past");
      setBookingSubmitting(false);
      return;
    }

    // Validate guests
    if (!localSelectedGuests.adults || localSelectedGuests.adults < 1) {
      setConfirmBookingError("Please select at least 1 adult guest");
      setBookingSubmitting(false);
      return;
    }

    if (!localSelectedGuests.rooms || localSelectedGuests.rooms < 1) {
      setConfirmBookingError("Please select at least 1 room");
      setBookingSubmitting(false);
      return;
    }

    // Validate personal details
    if (!personalDetailsSubmittedSuccess) {
      setConfirmBookingError("Please submit personal details first");
      setBookingSubmitting(false);
      return;
    }

    // Validate payment details
    if (!cardSubmittedSuccess) {
      setConfirmBookingError("Please submit payment details first");
      setBookingSubmitting(false);
      return;
    }

    // Simulate booking API call
    setTimeout(async () => {
      // Generate a confirmation code
      const confirmationCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      setLastConfirmationCode(confirmationCode);

      try {
        const emailBookingDetails = {
          propertyName:
            property?.name ||
            property?.title ||
            property?.propertyName ||
            "Unknown Property",
          checkIn:
            localSelectedDates.checkIn?.toLocaleDateString() || "Not selected",
          checkOut:
            localSelectedDates.checkOut?.toLocaleDateString() || "Not selected",
          guestName: `${firstName} ${surname}`,
          totalPrice: total,
        };

        // Send confirmation email
        await sendConfirmationEmail(
          confirmationCode,
          email,
          emailBookingDetails,
        );

        // Create the booking object
        const newBooking = {
          id: `booking_${Date.now()}`,
          propertyName:
            property?.name ||
            property?.title ||
            property?.propertyName ||
            "Unknown Property",
          dates:
            bookingAltDateRange ||
            (localSelectedDates.checkIn && localSelectedDates.checkOut
              ? `${localSelectedDates.checkIn.toLocaleDateString()} - ${localSelectedDates.checkOut.toLocaleDateString()}`
              : "Date not selected"),
          price: total,
          status: "Active",
          location:
            property?.location || property?.address || "Unknown Location",
          details: {
            confirmationNumber: confirmationCode,
            pin: confirmationCode, // Use same code as PIN for simplicity
            checkIn:
              localSelectedDates.checkIn?.toLocaleDateString() ||
              "Not selected",
            checkOut:
              localSelectedDates.checkOut?.toLocaleDateString() ||
              "Not selected",
            address:
              property?.address ||
              property?.location ||
              "Address not available",
            roomType: `${localSelectedGuests.rooms} room(s), ${localSelectedGuests.adults} adult(s), ${localSelectedGuests.children} children`,
            includedExtras: "Standard amenities",
            breakfastIncluded: false,
            nonRefundable: true,
            totalPrice: total,
            shareOptions: ["Email", "SMS", "Copy link"],
            contactNumber: "+1 (555) 123-4567",
            image:
              property?.image ||
              property?.imageSource ||
              (property?.images && property.images[0]) ||
              null,
          },
        };

        // Add the booking to context
        addBooking(newBooking);

        // Add notification for successful booking
        addNotification({
          type: "booking_success",
          title: "Booking Confirmed! 🎉",
          message: `Your booking at ${newBooking.propertyName} has been successfully confirmed. Your confirmation number is ${confirmationCode}.`,
          bookingId: newBooking.id,
          iconName: "checkmark-circle",
        });

        // Add message from property owner
        addMessage({
          type: "property_owner",
          senderName: "Property Owner",
          senderRole: "Property Owner",
          propertyName: newBooking.propertyName,
          subject: `Welcome to ${newBooking.propertyName}!`,
          message: `Hi ${firstName}! Thank you for choosing ${
            newBooking.propertyName
          }. We're excited to host you from ${localSelectedDates.checkIn?.toLocaleDateString()} to ${localSelectedDates.checkOut?.toLocaleDateString()}. We've received your booking and everything is confirmed. We expect your arrival and will have everything ready for you. If you have any questions or special requests, please don't hesitate to reach out. Safe travels! 🏨✨`,
          bookingId: newBooking.id,
          propertyId: property?.id || "unknown",
          avatar: "👨‍💼", // Using emoji as placeholder avatar
        });

        setBookingSubmitting(false);
        setShowPaymentConfirmationModal(true);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        setBookingSubmitting(false);
        setConfirmBookingError(
          "Failed to send confirmation email. Please try again.",
        );
        Alert.alert(
          "Email Sending Failed",
          "We couldn't send your confirmation email. Your booking was still created successfully. Please contact support for your confirmation code.",
          [
            {
              text: "Try Again",
              onPress: handleConfirmBooking,
            },
            {
              text: "Continue",
              style: "default",
              onPress: () => {
                // Show modal anyway since booking was created
                setConfirmBookingError("");
                setShowPaymentConfirmationModal(true);
              },
            },
          ],
        );
      }
    }, 2000);
  };

  const navigateToDateSelection = () => {
    // Open date selection modal
    setShowDatesModal(true);
  };

  const navigateToGuestSelection = () => {
    // Open guest selection modal
    setShowGuestsModal(true);
  };

  // Handlers for modal updates
  const handleDatesModalClose = () => {
    setShowDatesModal(false);
  };

  const handleGuestsModalClose = () => {
    setShowGuestsModal(false);
  };

  const handleDatesUpdate = (newDates: {
    checkIn: Date | null;
    checkOut: Date | null;
  }) => {
    setLocalSelectedDates(newDates);
    setShowDatesModal(false);
  };

  const handleGuestsUpdate = (newGuests: any) => {
    setLocalSelectedGuests(newGuests);
    setShowGuestsModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={["left", "right", "top"]}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.separator,
            backgroundColor: colors.background,
            minHeight: 44,
            zIndex: 99999,
            elevation: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
              color: colors.text,
            }}
          >
            Booking Confirmation
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            // Use less padding when keyboard is open to avoid excessive space
            paddingBottom: keyboardOpen
              ? Math.max(keyboardHeight - 120, 24)
              : 180,
          }}
        >
          <PropertySummarySection property={property} />

          <BookingDetailsSection
            selectedDates={localSelectedDates}
            selectedGuests={localSelectedGuests}
            bookingAltDateRange={bookingAltDateRange}
            onDatePress={navigateToDateSelection}
            onGuestPress={navigateToGuestSelection}
          />

          <PersonalDetailsSection
            firstName={firstName}
            surname={surname}
            email={email}
            phone={phone}
            country={country}
            personalDetailsSubmitting={personalDetailsSubmitting}
            personalDetailsSubmittedSuccess={personalDetailsSubmittedSuccess}
            personalDetailsErrors={personalDetailsErrors}
            keyboardOpen={keyboardOpen}
            keyboardHeight={keyboardHeight}
            showPersonalDetails={showPersonalDetails}
            onFirstNameChange={setFirstName}
            onSurnameChange={setSurname}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
            onCountryChange={setCountry}
            onSubmitPersonalDetails={handleSubmitPersonalDetails}
            onTogglePersonalDetails={() =>
              setShowPersonalDetails(!showPersonalDetails)
            }
          />

          <PriceSummarySection
            pricePerNight={pricePerNight}
            nights={nights}
            selectedGuests={localSelectedGuests}
            subtotal={subtotal}
            taxes={taxes}
            total={total}
            cardSubmittedSuccess={cardSubmittedSuccess}
            showPaymentDetails={showPaymentDetails}
            onTogglePaymentDetails={() =>
              setShowPaymentDetails(!showPaymentDetails)
            }
          />

          <PaymentDetailsModal
            visible={showPaymentDetails}
            cardNumber={cardNumber}
            cardName={cardName}
            cardExpiry={cardExpiry}
            cardCvv={cardCvv}
            cardSubmitting={cardSubmitting}
            cardSubmittedSuccess={cardSubmittedSuccess}
            cardErrors={cardErrors}
            keyboardOpen={keyboardOpen}
            keyboardHeight={keyboardHeight}
            onCardNumberChange={setCardNumber}
            onCardNameChange={setCardName}
            onCardExpiryChange={setCardExpiry}
            onCardCvvChange={setCardCvv}
            onSubmitCard={handleSubmitCard}
          />
        </ScrollView>

        <DatesModal
          isVisible={showDatesModal}
          onClose={handleDatesModalClose}
          colors={colors}
          selectedDates={localSelectedDates}
          setSelectedDates={handleDatesUpdate}
        />

        <GuestsModal
          isVisible={showGuestsModal}
          onClose={handleGuestsModalClose}
          colors={colors}
          selectedGuests={localSelectedGuests}
          setSelectedGuests={handleGuestsUpdate}
        />

        <BookingConfirmationModal
          visible={showPaymentConfirmationModal}
          lastConfirmationCode={lastConfirmationCode}
          userEmail={email}
          onClose={() => setShowPaymentConfirmationModal(false)}
          onNavigateToBookings={() => {
            navigation.navigate("MainTabs", {
              screen: "Bookings",
              params: { initialTab: "Active" },
            } as any);
          }}
        />
      </SafeAreaView>

      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            paddingTop: 10,
            paddingBottom: 0,
            paddingHorizontal: 20,
            borderTopWidth: 1,
            borderTopColor: colors.separator,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            marginBottom: 0,
          }}
        >
          <ConfirmationActionSection
            bookingSubmitting={bookingSubmitting}
            confirmBookingError={confirmBookingError}
            onConfirmBooking={handleConfirmBooking}
          />
        </View>
      </View>
    </View>
  );
};

export default PropertyConfirmationScreen;
