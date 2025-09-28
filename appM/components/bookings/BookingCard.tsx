import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
import RebookButton from "./RebookButton";
interface BookingCardProps {
  // Accept any so the full booking object can be forwarded to PropertyDetails
  propertyData: any;
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
  const normalizeImageSource = (img: any) =>
    typeof img === "number"
      ? img
      : typeof img === "string"
        ? { uri: img }
        : img;

  const imgSource: any = propertyData.image
    ? normalizeImageSource(propertyData.image)
    : propertyData.imageSource
      ? normalizeImageSource(propertyData.imageSource)
      : Array.isArray(propertyData.images) && propertyData.images.length > 0
        ? normalizeImageSource(propertyData.images[0])
        : // fallback: pick a random hotel image from assets
          [
            require("../../assets/images/hotel1.png"),
            require("../../assets/images/hotel2.png"),
            require("../../assets/images/hotel3.png"),
            require("../../assets/images/hotel4.png"),
            require("../../assets/images/hotel5.png"),
            require("../../assets/images/hotel6.png"),
            require("../../assets/images/hotel7.png"),
            require("../../assets/images/hotel8.png"),
            require("../../assets/images/hotel9.png"),
            require("../../assets/images/hotel10.png"),
            require("../../assets/images/hotel11.png"),
            require("../../assets/images/hotel12.png"),
            require("../../assets/images/hotel13.png"),
            require("../../assets/images/hotel14.png"),
            require("../../assets/images/hotel15.png"),
            require("../../assets/images/hotel16.png"),
            require("../../assets/images/hotel17.png"),
            require("../../assets/images/hotel18.png"),
            require("../../assets/images/hotel19.png"),
            require("../../assets/images/hotel20.png"),
          ][Math.floor(Math.random() * 20)];
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={imgSource} style={styles.image} />
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
      <RebookButton onPress={onRebook} propertyData={propertyData} />
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
