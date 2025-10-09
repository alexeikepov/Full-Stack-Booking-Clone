import { StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import {
  Animated,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  handleAskQuestion,
  handleCancelQuestion,
  handleDateChange,
  handleImagePress,
  handleMapPress,
  handleReadMore,
  handleRoomGuestChange,
  handleSave,
  handleScroll,
  handleSeeAllQuestions,
  handleShare,
  handleShowAllReviews,
  handleSubmitQuestion,
} from "../../../components/propertybookingscreens/propertyDetails/handlers";
import { openBookingWithOptions as openBookingWithOptionsHelper } from "../../../components/propertybookingscreens/propertyDetails/helpers/openBookingWithOptions";
import { parseAltDateRange } from "../../../components/propertybookingscreens/propertyDetails/helpers/parseAltDateRange";
import ImageGallery from "../../../components/propertybookingscreens/propertyDetails/sections/ImageGallery";
import DescriptionModal from "../../../components/propertybookingscreens/propertyDetails/modals/DescriptionModal";
import FacilitiesModal from "../../../components/propertybookingscreens/propertyDetails/modals/FacilitiesModal";
import ImageModal from "../../../components/propertybookingscreens/propertyDetails/modals/ImageModal";
import MapModalWrapper from "../../../components/propertybookingscreens/propertyDetails/modals/MapModalWrapper";
import QuestionFormModal from "../../../components/propertybookingscreens/propertyDetails/modals/QuestionFormModal";
import ReviewsModal from "../../../components/propertybookingscreens/propertyDetails/modals/ReviewsModal";
import ReviewsSummaryModal from "../../../components/propertybookingscreens/propertyDetails/modals/ReviewsSummaryModal";
import PaymentConfirmationModal from "../../../components/propertybookingscreens/propertyDetails/modals/PaymentConfirmationModal";
import PaymentMethodModal from "../../../components/propertybookingscreens/propertyDetails/modals/PaymentMethodModal";
import PropertyHeader from "../../../components/propertybookingscreens/propertyDetails/sections/PropertyHeader";
import BookingSection from "../../../components/propertybookingscreens/propertyDetails/sections/BookingSection";
import DescriptionSection from "../../../components/propertybookingscreens/propertyDetails/sections/DescriptionSection";
import FacilitiesSection from "../../../components/propertybookingscreens/propertyDetails/sections/FacilitiesSection";
import PropertySurroundingsSection from "../../../components/propertybookingscreens/propertyDetails/sections/PropertySurroundingsSection";
import HouseRulesSection from "../../../components/propertybookingscreens/propertyDetails/sections/HouseRulesSection";
import MapSection from "../../../components/propertybookingscreens/propertyDetails/sections/MapSection";
import QuestionsSection from "../../../components/propertybookingscreens/propertyDetails/sections/QuestionsSection";
import RatingsSection from "../../../components/propertybookingscreens/propertyDetails/sections/RatingsSection";
import ReviewsSection from "../../../components/propertybookingscreens/propertyDetails/sections/ReviewsSection";
import { DatesModal } from "../../../components/mainscreens/search";
import GuestsModal from "../../../components/mainscreens/search/modals/GuestsModal";
import { resolveIcon } from "../../../components/ui/iconMap";
import { useCardForm } from "../../../hooks/useCardForm";
import { usePropertyDetailsState } from "../../../hooks/usePropertyDetailsState";
import { useSavedProperties } from "../../../hooks/SavedPropertiesContext";

// Import RootStackParamList from types if available, otherwise define a minimal version here
import type { RootStackParamList } from "../../../types/navigation";

// If the above import fails, uncomment and adjust the following:
// type RootStackParamList = { PropertyDetailsScreen: undefined; /* add other screens as needed */ };

type PropertyDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  "PropertyDetailsScreen"
>;

export default function PropertyDetailsScreen(
  props: PropertyDetailsScreenProps,
) {
  // Restore missing state and handlers for payment modal and card form
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] =
    useState(false);
  // Store the last generated confirmation code so the confirmation modal can show it
  const [lastConfirmationCode] = useState<string | null>(null);
  // Card form state and handlers
  const {
    cardNumber,
    setCardNumber,
    cardName,
    setCardName,
    cardExpiry,
    setCardExpiry,
    cardCvv,
    setCardCvv,
    cardErrors,
    cardSubmitting,
    closePaymentModal,
    handleSubmitCard,
  } = useCardForm();
  const {
    navigation,
    showExpandedFacilities,
    setShowExpandedFacilities,
    showAllQuestions,
    setShowAllQuestions,
    showQuestionFormModal,
    setShowQuestionFormModal,
    questionText,
    setQuestionText,
    userName,
    setUserName,
    userCountry,
    setUserCountry,
    showMapModal,
    setShowMapModal,
    selectedDates,
    setSelectedDates,
    selectedGuests,
    setSelectedGuests,
    bookingPriceOverride,
    setBookingPriceOverride,
    bookingAltDateRange,
    setBookingAltDateRange,
    facilitiesAnimationHeight,
    animationHeight,
    reviewsAnimationHeight,
    descriptionAnimationHeight,
    isScrolled,
    setIsScrolled,
    keyboardOpen,
    colors,
    theme,
    styles,
    showReviewsModal,
    setShowReviewsModal,
    showFacilitiesModal,
    setShowFacilitiesModal,
    showDescriptionModal,
    setShowDescriptionModal,
    showImageModal,
    setShowImageModal,
    showExpandedReviews,
    setShowExpandedReviews,
    showExpandedDescription,
    setShowExpandedDescription,
    showReviewsSummaryModal,
    setShowReviewsSummaryModal,
    showPropertyDatesModal,
    setShowPropertyDatesModal,
    showPropertyGuestsModal,
    setShowPropertyGuestsModal,
    questions,
    setQuestions,
    property,
    propertyId,
    handleShowMoreRatings,
    showAllRatings,
  } = usePropertyDetailsState(props);

  const { saveProperty, removeProperty, isSaved } = useSavedProperties();

  // Create bound handler functions
  const boundHandlers = {
    handleSave: () =>
      handleSave({
        property,
        isSaved,
        saveProperty,
        removeProperty,
      }),
    handleShare: () => handleShare(property),
    handleImagePress: () => handleImagePress(setShowImageModal),
    handleMapPress: () => handleMapPress(setShowMapModal),
    handleDateChange: (dates: any) =>
      handleDateChange(setShowPropertyDatesModal),
    handleRoomGuestChange: () =>
      handleRoomGuestChange(setShowPropertyGuestsModal),
    handleScroll: (event: any) => handleScroll(event, setIsScrolled),
    handleSeeAllQuestions: () =>
      handleSeeAllQuestions({
        showAllQuestions,
        setShowAllQuestions,
        animationHeight,
      }),
    handleAskQuestion: () => handleAskQuestion(setShowQuestionFormModal),
    handleCancelQuestion: () =>
      handleCancelQuestion({
        setQuestionText,
        setUserName,
        setUserCountry,
        setShowQuestionFormModal,
      }),
    handleSubmitQuestion: () =>
      handleSubmitQuestion({
        questionText,
        userName,
        userCountry,
        questions,
        setQuestions,
        setShowQuestionFormModal,
        setQuestionText,
        setUserName,
        setUserCountry,
      }),
    handleShowAllReviews: () =>
      handleShowAllReviews({
        showExpandedReviews,
        setShowExpandedReviews,
        reviewsAnimationHeight,
      }),
    handleReadMore: () =>
      handleReadMore({
        showExpandedDescription,
        setShowExpandedDescription,
        descriptionAnimationHeight,
      }),
  };

  // Booking handlers
  const handleBookNow = () => {
    // Serialize dates to ISO strings to avoid non-serializable values in navigation params
    navigation.navigate("PropertyConfirmationScreen", {
      property,
      selectedDates: {
        checkIn:
          selectedDates.checkIn &&
          typeof selectedDates.checkIn.toISOString === "function"
            ? selectedDates.checkIn.toISOString()
            : selectedDates.checkIn || null,
        checkOut:
          selectedDates.checkOut &&
          typeof selectedDates.checkOut.toISOString === "function"
            ? selectedDates.checkOut.toISOString()
            : selectedDates.checkOut || null,
      },
      selectedGuests,
      bookingPriceOverride,
      bookingAltDateRange,
    });
  };
  const handleSeeAllFacilities = () => {
    setShowExpandedFacilities(!showExpandedFacilities);
    // @ts-ignore
    Animated.timing(facilitiesAnimationHeight, {
      toValue: showExpandedFacilities ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, isScrolled && styles.headerScrolled]}>
        <TouchableOpacity
          style={[
            styles.headerButton,
            isScrolled && styles.headerButtonScrolled,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {isScrolled && (
          <Text style={styles.propertyNameHeader}>{property.name}</Text>
        )}

        <View style={{ flexDirection: "row" }}>
          {/* <TouchableOpacity
            style={[
              styles.headerButton,
              isScrolled && styles.headerButtonScrolled,
            ]}
            onPress={boundHandlers.handleSave}
          >
            <Ionicons
              name={isSaved(propertyId) ? "heart" : "heart-outline"}
              size={24}
              color={isSaved(propertyId) ? "#FF0000" : "white"}
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[
              styles.headerButton,
              { marginLeft: 8 },
              isScrolled && styles.headerButtonScrolled,
            ]}
            onPress={boundHandlers.handleShare}
          >
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          paddingBottom: keyboardOpen
            ? 500
            : Platform.OS === "android"
              ? 150
              : 100,
        }}
        onScroll={(event) => boundHandlers.handleScroll(event)}
        scrollEventThrottle={16}
      >
        <ImageGallery
          styles={styles}
          property={property}
          onPress={boundHandlers.handleImagePress}
        />
        <PropertyHeader styles={styles} property={property} />
        <BookingSection
          styles={styles}
          colors={colors}
          selectedDates={selectedDates}
          handleDateChange={boundHandlers.handleDateChange}
          selectedGuests={selectedGuests}
          handleRoomGuestChange={boundHandlers.handleRoomGuestChange}
          property={property}
          parseAltDateRange={parseAltDateRange}
          openBookingWithOptions={(
            dates: { checkIn: Date | null; checkOut: Date | null } | null,
            price: any,
            altLabel: string | null,
          ) =>
            openBookingWithOptionsHelper(
              setBookingPriceOverride,
              setBookingAltDateRange,
              setSelectedDates,
              navigation,
              property,
              selectedGuests,
              dates,
              price,
              altLabel,
            )
          }
        />
        <MapSection
          styles={styles}
          colors={colors}
          property={property}
          handleMapPress={boundHandlers.handleMapPress}
        />
        <RatingsSection
          styles={styles}
          property={property}
          showAllRatings={showAllRatings}
          handleShowReviewsSummary={() => setShowReviewsSummaryModal(true)}
          handleShowMoreRatings={handleShowMoreRatings}
          colors={colors}
        />
        <ReviewsSection
          styles={styles}
          property={property}
          reviewsAnimationHeight={reviewsAnimationHeight}
          showExpandedReviews={showExpandedReviews}
          handleShowAllReviews={boundHandlers.handleShowAllReviews}
        />
        <FacilitiesSection
          styles={styles}
          property={property}
          resolveIcon={resolveIcon}
          colors={colors}
          facilitiesAnimationHeight={facilitiesAnimationHeight}
          showExpandedFacilities={showExpandedFacilities}
          handleSeeAllFacilities={handleSeeAllFacilities}
        />
        {property.surroundings && (
          <PropertySurroundingsSection
            surroundings={property.surroundings}
            styles={styles}
            colors={colors}
          />
        )}
        {property.houseRules ||
        property.overview?.houseRules ||
        (property.details && property.details.houseRules) ? (
          <HouseRulesSection
            property={property}
            styles={styles}
            colors={colors}
          />
        ) : null}
        <QuestionsSection
          styles={styles}
          questions={questions}
          showAllQuestions={showAllQuestions}
          animationHeight={animationHeight}
          handleSeeAllQuestions={boundHandlers.handleSeeAllQuestions}
          handleAskQuestion={boundHandlers.handleAskQuestion}
        />
        <DescriptionSection
          styles={styles}
          property={property}
          descriptionAnimationHeight={descriptionAnimationHeight}
          showExpandedDescription={showExpandedDescription}
          handleReadMore={boundHandlers.handleReadMore}
        />
      </ScrollView>

      {/* Modals */}
      <DatesModal
        isVisible={showPropertyDatesModal}
        onClose={() => setShowPropertyDatesModal(false)}
        colors={colors}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />

      <ImageModal
        visible={showImageModal}
        onClose={() => setShowImageModal(false)}
        styles={styles}
        colors={colors}
        theme={theme}
        property={property}
      />
      <MapModalWrapper
        visible={showMapModal}
        onClose={() => setShowMapModal(false)}
        region={
          property?.coordinates
            ? {
                latitude: property.coordinates.latitude,
                longitude: property.coordinates.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.01,
              }
            : undefined
        }
        markers={
          property?.coordinates
            ? [
                {
                  id: propertyId,
                  coordinate: {
                    latitude: property.coordinates.latitude,
                    longitude: property.coordinates.longitude,
                  },
                  title: property.name,
                  description: property.address,
                  price: property.price,
                },
              ]
            : []
        }
        properties={property ? [property] : []}
        onApply={(selectedProperty: any) => {
          // Navigate to booking confirmation screen
          navigation.navigate("PropertyConfirmationScreen", {
            property: selectedProperty,
            selectedDates: {
              checkIn:
                selectedDates.checkIn &&
                typeof selectedDates.checkIn.toISOString === "function"
                  ? selectedDates.checkIn.toISOString()
                  : selectedDates.checkIn || null,
              checkOut:
                selectedDates.checkOut &&
                typeof selectedDates.checkOut.toISOString === "function"
                  ? selectedDates.checkOut.toISOString()
                  : selectedDates.checkOut || null,
            },
            selectedGuests,
            bookingPriceOverride,
            bookingAltDateRange,
          });
        }}
        buttonText="Book Now"
      />
      <ReviewsModal
        visible={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        styles={styles}
        colors={colors}
        property={property}
      />
      <FacilitiesModal
        visible={showFacilitiesModal}
        onClose={() => setShowFacilitiesModal(false)}
        styles={styles}
        colors={colors}
        property={property}
      />
      <DescriptionModal
        visible={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
        styles={styles}
        colors={colors}
        theme={theme}
        openBookingWithOptions={(
          dates: { checkIn: Date | null; checkOut: Date | null } | null,
          price: any,
          altLabel: string | null,
        ) =>
          openBookingWithOptionsHelper(
            setBookingPriceOverride,
            setBookingAltDateRange,
            setSelectedDates,
            navigation,
            property,
            selectedGuests,
            dates,
            price,
            altLabel,
          )
        }
        property={property}
      />
      <ReviewsSummaryModal
        visible={showReviewsSummaryModal}
        onClose={() => setShowReviewsSummaryModal(false)}
        styles={styles}
        colors={colors}
        property={property}
      />
      <QuestionFormModal
        visible={showQuestionFormModal}
        onClose={boundHandlers.handleCancelQuestion}
        styles={styles}
        colors={colors}
        questionText={questionText}
        setQuestionText={setQuestionText}
        userName={userName}
        setUserName={setUserName}
        userCountry={userCountry}
        setUserCountry={setUserCountry}
        handleSubmitQuestion={boundHandlers.handleSubmitQuestion}
      />
      <GuestsModal
        isVisible={showPropertyGuestsModal}
        onClose={() => setShowPropertyGuestsModal(false)}
        colors={colors}
        selectedGuests={selectedGuests}
        setSelectedGuests={setSelectedGuests}
      />
      <PaymentMethodModal
        visible={showPaymentMethodModal}
        onClose={() => closePaymentModal(setShowPaymentMethodModal)}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        cardName={cardName}
        setCardName={setCardName}
        cardExpiry={cardExpiry}
        setCardExpiry={setCardExpiry}
        cardCvv={cardCvv}
        setCardCvv={setCardCvv}
        cardErrors={cardErrors}
        cardSubmitting={cardSubmitting}
        handleSubmitCard={handleSubmitCard}
        styles={styles}
        colors={colors}
        theme={theme}
      />
      <PaymentConfirmationModal
        visible={showPaymentConfirmationModal}
        onClose={() => setShowPaymentConfirmationModal(false)}
        confirmationCode={
          lastConfirmationCode ||
          Math.random().toString(36).substring(2, 8).toUpperCase()
        }
        colors={colors}
        theme={theme}
        styles={styles}
        navigation={navigation}
      />

      <View style={styles.fixedBookingButton}>
        <TouchableOpacity style={styles.bookNowButton} onPress={handleBookNow}>
          <Text style={styles.bookNowButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
