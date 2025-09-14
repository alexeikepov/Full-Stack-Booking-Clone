import React, { JSX, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
  BackHandler,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";

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
  const [showFullPage, setShowFullPage] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!showFullPage) return;
    const handler = () => true;
    let subscription: { remove: () => void } | undefined;
    if (Platform.OS === "android") {
      subscription = BackHandler.addEventListener("hardwareBackPress", handler);
    }
    return () => {
      if (subscription) subscription.remove();
    };
  }, [showFullPage]);

  const Banner = (
    <Pressable style={styles.container} onPress={() => setShowFullPage(true)}>
      <View style={styles.content}>
        <Text style={styles.mainText}>No Credits or vouchers yet</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.mainText}>€ 0</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={Colors.dark.icon}
          style={styles.iconContainer}
        />
      </View>
    </Pressable>
  );

  const FullPage = (
    <Modal
      visible={showFullPage}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => {}}
    >
      <SafeAreaView style={[styles.fullPage, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setShowFullPage(false)}
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
            <Pressable>
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
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Need help? Visit FAQs</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return showFullPage ? FullPage : Banner;
}
