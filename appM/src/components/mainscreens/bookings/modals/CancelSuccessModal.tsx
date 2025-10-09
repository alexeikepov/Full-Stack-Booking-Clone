import React from "react";
import { Modal, Text, View } from "react-native";

interface CancelSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  colors: any;
}

const CancelSuccessModal: React.FC<CancelSuccessModalProps> = ({
  visible,
  onClose,
  colors,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.text,
              marginBottom: 16,
            }}
          >
            Booking canceled
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              textAlign: "center",
              flexShrink: 1,
            }}
          >
            Your booking was canceled successfully.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default CancelSuccessModal;
