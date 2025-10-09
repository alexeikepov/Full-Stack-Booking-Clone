import React from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNotifications } from "../../../hooks/NotificationsContext";

type NotificationsModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  colors: any;
  insets: any;
  styles: any;
};

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onRequestClose,
  colors,
  insets,
  styles,
}) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } =
    useNotifications();

  const handleNotificationPress = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const renderNotificationItem = ({ item: notification }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: notification.read ? colors.card : colors.background,
          ...(Platform.OS !== "android" && {
            borderLeftColor: notification.read ? colors.border : colors.button,
            borderLeftWidth: 4,
          }),
        },
      ]}
      onPress={() => handleNotificationPress(notification.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          <Ionicons
            name={notification.iconName || "notifications"}
            size={24}
            color={
              notification.type === "booking_success"
                ? "#4CAF50"
                : colors.button
            }
          />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, { color: colors.text }]}>
            {notification.title}
          </Text>
          <Text
            style={[
              styles.notificationMessage,
              { color: colors.textSecondary },
            ]}
          >
            {notification.message}
          </Text>
          <Text
            style={[styles.notificationTime, { color: colors.textSecondary }]}
          >
            {formatTimestamp(notification.timestamp)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeNotification(notification.id)}
        >
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.modalContent}>
      <Ionicons name="notifications-outline" size={80} color={colors.text} />
      <Text style={styles.modalTitle}>You do not have any notifications.</Text>
      <Text style={styles.modalSubtitle}>
        Notifications let you quickly take action on upcoming or current
        bookings.
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onRequestClose}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onRequestClose} style={styles.closeButton}>
            {Platform.OS === "android" ? (
              <Ionicons name="close" size={24} color={colors.text} />
            ) : (
              <Text style={styles.modalHeaderText}>Close</Text>
            )}
          </TouchableOpacity>
          {Platform.OS === "android" ? (
            <Text style={styles.modalHeaderText}>Notifications</Text>
          ) : (
            <Text style={[styles.modalHeaderTitle, { color: colors.text }]}>
              Notifications
            </Text>
          )}
          {notifications.filter((n) => !n.read).length > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              style={styles.markAllButton}
            >
              <Text style={[styles.markAllText, { color: colors.button }]}>
                {Platform.OS === "android" ? "Mark all" : "Mark all read"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {notifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            style={styles.notificationsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default NotificationsModal;
