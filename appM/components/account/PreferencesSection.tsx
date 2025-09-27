// path: src/components/account/PreferencesSection.tsx
import { JSX, useEffect, useState } from "react";
import {
  BackHandler,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
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
  section: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.separator,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.separator,
  },
  sectionItemText: { fontSize: 16, color: Colors.dark.text },
  sectionItemSubText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  sectionItemValue: { fontSize: 16, color: Colors.dark.textSecondary },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.separator,
  },
});

export default function PreferencesSection(): JSX.Element {
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

  useEffect(() => {
    if (showModal === "Travel preferences") setShowAccessibilityModal(true);
  }, [showModal]);

  const items = [
    {
      title: "Device preferences",
      icon: (
        <Ionicons name="settings-outline" size={20} color={Colors.dark.icon} />
      ),
    },
    {
      title: "Travel preferences",
      icon: (
        <Ionicons name="options-outline" size={20} color={Colors.dark.icon} />
      ),
    },
    {
      title: "Email preferences",
      icon: <Ionicons name="mail-outline" size={20} color={Colors.dark.icon} />,
    },
  ];

  const currencyOptions = ["Euro (€)", "USD ($)", "GBP (£)", "JPY (¥)"];
  const unitsOptions = ["Metric (km, m²)", "Imperial (mi, ft²)"];
  const temperatureOptions = ["Celsius", "Fahrenheit"];

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
                <View>
                  <Text style={styles.sectionItemText}>Language</Text>
                  <Text style={styles.sectionItemSubText}>
                    This will take you to your system settings
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.sectionItemValue}>
                    English (United States)
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={Colors.dark.icon}
                  />
                </View>
              </Pressable>

              {/* Currency */}
              <View style={styles.section}>
                {currencyOptions.map((option) => (
                  <Pressable
                    key={option}
                    style={styles.sectionItem}
                    onPress={() => setCurrencyChoice(option)}
                  >
                    <Text style={styles.sectionItemText}>Currency</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.sectionItemValue}>
                        {option === currencyChoice ? `✔ ${option}` : option}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* Units */}
              <View style={styles.section}>
                {unitsOptions.map((option) => (
                  <Pressable
                    key={option}
                    style={styles.sectionItem}
                    onPress={() => setUnitsChoice(option)}
                  >
                    <Text style={styles.sectionItemText}>Units</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.sectionItemValue}>
                        {option === unitsChoice ? `✔ ${option}` : option}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* Temperature */}
              <View style={styles.section}>
                {temperatureOptions.map((option) => (
                  <Pressable
                    key={option}
                    style={styles.sectionItem}
                    onPress={() => setTemperatureChoice(option)}
                  >
                    <Text style={styles.sectionItemText}>Temperature</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.sectionItemValue}>
                        {option === temperatureChoice ? `✔ ${option}` : option}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* Notifications */}
              <View style={styles.switchContainer}>
                <Text style={styles.sectionItemText}>Notifications</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#34C759" }}
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
                    color={Colors.dark.icon}
                  />
                </Pressable>
              ))}
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
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
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
      transparent
      presentationStyle="overFullScreen"
      onRequestClose={() => setShowAccessibilityModal(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: Colors.dark.card,
            padding: 20,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: Colors.dark.text,
              marginBottom: 20,
            }}
          >
            Select accessibility preference
          </Text>
          {["all", "accessible"].map((option) => (
            <Pressable
              key={option}
              style={{
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() =>
                setAccessibilityChoice(option as "all" | "accessible")
              }
            >
              <Ionicons
                name={
                  accessibilityChoice === option
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={24}
                color={Colors.dark.icon}
              />
              <Text style={{ color: Colors.dark.text, marginLeft: 12 }}>
                {option === "all"
                  ? "Show all properties"
                  : "Only show accessible properties"}
              </Text>
            </Pressable>
          ))}
          <Pressable
            style={{
              marginTop: 20,
              backgroundColor: "#007AFF",
              borderRadius: 8,
              paddingVertical: 16,
              alignItems: "center",
            }}
            onPress={() => {
              setShowAccessibilityModal(false);
              setShowSavedModal(true);
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Save</Text>
          </Pressable>
        </View>
      </View>
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
            backgroundColor: Colors.dark.card,
            padding: 30,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: Colors.dark.text,
            }}
          >
            Saved
          </Text>
          <Pressable
            style={{
              marginTop: 20,
              backgroundColor: "#007AFF",
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 30,
            }}
            onPress={() => {
              setShowSavedModal(false);
              setShowModal("Travel preferences");
            }}
          >
            <Text style={{ color: "white" }}>OK</Text>
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
