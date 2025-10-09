import React from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "../../../../hooks/ThemeContext";
import createStyles from "../../../../screens/propertyBookingScreens/propertyConfirmation/PropertyConfirmationScreen.styles";

interface PropertySummarySectionProps {
  property: {
    images: any[];
    name: string;
    address: string;
    rating: number;
    totalReviews?: number;
  };
}

const PropertySummarySection: React.FC<PropertySummarySectionProps> = ({
  property,
}) => {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);

  return (
    <View style={styles.propertySummarySection}>
      <Image
        source={property.images[0]}
        style={styles.propertyImageSummary}
        resizeMode="cover"
      />
      <Text style={styles.propertyNameSummary}>{property.name}</Text>
      <Text style={styles.propertyAddressSummary}>{property.address}</Text>
      <View style={styles.propertyRatingSummary}>
        <View style={styles.ratingSummaryBadge}>
          <Text style={styles.ratingSummaryText}>certified genius</Text>
        </View>
        <Text style={{ color: colors.textSecondary }}>
          {property.totalReviews?.toLocaleString()} reviews
        </Text>
      </View>
    </View>
  );
};

export default PropertySummarySection;
