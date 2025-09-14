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
import HelpSupportSection, {
  HelpSupportSectionProps,
} from "../components/account/HelpSupportSection";
import ContinueSearchCard from "../components/search/ContinueSearchCard";
import SearchBar from "../components/search/SearchBar";
import TabSelector from "../components/search/TabSelector";
import { Colors } from "../constants/Colors";

export default function App({ onBack }: HelpSupportSectionProps) {
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
    openMessages(); // Return to the messages modal
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
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue your search</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((item) => (
                <ContinueSearchCard
                  key={item}
                  title="Gusto Della Vita"
                  subtitle="Rome, 2 nights"
                />
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
                <TouchableOpacity style={styles.largeCardButton}>
                  <Text style={styles.largeCardButtonText}>Find deals</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.twoColumnCardsContainer}>
              <View style={styles.smallCard}>
                <Image
                  source={require("./../assets/images/place-holder.jpg")}
                  style={styles.smallCardImage}
                />
                <Text style={styles.smallCardTitle}>
                  Exclusive deals for you
                </Text>
              </View>
              <View style={styles.smallCard}>
                <Image
                  source={require("./../assets/images/place-holder.jpg")}
                  style={styles.smallCardImage}
                />
                <Text style={styles.smallCardTitle}>
                  Book your trip with us
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Offers</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((item) => (
                <View key={item} style={styles.offerCard}>
                  <Image
                    source={require("./../assets/images/place-holder.jpg")}
                    style={styles.offerImage}
                  />
                  <Text style={styles.offerText}>20% off hotel bookings</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deals for the weekend</Text>
            <View style={styles.dealsCard}>
              <Image
                source={require("./../assets/images/place-holder.jpg")}
                style={styles.dealsImage}
              />
              <View style={styles.dealsContent}>
                <Text style={styles.dealsTitle}>Getaway Deals</Text>
                <Text style={styles.dealsSubtitle}>
                  Exclusive offers on flights
                </Text>
              </View>
            </View>
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
            <View style={styles.whyBookingCard}>
              <Text style={styles.whyBookingTitle}>Trustworthy and secure</Text>
              <Text style={styles.whyBookingSubtitle}>
                Millions of reviews from verified guests
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manage</Text>
            <View style={styles.twoColumnCardsContainer}>
              <View style={styles.manageCard}>
                <Ionicons
                  name="notifications-outline"
                  size={30}
                  color={Colors.dark.text}
                />
                <Text style={styles.manageText}>Notifications</Text>
              </View>
              <View style={styles.manageCard}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={30}
                  color={Colors.dark.text}
                />
                <Text style={styles.manageText}>Messages</Text>
              </View>
            </View>
          </View>
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
          <TouchableOpacity style={styles.searchButton} onPress={closeMessages}>
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
            onPress={onBack ? onBack : closeHelpCenter}
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
      <SearchScreen />
      {MessagesModal}
      {NotificationsModal}
      {HelpCenterModal}
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
    padding: 16,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
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
    justifyContent: "space-between",
    marginBottom: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  radioText: {
    color: Colors.dark.text,
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
    marginRight: 20,
  },
  exploreText: {
    color: Colors.dark.text,
    marginTop: 4,
  },
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
  whyBookingSubtitle: {
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  manageCard: {
    width: "48%",
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  manageText: {
    color: Colors.dark.text,
    marginTop: 8,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  messageImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
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
  modalFooter: {
    padding: 20,
    backgroundColor: Colors.dark.card,
  },
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
  closeButton: {
    paddingRight: 10,
  },
});
