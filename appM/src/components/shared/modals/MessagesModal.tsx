import React from "react";
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useMessages } from "../../../hooks/MessagesContext";

type MessagesModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  onHelpPress: () => void;
  onSearchPress: () => void;
  colors: any;
  insets: any;
  theme: string;
  manWhiteImage: any;
  messagesManImage: any;
  styles: any;
};

const MessagesModal: React.FC<MessagesModalProps> = ({
  visible,
  onRequestClose,
  onHelpPress,
  onSearchPress,
  colors,
  insets,
  theme,
  manWhiteImage,
  messagesManImage,
  styles,
}) => {
  const { messages, markAsRead, markAllAsRead } = useMessages();

  const handleMessagePress = (messageId: string) => {
    markAsRead(messageId);
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

  const renderMessageItem = ({ item: message }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.messageItem,
        {
          backgroundColor: message.read ? colors.card : colors.background,
          ...(Platform.OS !== "android" && {
            borderLeftColor: message.read ? colors.border : colors.button,
            borderLeftWidth: 4,
          }),
        },
      ]}
      onPress={() => handleMessagePress(message.id)}
    >
      <View style={styles.messageHeader}>
        <View style={styles.messageAvatar}>
          <Text style={[styles.avatarText, { color: colors.text }]}>
            {message.avatar || "👤"}
          </Text>
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageTopRow}>
            <Text style={[styles.messageSender, { color: colors.text }]}>
              {message.senderName}
            </Text>
            <Text style={[styles.messageRole, { color: colors.textSecondary }]}>
              {message.senderRole}
            </Text>
            <Text style={[styles.messageTime, { color: colors.textSecondary }]}>
              {formatTimestamp(message.timestamp)}
            </Text>
          </View>
          {message.propertyName && (
            <Text style={[styles.messageProperty, { color: colors.button }]}>
              {message.propertyName}
            </Text>
          )}
          <Text style={[styles.messageSubject, { color: colors.text }]}>
            {message.subject}
          </Text>
          <Text
            style={[styles.messageText, { color: colors.textSecondary }]}
            numberOfLines={3}
          >
            {message.message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <>
      <View style={styles.modalContent}>
        <Image
          source={theme === "light" ? manWhiteImage : messagesManImage}
          style={styles.messageImage}
        />
        <Text style={styles.modalTitle}>No messages</Text>
        <Text style={styles.modalSubtitle}>
          You can start exchanging messages when you have upcoming bookings.
        </Text>
      </View>
      <View style={styles.modalFooter}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Book now</Text>
        </TouchableOpacity>
      </View>
    </>
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
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.modalHeaderText}>Messages</Text>
          <View style={styles.headerRight}>
            {messages.filter((m) => !m.read).length > 0 && (
              <TouchableOpacity
                onPress={markAllAsRead}
                style={styles.markAllButton}
              >
                <Text style={[styles.markAllText, { color: colors.button }]}>
                  {Platform.OS === "android" ? "Mark all" : "Mark all read"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onHelpPress}
              style={styles.helpButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {messages.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default MessagesModal;
