import { useEffect, useState, useMemo } from "react";
import { Animated, Keyboard } from "react-native";
import { isBookingCardType } from "../components/propertybookingscreens/propertyDetails/helpers/isBookingCardType";
import { isPropertyCardType } from "../components/propertybookingscreens/propertyDetails/helpers/isPropertyCardType";
import { normalizeImageSource } from "../components/propertybookingscreens/propertyDetails/helpers/utils";
import { GuestData } from "../types/GuestData";
import MOCK_PROPERTY_DATA from "../data/mockPropertyData";
import createStyles from "../screens/propertyBookingScreens/propertyDetails/PropertyDetailsScreen.styles";
import { HotelApiService } from "../services/hotelApi";
import { useBookings } from "./BookingsContext";
import { useTheme } from "./ThemeContext";
import { getPropertyId } from "../utils/getPropertyId";

export function usePropertyDetailsState(props: any) {
  const _props: any = props as any;
  const route = _props.route ?? {
    params: _props.propertyData ? { propertyData: _props.propertyData } : {},
  };
  const navigation = _props.navigation ?? {
    navigate: (name: string, params?: any) => {
      if (name === "Search" && typeof _props.onRebook === "function") {
        return _props.onRebook();
      }
      if (name === "MainTabs" && typeof _props.onBack === "function") {
        return _props.onBack();
      }
      return undefined;
    },
  };
  const [showExpandedFacilities, setShowExpandedFacilities] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showQuestionFormModal, setShowQuestionFormModal] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [userName, setUserName] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [confirmBookingError, setConfirmBookingError] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);
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
  const [showBookingSummaryModal, setShowBookingSummaryModal] = useState(false);
  const [bookingPriceOverride, setBookingPriceOverride] = useState<
    number | null
  >(null);
  const [bookingAltDateRange, setBookingAltDateRange] = useState<string | null>(
    null,
  );
  const [facilitiesAnimationHeight] = useState(new Animated.Value(0));
  const [animationHeight] = useState(new Animated.Value(0));
  const [reviewsAnimationHeight] = useState(new Animated.Value(0));
  const [descriptionAnimationHeight] = useState(new Animated.Value(0));
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showAllRatings, setShowAllRatings] = useState<boolean>(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardOpen(true),
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardOpen(false),
    );
    try {
      const navData =
        (props &&
          (props as any).route &&
          (props as any).route.params &&
          (props as any).route.params.propertyData) ||
        null;
      if (navData) {
        if (navData.dates) {
          const cd = navData.dates.checkIn
            ? new Date(navData.dates.checkIn)
            : null;
          const co = navData.dates.checkOut
            ? new Date(navData.dates.checkOut)
            : null;
          setSelectedDates({ checkIn: cd, checkOut: co });
        }
        if (navData.guests) {
          const g = navData.guests;
          setSelectedGuests({
            rooms: g.rooms ?? 1,
            adults: g.adults ?? 2,
            children: g.children ?? 0,
            childAges: g.childAges ?? [],
            pets: g.pets ?? false,
          });
        }
      }
    } catch {}
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [props]);
  const { colors, theme } = useTheme();
  const { addBooking } = useBookings();
  const styles = createStyles(colors, theme);
  if (!styles.monthHeader)
    styles.monthHeader = {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 15,
    };
  if (!styles.calendarGrid)
    styles.calendarGrid = {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    };
  if (!styles.calendarDayHeader)
    styles.calendarDayHeader = {
      width: "14%",
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 10,
    };
  if (!styles.calendarDay)
    styles.calendarDay = {
      width: "14%",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      minHeight: 40,
      borderRadius: 20,
    };
  if (!styles.selectedDay)
    styles.selectedDay = {
      backgroundColor: colors.button,
    };
  if (!styles.rangeDay)
    styles.rangeDay = {
      backgroundColor: `${colors.button}20`,
    };
  if (!styles.calendarDayText)
    styles.calendarDayText = {
      color: colors.text,
      fontSize: 16,
    };
  if (!styles.selectedDayText)
    styles.selectedDayText = {
      color: colors.background,
      fontWeight: "bold",
    };
  if (!styles.rangeDayText)
    styles.rangeDayText = {
      color: colors.button,
    };
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showFacilitiesModal, setShowFacilitiesModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showExpandedReviews, setShowExpandedReviews] = useState(false);
  const [showExpandedDescription, setShowExpandedDescription] = useState(false);
  const [showReviewsSummaryModal, setShowReviewsSummaryModal] = useState(false);
  const [showPropertyDatesModal, setShowPropertyDatesModal] = useState(false);
  const [showPropertyGuestsModal, setShowPropertyGuestsModal] = useState(false);
  const [questions, setQuestions] = useState(MOCK_PROPERTY_DATA.questions);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [propertyLoadError, setPropertyLoadError] = useState<string | null>(
    null,
  );
  const [apiProperty, setApiProperty] = useState<any>(null);
  const pd: any = useMemo(
    () => route?.params?.propertyData || {},
    [route?.params?.propertyData],
  );

  // Load property from API if we have a hotel ID AND we don't already have property data
  useEffect(() => {
    const loadPropertyFromApi = async () => {
      const propertyId = pd?.id || route?.params?.propertyId;
      // Only make API call if we have a propertyId, don't have API property yet,
      // and we don't already have sufficient property data from navigation params
      const hasPropertyData = pd && (pd.title || pd.name || pd.propertyName);
      // Force API call if we have property data but no house rules
      const needsHouseRules =
        hasPropertyData &&
        !pd?.houseRules &&
        !pd?.overview?.houseRules &&
        !(pd?.details && pd.details.houseRules) &&
        !/^\d+$/.test(pd?.id || ""); // Don't fetch for demo properties

      if (
        (propertyId && !apiProperty && !hasPropertyData) ||
        (needsHouseRules && propertyId && !apiProperty)
      ) {
        setIsLoadingProperty(true);
        setPropertyLoadError(null);
        try {
          const searchParams = {
            from: selectedDates.checkIn?.toISOString().split("T")[0],
            to: selectedDates.checkOut?.toISOString().split("T")[0],
            adults: selectedGuests.adults,
            children: selectedGuests.children,
            rooms: selectedGuests.rooms,
          };
          const property = await HotelApiService.getHotelById(
            propertyId,
            searchParams,
          );
          setApiProperty(property);
        } catch (error) {
          console.error("Failed to load property details:", error);
          setPropertyLoadError(
            error instanceof Error ? error.message : "Failed to load property",
          );
          // Don't let API errors block the screen when we have property data
          if (hasPropertyData) {
            setPropertyLoadError(null);
          }
        } finally {
          setIsLoadingProperty(false);
        }
      } else {
        // Skip API call when we have property data and don't need house rules
      }
    };

    loadPropertyFromApi();
  }, [pd, route?.params, selectedDates, selectedGuests, apiProperty]);

  let property: any = { ...MOCK_PROPERTY_DATA };

  // Use API property data if available, otherwise fall back to passed property data
  if (apiProperty) {
    property.name = apiProperty.title;
    property.title = apiProperty.title; // Ensure both name and title are set for consistency
    property.rating = apiProperty.averageRating;
    property.reviewCount = apiProperty.reviewCount;
    property.totalReviews =
      apiProperty.reviewsCount || apiProperty.reviewCount || 0;
    property.stars = apiProperty.stars;
    property.price = apiProperty.price;
    property.address = apiProperty.location;
    property.description = apiProperty.description;
    property.imageSource = apiProperty.imageSource;
    property.deal = apiProperty.deal;
    property.oldPrice = apiProperty.oldPrice;
    property.taxesIncluded = apiProperty.taxesIncluded;
    property.distance = apiProperty.distance;
    property.details = apiProperty.details;
    property.ratingText = apiProperty.ratingText;
    property.houseRules = apiProperty.houseRules;
    property.overview = apiProperty.overview;
    property.surroundings = apiProperty.surroundings;
    // Map detailed ratings from server guestReviews.categories to component expected format
    if (apiProperty.guestReviews?.categories) {
      property.ratings = {
        staff: apiProperty.guestReviews.categories.staff || 0,
        comfort: apiProperty.guestReviews.categories.comfort || 0,
        freeWifi: apiProperty.guestReviews.categories.freeWifi || 0,
        facilities: apiProperty.guestReviews.categories.facilities || 0,
        valueForMoney: apiProperty.guestReviews.categories.valueForMoney || 0,
        cleanliness: apiProperty.guestReviews.categories.cleanliness || 0,
        location: apiProperty.guestReviews.categories.location || 0,
      };
    }
  } else if (isPropertyCardType(pd)) {
    property.name = pd.title;
    property.title = pd.title; // Ensure both name and title are set for consistency
    if ("rating" in pd) property.rating = pd.rating;
    if ("reviewCount" in pd) property.reviewCount = pd.reviewCount;
    if ("price" in pd) property.price = pd.price;
    if ("location" in pd) property.address = pd.location;
    if ("description" in pd) property.description = pd.description;
    if ("shortDescription" in pd)
      property.shortDescription = pd.shortDescription;
    if ("imageSource" in pd) property.imageSource = pd.imageSource;
    if ("deal" in pd) property.deal = pd.deal;
    if ("oldPrice" in pd) property.oldPrice = pd.oldPrice;
    if ("taxesIncluded" in pd) property.taxesIncluded = pd.taxesIncluded;
    if ("distance" in pd) property.distance = pd.distance;
    if ("details" in pd) property.details = pd.details;
    if ("images" in pd) property.images = pd.images;
    if ("isAvailable" in pd) property.isAvailable = pd.isAvailable;
    if ("alternatives" in pd) property.alternatives = pd.alternatives;
    if ("ratings" in pd) property.ratings = pd.ratings;
    if ("facilities" in pd) property.facilities = pd.facilities;
    if ("reviews" in pd) property.reviews = pd.reviews;
    if ("questions" in pd) property.questions = pd.questions;
    if ("coordinates" in pd) property.coordinates = pd.coordinates;
    // Server image data
    if ("media" in pd) property.media = pd.media;
    if ("rooms" in pd) property.rooms = pd.rooms;
    if ("houseRules" in pd) property.houseRules = pd.houseRules;
    if ("overview" in pd) property.overview = pd.overview;
    if ("surroundings" in pd) property.surroundings = pd.surroundings;
  } else if (isBookingCardType(pd)) {
    property.name = pd.propertyName;
    property.title = pd.propertyName; // Ensure both name and title are set for consistency
    property.price = pd.price;
    property.address = pd.location;
    property.details = pd.details;
    if ("houseRules" in pd) property.houseRules = pd.houseRules;
    if ("overview" in pd) property.overview = pd.overview;
    if ("surroundings" in pd) property.surroundings = pd.surroundings;
  }
  const propertyId = getPropertyId(property);

  // ...existing code...

  // Function to collect all real images from server data
  const collectServerImages = (): string[] => {
    const serverImages: string[] = [];

    // ...existing code...

    // Add hotel-level media images
    if (property.media && Array.isArray(property.media)) {
      property.media.forEach((mediaItem: any) => {
        if (typeof mediaItem === "string") {
          serverImages.push(mediaItem);
        } else if (mediaItem?.url) {
          serverImages.push(mediaItem.url);
        }
      });
    }

    // Add room-level images from photos and media
    if (property.rooms && Array.isArray(property.rooms)) {
      property.rooms.forEach((room: any) => {
        // Add room photos
        if (room.photos && Array.isArray(room.photos)) {
          room.photos.forEach((photo: string) => {
            if (photo) serverImages.push(photo);
          });
        }

        // Add room media
        if (room.media && Array.isArray(room.media)) {
          room.media.forEach((mediaItem: any) => {
            if (typeof mediaItem === "string") {
              serverImages.push(mediaItem);
            } else if (mediaItem?.url) {
              serverImages.push(mediaItem.url);
            }
          });
        }
      });
    }

    // ...existing code...
    return serverImages;
  };

  // Fallback hotel images array (only used if no server images available)
  const fallbackHotelImages = [
    require("../assets/images/hotel1.png"),
    require("../assets/images/hotel2.png"),
    require("../assets/images/hotel3.png"),
    require("../assets/images/hotel4.png"),
    require("../assets/images/hotel5.png"),
    require("../assets/images/hotel6.png"),
    require("../assets/images/hotel7.png"),
    require("../assets/images/hotel8.png"),
    require("../assets/images/hotel9.png"),
    require("../assets/images/hotel10.png"),
    require("../assets/images/hotel11.png"),
    require("../assets/images/hotel12.png"),
    require("../assets/images/hotel13.png"),
    require("../assets/images/hotel14.png"),
    require("../assets/images/hotel15.png"),
    require("../assets/images/hotel16.png"),
    require("../assets/images/hotel17.png"),
    require("../assets/images/hotel18.png"),
    require("../assets/images/hotel19.png"),
    require("../assets/images/hotel20.png"),
  ];

  // Collect all server images first
  const serverImages = collectServerImages();

  // Process images: prioritize server images, fallback to local assets only if needed
  // ...existing code...

  if (property.imageSource && serverImages.length > 0) {
    // If there's a specific imageSource, use it as primary but add server images
    const primaryImage = normalizeImageSource(property.imageSource);
    const imageSourceUrl =
      typeof property.imageSource === "string"
        ? property.imageSource
        : property.imageSource?.uri;

    const additionalServerImages = serverImages
      .filter((img: string) => img !== imageSourceUrl)
      .map((img: string) => normalizeImageSource({ uri: img }));

    property.images = [primaryImage, ...additionalServerImages];
    // ...existing code...
  } else if (serverImages.length > 0) {
    // Use all server images if available
    property.images = serverImages.map((img: string) =>
      normalizeImageSource({ uri: img }),
    );
    // ...existing code...
  } else if (property.imageSource) {
    // Just use imageSource and add some fallback images
    const primaryImage = normalizeImageSource(property.imageSource);
    const hash = Array.from(propertyId).reduce(
      (acc, ch) => acc + ch.charCodeAt(0),
      0,
    );
    const startIndex = hash % fallbackHotelImages.length;
    const additionalImages = [];

    for (let i = 0; i < 7; i++) {
      // Add 7 more images
      const imageIndex = (startIndex + i) % fallbackHotelImages.length;
      additionalImages.push(fallbackHotelImages[imageIndex]);
    }

    property.images = [primaryImage, ...additionalImages];
    // ...existing code...
  } else if (
    property.images &&
    Array.isArray(property.images) &&
    property.images.length > 0
  ) {
    // Existing images provided
    property.images = property.images.map(normalizeImageSource);
    // ...existing code...
  } else {
    // Fallback to local assets only if no server images are available
    const hash = Array.from(propertyId).reduce(
      (acc, ch) => acc + ch.charCodeAt(0),
      0,
    );
    const startIndex = hash % fallbackHotelImages.length;
    const imageCount = 8 + (hash % 5); // 8-12 images
    const selectedImages = [];

    for (let i = 0; i < imageCount; i++) {
      const imageIndex = (startIndex + i) % fallbackHotelImages.length;
      selectedImages.push(fallbackHotelImages[imageIndex]);
    }

    property.images = selectedImages;
    // ...existing code...
  }

  // Final safety check - ensure we always have at least one image
  if (!property.images || property.images.length === 0) {
    // ...existing code...
    property.images = [fallbackHotelImages[0]];
  }

  // ...existing code...

  const handleShowMoreRatings = () => {
    setShowAllRatings((prev) => !prev);
  };
  return {
    _props,
    route,
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
    setIsScrolled,
    showAllRatings,
    setShowAllRatings,
    keyboardOpen,
    setKeyboardOpen,
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
    isLoadingProperty,
    propertyLoadError,
    handleShowMoreRatings,
  };
}
