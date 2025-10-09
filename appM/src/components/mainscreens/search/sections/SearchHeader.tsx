import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../../hooks/ThemeContext";
import { useMessages } from "../../../../hooks/MessagesContext";
import { useNotifications } from "../../../../hooks/NotificationsContext";

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
  const { getUnreadCount: getUnreadMessages } = useMessages();
  const { getUnreadCount: getUnreadNotifications } = useNotifications();

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
    iconButton: {
      position: "relative" as const,
    },
    badge: {
      position: "absolute" as const,
      top: -4,
      right: -4,
      backgroundColor: "#FF4444",
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      borderWidth: 2,
      borderColor: "#FFFFFF",
    },
    badgeText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "bold" as const,
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
        <TouchableOpacity onPress={onMessagesPress} style={styles.iconButton}>
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
          {getUnreadMessages() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {getUnreadMessages() > 99 ? "99+" : getUnreadMessages()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onNotificationsPress}
          style={styles.iconButton}
        >
          <Ionicons name="notifications-outline" size={28} color="#fff" />
          {getUnreadNotifications() > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {getUnreadNotifications() > 99
                  ? "99+"
                  : getUnreadNotifications()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchHeader;
