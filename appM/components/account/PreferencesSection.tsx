// path: src/components/account/PreferencesSection.tsx
import { JSX, useEffect, useState } from "react";
import {
  Animated,
  BackHandler,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
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
import { useTheme } from "../../hooks/ThemeContext";
import AccountItem from "./AccountItem";
import AccountSection from "./AccountSection";

interface Style {
  fullPage: ViewStyle;
  header: ViewStyle;
  headerText: TextStyle;
  backButton: ViewStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  sectionItem: ViewStyle;
  sectionItemText: TextStyle;
  sectionItemSubText: TextStyle;
  sectionItemValue: TextStyle;
  switchContainer: ViewStyle;
}

const createStyles = (colors: typeof Colors.light): Style => ({
  fullPage: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  sectionItemText: { fontSize: 16, color: colors.text },
  sectionItemSubText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionItemValue: { fontSize: 16, color: colors.textSecondary },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
});

export default function PreferencesSection(): JSX.Element {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [accessibilityChoice, setAccessibilityChoice] = useState<
    "all" | "accessible"
  >("all");
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [currencyChoice, setCurrencyChoice] = useState("Euro (€)");
  const [unitsChoice, setUnitsChoice] = useState("Metric (km, m²)");
  const [temperatureChoice, setTemperatureChoice] = useState("Celsius");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!showModal && !showAccessibilityModal && !showSavedModal) return;
    const handler = () => true;
    let subscription: { remove: () => void } | undefined;
    if (Platform.OS === "android") {
      subscription = BackHandler.addEventListener("hardwareBackPress", handler);
    }
    return () => {
      if (subscription) subscription.remove();
    };
  }, [showModal, showAccessibilityModal, showSavedModal]);

  const items = [
    {
      title: "Device preferences",
      icon: <Ionicons name="settings-outline" size={20} color={colors.icon} />,
    },
    {
      title: "Travel preferences",
      icon: <Ionicons name="options-outline" size={20} color={colors.icon} />,
    },
    {
      title: "Email preferences",
      icon: <Ionicons name="mail-outline" size={20} color={colors.icon} />,
    },
  ];

  const currencyOptions = ["Euro (€)", "USD ($)", "GBP (£)", "JPY (¥)"];
  const unitsOptions = ["Metric (km, m²)", "Imperial (mi, ft²)"];
  const temperatureOptions = ["Celsius", "Fahrenheit"];

  const toggleSection = (sectionName: string) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  const renderCollapsibleSection = (
    title: string,
    options: string[],
    currentChoice: string,
    onSelect: (option: string) => void,
    sectionKey: string,
  ) => {
    const isExpanded = expandedSection === sectionKey;

    return (
      <View style={styles.section}>
        {/* Header row */}
        <Pressable
          style={styles.sectionItem}
          onPress={() => toggleSection(sectionKey)}
        >
          <Text style={styles.sectionItemText}>{title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.sectionItemValue}>{currentChoice}</Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.icon}
              style={{ marginLeft: 8 }}
            />
          </View>
        </Pressable>

        {/* Expandable options */}
        {isExpanded && (
          <Animated.View>
            {options.map((option, index) => (
              <Pressable
                key={option}
                style={[
                  styles.sectionItem,
                  {
                    paddingLeft: 32,
                    borderBottomWidth: index === options.length - 1 ? 0 : 1,
                  },
                ]}
                onPress={() => {
                  onSelect(option);
                  setExpandedSection(null);
                }}
              >
                <Text style={styles.sectionItemText}>{option}</Text>
                {option === currentChoice && (
                  <Ionicons name="checkmark" size={20} color={colors.blue} />
                )}
              </Pressable>
            ))}
          </Animated.View>
        )}
      </View>
    );
  };

  const getModalContent = () => {
    switch (showModal) {
      case "Device preferences":
        return (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Device settings</Text>

              {/* Language */}
              <Pressable
                style={styles.sectionItem}
                onPress={() => Linking.openSettings()}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionItemText}>Language</Text>
                  <Text style={styles.sectionItemSubText}>
                    This will take you to your system settings
                  </Text>
                  <Text style={[styles.sectionItemValue, { marginTop: 8 }]}>
                    English (United States)
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={colors.icon}
                />
              </Pressable>

              {/* Currency */}
              {renderCollapsibleSection(
                "Currency",
                currencyOptions,
                currencyChoice,
                setCurrencyChoice,
                "currency",
              )}

              {/* Units */}
              {renderCollapsibleSection(
                "Units",
                unitsOptions,
                unitsChoice,
                setUnitsChoice,
                "units",
              )}

              {/* Temperature */}
              {renderCollapsibleSection(
                "Temperature",
                temperatureOptions,
                temperatureChoice,
                setTemperatureChoice,
                "temperature",
              )}

              {/* Notifications */}
              <View style={styles.switchContainer}>
                <Text style={styles.sectionItemText}>Notifications</Text>
                <Switch
                  trackColor={{ false: colors.gray, true: colors.green }}
                  thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
                  onValueChange={() =>
                    setNotificationsEnabled(!notificationsEnabled)
                  }
                  value={notificationsEnabled}
                />
              </View>
            </View>

            {/* About */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              {[
                "Booking.com Privacy Statement",
                "Car Rentals Privacy Statement",
                "Manage privacy settings",
                "Exercise your data rights",
                "Terms and Conditions",
                "Rate us in the App Store",
              ].map((text) => (
                <Pressable
                  key={text}
                  style={[
                    styles.sectionItem,
                    text === "Rate us in the App Store"
                      ? { borderBottomWidth: 0 }
                      : {},
                  ]}
                  onPress={() =>
                    Linking.openURL(
                      "https://www.booking.com/content/about.html",
                    )
                  }
                >
                  <Text style={styles.sectionItemText}>{text}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={colors.icon}
                  />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        );

      case "Travel preferences":
        return (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { borderBottomWidth: 0, paddingBottom: 8 },
                ]}
              >
                We will remember this info to make it faster when you book.
              </Text>

              <Pressable
                style={styles.sectionItem}
                onPress={() => {
                  setShowModal(null);
                  setShowAccessibilityModal(true);
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionItemText}>
                    Accessibility requirements
                  </Text>
                  <Text style={styles.sectionItemSubText}>
                    {accessibilityChoice === "all"
                      ? "Show all properties"
                      : "Only show accessible properties"}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={colors.icon}
                />
              </Pressable>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  const getModalHeaderTitle = () => {
    switch (showModal) {
      case "Device preferences":
        return "Settings";
      case "Travel preferences":
        return "Preferences";
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
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerText}>{getModalHeaderTitle()}</Text>
        </View>
        {getModalContent()}
      </SafeAreaView>
    </Modal>
  );

  const AccessibilityModal = (
    <Modal
      visible={showAccessibilityModal}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={() => setShowAccessibilityModal(false)}
    >
      <SafeAreaView style={[styles.fullPage, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setShowAccessibilityModal(false)}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerText}>Preferences</Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { borderBottomWidth: 0, paddingBottom: 8 },
              ]}
            >
              We&apos;ll remember this info to make it faster when you book.
            </Text>

            <View
              style={[
                styles.sectionItem,
                { borderBottomWidth: 0, paddingBottom: 24 },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionItemText}>
                  Accessibility requirements
                </Text>
                <Text style={styles.sectionItemSubText}>
                  {accessibilityChoice === "all"
                    ? "Show all properties"
                    : "Only show accessible properties"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom sheet style accessibility selector */}
        <View
          style={{
            backgroundColor: colors.card,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: insets.bottom + 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.text,
              marginBottom: 20,
            }}
          >
            Accessibility requirements
          </Text>

          {[
            { key: "all", label: "Show all properties" },
            { key: "accessible", label: "Only show accessible properties" },
          ].map((option) => (
            <Pressable
              key={option.key}
              style={{
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() =>
                setAccessibilityChoice(option.key as "all" | "accessible")
              }
            >
              <Ionicons
                name={
                  accessibilityChoice === option.key
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={24}
                color={
                  accessibilityChoice === option.key ? colors.blue : colors.icon
                }
              />
              <Text
                style={{ color: colors.text, marginLeft: 12, fontSize: 16 }}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}

          <Pressable
            style={{
              marginTop: 20,
              backgroundColor: colors.blue,
              borderRadius: 8,
              paddingVertical: 16,
              alignItems: "center",
            }}
            onPress={() => {
              setShowAccessibilityModal(false);
              setShowSavedModal(true);
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Save
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const SavedModal = (
    <Modal
      visible={showSavedModal}
      animationType="fade"
      transparent
      presentationStyle="overFullScreen"
      onRequestClose={() => setShowSavedModal(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 32,
            alignItems: "center",
            maxWidth: 280,
            margin: 20,
          }}
        >
          <Ionicons
            name="checkmark-circle"
            size={60}
            color={colors.blue}
            style={{ marginBottom: 16 }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.text,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Preferences saved
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.textSecondary,
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Your accessibility preferences have been updated
          </Text>
          <Pressable
            style={{
              backgroundColor: colors.blue,
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 24,
              alignItems: "center",
            }}
            onPress={() => {
              setShowSavedModal(false);
              setShowModal(null);
              setShowAccessibilityModal(false);
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              OK
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  const handleItemPress = (title: string) => {
    if (title === "Email preferences") {
      Linking.openURL(
        "https://secure.booking.com/help?aid=304142&label=gen173nr-10CBkoggI46AdIM1gEaGqIAQKYATO4AQfIAQ3YAQPoAQH4AQGIAgGoAgG4AtzCh8YGwAIB0gIkMjM2MGUzZTctMzExYi00ZmEwLWFjN2EtNjBiYTU4NTVkZTBi2AIB4AIB&sid=6ce8463b67476a2753ebd1ee73b99944&source=profile_menu&src=profile_contact_cs",
      );
    } else {
      setShowModal(title);
    }
  };

  return (
    <AccountSection title="Preferences">
      {items.map((item) => (
        <AccountItem
          key={item.title}
          icon={item.icon}
          title={item.title}
          onPress={() => handleItemPress(item.title)}
        />
      ))}
      {ModalComponent}
      {AccessibilityModal}
      {SavedModal}
    </AccountSection>
  );
}
