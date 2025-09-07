import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";

interface SavedItemProps {
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export default function SavedItem({
  title,
  subtitle,
  onPress,
}: SavedItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <Ionicons
        name="heart-outline" // replaced hardcoded emoji
        size={24}
        color="red"
        style={{ marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ color: Colors.dark.text, fontWeight: "bold" }}>
          {title}
        </Text>
        <Text style={{ color: Colors.dark.textSecondary }}>{subtitle}</Text>
      </View>
      <Text style={{ color: Colors.dark.icon, fontSize: 20 }}>⋯</Text>
    </TouchableOpacity>
  );
}
