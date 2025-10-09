import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface CancelConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onKeep: () => void;
  colors: any;
}

const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  onKeep,
  colors,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
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
            Cancel booking
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              textAlign: "center",
              marginBottom: 20,
              flexShrink: 1,
            }}
          >
            Are you sure you want to cancel this booking? This action can be
            undone only by rebooking.
          </Text>
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: colors.card,
              borderRadius: 10,
              padding: 15,
              marginBottom: 10,
              alignItems: "center",
            }}
            onPress={onConfirm}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Yes, cancel booking
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: colors.card,
              borderRadius: 10,
              padding: 15,
              alignItems: "center",
            }}
            onPress={onKeep}
          >
            <Text
              style={{
                color: "#FF3B30",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              No, keep booking
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CancelConfirmModal;
