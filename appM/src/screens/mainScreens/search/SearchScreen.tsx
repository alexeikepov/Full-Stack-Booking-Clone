import React, { useRef, useState } from "react";
import { Modal, ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ContinueSearchSection,
  DatesModal,
  GeniusOffersSection,
  GuestsModal,
  LocationModal,
  SearchForm,
  SearchHeader,
  TabSelector,
  WhyBookingSection,
} from "../../../components/mainscreens/search";
import {
  UnifiedHelpCenterModal,
  UnifiedHelpCenterSection,
  MessagesModal,
  NotificationsModal,
} from "../../../../src/components/shared";
import ExploreWorldSection from "../../../components/mainscreens/search/sections/ExploreWorldSection";
import { useSearchScreenState } from "../../../hooks/useSearchScreenState";
import { createSearchScreenStyles } from "./SearchScreen.styles";
import PropertyList from "../../propertyBookingScreens/propertyList/PropertyListScreen";

const manWhiteImage = require("../../../assets/images/man-white.jpg");
const messagesManImage = require("../../../assets/images/messages-man.png");

const SearchScreen: React.FC = () => {
  const state = useSearchScreenState();
  const { theme, colors } = state;
  const styles = createSearchScreenStyles(colors, theme);

  // Track scroll position to determine background color
  const [isOverHalf, setIsOverHalf] = useState(false);
  const screenHeightRef = useRef<number | null>(null);

  // Make the color change more responsive and trigger on touch
  // Make the color change as fast as possible using requestAnimationFrame
  const handleScroll = (event: any) => {
    if (!screenHeightRef.current) {
      // Get the screen height on first scroll event
      screenHeightRef.current = event.nativeEvent.layoutMeasurement.height;
    }
    const y = event.nativeEvent.contentOffset.y;
    const screenHeight = screenHeightRef.current || 0;
    // Use requestAnimationFrame for immediate state update
    window.requestAnimationFrame(() => {
      if (y <= screenHeight / 2) {
        if (!isOverHalf) setIsOverHalf(true);
      } else {
        if (isOverHalf) setIsOverHalf(false);
      }
    });
  };

  // Determine root background color
  let rootBgColor = undefined;
  if (theme === "light") {
    rootBgColor = isOverHalf ? colors.blue : "#fff";
  }

  return (
    <View style={{ flex: 1, backgroundColor: rootBgColor }}>
      <StatusBar backgroundColor={colors.blue} translucent={false} />
      <View
        style={[
          styles.container,
          theme === "light" ? { backgroundColor: rootBgColor } : {},
        ]}
      >
        <SearchHeader
          onMessagesPress={state.openMessages}
          onNotificationsPress={state.openNotifications}
        />
        <ScrollView
          contentContainerStyle={styles.sectionScrollView}
          scrollEventThrottle={8}
          onScroll={handleScroll}
        >
          <View style={styles.searchContainer}>
            <TabSelector
              tabs={["Stays", "Car rental", "Taxi", "Attractions"]}
              activeTab={state.activeTab}
              onTabChange={state.setActiveTab}
              icons={state.tabIcons}
            />
          </View>
          <View style={styles.searchFormContainer}>
            <SearchForm
              activeTab={state.activeTab}
              selectedLocation={state.selectedLocation}
              selectedDates={state.selectedDates}
              selectedGuests={state.selectedGuests}
              formatDates={() => state.formatDates(state.selectedDates)}
              formatGuests={() => state.formatGuests(state.selectedGuests)}
              onLocationPress={() => state.setModalType("location")}
              onDatesPress={() => state.setModalType("dates")}
              onGuestsPress={() => state.setModalType("guests")}
              onSearch={state.handleSearch}
              searchSubmitting={state.searchSubmitting}
              flightType={state.flightType}
              setFlightType={state.setFlightType}
              directFlightsOnly={state.directFlightsOnly}
              setDirectFlightsOnly={state.setDirectFlightsOnly}
              returnToSameLocation={state.returnToSameLocation}
              setReturnToSameLocation={state.setReturnToSameLocation}
              taxiType={state.taxiType}
              setTaxiType={state.setTaxiType}
              setSearchParamsForPropertyList={
                state.setSearchParamsForPropertyList
              }
              setOpenExpandedSearch={state.setOpenExpandedSearch}
              setShowApartmentsList={state.setShowApartmentsList}
            />
          </View>
          <ContinueSearchSection
            onCardPress={state.handleCardPressWrapper}
            onLocationOnlyPress={state.handleLocationOnlyPressWrapper}
          />
          <GeniusOffersSection
            onGeniusCardPress={state.handleGeniusCardPress}
            onOfferPress={state.handleOfferPress}
            showGeniusModal={state.showGeniusModal}
            onCloseGeniusModal={state.handleCloseGeniusModal}
            showOfferModal={state.showOfferModal}
            onCloseOfferModal={state.handleCloseOfferModal}
          />
          <ExploreWorldSection
            styles={styles}
            colors={colors}
            handleLocationOnlyPress={state.handleLocationOnlyPressWrapper}
          />
          <WhyBookingSection />
        </ScrollView>
      </View>
      {state.showApartmentsList && (
        <View
          style={[
            styles.apartmentsListOverlayDebug,
            !state.isPropertyListReady && styles.propertyListLoadingOverlay,
          ]}
        >
          <PropertyList
            onBack={state.handleClosePropertyList}
            searchParams={state.searchParamsForPropertyList || undefined}
            openExpandedSearch={state.openExpandedSearch}
            onOpened={() => state.setOpenExpandedSearch(false)}
            onReady={state.handlePropertyListReady}
          />
        </View>
      )}
      <MessagesModal
        visible={state.showMessagesModal}
        onRequestClose={state.closeMessages}
        onHelpPress={state.openDirectHelpCenter}
        onSearchPress={state.handleSearch}
        colors={colors}
        insets={state.insets}
        theme={theme}
        manWhiteImage={manWhiteImage}
        messagesManImage={messagesManImage}
        styles={styles}
      />
      <NotificationsModal
        visible={state.showNotificationsModal}
        onRequestClose={state.closeNotifications}
        colors={colors}
        insets={state.insets}
        styles={styles}
      />
      <Modal
        visible={state.isHelpCenterOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={state.closeHelpCenter}
      >
        <SafeAreaView
          style={[styles.modalContainer, { paddingTop: state.insets.top }]}
        >
          <UnifiedHelpCenterSection
            colors={colors}
            activeTab={state.activeHelpTab}
            setActiveTab={state.setActiveHelpTab}
            openQuestionIndex={state.openHelpQuestionIndex}
            setOpenQuestionIndex={state.setOpenHelpQuestionIndex}
            faqData={state.faqData}
          />
        </SafeAreaView>
      </Modal>
      <UnifiedHelpCenterModal
        visible={state.isDirectHelpCenterOpen}
        onClose={state.closeDirectHelpCenter}
        colors={colors}
        insets={state.insets}
        activeTab={state.activeHelpTab}
        setActiveTab={state.setActiveHelpTab}
        openQuestionIndex={state.openHelpQuestionIndex}
        setOpenQuestionIndex={state.setOpenHelpQuestionIndex}
        faqData={state.faqData}
      />

      {/* Modal Components */}
      <LocationModal
        isVisible={state.modalType === "location"}
        onClose={state.handleLocationModalClose}
        colors={colors}
        selectedLocation={state.selectedLocation}
        setSelectedLocation={state.setSelectedLocation}
      />
      <DatesModal
        isVisible={state.modalType === "dates"}
        onClose={state.handleDatesModalClose}
        colors={colors}
        selectedDates={state.selectedDates}
        setSelectedDates={state.setSelectedDates}
      />
      <GuestsModal
        isVisible={state.modalType === "guests"}
        onClose={state.handleGuestsModalClose}
        colors={colors}
        selectedGuests={state.selectedGuests}
        setSelectedGuests={state.setSelectedGuests}
      />
    </View>
  );
};

export default SearchScreen;
