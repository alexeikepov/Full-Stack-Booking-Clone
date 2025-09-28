import { JSX, useEffect, useState } from "react";
import {
  BackHandler,
  LayoutAnimation,
  Linking,
  Modal,
  Platform,
  Pressable,
  Platform as RNPlatform,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  UIManager,
  View,
  ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../hooks/ThemeContext";
import AccountItem from "./AccountItem";
import AccountSection from "./AccountSection";
interface Style {
  fullPage: ViewStyle;
  header: ViewStyle;
  headerText: TextStyle;
  backButton: ViewStyle;
  modalHeader: ViewStyle;
  modalHeaderText: TextStyle;
  closeButton: ViewStyle;
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
  faqAnswer: TextStyle;
}
export interface HelpSupportSectionProps {
  onBack?: () => void;
}
if (
  RNPlatform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const createStyles = (colors: Record<string, string>, theme: string) =>
  StyleSheet.create<Style>({
    fullPage: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
    },
    backButton: { paddingRight: 10 },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
    },
    modalHeaderText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    closeButton: { paddingRight: 10 },
    headerText: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    infoContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      marginHorizontal: 16,
      marginTop: 20,
      padding: 16,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary || colors.icon,
      flex: 1,
      lineHeight: 20,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginHorizontal: 16,
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    sectionItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator || colors.border || "#E5E5E5",
    },
    sectionItemText: { fontSize: 16, color: colors.text },
    sectionItemSubText: {
      fontSize: 14,
      color: colors.textSecondary || colors.icon,
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
    faqTabText: { color: colors.textSecondary || colors.icon, fontSize: 14 },
    faqItem: {
      flexDirection: "column",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator || colors.border || "#E5E5E5",
    },
    faqItemText: { fontSize: 16, color: colors.text },
    faqAnswer: {
      fontSize: 14,
      color: colors.textSecondary || colors.icon,
      marginTop: 8,
    },
  });
export default function HelpSupport({
  onBack,
}: HelpSupportSectionProps): JSX.Element {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Stays");
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(
    null,
  );
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
  const faqData: { [key: string]: { question: string; answer: string }[] } = {
    Stays: [
      {
        question: "Cancellations",
        answer: "You can cancel anytime before check-in.",
      },
      { question: "Payment", answer: "Payments are secured and encrypted." },
      {
        question: "Booking Details",
        answer: "You can view your bookings in the app.",
      },
      {
        question: "Communications",
        answer: "Communicate with hosts through the app.",
      },
      { question: "Room Types", answer: "Different room types available." },
      {
        question: "Pricing",
        answer: "Prices depend on season and availability.",
      },
    ],
    Flights: [
      {
        question: "Baggage and seats",
        answer: "Check baggage policies before travel.",
      },
      {
        question: "Boarding pass and check-in",
        answer: "You can check in online.",
      },
      {
        question: "Booking a flight",
        answer: "Flights can be booked on the website.",
      },
      {
        question: "Changes and cancellation",
        answer: "Changes depend on airline policy.",
      },
      {
        question: "Flight confirmation",
        answer: "Confirmation sent to your email.",
      },
      {
        question: "My flight booking",
        answer: "Manage your bookings in the app.",
      },
    ],
    "Car rentals": [
      {
        question: "Most popular",
        answer: "Check our most popular car rentals.",
      },
      {
        question: "Driver requirements and responsibilities",
        answer: "Drivers must meet age requirements.",
      },
      {
        question: "Fuel, mileage, and travel plans",
        answer: "Fuel policies vary by rental company.",
      },
      {
        question: "Insurance and protection",
        answer: "Insurance options are available.",
      },
      { question: "Extras", answer: "Additional options can be selected." },
      {
        question: "Payment, fees, and confirmation",
        answer: "Payments are processed securely.",
      },
    ],
    Attractions: [
      {
        question: "Cancellations",
        answer: "Cancellations allowed as per policy.",
      },
      { question: "Payment", answer: "Payment is required at booking." },
      {
        question: "Modifications and changes",
        answer: "Changes may be allowed with fees.",
      },
      {
        question: "Booking details and information",
        answer: "Booking info is in your account.",
      },
      {
        question: "Pricing",
        answer: "Pricing depends on attraction and date.",
      },
      {
        question: "Tickets and check-in",
        answer: "Tickets are digital in most cases.",
      },
    ],
    "Airport taxis": [
      {
        question: "Manage booking",
        answer: "Bookings can be managed in your profile.",
      },
      { question: "Journey", answer: "Track your taxi journey in the app." },
      { question: "Payment info", answer: "Payment info is secured." },
      {
        question: "Accessibility and extras",
        answer: "Accessible options available.",
      },
      { question: "Pricing", answer: "Prices depend on distance and type." },
    ],
    Insurance: [
      {
        question:
          "Room Cancellation Insurance - Claims (excludes U.S. residents)",
        answer: "Claims are processed according to policy.",
      },
      {
        question:
          "Room Cancellation Insurance - Coverage (excludes U.S. residents)",
        answer: "Coverage details are listed in the policy.",
      },
      {
        question:
          "Room Cancellation Insurance - Policy terms (excludes U.S. residents)",
        answer: "Terms must be read carefully.",
      },
      {
        question:
          "Room Cancellation Insurance - General (excludes U.S. residents)",
        answer: "General info available in policy documents.",
      },
    ],
    Other: [
      {
        question: "How can I contact Booking.com?",
        answer: "You can contact through the Help Center.",
      },
      {
        question:
          "Can I get support in my language for accommodation bookings in the EEA?",
        answer: "Yes, multiple languages are supported.",
      },
      {
        question:
          "Can I get customer support in my language for flight bookings in the European Economic Area?",
        answer: "Yes, support is available in several languages.",
      },
      {
        question:
          "Can I get customer support in my language for car rental bookings in the European Economic Area?",
        answer: "Yes, support is available in your language.",
      },
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
                  color="#FFD700"
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
                    color: colors.textSecondary || colors.icon,
                    marginTop: -10,
                    marginBottom: 10,
                  }}
                >
                  We are available 24 hours a day
                </Text>
                <Pressable
                  style={styles.blueButton}
                  onPress={() =>
                    Linking.openURL(
                      "https://www.booking.com/customer-service.html",
                    )
                  }
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
                  paddingHorizontal: 16,
                  paddingVertical: 20,
                  alignItems: "center",
                }}
                style={{ marginTop: 0 }}
              >
                {Object.keys(faqData).map((tab, index) => (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={[
                      styles.faqTab,
                      {
                        borderBottomWidth: activeTab === tab ? 2 : 0,
                        borderBottomColor:
                          activeTab === tab ? "#007AFF" : "transparent",
                        marginRight:
                          index < Object.keys(faqData).length - 1 ? 20 : 0,
                        paddingHorizontal: 12,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.faqTabText,
                        {
                          color:
                            activeTab === tab
                              ? colors.text
                              : colors.textSecondary || colors.icon,
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
                  backgroundColor: colors.card,
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
                    onPress={() => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut,
                      );
                      setOpenQuestionIndex(
                        openQuestionIndex === index ? null : index,
                      );
                    }}
                  >
                    <Text style={styles.faqItemText}>{item.question}</Text>
                    {openQuestionIndex === index && (
                      <Text style={styles.faqAnswer}>{item.answer}</Text>
                    )}
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
            <Text style={{ color: colors.text }}>
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
              onBack?.();
            }}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme === "light" ? colors.background : colors.text}
            />
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

  // Create dynamic items with theme-aware colors
  const dynamicItems = [
    {
      title: "Contact Customer Service",
      icon: (
        <Ionicons name="help-circle-outline" size={20} color={colors.icon} />
      ),
    },
    {
      title: "Dispute resolution",
      icon: <Ionicons name="help-buoy-outline" size={20} color={colors.icon} />,
    },
    {
      title: "Safety resource center",
      icon: <Ionicons name="help-buoy-outline" size={20} color={colors.icon} />,
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <AccountSection title="Help center">
        {dynamicItems.map((item) => (
          <AccountItem
            key={item.title}
            icon={item.icon}
            title={item.title}
            onPress={() => handleItemPress(item.title)}
          />
        ))}
      </AccountSection>
      {ModalComponent}
    </View>
  );
}
