import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/Colors";

interface AccountItemProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
}

export default function AccountItem({
  icon,
  title,
  onPress,
}: AccountItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
      }}
    >
      <Text style={{ fontSize: 20, marginRight: 12 }}>{icon}</Text>
      <Text style={{ color: Colors.dark.text, flex: 1 }}>{title}</Text>
      <Text style={{ color: Colors.dark.icon, fontSize: 18 }}>›</Text>
    </TouchableOpacity>
  );
}
