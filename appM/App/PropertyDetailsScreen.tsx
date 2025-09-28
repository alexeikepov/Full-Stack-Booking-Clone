import { StackScreenProps } from "@react-navigation/stack";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MapModal from "../components/MapModal";
import { useBookings } from "../hooks/BookingsContext";
import { useSavedProperties } from "../hooks/SavedPropertiesContext";
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
      width: "100%",
      height: "100%",
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
    // Flexible date selection styles
    flexibleSectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 24,
      marginBottom: 8,
    },
    flexibleSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    durationRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    durationButton: {
      flex: 1,
      paddingVertical: 12,
      marginHorizontal: 4,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.separator,
      alignItems: "center",
    },
    durationButtonActive: {
      backgroundColor: colors.button,
      borderColor: colors.button,
    },
    durationButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "normal",
    },
    durationButtonTextActive: {
      color: colors.background,
      fontWeight: "normal",
    },
    monthsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    monthButton: {
      flex: 1,
      paddingVertical: 12,
      marginHorizontal: 4,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.separator,
      alignItems: "center",
    },
    monthButtonActive: {
      backgroundColor: colors.button,
      borderColor: colors.button,
    },
    monthButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "normal",
    },
    monthButtonTextActive: {
      color: colors.background,
      fontWeight: "bold",
    },
    monthButtonYear: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 2,
    },
    flexibleResult: {
      marginTop: 16,
      alignItems: "center",
      padding: 12,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.separator,
    },
    flexibleResultText: {
      fontSize: 16,
      color: colors.text,
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
      marginTop: 8,
    },
    reviewsSummaryModalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    reviewsSummaryHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    reviewsSummaryTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      flex: 1,
      textAlign: "center",
    },
    reviewsSummaryCloseButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.card,
    },
    reviewsSummaryStats: {
      padding: 20,
      alignItems: "center",
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 12,
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    reviewsSummaryRating: {
      fontSize: 48,
      fontWeight: "bold",
      color: colors.blue,
      marginBottom: 8,
    },
    reviewsSummaryRatingText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    reviewsSummaryCount: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    reviewsSummaryBars: {
      width: "100%",
      marginTop: 8,
    },
    reviewsSummaryBarRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    reviewsSummaryBarLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      minWidth: 80,
    },
    reviewsSummaryBar: {
      flex: 1,
      height: 6,
      backgroundColor: colors.separator,
      borderRadius: 3,
      marginHorizontal: 12,
      overflow: "hidden",
    },
    reviewsSummaryBarFill: {
      height: "100%",
      backgroundColor: colors.blue,
      borderRadius: 3,
    },
    reviewsSummaryBarValue: {
      fontSize: 12,
      color: colors.text,
      fontWeight: "600",
      minWidth: 30,
      textAlign: "right",
    },
    reviewsSummaryContent: {
      flex: 1,
      paddingHorizontal: 16,
    },
    reviewsSummaryListTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginVertical: 16,
    },
    reviewsSummaryCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    reviewsSummaryCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    reviewsSummaryAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.blue,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    reviewsSummaryAvatarText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    reviewsSummaryReviewerInfo: {
      flex: 1,
    },
    reviewsSummaryReviewerName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    reviewsSummaryReviewerCountry: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    reviewsSummaryReviewText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },

    // Fixed Book Now Button Styles
    fixedBookingButton: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingVertical: 15,
      paddingBottom: 30,
      borderTopWidth: 1,
      borderTopColor: colors.separator,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    bookNowButton: {
      backgroundColor: colors.button,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.button,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    bookNowButtonText: {
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "bold",
      letterSpacing: 0.5,
    },

    // Booking Summary Modal Styles
    bookingSummaryContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    bookingSummaryHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    bookingSummaryTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    bookingSummaryCloseButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.card,
    },
    bookingSummaryContent: {
      flex: 1,
      paddingHorizontal: 20,
    },

    // Property Summary Section
    propertySummarySection: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    propertyImageSummary: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 12,
    },
    propertyNameSummary: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    propertyAddressSummary: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    propertyRatingSummary: {
      flexDirection: "row",
      alignItems: "center",
    },
    ratingSummaryBadge: {
      backgroundColor: colors.green,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginRight: 8,
    },
    ratingSummaryText: {
      color: colors.background,
      fontSize: 12,
      fontWeight: "bold",
    },

    // Booking Details Section
    bookingDetailsSection: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    bookingDetailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    bookingDetailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    sectionTitleBooking: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    priceSummarySection: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 6,
    },
    priceLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    priceValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
    totalPriceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.separator,
      marginTop: 8,
    },
    totalPriceLabel: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    totalPriceValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.green,
    },

    // Confirm Booking Button
    confirmBookingButton: {
      backgroundColor: colors.blue,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      shadowColor: colors.blue,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    confirmBookingButtonText: {
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "bold",
      letterSpacing: 0.5,
    },

    // Payment Confirmation Modal Styles
    paymentConfirmationContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    successIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.green,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    successTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
      marginBottom: 12,
    },
    successMessage: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 32,
    },
    bookingReference: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 32,
      width: "100%",
    },
    referenceLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    referenceNumber: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
    },
    doneButton: {
      backgroundColor: colors.button,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 8,
      alignItems: "center",
    },
    doneButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
    // --- Restored minimal styles referenced across the file ---
    imageGalleryOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    descriptionSection: {
      padding: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    descriptionText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    readMoreButton: {
      marginTop: 8,
    },
    readMoreText: {
      color: colors.blue,
      fontWeight: "600",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "90%",
      maxWidth: 520,
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
    },
    monthHeader: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 15,
    },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    calendarDayHeader: {
      width: "14%",
      textAlign: "center",
      color: colors.textSecondary,
      marginBottom: 10,
      fontSize: 14,
      fontWeight: "600",
    },
    calendarDay: {
      width: "14%",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      minHeight: 40,
      borderRadius: 20,
    },
    selectedDay: {
      backgroundColor: colors.button,
    },
    selectedDayText: {
      color: colors.background,
      fontWeight: "bold",
    },
    rangeDay: {
      backgroundColor: `${colors.button}20`,
    },
    rangeDayText: {
      color: colors.button,
    },
    calendarDayText: {
      color: colors.text,
      fontSize: 16,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
      marginBottom: 12,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    modalCloseButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.card,
    },
    modalContent: {
      maxHeight: 400,
    },
    modalItem: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    modalItemLast: {
      borderBottomWidth: 0,
    },
    datesModalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      margin: 12,
    },
    datesPlaceholder: {
      alignItems: "center",
      padding: 24,
      borderRadius: 8,
      backgroundColor: colors.card,
    },
    datesPlaceholderTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginTop: 12,
    },
    datesPlaceholderText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: "center",
    },
    tempDateButton: {
      marginTop: 12,
      paddingVertical: 10,
      paddingHorizontal: 14,
      backgroundColor: colors.button,
      borderRadius: 8,
    },
    tempDateButtonText: {
      color: "white",
      fontWeight: "600",
    },
    imageModalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    imageModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,
    },
    imageModalCloseButton: {
      padding: 8,
    },
    imageModalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    imageModalScrollView: {
      flex: 1,
    },
    imageModalContent: {
      padding: 16,
      alignItems: "center",
    },
    fullImageContainer: {
      marginBottom: 16,
      width: "100%",
    },
    fullImage: {
      width: "100%",
      height: 300,
      borderRadius: 8,
    },
    formLabel: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 6,
    },
    formInput: {
      borderWidth: 1,
      borderColor: colors.separator,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 12,
      backgroundColor: colors.card,
      color: colors.text,
    },
    formInputMultiline: {
      height: 100,
      textAlignVertical: "top",
    },
    submitButton: {
      backgroundColor: colors.button,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: "white",
      fontWeight: "600",
      fontSize: 16,
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
  images: [require("../assets/images/hotel7.png")],
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

export default function PropertyDetailsScreen(
  props: PropertyDetailsScreenProps,
) {
  // Helper: resolve facility icon name to a valid icon component + name
  // Some facility names originate from Material / Google icons and don't map
  // 1:1 to Ionicons. To avoid runtime warnings we map known problematic names
  // to a specific icon family and name.
  const ICON_MAP: Record<string, { family: "ion" | "material"; name: string }> =
    {
      // Problematic / non-ionicons names -> Material icon equivalents
      "ban-smoking": { family: "material", name: "smoke-free" },
      café: { family: "material", name: "local-cafe" },
      checkroom: { family: "material", name: "checkroom" },
      "local-laundry-service": {
        family: "material",
        name: "local-laundry-service",
      },
      spa: { family: "material", name: "spa" },
      // Fallbacks for other names that are likely material icons
      restaurant: { family: "material", name: "restaurant" },
      car: { family: "material", name: "directions-car" },
      airplane: { family: "material", name: "flight" },
      wifi: { family: "material", name: "wifi" },
      people: { family: "material", name: "people" },
      wine: { family: "material", name: "local-bar" },
      fitness: { family: "material", name: "fitness-center" },
      water: { family: "material", name: "pool" },
      paw: { family: "material", name: "pets" },
      snow: { family: "material", name: "ac-unit" },
      tv: { family: "material", name: "tv" },
    };

  const resolveIcon = (iconName: string) => {
    const mapped = ICON_MAP[iconName];
    if (mapped) return mapped;
    // If the name looks like an Ionicons name (simple words), prefer Ionicons
    // otherwise fall back to MaterialIcons using the same name.
    const ionLike = /^[a-z0-9-]+$/i.test(iconName);
    return ionLike
      ? { family: "ion", name: iconName }
      : { family: "material", name: iconName };
  };
  // Restore missing state and handlers for payment modal and card form
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] =
    useState(false);
  // Cached random fallback price so a randomly chosen price stays stable
  // across re-renders and interactions.
  const randomPriceFallbackRef = useRef<number | null>(null);
  // Store the last generated confirmation code so the confirmation modal can show it
  const [lastConfirmationCode, setLastConfirmationCode] = useState<
    string | null
  >(null);
  // Collapsible payment details
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardErrors, setCardErrors] = useState<string[]>([]);
  const [cardSubmittedSuccess, setCardSubmittedSuccess] = useState(false);
  const [cardSubmitting, setCardSubmitting] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const closePaymentModal = () => {
    setShowPaymentMethodModal(false);
    setCardErrors([]);
  };
  const handleSubmitCard = async () => {
    // Start loading
    setCardSubmitting(true);
    try {
      // Artificial delay to simulate processing (2 seconds)
      await new Promise((res) => setTimeout(res, 2000));

      const errors: string[] = [];
      const cleanNumber = cardNumber.replace(/\s+/g, "").trim();
      if (!/^\d{13,19}$/.test(cleanNumber))
        errors.push("Enter a valid card number");
      // Require cardholder name to have at least two words (first and last name)
      const nameParts = cardName.trim().split(/\s+/);
      if (!cardName.trim() || nameParts.length < 2) {
        errors.push("Enter cardholder name with both first and last name");
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry))
        errors.push("Expiry must be MM/YY");
      if (!/^\d{3,4}$/.test(cardCvv)) errors.push("Enter a valid CVV");
      setCardErrors(errors);
      if (errors.length === 0) {
        setShowPaymentDetails(false);
        setCardSubmittedSuccess(true);
      }
    } finally {
      // Stop loading regardless of validation outcome
      setCardSubmitting(false);
    }
  };

  const handleConfirmBooking = async () => {
    setBookingSubmitting(true);
    try {
      // simulate processing delay
      await new Promise((res) => setTimeout(res, 2000));

      // Check for missing fields
      const missing: string[] = [];
      if (!selectedDates.checkIn || !selectedDates.checkOut)
        missing.push("dates");
      if (!selectedGuests.rooms || !selectedGuests.adults)
        missing.push("guests");
      // Payment method: require cardSubmittedSuccess
      if (!cardSubmittedSuccess) missing.push("payment method");

      if (missing.length === 0) {
        // Create booking object and add to bookings context
        try {
          const bookingId = Math.random().toString(36).slice(2, 9);
          const nights =
            selectedDates.checkIn && selectedDates.checkOut
              ? Math.ceil(
                  (selectedDates.checkOut.getTime() -
                    selectedDates.checkIn.getTime()) /
                    (1000 * 60 * 60 * 24),
                )
              : 1;
          const pricePerNight =
            bookingPriceOverride != null
              ? bookingPriceOverride
              : property?.pricePerNight
                ? Number(property.pricePerNight)
                : 100;
          const subtotal = pricePerNight * nights * selectedGuests.rooms;
          const taxes = Math.round(subtotal * 0.12);
          const total = subtotal + taxes;

          const confirmationCode = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

          const newBooking = {
            id: bookingId,
            propertyName: property.name || String(propertyId),
            dates:
              selectedDates.checkIn && selectedDates.checkOut
                ? `${selectedDates.checkIn.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })} - ${selectedDates.checkOut.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`
                : "Dates not set",
            price: `€${total}`,
            status: "Confirmed",
            location: property.address || "",
            details: {
              confirmationNumber: confirmationCode,
              pin: Math.floor(1000 + Math.random() * 9000).toString(),
              checkIn: selectedDates.checkIn
                ? selectedDates.checkIn.toISOString()
                : "",
              checkOut: selectedDates.checkOut
                ? selectedDates.checkOut.toISOString()
                : "",
              address: property.address || "",
              roomType: property.details?.roomType || "Standard",
              includedExtras: property.details?.includedExtras || "",
              breakfastIncluded: property.details?.breakfastIncluded || false,
              nonRefundable: property.details?.nonRefundable || false,
              totalPrice: `€${total}`,
              shareOptions: [],
              contactNumber: property.details?.contactNumber || "",
            },
          } as any;

          addBooking(newBooking);
          setLastConfirmationCode(confirmationCode);
        } catch (e) {
          console.warn("Failed to add booking:", e);
        }

        setShowBookingSummaryModal(false);
        setBookingPriceOverride(null);
        setBookingAltDateRange(null);
        setShowPaymentConfirmationModal(true);
        setConfirmBookingError("");
      } else {
        setConfirmBookingError(
          `**Please select: ${missing
            .map((m) => m.charAt(0).toUpperCase() + m.slice(1))
            .join(" & ")}`,
        );
      }
    } finally {
      setBookingSubmitting(false);
    }
  };
  // Restore missing booking price override state
  // Restore missing renderPaymentConfirmationModal function
  function renderPaymentConfirmationModal(): React.ReactNode {
    if (!showPaymentConfirmationModal) return null;
    // Use the confirmation code generated at booking time, fall back to a
    // random code only if not available.
    const confirmationCode =
      lastConfirmationCode ||
      Math.random().toString(36).substring(2, 8).toUpperCase();
    return (
      <Modal
        visible={showPaymentConfirmationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentConfirmationModal(false)}
      >
        <View
          style={{
            ...styles.modalOverlay,
            backgroundColor:
              theme === "light" ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              ...styles.modalContainer,
              backgroundColor:
                theme === "light" ? colors.background : colors.card,
              borderRadius: 24,
              padding: 32,
              shadowColor: theme === "light" ? "#000" : "#222",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 8,
              alignItems: "center",
              minWidth: 320,
              maxWidth: 400,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Ionicons
                name="checkmark-circle"
                size={56}
                color={colors.button}
                style={{ marginBottom: 8 }}
              />
              <Text
                style={{
                  ...styles.modalTitle,
                  color: colors.button,
                  fontSize: 24,
                  fontWeight: "bold",
                  marginBottom: 4,
                  textAlign: "center",
                }}
              >
                Payment Confirmed!
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  marginVertical: 8,
                  textAlign: "center",
                }}
              >
                Your booking has been confirmed and payment processed!{"\n"}We
                are waiting for your arrival!
              </Text>
            </View>
            <View
              style={{
                backgroundColor:
                  theme === "light"
                    ? `${colors.button}10`
                    : `${colors.button}30`,
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 24,
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  marginBottom: 2,
                }}
              >
                Confirmation Code
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  letterSpacing: 2,
                  color: colors.button,
                  textAlign: "center",
                }}
              >
                {confirmationCode}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                ...styles.confirmBookingButton,
                backgroundColor: colors.button,
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 32,
                marginTop: 8,
                shadowColor: colors.button,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 4,
                elevation: 2,
              }}
              onPress={() => {
                setShowPaymentConfirmationModal(false);
                // After closing the confirmation modal, navigate to Bookings
                // and show the Active tab so the new booking is visible.
                navigation.navigate("MainTabs", {
                  screen: "Bookings",
                  params: { initialTab: "Active" },
                } as any);
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                show My Bookings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  // Support two usage modes:
  // 1) rendered as a screen via React Navigation -> props contains `route` and `navigation`
  // 2) rendered inline by other components (e.g. BookingsScreen) -> props may contain
  //    `propertyData`, `onBack`, `onRebook` instead. Provide safe fallbacks so the
  //    component doesn't crash when `route` is undefined.
  const _props: any = props as any;
  const route = _props.route ?? {
    params: _props.propertyData ? { propertyData: _props.propertyData } : {},
  };
  const navigation = _props.navigation ?? {
    navigate: (name: string, params?: any) => {
      // Map some common navigation calls back to inline handlers when available
      if (name === "Search" && typeof _props.onRebook === "function") {
        return _props.onRebook();
      }
      if (name === "MainTabs" && typeof _props.onBack === "function") {
        return _props.onBack();
      }
      // noop fallback
      return undefined;
    },
  };
  // Flexible date selection state
  const [flexibleDuration, setFlexibleDuration] = useState("weekend");
  const [flexibleMonth, setFlexibleMonth] = useState("Sep");
  const [showExpandedFacilities, setShowExpandedFacilities] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showQuestionFormModal, setShowQuestionFormModal] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [userName, setUserName] = useState("");
  const [userCountry, setUserCountry] = useState("");
  // Fix: Define missing state variables and handlers
  // Error state for confirm booking
  const [confirmBookingError, setConfirmBookingError] = useState("");
  // Map modal state to show full-screen in-app map
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({ checkIn: null, checkOut: null });
  const [selectedGuests, setSelectedGuests] = useState<{
    rooms: number;
    adults: number;
    children: number;
  }>({ rooms: 1, adults: 2, children: 0 });
  const [showBookingSummaryModal, setShowBookingSummaryModal] = useState(false);
  // Optional price override when opening the booking modal from an alternative
  // (so the modal shows the alternative's price immediately).
  const [bookingPriceOverride, setBookingPriceOverride] = useState<
    number | null
  >(null);
  // Store the original alternative date-range string (e.g. "Aug 10 - Aug 12")
  // so we can display it in the booking summary when the user opened the
  // modal from an alternative but we don't have selectedDates populated yet.
  const [bookingAltDateRange, setBookingAltDateRange] = useState<string | null>(
    null,
  );
  // Removed unused state variables and handlers
  const [facilitiesAnimationHeight] = useState(new Animated.Value(0));
  const [animationHeight] = useState(new Animated.Value(0));
  const [reviewsAnimationHeight] = useState(new Animated.Value(0));
  const [descriptionAnimationHeight] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState<string>("calendar");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  // Remove local isSaved state, use context instead
  const [showAllRatings, setShowAllRatings] = useState<boolean>(false);
  // Track keyboard state globally for modals
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  React.useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardOpen(true),
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardOpen(false),
    );

    // If navigation provided dates/guests through params, initialize local state
    try {
      const navData =
        (props &&
          (props as any).route &&
          (props as any).route.params &&
          (props as any).route.params.propertyData) ||
        null;
      if (navData) {
        if (navData.dates) {
          // dates may already be Date objects or string; attempt to coerce
          const cd = navData.dates.checkIn
            ? new Date(navData.dates.checkIn)
            : null;
          const co = navData.dates.checkOut
            ? new Date(navData.dates.checkOut)
            : null;
          setSelectedDates({ checkIn: cd, checkOut: co });
        }
        if (navData.guests) {
          const g = navData.guests;
          setSelectedGuests({
            rooms: g.rooms ?? 1,
            adults: g.adults ?? 2,
            children: g.children ?? 0,
          });
        }
      }
    } catch {
      // ignore parse errors
    }
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [props]);
  const { colors, theme } = useTheme();
  const { addBooking } = useBookings();
  // Removed unused addBooking
  const styles = createStyles(colors, theme);

  // Add missing calendar styles if not present
  if (!styles.monthHeader)
    styles.monthHeader = {
      color: colors.text,
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 15,
    };
  if (!styles.calendarGrid)
    styles.calendarGrid = {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    };
  if (!styles.calendarDayHeader)
    styles.calendarDayHeader = {
      width: "14%",
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 10,
    };
  if (!styles.calendarDay)
    styles.calendarDay = {
      width: "14%",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      minHeight: 40,
      borderRadius: 20,
    };
  if (!styles.selectedDay)
    styles.selectedDay = {
      backgroundColor: colors.button,
    };
  if (!styles.rangeDay)
    styles.rangeDay = {
      backgroundColor: `${colors.button}20`,
    };
  if (!styles.calendarDayText)
    styles.calendarDayText = {
      color: colors.text,
      fontSize: 16,
    };
  if (!styles.selectedDayText)
    styles.selectedDayText = {
      color: colors.background,
      fontWeight: "bold",
    };
  if (!styles.rangeDayText)
    styles.rangeDayText = {
      color: colors.button,
    };

  // Debug helper: wrap TouchableWithoutFeedback to log number of children at runtime
  // DebugTouchableWithoutFeedback helper removed (was unused)

  // Handler to toggle ratings view
  const handleShowMoreRatings = () => {
    setShowAllRatings((prev) => !prev);
  };
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showFacilitiesModal, setShowFacilitiesModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showExpandedReviews, setShowExpandedReviews] = useState(false);
  const [showExpandedDescription, setShowExpandedDescription] = useState(false);
  const [showReviewsSummaryModal, setShowReviewsSummaryModal] = useState(false);
  const [showPropertyDatesModal, setShowPropertyDatesModal] = useState(false);
  const [showPropertyGuestsModal, setShowPropertyGuestsModal] = useState(false);
  const [questions, setQuestions] = useState(MOCK_PROPERTY_DATA.questions);

  const { saveProperty, removeProperty, isSaved } = useSavedProperties();

  const handleSave = () => {
    // Compute id from the currently displayed property
    const currentId = String(property?.id ?? property?.title);
    const currentlySaved = isSaved(currentId);
    console.log("PropertyDetailsScreen: handleSave ->", {
      currentId,
      currentlySaved,
    });

    if (currentlySaved) {
      removeProperty(currentId);
      Alert.alert("Property removed", "Property removed from saved list.");
    } else {
      // Ensure saved object always has a `title` property so Saved list can render it
      saveProperty({
        ...property,
        id: currentId,
        title: property?.title ?? property?.name ?? String(property?.id ?? ""),
      });
      Alert.alert(
        "Property saved!",
        "You can view it in the Saved List screen.",
      );
    }
  };

  // Handler for sharing property
  const handleShare = () => {
    Alert.alert("Share", "Share functionality coming soon!");
  };

  // Handler for scroll event to update header style
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 60);
  };

  // Use dynamic property data from navigation params, fallback to mock data
  // Use safe optional chaining in case `route` is undefined (inline render mode)
  const pd: any = route?.params?.propertyData || {};
  // Type guards for PropertyCard and BookingCard
  function isPropertyCardType(
    obj: any,
  ): obj is import("../components/PropertyCard").Property {
    return obj && typeof obj.title === "string";
  }
  // Narrow booking-shaped objects (used when BookingsScreen passes booking data inline)
  function isBookingCardType(obj: any): obj is {
    propertyName: string;
    price?: any;
    location?: any;
    details?: any;
  } {
    return !!(obj && typeof obj.propertyName === "string");
  }

  let property: any = { ...MOCK_PROPERTY_DATA };
  if (isPropertyCardType(pd)) {
    property.name = pd.title;
    if ("rating" in pd) property.rating = pd.rating;
    if ("reviewCount" in pd) property.reviewCount = pd.reviewCount;
    if ("price" in pd) property.price = pd.price;
    if ("location" in pd) property.address = pd.location;
    if ("description" in pd) property.description = pd.description;
    if ("shortDescription" in pd)
      property.shortDescription = pd.shortDescription;
    if ("imageSource" in pd) property.imageSource = pd.imageSource;
    if ("deal" in pd) property.deal = pd.deal;
    if ("oldPrice" in pd) property.oldPrice = pd.oldPrice;
    if ("taxesIncluded" in pd) property.taxesIncluded = pd.taxesIncluded;
    if ("distance" in pd) property.distance = pd.distance;
    if ("details" in pd) property.details = pd.details;
    if ("images" in pd) property.images = pd.images;
    if ("isAvailable" in pd) property.isAvailable = pd.isAvailable;
    if ("alternatives" in pd) property.alternatives = pd.alternatives;
    if ("ratings" in pd) property.ratings = pd.ratings;
    if ("facilities" in pd) property.facilities = pd.facilities;
    if ("reviews" in pd) property.reviews = pd.reviews;
    if ("questions" in pd) property.questions = pd.questions;
    if ("coordinates" in pd) property.coordinates = pd.coordinates;
  } else if (isBookingCardType(pd)) {
    property.name = pd.propertyName;
    property.price = pd.price;
    property.address = pd.location;
    property.details = pd.details;
  }

  // Compute property id from the displayed property (use id or fallback to title) and normalize to string
  const propertyId = String(property.id ?? property.title);

  // Always derive saved state from context (single source of truth)
  const saved = isSaved(propertyId);

  // Ensure images array is available and normalize image sources.
  // If navigation passed a single image (imageSource), use it as the main image.
  const normalizeImageSource = (img: any) =>
    typeof img === "number"
      ? img
      : typeof img === "string"
        ? { uri: img }
        : img;

  // If navigation explicitly passed an imageSource, prefer it and use it as
  // the primary image regardless of any placeholder images in MOCK data.
  if (property.imageSource) {
    property.images = [normalizeImageSource(property.imageSource)];
  } else if (property.images && Array.isArray(property.images)) {
    property.images = property.images.map(normalizeImageSource);
  }

  // If there are no images after normalization, use a random hotel image from assets
  if (!property.images || property.images.length === 0) {
    const hotelImages = [
      require("../assets/images/hotel1.png"),
      require("../assets/images/hotel2.png"),
      require("../assets/images/hotel3.png"),
      require("../assets/images/hotel4.png"),
      require("../assets/images/hotel5.png"),
      require("../assets/images/hotel6.png"),
      require("../assets/images/hotel7.png"),
      require("../assets/images/hotel8.png"),
      require("../assets/images/hotel9.png"),
      require("../assets/images/hotel10.png"),
      require("../assets/images/hotel11.png"),
      require("../assets/images/hotel12.png"),
      require("../assets/images/hotel13.png"),
      require("../assets/images/hotel14.png"),
      require("../assets/images/hotel15.png"),
      require("../assets/images/hotel16.png"),
      require("../assets/images/hotel17.png"),
      require("../assets/images/hotel18.png"),
      require("../assets/images/hotel19.png"),
      require("../assets/images/hotel20.png"),
    ];
    // Deterministic selection based on propertyId so the same booking shows the same image
    const hash = Array.from(propertyId).reduce(
      (acc, ch) => acc + ch.charCodeAt(0),
      0,
    );
    const index = hash % hotelImages.length;
    property.images = [hotelImages[index]];
  }

  // Booking handlers
  const handleBookNow = () => setShowBookingSummaryModal(true);

  const handleSeeAllFacilities = () => {
    setShowExpandedFacilities(!showExpandedFacilities);

    Animated.timing(facilitiesAnimationHeight, {
      toValue: showExpandedFacilities ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
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
    setShowExpandedReviews(!showExpandedReviews);

    Animated.timing(reviewsAnimationHeight, {
      toValue: showExpandedReviews ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleReadMore = () => {
    setShowExpandedDescription(!showExpandedDescription);

    Animated.timing(descriptionAnimationHeight, {
      toValue: showExpandedDescription ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleMapPress = () => {
    // Open our in-app full-screen map modal
    setShowMapModal(true);
  };

  // We'll use the shared MapModal component (components/MapModal.tsx)

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
        {property.images.slice(1, 4).map((image: any, index: number) => (
          <View key={index} style={styles.thumbnailContainer}>
            <Image source={image} style={styles.thumbnail} resizeMode="cover" />
          </View>
        ))}
      </View>
      {/* Image gallery click indicator */}
      <View
        style={[
          styles.imageGalleryOverlay,
          { justifyContent: "flex-end", alignItems: "flex-start", padding: 12 },
        ]}
      >
        <Ionicons name="images-outline" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );

  const renderPropertyHeader = () => (
    <View style={styles.propertyHeader}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.propertyName}>{property.name}</Text>
      </View>
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

  // Add this handler to open the guests modal
  const handleRoomGuestChange = () => {
    setShowPropertyGuestsModal(true);
  };

  // Handler to open the dates modal
  const handleDateChange = () => {
    setShowPropertyDatesModal(true);
  };

  // Helper: attempt to parse an alternative date range string like
  // "Aug 10 - Aug 12", "Aug 10–12", "10 Aug - 12 Aug", or "Aug 31 - Sep 2".
  // Returns { checkIn: Date, checkOut: Date } or null.
  const parseAltDateRange = (dateRange: string) => {
    if (!dateRange || typeof dateRange !== "string") return null;

    // Normalize dashes and collapse whitespace
    const normalized = dateRange
      .replace(/[–—]/g, "-")
      .replace(/\s+/g, " ")
      .trim();
    const parts = normalized.split(/\s*-\s*/);
    if (parts.length !== 2) return null;

    const now = new Date();
    const currentYear = now.getFullYear();

    const tryParse = (s: string, refMonth?: number): Date | null => {
      if (!s) return null;
      s = s.trim();

      // If string is just a day number like "12", use refMonth/year
      const dayOnly = /^\d{1,2}$/.exec(s);
      if (dayOnly && typeof refMonth === "number") {
        const day = Number(dayOnly[0]);
        const d = new Date(currentYear, refMonth, day);
        if (!isNaN(d.getTime())) return d;
      }

      // Try common formats directly
      let d = new Date(s);
      if (!isNaN(d.getTime())) return d;

      // Try adding current year (e.g. "Aug 10")
      d = new Date(`${s} ${currentYear}`);
      if (!isNaN(d.getTime())) return d;

      // Try swapping day/month (e.g. "10 Aug")
      const dm = s.match(/^(\d{1,2})\s+([A-Za-z]+)$/);
      if (dm) {
        const day = dm[1];
        const monthName = dm[2];
        const d2 = new Date(`${monthName} ${day} ${currentYear}`);
        if (!isNaN(d2.getTime())) return d2;
      }

      return null;
    };

    // Parse check-in first to use its month as reference if second part omits month
    const rawIn = parts[0];
    const rawOut = parts[1];

    const checkIn = tryParse(rawIn);
    if (!checkIn) return null;

    // If out looks like just a day number, use checkIn's month/year
    const outDayOnly = /^\d{1,2}$/.test(rawOut.trim());
    let checkOut = outDayOnly
      ? tryParse(rawOut.trim(), checkIn.getMonth())
      : tryParse(rawOut);

    // If still null, attempt to append year and parse
    if (!checkOut) checkOut = tryParse(`${rawOut} ${currentYear}`);

    if (checkIn && checkOut) {
      // If checkOut appears before checkIn (no year specified), and it's
      // likely the next month/year, adjust year accordingly.
      if (checkOut.getTime() <= checkIn.getTime()) {
        // If months are different or same day, assume checkOut is after checkIn
        // by adding one month if that yields a later date with same day number.
        const maybe = new Date(checkOut.getTime());
        maybe.setFullYear(checkOut.getFullYear() + 1);
        if (maybe.getTime() > checkIn.getTime()) {
          checkOut = maybe;
        }
      }
      return { checkIn, checkOut };
    }

    return null;
  };

  // Open booking summary modal with optional dates and price override
  const openBookingWithOptions = (
    dates?: { checkIn: Date | null; checkOut: Date | null } | null,
    price?: any,
    altLabel?: string | null,
  ) => {
    // If a price is provided, try to coerce it to a number and store it as
    // the booking price override so the booking summary displays it.
    if (price !== undefined && price !== null) {
      let parsedPrice: number | null = null;
      if (typeof price === "number") parsedPrice = price;
      else if (typeof price === "string") {
        const cleaned = price.replace(/[^0-9.,]/g, "").replace(",", ".");
        const n = Number(cleaned);
        parsedPrice = isNaN(n) ? null : n;
      }
      setBookingPriceOverride(parsedPrice);
    } else {
      setBookingPriceOverride(null);
    }

    // Keep the original alt label for display in the booking summary if
    // provided by the caller. Clear otherwise.
    setBookingAltDateRange(altLabel ?? null);

    if (dates) {
      // Coerce any incoming date-like values to Date objects so the modal
      // render logic can rely on Date methods like toLocaleDateString.
      const coerce = (d: any) => (d ? new Date(d) : null);
      const ci = coerce(dates.checkIn);
      const co = coerce(dates.checkOut);
      console.debug("openBookingWithOptions: pre-filling dates", { ci, co });

      // Set selected dates and ensure the calendar tab is active. To avoid a
      // potential timing issue where the modal renders before state updates
      // propagate, open the booking modal on the next tick.
      setSelectedDates({ checkIn: ci, checkOut: co });
      setActiveTab("calendar");

      setShowPropertyDatesModal(false);
      // Open on next tick so the modal reads the updated selectedDates
      // when it mounts/renders.
      setTimeout(() => setShowBookingSummaryModal(true), 0);
      return;
    }

    // No dates provided: close the dates modal and open booking summary now.
    setBookingAltDateRange(altLabel ?? null);
    setShowPropertyDatesModal(false);
    setShowBookingSummaryModal(true);
  };

  const renderBookingSection = () => (
    <View style={styles.bookingSection}>
      <View style={styles.dateRow}>
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>Check-in</Text>
          <TouchableOpacity onPress={handleDateChange}>
            <Text style={styles.dateValue}>
              {selectedDates.checkIn
                ? selectedDates.checkIn.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })
                : "Select date"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>Check-out</Text>
          <TouchableOpacity onPress={handleDateChange}>
            <Text style={styles.dateValue}>
              {selectedDates.checkOut
                ? selectedDates.checkOut.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })
                : "Select date"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Small header above the guests button (left-aligned) */}
      <View style={{ paddingLeft: 8, marginTop: 12, alignItems: "flex-start" }}>
        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
          Guests & rooms
        </Text>
      </View>

      <TouchableOpacity
        style={styles.roomGuestInfo}
        onPress={handleRoomGuestChange}
      >
        <Text style={styles.roomGuestText}>
          {selectedGuests.rooms} room • {selectedGuests.adults} adults •{" "}
          {selectedGuests.children
            ? `${selectedGuests.children} children`
            : "No children"}
        </Text>
      </TouchableOpacity>

      {/* Show alternatives only when the property has no availability AND no dates are selected */}
      {!property.isAvailable &&
        !selectedDates.checkIn &&
        !selectedDates.checkOut && (
          <View>
            <Text style={styles.noAvailabilityText}>
              No dates selected yet. Here are some options with availability:
            </Text>
            {/* Render alternatives if available */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.alternativesRow}>
                {property.alternatives?.map((alt: any, idx: number) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.alternativeOption}
                    onPress={() => {
                      const parsed = parseAltDateRange(alt.dateRange);
                      const tryParsePrice = (p: any) => {
                        if (!p && p !== 0) return undefined;
                        if (typeof p === "number") return p;
                        if (typeof p === "string") {
                          const cleaned = p
                            .replace(/[^0-9.,]/g, "")
                            .replace(",", ".");
                          const n = Number(cleaned);
                          return isNaN(n) ? undefined : n;
                        }
                        return undefined;
                      };
                      const parsedPrice = tryParsePrice(
                        alt.price ||
                          alt.priceLabel ||
                          alt.pricePerNight ||
                          undefined,
                      );
                      openBookingWithOptions(
                        parsed || null,
                        parsedPrice !== undefined
                          ? parsedPrice
                          : property.price,
                        alt.dateRange,
                      );
                    }}
                  >
                    <Text style={styles.alternativeDateRange}>
                      {alt.dateRange}
                    </Text>
                    <Text style={styles.alternativePrice}>{alt.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
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

  // Add missing handler for showing reviews summary modal
  const handleShowReviewsSummary = () => {
    setShowReviewsSummaryModal(true);
  };

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
        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={handleShowReviewsSummary}
        >
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
                    { width: `${(Number(rating) / 10) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.ratingValue}>{Number(rating)}</Text>
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
      {property.reviews.slice(0, 2).map((review: any) => (
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

      {/* Animated container for expanded reviews */}
      {property.reviews.length > 2 && (
        <Animated.View
          style={{
            overflow: "hidden",
            maxHeight: reviewsAnimationHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, (property.reviews.length - 2) * 200], // Approximate height per review
            }),
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {property.reviews.slice(2).map((review: any) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInitial}>
                    <Text style={styles.reviewerInitialText}>
                      {review.reviewerInitial}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.reviewerName}>
                      {review.reviewerName}
                    </Text>
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
          </ScrollView>
        </Animated.View>
      )}

      <TouchableOpacity
        onPress={handleShowAllReviews}
        style={styles.showMoreButton}
      >
        <Text style={styles.showMoreText}>
          {showExpandedReviews ? "Show less reviews" : "See detailed reviews"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFacilitiesSection = () => (
    <View style={styles.facilitiesSection}>
      <Text style={styles.sectionTitle}>Most Popular Facilities</Text>

      {/* Always show first 6 facilities */}
      <View style={styles.facilitiesGrid}>
        {property.facilities.slice(0, 6).map((facility: any, index: number) => {
          const resolved = resolveIcon(facility.icon);
          const IconComponent =
            resolved.family === "ion" ? Ionicons : MaterialIcons;
          return (
            <View key={index} style={styles.facilityItem}>
              <IconComponent
                name={resolved.name as any}
                size={20}
                color={colors.text}
              />
              <Text style={styles.facilityText}>{facility.name}</Text>
            </View>
          );
        })}
      </View>

      {/* Animated container for expanded facilities */}
      {property.facilities.length > 6 && (
        <Animated.View
          style={{
            overflow: "hidden",
            maxHeight: facilitiesAnimationHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [
                0,
                Math.ceil((property.facilities.length - 6) / 2) * 50,
              ], // Approximate height per row
            }),
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View style={styles.facilitiesGrid}>
              {property.facilities
                .slice(6)
                .map((facility: any, index: number) => {
                  const resolved = resolveIcon(facility.icon);
                  const IconComponent =
                    resolved.family === "ion" ? Ionicons : MaterialIcons;
                  return (
                    <View key={index + 6} style={styles.facilityItem}>
                      <IconComponent
                        name={resolved.name as any}
                        size={20}
                        color={colors.text}
                      />
                      <Text style={styles.facilityText}>{facility.name}</Text>
                    </View>
                  );
                })}
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {property.facilities.length > 6 && (
        <TouchableOpacity onPress={handleSeeAllFacilities}>
          <Text style={styles.seeAllFacilitiesText}>
            {showExpandedFacilities
              ? "Show less facilities"
              : "See all facilities"}
          </Text>
        </TouchableOpacity>
      )}
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
        {displayQuestions.map((q: any) => (
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
            {questions.slice(1).map((q: any) => (
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

      {/* Always show short description */}
      <Text style={styles.descriptionText}>{property.shortDescription}</Text>

      {/* Animated container for expanded description */}
      <Animated.View
        style={{
          overflow: "hidden",
          maxHeight: descriptionAnimationHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 400], // Approximate height for full description
          }),
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <Text style={[styles.descriptionText, { marginTop: 16 }]}>
            {property.description.replace(property.shortDescription, "").trim()}
          </Text>
        </ScrollView>
      </Animated.View>

      <TouchableOpacity onPress={handleReadMore} style={styles.readMoreButton}>
        <Text style={styles.readMoreText}>
          {showExpandedDescription ? "Show less" : "Read more"}
        </Text>
      </TouchableOpacity>
      {/* Show deal, oldPrice, taxesIncluded, etc. if present */}
      {property.deal && (
        <Text style={styles.priceLabel}>
          Deal: <Text style={styles.priceValue}>{property.deal}</Text>
        </Text>
      )}
      {property.oldPrice && (
        <Text style={styles.priceLabel}>
          Old Price: <Text style={styles.priceValue}>{property.oldPrice}</Text>
        </Text>
      )}
      {property.taxesIncluded !== undefined && (
        <Text style={styles.priceLabel}>
          Taxes Included:{" "}
          <Text style={styles.priceValue}>
            {property.taxesIncluded ? "Yes" : "No"}
          </Text>
        </Text>
      )}
      {property.distance && (
        <Text style={styles.priceLabel}>
          Distance: <Text style={styles.priceValue}>{property.distance}</Text>
        </Text>
      )}
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
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Property Description</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDescriptionModal(false)}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme === "light" ? colors.text : "white"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.datesModalTitle}>Select Dates</Text>

          <View style={styles.datesPlaceholder}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.datesPlaceholderTitle}>Date Selection</Text>
            <Text style={styles.datesPlaceholderText}>
              Tap to open full calendar functionality
            </Text>

            <TouchableOpacity
              style={styles.tempDateButton}
              onPress={() => {
                // Prepare sample dates (tomorrow and day after)
                const today = new Date();
                const tomorrow = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() + 1,
                );
                const dayAfter = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() + 2,
                );
                Alert.alert(
                  "Dates Updated",
                  "Check-in and Check-out dates have been updated!",
                );
                // Open booking summary with these sample dates and use property's price
                openBookingWithOptions(
                  { checkIn: tomorrow, checkOut: dayAfter },
                  property.price,
                  `${tomorrow.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })} - ${dayAfter.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`,
                );
              }}
            >
              <Text style={styles.tempDateButtonText}>Select Sample Dates</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderImageModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showImageModal}
      onRequestClose={() => setShowImageModal(false)}
    >
      <View
        style={[
          styles.modalOverlay,
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: 0,
            margin: 0,
            width: "100%",
            height: "100%",
            backgroundColor: colors.background,
            paddingTop: 32, // Add top padding to prevent initial overflow
          },
        ]}
      >
        <SafeAreaView
          style={{
            flex: 1,
            padding: 0,
            margin: 0,
            width: "100%",
            height: "100%",
          }}
        >
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
            {/*
              Show the property's images first, then append up to 4 random hotel
              images from our assets/images folder for extra variety in the modal.
              We do not mutate `property.images` here; we build a local combined list.
            */}
            {(() => {
              // list of hotel image requires - kept in same order as used elsewhere
              const hotelImages = [
                require("../assets/images/hotel1.png"),
                require("../assets/images/hotel2.png"),
                require("../assets/images/hotel3.png"),
                require("../assets/images/hotel4.png"),
                require("../assets/images/hotel5.png"),
                require("../assets/images/hotel6.png"),
                require("../assets/images/hotel7.png"),
                require("../assets/images/hotel8.png"),
                require("../assets/images/hotel9.png"),
                require("../assets/images/hotel10.png"),
                require("../assets/images/hotel11.png"),
                require("../assets/images/hotel12.png"),
                require("../assets/images/hotel13.png"),
                require("../assets/images/hotel14.png"),
                require("../assets/images/hotel15.png"),
                require("../assets/images/hotel16.png"),
                require("../assets/images/hotel17.png"),
                require("../assets/images/hotel18.png"),
                require("../assets/images/hotel19.png"),
                require("../assets/images/hotel20.png"),
              ];

              // Helper to pick up to `count` unique random images that are not
              // already present in the property's images (by comparing module id or uri)
              const pickRandomExtras = (count: number) => {
                const existing = (property.images || []).map((img: any) =>
                  typeof img === "number"
                    ? img
                    : img?.uri || JSON.stringify(img),
                );

                const pool = hotelImages.filter((img) => {
                  const key =
                    typeof img === "number"
                      ? img
                      : img?.uri || JSON.stringify(img);
                  return !existing.includes(key);
                });

                const picks: any[] = [];
                const max = Math.min(count, pool.length);
                while (picks.length < max) {
                  const idx = Math.floor(Math.random() * pool.length);
                  const candidate = pool[idx];
                  // ensure uniqueness in picks
                  if (!picks.includes(candidate)) picks.push(candidate);
                }
                return picks;
              };

              const extras = pickRandomExtras(4);
              const combined = [...(property.images || []), ...extras];

              return combined.map((image: any, index: number) => (
                <View key={"img_" + index} style={styles.fullImageContainer}>
                  <Image
                    source={image}
                    style={styles.fullImage}
                    resizeMode="cover"
                  />
                </View>
              ));
            })()}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );

  const renderMapModal = () => {
    const coords = property?.coordinates;
    const region = coords
      ? {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        }
      : undefined;

    const markers = coords
      ? [
          {
            id: propertyId,
            coordinate: {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
            title: property.name,
            description: property.address,
          },
        ]
      : [];

    return (
      <MapModal
        visible={showMapModal}
        onClose={() => setShowMapModal(false)}
        region={region}
        markers={markers}
      />
    );
  };

  const renderReviewsSummaryModal = () => (
    <Modal
      visible={showReviewsSummaryModal}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setShowReviewsSummaryModal(false)}
    >
      <SafeAreaView style={styles.reviewsSummaryModalContainer}>
        {/* Header */}
        <View style={styles.reviewsSummaryHeader}>
          <TouchableOpacity
            style={styles.reviewsSummaryCloseButton}
            onPress={() => setShowReviewsSummaryModal(false)}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.reviewsSummaryTitle}>Guest Reviews</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Stats Section */}
        <View style={styles.reviewsSummaryStats}>
          <Text style={styles.reviewsSummaryRating}>{property.rating}</Text>
          <Text style={styles.reviewsSummaryRatingText}>Good</Text>
          <Text style={styles.reviewsSummaryCount}>
            {property.totalReviews.toLocaleString()} reviews
          </Text>
          <View style={styles.reviewsSummaryBars}>
            {Object.entries(property.ratings).map(([category, rating]) => (
              <View key={category} style={styles.reviewsSummaryBarRow}>
                <Text style={styles.reviewsSummaryBarLabel}>
                  {category === "valueForMoney"
                    ? "Value for Money"
                    : category.charAt(0).toUpperCase() +
                      category.slice(1).replace(/([A-Z])/g, " $1")}
                </Text>
                <View style={styles.reviewsSummaryBar}>
                  <View
                    style={[
                      styles.reviewsSummaryBarFill,
                      { width: `${(Number(rating) / 10) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.reviewsSummaryBarValue}>
                  {Number(rating)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews List */}
        <ScrollView style={styles.reviewsSummaryContent}>
          <Text style={styles.reviewsSummaryListTitle}>Recent Reviews</Text>
          {property.reviews.map((review: any) => (
            <View key={review.id} style={styles.reviewsSummaryCard}>
              <View style={styles.reviewsSummaryCardHeader}>
                <View style={styles.reviewsSummaryAvatar}>
                  <Text style={styles.reviewsSummaryAvatarText}>
                    {review.reviewerInitial}
                  </Text>
                </View>
                <View style={styles.reviewsSummaryReviewerInfo}>
                  <Text style={styles.reviewsSummaryReviewerName}>
                    {review.reviewerName}
                  </Text>
                  <Text style={styles.reviewsSummaryReviewerCountry}>
                    {review.country === "Australia" && "🇦🇺"}
                    {review.country === "Italy" && "🇮🇹"}
                    {review.country === "Germany" && "🇩🇪"}
                    {review.country === "United Kingdom" && "🇬🇧"}
                    {review.country === "France" && "🇫🇷"} {review.country}
                  </Text>
                </View>
              </View>
              <Text style={styles.reviewsSummaryReviewText}>{review.text}</Text>
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

  // PropertyListScreen-style modals
  const renderPropertyDatesModal = () => {
    // Helper: get month index from name
    const getMonthIndex = (monthName: string) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months.indexOf(monthName);
    };

    // Helper: get duration days
    const getDurationDays = (duration: string) => {
      switch (duration) {
        case "weekend":
          return 2;
        case "week":
          return 7;
        case "month":
          return 30;
        default:
          return 3;
      }
    };

    // Handler for flexible selection
    const handleApplyFlexible = () => {
      // Use selected flexibleMonth and flexibleDuration to set selectedDates
      const year = new Date().getFullYear();
      const monthIdx = getMonthIndex(flexibleMonth);
      // Start with first day of month
      const checkIn = new Date(year, monthIdx, 1);
      const days = getDurationDays(flexibleDuration);
      const checkOut = new Date(year, monthIdx, 1 + days);
      setSelectedDates({ checkIn, checkOut });
      setShowPropertyDatesModal(false);
    };
    const handleApplyDates = () => {
      // Only close modal if both dates are selected
      if (selectedDates.checkIn && selectedDates.checkOut) {
        setShowPropertyDatesModal(false);
      }
    };

    if (!showPropertyDatesModal) return null;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showPropertyDatesModal}
        onRequestClose={() => setShowPropertyDatesModal(false)}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: Platform.OS === "ios" ? 32 : 32,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.separator,
            }}
          >
            <TouchableOpacity onPress={() => setShowPropertyDatesModal(false)}>
              <Text style={{ color: colors.button, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: colors.text,
              }}
            >
              Select Dates
            </Text>
            <TouchableOpacity
              onPress={handleApplyDates}
              disabled={!selectedDates.checkIn || !selectedDates.checkOut}
            >
              <Text
                style={{
                  color:
                    selectedDates.checkIn && selectedDates.checkOut
                      ? colors.button
                      : colors.textSecondary,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: colors.separator,
              marginHorizontal: 15,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 15,
                alignItems: "center",
                borderBottomWidth: 2,
                borderBottomColor:
                  activeTab === "calendar" ? colors.button : "transparent",
              }}
              onPress={() => setActiveTab("calendar")}
            >
              <Text
                style={{
                  fontSize: 16,
                  color:
                    activeTab === "calendar"
                      ? colors.button
                      : colors.textSecondary,
                  fontWeight: activeTab === "calendar" ? "bold" : "normal",
                }}
              >
                Calendar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 15,
                alignItems: "center",
                borderBottomWidth: 2,
                borderBottomColor:
                  activeTab === "flexible" ? colors.button : "transparent",
              }}
              onPress={() => setActiveTab("flexible")}
            >
              <Text
                style={{
                  fontSize: 16,
                  color:
                    activeTab === "flexible"
                      ? colors.button
                      : colors.textSecondary,
                  fontWeight: activeTab === "flexible" ? "bold" : "normal",
                }}
              >
                Flexible
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
            {activeTab === "calendar" ? (
              <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
                {/* Calendar for next 12 months */}
                {(() => {
                  // Calendar logic
                  const months = [];
                  const currentDate = new Date();
                  for (let i = 0; i < 12; i++) {
                    const monthDate = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + i,
                      1,
                    );
                    const monthName = monthDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    });
                    const daysInMonth = new Date(
                      monthDate.getFullYear(),
                      monthDate.getMonth() + 1,
                      0,
                    ).getDate();
                    const firstDayOfMonth = monthDate.getDay();
                    months.push({
                      name: monthName,
                      year: monthDate.getFullYear(),
                      month: monthDate.getMonth(),
                      daysInMonth,
                      firstDayOfMonth,
                    });
                  }

                  // Helper functions
                  const isDateSelected = (
                    year: number,
                    month: number,
                    day: number,
                  ) => {
                    const date = new Date(year, month, day);
                    return (
                      (selectedDates.checkIn &&
                        date.getTime() === selectedDates.checkIn.getTime()) ||
                      (selectedDates.checkOut &&
                        date.getTime() === selectedDates.checkOut.getTime())
                    );
                  };
                  const isDateInRange = (
                    year: number,
                    month: number,
                    day: number,
                  ) => {
                    if (!selectedDates.checkIn || !selectedDates.checkOut)
                      return false;
                    const date = new Date(year, month, day);
                    return (
                      date >= selectedDates.checkIn &&
                      date <= selectedDates.checkOut
                    );
                  };
                  const handleDatePress = (
                    year: number,
                    month: number,
                    day: number,
                  ) => {
                    const selectedDate = new Date(year, month, day);
                    if (
                      !selectedDates.checkIn ||
                      (selectedDates.checkIn && selectedDates.checkOut)
                    ) {
                      setSelectedDates({
                        checkIn: selectedDate,
                        checkOut: null,
                      });
                    } else if (!selectedDates.checkOut) {
                      if (selectedDate > selectedDates.checkIn) {
                        setSelectedDates({
                          checkIn: selectedDates.checkIn,
                          checkOut: selectedDate,
                        });
                      } else {
                        setSelectedDates({
                          checkIn: selectedDate,
                          checkOut: null,
                        });
                      }
                    }
                  };

                  return (
                    <>
                      {months.map((monthData, monthIndex) => (
                        <View
                          key={`month-${monthIndex}`}
                          style={{ marginBottom: 30 }}
                        >
                          <Text
                            style={[
                              styles.monthHeader,
                              {
                                fontSize: 20,
                                fontWeight: "bold",
                                marginBottom: 8,
                              },
                            ]}
                          >
                            {monthData.name}
                          </Text>
                          <View style={styles.calendarGrid}>
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                              (day) => (
                                <Text
                                  key={day}
                                  style={styles.calendarDayHeader}
                                >
                                  {day}
                                </Text>
                              ),
                            )}
                            {/* Empty cells for days before the first day of the month */}
                            {Array.from(
                              { length: monthData.firstDayOfMonth },
                              (_, index) => (
                                <View
                                  key={`empty-${monthIndex}-${index}`}
                                  style={styles.calendarDay}
                                />
                              ),
                            )}
                            {/* Days of the month */}
                            {Array.from(
                              { length: monthData.daysInMonth },
                              (_, index) => {
                                const day = index + 1;
                                const isSelected = isDateSelected(
                                  monthData.year,
                                  monthData.month,
                                  day,
                                );
                                const inRange = isDateInRange(
                                  monthData.year,
                                  monthData.month,
                                  day,
                                );
                                return (
                                  <TouchableOpacity
                                    key={`day-${monthIndex}-${day}`}
                                    style={[
                                      styles.calendarDay,
                                      isSelected && styles.selectedDay,
                                      inRange && !isSelected && styles.rangeDay,
                                    ]}
                                    onPress={() =>
                                      handleDatePress(
                                        monthData.year,
                                        monthData.month,
                                        day,
                                      )
                                    }
                                  >
                                    <Text
                                      style={[
                                        styles.calendarDayText,
                                        isSelected && styles.selectedDayText,
                                        inRange &&
                                          !isSelected &&
                                          styles.rangeDayText,
                                      ]}
                                    >
                                      {day}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              },
                            )}
                          </View>
                        </View>
                      ))}
                      <View
                        style={{ alignItems: "center", marginVertical: 24 }}
                      >
                        <Text
                          style={{
                            color: styles.calendarDayText.color,
                            fontSize: 16,
                            opacity: 0.6,
                          }}
                        >
                          No more dates available yet
                        </Text>
                      </View>
                    </>
                  );
                })()}
              </ScrollView>
            ) : (
              <View style={{ flex: 1, paddingHorizontal: 15 }}>
                <Text style={styles.flexibleSectionTitle}>
                  How long do you want to stay?
                </Text>
                <View style={styles.durationRow}>
                  {[
                    { key: "weekend", label: "Weekend" },
                    { key: "week", label: "Week" },
                    { key: "month", label: "Month" },
                    { key: "other", label: "Other" },
                  ].map((option, idx) => (
                    <TouchableOpacity
                      key={`${option.key}-${idx}`}
                      style={[
                        styles.durationButton,
                        flexibleDuration === option.key &&
                          styles.durationButtonActive,
                      ]}
                      onPress={() => setFlexibleDuration(option.key)}
                    >
                      <Text
                        style={[
                          styles.durationButtonText,
                          flexibleDuration === option.key &&
                            styles.durationButtonTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.flexibleSectionTitle}>
                  When do you want to go?
                </Text>
                <Text style={styles.flexibleSubtitle}>
                  Select up to 3 months
                </Text>

                <View style={styles.monthsRow}>
                  {["Sep", "Oct", "Nov", "Dec"].map((month, idx) => (
                    <TouchableOpacity
                      key={`${month}-${idx}`}
                      style={[
                        styles.monthButton,
                        flexibleMonth === month && styles.monthButtonActive,
                      ]}
                      onPress={() => setFlexibleMonth(month)}
                    >
                      {/* If AntDesign is imported, show icon */}
                      {typeof AntDesign !== "undefined" && (
                        <AntDesign
                          name="calendar"
                          size={24}
                          color={
                            flexibleMonth === month
                              ? styles.monthButtonTextActive.color
                              : styles.monthButtonText.color
                          }
                        />
                      )}
                      <Text
                        style={[
                          styles.monthButtonText,
                          flexibleMonth === month &&
                            styles.monthButtonTextActive,
                        ]}
                      >
                        {month}
                      </Text>
                      <Text
                        style={[
                          styles.monthButtonYear,
                          flexibleMonth === month &&
                            styles.monthButtonTextActive,
                        ]}
                      >
                        2025
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.flexibleResult}>
                  <Text style={styles.flexibleResultText}>
                    {flexibleDuration.charAt(0).toUpperCase() +
                      flexibleDuration.slice(1)}{" "}
                    in {flexibleMonth}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    marginTop: 24,
                    backgroundColor: colors.button,
                    padding: 14,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                  onPress={handleApplyFlexible}
                >
                  <Text
                    style={{
                      color: colors.background,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Select these dates
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderPropertyGuestsModal = () => {
    const handleApplyGuests = () => {
      // Update the property data with selected guests
      setShowPropertyGuestsModal(false);
    };

    const handleIncrement = (type: string) => {
      setSelectedGuests((prev) => {
        switch (type) {
          case "rooms":
            return { ...prev, rooms: Math.min(prev.rooms + 1, 8) };
          case "adults":
            return { ...prev, adults: Math.min(prev.adults + 1, 16) };
          case "children":
            return { ...prev, children: Math.min(prev.children + 1, 8) };
          default:
            return prev;
        }
      });
    };

    const handleDecrement = (type: string) => {
      setSelectedGuests((prev) => {
        switch (type) {
          case "rooms":
            return { ...prev, rooms: Math.max(prev.rooms - 1, 1) };
          case "adults":
            return { ...prev, adults: Math.max(prev.adults - 1, 1) };
          case "children":
            return { ...prev, children: Math.max(prev.children - 1, 0) };
          default:
            return prev;
        }
      });
    };

    if (!showPropertyGuestsModal) return null;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showPropertyGuestsModal}
        onRequestClose={() => setShowPropertyGuestsModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.separator,
            }}
          >
            <TouchableOpacity onPress={() => setShowPropertyGuestsModal(false)}>
              <Text style={{ color: colors.button, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: colors.text,
              }}
            >
              Rooms & Guests
            </Text>
            <TouchableOpacity onPress={handleApplyGuests}>
              <Text
                style={{
                  color: colors.button,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }}>
            {/* Rooms */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: colors.separator,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 18 }}>Rooms</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor:
                      selectedGuests.rooms > 1
                        ? colors.button
                        : colors.separator,
                    padding: 8,
                    borderRadius: 4,
                    width: 32,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => handleDecrement("rooms")}
                  disabled={selectedGuests.rooms <= 1}
                >
                  <Text
                    style={{
                      color:
                        selectedGuests.rooms > 1
                          ? colors.button
                          : colors.separator,
                    }}
                  >
                    −
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    marginHorizontal: 20,
                    minWidth: 30,
                    textAlign: "center",
                  }}
                >
                  {selectedGuests.rooms}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.button,
                    padding: 8,
                    borderRadius: 4,
                    width: 32,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => handleIncrement("rooms")}
                >
                  <Text style={{ color: colors.button }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Adults */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: colors.separator,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 18 }}>Adults</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor:
                      selectedGuests.adults > 1
                        ? colors.button
                        : colors.separator,
                    padding: 8,
                    borderRadius: 4,
                    width: 32,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => handleDecrement("adults")}
                  disabled={selectedGuests.adults <= 1}
                >
                  <Text
                    style={{
                      color:
                        selectedGuests.adults > 1
                          ? colors.button
                          : colors.separator,
                    }}
                  >
                    −
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    marginHorizontal: 20,
                    minWidth: 30,
                    textAlign: "center",
                  }}
                >
                  {selectedGuests.adults}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.button,
                    padding: 8,
                    borderRadius: 4,
                    width: 32,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => handleIncrement("adults")}
                >
                  <Text style={{ color: colors.button }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Children */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: colors.separator,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 18 }}>
                  Children
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                    marginTop: 2,
                  }}
                >
                  Ages 0-17
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor:
                      selectedGuests.children > 0
                        ? colors.button
                        : colors.separator,
                    padding: 8,
                    borderRadius: 4,
                    width: 32,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => handleDecrement("children")}
                  disabled={selectedGuests.children <= 0}
                >
                  <Text
                    style={{
                      color:
                        selectedGuests.children > 0
                          ? colors.button
                          : colors.separator,
                    }}
                  >
                    −
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    marginHorizontal: 20,
                    minWidth: 30,
                    textAlign: "center",
                  }}
                >
                  {selectedGuests.children}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.button,
                    padding: 8,
                    borderRadius: 4,
                    width: 32,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => handleIncrement("children")}
                >
                  <Text style={{ color: colors.button }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderBookingSummaryModal = (keyboardOpen: boolean) => {
    if (!showBookingSummaryModal) return null;

    // Calculate nights
    const nights =
      selectedDates.checkIn && selectedDates.checkOut
        ? Math.ceil(
            (selectedDates.checkOut.getTime() -
              selectedDates.checkIn.getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : 1;

    // Parse price utility
    const parsePrice = (p: any) => {
      // Use a component-level cached random fallback so the randomly chosen
      // price remains stable for the lifetime of this screen instance.
      const getRandomFallback = () => {
        if (randomPriceFallbackRef.current == null) {
          randomPriceFallbackRef.current =
            Math.floor(Math.random() * (500 - 80 + 1)) + 80;
        }
        return randomPriceFallbackRef.current as number;
      };

      if (p == null) return getRandomFallback();
      if (typeof p === "number") return p;
      if (typeof p === "string") {
        const digits = p.replace(/[^0-9\.]/g, "");
        const num = parseFloat(digits);
        return isNaN(num) ? getRandomFallback() : num;
      }
      return getRandomFallback();
    };

    // Prefer bookingPriceOverride (from an alternative) if provided.
    // Always ensure pricePerNight is a number
    const pricePerNight =
      bookingPriceOverride != null
        ? bookingPriceOverride
        : property?.pricePerNight
          ? parsePrice(property.pricePerNight)
          : parsePrice(null);
    const subtotal = pricePerNight * nights * selectedGuests.rooms;
    const taxes = Math.round(subtotal * 0.12);
    const total = subtotal + taxes;

    // Booking summary modal JSX
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={showBookingSummaryModal}
        onRequestClose={() => {
          setShowBookingSummaryModal(false);
          setBookingPriceOverride(null);
          setBookingAltDateRange(null);
        }}
      >
        {/* Booking Summary Header */}
        <SafeAreaView style={{ backgroundColor: colors.background }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.separator,
              backgroundColor: colors.background,
              paddingTop: 40,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowBookingSummaryModal(false);
                setBookingPriceOverride(null);
                setBookingAltDateRange(null);
              }}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: colors.text,
              }}
            >
              Booking Summary
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>
        <SafeAreaView style={styles.bookingSummaryContainer}>
          <ScrollView style={{ marginBottom: keyboardOpen ? 120 : 0 }}>
            <View style={styles.propertySummarySection}>
              <Image
                source={property.images[0]}
                style={styles.propertyImageSummary}
                resizeMode="cover"
              />
              <Text style={styles.propertyNameSummary}>{property.name}</Text>
              <Text style={styles.propertyAddressSummary}>
                {property.address}
              </Text>
              <View style={styles.propertyRatingSummary}>
                <View style={styles.ratingSummaryBadge}>
                  <Text style={styles.ratingSummaryText}>
                    {property.rating}
                  </Text>
                </View>
                <Text style={{ color: colors.textSecondary }}>
                  {property.totalReviews?.toLocaleString()} reviews
                </Text>
              </View>
            </View>
            <View style={styles.bookingDetailsSection}>
              <Text style={styles.sectionTitleBooking}>Booking details</Text>
              <View style={styles.bookingDetailRow}>
                <Text style={styles.bookingDetailLabel}>Dates</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowBookingSummaryModal(false);
                    setBookingPriceOverride(null);
                    setBookingAltDateRange(null);
                    setShowPropertyDatesModal(true);
                  }}
                >
                  <Text
                    style={{
                      color: colors.button,
                      textDecorationLine: "underline",
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    {selectedDates.checkIn && selectedDates.checkOut
                      ? `${selectedDates.checkIn.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })} - ${selectedDates.checkOut.toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}`
                      : bookingAltDateRange || "Select dates"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.bookingDetailRow}>
                <Text style={styles.bookingDetailLabel}>Rooms & guests</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowBookingSummaryModal(false);
                    setBookingPriceOverride(null);
                    setBookingAltDateRange(null);
                    setShowPropertyGuestsModal(true);
                  }}
                >
                  <Text
                    style={{
                      color: colors.button,
                      textDecorationLine: "underline",
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    {selectedGuests.rooms} room(s) • {selectedGuests.adults}{" "}
                    adult(s)
                    {selectedGuests.children > 0
                      ? ` • ${selectedGuests.children} child(ren)`
                      : ""}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.priceSummarySection}>
              <Text style={styles.sectionTitleBooking}>Price summary</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Price per night</Text>
                <Text style={styles.priceValue}>€{pricePerNight}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Nights × Rooms</Text>
                <Text style={styles.priceValue}>
                  {nights} × {selectedGuests.rooms}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>€{subtotal}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Taxes & fees</Text>
                <Text style={styles.priceValue}>€{taxes}</Text>
              </View>
              <View style={styles.totalPriceRow}>
                <Text style={styles.totalPriceLabel}>Total</Text>
                <Text style={styles.totalPriceValue}>€{total}</Text>
              </View>
              {/* Insert Payment Details Button below total price */}
              {!cardSubmittedSuccess && (
                <TouchableOpacity
                  style={[
                    styles.confirmBookingButton,
                    {
                      marginTop: 16,
                      backgroundColor: colors.button,
                      borderRadius: 8,
                    },
                  ]}
                  onPress={() => setShowPaymentDetails((prev) => !prev)}
                >
                  <Text style={styles.confirmBookingButtonText}>
                    {showPaymentDetails
                      ? "Hide Payment Details"
                      : "Insert Payment Details"}
                  </Text>
                </TouchableOpacity>
              )}
              {cardSubmittedSuccess && (
                <Text
                  style={{
                    color: "green",
                    fontSize: 16,
                    textAlign: "center",
                    marginTop: 16,
                  }}
                >
                  Card details submitted successfully!
                </Text>
              )}
              {/* Collapsible payment details card */}
              {showPaymentDetails && (
                <View
                  style={{
                    marginTop: 16,
                    padding: 16,
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    elevation: 2,
                    marginBottom: keyboardOpen ? 120 : 0,
                  }}
                >
                  {cardSubmittedSuccess ? (
                    <Text
                      style={{
                        color: "green",
                        fontSize: 16,
                        textAlign: "center",
                        marginTop: 16,
                      }}
                    >
                      Card details submitted successfully!
                    </Text>
                  ) : (
                    <>
                      {/* Payment section always visible */}
                      <Text style={styles.formLabel}>Card number</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="1234 5678 9012 3456"
                        placeholderTextColor={colors.textSecondary}
                        value={cardNumber}
                        onChangeText={(text) => {
                          let cleaned = text.replace(/[^\d]/g, "");
                          if (cleaned.length > 16) {
                            cleaned = cleaned.slice(0, 16);
                          }
                          let formatted = cleaned
                            .replace(/(.{4})/g, "$1 ")
                            .trim();
                          setCardNumber(formatted);
                        }}
                        keyboardType="numeric"
                      />
                      <Text style={styles.formLabel}>Name on card</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="Cardholder name"
                        placeholderTextColor={colors.textSecondary}
                        value={cardName}
                        onChangeText={setCardName}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={{ flex: 1, marginRight: 8 }}>
                          <Text style={styles.formLabel}>Expiry (MM/YY)</Text>
                          <TextInput
                            style={styles.formInput}
                            placeholder="MM/YY"
                            placeholderTextColor={colors.textSecondary}
                            value={cardExpiry}
                            onChangeText={(text) => {
                              let cleaned = text.replace(/[^\d/]/g, "");
                              if (
                                cleaned.length === 2 &&
                                !cleaned.includes("/")
                              ) {
                                cleaned = cleaned + "/";
                              }
                              if (cleaned.length > 5) {
                                cleaned = cleaned.slice(0, 5);
                              }
                              setCardExpiry(cleaned);
                            }}
                            keyboardType="numeric"
                          />
                        </View>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                          <Text style={styles.formLabel}>CVV</Text>
                          <TextInput
                            style={styles.formInput}
                            placeholder="CVV"
                            placeholderTextColor={colors.textSecondary}
                            value={cardCvv}
                            onChangeText={(text) => {
                              let cleaned = text.replace(/[^\d]/g, "");
                              if (cleaned.length > 3) {
                                cleaned = cleaned.slice(0, 3);
                              }
                              setCardCvv(cleaned);
                            }}
                            keyboardType="numeric"
                            secureTextEntry={true}
                          />
                        </View>
                      </View>
                      {cardErrors.length > 0 && (
                        <View style={{ marginTop: 8 }}>
                          {cardErrors.map((err, idx) => (
                            <Text
                              key={idx}
                              style={{
                                color: "red",
                                fontSize: 13,
                                marginBottom: 2,
                              }}
                            >
                              {err}
                            </Text>
                          ))}
                        </View>
                      )}
                      <TouchableOpacity
                        style={[
                          styles.confirmBookingButton,
                          {
                            marginTop: 16,
                            backgroundColor: colors.button,
                            borderRadius: 8,
                          },
                        ]}
                        onPress={handleSubmitCard}
                        disabled={cardSubmitting}
                      >
                        {cardSubmitting ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={styles.confirmBookingButtonText}>
                            Submit Payment Details
                          </Text>
                        )}
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.confirmBookingButton}
              onPress={handleConfirmBooking}
              disabled={bookingSubmitting}
            >
              {bookingSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmBookingButtonText}>
                  Confirm Booking
                </Text>
              )}
            </TouchableOpacity>
            {/* Show error below button if missing fields */}
            {confirmBookingError ? (
              <Text
                style={{
                  color: "red",
                  textAlign: "left",
                  marginTop: -20, // Move error even higher, closer to button
                  marginBottom: 10,
                  paddingBottom: 10,
                  paddingLeft: 20,
                }}
              >
                {confirmBookingError}
              </Text>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  function renderPaymentMethodModal(): React.ReactNode {
    const hasCardErrors = cardErrors && cardErrors.length > 0;
    const cleanNumber = cardNumber.replace(/\s+/g, "");
    const isValid =
      /^\d{13,19}$/.test(cleanNumber) &&
      !!cardName.trim() &&
      /^\d{2}\/\d{2}$/.test(cardExpiry) &&
      /^\d{3,4}$/.test(cardCvv);
    // Calculate keyboardVerticalOffset for both platforms
    const statusBarHeight =
      typeof StatusBar?.currentHeight === "number"
        ? StatusBar.currentHeight
        : Platform.OS === "ios"
          ? 64
          : 0;
    const keyboardVerticalOffset =
      Platform.OS === "ios" ? statusBarHeight + 60 : statusBarHeight + 300;
    return (
      <Modal
        visible={showPaymentMethodModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closePaymentModal}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={keyboardVerticalOffset}
            enabled
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Insert payment method</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closePaymentModal}
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={theme === "light" ? colors.text : "white"}
                  />
                </TouchableOpacity>
              </View>

              {/* Only show card input boxes directly */}
              <ScrollView
                style={styles.modalContent}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "center",
                  paddingBottom: 300, // Extra space for keyboard
                }}
                keyboardShouldPersistTaps="always"
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.formLabel}>Card number</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={colors.textSecondary}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                />

                <Text style={styles.formLabel}>Name on card</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Cardholder name"
                  placeholderTextColor={colors.textSecondary}
                  value={cardName}
                  onChangeText={setCardName}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.formLabel}>Expiry (MM/YY)</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="MM/YY"
                      placeholderTextColor={colors.textSecondary}
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.formLabel}>CVV</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="123"
                      placeholderTextColor={colors.textSecondary}
                      value={cardCvv}
                      onChangeText={setCardCvv}
                      keyboardType="numeric"
                      secureTextEntry={true}
                    />
                  </View>
                </View>

                {/* Errors */}
                {hasCardErrors &&
                  cardErrors.map((err, i) => (
                    <Text key={i} style={{ color: "red", marginTop: 6 }}>
                      {err}
                    </Text>
                  ))}

                <View style={{ marginTop: 16 }}>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      !isValid && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmitCard}
                    disabled={!isValid || cardSubmitting}
                  >
                    {cardSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Use this card</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
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
              name={saved ? "heart" : "heart-outline"}
              size={24}
              color={saved ? "#FF0000" : "white"}
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
        contentContainerStyle={{ paddingBottom: keyboardOpen ? 500 : 100 }}
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
      {renderPropertyDatesModal()}
      {renderImageModal()}
      {renderMapModal()}
      {renderReviewsModal()}
      {renderFacilitiesModal()}

      {renderDescriptionModal()}
      {renderReviewsSummaryModal()}
      {renderQuestionFormModal()}
      {renderPropertyDatesModal()}
      {renderPropertyGuestsModal()}
      {renderBookingSummaryModal(keyboardOpen)}
      {renderPaymentMethodModal()}
      {renderPaymentConfirmationModal()}

      {/* Fixed Book Now Button */}
      <View style={styles.fixedBookingButton}>
        <TouchableOpacity style={styles.bookNowButton} onPress={handleBookNow}>
          <Text style={styles.bookNowButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
