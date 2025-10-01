import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../hooks/ThemeContext";

interface SearchHeaderProps {
  onMessagesPress: () => void;
  onNotificationsPress: () => void;
  onBack?: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  onMessagesPress,
  onNotificationsPress,
  onBack,
}) => {
  const { colors, theme } = useTheme();

  const styles = {
    header: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
      padding: 16,
      backgroundColor: theme === "dark" ? colors.background : colors.blue,
      position: "relative" as const,
    },
    backButton: {
      zIndex: 1,
    },
    headerTitle: {
      color: theme === "light" ? "#fff" : colors.text,
      fontSize: 20,
      fontWeight: "bold" as const,
      position: "absolute" as const,
      left: 0,
      right: 0,
      textAlign: "center" as const,
    },
    headerIcons: {
      flexDirection: "row" as const,
      gap: 20,
      alignItems: "center" as const,
      marginLeft: "auto" as const,
    },
  };

  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>Booking.com</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={onMessagesPress}>
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNotificationsPress}>
          <Ionicons name="notifications-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchHeader;
