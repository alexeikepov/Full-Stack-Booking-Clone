import { StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BookingSummaryModal from "../../components/propertyDetails/BookingSummaryModal";
import { handleConfirmBooking as handleConfirmBookingUtil } from "../../components/propertyDetails/handleConfirmBooking";
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
} from "../../components/propertyDetails/handlers";
import { openBookingWithOptions as openBookingWithOptionsHelper } from "../../components/propertyDetails/helpers/openBookingWithOptions";
import { parseAltDateRange } from "../../components/propertyDetails/helpers/parseAltDateRange";
import ImageGallery from "../../components/propertyDetails/ImageGallery";
import DescriptionModal from "../../components/propertyDetails/modals/DescriptionModal";
import FacilitiesModal from "../../components/propertyDetails/modals/FacilitiesModal";
import ImageModal from "../../components/propertyDetails/modals/ImageModal";
import MapModalWrapper from "../../components/propertyDetails/modals/MapModalWrapper";
import QuestionFormModal from "../../components/propertyDetails/modals/QuestionFormModal";
import ReviewsModal from "../../components/propertyDetails/modals/ReviewsModal";
import ReviewsSummaryModal from "../../components/propertyDetails/modals/ReviewsSummaryModal";
import PaymentConfirmationModal from "../../components/propertyDetails/PaymentConfirmationModal";
import PaymentMethodModal from "../../components/propertyDetails/PaymentMethodModal";
import PropertyHeader from "../../components/propertyDetails/PropertyHeader";
import BookingSection from "../../components/propertyDetails/sections/BookingSection";
import DescriptionSection from "../../components/propertyDetails/sections/DescriptionSection";
import FacilitiesSection from "../../components/propertyDetails/sections/FacilitiesSection";
import MapSection from "../../components/propertyDetails/sections/MapSection";
import QuestionsSection from "../../components/propertyDetails/sections/QuestionsSection";
import RatingsSection from "../../components/propertyDetails/sections/RatingsSection";
import ReviewsSection from "../../components/propertyDetails/sections/ReviewsSection";
import { DatesModal } from "../../components/search";
import GuestsModal from "../../components/search/GuestsModal";
import { resolveIcon } from "../../components/shared/iconMap";
import { useCardForm } from "../../hooks/useCardForm";
import { usePropertyDetailsState } from "../../hooks/usePropertyDetailsState";

// Import RootStackParamList from types if available, otherwise define a minimal version here
import type { RootStackParamList } from "../../types/navigation";

// If the above import fails, uncomment and adjust the following:
// type RootStackParamList = { PropertyDetailsScreen: undefined; /* add other screens as needed */ };

type PropertyDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  "PropertyDetailsScreen"
>;

export default function PropertyDetailsScreen(
  props: PropertyDetailsScreenProps
) {
  // Add bookingSubmitting state after other useState calls
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  // Restore missing state and handlers for payment modal and card form
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] =
    useState(false);
  // Cached random fallback price so a randomly chosen price stays stable
  // across re-renders and interactions.
  // const randomPriceFallbackRef = useRef<number | null>(null); // Remove if unused
  // Store the last generated confirmation code so the confirmation modal can show it
  const [lastConfirmationCode, setLastConfirmationCode] = useState<
    string | null
  >(null);
  // Card form state and handlers
  const {
    showPaymentDetails,
    setShowPaymentDetails,
    cardNumber,
    setCardNumber,
    cardName,
    setCardName,
    cardExpiry,
    setCardExpiry,
    cardCvv,
    setCardCvv,
    cardErrors,
    cardSubmittedSuccess,
    cardSubmitting,
    closePaymentModal,
    handleSubmitCard,
  } = useCardForm();

  const handleConfirmBooking = async () => {
    await handleConfirmBookingUtil({
      selectedDates,
      selectedGuests,
      cardSubmittedSuccess,
      bookingPriceOverride,
      property,
      propertyId,
      addBooking,
      setLastConfirmationCode,
      setShowBookingSummaryModal,
      setBookingPriceOverride,
      setBookingAltDateRange,
      setShowPaymentConfirmationModal,
      setConfirmBookingError,
      setBookingSubmitting,
    });
  };
  const {
    navigation,
    showExpandedFacilities,
    setShowExpandedFacilities,
    showAllQuestions,
    showQuestionFormModal,
    questionText,
    setQuestionText,
    userName,
    setUserName,
    userCountry,
    setUserCountry,
    confirmBookingError,
    setConfirmBookingError,
    showMapModal,
    setShowMapModal,
    selectedDates,
    setSelectedDates,
    selectedGuests,
    setSelectedGuests,
    showBookingSummaryModal,
    setShowBookingSummaryModal,
    bookingPriceOverride,
    setBookingPriceOverride,
    bookingAltDateRange,
    setBookingAltDateRange,
    facilitiesAnimationHeight,
    animationHeight,
    reviewsAnimationHeight,
    descriptionAnimationHeight,
    isScrolled,
    keyboardOpen,
    colors,
    theme,
    addBooking,
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
    showExpandedDescription,
    showReviewsSummaryModal,
    setShowReviewsSummaryModal,
    showPropertyDatesModal,
    setShowPropertyDatesModal,
    showPropertyGuestsModal,
    setShowPropertyGuestsModal,
    questions,
    saved,
    property,
    propertyId,
    handleShowMoreRatings,
  } = usePropertyDetailsState(props);

  // Booking handlers
  const handleBookNow = () => setShowBookingSummaryModal(true);
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
          <TouchableOpacity
            style={[
              styles.headerButton,
              isScrolled && styles.headerButtonScrolled,
            ]}
            onPress={handleSave}
          >
            <Ionicons
              name={saved ? "heart" : "heart-outline"}
              size={24}
              color={saved ? "#FF0000" : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.headerButton,
              { marginLeft: 8 },
              isScrolled && styles.headerButtonScrolled,
            ]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: keyboardOpen ? 500 : 100 }}
        onScroll={(event) => handleScroll(event, (v) => {})}
        scrollEventThrottle={16}
      >
        <ImageGallery
          styles={styles}
          property={property}
          onPress={() => handleImagePress(() => {})}
        />
        <PropertyHeader styles={styles} property={property} />
        <BookingSection
          styles={styles}
          colors={colors}
          selectedDates={selectedDates}
          handleDateChange={handleDateChange}
          selectedGuests={selectedGuests}
          handleRoomGuestChange={handleRoomGuestChange}
          property={property}
          parseAltDateRange={parseAltDateRange}
          openBookingWithOptions={(
            dates: { checkIn: Date | null; checkOut: Date | null } | null,
            price: any,
            altLabel: string | null
          ) =>
            openBookingWithOptionsHelper(
              setBookingPriceOverride,
              setBookingAltDateRange,
              setSelectedDates,
              setShowBookingSummaryModal,
              dates,
              price,
              altLabel
            )
          }
        />
        <MapSection
          styles={styles}
          colors={colors}
          property={property}
          handleMapPress={handleMapPress}
        />
        <RatingsSection
          styles={styles}
          property={property}
          handleShowReviewsSummary={() => setShowReviewsSummaryModal(true)}
          handleShowMoreRatings={handleShowMoreRatings}
          colors={colors}
        />
        <ReviewsSection
          styles={styles}
          property={property}
          reviewsAnimationHeight={reviewsAnimationHeight}
          showExpandedReviews={showExpandedReviews}
          handleShowAllReviews={handleShowAllReviews}
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
        <QuestionsSection
          styles={styles}
          questions={questions}
          showAllQuestions={showAllQuestions}
          animationHeight={animationHeight}
          handleSeeAllQuestions={handleSeeAllQuestions}
          handleAskQuestion={handleAskQuestion}
        />
        <DescriptionSection
          styles={styles}
          property={property}
          descriptionAnimationHeight={descriptionAnimationHeight}
          showExpandedDescription={showExpandedDescription}
          handleReadMore={handleReadMore}
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
                },
              ]
            : []
        }
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
          altLabel: string | null
        ) =>
          openBookingWithOptionsHelper(
            setBookingPriceOverride,
            setBookingAltDateRange,
            setSelectedDates,
            setShowBookingSummaryModal,
            dates,
            price,
            altLabel
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
        onClose={handleCancelQuestion}
        styles={styles}
        colors={colors}
        questionText={questionText}
        setQuestionText={setQuestionText}
        userName={userName}
        setUserName={setUserName}
        userCountry={userCountry}
        setUserCountry={setUserCountry}
        handleSubmitQuestion={handleSubmitQuestion}
      />
      <DatesModal
        isVisible={showPropertyDatesModal}
        onClose={() => setShowPropertyDatesModal(false)}
        colors={colors}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />
      <GuestsModal
        isVisible={showPropertyGuestsModal}
        onClose={() => setShowPropertyGuestsModal(false)}
        colors={colors}
        selectedGuests={selectedGuests}
        setSelectedGuests={setSelectedGuests}
      />
      <BookingSummaryModal
        visible={showBookingSummaryModal}
        onClose={() => {
          setShowBookingSummaryModal(false);
          setBookingPriceOverride(null);
          setBookingAltDateRange(null);
        }}
        property={property}
        selectedDates={selectedDates}
        selectedGuests={selectedGuests}
        bookingPriceOverride={bookingPriceOverride}
        bookingAltDateRange={bookingAltDateRange}
        cardSubmittedSuccess={cardSubmittedSuccess}
        cardErrors={cardErrors}
        cardNumber={cardNumber}
        cardName={cardName}
        cardExpiry={cardExpiry}
        cardCvv={cardCvv}
        cardSubmitting={cardSubmitting}
        showPaymentDetails={showPaymentDetails}
        setShowPaymentDetails={setShowPaymentDetails}
        handleSubmitCard={handleSubmitCard}
        handleConfirmBooking={handleConfirmBooking}
        confirmBookingError={confirmBookingError}
        styles={styles}
        colors={colors}
        keyboardOpen={keyboardOpen}
        setShowBookingSummaryModal={setShowBookingSummaryModal}
        setBookingPriceOverride={setBookingPriceOverride}
        setBookingAltDateRange={setBookingAltDateRange}
        setShowPropertyDatesModal={setShowPropertyDatesModal}
        setShowPropertyGuestsModal={setShowPropertyGuestsModal}
        bookingSubmitting={bookingSubmitting}
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
