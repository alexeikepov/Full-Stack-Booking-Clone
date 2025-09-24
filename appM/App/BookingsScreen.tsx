import { JSX, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import HelpSupport from "../components/account/HelpSupportSection";
import BookingCard from "../components/bookings/BookingCard";
import { useTheme } from "../hooks/ThemeContext";
import PropertyDetailsScreen from "./PropertyDetailsScreen";
import SearchScreen from "./SearchScreen";
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
    },
    illustration: { width: 120, height: 120, marginBottom: 16 },
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
  });
}
interface Booking {
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
}
export default function BookingsScreen(): JSX.Element {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);
  const [activeTab, setActiveTab] = useState<"Active" | "Past" | "Canceled">(
    "Past",
  );
  const [currentPage, setCurrentPage] = useState<
    "Bookings" | "HelpSupport" | "Search" | "PropertyDetails"
  >("Bookings");
  const [openHelpModal, setOpenHelpModal] = useState<boolean>(false);
  const [showBookingDetailsModal, setShowBookingDetailsModal] =
    useState<boolean>(false);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [showPropertyModal, setShowPropertyModal] = useState<boolean>(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [pastBookings, setPastBookings] = useState<Booking[]>([
    {
      id: "1",
      propertyName: "property name",
      dates: "dates",
      price: "price",
      status: "Completed",
      location: "location",
      details: {
        confirmationNumber: "4623418041",
        pin: "7990",
        checkIn: "14:00 - 23:30",
        checkOut: "4:00 - 10:00",
        address: "address",
        roomType: "Single Room",
        includedExtras: "Round-trip airport shuttle",
        breakfastIncluded: true,
        nonRefundable: true,
        totalPrice: "total price",
        shareOptions: ["booking", "property", "app"],
        contactNumber: "contact number",
      },
    },
  ]);
  const tabs = ["Active", "Past", "Canceled"] as const;
  const handleRemoveBooking = () => {
    if (!selectedBookingId) return;
    setPastBookings((prev) => prev.filter((b) => b.id !== selectedBookingId));
    setShowRemoveModal(false);
    setSelectedBookingId(null);
  };
  const handleManageBooking = () => {
    Alert.alert("Invalid number", "The number isn't valid.");
  };
  const renderContent = () => {
    switch (activeTab) {
      case "Active":
        return (
          <View style={styles.emptyContainer}>
            <Image
              source={
                theme === "light"
                  ? require("../assets/images/globe-light.jpg")
                  : require("../assets/images/globe.png")
              }
              style={styles.illustration}
            />
            <Text style={styles.emptyTitle}>Where to next?</Text>
            <Text style={styles.emptySubtitle}>
              You have not started any trips yet. Once you make a booking, it
              will appear here.
            </Text>
          </View>
        );
      case "Past":
        return (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
          >
            {pastBookings.map((item) => (
              <BookingCard
                key={item.id}
                propertyData={item}
                onPress={() => {
                  setSelectedBookingId(item.id);
                  setShowPropertyModal(true); // open modal on property name press
                }}
                onDotsPress={() => {
                  setSelectedBookingId(item.id);
                  setShowRemoveModal(true);
                }}
                onRebook={() => setCurrentPage("Search")}
              />
            ))}
          </ScrollView>
        );
      case "Canceled":
        return (
          <View style={styles.emptyContainer}>
            <Image
              source={
                theme === "light"
                  ? require("../assets/images/map-light.jpg")
                  : require("../assets/images/map.png")
              }
              style={styles.illustration}
            />
            <Text style={styles.emptyTitle}>Sometimes plans change</Text>
            <Text style={styles.emptySubtitle}>
              Here you can refer to all the trips you have canceled, maybe next
              time!
            </Text>
          </View>
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
            To manage an accommodation booking, enter the confirmation number
            and PIN. You will find them at the top of your confirmation email.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmation number*"
            placeholderTextColor={colors.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="PIN Code*"
            placeholderTextColor={colors.icon}
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
          <Text style={styles.removeTitle}>Remove</Text>
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
  const renderPropertyModal = () => {
    if (!selectedBookingId) return null;
    const booking = pastBookings.find((b) => b.id === selectedBookingId);
    if (!booking) return null;
    const { propertyName, dates, price, status, details } = booking;
    return (
      <Modal
        visible={showPropertyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPropertyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.removeTitle}>{propertyName}</Text>
            <Text style={{ color: colors.text }}>{`Status: ${status}`}</Text>
            <Text style={{ color: colors.text }}>{`Dates: ${dates}`}</Text>
            <Text style={{ color: colors.text }}>{`Price: ${price}`}</Text>
            <Text
              style={{ color: colors.text }}
            >{`Check-in: ${details.checkIn}`}</Text>
            <Text
              style={{ color: colors.text }}
            >{`Check-out: ${details.checkOut}`}</Text>
            <Text
              style={{ color: colors.text }}
            >{`Room type: ${details.roomType}`}</Text>
            <Text
              style={{ color: colors.text }}
            >{`Extras: ${details.includedExtras}`}</Text>
            {details.breakfastIncluded && (
              <Text style={{ color: colors.text }}>Breakfast included</Text>
            )}
            {details.nonRefundable && (
              <Text style={{ color: "#FF3B30" }}>Non-refundable</Text>
            )}
            <Text
              style={{ color: colors.text }}
            >{`Total: ${details.totalPrice}`}</Text>
            <TouchableOpacity
              style={[styles.modalButton, { marginTop: 12 }]}
              onPress={() => setShowPropertyModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  // Page routing
  if (currentPage === "HelpSupport") {
    return <HelpSupport onBack={() => setCurrentPage("Bookings")} />;
  }
  if (currentPage === "Search") {
    return <SearchScreen onBack={() => setCurrentPage("Bookings")} />;
  }
  if (currentPage === "PropertyDetails") {
    const selectedBooking = pastBookings.find(
      (b) => b.id === selectedBookingId,
    );
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trips</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => {
              setOpenHelpModal(true);
              setCurrentPage("HelpSupport");
            }}
          >
            <Ionicons
              name="help-circle-outline"
              size={28}
              color={theme === "light" ? colors.background : colors.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowBookingDetailsModal(true)}>
            <Ionicons
              name="cloud-download-outline"
              size={26}
              color={theme === "light" ? colors.background : colors.icon}
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
