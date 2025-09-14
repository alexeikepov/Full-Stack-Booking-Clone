import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/Colors";
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
          <Text style={styles.dotsText}>⋯</Text>
        </TouchableOpacity>
      </View>
      <RebookButton onPress={onRebook} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
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
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  dates: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
  price: {
    color: Colors.dark.text,
    fontSize: 14,
    marginTop: 4,
  },
  status: {
    color: Colors.dark.icon,
    fontSize: 12,
    marginTop: 4,
  },
  dotsButton: {
    padding: 8,
  },
  dotsText: {
    color: Colors.dark.icon,
    fontSize: 20,
  },
});
