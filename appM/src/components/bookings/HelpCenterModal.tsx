import React from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

interface HelpCenterModalProps {
  visible: boolean;
  onClose: () => void;
  helpFaqTab: string;
  setHelpFaqTab: (tab: string) => void;
  openQuestionIndex: number | null;
  setOpenQuestionIndex: (index: number | null) => void;
  colors: any;
}

const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  visible,
  onClose,
  helpFaqTab,
  setHelpFaqTab,
  openQuestionIndex,
  setOpenQuestionIndex,
  colors,
}) => {
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <SafeAreaView
        style={[{ flex: 1, backgroundColor: colors.background }]}
        edges={["bottom"]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 16,
            paddingTop: 60,
            backgroundColor: colors.card,
          }}
        >
          <Pressable
            onPress={onClose}
            style={{ paddingRight: 10 }}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.text,
              flex: 1,
              textAlign: "center",
            }}
          >
            Help Center
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
        >
          <View style={{ paddingTop: 16 }}>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 8,
                marginHorizontal: 16,
                marginTop: 20,
                padding: 16,
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Ionicons
                name="warning-outline"
                size={24}
                color="#FFD700"
                style={{ marginRight: 10 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary || colors.icon,
                  flex: 1,
                  lineHeight: 20,
                }}
              >
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
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: colors.text,
                  paddingHorizontal: 16,
                  paddingVertical: 20,
                }}
              >
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
                style={{
                  backgroundColor: "#007AFF",
                  borderRadius: 8,
                  paddingVertical: 16,
                  alignItems: "center",
                  marginHorizontal: 16,
                  marginTop: 20,
                }}
                onPress={() =>
                  Linking.openURL(
                    "https://www.booking.com/customer-service.html",
                  )
                }
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Get help with a booking
                </Text>
              </Pressable>
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.text,
                paddingHorizontal: 16,
                paddingVertical: 20,
                marginTop: 0,
              }}
            >
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
                  onPress={() => setHelpFaqTab(tab)}
                  style={{
                    alignItems: "center",
                    paddingHorizontal: 12,
                    paddingBottom: 5,
                    marginRight:
                      index < Object.keys(faqData).length - 1 ? 20 : 0,
                  }}
                >
                  <Text
                    style={{
                      color:
                        helpFaqTab === tab
                          ? colors.text
                          : colors.textSecondary || colors.icon,
                      fontSize: 14,
                    }}
                  >
                    {tab}
                  </Text>
                  <View
                    style={{
                      height: 2,
                      backgroundColor:
                        helpFaqTab === tab ? "#007AFF" : "transparent",
                      width: "100%",
                      marginTop: 5,
                    }}
                  />
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
              {faqData[helpFaqTab]?.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    flexDirection: "column",
                    padding: 16,
                    borderBottomWidth:
                      index === faqData[helpFaqTab].length - 1 ? 0 : 1,
                  }}
                  onPress={() => {
                    setOpenQuestionIndex(
                      openQuestionIndex === index ? null : index,
                    );
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.text,
                    }}
                  >
                    {item.question}
                  </Text>
                  {openQuestionIndex === index && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary || colors.icon,
                        marginTop: 8,
                      }}
                    >
                      {item.answer}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default HelpCenterModal;
