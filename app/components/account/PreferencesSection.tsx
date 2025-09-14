import React, { JSX, useEffect, useState } from "react";
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
import { itemIcons } from "./itemIcons";

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
  sectionItemText: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  sectionItemSubText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  sectionItemValue: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
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

  const items = [
    "Device preferences",
    "Travel preferences",
    "Email preferences",
  ];

  const getModalContent = () => {
    switch (showModal) {
      case "Device preferences":
        return (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Device settings</Text>
              <Pressable style={styles.sectionItem}>
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
              <Pressable style={styles.sectionItem}>
                <Text style={styles.sectionItemText}>Currency</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.sectionItemValue}>Euro (€)</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={Colors.dark.icon}
                  />
                </View>
              </Pressable>
              <Pressable style={styles.sectionItem}>
                <Text style={styles.sectionItemText}>Units</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.sectionItemValue}>Metric (km, m²)</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={Colors.dark.icon}
                  />
                </View>
              </Pressable>
              <Pressable style={styles.sectionItem}>
                <Text style={styles.sectionItemText}>Temperature</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.sectionItemValue}>Celsius</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={Colors.dark.icon}
                  />
                </View>
              </Pressable>
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
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Pressable style={styles.sectionItem}>
                <Text style={styles.sectionItemText}>
                  Booking.com Privacy Statement
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
              <Pressable style={styles.sectionItem}>
                <Text style={styles.sectionItemText}>
                  Car Rentals Privacy Statement
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
              <Pressable style={styles.sectionItem}>
                <Text style={styles.sectionItemText}>
                  Manage privacy settings
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
              <Pressable style={styles.sectionItem}>
                <Text style={styles.sectionItemText}>
                  Exercise your data rights
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
              <Pressable style={styles.sectionItem}>
                <Text style={styles.sectionItemText}>Terms and Conditions</Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
              <Pressable style={[styles.sectionItem, { borderBottomWidth: 0 }]}>
                <Text style={styles.sectionItemText}>
                  Rate us in the App Store
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
                />
              </Pressable>
            </View>
          </ScrollView>
        );
      case "Travel preferences":
        return (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                We will remember this info to make it faster when you book.
              </Text>
              <Pressable style={[styles.sectionItem, { borderBottomWidth: 0 }]}>
                <View>
                  <Text style={styles.sectionItemText}>
                    Accessibility requirements
                  </Text>
                  <Text style={styles.sectionItemSubText}>
                    Filter out properties that do not meet your needs
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.dark.icon}
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
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={styles.headerText}>{getModalHeaderTitle()}</Text>
        </View>
        {getModalContent()}
      </SafeAreaView>
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
          onPress={() => handleItemPress(title)}
        />
      ))}
      {ModalComponent}
    </AccountSection>
  );
}
