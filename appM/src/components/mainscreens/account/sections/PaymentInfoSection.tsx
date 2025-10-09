// path: src/components/account/PaymentInfoSection.tsx
import { JSX, useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../../ui/Colors";
import { FAQItem, faqs } from "../../../../data/paymentInfoData";
import { useTheme } from "../../../../hooks/ThemeContext";
import AccountItem from "../sections/AccountItem";
import AccountSection from "./AccountSection";
import { itemIcons } from "../../../../utils/itemIcons";
interface Style {
  fullPage: ViewStyle;
  header: ViewStyle;
  headerText: TextStyle;
  backButton: ViewStyle;
  walletSection: ViewStyle;
  walletTitle: TextStyle;
  walletBalanceText: TextStyle;
  walletSubtext: TextStyle;
  creditText: TextStyle;
  infoIcon: ViewStyle;
  rewardsActivityLink: TextStyle;
  whatIsSection: ViewStyle;
  whatIsTitle: TextStyle;
  whatIsItem: ViewStyle;
  whatIsItemContent: ViewStyle;
  itemMainText: TextStyle;
  itemSubText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  cardSection: ViewStyle;
  cardSectionText: TextStyle;
  addCardButton: ViewStyle;
  cardFormContainer: ViewStyle;
  input: TextStyle;
  label: TextStyle;
  faqContainer: ViewStyle;
  faqItem: ViewStyle;
  faqQuestionContainer: ViewStyle;
  faqQuestion: TextStyle;
  faqAnswer: TextStyle;
}
const styles = StyleSheet.create<Style>({
  fullPage: { flex: 1, backgroundColor: Colors.dark.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.dark.card,
  },
  backButton: { paddingRight: 10 },
  headerText: { fontSize: 20, fontWeight: "bold", color: Colors.dark.text },
  walletSection: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.dark.text,
  },
  walletBalanceText: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 10,
  },
  walletSubtext: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 16,
  },
  creditText: { fontSize: 16, color: Colors.dark.text },
  infoIcon: { marginLeft: 4 },
  rewardsActivityLink: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 16,
  },
  whatIsSection: { marginHorizontal: 16, marginTop: 30 },
  whatIsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 15,
  },
  whatIsItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  whatIsItemContent: { flex: 1, marginLeft: 15 },
  itemMainText: { fontSize: 16, fontWeight: "bold", color: Colors.dark.text },
  itemSubText: { fontSize: 14, color: Colors.dark.textSecondary },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 30,
  },
  buttonText: { fontSize: 16, fontWeight: "bold", color: "white" },
  cardSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  cardSectionText: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  addCardButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: "auto",
    marginBottom: 20,
  },
  cardFormContainer: { padding: 16 },
  label: { fontSize: 14, color: Colors.dark.textSecondary, marginBottom: 8 },
  input: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    color: Colors.dark.text,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  faqContainer: { padding: 16 },
  faqItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: Colors.dark.textSecondary,
  },
  faqQuestionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.text,
    paddingRight: 10,
  },
  faqAnswer: { fontSize: 14, color: Colors.dark.textSecondary, marginTop: 10 },
});
export default function PaymentInfoSection(): JSX.Element {
  const { colors } = useTheme();
  const [activeModal, setActiveModal] = useState<
    null | "main" | "info" | "rewards" | "faq" | "addCard" | "paymentMethods"
  >(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
    name?: string;
  }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const insets = useSafeAreaInsets();
  // Android back handler
  useEffect(() => {
    if (!activeModal) return;
    const handler = () => {
      setActiveModal(null);
      return true;
    };
    let subscription: { remove: () => void } | undefined;
    if (Platform.OS === "android")
      subscription = BackHandler.addEventListener("hardwareBackPress", handler);
    return () => {
      if (subscription) subscription.remove();
    };
  }, [activeModal]);
  const items = ["Rewards & Wallet", "Payment methods"];
  // Track if a card was just saved to keep AddCardModal open while showing SavedModal
  const [justSavedCard, setJustSavedCard] = useState(false);
  const handleSaveCard = (details: any) => {
    setCardDetails(details);
    // reset form fields after saving
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setName("");
    setErrors({});
    setIsFormValid(false);
    setShowSavedModal(true);
    setJustSavedCard(true);
    setTimeout(() => {
      setShowSavedModal(false);
      setTimeout(() => {
        setActiveModal("paymentMethods");
        setJustSavedCard(false);
      }, 100);
    }, 1200);
  };
  // Validation helpers
  const luhnCheck = (num: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };
  const validateAll = () => {
    const newErrors: any = {};
    const digits = cardNumber.replace(/\D/g, "");
    // Accept any 16-digit entry as valid (wildcard requirement).
    // For other lengths (13-19), require passing the Luhn check.
    if (digits.length === 16) {
      // valid: 16 digits — skip Luhn check
    } else if (!/^[0-9]{13,19}$/.test(digits) || !luhnCheck(digits)) {
      newErrors.cardNumber = "Enter a valid card number";
    }
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
      newErrors.expiry = "Use MM/YY format";
    } else {
      const parts = expiry.split("/");
      const m = parseInt(parts[0], 10);
      const y = 2000 + parseInt(parts[1], 10);
      const expDate = new Date(y, m - 1, 1);
      const now = new Date();
      expDate.setMonth(expDate.getMonth() + 1);
      if (expDate <= now) newErrors.expiry = "Card has expired";
    }
    if (!/^[0-9]{3,4}$/.test(cvc)) {
      newErrors.cvc = "Enter 3 or 4 digit CVC";
    }
    if (!name || name.trim().length < 2) {
      newErrors.name = "Enter the name on card";
    }
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };
  useEffect(() => {
    validateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardNumber, expiry, cvc, name]);

  // Format card number: insert a space every 4 digits and limit to 19 digits
  const formatCardNumber = (input: string) => {
    // strip non-digits
    const digits = input.replace(/\D/g, "").slice(0, 16); // up to 19 digits
    // group into 4s
    const groups: string[] = [];
    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.slice(i, i + 4));
    }
    return groups.join(" ");
  };
  const handleRemoveCard = () => {
    if (!cardDetails) return;
    Alert.alert(
      "Remove card",
      "Are you sure you want to remove this saved card? We promise we will not do anything bad with it :(, trust us...",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setCardDetails(null);
          },
        },
      ],
    );
  };
  // Modals
  const MainModal = activeModal === "main" && (
    <Modal
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setActiveModal(null)}
    >
      <SafeAreaView
        style={[
          styles.fullPage,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Pressable
            onPress={() => setActiveModal(null)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerText, { color: colors.text }]}>
            Rewards & Wallet
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          <View
            style={[styles.walletSection, { backgroundColor: colors.card }]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="wallet"
                size={24}
                color={colors.icon}
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.walletTitle, { color: colors.text }]}>
                Wallet balance
              </Text>
              <Text
                style={[
                  styles.walletBalanceText,
                  {
                    fontSize: 18,
                    marginLeft: "auto",
                    marginBottom: 0,
                    color: colors.text,
                  },
                ]}
              >
                € 0
              </Text>
            </View>
            <Text
              style={[styles.walletSubtext, { color: colors.textSecondary }]}
            >
              Includes all spendable rewards
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text style={[styles.creditText, { color: colors.text }]}>
                Credits
              </Text>
              <TouchableOpacity onPress={() => setActiveModal("info")}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={colors.textSecondary}
                  style={styles.infoIcon}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.creditText,
                  { marginLeft: "auto", color: colors.text },
                ]}
              >
                € 0
              </Text>
            </View>
            <TouchableOpacity onPress={() => setActiveModal("rewards")}>
              <Text style={styles.rewardsActivityLink}>
                View rewards activity
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.whatIsSection}>
            <Text style={[styles.whatIsTitle, { color: colors.text }]}>
              What is Rewards & Wallet?
            </Text>
            <View style={styles.whatIsItem}>
              <Ionicons name="gift-outline" size={32} color={colors.icon} />
              <View style={styles.whatIsItemContent}>
                <Text style={[styles.itemMainText, { color: colors.text }]}>
                  Book and earn travel rewards
                </Text>
                <Text
                  style={[styles.itemSubText, { color: colors.textSecondary }]}
                >
                  Credits, vouchers, you name it! These are all spendable on
                  your next Booking.com trip.
                </Text>
              </View>
            </View>
            <View style={styles.whatIsItem}>
              <Ionicons name="eye-outline" size={32} color={colors.icon} />
              <View style={styles.whatIsItemContent}>
                <Text style={[styles.itemMainText, { color: colors.text }]}>
                  Track everything at a glance
                </Text>
                <Text
                  style={[styles.itemSubText, { color: colors.textSecondary }]}
                >
                  Your Wallet keeps all rewards safe, while updating you about
                  your earnings and spendings.
                </Text>
              </View>
            </View>
            <View style={styles.whatIsItem}>
              <Ionicons name="wallet-outline" size={32} color={colors.icon} />
              <View style={styles.whatIsItemContent}>
                <Text style={styles.itemMainText}>
                  Pay with Wallet to save money
                </Text>
                <Text style={styles.itemSubText}>
                  If a booking accepts any rewards in your Wallet, it’ll appear
                  during payment for spending.
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setActiveModal("faq")}
          >
            <Text style={styles.buttonText}>Need help? Visit FAQs</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
  const InfoModal = activeModal === "info" && (
    <Modal animationType="fade" onRequestClose={() => setActiveModal(null)}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 24,
            width: 320,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              color: colors.text,
              marginBottom: 8,
            }}
          >
            Credits
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 15,
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Credits are spendable on anything through Booking.com that accepts
            Wallet payments.
          </Text>
          <TouchableOpacity
            onPress={() => setActiveModal(null)}
            style={{
              backgroundColor: "#007AFF",
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 32,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Got it
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  const RewardsModal = activeModal === "rewards" && (
    <Modal
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setActiveModal(null)}
    >
      <SafeAreaView
        style={[
          styles.fullPage,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Pressable
            onPress={() => setActiveModal(null)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerText, { color: colors.text }]}>
            Rewards & Wallet activity
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.card,
            margin: 16,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Ionicons
              name="wallet"
              size={24}
              color={colors.icon}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: colors.text,
              }}
            >
              Wallet balance
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: colors.text,
                marginLeft: "auto",
              }}
            >
              € 0
            </Text>
          </View>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginBottom: 8,
            }}
          >
            Includes all spendable rewards
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 16,
          }}
        >
          {["Spendable", "Pending", "History"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={{
                borderBottomWidth: 0,
                borderBottomColor: "#007AFF",
                paddingBottom: 6,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 22,
              color: colors.text,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Nothing yet
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Confirmed rewards can take up to 24 hours to appear here for
            spending.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
  const FaqModal = activeModal === "faq" && (
    <Modal
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setActiveModal(null)}
    >
      <SafeAreaView
        style={[
          styles.fullPage,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Pressable
            onPress={() => setActiveModal(null)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerText, { color: colors.text }]}>FAQs</Text>
        </View>
        <ScrollView style={styles.faqContainer}>
          {faqs.map((faq: FAQItem, index) => (
            <Pressable
              key={index}
              style={[
                styles.faqItem,
                { borderBottomColor: colors.textSecondary },
              ]}
              onPress={() =>
                setExpandedFAQ(
                  expandedFAQ === faq.question ? null : faq.question,
                )
              }
            >
              <View style={styles.faqQuestionContainer}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>
                  {faq.question}
                </Text>
                <Ionicons
                  name={
                    expandedFAQ === faq.question ? "chevron-up" : "chevron-down"
                  }
                  size={24}
                  color={colors.icon}
                />
              </View>
              {expandedFAQ === faq.question && (
                <Text
                  style={[styles.faqAnswer, { color: colors.textSecondary }]}
                >
                  {faq.answer}
                </Text>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
  const AddCardModal = (activeModal === "addCard" || justSavedCard) && (
    <Modal
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setActiveModal(null)}
    >
      <SafeAreaView
        style={[
          styles.fullPage,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Pressable
            onPress={() => setActiveModal(null)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerText, { color: colors.text }]}>
            Add card
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            >
              <View style={[styles.cardFormContainer, { paddingTop: 8 }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  Card number
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.text },
                  ]}
                  keyboardType="numeric"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={20} // 19 digits + up to 4 spaces
                />
                {errors.cardNumber && (
                  <Text style={{ color: "#ff3b30", marginBottom: 8 }}>
                    {errors.cardNumber}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text
                      style={[styles.label, { color: colors.textSecondary }]}
                    >
                      Expiration date
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        { backgroundColor: colors.card, color: colors.text },
                      ]}
                      placeholder="MM/YY"
                      value={expiry}
                      onChangeText={(text) =>
                        setExpiry(
                          text
                            .replace(/[^0-9\/]/g, "")
                            .replace(/^(\d{2})(\d)/, "$1/$2"),
                        )
                      }
                      maxLength={5}
                      keyboardType="numeric"
                    />
                    {errors.expiry && (
                      <Text style={{ color: "#ff3b30", marginBottom: 8 }}>
                        {errors.expiry}
                      </Text>
                    )}
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text
                      style={[styles.label, { color: colors.textSecondary }]}
                    >
                      CVC
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        { backgroundColor: colors.card, color: colors.text },
                      ]}
                      keyboardType="numeric"
                      value={cvc}
                      onChangeText={(text) => setCvc(text.replace(/\D/g, ""))}
                      maxLength={4}
                      placeholder="123"
                    />
                    {errors.cvc && (
                      <Text style={{ color: "#ff3b30", marginBottom: 8 }}>
                        {errors.cvc}
                      </Text>
                    )}
                  </View>
                </View>

                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  Name on card
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.text },
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Full name"
                />
                {errors.name && (
                  <Text style={{ color: "#ff3b30", marginBottom: 8 }}>
                    {errors.name}
                  </Text>
                )}

                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: isFormValid ? "#007AFF" : "#9bbcff" },
                    { paddingVertical: 14 },
                  ]}
                  onPress={() =>
                    handleSaveCard({ cardNumber, expiry, cvc, name })
                  }
                  disabled={!isFormValid}
                >
                  <Text style={styles.buttonText}>Save card</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
  const PaymentMethodsModal = activeModal === "paymentMethods" && (
    <Modal
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setActiveModal(null)}
    >
      <SafeAreaView
        style={[
          styles.fullPage,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Pressable
            onPress={() => setActiveModal(null)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerText, { color: colors.text }]}>
            Payment details
          </Text>
        </View>
        <View style={styles.cardSection}>
          <Text style={[styles.itemMainText, { color: colors.text }]}>
            Payment details
          </Text>
          <Text
            style={[styles.cardSectionText, { color: colors.textSecondary }]}
          >
            Securely add or remove payment methods to make it easier when you
            book.
          </Text>
          {cardDetails && (
            <View
              style={{
                marginTop: 24,
                width: "100%",
                backgroundColor: colors.card,
                borderRadius: 8,
                padding: 16,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Saved Card Details:
              </Text>
              <Text style={{ fontSize: 4 }}>( פראיירים )</Text>
              <Text style={{ color: colors.text, marginTop: 8 }}>
                Card Number: **** **** **** {cardDetails.cardNumber?.slice(-4)}
              </Text>
              <Text style={{ color: colors.text }}>
                Expiry: {cardDetails.expiry}
              </Text>
              <Text style={{ color: colors.text }}>
                Name: {cardDetails.name}
              </Text>
              <TouchableOpacity
                onPress={handleRemoveCard}
                style={{
                  marginTop: 12,
                  alignSelf: "flex-end",
                  backgroundColor: "#ff3b30",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Remove card
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.addCardButton}
          onPress={() => setActiveModal("addCard")}
        >
          <Text style={styles.buttonText}>Add card</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
  const SavedModal = showSavedModal && (
    <Modal visible transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 24,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#22c55e" }}>
            Card Saved!
          </Text>
        </View>
      </View>
    </Modal>
  );
  return (
    <AccountSection title="Payment info">
      {items.map((title) => (
        <AccountItem
          key={title}
          icon={
            <Ionicons
              name={itemIcons[title]}
              size={20}
              color={Colors.dark.icon}
            />
          }
          title={title}
          onPress={() => {
            if (title === "Rewards & Wallet") setActiveModal("main");
            else if (title === "Payment methods")
              setActiveModal("paymentMethods");
          }}
        />
      ))}
      {MainModal}
      {InfoModal}
      {RewardsModal}
      {FaqModal}
      {AddCardModal}
      {PaymentMethodsModal}
      {SavedModal}
    </AccountSection>
  );
}
