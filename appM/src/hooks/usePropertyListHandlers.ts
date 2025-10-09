import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { GuestData } from "../types/GuestData";
import { Property } from "../components/shared/modals/PropertyCard";
import { HotelApiService } from "../services/hotelApi";
import { SearchParams } from "../types/api.types";
import { RootStackParamList } from "../types/navigation";

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
  onReady?: () => void;
}

export const usePropertyListHandlers = ({
  searchParams,
  onBack,
  openExpandedSearch,
  onOpened,
  onReady,
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
  const [apiError, setApiError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const headerAnimatedOpacity = useRef(new Animated.Value(0)).current;
  const compactBarAnimatedOpacity = useRef(new Animated.Value(1)).current;

  const handleSearchPress = async () => {
    setSearchSubmitting(true);
    setApiError(null);

    try {
      // Build search parameters
      const searchParams: SearchParams = {};

      // Location/city search
      const raw = (selectedLocation || "").toLowerCase().trim();
      if (raw && raw !== "enter your destination") {
        const cityQuery = raw.split(",")[0].trim();
        searchParams.city = cityQuery;
      }

      // Date range
      if (selectedDates.checkIn && selectedDates.checkOut) {
        searchParams.from = selectedDates.checkIn.toISOString().split("T")[0];
        searchParams.to = selectedDates.checkOut.toISOString().split("T")[0];
      }

      // Guest parameters
      searchParams.adults = selectedGuests.adults;
      searchParams.children = selectedGuests.children;
      searchParams.rooms = selectedGuests.rooms;

      // Call the API
      const properties = await HotelApiService.listHotels(searchParams);

      if (properties.length === 0) {
        setFilteredApartments([]);
        setNoMatches(true);
      } else {
        setFilteredApartments(properties);
        setNoMatches(false);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Search failed");
      setFilteredApartments([]);
      setNoMatches(true);
    } finally {
      setSearchSubmitting(false);
    }
  };

  const handleShowAll = async () => {
    setSearchSubmitting(true);
    try {
      // Load all hotels without filters
      const properties = await HotelApiService.listHotels({});
      setFilteredApartments(properties);
      setNoMatches(false);
      setSelectedLocation("Enter your destination");
      if (isExpanded) collapseSearch();
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Failed to load properties",
      );
      setFilteredApartments([]);
      setNoMatches(true);
    } finally {
      setSearchSubmitting(false);
    }
  };

  const randomizeApartments = useCallback(() => {
    setFilteredApartments((prev) => {
      if (prev.length === 0) return prev;
      const shuffled = [...prev].sort(() => Math.random() - 0.5);
      // Optionally, take a random subset
      const subsetSize = Math.floor(Math.random() * shuffled.length) + 1;
      return shuffled.slice(0, subsetSize);
    });
  }, []);

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
      Animated.timing(headerAnimatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(compactBarAnimatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start((finished) => {
      if (finished && !isReady) {
        setIsReady(true);
      }
    });
  }, [
    animatedHeight,
    animatedOpacity,
    headerAnimatedOpacity,
    compactBarAnimatedOpacity,
    isReady,
  ]);

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
      Animated.timing(headerAnimatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(compactBarAnimatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsExpanded(false);
    });
  }, [
    animatedHeight,
    animatedOpacity,
    headerAnimatedOpacity,
    compactBarAnimatedOpacity,
  ]);

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
    try {
      if (onBack) {
        // If there's a custom onBack handler, use it
        onBack();
        return;
      }

      // Controlled navigation back to search screen
      const navigationState = navigation.getState();
      // ...existing code...

      // Always try to go back first to MainTabs, then navigate to Search
      if (navigationState.index > 0) {
        // We're in a stack, go back to MainTabs
        navigation.goBack();

        // After a short delay, ensure we're on the Search tab
        setTimeout(() => {
          try {
            const parent = navigation.getParent();
            if (parent) {
              // Navigate to Search tab if we're not already there
              parent.navigate("Search");
            }
          } catch (tabError) {
            console.warn("Could not navigate to Search tab:", tabError);
          }
        }, 150);
      } else {
        // We're already at the root, just navigate to Search tab
        try {
          const parent = navigation.getParent();
          if (parent) {
            parent.navigate("Search");
          } else {
            // If no parent, navigate to MainTabs (should not happen)
            navigation.navigate("MainTabs" as never);
          }
        } catch (navError) {
          console.warn("Could not navigate to search:", navError);
        }
      }
    } catch (error) {
      console.error("Navigation error in handleBackPress:", error);
      // Don't attempt any fallback navigation that might exit the app
    }
  };

  const handleLocationPress = () => {
    if (!isExpanded) {
      expandSearch();
    } else {
      setModalType("location" as ModalType);
    }
  };

  const handleDatesPress = () => {
    if (!isExpanded) {
      expandSearch();
    } else {
      setModalType("dates" as ModalType);
    }
  };

  const handleGuestsPress = () => {
    if (!isExpanded) {
      expandSearch();
    } else {
      setModalType("guests" as ModalType);
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
    } else {
      // If not expanding search, component is ready immediately
      if (!isReady) {
        setIsReady(true);
      }
    }
  }, [openExpandedSearch, expandSearch, isExpanded, onOpened, isReady]);

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

  // Load initial data when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      if (!filteredApartments || filteredApartments.length === 0) {
        // If we have search params from SearchScreen, perform search instead of loading all
        if (selectedLocation && selectedLocation !== "Enter your destination") {
          try {
            setSearchSubmitting(true);
            setApiError(null);

            // Build search parameters
            const searchParams: SearchParams = {};

            // Location/city search
            const raw = selectedLocation.toLowerCase().trim();
            if (raw && raw !== "enter your destination") {
              const cityQuery = raw.split(",")[0].trim();
              searchParams.city = cityQuery;
            }

            // Date range
            if (selectedDates.checkIn && selectedDates.checkOut) {
              searchParams.from = selectedDates.checkIn
                .toISOString()
                .split("T")[0];
              searchParams.to = selectedDates.checkOut
                .toISOString()
                .split("T")[0];
            }

            // Guest parameters
            searchParams.adults = selectedGuests.adults;
            searchParams.children = selectedGuests.children;
            searchParams.rooms = selectedGuests.rooms;

            // Call the API
            const properties = await HotelApiService.listHotels(searchParams);

            if (properties.length === 0) {
              setFilteredApartments([]);
              setNoMatches(true);
            } else {
              setFilteredApartments(properties);
              setNoMatches(false);
            }
          } catch (error) {
            console.error("Search failed:", error);
            setApiError(
              error instanceof Error ? error.message : "Search failed",
            );
            setFilteredApartments([]);
            setNoMatches(true);
          } finally {
            setSearchSubmitting(false);
            setIsLoading(false);
          }
        } else {
          // No search params, load all hotels
          try {
            const properties = await HotelApiService.listHotels({});
            setFilteredApartments(properties);
          } catch (error) {
            console.error("Failed to load initial properties:", error);
            setApiError(
              error instanceof Error
                ? error.message
                : "Failed to load properties",
            );
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    loadInitialData();
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
    apiError,
    isLoading,
    animatedHeight,
    animatedOpacity,
    headerAnimatedOpacity,
    compactBarAnimatedOpacity,
    handleSearchPress,
    handleShowAll,
    randomizeApartments,
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
  };
};
