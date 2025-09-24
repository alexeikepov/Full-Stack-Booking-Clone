import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import DiscoverSection from "../components/account/DiscoverSection";
import GeniusRewardsBanner from "../components/account/GeniusRewardsBanner";
import HelpSupportSection from "../components/account/HelpSupportSection";
import LegalPrivacySection from "../components/account/LegalPrivacySection";
import ManageAccountSection from "../components/account/ManageAccountSection";
import ManagePropertySection from "../components/account/ManagePropertySection";
import NoCreditsVouchersBanner from "../components/account/NoCreditsVouchersBanner";
import PaymentInfoSection from "../components/account/PaymentInfoSection";
import PreferencesSection from "../components/account/PreferencesSection";
import ProfileHeader from "../components/account/ProfileHeader";
import SignOutButton from "../components/account/SignOutButton";
import TravelActivitySection from "../components/account/TravelActivitySection";
import { useTheme } from "../hooks/ThemeContext";
export default function AccountScreen() {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);
  const openMessages = () => setShowMessagesModal(true);
  const closeMessages = () => setShowMessagesModal(false);
  const openNotifications = () => setShowNotificationsModal(true);
  const closeNotifications = () => setShowNotificationsModal(false);
  const openHelpCenter = () => {
    setIsHelpCenterOpen(true);
    closeMessages();
  };
  const closeHelpCenter = () => {
    setIsHelpCenterOpen(false);
    openMessages();
  };
  const goToSearch = () => {
    closeMessages();
    navigation.navigate("Search" as never);
  };
  const AccountScreen = () => {
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
  const MessagesModal = (
    <Modal
      visible={showMessagesModal}
      animationType="slide"
      transparent={false}
      onRequestClose={closeMessages}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={closeMessages} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.modalHeaderText}>Messages</Text>
          <TouchableOpacity onPress={openHelpCenter}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <Image
            source={require("./../assets/images/messages-man.png")}
            style={styles.messageImage}
          />
          <Text style={styles.modalTitle}>No messages</Text>
          <Text style={styles.modalSubtitle}>
            You can start exchanging messages when you have upcoming bookings.
          </Text>
        </View>
        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.searchButton} onPress={goToSearch}>
            <Text style={styles.buttonText}>Book now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
  const NotificationsModal = (
    <Modal
      visible={showNotificationsModal}
      animationType="slide"
      transparent={false}
      onRequestClose={closeNotifications}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={closeNotifications}
            style={styles.closeButton}
          >
            <Text style={styles.modalHeaderText}>Close</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          <Ionicons
            name="notifications-outline"
            size={80}
            color={colors.text}
          />
          <Text style={styles.modalTitle}>
            You do not have any notifications.
          </Text>
          <Text style={styles.modalSubtitle}>
            Notifications let you quickly take action on upcoming or current
            bookings.
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
  const HelpCenterModal = (
    <Modal
      visible={isHelpCenterOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={closeHelpCenter}
    >
      <SafeAreaView style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={closeHelpCenter}
            style={styles.closeButton}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.modalHeaderText}>Help Center</Text>
        </View>
        <HelpSupportSection />
      </SafeAreaView>
    </Modal>
  );
  return (
    <View style={{ flex: 1 }}>
      <AccountScreen />
      {showMessagesModal && MessagesModal}
      {showNotificationsModal && NotificationsModal}
      {isHelpCenterOpen && HelpCenterModal}
    </View>
  );
}
const createStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  theme: string,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      backgroundColor: theme === "light" ? colors.blue : colors.background,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
    },
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerIconSpacing: {
      marginLeft: 16,
    },
    searchModuleContainer: {
      backgroundColor: colors.card,
      margin: 16,
      borderRadius: 16,
      padding: 16,
    },
    searchButton: {
      backgroundColor: colors.button,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: {
      color: colors.text,
      fontWeight: "bold",
    },
    toggleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    toggleText: {
      color: colors.text,
    },
    radioGroup: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 8,
      alignItems: "center",
    },
    radioButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      marginRight: 12,
    },
    radioText: {
      color: colors.text,
      marginLeft: 6,
    },
    section: {
      marginTop: 16,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    largeCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: "hidden",
    },
    largeCardImage: {
      width: "100%",
      height: 150,
      resizeMode: "cover",
    },
    largeCardTextContainer: {
      padding: 16,
    },
    largeCardTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    largeCardSubtitle: {
      color: colors.textSecondary,
      marginTop: 4,
    },
    largeCardButton: {
      backgroundColor: colors.button,
      padding: 10,
      borderRadius: 8,
      marginTop: 12,
      alignSelf: "flex-start",
    },
    largeCardButtonText: {
      color: colors.text,
      fontWeight: "bold",
    },
    twoColumnCardsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
    },
    smallCard: {
      width: "48%",
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
    },
    smallCardImage: {
      width: "100%",
      height: 80,
      resizeMode: "cover",
    },
    smallCardTitle: {
      color: colors.text,
      fontWeight: "bold",
      padding: 8,
    },
    offerCard: {
      width: 150,
      marginRight: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
    },
    offerImage: {
      width: "100%",
      height: 80,
      resizeMode: "cover",
    },
    offerText: {
      color: colors.text,
      padding: 8,
    },
    dealsCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
      flexDirection: "row",
      alignItems: "center",
    },
    dealsImage: {
      width: 100,
      height: 100,
      resizeMode: "cover",
    },
    dealsContent: {
      padding: 12,
    },
    dealsTitle: {
      color: colors.text,
      fontWeight: "bold",
      fontSize: 16,
    },
    dealsSubtitle: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    exploreItem: {
      alignItems: "center",
      marginRight: 16,
    },
    exploreImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
    },
    exploreTitle: {
      color: colors.text,
      marginTop: 4,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
    },
    modalHeaderText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    closeButton: {
      padding: 4,
    },
    modalContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
    },
    modalTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 16,
    },
    modalSubtitle: {
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
    },
    modalFooter: {
      padding: 16,
    },
    messageImage: {
      width: 120,
      height: 120,
      resizeMode: "contain",
    },
  });
