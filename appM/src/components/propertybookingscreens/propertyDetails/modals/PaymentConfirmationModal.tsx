import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface PaymentConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  confirmationCode: string;
  colors: any;
  theme: string;
  styles: any;
  navigation: any;
}

const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  visible,
  onClose,
  confirmationCode,
  colors,
  theme,
  styles,
  navigation,
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          ...styles.modalOverlay,
          backgroundColor:
            theme === "light" ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.7)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            ...styles.modalContainer,
            backgroundColor:
              theme === "light" ? colors.background : colors.card,
            borderRadius: 24,
            padding: 32,
            shadowColor: theme === "light" ? "#000" : "#222",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
            alignItems: "center",
            minWidth: 320,
            maxWidth: 400,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <Ionicons
              name="checkmark-circle"
              size={56}
              color={colors.button}
              style={{ marginBottom: 8 }}
            />
            <Text
              style={{
                ...styles.modalTitle,
                color: colors.button,
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 4,
                textAlign: "center",
              }}
            >
              Payment Confirmed!
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                marginVertical: 8,
                textAlign: "center",
              }}
            >
              Your booking has been confirmed and payment processed!{"\n"}We are
              waiting for your arrival!
            </Text>
          </View>
          <View
            style={{
              backgroundColor:
                theme === "light" ? `${colors.button}10` : `${colors.button}30`,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 24,
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                marginBottom: 2,
              }}
            >
              Confirmation Code
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                letterSpacing: 2,
                color: colors.button,
                textAlign: "center",
              }}
            >
              {confirmationCode}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              ...styles.confirmBookingButton,
              backgroundColor: colors.button,
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 32,
              marginTop: 8,
              shadowColor: colors.button,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.18,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() => {
              onClose();
              // After closing the confirmation modal, navigate to Bookings
              // and show the Active tab so the new booking is visible.
              navigation.navigate("MainTabs", {
                screen: "Bookings",
                params: { initialTab: "Active" },
              } as any);
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              show My Bookings
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentConfirmationModal;
