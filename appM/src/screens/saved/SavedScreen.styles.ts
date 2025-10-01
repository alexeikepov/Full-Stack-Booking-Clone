import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const createStyles = (
  colors: {
    text: any;
    textSecondary?: string;
    background: any;
    card?: string;
    button?: string;
    accent?: string;
    tint?: string;
    icon: any;
    tabIconDefault?: string;
    tabIconSelected?: string;
    inputBackground?: string;
    separator?: string;
    red?: string;
    yellow?: string;
    green?: string;
    blue?: string;
    purple?: string;
    pink?: string;
    teal?: string;
    gray?: string;
  },
  theme: string,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      backgroundColor: theme === "dark" ? colors.background : colors.blue,
      marginBottom: 12,
      position: "relative",
    },
    savedTitle: {
      color: theme === "dark" ? colors.text : colors.background,
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      flex: 1,
    },
    plusIconContainer: {
      padding: 8,
      position: "absolute",
      right: 16,
    },
    tabsContainer: {
      flexDirection: "row",
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingBottom: 16,
      gap: 8,
    },
    tab: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: theme === "dark" ? 0 : 1,
      borderColor: theme === "dark" ? colors.text : colors.blue,
    },
    activeTab: {
      backgroundColor: theme === "dark" ? colors.background : colors.blue,
      borderWidth: theme === "dark" ? 1 : 0,
      borderColor: theme === "dark" ? colors.text : "transparent",
    },
    tabText: {
      color: theme === "dark" ? colors.text : colors.blue,
      marginLeft: 6,
      fontWeight: "bold",
    },
    contentContainer: {
      paddingHorizontal: 16,
    },
    emptyAlertsContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    illustration: {
      width: width * 0.6,
      height: width * 0.4,
      resizeMode: "contain",
      marginBottom: 16,
    },
    titleText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitleText: {
      fontSize: 14,
      color: colors.icon,
      textAlign: "center",
      marginBottom: 16,
    },
    searchButton: {
      backgroundColor: "#007AFF",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    buttonText: {
      color: colors.background,
      fontWeight: "bold",
      fontSize: 16,
    },
  });
