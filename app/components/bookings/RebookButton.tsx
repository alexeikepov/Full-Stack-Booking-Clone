import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";

export default function RebookButton() {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.dark.cardSecondary,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 12,
      }}
    >
      <Ionicons
        name="refresh-outline"
        size={20}
        color={Colors.dark.text}
        style={{ marginRight: 8 }}
      />
      <Text style={{ color: Colors.dark.text, fontWeight: "bold" }}>
        Rebook this property
      </Text>
      <Ionicons
        name="arrow-forward-outline" // replaces →
        size={20}
        color={Colors.dark.text}
        style={{ marginLeft: 4 }}
      />
    </TouchableOpacity>
  );
}
