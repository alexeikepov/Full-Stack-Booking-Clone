import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { faqData } from "../data/faqData";
import { RootStackParamList } from "../types/navigation";
import { formatDates } from "../utils/formatDates";
import { formatGuests } from "../utils/formatGuests";
import { handleCardPress } from "../utils/handleCardPress";
import { handleLocationOnlyPress } from "../utils/handleLocationOnlyPress";
import { useTheme } from "./ThemeContext";
import { useMessages } from "./MessagesContext";
import { useNotifications } from "./NotificationsContext";

export type GuestData = {
  rooms: number;
  adults: number;
  children: number;
  childAges: number[];
  pets: boolean;
};

export type ModalType = "location" | "dates" | "guests" | null;

export function useSearchScreenState() {
  // Theme and styles
  const { theme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Messages and notifications contexts
  const { markAllAsRead: markAllMessagesAsRead } = useMessages();
  const { markAllAsRead: markAllNotificationsAsRead } = useNotifications();

  // Modal and help state
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [isDirectHelpCenterOpen, setIsDirectHelpCenterOpen] = useState(false);
  const [activeHelpTab, setActiveHelpTab] = useState("Stays");
  const [openHelpQuestionIndex, setOpenHelpQuestionIndex] = useState<
    number | null
  >(null);

  // Modal close handlers
  const handleLocationModalClose = () => setModalType(null);
  const handleDatesModalClose = () => setModalType(null);
  const handleGuestsModalClose = () => setModalType(null);

  // Message/notification/help handlers
  const openMessages = () => {
    markAllMessagesAsRead();
    setShowMessagesModal(true);
  };
  const closeMessages = () => setShowMessagesModal(false);
  const openNotifications = () => {
    markAllNotificationsAsRead();
    setShowNotificationsModal(true);
  };
  const closeNotifications = () => setShowNotificationsModal(false);
  const onBack = () => navigation.goBack && navigation.goBack();
  const closeHelpCenter = () => setIsHelpCenterOpen(false);
  const openDirectHelpCenter = () => {
    setIsDirectHelpCenterOpen(true);
    closeMessages();
  };
  const closeDirectHelpCenter = () => setIsDirectHelpCenterOpen(false);

  const [selectedLocation, setSelectedLocation] = useState<string>(
    "Enter your destination",
  );
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
  const [modalType, setModalType] = useState<ModalType>(null);
  const [searchParamsForPropertyList, setSearchParamsForPropertyList] =
    useState<{
      location: string;
      dates: { checkIn: Date | null; checkOut: Date | null };
      guests: GuestData;
    } | null>(null);
  const [openExpandedSearch, setOpenExpandedSearch] = useState(false);
  const [showApartmentsList, setShowApartmentsList] = useState(false);
  const [isPropertyListReady, setIsPropertyListReady] = useState(false);

  // Genius modal state and handlers
  const [showGeniusModal, setShowGeniusModal] = useState(false);
  const handleGeniusCardPress = () => setShowGeniusModal(true);
  const handleCloseGeniusModal = () => setShowGeniusModal(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const handleOfferPress = () => setShowOfferModal(true);
  const handleCloseOfferModal = () => setShowOfferModal(false);
  const [activeTab, setActiveTab] = useState("Stays");
  const [returnToSameLocation, setReturnToSameLocation] = useState(false);
  const [directFlightsOnly, setDirectFlightsOnly] = useState(false);
  const [flightType, setFlightType] = useState("Round-trip");
  const [taxiType, setTaxiType] = useState("One-way");
  const [searchSubmitting, setSearchSubmitting] = useState(false);
  const tabIcons = {
    Stays: "bed-outline",
    "Car rental": "car-outline",
    Flights: "airplane-outline",
    Taxi: "car-sport-outline",
    Attractions: "sparkles-outline",
  };
  const handleSearch = async () => {
    closeMessages();
    setSearchSubmitting(true);
    try {
      setSearchParamsForPropertyList({
        location: selectedLocation,
        dates: selectedDates,
        guests: selectedGuests,
      });
      setIsPropertyListReady(false);
      setOpenExpandedSearch(true);
      setShowApartmentsList(true);
      // Note: searchSubmitting will be set to false when PropertyListScreen is ready
    } catch (error) {
      // Only set to false on error, otherwise wait for PropertyListScreen ready
      setSearchSubmitting(false);
      throw error;
    }
  };

  const handlePropertyListReady = () => {
    setIsPropertyListReady(true);
    setSearchSubmitting(false); // Hide loading when PropertyListScreen is ready
  };

  const handleClosePropertyList = () => {
    setShowApartmentsList(false);
    setSearchSubmitting(false); // Hide loading if PropertyListScreen is closed
    setIsPropertyListReady(false); // Reset ready state
  };

  const handleShowPropertyList = (params: {
    location: string;
    dates: { checkIn: Date | null; checkOut: Date | null };
    guests: GuestData;
  }) => {
    setSearchParamsForPropertyList(params);
    setIsPropertyListReady(false);
    setOpenExpandedSearch(true);
    setShowApartmentsList(true);
  };

  // Wrapper for card press that uses the proper loading management
  const handleCardPressWrapper = (
    location: string,
    dateString: string,
    guestString: string,
  ) => {
    handleCardPress(
      location,
      dateString,
      guestString,
      setSearchParamsForPropertyList,
      setShowApartmentsList,
    );
    setIsPropertyListReady(false); // Reset ready state for new property list
  };

  // Wrapper for location only press that uses the proper loading management
  const handleLocationOnlyPressWrapper = (location: string) => {
    handleLocationOnlyPress(
      location,
      selectedDates,
      selectedGuests,
      setSearchParamsForPropertyList,
      setShowApartmentsList,
    );
    setIsPropertyListReady(false); // Reset ready state for new property list
  };

  return {
    theme,
    colors,
    insets,
    showMessagesModal,
    setShowMessagesModal,
    showNotificationsModal,
    setShowNotificationsModal,
    isHelpCenterOpen,
    setIsHelpCenterOpen,
    isDirectHelpCenterOpen,
    setIsDirectHelpCenterOpen,
    activeHelpTab,
    setActiveHelpTab,
    openHelpQuestionIndex,
    setOpenHelpQuestionIndex,
    handleLocationModalClose,
    handleDatesModalClose,
    handleGuestsModalClose,
    openMessages,
    closeMessages,
    openNotifications,
    closeNotifications,
    onBack,
    closeHelpCenter,
    openDirectHelpCenter,
    closeDirectHelpCenter,
    selectedLocation,
    setSelectedLocation,
    selectedDates,
    setSelectedDates,
    selectedGuests,
    setSelectedGuests,
    modalType,
    setModalType,
    searchParamsForPropertyList,
    setSearchParamsForPropertyList,
    openExpandedSearch,
    setOpenExpandedSearch,
    showApartmentsList,
    setShowApartmentsList,
    handleClosePropertyList,
    handleShowPropertyList,
    handleCardPressWrapper,
    handleLocationOnlyPressWrapper,
    isPropertyListReady,
    handlePropertyListReady,
    showGeniusModal,
    setShowGeniusModal,
    handleGeniusCardPress,
    handleCloseGeniusModal,
    showOfferModal,
    setShowOfferModal,
    handleOfferPress,
    handleCloseOfferModal,
    activeTab,
    setActiveTab,
    returnToSameLocation,
    setReturnToSameLocation,
    directFlightsOnly,
    setDirectFlightsOnly,
    flightType,
    setFlightType,
    taxiType,
    setTaxiType,
    searchSubmitting,
    setSearchSubmitting,
    tabIcons,
    handleSearch,
    formatDates,
    formatGuests,
    handleCardPress,
    handleLocationOnlyPress,
    faqData,
  };
}
