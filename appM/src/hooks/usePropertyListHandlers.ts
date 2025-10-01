import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { GuestData } from "../../components/search/GuestsModal";
import { Property } from "../../components/shared/PropertyCard";
import { demoApartments } from "../../data/demoApartments";
import { RootStackParamList } from "../../types/navigation";

type ModalType =
  | "location"
  | "dates"
  | "guests"
  | "sort"
  | "filter"
  | "map"
  | null;

interface UsePropertyListHandlersProps {
  searchParams?: {
    location?: string;
    dates?: { checkIn: Date | null; checkOut: Date | null };
    guests?: GuestData;
  };
  onBack?: () => void;
  openExpandedSearch?: boolean;
  onOpened?: () => void;
}

export const usePropertyListHandlers = ({
  searchParams,
  onBack,
  openExpandedSearch,
  onOpened,
}: UsePropertyListHandlersProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams?.location || "Enter your destination",
  );
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({
    checkIn: searchParams?.dates?.checkIn || null,
    checkOut: searchParams?.dates?.checkOut || null,
  });
  const [selectedGuests, setSelectedGuests] = useState<GuestData>({
    rooms: searchParams?.guests?.rooms || 1,
    adults: searchParams?.guests?.adults || 2,
    children: searchParams?.guests?.children || 0,
    childAges: searchParams?.guests?.childAges || [],
    pets: searchParams?.guests?.pets || false,
  });

  const [filteredApartments, setFilteredApartments] = useState<Property[]>([]);
  const [noMatches, setNoMatches] = useState(false);
  const [searchSubmitting, setSearchSubmitting] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(
    "Top Picks for Groups",
  );
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set(),
  );
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const apartments = demoApartments;

  const handleSearchPress = async () => {
    setSearchSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 2000));

      const raw = (selectedLocation || "").toLowerCase().trim();
      if (!raw || raw === "enter your destination") {
        setFilteredApartments(apartments ?? []);
        setNoMatches(false);
        return;
      }

      const query = raw.split(",")[0].trim();

      const matched = (apartments || []).filter((apt) => {
        if (!apt.location) return false;
        return apt.location.toLowerCase().includes(query);
      });
      if (!matched || matched.length === 0) {
        setFilteredApartments([]);
        setNoMatches(true);
      } else {
        setFilteredApartments(matched);
        setNoMatches(false);
      }
    } finally {
      setSearchSubmitting(false);
    }
  };

  const handleShowAll = () => {
    setFilteredApartments(apartments ?? []);
    setNoMatches(false);
    setSelectedLocation("Enter your destination");
    if (isExpanded) collapseSearch();
  };

  const formatDates = () => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      const checkIn = selectedDates.checkIn.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      const checkOut = selectedDates.checkOut.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      return `${checkIn} - ${checkOut}`;
    }
    return "Select dates";
  };

  const formatGuests = () => {
    if (
      !searchParams?.guests &&
      selectedGuests.rooms === 1 &&
      selectedGuests.adults === 2 &&
      selectedGuests.children === 0
    ) {
      return "Rooms & guests";
    }

    const roomText = selectedGuests.rooms === 1 ? "room" : "rooms";
    const adultText = selectedGuests.adults === 1 ? "adult" : "adults";

    let guestString = `${selectedGuests.rooms} ${roomText} • ${selectedGuests.adults} ${adultText}`;

    if (selectedGuests.children > 0) {
      const childText = selectedGuests.children === 1 ? "child" : "children";
      guestString += ` • ${selectedGuests.children} ${childText}`;
    }

    return guestString;
  };

  const expandSearch = useCallback(() => {
    setIsExpanded(true);
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: 240,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [animatedHeight, animatedOpacity]);

  const collapseSearch = useCallback(() => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsExpanded(false);
    });
  }, [animatedHeight, animatedOpacity]);

  const handleLocationModalClose = () => {
    setModalType(null);
    if (!isExpanded) {
      expandSearch();
    }
  };

  const handleDatesModalClose = () => {
    setModalType(null);
    if (!isExpanded) {
      expandSearch();
    }
  };

  const handleGuestsModalClose = () => {
    setModalType(null);
    if (!isExpanded) {
      expandSearch();
    }
  };

  const handleBackPress = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const handleLocationPress = () => {
    if (!isExpanded) {
      expandSearch();
    } else {
      setModalType("location" as ModalType);
    }
  };

  const handleOutsidePress = () => {
    if (isExpanded) {
      collapseSearch();
    }
  };

  useEffect(() => {
    if (openExpandedSearch) {
      if (!isExpanded) {
        expandSearch();
      }
      if (onOpened) {
        onOpened();
      }
    }
  }, [openExpandedSearch, expandSearch, isExpanded, onOpened]);

  useEffect(() => {
    if (modalType !== null && isExpanded) {
      collapseSearch();
    }
  }, [modalType, isExpanded, collapseSearch]);

  useEffect(() => {
    const parent = navigation.getParent();
    let unsubscribe: (() => void) | undefined;
    if (parent) {
      unsubscribe = parent.addListener("tabPress" as any, (e: any) => {
        const state = parent.getState();
        const tabIndex = state.index;
        const tabRoute = state.routes[tabIndex];
        if (tabRoute.name === "Search") {
          if (typeof e.preventDefault === "function") e.preventDefault();
          navigation.goBack();
        }
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
    if (
      (!filteredApartments || filteredApartments.length === 0) &&
      Array.isArray(apartments) &&
      apartments.length > 0
    ) {
      setFilteredApartments(apartments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
    handleBackPress,
    handleLocationPress,
    handleOutsidePress,
  };
};
