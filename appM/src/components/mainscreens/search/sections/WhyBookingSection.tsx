import React from "react";
import { View, Text, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../../hooks/ThemeContext";
import { createSearchScreenStyles } from "../../../../screens/mainScreens/search/SearchScreen.styles";

export default function WhyBookingSection() {
  const { colors, theme } = useTheme();
  const styles = createSearchScreenStyles(colors, theme);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Why Booking.com?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={[
            styles.whyBookingCard,
            { flexDirection: "row", alignItems: "center", minWidth: 180 },
          ]}
        >
          <Ionicons
            name="phone-portrait-outline"
            size={40}
            color={colors.blue}
          />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text
              style={styles.whyBookingTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Mobile-only {"\n"} pricing
            </Text>
            <Text
              style={styles.whyBookingSubtitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Save money on select stays
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.whyBookingCard,
            { flexDirection: "row", alignItems: "center", minWidth: 180 },
          ]}
        >
          <Ionicons name="calendar-outline" size={40} color={colors.blue} />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text
              style={styles.whyBookingTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Free {"\n"} cancellation
            </Text>
            <Text
              style={styles.whyBookingSubtitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Find what works for you
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.whyBookingCard,
            { flexDirection: "row", alignItems: "center", minWidth: 180 },
          ]}
        >
          <Ionicons name="headset-outline" size={40} color={colors.blue} />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text
              style={styles.whyBookingTitle}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              24/7{"\n"} Customer{"\n"} Support
            </Text>
            <Text
              style={styles.whyBookingSubtitle}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              We are here to help anytime, anywhere
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.whyBookingCard,
            { flexDirection: "row", alignItems: "center", minWidth: 180 },
          ]}
        >
          <Ionicons name="cash-outline" size={40} color={colors.blue} />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text
              style={styles.whyBookingTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              No booking fees
            </Text>
            <Text
              style={styles.whyBookingSubtitle}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              Book with confidence, no hidden charges
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.whyBookingCard,
            { flexDirection: "row", alignItems: "center", minWidth: 180 },
          ]}
        >
          <Ionicons name="star-outline" size={40} color={colors.blue} />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text
              style={styles.whyBookingTitle}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              Genius loyalty program
            </Text>
            <Text
              style={styles.whyBookingSubtitle}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              Unlock exclusive discounts and perks
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.whyBookingCard,
            { flexDirection: "row", alignItems: "center", minWidth: 180 },
          ]}
        >
          <Ionicons name="globe-outline" size={40} color={colors.blue} />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text
              style={styles.whyBookingTitle}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              Wide selection
            </Text>
            <Text
              style={styles.whyBookingSubtitle}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              Choose from millions of properties worldwide
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.whyBookingCard,
            { flexDirection: "row", alignItems: "center", minWidth: 180 },
          ]}
        >
          <Ionicons name="chatbubbles-outline" size={40} color={colors.blue} />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text
              style={styles.whyBookingTitle}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              Verified guest reviews
            </Text>
            <Text
              style={styles.whyBookingSubtitle}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              Real feedback from real travelers
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
