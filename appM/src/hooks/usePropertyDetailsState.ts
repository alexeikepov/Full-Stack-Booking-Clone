import { useEffect, useState } from "react";
import { Animated, Keyboard } from "react-native";
import { isBookingCardType } from "../components/propertyDetails/helpers/isBookingCardType";
import { isPropertyCardType } from "../components/propertyDetails/helpers/isPropertyCardType";
import { normalizeImageSource } from "../components/propertyDetails/utils";
import { GuestData } from "../components/search/GuestsModal";
import MOCK_PROPERTY_DATA from "../components/shared/MOCK_PROPERTY_DATA";
import createStyles from "../screens/propertyDetails/PropertyDetailsScreen.styles";
import { useBookings } from "./BookingsContext";
import { useSavedProperties } from "./SavedPropertiesContext";
import { useTheme } from "./ThemeContext";

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
  const [showAllQuestions] = useState(false);
  const [showQuestionFormModal] = useState(false);
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
  const [isScrolled] = useState<boolean>(false);
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
  const [showExpandedReviews] = useState(false);
  const [showExpandedDescription] = useState(false);
  const [showReviewsSummaryModal, setShowReviewsSummaryModal] = useState(false);
  const [showPropertyDatesModal, setShowPropertyDatesModal] = useState(false);
  const [showPropertyGuestsModal, setShowPropertyGuestsModal] = useState(false);
  const [questions] = useState(MOCK_PROPERTY_DATA.questions);
  const { isSaved } = useSavedProperties();
  const pd: any = route?.params?.propertyData || {};
  let property: any = { ...MOCK_PROPERTY_DATA };
  if (isPropertyCardType(pd)) {
    property.name = pd.title;
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
  } else if (isBookingCardType(pd)) {
    property.name = pd.propertyName;
    property.price = pd.price;
    property.address = pd.location;
    property.details = pd.details;
  }
  const propertyId = String(property.id ?? property.title);
  const saved = isSaved(propertyId);
  if (property.imageSource) {
    property.images = [normalizeImageSource(property.imageSource)];
  } else if (property.images && Array.isArray(property.images)) {
    property.images = property.images.map(normalizeImageSource);
  }
  if (!property.images || property.images.length === 0) {
    const hotelImages = [
      require("../../assets/images/hotel1.png"),
      require("../../assets/images/hotel2.png"),
      require("../../assets/images/hotel3.png"),
      require("../../assets/images/hotel4.png"),
      require("../../assets/images/hotel5.png"),
      require("../../assets/images/hotel6.png"),
      require("../../assets/images/hotel7.png"),
      require("../../assets/images/hotel8.png"),
      require("../../assets/images/hotel9.png"),
      require("../../assets/images/hotel10.png"),
      require("../../assets/images/hotel11.png"),
      require("../../assets/images/hotel12.png"),
      require("../../assets/images/hotel13.png"),
      require("../../assets/images/hotel14.png"),
      require("../../assets/images/hotel15.png"),
      require("../../assets/images/hotel16.png"),
      require("../../assets/images/hotel17.png"),
      require("../../assets/images/hotel18.png"),
      require("../../assets/images/hotel19.png"),
      require("../../assets/images/hotel20.png"),
    ];
    const hash = Array.from(propertyId).reduce(
      (acc, ch) => acc + ch.charCodeAt(0),
      0,
    );
    const index = hash % hotelImages.length;
    property.images = [hotelImages[index]];
  }
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
  };
}
