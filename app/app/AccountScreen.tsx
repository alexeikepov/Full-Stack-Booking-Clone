// path: src/screens/AccountScreen.tsx
import { useState } from "react";
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
import DiscoverSection from "../components/account/DiscoverSection";
import GeniusRewardsBanner from "../components/account/GeniusRewardsBanner";
import HelpSupportSection from "../components/account/HelpSupportSection";
import LegalPrivacySection from "../components/account/LegalPrivacySection";
import ManageAccountSection from "../components/account/ManageAccountSection";
import ManagePropertySection from "../components/account/ManagePropertySection";
import NoCreditsVouchersBanner from "../components/account/NoCreditsVouchersBanner";
import PaymentInfoSection from "../components/account/PaymentInfoSection";
import PreferencesSection from "../components/account/PreferencesSection";
import ProfileHeader from "../components/account/ProfileHeader";
import SignOutButton from "../components/account/SignOutButton";
import TravelActivitySection from "../components/account/TravelActivitySection";
import SearchBar from "../components/search/SearchBar";
import TabSelector from "../components/search/TabSelector";

import { Colors } from "../constants/Colors";

export default function App() {
  const [activeScreen, setActiveScreen] = useState("Account");
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
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

  const goToSearch = () => {
    closeMessages();
    setActiveScreen("Search");
  };
  const goToAccount = () => {
    setActiveScreen("Account");
  };

  const SearchScreen = () => {
    const [activeTab, setActiveTab] = useState("Stays");
    const [returnToSameLocation, setReturnToSameLocation] = useState(false);
    const [directFlightsOnly, setDirectFlightsOnly] = useState(false);
    const [flightType, setFlightType] = useState("Round-trip");
    const [taxiType, setTaxiType] = useState("One-way");

    const tabIcons = {
      Stays: "bed-outline",
      "Car rental": "car-outline",
      Flights: "airplane-outline",
      Taxi: "car-outline",
      Attractions: "sparkles-outline",
    };

    const renderSearchForm = () => {
      switch (activeTab) {
        case "Stays":
          return (
            <View>
              <SearchBar placeholder="Enter destination" />
              <SearchBar placeholder="Any dates" />
              <SearchBar placeholder="1 room · 2 adults · No children" />
              <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          );
        case "Flights":
          return (
            <View>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setFlightType("Round-trip")}
                >
                  <Ionicons
                    name={
                      flightType === "Round-trip"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color="#007AFF"
                  />
                  <Text style={styles.radioText}>Round-trip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setFlightType("One-way")}
                >
                  <Ionicons
                    name={
                      flightType === "One-way"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color="#007AFF"
                  />
                  <Text style={styles.radioText}>One-way</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setFlightType("Multi-city")}
                >
                  <Ionicons
                    name={
                      flightType === "Multi-city"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color="#007AFF"
                  />
                  <Text style={styles.radioText}>Multi-city</Text>
                </TouchableOpacity>
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
              <TouchableOpacity style={styles.searchButton}>
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
            <View>
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
              <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          );
        case "Taxi":
          return (
            <View>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setTaxiType("One-way")}
                >
                  <Ionicons
                    name={
                      taxiType === "One-way"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color="#007AFF"
                  />
                  <Text style={styles.radioText}>One-way</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setTaxiType("Round-trip")}
                >
                  <Ionicons
                    name={
                      taxiType === "Round-trip"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color="#007AFF"
                  />
                  <Text style={styles.radioText}>Round-trip</Text>
                </TouchableOpacity>
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
              <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.buttonText}>Check prices</Text>
              </TouchableOpacity>
            </View>
          );
        case "Attractions":
          return (
            <View>
              <SearchBar placeholder="Where are you going?" iconName="search" />
              <SearchBar placeholder="Any dates" iconName="calendar-outline" />
              <TouchableOpacity style={styles.searchButton}>
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
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={goToAccount}>
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking.com</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={openMessages}>
              <Ionicons
                name="chatbubble-outline"
                size={22}
                color={Colors.dark.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openNotifications}
              style={styles.headerIconSpacing}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={Colors.dark.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.searchModuleContainer}>
            <TabSelector
              tabs={["Stays", "Flights", "Car rental", "Taxi", "Attractions"]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              icons={tabIcons}
            />
            {renderSearchForm()}
          </View>
          {/* All other content sections remain unchanged */}
        </ScrollView>
      </View>
    );
  };

  const AccountScreen = () => {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
        <ProfileHeader
          userName="Guest"
          geniusLevel="Level 1"
          onMessagesPress={openMessages}
          onNotificationsPress={openNotifications}
        />
        <ScrollView
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <GeniusRewardsBanner />
          <NoCreditsVouchersBanner />
          <PaymentInfoSection />
          <ManageAccountSection />
          <PreferencesSection />
          <TravelActivitySection />
          <HelpSupportSection />
          <LegalPrivacySection />
          <DiscoverSection />
          <ManagePropertySection />
          <SignOutButton />
        </ScrollView>
      </View>
    );
  };

  const MessagesModal = (
    <Modal
      visible={showMessagesModal}
      animationType="slide"
      transparent={false}
      onRequestClose={closeMessages}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={closeMessages} style={styles.closeButton}>
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
          <TouchableOpacity style={styles.searchButton} onPress={goToSearch}>
            <Text style={styles.buttonText}>Book now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const NotificationsModal = (
    <Modal
      visible={showNotificationsModal}
      animationType="slide"
      transparent={false}
      onRequestClose={closeNotifications}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
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
  );

  const HelpCenterModal = (
    <Modal
      visible={isHelpCenterOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={closeHelpCenter}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={closeHelpCenter}
            style={styles.closeButton}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.modalHeaderText}>Help Center</Text>
        </View>
        <HelpSupportSection />
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={{ flex: 1 }}>
      {activeScreen === "Account" ? <AccountScreen /> : <SearchScreen />}
      {showMessagesModal && MessagesModal}
      {showNotificationsModal && NotificationsModal}
      {isHelpCenterOpen && HelpCenterModal}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: Colors.dark.background,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconSpacing: {
    marginLeft: 16,
  },
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
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  toggleText: {
    color: Colors.dark.text,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 8,
    alignItems: "center",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginRight: 12,
  },
  radioText: {
    color: Colors.dark.text,
    marginLeft: 6,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
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
  largeCardImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  largeCardTextContainer: {
    padding: 16,
  },
  largeCardTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  largeCardSubtitle: {
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  largeCardButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  largeCardButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  twoColumnCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  smallCard: {
    width: "48%",
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  smallCardImage: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
  },
  smallCardTitle: {
    color: Colors.dark.text,
    fontWeight: "bold",
    padding: 8,
  },
  offerCard: {
    width: 150,
    marginRight: 12,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  offerImage: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
  },
  offerText: {
    color: Colors.dark.text,
    padding: 8,
  },
  dealsCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  dealsImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  dealsContent: {
    padding: 12,
  },
  dealsTitle: {
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  dealsSubtitle: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
  exploreItem: {
    alignItems: "center",
    marginRight: 16,
  },
  exploreImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  exploreTitle: {
    color: Colors.dark.text,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.card,
  },
  modalHeaderText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  modalSubtitle: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  modalFooter: {
    padding: 16,
  },
  messageImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
});
