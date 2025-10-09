import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../hooks/ThemeContext";
import createStyles from "../../../../screens/propertyBookingScreens/propertyConfirmation/PropertyConfirmationScreen.styles";

interface PriceSummarySectionProps {
  pricePerNight: string;
  nights: number;
  selectedGuests: {
    rooms: number;
  };
  subtotal: string;
  taxes: string;
  total: string;
  cardSubmittedSuccess: boolean;
  showPaymentDetails: boolean;
  onTogglePaymentDetails: () => void;
}

const PriceSummarySection: React.FC<PriceSummarySectionProps> = ({
  pricePerNight,
  nights,
  selectedGuests,
  subtotal,
  taxes,
  total,
  cardSubmittedSuccess,
  showPaymentDetails,
  onTogglePaymentDetails,
}) => {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);

  // Calculate price per night as total divided by nights
  const totalNum = parseInt(total.replace(/[^\d]/g, ""));
  const pricePerNightNum = Math.round(totalNum / nights);
  const calculatedPricePerNight = `₪ ${pricePerNightNum}`;

  return (
    <View style={styles.priceSummarySection}>
      <Text style={styles.sectionTitleBooking}>Price summary</Text>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Price per night</Text>
        <Text style={styles.priceValue}>{calculatedPricePerNight}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Nights × Rooms</Text>
        <Text style={styles.priceValue}>
          {nights} × {selectedGuests.rooms}
        </Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Subtotal</Text>
        <Text style={styles.priceValue}>{calculatedPricePerNight}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Taxes & fees</Text>
        <Text style={styles.priceValue}>{taxes}</Text>
      </View>
      <View style={styles.totalPriceRow}>
        <Text style={styles.totalPriceLabel}>Total</Text>
        <Text style={styles.totalPriceValue}>{total}</Text>
      </View>

      {/* Payment Details Button */}
      {!cardSubmittedSuccess && (
        <TouchableOpacity
          style={[
            styles.confirmBookingButton,
            {
              marginTop: 16,
              backgroundColor: colors.button,
              borderRadius: 8,
            },
          ]}
          onPress={onTogglePaymentDetails}
        >
          <Text style={styles.confirmBookingButtonText}>
            {showPaymentDetails
              ? "Hide Payment Details"
              : "Insert Payment Details"}
          </Text>
        </TouchableOpacity>
      )}

      {cardSubmittedSuccess && (
        <Text
          style={{
            color: "green",
            fontSize: 16,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Card details submitted successfully!
        </Text>
      )}
    </View>
  );
};

export default PriceSummarySection;
