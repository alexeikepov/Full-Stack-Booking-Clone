import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import SavedItem from "../../components/saved/SavedItem";

const { width } = Dimensions.get("window");

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState("Lists");

  const renderContent = () => {
    if (activeTab === "Lists") {
      return (
        <ScrollView style={styles.contentContainer}>
          <SavedItem title="מון" subtitle="0 saved items" />
          <SavedItem title="My next trip" subtitle="0 saved items" />
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.emptyAlertsContainer}>
          <Image
            source={require("../../assets/images/plane.jpg")}
            style={styles.illustration}
          />
          <Text style={styles.titleText}>You have no saved price alerts</Text>
          <Text style={styles.subtitleText}>
            Get price alerts for select flights searches —{"\n"}
            only for Genius members
          </Text>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.buttonText}>Start searching for flights</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header Row */}
      <View style={styles.headerTitleRow}>
        <Text style={styles.savedTitle}>Saved</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.plusIconContainer}>
          <Ionicons name="add-outline" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Lists" && styles.activeTab]}
          onPress={() => setActiveTab("Lists")}
        >
          <Ionicons
            name="heart-outline"
            size={18}
            color={
              activeTab === "Lists" ? Colors.dark.background : Colors.dark.text
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "Lists" && { color: Colors.dark.background },
            ]}
          >
            Lists
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Alerts" && styles.activeTab]}
          onPress={() => setActiveTab("Alerts")}
        >
          <Ionicons
            name="paper-plane-outline"
            size={18}
            color={
              activeTab === "Alerts" ? Colors.dark.background : Colors.dark.text
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "Alerts" && { color: Colors.dark.background },
            ]}
          >
            Alerts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  savedTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  plusIconContainer: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.text,
  },
  activeTab: {
    backgroundColor: Colors.dark.text,
  },
  tabText: {
    color: Colors.dark.text,
    marginLeft: 6,
    fontWeight: "bold",
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  emptyAlertsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  illustration: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: "contain",
    marginBottom: 20,
  },
  titleText: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitleText: {
    color: Colors.dark.icon,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
