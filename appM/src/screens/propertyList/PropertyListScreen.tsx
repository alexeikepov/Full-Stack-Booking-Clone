import { SafeAreaView } from "react-native-safe-area-context";
import ActionButtonsSection from "../../components/propertylist/ActionButtonsSection";
import FilterModal from "../../components/propertylist/FilterModal";
import PropertyListMapModal from "../../components/propertylist/PropertyListMapModal";
import PropertyListSection from "../../components/propertylist/PropertyListSection";
import SearchBarSection from "../../components/propertylist/SearchBarSection";
import SortModal from "../../components/propertylist/SortModal";
import { DatesModal, LocationModal } from "../../components/search";
import GuestsModal, { GuestData } from "../../components/search/GuestsModal";
import { useTheme } from "../../hooks/ThemeContext";
import { usePropertyListHandlers } from "../../hooks/usePropertyListHandlers";
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
}

export default function PropertyListScreen({
  onBack,
  searchParams,
  openExpandedSearch,
  onOpened,
}: PropertyListScreenProps = {}) {
  const { colors } = useTheme();
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
    handleSearchPress,
    handleShowAll,
    formatDates,
    formatGuests,
    expandSearch,
    collapseSearch,
    handleLocationModalClose,
    handleDatesModalClose,
    handleGuestsModalClose,
    handleLocationPress,
    handleOutsidePress,
  } = usePropertyListHandlers({
    searchParams,
    onBack,
    openExpandedSearch,
    onOpened,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <SearchBarSection
        colors={colors}
        isExpanded={isExpanded}
        animatedHeight={animatedHeight}
        animatedOpacity={animatedOpacity}
        expandSearch={expandSearch}
        collapseSearch={collapseSearch}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedDates={selectedDates}
        selectedGuests={selectedGuests}
        handleLocationPress={handleLocationPress}
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
      />

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
        styles={{}}
        selectedSortOption={selectedSortOption}
        setSelectedSortOption={setSelectedSortOption}
      />
      <FilterModal
        isVisible={modalType === "filter"}
        onClose={() => setModalType(null)}
        styles={{}}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      <PropertyListMapModal
        isVisible={modalType === "map"}
        onClose={() => setModalType(null)}
        styles={styles}
      />
    </SafeAreaView>
  );
}
