import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import GeniusLoyaltyModal from "../components/account/GeniusLoyaltyModal";
import HelpSupportSection, {
  HelpSupportSectionProps,
} from "../components/account/HelpSupportSection";
import ContinueSearchCard from "../components/search/ContinueSearchCard";
import SearchBar from "../components/search/SearchBar";
import TabSelector from "../components/search/TabSelector";
import { useTheme } from "../hooks/ThemeContext";
import PropertyList from "./PropertyListScreen";
type ThemeColors = {
  text: string;
  textSecondary: string;
  background: string;
  card: string;
  button: string;
  accent?: string;
  tint?: string;
  icon?: string;
  tabIconDefault?: string;
  tabIconSelected?: string;
  inputBackground?: string;
  gray?: string;
  blue?: string; // Ensure blue is part of ThemeColors
  [key: string]: string | undefined;
};
const createStyles = (colors: ThemeColors, theme: string) =>
  StyleSheet.create({
    searchFormBorder: {
      borderWidth: 2,
      borderColor: colors.theme === "light" ? "#FFC107" : "#FFCC00",
      borderRadius: 14,
      padding: 16,
      marginTop: 0,
      marginBottom: 12,
      backgroundColor: colors.card,
    },
    container: {
      flex: 1,
      backgroundColor: theme === "light" ? "#003399" : colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: theme === "dark" ? colors.black : colors.blue,
      position: "relative",
    },
    headerTitle: {
      color: theme === "light" ? "#fff" : colors.text,
      fontSize: 20,
      fontWeight: "bold",
      position: "absolute",
      left: 0,
      right: 0,
      textAlign: "center",
    },
    headerIcons: {
      flexDirection: "row",
      gap: 20,
      alignItems: "center",
      marginLeft: "auto",
    },
    searchModuleContainer: {
      backgroundColor: theme === "light" ? colors.card : "#181A20",
      margin: 16,
      borderRadius: 16,
      padding: 16,
    },
    searchButton: {
      backgroundColor: colors.button,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 24,
      width: "100%",
    },
    buttonText: {
      color: theme === "light" ? "#fff" : colors.text,
      fontWeight: "bold",
      fontSize: 16,
    },
    toggleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    toggleText: { color: colors.text },
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
    radioText: { color: colors.text },
    section: { marginTop: 16, paddingHorizontal: 16 },
    sectionTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    largeCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: "hidden",
    },
    largeCardImage: { width: "100%", height: 150, resizeMode: "cover" },
    largeCardTextContainer: { padding: 16 },
    largeCardTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    largeCardSubtitle: { color: colors.textSecondary, marginTop: 4 },
    largeCardButton: {
      backgroundColor: colors.button,
      padding: 10,
      borderRadius: 8,
      marginTop: 12,
      alignSelf: "flex-start",
    },
    largeCardButtonText: { color: colors.background, fontWeight: "bold" },
    offerCard: {
      width: 150,
      marginRight: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
    },
    offerImage: { width: "100%", height: 80, resizeMode: "cover" },
    offerText: { color: colors.text, padding: 8 },
    exploreItem: { alignItems: "center", marginRight: 20 },
    exploreText: { color: colors.text, marginTop: 4 },
    whyBookingTitle: {
      color: colors.text,
      fontWeight: "bold",
      fontSize: 16,
    },
    whyBookingSubtitle: { color: colors.textSecondary, marginTop: 4 },
    modalContainer: { flex: 1, backgroundColor: colors.background },
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
      color: colors.text,
      textAlign: "center",
      marginTop: 20,
    },
    modalSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 10,
    },
    modalFooter: { padding: 20, backgroundColor: colors.card },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
    },
    modalHeaderText: {
      color: colors.text,
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
    geniusCard: {
      backgroundColor: "#003580",
      borderRadius: 12,
      padding: 16,
      marginRight: 12,
      width: "48%",
    },
    geniusTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    geniusSubtitle: { color: "#fff", marginTop: 4 },
    offersCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      width: "48%",
      borderWidth: 1,
      borderColor: colors.button,
    },
    offersTitle: { color: colors.text, fontWeight: "bold", fontSize: 16 },
    offersSubtitle: { color: colors.textSecondary, marginTop: 4 },
    offersNew: {
      color: colors.button,
      fontWeight: "bold",
      marginTop: 4,
    },
    continueSearchCard: {
      width: "48%",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#E6E6E6",
      overflow: "hidden",
      backgroundColor: colors.background,
      marginBottom: 12,
    },
    continueSearchImage: {
      width: "100%",
      height: 100,
      backgroundColor: "#E6E6E6",
    },
    continueSearchTextContainer: { padding: 12 },
    continueSearchTitle: { color: colors.text, fontWeight: "bold" },
    continueSearchSubtitle: { color: colors.textSecondary, fontSize: 12 },
    whyBookingCard: {
      backgroundColor: colors.card,
      padding: 2,
      borderRadius: 12,
      width: 180,
      marginRight: 12,
    },
    searchContainer: {
      backgroundColor: theme === "dark" ? colors.black : colors.blue,
      paddingHorizontal: 16,
    },
    searchFormContainer: {
      backgroundColor: theme === "dark" ? colors.black : colors.blue,
    },
    // purpleCard and greenCard styles removed; use offerCard style instead
    sectionScrollView: {
      backgroundColor: colors.background,
      flexGrow: 1,
    },
  });
export default function App({ onBack }: HelpSupportSectionProps) {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);
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

  const handleSwipeGesture = (event: any) => {
    const { translationX, velocityX, state } = event.nativeEvent;

    if (state === State.END) {
      // If swiped right with enough distance or velocity, close the overlay
      if (translationX > 100 || velocityX > 500) {
        setShowApartmentsList(false);
      }
    }
  };

  const SearchScreen = ({
    showApartmentsList,
    setShowApartmentsList,
  }: {
    showApartmentsList: boolean;
    setShowApartmentsList: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const { colors, theme } = useTheme();
    const styles = createStyles(colors, theme);
    const [bgColor, setBgColor] = useState(
      theme === "light" ? "#003399" : colors.background,
    );
    const handleScroll = (event: {
      nativeEvent: {
        contentOffset: any;
        contentSize: any;
        layoutMeasurement: any;
      };
    }) => {
      if (theme !== "light") return;
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const scrollableHeight = contentSize.height - layoutMeasurement.height;
      const halfway = scrollableHeight / 2;
      if (contentOffset.y < halfway) {
        setBgColor("#003399");
      } else {
        setBgColor("#ffffff");
      }
    };
    // Genius modal state and handlers
    const [showGeniusModal, setShowGeniusModal] = useState(false);
    const handleGeniusCardPress = () => setShowGeniusModal(true);
    const handleCloseGeniusModal = () => setShowGeniusModal(false);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const handleOfferPress = () => setShowOfferModal(true);
    const handleCloseOfferModal = () => setShowOfferModal(false);
    const [activeTab, setActiveTab] = useState("Stays");
    const [returnToSameLocation, setReturnToSameLocation] = useState(false);
    const [directFlightsOnly, setDirectFlightsOnly] = useState(false);
    const [flightType, setFlightType] = useState("Round-trip");
    const [taxiType, setTaxiType] = useState("One-way");
    const tabIcons = {
      Stays: "bed-outline",
      "Car rental": "car-outline",
      Flights: "airplane-outline",
      Taxi: "car-sport-outline",
      Attractions: "sparkles-outline",
    };
    const renderSearchForm = () => {
      const handleSearch = () => {
        setShowApartmentsList(true);
      };
      switch (activeTab) {
        case "Stays":
          return (
            <View style={styles.searchFormBorder}>
              <SearchBar placeholder="Rome" />
              <SearchBar placeholder="Thu, 18 Sep - Mon, 22 Sep" />
              <SearchBar placeholder="1 room · 4 adults · No children" />
              <TouchableOpacity
                style={{
                  backgroundColor:
                    theme === "light" ? "#0044BB" : colors.button,
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                  marginTop: 8,
                }}
                onPress={handleSearch}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Search
                </Text>
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
                      color={colors.button}
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
                style={{
                  backgroundColor:
                    theme === "light" ? "#0044BB" : colors.button,
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                  marginTop: 8,
                }}
                onPress={handleSearch}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Search
                </Text>
              </TouchableOpacity>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleText}>Direct flights only</Text>
                <Switch
                  value={directFlightsOnly}
                  onValueChange={setDirectFlightsOnly}
                  trackColor={{ false: "#767577", true: colors.button }}
                  thumbColor={
                    directFlightsOnly ? colors.background : colors.gray
                  }
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
                  trackColor={{ false: "#767577", true: colors.button }}
                  thumbColor={
                    returnToSameLocation ? colors.background : colors.gray
                  }
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
                style={{
                  backgroundColor:
                    theme === "light" ? "#0044BB" : colors.button,
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                  marginTop: 8,
                }}
                onPress={handleSearch}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Search
                </Text>
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
                      color={colors.button}
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
                style={{
                  backgroundColor:
                    theme === "light" ? "#0044BB" : colors.button,
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                  marginTop: 8,
                }}
                onPress={handleSearch}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Check prices
                </Text>
              </TouchableOpacity>
            </View>
          );
        case "Attractions":
          return (
            <View style={styles.searchFormBorder}>
              <SearchBar placeholder="Where are you going?" iconName="search" />
              <SearchBar placeholder="Any dates" iconName="calendar-outline" />
              <TouchableOpacity
                style={{
                  backgroundColor:
                    theme === "light" ? "#0044BB" : colors.button,
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                  marginTop: 8,
                }}
                onPress={handleSearch}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Search
                </Text>
              </TouchableOpacity>
            </View>
          );
        default:
          return null;
      }
    };
    return (
      <View
        style={[
          styles.container,
          theme === "light" ? { backgroundColor: bgColor } : {},
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking.com</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={openMessages}>
              <Ionicons name="chatbubble-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={openNotifications}>
              <Ionicons name="notifications-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.sectionScrollView}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.searchContainer}>
            <TabSelector
              tabs={["Stays", "Car rental", "Taxi", "Attractions"]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              icons={tabIcons}
            />
          </View>
          <View style={styles.searchFormContainer}>{renderSearchForm()}</View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue your search</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {(() => {
                const items = [
                  { title: "Rome", subtitle: "18–22 Sep" },
                  { title: "Barcelona", subtitle: "18–22 Sep" },
                  { title: "Paris", subtitle: "18–22 Sep" },
                  { title: "London", subtitle: "18–22 Sep" },
                  { title: "New York", subtitle: "18–22 Sep" },
                  { title: "Tokyo", subtitle: "18–22 Sep" },
                ];
                return (
                  <View style={{ flexDirection: "row", gap: 16 }}>
                    {items.map((item, idx) => (
                      <View
                        key={idx}
                        style={{
                          width: 180,
                          backgroundColor: colors.card,
                          borderRadius: 16,
                          padding: 16,
                        }}
                      >
                        <ContinueSearchCard
                          title={item.title}
                          subtitle={item.subtitle}
                          titleStyle={{ color: colors.text }}
                          subtitleStyle={{ color: colors.textSecondary }}
                          onPress={() => setShowApartmentsList(true)}
                        />
                      </View>
                    ))}
                  </View>
                );
              })()}
            </ScrollView>
          </View>

          <View style={{ padding: 16 }}>
            <Text style={styles.sectionTitle}>
              you got a temporary upgrade!
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              <TouchableOpacity onPress={handleGeniusCardPress}>
                <View
                  style={[
                    styles.geniusCard,
                    {
                      width: 250,
                      padding: 16,
                      marginRight: 16,
                      paddingBottom: 45,
                    },
                  ]}
                >
                  <Text style={styles.geniusSubtitle}>
                    Genius{"\n"}Crazy, you have been{"\n"}upgraded to Level 2
                    until{"\n"}Oct 1 2025
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGeniusCardPress}>
                <View
                  style={[
                    styles.offersCard,
                    { width: 250, padding: 16, marginRight: 16 },
                  ]}
                >
                  <Text style={styles.offersTitle}>
                    10-15% discounts{"\n"}on stays
                  </Text>
                  <Text style={styles.offersSubtitle}>
                    Enjoy discounts at partner{"\n"}properties worldwide
                  </Text>
                  <Text style={styles.offersNew}>New</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGeniusCardPress}>
                <View
                  style={[
                    styles.offersCard,
                    { width: 250, padding: 16, marginRight: 16 },
                  ]}
                >
                  <Text style={styles.offersTitle}>Exclusive Deals!</Text>
                  <Text style={styles.offersSubtitle}>
                    Book now and get up to{"\n"}20% off selected properties
                  </Text>
                  <Text style={styles.offersNew}>Hot</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGeniusCardPress}>
                <View
                  style={[
                    styles.offersCard,
                    { width: 250, padding: 16, marginRight: 16 },
                  ]}
                >
                  <Text style={styles.offersTitle}>Weekend Specials</Text>
                  <Text style={styles.offersSubtitle}>
                    Save on weekend stays{"\n"}with extra perks
                  </Text>
                  <Text style={styles.offersNew}>New</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGeniusCardPress}>
                <View
                  style={[
                    styles.offersCard,
                    { width: 250, padding: 16, marginRight: 16 },
                  ]}
                >
                  <Text style={styles.offersTitle}>Early Bird Savings</Text>
                  <Text style={styles.offersSubtitle}>
                    Book in advance and save up to 25%
                  </Text>
                  <Text style={styles.offersNew}>Limited</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGeniusCardPress}>
                <View
                  style={[
                    styles.offersCard,
                    { width: 250, padding: 16, marginRight: 16 },
                  ]}
                >
                  <Text style={styles.offersTitle}>Last Minute Deals</Text>
                  <Text style={styles.offersSubtitle}>
                    Grab a deal for tonights stay {"\n"}with up to 30% off
                  </Text>
                  <Text style={styles.offersNew}>Hot</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGeniusCardPress}>
                <View
                  style={[
                    styles.offersCard,
                    { width: 250, padding: 16, marginRight: 16 },
                  ]}
                >
                  <Text style={styles.offersTitle}>Family Packages</Text>
                  <Text style={styles.offersSubtitle}>
                    Special rates for families and groups
                  </Text>
                  <Text style={styles.offersNew}>New</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGeniusCardPress}>
                <View
                  style={[
                    styles.offersCard,
                    { width: 250, padding: 16, marginRight: 16 },
                  ]}
                >
                  <Text style={styles.offersTitle}>Business Traveler</Text>
                  <Text style={styles.offersSubtitle}>
                    Exclusive perks for business trips
                  </Text>
                  <Text style={styles.offersNew}>Pro</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGeniusCardPress}>
                <View style={[styles.offersCard, { width: 250, padding: 16 }]}>
                  <Text style={styles.offersTitle}>Romantic Getaways</Text>
                  <Text style={styles.offersSubtitle}>
                    Special offers for couples retreats
                  </Text>
                  <Text style={styles.offersNew}>New</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
            <GeniusLoyaltyModal
              visible={showGeniusModal}
              onClose={handleCloseGeniusModal}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Offers</Text>
            <Text style={styles.offersSubtitle}>
              promotions, deals, and special offers just for you!
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            >
              <TouchableOpacity
                style={styles.offerCard}
                onPress={handleOfferPress}
              >
                <Image
                  source={require("./../assets/images/place-holder.jpg")}
                  style={[
                    StyleSheet.absoluteFill,
                    { borderRadius: 12, width: "100%", height: "100%" },
                  ]}
                  resizeMode="cover"
                />
                <View style={{ padding: 8, zIndex: 2 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: colors.text,
                      textShadowColor: "rgba(0,0,0,0.3)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    Quick escape, quality time
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      textShadowColor: "rgba(0,0,0,0.2)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                    }}
                  >
                    Save up to 20% with a Getaway Deal
                  </Text>
                  <Text
                    style={{
                      color: colors.button,
                      marginTop: 4,
                      textShadowColor: "rgba(0,0,0,0.2)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                    }}
                  >
                    Save on stays
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.offerCard}
                onPress={handleOfferPress}
              >
                <Image
                  source={require("./../assets/images/place-holder.jpg")}
                  style={[
                    StyleSheet.absoluteFill,
                    { borderRadius: 12, width: "100%", height: "100%" },
                  ]}
                  resizeMode="cover"
                />
                <View style={{ padding: 8, zIndex: 2 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: colors.text,
                      textShadowColor: "rgba(0,0,0,0.3)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    20% off hotel bookings
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      textShadowColor: "rgba(0,0,0,0.2)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                    }}
                  >
                    Book now and get a great discount
                  </Text>
                  <Text
                    style={{
                      color: colors.button,
                      marginTop: 4,
                      textShadowColor: "rgba(0,0,0,0.2)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                    }}
                  >
                    Find deals
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.offerCard}
                onPress={handleOfferPress}
              >
                <Image
                  source={require("./../assets/images/place-holder.jpg")}
                  style={[
                    StyleSheet.absoluteFill,
                    { borderRadius: 12, width: "100%", height: "100%" },
                  ]}
                  resizeMode="cover"
                />
                <View style={{ padding: 8, zIndex: 2 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: colors.text,
                      textShadowColor: "rgba(0,0,0,0.3)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    Free breakfast included
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      textShadowColor: "rgba(0,0,0,0.2)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                    }}
                  >
                    Enjoy complimentary breakfast with your stay
                  </Text>
                  <Text
                    style={{
                      color: colors.button,
                      marginTop: 4,
                      textShadowColor: "rgba(0,0,0,0.2)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                    }}
                  >
                    Eat well
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.offerCard}
                onPress={handleOfferPress}
              >
                <Image
                  source={require("./../assets/images/place-holder.jpg")}
                  style={[
                    StyleSheet.absoluteFill,
                    { borderRadius: 12, width: "100%", height: "100%" },
                  ]}
                  resizeMode="cover"
                />
                <View style={{ padding: 8, zIndex: 2 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: colors.text,
                      textShadowColor: "rgba(0,0,0,0.3)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    Kids stay free
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      textShadowColor: "rgba(0,0,0,0.2)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                    }}
                  >
                    Special family rates available
                  </Text>
                  <Text
                    style={{
                      color: colors.button,
                      marginTop: 4,
                      textShadowColor: "rgba(0,0,0,0.2)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                    }}
                  >
                    Family friendly
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.offerCard}
                onPress={handleOfferPress}
              >
                <Image
                  source={require("./../assets/images/place-holder.jpg")}
                  style={[
                    StyleSheet.absoluteFill,
                    { borderRadius: 12, width: "100%", height: "100%" },
                  ]}
                  resizeMode="cover"
                />
                <View style={{ padding: 8, zIndex: 2 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: colors.text,
                      textShadowColor: "rgba(0,0,0,0.3)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    Free cancellation
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      textShadowColor: "rgba(0,0,0,0.2)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                    }}
                  >
                    Cancel anytime for free on select deals
                  </Text>
                  <Text
                    style={{
                      color: colors.button,
                      marginTop: 4,
                      textShadowColor: "rgba(0,0,0,0.2)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 1,
                    }}
                  >
                    Book with confidence
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
            <Modal
              visible={showOfferModal}
              animationType="fade"
              presentationStyle="overFullScreen"
              onRequestClose={handleCloseOfferModal}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: 220,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.card,
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
                      color: colors.textSecondary,
                      textAlign: "center",
                    }}
                  >
                    Sorry, offers not relevant to you
                  </Text>
                  <Text
                    style={{
                      color: colors.text,
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
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontWeight: "bold",
                      }}
                    >
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Explore the World</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            >
              <TouchableOpacity onPress={() => setShowApartmentsList(true)}>
                <View
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    width: 160,
                    padding: 12,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                >
                  <Image
                    source={require("./../assets/images/place-holder.jpg")}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: colors.text,
                    }}
                  >
                    Paris
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 13,
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    The city of lights and romance
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowApartmentsList(true)}>
                <View
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    width: 160,
                    padding: 12,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                >
                  <Image
                    source={require("./../assets/images/place-holder.jpg")}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: colors.text,
                    }}
                  >
                    New York
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 13,
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    The city that never sleeps
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowApartmentsList(true)}>
                <View
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    width: 160,
                    padding: 12,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                >
                  <Image
                    source={require("./../assets/images/place-holder.jpg")}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: colors.text,
                    }}
                  >
                    Tokyo
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 13,
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    Tradition meets technology
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowApartmentsList(true)}>
                <View
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    width: 160,
                    padding: 12,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                >
                  <Image
                    source={require("./../assets/images/map.png")}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: colors.text,
                    }}
                  >
                    London
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 13,
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    History and modernity
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowApartmentsList(true)}>
                <View
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    width: 160,
                    padding: 12,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                >
                  <Image
                    source={require("./../assets/images/place-holder.jpg")}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: colors.text,
                    }}
                  >
                    Sydney
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 13,
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    Iconic beaches and vibrant culture
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Booking.com?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View
                style={[
                  styles.whyBookingCard,
                  { flexDirection: "row", alignItems: "center", minWidth: 180 },
                ]}
              >
                <Ionicons
                  name="phone-portrait-outline"
                  size={40}
                  color={colors.blue}
                />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text
                    style={styles.whyBookingTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    Mobile-only {"\n"} pricing
                  </Text>
                  <Text
                    style={styles.whyBookingSubtitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    Save money on select stays
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.whyBookingCard,
                  { flexDirection: "row", alignItems: "center", minWidth: 180 },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={40}
                  color={colors.blue}
                />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text
                    style={styles.whyBookingTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    Free {"\n"} cancellation
                  </Text>
                  <Text
                    style={styles.whyBookingSubtitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    Find what works for you
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.whyBookingCard,
                  { flexDirection: "row", alignItems: "center", minWidth: 180 },
                ]}
              >
                <Ionicons
                  name="headset-outline"
                  size={40}
                  color={colors.blue}
                />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text
                    style={styles.whyBookingTitle}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    24/7{"\n"} Customer{"\n"} Support
                  </Text>
                  <Text
                    style={styles.whyBookingSubtitle}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    We are here to help anytime, anywhere
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.whyBookingCard,
                  { flexDirection: "row", alignItems: "center", minWidth: 180 },
                ]}
              >
                <Ionicons name="cash-outline" size={40} color={colors.blue} />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text
                    style={styles.whyBookingTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    No booking fees
                  </Text>
                  <Text
                    style={styles.whyBookingSubtitle}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    Book with confidence, no hidden charges
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.whyBookingCard,
                  { flexDirection: "row", alignItems: "center", minWidth: 180 },
                ]}
              >
                <Ionicons name="star-outline" size={40} color={colors.blue} />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text
                    style={styles.whyBookingTitle}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    Genius loyalty program
                  </Text>
                  <Text
                    style={styles.whyBookingSubtitle}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    Unlock exclusive discounts and perks
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.whyBookingCard,
                  { flexDirection: "row", alignItems: "center", minWidth: 180 },
                ]}
              >
                <Ionicons name="globe-outline" size={40} color={colors.blue} />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text
                    style={styles.whyBookingTitle}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    Wide selection
                  </Text>
                  <Text
                    style={styles.whyBookingSubtitle}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    Choose from millions of properties worldwide
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.whyBookingCard,
                  { flexDirection: "row", alignItems: "center", minWidth: 180 },
                ]}
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={40}
                  color={colors.blue}
                />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Text
                    style={styles.whyBookingTitle}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    Verified guest reviews
                  </Text>
                  <Text
                    style={styles.whyBookingSubtitle}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    Real feedback from real travelers
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.blue} translucent={false} />
      <SearchScreen
        showApartmentsList={showApartmentsList}
        setShowApartmentsList={setShowApartmentsList}
      />
      {showApartmentsList && (
        <PanGestureHandler
          onGestureEvent={handleSwipeGesture}
          onHandlerStateChange={handleSwipeGesture}
        >
          <View style={styles.apartmentsListOverlayDebug}>
            <PropertyList onBack={() => setShowApartmentsList(false)} />
          </View>
        </PanGestureHandler>
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
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderText}>Messages</Text>
            <TouchableOpacity onPress={openHelpCenter}>
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={colors.text}
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
              color={colors.text}
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
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text
              style={[
                styles.modalHeaderText,
                { flex: 1 },
                { textAlign: "center" },
              ]}
            >
              Help Center
            </Text>
          </View>
          <HelpSupportSection />
        </SafeAreaView>
      </Modal>
    </View>
  );
}
