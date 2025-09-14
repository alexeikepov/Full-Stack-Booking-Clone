import { JSX, useEffect, useState } from "react";
import {
  BackHandler,
  Linking,
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
import AccountItem from "./AccountItem";
import AccountSection from "./AccountSection";
import { itemIcons } from "./itemIcons";

interface Style {
  fullPage: ViewStyle;
  header: ViewStyle;
  headerText: TextStyle;
  backButton: ViewStyle;
  infoContainer: ViewStyle;
  infoText: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  sectionItem: ViewStyle;
  sectionItemText: TextStyle;
  sectionItemSubText: TextStyle;
  blueButton: ViewStyle;
  blueButtonText: TextStyle;
  faqTabs: ViewStyle;
  faqTab: ViewStyle;
  faqTabText: TextStyle;
  faqItem: ViewStyle;
  faqItemText: TextStyle;
}

const items = [
  "Contact Customer Service",
  "Dispute resolution",
  "Safety resource center",
];

export interface HelpSupportSectionProps {
  onBack?: () => void;
}

const styles = StyleSheet.create<Style>({
  fullPage: { flex: 1, backgroundColor: Colors.dark.background }, // dark background
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.dark.card,
  },
  backButton: { paddingRight: 10 },
  headerText: { fontSize: 20, fontWeight: "bold", color: Colors.dark.text },
  infoContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  section: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.text,
    paddingHorizontal: 16,
    paddingVertical: 20,
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
  blueButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 20,
  },
  blueButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  faqTabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  faqTab: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  faqTabText: { color: Colors.dark.textSecondary, fontSize: 14 },
  faqItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.separator,
  },
  faqItemText: { fontSize: 16, color: Colors.dark.text },
});

export default function HelpSupport({
  onBack,
}: HelpSupportSectionProps): JSX.Element {
  const [showModal, setShowModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Stays");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!showModal) return;
    const handler = () => true;
    let subscription: { remove: () => void } | undefined;
    if (Platform.OS === "android")
      subscription = BackHandler.addEventListener("hardwareBackPress", handler);
    return () => {
      if (subscription) subscription.remove();
    };
  }, [showModal]);

  const faqData: { [key: string]: string[] } = {
    Stays: [
      "Cancellations",
      "Payment",
      "Booking Details",
      "Communications",
      "Room Types",
      "Pricing",
    ],
    Flights: [
      "Baggage and seats",
      "Boarding pass and check-in",
      "Booking a flight",
      "Changes and cancellation",
      "Flight confirmation",
      "My flight booking",
    ],
    "Car rentals": [
      "Most popular",
      "Driver requirements and responsibilities",
      "Fuel, mileage, and travel plans",
      "Insurance and protection",
      "Extras",
      "Payment, fees, and confirmation",
    ],
    Attractions: [
      "Cancellations",
      "Payment",
      "Modifications and changes",
      "Booking details and information",
      "Pricing",
      "Tickets and check-in",
    ],
    "Airport taxis": [
      "Manage booking",
      "Journey",
      "Payment info",
      "Accessibility and extras",
      "Pricing",
    ],
    Insurance: [
      "Room Cancellation Insurance - Claims (excludes U.S. residents)",
      "Room Cancellation Insurance - Coverage (excludes U.S. residents)",
      "Room Cancellation Insurance - Policy terms (excludes U.S. residents)",
      "Room Cancellation Insurance - General (excludes U.S. residents)",
    ],
    Other: [
      "How can I contact Booking.com?",
      "Can I get support in my language for accommodation bookings in the EEA?",
      "Can I get customer support in my language for flight bookings in the European Economic Area?",
      "Can I get customer support in my language for car rental bookings in the European Economic Area?",
    ],
  };

  const getModalContent = () => {
    switch (showModal) {
      case "Contact Customer Service":
        return (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: insets.bottom + 20,
            }}
          >
            <View style={{ paddingTop: 16 }}>
              <View style={styles.infoContainer}>
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color={Colors.dark.yellow}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.infoText}>
                  Protect your security by never sharing your personal or credit
                  card information.
                  <Text
                    style={{
                      color: "#007AFF",
                      textDecorationLine: "underline",
                    }}
                    onPress={() => Linking.openURL("https://www.booking.com")}
                  >
                    {" "}
                    Learn more
                  </Text>
                </Text>
              </View>

              <View style={{ marginHorizontal: 16, marginTop: 20 }}>
                <Text style={styles.sectionTitle}>
                  Welcome to the Help Center
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.dark.textSecondary,
                    marginTop: -10,
                    marginBottom: 10,
                  }}
                >
                  We are available 24 hours a day
                </Text>
                <Pressable
                  style={styles.blueButton}
                  onPress={() => setShowModal(null)}
                >
                  <Text style={styles.blueButtonText}>
                    Get help with a booking
                  </Text>
                </Pressable>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 0 }]}>
                Frequently asked questions
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  marginTop: 20,
                }}
              >
                {[
                  "Stays",
                  "Flights",
                  "Car rentals",
                  "Attractions",
                  "Airport taxis",
                  "Insurance",
                  "Other",
                ].map((tab) => (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={[
                      styles.faqTab,
                      {
                        borderBottomWidth: activeTab === tab ? 2 : 0,
                        borderBottomColor:
                          activeTab === tab ? "#007AFF" : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.faqTabText,
                        {
                          color:
                            activeTab === tab
                              ? Colors.dark.text
                              : Colors.dark.textSecondary,
                        },
                      ]}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View
                style={{
                  backgroundColor: Colors.dark.card,
                  borderRadius: 12,
                  marginHorizontal: 16,
                  marginTop: 10,
                }}
              >
                {faqData[activeTab]?.map((item, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.faqItem,
                      {
                        borderBottomWidth:
                          index === faqData[activeTab].length - 1 ? 0 : 1,
                      },
                    ]}
                  >
                    <Text style={styles.faqItemText}>{item}</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color={Colors.dark.icon}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        );

      case "Dispute resolution":
        return (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: insets.bottom + 20,
            }}
          >
            <Text style={{ color: Colors.dark.text }}>
              Dispute resolution content goes here.
            </Text>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  const getModalHeaderTitle = () => {
    switch (showModal) {
      case "Contact Customer Service":
        return "Help Center";
      case "Dispute resolution":
        return "Dispute Resolution";
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
            onPress={() => {
              setShowModal(null);
              onBack?.(); // call onBack prop if it exists
            }}
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
    if (title === "Safety resource center")
      Linking.openURL(
        "https://www.booking.com/trust-and-safety/travellers.en-us.html?utm_source=hamb_menu&utm_medium=iOS_app",
      );
    else setShowModal(title);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      {/* dark background for initial screen */}
      <AccountSection title="Help and support">
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
      </AccountSection>
      {ModalComponent}
    </View>
  );
}
