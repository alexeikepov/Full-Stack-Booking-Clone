import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";

interface ProfileHeaderProps {
  userName?: string;
  profileImage?: any;
}

export default function ProfileHeader({
  userName = "Crazy",
  profileImage,
}: ProfileHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
      }}
    >
      {/* Profile Info */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={
            profileImage || require("../../assets/images/place-holder.jpg")
          }
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }}
        />
        <Text
          style={{ color: Colors.dark.text, fontSize: 18, fontWeight: "bold" }}
        >
          Hi, {userName}
        </Text>
      </View>

      {/* Action Icons */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity>
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color={Colors.dark.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="notifications-outline"
            size={22}
            color={Colors.dark.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
