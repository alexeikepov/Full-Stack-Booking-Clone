import { Fragment, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../../hooks/ThemeContext";
import { useNotifications } from "../../../../hooks/NotificationsContext";
import { useMessages } from "../../../../hooks/MessagesContext";
import GeniusLoyaltyModal from "../modals/GeniusLoyaltyModal";
import ProfilePhotoModal from "../modals/ProfilePhotoModal";

const placeHolderImage = require("../../../../assets/images/place-holder.jpg");
interface ProfileHeaderProps {
  userName?: string;
  geniusLevel?: string;
  profileImage?: number;
  onMessagesPress?: () => void;
  onNotificationsPress?: () => void;
}

export default function ProfileHeader({
  userName = "guest",
  geniusLevel = "Level 1",
  profileImage,
  onMessagesPress,
  onNotificationsPress,
}: ProfileHeaderProps) {
  const { colors, theme } = useTheme();
  const { getUnreadCount: getUnreadNotifications } = useNotifications();
  const { getUnreadCount: getUnreadMessages } = useMessages();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openPhotoModal, setOpenPhotoModal] = useState<boolean>(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const handlePhotoSelection = (option: string, imageUri?: string) => {
    setOpenPhotoModal(false);

    if (option === "remove") {
      setSelectedImageUri(null);
    } else if (imageUri) {
      setSelectedImageUri(imageUri);
    }
  };
  return (
    <Fragment>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              theme === "light" ? colors.blue : colors.background,
          },
        ]}
      >
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => setOpenPhotoModal(true)}>
            <Image
              source={
                selectedImageUri
                  ? { uri: selectedImageUri }
                  : profileImage || placeHolderImage
              }
              style={[
                styles.profileImage,
                { borderColor: theme === "light" ? "#FFD700" : "#FFD700" },
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOpenModal(true)}>
            <Text
              style={[
                styles.userNameText,
                { color: theme === "light" ? "#FFFFFF" : colors.text },
              ]}
            >
              Hi, {userName}
            </Text>
            <View
              style={[
                styles.geniusLevelBadge,
                {
                  backgroundColor:
                    theme === "light" ? "rgba(255,255,255,0.2)" : colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.geniusLabelText,
                  { color: theme === "light" ? "#FFFFFF" : colors.text },
                ]}
              >
                Genius{" "}
              </Text>
              <Text
                style={[
                  styles.geniusLevelText,
                  { color: theme === "light" ? "#FFD700" : "#FFD700" },
                ]}
              >
                {geniusLevel}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onMessagesPress} style={styles.iconButton}>
            <Ionicons
              name="chatbubble-outline"
              size={32}
              color={theme === "light" ? "#FFFFFF" : "#FFFFFF"}
            />
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
            <Ionicons
              name="notifications-outline"
              size={32}
              color={theme === "light" ? "#FFFFFF" : "#FFFFFF"}
            />
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

      <GeniusLoyaltyModal
        visible={openModal}
        onClose={() => setOpenModal(false)}
      />

      <ProfilePhotoModal
        visible={openPhotoModal}
        onClose={() => setOpenPhotoModal(false)}
        onPhotoSelection={handlePhotoSelection}
      />
    </Fragment>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 2,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  geniusLevelBadge: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  geniusLabelText: {
    fontSize: 14,
  },
  geniusLevelText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
