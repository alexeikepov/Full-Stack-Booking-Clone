import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  insets: any;
  colors: any;
  theme: string;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
  insets,
  colors,
  theme,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          { flex: 1, backgroundColor: colors.background },
          { paddingTop: insets.top },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.card,
            backgroundColor: theme === "light" ? colors.blue : colors.card,
          }}
        >
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <Text
              style={{
                color: theme === "light" ? "white" : colors.text,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 16,
          }}
        >
          <Ionicons
            name="notifications-outline"
            size={80}
            color={colors.text}
          />
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 16,
            }}
          >
            You do not have any notifications.
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Notifications let you quickly take action on upcoming or current
            bookings.
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default NotificationsModal;
