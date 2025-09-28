import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSavedProperties } from "../hooks/SavedPropertiesContext";
import { useTheme } from "../hooks/ThemeContext";

export type Property = {
  id?: string;
  title: string;
  rating: string | number;
  description: string;
  price: string | number;
  imageSource: string;
  location?: string;
  distance?: string;
  deal?: string;
  oldPrice?: string;
  taxesIncluded?: boolean;
  reviewCount?: number | string;
  ratingText?: string;
  details?: any;
};

type PropertyCardProps = {
  property: Property;
  onPress: () => void;
};

export default function PropertyCard({ property, onPress }: PropertyCardProps) {
  const { colors } = useTheme();
  const { saveProperty, isSaved } = useSavedProperties();
  const styles = createStyles(colors);

  const propertyId = String(property.id ?? property.title);

  // Always derive saved state from the context (single source of truth)
  const isPropertySaved = isSaved(propertyId);

  const handleSavePress = () => {
    saveProperty(property);
    // Use the previous value to decide which toast/alert to show
    if (!isPropertySaved) {
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Property saved! You can view it in the Saved List screen.",
          ToastAndroid.SHORT,
        );
      } else {
        Alert.alert(
          "Property saved!",
          "You can view it in the Saved List screen.",
        );
      }
    } else {
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Property removed from saved list.",
          ToastAndroid.SHORT,
        );
      } else {
        Alert.alert("Property removed", "Property removed from saved list.");
      }
    }
  };
  const renderStars = () => {
    const rating =
      typeof property.rating === "string"
        ? parseFloat(property.rating)
        : property.rating;

    // For ratings 8.5+ show 4-5 stars, for 7-8.4 show 3-4 stars, etc.
    const starCount = rating >= 9 ? 5 : rating >= 8.5 ? 4 : rating >= 7 ? 3 : 2;

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

  const getRatingText = () => {
    const rating =
      typeof property.rating === "string"
        ? parseFloat(property.rating)
        : property.rating;

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
    return `€ ${numPrice}`;
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

  const imgSource: any =
    typeof property.imageSource === "number"
      ? property.imageSource
      : { uri: property.imageSource };

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
            name={isPropertySaved ? "heart" : "heart-outline"}
            size={20}
            color={isPropertySaved ? colors.red : "white"}
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

        <View style={styles.ratingRow}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingNumber}>
              {typeof property.rating === "string"
                ? property.rating
                : property.rating.toFixed(1)}
            </Text>
          </View>
          <Text style={styles.ratingLabel}>
            {property.ratingText || getRatingText()}
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
      color: colors.background,
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
      color: colors.background,
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
