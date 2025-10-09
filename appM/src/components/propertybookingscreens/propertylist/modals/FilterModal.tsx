import { AntDesign } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type StyleProp = any;

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  styles: StyleProp;
  selectedFilters?: Set<string>;
  setSelectedFilters?: (filters: Set<string>) => void;
  onApply?: () => void;
};

const PriceSlider = ({
  minValue = 30,
  maxValue = 400,
  onValueChange,
  styles,
}: {
  minValue?: number;
  maxValue?: number;
  onValueChange: (min: number, max: number) => void;
  styles: StyleProp;
}) => {
  const [currentMin, setCurrentMin] = useState(minValue);
  const [currentMax, setCurrentMax] = useState(maxValue);
  const [sliderWidth, setSliderWidth] = useState(300);
  const [, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

  // Refs to track gesture state
  const gestureState = useRef({
    isMinThumbActive: false,
    isMaxThumbActive: false,
    startValue: 0,
    initialPosition: 0,
  });

  const generatePriceData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      const height = Math.random() * 80 + 20;
      data.push(height);
    }
    return data;
  };

  const [priceData] = useState(generatePriceData());

  // Create pan responders for draggable thumbs
  const createPanResponder = (isMinThumb: boolean) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        setActiveThumb(isMinThumb ? "min" : "max");
        gestureState.current.isMinThumbActive = isMinThumb;
        gestureState.current.isMaxThumbActive = !isMinThumb;
        gestureState.current.startValue = isMinThumb ? currentMin : currentMax;
        gestureState.current.initialPosition =
          ((gestureState.current.startValue - minValue) /
            (maxValue - minValue)) *
          sliderWidth;
      },
      onPanResponderMove: (evt, panGestureState) => {
        const { dx } = panGestureState;
        const initialPos = gestureState.current.initialPosition;

        let newPosition = initialPos + dx;
        newPosition = Math.max(0, Math.min(sliderWidth, newPosition));

        const newValue =
          (newPosition / sliderWidth) * (maxValue - minValue) + minValue;
        const roundedValue = Math.round(newValue / 5) * 5; // Round to nearest 5

        if (isMinThumb) {
          const constrainedMin = Math.max(
            minValue,
            Math.min(roundedValue, currentMax - 10),
          );
          if (constrainedMin !== currentMin) {
            setCurrentMin(constrainedMin);
            onValueChange(constrainedMin, currentMax);
          }
        } else {
          const constrainedMax = Math.min(
            maxValue,
            Math.max(roundedValue, currentMin + 10),
          );
          if (constrainedMax !== currentMax) {
            setCurrentMax(constrainedMax);
            onValueChange(currentMin, constrainedMax);
          }
        }
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        setActiveThumb(null);
        gestureState.current.isMinThumbActive = false;
        gestureState.current.isMaxThumbActive = false;
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        setActiveThumb(null);
        gestureState.current.isMinThumbActive = false;
        gestureState.current.isMaxThumbActive = false;
      },
    });
  };

  const minThumbPanResponder = createPanResponder(true);
  const maxThumbPanResponder = createPanResponder(false);

  const minPercentage = ((currentMin - minValue) / (maxValue - minValue)) * 100;
  const maxPercentage = ((currentMax - minValue) / (maxValue - minValue)) * 100;

  // Calculate thumb positions (accounting for larger thumb size)
  const minThumbLeft =
    ((currentMin - minValue) / (maxValue - minValue)) * sliderWidth - 15;
  const maxThumbLeft =
    ((currentMax - minValue) / (maxValue - minValue)) * sliderWidth - 15;
  const activeRangeWidth =
    ((currentMax - currentMin) / (maxValue - minValue)) * sliderWidth;
  const activeRangeLeft =
    ((currentMin - minValue) / (maxValue - minValue)) * sliderWidth;

  return (
    <View style={styles.priceSliderContainer}>
      <View style={styles.priceGraphContainer}>
        <View style={styles.priceGraph}>
          {priceData.map((height, index) => {
            const barPercentage = (index / (priceData.length - 1)) * 100;
            const isInRange =
              barPercentage >= minPercentage && barPercentage <= maxPercentage;
            return (
              <View
                key={index}
                style={[
                  styles.priceBar,
                  {
                    height: height,
                    backgroundColor: isInRange ? "#007BFF" : "#E0E0E0",
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Price range display */}
        <View style={styles.priceRangeDisplay}>
          <Text style={styles.priceRangeText}>
            €{currentMin} - €{currentMax}
          </Text>
        </View>

        {/* Draggable slider track */}
        <View
          style={styles.sliderTrackContainer}
          onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
        >
          <View style={styles.sliderTrack}>
            {/* Active range highlight */}
            <View
              style={[
                styles.sliderActiveRange,
                {
                  left: activeRangeLeft,
                  width: activeRangeWidth,
                },
              ]}
            />

            {/* Min thumb */}
            <View
              style={[
                styles.sliderThumb,
                {
                  left: minThumbLeft,
                  backgroundColor:
                    activeThumb === "min"
                      ? "rgba(0, 123, 255, 0.2)"
                      : "transparent",
                },
              ]}
              {...minThumbPanResponder.panHandlers}
            >
              <View
                style={[
                  styles.sliderThumbInner,
                  activeThumb === "min" && styles.sliderThumbActive,
                ]}
              />
            </View>

            {/* Max thumb */}
            <View
              style={[
                styles.sliderThumb,
                {
                  left: maxThumbLeft,
                  backgroundColor:
                    activeThumb === "max"
                      ? "rgba(0, 123, 255, 0.2)"
                      : "transparent",
                },
              ]}
              {...maxThumbPanResponder.panHandlers}
            >
              <View
                style={[
                  styles.sliderThumbInner,
                  activeThumb === "max" && styles.sliderThumbActive,
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const FilterSection = ({
  title,
  children,
  styles,
  showMore = false,
  onToggleShowMore,
}: {
  title: string;
  children: React.ReactNode;
  styles: StyleProp;
  showMore?: boolean;
  onToggleShowMore?: () => void;
}) => (
  <View style={styles.filterSection}>
    <Text style={styles.sectionHeader}>{title}</Text>
    {children}
    {onToggleShowMore && (
      <TouchableOpacity
        onPress={onToggleShowMore}
        style={styles.showMoreButton}
      >
        <Text style={styles.showMoreText}>
          {showMore ? "Show less" : "Show more"}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

const FilterItem = ({
  text,
  count,
  isSelected,
  onToggle,
  styles,
}: {
  text: string;
  count?: number;
  isSelected: boolean;
  onToggle: () => void;
  styles: StyleProp;
}) => (
  <TouchableOpacity onPress={onToggle} style={styles.filterItem}>
    <Text style={styles.filterItemText}>
      {text} {count !== undefined && `(${count})`}
    </Text>
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && <AntDesign name="check" size={12} color="#FFFFFF" />}
    </View>
  </TouchableOpacity>
);

const CounterItem = ({
  label,
  count,
  onIncrement,
  onDecrement,
  styles,
}: {
  label: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  styles: StyleProp;
}) => (
  <View style={styles.counterItem}>
    <Text style={styles.counterLabel}>{label}</Text>
    <View style={styles.counterControls}>
      <TouchableOpacity
        onPress={onDecrement}
        style={[
          styles.counterButton,
          count === 0 && styles.counterButtonDisabled,
        ]}
        disabled={count === 0}
      >
        <Text
          style={[
            styles.counterButtonText,
            count === 0 && styles.counterButtonTextDisabled,
          ]}
        >
          −
        </Text>
      </TouchableOpacity>
      <Text style={styles.counterValue}>{count}</Text>
      <TouchableOpacity onPress={onIncrement} style={styles.counterButton}>
        <Text style={styles.counterButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const FilterModal = ({
  isVisible,
  onClose,
  styles,
  selectedFilters: externalSelectedFilters = new Set(),
  setSelectedFilters: setExternalSelectedFilters,
  onApply,
}: ModalProps) => {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    externalSelectedFilters,
  );
  const [priceRange, setPriceRange] = useState({ min: 30, max: 400 });
  const [matchingProperties, setMatchingProperties] = useState(1136);
  const [additionalProperties, setAdditionalProperties] = useState(325);
  const [showMoreSections, setShowMoreSections] = useState<{
    [key: string]: boolean;
  }>({});

  // Room and bed counters
  const [bedrooms, setBedrooms] = useState(0);
  const [beds, setBeds] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with external state
  useEffect(() => {
    setSelectedFilters(externalSelectedFilters);
  }, [externalSelectedFilters]);

  // Filter data based on the images
  const filterData = {
    popularFilters: [
      { text: "Hotels", count: 275 },
      { text: "Breakfast included", count: 284 },
      { text: "Very Good: 8+", count: 731 },
      { text: "5 stars", count: 45 },
      { text: "Free parking", count: 156 },
      { text: "Parking", count: 298 },
      { text: "Air conditioning", count: 542 },
    ],
    propertyRating: [
      { text: "Unrated", count: 12 },
      { text: "2 stars", count: 45 },
      { text: "3 stars", count: 156 },
      { text: "4 stars", count: 298 },
      { text: "5 stars", count: 89 },
    ],
    locationScore: [
      { text: "Pleasant Location: 6+", count: 342 },
      { text: "Good Location: 7+", count: 267 },
      { text: "Very Good Location: 8+", count: 189 },
      { text: "Excellent Location: 9+", count: 98 },
    ],
    reviewScore: [
      { text: "Wonderful: 9+", count: 98 },
      { text: "Very Good: 8+", count: 267 },
      { text: "Good: 7+", count: 342 },
      { text: "Pleasant: 6+", count: 456 },
      { text: "Fair: 5+", count: 567 },
    ],
    freeCancellation: [{ text: "Free cancellation", count: 295 }],
    onlinePayment: [{ text: "Accepts online payments", count: 892 }],
    deals: [{ text: "All deals", count: 124 }],
    certifications: [{ text: "Sustainability certification", count: 78 }],
    distance: [
      { text: "Less than 1 km", count: 89 },
      { text: "Less than 3 km", count: 234 },
      { text: "Less than 5 km", count: 456 },
      { text: "Less than 10 km", count: 678 },
    ],
    chain: [
      { text: "Ibis", count: 12 },
      { text: "Holiday Inn Express", count: 8 },
      { text: "Novotel", count: 6 },
      { text: "Doubletree by Hilton", count: 4 },
      { text: "Sheraton", count: 3 },
      { text: "Marriott", count: 7 },
      { text: "Hilton", count: 9 },
      { text: "AccorHotels", count: 15 },
    ],
    roomAccessibility: [
      { text: "Upper floors accessible by elevator", count: 234 },
      { text: "Wheelchair accessible", count: 156 },
      { text: "Roll-in shower", count: 89 },
      { text: "Grab rails in bathroom", count: 123 },
    ],
    propertyAccessibility: [
      { text: "Accessible parking", count: 167 },
      { text: "Braille or raised signage", count: 45 },
      { text: "Lowered sink", count: 78 },
    ],
    meals: [
      { text: "Breakfast included", count: 284 },
      { text: "All-inclusive", count: 23 },
      { text: "Breakfast & dinner included", count: 67 },
      { text: "Kitchen facilities", count: 189 },
    ],
    bedPreference: [
      { text: "Double bed", count: 456 },
      { text: "2 single beds", count: 234 },
      { text: "King size bed", count: 167 },
      { text: "Twin beds", count: 123 },
    ],
    landmarks: [
      { text: "Villa Pallavicino Park", count: 12 },
      { text: "Villa Panza", count: 8 },
      { text: "Colosseum", count: 45 },
      { text: "Roman Forum", count: 67 },
      { text: "Pantheon", count: 89 },
      { text: "Trevi Fountain", count: 123 },
    ],
    propertyFacilities: [
      { text: "Free parking", count: 156 },
      { text: "Swimming pool", count: 89 },
      { text: "Parking", count: 298 },
      { text: "Pet friendly", count: 167 },
      { text: "Spa", count: 45 },
      { text: "Fitness center", count: 123 },
      { text: "Restaurant", count: 234 },
      { text: "Bar", count: 189 },
    ],
    roomFacilities: [
      { text: "Air conditioning", count: 542 },
      { text: "Balcony", count: 234 },
      { text: "Kitchen/Kitchenette", count: 167 },
      { text: "Free WiFi", count: 678 },
      { text: "TV", count: 589 },
      { text: "Mini-bar", count: 123 },
    ],
    propertyType: [
      { text: "Hotels", count: 275 },
      { text: "Apartments", count: 189 },
      { text: "Motels", count: 45 },
      { text: "Hostels", count: 67 },
      { text: "Vacation Homes", count: 123 },
      { text: "Bed & Breakfasts", count: 89 },
      { text: "Guest houses", count: 56 },
      { text: "Villas", count: 34 },
    ],
  };

  const updateMatchingProperties = useCallback(() => {
    // Calculate matching properties based on selected filters
    const baseProperties = 1136;
    const filterCount = selectedFilters.size;

    // Simulate realistic property count changes
    let newCount = baseProperties;
    if (filterCount > 0) {
      newCount = Math.max(
        50,
        baseProperties - filterCount * 50 + Math.floor(Math.random() * 100),
      );
    }

    setMatchingProperties(newCount);
    setAdditionalProperties(
      Math.floor(newCount * 0.3) + Math.floor(Math.random() * 100),
    );
  }, [selectedFilters.size]);

  const toggleFilter = (filterId: string) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(filterId)) {
      newFilters.delete(filterId);
    } else {
      newFilters.add(filterId);
    }
    setSelectedFilters(newFilters);
    if (setExternalSelectedFilters) {
      setExternalSelectedFilters(newFilters);
    }
  };

  const resetFilters = () => {
    const emptyFilters = new Set<string>();
    setSelectedFilters(emptyFilters);
    if (setExternalSelectedFilters) {
      setExternalSelectedFilters(emptyFilters);
    }
    setPriceRange({ min: 30, max: 400 });
    setBedrooms(0);
    setBeds(0);
    setBathrooms(0);
    setShowMoreSections({});
    setMatchingProperties(1136);
    setAdditionalProperties(325);
  };

  const toggleShowMore = (section: string) => {
    setShowMoreSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Update properties count when filters change
  useEffect(() => {
    updateMatchingProperties();
  }, [selectedFilters, priceRange, updateMatchingProperties]);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer} pointerEvents="box-none">
        <View style={styles.filterHeader}>
          <TouchableOpacity onPress={onClose} style={styles.filterCloseButton}>
            <AntDesign
              name="close"
              size={24}
              color={styles.secondaryText.color}
            />
          </TouchableOpacity>
          <Text style={styles.filterTitle}>Filter by</Text>
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.filterReset}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ paddingHorizontal: 15 }}>
          {/* Budget Section */}
          <FilterSection title="Your budget (for 1 night)" styles={styles}>
            <Text style={styles.budgetValue}>
              € {priceRange.min} - € {priceRange.max} +
            </Text>
            <PriceSlider
              minValue={30}
              maxValue={400}
              onValueChange={(min, max) => setPriceRange({ min, max })}
              styles={styles}
            />
          </FilterSection>

          {/* Popular Filters */}
          <FilterSection title="Popular Filters" styles={styles}>
            {filterData.popularFilters.map((filter, index) => (
              <FilterItem
                key={`popular-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`popular-${index}`)}
                onToggle={() => toggleFilter(`popular-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Property Rating */}
          <FilterSection
            title="Property rating"
            styles={styles}
            showMore={showMoreSections.propertyRating}
            onToggleShowMore={() => toggleShowMore("propertyRating")}
          >
            <Text style={styles.sectionSubtitle}>
              Find high-quality hotels and vacation rentals
            </Text>
            {filterData.propertyRating
              .slice(0, showMoreSections.propertyRating ? undefined : 3)
              .map((filter, index) => (
                <FilterItem
                  key={`rating-${index}`}
                  text={filter.text}
                  count={filter.count}
                  isSelected={selectedFilters.has(`rating-${index}`)}
                  onToggle={() => toggleFilter(`rating-${index}`)}
                  styles={styles}
                />
              ))}
          </FilterSection>

          {/* Location Score */}
          <FilterSection title="Location Score" styles={styles}>
            {filterData.locationScore.map((filter, index) => (
              <FilterItem
                key={`location-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`location-${index}`)}
                onToggle={() => toggleFilter(`location-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Review Score */}
          <FilterSection title="Review Score" styles={styles}>
            {filterData.reviewScore.map((filter, index) => (
              <FilterItem
                key={`review-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`review-${index}`)}
                onToggle={() => toggleFilter(`review-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Free Cancellation */}
          <FilterSection title="Free cancellation" styles={styles}>
            {filterData.freeCancellation.map((filter, index) => (
              <FilterItem
                key={`cancellation-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`cancellation-${index}`)}
                onToggle={() => toggleFilter(`cancellation-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Online Payment */}
          <FilterSection title="Online Payment" styles={styles}>
            {filterData.onlinePayment.map((filter, index) => (
              <FilterItem
                key={`payment-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`payment-${index}`)}
                onToggle={() => toggleFilter(`payment-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Deals */}
          <FilterSection title="Deals" styles={styles}>
            {filterData.deals.map((filter, index) => (
              <FilterItem
                key={`deals-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`deals-${index}`)}
                onToggle={() => toggleFilter(`deals-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Certifications */}
          <FilterSection title="Certifications" styles={styles}>
            {filterData.certifications.map((filter, index) => (
              <FilterItem
                key={`cert-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`cert-${index}`)}
                onToggle={() => toggleFilter(`cert-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Distance from city center */}
          <FilterSection title="Distance from city center" styles={styles}>
            {filterData.distance.map((filter, index) => (
              <FilterItem
                key={`distance-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`distance-${index}`)}
                onToggle={() => toggleFilter(`distance-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Chain */}
          <FilterSection
            title="Chain"
            styles={styles}
            showMore={showMoreSections.chain}
            onToggleShowMore={() => toggleShowMore("chain")}
          >
            {filterData.chain
              .slice(0, showMoreSections.chain ? undefined : 5)
              .map((filter, index) => (
                <FilterItem
                  key={`chain-${index}`}
                  text={filter.text}
                  count={filter.count}
                  isSelected={selectedFilters.has(`chain-${index}`)}
                  onToggle={() => toggleFilter(`chain-${index}`)}
                  styles={styles}
                />
              ))}
          </FilterSection>

          {/* Room Accessibility */}
          <FilterSection
            title="Room Accessibility"
            styles={styles}
            showMore={showMoreSections.roomAccess}
            onToggleShowMore={() => toggleShowMore("roomAccess")}
          >
            {filterData.roomAccessibility
              .slice(0, showMoreSections.roomAccess ? undefined : 2)
              .map((filter, index) => (
                <FilterItem
                  key={`room-access-${index}`}
                  text={filter.text}
                  count={filter.count}
                  isSelected={selectedFilters.has(`room-access-${index}`)}
                  onToggle={() => toggleFilter(`room-access-${index}`)}
                  styles={styles}
                />
              ))}
          </FilterSection>

          {/* Property Accessibility */}
          <FilterSection title="Property Accessibility" styles={styles}>
            {filterData.propertyAccessibility.map((filter, index) => (
              <FilterItem
                key={`prop-access-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`prop-access-${index}`)}
                onToggle={() => toggleFilter(`prop-access-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Meals */}
          <FilterSection title="Meals" styles={styles}>
            {filterData.meals.map((filter, index) => (
              <FilterItem
                key={`meals-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`meals-${index}`)}
                onToggle={() => toggleFilter(`meals-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Bed Preference */}
          <FilterSection title="Bed Preference" styles={styles}>
            {filterData.bedPreference.map((filter, index) => (
              <FilterItem
                key={`bed-pref-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`bed-pref-${index}`)}
                onToggle={() => toggleFilter(`bed-pref-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Landmarks */}
          <FilterSection title="Landmarks" styles={styles}>
            {filterData.landmarks.map((filter, index) => (
              <FilterItem
                key={`landmarks-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`landmarks-${index}`)}
                onToggle={() => toggleFilter(`landmarks-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Property facilities */}
          <FilterSection
            title="Property facilities"
            styles={styles}
            showMore={showMoreSections.propFacilities}
            onToggleShowMore={() => toggleShowMore("propFacilities")}
          >
            {filterData.propertyFacilities
              .slice(0, showMoreSections.propFacilities ? undefined : 5)
              .map((filter, index) => (
                <FilterItem
                  key={`prop-fac-${index}`}
                  text={filter.text}
                  count={filter.count}
                  isSelected={selectedFilters.has(`prop-fac-${index}`)}
                  onToggle={() => toggleFilter(`prop-fac-${index}`)}
                  styles={styles}
                />
              ))}
          </FilterSection>

          {/* Room Facilities */}
          <FilterSection title="Room Facilities" styles={styles}>
            {filterData.roomFacilities.map((filter, index) => (
              <FilterItem
                key={`room-fac-${index}`}
                text={filter.text}
                count={filter.count}
                isSelected={selectedFilters.has(`room-fac-${index}`)}
                onToggle={() => toggleFilter(`room-fac-${index}`)}
                styles={styles}
              />
            ))}
          </FilterSection>

          {/* Property Type */}
          <FilterSection
            title="Property Type"
            styles={styles}
            showMore={showMoreSections.propertyType}
            onToggleShowMore={() => toggleShowMore("propertyType")}
          >
            {filterData.propertyType
              .slice(0, showMoreSections.propertyType ? undefined : 5)
              .map((filter, index) => (
                <FilterItem
                  key={`prop-type-${index}`}
                  text={filter.text}
                  count={filter.count}
                  isSelected={selectedFilters.has(`prop-type-${index}`)}
                  onToggle={() => toggleFilter(`prop-type-${index}`)}
                  styles={styles}
                />
              ))}
          </FilterSection>

          {/* Rooms and beds */}
          <FilterSection title="Rooms and beds" styles={styles}>
            <CounterItem
              label="Bedrooms"
              count={bedrooms}
              onIncrement={() => setBedrooms((prev) => prev + 1)}
              onDecrement={() => setBedrooms((prev) => Math.max(0, prev - 1))}
              styles={styles}
            />
            <CounterItem
              label="Beds"
              count={beds}
              onIncrement={() => setBeds((prev) => prev + 1)}
              onDecrement={() => setBeds((prev) => Math.max(0, prev - 1))}
              styles={styles}
            />
            <CounterItem
              label="Private bathrooms"
              count={bathrooms}
              onIncrement={() => setBathrooms((prev) => prev + 1)}
              onDecrement={() => setBathrooms((prev) => Math.max(0, prev - 1))}
              styles={styles}
            />
          </FilterSection>
        </ScrollView>

        <View style={styles.filterFooter}>
          <Text style={styles.matchCount}>
            {matchingProperties} matching properties
          </Text>
          <Text style={styles.subMatchCount}>
            + {additionalProperties} other properties
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsLoading(true);
              onApply?.();
              setTimeout(() => {
                setIsLoading(false);
                onClose();
              }, 1000);
            }}
            style={styles.showResultsButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.showResultsText}>Show results</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
