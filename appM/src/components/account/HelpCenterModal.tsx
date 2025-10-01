import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import HelpSupportSection from "./HelpSupportSection";

interface HelpCenterModalProps {
  visible: boolean;
  onClose: () => void;
  insets: any;
  colors: any;
  theme: string;
}

const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
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
            <Ionicons
              name="close"
              size={24}
              color={theme === "light" ? "white" : colors.text}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: theme === "light" ? "white" : colors.text,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Help Center
          </Text>
          <View style={{ width: 32 }} />
        </View>
        <HelpSupportSection onBack={onClose} />
      </SafeAreaView>
    </Modal>
  );
};

export default HelpCenterModal;
