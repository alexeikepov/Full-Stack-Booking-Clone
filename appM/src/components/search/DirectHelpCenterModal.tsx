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

type FAQItem = { question: string; answer: string };

type DirectHelpCenterModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  colors: any;
  insets: any;
  activeHelpTab: string;
  setActiveHelpTab: (tab: string) => void;
  openHelpQuestionIndex: number | null;
  setOpenHelpQuestionIndex: (idx: number | null) => void;
  faqData: { [key: string]: FAQItem[] };
};

const DirectHelpCenterModal: React.FC<DirectHelpCenterModalProps> = ({
  visible,
  onRequestClose,
  colors,
  insets,
  activeHelpTab,
  setActiveHelpTab,
  openHelpQuestionIndex,
  setOpenHelpQuestionIndex,
  faqData,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onRequestClose}
    >
      <SafeAreaView style={[{ flex: 1, paddingTop: insets.top }]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.card,
          }}
        >
          <Pressable onPress={onRequestClose} style={{ padding: 8 }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 18,
              color: colors.text,
            }}
          >
            Help Center
          </Text>
          <View style={{ width: 32 }} />
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: insets.bottom + 20,
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
                  color: colors.textSecondary,
                  flex: 1,
                  lineHeight: 20,
                }}
              >
                Protect your security by never sharing your personal or credit
                card information.{" "}
                <Text
                  style={{ color: "#007AFF", textDecorationLine: "underline" }}
                  onPress={() => Linking.openURL("https://www.booking.com")}
                >
                  Learn more
                </Text>
              </Text>
            </View>
            <View style={{ marginHorizontal: 16, marginTop: 20 }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 18, color: colors.text }}
              >
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
                style={{
                  backgroundColor: "#007AFF",
                  borderRadius: 8,
                  paddingVertical: 16,
                  alignItems: "center",
                  marginTop: 20,
                }}
                onPress={() =>
                  Linking.openURL(
                    "https://www.booking.com/customer-service.html",
                  )
                }
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Get help with a booking
                </Text>
              </Pressable>
            </View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                color: colors.text,
                marginHorizontal: 16,
                marginTop: 20,
              }}
            >
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
                  onPress={() => setActiveHelpTab(tab)}
                  style={{
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingBottom: 5,
                    borderBottomWidth: activeHelpTab === tab ? 2 : 0,
                    borderBottomColor:
                      activeHelpTab === tab ? "#007AFF" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        activeHelpTab === tab
                          ? colors.text
                          : colors.textSecondary,
                      fontSize: 14,
                    }}
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
              {faqData[activeHelpTab]?.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    flexDirection: "column",
                    padding: 16,
                    borderBottomWidth:
                      index === faqData[activeHelpTab].length - 1 ? 0 : 1,
                    borderBottomColor: colors.card,
                  }}
                  onPress={() =>
                    setOpenHelpQuestionIndex(
                      openHelpQuestionIndex === index ? null : index,
                    )
                  }
                >
                  <Text style={{ fontSize: 16, color: colors.text }}>
                    {item.question}
                  </Text>
                  {openHelpQuestionIndex === index && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
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

export default DirectHelpCenterModal;
