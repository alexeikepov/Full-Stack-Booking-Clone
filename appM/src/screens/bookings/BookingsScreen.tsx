import { RouteProp } from "@react-navigation/native";
import { JSX, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HelpSupport from "../../components/account/HelpSupportSection";
import {
  BookingDetailsModal,
  CancelConfirmModal,
  CancelSuccessModal,
  HelpCenterModal,
  PropertyDetailsModal,
  RemoveBookingModal,
} from "../../components/bookings";
import BookingCard from "../../components/bookings/BookingCard";
import { useBookings } from "../../hooks/BookingsContext";
import { useTheme } from "../../hooks/ThemeContext";
import type { RootStackParamList } from "../../types/navigation";
import PropertyDetailsScreen from "../propertyDetails/PropertyDetailsScreen";
import { SearchScreen } from "../search/index";
import { createStyles } from "./BookingsScreen.styles";
const globeLightImage = require("../../assets/images/globe-light.jpg");
const globeImage = require("../../assets/images/globe.png");
const pastTripLightImage = require("../../assets/images/past-trip-light.jpg");
const pastTripImage = require("../../assets/images/past-trip.jpg");
const mapLightImage = require("../../assets/images/map-light.jpg");
const mapImage = require("../../assets/images/map.png");
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
      <BookingDetailsModal
        visible={showBookingDetailsModal}
        onClose={() => setShowBookingDetailsModal(false)}
        confirmationInput={confirmationInput}
        setConfirmationInput={setConfirmationInput}
        onManageBooking={handleManageBooking}
        colors={colors}
      />
      <RemoveBookingModal
        visible={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onRemove={handleRemoveBooking}
        colors={colors}
      />
      <PropertyDetailsModal
        visible={showPropertyModal}
        onClose={() => setShowPropertyModal(false)}
        onCancel={() => {
          setShowPropertyModal(false);
          setShowCancelConfirmModal(true);
        }}
        booking={bookings.find((b) => b.id === selectedBookingId) || null}
        activeTab={activeTab}
        colors={colors}
      />
      <CancelConfirmModal
        visible={showCancelConfirmModal}
        onClose={() => setShowCancelConfirmModal(false)}
        onConfirm={handleConfirmCancel}
        onKeep={() => {
          setShowCancelConfirmModal(false);
          if (selectedBookingId) {
            setShowPropertyModal(true);
          }
        }}
        colors={colors}
      />
      <CancelSuccessModal
        visible={showCancelSuccessModal}
        onClose={() => setShowCancelSuccessModal(false)}
        colors={colors}
      />
      <HelpCenterModal
        visible={showHelpCenterModal}
        onClose={() => setShowHelpCenterModal(false)}
        helpFaqTab={helpFaqTab}
        setHelpFaqTab={setHelpFaqTab}
        openQuestionIndex={openQuestionIndex}
        setOpenQuestionIndex={setOpenQuestionIndex}
        colors={colors}
      />
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
