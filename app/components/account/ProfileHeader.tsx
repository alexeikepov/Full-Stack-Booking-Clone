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
// To avoid implicit 'any' errors, define types for complex data structures.
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

// Define a placeholder for the colors, as the original import is from a local file.
// In a real application, you would ensure the `Colors` file is available.
const Colors = {
  dark: {
    icon: "#E0E0E0",
    text: "#E0E0E0",
  },
  // Add other necessary colors from the original file
};

export default function ProfileHeader({
  userName = "guest",
  geniusLevel = "Level 1",
  profileImage,
  onMessagesPress,
  onNotificationsPress,
}: ProfileHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openRateModal, setOpenRateModal] = useState<boolean>(false);
  const [openThanksModal, setOpenThanksModal] = useState<boolean>(false);
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
    setSelectedRating(null);
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
        break; // exit once one attempt succeeds
      } catch (err) {
        console.error("Navigation attempt failed:", err);
      }
    }

    // Always close modal after navigation attempt
    setOpenModal(false);
  };

  return (
    <Fragment>
      {/* Pressable header area */}
      <TouchableOpacity
        onPress={() => setOpenModal(true)}
        activeOpacity={0.8}
        style={styles.headerContainer}
      >
        <View style={styles.userInfo}>
          <Image
            source={
              profileImage || require("../../assets/images/place-holder.jpg")
            }
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.userNameText}>Hi, {userName}</Text>
            <View style={styles.geniusLevelBadge}>
              <Text style={styles.geniusLabelText}>Genius </Text>
              <Text style={styles.geniusLevelText}>{geniusLevel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onMessagesPress}>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={Colors.dark.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNotificationsPress}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={Colors.dark.icon}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Main Genius Modal */}
      <Modal
        visible={openModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setOpenModal(false)}
        presentationStyle="fullScreen"
      >
        {/* Use SafeAreaView to prevent content from overlapping with the top bar */}
        <SafeAreaView
          edges={["top", "left", "right"]}
          style={{
            flex: 1,
            backgroundColor: "#121417",
            paddingTop: insets.top,
            position: "relative",
          }}
        >
          {/* Header */}
          <View
            style={[styles.modalHeader, { paddingTop: 0, paddingBottom: 12 }]}
          >
            <TouchableOpacity onPress={() => setOpenModal(false)}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={Colors.dark.text}
              />
            </TouchableOpacity>
            <Text style={styles.modalHeaderText}>Genius loyalty program</Text>
            <Text style={styles.modalHeaderTime}>18:00</Text>
          </View>

          <ScrollView style={styles.scrollView} ref={scrollViewRef}>
            {/* Content Section 1 */}
            <View style={styles.heroSection}>
              <Image
                source={require("../../assets/images/place-holder.jpg")} // Using placeholder image
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

            {/* Progress Section */}
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>
                Crazy, you are at Level 1!
              </Text>
              <Text style={styles.progressText}>
                Complete 3 more bookings before 10 April 2027 to unlock bigger
                discounts and rewards at Level 2. Every booking counts!
              </Text>
              <View style={styles.progressIconsContainer}>
                <View style={styles.progressIcon}>
                  <View style={styles.progressIconCircle}>
                    <Image
                      source={require("../../assets/images/place-holder.jpg")}
                      style={styles.iconImage}
                    />
                  </View>
                  <Text style={styles.iconText}>Bed Icon</Text>
                </View>
                <View style={styles.progressIcon}>
                  <View style={styles.progressIconCircle}>
                    <Image
                      source={require("../../assets/images/place-holder.jpg")}
                      style={styles.iconImage}
                    />
                  </View>
                  <Text style={styles.iconText}>Bed Icon</Text>
                </View>
                <View style={styles.placeholderCircle}>
                  <Text style={styles.placeholderDots}>...</Text>
                </View>
                <View style={styles.placeholderCircle}>
                  <Text style={styles.placeholderDots}>...</Text>
                </View>
                <View style={styles.placeholderCircle}>
                  <Text style={styles.placeholderDots}>...</Text>
                </View>
              </View>
              <TouchableOpacity onPress={scrollToFaq}>
                <Text style={styles.progressLink}>
                  How to progress in Genius
                </Text>
              </TouchableOpacity>
            </View>

            {/* Content Sections */}
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>
                Book your next trip for less
              </Text>
              <Text style={styles.sectionText}>
                Enjoy free lifetime access to Genius Level 1 discounts on select
                stays and rental cars worldwide. Discounts are applied to the
                price before taxes and fees.
              </Text>
            </View>

            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Savings made simple</Text>
              <Image
                source={require("../../assets/images/place-holder.jpg")} // Using placeholder image
                style={styles.simpleImage}
              />
              <Text style={styles.sectionTextCentered}>
                You will recognize participating properties and rental cars by
                the blue Genius label. All discounts and rewards are
                automatically applied when you book, you do not have to do a
                thing. So simple, it is Genius.
              </Text>
            </View>

            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>
                Booking.com is better with Genius
              </Text>
              <Text style={styles.sectionText}>
                Enjoy a lifetime of discounts and travel rewards on hundreds of
                thousands of stays and rental cars worldwide with Booking.coms
                loyalty program.
              </Text>
            </View>

            {/* Discounts Section */}
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Genius discounts</Text>
              <Text style={styles.sectionText}>
                Enjoy savings at 850,000 participating properties worldwide and
                save on select rental cars
              </Text>
              <View style={styles.discountCardsContainer}>
                <View style={styles.discountCard}>
                  <View style={styles.discountIconCircleYellow}>
                    <Ionicons name="star" size={24} color="#FFF" />
                  </View>
                  <View>
                    <Text style={styles.discountLevelText}>Level 1</Text>
                    <Text style={styles.discountInfoText}>
                      10% discounts on stays
                    </Text>
                  </View>
                </View>
                <View style={styles.discountCard}>
                  <View style={styles.discountIconCircleGray}>
                    <Ionicons name="lock-closed" size={24} color="#FFF" />
                  </View>
                  <View>
                    <Text style={styles.lockedLevelText}>Level 2</Text>
                    <Text style={styles.discountInfoText}>
                      10–15% discounts on stays
                    </Text>
                  </View>
                </View>
                <View style={styles.discountCard}>
                  <View style={styles.discountIconCircleGray}>
                    <Ionicons name="lock-closed" size={24} color="#FFF" />
                  </View>
                  <View>
                    <Text style={styles.lockedLevelText}>Level 3</Text>
                    <Text style={styles.discountInfoText}>
                      10–20% discounts on stays
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* How it works section */}
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>How it works</Text>
              <View style={styles.howItWorksContainer}>
                <View style={styles.howItWorksItem}>
                  <Text style={styles.howItWorksTitle}>Easy to find</Text>
                  <Text style={styles.howItWorksText}>
                    Once signed in, look for the blue Genius label to find your
                    travel rewards.
                  </Text>
                </View>
                <View style={styles.howItWorksItem}>
                  <Text style={styles.howItWorksTitle}>Easy to keep</Text>
                  <Text style={styles.howItWorksText}>
                    After unlocking each Genius Level, the rewards are yours to
                    enjoy for life.
                  </Text>
                </View>
                <View style={styles.howItWorksItem}>
                  <Text style={styles.howItWorksTitle}>Easy to grow</Text>
                  <Text style={styles.howItWorksText}>
                    The more you book, the more you get – every booking counts
                    toward your progress.
                  </Text>
                </View>
              </View>
            </View>

            {/* FAQ Section */}
            <View style={styles.contentSection} ref={faqSectionRef}>
              <Text style={styles.sectionTitle}>Genius FAQs</Text>
              <View style={styles.faqsContainer}>
                {faqs.map((faq, index) => (
                  <View key={index} style={styles.faqCard}>
                    <TouchableOpacity
                      onPress={() => toggleFaq(index)}
                      style={styles.faqHeader}
                    >
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                      {faqOpen === index ? (
                        <Ionicons
                          name="chevron-up-outline"
                          size={20}
                          color={Colors.dark.text}
                        />
                      ) : (
                        <Ionicons
                          name="chevron-down-outline"
                          size={20}
                          color={Colors.dark.text}
                        />
                      )}
                    </TouchableOpacity>
                    {faqOpen === index && (
                      <View style={styles.faqAnswerContainer}>
                        <Text style={styles.faqAnswer}>{faq.answer}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Rate Us Button */}
            <View style={styles.rateButtonContainer}>
              <TouchableOpacity
                onPress={() => setOpenRateModal(true)}
                style={styles.rateButton}
              >
                <Text style={styles.rateButtonText}>Rate us</Text>
              </TouchableOpacity>
            </View>

            {/* Find Next Stay Button (footer) */}
            <View style={styles.footerButtonContainer}>
              {/* This button would typically navigate to a new screen. */}
              <TouchableOpacity
                onPress={handleFindNextStay}
                style={styles.footerButton}
              >
                <Text style={styles.footerButtonText}>Find your next stay</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* In-modal Rate overlay (fixes Android nested Modal issue) */}
          {openRateModal && (
            <View style={styles.rateModalOverlay}>
              <View
                style={[
                  styles.rateModalCard,
                  { marginTop: insets.top ? insets.top + 20 : 40 },
                ]}
              >
                <View style={styles.rateModalHeader}>
                  <Text style={styles.rateModalTitle}>How are we doing?</Text>
                  <TouchableOpacity onPress={() => setOpenRateModal(false)}>
                    <Ionicons
                      name="close-outline"
                      size={24}
                      color={Colors.dark.text}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.rateModalPrompt}>
                  <Image
                    source={require("../../assets/images/place-holder.jpg")}
                    style={styles.rateModalImage}
                  />
                  <Text style={styles.rateModalPromptText}>
                    The Genius program is relevant to me
                  </Text>
                </View>
                <View style={styles.ratingButtonsContainer}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      onPress={() => handleRateSubmit(rating)}
                      style={styles.ratingButton}
                    >
                      <Text style={styles.ratingButtonText}>{rating}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.ratingLabels}>
                  <Text style={styles.ratingLabelText}>Strongly disagree</Text>
                  <Text style={styles.ratingLabelText}>Strongly agree</Text>
                </View>
              </View>
            </View>
          )}

          {/* In-modal Thanks overlay (also avoids nested Modal issues) */}
          {openThanksModal && (
            <View style={styles.thanksModalOverlay}>
              <View
                style={[
                  styles.thanksModalCard,
                  { marginTop: insets.top ? insets.top + 20 : 40 },
                ]}
              >
                <Text style={styles.thanksModalTitle}>
                  Thank you for submitting!
                </Text>
                <Text style={styles.thanksModalText}>
                  {selectedRating
                    ? `We appreciate your feedback. Your rating: ${selectedRating}`
                    : "We appreciate your feedback."}
                </Text>
                <TouchableOpacity
                  onPress={handleCloseAllModals}
                  style={styles.thanksModalButton}
                >
                  <Text style={styles.thanksModalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* NOTE: Rate/Thanks are rendered as in-modal overlays above so they appear immediately on press while the Genius modal is open. */}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#121417",
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
    borderColor: "#FFD700",
  },
  userNameText: {
    color: "#E0E0E0",
    fontSize: 18,
    fontWeight: "bold",
  },
  geniusLevelBadge: {
    flexDirection: "row",
    backgroundColor: "#1C1F22",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  geniusLabelText: {
    color: "#E0E0E0",
    fontSize: 14,
  },
  geniusLevelText: {
    color: "#FFD700",
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
    backgroundColor: "#121417",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalHeaderText: {
    color: "#E0E0E0",
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
    backgroundColor: "#1C1F22",
    padding: 24,
    borderRadius: 12,
    margin: 16,
  },
  progressTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  progressText: {
    color: "#AAA",
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
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 50,
    padding: 16,
    marginBottom: 4,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  iconText: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
  },
  placeholderCircle: {
    backgroundColor: "transparent",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 2,
    borderRadius: 50,
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderDots: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 24,
  },
  progressLink: {
    color: "#006CE4",
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
    backgroundColor: "#1C1F22",
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
    backgroundColor: "#888",
    borderRadius: 50,
    padding: 8,
  },
  discountLevelText: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 14,
  },
  lockedLevelText: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 14,
  },
  discountInfoText: {
    color: "#AAA",
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
    backgroundColor: "#1C1F22",
    borderRadius: 8,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  faqQuestion: {
    color: "#FFF",
    fontSize: 14,
    flex: 1,
  },
  faqAnswerContainer: {
    backgroundColor: "#24272B",
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  faqAnswer: {
    color: "#AAA",
    fontSize: 14,
  },
  rateButtonContainer: {
    padding: 16,
  },
  rateButton: {
    backgroundColor: "#006CE4",
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
    borderTopColor: "#333",
    backgroundColor: "#121417",
  },
  footerButton: {
    backgroundColor: "#006CE4",
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
    backgroundColor: "#24272B",
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
    color: "#FFF",
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
    color: "#AAA",
    fontSize: 14,
  },
  ratingButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  ratingButton: {
    flex: 1,
    backgroundColor: "#1C1F22",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  ratingButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  ratingLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  ratingLabelText: {
    color: "#888",
    fontSize: 10,
  },
  thanksModalCard: {
    width: "90%",
    maxWidth: 300,
    backgroundColor: "#24272B",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  thanksModalTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  thanksModalText: {
    color: "#AAA",
    fontSize: 14,
    textAlign: "center",
  },
  thanksModalButton: {
    backgroundColor: "#006CE4",
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
});
