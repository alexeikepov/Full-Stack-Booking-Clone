import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../hooks/ThemeContext";
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
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
      }}
    >
      <View style={{ marginRight: 12 }}>{icon}</View>
      <Text style={{ color: colors.text, flex: 1 }}>{title}</Text>
      <Text style={{ color: colors.icon, fontSize: 18 }}>›</Text>
    </TouchableOpacity>
  );
}
