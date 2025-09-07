import React from "react";
import { View, ScrollView } from "react-native";
import { Colors } from "../../constants/Colors";
import ProfileHeader from "../../components/account/ProfileHeader";
import GeniusRewardsBanner from "../../components/account/GeniusRewardsBanner";

// Sections
import PaymentInfoSection from "../../components/account/PaymentInfoSection";
import ManageAccountSection from "../../components/account/ManageAccountSection";
import PreferencesSection from "../../components/account/PreferencesSection";
import TravelActivitySection from "../../components/account/TravelActivitySection";
import HelpSupportSection from "../../components/account/HelpSupportSection";
import LegalPrivacySection from "../../components/account/LegalPrivacySection";
import DiscoverSection from "../../components/account/DiscoverSection";
import ManagePropertySection from "../../components/account/ManagePropertySection";
import SignOutButton from "../../components/account/SignOutButton";

// Map item titles to Ionicons icons
export const itemIcons: Record<string, string> = {
  "Rewards & Wallet": "wallet-outline",
  "Payment methods": "card-outline",
  "Personal details": "person-outline",
  "Security settings": "lock-closed-outline",
  "Other travelers": "people-outline",
  "Device preferences": "cog-outline",
  "Travel preferences": "airplane-outline",
  "Email preferences": "mail-outline",
  "Saved lists": "heart-outline",
  "My reviews": "chatbubble-outline",
  "My questions to properties": "help-circle-outline",
  "Contact Customer Service": "help-circle-outline",
  "Safety resource center": "shield-outline",
  "Dispute resolution": "scale-outline",
  "Privacy and data management": "document-lock-outline",
  Legal: "document-text-outline",
  "Content guidelines": "document-text-outline",
  Deals: "pricetags-outline",
  "List your property": "home-outline",
};

export default function Account() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      <ProfileHeader userName="Crazy" />
      <GeniusRewardsBanner />
      <ScrollView style={{ paddingHorizontal: 16 }}>
        <PaymentInfoSection />
        <ManageAccountSection />
        <PreferencesSection />
        <TravelActivitySection />
        <HelpSupportSection />
        <LegalPrivacySection />
        <DiscoverSection />
        <ManagePropertySection />
        <SignOutButton />
      </ScrollView>
    </View>
  );
}
