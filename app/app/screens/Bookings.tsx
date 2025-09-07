import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BookingCard from "../../components/bookings/BookingCard";
import { Colors } from "../../constants/Colors";

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState("Past");

  const tabs = ["Active", "Past", "Canceled"];

  const renderContent = () => {
    switch (activeTab) {
      case "Active":
        return (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 32,
            }}
          >
            <Image
              source={require("../../assets/images/globe.png")}
              style={{ width: 120, height: 120, marginBottom: 16 }}
            />
            <Text
              style={{
                color: Colors.dark.text,
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Where to next?
            </Text>
            <Text
              style={{
                color: Colors.dark.text,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              You haven not started any trips yet. Once you make a booking, it
              will appear here.
            </Text>
          </View>
        );
      case "Past":
        return (
          <ScrollView style={{ paddingHorizontal: 16 }}>
            {[1].map((i) => (
              <BookingCard
                key={i}
                propertyName="La Viscontina"
                dates="11-12 Apr 2025"
                price="€ 80.25"
                status="Completed"
              />
            ))}
          </ScrollView>
        );
      case "Canceled":
        return (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 32,
            }}
          >
            <Image
              source={require("../../assets/images/map.png")}
              style={{ width: 120, height: 120, marginBottom: 16 }}
            />
            <Text
              style={{
                color: Colors.dark.text,
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Sometimes plans change
            </Text>
            <Text
              style={{
                color: Colors.dark.text,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Here you can refer to all the trips you’ve canceled – maybe next
              time!
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 16,
        }}
      >
        <Text
          style={{ color: Colors.dark.text, fontSize: 20, fontWeight: "bold" }}
        >
          Trips
        </Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Ionicons
            name="help-circle-outline"
            size={22}
            color={Colors.dark.icon}
          />
          <Ionicons
            name="chevron-down-outline"
            size={22}
            color={Colors.dark.icon}
          />
        </View>
      </View>
      {/* Tab Selector */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          marginBottom: 16,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                marginHorizontal: 4,
                paddingVertical: 8,
                borderRadius: 16,
                alignItems: "center",
                backgroundColor: isActive ? Colors.dark.text : Colors.dark.card,
              }}
            >
              <Text
                style={{
                  color: isActive ? Colors.dark.background : Colors.dark.text,
                  fontWeight: "bold",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Bookings List / Empty State */}
      {renderContent()}
    </View>
  );
}
