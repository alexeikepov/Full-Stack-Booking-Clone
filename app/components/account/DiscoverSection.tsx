import React, { JSX, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import AccountItem from "./AccountItem";
import AccountSection from "./AccountSection";
import { itemIcons } from "./itemIcons";

interface Style {
  fullContainer: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  headerText: TextStyle;
  heroImage: ViewStyle;
  heroTextContainer: ViewStyle;
  heroTitle: TextStyle;
  heroSubtitle: TextStyle;
  searchSection: ViewStyle;
  searchField: ViewStyle;
  searchFieldText: TextStyle;
  searchButton: ViewStyle;
  searchButtonText: TextStyle;
  conditionsSection: ViewStyle;
  conditionItem: ViewStyle;
  conditionText: TextStyle;
  scrollContent: ViewStyle;
  subModalContainer: ViewStyle;
  searchInput: ViewStyle & TextStyle;
  yellowBorder: ViewStyle;
  searchHistoryContainer: ViewStyle;
  searchHistoryTitle: TextStyle;
  searchHistoryItem: ViewStyle;
  datesModalTabs: ViewStyle;
  datesModalTab: ViewStyle;
  datesModalTabText: TextStyle;
  datesModalCalendar: ViewStyle;
  datesModalRow: ViewStyle;
  datesModalDay: ViewStyle;
  datesModalDayText: TextStyle;
  datesModalFooter: ViewStyle;
  roomsCounter: ViewStyle;
  roomsCounterLabel: TextStyle;
  roomsCounterControls: ViewStyle;
  roomsCounterButton: ViewStyle;
  roomsCounterButtonText: TextStyle;
  roomsCounterValue: TextStyle;
  roomsModalSection: ViewStyle;
  roomsModalSectionTitle: TextStyle;
  applyButton: ViewStyle;
  applyButtonText: TextStyle;
  roomsGuestsFooter: ViewStyle;
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create<Style>({
  fullContainer: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.dark.background,
  },
  backButton: { paddingRight: 10 },
  headerText: { fontSize: 20, fontWeight: "bold", color: Colors.dark.text },
  heroImage: {
    width: "100%",
    height: width * 0.7,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  heroTextContainer: {
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginTop: 5,
  },
  searchSection: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: -20,
    padding: 16,
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  searchFieldText: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
    marginLeft: 12,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  conditionsSection: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  conditionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  conditionText: {
    fontSize: 16,
    color: Colors.dark.text,
    marginLeft: 10,
  },
  scrollContent: { paddingBottom: 24 },
  subModalContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  searchInput: {
    height: 40,
    color: Colors.dark.text,
    fontSize: 16,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  yellowBorder: {
    borderWidth: 2,
    borderColor: "#FFA500", // A representative yellow color
  },
  searchHistoryContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  searchHistoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 10,
  },
  searchHistoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dark.text,
  },
  datesModalTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    marginVertical: 10,
    padding: 5,
    marginHorizontal: 16,
  },
  datesModalTab: {
    paddingVertical: 10,
    flex: 1,
    alignItems: "center",
    borderRadius: 8,
  },
  datesModalTabText: {
    color: Colors.dark.text,
    fontWeight: "bold",
  },
  datesModalCalendar: {
    marginTop: 20,
    backgroundColor: Colors.dark.card,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  datesModalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  datesModalDay: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  datesModalDayText: {
    color: Colors.dark.text,
  },
  datesModalFooter: {
    backgroundColor: Colors.dark.card,
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  roomsCounter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dark.text,
  },
  roomsCounterLabel: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  roomsCounterControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomsCounterButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.dark.icon,
    justifyContent: "center",
    alignItems: "center",
  },
  roomsCounterButtonText: {
    color: Colors.dark.icon,
    fontSize: 20,
  },
  roomsCounterValue: {
    color: Colors.dark.text,
    fontSize: 18,
    marginHorizontal: 15,
  },
  roomsModalSection: {
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderRadius: 8,
  },
  roomsModalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  roomsGuestsFooter: {
    padding: 16,
  },
});

export default function DiscoverSection(): JSX.Element {
  const [showDealsModal, setShowDealsModal] = useState(false);
  const [activeSubModal, setActiveSubModal] = useState<
    "none" | "destination" | "dates" | "rooms"
  >("none");
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: number | null;
    checkOut: number | null;
  }>({ checkIn: null, checkOut: null });
  const [selectedDestination, setSelectedDestination] =
    useState("Enter destination");
  const [searchQuery, setSearchQuery] = useState("");

  const items = ["Deals"];

  const renderModalHeader = (title: string, onClose: () => void) => (
    <View style={styles.header}>
      <Pressable onPress={onClose} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
      </Pressable>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );

  const handleDateSelection = (day: number) => {
    if (!selectedDates.checkIn) {
      setSelectedDates({ checkIn: day, checkOut: null });
    } else if (!selectedDates.checkOut && day > selectedDates.checkIn) {
      setSelectedDates((prev) => ({ ...prev, checkOut: day }));
    } else {
      setSelectedDates({ checkIn: day, checkOut: null });
    }
  };

  const handleDestinationPress = (destination: string) => {
    setSelectedDestination(destination);
    setActiveSubModal("none");
  };

  const handleSearch = () => {
    Alert.alert(
      "Search",
      `Searching for ${selectedDestination} from ${selectedDates.checkIn} to ${selectedDates.checkOut} for ${rooms} rooms, ${adults} adults and ${children} children.`,
    );
  };

  const handleApplyDates = () => {
    setActiveSubModal("none");
  };

  const handleApplyRooms = () => {
    setActiveSubModal("none");
  };

  const renderDestinationModal = () => (
    <SafeAreaView style={styles.subModalContainer}>
      {renderModalHeader("Booking.com", () => setActiveSubModal("none"))}
      <TextInput
        placeholder="Enter destination"
        placeholderTextColor={Colors.dark.textSecondary}
        style={[
          styles.searchInput,
          styles.yellowBorder,
          { marginHorizontal: 16 },
        ]}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus
      />
      <ScrollView>
        <View style={styles.searchHistoryContainer}>
          <Text style={styles.searchHistoryTitle}>Continue your search</Text>
          <Pressable
            style={styles.searchHistoryItem}
            onPress={() =>
              handleDestinationPress("Lisbon, Lisbon District, Portugal")
            }
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={Colors.dark.icon}
            />
            <Text style={styles.searchFieldText}>
              Lisbon, Lisbon District, Portugal
            </Text>
          </Pressable>
          <Pressable
            style={styles.searchHistoryItem}
            onPress={() =>
              handleDestinationPress("London, England, United Kingdom")
            }
          >
            <Ionicons name="time-outline" size={20} color={Colors.dark.icon} />
            <Text style={styles.searchFieldText}>
              London, England, United Kingdom
            </Text>
          </Pressable>
        </View>
        <View style={styles.searchHistoryContainer}>
          <Text style={styles.searchHistoryTitle}>Recent searches</Text>
          <Pressable
            style={styles.searchHistoryItem}
            onPress={() =>
              handleDestinationPress("Paris, Île-de-France, France")
            }
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={Colors.dark.icon}
            />
            <Text style={styles.searchFieldText}>
              Paris, Île-de-France, France
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderDatesModal = () => (
    <SafeAreaView style={styles.subModalContainer}>
      {renderModalHeader("Select dates", () => setActiveSubModal("none"))}
      <View style={styles.datesModalTabs}>
        <View
          style={[
            styles.datesModalTab,
            { backgroundColor: Colors.dark.background },
          ]}
        >
          <Text style={styles.datesModalTabText}>Calendar</Text>
        </View>
        <Pressable
          style={styles.datesModalTab}
          onPress={() => Alert.alert("I am flexible")}
        >
          <Text style={styles.datesModalTabText}>I am flexible</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.datesModalCalendar}>
          <Text
            style={[
              styles.headerText,
              { textAlign: "center", marginBottom: 10 },
            ]}
          >
            Oct 2025
          </Text>
          <View style={[styles.datesModalRow, { marginBottom: 0 }]}>
            {["M", "T", "W", "Th", "F", "S", "Su"].map((day) => (
              <View key={day} style={styles.datesModalDay}>
                <Text
                  style={[
                    styles.datesModalDayText,
                    { color: Colors.dark.textSecondary },
                  ]}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>
          {Array.from({ length: 5 }).map((_, weekIndex) => (
            <View key={weekIndex} style={styles.datesModalRow}>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const day = weekIndex * 7 + dayIndex + 1;
                const isSelected =
                  selectedDates.checkIn === day ||
                  selectedDates.checkOut === day;
                const isBetween =
                  selectedDates.checkIn &&
                  selectedDates.checkOut &&
                  day > selectedDates.checkIn &&
                  day < selectedDates.checkOut;
                return (
                  <Pressable
                    key={dayIndex}
                    style={[
                      styles.datesModalDay,
                      isBetween
                        ? { backgroundColor: "rgba(0,122,255,0.2)" }
                        : null,
                      isSelected
                        ? { backgroundColor: "#007AFF", borderRadius: 15 }
                        : null,
                    ]}
                    onPress={() => handleDateSelection(day)}
                  >
                    <Text style={styles.datesModalDayText}>{day}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
        <View style={styles.datesModalFooter}>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
            onPress={() => Alert.alert("Exact dates")}
          >
            <Ionicons
              name="radio-button-on"
              size={20}
              color={Colors.dark.blue}
            />
            <Text style={[styles.conditionText, { marginLeft: 10 }]}>
              Exact dates
            </Text>
          </Pressable>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => Alert.alert("+-3 days")}
          >
            <Ionicons
              name="radio-button-off"
              size={20}
              color={Colors.dark.textSecondary}
            />
            <Text style={[styles.conditionText, { marginLeft: 10 }]}>
              +-3 days
            </Text>
          </Pressable>
          <Pressable style={styles.applyButton} onPress={handleApplyDates}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderRoomsGuestsModal = () => (
    <SafeAreaView style={styles.fullContainer}>
      {renderModalHeader("Select rooms and guests", () =>
        setActiveSubModal("none"),
      )}
      <ScrollView style={{ flex: 1 }}>
        <View
          style={[
            styles.roomsModalSection,
            { marginTop: 20, marginHorizontal: 16 },
          ]}
        >
          <View style={styles.roomsCounter}>
            <Text style={styles.roomsCounterLabel}>Rooms</Text>
            <View style={styles.roomsCounterControls}>
              <Pressable
                style={styles.roomsCounterButton}
                onPress={() => setRooms(Math.max(1, rooms - 1))}
              >
                <Text style={styles.roomsCounterButtonText}>-</Text>
              </Pressable>
              <Text style={styles.roomsCounterValue}>{rooms}</Text>
              <Pressable
                style={styles.roomsCounterButton}
                onPress={() => setRooms(rooms + 1)}
              >
                <Text style={styles.roomsCounterButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.roomsCounter}>
            <Text style={styles.roomsCounterLabel}>Adults</Text>
            <View style={styles.roomsCounterControls}>
              <Pressable
                style={styles.roomsCounterButton}
                onPress={() => setAdults(Math.max(1, adults - 1))}
              >
                <Text style={styles.roomsCounterButtonText}>-</Text>
              </Pressable>
              <Text style={styles.roomsCounterValue}>{adults}</Text>
              <Pressable
                style={styles.roomsCounterButton}
                onPress={() => setAdults(adults + 1)}
              >
                <Text style={styles.roomsCounterButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.roomsCounter}>
            <Text style={styles.roomsCounterLabel}>Children</Text>
            <View style={styles.roomsCounterControls}>
              <Pressable
                style={styles.roomsCounterButton}
                onPress={() => setChildren(Math.max(0, children - 1))}
              >
                <Text style={styles.roomsCounterButtonText}>-</Text>
              </Pressable>
              <Text style={styles.roomsCounterValue}>{children}</Text>
              <Pressable
                style={styles.roomsCounterButton}
                onPress={() => setChildren(children + 1)}
              >
                <Text style={styles.roomsCounterButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.roomsModalSection,
            { marginTop: 20, marginHorizontal: 16 },
          ]}
        >
          <Text style={styles.roomsModalSectionTitle}>Do you have pets?</Text>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => Alert.alert("Pet option")}
          >
            <Ionicons
              name="checkbox-outline"
              size={24}
              color={Colors.dark.textSecondary}
            />
            <Text style={[styles.conditionText, { marginLeft: 10 }]}>Yes</Text>
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.roomsGuestsFooter}>
        <Pressable style={styles.applyButton} onPress={handleApplyRooms}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );

  const renderDealsModalContent = () => {
    switch (activeSubModal) {
      case "destination":
        return renderDestinationModal();
      case "dates":
        return renderDatesModal();
      case "rooms":
        return renderRoomsGuestsModal();
      case "none":
      default:
        const checkInDate = selectedDates.checkIn
          ? `Oct ${selectedDates.checkIn} 2025`
          : "Wed, 1 Oct";
        const checkOutDate = selectedDates.checkOut
          ? `Oct ${selectedDates.checkOut} 2025`
          : "Thu, 2 Oct";
        return (
          <SafeAreaView style={styles.fullContainer}>
            <View style={styles.header}>
              <Pressable
                onPress={() => setShowDealsModal(false)}
                style={styles.backButton}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={Colors.dark.text}
                />
              </Pressable>
              <Text style={styles.headerText}>Booking.com</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <ImageBackground
                source={{
                  uri: "https://booking.com/static/content/images/late-escape-deals-hero.jpg",
                }}
                style={styles.heroImage}
                resizeMode="cover"
              >
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroTitle}>Late Escape Deals</Text>
                  <Text style={styles.heroSubtitle}>
                    Squeeze out the last bit of sun with at least 15% off
                  </Text>
                </View>
              </ImageBackground>
              <View style={styles.searchSection}>
                <Pressable
                  style={[styles.searchField, styles.yellowBorder]}
                  onPress={() => setActiveSubModal("destination")}
                >
                  <Ionicons
                    name="search-outline"
                    size={20}
                    color={Colors.dark.icon}
                  />
                  <Text style={styles.searchFieldText}>
                    {selectedDestination}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.searchField}
                  onPress={() => setActiveSubModal("dates")}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={Colors.dark.icon}
                  />
                  <Text style={styles.searchFieldText}>
                    {checkInDate} - {checkOutDate}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.searchField}
                  onPress={() => setActiveSubModal("rooms")}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={Colors.dark.icon}
                  />
                  <Text style={styles.searchFieldText}>
                    {rooms} room{rooms > 1 ? "s" : ""} • {adults} adult
                    {adults > 1 ? "s" : ""} • {children} children
                  </Text>
                </Pressable>
                <Pressable style={styles.searchButton} onPress={handleSearch}>
                  <Text style={styles.searchButtonText}>Search</Text>
                </Pressable>
              </View>
              <View style={styles.conditionsSection}>
                <View style={styles.conditionItem}>
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={Colors.dark.green}
                  />
                  <Text style={styles.conditionText}>
                    Book anytime until Jan 7 2026
                  </Text>
                </View>
                <View style={styles.conditionItem}>
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={Colors.dark.green}
                  />
                  <Text style={styles.conditionText}>
                    Stay between Oct 1 2025 and Jan 7 2026
                  </Text>
                </View>
                <View style={styles.conditionItem}>
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={Colors.dark.green}
                  />
                  <Text style={styles.conditionText}>Save 15% or more</Text>
                </View>
                <Pressable
                  onPress={() => Alert.alert("Conditions apply")}
                  style={{ marginTop: 10 }}
                >
                  <Text
                    style={{
                      color: "#007AFF",
                      fontSize: 16,
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                    }}
                  >
                    Conditions apply
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </SafeAreaView>
        );
    }
  };

  return (
    <SafeAreaView style={styles.fullContainer}>
      <AccountSection title="Discover">
        {items.map((title) => (
          <AccountItem
            key={title}
            icon={
              <Ionicons
                name={itemIcons[title]}
                size={20}
                color={Colors.dark.icon}
              />
            }
            title={title}
            onPress={() => setShowDealsModal(true)}
          />
        ))}
      </AccountSection>
      <Modal visible={showDealsModal} animationType="slide" transparent={false}>
        {renderDealsModalContent()}
      </Modal>
    </SafeAreaView>
  );
}
