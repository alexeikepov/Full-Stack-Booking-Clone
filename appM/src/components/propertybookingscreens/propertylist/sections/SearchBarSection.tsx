import { AntDesign, Fontisto, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createStyles } from "../../../../screens/propertyBookingScreens/propertyList/PropertyListScreen.styles";

interface SearchBarSectionProps {
  colors: any;
  isExpanded: boolean;
  animatedHeight: Animated.Value;
  animatedOpacity: Animated.Value;
  headerAnimatedOpacity: Animated.Value;
  compactBarAnimatedOpacity: Animated.Value; // NEW PROP
  expandSearch: () => void;
  collapseSearch: () => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedDates: { checkIn: Date | null; checkOut: Date | null };
  selectedGuests: any;
  handleLocationPress: () => void;
  handleDatesPress: () => void;
  handleGuestsPress: () => void;
  handleBackPress: () => void;
  handleSearchPress: () => void;
  searchSubmitting: boolean;
  formatDates: () => string;
  formatGuests: () => string;
}

const SearchBarSection: React.FC<SearchBarSectionProps> = ({
  colors,
  isExpanded,
  animatedHeight,
  animatedOpacity,
  headerAnimatedOpacity,
  compactBarAnimatedOpacity,
  expandSearch,
  collapseSearch,
  selectedLocation,
  setSelectedLocation,
  selectedDates,
  selectedGuests,
  handleLocationPress,
  handleDatesPress,
  handleGuestsPress,
  handleBackPress,
  handleSearchPress,
  searchSubmitting,
  formatDates,
  formatGuests,
}) => {
  const styles = createStyles(colors);

  return (
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
          <Animated.View style={{ opacity: headerAnimatedOpacity }}>
            <Text style={styles.editSearchText}>Edit your search</Text>
          </Animated.View>
        </View>
      )}

      <Animated.View
        style={[styles.searchInput, { opacity: compactBarAnimatedOpacity }]}
      >
        <TouchableOpacity onPress={handleBackPress} style={styles.searchIcon}>
          <Ionicons
            name="chevron-back"
            size={18}
            color={styles.searchInputText.color}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLocationPress} style={{ flex: 1 }}>
          <Text style={styles.searchInputText}>{selectedLocation}</Text>
        </TouchableOpacity>
      </Animated.View>

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
          <TouchableOpacity onPress={handleLocationPress} style={{ flex: 1 }}>
            <Text style={styles.searchInputText}>{selectedLocation}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleDatesPress}
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
          onPress={handleGuestsPress}
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
        <TouchableOpacity
          onPress={handleSearchPress}
          style={styles.searchButton}
          disabled={searchSubmitting}
        >
          {searchSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SearchBarSection;
