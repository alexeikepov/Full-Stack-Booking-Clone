import { JSX, useEffect, useState } from "react";
import {
  BackHandler,
  Modal,
  Platform,
  Pressable,
  ScrollView,
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
import { Colors } from "../../../ui/Colors";
import { useTheme } from "../../../../hooks/ThemeContext";

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

const createStyles = (colors: typeof Colors.light): Style => ({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  content: { flexDirection: "row", alignItems: "center" },
  textContainer: { flex: 1, marginLeft: 12 },
  mainText: { fontSize: 16, fontWeight: "bold", color: colors.text },
  subText: { fontSize: 14, color: colors.textSecondary },
  separator: {
    height: 1,
    backgroundColor: colors.separator,
    marginVertical: 16,
  },
  fullContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
  },
  backButton: { paddingRight: 10 },
  headerText: { fontSize: 20, fontWeight: "bold", color: colors.text },
  pageSection: { marginTop: 20, marginHorizontal: 16 },
  pageSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  pageItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  pageItemTextContainer: { flex: 1, marginLeft: 16 },
  pageItemMainText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  pageItemSubText: { fontSize: 14, color: colors.textSecondary },
  // New styles for cookie policy page
  privacyHeader: {
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  privacyHeaderTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  privacyDescription: {
    fontSize: 16,
    color: colors.text,
  },
  privacyOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.card,
    marginBottom: 10,
  },
  privacyTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  privacyDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  privacyButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: colors.card,
  },
  privacyButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: colors.blue,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
});

export default function LegalPrivacySection(): JSX.Element {
  const { colors } = useTheme();
  const styles = createStyles(colors);
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

  const handleItemPress = (item: number) => {
    setActiveItem(item);
    setShowFullPage(true);
  };

  const getModalContent = () => {
    switch (activeItem) {
      case 0:
        return (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <View style={styles.pageSection}>
              <Text style={styles.pageSectionTitle}>
                Cookie settings and privacy policy
              </Text>
              <Text
                style={{ fontSize: 16, color: colors.text, marginBottom: 20 }}
              >
                We use cookies to improve your experience on our platform. You
                can customize your cookie preferences below.
              </Text>
            </View>

            <View style={styles.privacyOption}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.green}
                style={{ marginTop: 4 }}
              />
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyTitle}>Functional cookies</Text>
                <Text style={styles.privacyDetails}>
                  These cookies are essential for the website to function
                  properly. They cannot be disabled.
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
                color={cookiePreferences.analytical ? colors.blue : colors.icon}
                style={{ marginTop: 4 }}
              />
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyTitle}>Analytical cookies</Text>
                <Text style={styles.privacyDetails}>
                  Help us understand how visitors interact with our website.
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
                color={cookiePreferences.marketing ? colors.blue : colors.icon}
                style={{ marginTop: 4 }}
              />
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyTitle}>Marketing cookies</Text>
                <Text style={styles.privacyDetails}>
                  Used to deliver personalized ads and track their
                  effectiveness.
                </Text>
              </View>
            </Pressable>
          </ScrollView>
        );

      case 1:
        return (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <View style={styles.pageSection}>
              <Text style={styles.pageSectionTitle}>Terms & Conditions</Text>
              <Text
                style={{ fontSize: 16, color: colors.text, lineHeight: 24 }}
              >
                By using our services, you agree to these terms and
                conditions...
                {"\n\n"}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                {"\n\n"}
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </Text>
            </View>
          </ScrollView>
        );

      case 2:
        return (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <View style={styles.pageSection}>
              <Text style={styles.pageSectionTitle}>Privacy Policy</Text>
              <Text
                style={{ fontSize: 16, color: colors.text, lineHeight: 24 }}
              >
                Your privacy is important to us. This policy explains how we
                collect, use, and protect your information...
                {"\n\n"}
                We collect information when you use our services, including
                personal details and usage data.
                {"\n\n"}
                This information is used to improve our services and provide
                personalized experiences.
              </Text>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  const getModalHeaderTitle = () => {
    switch (activeItem) {
      case 0:
        return "Cookie Settings";
      case 1:
        return "Terms & Conditions";
      case 2:
        return "Privacy Policy";
      default:
        return "";
    }
  };

  const items = [
    {
      icon: "shield-checkmark-outline",
      title: "Cookie settings",
      subtitle: "Manage your cookie preferences",
    },
    {
      icon: "document-text-outline",
      title: "Terms & Conditions",
      subtitle: "Read our terms of service",
    },
    {
      icon: "lock-closed-outline",
      title: "Privacy Policy",
      subtitle: "How we handle your data",
    },
  ];

  return (
    <>
      <Pressable style={styles.container} onPress={() => setShowFullPage(true)}>
        <View style={styles.content}>
          <Ionicons name="shield-outline" size={24} color={colors.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>Legal & Privacy</Text>
            <Text style={styles.subText}>
              Cookie settings, terms, and privacy policy
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </View>
      </Pressable>

      <Modal
        visible={showFullPage}
        animationType="slide"
        transparent={false}
        presentationStyle="fullScreen"
        onRequestClose={() => setShowFullPage(false)}
      >
        <SafeAreaView
          style={[styles.fullContainer, { paddingTop: insets.top }]}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => setShowFullPage(false)}
              style={styles.backButton}
              accessibilityLabel="Back"
            >
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.headerText}>Legal & Privacy</Text>
          </View>

          {activeItem !== null ? (
            <>
              <View style={styles.header}>
                <Pressable
                  onPress={() => setActiveItem(null)}
                  style={styles.backButton}
                  accessibilityLabel="Back"
                >
                  <Ionicons name="chevron-back" size={24} color={colors.text} />
                </Pressable>
                <Text style={styles.headerText}>{getModalHeaderTitle()}</Text>
              </View>
              {getModalContent()}
              {activeItem === 0 && (
                <View style={styles.privacyButtonContainer}>
                  <Pressable
                    style={[
                      styles.privacyButton,
                      { backgroundColor: colors.card },
                    ]}
                    onPress={() => setActiveItem(null)}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.privacyButton, styles.saveButton]}
                    onPress={() => setActiveItem(null)}
                  >
                    <Text style={[styles.buttonText, { color: "white" }]}>
                      Save Preferences
                    </Text>
                  </Pressable>
                </View>
              )}
            </>
          ) : (
            <ScrollView
              contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            >
              <View style={styles.pageSection}>
                <Text style={styles.pageSectionTitle}>Legal & Privacy</Text>
                {items.map((item, index) => (
                  <Pressable
                    key={index}
                    style={styles.pageItemContainer}
                    onPress={() => handleItemPress(index)}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={24}
                      color={colors.icon}
                    />
                    <View style={styles.pageItemTextContainer}>
                      <Text style={styles.pageItemMainText}>{item.title}</Text>
                      <Text style={styles.pageItemSubText}>
                        {item.subtitle}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color={colors.icon}
                    />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
}
