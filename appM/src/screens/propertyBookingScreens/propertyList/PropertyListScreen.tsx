import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types/navigation";
import ActionButtonsSection from "../../../components/propertybookingscreens/propertylist/sections/ActionButtonsSection";
import FilterModal from "../../../components/propertybookingscreens/propertylist/modals/FilterModal";
import MapModalWrapper from "../../../components/propertybookingscreens/propertylist/modals/MapModalWrapper";
import PropertyListSection from "../../../components/propertybookingscreens/propertylist/sections/PropertyListSection";
import SearchBarSection from "../../../components/propertybookingscreens/propertylist/sections/SearchBarSection";
import SortModal from "../../../components/propertybookingscreens/propertylist/modals/SortModal";
import {
  DatesModal,
  LocationModal,
} from "../../../components/mainscreens/search";
import GuestsModal from "../../../components/mainscreens/search/modals/GuestsModal";
import { GuestData } from "../../../types/GuestData";
import { useTheme } from "../../../hooks/ThemeContext";
import { usePropertyListHandlers } from "../../../hooks/usePropertyListHandlers";
import { createStyles } from "./PropertyListScreen.styles";

interface PropertyListScreenProps {
  onBack?: () => void;
  searchParams?: {
    location?: string;
    dates?: { checkIn: Date | null; checkOut: Date | null };
    guests?: GuestData;
  };
  openExpandedSearch?: boolean;
  onOpened?: () => void;
  onReady?: () => void;
}

export default function PropertyListScreen({
  onBack,
  searchParams,
  openExpandedSearch,
  onOpened,
  onReady,
}: PropertyListScreenProps = {}) {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const styles = createStyles(colors);

  const {
    modalType,
    setModalType,
    isExpanded,
    selectedLocation,
    setSelectedLocation,
    selectedDates,
    setSelectedDates,
    selectedGuests,
    setSelectedGuests,
    filteredApartments,
    noMatches,
    searchSubmitting,
    selectedSortOption,
    setSelectedSortOption,
    selectedFilters,
    setSelectedFilters,
    animatedHeight,
    animatedOpacity,
    headerAnimatedOpacity,
    compactBarAnimatedOpacity,
    handleSearchPress,
    handleShowAll,
    formatDates,
    formatGuests,
    expandSearch,
    collapseSearch,
    handleLocationModalClose,
    handleDatesModalClose,
    handleGuestsModalClose,
    handleBackPress,
    handleLocationPress,
    handleDatesPress,
    handleGuestsPress,
    handleOutsidePress,
    isReady,
    isLoading,
    randomizeApartments,
  } = usePropertyListHandlers({
    searchParams,
    onBack,
    openExpandedSearch,
    onOpened,
    onReady,
  });

  // Notify parent when the component is ready (animations completed)
  useEffect(() => {
    if (isReady && onReady) {
      onReady();
    }
  }, [isReady, onReady]);

  // Handle swipe right gesture to navigate to search screen
  const handleSwipeGesture = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;

      // Check if it's a right swipe (positive translationX) with sufficient distance or velocity
      if ((translationX > 100 || velocityX > 500) && translationX > 0) {
        // Use the existing back navigation logic from the hook
        handleBackPress();
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <PanGestureHandler onHandlerStateChange={handleSwipeGesture}>
        <View style={{ flex: 1 }}>
          <SearchBarSection
            colors={colors}
            isExpanded={isExpanded}
            animatedHeight={animatedHeight}
            animatedOpacity={animatedOpacity}
            headerAnimatedOpacity={headerAnimatedOpacity}
            compactBarAnimatedOpacity={compactBarAnimatedOpacity}
            expandSearch={expandSearch}
            collapseSearch={collapseSearch}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedDates={selectedDates}
            selectedGuests={selectedGuests}
            handleLocationPress={handleLocationPress}
            handleDatesPress={handleDatesPress}
            handleGuestsPress={handleGuestsPress}
            handleBackPress={handleBackPress}
            handleSearchPress={handleSearchPress}
            searchSubmitting={searchSubmitting}
            formatDates={formatDates}
            formatGuests={formatGuests}
          />

          <ActionButtonsSection
            colors={colors}
            selectedSortOption={selectedSortOption}
            selectedFilters={selectedFilters}
            setModalType={setModalType}
            handleOutsidePress={handleOutsidePress}
          />

          <PropertyListSection
            colors={colors}
            filteredApartments={filteredApartments}
            apartments={[]}
            noMatches={noMatches}
            handleShowAll={handleShowAll}
            selectedDates={selectedDates}
            selectedGuests={selectedGuests}
            handleOutsidePress={handleOutsidePress}
            isLoading={isLoading}
          />
        </View>
      </PanGestureHandler>

      <LocationModal
        isVisible={modalType === "location"}
        onClose={handleLocationModalClose}
        colors={colors}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
      <DatesModal
        isVisible={modalType === "dates"}
        onClose={handleDatesModalClose}
        colors={colors}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />
      <GuestsModal
        isVisible={modalType === "guests"}
        onClose={handleGuestsModalClose}
        colors={colors}
        selectedGuests={selectedGuests}
        setSelectedGuests={setSelectedGuests}
      />
      <SortModal
        isVisible={modalType === "sort"}
        onClose={() => setModalType(null)}
        styles={styles}
        selectedSortOption={selectedSortOption}
        setSelectedSortOption={setSelectedSortOption}
        onApply={randomizeApartments}
      />
      <FilterModal
        isVisible={modalType === "filter"}
        onClose={() => setModalType(null)}
        styles={styles}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        onApply={randomizeApartments}
      />
      <MapModalWrapper
        isVisible={modalType === "map"}
        onClose={() => setModalType(null)}
        styles={styles}
        properties={filteredApartments}
        onApply={(property) =>
          navigation.navigate("PropertyDetailsScreen", {
            propertyData: property,
          })
        }
      />
    </SafeAreaView>
  );
}
