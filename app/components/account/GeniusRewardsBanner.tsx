import React, { JSX } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextStyle,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";

interface Style {
  container: ViewStyle;
  content: ViewStyle;
  textContainer: ViewStyle;
  mainText: TextStyle;
  subText: TextStyle;
  separator: ViewStyle;
  progressText: TextStyle;
}

export default function GeniusRewardsBanner(): JSX.Element {
  return (
    <Pressable style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="gift-outline" size={24} color={Colors.dark.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>You have 2 Genius rewards</Text>
          <Text style={styles.subText}>10% discounts and so much more!</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.dark.icon} />
      </View>
      <View style={styles.separator} />
      <Text style={styles.progressText}>
        You are 3 bookings away from Genius Level 2
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginTop: 20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  mainText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  subText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: "#333333",
    marginVertical: 16,
  },
  progressText: {
    fontSize: 14,
    color: Colors.dark.text,
  },
});
