import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DirectHelpCenterModal from "../../components/account/DirectHelpCenterModal";
import DiscoverSection from "../../components/account/DiscoverSection";
import GeniusRewardsBanner from "../../components/account/GeniusRewardsBanner";
import HelpCenterModal from "../../components/account/HelpCenterModal";
import HelpSupportSection from "../../components/account/HelpSupportSection";
import LegalPrivacySection from "../../components/account/LegalPrivacySection";
import ManageAccountSection from "../../components/account/ManageAccountSection";
import ManagePropertySection from "../../components/account/ManagePropertySection";
import MessagesModal from "../../components/account/MessagesModal";
import NoCreditsVouchersBanner from "../../components/account/NoCreditsVouchersBanner";
import NotificationsModal from "../../components/account/NotificationsModal";
import PaymentInfoSection from "../../components/account/PaymentInfoSection";
import PreferencesSection from "../../components/account/PreferencesSection";
import ProfileHeader from "../../components/account/ProfileHeader";
import SignOutButton from "../../components/account/SignOutButton";
import TravelActivitySection from "../../components/account/TravelActivitySection";
import { useTheme } from "../../hooks/ThemeContext";
import { createStyles } from "./AccountScreen.styles";

export default function AccountScreen() {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [isDirectHelpCenterOpen, setIsDirectHelpCenterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Stays");
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(
    null
  );
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);
  const openMessages = () => setShowMessagesModal(true);
  const closeMessages = () => setShowMessagesModal(false);
  const openNotifications = () => setShowNotificationsModal(true);
  const closeNotifications = () => setShowNotificationsModal(false);
  const closeHelpCenter = () => {
    setIsHelpCenterOpen(false);
    openMessages();
  };
  const openDirectHelpCenter = () => {
    setIsDirectHelpCenterOpen(true);
    closeMessages();
  };
  const closeDirectHelpCenter = () => {
    setIsDirectHelpCenterOpen(false);
  };

  const goToSearch = () => {
    closeMessages();
    navigation.navigate("Search" as never);
  };
  const AccountView = () => {
    return (
      <View style={styles.container}>
        <ProfileHeader
          userName="Guest"
          geniusLevel="Level 1"
          onMessagesPress={openMessages}
          onNotificationsPress={openNotifications}
        />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 16 }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={theme === "light" ? { backgroundColor: colors.blue } : {}}
          >
            <GeniusRewardsBanner />
            <NoCreditsVouchersBanner />
          </View>
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
  };
  return (
    <View style={{ flex: 1 }}>
      <AccountView />
      <MessagesModal
        visible={showMessagesModal}
        onClose={closeMessages}
        onHelpPress={openDirectHelpCenter}
        onBookNowPress={goToSearch}
        insets={insets}
        colors={colors}
        theme={theme}
      />
      <NotificationsModal
        visible={showNotificationsModal}
        onClose={closeNotifications}
        insets={insets}
        colors={colors}
        theme={theme}
      />
      <HelpCenterModal
        visible={isHelpCenterOpen}
        onClose={closeHelpCenter}
        insets={insets}
        colors={colors}
        theme={theme}
      />
      <DirectHelpCenterModal
        visible={isDirectHelpCenterOpen}
        onClose={closeDirectHelpCenter}
        insets={insets}
        colors={colors}
        theme={theme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openQuestionIndex={openQuestionIndex}
        setOpenQuestionIndex={setOpenQuestionIndex}
      />
    </View>
  );
}
