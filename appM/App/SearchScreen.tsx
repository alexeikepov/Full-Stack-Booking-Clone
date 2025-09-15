import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import HelpSupportSection, {
  HelpSupportSectionProps,
} from "../components/account/HelpSupportSection";
import ContinueSearchCard from "../components/search/ContinueSearchCard";
import SearchBar from "../components/search/SearchBar";
import TabSelector from "../components/search/TabSelector";
import { Colors } from "../constants/Colors";
import AppartmentList from "./ApartmentsList";

export default function App({ onBack }: HelpSupportSectionProps) {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [showApartmentsList, setShowApartmentsList] = useState(false);
  const insets = useSafeAreaInsets();

  const openMessages = () => setShowMessagesModal(true);
  const closeMessages = () => setShowMessagesModal(false);

  const openNotifications = () => setShowNotificationsModal(true);
  const closeNotifications = () => setShowNotificationsModal(false);

  const openHelpCenter = () => {
    setIsHelpCenterOpen(true);
    closeMessages();
  };

  const closeHelpCenter = () => {
    setIsHelpCenterOpen(false);
    openMessages();
  };

  const SearchScreen = ({
    showApartmentsList,
    setShowApartmentsList,
  }: {
    showApartmentsList: boolean;
    setShowApartmentsList: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const [showOfferModal, setShowOfferModal] = useState(false);
    const handleOfferPress = () => setShowOfferModal(true);
    const handleCloseOfferModal = () => setShowOfferModal(false);
    const [activeTab, setActiveTab] = useState("Stays");
    const navigation = useNavigation();
    const [returnToSameLocation, setReturnToSameLocation] = useState(false);
    const [directFlightsOnly, setDirectFlightsOnly] = useState(false);
    const [flightType, setFlightType] = useState("Round-trip");
    const [taxiType, setTaxiType] = useState("One-way");
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const tabIcons = {
      Stays: "bed-outline",
      "Car rental": "car-outline",
      Flights: "airplane-outline",
      Taxi: "car-outline",
      Attractions: "sparkles-outline",
    };

    const renderSearchForm = () => {
      const handleSearch = () => {
        setSearchModalVisible(true);
        setSearchError(false);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => setSearchError(true), 3000);
      };

      switch (activeTab) {
        case "Stays":
          return (
            <View style={styles.searchFormBorder}>
              <SearchBar placeholder="Enter destination" />
              <SearchBar placeholder="Any dates" />
              <SearchBar placeholder="1 room · 2 adults · No children" />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          );
        case "Flights":
          return (
            <View style={styles.searchFormBorder}>
              <View style={styles.radioGroup}>
                {["Round-trip", "One-way", "Multi-city"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.radioButton}
                    onPress={() => setFlightType(type)}
                  >
                    <Ionicons
                      name={
                        flightType === type
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={20}
                      color="#007AFF"
                    />
                    <Text style={styles.radioText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <SearchBar placeholder="ATH Athens" iconName="paper-plane" />
              <SearchBar
                placeholder="Where to?"
                iconName="paper-plane-outline"
              />
              <SearchBar
                placeholder="Sat, 11 Oct - Sat, 18 Oct"
                iconName="calendar"
              />
              <SearchBar placeholder="1 adult · Economy" iconName="person" />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleText}>Direct flights only</Text>
                <Switch
                  value={directFlightsOnly}
                  onValueChange={setDirectFlightsOnly}
                  trackColor={{ false: "#767577", true: "#007AFF" }}
                  thumbColor={directFlightsOnly ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>
          );
        case "Car rental":
          return (
            <View style={styles.searchFormBorder}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleText}>Return to same location</Text>
                <Switch
                  value={returnToSameLocation}
                  onValueChange={setReturnToSameLocation}
                  trackColor={{ false: "#767577", true: "#007AFF" }}
                  thumbColor={returnToSameLocation ? "#fff" : "#f4f3f4"}
                />
              </View>
              <SearchBar placeholder="Pickup location" iconName="car-outline" />
              <SearchBar
                placeholder="7 Sep at 10:00 - 9 Sep at 10:00"
                iconName="calendar-outline"
              />
              <SearchBar
                placeholder="Driver's age: 30-65"
                iconName="person-outline"
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          );
        case "Taxi":
          return (
            <View style={styles.searchFormBorder}>
              <View style={styles.radioGroup}>
                {["One-way", "Round-trip"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.radioButton}
                    onPress={() => setTaxiType(type)}
                  >
                    <Ionicons
                      name={
                        taxiType === type
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={20}
                      color="#007AFF"
                    />
                    <Text style={styles.radioText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <SearchBar
                placeholder="Enter pick-up location"
                iconName="location-outline"
              />
              <SearchBar
                placeholder="Enter destination"
                iconName="location-outline"
              />
              <SearchBar
                placeholder="Tell us when"
                iconName="calendar-outline"
              />
              <SearchBar placeholder="2 passengers" iconName="person-outline" />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.buttonText}>Check prices</Text>
              </TouchableOpacity>
            </View>
          );
        case "Attractions":
          return (
            <View style={styles.searchFormBorder}>
              <SearchBar placeholder="Where are you going?" iconName="search" />
              <SearchBar placeholder="Any dates" iconName="calendar-outline" />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          );
        default:
          return null;
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking.com</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={openMessages}>
              <Ionicons
                name="chatbubble-outline"
                size={22}
                color={Colors.dark.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={openNotifications}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={Colors.dark.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.searchModuleContainer}>
            <TabSelector
              tabs={["Stays", "Flights", "Car rental", "Taxi", "Attractions"]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              icons={tabIcons}
            />
            {renderSearchForm()}

            <Modal
              visible={searchModalVisible}
              animationType="fade"
              transparent
              presentationStyle="overFullScreen"
              onRequestClose={() => setSearchModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 32,
                    borderRadius: 16,
                    alignItems: "center",
                    minWidth: 220,
                  }}
                >
                  {!searchError ? (
                    <>
                      <Ionicons
                        name="search"
                        size={40}
                        color="#FFD600"
                        style={{ marginBottom: 16 }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "#222",
                        }}
                      >
                        Searching...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons
                        name="close-circle-outline"
                        size={40}
                        color="#FF5252"
                        style={{ marginBottom: 16 }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "#FF5252",
                        }}
                      >
                        Error: Not found
                      </Text>
                      <TouchableOpacity
                        style={{ marginTop: 16 }}
                        onPress={() => setSearchModalVisible(false)}
                      >
                        <Text style={{ color: "#007AFF", fontWeight: "bold" }}>
                          Close
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue your search</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setShowApartmentsList(true)}
                >
                  <ContinueSearchCard
                    title="Gusto Della Vita"
                    subtitle="Rome, 2 nights"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel more, spend less</Text>
            <View style={styles.largeCard}>
              <Image
                source={require("./../assets/images/place-holder.jpg")}
                style={styles.largeCardImage}
              />
              <View style={styles.largeCardTextContainer}>
                <Text style={styles.largeCardTitle}>
                  Go places you have been dreaming of for less
                </Text>
                <Text style={styles.largeCardSubtitle}>
                  Save money on your next trip by taking advantage of our
                  amazing deals.
                </Text>
                <TouchableOpacity
                  style={styles.largeCardButton}
                  onPress={() => (navigation as any).navigate("Account")}
                >
                  <Text style={styles.largeCardButtonText}>Find deals</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Offers</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.offerCard}
                  onPress={handleOfferPress}
                >
                  <Image
                    source={require("./../assets/images/place-holder.jpg")}
                    style={styles.offerImage}
                  />
                  <Text style={styles.offerText}>20% off hotel bookings</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Modal
              visible={showOfferModal}
              animationType="fade"
              transparent
              presentationStyle="overFullScreen"
              onRequestClose={handleCloseOfferModal}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 32,
                    borderRadius: 16,
                    alignItems: "center",
                    minWidth: 220,
                  }}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={40}
                    color="#FF5252"
                    style={{ marginBottom: 16 }}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#FF5252",
                      textAlign: "center",
                    }}
                  >
                    Sorry, offers not relevant to you
                  </Text>
                  <Text
                    style={{
                      color: "#222",
                      marginTop: 10,
                      textAlign: "center",
                    }}
                  >
                    You are only at level 1. Buy more to progress.
                  </Text>
                  <TouchableOpacity
                    style={{ marginTop: 16 }}
                    onPress={handleCloseOfferModal}
                  >
                    <Text style={{ color: "#007AFF", fontWeight: "bold" }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Explore</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} style={styles.exploreItem}>
                  <Ionicons
                    name="location-outline"
                    size={24}
                    color={Colors.dark.text}
                  />
                  <Text style={styles.exploreText}>Paris</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Booking.com</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.whyBookingCard}>
                <Text style={styles.whyBookingTitle}>
                  Trustworthy and secure
                </Text>
                <Text style={styles.whyBookingSubtitle}>
                  Millions of reviews from verified guests
                </Text>
              </View>
              <View style={styles.whyBookingCard}>
                <Text style={styles.whyBookingTitle}>Easy to use</Text>
                <Text style={styles.whyBookingSubtitle}>
                  Book your stay in just a few taps
                </Text>
              </View>
              <View style={styles.whyBookingCard}>
                <Text style={styles.whyBookingTitle}>
                  24/7 Customer Support
                </Text>
                <Text style={styles.whyBookingSubtitle}>
                  We are here to help, anytime you need
                </Text>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchScreen
        showApartmentsList={showApartmentsList}
        setShowApartmentsList={setShowApartmentsList}
      />

      {showApartmentsList && (
        <View style={styles.apartmentsListOverlayDebug}>
          <TouchableOpacity
            style={styles.closeOverlayButton}
            onPress={() => setShowApartmentsList(false)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          <AppartmentList />
        </View>
      )}

      <Modal
        visible={showMessagesModal}
        animationType="slide"
        transparent={false}
        onRequestClose={closeMessages}
      >
        <SafeAreaView
          style={[styles.modalContainer, { paddingTop: insets.top }]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={closeMessages}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={Colors.dark.text} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderText}>Messages</Text>
            <TouchableOpacity onPress={openHelpCenter}>
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={Colors.dark.text}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Image
              source={require("./../assets/images/messages-man.png")}
              style={styles.messageImage}
            />
            <Text style={styles.modalTitle}>No messages</Text>
            <Text style={styles.modalSubtitle}>
              You can start exchanging messages when you have upcoming bookings.
            </Text>
          </View>
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={closeMessages}
            >
              <Text style={styles.buttonText}>Book now</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        transparent={false}
        onRequestClose={closeNotifications}
      >
        <SafeAreaView
          style={[styles.modalContainer, { paddingTop: insets.top }]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={closeNotifications}
              style={styles.closeButton}
            >
              <Text style={styles.modalHeaderText}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Ionicons
              name="notifications-outline"
              size={80}
              color={Colors.dark.text}
            />
            <Text style={styles.modalTitle}>
              You do not have any notifications.
            </Text>
            <Text style={styles.modalSubtitle}>
              Notifications let you quickly take action on upcoming or current
              bookings.
            </Text>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={isHelpCenterOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={closeHelpCenter}
      >
        <SafeAreaView
          style={[styles.modalContainer, { paddingTop: insets.top }]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={onBack ? onBack : closeHelpCenter}
              style={styles.closeButton}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={Colors.dark.text}
              />
            </TouchableOpacity>
            <Text style={styles.modalHeaderText}>Help Center</Text>
          </View>
          <HelpSupportSection />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  searchFormBorder: {
    borderWidth: 2,
    borderColor: "#FFD600",
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: Colors.dark.card,
  },
  container: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: { color: Colors.dark.text, fontSize: 20, fontWeight: "bold" },
  headerIcons: { flexDirection: "row", gap: 16 },
  searchModuleContainer: {
    backgroundColor: Colors.dark.card,
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "bold" },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  toggleText: { color: Colors.dark.text },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  radioText: { color: Colors.dark.text },
  section: { marginTop: 16, paddingHorizontal: 16 },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  largeCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    overflow: "hidden",
  },
  largeCardImage: { width: "100%", height: 150, resizeMode: "cover" },
  largeCardTextContainer: { padding: 16 },
  largeCardTitle: { color: Colors.dark.text, fontSize: 18, fontWeight: "bold" },
  largeCardSubtitle: { color: Colors.dark.textSecondary, marginTop: 4 },
  largeCardButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  largeCardButtonText: { color: "#FFFFFF", fontWeight: "bold" },
  offerCard: {
    width: 150,
    marginRight: 12,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  offerImage: { width: "100%", height: 80, resizeMode: "cover" },
  offerText: { color: Colors.dark.text, padding: 8 },
  exploreItem: { alignItems: "center", marginRight: 20 },
  exploreText: { color: Colors.dark.text, marginTop: 4 },
  whyBookingCard: {
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderRadius: 12,
  },
  whyBookingTitle: {
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  whyBookingSubtitle: { color: Colors.dark.textSecondary, marginTop: 4 },
  modalContainer: { flex: 1, backgroundColor: Colors.dark.background },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  messageImage: { width: 200, height: 200, resizeMode: "contain" },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark.text,
    textAlign: "center",
    marginTop: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginTop: 10,
  },
  modalFooter: { padding: 20, backgroundColor: Colors.dark.card },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.dark.card,
  },
  modalHeaderText: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: { paddingRight: 10 },
  apartmentsListOverlayDebug: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.95)",
    zIndex: 9999,
    elevation: 20,
    flex: 1,
  },
  closeOverlayButton: {
    position: "absolute",
    top: 40,
    right: 24,
    zIndex: 101,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 4,
  },
});
