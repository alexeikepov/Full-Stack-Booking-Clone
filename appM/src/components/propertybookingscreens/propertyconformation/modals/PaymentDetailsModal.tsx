import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../../hooks/ThemeContext";
import createStyles from "../../../../screens/propertyBookingScreens/propertyConfirmation/PropertyConfirmationScreen.styles";

interface PaymentDetailsModalProps {
  visible: boolean;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  cardSubmitting: boolean;
  cardSubmittedSuccess: boolean;
  cardErrors: string[];
  keyboardOpen: boolean;
  keyboardHeight: number;
  onCardNumberChange: (text: string) => void;
  onCardNameChange: (text: string) => void;
  onCardExpiryChange: (text: string) => void;
  onCardCvvChange: (text: string) => void;
  onSubmitCard: () => void;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  visible,
  cardNumber,
  cardName,
  cardExpiry,
  cardCvv,
  cardSubmitting,
  cardSubmittedSuccess,
  cardErrors,
  keyboardOpen,
  keyboardHeight,
  onCardNumberChange,
  onCardNameChange,
  onCardExpiryChange,
  onCardCvvChange,
  onSubmitCard,
}) => {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);

  const nameRef = useRef<TextInput>(null);
  const expiryRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isCardNumberValid = cardNumber.replace(/\s/g, "").length === 16;
  const isCardNameValid = cardName.trim().length > 0;
  const isCardExpiryValid = (() => {
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) return false;
    const month = parseInt(cardExpiry.slice(0, 2));
    const year = parseInt(cardExpiry.slice(3, 5));
    if (month < 1 || month > 12) return false;
    const currentYear = 25; // 2025
    const currentMonth = 10; // October
    return (
      year > currentYear || (year === currentYear && month >= currentMonth)
    );
  })();
  const isCardCvvValid = cardCvv.length === 3;

  if (!visible) return null;

  const handleCardNumberChange = (text: string) => {
    let cleaned = text.replace(/[^\d]/g, "");
    if (cleaned.length > 16) cleaned = cleaned.slice(0, 16);
    const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
    onCardNumberChange(formatted);
    if (cleaned.length === 16) nameRef.current?.focus();
  };

  const handleCardNameChange = (text: string) => {
    onCardNameChange(text);
    if (text.trim().length >= 26) expiryRef.current?.focus();
  };

  const handleCardExpiryChange = (text: string) => {
    let cleaned = text.replace(/[^\d/]/g, "");
    if (cleaned.length === 2 && !cleaned.includes("/")) cleaned += "/";
    if (cleaned.length > 5) cleaned = cleaned.slice(0, 5);
    onCardExpiryChange(cleaned);
    if (cleaned.length === 5) cvvRef.current?.focus();
  };

  const handleCardCvvChange = (text: string) => {
    let cleaned = text.replace(/[^\d]/g, "");
    if (cleaned.length > 3) cleaned = cleaned.slice(0, 3);
    onCardCvvChange(cleaned);
    if (cleaned.length === 3) Keyboard.dismiss();
  };

  return (
    <View
      style={{
        marginTop: 16,
        padding: 16,
        backgroundColor: colors.card,
        borderRadius: 12,
        elevation: 2,
        marginBottom: keyboardOpen ? 50 : 0,
      }}
    >
      {!cardSubmittedSuccess && (
        <>
          <Text style={styles.formLabel}>Card number</Text>
          <View style={{ position: "relative" }}>
            <TextInput
              style={[
                styles.formInput,
                focusedField === "cardNumber" && {
                  borderColor: colors.button,
                  borderWidth: 2,
                },
              ]}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.textSecondary + "99"}
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              keyboardType="numeric"
              maxLength={19}
              onFocus={() => setFocusedField("cardNumber")}
              onBlur={() => setFocusedField(null)}
            />
            {isCardNumberValid && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="green"
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                }}
              />
            )}
          </View>

          <Text style={styles.formLabel}>Name on card</Text>
          <View style={{ position: "relative" }}>
            <TextInput
              style={[
                styles.formInput,
                focusedField === "cardName" && {
                  borderColor: colors.button,
                  borderWidth: 2,
                },
              ]}
              placeholder="Cardholder name"
              placeholderTextColor={colors.textSecondary + "99"}
              value={cardName}
              onChangeText={handleCardNameChange}
              ref={nameRef}
              maxLength={26}
              onFocus={() => setFocusedField("cardName")}
              onBlur={() => setFocusedField(null)}
            />
            {isCardNameValid && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="green"
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                }}
              />
            )}
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.formLabel}>Expiry (MM/YY)</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={[
                    styles.formInput,
                    focusedField === "cardExpiry" && {
                      borderColor: colors.button,
                      borderWidth: 2,
                    },
                  ]}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.textSecondary + "99"}
                  value={cardExpiry}
                  onChangeText={handleCardExpiryChange}
                  keyboardType="numeric"
                  ref={expiryRef}
                  maxLength={5}
                  onFocus={() => setFocusedField("cardExpiry")}
                  onBlur={() => setFocusedField(null)}
                />
                {isCardExpiryValid && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="green"
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 10,
                    }}
                  />
                )}
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.formLabel}>CVV</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={[
                    styles.formInput,
                    focusedField === "cardCvv" && {
                      borderColor: colors.button,
                      borderWidth: 2,
                    },
                  ]}
                  placeholder="CVV"
                  placeholderTextColor={colors.textSecondary + "99"}
                  value={cardCvv}
                  onChangeText={handleCardCvvChange}
                  keyboardType="numeric"
                  secureTextEntry={true}
                  ref={cvvRef}
                  maxLength={3}
                  onFocus={() => setFocusedField("cardCvv")}
                  onBlur={() => setFocusedField(null)}
                />
                {isCardCvvValid && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="green"
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 10,
                    }}
                  />
                )}
              </View>
            </View>
          </View>

          {cardErrors.length > 0 && (
            <View style={{ marginTop: 8 }}>
              {cardErrors.map((err, idx) => (
                <Text
                  key={idx}
                  style={{ color: "red", fontSize: 13, marginBottom: 2 }}
                >
                  {err}
                </Text>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.confirmBookingButton,
              {
                marginTop: 16,
                backgroundColor: colors.button,
                borderRadius: 8,
              },
            ]}
            onPress={onSubmitCard}
            disabled={cardSubmitting}
          >
            {cardSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmBookingButtonText}>
                Submit Payment Details
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PaymentDetailsModal;
