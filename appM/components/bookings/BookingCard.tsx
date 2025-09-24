import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
import RebookButton from "./RebookButton";
interface BookingCardProps {
  propertyData: {
    propertyName: string;
    dates: string;
    price: string;
    image?: any;
    status?: string;
  };
  onPress: () => void;
  onDotsPress: () => void;
  onRebook: () => void;
}
export default function BookingCard({
  propertyData,
  onPress,
  onDotsPress,
  onRebook,
}: BookingCardProps) {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);
  const RebookButtonAny: any = RebookButton;
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        <Image
          source={require("../../assets/images/place-holder.jpg")}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text
            style={[styles.propertyName, { flexShrink: 1 }]}
            numberOfLines={1}
          >
            {propertyData.propertyName}
          </Text>
          <Text style={[styles.dates, { flexShrink: 1 }]} numberOfLines={1}>
            {propertyData.dates}
          </Text>
          <Text style={[styles.price, { flexShrink: 1 }]} numberOfLines={1}>
            {propertyData.price}
          </Text>
          <Text style={[styles.status, { flexShrink: 1 }]} numberOfLines={1}>
            {propertyData.status}
          </Text>
        </View>
        <TouchableOpacity onPress={onDotsPress} style={styles.dotsButton}>
          <Text style={styles.dotsText}>⋮</Text>
        </TouchableOpacity>
      </View>
      <RebookButtonAny onPress={onRebook} />
    </TouchableOpacity>
  );
}
const createStyles = (colors: Record<string, string>, theme: string) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    propertyName: {
      color: colors.text,
      fontWeight: "bold",
      fontSize: 16,
    },
    dates: {
      color: colors.textSecondary || colors.icon,
      fontSize: 12,
    },
    price: {
      color: colors.text,
      fontSize: 14,
      marginTop: 4,
    },
    status: {
      color: theme === "light" ? "#28A745" : "#32D74B",
      fontSize: 12,
      marginTop: 4,
    },
    dotsButton: {
      padding: 8,
    },
    dotsText: {
      color: colors.icon,
      fontSize: 20,
    },
  });
