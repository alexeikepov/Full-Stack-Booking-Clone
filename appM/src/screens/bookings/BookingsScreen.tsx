import { RouteProp } from "@react-navigation/native";
import { JSX, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import HelpSupport from "../../components/account/HelpSupportSection";
import BookingCard from "../../components/bookings/BookingCard";
import { useBookings } from "../../hooks/BookingsContext";
import { useTheme } from "../../hooks/ThemeContext";
import type { RootStackParamList } from "../../types/navigation";
import PropertyDetailsScreen from "../property/PropertyDetailsScreen";
import SearchScreen from "../search/SearchScreen";

const globeLightImage = require("../../assets/images/globe-light.jpg");
const globeImage = require("../../assets/images/globe.png");
const pastTripLightImage = require("../../assets/images/past-trip-light.jpg");
const pastTripImage = require("../../assets/images/past-trip.jpg");
const mapLightImage = require("../../assets/images/map-light.jpg");
const mapImage = require("../../assets/images/map.png");
export function createStyles(colors: Record<string, string>, theme: string) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      position: "relative",
      backgroundColor: theme === "light" ? colors.blue : colors.background,
      marginBottom: 12,
    },
    headerTitle: {
      color: theme === "light" ? colors.background : colors.text,
      fontSize: 20,
      fontWeight: "bold",
      flex: 1,
      textAlign: "center",
    },
    iconRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: 72,
      position: "absolute",
      right: 16,
    },
    tabsContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    tab: {
      flex: 1,
      marginHorizontal: 4,
      paddingVertical: 8,
      borderRadius: 16,
      alignItems: "center",
    },
    tabText: { fontWeight: "bold" },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
      marginTop: -80,
    },
    illustration: { width: 280, height: 280, marginBottom: 32 },
    emptyTitle: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 8,
      flexShrink: 1,
    },
    emptySubtitle: {
      color: colors.text,
      fontSize: 16,
      textAlign: "center",
      flexShrink: 1,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      width: "100%",
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      alignItems: "center",
    },
    removeTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    modalButton: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      alignItems: "center",
    },
    modalButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
    },
    modalCancelButton: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 15,
      alignItems: "center",
    },
    modalCancelText: { color: "#FF3B30", fontSize: 16, fontWeight: "bold" },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
    },
    modalHeaderContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingTop: 60,
    },
    modalHeaderText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
    },
    modalBody: { marginTop: 24, paddingHorizontal: 8 },
    modalInfoText: {
      color: colors.text,
      fontSize: 14,
      textAlign: "center",
      marginBottom: 20,
      flexShrink: 1,
    },
    // Property modal / details styles
    propertyHeader: {
      width: "100%",
      height: 200,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      overflow: "hidden",
      justifyContent: "flex-end",
      padding: 12,
      backgroundColor: colors.card,
    },
    propertyImage: {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
    },
    propertyImagePlaceholder: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.card,
    },
    propertyHeaderText: { flexDirection: "column", zIndex: 2 },
    propertyTitle: { color: colors.text, fontSize: 20, fontWeight: "bold" },
    propertySubtitle: {
      color: colors.textSecondary || colors.icon,
      fontSize: 14,
      marginTop: 4,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    infoLabel: { fontSize: 14 },
    infoValue: { fontSize: 14, fontWeight: "600" },
    badge: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      alignSelf: "flex-start",
      marginTop: 8,
    },
    fullWidthButton: {
      width: "100%",
      backgroundColor: colors.primary || "#007AFF",
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    fullWidthButtonText: { color: "#FFF", fontWeight: "700" },
    ghostButton: {
      width: "100%",
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.border || "#E5E5E5",
    },
    ghostButtonText: { color: colors.text, fontWeight: "600" },
    input: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      marginBottom: 10,
    },
    manageButton: {
      backgroundColor: "#007AFF",
      paddingVertical: 14,
      borderRadius: 8,
      width: "100%",
      alignItems: "center",
      marginTop: 10,
    },
    manageButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
    // Help Center Modal styles
    helpModalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    helpModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 16,
      paddingTop: 60,
      backgroundColor: colors.card,
    },
    helpModalHeaderText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      flex: 1,
      textAlign: "center",
    },
    helpCloseButton: {
      paddingRight: 10,
    },
    helpInfoContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      marginHorizontal: 16,
      marginTop: 20,
      padding: 16,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    helpInfoText: {
      fontSize: 14,
      color: colors.textSecondary || colors.icon,
      flex: 1,
      lineHeight: 20,
    },
    helpSectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    helpBlueButton: {
      backgroundColor: "#007AFF",
      borderRadius: 8,
      paddingVertical: 16,
      alignItems: "center",
      marginHorizontal: 16,
      marginTop: 20,
    },
    helpBlueButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    helpFaqTabs: {
      flexDirection: "row",
      paddingHorizontal: 16,
      marginTop: 20,
    },
    helpFaqTab: {
      alignItems: "center",
      paddingHorizontal: 10,
      paddingBottom: 5,
    },
    helpFaqTabText: {
      color: colors.textSecondary || colors.icon,
      fontSize: 14,
    },
    helpFaqItem: {
      flexDirection: "column",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator || colors.border || "#E5E5E5",
    },
    helpFaqItemText: {
      fontSize: 16,
      color: colors.text,
    },
    helpFaqAnswer: {
      fontSize: 14,
      color: colors.textSecondary || colors.icon,
      marginTop: 8,
    },
  });
}
export default function BookingsScreen({
  route,
}: {
  route?: RouteProp<RootStackParamList, "MainTabs"> | any;
}): JSX.Element {
  const { colors, theme } = useTheme();
  const { bookings, removeBooking, getActiveBookings, updateBooking } =
    useBookings();
  const styles = createStyles(colors, theme);
  const initialTabParam = route?.params?.initialTab as
    | "Active"
    | "Past"
    | "Canceled"
    | undefined;
  const [activeTab, setActiveTab] = useState<"Active" | "Past" | "Canceled">(
    initialTabParam ?? "Past",
  );
  const [currentPage, setCurrentPage] = useState<
    "Bookings" | "HelpSupport" | "Search" | "PropertyDetails"
  >("Bookings");
  const [showHelpCenterModal, setShowHelpCenterModal] =
    useState<boolean>(false);
  const [showBookingDetailsModal, setShowBookingDetailsModal] =
    useState<boolean>(false);
  const [confirmationInput, setConfirmationInput] = useState<string>("");
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [showPropertyModal, setShowPropertyModal] = useState<boolean>(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] =
    useState<boolean>(false);
  const [showCancelSuccessModal, setShowCancelSuccessModal] =
    useState<boolean>(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [helpFaqTab, setHelpFaqTab] = useState<string>("Stays");
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(
    null,
  );

  const tabs = ["Active", "Past", "Canceled"] as const;

  const faqData: { [key: string]: { question: string; answer: string }[] } = {
    Stays: [
      {
        question: "Cancellations",
        answer: "You can cancel anytime before check-in.",
      },
      { question: "Payment", answer: "Payments are secured and encrypted." },
      {
        question: "Booking Details",
        answer: "You can view your bookings in the app.",
      },
      {
        question: "Communications",
        answer: "Communicate with hosts through the app.",
      },
      { question: "Room Types", answer: "Different room types available." },
      {
        question: "Pricing",
        answer: "Prices depend on season and availability.",
      },
    ],
    Flights: [
      {
        question: "Baggage and seats",
        answer: "Check baggage policies before travel.",
      },
      {
        question: "Boarding pass and check-in",
        answer: "You can check in online.",
      },
      {
        question: "Booking a flight",
        answer: "Flights can be booked on the website.",
      },
      {
        question: "Changes and cancellation",
        answer: "Changes depend on airline policy.",
      },
      {
        question: "Flight confirmation",
        answer: "Confirmation sent to your email.",
      },
      {
        question: "My flight booking",
        answer: "Manage your bookings in the app.",
      },
    ],
    "Car rentals": [
      {
        question: "Most popular",
        answer: "Check our most popular car rentals.",
      },
      {
        question: "Driver requirements and responsibilities",
        answer: "Drivers must meet age requirements.",
      },
      {
        question: "Fuel, mileage, and travel plans",
        answer: "Fuel policies vary by rental company.",
      },
      {
        question: "Insurance and protection",
        answer: "Insurance options are available.",
      },
      { question: "Extras", answer: "Additional options can be selected." },
      {
        question: "Payment, fees, and confirmation",
        answer: "Payments are processed securely.",
      },
    ],
    Attractions: [
      {
        question: "Cancellations",
        answer: "Cancellations allowed as per policy.",
      },
      { question: "Payment", answer: "Payment is required at booking." },
      {
        question: "Modifications and changes",
        answer: "Changes may be allowed with fees.",
      },
      {
        question: "Booking details and information",
        answer: "Booking info is in your account.",
      },
      {
        question: "Pricing",
        answer: "Pricing depends on attraction and date.",
      },
      {
        question: "Tickets and check-in",
        answer: "Tickets are digital in most cases.",
      },
    ],
    "Airport taxis": [
      {
        question: "Manage booking",
        answer: "Bookings can be managed in your profile.",
      },
      { question: "Journey", answer: "Track your taxi journey in the app." },
      { question: "Payment info", answer: "Payment info is secured." },
      {
        question: "Accessibility and extras",
        answer: "Accessible options available.",
      },
      { question: "Pricing", answer: "Prices depend on distance and type." },
    ],
    Insurance: [
      {
        question:
          "Room Cancellation Insurance - Claims (excludes U.S. residents)",
        answer: "Claims are processed according to policy.",
      },
      {
        question:
          "Room Cancellation Insurance - Coverage (excludes U.S. residents)",
        answer: "Coverage details are listed in the policy.",
      },
      {
        question:
          "Room Cancellation Insurance - Policy terms (excludes U.S. residents)",
        answer: "Terms must be read carefully.",
      },
      {
        question:
          "Room Cancellation Insurance - General (excludes U.S. residents)",
        answer: "General info available in policy documents.",
      },
    ],
    Other: [
      {
        question: "How can I contact Booking.com?",
        answer: "You can contact through the Help Center.",
      },
      {
        question:
          "Can I get support in my language for accommodation bookings in the EEA?",
        answer: "Yes, multiple languages are supported.",
      },
      {
        question:
          "Can I get customer support in my language for flight bookings in the European Economic Area?",
        answer: "Yes, support is available in several languages.",
      },
      {
        question:
          "Can I get customer support in my language for car rental bookings in the European Economic Area?",
        answer: "Yes, support is available in your language.",
      },
    ],
  };
  const handleRemoveBooking = () => {
    if (!selectedBookingId) return;
    const booking = bookings.find((b) => b.id === selectedBookingId);
    if (!booking) {
      setShowRemoveModal(false);
      setSelectedBookingId(null);
      return;
    }
    // If booking is already canceled, remove it permanently. Otherwise mark as Canceled.
    if (booking.status === "Canceled") {
      removeBooking(selectedBookingId);
    } else {
      updateBooking(selectedBookingId, { status: "Canceled" });
      // switch to canceled tab so user sees the moved booking immediately
      setActiveTab("Canceled");
    }
    setShowRemoveModal(false);
    setSelectedBookingId(null);
  };
  const handleManageBooking = () => {
    // Find booking by confirmation number entered in the modal input
    const found = bookings.find(
      (b) => b.details?.confirmationNumber === confirmationInput.trim(),
    );
    if (!found) {
      Alert.alert("Invalid number", "The number isn't valid.");
      return;
    }
    // Open property modal showing booking details and actions
    setSelectedBookingId(found.id);
    setShowBookingDetailsModal(false);
    setShowPropertyModal(true);
  };
  const renderContent = () => {
    switch (activeTab) {
      case "Active":
        const activeBookings = getActiveBookings();
        if (activeBookings.length === 0) {
          return (
            <View style={styles.emptyContainer}>
              <Image
                source={theme === "light" ? globeLightImage : globeImage}
                style={styles.illustration}
              />
              <Text style={styles.emptyTitle}>Where to next?</Text>
              <Text style={styles.emptySubtitle}>
                You have not started any trips yet. Once you make a booking, it
                will appear here.
              </Text>
            </View>
          );
        }
        return (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
          >
            {activeBookings.map((item) => (
              <BookingCard
                key={item.id}
                // Pass the full booking object so Rebook can navigate to the
                // correct PropertyDetailsScreen with all booking details
                propertyData={item}
                onPress={() => {
                  setSelectedBookingId(item.id);
                  setShowBookingDetailsModal(true);
                }}
                onDotsPress={() => {
                  setSelectedBookingId(item.id);
                  setShowRemoveModal(true);
                }}
                onRebook={() => {
                  // Handle rebook functionality here
                }}
              />
            ))}
          </ScrollView>
        );
      case "Past":
        return (
          <View style={styles.emptyContainer}>
            <Image
              source={theme === "light" ? pastTripLightImage : pastTripImage}
              style={styles.illustration}
            />
            <Text style={styles.emptyTitle}>Revisit past trips</Text>
            <Text style={styles.emptySubtitle}>
              Here you can refer to all past trips and get inspiration for your
              next ones.
            </Text>
          </View>
        );
      case "Canceled":
        const canceledBookings = bookings.filter(
          (booking) => booking.status === "Canceled",
        );
        if (canceledBookings.length === 0) {
          return (
            <View style={styles.emptyContainer}>
              <Image
                source={theme === "light" ? mapLightImage : mapImage}
                style={styles.illustration}
              />
              <Text style={styles.emptyTitle}>Sometimes plans change</Text>
              <Text style={styles.emptySubtitle}>
                Here you can refer to all the trips you have canceled, maybe
                next time!
              </Text>
            </View>
          );
        }
        return (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
          >
            {canceledBookings.map((item) => (
              <BookingCard
                key={item.id}
                propertyData={item}
                onPress={() => {
                  setSelectedBookingId(item.id);
                  setShowBookingDetailsModal(true);
                }}
                onDotsPress={() => {
                  setSelectedBookingId(item.id);
                  setShowRemoveModal(true);
                }}
                onRebook={() => {
                  Alert.alert("Rebook", "Rebook functionality coming soon!");
                }}
              />
            ))}
          </ScrollView>
        );
      default:
        return null;
    }
  };
  const renderBookingDetailsModal = () => (
    <Modal
      visible={showBookingDetailsModal}
      animationType="slide"
      onRequestClose={() => setShowBookingDetailsModal(false)}
      statusBarTranslucent={false}
    >
      <SafeAreaView style={styles.modalContainer} edges={["bottom"]}>
        <View style={styles.modalHeaderContainer}>
          <TouchableOpacity onPress={() => setShowBookingDetailsModal(false)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.modalHeaderText}>Enter booking details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.modalBody}>
          <Text style={styles.modalInfoText}>
            To manage an accommodation booking, enter the confirmation number.
            You received it when the booking was confirmed.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmation number*"
            placeholderTextColor={colors.icon}
            value={confirmationInput}
            onChangeText={setConfirmationInput}
          />

          <TouchableOpacity
            style={styles.manageButton}
            onPress={handleManageBooking}
          >
            <Text style={styles.manageButtonText}>Manage booking</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
  const renderRemoveModal = () => (
    <Modal
      visible={showRemoveModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowRemoveModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.removeTitle}>Remove trip</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleRemoveBooking}
          >
            <Text style={styles.modalButtonText}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={() => setShowRemoveModal(false)}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const handleConfirmCancel = () => {
    if (!selectedBookingId) return;
    // mark canceled
    updateBooking(selectedBookingId, { status: "Canceled" });
    // close confirm modal and show success feedback
    setShowCancelConfirmModal(false);
    setShowCancelSuccessModal(true);
    // after short delay, hide success modal and go to Canceled tab
    setTimeout(() => {
      setShowCancelSuccessModal(false);
      setActiveTab("Canceled");
      setShowPropertyModal(false);
      setSelectedBookingId(null);
    }, 900);
  };

  const renderCancelConfirmModal = () => (
    <Modal
      visible={showCancelConfirmModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCancelConfirmModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.removeTitle}>Cancel booking</Text>
          <Text style={styles.modalInfoText}>
            Are you sure you want to cancel this booking? This action can be
            undone only by rebooking.
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleConfirmCancel}
          >
            <Text style={styles.modalButtonText}>Yes, cancel booking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={() => {
              // User changed their mind — reopen property/manage modal
              setShowCancelConfirmModal(false);
              if (selectedBookingId) {
                setShowPropertyModal(true);
              }
            }}
          >
            <Text style={styles.modalCancelText}>No, keep booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderCancelSuccessModal = () => (
    <Modal
      visible={showCancelSuccessModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowCancelSuccessModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { alignItems: "center" }]}>
          <Text style={styles.removeTitle}>Booking canceled</Text>
          <Text style={styles.modalInfoText}>
            Your booking was canceled successfully.
          </Text>
        </View>
      </View>
    </Modal>
  );
  const renderPropertyModal = () => {
    if (!selectedBookingId) return null;
    const booking = bookings.find((b) => b.id === selectedBookingId);
    if (!booking) return null;
    const { propertyName, dates, price, status, details } = booking;
    const isCanceledContext = activeTab === "Canceled" || status === "Canceled";
    return (
      <Modal
        visible={showPropertyModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowPropertyModal(false)}
        presentationStyle="fullScreen"
        statusBarTranslucent={false}
      >
        <SafeAreaView
          style={[styles.modalContainer, { paddingTop: 0 }]}
          edges={["top", "bottom"]}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* Header with optional image and title */}
            <View
              style={[styles.propertyHeader, { backgroundColor: colors.card }]}
            >
              {(details as any).image ? (
                // if booking has an image URL/path
                <Image
                  source={(details as any).image}
                  style={styles.propertyImage}
                />
              ) : (
                <View style={styles.propertyImagePlaceholder} />
              )}
              <View style={styles.propertyHeaderText}>
                <Text style={styles.propertyTitle}>{propertyName}</Text>
                <Text
                  style={[
                    styles.propertySubtitle,
                    { color: colors.textSecondary || colors.icon },
                  ]}
                >
                  {dates} · {price}
                </Text>
              </View>
            </View>

            <View style={{ padding: 16 }}>
              <View style={[styles.infoRow, { marginBottom: 8 }]}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: colors.textSecondary || colors.icon },
                  ]}
                >
                  Status
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {status}
                </Text>
              </View>
              <View style={[styles.infoRow, { marginBottom: 8 }]}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: colors.textSecondary || colors.icon },
                  ]}
                >
                  Check-in
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {details.checkIn}
                </Text>
              </View>
              <View style={[styles.infoRow, { marginBottom: 8 }]}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: colors.textSecondary || colors.icon },
                  ]}
                >
                  Check-out
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {details.checkOut}
                </Text>
              </View>
              <View style={[styles.infoRow, { marginBottom: 8 }]}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: colors.textSecondary || colors.icon },
                  ]}
                >
                  Room type
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {details.roomType}
                </Text>
              </View>
              <View style={[styles.infoRow, { marginBottom: 8 }]}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: colors.textSecondary || colors.icon },
                  ]}
                >
                  Extras
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {details.includedExtras || "—"}
                </Text>
              </View>
              {details.breakfastIncluded && (
                <View style={[styles.badge, { backgroundColor: "#E6F7FF" }]}>
                  <Text style={{ color: "#007AFF" }}>Breakfast included</Text>
                </View>
              )}
              {details.nonRefundable && (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: "#FEEFEF", marginTop: 8 },
                  ]}
                >
                  <Text style={{ color: "#FF3B30" }}>Non-refundable</Text>
                </View>
              )}
              <View style={[styles.infoRow, { marginTop: 12 }]}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: colors.textSecondary || colors.icon },
                  ]}
                >
                  Total
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {details.totalPrice}
                </Text>
              </View>

              <View style={{ marginTop: 20 }}>
                <TouchableOpacity
                  disabled={isCanceledContext}
                  style={[
                    styles.fullWidthButton,
                    isCanceledContext
                      ? { backgroundColor: "#CCCCCC", opacity: 0.7 }
                      : { backgroundColor: "#FF3B30" },
                  ]}
                  onPress={() => {
                    if (isCanceledContext) return;
                    // Close property modal and open confirmation modal
                    // so the confirmation is visible immediately
                    setSelectedBookingId(booking.id);
                    setShowPropertyModal(false);
                    setShowBookingDetailsModal(false);
                    setShowCancelConfirmModal(true);
                  }}
                >
                  <Text style={[styles.fullWidthButtonText]}>
                    Cancel booking
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.fullWidthButton, { marginTop: 12 }]}
                  onPress={() => {
                    if (details.contactNumber) {
                      Linking.openURL(`tel:${details.contactNumber}`);
                    } else {
                      Alert.alert("No contact", "No contact number available.");
                    }
                  }}
                >
                  <Text style={[styles.fullWidthButtonText]}>
                    Contact property
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.ghostButton, { marginTop: 12 }]}
                  onPress={() => setShowPropertyModal(false)}
                >
                  <Text style={[styles.ghostButtonText]}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  useEffect(() => {
    // Keep selected booking details in sync when modal opens
    if (!showPropertyModal) return;
    if (selectedBookingId) {
      const b = bookings.find((x) => x.id === selectedBookingId);
      if (!b) {
        // If booking was removed, close modal
        setShowPropertyModal(false);
        setSelectedBookingId(null);
      }
    }
  }, [showPropertyModal, selectedBookingId, bookings]);

  const renderHelpCenterModal = () => (
    <Modal
      visible={showHelpCenterModal}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setShowHelpCenterModal(false)}
      statusBarTranslucent={false}
    >
      <SafeAreaView style={styles.helpModalContainer} edges={["bottom"]}>
        <View style={styles.helpModalHeader}>
          <Pressable
            onPress={() => setShowHelpCenterModal(false)}
            style={styles.helpCloseButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.helpModalHeaderText}>Help Center</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
        >
          <View style={{ paddingTop: 16 }}>
            <View style={styles.helpInfoContainer}>
              <Ionicons
                name="warning-outline"
                size={24}
                color="#FFD700"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.helpInfoText}>
                Protect your security by never sharing your personal or credit
                card information.{" "}
                <Text
                  style={{
                    color: "#007AFF",
                    textDecorationLine: "underline",
                  }}
                  onPress={() => Linking.openURL("https://www.booking.com")}
                >
                  Learn more
                </Text>
              </Text>
            </View>
            <View style={{ marginHorizontal: 16, marginTop: 20 }}>
              <Text style={styles.helpSectionTitle}>
                Welcome to the Help Center
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary || colors.icon,
                  marginTop: -10,
                  marginBottom: 10,
                }}
              >
                We are available 24 hours a day
              </Text>
              <Pressable
                style={styles.helpBlueButton}
                onPress={() =>
                  Linking.openURL(
                    "https://www.booking.com/customer-service.html",
                  )
                }
              >
                <Text style={styles.helpBlueButtonText}>
                  Get help with a booking
                </Text>
              </Pressable>
            </View>
            <Text style={[styles.helpSectionTitle, { marginTop: 0 }]}>
              Frequently asked questions
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 20,
                alignItems: "center",
              }}
              style={{ marginTop: 0 }}
            >
              {Object.keys(faqData).map((tab, index) => (
                <Pressable
                  key={tab}
                  onPress={() => setHelpFaqTab(tab)}
                  style={[
                    styles.helpFaqTab,
                    {
                      borderBottomWidth: helpFaqTab === tab ? 2 : 0,
                      borderBottomColor:
                        helpFaqTab === tab ? "#007AFF" : "transparent",
                      marginRight:
                        index < Object.keys(faqData).length - 1 ? 20 : 0,
                      paddingHorizontal: 12,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.helpFaqTabText,
                      {
                        color:
                          helpFaqTab === tab
                            ? colors.text
                            : colors.textSecondary || colors.icon,
                      },
                    ]}
                  >
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                marginHorizontal: 16,
                marginTop: 10,
              }}
            >
              {faqData[helpFaqTab]?.map((item, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.helpFaqItem,
                    {
                      borderBottomWidth:
                        index === faqData[helpFaqTab].length - 1 ? 0 : 1,
                    },
                  ]}
                  onPress={() => {
                    setOpenQuestionIndex(
                      openQuestionIndex === index ? null : index,
                    );
                  }}
                >
                  <Text style={styles.helpFaqItemText}>{item.question}</Text>
                  {openQuestionIndex === index && (
                    <Text style={styles.helpFaqAnswer}>{item.answer}</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // Page routing
  if (currentPage === "HelpSupport") {
    return <HelpSupport onBack={() => setCurrentPage("Bookings")} />;
  }
  if (currentPage === "Search") {
    return <SearchScreen onBack={() => setCurrentPage("Bookings")} />;
  }
  if (currentPage === "PropertyDetails") {
    const selectedBooking = bookings.find((b) => b.id === selectedBookingId);
    if (!selectedBooking) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: colors.text }}>No property data found.</Text>
        </View>
      );
    }
    return (
      <PropertyDetailsScreen
        // @ts-ignore
        propertyData={selectedBooking}
        onBack={() => setCurrentPage("Bookings")}
        onRebook={() => setCurrentPage("Search")}
      />
    );
  }
  return (
    <View style={styles.container}>
      {renderBookingDetailsModal()}
      {renderRemoveModal()}
      {renderPropertyModal()}
      {renderCancelConfirmModal()}
      {renderCancelSuccessModal()}
      {renderHelpCenterModal()}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trips</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => {
              setShowHelpCenterModal(true);
            }}
          >
            <Ionicons
              name="help-circle-outline"
              size={32}
              color={theme === "light" ? colors.background : "#FFFFFF"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowBookingDetailsModal(true)}>
            <Ionicons
              name="cloud-download-outline"
              size={32}
              color={theme === "light" ? colors.background : "#FFFFFF"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                {
                  backgroundColor: isActive
                    ? theme === "light"
                      ? colors.blue || "#007AFF"
                      : colors.text
                    : colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive
                      ? theme === "light"
                        ? colors.background
                        : colors.background
                      : colors.text,
                  },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {renderContent()}
    </View>
  );
}
