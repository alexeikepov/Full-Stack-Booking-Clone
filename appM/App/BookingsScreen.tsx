import { JSX, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HelpSupport from "../components/account/HelpSupportSection";
import BookingCard from "../components/bookings/BookingCard";
import { Colors } from "../constants/Colors";
import PropertyDetailsPage from "./PropertyDetailsPage";
import SearchScreen from "./SearchScreen";

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
  const [activeTab, setActiveTab] = useState<"Active" | "Past" | "Canceled">(
    "Past",
  );
  const [currentPage, setCurrentPage] = useState<
    "Bookings" | "HelpSupport" | "Search" | "PropertyDetails"
  >("Bookings");
  const [showBookingDetailsModal, setShowBookingDetailsModal] =
    useState<boolean>(false);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
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
              source={require("../assets/images/globe.png")}
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
                onPress={() => setCurrentPage("PropertyDetails")}
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
              source={require("../assets/images/map.png")}
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
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeaderContainer}>
          <TouchableOpacity onPress={() => setShowBookingDetailsModal(false)}>
            <Ionicons name="close" size={24} color={Colors.dark.text} />
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
            placeholderTextColor={Colors.dark.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="PIN Code*"
            placeholderTextColor={Colors.dark.icon}
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

  // Page routing
  if (currentPage === "HelpSupport") {
    return <HelpSupport onBack={() => setCurrentPage("Bookings")} />;
  }

  if (currentPage === "Search") {
    return <SearchScreen onBack={() => setCurrentPage("Bookings")} />;
  }

  if (currentPage === "PropertyDetails") {
    return (
      <PropertyDetailsPage
        propertyData={pastBookings[0]}
        onBack={() => setCurrentPage("Bookings")}
        onRebook={() => setCurrentPage("Search")}
      />
    );
  }

  return (
    <View style={styles.container}>
      {renderBookingDetailsModal()}
      {renderRemoveModal()}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trips</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => setCurrentPage("HelpSupport")}>
            <Ionicons
              name="help-circle-outline"
              size={22}
              color={Colors.dark.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowBookingDetailsModal(true)}>
            <Ionicons
              name="cloud-download-outline"
              size={22}
              color={Colors.dark.icon}
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
                    ? Colors.dark.text
                    : Colors.dark.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? Colors.dark.background : Colors.dark.text,
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { color: Colors.dark.text, fontSize: 20, fontWeight: "bold" },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 72,
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
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    flexShrink: 1,
  },
  emptySubtitle: {
    color: Colors.dark.text,
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
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  removeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 16,
  },
  modalButton: {
    width: "100%",
    backgroundColor: Colors.dark.card,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalCancelButton: {
    width: "100%",
    backgroundColor: Colors.dark.card,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  modalCancelText: { color: "#FF3B30", fontSize: 16, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
  },
  modalHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  modalHeaderText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalBody: { marginTop: 24, paddingHorizontal: 8 },
  modalInfoText: {
    color: Colors.dark.text,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    flexShrink: 1,
  },
  input: {
    width: "100%",
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
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
