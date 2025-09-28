import { CommonActions, useNavigation } from "@react-navigation/native";
import { Fragment, useRef, useState } from "react";
import {
  Dimensions,
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
import { useTheme } from "../../hooks/ThemeContext";
interface FaqItem {
  question: string;
  answer: string;
}
interface ProfileHeaderProps {
  userName?: string;
  geniusLevel?: string;
  profileImage?: number;
  onMessagesPress?: () => void;
  onNotificationsPress?: () => void;
}
const { height } = Dimensions.get("window");
const faqs: FaqItem[] = [
  {
    question: "How to progress in Genius",
    answer:
      "Complete a certain number of bookings to unlock new Genius levels and their respective rewards.",
  },
  {
    question: "Which bookings contribute to my progress in Genius?",
    answer:
      "All paid bookings made through Booking.com contribute to your Genius progress.",
  },
  {
    question: "Where can I use my Genius discount?",
    answer:
      "Discounts are applicable at participating properties and rental cars worldwide, indicated by the blue Genius label.",
  },
  {
    question: "How can I find properties offering rewards?",
    answer:
      "Look for the blue Genius label next to the property or rental car listing.",
  },
  {
    question: "How are Genius rewards applied?",
    answer:
      "Discounts and rewards are automatically applied at the time of booking, without needing a promo code.",
  },
  {
    question: "Why aren't my bookings being counted?",
    answer:
      "Ensure you are signed in to your account when making bookings for them to be counted towards your Genius progress.",
  },
  {
    question:
      "Why am I at a different Genius level on my computer than on mobile?",
    answer:
      "This may be a synchronization issue. Try logging out and logging back in on both devices to ensure the data is consistent.",
  },
  {
    question: "How are my bookings counted?",
    answer:
      "Each completed booking contributes one step towards your progress. Canceled or no-show bookings do not count.",
  },
  {
    question: "What rewards do I get at higher levels?",
    answer:
      "Higher levels offer increased discounts and additional perks like free breakfast or room upgrades at select properties.",
  },
  {
    question: "What is my Genius level, and why do I have this level?",
    answer:
      "Your Genius level is based on the number of completed bookings. As you book more, your level and rewards increase.",
  },
  {
    question: "How does the Genius loyalty program work?",
    answer:
      "It's a free loyalty program that rewards you with discounts and travel perks as you complete more bookings.",
  },
];
export default function ProfileHeader({
  userName = "guest",
  geniusLevel = "Level 1",
  profileImage,
  onMessagesPress,
  onNotificationsPress,
}: ProfileHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { colors, theme } = useTheme();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openRateModal, setOpenRateModal] = useState<boolean>(false);
  const [openThanksModal, setOpenThanksModal] = useState<boolean>(false);
  const [openPhotoModal, setOpenPhotoModal] = useState<boolean>(false);
  const [openNotImplementedModal, setOpenNotImplementedModal] =
    useState<boolean>(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  // useRef to get a reference to the ScrollView
  const scrollViewRef = useRef<any>(null);
  const faqSectionRef = useRef<View | null>(null);
  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };
  const handleRateSubmit = (rating?: number) => {
    // store the rating and show thank you overlay
    if (typeof rating === "number") {
      setSelectedRating(rating);
    }
    // close the in-modal rating overlay and show the thank-you overlay
    setOpenRateModal(false);
    setOpenThanksModal(true);
  };
  const handleCloseAllModals = () => {
    setOpenModal(false);
    setOpenRateModal(false);
    setOpenThanksModal(false);
    setOpenPhotoModal(false);
    setOpenNotImplementedModal(false);
    setSelectedRating(null);
  };

  const handlePhotoSelection = (option: string) => {
    // Close the photo selection modal first
    setOpenPhotoModal(false);
    // Show the not implemented modal
    setOpenNotImplementedModal(true);
  };
  // Function to scroll to a specific section and open the corresponding FAQ
  const scrollToFaq = () => {
    setOpenModal(true);
    // Use a timeout to ensure the modal is fully rendered before attempting to scroll
    setTimeout(() => {
      try {
        faqSectionRef.current?.measureLayout(
          // @ts-ignore
          scrollViewRef.current,
          (x: number, y: number) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          },
        );
      } catch (e) {
        console.error("Error measuring layout:", e);
      }
      setFaqOpen(0);
    }, 200);
  };
  // Robust navigation attempts to reach the Search screen.
  // Robust navigation attempts to reach the Search screen.
  const handleFindNextStay = () => {
    const attempts = [
      () => navigation.navigate("Search"),
      () => navigation.navigate("SearchScreen"),
      () => navigation.getParent()?.navigate("Search"),
      () => navigation.getParent()?.navigate("SearchScreen"),
      () => navigation.navigate("Root", { screen: "Search" as any }),
      () => navigation.navigate("Root", { screen: "SearchScreen" as any }),
      () => navigation.dispatch(CommonActions.navigate({ name: "Search" })),
      () =>
        navigation.dispatch(CommonActions.navigate({ name: "SearchScreen" })),
      () =>
        navigation
          .getParent()
          ?.dispatch(CommonActions.navigate({ name: "Search" })),
      () =>
        navigation
          .getParent()
          ?.dispatch(CommonActions.navigate({ name: "SearchScreen" })),
    ];
    for (const attempt of attempts) {
      try {
        attempt();
        break;
      } catch (err) {
        console.error("Navigation attempt failed:", err);
      }
    }
    setOpenModal(false);
  };
  return (
    <Fragment>
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor:
              theme === "light" ? colors.blue : colors.background,
          },
        ]}
      >
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => setOpenPhotoModal(true)}>
            <Image
              source={
                profileImage || require("../../assets/images/place-holder.jpg")
              }
              style={[
                styles.profileImage,
                { borderColor: theme === "light" ? "#FFD700" : "#FFD700" },
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOpenModal(true)}>
            <Text
              style={[
                styles.userNameText,
                { color: theme === "light" ? "#FFFFFF" : colors.text },
              ]}
            >
              Hi, {userName}
            </Text>
            <View
              style={[
                styles.geniusLevelBadge,
                {
                  backgroundColor:
                    theme === "light" ? "rgba(255,255,255,0.2)" : colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.geniusLabelText,
                  { color: theme === "light" ? "#FFFFFF" : colors.text },
                ]}
              >
                Genius{" "}
              </Text>
              <Text
                style={[
                  styles.geniusLevelText,
                  { color: theme === "light" ? "#FFD700" : "#FFD700" },
                ]}
              >
                {geniusLevel}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onMessagesPress}>
            <Ionicons
              name="chatbubble-outline"
              size={32}
              color={theme === "light" ? "#FFFFFF" : "#FFFFFF"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNotificationsPress}>
            <Ionicons
              name="notifications-outline"
              size={32}
              color={theme === "light" ? "#FFFFFF" : "#FFFFFF"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={openModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setOpenModal(false)}
        presentationStyle="fullScreen"
      >
        <SafeAreaView
          edges={["top", "left", "right"]}
          style={{
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: insets.top,
            position: "relative",
          }}
        >
          <View
            style={[
              styles.modalHeader,
              {
                paddingTop: 0,
                paddingBottom: 12,
                backgroundColor: colors.background,
                borderBottomColor: colors.textSecondary,
              },
            ]}
          >
            <TouchableOpacity onPress={() => setOpenModal(false)}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalHeaderText, { color: colors.text }]}>
              Genius loyalty program
            </Text>
            <Text style={styles.modalHeaderTime}></Text>
          </View>
          <ScrollView style={styles.scrollView} ref={scrollViewRef}>
            <View style={styles.heroSection}>
              <Image
                source={require("../../assets/images/genius1.jpg")} // Using placeholder image
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>Get rewarded for being you</Text>
                <View style={styles.geniusTitleContainer}>
                  <Text style={styles.geniusTitleText}>Genius</Text>
                  <Text style={styles.geniusSubtitle}>
                    Booking.coms loyalty program
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.progressCard, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.progressTitle, { color: colors.text }]}>
                Crazy, you are at Level 1!
              </Text>
              <Text
                style={[styles.progressText, { color: colors.textSecondary }]}
              >
                Complete 3 more bookings before 10 April 2027 to unlock bigger
                discounts and rewards at Level 2. Every booking counts!
              </Text>
              <View style={styles.progressIconsContainer}>
                <View style={styles.progressIcon}>
                  <View
                    style={[
                      styles.placeholderCircle,
                      {
                        backgroundColor: colors.blue,
                        borderColor: colors.blue,
                      },
                    ]}
                  >
                    <Ionicons name="bed" size={24} color="#FFF" />
                  </View>
                </View>
                <View style={styles.progressIcon}>
                  <View
                    style={[
                      styles.placeholderCircle,
                      {
                        backgroundColor: colors.blue,
                        borderColor: colors.blue,
                      },
                    ]}
                  >
                    <Ionicons name="bed" size={24} color="#FFF" />
                  </View>
                </View>
                <View
                  style={[
                    styles.placeholderCircle,
                    { borderColor: colors.textSecondary },
                  ]}
                >
                  <Text
                    style={[
                      styles.placeholderDots,
                      { color: colors.textSecondary },
                    ]}
                  >
                    ...
                  </Text>
                </View>
                <View
                  style={[
                    styles.placeholderCircle,
                    { borderColor: colors.textSecondary },
                  ]}
                >
                  <Text
                    style={[
                      styles.placeholderDots,
                      { color: colors.textSecondary },
                    ]}
                  >
                    ...
                  </Text>
                </View>
                <View
                  style={[
                    styles.placeholderCircle,
                    { borderColor: colors.textSecondary },
                  ]}
                >
                  <Text
                    style={[
                      styles.placeholderDots,
                      { color: colors.textSecondary },
                    ]}
                  >
                    ...
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={scrollToFaq}>
                <Text style={[styles.progressLink, { color: colors.blue }]}>
                  How to progress in Genius
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.contentSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Book your next trip for less
              </Text>
              <Text
                style={[styles.sectionText, { color: colors.textSecondary }]}
              >
                Enjoy free lifetime access to Genius Level 1 discounts on select
                stays and rental cars worldwide. Discounts are applied to the
                price before taxes and fees.
              </Text>
            </View>
            <View style={styles.contentSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Savings made simple
              </Text>
              <Image
                source={require("../../assets/images/genius2.jpg")} // Using placeholder image
                style={styles.simpleImage}
              />
              <Text
                style={[
                  styles.sectionTextCentered,
                  { color: colors.textSecondary },
                ]}
              >
                You will recognize participating properties and rental cars by
                the blue Genius label. All discounts and rewards are
                automatically applied when you book, you do not have to do a
                thing. So simple, it is Genius.
              </Text>
            </View>
            <View style={styles.contentSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Booking.com is better with Genius
              </Text>
              <Text
                style={[styles.sectionText, { color: colors.textSecondary }]}
              >
                Enjoy a lifetime of discounts and travel rewards on hundreds of
                thousands of stays and rental cars worldwide with Booking.coms
                loyalty program.
              </Text>
            </View>
            <View style={styles.contentSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Genius discounts
              </Text>
              <Text
                style={[styles.sectionText, { color: colors.textSecondary }]}
              >
                Enjoy savings at 850,000 participating properties worldwide and
                save on select rental cars
              </Text>
              <View style={styles.discountCardsContainer}>
                <View
                  style={[
                    styles.discountCard,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <View style={styles.discountIconCircleYellow}>
                    <Ionicons name="star" size={24} color="#FFF" />
                  </View>
                  <View>
                    <Text
                      style={[styles.discountLevelText, { color: colors.text }]}
                    >
                      Level 1
                    </Text>
                    <Text
                      style={[
                        styles.discountInfoText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      10% discounts on stays
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.discountCard,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <View
                    style={[
                      styles.discountIconCircleGray,
                      { backgroundColor: colors.textSecondary },
                    ]}
                  >
                    <Ionicons name="lock-closed" size={24} color="#FFF" />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.lockedLevelText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Level 2
                    </Text>
                    <Text
                      style={[
                        styles.discountInfoText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      10–15% discounts on stays
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.discountCard,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <View
                    style={[
                      styles.discountIconCircleGray,
                      { backgroundColor: colors.textSecondary },
                    ]}
                  >
                    <Ionicons name="lock-closed" size={24} color="#FFF" />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.lockedLevelText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Level 3
                    </Text>
                    <Text
                      style={[
                        styles.discountInfoText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      10–20% discounts on stays
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.contentSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                How it works
              </Text>
              <View style={styles.howItWorksContainer}>
                <View style={styles.howItWorksItem}>
                  <Text
                    style={[styles.howItWorksTitle, { color: colors.text }]}
                  >
                    Easy to find
                  </Text>
                  <Text
                    style={[
                      styles.howItWorksText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Once signed in, look for the blue Genius label to find your
                    travel rewards.
                  </Text>
                </View>
                <View style={styles.howItWorksItem}>
                  <Text
                    style={[styles.howItWorksTitle, { color: colors.text }]}
                  >
                    Easy to keep
                  </Text>
                  <Text
                    style={[
                      styles.howItWorksText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    After unlocking each Genius Level, the rewards are yours to
                    enjoy for life.
                  </Text>
                </View>
                <View style={styles.howItWorksItem}>
                  <Text
                    style={[styles.howItWorksTitle, { color: colors.text }]}
                  >
                    Easy to grow
                  </Text>
                  <Text
                    style={[
                      styles.howItWorksText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    The more you book, the more you get – every booking counts
                    toward your progress.
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.contentSection} ref={faqSectionRef}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Genius FAQs
              </Text>
              <View style={styles.faqsContainer}>
                {faqs.map((faq, index) => (
                  <View
                    key={index}
                    style={[styles.faqCard, { backgroundColor: colors.card }]}
                  >
                    <TouchableOpacity
                      onPress={() => toggleFaq(index)}
                      style={styles.faqHeader}
                    >
                      <Text
                        style={[styles.faqQuestion, { color: colors.text }]}
                      >
                        {faq.question}
                      </Text>
                      {faqOpen === index ? (
                        <Ionicons
                          name="chevron-up-outline"
                          size={20}
                          color={colors.text}
                        />
                      ) : (
                        <Ionicons
                          name="chevron-down-outline"
                          size={20}
                          color={colors.text}
                        />
                      )}
                    </TouchableOpacity>
                    {faqOpen === index && (
                      <View
                        style={[
                          styles.faqAnswerContainer,
                          { backgroundColor: colors.background },
                        ]}
                      >
                        <Text
                          style={[
                            styles.faqAnswer,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {faq.answer}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.rateButtonContainer}>
              <TouchableOpacity
                onPress={() => setOpenRateModal(true)}
                style={[styles.rateButton, { backgroundColor: colors.blue }]}
              >
                <Text style={styles.rateButtonText}>Rate us</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.footerButtonContainer,
                {
                  backgroundColor: colors.background,
                  borderTopColor: colors.textSecondary,
                },
              ]}
            >
              <TouchableOpacity
                onPress={handleFindNextStay}
                style={[styles.footerButton, { backgroundColor: colors.blue }]}
              >
                <Text style={styles.footerButtonText}>Find your next stay</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {openRateModal && (
            <View style={styles.rateModalOverlay}>
              <View
                style={[
                  styles.rateModalCard,
                  {
                    marginTop: insets.top ? insets.top + 20 : 40,
                    backgroundColor: colors.card,
                  },
                ]}
              >
                <View style={styles.rateModalHeader}>
                  <Text style={[styles.rateModalTitle, { color: colors.text }]}>
                    How are we doing?
                  </Text>
                  <TouchableOpacity onPress={() => setOpenRateModal(false)}>
                    <Ionicons
                      name="close-outline"
                      size={24}
                      color={colors.text}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.rateModalPrompt}>
                  <Image
                    source={require("../../assets/images/hotel7.png")}
                    style={styles.rateModalImage}
                  />
                  <Text
                    style={[
                      styles.rateModalPromptText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    The Genius program is relevant to me
                  </Text>
                </View>
                <View style={styles.ratingButtonsContainer}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      onPress={() => handleRateSubmit(rating)}
                      style={[
                        styles.ratingButton,
                        { backgroundColor: colors.background },
                      ]}
                    >
                      <Text
                        style={[
                          styles.ratingButtonText,
                          { color: colors.text },
                        ]}
                      >
                        {rating}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.ratingLabels}>
                  <Text
                    style={[
                      styles.ratingLabelText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Strongly disagree
                  </Text>
                  <Text
                    style={[
                      styles.ratingLabelText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Strongly agree
                  </Text>
                </View>
              </View>
            </View>
          )}
          {openThanksModal && (
            <View style={styles.thanksModalOverlay}>
              <View
                style={[
                  styles.thanksModalCard,
                  {
                    marginTop: insets.top ? insets.top + 20 : 40,
                    backgroundColor: colors.card,
                  },
                ]}
              >
                <Text style={[styles.thanksModalTitle, { color: colors.text }]}>
                  Thank you for submitting!
                </Text>
                <Text
                  style={[
                    styles.thanksModalText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {selectedRating
                    ? `We appreciate your feedback. Your rating: ${selectedRating}`
                    : "We appreciate your feedback."}
                </Text>
                <TouchableOpacity
                  onPress={handleCloseAllModals}
                  style={[
                    styles.thanksModalButton,
                    { backgroundColor: colors.blue },
                  ]}
                >
                  <Text style={styles.thanksModalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Photo Selection Modal */}
      {openPhotoModal && (
        <Modal
          visible={openPhotoModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setOpenPhotoModal(false)}
        >
          <View style={styles.photoModalOverlay}>
            <View
              style={[styles.photoModalCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.photoModalHeader}>
                <Text style={[styles.photoModalTitle, { color: colors.text }]}>
                  Choose Profile Photo
                </Text>
                <TouchableOpacity onPress={() => setOpenPhotoModal(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.photoOptionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.photoOptionButton,
                    { backgroundColor: colors.blue },
                  ]}
                  onPress={() => handlePhotoSelection("camera")}
                >
                  <Ionicons name="camera" size={24} color="#FFFFFF" />
                  <Text style={styles.photoOptionText}>Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.photoOptionButton,
                    { backgroundColor: colors.blue },
                  ]}
                  onPress={() => handlePhotoSelection("gallery")}
                >
                  <Ionicons name="images" size={24} color="#FFFFFF" />
                  <Text style={styles.photoOptionText}>
                    Choose from Gallery
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.photoOptionButton,
                    { backgroundColor: colors.textSecondary },
                  ]}
                  onPress={() => handlePhotoSelection("remove")}
                >
                  <Ionicons name="trash" size={24} color="#FFFFFF" />
                  <Text style={styles.photoOptionText}>Remove Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Not Implemented Modal */}
      {openNotImplementedModal && (
        <Modal
          visible={openNotImplementedModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setOpenNotImplementedModal(false)}
        >
          <View style={styles.photoModalOverlay}>
            <View
              style={[
                styles.notImplementedModalCard,
                { backgroundColor: colors.card },
              ]}
            >
              <View style={styles.notImplementedModalHeader}>
                <Text
                  style={[
                    styles.notImplementedModalTitle,
                    { color: colors.text },
                  ]}
                >
                  Feature Not Available
                </Text>
                <TouchableOpacity
                  onPress={() => setOpenNotImplementedModal(false)}
                >
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.notImplementedModalContent}>
                <Ionicons
                  name="construct-outline"
                  size={64}
                  color={colors.textSecondary}
                  style={{ marginBottom: 16 }}
                />
                <Text
                  style={[
                    styles.notImplementedModalText,
                    { color: colors.textSecondary },
                  ]}
                >
                  This feature is not yet implemented. Please check back in a
                  future update!
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.notImplementedModalButton,
                  { backgroundColor: colors.blue },
                ]}
                onPress={() => setOpenNotImplementedModal(false)}
              >
                <Text style={styles.notImplementedModalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Fragment>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 2,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  geniusLevelBadge: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  geniusLabelText: {
    fontSize: 14,
  },
  geniusLevelText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#121417",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalHeaderTime: {
    color: "#888",
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: height * 0.25,
    justifyContent: "center",
    alignItems: "center",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  heroTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
  geniusTitleContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  geniusTitleText: {
    color: "#FFF",
    fontSize: 48,
    fontWeight: "900",
  },
  geniusSubtitle: {
    color: "#FFF",
    fontSize: 16,
  },
  progressCard: {
    padding: 24,
    borderRadius: 12,
    margin: 16,
  },
  progressTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  progressText: {
    fontSize: 14,
    marginTop: 8,
  },
  progressIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  progressIcon: {
    alignItems: "center",
  },
  progressIconCircle: {
    borderRadius: 50,
    padding: 16,
    marginBottom: 4,
  },
  iconText: {
    fontSize: 12,
    textAlign: "center",
  },
  placeholderCircle: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderRadius: 50,
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderDots: {
    fontSize: 24,
  },
  progressLink: {
    fontWeight: "600",
    fontSize: 14,
  },
  contentSection: {
    padding: 16,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionText: {
    color: "#AAA",
    fontSize: 14,
  },
  sectionTextCentered: {
    color: "#AAA",
    fontSize: 14,
    textAlign: "center",
  },
  simpleImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  discountCardsContainer: {
    flexDirection: "column",
    gap: 16,
  },
  discountCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  discountIconCircleYellow: {
    backgroundColor: "#FFD700",
    borderRadius: 50,
    padding: 8,
  },
  discountIconCircleGray: {
    borderRadius: 50,
    padding: 8,
  },
  discountLevelText: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 14,
  },
  lockedLevelText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  discountInfoText: {
    fontSize: 14,
  },
  howItWorksContainer: {
    flexDirection: "column",
    gap: 24,
    color: "#AAA",
  },
  howItWorksItem: {
    paddingVertical: 8,
  },
  howItWorksTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  howItWorksText: {
    color: "#AAA",
    fontSize: 14,
    marginTop: 4,
  },
  faqsContainer: {
    flexDirection: "column",
    gap: 16,
  },
  faqCard: {
    borderRadius: 8,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  faqQuestion: {
    fontSize: 14,
    flex: 1,
  },
  faqAnswerContainer: {
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  faqAnswer: {
    fontSize: 14,
  },
  rateButtonContainer: {
    padding: 16,
  },
  rateButton: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  rateButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  footerButton: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  footerButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  /* Original modal styles reused for the in-modal overlays */
  rateModalCard: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
  },
  rateModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rateModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rateModalPrompt: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  rateModalImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  rateModalPromptText: {
    fontSize: 14,
  },
  ratingButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  ratingButtonText: {
    fontWeight: "bold",
  },
  ratingLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  ratingLabelText: {
    fontSize: 10,
  },
  thanksModalCard: {
    width: "90%",
    maxWidth: 300,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  thanksModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  thanksModalText: {
    fontSize: 14,
    textAlign: "center",
  },
  thanksModalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
    marginTop: 16,
  },
  thanksModalButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  /* New overlay containers (absolute so they appear immediately above modal content) */
  rateModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 1000,
  },
  thanksModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 1000,
  },
  /* Photo Selection Modal Styles */
  photoModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  photoModalCard: {
    width: "90%",
    maxWidth: 350,
    borderRadius: 12,
    padding: 24,
  },
  photoModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  photoModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  photoOptionsContainer: {
    gap: 16,
  },
  photoOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  photoOptionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  /* Not Implemented Modal Styles */
  notImplementedModalCard: {
    width: "90%",
    maxWidth: 350,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  notImplementedModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  notImplementedModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notImplementedModalContent: {
    alignItems: "center",
    marginBottom: 24,
  },
  notImplementedModalText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  notImplementedModalButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  notImplementedModalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
