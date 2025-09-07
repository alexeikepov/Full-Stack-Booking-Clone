import React from "react";
import { View, Text, Image } from "react-native";
import { Colors } from "../../constants/Colors";
import RebookButton from "./RebookButton";

interface BookingCardProps {
  propertyName: string;
  dates: string;
  price: string;
  image?: any;
  status?: string;
}

export default function BookingCard({
  propertyName,
  dates,
  price,
  image,
}: BookingCardProps) {
  return (
    <View
      style={{
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={image || require("../../assets/images/place-holder.jpg")}
          style={{ width: 80, height: 80, borderRadius: 8, marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: Colors.dark.text,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {propertyName}
          </Text>
          <Text style={{ color: Colors.dark.textSecondary, fontSize: 12 }}>
            {dates}
          </Text>
          <Text style={{ color: Colors.dark.text, fontSize: 14, marginTop: 4 }}>
            {price}
          </Text>
        </View>
        <Text style={{ color: Colors.dark.icon, fontSize: 20 }}>⋯</Text>
      </View>
      <RebookButton />
    </View>
  );
}
