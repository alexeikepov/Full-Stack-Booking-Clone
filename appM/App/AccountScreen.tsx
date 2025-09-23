// path: src/screens/AccountScreen.tsx
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

import { Colors } from "../constants/Colors";

export default function App() {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

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
      <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
        <ProfileHeader
          userName="Guest"
          geniusLevel="Level 1"
          onMessagesPress={openMessages}
          onNotificationsPress={openNotifications}
        />
        <ScrollView
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <GeniusRewardsBanner />
          <NoCreditsVouchersBanner />
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
            <Ionicons name="close" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.modalHeaderText}>Messages</Text>
          <TouchableOpacity onPress={openHelpCenter}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={Colors.dark.text}
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
            color={Colors.dark.text}
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
            <Ionicons name="chevron-back" size={24} color={Colors.dark.text} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: Colors.dark.background,
  },
  headerTitle: {
    color: Colors.dark.text,
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
    backgroundColor: Colors.dark.card,
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  toggleText: {
    color: Colors.dark.text,
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
    color: Colors.dark.text,
    marginLeft: 6,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  largeCard: {
    backgroundColor: Colors.dark.card,
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
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  largeCardSubtitle: {
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  largeCardButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  largeCardButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  twoColumnCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  smallCard: {
    width: "48%",
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  smallCardImage: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
  },
  smallCardTitle: {
    color: Colors.dark.text,
    fontWeight: "bold",
    padding: 8,
  },
  offerCard: {
    width: 150,
    marginRight: 12,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  offerImage: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
  },
  offerText: {
    color: Colors.dark.text,
    padding: 8,
  },
  dealsCard: {
    backgroundColor: Colors.dark.card,
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
    color: Colors.dark.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  dealsSubtitle: {
    color: Colors.dark.textSecondary,
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
    color: Colors.dark.text,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.card,
  },
  modalHeaderText: {
    color: Colors.dark.text,
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
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  modalSubtitle: {
    color: Colors.dark.textSecondary,
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
