import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const manWhiteImage = require("../../assets/images/man-white.jpg");
const messagesManImage = require("../../assets/images/messages-man.png");

interface MessagesModalProps {
  visible: boolean;
  onClose: () => void;
  onHelpPress: () => void;
  onBookNowPress: () => void;
  insets: any;
  colors: any;
  theme: string;
}

const MessagesModal: React.FC<MessagesModalProps> = ({
  visible,
  onClose,
  onHelpPress,
  onBookNowPress,
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
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text
            style={{
              color: theme === "light" ? "white" : colors.text,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Messages
          </Text>
          <TouchableOpacity onPress={onHelpPress}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={colors.text}
            />
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
          <Image
            source={theme === "light" ? manWhiteImage : messagesManImage}
            style={{
              width: 250,
              height: 250,
              resizeMode: "contain",
            }}
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
            No messages
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            You can start exchanging messages when you have upcoming bookings.
          </Text>
        </View>
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.button,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
              marginTop: 8,
            }}
            onPress={onBookNowPress}
          >
            <Text
              style={{
                color: colors.text,
                fontWeight: "bold",
              }}
            >
              Book now
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default MessagesModal;
