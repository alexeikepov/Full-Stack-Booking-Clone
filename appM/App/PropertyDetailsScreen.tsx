import { StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../hooks/ThemeContext";
import { RootStackParamList } from "../types/navigation";

const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingBottom: 8,
      paddingHorizontal: 16,
      zIndex: 10,
      backgroundColor:
        theme === "dark" ? "rgba(0,0,0,0.7)" : `${colors.blue}E6`, // Using theme blue with opacity
    },
    headerScrolled: {
      backgroundColor: theme === "dark" ? colors.background : colors.blue, // Using theme blue
      justifyContent: "center",
      alignItems: "center",
    },
    propertyNameHeader: {
      fontSize: 18,
      fontWeight: "bold",
      color: "white", // Always white for good contrast against blue background
      textAlign: "center",
      flex: 1,
      marginHorizontal: 60, // Space for buttons on sides
    },
    headerButton: {
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerButtonScrolled: {
      backgroundColor:
        theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
    },
    imageGallery: {
      height: 300,
      backgroundColor: colors.card,
    },
    mainImage: {
      flex: 1,
      position: "relative",
    },
    imageGrid: {
      position: "absolute",
      bottom: 10,
      right: 10,
      flexDirection: "row",
    },
    thumbnailContainer: {
      marginLeft: 5,
      borderRadius: 8,
      overflow: "hidden",
    },
    thumbnail: {
      width: 60,
      height: 80,
      borderRadius: 8,
    },
    moreImagesOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
    },
    moreImagesText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    content: {
      flex: 1,
      backgroundColor: colors.background,
    },
    propertyHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    propertyName: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    ratingRowHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    starBadge: {
      backgroundColor: colors.yellow,
      width: 12,
      height: 12,
      marginRight: 2,
    },
    ratingScore: {
      backgroundColor: colors.blue,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginLeft: 10,
    },
    ratingScoreText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    bookingSection: {
      padding: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    dateRow: {
      flexDirection: "row",
      marginBottom: 16,
    },
    dateColumn: {
      flex: 1,
    },
    dateLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    dateValue: {
      fontSize: 16,
      color: colors.blue,
      fontWeight: "600",
    },
    roomGuestInfo: {
      marginBottom: 16,
    },
    roomGuestText: {
      fontSize: 16,
      color: colors.blue,
      fontWeight: "600",
    },
    noAvailabilityText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    alternativesRow: {
      flexDirection: "row",
    },
    alternativeOption: {
      borderWidth: 1,
      borderColor: colors.blue,
      borderRadius: 8,
      padding: 12,
      marginRight: 10,
      alignItems: "center",
      minWidth: 80,
    },
    alternativeDateRange: {
      fontSize: 12,
      color: colors.blue,
      fontWeight: "600",
      textAlign: "center",
    },
    alternativePrice: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
      textAlign: "center",
    },
    mapSection: {
      height: 200,
      backgroundColor: colors.card,
      marginBottom: 16,
      borderRadius: 8,
      overflow: "hidden",
    },
    mapView: {
      flex: 1,
    },
    mapOverlay: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    addressText: {
      fontSize: 14,
      color: colors.text,
    },
    ratingSection: {
      padding: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    overallRating: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    ratingLabel: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginRight: 10,
    },
    ratingDetails: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    ratingBreakdown: {
      marginTop: 16,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      justifyContent: "space-between",
    },
    ratingCategory: {
      fontSize: 14,
      color: colors.text,
      minWidth: 80,
    },
    ratingBar: {
      flex: 1,
      height: 8,
      backgroundColor: colors.card,
      borderRadius: 4,
      marginHorizontal: 12,
    },
    ratingBarFill: {
      height: "100%",
      backgroundColor: colors.blue,
      borderRadius: 4,
    },
    ratingValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "600",
      minWidth: 30,
      textAlign: "right",
    },
    showMoreButton: {
      marginTop: 16,
    },
    showMoreText: {
      fontSize: 16,
      color: colors.blue,
      fontWeight: "600",
    },
    reviewsSection: {
      padding: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    reviewCard: {
      marginBottom: 16,
    },
    reviewHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    reviewerInitial: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.accent,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    reviewerInitialText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    reviewerName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    reviewerCountry: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 8,
    },
    reviewText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    facilitiesSection: {
      padding: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    facilitiesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    facilityItem: {
      flexDirection: "row",
      alignItems: "center",
      width: "48%",
      marginBottom: 12,
    },
    facilityText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 8,
      flex: 1,
    },
    seeAllFacilitiesText: {
      fontSize: 16,
      color: colors.blue,
      fontWeight: "600",
      marginTop: 8,
    },
    questionsSection: {
      padding: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    questionCard: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    questionText: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 12,
      lineHeight: 20,
    },
    answerCard: {
      backgroundColor: colors.cardSecondary || colors.card,
      borderRadius: 8,
      padding: 12,
      marginTop: 8,
    },
    answerDate: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    answerText: {
      fontSize: 14,
      color: colors.text,
    },
    askQuestionButton: {
      borderWidth: 1,
      borderColor: colors.blue,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
      marginBottom: 12,
    },
    askQuestionText: {
      color: colors.blue,
      fontSize: 16,
      fontWeight: "600",
    },
    replyTimeText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
    },
    descriptionSection: {
      padding: 16,
      backgroundColor: colors.background,
    },
    descriptionText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContainer: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    modalCloseButton: {
      padding: 8,
    },
    modalContent: {
      flex: 1,
      paddingHorizontal: 20,
    },
    modalItem: {
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    modalItemLast: {
      borderBottomWidth: 0,
    },
    readMoreButton: {
      marginTop: 8,
    },
    readMoreText: {
      fontSize: 14,
      color: colors.blue,
      fontWeight: "600",
    },
    // Question Form Modal Styles
    questionFormContainer: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      maxHeight: "85%",
    },
    formInput: {
      borderWidth: 1,
      borderColor: colors.separator,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.card,
      marginBottom: 16,
    },
    formInputMultiline: {
      minHeight: 100,
      textAlignVertical: "top",
    },
    formLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    submitButton: {
      backgroundColor: colors.blue,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 10,
    },
    submitButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    submitButtonDisabled: {
      backgroundColor: colors.textSecondary,
      opacity: 0.5,
    },
    // Image Modal Styles
    imageModalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    imageModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme === "light" ? "white" : "rgba(0, 0, 0, 0.8)",
    },
    imageModalCloseButton: {
      padding: 8,
    },
    imageModalTitle: {
      color: theme === "light" ? colors.text : "white",
      fontSize: 18,
      fontWeight: "600",
      flex: 1,
      textAlign: "center",
      marginRight: 40, // Balance out the close button
    },
    imageModalScrollView: {
      flex: 1,
    },
    imageModalContent: {
      padding: 16,
      paddingBottom: 20,
    },
    fullImageContainer: {
      width: "100%",
      height: 300,
      marginBottom: 16,
      borderRadius: 8,
      overflow: "hidden",
    },
    fullImage: {
      width: "100%",
      height: "100%",
    },
    imageGalleryOverlay: {
      position: "absolute",
      bottom: 12,
      left: 12,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderRadius: 20,
      padding: 8,
    },
  });

type PropertyDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  "PropertyDetailsScreen"
>;

// Mock data for the property (ready for backend integration)
const MOCK_PROPERTY_DATA = {
  id: 1,
  name: "La Viscontina",
  rating: 7.9,
  totalReviews: 5902,
  address: "Via al Ticino 10, 21019 Somma Lombardo, Italy",
  coordinates: {
    latitude: 45.6916,
    longitude: 8.7167,
  },
  images: [
    require("../assets/images/booking-app-image.png"),
    require("../assets/images/place-holder.jpg"),
    require("../assets/images/place-holder.jpg"),
    require("../assets/images/place-holder.jpg"),
    require("../assets/images/place-holder.jpg"),
  ],
  checkIn: "Wed, 24 Sep",
  checkOut: "Thu, 25 Sep",
  rooms: 1,
  adults: 2,
  children: 0,
  isAvailable: false,
  alternatives: [
    { dateRange: "26-27 Sep", price: "from € 81" },
    { dateRange: "27-28 Sep", price: "from € 81" },
    { dateRange: "26-28 Sep", price: "from € 161" },
  ],
  ratings: {
    cleanliness: 8.3,
    comfort: 8.2,
    facilities: 8.0,
    staff: 8.5,
    valueForMoney: 8.1,
    location: 8.7,
    food: 8.4,
    wifi: 7.9,
    service: 8.6,
  },
  facilities: [
    { icon: "ban-smoking", name: "Non-smoking rooms" },
    { icon: "restaurant", name: "Restaurant" },
    { icon: "car", name: "Parking" },
    { icon: "airplane", name: "Airport shuttle" },
    { icon: "wifi", name: "Internet" },
    { icon: "people", name: "Family rooms" },
    { icon: "wine", name: "Bar" },
    { icon: "fitness", name: "Fitness center" },
    { icon: "water", name: "Swimming pool" },
    { icon: "paw", name: "Pet friendly" },
    { icon: "snow", name: "Air conditioning" },
    { icon: "tv", name: "TV" },
    { icon: "café", name: "Room service" },
    { icon: "business", name: "Business center" },
    { icon: "accessibility", name: "Wheelchair accessible" },
    { icon: "checkroom", name: "Luggage storage" },
    { icon: "local-laundry-service", name: "Laundry service" },
    { icon: "spa", name: "Spa services" },
  ],
  reviews: [
    {
      id: 1,
      reviewerName: "Svitlana - Family",
      reviewerInitial: "S",
      country: "Australia",
      text: "The transfer from and to the airport was good. The rooms are clean and big. Compliment to breakfast, we had everything that we usually have for breakfast. Good price for the service",
    },
    {
      id: 2,
      reviewerName: "Marco - Business",
      reviewerInitial: "M",
      country: "Italy",
      text: "Perfect location for business trips to Milan. The shuttle service is reliable and the rooms are comfortable. Staff is very professional and helpful.",
    },
    {
      id: 3,
      reviewerName: "Emma - Couple",
      reviewerInitial: "E",
      country: "Germany",
      text: "Great value for money! The property is well-maintained and the breakfast exceeded our expectations. Would definitely stay here again.",
    },
    {
      id: 4,
      reviewerName: "James - Solo",
      reviewerInitial: "J",
      country: "United Kingdom",
      text: "Clean, comfortable, and convenient. The Wi-Fi was fast and the location is perfect for accessing both the airport and Milan city center.",
    },
    {
      id: 5,
      reviewerName: "Sophie - Family",
      reviewerInitial: "S",
      country: "France",
      text: "Family-friendly hotel with spacious rooms. The kids loved the breakfast selection. Great place to stay before early flights.",
    },
  ],
  questions: [
    {
      id: 1,
      question:
        "Hello, is it possible to pick me up either from Milan central station or from malpensa airport and drop me airport the following morning? How much will it cost?",
      answer: "It is possible only from Malpensa airport and back.",
      answerDate: "28 Jun 2022",
    },
    {
      id: 2,
      question: "What time is breakfast served?",
      answer: "Breakfast is served from 6:30 AM to 10:00 AM daily.",
      answerDate: "15 Aug 2022",
    },
    {
      id: 3,
      question: "Is there free parking available?",
      answer: "Yes, we provide free parking for all guests.",
      answerDate: "2 Sep 2022",
    },
    {
      id: 4,
      question: "Do you allow pets?",
      answer: "Yes, pets are welcome. Additional charges may apply.",
      answerDate: "20 Jul 2022",
    },
    {
      id: 5,
      question: "Is WiFi available throughout the property?",
      answer:
        "Yes, complimentary WiFi is available in all rooms and common areas.",
      answerDate: "5 Oct 2022",
    },
  ],
  description:
    "Located in Somma Lombardo, La Viscontina offers accommodation with a garden and free WiFi. The property is around 3.1 km from Malpensa Airport and 45 km from Milan city center.\n\nThis charming agritourism property features elegantly furnished rooms with modern amenities including air conditioning, flat-screen TV, and private bathroom. Guests can enjoy a delicious continental breakfast featuring local products.\n\nLa Viscontina is surrounded by beautiful countryside and offers easy access to both Milan's cultural attractions and the convenience of Malpensa Airport. The property features a restaurant serving traditional Italian cuisine, a bar, and ample parking space.\n\nThe friendly staff provides excellent service and can assist with airport transfers, restaurant recommendations, and tourist information. Whether you're here for business or leisure, La Viscontina provides the perfect base for exploring the Lombardy region.",
  shortDescription:
    "Located in Somma Lombardo, La Viscontina offers accommodation with a garden and free WiFi. The property is around 3.1 km from Malpensa Airport and 45 km from Milan city center.",
};

export default function PropertyDetailsScreen({
  route,
  navigation,
}: PropertyDetailsScreenProps) {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors, theme);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showFacilitiesModal, setShowFacilitiesModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showAllRatings, setShowAllRatings] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showQuestionFormModal, setShowQuestionFormModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [userName, setUserName] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [questions, setQuestions] = useState(MOCK_PROPERTY_DATA.questions);
  const animationHeight = useState(new Animated.Value(0))[0];

  // Use mock data (ready for backend integration)
  const property = MOCK_PROPERTY_DATA;

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > 300); // 300px is the image gallery height
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? "Removed" : "Saved",
      isSaved
        ? "Property removed from favorites!"
        : "Property saved to favorites!",
    );
  };

  const handleShare = () => {
    Alert.alert("Share", "Share functionality will be implemented.");
  };

  const handleDateChange = () => {
    Alert.alert("Change Dates", "Date selection will open calendar.");
  };

  const handleRoomGuestChange = () => {
    Alert.alert("Rooms & Guests", "Room and guest selection will open.");
  };

  const handleShowMoreRatings = () => {
    setShowAllRatings(!showAllRatings);
  };

  const handleSeeAllFacilities = () => {
    setShowFacilitiesModal(true);
  };

  const handleAskQuestion = () => {
    setShowQuestionFormModal(true);
  };
  const handleSubmitQuestion = () => {
    if (!questionText.trim() || !userName.trim() || !userCountry.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const newQuestion = {
      id: Math.max(...questions.map((q) => q.id)) + 1,
      question: questionText.trim(),
      answer: "", // Will be answered later by property staff
      answerDate: "", // Will be set when answered
    };

    setQuestions([newQuestion, ...questions]);

    // Reset form
    setQuestionText("");
    setUserName("");
    setUserCountry("");
    setShowQuestionFormModal(false);

    Alert.alert(
      "Question Submitted",
      "Your question has been submitted successfully! The property will respond within a few days.",
    );
  };

  const handleCancelQuestion = () => {
    setQuestionText("");
    setUserName("");
    setUserCountry("");
    setShowQuestionFormModal(false);
  };

  const handleSeeAllQuestions = () => {
    setShowAllQuestions(!showAllQuestions);

    Animated.timing(animationHeight, {
      toValue: showAllQuestions ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleShowAllReviews = () => {
    setShowReviewsModal(true);
  };

  const handleReadMore = () => {
    setShowDescriptionModal(true);
  };

  const handleMapPress = () => {
    const { latitude, longitude } = property.coordinates;
    const url = `https://maps.google.com/?q=${latitude},${longitude}`;
    Alert.alert(
      "Open in Maps",
      "Would you like to open this location in your maps app?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open", onPress: () => console.log(`Opening: ${url}`) },
      ],
    );
  };

  const handleImagePress = () => {
    setShowImageModal(true);
  };

  const renderImageGallery = () => (
    <TouchableOpacity style={styles.imageGallery} onPress={handleImagePress}>
      <Image
        source={property.images[0]}
        style={styles.mainImage}
        resizeMode="cover"
      />
      <View style={styles.imageGrid}>
        {property.images.slice(1, 4).map((image, index) => (
          <View key={index} style={styles.thumbnailContainer}>
            <Image source={image} style={styles.thumbnail} resizeMode="cover" />
          </View>
        ))}
        <View style={styles.thumbnailContainer}>
          <Image
            source={property.images[4]}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.moreImagesOverlay}>
            <Text style={styles.moreImagesText}>+...</Text>
          </View>
        </View>
      </View>
      {/* Image gallery click indicator */}
      <View style={styles.imageGalleryOverlay}>
        <Ionicons name="images-outline" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );

  const renderPropertyHeader = () => (
    <View style={styles.propertyHeader}>
      <Text style={styles.propertyName}>{property.name}</Text>
      <View style={styles.ratingRowHeader}>
        {[...Array(3)].map((_, index) => (
          <View key={index} style={styles.starBadge} />
        ))}
        <View style={styles.ratingScore}>
          <Text style={styles.ratingScoreText}>{property.rating}</Text>
        </View>
      </View>
    </View>
  );

  const renderBookingSection = () => (
    <View style={styles.bookingSection}>
      <View style={styles.dateRow}>
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>Check-in</Text>
          <TouchableOpacity onPress={handleDateChange}>
            <Text style={styles.dateValue}>{property.checkIn}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>Check-out</Text>
          <TouchableOpacity onPress={handleDateChange}>
            <Text style={styles.dateValue}>{property.checkOut}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.roomGuestInfo}
        onPress={handleRoomGuestChange}
      >
        <Text style={styles.roomGuestText}>
          {property.rooms} room • {property.adults} adults •{" "}
          {property.children ? `${property.children} children` : "No children"}
        </Text>
      </TouchableOpacity>

      {!property.isAvailable && (
        <>
          <Text style={styles.noAvailabilityText}>
            No options available for these dates. Here are some alternatives
            with availability:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.alternativesRow}>
              {property.alternatives.map((alternative, index) => (
                <TouchableOpacity key={index} style={styles.alternativeOption}>
                  <Text style={styles.alternativeDateRange}>
                    {alternative.dateRange}
                  </Text>
                  <Text style={styles.alternativePrice}>
                    {alternative.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );

  const renderMapSection = () => (
    <TouchableOpacity style={styles.mapSection} onPress={handleMapPress}>
      <MapView
        style={styles.mapView}
        initialRegion={{
          latitude: property.coordinates.latitude,
          longitude: property.coordinates.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        pointerEvents="none"
      >
        <Marker
          coordinate={{
            latitude: property.coordinates.latitude,
            longitude: property.coordinates.longitude,
          }}
          title={property.name}
          description={property.address}
        />
      </MapView>
      <View style={styles.mapOverlay}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="location-outline" size={16} color={colors.text} />
          <Text style={styles.addressText}>{property.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRatingsSection = () => (
    <View style={styles.ratingSection}>
      <View style={styles.overallRating}>
        <View style={styles.ratingScore}>
          <Text style={styles.ratingScoreText}>{property.rating}</Text>
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.ratingLabel}>Good</Text>
          <Text style={styles.ratingDetails}>
            See {property.totalReviews.toLocaleString()} detailed reviews
          </Text>
        </View>
        <TouchableOpacity style={{ marginLeft: "auto" }}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.ratingBreakdown}>
        {Object.entries(property.ratings)
          .slice(0, showAllRatings ? Object.keys(property.ratings).length : 3)
          .map(([category, rating]) => (
            <View key={category} style={styles.ratingRow}>
              <Text style={styles.ratingCategory}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <View style={styles.ratingBar}>
                <View
                  style={[
                    styles.ratingBarFill,
                    { width: `${(rating / 10) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.ratingValue}>{rating}</Text>
            </View>
          ))}
      </View>

      {Object.keys(property.ratings).length > 3 && (
        <TouchableOpacity
          onPress={handleShowMoreRatings}
          style={styles.showMoreButton}
        >
          <Text style={styles.showMoreText}>
            {showAllRatings ? "Show less" : "Show more"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderReviewsSection = () => (
    <View style={styles.reviewsSection}>
      <Text style={styles.sectionTitle}>Guests who stayed here loved</Text>
      {property.reviews.slice(0, 2).map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewerInitial}>
              <Text style={styles.reviewerInitialText}>
                {review.reviewerInitial}
              </Text>
            </View>
            <View>
              <Text style={styles.reviewerName}>{review.reviewerName}</Text>
              <Text style={styles.reviewerCountry}>
                {review.country === "Australia" && "🇦🇺"}
                {review.country === "Italy" && "🇮🇹"}
                {review.country === "Germany" && "🇩🇪"}
                {review.country === "United Kingdom" && "🇬🇧"}
                {review.country === "France" && "🇫🇷"} {review.country}
              </Text>
            </View>
          </View>
          <Text style={styles.reviewText}>{review.text}</Text>
        </View>
      ))}
      <TouchableOpacity
        onPress={handleShowAllReviews}
        style={styles.showMoreButton}
      >
        <Text style={styles.showMoreText}>See detailed reviews</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFacilitiesSection = () => (
    <View style={styles.facilitiesSection}>
      <Text style={styles.sectionTitle}>Most Popular Facilities</Text>
      <View style={styles.facilitiesGrid}>
        {property.facilities.map((facility, index) => (
          <View key={index} style={styles.facilityItem}>
            <Ionicons
              name={facility.icon as any}
              size={20}
              color={colors.text}
            />
            <Text style={styles.facilityText}>{facility.name}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={handleSeeAllFacilities}>
        <Text style={styles.seeAllFacilitiesText}>See all facilities</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuestionsSection = () => {
    // Show only first question by default
    const displayQuestions = showAllQuestions
      ? questions
      : questions.slice(0, 1);

    return (
      <View style={styles.questionsSection}>
        <Text style={styles.sectionTitle}>Travelers are asking</Text>

        {/* Always show first question */}
        {displayQuestions.map((q) => (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.questionText}>💬 {q.question}</Text>
            {q.answer ? (
              <View style={styles.answerCard}>
                <Text style={styles.answerDate}>{q.answerDate}</Text>
                <Text style={styles.answerText}>{q.answer}</Text>
              </View>
            ) : (
              <Text style={styles.answerDate}>
                Pending response from property
              </Text>
            )}
          </View>
        ))}

        {/* Animated container for additional questions */}
        {questions.length > 1 && (
          <Animated.View
            style={{
              overflow: "hidden",
              maxHeight: animationHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, (questions.length - 1) * 150],
              }),
            }}
          >
            {questions.slice(1).map((q) => (
              <View key={q.id} style={styles.questionCard}>
                <Text style={styles.questionText}>💬 {q.question}</Text>
                {q.answer ? (
                  <View style={styles.answerCard}>
                    <Text style={styles.answerDate}>{q.answerDate}</Text>
                    <Text style={styles.answerText}>{q.answer}</Text>
                  </View>
                ) : (
                  <Text style={styles.answerDate}>
                    Pending response from property
                  </Text>
                )}
              </View>
            ))}
          </Animated.View>
        )}

        {questions.length > 1 && (
          <TouchableOpacity onPress={handleSeeAllQuestions}>
            <Text style={styles.showMoreText}>
              {showAllQuestions
                ? `Show less`
                : `See all ${questions.length} questions`}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.askQuestionButton}
          onPress={handleAskQuestion}
        >
          <Text style={styles.askQuestionText}>Ask a question</Text>
        </TouchableOpacity>

        <Text style={styles.replyTimeText}>
          This property usually replies within a few days
        </Text>
      </View>
    );
  };

  const renderDescriptionSection = () => (
    <View style={styles.descriptionSection}>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.descriptionText}>{property.shortDescription}</Text>
      <TouchableOpacity onPress={handleReadMore} style={styles.readMoreButton}>
        <Text style={styles.readMoreText}>Read more</Text>
      </TouchableOpacity>
    </View>
  );

  // Modal Components
  const renderReviewsModal = () => (
    <Modal
      visible={showReviewsModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowReviewsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Guest Reviews</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowReviewsModal(false)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={property.reviews}
            keyExtractor={(item) => item.id.toString()}
            style={styles.modalContent}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.modalItem,
                  index === property.reviews.length - 1 && styles.modalItemLast,
                ]}
              >
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInitial}>
                    <Text style={styles.reviewerInitialText}>
                      {item.reviewerInitial}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.reviewerName}>{item.reviewerName}</Text>
                    <Text style={styles.reviewerCountry}>
                      {item.country === "Australia" && "🇦🇺"}
                      {item.country === "Italy" && "🇮🇹"}
                      {item.country === "Germany" && "🇩🇪"}
                      {item.country === "United Kingdom" && "🇬🇧"}
                      {item.country === "France" && "🇫🇷"} {item.country}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{item.text}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderFacilitiesModal = () => (
    <Modal
      visible={showFacilitiesModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFacilitiesModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>All Facilities</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowFacilitiesModal(false)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={property.facilities}
            keyExtractor={(item, index) => index.toString()}
            style={styles.modalContent}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.modalItem,
                  index === property.facilities.length - 1 &&
                    styles.modalItemLast,
                ]}
              >
                <View style={styles.facilityItem}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={colors.text}
                  />
                  <Text style={styles.facilityText}>{item.name}</Text>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderDescriptionModal = () => (
    <Modal
      visible={showDescriptionModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDescriptionModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Property Description</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDescriptionModal(false)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalItem}>
              <Text style={styles.descriptionText}>{property.description}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderImageModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={showImageModal}
      onRequestClose={() => setShowImageModal(false)}
    >
      <SafeAreaView style={styles.imageModalContainer}>
        <View style={styles.imageModalHeader}>
          <TouchableOpacity
            style={styles.imageModalCloseButton}
            onPress={() => setShowImageModal(false)}
          >
            <Ionicons
              name="close"
              size={24}
              color={theme === "light" ? colors.text : "white"}
            />
          </TouchableOpacity>
          <Text style={styles.imageModalTitle}>Property Images</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.imageModalScrollView}
          contentContainerStyle={styles.imageModalContent}
        >
          {property.images.map((image, index) => (
            <View key={index} style={styles.fullImageContainer}>
              <Image
                source={image}
                style={styles.fullImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderQuestionFormModal = () => {
    const isFormValid =
      questionText.trim() && userName.trim() && userCountry.trim();

    return (
      <Modal
        visible={showQuestionFormModal}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flex: 1, padding: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}
              >
                Ask a Question
              </Text>
              <TouchableOpacity onPress={handleCancelQuestion}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.formLabel}>Your Question *</Text>
              <TextInput
                style={[styles.formInput, styles.formInputMultiline]}
                placeholder="What would you like to know about this property?"
                placeholderTextColor={colors.textSecondary}
                value={questionText}
                onChangeText={setQuestionText}
                multiline={true}
                numberOfLines={4}
              />

              <Text style={styles.formLabel}>Your Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
                value={userName}
                onChangeText={setUserName}
              />

              <Text style={styles.formLabel}>Your Country *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your country"
                placeholderTextColor={colors.textSecondary}
                value={userCountry}
                onChangeText={setUserCountry}
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !isFormValid && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitQuestion}
                disabled={!isFormValid}
              >
                <Text style={styles.submitButtonText}>Submit Question</Text>
              </TouchableOpacity>

              <View style={{ marginTop: 16 }}>
                <Text style={styles.replyTimeText}>
                  This property usually replies within a few days
                </Text>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Fixed Header */}
      <View style={[styles.header, isScrolled && styles.headerScrolled]}>
        <TouchableOpacity
          style={[
            styles.headerButton,
            isScrolled && styles.headerButtonScrolled,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {isScrolled && (
          <Text style={styles.propertyNameHeader}>{property.name}</Text>
        )}

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[
              styles.headerButton,
              isScrolled && styles.headerButtonScrolled,
            ]}
            onPress={handleSave}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={24}
              color={isSaved ? "#FF0000" : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.headerButton,
              { marginLeft: 8 },
              isScrolled && styles.headerButtonScrolled,
            ]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {renderImageGallery()}
        {renderPropertyHeader()}
        {renderBookingSection()}
        {renderMapSection()}
        {renderRatingsSection()}
        {renderReviewsSection()}
        {renderFacilitiesSection()}
        {renderQuestionsSection()}
        {renderDescriptionSection()}
      </ScrollView>

      {/* Modals */}
      {renderImageModal()}
      {renderReviewsModal()}
      {renderFacilitiesModal()}

      {renderDescriptionModal()}
      {renderQuestionFormModal()}
    </View>
  );
}
