import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSavedProperties } from "../../../hooks/SavedPropertiesContext";
import { useTheme } from "../../../hooks/ThemeContext";
import { getPropertyId } from "../../../utils/getPropertyId";

export type Property = {
  id?: string;
  title: string;
  rating: string | number;
  description: string;
  price: string | number;
  currency?: string;
  imageSource?: string | number | any;
  image?: string | number | any;
  images?: (string | number | any)[];
  location?: string;
  distance?: string;
  deal?: string;
  oldPrice?: string;
  taxesIncluded?: boolean;
  reviewCount?: number | string;
  ratingText?: string;
  stars?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  details?: any;
  // Server image data for property details
  media?: string[];
  rooms?: any[];
  guestReviews?: {
    overallRating?: number;
    overallLabel?: string;
    totalReviews?: number;
    categories?: {
      staff?: number;
      comfort?: number;
      freeWifi?: number;
      facilities?: number;
      valueForMoney?: number;
      cleanliness?: number;
      location?: number;
    };
  };
  propertyHighlights?: {
    perfectFor?: string;
    locationScore?: number;
    locationDescription?: string;
    roomsWith?: string[];
  };
  mostPopularFacilities?: string[];
  categories?: string[];
  surroundings?: {
    nearbyAttractions?: { name: string; distance: string }[];
    topAttractions?: { name: string; distance: string }[];
    restaurantsCafes?: { name: string; type: string; distance: string }[];
    naturalBeauty?: { name: string; type: string; distance: string }[];
    publicTransport?: { name: string; type: string; distance: string }[];
    closestAirports?: { name: string; distance: string }[];
  };
  overview?: {
    infoAndPrices?: string;
    activity?: string;
    facilities?: string;
    houseRules?: string;
    finePrint?: string;
    guestReviews?: string;
    travellersAsking?: string;
    hotelSurroundings?: string;
  };
  houseRules?: {
    checkIn?: { time?: string };
    pets?: { allowed?: boolean; note?: string };
  };
};

type PropertyCardProps = {
  property: Property;
  onPress: () => void;
};

export default function PropertyCard({ property, onPress }: PropertyCardProps) {
  // Single highlight: surroundings
  let surroundingsHighlight = null;
  if (property.surroundings) {
    const s = property.surroundings;
    if (s.nearbyAttractions && s.nearbyAttractions.length > 0) {
      surroundingsHighlight = `Near: ${s.nearbyAttractions[0].name} (${s.nearbyAttractions[0].distance})`;
    } else if (s.topAttractions && s.topAttractions.length > 0) {
      surroundingsHighlight = `Near: ${s.topAttractions[0].name} (${s.topAttractions[0].distance})`;
    } else if (s.restaurantsCafes && s.restaurantsCafes.length > 0) {
      surroundingsHighlight = `Near: ${s.restaurantsCafes[0].name}`;
    } else if (s.naturalBeauty && s.naturalBeauty.length > 0) {
      surroundingsHighlight = `Near: ${s.naturalBeauty[0].name}`;
    }
  }

  // Single highlight: overview
  let overviewHighlight = null;
  if (property.overview) {
    if (property.overview.infoAndPrices) {
      overviewHighlight = property.overview.infoAndPrices;
    } else if (property.overview.activity) {
      overviewHighlight = property.overview.activity;
    } else if (property.overview.facilities) {
      overviewHighlight = property.overview.facilities;
    }
  }

  // Single highlight: house rules
  let houseRuleHighlight = null;
  if (property.houseRules) {
    if (property.houseRules.checkIn?.time) {
      houseRuleHighlight = `Check-in: ${property.houseRules.checkIn.time}`;
    } else if (property.houseRules.pets) {
      houseRuleHighlight =
        property.houseRules.pets.allowed === false
          ? "No pets allowed"
          : property.houseRules.pets.note;
    }
  }
  // Hotel categories/tags
  const tags = property.categories;
  // Most popular facilities (amenities)
  const amenities = property.mostPopularFacilities;
  // Property highlights
  const highlights = property.propertyHighlights;
  // Guest review summary
  const guestReviews = property.guestReviews;
  const { colors } = useTheme(); // Hook for theme-based colors
  const { saveProperty, isSaved } = useSavedProperties(); // Context for managing saved properties

  // Calculate property ID using the same logic as other components for consistency
  const propertyId = getPropertyId(property);
  const handleSavePress = () => {
    // Check current saved state dynamically to ensure accuracy
    const isCurrentlySaved = isSaved(propertyId);

    // Use the same toggle approach as PropertyDetailsScreen for consistency
    // Ensure consistent structure
    const propertyToSave = {
      ...property,
      id: propertyId,
      title: property?.title ?? String(property?.id ?? ""),
    };

    // Call saveProperty which handles the toggle logic internally
    saveProperty(propertyToSave);

    // Show consistent alert messages like PropertyDetailsScreen
    if (isCurrentlySaved) {
      Alert.alert("Property removed", "Property removed from saved list.");
    } else {
      Alert.alert(
        "Property saved!",
        "You can view it in the Saved List screen.",
      );
    }
  };

  // Create styles with current theme colors
  const styles = createStyles(colors);
  const getCalculatedRating = () => {
    const stars = property.stars || 3;
    let min, max;
    if (stars >= 5) {
      min = 9.0;
      max = 10.0;
    } else if (stars >= 4) {
      min = 8.0;
      max = 8.9;
    } else if (stars >= 3) {
      min = 7.0;
      max = 7.9;
    } else {
      min = 6.0;
      max = 6.9;
    }
    const randomRating = (Math.random() * (max - min) + min).toFixed(1);
    return randomRating;
  };
  const renderStars = () => {
    const starCount =
      property.stars ||
      (() => {
        const rating = parseFloat(getCalculatedRating());

        // For ratings 8.5+ show 4-5 stars, for 7-8.4 show 3-4 stars, etc.
        return rating >= 9 ? 5 : rating >= 8.5 ? 4 : rating >= 7 ? 3 : 2;
      })();

    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <AntDesign
            key={index}
            name="star"
            size={14}
            color={index < starCount ? "#FFD700" : colors.gray}
          />
        ))}
      </View>
    );
  };

  const getRatingText = (rating: number) => {
    if (rating >= 9) return "Exceptional";
    if (rating >= 8.5) return "Very Good";
    if (rating >= 7.5) return "Good";
    if (rating >= 6.5) return "Pleasant";
    return "Fair";
  };

  const formatPrice = (price: string | number) => {
    const numPrice =
      typeof price === "string"
        ? price.replace(/[^\d]/g, "")
        : price.toString();
    const currencySymbol = "₪";
    return `${currencySymbol} ${numPrice}`;
  };

  const getOldPrice = () => {
    if (property.oldPrice) {
      return formatPrice(property.oldPrice);
    }
    // Generate a higher price for demonstration
    const currentPrice =
      typeof property.price === "string"
        ? parseInt(property.price.replace(/[^\d]/g, ""))
        : property.price;
    const oldPrice = Math.floor(currentPrice * 1.4);
    return formatPrice(oldPrice);
  };

  // Normalize image source to handle different formats properly
  const normalizeImageSource = (img: any) =>
    typeof img === "number"
      ? img
      : typeof img === "string"
        ? { uri: img }
        : img;

  // Get image source with proper fallback logic
  const imgSource: any = property.imageSource
    ? normalizeImageSource(property.imageSource)
    : property.image
      ? normalizeImageSource(property.image)
      : Array.isArray(property.images) && property.images.length > 0
        ? normalizeImageSource(property.images[0])
        : // fallback: pick a random hotel image from assets
          [
            require("../../../assets/images/hotel1.png"),
            require("../../../assets/images/hotel2.png"),
            require("../../../assets/images/hotel3.png"),
            require("../../../assets/images/hotel4.png"),
            require("../../../assets/images/hotel5.png"),
            require("../../../assets/images/hotel6.png"),
            require("../../../assets/images/hotel7.png"),
            require("../../../assets/images/hotel8.png"),
            require("../../../assets/images/hotel9.png"),
            require("../../../assets/images/hotel10.png"),
            require("../../../assets/images/hotel11.png"),
            require("../../../assets/images/hotel12.png"),
            require("../../../assets/images/hotel13.png"),
            require("../../../assets/images/hotel14.png"),
            require("../../../assets/images/hotel15.png"),
            require("../../../assets/images/hotel16.png"),
            require("../../../assets/images/hotel17.png"),
            require("../../../assets/images/hotel18.png"),
            require("../../../assets/images/hotel19.png"),
            require("../../../assets/images/hotel20.png"),
          ][Math.floor(Math.random() * 20)];

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={imgSource} style={styles.image} resizeMode="cover" />
        {/* Save (heart) button overlay */}
        <TouchableOpacity
          style={styles.heartContainer}
          onPress={handleSavePress}
        >
          <Ionicons
            name={isSaved(propertyId) ? "heart" : "heart-outline"}
            size={20}
            color={isSaved(propertyId) ? colors.red : "white"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {property.title}
            </Text>
            {renderStars()}
            {property.deal && (
              <View style={styles.geniusContainer}>
                <Text style={styles.geniusText}>Genius</Text>
              </View>
            )}
          </View>
        </View>

        {/* Property highlights */}
        {highlights && (
          <View style={{ marginBottom: 8 }}>
            {highlights.perfectFor && (
              <Text
                style={{
                  color: colors.green,
                  fontWeight: "bold",
                  marginBottom: 2,
                }}
              >
                {highlights.perfectFor}
              </Text>
            )}
            {highlights.locationScore && (
              <Text
                style={{
                  color: colors.blue,
                  fontWeight: "bold",
                  marginBottom: 2,
                }}
              >
                Location score: {highlights.locationScore.toFixed(1)}
              </Text>
            )}
            {highlights.roomsWith && highlights.roomsWith.length > 0 && (
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                Rooms with: {highlights.roomsWith.join(", ")}
              </Text>
            )}
          </View>
        )}

        {/* Single highlights: surroundings, overview, house rules */}
        {(surroundingsHighlight || overviewHighlight || houseRuleHighlight) && (
          <View style={{ marginBottom: 8 }}>
            {surroundingsHighlight && (
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  marginBottom: 2,
                }}
              >
                {surroundingsHighlight}
              </Text>
            )}
            {overviewHighlight && (
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  marginBottom: 2,
                }}
              >
                {overviewHighlight}
              </Text>
            )}
            {houseRuleHighlight && (
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {houseRuleHighlight}
              </Text>
            )}
          </View>
        )}

        {/* Amenities row */}
        {amenities && amenities.length > 0 && (
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}
          >
            {amenities.slice(0, 4).map((am, i) => (
              <Text
                key={am + i}
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  marginRight: 8,
                  backgroundColor: colors.background,
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderWidth: 1,
                  borderColor: colors.gray,
                  marginBottom: 2,
                }}
              >
                {am}
              </Text>
            ))}
            {amenities.length > 4 && (
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                +{amenities.length - 4} more
              </Text>
            )}
          </View>
        )}

        {/* Hotel categories/tags row */}
        {tags && tags.length > 0 && (
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}
          >
            {tags.slice(0, 3).map((tag, i) => (
              <Text
                key={tag + i}
                style={{
                  color: colors.blue,
                  fontSize: 12,
                  marginRight: 8,
                  backgroundColor: colors.background,
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderWidth: 1,
                  borderColor: colors.blue,
                  marginBottom: 2,
                }}
              >
                {tag}
              </Text>
            ))}
            {tags.length > 3 && (
              <Text style={{ color: colors.blue, fontSize: 12 }}>
                +{tags.length - 3} more
              </Text>
            )}
          </View>
        )}

        {/* Guest review summary */}
        {guestReviews && (
          <View style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: colors.text,
                  marginRight: 8,
                }}
              >
                {guestReviews.overallLabel || "Rating"}
              </Text>
              <Text
                style={{
                  color: colors.blue,
                  fontWeight: "bold",
                  marginRight: 8,
                }}
              >
                {getCalculatedRating()}
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                ({guestReviews.totalReviews || property.reviewCount} reviews)
              </Text>
            </View>
            {guestReviews.categories && (
              <View
                style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4 }}
              >
                {Object.entries(guestReviews.categories).map(([cat, val]) => (
                  <View
                    key={cat}
                    style={{
                      marginRight: 8,
                      marginBottom: 2,
                      backgroundColor: colors.background,
                      borderRadius: 4,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderWidth: 1,
                      borderColor: colors.gray,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: colors.text }}>
                      {cat
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      : {val?.toFixed(1)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.ratingRow}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingNumber}>{getCalculatedRating()}</Text>
          </View>
          <Text style={styles.ratingLabel}>
            {getRatingText(parseFloat(getCalculatedRating()))}
          </Text>
          <Text style={styles.reviewCount}>
            • {property.reviewCount || "1698"} reviews
          </Text>
        </View>

        <View style={styles.locationRow}>
          <MaterialIcons
            name="location-on"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.locationText}>
            {property.distance || "1 km from downtown"}
          </Text>
        </View>

        {property.deal && (
          <View style={styles.dealContainer}>
            <Text style={styles.dealText}>{property.deal}</Text>
          </View>
        )}

        <View style={styles.bottomRow}>
          <View style={styles.roomTypeContainer}>
            <Text style={styles.roomType}>
              Hotel room:{" "}
              {property.description.includes("bed")
                ? property.description
                : "1 bed"}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.oldPrice}>{getOldPrice()}</Text>
            <Text style={styles.currentPrice}>
              {formatPrice(property.price)}
            </Text>
          </View>
        </View>

        {property.taxesIncluded !== false && (
          <Text style={styles.taxesText}>Includes taxes and fees</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginHorizontal: 0,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "hidden",
      width: "100%",
      alignSelf: "flex-start",
    },
    imageContainer: {
      position: "relative",
      height: 200,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    heartContainer: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: 20,
      padding: 8,
    },
    content: {
      padding: 16,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    titleContainer: {
      flex: 1,
      marginRight: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    starsContainer: {
      flexDirection: "row",
      marginBottom: 4,
    },
    geniusContainer: {
      backgroundColor: colors.blue,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      alignSelf: "flex-start",
    },
    geniusText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    ratingBadge: {
      backgroundColor: colors.blue,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginRight: 8,
    },
    ratingNumber: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
    },
    ratingLabel: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
      marginRight: 4,
    },
    reviewCount: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    locationText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginLeft: 4,
    },
    dealContainer: {
      backgroundColor: colors.green,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      alignSelf: "flex-start",
      marginBottom: 12,
    },
    dealText: {
      color: colors.background,
      fontSize: 12,
      fontWeight: "bold",
    },
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 8,
    },
    roomTypeContainer: {
      flex: 1,
    },
    roomType: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "500",
    },
    priceContainer: {
      alignItems: "flex-end",
    },
    oldPrice: {
      color: colors.red,
      fontSize: 14,
      textDecorationLine: "line-through",
      marginBottom: 2,
    },
    currentPrice: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "bold",
    },
    taxesText: {
      color: colors.textSecondary,
      fontSize: 12,
    },
  });
