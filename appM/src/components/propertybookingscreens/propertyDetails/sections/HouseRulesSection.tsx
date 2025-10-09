import React, { useState } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface HouseRulesSectionProps {
  property: any;
  styles: any;
  colors: any;
}

const HouseRulesSection: React.FC<HouseRulesSectionProps> = ({
  property,
  styles,
  colors,
}) => {
  const [showRules, setShowRules] = useState(false);
  const [rulesAnimationHeight] = useState(new Animated.Value(0));

  const handleToggleRules = () => {
    Animated.timing(rulesAnimationHeight, {
      toValue: showRules ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setShowRules(!showRules);
  };
  // Extract houseRules using the actual property structure, similar to FacilitiesSection
  let houseRules = null;
  if (property.houseRules) {
    houseRules = property.houseRules;
  } else if (property.overview && property.overview.houseRules) {
    houseRules = property.overview.houseRules;
  } else if (property.details && property.details.houseRules) {
    houseRules = property.details.houseRules;
  }

  if (!houseRules) return null;

  // If houseRules is a string, try to parse it
  if (typeof houseRules === "string") {
    try {
      houseRules = JSON.parse(houseRules);
    } catch {
      // If parsing fails, return null
      return null;
    }
  }

  const {
    checkIn,
    checkOut,
    cancellation,
    children,
    ageRestriction,
    pets,
    paymentMethods,
    parties,
  } = houseRules;

  const rulesCount = [
    checkIn,
    checkOut,
    cancellation,
    children,
    ageRestriction,
    pets,
    paymentMethods,
    parties,
  ].filter(Boolean).length;
  return (
    <View
      style={[
        styles.section,
        {
          marginBottom: 24,
          backgroundColor: colors.sectionBackground || "transparent",
        },
      ]}
    >
      <Text
        style={[
          styles.sectionTitle,
          {
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 8,
            color: colors.textPrimary || colors.text || "#fff",
          },
        ]}
      >
        House Rules
      </Text>
      <TouchableOpacity
        onPress={handleToggleRules}
        style={{ marginLeft: 8, alignSelf: "flex-start" }}
      >
        <Text style={styles.seeAllFacilitiesText}>
          {showRules ? "Hide rules" : "Show rules"}
        </Text>
      </TouchableOpacity>
      <Animated.View
        style={{
          overflow: "hidden",
          maxHeight: rulesAnimationHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, rulesCount * 60],
          }),
        }}
      >
        {checkIn && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="schedule" size={20} color={colors.text} />
              <Text
                style={{
                  fontWeight: "bold",
                  color: colors.text,
                  marginLeft: 8,
                  fontSize: 16,
                }}
              >
                Check-in
              </Text>
            </View>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 16,
                marginLeft: 28,
                marginTop: 4,
              }}
            >
              {checkIn.time} {checkIn.note && `(${checkIn.note})`}
            </Text>
          </View>
        )}
        {checkOut && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="schedule" size={20} color={colors.text} />
              <Text
                style={{
                  fontWeight: "bold",
                  color: colors.text,
                  marginLeft: 8,
                  fontSize: 16,
                }}
              >
                Check-out
              </Text>
            </View>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 16,
                marginLeft: 28,
                marginTop: 4,
              }}
            >
              {checkOut.time}
            </Text>
          </View>
        )}
        {cancellation && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="cancel" size={20} color={colors.text} />
              <Text
                style={{
                  fontWeight: "bold",
                  color: colors.text,
                  marginLeft: 8,
                  fontSize: 16,
                }}
              >
                Cancellation
              </Text>
            </View>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 16,
                marginLeft: 28,
                marginTop: 4,
              }}
            >
              {cancellation.policy}{" "}
              {cancellation.conditions && `(${cancellation.conditions})`}
            </Text>
          </View>
        )}
        {children && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="child-care" size={20} color={colors.text} />
              <Text
                style={{
                  fontWeight: "bold",
                  color: colors.text,
                  marginLeft: 8,
                  fontSize: 16,
                }}
              >
                Children
              </Text>
            </View>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 16,
                marginLeft: 28,
                marginTop: 4,
              }}
            >
              {children.welcome}{" "}
              {children.searchNote && `(${children.searchNote})`}
            </Text>
          </View>
        )}
        {ageRestriction && ageRestriction.hasRestriction && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="person" size={20} color={colors.text} />
              <Text
                style={{
                  fontWeight: "bold",
                  color: colors.text,
                  marginLeft: 8,
                  fontSize: 16,
                }}
              >
                Age restriction
              </Text>
            </View>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 16,
                marginLeft: 28,
                marginTop: 4,
              }}
            >
              Minimum age {ageRestriction.minimumAge || ""}{" "}
              {ageRestriction.note || ""}
            </Text>
          </View>
        )}
        {pets && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="pets" size={20} color={colors.text} />
              <Text
                style={{
                  fontWeight: "bold",
                  color: colors.text,
                  marginLeft: 8,
                  fontSize: 16,
                }}
              >
                Pets
              </Text>
            </View>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 16,
                marginLeft: 28,
                marginTop: 4,
              }}
            >
              {pets.allowed ? "Allowed" : "Not allowed"}{" "}
              {pets.note && `(${pets.note})`}
            </Text>
          </View>
        )}
        {paymentMethods &&
          paymentMethods.methods &&
          paymentMethods.methods.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="payment" size={20} color={colors.text} />
                <Text
                  style={{
                    fontWeight: "bold",
                    color: colors.text,
                    marginLeft: 8,
                    fontSize: 16,
                  }}
                >
                  Payment methods
                </Text>
              </View>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 16,
                  marginLeft: 28,
                  marginTop: 4,
                }}
              >
                {paymentMethods.methods.join(", ")}
              </Text>
            </View>
          )}
        {parties && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="party-mode" size={20} color={colors.text} />
              <Text
                style={{
                  fontWeight: "bold",
                  color: colors.text,
                  marginLeft: 8,
                  fontSize: 16,
                }}
              >
                Parties
              </Text>
            </View>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 16,
                marginLeft: 28,
                marginTop: 4,
              }}
            >
              {parties.allowed ? "Allowed" : "Not allowed"}{" "}
              {parties.note && `(${parties.note})`}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default HouseRulesSection;
