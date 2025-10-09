import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface RemoveBookingModalProps {
  visible: boolean;
  onClose: () => void;
  onRemove: () => void;
  colors: any;
}

const RemoveBookingModal: React.FC<RemoveBookingModalProps> = ({
  visible,
  onClose,
  onRemove,
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
            Remove trip
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
            onPress={onRemove}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Remove
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
            onPress={onClose}
          >
            <Text
              style={{
                color: "#FF3B30",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RemoveBookingModal;
