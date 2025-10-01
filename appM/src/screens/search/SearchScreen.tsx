import React from "react";
import { Modal, ScrollView, StatusBar, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import HelpSupportSection from "../../components/account/HelpSupportSection";
import {
  ContinueSearchSection,
  DatesModal,
  GeniusOffersSection,
  GuestsModal,
  LocationModal,
  SearchForm,
  SearchHeader,
} from "../../components/search";
import DirectHelpCenterModal from "../../components/search/DirectHelpCenterModal";
import ExploreWorldSection from "../../components/search/ExploreWorldSection";
import MessagesModal from "../../components/search/MessagesModal";
import NotificationsModal from "../../components/search/NotificationsModal";
import TabSelector from "../../components/search/TabSelector";
import { useSearchScreenState } from "../../hooks/useSearchScreenState";
import { createSearchScreenStyles } from "../../styles/SearchScreen.styles";
import PropertyList from "../propertyList/PropertyListScreen";

const manWhiteImage = require("../../assets/images/man-white.jpg");
const messagesManImage = require("../../assets/images/messages-man.png");

const SearchScreen: React.FC = () => {
  const state = useSearchScreenState();
  const { theme, colors } = state;
  const bgColor = theme === "light" ? colors.background : colors.background;
  const styles = createSearchScreenStyles(colors, theme);

  const panGesture = Gesture.Pan().onEnd((event) => {
    if (event.translationX > 100 || event.velocityX > 500) {
      state.setShowApartmentsList(false);
    }
  });

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.blue} translucent={false} />
      <View
        style={[
          styles.container,
          theme === "light" ? { backgroundColor: bgColor } : {},
        ]}
      >
        <SearchHeader
          onMessagesPress={state.openMessages}
          onNotificationsPress={state.openNotifications}
          onBack={state.onBack}
        />
        <ScrollView
          contentContainerStyle={styles.sectionScrollView}
          scrollEventThrottle={16}
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
            onCardPress={(location, dateString, guestString) =>
              state.handleCardPress(
                location,
                dateString,
                guestString,
                state.setSearchParamsForPropertyList,
                state.setShowApartmentsList,
              )
            }
            onLocationOnlyPress={(location) =>
              state.handleLocationOnlyPress(
                location,
                state.selectedDates,
                state.selectedGuests,
                state.setSearchParamsForPropertyList,
                state.setShowApartmentsList,
              )
            }
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
            handleLocationOnlyPress={(location) =>
              state.handleLocationOnlyPress(
                location,
                state.selectedDates,
                state.selectedGuests,
                state.setSearchParamsForPropertyList,
                state.setShowApartmentsList,
              )
            }
          />
        </ScrollView>
      </View>
      {state.showApartmentsList && (
        <GestureDetector gesture={panGesture}>
          <View style={styles.apartmentsListOverlayDebug}>
            <PropertyList
              onBack={() => state.setShowApartmentsList(false)}
              searchParams={state.searchParamsForPropertyList || undefined}
              openExpandedSearch={state.openExpandedSearch}
              onOpened={() => state.setOpenExpandedSearch(false)}
            />
          </View>
        </GestureDetector>
      )}
      <MessagesModal
        visible={state.showMessagesModal}
        onRequestClose={state.closeMessages}
        onHelpPress={state.openDirectHelpCenter}
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
          <HelpSupportSection />
        </SafeAreaView>
      </Modal>
      <DirectHelpCenterModal
        visible={state.isDirectHelpCenterOpen}
        onRequestClose={state.closeDirectHelpCenter}
        colors={colors}
        insets={state.insets}
        activeHelpTab={state.activeHelpTab}
        setActiveHelpTab={state.setActiveHelpTab}
        openHelpQuestionIndex={state.openHelpQuestionIndex}
        setOpenHelpQuestionIndex={state.setOpenHelpQuestionIndex}
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
