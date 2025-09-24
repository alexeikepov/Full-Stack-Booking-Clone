import { AntDesign, Fontisto, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import PropertyCard, { Property } from "../components/PropertyCard";
import { useTheme } from "../hooks/ThemeContext";
import { RootStackParamList } from "../types/navigation";
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
  selectedLocation = "Rome",
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

          {/* Traveling with pets */}
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

          {/* Child ages section */}
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
            <Text style={styles.ageItemText}>Select</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ageItem}
            onPress={() => handleAgeSelect(0)}
          >
            <Text style={styles.ageItemText}>{"< 1 year old"}</Text>
          </TouchableOpacity>
          {Array.from({ length: 17 }, (_, index) => {
            const age = index + 1;
            return (
              <TouchableOpacity
                key={age}
                style={styles.ageItem}
                onPress={() => handleAgeSelect(age)}
              >
                <Text style={styles.ageItemText}>
                  {age} year{age === 1 ? "" : "s"} old
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity onPress={onClose} style={styles.ageModalDoneButton}>
          <Text style={styles.ageModalDoneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const MapModal = ({
  isVisible,
  onClose,
  styles,
  onOpenFilterModal,
}: ModalProps) => {
  const [locationInput, setLocationInput] = useState("Rome, Italy");

  if (!isVisible) return null;

  // Rome coordinates
  const romeRegion = {
    latitude: 41.9028,
    longitude: 12.4964,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Some example hotel/property markers in Rome
  const propertyMarkers = [
    {
      id: 1,
      coordinate: { latitude: 41.9028, longitude: 12.4964 },
      title: "Hotel de Russie",
      description: "Luxury hotel near Spanish Steps",
    },
    {
      id: 2,
      coordinate: { latitude: 41.9109, longitude: 12.4818 },
      title: "Hotel Artemide",
      description: "4-star hotel near Termini Station",
    },
    {
      id: 3,
      coordinate: { latitude: 41.8986, longitude: 12.4769 },
      title: "The First Roma Arte",
      description: "Boutique hotel near Colosseum",
    },
    {
      id: 4,
      coordinate: { latitude: 41.9056, longitude: 12.4823 },
      title: "Grand Hotel Plaza",
      description: "Historic hotel near Trevi Fountain",
    },
    {
      id: 5,
      coordinate: { latitude: 41.8919, longitude: 12.4866 },
      title: "Hotel Colosseum",
      description: "Budget-friendly hotel near Colosseum",
    },
  ];

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
        <View style={styles.mapTopHeader}>
          <TouchableOpacity onPress={onClose} style={styles.mapCloseButton}>
            <AntDesign
              name="arrow-left"
              size={24}
              color={styles.secondaryText.color}
            />
          </TouchableOpacity>
          <View style={styles.mapLocationInputContainer}>
            <TextInput
              style={styles.mapLocationInput}
              value={locationInput}
              onChangeText={setLocationInput}
              placeholder="Enter location..."
              placeholderTextColor={styles.secondaryText.color}
            />
            <AntDesign
              name="search"
              size={18}
              color={styles.secondaryText.color}
              style={styles.mapLocationInputIcon}
            />
          </View>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.mapImage}
            initialRegion={romeRegion}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={false}
            showsScale={false}
            showsBuildings={true}
            showsTraffic={false}
            showsIndoors={true}
          >
            {propertyMarkers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
              />
            ))}
          </MapView>
          <TouchableOpacity
            style={styles.mapHeader}
            onPress={onOpenFilterModal}
          >
            <Fontisto
              name="filter"
              size={16}
              color={styles.mapHeaderText.color}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.mapHeaderText}>Filters</Text>
          </TouchableOpacity>
          <View style={styles.mapActions}>
            <TouchableOpacity style={styles.mapActionButton}>
              <Fontisto
                name="filter"
                size={16}
                color={styles.mapActionButtonText.color}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapActionButton}>
              <AntDesign
                name="compass"
                size={18}
                color={styles.mapActionButtonText.color}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const PriceSlider = ({
  minValue = 30,
  maxValue = 400,
  onValueChange,
  styles,
}: {
  minValue?: number;
  maxValue?: number;
  onValueChange: (min: number, max: number) => void;
  styles: StyleProp;
}) => {
  const [currentMin, setCurrentMin] = useState(minValue);
  const [currentMax, setCurrentMax] = useState(maxValue);
  const [sliderWidth, setSliderWidth] = useState(300);
  const [, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

  // Refs to track gesture state
  const gestureState = useRef({
    isMinThumbActive: false,
    isMaxThumbActive: false,
    startValue: 0,
    initialPosition: 0,
  });

  const generatePriceData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      const height = Math.random() * 80 + 20;
      data.push(height);
    }
    return data;
  };

  const [priceData] = useState(generatePriceData());

  // Create pan responders for draggable thumbs
  const createPanResponder = (isMinThumb: boolean) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        setActiveThumb(isMinThumb ? "min" : "max");
        gestureState.current.isMinThumbActive = isMinThumb;
        gestureState.current.isMaxThumbActive = !isMinThumb;
        gestureState.current.startValue = isMinThumb ? currentMin : currentMax;
        gestureState.current.initialPosition =
          ((gestureState.current.startValue - minValue) /
            (maxValue - minValue)) *
          sliderWidth;
      },
      onPanResponderMove: (evt, panGestureState) => {
        const { dx } = panGestureState;
        const initialPos = gestureState.current.initialPosition;

        let newPosition = initialPos + dx;
        newPosition = Math.max(0, Math.min(sliderWidth, newPosition));

        const newValue =
          (newPosition / sliderWidth) * (maxValue - minValue) + minValue;
        const roundedValue = Math.round(newValue / 5) * 5; // Round to nearest 5

        if (isMinThumb) {
          const constrainedMin = Math.max(
            minValue,
            Math.min(roundedValue, currentMax - 10),
          );
          if (constrainedMin !== currentMin) {
            setCurrentMin(constrainedMin);
            onValueChange(constrainedMin, currentMax);
          }
        } else {
          const constrainedMax = Math.min(
            maxValue,
            Math.max(roundedValue, currentMin + 10),
          );
          if (constrainedMax !== currentMax) {
            setCurrentMax(constrainedMax);
            onValueChange(currentMin, constrainedMax);
          }
        }
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        setActiveThumb(null);
        gestureState.current.isMinThumbActive = false;
        gestureState.current.isMaxThumbActive = false;
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        setActiveThumb(null);
        gestureState.current.isMinThumbActive = false;
        gestureState.current.isMaxThumbActive = false;
      },
    });
  };

  const minThumbPanResponder = createPanResponder(true);
  const maxThumbPanResponder = createPanResponder(false);

  const minPercentage = ((currentMin - minValue) / (maxValue - minValue)) * 100;
  const maxPercentage = ((currentMax - minValue) / (maxValue - minValue)) * 100;

  // Calculate thumb positions (accounting for larger thumb size)
  const minThumbLeft =
    ((currentMin - minValue) / (maxValue - minValue)) * sliderWidth - 15;
  const maxThumbLeft =
    ((currentMax - minValue) / (maxValue - minValue)) * sliderWidth - 15;
  const activeRangeWidth =
    ((currentMax - currentMin) / (maxValue - minValue)) * sliderWidth;
  const activeRangeLeft =
    ((currentMin - minValue) / (maxValue - minValue)) * sliderWidth;

  return (
    <View style={styles.priceSliderContainer}>
      <View style={styles.priceGraphContainer}>
        <View style={styles.priceGraph}>
          {priceData.map((height, index) => {
            const barPercentage = (index / (priceData.length - 1)) * 100;
            const isInRange =
              barPercentage >= minPercentage && barPercentage <= maxPercentage;
            return (
              <View
                key={index}
                style={[
                  styles.priceBar,
                  {
                    height: height,
                    backgroundColor: isInRange ? "#007BFF" : "#E0E0E0",
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Price range display */}
        <View style={styles.priceRangeDisplay}>
          <Text style={styles.priceRangeText}>
            €{currentMin} - €{currentMax}
          </Text>
        </View>

        {/* Draggable slider track */}
        <View
          style={styles.sliderTrackContainer}
          onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
        >
          <View style={styles.sliderTrack}>
            {/* Active range highlight */}
            <View
              style={[
                styles.sliderActiveRange,
                {
                  left: activeRangeLeft,
                  width: activeRangeWidth,
                },
              ]}
            />

            {/* Min thumb */}
            <View
              style={[
                styles.sliderThumb,
                {
                  left: minThumbLeft,
                  backgroundColor:
                    activeThumb === "min"
                      ? "rgba(0, 123, 255, 0.2)"
                      : "transparent",
                },
              ]}
              {...minThumbPanResponder.panHandlers}
            >
              <View
                style={[
                  styles.sliderThumbInner,
                  activeThumb === "min" && styles.sliderThumbActive,
                ]}
              />
            </View>

            {/* Max thumb */}
            <View
              style={[
                styles.sliderThumb,
                {
                  left: maxThumbLeft,
                  backgroundColor:
                    activeThumb === "max"
                      ? "rgba(0, 123, 255, 0.2)"
                      : "transparent",
                },
              ]}
              {...maxThumbPanResponder.panHandlers}
            >
              <View
                style={[
                  styles.sliderThumbInner,
                  activeThumb === "max" && styles.sliderThumbActive,
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const FilterSection = ({
  title,
  children,
  styles,
  showMore = false,
  onToggleShowMore,
}: {
  title: string;
  children: React.ReactNode;
  styles: StyleProp;
  showMore?: boolean;
  onToggleShowMore?: () => void;
}) => (
  <View style={styles.filterSection}>
    <Text style={styles.sectionHeader}>{title}</Text>
    {children}
    {onToggleShowMore && (
      <TouchableOpacity
        onPress={onToggleShowMore}
        style={styles.showMoreButton}
      >
        <Text style={styles.showMoreText}>
          {showMore ? "Show less" : "Show more"}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

const FilterItem = ({
  text,
  count,
  isSelected,
  onToggle,
  styles,
}: {
  text: string;
  count?: number;
  isSelected: boolean;
  onToggle: () => void;
  styles: StyleProp;
}) => (
  <TouchableOpacity onPress={onToggle} style={styles.filterItem}>
    <Text style={styles.filterItemText}>
      {text} {count !== undefined && `(${count})`}
    </Text>
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && <AntDesign name="check" size={12} color="#FFFFFF" />}
    </View>
  </TouchableOpacity>
);

const CounterItem = ({
  label,
  count,
  onIncrement,
  onDecrement,
  styles,
}: {
  label: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  styles: StyleProp;
}) => (
  <View style={styles.counterItem}>
    <Text style={styles.counterLabel}>{label}</Text>
    <View style={styles.counterControls}>
      <TouchableOpacity
        onPress={onDecrement}
        style={[
          styles.counterButton,
          count === 0 && styles.counterButtonDisabled,
        ]}
        disabled={count === 0}
      >
        <Text
          style={[
            styles.counterButtonText,
            count === 0 && styles.counterButtonTextDisabled,
          ]}
        >
          −
        </Text>
      </TouchableOpacity>
      <Text style={styles.counterValue}>{count}</Text>
      <TouchableOpacity onPress={onIncrement} style={styles.counterButton}>
        <Text style={styles.counterButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const FilterModal = ({
  isVisible,
  onClose,
  styles,
  selectedFilters: externalSelectedFilters = new Set(),
  setSelectedFilters: setExternalSelectedFilters,
}: ModalProps) => {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    externalSelectedFilters,
  );
  const [priceRange, setPriceRange] = useState({ min: 30, max: 400 });
  const [matchingProperties, setMatchingProperties] = useState(1136);
  const [additionalProperties, setAdditionalProperties] = useState(325);
  const [showMoreSections, setShowMoreSections] = useState<{
    [key: string]: boolean;
  }>({});

  // Room and bed counters
  const [bedrooms, setBedrooms] = useState(0);
  const [beds, setBeds] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);

  // Sync with external state
  useEffect(() => {
    setSelectedFilters(externalSelectedFilters);
  }, [externalSelectedFilters]);

  // Filter data based on the images
  const filterData = {
    popularFilters: [
      { text: "Hotels", count: 275 },
      { text: "Breakfast included", count: 284 },
      { text: "Very Good: 8+", count: 731 },
      { text: "5 stars", count: 45 },
      { text: "Free parking", count: 156 },
      { text: "Parking", count: 298 },
      { text: "Air conditioning", count: 542 },
    ],
    propertyRating: [
      { text: "Unrated", count: 12 },
      { text: "2 stars", count: 45 },
      { text: "3 stars", count: 156 },
      { text: "4 stars", count: 298 },
      { text: "5 stars", count: 89 },
    ],
    locationScore: [
      { text: "Pleasant Location: 6+", count: 342 },
      { text: "Good Location: 7+", count: 267 },
      { text: "Very Good Location: 8+", count: 189 },
      { text: "Excellent Location: 9+", count: 98 },
    ],
    reviewScore: [
      { text: "Wonderful: 9+", count: 98 },
      { text: "Very Good: 8+", count: 267 },
      { text: "Good: 7+", count: 342 },
      { text: "Pleasant: 6+", count: 456 },
      { text: "Fair: 5+", count: 567 },
    ],
    freeCancellation: [{ text: "Free cancellation", count: 295 }],
    onlinePayment: [{ text: "Accepts online payments", count: 892 }],
    deals: [{ text: "All deals", count: 124 }],
    certifications: [{ text: "Sustainability certification", count: 78 }],
    distance: [
      { text: "Less than 1 km", count: 89 },
      { text: "Less than 3 km", count: 234 },
      { text: "Less than 5 km", count: 456 },
      { text: "Less than 10 km", count: 678 },
    ],
    chain: [
      { text: "Ibis", count: 12 },
      { text: "Holiday Inn Express", count: 8 },
      { text: "Novotel", count: 6 },
      { text: "Doubletree by Hilton", count: 4 },
      { text: "Sheraton", count: 3 },
      { text: "Marriott", count: 7 },
      { text: "Hilton", count: 9 },
      { text: "AccorHotels", count: 15 },
    ],
    roomAccessibility: [
      { text: "Upper floors accessible by elevator", count: 234 },
      { text: "Wheelchair accessible", count: 156 },
      { text: "Roll-in shower", count: 89 },
      { text: "Grab rails in bathroom", count: 123 },
    ],
    propertyAccessibility: [
      { text: "Accessible parking", count: 167 },
      { text: "Braille or raised signage", count: 45 },
      { text: "Lowered sink", count: 78 },
    ],
    meals: [
      { text: "Breakfast included", count: 284 },
      { text: "All-inclusive", count: 23 },
      { text: "Breakfast & dinner included", count: 67 },
      { text: "Kitchen facilities", count: 189 },
    ],
    bedPreference: [
      { text: "Double bed", count: 456 },
      { text: "2 single beds", count: 234 },
      { text: "King size bed", count: 167 },
      { text: "Twin beds", count: 123 },
    ],
    landmarks: [
      { text: "Villa Pallavicino Park", count: 12 },
      { text: "Villa Panza", count: 8 },
      { text: "Colosseum", count: 45 },
      { text: "Roman Forum", count: 67 },
      { text: "Pantheon", count: 89 },
      { text: "Trevi Fountain", count: 123 },
    ],
    propertyFacilities: [
      { text: "Free parking", count: 156 },
      { text: "Swimming pool", count: 89 },
      { text: "Parking", count: 298 },
      { text: "Pet friendly", count: 167 },
      { text: "Spa", count: 45 },
      { text: "Fitness center", count: 123 },
      { text: "Restaurant", count: 234 },
      { text: "Bar", count: 189 },
    ],
    roomFacilities: [
      { text: "Air conditioning", count: 542 },
      { text: "Balcony", count: 234 },
      { text: "Kitchen/Kitchenette", count: 167 },
      { text: "Free WiFi", count: 678 },
      { text: "TV", count: 589 },
      { text: "Mini-bar", count: 123 },
    ],
    propertyType: [
      { text: "Hotels", count: 275 },
      { text: "Apartments", count: 189 },
      { text: "Motels", count: 45 },
      { text: "Hostels", count: 67 },
      { text: "Vacation Homes", count: 123 },
      { text: "Bed & Breakfasts", count: 89 },
      { text: "Guest houses", count: 56 },
      { text: "Villas", count: 34 },
    ],
  };

  const updateMatchingProperties = useCallback(() => {
    // Calculate matching properties based on selected filters
    const baseProperties = 1136;
    const filterCount = selectedFilters.size;

    // Simulate realistic property count changes
    let newCount = baseProperties;
    if (filterCount > 0) {
      newCount = Math.max(
        50,
        baseProperties - filterCount * 50 + Math.floor(Math.random() * 100),
      );
    }

    setMatchingProperties(newCount);
    setAdditionalProperties(
      Math.floor(newCount * 0.3) + Math.floor(Math.random() * 100),
    );
  }, [selectedFilters.size]);

  const toggleFilter = (filterId: string) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(filterId)) {
      newFilters.delete(filterId);
    } else {
      newFilters.add(filterId);
    }
    setSelectedFilters(newFilters);
    if (setExternalSelectedFilters) {
      setExternalSelectedFilters(newFilters);
    }
  };

  const resetFilters = () => {
    const emptyFilters = new Set<string>();
    setSelectedFilters(emptyFilters);
    if (setExternalSelectedFilters) {
      setExternalSelectedFilters(emptyFilters);
    }
    setPriceRange({ min: 30, max: 400 });
    setBedrooms(0);
    setBeds(0);
    setBathrooms(0);
    setShowMoreSections({});
    setMatchingProperties(1136);
    setAdditionalProperties(325);
  };

  const toggleShowMore = (section: string) => {
    setShowMoreSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Update properties count when filters change
  useEffect(() => {
    updateMatchingProperties();
  }, [selectedFilters, priceRange, updateMatchingProperties]);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
        <View style={styles.filterHeader}>
          <TouchableOpacity onPress={onClose} style={styles.filterCloseButton}>
            <AntDesign
              name="close"
              size={24}
              color={styles.secondaryText.color}
            />
          </TouchableOpacity>
          <Text style={styles.filterTitle}>Filter by</Text>
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.filterReset}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ paddingHorizontal: 15 }}>
          {/* Budget Section */}
          <FilterSection title="Your budget (for 1 night)" styles={styles}>
            <Text style={styles.budgetValue}>
              € {priceRange.min} - € {priceRange.max} +
            </Text>
            <PriceSlider
              minValue={30}
              maxValue={400}
              onValueChange={(min, max) => setPriceRange({ min, max })}
              styles={styles}
            />
          </FilterSection>

          {/* Popular Filters */}
          <FilterSection title="Popular Filters" styles={styles}>
            {filterData.popularFilters.map((filter, index) => (
              <FilterItem
                key={`popular-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`popular-${index}`)}
                onToggle={() => toggleFilter(`popular-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Property Rating */}
          <FilterSection
            title="Property rating"
            styles={styles}
            showMore={showMoreSections.propertyRating}
            onToggleShowMore={() => toggleShowMore("propertyRating")}
          >
            <Text style={styles.sectionSubtitle}>
              Find high-quality hotels and vacation rentals
            </Text>
            {filterData.propertyRating
              .slice(0, showMoreSections.propertyRating ? undefined : 3)
              .map((filter, index) => (
                <FilterItem
                  key={`rating-${index}`}
                  text={filter.text}
                  count={filter.count}
                  isSelected={selectedFilters.has(`rating-${index}`)}
                  onToggle={() => toggleFilter(`rating-${index}`)}
                  styles={styles}
                />
              ))}
          </FilterSection>

          {/* Location Score */}
          <FilterSection title="Location Score" styles={styles}>
            {filterData.locationScore.map((filter, index) => (
              <FilterItem
                key={`location-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`location-${index}`)}
                onToggle={() => toggleFilter(`location-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Review Score */}
          <FilterSection title="Review Score" styles={styles}>
            {filterData.reviewScore.map((filter, index) => (
              <FilterItem
                key={`review-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`review-${index}`)}
                onToggle={() => toggleFilter(`review-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Free Cancellation */}
          <FilterSection title="Free cancellation" styles={styles}>
            {filterData.freeCancellation.map((filter, index) => (
              <FilterItem
                key={`cancellation-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`cancellation-${index}`)}
                onToggle={() => toggleFilter(`cancellation-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Online Payment */}
          <FilterSection title="Online Payment" styles={styles}>
            {filterData.onlinePayment.map((filter, index) => (
              <FilterItem
                key={`payment-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`payment-${index}`)}
                onToggle={() => toggleFilter(`payment-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Deals */}
          <FilterSection title="Deals" styles={styles}>
            {filterData.deals.map((filter, index) => (
              <FilterItem
                key={`deals-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`deals-${index}`)}
                onToggle={() => toggleFilter(`deals-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Certifications */}
          <FilterSection title="Certifications" styles={styles}>
            {filterData.certifications.map((filter, index) => (
              <FilterItem
                key={`cert-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`cert-${index}`)}
                onToggle={() => toggleFilter(`cert-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Distance from city center */}
          <FilterSection title="Distance from city center" styles={styles}>
            {filterData.distance.map((filter, index) => (
              <FilterItem
                key={`distance-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`distance-${index}`)}
                onToggle={() => toggleFilter(`distance-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Chain */}
          <FilterSection
            title="Chain"
            styles={styles}
            showMore={showMoreSections.chain}
            onToggleShowMore={() => toggleShowMore("chain")}
          >
            {filterData.chain
              .slice(0, showMoreSections.chain ? undefined : 5)
              .map((filter, index) => (
                <FilterItem
                  key={`chain-${index}`}
                  text={filter.text}
                  count={filter.count}
                  isSelected={selectedFilters.has(`chain-${index}`)}
                  onToggle={() => toggleFilter(`chain-${index}`)}
                  styles={styles}
                />
              ))}
          </FilterSection>

          {/* Room Accessibility */}
          <FilterSection
            title="Room Accessibility"
            styles={styles}
            showMore={showMoreSections.roomAccess}
            onToggleShowMore={() => toggleShowMore("roomAccess")}
          >
            {filterData.roomAccessibility
              .slice(0, showMoreSections.roomAccess ? undefined : 2)
              .map((filter, index) => (
                <FilterItem
                  key={`room-access-${index}`}
                  text={filter.text}
                  count={filter.count}
                  isSelected={selectedFilters.has(`room-access-${index}`)}
                  onToggle={() => toggleFilter(`room-access-${index}`)}
                  styles={styles}
                />
              ))}
          </FilterSection>

          {/* Property Accessibility */}
          <FilterSection title="Property Accessibility" styles={styles}>
            {filterData.propertyAccessibility.map((filter, index) => (
              <FilterItem
                key={`prop-access-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`prop-access-${index}`)}
                onToggle={() => toggleFilter(`prop-access-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Meals */}
          <FilterSection title="Meals" styles={styles}>
            {filterData.meals.map((filter, index) => (
              <FilterItem
                key={`meals-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`meals-${index}`)}
                onToggle={() => toggleFilter(`meals-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Bed Preference */}
          <FilterSection title="Bed Preference" styles={styles}>
            {filterData.bedPreference.map((filter, index) => (
              <FilterItem
                key={`bed-pref-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`bed-pref-${index}`)}
                onToggle={() => toggleFilter(`bed-pref-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Landmarks */}
          <FilterSection title="Landmarks" styles={styles}>
            {filterData.landmarks.map((filter, index) => (
              <FilterItem
                key={`landmarks-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`landmarks-${index}`)}
                onToggle={() => toggleFilter(`landmarks-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Property facilities */}
          <FilterSection
            title="Property facilities"
            styles={styles}
            showMore={showMoreSections.propFacilities}
            onToggleShowMore={() => toggleShowMore("propFacilities")}
          >
            {filterData.propertyFacilities
              .slice(0, showMoreSections.propFacilities ? undefined : 5)
              .map((filter, index) => (
                <FilterItem
                  key={`prop-fac-${index}`}
                  text={filter.text}
                  count={filter.count}
                  isSelected={selectedFilters.has(`prop-fac-${index}`)}
                  onToggle={() => toggleFilter(`prop-fac-${index}`)}
                  styles={styles}
                />
              ))}
          </FilterSection>

          {/* Room Facilities */}
          <FilterSection title="Room Facilities" styles={styles}>
            {filterData.roomFacilities.map((filter, index) => (
              <FilterItem
                key={`room-fac-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`room-fac-${index}`)}
                onToggle={() => toggleFilter(`room-fac-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Property Type */}
          <FilterSection
            title="Property Type"
            styles={styles}
            showMore={showMoreSections.propertyType}
            onToggleShowMore={() => toggleShowMore("propertyType")}
          >
            {filterData.propertyType
              .slice(0, showMoreSections.propertyType ? undefined : 5)
              .map((filter, index) => (
                <FilterItem
                  key={`prop-type-${index}`}
                  text={filter.text}
                  count={filter.count}
                  isSelected={selectedFilters.has(`prop-type-${index}`)}
                  onToggle={() => toggleFilter(`prop-type-${index}`)}
                  styles={styles}
                />
              ))}
          </FilterSection>

          {/* Rooms and beds */}
          <FilterSection title="Rooms and beds" styles={styles}>
            <CounterItem
              label="Bedrooms"
              count={bedrooms}
              onIncrement={() => setBedrooms((prev) => prev + 1)}
              onDecrement={() => setBedrooms((prev) => Math.max(0, prev - 1))}
              styles={styles}
            />
            <CounterItem
              label="Beds"
              count={beds}
              onIncrement={() => setBeds((prev) => prev + 1)}
              onDecrement={() => setBeds((prev) => Math.max(0, prev - 1))}
              styles={styles}
            />
            <CounterItem
              label="Private bathrooms"
              count={bathrooms}
              onIncrement={() => setBathrooms((prev) => prev + 1)}
              onDecrement={() => setBathrooms((prev) => Math.max(0, prev - 1))}
              styles={styles}
            />
          </FilterSection>
        </ScrollView>

        <View style={styles.filterFooter}>
          <Text style={styles.matchCount}>
            {matchingProperties} matching properties
          </Text>
          <Text style={styles.subMatchCount}>
            + {additionalProperties} other properties
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.showResultsButton}>
            <Text style={styles.showResultsText}>Show results</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const SortModal = ({
  isVisible,
  onClose,
  styles,
  selectedSortOption = "Top Picks for Groups",
  setSelectedSortOption,
}: ModalProps) => {
  const sortOptions = [
    "None",
    "Entire homes & apartments first",
    "Top Picks for Groups",
    "Distance From Downtown",
    "Property rating (5 to 0)",
    "Property rating (0 to 5)",
    "Genius",
    "Best reviewed first",
    "Price (lowest first)",
    "Price (highest first)",
    "Saved properties first",
    "Newest properties first",
    "Oldest properties first",
    "Most popular",
    "Guest rating and price",
    "Star rating (5 to 1)",
    "Star rating (1 to 5)",
    "Distance to city center",
    "Distance to beach",
    "Distance to airport",
    "Free WiFi",
    "Free breakfast",
    "Free cancellation",
    "Pet-friendly properties",
    "Family-friendly",
    "Business travel",
    "Romantic getaways",
    "Solo travelers",
    "Group bookings",
    "Luxury properties",
    "Budget-friendly",
    "Mid-range properties",
    "Boutique hotels",
    "Chain hotels",
    "Vacation rentals",
    "Bed & Breakfasts",
    "Hostels",
    "Resorts",
    "Villas",
    "Apartments",
    "Guest houses",
    "Recently renovated",
    "Eco-friendly properties",
    "Accessible properties",
    "Pool available",
    "Spa & wellness",
    "Fitness center",
    "Restaurant on-site",
    "Room service",
    "Parking available",
    "24-hour reception",
  ];

  const handleOptionSelect = (option: string) => {
    if (setSelectedSortOption) {
      setSelectedSortOption(option);
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
        <View style={styles.sortHeader}>
          <TouchableOpacity onPress={onClose}>
            <AntDesign
              name="close"
              size={24}
              color={styles.sortHeaderIcon.color}
            />
          </TouchableOpacity>
          <Text style={styles.sortTitle}>Sort by</Text>
        </View>
        <ScrollView>
          {sortOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.sortItem}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={styles.sortItemText}>{option}</Text>
              <View
                style={[
                  styles.radio,
                  selectedSortOption === option && styles.radioSelected,
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};
const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchBar: {
      backgroundColor: colors.background,
      paddingHorizontal: 15,
      paddingBottom: 5,
      marginTop: -30,
    },
    expandedHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      position: "relative",
    },
    expandedCloseButton: {
      position: "absolute",
      left: 0,
      padding: 5,
    },
    editSearchText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
    },
    expandableContainer: {
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "#FFD700", // Yellow border around all expanded inputs
      borderRadius: 12,
      backgroundColor: colors.card,
      padding: 8,
    },
    searchInput: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: "#FFD700", // Yellow border for all search inputs
    },
    searchInputExpanded: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInputText: {
      color: colors.text,
      fontSize: 16,
    },
    searchButton: {
      backgroundColor: colors.button,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    searchButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
    actionButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 2,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
      backgroundColor: colors.background,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 2,
      minWidth: 80,
    },
    actionIcon: {
      marginRight: 8,
    },
    actionText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "600",
    },
    actionButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    redIndicator: {
      position: "absolute",
      left: -10,
      top: -2,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#FF3B30",
      zIndex: 1,
    },
    listContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    cardContainer: {
      backgroundColor: colors.card,
      borderRadius: 10,
      margin: 15,
      overflow: "hidden",
    },
    cardImage: {
      width: "100%",
      height: 200,
      resizeMode: "cover",
    },
    cardContent: {
      padding: 15,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5,
    },
    ratingText: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.background,
      backgroundColor: colors.green,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginRight: 5,
    },
    ratingLabel: {
      fontSize: 14,
      color: colors.green,
      fontWeight: "bold",
      marginRight: 5,
    },
    reviews: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 10,
    },
    price: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.accent,
      marginTop: 10,
    },
    oldPrice: {
      fontSize: 14,
      textDecorationLine: "line-through",
      color: colors.textSecondary,
      marginRight: 5,
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
      borderColor: "#FFD700", // Yellow border
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
    // Age selection modal styles
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
    ageModalDoneButton: {
      backgroundColor: colors.button,
    },
    ageModalDoneButtonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: "bold",
    },
    // Filter modal specific styles
    filterSection: {
      marginBottom: 25,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    sectionSubtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 15,
      lineHeight: 18,
    },
    checkboxSelected: {
      backgroundColor: colors.button,
      borderColor: colors.button,
    },
    showMoreButton: {
      paddingVertical: 10,
      marginTop: 10,
    },
    showMoreText: {
      color: colors.button,
      fontSize: 14,
      fontWeight: "500",
    },
    // Price slider styles
    priceSliderContainer: {
      marginVertical: 15,
    },
    priceBar: {
      width: 4,
      marginHorizontal: 1,
      borderRadius: 2,
    },
    priceBarInactive: {
      backgroundColor: colors.separator,
    },
    sliderTrackContainer: {
      marginTop: 15,
      paddingHorizontal: 10,
    },
    sliderTrack: {
      height: 4,
      backgroundColor: colors.separator,
      borderRadius: 2,
      position: "relative",
      marginVertical: 15,
    },
    sliderActiveRange: {
      height: 4,
      backgroundColor: colors.button,
      borderRadius: 2,
      position: "absolute",
      top: 0,
    },
    sliderThumb: {
      width: 30,
      height: 30,
      position: "absolute",
      top: -13,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
    },
    sliderThumbInner: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.button,
      borderWidth: 3,
      borderColor: colors.background,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    sliderThumbActive: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 4,
      transform: [{ scale: 1.1 }],
    },
    priceRangeDisplay: {
      alignItems: "center",
      paddingVertical: 10,
    },
    priceRangeText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    // Counter styles
    counterItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    counterLabel: {
      color: colors.text,
      fontSize: 16,
      flex: 1,
    },
    counterControls: {
      flexDirection: "row",
      alignItems: "center",
    },
    counterButton: {
      width: 36,
      height: 36,
      borderRadius: 4,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.separator,
      alignItems: "center",
      justifyContent: "center",
    },
    counterButtonDisabled: {
      backgroundColor: colors.background,
      borderColor: colors.separator,
    },
    counterButtonText: {
      color: colors.button,
      fontSize: 18,
      fontWeight: "600",
    },
    counterButtonTextDisabled: {
      color: colors.separator,
    },
    counterValue: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "500",
      marginHorizontal: 15,
      minWidth: 30,
      textAlign: "center",
    },
    ageModalDoneText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
    mapCloseButton: {
      backgroundColor: colors.background,
      borderRadius: 50,
      padding: 5,
      color: colors.text,
    },
    mapTopHeader: {
      position: "absolute",
      top: 50,
      left: 15,
      right: 15,
      zIndex: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },
    mapLocationInputContainer: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 25,
      paddingHorizontal: 15,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderWidth: 2,
      borderColor: "#FFD700",
    },
    mapLocationInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingRight: 10,
    },
    mapLocationInputIcon: {
      marginLeft: 5,
    },
    mapContainer: {
      flex: 1,
    },
    mapImage: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%",
    },
    mapHeader: {
      position: "absolute",
      top: 50,
      left: 60,
      backgroundColor: colors.background,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 15,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    mapHeaderText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    mapActions: {
      position: "absolute",
      bottom: 50,
      right: 15,
      flexDirection: "column",
      alignItems: "center",
    },
    mapActionButton: {
      backgroundColor: colors.background,
      borderRadius: 50,
      padding: 12,
      marginVertical: 5,
      elevation: 5,
    },
    mapActionButtonText: {
      color: colors.text,
    },
    filterHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: colors.card,
    },
    filterCloseButton: {
      padding: 5,
      color: colors.text,
    },
    filterTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    filterReset: {
      fontSize: 16,
      color: colors.button,
    },
    sectionHeader: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 20,
      marginBottom: 10,
    },
    budgetValue: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 10,
    },
    priceGraphContainer: {
      height: 80,
      marginBottom: 20,
    },
    priceGraph: {
      height: 100,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      paddingHorizontal: 5,
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingVertical: 10,
    },
    filterItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    filterItemText: {
      color: colors.text,
      fontSize: 16,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.textSecondary,
    },
    filterFooter: {
      backgroundColor: colors.card,
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: colors.separator,
    },
    matchCount: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    subMatchCount: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 10,
    },
    showResultsButton: {
      backgroundColor: colors.button,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    showResultsText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
    sortHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: colors.card,
    },
    sortHeaderIcon: {
      color: colors.text,
    },
    sortTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 15,
      color: colors.text,
    },
    sortItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    sortItemText: {
      fontSize: 16,
      color: colors.text,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.separator,
    },
    radioSelected: {
      backgroundColor: colors.button,
      borderColor: colors.button,
    },
    secondaryText: {
      color: colors.textSecondary,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: colors.background,
    },
    backButton: {
      padding: 8,
    },
  });
interface PropertyListScreenProps {
  onBack?: () => void;
}

export default function PropertyListScreen({
  onBack,
}: PropertyListScreenProps = {}) {
  const { colors } = useTheme();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Rome");
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({
    checkIn: new Date(2025, 8, 18), // Sep 18, 2025
    checkOut: new Date(2025, 8, 22), // Sep 22, 2025
  });
  const [selectedGuests, setSelectedGuests] = useState<GuestData>({
    rooms: 1,
    adults: 2,
    children: 0,
    childAges: [],
    pets: false,
  });
  const [selectedSortOption, setSelectedSortOption] = useState(
    "Top Picks for Groups",
  );
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set(),
  );
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const styles = createStyles(colors);

  const formatDates = () => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      const checkIn = selectedDates.checkIn.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      const checkOut = selectedDates.checkOut.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      return `${checkIn} - ${checkOut}`;
    }
    return "Thu, 18 Sep - Mon, 22 Sep";
  };

  const formatGuests = () => {
    const roomText = selectedGuests.rooms === 1 ? "room" : "rooms";
    const adultText = selectedGuests.adults === 1 ? "adult" : "adults";

    let guestString = `${selectedGuests.rooms} ${roomText} • ${selectedGuests.adults} ${adultText}`;

    if (selectedGuests.children > 0) {
      const childText = selectedGuests.children === 1 ? "child" : "children";
      guestString += ` • ${selectedGuests.children} ${childText}`;
    } else {
      guestString += " • No children";
    }

    return guestString;
  };

  const expandSearch = () => {
    setIsExpanded(true);
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: 240, // Height for 3 inputs + search button + margins
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const collapseSearch = useCallback(() => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsExpanded(false);
    });
  }, [animatedHeight, animatedOpacity]);

  // Custom close handlers that keep search expanded
  const handleLocationModalClose = () => {
    setModalType(null);
    if (!isExpanded) {
      expandSearch();
    }
  };

  const handleDatesModalClose = () => {
    setModalType(null);
    if (!isExpanded) {
      expandSearch();
    }
  };

  const handleGuestsModalClose = () => {
    setModalType(null);
    if (!isExpanded) {
      expandSearch();
    }
  };

  const handleLocationPress = () => {
    if (!isExpanded) {
      // If collapsed, always expand first (regardless of onBack)
      expandSearch();
    } else {
      // If expanded, show location modal
      setModalType("location" as ModalType);
    }
  };

  const handleOutsidePress = () => {
    if (isExpanded) {
      collapseSearch();
    }
  };

  useEffect(() => {
    if (modalType !== null && isExpanded) {
      collapseSearch();
    }
  }, [modalType, isExpanded, collapseSearch]);
  const apartments: Property[] = [
    {
      id: "1",
      title: "Dolce by Wyndham Milan Malpensa",
      rating: "8.1",
      description: "Hotel room: 1 bed",
      price: "233",
      imageSource: "https://i.ibb.co/y52cT3P/apartment1.jpg",
      location: "Milan Malpensa",
      distance: "1 km from downtown",
      deal: "Getaway Deal",
      oldPrice: "322",
      taxesIncluded: true,
      reviewCount: "1698",
      ratingText: "Very Good",
      details: {
        confirmationNumber: "ABC123",
        pin: "1111",
        checkIn: "Thu, 18 Sep",
        checkOut: "Mon, 22 Sep",
        address: "Via Marco, Rome, Italy",
        roomType: "Entire apartment",
        includedExtras: "WiFi, TV",
        breakfastIncluded: true,
        nonRefundable: true,
        totalPrice: "€233",
        shareOptions: ["booking", "property", "app"],
        contactNumber: "+39 123 456 7890",
      },
    },
    {
      id: "2",
      title: "Hotel Pantheon",
      rating: "8.3",
      description: "Hotel room: 3 beds",
      price: "185",
      imageSource: "https://i.ibb.co/b3yJ0fF/hotel1.jpg",
      location: "Rome",
      distance: "0.5 km from downtown",
      oldPrice: "250",
      taxesIncluded: true,
      reviewCount: "892",
      ratingText: "Very Good",
      details: {
        confirmationNumber: "DEF456",
        pin: "2222",
        checkIn: "Thu, 18 Sep",
        checkOut: "Mon, 22 Sep",
        address: "Pantheon St, Rome, Italy",
        roomType: "Hotel room",
        includedExtras: "Breakfast, WiFi",
        breakfastIncluded: true,
        nonRefundable: false,
        totalPrice: "€1,785",
        shareOptions: ["booking", "property", "app"],
        contactNumber: "+39 987 654 3210",
      },
    },
    {
      title: "Aurelio’s apartment Colosseo",
      rating: "9.1",
      description: "Hotel room: 2 beds",
      price: "150",
      imageSource: "https://i.ibb.co/y6k9k0G/apartment2.jpg",
      details: {
        confirmationNumber: "GHI789",
        pin: "3333",
        checkIn: "Thu, 18 Sep",
        checkOut: "Mon, 22 Sep",
        address: "Colosseo Ave, Rome, Italy",
        roomType: "Entire apartment",
        includedExtras: "WiFi, Kitchen",
        breakfastIncluded: false,
        nonRefundable: false,
        totalPrice: "€150",
        shareOptions: ["booking", "property", "app"],
        contactNumber: "+39 555 666 7777",
      },
      id: "3",
      location: "Rome",
      distance: "0.2 km from Colosseum",
      oldPrice: "200",
      taxesIncluded: true,
      reviewCount: "234",
      ratingText: "Exceptional",
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        {isExpanded && (
          <View style={styles.expandedHeader}>
            <TouchableOpacity
              onPress={collapseSearch}
              style={styles.expandedCloseButton}
            >
              <AntDesign
                name="close"
                size={24}
                color={styles.searchInputText.color}
              />
            </TouchableOpacity>
            <Text style={styles.editSearchText}>Edit your search</Text>
          </View>
        )}

        {!isExpanded && (
          <View style={styles.searchInput}>
            <TouchableOpacity
              onPress={handleLocationPress}
              style={styles.searchIcon}
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={styles.searchInputText.color}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLocationPress} style={{ flex: 1 }}>
              <Text style={styles.searchInputText}>{selectedLocation}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Animated.View
          style={[
            styles.expandableContainer,
            {
              height: animatedHeight,
              opacity: animatedOpacity,
            },
          ]}
        >
          <View style={styles.searchInputExpanded}>
            <AntDesign
              name="search"
              size={18}
              color={styles.searchInputText.color}
              style={styles.searchIcon}
            />
            <TouchableOpacity
              onPress={() => setModalType("location" as ModalType)}
              style={{ flex: 1 }}
            >
              <Text style={styles.searchInputText}>{selectedLocation}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setModalType("dates" as ModalType)}
            style={styles.searchInputExpanded}
          >
            <Fontisto
              name="calendar"
              size={18}
              color={styles.searchInputText.color}
              style={styles.searchIcon}
            />
            <Text style={styles.searchInputText}>{formatDates()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalType("guests" as ModalType)}
            style={styles.searchInputExpanded}
          >
            <Ionicons
              name="person-outline"
              size={18}
              color={styles.searchInputText.color}
              style={styles.searchIcon}
            />
            <Text style={styles.searchInputText}>{formatGuests()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleOutsidePress}
        style={styles.actionButtons}
      >
        <TouchableOpacity
          onPress={() => setModalType("sort" as ModalType)}
          style={styles.actionButton}
        >
          <View style={styles.actionButtonContent}>
            {selectedSortOption !== "Top Picks for Groups" &&
              selectedSortOption !== "None" && (
                <View style={styles.redIndicator} />
              )}
            <AntDesign
              name="swap"
              size={24}
              color={styles.actionText.color}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Sort</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalType("filter" as ModalType)}
          style={styles.actionButton}
        >
          <View style={styles.actionButtonContent}>
            {selectedFilters.size > 0 && <View style={styles.redIndicator} />}
            <Ionicons
              name="options-outline"
              size={24}
              color={styles.actionText.color}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Filter</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalType("map" as ModalType)}
          style={styles.actionButton}
        >
          <Ionicons
            name="location-outline"
            size={24}
            color={styles.actionText.color}
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>Map</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <ScrollView
        style={styles.listContainer}
        onTouchStart={handleOutsidePress}
      >
        {apartments.map((apt, index) => (
          <PropertyCard
            key={apt.id || `apartment-${index}`}
            property={apt}
            onPress={() =>
              (navigation as any).navigate("PropertyDetailsScreen", {
                propertyData: {
                  propertyName: apt.title,
                  price: apt.price,
                  location: apt.location,
                  details: apt.details,
                },
              })
            }
          />
        ))}
      </ScrollView>
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
      <SortModal
        isVisible={modalType === "sort"}
        onClose={() => setModalType(null)}
        styles={styles}
        selectedSortOption={selectedSortOption}
        setSelectedSortOption={setSelectedSortOption}
      />
      <FilterModal
        isVisible={modalType === "filter"}
        onClose={() => setModalType(null)}
        styles={styles}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      <MapModal
        isVisible={modalType === "map"}
        onClose={() => setModalType(null)}
        styles={styles}
        onOpenFilterModal={() => setModalType("filter")}
      />
    </SafeAreaView>
  );
}
