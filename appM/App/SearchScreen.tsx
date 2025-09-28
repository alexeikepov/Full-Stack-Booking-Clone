import { AntDesign, Fontisto } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
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

type ModalType =
  | "location"
  | "dates"
  | "guests"
  | "sort"
  | "filter"
  | "map"
  | null;

type StyleProp = ReturnType<typeof createStyles>;

type GuestData = {
  rooms: number;
  adults: number;
  children: number;
  childAges: number[];
  pets: boolean;
};

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  styles: StyleProp;
  selectedLocation?: string;
  setSelectedLocation?: (location: string) => void;
  selectedDates?: { checkIn: Date | null; checkOut: Date | null };
  setSelectedDates?: (dates: {
    checkIn: Date | null;
    checkOut: Date | null;
  }) => void;
  selectedGuests?: GuestData;
  setSelectedGuests?: (guests: GuestData) => void;
  selectedSortOption?: string;
  setSelectedSortOption?: (option: string) => void;
  selectedFilters?: Set<string>;
  setSelectedFilters?: (filters: Set<string>) => void;
  onOpenFilterModal?: () => void;
};

const LocationModal = ({
  isVisible,
  onClose,
  styles,
  selectedLocation = "Enter your destination",
  setSelectedLocation,
}: ModalProps) => {
  const [searchText, setSearchText] = useState("");

  const destinations = [
    "Rome, Italy",
    "Paris, France",
    "London, UK",
    "Barcelona, Spain",
    "Amsterdam, Netherlands",
    "Berlin, Germany",
    "Vienna, Austria",
    "Prague, Czech Republic",
    "Budapest, Hungary",
    "Venice, Italy",
    "Florence, Italy",
    "Milan, Italy",
    "Madrid, Spain",
    "Lisbon, Portugal",
    "Athens, Greece",
    "Santorini, Greece",
    "Istanbul, Turkey",
    "Dubai, UAE",
    "Bangkok, Thailand",
    "Tokyo, Japan",
    "Kyoto, Japan",
    "Seoul, South Korea",
    "Singapore",
    "Hong Kong",
    "Bali, Indonesia",
    "Sydney, Australia",
    "Melbourne, Australia",
    "Auckland, New Zealand",
    "Mumbai, India",
    "New Delhi, India",
    "Goa, India",
    "Cairo, Egypt",
    "Marrakech, Morocco",
    "Cape Town, South Africa",
    "New York, USA",
    "Los Angeles, USA",
    "San Francisco, USA",
    "Las Vegas, USA",
    "Miami, USA",
    "Chicago, USA",
    "Toronto, Canada",
    "Vancouver, Canada",
    "Montreal, Canada",
    "Mexico City, Mexico",
    "Cancun, Mexico",
    "Rio de Janeiro, Brazil",
    "São Paulo, Brazil",
    "Buenos Aires, Argentina",
    "Lima, Peru",
    "Bogotá, Colombia",
  ];

  const filteredDestinations = destinations.filter((destination) =>
    destination.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleDestinationPress = (destination: string) => {
    if (setSelectedLocation) {
      setSelectedLocation(destination);
    }
    onClose();
  };

  if (!isVisible) return null;
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign
            name="arrow-left"
            size={24}
            color={styles.secondaryText.color}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.modalSearchInput}
          placeholder="Enter destinations"
          placeholderTextColor={styles.searchInputText.color}
          value={searchText}
          onChangeText={setSearchText}
          autoFocus={true}
        />
        <ScrollView>
          <Text style={styles.modalTitle}>
            {searchText ? "Search results" : "Popular destinations"}
          </Text>
          {filteredDestinations.map((destination, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDestinationPress(destination)}
              style={styles.modalItemContainer}
            >
              <Text style={styles.modalItem}>{destination}</Text>
            </TouchableOpacity>
          ))}
          {filteredDestinations.length === 0 && (
            <Text style={styles.noResults}>No destinations found</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const DatesModal = ({
  isVisible,
  onClose,
  styles,
  selectedDates,
  setSelectedDates,
}: ModalProps) => {
  const [activeTab, setActiveTab] = useState<"calendar" | "flexible">(
    "calendar",
  );
  const [checkInDate, setCheckInDate] = useState<Date | null>(
    selectedDates?.checkIn || null,
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(
    selectedDates?.checkOut || null,
  );
  const [flexibleDuration, setFlexibleDuration] = useState<
    "weekend" | "week" | "month" | "other"
  >("weekend");
  const [flexibleMonth, setFlexibleMonth] = useState<string>("Oct");

  const generateCalendarMonths = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1,
      );
      const monthName = monthDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      const daysInMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0,
      ).getDate();
      const firstDayOfMonth = monthDate.getDay();

      months.push({
        name: monthName,
        year: monthDate.getFullYear(),
        month: monthDate.getMonth(),
        daysInMonth,
        firstDayOfMonth,
      });
    }
    return months;
  };

  const months = generateCalendarMonths();

  const handleDatePress = (year: number, month: number, day: number) => {
    const selectedDate = new Date(year, month, day);

    if (!checkInDate || (checkInDate && checkOutDate)) {
      // Start new selection
      setCheckInDate(selectedDate);
      setCheckOutDate(null);
    } else if (checkInDate && !checkOutDate) {
      // Set check-out date
      if (selectedDate > checkInDate) {
        setCheckOutDate(selectedDate);
      } else {
        // If selected date is before check-in, make it new check-in
        setCheckInDate(selectedDate);
        setCheckOutDate(null);
      }
    }
  };

  const isDateInRange = (year: number, month: number, day: number) => {
    if (!checkInDate || !checkOutDate) return false;
    const date = new Date(year, month, day);
    return date >= checkInDate && date <= checkOutDate;
  };

  const isDateSelected = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return (
      (checkInDate && date.getTime() === checkInDate.getTime()) ||
      (checkOutDate && date.getTime() === checkOutDate.getTime())
    );
  };

  const handleApply = () => {
    if (
      activeTab === "calendar" &&
      checkInDate &&
      checkOutDate &&
      setSelectedDates
    ) {
      setSelectedDates({ checkIn: checkInDate, checkOut: checkOutDate });
    } else if (activeTab === "flexible" && setSelectedDates) {
      // For flexible dates, we'll set some example dates
      const startDate = new Date(2025, 9, 1); // October 1st
      const endDate = new Date(2025, 9, 7); // October 7th
      setSelectedDates({ checkIn: startDate, checkOut: endDate });
    }
    onClose();
  };

  const renderCalendarView = () => (
    <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
      {months.map((monthData, monthIndex) => (
        <View key={monthIndex} style={{ marginBottom: 30 }}>
          <Text style={styles.monthHeader}>{monthData.name}</Text>
          <View style={styles.calendarGrid}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <Text key={day} style={styles.calendarDayHeader}>
                {day}
              </Text>
            ))}
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: monthData.firstDayOfMonth }, (_, index) => (
              <View key={`empty-${index}`} style={styles.calendarDay} />
            ))}
            {/* Days of the month */}
            {Array.from({ length: monthData.daysInMonth }, (_, index) => {
              const day = index + 1;
              const isSelected = isDateSelected(
                monthData.year,
                monthData.month,
                day,
              );
              const inRange = isDateInRange(
                monthData.year,
                monthData.month,
                day,
              );

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.calendarDay,
                    isSelected && styles.selectedDay,
                    inRange && !isSelected && styles.rangeDay,
                  ]}
                  onPress={() =>
                    handleDatePress(monthData.year, monthData.month, day)
                  }
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      isSelected && styles.selectedDayText,
                      inRange && !isSelected && styles.rangeDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderFlexibleView = () => (
    <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
      <Text style={styles.flexibleSectionTitle}>
        How long do you want to stay?
      </Text>
      <View style={styles.durationRow}>
        {[
          { key: "weekend", label: "Weekend" },
          { key: "week", label: "Week" },
          { key: "month", label: "Month" },
          { key: "other", label: "Other" },
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.durationButton,
              flexibleDuration === option.key && styles.durationButtonActive,
            ]}
            onPress={() => setFlexibleDuration(option.key as any)}
          >
            <Text
              style={[
                styles.durationButtonText,
                flexibleDuration === option.key &&
                  styles.durationButtonTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.flexibleSectionTitle}>When do you want to go?</Text>
      <Text style={styles.flexibleSubtitle}>Select up to 3 months</Text>

      <View style={styles.monthsRow}>
        {["Sep", "Oct", "Nov", "Dec"].map((month) => (
          <TouchableOpacity
            key={month}
            style={[
              styles.monthButton,
              flexibleMonth === month && styles.monthButtonActive,
            ]}
            onPress={() => setFlexibleMonth(month)}
          >
            <AntDesign
              name="calendar"
              size={24}
              color={
                flexibleMonth === month
                  ? styles.monthButtonTextActive.color
                  : styles.monthButtonText.color
              }
            />
            <Text
              style={[
                styles.monthButtonText,
                flexibleMonth === month && styles.monthButtonTextActive,
              ]}
            >
              {month}
            </Text>
            <Text
              style={[
                styles.monthButtonYear,
                flexibleMonth === month && styles.monthButtonTextActive,
              ]}
            >
              2025
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.flexibleResult}>
        <Text style={styles.flexibleResultText}>
          {flexibleDuration.charAt(0).toUpperCase() + flexibleDuration.slice(1)}{" "}
          in {flexibleMonth}
        </Text>
      </View>
    </ScrollView>
  );

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign
            name="arrow-left"
            size={24}
            color={styles.secondaryText.color}
          />
        </TouchableOpacity>

        <View style={styles.datesHeader}>
          <Text style={styles.datesHeaderText}>Select dates</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "calendar" && styles.activeTab]}
            onPress={() => setActiveTab("calendar")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "calendar" && styles.activeTabText,
              ]}
            >
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "flexible" && styles.activeTab]}
            onPress={() => setActiveTab("flexible")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "flexible" && styles.activeTabText,
              ]}
            >
              I am flexible
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "calendar" ? renderCalendarView() : renderFlexibleView()}

        {checkInDate && checkOutDate && activeTab === "calendar" && (
          <View style={styles.selectedDatesInfo}>
            <Text style={styles.selectedDatesText}>
              {checkInDate.toDateString()} - {checkOutDate.toDateString()}
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Select dates</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const GuestsModal = ({
  isVisible,
  onClose,
  styles,
  selectedGuests = {
    rooms: 1,
    adults: 2,
    children: 0,
    childAges: [],
    pets: false,
  },
  setSelectedGuests,
}: ModalProps) => {
  const [rooms, setRooms] = useState(selectedGuests.rooms);
  const [adults, setAdults] = useState(selectedGuests.adults);
  const [children, setChildren] = useState(selectedGuests.children);
  const [childAges, setChildAges] = useState(selectedGuests.childAges);
  const [pets, setPets] = useState(selectedGuests.pets);
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number>(0);

  const handleRoomsChange = (increment: boolean) => {
    const newValue = increment ? rooms + 1 : Math.max(1, rooms - 1);
    setRooms(newValue);
  };

  const handleAdultsChange = (increment: boolean) => {
    const newValue = increment ? adults + 1 : Math.max(1, adults - 1);
    setAdults(newValue);
  };

  const handleChildrenChange = (increment: boolean) => {
    const newValue = increment ? children + 1 : Math.max(0, children - 1);
    setChildren(newValue);

    // Update child ages array
    if (increment) {
      setChildAges([...childAges, 0]);
    } else if (newValue < children) {
      setChildAges(childAges.slice(0, newValue));
    }
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const newAges = [...childAges];
    newAges[index] = age;
    setChildAges(newAges);
  };

  const openAgeModal = (childIndex: number) => {
    setSelectedChildIndex(childIndex);
    setAgeModalVisible(true);
  };

  const handleAgeSelect = (age: number) => {
    if (age === -1) return; // "Select" option, do nothing
    handleChildAgeChange(selectedChildIndex, age);
  };

  const getAgeDisplayText = (age: number | undefined) => {
    if (age === undefined) return "Select age";
    if (age === 0) return "< 1 year old";
    return `${age} year${age === 1 ? "" : "s"} old`;
  };

  const handleApply = () => {
    if (setSelectedGuests) {
      setSelectedGuests({
        rooms,
        adults,
        children,
        childAges,
        pets,
      });
    }
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AntDesign
            name="close"
            size={24}
            color={styles.secondaryText.color}
          />
        </TouchableOpacity>

        <ScrollView>
          <Text style={styles.modalHeaderTitle}>Select rooms and guests</Text>

          {/* Rooms */}
          <View style={styles.guestRow}>
            <Text style={styles.guestLabel}>Rooms</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[
                  styles.stepperButton,
                  rooms <= 1 && styles.stepperButtonDisabled,
                ]}
                onPress={() => handleRoomsChange(false)}
                disabled={rooms <= 1}
              >
                <AntDesign
                  name="minus"
                  size={16}
                  color={
                    rooms <= 1
                      ? styles.stepperButtonTextDisabled.color
                      : styles.stepperButtonText.color
                  }
                />
              </TouchableOpacity>
              <Text style={styles.stepperText}>{rooms}</Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => handleRoomsChange(true)}
              >
                <AntDesign
                  name="plus"
                  size={16}
                  color={styles.stepperButtonText.color}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Adults */}
          <View style={styles.guestRow}>
            <Text style={styles.guestLabel}>Adults</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[
                  styles.stepperButton,
                  adults <= 1 && styles.stepperButtonDisabled,
                ]}
                onPress={() => handleAdultsChange(false)}
                disabled={adults <= 1}
              >
                <AntDesign
                  name="minus"
                  size={16}
                  color={
                    adults <= 1
                      ? styles.stepperButtonTextDisabled.color
                      : styles.stepperButtonText.color
                  }
                />
              </TouchableOpacity>
              <Text style={styles.stepperText}>{adults}</Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => handleAdultsChange(true)}
              >
                <AntDesign
                  name="plus"
                  size={16}
                  color={styles.stepperButtonText.color}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Children */}
          <View style={styles.guestRow}>
            <View style={styles.guestLabelContainer}>
              <Text style={styles.guestLabel}>Children</Text>
              <Text style={styles.guestSubLabel}>0 – 17 years old</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[
                  styles.stepperButton,
                  children <= 0 && styles.stepperButtonDisabled,
                ]}
                onPress={() => handleChildrenChange(false)}
                disabled={children <= 0}
              >
                <AntDesign
                  name="minus"
                  size={16}
                  color={
                    children <= 0
                      ? styles.stepperButtonTextDisabled.color
                      : styles.stepperButtonText.color
                  }
                />
              </TouchableOpacity>
              <Text style={styles.stepperText}>{children}</Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => handleChildrenChange(true)}
              >
                <AntDesign
                  name="plus"
                  size={16}
                  color={styles.stepperButtonText.color}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.guestRow}>
            <Text style={styles.guestLabel}>Traveling with pets?</Text>
            <TouchableOpacity
              style={[styles.toggleSwitch, pets && styles.toggleSwitchActive]}
              onPress={() => setPets(!pets)}
            >
              <View
                style={[styles.toggleHandle, pets && styles.toggleHandleActive]}
              />
            </TouchableOpacity>
          </View>

          {children > 0 && (
            <View style={styles.childAgesSection}>
              <Text style={styles.childAgesSectionTitle}>
                Age of children at check-out
              </Text>
              <Text style={styles.childAgesSectionSubtitle}>
                Add the age of each child to get the best match for beds, room
                size, and special prices.
              </Text>

              {Array.from({ length: children }, (_, index) => (
                <View key={index} style={styles.childAgeRow}>
                  <Text style={styles.childAgeLabel}>
                    Child {index + 1}
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.ageDropdownContainer}
                    onPress={() => openAgeModal(index)}
                  >
                    <Text style={styles.ageDropdownText}>
                      {getAgeDisplayText(childAges[index])}
                    </Text>
                    <AntDesign
                      name="down"
                      size={16}
                      color={styles.ageDropdownArrow.color}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>

        <AgeSelectionModal
          isVisible={ageModalVisible}
          onClose={() => setAgeModalVisible(false)}
          onSelectAge={handleAgeSelect}
          styles={styles}
          childNumber={selectedChildIndex + 1}
        />
      </View>
    </Modal>
  );
};

const AgeSelectionModal = ({
  isVisible,
  onClose,
  onSelectAge,
  styles,
  childNumber,
}: {
  isVisible: boolean;
  onClose: () => void;
  onSelectAge: (age: number) => void;
  styles: StyleProp;
  childNumber: number;
}) => {
  const handleAgeSelect = (age: number) => {
    onSelectAge(age);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.ageModalContainer}>
        <View style={styles.ageModalHeader}>
          <Text style={styles.ageModalTitle}>Child {childNumber}</Text>
        </View>

        <ScrollView style={styles.ageList}>
          <TouchableOpacity
            style={styles.ageItem}
            onPress={() => handleAgeSelect(-1)}
          >
            <Text style={styles.ageItemText}>Select age</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ageItem}
            onPress={() => handleAgeSelect(0)}
          >
            <Text style={styles.ageItemText}>{"< 1 year old"}</Text>
          </TouchableOpacity>
          {Array.from({ length: 17 }, (_, i) => i + 1).map((age) => (
            <TouchableOpacity
              key={age}
              style={styles.ageItem}
              onPress={() => handleAgeSelect(age)}
            >
              <Text style={styles.ageItemText}>
                {age} year{age === 1 ? "" : "s"} old
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity onPress={onClose} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors, theme: string) =>
  StyleSheet.create({
    searchFormBorder: {
      borderWidth: 4,
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

    modalContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    messageImage: { width: 200, height: 200, resizeMode: "contain" },

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
    // Modal styles
    searchInput: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "transparent",
      borderRadius: 0,
      paddingHorizontal: 0,
      paddingVertical: 0,
      marginBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: colors.inputBackground,
      minHeight: 44,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInputText: {
      color: colors.text,
      fontSize: 16,
    },
    modalContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.background,
      zIndex: 10,
      paddingTop: 50,
    },
    closeButton: {
      padding: 15,
      color: colors.text,
    },
    modalSearchInput: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 15,
      margin: 15,
      color: colors.text,
      fontSize: 16,
      borderWidth: 2,
      borderColor: "#FFD700",
    },
    modalTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginHorizontal: 15,
      marginTop: 10,
    },
    modalItem: {
      color: colors.text,
      fontSize: 16,
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    modalItemContainer: {
      backgroundColor: colors.card,
    },
    noResults: {
      color: colors.textSecondary,
      fontSize: 16,
      padding: 20,
      textAlign: "center",
      fontStyle: "italic",
    },
    tabContainer: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
      marginHorizontal: 15,
    },
    tab: {
      flex: 1,
      paddingVertical: 15,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    activeTab: {
      borderBottomColor: colors.button,
    },
    tabText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.button,
      fontWeight: "bold",
    },
    selectedDay: {
      backgroundColor: colors.button,
    },
    selectedDayText: {
      color: colors.background,
      fontWeight: "bold",
    },
    rangeDay: {
      backgroundColor: `${colors.button}20`,
    },
    rangeDayText: {
      color: colors.button,
    },
    selectedDatesInfo: {
      backgroundColor: colors.card,
      padding: 15,
      marginHorizontal: 15,
      marginBottom: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.button,
    },
    selectedDatesText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    flexibleSectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 25,
      marginBottom: 15,
    },
    flexibleSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 15,
    },
    durationRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 20,
    },
    durationButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: colors.separator,
      backgroundColor: colors.card,
    },
    durationButtonActive: {
      borderColor: colors.button,
      backgroundColor: colors.button,
    },
    durationButtonText: {
      color: colors.text,
      fontSize: 16,
    },
    durationButtonTextActive: {
      color: colors.background,
      fontWeight: "bold",
    },
    monthsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 15,
      marginBottom: 30,
    },
    monthButton: {
      flex: 1,
      minWidth: "22%",
      aspectRatio: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.separator,
      alignItems: "center",
      justifyContent: "center",
      padding: 15,
    },
    monthButtonActive: {
      borderColor: colors.button,
      backgroundColor: colors.button,
    },
    monthButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 5,
    },
    monthButtonTextActive: {
      color: colors.background,
    },
    monthButtonYear: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 2,
    },
    flexibleResult: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 30,
    },
    flexibleResultText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    datesHeader: {
      alignItems: "center",
      paddingVertical: 15,
    },
    datesHeaderText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    monthHeader: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 15,
    },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    calendarDayHeader: {
      width: "14%",
      textAlign: "center",
      color: colors.textSecondary,
      marginBottom: 10,
      fontSize: 14,
      fontWeight: "600",
    },
    calendarDay: {
      width: "14%",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      minHeight: 40,
      borderRadius: 20,
    },
    calendarDayText: {
      color: colors.text,
      fontSize: 16,
    },
    applyButton: {
      backgroundColor: colors.button,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      margin: 15,
    },
    applyButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
    modalHeaderTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "bold",
      padding: 15,
    },
    guestRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    guestLabel: {
      color: colors.text,
      fontSize: 18,
    },
    stepper: {
      flexDirection: "row",
      alignItems: "center",
    },
    stepperButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.button,
      padding: 8,
      borderRadius: 4,
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    stepperButtonDisabled: {
      borderColor: colors.separator,
      backgroundColor: colors.card,
    },
    stepperButtonText: {
      color: colors.button,
    },
    stepperButtonTextDisabled: {
      color: colors.separator,
    },
    stepperText: {
      color: colors.text,
      fontSize: 18,
      marginHorizontal: 20,
      minWidth: 30,
      textAlign: "center",
    },
    guestLabelContainer: {
      flex: 1,
    },
    guestSubLabel: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 2,
    },
    toggleSwitch: {
      width: 50,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.separator,
      padding: 2,
      justifyContent: "center",
    },
    toggleSwitchActive: {
      backgroundColor: colors.button,
    },
    toggleHandle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.background,
      alignSelf: "flex-start",
    },
    toggleHandleActive: {
      alignSelf: "flex-end",
    },
    childAgesSection: {
      marginTop: 20,
      paddingHorizontal: 15,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: colors.separator,
    },
    childAgesSectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    childAgesSectionSubtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 20,
      lineHeight: 20,
    },
    childAgeRow: {
      marginBottom: 20,
    },
    childAgeLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 10,
    },
    required: {
      color: colors.accent,
    },
    ageDropdownContainer: {
      borderWidth: 1,
      borderColor: colors.separator,
      borderRadius: 8,
      padding: 15,
      backgroundColor: colors.card,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    ageDropdownText: {
      color: colors.textSecondary,
      fontSize: 16,
      marginBottom: 10,
    },
    ageDropdownArrow: {
      color: colors.textSecondary,
    },
    ageModalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    ageModalHeader: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
      alignItems: "center",
    },
    ageModalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    ageList: {
      flex: 1,
    },
    ageItem: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
      backgroundColor: colors.card,
    },
    ageItemText: {
      fontSize: 16,
      color: colors.text,
    },
    secondaryText: {
      color: colors.textSecondary,
    },
  });
export default function App({ onBack }: HelpSupportSectionProps) {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [isDirectHelpCenterOpen, setIsDirectHelpCenterOpen] = useState(false);
  const [showApartmentsList, setShowApartmentsList] = useState(false);
  const [activeHelpTab, setActiveHelpTab] = useState("Stays");
  const [openHelpQuestionIndex, setOpenHelpQuestionIndex] = useState<
    number | null
  >(null);

  // Modal state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedLocation, setSelectedLocation] = useState(
    "Enter your destination",
  );
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({ checkIn: null, checkOut: null });
  const [selectedGuests, setSelectedGuests] = useState<GuestData>({
    rooms: 1,
    adults: 2,
    children: 0,
    childAges: [],
    pets: false,
  });

  // State to store search parameters for PropertyListScreen
  const [searchParamsForPropertyList, setSearchParamsForPropertyList] =
    useState<{
      location: string;
      dates: { checkIn: Date | null; checkOut: Date | null };
      guests: GuestData;
    } | null>(null);
  // When true, instruct PropertyListScreen to open its "Edit your search" section
  const [openExpandedSearch, setOpenExpandedSearch] = useState(false);

  const insets = useSafeAreaInsets();
  const openMessages = () => setShowMessagesModal(true);
  const closeMessages = () => setShowMessagesModal(false);
  const openNotifications = () => setShowNotificationsModal(true);
  const closeNotifications = () => setShowNotificationsModal(false);
  const closeHelpCenter = () => {
    setIsHelpCenterOpen(false);
    openMessages();
  };
  const openDirectHelpCenter = () => {
    setIsDirectHelpCenterOpen(true);
    closeMessages();
  };
  const closeDirectHelpCenter = () => {
    setIsDirectHelpCenterOpen(false);
  };

  // Modal handlers
  const handleLocationModalClose = () => setModalType(null);
  const handleDatesModalClose = () => setModalType(null);
  const handleGuestsModalClose = () => setModalType(null);

  // Format functions for display
  const formatDates = () => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      const checkIn = selectedDates.checkIn.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const checkOut = selectedDates.checkOut.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${checkIn} - ${checkOut}`;
    }
    return "Select dates";
  };

  const formatGuests = () => {
    const { rooms, adults, children } = selectedGuests;
    // Check if it's still the default values
    if (rooms === 1 && adults === 2 && children === 0) {
      return "Rooms & guests";
    }

    let result = `${rooms} room${rooms > 1 ? "s" : ""} · ${adults} adult${
      adults > 1 ? "s" : ""
    }`;
    if (children > 0) {
      result += ` · ${children} child${children > 1 ? "ren" : ""}`;
    }
    return result;
  };

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

  const handleSwipeGesture = (event: any) => {
    const { translationX, velocityX, state } = event.nativeEvent;

    if (state === State.END) {
      // If swiped right with enough distance or velocity, close the overlay
      if (translationX > 100 || velocityX > 500) {
        setShowApartmentsList(false);
      }
    }
  };

  // Helper functions to parse card data
  const parseDateString = (dateString: string) => {
    // Parse strings like "26–28 Sep", "15–18 Oct", etc.
    const parts = dateString.split(", ")[0]; // Remove ", 2 adults" part
    const [dateRange, monthStr] = parts.split(" ");
    const [startDay, endDay] = dateRange.split("–");

    const currentYear = new Date().getFullYear();
    const monthMap: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const month = monthMap[monthStr];
    const checkIn = new Date(currentYear, month, parseInt(startDay));
    const checkOut = new Date(currentYear, month, parseInt(endDay));

    return { checkIn, checkOut };
  };

  const parseGuestString = (guestString: string): GuestData => {
    // Parse strings like "2 adults", "1 adult", etc.
    const adultMatch = guestString.match(/(\d+)\s+adult/);
    const adults = adultMatch ? parseInt(adultMatch[1]) : 2;

    return {
      rooms: 1,
      adults: adults,
      children: 0,
      childAges: [],
      pets: false,
    };
  };

  const handleCardPress = (
    location: string,
    dateString: string,
    guestString: string,
  ) => {
    const parsedDates = parseDateString(dateString);
    const parsedGuests = parseGuestString(guestString);

    setSearchParamsForPropertyList({
      location: location,
      dates: parsedDates,
      guests: parsedGuests,
    });
    setShowApartmentsList(true);
  };

  const handleLocationOnlyPress = (location: string) => {
    setSearchParamsForPropertyList({
      location: location,
      dates: selectedDates,
      guests: selectedGuests,
    });
    setShowApartmentsList(true);
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
    const [searchSubmitting, setSearchSubmitting] = useState(false);
    const tabIcons = {
      Stays: "bed-outline",
      "Car rental": "car-outline",
      Flights: "airplane-outline",
      Taxi: "car-sport-outline",
      Attractions: "sparkles-outline",
    };
    const renderSearchForm = () => {
      const handleSearch = async () => {
        setSearchSubmitting(true);
        try {
          // simulate processing delay
          await new Promise((res) => setTimeout(res, 1000));

          // Store the current search parameters
          setSearchParamsForPropertyList({
            location: selectedLocation,
            dates: selectedDates,
            guests: selectedGuests,
          });
          // Request the property list to open its expanded "Edit your search" section
          setOpenExpandedSearch(true);
          setShowApartmentsList(true);
        } finally {
          setSearchSubmitting(false);
        }
      };
      switch (activeTab) {
        case "Stays":
          return (
            <View style={styles.searchFormBorder}>
              <TouchableOpacity
                style={styles.searchInput}
                onPress={() => setModalType("location")}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.text}
                  style={styles.searchIcon}
                />
                <Text style={styles.searchInputText}>{selectedLocation}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.searchInput}
                onPress={() => setModalType("dates")}
              >
                <Fontisto
                  name="calendar"
                  size={18}
                  color={colors.text}
                  style={styles.searchIcon}
                />
                <Text style={styles.searchInputText}>{formatDates()}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.searchInput}
                onPress={() => setModalType("guests")}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={colors.text}
                  style={styles.searchIcon}
                />
                <Text style={styles.searchInputText}>{formatGuests()}</Text>
              </TouchableOpacity>

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
                disabled={searchSubmitting}
              >
                {searchSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Search
                  </Text>
                )}
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
              contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
            >
              <View style={{ flexDirection: "column", gap: 12 }}>
                {/* First Row */}
                <TouchableOpacity
                  onPress={() =>
                    handleCardPress(
                      "Rome, Italy",
                      "26–28 Sep, 2 adults",
                      "2 adults",
                    )
                  }
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 16,
                    width: 320,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Image
                    source={require("./../assets/images/rome.png")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.text,
                        marginBottom: 4,
                      }}
                    >
                      Rome
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                      }}
                    >
                      26–28 Sep, 2 adults
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#007AFF",
                      borderRadius: 4,
                      padding: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Ionicons name="bed-outline" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>

                {/* Second Row */}
                <TouchableOpacity
                  onPress={() =>
                    handleCardPress(
                      "Dubai, UAE",
                      "26–28 Sep, 2 adults",
                      "2 adults",
                    )
                  }
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 16,
                    width: 320,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Image
                    source={require("./../assets/images/dubai.png")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.text,
                        marginBottom: 4,
                      }}
                    >
                      Dubai
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                      }}
                    >
                      26–28 Sep, 2 adults
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#007AFF",
                      borderRadius: 4,
                      padding: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Ionicons name="bed-outline" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Paris Cards */}
              <View style={{ flexDirection: "column", gap: 12 }}>
                <TouchableOpacity
                  onPress={() =>
                    handleCardPress(
                      "Paris, France",
                      "15–18 Oct, 2 adults",
                      "2 adults",
                    )
                  }
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 16,
                    width: 320,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Image
                    source={require("./../assets/images/paris.png")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.text,
                        marginBottom: 4,
                      }}
                    >
                      Paris
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                      }}
                    >
                      15–18 Oct, 2 adults
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#007AFF",
                      borderRadius: 4,
                      padding: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Ionicons name="bed-outline" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    handleCardPress(
                      "London, UK",
                      "22–25 Oct, 2 adults",
                      "2 adults",
                    )
                  }
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 16,
                    width: 320,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Image
                    source={require("./../assets/images/london.png")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.text,
                        marginBottom: 4,
                      }}
                    >
                      London
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                      }}
                    >
                      22–25 Oct, 2 adults
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#007AFF",
                      borderRadius: 4,
                      padding: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Ionicons name="bed-outline" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Barcelona Cards */}
              <View style={{ flexDirection: "column", gap: 12 }}>
                <TouchableOpacity
                  onPress={() =>
                    handleCardPress(
                      "Barcelona, Spain",
                      "5–8 Nov, 2 adults",
                      "2 adults",
                    )
                  }
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 16,
                    width: 320,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Image
                    source={require("./../assets/images/barcelona.png")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.text,
                        marginBottom: 4,
                      }}
                    >
                      Barcelona
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                      }}
                    >
                      5–8 Nov, 2 adults
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#007AFF",
                      borderRadius: 4,
                      padding: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Ionicons name="bed-outline" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    handleCardPress(
                      "Amsterdam, Netherlands",
                      "12–15 Nov, 2 adults",
                      "2 adults",
                    )
                  }
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 16,
                    width: 320,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Image
                    source={require("./../assets/images/amsterdam.png")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.text,
                        marginBottom: 4,
                      }}
                    >
                      Amsterdam
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                      }}
                    >
                      12–15 Nov, 2 adults
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#007AFF",
                      borderRadius: 4,
                      padding: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Ionicons name="bed-outline" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Tokyo Cards */}
              <View style={{ flexDirection: "column", gap: 12 }}>
                <TouchableOpacity
                  onPress={() =>
                    handleCardPress(
                      "Tokyo, Japan",
                      "20–24 Nov, 2 adults",
                      "2 adults",
                    )
                  }
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 16,
                    width: 320,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Image
                    source={require("./../assets/images/tokyo.png")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.text,
                        marginBottom: 4,
                      }}
                    >
                      Tokyo
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                      }}
                    >
                      20–24 Nov, 2 adults
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#007AFF",
                      borderRadius: 4,
                      padding: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Ionicons name="bed-outline" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    handleCardPress(
                      "New York, USA",
                      "1–5 Dec, 2 adults",
                      "2 adults",
                    )
                  }
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    padding: 16,
                    width: 320,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Image
                    source={require("./../assets/images/new-york.png")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.text,
                        marginBottom: 4,
                      }}
                    >
                      New York
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                      }}
                    >
                      1–5 Dec, 2 adults
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#007AFF",
                      borderRadius: 4,
                      padding: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Ionicons name="bed-outline" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>
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
                    Genius{"\n"}Crazy, you will be{"\n"}upgraded to Level 2 on
                    {"\n"}Oct 1 2025!
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
                  source={require("./../assets/images/offers1.png")}
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
                      color: "#FFFFFF",
                      textShadowColor: "rgba(0,0,0,0.8)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 3,
                    }}
                  >
                    Quick escape, quality time
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#F5F5F5",
                      textShadowColor: "rgba(0,0,0,0.7)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    Save up to 20% with a Getaway Deal
                  </Text>
                  <Text
                    style={{
                      color: "#FFD700",
                      marginTop: 4,
                      textShadowColor: "rgba(0,0,0,0.7)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
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
                  source={require("./../assets/images/offers2.png")}
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
                      color: "#FFFFFF",
                      textShadowColor: "rgba(0,0,0,0.8)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 3,
                    }}
                  >
                    20% off hotel bookings
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#F5F5F5",
                      textShadowColor: "rgba(0,0,0,0.7)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    Book now and get a great discount
                  </Text>
                  <Text
                    style={{
                      color: "#FFD700",
                      marginTop: 4,
                      textShadowColor: "rgba(0,0,0,0.7)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
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
                  source={require("./../assets/images/offers3.png")}
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
                      color: "#FFFFFF",
                      textShadowColor: "rgba(0,0,0,0.8)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 3,
                    }}
                  >
                    Free breakfast included
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#F5F5F5",
                      textShadowColor: "rgba(0,0,0,0.7)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    Enjoy complimentary breakfast with your stay
                  </Text>
                  <Text
                    style={{
                      color: "#FFD700",
                      marginTop: 4,
                      textShadowColor: "rgba(0,0,0,0.7)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
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
                  source={require("./../assets/images/offers4.png")}
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
                      color: "#FFFFFF",
                      textShadowColor: "rgba(0,0,0,0.8)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 3,
                    }}
                  >
                    Kids stay free
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#F5F5F5",
                      textShadowColor: "rgba(0,0,0,0.7)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    Special family rates available
                  </Text>
                  <Text
                    style={{
                      color: "#FFD700",
                      marginTop: 4,
                      textShadowColor: "rgba(0,0,0,0.7)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
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
                  source={require("./../assets/images/offers5.png")}
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
                      color: "#FFFFFF",
                      textShadowColor: "rgba(0,0,0,0.8)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 3,
                    }}
                  >
                    Free cancellation
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#F5F5F5",
                      textShadowColor: "rgba(0,0,0,0.7)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    Cancel anytime for free on select deals
                  </Text>
                  <Text
                    style={{
                      color: "#FFD700",
                      marginTop: 4,
                      textShadowColor: "rgba(0,0,0,0.7)",
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
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
                  backgroundColor:
                    theme === "light" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.7)",
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
                    Sorry, these amazing offers are not relevant to you
                  </Text>
                  <Text
                    style={{
                      color: colors.text,
                      marginTop: 10,
                      textAlign: "center",
                    }}
                  >
                    You are only at level 1 genius. Purchase more properties to
                    progress and get all these awsome deals.
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
              <TouchableOpacity
                onPress={() => handleLocationOnlyPress("Paris, France")}
              >
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
                    source={require("./../assets/images/paris.png")}
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
              <TouchableOpacity
                onPress={() => handleLocationOnlyPress("New York, USA")}
              >
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
                    source={require("./../assets/images/new-york.png")}
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
              <TouchableOpacity
                onPress={() => handleLocationOnlyPress("Tokyo, Japan")}
              >
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
                    source={require("./../assets/images/tokyo.png")}
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
              <TouchableOpacity
                onPress={() => handleLocationOnlyPress("London, UK")}
              >
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
                    source={require("./../assets/images/london.png")}
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
              <TouchableOpacity
                onPress={() =>
                  handleLocationOnlyPress("Amsterdam, Netherlands")
                }
              >
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
                    source={require("./../assets/images/amsterdam.png")}
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
                    Amsterdam
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
            <PropertyList
              onBack={() => setShowApartmentsList(false)}
              searchParams={searchParamsForPropertyList || undefined}
              openExpandedSearch={openExpandedSearch}
              onOpened={() => setOpenExpandedSearch(false)}
            />
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
            <TouchableOpacity onPress={openDirectHelpCenter}>
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Image
              source={
                theme === "light"
                  ? require("./../assets/images/man-white.jpg")
                  : require("./../assets/images/messages-man.png")
              }
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
          <HelpSupportSection />
        </SafeAreaView>
      </Modal>
      <Modal
        visible={isDirectHelpCenterOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={closeDirectHelpCenter}
      >
        <SafeAreaView
          style={[styles.modalContainer, { paddingTop: insets.top }]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={closeDirectHelpCenter}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderText}>Help Center</Text>
            <View style={{ width: 32 }} />
          </View>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: insets.bottom + 20,
            }}
          >
            <View style={{ paddingTop: 16 }}>
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 8,
                  marginHorizontal: 16,
                  marginTop: 20,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color="#FFD700"
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    flex: 1,
                    lineHeight: 20,
                  }}
                >
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
                <Text style={styles.sectionTitle}>
                  Welcome to the Help Center
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginTop: -10,
                    marginBottom: 10,
                  }}
                >
                  We are available 24 hours a day
                </Text>
                <Pressable
                  style={{
                    backgroundColor: "#007AFF",
                    borderRadius: 8,
                    paddingVertical: 16,
                    alignItems: "center",
                    marginTop: 20,
                  }}
                  onPress={() =>
                    Linking.openURL(
                      "https://www.booking.com/customer-service.html",
                    )
                  }
                >
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                  >
                    Get help with a booking
                  </Text>
                </Pressable>
              </View>
              <Text style={[styles.sectionTitle, { marginTop: 0 }]}>
                Frequently asked questions
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  marginTop: 20,
                }}
              >
                {Object.keys(faqData).map((tab) => (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveHelpTab(tab)}
                    style={{
                      alignItems: "center",
                      paddingHorizontal: 10,
                      paddingBottom: 5,
                      borderBottomWidth: activeHelpTab === tab ? 2 : 0,
                      borderBottomColor:
                        activeHelpTab === tab ? "#007AFF" : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          activeHelpTab === tab
                            ? colors.text
                            : colors.textSecondary,
                        fontSize: 14,
                      }}
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
                {faqData[activeHelpTab]?.map((item, index) => (
                  <Pressable
                    key={index}
                    style={{
                      flexDirection: "column",
                      padding: 16,
                      borderBottomWidth:
                        index === faqData[activeHelpTab].length - 1 ? 0 : 1,
                      borderBottomColor: colors.card,
                    }}
                    onPress={() => {
                      setOpenHelpQuestionIndex(
                        openHelpQuestionIndex === index ? null : index,
                      );
                    }}
                  >
                    <Text style={{ fontSize: 16, color: colors.text }}>
                      {item.question}
                    </Text>
                    {openHelpQuestionIndex === index && (
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                          marginTop: 8,
                        }}
                      >
                        {item.answer}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal Components */}
      <LocationModal
        isVisible={modalType === "location"}
        onClose={handleLocationModalClose}
        styles={styles}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
      <DatesModal
        isVisible={modalType === "dates"}
        onClose={handleDatesModalClose}
        styles={styles}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />
      <GuestsModal
        isVisible={modalType === "guests"}
        onClose={handleGuestsModalClose}
        styles={styles}
        selectedGuests={selectedGuests}
        setSelectedGuests={setSelectedGuests}
      />
    </View>
  );
}
