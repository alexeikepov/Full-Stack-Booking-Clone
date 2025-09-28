import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import DiscoverSection from "../components/account/DiscoverSection";
import GeniusRewardsBanner from "../components/account/GeniusRewardsBanner";
import HelpSupportSection from "../components/account/HelpSupportSection";
import LegalPrivacySection from "../components/account/LegalPrivacySection";
import ManageAccountSection from "../components/account/ManageAccountSection";
import ManagePropertySection from "../components/account/ManagePropertySection";
import NoCreditsVouchersBanner from "../components/account/NoCreditsVouchersBanner";
import PaymentInfoSection from "../components/account/PaymentInfoSection";
import PreferencesSection from "../components/account/PreferencesSection";
import ProfileHeader from "../components/account/ProfileHeader";
import SignOutButton from "../components/account/SignOutButton";
import TravelActivitySection from "../components/account/TravelActivitySection";
import { useTheme } from "../hooks/ThemeContext";
export default function AccountScreen() {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [isDirectHelpCenterOpen, setIsDirectHelpCenterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Stays");
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(
    null,
  );
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);
  const openMessages = () => setShowMessagesModal(true);
  const closeMessages = () => setShowMessagesModal(false);
  const openNotifications = () => setShowNotificationsModal(true);
  const closeNotifications = () => setShowNotificationsModal(false);
  const closeHelpCenter = () => {
    setIsHelpCenterOpen(false);
    openMessages();
  };
  const openDirectHelpCenter = () => {
    setIsDirectHelpCenterOpen(true);
    closeMessages();
  };
  const closeDirectHelpCenter = () => {
    setIsDirectHelpCenterOpen(false);
  };

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
  const goToSearch = () => {
    closeMessages();
    navigation.navigate("Search" as never);
  };
  const AccountScreen = () => {
    return (
      <View style={styles.container}>
        <ProfileHeader
          userName="Guest"
          geniusLevel="Level 1"
          onMessagesPress={openMessages}
          onNotificationsPress={openNotifications}
        />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 16 }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={theme === "light" ? { backgroundColor: colors.blue } : {}}
          >
            <GeniusRewardsBanner />
            <NoCreditsVouchersBanner />
          </View>
          <PaymentInfoSection />
          <ManageAccountSection />
          <PreferencesSection />
          <TravelActivitySection />
          <HelpSupportSection />
          <LegalPrivacySection />
          <DiscoverSection />
          <ManagePropertySection />
          <SignOutButton />
        </ScrollView>
      </View>
    );
  };
  const MessagesModal = (
    <Modal
      visible={showMessagesModal}
      animationType="slide"
      transparent={false}
      onRequestClose={closeMessages}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={closeMessages} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.modalHeaderText}>Messages</Text>
          <TouchableOpacity onPress={openDirectHelpCenter}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <Image
            source={
              theme === "light"
                ? require("./../assets/images/man-white.jpg")
                : require("./../assets/images/messages-man.png")
            }
            style={styles.messageImage}
          />
          <Text style={styles.modalTitle}>No messages</Text>
          <Text style={styles.modalSubtitle}>
            You can start exchanging messages when you have upcoming bookings.
          </Text>
        </View>
        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.searchButton} onPress={goToSearch}>
            <Text style={styles.buttonText}>Book now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
  const NotificationsModal = (
    <Modal
      visible={showNotificationsModal}
      animationType="slide"
      transparent={false}
      onRequestClose={closeNotifications}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={closeNotifications}
            style={styles.closeButton}
          >
            <Text style={styles.modalHeaderText}>Close</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <Ionicons
            name="notifications-outline"
            size={80}
            color={colors.text}
          />
          <Text style={styles.modalTitle}>
            You do not have any notifications.
          </Text>
          <Text style={styles.modalSubtitle}>
            Notifications let you quickly take action on upcoming or current
            bookings.
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
  const HelpCenterModal = (
    <Modal
      visible={isHelpCenterOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={closeHelpCenter}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={closeHelpCenter}
            style={styles.closeButton}
          >
            <Ionicons
              name="close"
              size={24}
              color={theme === "light" ? "white" : colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.modalHeaderText}>Help Center</Text>
          <View style={{ width: 32 }} />
        </View>
        <HelpSupportSection onBack={closeHelpCenter} />
      </SafeAreaView>
    </Modal>
  );

  const DirectHelpCenterModal = (
    <Modal
      visible={isDirectHelpCenterOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={closeDirectHelpCenter}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={closeDirectHelpCenter}
            style={styles.closeButton}
          >
            <Ionicons
              name="close"
              size={24}
              color={theme === "light" ? "white" : colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.modalHeaderText}>Help Center</Text>
          <View style={{ width: 32 }} />
        </View>
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
                card information.{" "}
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
                  color: colors.textSecondary,
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
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                marginTop: 20,
              }}
            >
              {Object.keys(faqData).map((tab) => (
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
                            ? colors.text
                            : colors.textSecondary,
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
                      borderBottomColor: colors.card,
                    },
                  ]}
                  onPress={() => {
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
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={{ flex: 1 }}>
      <AccountScreen />
      {showMessagesModal && MessagesModal}
      {showNotificationsModal && NotificationsModal}
      {isHelpCenterOpen && HelpCenterModal}
      {isDirectHelpCenterOpen && DirectHelpCenterModal}
    </View>
  );
}
const createStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  theme: string,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      backgroundColor: theme === "light" ? colors.blue : colors.background,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
    },
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerIconSpacing: {
      marginLeft: 16,
    },
    searchModuleContainer: {
      backgroundColor: colors.card,
      margin: 16,
      borderRadius: 16,
      padding: 16,
    },
    searchButton: {
      backgroundColor: colors.button,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: {
      color: colors.text,
      fontWeight: "bold",
    },
    toggleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    toggleText: {
      color: colors.text,
    },
    radioGroup: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 8,
      alignItems: "center",
    },
    radioButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      marginRight: 12,
    },
    radioText: {
      color: colors.text,
      marginLeft: 6,
    },
    section: {
      marginTop: 16,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    largeCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: "hidden",
    },
    largeCardImage: {
      width: "100%",
      height: 150,
      resizeMode: "cover",
    },
    largeCardTextContainer: {
      padding: 16,
    },
    largeCardTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    largeCardSubtitle: {
      color: colors.textSecondary,
      marginTop: 4,
    },
    largeCardButton: {
      backgroundColor: colors.button,
      padding: 10,
      borderRadius: 8,
      marginTop: 12,
      alignSelf: "flex-start",
    },
    largeCardButtonText: {
      color: colors.text,
      fontWeight: "bold",
    },
    twoColumnCardsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
    },
    smallCard: {
      width: "48%",
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
    },
    smallCardImage: {
      width: "100%",
      height: 80,
      resizeMode: "cover",
    },
    smallCardTitle: {
      color: colors.text,
      fontWeight: "bold",
      padding: 8,
    },
    offerCard: {
      width: 150,
      marginRight: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
    },
    offerImage: {
      width: "100%",
      height: 80,
      resizeMode: "cover",
    },
    offerText: {
      color: colors.text,
      padding: 8,
    },
    dealsCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
      flexDirection: "row",
      alignItems: "center",
    },
    dealsImage: {
      width: 100,
      height: 100,
      resizeMode: "cover",
    },
    dealsContent: {
      padding: 12,
    },
    dealsTitle: {
      color: colors.text,
      fontWeight: "bold",
      fontSize: 16,
    },
    dealsSubtitle: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    exploreItem: {
      alignItems: "center",
      marginRight: 16,
    },
    exploreImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
    },
    exploreTitle: {
      color: colors.text,
      marginTop: 4,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
      backgroundColor: theme === "light" ? colors.blue : colors.card,
    },
    modalHeaderText: {
      color: theme === "light" ? "white" : colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    closeButton: {
      padding: 4,
    },
    modalContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
    },
    modalTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 16,
    },
    modalSubtitle: {
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
    },
    modalFooter: {
      padding: 16,
    },
    messageImage: {
      width: 250,
      height: 250,
      resizeMode: "contain",
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
      color: colors.textSecondary,
      flex: 1,
      lineHeight: 20,
    },
    blueButton: {
      backgroundColor: "#007AFF",
      borderRadius: 8,
      paddingVertical: 16,
      alignItems: "center",
      marginHorizontal: 16,
      marginTop: 20,
    },
    blueButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    faqTab: {
      alignItems: "center",
      paddingHorizontal: 10,
      paddingBottom: 5,
    },
    faqTabText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    faqItem: {
      flexDirection: "column",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
    },
    faqItemText: {
      fontSize: 16,
      color: colors.text,
    },
    faqAnswer: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
    },
  });
