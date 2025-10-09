import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../hooks/ThemeContext";
import FirstFreeBookingModal from "../modals/FirstFreeBookingModal";

interface FirstFreeBookingSectionProps {
  style?: object;
}

const FirstFreeBookingSection: React.FC<FirstFreeBookingSectionProps> = ({
  style,
}) => {
  const { colors, theme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const handlePress = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleBookingComplete = (confirmationCode: string) => {
    // You can add additional logic here if needed
    console.log("Booking completed with confirmation:", confirmationCode);
  };

  return (
    <>
      <View
        style={[
          {
            marginHorizontal: 16,
            marginVertical: 20,
            borderRadius: 16,
            overflow: "hidden",
            shadowColor: theme === "light" ? "#000" : "#222",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 6,
          },
          style,
        ]}
      >
        <TouchableOpacity
          style={{
            backgroundColor: colors.button,
            paddingHorizontal: 20,
            paddingVertical: 24,
            position: "relative",
            overflow: "hidden",
          }}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          {/* Background Pattern */}
          <View
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 50,
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 80,
              height: 80,
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: 40,
            }}
          />

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons
                  name="gift"
                  size={24}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "600",
                      letterSpacing: 0.5,
                    }}
                  >
                    LIMITED TIME
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 4,
                }}
              >
                First Stay FREE!
              </Text>

              <Text
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 14,
                  marginBottom: 8,
                  lineHeight: 20,
                }}
              >
                New users get their first booking completely free.{"\n"}
                Just name and email required!
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "600",
                    marginRight: 8,
                  }}
                >
                  Claim Now
                </Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </View>
            </View>

            <View style={{ marginLeft: 16, alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: 40,
                  padding: 16,
                }}
              >
                <Ionicons name="home" size={32} color="white" />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Value highlight strip */}
        <View
          style={{
            backgroundColor: theme === "light" ? "#f8f9fa" : colors.card,
            paddingHorizontal: 20,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.button}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                color: colors.text,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              No credit card required
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="shield-checkmark"
              size={16}
              color={colors.button}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                color: colors.text,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              Instant confirmation
            </Text>
          </View>
        </View>
      </View>

      <FirstFreeBookingModal
        visible={showModal}
        onClose={handleModalClose}
        onBookingComplete={handleBookingComplete}
      />
    </>
  );
};

export default FirstFreeBookingSection;
