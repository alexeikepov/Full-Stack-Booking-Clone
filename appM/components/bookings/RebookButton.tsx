// path: src/components/buttons/RebookButton.tsx
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Property } from "../../components/PropertyCard";
import { useTheme } from "../../hooks/ThemeContext";

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
      navigation.navigate("PropertyDetailsScreen", {
        propertyData: {
          ...(propertyData as any),
          pricePerNight:
            (propertyData as any).pricePerNight ?? (propertyData as any).price,
        },
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
