// path: src/components/account/PaymentInfoSection.tsx
import { JSX, useEffect, useState } from "react";
import {
  BackHandler,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import { FAQItem, faqs } from "../../data/paymentInfoData";
import AccountItem from "./AccountItem";
import AccountSection from "./AccountSection";
import { itemIcons } from "./itemIcons";

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

  // Modals
  const MainModal = activeModal === "main" && (
    <Modal
      visible
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setActiveModal(null)}
    >
      <SafeAreaView style={[styles.fullPage, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setActiveModal(null)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={styles.headerText}>Rewards & Wallet</Text>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          <View style={styles.walletSection}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="wallet"
                size={24}
                color={Colors.dark.icon}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.walletTitle}>Wallet balance</Text>
              <Text
                style={[
                  styles.walletBalanceText,
                  { fontSize: 18, marginLeft: "auto", marginBottom: 0 },
                ]}
              >
                € 0
              </Text>
            </View>
            <Text style={styles.walletSubtext}>
              Includes all spendable rewards
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text style={styles.creditText}>Credits</Text>
              <TouchableOpacity onPress={() => setActiveModal("info")}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={Colors.dark.textSecondary}
                  style={styles.infoIcon}
                />
              </TouchableOpacity>
              <Text style={[styles.creditText, { marginLeft: "auto" }]}>
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
            <Text style={styles.whatIsTitle}>What is Rewards & Wallet?</Text>
            <View style={styles.whatIsItem}>
              <Ionicons
                name="gift-outline"
                size={32}
                color={Colors.dark.icon}
              />
              <View style={styles.whatIsItemContent}>
                <Text style={styles.itemMainText}>
                  Book and earn travel rewards
                </Text>
                <Text style={styles.itemSubText}>
                  Credits, vouchers, you name it! These are all spendable on
                  your next Booking.com trip.
                </Text>
              </View>
            </View>
            <View style={styles.whatIsItem}>
              <Ionicons name="eye-outline" size={32} color={Colors.dark.icon} />
              <View style={styles.whatIsItemContent}>
                <Text style={styles.itemMainText}>
                  Track everything at a glance
                </Text>
                <Text style={styles.itemSubText}>
                  Your Wallet keeps all rewards safe, while updating you about
                  your earnings and spendings.
                </Text>
              </View>
            </View>
            <View style={styles.whatIsItem}>
              <Ionicons
                name="wallet-outline"
                size={32}
                color={Colors.dark.icon}
              />
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
    <Modal
      visible
      animationType="fade"
      transparent
      onRequestClose={() => setActiveModal(null)}
    >
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
            backgroundColor: Colors.dark.card,
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
              color: Colors.dark.text,
              marginBottom: 8,
            }}
          >
            Credits
          </Text>
          <Text
            style={{
              color: Colors.dark.textSecondary,
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
      visible
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setActiveModal(null)}
    >
      <SafeAreaView style={[styles.fullPage, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setActiveModal(null)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={styles.headerText}>Rewards & Wallet activity</Text>
        </View>
        <View
          style={{
            backgroundColor: Colors.dark.card,
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
              color={Colors.dark.icon}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: Colors.dark.text,
              }}
            >
              Wallet balance
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: Colors.dark.text,
                marginLeft: "auto",
              }}
            >
              € 0
            </Text>
          </View>
          <Text
            style={{
              color: Colors.dark.textSecondary,
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
                  color: Colors.dark.text,
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
              color: Colors.dark.text,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Nothing yet
          </Text>
          <Text
            style={{
              color: Colors.dark.textSecondary,
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
      visible
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setActiveModal(null)}
    >
      <SafeAreaView style={[styles.fullPage, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setActiveModal(null)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={styles.headerText}>FAQs</Text>
        </View>
        <ScrollView style={styles.faqContainer}>
          {faqs.map((faq: FAQItem, index) => (
            <Pressable
              key={index}
              style={styles.faqItem}
              onPress={() =>
                setExpandedFAQ(
                  expandedFAQ === faq.question ? null : faq.question,
                )
              }
            >
              <View style={styles.faqQuestionContainer}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={
                    expandedFAQ === faq.question ? "chevron-up" : "chevron-down"
                  }
                  size={24}
                  color={Colors.dark.icon}
                />
              </View>
              {expandedFAQ === faq.question && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const AddCardModal = (activeModal === "addCard" || justSavedCard) && (
    <Modal
      visible
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setActiveModal(null)}
    >
      <SafeAreaView style={[styles.fullPage, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setActiveModal(null)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={styles.headerText}>Add card</Text>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          <View style={styles.cardFormContainer}>
            <Text style={styles.label}>Card number</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Expiration date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={expiry}
                  onChangeText={setExpiry}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>CVC</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={cvc}
                  onChangeText={setCvc}
                />
              </View>
            </View>
            <Text style={styles.label}>Name on card</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <Pressable
              style={styles.button}
              onPress={() => handleSaveCard({ cardNumber, expiry, cvc, name })}
            >
              <Text style={styles.buttonText}>Save card</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const PaymentMethodsModal = activeModal === "paymentMethods" && (
    <Modal
      visible
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setActiveModal(null)}
    >
      <SafeAreaView style={[styles.fullPage, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setActiveModal(null)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={styles.headerText}>Payment details</Text>
        </View>
        <View style={styles.cardSection}>
          <Text style={styles.itemMainText}>Payment details</Text>
          <Text style={styles.cardSectionText}>
            Securely add or remove payment methods to make it easier when you
            book.
          </Text>
          {cardDetails && (
            <View
              style={{
                marginTop: 24,
                width: "100%",
                backgroundColor: Colors.dark.card,
                borderRadius: 8,
                padding: 16,
              }}
            >
              <Text
                style={{
                  color: Colors.dark.text,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Saved Card
              </Text>
              <Text style={{ color: Colors.dark.text, marginTop: 8 }}>
                Card Number: **** **** **** {cardDetails.cardNumber?.slice(-4)}
              </Text>
              <Text style={{ color: Colors.dark.text }}>
                Expiry: {cardDetails.expiry}
              </Text>
              <Text style={{ color: Colors.dark.text }}>
                Name: {cardDetails.name}
              </Text>
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
