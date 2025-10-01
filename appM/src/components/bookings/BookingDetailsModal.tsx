import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

interface BookingDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  confirmationInput: string;
  setConfirmationInput: (value: string) => void;
  onManageBooking: () => void;
  colors: any;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  visible,
  onClose,
  confirmationInput,
  setConfirmationInput,
  onManageBooking,
  colors,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <SafeAreaView
        style={[
          { flex: 1, backgroundColor: colors.background },
          { paddingHorizontal: 16 },
        ]}
        edges={["bottom"]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 16,
            paddingTop: 60,
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Enter booking details
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ marginTop: 24, paddingHorizontal: 8 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              textAlign: "center",
              marginBottom: 20,
              flexShrink: 1,
            }}
          >
            To manage an accommodation booking, enter the confirmation number.
            You received it when the booking was confirmed.
          </Text>
          <TextInput
            style={{
              width: "100%",
              backgroundColor: colors.card,
              borderRadius: 8,
              padding: 12,
              color: colors.text,
              marginBottom: 10,
            }}
            placeholder="Confirmation number*"
            placeholderTextColor={colors.icon}
            value={confirmationInput}
            onChangeText={setConfirmationInput}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#007AFF",
              paddingVertical: 14,
              borderRadius: 8,
              width: "100%",
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={onManageBooking}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Manage booking
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default BookingDetailsModal;
