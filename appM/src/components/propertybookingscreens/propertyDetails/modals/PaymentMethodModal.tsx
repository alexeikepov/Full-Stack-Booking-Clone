import React, { useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  cardNumber: string;
  setCardNumber: (v: string) => void;
  cardName: string;
  setCardName: (v: string) => void;
  cardExpiry: string;
  setCardExpiry: (v: string) => void;
  cardCvv: string;
  setCardCvv: (v: string) => void;
  cardErrors: string[];
  cardSubmitting: boolean;
  handleSubmitCard: () => void;
  styles: any;
  colors: any;
  theme: string;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  visible,
  onClose,
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  cardErrors,
  cardSubmitting,
  handleSubmitCard,
  styles,
  colors,
  theme,
}) => {
  // Refs for automatic focus
  const nameRef = useRef<TextInput>(null);
  const expiryRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);
  if (!visible) return null;

  const hasCardErrors = cardErrors && cardErrors.length > 0;
  const cleanNumber = cardNumber.replace(/\s+/g, "");
  const isValid =
    /^\d{13,19}$/.test(cleanNumber) &&
    !!cardName.trim() &&
    /^\d{2}\/\d{2}$/.test(cardExpiry) &&
    /^\d{3,4}$/.test(cardCvv);

  // Calculate keyboardVerticalOffset for both platforms
  const statusBarHeight =
    typeof StatusBar?.currentHeight === "number"
      ? StatusBar.currentHeight
      : Platform.OS === "ios"
        ? 64
        : 0;
  const keyboardVerticalOffset =
    Platform.OS === "ios" ? statusBarHeight + 60 : statusBarHeight + 300;

  // Format card number with spaces every 4 digits
  const formatCardNumber = (text: string) => {
    const cleanNumber = text.replace(/\s+/g, "");
    const formatted = cleanNumber.replace(/(.{4})/g, "$1 ").trim();
    return formatted;
  };

  // Format expiry with slash after 2 digits
  const formatExpiry = (text: string) => {
    const cleanText = text.replace(/\D/g, "");
    if (cleanText.length >= 2) {
      return cleanText.slice(0, 2) + "/" + cleanText.slice(2, 4);
    }
    return cleanText;
  };

  // Helper functions for automatic focus transitions
  const handleCardNumberChange = (text: string) => {
    // Format card number with spaces for visual appeal
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);

    // Move to next field when 16 digits are entered
    const cleanNumber = text.replace(/\s+/g, "");
    if (cleanNumber.length === 16) {
      nameRef.current?.focus();
    }
  };

  const handleCardNameChange = (text: string) => {
    setCardName(text);
    // Move to expiry when name reaches reasonable length (25 chars)
    if (text.trim().length === 25) {
      expiryRef.current?.focus();
    }
  };

  const handleCardExpiryChange = (text: string) => {
    // Format expiry with slash
    const formatted = formatExpiry(text);
    setCardExpiry(formatted);

    // Move to CVV when expiry is complete (5 chars including slash)
    if (formatted.length === 5) {
      cvvRef.current?.focus();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={keyboardVerticalOffset}
          enabled
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Insert payment method</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={onClose}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={theme === "light" ? colors.text : "white"}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                paddingBottom: 300,
              }}
              keyboardShouldPersistTaps="always"
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.formLabel}>Card number</Text>
              <TextInput
                style={styles.formInput}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#9CA3AF"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="numeric"
                maxLength={23}
              />

              <Text style={styles.formLabel}>Name on card</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Cardholder name"
                placeholderTextColor="#9CA3AF"
                value={cardName}
                onChangeText={handleCardNameChange}
                ref={nameRef}
                maxLength={26}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.formLabel}>Expiry (MM/YY)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="MM/YY"
                    placeholderTextColor="#9CA3AF"
                    value={cardExpiry}
                    onChangeText={handleCardExpiryChange}
                    keyboardType="numeric"
                    ref={expiryRef}
                    maxLength={5}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.formLabel}>CVV</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="123"
                    placeholderTextColor="#9CA3AF"
                    value={cardCvv}
                    onChangeText={(text) => {
                      // Only allow numeric input for CVV
                      const numericText = text.replace(/\D/g, "");
                      setCardCvv(numericText);
                    }}
                    keyboardType="numeric"
                    secureTextEntry={true}
                    ref={cvvRef}
                    maxLength={4}
                  />
                </View>
              </View>

              {hasCardErrors &&
                cardErrors.map((err, i) => (
                  <Text key={i} style={{ color: "red", marginTop: 6 }}>
                    {err}
                  </Text>
                ))}

              <View style={{ marginTop: 16 }}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !isValid && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmitCard}
                  disabled={!isValid || cardSubmitting}
                >
                  {cardSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Use this card</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default PaymentMethodModal;
