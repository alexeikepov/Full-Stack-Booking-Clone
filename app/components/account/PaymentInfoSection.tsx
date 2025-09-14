import React, { JSX, useEffect, useState } from "react";
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
  View,
  ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import { FAQItem, faqs } from "../../data/paymentInfoData"; // Assumed path for data file
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
  input: ViewStyle;
  label: TextStyle;
  faqContainer: ViewStyle;
  faqItem: ViewStyle;
  faqQuestionContainer: ViewStyle;
  faqQuestion: TextStyle;
  faqAnswer: TextStyle;
}

const styles = StyleSheet.create<Style>({
  fullPage: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.dark.card,
  },
  backButton: {
    paddingRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
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
    color: Colors.dark.text,
    marginBottom: 4,
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
  creditText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  infoIcon: {
    marginLeft: 4,
  },
  rewardsActivityLink: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 16,
  },
  whatIsSection: {
    marginHorizontal: 16,
    marginTop: 30,
  },
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
  whatIsItemContent: {
    flex: 1,
    marginLeft: 15,
  },
  itemMainText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  itemSubText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
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
  cardFormContainer: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    color: Colors.dark.text,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  faqContainer: {
    padding: 16,
  },
  faqItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
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
  faqAnswer: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 10,
  },
});

export default function PaymentInfoSection(): JSX.Element {
  const [showModal, setShowModal] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!showModal) return;
    const handler = () => true;
    let subscription: { remove: () => void } | undefined;
    if (Platform.OS === "android") {
      subscription = BackHandler.addEventListener("hardwareBackPress", handler);
    }
    return () => {
      if (subscription) subscription.remove();
    };
  }, [showModal]);

  const items = ["Rewards & Wallet", "Payment methods"];

  const getModalContent = () => {
    switch (showModal) {
      case "Rewards & Wallet":
        return (
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
              </View>
              <Text style={styles.walletBalanceText}>€ 0</Text>
              <Text style={styles.walletSubtext}>
                Includes all spendable rewards
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.creditText}>Credits</Text>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={Colors.dark.textSecondary}
                  style={styles.infoIcon}
                />
                <Text style={[styles.creditText, { marginLeft: "auto" }]}>
                  € 0
                </Text>
              </View>
              <Pressable onPress={() => {}}>
                <Text style={styles.rewardsActivityLink}>
                  View rewards activity
                </Text>
              </Pressable>
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
                <Ionicons
                  name="eye-outline"
                  size={32}
                  color={Colors.dark.icon}
                />
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
                    If a booking accepts any rewards in your Wallet, it’ll
                    appear during payment for spending.
                  </Text>
                </View>
              </View>
            </View>
            <Pressable
              style={styles.button}
              onPress={() => setShowModal("FAQs")}
            >
              <Text style={styles.buttonText}>Need help? Visit FAQs</Text>
            </Pressable>
          </ScrollView>
        );
      case "Payment methods":
        return (
          <View style={{ flex: 1 }}>
            <View style={styles.cardSection}>
              <Text style={styles.itemMainText}>Payment details</Text>
              <Text style={styles.cardSectionText}>
                Securely add or remove payment methods to make it easier when
                you book.
              </Text>
            </View>
            <Pressable
              style={styles.addCardButton}
              onPress={() => setShowModal("Add card")}
            >
              <Text style={styles.buttonText}>Add card</Text>
            </Pressable>
          </View>
        );
      case "Add card":
        return (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <View style={styles.cardFormContainer}>
              <Text style={styles.label}>Card number</Text>
              <TextInput style={styles.input} keyboardType="numeric" />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>Expiration date</Text>
                  <TextInput style={styles.input} placeholder="MM/YY" />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.label}>CVC</Text>
                  <TextInput style={styles.input} keyboardType="numeric" />
                </View>
              </View>
              <Text style={styles.label}>Name on card</Text>
              <TextInput style={styles.input} />
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Save card</Text>
              </Pressable>
            </View>
          </ScrollView>
        );
      case "FAQs":
        return (
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
                      expandedFAQ === faq.question
                        ? "chevron-up"
                        : "chevron-down"
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
        );
      default:
        return null;
    }
  };

  const getModalHeaderTitle = () => {
    switch (showModal) {
      case "Rewards & Wallet":
        return "Rewards & Wallet";
      case "Payment methods":
        return "Payment details";
      case "Add card":
        return "Add card";
      case "FAQs":
        return "FAQs";
      default:
        return "";
    }
  };

  const ModalComponent = (
    <Modal
      visible={!!showModal}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setShowModal(null)}
    >
      <SafeAreaView style={[styles.fullPage, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setShowModal(null)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={styles.headerText}>{getModalHeaderTitle()}</Text>
        </View>
        {getModalContent()}
      </SafeAreaView>
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
          onPress={() => setShowModal(title)}
        />
      ))}
      {ModalComponent}
    </AccountSection>
  );
}

// Assumed content of data/paymentInfoData.ts
// export interface FAQItem {
//   question: string;
//   answer: string;
// }
//
// export const faqs: FAQItem[] = [
//   {
//     question: "What is Wallet credit?",
//     answer: "Wallet credits are a type of travel reward you can earn. They are automatically added to your Wallet and can be used to pay for eligible bookings.",
//   },
//   {
//     question: "How do I use my Wallet balance?",
//     answer: "When you book an eligible property, you'll see the option to use your Wallet balance during the payment process. Your credits will be applied automatically.",
//   },
//   {
//     question: "Can I transfer my Wallet credit?",
//     answer: "No, Wallet credits and other rewards cannot be transferred to another account.",
//   },
//   {
//     question: "Do my Wallet credits expire?",
//     answer: "Yes, some rewards may have an expiration date. Check the terms and conditions of each reward for more details.",
//   },
//   {
//     question: "Is there a limit to how much credit I can have?",
//     answer: "There may be a maximum amount of credit you can hold in your Wallet. This is to ensure fair usage and prevent fraud.",
//   },
// ];
