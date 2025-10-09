import { StyleSheet } from "react-native";

export const createStyles = (
  colors: {
    background: string;
    blue: string;
    text: string;
    textSecondary: string;
    card: string;
    button: string;
  },
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
      backgroundColor: theme === "light" ? colors.blue : colors.card,
    },
    modalHeaderText: {
      color: theme === "light" ? "white" : colors.text,
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
      width: 250,
      height: 250,
      resizeMode: "contain",
    },
    infoContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      marginHorizontal: 16,
      marginTop: 20,
      padding: 16,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      flex: 1,
      lineHeight: 20,
    },
    blueButton: {
      backgroundColor: "#007AFF",
      borderRadius: 8,
      paddingVertical: 16,
      alignItems: "center",
      marginHorizontal: 16,
      marginTop: 20,
    },
    blueButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    faqTab: {
      alignItems: "center",
      paddingHorizontal: 10,
      paddingBottom: 5,
    },
    faqTabText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    faqItem: {
      flexDirection: "column",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
    },
    faqItemText: {
      fontSize: 16,
      color: colors.text,
    },
    faqAnswer: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
    },
    // Notification styles
    modalHeaderTitle: {
      color: theme === "light" ? "white" : colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },
    markAllButton: {
      padding: 4,
    },
    markAllText: {
      fontSize: 14,
      fontWeight: "600",
    },
    notificationsList: {
      flex: 1,
    },
    notificationItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
    },
    notificationHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    notificationIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 4,
    },
    notificationTime: {
      fontSize: 12,
    },
    removeButton: {
      padding: 4,
      marginLeft: 8,
    },
    // Message styles
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    messagesList: {
      flex: 1,
    },
    messageItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
    },
    messageHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    messageAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    avatarText: {
      fontSize: 20,
    },
    messageContent: {
      flex: 1,
    },
    messageTopRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    messageSender: {
      fontSize: 16,
      fontWeight: "600",
      marginRight: 8,
    },
    messageRole: {
      fontSize: 12,
      marginRight: 8,
      backgroundColor: colors.card,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    messageTime: {
      fontSize: 12,
      marginLeft: "auto",
    },
    messageProperty: {
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 2,
    },
    messageSubject: {
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 4,
    },
    messageText: {
      fontSize: 14,
      lineHeight: 18,
    },
  });
