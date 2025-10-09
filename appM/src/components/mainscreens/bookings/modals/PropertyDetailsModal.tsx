import React from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Booking {
  id: string;
  propertyName: string;
  dates: string;
  price: string;
  status: string;
  details: {
    checkIn: string;
    checkOut: string;
    roomType: string;
    includedExtras?: string;
    breakfastIncluded?: boolean;
    nonRefundable?: boolean;
    totalPrice: string;
    contactNumber?: string;
    image?: any;
  };
}

interface PropertyDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
  booking: Booking | null;
  activeTab: string;
  colors: any;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  visible,
  onClose,
  onCancel,
  booking,
  activeTab,
  colors,
}) => {
  if (!booking) return null;

  const { propertyName, dates, price, status, details } = booking;
  const isCanceledContext = activeTab === "Canceled" || status === "Canceled";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
    >
      <SafeAreaView
        style={[{ flex: 1, backgroundColor: colors.background }]}
        edges={["bottom"]}
      >
        <View style={{ flex: 1 }}>
          {/* Scrollable content */}
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* Header with optional image and title */}
            <View
              style={{
                width: "100%",
                height: 270,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                overflow: "hidden",
                position: "relative",
                backgroundColor: colors.card,
                marginTop: -50,
              }}
            >
              {details.image ? (
                <Image
                  source={
                    typeof details.image === "string"
                      ? { uri: details.image }
                      : details.image
                  }
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    resizeMode: "cover",
                  }}
                  onError={(error) => {
                    console.warn(
                      "Image failed to load:",
                      error.nativeEvent.error,
                    );
                  }}
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: colors.card,
                  }}
                />
              )}
              {details.image && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                  }}
                />
              )}
              <View
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  right: 12,
                  flexDirection: "column",
                  zIndex: 3,
                }}
              >
                <Text
                  style={{
                    color: details.image ? "#FFFFFF" : colors.text,
                    fontSize: 20,
                    fontWeight: "bold",
                    textShadowColor: details.image
                      ? "rgba(0, 0, 0, 0.75)"
                      : "transparent",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3,
                  }}
                >
                  {propertyName}
                </Text>
                <Text
                  style={{
                    color: details.image
                      ? "#FFFFFF"
                      : colors.textSecondary || colors.icon,
                    fontSize: 14,
                    marginTop: 4,
                    textShadowColor: details.image
                      ? "rgba(0, 0, 0, 0.75)"
                      : "transparent",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3,
                  }}
                >
                  {dates} · {price}
                </Text>
              </View>
            </View>

            {/* Details Section */}
            <View style={{ padding: 16, flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary || colors.icon,
                  }}
                >
                  Status
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  {status}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary || colors.icon,
                  }}
                >
                  Check-in
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  {details.checkIn}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary || colors.icon,
                  }}
                >
                  Check-out
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  {details.checkOut}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary || colors.icon,
                  }}
                >
                  Room type
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  {details.roomType}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary || colors.icon,
                  }}
                >
                  Extras
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  {details.includedExtras || "—"}
                </Text>
              </View>

              {details.breakfastIncluded && (
                <View
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    alignSelf: "flex-start",
                    marginTop: 8,
                    backgroundColor: "#E6F7FF",
                  }}
                >
                  <Text style={{ color: "#007AFF" }}>Breakfast included</Text>
                </View>
              )}

              {details.nonRefundable && (
                <View
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    alignSelf: "flex-start",
                    marginTop: 8,
                    backgroundColor: "#FEEFEF",
                  }}
                >
                  <Text style={{ color: "#FF3B30" }}>Non-refundable</Text>
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary || colors.icon,
                  }}
                >
                  Total
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  {details.totalPrice}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Buttons at bottom */}
          <View
            style={{
              padding: 16,
              borderTopWidth: 1,
              borderColor: colors.border || "#E5E5E5",
              backgroundColor: colors.background,
            }}
          >
            <TouchableOpacity
              disabled={isCanceledContext}
              style={{
                width: "100%",
                backgroundColor: isCanceledContext ? "#CCCCCC" : "#FF3B30",
                padding: 14,
                borderRadius: 10,
                alignItems: "center",
                opacity: isCanceledContext ? 0.7 : 1,
              }}
              onPress={onCancel}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontWeight: "700",
                }}
              >
                Cancel booking
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "100%",
                backgroundColor: "#007AFF",
                padding: 14,
                borderRadius: 10,
                alignItems: "center",
                marginTop: 12,
              }}
              onPress={() => {
                if (details.contactNumber) {
                  Linking.openURL(`tel:${details.contactNumber}`);
                } else {
                  Alert.alert("No contact", "No contact number available.");
                }
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontWeight: "700",
                }}
              >
                Contact property
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 10,
                alignItems: "center",
                marginTop: 12,
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: colors.border || "#E5E5E5",
              }}
              onPress={onClose}
            >
              <Text
                style={{
                  color: colors.text,
                  fontWeight: "600",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PropertyDetailsModal;
