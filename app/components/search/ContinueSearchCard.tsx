import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/Colors";

interface ContinueSearchCardProps {
  title: string;
  subtitle: string;
  image?: any;
  onPress?: () => void;
}

export default function ContinueSearchCard({
  title,
  subtitle,
  image,
  onPress,
}: ContinueSearchCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 12,
        marginRight: 12,
        alignItems: "center",
        width: 250,
      }}
    >
      <Image
        source={image || require("../../assets/images/place-holder.jpg")}
        style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ color: Colors.dark.text, fontWeight: "bold" }}>
          {title}
        </Text>
        <Text style={{ color: Colors.dark.textSecondary, fontSize: 12 }}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
