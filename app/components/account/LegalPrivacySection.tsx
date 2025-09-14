import React, { JSX, useEffect, useState } from "react";
import {
  BackHandler,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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

interface Style {
  container: ViewStyle;
  content: ViewStyle;
  textContainer: ViewStyle;
  mainText: TextStyle;
  subText: TextStyle;
  separator: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  headerText: TextStyle;
  pageSection: ViewStyle;
  pageSectionTitle: TextStyle;
  pageItemContainer: ViewStyle;
  pageItemTextContainer: ViewStyle;
  pageItemMainText: TextStyle;
  pageItemSubText: TextStyle;
  fullContainer: ViewStyle;
  privacyHeader: ViewStyle;
  privacyHeaderTitle: TextStyle;
  privacyDescription: TextStyle;
  privacyOption: ViewStyle;
  privacyTextContainer: ViewStyle;
  privacyTitle: TextStyle;
  privacyDetails: TextStyle;
  privacyButtonContainer: ViewStyle;
  privacyButton: ViewStyle;
  saveButton: ViewStyle;
  buttonText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  content: { flexDirection: "row", alignItems: "center" },
  textContainer: { flex: 1, marginLeft: 12 },
  mainText: { fontSize: 16, fontWeight: "bold", color: Colors.dark.text },
  subText: { fontSize: 14, color: Colors.dark.textSecondary },
  separator: { height: 1, backgroundColor: "#333", marginVertical: 16 },
  fullContainer: {
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
  backButton: { paddingRight: 10 },
  headerText: { fontSize: 20, fontWeight: "bold", color: Colors.dark.text },
  pageSection: { marginTop: 20, marginHorizontal: 16 },
  pageSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 10,
  },
  pageItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  pageItemTextContainer: { flex: 1, marginLeft: 16 },
  pageItemMainText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  pageItemSubText: { fontSize: 14, color: Colors.dark.textSecondary },

  // New styles for cookie policy page
  privacyHeader: {
    padding: 16,
    backgroundColor: Colors.dark.card,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  privacyHeaderTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 8,
  },
  privacyDescription: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  privacyOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: Colors.dark.card,
    marginBottom: 10,
  },
  privacyTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  privacyDetails: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  privacyButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: Colors.dark.card,
  },
  privacyButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
});

export default function LegalPrivacySection(): JSX.Element {
  const [showFullPage, setShowFullPage] = useState(false);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const insets = useSafeAreaInsets();
  const [cookiePreferences, setCookiePreferences] = useState({
    functional: true,
    analytical: false,
    marketing: false,
  });

  const handleCookieToggle = (type: "analytical" | "marketing") => {
    setCookiePreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

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

  const items = [
    {
      title: "Terms of Service",
      description: "Read the terms that govern your use of our services.",
      content:
        "Welcome to our platform. By using our services, you agree to these Terms of Service. These terms outline user responsibilities, intellectual property rights, and limitations of liability. You are responsible for all activity on your account. We reserve the right to modify these terms at any time.",
    },
    {
      title: "Privacy Policy",
      description: "Understand how we collect and use your information.",
      content:
        "This Privacy Policy explains how we collect, use, and protect your personal information. We gather data you provide, like name and contact details, and also automatically collect information about your device and usage. This data is used to improve our services and personalize your experience. We do not sell your personal data to third parties.",
    },
    {
      title: "Cookie Policy",
      description: "Learn about cookies and how we use them.",
      content: "Custom component for Cookie Policy.",
      isCookiePolicy: true,
    },
  ];

  const renderCookiePolicy = () => (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.pageSection}>
          <Text style={styles.pageSectionTitle}>
            Select which cookies (and similar tracking technologies) you want to
            accept:
          </Text>
        </View>

        <View style={styles.privacyOption}>
          <Pressable onPress={() => {}}>
            <Ionicons
              name={
                cookiePreferences.functional
                  ? "checkmark-circle"
                  : "ellipse-outline"
              }
              size={24}
              color={
                cookiePreferences.functional
                  ? "#007AFF"
                  : Colors.dark.textSecondary
              }
            />
          </Pressable>
          <View style={styles.privacyTextContainer}>
            <Text style={styles.privacyTitle}>Functional cookies</Text>
            <Text style={styles.privacyDetails}>
              We use functional cookies to enable our website to work properly
              so you can create an account, sign in, and manage bookings. They
              also remember your selected currency, language, and past searches.
              These technical cookies must be enabled to use our site and
              services.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.privacyOption}
          onPress={() => handleCookieToggle("analytical")}
        >
          <Ionicons
            name={
              cookiePreferences.analytical
                ? "checkmark-circle"
                : "ellipse-outline"
            }
            size={24}
            color={
              cookiePreferences.analytical
                ? "#007AFF"
                : Colors.dark.textSecondary
            }
          />
          <View style={styles.privacyTextContainer}>
            <Text style={styles.privacyTitle}>Analytical cookies</Text>
            <Text style={styles.privacyDetails}>
              We and our partners use analytical cookies to gain information on
              your website usage, which is then used to understand how visitors
              like you use our platform and to improve the performance of our
              site and services.
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.privacyOption}
          onPress={() => handleCookieToggle("marketing")}
        >
          <Ionicons
            name={
              cookiePreferences.marketing
                ? "checkmark-circle"
                : "ellipse-outline"
            }
            size={24}
            color={
              cookiePreferences.marketing
                ? "#007AFF"
                : Colors.dark.textSecondary
            }
          />
          <View style={styles.privacyTextContainer}>
            <Text style={styles.privacyTitle}>Marketing cookies</Text>
            <Text style={styles.privacyDetails}>
              We and our partners use marketing cookies, including social media
              cookies, to collect information about your browsing behavior on
              this website that helps us decide which products to show you on
              and off our site.
            </Text>
          </View>
        </Pressable>
      </ScrollView>
      <View style={styles.privacyButtonContainer}>
        <Pressable
          style={[styles.privacyButton, { backgroundColor: Colors.dark.card }]}
          onPress={() => setActiveItem(null)}
        >
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>
        <Pressable
          style={[styles.privacyButton, styles.saveButton]}
          onPress={() => setActiveItem(null)}
        >
          <Text style={[styles.buttonText, { color: "white" }]}>
            Save changes
          </Text>
        </Pressable>
      </View>
    </View>
  );

  const Banner = (
    <Pressable style={styles.container} onPress={() => setShowFullPage(true)}>
      <View style={styles.content}>
        <Ionicons
          name="document-text-outline"
          size={24}
          color={Colors.dark.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>Legal & Privacy</Text>
          <Text style={styles.subText}>Read our terms, policies and more</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.dark.icon} />
      </View>
    </Pressable>
  );

  const FullPage = (
    <Modal
      visible={showFullPage}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={[styles.fullContainer, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              if (activeItem !== null) {
                setActiveItem(null);
              } else {
                setShowFullPage(false);
              }
            }}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={styles.headerText}>
            {activeItem === null ? "Legal & Privacy" : items[activeItem].title}
          </Text>
        </View>

        {activeItem === null ? (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: Math.max(24, insets.bottom + 16),
            }}
          >
            <View style={styles.pageSection}>
              <Text style={styles.pageSectionTitle}>Documents</Text>
              {items.map((item, index) => (
                <Pressable
                  key={index}
                  style={styles.pageItemContainer}
                  onPress={() => setActiveItem(index)}
                >
                  <View style={styles.pageItemTextContainer}>
                    <Text style={styles.pageItemMainText}>{item.title}</Text>
                    <Text style={styles.pageItemSubText}>
                      {item.description}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.dark.icon}
                  />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        ) : items[activeItem].isCookiePolicy ? (
          renderCookiePolicy()
        ) : (
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              paddingBottom: Math.max(24, insets.bottom + 16),
            }}
          >
            <Text style={styles.pageItemMainText}>
              {items[activeItem].content}
            </Text>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return showFullPage ? FullPage : Banner;
}
