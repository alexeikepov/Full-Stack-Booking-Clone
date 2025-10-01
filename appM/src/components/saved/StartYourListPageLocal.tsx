import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSavedProperties } from "../../hooks/SavedPropertiesContext";
import { useTheme } from "../../hooks/ThemeContext";
import PropertyCard from "../shared/PropertyCard";

const savedLightImage = require("../../assets/images/saved-light.jpg");
const savedPropertyImage = require("../../assets/images/saved-property.png");

const { width } = Dimensions.get("window");

interface StartYourListPageLocalProps {
  onBack: () => void;
}

const StartYourListPageLocal: React.FC<StartYourListPageLocalProps> = ({
  onBack,
}) => {
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const { savedProperties } = useSavedProperties();

  const localStyles = useMemo(
    () => createLocalStyles(colors, theme),
    [colors, theme],
  );

  const handleShare = async () => {
    // Use Alert as fallback for Expo Go, since Share is not available
    Alert.alert("Share", "Check out your next trip list on Booking.com!");
  };

  // Styles for empty state and property card list
  const startListStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      paddingTop: 150,
    },
    image: {
      width: width * 0.9,
      height: width * 0.6,
      resizeMode: "contain",
      marginBottom: 16,
    },
    title: localStyles.title,
    subtitle: localStyles.subtitle,
    findPropertiesButton: localStyles.findPropertiesButton,
    buttonText: localStyles.buttonText,
  });

  const propertyCardListStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
      paddingTop: 24,
    },
    scrollView: {
      marginHorizontal: -8,
    },
  });

  return (
    <View style={localStyles.container}>
      <View style={localStyles.header}>
        <TouchableOpacity onPress={onBack} style={localStyles.backButton}>
          <Text style={localStyles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={localStyles.headerTitle}>My trip</Text>
        <TouchableOpacity style={localStyles.shareButton} onPress={handleShare}>
          <Text style={localStyles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        {savedProperties.length === 0 ? (
          <View style={startListStyles.container}>
            <Image
              source={theme === "light" ? savedLightImage : savedPropertyImage}
              style={startListStyles.image}
            />
            <Text style={startListStyles.title}>Start your list</Text>
            <Text style={startListStyles.subtitle}>
              When you find a property you like, tap the{"\n"}heart icon to save
              it.
            </Text>
            <TouchableOpacity
              style={startListStyles.findPropertiesButton}
              onPress={() => (navigation as any).navigate("Search")}
            >
              <Text style={startListStyles.buttonText}>Find properties</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={propertyCardListStyles.container}>
            <ScrollView style={propertyCardListStyles.scrollView}>
              {savedProperties.map((property) => (
                <PropertyCard
                  key={property.id || property.title}
                  property={property}
                  onPress={() =>
                    (navigation as any).navigate("PropertyDetailsScreen", {
                      propertyData: {
                        // Ensure pricePerNight is provided; fall back to price if needed
                        ...(property || {}),
                        // property may be a simplified shape; cast to any to access optional fields
                        pricePerNight:
                          (property as any).pricePerNight ??
                          (property as any).price ??
                          undefined,
                      },
                    })
                  }
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const createLocalStyles = (
  colors: {
    text: any;
    textSecondary?: string;
    background: any;
    card?: string;
    button?: string;
    accent?: string;
    tint?: string;
    icon: any;
    tabIconDefault?: string;
    tabIconSelected?: string;
    inputBackground?: string;
    separator?: string;
    red?: string;
    yellow?: string;
    green?: string;
    blue?: string;
    purple?: string;
    pink?: string;
    teal?: string;
    gray?: string;
  },
  theme: string,
) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme === "light" ? colors.blue : colors.background,
    },
    backButton: { padding: 8 },
    backText: {
      color: theme === "light" ? colors.background : colors.text,
      fontSize: 16,
    },
    headerTitle: {
      color: theme === "light" ? colors.background : colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    shareButton: { padding: 8 },
    shareText: {
      color: theme === "light" ? colors.background : colors.text,
      fontSize: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary || colors.icon,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 22,
    },
    findPropertiesButton: {
      backgroundColor: theme === "light" ? colors.blue : colors.text,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: "center",
    },
    buttonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default StartYourListPageLocal;
