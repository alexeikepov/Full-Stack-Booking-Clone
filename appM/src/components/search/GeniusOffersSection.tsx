import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
import GeniusLoyaltyModal from "../account/GeniusLoyaltyModal";

interface GeniusOffersSectionProps {
  onGeniusCardPress: () => void;
  onOfferPress: () => void;
  showGeniusModal: boolean;
  onCloseGeniusModal: () => void;
  showOfferModal: boolean;
  onCloseOfferModal: () => void;
}

const GeniusOffersSection: React.FC<GeniusOffersSectionProps> = ({
  onGeniusCardPress,
  onOfferPress,
  showGeniusModal,
  onCloseGeniusModal,
  showOfferModal,
  onCloseOfferModal,
}) => {
  const { colors, theme } = useTheme();

  const offersData = [
    {
      title: "10-15% discounts on stays",
      subtitle: "Enjoy discounts at partner properties worldwide",
      badge: "New",
    },
    {
      title: "Exclusive Deals!",
      subtitle: "Book now and get up to 20% off selected properties",
      badge: "Hot",
    },
    {
      title: "Weekend Specials",
      subtitle: "Save on weekend stays with extra perks",
      badge: "New",
    },
    {
      title: "Early Bird Savings",
      subtitle: "Book in advance and save up to 25%",
      badge: "Limited",
    },
    {
      title: "Last Minute Deals",
      subtitle: "Grab a deal for tonights stay with up to 30% off",
      badge: "Hot",
    },
    {
      title: "Family Packages",
      subtitle: "Special rates for families and groups",
      badge: "New",
    },
    {
      title: "Business Traveler",
      subtitle: "Exclusive perks for business trips",
      badge: "Pro",
    },
    {
      title: "Romantic Getaways",
      subtitle: "Special offers for couples retreats",
      badge: "New",
    },
  ];

  const promotionOffers = [
    {
      image: require("../../assets/images/offers1.png"),
      title: "Quick escape, quality time",
      subtitle: "Save up to 20% with a Getaway Deal",
      tag: "Save on stays",
    },
    {
      image: require("../../assets/images/offers2.png"),
      title: "20% off hotel bookings",
      subtitle: "Book now and get a great discount",
      tag: "Find deals",
    },
    {
      image: require("../../assets/images/offers3.png"),
      title: "Free breakfast included",
      subtitle: "Enjoy complimentary breakfast with your stay",
      tag: "Eat well",
    },
    {
      image: require("../../assets/images/offers4.png"),
      title: "Kids stay free",
      subtitle: "Special family rates available",
      tag: "Family friendly",
    },
    {
      image: require("../../assets/images/offers5.png"),
      title: "Free cancellation",
      subtitle: "Cancel anytime for free on select deals",
      tag: "Book with confidence",
    },
  ];

  const styles = StyleSheet.create({
    section: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    geniusSubtitle: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    geniusCard: {
      backgroundColor: "#E8F4FD",
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    offersCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    offersTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    offersSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    offersNew: {
      position: "absolute",
      top: 8,
      right: 8,
      backgroundColor: "#FF6B35",
      color: "#FFFFFF",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
      fontWeight: "bold",
    },
    offersSubtitleSection: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    offerCard: {
      width: 280,
      height: 180,
      borderRadius: 12,
      overflow: "hidden",
    },
  });

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>you got a temporary upgrade!</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          <TouchableOpacity onPress={onGeniusCardPress}>
            <View
              style={[
                styles.geniusCard,
                {
                  width: 250,
                  padding: 16,
                  marginRight: 16,
                  paddingBottom: 45,
                },
              ]}
            >
              <Text style={styles.geniusSubtitle}>
                Genius{"\n"}Guest, you will be{"\n"}upgraded to Level 2 on{"\n"}
                Oct 1 2025!
              </Text>
            </View>
          </TouchableOpacity>
          {offersData.map((offer, index) => (
            <TouchableOpacity key={index} onPress={onGeniusCardPress}>
              <View
                style={[
                  styles.offersCard,
                  { width: 250, padding: 16, marginRight: 16 },
                ]}
              >
                <Text style={styles.offersTitle}>{offer.title}</Text>
                <Text style={styles.offersSubtitle}>{offer.subtitle}</Text>
                <Text style={styles.offersNew}>{offer.badge}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <GeniusLoyaltyModal
          visible={showGeniusModal}
          onClose={onCloseGeniusModal}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offers</Text>
        <Text style={styles.offersSubtitleSection}>
          promotions, deals, and special offers just for you!
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        >
          {promotionOffers.map((offer, index) => (
            <TouchableOpacity
              key={index}
              style={styles.offerCard}
              onPress={onOfferPress}
            >
              <Image
                source={offer.image}
                style={[
                  StyleSheet.absoluteFill,
                  { borderRadius: 12, width: "100%", height: "100%" },
                ]}
                resizeMode="cover"
              />
              <View style={{ padding: 8, zIndex: 2 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    textShadowColor: "rgba(0,0,0,0.8)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 3,
                  }}
                >
                  {offer.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#F5F5F5",
                    textShadowColor: "rgba(0,0,0,0.7)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  {offer.subtitle}
                </Text>
                <Text
                  style={{
                    color: "#FFD700",
                    marginTop: 4,
                    textShadowColor: "rgba(0,0,0,0.7)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  {offer.tag}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <Modal
        visible={showOfferModal}
        animationType="fade"
        presentationStyle="overFullScreen"
        onRequestClose={onCloseOfferModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor:
              theme === "light" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
            minWidth: 220,
          }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              padding: 32,
              borderRadius: 16,
              alignItems: "center",
              minWidth: 220,
            }}
          >
            <Ionicons
              name="close-circle-outline"
              size={40}
              color="#FF5252"
              style={{ marginBottom: 16 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.textSecondary,
                textAlign: "center",
              }}
            >
              Sorry, these amazing offers are not relevant to you
            </Text>
            <Text
              style={{
                color: colors.text,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              You are only at level 1 genius. Purchase more properties to
              progress and get all these awsome deals.
            </Text>
            <TouchableOpacity
              style={{ marginTop: 16 }}
              onPress={onCloseOfferModal}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontWeight: "bold",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GeniusOffersSection;
