import { Fontisto } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../../hooks/ThemeContext";
import { GuestData } from "../../../../types/GuestData";
import SearchBar from "./SearchBar";

interface SearchFormProps {
  activeTab: string;
  selectedLocation: string;
  selectedDates: { checkIn: Date | null; checkOut: Date | null };
  selectedGuests: GuestData;
  formatDates: () => string;
  formatGuests: () => string;
  onLocationPress: () => void;
  onDatesPress: () => void;
  onGuestsPress: () => void;
  onSearch: () => void;
  searchSubmitting: boolean;
  flightType: string;
  setFlightType: (type: string) => void;
  directFlightsOnly: boolean;
  setDirectFlightsOnly: (value: boolean) => void;
  returnToSameLocation: boolean;
  setReturnToSameLocation: (value: boolean) => void;
  taxiType: string;
  setTaxiType: (type: string) => void;
  setSearchParamsForPropertyList: (params: {
    location: string;
    dates: { checkIn: Date | null; checkOut: Date | null };
    guests: GuestData;
  }) => void;
  setOpenExpandedSearch: (open: boolean) => void;
  setShowApartmentsList: (show: boolean) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  activeTab,
  selectedLocation,
  selectedDates,
  selectedGuests,
  formatDates,
  formatGuests,
  onLocationPress,
  onDatesPress,
  onGuestsPress,
  onSearch,
  searchSubmitting,
  flightType,
  setFlightType,
  directFlightsOnly,
  setDirectFlightsOnly,
  returnToSameLocation,
  setReturnToSameLocation,
  taxiType,
  setTaxiType,
  setSearchParamsForPropertyList,
  setOpenExpandedSearch,
  setShowApartmentsList,
}) => {
  const { colors, theme } = useTheme();

  const styles = {
    searchFormBorder: {
      borderWidth: 4,
      borderColor: theme === "light" ? "#FFC107" : "#FFCC00",
      borderRadius: 14,
      padding: 16,
      marginTop: 0,
      marginBottom: 12,
      backgroundColor: colors.card,
    },
    searchInput: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
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
    radioGroup: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      marginBottom: 8,
    },
    radioButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingVertical: 8,
      gap: 4,
    },
    radioText: { color: colors.text },
    toggleRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      paddingVertical: 12,
    },
    toggleText: { color: colors.text },
  };

  switch (activeTab) {
    case "Stays":
      return (
        <View style={styles.searchFormBorder}>
          <TouchableOpacity
            style={styles.searchInput}
            onPress={onLocationPress}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={colors.text}
              style={styles.searchIcon}
            />
            <Text style={styles.searchInputText}>{selectedLocation}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.searchInput} onPress={onDatesPress}>
            <Fontisto
              name="calendar"
              size={18}
              color={colors.text}
              style={styles.searchIcon}
            />
            <Text style={styles.searchInputText}>{formatDates()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.searchInput} onPress={onGuestsPress}>
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
              backgroundColor: theme === "light" ? "#0044BB" : colors.button,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
              marginTop: 8,
            }}
            onPress={onSearch}
            disabled={searchSubmitting}
          >
            {searchSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Search</Text>
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
                    flightType === type ? "radio-button-on" : "radio-button-off"
                  }
                  size={20}
                  color={colors.button}
                />
                <Text style={styles.radioText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <SearchBar placeholder="ATH Athens" iconName="paper-plane" />
          <SearchBar placeholder="Where to?" iconName="paper-plane-outline" />
          <SearchBar
            placeholder="Sat, 11 Oct - Sat, 18 Oct"
            iconName="calendar"
          />
          <SearchBar placeholder="1 adult · Economy" iconName="person" />
          <TouchableOpacity
            style={{
              backgroundColor: theme === "light" ? "#0044BB" : colors.button,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
              marginTop: 8,
            }}
            onPress={onSearch}
            disabled={searchSubmitting}
          >
            {searchSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Search</Text>
            )}
          </TouchableOpacity>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Direct flights only</Text>
            <Switch
              value={directFlightsOnly}
              onValueChange={setDirectFlightsOnly}
              trackColor={{ false: "#767577", true: colors.button }}
              thumbColor={directFlightsOnly ? colors.background : colors.gray}
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
              backgroundColor: theme === "light" ? "#0044BB" : colors.button,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
              marginTop: 8,
            }}
            onPress={onSearch}
            disabled={searchSubmitting}
          >
            {searchSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Search</Text>
            )}
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
                    taxiType === type ? "radio-button-on" : "radio-button-off"
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
          <SearchBar placeholder="Tell us when" iconName="calendar-outline" />
          <SearchBar placeholder="2 passengers" iconName="person-outline" />
          <TouchableOpacity
            style={{
              backgroundColor: theme === "light" ? "#0044BB" : colors.button,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
              marginTop: 8,
            }}
            onPress={onSearch}
            disabled={searchSubmitting}
          >
            {searchSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Check prices
              </Text>
            )}
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
              backgroundColor: theme === "light" ? "#0044BB" : colors.button,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
              marginTop: 8,
            }}
            onPress={onSearch}
            disabled={searchSubmitting}
          >
            {searchSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Search</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    default:
      return null;
  }
};

export default SearchForm;
