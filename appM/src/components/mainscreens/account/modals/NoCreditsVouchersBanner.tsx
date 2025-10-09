// path: src/components/account/NoCreditsVouchersBanner.tsx
import { AntDesign } from "@expo/vector-icons";
import { JSX, useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
import { Colors } from "../../../ui/Colors";
import { useTheme } from "../../../../hooks/ThemeContext";
const placeholderImg = require("../../../../assets/images/hotel7.png");

interface Style {
  container: ViewStyle;
  content: ViewStyle;
  mainText: TextStyle;
  iconContainer: ViewStyle;
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
  itemTextContainer: ViewStyle;
  itemMainText: TextStyle;
  itemSubText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginVertical: 20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  mainText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
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
  itemTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
});

export default function NoCreditsVouchersBanner(): JSX.Element {
  const { colors } = useTheme();
  const [activeModal, setActiveModal] = useState<
    "fullPage" | "info" | "rewards" | "faq" | null
  >(null);
  const [faqOpen, setFaqOpen] = useState<string | null>(null);
  const [walletTab, setWalletTab] = useState<
    "Spendable" | "Pending" | "History"
  >("Spendable");
  const insets = useSafeAreaInsets();

  // Handle Android back
  useEffect(() => {
    const handler = () => {
      if (activeModal) {
        setActiveModal(null);
        return true;
      }
      return false;
    };
    let subscription: { remove: () => void } | undefined;
    if (Platform.OS === "android" && activeModal) {
      subscription = BackHandler.addEventListener("hardwareBackPress", handler);
    }
    return () => {
      if (subscription) subscription.remove();
    };
  }, [activeModal]);

  // Banner
  const Banner = (
    <Pressable
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={() => setActiveModal("fullPage")}
    >
      <View style={styles.content}>
        <Text style={[styles.mainText, { color: colors.text }]}>
          No Credits or vouchers yet
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.mainText, { color: colors.text }]}>€ 0</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={colors.icon}
          style={styles.iconContainer}
        />
      </View>
    </Pressable>
  );

  // FAQ data
  const faqs = [
    {
      q: "What's the Wallet?",
      a: "Your Wallet is a digital space where all your Booking.com rewards, credits, and vouchers are stored and managed for easy use.",
    },
    {
      q: "How does Rewards & Wallet help me?",
      a: "It helps you keep track of your rewards, spend them easily, and get the most out of your bookings.",
    },
    {
      q: "What's the difference between the Genius loyalty program and Rewards & Wallet?",
      a: "Genius is a loyalty program with exclusive discounts, while Rewards & Wallet is where you manage and spend your earned credits and vouchers.",
    },
    {
      q: "In which countries will I be able to enjoy the benefits of Rewards & Wallet?",
      a: "Rewards & Wallet is available in most countries, but availability may vary. Check Booking.com for the latest info.",
    },
    {
      q: "Can I change the currency that my Wallet is based in?",
      a: "No, the Wallet currency is set based on your account and cannot be changed manually.",
    },
    {
      q: "How do I earn Credits or vouchers?",
      a: "You earn credits or vouchers by booking eligible stays, activities, or using special promotions.",
    },
    {
      q: "What's the difference between Travel Credits and Cash Credits?",
      a: "Travel Credits can be used for future bookings, while Cash Credits may be withdrawn or used more flexibly, depending on the offer.",
    },
  ];

  return (
    <>
      {Banner}

      {/* FullPage Modal */}
      {activeModal === "fullPage" && (
        <Modal
          visible
          animationType="slide"
          transparent={false}
          presentationStyle="fullScreen"
          onRequestClose={() => setActiveModal(null)}
        >
          <SafeAreaView
            style={[
              styles.fullPage,
              { paddingTop: insets.top, backgroundColor: colors.background },
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
                  style={[
                    styles.walletSubtext,
                    { color: colors.textSecondary },
                  ]}
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
                      style={[
                        styles.itemSubText,
                        { color: colors.textSecondary },
                      ]}
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
                      style={[
                        styles.itemSubText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Your Wallet keeps all rewards safe, while updating you
                      about your earnings and spendings.
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
              <TouchableOpacity
                style={styles.button}
                onPress={() => setActiveModal("faq")}
              >
                <Text style={styles.buttonText}>Need help? Visit FAQs</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

      {/* Info Modal */}
      {activeModal === "info" && (
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
                Credits are spendable on anything through Booking.com that
                accepts Wallet payments.
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
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  Got it
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Rewards Modal */}
      {activeModal === "rewards" && (
        <Modal
          visible
          animationType="slide"
          transparent={false}
          presentationStyle="fullScreen"
          onRequestClose={() => setActiveModal(null)}
        >
          <SafeAreaView
            style={[
              styles.fullPage,
              { paddingTop: insets.top, backgroundColor: colors.background },
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
                  onPress={() => setWalletTab(tab as any)}
                  style={{
                    borderBottomWidth: walletTab === tab ? 2 : 0,
                    borderBottomColor: "#007AFF",
                    paddingBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      color: walletTab === tab ? "#007AFF" : colors.text,
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
              <Image
                source={placeholderImg}
                style={{
                  width: 120,
                  height: 120,
                  marginBottom: 24,
                  borderRadius: 60,
                }}
                resizeMode="cover"
              />
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
      )}

      {/* FAQ Modal */}
      {activeModal === "faq" && (
        <Modal
          visible
          animationType="slide"
          transparent={false}
          presentationStyle="fullScreen"
          onRequestClose={() => setActiveModal(null)}
        >
          <SafeAreaView
            style={[
              styles.fullPage,
              { paddingTop: insets.top, backgroundColor: colors.background },
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
                Rewards & Wallet FAQs
              </Text>
            </View>
            <ScrollView
              contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            >
              <View style={{ marginHorizontal: 16, marginTop: 20 }}>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontWeight: "bold",
                    fontSize: 18,
                    marginBottom: 16,
                  }}
                >
                  Rewards & Wallet overview
                </Text>
                {faqs.slice(0, 5).map((item) => (
                  <View
                    key={item.q}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: colors.textSecondary,
                      marginBottom: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        setFaqOpen(faqOpen === item.q ? null : item.q)
                      }
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 14,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: 16,
                          fontWeight: "bold",
                          flex: 1,
                        }}
                      >
                        {item.q}
                      </Text>
                      <AntDesign
                        name={faqOpen === item.q ? "up" : "down"}
                        size={18}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                    {faqOpen === item.q && (
                      <Text
                        style={{
                          color: colors.textSecondary,
                          fontSize: 15,
                          marginBottom: 10,
                          marginLeft: 4,
                        }}
                      >
                        {item.a}
                      </Text>
                    )}
                  </View>
                ))}
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontWeight: "bold",
                    fontSize: 18,
                    marginTop: 24,
                    marginBottom: 16,
                  }}
                >
                  Earning Credits
                </Text>
                {faqs.slice(5).map((item) => (
                  <View
                    key={item.q}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: colors.textSecondary,
                      marginBottom: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        setFaqOpen(faqOpen === item.q ? null : item.q)
                      }
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 14,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: 16,
                          fontWeight: "bold",
                          flex: 1,
                        }}
                      >
                        {item.q}
                      </Text>
                      <AntDesign
                        name={faqOpen === item.q ? "up" : "down"}
                        size={18}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                    {faqOpen === item.q && (
                      <Text
                        style={{
                          color: colors.textSecondary,
                          fontSize: 15,
                          marginBottom: 10,
                          marginLeft: 4,
                        }}
                      >
                        {item.a}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </>
  );
}
