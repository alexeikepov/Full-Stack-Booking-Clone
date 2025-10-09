import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../hooks/ThemeContext";

const DescriptionSection = ({ styles, property }: any) => {
  const { colors } = useTheme();
  const [showExpanded, setShowExpanded] = useState(false);

  const truncatedDescription =
    property.description.length > 100
      ? property.description.slice(0, 100) + "..."
      : property.description;
  // Extract single highlights for overview, surroundings, house rules
  let overviewHighlight = null;
  if (property.overview) {
    if (property.overview.infoAndPrices) {
      overviewHighlight = property.overview.infoAndPrices;
    } else if (property.overview.activity) {
      overviewHighlight = property.overview.activity;
    } else if (property.overview.facilities) {
      overviewHighlight = property.overview.facilities;
    }
  }

  let surroundingsHighlight = null;
  if (property.surroundings) {
    const s = property.surroundings;
    if (s.nearbyAttractions && s.nearbyAttractions.length > 0) {
      surroundingsHighlight = `Near: ${s.nearbyAttractions[0].name} (${s.nearbyAttractions[0].distance})`;
    } else if (s.topAttractions && s.topAttractions.length > 0) {
      surroundingsHighlight = `Near: ${s.topAttractions[0].name} (${s.topAttractions[0].distance})`;
    } else if (s.restaurantsCafes && s.restaurantsCafes.length > 0) {
      surroundingsHighlight = `Near: ${s.restaurantsCafes[0].name}`;
    } else if (s.naturalBeauty && s.naturalBeauty.length > 0) {
      surroundingsHighlight = `Near: ${s.naturalBeauty[0].name}`;
    }
  }

  let houseRuleHighlight = null;
  if (property.houseRules) {
    if (property.houseRules.checkIn?.time) {
      houseRuleHighlight = `Check-in: ${property.houseRules.checkIn.time}`;
    } else if (property.houseRules.pets) {
      houseRuleHighlight =
        property.houseRules.pets.allowed === false
          ? "No pets allowed"
          : property.houseRules.pets.note;
    }
  }

  return (
    <View style={styles.descriptionSection}>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.descriptionText}>
        {showExpanded ? property.description : truncatedDescription}
      </Text>
      {showExpanded && (
        <>
          {/* Highlights for overview, surroundings, house rules */}
          {(overviewHighlight ||
            surroundingsHighlight ||
            houseRuleHighlight) && (
            <View style={{ marginVertical: 8 }}>
              {overviewHighlight && (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                    marginBottom: 2,
                  }}
                >
                  {overviewHighlight}
                </Text>
              )}
              {surroundingsHighlight && (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                    marginBottom: 2,
                  }}
                >
                  {surroundingsHighlight}
                </Text>
              )}
              {houseRuleHighlight && (
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                  {houseRuleHighlight}
                </Text>
              )}
            </View>
          )}
          {property.deal && (
            <Text style={styles.priceLabel}>
              Deal: <Text style={styles.priceValue}>{property.deal}</Text>
            </Text>
          )}
          {property.oldPrice && (
            <Text style={styles.priceLabel}>
              Old Price:{" "}
              <Text style={styles.priceValue}>{property.oldPrice}</Text>
            </Text>
          )}
          {property.taxesIncluded !== undefined && (
            <Text style={styles.priceLabel}>
              Taxes Included:{" "}
              <Text style={styles.priceValue}>
                {property.taxesIncluded ? "Yes" : "No"}
              </Text>
            </Text>
          )}
          {property.distance && (
            <Text style={styles.priceLabel}>
              Distance:{" "}
              <Text style={styles.priceValue}>{property.distance}</Text>
            </Text>
          )}
        </>
      )}
      {property.description.length > 100 && (
        <TouchableOpacity
          onPress={() => setShowExpanded(!showExpanded)}
          style={styles.readMoreButton}
        >
          <Text style={styles.readMoreText}>
            {showExpanded ? "Show less" : "Read more"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DescriptionSection;
