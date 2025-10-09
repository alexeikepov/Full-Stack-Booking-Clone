// path: src/components/buttons/RebookButton.tsx
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../../hooks/ThemeContext";
import { Property } from "../../../../components/shared";

type RebookButtonProps = {
  onPress?: () => void;
  propertyData?: Property | any;
};

export default function RebookButton({
  onPress,
  propertyData,
}: RebookButtonProps) {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<Record<string, object | undefined>>
    >();
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);
  const handlePress = () => {
    if (onPress) onPress();
    // If we have property data, navigate directly to the details screen with the expected param shape
    if (propertyData) {
      // Ensure we have all required fields to avoid API calls
      const enrichedPropertyData = {
        ...(propertyData as any),
        // Ensure we have a title field (required to avoid API calls)
        title:
          (propertyData as any).title ||
          (propertyData as any).name ||
          (propertyData as any).propertyName ||
          "Property",
        // Ensure price fields are present
        price:
          (propertyData as any).price ||
          (propertyData as any).pricePerNight ||
          "0",
        pricePerNight:
          (propertyData as any).pricePerNight ?? (propertyData as any).price,
        // Ensure basic fields are present
        rating: (propertyData as any).rating || "0",
        description:
          (propertyData as any).description ||
          (propertyData as any).roomType ||
          "Property description",
        imageSource:
          (propertyData as any).imageSource ||
          require("../../../../assets/images/hotel1.png"),
        location:
          (propertyData as any).location ||
          (propertyData as any).address ||
          "Location",
      };

      navigation.navigate("PropertyDetailsScreen", {
        propertyData: enrichedPropertyData,
      });
    } else {
      // Fallback to Search when no property provided
      navigation.navigate("Search");
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Ionicons
        name="refresh-outline"
        size={20}
        color={colors.text}
        style={{ marginRight: 8 }}
      />
      <Text style={[styles.text, { flexShrink: 1 }]} numberOfLines={1}>
        Rebook this property
      </Text>
      <Ionicons
        name="arrow-forward-outline"
        size={20}
        color={colors.text}
        style={{ marginLeft: 4 }}
      />
    </TouchableOpacity>
  );
}
const createStyles = (colors: Record<string, string>, theme: string) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        theme === "light" ? colors.card : colors.cardSecondary || colors.card,
      paddingVertical: 8,
      borderRadius: 20,
      marginTop: 12,
      borderWidth: theme === "light" ? 1 : 0,
      borderColor:
        theme === "light" ? colors.border || "#E5E5E5" : "transparent",
    },
    text: {
      color: colors.text,
      fontWeight: "bold",
    },
  });
