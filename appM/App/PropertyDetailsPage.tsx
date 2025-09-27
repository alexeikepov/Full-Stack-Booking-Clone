import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusContainer: {
    backgroundColor: Colors.dark.cardSecondary,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  statusText: {
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 12,
  },
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  propertyName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  dates: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  propertyAddress: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    color: Colors.dark.text,
    marginLeft: 10,
    fontSize: 16,
  },
  nonRefundableNote: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalPrice: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  taxesText: {
    color: Colors.dark.icon,
    fontSize: 14,
  },
  addMoreItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addMoreTextContainer: {
    marginLeft: 12,
  },
  addMoreTitle: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  addMoreSubtitle: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  actionText: {
    color: "#007AFF",
    marginLeft: 12,
    fontSize: 16,
  },
  rebookButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  rebookButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

interface PropertyDetailsPageProps {
  propertyData: {
    propertyName: string;
    dates: string;
    price: string;
    status: string;
    location: string;
    details: {
      confirmationNumber: string;
      pin: string;
      checkIn: string;
      checkOut: string;
      address: string;
      roomType: string;
      includedExtras: string;
      breakfastIncluded: boolean;
      nonRefundable: boolean;
      totalPrice: string;
      shareOptions: string[];
      contactNumber: string;
    };
  };
  onBack: () => void;
  onRebook: () => void;
}

export default function PropertyDetailsPage({
  propertyData,
  onBack,
  onRebook,
}: PropertyDetailsPageProps) {
  const {
    propertyName,
    dates,
    status,
    details: {
      confirmationNumber,
      pin,
      checkIn,
      checkOut,
      address,
      roomType,
      includedExtras,
      breakfastIncluded,
      nonRefundable,
      totalPrice,
      contactNumber,
    },
  } = propertyData;

  const handleShare = (type: "booking" | "property" | "app") => {
    Alert.alert("Share", `Sharing ${type} is not yet implemented.`);
  };

  const handleContact = () => {
    Alert.alert(
      "Contact Property",
      `Call the property at ${contactNumber} is not yet implemented.`,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color={Colors.dark.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trips</Text>
        <Ionicons
          name="help-circle-outline"
          size={24}
          color={Colors.dark.text}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your accommodation booking</Text>
          <Text style={styles.propertyName}>{propertyName}</Text>
          <Text style={styles.dates}>{dates}</Text>
          <Text style={styles.propertyAddress}>
            {checkIn}
            {"\n"}
            {checkOut}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Booking details</Text>
          <View style={styles.detailRow}>
            <Ionicons name="bed-outline" size={24} color={Colors.dark.icon} />
            <Text style={styles.detailText}>{roomType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name="fast-food-outline"
              size={24}
              color={Colors.dark.icon}
            />
            <Text style={styles.detailText}>Breakfast included</Text>
          </View>
          {nonRefundable && (
            <View style={styles.detailRow}>
              <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
              <Text style={[styles.detailText, { color: "#FF3B30" }]}>
                Non-refundable
              </Text>
            </View>
          )}
          <Text style={styles.nonRefundableNote}>
            Note that if canceled, modified, or in case of no-show, the total
            price of the reservation will be charged.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Total</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalPrice}>{totalPrice}</Text>
            <Text style={styles.taxesText}>Includes taxes and fees</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Add more to your trip</Text>
          <TouchableOpacity style={styles.addMoreItem}>
            <Ionicons name="car-outline" size={24} color={Colors.dark.icon} />
            <View style={styles.addMoreTextContainer}>
              <Text style={styles.addMoreTitle}>Car rental</Text>
              <Text style={styles.addMoreSubtitle}>
                Free parking at the property
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity
            onPress={() => handleShare("booking")}
            style={styles.actionItem}
          >
            <Ionicons name="share-outline" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Share this booking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleShare("property")}
            style={styles.actionItem}
          >
            <Ionicons name="share-outline" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Share this property</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => onRebook()}
          style={styles.rebookButton}
        >
          <Text style={styles.rebookButtonText}>Book again</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
