import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { faqData } from "../../../data/faqData";
import {
  UnifiedHelpCenterModal,
  MessagesModal,
  NotificationsModal,
} from "../../../../src/components/shared";
import { useMessages } from "../../../hooks/MessagesContext";
import { useNotifications } from "../../../hooks/NotificationsContext";
import { useAuth } from "../../../hooks/AuthContext";
import DiscoverSection from "../../../components/mainscreens/account/sections/DiscoverSection";
import GeniusRewardsBanner from "../../../components/mainscreens/account/modals/GeniusRewardsBanner";
import HelpSupportSection from "../../../components/mainscreens/account/sections/HelpSupportSection";
import LegalPrivacySection from "../../../components/mainscreens/account/sections/LegalPrivacySection";
import ManageAccountSection from "../../../components/mainscreens/account/sections/ManageAccountSection";
import ManagePropertySection from "../../../components/mainscreens/account/sections/ManagePropertySection";
import NoCreditsVouchersBanner from "../../../components/mainscreens/account/modals/NoCreditsVouchersBanner";
import PaymentInfoSection from "../../../components/mainscreens/account/sections/PaymentInfoSection";
import PreferencesSection from "../../../components/mainscreens/account/sections/PreferencesSection";
import ProfileHeader from "../../../components/mainscreens/account/sections/ProfileHeader";
import SignOutButton from "../../../components/mainscreens/account/modals/SignOutButton";
import TravelActivitySection from "../../../components/mainscreens/account/sections/TravelActivitySection";
import { useTheme } from "../../../hooks/ThemeContext";
import { createStyles } from "./AccountScreen.styles";

export default function AccountScreen() {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isDirectHelpCenterOpen, setIsDirectHelpCenterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Stays");
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(
    null,
  );
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);

  // Messages and notifications contexts
  const { markAllAsRead: markAllMessagesAsRead } = useMessages();
  const { markAllAsRead: markAllNotificationsAsRead } = useNotifications();
  const { user } = useAuth();
  const openMessages = () => {
    markAllMessagesAsRead();
    setShowMessagesModal(true);
  };
  const closeMessages = () => setShowMessagesModal(false);
  const openNotifications = () => {
    markAllNotificationsAsRead();
    setShowNotificationsModal(true);
  };
  const closeNotifications = () => setShowNotificationsModal(false);

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
          userName={user?.name || "Guest"}
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
        onRequestClose={closeMessages}
        onHelpPress={openDirectHelpCenter}
        onSearchPress={goToSearch}
        insets={insets}
        colors={colors}
        theme={theme}
        manWhiteImage={require("../../../assets/images/man-white.jpg")}
        messagesManImage={require("../../../assets/images/messages-man.png")}
        styles={styles}
      />
      <NotificationsModal
        visible={showNotificationsModal}
        onRequestClose={closeNotifications}
        insets={insets}
        colors={colors}
        styles={styles}
      />
      <UnifiedHelpCenterModal
        visible={isDirectHelpCenterOpen}
        onClose={closeDirectHelpCenter}
        insets={insets}
        colors={colors}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openQuestionIndex={openQuestionIndex}
        setOpenQuestionIndex={setOpenQuestionIndex}
        faqData={faqData}
      />
    </View>
  );
}
